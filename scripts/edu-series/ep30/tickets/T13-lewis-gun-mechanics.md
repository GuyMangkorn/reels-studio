# T13 — the Lewis gun exposes its anchors and moves: recoil, pan turn per round, traverse, the jam nudge and puff, and the cocking-handle rack
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready (B03 pan total depends on open Q8)
Class: prop · Hard: yes (movement)
Blocked by: T03 (`proof-props.tsx` exists) · Consumers: T11, T12, T14, T17; B01-SH01, B02-SH04, B02-SH06, B03-SH05, B03-SH01, B04-SH01, B04-SH03, B04-SH04, B04-SH06, B05-SH01, B05-SH02
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); brief [VD30-11](../short/film-brief.md#vd30-11) step 3 and Stop, [VD30-07](../short/film-brief.md#scene-decisions); sheet G1 rows in b03 B03-SH01, b04 B04-SH03, B04-SH04 and B04-SH06; [props.ts](../../../../src/painted/edu30/props.ts) `buildLewisGun({elev, tripod, magTurn})`, `placeBuild`.

## Build
Make the locked Lewis gun a working prop: world anchors for hands, effects and the close-ups, the per-round recoil and pan step, a heading for the traverse, the jam action, and the cocking handle's travel. No change to the locked look.
Casting line: `new: lewis-gun` (locked) + `new: lewis-recoil`, `new: lewis-jam`, `new: lewis-cock`.
Files: `src/painted/edu30/props.ts`, `src/painted/edu30/proof-props.tsx` (adds `R30-gun-*`), `tests/edu30-props.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| `lewisAnchors(at: V3, heading, o: {elev?; recoil?; cock?})` | world points `muzzle`, `port` (ejection port, receiver right), `pan` (pan centre top), `grip` (pistol grip mid), `stock` (stock comb mid), `cock` (cocking-handle knob, receiver right), plus unit `dir` (barrel); from the same transform as `placeBuild` | ticket |
| Paddock check | G1 at (0, 0, 0), barrel −z: `muzzle` (0, 0.72, −1.1) ± 0.03, `pan` top (0, 0.97, 0.15) ± 0.03 | b01 B01-SH01, b03 B03-SH01 G1 rows |
| Dam check | G1 at (−5.6, 0.32, −5.0), barrel +x: `pan` centre (−5.55, 0.98, −5.0), `port` (−5.45, 0.82, −4.95), `cock` (−5.75, 0.80, −4.92), each ± 0.05 | b04 B04-SH04 (SD07), B04-SH06 Staging |
| Handle side | receiver right, as the port (estimate; Boat index O5 covers the ejection side; a change mirrors both) | index O5 |
| `lewisRecoil(L, rounds)` | `{back, rise}`: k 0 → 0.005 m, 0.3° (0.00524 rad); k 1 → 0.0025 m, 0.15°; k ≥ 2 → 0; the gun body (not the tripod) moves along −dir by `back` and pitches up by `rise` about the tripod head; tripod feet never move | VD30-11 step 3 |
| Pan turn | `magTurn` = 7.66° × (rounds with round frame ≤ L) (47-round pan): 0° before round 1; B03-SH01 23 rounds → 176.2° at local 68; B04-SH03 (a fresh pan, 0° at local 0) 11 rounds → 84.3° at local 40; one step per round frame | VD30-11 step 3; b03, b04 G1 rows |
| Traverse | `heading` (rad, `placeBuild` convention): B04-SH01 0.55 rad as LF02; B04-SH03 … SH06 barrel along +x | b04 Space D continuity |
| Jam nudge (B04-SH04) | `magTurn` 84.3° → 86.3° over local 4–11 (ease-out), then stops; no recoil, no flash | b04 B04-SH04 |
| Jam puff (B04-SH04) | from `port`, local 12–21: 3 circles radius 0.02 → 0.09 m, `#8f8a80`, alpha 0.7 → 0, drifting 0.05 m up and 0.04 m toward +z; a thin wisp (one circle 0.05 m, alpha 0.3 → 0, rising 0.06 m) continues over B04-SH06 local 0–12 | b04 B04-SH04, B04-SH06 G1 row |
| Cocking rack (B04-SH06) | `cock` 0..1 moves the handle 0.12 m back along −dir: keys local 0: 0, 3: 1 (ease-out), 6: 0 (ease-in); the bolt shows no flash, no casing | b04 B04-SH06 GUNNER-1 row |
| Concealment (B04-SH03) | none of the jam pieces in B04-SH03 (no nudge, no puff, no rack) | b04 Intent (jam hidden until "ติด" 1052) |
| Guns on the sheet (B02-SH04) | `tripod: false`, heading 0 (barrels along +x), lying with the receiver bottom on the canvas at y 0.1, pans on | b02 B02-SH04 Staging |
| G2 on the truck | the same build; T14 mounts it and supplies heading and elevation | VD30-07 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (gun look), `projects/edu/EDU/previews/LF02.58933d6b.png`.

**Open-question dependency (Q8).** B03's pan total is 7.66° × the round count (23 as written).

**Judgment for the builder (Hard, movement).** The recoil is a shudder of millimetres, felt more than seen; the tripod feet are the planted contact and must not move by a pixel. The pan step is the visible mechanical tick per round. The jam nudge is a small, tired stop, then stillness. The rack is one quick, clean pull and return: a practised mechanism, not a struggle.

## Proof
- `node scripts/test.mjs tests/edu30-props.test.ts`: anchor checks above; `lewisRecoil` per k; `magTurn` after 23 rounds 176.18° ± 0.1 and after 11 rounds 84.26° ± 0.1; tripod feet identical at k 0 and k 2; `cock` at 1 is 0.12 m behind `cock` at 0.
- `proof-props.tsx` (newsreel off): `R30-gun-fire` at the B03-SH01 camera (`eye (0.4, 1.0, 1.65), yaw −3, pitch 0, f 900, hy 860`) for L 1, 2, 3, 4 with `roundFrames(2, 23, 3)`; `R30-gun-jam` at the B04-SH04 camera (`eye (−5.45, 1.0, −4.45), yaw −5, pitch −32, f 1100, hy 860`) at L 0, 8, 12, 16, 21; `R30-gun-rack` at the B04-SH06 start camera at L 0, 3, 6; anchor dots in magenta.
- `scripts/qa-sheet.sh out/edu30-T13/sheet.png --cols 6 --width 270 out/edu30-T13/*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| R30-gun-fire 1 / 2 | gun back a hair and pan one step on 2; tripod feet identical | tripod foot px difference 0; muzzle px shift 1–4 px |
| R30-gun-jam 0 / 12 / 21 | pan at 84°, nudged to 86° by 12; puff at the port by 12, gone by 21 | pan centre (422 ± 25, 226 ± 25), port (633 ± 25, 624 ± 25) |
| R30-gun-rack 0 / 3 | handle forward / pulled back | handle (674 ± 25, 987 ± 25) at 0; moves ≥ 20 px at 3 |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
