# EP26 build notes

## W3.1 workshop look LF01, 2026-11-18

Shot B01-SH01, on [BRIEF-R1](short/film-brief.md) and [ROWS-R1](short/review-rows.json). Film rendered one 1080 × 1920 painted still through `scripts/stills.mjs` from `src/painted/edu26/look-index.tsx` (`EDU26-LF01`, frame 0), with the background-only companion for measurement. Scoped TypeScript check of the entry passed. The reviewed still and QA sheet are archived in `projects/edu/EDU/ep26-workshop-look-reviewed/` under `LF01.png` and `LF01-qa.png`.

- On the inspected QA sheet at 270 px, the 1,018 px visible customer height is 53.0% of frame height. The oil mark is about 102 × 54 px and ends at y1116, 60 px above the checked caption band.
- Final sample white glyphs x240–837 and y1264–1329 sit in the portrait safe box. The caption remains readable at 270 px; `caption-zone.py` full-band mean 0.377 and p95 0.670 exceed its dark-background defaults. The sample uses outline plus centered shade. Recheck all delivery cues in the edit.
- The first independent check failed for a visually detached pointing arm and extra hand-like forms beneath the hem (A-C). Film rebuilt the contact and clipped the POV sleeves into the visible frame edges. Film also shortened the displayed caption sample to the opening clause after measuring the original x901 right edge. The [final viewer check](short/viewer-check-look.json) passed on the updated bytes. A minor R-M observation remains: the cropped trough and subdued set dressing read as a historical workroom before they specifically read as a laundry. Native Codex Film was used for independent review because the Orca runtime was stopped.

## W3.2 LF01 R2, 2026-11-18

Film repainted B01-SH01 against both [user notes](fixlist.md). The inset water surface and inner trough wall, drying cloth and rope, terracotta cup and damp floor marks are visible. One apron-sleeved hand enters frame right and receives the garment. The customer's pointing arm connects from shoulder to finger, and the far support grip stays mostly hidden by the upper cloth edge. Film softened cloth and set value joins. Film and the coordinator inspected the 270 px QA pair. This repaint answers user feedback and was checked against it under the viewer-check repaint rule. The existing viewer-check record above applies to R1 bytes.

- `EDU26-LF01`, frame 0, 1080 × 1920 via `scripts/stills.mjs`. Scoped TypeScript check passed. SHA256 `1a449f70f2f229c788a8e55591b21247d7aef76172ddd460845e97b2482ce6cc`.
- Visible customer height 1,018 px. Stain bounds x561–661 and y1058–1116, 60 px above the caption band. Visible basin water is about 49 px wide at 270 px preview scale.
- White caption glyph bounds x240–837 and y1264–1329, inside the safe box. Caption legible at 270 px. Full-band luma mean 0.380 and p95 0.677 exceed the tool's dark-background defaults. The shade remains centered on the caption sample.
- R2 full frame and QA stored in `projects/edu/EDU/ep26-workshop-look-r2/`. The LAN review page loaded the rebuilt R2 preview from the Mac. Awaiting user look verdict.

## W3.2 LF01 R3, 2026-11-18

Film and coordinator inspected the 270 px QA sheet against the user's extra-arm note. The ivory shirt now folds below the visible green tunic and has no projecting sleeve shape. The customer's support arm is concealed behind the fold. The pointing arm attaches to the green shoulder, and the apprentice's receiving arm enters from screen right. R2 laundry set dressing stays in the frame.

- `EDU26-LF01`, frame 0, 1080 × 1920. SHA256 `e0f45b11368351df9effa3e3ed561ddd4438e2a0b7ca4daec7c848f9b8de2fcf`. Scoped TypeScript check passed.
- Visible customer height 1,018 px. Stain bounds x561–661 and y1058–1116, 60 px above the caption band. Caption white fill x240–837 and y1264–1329, readable at 270 px. Background band luma mean 0.380 and p95 0.677 exceed the dark-scene defaults.
- R3 full frame and QA stored in `projects/edu/EDU/ep26-workshop-look-r3/`. User review pending.

## W3 redesign look set, 2026-11-18

Film on `gpt-6.2-sol` at `medium` painted three standalone stills on [BRIEF-R2](short/film-brief-r2.md) and archived them with QA in `projects/edu/EDU/ep26-wash-bench-look-r1/`. Source `src/painted/edu26/wash-bench-look-index.tsx`, one Chrome through `scripts/stills.mjs` with ANGLE, output 1080 × 1920. Film and the coordinator viewed the 270 px QA sheet. Scoped TypeScript and ESLint passed.

| Still | Shot | Visible lead height | Visual evidence | White caption bounds |
| --- | --- | ---: | --- | --- |
| LF01 | B01-SH01 | ~525 px | 155 × 35 px stain, customer points across the bench and blue cuff receives from the opposite side. | x300–779, y1275–1331 |
| LF02 | B02-SH03 | ≥498 px | Terracotta jar projects about 140 × 178 px, grounded on the bench. Stained cloth remains visible. | x233–845, y1275–1320 |
| LF03 | B04-SH03 | ≥529 px | Matching double stitch and clean hem in the same workshop. Cloth low point y1196. | x404–676, y1277–1320 |

All sample glyphs fit the portrait safe box and remain legible at 270 px with a 0.21 shade and outline. Measured background mean/p95 luma is 0.322/0.444, 0.483/0.730 and 0.317/0.421. These exceed the dark-scene defaults. The [independent Film viewer check](short/viewer-check-look.json) passed 3/3. Minor findings: angular cloth folds at intake/payoff, jar partly hides coworker's placing hand, and customer's gaze remains fairly forward at payoff.
