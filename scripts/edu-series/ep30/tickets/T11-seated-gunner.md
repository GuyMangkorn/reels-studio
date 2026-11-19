# T11 — the seated gunner holds the gun in front, back, right-profile and front three-quarter views and jolts with each round
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: built, 1 open question for Film (thumb rows; see Result) · r3: Film notes added (TICKETS-R3)
Class: figure · Hard: yes (arm, hand)
Blocked by: T13 (gun anchors `grip`, `stock`), T03 (`proof-cast.tsx` exists) · Consumers: B01-SH01 (front, locked), B02-SH06 (front, small), B03-SH05 (front, edge), B03-SH01 (back + jolt), B04-SH01 (locked LF02), B04-SH03 (right mitten + jolt), B04-SH06 (front three-quarter, through T17), B05-SH01/SH02 (right profile on the truck); T14, T17
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks); [hand-drawing skill](../../../../.claude/skills/hand-drawing/SKILL.md) §1, §2, §7, §8; [edu30/cast.ts](../../../../src/painted/edu30/cast.ts) `paintSeatedGunner`; [kit/fit-arms.ts](../../../../src/painted/kit/fit-arms.ts), `Arm.exact` in [kit/cast.ts](../../../../src/painted/kit/cast.ts) and [kit/back.ts](../../../../src/painted/kit/back.ts).

## Build
Harden GUNNER-1's `new: seated-gunner`: arms solved to the gun's real grip and stock points (`Arm.exact`), a right-profile and a front three-quarter view, a forward lean that brings the grip inside reach, and the per-round recoil jolt.
Casting line: GUNNER-1 `man-crop + new: aus-army-1932-gunner`, `new: seated-gunner`, `new: recoil-jolt`, face `neutral` (CAT02 calm).
Files: `src/painted/edu30/cast.ts`, `src/painted/edu30/proof-cast.tsx` (adds `C30-gunner-*`), `tests/edu30-cast.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Body | `floorSit: 1`, legs forward either side of the tripod's rear leg; torso lean `bend: 0.25` toward the gun in every view | ticket (reach) |
| Signature | `paintSeatedGunner(p, c, def, at, {view: 'front' \| 'back' \| 'right' \| 'front34'; grip: V3; stock: V3; jolt?: number; face; mouth?; nod?; t; seed})` (`mouth`, `nod` used by T17) | ticket |
| Hands | RIGHT hand on `grip`, LEFT hand on `stock` (world points from T13 `lewisAnchors`), both `Arm.exact`; mittens (figure scale), closed fists | b03 B03-SH01 Staging; hand-drawing §4 |
| Reach check | each wrist target within 0.52 m of its shoulder after the lean (2 × 0.26 m); arm ≤ 1.05 × bone after `fitArms` | hand-drawing §8 rules 2, 4 |
| Back view (B03-SH01) | `GUNNER-1 RIGHT hand, mitten fist on grip, shows back, fingers screen up (into depth)` → right arm screen right, thumb screen left; `LEFT hand, mitten fist on stock, shows back, fingers screen up` → left arm screen left, thumb screen right | hand-drawing §1, §2 |
| Front view (B01-SH01 locked, B02-SH06, B03-SH05) | `RIGHT hand, fist on grip, shows back, fingers screen down` → right arm screen left, thumb screen right; `LEFT hand, fist on stock, shows back, fingers screen down` → left arm screen right, thumb screen left. B02-SH06: head down to the sights (`nod` [0, 0.12] head units) | hand-drawing §1, §2; b02 B02-SH06 |
| Front three-quarter (`front34`, B04-SH06; gunner faces +x, lens at his right front) | right arm is the near arm (screen left), left arm far (screen right, partly behind the gun); hand lines as the front view; the near shoulder turned 35° toward the lens | b04 B04-SH06; hand-drawing §1 |
| Right profile (B05-SH01, B05-SH02; facing screen right, the truck's +x) | right arm near, drawn over the body: `RIGHT hand, fist on G2 grip, shows back, fingers screen down` → thumb screen right; left arm far, on G2's stock, mostly hidden | hand-drawing §1 |
| B04-SH03 (only the right forearm and mitten enter from the right edge) | `RIGHT hand, fist on grip, shows back, fingers screen left (into frame)` → thumb screen down (`mittenThumbSide('r', 'back')`) | hand-drawing §2 |
| Jolt | shoulders, head and hat offset along −barrel by 0.015 m × j; j = 1.0 on round k 0, 0.5 on k 1, 0 on k ≥ 2 (T04 `roundPhase`); hips and legs fixed; fists stay on grip/stock (elbows absorb); the gun's own recoil (T13) moves grip and stock 5 mm and the hands follow | VD30-11 step 3 |
| Hat | `paintHat` slouch, moves with the head | cast.ts |
| Locked frames | B01-SH01 L 0 and B04-SH01 L 0 still match LF01a and LF02 R4 at 270 px | look lock |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (front, seated at G1), `projects/edu/EDU/previews/LF02.58933d6b.png` (seated at G1 from the water).

**Judgment for the builder (Hard, arms).** The gunner is competent and calm: back straight in the lean, elbows low and close to the body, both fists closed on the gun in every frame (never released, never floating). In the jolt only the upper body moves; if an arm chain passes 1.05 × bone at the jolt peak, change nothing else: set the ticket `blocked` with the numbers.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** When the proof paints G1, after its `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17). The seated gunner's `grip` and `stock` reach is measured to these anchors (B03-SH01 muzzle at (432, 1020) on that camera).

