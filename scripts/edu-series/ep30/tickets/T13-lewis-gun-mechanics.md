# T13 — the Lewis gun exposes its anchors and moves: recoil, pan turn per round, traverse, the jam nudge and puff
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: prop · Hard: yes (movement)
Blocked by: none · Consumers: T11, T12, T14; B01-SH01, B02-SH04, B02-SH05, B03-SH01, B03-SH04, B04-SH01, B04-SH03, B04-SH04, B05-SH01, B05-SH02
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), brief [VD30-11](../short/film-brief.md#vd30-11) step 3 and Stop, [VD30-07](../short/film-brief.md#scene-decisions); sheet blocks [b03 B03-SH01](../short/scene-sheets/b03.md) (G1 row), [b04 B04-SH03 and B04-SH04](../short/scene-sheets/b04.md); [props.ts](../../../../src/painted/edu30/props.ts) `buildLewisGun({elev, tripod, magTurn})`, `placeBuild`.

## Build
Make the locked Lewis gun a working prop: world anchors for hands, effects and the jam close-up, the per-round recoil and pan step, a heading for the traverse, and the jam action. No change to its locked look.
Casting line: `new: lewis-gun` (locked) + `new: lewis-recoil`, `new: lewis-jam`.
Files: `src/painted/edu30/props.ts`, `src/painted/edu30/proof-props.tsx` (new standalone still entry, compositions `R30-<name>`), `tests/edu30-props.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| `lewisAnchors(at: V3, heading: number, o: {elev?; recoil?})` | world points `muzzle`, `port` (ejection port, receiver right side), `pan` (pan centre top), `grip` (pistol grip mid), `stock` (stock comb mid), plus unit `dir` (barrel direction); computed from the same build transform `placeBuild` uses | ticket |
| Paddock check | G1 at (0, 0, 0), barrel −z: `muzzle` = (0, 0.72, −1.1) ± 0.03, `pan` top = (0, 0.97, 0.15) ± 0.03 | b01 B01-SH01 G1 row, b03 SD05 |
| Dam check | G1 at (−5.6, 0.32, −5.0): with barrel +x, `pan` centre ≈ (−5.55, 0.98, −5.0) and `port` ≈ (−5.45, 0.82, −4.95) ± 0.05 | b04 B04-SH04 Staging (SD07) |
| `lewisRecoil(L, rounds)` | `{back, rise}`: k 0 → back 0.005 m, rise 0.3° (0.00524 rad); k 1 → 0.0025 m, 0.15°; k ≥ 2 → 0; the gun body (not the tripod) moves along −dir by `back` and pitches up by `rise` about the tripod head; tripod feet never move | VD30-11 step 3 |
| Pan turn | `magTurn` = 7.66° × (number of rounds with round frame ≤ L) (47-round pan): 0° before round 1, 84.3° after 11 rounds; pan turns in one frame on each round frame | VD30-11 step 3; b03, b04 G1 rows |
| Traverse | `heading` argument (rad, the `placeBuild` heading convention); B04-SH01 uses the LF02 value (0.55 rad yaw as `LOOK_DEFS.LF02` builds it); B04-SH03/SH04 barrel along +x | b04 Space D continuity |
| Jam nudge (B04-SH04) | `magTurn` from 84.3° (after 11 rounds) to 86.3° over L 4–11 (ease-out), then stops; no recoil, no flash | b04 B04-SH04 Staging |
| Jam puff (B04-SH04) | from `port`, L 12–21: kit `fogPuffs`-style puff, 3 circles radius 0.02 → 0.09 m, colour `#8f8a80` alpha 0.7 → 0, drifting 0.05 m up and 0.04 m along +z (toward the lens side) over the 10 frames | b04 B04-SH04 ("puff of grey smoke from the action") |
| Concealment (B04-SH03) | none of the jam pieces are drawn in B04-SH03 (no click puff, no nudge) | b04 Intent (jam concealed until 1096) |
| G2 on the truck | the same build; T14 mounts it on the pedestal and supplies its own heading and elevation | VD30-07 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (gun look), `projects/edu/EDU/previews/LF02.58933d6b.png`.

**Judgment for the builder (Hard, movement).** The recoil is a shudder of millimetres, felt rather than seen; the tripod feet are the planted contact and must not move by a pixel at any frame. The pan step is the visible mechanical tick per round. The jam nudge is a small, tired stop, then stillness.

## Proof
- `node scripts/test.mjs tests/edu30-props.test.ts`: anchor checks above; `lewisRecoil` values per k; `magTurn` after 11 rounds = 84.26° ± 0.1; tripod foot points identical at k 0 and k 2.
- `proof-props.tsx` (newsreel off): `R30-g1` at the B03-SH01 camera (`eye (0.4, 1.0, 1.65), yaw −3, pitch 0, f 900, hy 860`) for L 34, 35, 36, 37 with rounds (35, 11, 3); `R30-jam` at the B04-SH04 camera (`eye (−5.45, 1.0, −4.45), yaw −5, pitch −32, f 1100, hy 860`) at L 0, 8, 12, 16, 21; anchor dots drawn in magenta.
- `scripts/qa-sheet.sh out/edu30-T13/sheet.png --cols 5 --width 270 …`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| R30-g1 34 / 35 | gun shifted back a hair, pan one step on 35; tripod feet identical | tripod foot px difference 0; muzzle px shift 1–4 px |
| R30-jam 0 / 12 / 21 | pan at 84°, nudged to 86° by 12; puff at the port by 12, gone by 21 | pan centre (422 ± 25, 226 ± 25), port (633 ± 25, 624 ± 25) (SD07 projection) |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
