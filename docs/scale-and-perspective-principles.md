# สัดส่วน ขนาดจริง และ perspective สำหรับ Film / Mark / Boss

อัปเดตและเปิดอ่านแหล่งวันที่ 26 ตุลาคม 2026 ใช้เมื่อสร้าง/แก้ assets, จัด staging, ออกแบบกล้อง หรือรีวิวภาพที่มีระยะลึก ทั้ง 2D, 3D และ hybrid

## 1. กฎผู้ใช้และเจ้าของงาน

ผู้ใช้กำหนดให้ **ทำขนาดคน สัตว์ สิ่งของและเฟอร์นิเจอร์ให้สัมพันธ์อย่างสมจริงก่อน แล้วจึงให้มุมกล้องและระยะกำหนดขนาดบนภาพ** งาน stylized ยังใช้ได้ โดยรักษา identity และขนาดอ้างอิงที่เลือกไว้ รายละเอียดวิธีทำและ QA ด้านล่างเป็นการสังเคราะห์สำหรับโปรเจกต์; ข้อค้นพบจากแหล่งต้นทางแยกไว้ท้ายเอกสาร

| เจ้าของ | สิ่งที่ต้องส่งต่อ |
| --- | --- |
| Film | เลือกหน่วย/ระบบพิกัด, scale baseline, projection และแนวทางกล้อง; ระบุ composition strategy ของ 2D/3D, ข้อจำกัดและหลักฐาน feasibility ใน visual brief |
| Mark | ใช้ baseline เดียวกันลงรายละเอียดรายช็อต: ตำแหน่งและระยะสัมพันธ์, ground plane, framing, contact, key panels และ boundary states ใน scene sheet |
| Boss | ทำ dimensions/anchors และ projection ใน shared owners, integrate ตาม runtime contract และพิสูจน์ scale/contact/motion ทั้ง Short และ Long |

Film กับ Mark บันทึกการเปลี่ยนแนวทางใน brief/board revision; Boss ส่งข้อจำกัดจริงกลับตาม [dev findings](dev-findings.md) การเพิ่มคู่มือนี้ยังไม่ได้แก้ asset หรือพิสูจน์ runtime ของฉากใด

## 2. ตั้งขนาดอ้างอิงก่อนจัดกล้อง

แยกสามสิ่ง: **canonical physical size** คือขนาด asset ในท่าอ้างอิง; **world placement** คือตำแหน่ง/ทิศทางและ instance size ที่มีเหตุผล; **projected size** คือขนาดพิกเซลหลัง camera/crop ต้องสืบย้อนแต่ละขั้นได้

1. เลือกหน่วยร่วม เช่นเมตร หรือ normalized units ที่มี conversion ชัดเจน จด origin, axes, handedness และ floor plane ไม่เทียบ SVG pixels กับ Three.js units โดยตรง
2. วัดมนุษย์จากท่ายืนอ้างอิงที่ระบุ สัตว์ระบุ posture และวิธีวัด เช่น shoulder height กับ body length อย่าเปลี่ยน canonical height ตามท่าก้ม/นั่งหรือหางที่แกว่ง
3. ใช้ logical solid bounds ของตัว/วัตถุจริง แยก image canvas, transparent padding, glow และเงาออกจากขนาด ตัวละครสองภาพที่ canvas เท่ากันอาจมีขนาดตัวต่างกัน
4. เลือก reference ให้ตรงอายุ/body type, species/breed และชนิดเฟอร์นิเจอร์ บันทึกแหล่งภาพ/แบบ/measurement และสถานะ measured, estimated หรือ design choice ค่าที่เดาเป็น baseline การผลิต ไม่ใช่สถิติสัดส่วนสากล
5. เทียบความสัมพันธ์ที่ใช้แสดงจริง: สะโพก–เบาะ, เข่า–ขอบโต๊ะ, มือ–ของถือ, คน–ประตู และสัตว์–คน ให้ placeholder รักษาขนาดและ anchors เหล่านี้ก่อนเพิ่มรายละเอียด
6. Normalize asset ครั้งเดียวในเจ้าของ library; เปลี่ยน instance size เมื่อเป็นคน/สัตว์/สิ่งของอีกขนาดโดยเจตนา พร้อมเหตุผลและ continuity เดิม ไม่แก้ perspective ด้วยการปรับขนาดเฉพาะช็อตตามความรู้สึก

