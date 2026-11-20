# T08 — flock motion in the paddock: buffet peck sync, strolling extras, the field of rising heads, scatter, six-group burst, the split by halves, fence birds, the slow-motion line
Deliverable: EDU-EP30-SHORT · Revision: r5 · Status: r5 fix pass ready (R7 Film look check of r4: buffet, EMU1, heads field, scatter and fence pass; halves speed, burst grouping and slow-line cycle are revised in rows H1–H3, B1–B4 and S1–S3; this is fix pass 1) · was: r4 built, awaits Film look check (was: ready, dispatchable (R6: T07 r5 head API merged at `707d757`; runs in parallel with T37) · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R6))
Class: movement · Hard: yes (animal movement)
Blocked by: T35 (same file `flock.ts`, first), T07 (uses T06 poses, `mixEmuPose`, `gaitAdvance` and T07 `emuLensYaw`, `nod`) · Consumers: B01-SH02, B02-SH01, B02-SH06, B03-SH01, B03-SH02, B03-SH03 (the group), B05-SH03, B05-SH04, B06-SH01, B06-SH03, B06-SH04; T16
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks, clocks); [flock.ts](../../../../src/painted/edu30/flock.ts) (`EmuMember`, `flockIn`, one build per pose key, `LOD_PX`); the shot blocks named in each row.

