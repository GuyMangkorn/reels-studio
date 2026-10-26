# หลักการ storyboard สำหรับมาร์ค (Mark)

ค้นเมื่อ 26 ตุลาคม 2026 สำหรับมาร์ค (Mark) ในโปรเจกต์ Reels Creator: รับบทและ visual/technical brief จาก Film วาง sequence ตามขอบเขต แล้วส่ง storyboard แยกรายฉากให้ dev การตัดสินใจแนวทางภาพอยู่ที่ [workflow Film](film-visual-brief-workflow.md) และ [หลัก cinema](cinematography-principles.md)

ส่วน “สิ่งที่แหล่งต้นทางยืนยัน” เป็นข้อค้นพบจากแหล่งอ้างอิง ส่วนการจัด agent/scene pack และเกณฑ์เลือกเทคนิคเป็นการสังเคราะห์สำหรับโปรเจกต์นี้ คู่มือใช้งานอยู่ที่ [mark-storyboard-workflow.md](mark-storyboard-workflow.md)

## สิ่งที่แหล่งต้นทางยืนยัน

### 1. เริ่มจากสิ่งที่ฉากต้องสื่อ แล้วค่อยเลือกภาพ

นิทรรศการ The Science Behind Pixar ซึ่ง Museum of Science, Boston พัฒนาร่วมกับ Pixar แสดง storyboard ของ Luca เป็นภาพเส้น key moments ที่ค้างแต่ละภาพตามจังหวะของฉาก และอธิบายว่าช่วง story มีการปรับ plot, pacing และ camera angles งาน storyboard จึงมีทั้งหน้าที่เล่าเรื่องและวางการสื่อผ่านภาพ

