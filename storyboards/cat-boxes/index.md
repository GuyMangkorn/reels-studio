> **Current selected deliveries (27 October 2026):** one 45-second Short (`CATBOX-SHORT`) and one 9-minute YouTube Long (`CATBOX-LONG`). Use [the delivery record](../../scripts/cat-boxes/delivery.md), [Short board set](short/index.md) and [Long board set](long/index.md). Sections below preserve the previous PR #38 Shorts-first source map and dated QA; do not treat their old active-scope statements as the current selection.

# CATBOX — ทำไมแมวเห็นกล่องแล้วต้องเข้าไปนั่ง?

User-facing title: **ทำไมแมวเห็นกล่องแล้วต้องเข้าไปนั่ง?** (CATBOX). Source script title retained: **CATBOX — แมวกับกล่อง: คดีที่ปิดด้วยคำตอบเดียวไม่ได้**.

Issue #31 • branch `codex/31-catbox-storyboard` • storyboard revision 1 • base main `9ba8dd1116c423ec6e3b3d94c425a663b127ff30` (PR #30 merged).

## Source and readiness

The Issue #31 / codex/31-catbox-storyboard header above records the original storyboard source. Current continuation context: branch codex/33-catbox-foundation, latest known origin/main 5095d25 (PR #46 merged), PR #38 open.

- Episode script R5; C01 script R5 with focused Boat FC-R5-C01; C02–C06 script R4 with Boat FC-R4. The fact-check scopes are matched. C01 FC-R5 covers all C01 R5 Long/Short VO blocks; C02–C06 retain R4 findings.
- The script files still label the episode/chapter pack `draft-for-fact-check` and script approval is pending. The fact-check concludes C01 supported/ready-for-storyboard and C02–C06 FC-R4 ready for storyboard; this metadata mismatch is preserved, not silently resolved.
- Research baseline R1. G01 (1970 full methods/sample unknown), G02 (2014 shelter paper available only as abstract/record), and G03 (specific comfort/pressure/motive mechanisms unconfirmed) remain bounded. Boards add no study quantities or unreviewed claims.
- Timing is estimated. One C01 Long TTS preview: 82.92s vs a 90s budget, unapproved and unsynced; all other Long units and all six Shorts are not audio-tested. The 9:00 Long and 45s Shorts are estimates only.
- Board handoff is ready for development, but the scripts still await user approval. Issue #33 adds a runnable shared-sequence blockout; it is an implementation preview, not a narration-approved or publishable episode. C06-S02 has Film scale/projection brief [VB-C06-S02-R3](ch06-sc02-visual-brief.md) and Mark's board/sheet R4. The editable board parses with unique element IDs; MCP preview calls succeeded, but a visual export inspection remains unverified.

## Active Shorts-first release set

