# T24 — plate B03-SH01, the first full-frame firing beat (VD30-11, 23 rounds from the order), is built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: ready (Q8 answered: burst from the order as written; r2 adds T34 to Blocked by: the registered plate needs the overscan and shake canvas hook) · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4)
Class: set (plate) · Hard: yes (gunner arms and jolt, flock startle and scatter)
Blocked by: T03, T04 (r4), T05, T06 (r4), T08, T09 (r4, done), T11, T13, T34, T36 · Consumers: B03-SH01 (global 688–759)
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

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).
- **Muzzle and lean (r3).** B03-SH01 muzzle = `lewisAnchors([0, 0, 0], −π/2).muzzle` = (0, 0.586, −0.659), projecting to **(432, 1020)** on the B03-SH01 camera (was (457, 951)); T09 `leanFrom` is that muzzle. The halation (180 px) reaches into the caption band; accepted (picture glow, the caption sits on top).
- **Gunfire (T04 r3).** Smoke and blast use the r3 haze caps; the frame-max rule accepts a clipped-sky tie.

## r4 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R4`)
These override any older value in this ticket that they name.
- **Smoke (T04 r4).** Per-circle α_c; smoke cover ≤ 0.45 and blast ≤ 0.40 in the densest 16 × 16 box at L 30 and L 71 (Proof row added).
- **T34 carry-over.** This is the first plate that sets `shake` and paints leads: the registered plate vs the QA stack at L 2 (a k 0 frame) MAD ≤ 2 with the shake translate in the wrapper style, and the lead probe equal to the QA stack ± 1 px (Proof row added).
- **Fists (T36).** GUNNER-1 back view: both `Arm.exact` fists with `flatFist`; thumb lines as T36's back row (RIGHT screen left, LEFT screen right).
- **Lean.** T09's `lean` uses the `lewisAnchors` muzzle (0, 0.586, −0.659) (T09 r4).

## Proof
- Stills (`out/edu30-T24/`): L 0, 2, 3, 4, 20, 40, 56, 68, 71; `scripts/qa-sheet.sh out/edu30-T24/sheet.png --cols 5 --width 270 out/edu30-T24/s*.png`; `measure-shots.ts B03-SH01 2,68`; overlay diff: render L 2 and L 3 with `tag: true` and check the tag and guides do not move.
- Clean L 2 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 2 / 3 | white core + halation + pop / half-size warm decay; muzzle above y 1100 | core luma ≥ 250 and the frame max; muzzle (432, 1020) ± 30 (r3, locked gun) |
| L 4 | birds' heads up | ≥ 80 % of F1 in the startle pose (logged) |
| L 56 | clumps bolting, spurts short of the birds, casings on the dirt right of G1 | no strike within 4 m of a bird (logged); casings x 0.8..1.5 |
| L 71 | bolt open, smoke hanging, no shake | shake (dx, dy, rot) = 0 |
| L 2 vs L 3 overlay | tag and guides fixed while the canvas shakes | overlay pixel diff 0 outside the canvas |
| L 30 / L 71 (r4) | smoke a haze, legs and muzzle readable; registered = QA stack | smoke cover ≤ 0.45, blast ≤ 0.40 (T04 measure); L 2 registered vs QA MAD ≤ 2 with the shake translate present; lead probe ± 1 px |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
