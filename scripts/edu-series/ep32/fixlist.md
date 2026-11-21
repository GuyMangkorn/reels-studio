# EP32 fix list

One line per note: shot, note, owner, status.

- VD32-14 / all shots, Q2: label corner mark shows about 3 s then disappears (user override of SF01); update brief, rows, storyboard.md, owner Film, closed in BRIEF-R2/ROWS-R2 (VD32-14; Q6 no tag recorded in R3).
- All shots, user 2026-11-21: paper cut-out look only for B01–B02 (title page and park pop-up, about 17 s); then the camera zooms through the card into the normal painted 3D scenes for B03–B06. Brief, rows, storyboard.md and the transition to be revised, owner Film, closed in BRIEF-R2 (VD32-17/-18).
- LF02 eyebrows doubled (user note): fixed in kit/head.ts by Boss, still LF02-r2 sent to the user, closed.
- B02-SH01 camera: take Boss's gate camera (eye 1.45, 1.0, 2.7, yaw -28, pitch -17, f 1100) into the timed sheet, owner Film, in BOARD-R2/R3 (VD32-25); timed sheet pending.

## Boss (user note on LF03R, 2026-11-21)
- [x] Cat polish: smooth, less angular; the cat is the main character. Fix tail (reads as a segmented tube, F3), lie pose (sphinx crouch, F5), ear-mic and antenna thread in profile views (F5), thread as a continuous line not dashes. Same catDef, same size across the bridge. Done by Boss 2026-11-21 (kit `soft` cat + `loaf` pose, profile dressing; store `looks/EP32-LF03R-gate-r2`); awaiting the user's look verdict.
## Film (timed pass)
- [x] F1 @TamMaiLa mark vs mannequin head at start key; F2 end key crops heads; F4 cat size estimates ~1.4x low (233 px at LF03R); F6 empty lower frame: new keys in BOARD-R3 ([R3 camera keys](short/storyboard.md#r3-camera-keys), VD32-28), Film 2026-11-21. Open: caption-band luma at y 1230–1344 re-measured by Boss on the first plates at the R3 keys.

## Editor / Film (user note 2026-11-21: bigger subtitles, shorter cards)
- [x] (W5.3 pass 1, 2026-11-21: 55 cards, src/videos/edu-ep32/captions32.ts) Editor: captions as EP26 (scale 1.4 = 71 px, bottomEdgeY 1344, one-line cards, pop-in, split at pauses, min 15 f). Reuse the EP26 pattern, not its card data.
- [x] Film (R3, VD32-29: staging band y 1230–1344, faces/cat above y 1200; luma re-measure on the R3 plates): caption band in the timed sheet and in `shot-projection.py` checks assumes 1.4 scale (taller, wider text than LF02/LF03R sample); re-measure caption-band luma and lower-frame clearance when stills are redone.

## Film (user, LF04, 2026-11-21)
- [x] (BOARD-R3/ROWS-R3: B06-SH03, VD32-27; page republish by the coordinator pending) Add a short stamp insert shot in the B06 hold (words 'WOULD NOT BE PRACTICAL' readable at 540 px); keep B06-SH02 camera and B01-SH03 mirror; new rows revision and page republish; trim order may change.
## Boss (user, LF04, 2026-11-21)
- [x] Ear-mic: smaller metal capsule, no catchlight, so the sleeping cat does not read as having an open eye (shared dressing: paper cat B01–B02 and real cat). Done by Boss 2026-11-21 (`earMic` in edu32/cast.ts, front and profile; store `looks/EP32-earmic-r2`); awaiting the user's verdict.

## Editor (Draft round 1, user verdicts 2026-11-21; 16 ok, 3 change)
- [x] B03-SH03: line "มันไปนอนตากแดดแล้วครับ" is not clear enough (user: re-voice it with the same prompt so it is clearer). Owner Editor: new take of that line only, same voice and prompt, check clarity (whisper) and keep the line's frames, re-lock, re-mix. Done by Editor 2026-11-21 (Draft fix pass 1: L07 take 3 of 3, line frames 648-729 vs lock 654-738; details in build-notes.md "W5.3 Draft fix pass 1"); awaiting the user's verdict on the new draft cut.
- [x] B03-SH04: the wind-instrument effect sounds cut off oddly (user: "just make it a hit, we have time left in the clip"). Owner Editor/Ton: find the cue (C17 or a music tail), give it a natural tail or a clean hit; no dead cut. Done by Editor 2026-11-21: C17 played as a 0.33 s hit with a 0.2 s decay (source drops 20 dB in 40 ms at 0.36 s).
- [x] B06-SH03: the wind-instrument music at the end of the clip sounds cut off (M7 stinger ends G1676, clip G1689). Owner Editor/Ton: natural tail to the end; the clip may be extended by a few frames only if the tail needs it (flag it). Done by Editor 2026-11-21: no extension, M7 tail stretched in the mix (plays G1647-G1687).
