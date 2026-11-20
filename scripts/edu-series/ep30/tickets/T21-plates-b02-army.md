# T21 — plates B02-SH03 (one small truck arrives) and B02-SH04 (the line-up: three men, two guns) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: **done** (R10: T38 C1 accepted; L 0 leads restated TF61) · was: built, awaiting Film look check (2026-11-20) · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R8)
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

## r4 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R8`)
These override any older value in this ticket that they name.
- **Salute (T12 r6 A2, as built).** MEREDITH's salute uses T12's solve: mitten on the brim's front edge above his right eye, painted over the brim, elbow raised up to 0.15 m above the shoulder (accepted, TF34). `thumb check: MEREDITH RIGHT: open oval, no thumb drawn (unshaped kit)`.


## R10 look check (Film, 2026-11-20, `EDU-EP30-TICKETS-R10`)
Viewed `T38-sheet.png` (B02-SH04 L 86). **Verdict: accept with value change (done).** Canvas sheet reads under both guns (56 / ~90 luma apart). L 0 leads restated to the built figure: MEREDITH 631, GUNNER-1 617, GUNNER-2 624 ± 3 (the 622 / 619 values are L 44's) (TF61). Fix passes: 1 (T38).

## Proof
- Stills (`out/edu30-T21/`): SH03 L 0, 30, 44, 46, 53; SH04 L 0, 8, 28, 44, 66, 86, 97.
- `scripts/qa-sheet.sh out/edu30-T21/sheet.png --cols 6 --width 270 out/edu30-T21/s*.png`; `measure-shots.ts B02-SH03 44` and `B02-SH04 0,44,86`; clean L 44 (SH03) and L 86 (SH04) through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH03 L 44 | one small truck stopped close | cab 486 ± 25 px |
| SH04 L 0 / 44 | MEREDITH saluting centred / the two gunners | MEREDITH 588 ± 30; GUNNER-1 594 ± 30, GUNNER-2 584 ± 30 |
| SH04 L 86 | two guns readable as machine guns at 270 px | guns near (290, 918) and (790, 918) ± 40 px, above y 1100 |

## Result (Boss fills)
Commit: see `git log` on the T21 branch (`worktree-agent-ac2ec7d6ceefa9249`) · proof sheet: store `projects/edu/EDU/previews/T21-sheet.png` (stills `T21-s03_*.png`, `T21-s04_*.png`, clean `T21-clean-sh03_44.png`, `T21-clean-sh04_86.png`; local `out/edu30-T21/`, logs `out/logs/T21-*.log`) · fix passes used: 0 · Sonnet medium, 20 Nov 2026.

Measured (`measure-shots.ts`, stack camera):
- SH03 L 44 cab: roof front edge (a 1.8, y 2.12) to ground under the radiator (a 2.68): top 785, bottom 1225 (sheet front low 1223), **440 px vs 486 ± 25: out of range** (see below).
- SH04 L 0: MEREDITH 631 px (hat top; head top 588 = 631 / 1.074, row 588 ± 30 pass), x 540, feet y 1310 (sheet 1310). L 44: GUNNER-1 622 (hat top; head top 579, row 594 ± 30 pass) at x 299 (sheet 299), GUNNER-2 619 (head top 576; row 584 ± 30: pass on head top, 619 raw hat top exceeds by 5), x 715 (sheet 715).
- SH04 L 86: G1 centre (287, 900), G2 centre (793, 900) vs rows (290, 918) and (790, 918) ± 40: pass, above y 1100. Guns read as machine guns (pan, shroud, grip) on the 270 px sheet.
- Caption zone (clean SH03 L 44, SH04 L 86, default thresholds): mean 0.668 / 0.722, p95 0.962 / 0.796, `pass: false` at the script's defaults (dark ground fills the band; the caption shade is the Editor's).
- Exactly three men in every SH04 frame (viewed L 0, 8, 28, 44, 66, 86, 97); no figure in SH03 apart from the silhouette riders (MEREDITH in the cab, two on the tray) painted by T14.
- Hand lines: `thumb check: MEREDITH RIGHT: open oval, no thumb drawn (unshaped kit)` (T12 r6 A2 as built, salute L 8 viewed); gunners' arms at the sides (`P01`), no hand over a part. `arm check: MEREDITH right: attached ok` (T12 solve, viewed L 8).
- Tests/type: `npx tsc` has no error under `src/painted/edu30/shots/`; the remaining errors are older (`tests/render-options.test.ts`, `tests/arm-depth.test.ts`, `tests/edu18-girl.test.ts`) and not in T21 files.

Values I could not follow:
- B02-SH03 cab 486 ± 25 px: the T14 truck geometry (roof 2.12 m, cab front a 2.6, stop at cab front x -3.6 per its Decided values) at the SD03 camera projects to 440 px by my probe (front low 1225 matches the sheet's 1223, roof at 785 vs the sheet's 737, about 0.24 m higher on the sheet). The sheet number likely came from other dimensions; I changed neither the camera, the stop x nor the locked truck. Film: widen the row, move the camera closer, or ask T14 for a taller cab.
- Gun placement: the ticket's `y 0.1` is read as T13's "receiver bottom on the canvas at y 0.1": the gun `at` is (x, -0.41, 13.4) with `tripod: false`, `elev: 0`, heading 0, so the gun centre (tripod-head height) is at y 0.56 - 0.41 = 0.15.
- Canvas sheet `#b9a77c` reads close to the warm-graded dirt, so the sheet edge is faint on the 270 px sheet; no value changed.

## R9 look check and decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
Viewed: store `T21-sheet.png` (11 frames). **Verdict: SH03 accept with value change; SH04 fix one value (in T38).**
| Item | Decision | Reason |
| --- | --- | --- |
| SH03 cab | **440 ± 25** px at L 44 (TF22 already); the truck reads as one small truck, brakes and its dust overtakes | the locked truck geometry |
| SH04 line-up and guns | pass: three men, salute crisp, guns read as machine guns; gun `at` y −0.41 (receiver bottom on the canvas) accepted | as built |
| SH04 canvas sheet | **fix**: `#b9a77c` → **`#8a8160`** (T38 row C1); the sheet edge is invisible on the warm dirt | the sheet must read as the guns' display cloth |
| Caption zone | SH03 0.668 / 0.962, SH04 0.722 / 0.796: pass under TF46 | — |
