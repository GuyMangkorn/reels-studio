# Dev findings — บันทึกจาก Boss ถึง Film และ Mark

บันทึกปัญหาและบทเรียนที่เจอจริงระหว่าง dev, blockout, Studio และ render เพื่อให้ Film ใช้เลือก 2D / 3D / hybrid และให้ Mark ออกแบบช็อตโดยรู้เงื่อนไขของเครื่องมือ บอสเป็นเจ้าของอาการ หลักฐาน และสถานะ; Film เป็นเจ้าของผลต่อ visual/technical brief; Mark เป็นเจ้าของผลต่อบอร์ด อ่านเฉพาะรายการที่เกี่ยวกับ assets, camera, lighting, compositing หรือ tooling ของงานที่รับทำ

## วงจรใช้งาน

1. **Boss จดเมื่อพบ** ปัญหาที่บล็อกงาน ทำให้เปลี่ยนวิธีผลิต/ช็อต ต้องใช้ workaround หรือเป็นบทเรียนที่ใช้ซ้ำได้ ทั้ง 2D, 3D และ hybrid ค้นรายการเดิมก่อน แล้วอัปเดต ID เดิมเมื่อเป็นปัญหาเดียวกัน จดอาการและขอบเขตที่รู้ทันที แม้ root cause ยังไม่ชัด; เติมผลทดลองและทางแก้ระหว่างทำงานและก่อนส่ง PR งานที่ไม่พบเรื่องใหม่หรือสถานะเปลี่ยนไม่ต้องสร้างรายการเปล่า
2. **Film อ่านก่อนเลือกหรือแก้แนวทาง** เทียบรายการที่เกี่ยวข้องกับ checkout เป้าหมาย ตรวจ code/dependencies และเงื่อนไขว่ายังใช้ได้หรือไม่ ใน brief อ้าง finding ID + วันที่/commit ที่ตรวจ พร้อม decision ID และผลที่เลือก: ใช้ภายใต้เงื่อนไข / เพิ่ม shared capability ก่อน / ใช้ fallback / ต้อง spike / ไม่เกี่ยวพร้อมเหตุผล ถ้าไม่มีรายการที่เกี่ยวข้องให้ระบุว่าไม่มี ไม่แปลว่าเทคนิคนั้นผ่านการทดสอบแล้ว
3. **Mark อ่านก่อนแตกหรือแก้บอร์ด** ใช้ findings ที่ Film อ้างและรายการที่ตรงกับ camera/staging ของตน ระบุ finding IDs ใน scene sheet กับ shot IDs ที่ได้รับผล วิธีจัด framing/motion/contact/reveal หรือ fallback และสิ่งที่ Boss ต้องพิสูจน์ หากขัดกับ brief ให้ส่งผลกระทบผ่านผู้ประสานงานเพื่อปรับ Film brief และ board revision ให้ตรงกัน
4. **ส่งผลกลับเมื่อกระทบแผนปัจจุบัน** Boss ระบุ finding ID, scene/shot/decision IDs, ผลต่อเรื่อง/เวลา/สองสัดส่วน และข้อเสนอให้ Film/Mark ผ่านผู้ประสานงานทันทีที่รู้ว่าทำตามแผนไม่ได้ ระบุรายการค้างและลิงก์ใน handoff/PR โดยให้เอกสารนี้เป็นแหล่งรายละเอียดหลัก การเขียน log ไม่ได้ส่งข้อความหรือเรียก agents อัตโนมัติ
5. **ตรวจซ้ำเมื่อแก้หรือเปลี่ยนเครื่องมือ** Boss อัปเดตสถานะพร้อม commit/PR และหลักฐานที่ทดสอบซ้ำ เก็บอาการเดิมและวิธีที่ลองแล้วไว้ เมื่อ baseline เปลี่ยน Film/Mark ตรวจว่าการแก้นั้นอยู่ใน checkout เป้าหมายก่อนนำไปใช้ หากผลใหม่ทำให้แผนเปลี่ยน ให้อัปเดต brief/board ที่ยังใช้งานและลิงก์กลับรายการเดิม

## ขอบเขตหลักฐานและสถานะ