## Build
Pure functions in `src/painted/edu30/flock.ts` that return `EmuMember[]` for a shot-local frame (no state between frames); plates only place the result. One build per quantised pose key (walk/run phase quantised to 1/16 cycle) keeps a 60-bird frame cheap. EMU-HERO, where it is a member, is `hero: true`, seed 36000.
Files: `src/painted/edu30/flock.ts`, `src/painted/edu30/proof-flock.tsx` (adds `FL30-*` compositions), `tests/edu30-flock.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Walk phase | phase(L) = phase0 + v × L / (30 × `gaitAdvance(stride)`) (T06); stance foot static | T06 contact rule |
| `paddockExtras(L)` (B01-SH02) | EMU1 (6.2, 0, −27.1) → (4.6, 0, −27.1) heading −x, stride so the advance per cycle is 0.80 m and the cycle 30 f: contacts left L 4, 34, right L 19, 49 (SFX-B01-SH02-2); peck blend L 30–40 over the walking legs (down 30–34, hold 34–36, up 36–40); EMU2–5 at (5.0, 0, −24.8), (3.6, 0, −25.6), (7.8, 0, −23.5), (2.4, 0, −28.0), seeds 36101–36104, 0.6–0.9 m/s seeded, headings −x ± 20°; no head turns toward the truck | b01 B01-SH02 |
| `buffetRow(L)` (B02-SH01) | six birds at (−3.0 + 0.8 i, 0, −28.0 − 1.6 i), i 0…5, facing −x; peck cycle 15 f (down f 0–5 ease-in-out stand → peck, hold 5–8, up 8–15), seeded phase 0–14 f per bird until L 125; L 125–128 all mix to stand, hold to 131; L 131–135 all down; full peck exactly at **L 135** (global 335); hold 135–139; up 139–145; stand after; feet planted | b02 B02-SH01 |
| `headsField(L)` (B02-SH06) | 36 members seeded (seed 36200) in x −0.5..+6.0, z −11..−5, min spacing 0.7 m; excluded: a 1.2 m circle round EMU-HERO (1.0, −8.0) and a 0.9 m band either side of the sightline from the end camera (2.4, −12.2) to the crew centre (0.05, 0.8) in the xz plane (the three men stay unblocked). Pose: **sitting in the wheat** (emus sit on their hocks): bob −0.55 (back top ≈ 0.45 m, under the 0.85 m wheat), pads under the body; head joint y 0.60 (low) → 1.60 (up). Groups g 0…5 by z band, nearest the camera first (g0 z −11..−10 … g5 z −6..−5), rising at local **52, 55, 58, 61, 64, 67** over 6 f each, ease-out. Heading: the direction to the crew ± 90° (seeded side), so each head shows a clean side profile to the lens with its near eye turned to the crew | b02 B02-SH06 (heads squared to the lens, eyes to the crew; necks emerge from the wheat) |
| `scatter(L)` (B03-SH01) | F1 = `flockIn(31000, 40, [−30, 30], [−60, −30])` around (0, 0, −45), stand/peck before L 4; startle at L 4 + s, s seeded 0–2 (nearest first) (T06 startle motion); bunch L 10–38: each bird walks toward its clump centre so the band closes by 35 %, walk phase from speed; bolt at L 40 + d, d seeded 0–6: run, speed 0 → 6 m/s over 6 f. Four clumps by x quartile: two run toward −x (screen left), two toward +x; each clump heading = its axis ± seeded 0–25°, one clump angled away from the lens, one toward it | b03 B03-SH01 Flock F1 row; VD30-11 Birds |
| `burst(L)` (B03-SH02) | the same 40 continuing from `scatter(71)`; six groups by nearest of the headings 15° + 60° k (k 0…5, seeded per bird), speed U(6, 8) m/s, all past the frame edges by L 45 at the sheet camera; dust trail = 3 `paintPlume` puffs behind each group per frame. EMU-HERO's group (11 birds incl. the hero) runs toward (12, 0, −32), the B03-SH03 mark (Film fix: the sheet says "+x/−z"; the B03-SH03 mark is +x/+z of the flock centre and wins) | b03 B03-SH02, B03-SH03 |
| `halves(L)` (B03-SH03) | 10 birds bunched behind EMU-HERO (12.0, 0, −32.0), facing +z, stand idle, in two loose rows at z −33.5 and −35.0 (±0.4 seeded): left half 5 birds x 10.4..11.9, right half 5 birds x 12.1..13.6 (seed 36300). Left half: turn to heading −x over 3 f from L 7 + d (d seeded 0–3), run 0 → 5.5 m/s over 4 f, exit frame left by L 22 (x ≤ 6.0). Right half: the same toward +x from L 23 + d, exit right by L 38 (x ≥ 18.0). One dust puff per footfall (`paintPlume`, 0.25 m); feet touch the dirt (no slide). Nobody runs through the hero | b03 B03-SH03 Staging |
| `fenceBirds(state)` (B05-SH03, B05-SH04, B06-SH03, B06-SH04) | contact rule (Film fix): every body front (the build's max creature x at stand, measured once) stays ≥ 0.08 m behind the wire plane z 6.0, so `at.z ≤ 5.92 − front`. Front row at that z: F2 x −1.4, F3 x 0.5, F4 x 1.4 (+ added x 1.9 and x −1.9); back row 0.5 m behind it: F5 x 0.95 (+ added x −1.0 and x 0.0); EMU-HERO keeps (−0.5, 0, 5.3) if it passes the rule, else the rule's z. Five birds = HERO, F2–F5; added at B06-SH03 local 66 (x −1.0), 74 (x 1.9), 82 (x −1.9), 90 (x 0.0) → nine. All face +z, stand; ambient heads follow the truck: `headYaw` toward the truck × 0.3, clamped ±0.3 rad (not the hero in B06-SH03, which is frozen in every jump) | b05 B05-SH03/SH04, b06 B06-SH03/SH04; fence z 6.0 |
| `slowLine(L)` (B06-SH01) | five birds abreast at x −4.6, −3.0, −1.4 (EMU-HERO), 0.6, 2.2, z −4.6 at L 0 → −3.8 at L 109 (0.22 m/s), walk at 40 % cycle speed with phase from that speed (stance static); EMU-HERO contacts at L 12, 54, **96** (global 1530, "ถัง"); the others offset 7, 19, 31, 41 f; at L 109 EMU-HERO stops with both feet down; dust puff at each footfall | b06 B06-SH01 |
| No bird hit | no pose or helper ever lays a bird down or tumbles it | brief CAT02 |
| Render cost | log the time of one 60-bird frame (`scatter(44)` + far mass) at half size | brief technical handoff (Loading) |

**Open-question dependency (Q8).** The scatter frames are tied to round 1 (local 2) and L06's "ยิงใส่ฝูง" (local 40); the alternative moves round 1, and `scatter` then takes its startle frame from round 1 + 2.

**Judgment for the builder (Hard).** Planted feet are the test: on dirt every stance foot holds its world position (slip ≤ 0.02 m) and a stopped bird has both feet down. In wheat feet may be hidden by the near stalks but must not slide. The buffet dip and the halves' departures must read as comic precision: the same frame for every bird in the dip, one clean peel-off per half. The heads field must read as many heads popping up, never as floating heads: each neck enters the wheat.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Blocked by T35 (r3).** T35 changes `flock.ts` (`EmuMember.air`, ground shadow) first; build on it. Startle uses the T06 r3 wing 0.15.

## r4 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R6`)
These override any older value in this ticket that they name.
- **T07 r5 API.** Use `emuLensYaw` (clamp ±1.2 stands), `emuLookTurn`, `nodDepth` / `emuNod`, `blinkLid`, `talkBeak` as exported in `emu.ts`; do not edit `emu.ts` (T07 r6 and T15 write it).
- **Runs beside T37.** T37 changes the ring frame in `survival/beast.ts`, so bent necks (startle, duck in the scatter and burst) still show the T06 N4 pinch or slits in this ticket's stills: ignore those seams; Film judges them on T37's proof. `tests/edu30-flock.test.ts` checks positions, headings, pose values and keys only, **no stroke or pixel hash of a painted emu** (it would break when T37 merges).

