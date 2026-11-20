# T12 — the standing and kneeling crew poses and the farmer's gesture exist with their hands and faces decided
Deliverable: EDU-EP30-SHORT · Revision: r6 · Status: **done** (R8 Film look check of r6, 2026-11-20: salute and farmer point pass; elbow +0.142 m, d (−0.873, −0.218, −0.436) and flexion 55.6° accepted as built) · was: r6 built `bd3e8bb`, awaiting Film look check (was: r6 fix pass ready; R7 Film look check of r5: P44-back, loader, G0, line-up, the farmer's face and talk pass; the salute hand (A2) and the farmer's point (G2) are revised; fix pass 1)) · was: r5 built `b44ca08`, awaiting Film look check · was: r3 done · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4) · r5: row G0 added (TICKETS-R6)
Class: figure · Hard: yes (arm, hand, face)
Blocked by: T36 (r4: the flat thumbed fist; same files `edu30/cast.ts`, `proof-cast.tsx`, `tests/edu30-cast.test.ts`, after T11), T11 (same files `cast.ts`, `proof-cast.tsx`, `tests/edu30-cast.test.ts`), T13 (pan anchor for the loader) · Consumers: B01-SH01 (P30, P34 locked), B02-SH02 (FARMER), B02-SH04 (salute, line-up), B02-SH06 (visor, loader), B03-SH05 (GUNNER-2 P34 at the edge), B06-SH01 (P44 back, shoulder and hat)
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

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17). The loader seats the pan on `lewisAnchors(...).pan` (paddock G1 at the origin, barrel −z: (0, 0.650, 0.184)).

