# T29 — plates B05-SH01 (chase locked to the truck) and B05-SH02 (the barrel bounces at the sky) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: built (Film look check pending) · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4)
Class: set (plates) · Hard: yes (rider arms on a bouncing body, running emus)
Blocked by: T03, T04 (r4), T06 (r4), T08, T09, T11, T14, T36 · Consumers: B05-SH01, B05-SH02 (global 1150–1293)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b05.md](../short/scene-sheets/b05.md) B05-SH01 and B05-SH02 (authoritative); brief [VD30-08](../short/film-brief.md#scene-decisions).

## Build
Replace the two stub shot files with the plates.
Files: `src/painted/edu30/shots/B05-SH01.tsx`, `src/painted/edu30/shots/B05-SH02.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space P, light m 0, eaten 0.6, stubble 0, newsreel warm strength 1; ruts on | T09 schedule |
| B05-SH01 camera | truck-local eye T (−3.0, 2.4, 2.2), yaw 60, pitch −6, f 1100, hy 860, rigid with the truck body (T14 "camera locked to the truck") | b05 B05-SH01 Camera |
| B05-SH01 truck | T14 B05-SH01 drive + seeded bumps, riders `'chase'`, gear `'pedestal'`, `paintTruckDust` | T14 |
| B05-SH01 emus | 14 runners ahead along the track (seed 36400): nearest at T (6, 0, −1) at L 0, spread to T (14, 0, −2) and beyond, each running +x at 5.5–6.5 m/s seeded (run phase from speed, T06 contact), so they hold their distance ahead of the 6.1 m/s truck; dust puff per footfall | b05 B05-SH01 Staging |
| B05-SH01 title | T02 "แผน 3" via the adapter | T02 |
| B05-SH02 camera | truck-local eye T (−0.7, 2.0, 2.1), yaw 0, pitch 0, f 950, hy 860, following the truck's travel but not its pitch; the eye eases 0.3 m back along +z over L 60–83 | b05 B05-SH02 Camera |
| B05-SH02 truck | T14 B05-SH02 drive (5 → 4 m/s), bumps at L 8, 24, 38, 52, 66 with the G2 kick; two single shots at L 72 and 79 (T04, halo 160 px, aimed at the sky) | T14; T04 |
| B05-SH02 emus | 6 runners at T (6, 0, −6) at L 0 moving +x at 5.5 m/s relative to the ground (pulling away from the slowing truck), crossing the right third and out of frame right by L 70 | b05 B05-SH02 Staging |
| Faces | GUNNER-1 `neutral` in both; cab silhouettes | b05 |
| Probe leads | B05-SH01 GUNNER-1 L 0 and 59; B05-SH02 GUNNER-1 L 0, G2 muzzle at L 8 and 11 | T03 probe |

**Judgment for the builder (Hard).** The ground does it: the world bounces around a calm gunner whose fists never leave G2, and the barrel kicks at the sky on each bump. Nobody fumbles. The emus run easily ahead and pull away.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17). B05-SH02 G2 kick: see T14 r3 (peak y ≈ 2.31).

## r4 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R4`)
These override any older value in this ticket that they name.
- **Single shots (T04 r4).** Per-circle α_c for the B05-SH02 puffs.
- **Fist (T36).** GUNNER-1 right profile on G2: `flatFist` on the near RIGHT fist (thumb screen right); far LEFT mostly hidden.

## Proof
- Stills (`out/edu30-T29/`): SH01 L 0, 15, 30, 59; SH02 L 0, 8, 11, 24, 27, 72, 79, 83.
- `scripts/qa-sheet.sh out/edu30-T29/sheet.png --cols 6 --width 270 out/edu30-T29/s*.png`; `measure-shots.ts B05-SH01 0,59` and `B05-SH02 0`; clean SH01 L 0 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH01 L 0 / 15 | tray, G2 and gunner steady while the world tilts; emus ahead | GUNNER-1 497 ± 25 px; rider px drift between frames ≤ 1 px |
| SH02 L 8 / 11 | barrel kicked toward the sky at the bump peak | muzzle 120–260 px higher at L 11 than at L 8 |
| SH02 L 72 | single flash at the muzzle, pointed at the sky, no strike | one flash core; GUNNER-1 565 ± 30 px |

