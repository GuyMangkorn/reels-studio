# WFOG-EP01-SHORT — scene-handoff index

Deliverable `WFOG-EP01-SHORT` (Thai Short, 1080×1920, 30 fps), Full tier, one composition. Shot and scene IDs below drop the `WFOG-EP01-SHORT-` prefix. No sequence blockout or runtime timeline exists yet.

| Item | Path / revision | Status |
| --- | --- | --- |
| Delivery record | [../../../scripts/world-fog/delivery.md](../../../scripts/world-fog/delivery.md) | target 60–90 s (user, 28 Oct 2026); visual engine painted 2D (p5.brush) |
| Script | `WFOG-SCRIPT-R2` ([script.md](../../../scripts/world-fog/short/script.md)); R2 = female narrator (`ฉัน`, one added `คะ`), no other change | beats `S01-B01`…`S04-B02`, clues CL01–CL05, claims `F001`, `F002`, `D001`, `D002` |
| Fact-check | `WFOG-FACTCHECK-R2` ([fact-check.md](../../../scripts/world-fog/short/fact-check.md)) | `ready-for-storyboard` for R2; PD01–PD07 carried (PD06 opening-only marker → phone insert reads as fiction on its own; PD07 stale male-narrator references, cleared in SS-R2 and brief R2) |
| Visual brief | [visual-brief.md](visual-brief.md) `VB-WFOG-EP01-SHORT-R2` (Film-owned; R2 lines edited by Mark under AI08, 29 Oct 2026) | `ready-for-mark`; VD01–VD16, SP01–SP03; R2 edits (VD03, VD09, VD15, voice note) await Film's review in its next pass |
| **Scene sheets** | `WFOG-EP01-SHORT-SS-R2` (Mark, 29 Oct 2026; supersedes SS-R1): [sc01.md](sc01.md), [sc02-b01.md](sc02-b01.md), [sc02-b02-b03.md](sc02-b02-b03.md), [sc02-b04.md](sc02-b04.md), [sc03.md](sc03.md), [sc04.md](sc04.md) | **`ready-for-dev`** · timing `estimated` (no TTS, read-aloud or blockout); narrator cue windows stale pending Premwadee TTS |
| Projection checks | [projection/](projection/) (15 inputs to `scripts/shot-projection.py`) | run 29 Oct 2026 on `e1fe80e`; results recorded in each shot block |
| User review page | SS-R1 page published 29 Oct 2026 (open item 7, verdicts applied here); SS-R2 page: coordinator | — |

## Readiness

`ready-for-dev` for SS-R2 means every beat has written shots, numeric staging/camera values, event frames, cues, Sound lines, entry/exit states and acceptance criteria. It permits Boss/Editor work once the coordinator authorizes them; it is not user approval and proves nothing about runtime, audio or the look. Event frames are estimates from the script layout (87 s); re-time after TTS (PD04) without moving the order of events. R2 changes the narrator's voice (female, `th-TH-PremwadeeNeural`) and adds one syllable (`คะ`, S04-SH01), so every narrator cue window is stale until TTS exists. Spikes SP01–SP03 (brief) gate polish of the shots that depend on them, listed under [dependencies](#shared-elements-and-dependencies).

## Scene / shot order and timeline mapping

One composition; composition frames are "global" (`G`). Scene-local = G − scene offset. Shot-local `f` = G − shot start. Ranges are half-open.

