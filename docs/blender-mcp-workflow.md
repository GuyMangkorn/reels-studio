# Blender MCP: ผลิต assets และภาพสำหรับ Remotion

ใช้เอกสารนี้เมื่อ Film เลือก Blender, Mark วางช็อตที่ใช้ผลผลิต Blender หรือ Boss สร้าง/แก้/ส่งออกงานผ่าน Blender MCP ผู้ใช้อนุญาตให้เพิ่ม Blender ใน flow เมื่อ 26 ตุลาคม 2026; การติดตั้งที่ผู้ใช้กำลังทำยังต้องตรวจการเชื่อมต่อใน session จริง เอกสารนี้กำหนด workflow ไม่ได้เพิ่ม renderer, loader หรือ scene JSON fields

## หน้าที่และทางเลือกส่งมอบ

ลำดับเดิม: Boat วิจัย → Preaw เขียน → Boat ตรวจ → Film วาง brief → Mark ทำบอร์ด → Boss ผลิตด้วย Blender/โค้ดและ integrate → Remotion → QA

- **Film** เลือก medium และเส้นทางส่งมอบตามช็อต ระบุ decision ID/revision, ผลต่อเรื่อง, camera/scale/light contract, dependencies, fallback และหลักฐานที่ยังขาด ใช้ Blender เมื่อรูปทรง มุมใหม่ parallax แสงเงาหรือ occlusion ช่วยภาพจริง โดยคงทางเลือก 2D/3D/hybrid สำหรับทุกองค์ประกอบ
- **Mark** แตก brief เป็นช็อต ระบุกล้องสองสัดส่วน, action/reveal frames, contact, foreground และรอยต่อ บันทึก Blender source/export revision ที่ใช้ตรวจ การดู viewport เป็น reference ไม่ใช่หลักฐานว่า runtime ผ่าน
- **Boss** เป็นเจ้าของ Blender sources, scripts, reusable assets, export settings และการเชื่อม scene pipeline แก้ geometry/rig/anchors ที่ shared source แล้วส่งออกใหม่ ตรวจทั้ง Blender และผลที่ Remotion ใช้จริง
- **Remotion** เป็นเจ้าของ executable timeline, narration/amplitude, ซับไทย, channel label, screen overlays, endings และ final export อ่าน [remotion-toolkit.md](remotion-toolkit.md) ก่อนเพิ่ม capability

| เส้นทาง | เลือกเมื่อ | งานที่ต้องพิสูจน์ก่อนใช้ใน timeline |
| --- | --- | --- |
| Pre-render จาก Blender เป็นภาพ/ลำดับภาพ/วิดีโอ | ต้องรักษาแสง วัสดุ effects หรือ camera animation ที่ทำใน Blender | รองรับ media ชนิดนั้นใน shared renderer, frame mapping, alpha/color, การโหลดและ seeking; ทำ framing ของ Short/Long แยกเมื่อ crop เดียวรักษา action ไม่ได้ |
| Export GLB/glTF เข้า Three.js | ต้อง reuse โมเดลและปรับ staging/camera/animation ผ่านโค้ด | declared dependencies, loader/stage, materials, animation sampling, anchors, shadows และ type/validator/renderer integration ใน checkout เป้าหมาย |
| Hybrid / แยก passes | ต้องประกอบหลาย representation | camera/projection ที่ตรงกัน, masks/depth/alpha, light/color และผู้เป็นเจ้าของ transform ของทุก layer |

เริ่มทดลองด้วย shared set/prop และกล้องหนึ่งช็อตที่มี contact/reveal ในสองสัดส่วน ก่อนเพิ่มความซับซ้อนของ rig หรือทั้งตอน เส้นทาง pre-render เป็นจุดเริ่มที่แนะนำเมื่อจำเป็นต้องรักษาลุค Blender และ GLB runtime ยังไม่พร้อม แต่ media integration ก็ต้องทำและตรวจจริง ไม่ถือว่า fallback ใช้งานได้อัตโนมัติ

## 1. Preflight ก่อนแก้ฉาก

