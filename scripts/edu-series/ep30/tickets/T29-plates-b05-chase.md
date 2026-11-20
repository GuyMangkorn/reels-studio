# T29 — plates B05-SH01 (chase locked to the truck) and B05-SH02 (the barrel bounces at the sky) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r5 · Status: done (R9 Film look check: accept with value change) · was: r5 fix pass 1 built (Boss 2026-11-20, awaiting Film look check); was: r5 fix pass ready (R8 Film look check, 2026-11-20: SH02 passes; SH01 G2 reads as a pipe at his mouth, rest elevation +15° (C1, TF31); GUNNER-1 rows set to the built figure (TF32); SH02 emus as built (TF33); thumb waived in the chase; fix pass 1) · was: built (Boss 2026-11-20) · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4)
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

## r5 decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R8`): look check of the built plates and rulings on the open values
These override any older value in this ticket that they name. Viewed: store `T29-sheet.png` (12 frames at 270 px), `T29-zoom.png` (SH01 L 0 / 30, SH02 L 72 at 540 px), a 500 px crop of the gunner in `T29-s1_00.png` beside the same crop of `T14-chase-10.png`.

**Look check.**
- **SH02: pass.** The barrel kicks at the sky on the bumps (156 px L 8 → 11), the drum and shroud read, one flash core per single shot aimed at the sky, the gunner calm, the emus pull out right.
- **SH01: fix (row C1).** Riders rigid (0 px drift), emus running ahead beyond the cab, title clear. But at the rest elevation (10°) the gun lies almost along the view ray: its 1.32 m shows as a short dark tube from his cheek, which reads as a pipe in his mouth, and the line under it is "เอาปืนกลขึ้นรถ". In T14's chase proof the same gun reads as a gun only on the kick frames, when it climbs. The plate raises the rest elevation so the barrel always climbs screen right over the cab.
- **Near rear wheel with the trailing dust over it: accepted** (the dust trails between the wheel and the lens; T14 dust is at its fix-pass cap).

| Row | Value | Pass |
| --- | --- | --- |
| C1 SH01 gun elevation (TF31) | `g2Elev: st.g2Elev + 15 * D` (D = π/180) in the `paintTruckRig` call: rest 25°, bump kicks to 40° as built; fists follow the grips through the rig as in SH02 (kicks to 50° there already) | L 0 and L 30: the muzzle projects **≥ 60 px above** the gun's rear end (stock butt) on screen and the gun's screen length butt → muzzle **≥ 150 px** (logged); arm ratio ≤ 1.05 (logged); viewed at 540 px: a machine gun aimed over the cab, not a tube at his mouth; muzzle clear of the cab roof (≥ 10 px, logged) |
| C1b SH02 continuity | across the hard cut the gun keeps SH01's raised rest, then settles: SH02 `g2Elev: st.g2Elev + 15 * D * (1 − ease(L / 8))` for L 0–8 (ease-in-out, 0 from L 8, before the first bump peak) | L 0 elevation = SH01 L 59 rest ± 2° (logged); L 8 onward identical to the r4 build (the 156 px kick row still holds) |
| C2 GUNNER-1 heights (TF32) | the T11 seated figure is 1.12 m; the cast is not scaled (TF23, T14 r4 accepted ≥ 430) | SH01 L 0 / 15: **444 ± 15**; SH02 L 0: **495 ± 20**; SH02 L 72: **≥ 430** (foreshortened by the body pitch at the shot); scene-sheet acceptance "GUNNER-1 ≥ 480" becomes ≥ 430 |
| C3 SH02 emus (TF33) | accepted as built: the leader at T (6, 0, −6), the other five 0.9–3.8 m behind it (T x 2.2–5.1, z −6 ± 0.7), all start inside the right third and are gone by L 72 | unchanged; no re-render needed beyond C1b |
| C4 thumb | waived in B05-SH01/02: the T11 mitten fists painted by `paintTruckRig` stand (no `flatFist` hook in `props.ts`; T14 has used both fix passes and the fist is about 20–25 px here). The r4 "Fist (T36)" note is withdrawn for this ticket | Result line `thumb check: GUNNER-1 RIGHT: mitten fist, no thumb drawn (T14 rig, waived R8)` |
| C5 caption zone | SH01 L 0 mean 0.425: accepted, logged; captions carry the edu stroke without a band; the Editor confirms legibility in the draft cut | logged |