| Shot | Review title (TH) | Beat | G range | Len | Scene-local | Setup | Claims / clues | Runtime mapping (planned) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S01-SH01 | เงาข้างทางผ่านกระจกหน้ารถ | S01-B01 | [0, 126) | 126 | S01 [0, 126) | CAM-CAR | CL01 plant, D001 | painted shot 0 |
| S01-SH02 | จอดรถก่อนหมอกปิด | S01-B01 | [126, 240) | 114 | S01 [126, 240) | CAM-FORECOURT | F001 | painted shot 1 |
| S02-SH01 | ในร้าน รถหายไปในหมอก | S02-B01 | [240, 354) | 114 | S02 [0, 114) | CAM-COUNTER-IN | torch plant | painted shot 2 |
| S02-SH02 | ข่าวในมือถือ | S02-B01 | [354, 444) | 90 | S02 [114, 204) | CAM-PHONE | D001 | painted shot 3 |
| S02-SH03 | พนักงานมองเลยไปที่กระจก | S02-B01 | [444, 540) | 96 | S02 [204, 300) | CAM-COUNTER-OUT | — | painted shot 4 |
| S02-SH04 | เงาเดินเข้ามาในกรอบประตู | S02-B02 | [540, 738) | 198 | S02 [300, 498) | CAM-GLASS-OUT | CL01, CL04 wobble, CL05 | painted shot 5 |
| S02-SH05 | มุมต่ำ ล้อที่ลากพื้น | S02-B02 | [738, 792) | 54 | S02 [498, 552) | CAM-LOW-SHELF | CL02 | painted shot 6 |
| S02-SH06 | “ตัวเดียวกัน” | S02-B02 | [792, 900) | 108 | S02 [552, 660) | CAM-INT-REV | D001/D002 | painted shot 7 |
| S02-SH07 | เคาะกระจกสามครั้ง | S02-B03 | [900, 1029) | 129 | S02 [660, 789) | CAM-GLASS-OUT | CL03 | painted shot 8 |
| S02-SH08 | หมอบหลังชั้นวาง | S02-B03 | [1029, 1230) | 201 | S02 [789, 990) | CAM-LOW-SHELF | CL02 (wheel) | painted shot 9 |
| S02-SH09 | “หัว” ไถลแล้วถูกรับไว้ | S02-B04 | [1230, 1410) | 180 | S02 [990, 1170) | CAM-GLASS-OUT (match) | CL04 | painted shot 10 |
| S02-SH10 | “นั่นหัวมันเหรอ?” | S02-B04 | [1410, 1530) | 120 | S02 [1170, 1290) | CAM-LOW-CU | D002 | painted shot 11 |
| S03-SH01 | เสียงคนธรรมดา | S03-B01 | [1530, 1656) | 126 | S03 [0, 126) | CAM-LOW-SHELF | CL05 | painted shot 12 |
| S03-SH02 | ยกไฟฉายขึ้น | S03-B01 | [1656, 1800) | 144 | S03 [126, 270) | CAM-INT-REV | PD03 | painted shot 13 |
| S03-SH03 | มุมเดิม แต่มีแสง | S03-B02 | [1800, 1920) | 120 | S03 [270, 390) | CAM-GLASS-OUT (match) | CL01–CL05 payoff | painted shot 14 |
| S03-SH04 | หมวกกันน็อกบนกล่องใบเดิม | S03-B02 | [1920, 1962) | 42 | S03 [390, 432) | insert of CAM-GLASS-OUT | CL04 payoff | painted shot 15 |
| S03-SH05 | ด้ามร่มในมือเดิม | S03-B02 | [1962, 2034) | 72 | S03 [432, 504) | insert of CAM-GLASS-OUT | CL03 payoff | painted shot 16 |
| S03-SH06 | ล้อที่ติดขัด | S03-B02 | [2034, 2070) | 36 | S03 [504, 540) | insert of CAM-GLASS-OUT | CL02 payoff | painted shot 17 |
| S03-SH07 | เปิดประตูให้เข้ามา | S03-B02 | [2070, 2160) | 90 | S03 [540, 630) | CAM-INT-SIDE | F002, PD03 | painted shot 18 |
| S04-SH01 | “รถชนกันขวางถนน” | S04-B01 | [2160, 2400) | 240 | S04 [0, 240) | CAM-INT-2S | D001 | painted shot 19 |
| S04-SH02 | หันไปมองทางเข้า | S04-B01 | [2400, 2520) | 120 | S04 [240, 360) | CAM-INT-DOOR-REV | — | painted shot 20 |
| S04-SH03 | ไฟลานปั๊มดับหายในหมอก | S04-B02 | [2520, 2610) | 90 | S04 [360, 450) | CAM-GLASS-OUT | — | painted shot 21, hard-cut end |