- แยก **อาการที่เห็น**, **สาเหตุที่ยืนยันแล้ว/ข้อสันนิษฐาน** และ **คำแนะนำการออกแบบ** ให้ชัด ประเภทใช้ `implementation-bug`, `integration-gap`, `tool-limitation` หรือ `unknown` ตามหลักฐาน ปัญหาของ adapter หรือ branch หนึ่งยังไม่ใช่ข้อจำกัดของ 2D/3D ทั้งหมด
- สถานะใช้ `open` (ยังติดปัญหา), `workaround` (มีวิธีเลี่ยงภายใต้เงื่อนไข), `fixed` (แก้และมีผลตรวจซ้ำในขอบเขตที่ระบุ), `superseded` (มีรายการใหม่แทนพร้อมลิงก์) ระบุวันตรวจล่าสุดและ branch/commit ทุกครั้งที่เปลี่ยนสถานะ ผลบน issue branch ยังไม่พิสูจน์ว่าการแก้อยู่ใน `main`
- ระบุ composition/frames, timeline/input props, clock, package versions และ environment เท่าที่จำเป็นให้ทำซ้ำได้ แยก Studio, final render, random seeking และ Short/Long; ส่วนที่ไม่ได้ตรวจเขียน `unverified` ค่า performance ต้องมีวิธีวัดและบริบท
- หลักฐานใช้ code path, issue/PR, คำสั่งและผล หรือ render/log ที่เข้าถึงได้ Generated media อยู่ `out/` และอยู่นอก Git ตามกฎ repo หากมีแค่ไฟล์ local ให้ระบุพร้อม recipe สร้างซ้ำ การหายไปของไฟล์ไม่ทำให้ผลเดิมกลายเป็นหลักฐานตรวจปัจจุบัน
- ข้อค้นพบเป็นข้อมูลช่วยตัดสินใจตามเงื่อนไขที่ทดสอบ รักษาเสรีภาพเลือก 2D / 3D / hybrid ตามกฎผู้ใช้ หากยังพิสูจน์ไม่ได้ให้เสนอ spike ที่เล็กที่สุดพร้อมเกณฑ์ผ่าน แทนสรุปเป็นข้อห้ามถาวร

## ดัชนี findings

สร้าง 26 ตุลาคม 2026 รายการแรกเป็นผลตรวจ tooling ระหว่างเพิ่ม workflow นี้ ยังไม่ได้ทดสอบภาพหรือ runtime เพื่อยืนยันข้อจำกัดด้าน medium