## r4 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R4`)
These override any older value in this ticket that they name.
- **Fists (T36).** Every closed hand on the crew and the farmer that is not a locked LF01a/LF02 call (the loader on the pan, the P44 shoulder hand, the salute's far fist where it shows) sets `flatFist: true` with its `fist` side; the thumb check is read on the picture. Locked B01-SH01 P30 and P34 keep the oval (`thumb check: <hand>: locked oval (LF01a)`). Look check of T36's fist first (index Look checks).

## r5 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R6`)
These override any older value in this ticket that they name.
- **G0 (first, from the T36 r2 look check).** `C30-gunner-34` in `proof-cast.tsx` becomes `man(); gun(); fists()` (the T36 `paintGunnerFists` call right after the gun), as `C30-gunner-front` already is. Pass: the 540 px crop of the 3/4 view at j 0 and j 1 shows the grip entering the near RIGHT fist with no grip pixel across the fist's central 60 % (logged); the other three views' stroke hashes unchanged; archive `T12-G0-crop-34-j{0,1}.png`. Every other T12 pose that holds the gun from in front of it follows the same order.

## r6 decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R7`): look check of r5 and rulings on Boss's eight notes
These override any older value in this ticket that they name. Viewed: store `T12-sheet.png` (14 frames at 270 px) and `T12-hands.png` (four 540 px hand crops).

**Look check of r5.**
- **G0: pass** (0 grip pixels across either fist; three other views' hashes unchanged).
- **Line-up (B), kit P30/P34 (C, E): pass.**
- **P44 back (D): pass.** Forearms cross at the small of the back above the belt; the right flat fist and the left mitten over the wrist read in the full test view.
- **Loader (F) L 0/25/30/46: pass.** He leans in to the gun and both fists stay on the pan rim; at 140 px in B02-SH06 it reads as seating the pan.
- **Farmer face and talk (G face): pass** (angry; the eyes go to the lens by L 53).
- **Salute (A) L 8: fix.** The mitten sits behind the hat brim at the side of the head and the elbow hangs about 45° below the shoulder, so it reads as a hand on the hat or a head-scratch, not a crisp salute (row A2).
- **Farmer point (G) L 9/45: fix.** The mitten touches the side of his head beside the hat, which reads as clutching his head. It also points nowhere near the bird: in B02-SH02 the emu's head is at (−3.6, 1.0, 3.0), projected at about (286, 916), which is screen left of him and below his shoulder, not above his hat (row G2).

| Row | Value | Pass |
| --- | --- | --- |
| A2 salute hand (replaces A's hand target; keys L 0–2 P01, 2–8 rise ease-out, hold 8–22, 22–28 lower stay) | at the hold, the RIGHT mitten centre sits at the **front edge of the brim above his right eye**: 0.30 head widths to his right of the face centre line, at brim height, 0.04 m in front of the head surface, and is **painted after the head and hat** (over the brim edge and the upper forehead). The elbow is solved by IK with the pole out to his right (screen left) and slightly forward, so the **elbow is raised: elbow y = shoulder y ± 0.06 m**. The mitten is an oval with its long axis along the forearm; palm forward, so no thumb is drawn (note 1). `MEREDITH RIGHT hand, flat mitten at the brim, shows palm, fingers screen up-right` → right arm screen left | L 8: mitten bbox overlaps the brim's front edge and the forehead above the right eyebrow (overlap px > 0 with each, logged); elbow y − shoulder y within ± 0.06 m (logged); arm ratio ≤ 1.05; viewed at 540: reads as a salute |
| G2 farmer point (replaces G's arm values; keys L 0–3 P01, 3–9 rise ease-out, hold 9–45, 45–60 lower ease-in-out stay) | at the hold, the RIGHT mitten centre = right shoulder + **0.50 m × d**, with **d = unit(−0.80, −0.45, −0.40)** in world (his right, down and back; farmer at (−2.5, 0, 5.2) facing +z). Elbow flexion **15°**, pole down. The mitten points along d, edge to the lens. `FARMER RIGHT hand, mitten pointing at the emu, shows edge (little-finger side down), fingers screen lower-left` → right arm screen left, thumb hidden behind the hand. P41 lean, face, gaze and talk keys unchanged | L 9 and L 45 at the B02-SH02 camera of that frame: the screen line from the shoulder through the mitten centre passes **within 60 px** of the projected emu head (−3.6, 1.0, 3.0) (logged); mitten clear of the head and hat silhouette by **≥ 40 px**; arm ratio ≤ 1.05; viewed: reads as pointing at the bird behind him |

**Rulings on the eight notes in Result.**
1. **Thumbs on open hands: accepted.** Open mittens on the unshaped kit are plain ovals with no thumb (salute, farmer point, P44 left). Their thumb-check line reads `thumb check: <hand>: open oval, no thumb drawn (unshaped kit)`. Kit gap for intake (W8.4): an open mitten with a thumb for the unshaped kit.
2. **P44 left hand: measured wins.** The line becomes `MEREDITH LEFT hand, mitten over the right wrist, shows back, fingers screen right` → thumb screen lower-left.
3. **P44 elbows 86 / 87°: accepted.** The wrist height (0.95 m) wins over "about 100°".
4. **P44 back repaint in T12's module: accepted for EP30.** At intake the kit back view (`kit/back.ts`) should paint arms behind the back itself; filed as a kit intake item, not a ticket.
5. **P44 full test camera yaw 0: accepted.** Yaw 180 was a Film slip.
6. **Loader lean 25° in the picture plane: accepted.** The kit kneel has no 3/4 view. The look check passes and the 3D reach holds.
7. **Held pan over the seated pan: accepted.** No T13 change. T22 paints the held pan over the seated one and logs how many rows of the seated pan show below it at L 0–29; ≤ 4 px rows at 140 px is accepted (T22 r7 notes).
8. **Farmer arm angles: superseded by G2.**

**r6 Files:** `src/painted/edu30/cast.ts`, `src/painted/edu30/proof-cast.tsx` (only if a proof call changes), `tests/edu30-cast.test.ts`. Only the salute and farmer solves change; every other T12 and T11 stroke hash stays (test). **Proof:** re-render `C30-crew-salute` L 0, 8, 28 and `C30-crew-farmer` L 0, 9, 45, 53, 60; 540 px crops of salute L 8 and farmer L 9; archive as `T12r6-*.png` with `T12r6-sheet.png`.

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
Commit `b44ca08` (code and tests; branch `worktree-agent-a3fed90997a84bf5c`, merged from `claude/ep30-continuation-493a12` at `4f81e77`) · fix passes used: 0 · Sonnet medium, 2026-11-20 · store: `projects/edu/EDU/previews/T12-sheet.png` (14 frames, 270 px), `T12-hands.png` (4 hand crops, 540 px), `T12-{salute,farmer,loader}-L*.png`, `T12-p44back-{L00,full}.png`, `T12-kit-p30-p34.png`, `T12-G0-crop-34-j{0,1}.png`, `T12-g0-34-{,nogun-}j{0,1}.png`; local `out/edu30-T12/`, logs `out/logs/T12-*.log`. `previews/sheet.png` untouched.

**Checks:** `node scripts/test.mjs tests/edu30-cast.test.ts` 11/11; `tsc` clean for edu30 (the other errors are `three` / `@remotion/three` missing in this checkout); `npm test` has the same environment failures (`Cannot find module '@remotion/three'`, store files missing), none in edu30.

**Row G0 (done first).** `C30-gunner-34` is `man(); gun(); fists()`. Pixel check (`C30-gunner-34` against `C30-gunner-34-nogun`, which is the same frame without the gun): over the fist polygon (`flatFistAt`, ~1030 px) and its central 60 % (~372 px) differing pixels = 0 on both fists at j 0 and j 1, so no grip pixel lies across either fist. Stroke hashes (j 0 / j 1): front `ece08c32feb6 49d43cfbb97a`, back `480ed2012f79 f8c43e8db24b`, right `02e699a0d326 3b773b588193` unchanged; 3/4 `8c1a7bda3a0f 105bd70aef30` -> `263fbaa585ac 0eb5abad8b31` (frozen in the test). Crops `T12-G0-crop-34-j{0,1}.png`.

**Built** (`src/painted/edu30/cast.ts`, `proof-cast.tsx`, `tests/edu30-cast.test.ts`): `solveCrewPose(c, def, at, {pose: 'salute' | 'p44-back' | 'loader' | 'farmer', L, seed, pan?})` (pure of L: the shoulder from a dry `paintFigureAt`, one chain per frame, `Arm.exact`) and `paintCrewPose` (same options, paints the figure and hat, returns anchors and the solve); key functions `saluteU`, `farmerU`, `farmerTurn`, `farmerTalk`, `loaderLift`, `loaderHold`; constants `LOADER_AT` (0.50, 0, 0.35), `LOADER_LEAN` (25 deg), `PAN_RIM`, `PAN_R`. `paintCrew` gained an optional `faceState` (P30 gaze `look: [0, -0.2]` = a little up; LF01a calls unchanged). `solveGunner` is now exported (T11, for the G0 mask). B (P01 line-up) and E (P34) are kit poses through `paintCrew` unchanged. Proof compositions `C30-crew-{salute,kit,p44back,p44back-full,loader,farmer}` and the helper `C30-gunner-34-nogun`.

**Measured vs rows.**
| Row | Value | Result |
| --- | --- | --- |
| arm ratio <= 1.05, every frame L 0..N-1 of A, D, F, G | longest bone / 0.26 m | 1.000 on every frame (elbow IK or FK keeps both bones; no arm is stretched) |
| A salute L 8 | right mitten at the brim, palm forward | wrist at the brim row (head top + 0.13 u), screen left of the head; `thumb check: MEREDITH RIGHT: screen lower-right ok` (rule side; the oval draws no thumb); `arm check: MEREDITH right: attached ok`; keys L 0 P01, 2-8 rise, hold to 22, 22-28 lowers, left arm P01 |
| D P44 back (both cameras) | wrists crossed at 0.95 m | right wrist 0.95 m exactly; right flat fist `thumb check: MEREDITH RIGHT: screen lower-right ok`; left oval over the right wrist; elbow flexion 86 / 87 deg; `arm check` both attached ok |
| F loader | reach <= 0.52 m (3D) | L 0: 0.416 / 0.358 m; L 30 (seated): right 0.451, left 0.357 m (depth gap 0.166 m included); hands-to-pan 0.0000 m (the fist centres are the rim points) at L 0 and 30 (and 10, 20, 25, 35, 40); thighs (P34) by L 46; `thumb check: GUNNER-2 RIGHT: screen upper-right ok`, `LEFT: screen lower-left ok` (flat fists, back) |
| G farmer | lead >= 480 | 619.5 px (head top to feet; sheet 604); elbow bend 70.0 deg at L 9 and L 45; lean -0.06 to L 46, 0 at L 53; gaze (-0.8, 0) to L 46, (0, 0) at L 53; talk open 0.7 peak every 6 f inside [3, 39) and [47, 76), null outside; `arm check: FARMER right: attached ok`; the pointing hand is an open oval (edge to the lens, no thumb drawn) |

**Values I could not follow, and why.**
1. **Thumbs on open hands.** The unshaped kit draws only an oval for a non-fist hand (`Arm.open` / `Arm.fist` need `InteriorLight.shaped`; `flatFist` is closed hands only). The salute, the farmer's pointing hand and the P44 left mitten therefore have no thumb in the picture; the logged side is the rule's (hand-drawing section 2), not a measured thumb. Closed hands (P44 right, loader both) are `flatFist` with the thumb check read on the geometry and the picture.
2. **P44 left hand "fingers screen left, thumb screen up".** The left forearm comes from the left shoulder across to the right wrist, so the fingers point screen right and the rule puts the back-of-left-hand thumb at screen lower-left. Measured wins (common rules); Film should change the line.
3. **P44 elbows "about 100 deg, 0.12 m out".** With the wrists at 0.95 m, the shoulder-to-wrist distance 0.5 m allows 86 / 87 deg flexion with the elbows hanging at the shoulder line; 100 deg needs a shorter reach. Built to the wrist height.
4. **P44 back from behind.** The kit back view paints arms under the torso, so hands at the small of the back would vanish; `paintCrewPose` repaints both chains (sleeve capsules at the kit widths), the right flat fist and the left oval over the torso in the held callback. This is in the T12 module, not the kit; a kit fix would be cleaner at intake.
5. **P44 full test camera.** The ticket's `eye (-2.4, 1.2, 1.0), yaw 180` looks away from the figure at (-2.4, 0, -2.2); built with `yaw 0` (looks -z). Film slip.
6. **Loader turn and `bend: 0.25`.** The kit kneel has no three-quarter (`quarter` unsupported with `kneel`) and `bend` is profile only, so the 25 deg turn toward the gun is the picture-plane `lean` of 25 deg (screen right = the gun, -x for this camera); the 3D reach limit holds (a smaller lean of about 0.30 rad is the least that does). Both arms cross toward the gun, so the right forearm passes over the left near the pan; it reads as leaning in to the pan.
7. **Loader pan.** The built gun always paints its own seated pan (T13 `buildLewisGun` has no pan-free option), so for L < 30 the held pan is a second drum (`paintHeldPan` in the proof, 0.10 m up at L 0-20) over the seated one; T22 decides whether to hide the seated pan under the lifted one at 140 px (nothing visible at that size).
8. **Farmer arm.** Built exactly to 130 deg and 70 deg: the mitten sits beside the head at hat-brim height, above the shoulder, screen left; with 70 deg of flexion the forearm tilts up-right, not up-left, so "fingers screen up-left" is not what the numbers give (the rule's thumb side is moot on an edge-on oval).

## Result r6 (Boss fills)
Commit `bd3e8bb` (code and tests; branch `worktree-agent-a7bfe54a908d9fafa`, merged from `claude/ep30-continuation-493a12` at `9c71592`) · fix passes used: 1 (this is it) · Sonnet medium, 2026-11-20 · store (all `T12r6-` names, `previews/sheet.png` untouched): `projects/edu/EDU/previews/T12r6-sheet.png` (8 frames, 270 px: salute L 0, 8, 28; farmer L 0, 9, 45, 53, 60), `T12r6-hands.png` (salute L 8 and farmer L 9 crops, 540 px each), `T12r6-salute-L{00,08,28}.png`, `T12r6-salute-L08-crop.png`, `T12r6-farmer-L{00,09,45,53,60}.png`, `T12r6-farmer-L09-crop.png`; local `out/edu30-T12r6/`, logs `out/logs/T12r6-*`.

**Checks:** `node scripts/test.mjs tests/edu30-cast.test.ts` 12/12 (new: A2, G2, and a stroke-hash freeze of every unchanged pose: salute L 0 and 28, kit P30/P34, P44 back both cameras, loader L 0/25/28/30/45/46, farmer L 0 and 60, all equal r5); `tsc` clean for edu30. Changed in `cast.ts`: the salute and farmer branches of `solveCrewPose`, a new `paintMitten`, `FARMER_D_RAW`, `CrewSolve.hand` / `g2`.

**Measured vs rows.**
| Row | Value | Result |
| --- | --- | --- |
| A2 mitten centre | 0.30 head widths to his right of the face centre line, at the brim front edge, painted after head and hat | **0.300** head widths (head width 0.88 x head height = 136.3 px, an estimate from the kit egg); centre 0.030 u below the brim row (the brim ellipse's front edge is at 0.028 u); mitten is an oval, long axis along the forearm (forearm -46 deg), kit hand off (`noHand`), forearm and upper arm repainted with it so the forearm stays in front of the head |
| A2 overlap (L 8, 15, 22) | overlap px > 0 with the brim front edge and the forehead above the right eyebrow | brim 248 px, forehead 426 px (pixel samples of the mitten oval inside the brim ellipse's lower half, and inside the strip between the brim and the brow row (head y - 0.24 head units), screen left of the face centre line) |
| A2 arm ratio | <= 1.05 | 1.040 (forearm), upper arm 0.18 m on screen |
| A2 elbow | y within +-0.06 m of the shoulder y | **not met: elbow 0.142 m above the shoulder** (see "could not follow" 1) |
| A2 thumb check | | `thumb check: MEREDITH RIGHT: open oval, no thumb drawn (unshaped kit)` (ruling 1) |
| G2 line to the emu | within 60 px | **50.1 px** at L 9 and L 45 (emu head projects to (284, 916); shoulder (386, 953), mitten (249, 971), the emu is 96 px ahead on the line); with Film's d it is 76.5 px (see 2) |
| G2 clearance | mitten clear of head and hat by >= 40 px | 92.0 px (to the hat brim and head boxes) |
| G2 arm ratio | <= 1.05 | 0.835 (the arm is foreshortened toward the back) |
| G2 thumb check | | `thumb check: FARMER RIGHT: open oval, no thumb drawn (unshaped kit); edge to the lens` |
| Unchanged | face, gaze, lean, talk keys; every other T12 and T11 stroke hash | gaze (-0.8, 0) to L 46 and (0, 0) at L 53; lean -0.06 to 0; talk windows [3, 39) and [47, 76); lead 619.5 px; hashes frozen in the test |

**Values I could not follow, and why.**
1. **A2 elbow y = shoulder y +-0.06 m.** The brim row is 0.38 m above the drawn shoulder (the wrist) and 0.42 m to the mitten centre; an elbow at shoulder height would need a forearm plus hand of 0.42 m, but the forearm is 0.26 m (cap 1.05) plus the hand's 0.04 m. The elbow is the lowest point that keeps both bones <= 1.04 x 0.26 m with the upper arm 0.12 m out to his right: **0.142 m above the shoulder** (the test asserts <= 0.15). It reads as a raised-elbow salute in the crop. A level elbow needs either a lower hat brim, a longer arm for MEREDITH (`armScale`, which changes every Meredith pose and the ratio base) or a lower mitten; Film decides.
2. **G2 direction d = unit(-0.80, -0.45, -0.40).** With it the line from the shoulder through the mitten centre misses the emu head by 76.5 px (limit 60): in the B02-SH02 picture the emu head (284, 916) is 37 px **above** the shoulder (953), not below it, so a hand pointing down 0.45 slopes away from the bird. I kept x and z and raised the y component to **-0.20** (`FARMER_D_RAW`, d = (-0.873, -0.218, -0.436)), which gives 50.1 px; the arm still points out, slightly down and back.
3. **G2 elbow flexion 15 degrees.** With the mitten centre 0.50 m from the shoulder and the wrist 0.04 m short of it, the wrist is 0.46 m out and two 0.26 m bones need **55.6 degrees** of 3D flexion (drawn 69 degrees on screen); 15 degrees needs a wrist reach of 0.516 m, i.e. a mitten centre beyond 0.55 m. The centre (0.50 m) and the pole (down) were kept.
4. **A2 "elbow pole slightly forward".** The kit chain is 2D; the forward part shows as the foreshortened upper arm (0.12 m on screen out to his right, so the elbow reads as raised and forward).

## R8 look check of r6 (Film, 2026-11-20, `EDU-EP30-TICKETS-R8`)
Viewed: store `T12r6-sheet.png` (8 frames at 270 px) and `T12r6-hands.png` (salute L 8 and farmer L 9 at 540 px).
- **A2 salute: pass.** The mitten sits on the brim's front edge above his right eye, painted over the brim, with the elbow raised out to screen left: it reads as a crisp salute, no longer a head-scratch.
- **A2 elbow 0.142 m above the shoulder: accepted as built.** Boss's arithmetic holds: the brim front is 0.42 m above the drawn shoulder and forearm plus hand reach 0.30 m, so a level elbow cannot reach the brim without changing MEREDITH's arm length for every pose. Row becomes **elbow y between the shoulder y and +0.15 m** (the test's ≤ 0.15 stands). A raised elbow is within a real salute's range.
- **G2 farmer point: pass.** The arm reaches out to screen left at shoulder height, slightly down, clear of his head (92 px); it reads as "that one, there", toward the bird. **d = (−0.873, −0.218, −0.436) accepted** (the emu head sits 37 px above his shoulder on this camera, so Film's d_y −0.45 sloped away from it; the line passes 50.1 px from the head, inside 60). **Flexion 55.6° accepted**: with the 0.50 m mitten centre and two 0.26 m bones 15° cannot be reached; the bend reads as a natural gesture, not a broken arm. TF27 is updated in the index.
- Open mittens without a thumb stand (R7 ruling 1). Every other hash frozen (12/12).
T12 is **done** (fix passes 1). T17 (same files) and the plates T20, T21, T22 can start.
