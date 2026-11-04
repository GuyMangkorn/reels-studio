# Tasks — ZCONDO2

Record: [delivery.md](delivery.md) · Updated: 2026-11-04, Film (W5.1 timed scene sheets, SS-ZC2-R1)

## ZCONDO2-SHORT-TH

**Now:** W3.1 — user reset (3 Nov 2026): kit look. Film delivered brief `VB-ZC2-SHORT-R2`, rows `ZC2-SB-R2` (29 shots, casting line each) and four kit-look proof frames; the coordinator runs the viewer check, publishes the page (review page: pending) and asks `Q-ZC2-K1`, `Q-ZC2-K2`, `Q-ZC2-F5`. **Next:** Film — look frames for the remaining locations after the answer

- [x] W0 Ideation — N/A, carried over from ZCONDO
- [ ] W1 Script lock
  - [x] W1.1 Boat research (carried over)
  - [x] W1.2 Preaw script (R3)
  - [x] W1.3 Boat fact-check (R3)
  - [x] W1.4 Length check — carried over (~70 s)
  - [x] W1.5 User approves the script (28 Oct 2026)
- [ ] W2 Brief and storyboard
  - [x] W2.1 Film brief (text) — `VB-ZC2-SHORT-R2` (3 Nov 2026, reset to the kit look; R1–R1.3 looks superseded), [visual-brief.md](../../storyboards/zombie-condo2/short/visual-brief.md)
  - [x] W2.2 Film storyboard rows (review-rows.json) — `ZC2-SB-R2`, untimed, 29 shots, casting line per shot (3 Nov 2026)
  - [ ] W2.3 Storyboard page published
