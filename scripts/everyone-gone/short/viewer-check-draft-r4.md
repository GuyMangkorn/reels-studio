# Viewer check round 4: EG-EP01-SHORT Draft (EG-SC-R4, before publishing)

- Checker: Film, fresh invocation (did not paint these), 2026-11-03.
- Earlier rounds: [r1](viewer-check-draft.md), [r2](viewer-check-draft-r2.md), [r3](viewer-check-draft-r3.md).
- Change under check (EG-SC-R4): point B moved to 1.5 m from the door, the bollard moved to the lower right at B, the S03-B01-SH01 push retargeted, and the point A shots re-rendered.
- Evidence: the current `out/EG-EP01-SHORT/clips/<shot>_draft.mp4` (360x640) plus `.full.mp4` (1080x1920) for crops, and `out/EG-EP01-SHORT/qa/r4/sheet.png`. Extra frames were pulled with system `ffmpeg` at the clip times below (clip time includes about 1 s of the neighbouring shot). The frames are in the session scratchpad and are not filed.
- Rows: the "seen" fields in `review-rows.json`.

| Shot | Reads as (no narration) | Result | Notes / fix |
| --- | --- | --- | --- |
| S01-B01-SH01, S01-B02-SH03, S04-B01-SH02 (point A) | The same wide shot of the shop across the soi each time. The door opens and closes by itself in SH03 and S04-SH02. | **pass** | The framing, door size and timing match across all three. The feel is unchanged from r3. The caption on the red band is readable. |
| S02-B01-SH01 | A cut from the stall to the shopfront, then a short approach (t 1.2 → 2.9 s): the door grows, the bollard slides to the lower right and the view settles close to the door. | **pass** | Reads as walking up to the door and stopping close. The whole door and the sensor box are in frame and centred. The walk is short (about 1.7 s) but clear. The caption sits just under the sensor box and does not cover it. |
| S02-B01-SH02 | The right hand comes up and waves (t 1.5–2.6 s), then the view bounces (t 3.8 s). The door stays shut. | **fail (shadow only)** | The wave and the jump work. The row's long bollard shadow is missing: at B the bollard is at x ≈ 0.90W and only a short wedge shows at its base (crop at S04-SH01 t 3.0 s, same plate), so the shadow falls off the right edge. Fix in the point B plate (shared by SH01–SH04, S04-SH01): move the bollard base to x ≈ 0.70W, y ≈ 0.80H so that its shadow, which runs right and down like the point A scooter shadows, stays in frame at ≥ 1.5× the bollard height, or turn the sun so the shadow falls left. |
| S02-B01-SH03 | The same still view of the door. The glass shows only the pale street and buildings. | **pass** | The empty reflection reads quietly, as the row asks. |
| S02-B01-SH04 | The door slides open on a still view, holds, then closes. | **pass** | The opening is clear and the size matches point A. |
| S03-B01-SH01 | A push toward the sensor box, a dissolve to the paper diagram card, then the waves and the ball. | **fail (dissolve)** | The push does not land on the card. At t 1.55–1.7 s two sensor boxes show: the painted box is at about y 0.34–0.40H, x 0.47W, while the card box is at y ≈ 0.50H, x 0.50W, and the painted door is wider than the card door. Fix: end the push with the painted sensor box centred at about (540, 960) in 1080x1920 and at the card box's width (about 0.14W), or move the card's sensor box and door to the push's end position. The card captions sit in the dark header band and are readable. |
| S04-B01-SH01 | A still view at point B of the shut door, with the bollard at the lower right. | **fail (same shadow)** | Same cause and fix as S02-SH02. Without a visible long bollard shadow, the clue "the pole has a shadow, you don't" does not read. |
| S04-B01-SH03 | A continuous step in (t 1.1 → 1.4 s, no cut), then the right hand reaches up to the glass (t 1.5–2.6 s). | **pass** | The step from 1.5 m to 0.8 m reads as one step, and the sensor box stays visible at the top left. The hand is on the glass, between the mullions. The cut to SH04 (the back of the figure, right hand on the glass at the door) is continuous. The caption over the pale glass is readable (1080 px crop at t 2.1 s). |
| S04-B01-SH04 | Point A with you at the glass, a slow pull back to the whole soi, then a fade to black. | **pass** | Unchanged from r3. |

## Verdict

Not ready to publish: there are two fixes, both one-time returns to Boss. (1) The point B plate: bring the bollard shadow into frame (S02-SH02, S04-SH01). (2) The S03-SH01 push end: align it with the card's sensor box. Every other shot passes. Caption legibility on the bright door and the red band passes.
