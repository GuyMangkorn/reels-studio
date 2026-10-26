# บอส (Boss): เขียน asset และทำฉากจาก storyboard

บอสเป็น coder ของทีม สร้าง shared assets 2D/3D, rigs, props, backgrounds และความสามารถของ scene renderer รวมถึงแก้ visual bugs ที่ต้นทาง ใช้ `.codex/agents/boss.toml` แพรวเขียนบท โบ็ตตรวจ facts [ฟิล์มวาง visual/technical brief](film-visual-brief-workflow.md) มาร์คแตกบอร์ด แล้วบอสทำให้ภาพนั้น render ได้ตามแผนที่ตรวจจริง

เมื่อสร้าง/แก้/import/export assets หรือผลิต rendered shots ด้วย Blender MCP อ่าน [blender-mcp-workflow.md](blender-mcp-workflow.md) บอสเป็นเจ้าของ shared sources/scripts/manifests, export contract และการนำเข้า Remotion ตรวจการเชื่อมต่อจริงก่อนแก้ฉาก และตรวจ source → export → runtime → visual แยกสถานะตามหลักฐาน

ตัวอย่างเรียกใช้:

> ให้บอส (boss) ทำ sofa asset ตาม scene pack นี้ พร้อม seat/grip anchors แล้วเช็ก contact และแสงทั้ง Short/Long

> ให้บอสทำฉาก E01-C01-S02 จาก storyboard revision 3 ตรวจใน Studio และทำ contact sheet ทุกวินาทีก่อนส่ง PR

## กฎการผลิตล่าสุดของผู้ใช้

ตารางนี้เป็นแหล่งหลักของกฎผู้ใช้ อัปเดต 26 ตุลาคม 2026 หลังผู้ใช้ยกเลิกข้อจำกัด 3D เฉพาะฉากหลังและบังคับตัวละคร/interaction props เป็น 2D ให้ Film เลือกตามความเหมาะสมและ feasibility ใช้กับ Film, Mark และ Boss กฎเรื่อง medium/prop-plane/effect-stage เดิมถูกแทนด้วยการตัดสินใจด้านล่าง ส่วน lifecycle, demo lighting, contact/scale และ QA ยังใช้ ค่าตัวเลขเป็นกฎโปรเจกต์ ไม่ใช่ค่า universal จาก Three.js/Remotion

