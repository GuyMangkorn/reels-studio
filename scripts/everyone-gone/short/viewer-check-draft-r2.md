# Viewer check round 2: EG-EP01-SHORT Draft (after fixes)

- Checker: Film, fresh invocation (did not paint these), 2026-11-03.
- Round 1: [viewer-check-draft.md](viewer-check-draft.md).
- Evidence: `out/EG-EP01-SHORT/clips/<shot>_draft.mp4` (stall clips 12:31–12:32, the rest 11:35–12:27). Six frames per clip at even times from t 0.95 s to (end − 0.95 s), tiled with `scripts/qa-sheet.sh` at 270 px. The first and last tiles are the neighbouring shots. Cut frames for S01-B02-SH02 are at t 0.90–1.13 s. Sheets are in the session scratchpad and not filed.
- Rows: `review-rows.json` "seen" field. Scene sheet: `sc03.md` (S03-B01-SH03).

## Round-1 fails

| Shot | What it reads as now (without narration) | Result | Notes / fix |
| --- | --- | --- | --- |
| S04-B01-SH04 | A person seen from behind at the door, right arm raised, open hand flat on the glass, in every frame from the cut (t 1.3 s) through the pull-back to the dimmed end (t 5.7 s). Wires, poles and no shadow. | **pass** | P16 reach is right. Continuity with SH03 holds (hand on glass in both). |
| S01-B02-SH02 | First frame of the shot (clip t ≈ 1.0 s) is fully painted: shopfront, no white half. The tilt reveals a windowed 3-car train running across the top of the frame. | **pass** (train reads) | Two minor notes for Boss. (1) No viaduct beams or columns show, so the train seems to run on the roofline. Add the deck/column edge under the train (`viaduct.ts`) at y ≈ 380–420 px. (2) Jump at the cut: SH01 ends and SH02 starts on almost the same framing, but the scooters and bollard vanish (clip t 0.97 → 1.00 s). Keep the same props in the SH02 plate, or start SH02 already tilted. |
| S01-B02-SH01 | Overhead wires run across the top. A pole passes in front. The door enters once from the right and drifts to centre. The camera still reads as a sideways slide past one shopfront: the store barely grows, so it does not feel like walking down the soi. | **fail (weak)** | The plate is x −4 → 0.5 m with z 8 → 5.5 m (DF-20261103-eg-shot-plates), mostly lateral. Fix for Boss: make forward travel dominant, e.g. x −1.5 → 0.5 m and z 12 → 5.5 m. Yaw the camera about 30° down the soi so the façade recedes in perspective, and add a walk bob of 1–2 cm at about 2 Hz. Keep the door entering once. Wires and scooters pass. |
| S01-B03-SH01/02/03 | The back wall is now cool grey. A pole, overhead wire, hard cast shadows and a dark doorway read as an outdoor side street. The pot surface and steam are the warm accent; the coffee is the warm point in SH02. SH03's pull-back shows the table, cart and empty stools outdoors. | **pass** | Outdoors reads through the wire, pole and shadows. Optional for Final: a sliver of pale sky or a kerb edge would make it certain. The orange cart label is a second small warm spot in SH01; mute it to grey-beige so the pot stays the only warm point. |
| S02-B01-SH03 | Across the glass panels, the opposite building's window grid reads as a reflection over the pale interior. The place where "you" should appear is empty. No hand. | **pass** | The reflection is now stronger than the interior seen through the glass. |
| S03-B01-SH03 | The same card with one circle and one set of arcs. The fourth label sits across the green outgoing arcs and touches the bottom of the circle (clip t ≈ 2.2–4.6 s). | **fail** | No still-versus-moving comparison, and the label overlaps the circle and wave lines. Fix below. |

## S03-B01-SH03 fix (Film's own `sc03.md`; Film edits it, this report does not)

Add an explicit **Staging (card, px)** line to `S03-B01-SH03`. Today the sheet only says "both fields visible" without positions.

- **Still field (left):** a second circle, the same size, fixed at (300, 1130). It has no motion line. Its returning arcs are teal at 56 px spacing, the same as the outgoing arcs.
- **Moving field (right):** the existing circle at (700, 1130) with a short motion trail toward the door. Its returning arcs are orange and bunched at 34 px. The f=200 spacing criterion in SH01 already uses these numbers; apply them here from f 8.
- **Fourth label:** centred at (540, 1720), below the ground line (about y 1620). Maximum width 900 px. No arc or circle within 40 px. Fade in at f 8 as now.
- **Strings:** add no field tags, so the "exactly four strings" criterion still holds. The contrast comes from the drawing.
- **Acceptance:** at f 20 and f 90, both circles are visible, the two arc spacings differ visibly at 270 px, and the label overlaps nothing.

## Questions

- **S04-SH04 hand right of the figure vs S04-SH03 FPOV hand left of centre: acceptable, SH03 does not need to move.** Both shots look in the same direction, and in both the hand sits just right of the sensor box, on the same glass panel, beside the handle bar (SH03 hand about x 0.40 with the box centre about 0.33; SH04 hand right of the box and seam). The viewer matches the hand to the door features, not to frame centre.
- **Flyers not moving: S04-SH01 is not a problem.** The stillness is the point of the line ("ตรงหน้าไม่มีอะไรขยับ").
- **Flyers not moving: S04-SH02 is not a problem for a first-time read.** The empty door opening carries "เปิดให้ใครบางคน". It does deviate from its row, which asks for a small movement at ground level. Either Boss adds a slide of about 40 px with a slight rotation to the white flyer in front of the door, timed with the door starting to open, or Film removes the movement from the row. The flyer is now too small and still to notice.

Result: 4 of the 6 round-1 fails pass. Still open: S01-B02-SH01 (weak, Boss) and S03-B01-SH03 (Film scene sheet, then Boss `SensorCard`).