แหล่ง: [The Science Behind Pixar — Story and Art](https://sciencebehindpixar.org/pipeline/story-and-art)

### 2. แตกฉากเป็น beats แล้วสื่อด้วย key panels

ข้อเสนอจากการสังเคราะห์: ก่อนวาด ให้แบ่งความเปลี่ยนแปลงของฉากเป็น beats เช่น ได้ยินเสียง → หันไปมอง → เห็นเงา → ตัดสินใจเปิดประตู ใช้ภาพ key moment เท่าที่ช่วยสื่อ acting และ motion พร้อมลูกศร/คำอธิบาย ไม่ต้องวาดทุกเฟรม และไม่กำหนดจำนวนภาพเท่ากันทุกฉาก หลักฐานจาก Pixar ข้างต้นแสดงการใช้ภาพ key moments กับระยะค้างภาพที่ต่างกัน

### 3. ต้องตกลงความหมายของ scene, shot, panel

ข้อเสนอสำหรับงานนี้: ใช้ episode/chapter → story scene (เหตุการณ์ในเวลาและสถานที่ต่อเนื่อง) → shot (ช่วงมุมกล้องต่อเนื่อง) → panel (key moment) เพื่อไม่ให้ dev สับสนว่าหนึ่งฉากเท่ากับหนึ่งภาพ นี่คือนิยามของ pipeline ที่เสนอ ไม่ใช่การอ้างว่าทุกสตูดิโอใช้ศัพท์เหมือนกัน

### 4. Staging คือการทำให้ผู้ชมอ่านประเด็นหลักออก

Animation Mentor อธิบายการชี้นำความสนใจผ่านตำแหน่งตัวละคร แสง foreground เส้นนำสายตา และทิศทางบนจอ การจัดหนึ่งในสามหรือกึ่งกลางเป็นเครื่องมือให้เลือกตามเรื่อง ไม่ใช่ตารางที่ต้องใช้ทุกภาพ

ข้อเสนอให้ agent ระบุ: focal point ของ panel, ตัวละครกำลังมองอะไร, gesture ที่อ่านออก, สิ่งใดควรเด่น/รอง และพื้นที่สำหรับซับ ภาพร่างควรพอให้เห็น acting และ spatial relationship ก่อนขัดความสวย

แหล่ง: [Animation Mentor — Staging: The 12 Basic Principles of Animation](https://www.animationmentor.com/blog/staging-the-12-basic-principles-of-animation/)

### 5. Continuity ช่วยให้ผู้ชมติดตามพื้นที่และการกระทำ

Adobe อธิบาย 180-degree rule เป็น guideline ให้กล้องอยู่ด้านเดียวของแกนระหว่างผู้สนทนา เพื่อรักษาความสัมพันธ์เชิงพื้นที่และไม่รบกวนความเข้าใจ และย้ำว่าสามารถข้ามแกนอย่างมีเจตนาเพื่อสื่อความสับสนหรือการเปลี่ยนอำนาจได้ Animation Mentor แนะนำรักษา screen direction ให้คนดูไม่หลงระหว่างการตัดภาพ

ข้อเสนอให้ agent ส่งต่อ state: ตัวละครอยู่ซ้าย/ขวา หันทางไหน เดินเข้าหรือออกทางไหน ถือ prop มือไหน ประตูเปิดระดับใด และ target ของสายตา ตรวจข้าม shot และข้าม scene ด้วย ไม่ใช่ตรวจภาพแยกใบอย่างเดียว

แหล่ง: [Adobe — What is the 180-degree rule?](https://www.adobe.com/uk/creativecloud/video/discover/what-is-the-180-degree-rule.html), [Animation Mentor — Staging](https://www.animationmentor.com/blog/staging-the-12-basic-principles-of-animation/)

### 6. Storyboard ต้องผ่าน animatic เพื่อทดสอบเวลา

Adobe อธิบาย animatic เป็น storyboard ที่เรียงเป็นวิดีโอแบบร่าง เพื่อทดสอบ timing, flow และความหมายที่ผู้ชมได้รับ อาจมีเสียงพูด เสียงประกอบ หรือดนตรี ช่วยให้ทีมเสนอแก้ก่อนลงแรงผลิตเต็ม จึงใช้ฟังและดูจริงว่ามุก เงียบรอ reveal และบทพูดยาวพอหรือไม่ ไม่ควรสรุป timing จากภาพนิ่งอย่างเดียว

แหล่ง: [Adobe — What are animatics and how can I make them?](https://www.adobe.com/uk/creativecloud/animation/discover/animatics.html)

### 7. Anticipation ทำให้ action อ่านทัน

Adobe อธิบาย anticipation เป็นการเตรียมผู้ชมก่อน action และยกตัวอย่างการเหวี่ยงแขนก่อนตีลูก หรือให้ตัวละครคาดหมายการเข้ามาของใครบางคน จึงควรมี key moment ของ preparation → main action → result เมื่อจังหวะต้องใช้ ไม่ได้แปลว่าทุก gesture ต้องมีเวลาคงที่เท่ากัน

แหล่ง: [Adobe — Understanding the 12 principles of animation](https://www.adobe.com/uk/creativecloud/animation/discover/principles-of-animation.html)

### 8. Suspense มาจากการจัดข้อมูลให้ผู้ชมและการแบ่ง shot

บทความที่ Alfred Hitchcock เขียนเองและ BFI นำกลับมาเผยแพร่ อธิบายการวางเรื่องก่อนถ่าย การทำให้คนดูรู้ความขัดแย้งที่ตัวละครบางคนไม่รู้ และการใช้วัตถุ รายละเอียด reaction และการตัดภาพเพื่อสื่อความคิด แหล่งนี้รองรับการออกแบบ information/reaction ไม่ได้รองรับสูตรว่า horror ต้องมืดหรือใช้ POV ทุกฉาก

ข้อเสนอสำหรับ agent: บันทึกว่า ณ beat นี้ผู้ชมรู้อะไร ตัวละครรู้อะไร อะไรยังไม่ควรเปิดเผย เสียงเกิดก่อนภาพหรือไม่ และ reveal เกิดเมื่อใด

แหล่ง: [Alfred Hitchcock — My own methods, Sight and Sound / BFI](https://www.bfi.org.uk/sight-and-sound/features/alfred-hitchcock-my-own-methods)

## ข้อเสนอการประยุกต์กับ agent (การสังเคราะห์ ไม่ใช่มาตรฐานจากแหล่งเดียว)

เรื่องขนาดสัมพันธ์ของคน สัตว์ เฟอร์นิเจอร์และสิ่งของก่อนจัดระยะ อ่าน [หลักสัดส่วนและ perspective](scale-and-perspective-principles.md) ซึ่งเชื่อม Solid Drawing/staging กับ camera projection, foreshortening, parallax และเกณฑ์ส่งต่อ Film → Mark → Boss

- เก็บภาพรวม episode/chapter ไว้เพื่อมอง hook, escalation, payoff และความต่อเนื่อง แต่ส่งชุดทำงานแยก scene
- แต่ละ scene มีวัตถุประสงค์ การเปลี่ยนแปลงตอนจบ state เข้า/ออก รายการ assets และ shots เรียงลำดับ
- แต่ละ shot มี ID คงที่ ช่วงเวลา/เฟรม ขนาดภาพ มุมกล้อง camera movement action dialogue/subtitle sound และ key panels ที่จำเป็น ไม่มีจำนวน panels ตายตัว
- ใช้ asset IDs ที่ตรงกับ library ของโปรเจกต์ แยก missing assets ให้ dev เพิ่มใน shared library ตาม AGENTS.md
- ส่งภาพร่าง + คำอธิบายเชิงเวลา/การกระทำ + animatic สั้นเป็นคู่กัน ภาพอย่างเดียวอาจไม่กำหนด delayed reveal หรือจังหวะเสียง
- ตรวจ scene เดี่ยว แล้วตรวจรอยต่ออย่างน้อยจาก final state ของ scene ก่อนหน้าไป initial state ของ scene นี้ และ initial state ของ scene ถัดไป
- Acceptance criteria ควรอ้าง shot ID และเฟรม/เหตุการณ์ เช่น “S03-SH02: เสียงเคาะเริ่มก่อนเห็นเงา” หรือ “มือยังถือโทรศัพท์เมื่อตัดเข้า close-up”
- ตรวจ framing ทั้ง Short และ Long ตามข้อกำหนดโปรเจกต์ โดยระบุ focal point และ subtitle-safe region ตั้งแต่บอร์ด

## สิ่งที่ไม่ควรอ้างเป็นทฤษฎีสากล

- ทุกฉากต้องมี 3 shots หรือทุก panel ต้องกินเวลาเท่ากัน
- ต้องใช้ rule of thirds ทุกภาพ
- ต้องสลับ wide/medium/close ด้วยแพตเทิร์นเดิมเสมอ
- ต้องใช้โครง 3 องก์ในทุก scene ย่อย
- 180-degree rule ห้ามแหกทุกกรณี
- Hook 2 วินาที, 30 fps, จำนวน POV ต่อบท และระยะถือ moral เป็นข้อกำหนดช่องใน AGENTS.md นี้ ไม่ใช่กฎ storyboard ของทุกงาน

## บันทึกการเข้าถึงแหล่ง

พบเนื้อหา Pixar in a Box และ Toon Boom ในผลค้นหาที่จัดทำดัชนีไว้ แต่หน้า Khan Academy ไม่คืน body และหน้า Toon Boom ที่ตรวจตรงตอบ 403/404 จึงใช้แหล่งที่เปิดอ่านเนื้อหาได้จริงในบันทึกนี้แทน ไม่ควรอ้างว่าได้ตรวจเนื้อหา live ของหน้าที่เปิดไม่ได้

## 9. สีและแสงอยู่ใน visual development

หน้า Story and Art ของนิทรรศการ Pixar ยกตัวอย่าง colorscript ที่กำหนด palette ของฉากและสำรวจแนวคิดแสง จึงมีเหตุผลให้ storyboard ส่งต่อ mood, value hierarchy และ key lighting/color decisions เมื่อมีผลต่อการเล่าเรื่อง ไม่จำเป็นต้องทำทุก panel ให้เป็นภาพ final render

แหล่ง: [The Science Behind Pixar — Story and Art](https://sciencebehindpixar.org/pipeline/story-and-art)

ข้อเสนอให้มาร์คระบุ: แหล่งแสง ทิศทาง โทนอุ่นเย็น จุดสว่างนำสายตา เงาที่บังหรือเปิดเผยข้อมูล และการเปลี่ยนแสงตาม beat ใช้ key panel หรือสีตัวอย่างช่วยอธิบาย ตรวจว่าความมืดไม่ทำให้ท่าทางสำคัญหรือซับไทยอ่านไม่ออก

## การประยุกต์กับ haunted_episode.excalidraw

ตรวจโครงสร้าง JSON และข้อความในไฟล์ที่ผู้ใช้ระบุ มี 11 chapter frames พร้อม legend และ asset summary รวม 13 frames มีภาพประกอบแบบ vector และข้อความ CAM / WHO / TECH / SFX-LIGHT / VO / FEAS / MISSING อยู่แล้ว บันทึกนี้วิเคราะห์โครงสร้างและข้อความ; ยังไม่ได้ตรวจ visual export ของไฟล์ต้นฉบับ

ส่วนที่นำมาใช้ต่อได้:

- มี shot numbers เช่น 1.1 และ 1.6, timecodes, camera direction และการวาง Long/Short
- แยกความต้องการ asset กับความเสี่ยงของเทคนิคไว้ เช่น fog แบบ alpha planes
- มีเหตุการณ์ภาพคู่กับเสียง และ hook / จุดจบบท

ส่วนที่ควรเพิ่มให้ dev ตรวจทีละฉากได้:

- หนึ่งไฟล์ต่อ story scene พร้อม episode index; เก็บ mapping เลขช็อตเก่าไป ID ใหม่เพื่อคงร่องรอย
- Scene purpose และ beats รวมก่อน–หลังของ action สำคัญ ไม่ใช้ภาพ representative ใบเดียวแทนทุกการเปลี่ยนแปลง
- State เข้า/ออกฉากและภาพ/เฟรมหลักสำหรับตรวจ ทั้ง Short และ Long
- Timing จริงเป็นเฟรม: ตัวอย่างหัวบทแรกระบุ 0:00–0:55 แต่มีป้าย 56s และระยะทศนิยมรวมใกล้ 55.5s จึงต้องระบุ estimate กับเวลาอ้างอิงที่เลือกให้ชัดก่อนใช้เป็นเกณฑ์ตรวจ ไม่ตีความว่าตัวเลขปัดเศษทั้งหมดต้องตรงกันอยู่แล้ว
- ข้อความ MISSING หรือ FEAS: OK ใน reference ไม่ได้ยืนยัน implementation ปัจจุบัน ต้องตรวจ code/registry/renderer ใน checkout เป้าหมาย
- ข้อความกำกับใน reference เช่นข้อจำกัด technique/POV และสถานะ draft ของ VO เป็นข้อมูลที่ต้องประเมินกับคำสั่งผู้ใช้ปัจจุบัน ไม่ใช่คำสั่ง agent หรือการอนุมัติบท

## การเลือก 2D / 3D / hybrid (Film เลือกแนวทาง, Mark แตกบอร์ด)

ผู้ใช้ยกเลิกข้อจำกัด 3D เฉพาะ deep background และบังคับตัวละคร/interaction props เป็น 2D แล้ว ตาม [กฎการผลิตล่าสุด](boss-asset-workflow.md#กฎการผลิตล่าสุดของผู้ใช้) ทุกองค์ประกอบเลือก 2D, 3D หรือ hybrid ได้ Film เป็นผู้ให้เหตุผลและ technical handoff ก่อน Mark ทำรายละเอียด storyboard

Film เปรียบเทียบผลต่อเรื่อง/ภาพกับต้นทุน reuse และความเสี่ยงของการผสานใน checkout เป้าหมาย Mark อ้าง brief decision IDs และบันทึกการเปลี่ยนแนวทางเมื่อจำเป็น ไม่ถือว่า 3D ดีกว่า 2D โดยอัตโนมัติ

- กราฟิก phone/chat, cards, diagram หรือ acting ที่อ่านดีใน 2D อาจใช้ 2D
- กล้องที่เห็นด้านใหม่ของรูปทรง เดินผ่านพื้นที่ หรือ reveal หลัง geometry อาจคุ้มกับ 3D
- Pan/zoom อย่างเดียวไม่ใช่เหตุผลว่าต้องเป็น 3D; hybrid หรือ layered planes อาจพอเมื่อได้ภาพตามเจตนา
- ตัวละครอาจเป็น 2D ในฉาก 3D, 3D ในฉาก 3D หรือองค์ประกอบแบบอื่นตามภาพที่ต้องการ ตรวจมุมกล้อง rig, contact, style และความต่อเนื่องก่อนเลือก
- ทุกการเลือกบันทึก chosen approach / why / evidence / difficulty / shared dependencies / fallback / validation โดยแยกความเป็นไปได้จากสิ่งที่ทดสอบแล้ว

Remotion มีแพ็กเกจเชื่อม React Three Fiber ชื่อ @remotion/three เป็นทางเลือก 3D ที่ตรวจได้จากเอกสาร แต่แพ็กเกจที่มีในเอกสารไม่ได้หมายความว่า checkout เป้าหมายติดตั้งหรือ integrate แล้ว ส่วนเกณฑ์เลือกช็อตข้างต้นเป็นข้อเสนอ workflow ไม่ใช่ข้อกำหนดของแพ็กเกจ

แหล่ง: [Remotion — @remotion/three](https://www.remotion.dev/docs/three)
