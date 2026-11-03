# Viewer check round 3: EG-EP01-SHORT Draft (before publishing)

- Checker: Film, fresh invocation (did not paint these), 2026-11-03.
- Earlier rounds: [viewer-check-draft.md](viewer-check-draft.md), [viewer-check-draft-r2.md](viewer-check-draft-r2.md).
- Evidence: the current `out/EG-EP01-SHORT/clips/<shot>_draft.mp4` (360x640 draft) and `out/EG-EP01-SHORT/qa/r3/sheet.png`, `sheet2.png`. Extra frames were pulled with system `ffmpeg` at the clip times listed below and tiled with `scripts/qa-sheet.sh` at 200 px. The sheets are in the session scratchpad and not filed. In each clip the first and last ~1 s are the neighbouring shots.
- Rows: the "seen" field in `review-rows.json`.

| Shot | What it reads as without narration | Result | Notes / fix |
| --- | --- | --- | --- |
| S01-B02-SH01 | Opens wide down a soi, with distant buildings and small scooters (clip t 1.1 s). The shopfront grows steadily (t 1.8 → 2.5 → 3.2 s) until it fills the frame. Wires and a pole pass overhead. | **pass** | It now reads as walking into the alley. The round-2 fail is closed. |
| S01-B02-SH02 | The cut frames (t 0.9 / 1.0 s) are the same framing, with the same scooters, bollard and door, so the cut is continuous. The tilt rises to a 3-car windowed train on a grey deck beam, with a pier going down (t 2.0–5.5 s). | **pass** | Reads as a train on a viaduct, and it is not too small. Minor note for Final: the caption sits on the beam/pier junction. If the caption zone allows, lift the train and beam about 40 px (1080 scale) so the beam stays clear. |
| S01-SH01 → SH02 cut | No prop jump. | **pass** | |
| S03-B01-SH01 | Push-in on the painted sensor box, then a dissolve to the paper card. The sensor emits arcs, a plain circle (not a person) comes in, and orange arcs come back. The slate band carries the caption. | **pass** | Matches the row. |
| S03-B01-SH03 | Two circles. The left one has wide green return arcs; the right one has tight orange arcs. The label "ขยับ → คลื่นที่สะท้อนกลับเปลี่ยนความถี่" sits at the bottom and overlaps nothing (t 2.0–4.0 s). The card dissolves back to the painted door (t 4.2–4.8 s). | **pass** | At 200 px the spacing difference shows (wide vs tight), so the comparison matches the row. Weak point: neither circle visibly moves, so "which one is moving" comes only from the colour and the label. Optional fix for Final, Boss `SensorCard`: drift the right circle x 740 → 700 over f0–90 and add 2–3 short speed lines on its right side. The slate band is the same in SH01–SH03 and fades with the card, so it reads as the card's header. Minor: `sheet2.png` (middle tile) shows the band briefly without text before the caption arrives. Fade the band in with the caption. |
| S04-B01-SH02 | The same wide shot of the door, which opens by itself. The white flyer by the door slides about 12 px at 360 (≈37 px at 1080) and turns slightly as the door starts to open (t 1.3 → 2.3 s). | **pass** | Visible when you look for it, which is what the row asks for. It is still small (≈24 px wide at 1080), but enlarging it is not needed. |

Result: all 5 checked shots and the SH01→SH02 cut pass. The page can be published. The optional Final notes are S03-SH03 motion of the right circle, the band fade-in, and S01-SH02 caption clearance.
