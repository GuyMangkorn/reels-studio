# EDU-SERIES delivery

- Series: educational clips for the 4-head painted cast (p5.brush). Request (user's words, 2026-11-04): "คิดไอเดีคลิปให้ความรู้ที่เหมาะกับตัวละคร 4 หัวและการใช้ paint p5 หน่อย".
- Ideation: W0 done. [concepts.md](concepts.md) R1 (Preaw pitch + Film annotation). User picked **C2 ตกจากหน้าผาในความฝัน** for EP01 (structured question, 2026-11-04) and said: "เก็บ concept ทั้ง 6 ไว้ผมเลือกทำฝันก่อน อาจจะทำ 6 episode". C1, C3–C6 stay in concepts.md as the series bank. Layout: this folder, one deliverable ID per episode (`EDU-EP01-SHORT`, …), each with its own full pipeline.
- Deliverable: `EDU-EP01-SHORT`; selection: **Short only (Thai)**, 1080×1920, 30 fps (user, structured question "Short ไทย (แนะนำ)", 2026-11-04). Target duration from C2: 40–60 s (estimate).
- Profile from C2: educational (body / sleep), painted 2D (p5.brush), 4-head cast, ending `C_seamless` per the concept; other fields = [project defaults](../../docs/delivery-workflow.md#project-defaults).
- Pipeline: `Full`.
- Factual claims: the hypnic jerk and its proposed causes; Boat to research; the cause is presented as theory, not settled fact.

| Deliverable | Stage / Next owner | Script | Evidence / open items |
| --- | --- | --- | --- |
| EDU-EP01-SHORT | W2.2 done -> storyboard page review (user) | [research.md](research.md); [EDU-SCRIPT-R1.1](short/script.md) ([fact-check](short/fact-check.md)) | open: voice (sample before integration) |

## Handoff log

- 2026-11-04: Preaw W0.1 concepts R1; Film W0.2 annotation (Opus); user picked C2 for EP01, keeps all six as a possible series; Short Thai selected. Next Boat W1.1.
- 2026-11-04: Boat research done (research.md). Coordinator rules for script: causes = hypotheses (tree idea marked speculative); 'falling feeling' not 'dream'; no percentage in narration; add one doctor line; fiction sounds labelled. Next Preaw W1.2.
- 2026-11-04: Preaw script EDU-SCRIPT-R1 written (16 lines, ~49-57 s est., C_seamless, ALT-A tree idea excluded). Next Boat W1.3 (look hard at L04, L10, L11, L13, L14).
- 2026-11-04: Boat fact-check done; 4 inline fixes (L01, L04, L10, L13); ALT-A stays out; script R1.1. Film note: on-screen 'ภาพจำลอง' tag in B03, soft mood shift for L04. Next user W1.5.
- 2026-11-04: user approved EDU-SCRIPT-R1.1 as is (structured question); ALT-A stays out. Next Film W2.1 brief + W2.2 storyboard rows.
- 2026-11-04: Film brief EDU-BRIEF-R1 + review-rows SS-R1 (23 shots, ~55.5 s est). User Q1: cast = woman-bob + new: pyjama. Page built at out/review-pages/EDU-EP01-SHORT/index.html (not published: Artifact tool unavailable in this session; SendUserFile failed: not on a project thread). Next: user storyboard verdicts, then Film W3.1 look frames.
- 2026-11-04: coordinator published the storyboard page for SS-R1 (23 shots, artifact v1): https://claude.ai/artifact/EGGvCUCR4DUHPWFueYmBLy . Verdicts live in its `db` under `reviews/<shot ID>@board` with `rev`. Republish from `out/review-pages/EDU-EP01-SHORT/` via `python3 -I scripts/storyboard-page/build.py scripts/edu-series/short/review-rows.json`, same file path. Next user: storyboard verdicts; then Film W3.1 look frames.
- 2026-11-04: Film W3.1 look frames LF01–LF05 v1 (LF01 bedroom, LF02 dream cliff, LF03 idea space, LF04 trigger icons, LF05 doctor) in `src/painted/edu01/` (standalone entry `look-index.ts`, `EDU1-LF0n`); store `projects/EDU/previews/look-frames/ep01/v1/`; review-rows `looks` + beat `look` added (Q1 removed as decided), page rebuilt at out/review-pages/EDU-EP01-SHORT/ (not published). Open for the user: pyjama trousers vs the brief's shorts; caption style on bright paper/dream grounds (caption-zone fails LF02–LF05). Thumbnails (W3 default) skipped on coordinator instruction. Next: viewer check (fresh Film, Opus), then coordinator republishes. Notes: [build-notes.md](build-notes.md).
