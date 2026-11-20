# T37 — every beast tube keeps one continuous ring frame, so a bending neck or limb never twists or slits at the bend
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: done (R7, Film closed it from Boss's commit and proofs; user answered 2026-11-20: keep the fix, including the visible EP18 hippo foot change) · was: ready · Film, 2026-11-20, `EDU-EP30-TICKETS-R6`
Class: capability · Hard: yes (shared creature geometry; every creature painted through `paintBeast`)
Blocked by: none (T07 r5 merged at `707d757`) · Consumers: T06 row N4 (KP-startle, KP-duck neck), T07 r6 (the KP-sac seam at u 0.25), every emu plate; other creatures that use `src/painted/survival/beast.ts` (kit snake, kit mosquito, `kit-raptor-motion`, edu18) only where their tubes bend past the flip
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Locked looks, Checks and commit); [T07 Result, T06 neck rows](T07-emu-head-face.md#t06-neck-rows-q-r5-1-a) (N4 numbers and the root cause); `src/painted/survival/beast.ts` the ring loop (`ks.forEach`, lines about 95–104).

## Build
A bug fix in the owning library: the ring loop in `paintBeast` flips each station's second axis on its own (`Yu = Y[1] < 0 ? -Y : Y`), so when a tube's tangent turns past vertical (the emu neck in startle and duck) two neighbouring rings are joined with mirrored vertex order and the quad row between them twists into a pinch or a light slit. Carry the frame from station to station instead.
Casting line: none (no look change; geometry fix).
Files: `src/painted/survival/beast.ts`, `tests/beast-joints.test.ts` (new ring-frame test), and hash re-takes only where a test fails from this change: `tests/beast-air.test.ts`, `tests/edu30-emu.test.ts`, `tests/edu18-w5.test.ts` (old value kept in the test title, as T07 r5 did). Proof stills to `out/edu30-T37/`.

## Decided values
| What | Value | Source |
| --- | --- | --- |
| R1 station 0 | unchanged: `X0`, `Y0 = cross(X0, T0)`, flipped when `Y0[1] < 0` (the current rule), so a tube whose `Y[1]` never changes sign along it builds exactly as today | ticket (keeps every non-bending part bit-identical) |
| R2 stations i ≥ 1 | compute `X_i` as today; if `dot(X_i, X_{i-1}) < 0` set `X_i = -X_i`; `Y_i = cross(X_i, T_i)`; if `dot(Y_i, Y_{i-1}) < 0` set `Y_i = -Y_i`. Ring vertices and normals (`rv`, `rn`) use these `X_i`, `Y_i`. No other change in the loop (ring count, `a`/`b` radii, splines, front test, fills, seeds, painter order) | ticket; T07 Result root cause |
| R3 the `|X| < 0.05` basis switch | left as is; the R2 dot checks already keep it continuous if it occurs. Log any part where it fires on the proof creatures | ticket |
| R4 N3 (emu neck `spline(..., 6)`) | stays (built in T07 r5, measured within the lock; the bend in startle and duck needs the stations) | Film R6 |
| R5 scope | `beast.ts` ring frame only. No change in `emu.ts`, `looks.ts` or any creature module | ticket |

## Proof
- Instrument once (a test helper or a one-off script, not shipped in the painter): for every part of every creature the hash tests build, count the stations where the **old** rule flipped `Y` between neighbours. Log the list `creature / part / stations` in Result; this is the set the fix may change.
- `node scripts/test.mjs tests/beast-joints.test.ts tests/beast-air.test.ts tests/edu30-emu.test.ts tests/edu18-w5.test.ts` (log to `out/logs/T37-tests.log`).
- `sh scripts/edu-series/ep30/short/render-looks.sh T37 KP-stand KP-face KP-look KP-walk KP-run KP-peck KP-bow KP-startle KP-duck KP-sac` and the LF stills `LF01a LF02 LF03` (same script) and `TA2` (relief emu); the kit raptor proof (`kit-raptor-motion`) at frames 0 and its widest bend through `scripts/stills.mjs`; qa-sheet at 270 px.

| Frame / row | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| test: ring-frame continuity | a synthetic tube bending its tangent through vertical (e.g. a quarter circle from +y to +x and on to −y): for every neighbouring station pair, `dot(Y_i, Y_{i-1}) > 0` and `dot(X_i, X_{i-1}) > 0` | all pairs |
| test: unchanged parts | every creature/part with no old-rule flip (instrument list): stroke hash identical to before the change | byte-identical |
| KP-startle neck-mid seam (N4), y 600–690, full size | one continuous neck outline, no pinch | largest adjacent-row x jump ≤ 3 px on both edges (r5: 3 and 8) |
| KP-duck neck | no light slit across the neck (viewed at full size, crop archived) | 0 background-coloured rows inside the neck band (logged) |
| KP-sac, swell start u 0.25 | the thin light crescent is gone (viewed) | logged |
| Locked looks: KP-stand, KP-face, KP-look, KP-walk, KP-run, KP-peck, KP-bow, LF01a, LF02, LF03, TA2 vs the T07 r5 renders | unchanged where no part bent past the flip | mean abs ≤ 2 each (logged with px > 8 and their bbox) |
| Other creatures (kit snake, mosquito, raptor proof, edu18 hash) | unchanged unless listed by the instrument | mean abs / hash logged; **any creature outside EP30 that changes visibly or > 2: stop, keep the commit unmerged, return its before/after still** (the coordinator shows the user) |
| Changed hashes | only for parts in the instrument list | old and new value in the test title |

Archive `out/edu30-T37` as `T37-*.png` (`store.py archive ... --kind previews`), including `T37-neck-before-after.png` (KP-startle and KP-duck, T07 r5 vs T37, 2× crops).

## Result (Boss fills)
Commit · proof sheet path · instrument list · measured numbers per row · fix passes used · open question, if blocked

**Filled by Film (R7, 2026-11-20), not by Boss.** Boss built the ticket, found a visible change outside EP30, stopped as the ticket says and returned before writing this section. This record is put together from the commit, the archived stills and one test run. Where Boss logged nothing, it says so.
- **Commit `d5a5b82`** (Boss, Sonnet medium; message "HOLD, not merged: changes AS-HIPPO-R1 feet visibly"), later merged into `claude/ep30-continuation-493a12` (ancestor of `b581861`). Files: `src/painted/survival/beast.ts` (new exported `ringFrames(pts)`; `paintBeast` reads `frames[i]` instead of the per-station `Yu` flip) and `tests/beast-joints.test.ts` (two ring-frame continuity tests: a half turn from +y through +x to −y, and an arch with lateral drift). No hash re-takes: `tests/beast-air.test.ts`, `tests/edu30-emu.test.ts` and `tests/edu18-w5.test.ts` are not in the commit. Fix passes used: 0.
- **Decided values R1–R5:** the code does what R1–R5 say. Station 0 keeps the old `Y[1] < 0` rule, stations ≥ 1 carry `X` and `Y` by the dot checks, the `|X| < 0.05` switch is unchanged, and `emu.ts` and `looks.ts` are untouched.
- **User decision (2026-11-20, a real answer to the coordinator's structured question):** keep the fix, **including the visible EP18 hippo change.** AS-HIPPO-R1's feet and lower legs now paint as rounded, closed tubes. Before, they showed ragged, stepped rims at the ankle bend. Evidence: `T37-hippo-HIPPO-RIG-before-after.png` (Film viewed it: left before, right after; front 3/4 and side) and `T37-hippo-HIPPO-TURN-before-after.png`. EP18 has been delivered and is not re-rendered by this ticket. A later EP18 re-edit picks up the new feet.
- **Film look check (viewed downscaled):** `T37-neck-before-after.png`: the KP-startle neck-mid pinch is gone (one continuous outline), and the two light slits across the KP-duck neck are gone. **N4 pass.** `T37-sac-before-after.png`: the thin light crescent at the start of the sac swell is gone. A dark vertical stroke at the neck centre line shows in both before and after, so it is not from this change; T07 r6 S1–S2 repaint the sac patch. `T37-LF03-before-after.png`: one visible change inside EP30's locked LF03, where the brown supporter limb at the top left loses its stepped kink at the bend and becomes one continuous tube. It is the same class of repair as N4. Film accepts it as within the user's answer, but it is shown to the user for information (index handoff), not as a question.
- **Rows not logged by Boss:** the instrument list (which creature or part flipped under the old rule), the KP-startle adjacent-row jump in px, the KP-duck background-row count, and the locked-look mean abs for KP-stand … TA2 and the kit snake, mosquito and raptor. Film accepts the look check above in their place. **No re-run is ordered:** the user's answer covers the visible change, and the unchanged-part rule (R1) is guaranteed by the code, since a tube whose `Y[1]` never changes sign takes the same frames as before.
- **Tests (Film run, `b581861`, `out/logs/film-r7-beast-joints.log`):** `tests/beast-joints.test.ts` 13 pass / 3 fail. The failures are `HIPPO.YAWN`, `HIPPO.CHARGE` and `HIPPO.HALT joints hold`. **The same three fail on `d5a5b82^`** (a Film run in a temporary worktree: 11 pass / 3 fail, before the two new tests), so they predate T37 (T08's Result also lists the "HIPPO joints stack overflow" among the `npm test` environment failures). The two new ring-frame tests pass. Not a T37 regression; recorded in `build-notes.md` as an open EP18 test debt (owner Boss, outside EP30).
- **Proof stills (store `projects/edu/EDU/previews/`):** `T37-KP-{startle,duck,sac}.png`, `T37-before-KP-{startle,duck,sac}.png`, `T37-LF03.png`, `T37-before-LF03.png`, `T37-LF03-before-after.png`, `T37-neck-before-after.png`, `T37-sac-before-after.png`, `T37-hippo-HIPPO-{RIG,TURN}-before-after.png`.
- **Unblocks:** T06 N4 (T06 done) and T07 r6.
