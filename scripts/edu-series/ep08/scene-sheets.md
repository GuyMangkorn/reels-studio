# Timed scene sheets and index — EDU-EP08-SHORT (EDU-EP08-SHEETS-R2.4)

- **Deliverable:** `EDU-EP08-SHORT` · **Revision:** EDU-EP08-SHEETS-R2.4 (Film, 2026-11-08: script R1.3 L11 "ปล่อยลมหายใจออกมา…" re-timed to the [R1.3 voice re-lock](#r24-re-time), **1745 f**; S01-B04-SH03 58 → 72 f (stream and hold stretched, no new look), S01-B05-SH01–SH05 time shift +14 only; everything before G1340 unchanged) · R2.3 (Film, 2026-11-08: script R1.2 ending re-timed to the [R1.2 voice re-lock](#r23-re-time), 1731 f; B05-SH03 and SH04 re-staged for the new lines (SD16, SD17), SH02/SH05 time shift only, eye-open rule at cuts (SD18); everything before G1439 unchanged; see the [change log](#change-log)) · R2.2 (Film, 2026-11-08: user Draft verdicts on S01-B05-SH01 face, SH03 stray arm lines, SH05 redesign; fix round [fixlist.md](fixlist.md); see the [change log](#change-log)) · R2.1 (S01-B01-SH02 helmet path raised 0.11 m on the real rig, user decision; S01-B02-SH03 cx −240 confirmed; R2 = W5.1 re-time; R1 = 1.0 pace, 1684 f) · **Pace:** narration atempo **0.95** per Kore line and per vocal take (V01/V02), line-to-line gaps kept at the R1 length, L13 0.9 s `qsin` fade-out (user decision 2026-11-08; preview recipe `pace-095-preview.py`); see [R2 re-time](#r2-re-time) · **Status:** `ready-for-dev`, voice-timed: Boss may build plates from this revision, Editor may assemble the narration and the blockout (W5.3). · **Timing:** `checked-with-audio` (shot cuts, line onsets and voiced ends from the W4 voice lock re-measured at atempo 0.95 by `voice-lock.py --tempo 0.95`; anchors inside a line `meas` where an energy gap locates them (±2 f), `meas-w` where only Whisper does (±5 f), `est` where neither does).
- **Evidence:** runtime: the W5.3 draft (`src/videos/edu-ep08/`, 1684 f) is on the **R1** timing and does not match this revision · audio: locked read placed on paper by `voice-lock.py --tempo 0.95` (edges re-measured with silencedetect on the read run through atempo 0.95), not assembled at 0.95, not listened to by Film · render/samples: none · projection: the built kit code itself (`paintEva`, `paintEarth`, `camOf`, `camPoint`, `camUnit`) run with a no-op brush through `npx tsx` (Film session scratch script, not committed; log `out/logs/ep08-w51-measure*.err` empty) at the start (`u0`) and end (`u1`) of every world shot (R1 frame counts); camera lines are linear in `u = L / frames`, so a lengthened shot shows the same `u0`/`u1` frames and the `meas` values stand; numbers marked `meas` below come from that run, i.e. the anchors of the approved look-frame rig, not a painted frame · audio/subtitle sync: none · user approval: storyboard ROWS-R1.3 (21/21 passed), look frames LF00–LF07 (look lock), voice picks V01/V02; this timed revision is not yet user-reviewed.
- **Inputs (by revision):** script **EDU-EP08-SCRIPT-R1.3** ([script.md](script.md); R1.3 = L11 "ปล่อยลมหายใจออกมา…" (ER05); L12/L13 per [script-audit-er.md](script-audit-er.md) "Scene and shot impact", Boat-approved wording; R2.2 and earlier used R1.1); R1.3 voice re-lock ([voice-measure.md](voice-measure.md) "R1.3 voice re-lock") with measure.json / timeline.json (1745 f); fact-check [fact-check.md](fact-check.md) (W1.3 + R1.1 recheck pass); brief **EDU-EP08-BRIEF-R1.3** ([film-brief.md](film-brief.md): VD01–VD25, set plans, spikes 1–8, B1–B6, N1–N10, sound direction); storyboard **EDU-EP08-ROWS-R1.3** ([storyboard.md](storyboard.md), rules R01–R09); voice lock [voice-measure.md](voice-measure.md) "W4 voice lock" + "User picks", [measure.json](measure.json) and [timeline.json](timeline.json) as rewritten at tempo 0.95 (`python3 -I scripts/edu-series/ep08/voice-lock.py --tempo 0.95`; without `--tempo` the script still writes the R1 1.0 files byte-identically); built assets (Boss W5.2, uncommitted in this worktree): `src/painted/kit/eva.ts`, `motions.ts` (`zero-g-drift`, `pat-check`, `rail-tow`), `poses-more.ts` (P46), `earth.ts`, `glitter.ts`, `timer-ring.ts`, `stamp.ts`; `src/painted/edu08/` (`scenes.ts`, `orbit.ts`, `rooms.ts`, `ring-close.ts`, `cards.ts`, `ice.ts`, `fx.ts`, `suit.ts`).
- **Target:** worktree `agent-voice-gen-limits-364db3`, branch `claude/education-ep8-continue-39be3d` at `9d42f8c` + uncommitted W4/W5.2 files · 30 fps · `durationFrames` **1745** (58.17 s; R2.3 1731, R2.2 1762, R1 1684) · 1080×1920 · composition offset 0 (Editor registers it under `src/videos/edu-ep08/`, never in `src/Root.tsx`) · `video.ending: 'A_fade'`, `endHoldSec: 0`, `endFadeSec: 0.8`.
- **Baseline (link, not copied):** SET-ORBIT, SET-AIRLOCK, SET-CHAMBER66 metres and RING-CLOSE set-cm per the [brief](film-brief.md#projection-contract-and-scale-baseline). **Built anchors win over the brief's est values (SD01):** orbit AST foot point `AST_AT` (0.00, 0.42, 0.55) (`scenes.ts`; hips ≈ foot + 0.65, head top ≈ foot + 1.44); every orbit target and camera eye that the brief wrote relative to AST is moved by `OFF` (0, +0.26, +0.30) as in the built look frames (`off()` in `scenes.ts`); the camera lines below are the **built** values (brief + OFF), except S01-B01-SH01, which keeps the approved LF01 camera as built. Airlock foot points (built LF05): AST (−0.15, −0.62, z), CREW (+0.40, −0.79, z) (feet = hips − 0.62 / − 0.84). Chamber TECH feet (0.00, 0.00, z). Sun direction `SUN` (−0.60, 0.55, 0.58) normalised (`orbit.ts`).
- **Camera lines:** `cam: T (x, y, z), yaw a→b, r a→b, eye a→b, pitch a→b, f, hy[, cx]` = kit `camOf(camMove(T, [a, b], [r0, r1], eye, {pitch, f, hy, cx}), u)` with `u = L / frames` (linear over the shot) unless the block names an `ease`; `cam: pos (x, y, z) → (…), target (…), pitch, f, hy, cx` = a YCam at that position with `yaw = −atan2(pos.x − T.x, pos.z − T.z)`. Yaw 0 = camera on +z of the target, positive toward +x; pitch positive up.
- **Clocks:** `G` composition frame; shot-local `L` = G − shot start; ranges half-open `[start, end)`. Event clocks are pure functions of G or L (seek-safe). Ambient clock (zero-g bob, hair, star and glitter twinkle) = `G / 30` s, continuous across cuts. Story clock (timer ring) per [Story clock](#story-clock-ring-helmet-and-drift).
- **One shot = one timeline scene** (scene ID = shot ID); every join is a hard cut except the in-canvas sepia grade at the start of S01-B03-SH03 (R09).

<a id="placement"></a>
## Placement (from the voice lock; Film moves no line)

Shot cuts are [timeline.json](timeline.json) as re-locked at tempo 0.95 (R2): a cut 4 f after a shot's last word, the next word 5 f later (gaps unchanged from R1); silent beats 30 f before L06 and L10, 24 f before L11; **V01 slot 46 f** (R1 44: the stretched take is voiced to 1.297 s, so the silence frame moves to L40 and keeps 6 f of silence), **V02 slot 41 f** (R1 39: voiced end L28, 13 f tail kept), closing 66 f. Each line file is placed whole (`...-kore-A-cut2.wav` run through **`atempo=0.95`** at mix time, onset in the stretched file 0.053 s); timeline start of a file (s) = onset G / 30 − 0.053. V01/V02 also get `atempo=0.95` and are placed from their file start. **L13** gets `afade=t=out:st=<file dur / 0.95 − 0.9>:d=0.9:curve=qsin` after the atempo (fade G1667–1692; with the fade its −35 dB voiced end is G1691, unfaded G1692). Store root `~/ReelsStore/projects/EDU/narration/ep08/lines/2026-11-08_ep08-nar-<L>-kore-A-cut2.wav`; vocal takes `~/ReelsStore/projects/EDU/audio/EDU-EP08-SHORT/vocal-samples/`.

| Line | Onset G | Last voiced G | File start (s) | Inner anchors (G, kind) |
| --- | --- | --- | --- | --- |
| L01 | 4 | 51 | 0.080 | — |
| V01 `2026-11-08_ep08-V01-aoede-B.wav` | file at 55 | voiced 59–94 | 1.833 | gasp then "เฮ้ย!", split inside `unknown` (est gasp 59–75, word 78–94); **exact zero G95–100** |
| L02 | 106 | 229 | 3.480 | "ไม่ระเบิด" 122 meas-w · "แต่อาจมีสติ" 159 meas · "สิบถึงสิบห้า" 197 meas-w |
| L03 | 238 | 289 | 7.880 | "นี่แค่สมมติ" 275 meas · "สมมติ" 279 meas-w |
| L04 | 298 | 367 | 9.880 | "แต่ผิวหนังยังรั้งไว้ได้" 328 meas |
| L05 | 376 | 499 | 12.480 | "เหมือนกระติกน้ำร้อน" 421 meas |
| L06 | 533 | 724 | 17.714 | "เริ่มเดือดจริง ๆ นะ" 576 meas · "ไม่มีอากาศกด" 617 meas · "แค่ด้วยความอุ่นในตัว" 692 meas |
| L07 | 736 | 903 | 24.480 | "ปี 1966" 756 meas-w · "คนทดสอบชุดของนาซ่า" 800 meas · "เจอชุดเสียแรงดัน" 847 meas |
| L08 | 912 | 1043 | 30.347 | "สิ่งสุดท้ายที่จำได้" 937 meas · "น้ำลายบนลิ้นเริ่มเป็นฟอง" 975 meas-w · "ก่อนจะหมดสติ" 1026 meas-w |
| L09 | 1052 | 1123 | 35.014 | "ตอนห้องมีอากาศกลับมา" 1086 meas |
| L10 | 1157 | 1336 | 38.514 | "อากาศในปอดจะดันออก" 1212 meas · "เพราะข้างนอก…" 1253 meas · "ปอดอาจบาดเจ็บได้" 1305 meas · "บาดเจ็บ" 1318 meas-w |
| L11 (R2.4) | 1364 | **1400** | 45.426 | `...-L11-kore-A-r13-trim.wav` "ปล่อยลมหายใจออกมา…" (36 f voiced, no inner pause; onset in file 0.041 s at 0.95); R2.3: 1364–1386 "ปล่อยมันออกมา…" |
| V02 `2026-11-08_ep08-V02-algenib-A.wav` | file at **1412** (R2.3 1398) | voiced 1421–1440 | 47.067 | radio filter at mix time |
| L12 (R2.4) | 1458 | 1507 | 48.547 | "ก็อาจรอด" 1490 meas (`...-L12-kore-A-trim.wav`, the cut2 take trimmed before "แต่ข้อมูล…") |
| L13 (R2.4) | 1526 | 1675 | 50.666 | `...-L13-kore-A-comma.wav`: "คุณจะอยากกลั้นหายใจไว้" 1526–≈1568 `est` (comma 0.23 s) · "แต่ในที่ที่ไม่มีอากาศ" 1574 meas · "สิ่งที่ช่วยปอดคุณ" 1613 meas (mid-gap; word onset ≈ 1616 `est`) · "คือหายใจออก" 1653 meas (mid-gap; word ≈ 1656 `est`) · fade-out G1658–1685 (file fade start 5.516 − 0.9 s) |
| *R2.3 rows (superseded)* | | | | L11 1364–1386 ("ปล่อยมันออกมา…", file start 45.414); V02 file at 1398 (voiced 1407–1426); L12 1444–1493 ("ก็อาจรอด" 1476); L13 1512–1661 ("แต่" 1560, "สิ่งที่ช่วยปอด" 1599, "คือหายใจออก" 1639, fade G1644–1671) |
| *R2.2 rows (superseded)* | | | | L12 1444–1588 ("แต่ข้อมูลส่วนใหญ่…" 1504, "กับอุบัติเหตุไม่กี่ครั้งนะ" 1545); L13 1603–1692 ("สิ่งที่ควรทำ" 1641, "หายใจออก" 1674, fade G1667–1692), file start 53.380 |

<a id="r2-re-time"></a>
## R2 re-time (atempo 0.95; user decision 2026-11-08)

Method: `voice-lock.py --tempo 0.95` re-measures every line edge and every gap anchor with the R1 silencedetect (−35 dB / 0.08 s) on the read run through `atempo=0.95` (each hard-coded R1 edge keeps its offset from the 1.0 detection, divided by 0.95; Whisper anchors scale from their line onset), and V01/V02 through atempo the same way. The re-gap rules are R1's, so every line-to-line gap, every silent beat (30/30/24 f) and the closing (66 f) keep their R1 length; inner pauses stretch with the speech. No story beat, shot ID, line, claim or reveal moved. Total **1762 f = 58.73 s** (R1 1684 f, +78 f; ≤ 1800 f cap). The coordinator's preview (`pace-095-preview.py`) shifted whole files, so its padding also stretched; this lock lands within 2 f of it (L02 onset G106 vs ≈ G107, L13 G1603 vs ≈ G1601) and keeps the gaps exact.

| Shot | R1 G | R2 G | Δ f | How the frames are used |
| --- | --- | --- | --- | --- |
| S01-B01-SH01 | 0–53 | 0–55 | +2 | slower line; clasp/face events follow; helmet lift on the last 12 f |
| S01-B01-SH02 | 53–97 | 55–101 | +2 | slot = stretched V01 + ≥ 25 ms + 6 f silence; helmet path to the clear frame L40 (was L38); R2.1: path raised 0.11 m (SD02) |
| S01-B01-SH03 | 97–223 | 101–233 | +6 | slower line; film-strip clock re-mapped to the words (3 % slower) |
| S01-B01-SH04 | 223–260 | 233–272 | +2 | latch 5 % slower |
| S01-B01-SH05 | 260–280 | 272–293 | +1 | hold (stamp on L7 as R1) |
| S01-B02-SH01 | 280–354 | 293–371 | +4 | pat-check 5 % slower |
| S01-B02-SH02 | 354–397 | 371–416 | +2 | ice gag 5 % slower |
| S01-B02-SH03 | 397–479 | 416–503 | +5 | flask clock 5 % slower |
| S01-B03-SH01 | 479–582 | 503–610 | +4 | silent beat unchanged; longer glitter flow under the line |
| S01-B03-SH02 | 582–694 | 610–728 | +6 | drop keys re-mapped to the words; longer push |
| S01-B03-SH03 | 694–864 | 728–907 | +9 | slower push; hose pop moved with "เสีย" |
| S01-B03-SH04 | 864–997 | 907–1047 | +7 | whole shot ×1/0.95 (step-back, truck, dim) |
| S01-B03-SH05 | 997–1074 | 1047–1127 | +3 | needle/lamps/sepia follow the slower line |
| S01-B04-SH01 | 1074–1151 | 1127–1206 | +2 | silent beat unchanged; hold in the line |
| S01-B04-SH02 | 1151–1277 | 1206–1340 | +8 | chest keys re-mapped to the words |
| S01-B04-SH03 | 1277–1334 | 1340–1398 | +1 | longer thinning tail (reveal timing unchanged) |
| S01-B05-SH01 | 1334–1373 | 1398–1439 | +2 | slot = stretched V02 + 13 f; tow 5 % slower (SD12) |
| S01-B05-SH02 | 1373–1429 | 1439–1498 | +3 | hatch 1 f later (shut 6 f after "ก็อาจรอด" as R1), longer hold |
| S01-B05-SH03 | 1429–1518 | 1498–1592 | +5 | lean 5 % slower |
| S01-B05-SH04 | 1518–1618 | 1592–1696 | +4 | slower line; L13 fade-out; stinger after the voiced end |
| S01-B05-SH05 | 1618–1684 | 1696–1762 | 0 | unchanged |

**Silence rule (G91–96 → G95–100).** R1: V01 voiced end 1.2415 s in the take = G90.2, exact zero from G91 (25 ms later), 6 f, L02 file start 117 ms after the zero ends. R2: the stretched take is voiced to 1.297 s = G93.9, exact zero **G95–100** (36 ms after the voiced end), 6 f, L02 file start (3.480 s) 114 ms after the zero ends; helmet clear frame = silence frame = L40. Both margins are at least R1's (the 3 ms shorter L02 lead-in is padding below −35 dB).

<a id="r23-re-time"></a>
## R2.3 re-time (script R1.2 ending; Editor R1.2 voice re-lock, 2026-11-08)

G0–1438 is identical to R2.2 (same lines, cuts, clocks, ring ticks, helmet path, silence G95–100). From S01-B05-SH02 on, the cuts are the Editor's R1.2 re-lock ([timeline.json](timeline.json), total **1731 f = 57.70 s**): L12 trimmed to "ถ้าช่วยเร็วมาก… ก็อาจรอด" (voiced 1444–1493), L13 the new comma take (onset 1512, voiced end 1661), 15 f picture-only beat before L13 (cut G1497 + LEAD 15; the closing-breath exception), 4 f after the last word to the SH05 cut, closing 66 f.

| Shot | R2.2 G | R2.3 G | Δ f | How the frames are used |
| --- | --- | --- | --- | --- |
| S01-B05-SH02 | 1439–1498 (59) | 1439–1497 (58) | −1 | picture unchanged; hatch shut L43 = G1482 stays inside "ก็อาจรอด"; camera `u = L / 58` |
| S01-B05-SH03 | 1498–1592 (94) | 1497–1596 (99) | +5 | **re-staged (SD16):** silent beat L0–14 (chest lift with lips pressed, CREW's glove tightens), L13a from L15, shoulders drop on "แต่" L63 |
| S01-B05-SH04 | 1592–1696 (104) | 1596–1665 (69) | −35 | **re-staged (SD17):** L13b "สิ่งที่ช่วยปอดคุณ คือหายใจออก" L3–65; expression keys on the exhale L47–62; no smile; stinger G1662 |
| S01-B05-SH05 | 1696–1762 (66) | 1665–1731 (66) | 0 | starts 31 f earlier; content unchanged except the eye-open rule (SD18) and her brows opening at SH04's 35 % |

<a id="r24-re-time"></a>
## R2.4 re-time (script R1.3 L11; Editor R1.3 voice re-lock, 2026-11-08)

G0–1339 is identical to R2.3 (same lines, cuts, clocks, ring ticks up to G1273, helmet path, silence G95–100). L11 is now "ปล่อยลมหายใจออกมา…" (user, ER05: "มัน" was unclear), voiced **1364–1400** (36 f; R2.3 1364–1386, 22 f); the cut keeps the 12 f glitter tail after the voiced end, so S01-B04-SH03 ends at **G1412** and every later shot starts 14 f later with its length unchanged ([timeline.json](timeline.json), total **1745 f = 58.17 s**, cap 1800). Every B05 event is keyed on shot-local `L`, so B05 pictures are unchanged frame for frame in `L`; only their G labels move.

| Shot | R2.3 G | R2.4 G | Δ f | How the frames are used |
| --- | --- | --- | --- | --- |
| S01-B04-SH03 | 1340–1398 (58) | **1340–1412 (72)** | +14 | lips part L0–9 (unchanged, the reveal stays on the cut); glitter stream **L9–53** (R2.3 L9–39): the breath runs under the whole line and stops 7 f before its voiced end, as in R2.3; drift and thinning **L53–72** (same 19 f tail); same camera path over 72 f (`u = L / 72`, 0.81× the speed); ring 6.6 → 7.5 over 72 f, tick 7 at L32 (G1372) |
| S01-B05-SH01 | 1398–1439 | 1412–1453 | +14 start | time shift only (V02 slot) |
| S01-B05-SH02 | 1439–1497 | 1453–1511 | +14 start | time shift only; hatch shut L43 = **G1496** |
| S01-B05-SH03 | 1497–1596 | 1511–1610 | +14 start | time shift only; L13 onset L15 (G1526), "แต่" L63 (G1574) |
| S01-B05-SH04 | 1596–1665 | 1610–1679 | +14 start | time shift only; "สิ่งที่ช่วยปอด" L3 (G1613), "คือหายใจออก" L43 (G1653), voiced end L65 (G1675), stinger L66 (G1676) |
| S01-B05-SH05 | 1665–1731 | 1679–1745 | +14 start | time shift only; last frame G1744 black |

**Ambient clock check (G / 30, continuous across cuts; R2.4 moves the B05 phase by 14 f).** AST auto-blink (head seed 7202) starts at G1375, 1482, 1588, 1694 (4 f each): G1375 = B04-SH03 L35–38 (unchanged); G1482 = B05-SH02 L29 (back view, face not drawn; R2.3 L43); **G1588 = B05-SH03 L77–80** (R2.3 L91–94; the unforced blink now falls 6 f after the shoulder drop L63–71, outside the eye-open windows L0–14 and L97–98, kept); G1694 = B05-SH05 L15–18 (stepped past by `openEyesT` on every frame, SD18). No blink in B05-SH01 or SH04 (as R2.3). Earth/star drift and zero-g bob stay continuous across every cut because B04-SH03 grew by the same 14 f.

<a id="story-clock-ring-helmet-and-drift"></a>
## Story clock (ring), helmet and drift

**Timer ring** (`TimerRing` / `ringGeom`, `RING` centre (905, 300), r 92; no digits; label "ประมาณ 10–15 วินาที"). Value per shot = `ringStory(L, {from, to, dur: shot frames})` (linear); ticks (`ui_click-tick_01`, very low) on the frame the value first reaches each integer.

| Shot | Ring from → to | State | Tick G |
| --- | --- | --- | --- |
| S01-B01-SH02 | 0.0 | fade in L38–46 (`ringOpacity` inAt 38, inFrames 8) | 101 (start tick, on the cut) |
| S01-B01-SH03 | 0.0 → 1.0 | live | 233 (= 1) |
| S01-B01-SH04 / SH05 | 1.0 → 1.2 / 1.2 → 1.4 | live | — |
| S01-B02-SH01 | 1.4 → 2.0 | live | 371 (= 2) |
| S01-B02-SH02 / SH03 | 2.0 → 2.3 / 2.3 → 2.9 | live | — |
| S01-B03-SH01 | 2.9 → 3.7 | live | 517 (= 3) |
| S01-B03-SH02 | 3.7 → 4.3 | live | 669 (= 4) |
| S01-B03-SH03 – SH05 | 4.3 | `paused`: sepia, 50 %, pause mark; no ticks | — |
| S01-B04-SH01 | 4.3 → 5.4 | live (resumes on the cut) | 1178 (= 5) |
| S01-B04-SH02 | 5.4 → 6.6 | live | 1273 (= 6) |
| S01-B04-SH03 | 6.6 → 7.5 (R2.4: over 72 f) | live | **1372** (= 7, L32; R2.3 1366 = L26) |
| S01-B05-SH01 | 7.5 → 8.1 | live | **1447** (= 8, L35; R2.3 1433) |
| S01-B05-SH02 | 8.1 → 9.0 over L0–43, then holds 9.0 (216°, band at 240°) | stop on the shut frame G1496 (R2.3 G1482); fade L43–55 (12 f) | **1496** (= 9, last tick, the tick stops; R2.3 1482) |
| S01-B05-SH03 → end | — | hidden | — |

Ring values per shot are unchanged from R1 (the ring runs about 5 % slower on screen with the slower read; it still stops at 9.0 before the 10–15 band). R2.4: the S01-B04-SH03 segment runs over 72 f, so tick 7 moves to G1372 (computed: 6.6 + 0.9 · 32 / 72 = 7.000); `TICK_G` in `clock.ts` becomes `[233, 371, 517, 669, 1178, 1273, 1372, 1447, 1496]` (Editor).

**Helmet path (SET-ORBIT, built metres; slow-motion convention).** On the head: centre `AST head + 0.02` = (0.00, 1.66, 0.55) built. S01-B01-SH01 L43–55: lifts 0.05 m. S01-B01-SH02 (46 f): linear from `H0` (0.00, 1.71, 0.55) at L0 to `Hc` (0.09, **2.30**, 0.73) at **L40 = the clear frame (G95)**, then linear to `HELMET_L46` (0.104, **2.376**, 0.758) at L46; spin 0 → 25° about its own (0.3, 0.2, 1) axis over L0–46. From G101 on: `helmet(G) = (0.104, 2.376, 0.758) + (0.12, 0.38, 0.14) · (G − 101) / 30` m, spin 18°/s; it never returns (SD02, SD03). (R2: Hc y 2.19, L46 y 2.266, the drift 0.11 m lower; R1: Hc at L38/G91, drift clock from G97.)

**AST drift.** Foot point `AST_AT` in B01–B03 (S01-B02-SH01 x −0.04); B04: (−0.15, 0.40, 0.52), roll +4° (built LF04 values); B05-SH01 towed −0.65 m in x. Ambient: `zero-g-drift` (6 s loop, bob 3 cm, roll ±3°) on the ambient clock in every orbit shot where no other motion owns the body.

<a id="staging-deviations"></a>
## Staging deviations (Film decisions from the projection run and the built assets)

| ID | Shot | ROWS-R1.3 value → this sheet | Reason (measured) |
| --- | --- | --- | --- |
| SD01 | orbit shots | brief targets/eyes → + `OFF` (0, 0.26, 0.30); AST foot `AST_AT` | the built look frames (user-passed) use it; brief values would put AST's feet on the truss top |
| SD02 | S01-B01-SH02 | path end (0.10, 1.85, 0.45) at shot end, clear "at 0.35 s" → clear point (0.09, 1.93, 0.43) (brief space) at **L40** (R1: L38), linear, shot **46 f** (R1: 44) | coordinator decision (V01 heard whole, silence at the gasp's end, now G95 at 0.95 pace); the brief end left the bubble 3 cm inside the hair (bubble bottom 1.56 < head top 1.59); `meas` (R1 rig) at the clear frame: ring bottom y 841 < head top y 846 (clear by 5 px), 2 f earlier not yet clear (855 > 845); R2 puts the helmet at the same point on L40 with camera `u` 0.870 (R1 0.864), so the margin is `est` 5 ± 1 px, re-check on the Draft strip. **R2.1:** the R2 Draft measured the real rig (`qa-helmet-margin.ts`, Editor) with the collar ring 48 px *on* the hair at L40 (ring bottom y 878, hair top y 830: the R1 rig omitted the 0.03 m chest/head `rise`); `Hc` and `HELMET_L46` raised **+0.11 m in y** (user decision: raise the path, keep the silence): `meas` (real paint function, Film sweep of DY 0.09/0.10/0.105/0.11) ring bottom y 821 vs hair top 830 = **clear by 9 px at L40**, glass by 30 px; L39 ring 0 px (touching), L38 −8 px (not clear) |
| SD03 | S01-B01-SH03 → SH05 | helmet velocity (0.06, 0.15, 0.10) → (0.12, 0.38, 0.14) m/s | keeps SH02's rise (0.38 m/s) instead of a hidden slow-down; `meas` it leaves frame top at L41 (storyboard "by 1.5 s"); the slower value kept it behind the film-strip card for 3.3 s. R2.1: with the drift start 0.11 m higher `meas` it leaves frame top at **L34** (bottom edge y 4 at L33, −19 at L35; top edge already off frame at L0, y −17), still "by 1.5 s" |
| SD04 | S01-B01-SH05 | `T (0.40, 2.60, 0.95), eye 2.4, pitch −22°, hy 700` → target = helmet at **G282** (shot L10; R1 G270) = **(0.83, 4.67, 1.60)** (R2 (0.83, 4.56, 1.60)), eye **5.75** (R2 5.64, R1 5.54; target and eye follow the helmet: +0.10 m in R2 for 8 f more drift, +0.11 m in R2.1 for the raised path), pitch −35°, hy 760 | the R1.3 line had the camera 0.2 m below its target pitched down: `meas` helmet at y −129 → −413 (off frame); now above the helmet looking down so it reads against the Earth |
| SD05 | S01-B05-SH02 | hy 900 → **950**, cx 0 → **−60** | `meas` at hy 900 head tops y 126–202 (R07: nothing above y 140) and AST's head edge on the ring zone; hatch bottom now y 1166, above the band |
| SD06 | S01-B05-SH03 | `r 1.10→1.00, f 900` → **r 1.36→1.30, f 800** | `meas` AST head 404–432 px, over the 340 px cap (R01); now 285–291 px, and S01-B05-SH04 (f 1000, 320–334 px) is a real push-in |
| SD07 | S01-B05-SH05 | `eye 0.32, pitch −2°` → **eye 0.45, pitch −10°** | at eye 0.32 the gauge (y 0.30) and the hands (y 0.25) line up and the gloves cover the dial; now the dial sits ≈ 25 px above the gloves |
| SD08 | S01-B03-SH03 | "freeze of the previous orbit frame" → freeze of the **last frame of S01-B03-SH02** (the drop card) | the previous shot is the card, not orbit; the card's warm glow → sepia keeps the "memory" read |
| SD09 | S01-B03-SH04 | lamps dim 2.0–4.3 s → **L91–135** (R1 L86–128; the whole shot is scaled ×140/133 = 1/0.95) | `meas` TECH's suit leaves frame left at L86–88 (R1 L82–84, same `u`) with the linear truck; the dim must start after he is gone (R03) |
| SD10 | S01-B03-SH05, B05-SH02 | needle 0.4–1.9 s → on "ตอนห้องมีอากาศกลับมา" (L39–65; R1 L37–62); hatch swing 0.5–1.3 s → L19–43 (`hatchAngle((L − 1) / 30, 100, 0.6, 1.4)`; R1 L18–42), shut G1482 (R1 G1415) inside "ก็อาจรอด", 6 f after its onset as in R1 | events land on their words from the lock |
| SD11 | card and motion clocks | clock = L / 30 → mapped clocks per shot (film strip, pat-check, flask, drop, chest; R2 adds ice, latch, rail-tow) | the built animation keys (`FILM_T`, `FLASK_T`, `DROP_T`, `CHEST_T`, `ICE_T`, `RING_CLOSE_KEYS`, `pat-check`, `rail-tow`) are placed on the measured words; mappings in the shot blocks (R2 values; R1 values in the change log) |
| SD12 | S01-B05-SH01 | `rail-tow` t = L / 30 over 39 f → **t = (39 / 41) · L / 30** over 41 f | V02 at 0.95 is voiced to L28; the slot keeps R1's 13 f tail, and the tow plays 5 % slower to fill it instead of stalling 2 f before the cut |
| SD13 (R2.2) | S01-B05-SH01 | AST `neutral` → **`tired` (L0–6) → `scared` (L7–10) → `worried`-type hold (L11–40)**, mouth open `o` 0.2 throughout | user Draft verdict: the rescued face read as a plain smile. Cause: `woman-bob` carries look mouth `line`, whose closed (`flat`) stroke has corners 0.02 above the centre (`head.ts` `lookMouth`), so `neutral` draws a soft smile. Story beat: ≈ 8 s without air, lungs just emptied (L11); the grab is rescue, not relief yet (the hatch is still open) |
| SD14 (R2.2) | S01-B05-SH03, SH04 (and SH01, SH02) | probe painter `dry(p)` = `p.layer(0, 1)` → a **no-op painter** | user Draft verdict: arm "sketch lines" beside her torso. Cause: `layer(0, …)` sets alpha 0, but `makePainter` inks at alpha < 1 by mixing the ink colour toward `fade` (the shot paper `#8a97a8`), so every ink stroke of the measuring pass is drawn opaque in paper grey; the probe's default P46 arms sit beside the torso where the real (reached) arm is not |
| SD15 (R2.2) | S01-B05-SH05 | glove macro (`yaw −80→−72, r 0.62→0.56`, glove discs with sleeve stubs, no bodies) → **high three-quarter two-shot**: `cam: (0.18, 0.30, 0.30), yaw 216→212, r 1.30→1.22, eye 0.80, pitch −11°, f 900, hy 820`; needle curve 0 → 18 % linear L12–66 → **0 → 15 % L12–40 (ease), 15 → 18 % L40–66 (linear)** | user Draft verdict: the shot does not read (three grey discs, a 60 px dial and a dot lamp, no person). A first-time viewer needs people: her face (alive, looking at him), his visor, the joined hands; the gauge and lamp on the wall behind them; the needle climb visible before the fade starts (L42) |
| SD16 (R2.3) | S01-B05-SH03 | ROWS-R1.3/R2.2 "two-shot, her hand in his" on L12b (AST `neutral`, lean over L16–63) → the **urge to hold**: L2–10 AST `fig.rise` 0 → +0.02 m (chest/shoulders lift) with the lips pressed (`frown` on the `line` look = level-down closed line) from L4, held to L62; CREW's near glove tightens L6–14 (arm target (0.11, −0.265) → (0.085, −0.25) m, `meas` hand 488,928 → 473,921 px, her arm follows by `reachTo`); lean 0 → 12° over L15–63; on "แต่" L63–71 rise → −0.012 m (`meas` head top 452 → 469 px) and the lips part (`talk` 0.08–0.12) | script R1.2 L13a: show the CL01 instinct before the line names it (ER audit "Scene and shot impact"); small and held so it reads as an urge, not a gasp or a proven reflex (Boat wording); no breath-in, cheeks or lung imagery (safety limits). `o` is not used here: the kit's `o` is a fixed round hole that reads "oh!" at any `open` (`head.ts`) |
| SD17 (R2.3) | S01-B05-SH04 | `neutral` → small `happy` (mouth closed) from "หายใจออก" → **no smile**: parted lips (`talk` 0.12) L0–47 → rounded `o` (breathing out) from L48 to the cut, `fig.rise` −0.012 → −0.024 m and brows 35 % toward flat over L47–62; look (−0.4, 0.05) on CREW | expression keyed on the exhale (coordinator brief); a closed `happy`/`neutral` mouth on `woman-bob` draws the smile the user rejected in SH01 (SD13); SH05 opens on `o` with brows from 35 %, so the cut keeps the face |
| SD18 (R2.3) | S01-B05-SH03, SH04, SH05 | kit auto-blink (`head.ts` `blinking`, 4 f every 2.5–4 s on the ambient clock) left as is → **eyes forced open** with `openEyesT(t, 7201)` (`stage.ts`: steps AST's ambient `t` past the blink, ≤ 5 f, only on frames the blink would close): SH03 L0–14 and L97–98, SH04 L0–1, L44–62, L67–68, SH05 every frame | Editor open item: the blink closed her eyes on single frames at the SH05 cut (R2.2 G1696–1697); with R2.3 G the blink falls on SH05 L29–32 (G1694–1697), inside the face change, and closed eyes before a fade read as passing out (SD15). Unforced blinks kept mid-shot: SH03 L91–94 (G1588–1591), none in SH04 |

<a id="sound-plan"></a>
## Sound plan (whole video; per-shot cues in the shot blocks)

Library checked 2026-11-08 at `~/ReelsStore/library/sound/INDEX.md` (238 lines): every library ID below exists; no EP08 NEEDS-GEN sound is in the library yet, so NG-M1, NG-M2, NG-S1…S8 stay open for the Editor ([brief sound direction](film-brief.md#sound-direction) holds the prompts; fallbacks listed there; extra fallback for NG-S1: `foley_sleeper-breath-tent_01`). Sound carries no fact (R08).

| G range | Music / bed | Ambience / layers | Mix intent (EP08a) |
| --- | --- | --- | --- |
| 0–94 | `space_thin-airy-pad_01` low | NG-S1 breath + NG-S2 carrier hiss inside the helmet (fallback `electric_radio-static-burst_01` very low) | hold (2.5) |
| **95** | everything out on one frame (V01 ends naturally at G94, voiced end 1.297 s in the stretched take = G93.9) | — | **drop to silence** |
| 95–100 | true silence (6 f; exact zero sample-range G95–100, as R1's G91–96) | — | hold |
| 101–339 | none | heartbeat `tension_heartbeat-slow_01` every 30 f from G101 (felt, sub) + ring ticks | hold (0.5); card SFX are small hits |
| 340–502 | NG-M1 low (fallback `bed_edu05-curious-theme_01`) | heartbeat + ticks under | lift (2) |
| 503–727 | music out on the cut G503 | heartbeat + ticks; glitter shimmer | drop (1) |
| 728–1126 | none | NG-S6 chamber hum in with the grade (G728–739); heartbeat out over the same 12 f; `bed_sub-drone-fade-in_01` from G923; `reveal_memory-swell-muffled_01` from G1084; hum + drone out by G1126 | hold (1.5), release at the swell |
| 1127–1339 | `tone_thin-unresolved_01` from G1151, builds as the riser from G1253 | heartbeat every 24 f from G1127, closer (+3 dB) | lift to 2.5 |
| 1340–1411 (R2.4) | riser releases without a hit into NG-S7 at G1349 (the shimmer may ring with the longer stream, L9–53 = G1349–1393; fade by G1400) | heartbeat G1340 and G1370 (30 f, softer); the grid pauses under the longer L11 read (next beat G1414 in SH01); L11 on near-silence G1364–1400 | release (1) |
| 1412–1495 (R2.4) | NG-M2 from G1431 (fallback `bed_edu1-warm-pad-loop62_01`) | radio static G1413 + V02 (voiced 1421–1440); heartbeats G1414 and G1444 (last; SH01 L2 and L32 as R2.3); tick 8 at G1447 | lift (2) |
| 1496 (R2.4) | felt thud `pulse_underwater-soft-thump_01` low-passed < 150 Hz; tick 9 then the tick stops | — | hit (soft) |
| 1496–1675 (R2.4) | NG-M2 thins into `bed_edu1-warm-pad-loop62_01` low; optional (Editor): one soft `tension_heartbeat-slow_01` at G1526 and G1556 under "คุณจะอยากกลั้น…", none from "แต่" G1574; L13 fades out G1658–1685 (0.9 s `qsin`, user; voiced end G1675) | no airborne sound (vacuum) | hold (2) |
| 1676–1744 (R2.4) | `stinger_pizz-tag-ending_01` from **G1676** (one frame after L13's voiced end G1675; UT15, peak ≈ −10 dB, trimmed ≤ 2.2 s, 0.5–0.6 s fade, done by G1742) | NG-S8 hiss from G1688 (SH05 L9), rising, never full; pad, hiss and tag fade with the picture G1721–1744 to true silence | release, fade |
| *R2.3 (superseded)* | 1340–1397 heartbeats 1340/1370/1400; 1398–1481 NG-M2 G1417, last heartbeat G1430, tick 8 G1433; thud G1482; L13 fade G1644–1671; stinger G1662, NG-S8 G1674, fade G1707–1730 | | |
| *R2.2 (superseded)* | 1482–1692: L13 fade G1667–1692; 1693–1761: stinger G1693, NG-S8 G1705, fade G1738–1761 | | |

<a id="caption-plan"></a>
## Caption plan

Edu stroke captions, no overlay band (series default), `captionStyle.bottomEdgeY` 1344, band y 1176–1344, ≤ 2 lines, break after "…" when a cue wraps; `@TamMaiLa` top-left; on-screen text otherwise only the ring label and the "สมมติ" stamp (R05). Cue = `[phrase onset, last voiced frame + 6)`, capped at the next cue's onset. Text verbatim from script R1.3 (R2.4: L11 text and edge from R1.3, cues from V02 on +14 f; R2.3: L12/L13 cues from R1.2, 28 → 27 cues; Editor sets the final edges in `cues.ts` from the take); L07 shows "ปี 1966" as digits; V01 has no subtitle; V02 is subtitled.

| Cue | G [start, end) | Thai |
| --- | --- | --- |
| L01 | 4–57 | ถ้าคุณถอดหมวกกลางอวกาศ… |
| L02a | 106–159 | ตัวคุณจะไม่ระเบิดอย่างในหนัง… |
| L02b | 159–235 | แต่อาจมีสติอยู่แค่ประมาณ สิบถึงสิบห้าวินาที |
| L03a | 238–275 | หมวกจริงล็อกแน่นนะ… |
| L03b | 275–295 | นี่แค่สมมติ |
| L04 | 298–373 | ตัวอาจบวมขึ้น… แต่ผิวหนังยังรั้งไว้ได้ |
| L05a | 376–421 | และไม่แข็งทันทีด้วย… |
| L05b | 421–505 | เหมือนกระติกน้ำร้อน ไม่มีอากาศมาพาความร้อนไป |
| L06a | 533–617 | แต่น้ำลายบนลิ้นคุณ… เริ่มเดือดจริง ๆ นะ… |
| L06b | 617–692 | ไม่มีอากาศกด น้ำเลยเดือดได้ |
| L06c | 692–730 | แค่ด้วยความอุ่นในตัว |
| L07a | 736–800 | ตามรายงาน ปี 1966… |
| L07b | 800–847 | คนทดสอบชุดของนาซ่า |
| L07c | 847–909 | เจอชุดเสียแรงดันในห้องสุญญากาศ |
| L08a | 912–966 | เขาเล่าว่า… สิ่งสุดท้ายที่จำได้ |
| L08b | 966–1049 | คือน้ำลายบนลิ้นเริ่มเป็นฟอง ก่อนจะหมดสติ (onset `est`, "คือ" ≈ 9 f before the 975 anchor) |
| L09 | 1052–1129 | แล้วเขาก็ฟื้น… ตอนห้องมีอากาศกลับมา |
| L10a | 1157–1212 | แต่ถ้ากลั้นหายใจ… |
| L10b | 1212–1253 | อากาศในปอดจะดันออก |
| L10c | 1253–1305 | เพราะข้างนอกไม่มีอากาศดันกลับ… |
| L10d | 1305–1342 | ปอดอาจบาดเจ็บได้ |
| L11 (R2.4) | **1364–1406** (voiced end 1400 + 6; next onset V02 1421) | ปล่อยลมหายใจออกมา… |
| V02 (R2.4) | 1421–1446 | จับได้แล้ว! |
| L12a (R2.4) | 1458–1513 | ถ้าช่วยเร็วมาก… ก็อาจรอด |
| L13a (R2.4) | 1526–1574 (voiced end ≈ 1568 `est`) | คุณจะอยากกลั้นหายใจไว้… |
| L13b (R2.4) | 1574–≈1616 (`est`: "อากาศ" ends ≈ 1610, next onset ≈ 1616) | แต่ในที่ที่ไม่มีอากาศ |
| L13c (R2.4) | ≈1616–**1679** (voiced end 1675 + 6 = 1681, capped at the SH05 cut: no caption on any SH05 frame, R2.2 rule) | สิ่งที่ช่วยปอดคุณ คือหายใจออก |
| *R2.3 (superseded)* | L11 1364–1392 "ปล่อยมันออกมา…", V02 1407–1432, L12a 1444–1499, L13a 1512–1560, L13b 1560–≈1602, L13c ≈1602–1665 | (R1.2 text) |
| *R2.2 (superseded)* | L12a 1444–1504, L12b 1504–1545, L12c 1545–1594, L13a 1603–1641, L13b 1641–1696 | (R1.1 text) |

## Shot map

| Shot | Beat | G [start, end) | Frames | Lines / claims | Look | Runtime mapping |
| --- | --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | B01 hook | 0–55 | 55 | L01 | LF01 | planned scene 1 |
| S01-B01-SH02 | B01 | 55–101 | 46 | V01 + silence (F010a, sound only) | (LF01) | 2 |
| S01-B01-SH03 | B01 | 101–233 | 132 | L02 (F001, F003 hedge) | LF06 | 3 |
| S01-B01-SH04 | B01 | 233–272 | 39 | L03a (real helmets lock) | — | 4 |
| S01-B01-SH05 | B01 | 272–293 | 21 | L03b ("what if") | (LF01) | 5 |
| S01-B02-SH01 | B02 | 293–371 | 78 | L04 | (LF07) | 6 |
| S01-B02-SH02 | B02 | 371–416 | 45 | L05a | (LF07) | 7 |
| S01-B02-SH03 | B02 | 416–503 | 87 | L05b (flask analogy) | LF07 | 8 |
| S01-B03-SH01 | B03 | 503–610 | 107 | show + L06a | LF02 | 9 |
| S01-B03-SH02 | B03 | 610–728 | 118 | L06b | — | 10 |
| S01-B03-SH03 | B03 flashback | 728–907 | 179 | L07 (1966 case, anonymous) | LF03 | 11 |
| S01-B03-SH04 | B03 flashback | 907–1047 | 140 | L08 | (LF03) | 12 |
| S01-B03-SH05 | B03 flashback | 1047–1127 | 80 | L09 | (LF03) | 13 |
| S01-B04-SH01 | B04 | 1127–1206 | 79 | show + L10a | (LF04) | 14 |
| S01-B04-SH02 | B04 | 1206–1340 | 134 | L10b | (LF04) | 15 |
| S01-B04-SH03 | B04 reveal | 1340–1412 (R2.4) | 72 | exhale + L11 (R1.3 "ปล่อยลมหายใจออกมา…") | LF04 | 16 |
| S01-B05-SH01 | B05 | 1412–1453 | 41 | V02 | (LF04) | 17 |
| S01-B05-SH02 | B05 | 1453–1511 | 58 | L12a (R1.2 "ก็อาจรอด") | (LF05) | 18 |
| S01-B05-SH03 | B05 | 1511–1610 | 99 | silent beat + L13a (CL01 echo) | (LF05) | 19 |
| S01-B05-SH04 | B05 | 1610–1679 | 69 | L13b (F007) | LF05 | 20 |
| S01-B05-SH05 | B05 end | 1679–1745 | 66 | closing, `A_fade` | (LF05) | 21 |

## Shot sheets

Each block: time, staging (casting line + entity paths), camera (`meas` projection), light (only differences from the brief), sound, caption zone, entry → exit, acceptance. Props and hands follow the brief's [entry → exit list](film-brief.md#technical-handoff); a block names only a change.

### S01-B01-SH01 · 0–55 · LF01 glove on the clasp (L01)

- **Time:** L01 L4–51. Clasp slips L21 (lever flicks 30° over 3 f); helmet lifts 0.05 m over L43–55 (ease in); face `neutral` → `surprised` at L28. (R2: 55 f, +2; events follow the slower line.)
- **Staging (SET-ORBIT):** AST `woman-bob + eva-suit, P46 zero-g-neutral, neutral→surprised`, `paintEva({at: AST_AT, view: 'front', helmet: 'bubble', rim: -1, fig: {lean: -0.06}, r: {to: [0.12, 0.04], via: [-0.01, -0.16], near: 0.15}, l: ZG_NEUTRAL('l')})` (LF01 arms), right glove on the clasp; tether from the right hip to `ORBIT.clip` (0.35, 0, −0.15). CREW `man-crop + eva-suit (visor, stripes), right` at foot (−3.90, 0.12, 0.00), right glove to the handrail from L25 (`r: {to: [0.38, -0.1], via: [0.16, -0.2]}`), small and unlit relative to AST (CL02). Helmet sheen ≤ 0.15, `glint` on the bubble's upper left.
- **Camera:** `cam: (−0.30, 1.00, 0.20), yaw 55→47, r 3.4→3.1, eye 1.90, pitch −16°, f 1100, hy 620` (LF01 as built, no OFF). `meas` AST 488→537 px (y 338–879), head 152→167 px, glove (489, 493)→(507, 512) on the neck ring; CREW 263→288 px at x 222→120; limb y 693, Earth 63 %.
- **Sound:** pad + NG-S1 + NG-S2 from L0; `foley_flashlight-click_01` muffled at L21.
- **Caption zone:** L01 in the band over the Earth; AST's feet end at y 879, band clear.
- **Entry → exit:** helmet on, glove on the clasp → helmet lifted 0.05 m, glove still at the clasp, face `surprised`.
- **Accept:** spike 1 at 270 px; glove on the clasp ±6 px at L0 and L21; AST ≥ 480 px from L0; CREW findable, not the first read.

### S01-B01-SH02 · 55–101 · the helmet leaves, silence (V01)

- **Time:** V01 file (atempo 0.95) at L0, voiced L4–39 (1.297 s; gasp ≈ L4–20, "เฮ้ย!" ≈ L23–39, split `est`); **L40 (G95) = the clear frame = the silence frame**; true silence L40–45 (6 f, as R1); ring fade-in L38–46 (0.0). (R2: 46 f, +2 = the take's 5 % stretch plus R1's ≥ 25 ms margin before the zero.)
- **Staging:** helmet on the [path](#story-clock-ring-helmet-and-drift) (passes in front of her face line, upward toward the lens; `paintHelmetProp` replaces the worn bubble from L0, same radius). AST `woman-bob + eva-suit, P46, shock→scared` (`helmet: 'off'`): chest lifts (shoulders +0.03 m) L4–15 with `shock` (mouth open 0.4); mouth follows the word L23–38 (`talk`, open ≤ 0.35); **lips press shut L40–43** (`scared`, mouth closed, no cheek puff) and hold to L46; hair starts to lift from L32 (`hair-float` optional). Arms float from the clasp to `ZG_NEUTRAL` over L0–21.
- **Camera:** `cam: (0.00, 1.76, 0.60), yaw 25→30, r 1.9→1.8, eye 1.16, pitch +12°→+16°, f 1050, hy 1000` (signature move 1, low tilt-up). `meas` (R2.1, the real shot paint function through `qa-helmet-margin.ts` logic, path raised 0.11 m) head 268→300 px (≤ 340); helmet centre (551, 930) (L0) → (548, 637) (clear frame L40) → (546, 596) (L46), radius 151→162 px, top edge y 780 → 434 (≥ 290 px below frame top; right edge ≤ 713, clear of the ring zone x ≥ 813); at the clear frame ring bottom y 821 vs hair top 830 (clear by 9 px), glass bottom 800 (30 px) — margin table in the change log; limb y 1651→1757 (Earth 13→8 %, deliberate: she is against black for this second, R07 accepted in ROWS-R1).
- **Sound:** pad, breath and hiss run to L39 and cut on **L40** (G95), just after V01's own end (G93.9); exact zero G95–100; heartbeat and the start tick land on the next cut (G101).
- **Caption zone:** no caption (V01 has none); her torso passes through the band, no face or contact in it.
- **Entry → exit:** helmet on-path at 0.05 m lift → helmet above her head (clear by L40), lips sealed, ring visible at 0.0.
- **Accept:** spike 2 on a 46-frame strip: the helmet's collar ring is ≥ 5 px above the hair top from L40 (`meas` 9 px) and not clear at L38 (`meas` −8 px); `npx tsx scripts/edu-series/ep08/qa-helmet-margin.ts` reproduces the R2.1 table; the audio is exactly zero G95–100 and V01's voiced end is ≥ 25 ms before G95; gasp then sealed lips readable at 270 px; no puffed cheeks.

### S01-B01-SH03 · 101–233 · LF06 film strip, she floats (L02)

- **Time:** L02 L5–128; "ไม่ระเบิด" L21 (meas-w); "แต่อาจมีสติ" L58; "สิบถึงสิบห้า" L96. Film-strip clock `filmStripAt(t)`, **t = (30 + (L − 24) · 33 / 34) / 30** (R1 (L + 7) / 30; maps R1's pop L23 → L24 and gone L56 → L58): pop-in L3, panel 2 L14, balloon pop L24 (G125, 3 f after "ไม่ระเบิด" as R1), cross L34 (G135), slide out L52–58 (G153–159), gone as "แต่" starts. (R2: 132 f, +6; card 3 % slower.)
- **Staging:** AST `woman-bob + eva-suit, P46 + zero-g-drift, surprised` (mouth flat, eyes wide), `helmet: 'off'`, at `AST_AT` drifting −x 0.02 m/s (ambient); helmet exits frame top by **L34** (`meas` R2.1, path raised 0.11 m; R2/R1 L41; its drift is in metres from the shot start, camera `u` differs < 2 %; passes behind the card's right edge for ≈ L2–24, the card is on top); film strip `paintFilmStrip(FILM_BOX (70, 165, 560, 395), {tilt: -4})` (balloon only, never a body).
- **Camera:** `cam: (0.00, 1.36, 0.55), yaw 20→12, r 2.30→2.05, eye 2.01, pitch −14°, f 1100, hy 640`. `meas` AST 606→668 px, head 188→207 px, head top y 449→457 (card bottom 395 + tilt ≥ 34 px clear); limb y 752, Earth 60 %.
- **Sound:** heartbeat every 30 f from L0; `ui_pop_01` at L24; `comedy_record-scratch_01` at L34; tick 1 at G233 (next shot L0); no music.
- **Caption zone:** L02a/L02b; feet end y 1055→1125, band clear.
- **Entry → exit:** helmet above head → helmet gone; card gone by L58; ring 0.0 → 1.0.
- **Accept:** balloon only; the card never covers her face; eyes at medium (head ≈ 200 px); ring continuous from SH02.

### S01-B01-SH04 · 233–272 · RING-CLOSE, a real ring locks (L03a)

- **Time:** L03a L5–≈37 ("ล็อก" ≈ L15, est). Latch `latchDeg(0.95 · L / 30)` (`RING_CLOSE_KEYS`; R1 `L / 30`): stage 1 (20°) at L9, locked (35°) at L18 (G251), indicator stripe aligns at L18. (R2: 39 f, +2; latch 5 % slower.)
- **Staging:** `paintRingClose` (generic ring, blue collar, no hands, no text or colour labels); the suit's shoulders flare out of frame; Earth limb sliver over the left shoulder (backdrop hy 260).
- **Camera:** `camRingClose(u)` = `cam: (0, 0, 0) set-cm, yaw 15→9, r 22→19, f 1000, hy 900` (R1.3; rim top y 469–490, ≥ 39 px under the ring label).
- **Sound:** NG-S3 two-stage click at L9 and L18 (insert sound, not vacuum air); heartbeat continues on the 30 f grid at G251, the same frame as the lock click (R1 7 f apart): Editor keeps both if the click stays clear of the sub beat, otherwise skips that one beat.
- **Caption zone:** L03a; collar and latch above y 1160.
- **Entry → exit:** lever open → locked; ring 1.0 → 1.2.
- **Accept:** no text or labels; the lock reads in two stages at 270 px.

### S01-B01-SH05 · 272–293 · her helmet tumbles away, "สมมติ" stamp (L03b)

- **Time:** L03b L3–17; stamp `stampState(L, {land: 7})` lands L7 (G279, on "สมมติ", meas-w), scale 1.3 → 1.0 over 4 f, holds; fades over G293–299 (first 6 f of the next shot, `fadeAt` = 21). (R2: 21 f, +1 hold.)
- **Staging:** helmet at `helmet(G)` ((0.79, 4.54, 1.56) at G272 → (0.87, 4.81, 1.65) at G293, R2.1; R2 (0.79, 4.43, 1.56) → (0.87, 4.70, 1.65); R1 (0.76, 4.33, 1.52) → (0.84, 4.58, 1.61)), spin 18°/s, `glint` 0.6; AST far below, small and soft (`AST_AT`, `helmet: 'off'`, alpha 0.7 or a light blur), optional. Stamp `Stamp` "สมมติ" at screen (300, 560), 300 × 130 px, −8°.
- **Camera (SD04):** `cam: helmet(282) = (0.83, 4.67, 1.60), yaw 10→16, r 1.6→1.5, eye 5.75, pitch −35°, f 1100, hy 760` (R2.1; R2 T y 4.56, eye 5.64). `meas` (R2.1 real rig; the helmet keeps its place in frame because target and eye moved with it) helmet (522, 783) → (555, 730), radius 156→184 px, top edge ≥ 545 (limb y 461, ≥ 84 px below it); Earth 75 %; AST (fixed, the camera 0.11 m higher) head top y 1036→1046, chin y **1129→1139** (R2 rig 1113→1123, +15.7 px), 21 px above the band top 1160.
- **Sound:** heartbeat (G281); optional soft stamp thump at L7 (graphic sound, Editor's call).
- **Caption zone:** L03b; AST's lower body in the band (soft, far), her face above it.
- **Entry → exit:** helmet drifting → drifting; stamp landed and held.
- **Accept:** helmet against the Earth (below the limb) in every frame; stamp clear of the ring zone and the band (it may touch the helmet's rim by L20; the stamp is on top); re-check AST's chin above y 1160 on the Draft.

### S01-B02-SH01 · 293–371 · pat-check (L04)

- **Time:** L04 L5–74; "แต่ผิวหนัง…" L35 (meas). `pat-check` clock **t = (0.95 · L + 6) / 30** (R1 (L + 6) / 30): chest pats L7, L19 (G300, 312); right glove to left upper arm L38 (G331); left glove to right upper arm L54 (G347); shoulders drop 0.02 m L70 (G363, breath out through closed lips, no puff); `worried` → `neutral` from L43. (R2: 78 f, +4; motion 5 % slower.)
- **Staging:** AST `woman-bob + eva-suit, pat-check, worried→neutral` at (−0.04, 0.42, 0.55), `paintEva({motion: {id: 'pat-check', t}})`, elbows tucked (depth arms).
- **Camera:** `cam: (0.00, 1.36, 0.55), yaw −15→−6, r 2.1→1.9, eye 1.91, pitch −12°, f 1100, hy 680`. `meas` AST 673→727 px, head 209→227 px; limb y 831, Earth 56 %.
- **Sound:** stamp fades G293–299; NG-M1 enters at L47 (G340), low; heartbeat; tick 2 at G371.
- **Caption zone:** L04; feet only in the band (bottom y 1158→1220).
- **Entry → exit:** gloves floating → gloves back to P46 after the last tap; shoulders lowered.
- **Accept:** no swelling shape at any size; each pat lands on the suit ±6 px on its frame; no puffed cheeks.

### S01-B02-SH02 · 371–416 · ice-shell gag (L05a)

- **Time:** L05a L5–≈41. Ice clock `iceAt(0.95 · L / 30)` (`ICE_T`; R1 `L / 30`): creep L0–11, hold L11–15 (she looks down, `suspicious`), crack L15–22, crumble and float away L22–45 (last flakes at the cut); she looks back up `smug` at L26. (R2: 45 f, +2; gag 5 % slower.)
- **Staging:** AST `woman-bob + eva-suit, P46 + zero-g-drift, suspicious→smug`, `helmet: 'off'`; `paintIceShell(suitParts(anchors, def))`: frost on fabric only, never past the neck ring; flakes drift outward (no falling).
- **Camera:** `cam: (0.00, 1.36, 0.55), yaw 35→42, r 2.6→2.4, eye 1.96, pitch −14°, f 1100, hy 660`. `meas` AST 548→587 px, head 170→182 px; limb y 772, Earth 59 %.
- **Sound:** NG-S4 crackle at L3 and L15 (fallback `water_ice-settle-tick_01` ×3); `stinger_pizz-shrug_01` at L22; NG-M1 under.
- **Caption zone:** L05a; figure ends y 989→1032, band clear.
- **Entry → exit:** clean suit → clean suit, last flakes leaving frame.
- **Accept:** frost stops at the neck ring; reads as a joke at 270 px.

### S01-B02-SH03 · 416–503 · LF07 flask card (L05b)

- **Time:** L05b L5–83. Flask clock `flaskAt(t)`, **t = (0.95 · L − 9) / 30** (clamped ≥ 0; R1 (L − 9) / 30): cutaway opens L19–29; heat wiggles bounce off the gap at L48 (G464) and L73 (G489, on "ความร้อนไป", est). (R2: 87 f, +5; card 5 % slower.)
- **Staging:** AST `woman-bob + eva-suit, P46 + zero-g-drift, happy (small)` lower left; `paintFlaskCard(FLASK_BOX (430, 470, 1010, 1080))` as LF07 (no body, no text).
- **Camera:** `cam: (0.00, 1.36, 0.55), yaw 10→16, r 2.8→2.6, eye 1.96, pitch −14°, f 1100, hy 700, cx **−240**` (R2.1: Editor's W5.3 value confirmed; R2 −160). `meas` (real `ast()` anchors, L0/29/48/73/86) AST 513→548 px at x ≈ 280–300 (bubble centre 301→298), head 159→170 px; bubble right edge ≤ 414 and left shoulder ≤ 356, so both clear the card edge x 430 by ≥ 16 px (at −160 the bubble ran to x 494 and the left shoulder to 436, under the card); right hand ≥ x 248, body whole; limb y 816, Earth 57 %.
- **Sound:** NG-M1 continues; music out on the next cut.
- **Caption zone:** L05b; card bottom y 1080 and AST bottom y 1029, band clear.
- **Entry → exit:** card in from L0 (6 f pop) → card on screen at the cut (cut takes it out).
- **Accept:** card has no body and no words; AST whole; the card avoids the ring zone.

### S01-B03-SH01 · 503–610 · LF02 glitter at the lips (show + L06a)

- **Time:** silent beat L0–29 (unchanged); L06a L30–≈106; "เริ่มเดือดจริง ๆ นะ" L73 (meas). Glove rises L0–15 to 0.12 m short of the mouth (P12) and stops; glitter starts L12; silent "หืม?" L21–27 (`talk`, open ≤ 0.25); glove lowers L36–49; glitter continues to the cut, drifting up-right. (R2: 107 f, +4; the extra frames are in the line, glitter flow longer.)
- **Staging:** AST `woman-bob + eva-suit, P12, worried`, `view: 'front', quarter: 'right'`, LF02 arms; glitter `paintGlitterFx` at `glitterAtLips(lips, u)` (3 cm clear of the lips), 3–6 particles/frame (LF02 drew 44 live marks), life 1.2 s, speed 0.05–0.15 m/s, spread 25°, never inside the mouth outline.
- **Camera:** `cam: (0.00, 1.51, 0.55), yaw 34→27, r 1.55→1.40, eye 1.71, pitch −5°, f 1100, hy 800`. `meas` head 297→327 px (cap 340), lips (570, 856)→(573, 871), raised glove (512, 903); limb y 1090, Earth 42 %.
- **Light:** sun rim on the lips (screen left) so the glitter catches light.
- **Sound:** music out at L0; heartbeat; `reveal_glass-shimmer-soft_01` at L12, very soft; tick 3 at L14 (G517).
- **Caption zone:** L06a; her free left glove (y 1239–1292) sits in the band, no contact there; lips and raised glove above y 1160.
- **Entry → exit:** gloves P46 → right glove back down, glitter flowing.
- **Accept:** spike 3: "sparkles at her lips" at 270 px; head ≤ 340 px every frame.

### S01-B03-SH02 · 610–728 · water-drop card (L06b)

- **Time:** L06b L7–114; "ไม่มีอากาศกด" L7, "แค่ด้วยความอุ่นในตัว" L82 (meas). Drop clock `dropAt(t)` piecewise linear through (L, t): (0, 0) (20, 0.6) (38, 0.9) (82, 1.9) (101, 2.5), then held (R1 (0, 0) (18, 0.6) (36, 0.9) (78, 1.9) (96, 2.5)): arrows fade L7–20, bubbles L38–≈86 ("เดือดได้"), warm glow L82–101. (R2: 118 f, +6; keys re-mapped to the words.)
- **Staging:** full-frame `paintDropDiagram` (DROP centre (540, 770), r 230; no labels, no body part); ring stays in its zone.
- **Camera:** screen-space push 1.00 → 1.08 about (540, 770), eased in-out over L0–117.
- **Sound:** heartbeat; `ui_pop_01` pitched up, very low, on 4–6 bubble pops between L42 and L86; tick 4 at L59 (G669).
- **Caption zone:** L06b/L06c; drop bottom ≤ y 1000 after the push, band clear.
- **Entry → exit:** card full → card held with the glow; its last frame is frozen for the next shot's grade (SD08).
- **Accept:** no body, no words; the bubbles read on "เดือดได้".

### S01-B03-SH03 · 728–907 · LF03 1966 chamber, the hose pops (L07)

- **Time:** grade-in L0–12 (SD08: freeze of G727 cross-graded in-canvas to the sepia chamber); L07 L8–175; "ปี 1966" L28, "คนทดสอบ…" L72, "เจอชุดเสียแรงดัน" L119 (meas); **hose pops L128** (G856, on "เสีย", est: R1's 9 f after the anchor / 0.95); needle 100 → 5 % over L128–148; TECH's arms lift 0.05 m over L128–134 and stay. (R2: 179 f, +9; push is linear in `u`, so it is 5 % slower.)
- **Staging (SET-CHAMBER66, `paintChamberSepia`):** TECH `man-parted + eva-suit (1960s silver tint), P01, back`, `helmet: 'round1966'`, feet (0.00, 0.00, −0.80); hose `paintHose` from the left-hip port to `CHAMBER.hose` (−1.10, 0.90, −1.70), after L128 the free end swings down over 10 f; gauge `CHAMBER.gauge` (0.62, 1.45, −2.15); cage lamps 100 %. Ring `paused` (sepia, 50 %, pause mark).
- **Camera:** `cam: (0.00, 1.10, −0.80), yaw 10→4, r 2.6→2.0, eye 1.30, pitch 0°, f 1000, hy 820` (push). `meas` TECH 701→911 px, head 172→224 px (back of the helmet); gauge (761, 781)→(756, 775); hose wall end (288, 929)→(192, 954).
- **Sound:** tick paused; heartbeat out over L0–12; NG-S6 hum in over L0–12; NG-S5 pop + falling hiss at L128.
- **Caption zone:** L07a–c; TECH's legs in the band (back view), gauge and hose above y 1160.
- **Entry → exit:** frozen card → chamber, hose off, needle at 5 %.
- **Accept:** spike 5 (no face, text or logo; never turns); the needle has no numerals.

### S01-B03-SH04 · 907–1047 · he steps back, lights dim (L08)

- **Time:** L08 L5–136; "สิ่งสุดท้ายที่จำได้" L30 (meas), "…เป็นฟอง" L68, "ก่อนจะหมดสติ" L119 (meas-w). The whole shot is scaled ×140/133 (= 1/0.95) from R1: TECH steps back L9–57 (z −0.80 → −0.50, small sway ±2° roll, back view, `walk` reversed or a slide with a 2-step bob); **leaves frame left L86–88** (`meas` R1 at the same `u`, linear truck); lamps dim 100 → 45 % over **L91–135** (SD09). (R2: 140 f, +7; slower step and truck.)
- **Staging:** TECH as SH03 (startle arms held); hose hangs; porthole control-room glow constant.
- **Camera:** `cam: (0.00, 1.10, −0.80) → (1.30, 1.40, −2.20), yaw 4→−8, r 2.0→2.2, eye 1.30→1.40, pitch 0°, f 1000, hy 820` (linear). `meas` TECH shoulder anchor x max 645 (L0) → 296 (L56) → 2 (L84); porthole (965, 774) → (542, 797); gauge (756, 775) → (216, 796).
- **Sound:** hum; `bed_sub-drone-fade-in_01` from L16 (G923), low.
- **Caption zone:** L08a/L08b; nothing important in the band.
- **Entry → exit:** TECH centre frame → empty chamber, porthole centred, lamps at 45 %.
- **Accept:** TECH upright on every frame he is visible; no part of him in frame when the dim starts (L91; 3 f after the exit, R1 2 f); no fall.

### S01-B03-SH05 · 1047–1127 · needle up, colour back (L09)

- **Time:** L09 L5–76; "ตอนห้องมีอากาศกลับมา" L39 (meas). Lamps 45 → 100 % over L31–63; **needle 5 → 90 % over L39–65** (SD10); sepia drains to near full colour over L47–79 (`paintChamberSepia` u 0.62 → 0.08); cut at L80. (R2: 80 f, +3; events follow the slower line.)
- **Staging:** gauge close (ticks only, no numerals).
- **Camera:** `cam: (0.62, 1.45, −2.15), yaw 0→6, r 0.62→0.52, eye 1.48, pitch 0°, f 1000, hy 820`. `meas` gauge centre (540, 868)→(540, 878), dial radius 161→192 px.
- **Sound:** `reveal_memory-swell-muffled_01` from L37 (G1084) rising with the needle; hum and drone out by L79.
- **Caption zone:** L09; dial bottom y ≤ 1070, band clear.
- **Entry → exit:** needle 5 %, dim → needle 90 %, warm, near full colour.
- **Accept:** no time or number on the dial; the needle peaks below the top stop.

### S01-B04-SH01 · 1127–1206 · held breath (show + L10a)

- **Time:** silent beat L0–29 (unchanged); L10a L30–≈76. Tremble roll ±1° at 6 Hz on the ambient clock from L0; tick 5 at L51 (G1178). (R2: 79 f, +2 hold in the line.)
- **Staging:** AST `woman-bob + eva-suit, P42, scared` (mouth closed), foot (−0.15, 0.40, 0.52), `roll: 4`, shoulders up 0.03 m, lips sealed (CL01 payoff).
- **Camera:** `cam: (0.00, 1.36, 0.55), yaw −20→−12, r 1.65→1.50, eye 1.76, pitch −8°, f 1100, hy 760` (shade side). `meas` head 273→294 px, AST 877→943 px; limb y 990, Earth 48 %.
- **Light:** sun behind her (rim on the ring and shoulders), face in cool Earthshine (`tint` toward `#7fb2e6` ≈ 0.18).
- **Sound:** ring ticks resume (next tick G1178); heartbeat every 24 f from L0, closer; `tone_thin-unresolved_01` enters at L24 (G1151).
- **Caption zone:** L10a; her lower body (y 1444–1508) below the band, arms and face above y 1160.
- **Entry → exit:** P42 held → P42 held.
- **Accept:** no cheek puff; the hold reads from shoulders and sealed lips.

### S01-B04-SH02 · 1206–1340 · chest outline (L10b)

- **Time:** L10b L6–130; "ดันออก" ≈ L30 (est), "เพราะข้างนอก…" L47, "ปอดอาจบาดเจ็บได้" L99 (meas), "บาดเจ็บ" L112 (meas-w). Chest clock `chestAt(t)` piecewise linear through (L, t): (0, 0) (16, 0.5) (30, 0.6) (47, 1.5) (79, 2.6) (107, 3.45) (112, 3.6) (129, 4.1) (134, 4.27) (R1 (0, 0) (15, 0.5) (28, 0.6) (45, 1.5) (75, 2.6) (101, 3.45) (106, 3.6) (121, 4.1) (126, 4.27)): outline draws L3–16, arrows push out from L30, dashed outer ring L47–79, amber glow ≤ 0.3 peaking L112. (R2: 134 f, +8; keys re-mapped to the words.)
- **Staging:** AST as SH01 (`P42`, `scared`, roll 4); `paintChestOutline` at her chest anchor (foot + 0.83 m; no organs, no lungs).
- **Camera:** `cam: (0.00, 1.36, 0.55), yaw 4→−4, r 2.10→1.85, eye 1.86, pitch −10°, f 1100, hy 700`. `meas` AST 668→753 px, head 208→234 px; chest (467, 823)→(454, 867); limb y 890, Earth 53 %.
- **Sound:** heartbeat (24 f grid); riser builds from L47 (G1253); tick 6 at L67 (G1273).
- **Caption zone:** L10b–d; feet only in the band (bottom y 1196→1284).
- **Entry → exit:** pose held; overlay draws → overlay fading after the glow.
- **Accept:** no organs or injury marks; the glow is ≤ 0.3, once.

### S01-B04-SH03 · 1340–1412 · LF04 the exhale reveal (exhale + L11)

- **Time (R2.4, 72 f; R2.3 58 f):** lips part L0–9 (built: `faceState` `o` 0.2 / eyes `half` from L5; the sheet's earlier "shoulders drop" was never built: no shoulder key in the shot, `fig.lean 0.08` static, not added in a pure re-time); glitter stream **L9–53** (`emit [9/30, 53/30]` s; rate unchanged, n 560 live over `life` 2.0 s, along her facing, slightly rising): the breath runs under L11 and stops 7 f before its voiced end (R2.3: L9–39, voiced end L46, the same 7 f); drifting and thinning **L53–72** (19 f, as R2.3's L39–58); **L11 "ปล่อยลมหายใจออกมา…" L24–60** (G1364–1400); the lips stay open `o` through the last frame (continuity into S01-B05-SH01 L0); tick 7 at **L32 (G1372)**. Stream length 44 f = 1.47 s (spike 4's ≥ 1 s holds). (R2: 58 f, +1 thinning tail.)
- **Staging:** AST `woman-bob + eva-suit, P46, neutral` (`faceState {mouth: 'o', open: 0.2, eyes: 'half'}`), `view: 'right'` (faces screen right), foot (−0.15, 0.40, 0.52), LF04 arms floating back to P46 over L0–30; stream from `glitterAtLips` toward screen right across the blue Earth.
- **Camera:** `cam: (0.30, 1.46, 0.90) → (0.45, 1.46, 1.20), yaw −60→−50, r 2.10→2.15, eye 1.81→3.01, pitch −12°→−30°, f 1100, hy 740→560, cx 150, ease [0.2, 1.0]` (signature move 2), **R2.4: `u = L / 72`** (same path and end frame, 0.81× the speed; the pull-back keeps gliding under the longer breath instead of stopping early). `meas` AST 737 → **504 px** (≥ 480), head 229→156 px; limb y 894 → 366, Earth 53 → 80 %. R2.4 `meas` (shot code, no-op brush, Film scratch run): AST head **228 (L0) → 222 (L24) → 198 (L39) → 172 (L53) → 163 (L60) → 156 px (L71)**, figure 734 → 716 → 637 → 555 → 525 → **502 px** at the last frame; feet y 1242 (L0) → 1233 (L24) → 1171 (L39) → 978 (L71).
- **Light:** sun behind (forward scatter: the stream blazes white-warm); frame warms ≈ 10 %.
- **Sound:** riser releases (no hit) into NG-S7 at L9 (G1349; the shimmer may ring with the stream to ≈ L53 and fade by L60); L11 on near-silence L24–60; heartbeat L0 and L30 (G1340, G1370), softer; no beat under the rest of the line (next G1414 = SH01 L2); ring tick 7 at L32 (G1372).
- **Caption zone:** L10d tail to L1, then L11 (G1364–1406 = L24–66); her feet at y 1242 at L0 (feet only, left of and above the caption text), above the band (y 1176) from ≈ L38 (R2.4 `meas`: 1171 at L39); stream y ≈ 550–700.
- **Entry → exit:** sealed lips → lips open 0.2, stream thinning over the Earth.
- **Accept:** spike 4 (one long sparkling breath over blue ≥ 1 s); AST ≥ 480 px at the last frame (R2.4 `meas` 502); AST head ≤ 340 px (228 max); R2.4: the stream leaves the lips after L53 (gap ≈ 150 px at L60, `est` from the emitter law: travel 820 · (7/60)^0.8) and is thinning and drifting on L60–71 (seen on the R2.4 stills L60/L71); no frame of the stream is sped up against R2.3 (rate and travel unchanged).

### S01-B05-SH01 · 1412–1453 · grab and tow (V02)

- **Time:** V02 file (atempo 0.95) at L0 (voiced L9–28, radio filter); `rail-tow` clock **t = (39 / 41) · L / 30** (SD12; the 1.3 s cycle over 41 f): near glove closes on her wrist at **L7** (`TOW_GRAB_SEC`), re-grips the rail at L14 and L36; tick 8 at L35 (G1447). (R2: 41 f, +2; tow 5 % slower.)
- **Face (R2.2, SD13; story first):** the beat is "caught, not yet safe": ≈ 8 s without air, lungs just emptied (continuity from S01-B04-SH03's end face `o` 0.2, eyes half), the grab is the first thing she feels. No smile, no tears (no air; F009), no sweat or bags. AST casting by segment (the mouth never closes, so the `line` look mouth's upturned corners never draw):
  - **L0–6, drifting:** `tired` + `faceState {mouth: 'o', open: 0.2, sweat: false, bags: 0, look: [0, 0.3]}`: brows `worry` (inner ends up), eyes `half` with squint 0.4, gaze down and unfocused, lips parted.
  - **L7–10, the glove closes on her wrist (`TOW_GRAB_SEC`):** `scared` + `faceState {mouth: 'o', open: 0.2, look: [-0.6, 0.1]}`: eyes snap `wide`, brows stay `worry`, gaze to his glove/visor (screen left; sign `est`, confirm the pupils point at CREW on the first still).
  - **L11–40, towed:** `worried` + `faceState {eyes: 'dot', mouth: 'o', open: 0.2, look: [-0.6, 0.1]}`: brows `worry` held, eyes open on him, lips parted. The first softening (relief) is saved for S01-B05-SH05.
  - Switch on whole frames (no blend needed at this head size, ≈ 100 px); one `faceState` per segment in `S01-B05-SH01.tsx` (the visible AST call, not the probe).
- **Staging:** CREW `man-crop + eva-suit (visor, stripes), rail-tow, left` (faces screen left, −x), foot (−0.85, 0.33, 0.45), `paintEva({motion: {id: 'rail-tow', t}})`; far glove planted on the handrail (`ORBIT.rail`, y 0, z −0.15) each stroke. AST `woman-bob + eva-suit, P46, tired → scared → worried` (R2.2; R2.1 `neutral`), towed: her right wrist is placed on CREW's near-glove anchor every frame (the motion's rule), body trailing at screen right, arm extended; ≈ 0.65 m −x over the shot.
- **Camera:** `cam: (−0.35, 1.36, 0.55) → (−1.00, 1.36, 0.50), yaw 22→16, r 2.5→2.4, eye 1.91, pitch −12°, f 1100, hy 700`. `meas` CREW 576→654 px (x 145–550), AST 603→630 px (head x ≈ 680); wrist ≈ (544, 762)→(543, 780); limb y 851, Earth 55 %.
- **Light:** sun front-left again, warmer than B04.
- **Sound:** `electric_radio-static-burst_01` trimmed 0.4 s at L1–13; V02 radio-filtered; NG-M2 enters at L19 (G1431); last heartbeat G1444 (L32).
- **Caption zone:** V02 cue; both figures end above y 1132, band clear.
- **Entry → exit:** CREW enters frame left reaching → wrist held, towing toward the airlock.
- **Accept:** spike 7: glove on the wrist ±6 px from L7; rail grips planted ±4 px while the body moves. R2.2: on stills L3, L8, L20, L38 her mouth is an open oval on every frame (no closed curve), brows inner-up, eyes wide at L8 and on CREW at L20/L38; no grey or dark outline of a second arm/torso around AST (SD14).

### S01-B05-SH02 · 1453–1511 · hatch shut, ring stops (L12a)

- **Time (R2.3, 58 f; R2.2 59 f):** L12a "ถ้าช่วยเร็วมาก… ก็อาจรอด" (R1.2 trim) L5–54 (voiced end G1507); "ก็อาจรอด" L37 (meas). Picture unchanged; camera `u = L / 58`. Hatch `hatchAngle((L − 1) / 30, 100, 0.6, 1.4)`: swing L19–43, **shut L43 (G1496)** = felt thud = tick 9 = ring stop; ring holds 9.0 and fades L43–55. (R2: 59 f, +3; swing speed unchanged, starts 1 f later, longer hold after the shut.)
- **Staging (SET-AIRLOCK, `paintAirlock({hatchOpen, behind: Earth})`):** AST `woman-bob + eva-suit, P46, back` foot (−0.15, −0.62, 0.40); CREW `man-crop + eva-suit (visor, stripes), back` foot (0.35, −0.79, 0.55), right glove on the hatch handle (+0.50, 0.00, 1.20) through the swing. Earth through the opening = infinity layer from the same camera pitched down 32° (R1.3).
- **Camera (SD05):** `cam: pos (0.30, −0.25, −0.95) → (0.24, −0.22, −0.85), target (−0.05, 0.05, 1.20), pitch +6°, f 900, hy 950, cx −60`. `meas` (cx −60 = the cx −40 run shifted 20 px): AST head top y 229→176, CREW 252→210 (backs of helmets/heads); hatch centre (460, 941)→(459, 949), radius 206→217 px; handle (248, 937)→(236, 945).
- **Light:** cool panel light; the Earth's blue in the opening goes out on the shut.
- **Sound:** `pulse_underwater-soft-thump_01` low-passed < 150 Hz at L43; tick stops at L43; NG-M2 thins; L13 not yet (onset G1526 = SH03 L15).
- **Caption zone:** L12a; legs in the band (backs), hatch rim bottom y ≤ 1166, handle and shut edge above y 1160.
- **Entry → exit:** door open 100° → shut, ring faded.
- **Accept:** spike 6: ring at 216° on G1496, band at 240° never reached; the door edge meets the frame on L43 (no bounce).

### S01-B05-SH03 · 1511–1610 · the urge to hold, her hand in his (silent beat + L13a; R2.3 re-staged, SD16; R2.4 time shift +14)

- **What the shot says (story first):** the hatch is shut and she is alive; her body does the B01 thing again (CL01: the sealed-lips gasp), small: she pulls a little air in and locks it. He feels it through the glove. Then the narrator names it ("คุณจะอยากกลั้นหายใจไว้…") and turns it ("แต่ในที่ที่ไม่มีอากาศ"), and on "แต่" she lets her shoulders go. It is the viewer's urge, not a stated reflex (Boat), so the picture is a small held lift, not a gasp.
- **Time (99 f):** silent beat L0–14 (picture only; L12a's caption may hold to L1); L13a onset **L15** (G1526), "คุณจะอยากกลั้นหายใจไว้" L15–≈57 `est`, comma pause ≈ L57–62, **"แต่" L63** (G1574, meas), "…ไม่มีอากาศ" to ≈ L99 `est` (voiced edge ≈ G1610 = the cut; "สิ่งที่ช่วยปอด" starts in SH04).
  - AST chest/shoulder lift `fig.rise` 0 → +0.02 m over L2–10 (ease), held L10–62; lips part (`talk` 0.12) L0–3, **pressed** (`frown`: closed line, level-down corners, never the `line` smile) L4–62.
  - CREW's near glove tightens L6–14 (ease): arm target (0.11, −0.265) → (0.085, −0.25) m from his shoulder; her right arm follows (`reachTo` to his hand every frame).
  - CREW lean 0 → 12° (`fig.lean 0.12 · k`) over L15–63 (with the line).
  - On "แต่": `fig.rise` +0.02 → −0.012 m over L63–71 (shoulders drop below rest), lips part again (`talk` 0.08 → 0.12); brows stay `worry` (they settle in SH04/SH05).
  - Eyes open on L0–14 and L97–98 (SD18); the unforced blink (ambient G1588) falls on L77–80 in R2.4 (R2.3 L91–94) and stays.
- **Staging:** AST `woman-bob + eva-suit, P46, neutral (faceState: brow worry, eyes dot, look (−0.6, 0.05), mouth talk/frown/talk)`, `front` (screen right), foot (−0.15, −0.62, 0.20), right glove holding CREW's left glove; CREW `man-crop + eva-suit (visor, stripes), right` (screen left in profile facing her), foot (0.40, −0.79, 0.35). Shut hatch behind. No puffed cheeks, no breath-in mark, no lung or chest diagram (safety limits; never the lung as a balloon).
- **Camera (SD06, unchanged; u = L / 99):** `cam: (0.12, 0.25, 0.28), yaw 200→192, r 1.36→1.30, eye 0.35, pitch −4°, f 800, hy 820`. `meas` (R2.3 shot code, no-op brush, `out/qa/ep08/r24/measure.txt`): AST head 285 (L0) → 286 (L14) → 289 (L63) → 291 px (L98), head top y 466 → 452 (lift) → 469 (drop); CREW head 224 → 238 px; joined hands (471, 936) → (456, 929) at L14 → (471, 937) at L98.
- **Sound:** `bed_edu1-warm-pad-loop62_01` (or NG-M2's tail) low; silent beat has no SFX (no airborne sound, no breath sound: vacuum); optional soft heartbeat `tension_heartbeat-slow_01` at L15 and L45 (G1526, G1556), released (none) from "แต่" L63; L13 from L15.
- **Caption zone:** L13a (G1526–1574), L13b (G1574–≈1616); faces and hands above y 1160 (`meas` hands y ≤ 941); legs in the band.
- **Entry → exit:** (turn hidden by the cut) hands joined, lips parted → chest up, lips pressed, his glove tightens → shoulders down, lips parted, CREW leaning in.
- **Accept:** AST head ≤ 340 px; hand contact ±6 px every frame (her glove on his); on stills L12 the lips are a closed level line (no upturn) and the shoulders visibly higher than L0 (head top ≥ 10 px up); on L66–71 the head top is back down (≥ 15 px below L12) and the lips parted; her eyes open on L0–14 and the last 2 frames; no paper-grey probe strokes (SD14); no breath-in or swelling image.
- **Defect record (R2.2, fixed in the R2.3 Editor pass `dry` = no-op):** the Draft shows thin paper-grey strokes of AST's default P46 arms beside her torso on every frame of this shot (worst at G1500–1540 by her right flank, where the real right arm is lifted to his glove) and of S01-B05-SH04 (same `twoShot`). Source: the measuring pass `paintSuited(dry(p), …)` in `twoShot` (`src/painted/edu08/shots/S01-B05-SH03.tsx`), with `dry` = `p.layer(0, 1)` (`src/painted/edu08/stage.ts`); a layer at alpha 0 still inks, opaque, in the fade colour (`makePainter`, `src/painted/kit/painter.ts`). The same probe exists in S01-B05-SH01 (ink toward `#05070d`: dark strokes, visible over the white suits and the Earth) and S01-B05-SH02 (CREW probe). Fix: [fixlist.md](fixlist.md) F2.
- **R2.2 block (superseded):** 1498–1592, L12b "แต่ข้อมูลส่วนใหญ่มาจากสัตว์ กับอุบัติเหตุไม่กี่ครั้งนะ" L6–90; CREW lean over L16–63; AST `neutral`.

### S01-B05-SH04 · 1610–1679 · LF05 "breathe out" (L13b; R2.3 re-staged, SD17; R2.4 time shift +14)

- **What the shot says:** the answer to "แต่…": the thing that helps your lungs is to let the air out. Her face carries it: on "หายใจออก" she rounds her lips and lets the breath go (chest sinks, brows begin to ease). No smile yet: relief is SH05's.
- **Time (69 f; R2.2 104 f):** "สิ่งที่ช่วยปอดคุณ" from L3 (G1613 meas, mid-gap; word ≈ L6 `est`) to ≈ L40; **"คือหายใจออก" L43** (G1653 meas, mid-gap; "คือ" ≈ L46, "หายใจออก" ≈ L49–65 `est`); voiced end **L65** (G1675); L13 fade-out L48–75 (G1658–1685: "หายใจออก" sits in the user's 0.9 s `qsin` fade). Last frame L68 (G1678).
  - Face: parted lips (`talk` 0.12) L0–47 → rounded `o` (breathing out) **from L48** to the cut; brows `worry` → 35 % toward `flat` (`browMix`) over L47–62; eyes `dot`, look (−0.4, 0.05) on CREW; eyes open L0–1, L44–62, L67–68 (SD18).
  - Body: shoulders hold SH03's drop (`fig.rise` −0.012 m) and sink to −0.024 m over L47–62 (the exhale).
- **Staging:** as LF05: AST `woman-bob + eva-suit, P46, neutral (faceState as above)`, `front, quarter: 'left'`, foot (−0.15, −0.62, 0.20), joined gloves low (her arm by `reachTo` to his hand); CREW `man-crop + eva-suit (visor, stripes), right` lean 0.12, soft at frame left.
- **Camera (R1.3, unchanged; u = L / 69):** `cam: (−0.15, 0.55, 0.20), yaw 190→184, r 1.36→1.30, eye 0.55, pitch −2°, f 1000, hy 800` (camera z −1.14 → −1.10). The same push in 69 f instead of 104 (faster, still slow: 0.06 m, 6°). `meas` (R2.3 shot code): AST head **320 (L0) → 328 (L43) → 332 (L62) → 334 px (L68)** (cap 340), head top y 580 → 581; joined gloves (388, 1093) → (358, 1116); CREW head 271 → 291 px.
- **Light:** cool white, faint warm edge from the (still off) lamp.
- **Sound:** pad; L13 fades out G1658–1685 (atempo then `afade` in the narration stem, not in the mix bus); `stinger_pizz-tag-ending_01` from **G1676** (L66, one frame after the voiced end G1675; UT15), ringing over the cut into SH05.
- **Caption zone:** L13b tail (to ≈ G1616), L13c (≈ G1616–1679, ends on the cut); joined gloves above y 1160 (`meas` y ≤ 1116); her free left glove in the band, no contact.
- **Entry → exit:** hands joined, lips parted → lips round on "หายใจออก", chest sinks, brows start to ease → cut on the rounded exhale.
- **Accept:** head ≤ 340 px every frame; no smile on any frame (no closed `line` mouth); the `o` appears on L48 (±2 f of "หายใจออก") and holds to L68; eyes open on L0–1 and L44–68; no probe strokes.
- **R2.2 block (superseded):** 1592–1696, L13 (R1.1 "คุณไม่ระเบิดหรอก… สิ่งที่ควรทำ คือหายใจออก") L11–100, "สิ่งที่ควรทำ" L49, "หายใจออก" L82, fade L75–100, `neutral` → small `happy` (mouth closed) from L84, stinger G1693 (L101), head 320 → 334 px over 104 f.

### S01-B05-SH05 · 1679–1745 · air comes back, he holds on, fade (closing, `A_fade`; R2.2 redesign, SD15; R2.3 time shift; R2.4 time shift +14)

- **What the shot says (story first):** the last image of the film: she is alive and held, and air is coming back into the room, but nothing is fixed yet (L12's hedge, F009: no instant-recovery image). A first-time viewer must read three things in the ≈ 1.4 s before the fade starts (L0–42): (1) two people, her bare face and his orange visor, hands joined; (2) a warm lamp switches on and a hiss rises: something is working, air is returning; (3) a small needle on the wall dial starts to climb. Her face carries the payoff of the breath motif (gasp in at the start → held → let out → now a first small breath): the first softening of the film, not a smile.
- **Time:** lamp on L6–14 (`ease`, `paintHalo` ≤ 0.3, R2.1 value); CREW's free glove settles over the joined hands L12–36 (`ease`); needle **0 → 15 % over L12–40 (`ease`), then 15 → 18 % linear L40–66** (R2.2; R2.1 0 → 18 % linear L12–66, which moved only 26° before the fade); her face changes L18–30 (below); a small breath (chest/shoulder rise 0.012 m up and back over L24–40, `fig` rise or a 1-frame-per-step offset on the torso; `est`, any kit-safe way); fade to black L42–66 (`endFadeSec` 0.8; last frame **G1744** black; R2.3 G1730, R2.2 G1761). Shot length 66 f unchanged; R2.3 started it at G1665 (−31 f), R2.4 at G1679 (+14 f).
- **Staging (SET-AIRLOCK, continuity with S01-B05-SH03/SH04: same foot points, same hold):** AST `woman-bob + eva-suit, P46` foot (−0.15, −0.62, 0.20), `view: 'front', quarter: 'left'` (as SH04; `est`, take the quarter that turns her face to this lens), right glove in CREW's glove at the joined point of `twoShot` (her arm solved with `reachTo` to his hand, as SH03); CREW `man-crop + eva-suit (visor, stripes)` foot (0.40, −0.79, 0.35), lean 0.12 (held from SH04), body three-quarter toward her: `view: 'right'` as SH03 unless `squareToCam` picks the front quarter at yaw 212–216 (camera ≈ 48° off his facing; either is valid, the visor must face screen right toward her); his free glove moves `armMix(ZG_NEUTRAL, reachTo(shoulder, u, joined + (0, −0.03 m)), ease(L, 12, 36))` and rests on top of the joined gloves from L36 (contact ±6 px, never through them). Gauge `AIRLOCK.gauge` (0.86, 0.30, 0.30) and lamp `AIRLOCK.lamp` (0.86, 0.50, 0.30) on the +x wall behind his helmet, as built (`paintAirlock({lamp, needle})`, no prop change). The glove-disc macro painter of R2.1 (`glove()`) is retired.
- **Face (AST):** L0–17 as SH04's end (`happy`, mouth closed, from SH04 L84) would repeat the plain smile the user rejected in SH01, so the shot opens on a calm face instead: **L0–17** `neutral` + `faceState {brow: 'worry', browTo: 'flat', browMix: 0.35 (R2.3; R2.2 0), eyes: 'dot', look: [-0.5, 0.1], mouth: 'o', open: 0.12}`: brows still raised, eyes open on him (screen left; sign `est`), lips just parted; **L18–30** `browMix` 0.35 → 1 (R2.3: starts where SH04 ends, SD17; brows settle flat), eyes `half` from L24 (relief, lids soften; never `shut`: closed eyes before a fade to black read as her passing out; R2.3: the kit auto-blink is stepped past on every frame, SD18, so no frame shows shut eyes, incl. the cut frames), mouth `o` 0.12 → 0.18 at L24–32 (the small breath) and back to 0.12 by L40; gaze stays on him. No smile, no tears, no closed mouth (the `line` look mouth draws a smile when closed, SD13). Kit: `neutral` with faceState overrides (no new expression).
- **Camera (SD15, replaces SD07):** `cam: (0.18, 0.30, 0.30), yaw 216→212, r 1.30→1.22, eye 0.80, pitch −11°, f 900, hy 820` (slow push-in; camera ≈ (−0.58, 0.80, −0.75) → (−0.47, 0.80, −0.74), inside the −1.15 limit). 28–32° round from SH04 (yaw 184–190) and 0.25 m higher, so the cut is a new angle, not a jump. `meas` (kit `paintEva` + `camPoint` with a no-op brush, Film scratch run `out/qa/ep08/r22/sh05-meas.ts`, not committed; views as in SH03, lean 0.12; L0 → L65): AST head **315 → 332 px** (cap 340), head centre (687, 803) → (708, 811), head top y 649; CREW head 231 → 243 px, centre (492, 767) → (483, 774); gauge centre (259, 905) → (225, 923), dial radius **41 → 44 px**; lamp (253, 804) → (218, 816). Joined gloves not measured (they depend on the reach): `est` x 560–640, y 1040–1140.
- **Light:** cool airlock white as SH04 until L6; the amber lamp (halo at the lamp, r ≤ 220 px, level ≤ 0.3, R2.1) comes on L6–14 and warms the frame ≈ 10 % (warm grade toward `AL.amber`, `tintPainter` or the shot's grade, `est` 0.10) by L20, strongest on the screen-left side (his visor rim and her left cheek); the dial face stays the brightest small object under the lamp so the needle reads.
- **Sound:** unchanged from R2.1 except the frames (R2.4, +14 on R2.3): tag from G1676 rings (done by G1742); NG-S8 hiss from L9 (G1688) rising, never full, **audible before L42** (it is the only "air" cue apart from the needle; ear-check on the Draft); everything fades with the picture to true silence. No airborne clunk.
- **Caption zone:** no caption (L13c ends at G1679, [caption plan](#caption-plan)); no on-screen text (VD24: no label on the gauge, no stamp); joined gloves above y 1150; ring hidden; `@TamMaiLa` mark as every shot.
- **Entry → exit:** cut from SH04 (her face, small smile, hands low) → higher three-quarter two-shot: hands joined, lamp off, needle 0 → lamp on, his glove over both, her brows settle and lids soften on a small breath, needle ≈ 15 % at L40 and ≈ 18 % at the last visible frame → black.
- **Accept:** spike 8: needle < 20 % at the last visible frame and full black on G1744 (R2.4; R2.3 G1730), live (no freeze); **read test** on the full-size stills L0, L20, L40: her face, his visor and the joined gloves are all in frame and none is cut by the frame edge or covered (gauge disc fully clear of his helmet by ≥ 10 px, else `cx` up to +40); the needle has moved ≥ 35° between L12 and L40; the lamp halo is visible from L10; her mouth is an open oval on every frame, eyes never shut (check G1694–1697 = L15–18 (R2.3: L29–32), where the auto-blink would fall, SD18); no paper-grey probe strokes (SD14); AST head ≤ 340 px; the viewer check (one person who has not seen the shot) can say "he is holding her hand, the air is coming back" from the Draft clip.

- **R2.1 block (superseded, kept for the record):** **Time:** lamp on at L6 (`paintHalo` ≤ 0.3); CREW's right glove settles over both L12–36; needle 0 → 18 % over L12–66; fade to black L42–66 (`endFadeSec` 0.8; last frame G1761 black). (R2: 66 f, unchanged length.) **Staging:** gloves only (her right in CREW's left, his right over both); gauge `AIRLOCK.gauge` (0.86, 0.30, 0.30), lamp `AIRLOCK.lamp` (0.86, 0.50, 0.30); `paintAirlock({lamp, needle})`. **Camera (SD07):** `cam: (0.15, 0.25, 0.30), yaw −80→−72, r 0.62→0.56, eye 0.45, pitch −10°, f 1000, hy 860`. `meas` hands (540, 998)→(540, 1030), glove radius ≈ 108–119 px; gauge (633, 799)→(717, 806), dial radius 60–64 px; lamp (636, 644)→(722, 642). **Light:** amber warms the frame. **Sound:** tag rings (done by G1759); NG-S8 from L9 (G1705) rising, never full; everything fades with the picture to true silence. **Caption zone:** no caption; gloves end above y 1150. **Entry → exit:** hands joined, lamp off, needle 0 → black, needle ≈ 18 % at the last frame before black. **Accept:** spike 8: needle < 20 % at the last visible frame; full black on G1761; live, no freeze.

## Boss and Editor handoff (W5.3)

- **Boss:** no new asset required by this sheet; every item exists in the worktree (W5.2, uncommitted). Small checks for Boss on the first Draft plates: (1) `paintHelmetProp` swap on S01-B01-SH02 L0 matches the worn bubble; (2) TECH step-back as a back-view slide with bob (no `walk` back cycle exists for the eva back view: `unknown`); (3) the ice shell silhouette is approximate (open item from B10).
- **Editor:** build `src/videos/edu-ep08/` with one scene per shot from the [shot map](#shot-map); place narration and V01/V02 from [Placement](#placement) (whole files) and `store.py use` them; ring, stamp and captions as screen layers with the [story clock](#story-clock-ring-helmet-and-drift) and the [caption plan](#caption-plan); generate the NEEDS-GEN set (NG-M1, NG-M2, NG-S1…S8) or use the listed fallbacks; mix per the [sound plan](#sound-plan). Draft (half size) first, then the viewer check.
- **Element captures:** look frames v3 `out/edu08/look-frames/v3/` (LF00–LF07, sheet `sheet-v3.png`), Boss proof sheets `out/edu08/boss-b/sheet-A-sets.png`, `sheet-B-fx.png`, `sheet-C-cards.png`, kit QA `out/zerog/*.png`; store `projects/EDU/previews/EDU-EP08-SHORT/look-frames/`. They show the approved look, not the timed motion.

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Editor | V01 gasp/word split inside the take (mouth timing in S01-B01-SH02) | `unknown`, est L4–19 / L22–38 |
| Editor | NG-M1, NG-M2, NG-S1…S8 generated or fallbacks used | missing (library checked 2026-11-08) |
| Editor | ear-check "ปี 1966", "นาซ่า", "สมมติ", L11 air, L03/L04 join (voice-measure open list) | open |
| Boss / Editor | S01-B01-SH02 clear frame L40 and exact zero G95–100 agree on the R2 Draft strip (±1 f); helmet ring clear of the hair by ≥ 5 px at L40 (R2.1 path; `meas` 9 px on the rig, picture check on the next Draft strip) | open check |
| Editor | narration rebuilt at 0.95 from [Placement](#placement): `atempo=0.95` on every line and V01/V02, L13 fade, zero G95–100, 1762 f (`narration-place.py` today has 1684 f, no atempo, zero G91–96 hard-coded) | open |
| Editor / Boss | shot ranges and shot-local clocks in `src/painted/edu08/clock.ts`, `shots/` and `src/videos/edu-ep08/cues.ts` moved to R2 (R1 values in the change log) | open |
| Boss | TECH back-view step-back (S01-B03-SH04) | `unknown` (slide + bob fallback) |
| Film | review Draft frames against SD02–SD07 (projection values from the rig, not painted frames) | after W5.3 |
| Editor | apply R2.1 in code: `clock.ts` `HC` y 2.30, `HELMET_L46` y 2.376; `S01-B01-SH05.tsx` T y 4.67, eye 5.75; S01-B02-SH03 cx −240 stays | open |
| Editor | apply R2.2 ([fixlist.md](fixlist.md) F1–F4): SH01 face segments (SD13), no-op probe painter (SD14), SH05 redesign (SD15), L13b caption end G1696 | open |
| Boss (proposal, user decides) | `woman-bob` look mouth `line` draws a soft smile when closed (`neutral`); a neutral sag would change every approved `woman-bob` face (EP05, EP08 LF05) | open question |
| Editor | apply R2.3 timing outside the shot files: `clock.ts` `SHOT_RANGES` B05 rows (1439–1497, 1497–1596, 1596–1665, 1665–1731) and `TOTAL` 1731, `src/videos/edu-ep08/index.ts` guard (1762 → 1731), `cues.ts` 27 cues per the [caption plan](#caption-plan) (L12a, L13a–c), narration/sound stems (`narration-place.py`, `sound-mix.py`: stinger G1662, NG-S8 G1674, fade G1707–1730). The four B05 shot files already carry R2.3 (Film); until `clock.ts` moves, the composition still cuts at the R2.2 frames | open |
| Film | review the R2.3 Draft strip of S01-B05-SH03/SH04 against SD16–SD18 (stills only so far: `out/qa/ep08/r24/`) | after the Editor pass |
| Editor | apply R2.4 outside the shot files: `clock.ts` `SHOT_RANGES` (S01-B04-SH03 1340–1412, B05 1412–1453, 1453–1511, 1511–1610, 1610–1679, 1679–1745), `TOTAL` 1745, `TICK_G` 1366 → **1372**, 1433 → 1447, 1482 → 1496 (ring over 72 f, [Story clock](#story-clock-ring-helmet-and-drift)); `index.ts` guard 1731 → 1745; `cues.ts` L11 "ปล่อยลมหายใจออกมา…" 1364–1406 and V02/L12/L13 +14 per the [caption plan](#caption-plan); `sound-mix.py` tick 7 at G1372 (today 1366; the other cues already match R2.4). S01-B04-SH03 already carries N 72 and the stream L9–53 (Film); until `clock.ts` moves, the composition still cuts it at G1398 | open |
| Film | check the R2.4 Draft of S01-B04-SH03 (stream under L11, thinning hold) after the Editor pass | after the Editor pass |

## Change log

- **2026-11-08 EDU-EP08-SHEETS-R1 (Film W5.1):** first timed sheets from the W4 voice lock (1684 f): 21 shots with integer ranges and event frames, built camera values (`OFF`), projection measured with the kit code at both ends of every world shot; story clock and tick frames; helmet path; sound plan with library IDs (all present) and the open NEEDS-GEN set; caption cues. Deviations SD01–SD11 from ROWS-R1.3 (SD02 implements the coordinator's S01-B01-SH02 decision: V01 kept whole, 44 f, silence at G91). Review rows → ROWS-R2.0 (times only, Thai text unchanged).
- **2026-11-08 EDU-EP08-SHEETS-R2 (Film W5.1 re-time):** user decision: narration atempo 0.95 per line and per vocal take, gaps kept, L13 0.9 s `qsin` fade-out. `voice-lock.py` gains `--tempo` (re-measures edges through atempo with the same silencedetect; the 1.0 path writes byte-identical R1 files); measure.json/timeline.json rewritten at 0.95: **1762 f** (R1 1684). Every shot range, line/anchor frame, shot-local event, clock mapping (film strip, latch, pat-check, ice, flask, drop, chest, rail-tow, hatch), ring tick, helmet path, sound-plan frame and caption cue moved; per-shot changes in [R2 re-time](#r2-re-time). V01 slot 44 → 46 f (silence frame L38 → L40, exact zero G91–96 → G95–100), V02 slot 39 → 41 f (SD12). SD02, SD04 (SH05 target helmet(282), eye 5.64), SD09, SD10, SD11 updated; SD12 added. R1 values are kept in brackets in the blocks where a clock changed. Review rows → ROWS-R2.1 (start/end and the frame facts only; Thai shot text unchanged).
- **2026-11-08 EDU-EP08-SHEETS-R2.1 (Film):** user decision on the R2 Draft (collar ring on the hair at L40, `out/qa/ep08/r2/helmet-margin.md`, `helmet-crop.png`): raise the S01-B01-SH02 helmet path, keep the silence (G95–100) and the V01 slot. Cause: the R1 projection rig omitted the 0.03 m chest/head `rise`, so the hair top sits ≈ 16 px higher (830 vs 846). Sweep of DY 0.09/0.10/0.105/0.11 m through the real paint function (scratch copy of `qa-helmet-margin.ts` with a DY parameter, deleted; the committed script unchanged) → **+0.11 m**: `Hc` (0.09, 2.30, 0.73), `HELMET_L46` (0.104, 2.376, 0.758), drift from it unchanged in velocity; S01-B01-SH05 target/eye follow (T y 4.67, eye 5.75, SD04); S01-B01-SH03 exit L41 → L34 (SD03). S01-B02-SH03 cx −240 (Editor W5.3) confirmed and recorded (−160 put the bubble under the card). Margin table (R2.1 rig, px, full size; margin = hair top − bottom):

  | L | G | helmet cy | R | glass bottom | ring bottom | hair top | m glass | m ring |
  | --- | --- | --- | --- | --- | --- | --- | --- | --- |
  | 0 | 55 | 930 | 151 | 1084 | 1098 | 797 | −287 | −301 |
  | 30 | 85 | 713 | 158 | 875 | 894 | 816 | −59 | −78 |
  | 36 | 91 | 668 | 160 | 831 | 850 | 824 | −6 | −26 |
  | 37 | 92 | 660 | 160 | 823 | 843 | 826 | 3 | −17 |
  | 38 | 93 | 652 | 160 | 816 | 836 | 827 | 12 | −8 |
  | 39 | 94 | 645 | 160 | 808 | 828 | 829 | 21 | 0 |
  | 40 | 95 | 637 | 160 | 800 | 821 | 830 | 30 | **9** |
  | 41 | 96 | 630 | 161 | 794 | 815 | 831 | 37 | 17 |
  | 42 | 97 | 623 | 161 | 787 | 808 | 833 | 45 | 25 |
  | 43 | 98 | 617 | 161 | 781 | 802 | 834 | 53 | 32 |
  | 44 | 99 | 610 | 161 | 774 | 795 | 836 | 61 | 40 |
  | 45 | 100 | 603 | 161 | 768 | 789 | 837 | 69 | 48 |
  | 46 | 101 | 596 | 162 | 761 | 783 | 838 | 77 | 56 |

- **2026-11-08 EDU-EP08-SHEETS-R2.2 (Film, Draft fix round 1):** user verdicts on the R2.2 Draft page (`change` on three shots, all others ok). Frames read from `out/EDU-EP08-SHORT/clips/_draft_cut.mp4` (sheets `out/qa/ep08/r22/sh01.png`, `sh01-faces.png`, `sh03.png`, `sh03-arms.png`, `scope.png`, `sh05.png`). (1) S01-B05-SH01 face: `neutral` → `tired` → `scared` → `worried` with the mouth open throughout (SD13; cause of the smile: the `line` look mouth's upturned closed stroke). (2) S01-B05-SH03 stray arm lines: the `dry(p)` measuring pass inks opaque in paper grey (SD14); fix in `stage.ts` (Editor), also clears SH01, SH02, SH04. (3) S01-B05-SH05 redesigned from a glove macro to a high three-quarter two-shot with the gauge and lamp behind his helmet (SD15, `meas` from scratch run `out/qa/ep08/r22/sh05-meas.ts`), needle curve front-loaded (still < 20 %), her first softening face; SD07 superseded. (4) L13b caption ends at the cut G1696 (was 1698). Shot ranges, line frames, V02/L12/L13 timing, the L13 fade and the end silence unchanged; stable IDs kept. Fix round: [fixlist.md](fixlist.md). Review rows → ROWS-R2.3 (the R2.2 page was the Draft review).
- **2026-11-08 EDU-EP08-SHEETS-R2.3 (Film):** script R1.2 ending (L12 "ถ้าช่วยเร็วมาก… ก็อาจรอด", L13 "คุณจะอยากกลั้นหายใจไว้… แต่ในที่ที่ไม่มีอากาศ สิ่งที่ช่วยปอดคุณ คือหายใจออก", Boat-approved wording) re-timed to the Editor's R1.2 voice re-lock (timeline.json 1731 f; G0–1438 unchanged; helmet clear and exact zero G95–100 untouched). New [R2.3 re-time](#r23-re-time) table; Placement rows L12/L13, sound plan from G1482, caption plan (28 → 27 cues: L12a, L13a, L13b, L13c), shot map and the four B05 blocks updated (R2.2 values kept as superseded rows). SD16 S01-B05-SH03 re-staged (silent-beat chest lift with pressed lips, glove tightens, shoulders drop on "แต่"), SD17 S01-B05-SH04 exhale-keyed face without the smile, SD18 eye-open rule at cuts and in SH05 (`openEyesT` in `stage.ts`); SH05 brows open at 35 %. Code: `src/painted/edu08/shots/S01-B05-SH02.tsx` (N 58), `SH03.tsx` (N 99, `twoShot` takes an options object), `SH04.tsx` (N 69), `SH05.tsx` (eyes, brows), `stage.ts` (`openEyesT`); `clock.ts`, `cues.ts`, `index.ts` and audio left to the Editor. Stills (scratch entry `out/qa/ep08/r24/stills-index.tsx`, painted at shot-local L; G for the ambient clock still from the R2.2 `clock.ts` start, ≤ 4 f offset): sheets `out/qa/ep08/r24/sheet-sh03-sh04.png`, `faces.png`, `cz-sheet.png`; measure `out/qa/ep08/r24/measure.txt` (max AST head 334 px, SH04 L68). Review rows → ROWS-R2.4.
- **2026-11-08 EDU-EP08-SHEETS-R2.4 (Film):** script R1.3 (L11 "ปล่อยมันออกมา…" → "ปล่อยลมหายใจออกมา…", user, ER05) and the Editor's R1.3 voice re-lock (L11 voiced 1364–1400, +14 f; total 1731 → **1745 f**). Pure re-time, no new look. S01-B04-SH03 1340–1398 → **1340–1412** (72 f): lips part L0–9 unchanged, glitter stream L9–39 → **L9–53** (stops 7 f before L11's voiced end, as before; rate unchanged), thinning tail L53–72 (19 f as before), camera `u = L / 72` (same path, slower), tick 7 G1366 → **G1372**; code `src/painted/edu08/shots/S01-B04-SH03.tsx` (`N = 72`, `emit [9/30, 53/30]`). S01-B05-SH01–SH05 +14 start (lengths and all shot-local keys unchanged; header comments updated; anchors L12.maybe 1490, L13 1526/1574/1613/1653, voiced end 1675, hatch thud/last tick G1496, tick 8 G1447, stinger G1676, NG-S8 G1688, fade G1721–1744, last frame G1744). Placement, [R2.4 re-time](#r24-re-time) (with the ambient blink check: SH03's unforced blink moves L91–94 → L77–80, SH05's G1694 blink is stepped past), ring table, sound plan, caption plan (L11 cue 1364–1406), shot map and B04/B05 blocks updated; Editor row added. Evidence: stills `scripts/stills.mjs` of S01-B04-SH03 at L0/L24/L60/L71 (G1340/1364/1400/1411) with a Film preview timeline prop (scene 16 = 72 f, new L11 cue; `clock.ts` and `cues.ts` untouched), sheet `out/qa/ep08/r25/sheet-b04-sh03-r24.png` viewed; `meas` AST head 228 → 156 px (≤ 340), figure 502 px at the last frame (≥ 480). Review rows → ROWS-R2.5.
