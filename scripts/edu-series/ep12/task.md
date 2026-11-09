# EDU-EP12-SHORT — task

Record: this file. Series context: [concepts.md](../concepts.md) (R6, C35) · series task list: [task.md](../task.md).

**Now:** Boat Q-F2 picture recheck done 2026-11-09 (a,b,d,e ok; c ok once N1 applied: no even rings on the space spine; N2: uneven tape steps, largest first; both Film edits, pending). W2 done, waiting for the user's storyboard verdicts on the review page (https://claude.ai/artifact/FAZn7KHyyxBit72SSZbvmL); decide Q-F2a/b/c, B01-SH03, B05-SH03. Then W3 look frames.

- Deliverable: `EDU-EP12-SHORT`, Short only (Thai), 1080×1920, 30 fps, target 40–60 s (estimate). Profile: educational, painted 2D p5.brush, 4-head cast, Kore narrator (edu default), ending per concept: closed, ~2 s hold on the boy asleep, then the doorframe (the user may change it); other fields = project defaults.
- Factual claims for Boat: see the C35 entry in concepts.md R6. All unchecked until research and fact-check. Thin spots: daily height loss figure (about 1 cm / about 1 % of stature, range by height); NASA astronaut growth up to about 3 %; back-pain wording (no mechanism claim beyond "ตัวยืด" and "ปวดหลัง").
- Kit gaps (Film R6): `new: spacesuit` for a female astronaut (reuse EP08 `eva-suit`/P46/`zero-g-drift` if it fits), doorframe with pencil marks, see-through spine and sponge layer, station interior plate, landing-capsule insert.

- Decisions after W1.1 (user, 2026-11-08, structured question): (1) hook uses a range, "ราว ๆ หนึ่งถึงสองเซน", on average, not "เกือบหนึ่งเซน"; (2) the astronaut wince stays as a dramatized beat with no stated cause ("นักบินอวกาศหลายคนปวดหลัง", no "เพราะ"); (3) closing line reworded to "คุณสูงที่สุดของวัน คือตอนเพิ่งตื่นนอน". Also from Boat: do not show or say discs refill or swell in orbit (NASA: disproved); say "ไม่มีอะไรกดตัว กระดูกสันหลังยืดออก"; no claim about the boy as a child; keep the astronaut anonymous; doorframe test needs same spot, posture and bare feet.

- [x] W0 Ideation (C35, user pick 2026-11-08; Short Thai)
- [ ] W1 Script lock
  - [x] W1.1 Boat research (2026-11-08)
  - [x] W1.2 Preaw script (EDU-EP12-SCRIPT-R2, est. ~55 s, 2026-11-09, sound intent per beat added)
  - [x] W1.3 Boat fact-check (2026-11-09: R1 pass with changes, R2 recheck pass; [factcheck.md](factcheck.md); advisory A1 declined by user 2026-11-09: L11 stays)
  - [x] W1.4 Length check (2026-11-09: PASS. One Gemini Kore read of L01-L13, 1 request, no atempo, no retry: 43.68 s raw, speech ends 43.34 s; with scripted no-line gaps, V01-V03 and end holds about 50 s video, target 40-60 s, limit 63 s. Measure [measure.json](measure.json); store `projects/EDU/audio/2026-11-09_ep12-nar-kore-fullread.wav`; not listened, L08-L09 edges +-0.15 s; unchanged R2 so it is also the voice-lock read pending W4.3 user approval)
  - [x] W1.5 User approves the script (R2, user 2026-11-09; voice Kore at 6.5 % slower is the pending W4.3 pick)
- [ ] W2 Brief and storyboard (Film brief carries `Sound direction`)
  - [x] W2.1 Film brief EDU-EP12-BRIEF-R1 `ready-for-mark` (2026-11-09, [brief.md](brief.md), 17 shots est. 53.6 s, SND-01..14); ending = closed hard end per C35 (Editor confirms runtime value, Q-F1)
  - [x] W2.2 Film storyboard rows EDU-EP12-ROWS-R1.0 `ready-for-review` (2026-11-09, [review-rows.json](review-rows.json), [storyboard.md](storyboard.md), 18 shots, sound cell per shot)
  - [x] W2.3 Storyboard page published 2026-11-09 (https://claude.ai/artifact/FAZn7KHyyxBit72SSZbvmL, ROWS-R1.0, artifact v1794216740-2c0e, slug 72b5d5cd-aac9-43cb-b967-9d78e3c0992f, private; verdicts in its `db` under `reviews/<shot ID>@board`)
- [ ] W3 Look frames and storyboard pass
- [ ] W4 Voice lock
- [ ] W5 Draft
  - [ ] W5.1 Film timed scene sheets, a `Sound` line per shot
  - [ ] W5.2 Boss assets and plates
  - [ ] W5.2s Ton sounds and cue sheet (0/C cues; generated/library) with per-beat `levels` checks from [EP08b](../../../docs/editor-principles.md#ep08b-keep-each-layer-at-its-distance-from-the-voice) (Default for Ton passes from 9 Nov 2026), parallel with W5.2
  - [ ] W5.3 Editor draft: places the cue sheet, mixes to the levels, exports stems, Ton measures with `scripts/mix-levels.py`, passes `scripts/sound-cues.py`
- [ ] W6 Final
- [ ] W7 Pinned
- [ ] W8 Deliver (render, cover, posting, kit intake)
