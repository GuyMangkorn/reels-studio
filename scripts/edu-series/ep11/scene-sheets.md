# Timed scene sheets and index — EDU-EP11-SHORT (EDU-EP11-SHEETS-R1.4)

- **Deliverable:** `EDU-EP11-SHORT` · **Revision:** EDU-EP11-SHEETS-R1.4 (Film, 2026-11-09; R1.4 reframes S01-B04-SH03 only, [SD15](#staging-deviations); every other shot is R1.3 unchanged. R1.3 = Film W5.1, first timed sheets; the number continues the ROWS/BRIEF R1.x line) · **Status:** `ready-for-dev`, voice-timed: Boss may build plates from this revision (W5.2), Editor may place the voice and assemble the blockout (W5.3). · **Timing:** `checked-with-audio` for line onsets, word anchors and slot lengths (Editor measure, below); word onsets *inside* a line that the measure does not list are marked `est` and Editor confirms them (±3 f) at placement.
- **Evidence:** runtime: none (no composition, no blockout) · audio: placed on paper from [voice-lock.md](voice-lock.md) **R2** (narration anchors) + **R2.1** (Leda V01–V04 and hold-exhale lengths); not assembled · render/samples: none · projection: cameras already built by Boss are **measured** (SP1, SP2, LF01–LF05, [spikes.md](spikes.md), [look-frames-report.md](look-frames-report.md)); the other cameras are **computed** with the kit `YCam` formula (`orbitYCam`, `camToPicture`, no pitch) replicated in Python, which reproduces LF01 (feet y 1511 vs measured 1510.7) and LF03 (rope cut (181, 1061) vs measured (180.9, 1061.3)) · user approval: voice set and 59.60 s total approved 2026-11-09 (task log); look lock W3.2 and storyboard (story) pass 2026-11-09; this revision itself is not approved.
- **Inputs (by revision):** script **EDU-EP11-SCRIPT-R3** ([script.md](script.md), Thai unchanged) · fact-check W1.3 + W2 recheck ([fact-check.md](fact-check.md); FIX-2, B-P1, B-P2) · brief **EDU-EP11-BRIEF-R1.3** ([film-brief.md](film-brief.md); VD01–VD33; R1.3 only records the decisions amended here) · storyboard **EDU-EP11-ROWS-R1.2 → R1.3** ([storyboard.md](storyboard.md), [review-rows.json](review-rows.json)) · voice lock **R2 / R2.1** · spikes SP1–SP4 · look frames LF01–LF05 after fix round 3 · [task.md](task.md) log to 2026-11-09.
- **Target:** worktree `check-project-pipeline-4ec3f9`, branch `claude/education-concepts-cleanup-61a91a` at `cfbfd4b` (uncommitted `src/painted/edu11/` spike and LF code read: `car.ts`, `hall.ts`, `store.ts`, `sp3.tsx`) · 30 fps · `durationFrames` **1788** (59.60 s) · 1080×1920 · composition offset 0 (not registered; Editor, never in `src/Root.tsx`) · ending closed, 2.0 s hold.
- **Baseline (link, not copied):** sets, axes, units and kit heights per the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline) and set plans; built anchors win: rail Ø 0.04 at y 0.90 on the left wall, z −0.55…0.40; button panel x −0.699, z −0.08…−0.32, y 0.85–1.55, display y 1.40–1.50; bell (−0.697, 0.95, −0.20) (`car.ts`); hall rope cut via `ropeCutAt(sx, m)`, assistant `paintAssistant` (`hall.ts`).
- **Camera lines:** `cam: target (x, y, z), yaw a→b, r, eye, f, hy` = one kit `camMove` (yaw = azimuth in degrees). **`hy` is the horizon row** (coordinator convention after LF fix round 1); every value below is written that way. Where the brief's R1.2 value was a target row, the converted value is given and the brief's is in the change log. A move runs linearly over the shot unless `ease [u0, u1]` is given.
- **Clocks:** `G` composition frame; shot-local `L` = G − shot start; ranges half-open `[start, end)`. Every event is a pure function of G or L (seek-safe). The fall clock (FC) and the rewind story frame `s` are pure functions of G.
- **One shot = one timeline scene** (scene ID = shot ID). Every join is a hard cut except the fade-up at S01-B04-SH01 and the inset moves (DOM, inside shots).

<a id="placement-rules"></a>
## Placement rules

- **PL01 Stable:** shot IDs, order, beats, line assignment, casting, looks, clue IDs CL01–CL03, deviations D02–D06 of ROWS-R1.2 / BRIEF-R1.2 stay. Ranges, event frames and the staging deviations SD01–SD14 below change.
- **PL02 Voice is placed, not retimed:** narration file = store `projects/EDU/voice/ep11-nar-kore-A-r3-x0.92-regap028-L16t1.wav` (49.64 s; every line gap 0.28 s; L01 speech at 0.00 s). Woman's lines = store `projects/EDU/voice/ep11-v-V0{1..4}-Leda.wav`, exhale `ep11-v-V05hold-Leda.wav`. No atempo, no inner cut.
- **PL03 Timeline rule (voice lock):** lead 0.10 s; each slot is `0.14 s + slot + 0.14 s` replacing one 0.28 s line gap. So G(s) of a narration point = NAR s + 0.10 + the sum of the R2.1 lengths of earlier slots (V01 0.895, V02 2.784, V03 1.766, V04 0.917, black 0.4, gasp 0.6, clamp 0.6), × 30, rounded half up.
- **PL04 Shot starts:** an in-line or narration-led cut sits **3 f before the onset frame** of the shot's first word; a slot-led shot starts on its slot start frame. Exceptions with reasons in the shot blocks: S01-B03-SH05 and S01-B04-SH01 (black and fade-up start on the black slot edges), S01-B05-SH04 (starts on the clamp slot, D04).
- **PL05 Slots:** a slot take is placed at its slot start. If Editor's final trim differs by ≤ 3 f, it stays start-anchored and the shot end holds; > 3 f goes back to Film (retime), never pushes later frames.
- **PL06 Rows:** [review-rows.json](review-rows.json) **EDU-EP11-ROWS-R1.3** carries `start`/`end` (G) and `untimed: false`; Thai VO unchanged; `seen` changed only where the picture changed (shots 3, 4, 5, 8, 9, 15) and those rows carry `changed`.

<a id="narration-placement"></a>
## Timeline and voice placement (Editor)

| Item | G on | G off (last voiced) | Shot | Word anchors (G, voice-lock R2 + R2.1 shift) |
| --- | --- | --- | --- | --- |
| L01 | 3 | 128 | SH01, SH02 | "ขาด" 22 · "ร่วง" 39 · "คุณ" 72 `est` · "กระโดดตอนท้าย" 78 · "รอดมั้ย" 112 |
| V01 | 132 | 159 | B01-SH03 | Leda `<gasp> เฮ้ย!` 0.895 s |
| L02 | 163 | 238 | B01-SH03 | "จากความสูงขนาดนี้" 163 · "แทบ" 196 · "ไม่ช่วยอะไรเลย" 204 |
| V02 | 242 | 325 | B01-SH04 | Leda 2.784 s; "โดดสวนขึ้นไป" 290 `est` (Editor measures inside the take) |
| L03 | 330 | 460 | B02-SH01 | "ร้อยยี่สิบ" 375 · "ลิฟต์เร็วเท่าไหร่" 402 · "คุณก็เร็วเท่านั้น" 430 · "เท่านั้น" 448 `est` |
| L04 | 469 | 534 | B02-SH02 | "กระโดดสุดแรง" 469 · "หักออกได้แค่" 497 · "ราวสิบ" 519 |
| L05 | 543 | 604 | B02-SH03 | "ก็แค่กลายเป็นเหมือน" 560 · "ชั้นสิบเจ็ด" 587 · "สิบเจ็ด" 593 `est` |
| V03 | 608 | 661 | B02-SH04 | Leda `ห๊ะ, <sigh>` 1.766 s; sigh from ≈ 622 `est` |
| L06 | 665 | 750 | B03-SH01, SH02 | "ต้องกะให้ตรง" 704 · "เสี้ยววินาที" 726 |
| L07 | 759 | 810 | B03-SH03 | "เร็วไป" 759 · "ก็ลอยไปชนเพดาน" 771 · "เพดาน" 800 `est` |
| V04 | 814 | 841 | B03-SH03 | Leda `โอ๊ย!` 0.917 s |
| L08 | 846 | 889 | B03-SH04 | "ก็ไม่ทันแล้ว" 862 |
| black | 893 | 905 | B03-SH05 | total silence 0.4 s |
| L09 | 909 | 973 | B04-SH01 | "ลิฟต์ร่วงแบบนี้ได้จริงเหรอ" 934 |
| L10 | 981 | 1086 | B04-SH02 | "โอติส" 1024 · "แล้วสั่งให้ตัดเชือก" 1058 · "ตัดเชือก" 1071 |
| gasp | 1091 | 1109 | B04-SH03 | crowd gasp 0.6 s (S5) |
| L11 | 1113 | 1174 | B04-SH03, SH04 | "แล้วเบรกก็จับราง" 1137 · **"จับราง" 1155** |
| L12 | 1183 | 1308 | B04-SH05, SH06 | "คุณกลัว" 1192 `est` · "ถูกแก้ไว้ก่อน" 1213 · "ที่มีเบรกนิรภัยตัวแรก" 1257 · "ซะอีก" 1298 |
| L13 | 1319 | 1380 | B05-SH01 | **"แทบ" 1341** · "ร่วงแบบนี้ไม่ได้เลย" 1349 |
| L14 | 1388 | 1516 | B05-SH02, SH03 | "เส้นเดียวก็รับไหว" 1425 · "ขาดหมด" 1467 · "เบรกก็จับราง" 1488 · **"จับราง" 1500** |
| clamp | 1520 | 1538 | B05-SH04 | ring-out slot 0.6 s (D04) |
| L15 | 1543 | 1594 | B05-SH04 | "คุณก็หยุดไปด้วย" 1565 |
| L16 | 1603 | 1728 | B05-SH05 | "ไม่ต้องกระโดดเลย" 1638 · pause 1672–1683 · **"กดปุ่มฉุกเฉิน" 1683** · "ปุ่ม" 1688 `est` · "แล้วรอ" 1712 |
| hold | 1728 | 1788 | B05-SH06 | exhale take 1.570 s at G1732 |

- **Total:** speech ends G1728 (57.60 s); hold [1728, 1788) → **1788 f = 59.60 s** (cap 60 s; the user accepted it over the 53–57 s target, no trim).
- **Shift vs voice-lock R2 timeline columns:** +0 before V01, +8/9 f after V01, +41/42 after V02, +79 after V03, +95 after V04 (cumulative extra slot length 0.295 / 1.379 / 2.645 / 3.162 s). ±1 f against Editor's own R2 table comes from rounding the 2-decimal seconds; Editor's placement wins by ≤ 1 f without a Film revision.
- **Onsets that moved 2–9 f inside a line against the R2 columns (confirmed):** L10 line onset 981 = R2 886 + 95 (R1.2 plan 878 + 7 relative: the hall shot's first word comes 7 f after its R1.2 start; kept, the cut moves with it, PL04); L12 b "ถูกแก้ไว้ก่อน" 1213 = R2 1118 + 95 (R1.2 had 1108, +9 relative: B04-SH06 now starts 1210, PL04); L13 "แทบ" 1341 = R2 1246 + 95 (R1.2 stamp 1238, +7 relative: the stamp sits on the word, the rewind ends 1 f before it); L16 "กดปุ่มฉุกเฉิน" 1683 = R2 1588 + 95 (+9 against R1, SD11).

<a id="fall-clock"></a>
## Fall clock and HUD (FC; brief VD10 amended, SD02)

- `y_car(G) = 57 − 55·((G − 39)/854)²` for G in [39, 893], 57 before, 2.0 at 893 and after (frozen). Car floor y in SHAFT metres; floor n sits at 3(n − 1).
- **Counter** `= y_car > 56.5 ? 20 : floor(y_car / 3) + 1`, clamped 1–20. Flip frames (G): 19 @120, 18 @239, 17 @322, 16 @385, 15 @438, 14 @485, 13 @528, 12 @567, 11 @604, 10 @638, 9 @670, 8 @701, 7 @730, 6 @759, 5 @786, 4 @812, 3 @837, 2 @862, 1 @886. One `ui_click-tick_01` per flip while the HUD is on (from 120).
- **Needle** = `sqrt((57 − y_car)/55)` of the dial (top tick at G893). Values used: G54 2 %, G375 39 %, G445 48 %, G519 56 %, G892 100 %.
- **HUD slide-in** G45–54 (counter 20, needle ≈ 2 %, tag). "Frame-0 HUD state" = `hudAt(54)`.
- **Light** 100 % to G30, flicker G30–42, 85 % from G42 to the black; 100 % after the clamp (G1500).
- **Streaks** (section shots, screen layer): 20–25 % in B01-SH02, 25 → 45 % in B02-SH01, 45 % B02-SH02, 55 → 65 % in B03-SH04 (heavier set, R1.2), none in the wide; rewind streaks 15 % (B05-SH01).

<a id="caption-plan"></a>
## Caption plan

White captions with the edu stroke, no band (series default), band y 1176–1344, ≤ 2 lines; `@TamMaiLa` top-left; screen labels hold their slots (brief VD31). Cue = `[phrase onset, last voiced frame + 6)`, capped at the next cue's onset or a cut to black; text verbatim from the script.

| Cue | G [start, end) | Thai |
| --- | --- | --- |
| L01a | 3–72 | ถ้าสลิงลิฟต์ขาด ร่วงจากชั้นยี่สิบ… |
| L01b | 72–132 | คุณกระโดดตอนท้าย รอดมั้ย |
| V01 | 132–163 | เฮ้ย! |
| L02 | 163–242 | จากความสูงขนาดนี้… แทบไม่ช่วยอะไรเลย |
| V02 | 242–330 | เอาไงดี… โดดสวนขึ้นไป! |
| L03a | 330–402 | ใกล้พื้น ลิฟต์เร็วราวร้อยยี่สิบ… |
| L03b | 402–466 | ลิฟต์เร็วเท่าไหร่ คุณก็เร็วเท่านั้น |
| L04 | 469–540 | กระโดดสุดแรง หักออกได้แค่ราวสิบ |
| L05 | 543–608 | ชั้นยี่สิบ… ก็แค่กลายเป็นเหมือนชั้นสิบเจ็ด |
| V03 | 608–665 | ห๊ะ… |
| L06a | 665–704 | แต่คุณมองไม่เห็นพื้น… |
| L06b | 704–756 | ต้องกะให้ตรงเสี้ยววินาที |
| L07 | 759–814 | เร็วไป ก็ลอยไปชนเพดาน |
| V04 | 814–846 | โอ๊ย! |
| L08 | 846–893 | ช้าไปนิด… ก็ไม่ทันแล้ว |
| L09 | 909–979 | แต่เดี๋ยวนะ… ลิฟต์ร่วงแบบนี้ได้จริงเหรอ |
| L10a | 981–1024 | ปี 1854… |
| L10b | 1024–1092 | โอติสยืนบนแท่นสูง แล้วสั่งให้ตัดเชือก |
| L11a | 1113–1137 | แท่นตกนิดเดียว… |
| L11b | 1137–1180 | แล้วเบรกก็จับราง |
| L12a | 1183–1213 | สิ่งที่คุณกลัว… |
| L12b | 1213–1257 | ถูกแก้ไว้ก่อนมีลิฟต์โดยสาร |
| L12c | 1257–1314 | ที่มีเบรกนิรภัยตัวแรกซะอีก |
| L13 | 1319–1386 | ลิฟต์สมัยนี้ แทบร่วงแบบนี้ไม่ได้เลย |
| L14a | 1388–1425 | สลิงมีหลายเส้น |
| L14b | 1425–1467 | เส้นเดียวก็รับไหว… |
| L14c | 1467–1522 | ขาดหมด เบรกก็จับราง |
| L15 | 1543–1600 | ลิฟต์หยุด… คุณก็หยุดไปด้วย |
| L16a | 1603–1638 | ถ้าเจอลิฟต์ค้างจริง… |
| L16b | 1638–1683 | ไม่ต้องกระโดดเลย |
| L16c | 1683–1734 | กดปุ่มฉุกเฉิน แล้วรอ |

- L01a/L01b split on "คุณ" `est` G72: Editor moves the split to the measured pause (±4 f). L12 is cut in three at its measured anchors (the longest line, 4.17 s).
- **Open check (Editor, W5.3):** stroke legibility on the bright sepia frames (LF03 caption mean 0.515, LF04 0.654, catch 0.628): `scripts/caption-zone.py --band 1176:1344` plus a viewed sheet; the edu stroke carries them (no band, series default).

<a id="sound-plan"></a>
## Sound plan (whole video; per-shot cues in the shot blocks)

Direction, library IDs and NEEDS-GEN codes M1, A1–A3, S1–S9 are the brief's ([sound direction](film-brief.md#sound-direction); library read 2026-11-09, no new gaps here). Only timing changes:

- **Beds:** A1 lift hum + fan G0–30 (dies with the snap); A2 shaft wind from G42, rising, same bed under interior and section, loudest in B03-SH04, **cut dead at G893**; total silence G893–905; shimmer G905; NG-A3 hall murmur from G965 (−6 dB from G1180), thinned to the street hush in B04-SH06; A1 hum back G1340–1385 (fresh run); A2 under B05-SH02/SH03 cut at the clamp G1500; NG-A1 fan only (no motor) G1520–1788.
- **Music:** none to G1155; M1 warm strings G1155 → resolved by G1305, faded out by G1316; none under L15 or L16; `stinger_pizz-tag-ending_01` from G1728 (≈ 1.8 s, 0.5 s fade, done by G1788; UT15).
- **Pulse and riser:** `tension_heartbeat-slow_01` G662–893; `reveal_riser-tension_01` G766–893 (the R1.2 4.23 s excerpt, end anchored on the black; SD13); floor ticks per FC.
- **Silence policy** unchanged: no impact sound ever; black is silent; after the clamp only ring-out, fan, breath and the bell.
- **Mix intent (Editor sets levels):** hold (B01 lift) → hit (snap G30) → lift (B02 plucks) → drop (V03) → lift to peak (B03, riser) → drop to zero (black) → release (shimmer, hall) → lift (M1) → hit (stamp, clamp) → release (fan, bell, exhale, tag).

<a id="staging-deviations"></a>
## Staging deviations from ROWS-R1.2 / BRIEF-R1.2 (Film decisions)

| ID | Change | Reason |
| --- | --- | --- |
| SD01 | Snap split: S2 snap, flicker and `shock` at **G30** (the gap after "ขาด" 22); drop jolt, whoosh and the fall clock start on **"ร่วง" G39** (R1.2: all at f40 est) | Each picture hits the word it shows ("ขาด" → snap, "ร่วง" → fall); a loud snap on "ขาด" would mask the word (brief ducking rule: hits sit in syllable gaps); frame 0 keeps 1.0 s of calm lift (UT01) |
| SD02 | Fall clock G39–893 and counter hold rule (FC) | New snap and black frames; the hold rule keeps frame-0 HUD = 20 (VD18) and still flips 20 → 19 inside B01-SH02 |
| SD03 | Body roll **7°** (head toward the rail; LF01b built `−7` in the kit sign) reached at G220 and held, instead of 14°; **`hairCalm`** on every hair-float state; pen and tissue drift with the phone; phone drift point (0.62, 1.50, −0.20) | LF01b fix round 1 (viewer check pass, user look lock 2026-11-09): the 14° lean and spiky fan read as shock |
| SD04 | Crouch feet **x −0.36** (LF02) in B01-SH04, B02-SH01/SH02 and the close-ups; CAM-CAR-CROUCH target x −0.26, CAM-CAR-CU target x −0.36 | LF02: at x −0.20 her face sat under the arrow; one pose key across the interior ↔ section cut (R09) |
| SD05 | `hy` as horizon row: CAM-SHAFT-CLOSE **768** (LF02); CAM-CAR-LOW **1190** (810 as a horizon row puts the ceiling at y −49, the bonk off frame); CAM-HALL-W 1375 → 1399, CAM-HALL-M 1164 → 1188 / 1188 → 1206, CAM-HALL-CATCH 529 → 506, CAM-STORE 1584 → 2234 (converted from target row 960 / 700 / 760 / 960 with `horizonHy`) | Coordinator convention (LF fix round 1); car and shaft values that Boss built as horizon rows (CAM-CAR-M 740, CAM-SHAFT-TRACK 930, CAM-JAWS 800) are unchanged |
| SD06 | POV: an in-world floor indicator above the doors (7-seg on the door transom, centre (0, 2.18, 0.649)) carries the ticking digit; POV camera f 800, hy 1000 | The left-wall panel (z −0.08…−0.32) is beside her and cannot appear in a door-facing view (R1.2 put it at x 1725, off frame) |
| SD07 | 1854 staging mirrored: trestle, winch, assistant and rope cut on the **left** upright; assistant feet (−0.75, 1.2, 0.55), left view, axe raised in front on the rope side; showman points down-left | User notes in LF fix rounds 2–3, look-locked; keeps the cut clear of INSET |
| SD08 | B01-SH04 85 f (V02 2.78 s): adds a weigh-up beat (look up at the ceiling, then down) and a knee pre-load before the hold | V02 is 1.08 s longer than planned; the shot holds with action, not a freeze |
| SD09 | B02-SH04 54 f (V03 1.77 s with the sigh): `surprised` on "ห๊ะ", `sad` with the sigh, shoulders drop, slow push | V03 is 1.27 s longer; the deflation lands on the face (ER04) |
| SD10 | 1854 pawl bite on **"จับ" G1155**; modern jaws bite on **"จับ" G1500** | Brief handoff asked to move the pawl onto "จับ" keeping slack → spring → pawl; B04-SH04 now has 46 f, enough for the order before the bite |
| SD11 | L16: reach starts in the new pause (G1676), press contact **G1688** on "ปุ่ม" `est`, bell G1689 | The re-read L16 has a 0.36 s pause before "กดปุ่ม" (+9 f vs R1): she acts in the pause and the press lands on the word |
| SD12 | B05-SH01 after the rewind: camera holds frame-0 values then drifts yaw 10 → 8, r 2.50 → 2.44 (R1.2 "yaw 6→10") | R1.2's line contradicted "the picture at the rewind end equals frame 0" (SP3 snaps the camera to `F0_CAM`) |
| SD13 | Riser G766–893 (starts in B03-SH03) | Keeps the excerpt ending dead on the black with three slots now longer |
| SD14 | Inset still = B04-SH01 G977 canvas (`frozenCam(72/73)`), shrink G966–978, pulse G1192–1207, grow G1316–1325 | Retimed N9; SP3's f877 still is superseded |
| SD15 | **R1.4, B04-SH03 only:** new camera CAM-HALL-ROPE `target (−0.15, 3.00, 0.35), yaw 31→32, r 5.00→4.75, eye 1.82, f 2050, hy 1240` replaces CAM-HALL-M for this shot (SD05's CAM-HALL-M 1164 → 1188 now applies to nothing; B04-SH05 keeps CAM-HALL-M 1188 → 1206); hero rope prop PR-ROPE-HERO (Ø 0.05 m world ribbon); SH03-only cheats: assistant feet (−0.75, 1.2, 0.55) → **(−0.50, 1.20, 0.45)**, crowd2 (0.7, 0, 2.8) → **(0.55, 0, 2.60)**, crowd4 (1.6, 0, 3.4) → **(1.55, 0, 2.20)**; contact frame G1091 with blade on the rope, follow-through, frayed ends. Timing and shot range unchanged | Viewer check draft r4 failed SH03 R-C after two Boss fix passes (report-r4.md; frames extra2-G1091/1110/1134): at CAM-HALL-M the cut sat at x ≈ 101–124 on the frame edge, on top of the left upright, behind the assistant's shoulder (centre separation ≤ 0.34 m at any yaw from his SD07 mark), the rope drew 6 px, and crowd heads fell off frame. Yaw 31 puts the cut against the open hall left of the upright, the cheat gives the blade 0.48 m of room (≈ 85 px clear of his silhouette), f 2050 makes the rope ≈ 20 px and the drop ≈ 62 px; user asked Film to reframe (2026-11-09) |

<a id="settled-items"></a>
## Settled open items (W3 → W5.1)

- **VD18 HUD after the rewind: kept on, settled.** The HUD fades in G1325–1328 and at G1340 equals `hudAt(54)` (20, needle ≈ 2 %, tag, no pill). Reason: the tag must frame the fresh run (R01), the stamp "แทบ" qualifies it (VD25), and B05-SH03 needs the needle to show "a few notches" (FIX-2). Without it FIX-2 has no picture.
- **`hairCalm`: settled (SD03).** Every float state uses `HeadStyle.hairCalm`; LF02 is not repainted as a separate look frame: the B02-SH01/SH02 plates carry it at W5.2 and the Draft viewer check judges it. Kit intake of `hairRise` + `hairCalm` stays proposed (N5).
- **LF01b / LF02 / LF03 deviations: accepted** (lift −0.04 m with the grip pivot, feet gap ≈ 85 px; crouch x −0.36; mirror SD07; assistant left view).
- **VD24 LF04 lead size (passengers 468.6 / 428.8 px): Film recommends accepting the exception** (the store front and cage are the subject; the WOMAN inset carries the character; a closer frame loses "a lift inside a store"). Acceptance is the coordinator's/user's at Draft: listed as a question.
- **Q-F1–Q-F3:** the sheets follow the recommendations (keep the 1857 store shot; keep the inset; bracket D02). Film has not read the page verdicts (they are in the artifact `db`); a different answer triggers SHEETS-R1.4 for the affected shots only (Q-F1: B04-SH06; Q-F2: B04-SH02–SH06 inset; Q-F3: B02-SH03).

<a id="shot-map"></a>
## Shot map

| Shot | Beat | G [start, end) | Len f | Lines | Claims / clues | Camera | Look |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | B01 | 0–75 | 75 | L01a | F018 frame, CL03 | CAM-CAR-M | LF01 @0 |
| S01-B01-SH02 | B01 | 75–132 | 57 | L01b | CL01, CL02 | CAM-SHAFT-TRACK | — |
| S01-B01-SH03 | B01 | 132–242 | 110 | V01, L02 | F003, CL03 | CAM-CAR-M | LF01b @220 |
| S01-B01-SH04 | B01 | 242–327 | 85 | V02 | — | CAM-CAR-CROUCH | — |
| S01-B02-SH01 | B02 | 327–466 | 139 | L03 | F001–F003, CL01 | CAM-SHAFT-CLOSE | LF02 @445 |
| S01-B02-SH02 | B02 | 466–540 | 74 | L04 | F002, F003 | CAM-SHAFT-CLOSE | — |
| S01-B02-SH03 | B02 | 540–608 | 68 | L05 | D-01, D02 | CAM-SHAFT-WIDE | — |
| S01-B02-SH04 | B02 | 608–662 | 54 | V03 | — | CAM-CAR-CU | — |
| S01-B03-SH01 | B03 | 662–701 | 39 | L06a | F005 | CAM-CAR-POV | — |
| S01-B03-SH02 | B03 | 701–756 | 55 | L06b | F005 | CAM-CAR-CU | — |
| S01-B03-SH03 | B03 | 756–843 | 87 | L07, V04 | F004 | CAM-CAR-LOW | — |
| S01-B03-SH04 | B03 | 843–893 | 50 | L08 | F004, F005, safety | CAM-SHAFT-TRACK | — |
| S01-B03-SH05 | B03 | 893–905 | 12 | (black) | safety | none | — |
| S01-B04-SH01 | B04 | 905–978 | 73 | L09 | — | CAM-CAR-FREEZE | — |
| S01-B04-SH02 | B04 | 978–1091 | 113 | L10 | F011, F012 | CAM-HALL-W | LF03 @1078 |
| S01-B04-SH03 | B04 | 1091–1134 | 43 | (gasp), L11a | F012 | CAM-HALL-ROPE (R1.4, SD15) | — |
| S01-B04-SH04 | B04 | 1134–1180 | 46 | L11b | F013, CL01 | CAM-HALL-CATCH | LF05 catch @1159 |
| S01-B04-SH05 | B04 | 1180–1210 | 30 | L12a | — | CAM-HALL-M | — |
| S01-B04-SH06 | B04 | 1210–1316 | 106 | L12b | F014–F016 | CAM-STORE | LF04 @1282 |
| S01-B05-SH01 | B05 | 1316–1385 | 69 | L13 | F009, FIX-2, D03 | CAM-CAR-M | — |
| S01-B05-SH02 | B05 | 1385–1485 | 100 | L14a | F006 | CAM-SHAFT-TOP | — |
| S01-B05-SH03 | B05 | 1485–1520 | 35 | L14b | F007, FIX-2, CL01 | CAM-JAWS | LF05 jaws @1505 |
| S01-B05-SH04 | B05 | 1520–1600 | 80 | (clamp), L15 | F004, F007 | CAM-CAR-M settle | — |
| S01-B05-SH05 | B05 | 1600–1728 | 128 | L16 | correction 1, CL03 | CAM-CAR-SIT | — |
| S01-B05-SH06 | B05 | 1728–1788 | 60 | (hold) | — | CAM-CAR-SIT | — |

Beats (G): B01 0–327 · B02 327–662 · B03 662–905 · B04 905–1316 · B05 1316–1788. Longest stretch without the WOMAN: none in B04 (the inset); B02-SH03 2.27 s (a dot in the tower). Rules R01–R09 of [storyboard.md](storyboard.md#rules-for-every-shot) apply to every shot (HUD shots: 2–12, 14 frozen, 20–23).

<a id="shot-sheets"></a>
## Shot sheets

Sizes: `meas` = measured by Boss on a built frame; otherwise computed (see header). Casting lines are the storyboard's [casting table](storyboard.md#casting) unless a block says otherwise.

### S01-B01-SH01 · 0–75 · LF01 the lift, the snap (L01a)

- **Camera:** `cam: target (0.0, 0.95, −0.30), yaw 10→6, r 2.50→2.35, eye 1.60, f 1200, hy 740` (brief VD05; built LF01).
- **Staging (CAR m):** WOMAN `woman-long + office (tie off), P10, neutral`, feet (0.05, 0, −0.30), faces +z, phone in her right hand at the chest. Lead **800.8 px meas** (head top 710, feet 1511); display "20" and bell (≈ (204, 1049)) visible; caption mean 0.289 meas.
  - G0–29: still except the push. G3 S1 chime.
  - **G30** (gap after "ขาด"): snap S2; flicker G30–42 (3 dips) to 85 %; `shock` at G32; phone stays in hand.
  - **G39 "ร่วง":** frame jolt 2 cm (whole picture, camera, G39–42); fall clock starts (FC).
  - G42–74: hair rise 0 → 0.25 (`hairCalm`); heels lift 2 cm.
  - G45–54: HUD slides in from the right edge (20, needle ≈ 2 %, tag "ถ้า…ร่วงจริง").
- **Sound:** L+3 S1; A1 hum to L30; L30 S2 + `electric_light-flicker-buzz_01` to L42; L39 `whoosh_heavy-cinematic_01`; A2 from L42; no music.
- **Entry → exit:** frame 0 = LF01 (no HUD). Exit: standing, `shock`, hair 0.25, heels 2 cm up, HUD on (20), light 85 %.
- **Acceptance:** G0 reads "lift, alone, evening" at 270 px · the snap sound does not cover "ขาด" (Editor ear check) · G39 jolt visible · G54 HUD complete in slot HUD, counter 20.

### S01-B01-SH02 · 75–132 · section, falling together (L01b)

- **Camera:** CAM-SHAFT-TRACK `target (0, y_car + 0.65, 0), yaw 0→1, r 8.5, eye = target y, f 2600, hy 930` (SP2 meas).
- **Staging:** SHAFT section, front wall and car front shell cut. Car **765 px meas** (x 310–769, y 394–1159); WOMAN inside standing/floating **491 px meas**, hair rising (`hairCalm`), phone in hand. Rails x ≈ 280 / 800 full height (CL01); six slack cables whip above the car (CL02); landing variants LV-A/B/C stream upward; streaks 20–25 %. Counter **20 → 19 at G120** (L45).
- **Sound:** A2 rising; L0 S2 rattle tail; L45 tick.
- **Entry → exit:** her pose = SH01 exit (same key). Exit: car at y_car 56.4, she lifts toward float.
- **Acceptance:** car holds on screen ±2 px while recesses stream (SP2) · both rails continuous · car bottom ≤ y 1160.

### S01-B01-SH03 · 132–242 · LF01b float and grab (V01, L02)

- **Camera:** `target (0.0, 1.00, −0.30), yaw 6→3, r 2.35→2.20, eye 1.60, f 1200, hy 740` (built LF01b).
- **Staging:** P46 + `zero-g-drift`, `scared` (closed flat mouth, straight look, LF01b), hair rise 1 `hairCalm`.
  - G132–160: feet rise; feet gap ≈ 85 px meas (lift −0.04 m with the grip pivot).
  - G140: phone leaves her right hand, drifts to (0.62, 1.50, −0.20) by G220, spin 40°/s. G144: pen and tissue drift out of her blazer pocket (LF01b points pen ≈ (825, 924), tissue ≈ (942, 566) at G220), slow spin.
  - **G163 "จากความสูง":** right hand grabs the rail at (−0.66, 0.92, −0.30) (`new: float-grab-rail`; stand-in P46 + rArm IK as LF01b).
  - G168–220: whole-card roll 0 → 7° (head toward the rail), ease-in-out, pivot at the grip; held 7° to G242.
  - Lead **811 px meas** (LF01b); grip error ≤ 2 px; hand jump ≤ 3 px/frame meas.
- **Sound:** L0 V01 (Leda); A2; tick L107 (18); no music.
- **Entry → exit:** hard cut on V01. Exit: floating, gripping, roll 7°, phone/pen/tissue adrift.
- **Acceptance:** G220 matches LF01b · feet gap ≥ 40 px · objects separate from hands · reads weightless at 270 px (viewer check).

### S01-B01-SH04 · 242–327 · plan the jump (V02)

- **Camera:** CAM-CAR-CROUCH `target (−0.26, 0.75, −0.30), yaw 3→8, r 1.90→1.75, eye 1.30, f 1200, hy 760`.
- **Staging:** G242–263 roll 7° → 0; she pulls down by the rail (`new: rail-crouch`, base P35), feet touch the floor G270, crouch set G278: feet (−0.36, 0, −0.30), right hand on the rail, left hand on her knee. G270–282 looks up at the ceiling (`worried`); G282–290 looks down at the floor; **"โดดสวน" G290 `est`**: `angry` (determined), eyes level; G295–305 knee pre-load dip 3 cm; holds set to G327. Phone, pen, tissue drift near the ceiling. Crouched lead ≈ **680 → 734 px** (head top y 899 → 910, feet 1579 → 1644; computed); rail ≈ (290, 997), bell ≈ (247, 990).
- **Sound:** V02 at L0; A2; tick L80 (17).
- **Entry → exit:** same rail grip as SH03. Exit = the crouch key used by B02-SH01 (x −0.36).
- **Acceptance:** face above y 1160 · rail grip continuous from SH03 · the determined face lands with "โดดสวน" (Editor measures the onset; shift the face key to it).

### S01-B02-SH01 · 327–466 · LF02 same speed (L03)

- **Camera:** CAM-SHAFT-CLOSE `target (0, y_car + 0.65, 0), yaw 0→2, r 5.0, eye = target y, f 2600, hy 768` (LF02 meas; SD05).
- **Staging:** crouched inside (SH04 exit key), lead **484.7 px meas**; shell bottom 1159.9 meas; rails x 100.7 / 984.3 meas. Counter 17 → 16 (G385) → 15 (G438); streaks 25 → 45 %.
  - **G375 "ร้อยยี่สิบ":** pill "ราว 120 กม./ชม." at the gauge's top tick; needle 39 %, climbing.
  - **G402 "ลิฟต์เร็ว":** white down-arrow grows on the car shell's right side (x 925–995, y 700–960).
  - **G430 "คุณก็เร็ว":** identical arrow on her right side (x 505–575, y 700–960; both 70 × 260 px meas).
  - G448–458 ("เท่านั้น" `est`): both arrows pulse together.
- **Sound:** A2; L48 `pluck_soft-note-01_01`; L75 `-02_01`; L103 `-05_01`; ticks L58, L111.
- **Entry → exit:** same crouch key. Exit: both arrows on, pill on, needle 50 %.
- **Acceptance:** G445 matches LF02 (HUD 15, needle 48 %) · arrows equal · nothing in the band but the lower shell.

### S01-B02-SH02 · 466–540 · the jump's size (L04)

- **Camera:** CAM-SHAFT-CLOSE `target (0, y_car + 0.65, 0), yaw 0→−2, r 5.0, eye = target y, f 2600, hy 768`. Lead 484.7 px; no push.
- **Staging:** G476 a 40 % ghost (`new: ghost-figure`) springs 0.4 m up from the crouch and holds (head top ≈ y 390 est). **G519 "ราวสิบ":** her arrow shortens 8 %; chip "−10 กม./ชม." beside the ghost (x 610–790, y 400–450). G520–526 needle twitches back 1°, resumes. Counter 15 → 14 (G485). Fallback: no ghost.
- **Sound:** L10 `whoosh_air-swish-rising_01` low; L53 `pluck_soft-note-02_01`; tick L19.
- **Entry → exit:** = SH01 exit. Exit: ghost, chip, both arrows on.
- **Acceptance:** ghost reads as a demonstration, not a second woman (viewer check) · chip clear of HUD.

### S01-B02-SH03 · 540–608 · floors, not metres (L05; D02)

- **Camera:** pull-back from SH02's end frame (CAM-SHAFT-CLOSE, r 5.0, hy 768) to `target (0, 30, 0), r 120, f 2600, hy 960` over G540–569, ease-out; target, r and hy eased together (Boss lerps hy in shot code if `camMove` does not).
- **Staging:** tower section: top y ≈ 245, floor 20 ≈ 375, floor 17 ≈ 570. Bracket on the tower's left from floor 20 to the ground, pill "ชั้น 20". **G593 "สิบเจ็ด" `est`:** the bracket top slides down to floor 17 (≈ 195 px, 6 f) and the pill flicks to "ชั้น 17". The lit car falls at about floor 12 (counter 13 → 12 at G567, 11 at G604).
- **Sound:** L0 whoosh out; L53 `stinger_wahwah-fail_01`; A2 thinner.
- **Entry → exit:** camera starts on SH02's last frame. Exit: bracket at 17.
- **Acceptance:** bracket and pill readable at 270 px · the slide lands with "สิบเจ็ด" (Editor ±3 f).

### S01-B02-SH04 · 608–662 · "ห๊ะ…" (V03)

- **Camera:** CAM-CAR-CU `target (−0.36, 0.80, −0.30), yaw 12, r 1.00→0.95, eye 0.85, f 1300, hy 810`.
- **Staging:** front three-quarter, crouched, hair floating `hairCalm`; head ≈ 533 px (0.41 m), chin ≈ y 1005 (computed). G608 `surprised` on "ห๊ะ"; **G622 `sad`** as the sigh starts `est`; G622–655 shoulders drop 2 cm, head tilts down 5°.
- **Sound:** V03 at L0 (Leda, sigh inside the take); A2 lower.
- **Entry → exit:** crouch key. Exit: `sad`, head down.
- **Acceptance:** face above y 1160 · `sad` key on the sigh (Editor measures).

### S01-B03-SH01 · 662–701 · nothing to see (L06a)

- **Camera:** CAM-CAR-POV `target (0, 1.15, 0.65), yaw 180, r 1.00, eye 1.15, f 800, hy 1000` (SD06; camera at (0, 1.15, −0.35), stylised POV centred on the door seam).
- **Staging:** front wall drawn (closed doors x ±0.45 → screen x 180–900, top y ≈ 240, bottom at the frame edge), back wall culled, no figure. In-world floor indicator above the doors at (0, 2.18, 0.649), screen ≈ (540, 176): **10 → 9 at G670**. No window, no landing marks. HUD on (counter matches).
- **Sound:** L0 `tension_heartbeat-slow_01` starts; tick L8; A2.
- **Entry → exit:** her view from the crouch. Exit on 9.
- **Acceptance:** nothing tells the distance to the ground except the digit · indicator clear of slot HUD (x 800–1040).

### S01-B03-SH02 · 701–756 · counting (L06b)

- **Camera:** CAM-CAR-CU `target (−0.36, 0.80, −0.30), yaw 12→10, r 1.00→0.92, eye 0.85, f 1300, hy 810`.
- **Staging:** eyes down (`worried`, look [0, 0.5]); lips moving silently (`talk` small, 3 Hz) from G704; HUD ticks 8 (G701) → 7 (G730).
- **Sound:** heartbeat; ticks L0, L29.
- **Entry → exit:** crouch key. Exit: same, eyes down.
- **Acceptance:** lips move only from "ต้องกะ" · face above y 1160.

### S01-B03-SH03 · 756–843 · too early: the bonk (L07, V04)

- **Camera:** CAM-CAR-LOW `target (0.0, 1.25, −0.30), yaw 8→4, r 2.30, eye 0.55, f 1150, hy 1190` (SD05).
- **Staging:** crouched start (head ≈ y 925, feet ≈ 1465, computed); rail released at the push-off.
  - **G762 "เร็วไป":** push-off (`new: push-off-float`): she extends and rises 0.66 m, drifting x −0.36 → −0.30.
  - **G800 "เพดาน" `est`:** head top meets the ceiling panel at (−0.30, 2.30, −0.30), screen ≈ (390, 315); panel wobbles 1 cm. Extended lead ≈ 820 px.
  - G800–806 rebound 3 cm; G806–838 whole-card roll 160° with P04 (hand on head), `new: ouch`; hold G838–843. Phone, pen, tissue drift past. No lump, no stars.
- **Sound:** L6 small push whoosh; L44 `comedy_soft-boing_01` + `impact_knuckle-rap_01` low-passed; V04 at L58 (G814); riser from L10; ticks L3 (6), L30 (5), L56 (4), L81 (3).
- **Entry → exit:** crouch key. Exit = the frozen pose (story frame `s` 842) used by B04-SH01 and the rewind.
- **Acceptance:** contact frame shows head touching the panel, ±6 px · bell glow visible (R06) · no injury cue.

### S01-B03-SH04 · 843–893 · too late, cut to black (L08)

- **Camera:** CAM-SHAFT-TRACK (as B01-SH02, hy 930); 2 px shake from G878.
- **Staging:** streaks 55 → 65 %; she tumbles inside, rolled figure ≈ 490 px (SP2 f790 meas); counter 3 → 2 (G862) → 1 (G886). Car bottom ≥ 3.5 m above the pit at G892; the pit never in frame. Car glow flickers once at G888. **Hard cut at G893.**
- **Sound:** riser peaks and ends dead at G893; ticks L19, L43; A2 loudest; no impact.
- **Entry → exit:** her pose continues SH03's roll. Exit: last frame G892.
- **Acceptance:** no pit floor in any frame · audio silent from G893.

### S01-B03-SH05 · 893–905 · black

- **Staging:** total black, no picture element, no HUD. **Sound:** total silence. **Acceptance:** 12 black frames, no audio sample above the noise floor.

### S01-B04-SH01 · 905–978 · freeze, then inset (L09)

- **Camera:** CAM-CAR-FREEZE `target (0.0, 1.30, −0.30), yaw 12→−8, r 2.40→2.20, eye 1.40, f 1200, hy 760` (SP3 `frozenCam`).
- **Staging:** G905–913 fade up from black on story frame `s` 842 (upside-down, hand on head, hair fanned `hairCalm`, phone/pen/tissue mid-air); frozen grade (desat 50 %, cool) throughout; event and ambient clocks stopped; only the camera arcs. Figure ≈ 630 → 720 px (computed span y 346 → 287 to 979 → 1010). HUD frozen at `hudAt(892)` (1, top tick, tag). **G966–978:** the frame scales into slot INSET (760–1040, 640–1138), HUD fades with it, sepia paper fades in beneath. Inset still = G977 canvas (SD14).
- **Sound:** L0 `reveal_glass-shimmer-soft_01`; silence; NG-A3 fades in from L60.
- **Entry → exit:** from black. Exit: INSET placed exactly (SP3 0 px).
- **Acceptance:** no motion except the camera (seek two frames: identical figure) · inset rect ±4 px.

### S01-B04-SH02 · 978–1091 · LF03 the 1854 order (L10)

- **Camera:** CAM-HALL-W `target (0.0, 3.00, 0.0), yaw −4→2, r 5.40→5.10, eye 1.60, f 1600, hy 1375→1399` (SD05; LF03 built at yaw 1.9, r 5.10, hy 1399).
- **Staging (HALL m; SD07):** showman `man-parted + new: 1850s showman, P01, neutral` on the platform, feet (0, 2.40, 0.30), **607.5 px meas** (hat included). Assistant `man-buzz` + apron + `cap`, left view, feet (−0.75, 1.2, 0.55), **630 px meas**, facing the rope on the left upright. Crowd ×4 backs in the foreground (`new: 1850s crowd dress`). Caption "นิวยอร์ก 1854" in CAP from **G981**. **G1058 "สั่งให้ตัดเชือก":** showman points down-left at the assistant (P05, arm re-aimed). **G1063–1083:** assistant raises the axe in front of him on the rope side, blade toward the rope; rope cut point **(181, 1061) meas** (outside INSET). INSET bottom-right throughout. Textless banners, no building name.
- **Sound:** NG-A3 hall bed; no music.
- **Entry → exit:** INSET carried from SH01. Exit: axe high, rope intact.
- **Acceptance:** G1078 matches LF03 round 3 · rope and axe clear of INSET and the showman · caption clear of faces.

### S01-B04-SH03 · 1091–1134 · the drop (gasp, L11a) · R1.4 reframe (SD15)

- **Camera:** CAM-HALL-ROPE `target (−0.15, 3.00, 0.35), yaw 31→32, r 5.00→4.75, eye 1.82, f 2050, hy 1240` (hy constant, linear over L0–43; camera at (2.43, 1.82, 4.64) → (2.37, 1.82, 4.38) computed). Keeps the 3 px frame jolt (`hallJolt`, cx +3, −2, +1 at G1101–1103). Cut from SH02 (yaw 2, f 1600): 29° azimuth change plus ≈ 1.3× scale, no jump cut. Projection of every point below: kit `camPoint` on this line, u = 0 → u = 1, **computed** (Boss replaces with meas).
- **Frame plan (computed):**
  - **Rope cut point K** (−1.05, 2.60, 0.40) (unchanged world point, `ropeCutAt(−0.7, −1)`): (239, 945) → (228, 932). Above K the rope runs to its node (−1.08, 3.40, 0.12) at (295, 669) → (289, 644), then up the left upright's outer edge (x ≈ 293–299) out of the top. The K → node segment and the flick stand against the open hall seen through the platform's left side (between the deck's front-left post x ≈ 134–155 and the upright's outer edge x ≈ 288–294), not against the upright.
  - **Left upright:** outer front edge x ≈ 288–294, inner face x ≈ 347–352; notch rows y 2.30 / 2.50 at (352, 1064) / (352, 991) (pitch 0.10 m ≈ 37 px): the fixed ruler for the drop.
  - **Deck front-left corner** (−0.90, 2.40, 0.90): (154, 998) → (134, 986); after the 0.15 m drop (154, 1061) / (134, 1052).
  - **SHOWMAN** feet (0, 2.40, 0.30): (604, 1001) → (607, 988); head top (y 4.10) 299 → 248; hat top 175 → 118. **Lead 702 → 740 px** (feet to head top; ≥ 480). Hip elbow (screen-right) ≈ (739–748, 533–571) and coat right edge ≈ x 696–704: clear of INSET (x ≥ 760, y ≥ 640). View: front (camera 31° off his facing +z).
  - **Assistant** SH03 mark feet **(−0.50, 1.20, 0.45)** (cheat 0.25 m +x, 0.10 m −z from SD07; still on the trestle top x −0.45…−1.05, z 0.30…0.80): feet (399, 1489) → (392, 1502), head top (y 2.95) 785 → 762; near (screen-left) shoulder edge x ≈ 319–327 at y ≈ 918–933, **≈ 85 px clear of the rope at K**. View: left (profile facing screen-left; camera ≈ 125° off his facing −x, nearest of the four views), squared to the lens. Height 1.75 m kit; face above y 1160.
  - **Crowd** (SH03 marks, extras cheat): crowd2 `woman-curly` 1.65 m at **(0.55, 0, 2.60)**: head top (117, 1270) → (43, 1273), back view; crowd4 `man-spiky` 1.78 m at **(1.55, 0, 2.20)**: head top (947, 1175) → (955, 1168), below the INSET bottom (1138). crowd1 and crowd3 project at x < −600 (painted, unseen). Backs only in the caption band; the subtitle text (centre, x ≈ 300–780) stays clear of both.
- **Staging (G, timing unchanged):** caption CAP off; INSET unchanged.
  - **G1091 contact (L0):** blade edge centre ON the rope at K, **edge facing −x** (toward the rope, screen-left; fixlist R4 item 1); haft from the blade up and right to both hands at ≈ (−0.66, 2.80, 0.45) `est` (hands 0.45 m back from the blade, butt 0.25 m past the hands), haft ≈ 27° below horizontal; blade sunk to half the rope's diameter; rope still one piece (`ropeParted` 0) with a 0.03 m kink at K; 6 fibre flecks (`#efd9a0`, 3–5 px) burst from K up-left 0.10–0.25 m, gone by G1096. This frame is the cut-on-action from SH02's raised axe.
  - **G1092–1094 follow-through:** blade continues 0.15 m through the rope line, (−1.05, 2.60) → (−1.18, 2.52) in x, y at z 0.40, ease-out.
  - **G1092–1099 snap:** the upper end (frayed tuft, 5–7 splayed strands 0.04–0.06 m) whips up from K to (−1.05, 3.50, 0.40): (239, 945) → ≈ (238, 600), sway ±0.08 m toward screen-left only (x stays 175–285, never over the upright's outer edge). The lower end (frayed tuft) drops 0.45 m to (−0.99, 2.15, 0.40) ≈ (252, 1112), then swings slack down toward the winch (out of frame through the trestle).
  - **G1093–1101 drop:** the platform group drops 0.15 m (deck corner y 998 → 1061, showman feet 1001 → 1062, ≈ 62 px; 1.5 notches of the left upright pass the deck's left edge) and stops dead at G1101 with the jolt. Showman upright, calm, `neutral`; pointing arm back to his side G1100–1110 (unchanged).
  - **From G1092 crowd recoil:** crowd2 hop 3 cm, lean back, both hands up (peak G1106, settled G1116), hands to y ≈ 1049–1066 at x ≈ 40–120 (clear of the deck corner and the rope's lower end); crowd4 hop 3 cm, lean back 8°, hands to the collarbone only (nothing above y 1150, clear of INSET).
  - **G1095–1110 assistant:** lowers the axe to hang at his right side (SH05 state), head turns toward the platform.
  - *Optional (Boss may skip):* the centre hoist rope (0, 2.95 → 8.0, 0) loses tension from G1093, bows 0.08 m and sways ≤ 2 cycles behind the showman's head (feeds SH04's slack end).
- **Rope prop PR-ROPE-HERO (this shot):** world-width ribbon **Ø 0.05 m** (`est`, a 2-inch hemp hoist rope drawn slightly heavy for the read): ≈ 20 px at K (camUnit ≈ 395–410), ≈ 18 px at the frame top. Hemp core `#7a5a36`, highlight stripe `#d9c08a` 30 % of the width on the upper-left (lit) side, diagonal twist strokes every 0.06 m in `SEP.ink` at 40 %, outline `SEP.ink` 2.5 px; cut faces show the light inner fibres `#efd9a0`. Dark rope against the pale hall behind, light tufts at the cut. Same path as SH02 (no geometry change).
- **Sound:** L0 S3 axe; L1 S5 crowd gasp (the gasp slot); L2 S4 drop-and-stop (stop clack on L10 = G1101, the jolt); hall bed. Unchanged from R1.3.
- **Entry → exit:** axe high (SH02 exit) → contact on the first frame. Exit: platform 0.15 m lower, held by the catch; two cut ends; axe at the assistant's side.
- **Acceptance (R-C must read without narration):** G1091 the blade meets the rope at K with rope visible above and below the blade, rope ≥ 60 px clear of the assistant's silhouette · G1095 two separate rope ends with tufts, the upper one rising · G1101 vs G1091 deck corner and showman feet ≥ 55 px lower, a notch passed · G1106 crowd2 hands up visible · measured rope width at K ≥ 16 px · rope cut, flick, drop and faces above y 1160 · INSET, CAP and the channel-mark box clear (rope ≥ 20 px from the mark) · showman lead ≥ 480 px.

### S01-B04-SH04 · 1134–1180 · LF05 the 1854 catch (L11b; SD10)

- **Camera:** CAM-HALL-CATCH `target (0.72, 2.65, 0.10), yaw −15, r 1.30 → 1.18 (push G1156–1179, ease-out), eye 2.80, f 2000, hy 529 → 506` (SD05; LF05 built at r ≈ 1.28, hy 526).
- **Staging:** sepia; amber outline on the pawl and notch only; "ภาพประกอบ" in LBL G1134–1180.
  - G1134–1138: cut rope's slack end settles over the platform frame top (0.37, 3.05, 0.14) → (0.55, 2.92, 0.14), frayed end ≈ (283, 325) meas.
  - G1139–1147: bow spring leaf (0.50, 2.88) → (0.77, 2.72) flattens 0.03 m.
  - G1149–1155: pawl swings out; **bites the notch at G1155 on "จับ"**; pawl tip **(925, 1097) meas**; notch pitch 150.8 px meas.
  - Order: rope slack → spring → pawl (B-P1-FIX-c); never engaged before the cut.
- **Sound:** L21 S6 catch clack (on "จับ"); M1 enters L21 (fallback `bed_warm-pad-felt-third_01`).
- **Entry → exit:** the platform held (SH03 exit). Exit: pawl in the notch.
- **Acceptance:** G1159 matches LF05 catch · bite within ±2 f of the measured "จับ" · reads unlike the modern jaws (R04).
- **Editor check:** confirm "จับ" (L11) on the waveform; if it is not G1155 ± 2, shift the whole slack → spring → pawl sequence so the bite lands on it (shot range unchanged).

### S01-B04-SH05 · 1180–1210 · hat and "คุณกลัว" (L12a)

- **Camera:** CAM-HALL-M `target (0.0, 3.20, 0.0), yaw 2→0, r 4.00→3.85, eye 1.90, f 1500, hy 1188→1206`.
- **Staging:** platform at its dropped height (feet ≈ y 1046 → 1058). G1180–1200 showman raises his top hat (`new: hat-raise`, right hand, `smug`); crowd relaxes. **G1192–1207 ("คุณกลัว" `est`):** INSET pulses 1.0 → 1.08 → 1.0. Showman ≈ 760 px.
- **Sound:** M1; hall bed −6 dB.
- **Entry → exit:** hat on. Exit: hat raised.
- **Acceptance:** pulse lands on "คุณกลัว" (Editor ±3 f).

### S01-B04-SH06 · 1210–1316 · LF04 1857 (L12b)

- **Camera:** CAM-STORE `target (0, 4.0, 0) → (0, 6.5, 0), yaw 0, r 5.0, eye 1.60, f 1300, hy 1584 → 2234`, ease [0, 0.9] (horizon follows the target linearly; LF04 at target y 5.95, hy 2091).
- **Staging:** cast-iron store front, centre bay cut open x −2…+2 from y 4.2; open cage car (1.6 × 2.2 m, no rope, no catch) with two passengers rises y_car 4.6 → 6.2; passengers **468.6 / 428.8 px meas** (lead-size exception, VD24, pending acceptance). Caption "1857" in CAP from **G1214**, "1857" only. Gas lamp and pedestrians below the frame after the tilt. INSET on.
- **Sound:** M1 resolves by L95; street hush; one far hoof at L40.
- **Entry → exit:** cut from the hall. Exit: cage high, INSET on.
- **Acceptance:** G1282 matches LF04 · nothing readable except "1857".

### S01-B05-SH01 · 1316–1385 · rewind and "แทบ" (L13; VD18, D03)

- **Camera:** G1316–1325 the inset grows on the frozen camera `frozenCam(72/73)`; G1325–1340 mixes to frame-0 camera `F0_CAM` (`target (0.0, 0.95, −0.30), yaw 10, r 2.50, eye 1.60, f 1200, hy 740`), snapping exactly at G1340 (SP3); G1340–1384 `yaw 10→8, r 2.50→2.44` (SD12).
- **Staging:**
  - G1316–1325: INSET grows to full frame (SD14).
  - G1325–1328: HUD fades in over 3 f.
  - **G1325–1340 rewind:** pose story frame `s` 842 → 0 and HUD story frame 892 → 54 on one ease; keyed `poseMix` across the switches at `s` 762 (float ↔ crouch), 270 (crouch ↔ float), 132 (float ↔ stand) (N10); phone back to her right hand, pen and tissue back into the pocket, hair falls, colour returns; the pill disappears as HUD `s` passes 375; rewind streaks 15 %.
  - At G1340: picture = frame 0 + HUD `hudAt(54)`.
  - **G1341 "แทบ":** kit `Stamp` "แทบ" in STAMP (905, 720); holds to G1378, fades over 6 f. G1342 blink, `surprised` → `neutral` by G1350.
- **Sound:** L9 S9 rewind (fallback reversed `whoosh_air-swish-rising_01`); L25 `foley_rubber-stamp-thunk_01`; A1 hum from L24.
- **Entry → exit:** INSET still. Exit: standing at frame 0's pose, HUD 20/≈2 %/tag, stamp gone.
- **Acceptance:** G1340 differs from G0 only by the HUD (SP3 method) · same frame on seek mid-rewind (G1332) · stamp on the word.

### S01-B05-SH02 · 1385–1485 · cables (L14a)

- **Camera:** CAM-SHAFT-TOP `target (0, 61.2, 0), yaw 0→2, r 12, eye 61.2, f 2600, hy 700`.
- **Staging:** car roof ≈ y 1067, sheave ≈ 182, rails visible; the car does not move. Six cables light in turn G1393, 1398, 1403, 1409, 1414, 1419 (each 5–6 f); **G1425 "เส้นเดียวก็รับไหว":** one stays lit, five fade to 25 % over 6 f; G1460–1464 all six back to full (the "…" pause, `est`); **G1467 "ขาดหมด":** all six part above the crosshead with a slack whip upward. HUD 20, tag on.
- **Sound:** `stinger_felt-note-single_01` ×6 pitch-stepped at L8, 13, 18, 24, 29, 34; L40 single held tone; L82 S2 snap (lower level); A2 under.
- **Entry → exit:** car static. Exit: cables parted, car still.
- **Acceptance:** no numbers or count on screen (F006) · part frame on "ขาดหมด".

### S01-B05-SH03 · 1485–1520 · LF05 modern jaws (L14b; FIX-2, D04)

- **Camera:** CAM-JAWS `target (0.85, y_car + 0.95, 0.15), yaw −20, r 0.75, eye = target y, f 2600, hy 800` (LF05 meas).
- **Staging:** G1485–1500 the car drops 0.40 m (ease-in); the camera rides the car, so the rail slides up ≈ 1390 px. **G1500 "จับ":** two wedge jaws in a steel block bite the smooth T-rail (bite centre (484, 784) meas; block rows 506–1061 meas); one-frame amber bloom. G1500–1506 car slows over ≈ 0.28 m (ease-out, no dead stop); G1506–1510 settles 1 cm up and back; G1510–1520 hold. HUD: 20, needle rises to ≈ 8–9 % at G1500 and returns to ≈ 2 % by G1510; tag on. "ภาพประกอบ" in LBL G1485–1520. No governor.
- **Sound:** L15 S7 clamp hit (fallback `impact_door-slam-body_01`); scrape tail L15–21; ring-out into SH04; A2 cut at L15.
- **Entry → exit:** cables parted. Exit: car held, jaws closed.
- **Acceptance:** G1505 matches LF05 jaws · bite on "จับ" ±2 f · no shape/colour shared with the 1854 catch.

### S01-B05-SH04 · 1520–1600 · settle (clamp ring-out, L15)

- **Camera:** `target (−0.10, 0.85, −0.35), yaw 6→12, r 2.30→2.00, eye 1.40, f 1200, hy 760`.
- **Staging:** entry: standing, hair lifted 30 % (`hairCalm`), knees dipped 0.15 m, phone in her right hand. G1520–1535 hair settles; she exhales. **G1544–1574:** slides down the back wall to sit (`new: slide-sit-wall`, hips (−0.30, 0, −0.50)). G1564 phone to her left hand on her knee; `tired`. G1586–1598 HUD and tag fade out. Light 100 %. Standing lead ≈ 810 → 930 px, seated ≈ 450–500 px (head y ≈ 993–1023, computed); bell visible.
- **Sound:** clamp ring-out (the clamp slot) L0–18; NG-A1 fan only; breath; no music.
- **Entry → exit:** after the catch. Exit: seated, phone left hand, HUD off.
- **Acceptance:** feet planted before the slide · HUD gone by G1598.

### S01-B05-SH05 · 1600–1728 · the button (L16; SD11)

- **Camera:** CAM-CAR-SIT `target (−0.30, 0.62, −0.40), yaw 15→20, r 1.60→1.50, eye 1.05, f 1300, hy 760`.
- **Staging:** seated lead ≈ **705 → 750 px** (head y ≈ 860–866, hips 1565–1616, computed); bell at ≈ (163 → 141, 846 → 850), glow 30 %; phone on her left knee. **G1676** (pause after "ไม่ต้องกระโดดเลย"): right-hand reach starts (`new: reach-press`). **G1688 "ปุ่ม" `est`:** press contact on the button centre (−0.697, 0.95, −0.20) ±6 px; glow 30 → 70 % over G1688–1692. **G1712 "แล้วรอ":** hand back to her lap by G1724; `neutral` → soft `tired`.
- **Sound:** fan hum; L89 S8 soft bell (fallback `ui_notification-ding_01` an octave down), not a siren.
- **Entry → exit:** seated (SH04 exit). Exit: hands in lap, glow 70 %.
- **Acceptance:** contact ±6 px on the button at G1688 · press within ±3 f of the measured "ปุ่ม" (Editor) · she never looked at the button before this shot (R06).

### S01-B05-SH06 · 1728–1788 · hold

- **Camera:** CAM-CAR-SIT continued `yaw 20→22, r 1.50→1.46`.
- **Staging:** G1728–1745 she leans her head back on the wall; eyes half-closed; G1750 small smile (`new: relieved`); long exhale; phone in lap. Only breath moves (ambient clock).
- **Sound:** exhale take at L4 (1.57 s); `stinger_pizz-tag-ending_01` from L0, ≈ 1.8 s, 0.5 s fade, done ≤ L60; fan hum under.
- **Entry → exit:** = SH05 exit. Exit: last frame G1787, tag faded.
- **Acceptance:** nothing moves except breath · tag ends inside the video.

<a id="prop-states"></a>
## Prop states (pre-handoff check)

| Prop | Entry → exit by shot |
| --- | --- |
| Phone | right hand (B01-SH01/SH02) → leaves the hand G140 → adrift B01-SH03…B03-SH04 → frozen B04-SH01/inset → rewind returns it to the right hand by G1340 → right hand at B05-SH04 entry → left hand on knee G1564 → left knee B05-SH05 → lap B05-SH06 |
| Pen, tissue (new, LF01b) | blazer pocket → adrift from G144 → frozen → back in the pocket by G1340 |
| Rail | right-hand grip G163 → B01-SH04 → B02 (inside the section car) → released at the push-off G762 |
| Axe | assistant, both hands, raised G1063–1083 → blade on the rope G1091, follow-through G1092–1094 → lowered to his right side G1095–1110 → rests (SD15) |
| Top hat | on the head → raised G1180–1200 (right hand) |

Each action is possible with its state: the press (right hand) comes after the phone moved to the left hand; the rail grip uses the right hand after the phone left it.

<a id="handoff"></a>
## Boss and Editor handoff (W5.2 / W5.3)

- **Boss (W5.2):** build plates from this revision; assets N1–N18 per the brief (unchanged list) plus: the door-transom floor indicator in SET-CAR (front wall, POV only; SD06); pen and tissue props (from LF01b `paintPen`/`paintTissue`); FC as one shared pure function for HUD, car height and the section scroll; SP3 rewind re-keyed to the new story frames (`s` 842 pose end, HUD 892 → 54, switches 762 / 270 / 132, inset still G977); `hairCalm` on every float state; delete `public/edu11-spike/inset-f877.png` before any commit (spike note).
- **Editor (W5.3):** place the voice per [Timeline and voice placement](#narration-placement) (PL02–PL05); measure and confirm the `est` anchors: "คุณ" (L01), "โดดสวน" (V02), "เท่านั้น" (L03), "สิบเจ็ด" (L05), sigh start (V03), "เพดาน" (L07), "คุณกลัว" (L12), "ปุ่ม" (L16); **check the pawl bite G1155 and the jaws bite G1500 against "จับ"** (L11, L14) by waveform and ear; captions per the caption plan; sound per the sound plan and shot blocks; the L16 loudness fix is already in the re-read take (check by ear only).
- **Blockout order:** B01 interior + section (SET-CAR, SET-SHAFT, FC, HUD) first; it carries most shots and both look frames LF01/LF02.

<a id="dependencies"></a>
## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | N1–N18 (brief), SD06 indicator, pen/tissue, FC function, SP3 re-key | missing (spike/LF code uncommitted in `src/painted/edu11/`) |
| Boss | kit intake proposals: `hairRise` + `hairCalm` (`head.ts`), `HatKind` top/bonnet (`gear.ts`, `cast.ts`) | proposed, needs README line + test |
| Editor | `est` anchor confirmation; "จับ" checks; NEEDS-GEN M1, A1–A3, S1–S9 | open |
| Coordinator / user | read Q-F1–Q-F3 verdicts on the page; accept the B04-SH06 lead-size exception (VD24) at Draft | open (non-blocking; recommendations applied) |
| Film | viewer check of the first Draft shots against LF01–LF05; compare frames to these sheets | at W5.3 |

Element captures: look frames `out/edu11/lf/LF01.png`, `LF01b.png`, `LF02.png`, `LF03.png`, `LF04.png`, `sheet-lf05.png` (store `projects/EDU/look-frames/EDU-EP11-SHORT/`), built from uncommitted `src/painted/edu11/lf.tsx` (fix round 3). Proposed first Editor sample: S01-B01-SH01 → SH03 (G0–242: snap split, float, grab) against the voice.

<a id="change-log"></a>
## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP11-SHEETS-R1.3 | 2026-11-09 | Film | First timed scene sheets (W5.1) from voice-lock R2 (anchors) + R2.1 (Leda slot lengths V01 0.895, V02 2.784, V03 1.766, V04 0.917 s; hold exhale 1.57 s). 25 shots, **1788 f = 59.60 s** (ROWS-R1.2 estimate 1695 f = 56.50 s). Superseded R1.2 values: snap f40 → G30 + drop G39 (SD01); fall clock f40–795 → G39–893 with a hold-20 counter rule (SD02); body roll 14° → 7°, hair spikes → `hairCalm` (SD03); crouch x −0.20 → −0.36 (SD04); hy target rows → horizon rows, CAM-SHAFT-CLOSE 770 → 768, CAM-CAR-LOW 810 → 1190 (SD05); POV panel → door indicator, f 1100 → 800, hy 900 → 1000 (SD06); 1854 staging mirrored (SD07); pawl bite f1046 → G1155 on "จับ", jaws f1400 → G1500 (SD10); press f1580 → G1688 (SD11); B05-SH01 post-rewind yaw 6→10 → 10→8 (SD12); riser start f668 → G766 (SD13); inset still f877 → G977 (SD14). Every shot range retimed (shot map). Rows → ROWS-R1.3; brief → BRIEF-R1.3 (decision amendments recorded). Review page: pending. |
| EDU-EP11-SHEETS-R1.4 | 2026-11-09 | Film | User asked for a reframe of **S01-B04-SH03** after viewer check draft r4 still failed it on R-C (rope, cut and snap not visible) with the two Boss fix passes used. SD15: new camera CAM-HALL-ROPE (target (−0.15, 3.00, 0.35), yaw 31→32, r 5.00→4.75, eye 1.82, f 2050, hy 1240; superseded CAM-HALL-M target (0.0, 3.20, 0.0), yaw 4→2, r 4.20→4.00, eye 1.90, f 1500, hy 1164→1188), hero rope prop PR-ROPE-HERO Ø 0.05 m, SH03-only cheats for the assistant (−0.50, 1.20, 0.45) and crowd2/crowd4, contact frame and follow-through, frayed ends; shot map camera column and the Axe prop row updated. Shot range 1091–1134, every event frame, sound cues, Thai and stable IDs unchanged; no other shot changed. Rows EDU-EP11-ROWS-R1.4, brief change-log line BRIEF-R1.4 |
