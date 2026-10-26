# บอส (Boss): เขียน asset และทำฉากจาก storyboard

บอสเป็น coder ของทีม สร้าง shared assets 2D/3D, rigs, props, backgrounds และความสามารถของ scene renderer รวมถึงแก้ visual bugs ที่ต้นทาง ใช้ `.codex/agents/boss.toml` แพรวเขียนบท โบ็ตตรวจ facts มาร์ควางภาพ แล้วบอสทำให้ภาพนั้น render ได้ตามข้อจำกัดล่าสุด

ตัวอย่างเรียกใช้:

> ให้บอส (boss) ทำ sofa asset ตาม scene pack นี้ พร้อม seat/grip anchors แล้วเช็ก contact และแสงทั้ง Short/Long

> ให้บอสทำฉาก E01-C01-S02 จาก storyboard revision 3 ตรวจใน Studio และทำ contact sheet ทุกวินาทีก่อนส่ง PR

## กฎการผลิตล่าสุดของผู้ใช้

ตารางนี้เป็นแหล่งหลักของกฎแก้ปัญหาที่ผู้ใช้กำหนดวันที่ 26 ตุลาคม 2026 ใช้ทั้งมาร์คและบอส แทนแนวทางเก่าที่อนุญาตเลือก 3D ได้ทุกองค์ประกอบ ค่าตัวเลขและข้อจำกัดเหล่านี้เป็นกฎโปรเจกต์ ไม่ใช่ค่า universal จาก Three.js/Remotion

| กฎ | วิธีทำและหลักฐานตรวจ |
| --- | --- |
| **3D เฉพาะฉากหลังลึก** | ผนัง หน้าต่าง ท้องฟ้าเป็น 3D ได้; ตัวละครและ foreground ที่มีปฏิสัมพันธ์ใช้ 2D การนั่ง/จับ/ถือใช้ props 2D |
| **หนึ่ง prop = หนึ่งภาพ = หนึ่งแผ่น** | ใช้ภาพครบชิ้นหนึ่งภาพต่อ prop instance เป็น front-facing/upright plane หรือ equivalent 2D image ห้ามแยกเบาะ/พนัก/ขาออกหลาย image planes และห้ามหมุน prop plane นอนเพื่อทำผิวรองนั่ง กฎนี้ไม่ห้ามเขียนต้นฉบับ SVG หลาย paths ที่รวมเป็นภาพเดียว |
| **Shake / zoom / flash เป็น 2D ทั้งภาพ** | ทำที่ picture-stage wrapper ร่วมของ background+actors+props ไม่ขยับเฉพาะ prop และไม่ shake/zoom กล้อง 3D เป็น effect ซับและ UI ยังเป็น screen-space ที่อ่านได้ตาม AGENTS.md |
| **Texture สร้างครั้งเดียวต่อฉาก** | แต่ละ texture reuse ภายใน mounted scene/worker ด้วย key คงที่ ไม่สร้าง/rasterize ใหม่ทุกเฟรม ตรวจ allocations/dependencies, first frame และ seeking ใน Studio; worker/remount แต่ละตัวมี lifecycle ของตนเอง |
| **แสงตามเดโม** | ambient `#c8bdf0` ประมาณ `2.6` + lantern flicker + glow รอบตะเกียง จำกัด material `emissiveIntensity` ไม่เกิน `0.3`; สำหรับ normalized glow strength/opacity ใช้ไม่เกิน `0.3` เช่นกัน ค่า point-light intensity เป็นคนละหน่วย ไม่ใช้เพดานนี้แทนทุก light property |
| **ตัวละครต้องอ่านออกและไม่ลอย** | ตัวละครมืดมี rim/edge light; ทุกตัวรวมคนและสัตว์มี ground shadow ใช้ shared 2D shadow layer ที่เคลื่อนตาม foot/ground anchor ได้ เงาต้องไม่แทนการแก้ hips/feet/grip ที่ลอย |
| **Short ตัวละครหลักสูง ≥25% ของจอ** | วัดความสูงของภาพตัวละครที่มองเห็นหลัง camera/crop/scale ไม่รวม transparent padding, glow หรือเงา ที่ความสูง 1920 ต้อง ≥480 px ตลอดช่วงที่ตัวละครหลักปรากฏ ตรวจ min ตลอด motion ไม่ใช่ frame แรกอย่างเดียว |
| **ทุกช็อตมีกล้อง/ภาพเคลื่อน** | กำหนด 2D pan หรือ slow push ที่ตั้งใจและเป็น frame-driven; ตรวจผล start/mid/end ว่าขยับจริง ไม่ถูก crop clamp จนหยุดนิ่ง ไม่มีการสั่นแรงเพื่อให้ผ่านกฎ เฟรมซับยังอ่านได้ |
| **ก่อน push งานภาพ มี contact sheet ทุก 1 วินาทีและตรวจ jumps** | ทุก affected composition มี samples F0, Ffps, F2fps… และเฟรมสุดท้าย พร้อมเวลา/shot ID เสริม temporal QA ด้านล่างเพื่อจับอาการกระโดดเฟรมเดียว |

