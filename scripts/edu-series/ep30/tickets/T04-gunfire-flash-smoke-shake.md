# T04 — kit gunfire effects: round schedule, muzzle flash with halation, smoke haze, muzzle blast and canvas shake
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: capability · Hard: no
Blocked by: T03 (both write `docs/context-map.md`) · Consumers: B03-SH01, B04-SH03, B05-SH02 (two single shots)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), brief [VD30-11](../short/film-brief.md#vd30-11) steps 1, 2, 5, 6 and Value, sheet [b03 B03-SH01](../short/scene-sheets/b03.md) and [b04 B04-SH03](../short/scene-sheets/b04.md) Staging and Camera rows. Kit bases: [glow.tsx](../../../../src/painted/kit/glow.tsx) (`GLOW_PEAK` rule only), [fog.ts](../../../../src/painted/kit/fog.ts) `fogPuffs`, [anchors.ts](../../../../src/painted/kit/anchors.ts) `paintPlume`.

## Build
A new reusable kit module of story-clock gunfire effects drawn on the plate canvas through the shot's `YCam`, all seeded, all plain fills and strokes (no brush fills, [DF-20261031-paint-seed-defer](../../../../docs/dev-findings.md#df-20261031-paint-seed-defer)).
Files: `src/painted/kit/gunfire.ts` (new), `tests/gunfire.test.ts` (new), `docs/context-map.md` (kit entry for `gunfire.ts`), `src/painted/edu30/shots-index.tsx` (adds the `EDU30-FX` proof composition)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| `roundFrames(first, count, every)` | returns `[first, first+every, …]`; plates call (35, 11, 3) for B03-SH01 → 35 … 65, (9, 11, 3) for B04-SH03 → 9 … 39 | index VD30-11 round frames |
| `roundPhase(L, rounds)` | `{n: index of the latest round ≤ L, k: L − that round}`; k 0 = flash frame, 1 = decay, ≥ 2 = off | VD30-11 step 1 |
| `paintMuzzleFlash(p, c, muzzle: V3, dir: V3, L, rounds, seed)` | on k = 0: pure white `#ffffff` core, diameter 0.30 m (seeded 0.25–0.35), shape cycles by a seeded pick among three: 4-point star (points along dir, up, −dir, −up; inner radius 0.25 × outer), forward cone (apex at the muzzle, length 0.45 m along dir, half-angle 22°), round bloom (circle); on k = 1: one shape at half size, colour `#ffd27a`; k ≥ 2: nothing | VD30-11 step 1 |
| Halation (same call) | on the plate canvas, centred on the projected muzzle: 6 concentric filled circles, radius R × (1, 0.83, 0.67, 0.5, 0.33, 0.17), each alpha 0.05 in `#fff2cc` (summed peak 0.30 = `GLOW_PEAK` rule); R = `halo` argument (B03 180 px, B04 260 px) on k = 0, R/2 with each alpha 0.025 on k = 1 | VD30-11 step 1; drawn on the canvas (not the `Spot` overlay) so it shakes with the picture |
| Pop | the module exports `popFor(L, rounds)`: 0.08 on k = 0, 0.03 on k = 1, else 0; the plate passes it to the newsreel `pop` input (T01) | VD30-11 step 1 |
| `paintSmoke(p, c, muzzle, L, rounds, o: {drift: V3; seed; fadeAfter: 45})` | one puff born per round at the muzzle; puff radius 0.12 m → 0.45 m linear over 30 f after birth; colour `#6b5f50` (darker than the wheat under the tint), alpha 0.55 at birth → 0.30 at 30 f; centre moves by `drift` m/s; after the last round all alphas × (1 − (L − last)/45), 0 at 45 f; each puff = 5 overlapping circles seeded ± 0.3 radius | VD30-11 step 2 |
| Drift per shot (world m/s) | B03-SH01: (−0.25, 0.06, 0) (screen left for yaw −3°); B04-SH03: 0.25 m/s along the camera's screen-left vector (−right of yaw 112°: (0.37, 0, −0.93) × 0.25) plus 0.06 up | sheet "drifting screen left"; ticket |
| `paintBlast(p, c, muzzle, dir, L, rounds, o: {ground: 'wheat' \| 'mud'; seed})` | from round 1: a ground cloud centred 2.0 m ahead of the muzzle along `dir` on the ground; one puff added per round, each radius 0.3 m → 1.2 m over 40 f, colour `#a08a66`, alpha 0.35; `'mud'` uses colour `#7d6a52` and alpha 0.25 | VD30-11 step 6 |
| Stalk flatten | exported as `blastLean(L, rounds, distM)`: lean away from the muzzle in rad, 0.44 (25°) on k = 0, 0.17 (10°) on k ≥ 1 while the burst runs, for stalks 1–3 m ahead; 0 before round 1; eases back to 0 over 15 f after the last round. The paddock stalk painter consumes it (T09 `lean` option) | VD30-11 step 6 |
| `shakeAt(L, rounds, s: {x; y; roll; tremor; stop?; seed})` | per round an impulse in a seeded direction: amplitude factor 1.0 on k = 0, 0.5 on k = 1, 0.2 on k = 2, 0 after; offsets `dx = ±s.x`, `dy = ±s.y`, `rot = ±s.roll` deg (seeded sign per round); plus a uniform seeded tremor ± `s.tremor` px each frame from the first to the last round; for L ≥ `stop` everything is exactly 0 | VD30-11 step 5 |
| Shake specs | B03-SH01: x 5, y 7, roll 0.3, tremor 2, no stop (decays after round 11); B04-SH03: x 7, y 9, roll 0.4, tremor 2, stop 42 | sheets Camera rows |
| Single shots (B05-SH02) | the same flash call with rounds [72, 79], halo 160 px, no smoke haze build-up beyond the two puffs, no shake | b05 B05-SH02 Staging |

References: `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (value of the wheat and sky under the full tint: the flash core must be the lightest value in its frame).

## Proof
- `npx tsc --noEmit -p . > out/logs/T04-tsc.log 2>&1` · `node scripts/test.mjs tests/gunfire.test.ts`: `roundFrames(35, 11, 3)` ends at 65; `shakeAt` is 0 for every L ≥ stop and deterministic for a seed; `popFor` values; `roundPhase` at L 36 = {n 0, k 1}.
- Visual: add the composition `EDU30-FX` (60 f) to `src/painted/edu30/shots-index.tsx`: the `EDU30-CAL` set and camera, a G1 at (1.2, 0, 0) firing rounds (0, 11, 3), frames 0, 1, 2, 12 and 31, newsreel strength 1 warm.
- `printf 'EDU30-FX 0 out/edu30-T04/fx0.png\nEDU30-FX 1 out/edu30-T04/fx1.png\nEDU30-FX 2 out/edu30-T04/fx2.png\nEDU30-FX 12 out/edu30-T04/fx12.png\nEDU30-FX 31 out/edu30-T04/fx31.png\n' | node scripts/stills.mjs src/painted/edu30/shots-index.tsx > out/logs/T04-stills.log 2>&1` then `scripts/qa-sheet.sh out/edu30-T04/sheet.png --cols 5 --width 270 out/edu30-T04/fx*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| fx0 | white core + halation, the brightest pixel in the frame is in the core | core pixel luma ≥ 250 and frame max inside the core's bbox |
| fx1 | half-size warm decay | core area 20–35 % of fx0's core area |
| fx2 | no flash; smoke puff darker than the ground behind it | smoke mean luma < ground mean luma (sample boxes logged) |
| fx12 / fx31 | haze built / thinned; blast cloud on the ground ahead | haze alpha at fx31 < 0.5 × fx12 (sampled) |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
