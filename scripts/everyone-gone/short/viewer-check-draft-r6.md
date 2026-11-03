# Viewer check round 6 (narrow): EG-EP01-SHORT Draft after EG-SC-R5 ("closer")

- Checker: Film, fresh invocation (did not paint these), 2026-11-03.
- Earlier rounds: [r1](viewer-check-draft.md) … [r5](viewer-check-draft-r5.md).
- Change under check (EG-SC-R5, user's second "closer" note): point B 1.1 m from the door, lens f 540, walk passes the bollard at about 0.9 m, cold band tone behind captions on B plates, S03-B01-SH01 eases lens 540 -> 464 onto the card. Rows: `review-rows.json` SS-R6, `sc02.md`, `sc04.md`.
- Evidence: `out/EG-EP01-SHORT/qa/r6/sheet.png` (12 frames) and the 12 `out/EG-EP01-SHORT/clips/<shot>_draft.mp4` (360x640, about 1 s of neighbour shot each side). Extra frames with system `ffmpeg`: S02-SH01 t 0.3/1.2/2.1/3.0/3.7; S02-SH02 t 0.8/1.0/1.2/1.4/1.6/2.0; S02-SH03 t 0.3/1.2/2.2/3.3; S03-SH01 t 0.5/1.5/2.5/4/6/8/10; S04-SH03 t 0.3/0.9/1.1/1.2/2.2/2.6/2.75/3.3. Viewed at 200–270 px tiles (CB03).

| Shot | Reads as (first-time viewer) | Result | Notes / fix |
| --- | --- | --- | --- |
| S02-B01-SH01 | A walk from across the forecourt right up to the shop door; the bollard starts small left of centre and grows to a tall post in the lower centre as I pass it. | **pass** | Approach and "towards the pole" both read; the pole roughly triples in height across the shot. Door whole with its sensor box on the lintel at the end. |
| S02-B01-SH02 | Standing at the door, my hand comes up and waves; the door stays shut. | **fail (minor)** | At the hold the palm sits clear, right of the pole. But on the way up (clip t about 1.1–1.3 s, roughly 6 frames) the palm passes exactly over the bollard cap and reads for a moment as a hand grabbing the pole. Fix: start the arm's raise path right of the pole so the arc never crosses it: palm screen x at every frame >= pole right edge + 0.10 W (about +36 px at 360 W), entering from the lower-right corner; keep the hold pose and timing unchanged. |
| S02-B01-SH03 | Same view at the door, glass shows only the empty street, nobody reflected. | **pass** | Reflection empty. |
| S02-B01-SH04 | The door slides open on its own onto a warm, lit interior. | **pass** | Warm interior clear against the cold exterior; caption legible over the cold band. |
| S03-B01-SH01 | From the door view the camera tilts and narrows onto the sensor box, which dissolves into the diagram card's sensor. | **pass** | One sensor box only at the dissolve (t 1.5 s). The lens pull + tilt reads as "look at that box" as well as the old push did; card lands clean and stable, labels and waves readable through 10 s. |
| S04-B01-SH01 | (unchanged from r5) still view at point B; pole shadow slanting up the shopfront. | **pass** | Shadow clue still reads (sheet frame 9 area / r5 crop). |
| S04-B01-SH03 | Cut from the wide (man at the door) to my view at point B; I lean in a little and raise my hand. | **pass (weak)** | The step 1.1 -> 0.8 m reads as a small lean-in: lintel box grows about 1.25x, pole slides down-left. It is carried more by the cut from the wide than by the move, and the hand covers part of it. Acceptable for publishing. If the user wants it stronger: end at 0.6 m over the same frames (door scale 1.83x instead of 1.37x), ease-out, so the bollard leaves frame bottom-left before the hand peaks. |
| S04-B01-SH04, A shots (S01, S04-SH02) | Unchanged in feel: elevated train/street establishing, market stall, wide of the man at the open door. | **pass** | No regression seen. |
| Captions (all) | White Thai lines on B plates now sit on a slightly darker cold band. | **pass** | Legible at 270 px tiles on every sampled frame; S01-SH01 two-line caption still the busiest but readable. |

## Verdict

1 minor fail (S02-SH02 wave crosses the pole cap during the raise), 1 weak pass (S04-SH03 step-in), everything else passes. Fix S02-SH02 before publishing; S04-SH03 change is optional (user's call).
