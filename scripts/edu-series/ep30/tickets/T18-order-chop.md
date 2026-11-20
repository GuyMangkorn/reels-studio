# T18 — MEREDITH gives the order: `new: order-chop` (raised arm chopped forward into a point) with the shouted "ยิง!" mouth
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: **done** (R11: fix pass 1 = T41, accepted, TF65, TF68) · was: built; fix pass 1 in **T41** (R10: face only) · was: ready (Q8 answered by the user: values as written)
Class: figure · Hard: yes (arm, hand, face)
Blocked by: T17 (same files `cast.ts`, `proof-cast.tsx`, `tests/edu30-cast.test.ts`) · Consumers: B03-SH05
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks); [hand-drawing skill](../../../../.claude/skills/hand-drawing/SKILL.md) §1–3, §7, §8; b03 B03-SH05; brief [VD30-13](../short/film-brief.md#r3-changes); kit [poses.ts](../../../../src/painted/kit/poses.ts) P07 (`wave`: RIGHT hand raised beside the head) and P05 (`point_side`: LEFT arm straight out) and [poses-more.ts](../../../../src/painted/kit/poses-more.ts) their profile arms.

## Build
A keyed right-arm move from the kit P07 raised arm to a mirrored P05 point aimed at the flock, in the episode cast module, on MEREDITH front three-quarter, with a neutral face and a shouted mouth. War-film grammar played straight: serious, crisp, not mocking (script; CAT02).
Casting line: MEREDITH `man-parted + new: aus-army-1932-officer, P07 → new: order-chop → P05 (mirrored to the right arm), neutral` + `talk` mouth.
Files: `src/painted/edu30/cast.ts`, `src/painted/edu30/proof-cast.tsx` (adds `C30-chop`), `tests/edu30-cast.test.ts`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Staging | (−0.6, 0, 1.05) facing −z (toward the flock), front three-quarter to the B03-SH05 lens (the lens is at his left front: his RIGHT arm is on screen left and is the **far** arm; the sheet's "near (right) arm" is a slip, the numbers and the screen side stand) | b03 B03-SH05; hand-drawing §1 |
| Start key (L 0–4) | right arm = kit P07 hand target (offset (−0.207, 0.443) from the right shoulder, front table), raised beside the head; sheet world point (−0.35, 2.05, 1.05) is the screen guide, ± 40 px | b03 B03-SH05 (P07 hold) |
| Chop (L 4–7, global 671–674) | the hand travels down and forward on an arc about the shoulder (ease-in: fast at the end), elbow straightening, to the end key at L 7; one solved chain per frame | b03 B03-SH05 ("chops down and forward local 4–7, lands on ยิง! 673") |
| End key (L 7–20) | right arm straight, pointing at the flock: the kit P05 arm mirrored to the right side and turned forward (−z) about 20° below the shoulder line (world mitten ≈ (−0.35, 1.45, 0.45), screen guide (250, 712) ± 40 px); held still | b03 B03-SH05 |
| Hand lines | start: `MEREDITH RIGHT hand, flat mitten raised, shows palm (to the lens), fingers screen up` → thumb screen right; end: `MEREDITH RIGHT hand, mitten, index-point not drawn (mitten scale), shows edge (thumb side up), fingers toward the lens and screen left` → thumb on top | hand-drawing §2, §3, §4 |
| Left arm | P01 hang every frame | ticket |
| Body | feet planted; torso leans 0.04 rad forward with the chop (L 4–7) and holds | ticket |
| Face | `neutral` brows and eyes (straight, serious; no smirk); mouth: kit `talk`, `open` L 6: 0.3, L 7–11: 0.8, L 12–14: 0.5, L 15: 0.2, L 16 on: 0 (closed, firm) (speech [673, 683) = local 6–16) | b03 B03-SH05 VO; VD30-13 |
| Eyes | toward the flock (down the line of the point), never to the lens | b03 B03-SH05 Direction |

**Open-question dependency (Q8, index O9).** As written B03-SH05 is 21 f (667–688). The alternative holds the shot to 704 (37 f): the keys stay and the end key holds to L 36.

**Judgment for the builder (Hard, arm, hand, face).** One decisive chop, the arm whole from shoulder to mitten in every frame, ending in a straight point that aims at the flock off screen; the body stays planted and upright, the face set. It must read as a real commander's order, not a comic flail.

## R9 row (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
| Row | Value | Pass |
| --- | --- | --- |
| R9-1 loader lean scale (for T22 r8, same file) | `CrewSolveOpts.loaderLean?: number` (0..1, default 1): the loader's lean becomes `LOADER_LEAN × hold × loaderLean`; nothing else changes | a test in `tests/edu30-cast.test.ts`: `loaderLean: 0` → solve `lean` 0 at L 0; default calls keep their stroke hashes (T11/T36/T12/T17 tests unchanged) |


## R10 look check (Film, 2026-11-20, `EDU-EP30-TICKETS-R10`)
Viewed `T18-sheet-chop.png`, `T18-hands-L0-L7.png`, `T23-sheet.png`. **Verdict: accept with value change; face fix in [T41](T41-order-shout-face.md) (fix pass 1).**
- Arm, chop ease, end point, lean, left arm, gaze, thumb and arm checks: pass.
- **Lead (TF50):** row 654–696 → **700–780 px** (built 725 L 0, 737 L 7). The decided staging and f 1000 give ~403 px/m; a bigger commander in the low heroic three-quarter is right for the beat. Test bound 654–745 may stay.
- **Start key (TF51):** accepted as keyed, mitten (434, 620) in `C30-chop`; the kit P07 target and the sheet guide could not both be met.
- **End key (TF51):** the sheet's "about 20° below the shoulder line" was wrong: the world point (−0.35, 1.45, 0.45) is a near-horizontal arm at shoulder height, which this low lens shows above the shoulder on screen. The screen guide wins; built (254, 718) accepted.
- **Face (TF65):** the `talk` 0.8 mouth with neutral brows reads as a surprised "oh" at L 7–12; T41 sets stern brows from L 5 and the kit `shout` mouth L 7–14.
- 21 f shot as built (Q8).

## Proof
- `node scripts/test.mjs tests/edu30-cast.test.ts`: arm ratio ≤ 1.05 at every frame L 0–8; right wrist reach ≤ 0.52 m from the shoulder at every frame.
- `C30-chop` in `proof-cast.tsx` (newsreel off, paddock, the B03-SH05 camera line `eye (−2.0, 0.75, −1.2) → (−1.95, 0.75, −1.05), yaw 148 → 150, pitch 10, f 1000, hy 860`): stills at L 0, 4, 5, 6, 7, 12 → `out/edu30-T18/`; `scripts/qa-sheet.sh out/edu30-T18/sheet.png --cols 6 --width 270 out/edu30-T18/*.png` and a `--width 540` crop at L 0 and L 7.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| L 0 | right arm raised beside the head on screen left | mitten near (470, 591) ± 40 px; `thumb check: MEREDITH RIGHT: screen right ok` |
| L 7 | straight point toward the flock, mouth open | mitten near (250, 712) ± 40 px; MEREDITH 654–696 px |
| L 4–7 | the arm is one chain through the chop | `arm check: MEREDITH r: attached ok`; max arm ratio logged ≤ 1.05 |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
Commit 125da8f · built 2026-11-20 on Sonnet medium · fix passes used 0 · no open question; **two values could not be followed exactly (below), Film to rule at the look check**.
- Proof: store `projects/edu/EDU/previews/T18-sheet-chop.png` (L 0, 4, 5, 6, 7, 12), `T18-hands-L0-L7.png` (540 px frames L 0 and L 7), frames `T18-chop-NN.png` (`C30-chop` in `proof-cast.tsx`: paddock, newsreel off, camera eye (-2.0, 0.75, -1.2) yaw 148 to (-1.95, 0.75, -1.05) yaw 150, pitch 10, f 1000, hy 860, ease-in-out over L 0-20).
- Code: `cast.ts` adds pose `chop` (`solveCrewPose`; `chopU`, `chopTalk`, `CHOP_*` keys, a thumb nub on the open mitten) and R9-1 `CrewSolveOpts.loaderLean`; `proof-cast.tsx` adds `C30-chop`, `CHOP`, `chopCam`; tests in `tests/edu30-cast.test.ts` (19 pass; the T11/T36/T12/T17 stroke-hash tests are unchanged).
- Measured: L 0 mitten centre (434, 620) vs guide (470, 591): within 36 / 29 px; L 7 mitten (254, 718) vs guide (250, 712): within 4 / 6 px; arm ratio max 1.000 over L 0-20 (<= 1.05); wrist reach max 0.518 m (<= 0.52); elbow flexion 34.5 deg at L 0 to 10.1 deg at L 7 (near straight, `ikElbow` keeps a hair of bend); chop ease-in (`t^2`: u 0.11, 0.44, 1 at L 5, 6, 7); lean 0 to -0.04 rad (screen left, toward the point) with the chop; left arm P01 hang; mouth open 0.3 / 0.8 / 0.5 / 0.2 / 0 per the table; gaze screen left (-0.8, -0.1).
- thumb check: MEREDITH RIGHT: screen right ok at L 0 (palm to the lens); screen top ok at L 7 (edge, thumb up). The nub is a few px at 540 px.
- arm check: MEREDITH r: attached ok (L 0-20, one solved chain per frame; the forearm and upper arm repaint over the hat at the hold).
- R9-1: `loaderLean: 0` gives solve `lean` 0 at L 0; default and 1 give `LOADER_LEAN`; existing loader hashes unchanged.
- **Not followed:** (1) lead height at L 7 measures 737 px (L 0 725), not 654-696: the decided staging (-0.6, 0, 1.05) and camera give 1.78 m x u 403 px/m (+hat); a 654-696 lead needs the figure about 0.2 m farther or f about 920. Left as decided; the test asserts 654-745 and logs the number. (2) The start key: the kit P07 hand target projects to (397, 648) and the sheet screen guide is (470, 591), 73 / 57 px apart, so no point meets the kit target and the guide at +-40; I keyed the wrist between them (mitten (434, 620), 37 / 28 px from the kit target). The end key's "about 20 deg below the shoulder line" also contradicts the screen guide (the mitten sits about 110 px above the shoulder on screen; the sheet's world shoulder height 1.45 m is about 0.25 m above the drawn shoulder at this camera), so the end key follows the screen guide and the reach limit (a straight in-plane arm, mitten edge-on, not a 3D pose). The sheet's world point (-0.35, 1.45, 0.45) projects to (318, 735) at the L 0 camera, 33 px from the keyed mitten at L 7 camera.
- Open-question dependency (Q8 / O9): the 21 f shot is built; the 37 f variant holds the end key to L 36 (no solve change; `chopU` is 1 from L 7).
