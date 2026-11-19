# T14 — the 1932 truck drives, stops, bounces as one rigid body with its riders and G2 on a pedestal, trailing dust
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: movement · Hard: yes (movement, riders' arms)
Blocked by: T13 (same files), T11 (seated gunner right profile) · Consumers: B01-SH02, B02-SH03, B02-SH04 (parked), B05-SH01, B05-SH02, B05-SH03, B06-SH03, B06-SH04
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules) (Hard-ticket checks), brief [VD30-08](../short/film-brief.md#scene-decisions), [kit/ycam.ts](../../../../src/painted/kit/ycam.ts) `body`, `bodyPoint` (EDU-EP21 precedent), [props.ts](../../../../src/painted/edu30/props.ts) `paintTruck`, [kit/fall.ts](../../../../src/painted/kit/fall.ts) (dust), sheet blocks [b02 B02-SH03](../short/scene-sheets/b02.md), [b05 B05-SH01, B05-SH02](../short/scene-sheets/b05.md).

## Build
A truck rig in `props.ts` that paints the locked box truck, its crew and its gun through one rigid body transform, with drive, stop-and-rock and bump helpers, and a dust trail.
Casting line: `new: truck-1932` (locked look) + riders: MEREDITH, GUNNER-1, GUNNER-2 (silhouettes or GUNNER-1 full figure in chase mode).
Files: `src/painted/edu30/props.ts`, `src/painted/edu30/proof-props.tsx`, `tests/edu30-props.test.ts`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Space T | space P axes translated to the truck's ground centre; truck heading +x (cab at +x end), length 5.2, width 2.0, cab roof 2.1, tray deck 1.1 | index Spaces, Sizes |
| `truckBody(centre: V3, pitch, roll): YBody` | pivot = centre on the ground; pitch rad about world z (+ = nose up), roll rad about world x (+ = the truck's left side, world −z, down); row-major rotation as `YCam.body` expects | VD30-08 |
| `paintTruckRig(p, c, o)` | `o: {centre; pitch?; roll?; riders: 'silhouettes' \| 'chase' \| 'none'; gear: 'cases' \| 'pedestal' \| 'none'; g2Elev?: number; wheelTurn?: number; t; seed}`; paints truck + riders + gun with `{...c, body: truckBody(...)}` | ticket |
| Silhouette riders (B01-SH02, B02-SH03, B05-SH03, B06-SH03/04) | cab: MEREDITH head and slouch hat through the cab window; tray: two seated figures (shoulders, heads, hats) at T(−1.2, 1.1, ±0.45); flat fill `#2b241c` (under the newsreel tint they read as dark shapes); in `'cases'` two gun cases 1.4 × 0.25 × 0.20 m `#5c4a32` on the tray | b02 B02-SH03 Staging |
| Chase riders (B05-SH01/SH02) | GUNNER-1 full figure, `paintSeatedGunner` view `'right'` (T11) seated at T(−1.2, 1.1, 0), hands on G2 `grip`/`stock`; GUNNER-2 and MEREDITH as cab silhouettes (driver at the right-hand wheel: T(1.6, 1.4, −0.45)) | b05 B05-SH01 Staging |
| G2 pedestal | post T(−0.55, 1.1 … 1.75, −0.1), Ø 0.08 m, `#34332f`; G2 pivot T(−0.55, 1.80, −0.1); muzzle 0.80 m from the pivot along the barrel; rest elevation 10°, barrel yawed 14° toward −z (muzzle ≈ T(0.21, 1.94, −0.29)) | b05 B05-SH01 (muzzle T(0.2, 2.0, −0.2), estimate) |
| G2 bump kick | elevation 10° → **50°** at bump peak → 10°: the rigid gun on its pivot peaks with the muzzle at y ≈ 2.41 (Film fix: the sheet's T(0.0, 2.6, 0) is not reachable by a 0.8 m barrel arm; the kick toward the sky is kept) | b05 B05-SH02 Staging |
| Drive B02-SH03 | cab front x(L): −16 + 0.3351 L for L ≤ 30 (10.05 m/s); then decelerating linearly to stop at L 44: x(L) = −5.947 + 0.3351 (L − 30) − 0.01197 (L − 30)² → −3.60 at L 44; centre = cab front − 2.6 | b02 B02-SH03 (cab front −16 → −3.6, constant to 30, braking to 44) |
| Stop rock B02-SH03 | pitch keys L 44: 0 → 46: −2.0° (nose down) → 48: +0.8° → 50: 0, ease-in-out | b02 B02-SH03 (rocks forward 44–50) |
| Bumps B05-SH01 | seeded bumps, gap 12–18 f, each: pitch +1.5° × s (s seeded ±0.6–1.0) peak at +3 f, −0.5 × peak at +6, 0 at +9; roll ±1.0° × s with the same shape; G2 elevation follows 10° → 25° → 10° on each bump | b05 B05-SH01 (VD30-08, ±1.5°, every 12–18 f) |
| Bumps B05-SH02 | at L 8, 24, 38, 52, 66: pitch keys k 0, k+3 +3°, k+6 −2°, k+8 0 (ease-in-out between keys); G2 elevation k 10°, k+3 50° (ease-out), k+8 10° (ease-in-out) | b05 B05-SH02 Staging |
| Camera locked to the truck (B05-SH01) | the plate camera is the truck-local camera without body; the SET (ground, wheat, birds, sky) is painted through a camera whose `body` is the inverse of the truck rotation about the truck pivot, so the world tilts and the riders stay still (no camera roll field needed) | b05 B05-SH01 Camera |
| Camera follows travel only (B05-SH02) | set painted plain; truck, riders and gun painted with `body` = the truck rotation | b05 B05-SH02 Camera |
| Wheels | hub mark rotates by distance / 0.40 m (rad) | ticket |
| `paintTruckDust(p, c, L, track)` | a puff every 2 f at each rear wheel while moving; each puff radius 0.3 → 1.5 m over 30 f, alpha 0.40 → 0, colour `#b08a62`; velocity 0.3 × truck velocity + seeded ± 0.2 m/s; after a stop the puffs keep their velocity × 0.92 per frame so the cloud rolls past the stopped cab (B02-SH03 L 46–53) | b02 B02-SH03 ("dust trails and overtakes") |
| Riders never slide | every rider and the gun are drawn in the same `body` call as the truck | b05 B05-SH01 Acceptance |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TP3.png` (truck leaving, retreat vantage).

**Judgment for the builder (Hard).** Weight: the truck is heavy and old; the stop dips the nose and settles once. In the chase the world bounces around a calm gunner whose fists never leave G2. The gun kicks only because the ground kicks it; nobody fumbles.

## Proof
- `node scripts/test.mjs tests/edu30-props.test.ts`: `truckBody` with pitch 0, roll 0 is identity; cab front at L 30 = −5.95 ± 0.01 and at L 44 = −3.60 ± 0.01; a rider point and the truck deck point keep a constant distance at every B05-SH02 frame.
- `proof-props.tsx`: `R30-stop` (B02-SH03 camera `eye (−0.2, 0.4, 9.8), yaw −85, pitch 8, f 850, hy 1000`) at L 0, 30, 44, 46, 48, 53; `R30-chase` (B05-SH01 truck-local camera) at L 0, 10, 20; `R30-side` (B05-SH02 camera) at L 8, 11, 16, 72.
- `scripts/qa-sheet.sh out/edu30-T14/sheet.png --cols 5 --width 270 …`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| R30-stop 44 | one small truck stopped close; dust overtaking by 53 | cab height 486 ± 25 px (sheet SD03) |
| R30-chase 0 / 10 | world tilted, gunner and tray still in the frame | GUNNER-1 ≥ 480 px (sheet 497); rider px drift between frames ≤ 1 px |
| R30-side 8 / 11 | barrel kicked toward the sky at the bump peak | muzzle 120–260 px higher at L 11 than at L 8 |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
