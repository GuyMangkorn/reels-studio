# Tasks — EP32

Record [delivery.md](delivery.md) · Updated 2026-11-21, Editor (W5.3 fix pass 1)

## EDU-EP32-SHORT

**Now:** W8.4 kit intake done (Boss, 2026-11-21); EP32 delivered to publish/, awaiting the user's post date **Next:** User posts to the channel (W8.3: store.py publish --posted <date>); EDU-EP33 (C120) next; commit only if asked

- [x] W0 Ideation
  - [x] W0.1 Preaw concepts — [C119 R21](../concepts/C119.md)
  - [x] W0.2 Film annotation
  - [x] W0.3 User picked C119 (first) and C120, 2026-11-21
- [ ] W1 Script lock
  - [x] W1.1 Boat research — EDU-EP32-RESEARCH-R1, 2026-11-21 (research.md; memo read directly; cost and first test disputed)
  - [x] W1.1b Hook pick — H1 (HK01) ไมค์ที่หูแมว, user, 2026-11-21 (short/hook-options.md)
  - [x] W1.2 Preaw script — EDU-EP32-SCRIPT-R1, 2026-11-21 (short/script.md, script-notes.md); projected ~58.7 s, estimated
  - [x] W1.3 Boat fact-check — EDU-EP32-FACT-R1, ready-for-storyboard, no must-fix; SF02–SF05 applied inline by coordinator (short/fact-check.md)
  - [x] W1.4 Length check — about 59.2 s after SF03 (limit 60 s), estimated, no read-aloud; trims: L06 then L10
  - [x] W1.5 User approval — SCRIPT-R1 with SF02–SF05 approved, 2026-11-21 (structured question: "อนุมัติ ไปต่อ")
- [ ] W2 Brief and storyboard
  - [x] W2.1 Film brief — EDU-EP32-BRIEF-R2 (hybrid look, VD32-01–26), 2026-11-21, ready-for-mark (short/film-brief.md)
  - [x] W2.2 Film storyboard rows — EDU-EP32-ROWS-R2, 18 shots, untimed (short/review-rows.json, short/storyboard.md BOARD-R2); local build passes
  - [x] W2.3 Storyboard page published, artifact https://claude.ai/artifact/KxuejcfYit5gxACo4fiWj3 (ROWS-R1, v1795235684-27cb)
- [ ] W3 Look frames and storyboard pass
  - [x] W3.1 Look frames on the page (4 look frames: LF02, LF-BR+LF03R, LF05, LF04), ROWS-R3
  - [ ] W3.2 Look frames approved (look lock)
  - [ ] W3.3 Storyboard passed (0/N shots)
- [ ] W4 Voice lock
  - [x] W4.1 Voice chosen: Kore x1.05 narrator, Algenib AGENT (by rule; user listening)
  - [x] W4.2 Narration generated and measured, 54.18 s, 1625 f (short/voice-measure-r1.md)
  - [x] W4.3 User approves the voice: Kore x1.00 + Algenib, 2026-11-21 (Editor rebuilds lock at x1.00)
- [ ] W5 Draft
  - [x] W5.1 Film timed scene sheets — EDU-EP32-SHEET-R1 + ROWS-R4, 2026-11-21 (short/timed-sheet.md; 19 shots, 1689 f; Boss groups G1–G7; questions Q9, Q10)
  - [x] W5.2 Boss assets and plates (7/7 groups G1–G7 built and frame-checked; stills only, no draft cut yet)
  - [x] W5.2s Ton sounds and cue sheet (51 cue rows on `EDU-EP32-SHEET-R1`: 44 generated, 7 library rows from 5 reused files; 39 new files filed, 44 locked in `src/videos/edu32-gates/assets.lock.json`; none listened; [sheet](short/sound-cue-sheet.md), [json](sound-cues.json); 2026-11-21, Ton; models unloaded)
  - [x] W5.3 Draft passed (19/19, user 2026-11-21: draft kept at the locked speed, re-read spy line L07 included; go to Final)
    - W5.3 pass 1 (Editor, 2026-11-21): composition `EDU-EP32-SHORT` assembled (19 scenes, 1689 f, 55 caption cards, 51 sound cues), half-size draft cut rendered and in the review rows (`draftCut`, `clips.draft`); frame sheets viewed, caption-zone passes, not listened; page not republished; awaiting the coordinator's republish and the user's Draft verdicts ([build-notes](build-notes.md))
    - W5.3 pass 2 (Editor, 2026-11-21): L06 narrator tail gets a 10 ms fade-out (no timing change), narration re-locked, sound mix and half-size draft cut re-rendered, review rows point to the new cut; mark and C30 unchanged by the user's choice; tests, sound-cues and context-map pass; not listened; page not republished
    - W5.3 fix pass 1 (Editor, 2026-11-21, Draft round 1: 3 changes): B03-SH03 L07 re-voiced and re-locked (frames 648-729, later lines on their lock frames), B03-SH04 C17 now a clean 0.33 s hit, B06-SH03 M7 given a natural tail inside 1689 f; half-size draft cut re-rendered and in the review rows; fixlist Editor items ticked; not listened; page not republished; awaiting the user's verdicts ([build-notes](build-notes.md))
- [x] W6 Final passed (0/N shots)
- [x] W7 Pinned (0/N shots)
- [ ] W8 Deliver
  - [x] W8.1 Assembled from the cache, picture lock
  - [x] W8.2 Delivery render and cover published (`publish/edu/EDU/EDU-EP32-SHORT/`)
  - [ ] W8.3 Posted to the channel (user, date; `publish --posted`)
  - [x] W8.4 Kit intake: new people, outfits, animals, poses, sets filed (KIT-P01)
    - 2026-11-21, Boss: filed the copies, eight gallery stills and paper-card regression fixture. See [intake and QA](build-notes.md#kit-intake-qa) for N/A items and the 19-scene cache check.