ตาราง baseline อยู่กับ library/sequence index ที่ใช้งานจริง ลิงก์จาก scene sheets แทนคัดลอกค่าหลายชุด:

| Asset ID / revision | หน่วย + ท่าอ้างอิง | Solid dimensions / bounds | Floor / seat / grip anchors + space | Reference / สถานะ | Consumers / ข้อยกเว้น |
| --- | --- | --- | --- | --- | --- |
| `<id>` | `<unit; pose>` | `<height/width/depth หรือชนิดการวัด>` | `<named anchors>` | `<path/URL; measured/estimated/design>` | `<shots; intentional stylization>` |

## 3. กล้องเป็นผู้กำหนดขนาดบนภาพ

### Perspective และ orthographic

Perspective ใช้ขนาดจริง ตำแหน่ง ทิศทาง และกล้องร่วมกัน วัตถุขนาดและ orientation เดิมที่ลึกตามแกนมองมากขึ้นจะเล็กลง โดยต้องคง projection เดิมไว้ ส่วน orthographic คงขนาดฉายเมื่อเลื่อนวัตถุเข้า–ออกตามแกนมองภายใต้กล้องเดิม Film เลือก orthographic ได้เมื่อต้องการภาพแบบนั้นและระบุเหตุผล [S1–S2]

**ระยะที่ใช้หารคือ camera-space depth** ไม่ใช่ระยะเส้นตรงจากกล้องอย่างเดียว กำหนด `d > 0` ตามทิศ forward; ใน Three.js convention ที่กล้องมอง local `-Z` จะได้ `d = -zCamera` การขยับออกด้านข้างโดย depth เดิมไม่ได้ทำให้เล็กลงตาม radial distance

สูตรตรวจคร่าว ๆ ต่อไปนี้อนุมานจากเรขาคณิต pinhole ใช้กับส่วนสูงที่ขนาน image vertical และอยู่บนระนาบขนาน image plane (frontoparallel) ซึ่งจุดบน–ล่างมี depth เดียวกัน:

```text
Hpx ≈ Hworld × viewportHeight / (2 × d × tan(vFOV / 2))
```

ใช้ `vFOV` ที่มีผลจริงหลัง camera zoom ในหน่วย radians, viewport ก่อน picture crop/scale, square pixels และ centered perspective frustum; จุดต้องอยู่หน้ากล้องและในช่วง clipping ที่ใช้งาน หากมี view offset/film offset, post transform หรือภาพถูก crop ให้นำขั้นนั้นมาคิดด้วย สูตรนี้ไม่แทน projected bounds ของร่างกายเอียง หมุน มีความลึก หรือถูกบัง

ตัวอย่างเชิงอัตราส่วน: วัตถุแบบเดิมที่ `d` เพิ่มเป็นสองเท่า จะสูงบนภาพครึ่งหนึ่งเมื่อเงื่อนไขข้างต้นคงเดิม ไม่ใช้ข้อสรุปนี้กับการเปลี่ยน FOV, pose หรือการเดินออกด้านข้างเพียงอย่างเดียว

### ฉายตำแหน่งและ anchors ด้วยระบบเดียวกัน

สำหรับ centered pinhole เงื่อนไขเดียวกับสูตรด้านบน ให้ world point ผ่าน world-to-camera transform เป็น `(xc, yc, zc)` ก่อน แล้วใช้:

```text
d = -zc                         # Three.js camera convention; ต้อง > 0
fPx = viewportHeight / (2 × tan(vFOV / 2))
xPx = viewportWidth / 2 + fPx × xc / d
yPx = viewportHeight / 2 - fPx × yc / d
```

ระบบทั่วไปใช้ camera view/projection matrices และ viewport/crop จริง ฉาย foot/hip/grip anchors กับจุดบน surface เป้าหมายใน pipeline เดียวกัน แล้วจึงจัดภาพ actor ตาม anchor ที่ฉายได้ การย่อภาพอย่างเดียวโดยเก็บเท้าไว้ที่ screen y เดิมไม่ใช่การเดินตาม ground plane

3D geometry และ world-space cut-outs ที่ถูก perspective camera ฉายแล้วใช้ world dimensions ตาม baseline ให้กล้องสร้างการย่อด้วยระยะ **เพียงครั้งเดียว**; การคูณ `1/d` ซ้ำที่ object scale ทำให้ perspective ผิด ใน 2D simulated perspective ให้ shared projection/staging owner รับผิดชอบทั้งตำแหน่ง ขนาดและ anchors แทนสูตรเฉพาะฉาก

### Zoom, dolly และสองสัดส่วน

- Picture zoom/crop ขยายภาพที่ฉายแล้ว; optical/FOV zoom เปลี่ยน projection จากตำแหน่งกล้องเดิม; dolly เปลี่ยนตำแหน่งกล้องและความสัมพันธ์เชิงพื้นที่ บันทึก transform owner และลำดับให้ชัด
- Parallax จากการเลื่อนกล้องสัมพันธ์กับความลึก: foreground/background เคลื่อนบนภาพต่างกัน อย่าเพิ่ม parallax แบบเดียวกันให้ pure picture zoom หรือ pure rotation โดยอัตโนมัติ
- Short/Long ใช้ขนาด world baseline เดียวกัน แต่จัด camera/aspect/FOV/crop และ staging ให้ action/contact/reveal อ่านได้ในแต่ละภาพ
- กฎ Short lead ≥25% ของความสูงจอใน [Boss workflow](boss-asset-workflow.md#กฎการผลิตล่าสุดของผู้ใช้) เป็นเกณฑ์ projected visibility ให้แก้ framing/กล้อง/staging โดยรักษาสัดส่วน actor–set–prop หากชนเจตนา wide/reveal ให้ Film/Mark revise shot พร้อมเหตุผล ไม่ขยายตัวละครเดี่ยวเพื่อผ่านตัวเลข

## 4. Perspective ในงาน 2D และ hybrid

1. Mark ระบุ ground plane, eye level/horizon และ vanishing directions ที่สำคัญให้ตรงกล้อง เส้นขนานในโลกแต่ละทิศใช้จุดลู่เข้าร่วมตาม projection; horizon อาจเอียงเมื่อกล้อง roll ไม่ถือว่าทุก shot ต้องมีเส้นขอบฟ้าแนวนอน
2. ใช้พื้นที่และความลึกร่วมกันสำหรับคน สัตว์ furniture และ props การอยู่สูงขึ้นบนภาพไม่ได้แปลว่าไกลกว่าเสมอ อาจเป็นวัตถุอยู่บนโต๊ะหรือกล้องก้ม; ส่ง projected foot/contact position จาก ground/surface ที่ระบุ
3. Foreshortening คือรูปร่างฉายที่เปลี่ยนเมื่อส่วนหนึ่งหันเข้าหากล้อง ใช้ pose/view art หรือ geometry ที่รองรับมุมนั้น การยืด/บีบ SVG ทั้งตัวไม่สร้างด้านที่ไม่มีและอาจทำให้แขนขาหรือของถือผิดรูป
4. Flat cut-out มีข้อจำกัดมุมมอง ระบุ fixed-plane/billboard และช่วงมุมที่อ่านออก พร้อมตรวจ grip/seat/contact ระหว่างกล้องเคลื่อน Billboard ไม่ได้สร้างปริมาตรหรือด้านใหม่
5. Depth ordering, occlusion และ contact shadows ต้องตรงพื้นที่เดียวกันในจังหวะเดินผ่าน/นั่ง/จับของ DOM overlays ต้องมี mapping/mask/pass ที่พิสูจน์แล้วเมื่อผสาน WebGL; screen-space subtitles/UI คงนอก spatial projection

## 5. หลัก animation ที่นำมาประยุกต์

หลักจากผู้สอนอยู่ใน S3–S5; วิธีใช้กับ pipeline ต่อไปนี้เป็นข้อสังเคราะห์ของทีม:

- **Solid drawing / solid poses**: รักษาความรู้สึกของ volume, weight และ balance เมื่อเปลี่ยนมุม/ท่า ตรวจเท้าที่รับน้ำหนัก สะโพกบนเบาะ และมือที่จับของ ไม่วัดขนาดจาก silhouette ที่ยุบลงเพราะ pose แล้วเปลี่ยนตัวจริงตาม
- **Staging**: ใช้ระยะ ขนาดฉาย สิ่งบังและทิศทางนำสายตาให้เรื่องอ่านออก วาง hierarchy ด้วยกล้องและพื้นที่ที่สมเหตุผล พร้อมกันกับการรักษา baseline
- **Timing / spacing**: author เส้นทางใน world หรือ ground plane แล้วฉายทุกเฟรม การเคลื่อน world ระยะเท่ากันต่อเฟรมอาจมี screen spacing ไม่เท่ากันเมื่อ depth เปลี่ยน แยก easing ของ action ออกจากผล perspective
- **Volume และ squash/stretch**: deformation ที่จงใจช่วยสื่อ material/แรง แต่ต้องรักษาความรู้สึกของ mass/volume; ระบุ extreme pose, ช่วงเวลาและการคืนรูป แยกจาก unintended scale drift และ canonical size
- **Parallax / continuity**: ใช้ความลึกชุดเดียวสำหรับ motion, occlusion และ anchors ข้าม cut; การเปลี่ยนเลนส์หรือมุมอาจเปลี่ยน screen size โดย physical size ยังเดิม Mark บันทึก intentional changes เพื่อให้ QA แยกจาก pop

## 6. Authoring handoff และเกณฑ์จบงาน

ข้อมูลในตารางเป็น **authoring notes** ไม่ใช่ JSON fields หรือ API ใหม่ ตรวจ types, validator, renderer และ shared registries ใน checkout ก่อนใช้ หากต้องเพิ่ม capability ให้ integrate ครบตาม [Remotion toolkit](remotion-toolkit.md)

| เอกสาร/เจ้าของ | ข้อมูลที่ต้องมี | จบเมื่อ |
| --- | --- | --- |
| Visual brief / Film | baseline reference, units/spaces, projection, camera intent, hybrid mapping, transform owner, feasibility/fallback | Mark วางช็อตโดยไม่ต้องเดาระบบขนาด; Boss รู้ shared owner และข้อที่ต้องพิสูจน์ |
| Scene sheet / Mark | baseline revision, shot/decision IDs, ground/surface, FG/MG/BG และ depth, camera/key panels สองสัดส่วน, projected contact, entry/exit | ทุก beat ที่มี scale/depth change มีภาพและ expected behavior ตรวจได้ |
| Library + QA / Boss | dimensions/bounds/anchors ที่ใช้จริง, conversion/projection owner, consumers, frame mapping และหลักฐาน | ตรวจรายการด้านล่างครบในขอบเขตงาน หรือระบุข้อค้างเป็น unverified พร้อม follow-up |

QA ต้องบันทึก expected → observed, composition, shot ID, frame/clock และ owner ที่ต้องแก้:

- [ ] Calibration view: actor/animal/prop/furniture ในระยะเดียวกันเทียบ baseline; ตรวจ logical bounds และ padding ก่อนใส่กล้องเล่าเรื่อง
- [ ] Near/far: วัตถุขนาดเดิมที่ depth ต่างกันเล็กลงถูกทิศใน perspective; same-depth comparison ใช้ orientation เดียวกัน; orthographic รักษาขนาดตาม intent
- [ ] Motion start/mid/end และจุดใกล้–ไกลสุด: foot/surface, hip/seat, hand/grip และเงาตรงกัน ไม่มี double scaling, sliding, clipping หรือ cut-out บางผิดมุม
- [ ] Short และ Long: baseline ตรงกัน, action/reveal ไม่หลุด, lead projected size ผ่านกฎและซับ/UI ชัด; ไม่แก้ด้วยการยืดสัดส่วน
- [ ] Cut/event boundaries: ตรวจ `F-1/F/F+1`, attach/detach, sit/stand, reveal และ adjacent scenes ที่เกี่ยวข้อง แยก intentional camera/pose change จาก scale pop
- [ ] Playback กับ random/backward seek/remount ให้เฟรมเดิม: projection, pose และกล้องคำนวณจาก frame/fps/seed ไม่สะสม state; ดูต่อเนื่องเพิ่มจาก contact sheet ตาม Boss QA

## 7. ข้อค้นพบจากแหล่งต้นทางและขอบเขตหลักฐาน

เปิดอ่าน body ของแหล่งต่อไปนี้เมื่อ 26 ตุลาคม 2026 สรุปเฉพาะประเด็นที่ใช้ ไม่ใช่หลักฐานว่า installed API หรือ runtime ใน repo รองรับครบ:

| ID / Primary source | สิ่งที่แหล่งยืนยัน |
| --- | --- |
| S1 — [Three.js: PerspectiveCamera](https://threejs.org/docs/pages/PerspectiveCamera.html) | กล้องใช้ perspective; `fov` เป็น vertical FOV, `aspect` คืออัตราส่วนภาพ และมี near/far, zoom และ view offset; view size ใช้ระยะตาม viewing direction |
| S2 — [Three.js: OrthographicCamera](https://threejs.org/docs/pages/OrthographicCamera.html) | ขนาดภาพวัตถุคงเดิมเมื่อระยะจากกล้องเปลี่ยนภายใต้ orthographic projection; มี frustum bounds และ zoom |
| S3 — [Jay Jackson / Animation Mentor: Solid Drawing](https://www.animationmentor.com/blog/solid-drawing-the-12-basic-principles-of--animation/) | solid drawing สื่อรูปทรงสามมิติผ่านภาพสองมิติพร้อม weight, depth, balance; การวาง pose คำนึงถึง gravity และการพยุงตัว |
| S4 — [John Nguyen / Animation Mentor: Staging](https://www.animationmentor.com/blog/staging-the-12-basic-principles-of-animation/) | การจัดตัวละคร foreground, composition, camera angles, lines of focus และ screen direction ช่วยนำความสนใจและสื่อเรื่อง |
| S5 — [Chris Hurtt / Animation Mentor: Squash and Stretch](https://www.animationmentor.com/blog/squash-and-stretch-the-12-basic-principles-of-animation/) | shape deformation สื่อ flexibility/material; volume ควรรู้สึกคงเดิม และการรักษาค่าทางคณิตศาสตร์อาจยังต้องปรับให้ภาพอ่านถูกตาม style |

สูตร pinhole, calibration table, ownership, handoff และ QA เป็นการอนุมาน/สังเคราะห์สำหรับโปรเจกต์ ไม่ใช่ checklist ที่แหล่งใดรับรอง สัดส่วนของ asset ต้องมี reference ของงานนั้น; เอกสารนี้ไม่ได้กำหนดค่ามาตรฐาน anthropometry หรืออ้างผล render ใหม่