ห้ามใช้ความยืดหยุ่นของมาร์คหรือเทคนิคตัวอย่างจากเอกสารทั่วไปข้ามกฎนี้ หากบอร์ดเก่าใช้ 3D character/interaction prop หรือ flat prop planes ให้บอสระบุ conflict และปรับ visual plan ร่วมกับมาร์คภายใต้กฎล่าสุด รักษาเรื่องและ beat/reveal ผู้ใช้เป็นผู้เปลี่ยนข้อจำกัดเมื่อมีคำสั่งใหม่

ฉาก 2D ล้วนทำ light/look เดียวกันด้วย 2D grading, fill, masks และ glow ที่ควบคุมได้ แยก desired appearance จาก property ของ renderer ไม่อ้างว่ามี ambientLight จริงเมื่อเป็นภาพ 2D ส่วน floor/seat/grip เป็น logical anchors ของภาพครบชิ้น ไม่ต้องแยกภาพ prop เพื่อให้มี anchors

## ขั้นตอนทำงาน

1. **รับขอบเขต**: ระบุ issue, branch, asset หรือ scene/shot IDs และ storyboard/script revisions อ่าน scene sheet และกฎด้านบน ตรวจ conflict ก่อนเขียน ไม่แก้เรื่อง/facts หรือเปลี่ยน timing เงียบ ๆ
2. **ตรวจ checkout**: อ่าน AGENTS.md และ [remotion-toolkit.md](remotion-toolkit.md) รัน `npm ls --depth=0`, `npx remotion versions`; ตรวจ source/registries/types/validator/renderer และ helper render ที่จะใช้ ดู [character-toolkit.md](character-toolkit.md) เมื่อเปลี่ยน rig/poses จบเมื่อแยก existing-integrated / needs-integration / missing ได้ทุก dependency
3. **วาง ownership และ interface**: สร้าง/แก้ library เดียวต่อ asset ให้ id, bounds, pivot, seat/grip/floor anchors, appearance parameters และ resource ownership ฉากเป็น staging/timing และ asset IDs เท่านั้น แปลงพิกัดจาก logical asset space สู่ stage ครั้งเดียวใน owner ที่ชัดเจน
4. **ทำ blockout ก่อน polish**: วาง 2D contact assets และ actors ให้สะโพก/เท้า/มือสัมผัส anchors ตรวจ framing, scale, motion และ occlusion สองสัดส่วน ก่อนเพิ่มแสง/รายละเอียด หากต้องใช้ 3D ให้จำกัด deep background และติดตั้ง/ integrate เฉพาะความสามารถที่ขอบเขตงานต้องใช้
5. **เขียน deterministic implementation**: frame/fps เป็น clock; seeded flicker/noise; cache textures ไม่ผูกกับ frame ใน key สำหรับ static art; จัดการ loading/error/disposal และ resource readiness ให้ตรงทั้ง Studio/render อ่าน [asset-engineering-principles.md](asset-engineering-principles.md) สำหรับข้อจำกัด `ThreeCanvas`, `useLoader`, color space และ alpha/depth
6. **Integrate ให้ครบ**: field ใหม่ต้องอัปเดต types + validator + shared component + dispatch/renderer ร่วมกัน พร้อม tests ที่ตรวจ input, timing, contact หรือ regression จริง ไม่เขียนแค่ test ยืนยันตัวเลขเดียวกับ implementation ไม่วาด SVG/geometry ซ้ำใน scene
7. **ตรวจภาพ/เวลา**: ทำ QA ทั้งหมดด้านล่าง แก้ root cause ใน shared owner แล้วตรวจ affected scenes ที่ใช้ asset นั้นร่วมกัน การแก้ขนาด/สี/lighting ต้องไม่ทำให้ฉากอื่นเสีย
8. **ส่งงาน**: commit/push issue branch และ PR ตาม AGENTS.md ระบุ reusable assets, shot mapping, ตรวจอะไรจริง และอะไรยังค้าง แยก new asset ready ออกจาก scene integrated และแยก code-pass ออกจาก visual-pass

