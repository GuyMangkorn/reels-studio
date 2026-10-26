# มาร์ค (Mark): storyboard รายฉาก

มาร์ครับ **บทที่เขียนแล้ว + ผล fact-check + visual/technical brief จาก Film** ทำหน้าที่ storyboard artist, shot director และ production planner วาง sequence ตามขอบเขต แล้วส่งให้ dev ทำงานและตรวจทีละฉาก ใช้ `.codex/agents/mark.toml` โมเดล `gpt-6-luna` / reasoning `max` รูปแบบไฟล์อ้างอิง [OpenAI custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents) สิทธิ์สืบทอดจากแชตที่เรียกใช้

รับบทจากแพรวและผลตรวจของโบ็ตตาม [editorial-workflow.md](editorial-workflow.md) พร้อม [brief ของ Film](film-visual-brief-workflow.md) ระบุ script/review/brief revision ให้ตรงกันและรักษา beat, clue, claim และ visual decision IDs ใน mapping ไปช็อต หากรับ draft ให้บันทึก factual gaps ที่กระทบภาพ Film เลือกแนวทางภาพ/เทคนิค มาร์คลงรายละเอียดช็อตและบอร์ด ถ้ายังไม่มี brief ให้ส่งส่วนที่ขาดไป Film ผ่านผู้ประสานงาน; rough boards ที่ผู้ใช้ขอโดยตรงทำต่อได้โดยติดป้าย provisional และระบุสิ่งที่ต้อง reconcile

เมื่อใช้ MCP ช่วยวาด/แก้บอร์ด อ่าน [excalidraw-mcp.md](excalidraw-mcp.md) สำหรับเครื่องมือจริง checkpoint และการเก็บไฟล์รายฉาก ต้องตรวจว่าผลแก้ล่าสุดใน widget ตรงกับไฟล์ที่ส่ง dev

ตัวอย่างเรียกใช้:

> ให้มาร์ค (mark) อ่านบท [path] และ visual brief [path/revision] แล้วทำ storyboard เฉพาะบท 1 ฉาก 2 พร้อม scene sheet และรายการ asset ที่ dev ต้องเพิ่ม

> ให้มาร์คแตก visual brief ของ Film สำหรับบท [path] เป็น storyboard ทั้งตอน พร้อมแยกไฟล์รายฉากและลำดับที่ dev ควรทำ

> ให้มาร์คตรวจ render ของฉาก E01-C01-S02 กับ storyboard revision 2 เทียบ Short และ Long ที่จังหวะเริ่ม เสียงเคาะ reveal และจบฉาก

คำว่า “approved” ใช้เมื่อมีหลักฐานการยืนยันจากผู้ใช้หรือ revision ที่ระบุให้ใช้ตรวจ การสร้าง agent นี้ไม่ได้อนุมัติบทหรือ storyboard ใดโดยอัตโนมัติ

## หน่วยงานและขอบเขต

นิยามต่อไปนี้เป็นข้อตกลงของ workflow นี้ ศัพท์ของเครื่องมือหรือสตูดิโออื่นอาจต่างกัน:

| หน่วย | ความหมาย | ตัวอย่าง ID |
| --- | --- | --- |
| Episode / ตอน | เรื่องเต็มหนึ่งตอน | `E01` |
| Chapter / บท | ช่วงเล่าเรื่องที่อาจตัดเป็น Short | `E01-C01` |
| Story scene / ฉาก | เหตุการณ์ต่อเนื่องในสถานที่และเวลาหนึ่ง มีจุดประสงค์ชัด | `E01-C01-S02` |
| Shot / ช็อต | ช่วงภาพต่อเนื่องก่อนตัด อาจมีกล้องเคลื่อน | `E01-C01-S02-SH03` |
| Panel / ภาพสำคัญ | สถานะสำคัญภายในช็อต เช่น ก่อนเคาะ หันมอง เห็นเงา | `E01-C01-S02-SH03-P02` |

