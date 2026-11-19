# T12 — the standing and kneeling crew poses and the farmer's gesture exist with their hands and faces decided
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: figure · Hard: yes (arm, hand, face)
Blocked by: T11 (same files `cast.ts`, `proof-cast.tsx`, `tests/edu30-cast.test.ts`), T13 (pan anchor for the loader) · Consumers: B01-SH01 (P30, P34 locked), B02-SH02 (FARMER), B02-SH04 (salute, line-up), B02-SH06 (visor, loader), B03-SH05 (GUNNER-2 P34 at the edge), B06-SH01 (P44 back, shoulder and hat)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks); [hand-drawing skill](../../../../.claude/skills/hand-drawing/SKILL.md) §1–3, §7, §8; [pose sheet](../../../../docs/character-proportion-principles.md#cp-p-pose-sheet) P01, P21, P30, P34, P41, P44 ([kit/poses.ts](../../../../src/painted/kit/poses.ts), [kit/poses-more.ts](../../../../src/painted/kit/poses-more.ts): P34, P41, P44 have front and profile only); [edu30/cast.ts](../../../../src/painted/edu30/cast.ts) `paintCrew`; [kit/head.ts](../../../../src/painted/kit/head.ts) face `look`, `open`.

## Build
Pose additions in the episode cast module, each named as a casting line, plus proof stills. Kit pose IDs are used where they match; the rest are `new:` and go to kit intake at W8.4.
Files: `src/painted/edu30/cast.ts`, `src/painted/edu30/proof-cast.tsx` (adds `C30-crew-*`), `tests/edu30-cast.test.ts`

## Decided values
| Pose (casting line) | Value | Source |
| --- | --- | --- |
| A. MEREDITH `man-parted + new: aus-army-1932-officer, P21, neutral` front (B02-SH04) | salute keys (local): L 0–2 P01; L 2–8 the RIGHT hand rises to the hat brim at the right temple (ease-out); hold L 8–22; L 22–28 lowers to P01 (ease-in-out). `MEREDITH RIGHT hand, flat mitten at the brim, shows palm (Australian palm-forward salute), fingers screen up-right toward the temple` → right arm screen left, thumb clockwise = screen lower-right (toward the face); left arm P01: `LEFT hand, relaxed mitten, shows back, fingers screen down` → thumb toward the body midline (screen left) | b02 B02-SH04; hand-drawing §1–3 |
| B. GUNNER-1 `man-crop`, GUNNER-2 `man-buzz`, `P01, neutral` front (B02-SH04 line-up) | kit P01 unchanged; hands as §3 "arms hanging relaxed" | b02 B02-SH04 |
| C. MEREDITH `P30, neutral` front (B01-SH01 locked, B02-SH06) | kit P30 unchanged: the **LEFT** hand at the visor (kit P30 is a left-hand visor; LF01a uses it). Film fix: B02-SH06's "right mitten at the brow" is a slip; the locked look wins. `MEREDITH LEFT hand, flat mitten at the brow, shows back, fingers screen left` → left arm screen right; gaze to the far horizon (face `look` vertical component 0.2 toward up, in the kit head's sign convention), never down at the heads | kit poses.ts P30; LF01a; b02 B02-SH06 |
| D. MEREDITH `new: P44-back, neutral` (B06-SH01, shoulder and hat only, partial at the frame's top left) | back view of "hands behind back": both forearms behind the lower back, wrists crossed at the sacrum (y 0.95 m on 1.70 m); `MEREDITH RIGHT hand, mitten fist at the small of the back, shows back, fingers screen down` → right arm screen right, thumb screen right; `LEFT hand, mitten over the right wrist, shows back, fingers screen left` → left arm screen left, thumb screen up; elbows bent about 100°, 0.12 m out from the sides. Only the shoulder, upper arm and hat are in frame (sheet), but the chain is built whole | b06 B06-SH01; P44 (CP-P04) |
| E. GUNNER-2 `man-buzz, P34, neutral` front (B01-SH01 locked, B03-SH05 edge) | kit P34 unchanged (hands on thighs) | b01, b03 |
| F. GUNNER-2 `man-buzz, P34 body + new: loader-seat-pan, neutral` front (B02-SH06, about 140 px) | kneeling body as P34, at **(0.50, 0, 0.35)** turned 25° toward the gun (−x) with `bend: 0.25` (Film fix: from the sheet mark (0.75, 0, 0.45) the pan on G1 is 0.63 m from his near shoulder, beyond the 0.52 m reach; the shot is a hard cut from B03-SH05, where he is back at (0.75, 0, 0.45) at the frame edge); both mittens on the pan rim (T13 `pan` ± 0.11 m across): pan held 0.10 m above its seat L 0–20, lowered L 20–30 (ease-in), seated L 30, hands stay on it to L 40, then P34 hands on thighs by L 46. `GUNNER-2 RIGHT hand, mitten on the pan's right rim, shows back, fingers screen down (over the rim)` → right arm screen left, thumb screen right; `LEFT hand, on the left rim, shows back, fingers screen down` → left arm screen right, thumb screen left | b02 B02-SH06 Staging; hand-drawing §8 rule 4 |
| G. FARMER `man-elder + new: wheatbelt-farmer-1932, P41 body + new: point-back-over-shoulder, angry` front (B02-SH02) | P41 supplies the body lean only (its arm points at the viewer; the sheet's gesture points back). L 0–3 P01; L 3–9 the RIGHT arm rises (ease-out): upper arm out and up 130° from the side, elbow bent 70°, forearm pointing back over the right shoulder so the mitten sits beside and above the head on screen left; hold L 9–45; L 45–60 lowers to P01 (ease-in-out). `FARMER RIGHT hand, mitten pointing back, shows edge (little-finger side to the lens), fingers screen up-left` → right arm screen left, thumb hidden behind the hand; left arm P01 | b02 B02-SH02 Staging |
| G. FARMER face | `angry` throughout; gaze `look` (−0.8, 0) (his right, screen left, at the emu behind his shoulder) L 0–46, easing to (0, 0) (the lens) L 47–53 with a body `lean` −0.06 → 0 rad (the kit front head has no yaw: the turn reads through the eyes and the lean); talking mouth (kit `talk` mouth, `open` 0 → 0.7 → 0 every 6 f) inside local [3, 39) and [47, 76) (global [358, 394), [402, 431)), closed otherwise | b02 B02-SH02 VO; kit head.ts |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (MEREDITH, GUNNER-2 front, outfits, hats), `projects/edu/EDU/previews/LF02.58933d6b.png` (crew at the dam).

**Judgment for the builder (Hard, arms, face).** Every hand is a mitten. Name each hand by the character's side and check its screen side against §1 for the view. The salute is crisp and proud (the joke is the size of the army, not the soldiers). The farmer is angry but not cartoon: one clear arm gesture, the arm chain continuous from shoulder to mitten. The loader's hands stay on the pan while it moves; the pan never floats free of both hands.

## Proof
- `node scripts/test.mjs tests/edu30-cast.test.ts`: arm ratio ≤ 1.05 on every key frame of A, D, F, G; loader reach ≤ 0.52 m both arms with the pan at its seat.
- `proof-cast.tsx` (newsreel off): `C30-crew-salute` (B02-SH04 start camera `eye (−8.5, 1.3, 15.2), yaw 0, f 900, hy 860`) at L 0, 8, 28; `C30-crew-p44back` (B06-SH01 camera `eye (−1.6, 0.6, −1.0), yaw −6, pitch 6, f 1020, hy 900`) at L 0, plus the same figure on a full-body test camera `eye (−2.4, 1.2, 1.0), yaw 180, f 900, hy 860`; `C30-crew-loader` (camera `eye (0.5, 1.2, −2.2), yaw 180, pitch −8, f 1100, hy 860`, a close test view of the B02-SH06 action) at L 0, 25, 30, 46; `C30-crew-farmer` (B02-SH02 start camera `eye (−2.2, 1.45, 7.6), yaw −1, pitch −2, f 900, hy 860`) at L 0, 9, 45, 53, 60.
- `scripts/qa-sheet.sh out/edu30-T12/sheet.png --cols 5 --width 270 out/edu30-T12/*.png` and `--width 540` hand crops.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| C30-crew-salute L 8 | right mitten at the brim on screen left, palm forward | `thumb check: MEREDITH RIGHT: screen lower-right ok` |
| C30-crew-farmer L 9 / 53 | right arm pointing back over the right shoulder (screen left); eyes left, then at the lens | FARMER lead ≥ 480 px (sheet 604); arm ratio ≤ 1.05 |
| C30-crew-loader L 30 | pan seated on G1, both mittens on it | hands-to-pan distance ≤ 0.02 m (logged) |
| C30-crew-p44back (full test view) | hands crossed at the small of the back | `thumb check` lines for both hands; `arm check` both |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
