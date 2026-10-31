# Boss — HANAKO POV forearm taper, 31 Oct 2026

Scope: B01-SH01, B02-SH01, B05-SH01/SH02 and B09-SH01; standalone painted plates, SCENE-R4 as read during the pass. **Visual done is not claimed.** Mark's scene sheet, Film R5 and the B03 plate were not edited. The selected evidence does not establish sequence, audio, subtitle or Studio playback approval.

## Construction and projection

`paintPovHand` accepts optional `forearmElbowScale`; omitted uses the previous sleeve and forearm geometry, order, colours and seeds. Opted-in forearms interpolate from 128 × size at the wrist toward 150 × size × scale at the elbow; a long sleeve covers the arm to a cuff at 32% of the wrist-to-elbow segment. The sleeve widens toward its off-frame start and the cuff follows the actual sleeve direction. B01/B09 use 2.0; B05 uses 1.6; B02 uses 1.8 with elbow (1115,1000), sleeve start (1140,1250). Anchors, hand sizes, contact frames, tone constants and timing are unchanged. The hand kit uses its existing crisp, seeded solid polygons; this is not a conversion of the hand renderer to the separate `hardFill` API. No added contact shadow.

RR-KNOCK: door-plane k = 1200 px/m at depth 0.78 m; knuckle z = 0.15 gives depth 0.63 m and k = 1485.7 px/m. A 0.085 m palm projects to 126.3 px, versus the authored 190 × 0.66 = 125.4 px. The sheet's elbow z = 0.42 is 0.36 m from the eye, k = 2600 px/m; assumed 0.08 m there gives 208 px versus 0.06 m at wrist depth 0.63 m giving 89 px, a 2.33 ratio. These are approximate front-facing width checks; actual wrist depth and orientation are not independently specified and the forearm is a flat authored projection. At the nearer B01 contact depth the perspective changes; this parameter is an art-directed approximation, not a 3D projection solve. RR-DOOR: k × door depth = 600 × 1.56 = 936 px; 0.085 × 936/(190 × 0.8) = 0.523 m for the fist, consistent with the sheet's 0.53 m estimate. Dimensions are project estimates, not anthropometric claims.

B02's sleeve polygon sampled on each of the 139 frames has minimum x = 1010.6 (also below y 860), well right of x 888 and more than 55 px from seam x ≤ 835. Existing hand-envelope tests pass; the previously documented wrist corner remains the limitation. This is polygon geometry, not a pixel segmentation of the composited output.

## What the pictures show

The cuff now visibly joins the fist to a wider foreground sleeve in B01/B09. Its elbow remains off-screen and the exposed section still reads somewhat like a sideways arm rather than a strong near-to-far projection. B05 hands contact their targets and the earlier exposed skin bulges at the cuffs were removed; the arms are still nearly horizontal, so the perspective widening is subtle. B02 is no longer an isolated blob: a dark sleeve descends from the cropped fist toward the lower-right frame edge, but at 270 px it reads as a narrow, almost vertical strip and the fist/cuff remains crowded. Further framing or art direction is needed for a persuasive depth read; not a visual pass. Backgrounds were not edited.

Viewed 270 px sheets (before then after):

- `out/qa/hanako/taper/b01-compare.png`: F0 before/after, F18 before/after.
- `out/qa/hanako/taper/b02-compare.png`: top before F304/F417/F430, bottom after same. **F430 top uses the earlier S1-R4 render**, not the exact start-of-this-pass checkout; its cuff predates the later fix. Exact start-of-pass before captures exist for F304 and F417, but F430 was not captured before the change. This comparison cannot establish the exact F430 before/after difference.
- `out/qa/hanako/taper/b05-b09-compare.png`: F951 before/after, F2595 before/after.
- `out/qa/hanako/taper/f1127.png`: LF04 stop, blank ruled page and no hand. The existing test verifies hand absent and held camera for every stop frame; this still alone does not prove playback.

## Checks

- `npm run typecheck`, `npm run lint` and `npm test`: pass, 220/220 tests; lint has three existing hook warnings. Logs `out/logs/taper-final-{typecheck,lint,test}.log`. Two new tests check default original sleeve/skin polygons and opted-in wrist/cuff taper. A full pixel guarantee for every consumer is not proven.
- Untouched consumers: pre/post PNGs are byte-identical for WORLD FOG `WFOG-PREVIEW-S02-SH02` f30 and ZCPAINT `ZCPAINT-P8-B02-SH01-TH` f20 (`out/qa/hanako/taper/{before,after}-worldfog.png`, `{before,after}-zcpaint.png`). They were rendered after the first opt-in implementation; the final refinement changes only the opt-in branch, and the default-polygon test passes on final source.
- Caption band y860:1248: all 7 requested sampled frames pass (`out/logs/taper-final-caption.json`); no assertion for unsampled frames.
- Loop: final render session `B09-SH01-0.png` and `LOOP-LANDING-0.png` are byte-identical; 12 of 16 pair comparisons match across four renders each. One loop render drifted slightly; the earlier first pair differs, PSNR 116.07 dB. Exact repeat determinism across all captures is therefore **not** established; the pose/camera loop test passes. Files in `out/qa/hanako/taper/final/`.
- `git diff --check` passes. No full episode render, playback, random-seek/Studio inspection or assembled captions/audio check performed. Lead-height measurement is N/A to these foreground-only hands and LF04 prop insert. This is scoped asset evidence, not release QA.