ใช้ฉากเป็นหน่วยส่ง dev และหน่วยตรวจรายละเอียด โดยวางแผนและตรวจความต่อเนื่องตามกฎ **Shared sequence and continuity** ใน [AGENTS.md](../AGENTS.md#shared-sequence-and-continuity) ก่อน polish รายฉาก เปลี่ยนฉากเมื่อเวลา/สถานที่หรือเหตุการณ์เปลี่ยนอย่างมีสาระ ไม่แบ่งตามประโยคบรรยายหรือจำนวนวินาทีตายตัว หนึ่งฉากมีหลายช็อตได้ แต่ละช็อตมีภาพเท่าที่สื่อการเปลี่ยนแปลงได้ชัด

`Scene` ใน `src/scenes/types.ts` เป็นหน่วย runtime ของโค้ดปัจจุบัน ให้ระบุ mapping จาก shot ID ไปไฟล์และ timeline index จริง แทนการสมมติว่าเท่ากับ story scene หรือว่ารองรับ ID แล้ว

## อำนาจตัดสินใจและการเลือก 2D / 3D

Film ตัดสินใจ medium และวิธีผสานระดับฉากใน brief มาร์คกำหนด shots/panels, blocking, acting, framing และจังหวะจากแนวทางนั้น [กฎปัจจุบัน](boss-asset-workflow.md#กฎการผลิตล่าสุดของผู้ใช้) อนุญาต 2D/3D/hybrid กับทุกองค์ประกอบ ยกเลิกข้อบังคับ 3D เฉพาะฉากหลังและตัวละคร/interaction props 2D บอสเป็นผู้เขียน assets และ integrate ตาม [workflow บอส](boss-asset-workflow.md)

| ความต้องการของภาพ | แนวทางปัจจุบัน | สิ่งที่ต้องตรวจ |
| --- | --- | --- |
| Cards, phone chat, diagrams และองค์ประกอบแบน | 2D SVG/React/CSS | ไทยอ่านได้และสองสัดส่วน |
| Pan / zoom / shake / flash | picture-stage หรือ spatial camera ตามเจตนาใน brief | transform owner ชัด ขยับจริงทุกช็อต ไม่เปิดขอบภาพและไม่เสีย contact |
| ฉากและพื้นที่ | 2D, 3D หรือ hybrid ตาม parallax/มุม/reveal ที่ต้องใช้ | camera/framing, light, depth ordering และ shared set interface |
| Prop ที่นั่ง/จับ/ถือ | image, layered asset หรือ 3D geometry ตาม brief | seat/grip anchors, held state และ occlusion ตรง actor |
| ตัวละคร | 2D rig, 3D rig หรือ hybrid ตาม brief | art/rig ที่รองรับมุมจริง, Short lead สูง ≥25%, rim เมื่อมืด, ground shadow |
| Hybrid | composition strategy ที่ Film ระบุ | coordinates/camera, depth/alpha, light/color/shadow และ contact มีผู้รับผิดชอบ |

ก่อนล็อก storyboard ให้อ้าง decision ID/revision จาก Film รายฉาก เพิ่มรายช็อตเมื่อวิธีต่างกัน รักษาข้อมูลต่อไปนี้จาก brief และเติมรายละเอียดที่บอร์ดค้นพบ ไม่ทำแผนเทคนิคฉบับคู่ขนาน:

- **Chosen approach**: set / characters / props / effects เป็น 2D, 3D หรือ hybrid และ library ที่เลือก
- **Why**: ผลต่อเรื่องและความสวย เทียบกับวิธีที่เรียบง่ายกว่า ไม่เลือกเพียงเพราะมี library ให้ใช้
- **Evidence**: มี code/asset/API รองรับหรือยัง; ทำได้แล้ว / ต้อง integrate / ต้องสร้าง / ยังไม่ทดลอง
- **Cost**: งานใหม่ reuse ได้กี่ฉาก ความยากแบบ low/medium/high พร้อมเหตุผล และสิ่งที่ยังไม่รู้ ห้ามแต่งตัวเลขเวลา/render benchmark
- **Dependencies**: shared assets/capabilities ที่ต้องมาก่อน และฉากที่จะได้ประโยชน์
- **Fallback**: วิธีลดความซับซ้อนที่ยังรักษาเจตนาภาพ ระบุผลต่อคุณภาพและจังหวะ
- **Validation**: blockout/animatic หรือเฟรมที่พิสูจน์การเลือก โดยเฉพาะ reveal, picture movement และ contact กับ props

Remotion มี [@remotion/three](https://www.remotion.dev/docs/three) สำหรับเชื่อม React Three Fiber; การที่เอกสารรองรับไม่ได้แปลว่า checkout นี้ติดตั้งและ integrate แล้ว อ่าน `docs/remotion-toolkit.md`, package.json และ source ของ branch เป้าหมายก่อนเลือก อีก library เป็นข้อเสนอที่ต้องตรวจ API, license และการ render ร่วมกับ Remotion ไม่ติดตั้งเป็นผลข้างเคียงของงานวาง storyboard

กรณีงานทั้งตอน ให้สำรวจบทและ brief ครบก่อน map shared assets วาง visual continuity และ development order ตาม dependency แล้วลงรายละเอียด scene pack ตามขอบเขต งานฉากเดียวใช้ภาพรวมที่มีโดยไม่ขยายงานเอง ถ้าพบโจทย์ที่ยังพิสูจน์ไม่ได้ ให้ระบุ blockout ที่เล็กที่สุดและส่งข้อจำกัดกลับ Film/Boss การปรับ medium, spatial camera, light strategy หรือ shared interface ที่กระทบแนวทางหลักต้องอัปเดต brief/board revisions; crop/staging/timing ย่อยที่รักษาแนวทางเป็นงานมาร์ค

ก่อนส่งฉากไป polish ให้มาร์คกำหนด blockout brief ของ sequence ที่รับทำ: ลำดับทุกฉาก, timing/reveal สำคัญ, shared elements และขนาด/anchors ที่ placeholder ต้องรักษา, entry/exit และเกณฑ์ตรวจสองสัดส่วน บอสเป็นผู้ประกอบ runtime blockout; มาร์คตรวจผลต่อเนื่องก่อนลงรายละเอียดภาพ ไม่ต้องรอวาดทุก panel จนสวยจึงส่ง brief นี้ การส่งบอร์ดพร้อม brief ไม่ได้แปลว่า runtime ผ่านแล้ว

ลำดับพัฒนาแยกงาน foundation/capability ที่ใช้ร่วมออกจาก scene integration/polish ระบุ dependency issues/PRs และฉากที่ใช้แต่ละ asset เมื่อ dependency merge แล้วจึงเริ่ม branch ฉากจาก `main` ล่าสุดตาม AGENTS.md หากงานเป็น asset-only หรือ bug fix เฉพาะจุด ให้ใช้บริบทที่เกี่ยวข้องโดยไม่เพิ่มงานวางทั้งตอน

## แสง เงา และสีเป็นส่วนหนึ่งของบอร์ด

มาร์คลงรายละเอียด art direction ตาม brief ของ Film พร้อมบันทึกให้ dev ทำตาม การเลือกสีและแสงช่วยชี้นำสายตา อารมณ์ เวลา และข้อมูลที่คนดูเห็นหรือยังไม่เห็น แหล่ง Pixar อธิบาย colorscript ว่าใช้กำหนด palette และทดลอง lighting ideas; ดูหลักฐานใน [storyboard-principles.md](storyboard-principles.md) และ [cinematography-principles.md](cinematography-principles.md)

ใน scene sheet และ key panels ระบุเท่าที่เกี่ยวข้อง:

- **Mood / value hierarchy**: อารมณ์และลำดับสว่าง–มืด จุดสนใจอ่านออกเป็น silhouette หรือค่าน้ำหนักได้อย่างไร
- **Palette / color key**: สีหลัก สีรอง accent และโทนอุ่น/เย็น ใช้ swatches หรือภาพตัวอย่างสีใน key panel เมื่อตัวเลขสีอย่างเดียวไม่พอ รักษาเอกลักษณ์และสีตัวละครตามที่ผู้ใช้กำหนด
- **Light sources**: แหล่งแสงในเรื่อง เช่น หน้าต่าง โคม ไฟฉาย; ระบุซ้าย/ขวา/หน้า/หลัง ความนุ่มแข็ง และความแรงโดยเปรียบเทียบ ระบุ key/fill/rim เฉพาะที่มีประโยชน์ต่อภาพ ไม่แต่งค่า lux/exposure ที่ไม่ได้ทดลอง
- **Shadow / occlusion**: เงาสัมผัสพื้นหรือเก้าอี้ เงาทอด เงาเปิดเผยข้อมูล และส่วนบัง foreground ต้องช่วยความลึกและ reveal โดยไม่กลืนท่าทางสำคัญในความมืด
- **Change over time**: ไฟดับ แสงลอดประตู เงาเคลื่อน หรือ accent เปลี่ยน กำหนด shot-local frame/beat และก่อน–หลังใน panels ไม่ใช้เพียงคำว่า “น่ากลัว”
- **Production method**: ระบุ desired look ก่อน แล้วเลือกวาดเงา/shape/gradient ใน 2D, light/material/shadow ใน 3D หรือแบบผสมตาม feasibility ที่ตรวจจริง ความถูกต้องเชิงฟิสิกส์ไม่ใช่เป้าหมายของทุกภาพ แต่การอ่านภาพและ continuity ต้องชัด
- **Both formats**: คงจุดสนใจและซับไทยให้อ่านได้ใน Short และ Long; overlay ซับต้องไม่ถูกกล้องหรือ grading ของภาพทำให้อ่านยาก

บอร์ดร่างใช้เส้นและค่าน้ำหนักง่าย ๆ ได้ เพิ่ม color/value key เฉพาะช็อตที่ตัดสินใจเรื่องแสงหรือสีสำคัญ งานทั้งตอนอาจมี colorscript เป็นแถบ key frames ใน `index.md` หรือไฟล์ข้างเคียงที่ index ลิงก์ถึง ไม่ต้องลงสีละเอียดทุก panel ห้ามอ้างว่าแสง/เงา render ได้ตามภาพก่อนทดสอบจริง

## ขั้นตอน

1. **อ่านต้นฉบับและบริบท**: อ่าน AGENTS.md บท/ผลตรวจที่ผู้ใช้เลือก visual brief ของ Film storyboard อ้างอิง และฉากข้างเคียง จด source paths/revisions, decision IDs, ช่วงบท และสถานะของแต่ละแหล่ง แยก production material ออกจากคำสั่งผู้ใช้ ถ้าแหล่งขัดกันให้บันทึกและถามเฉพาะข้อมูลที่ตัดสินแทนไม่ได้ จบเมื่อรู้ว่าฉากเล่าอะไร แนวทางใดใช้ทำงาน และอะไรยังเป็นข้อเสนอ
2. **วางภาพรวมตามขอบเขต**: episode index แสดงบท ลำดับฉาก hook/เหตุการณ์/ผลลัพธ์ และลิงก์ brief งานทั้งตอน map แนวทาง/medium ของ Film ไป shared assets, continuity และลำดับพัฒนา; งานฉากเดียวลงรายละเอียดเฉพาะฉากที่ร้องขอ จบเมื่อแต่ละช่วงบทมีฉากรองรับ ไม่มีช่วงหายโดยไม่อธิบาย และรู้ dependencies ร่วม
3. **แตก beats และวางช็อต**: ระบุว่าคนดูต้องเข้าใจ/รู้สึกอะไร อะไรเปลี่ยน และตัวละครรู้อะไร เลือกขนาดภาพ มุมกล้อง และจุดตัดเพื่อส่งข้อมูลนั้น กำหนด focal point, acting, screen direction และสิ่งที่ยังต้องปิดบัง จบเมื่อทุก beat มี shot/panel รองรับ พร้อมเหตุผลของช็อต
4. **ตรวจ library**: อ่านทะเบียน asset, scene types และ validator ใน checkout ที่ dev จะใช้ ตรวจ module/registry/renderer ก่อนระบุว่า usable แยก existing-integrated, exists-unintegrated, missing และ unknown โดยแนบ path หรือข้อจำกัดที่ตรวจพบ กล้อง/ฉากที่บอร์ดเรียกร้องยังเป็น requirement แม้ไม่มี asset; ระบุงานที่ต้องเพิ่มครั้งเดียวใน shared library จบเมื่อทุก asset และความสามารถมีสถานะ
5. **สร้างบอร์ดรายฉาก**: ใช้ path ด้านล่าง วาด key panels พร้อมชื่อ shot/panel และเวลา แสดงตำแหน่งคน/prop/ฉากหลัง สายตา foreground occlusion และท่าทางให้เข้าใจ แยกลูกศร actor motion กับ camera motion ด้วย label แสดงกรอบ Short/Long หรือคู่ภาพเมื่อ crop เดียวสื่อไม่ได้ กันพื้นที่ซับตาม AGENTS.md จบเมื่อ dev อ่านภาพและจับการเปลี่ยนแปลงสำคัญได้โดยไม่ต้องเดาจาก VO อย่างเดียว
6. **วางเวลาและเสียง**: ใช้ frames แบบจำนวนเต็มตาม fps ของโปรเจกต์ ช่วงเวลาเป็น `[startFrame, endFrameExclusive)` ระบุว่าเป็น shot-local, scene-local หรือ composition-global พร้อม offset ห้ามปนกัน ระบุเสียงเริ่ม การหัน การเข้าเฟรม reveal และ hold เป็นเวลาเฉพาะ เก็บ VO/บทพูดเต็มหรือชี้ช่วงต้นฉบับที่หาได้แน่นอน แยกข้อความซับจาก VO และระบุส่วนย่อโดยไม่เปลี่ยนความหมาย จบเมื่อผลรวมช็อตเท่ากับระยะฉากและลำดับเสียง/ภาพไม่ขัดกัน
7. **ตรวจภาพและจังหวะ**: export/เปิดภาพบอร์ดตรวจจริงในสองสัดส่วน ตรวจข้อความไทยไม่ล้น focal point ไม่หลุด และ key action มองเห็น เมื่อมีเสียงและเครื่องมือ ให้ต่อภาพเป็น animatic รายฉากพร้อมเสียงชั่วคราวหรือเสียงที่ได้รับมา ทดสอบ pacing และการอ่านซับ บันทึกว่า estimated หรือ checked-with-audio/animatic ตามหลักฐาน หากยังตรวจไม่ได้ ให้ระบุสิ่งที่ค้างอย่างตรงไปตรงมา
8. **ส่ง scene pack**: ส่งไฟล์ที่ครบตามแม่แบบด้านล่าง พร้อม readiness และ unresolved decisions ตรวจ final state ของฉากก่อนกับ entry state ฉากนี้ และ exit กับฉากถัดไปที่ทราบ รายงานข้อขัดแย้งโดยไม่เปลี่ยนบทเงียบ ๆ จบเมื่อ dev รู้ว่าต้องสร้างอะไร ใช้ asset ใด และเทียบงานกับภาพ/เฟรมไหน

## ไฟล์ส่งมอบ

ใช้โครง `storyboards/<episode>/` ตาม AGENTS.md; เติม chapter ในชื่อฉากเพื่อแยกค้นง่าย:

```text
storyboards/haunted-episode/
  index.md
  ch01-sc02.excalidraw
  ch01-sc02.md
  ch01-sc03.excalidraw
  ch01-sc03.md
```

`index.md` เป็นจุดรวมแผนและสถานะของ sequence โดยลิงก์ไป scene sheets ซึ่งถือรายละเอียดรายฉาก:

- Episode/chapter/scene IDs, ลำดับ, script/review/visual-brief/board revisions, decision IDs และลิงก์ scene packs/brief
- Shared elements: actor/asset IDs, appearance ที่ต้องคง, path/owner, dimensions/anchors หรือข้อกำหนดที่ยังรอทำ, สถานะ implementation และฉากที่ใช้
- Development order: foundation/capability → scene integration/polish, dependency issues/PRs และสถานะ merge
- Blockout brief และสถานะผลตรวจ: timeline path/input props เมื่อบอสทำแล้ว, shot → timeline index/frame ranges, revision/evidence ของ Short และ Long, placeholders กับรอยต่อที่ยัง unverified

บอสอัปเดตส่วน runtime mapping/หลักฐาน มาร์คดูแลแผนภาพและการเปลี่ยน revision รักษา timing รายละเอียดใน scene sheet กับ executable timeline ให้ตรงกันโดยไม่คัดลอก shot sheet ทั้งหมดมาไว้ใน index หาก index ยาวให้ลิงก์ตาราง assets หรือ development plan ข้างเคียงจากที่นี่ Generated exports, contact sheets และ animatics อยู่ใน `out/storyboards/<episode>/` ตามการ ignore ของ repo

บอร์ดแต่ละไฟล์เป็น Excalidraw JSON ที่เปิดแก้ได้และมี panels เฉพาะฉากนั้น ใช้ schema ที่เข้ากับ Excalidraw ปัจจุบัน ตรวจว่าไฟล์ parse ได้และตรวจภาพ export เมื่อทำได้ ไฟล์ภาพนิ่งอย่างเดียวไม่ถือว่าได้ส่ง editable board แล้ว

ไฟล์ scene sheet เป็นผู้ถือข้อมูล timing/asset/review ของฉากนั้น ตัวอย่างนี้เป็น **แบบฟอร์ม authoring** ไม่ใช่ runtime JSON schema:

```markdown
# E01-C01-S02 — ชื่อฉาก
Revision: 1 | Status: draft / needs-input / ready-for-dev
Script: path + revision + paragraph/line range
Visual brief: path + revision + Film decision IDs
Storyboard: ch01-sc02.excalidraw
Timing: estimated / checked-with-audio / checked-with-animatic
FPS: 30 | scene durationFrames: ... | chapter/composition offset: ...

## หน้าที่ของฉาก
- คนดูต้องรู้อะไร และอารมณ์ก่อน → หลัง:
- Beats และช่วงบทต้นฉบับที่แต่ละ beat ครอบคลุม:
- สิ่งที่ตัวละครรู้ / คนดูรู้ / ยังไม่เปิดเผย:
- ข้อเสนอเปลี่ยนบทหรือข้อมูลที่ขาด (ถ้ามี):

## Continuity
- Previous / next scene IDs และ scene-sheet revision; ปลาย sequence ที่ไม่มีเพื่อนบ้านตามแผนใช้ N/A, ส่วนข้อมูลที่ยังไม่ได้รับใช้ unverified:
- Entry: actor IDs/appearance, ตำแหน่งพร้อม coordinate space, ทิศหัน/สายตา,
  pose/contact anchors, prop IDs/มือที่ถือ, ประตู/หน้าต่าง/ไฟ, เวลาและสถานที่;
  อ้าง exit ของฉากก่อน
- Exit: สถานะชุดเดียวกันหลังฉาก; อ้าง entry ของฉากถัดไป
- Audio: composition offset/ช่วง VO หรือเสียงที่ข้ามรอยต่อ และ timing status:
- Cut / transition / time jump / การข้ามแกนโดยตั้งใจ และเหตุผล:
- Boundary checks: frame ranges สองสัดส่วน, expected และ evidence หรือ unverified:

## Assets และ capabilities
| ID | บทบาท | สถานะ | หลักฐาน path/registry | งานที่ dev ต้องเพิ่ม |
| ... | ... | missing | ... | ... |

## วิธีผลิตตาม Film brief และรายละเอียดที่มาร์คเพิ่ม
- Set / characters / props / effects: 2D / 3D / hybrid และ library:
- เหตุผลด้านเรื่องและคุณภาพภาพ:
- หลักฐาน feasibility / ความยาก / ข้อมูลที่ยังไม่รู้:
- Reuse / dependencies / fallback / สิ่งที่ต้องพิสูจน์ด้วย blockout:

## Art direction
- Mood / palette หรือ color-key panel:
- แหล่งแสง ทิศทาง ความนุ่มแข็ง และลำดับสว่าง–มืด:
- เงา/สิ่งบังที่มีผลต่อเรื่องหรือ contact:
- แสง/สีที่เปลี่ยนตาม beat และ continuity กับฉากข้างเคียง:
- วิธีทำตาม 2D/3D/hybrid และข้อจำกัดที่ยังไม่ทดสอบ:

## SH01 — หน้าที่ของช็อต
- Shot ID / panels:
- ช่วง frame แบบ scene-local [start, endExclusive):
- Short framing / Long framing; focal point; subtitle-safe region:
- Camera: ขนาดภาพ มุม ตำแหน่งและการเคลื่อน; FG/MG/BG:
- Acting: ตัวละคร การกระทำ ท่าหลัก สายตา และ motion arrow:
- Events (shot-local frames): เสียง / action / reveal / hold:
- VO / dialogue: ข้อความเต็มหรือ source range:
- Thai subtitle: ข้อความและช่วงแสดง:
- Sound / light / transition:
- Runtime mapping: planned หรือ verified path + timeline index:

## เกณฑ์ตรวจรับ
| Shot / panel | Local frame + clock | สิ่งที่ต้องเห็นหรือได้ยิน | หลักฐาน Short / Long |
| ... | ... | ... | ... |

## ส่งต่อ dev
- ขอบเขตฉากนี้ / shared assets ที่เป็น dependency / foundation PRs:
- Sequence index / blockout brief / runtime blockout revision และสถานะก่อน polish:
- ข้อจำกัดและ fallback ที่เสนอ (ยังไม่ใช่การอนุมัติแทนผู้ใช้):
- สิ่งที่ตรวจแล้ว / ยังไม่ได้ตรวจ / คำถามที่ค้าง:
```

ใช้ `ready-for-dev` เมื่อ coverage, ภาพ, timing ที่ระบุระดับความมั่นใจ, dependencies, entry/exit และเกณฑ์ตรวจครบ เป็นความพร้อมของ handoff ให้บอสเริ่ม implementation/blockout ไม่ใช่การอ้างว่าผู้ใช้อนุมัติหรือ runtime render ผ่านแล้ว ก่อน scene polish ต้องมีหลักฐานตรวจ assembled blockout ตาม AGENTS.md ระบุเพื่อนบ้านหรือรอยต่อที่ขาดเป็น unverified

## เกณฑ์ภาพและการตรวจ render

- จุดสนใจหลักและการกระทำอ่านออก แม้ปิดเสียง VO; ความหมายเชิงภาษาอาจยังต้องอาศัยบทตามปกติ
- ทุก beat สำคัญมีภาพก่อน/ขณะ/หลังเท่าที่จำเป็น ไม่มีสูตรจำนวน panels หรือจำนวนช็อตตายตัว
- ตำแหน่ง ทิศทาง สายตา prop และสถานะฉากต่อเนื่อง ข้ามแกนได้เมื่อมีเหตุผลที่บันทึกไว้
- สี แสง รูปร่าง และกล้องรักษาความต่อเนื่องของช่อง และตรงเจตนาของบอร์ด กฎช่องใน AGENTS.md แยกจากหลักการภาพยนตร์ทั่วไป
- เช็กเสียงนำภาพ reveal และเวลาค้างจริงใน animatic ก่อนอ้างว่า timing ลงตัว ภาพนิ่งยืนยัน pacing ไม่ได้
- ตรวจสองสัดส่วนตาม AGENTS.md โดยรักษา beat และสัดส่วนตัวละคร ไม่สมมติว่า crop อัตโนมัติแล้วจะผ่าน

ตัวอย่างเกณฑ์ที่ตรวจได้: “`SH02-P02`, shot-local F54: เงาเพิ่งเข้าจากขอบขวาหลังเสียงเคาะที่ F36; F53 ยังเห็นทางเดินว่าง; เห็นเหตุการณ์ครบใน Short และ Long” ตัวเลขเป็นตัวอย่างวิธีเขียน ไม่ใช่ timing ที่อนุมัติให้เรื่องใด

เมื่อรีวิว render ให้ระบุ board revision, composition, shot ID, ชนิด clock และ frame/timecode ของหลักฐาน เทียบ start/key action/reveal/end รวมการเล่นฉากก่อน → ฉากที่แก้ → ฉากถัดไปจาก timeline รวม และคู่เฟรมตรงรอยต่อ แยก intentional cut/time jump ออกจาก continuity defect รายงาน expected → observed → owner ที่ควรแก้ (rig, prop, camera, scene timing ฯลฯ) และผลกระทบต่อฉากข้างเคียง ขาดเสียงหรือภาพสัดส่วนใดให้ระบุว่า unverified

หาก dev พบปัญหาเชิงเทคนิค ให้ทำข้อเสนอแก้พร้อมผลต่อเรื่องและสองสัดส่วน ปรับบอร์ดเมื่อมีการเลือก revision ใหม่อย่างชัดเจน รักษา IDs เดิมและบันทึก change log เพื่อให้เทียบรอบถัดไปได้

## หลักการอ้างอิง

อ่าน [storyboard-principles.md](storyboard-principles.md) สำหรับแหล่งวิจัยเรื่อง story purpose, staging, continuity, anticipation, suspense และ animatic พร้อมข้อสังเกตจากไฟล์ตัวอย่างของผู้ใช้
