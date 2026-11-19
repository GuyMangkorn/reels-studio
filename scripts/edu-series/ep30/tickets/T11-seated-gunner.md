# T11 — the seated gunner holds the gun in front, back and right-profile views and jolts with each round
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: figure · Hard: yes (arm, hand)
Blocked by: T13 (gun anchors `grip`, `stock`) · Consumers: B01-SH01 (front, locked), B02-SH05 (back), B03-SH01 (back + jolt), B03-SH04 (front), B04-SH01 (locked LF02), B04-SH03 (right mitten + jolt), B05-SH01, B05-SH02 (right profile on the truck)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules) (Hard-ticket checks), [hand-drawing skill](../../../../.claude/skills/hand-drawing/SKILL.md) sections 1, 2, 7, 8; [edu30/cast.ts](../../../../src/painted/edu30/cast.ts) `paintSeatedGunner` (W3 proposal arms), [kit/fit-arms.ts](../../../../src/painted/kit/fit-arms.ts), `Arm.exact` in [kit/cast.ts](../../../../src/painted/kit/cast.ts) and [kit/back.ts](../../../../src/painted/kit/back.ts).

## Build
Harden GUNNER-1's `new: seated-gunner` pose: arms solved to the gun's real grip and stock points (`Arm.exact`), a right-profile view, a forward lean that brings the grip inside reach, and the per-round recoil jolt.
Casting line: GUNNER-1 `man-crop + new: aus-army-1932-gunner`, `new: seated-gunner`, `new: recoil-jolt`, face `neutral` (CAT02 calm).
Files: `src/painted/edu30/cast.ts`, `src/painted/edu30/proof-cast.tsx` (new standalone still entry, compositions `C30-<name>`), `tests/edu30-cast.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Body | `floorSit: 1`, legs forward either side of the tripod's rear leg; torso lean `bend: 0.25` toward the gun in every view | ticket (reach) |
| Signature | `paintSeatedGunner(p, c, def, at, {view: 'front' \| 'back' \| 'right'; grip: V3; stock: V3; jolt?: number; face; t; seed})` | ticket |
| Hands | RIGHT hand on `grip`, LEFT hand on `stock` (world points from T13 `lewisAnchors`), both `Arm.exact`; mittens (figure scale, UT14), closed fist | b03 B03-SH01 Staging, hand-drawing §4 |
| Reach check | each wrist target within 0.52 m of its shoulder after the lean (2 × 0.26 m bone); arm length ≤ 1.05 × bone after `fitArms` | hand-drawing §8 rules 2, 4 |
| Arm side and thumb, back view (B02-SH05, B03-SH01) | `GUNNER-1 RIGHT hand, mitten fist on grip, shows back, fingers screen up (into depth)` → right arm on screen right, thumb screen left; `LEFT hand, mitten fist on stock, shows back, fingers screen up` → left arm screen left, thumb screen right | hand-drawing §1, §2 |
| Front view (B01-SH01 locked, B03-SH04) | `RIGHT hand, fist on grip, shows back, fingers screen down` → right arm screen left, thumb screen right; `LEFT hand, fist on stock, shows back, fingers screen down` → left arm screen right, thumb screen left | hand-drawing §1, §2 |
| Right profile (B05-SH01, B05-SH02; facing screen right, toward the truck's +x) | right arm is the near arm drawn over the body: `RIGHT hand, fist on G2 grip, shows back, fingers screen down` → thumb screen right; left arm far (behind the body), hand on G2's stock, mostly hidden by the near arm | hand-drawing §1 |
| B04-SH03 (only the right forearm and mitten enter from the right edge) | `RIGHT hand, fist on grip, shows back, fingers screen left (into frame)` → thumb per `mittenThumbSide('r', 'back')` = counter-clockwise of screen-left = screen down | hand-drawing §2 |
| Jolt | upper body (shoulders, head, hat) offset along −barrel direction by 0.015 m × j, j = 1.0 on round frame k 0, 0.5 on k 1, 0 on k ≥ 2 (T04 `roundPhase`); hips and legs fixed; hands fixed on grip/stock (elbows absorb the shift); the gun's own recoil (T13) moves `grip` and `stock` 5 mm, the hands follow those points | VD30-11 step 3 |
| Hat | `paintHat` slouch, moves with the head | cast.ts |
| Locked frames | B01-SH01 frame 0 and B04-SH01 frame 0 must still match LF01a and LF02 R4 at 270 px | look lock |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (front, seated at G1), `projects/edu/EDU/previews/LF02.58933d6b.png` (seated at G1, profile from the water).

**Judgment for the builder (Hard, arms).** The gunner is competent and calm: back straight in the lean, elbows low and close to the body, both fists stay closed on the gun in every frame (never released, never a floating hand). In the jolt only the upper body moves; if the arm chain stretches past 1.05 × bone at the jolt peak, reduce nothing else: report it in Result as blocked.

## Proof
- `node scripts/test.mjs tests/edu30-cast.test.ts`: reach ≤ 0.52 m both arms in all three views on the paddock G1 anchors; arm ratio ≤ 1.05 at j 0 and j 1.
- `proof-cast.tsx` compositions (newsreel off, paddock G1 at (0, 0, 0), barrel −z): `C30-front` (CAM_LF01), `C30-back` (B03-SH01 camera `eye (0.4, 1.0, 1.65), yaw −3, pitch 0, f 900, hy 860`) at j 0 and j 1, `C30-right` (gunner and a G1 turned to +x, camera `eye (−0.7, 2.0, 2.1)` relative to the gunner seat at (−1.2, 1.1, 0), yaw 0, f 950, hy 860).
- Stills every 1 f through a 3-frame jolt in `C30-back`; `scripts/qa-sheet.sh out/edu30-T11/sheet.png --cols 4 --width 270 …` plus `--width 540` crops of each hand.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| C30-front vs LF01a crop | unchanged seated gunner | visual match at 270 px; lead span within ± 5 % of LF01a's 311 px |
| C30-back j 0 / j 1 | fists on grip and stock; shoulders shifted back at j 1 | shoulder shift 0.012–0.018 m (logged); arm ratio ≤ 1.05 |
| C30-right | near right arm over the body, fist on the grip | thumb check lines in QA notes: `thumb check: GUNNER-1 RIGHT: <side> ok` for every view; `arm check: GUNNER-1 r/l: attached ok` |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