- [ ] W3 Look frames and storyboard pass
  - [ ] W3.1 Look frames on the page (2/6 locations as kit proof frames: L1 corridor, L2 unit; plus infected CU and drag)
    - [x] Superseded: LK-A/B/C/M/S thumbnails and rounds 1-9, `Q-ZC2-F3`/`F3b` (void after the reset, 3 Nov 2026)
    - [x] Kit-look proof frames of B02-SH05, B01-SH03, B02-SH04, B01-SH02 (3 Nov 2026, Film; `$REELS_STORE/projects/ZCONDO2/previews/ZC2-kit-frames-r1/`)
    - [ ] Viewer check of the proof frames
    - [ ] User answers `Q-ZC2-K1` (kit look fits), `Q-ZC2-K2` (infected design), `Q-ZC2-F5` (seated MS, cabinet, cast)
  - [x] W3.2 Look frames approved (look lock): user approved kit frames r6 (`~/ReelsStore/projects/ZCONDO2/previews/ZC2-kit-frames-r6/`), 4 Nov 2026; known flaw left: mouth-fist thumb up close
  - [x] W3.3 Storyboard passed (29/29 shots passed by the user on 4 Nov 2026 after arm, sleeve and elbow fixes; caption band 0.76 on bright shots at 1080:1248, wide shots kept, lead stays age 34; Film pass done 4 Nov 2026: `ZC2-SB-R3`, 29 blocking stills in the locked look, 25 new + 4 approved frames reused, review page: pending the coordinator's publish; stills `~/ReelsStore/projects/ZCONDO2/previews/ZC2-SB-R3/`; open: `Q-ZC2-S1` caption shade, `Q-ZC2-S2` wide shots; viewer check pending)
- [ ] W4 Voice lock
  - [x] W4.1 Voice chosen (reused ZCPAINT Kore +5 %)
  - [x] W4.2 Narration measured against the new timeline (4 Nov 2026, Editor: [short/voice-lock.md](short/voice-lock.md); 40 lines, speech end 92.87 s, 95.9 s kept; flags B02-SH01/SH02 <1 s, B04-SH02 9.86 s)
  - [x] W4.3 User approves the voice (listening first; approved 4 Nov 2026, Kore +5 % unchanged; B04-SH02 split in two at 24.37 s, done 4 Nov 2026: SH02 + SH02b, rows ZC2-SB-R3.1, 30 shots; new stills await the user's verdicts on the review page, pending)
- [ ] W5 Draft
  - [x] W5.1 Film timed scene sheets: `SS-ZC2-R1` (4 Nov 2026), [scene-sheet.md](../../storyboards/zombie-condo2/short/scene-sheet.md); 30 shots, 2877 f at 30 fps (sum checked), windows on the voice lock; Boss list G1-G11 (poses) + 16 sets + props in the sheet; ready-for-dev, review page: not needed (no look change)
  - [x] W5.2 Boss assets and plates (sign-off 4 Nov 2026, Boss; shot groups 5/5, 30/30 compositions `ZC2D-<shot>`; start/mid/end stills of all 30 viewed on 270 px sheets `$REELS_STORE/projects/ZCONDO2/previews/ZC2D-W52/g1-g5.png`; caption zone 1080:1248 at the cue frames 78/78 pass (B09-SH03 has no caption); lead height min 588 px (B08-SH02 end) vs 480 px rule, pass; seek parity alone vs range 6 shots PSNR 71-107 dB, pass; Editor scene integration/review pending in W5.3; no commit)
  - [x] W5.2b Boss viewer-check fixes (4 Nov 2026, Boss; 17 shots repainted: B01-SH01/SH03, B02-SH01/SH02/SH04, B03-SH01, B05-SH01/SH02/SH03, B06-SH01/SH02, B07-SH02/SH03, B08-SH01/SH02, B09-SH03, B10-SH01; stills `~/ReelsStore/projects/ZCONDO2/previews/ZC2D-R2/r2-1..3.png`; caption zone pass at all cue frames; seek parity PSNR >= 65 dB; details and open items in [build-notes.md](build-notes.md#2026-11-04--boss-fixes-after-the-viewer-check-zc2d-r2)); visual verdict waits for a second viewer check
  - [x] W5.3 Draft passed (30/30 shots; last one, B06-SH01, passed by the user in chat 4 Nov 2026 while its page verdict still showed the older "change"; third pass 4 Nov 2026: strong caption stroke (`captionStyle.strokeWidth/strokeColor/textShadow`) + shade peaks re-derived by rule ZC2-CAP-L1, build-notes; B10-SH01 chip overlap fixed in closing pass 3; Editor assembly done 4 Nov 2026: `ZCONDO2-SHORT-TH` in [src/videos/zombie-condo2/index.ts](../../src/videos/zombie-condo2/index.ts), 30 scenes = the SS-ZC2-R1 shots, 2877 f, plates `ZC2D-<shot>` registered in `src/painted/shots/zc2.tsx`, Thai captions from `lines.json`, 14 library beds/tracks and 40 scene cues, @TamMaiLa; 30 Draft clips through the scene cache and the page rebuilt, details in [build-notes.md](build-notes.md#2026-11-04--editor-draft-assembly-w53-zcondo2-short-th); waits for the user's Draft verdicts on the page; no commit) Draft verdict 4 Nov 2026: caption shade is now a tight band that follows the line count (CaptionShade `lines`, peaks re-derived, see build-notes "tight caption shade"); clips to be re-rendered once at the end. Caption zone rerun 4 Nov 2026 after Boss picture fixes: peaks B06-SH02 0.71->0.72, B07-SH03 0.67->0.62, rest unchanged; 78/78 pass (build-notes). Shade R6 4 Nov 2026 after Boss's viewer-check repaint: CAP_W remeasured, peaks B07-SH03 0.62->0.65, B08-SH02 0.08->0.25, B09-SH01 0.63->0.67; 78/78 pass, npm test 452/452, 30 Draft clips re-rendered and page rebuilt (build-notes R6); waits for the user's Draft verdicts. Closing pass 3, 4 Nov 2026: rule ZC2-CAP-L1 rerun on the pictures after the hand scale and repaints, 7 peaks lowered 0.01-0.10 (B10-SH01 -> 0), 29/29 captioned shots pass; B10-SH01 choice chips moved above the caption rows (tops 690/810/930); npm test 453/453; 30 Draft clips re-rendered and page rebuilt (build-notes); waits for the user's Draft verdicts.
- [x] W6 Final passed (30/30 shots; whole cut passed by the user in chat 4 Nov 2026; page verdicts not set; Film viewer check in build-notes)
- [x] W7 Pinned (30/30 shots, `pin.mjs pin-rows --ending=A_fade`, 4 Nov 2026)
- [ ] W8 Deliver
  - [ ] W8.1 Assembled from the cache, picture lock
  - [ ] W8.2 Delivery render archived
  - [ ] W8.3 Posted to the channel
  - [ ] W8.4 Kit intake (KIT-P01)