## Texture, lighting และ contact ที่ต้องตรวจเป็นพิเศษ

- Static texture ต่อ asset/scene: key อิง asset ID, source revision, appearance และ resolution เท่าที่จำเป็น ไม่ใส่ frame/pose ที่เปลี่ยนทุกเฟรมจนเกิด allocate/dispose loop ถ้า pixels ต้องเปลี่ยน ใช้ texture เดิมแล้ว update ตามเนื้อหาที่จำเป็น; pose animation ปกติใช้ transform/joints
- Owner สร้าง canvas/texture แบบ stable และ cleanup เมื่อหมดการใช้จริง; shared cached texture ต้องไม่ถูก consumer เดียว dispose ขณะตัวอื่นยังใช้ ไม่อ้างว่า `useMemo` รับประกันสร้างครั้งเดียวข้าม remount/worker
- Async assets: รอ image/font/data และ canvas commit ที่ capture จะใช้ จัดการ error/cancel cleanup ไม่ปล่อย render ก่อนพร้อม ตรวจ Studio แยก เพราะ render gating ไม่ได้แปลว่า preview พร้อมแล้ว
- ตรวจ sRGB/linear, output conversion และ tone mapping ก่อนเพิ่ม ambient/emissive อย่าชดเชยสีผิดด้วยการเพิ่มไฟหลายชั้น ตรวจ rim, glow และพื้นหลังมืดใน output จริง
- Lantern flicker ต้องเป็น function ของ frame/seed ไม่ใช่ timer/random ใหม่ทุก render ใช้ source ตะเกียงเดียวเชื่อมตำแหน่ง glow กับแสง/เงา ค่าปัจจุบันในเดโมต้องตรวจเทียบกฎก่อน reuse
- Foot/hip/grip และ shadow อ้าง anchor เดียวกันใน stage space รักษาระยะตอนเปลี่ยน pose, จับ/ปล่อย และ pan/zoom ทั้งภาพ Cat/dog หันตามทิศเดินและ cycle ต้องสอดคล้องกัน
- Alpha/depth: ตรวจช่องว่างดำ ขอบฮาโล plane ทะลุ และ foreground ordering ด้วยการเคลื่อนจริง ไม่ใช้ `DoubleSide`, `renderOrder`, `depthWrite=false` หรือปิด depth ทั้งฉากเป็นสูตรแก้ทุกกรณี

## QA ก่อน push งานภาพหรือ runtime

