# T21 — plates B02-SH03 (one small truck arrives) and B02-SH04 (the line-up: three men, two guns) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: ready · r3: Film notes added (TICKETS-R3)
Class: set (plates) · Hard: yes (truck stop, salute)
Blocked by: T03, T09, T12, T13, T14 · Consumers: B02-SH03, B02-SH04 (global 440–591)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b02.md](../short/scene-sheets/b02.md) B02-SH03 and B02-SH04 (authoritative; SD03, SD04).

## Build
Replace the two stub shot files with the plates.
Files: `src/painted/edu30/shots/B02-SH03.tsx`, `src/painted/edu30/shots/B02-SH04.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space P, light m 0, eaten 0.4, newsreel warm strength 1; ruts on (T09) | T09 |
| B02-SH03 camera | fixed eye (−0.2, 0.4, 9.8), yaw −85, pitch 8, f 850, hy 1000 | b02 B02-SH03 (SD03) |
| B02-SH03 truck | T14 B02-SH03 drive + stop rock, riders `'silhouettes'`, gear `'cases'`, `paintTruckDust` (overtakes the stopped cab L 46–53) | b02 B02-SH03, T14 |
| B02-SH03 set | the track running away from the lens toward −x, fence on the right side of frame, paddock and gums beyond; near track ground under the lens (ruts) | b02 B02-SH03 |
| B02-SH04 camera | L 0–28 eye (−8.5, 1.3, 15.2), yaw 0, pitch 0, f 900, hy 860; L 28–44 to eye (−6.7, 1.3, 15.2), yaw 2; hold to 66; L 66–86 to eye (−7.2, 1.3, 15.2), yaw 0, pitch −30; hold to 97; ease-in-out each move | b02 B02-SH04 Camera |
| B02-SH04 line-up | z 12.6 facing +z, front: MEREDITH x −8.5 (T12 A salute keys L 2–28, then P01), GUNNER-1 x −7.3 `P01`, GUNNER-2 x −6.1 `P01`; all `neutral`; feet on the ground | b02 B02-SH04 Staging (SD04) |
| B02-SH04 guns | canvas sheet 2.6 × 1.2 m centred (−7.2, 0, 13.4), `#b9a77c`; G1 (−7.8, 0.1, 13.4) and G2 (−6.6, 0.1, 13.4) as T13 "guns on the sheet" (tripod false, barrels +x, pans on) | b02 B02-SH04; T13 |
| B02-SH04 truck | T14 parked (cab front x −3.6, z 9.5) behind the men | b02 B02-SH04 |
| Exactly three men | no other figure anywhere in either frame (the cab silhouette of B02-SH03 is MEREDITH, who steps out off screen between the shots) | b02 B02-SH04 Acceptance |
| Probe leads | B02-SH03: cab height at L 44; B02-SH04: MEREDITH L 0, GUNNER-1 and GUNNER-2 L 44 | T03 probe |

**Judgment for the builder (Hard).** The truck is one small, heavy, old vehicle: it brakes, dips its nose once and settles while its own dust rolls past. The salute is crisp and proud.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).

## Proof
- Stills (`out/edu30-T21/`): SH03 L 0, 30, 44, 46, 53; SH04 L 0, 8, 28, 44, 66, 86, 97.
- `scripts/qa-sheet.sh out/edu30-T21/sheet.png --cols 6 --width 270 out/edu30-T21/s*.png`; `measure-shots.ts B02-SH03 44` and `B02-SH04 0,44,86`; clean L 44 (SH03) and L 86 (SH04) through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH03 L 44 | one small truck stopped close | cab 486 ± 25 px |
| SH04 L 0 / 44 | MEREDITH saluting centred / the two gunners | MEREDITH 588 ± 30; GUNNER-1 594 ± 30, GUNNER-2 584 ± 30 |
| SH04 L 86 | two guns readable as machine guns at 270 px | guns near (290, 918) and (790, 918) ± 40 px, above y 1100 |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
