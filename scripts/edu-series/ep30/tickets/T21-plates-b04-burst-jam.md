# T21 — plates B04-SH03 (second firing beat, stop dead at E) and B04-SH04 (the jam close-up) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plates) · Hard: yes (queue flinch and hops, gunner mitten, jam action)
Blocked by: T03, T04, T05, T08, T10, T11, T13 · Consumers: B04-SH03, B04-SH04 (global 1037–1107)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), shot blocks [b04.md](../short/scene-sheets/b04.md) B04-SH03, B04-SH04 (and SD06–SD08), brief [VD30-11](../short/film-brief.md#vd30-11) (Stop, Continuity).

## Build
Replace the two stub shot files: the burst seen from the water side with its reflection and a hard stop, then the hero-object jam.
Files: `src/painted/edu30/shots/B04-SH03.tsx`, `src/painted/edu30/shots/B04-SH04.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space D, morning; newsreel warm, strength 1 | look lock |
| B04-SH03 rounds | `roundFrames(9, 11, 3)` → L 9 … 39 (global 1046 … 1076); **E = L 42** | index VD30-11 |
| B04-SH03 flags | `overscan: true`; `shake = shakeAt(L, rounds, {x 7, y 9, roll 0.4, tremor 2, stop 42, seed 41401})`; `pop = popFor(L, rounds)` | T03, T04 |
| B04-SH03 camera | fixed `eye (−6.30, 0.92, −5.75), yaw 112°, pitch 0, f 800, hy 820` | b04 B04-SH03 Camera |
| G1 | (−5.6, 0.32, −5.0), barrel +x (T10 `G1_AIM.sh03`), `lewisRecoil`, `magTurn` per round (84.3° after 11) | b04 G1 row |
| GUNNER-1 | only the right forearm and mitten enter from the right edge onto the grip (T11 B04-SH03 line), jolt per round, still from L 42; the rest of his body is outside the frame (he sits at (−6.2, 0.36, −4.75) as LF02) | b04 GUNNER-1 row |
| Flash, smoke | `paintMuzzleFlash` halo 260, seed 41402; plus its mirror: the same core drawn at `reflect(muzzle)` with alpha 0.6 toned toward `DAM.reflection`; `paintSmoke` drift 0.25 m/s along screen-left (T04 B04 value), seed 41403; smoke keeps drifting after E | VD30-11 Value, b04 Smoke row |
| Casings | `paintCasings` side +1 = the receiver's right = world +z (onto the slope, away from the water and the lens), ground = `southBankY`, seed 41404: all 11 land on the slope (Film fix: the sheet's "toward the lens side … plop into the shallows" contradicts the +z ejection; with the lens over the water at −z no casing reaches the water. Ton: drop the plops from SFX-B04-SH03-2) | b04 Casings row; index O5 |
| Strikes | `paintSpurts` round i at x_i = −2.5 + 0.45 i: even i `'mud'` on the rim (x_i, 0.33, −4.85), odd i `'spout'` in the shallows (x_i, 0.30, −5.40), h [0.4, 0.9], seed 41405; all short of the nearest bird (x ≥ 3.0); each spout also mirrored; spurts already in the air at L 42 finish their fall | b04 Strikes row |
| Queue | T08 `queue` with the B04-SH03 schedule (x 3.6 → 3.0 by L 46, 0.39 m/s); nearest 6 birds T06 duck-flap from L 11; birds index 2 and 4 hop toward −z into the shallows from L 18 (`emuHop`, dist 0.6), splash (T05 `paintSplash`) at L 24 at their landing points, walk back to the rim by L 40; line re-formed by L 40; nobody hit | b04 Queue row |
| Stop at E | from L 42: no flash, shake exactly 0, no recoil, no new casing or strike; L 43–46 smoke drifts and the queue walks; nothing from the jam (no click puff, no pan nudge, no gunner reaction) appears in this shot | b04 B04-SH03 Stop |
| B04-SH04 camera | fixed `eye (−5.45, 1.0, −4.45), yaw −5°, pitch −32°, f 1100, hy 860` | b04 B04-SH04 (SD07) |
| B04-SH04 action | G1 still with `magTurn` 84.3°; T13 jam nudge (to 86.3° over L 4–11) and jam puff (L 12–21); smoke wisps from the burst: `paintSmoke` with the B04-SH03 rounds shifted by −47, thin, L 0–11; casing on the keyed path (T05 `casingKeyed`): L 13 at the port (−5.45, 0.82, −4.95) → L 17 on the stone top (−5.4, 0.38, −4.9) → L 18.5 up 0.04 m → L 20 down → L 21 up 0.015 m → L 22 down → rest L 23, angle turning 1.5 turns over L 13–17; T10 `paintStone` | b04 B04-SH04 Staging |
| B04-SH04 no hands or faces | nothing of the crew in frame | b04 B04-SH04 |
| Probe points | B04-SH03: muzzle, pan, receiver; B04-SH04: pan centre, port, stone | T03 |

References (store): `projects/edu/EDU/previews/LF02.58933d6b.png` (water, bank and gun look).

**Judgment for the builder (Hard).** The flinch is short and the line keeps coming (the queue is intact for B04-SH05). The two hops are sideways jumps with both feet leaving and landing together. The stop at E is a vacuum: L 41 has the last decay, L 42 is dead still. In B04-SH04 the jam is told only by the pan's small nudge, the puff and the single casing.

## Proof
- Stills: B04-SH03 L 0, 9, 10, 11, 18, 21, 24, 39, 40, 41, 42, 43, 46; B04-SH04 L 0, 8, 12, 17, 20, 23 via `stills.mjs` (log `out/logs/T21-stills.log`); `qa-sheet.sh --cols 7 --width 270`; `measure-shots.ts`; overlay check as T18 at L 9 vs 8.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| B04-SH03 L 9 / 10 | flash core + halation + pop and its mirror in the water; decay on 10 | core luma ≥ 250; muzzle (541 ± 20, 860 ± 20); everything above y 1100 |
| B04-SH03 L 9 … 39 | 11 flashes on the listed frames only | 11 of 31 frames |
| B04-SH03 L 42 / 43 | no flash, no shake; smoke and queue still moving | shake (dx, dy, rot) = 0 exactly; frame-difference > 0 in the smoke area |
| B04-SH03 L 24 | two birds landed in the shallows with splashes | 2 splashes; no bird lying down |
| B04-SH04 L 12 / 17 / 23 | puff at the port / casing hits the stone / casing at rest | pan centre (422 ± 25, 226 ± 25), port (633 ± 25, 624 ± 25), stone (674 ± 25, 1361 ± 25) |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