## r5 decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R7`): look check of r4 and rulings on the Result notes
These override any older value in this ticket that they name. Viewed: store `T08-sheet.png` (18 frames at 270 px), and `T08-halves-{06,14,30}`, `T08-burst-{20,45}` and `T08-heads-{58,74}` downscaled to 360–540 px.

**Look check of r4.**
- **Buffet 130/135: pass.** All six dip on the same frame and the row reads as comic precision.
- **EMU1 / extras: pass** on the numbers (contacts and slip 0.0000 m).
- **Heads field 48/58/74: pass for timing and placement.** The groups rise in order, the crew is unblocked and the heads read as many necks popping up. Proof-only artefacts accepted: the sitting bodies show as dark ovals above the stalks, and at L 48 EMU-HERO's legs show, because the proof overpaints wheat per band. Plate T22 interleaves them (T22 r7 notes). `lod: 'far'` for the 36 field members is accepted in this proof: the far heads still show an eye and a beak dot.
- **Scatter 3/6/44/60: pass** on the numbers (4 clumps, 13.9 m apart). The birds are 20–40 px at the sheet camera, as placed; T24 judges the read in the plate.
- **Fence 0: pass** (wire over every bird, body front ≤ z 5.92). The proof uses the five birds of B05-SH04, which is that shot's real count. The nine-bird near-detail frame (191 s) is a render-cost note for T32 (T32 r7 notes).
- **Halves 6/14/30: fix.** At L 30 one left-half bird is still at the left edge while the right half leaves. The two peel-offs overlap, so the "one clean peel-off per half" beat is lost (rows H1–H3).
- **Burst 20/45: fix.** The six groups do not read: the burst groups are formed by heading snap from birds already spread across the four scatter clumps, so at 270 px the frame shows one spray of dots, not a firework of six groups. Small dark silhouettes also fill the far paddock (rows B1–B4).
- **Slow line 0/96: pass for framing; fix the cycle** (rows S1–S3).

**Ruling on Result note 1, halves exit (H1–H3).** The sheet's two x marks and 5.5 m/s cannot both hold. The beat is two clean exits, so the speed gives way.

