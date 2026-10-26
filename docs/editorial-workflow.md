# แพรว (Preaw) + โบ็ต (Boat): ก่อนส่งบทให้ Film และ Mark

สำหรับ Reels/Shorts แนวลึกลับ แทรกความรู้ และหักมุม รวมงานทั้งตอนเมื่อร้องขอ ทั้งคู่เป็น project agents ใน `.codex/agents/` ใช้ชื่อ `preaw` และ `boat` ตามชื่อที่ผู้ใช้ตั้ง โมเดลและสิทธิ์ของทั้งคู่สืบทอดจากแชตที่เรียกใช้ ส่วน Film และ Mark มี model/effort กำหนดไว้ใน agent TOML ของแต่ละคน

## หน้าที่และลำดับงาน

| ขั้น | ผู้รับผิดชอบ | ผลส่งต่อ |
| --- | --- | --- |
| Brief / research | โบ็ต | คำถาม หลักฐาน ความรู้ที่เล่าได้ และสิ่งที่ยังไม่รู้ |
| Script | แพรว | บทเต็ม beats เบาะแส เฉลย และ claim references |
| Fact-check | โบ็ต | ตรวจบทฉบับที่ระบุทีละข้อ พร้อมคำแก้และผลกระทบ |
| Revision / recheck | แพรว → โบ็ต | แก้บทและตรวจ claims ที่เปลี่ยนหรือได้รับผลกระทบ |
| Visual / technical brief | ฟิล์ม | เลือก 2D/3D/hybrid แสงเงาสี camera language และวิธีผสาน 2D/Three.js พร้อม feasibility/risks |
| Storyboard | มาร์ค | แตก brief เป็นช็อต/panels, staging, timing และ scene pack |
| Production | Dev / editor | ทำฉากและเสียง ตรวจเทียบกับบทและ storyboard |

โบ็ตทำสองรอบใน agent เดียว การเคยค้นข้อมูลก่อนเขียนไม่ได้แปลว่าตรวจถ้อยคำหลังเขียนแล้ว ผู้ประสานงานส่งไฟล์และโจทย์ให้แต่ละ agent ตามงานที่ผู้ใช้มอบหมาย; config เหล่านี้ไม่ได้ติดตั้งการรันอัตโนมัติหรือส่งข้อความข้ามแชตเอง

ตัวอย่างเรียกใช้:

> ให้โบ็ต (boat) ค้นข้อมูลเรื่อง [หัวข้อ] สำหรับคลิปลึกลับแทรกความรู้ พร้อมหลักฐานและมุมที่นำมาเล่าได้

> ให้แพรว (preaw) ใช้ research.md เขียน Reels ประมาณ 45 วินาที มีหักมุมที่ย้อนเข้าใจเบาะแสเดิมได้ พร้อมบทพากย์เต็ม

> ให้โบ็ตตรวจ ch01-script.md revision 2 ทีละ claim แล้วเสนอคำแก้และระบุว่าส่วนใดยังยืนยันไม่ได้

> ให้ฟิล์มใช้บท revision 3 กับ fact-check ที่ตรงฉบับทำ visual/technical brief แล้วส่ง brief revision ให้มาร์คทำ storyboard แยกรายฉาก

## หน่วยและไฟล์

ใช้ episode / chapter / story scene ตาม [workflow มาร์ค](mark-storyboard-workflow.md) แพรวให้ beat IDs เช่น `E01-C01-S02-B01`; มาร์คค่อย map ไป shot/panel IDs แทนการให้ writer กำหนดทุกมุมกล้อง

เก็บไฟล์ authoring ข้างงานใน `scripts/<episode>/` ตัวอย่างต่อไปนี้เป็น convention สำหรับเอกสาร ไม่ใช่ runtime JSON schema:

```text
scripts/<episode>/
  research.md
  ch01-script.md
  ch01-fact-check.md
```

Runtime timelines ยังคงใช้สัญญาใน AGENTS.md และโค้ดปัจจุบัน การสร้างบทไม่ได้สร้าง timeline หรืออ้างว่า renderer รองรับทุกสิ่งที่เขียนลงบทแล้ว

## Research packet — โบ็ต