1. อ่าน brief, board/index, [Boss workflow](boss-asset-workflow.md), [scale/perspective](scale-and-perspective-principles.md) และ relevant [dev findings](dev-findings.md) ตรวจ checkout, package manifest, dependency tree, Remotion versions และ runtime contracts ตาม toolkit แยก `existing-integrated`, `exists-unintegrated`, `missing`, `unknown`
2. ค้น tools ที่เปิดให้ session จริง อ่าน schema ของ tool ก่อนเรียก ตรวจ Blender/addon/server versions เท่าที่อ่านได้ พร้อม active file, scene, objects, cameras และ render settings ด้วย read-only query/viewport ก่อนแก้ ระบุข้อมูลที่ตรวจไม่ได้ หลีกเลี่ยงสมมติชื่อ tool จาก README ของคนละรุ่น
3. หาก MCP ยังไม่เชื่อมต่อ ให้รายงานขั้นตอนที่ติดและทำ brief/manifest/งานโค้ดที่ไม่พึ่ง Blender ต่อได้ เก็บงาน Blender-dependent เป็น unverified จนเชื่อมและตรวจจริง การติดตั้งหรือเปลี่ยน client configuration เป็นอีก scope เว้นแต่ผู้ใช้สั่งไว้
4. ตรวจว่าฉากที่เปิดเป็นงานเป้าหมาย เก็บสำเนางานเดิมก่อนแก้ ใช้ collection/object/action/material names คงที่ใต้ asset ID และแก้เฉพาะสิ่งที่งานนี้เป็นเจ้าของ เก็บ scripts ใน repo ให้รันซ้ำแล้วอัปเดต asset เดิมได้โดยไม่เพิ่มสำเนาเรื่อย ๆ

เสร็จ preflight เมื่อบันทึก connection/version evidence, source revision และ route ที่เลือกพร้อม integration gaps ใน handoff ได้ Tool calls ที่รัน Python ให้จำกัดกับงาน Blender ที่ได้รับมอบหมาย ใช้ local connection เป็นค่าเริ่มต้น; การนำเข้า asset ภายนอกต้องมี license และ provenance เช่นเดียวกับ asset อื่นของช่อง

## 2. Shared source และ export contract

ใช้ convention ต่อไปนี้กับงาน Blender ใหม่ สร้าง directories เมื่อมี asset จริงเท่านั้น:

- `assets/blender/<asset-id>/source.blend`: editable source ของ shared asset/set/rig; episode เลือก asset นี้แทนสำเนา geometry
- `assets/blender/<asset-id>/build.py`: script สร้าง/แก้ asset ที่รันซ้ำได้ พร้อม settings ที่จำเป็น; dependency ภายนอกต้องประกาศ
- `assets/blender/<asset-id>/manifest.md`: contract, provenance/license, revision และรายการ exports/consumers
- `public/assets/blender/<asset-id>/`: runtime exports ที่เลือกใช้จริง เช่น GLB/textures/stills โดย shared module เป็นผู้ resolve path; video/pre-render sequences ต้องมี retrieval/regeneration และ packaging ที่ใช้ได้กับ render worker ตาม Git/media policy ของ repo
- `out/blender/` และ `out/qa/`: previews, intermediate passes และ review evidence ไม่ commit generated review media

เก็บ editable source, build scripts, manifest และ license ตาม issue workflow ตรวจขนาด `.blend`/textures/exports ก่อน commit; ถ้าใช้ Git LFS หรือ external storage ให้ตรวจว่าตั้งค่าและ fetch ในเครื่อง/worker ได้จริง บันทึก location/checksum และวิธีสร้างกลับ หลีกเลี่ยง reference ที่มีเฉพาะ absolute path ในเครื่อง แพ็ก dependencies ที่จำเป็นหรือใช้ relative paths และตรวจเปิดจาก checkout ใหม่ ไม่เพิ่ม LFS/storage เป็นผลข้างเคียง

Manifest ต้องระบุอย่างน้อย:

| กลุ่ม | ข้อมูลส่งต่อ |
| --- | --- |
| Identity / revisions | asset ID, source/build revision, Blender/exporter versions, brief decision/board shot IDs, consumers, source/export paths และสถานะ integration |
| Physical contract | หน่วย, axes/up/forward, canonical dimensions/bounds ไม่รวม padding, origin/pivots, named floor/foot/hip/seat/grip anchors พร้อม space/coordinates และ transform ที่ต้องใช้เมื่อ export |
| Camera / framing | projection, lens/FOV หรือ ortho bounds, aspect, clipping, camera/target/path และ Short/Long framing; specify camera owner เพื่อไม่ให้ Blender และ Remotion ขยับซ้ำ |
| Motion / clock | actions/clips, duration, fps, source frame range แบบระบุ inclusive/exclusive, mapping เข้า shot-local frame, holds/loop seam, composition audio offsets และ cache/bake locations |
| Appearance | renderer/settings, materials/textures, color management/view transform/output color space, alpha convention, light/shadow ownership, pass/mask list และ export settings |
| Delivery / evidence | resolutions, output formats/paths, license/provenance, regeneration command/steps, load readiness/resource owner, QA frames และข้อจำกัด |

ค่ากล้อง แสงและวัสดุของ Blender กับ Three.js ไม่ใช้ตัวเลขแทนกันตรง ๆ เทียบภาพกับ brief และ demo-lighting rules ใน Boss workflow แยกค่าที่เป็นคนละหน่วยและบันทึก mapping/ข้อจำกัด การ bake แสงในภาพกับ runtime lighting ต้องมี owner ชัดเพื่อไม่คูณแสงหรือเงาซ้ำ