| Row | Value | Pass |
| --- | --- | --- |
| H1 speed | run **0 → 12 m/s over 3 f**, at the same time as the 3 f turn to ±x, from L 7 + d (left) and L 23 + d (right), d seeded 0–3 as built; run phase exact (named walkers), T06 run gait, one `paintPlume` 0.25 m puff per footfall | test: speed 12.0 at start + 3 f; stance slip ≤ 0.02 m |
| H2 exit, screen | at the B03-SH03 camera of that frame (start → end camera, ease-in-out as in the sheet), every **left-half** body's screen bbox is entirely at x < 0 by **L 24**, and every **right-half** body's is entirely at x > 1080 by **L 40** | logged per bird: exit frame; max ≤ 24 / ≤ 40 |
| H3 overlap | no left-half body pixel on screen after L 24, when the right half has barely started its turn | follows from H2 |

The sheet marks "x ≈ 6.0 / 18.0" and "5.5 m/s" are replaced (TF24). The sound cues (patter 818 and 834 = local 7 and 23) stay, because they mark the start of each run.

**Ruling on Result notes 2 and 5, burst (B1–B4).** At 6–8 m/s and this camera (about 39 m half-width at the flock), no group can leave the frame by L 45, and the sheet's real need is "six distinct groups read at 270 px". The cut from the low B03-SH01 camera to the top shot allows a fresh start.

| Row | Value | Pass |
| --- | --- | --- |
| B1 start | `burst(L)` no longer continues from `scatter(71)`. At L 0 the 40 birds stand in **six tight groups**: group 0 = EMU-HERO (seed 36000) + 10 birds; groups 1–5 = 6, 6, 6, 6, 5 birds (the scatter seeds in order). Group centres = (0, 0, −45) + **8 m** along each group heading; members seeded inside a **2.5 m** disc round their centre, min spacing 0.7 m | test: every member ≤ 2.5 m from its group centre at L 0 |
| B2 headings | group 0 heads toward (12, 0, −32) (the B03-SH03 mark, TF03); groups 1–5 at group 0's heading + 60° k (k 1…5); each bird ± 8° seeded about its group heading; speed U(6, 8) m/s from L 0 (run, phase quantised as now) | test: group 0 heading = direction to (12, 0, −32) ± 0.01 rad |
| B3 read | the six groups read as six separate clusters moving outward | at L 20 and 45: pairwise group-centroid distance ≥ 8 m (logged); viewed at 270 px; flock centre at L 0 on screen (540 ± 60, 400 ± 60) (sheet Projection) |
| B4 only the 40 | `FL30-burst` and B03-SH02 paint the 40 burst birds and their dust only: no far mass and no extra distant silhouettes (if the small dark marks across the far paddock in the r4 frames are birds, they go) | count of painted emu members = 40 (logged) |

No group needs to leave the frame: the sheet's "crossing the frame edges by local 45" and its exit state "groups gone through the edges" become "six groups spreading out, the hero group heading for the B03-SH03 mark" (TF25). The B03-SH01 → SH02 continuity is the count (40) and the hero group, not the clump positions.

**Ruling on Result note 3, slow-line cycle (S1–S3).** The "40 % cycle speed" means a slow-motion walk with normal-looking steps, not tiny steps. The hero's contacts L 12, 54, 96 are **alternate feet**, not one foot per cycle.

| Row | Value | Pass |
| --- | --- | --- |
| S1 cycle | walk cycle **84 f** for all five (`SLOW_PERIOD` 42 → 84; about 36 % of the 30 f walk, the closest to 40 % that keeps the "ถัง" contact on L 96); hero contacts L 12, 54, 96 alternate feet; the others keep their first-contact offsets 7, 19, 31, 41 | test: hero foot contacts at L 12, 54, 96, alternating |
| S2 stride | advance per cycle = 0.22 × 84 / 30 = **0.616 m**, stride = `strideForAdvance(0.616)` (≈ 0.37); speed 0.22 m/s unchanged | test; slip ≤ 0.02 m |
| S3 stop | EMU-HERO's pose and position **freeze at L 100**, inside the double support that follows the L 96 contact; both feet down L 100–109; z ≈ −3.87 (the sheet's −3.8 at L 109 is accepted as −3.87, TF26); the r4 swing compression L 100–109 is removed | test: both feet on the ground L 100–109, hero position constant |