This is the active scope on codex/33-catbox-foundation with latest known origin/main 5095d25 (PR #46 merged). PR #38 remains open and is the update target.

The active delivery now covers the existing 12-scene main portrait Short plus six independent Short S01 cuts, one per chapter. Each chapter Short is estimated at 45 seconds / 1,350 frames at 30 fps, portrait 1080×1920. Script approval remains pending; VO and subtitle timing are untested. Film brief: [VB-CATBOX-R5](visual-brief.md). New chapter-cut IDs use the SHORT namespace; original Long IDs, boards, sheets, story order and 540-second durations remain source material. The shared `blockout.json` render setup now carries the main Short's metre-space room, actor and camera data. Long uses that same JSON input, but Long output was not rendered or reviewed in this pass.

| Chapter | New Short shot | Exact source beat | Short frames | Existing Long source shots | Relationship |
|---:|---|---|---:|---|---|
| 1 | CATBOX-C01-SHORT-S01-SH01 | CATBOX-C01-S01-B01 | [0,210) | CATBOX-C01-S01-SH01/SH02 | Retimed; Long source retained |
| 1 | CATBOX-C01-SHORT-S01-SH02 | CATBOX-C01-S01-B02 | [210,600) | CATBOX-C01-S01-SH02/SH03; CATBOX-C01-S02-SH01 | Retimed; Long source retained |
| 1 | CATBOX-C01-SHORT-S01-SH03 | CATBOX-C01-S01-B03 | [600,1020) | CATBOX-C01-S01-SH03; CATBOX-C01-S02-SH03 | Retimed; Long source retained |
| 1 | CATBOX-C01-SHORT-S01-SH04 | CATBOX-C01-S01-B04 | [1020,1350) | CATBOX-C01-S02-SH04 | Retimed; Long source retained |
| 2 | CATBOX-C02-SHORT-S01-SH01 | CATBOX-C02-S01-B01 | [0,240) | CATBOX-C02-S01-SH01 | Retimed; Long source retained |
| 2 | CATBOX-C02-SHORT-S01-SH02 | CATBOX-C02-S01-B02 | [240,660) | CATBOX-C02-S01-SH02/SH03 | Retimed; Long source retained |
| 2 | CATBOX-C02-SHORT-S01-SH03 | CATBOX-C02-S01-B03 | [660,1020) | CATBOX-C02-S02-SH02/SH03 | Retimed; Long source retained |
| 2 | CATBOX-C02-SHORT-S01-SH04 | CATBOX-C02-S01-B04 | [1020,1350) | CATBOX-C02-S02-SH04 | Retimed; Long source retained |
| 3 | CATBOX-C03-SHORT-S01-SH01 | CATBOX-C03-S01-B01 | [0,240) | CATBOX-C03-S01-SH01 | Retimed; Long source retained |
| 3 | CATBOX-C03-SHORT-S01-SH02 | CATBOX-C03-S01-B02 | [240,630) | CATBOX-C03-S01-SH02/SH03 | Retimed; Long source retained |
| 3 | CATBOX-C03-SHORT-S01-SH03 | CATBOX-C03-S01-B03 | [630,990) | CATBOX-C03-S02-SH01/SH03 | Retimed; Long source retained |
| 3 | CATBOX-C03-SHORT-S01-SH04 | CATBOX-C03-S01-B04 | [990,1350) | CATBOX-C03-S02-SH04 | Retimed; Long source retained |
| 4 | CATBOX-C04-SHORT-S01-SH01 | CATBOX-C04-S01-B01 | [0,270) | CATBOX-C04-S01-SH01 | Retimed; Long source retained |
| 4 | CATBOX-C04-SHORT-S01-SH02 | CATBOX-C04-S01-B02 | [270,690) | CATBOX-C04-S01-SH02/SH04 | Retimed; Long source retained |
| 4 | CATBOX-C04-SHORT-S01-SH03 | CATBOX-C04-S01-B03 | [690,1020) | CATBOX-C04-S01-SH03; CATBOX-C04-S02-SH02 | Retimed; Long source retained |
| 4 | CATBOX-C04-SHORT-S01-SH04 | CATBOX-C04-S01-B04 | [1020,1350) | CATBOX-C04-S01-SH04 | Retimed; Long source retained |
| 5 | CATBOX-C05-SHORT-S01-SH01 | CATBOX-C05-S01-B01 | [0,240) | CATBOX-C05-S01-SH01 | Retimed; Long source retained |
| 5 | CATBOX-C05-SHORT-S01-SH02 | CATBOX-C05-S01-B02 | [240,660) | CATBOX-C05-S01-SH02 | Retimed; Long source retained |
| 5 | CATBOX-C05-SHORT-S01-SH03 | CATBOX-C05-S01-B03 | [660,1020) | CATBOX-C05-S01-SH03/SH04 | Retimed; Long source retained |
| 5 | CATBOX-C05-SHORT-S01-SH04 | CATBOX-C05-S01-B04 | [1020,1350) | CATBOX-C05-S01-SH04 | Retimed; Long source retained |
| 6 | CATBOX-C06-SHORT-S01-SH01 | CATBOX-C06-S01-B01 | [0,240) | CATBOX-C06-S01-SH01/SH02 | Retimed; CL01 replanted self-contained |
| 6 | CATBOX-C06-SHORT-S01-SH02 | CATBOX-C06-S01-B02 | [240,660) | CATBOX-C06-S02-SH01/SH02 | Retimed; Long source retained |
| 6 | CATBOX-C06-SHORT-S01-SH03 | CATBOX-C06-S01-B03 | [660,1020) | CATBOX-C06-S01-SH03; CATBOX-C06-S02-SH02 | Retimed; Long source retained |
| 6 | CATBOX-C06-SHORT-S01-SH04 | CATBOX-C06-S01-B04 | [1020,1350) | CATBOX-C06-S02-SH03/SH04 | Retimed; Long source retained |

| Short | Script | Executable Short input / composition | Board / sheet |
|---|---|---|---|
| C01 | ch01 R5 | [short-c01.json](../../scripts/cat-boxes/short-c01.json) → `CATBOX-C01-Short` · 4 scenes / 1,350 frames | [short-c01.excalidraw](short-c01.excalidraw) · [short-c01.md](short-c01.md) |
| C02 | ch02 R4 | [short-c02.json](../../scripts/cat-boxes/short-c02.json) → `CATBOX-C02-Short` · 4 scenes / 1,350 frames | [short-c02.excalidraw](short-c02.excalidraw) · [short-c02.md](short-c02.md) |
| C03 | ch03 R4 | [short-c03.json](../../scripts/cat-boxes/short-c03.json) → `CATBOX-C03-Short` · 4 scenes / 1,350 frames | [short-c03.excalidraw](short-c03.excalidraw) · [short-c03.md](short-c03.md) |
| C04 | ch04 R4 | [short-c04.json](../../scripts/cat-boxes/short-c04.json) → `CATBOX-C04-Short` · 4 scenes / 1,350 frames | [short-c04.excalidraw](short-c04.excalidraw) · [short-c04.md](short-c04.md) |
| C05 | ch05 R4 | [short-c05.json](../../scripts/cat-boxes/short-c05.json) → `CATBOX-C05-Short` · 4 scenes / 1,350 frames | [short-c05.excalidraw](short-c05.excalidraw) · [short-c05.md](short-c05.md) |
| C06 | ch06 R4 | [short-c06.json](../../scripts/cat-boxes/short-c06.json) → `CATBOX-C06-Short` · 4 scenes / 1,350 frames | [short-c06.excalidraw](short-c06.excalidraw) · [short-c06.md](short-c06.md) |

Boss runtime status: six independent portrait compositions are registered in `src/Root.tsx`; the generic `Short` and `Long` compositions remain available and both use the shared 12-scene `blockout.json`. All twelve main Short scenes and the six chapter Shorts use the shared metre-space projection and `CatboxRoom`. The visual contract, validation and `VisualStage` dispatch are integrated for the used visual modes. `PhysicalAction`'s `visit` source remains unregistered and unused. The shared physical-scale registry changes Short framing and actor scale; Long rendering and QA remain unverified.

### Boss Short runtime and QA evidence — R5 review fixes

The main Short renders 16,200 frames at 1080×1920 / 30 fps with the requested loop seam fade. All six chapter Shorts render 1,350 frames each at 1080×1920 / 30 fps, with an A-fade preview, one-second frame samples, critical boundary frames, same-browser/remount parity, and loop-seam checks. Local render outputs and exact frame lists are under `out/qa/cat-boxes/shorts-r2/`; review stills and one-fps contact sheets are committed with PR #38 below. Long was not rendered or reviewed.

| Cut | One-fps contact sheet | Exact review frames |
|---|---|---|
| C01 | [45-frame sheet](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C01-one-fps-contact.jpg) | Full A-fade render, frame samples and parity checks in the local shorts-r2 QA output |
| C02 | [45-frame sheet](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C02-one-fps-contact.jpg) | Full A-fade render, frame samples and parity checks in the local shorts-r2 QA output |
| C03 | [45-frame sheet](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C03-one-fps-contact.jpg) | [F120](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C03-F120.png) · [F239](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C03-F239.png) |
| C04 | [45-frame sheet](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C04-one-fps-contact.jpg) | Full A-fade render, frame samples and parity checks in the local shorts-r2 QA output |
| C05 | [45-frame sheet](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C05-one-fps-contact.jpg) | Full A-fade render, frame samples and parity checks in the local shorts-r2 QA output |
| C06 | [45-frame sheet](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C06-one-fps-contact.jpg) | [F0](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C06-F0.png) · [F15](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C06-F15.png) · [F1100](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C06-F1100.png) |

Main Short seam frames: [F16199](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/Main-F16199.png) · [first frame of the next loop, F0](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/Main-F0-after-loop.png). The midpoint height and 6:1 physical owner/cat ratio table is in the PR description.

Script approval is pending, narration is absent, and subtitle timing remains estimated and not audio-synced. Runtime factual-image review remains unverified; FC-VIS-R1 is planning review only. Studio playback/seeking remains unverified separately from the successful CLI renders. Long uses the shared source JSON but was not rendered or QA-reviewed.

## Shared sequence blockout (written before scene packs)

[blockout.md](blockout.md) is the sequence-first brief. It sets the room axis, old-box clue, six chapter turns, original 2D production proposal, all-shots-move rule, research boundaries, Short crop rule and shared dependencies before the scene boards below. Current medium choices follow Film's brief and the latest production rules.

## Retained Long-source story map (source beats and timing unchanged)

All six chapters unfold in the same fictional living room through the owner’s case file. Research pictures are labeled 2D explainers and never become a lab scene or a claim that Mochi was tested. Each Long unit has one independently reviewable story scene; the Shorts are separate edits across their two scene boards.

| Order | Chapter / scene | Long composition estimate | Source coverage | Main action / exit handoff | Board / sheet |
|---:|---|---|---|---|---|
| 1 | C01 / คลิปเปิดแฟ้ม (`CATBOX-C01-S01`) | ~00:00–00:45 | C01 U01 B01–B04 | เจ้าของเห็นคลิปสมมติของแมวในกรอบแบน แล้วหันจากคำว่า “พลังลับ” ไปดูหลักฐานเรื่องรูปกระดาษจริง โดยยังไม่เอาโมจิลงไปนั่งให้ดูเหมือนการทดลอง Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch01-sc01.excalidraw](ch01-sc01.excalidraw) · [ch01-sc01.md](ch01-sc01.md) |
| 2 | C01 / อ่านผลโดยไม่รวมหน่วย (`CATBOX-C01-S02`) | ~00:45–01:30 | C01 U02 B01–B04 | แยกจำนวนผู้สมัคร จำนวนแมวที่ทำครบ จำนวนแมวที่เลือก และจำนวนครั้งที่เลือก; แยกผล pairwise ออกจาก tally; เจ้าของจบด้วยช่อง “เพราะ…” ที่ยังว่าง Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch01-sc02.excalidraw](ch01-sc02.excalidraw) · [ch01-sc02.md](ch01-sc02.md) |
| 3 | C02 / ที่หลบในงานศูนย์พักพิง (`CATBOX-C02-S01`) | ~01:30–02:15 | C02 U01 B01–B04 | สื่อผลการศึกษาที่ซ่อนจริงในศูนย์พักพิงตามบริบท; ภาพวิจัยเป็นการ์ดอธิบาย ไม่ใช่ footage ของสถานที่หรือฝูงแมวจริง Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch02-sc01.excalidraw](ch02-sc01.excalidraw) · [ch02-sc01.md](ch02-sc01.md) |
| 4 | C02 / คะแนนดีขึ้นไม่ใช่ทุกด้าน (`CATBOX-C02-S02`) | ~02:15–03:00 | C02 U02 B01–B04 | แยกงานติดตาม 2019 จากงาน 2014, รักษาขอบเขตการวัดคะแนน/น้ำหนัก 12 วันแรก และไม่ตีความผลไม่พบความต่างเป็นผลศูนย์ Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch02-sc02.excalidraw](ch02-sc02.excalidraw) · [ch02-sc02.md](ch02-sc02.md) |
| 5 | C03 / ที่พักหรือฐานซุ่ม (`CATBOX-C03-S01`) | ~03:00–03:45 | C03 U01 B01–B04 | ใช้เหตุการณ์เล่นสมมติสร้างการเดาของเจ้าของ แล้วทำให้ความต่างระหว่างพฤติกรรมที่เห็นกับเหตุเข้ากล่องอ่านชัด Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch03-sc01.excalidraw](ch03-sc01.excalidraw) · [ch03-sc01.md](ch03-sc01.md) |
| 6 | C03 / บังตัวได้ แต่ไม่รู้เหตุเฉพาะ (`CATBOX-C03-S02`) | ~03:45–04:30 | C03 U02 B01–B04 | เปรียบหน้าที่ทางกายภาพของกล่องมีหลังคากับกรอบแบน, อ้างแนวทาง safe place ตามขอบเขต, คง “ที่ซุ่ม” เป็นสมมติฐาน Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch03-sc02.excalidraw](ch03-sc02.excalidraw) · [ch03-sc02.md](ch03-sc02.md) |
| 7 | C04 / ตัวเลขที่ถูกทักท้วง (`CATBOX-C04-S01`) | ~04:30–05:15 | C04 U01 B01–B04 | ตรวจคำอ้างเกี่ยวกับ 30–38°C: แยกนิยามทางสรีรวิทยา/comfort, ใช้ EFSA qualification, ไม่ให้ตัวเลขเป็นคำแนะนำหรือความสบายที่ยืนยันแน่นอน Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch04-sc01.excalidraw](ch04-sc01.excalidraw) · [ch04-sc01.md](ch04-sc01.md) |
| 8 | C04 / ความอุ่นยังเป็นไปได้ (`CATBOX-C04-S02`) | ~05:15–06:00 | C04 U02 B01–B04 | ไม่เหวี่ยงจากการปฏิเสธ universal temperature rule ไปเป็นการบอกว่าความอุ่นไม่มีส่วน; แยกกล่องมีผนังจากกรอบแบนและเปิดคำอธิบายอ้อมกอด Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch04-sc02.excalidraw](ch04-sc02.excalidraw) · [ch04-sc02.md](ch04-sc02.md) |
| 9 | C05 / คำอธิบายที่น่ากอด (`CATBOX-C05-S01`) | ~06:00–06:45 | C05 U01 B01–B04 | เล่าข้อเสนอสัมผัสด้านข้างอย่างถูกระดับหลักฐาน; แสดงข้อจำกัดการค้นหาโดยไม่อ้างว่าไม่มีงานทั้งโลก; หลีกเลี่ยงภาพที่ทำคำอธิบายกลายเป็น fact Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch05-sc01.excalidraw](ch05-sc01.excalidraw) · [ch05-sc01.md](ch05-sc01.md) |
| 10 | C05 / เดินมาดูกับเลือกพัก (`CATBOX-C05-S02`) | ~06:45–07:30 | C05 U02 B01–B04 | แยกผลการสำรวจวัตถุใหม่ออกจากการเลือกกล่อง/การอยู่นาน; ปิดด้วยความเข้าใจว่าเจ้าของเอาคำตอบคนละคำถามมาปนกัน Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch05-sc02.excalidraw](ch05-sc02.excalidraw) · [ch05-sc02.md](ch05-sc02.md) |
| 11 | C06 / จัดแฟ้มตามระดับหลักฐาน (`CATBOX-C06-S01`) | ~07:30–08:15 | C06 U01 B01–B04 | นำผลที่สังเกต/วัดกับเหตุเสนอไปวางคนละกอง; แสดงน้ำหนักหลักฐานไม่เท่ากันและไม่สรุปว่าเป็นไปไม่ได้ Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch06-sc01.excalidraw](ch06-sc01.excalidraw) · [ch06-sc01.md](ch06-sc01.md) |
| 12 | C06 / กล่องเดิม คำตอบยังว่าง (`CATBOX-C06-S02`) | ~08:15–09:00 | C06 U02 B01–B04 | ปิดคำถามโดยไม่อ่านใจ: Mochi กลับกล่องเก่าที่ปลูกไว้; owner แก้ป้าย “เพราะ…” เป็น “ครั้งนี้ยังไม่รู้”; ending supports both fade/loop conceptually Entry/exit: see scene sheet; persistent box/sofa axis preserved. | [ch06-sc02.excalidraw](ch06-sc02.excalidraw) · [ch06-sc02.md](ch06-sc02.md) · [Film visual brief R1](ch06-sc02-visual-brief.md) |

