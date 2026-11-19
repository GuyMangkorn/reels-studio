# T24 — plate B03-SH01, the first full-frame firing beat (VD30-11, 23 rounds from the order), is built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready (round schedule depends on open Q8)
Class: set (plate) · Hard: yes (gunner arms and jolt, flock startle and scatter)
Blocked by: T03, T04, T05, T06, T08, T09, T11, T13 · Consumers: B03-SH01 (global 688–759)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot block [b03.md](../short/scene-sheets/b03.md) B03-SH01 (authoritative; SD13); brief [VD30-11](../short/film-brief.md#vd30-11) (per-round grammar, value, fallback order).

## Build
Replace the stub shot file with the plate: over the seated gunner's shoulder, 23 rounds every 3 frames from local 2 to 68, every VD30-11 effect, the flock startling, bunching and bolting.
Files: `src/painted/edu30/shots/B03-SH01.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Set | space P, light m 0, eaten 0.4, newsreel warm strength 1 with `pop` = T04 `popFor`; near stalks ahead of the muzzle with T09 `lean` = T04 `blastLean` | T04, T09 |
| Camera | fixed eye (0.4, 1.0, 1.65), yaw −3, pitch 0, f 900, hy 860; `overscan: true` (T03); `shake` = T04 `shakeAt` with the B03 spec | b03 B03-SH01 Camera |
| Rounds | `roundFrames(2, 23, 3)` → local 2 … 68 (global 690 … 756) | index VD30-11, SD13 |
| GUNNER-1 | T11 back view at (0, 0, 0.85), fists on `grip`/`stock`, jolt j from `roundPhase` | b03 B03-SH01 |
| G1 | (0, 0, 0) barrel −z; T13 `lewisRecoil` per round; `magTurn` 7.66° × rounds fired (176.2° at L 68) | b03 G1 row |
| Flash, halation | T04 `paintMuzzleFlash` at `lewisAnchors(...).muzzle`, halo 180 px | b03 Projection |
| Smoke, blast | T04 `paintSmoke` (B03 drift, fadeAfter 45), `paintBlast` ground `'wheat'` | VD30-11 steps 2, 6 |
| Casings | T05 `paintCasings` with the B03 landing box, ground y 0, side +1 | T05 |
| Strikes | T05 `paintSpurts` dust at the B03 points, h 0.6–1.2 m | T05 |
| Flock | T08 `scatter(L)` (startle from L 4, bunch L 10–38, bolt from L 40) + `paintFarFlock` z −80..−200 | b03 Flock F1 row; T08 |
| Bolt | from L 70 the bolt is open: no flash, the smoke hangs, shake 0 | b03 B03-SH01 Sound (bolt catch at L 70) |
| Off frame | MEREDITH (arm down after the order) and GUNNER-2 (spare pan) are off frame; do not paint them | b03 Props and hands |
| Fallback order (only if a T04/T05 effect is late) | keep flash + halation, shake, casings, recoil; drop the strike spurts first, then the blast dust; never add hits | VD30-11 Fallback |
| Probe leads | GUNNER-1 (partial: visible span y ~600 to the frame bottom), muzzle point | T03 probe |

**Open-question dependency (Q8).** With the alternative (rounds from L06's "ยิง" only), the shot starts at 704 and the round list, pan total, casing count and scatter frames all re-key from the new round 1; Film bumps this ticket.

**Judgment for the builder (Hard).** Played straight and loud: an impressive gun and a calm crew. The flash core is the lightest value in its frame, wrapped by darker smoke; spurts walk toward the birds and never reach one; the birds startle, bunch and bolt, none is hit or falls. The gunner's fists never leave the gun.

## Proof
- Stills (`out/edu30-T24/`): L 0, 2, 3, 4, 20, 40, 56, 68, 71; `scripts/qa-sheet.sh out/edu30-T24/sheet.png --cols 5 --width 270 out/edu30-T24/s*.png`; `measure-shots.ts B03-SH01 2,68`; overlay diff: render L 2 and L 3 with `tag: true` and check the tag and guides do not move.
- Clean L 2 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 2 / 3 | white core + halation + pop / half-size warm decay; muzzle above y 1100 | core luma ≥ 250 and the frame max; muzzle (457, 951) ± 30 |
| L 4 | birds' heads up | ≥ 80 % of F1 in the startle pose (logged) |
| L 56 | clumps bolting, spurts short of the birds, casings on the dirt right of G1 | no strike within 4 m of a bird (logged); casings x 0.8..1.5 |
| L 71 | bolt open, smoke hanging, no shake | shake (dx, dy, rot) = 0 |
| L 2 vs L 3 overlay | tag and guides fixed while the canvas shakes | overlay pixel diff 0 outside the canvas |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