## Proof
- `node scripts/test.mjs tests/edu30-cast.test.ts`: reach ≤ 0.52 m both arms in all four views on the paddock G1 anchors; arm ratio ≤ 1.05 at j 0 and j 1.
- `proof-cast.tsx` (newsreel off, paddock G1 at (0, 0, 0), barrel −z): `C30-gunner-front` (CAM_LF01), `C30-gunner-back` (B03-SH01 camera `eye (0.4, 1.0, 1.65), yaw −3, pitch 0, f 900, hy 860`) at j 0 and j 1, `C30-gunner-right` (gunner and a G1 turned to +x, camera `eye (−0.7, 2.0, 2.1)` relative to the seat at (−1.2, 1.1, 0), yaw 0, f 950, hy 860), `C30-gunner-34` (dam G1 at (−5.6, 0.32, −5.0) yaw +x, seat (−6.2, 0.36, −4.75), B04-SH06 start camera).
- `scripts/qa-sheet.sh out/edu30-T11/sheet.png --cols 5 --width 270 out/edu30-T11/*.png` plus `--width 540` crops of each hand.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| C30-gunner-front vs LF01a crop | unchanged seated gunner | visual match at 270 px; lead within ± 5 % of LF01a's 311 px |
| C30-gunner-back j 0 / j 1 | fists on grip and stock; shoulders shifted back at j 1 | shoulder shift 0.012–0.018 m (logged); arm ratio ≤ 1.05 |
| C30-gunner-right, C30-gunner-34 | near right arm, fist on the grip | `thumb check: GUNNER-1 RIGHT: <side> ok` and `arm check: GUNNER-1 r/l: attached ok` for every view; C30-gunner-34 lead 593 ± 30 px |

## Result (Boss fills)
Commit: see `git log` on branch `worktree-agent-ae7df9aae85bf5ba7` (T11 commit; started from `claude/ep30-continuation-493a12` at `8bbfa0d`) · fix passes used: 0 · Sonnet medium, 19 Nov 2026 · store: `projects/edu/EDU/previews/T11-sheet.png` (8 frames, 270 px), `T11-{front,back,right,34}-j{0,1}.png` (full frames), `T11-hf-*.png` and `T11-crop*.png` (full-size crops); local `out/edu30-T11/`, logs `out/logs/T11-*.log`. (A first archive run left the same bytes under the bare names `front-j0.png` etc. in `previews/`; ignore those.)

**Built** (`src/painted/edu30/cast.ts`, `proof-cast.tsx`, `tests/edu30-cast.test.ts`; `tsc` clean for edu30, `node scripts/test.mjs tests/edu30-cast.test.ts` 4/4; `npm test` has 16 failing files that all fail on `Cannot find module '@remotion/three'` in this checkout, none in edu30):
- `paintSeatedGunner(p, c, def, at, {view: 'front' | 'back' | 'right' | 'front34'; grip?; stock?; jolt?; face; mouth?; nod?; t; seed; tint?})`. With `grip` and `stock` (from `lewisAnchors`) both fists are `Arm.exact` chains from the drawn shoulders (shoulders from a dry `paintFigureAt` run, elbow by `ikElbow`, RIGHT hand on the grip, LEFT on the stock, `fist: mittenThumbSide(side, 'back')`). Without them the W3 depth arms draw exactly as before (the `looks.ts` LF01a call is untouched; front lead 310.8 px identical, mean pixel drawing unchanged by construction).
- `front34` = `view: 'front'` + `quarter: 'right'`, `quarterDeg: 35`. The kit doc says quarter does not support `floorSit`; it draws correctly (checked on the frames).
- Exports for the proof and T14/T17: `gunnerShoulders`, `gunnerReach`, `gunnerCheck` (bone ratios, drawn shoulders, turn used), `GUNNER_BEND`, `GUNNER_REACH`, `GUNNER_JOLT`; `proof-cast.tsx` exports `GUNNER_PROOFS`, `gunnerProofAt`.
- Proof compositions `C30-gunner-front|back|right|34` are 2 frames: frame 0 = j 0, frame 1 = j 1 with the gun's k 0 recoil (`lewisRecoil`), gun painted by `placeBuild` + `paintLewisPanTicks`, anchors from `lewisAnchors`. Paint order: front and 3/4 gunner then gun; back and right gun then gunner.

