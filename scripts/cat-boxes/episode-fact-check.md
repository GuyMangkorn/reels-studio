# CATBOX — ตรวจข้อเท็จจริงบทโดยโบ็ต

- Review revision: **FC-R2 (complete)**; ผู้ตรวจ: โบ็ต (Boat); 26 ตุลาคม 2026
- Research baseline: [research.md R1](research.md). ผลตรวจนี้เป็น pass หลังเขียน แยกจาก research pass
- Script scope: [episode-script.md](episode-script.md), [ch01-script.md](ch01-script.md)–[ch06-script.md](ch06-script.md); ตรวจทั้ง Long, Short, ชื่อ, hooks, ซับย่อ, ข้อความภาพ และคำสั่งภาพที่มี factual implication
- Final script revision ที่ตรวจ: **R2 ทั้ง 7 ไฟล์**; ผลสุดท้าย **ready-for-storyboard ด้านข้อเท็จจริง**. แก้และตรวจซ้ำ REV01–03 ครบแล้ว ไม่พบ factual gap ที่กระทบ premise/payoff ค้างในถ้อยคำฉบับนี้. เป็นผลตรวจ ไม่ใช่อนุมัติบท/ภาพจากผู้ใช้; ยังไม่สร้าง storyboard
- Timing: `estimated` ตามบท; factual review ไม่ใช่การอ่านออกเสียง/ทดสอบ Niwat 1.05 หรือการอนุมัติของผู้ใช้

## แหล่งที่เปิดตรวจใหม่ใน pass นี้

เปิดส่วนที่ใช้อ้างโดยตรงอีกครั้ง ไม่ใช้ ledger เป็นหลักฐานแทนต้นฉบับ. URL และบรรณานุกรมเต็มอยู่ research R1; ตารางนี้บันทึกขอบเขตที่ตรวจจริง