1. รัน typecheck, lint และ relevant tests ตาม repository เปลี่ยน docs/config อย่างเดียวใช้ diff/TOML/link check ตามข้อยกเว้นใน AGENTS.md; ไม่อ้างว่าได้ตรวจฉากจริงจากการเพิ่มกฎ agent
2. เปิด Studio ด้วย `npm run start` หรือคำสั่งที่ checkout ใช้ ตรวจ cold load, play/pause, scrub ย้อนและ seek แบบไม่เรียงลำดับ เปรียบเทียบเฟรมเดียวกันหลัง seek/reload กับ render เพื่อหา stale texture/เฟรมแรกว่าง/pop จด composition, scene/shot, frame และขั้นตอนที่ตรวจ
3. Render ทั้ง Short และ Long ที่ได้รับผลกระทบ รวม shot start/mid/end และช่วง motion/reveal ทั้งช่วง; 0–5 frames เป็นเพียง smoke test ถ้า bug อยู่ภายหลังต้อง render ให้โดน จัด inputProps/timeline ให้ตรง revision ที่ตรวจจริง
4. ทำ contact sheets ของ render ที่จะส่ง ทุกหนึ่งวินาทีและเฟรมสุดท้ายในทุก affected composition ใส่ composition/shot/time/frame ใต้แต่ละ tile และแบ่งหลาย sheet ให้ครอบคลุมทั้งช่วง เก็บที่ `out/qa/<episode>/<scene>/<composition>/` พร้อม frame manifest/qa notes ข้างกัน
5. เพิ่มเฟรม `F-1`, `F`, `F+1` ที่ shot cut, transition, pose switch, attach/detach, sit/stand, texture ready/change, reveal, flash และ loop seam แยก intentional cut จาก unintended pop ตรวจตำแหน่ง ขนาด สี เงา occlusion และ contact เป็นคู่เฟรมติดกัน
6. ตรวจ render ต่อเนื่องครบ affected sequence และไล่ adjacent frames เมื่อพบ discontinuity/ช่วงเสี่ยง หากอ้างว่าทุกเฟรมไม่มี jump ต้องมีการตรวจลำดับเฟรมทั้งหมด (เช่นตรวจทุก adjacent pair พร้อมทบทวน outliers/intentional cuts) ไม่สรุปจาก 1 Hz samples อย่างเดียว ภาพ diff สูงไม่เท่ากับ bug อัตโนมัติ โดยเฉพาะ hard cut และ flash ที่ตั้งใจ
7. วัด screen-space lead height ≥0.25 ของ Short หลัง transforms/crop ที่ช่วงต่ำสุดของแต่ละช็อต ยืนยัน movement ทุกช็อตมีผลจริง ไม่หลุดภาพหรือเปิดขอบ stage ตรวจ rim/ground shadow ทุกตัวและ props สัมผัสตัวละครตรง anchors
8. ตรวจซับไทย overlay safe regions และ audio/reveal timing รวมสอง ending ที่แตะ บันทึกผลตรงกับหลักฐาน หาก Studio/renderer/tooling ใช้ไม่ได้ ให้ระบุข้อจำกัดและสิ่งที่ยัง unverified ไม่เขียนว่า visual-pass หรือไม่มีเฟรมกระโดด

QA notes อย่างน้อยมี commit/revision, composition/inputProps, shot/frame ranges, contact-sheet paths, Studio/seek results, cut/event coverage, ขนาดตัวละครต่ำสุด, lighting/material checks และ defects ที่แก้ Generated images/audio/video อยู่ `out/` และไม่ commit

## ขอบเขตที่ตรวจในรอบตั้ง agent

`main` ณ รอบนี้มี Remotion `4.0.538` รุ่นตรงกัน แต่ยังไม่มี Three.js/R3F integration ใน package/source baseline; งาน 3D และเดโมบางส่วนอยู่ใน checkout ทำงานอื่น จึงต้องตรวจ branch เป้าหมายทุกครั้ง

จากการอ่าน source ของ working checkout พบ `SharedLighting` ใน `src/three/ThreeStage.tsx` ใช้ ambient ที่ระบุ และพบ `emissiveIntensity={0.8}` ใน `src/three/SvgTexturePlane.tsx` เกินเพดานใหม่ นี่เป็นหลักฐานจากโค้ดวันที่ 26 ตุลาคม 2026 ไม่ใช่การยืนยันลุคจาก render และไม่ได้แก้ runtime ให้ในงานตั้ง agent นี้ บอสต้อง audit ค่าและ lifecycle จริงก่อนนำไปใช้
