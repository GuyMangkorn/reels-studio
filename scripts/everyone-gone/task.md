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
  - [x] W5.1 Film timed scene sheets (EG2-SC-R2.0 ready-for-dev, 2026-11-03: ep02/index.md + sc01–sc05.md, 19 shots, 1928 f; rows SS-R2.0 timed, review page: pending; word edges `est`; optional gap requests GR1–GR3)
  - [x] W5.1 Film timed scene sheets (EG-SC-R1 ready-for-dev, 2026-11-03: short/index.md + sc01–sc04.md, 17 shots, 1945 f; review-rows SS-R3 timed, review page: pending republish; 2 word edges `est`, Editor snaps)
  - [ ] W5.2 Boss assets and plates (partial, 2026-11-03, Boss: all 17 shot plates built as `ShotPlate` in `src/painted/everyone-gone/shots.tsx` (`EG-PL-<shot id>` via plate-index.ts), `doorOpen`/`DOOR_CLOCK`, camera paths (walk-in, tilt, pull-back A to C with fade), viaduct + train (train angle reworked 3 Nov after user note: foreshortened faces, verticals lean to the zenith VP; out/eg/bts/after.png; Draft not reviewed), timed `SensorCardShot`, door/glass/paper/shimmer options; 51 stills viewed (out/eg/plates/sheet-A-S01-S02.png, sheet-B-S03-S04.png), figure 356 px at A / 204 px at C measured, tsc + npm test pass. Open: Film answers on DF-20261103-eg-shot-plates (viaduct as sky card, door centre 460 at B, sheet deviations); no moving-clip review yet (stills only); caption stills with real captions are Editor's; groups G1-G5 not yet shown to the user as a Draft; NEEDS-GEN SND-NG01..08 untouched)
  - [x] W5.4 Sound stage (Editor 2026-11-03: SND-NG01..08 generated and filed; full spine in src/videos/everyone-gone/index.ts; notes in short/sound-notes.md; measured + render-checked, NOT listened to or approved by the user)
  - [ ] W5.3 Draft passed (0/17 shots user-passed; Editor 2026-11-03: composition `EG-EP01-SHORT` registered (src/videos/everyone-gone/index.ts, 17 scenes, 1945 f, registry plates `EG-<shot id>` in src/painted/shots/everyone-gone.tsx), narration lock in public/narration, captions, `est` edges measured (L19 `ที่` f1731, L11 `กระโดด` f886-901); 17 Draft clips rendered into the review rows, review page not published; Draft audio = narration + fridge hum + drone + riser only, SND-NG01..08, pad, felt notes, heartbeat and footsteps not added; Draft rev 2 (Editor 2026-11-03): L19 cue split at the SH02/SH03 cut (second half `ที่เดินผ่านคุณไป` at f1731), clips re-rendered through the scene cache after Boss plate fixes, QA in out/EG-EP01-SHORT/qa, not published)
- [ ] W6 Final passed (0/N shots)
- [ ] W7 Pinned (0/N shots)
- [ ] W8 Deliver
  - [ ] W8.1 Assembled from the cache, picture lock
  - [ ] W8.2 Delivery render archived

## EG-EP02-SHORT

**Now:** W5.1 timed sheets done (EG2-SC-R2.0, rows SS-R2.1, voice T-v4 = T-v3 + GR1); W5.2 Boss shot sets for 19 shots merged (PR #215); timed storyboard page republished 2026-11-03 (artifact v5). **Now (cont.):** Editor registered `EG-EP02-SHORT` and rendered 19 Draft clips (W5.3). **Next:** coordinator republishes the page; user passes the Draft shot by shot.

- [x] W0 Ideation
  - [x] W0.1 Preaw concepts (concepts.md R1)
  - [x] W0.2 Film annotation (photo-based; superseded by the painted decision)
  - [x] W0.3 User picks a concept (C3, painted 2D, 2026-11-03)
- [x] W1 Script lock
  - [x] W1.1 Boat research (ep02-research.md; sources LOW-MEDIUM)
  - [x] W1.2 Preaw script (ep02-script.md EG2-SCRIPT-R1, A_fade)
  - [x] W1.3 Boat fact-check (PASS, R1.1)
  - [x] W1.4 User approves the script (R1.2, 2026-11-03)
- [ ] W2 Brief and storyboard
  - [x] W2.1 Film brief (EG2-BRIEF-FILM-R1)
  - [x] W2.2 Film storyboard rows (ep02/review-rows.json, 19 shots, untimed)
  - [x] W2.3 Storyboard page published (rows SS-R2.1 timed, https://claude.ai/artifact/Qc5e45d8SEBMhD13dTgLfF v5, 2026-11-03)
- [x] W3 Look frames and storyboard pass (look lock + 19/19, user 2026-11-03)
  - [x] W3.1 Look frames LF01–LF05 added to ep02/review-rows.json (Film 2026-11-03; store EG/previews/look-frames/ep02; `คุณ` = episode-local stand-in `ep02/you-hoodie.ts` until the kit back view lands; thumbnails step skipped on the coordinator's assignment; viewer check done: [ep02/viewer-check.md](ep02/viewer-check.md); fix pass v2 done 2026-11-03 with the kit back view, store EG/previews/look-frames/ep02/v2, brief R1.2; VD12 caption style open; page republish pending)
  - [x] W3.1 verdict pass v3 (Film 2026-11-03): LF01 shop/door detail, boat moored alongside (LF03/LF05), crowd collision rule VD13 + tests/eg2-crowd-collision.test.ts; store EG/previews/look-frames/ep02/v3/; review page: pending
  - [ ] W3.2 Look frames approved (look lock)
  - [ ] W3.3 Storyboard passed
- [x] W4 Voice lock (T-v3, user 2026-11-03)
- [ ] W5 Draft
  - [x] W5.1 Film timed scene sheets (EG2-SC-R2.0, 19 shots, 1928 f)
  - [x] W5.2 Boss shot sets for SS-R2.1 (19 shots, commit 3c134e4; crowds VD13 test, sheetFlip, hoodPull)
  - [ ] W5.3 Draft passed (0/19 shots user-passed; Editor 2026-11-03: composition `EG-EP02-SHORT` registered (src/videos/everyone-gone/index.ts, 19 scenes, 1939 f = voice T-v4 EG-EP02-SHORT-narration-B-x108-tight-v4.wav + 90 f hold; registry plates `EG2-<shot id>` in src/painted/shots/everyone-gone-ep02.tsx); captions verbatim, CaptionShade band, mark @TamMaiLa; sound spine with 11 new cues generated and filed (EG2 set, not listened); 19 Draft clips rendered into ep02/review-rows.json, review page not republished; 20 stills viewed (out/EG-EP02-SHORT/qa-sheet-1/2.png); npm test 452/0, tsc only 3 old tests/ errors)
- [ ] W6 Final passed
- [ ] W7 Pinned
- [ ] W8 Deliver

- 4 Nov 2026: EG-EP02-SHORT Draft r5 published (page v11): SS-R2.6 set detail + L11 voice R1.3. Awaiting user review.

- 4 Nov 2026: Draft r5 approved (user, chat). Next: Final stage (full-quality clips, pin) and commit, both awaiting the user's go.