| Source | อ่านใน pass นี้ | ข้อจำกัด |
| --- | --- | --- |
| [SRC001 Smith 2021](https://gwern.net/doc/cat/psychology/2021-smith-2.pdf) | §§2.3–4, Tables2–3, ผล/ข้อจำกัดกลุ่มตัวอย่าง; ตรวจ Table3 เทียบยอดรวม | สำเนาต้นฉบับ ไม่ใช่หลักฐานอิสระเพิ่มอีกชิ้น; dataset เล็ก/attrition สูง |
| [SRC002 Vinke 2014](https://research-portal.uu.nl/en/publications/will-a-hiding-box-provide-stress-reduction-for-shelter-cats/) | Abstract ของ university record | ไม่ได้อ่าน methods เต็ม/รายละเอียดการปกปิดผู้ประเมิน |
| [SRC005 EFSA 2023](https://efsa.onlinelibrary.wiley.com/doi/full/10.2903/j.efsa.2023.8213) | §§3.3.2.2,3.3.3.1, Table7 | แหล่งทบทวน; ไม่ใช่ตรวจงาน1970เต็ม. G01ยังเปิดอยู่ |
| [SRC007 AAFP/ISFM 2013](https://catcentric.org/wp-content/uploads/2013/02/AAFP-and-ISFM-Feline-Environmental-Needs-Guidelines-2013.pdf) | Pillar1 pp222–223, Pillar3 pp224–225 | แนวทางผู้เชี่ยวชาญ ไม่ใช่ทดลองแรงจูงใจลงกล่อง |
| [SRC008 van der Leij 2019](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0223492) | Abstract, methods, results: CSS/น้ำหนัก/adoption/LOS; discussion | แยกจาก2014; การรับเลี้ยง/LOSติดตามถึงหลังช่วง12วัน |
| [SRC009 Machado/Genaro 2014](https://www.researchgate.net/publication/268820600_Influence_of_olfactory_enrichment_on_the_exploratory_behaviour_of_captive-housed_domestic_cats) | Author-upload full text: Animals and study location, Results, Discussion | วัตถุทดลองเป็นลูกบาศก์ไม้หุ้มผ้า ไม่ใช่กล่องเปิดให้นั่ง |
| [SRC010 สัมภาษณ์ Smith](https://www.livescience.com/why-do-cats-like-boxes) | คำเสนอเรื่อง side pressure และ ambush | ใช้ยืนยันสถานะข้อเสนอจากผู้ถูกสัมภาษณ์ ไม่ใช่ experimental proof; ไม่ใช้ข้อสรุปอื่นในบทความแทนprimary sources |

SRC003–004/G01ไม่เปิดตรวจ methods/n เพิ่ม เพราะบทห้ามอ้างตัวเลขนั้นอยู่แล้ว; SRC006ใช้ตามขอบเขต research หากบทต้องเพิ่มรายละเอียดจะต้องเปิดตรวจตรงอีกครั้ง

## ประเด็นส่งกลับแพรว — ประวัติ findings R1 (ปิดครบใน R2)

| ID / ฉบับที่พบ | จุด / ถ้อยคำตรง | Verdict / เหตุผล | คำแก้และผลกระทบ |
| --- | --- | --- | --- |
| REV01 / C02 R1 | U02-B02 “ติดตามสิบสองวัน” | needs-qualification: ช่วง12วันเป็นCSS/น้ำหนัก; adoption/LOSเก็บต่อหลังจากนั้น | “วัดคะแนนกับน้ำหนักในสิบสองวันแรก”; ปรับmetadata/ข้อความภาพที่บอกระยะติดตามทั้งงานหากมี |
| REV02 / C02 R1 | U02-B02/B03, S01-B03 และซับ: “ไม่พบผลสำคัญ” | needs-qualification: คำสำคัญเฉยๆสลับstatistical significanceกับpractical importance | ระบุ “ไม่พบความต่างอย่างมีนัยสำคัญ” หรือ “ยังไม่พบความต่างชัดเจนทางสถิติ”; ทุกsurfaceที่เกี่ยวต้องแก้พร้อมกัน |

## Coverage / คำกล่าวอ้างที่ตรวจ — R1 พร้อม recheck R2 ด้านล่าง

ชื่อและคำถามที่ไม่ได้ยืนยัน premise เป็นfactตรวจตามimplied claim; บทสนทนา/มุกสมมติตรวจว่ามีป้ายและไม่ใช้เป็นหลักฐาน. แต่ละแถวรวมเฉพาะการกล่าวซ้ำที่ความหมายตรงกัน โดยระบุทุกsurfaceที่พึ่งพาแถวนั้น

### Episode และ C01 — ตรวจ R1 และยืนยัน carry-forward R2

| Claim / จุด | ถ้อยคำตรงหรือsurfaceที่ตรวจ | ประเภท / verdict | Evidence + locator / เหตุผล |
| --- | --- | --- | --- |
| F012 / episode logline, ending, CL01–05; C01-U01-B01/B02, U02-B04 | “โมจิกลับไปนั่งในกล่องเก่า”; “เจ้าของโมจิเห็นคลิป”; ป้ายเรื่องสมมติ/ช่องเพราะว่าง | fiction / not-factual | ตัวละครกับการกระทำแต่ง; ไม่ให้เป็นตัวอย่างทดลองจริง ไม่เพิ่มข้อยืนยันแรงจูงใจ |
| F001/F003 / ชื่อตอน,C01ชื่อ,U01/U02/S01 hooks,U01-B04,S01-B01/B04 และซับ | “มีแมวบางตัวเลือกเข้าไปอยู่ในกรอบจริง”; “บางตัวทำ”; “ไม่ใช่ทุกตัว” | fact+qualification / supported | SRC001 §§3.1/4; ไม่เหมารวมอัตราประชากร |
| F001 / U01-B02/B03,S01-B02,ข้อความภาพ3สิ่งเร้า | “จัดรูปกระดาษบนพื้นที่บ้าน”; square/Kanizsa/control,ทิศเข้า–ออก | fact / supported | SRC001 §2.3/Figs2–3; ภาพเติมขอบมีป้ายและลบก่อนแสดงสิ่งเร้าจริง |
| F002 / U02-B01/B02,S01-B02,ซับ/ภาพตัวเลข | “ผู้สมัครห้าร้อยหกสิบเอ็ด”; “ทำครบหกรอบเหลือสามสิบ”; “เก้าตัว”; “สิบหกครั้ง…แปด…เจ็ด…หนึ่ง”; “ทุกข้าง…สามวินาที” | fact / supported | SRC001 §§2.4.4–3.1/Table2; จำนวนครั้งไม่สลับจำนวนแมว |
| F003 / U02-B03/B04,S01-B03/B04,ซับและป้ายผลคู่ | “คู่คานิซซากับแบบควบคุมพบความต่างอย่างมีนัยสำคัญ”; square–controlไม่พบ; “ไม่ได้แปลว่าเท่ากัน” | fact+interpretation / supported | SRC001 Table3/§4; รวม16ครั้งไม่ถูกใช้แทนpairwise |
| F003 / U02-B03,S01-B01/B04;ภาพกำแพงใสที่ห้ามใช้ | “ไม่ได้พิสูจน์ว่าแมวเห็นเหมือนเรา หรือเชื่อว่ามีกำแพงใส” | qualification / supported | SRC001 design/§4ไม่วัดความเชื่อเช่นนั้น; ยังรักษาสถานะข้อเสนอการรับรู้ขอบ |

### C02 — บันทึกตรวจ R1; ผล R2 ที่แก้ดูส่วน recheck

| Claim / จุด | ถ้อยคำตรงหรือsurfaceที่ตรวจ | ประเภท / verdict | Evidence + locator / เหตุผล |
| --- | --- | --- | --- |
| F004 / ชื่อ/hooks,U01-B01/B04,S01-B01/B04,ซับ | “ที่ซ่อนช่วยให้ปรับตัวได้เร็วขึ้นในบริบทที่ศึกษา”; ชื่อ “ไม่ใช่ยาวิเศษ” | fact+qualification / supported | SRC002 abstract; ไม่อ้างรักษาทุกแบบ/ทุกบริบท |
| F004 / U01-B02,S01-B02 และซับ/ภาพปี/จำนวน | “เนเธอร์แลนด์ปีสองพันสิบสี่”; “สิบเก้า…สิบ…เก้า…สิบสี่วัน”; CSSจากพฤติกรรม | fact / supported | SRC002 abstract; ไม่มีcortisol/protocolใหม่ |
| F004 / U01-B03,S01-B02 และซับ/ภาพ | “วันที่สามกับสี่…ต่ำกว่าอย่างมีนัยสำคัญ”; วันที่14ค่าเฉลี่ยเท่ากัน/กลุ่มกล่องถึงราววันที่3 | fact / supported | SRC002 abstract; คำเท่ากันตรงabstractของงานนี้ ไม่ใช่อนุมานจากpไม่significantของงานกรอบ |
| F005 / U02-B02,ซับ/ภาพ | “ปีสองพันสิบเก้า…อีกงานหนึ่ง”; “ยี่สิบสาม…สิบสองกับสิบเอ็ด” | fact / supported | SRC008 abstract/methods; groupsถูกต้อง |
| F005 / U02-B02/B03,S01-B03 และซับ | CSSลดเร็วกว่า; “ไม่พบผลสำคัญ”กับน้ำหนัก/รับเลี้ยง/ระยะพัก | fact / needs-qualification | SRC008 abstract/results; ผลเชิงสถิติตรงแต่แก้ศัพท์ตามREV02 และช่วงติดตามตามREV01 |
| F005 / U02-B03,ซับ | “ไม่พบผล ไม่ได้พิสูจน์ว่าผลเป็นศูนย์” | qualification / supported | แยกnon-significanceออกจากproof of no effect; ไม่เสริมข้อสรุปเหนือdata |
| F011/F003/F004 / U01-B04,U02-B04,S01-B04,ซับ/ภาพ | “ยังไม่ได้บอกอะไรเรื่องกรอบเทป”; “กรอบแบนยังบังตัวไม่ได้” | fact+scope / supported | SRC007 Pillar1 + SRC001/SRC002 designs; งานที่หลบไม่ทดสอบเทปลดเครียด |
| fiction / U02-B01/B04,ข้อความ “ช่วยทุกอย่าง”ขีดออก,แฟ้มสองกอง | เจ้าของเกือบเหมารวมแล้วแก้ | fiction / not-factual | ความเข้าใจผิดถูกแก้ในbeatเดียว;ไม่ปล่อยเป็นfactผู้เล่า |

### C03 — ตรวจ R1 และยืนยัน carry-forward R2

| Claim / จุด | ถ้อยคำตรงหรือsurfaceที่ตรวจ | ประเภท / verdict | Evidence + locator / เหตุผล |
| --- | --- | --- | --- |
| fiction / ชื่อ/hooks,U01-B01/B04,S01-B01/B04,ภาพโมจิพุ่ง | “โมจิพุ่งตาม”; “กล่องคือฐานล่า”เป็นข้อเดาที่แก้ | fiction / not-factual | ป้ายก่อนเหตุการณ์;ของเล่น/กลับนั่งไม่ใช่ทดลองหรือcontrol |
| F008 / U01-B02,S01-B02,ซับ/ภาพลำดับ | “แมวมีพฤติกรรมย่อง ไล่ และพุ่งจริง”; แนวทางเปิดโอกาสเล่นล่า | fact / supported | SRC007 Pillar3 pp224–225; แยกจากเหตุลงกล่อง |
| F008 / U01-B03,U02-B03/B04,S01-B02/B04,ป้ายสมมติฐาน | “กล่องอาจใช้เป็นที่ซุ่มเล่นได้”; “ยังไม่ใช่เหตุผลที่ยืนยันแล้วของการนั่งทุกครั้ง” | hypothesis+qualification / supported | SRC007 Pillar3/SRC010ข้อเสนอซุ่ม; ไม่อ้างว่าทดลองพิสูจน์เหตุเฉพาะ |
| F011 / U02-B01/B02,S01-B03,ซับ/ป้ายsafeplace | “กล่องที่มีหลังคาและช่องเข้า”; “แนวทาง…พื้นที่ปลอดภัย…ยกกล่อง…เป็นตัวอย่าง” | fact / supported | SRC007 Pillar1 pp222–223; แยกกรอบแบนและกล่องเปิดที่บังตัวไม่ได้ |
| F008/F011 / U01-B04,U02-B03,S01-B03/B04,ซับ | “ภาพแค่ตอนพุ่ง ยังอธิบายทุกตอนที่นิ่งไม่ได้”; หน้าที่ไม่เท่ากับเหตุเฉพาะ | qualification / supported | ข้อจำกัดแบบศึกษา/แนวทาง ไม่ใช้ฉากสมมติอนุมานแรงจูงใจจริง |

### C04 — ตรวจ R1 และยืนยัน carry-forward R2

| Claim / จุด | ถ้อยคำตรงหรือsurfaceที่ตรวจ | ประเภท / verdict | Evidence + locator / เหตุผล |
| --- | --- | --- | --- |
| F006 / ชื่อShort/hooks,U01-B01/B03/B04,S01-B01/B03/B04,ซับ/เลข30–38 | “แมวต้องอยู่ร้อนเท่านี้ถึงจะสบาย แต่ข้อสรุปนั้นใช้ไม่ได้”; “อีเอฟเอสเอ…ทักท้วงการตีความ” | fact+qualification / supported | SRC005 §3.3.3.1; เลขเป็นคำอ้างถูกทักท้วง ไม่สรุปค่าขอบTNZหรือคำแนะนำ |
| F006 / U01-B02/B03,S01-B02,ซับ/ป้ายTNZ | “ช่วงอุณหภูมิรอบตัว…คงอุณหภูมิกาย…ไม่ต้องเพิ่มการสร้างความร้อน…หรือ…ระเหย”; “ไม่ใช่…เลือกอยู่เสมอ” | definition / supported | SRC005 §3.3.2.2; แยกสรีรวิทยาจากpreferred/comfort; ไม่มีช่วงตัวเลขใหม่ |
| F007 / U02-B02/B04,S01-B03,ซับ/ป้าย | “ความอุ่นอาจเป็นหนึ่งปัจจัย”; “แมวหาวัสดุที่ช่วยเป็นฉนวนเมื่อหนาว” | factพื้นฐาน+conditional / supported | SRC005 §3.3.3.1; ไม่พิสูจน์เหตุของโมจิหรือทุกกล่อง |
| F007/F011/F001–03 / U02-B01/B03,ซับ/ภาพกรอบ | “กรอบกระดาษไม่มีผนังแบบกล่อง”; “ไม่ได้หักล้างบทบาทความอุ่น…ทุกแบบ” | scope+physical comparison / supported | SRC001 §2.3/SRC007 Pillar1; คำอธิบายแยกสิ่งเร้า ไม่ใช้กรอบหักล้างความอุ่นทุกบริบท |
| fiction / U01-B01/B04,U02-B01/B04,ความคิดผิดขีดออก/แฟ้ม | เจ้าของเกือบสรุปด้วยเลข แล้วเกือบตัดความอุ่นทิ้งทั้งหมด | fiction / not-factual | แก้ในbeatเดียว; ไม่มีปรับอุณหภูมิ/thermogramจำลองผลจริง |

### C05 — บันทึกตรวจ R1; ผล R2 ที่แก้ดูส่วน recheck

| Claim / จุด | ถ้อยคำตรงหรือsurfaceที่ตรวจ | ประเภท / verdict | Evidence + locator / เหตุผล |
| --- | --- | --- | --- |
| F009 / ชื่อ/hooks,U01-B01/B02/B04,S01-B01/B02/B04,ซับ/ป้าย | “มีผู้เชี่ยวชาญเสนอเรื่องสัมผัสด้านข้างจริง”; “ยังเป็นสมมติฐาน” | report+conditional / supported | SRC010คำเสนอSmith; ไม่ใช้บทสัมภาษณ์เป็นproofกลไก |
| F009/G03 / U01-B02/B03,S01-B02/B03,ซับ/ภาพคำอ้าง | “หลักฐานที่เราตรวจในตอนนี้ ยังไม่พบการทดลอง…แยกแรงกด”; “จำอ้อมกอดแม่…ยังไม่มีหลักฐานยืนยันในชุดนี้” | bounded evidence gap / supported | ขอบเขตresearchR1 ไม่ได้อ้างว่าทั่วโลกไม่มีงาน;ห้ามภาพแม่กอดทำให้คำอ้างดูจริง |
| F004/F009 / S01-B03,ซับ | “งานที่พบว่าที่ซ่อนช่วยการปรับตัว ก็ไม่ได้พิสูจน์กลไกแรงกด” | scope / supported | SRC002 abstract ไม่แยกpressure mechanism |
| F010 / U02-B02,ซับ21ตัว/วัตถุไม้/ป้ายชื่อpaper | “แมวโตยี่สิบเอ็ดตัว”; “ไม้ทรงลูกบาศก์หุ้มผ้า ไม่ใช่กล่องเปิด” | fact / supported | SRC009 pp492–496,Animals/Methods/Discussion; author full text |
| F010 / U02-B02 | “ทั้งแบบมีกลิ่นและไม่มีกลิ่น” | needs-qualification / REV03 | SRC009 Methodsเทียบเติมกลิ่นหนูกับไม่เติมกลิ่นหนู ไม่ได้เป็นวัตถุไร้กลิ่นโดยสมบูรณ์; แก้ “ทั้งแบบเติมกลิ่นหนูและไม่เติมกลิ่นหนู” |
| F010 / U02-B03,ซับ | “ความใหม่…อาจอธิบาย…เดินมาสำรวจ”; “ยังไม่ใช่…ทำไมเลือกนั่งหรืออยู่นาน” | conditional+scope / supported | SRC009 Results/Discussion; ไม่ย้ายผลสำรวจไปเป็นสาเหตุนั่งกล่อง |
| fiction / U01ความคิดเจ้าของ,U02-B01/B04,CL05 | “โมจิเดินมาดม…เดินออกไป”; เจ้าของจัดแฟ้ม | fiction / not-factual | ป้ายก่อนการกระทำ;ไม่ใช้แทนการทดลอง21ตัว |

### C06 — ตรวจ R1 และยืนยัน carry-forward R2

| Claim / จุด | ถ้อยคำตรงหรือsurfaceที่ตรวจ | ประเภท / verdict | Evidence + locator / เหตุผล |
| --- | --- | --- | --- |
| F001–03 / ชื่อ/hooks,U01-B01/B02/B04,U02-B01,S01-B01,ซับ/ป้ายทุกตัวต้องลง | “แมวบางตัวเลือกเข้าไปอยู่ในกรอบ”; “ยังยืนยันแบบนั้นไม่ได้”ว่าคิดว่ามีกล่อง | fact+scope / supported | SRC001 §§2.3–4;ไม่สรุปแมวทุกตัวหรือภาพในหัว |
| F004/F005 / U01-B02,S01-B02,ซับ/ป้ายผลวัด | “ที่ซ่อนช่วยให้คะแนนความเครียดลดเร็วในบริบทที่ศึกษา”; งานวัดคนละอย่าง | fact+scope / supported | SRC002 abstract/SRC008 abstract/results;ไม่เอาCSSไปยืนยันกลไกกรอบ |
| F007–F010 / U01-B03,S01-B03,ซับ/ป้ายสมมติฐาน/หลักฐานอ่อน | “เหตุที่อาจเป็นไปได้…ความอุ่น ที่ซุ่มเล่น สัมผัสด้านข้าง”; ความใหม่สำรวจไม่เท่ากับพัก | conditional / supported | SRC005 §3.3.3.1/SRC007 Pillar3/SRC010/SRC009;คงความต่างระดับหลักฐาน |
| F009 / U01-B04,ซับ/ป้ายคำอ้างเกิน | “จำอ้อมกอดแม่แน่นอน ยังเอามาเป็นข้อสรุปไม่ได้” | qualification / supported | G03/SRC010ไม่ยืนยันแม่กอด;ไม่พูดว่าเป็นไปไม่ได้ |
| F011 / U02-B01/B04,S01-B02/B04,ซับ | “กรอบแบน…ไม่ใช่ที่หลบที่มีผนัง”; “กล่องมีหลายหน้าที่” | physical/function synthesis / supported | SRC007 Pillar1,ข้อจำกัดF007–F010;หลายหน้าที่ไม่เท่ากับทราบเหตุเฉพาะ |
| F012 / U02-B02/B03/B04,S01-B04,ป้าย/ending/CL01–04 | “โมจิ…ไปนั่งในกล่องเก่าข้างโซฟา”; “ครั้งนี้ ยังไม่รู้” | fiction / not-factual | payoffจากclueเดิมและป้ายชัด;ไม่เพิ่มคำตอบลับอุ่น/แม่กอดมาลบuncertainty |


## Recheck R2 และผลกระทบที่ตรวจซ้ำ

ผล `needs-qualification` ในตารางด้านบนเป็นประวัติ R1. ตารางนี้แทน verdict เฉพาะข้อความที่แก้ใน R2; ถ้อยคำอื่นตรวจ carry-forward โดยอ่าน R2 เทียบเนื้อหาฉบับที่ตรวจแล้ว ไม่อนุมานว่าผลเก่าครอบคลุมอัตโนมัติ

| Finding | ถ้อยคำ R2 / จุดที่ตรวจซ้ำ | Verdict / หลักฐานและผลกระทบ |
| --- | --- | --- |
| REV01 ปิด | C02-U02-B02 “วัดคะแนนกับน้ำหนักในสิบสองวันแรก”; ซับ “คะแนนกับน้ำหนัก: 12 วันแรก”; mappingระบุเฉพาะผลสองด้าน | supported — SRC008 abstract/methods. อ่าน U02-B03/S01-B03 ต่อเนื่องแล้วไม่จำกัดadoption/LOSว่าเก็บได้แค่12วัน |
| REV02 ปิด | C02-U02-B02/B03 และS01-B03 “ไม่พบความต่างอย่างมีนัยสำคัญทางสถิติ”; ซับทุกจุดที่เกี่ยว “ไม่พบความต่างอย่างมีนัยสำคัญ” | supported — SRC008 results weight loss/adoption/LOS. ตรวจข้อความภาพ/claim mappingและประโยคไม่พบความต่าง≠ผลเป็นศูนย์แล้วไม่เปลี่ยนความหมายหรือยกผลเป็นกฎทั่วไป |
| REV03 ปิด | C05-U02-B02 “ทั้งแบบเติมกลิ่นหนูและไม่เติมกลิ่นหนู” | supported — SRC009 Methods/Results. ตรวจซับ/ภาพ/Shortร่วมแล้วไม่มีคำวัตถุไร้กลิ่นทั้งหมด;ยังเป็นลูกบาศก์ไม้หุ้มผ้าไม่ใช่กล่องเปิด |
| Carry-forward | Episode logline/CL01–05/ending; C01/C03/C04/C06ทุกLong/Short/ซับ/ภาพ/หัวข้อ; C02/C05ส่วนอื่น | supported หรือ not-factual ตาม coverageเดิม — เนื้อหาเดิมมีแค่เปลี่ยนrevision/header/บันทึก;ไม่มีfactual dependencyใหม่ที่ทำให้ผลเดิมใช้ไม่ได้ |

## Coverage สุดท้ายและข้อจำกัดที่ยังต้องรักษา

อ่านครบ **72 beat blocks**: C01–C06 × (U01 4 + U02 4 + S01 4) รวม12Long units/6Short; ตรวจ72VO blocks พร้อมซับที่แยกไว้ทั้งหมด และepisode framing/clue ledger/handoffs/title/hooks/ข้อความภาพ/คำห้ามใช้ภาพ. ตารางcoverageจัดกลุ่มการกล่าวซ้ำที่ใช้claimเดียวกัน ไม่ใช่สุ่มตรวจบางbeat. มุกโมจิและคำเดาของเจ้าของตัดสินnot-factualพร้อมตรวจความเสี่ยงทำให้ดูเป็นผลทดลอง

ไม่พบ `contradicted` หรือ `unverified` ที่จำเป็นต้องใช้เป็นfactในR2. G01ยังไม่รู้n/วิธีการเต็มปี1970 แต่บทไม่อ้างn ไม่จำลองข้อมูลนั้น และอ้างEFSAเป็นผู้ทักท้วงช่วงตัวเลข. G02ยังจำกัดงาน2014ที่abstract บทไม่เพิ่มprotocol/cortisol. G03ยังไม่ยืนยันแรงกด/แรงจูงใจเฉพาะครั้ง แต่บทพูดเป็นสมมติฐานและคงคำยังไม่รู้ในending. จึงไม่ต้องแก้gapนอกขอบเขตเหล่านี้ก่อนร่างภาพตามบทR2

ความพร้อมนี้จำกัดด้านข้อเท็จจริงและการแยกเรื่องแต่งกับหลักฐาน. เวลา9:00/45sยังestimated; ต้องอ่านออกเสียง/ทดสอบเสียง และMark/Bossต้องตรวจภาพจริงว่าป้ายqualification/ช่องขาดของสิ่งเร้า/ตัวเลขและท้ายเรื่องยังเห็นอ่านได้. ภาพหรือบทใหม่ที่เพิ่ม/เปลี่ยนclaimต้องส่งตรวจอีกครั้ง. ไม่เคยมีผลrenderหรือuserapprovalในpassนี้

ไฟล์บทคงคำdraft-for-fact-checkเป็นสถานะขณะผู้เขียนfreeze; รายงานFC-R2นี้บันทึกผลหลังตรวจและใช้คู่scriptR2/researchR1ส่งต่อMarkได้ โดยไม่จำเป็นต้องเปลี่ยนถ้อยคำบทเพื่อเลื่อนสถานะเอง

## Fingerprint ของไฟล์ที่ตรวจ R2

SHA-256 ใช้ระบุเนื้อหาที่ผลตรวจนี้ครอบคลุม; หากไฟล์เปลี่ยน ต้องตรวจchange impactก่อนใช้ผลต่อ

| File | SHA-256 |
| --- | --- |
| [episode-script.md](episode-script.md) | `d5502287a6d1a387a2af1c8b81ebaeac7bbd7b7808ba91930dc936a0b8e81749` |
| [ch01-script.md](ch01-script.md) | `cfaf6cf83667fa354c7fe5c8a410efc6c3a35b43adc1de518874cb3b3e727424` |
| [ch02-script.md](ch02-script.md) | `856917d3f8b79aa88daf6fccd863766d7a909d58474c84a775ca13b93fde9bfa` |
| [ch03-script.md](ch03-script.md) | `10d3d820466927da747fdf1e4488f1db4f579438af68bc6026cb484b499ed052` |
| [ch04-script.md](ch04-script.md) | `ed120d80c594b931fdf4d98aef95afa5d590d55212c1dc27de4babe2bef8e528` |
| [ch05-script.md](ch05-script.md) | `e1518c537c42670baad2d31a3eb030feb317d23f384719d7af346ea986af1d40` |
| [ch06-script.md](ch06-script.md) | `374857c7e3cc11fd33c80b48495462921c02b179ee5fbd8482207cb2752d7ce3` |

Change log FC-R2: ตรวจทุกsurfaceR1 → ส่งREV01–03ให้แพรวแก้ → เปิดอ่านR2/recheckข้อความเปลี่ยนและcarry-forwarddependenciesครบ → สรุปพร้อมด้านข้อเท็จจริงเฉพาะR2. ไม่มีการแก้บทโดยBoat ไม่มีGitHubmutation/commit/pushในงานตรวจนี้

## Recheck R3 — VO polish

- Review revision: FC-R3 initial pass; reviewer: Boat; access date: 26 ตุลาคม 2026.
- Research baseline: research R1. Exact script revision reviewed: episode-script.md R3 and ch01–ch06 R3.
- Scope: all 72 Long/Short VO blocks across six chapters, including spoken hooks and factual implications; checked changed episode-level revision/handoff metadata and related study-year wording. Subtitles, visual directions, claim mappings and source list remain R2; R2 review coverage is retained only for surfaces verified unchanged. This pass does not inherit R2 verdicts for changed VO.
- Outcome: revision-required. The evidence, methods and uncertainty remain correctly bounded in most revised lines, but six spoken year references need to identify publication year rather than study date; one count changes the unit to people; three temperature references omit Celsius.

### R3 findings

| Claim / location | R3 wording or issue | Verdict | Evidence + locator | Precise correction |
| --- | --- | --- | --- | --- |
| F001–F003 / C01-U01-B02 and C01-S01-B02 | “งานนี้ทำในปีสองพันยี่สิบเอ็ด” states that the study was conducted in 2021. | needs-qualification | SRC001 §§2.1–2.2: data were collected June–August 2020; the paper was published online 30 April 2021 and in the 2021 journal issue. | Change to “งานวิจัยชิ้นนี้ตีพิมพ์ในปีสองพันยี่สิบเอ็ด.” |
| F002 / C01-U02-B01 | “ผู้สมัครห้าร้อยหกสิบเอ็ดคน” turns 561 preliminary-survey enrollments into a count of people. | needs-qualification | SRC001 §2.2 and §3.1: cats were enrolled by their owners; the preliminary survey had 561 enrollments. The result is reported as enrollment records, not a confirmed count of unique people. | Change to “แบบสำรวจแรกมีผู้สมัครห้าร้อยหกสิบเอ็ดราย.” Keep 30 completed cats, six trials, nine cats with a selection, and 16 selections separate as in R3. |
| F004 / C02-U01-B02 and C02-S01-B02 | “งานนี้ทำ…ในปีสองพันสิบสี่” implies the trial was conducted in 2014. | needs-qualification | SRC002 is accessible only at institutional-abstract/record level; it establishes a 2014 publication and reports the 19-cat, 14-day trial, but the accessible material does not establish the data-collection year. G02 remains. | Change to “งานที่ตีพิมพ์ในปีสองพันสิบสี่ศึกษาแมวที่เพิ่งเข้าศูนย์พักพิงในเนเธอร์แลนด์.” |
| F005 / C02-U02-B02 and C02-S01-B03 | “งานติดตามอีกชิ้นทำในปีสองพันสิบเก้า” says the PLOS study was performed in 2019. | needs-qualification | SRC008, Materials and methods (study population): cats entered the shelter between 4 November and 30 December 2015; the article was published 14 October 2019. | Change to “งานติดตามอีกชิ้นตีพิมพ์ในปีสองพันสิบเก้า.” The remaining R3 facts are supported: 23 cats (12/11), first 12 days, CSS declined faster with a box, and tests did not find significant differences in weight loss, adoption rate or length of stay. |
| F006 / C04-U01-B01, C04-U01-B03 and C04-S01-B01 | The spoken range says “สามสิบองศา” and “สามสิบแปดองศา” without naming the Celsius scale. | needs-qualification | SRC005 §3.3.3.1 reports the disputed range as 30–38°C; SRC006 Table 3-1 also gives a Celsius range. | Say “สามสิบองศาเซลเซียส” and “สามสิบแปดองศาเซลเซียส.” Keep each endpoint in its own sentence. |
| F003 / C01-U02-B03 and C01-S01-B03 | Plain wording “ผลทดสอบจับความต่างได้/แยก…ไม่ได้” summarizes pairwise test results. | supported | SRC001 Table 3: Kanizsa–control p<.05; square–control p=.40; Kanizsa–square p=.29. | No correction required. In context, “จับความต่างไม่ได้” is a plain rendering of a non-significant result; the following line correctly says that this does not prove equality. |
| F004 / C02-U01-B03 and C02-S01-B02 | Lower CSS on observation days three and four; mean scores equal on day 14, with the hiding-box group reaching that level around day three. | supported | SRC002 abstract. | No correction required. Keep this scoped to the shelter cats and behavioral CSS. |
| F005 / C02-U02-B02/B03 and C02-S01-B03 | Faster CSS decline, with no detected significant difference for weight loss, adoption or length of stay; non-significance is not described as proof of no effect. | supported | SRC008 Abstract, Results and Discussion. | No correction required. The limitation in the VO is appropriate. |
| F008/F011 / C03 Long and Short | Predatory play is a real feline behavior; a box can provide concealment, while a flat outline cannot hide the body; the observed toy chase is kept separate from a motive for entering the box. | supported; fictional events are not-factual | SRC007 Pillar 1, pp. 222–223 and Pillar 3, pp. 224–225; SRC010 only supports attribution of an expert proposal, not a proven box-choice mechanism. | No correction required. Keep the chase and Mochi’s motive marked as fiction/hypothesis. |
| F006/F007 / C04 except the missing unit above | The thermoneutral-zone explanation is simplified to spoken language; the VO distinguishes body-temperature regulation from comfort/preference and says the 30–38 range is disputed, not a universal home-temperature rule. Warm-seeking/insulating material is framed as a possible factor, not Mochi’s proven motive. | supported | SRC005 §§3.3.2.2 and 3.3.3.1; SRC006 Table 3-1. | No correction beyond naming Celsius. Do not present the disputed range as a recommended room setting or settled TNZ. |
| F009/F010 / C05 Long and Short | Side contact is attributed as an expert suggestion and remains unconfirmed; the 21 adult cats / novel object / rat-scented versus unscented cube study is described as exploration, not box sitting. | supported | SRC010 interview; SRC009 Methods, Results and Discussion, pp. 492–496. The accessible author manuscript identifies 21 adult cats and three conditions; the cube study does not test a box open for cats to sit inside. | No correction required. Preserve “อาจ,” the limited search wording and the distinction between approaching/exploring and choosing to rest. |
| F001–F012 / C06 Long and Short | The conclusion separates observations from possible reasons; the ending labels Mochi’s return to the old box as fiction and retains “ยังไม่รู้.” | supported; Mochi plot events are not-factual | SRC001, SRC002, SRC005, SRC007–SRC010 as mapped in R1; F012 is dramatization, not study data. | No correction required beyond the year/unit fixes above. |

### Coverage, carry-forward limits and readiness

Read all 72 VO blocks: C01–C06, each with Long U01/U02 and Short S01, four beats per unit. Grouped repeat claims were checked in each occurrence, including hooks, numerical statements, causal wording, study design, comparisons and uncertainty. Reviewed the unchanged subtitles, on-screen study labels, claim mappings and visual notes for dependencies on the rewritten VO. The claim-family results above cover the R3 factual wording; no other factual drift was identified.

Remaining evidence limits from research R1 still apply: SRC002 is abstract-level only, so its protocol and actual data-collection date remain unverified; SRC003–SRC004 are metadata-only, so the 1970 methods/sample sizes remain unknown (G01); the pressure/comfort and specific-motive hypotheses remain unconfirmed (G03). SRC010 is an interview reporting an expert’s proposal, not a test of that mechanism. R3’s TNZ wording appropriately reports EFSA’s concern about interpreting 30–38°C, but the Celsius unit must be spoken. R3’s timing remains estimated and was not audio-tested; that is outside this factual verdict.

R3 status is revision-required, not ready-for-storyboard, until the publication-year wording, 561-enrollment unit and Celsius wording are corrected and the affected surfaces are rechecked. Script approval remains with the user.

### Fingerprint of files reviewed at R3

SHA-256 identifies the exact seven-file snapshot reviewed above. Any later file edit requires a new change-impact check.

| File | SHA-256 |
| --- | --- |
| episode-script.md | 074796f7a6eaf74e34dc2d11f4fc7c751e44919543701b63c1caca0b518ef345 |
| ch01-script.md | 0da40565e65e52f8befb6df0ea4001ff9cd57ef5aed1cb7811ed77dfd830ceb3 |
| ch02-script.md | bc56ac54a98fa7e3dc694ac9cd3a854fadc5b4660d4b76517f5bbb618309c39c |
| ch03-script.md | f29b0773f3e6488a900fd5036002eaed5af79c9868390024b77b81292612b5fb |
| ch04-script.md | 0ab9c292aacc4930d4a1ecb7293ad288869d1a21153faa28a75e93f9ef321d0c |
| ch05-script.md | 286503ca289649ea3c7500303db80aa373d2075610c3b9f36dfe9e6ff85837df |
| ch06-script.md | b4eb7e6b67208e3505aedd439ab365bca127c10cbcc6166a89f2d1813f623bb2 |

Change log FC-R3: ตรวจ VO ครบ 72 blocks และเทียบ research R1; พบ year attribution ที่ต้องแก้ 6 จุด, unit ของ sample enrollment 1 จุด, และการระบุหน่วยเซลเซียสในช่วงอุณหภูมิ 3 จุด. ส่งแพรวแก้เป็น R4; ไม่เปลี่ยนเนื้อหาบท.

## Recheck R4 — ปิดข้อแก้ VO และตรวจ surfaces ที่เกี่ยวข้อง

ตรวจ `episode-script.md` และ `ch01-script.md`–`ch06-script.md` revision **R4** เทียบ research **R1**. ขอบเขต recheck คือ wording ปีตีพิมพ์ C01/C02, จำนวนลงทะเบียน C01, endpoints อุณหภูมิ C04, และ subtitles/ข้อความภาพ/metadata ที่อ้างถึง claims เหล่านี้. VO ที่ไม่เปลี่ยนยังอิงผลตรวจครบ 72 blocks ใน R3; ไม่พบ R4 wording change อื่นใน claim mapping หรือข้อเท็จจริงของ beat. ตรวจซ้ำด้วยไฟล์ปัจจุบันและเก็บ SHA-256 ด้านล่าง.

### R4 findings

| Claim / location | R4 wording or surface | Verdict | Evidence + locator / reason | Precise correction |
| --- | --- | --- | --- | --- |
| F001–F003 / C01-U01-B02 and C01-S01-B02 | “งานวิจัยนี้ตีพิมพ์ในปีสองพันยี่สิบเอ็ด.” | supported | SRC001 §§2.1–2.2, p. 2: data collection ran June–August 2020; paper metadata, p. 1, says online publication 30 April 2021 and 2021 issue. The VO now distinguishes publication year from fieldwork. | None for these VO lines. Keep “ตีพิมพ์” explicit. |
| F002 / C01-U02-B01 | “แบบสำรวจแรกมีผู้สมัครห้าร้อยหกสิบเอ็ดราย.” | supported | SRC001 §2.2 and §3.1: owners enrolled cats through a preliminary survey; the survey received 561 enrollments. “ราย” keeps the spoken count separate from the later 30 cats who completed all six trials and the 9 cats who selected at least once. It does not say 561 cats completed the experiment. | None. If a later surface needs a literal record-count label, use “แบบสำรวจแรกมีรายการลงทะเบียน 561 รายการ.” |
| F004 / C02-U01-B02 and C02-S01-B02 | The shelter study “ตีพิมพ์ในปีสองพันสิบสี่.” | supported, source-limited | SRC002 Utrecht University record, Abstract and publication-status field: 2014 publication; Dutch shelter; 19 cats, 10/9 groups, 14-day CSS observation, and day-3/day-4 differences. The accessible source remains abstract/record only and does not establish when data collection occurred (G02). R4 no longer assigns the trial itself to 2014. | None for VO. Do not add a data-collection year or uninspected method detail. |
| F005 / C02-U02-B02 and C02-S01-B03 | The follow-up study “ตีพิมพ์ในปีสองพันสิบเก้า.” | supported | SRC008 article metadata: published 14 October 2019. Materials and Methods, Animal shelter: cats entered between 4 November and 30 December 2015. The R4 VO now correctly names publication year; the separate sample/outcome wording remains within SRC008 Abstract/Results. | None for VO. |
| F006 / C04-U01-B01, C04-U01-B03, C04-S01-B01 | Each endpoint is now spoken as “สามสิบองศาเซลเซียส” or “สามสิบแปดองศาเซลเซียส.” | supported with qualification preserved | SRC005 §3.3.3.1 reports that some authors give 30–38°C as the cat TNZ, then says this range may have been misinterpreted and should be reconsidered for adult cats. SRC005 §3.3.2.2 distinguishes TNZ from thermal comfort/preference. SRC006 Table 3-1 gives 35–38°C; it confirms a Celsius-scale reference but does not independently establish the whole 30–38°C range. R4 keeps the endpoints in separate spoken sentences and retains the warning that the range is not a universal comfort rule or a home-temperature recommendation. | None for the six VO endpoints. Do not present 30–38°C as settled or as advice. |
| F003 / C01-U02-B03, C01-S01-B03; F004–F005 / C02 comparisons; F006 / C04 TNZ explanation | R4 did not change the plain statistical wording or the spoken TNZ explanation reviewed at R3. | supported; carried forward from R3 | SRC001 Table 3 supports the pairwise comparison wording; SRC002 Abstract and SRC008 Abstract/Results support the shelter-study summaries within their stated limits; SRC005 §§3.3.2.2, 3.3.3.1 supports the simplified physiology distinction. “จับความต่างไม่ได้” remains about the test result, not proof of equality; TNZ remains distinct from comfort or preferred temperature. | None. Preserve the non-significance and TNZ qualifications already recorded in R3. |
| Episode handoff / `episode-script.md`, handoff paragraph | “งานวิจัยเรื่องกรอบของ Smith ตีพิมพ์ในปี 2021; เก็บข้อมูลที่บ้านผู้เข้าร่วม.” The R4 changelog further identifies the collection period as 2020. | supported | SRC001 §§2.1–2.2: the study was conducted June–August 2020; subjects were household pets, and trials were incorporated into the owners’ average day. The handoff now labels 2021 as publication year and describes home data collection; the R4 changelog states the 2020 year explicitly. | None. |

### R4 coverage, access limits and readiness

The six R3 VO year findings are closed in the chapter scripts: C01 now states 2021 as the publication year in Long and Short; C02 does the same for the 2014 and 2019 papers in Long and Short. The 561-enrollment wording no longer calls the count “people,” and all six C04 spoken endpoints name Celsius. The episode handoff now distinguishes the 2021 publication year from home data collection, and its R4 changelog identifies collection in 2020. The author-year on-screen labels (“Smith 2021,” “Vinke 2014,” “van der Leij 2019”) remain bibliographic labels; subtitles do not independently state that fieldwork took place in those years. The pairwise statistical simplifications and TNZ wording carry forward from R3 unchanged.

R4 status: **ready-for-storyboard on factual review**. This is not user script approval. The corrected C01/C02/C04 VO and the clarified episode handoff are supported within the cited source limits.

Source access limits remain: SRC001 was inspected as the available full-text PDF copy; the publisher/CUNY copies were unavailable in R1, and a mirrored copy is not independent corroboration. SRC002 remains accessible only as the Utrecht abstract/record; its full methods and data-collection date are unverified (G02). SRC005 was inspected at §§3.3.2.2, 3.3.3.1 and Table 7; upstream SRC003–SRC004 methods/sample sizes remain uninspected (G01). SRC006 is the previously inspected National Academies Table 3-1 and is not used to corroborate 30–38°C as a whole. Specific pressure, comfort and motive mechanisms remain unconfirmed (G03). R4 timing is still estimated and not audio-tested; this factual recheck does not establish spoken-duration compliance.

### Fingerprints of files reviewed at R4

These SHA-256 fingerprints identify the seven-file R4 snapshot reviewed above. Any later change requires a change-impact review.

| File | SHA-256 |
| --- | --- |
| episode-script.md | 49d9263921dd9e9826451a8526d647c08a2a7ae2c67c4150dfbdcfdc63aab1fa |
| ch01-script.md | f9cf052e11a86ad49f725ba7147e7fe0c9b5f7f7ecf2552f2eab5e1c8b394fa1 |
| ch02-script.md | abf505c06035156b9ae108bad5b7ad2282f3579f507b6a76ce54ffac29439a3f |
| ch03-script.md | be4324e1d356ed82142a9b030eac133ca9daf03f74bb9e93843a26cb6a0455a2 |
| ch04-script.md | 9c4821aaa4d4452a39ca324da9bbf6aabae917e5b9c3da0a14c7f76b7977ed6f |
| ch05-script.md | 0a32919a7aee061eca4d00d2dac1662861bd95aa1458cd1fb57e24350ceb521f |
| ch06-script.md | a71357fdb2b7a9930538971ac5b40d9300e03d81db5eb5befed228ab3bbea7d5 |

Change log FC-R4: rechecked the R3 year, enrollment-unit and Celsius findings against SRC001/002/005/006/008 and related chapter surfaces. The six VO year findings, enrollment unit, Celsius endpoints and episode-handoff year clarification are supported; R4 is factually ready for storyboard handoff, with user script approval separate.

## Recheck R5 — punctuation impact

- Revision reviewed: episode pack and C01–C06 **R5**, research R1. Preaw reports that all 72 VO blocks are word-identical to R4 after punctuation/whitespace normalization and that 94 internal periods became spaces. This pass reviewed the current R5 VO for meaning changes at regrouped clauses; it does not repeat the R4 source review for unchanged wording.
- Verdict: **supported; no factual change found**. Joins preserve the scope and contrast in C01’s pairwise results; C02’s statement that no detected difference does not prove no effect; C04’s warning that the cited 30–38°C range is disputed and not home-temperature advice; C05’s attribution of side pressure as an unconfirmed proposal; and C06’s separation of observed outcomes from possible causes. No joined phrase turns a possibility into a fact, changes a comparison, or removes a material qualification. The year, enrollment and Celsius findings remain as reviewed at R4.
- No punctuation correction is required for factual accuracy. This is an impact check, not a new timing/audio review. R4’s source access limits and factual verdicts carry forward.

### Fingerprints of files reviewed at R5

SHA-256 identifies the current seven-file R5 snapshot. R4 fingerprints and findings above are preserved as history.

| File | SHA-256 |
| --- | --- |
| episode-script.md | 50f44bb058aa60744af156d91ec662999cc47063d5b6b542d4faa769efdf5f35 |
| ch01-script.md | 53dc72945012a8c09682db0c267a50584ca55935a5d93fabda798b90c0962ce7 |
| ch02-script.md | a0bc48f6167f2ae6dc328393d5581e5b42d66adc58f278f18d34eab1fb96540e |
| ch03-script.md | 7b9738baf1076af02c3b9ab3c232902be95942c3d88ff10c463929449cac83da |
| ch04-script.md | 86784f470109f299a2af33e3b1bf15a2b003fad520a584592859738c1024f09f |
| ch05-script.md | 83de1b64cc9e1bcbd29f2aedf7e0dc6532dfceaf1b874733761c14a8163d3f0b |
| ch06-script.md | fb408d0f744de5edb3053b1aa5babe056388495ca31d6e9644d40d95c7b6ba0b |

Change log FC-R5: examined the factual effect of the punctuation regrouping across all 72 current VO blocks. No claim, comparison, causal implication or material qualification changed; R4 evidence checks carry forward.
