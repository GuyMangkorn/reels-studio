# T16 — the queue at the dam walks the shore, steps in unison, flinches and re-forms under fire, stares, and turns away
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: done (R9 Film look check: accept with value change) · was: built (r4, 2026-11-20, awaiting Film look check; Q7 answered by the user: values as written) · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4)
Class: movement · Hard: yes (animal movement)
Blocked by: T10 (r4: the 0.6 m ease at each waterline crossing; r3: `QUEUE_PATH`, `queuePoint` with the wading y), T35 (hop `air`), T08 (same files `flock.ts`, `proof-flock.tsx`, `tests/edu30-flock.test.ts`) · Consumers: B04-SH02, B04-SH03, B04-SH05 (no queue bird is in B04-SH01, SH04 or SH06)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks, clocks); b04 Space D continuity (SD06), B04-SH02, B04-SH03 Queue row, B04-SH05 Queue row; T06 (`duck`, duck-flap, `emuHop`), T07 (`emuLensYaw`), T10 (`queuePoint`, `sAtRimX`).

## Build
A pure `queue(L, shot)` helper in `flock.ts` returning `EmuMember[]` for the three queue shots: single file along `QUEUE_PATH`, EMU-HERO at the head in every shot (identity: tuft and bib), painted far mass beyond 40 m.
Files: `src/painted/edu30/flock.ts`, `src/painted/edu30/proof-flock.tsx` (adds `FL30-queue-*`), `tests/edu30-flock.test.ts`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Layout | bird i (0 = head = EMU-HERO, seed 36000) at arc length sHead(L) + 1.4 i along `QUEUE_PATH` (T10), heading = path tangent toward the gun, y from the path; 25 birds; beyond 40 m from the camera `paintFarFlock` instead of birds | b04 SD06 |
| B04-SH02 sHead (head x on the rim z −4.9) | **L 0–40 stands at x 4.6** (idle: head bob ± 0.02 m on a seeded 20–30 f cycle per bird); **L 41–49 every visible bird steps forward 0.6 m together** (one step: each bird's rear foot lifts at L 41 and lands at L 49, ease-in-out; the front foot planted); head at x 4.0 at L 49; L 49–68 walks on at 0.32 m/s to x 3.8 at L 68 (Film fix: the sheet's "walks at 0.3 m/s from 4.6" and "4.0 by local 49" cannot both hold with a 0.6 m step; the positions 4.6 → 4.0 → 3.8 and the unison step on "ต่อคิว" (L 41, global 965) are kept, so the line waits, then steps) | b04 B04-SH02 Staging |
| B04-SH03 sHead | x 3.6 at L 0 → 3.0 at L 46 (0.39 m/s, walk phase from speed). Overrides per bird: birds 0–5 duck-flap from **L 12** (T06); birds 2 and 4 hop sideways toward −z (into the shallows: `side` −1, the bird's right when it faces −x, which is −z; dist 0.6) from **L 19**, landing and splash at **L 25** (T05 `paintSplash` at the landing point); they walk back up to the rim on a 1.2 m arc and rejoin their slot by L 40; the line bunches (birds 1–8 close to 1.0 m spacing over L 14–24) and re-forms to 1.4 m by L 40; keeps walking to the cut | b04 B04-SH03 Queue row; VD30-11 Birds (continues, not breaks) |
| B04-SH03 no hits | no bird inside 1.5 m of any T05 strike point at its frame | CAT02 |
| B04-SH05 stare | sHead fixed at x 1.6 (s 4.6); the whole line stands; every bird's `headYaw` = `emuLensYaw` to the B04-SH05 camera (the gun line); EMU-HERO (bird 0) takes its pose from T15 `emuWatchCheck` / `emuFootTap` instead | b04 B04-SH05 |
| B04-SH05 turn-away | from **L 57** (global 1143, "แผนสาม"): birds 1–6 in order, 2 f apart (bird 1 at 57, bird 6 at 67, past the cut for the last ones), turn about over 6 f (heading +π, both feet stepping: one step per 3 f) and walk back up the shore at 0.4 m/s; birds 7+ stay staring to the cut; EMU-HERO stays | b04 B04-SH05 Queue row |
| Unison precision | the B04-SH02 step uses the same frames for every visible bird (no seeded delay) | b04 B04-SH02 Acceptance |

**Open-question dependency (Q7).** The turn-away is keyed at L 57 from a shot start at 1086 (= global 1143, L12's first word); if Q7 moves the start, the global frame 1143 is kept.

**Judgment for the builder (Hard).** A queue: single file, even spacing, comic patience. Planted feet: every stance foot holds its world position on the wet rim (slip ≤ 0.02 m); in the unison step every front foot stays planted. Under fire the birds flinch and two hop into the shallows, but the line never breaks and no bird is hit or falls. In the turn-away the birds step around, never spin on the spot.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Wading (T10 r3).** On the east-shore leg where the path lies over the water (z < about −8), T10 r3 `queuePoint` returns y = 0.30 (the water surface). Each bird there is painted standing on that surface, then a water-tone ellipse 0.14 × 0.05 m (`DAM` water lit colour) at each foot after the bird hides the feet (ankle-deep), plus a 0.25 m ripple ring per foot-down on the ambient clock. Planted-foot slip ≤ 0.02 m still applies.
- **Hop (T35).** The two B04-SH03 hops place `at` on the ground and pass `emuHop`'s `offset[1]` as `air`; the shadow stays on the ground and shrinks per T35.
- **Wing (T06 r3).** The duck-flap uses the drooping r3 FLAP_OUT.

## r4 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R4`)
These override any older value in this ticket that they name.
- **T10 r4.** `queuePoint` eases y from the bank to the water over 0.6 m before each crossing; the bird's body follows `queuePoint` y with no extra smoothing, and the feet hide from the water surface on (ankle-deep).

## Proof
- `node scripts/test.mjs tests/edu30-flock.test.ts`: positions 1.4 m apart along the path at B04-SH02 L 0; at L 45 every visible bird mid-step and at L 49 all landed; stance slip ≤ 0.02 m over B04-SH02 L 49–68; no bird within 1.5 m of a strike point (B04-SH03, T05 points).
- `proof-flock.tsx` on the sheet cameras over the T10 dam: `FL30-queue-sh02` L 0, 45, 49; `FL30-queue-sh03` L 12, 22, 25, 40; `FL30-queue-sh05` L 0, 60. `scripts/qa-sheet.sh out/edu30-T16/sheet.png --cols 5 --width 270 out/edu30-T16/*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| FL30-queue-sh02 0 | a queue: single file, even spacing, head bird large | head bird 484 ± 30 px (sheet) |
| FL30-queue-sh02 45 | every bird mid-step | all rear feet lifted (logged) |
| FL30-queue-sh03 25 | two birds landing in the shallows, splash | 2 splashes at L 25 |
| FL30-queue-sh05 0 | every head turned to the lens | EMU-HERO 505 ± 30 px |

## Result (Boss fills)
Commit: the T16 commit on branch `worktree-agent-a0f0c837b16317439` (see the handoff for the hash). Files: `src/painted/edu30/flock.ts` (`queue(L, shot, {hero?})`, `queueSplashes`, `queueAvoid`, `queueFoot`, `queueHeading`, `paintQueueFar`, `paintQueueWade`), `src/painted/edu30/proof-flock.tsx` (`FL30-queue-sh02`, `-sh03`, `-sh05`), `tests/edu30-flock.test.ts` (7 T16 tests, all pass).
Proof sheet: store `projects/edu/EDU/previews/T16-sheet.png` (cols 5, 270 px; L order sh02 0/45/49, sh03 12/22/25/40, sh05 0/60), `T16-sh03-L27-crop.png` (the splash crowns: the crown is 0 high at k 0, so the visible frame is L 27), `T16-sh03-crops.png`, per-frame `T16-<shot>-L<n>.png`.

| Frame | Pass range | Measured |
| --- | --- | --- |
| FL30-queue-sh02 0 | head bird 484 ± 30 px | 483.8 px (head top 1.70 m to the toe line, camera projection of the sheet line) |
| FL30-queue-sh02 45 | all rear feet lifted | 25 of 25 lifted, 0.113–0.127 m; front feet 0.000 (planted); same lift state for every bird at every frame L 40–50 |
| FL30-queue-sh03 25 | 2 splashes at L 25 | 2: birds 2 and 4, landing points (6.24, −5.50) and (9.02, −5.55); `paintSplash` start 25 (crowns show from L 27, `T16-sh03-L27-crop.png`) |
| FL30-queue-sh05 0 | EMU-HERO 505 ± 30 px | 505.9 px |

Test numbers (`out/logs/T16-test.log`): SH02 L 0 spacing 1.400 m on every rim pair; head x 4.6 (L 0–40), 4.0 (L 49), 3.797 (L 68); stance slip L 49–68 birds 0–6 0.0082 m, planted front foot over L 41–49 0.0019 m (limit 0.02); SH03 head 3.6 → 3.0, duck-flap feet planted (slip ≤ 0.02, birds 0, 1, 3, 5), gap birds 5–6 1.000 m at L 26, spacing birds 0–8 at L 40 1.400 m (one gap 1.436), no bird walks backward (birds 0–8, x non-increasing L 0–46), hoppers back on the rim by L 40, minimum bird-to-strike distance 1.756 m (≥ 1.5 with `queueAvoid` as `strikePoints` `avoid`); SH05 every `headYaw` = `emuLensYaw` to the sheet camera, birds 1–6 turned at L 63, 65, … (2 f apart), birds 0 and 7+ not turned, the feet alternate over the turn (lift states L 57–63: `-bb-aa-`); frame L alone equals frame L after 0…L.
Fix passes used: 0. Open question: none (values Film must see, below).

**Values not followed or reinterpreted (Film to judge):**
1. **SH03 bunching (birds 1–8 to 1.0 m, re-formed to 1.4 by L 40).** Not reachable with every bird walking forward: the head must end at x 3.0 and the birds behind may not step backward, so every bird has advanced the same distance at L 40 and a chain of eight gaps cannot all reach 1.0 m and open again (the tail birds would have to retreat 2.8 m in 16 f). Built: birds 0–5 stop for the duck-flap (L 12–28, feet planted), bird 6 closes up behind bird 5 to a **1.0 m gap at L 24–28** and holds to L 40, birds 7+ keep walking; spacing 1.4 m at L 40 (one 1.436). The line reads as bunching at the front, not along eight birds. A backward step for the tail (the one way to get the full sheet) is Film's call.
2. **SH03 head speed.** "0.39 m/s" is the walk speed to L 12; the head stops for the duck-flap (L 12–28, feet planted: moving would slide the feet) and catches up to x 3.0 at L 46 at about 1.0 m/s (L 28–40) then 0.22 m/s (L 40–46).
3. **Birds 2 and 4 hop.** Bird 4 stands at x 9.0 (the rim runs on to the corner at x 14.5), so its landing is beyond the rim end of the sheet's x 3.6 line; both land at z −5.5 (0.6 m into the shallows). The return walk is 12 f from L 28, about 0.72 m of ground (not 1.2 m).
4. **Unison step.** The gait is one stride for the whole line: 1.5 m of body advance per cycle (stride 0.9), so one step is exactly 0.6 m; the standing stance (L 0–40) is the staggered double-support pose at phase 0.1 (front foot ahead), and each bird's body advance is 0.6 × its scale (±6 %), so a bird's step is 0.57–0.64 m and the head bird (scale 1) steps exactly 0.6.
5. **EMU-HERO in SH05.** T15 (`emuWatchCheck`, `emuFootTap`) is not built: bird 0 stands staring with the lens yaw; `queue(L, 'B04-SH05', {hero: (L) => ({pose, ...})})` replaces bird 0's fields when T15 lands (plate T28).
6. **Wading ellipse colour.** "`DAM` water lit colour" read as `DAM.waterLight` (`#e6e2d2`); `paintQueueWade` draws it at 0.14 × 0.05 m per foot plus a 0.25 m ripple ring per foot-down (12 f). Nine birds stand on the water at SH02 L 0; the far birds are small at the sheet cameras, so the proof sheet does not show the ellipses (they are visible only on a near wader); not looked at 540 px.
7. **Far mass.** `paintQueueFar` is a static painted mass along the path from bird 25 on (hundreds of silhouettes, three per 1.4 m of path in six-metre boxes), not tied to a camera distance test.
8. **Contact shadows.** The proof uses the default `shadowOp` 80; the foot contact shadows read as dark green discs on the brown rim at 270 px (kit `#1e2418`); plates may pass a lower `shadowOp`.
9. **Hopper and tail reflections in the water** are not in the proof (the plates pass `reflect`).
Checks: `npx tsc --noEmit -p .` has no error in the three files (pre-existing errors in `tests/arm-depth`, `edu18-girl`, `loudness`, `render-options`); `npm test` 484 pass, 9 fail, none in files this ticket touched (HIPPO joints ×3 known, `loudness`, `new-shot`, `canvasStyleOf` (T24 test d), `render-inputs`, `segments`, `store adopt`; logs `out/logs/T16-npmtest.log`). Render cost: near birds are about 3 min per still under load 15–30 (25 birds + dam); one run timed out at 183 s under load 29 and was rerun.

## R9 look check and decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
Viewed: store `T16-sheet.png` and `T16-sh03-L27-crop.png`, `T16-sh03-crops.png`. **Verdict: accept with value change; no Boss pass.**
| Item | Decision | Reason |
| --- | --- | --- |
| B04-SH03 bunching (value 1) | **front only**, as built: birds 0–5 stop for the duck-flap L 12–28, bird 6 closes to a 1.0 m gap L 24–28 and holds to L 40, birds 7+ keep walking; 1.4 m spacing at L 40. No backward step. TF36 | an emu stepping backward reads as a glitch; the flinch reads at the head of the line, where the strikes land |
| Head speed, hop return 0.72 m, unison step 0.57–0.64 m by scale, bird 4 at x 9.0 (values 2–4) | accepted as built | the step frames are shared (unison) and every planted foot holds |
| Contact shadows (value 8) | plates T26, T27, T28 pass **`shadowOp: 45`** for every queue bird. TF37 | the kit 80 reads as dark green discs on the brown rim at 270 px |
| Wading ellipse, far mass, reflections (values 6, 7, 9) | accepted; plates pass `reflect` where the sheet shows water | as built |