| กฎ | วิธีทำและหลักฐานตรวจ |
| --- | --- |
| **เลือก 2D / 3D / hybrid ตามเรื่องและเทคนิค** | ใช้ได้กับ set, character, prop และ effect; Film บันทึกเหตุผลและวิธีผสานใน brief, Mark แตกบอร์ด, Boss พิสูจน์ implementation; ตรวจ dependencies/API และสองสัดส่วนก่อนอ้างว่าใช้ได้ |
| **Prop เป็น shared asset ตาม representation ที่เลือก** | ใช้ภาพครบชิ้น, layered planes หรือ geometry ได้ตามภาพ/มุม/interaction ที่ต้องการ กำหนด bounds/pivots/seat/grip anchors; ตรวจ contact, occlusion และ texture cost แทนบังคับหนึ่งภาพหนึ่งแผ่น |
| **ขนาดจริงก่อน perspective** | ใช้ [หลักสัดส่วนและ perspective](scale-and-perspective-principles.md): กำหนด canonical dimensions/units และ anchors ใน shared library เทียบคน–สัตว์–เฟอร์นิเจอร์–ของถือก่อนจัดกล้อง แล้วใช้ projection owner เดียว ตรวจ calibration, near/far, depth motion และ contact ทั้ง Short/Long |
| **Effects และ camera มีเจ้าของ transform ชัดเจน** | เลือก picture-stage pan/zoom/shake/flash หรือ spatial camera ตาม beat; ระบุสิ่งที่ขยับและสิ่งที่คงใน screen space ไม่ขยับซ้ำจน contact/เงาหลุด ซับและ UI ต้องอ่านได้ |
| **Texture สร้างครั้งเดียวต่อฉาก** | แต่ละ texture reuse ภายใน mounted scene/worker ด้วย key คงที่ ไม่สร้าง/rasterize ใหม่ทุกเฟรม ตรวจ allocations/dependencies, first frame และ seeking ใน Studio; worker/remount แต่ละตัวมี lifecycle ของตนเอง |
| **แสงตามเดโม** | ambient `#c8bdf0` ประมาณ `2.6` + lantern flicker + glow รอบตะเกียง จำกัด material `emissiveIntensity` ไม่เกิน `0.3`; สำหรับ normalized glow strength/opacity ใช้ไม่เกิน `0.3` เช่นกัน ค่า point-light intensity เป็นคนละหน่วย ไม่ใช้เพดานนี้แทนทุก light property |
| **ตัวละครต้องอ่านออกและไม่ลอย** | ตัวละครมืดมี rim/edge light; ทุกตัวรวมคนและสัตว์มี ground shadow เลือก real/fake shadow หรือ shared 2D layer ตาม brief และให้สัมพันธ์กับ foot/ground anchor เงาต้องไม่แทนการแก้ hips/feet/grip ที่ลอย |
| **Short ตัวละครหลักสูง ≥25% ของจอ** | วัดความสูงของภาพตัวละครที่มองเห็นหลัง camera/crop/scale ไม่รวม transparent padding, glow หรือเงา ที่ความสูง 1920 ต้อง ≥480 px ตลอดช่วงที่ตัวละครหลักปรากฏ ตรวจ min ตลอด motion ไม่ใช่ frame แรกอย่างเดียว แก้ด้วย framing/camera/staging ที่รักษาขนาดจริงสัมพันธ์กับ set/props; หากขัดกับ wide/reveal ส่ง Film/Mark ปรับ shot ตามคู่มือสัดส่วน |
| **ทุกช็อตมีกล้อง/ภาพเคลื่อน** | กำหนด picture pan/push หรือ spatial camera move ที่ตั้งใจและเป็น frame-driven ตาม brief; ตรวจผล start/mid/end ว่าขยับจริง ไม่ถูก crop clamp จนหยุดนิ่ง ไม่มีการสั่นแรงเพื่อให้ผ่านกฎ เฟรมซับยังอ่านได้ |
| **ก่อน push งานภาพ มี contact sheet ทุก 1 วินาทีและตรวจ jumps** | ทุก affected composition มี samples F0, Ffps, F2fps… และเฟรมสุดท้าย พร้อมเวลา/shot ID เสริม temporal QA ด้านล่างเพื่อจับอาการกระโดดเฟรมเดียว |

บอร์ดเดิมที่เลือก 2D ยังใช้ได้ ไม่ต้องแปลงเป็น 3D ทั้งหมด เมื่อเทคนิคใหม่เหมาะกว่า ให้บอสสะท้อนข้อจำกัด/ผลทดลองกลับ Film และ Mark แล้วปรับ brief/board revision ให้ตรงกัน รักษาเรื่องและ beat/reveal ไม่ถือว่ากฎเก่าบังคับ medium ต่อไป และไม่ถือว่าการอนุญาตเท่ากับ feature integrate แล้ว