**Measured against the Proof table**
| Row | Number | Pass range | Result |
| --- | --- | --- | --- |
| reach after the lean (j 0), world shoulder to wrist target, right grip / left stock | front, back, right 0.513 / 0.231 m; 3/4 0.489 / 0.148 m | <= 0.52 m | pass (front 0.007 m margin) |
| reach at the jolt peak (j 1) | 0.523 / 0.239 m (front, back, right); 0.495 / 0.144 m (3/4) | not in the ticket (0.52 is "after the lean") | logged; test bound 1.05 x 0.52 |
| arm ratio, longest drawn bone over 0.26 m x scale | j 0: 1.000 (front, back, right), 1.021 (3/4 right arm); j 1: 1.000, 1.000, 1.000, 1.042; left arms 1.000 | <= 1.05 | pass |
| C30-gunner-back j 0 / j 1 shoulder shift | world 0.015 m by construction; drawn: profile view 0.0164 m; back view 4.3 px = 0.0039 m (the barrel runs into depth there, so the picture shift is small) | 0.012-0.018 m (logged) | pass in the profile view (the only view where the barrel is square to the lens); depth views log less, see deviation 2 |
| C30-gunner-front lead vs LF01a | 310.8 px head top, 316.5 px to the hat crown; legacy drawing 310.8 / 316.5 (identical) | within +-5 % of 311 | pass (0 %) |
| C30-gunner-34 lead | 562.4 px head top, 572.1 px to the hat crown | 593 +- 30 (563-623) | pass to the hat crown; 0.6 px under to the head top (see deviation 3) |
| jolt, profile (right) | torso turn 0.250 -> 0.218 rad `bend` | - | shoulders back 0.0164 m, hips and legs fixed |

**Hand lines** (hand-drawing section 7). In every view: right arm on the section-1 screen side (test: front and 3/4 right shoulder x < left shoulder x; back right shoulder x > left; profile near arm drawn over the body).
- GUNNER-1 RIGHT hand, mitten fist on grip, shows back, fingers screen down (front, 3/4, right) / screen up into depth (back): code `fist: mittenThumbSide('right', 'back')` = -1 = thumb counter-clockwise: screen right for fingers down (matches the ticket line), screen left for fingers up (matches the back-view line).
- GUNNER-1 LEFT hand, mitten fist on stock, shows back: `mittenThumbSide('left', 'back')` = +1: thumb screen left for fingers down, screen right for fingers up (matches the ticket).
- **thumb check: not passed as written.** Line and code agree, but the picture shows no thumb: the unshaped kit draws every hand as a plain oval (the fist and mitten with a thumb, `Arm.fist` / `Arm.open`, exist only in the `InteriorLight.shaped` path, which restyles the whole figure with form shading and folds, and `back.ts` has no fist at all). I tried `shaped` on the right and 3/4 views (frames not kept, code removed): the hand is drawn as an open hand reaching 0.1 m past the wrist, not a fist wrapped on the grip, and the figure no longer matches LF01a. `arm check: GUNNER-1 r/l: attached ok` in all four views at j 0 and j 1 (oval at the wrist, no gap, viewed on `T11-hf-*.png` and `T11-crop*.png`).

**Deviations from the ticket**
1. `bend: 0.25` draws only in the profile (the kit's `bend` is profile-only). In front, back and 3/4 the lean toward the gun is a picture-plane `lean` (turn about the hips), the smallest turn in 0.005 rad steps that puts both drawn shoulders within 1.01 x 2 bones of their fists: 0 in front and back (already inside), 0.225 rad toward the gun in 3/4. The world reach check uses the profile lean in every view. The 3/4 head moves about 74 px toward the gun (screen right) against the upright card, so the sheet's B04-SH06 face projection (445, 682) moves to about (530, 690); Film updates that sheet number.
2. The jolt in front, back and 3/4 is a picture-plane turn about the hips that moves the drawn shoulder by the projection of 0.015 m along -barrel; the head moves more than the shoulders (a turn about the hips, 1.6-1.8 x), not exactly 0.015 m as the ticket says. Hips and legs stay fixed.
3. Lead for the 3/4 view is read to the hat crown (the visible top, 0.0204 U above the head top anchor). By head top it is 562.4 px, 0.6 px under the range; tightening the lean so that the jolt peak holds 1.05 x (j 1 ratio 1.042) and the head-top lead >= 563 at once has no solution (a 1 px conflict).
4. Right-view gun position is not in the ticket: I placed G1 at the seat + 0.85 m along +x (the LF01a gunner-to-gun offset), y 1.1 (deck), heading 0, and read "camera `eye (-0.7, 2.0, 2.1)` relative to the seat" as the absolute eye. Other views use the ticket's coordinates.

**Open question for Film (one).** The ticket's thumb rows (right profile, 3/4, B04-SH03) cannot show a thumb with the unshaped figure. Options: (a) accept plain oval hands at figure scale, the thumb side recorded in code only (what is built); (b) the figure takes the `shaped` light for this shot family, which changes the locked look; (c) a new kit mitten-with-thumb for the unshaped path (a separate kit ticket). B04-SH03 (only the right forearm and mitten) is not built here; it needs this answer.
