# T13 — the Lewis gun exposes its anchors and moves: recoil, pan turn per round, traverse, the jam nudge and puff, and the cocking-handle rack
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: built, blocked on Film's anchor values (questions A1-A4 in Result); code, tests and proof frames done
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
Commit: see `git log` on branch `worktree-agent-a72562b1a2e567b2d` (T13 commit) · fix passes used: 0 · Sonnet medium, 19 Nov 2026 · store: `projects/edu/EDU/previews/` `sheet.png`, `pan-sheet.png`, `fire-1..4.png`, `jam-0/8/12/16/21.png`, `rack-0/3/6.png`, `fire-diff-1-2.png` (local `out/edu30-T13/`, logs `out/logs/T13-*.log`).

**Built** (`src/painted/edu30/props.ts`, `proof-props.tsx`, `tests/edu30-props.test.ts`; default `buildLewisGun()` unchanged, same 9 parts and anchors):
- `buildLewisGun({elev, tripod, recoil, cock})`: `recoil` = `lewisRecoil(L, rounds)` pitches/slides the gun body about the tripod head (legs and feet fixed); `cock` 0..1 draws the handle (absent = not drawn). Anchors muzzle, grip, mag, stock, port, cock.
- `lewisAnchors(at, heading, {elev, recoil, cock})` -> `muzzle, port, pan (top face centre), grip, stock, cock, dir`, same transform as `placeBuild`.
- `PAN_STEP` (7.66 deg, rad), `lewisPanTurn(L, rounds)`, `lewisRecoil`, `lewisJamNudge(L)` (+2 deg, local 4..11, ease-out), `lewisCock(L)` (0 -> 1 ease-out by 3, back ease-in by 6), `paintLewisPuff(p, c, port, 'B04-SH04' | 'B04-SH06', L)`, `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})`.
- Pan turn is shown by two pale ticks on the pan top, painted in world space after the gun (a loft/flat inside the build is hidden by the centre-depth sort for the far half). The ticket names no pan marking; this is the builder's minimal way to make the step visible (viewed: `pan-sheet.png`, 0, 84.3 and 176.2 deg).
- Proof entry: `R30-gun-fire`, `R30-gun-jam`, `R30-gun-rack` as written, plus `R30-gun-pan` (close view, extra).

**Tests** `node scripts/test.mjs tests/edu30-props.test.ts`: 8/8 pass (recoil k 0/1/>=2, pan 176.18 and 84.26 deg, feet identical at k 0 and k 2, cock 1 is 0.12 m behind cock 0 along -dir, jam nudge 86.26 deg, default look unchanged). `npx tsc` and eslint clean for the three files. `npm test`: 228 pass, 16 fail, all environment (missing `@remotion/three`, store adopt), none touch T13.

**Measured against the Proof table**
| Row | Number | Pass range | Result |
| --- | --- | --- | --- |
| fire 1 / 2 tripod feet | pixel diff in 70 x 70 boxes at the two visible feet: 0 and 0 (third foot hidden behind the stock) | 0 | pass |
| fire 1 / 2 muzzle shift | projected (432.3, 1020.0) -> (431.9, 1019.1) = 0.98 px | 1-4 px | 0.02 px under, as decided (5 mm, 0.3 deg at 2.33 m depth) |
| jam 0 / 12 / 21 pan centre | (-79, 250) | (422 +- 25, 226 +- 25) | FAIL (out of frame left) |
| jam port | (146, 533) | (633 +- 25, 624 +- 25) | FAIL |
| jam 12 puff / 21 gone / nudge | puff r 0.02 m at the port at 12, grown at 16, none at 21; ticks 84.3 -> 86.3 deg by 12 | as written | pass (viewed) |
| rack 0 handle | (663.3, 961.2) | (674 +- 25, 987 +- 25) | x pass, y 25.8 off (0.8 px outside) |
| rack 3 | handle (620.1, 942.9): moves 43.3 px | >= 20 px | pass |

**Values I could not follow (questions for Film).** The locked gun geometry (`buildLewisGun` default, user-locked LF01a/LF02) conflicts with the sheet anchors; I did not change the look.
- A1 Paddock check: with G1 at (0,0,0), barrel -z the build gives `muzzle` (0, 0.586, -0.659) and `pan` top (0, 0.650, +0.184); ticket says muzzle (0, 0.72, -1.1) and pan top (0, 0.97, 0.15) (+-0.03). The locked gun is 1.32 m long with the muzzle 0.66 m from the tripod head; the sheet muzzle (457, 951) projection in B03-SH01 assumes 1.1 m. Which wins: the locked gun (then B01/B03 muzzle and halation numbers change: muzzle (432, 1020) at the B03-SH01 camera) or a bigger/longer gun?
- A2 Dam check: G1 at (-5.6, 0.32, -5.0), barrel +x gives `pan` (-5.784, 0.970, -5.000), `port` (-5.679, 0.857, -4.950), `cock` (-5.769, 0.843, -4.910). Ticket: pan (-5.55, 0.98, -5.0), port (-5.45, 0.82, -4.95), cock (-5.75, 0.80, -4.92) +-0.05. y and z pass, `cock` passes, pan and port are 0.23 m short in x. Both fit if G1's dam position is x -5.37 (then cock would be 0.21 off); the same 0.23 m shift lifts the B04-SH04 pan to the sheet's (422, 226). Which anchor point is G1's position?
- A3 The ticket gives no local position for `port` and `cock`; the checks were my only guide. I chose port at s -0.08, 0.02 below the axis, 0.05 right of it; handle rest at s -0.17, 0.03 below, 0.09 right (rack end s -0.29, still on the 0.36 m receiver). Confirm or give numbers.
- A4 Builder choices where the ticket was silent (change on request): ease-out = 1-(1-u)^2 and ease-in = u^2; the three puff circles are spread 0 / +0.025 / -0.025 m along x as they grow (radius and alpha as written); the cocking handle is drawn only when `cock` is passed; jam elevation was left at the default 0.04.
- A5 Rack row: with the handle at (663, 961) the y is 0.8 px outside the range; widening to +-27 or answering A2/A3 settles it. Fire row: widen the muzzle shift to 0.9-4 px (or accept 0.98).

Thumb/arm checks: N/A (no hands or arms in this ticket).