| Finding ID / ลิงก์ | เรื่อง / tags | สถานะ | ตรวจล่าสุด / commit | ผลต่อ Film / Mark |
| --- | --- | --- | --- | --- |
| [DF-20261026-duplicate-types](#df-20261026-duplicate-types) | Typecheck / local dependencies | open | 2026-10-26 / `1ab2ca1` | แยก environment failure จาก feasibility ของ medium |

## แบบฟอร์มรายการ

เพิ่มรายการจริงใต้แบบฟอร์มและเพิ่มแถวลิงก์ในดัชนี ใช้ ID `DF-YYYYMMDD-short-slug` ที่ไม่ซ้ำและคงเดิมเมื่อแก้ เก็บรายละเอียดในไฟล์นี้; brief, scene sheet และ sequence index ลิงก์มาแทนคัดลอกอาการทั้งหมด

```markdown
## DF-YYYYMMDD-short-slug — ชื่อปัญหาที่สื่ออาการ

- Owner: Boss; พบเมื่อ: ...; ตรวจล่าสุด: ...
- Status: open / workaround / fixed / superseded
- Type: implementation-bug / integration-gap / tool-limitation / unknown
- Tags: 2D / 3D / hybrid / camera / contact / lighting / texture / tooling / ...
- Scope: branch + commit; package versions/environment ที่เกี่ยวข้อง; asset/module paths
- Consumers: episode/scene/shot IDs; Film decision/brief revision; board revision หรือ N/A

### อาการและหลักฐาน
- ต้องการ → พบจริง; เงื่อนไขที่เกิดและที่ยังไม่ทราบ:
- ทำซ้ำ: command, timeline/input props, composition, frames/clock:
- Evidence: code/log/issue/PR/render path; local-only พร้อม recipe ถ้ามี:
- Coverage: Studio / final render / seeking; Short / Long; ส่วนที่ unverified:
- Root cause: ยืนยันแล้วพร้อมหลักฐาน / ข้อสันนิษฐานและวิธีตรวจต่อ:

### สิ่งที่ลองและผล
- วิธีที่ลอง → ผล; workaround/fix และเงื่อนไขที่ยังใช้ไม่ได้:
- ต้นทุน/คุณภาพ/ข้อแลกเปลี่ยนที่วัดหรือเห็นจริง; ส่วนที่ยังเป็นประมาณการ:

### ผลต่อการวางแผน
- Film: ผลต่อ medium/compositing/camera/light/interface; fallback หรือ shared capability ที่เสนอ:
- Mark: ผลต่อ shot/framing/staging/contact/reveal สองสัดส่วน; สิ่งที่ต้องรักษา:
- Follow-up: owner + issue/PR; spike/เกณฑ์ผ่าน; brief/board/sequence index ที่ต้องอัปเดต:

### ประวัติตรวจซ้ำ
- วันที่ + branch/commit → วิธีตรวจ/ผล/coverage → status; fix PR/merge status:
- Film/Mark นำไปใช้: finding revision/date ที่อ่าน → brief decision / board shot refs + ผลตัดสิน:
```

## DF-20261026-duplicate-types

- Owner: Boss สำหรับการตรวจซ้ำในงาน dev; บันทึกโดยผู้ประสานงานจากผลคำสั่งจริงระหว่างงานเอกสาร #36
- พบ/ตรวจล่าสุด: 26 ตุลาคม 2026; status: `open`; type: `unknown` (local dependency environment); tags: tooling / typecheck
- Scope: checkout `codex/36-dev-findings` บน baseline `1ab2ca1` โดยมีเฉพาะเอกสาร/agent instructions เปลี่ยน; Node `24.5.0`, npm `11.5.1`, TypeScript `5.8.3`; `tsconfig.json`, `node_modules/@types/`; ยังไม่ทราบที่มาของโฟลเดอร์ซ้ำ
- Consumers: การตรวจ code ใน checkout นี้; ยังไม่มี brief decision/board shot ที่ได้รับผลด้านภาพ

### อาการและหลักฐาน

`npm run typecheck` จบด้วย exit 2 และ TS2688: หา type definition ไม่พบสำหรับ implicit type libraries ชื่อท้าย ` 2` เช่น `react 2`, `node 2`, `three 2` และ `stats 2.js` รวม 14 รายการ ตรวจ directory จริงพบทั้ง 14 ชื่อใน `node_modules/@types/` โดยไม่มี `index.d.ts` และ `package.json` ที่ root ของแต่ละ directory ส่วน `tsconfig.json` ไม่ได้กำหนดรายการ `types`

ทำซ้ำด้วย `npm run typecheck`; ตรวจ directory ด้วย Python recipe ด้านล่าง บันทึกนี้อ้างผลในเครื่อง ณ วันที่ตรวจ ไม่รับประกันว่า clean install หรือ checkout อื่นจะเกิดเหมือนกัน

```bash
python3 - <<'PY'
from pathlib import Path
for p in sorted(Path('node_modules/@types').glob('* 2*')):
    print(p, (p / 'index.d.ts').exists(), (p / 'package.json').exists())
PY
```

`npm run lint` ผ่านในรอบเดียวกัน ไม่มีการแก้ dependency folders เพื่อพิสูจน์สาเหตุ ที่มาของโฟลเดอร์ซ้ำและผลหลัง clean install ยัง `unverified`; Studio, render, seeking, Short และ Long ไม่ได้ตรวจในงานเอกสารนี้

### ผลต่อการวางแผนและตรวจซ้ำ

- Film: ผลนี้ยังใช้ตัดสินความเป็นไปได้ของ 2D/3D/hybrid ไม่ได้ ตรวจ dependency environment ให้ชัดก่อนใช้ typecheck failure เป็นเหตุเปลี่ยน medium
- Mark: ยังไม่มีเหตุให้เปลี่ยน framing/staging จาก finding นี้; feasibility ของ shot ต้องอ้างผล blockout/render แยก
- Follow-up: Boss ตรวจ dependency tree/สภาพ clean install เมื่อทำ runtime work ใน checkout นี้ แล้วรัน typecheck ซ้ำก่อนอัปเดตสถานะ หลีกเลี่ยงแก้ runtime contract เพื่อกลบปัญหา environment
- ประวัติ: 2026-10-26 / `1ab2ca1` + documentation diff → typecheck failed, lint passed → `open`; ยังไม่มี fix PR หรือการนำไปเปลี่ยน brief/board
