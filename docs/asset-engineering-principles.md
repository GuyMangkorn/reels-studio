# บอส (Boss): หลักเทคนิคสำหรับ assets 2D/3D ที่นำกลับมาใช้ได้

ตรวจแหล่งวันที่ 26 ตุลาคม 2026 — หลักอ้างอิงสำหรับบอส ไม่ใช่หลักฐานว่า runtime ปัจจุบันแก้แล้ว อ่านขั้นตอนและกฎการผลิตใน [boss-asset-workflow.md](boss-asset-workflow.md)

## 1. ข้อกำหนดผู้ใช้กับหลักทั่วไป

ข้อจำกัด 3D/2D, หนึ่ง prop หนึ่งภาพ/แผ่น, แสงเดโม, emissive/glow cap, ขนาดตัวละคร และ contact sheet เป็นกฎโปรเจกต์ แหล่งหลักคือ [กฎการผลิตล่าสุด](boss-asset-workflow.md#กฎการผลิตล่าสุดของผู้ใช้) เอกสารด้านล่างอธิบายหลักเทคนิค ไม่ใช้ตัวอย่างทั่วไปจาก Three.js ข้ามกฎของผู้ใช้

## 2. Frame determinism และการ seek

Remotion ระบุให้ใช้ `useCurrentFrame()` สร้าง animation ของ `<ThreeCanvas>` แบบ declarative แทน R3F `useFrame` เพื่อให้ pause และ scrub ย้อนกลับได้ ดังนั้น flicker, shake, image movement, pose และแสงควรคำนวณจาก frame/fps และ seed ที่คงที่ ไม่สะสม `delta` จากเฟรมก่อน ไม่อิง wall-clock และไม่สุ่มใหม่ทุก render

ข้อเสนอ QA: เปิดเฟรมเดียวกันจากก่อนหน้า หลังจาก seek ย้อน และหลัง reload แล้วเทียบภาพ ความเหมือนนี้คือ contract ที่ควรรักษา ไม่สมมติว่า Remotion จะ render ทุกเฟรมตามลำดับ

แหล่ง: [Remotion — ThreeCanvas](https://www.remotion.dev/docs/three-canvas)

## 3. Async readiness ต้องแยก Studio กับ render

Remotion ระบุว่า `delayRender()` หยุด final render จนงาน async เสร็จและ `continueRender(handle)` ถูกเรียก แต่ไม่มีผลใน preview อย่าง Studio/Player; แนะนำ `useDelayRender()` และใช้ `cancelRender()` เมื่อกู้ข้อผิดพลาดไม่ได้ จึงต้องมี loading/error state ที่เหมาะกับ preview และรอ asset readiness ใน render ด้วย

ข้อเสนอ: ปล่อย render หลัง image/font/data ที่ต้องใช้พร้อมและ canvas ได้วาดเนื้อหาที่ต้อง capture แล้ว ไม่ปล่อย handle ทันทีที่เริ่ม request หรือก่อนอัปเดตเนื้อหาเสร็จ

`ThreeCanvas` ใช้ `frameloop='never'` ระหว่าง render; เมื่อ texture เปลี่ยนใน async callback เอกสารระบุให้ `advance()` เพื่อวาด sync ก่อน capture แทน `invalidate()` ที่เพียงนัดวาดภายหลัง ใช้ตาม lifecycle จริง อย่าเพิ่ม loop อิสระเพื่อแก้ภาพค้าง

แหล่ง: [Remotion — delayRender / continueRender](https://www.remotion.dev/docs/delay-render), [Remotion — ThreeCanvas](https://www.remotion.dev/docs/three-canvas)

## 4. Static texture, cache และ ownership

R3F `useLoader` suspend ระหว่างโหลด และ cache ด้วย URL เป็น key ทำให้ reuse asset ใน component tree ได้ เอกสารเตือนเรื่อง mutate/dispose asset ที่ถูกแชร์

ข้อเสนอให้บอส:

- static image ใช้ loader/cache ที่มี key คงที่
- procedural canvas สร้าง canvas/texture แบบ stable ต่อ mounted scene/asset instance ไม่ `new CanvasTexture` ในเส้นทางที่ทำซ้ำทุก frame
- หากเปลี่ยนเนื้อหา canvas ที่ใช้เป็น texture เดิม ให้ตั้ง `texture.needsUpdate = true` หลังวาดเนื้อหาใหม่
- แยกเจ้าของ resource: scene-owned resource cleanup เมื่อเลิกใช้; shared cached resource ไม่ dispose จาก consumer เดียวขณะที่อื่นใช้
- “ครั้งเดียวต่อ scene” ในที่นี้หมายถึง reuse ภายใน lifecycle ไม่ใช่สมมติว่าทุก render worker/tab หรือทุก remount แชร์ object เดียวกัน

แหล่ง: [R3F — Hooks / useLoader](https://r3f.docs.pmnd.rs/api/hooks), [Three.js — Canvas Textures](https://threejs.org/manual/pages/canvas-textures.html)

ข้อควรระวัง: ตัวอย่าง Three.js manual ใช้ `requestAnimationFrame` และสุ่มเพื่อสอน canvas texture โดยทั่วไป อย่านำ loop เหล่านั้นมาใช้เป็น timing model ของ Remotion

## 5. Transparency และลำดับภาพ

Three.js อธิบายว่าการเขียน depth ที่ใช้ได้ดีกับวัตถุทึบทำให้ transparency ซับซ้อน engine เรียง transparent objects ได้ แต่ไม่ได้แก้ลำดับทุก triangle อัตโนมัติ ดังนั้น `transparent=true` หรือ `DoubleSide` อย่างเดียวไม่รับประกันว่า alpha cutout ซ้อนกันถูกต้อง

ข้อเสนอ: ใช้ planes ไม่ตัดทะลุกัน กำหนด depth/layer ordering ที่คงที่ และพิจารณา alpha cutout กับ soft transparency ตามภาพจริง ตรวจตอนตัวละครเดินผ่าน prop หรือขอบหน้าต่าง อย่าปิด depth test ทั้งฉากเป็นสูตรแก้ทุกปัญหา สิ่งที่ใส่ `depthWrite=false`, `alphaTest` หรือ `renderOrder` ต้องมีเหตุผลและตรวจ occlusion จริง

แหล่ง: [Three.js — Transparency](https://threejs.org/manual/pages/transparency.html)

## 6. สี ความสว่าง และการอ่านตัวละคร

Three.js คำนวณแสงใน Linear-sRGB แต่ texture สีจาก PNG/JPEG อย่าง `map` และ `emissiveMap` ต้องกำกับ `SRGBColorSpace`; non-color maps ใช้ชนิดที่เหมาะสม เอกสารย้ำว่า color-space ผิดทำให้ภาพสว่าง/มืดผิด และการเพิ่ม/ลดแสงไม่แก้ต้นเหตุ

ข้อเสนอ: ตรวจ input color space, output conversion และ tone mapping ก่อนจูน ambient/lantern/emissive จากนั้นทำตามค่าโปรเจกต์และตรวจภาพบน background มืด ค่า intensity ที่ดูดีขึ้นกับ material/pipeline จึงไม่อ้างว่า `2.6` หรือ `0.3` รับประกันลุคเดียวกันในทุกฉาก

แหล่ง: [Three.js — Color Management](https://threejs.org/manual/pages/color-management.html)

## 7. Contact และเงา

Three.js manual อธิบาย shadow maps มีค่าใช้จ่ายในการ render เพิ่ม และยก fake shadow เป็นทางเลือก โดยผูก shadow กับวัตถุให้เคลื่อนสัมพันธ์กัน ตัวอย่าง shadow plane บนพื้นใน manual เป็นเทคนิคทั่วไป ไม่ใช่คำอนุญาตให้ละเมิดกฎ prop-plane ของงานนี้

ข้อเสนอสำหรับงาน hybrid: ทำ contact shadow เป็น shared 2D asset/layer เมื่อเหมาะกับ pipeline แทนการแยกชิ้นภาพ prop หรือวาง prop plane นอน รักษา anchor ของฝ่าเท้า/สะโพก/มือให้ตรง surface/seat/grip ที่ asset ระบุ และตรวจเงาเลื่อนไปด้วยกันเมื่อภาพเคลื่อน เงาอย่างเดียวไม่แก้ตัวละครลอยเหนือเบาะ

แหล่ง: [Three.js — Shadows](https://threejs.org/manual/pages/shadows.html)

## 8. QA ที่จำเป็นเพิ่มเติมจาก contact sheet ทุกวินาที

ข้อเสนอ QA ต่อไปนี้เป็นการสังเคราะห์จากข้อจำกัดการสุ่มตัวอย่างและ frame-driven render ไม่ใช่รายการบังคับจาก Three.js:

1. Render contact sheet ทุก 1 วินาทีตามผู้ใช้ พร้อม ID ฉาก ช็อต และเฟรม
2. เพิ่มภาพ `F-1`, `F`, `F+1` รอบ cut, เปลี่ยน pose/prop parent, attach/detach, reveal, flash, จุดเริ่ม/จบ movement และการเข้า/ออกของ texture
3. ดู render ต่อเนื่องช่วงสำคัญและ seek สุ่ม/ย้อนหลังใน Studio เพื่อจับ pop, stale texture, layer ordering และการสะสม state
4. ตรวจ actor projected size, subtitle band, feet/seat/hand contact, shadow, rim readability และ 2D-image movement ใน Short/Long ที่แตะ
5. บันทึกสิ่งที่ตรวจจริง ไม่เขียนว่า “ไม่มี jumps” จาก contact sheet 1 Hz เพียงอย่างเดียว เพราะภาพตัวอย่างห่าง 30 เฟรมที่ 30 fps อาจพลาด glitch 1 เฟรมระหว่างนั้น

## การอ่านตัวอย่างจากแหล่งอ้างอิง

เอกสารอาจใช้ generic real-time loops, 3D shadow planes หรือ API ของเวอร์ชันใหม่กว่า checkout ให้ยึด frame-driven Remotion, กฎผู้ใช้ และ installed types ของ branch เป้าหมาย ไม่มีตัวอย่างใดด้านบนยืนยันว่า asset หรือ scene ของ repo ผ่าน QA แล้ว
