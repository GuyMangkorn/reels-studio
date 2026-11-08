# EDU-EP09 thumb vs real-hand references (Boat, 8 Nov 2026)

Request: user, 8 Nov 2026, "fix the thumb: try pulling thumb reference images and compare". Fingers are accepted; this is the thumb only.
F = measured on the reference photos or on our render by pixel position (by eye on a 50 px grid, about +/-5%); E = estimate or recall, not measured here.

## Picture

`~/ReelsStore/projects/EDU-EP09-SHORT/references/boat/2026-11-08_thumb-compare-sheet.png` (local copy `out/thumb-compare/thumb-compare-sheet.png`, a 1800 px view `thumb-compare-sheet-view.png` beside it). Four panels, palm width (little-finger outer edge to index outer edge at the knuckles) scaled to the same 250 px, all thumb-right, fingers up:

1. Our macro, `PLAN-flat` rendered 8 Nov 2026 from `scripts/painted-kit/hand-macro.mjs` at commit 46b05a2.
2. R1 dorsal (rotated, flipped to put the thumb on the right).
3. R2 dorsal.
4. R3 palmar (mirrored).

## References (asset store, with sidecars)

| ID | Store file (`projects/EDU-EP09-SHORT/references/boat/`) | Source | Licence |
| --- | --- | --- | --- |
| R1 | `2026-11-08_hands-back-front-evanamos.jpg` | https://commons.wikimedia.org/wiki/File:Human-Hands-Back-Front.jpg (Evan-Amos), dorsal and palmar, relaxed, thumb free | CC BY-SA 3.0 |
| R2 | `2026-11-08_hand-back-genusfotografen.jpg` | https://commons.wikimedia.org/wiki/File:Hand,_fingers_-_back.jpg (Genusfotografen), dorsal, open | CC BY-SA 4.0 |
| R3 | `2026-11-08_hand-palm-genusfotografen.jpg` | https://commons.wikimedia.org/wiki/File:Palm,_fingers.jpg (Genusfotografen), palmar, open | CC BY-SA 4.0 |

Gaps: all three are adult hands in the air against a plain background. Commons searches found no openly licensed photo of a child's or boy's hand, and none of a hand lying relaxed on a table with the thumb at rest. So the resting angle on a table is an estimate, bounded by these open-hand photos. Reference use only; nothing is published in the video, so attribution is not carried.

## Differences, thumb only

| # | Feature | Real (3 photos) | Ours (PLAN-flat) | Label |
| --- | --- | --- | --- | --- |
| 1 | Angle away from the index (plan view) | thumb axis 43-57 deg from the index axis in R1, R2, R3 (R1 57, R2 43, R3 about 50) | about 16 deg (thumb 18 deg from forward, index 2 deg) | F (real and ours) |
| 2 | Tip lateral reach, as a share of palm width W beyond the index outer edge | 0.70-0.73 W in all three | 0.14 W (about 0.9 cm of 6.5) | F |
| 3 | Width vs index (plan view) | thumb tip and IP region 1.0-1.2 x the index at the same level (R2 about 1.15, R3 about 1.0-1.1) | thumb tip 80 px vs index tip 105 px = 0.76 | F (ours), E (real, by eye, 3 samples) |
| 4 | Web and thenar base | web is a curved notch low on the palm edge, above a broad thenar mass whose edge runs diagonally from the wrist to the thumb IP; thumb base is wider than the thumb | thumb is a capsule laid on the palm, the web is a straight seam, no thenar mass, palm edge stays straight | F (look), no number |
| 5 | Tip shape and nail | tip pad broad and round, nail seen at 3/4: nail width about 0.55 of the tip width, nail length about 0.45 of the distal segment, nail plane turned about 45 deg from the fingers' nail plane (R1 palmar shows the nail edge-on) | nail faces up like the fingers, 0.85-0.9 of the tip width | F (look and ratios by eye), E (45 deg) |
| 6 | Free length vs index proximal phalanx | free thumb (MCP to tip) about 1.6-1.7 x index PP (R1) | 3.8 / 2.16 = 1.76 | E (joint centres hidden), so length is not a defect |
| 7 | Tip landing vs index MCP | open thumb: tip level with index MCP, within 0.3 PP either side (R1, R2) | 1.4 cm past the index MCP, which matches a fully adducted thumb (about 0.65 PP, S3 in `hand-proportions.md`) | F (R1, R2), ours F |

Reading: the free length is right and the width is only slightly low. The thumb looks wrong because it is glued to the index (item 1, 2, 7), has no thenar base (item 4) and its nail faces the same way as the fingers' (item 5).

## Targets for Boss

| Target | Value | Label |
| --- | --- | --- |
| Thumb abduction in the flat plan pose (`cmcAbd` and the thumb axis) | from about 16 deg to 30-35 deg for a relaxed pose on a table (open hand in the air is 43-57 deg) | E (table pose), F (open range) |
| Thumb tip lateral reach beyond the index outer edge | 0.35-0.45 W = 2.3-2.9 cm at palm 6.5 cm (open hand 0.7 W = 4.6 cm) | E, bounded by F |
| Thumb tip along the fingers | 0 to +0.7 cm past the index MCP (0 to 0.3 PP) once the thumb is abducted; today +1.4 cm | F (R1, R2) |
| Free length | keep 3.8 cm (MP to tip), do not lengthen | E |
| Thumb width in plan | IP 1.8 cm and tip 1.65 cm (1.15 x index width 1.55); thumb base at the CMC 2.2 cm | E |
| Thenar and web | thenar mass edge from the wrist (lateral 1.2 cm) swelling to 2.4-2.6 cm lateral at the thumb MCP; web notch about 1 cm deep, low on the palm edge, curved not straight | E (shape F from photos) |
| Nail | width 0.55 x tip width (about 0.9 cm), length 0.45 x distal segment (about 0.8 cm), plane rolled 45 deg toward the index side so the nail reads at 3/4 | E, F for the ratios |

Check after the change: re-render `PLAN-flat` and `PLAN-tp`, view a sheet against R1 to R3, and confirm the TP table-contact thumb (lift 2.5) still lands on the plane.
