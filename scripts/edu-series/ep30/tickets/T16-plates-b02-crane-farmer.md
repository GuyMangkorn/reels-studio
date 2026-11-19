# T16 — plates B02-SH01 (crane into the buffet) and B02-SH02 (the farmer at the gate) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plates) · Hard: yes (flock peck sync, farmer arm and face)
Blocked by: T03, T08, T09, T12 · Consumers: B02-SH01, B02-SH02 (global 200–439)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), shot blocks [b02.md](../short/scene-sheets/b02.md) B02-SH01 and B02-SH02.

## Build
Replace the two stub shot files. B02-SH01 is the crane with the high-view wheat fix (T09) and the buffet row (T08); B02-SH02 is the farmer pose F (T12) with one pecking emu.
Files: `src/painted/edu30/shots/B02-SH01.tsx`, `src/painted/edu30/shots/B02-SH02.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space P morning (m 0), `eaten: 0.4`, stubble 0; newsreel warm, strength 1 | T09 schedule |
| B02-SH01 camera | L 0–100: every field interpolated with e = ease-in-out(L / 100) from `eye (0, 22, 12), yaw 0, pitch −40°, f 820, hy 960` to `eye (−3.0, 1.3, −25.0), yaw 10°, pitch −4°, f 900, hy 860`; L 100–154: eye drifts 0.15 m linearly toward (−3.0, 1.3, −28.0) (horizontal direction to the nearest row bird), other fields held | b02 B02-SH01 Camera |
| B02-SH01 set | the gun clearing is not there yet (`setNoClearing(true)`), no crew, no G1, no gear; farmhouse (−90, 0, −160), gums, camp as `paintPaddock`; high-view wheat from T09 applies automatically while pitch ≤ −20° (L 0 to about L 55) | b02 B02-SH01 Staging ("gun position empty") |
| B02-SH01 flock | buffet row: T08 `buffetRow(L)` (six birds, all dip at L 135); F1: 45 birds from `flockIn(32100, 45, [−30, 30], [−60, −30])` excluding a 3 m corridor around the row, walk/peck phases on the ambient clock (global frame); far mass `far: {n: 400, x: [−80, 80], z: [−80, −200]}` | b02 B02-SH01 Staging |
| B02-SH01 title | from T02 `TITLES` (global [206, 240)); nothing to add in the shot | T02 |
| B02-SH02 camera | `eye (−2.2, 1.45, 7.6) → (−2.2, 1.45, 7.2)`, `yaw −1° → −8.5°`, pitch −2°, f 900, hy 860, ease-in-out over L 0–84 | b02 B02-SH02 Camera |
| B02-SH02 FARMER | T12 pose F at (−2.5, 0, 5.2) facing +z (front view, squared to the lens each frame), keys and face as T12 F (arm L 3–9 up, hold to 45, down by 60; gaze left to L 46, to the lens L 47–53; talking mouth inside global [358, 394) and [402, 431)); felt hat | b02 B02-SH02 Staging |
| B02-SH02 emu | at (−3.6, 0, 3.0), heading −x (left view, behind his right shoulder on screen left), stand idle; one peck: mix stand → peck L 36–40, hold 40–42, up 42–48; feet planted | b02 B02-SH02 Staging (peck on local 40) |
| B02-SH02 fence | the farmer stands in the gate opening (x −4.0 … −1.0): no wire crosses him; posts at x −4.0 and −1.0 painted in front of the paddock and behind him | brief space P (gate) |
| Probe leads | B02-SH01: nearest row bird (i 0); B02-SH02: FARMER, emu head | T03 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TP2.png` (high wide, the stripes to avoid), `projects/edu/EDU/previews/EDU-EP30-W3-r1/KP-peck.png`, `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (outfit and hat family; the farmer's felt hat and collarless shirt are `cast.ts` FARMER).

**Judgment for the builder (Hard).** The six heads dip on one frame (L 135, "บุฟเฟต์"): exact, comic. The farmer's arm chain is continuous through the raise; his right arm is on screen left; his anger reads in the face and the one gesture.

## Proof
- Stills: B02-SH01 at L 0, 55, 100, 131, 135, 140, 154; B02-SH02 at L 0, 9, 40, 47, 53, 60, 84 through `node scripts/stills.mjs src/painted/edu30/shots-index.tsx` (log to `out/logs/T16-stills.log`), `scripts/qa-sheet.sh out/edu30-T16/sheet.png --cols 7 --width 270 …`; probe with `measure-shots.ts`; P2 metric on B02-SH01 L 0 (clean frame).

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| B02-SH01 L 0 | paddock, flock and place tag readable; no stripes | row-mean luma peak-to-peak ≤ 12 (T09 metric); title box y 300–475 |
| B02-SH01 L 100 | nearest row bird big, six in a receding row | nearest bird 510 ± 30 px (≥ 480) |
| B02-SH01 L 135 | six heads down on the same frame; L 131 and 140 not all down | 6 / 6 at peck on L 135 |
| B02-SH02 L 9 / 53 | arm pointing back over the right shoulder (screen left) / eyes at the lens | FARMER 604 → 715 ± 30 px; `thumb check` and `arm check` lines for FARMER RIGHT |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
