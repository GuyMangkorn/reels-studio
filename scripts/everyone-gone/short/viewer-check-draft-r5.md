# Viewer check round 5 (narrow): EG-EP01-SHORT Draft, last check before publishing

- Checker: Film, fresh invocation (did not paint these), 2026-11-03.
- Earlier rounds: [r1](viewer-check-draft.md), [r2](viewer-check-draft-r2.md), [r3](viewer-check-draft-r3.md), [r4](viewer-check-draft-r4.md) (2 fails).
- Boss fixes under check: (1) the point B bollard shadow is drawn up the shopfront wall in the scene's sun direction, about 1.0x the pole height; (2) the S03-B01-SH01 push is now a 1.1x tilt-down that ends at f16, with the drawn sensor box on the card's box.
- Evidence: the current `out/EG-EP01-SHORT/clips/<shot>_draft.mp4` (360x640), plus a crop from `S04-B01-SH01_draft.full.mp4` at t 3.0 s (x 480–1080, y 950–1650), and `out/EG-EP01-SHORT/qa/r5/k1–k3.png`. Extra frames were pulled with system `ffmpeg`: S03-SH01 at t 1.0/1.3/1.5/1.6/1.7/1.8/2.0/2.5 s; S02-SH01 at 1.5/2.9 s; S04-SH03 at 1.2/2.4 s; S02-SH02 at 3.0 s. Clip time includes about 1 s of the neighbouring shot.
- Scope: only the two r4 fails plus a regression skim. Every other r4 pass carries over.

| Shot | Reads as (no narration) | Result | Notes / fix |
| --- | --- | --- | --- |
| S04-B01-SH01 | A still view at point B of the shut door. The bollard at the lower right throws a slanted dark shadow from its base up and to the right over the shopfront, about as long as the pole. | **pass** | The shadow reads as a shadow because it starts at the base and leans away in a sunny frame, so "the pole has a long shadow and you have none" works. Your own shadow would fall forward on the empty floor in front of you, so the empty floor carries the "none" half. The 1.0x length is enough. Optional polish, not blocking: the band gets wider toward the top and has the same blue-grey tone as the glass, so for a moment it can look like a glass fin. A constant-width band (pole width) in a warm darker grey would read faster. |
| S02-B01-SH02 | Wave, then the view bounces. The door stays shut. The same pole shadow shows on the right. | **pass** | The arm covers part of the shadow at t 1.5–2.6 s, but the shadow is clear at 3.0 s. The r4 flag (the right-hand phone buttons cover the lower right) still applies, and the row already pushes the clue to S04-SH01. |
| S03-B01-SH01 | A short tilt-down push onto the sensor box, then a dissolve into the paper diagram card, then the waves. | **pass** | Only one sensor box shows through the dissolve (t 1.6–1.8 s). The painted box sits on the card box at about x 0.50W, and the door outline change during the cross is acceptable. The card settles cleanly by 2.0 s, and the caption band is clear. |
| S02-B01-SH01 (skim) | The approach to the door, ending close, with the bollard and its shadow at the lower right. | **pass** | No regression. The new shadow does not clutter the approach. |
| S04-B01-SH03 (skim) | A continuous step in, then the hand at the glass. | **pass** | No regression. The bollard and its shadow crop out at the lower right edge as the step lands. |

## Verdict

Ready to publish from the viewer side: both r4 fails are fixed and nothing new is broken. The only remaining item is an optional, non-blocking polish of the shadow's shape and tone at S04-SH01.