## 3. ผลิตแบบ deterministic แล้วเชื่อม runtime

1. ทำ blockout จากขนาดและ anchors ก่อน polish ตรวจ actor–set–prop บนระนาบเดียวกันและ camera start/mid/end ทั้งสองสัดส่วน รักษา identity และ Short lead-size rule ด้วย framing
2. กำหนด 30 fps ตาม timeline กลาง บันทึก frame mapping ชัดเจน (รวม Blender start frame ที่อาจเริ่ม 1 ขณะที่ Remotion เริ่ม 0) คุม action/camera ด้วยเวลาแบบ absolute; seed randomness และ bake physics/particles/constraints ที่ต้องอาศัยประวัติก่อนส่งออก ทดสอบ direct seeking และ loop ไม่พึ่ง playback ก่อนหน้า
3. ตรวจ route: GLB ต้องตรวจวัสดุ/rig/animation/constraints ที่ส่งออกได้จริง bake/convert ตามความจำเป็นแล้วตรวจใน renderer ปลายทาง; pre-render ต้องตรวจ alpha edges, color, frame count และ trim/hold แยกจากเวลาเสียง Motion blur ใช้เมื่อช่วยอ่านการเคลื่อนไหวและไม่กลบ clue/reveal
4. Export จาก shared source revision เดียวกัน สร้าง Short/Long framing ตามบอร์ด และบันทึก export settings ให้ทำซ้ำได้ หากประกอบ passes ให้ส่งสิ่งที่ต้องบัง/ถูกบังครบ ภาพแบนไม่สามารถแสดงด้านที่ไม่ได้เรนเดอร์หรือรับแสงเชิงปริมาตรอัตโนมัติ
5. Boss เพิ่ม missing capability ใน shared module และ scene types, validator, renderer dispatch พร้อมกันก่อนเขียน JSON ที่เลือกใช้ asset/media/animation นั้น วาง model loading, animation sampling จาก frame/fps, readiness/error handling และ resource disposal ไว้ใน shared owner ตาม representation ที่ใช้
6. อัปเดต executable timeline, shot mapping/index และ entry/exit states ตาม sequence rules ของ AGENTS.md ส่งข้อจำกัดที่เปลี่ยน medium/camera/light/interface กลับ Film/Mark เพื่อแก้ revision ให้ตรงกัน

เสร็จ integration เมื่อ timeline โหลดผลผลิตจริงผ่าน shared pipeline และสุ่ม seek แล้วได้ frame ที่คาดหมายทั้ง Short/Long ไม่ใช่เพียง export ไฟล์สำเร็จ

## 4. QA และส่งต่อ

ทำ [Boss pre-push QA](boss-asset-workflow.md#qa-ก่อน-push-งานภาพหรือ-runtime) ครบเมื่อแก้ visual/runtime: Studio cold load/play/scrub/random seeking, renders ทั้งสองสัดส่วน, contact sheets ทุกวินาทีและเฟรมสุดท้าย, event/cut `F-1/F/F+1`, continuous sequence และเพื่อนบ้านที่มี

เพิ่มการเทียบ Blender export กับ Remotion ที่ source/output frames ตรงกัน: scale/contact, foot sliding, grip/seat, clipping, occlusion, alpha halos, color/shadows, texture/model loading, animation start/end, reveal และ subtitle safe regions เทียบไฟล์ผลลัพธ์กับพรีวิวแยกกัน บันทึกเวลาผลิต/เรนเดอร์จากการวัดจริงเมื่อต้องประเมินความคุ้ม ไม่อ้างว่า MCP ทำให้ภาพลื่นหรือ render เร็วขึ้นโดยยังไม่ทดลอง

ส่ง paths/revisions ของ source, manifest, exports, shared code, timeline/input props และ QA evidence พร้อมสถานะ `source-ready`, `export-ready`, `runtime-integrated`, `visual-verified` ตามหลักฐานแต่ละขั้น ระบุขั้นที่ยัง unverified และ follow-up ใน dev findings เมื่อเป็นข้อจำกัด reusable การมีเอกสาร/ไฟล์ `.blend`/ภาพ viewport ไม่ใช่ visual pass ของ Remotion

## อ้างอิงสำหรับตรวจรุ่นจริง

- [MCP for Blender — community project](https://github.com/ahujasid/mcp-for-blender): ตรวจ tools, addon/server requirements และข้อจำกัดของรุ่นที่ติดตั้ง ไม่ใช่ Blender Foundation plugin
- [Blender Manual: glTF export](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html): ตรวจ supported materials, animation และ export options ให้ตรง Blender รุ่นที่ใช้งาน
- [Remotion Three.js integration](https://www.remotion.dev/docs/three): ตรวจ dependencies/API และ implementation ใน checkout เป้าหมายก่อนใช้
