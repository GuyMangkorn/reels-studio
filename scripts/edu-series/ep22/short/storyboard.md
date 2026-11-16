# Storyboard and scene index — EDU-EP22-SHORT (EDU-EP22-STORYBOARD-R1)

- **Deliverable:** `EDU-EP22-SHORT` (channel **edu**) · **Revision:** EDU-EP22-STORYBOARD-R1 (Film W2.2, untimed first storyboard pass, 2026-11-16) · **Status:** `ready-for-review` (untimed first pass for the user's storyboard tab; becomes `ready-for-dev` only in the timed W4 sheet after the voice lock) · **Timing:** `estimated`, VO-relative only ("on the word X"); no frame ranges exist yet.
- **Evidence:** runtime none · render/frames none (no look frame, plate or still exists) · audio/subtitle sync none (no full read; pace pick Kore x0.95 only) · user approval: SCRIPT-R3 text, Q1 (no demo label), Q2 (look check at LF01), storyboard go-ahead "Start storyboard" (delivery record). Readiness is not approval, runtime proof or visual proof.
- **Inputs (by revision):** script **EDU-EP22-SCRIPT-R3** ([script.md](script.md): beats S01-B01..B05, lines L01–L16, clues CL22-01..04, Film constraints); fact-check **EDU-EP22-FACT-R3** ([fact-check.md](fact-check.md), ready-for-storyboard; F06 and O1 bind the spread scale); brief **EDU-EP22-BRIEF-R1** ([film-brief.md](film-brief.md): VD01–VD12, N1–N7, truth limits 1–8, [SET-HALL22](film-brief.md#set-plan--set-hall22-space-h-metres-est), [DEMO22](film-brief.md#set-plan--demo22-space-d-metres-est), [sound direction](film-brief.md#sound-direction), [per-beat visual intent](film-brief.md#per-beat-visual-intent-for-the-scene-sheet-pass-untimed)); timing **EDU-EP22-TIMING-R1** (55.0 s projection, estimate); delivery record **EDU-EP22-DELIVERY-R1** ([../delivery.md](../delivery.md)).
- **Target:** branch `claude/ep22-khun-tee-chim-yaphit-3ae8d2` at `31abb81` · 30 fps · `durationFrames` unset (W4) · 1080×1920 · composition `missing` (Editor registers it, never in `src/Root.tsx`) · ending closed, ~3 s hold, no loop seam.
- **Review rows:** [review-rows.json](review-rows.json) **EDU-EP22-ROWS-R1** (Thai, `"untimed": true`, no `start`/`end`, no `looks` yet because no look frame exists; build.py requires a `src` per look). Review page: pending.

## Units and conventions

- Spaces `H` (hall) and `D` (demo top), axes and units as in the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline) (brief: VD01). `H`: origin on the floor under the centre of the child's table CT, +x screen-right from the open-hall side, +y up, +z toward the open doors; yaw 0 puts the camera on +z looking −z, positive yaw swings it toward +x. Camera lines use `camMove(at, yaw, r, eye, {f})`; `eye` is the camera height in metres, pitch follows from `eye` and `at.y` unless written. Every number is `est` (plan arithmetic by hand, nothing rendered); W4 runs `scripts/shot-projection.py` per world-space shot and Boss tunes within ±10 % with a recorded change.
- **Axis (brief, Camera language).** The camera stays on the open-hall side of the line LT ↔ CT (z > −0.5 in `H`); the long table LT is always screen-left of the child, the dowager's doorway screen-right. No shot in R1 crosses it.
- **Prop IDs used below.** LT bowls `LT-A01..A14` (row A, x −3.35, z +2.04 → −2.64 at 0.36 m pitch) and `LT-B01..B14` (row B, x −3.85); each cover keeps its bowl ID. Taster's saucer `SAU` at (−3.30, 0.83, +2.24) on the runner's near end (new est anchor, inside the runner's z ≤ +2.40). CT trays `TR1..TR4` at the four set-plan tray centres; child's rice bowl `RB` and spoon `CS` (set plan).
- **Frame zones** as the brief (caption band y 1176–1344; faces, tag, spoon, egg strip, cup strip and glints above y 1160; mark x < 330, y < 140 clear).
- **Truth limits** are cited as TL1–TL8 (brief, Visual intent, binding on every shot).
- **View cues** on (project default since 13 Nov 2026). Body views are squared to the mid-shot camera (`squareToCam`) unless a shot writes a world `facing`.

## Casting

Designed from the script first (brief, Visual intent); kit matches and `new:` lines from brief VD02/VD03 (brief owns them; repeated here for the shot lines).

| Role | Casting line | Notes |
| --- | --- | --- |
| CHILD (Puyi, about 5) | `new: child emperor (age ~5, 1.05 m, round face, kit child head family, headScale ≈ 0.88) + new: qing-child-robe + new: qing-skullcap-queue, P31 sit_chair_hands_lap · seated-reach-hover · new: seated-spoon-to-mouth (motion eat-chew) · turn-head-left / turn-head-right`; expressions neutral (bored), surprised, happy / laugh, suspicious → surprised, relieved / happy | feet off the floor above the footstool; never an adult |
| TASTER T | `man-shaved (no glasses) + new: qing-eunuch-robe (slate) + new: qing-court-cap, P01, neutral · new: spoon-taste` | calm, about 50; never chokes or winces |
| CALLER Y | `new: young eunuch (teen, 1.58 m) + new: qing-eunuch-robe (light blue) + new: qing-court-cap, P01, talk` (chin up on the call) | narrator voices "เปิดฝา!" |
| LIFTERS E1–E3 | `man-crop + new: qing-eunuch-robe + new: qing-court-cap, P01, neutral · new: cover-lift` (seed and tint varied) | far side of LT, standing in attendance |
| CARRIERS K1–K4 | `man-crop + new: qing-eunuch-robe + new: qing-court-cap, P26 carry_box (lacquer tray), neutral`, motions `walk-in-from-right`, `walk-out-to-right` | never stay at CT after set-down (TL2) |
| CHILD HAND (demo) | kit `paintHandMacro`, child `MacroTone`, mitten (UT14) | demo shots only |

## Look frames (W3; painted after this pass is on the review page)

| Look | Shot / frame | Carries | Status |
| --- | --- | --- | --- |
| LF01 | B01-SH01 first frame (child on the big seat, LT covers running out of frame at left, lifters) | look check N1 hall, N2 child, N3 eunuchs, N4 covers (user Q2: approve at LF01) | `missing` |
| LF02 | B04-SH14 mid-shot (strip pressed in the yolk, tip half darkened) | N6 demo set, tarnish look | `missing` |
| LF01b (decided here, brief left it to this pass) | B05-SH20 last hold frame (child eating at his spread of 20 dishes, LT soft and far at screen-left) | N4 open dish set and food at hero size, the ending composition; LF01 has an empty CT, so it cannot show the dishes | `missing`; user confirmation asked (Q-SB1) because it adds a third still |

The L06 tag close, the ripple and the L15 crane share the LF01 family; the B02 high-angle spread (SH06) shares LF01b. `looks` / `look` keys enter `review-rows.json` when the stills exist.

## Shot map

Twenty shots, one composition; brief SH numbering kept as the stable global number, prefixed by beat.

| Shot | Beat | Lines (VO-relative span, est) | Clues / claims | Look family |
| --- | --- | --- | --- | --- |
| B01-SH01 | S01-B01 | L01 "ถ้าคุณเป็นขันที" | CL22-01 plant | LF01 |
| B01-SH02 | S01-B01 | L01 "ชิมอาหารให้ฮ่องเต้จีน... คุณต้องชิมก่อนทุกจาน" | C03, CL22-04 | LF01 |
| B01-SH03 | S01-B01 | L02 | C05; CL22-03 glimpse | LF01 |
| B02-SH04 | S01-B02 | V01 (before L03) | — | LF01 |
| B02-SH05 | S01-B02 | L03, L04 "ปูยีกินกับข้าวที่ฝั่งไทเฮาส่งมาต่างหาก..." | C05, CL22-03 | LF01 |
| B02-SH06 | S01-B02 | L04 "ราว ๆ ยี่สิบจาน!" | C05 (twenty), F06/O1 | LF01b |
| B03-SH07 | S01-B03 | L05 | central question | LF01 |
| B03-SH08 | S01-B03 | L06 | C04, CL22-02 plant | LF01 |
| B03-SH09 | S01-B03 | L07 "ขันทีชิมจานละนิดก่อนยกมา" | C03, CL22-04 | LF01 |
| B03-SH10 | S01-B03 | L07 "แล้วขันทีน้อยก็ร้อง "เปิดฝา!"" | S01 lid call | LF01 |
| B03-SH11 | S01-B03 | (gap after L07) | lid ripple (reconstructed) | LF01 |
| B03-SH12 | S01-B03 | L08 | refrain plant | LF01 |
| B04-SH13 | S01-B04 | L09 | silver question | LF02 |
| B04-SH14 | S01-B04 | L10 | C07/C08 (show) | LF02 |
| B04-SH15 | S01-B04 | L11 | C07 (sulfur) | LF02 |
| B04-SH16 | S01-B04 | L12 + silence | S06 | LF02 |
| B04-SH17 | S01-B04 | L13 | refrain flip, scoped to silver | LF01 |
| B05-SH18 | S01-B05 | L14 | central question re-asked | LF01 |
| B05-SH19 | S01-B05 | L15 | C05 "for show" | LF01 |
| B05-SH20 | S01-B05 | L16 + ~3 s hold | C05 "放在我面前", CL22-01/03 payoff | LF01b |

Projected average ≈ 2.75 s per shot at 55.0 s (TIMING-R1); SH04 and SH11 are short (≈ 1 s and ≈ 1.5 s), SH20 is long (L16 ≈ 4 s + hold 3 s).

## Sound plan (whole video)

As the brief's [sound direction](film-brief.md#sound-direction) (M1/M1b/M2, END1, A1/A2, S1–S14, V01–V02, silence policy, ducking); per-shot lines below place each cue VO-relative. Shot-local frames come in W4. Every cue is NEEDS-GEN for Ton except S7 (library candidate `comedy_pluck-question-bend_01`, Ton checks key against M1).

## Shot sheets

### B01-SH01 · frame 0, the child and the long table · L01 "ถ้าคุณเป็นขันที"

- **Purpose.** Frame 0 shows the strange thing (retention camera): a tiny emperor on a huge seat, a long row of silver domes behind him he is not part of. Plants CL22-01 as "the imperial meal".
- **Seen.** CHILD seated centre-right on the carved armchair, feet swinging above the footstool (ambient clock), bored; his eyes drift along the row of covers at screen-left. CT in front of him is empty. LT runs from beyond the left frame edge to just behind his head, 28 domed covers on, lifters E1–E3 small on its far side, arms down.
- **Camera.** `cam: H, at (−0.2, 1.0, −0.7), yaw 72 → 64, r 1.35 → 1.25, eye 1.05, f 1150` (brief: frame-0 anchor). Eased arc and push across the line; the only move.
- **Cast.** CHILD view `front` squared to the mid-shot camera (yaw 68), P31, `neutral`, gaze screen-left at LT. E1–E3 view `front` (face +x, seen across LT), P01, `neutral`.
- **Light.** Brief VD04 daylight: key from the right windows, the covers carry the brightest cool glints; soft back-window rim on the child.
- **Sound.** M1 starts at frame 0, medium-low; A1 under it; NAR from frame 0 (no intro).
- **Truth limits.** TL3 (LT rich and handsome), TL4 (child does not touch LT), TL7 (Qing only, no named hall).
- **Entry → exit.** Entry = LF01. Exit: child still bored, gaze on LT; covers all on; CT empty.
- **Acceptance.** First frame: child and LT both readable; child lead ≥ 480 px; covers read as silver domes at their small size; no text.
- **Open (Boss, LF01).** The camera sees the child's armchair from about 68° while the child card is `front`; LF01 shows whether a front card reads on a chair seen at that angle. Fallback: world `facing` +z with view cues (three-quarter child).

### B01-SH02 · "you" are the taster · L01 "ชิมอาหารให้ฮ่องเต้จีน... คุณต้องชิมก่อนทุกจาน"

- **Purpose.** Role-play: the viewer stands in the taster's place at the long table (C03, true and calm).
- **Seen.** Over T's right shoulder (foreground left, back three-quarter) at the near end of LT; his left mitten lifts the cover of LT-A01 (S2) on "ชิมอาหาร…", his right mitten dips the porcelain spoon on "คุณต้องชิมก่อนทุกจาน" (S4), tastes a little, sets the cover back and turns half a step toward LT-A02. The row of domes recedes up the frame.
- **Camera.** `cam: H, at (−3.35, 0.88, 1.68), yaw 64 → 58, r 1.10 → 0.98, eye 1.55, f 1100` (pitch ≈ −20). Boss keeps T's shoulder in the left foreground and LT-A01 at frame centre within ±10 %.
- **Cast.** T world `facing` −x (toward LT), seen back three-quarter (`backQuarter` cue), P01 → `new: spoon-taste`, `neutral`. No child in frame (deviation from the brief's per-beat note "child far at right": from the near end of LT the child is behind the camera, and keeping him out supports TL1).
- **Light.** Daylight; the lifted cover's inside catches the window.
- **Sound.** M1 continues; S2 on the lift, S4 on the dip (VO-relative, placed in syllable gaps by Editor).
- **Truth limits.** TL1 (tasting only at LT), TL6 (no reaction, no illness), TL3.
- **Cut out.** Ends on the cover going back and T's turn to the next bowl, never on the spoon, so the cut to the child does not read as "tasted for nobody" (brief risk 2).
- **Entry → exit.** Entry: LT-A01 covered. Exit: LT-A01 covered again, spoon in T's right mitten, T turning toward LT-A02.
- **Acceptance.** Spoon held by the mitten through the dip; cover never moves without a hand; T calm.

### B01-SH03 · the emperor does not touch it · L02 "แต่ฮ่องเต้องค์สุดท้าย... ไม่แตะโต๊ะเกือบสามสิบจานนั้นเลยนะ"

- **Purpose.** Contradiction: the ritual is real, and the little emperor does not touch that table. Child meets it before the word (ER02).
- **Seen.** Child at screen right-of-centre behind CT, LT soft at screen-left background. On "แต่ฮ่องเต้องค์สุดท้าย..." his eyes slide along the covers past LT and away (look past); on "ไม่แตะ" he turns his head to screen-right (`turn-head-right`), away from LT, toward the off-screen warm doorway, and brightens slightly. As L02 ends, the front edge of K1's tray pokes into the right frame edge at about (+0.55, 1.10, −0.70) (CL22-03 glimpse, ≤ 15 % of frame width).
- **Camera.** `cam: H, at (−0.25, 0.98, −0.72), yaw 34 → 28, r 1.40 → 1.28, eye 1.08, f 1150` (est: child x ≈ 730 px, LT far end x ≈ 210 px); slow arc and push. CT's near edge falls in the caption band.
- **Cast.** CHILD view `front`, P31, `neutral` → `turn-head-right` with a small `surprised` lift as the tray edge appears. K1 tray only (body out of frame).
- **Light.** Daylight; a faint warm spill grows on the right of his face from the doorway direction.
- **Sound.** M1 cuts to near-silence on "ไม่แตะ"; S1 dry porcelain tick alone on the cut; A1 continues; S5 tray footsteps start off-screen right as the line ends.
- **Truth limits.** TL1 (no shrug, no "for nobody"), TL3 (no grimace at LT; he looks away, not in disgust), TL4.
- **Entry → exit.** Entry: gaze on LT (matches SH01 exit). Exit: head turned screen-right, tray edge in frame right.
- **Acceptance.** Head turn lands on "ไม่แตะ" (±3 f at W4); no expression of disgust; tray edge visible before the cut.

### B02-SH04 · "huh?" · V01 before L03

- **Purpose.** The child reacts before the narrator asks (ER02); comic curiosity.
- **Seen.** Close on the child, front three-quarter, leaning toward screen-right, eyes to the right, head cocked; warm doorway light on that side of his face.
- **Camera.** `cam: H, at (0.0, 1.08, −0.72), yaw 22 → 18, r 0.95 → 0.85, eye 1.10, f 1150` (head and shoulders, CT edge at frame bottom). Small push.
- **Cast.** CHILD front three-quarter (close-up allowance), P31 leaning, `suspicious` → `surprised`, `headCock` right.
- **Light.** Daylight plus the warm door spill (screen-right).
- **Sound.** V01 child "หืม?" (non-verbal; Editor casts with ≤ 10 s samples); S7 `comedy_pluck-question-bend_01` under it (library candidate, fits "a pluck whose tail bends upward like a question"); S5 footsteps grow off-screen right.
- **Truth limits.** TL7 (child, not a drama-costume adult).
- **Entry → exit.** Entry: head already turned right (match on SH03's exit). Exit: lean held, eyes right.
- **Acceptance.** Face above y 1160; child reads about five years old.

### B02-SH05 · the dishes arrive · L03 "อ้าว แล้วเด็กคนนี้กินอะไร?" + L04 "ปูยีกินกับข้าวที่ฝั่งไทเฮาส่งมาต่างหาก..."

- **Purpose.** First payoff in action: four carriers bring trays from the dowager's side; the child reaches before the narrator names it (ER02).
- **Seen.** K1–K4 come through the warm right doorway one behind another (≈ 0.9 m apart), trays at chest height, walking screen-left along z −1.0; the camera trucks with them toward CT. During L03 the child enters frame at left; before "ปูยีกิน…" he reaches toward the trays (`seated-reach-hover`). On L04 the four trays land TR1..TR4 one after another (S6 ×4), five dishes each; the carriers release and step back.
- **Camera.** `cam: H, truck at (3.8, 1.2, −1.0) → (0.35, 0.95, −0.25), yaw 12 → 24, r 3.1 → 2.4, eye 1.5, f 1000` (follows the walkers, never wanders). Lead-size exception for the opening (carriers are the subject); the child's lead measured at the end at W4.
- **Cast.** K1–K4 view `left` (walking screen-left, profile from `walk-in-from-right`), P26 tray grip at the short ends, `neutral`; K3 passes in front of CT to (−0.95, 0, +0.5) (set plan). CHILD view `front`, P31 → `seated-reach-hover`, `surprised` → `happy`.
- **Light.** Warm doorway brighter than the hall; daylight key on the trays as they cross the window beams.
- **Sound.** S5 tray procession (steps on stone, porcelain rattle) under L03; S6 ×4 set-downs on L04, slightly varied; M1 still near-silent until SH06.
- **Truth limits.** TL2 (no carrier tastes, lifts or checks anything at CT), F06/O1 (four trays, about twenty dishes, never one small tray).
- **Entry → exit.** Entry: doorway empty, K1 stepping through. Exit: four trays on CT, carriers stepping back, child's hands over the dishes.
- **Acceptance.** Reach starts before "ปูยีกิน"; each tray released only on contact with CT; dishes do not slide.

### B02-SH06 · about twenty dishes · L04 "ราว ๆ ยี่สิบจาน!"

- **Purpose.** Comic plenty: the full spread at hero size (F06/O1).
- **Seen.** High angle over CT: twenty open, lightly steaming dishes (home-style, warm colours, food visible) fill the table; the child at the top of frame grabs his spoon CS, laughing. Carriers walk out of frame right.
- **Camera.** `cam: H, at (0.0, 0.70, −0.10), yaw 15 → 12, r 1.55 → 1.35, eye 1.70, f 1050` (pitch ≈ −35; the table top rises above the caption band, the band falls on the near table edge and floor bricks). Push.
- **Cast.** CHILD view `front` (pitch cue on), P31 → picks up CS, `laugh`. K1–K4 `walk-out-to-right`, exiting.
- **Light.** Warm pool from the right windows on CT; steam glaze ≤ 0.3.
- **Sound.** M1 returns bouncy on "ราว ๆ ยี่สิบจาน"; S8 soft round comic pop on "ยี่สิบจาน"; A1 under.
- **Truth limits.** TL2 (no eunuch at CT after the set-down; no tag or glint on these dishes), VD12 (no count label).
- **Entry → exit.** Entry: trays just landed (match on SH05). Exit: child holding CS over the rice bowl, smiling; no carrier in frame.
- **Acceptance.** About twenty separate dishes countable at a glance; spread above y 1176; child's face above y 1160.

### B03-SH07 · the question swings to the long table · L05 "แต่ถ้าไม่กิน... โต๊ะยาวนั่นตั้งไว้ทำไม?"

- **Purpose.** Opens the central question: the camera leaves the eating child and settles on LT.
- **Seen.** Starts on the child at right eating (`seated-spoon-to-mouth`, `eat-chew`), happy and not looking at LT; the camera swings screen-left across the hall and settles on the row of covered domes with the lifters standing in attendance by "ตั้งไว้ทำไม?". The child leaves frame right during the swing.
- **Camera.** `cam: H, at (−0.3, 0.95, −0.6) → (−3.5, 0.95, −0.4), yaw 62 → 74, r 1.4 → 2.8, eye 1.05, f 1100`, eased in-out (a medium swing at child's eye; not one of the three large moves).
- **Cast.** CHILD view `front`, eating, `happy`. E1–E3 view `front`, P01, `neutral`. T at the near end, view `left`, idle.
- **Light.** Daylight; LT's covers become the brightest cool highlights as the camera settles.
- **Sound.** M1b brisk ceremonial variant begins (wood block every beat, light zither tremolo); A1.
- **Truth limits.** TL1 (the child is not shown glancing at LT dismissively), TL3.
- **Entry → exit.** Entry: child eating (SH06 exit plus one bite). Exit: LT covers on, centred, lifters still.
- **Acceptance.** No dead frame in the swing; child never looks at LT in this shot.

### B03-SH08 · the silver tag · L06 "ดูก่อนนะ... ทุกจานมีแผ่นเงินเล็ก ๆ ใส่ไว้กันพิษ"

- **Purpose.** Plants CL22-02 at a readable size (UT02).
- **Seen.** Close on LT-A01. On "ดูก่อนนะ" T's left mitten enters from screen right, lifts the cover up and out (S2) and sets it on the runner beside its bowl; braised food, light steam, and a small silver tag leaning in it, readable by "แผ่นเงินเล็ก ๆ".
- **Camera.** `cam: H, at (−3.35, 0.86, 1.68), yaw 22 → 14, r 0.38 → 0.32, eye 1.02, f 1100` (pitch ≈ −25, near 0.05 m); slight arc and push (brief VD06).
- **Cast.** T (mitten and sleeve only), `new: cover-lift` one-hand variant.
- **Light.** Window light glints on the cover's inside as it turns; the tag carries a soft cool highlight (painted).
- **Sound.** M1b; S2 cover lift on "ดูก่อนนะ".
- **Truth limits.** TL2 (this is LT-A01, never a CT dish), TL6 (no "poison" sign; the food looks good).
- **Entry → exit.** Entry: LT-A01 covered. Exit: LT-A01 open, its cover on the runner beside it, tag visible.
- **Acceptance.** Tag readable at 540 px wide; cover moves only with the hand; tag above y 1160.

### B03-SH09 · the taster tastes a little · L07 "ขันทีชิมจานละนิดก่อนยกมา"

- **Purpose.** CL22-04 shown plainly: calm, practised tasting (C03).
- **Seen.** Side view: T at the near end of LT spoons a little from LT-A01 (S4), tastes, nods once, rests the spoon on SAU, lifts LT-A01's cover back on and steps half a step toward LT-A02. Lifters at the far side stand still; the row recedes.
- **Camera.** `cam: H, at (−3.2, 1.2, 1.75), yaw 8 → 3, r 2.3 → 2.1, eye 1.5, f 1100`. The child is out of frame (≈ 40° outside the left/right edge by plan), on purpose (TL1).
- **Cast.** T view `left` (profile facing screen-left toward LT), `new: spoon-taste`, `neutral`. E1–E3 view `front`, P01.
- **Light.** Daylight; the spoon catches a small warm highlight.
- **Sound.** M1b; S4 spoon dip on "ชิม".
- **Truth limits.** TL1, TL6 (no wince, no pause for effect), TL3.
- **Entry → exit.** Entry: LT-A01 open with the tag (SH08 exit). Exit: LT-A01 covered again, spoon on SAU, T beside LT-A02.
- **Acceptance.** Spoon contact on the bowl and on SAU held; T calm throughout.

### B03-SH10 · the young eunuch's call · L07 "แล้วขันทีน้อยก็ร้อง "เปิดฝา!""

- **Purpose.** The ceremony moves: a face for the call (the narrator voices it).
- **Seen.** Close on caller Y at the near end of LT; on "เปิดฝา!" he lifts his chin and opens his mouth, head turned toward the line of lifters at screen-left.
- **Camera.** `cam: H, at (−2.75, 1.42, 2.70), yaw 20 → 14, r 1.20 → 1.05, eye 1.45, f 1150`; push. LT and lifters soft behind him at screen-left.
- **Cast.** Y front three-quarter (close-up), P01 + chin up, `talk` on the word only.
- **Light.** Daylight; light-blue robe reads lighter than the adult eunuchs.
- **Sound.** M1b; the call is the narrator's line (no extra voice).
- **Truth limits.** TL7 (simplified Qing dress, no drama costume), TL8.
- **Entry → exit.** Entry: Y still, mouth closed. Exit: chin up, mouth open on the last syllable.
- **Acceptance.** Mouth opens on "เปิดฝา!"; face above y 1160.

### B03-SH11 · the lid ripple · gap after L07

- **Purpose.** The ritual in motion (reconstructed: research open item 5).
- **Seen.** Truck along LT from the near end toward the far end: covers come off in a quick ripple, each under a lifter's mitten (`new: cover-lift`, 2–3 f offsets), set on the runner beside their bowls; T lifts LT-A01/A02 at the near end; covers beyond the reach of the visible hands are already off when they enter frame (brief VD07).
- **Camera.** `cam: H, truck at (−3.6, 0.9, +2.0) → (−3.6, 0.9, −0.8), yaw 68, r 2.0, eye 1.35, f 1000` (the near end screen-left, so the ripple runs left → right with the S3 stereo travel). Camera stays at z > −0.5. Lead-size exception (the table is the subject).
- **Cast.** E1–E3 view `front` (facing +x toward the camera side), `new: cover-lift`, `neutral`; T view `left`.
- **Light.** Covers flash as they turn toward the windows.
- **Sound.** S3 lid ripple cascade (reconstructed, label so in the cue sheet), left → right; M1b peaks.
- **Truth limits.** TL2 (CT never in frame), TL7.
- **Entry → exit.** Entry: all 28 covers on. Exit: covers off and set beside their bowls along the visible length.
- **Acceptance.** No cover moves without a hand; 28 covers stay matched to 28 bowls. Fallback (VD07): a 3-cover close with the far table already open.

### B03-SH12 · three checkpoints · L08 "ยิ่งด่านเยอะ ยิ่งดูปลอดภัย ใช่ไหม?"

- **Purpose.** Plants the refrain as comfort; gives L08 something to watch.
- **Seen.** Warm, orderly three-quarter view down the open LT; T stands back a step at (−2.75, 0, +2.0), hands folded; lifters in attendance. Three warm gold glints pop in turn: G-TAG on the tag in LT-A01, G-SPOON on the spoon resting on SAU, G-COVER on the rim of LT-A03's open cover on the runner.
- **Camera.** `cam: H, at (−3.4, 0.9, +1.2), yaw 40 → 36, r 2.6 → 2.4, eye 1.5, f 1000`; slight push. **This end framing is reused exactly by B04-SH17.** Child out of frame.
- **Cast.** T view `left`, P01 hands folded, `neutral`; E1–E3 `front`, P01.
- **Light.** Daylight, warm; glints are additive SVG (brief VD08), 10–14 px core at 1080 wide.
- **Sound.** M1 settles warm and confident; S9 three warm chime ticks rising, one per glint.
- **Truth limits.** VD12 (no ticks, icons or "ด่าน 1/2/3" text), TL3.
- **Entry → exit.** Entry: covers off (SH11 exit). Exit: all three glints on.
- **Acceptance.** Glints locked to their anchors within 1 px through the push; all three above y 1160.

### B04-SH13 · can silver catch poison? · L09 "แต่แผ่นเงินเนี่ย จับพิษได้จริงเหรอ?"

- **Purpose.** Chapter change to doubt: hard cut to the placeless demo top (cool light).
- **Seen.** DEMO22: plain grey paper, a white dish with a halved boiled egg, strip A lying beside it, a small clear cup with strip B already standing in it. The child's mitten hand enters from screen right-front and picks up strip A.
- **Camera.** `cam: D, at (0, 0.01, 0), yaw 15 → 9, r 0.38 → 0.33, eye 0.30, pitch −55, f 1100` (brief: demo anchor).
- **Cast.** CHILD HAND (macro), pinch grip on strip A.
- **Light.** Cool neutral top light; the yolk is the only warm colour.
- **Sound.** Hard cut A1 → A2; M2 single low held bowed-bass note with a faint cool shimmer starts on L09.
- **Truth limits.** TL4 (strip A is the demo's own, lying on the paper, not from LT), TL5 (illustration register, no label per user Q1), TL6.
- **Entry → exit.** Entry: hand out of frame. Exit: strip A held above the left yolk.
- **Acceptance.** Reads as a demonstration, not a palace scene; no text.

### B04-SH14 · a boiled egg darkens silver · L10 "ไข่ต้ม ยังทำเงินดำได้เลย"

- **Purpose.** Show before tell (ER02): the strip darkens in the egg.
- **Seen.** The hand presses strip A's tip into the left yolk (contact, no deeper than 0.01 m); the tarnish ramp runs from the tip to about 60 % of the strip over the L10 words (time-compressed, not labelled as real time). **LF02 frame** at mid-ramp.
- **Camera.** `cam: D, at (−0.02, 0.012, 0), yaw 9 → 4, r 0.30 → 0.24, eye —, pitch −50, f 1100`; push.
- **Cast.** CHILD HAND, press.
- **Light.** Cool top light; the darkening strip loses its highlight.
- **Sound.** M2 holds; S10 tiny damp squish at contact; S11 dull downward shimmer as it darkens.
- **Truth limits.** TL5 (time-compressed tarnish, no clock or label), TL6.
- **Entry → exit.** Entry: strip above the yolk. Exit: strip in the yolk, tip ≈ 60 % dark.
- **Acceptance.** The darkening is visible at 540 px wide; strip tip above y 1160.

### B04-SH15 · sulfur, not poison · L11 "ในไข่มีกำมะถัน เงินดำเพราะมัน ไม่ใช่เพราะพิษ"

- **Purpose.** Tell, with a diagram layer clearly an illustration.
- **Seen.** The hand lifts strip A just above the yolk; 12–20 tiny yellow specks rise from the yolk in short arcs and land on the strip tip, each landing deepening the dark only under it; the clean upper part of the strip stays bright. On "ไม่ใช่เพราะพิษ" nothing new appears (no poison image).
- **Camera.** `cam: D, at (−0.03, 0.03, 0.01), yaw 4 → 0, r 0.22 → 0.20, pitch −40, f 1100`; slow push.
- **Cast.** CHILD HAND holding strip A.
- **Light.** As SH14.
- **Sound.** M2 holds; specks silent (sound carries no clue, TL8).
- **Truth limits.** TL6 (no skull, smoke or "poison" text), VD12 (dots only, no "S" symbol), TL5.
- **Entry → exit.** Entry: strip in the yolk (SH14 exit). Exit: strip above the yolk, dark only where specks landed.
- **Acceptance.** Tarnish grows only under landed specks (deterministic per seed).

### B04-SH16 · silver stays bright · L12 "พิษที่ไม่มีกำมะถัน เงินก็เฉย" + silence

- **Purpose.** The other half of the answer: a sulfur-free poison leaves silver bright; the child is puzzled.
- **Seen.** Truck right to the cup; on "พิษที่ไม่มีกำมะถัน" the hand lifts strip B and dips it again (S12 plink); on "เงินก็เฉย" it stays bright. The child's face leans in from the top of frame (front three-quarter, about 0.35 m above the top), `suspicious` easing to `surprised`; ≈ 0.5 s near-silence after the line.
- **Camera.** `cam: D, at (0.12, 0.03, −0.04), yaw 0 → −4, r 0.36 → 0.32, pitch −30, f 1100` (lower pitch so the face fits the top of frame).
- **Cast.** CHILD head, shoulders and one hand only, front three-quarter.
- **Light.** Cool top light; strip B keeps a bright highlight; the face takes a little cool light.
- **Sound.** M2 fades out under "เงินก็เฉย"; S12 plink; then A2 only for ≈ 0.5 s.
- **Truth limits.** TL6 (plain clear liquid, no label), TL4.
- **Entry → exit.** Entry: strip B standing in the cup. Exit: strip B bright, child's face puzzled.
- **Acceptance.** Strip B visibly brighter than strip A in the same frame or by the cut; face above y 1160.

### B04-SH17 · this checkpoint looks safer than it is · L13 "ด่านนี้ ดูปลอดภัยกว่าที่เป็นนะ"

- **Purpose.** Flips the refrain, scoped to the silver only ("ด่านนี้").
- **Seen.** Back in the hall, SH12's end framing exactly; the three glints are on as at SH12's end; on "ด่านนี้" G-TAG greys and shrinks; G-SPOON and G-COVER stay warm.
- **Camera.** SH12 end values: `cam: H, at (−3.4, 0.9, +1.2), yaw 36 → 35, r 2.4 → 2.33, eye 1.5, f 1000` (a 3 % push so the frame is not dead; the glint change is the only story difference).
- **Cast.** As SH12 end (T hands folded, lifters in attendance).
- **Light.** Hall daylight as SH12 (the cool chapter belongs to the demo).
- **Sound.** Cut A2 → A1; sparse M1 fragment (two plucks); S13 dimmed tag chime on "ด่านนี้" (spoon and cover chimes untouched).
- **Truth limits.** TL1 / C03 (the spoon glint never dims: the tasting stays true), VD12.
- **Cut out.** Ends on the dimmed tag glint, not on the spoon (brief risk 2).
- **Entry → exit.** Entry: three warm glints. Exit: tag glint grey, two warm.
- **Acceptance.** Dimmed tag glint distinct at 540 px wide; nothing else changes between SH12 end and SH17.

### B05-SH18 · so why the long table? · L14 "แล้วตกลง โต๊ะยาวนั่นมีไว้ทำไม?"

- **Purpose.** Re-asks the central question through the child.
- **Seen.** Child at screen-right eating from his spread; he pauses with the spoon and turns his head toward LT at screen-left (open covers, lifters), curious. Intentional return to the frame-0 axis, now with food in front of him.
- **Camera.** `cam: H, at (−1.0, 1.0, −0.62), yaw 74 → 68, r 2.0 → 1.8, eye 1.05, f 1100` (est: child x 700–880 px; W4 checks). Arc and push.
- **Cast.** CHILD view `front` (head via `turn-head-left`), P31 with CS, `suspicious` (curious, not smug).
- **Light.** B05 key a little warmer; warm pool on CT; LT in even, cooler light.
- **Sound.** M1 returns; soft riser begins under L14.
- **Truth limits.** TL1 (no "for nobody" look or smirk), TL4, TL3.
- **Entry → exit.** Entry: child eating, head front. Exit: head turned to LT.
- **Acceptance.** Child lead ≥ 480 px; LT clearly screen-left.

### B05-SH19 · made for show · L15 "เพราะมันทำไว้โชว์... ไม่ได้ทำไว้กิน"

- **Purpose.** The one large reveal move: both tables and the line of eunuchs read as a display.
- **Seen.** Crane up and back from the child's eye: LT's long row of open silver dishes with lifters, T and Y standing in a line reads as a formal display; the child small at his table at screen-right with his spread. Ceiling beams appear at the top.
- **Camera.** `cam: H, at (−1.8, 0.8, −0.3), yaw 20 → 28, r 4.2 → 6.0, eye 1.1 → 3.4, pitch 0 → −22, f 950` (brief VD10). The camera ends past z +4.2 (the open-doors side); the near wall is not drawn (Boss check). Lead-size exception.
- **Cast.** CHILD `front` (pitch cue), eating; T, Y, E1–E3 view `front`, P01, standing in attendance. Six figures.
- **Light.** B05 daylight, a little warmer and lower contrast.
- **Sound.** Riser resolves into a warm chord on "ไม่ได้ทำไว้กิน".
- **Truth limits.** TL3 (rich, handsome display; no wilting or dust), TL1, TL7.
- **Entry → exit.** Entry: child's eye height near CT. Exit: high wide, both tables in frame.
- **Acceptance.** Both tables and the child readable; LT screen-left, CT screen-right.

### B05-SH20 · the dish in front of him · L16 "โต๊ะยาวนั่น มีไว้ให้ดูจริง ๆ... ส่วนที่ปูยีกินจริง คือจานตรงหน้าเขา" + ~3 s hold

- **Purpose.** Payoff and closed ending; bookends frame 0 with the roles resolved.
- **Seen.** Opens on LT (open domes in an even row) for the first half; a short breath at the ellipsis; on "ส่วนที่ปูยีกินจริง" the camera trucks and descends across the hall to the child eating from his spread and settles on "จานตรงหน้าเขา". Hold ~3 s: he eats happily (`eat-chew`), LT soft and far at screen-left. **LF01b frame** = last hold frame.
- **Camera.** `cam: H, at (−3.6, 0.9, −0.3) → (0.0, 0.8, −0.35), yaw 40 → 30, r 3.2 → 1.5, eye 1.6 → 1.5, f 1100` (end est: child near centre, LT far end x ≈ 190 px; the spread rises above the caption band). Last 20 f move < 0.5 % of the distance.
- **Cast.** CHILD view `front`, `new: seated-spoon-to-mouth` + `eat-chew`, `happy` / `relieved`. No eunuch at CT (TL2).
- **Light.** Warm pool on CT; LT cooler and softer.
- **Sound.** M1 thins under the first half; near-silence breath at the ellipsis; END1 (M1 motif's first two notes on plucked zither, warm low pizzicato root) starts on "จานตรงหน้าเขา" and rings through the hold over A1; optional V02 contented "อืม" and S14 two spoon taps in the hold; no new event after END1's second note.
- **Truth limits.** TL1, TL2 (the dishes are not checked or compared), TL3, F06 (a spread of about twenty dishes).
- **Entry → exit.** Entry: LT framed. Exit (final frame): child eating at his spread, LT far left, near-still.
- **Acceptance.** Settle lands on "จานตรงหน้าเขา"; hold ≥ 3 s; no text.

## Cut audit (TL1 / TL2)

- SH02 → SH03: leaves on the cover going back and T's turn, enters on the child already looking along the covers; his turn on "ไม่แตะ" goes away from LT. No spoon-to-indifferent-face cut.
- SH09–SH12: the child is out of frame by plan; CT is never in a tasting or lid shot.
- SH17 → SH18: leaves on the dimmed tag glint (spoon glint warm), enters on a curious child, not an indifferent one.
- CT shots (SH05, SH06, SH20): no eunuch at CT after the set-down; no tag, glint or lid on the child's dishes.

## Dependencies and open items

| Owner | Item | Status |
| --- | --- | --- |
| Boss | N1–N7 as the brief's [Boss dependencies](film-brief.md#new-assets-and-missing-capability-boss-dependencies); LF01, LF02 and LF01b paintings at W3 (after this page) | `missing` |
| Boss | SH01: front child card on an armchair seen at ≈ 68°; decide at LF01 (fallback world facing) | open |
| Boss | SH19 camera ends beyond z +4.2 (near wall not drawn) | open |
| Boss | SAU (taster's saucer) anchor added at (−3.30, 0.83, +2.24) for SH09/SH12/SH17 | new est anchor |
| Editor | V01 child "หืม?" and optional V02 casting (≤ 10 s samples first) | at voice lock |
| Ton | M1, M1b, M2, END1, A1, A2, S1–S6, S8–S14 NEEDS-GEN; S7 library check | after W4 cue sheet |
| Boat | Q-B1 costume and objects, Q-B2 dowager-side tags, Q-B3 generic hall (brief) | open, not blocking |
| User | Q-SB1 add LF01b as a third look still | open |
| Film (W4) | integer frames from the voice-lock measure, `shot-projection.py`, lead sizes, caption-zone checks, shot-local sound frames | after voice lock |

Element captures: unavailable (no EP22 asset exists).

Deviations from the brief's per-beat intent (Film, this pass): (1) L01 is split SH01 "ถ้าคุณเป็นขันที" / SH02 the rest, so frame 0 shows the child with LT while narration runs from frame 0; (2) SH02 has no child in frame (geometry and TL1); (3) SH04 is V01 only and the carriers' entry moves into SH05, because the doorway and a readable child do not fit one portrait frame at child scale; (4) SH11 is shot from the near (hall) side with lifters facing camera, not from behind (no `backQuarter` lifters).

## Change log

- 2026-11-16 EDU-EP22-STORYBOARD-R1 (Film W2.2): first untimed storyboard, 20 shots, on SCRIPT-R3 / FACT-R3 / BRIEF-R1; review rows EDU-EP22-ROWS-R1 written beside it. LF01b decided (SH20 hold frame) pending user confirmation Q-SB1. No timing, picture or sound produced.