1. ระบุ brief, ประเภทเรื่อง, คำถามหลัก, learning takeaway, ช่วงเวลาหรือบริบท และวันที่ค้น เมื่อผู้ใช้ระบุเคสจริง ให้ตรวจข้อเท็จจริงของเคสนั้น; brief แต่งเรื่องกว้าง ๆ ใช้โหมดที่ติดป้าย `fiction-with-factual-knowledge` ได้
2. เปิดอ่านแหล่งที่รองรับ claims สำคัญจริง ค้นหลักฐานขัดแย้งและข้อจำกัด แหล่งต้นทางหนึ่งชิ้นที่ถูกหลายเว็บคัดลอกยังเป็นหลักฐานต้นทางเดียว แยก `documented fact`, `reported experience`, `folklore`, `hypothesis`, `fiction/dramatization` ตามสิ่งที่แหล่งยืนยัน ไม่เหมาว่ารายงานประสบการณ์ยืนยันสาเหตุเหนือธรรมชาติหรือสาเหตุทางวิทยาศาสตร์
3. ทำ source registry เช่น `SRC001`: ชื่อ ผู้เขียน/หน่วยงาน วันที่เผยแพร่/แก้ไข URL ตรง section/page และวันที่เข้าถึง ระบุ `inspected` หรือ `inaccessible/lead-only` พร้อมข้อจำกัด ใช้ข้อความอ้างอิงสั้นเท่าที่จำเป็น
4. ทำ claim ledger เช่น `F001`: ข้อกล่าวอ้าง ขอบเขต/เงื่อนไข แหล่งและ locator สิ่งที่สนับสนุน/คัดค้าน และ wording ที่ใช้ได้ แยกกลไกที่เป็นไปได้จากคำอธิบายที่พิสูจน์แล้วในเคสเฉพาะ
5. สรุปมุมเล่าเรื่องที่มีหลักฐานรองรับและคำถามที่ยังต้องหา เมื่อข้อมูลหลักไม่พอ ให้ส่ง research gaps ชัดเจน; ห้ามเติมหลักฐานหรืออ้างว่าเข้าถึงแหล่งที่อ่านไม่ได้

จบ research เมื่อทุก premise-critical claim มีหลักฐานและข้อจำกัด หรือถูกระบุว่ายัง unresolved อย่างมองเห็นได้ ความไม่ครบไม่ใช่ผลตรวจผ่าน

## Script pack — แพรว

ระบุหัวเอกสาร: episode/chapter IDs, script revision, brief/research revision, story mode, target duration และ timing status (`estimated` / `read-aloud` / `audio-tested`) แยกสถานะ approval ของผู้ใช้ออกจากสถานะการเขียนและตรวจข้อเท็จจริง

บทที่ส่งต่อมี:

- **แกนเรื่อง**: logline, คำถามหลัก, ตัวละครต้องการอะไร/อะไรขวาง, อารมณ์เป้าหมาย และความรู้ที่คนดูควรเข้าใจ
- **ความจริงและ ending**: สิ่งที่เกิดขึ้นจริงภายในเรื่อง ข้อเท็จจริงที่ยืนยันได้ และสิ่งที่ยังไม่แน่นอน วาง ending ก่อนย้อนปลูก clues โดยเคสจริงต้องไม่เปลี่ยนหลักฐานให้เข้ากับ ending ที่อยากได้
- **Scene / beat list**: IDs, หน้าที่ของฉาก เหตุ–ผล สิ่งที่เปลี่ยน และช่วงเวลาประมาณ แยกบริบทของเรื่องจากเวลาที่ผ่านในคลิป
- **บทเต็ม**: narration/dialogue ภาษาไทยที่จะพูดจริง แยกซับที่ย่อหรือเปลี่ยนถ้อยคำออกจาก VO พร้อม pauses และ sound/story events ที่จำเป็น ไม่ส่งเพียง synopsis แทนบท
- **Clue ledger**: `CL01`, จุดปลูก/beat, สิ่งที่คนดูสังเกตได้, ความหมายแรก, ความหมายหลังเฉลย และจุด payoff แยกเบาะแสในนิยายออกจากหลักฐานจริงที่อ้างกับคนดู
- **Claim mapping**: factual sentence/beat → `F001` → `SRC001` และ locator; ข้อใหม่ที่ยังไม่มีหลักฐานใช้สถานะ `needs-research`
- **Handoff ให้ Film → Mark**: ข้อมูลที่ต้องเห็น/ได้ยิน ข้อมูลที่ต้องซ่อนจนถึง beat ใด continuity สำคัญ และข้อจำกัดของเรื่อง Film เลือก visual/technical approach ตาม [workflow brief](film-visual-brief-workflow.md) แล้ว Mark แตกบอร์ด ทั้งคู่รับ script/review revision ตรงกัน
- **Change log / open questions**: revision นี้เปลี่ยนอะไร กระทบ claims/clues/ฉากไหน และอะไรต้องให้โบ็ตตรวจใหม่

แพรวเลือกงานสร้างสรรค์ตาม brief เองได้ รวมหัวข้อเมื่อได้รับโจทย์เปิด hook, beats และ twist อ่านออกเสียงหรือใช้เสียงทดลองก่อนอ้างว่า timing ลงตัว; ตัวเลขคำภาษาไทยอย่างเดียวไม่ยืนยันความยาวจริง กฎช่องใช้ตาม AGENTS.md ส่วนโครง 45 วินาทีเป็นแนวทดลอง ไม่ใช่สูตรบังคับทุกเรื่อง

