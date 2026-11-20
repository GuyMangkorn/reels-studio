# T14 — the 1932 truck drives, stops, turns about, bounces as one rigid body with its riders and G2 on a pedestal, trailing dust
Deliverable: EDU-EP30-SHORT · Revision: r5 · Status: done (R7: Film accepts r5 as built; E4 L 44 row widened to ≤ 27 %; the user confirms, because the cap is reached: index question Q-R7-1; neither answer changes code unless the user orders a third pass) · was: r5 fix pass built 2026-11-20, tests 19/19; E4 L 44 measures 26.25 % (row 25 %), Film to decide; cap reached · was: r5 fix pass ready (R6 Film look check of the r4 stop dust, 2026-11-20: fix: at L 44/46 two big hard-rimmed disc stacks hide the lower truck; rows E1–E4; the chase frames, seats and every other r4 row pass; this is the second fix pass, the cap) · was: done (r4 fix pass built 2026-11-20, tests 18/18; Film look check of the dust still pending) — r4 fix pass (r5 Film, 2026-11-20: Q1 cab height and Q2 gunner height settled by moving the rows, no rebuild; Q3 dust carry for the B02-SH03 stop and the right-hand-drive cab seats to build; Boss's other silent choices confirmed; see r4 decisions; built 2026-11-20, tests 17/17) · r3: Film notes added (TICKETS-R3)
Class: movement · Hard: yes (movement, riders' arms)
Blocked by: T13 (same files `props.ts`, `proof-props.tsx`, `tests/edu30-props.test.ts`), T11 (seated gunner right profile) · Consumers: B01-SH02, B02-SH03, B02-SH04 (parked), B05-SH01, B05-SH02, B05-SH03, B06-SH03, B06-SH04
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks); brief [VD30-08](../short/film-brief.md#scene-decisions); [kit/ycam.ts](../../../../src/painted/kit/ycam.ts) `body`, `bodyPoint` (EDU-EP21 precedent); [props.ts](../../../../src/painted/edu30/props.ts) `paintTruck`; [kit/fall.ts](../../../../src/painted/kit/fall.ts) (dust); sheet blocks b01 B01-SH02, b02 B02-SH03, b05 B05-SH01 … SH03, b06 B06-SH03, B06-SH04.

## Build
A truck rig in `props.ts` that paints the locked box truck, its crew and its gun through one rigid body transform, with drive, stop-and-rock and bump helpers, a dust trail, and the drive schedules of every truck shot.
Casting line: `new: truck-1932` (locked) + riders MEREDITH, GUNNER-1, GUNNER-2 (silhouettes, or GUNNER-1 full figure in chase mode).
Files: `src/painted/edu30/props.ts`, `src/painted/edu30/proof-props.tsx` (adds `R30-truck-*`), `tests/edu30-props.test.ts`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Space T | space P axes translated to the truck's ground centre; truck 5.2 × 2.0 m, cab roof 2.1, tray deck 1.1; `dir` +1 = cab at the +x end | index Spaces, Sizes |
| `truckBody(centre: V3, pitch, roll): YBody` | pivot = centre on the ground; pitch rad about world z (+ = nose up), roll rad about world x (+ = the truck's left side down); row-major as `YCam.body` expects | VD30-08 |
| `paintTruckRig(p, c, o)` | `o: {centre; dir: 1 \| −1; pitch?; roll?; riders: 'silhouettes' \| 'chase' \| 'none'; gear: 'cases' \| 'pedestal' \| 'none'; g2Elev?; wheelTurn?; t; seed}`; paints truck + riders + gun in one `{...c, body: truckBody(...)}` pass | ticket |
| Silhouette riders | cab: MEREDITH head and slouch hat through the cab window; tray: two seated figures (shoulders, heads, hats) at T(−1.2, 1.1, ±0.45); flat fill `#2b241c`; `'cases'` = two gun cases 1.4 × 0.25 × 0.20 m `#5c4a32` on the tray. Used in B01-SH02, B02-SH03, B05-SH03, B06-SH03, B06-SH04 | b02 B02-SH03 Staging |
| Chase riders (B05-SH01/SH02) | GUNNER-1 full figure, `paintSeatedGunner` view `'right'` (T11) at T(−1.2, 1.1, 0), fists on G2 `grip`/`stock`; GUNNER-2 driving and MEREDITH as cab silhouettes (driver at the right-hand wheel T(1.6, 1.4, −0.45)) | b05 B05-SH01 Staging |
| G2 pedestal | post T(−0.55, 1.1 … 1.75, −0.1), Ø 0.08 m, `#34332f`; G2 pivot T(−0.55, 1.80, −0.1); muzzle 0.66 m from the pivot (r3: the locked gun, tripod-head point on the pivot); rest elevation 10°, barrel yawed 14° toward −z (muzzle ≈ T(0.08, 1.91, −0.26), estimate; `lewisAnchors` wins) | b05 B05-SH01 (muzzle T(0.2, 2.0, −0.2), estimate) |
| G2 bump kick | elevation 10° → **50°** at the bump peak → 10°: muzzle peaks at y ≈ 2.31 (r3, 0.66 m arm; Film fix: the sheet's T(0.0, 2.6, 0) is out of reach of a 0.8 m barrel arm; the kick toward the sky is kept) | b05 B05-SH02 Staging |
| B01-SH02 drive | dir +1, centre (−7.0 + 13.0 × L / 58, 0, 9.5), L 0–58, pitch 0 | b01 B01-SH02 |
| B02-SH03 drive | dir +1; cab front x(L) = −16 + 0.3351 L for L ≤ 30; then x(L) = −5.947 + 0.3351 (L − 30) − 0.01197 (L − 30)² to −3.60 at L 44; centre = cab front − 2.6; stop rock pitch keys L 44: 0 → 46: −2.0° → 48: +0.8° → 50: 0 (ease-in-out) | b02 B02-SH03 |
| B02-SH04 parked | dir +1, cab front x −3.6, z 9.5, still | b02 B02-SH04 |
| B05-SH01 drive | dir +1, centre (−17 + 12 × L / 59, 0, 9.5) (6.1 m/s); seeded bumps every 12–18 f: pitch +1.5° × s (s seeded 0.6–1.0) peaking at +3 f, −0.5 × peak at +6, 0 at +9; roll ±1.0° × s, same shape; G2 elevation 10° → 25° → 10° per bump | b05 B05-SH01 |
| B05-SH02 drive | centre from (−5, 0, 9.5), speed 5 m/s easing linearly to 4 m/s by L 83; bumps at L 8, 24, 38, 52, 66: pitch keys k 0, k+3 +3°, k+6 −2°, k+8 0 (ease-in-out); G2 elevation k 10°, k+3 50° (ease-out), k+8 10° (ease-in-out); two single shots from G2 at L 72 and 79 (T04) aimed at the sky | b05 B05-SH02 |
| B05-SH03 drive | dir +1, centre x −2.0 → 35 linear over L 0–93 (11.9 m/s), z 9.5, silhouettes, gear `'pedestal'` (G2 at rest 10°) | b05 B05-SH03 |
| B06-SH03 return and time-lapse | L 0–26 absent; arrives **dir −1** (cab toward −x) from centre x 30 at L 27 to park at x 2.0 at L 45 (ease-out); jump states local 59–94 in six 6-frame jumps (59, 65, 71, 77, 83, 89): parked dir +1 / gone / parked dir +1 / gone / parked dir +1 / parked dir +1 at x 2.0; from L 89 parked dir +1 (turned about between jumps, unseen), so B06-SH04 starts from it | b06 B06-SH03 (SD10); B06-SH04 start "from x 2.0 heading +x" |
| B06-SH04 drive | dir +1, centre x 2.0 at L 0, accelerating to 12 m/s by L 10, then constant, leaving frame left by L 40 (the same path and speed as B05-SH03 after its start) | b06 B06-SH04 |
| Camera locked to the truck (B05-SH01) | the plate camera is the truck-local camera without body; the SET (ground, wheat, birds, sky) is painted through a camera whose `body` is the inverse of the truck rotation about its pivot, so the world tilts and the riders stay still | b05 B05-SH01 Camera |
| Camera follows travel only (B05-SH02) | set painted plain; truck, riders and gun with `body` = the truck rotation | b05 B05-SH02 Camera |
| Wheels | hub mark rotates by distance / 0.40 m (rad) | ticket |
| `paintTruckDust(p, c, L, track)` | a puff every 2 f at each rear wheel while moving: radius 0.3 → 1.5 m over 30 f, alpha 0.40 → 0, `#b08a62`; velocity 0.3 × truck velocity + seeded ± 0.2 m/s; after a stop the puffs keep their velocity × 0.92 per frame so the cloud rolls past the stopped cab (B02-SH03 L 46–53) | b02 B02-SH03 |
| Riders never slide | every rider and the gun drawn in the same `body` call as the truck | b05 B05-SH01 Acceptance |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TP3.png` (truck leaving, retreat vantage).

**Judgment for the builder (Hard).** Weight: the truck is heavy and old; the stop dips the nose and settles once. In the chase the world bounces around a calm gunner whose fists never leave G2. The gun kicks only because the ground kicks it; nobody fumbles.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **G2 muzzle (r3, T13 r3 / TF17).** The locked gun mounts with its tripod-head point on the pivot T(−0.55, 1.80, −0.1); the muzzle is `lewisAnchors(...).muzzle`, 0.66 m from the head (was 0.80 m): at rest (elevation 10°, yaw 14° toward −z) about T(0.08, 1.91, −0.26) (estimate; the build value wins). The bump kick keeps 10° → 50° → 10°: the muzzle peaks at y ≈ 1.80 + 0.66 sin 50° = 2.31 (TF10 2.41 → 2.31). Proof row R30-truck-side 8 / 11: muzzle **100–220 px** higher at L 11 than at L 8 (was 120–260, scaled by the shorter arm).
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).

## r4 decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R5`): Boss's three proof rows and silent choices
Viewed: store `T14-stop-44`, `T14-stop-53`, `T14-chase-00`, `T14-chase-10`, `T14-side-11`, `T14-vantage-46` tiled at 270 px.
1. **Q1 cab height: keep the world, move the row.** The drive schedule (cab front −3.60 at L 44, centre = cab front − 2.6, the locked 5.2 m truck) is the plan, tested, and the front-low point already lands where the sheet put it (1225 vs 1223, x 542 vs 541). The sheet's 486 assumed the roof's front edge stands over the bumper; on the locked truck the bonnet is ahead of the cab, so the roof edge is about a metre further from the lens and lower on screen. Row R30-truck-stop 44 → **cab height 440 ± 25 px** (measured 440: pass). Sheet fix TF22.
2. **Q2 GUNNER-1 height: keep the seat, move the row.** T11 is done and the built seated figure is 1.12 m top to bottom; moving him 0.16 m toward the lens would take his fists off G2's grip and stock. The chase frames read well at 444 px (he fills the left third, the tray and cab behind). Row R30-truck-chase 0 / 10 → **GUNNER-1 ≥ 430 px** (measured 444: pass); B05-SH02 gives 495. Sheet fix TF23.
3. **Q3 dust: build (D1–D3).** The stop beat (B02-SH03 L 44–53) is a gag: the truck stops and its own dust cloud rolls on past the cab. A 0.3 carry is right for a trail (the dust falls behind) but cannot overtake.
4. **Cab seats: right-hand drive (build, C1).** The ticket meant a right-hand-drive Australian Army truck (1932; Australia drives on the left) but wrote z −0.45, which is the truck's left with the cab at +x (right = forward × up = +z in space T, as Boss read). The driver sits at **T(1.6, ·, +0.45)**, the camera side in the chase. Boat check, low stakes (silhouettes and a chase-cab glimpse): question R5-B1 in the tickets index.
5. **Confirmed as built (no change):** the rig's side wheels (axle along z, tyre 0.18 m) through `wheelTurn`, with the locked `paintTruck` default untouched (LF01a keeps its approved truck; every plate paints the truck only through `paintTruckRig`, index common rule R5); the hollow tray (floor, boards 0.03 m, 1.1–1.45 m); gun cases at T(−0.05, 1.1, ±0.33); the silhouette shapes; B05-SH01 bump gaps counted from L −9 (a bump under way at L 10, L 0 level) and G2 back to 10° at k + 9; B06-SH03 dir −1 from arrival and dir +1 from the first jump state L 59 (TF11); puff centre y = 0.15 + 0.5 r, one plain disc per puff.

**r4 values (Boss builds exactly these).** Files: `src/painted/edu30/props.ts`, `src/painted/edu30/proof-props.tsx` (only if a proof call changes), `tests/edu30-props.test.ts`.

| Row | Value | Pass |
| --- | --- | --- |
| D1 carry | `paintTruckDust` / `truckDustPuffs` take `carry` per schedule: **0.9** for B02-SH03, **0.3** for every other schedule (as built); puff velocity = `carry` × truck velocity at emission + seeded ± 0.2 m/s, constant while the truck moves | test: a B05-SH01 puff still trails (10 f after emission its x is behind the emitting wheel's current x by ≥ 0.6 × the truck's travel in those 10 f); pure function of L |
| D2 after the stop | from the truck's stop frame (B02-SH03 L 44) every live puff's velocity decays × **0.95** per frame (was 0.92), closed form `v · 0.95 (1 − 0.95^k) / 0.05` after k frames | test: closed form = frame-by-frame sum within 0.001 m |
| D3 B02-SH03 life | B02-SH03 puffs live **40 f** (alpha 0.40 → 0 over 40 f; radius 0.3 → 1.5 m over 30 f, then held); other schedules 30 f as built | R30-truck-stop 53: at least 3 puffs with alpha ≥ 0.12 whose disc reaches x ≥ −3.6 (the cab front; centre x + radius), logged; the still shows dust in front of the lower cab; R30-truck-stop 44: dust still behind and beside the rear wheels |
| C1 seats | cab heads: silhouettes mode MEREDITH at the wheel T(1.6, 1.90 head, **+0.45**); chase mode GUNNER-2 driving at T(1.6, ·, **+0.45**), MEREDITH at T(1.6, ·, **−0.45**) | R30-truck-chase 0: the driver's head on the camera side of the cab (logged x); rider drift still 0 px |

Proof: re-render R30-truck-stop 44, 46, 48, 53 and R30-truck-chase 0, 10; archive as `T14r4-*.png`; every other row stands as measured.

## r5 decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R6`): look check of the r4 dust
Viewed: store `T14r4-sheet.png` (six frames at 270 px).
- **Chase 0 / 10: pass** (GUNNER-1 444 px, driver on the camera side, tray and cab read).
- **Stop 44 / 46: fix.** The stop must read as a small truck pulled up close, clear, before its own dust rolls past (B02-SH03 gag). In r4 the truck is already inside two round clouds at L 44: the rear-wheel puffs ride with it at carry 0.9 and have grown to about 1.5 m, so seen front-on they stand on both sides of and over the bonnet and front wheels, and the many overlapping plain discs show a stack of hard rims (bubbles, not dust). Stop 53: the overtake reads; keep it, but smaller and softer.
- **Carry 0.9, decay 0.95, life 40 f: stand** (r4 D1–D3). The fix is size and edge.
- **Seats (C1): stand.** R5-B1 is closed by Film without a Boat pass (index).

**r5 values (Boss builds exactly these).** Files: `src/painted/edu30/props.ts`, `src/painted/edu30/proof-props.tsx` (only if a proof call changes), `tests/edu30-props.test.ts`. Applies to the B02-SH03 schedule (`truckDustFor('B02-SH03')`) only; every other schedule as built.

| Row | Value | Pass |
| --- | --- | --- |
| E1 size while moving | radius 0.25 → **0.8 m** over 30 f of age (was 0.3 → 1.5 m) | test: radius at age 30 = 0.80 m ± 0.01 |
| E2 swell after the stop | from the stop frame (L 44), each live puff's radius grows on by **+0.5 m over the next 20 f** (linear in min(k, 20)), so the cloud swells only as it overtakes; pure function of L | test: L 53 radius = moving radius + 0.5 × 9/20; L 64 + 0.5 |
| E3 soft edge | each puff paints as **3** concentric plain discs (r, 0.72 r, 0.45 r), each with α_c = 1 − (1 − α)^(1/3) (the T04 smoke rule), colour as built `#b08a62` | viewed at 270 px: no row of hard rims; centre alpha of a lone puff equals the r4 alpha ± 0.01 (test) |
| E4 the truck reads at the stop | — | R30-truck-stop 44: dust with alpha ≥ 0.12 covers **≤ 25 %** of the truck's screen box (cab, bonnet, front wheels; 20 × 20 sample grid, logged; log the r4 value too); front-wheel ground contact visible. L 46: ≤ 35 %. L 53: ≥ 3 puffs with alpha ≥ 0.12 reaching x ≥ −3.6 (r4 row) and dust across the lower cab (viewed) |

Proof: re-render R30-truck-stop 44, 46, 48, 53; archive as `T14r5-*.png` with `T14r5-sheet.png`. The fix-pass cap is reached after r5: a further miss goes to the user.

## Proof
- `node scripts/test.mjs tests/edu30-props.test.ts`: `truckBody(c, 0, 0)` is identity; B02-SH03 cab front at L 30 = −5.95 ± 0.01 and L 44 = −3.60 ± 0.01; a rider point and the deck point keep a constant distance at every B05-SH02 frame; B06-SH03 parked x 2.0 at L 45 and L 89.
- `proof-props.tsx`: `R30-truck-stop` (B02-SH03 camera `eye (−0.2, 0.4, 9.8), yaw −85, pitch 8, f 850, hy 1000`) at L 0, 30, 44, 46, 48, 53; `R30-truck-chase` (B05-SH01 truck-local camera) at L 0, 10, 20; `R30-truck-side` (B05-SH02 camera) at L 8, 11, 16, 72; `R30-truck-vantage` (B05-SH03 start camera) at L 0, 46, 93.
- `scripts/qa-sheet.sh out/edu30-T14/sheet.png --cols 6 --width 270 out/edu30-T14/*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| R30-truck-stop 44 | one small truck stopped close; dust overtaking by 53 | cab height 486 ± 25 px (SD03) |
| R30-truck-chase 0 / 10 | world tilted, gunner and tray still in frame | GUNNER-1 ≥ 480 px (sheet 497); rider px drift between frames ≤ 1 px |
| R30-truck-side 8 / 11 | barrel kicked toward the sky at the bump peak | muzzle 100–220 px higher at L 11 than at L 8 (r3) |
| R30-truck-vantage 0 | truck on the track beyond the fence | truck centre near (1019 ± 40, 898 ± 40) px |

## Result (Boss fills)
Commit: see `git log` on this worktree branch (T14 commit) · fix passes used: 0 · Sonnet medium, 20 Nov 2026 · proof sheet: store `projects/edu/EDU/previews/T14-sheet.png` (24 frames), `T14-chase-sheet.png`, `T14-hands-side-11.png`, per-frame `T14-stop-*`, `T14-chase-*`, `T14-side-*`, `T14-vantage-*` (local `out/edu30-T14/`, logs `out/logs/T14-*.log`).

**Built** (`src/painted/edu30/props.ts`, `proof-props.tsx`, `tests/edu30-props.test.ts`):
- `truckPoint`, `truckBody(centre, pitch, roll)` (identity at 0, 0; `paintTruckRig` passes `pitch * dir`, `roll * dir`), `invertBody`, `truckSetCam` (set camera for a truck-locked camera), `truckCam` (truck-local camera in world metres).
- `truckState(shot, L)`: every drive schedule of the table (B01-SH02, B02-SH03, B02-SH04, B05-SH01 with `bumpsB05Sh01`, B05-SH02, B05-SH03, B06-SH03 incl. time-lapse jumps, B06-SH04); returns `{centre, dir, pitch, roll, g2Elev, wheelTurn}` or null when the truck is absent.
- `paintTruckRig(p, c, o)`: one `{...c, body}` pass for truck, silhouettes / chase GUNNER-1 and G2 on the pedestal (post, `placeBuild` of the locked gun, then `paintLewisPanTicks` in the next slot); returns `{cam, anchors (lewisAnchors), muzzle (picture point), gunner}`. The muzzle is `lewisAnchors(...).muzzle`, 0.66 m from the pivot (rest 10 deg: T(0.08, 1.91, -0.26); 50 deg: y 2.31, tested).
- `truckDustPuffs` / `paintTruckDust(p, c, L, track, {part, truckAt})`; `part` 'far' / 'near' splits the cloud around the truck for painter's order.
- `paintTruck` got opt-in options (`hollow`, `inTray`, `inCab`, `wheelTurn`, `trayAt`); with none of them it draws exactly the locked look as before (LF01a path unchanged by construction).
- Proof entries `R30-truck-stop`, `-chase`, `-side`, `-vantage` as written (stub set: sky, ground quad, wheat-row lines).

**Tests** `node scripts/test.mjs tests/edu30-props.test.ts`: 17/17 pass (identity; cab front L 30 -5.95 and L 44 -3.60 ± 0.01; rider/deck/pivot distances constant at all 84 B05-SH02 frames; pitch keys 3, -2; G2 10 -> 50 -> 10 and muzzle y 2.31; B05-SH01 bump gaps 12-18, peak 1.5 x s; chase rider drift 0 px over 60 f; B06-SH03 parked 2.0 at L 45 and L 89, absent / present states; dust pure, radius and alpha, decay after the stop). `npx tsc`: no new errors (existing `three` / `hippo` errors from the shared node_modules). `npm test`: 301 pass, 19 fail, all environment (missing `three`, store), none in my files.

**Measured against the Proof table**

| Row | Number | Pass range | Result |
| --- | --- | --- | --- |
| R30-truck-stop 44 | front low (ground under the radiator) y 1225, centre x 542 (sheet 1223, 541: match); roof front edge y 785 (sheet 737); height **440** px | 486 ± 25 | **fail** (21 px short): see Q1 |
| R30-truck-chase 0 / 10 | GUNNER-1 **444** px (top to bottom, 452 to the hat crown); rider drift 0 px at L 0, 10, 20 (and 0..59); arm ratios r/l 1.000 on every still (worst 1.000 over L 0..59 step 3 and L 0..83 step 2) | ≥ 480; ≤ 1 px | **fail** on height (36 px short): see Q2; drift pass |
| R30-truck-side 8 / 11 | muzzle y 894.4 -> 738.2: **156.2 px** higher | 100-220 | pass |
| R30-truck-vantage 0 | truck centre (1019, 898) | 1019 ± 40, 898 ± 40 | pass |
| R30-truck-stop 53 | dust behind the rear wheels only (puff x -9.3 to -7.6, cab front -3.6) | dust overtaking the cab | **fail**: see Q3 |

Hand line: GUNNER-1 right mitten on the stock, left mitten on the grip (T11's `paintSeatedGunner` as is); thumb check: right: kit mitten, no thumb drawn, pending T36 (flat fist with thumb); left: same. Arm check: GUNNER-1 right: attached ok (viewed `T14-hands-side-11.png`), arm ratio <= 1.05 on all stills (1.000).

**Where I followed the ticket literally but a value could not be met (return to Film)**
- **Q1 cab height 486 ± 25 (SD03).** With centre = cab front - 2.6 and the locked truck (roof 2.12, 5.2 m), the stopped truck measures 440 px. The sheet's own two numbers (front low 1223 and roof 737) fit a truck whose leading edge stops about 0.4 m closer (reference a = 2.2: centre = front - 2.2 gives front low 1229, roof 739, height 490). Ask: change `centre = cab front - 2.6` to `- 2.2` (or the cab front to -3.2), or widen the row to 440 ± 25.
- **Q2 GUNNER-1 >= 480 px (sheet 497).** The camera, position T(-1.2, 1.1, 0) and depth (2.78 m, unit 396 px/m) match the sheet, but the built T11 figure is 1.12 m top to bottom (444 px), not the sheet's 1.25 m. B05-SH02 (f 950) gives 495 px. Ask: move the gunner about 0.16 m toward the lens, or change the row to >= 440.
- **Q3 dust "rolls past the stopped cab".** Velocity 0.3 x truck velocity decaying x0.92 per frame after the stop carries a puff at most about 0.1 m past the rear wheel (cab front is 4.1 m ahead of it). Ask: puff velocity factor (about 0.8 x the truck's would reach the cab) or an extra drift.

**Choices I had to make where the ticket was silent (flag if wrong)**
- Locked `paintTruck` wheels are discs in the plane x = const (axle along the truck), which show as discs from the front and edge-on from the side. The rig draws side wheels (axle along z, tyre width 0.18 m) through the new `wheelTurn` path; `paintTruck` without it keeps the old wheels (LF01a unchanged). Film may want the default fixed too.
- The rig always builds a hollow tray (floor, two side boards and tail and head boards 0.03 m thick, 1.1 to 1.45 m) instead of the locked solid slab, so riders and G2 show.
- Cab figures: MEREDITH (silhouettes mode) at T(1.6, y, -0.45), head y 1.90; in chase mode GUNNER-2 at z -0.45 and MEREDITH at z +0.45 (kept as written: the ticket's driver seat z -0.45 is the truck's left when the cab is +x, i.e. a left-hand-drive reading; the camera side is the truck's right). Gun cases: centre T(-0.05, 1.1, ±0.33). Silhouette: flat `#2b241c` shoulders box, head sphere r 0.105, brim r 0.2, crown.
- B05-SH01 bump gaps count from L -9 (first bump at L 6 for the default seed 14000), so a bump is under way at the L 10 proof frame; L 0 is level (the table's bump starts could not give a tilt at both L 0 and L 10). G2 returns to 10 deg at k + 9 (the table gives only 10 -> 25 -> 10); B05-SH02 pitch +3 / -2 and elevation 10/50/10 as written.
- B06-SH03: dir -1 from arrival (L 27..58 parked at 2.0 from L 45), dir +1 from the first jump state (L 59).
- Dust: puff centre y = 0.15 + 0.5 r; one disc per puff (`washAt`, plain). Dust frames: the chase frame ground is a stub ground quad (the world tilt is slight, 1.5 deg peaks).

## Result r4 (Boss fix pass, Sonnet medium, 20 Nov 2026)
Commit: see `git log` on branch `worktree-agent-a7bead1aa2128832a` (T14 r4 commit) · fix passes used: 1 (r4) · proof: store `projects/edu/EDU/previews/T14r4-sheet.png` (6 frames) and `T14r4-stop-44`, `-46`, `-48`, `-53`, `T14r4-chase-00`, `-10` (local `out/edu30-T14r4/`, log `out/logs/T14r4-stills.log`). The earlier `T14-*` store files are untouched.

**Built** (`props.ts`, `proof-props.tsx`, `tests/edu30-props.test.ts`): `DustOpts {carry, life}`, `truckDustFor(shot)` (B02-SH03 carry 0.9 / life 40, all else 0.3 / 30), `DUST_STOP_DECAY = 0.95` (was 0.92); `truckDustPuffs(L, track, seed, opts)` and `paintTruckDust(..., {…, carry, life})`; radius 0.3 -> 1.5 m over 30 f then held, alpha 0.40 -> 0 over `life`; the post-stop decay window widened from 40 to 120 f. Cab seats right-hand drive: silhouettes MEREDITH at T(1.6, head 1.90, +0.45); chase GUNNER-2 +0.45, MEREDITH -0.45. `R30-truck-stop` proof passes `truckDustFor('B02-SH03')`. The locked `paintTruck` default and every other schedule are unchanged.

**Tests** `node scripts/test.mjs tests/edu30-props.test.ts`: 18/18 (new: carry/life per schedule; closed form `d1 (1 - 0.95^k)/0.05` equals the frame-by-frame sum within 0.001 m for k 1..8 and the step ratio is 0.95; B05-SH01 puff trails the emitting wheel by >= 0.6 x the 10 f travel; puffs older than 30 f stay alive to 40 f). The cab-height (440) and chase drift (0 px) tests still pass.

| Row | Number | Pass | Result |
| --- | --- | --- | --- |
| D1 carry, B05-SH01 trails | both puffs 10 f after emission are behind the wheel by >= 0.6 x travel (tested) | test | pass |
| D2 decay closed form | sum vs closed form < 0.001 m, ratio 0.95 | test | pass |
| D3 R30-truck-stop 53 | 6 puffs with alpha >= 0.12 and centre x + radius >= -3.6 (e.g. x -3.79, r 1.38, alpha 0.13); at L 48 there are 3, at L 44 and 46 none; puff centre x range at 53: -7.51 to -3.74, cab front -3.60; the still shows dust across the lower cab | >= 3 | pass |
| D3 R30-truck-stop 44 | dust behind and beside the rear wheels (viewed `T14r4-stop-44.png`); no puff reaches the cab front | viewed | pass |
| C1 R30-truck-chase 0 | driver (z +0.45) head at screen (717, 858), the other cab head (z -0.45) at (541, 848): the driver is on the camera side; rider drift 0 px (test) | camera side; 0 px | pass |
| R30-truck-stop 44 height | 440 px (unchanged) | 440 ± 25 | pass |
| R30-truck-chase 0 / 10 GUNNER-1 | 444 px (unchanged) | >= 430 | pass |

Hand line: unchanged from r1 (T11 mitten fists, T36 pending); no hand code touched. Arm ratios and drift tests unchanged and passing.

**Could not follow / notes for Film:** none among the r4 values. The dust at L 44 and 46 is a large soft cloud around the whole rear of the truck (painter's order: far part behind the truck, near part in front) because carry 0.9 and radius growth are both big at the gag; Film's look check should confirm it still reads as a small truck stopped close before the cloud overtakes (`T14r4-sheet.png`). Checks: `npx tsc`: 22 error lines, none in the three files (environment `three` / `hippo`); `npm test` log `out/logs/T14r4-npm.log`.

## Result r5 (Boss fix pass, Sonnet medium, 20 Nov 2026)
Commit: see `git log` on this worktree branch (T14 r5 commit) · fix passes used: 2 (r4, r5), cap reached · proof: store `projects/edu/EDU/previews/T14r5-sheet.png` and `T14r5-stop-44`, `-46`, `-48`, `-53` (local `out/edu30-T14r5/`, logs `out/logs/T14r5-test.log`, `T14r5-stills.log`). Earlier store files untouched.

**Built** (`props.ts`, `tests/edu30-props.test.ts`; `proof-props.tsx` unchanged, it already passes `truckDustFor('B02-SH03')`): `DustOpts` gains `r0, r1, swell, stopAt`; `truckDustFor('B02-SH03')` = carry 0.9, life 40, r0 0.25, r1 0.8, swell 0.5, stopAt 44 (every other schedule r0 0.3, r1 1.5, swell 0 as built); radius = r0 + (r1 - r0) min(1, age/30) + swell x min(L - stopAt, 20)/20 for L > stopAt; `dustSoftDiscs(puff)` = discs k 1, 0.72, 0.45, each alpha 1 - (1 - a)^(1/3); `paintTruckDust` paints those three. Tests 19/19 (new: age-30 radius 0.80 at L 44, L 53 = moving + 0.5 x 9/20, no swell at L 44, discs and centre alpha 0.30 within 0.01, B05-SH01 radius <= 1.5).

| Row | Number | Pass | Result |
| --- | --- | --- | --- |
| E1 | radius at age 30 = 0.80 (test, tolerance 0.01) | 0.80 +- 0.01 | pass |
| E2 | L 53 = moving + 0.5 x 9/20; L 64 +0.5 (test) | as stated | pass |
| E3 | three plain discs, centre alpha = puff alpha (test); viewed at 270 px: soft, no hard-rim stack | viewed, +-0.01 | pass |
| E4 L 44 | dust alpha >= 0.12 covers **26.25 %** of the truck's projected 5.2 x 2.0 x 2.12 m screen box (x 279-789, y 702-1225; 20 x 20 grid, soft discs combined 1 - prod(1 - a)); r4 value 68.75 %; front-wheel contact visible (viewed) | <= 25 % | **fail by 1.25 points** |
| E4 L 46 | 35.00 % (r4 75.75 %) | <= 35 % | pass at the limit |
| E4 L 48 (extra) | 44.50 % (r4 81.50 %) | - | logged |
| E4 L 53 | 6 puffs alpha >= 0.12 with centre x + radius >= -3.6 (r4 6); dust across the lower cab (viewed) | >= 3 | pass |

Hand line: no hand code touched. **Could not follow:** E4 at L 44 (26.25 against 25 %) with E1-E3 exactly as written; no value was tuned beyond the rows. The box is the full projected truck box (including roof and tray air), so a tighter silhouette box gives a higher percentage; Film chooses: widen the row to <= 27 %, or give a smaller E1 start radius or lower alpha. The fix-pass cap is reached, so this goes to the user.

## r6 decision (Film, 2026-11-20, `EDU-EP30-TICKETS-R7`): look check of the r5 dust
Viewed: store `T14r5-sheet.png` (L 44, 46, 48, 53 at 270 px) and `T14r5-stop-44.png` downscaled.
- **L 44: pass on the picture.** The truck reads clearly as a small truck stopped close: roof, cab, bonnet line and both front wheels are clear, and dust sits only around the wheel hubs and below the bumper. The front-wheel ground contact shows. The soft three-disc puffs have no stack of hard rims. The 26.25 % is measured over the full projected box (5.2 × 2.0 × 2.12 m, x 279–789, y 702–1225), which includes the sky above the bonnet and the air beside the tray, so it overstates how much of the truck is covered; the 1.25 points lie in that air at wheel height.
- **L 46: 35.00 %, pass at the limit**; L 48: 44.5 % (logged); **L 53: the overtake reads** (6 puffs past x −3.6; dust across the lower cab), and the cloud stays soft.
- **Ruling (Film):** accept r5 as built. Row E4 L 44 becomes **≤ 27 %** (r5 measured 26.25 %), and the measuring box stays as built. No value changes, no code change.
- **Who decides:** Film recommends acceptance. R6 said "a further miss goes to the user", and the [fix-pass cap](../../../../.agents/skills/plate-tickets/SKILL.md#coordinator-dispatch) gives the user the choice after two passes, so the coordinator asks **Q-R7-1** (index) with `T14r5-stop-44.png`: (a) accept with the row at ≤ 27 % (recommended), or (b) a third pass on Opus (E1 start radius 0.25 → 0.20 m). Until the answer comes, T14 counts as done for dispatch: T21 and T29 read the rig and the other schedules, which neither answer touches.
- Result commit for r5: `c8ae269`.