**Ruling on Result note 4, crowd phase quantisation.** Accepted. Crowd members in `scatter` and `burst` keep the 1/16-cycle quantisation: they are 20–40 px (scatter) and smaller (burst top shot), so a 0.06 m slip is about 1 px. Named walkers keep exact phase. Add a logged test row: max stance slip in screen px for `scatter` (B03-SH01 camera) and `burst` (B03-SH02 camera) over L 40–60 / 0–30, **pass ≤ 1.5 px**. Any later plate that shows a quantised bird with a lead height ≥ 80 px uses exact phase for it.

**Result note 5, hero in `halves`:** accepted. `halves` returns the 10 birds and the plate (T25) paints EMU-HERO with the T15 mime.

**r5 Files:** `src/painted/edu30/flock.ts`, `src/painted/edu30/proof-flock.tsx` (only if a proof call changes), `tests/edu30-flock.test.ts`. **Proof:** re-render `FL30-halves` L 6, 14, 22, 24, 30, 40; `FL30-burst` L 0, 20, 45; `FL30-slow` L 0, 54, 96, 105; a qa-sheet at 270 px; archive as `T08r5-*.png` with `T08r5-sheet.png`. Every other r4 frame and test stands (buffet, EMU1, heads, scatter, fence unchanged: their tests must still pass).