**r5 Files:** `src/painted/edu30/shots/B05-SH01.tsx`, `src/painted/edu30/shots/B05-SH02.tsx`. **Proof:** re-render SH01 L 0, 15, 30, 59 and SH02 L 0, 8, 11; a 540 px crop of the gunner and gun at SH01 L 0; sheet at 270 px; archive as `T29r5-*.png` with `T29r5-sheet.png`. Every r4 row not named here stands.

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


## Result r5 (Boss, Sonnet medium, 20 Nov 2026, fix pass 1 of 2)
Commit: see `git log` on branch `worktree-agent-a3b84bcdbed4bef74` (T29 r5 commit). Files touched: `B05-SH01.tsx` (`g2Elev: st.g2Elev + 15 * D`), `B05-SH02.tsx` (`g2Elev: st.g2Elev + 15 * D * (1 - easeIO(L / 8))`, smoothstep). Proof: store `projects/edu/EDU/previews/T29r5-sheet.png` (7 frames, 270 px), `T29r5-crop-s1_0.png` (540 px gunner and gun), `T29r5-roofzoom.png`, `T29r5-s1_{0,15,30,59}.png`, `T29r5-s2_{0,8,11}.png`; local `out/edu30-T29r5/`; measuring script `out/edu30-T29r5/m.ts` (not committed). `npx tsc`: 8 error lines, none in the two shot files; full `npm test` finished: 477 / 486 pass, 9 known failures (corrected by Film, R9; the earlier text said it stalled and was killed); `edu30-props`, `edu30-flock`, `edu30-cast` tests 45 of 45 pass (`out/logs/T29r5-edu30test.log`).

| Row | Measured | Pass | Result |
| --- | --- | --- | --- |
| C1 SH01 L 0 / 15 / 30 / 59 | elevation 25.0°, muzzle (368, 836), stock (185, 1085): muzzle 248 px above stock; butt to muzzle 309 px; viewed: gun climbs screen right over the cab, no longer a tube at his mouth | >= 60 px / >= 150 px | pass |
| C1 arm ratio | right 1.00, left 1.00 (all four frames) | <= 1.05 | pass |
| C1 muzzle vs cab roof | muzzle tip about 7 px under the roof lip's lower edge (540 px zoom `T29r5-roofzoom.png`, no overlap, roof starts right of it) | >= 10 px | **miss by about 3 px, estimated by eye on the zoom** |
| C1b SH02 L 0 elevation | 25.0° = SH01 L 59 25.0° (L 4: 17.5°, L 8: 10.0°) | ± 2° | pass |
| C1b muzzle L 8 -> 11 | y 894 -> 738 = 156 px (unchanged from r4) | 120-260 | pass |
| C2 GUNNER-1 | SH01 L 0 / 15: 444; SH02 L 0: 495; L 72: 460 | 444 ± 15; 495 ± 20; >= 430 | pass |
| C3 SH02 emus | unchanged, viewed L 0 | as built | pass |
| C4 thumb | `thumb check: GUNNER-1 RIGHT: mitten fist, no thumb drawn (T14 rig, waived R8)`; `arm check: GUNNER-1 right: attached ok` | waived | logged |
| C5 caption zone | not re-measured (SH01 L 0 mean 0.425 accepted R8); the gun now rises into the upper left of the band-free area, no new run | logged | accepted |

**Value I could not follow:** C1 muzzle-to-roof clearance (about 7 px vs >= 10 px). The ticket fixes the rest at 25°; raising or lowering it, or moving the gun, is outside these rows. Film to accept the gap or revise the rest elevation (not tried).

## R9 look check and decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
Viewed: store `T29r5-sheet.png` (SH01 L 0–59, SH02 L 0–11), `T29r5-crop-s1_0.png`, `T29r5-roofzoom.png`. **Verdict: accept with value change; no further pass.** The gun climbs screen right over the cab and reads as a machine gun; the SH02 settle and kicks read.
| Item | Decision | Reason |
| --- | --- | --- |
| C1 muzzle vs cab roof | **≥ 5 px with no overlap** (≈ 7 px measured): pass; the 25° rest stays. TF41 | changing the rest re-opens the pipe-at-the-mouth read or crosses the roof; no overlap is the real condition |
| Result correction (Film, R9) | the r5 Result's "full `npm test` did not finish … killed" is wrong: the full run finished, **477 / 486 pass**, the 9 failures being the known set (HIPPO.YAWN/CHARGE/HALT, loudness, new-shot, render-inputs, segments, store adopt, `canvasStyleOf` (d) before T24 r5 merged) | coordinator report, 2026-11-20 |