ฉาก 2D ล้วนทำ light/look ด้วย grading, fill, masks และ glow ที่ควบคุมได้ แยก desired appearance จาก property ของ renderer ไม่อ้างว่ามี ambientLight จริงเมื่อเป็น DOM/SVG ฉาก hybrid ต้องระบุ composition strategy, coordinate/camera mapping, depth/alpha และ light/shadow ของแต่ละ representation ตาม [technical BA ของ Film](film-visual-brief-workflow.md#technical-ba-ต้องตอบอะไรเมื่อผสม-2d-กับ-threejs) Floor/seat/grip เป็น logical anchors ของ asset ไม่ขึ้นกับจำนวน image planes หรือ geometry

## โครงรวมก่อน polish รายฉาก

ใช้กฎ **Shared sequence and continuity** ใน [AGENTS.md](../AGENTS.md#shared-sequence-and-continuity) เป็นหลัก อ่าน episode index, scene sheets และฉากข้างเคียงก่อนแยกงาน โดยแบ่งความรับผิดชอบดังนี้:

| ส่วน | บอสต้องส่งอะไร |
| --- | --- |
| Shared elements | Library module/capability เดียวต่อองค์ประกอบ พร้อม stable identity, appearance interface, logical bounds/pivots/anchors และพิกัดที่ตกลงกับมาร์ค; ระบุ consumers และสถานะใน index |
| Sequence blockout | Executable timeline ครบช่วงที่รับทำ ใช้ shared placeholders ที่มีสเกล/contact ใกล้ของจริง เก็บ timing/reveal และเปิดเล่นต่อกันได้ใน Short/Long ก่อน polish |
| Scene integration | แทน placeholder และจัด staging/timing ด้วย library เดิม อัปเดต timeline รวมกับ shot mapping ใน PR เดียวกัน |
| Boundary evidence | Entry/exit ที่ทำจริง, composition audio offsets และผลตรวจรอยต่อกับฉากข้างเคียง พร้อมระบุสิ่งที่ยัง unverified |

ตรวจ `Root`, types, validator และ renderer ก่อนเลือกวิธีประกอบ timeline ถ้า checkout ยังโหลด array ไฟล์เดียว ให้ใช้รูปแบบนั้นก่อน การแยก source รายฉากต้องมี assembly path ที่ deterministic และทดสอบแล้วก่อนใช้งาน ไม่เพิ่ม `entry`/`exit`, preset หรือ include/import fields ลง JSON เพียงเพราะเอกสารออกแบบไว้

สถานะข้ามฉากต้องคำนวณจาก authored data และ frame ที่ seek ได้โดยตรง เช่น actor ID เดิมพร้อมตำแหน่ง/appearance ที่ระบุสอดคล้องกัน ใช้ supported fields ก่อน; หากต้องขยาย state resolution ให้ทำเป็น shared capability ครบ types/validation/renderer และ regression tests หลีกเลี่ยงการสืบทอด mutable state ที่ต้องเล่นฉากก่อนจึงถูกต้อง

ก่อน polish บันทึก blockout revision, timeline/input props, scene/shot mapping, placeholders, ผลตรวจต่อเนื่องสองสัดส่วน และปัญหาค้างใน index/QA notes หากเพื่อนบ้านยังไม่มี ให้ใช้ boundary placeholder ที่ติดป้ายหรือบันทึก gap เป็น unverified โดยไม่อ้าง continuity pass งานฉากเดียวทำเท่าที่จำเป็นกับรอยต่อ; asset-only/bug fix เฉพาะจุดใช้ consumers ที่ได้รับผลกระทบ ไม่ต้อง blockout ทั้งตอนใหม่

Foundation/capability PR ต้อง merge ก่อนเริ่ม branch ของฉากที่พึ่งมันจาก `main` ล่าสุด แยก issue ตาม dependency แทนคัดลอก foundation ไปทุก branch เมื่อแก้ interface ร่วม ให้ปรับ consumers และตรวจ regression ในขอบเขตที่ได้รับผลกระทบ การจบฉากกลาง sequence ใช้ cut/transition ตามบอร์ด ส่วน fade/loop ใช้ที่ปลาย output ที่จะเผยแพร่

## ขั้นตอนทำงาน

อ่านและอัปเดต [dev findings](dev-findings.md) ตามวงจรในเอกสารนั้นเมื่อพบ blocker, workaround หรือบทเรียนที่กระทบการเลือกเทคนิค/ออกแบบช็อต จดระหว่าง dev/blockout/QA และทบทวนสถานะก่อน PR; ใช้ finding IDs ส่งผลกลับ Film/Mark พร้อมลิงก์ brief/board ที่ได้รับผล

1. **รับขอบเขต**: ระบุ issue, branch, asset หรือ scene/shot IDs และ script/visual-brief/storyboard revisions อ่าน episode index, brief decision IDs, scene sheet และ entry/exit ของฉากข้างเคียง จัดงานเป็น foundation/blockout หรือ scene integration/polish พร้อม dependencies ตรวจ conflict ก่อนเขียน ไม่แก้เรื่อง/facts หรือเปลี่ยน timing เงียบ ๆ
2. **ตรวจ checkout**: อ่าน AGENTS.md และ [remotion-toolkit.md](remotion-toolkit.md) รัน `npm ls --depth=0`, `npx remotion versions`; ตรวจ source/registries/types/validator/renderer และ helper render ที่จะใช้ ดู [character-toolkit.md](character-toolkit.md) เมื่อเปลี่ยน rig/poses จบเมื่อแยก existing-integrated / needs-integration / missing ได้ทุก dependency
3. **วาง ownership และ interface**: สร้าง/แก้ library เดียวต่อ asset ให้ id, bounds, pivot, seat/grip/floor anchors, appearance parameters และ resource ownership ฉากเป็น staging/timing และ asset IDs เท่านั้น แปลงพิกัดจาก logical asset space สู่ stage ครั้งเดียวใน owner ที่ชัดเจน
4. **ทำ blockout ต่อเนื่องก่อน polish**: ประกอบทุกฉากของ sequence ที่รับทำตามหัวข้อด้านบน ใช้ representation ตาม Film/Mark วาง actors/props ให้สะโพก/เท้า/มือสัมผัส anchors ตรวจ framing, scale, motion, occlusion, timing/reveal และรอยต่อสองสัดส่วน โดยเฉพาะการผสาน 2D/3D บันทึกหลักฐานก่อนเพิ่มรายละเอียดรายฉาก ติดตั้ง/integrate เฉพาะความสามารถที่ขอบเขตงานต้องใช้
5. **เขียน deterministic implementation**: frame/fps เป็น clock; seeded flicker/noise; cache textures ไม่ผูกกับ frame ใน key สำหรับ static art; จัดการ loading/error/disposal และ resource readiness ให้ตรงทั้ง Studio/render อ่าน [asset-engineering-principles.md](asset-engineering-principles.md) สำหรับข้อจำกัด `ThreeCanvas`, `useLoader`, color space และ alpha/depth
6. **Integrate ให้ครบ**: field ใหม่ต้องอัปเดต types + validator + shared component + dispatch/renderer ร่วมกัน พร้อม tests ที่ตรวจ input, timing, contact หรือ regression จริง ไม่เขียนแค่ test ยืนยันตัวเลขเดียวกับ implementation ไม่วาด SVG/geometry ซ้ำใน scene
7. **ตรวจภาพ/เวลา**: ทำ QA ทั้งหมดด้านล่าง แก้ root cause ใน shared owner แล้วตรวจ affected scenes ที่ใช้ asset นั้นร่วมกัน การแก้ขนาด/สี/lighting ต้องไม่ทำให้ฉากอื่นเสีย
8. **ส่งงาน**: commit/push issue branch และ PR ตาม AGENTS.md ระบุ reusable assets, shot mapping, ตรวจอะไรจริง และอะไรยังค้าง พร้อม finding IDs ที่เพิ่ม/อัปเดตและผลที่ Film/Mark ต้องใช้ต่อ แยก new asset ready ออกจาก scene integrated และแยก code-pass ออกจาก visual-pass

## Texture, lighting และ contact ที่ต้องตรวจเป็นพิเศษ

ก่อนสร้าง/ปรับขนาด asset หรือ implement depth staging อ่าน [หลักสัดส่วนและ perspective](scale-and-perspective-principles.md) ใช้ physical baseline และ camera contract จาก brief/scene sheet แล้วเก็บ dimensions/anchors และ projection ใน shared owner เมื่อ baseline หรือ projection ยังไม่มีใน checkout ให้ระบุสถานะและเพิ่มผ่าน contract/validation/renderer ก่อนใช้ใน timeline; ช่องในเอกสารไม่ใช่ JSON API ที่มีแล้ว

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
6. ตรวจ render ต่อเนื่องครบ affected sequence จาก timeline รวม โดยรวมฉากก่อน → ฉากที่แก้ → ฉากถัดไปเมื่อมี ตรวจ entry/exit, actor IDs/appearance, ตำแหน่ง/ทิศหัน/pose/contact, prop state, lighting และ composition audio offsets ตามบอร์ด หากขาดเพื่อนบ้านให้ระบุ boundary unverified และ follow-up แยก intentional cut/time jump จาก defect; ตรวจ consumers ที่ได้รับผลกระทบเมื่อเปลี่ยน shared asset/interface และไล่ adjacent frames เมื่อพบ discontinuity/ช่วงเสี่ยง หากอ้างว่าทุกเฟรมไม่มี jump ต้องมีการตรวจลำดับเฟรมทั้งหมด (เช่นตรวจทุก adjacent pair พร้อมทบทวน outliers/intentional cuts) ไม่สรุปจาก 1 Hz samples อย่างเดียว ภาพ diff สูงไม่เท่ากับ bug อัตโนมัติ โดยเฉพาะ hard cut และ flash ที่ตั้งใจ
7. วัด screen-space lead height ≥0.25 ของ Short หลัง transforms/crop ที่ช่วงต่ำสุดของแต่ละช็อต ยืนยัน movement ทุกช็อตมีผลจริง ไม่หลุดภาพหรือเปิดขอบ stage ตรวจ rim/ground shadow ทุกตัวและ props สัมผัสตัวละครตรง anchors เมื่อเปลี่ยนขนาด/projection เพิ่ม calibration และ near/far/depth-motion checks ตามคู่มือสัดส่วน พร้อม physical/projected measurements หรือ unverified; เกณฑ์ขนาดบนจอไม่ใช่เหตุให้พอง actor แยกจากสิ่งแวดล้อม
8. ตรวจซับไทย overlay safe regions และ audio/reveal timing รวมสอง ending ที่แตะ บันทึกผลตรงกับหลักฐาน หาก Studio/renderer/tooling ใช้ไม่ได้ ให้ระบุข้อจำกัดและสิ่งที่ยัง unverified ไม่เขียนว่า visual-pass หรือไม่มีเฟรมกระโดด

QA notes อย่างน้อยมี commit/revision, executable timeline, composition/inputProps, shot/frame ranges, blockout/placeholder status, neighboring scene IDs และ boundary results, contact-sheet paths, Studio/seek results, cut/event coverage, ขนาดตัวละครต่ำสุด, lighting/material checks และ defects ที่แก้ Generated images/audio/video อยู่ `out/` และไม่ commit

## ขอบเขตที่ตรวจในรอบตั้ง agent

`main` ณ รอบนี้มี Remotion `4.0.538` รุ่นตรงกัน แต่ยังไม่มี Three.js/R3F integration ใน package/source baseline; งาน 3D และเดโมบางส่วนอยู่ใน checkout ทำงานอื่น จึงต้องตรวจ branch เป้าหมายทุกครั้ง

จากการอ่าน source ของ working checkout พบ `SharedLighting` ใน `src/three/ThreeStage.tsx` ใช้ ambient ที่ระบุ และพบ `emissiveIntensity={0.8}` ใน `src/three/SvgTexturePlane.tsx` เกินเพดานใหม่ นี่เป็นหลักฐานจากโค้ดวันที่ 26 ตุลาคม 2026 ไม่ใช่การยืนยันลุคจาก render และไม่ได้แก้ runtime ให้ในงานตั้ง agent นี้ บอสต้อง audit ค่าและ lifecycle จริงก่อนนำไปใช้