## Proof
- `node scripts/test.mjs tests/edu30-flock.test.ts`: `buffetRow(135)` all six at full peck, none fully down at 134 or 140; `headsField` keeps every member outside the sightline band; `fenceBirds` bodies behind the wire; stance-foot slip ≤ 0.02 m over 30 f for EMU1; frame L alone equals frame L after 0…L.
- `proof-flock.tsx` compositions on the sheet cameras: `FL30-buffet` (B02-SH01 end camera) L 130, 135; `FL30-heads` (B02-SH06 camera) L 48, 58, 74; `FL30-scatter` (B03-SH01 camera) L 3, 6, 44, 60; `FL30-halves` (B03-SH03 camera) L 6, 14, 30; `FL30-fence` (B05-SH04 camera) L 0; `FL30-slow` (B06-SH01 camera) L 0, 96. `scripts/qa-sheet.sh out/edu30-T08/sheet.png --cols 5 --width 270 out/edu30-T08/*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| FL30-buffet 135 | six heads down on the same frame | 6 of 6 at peck (head y ≤ 0.5 m, logged) |
| FL30-heads 58 / 74 | group 0 up and group 1 rising at 58, all six up by 74; three men unblocked | 36 heads at y 1.6 by L 73; crew bbox overlap 0 px |
| FL30-scatter 6 / 60 | heads up / clumps running apart, no bird lying down | ≥ 3 clumps separated by ≥ 4 m at L 60 |
| FL30-halves 14 / 30 | left half leaving left / right half leaving right, hero alone in the middle | at L 22 all left-half x ≤ 6.0; at L 38 all right-half x ≥ 18.0 |
| FL30-fence 0 | every bird behind the wire from the track | no body pixel in front of the wire layer (logged) |
| render time | — | one 60-bird half-size frame time logged |

## Result (Boss fills)
Commit `6441144` (branch `worktree-agent-a3187762f86199def`, on `4f81e77`) · fix passes used: 0 · Boss, Sonnet medium, 2026-11-20.
Proof: store `projects/edu/EDU/previews/T08-sheet.png` (18 frames, 5 cols, 270 px) and the frames `T08-<comp>-<L>.png` in the same folder; tests `node scripts/test.mjs tests/edu30-flock.test.ts` 13/13 pass; `tsc` has no edu30 error; `npm test` 340 pass / 19 fail, none in edu30 (12 are the missing `@remotion/three` in this worktree, HIPPO joints stack overflow, media/loudness/store tests).
Built in `flock.ts`: `paddockExtras`, `emu1State`, `buffetRow`, `headsField`, `scatter`, `burst` (+ `paintBurstDust`), `halves` (+ `halvesDust`), `fenceBirds` (+ `fenceCountB06`, `emuFront`), `slowLine` (+ `slowDust`), `blendPoses`, `footEvents`, `paintFlock`, `strideForAdvance`; `EmuPaint.lod` forces a detail level. `proof-flock.tsx`: FL30-buffet, -heads, -scatter, -burst, -halves, -fence, -slow, -cost.
| Row | Measured | Verdict |
| --- | --- | --- |
| buffet 135 | 6 of 6 at pitch -0.18, head y 0.416-0.435 m (<= 0.5); 134 and 140 not fully down | met |
| EMU1 | contacts L 4/34 left, 19/49 right (feet down on those frames, in swing the frame before); stance slip 0.0000 m | met |
| heads | 36 members, sightline band min 0.96 m (>= 0.9), hero circle min 1.21 m, spacing min 0.70 m, all heads y 1.6 at L 73, crew bbox overlap 0 px at the start and end camera (library rejects heads that touch the crew box + 6 px) | met |
| scatter | 4 clumps, min separation 13.9 m at L 60 (>= 4); nobody down; hero = the bird nearest (12, 0, -32), seed 36000 | met |
| fence | body front 0.575 m, all nine states <= z 5.92; hero stays at z 5.3; wire painted over the birds, none in front | met |
| slowLine | hero contacts L 12, 54, 96, both feet down L 109 (right foot swing compressed L 100-109); stance slip 0.0000 m; z -4.6 to -3.8007 at L 109 | met |
| render time | FL30-cost (scatter(44) 40 rig birds + 20 far silhouettes), one frame at 1080x1920: whole `stills.mjs` run 13.9 s; half size not measured (`stills.mjs` CLI has no scale option); a 36-bird heads frame at near detail exceeded the 180 s still timeout, so the heads field paints `lod: 'far'`; a 9-bird fence frame at near detail also timed out (191 s), proof uses the five birds of B05-SH04 | logged |
Values I could not follow (Film to decide):
1. **halves exit:** "left half x <= 6.0 at L 22, right half x >= 18.0 at L 38" cannot hold at 5.5 m/s (needs about 17 m/s). Built at 5.5 m/s over 4 f: left half x max 9.88 at L 22, right half x min 14.48 at L 38. Frame exit at the sheet camera (half width about 2.7 m at depth 4.5 m) is earlier; FL30-halves 14/30 read as asked (left half away, hero alone at L 30, right half leaving). Film: keep the speed and change the numbers, or give a speed.
2. **burst "all past the frame edges by L 45":** at 6-8 m/s the top camera still holds 34 of 40 birds at L 45. Built as stated.
3. **slowLine "40 % cycle speed":** read as the contact frames L 12/54/96 (period 42 f) at 0.22 m/s, so the stride is 0.185 m (very short steps, stance static).
4. **peck quantisation 1/16 vs slip <= 0.02:** named walkers (EMU1, extras, halves, slowLine) use exact phase; crowd birds (scatter, burst) quantise to 1/16, so run slip there is untested (up to about 0.06 m).
5. **burst groups:** the six groups take each bird's scatter heading +-60 deg, snapped to 15+60k deg; hero group = the hero and the 10 birds nearest (12, 0, -32), heading toward it. `halves` returns the 10 birds only; the hero at (12, 0, -32) is painted by the plate (T15 mime).
Other limits: walk to run snap at the bolt is blended over 3 f by `blendPoses`; heads proof overpaints wheat ridges per z band, so some sitting bodies show above the stalks in the proof (the plate T-ticket interleaves properly); scatter birds are 20-40 px high at the sheet camera (z -30..-60 at f 900), as the ticket places them; neck seams ignored per R6 until T37.