22 shots, 2610 frames = 87.0 s (estimated). The Thai review titles are for the coordinator's [user review page](../../../docs/mark-storyboard-workflow.md#user-storyboard-review-page); each shot block owns its full Thai VO, what is seen (Direction) and Sound. Story scenes → sheets: S01 → sc01.md; S02 → sc02-b01.md (B01), sc02-b02-b03.md (B02–B03), sc02-b04.md (B04); S03 → sc03.md; S04 → sc04.md. Planned runtime: one `painted` scene with `painted.shots[]` in timeline order (existing contract, `src/scenes/painted.ts`); Editor records the actual path/index here.

## Shared staging constants (`MK-WF-ST`)

Spaces follow the brief's [projection contract](visual-brief.md#projection-contract): `WORLD-SHOP` metres, origin on the floor under the centre of the glass front, +x right as seen from inside, +y up, +z outward (negative z inside). `PLATE` px, top-left origin, Y down. Projection per setup: `k(d) = f / d` px/m with `d` the depth from the camera along its view axis; screen `x = 540 + f·(x − cx)/d` for a camera looking +z, `540 − f·(x − cx)/d` looking −z (−x is then on screen right), `540 + f·(z − cz)/d` looking −x (outside, +z, on screen right); `y = y_h + f·(h_eye − y)/d`. This equals the brief's `k(z) = P0·d0/(d0 + z)` with `f = P0·d0`. Picture push/drift after projection uses `Camera {s, fx, fy, dx, dy}` (`src/painted/camera.tsx`, `toScreen`), owned by the plate; the SVG foreground (VD07) and glows use the same camera through `CameraLayer`.

