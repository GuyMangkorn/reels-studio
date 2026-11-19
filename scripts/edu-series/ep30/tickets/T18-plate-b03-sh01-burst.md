# T18 — plate B03-SH01, the first full-frame firing beat (VD30-11), is built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plate) · Hard: yes (gunner arms and jolt, flock scatter)
Blocked by: T03, T04, T05, T08, T09, T11, T13 · Consumers: B03-SH01 (global 660–726)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), shot block [b03.md B03-SH01](../short/scene-sheets/b03.md) (every row of its Staging table and its Acceptance), brief [VD30-11](../short/film-brief.md#vd30-11).

## Build
Replace the stub with the burst plate: over GUNNER-1's shoulder at G1, 11 rounds on the story clock, all VD30-11 pieces, the flock scattering, shake on the canvas only.
Files: `src/painted/edu30/shots/B03-SH01.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Set | space P morning, `eaten: 0.4`; newsreel warm, strength 1, `pop = popFor(L, rounds)` (T04) | T09 schedule, VD30-11 step 1 |
| Rounds | `roundFrames(35, 11, 3)` → L 35, 38 … 65 (global 695 … 725) | index VD30-11 round frames |
| Shot flags | `overscan: true`; `shake = shakeAt(L, rounds, {x 5, y 7, roll 0.3, tremor 2, seed 41301})` | T03, T04 |
| Camera | `eye (0.4, 1.0, 1.8) → (0.4, 1.0, 1.65)` ease-in-out L 0–34, then still; yaw −3°, pitch 0, f 900, hy 860 (the adapter applies the overscan compensation) | b03 B03-SH01 Camera |
| GUNNER-1 | T11 back view at (0, 0, 0.85), fists on `lewisAnchors(...).grip/stock`, shoulders set: `rise` 0 → −0.01 m L 27–31 (settling into the gun); jolt j per round (T11); face not visible | b03 G1 / GUNNER-1 rows |
| G1 | (0, 0, 0), barrel −z, `lewisRecoil(L, rounds)`, `magTurn` per round (84.3° after round 11) | b03 G1 row, T13 |
| Flash | `paintMuzzleFlash` at the muzzle anchor, halo 180, seed 41302 | VD30-11 step 1 |
| Smoke | `paintSmoke` drift (−0.25, 0.06, 0), seed 41303 | T04 |
| Blast | `paintBlast(…, {ground: 'wheat'})` + near stalks with T09 `lean` from `blastLean` for stalks 1–3 m ahead of the muzzle | VD30-11 step 6 |
| Casings | `paintCasings` port anchor, side +1 (receiver's right = screen right from behind), ground y 0, seed 41304 | VD30-11 step 4; index O5 |
| Spurts | `paintSpurts(kind 'dust', h [0.6, 1.2], seed 41305)`, points i 0…10: (x_i, 0, −14 − 1.2 i) with x_i seeded in [−3, 3] (walk toward the birds, last at z −26, the flock at −45) | b03 Strike spurts row |
| Flock | T08 `scatter(L)` (40 birds, heads up L 37, startle per bird delay 0–6 f, run from L 41 + d in four clumps); far mass `far: {n: 300, x: [−60, 60], z: [−80, −200]}` (does not move) | b03 Flock F1 row |
| Others | MEREDITH and GUNNER-2 are outside the lens (not painted); gear as LF01 where in view | b03 Props and hands |
| Fallback order (if a piece fails its proof or the frame is too slow) | keep flash + halation, shake, casings, recoil; drop the spurts first, then the blast dust; never replace with hits; record any drop in Result | VD30-11 Fallback |
| Cost | record the render time of L 50 at half size in Result (60-bird frame budget) | brief Loading |
| Probe leads | GUNNER-1 visible span (y top of hat to frame bottom), muzzle point | T03 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (value and gun look).

**Judgment for the builder (Hard).** Loud and competent: the gunner's fists never leave the gun and only his upper body jolts. The birds startle and run; no bird is hit, falls or tumbles. On the round frame the flash core is the lightest value in the frame.

## Proof
- Stills (clean and tagged) at L 0, 30, 34, 35, 36, 37, 41, 47, 56, 65, 66 via `stills.mjs` (log `out/logs/T18-stills.log`); `qa-sheet.sh out/edu30-T18/sheet.png --cols 6 --width 270 …`; `measure-shots.ts B03-SH01 0,35,65`.
- Overlay check: render L 35 tagged; the tag box and the guide lines must sit at identical pixels to L 34 (shake affects the plate canvas only).

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 35 / 36 | white core + halation + pop; half-size warm decay on 36; muzzle above y 1100 | core luma ≥ 250 and the frame max; muzzle (464 → 457 ± 15, 946 → 951 ± 15) |
| L 35 … 65 | 11 flashes on the listed frames only | flash present on exactly 11 of the 31 frames (scan) |
| L 41 / 56 | heads up, then clumps bolting; nobody falls | ≥ 3 clumps at L 56 |
| L 66 | 11 casings right of G1, haze, bolt open (gun still) | casings rest 0.8–1.5 m right (T05 log) |
| L 34 vs 35 | tag and guides unmoved | pixel difference of the tag box = 0 |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
