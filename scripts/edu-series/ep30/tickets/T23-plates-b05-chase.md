# T23 — plates B05-SH01 (chase locked to the truck) and B05-SH02 (the barrel bounces at the sky) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plates) · Hard: yes (rider arms on a bouncing body, running emus)
Blocked by: T03, T04, T08, T09, T11, T14 · Consumers: B05-SH01, B05-SH02 (global 1186–1345)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), shot blocks [b05.md](../short/scene-sheets/b05.md) B05-SH01, B05-SH02; brief [VD30-08](../short/film-brief.md#scene-decisions).

## Build
Replace the two stub shot files with the chase, using the T14 truck rig in `'chase'` mode and its two camera modes.
Files: `src/painted/edu30/shots/B05-SH01.tsx`, `src/painted/edu30/shots/B05-SH02.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space P morning, `eaten: 0.6`; newsreel warm, strength 1; truck heading +x on the track centre z 9.5; T14 rig riders `'chase'`, gear `'pedestal'` (G2 on the pedestal, GUNNER-1 right profile seated at T(−1.2, 1.1, 0), fists on G2 grip/stock, face `neutral`), wheels turning, `paintTruckDust` on | b05 Staging |
| B05-SH01 truck | centre x(L) = −20 + 0.2 L (6 m/s), L 0–75; bumps: T14 seeded B05-SH01 schedule, seed 41501 | b05 B05-SH01 |
| B05-SH01 camera | truck-local `eye T(−3.0, 2.4, 2.2), yaw 60°, pitch −6°, f 1100, hy 860`, rigid with the truck: set painted through the inverse body (T14 locked mode); truck, riders and gun painted without body | b05 B05-SH01 Camera; T14 |
| B05-SH01 emus | seven runners ahead at T-offsets (6, 0, −1), (8.5, 0, 0.6), (10, 0, −2), (12, 0, 1.2), (14, 0, −2), (17, 0, 0), (20, 0, −1.5) at L 0 (world = truck centre + offset, y 0), each running +x at 6.0 m/s + seeded U(−0.5, +0.5), run phase from speed (stance static), dust puff at each footfall | b05 B05-SH01 Staging |
| B05-SH02 truck | centre continues from x −5 at L 0; speed v(L) = 5 − L / 83 m/s (5 → 4 m/s); x(L) = −5 + (5 L − L² / 166) / 30; bumps at L 8, 24, 38, 52, 66 with the T14 B05-SH02 keys (pitch +3° / −2°, G2 elevation 10° → 50° → 10°) | b05 B05-SH02 Staging; T14 |
| B05-SH02 camera | travel-following, not pitching: eye = (truck centre x + (−0.7), 2.0, 9.5 + 2.1), yaw 0, pitch 0, f 950, hy 860; L 60–83 the eye eases 0.3 m back along +z (ease-in-out); set plain, truck/riders/gun through the body (T14 follow mode) | b05 B05-SH02 Camera |
| B05-SH02 emus | five runners at T(6, 0, −6) ± seeded 1.5 m at L 0, running +x at 6 m/s (faster than the truck, so they pull away and leave frame right by L 70) | b05 B05-SH02 Staging |
| B05-SH02 shots | T04 single-shot flash at G2's muzzle on L 72 and L 79 (halo 160), the muzzle at its current elevation (≈ 30° at L 72 as the L 66 kick settles, 10° at L 79); no strike, no shake, no casings shown | b05 B05-SH02 Staging |
| Probe leads | GUNNER-1 seated span in both shots; G2 muzzle point | T03 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/KP-run.png` (run), `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (outfit, gun).

**Judgment for the builder (Hard).** Nobody fumbles: GUNNER-1 sits calm with both fists on G2 in every frame while the world (SH01) or the truck (SH02) bounces. The barrel kicks only on the bump keys. The runners' feet keep their contacts at 6 m/s.

## Proof
- Stills: B05-SH01 L 0, 12, 24, 40, 75; B05-SH02 L 0, 8, 11, 16, 38, 41, 70, 72, 79 via `stills.mjs` (log `out/logs/T23-stills.log`); `qa-sheet.sh --cols 7 --width 270`; `measure-shots.ts`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| B05-SH01 L 0 / 12 | world tilted on a bump, tray and gunner fixed in frame; title "แผน 3" clear | GUNNER-1 497 ± 25 px (≥ 480); rider px drift between L 0 and 12 ≤ 1 px |
| B05-SH02 L 8 / 11 | barrel kicked toward the sky at the bump peak | muzzle 120–260 px higher at L 11 than at L 8 |
| B05-SH02 L 70 | emus gone out of frame right | birds in frame = 0 |
| B05-SH02 L 72 / 79 | two single flashes | flash present on exactly 72 and 79 |
| any | `thumb check: GUNNER-1 RIGHT` and `arm check` lines | arm ratio ≤ 1.05 through a bump (L 8–16, every frame) |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