## Runtime blockout — issue #33

Historical foundation snapshot from the earlier issue-#33 implementation. The branch/base and pending-status statements below predate current origin/main 5095d25 and the Shorts-first continuation. Preserve this source map and QA record, but do not treat the old projection status or Short-gap statement as current.

- Branch: `codex/33-catbox-foundation`, rebased onto `main` at `ce2a0b1981572ad3373f4132ed32f5a2242e0752` (PR #40 adds the scale/perspective workflow; PR #42 removes agent model/reasoning overrides). The refreshed PR head will include this baseline and the visual revision.
- Executable timeline: [`scripts/cat-boxes/blockout.json`](../../scripts/cat-boxes/blockout.json), the current `Scene[]` array. `Root.tsx` supplies this same timeline to `Short` and `Long`; narration is omitted until approved audio exists; ending defaults to `B_loop` for preview.
- The blockout has 12 runtime entries at 45 seconds each, 30 fps, total 540 seconds / 16,200 frames. Each entry maps to one storyboard scene; each scene sheet retains its four shot-local intervals. This preserves the full Long sequence and lets both aspect ratios review the same actions.
- C01-S01 stimulus cards use `startSec` cues in board order. C06-S02's portrait actor/prop layout overrides are temporary blockout values, not canonical scale; Film brief R1 replaces them with a proposed shared orthographic crop. Runtime projection/anchor conversion is not implemented yet.
- The renderer footer uses the required default label `ทำไมล่ะ`. This checkout has no shared channel config or per-scene override path yet; both remain unimplemented.
- Historical Short gap, superseded by the active Shorts-first set (26 October 2026). When the original 12-scene shared timeline was authored, separate Short S01 compositions were not implemented. The source gap is retained here as history; six runtime inputs remain a Boss handoff.
- `subtitleCues` preserve the sheet's slash-separated phrase order. Cue times are estimates evenly divided within each authored shot interval; they are not synced to narration and must be revised after the script and audio are approved.

## Scale and projection — Film C06-S02 brief R3

- `CATBOX-METER-R1` is a proposed design baseline, not measured data: owner 1.70m; Mochi 0.45m standing / 0.35m seated; sofa seat 0.45m high; BOX-OLD 0.38×0.38×0.32m. Origin `O` is the BOX-OLD floor anchor; `+X` screen-right, `+Y` up from the shared floor, `+Z` toward viewer; 2D art lies on `Z=0` and uses layer order for occlusion.
- `PROJ-CATBOX-ORTHO-R1` is implemented in `src/scenes/projection.ts`, types/validation and renderer dispatch. Long uses `X=[-3.60,+2.44]m`, `Y=[-0.85,+2.55]m`. Short uses a uniform1.15m view (`X=[-0.323438,+0.323438]m` at center0, `Y=[-0.275,+0.875]m`), with camera centerX-.20 through localF689, intentional cut to-.55 atF690, easing through-.25 atF870 to0 atF1049. Camera centerY stays.30m; Long center is(-.58,.85)m.
- Mark boardR4 and scene sheetR4 follow Film briefR3. Mochi holds worldX-.55 before SH03, walks continuously right toX0 by35s, then sits at BOX-OLD seatY≈.091915m. No actor reset is used. Source-bound calibration gives about.454m body length under uniform scaling; .48m remains the nominal design estimate.
- This revision covers C06-S02 and its C06-S01/C01-S01 continuity references only. The other eleven scene sheets and their Short scale/framing are **not audited** against this baseline.
- Film recommends the fixed-view 2D orthographic composition. A 3D BOX-OLD remains conditional if shared 2D layers cannot show entry/sit contact; the active checkout has no Three.js stage integration.

| Order | Storyboard scene | Runtime scene index | Composition frames | Shot-local frames (`SH01` → `SH04`) |
|---:|---|---:|---:|---|
| 1 | CATBOX-C01-S01 | `scene[0]` | `[0,1350)` | `[0,210)` · `[210,540)` · `[540,990)` · `[990,1350)` |
| 2 | CATBOX-C01-S02 | `scene[1]` | `[1350,2700)` | `[0,360)` · `[360,720)` · `[720,1080)` · `[1080,1350)` |
| 3 | CATBOX-C02-S01 | `scene[2]` | `[2700,4050)` | `[0,270)` · `[270,690)` · `[690,1050)` · `[1050,1350)` |
| 4 | CATBOX-C02-S02 | `scene[3]` | `[4050,5400)` | `[0,300)` · `[300,720)` · `[720,1050)` · `[1050,1350)` |
| 5 | CATBOX-C03-S01 | `scene[4]` | `[5400,6750)` | `[0,240)` · `[240,630)` · `[630,1020)` · `[1020,1350)` |
| 6 | CATBOX-C03-S02 | `scene[5]` | `[6750,8100)` | `[0,300)` · `[300,690)` · `[690,1050)` · `[1050,1350)` |
| 7 | CATBOX-C04-S01 | `scene[6]` | `[8100,9450)` | `[0,300)` · `[300,750)` · `[750,1080)` · `[1080,1350)` |
| 8 | CATBOX-C04-S02 | `scene[7]` | `[9450,10800)` | `[0,300)` · `[300,690)` · `[690,1050)` · `[1050,1350)` |
| 9 | CATBOX-C05-S01 | `scene[8]` | `[10800,12150)` | `[0,300)` · `[300,690)` · `[690,1050)` · `[1050,1350)` |
| 10 | CATBOX-C05-S02 | `scene[9]` | `[12150,13500)` | `[0,300)` · `[300,720)` · `[720,1050)` · `[1050,1350)` |
| 11 | CATBOX-C06-S01 | `scene[10]` | `[13500,14850)` | `[0,300)` · `[300,690)` · `[690,1050)` · `[1050,1350)` |
| 12 | CATBOX-C06-S02 | `scene[11]` | `[14850,16200)` | `[0,300)` · `[300,690)` · `[690,1050)` · `[1050,1350)` |

## Historical foundation QA — before C06-S02 R4

- **One-second coverage:** `Short` and `Long` each rendered 540 JPEG samples at 0, 30, …, 16,170 frames (30 fps), at 50% scale for sheet review. Raw sequence folders: `out/qa/cat-boxes/Short-1hz/` and `out/qa/cat-boxes/Long-1hz/`. The labeled contact sheets are under `out/qa/cat-boxes/contact-sheets/` (60 PNGs total): 17 one-second pages per composition (`Short-1hz-01.png`–`17.png`, `Long-1hz-01.png`–`17.png`), two scene-boundary pages per composition, ten critical-event pages per composition, and one A-fade ending page per composition. The pages label composition, scene/shot, time and frame. They are overview evidence, not proof that every adjacent pair is jump-free.
- **Critical boundary set:** both formats rendered 45 F-1/F/F+1 samples covering all 11 runtime scene boundaries, the C06-S02 reveal `[15539,15540,15541]`, the ending-shot start `[15899,15900,15901]`, A-fade hold onset `[16109,16110,16111]`, and the B-loop seam `[0,16198,16199]`. Folders: `out/qa/cat-boxes/Short-boundary/` and `out/qa/cat-boxes/Long-boundary/`.
- **Authored motion/event keys:** both formats also rendered 306 F-1/F/F+1 samples around picture-move keys, actor pose changes and prop visibility cues, plus the scene-cut/reveal/ending frames above. Folders: `out/qa/cat-boxes/Short-critical/` and `out/qa/cat-boxes/Long-critical/`.
- **Endings:** full-resolution stills show the C06-S02 closing card at A-fade frame 16,110. B-loop frame 16,199 is pixel-identical to frame 0 in both formats; F16,198 differs, so this is an intentional hard cut to the loop seam, not a seamless loop. The portrait and landscape blockout are previews; neither the nine-minute portrait output nor its seam is approved for publication.
- **Scale revision:** the previous actor-only portrait override was superseded by the shared physical projection and FilmR3/MarkR4 camera crop. The C06-S02 checks below supersede the old final-scene images; other scenes retain their original normalized blockout.
- **Checks:** after clean `npm ci` in the managed worktree, `npm run typecheck`, `npm run lint`, and `npm test` all passed (22 tests). Remotion packages remain at 4.0.538; no dependencies changed.
- **Studio/audio:** Studio seek/playback remains unverified. `npm run start` fails before bundling with `EMFILE: too many open files, watch`, including after clean `npm ci`, with raw QA folders moved aside, `CHOKIDAR_USEPOLLING=true`, `--webpack-poll=1000`, and `--disable-git-source`. Narration is omitted; script approval and audio/subtitle synchronization remain pending. Contact sheets do not establish random-seek/reload parity by themselves.

## C06-S02 R4 runtime QA

Historical bounded QA snapshot from the earlier CATBOX implementation branch, before current origin/main 5095d25 and before these six Short boards. It does not establish visual QA for the six new Short cuts; Boss must create fresh Short-only evidence.

- Inputs: `scripts/cat-boxes/blockout.json`, scene[11], Short1080×1920 / Long1920×1080 at30fps, `ending: A_fade`; current base main`ce2a0b1`, runtime working tree on`906a85e`. No approved narration is supplied.
- Both compositions rendered77 full-resolution checks: one-second samplesF14850,14880,…,16170, finalF16199, F-1/F/F+1 at scene start/shot edges/sit/hold, and unchanged-consumer samplesF0/F8100/F12150. Exact lists are in `out/qa/cat-boxes/projection-final/manifest.json`; images and labeled contact sheets are in that folder.
- Both continuous previews coverF14820–16199 (46s,1380frames), including one second of the previous scene. Short is540×960 and Long960×540. Frame-difference review of all decoded adjacent frames found the largest changes at the intentional scene cutF14850, Short camera cutF15540 and A-fade; dense cut/sit sheets were visually inspected. This is bounded CLI review, not an interactive Studio pass.
- Direct rendering after browser remount and out-of-order seeking atF16050/F15000/F15750: all Long images and two Short images are pixel-identical; ShortF15000 differs by5 subtitle edge pixels, maximum channel delta2/255. No geometry displacement was observed. Details: `review-metrics.json`.
- The projected seated silhouette above the shared front rim is about528px before picture movement; Short start/entry/sit sheets keep the visible lead and Thai band readable. The final card appears at35s above the actor. Physical dimensions remain design estimates, and exact acting/handwriting remains polish.
- B-loop stillsF0/F16198/F16199 were refreshed in both formats: F16199 matchesF0, whileF16198 differs. The output seam is an intentional hard cut. A-fade final frame is black.
- The C06-S01→C06-S02 cut is rendered and intentionally reframed. The preceding scene remains uncalibrated in physical units, so physical cross-cut continuity is **unverified**; there is no next story scene. The other11 scene sheets remain unaudited against the new scale model.
- `npm run typecheck`, `npm run lint` and26 tests pass. Studio remains unavailable under [DF-20261026-studio-emfile](../../docs/dev-findings.md#df-20261026-studio-emfile); direct-pixel projection fix is recorded under [DF-20261026-subpixel-stage-projection](../../docs/dev-findings.md#df-20261026-subpixel-stage-projection). Native Excalidraw export inspection, approved audio/subtitle synchronization and publishable Short assembly remain pending.
- Preview files: `out/qa/cat-boxes/projection-final/Short-c06-preview.mp4` and `Long-c06-preview.mp4`. Regenerate CLI evidence with local `node scripts/cat-boxes/render-qa.mjs --video`; the reusable helper is committed and generated media remains outside Git.

## Shared assets and capabilities

| Shared ID | Use / status | First scene and reuse | Dependency / note |
|---|---|---|---|
| ROOM-2D + SOFA-2D | Existing integrated 2D `room` background / sofa source | C01-S01 → all scenes | `src/assets/Background.tsx`, `src/assets/props/Sofa.tsx`; visual QA both crops. |
| HUMAN-2D | Existing 2D owner rig | C01-S01 → all scenes | `src/rig/Character.tsx`; check pose and hand gesture coverage. |
| CAT-2D | Existing rig; physical conversion and seated blend opt in for C06-S02 | C01-S01 → C06-S02 | `src/rig/physicalScale.ts`, `Animal.tsx`; source bounds preserve uniform proportions. Other scenes retain normalized geometry. |
| BOX-OLD | Shared complete image or rear/front layers; SVG-to-metre anchors | C01-S01 → C06-S02 payoff | One timeline identity; floor/seat/grip/front-rim metadata in `src/assets/Props.tsx`; .38×.38×.32m remains estimated. |
| OUTLINE / STIMULI | Implemented in issue #33 as 2D outline and square/Kanizsa/outward-control cards | C01-S01 → C04/C06 | Complete SVG image per prop; verify gaps/direction in both formats during scene polish. |
| FILE / STUDY-CARDS | Implemented in issue #33 as reusable folder and parameterized evidence card | C01-S01 → C06-S02 | Thai labels are drawn from the reviewed scene sheets; current cards are blockout layout, not final typography. |
| TOY-2D | Implemented in issue #33 as one complete 2D toy image | C03-S01 only | Fictional action; no live prey. Actor path is representative blockout. |
| CUBE-2D | Implemented in issue #33 as a closed, cloth-wrapped 2D cube image | C05-S02 only | Not an open box or sitting prop; study details remain scoped to the board. |
| PROJ-CATBOX-ORTHO-R1 | Implemented shared orthographic projection, camera and world paths | C06-S02 R4 | `src/scenes/projection.ts`, `types.ts`, `timeline.ts`, `SceneRenderer.tsx`; room/sofa in `src/assets/backgrounds/CatboxRoom.tsx` / `props/Sofa.tsx`. |
| PICTURE-MOVE | Implemented in issue #33 through scene `pictureMove` keys, validation and renderer dispatch | All 48 storyboard shots | Deterministic 2D whole-picture transform; not a physical camera/projection and currently shared by both formats. |

Implementation status on the issue #33 branch: existing room/sofa and human/cat rigs are in `src/assets/Background.tsx`, `src/assets/props/Sofa.tsx`, and `src/rig/`. `src/assets/Props.tsx` now registers the reusable CATBOX props and contact metadata. `src/scenes/types.ts`, `timeline.ts`, and `SceneRenderer.tsx` integrate and validate `pictureMove` and `subtitleCues`. The timeline is a runnable blockout, not scene polish. C06-S02 additionally opts into the shared physical projection, physical room/sofa, uniform actor bounds and layered BOX-OLD; all screen-space inlays declare their coordinate owner.

## Scene entry → exit continuity

| Scene | Entry | Exit / next-scene handoff |
|---|---|---|
| CATBOX-C01-S01 | เปิดห้องนั่งเล่นครีมโทนอุ่น; เจ้าของอยู่ซ้ายหน้าโต๊ะและมองมือถือ; โซฟากลางขวา; กล่องเก่าอยู่ข้างโซฟาทางขวา ถูกแฟ้มบังบางส่วน; Mochi อยู่บนพื้นใกล้โซฟาแต่ไม่เข้ากรอบแบน | เจ้าของกางการ์ดรูปทดลองสามแบบไว้เหนือโต๊ะ; กล่องเก่ายังอยู่พิกัดเดิม; สายตาและแกนซ้ายไปขวาคงเดิม |
| CATBOX-C01-S02 | รับจากการ์ดรูปทดลองในฉากก่อน; เจ้าของอยู่ซ้ายมือพร้อมปากกา; กล่องเก่าข้างโซฟายังถูกแฟ้มบัง; ไม่มีการข้ามแกน | ป้ายหน้าคดีมีช่อง “เพราะ…” ว่าง; เจ้าของวางปากกาและมองไปยังกล่องเดิม; พร้อมเข้าสู่คำถามหน้าที่ของที่หลบ |
| CATBOX-C02-S01 | เจ้าของยังมองกล่องเดิมในบ้าน; เขาเปิดการ์ด “ที่หลบ”; Mochi คงอยู่ข้างโซฟา ไม่กลายเป็นตัวอย่างงานศึกษา | การ์ดสรุป “ปรับตัวเร็วขึ้นในบริบทที่ศึกษา” อยู่เหนือแฟ้ม; เตรียมเปรียบเทียบงานอีกชิ้น |
| CATBOX-C02-S02 | รับแฟ้มและการ์ดผล CSS จาก C02-S01; owner อยู่ซ้าย; กล่อง/กรอบยังอยู่คนละภาพ | owner แยกกอง “ผลที่วัด” และ “สิ่งที่เดา”; สายตากลับไปที่การเล่นของ Mochi เพื่อเปิด C03 |
| CATBOX-C03-S01 | Mochi นั่งในกล่องเก่าข้างโซฟาทางขวา; owner กับสมุดอยู่ซ้าย; ของเล่นอยู่หลังขอบเฟรมซ้าย; มีป้าย “เรื่องสมมติ” ตั้งแต่เฟรมแรก | ของเล่นหยุด; Mochi กลับนั่งต่อในกล่อง; owner เปลี่ยนคำถามเป็นหลายหน้าที่; box และ screen direction คงเดิม |
| CATBOX-C03-S02 | รับจาก Mochi กลับนั่ง; owner เก็บของเล่น; โซฟา/กล่อง/แฟ้มในพิกัดเดิม; ไม่ข้ามแกน | owner วาง “ที่ซุ่ม” ในกองอาจเป็นไปได้โดยไม่ประทับตรา; มองคำถามความอุ่นเพื่อ C04 |
| CATBOX-C04-S01 | owner เปิดโน้ตใหม่บนโต๊ะ; cat อยู่ในบ้านห่างจากแอร์/ฮีตเตอร์; ไม่มีอุปกรณ์ปรับอุณหภูมิหรือแผนผังทดลอง | owner วางปากกาและทิ้งการ์ดไว้ในแฟ้มตรวจคำอ้าง; ไม่เปลี่ยนสภาพบ้านหรืออุณหภูมิ; เปิดคำถามว่าสิ่งที่วัดตอบอะไร |
| CATBOX-C04-S02 | รับการ์ดคำถามจาก C04-S01; owner ยังไม่ปรับอุณหภูมิห้อง; กองที่ซุ่ม/ความอุ่นอยู่ในแฟ้มอาจเป็นไปได้ | การ์ด “อาจเป็นไปได้” มีความอุ่น; owner พบ card “กล่องเหมือนอ้อมกอด?” เป็นคำถาม ไม่ใช่คำเฉลย; ส่ง C05 |
| CATBOX-C05-S01 | owner ถือการ์ด “เหมือนอ้อมกอด?”; old box remains on right; no mother cat in environment or memory flashback | owner keeps “อ้อมกอด” as metaphor; pressure remains unconfirmed; an object study card enters for U02 |
| CATBOX-C05-S02 | owner วาง object study card ต่อจากข้อเสนออ้อมกอด; Mochi เดินมาดมของ fiction แล้วเดินออก; old box remains untouched at sofa | owner มองเห็นการปนคำถามและเริ่มจัดแฟ้มใหม่; Mochi ไม่เข้ากล่องจน C06 |
| CATBOX-C06-S01 | owner เปิดแฟ้มใหม่; กอง “ผลที่วัด” และ “สิ่งที่เดา” จาก C02/C05 กลับมา; Mochi อยู่ใกล้โซฟาแต่ยังไม่กลับกล่อง | owner ไม่ประทับ “ยืนยันแล้ว” บนทุกใบ; Mochi หัน/เริ่มเดินผ่านแฟ้มไปทางกล่องเดิม; payoff C01 planted box is next |
| CATBOX-C06-S02 | Mochi เริ่มเดินจากขอบโซฟาผ่านแฟ้มทางซ้ายไปทางกล่องเก่าขวา; owner อยู่หลังโต๊ะ; preserve CL01 placement and axis | Mochi sits in same old box; owner smiles and writes “ครั้งนี้ยังไม่รู้”; held ending about three seconds; no feline narration or secret visual cause |

## Color script and screen grammar

- Home base: warm cream room; soft window key from deep right; dusty rose sofa; mint/green accents and dark rounded outlines consistent with channel references. Each actor receives contact shadow; rim edge appears if the image is graded dark.
- Research inlays: high-contrast cream/blue cards; amber marks claims under review; never use green comfort cues on the temperature range. Cards are explanatory overlays in the home and explicitly labeled as illustrations.
- Camera grammar: small frame-driven 2D picture-stage pan/push across the whole picture, with actor/card action; no 3D camera movement. Mochi remains ≥480 visible pixels in every Short shot where he appears; if the owner is also a foreground lead, he also remains ≥480px. Owner-only explainer crops omit Mochi. Subtitle band stays fixed in screen-space.
- Reveal grammar: CL01 old box is partially screened by a folder from C01-S01 and uncovered by the C06-S02 walk. CL02 blank “เพราะ…” is planted C01-S02 and resolved only as “ครั้งนี้ยังไม่รู้” in C06-S02. CL03 evidence piles return in C06-S01; CL04 action vs motive returns in C06-S02; CL05 novelty card appears in C05-S02 and is separated from rest.

## Dependency-aware PR order — historical Long-source plan

This sequence plan belongs to the retained 12-scene Long source. The Shorts-first runtime below supersedes its former Short assembly follow-up; it does not replace the Long scene/continuity map.

1. **Storyboard PR #32:** merged to `main`; contains the blockout brief, editable boards and scene sheets.
2. **Shared foundation / runnable blockout issue #33:** current branch `codex/33-catbox-foundation`. It adds shared 2D assets, picture movement and the executable 12-scene placeholder sequence. Dependent scene branches start from refreshed `main` after this PR merges.
3. **Scene PRs in narrative order:** `CATBOX-C01-S01` → `C01-S02` → `C02-S01` → `C02-S02` → `C03-S01` → `C03-S02` → `C04-S01` → `C04-S02` → `C05-S01` → `C05-S02` → `C06-S01` → `C06-S02`. Each scene PR waits for issue #33 and the previous scene PR, updates the same timeline and index mapping, and checks the adjacent cut.
4. **Short-specific assembly:** implemented on the current `codex/33-catbox-foundation` continuation in PR #38 as six independent four-scene JSON inputs and six registered Short compositions. The generic `Short` and `Long` compositions still use the retained 12-scene / 540-second blockout.

## Feasibility and review criteria

- Issue #33 adds the initial `pictureMove` contract and CATBOX asset registry; PR #38 integrates the visual modes needed by the six Shorts through types → validation → shared implementation → renderer dispatch.
- Every Short shot has authored frame-driven visual progression; camera/framing supports the action and is not its only change. C03/C06 use the calibrated physical home stage; diagrams remain screen-space explainers.
- Validate the three stimulus drawings and their labels; C01 tally and pairwise comparison must remain separate; C02 CSS is qualitative and scoped; C04 range never reads as comfort/thermostat advice; C05 cube remains distinct from a sitting box; C06 old box matches CL01 and the reason remains blank.
- This pass verifies the six new 45-second portrait Shorts only. Long rendering and QA remain a later project; the retained 12-scene / 540-second blockout, Long scripts and boards are source material and have no new Long pass claim. The Shorts remain draft because script approval is pending, narration is absent, subtitle timing is estimated, Studio seeking and runtime factual-image approval are unverified. Excalidraw checks alone do not establish runtime or audio sync.