**ST-01 Set plan (`WORLD-SHOP`, m; estimated real scale, VD02).** Glass front z = 0, x −3.0…+3.0, glass y 0.05–2.5. **Door opening centred at x −0.5…+0.5** (a manual sliding glass leaf that slides toward −x on an inside track at z −0.05, behind the fixed pane x −1.5…−0.5; pull handle on the leaf's −x edge at (−0.45, 1.0, −0.05); open = leaf at x −1.5…−0.5). Mullions 0.08 m wide at x −3.0, −1.75, −0.5, +0.5, +1.75, +3.0; door header / **transom bar** y 2.08–2.16 across the whole front (2.1 m, the reference for `สูงเกือบถึงขอบประตู`). Inside: low window snack shelf x −2.6…−0.7, z −0.9…−0.5, top 1.1; counter x −2.9…−0.9, z −3.2…−2.6, top 0.9; torch display hook at (−0.75, 1.35, −2.7) at the counter's right end; aisle gondolas x 0.6…2.8, z −5.5…−2.0, top 1.6; fridge wall z −6.0; fluorescent tubes y 2.8. Outside: wet concrete walkway z 0…2.0; parking bay z 2.0…6.5; canopy underside y 4.8 over x −6…+6, z 3.5…13; **four canopy lamps** at (±2.4, 4.8, 7) and (±2.4, 4.8, 11); pump islands at z 9.5, x ±3.5; access lane z 14…22; main road z 24…32 along x. The sedan (4.5 × 1.8 × 1.45 m, right-hand drive) parks at G156 facing +x, body x −3.6…+0.9, z 4.2…6.0, driver door on the shop side.

**ST-02 Camera setups (estimated design values; Mark refinement of the brief's starting values).**

| Setup | Position (x, y, z) | Looks | f px | vFOV° | y_h | Used by |
| --- | --- | --- | --- | --- | --- | --- |
| CAM-GLASS-OUT | (0, 1.45, −3.0) | +z | 1341 | 71.21 | 700 | S02-SH04, SH07, SH09; S03-SH03–SH06 (crops); S04-SH03 |
| CAM-LOW-SHELF | (−0.9, 0.6, −2.5) | +z | 920 | 92.42 | 700 | S02-SH05, SH08; S03-SH01 |
| CAM-LOW-CU | (−0.95, 0.75, −2.4) | +z | 1100 | 82.21 | 760 | S02-SH10 |
| CAM-INT-REV | (−0.9, 1.35, −0.3) | −z | 1100 | 82.21 | 820 | S02-SH06; S03-SH02 |
| CAM-FORECOURT | (−0.9, 1.5, 0.8) | +z | 1341 | 71.21 | 760 | S01-SH02 |
| CAM-COUNTER-IN | (−0.6, 1.45, −4.4) | +z | 1341 | 71.21 | 700 | S02-SH01 |
| CAM-COUNTER-OUT | (−2.0, 1.45, −1.4) | −z | 1341 | 71.21 | 700 | S02-SH03 |
| CAM-INT-SIDE | (2.4, 1.45, −0.3) | −x | 1100 | 82.21 | 700 | S03-SH07 |
| CAM-INT-2S | (0.3, 1.45, −3.6) | +z | 1341 | 71.21 | 600 | S04-SH01 |
| CAM-INT-DOOR-REV | (0.85, 1.45, −0.1) | −z | 1100 | 82.21 | 760 | S04-SH02 |
| CAM-CAR, CAM-PHONE | fixed-plane `PLATE` layers | — | — | — | — | S01-SH01, S02-SH02 (values in their shot blocks) |

CAM-GLASS-OUT keeps the brief's values (`P0` 447 = 1341/3.0). CAM-LOW-SHELF changes the brief's starting values (`d0` 2.2 → 2.5, `y_h` 900 → 700, `f` 920, so `P0` 368; x −0.9 to sit behind the shelf end): with `y_h` 900 the cart wheel's ground line would fall at about y 1100–1130, inside the caption band; at 700 it sits at y 881 (S02-SH08) and 843 (S02-SH05). Film's projection method is unchanged.

**ST-03 `WFOG-ASSEMBLY` geometry and poses (VD04/VD05; m).** Reference point `S` = stack centre on the floor (xs, 0, zs). Cart deck x xs−0.25…xs+0.25, z zs−0.37…zs+0.38, top 0.17; handle at the deck's +z end, grip 0.97; **jammed wheel = front-right caster** at (xs+0.2, 0.05, zs−0.32). Carton stack top 1.5; helmet seat on the top carton at (xs, 1.5, zs); helmet 0.45 wide, top 1.95. Worker reference (feet) at (xs+0.3, 0, zs+0.45): behind and to the right of the stack, hood (top 1.7) overlapping the stack's right edge (overlap ≈ 56 px at the stop on CAM-GLASS-OUT). Worker faces −z (toward the shop) in every pre-reveal shot; his right hand is on screen-left (stack side), his left hand on screen-right. Shoulders y 1.21 at x ±0.17 from his centre; arm reach 0.5.

| Pose ID | Right hand | Left hand | Umbrella | Helmet |
| --- | --- | --- | --- | --- |
| `PUSH` | handle grip | handle grip | hooked on the handle's right end, closed | seated level |
| `BRACE-TAP` | braces stack's right face at (xs+0.25, 1.30, zs+0.23) | holds umbrella shaft at (xs+0.55, 1.33, zs+0.23) | tip to door-glass contact (xs+0.46, 1.60, 0.00) on tap frames; rest at z 0.05 | seated level |
| `CATCH` | under helmet at (xs+0.30, 1.28, zs+0.13) | unchanged | raised, tip at z 0.05 | in right palm, centre (xs+0.32, 1.38, zs+0.10) |
| `MATCH` | on helmet rim at (xs+0.20, 1.55, zs+0.10) | unchanged | raised, tip (xs+0.46, 1.60, 0.05) | seated, tilted 12° toward +x |
| `LIT-LOWER` | braces stack's right face | at side, (xs+0.55, 0.95, zs+0.28) | vertical, tip on ground at (xs+0.6, 0.02, zs+0.2) | seated level |

Reach check (estimated, stop position xs −0.1, zs 0.62, worker at (0.2, 1.07)): right shoulder (0.03, 1.21, 1.07) to `CATCH` hand 0.37 m, to `MATCH` hand 0.49 m, to brace 0.33 m; left shoulder (0.37, 1.21, 1.07) to umbrella hand 0.26 m; umbrella hand (0.45, 1.33, 0.85) → tip (0.36, 1.60, 0) 0.90 m (umbrella 0.9 m). The stop puts the assembly squarely in front of the door: stack x 410–596 px and hood 540–674 px sit between the jambs (317 and 763 px) under the header (409 px) at s 1. Catch at 1.28 m ≤ 1.3 m (PD01). Taps and catch are sequential (taps end G987, catch G1275).

**ST-04 `ASM-PATH` (story clock, global frames).** Position of `S` (xs, zs): G0–G126 seen far in S01 (CAR plate, not WORLD-SHOP); G126–G540 out of sight (z > 4 and behind fog, not drawn); G540 (0.30, 2.40) → G738 (0.10, 1.60) → G792 (0.00, 1.35) → G900 (−0.08, 0.80) → G920 (−0.10, 0.62) stop (settled by G930); held at (−0.10, 0.62) to G2034; G2034–G2070 pulled back to (−0.10, 0.74), the jammed wheel dragging; G2106–G2160 pushed in through the door to (−0.10, −0.45); held there through S04. Motion between keys is a **lurch cycle**: 20 frames eased move + 10 frames hold (30-frame period starting at G540), the stack top swaying up to 3° toward +x on each hold (5° once, S02-SH04); the squeak/scrape plays only on move frames. Any shot that shows the assembly samples this clock, so cuts keep continuity.

**ST-05 `FOG-STATE` (story clock, VD06).** FS0 G0–G186; FS0→FS1 G186–G240 (after the car is parked at G156); FS1→FS2 G246–G348; FS2 G348–G2526; FS2→FS3 G2526–G2598 (lamps fade, eased); FS3 G2598–G2610. Torch beam (VD06) from G1764: lights about 1.5 m of fog beyond the glass plus the assembly.

**ST-06 Assembly `light` (VD04).** 0 until G1806; 0→1 G1806–G1830 (eased, per-part colour lerp, motivated by the beam sweeping onto it, S03-SH03); 1 after.

**ST-07 Cast and props.** Narrator (**a woman**, whole character: body, wardrobe, voice; user 29 Oct, `WFOG-SCRIPT-R2`; wardrobe per brief VD03 R2), worker, shop worker 1.70 m (narrator height kept at Film's 1.70 m baseline so every projection result stands; Film may revise in VD02/VD03); **occupant 1.60 m** (Mark choice under the brief's option: a fourth distinct silhouette; same head size, 0.425 m); crouched heights narrator 1.0, occupant 0.95. Occupant height 1.60 m approved by the user (Q2, 29 Oct). **Asset requirement (user Q3, 29 Oct):** the older occupant needs more facial wrinkles than the EL01 cast sheet (forehead, eye corners, nasolabial lines on the decal face); the rest of the cast/fog look is approved. Narrator's phone: left hand from S01-SH02 f84 through S02-SH02, left jacket pocket from S02-SH03 on. **Torch** (painted, 0.22 m, black body): hangs on the counter-end hook until G336, then in the narrator's **right hand** for the rest of the video; off until the click at G1764, on G1764–G2410, off again from G2410 (S04-SH02). Worker after the reveal: umbrella in the left hand at his side (`LIT-LOWER`), right hand pushes the handle through S03-SH07; he leans the umbrella against the cart at S04-SH01 f6. Door leaf: closed until G2082; opening G2082–G2112 and open to G2172 (occupant); closing G2172–G2196, closed after (occupant, S04-SH01).

**ST-08 Screen safety (this deliverable).** Caption band y 1000–1248 (brief VD15), captions inside x 120–888; clue-safe y 300–950 for helmet, upper cartons, tap contact and faces. Fiction marker `เรื่องสมมติ • EP1` in the label box (x 120, y 300–350, `LABEL_BOX.short` in `src/painted/Label.tsx` @ `e1fe80e`) on the **opening only**, G [0, 126) = S01-SH01 (user Q1 `เอาแค่ต้นคลิป`, 29 Oct; PD06): on at G0 with the hook caption, off on the hard cut to S01-SH02, no fade. Readability rule that survives TTS re-timing: the marker stays at least 15 frames after the last hook cue ends (design 18: cue ends G108) and at least 90 frames in total. Because the phone insert S02-SH02 is now unmarked, it follows PD06 (see sc02-b01). Captions verbatim from G0.

## Shared elements and dependencies

Status inspected at `e1fe80e` (brief runtime inventory, re-checked by reading `src/painted/` and `src/scenes/Subtitles.tsx`); nothing rendered here.

| ID | Owner / path | Status | Consumers | Acceptance / fallback |
| --- | --- | --- | --- | --- |
| MK-WF-DEP-01 clean install (`p5.brush` resolves) | Boss / env | `missing` in this worktree | all | bundle `src/painted/spike/index.ts` succeeds |
| MK-WF-DEP-02 episode plate module + registry + video `src/videos/world-fog/index.ts` | Boss | `missing` | all | 22 plate IDs selectable in `painted.shots[]` |
| MK-WF-DEP-03 `FOG-STATE`, veils/banks, lamp glow ≤ `GLOW_PEAK` 0.3, torch beam | Boss | `exists-unintegrated` (spike, glow 0.75) | all exterior/window shots | SP02 |
| MK-WF-DEP-04 `WFOG-ASSEMBLY` with `light`, poses ST-03, lurch, slide/catch | Boss | `missing` | S01-SH01, S02-SH04–SH10, S03-SH01, SH03–SH07, S04-SH01 | **SP01** gates polish of S02-SH04, SH05, SH07, SH09, S03-SH03–SH06 |
| MK-WF-DEP-05 cast draw functions (front + profile, crouch, rise, walk, talk mouth, raise torch, push door, catch breath) | Boss | `missing` (sheets only; the spike narrator is the R1 male design) | all character shots | narrator redrawn as a woman per VD03 R2; older occupant with more facial wrinkles (user Q3); rest of the look approved (user Q3, 29 Oct) |
| MK-WF-DEP-06 sets: car interior + sedan, forecourt/canopy/pumps, shop interior (ST-01), window Overlay architecture (VD07) | Boss | `missing` | all | **SP03** gates S02-SH08, SH10, S03-SH01 |
| MK-WF-DEP-07 hard-cut ending (no hold/fade/blend) | Boss | `unknown` (`C_seamless` + `loopBlendFrames: 0` unverified) | S04-SH03 | last frame G2609 is the last painted frame, audio stops with it |
| MK-WF-DEP-08 caption placement with the block bottom near y 1240 and lines inside x 120–888 | Boss/Editor | `missing`: `src/scenes/Subtitles.tsx` offers `top`, `middle` (centred y 960, width x 65–1015) and `bottom` (134 px) | every cue | if only `middle` is used, a two-line cue covers about y 876–1044 and overlaps the clue-safe edge; S02-SH05/SH08 wheel reads (y 843–881) would sit at its top edge |
| MK-WF-DEP-09 phone screen text layer (Remotion, Noto Sans Thai) | Boss/Editor | captions/labels `existing-integrated`; phone layer `missing`; PHONE-SVG sample in progress (Boss, not inspected here) | S02-SH02 | text verbatim; PD06: no outlet/logo/anchor/ticker/authority/date/place; PHONE-SVG pending user view (open item 8) |
| Sound gaps (NEEDS-GEN) | Editor (generation per [sound workflow](../../../docs/sound-generation-workflow.md#role-responsibilities)) | brief gap list + `foley_car-door-open-close_01`, `foley_footsteps-wet-concrete_01`, `foley_glass-door-push_01` | per shot Sound lines | human breath needs a non-Stable-Audio source (brief) |

Findings: [DF-20261029-painted-timeline-dissolve](../../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md) revalidated by reading only (scope matches: one canvas, overlays above it; not re-run because `p5.brush` does not resolve). Applies to every shot: hard cuts only (no `dissolveSec`), `light` as colour lerp so match/reveal frames stay full-alpha and byte-identical. Build-notes findings (29 Oct, spike scope) applied: high fog banks behind the assembly, low banks in front (all window shots); SVG foreground only where no inside actor is nearer than the glass (VD07); 6–8 fill passes for dark-over-wet fills.

## Element captures

Copied 29 Oct 2026 from spike renders in `.claude/worktrees/world-frog-main-6920cb/out/painted/` (frame 0 renders made at `47a6737`; `git diff 47a6737 e1fe80e -- src/painted/spike/` is empty, so the sources match the target). Stored locally (ignored by git) at `out/handoffs/world-fog/WFOG-EP01-SHORT/elements/`:

| File | Asset / view | Source | Limitations |
| --- | --- | --- | --- |
| EL01-cast-front-4heads.png | cast, front, 4 heads | `CastSheet.tsx` F0 | static sheet; no rig, no poses; narrator is the R1 male design (stale, SS-R2); occupant lacks the requested wrinkles |
| EL02-cast-side-and-assembly.png | cast profiles; worker + cart lit profile; assembly front silhouette | `SideSheet.tsx` F0 | narrator profile is the R1 male design (stale); profile of the assembly must never appear before S03 (VD05); silhouette stack proportions are the spike's, not ST-03 |
| EL03-worldfog-window-approach-sheet.png | window approach, 5 frames | `WorldFog.tsx` F0/45/90/135/179 | lamp glow above `GLOW_PEAK`; not CAM-GLASS-OUT values; the shape there has no worker overlap per ST-03 |
| EL04-face-decal-sheet.png | decal face expressions | `FaceSheet.tsx` F0 | expressions are references, not a face API |

No WORLD FOG plate, set or pose of this handoff has been rendered (no clean install).

## Blockout brief (Editor)

Assemble all 22 shots on the timeline above before polish, using labelled placeholders that keep ST-01 dimensions, ST-02 cameras, `ASM-PATH`, `FOG-STATE` and the ST-03 pose silhouettes (flat dark fills are acceptable for the assembly). Priority frames for the Film/Mark blockout review: G40 (hook read), G951/G969/G987 (tap contacts), G1275 (catch), G1409 vs G1800 (match frame, SP01 b), G1830 (lit), G2050 (wheel insert), G2609 (last frame). Captions in the ST-08 band on G0 and on the longest two-line cue (S02-SH04 cue 3).

## Projection checks

Inputs in [projection/](projection/) are for `python3 -I scripts/shot-projection.py <file> --min-height 480`. The tool's world is right-handed, so `WORLD-SHOP` points and camera positions are stored with **x negated**; the screen output is then in `PLATE` px with +x on screen right for +z cameras. Values were cross-checked with the ST-02 formulas. Picture push is applied after the tool; push-adjusted values in shot blocks are computed with `toScreen`.

## Open items and questions

| # | Owner | Item | Status |
| --- | --- | --- | --- |
| 1 | User (review page) | Fiction marker on for the whole video (ST-08) or only the opening/phone shots | resolved 29 Oct: opening only (user Q1); applied in ST-08, sc01, sc02-b01 (PD06), sc04 |
| 2 | User (look check, brief) | Occupant 1.60 m (ST-07); cast/fog look | resolved 29 Oct: 1.60 m ok; look ok except more facial wrinkles on the older occupant (asset requirement, ST-07 / MK-WF-DEP-05) |
| 3 | Boss/Editor | MK-WF-DEP-08 caption placement | open |
| 4 | Boss | MK-WF-DEP-07 hard-cut ending | `unknown` |
| 5 | Film | `สูงเกือบถึงขอบประตู`: at the stop the helmet top projects 106 px below the transom at s 1 (perspective; 1.95 m vs 2.1 m). Mark keeps the true dimensions; if the blockout reads "far below the door", Film decides between a taller stack (≤ 2.0 m within PD01 reach) or accepting the narrator's estimate | open, check at blockout |
| 6 | Editor | Re-time event frames after TTS (PD04; R2 female narrator voice and the added `คะ` make all narrator cue windows stale); keep the event order and the silences (G987–G1017, G1500–G1530) | open |
| 7 | User | Storyboard review page (SS-R1 v1; SS-R2 v2 with first previews and Q3–Q6, 2026-10-29): https://claude.ai/artifact/J5TUXQhHUDABFuQxUrqwr7 (verdicts in `reviews/<shot ID>`, questions Q1 marker, Q2 occupant height, Q3 cast/fog look) | published 2026-10-29 by coordinator; verdicts received 2026-10-29: Q1 change (marker on the opening only), Q2 ok, Q3 change (older occupant: more facial wrinkles), S01-SH01 change (narrator female, whole character), S02-SH02 ok + phone screen as React SVG pending sample, other shots ok (S02-SH09 pending preview). All applied in SS-R2 except items 8 and 9 |
| 8 | Boss → user → Film | PHONE-SVG: phone screen of S02-SH02 as crisp React SVG (user request). Boss sample in progress; user wants to see it before deciding. Adoption changes VD09's medium for that insert (Film) but no staging numbers; a painted thumb cannot pass over an SVG screen (overlays sit above the one canvas), so the thumb would move into the SVG layer | pending, not final |
| 9 | Boss → user | S02-SH09 `ok` but the user wants a preview (SP01 preview) | pending |
| 10 | Coordinator / user | Voices for the shop worker and the occupant are unassigned; with Premwadee on the narrator, three female speakers need distinguishable voices or processing (brief voice note R2) | open |

## Change log

- 29 Oct 2026 `WFOG-EP01-SHORT-SS-R1` (Mark): first scene sheets and index from `WFOG-SCRIPT-R1` / `WFOG-FACTCHECK-R1` / `VB-WFOG-EP01-SHORT-R1`. Replaces Film's stub index. Set decisions within Mark's staging scope: door centred in the glass front with a manual sliding leaf, so the window view frames the shape inside the door (header 2.1 m read for `สูงเกือบถึงขอบประตู`), the taps land on the door glass and the entry is straight through; CAM-LOW-SHELF values refined (ST-02, reason recorded); occupant height chosen; torch planted on the counter-end hook. No brief decision (VD01–VD16) changed.
- 29 Oct 2026 `WFOG-EP01-SHORT-SS-R2` (Mark, AI08 one-correction pass) from `WFOG-SCRIPT-R2` / `WFOG-FACTCHECK-R2` / user verdicts on the SS-R1 review page. Files and owners: index + sc01–sc04 (Mark); `visual-brief.md` lines VD03, VD09, VD15, voice note, header, beat-table pronouns, Preserve list and change log (owner **Film**; edited here under AI08, revision `VB-WFOG-EP01-SHORT-R2`, Film reviews in its next pass). Changes: narrator is a woman (cues `ฉัน`/`คะ` per R2, she/her, cast and voices `th-TH-PremwadeeNeural` narrator / `th-TH-NiwatNeural` worker); fiction marker opening only G [0, 126) with a readability rule (was the whole composition); PD06 rules and acceptance on S02-SH02; PHONE-SVG recorded as pending (open item 8); occupant 1.60 m approved; occupant wrinkles as an asset requirement; S02-SH09 preview pending. No staging, camera, event frame, clue, claim or shot ID changed; narrator cue windows stale pending TTS.
