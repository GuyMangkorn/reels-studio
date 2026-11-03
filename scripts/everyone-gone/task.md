# Tasks — EVERYONE-GONE

Record: [delivery.md](delivery.md) · Updated: 2026-11-03, coordinator

## EG-EP01-SHORT

**Now:** W5.1 done (scene sheets EG-SC-R2 plate-matched 2026-11-03: door B x 460, Boss deviations accepted, SH02 train angle under Boss revision; Q2 pull-back confirmed). **Next:** coordinator republishes SS-R4 to the page; Boss assets and plates (W5.2). Q2 pull-back start: user marked ok without a note (read as Film's recommendation: cut to station A with you at the glass, then pull back to C); confirm in scene sheet.

- [x] W0 Ideation
  - [x] W0.1 Preaw concepts (concepts.md R1)
  - [x] W0.2 Film annotation
  - [x] W0.3 User picks a concept (C1)
- [x] W1 Script lock
  - [x] W1.1 Boat research (research.md; sensor sources weak, open items listed)
  - [x] W1.2 Preaw script (EG-SCRIPT-R1, C_seamless)
  - [x] W1.3 Boat fact-check (short/fact-check.md; 5 fixes applied)
  - [x] W1.4 User approves the script (R1.1, ends on L20b, no loop)
- [x] W2 Brief and storyboard
  - [x] W2.1 Film brief (EG-BRIEF-FILM-R1.2, ending = pull-back to small figure)
  - [x] W2.2 Film storyboard rows (short/review-rows.json, 18 shots, untimed; review page: pending)
  - [x] W2.3 Storyboard page published (2026-11-03)
- [x] W3 Look frames and storyboard pass
  - [x] W3.1 Look frames on the page (SS-R2, brief R1.3, Film 2026-11-03: FPOV per user review; LF01 FPOV station B + Q1 variants wave/reach, Q2 pull-back start LF05-START/LF05-GLASS; LF02–LF05 unchanged; store EG/previews/look-frames/ss-r2/; page republish pending)
  - [x] W3.2 Look frames approved (look lock)
  - [x] W3.3 Storyboard passed (18/18 shots ok, user 2026-11-03)
- [x] W4 Voice lock
  - [x] W4.1 Voice chosen (Achernar, v3 style, atempo 1.05)
  - [x] W4.2 Narration generated (one read, 64.8 s with L16 cut; per-line timing in short/voice-timing.md)
  - [x] W4.3 User approves the voice (lock, 2026-11-03)
- [ ] W5 Draft
  - [x] W5.1 Film timed scene sheets (EG-SC-R1 ready-for-dev, 2026-11-03: short/index.md + sc01–sc04.md, 17 shots, 1945 f; review-rows SS-R3 timed, review page: pending republish; 2 word edges `est`, Editor snaps)
  - [ ] W5.2 Boss assets and plates (partial, 2026-11-03, Boss: all 17 shot plates built as `ShotPlate` in `src/painted/everyone-gone/shots.tsx` (`EG-PL-<shot id>` via plate-index.ts), `doorOpen`/`DOOR_CLOCK`, camera paths (walk-in, tilt, pull-back A to C with fade), viaduct + train (train angle reworked 3 Nov after user note: foreshortened faces, verticals lean to the zenith VP; out/eg/bts/after.png; Draft not reviewed), timed `SensorCardShot`, door/glass/paper/shimmer options; 51 stills viewed (out/eg/plates/sheet-A-S01-S02.png, sheet-B-S03-S04.png), figure 356 px at A / 204 px at C measured, tsc + npm test pass. Open: Film answers on DF-20261103-eg-shot-plates (viaduct as sky card, door centre 460 at B, sheet deviations); no moving-clip review yet (stills only); caption stills with real captions are Editor's; groups G1-G5 not yet shown to the user as a Draft; NEEDS-GEN SND-NG01..08 untouched)
  - [x] W5.4 Sound stage (Editor 2026-11-03: SND-NG01..08 generated and filed; full spine in src/videos/everyone-gone/index.ts; notes in short/sound-notes.md; measured + render-checked, NOT listened to or approved by the user)
  - [ ] W5.3 Draft passed (0/17 shots user-passed; Editor 2026-11-03: composition `EG-EP01-SHORT` registered (src/videos/everyone-gone/index.ts, 17 scenes, 1945 f, registry plates `EG-<shot id>` in src/painted/shots/everyone-gone.tsx), narration lock in public/narration, captions, `est` edges measured (L19 `ที่` f1731, L11 `กระโดด` f886-901); 17 Draft clips rendered into the review rows, review page not published; Draft audio = narration + fridge hum + drone + riser only, SND-NG01..08, pad, felt notes, heartbeat and footsteps not added; Draft rev 2 (Editor 2026-11-03): L19 cue split at the SH02/SH03 cut (second half `ที่เดินผ่านคุณไป` at f1731), clips re-rendered through the scene cache after Boss plate fixes, QA in out/EG-EP01-SHORT/qa, not published)
- [ ] W6 Final passed (0/N shots)
- [ ] W7 Pinned (0/N shots)
- [ ] W8 Deliver
  - [ ] W8.1 Assembled from the cache, picture lock
  - [ ] W8.2 Delivery render archived
