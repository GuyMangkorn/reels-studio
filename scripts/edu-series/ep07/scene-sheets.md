# Timed scene sheets and index — EDU-EP07-SHORT (EDU-EP07-SHEETS-R1.1)

- **Deliverable:** `EDU-EP07-SHORT` · **Revision:** EDU-EP07-SHEETS-R1.1 (Film W5.1 revision, 2026-11-08; user answers Q1 = c, Q2 = a, Q3 = b) · **Status:** `ready-for-dev`, voice-timed: Boss may build plates from this revision, Editor may assemble the narration and the blockout. · **Timing:** `checked-with-audio` (line onsets and voiced lengths `measured` on the locked per-line files; word anchors inside a line `meas` where an energy pause locates them, `meas-w` where only Whisper character timing does, ±3 f).
- **Evidence:** runtime: none (no composition, no blockout) · audio: locked takes measured (energy floor −40 dBFS, 10 ms frames; Whisper large-v3-turbo word timing on each file, local, 0 API requests; script `measure.py` in the Film session scratchpad, not committed) and placed on paper, not assembled · render/samples: none · projection: a Python mirror of `kit/ycam.ts` (`orbitYCam`, `camSpace`, `camToPicture`, `camUnit`) and `edu07/space.ts` `spaceCam`, calibrated on LF01 (VEN head unit 149 px, CUS 253 px, CUS chin y 1129: identical to the W3 measure); values marked `meas` come from that run, all else `est` · audio/subtitle sync: none (frames computed, not rendered) · user approval: script R1.1, storyboard ROWS-R1 18/18 ok, look frames v2 (flat shadows, ring, pestle), voice lock 2026-11-08 (Kore A atempo 0.95, Aoede VEN, Algenib CUS); Q1 (c) longer opening, Q2 (a) keep the D01 take, Q3 (b) clock jumps in the cutaway (user, 2026-11-08); this sheet revision itself is not user-approved.
- **Inputs (by revision):** script **EDU-EP07-SCRIPT-R1.1** ([script.md](script.md)); fact-check [fact-check.md](fact-check.md) (W1.3 + recheck pass); brief **EDU-EP07-BRIEF-R1** ([film-brief.md](film-brief.md): VD01–VD18, set plans, spikes 1–8, N1–N10, sound direction); storyboard **EDU-EP07-ROWS-R1** ([storyboard.md](storyboard.md), rules R01–R09); look frames v2 and their built cameras ([build-notes.md](../build-notes.md) "ep07 W3 look frames v1/v2", `src/painted/edu07/scenes.ts`, `soi.ts`, `space.ts`); voice lock [voice-measure.md](voice-measure.md) "W4.2 full read, atempo 0.95".
- **Target:** worktree `agent-voice-gen-limits-364db3`, branch `claude/education-series-concepts-98f9d2` at `edab892` + uncommitted W3 files · 30 fps · `durationFrames` **1798** (59.93 s) · 1080×1920 · composition offset 0 (not registered; Editor, never in `src/Root.tsx`) · `video.ending: 'B_loop'`, `endHoldSec: 0`.
- **Baseline (link, not copied):** SET-SOI metres, SET-SPACE su, SET-GW gu, axes and owners per the [brief](film-brief.md#projection-contract-and-scale-baseline) as built in `soi.ts` / `space.ts`. Built anchors win over the brief's est values: VEN feet `VEN_AT` (0.20, 0, −0.86), CUS stool 1 `CUS_AT` (1.42, 0, 0.30), mortar (0.66, 0.89, −0.42), stool 2 (−0.75, 0, 0.55), `MOON_DIR` (−0.216, 0.322, −0.922) (az 13.2°, el 18.8°). Seated CUS (P31 on the 0.45 m stool): chin 0.89, head top 1.33 m (`meas`, LF01 calibration); standing VEN head top 1.66, chin 1.245; standing CUS top 1.76, chin 1.32; head unit = height / 4 × `camUnit`.
- **Camera lines:** street `cam: orbit(T, az, r, eye, pitch, f, hy)` = `soi.ts` `orbit()` (camera at T + r·(sin az, ·, cos az), height `eye`, pitch + = look up); `cam: pos (x, y, z), look az a, pitch p, f, hy` = a YCam at that position with yaw −a; space `cam: spaceCam(T, az, el, r, f, hy)` = `space.ts`. A move `a→b` eases in-out over the whole shot unless the block says otherwise.
- **Clocks:** `G` composition frame; shot-local `L` = G − shot start; ranges half-open `[start, end)`. Event clocks are pure functions of G or L (seek-safe); the ambient and seam clocks are defined [below](#story-clock-and-derived-values).
- **One shot = one timeline scene** (scene ID = shot ID); every join is a hard cut.

<a id="placement-rules"></a>
## Placement rules (Requirement for R1)

- **PL01 Stable:** shot IDs, order, beats, line assignment, casting, look and acceptance checks of ROWS-R1 stay. Only ranges, event frames and the camera values forced by projection move (deviations SD01–SD11).
- **PL02 Lines are not retimed:** each line file is placed whole (no atempo, no inner cut, no script change). Only the silence between lines is set by placement.
- **PL03 Gaps** (previous voiced end → next voiced onset): 0.30 s (9 f) default; **8 f (0.27 s) L05→L06, L06→L07 and L13→L14** (R1.1: they give back the 3 f that the longer opening costs); 0.25 s L03→D01; 0.20 s D01→D02 (banter); **1.50 s** L08→D03 (the stinger silence; 44 f); 0.53 s D03→L09 (the dog); **L01 onset at G16** (0.53 s of picture first; Q1 = c, user 2026-11-08; R1 G10). The generated gaps (0.34–0.83 s) are not used.
- **PL04 Shot starts:** a voice-led shot starts 4 f before its line's onset (D02 3 f). In-line cuts sit 4 f before the onset of "หายไป" (L01), "แปลว่า" (L07) and "ออกจาก" (L14). S01-B04-SH02 starts 6 f after L08's last voiced frame. S01-B05-SH03 ends on the last frame.
- **PL05 Tail:** 1.40 s from L14's last voiced frame to the end (42 f), the UT15 tag's minimum length; the camera is still for the last 30 f.
- **PL06 Rows:** [review-rows.json](review-rows.json) carries `start`/`end` (G frames) and `timingEstimated: false`; Thai text unchanged except two shots (SD06, SD08), which the page asks again.

<a id="total-runtime"></a>
## Total runtime

Frames are on the 30 fps grid (onset frame to last voiced frame, rounded up); measured seconds in brackets.

| Component | Count | Frames | Seconds |
| --- | --- | --- | --- |
| NAR speech (13 lines, voiced) | L01–L03, L05–L14 | 1412 | 47.07 (measured 46.88) |
| Dialogue speech (voiced) | D01 63 · D02 45 · D03 56 f | 164 | 5.47 (measured 5.43) |
| Head before L01 (Q1 = c) | 1 | 16 | 0.53 |
| Line gaps (PL03), excluding the stinger | 14 gaps, 6–15 f | 120 | 4.00 |
| Stinger silence L08 → D03 | 1 | 44 | 1.47 |
| Tail after L14 (UT15 tag; last 30 f still) | 1 | 42 | 1.40 |
| **Total** | 18 shots | **1798** | **59.93** |

- **Fits the 60 s Short limit with 2 f (0.07 s) to spare, without any overlap, script trim or retime.** No voice overlaps another voice; D01/D02 do not need to overlap picture or VO.
- **R1.1 arithmetic:** R1 1795 f + 6 f (L01 at G16, Q1 = c) = 1801 f; the first three gaps of the R1 shrink order (L05→L06, L06→L07, L13→L14) give back 1 f each (9 → 8 f) = **1798 f**. Every line from L06 on moves +5 f, from L07 on +4 f, L14 +3 f; L01–L05 and D01/D02 move +6 f.
- Why the coordinator's 63 s estimate shrinks: it counted the dialogue file lengths (7.00 s) instead of voiced speech (5.43 s, the takes carry 0.11–0.39 s of head and tail silence each) and kept the generated line gaps (7.08 s, now 4.00 s + the 1.47 s stinger).
- **The margin is 2 f.** Any later addition (a longer silence, a retake longer by 0.07 s, a tail beyond 1.4 s) breaks 60 s unless another gap gives the frames back. Remaining reserve, in order: the 9 f gaps D02→L05, L09→L10, L11→L12, L12→L13 to 8 f (−4 f); then the head back toward G10 (undoes Q1).

<a id="narration-placement"></a>
## Narration placement (Editor)

Place each file whole so its voiced onset lands on the `Onset G` frame: timeline start of the file (s) = Onset G / 30 − onset in file. Store root `~/ReelsStore/projects/EDU/audio/EDU-EP07-SHORT/` (paths as of 2026-11-08): NAR files `narration/lines/`; D03 `narration/2026-11-08_ep07-D03-lvl16.wav`; **D01 and D02 are the audition takes `narr-samples/ep07-aud-CUS-1.wav` and `narr-samples/ep07-aud-VEN-1.wav`** (byte-identical to the worktree cache `out/ep07-voice/full95/D01.wav`, `D02.wav`: md5 checked 2026-11-08, so the onsets D01 0.11 s and D02 0.16 s hold). Still missing from the store: `nar95-lines.json` (worktree `out/ep07-voice/full95/lines.json`); Editor files it before the worktree goes.

| Line | File | Onset in file (s) | Onset G | Last voiced G | File start on timeline (s) | Voiced (s) |
| --- | --- | --- | --- | --- | --- | --- |
| L01 | `narration/lines/2026-11-08_ep07-nar95-L01.wav` | 0.06 | 16 | 138 | 0.473 | 4.04 |
| L02 | `narration/lines/2026-11-08_ep07-nar95-L02.wav` | 0.06 | 146 | 166 | 4.807 | 0.64 |
| L03 | `narration/lines/2026-11-08_ep07-nar95-L03.wav` | 0.06 | 174 | 269 | 5.740 | 3.16 |
| D01 | `narr-samples/ep07-aud-CUS-1.wav` (Algenib) | 0.11 | 276 | 339 | 9.090 | 2.10 |
| D02 | `narr-samples/ep07-aud-VEN-1.wav` (Aoede) | 0.16 | 345 | 390 | 11.340 | 1.49 |
| L05 | `narration/lines/2026-11-08_ep07-nar95-L05.wav` | 0.06 | 399 | 574 | 13.240 | 5.82 |
| L06 | `narration/lines/2026-11-08_ep07-nar95-L06.wav` | 0.06 | 582 | 747 | 19.340 | 5.49 |
| L07 | `narration/lines/2026-11-08_ep07-nar95-L07.wav` | 0.06 | 755 | 974 | 25.107 | 7.28 |
| L08 | `narration/lines/2026-11-08_ep07-nar95-L08.wav` | 0.06 | 982 | 1049 | 32.673 | 2.21 |
| D03 | `narration/2026-11-08_ep07-D03-lvl16.wav` (Algenib) | 0.20 | 1093 | 1149 | 36.233 | 1.84 |
| L09 | `narration/lines/2026-11-08_ep07-nar95-L09.wav` | 0.06 | 1164 | 1240 | 38.740 | 2.53 |
| L10 | `narration/lines/2026-11-08_ep07-nar95-L10.wav` | 0.06 | 1249 | 1327 | 41.573 | 2.58 |
| L11 | `narration/lines/2026-11-08_ep07-nar95-L11.wav` | 0.06 | 1335 | 1425 | 44.440 | 3.00 |
| L12 | `narration/lines/2026-11-08_ep07-nar95-L12.wav` | 0.06 | 1434 | 1513 | 47.740 | 2.63 |
| L13 | `narration/lines/2026-11-08_ep07-nar95-L13.wav` | 0.06 | 1522 | 1614 | 50.673 | 3.06 |
| L14 | `narration/lines/2026-11-08_ep07-nar95-L14.wav` | 0.06 | 1622 | 1756 | 54.007 | 4.44 |

**Word anchors** (G; `meas` = end of an energy pause, `meas-w` = Whisper character onset, ±3 f; R1.1 = R1 + the line shift): "หายไป" 37 `meas-w` · "ตอนนี้" 45 `meas-w` · "คุณจะ" 69 `meas` · "ราว 8 นาที" 216 `meas-w` · "ร้อน" (D01) 304 `meas-w` · "ตามทฤษฎี" 460 `meas` · "แรงโน้มถ่วง" 506 `meas` · "ก็เร็วเท่าแสง" 551 `meas` · "จากดาวนิวตรอน" 683 `meas` · "ชนกัน" 722 `meas-w` · "มาถึง" 828 `meas` · "แปลว่า" 907 `meas` · "ศูนย์" **1002** `meas-w` · "ฟ้าก็มืดลง" 1022 `meas` · "ไฟดับเหรอ" 1121 `meas` · "พุ่งไปตรง ๆ" 1210 `meas` · "ดวงจันทร์" 1292 `meas` · "ดับตาม" 1308 `meas-w` · "ยังสว่างต่อ" 1367 `meas` · "ไปถึงมันก่อน" 1451 `meas-w` · "แล้วสะท้อนกลับมา" 1482 `meas` · "ดาวทุกดวง" 1544 `meas` · "ออกจาก" 1685 `meas` · "ที่แล้ว" 1743 `meas-w`. **Editor confirms "ศูนย์" on the waveform** (the sibilant after "ถึง", no pause between them) before the clock's 00:00 frame is final (spike 3, ± 1 f); if it moves, the clock constants below move with it, nothing else.

<a id="story-clock-and-derived-values"></a>
## Story clock and derived values

- **Clock card (VD07, screen space, box x 700–1020, y 160–280; R1.1 = Q3 option b, user 2026-11-08).** One visible rate **v = 30 / 99 story-s per frame (9.09×)**; the hidden 2017 cutaway eats the rest. Story clock `clk(G)` (story-seconds, exact fractions, seek-safe):
  - G [170, 578) visible: `clk = 499 − 30 · (G − 170) / 99`;
  - G [578, 903) hidden (card not drawn; B03-SH02/SH03): linear from clk(578) = 375.36 to 30 over 325 f (≈ 31.9×, never seen);
  - G [903, 1002] visible: `clk = 30 · (1002 − G) / 99`; clk = 0 from G1002.
  - Shown as `mm:ss` of **`ceil(clk)`** (countdown convention; R1 rounded half up, which at 9× would show 00:00 one frame early on G1001). Compute `ceil` on the integer numerators (`30 · (1002 − G)` over 99), not floats.
  - **Card table (G → shown):** 170 **08:19** (pop-in 6 f) · 175 08:18 · 271 07:49 · 272 07:49 · 341 07:28 · 342 07:27 · 394 07:12 · 395 07:11 · 577 06:16 (last visible frame before the cutaway) · *hidden 578–902* · **903 00:30** (holds 903–906) · 907 00:29 · 977 00:08 · 978 00:08 · 1000 00:01 · 1001 00:01 · **1002 00:00** on "ศูนย์".
  - Visible in B02-SH01 … B03-SH01 and B03-SH04 … B04-SH01 (hidden in the cutaway B03-SH02/SH03); ▸▸ glyph on until G1002; holds "00:00" G1002–1335 where shown (B04-SH01 only: hidden in B04-SH02 … B04-SH04, full-frame night and space shots, so the 00:00 hold reads in the split); reappears at 00:00 on G1331 (B04-SH05 L0) and flips to "+1 ชม." G1335–1343 (8 f card turn), held in B04-SH05/SH06; hidden from G1518.
- **Progress** `q(G) = (499 − clk(G)) / 499` (0 at G170, 0.2477 at G577, 0.9399 at G903, 1 at G1002); the ring and Earth ride on it, so they jump with the card inside the hidden cutaway and agree with it in every visible frame.
- **News-front ring (VD08, user LF02 decision: exaggerated; SD11):** `R(G) = 0.10 + (R_meet − 0.10) · q(G)` su for G in [170, 1002], with `R_meet = 1 − EARTH_R · earthK` = **0.89** in the split (`space.ts` `EARTH_R` 0.11, earthK 1): the ring front reaches **Earth's near limb** on G1002. In B01-SH02 it grows 0 → 0.10 linearly from the blink (G45) to G170. The dash stream's tail sits on the ring. From G1002 the front crosses the disc with the day-side wipe, R 0.89 → 1.11 linear over G1002–1012, then the ring fades out over G1012–1022 (`est`, Film decision). Values: G170 0.10 · G271 0.15 · G395 0.21 · G577 0.30 · G903 0.84 · G977 0.88 · G1002 0.89.
- **Earth on the orbit:** `φ(G) = −60° + 15° · q(G)` (`earthAt(φ)`), −60° until G170; −59.1° at G271, −58.0° at G395, −56.3° at G577, −45.9° at G903, −45.2° at G977, −45° at G1002; from then on the tangent (B04-SH03).
- **Pestle clock (ambient, VEN):** `P(G) = frac((G + 12.8) / 18)`, stroke `= 0.5 − 0.5 · cos(2π · P)` (0 = tip in the mortar, 1 = raised; `soi.ts` `stroke`), period 18 f = **100 bpm, the NG-M1 tempo**. G0 stroke 0.62 (= LF01). Contact (stroke 0) frames: G ≡ 5 (mod 18) in B01–B04 (absolute G: unchanged by the R1.1 shift; only shot-local frames move). At 00:00 (stroke 0.86 on G1002) she rises to the top (G1004, stroke 1.00) and **freezes there** through B04-SH02 (breath runs). B05 uses the seam clock.
- **Seam clocks (R09, `B_loop`):** in S01-B05-SH02/SH03 every ambient clock runs on `G − 1797` (pestle `P(G − 1797)`, breath, twinkle, cable sway), so G1797 (the last frame) equals G0. Pestle contacts there: G1622, 1640, 1658, 1676 (off frame), 1694, 1712, 1730, 1748, 1766, 1784. **CUS rig time = ambient t + 1.3 s everywhere** (the `man-crop` blink lands on t 0; LF build note), so his eyes are open on G0 and G1797.

<a id="staging-deviations"></a>
## Staging deviations (Film decisions, from the projection run and the built set)

These win over the brief/storyboard est values; the brief owns everything not listed.

- **SD01 Pose A and its shots use the built LF01 camera** `POSE_A = orbit((0.50, 1.05, −0.40), az 23, r 3.70, eye 1.30, pitch 5, f 1480, hy 770)` (W3 tuning, brief deviation (4)), not the brief's r 2.80 / f 1050. B01-SH01 pushes from it, B05-SH03 lands on it.
- **SD02 B01-SH01 tilt** 8 f, pitch 5° → 30° (brief 12 f to 40°): at 40° the Moon falls to y 1339 (caption band); at 30° it is at y 1057 (`meas`). The shot is **33 f (1.10 s)**: L01 starts at G16 (Q1 = c, user 2026-11-08; R1 27 f) and the cut sits 4 f before "หายไป"; the tilt keeps its 8 f, so the soi holds 25 f.
- **SD03 D01 close** `orbit((1.42, 1.00, 0.30), az 10→14, r 1.60→1.52, eye 1.05, pitch 0, f 1050, hy 800)`: at the brief's hy 900 his near forearm sits at y 1208 (band); at hy 800 it is at y 1134→1150, head unit 289→304 px (`meas`).
- **SD04 D02 close** `orbit((0.20, 1.30, −0.86), az 18→14, r 1.70→1.58, eye 1.35, pitch 0, f 1050, hy 740)`: at hy 860 the mortar mouth (the contact) is at y 1225–1268 (band); at hy 740 it is at y 1109→1143, head unit 256→276 px (`meas`).
- **SD05 Behind-the-two (B04-SH04/SH05)** `pos (1.10, 1.55, 2.70)`, f 950, hy 880 (SH04) / 820 (SH05), pitch 5–8° / 4° (brief pos (1.20, 1.35, 2.90), pitch +20–26°, hy 1250): the brief's camera puts both heads at y 1413–1762 (below and in the caption band) and the Moon at y 1270–1370 (`meas`). The raised eye separates the heads from the Moon: Moon y 647→699 above heads at y 866–969 (`meas`).
- **SD06 B04-SH05 pans right, not left:** "yaw −14° from the Moon direction" turns the view toward +x (look az −0.8°). The left pan (az 27°) puts CUS off frame right (x 1239–1281 `meas`). Row text changed from "แพนซ้าย" to "แพนขวา" (the page asks again for this shot).
- **SD07 Stool 2 for the +1 h state:** VEN's stool is moved to (0.60, 0, 0.45) beside CUS for B04-SH05 and B05-SH01 (the time skip hides the move); the day set keeps stool 2 at (−0.75, 0, 0.55). Jupiter's fixed sky direction `JUP_DIR` (0.032, 0.425, −0.905) (az −2.0°, el 25.2°) is chosen so it sits centred above the pair at the end of B04-SH05 (560, 430).
- **SD08 Clock at the return (B03-SH04), R1.1:** the card returns at **00:30** on the shot's first frame (G903) and R02 holds as written (card ≤ 00:30); R1's one constant rate (17.95×, return at 00:59) is withdrawn by the user's Q3 = b. Cost: the visible rate is 9.09× in every shot that shows the card (B02-SH01 … B03-SH01, B03-SH04, B04-SH01), and the hidden cutaway (G578–903) jumps 06:15 → 00:30. The ring and Earth ride the same clock (they jump inside the cutaway too), so no visible frame disagrees. Row text of S01-B03-SH04 back to the card at 00:30.
- **SD09 B05-SH01 tilt** pitch 0° → 35° with a pan az 23° → 18°, f 1150, hy 900 (brief pitch 10° → 55°, f 950, hy 980): at the brief's start the seated heads sit in the caption band (y 1170–1203); at 55° Jupiter leaves the frame bottom. On these values Jupiter travels from the right edge to (919, 1071) on the last frame (`meas`).
- **SD10 B05-SH03** starts at az 19°, r 3.50 (brief r 2.45 scaled to pose A would be 3.24, which puts CUS's chin at y 1171 in the band; at 3.50 it is y 1144 `meas`).

- **SD11 Ring meets Earth's limb, not its centre (R1.1):** with the Q3 clock the ring would already be at 0.95 su on the return (inside Earth's disc, radius 0.11 su in the split); R1's formula aimed the ring at Earth's centre (R 1.0) and so overlapped the disc from about 0.89 on. The ring now reaches the near limb (`R_meet` 0.89) exactly on G1002 and crosses the disc with the day-side wipe ([ring](#story-clock-and-derived-values)); "just short of Earth" holds through B03-SH04 (0.84 → 0.88).

<a id="sound-plan"></a>
## Sound plan (whole video; per-shot cues in the shot blocks)

Library re-checked 2026-11-08 at `~/ReelsStore/library/sound/INDEX.md` (228 lines, unchanged since the brief): every library ID below exists; all are generated and "not listened" (Editor ear-checks before use). One addition to the brief's fallbacks: `creature_dog-bark-happy_01` (single golden-retriever bark, 1.14 s) as a last-resort NG-S7 stand-in, low-passed, reverberant and quiet (wrong character: happy, close). Sound never carries a fact.

| Layer | Source | Global use (G) |
| --- | --- | --- |
| Street theme | **NEEDS-GEN NG-M1** sunny ukulele + soft shaker, **exactly 100 bpm, 30.00 s = 900 f = 50 beats**, seamless loop (fallback `bed_curious-explainer-light_01`, 95 bpm: then the pestle period becomes 19 f, Editor's call) | 0–33 full; under the pad 33–166; 166–578 full (thinner from 395); 903–1002 thin; **out at 1002**; 1618–1798 full, loop placed so its loop point lands on G1798 (loop position at G1618 = 720 f) |
| Street ambience | **NEEDS-GEN NG-A1** sunny soi afternoon, 12 s loop (fallback `crowd_murmur-far-bangkok_01`) | as the theme; out at 1002; hard return 1618 |
| Space pad | **NEEDS-GEN NG-A3** thin airy space pad, 8 s (fallback `bed_underwater-mystery-sparse_01`, high-cut) | 33–170; 578–903 |
| Clock tick | `ui_click-tick_01`, softened, low-passed, sequenced | every 20 f G170–395; every 15 f G395–578; out in the cutaway; every 10 f G903–993; none on/after 1002 |
| Riser | `reveal_riser-tension_01` (3.69 s, stops dead at its peak) | starts G903 from file offset 0.40 s, **ends dead on G1002** |
| Silence | — | **G1002–1093: no music, no ambience, no SFX** (VO L08 alone to G1049, then 44 f of nothing) |
| Night air | **NEEDS-GEN NG-A2** still night street air, no insects, 10 s loop (fallback `outdoor_wind-open-roundabout_01`, very low) | in G1093–1105 (12 f), under D03; low under B04-SH04/SH05 and B05-SH01 |
| Cold pad | **NEEDS-GEN NG-M2** cold sparse slow pad, glass harmonics, 20 s (fallback `bed_edu05-cold-theme_01`) | G1160–1518 |
| Jupiter tone | `tone_thin-unresolved_01` | G1353–1548 (fades 1518–1548) |
| Warm pad | **NEEDS-GEN NG-M3** the M2 pad warmed, 8 s (fallback `tone_soft-sustain-reflective_01`) | G1518–1618 (crossfade from M2 over 12 f), hard out on the cut 1618 |
| End tag (UT15) | `stinger_pizz-tag-ending_01`, trimmed to **1.40 s**, peak about −10 dB, fade 0.6 s | onset **G1756** (L14's last voiced frame), fade 1780–1798, finished on the last frame; NG-M1 ducks −8 dB under it from 1756 and rises back to its B01 level by G1797 |
| One-shots | see shot blocks: NG-S1 pestle, NG-S2 pop, NG-S3 fan, NG-S4 motorbike, NG-S5 whomp, NG-S6 ping, NG-S7 dog; `impact_sub-hit-short_01`, `reveal_glass-shimmer-soft_01`, `whoosh_air-swish-rising_01` (optional) | per shot |

**NEEDS-GEN changes from the brief (Film, timing-driven):** NG-M1 is an exact 100 bpm, 900 f loop (the pestle period is 18 f and the seam lands on a loop point); NG-S1 becomes **single pestle thocks** (2–3 variants, ~0.3 s each, wooden pestle in a clay mortar with papaya crunch, close, dry) placed on the contact frames, not a 4 s loop; NG-S7 becomes **one distant dog, a quick double bark inside 0.45 s, short reverberant tail** (the slot after D03 is 15 f; it was "barking twice, 2 s").

**Mix intent (EP08a):** B01 hold → drop on the cut to space (duck) → lift back on L02's end; B02 hold (oblivious); B03 hold, two soft hits (merger, flash), lift on the riser; B04 **silence = the hit**, then release into the cold pad, small hits on the Moon shimmer and Jupiter tone; B05 warm lift, hard return (hit) on the sun, release into the tag and the seam.

<a id="caption-plan"></a>
## Caption plan

White captions with the edu stroke, no band (series default; user 2026-11-06), `captionStyle.bottomEdgeY` 1344, band y 1176–1344, ≤ 2 lines, break after "…" when a cue wraps; `video.chrome` `@TamMaiLa` top-left; no other text except the card (R01). Cue = `[phrase onset, last voiced frame + 6)`, capped at the next cue's onset; text verbatim from the script. Subtitle digits as written ("2017", "130", "8", "20").

| Cue | G [start, end) | Thai |
| --- | --- | --- |
| L01a | 16–69 | ถ้าดวงอาทิตย์หายไปตอนนี้… |
| L01b | 69–144 | คุณจะยังไม่รู้ตัวไปอีก 8 นาที |
| L02 | 146–172 | แค่สมมตินะ |
| L03 | 174–275 | แสงแดดเดินทางมาถึงโลก… ราว 8 นาที 20 วินาที |
| D01 | 276–345 | ร้อนจังวันนี้ |
| D02 | 345–396 | พรุ่งนี้ร้อนกว่านี้อีก |
| L05a | 399–460 | โลกยังโคจรต่อด้วย… |
| L05b | 460–506 | ตามทฤษฎีของไอน์สไตน์ |
| L05c | 506–580 | แรงโน้มถ่วงที่เปลี่ยนไป… ก็เร็วเท่าแสง |
| L06a | 582–683 | ปี 2017 นักวิทย์จับคลื่นความโน้มถ่วงกับแสง… |
| L06b | 683–753 | จากดาวนิวตรอนสองดวงชนกันได้ |
| L07a | 755–828 | เดินทางมา 130 ล้านปี… |
| L07b | 828–907 | มาถึงห่างกันไม่ถึง 2 วินาที… |
| L07c | 907–980 | แปลว่าคลื่นนี้เร็วเท่าแสงแทบเป๊ะ |
| L08 | 982–1055 | พอนาฬิกาถึงศูนย์… ฟ้าก็มืดลง |
| D03 | 1093–1155 | เอ้า… ไฟดับเหรอ |
| L09 | 1164–1246 | โลกหลุดวงโคจร… พุ่งไปตรง ๆ |
| L10 | 1249–1333 | อีกไม่กี่วินาที… ดวงจันทร์ดับตาม |
| L11 | 1335–1431 | แต่ดาวพฤหัสบดี… ยังสว่างต่ออีกราวชั่วโมงกว่า |
| L12 | 1434–1519 | เพราะแสงต้องไปถึงมันก่อน… แล้วสะท้อนกลับมา |
| L13 | 1522–1620 | ที่จริง… ดาวทุกดวงที่คุณเห็น คือภาพในอดีต |
| L14a | 1622–1685 | และแสงแดดที่โดนตัวคุณอยู่ตอนนี้… |
| L14b | 1685–1762 | ออกจากดวงอาทิตย์มาตั้งแต่ 8 นาทีที่แล้ว |

- Captions cross cuts where the cue does (L03 ends 3 f into D01's shot, etc.); no cue during the stinger silence or the last 36 f.
- **D01 take (Q2 = a, user 2026-11-08):** the take stays as recorded (Whisper hears "อื้ย… ร้อนจังวันเนี่ย", a ~0.7 s sigh before "ร้อน" at G304); the caption stays the script text "ร้อนจังวันนี้" and starts at the take's onset G276.
- **Open check (Editor, W5.3):** the stroke captions sit on bright picture in LF01 (band mean 0.62 / p95 0.76) and LF02 (0.66 / 0.87). Editor verifies legibility on real caption frames of B01-SH01, B02-SH01 and B05-SH03 with `scripts/caption-zone.py --band 1176:1344` and a viewed sheet; if a cue is not legible, report to the user (no darkening or band move on your own).

## Shot map

| Shot | Beat | G [start, end) (len) | Brief est | Voice | Claims / clues |
| --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | B01 | 0–33 (33) | 1.6 s | L01a | C01/C02 hook; CL03 plant |
| S01-B01-SH02 | B01 | 33–170 (137) | 3.9 s | L01b, L02 | C01/C02; C04 premise |
| S01-B02-SH01 | B02 | 170–272 (102) | 3.7 s | L03 | C01; CL01 plant |
| S01-B02-SH02 | B02 | 272–342 (70) | 1.5 s | D01 | dramatization; CL03 (arm in frame) |
| S01-B02-SH03 | B02 | 342–395 (53) | 1.7 s | D02 | dramatization (irony) |
| S01-B03-SH01 | B03 | 395–578 (183) | 4.9 s | L05 | C03/C11 `hedge` |
| S01-B03-SH02 | B03 | 578–751 (173) | 5.0 s | L06 | C05 (corrected) |
| S01-B03-SH03 | B03 | 751–903 (152) | 3.7 s | L07a | C05: ripple first, < 2 s |
| S01-B03-SH04 | B03 | 903–978 (75) | 2.4 s | L07b | C05 (waves only) |
| S01-B04-SH01 | B04 | 978–1055 (77) | 2.4 s | L08 | C06 `hedge` |
| S01-B04-SH02 | B04 | 1055–1160 (105) | 3.0 s | silence, D03 | dramatization |
| S01-B04-SH03 | B04 | 1160–1245 (85) | 2.4 s | L09 | C03 (tangent) |
| S01-B04-SH04 | B04 | 1245–1331 (86) | 2.6 s | L10 | C07 `hedge` |
| S01-B04-SH05 | B04 | 1331–1430 (99) | 3.7 s | L11 | C08 (corrected); CL02 |
| S01-B04-SH06 | B04 | 1430–1518 (88) | 2.8 s | L12 | C08 reason; CL02 |
| S01-B05-SH01 | B05 | 1518–1618 (100) | 3.0 s | L13 | C10 |
| S01-B05-SH02 | B05 | 1618–1681 (63) | 2.5 s | L14a | C09; CL03 payoff |
| S01-B05-SH03 | B05 | 1681–1798 (117) | 3.7 s | L14b, tail | C09; `B_loop` seam |

---

## Shot sheets

Picture intent per shot is the row's `seen` text in [review-rows.json](review-rows.json) and its look frame; the blocks add numbers. Rules R01–R09 of the [storyboard](storyboard.md#rules-carried-from-the-brief-and-fact-check-every-shot) apply to every shot (R02 as written; the R1 SD08 amendment is withdrawn). Casting (brief VD02/VD03): VEN **`woman-ponytail + vendor`**, CUS **`man-crop`**, both flat cards squared to the shot camera (`squareToCam`), painted by `paintSoi` / `paintPerson`. Day = `paintSoi(…, {night: 0})`, night = `{night: 1}`; shadows flat (v2, user 2026-11-08; the watercolour POC is not adopted). Card, captions and chrome are screen space.

### S01-B01-SH01 · 0–33 · LF01 the sunny soi, whip-tilt (L01a)

- **Time:** L01 onset L16 ("ถ้าดวงอาทิตย์…"; Q1 = c); the cut at L33 is 4 f before "หายไป" (G37).
- **Staging (SET-SOI m, day):** VEN at `VEN_AT`, `front`, **`woman-ponytail + vendor, new: pound-pestle, happy`**, pestle on `P(G)` (stroke 0.62 at L0, contacts L5, L23; fist grip v2). CUS at `CUS_AT` on stool 1, `front`, **`man-crop, P31, tired`**, near forearm on his knee in full sun (CL03, not featured; y 1320 `meas`, in the band as in LF01). Quarter Moon at `MOON_DIR` (screen (790, 400) at L0).
- **Camera:** `cam: POSE_A` at L0 → push `orbit((0.50, 1.05, −0.40), az 23→22, r 3.70→3.60, eye 1.30, pitch 5, f 1480, hy 770)` over L0–33; tilt pitch 5° → 30° over L25–33, ease-in (SD02). `meas` L0: VEN head unit 149 px, CUS 253 px (lead visible 883→1650 = 767 px), CUS chin y 1129; L25 (tilt start): VEN ≈ 155, CUS ≈ 268 px (`est`: R1 measured these at the tilt start of the 27 f push; the 33 f push is at a slightly later fraction); last frame L32: bright sky, Moon ≈ (787, 1057) (`meas` R1), no Sun.
- **Sound:** NG-A1 and NG-M1 at full B01 level from L0 (loop position as at the seam); NG-S1 thock L5, L23; `whoosh_air-swish-rising_01` very soft from L23 (optional). Mix: hold.
- **Entry → exit:** G0 = the loop frame (identical to G1797) → whip into empty bright sky; the cut is on the motion.
- **Accept:** spike 1 at L0–24 (place in one second at 270 px: stall, VEN, CUS); no Sun in any frame; CUS's eyes open on L0.

### S01-B01-SH02 · 33–170 · LF04 the Sun blinks out (L01b, L02)

- **Time:** "หายไป" L4; **"ตอนนี้" L12 = blink**; "คุณจะ" L36; L01 ends L105; L02 "แค่สมมตินะ" L113–133.
- **Staging (SET-SPACE su):** Sun disc `SUN_R` at the origin with halo; Earth at `earthAt(−60°)` (0.50, 0, 0.87), `earthK` 1.4 (LF04 v2), day side toward the origin; orbit polyline R 1.0; ENV-STARS; light dashes flowing to Earth. Blink: bloom (halo × 1.4) L12–13, disc gone from L14, halo collapses L14–21. From L14 the spot is empty, the dash stream keeps flowing to Earth, its tail and the ring grow 0 → 0.10 su by L137 ([ring](#story-clock-and-derived-values)); Earth stays lit.
- **Camera:** `cam: spaceCam(T_SPACE (0.30, 0, 0.30), az 1.5→3, el 46, r 2.15→2.10, f 880, hy 940)` (= `camLF04` at L0; brief r 3.00→2.85, el 32: W3 values win). `meas` L0: Sun (431, 858), Earth (633, 1146); end Earth (628, 1152). Earth's lower edge (r ≈ 77 px) dips into the band behind L01b/L02 captions, as in the approved LF04: Editor checks legibility there.
- **Sound:** on the cut L0 street + NG-M1 duck to NG-A3 over 3 f; **NG-S2 pop L12** (fallback `ui_pop_01` + `reveal_reverse-swell-airy_01`); street + ukulele fade back L133–137 (full on the cut). Mix: drop, then lift.
- **Entry → exit:** Sun present 12 f → empty spot, Earth lit, ring 0.10.
- **Accept:** the Sun is visible L0–11 and gone from L14; the empty spot reads as "where the Sun was" (orbit centred on it); no clock card.

### S01-B02-SH01 · 170–272 · LF02 split frame, the card at 08:19 (L03)

- **Time:** L03 L4–99; "ราว 8 นาที 20 วินาที" L46. Card pop-in L0–6 at **08:19** (`clk` 499); on L101 the card reads 07:49 (9.09×, Q3).
- **Staging:** split (VD06, seam y 760, cream 3 px). Space panel: empty spot, Earth sliding `φ(G)` (−60° → −59.1°), ring 0.10 → 0.15 su, dashes beyond the ring flowing to Earth. Street panel: the B01 day state (VEN pounding on `P(G)`, CUS waiting).
- **Camera:** space `cam: spaceCam((0.20, 0, 0.18), az 2→4, el 40, r 2.15, f 740, hy 430)` (= `camLF02Space` at L0; `meas` spot (478, 391), Earth (666, 635), above the seam); street `cam: orbit(T_STALL (0.45, 1.05, −0.35), az 30→28, r 3.80, eye 1.30, pitch 4, f 900, hy 960)` (= `camLF02Street`; `meas` VEN head unit 88 px, CUS 149 px, CUS visible 1013→1465 = 452 px: under the 480 px lead rule, accepted for the two-world wide, user-approved LF02).
- **Sound:** NG-M1 + NG-A1 full; tick every 20 f from L0 (G170, 190 … 270), low; NG-S1 soft at the street-panel contacts (G185, 203 … 257).
- **Entry → exit:** card appears at 08:19 → 07:49; ring just off the spot → 0.15.
- **Accept:** spike 2 (two worlds in one second at 270 px); spike 3 part 1 (first card frame 08:19); the card box does not overlap the orbit or Earth.

### S01-B02-SH02 · 272–342 · CUS fans himself (D01)

- **Time:** D01 L4–67 ("ร้อน" L32 `meas-w`; take kept, Q2 = a). Card visible, 07:49 → 07:28.
- **Staging:** CUS `man-crop, P31 + new: fan-self, tired` → `talk` from L4: right hand fans a folded paper menu near his face (screen (515, 786) at L0), 3 flaps/s from L6; near forearm on his knee in the sun at frame lower left (y 1134→1150 `meas`). VEN soft behind at screen left (x 185, head top 583), pounding on `P(G)`.
- **Camera:** SD03 `cam: orbit((1.42, 1.00, 0.30), az 10→14, r 1.60→1.52, eye 1.05, pitch 0, f 1050, hy 800)`. `meas` CUS head top 616→607, chin 905→911, head unit 289→304 px.
- **Sound:** NG-S3 fan flaps from L6 (1.5 s); NG-A1, NG-M1 under; tick on the 20 f grid (G290, 310, 330); NG-S1 soft (G275, 293, 311, 329). Dialogue dry and close.
- **Accept:** head unit ≥ 280 px; the arm in frame but not centred, above y 1160; the fan never covers his mouth on the line.

### S01-B02-SH03 · 342–395 · VEN grins (D02)

- **Time:** D02 L3–48. Card 07:27 → 07:12.
- **Staging:** VEN `woman-ponytail + vendor, new: pound-pestle, talk` with a grin, head turned toward +x (CUS off screen right); pestle on `P(G)`, contacts L5, L23, L41 (G347, 365, 383).
- **Camera:** SD04 `cam: orbit((0.20, 1.30, −0.86), az 18→14, r 1.70→1.58, eye 1.35, pitch 0, f 1050, hy 740)`. `meas` head unit 256→276 px, chin y 805→810, mortar mouth (818, 1109)→(883, 1143).
- **Sound:** NG-S1 close on each contact; tick (G350, 370, 390).
- **Accept:** pestle head meets the mortar mouth ±4 px on each contact frame, never through the rim; face ≥ 270 px by L30.

### S01-B03-SH01 · 395–578 · Earth keeps curving (L05)

- **Time:** L05 L4–179; "ตามทฤษฎีของไอน์สไตน์" L65; "แรงโน้มถ่วง…" L111; "ก็เร็วเท่าแสง" L156. Card 07:11 → 06:16.
- **Staging:** split as B02-SH01. Earth `φ` −58.0° → −56.3°, ring 0.21 → 0.30 su (Earth and ring never touch). Street: a small motorbike (`new: motorbike-pass`, no rider face) crosses the road at z +3.5 from x +8 to x −6 over L31–67 (G426–462), inside L05's first pause (G443–460) at its nearest; fallback: sound only.
- **Camera:** space az 4→8 (else as B02-SH01); street az 28→26 (else as B02-SH01).
- **Sound:** tick every 15 f, +2 dB (G395, 410 … 575); NG-S4 motorbike, Doppler peak G446 (fallback inside `crowd_murmur-close-bangkok_01`); NG-M1 a little thinner from L0.
- **Accept:** Earth on the orbit polyline ±2 px every frame; the motorbike never crosses a face or the card.

### S01-B03-SH02 · 578–751 · 2017: the merger (L06)

- **Time:** L06 L4–169; "จากดาวนิวตรอน" L105; **"ชนกัน" L144 = merge**. No card: the story clock jumps 06:15 → 00:30 unseen across B03-SH02/SH03 (Q3).
- **Staging (SET-GW gu):** two neutron stars r 0.05 spiral in, separation 0.50 → 0 over L0–144, accelerating (separation ∝ (1 − L/144)^0.25); faint ripple rings every 12 f during the inspiral; at L144 the stars merge, a strong violet ripple ring leaves; **gold-white flash at L150** (6 f later, the brightest frame); ring and flash expand to the frame edge by the last frame L172.
- **Camera:** `cam: spaceCam(origin, az 0→6, el 20, r 2.0→1.8 gu, f 900, hy 900)` (brief values, `est`: SET-GW is not built; Boss keeps the merge point above y 1100).
- **Sound:** on the cut L0 street, ukulele and tick duck to NG-A3; `impact_sub-hit-short_01` placed so its peak lands on L144 (Editor reads the file's peak offset); **NG-S5 whomp L144**. Mix: soft hit.
- **Accept:** the ripple ring is visible before the flash (6 f); stylised, no data look, no number; nothing in the caption band.

### S01-B03-SH03 · 751–903 · the race to Earth (L07a)

- **Time:** L07 onset L4 ("เดินทางมา 130 ล้านปี…"); **"มาถึง" L77 = ripple touches Earth; flash arrives L83**; "…วินาที…" ends near L130; the cut at L152 is 4 f before "แปลว่า".
- **Staging (SET-GW gu):** a violet ripple arc and a gold flash arc travel left → right across the star field toward a tiny Earth (r 0.04) at x 6.0, the flash ≈ 2 % of the path behind; ripple front at x 6.0 on L77, flash front on L83; after arrival both pass Earth and fade by L120.
- **Camera:** `cam: truck x 0.5→5.6 gu with the fronts, z 2.2, eye y 0.3, yaw 0, f 900, hy 960`, ease-out arriving L77, static after (`est`).
- **Sound:** NG-A3 pad swell under the travel; **NG-S6 ping L83** (fallback `reveal_glass-shimmer-soft_01` trimmed). Mix: soft hit.
- **Accept:** order ripple → flash, gap small, never a "together" frame; no number on screen.

### S01-B03-SH04 · 903–978 · back to two worlds (L07b)

- **Time:** "แปลว่าคลื่นนี้เร็วเท่าแสงแทบเป๊ะ" L4–71. Card **00:30 → 00:08** (00:30 holds L0–3; SD08, Q3 = b).
- **Staging:** split; ring 0.84 → 0.88 su, just short of Earth's near limb at 0.89 (SD11; φ −45.9° → −45.2°); street unchanged (day, pounding; contacts G905, 923, 941, 959, 977).
- **Camera:** space az 8→10; street az 26, static.
- **Sound:** NG-M1 back thin (−6 dB) on the cut with NG-A1 low; tick every 10 f (G903 … 973); **`reveal_riser-tension_01` from L0 (file offset 0.40 s)**, ending dead on G1002 (next shot).
- **Accept:** card 00:30 on L0 (R02, ≤ 00:30); the ring front does not reach Earth's disc before G1002.

### S01-B04-SH01 · 978–1055 · 00:00 and the sky goes dark (L08)

- **Time:** L08 L4–71; **"ศูนย์" L24 = G1002 = 00:00**; "ฟ้าก็มืดลง" L44.
- **Staging:** split, both cameras static. Card counts 00:08 → **00:00 at L24** (00:01 on L22–23), ▸▸ off at L24, then holds. On L24 the ring front reaches Earth's near limb and crosses the disc L24–34 (SD11), fading L34–44; Earth's day side goes dark L24–34 (city specks appear, `paintEarth` `dark` 0 → 1); street `new: day-night-grade` 0 → 1 over **L24–54**, stars alpha from grade 0.4 (L36) to 1 (L54); the Moon stays lit; figures take the night grade; no electric light. VEN rises to the top of her stroke at L26 (G1004; stroke 0.86 on L24) and freezes; CUS holds. Street contacts before the stop: G995 (L17).
- **Camera:** space `spaceCam((0.20, 0, 0.18), az 10, el 40, r 2.15, f 740, hy 430)`; street `orbit(T_STALL, az 26, r 3.80, eye 1.30, pitch 4, f 900, hy 960)`.
- **Sound:** riser ends dead on L24; **from L24: total silence** (music, tick, street, pestle all out, no tails); VO alone. Mix: the hit is the silence.
- **Entry → exit:** day, 00:08 → night with stars, card 00:00, pestle frozen up.
- **Accept:** spike 3 (00:00 on the frame of "ศูนย์" ± 1 f, Editor verifies the onset); spike 4 on L76 (night, not black); Earth dark from L34.

### S01-B04-SH02 · 1055–1160 · LF03 silence, "ไฟดับเหรอ" (silence, D03)

- **Time:** silence L0–37 (with the 6 f before the cut: 44 f after "มืดลง"); D03 L38–94 ("ไฟดับเหรอ" L66); dog L95.
- **Staging (night):** VEN frozen, pestle at the top (stroke 1.0), `surprised` held, breath on the ambient clock. CUS `surprised` until L38, then MOTIONS `look-around` (seated; `unknown` capability, fallback head turns left/right) on the motion clock L − 38. Stars over the wall; the Moon gives a cool rim on both heads (LF03). No card.
- **Camera:** `cam: orbit((0.85, 1.05, −0.40), az 15→14, r 3.00→2.95, eye 1.25, pitch 0, f 1150, hy 900)` (= `camLF03` at L0). `meas` L0: VEN head unit 132 px, CUS 233 px (visible 858→1561 = 703 px), chins y 902 / 1090; Moon (577, 509).
- **Sound:** nothing L0–37; NG-A2 night air fades in L38–50 under D03; **NG-S7 dog, quick double bark, onset L95 (G1150)**, off screen, far; its reverb tail fades to silence by G1168 (crosses the cut 8 f, under the incoming pad). Mix: silence → release.
- **Accept:** spike 4 (faces readable, mean luma ≥ 0.12, < 35 % of pixels under 0.05; LF03 measured 0.229 / 0.0 %); the frozen pestle reads as a stop (breath runs); no light source anywhere.

### S01-B04-SH03 · 1160–1245 · Earth goes straight (L09)

- **Time:** L09 L4–80; "พุ่งไปตรง ๆ" L50.
- **Staging (SET-SPACE su):** dark Earth (night side, city specks, blue rim) starts at `earthAt(−45°)` (0.707, 0, 0.707) on L0 and moves **at constant speed** along the tangent (0.707, 0, −0.707), 0.55 su over L0–85, leaving a faint straight dashed trail (≥ 3-point polyline); the orbit line curves on, empty; the ring is beyond the frame.
- **Camera:** `cam: spaceCam(T-EARTH-DEPART (0.95, 0, 0.45), az 10→14, el 28, r 1.60→1.75, f 880, hy 1000)`. `meas` Earth (363, 1062) → (623, 979); orbit points φ −30° (489, 1009), φ −70° (65, 1123).
- **Sound:** NG-M2 cold pad in from L0 (6 f fade); no whoosh.
- **Accept:** spike 5 (path straight, ≤ 3° from the orbit tangent at the departure point; no outward bend); Earth above y 1160.

### S01-B04-SH04 · 1245–1331 · the Moon goes dark (L10)

- **Time:** L10 L4–82; "ดวงจันทร์" L47; **"ดับตาม" L63 = Moon fade L63–83** (20 f).
- **Staging (night):** both standing, `back`, heads tilted up toward the Moon: CUS at (1.30, 0, 0.55) `man-crop, P01 + head up`, VEN at (0.50, 0, 0.40) `woman-ponytail + vendor, P01 + head up` (`unknown`: `back` with a head tilt; fallback plain `back`). The first-quarter Moon at `MOON_DIR` over the roofline fades to its unlit disc L63–83; the moon rim on their hair and shoulders fades with it. No card.
- **Camera:** SD05 `cam: pos (1.10, 1.55, 2.70), look az 13.2 (the Moon), pitch 5→8, f 950, hy 880`. `meas` L0: CUS head top (856, 866), VEN (516, 919), head units 219 / 177 px (visible CUS 866→1739 = 873 px); Moon (540, 647) → (540, 699).
- **Sound:** **`reveal_glass-shimmer-soft_01` L63**; NG-M2 and NG-A2 low.
- **Accept:** spike 6 (first-quarter shape, lit half toward the Sun's direction); the Moon and heads above y 1160; starlight keeps the frame readable after L83.

### S01-B04-SH05 · 1331–1430 · "+1 ชม." and Jupiter (L11)

- **Time:** L11 L4–94; the card reappears on L0 at 00:00 (no ▸▸); **card flip L4–12** (G1335–1343; 00:00 → "+1 ชม."); **Jupiter in L22–30** (8 f fade, 10 f after the flip); "ยังสว่างต่อ" L36 → VEN `point-up` raise L36–48, held.
- **Staging (night, +1 h):** both seated, `back`, facing −z: CUS on stool 1 at `CUS_AT`, `man-crop, P31`; VEN on stool 2 moved to (0.60, 0, 0.45) (SD07), `woman-ponytail + vendor, P32 + new: point-up`, right hand target (0.62, 1.28, −0.05) toward `JUP_DIR`. Jupiter: the brightest steady cream dot (core Ø 10 px, glow Ø 40 px, no twinkle) at `JUP_DIR`; the Moon's dark disc at (308, 560) stays faint.
- **Camera:** SD05/SD06 `cam: pos (1.10, 1.55, 2.70), look az −0.8 (pan right of SH04), pitch 4, f 950→1007 (push 6 %), hy 820`. `meas` L0 → L98: CUS top (654, 974) → (660, 984), VEN top (312, 1015) → (298, 1027), head units 182→193 / 185→196 px (visible CUS 974→1531 = 557 px); Jupiter (559, 452) → (560, 430).
- **Sound:** `tone_thin-unresolved_01` in at L22 with Jupiter, holds into SH06; NG-M2, NG-A2 low.
- **Accept:** Jupiter not drawn before L22 (R07); "+1 ชม." reads at 270 px; VEN's hand clearly points at the dot by L48.

### S01-B04-SH06 · 1430–1518 · the two legs of light (L12)

- **Time:** L12 L4–83; **"ไปถึงมันก่อน" L21 = incoming tail reaches Jupiter; Jupiter's lit half goes dark L21–29**; "แล้วสะท้อนกลับมา" L52.
- **Staging (SET-SPACE su, a replay diagram, not the +1 h world):** empty spot at the origin; dark Earth just off its orbit at (0.90, 0, 0.55); Jupiter r 0.16, banded, at (−2.08, 0, −1.20), lit only on its Sun-facing half. Both dash streams move at **0.030 su/f**: incoming tail 1.77 su from the origin at L0, at Jupiter (2.40 su) on L21; reflected dashes leave Jupiter's lit face toward Earth from L0, their tail leaves Jupiter at L29 and is mid-way (1.73 of 3.46 su) on L87. Card holds "+1 ชม.".
- **Camera:** `cam: spaceCam((−0.60, 0, 0.00), az 0, el 40, r 5.40→5.25, f 880, hy 1000)`. `meas` spot (638, 1000), Jupiter (334, 893), Earth (805, 1062); 139→143 px/su (Jupiter disc ≈ 45 px).
- **Sound:** Jupiter tone holds; NG-M2.
- **Accept:** spike 7 (a viewer says "light goes to Jupiter, then comes back to us"); Jupiter never lit on its far side or glowing by itself; all bodies and both legs above y 1160.

### S01-B05-SH01 · 1518–1618 · the sky full of stars (L13)

- **Time:** L13 L4–96; "ดาวทุกดวง" L26.
- **Staging (night, +1 h):** stall still; the two seated as in B04-SH05, `back`, small at the bottom at L0; dense star field with a faint Milky Way wash (ENV-STARS); Jupiter at `JUP_DIR` among them; the Moon's dark disc. No card.
- **Camera:** SD09 `cam: orbit((0.50, 1.05, −0.40), az 23→18, r 3.70, eye 1.30, pitch 0→35, f 1150, hy 900)`. `meas` L0: CUS / VEN head tops y 887 / 920 (back of the heads, above the band), head units 188 / 166 px (visible CUS 887→1454 = 567 px); Jupiter from the right edge (1076, 304) to (919, 1071) on the last frame L99 (R1 `meas` on L100 of the 101 f shot; the move now ends 1 f sooner); the people leave the frame bottom by about L45.
- **Sound:** NG-M3 warm pad in L0 (12 f crossfade from M2); Jupiter tone fades L0–30; NG-A2 low. Mix: lift (wonder).
- **Accept:** UT03 (stars fill the frame, not flat black); Jupiter readable as the same steady dot.

### S01-B05-SH02 · 1618–1681 · sunlight on the arm (L14a)

- **Time:** L14 onset L4 ("และแสงแดดที่โดนตัวคุณอยู่ตอนนี้…"); the cut at L63 is 4 f before "ออกจาก".
- **Staging (day, the real present, no card):** insert of CUS's near forearm resting on his knee, anchor `T-ARM` (1.27, 0.58, 0.45) (built CUS position + the brief's offset), hand relaxed (UT14 mitten) toward (1.22, 0.56, 0.62), elbow (1.33, 0.60, 0.27); the umbrella's shadow edge beside it; dust motes in the sun (`glow.tsx` `Bubbles` ≤ 0.3). Ambient clocks on the seam clock.
- **Camera:** `cam: orbit(T-ARM, az 30→32, r 0.62→0.58, eye 0.70, pitch 0, f 1050, hy 800)`. `meas` arm centre (540, 1003) → (540, 1017), hand (269, 1095) → (239, 1118), elbow (740, 941); knee y 1186 (in the band, not key).
- **Sound:** **hard return on L0**: NG-A1 and NG-M1 at the B01 level (NG-M1 at loop position 720 f), no fade-in; NG-S1 off frame −6 dB at G1622, 1640, 1658, 1676. Mix: hit.
- **Accept:** reads as warm sunlight on skin at 270 px; arm and hand above y 1160.

### S01-B05-SH03 · 1681–1798 · back to frame 0 (L14b, tail)

- **Time:** "ออกจากดวงอาทิตย์มาตั้งแต่ 8 นาทีที่แล้ว" L4–75 ("ที่แล้ว" L62); tail L75–117; camera still L87–117.
- **Staging:** the B01-SH01 day staging exactly: VEN pounding on the seam clock (contacts L13, 31, 49, 67, 85, 103 = G1694 … 1784), CUS seated facing the road, forearm on his knee, quarter Moon at `MOON_DIR`; CUS rig time = seam t + 1.3 s.
- **Camera:** SD10 `cam: orbit((0.50, 1.05, −0.40), az 19→23, r 3.50→3.70, eye 1.30, pitch 5, f 1480, hy 770)`, ease-out over L0–87, then **exactly `POSE_A`, still, L87–117** (G1768–1798). `meas` L0: CUS chin y 1144, head unit 270 px (visible 882→1699 = 817 px); VEN 157 px.
- **Sound:** **`stinger_pizz-tag-ending_01` onset L75 (G1756)**, 1.40 s, peak about −10 dB, fade L99–117; NG-M1 ducks −8 dB from L75 and returns to its B01 level by L116; NG-A1 continues; final 42 f speech-free. The audio of G1797 must flow into G0 (NG-M1 loop point on G1798; NG-A1 loop matched by the Editor).
- **Entry → exit:** day, r 3.50 → G1797 identical to G0 (camera, both poses, pestle phase 0.62, breath, twinkle, blink, Moon, light).
- **Accept:** spike 8 (last frame vs G0 identical at 270 px, PSNR ≥ 35 dB `est`; no camera jump on replay); `video.ending: 'B_loop'`, `endHoldSec: 0`; the tag ends inside the last frame.

---

## Boss and Editor handoff (W5.2 / W5.3)

- **Boss (plates, from this revision):** `new:` items of the brief N1–N10 still `missing` except what W3 built (`soi.ts` day/night states, `paintMoon`, `space.ts` Sun/Earth/orbit/ring/dashes, `stars.ts`, split frame and card in `look.tsx`). Needed for this sheet: continuous `day-night-grade` (B04-SH01), `pound-pestle` as the `P(G)` cycle and the frozen-top state, `fan-self`, `point-up`, `look-around` seated, `back` seated and standing with head up, the motorbike, SET-GW (merger + race), Jupiter disc with phase and the two-leg dash streams, the Earth tangent trail, dust motes, the clock-card flip and hide/show per shot, the seam clocks. Priority order: the split-shot chain B02-SH01 → B04-SH01 (clock, ring, grade), then the seam pair B01-SH01 / B05-SH03, then the rest. Proof: labelled frames at every event frame named above.
- **Editor (narration, blockout, sound):** assemble the narration from the [placement table](#narration-placement) (whole files, no inner cuts); file `nar95-lines.json` to the store first (D01/D02 are already there as the `narr-samples` audition takes); verify "ศูนย์" (G1002) on the waveform; build the blockout with these ranges; generate the NEEDS-GEN set with the [changes above](#sound-plan); ear-check D03 (limiter, voice-measure note).
- **Element captures:** none new; the W3 stills `out/edu07/look-frames/v2/` (store `projects/EDU/previews/EDU-EP07-SHORT/look-frames/ep07/`) remain the element reference (LF01–LF04 v2; cameras `scenes.ts` at the W3 working tree).

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Editor | `nar95-lines.json` filed to `~/ReelsStore/projects/EDU/audio/EDU-EP07-SHORT/narration/` | missing in store (worktree cache `out/ep07-voice/full95/lines.json` only); D01/D02 present in `narr-samples/` (md5 = cache) |
| Editor | "ศูนย์" onset on the waveform; 00:00 frame ± 1 f | `meas-w` G1002 |
| User | Q1–Q3 | resolved 2026-11-08 (c, a, b) |
| Boss | N1–N10 remainder, seam clocks, SET-GW | missing |
| Boss | `unknown` kit: stool via `drawChair`, seated `look-around`, `back` seated / head-up | unknown |
| Editor | caption legibility on bright frames (B01-SH01, B02-SH01, B05-SH03; Earth edge in B01-SH02) | open check |

### Decisions from the user (2026-11-08)

- **Q1 = (c)** start L01 at G16: S01-B01-SH01 is 33 f (25 f of soi + the 8 f tilt); the 6 f are given back as 1 f each from L05→L06, L06→L07, L13→L14 (total 1798 f).
- **Q2 = (a)** keep the D01 take; caption "ร้อนจังวันนี้".
- **Q3 = (b)** the clock jumps inside the 2017 cutaway and returns at 00:30; visible rate 9.09× throughout ([clock](#story-clock-and-derived-values), SD08, SD11).
- No open user questions in this revision.

## Change log

- **EDU-EP07-SHEETS-R1 (2026-11-08, Film W5.1):** first timed scene sheets from the W4 voice lock (Kore A atempo 0.95 per-line files, D01–D03), script R1.1, brief R1, rows R1 and the W3 v2 look frames. Total **1795 f = 59.83 s** (≤ 60 s) by placement only: gaps 0.20–0.53 s, stinger 1.47 s, tail 1.40 s; no overlap, no retime, no script trim. Measured word anchors (energy pauses + Whisper), projection run on a `ycam.ts` mirror calibrated on LF01; SD01–SD10 (cameras from the built set and the caption band, B04-SH05 pan right, stool 2 at +1 h, Jupiter direction, the clock at 00:59). NEEDS-GEN NG-M1 exact 100 bpm 900 f loop, NG-S1 one-shots, NG-S7 quick double bark. Rows → EDU-EP07-ROWS-R1.1 (timed; text changed on S01-B03-SH04 and S01-B04-SH05). Open Q1–Q3.
- **EDU-EP07-SHEETS-R1.1 (2026-11-08, Film W5.1 revision):** user answers Q1 = c, Q2 = a, Q3 = b. L01 onset G10 → G16 (S01-B01-SH01 27 → 33 f, tilt L25–33); gaps L05→L06, L06→L07, L13→L14 9 → 8 f; **total 1798 f = 59.93 s** (2 f margin); all later lines, cues, shot ranges, event frames, sound cues and seam clocks re-derived (no line retimed, no script change). Clock: one visible rate 9.09×, hidden jump 06:15 → 00:30 in G578–903, `ceil` display, 00:00 on "ศูนย์" G1002 (was G998); SD08 rewritten (R02 holds as written), new SD11 (ring meets Earth's near limb 0.89 su on G1002, so it stays outside the disc on the return). D01 take kept. Store paths for EP07 audio set to `~/ReelsStore/projects/EDU/audio/EDU-EP07-SHORT/{narration,narr-samples}/` (D01/D02 = the `narr-samples` audition takes, md5-checked; `nar95-lines.json` still missing). Rows → EDU-EP07-ROWS-R1.2.
