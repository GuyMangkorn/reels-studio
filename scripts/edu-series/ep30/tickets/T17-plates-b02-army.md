# T17 — plates B02-SH03 (truck arrives), B02-SH04 (line-up), B02-SH05 (set-up, heads rise) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plates) · Hard: yes (truck stop, salute, loader hands, rising heads)
Blocked by: T03, T08, T09, T12, T13, T14 · Consumers: B02-SH03, B02-SH04, B02-SH05 (global 440–659)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), shot blocks [b02.md](../short/scene-sheets/b02.md) B02-SH03, B02-SH04, B02-SH05 (and the index deviations SD03, SD04).

## Build
Replace the three stub shot files.
Files: `src/painted/edu30/shots/B02-SH03.tsx`, `src/painted/edu30/shots/B02-SH04.tsx`, `src/painted/edu30/shots/B02-SH05.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| All three | space P morning (m 0), `eaten: 0.4`; newsreel warm, strength 1 | T09 schedule |
| B02-SH03 | camera fixed `eye (−0.2, 0.4, 9.8), yaw −85°, pitch 8°, f 850, hy 1000`; truck: T14 drive formula (cab front −16 → −3.6 at L 44), stop rock L 44–50, riders `'silhouettes'`, gear `'cases'`, wheels turning, `paintTruckDust` from L 0 | b02 B02-SH03, SD03 |
| B02-SH04 line-up | z 12.6 facing +z (front views squared to the lens): MEREDITH x −8.5 (T12 pose A salute L 2–28, then P01), GUNNER-1 x −7.3 `P01`, GUNNER-2 x −6.1 `P01`; faces `neutral`; slouch hats | b02 B02-SH04 Staging (SD04) |
| B02-SH04 guns | canvas sheet 2.4 × 1.2 m, `#b9a77e`, centred (−7.2, 0.01, 13.4); G1 at (−7.8, 0.1, 13.4) and G2 at (−6.6, 0.1, 13.4), `buildLewisGun({tripod: false})`, barrels along +x, lying level on the receiver with the pan on top, `magTurn` 0 | b02 B02-SH04 Staging ("two guns on a canvas sheet") |
| B02-SH04 truck | parked: T14 rig, centre (−6.2, 0, 9.5) (cab front −3.6), riders `'none'`, gear `'none'` | b02 B02-SH04 |
| B02-SH04 camera | L 0–28 `eye (−8.5, 1.3, 15.2), yaw 0, pitch 0`; L 28–44 to `eye (−6.7, 1.3, 15.2), yaw 2°`; hold to 66; L 66–86 to `eye (−7.2, 1.3, 15.2), yaw 0, pitch −30°`; hold to 109; ease-in-out each move; f 900, hy 860 | b02 B02-SH04 Camera |
| B02-SH05 crew (back views) | MEREDITH T12 pose C (`P44-back`) at (−0.6, 0, 1.05); GUNNER-1 seated back (T11) at (0, 0, 0.85), fists on G1 grip/stock, settle: `rise` +0.01 m L 0–6 then 0 by L 15; GUNNER-2 T12 pose D (loader) at (0.50, 0, 0.35), pan seated on L 30; G1 at (0, 0, 0) barrel −z, `magTurn` 0; gear as LF01 | b02 B02-SH05 Staging; T12 D (loader mark fix) |
| B02-SH05 heads | T08 `risingHeads(L)` (groups at L 20, 25, 30, 35, 40, 45) | b02 B02-SH05 Staging |
| B02-SH05 camera | `eye (−0.8, 1.9, 3.95) → (−0.8, 1.9, 3.5)`, `yaw −4° → 4°`, pitch −8°, f 880, hy 860, ease-in-out L 0–55 | b02 B02-SH05 Camera |
| Crew never turns | no head or body of the crew turns toward the heads in B02-SH05 | b02 Acceptance |
| Probe leads | B02-SH03: truck cab height; B02-SH04: MEREDITH, GUNNER-1, GUNNER-2; B02-SH05: MEREDITH | T03 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (outfits, gun, gear), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TP3.png` (truck look).

**Judgment for the builder (Hard).** The truck is one small truck that stops with a dip, not a convoy. The salute is crisp; the line-up stands still. In B02-SH05 the loader's two mittens stay on the pan through the seat; the heads rise in six clear beats on L 20 … 45 while the crew keeps working.

## Proof
- Stills: B02-SH03 L 0, 30, 44, 46, 48, 53; B02-SH04 L 0, 8, 28, 44, 66, 86, 109; B02-SH05 L 0, 20, 30, 45, 55 via `stills.mjs` (log `out/logs/T17-stills.log`); `qa-sheet.sh --cols 6 --width 270`; `measure-shots.ts` per shot.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| B02-SH03 L 44 | a single truck stopped close | cab 486 ± 25 px; front low y 1223 ± 25 |
| B02-SH04 L 0 / 44 / 109 | three men only; then the two guns | MEREDITH 588 ± 30 (≥ 480); GUNNER-1 594 ± 30, GUNNER-2 584 ± 30; guns at (290, 918) and (790, 918) ± 30 |
| B02-SH04 L 8 | salute | `thumb check: MEREDITH RIGHT: screen lower-right ok` |
| B02-SH05 L 30 / 45 | pan seated under both mittens; six groups of heads up | MEREDITH ≥ 480 from L 0 (sheet 480 → 553; a measure below 480 at L 0 is a fail to report) |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
