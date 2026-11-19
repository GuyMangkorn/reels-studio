# T12 — the standing and kneeling crew poses and the farmer's gesture exist with their hands decided
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: figure · Hard: yes (arm, hand, face)
Blocked by: T11 (same files `cast.ts`, `proof-cast.tsx`) · Consumers: B02-SH02 (FARMER), B02-SH04 (salute, line-up), B02-SH05 (P44 back, loader), B03-SH04 (binoculars), B06-SH01 (P44 back, partial)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules) (Hard-ticket checks), [hand-drawing skill](../../../../.claude/skills/hand-drawing/SKILL.md) §1–3, 7, 8; [character-proportion pose sheet](../../../../docs/character-proportion-principles.md#cp-p-pose-sheet) for P01, P21, P34, P41, P44; [kit/poses-more.ts](../../../../src/painted/kit/poses-more.ts) (P34, P41, P44 have front and profile only, no back), [edu30/cast.ts](../../../../src/painted/edu30/cast.ts) `paintCrew`, [kit/head.ts](../../../../src/painted/kit/head.ts) `FaceState.look`, `open`.

## Build
Five pose additions in the episode cast module, each named as a casting line, plus their proof stills. Kit pose IDs are used where they match; the rest are `new:` and go to kit intake at W8.4.
Files: `src/painted/edu30/cast.ts`, `src/painted/edu30/proof-cast.tsx`, `tests/edu30-cast.test.ts`

## Decided values
| Pose (casting line) | Value | Source |
| --- | --- | --- |
| A. MEREDITH `man-parted + new: aus-army-1932-officer, P21, neutral` front (B02-SH04) | salute keys (shot-local): L 0–2 P01; L 2–8 the RIGHT hand rises to the hat brim at the right temple (ease-out); hold L 8–22; L 22–28 lowers to P01 (ease-in-out); hand line `MEREDITH RIGHT hand, flat mitten at the brim, shows palm (Australian palm-forward salute), fingers screen up-right toward the temple` → right arm screen left, thumb on the clockwise side = screen lower-right (toward the face); left arm P01 at the side, `LEFT hand, relaxed mitten, shows back, fingers screen down` → thumb toward the body midline (screen left) | b02 B02-SH04; hand-drawing §1–3 |
| B. GUNNER-1 `man-crop`, GUNNER-2 `man-buzz` `P01, neutral` front (B02-SH04 line-up) | kit P01 unchanged; hands as §3 "arms hanging relaxed": back of the hand, thumb toward the body midline | b02 B02-SH04 |
| C. MEREDITH `new: P44-back, neutral` (B02-SH05 full figure, B06-SH01 shoulder and hat only) | back view of "hands behind back": both forearms behind the lower back, wrists crossed at the sacrum (y 0.95 m on a 1.70 m figure); `MEREDITH RIGHT hand, mitten fist at the small of the back, shows back, fingers screen down` → right arm screen right, thumb screen right; `LEFT hand, mitten wrapped over the right wrist, shows back, fingers screen left` → left arm screen left, thumb screen up; elbows bent about 100°, out 0.12 m from the body sides | b02 B02-SH05, b06 B06-SH01; P44 description (CP-P04) |
| D. GUNNER-2 `man-buzz, new: loader-kneel-back, neutral` (B02-SH05) | kneeling body as P34 (`kneel`), back view, at **(0.50, 0, 0.35)** with the body turned 25° toward the gun (toward −x) and `bend: 0.25` (Film fix: from the sheet mark (0.75, 0, 0.45) the pan on G1 is 0.63 m from his near shoulder, beyond the 0.52 m reach; he is back at (0.75, 0, 0.45) by B03-SH04); both mittens on the pan rim (T13 `pan` anchor ± 0.11 m across the pan): pan held 0.10 m above its seat L 0–20, lowered L 20–30 (ease-in), seated L 30, hands stay on it to L 55; `GUNNER-2 RIGHT hand, mitten on the pan's right rim, shows back, fingers screen up (over the rim)` → right arm screen right, thumb screen left; `LEFT hand, on the left rim, shows back, fingers screen up` → left arm screen left, thumb screen right | b02 B02-SH05 Staging; hand-drawing §8 rule 4 |
| E. GUNNER-2 `P34, neutral` front (B01-SH01 locked, B03-SH04) | kit P34 unchanged (hands on thighs) | b01, b03 |
| F. FARMER `man-elder + new: wheatbelt-farmer-1932, new: point-back-over-shoulder, angry` front (B02-SH02) | L 0–3 P01; L 3–9 the RIGHT arm rises (ease-out): upper arm out and up 130° from the body side, elbow bent 70°, forearm pointing back over the right shoulder so the mitten sits beside and above the head on screen left; hold L 9–45; L 45–60 lowers to P01 (ease-in-out); `FARMER RIGHT hand, mitten pointing back, shows edge (little-finger side toward the camera), fingers screen up-left` → right arm screen left, thumb hidden behind the hand (clockwise rule gives screen right/behind); left arm P01 | b02 B02-SH02 Staging |
| F. FARMER face | expression `angry` throughout; gaze `look` = (−0.8, 0) (toward his right, screen left, at the emu behind his shoulder) L 0–46, eases to (0, 0) (the lens) L 47–53 together with a body `lean` of −0.06 rad → 0: the kit front head has no yaw, so the turn to the lens reads through the eyes and the lean (Film decision); talking mouth (kit `talk` mouth, `open`) cycling 0 → 0.7 → 0 every 6 f inside global [358, 394) and [402, 431), closed otherwise | b02 B02-SH02 VO; kit head.ts |
| G. MEREDITH `new: binoculars-at-eyes, neutral` front (B03-SH04) | binoculars prop (two tubes 0.11 m long, Ø 0.045 m, bridge, `#2b2a27`, strap to the neck); L 0–12 at the eyes: both mittens wrap the tubes, elbows down and forward (depth arms, `toCam` 0.6), forearms in front of the chest; L 12–24 both hands lower the binoculars to the chest (y 1.25 m), ease-in-out; L 24 on still holding them at the chest; `MEREDITH RIGHT hand, mitten wrapped under and over the right tube, shows back, fingers screen up` → right arm screen left, thumb screen left; `LEFT hand, same on the left tube, shows back, fingers screen up` → left arm screen right, thumb screen right; face neutral, eyes visible from L 14 | b03 B03-SH04 Staging; brief technical handoff (`new: binoculars-at-eyes`: both mittens at the eyes, elbows down and forward per depth arms) |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (MEREDITH, GUNNER-2 front, outfits, hats), `projects/edu/EDU/previews/LF02.58933d6b.png` (crew poses at the dam).

**Judgment for the builder (Hard, arms, face).** Every hand is a mitten (figure scale). Name each hand by the character's side; check its screen side against §1 for the view. The salute is crisp and proud (the joke is the size of the army, not the soldiers). The farmer is angry but not cartoon: one clear arm gesture, the arm chain continuous from shoulder to mitten. The loader's hands stay on the pan in every frame; the pan never floats free of both hands.

## Proof
- `node scripts/test.mjs tests/edu30-cast.test.ts`: arm ratio ≤ 1.05 on every key frame of A, C, D, F, G; loader reach ≤ 0.52 m both arms with the pan at its seat.
- `proof-cast.tsx` (newsreel off): `C30-salute` (B02-SH04 start camera) at L 0, 8, 28; `C30-p44back` and `C30-loader` (B02-SH05 start camera `eye (−0.8, 1.9, 3.95), yaw −4, pitch −8, f 880, hy 860`) at L 0, 25, 30; `C30-farmer` (B02-SH02 start camera `eye (−2.2, 1.45, 7.6), yaw −1, pitch −2, f 900, hy 860`) at L 0, 9, 45, 53, 60; `C30-bino` (B03-SH04 start camera `eye (−0.4, 1.35, −2.0), yaw 178, f 900, hy 860`) at L 0, 12, 18, 24.
- `scripts/qa-sheet.sh out/edu30-T12/sheet.png --cols 5 --width 270 …` and `--width 540` hand crops.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| C30-salute L 8 | right mitten at the brim on screen left, palm forward | `thumb check: MEREDITH RIGHT: screen lower-right ok` |
| C30-farmer L 9 / 53 | right arm pointing back over the right shoulder (screen left); eyes left then at the lens | FARMER lead ≥ 480 px (sheet 604); arm ratio ≤ 1.05 |
| C30-loader L 30 | pan seated on G1, both mittens on it | hands-to-pan distance ≤ 0.02 m (logged) |
| C30-p44back L 0 | hands crossed at the small of the back | `thumb check` lines for both hands |
| C30-bino L 0 / 24 | binoculars at the eyes / at the chest, eyes visible at 24 | arm ratio ≤ 1.05 at both |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
