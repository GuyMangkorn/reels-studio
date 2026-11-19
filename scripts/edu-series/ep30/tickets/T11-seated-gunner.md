# T11 — the seated gunner holds the gun in front, back, right-profile and front three-quarter views and jolts with each round
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: ready · r3: Film notes added (TICKETS-R3)
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
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