จบ draft เมื่อช่วงบทที่ร้องขอมีบทพากย์เต็มและ beats/clues/claims ครบตามความเกี่ยวข้อง พร้อม gaps ที่ชัดเจน งานที่มี premise-critical gap ยังเป็น draft สำหรับค้นข้อมูลต่อ

## Fact-check — โบ็ต

ระบุ script path/revision และ research revision ที่ตรวจ อ่านบททั้งฉบับแล้วตรวจทุก assertion รวม hook, ชื่อคลิปที่ให้มา, ซับ, ตัวเลข, คำอ้าง, เหตุและผล และข้อความความรู้ในภาพที่ระบุไว้ ไม่จัดคำพูดหรือความเชื่อตัวละครเป็นความจริงของผู้บรรยายโดยอัตโนมัติ

| Claim / location | ถ้อยคำที่ตรวจ | ประเภท | Verdict | Evidence + locator | เหตุผล / คำแก้ / ผลต่อเรื่อง |
| --- | --- | --- | --- | --- | --- |
| `F001` / beat ID | ข้อความตรงจาก revision นี้ | fact / report / hypothesis / fiction | ค่าด้านล่าง | `SRC001` + section | ... |

Verdicts: `supported` = หลักฐานรองรับถ้อยคำและขอบเขตนี้; `needs-qualification` = ต้องลดระดับ/เติมเงื่อนไข; `contradicted` = มีหลักฐานขัดกับคำกล่าว; `unverified` = ยังยืนยันไม่ได้; `not-factual` = เนื้อหานิยาย/การประเมินที่ไม่ได้อ้างเป็น fact โดยยังตรวจว่าการนำเสนอทำให้เข้าใจผิดหรือไม่

ข้อผิดพลาดที่ทำลาย premise, reveal หรือ learning takeaway ให้รายงานก่อนรายละเอียดจุกจิก โบ็ตเสนอ wording ที่ถูกและผลต่อ beats/clues; แพรวเป็นผู้ rewrite บท การแก้ข้อเท็จจริงต้องไม่ถูกหักมุมท้ายคลิปให้คนดูจำความรู้ผิดอีก

สรุปผลสำหรับ revision ที่ระบุเท่านั้น: `revision-required`, `verification-incomplete` หรือ `ready-for-storyboard` เมื่อไม่มี factual gap ที่กระทบเรื่อง/ความรู้ค้าง และข้อจำกัดที่จำเป็นปรากฏในบทแล้ว Readiness ไม่ใช่การอ้างว่าผู้ใช้อนุมัติ หรือว่าจะไม่มีข้อผิดพลาดหลงเหลือ

เมื่อบทเปลี่ยน revision ให้ทำ change impact ต่อ factual wording และ claims ที่พึ่งพากัน ตรวจซ้ำรายการที่ได้รับผลกระทบและบันทึก coverage ของฉบับใหม่ ใช้ผลเก่าได้เฉพาะส่วนที่ตรวจว่าไม่เปลี่ยนและไม่มีหลักฐานใหม่ขัดกัน

## ส่งต่อและตรวจบทก่อนลงทุนทำภาพ

ก่อนส่ง Film แพรวตรวจว่า hook ได้ payoff, ทุกฉากขยับเรื่อง, twist ย้อนเข้าใจได้ และความรู้มีผลต่อ plot โบ็ตตรวจ facts แยกอีก pass Film รับ script/review revision ที่สอดคล้องกันเพื่อทำ visual/technical brief แล้ว Mark รับชุดเดียวกันพร้อม brief revision; ข้อผิดพลาดด้านบทส่งกลับแพรว/โบ็ต แนวทางภาพและวิธีผสานเป็นงาน Film รายละเอียด storyboard เป็นงาน Mark โค้ดและผลทดลองเป็นงาน Boss

ผู้ใช้สามารถขอ rough storyboard จาก draft ได้ ให้ระบุ revision และ unresolved claims ที่อาจทำให้ต้องแก้ภาพ บทที่สร้างหรือผลตรวจที่พร้อมไม่ได้หมายความว่าได้รับอนุมัติแล้ว ถ้า animatic เผยปัญหาจังหวะ ให้ย้อนแก้บท พร้อมปรับ revision และตรวจ factual/continuity impact

## หลักการและแหล่งอ้างอิง

ดู [scriptwriting-principles.md](scriptwriting-principles.md) สำหรับ hook, intention/obstacle, causality, fair twists, การแทรกความรู้และวิธีตรวจหลักฐาน ส่วนคำสั่งแต่ละ agent อยู่ใน `.codex/agents/preaw.toml` และ `.codex/agents/boat.toml` รูปแบบ config อ้างอิง [OpenAI custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents)
