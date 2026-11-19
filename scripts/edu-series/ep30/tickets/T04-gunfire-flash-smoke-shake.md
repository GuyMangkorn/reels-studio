# T04 — kit gunfire effects: round schedule, muzzle flash with halation, smoke haze, muzzle blast and canvas shake
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready (B03 round list depends on open Q8)
Class: capability · Hard: no
Blocked by: T03 (`proof-fx.tsx` exists) · Consumers: B03-SH01, B04-SH03, B05-SH02 (two single shots); T05
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); brief [VD30-11](../short/film-brief.md#vd30-11) steps 1, 2, 5, 6 and Value; index [VD30-11 round frames](../short/scene-sheets/index.md#voice-anchors-measured-voice-r22); sheet blocks b03 B03-SH01 and b04 B04-SH03 (Staging, Camera). Kit bases: [glow.tsx](../../../../src/painted/kit/glow.tsx) (`GLOW_PEAK` rule only), [fog.ts](../../../../src/painted/kit/fog.ts) `fogPuffs`, [anchors.ts](../../../../src/painted/kit/anchors.ts) `paintPlume`.

## Build
A new reusable kit module of story-clock gunfire effects drawn on the plate canvas through the shot's `YCam`, seeded, plain fills and strokes only (no brush fills, [DF-20261031-paint-seed-defer](../../../../docs/dev-findings.md#df-20261031-paint-seed-defer)), deterministic per frame (no state carried between frames).
Files: `src/painted/kit/gunfire.ts` (new), `tests/gunfire.test.ts` (new), `src/painted/edu30/proof-fx.tsx` (adds `FX30-fire`)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| `roundFrames(first, count, every)` | `[first, first+every, …]`; plates call **(2, 23, 3)** for B03-SH01 → local 2 … 68 (global 690 … 756) and **(10, 11, 3)** for B04-SH03 → local 10 … 40 (global 1003 … 1033) | index VD30-11 round frames, SD13 |
| `roundPhase(L, rounds)` | `{n: index of the latest round ≤ L, k: L − that round}`; k 0 flash, 1 decay, ≥ 2 off; `n = −1` before round 1 | VD30-11 step 1 |
| `paintMuzzleFlash(p, c, muzzle: V3, dir: V3, L, rounds, o: {halo; seed})` | k 0: pure white `#ffffff` core, diameter seeded 0.25–0.35 m, shape a seeded pick per round among 4-point star (points along dir, up, −dir, −up; inner radius 0.25 × outer), forward cone (apex at the muzzle, 0.45 m along dir, half-angle 22°), round bloom; k 1: one shape at half size, `#ffd27a`; k ≥ 2 nothing | VD30-11 step 1 |
| Halation (same call) | on the plate canvas at the projected muzzle: 6 concentric filled circles, radius R × (1, 0.83, 0.67, 0.5, 0.33, 0.17), alpha 0.05 each in `#fff2cc` (summed 0.30 = `GLOW_PEAK`); R = `o.halo` (B03 180 px, B04 260 px, B05-SH02 160 px) on k 0, R/2 with alpha 0.025 on k 1. Drawn on the canvas so it shakes with the picture | VD30-11 step 1; sheets Projection |
| Water mirror of the flash (B04-SH03) | the plate calls `paintMuzzleFlash` a second time with `muzzle` and `dir` through T10 `reflect`, `halo` × 0.6, clipped to the water area; T04 only needs `o.clip?: (x, y) => boolean` | b04 B04-SH03 ("mirrors every flash") |
| `popFor(L, rounds)` | 0.08 on k 0, 0.03 on k 1, else 0; the plate passes it to the newsreel `pop` (T01) | VD30-11 step 1 |
| `paintSmoke(p, c, muzzle, L, rounds, o: {drift: V3; seed; fadeAfter})` | one puff born per round at the muzzle; radius 0.12 → 0.45 m linear over 30 f; colour `#6b5f50` (darker than the wheat under the tint), alpha 0.55 at birth → 0.30 at 30 f; centre moves by `drift` m/s; after the last round all alphas × (1 − (L − last)/fadeAfter), 0 at fadeAfter; each puff = 5 overlapping circles seeded ± 0.3 radius | VD30-11 step 2 |
| Drift and fade per shot | B03-SH01: drift (−0.25, 0.06, 0) m/s (screen left at yaw −3°), fadeAfter 45; B04-SH03: drift = 0.25 × (0.37, 0, −0.93) + (0, 0.06, 0) (screen left at yaw 112°), fadeAfter 45 (still drifting past E 42 to the cut, sheet) | b03, b04 Smoke rows |
| `paintBlast(p, c, muzzle, dir, L, rounds, o: {ground: 'wheat' \| 'mud'; seed})` | from round 1 a ground cloud centred 2.0 m ahead of the muzzle along `dir` on the ground; one puff added per round, radius 0.3 → 1.2 m over 40 f, `#a08a66` alpha 0.35 (`'mud'`: `#7d6a52`, 0.25) | VD30-11 step 6 |
| `blastLean(L, rounds, distM)` | lean away from the muzzle (rad) for stalks 1–3 m ahead: 0.44 (25°) on k 0, 0.17 (10°) on k ≥ 1 while the burst runs, 0 before round 1, easing back to 0 over 15 f after the last round; T09's `lean` option consumes it | VD30-11 step 6 |
| `shakeAt(L, rounds, s: {x; y; roll; tremor; stop?; seed})` | per round an impulse in a seeded direction: factor 1.0 on k 0, 0.5 on k 1, 0.2 on k 2, 0 after; `dx = ±s.x`, `dy = ±s.y`, `rot = ±s.roll` deg (seeded sign per round); plus a seeded tremor ± `s.tremor` px each frame from the first to the last round; for L ≥ `stop` exactly 0 | VD30-11 step 5 |
| Shake specs | B03-SH01: x 5, y 7, roll 0.3, tremor 2, no stop (decays to 0 by local 70); B04-SH03: x 7, y 9, roll 0.4, tremor 2, **stop 42** (E, hard stop) | sheets Camera rows |
| Single shots (B05-SH02) | rounds [72, 79] (local), halo 160 px, one smoke puff each, no haze build-up, no shake, no blast | b05 B05-SH02 Staging |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (wheat and sky values under the full tint: the flash core is the lightest value in its frame).

**Open-question dependency (Q8, index O9).** If the user picks "rounds from L06's ยิง only", B03-SH01 calls `roundFrames` with a new first frame and count; the module itself is unchanged. Only the B03 numbers in this table change.

## Proof
- `npx tsc --noEmit -p . > out/logs/T04-tsc.log 2>&1` · `node scripts/test.mjs tests/gunfire.test.ts`: `roundFrames(2, 23, 3)` ends at 68 and `(10, 11, 3)` at 40; `shakeAt` is 0 for every L ≥ stop and deterministic for a seed; `popFor` values; `roundPhase(3, roundFrames(2, 23, 3))` = {n 0, k 1}.
- `FX30-fire` in `proof-fx.tsx` (80 f): the `EDU30-CAL` set and camera, a G1 at (1.2, 0, 0) barrel −x firing `roundFrames(2, 23, 3)`, newsreel strength 1 warm with `pop`.
- `printf 'FX30-fire 2 out/edu30-T04/fx02.png\nFX30-fire 3 out/edu30-T04/fx03.png\nFX30-fire 4 out/edu30-T04/fx04.png\nFX30-fire 30 out/edu30-T04/fx30.png\nFX30-fire 75 out/edu30-T04/fx75.png\n' | node scripts/stills.mjs src/painted/edu30/proof-fx.tsx --gl=angle > out/logs/T04-stills.log 2>&1`; `scripts/qa-sheet.sh out/edu30-T04/sheet.png --cols 5 --width 270 out/edu30-T04/fx*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| fx02 | white core + halation; the brightest pixel in the frame is in the core | core luma ≥ 250 and frame max inside the core bbox |
| fx03 | half-size warm decay | core area 20–35 % of fx02's |
| fx04 | no flash; smoke darker than the ground behind it | smoke mean luma < ground mean luma (sample boxes logged) |
| fx30 / fx75 | haze built / thinning (fx75 is 7 f after the last round); blast cloud on the ground ahead | haze alpha at fx75 ≤ 0.9 × the same puffs' alpha without the fade (fade factor 1 − 7/45 = 0.84, logged) |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