## Result (Boss fills)
Commit: see `git log` on this worktree branch (T29 commit) · fix passes used: 0 · Sonnet medium, 20 Nov 2026 · proof: store `projects/edu/EDU/previews/T29-sheet.png` (12 frames, 270 px), `T29-zoom.png` (SH01 L 0 and 30, SH02 L 72 at 540 px) and per-frame `T29-s1_<L>.png`, `T29-s2_<L>.png` (local `out/edu30-T29/`, logs `out/logs/T29-*.log`). `npx tsc`: 22 error lines, none in the two shot files (environment `three` / `hippo`).

**Built** (`B05-SH01.tsx`, `B05-SH02.tsx`; no other file): space P, light 0, eaten 0.6, stubble 0 through `paintPaddockScene`; truck rig through `paintTruckRig` with `riders 'chase'`, `gear 'pedestal'` and `truckState` / `truckDustFor` / `paintTruckDust`. SH01: the world (set, dust, emus) paints through `truckSetCam` (body-tilted), the rig through the level truck camera, so riders never move; 14 runners (seed 36400) at T x 6 to about 16, z -0.6 to -2.6, 5.5-6.5 m/s, phase `gaitPhase(f, v, run stride)`, `paintPuffs` + `footEvents` per footfall, wings 0.15 flap mix as T08's burst. SH02: level `truckCam` that eases 0.3 m back over L 60-83, rig pitched by `truckState`, two single flashes `paintMuzzleFlash` (T04 `B05_SH02`: rounds 72 / 79, halo 160) along `lewisAnchors().dir`, no smoke, no strike; 6 runners (seed 36450) at 5.5 m/s. Title "แผน 3" comes from the adapter (T02). Faces: kit `neutral`; the T14 rig paints the T11 mitten fists (T36 `flatFist` is not wired into `paintTruckRig`, see below).

**Measured against the Proof table** (`measure-shots.ts`, px)

| Row | Number | Pass range | Result |
| --- | --- | --- | --- |
| SH01 L 0 / 15 GUNNER-1 height | 444 / 444 | 497 ± 25 | **fail** (28 px short) |
| SH01 rider drift | head x 198 at L 0, 15, 30, 45, 59: 0 px | <= 1 px | pass |
| SH01 L 59 GUNNER-1 | 444 | probe lead (no range) | measured |
| SH02 L 8 -> 11 muzzle | y 894 -> 738: 156 px higher | 120-260 | pass |
| SH02 L 72 flash | one white core + halation at the muzzle, pointed at the sky, no strike (viewed `T29-s2_72.png`); L 79 one star flash | one core | pass |
| SH02 L 72 GUNNER-1 | 460 (L 0 and 8: 495; L 79: 438) | 565 ± 30 | **fail** |
| SH01 L 0 caption zone (clean frame) | mean 0.425, p95 0.802, `pass: false` at the script defaults | no range in the ticket | measured |

**Values I could not follow (return to Film)**
- **GUNNER-1 heights.** The camera and seat position match the sheet, but the T11 seated figure is 1.12 m top to bottom, not 1.25 m (T14 Q2). SH01 gives 444 px vs 497 ± 25, SH02 495 at L 0 / 460 at the L 72 shot (the figure is foreshortened by the pitch there) vs 565 ± 30. The cast is not scaled and the position is fixed by the ticket; a change belongs in T11 or the rows. T14 r4 already settled the same figure at >= 430.
- **SH02 emus.** The ticket puts all 6 at T (6, 0, -6) at L 0, which projects beyond the right edge (x 1326, as the sheet says) and they only pull away, so none could "cross the right third" into frame. I made the leader the T (6, 0, -6) bird and put the others 0.9-3.8 m behind it (T x 2.2-5.1, z -6 +/- 0.7): they start inside the right third and none remain at L 72 (viewed). Flip back if Film wants all six outside the frame at L 0.
- **SH01 nearest emu.** The sheet's nearest emu (742, 850) falls behind the cab (roof from x 625); only the far runners show right of the cab, as in the sheet geometry.
- **Caption zone.** The SH01 L 0 frame fails the default caption-zone numbers (mean 0.425): the truck cab and dark road fill the band. No pass range in the ticket; Film to judge.
- **Thumb.** No thumb drawn (T11 mitten). T36 `flatFist` on the near right fist (r4 note) needs a `paintTruckRig` hook in `props.ts` (T14's file, outside this ticket's Files): ask Film for a one-line T14 change if the thumb must show in the chase.

