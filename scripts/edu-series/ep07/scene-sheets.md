# Timed scene sheets and index — EDU-EP07-SHORT (EDU-EP07-SHEETS-R1.2)

- **Deliverable:** `EDU-EP07-SHORT` · **Revision:** EDU-EP07-SHEETS-R1.2 (Film W5.1 revision for script R1.2, 2026-11-08) · **Status:** `ready-for-dev`, voice-timed: Boss may build/retime plates from this revision, Editor may re-place the narration and re-cut the blockout. · **Timing:** `checked-with-audio`: R1.1 lines keep their measured placement (shifted whole); the R1.2 takes (L05 A, L15+L16 A, V01) are `meas` on their files with an energy floor (ffmpeg `silencedetect` −40 dBFS, 0.10 s, cross-checked at −35 dBFS), phrase anchors from the energy pauses (±2 f); no Whisper pass on the R1.2 takes.
- **Evidence:** runtime: none for R1.2 (the R1.1 plates and the delivered R1.1 render are superseded for B03 onward) · audio: R1.2 locked takes measured, store md5 = worktree cache (checked 2026-11-08), placed on paper, not assembled, not listened by Film · render/samples: none · projection: the R1.1 run (a `ycam.ts` mirror calibrated on LF01) for every carried value; the new close in S01-B03-SH05 is `est` (no projection run this pass) · audio/subtitle sync: none · user approval: script R1.2 locked and the R1.2 voice takes picked (user, 2026-11-08, [task.md](task.md) W1/W4 R1.2 lines); the R1.1 approvals (rows 18/18, look frames v2, voice lock) carry for the unchanged shots; this sheet revision itself is not user-approved.
- **Inputs (by revision):** script **EDU-EP07-SCRIPT-R1.2** ([script.md](script.md): beat list, open-question map OQ1–OQ8, spoken script, sound intent, clue ledger CL01–CL04); fact-check [fact-check.md](fact-check.md) R1.2 recheck (C12 `settled`; nothing may warn before 00:00); voice [voice-measure.md](voice-measure.md) "R1.2 samples" + the W4.2 atempo 0.95 read for every carried line; brief **EDU-EP07-BRIEF-R1** ([film-brief.md](film-brief.md)); previous sheet **EDU-EP07-SHEETS-R1.1** (this file's history); built plates `src/painted/edu07/` (`clock.ts`, `soi.ts`, `space.ts`) at `8761a9c`.
- **Target:** worktree `ep04-ep02-sound-insert-dd2a93`, branch `claude/education-ep7-scenes-e19cd9` at `8761a9c` + uncommitted R1.2 text files · 30 fps · `durationFrames` **1580** (52.67 s) · 1080×1920 · composition `EDU-EP07-SHORT` (registered by the Editor, never in `src/Root.tsx`) · `video.ending: 'B_loop'`, `endHoldSec: 0`.
- **Baseline (link, not copied):** SET-SOI metres, SET-SPACE su, axes and owners per the [brief](film-brief.md#projection-contract-and-scale-baseline) as built in `soi.ts` / `space.ts`. SET-GW is retired with L06–L07. Built anchors win over the brief's est values: VEN feet `VEN_AT` (0.20, 0, −0.86), CUS stool 1 `CUS_AT` (1.42, 0, 0.30), mortar (0.66, 0.89, −0.42), stool 2 (−0.75, 0, 0.55), `MOON_DIR` (−0.216, 0.322, −0.922) (az 13.2°, el 18.8°). Seated CUS (P31 on the 0.45 m stool): chin 0.89, head top 1.33 m (`meas`, LF01 calibration); standing VEN head top 1.66, chin 1.245; standing CUS top 1.76, chin 1.32; head unit = height / 4 × `camUnit`.
- **Camera lines:** street `cam: orbit(T, az, r, eye, pitch, f, hy)` = `soi.ts` `orbit()` (camera at T + r·(sin az, ·, cos az), height `eye`, pitch + = look up); `cam: pos (x, y, z), look az a, pitch p, f, hy` = a YCam at that position with yaw −a; space `cam: spaceCam(T, az, el, r, f, hy)` = `space.ts`. A move `a→b` eases in-out over the whole shot unless the block says otherwise.
- **Clocks:** `G` composition frame; shot-local `L` = G − shot start; ranges half-open `[start, end)`. Event clocks are pure functions of G or L (seek-safe); the ambient and seam clocks are defined [below](#story-clock-and-derived-values).
- **One shot = one timeline scene** (scene ID = shot ID); every join is a hard cut.

<a id="r12-summary"></a>
## R1.2 at a glance (what moved)

| Range | R1.1 | R1.2 | Boss | Editor |
| --- | --- | --- | --- | --- |
| G0–395 (S01-B01-SH01 … S01-B02-SH03) | same | **unchanged** (clock segment A, ring, Earth, pestle, sound all identical) | nothing; pins hold | nothing |
| S01-B03-SH01 | 395–578, L05 R1.1 | **395–559**, L05 take A, clock races 07:11 → 02:02, CUS fanning | repaint (clock/ring/Earth rates, fan) | new L05 file, cues, ticks, motorbike |
| S01-B03-SH02, S01-B03-SH03 | 578–751, 751–903 (2017 cutaway, SET-GW) | **retired** (IDs not reused) | drop the shots from the timeline (`gw.ts` unused) | drop L06/L07, NG-A3 swell, merger whomp/ping |
| S01-B03-SH05 (**new**) | — | **559–647**, V01 + L15: CUS laughs at a cat clip on his phone | new plate (phone close, cat clip screen) | V01, L15, cat-clip audio |
| S01-B03-SH04 | 903–978, L07b, card returns at 00:30 | **647–760**, L16 + tick + race; CUS scrolls, then pockets the phone | repaint (new staging, clock, pestle warp) | L16, music out, tick alone, race ticks |
| S01-B04-SH01 | 978–1055 | **760–837** (00:00 on G784) | repaint (card race 00:21 → 00:00, pestle top on G784) | riser, silence from G784 |
| S01-B04-SH02 … S01-B05-SH03 | 1055–1798 | **837–1580**, every frame **−218**, content unchanged | retime constants only (`G_ZERO` 784, `G_SEAM` 1579, shot table); re-render through the cache | shift lines/cues/SFX by −218 f (−7.267 s) |

<a id="placement-rules"></a>
## Placement rules (Requirement for R1.2)

- **PL01 Stable:** shot IDs, order, beats, line assignment, casting, look and acceptance checks of the earlier revisions stay for every carried shot. Retired IDs (S01-B03-SH02, S01-B03-SH03, lines L06, L07) are not reused; the new shot is **S01-B03-SH05** and sits between SH01 and SH04 in time (IDs are names, not order).
- **PL02 Lines are not retimed:** each line file is placed whole (no atempo, no inner cut, no script change). **L15 + L16 is one file** (take A) placed whole, which keeps the take's own 0.57 s pause between the question and the answer; its split point (for the cut and the captions) is in-file **1.705 s** (centre of the silence 1.420–1.990 s), G643. Only the silence between files is set by placement.
- **PL03 Gaps** (previous voiced end → next voiced onset): R1.1 values for every carried pair (9 f default; 8 f L13→L14; 0.25 s L03→D01; 0.20 s D01→D02; 1.50 s L08→D03; 0.53 s D03→L09). New R1.2 gaps: **D02→L05 20 f** (the shot opens on 15 f of Earth sliding before L05: the script's "show, then tell", OQ3); **L05→V01 19 f** (5 f to the cut, then 14 f of the cat clip before the laugh); **V01→L15 9 f**; **L16→L08 15 f** (the script's ~0.5 s of tick alone).
- **PL04 Shot starts:** a voice-led shot starts 4 f before its line's onset; S01-B03-SH05 starts 5 f after L05's last voiced frame (14 f before V01); S01-B04-SH02 starts 6 f after L08's last voiced frame; S01-B05-SH03 ends on the last frame. In-line cuts: 4 f before "หายไป" (L01) and "ออกจาก" (L14).
- **PL05 Tail:** 1.40 s from L14's last voiced frame to the end (42 f), the UT15 tag's minimum length; the camera is still for the last 30 f.
- **PL06 Rows:** [review-rows.json](review-rows.json) **EDU-EP07-ROWS-R1.3** carries `start`/`end` (G frames) and `timingEstimated: false`. (The ID ROWS-R1.2 already names the R1.1-timed rows, so this revision takes R1.3.)

<a id="total-runtime"></a>
## Total runtime

| Segment | Frames | Notes |
| --- | --- | --- |
| G0–395 (B01, B02) | 395 | unchanged from R1.1 |
| B03 lead-in before L05 | 15 | G395–410 |
| L05 voiced | 144 | G410–554 (`meas` 4.77 s) |
| L05 → V01 | 19 | 5 f to the cut + 14 f of the clip |
| V01 voiced | 19 | G573–592 (`meas` 0.61 s) |
| V01 → L15 | 9 | |
| L15 voiced | 34 | G601–635 (`meas` 1.11 s) |
| L15 → L16 (inside the take) | 16 | G635–651 (take A's own pause, 0.57 s) |
| L16 voiced | 98 | G651–749 (`meas` 3.23 s) |
| Tick alone L16 → L08 | 15 | G749–764 |
| L08 onset → end (B04, B05) | 816 | G764–1580: the R1.1 G982–1798 span, unchanged, shifted −218 |
| **Total** | **1580** | **52.67 s** (17 shots) |

- **Shift:** every frame from L08 on moves **−218 f (−7.267 s)**; "ศูนย์" = 00:00 moves G1002 → **G784**. The script estimated about −5.3 s and 00:00 near 28.1 s; the measured takes are shorter (L05 4.77 s voiced vs Preaw's ~6.2 s estimate), so 00:00 lands at 26.13 s.
- **Margin to 60 s:** 220 f (7.33 s). No gap was squeezed; R1.1's 8 f gaps stay as they were (pinned shots).

<a id="narration-placement"></a>
## Narration placement (Editor)

Place each file whole so its voiced onset lands on the `Onset G` frame: timeline start of the file (s) = Onset G / 30 − onset in file. Store root `~/ReelsStore/projects/EDU/audio/EDU-EP07-SHORT/`. **The R1.2 files are untrimmed** (heads 0.23–0.31 s): if the Editor trims them (0.06 s head, 0.08 s tail like the locked lines), the onset G stays and the file start is recomputed. V01 has a 5 ms click at 0.112 s: trim its head to 0.20 s.

| Line | File | Onset in file (s) | Onset G | Last voiced G | File start on timeline (s) | Voiced (s) |
| --- | --- | --- | --- | --- | --- | --- |
| L01 | `narration/lines/2026-11-08_ep07-nar95-L01.wav` | 0.06 | 16 | 138 | 0.473 | 4.04 |
| L02 | `narration/lines/2026-11-08_ep07-nar95-L02.wav` | 0.06 | 146 | 166 | 4.807 | 0.64 |
| L03 | `narration/lines/2026-11-08_ep07-nar95-L03.wav` | 0.06 | 174 | 269 | 5.740 | 3.16 |
| D01 | `narr-samples/ep07-aud-CUS-1.wav` (Algenib) | 0.11 | 276 | 339 | 9.090 | 2.10 |
| D02 | `narr-samples/ep07-aud-VEN-1.wav` (Aoede) | 0.16 | 345 | 390 | 11.340 | 1.49 |
| **L05** | `narr-samples/2026-11-08_ep07-r12-L05-A.wav` (Kore A, atempo 0.95) | 0.230 | **410** | 554 | 13.437 | 4.77 |
| **V01** | `narr-samples/2026-11-08_ep07-r12-V01-CUS.wav` (Algenib, −21.2 LUFS, not re-levelled) | 0.235 | **573** | 592 | 18.865 | 0.61 |
| **L15+L16** | `narr-samples/2026-11-08_ep07-r12-L15L16-A.wav` (Kore A, one file) | 0.312 | **601** (L16: in-file 1.990 → **651**) | L15 635 · L16 749 | 19.721 | 1.11 + 3.23 |
| L08 | `narration/lines/2026-11-08_ep07-nar95-L08.wav` | 0.06 | 764 | 831 | 25.407 | 2.21 |
| D03 | `narration/2026-11-08_ep07-D03-lvl16.wav` (Algenib) | 0.20 | 875 | 931 | 28.967 | 1.84 |
| L09 | `narration/lines/2026-11-08_ep07-nar95-L09.wav` | 0.06 | 946 | 1022 | 31.473 | 2.53 |
| L10 | `narration/lines/2026-11-08_ep07-nar95-L10.wav` | 0.06 | 1031 | 1109 | 34.307 | 2.58 |
| L11 | `narration/lines/2026-11-08_ep07-nar95-L11.wav` | 0.06 | 1117 | 1207 | 37.173 | 3.00 |
| L12 | `narration/lines/2026-11-08_ep07-nar95-L12.wav` | 0.06 | 1216 | 1295 | 40.473 | 2.63 |
| L13 | `narration/lines/2026-11-08_ep07-nar95-L13.wav` | 0.06 | 1304 | 1396 | 43.407 | 3.06 |
| L14 | `narration/lines/2026-11-08_ep07-nar95-L14.wav` | 0.06 | 1404 | 1538 | 46.740 | 4.44 |

- **R1.2 take segments (in-file s, energy):** L05 A: speech 0.230–1.213 · 1.402–2.303 · 2.447–3.506 · 3.667–4.997 (4 phrases = the script's "…"/space breaks). L15+L16 A: L15 0.312–1.420; pause 1.420–1.990; L16 1.990–2.502 · 2.874–3.926 · 4.309–5.220. V01: 0.235–0.846 (5 ms click at 0.112–0.117).
- **Word anchors** (G; `meas` = end of an energy pause, ±2 f; carried anchors `meas`/`meas-w` from R1.1, shifted): "หายไป" 37 · "ตอนนี้" 45 · "คุณจะ" 69 · "ราว 8 นาที" 216 · "ร้อน" (D01) 304 · **"โลกยังวนต่อ" 410 · "ไอน์สไตน์บอกว่า" 445 · "แรงดึงที่หายไป" 477 · "ก็ต้องเดินทางมาเหมือนแสง" 513 · V01 snort 573 · "แล้วไม่มีใครเตือนเลยเหรอ" 601 · "ไม่มีหรอก" 651 · "ไม่มีอะไรเร็วกว่าแสง" 678 · "แม้แต่ข่าวร้าย" 721** · "ศูนย์" **784** `meas-w` · "ฟ้าก็มืดลง" 804 · "ไฟดับเหรอ" 903 · "พุ่งไปตรง ๆ" 992 · "ดวงจันทร์" 1074 · "ดับตาม" 1090 · "ยังสว่างต่อ" 1149 · "ไปถึงมันก่อน" 1233 · "แล้วสะท้อนกลับมา" 1264 · "ดาวทุกดวง" 1326 · "ออกจาก" 1467 · "ที่แล้ว" 1525. **Editor confirms "ศูนย์" on the waveform** after placing (the R1.1 draft confirmed G1002 ±1 on the same L08 file, so G784 ±1 holds if L08 is placed at G764); if it moves, the clock constants below move with it, nothing else.

<a id="story-clock-and-derived-values"></a>
## Story clock and derived values

- **Clock card (VD07, screen space, box x 700–1020, y 160–280).** R1.2 has no cutaway, so the card is **visible in every frame from G170 to G837** (S01-B02-SH01 … S01-B04-SH01, the B02 closes included as in R1.1; ER06: the clock never leaves the screen). Four visible rates, each change on a cut except the final race, which is meant to be seen (SD08). Story clock `clk(G)` (story-seconds, exact fractions, seek-safe):
  - **A** G [170, 395): `clk = 499 − 30 · (G − 170) / 99` (9.09×; **unchanged from R1.1**, so B02 plates and pins hold);
  - **B** G [395, 559): `clk = 120 + (30770 / 99) · (559 − G) / 164` (56.9×: 07:11 → 02:00; the minutes flip about once a second under L05, "the clock runs fast");
  - **C** G [559, 749): `clk = 30 + 90 · (749 − G) / 190` (14.2×: 02:00 → 00:30; under 02:00 through V01/L15/L16, script cue);
  - **D** G [749, 784]: `clk = 30 · (784 − G) / 35` (25.7×: the race, 00:30 → 00:00 after "แม้แต่ข่าวร้าย"); clk = 0 from G784.
  - Shown as `mm:ss` of **`ceil(clk)`**, computed on integer numerators (no floats), as in R1.1.
  - **Card table (G → shown):** 170 **08:19** (pop-in 6 f) · 271 07:49 · 342 07:27 · 394 07:12 · 395 07:11 · 410 06:43 · 445 05:37 · 513 03:28 · 558 02:02 · **559 02:00** · 573 01:54 · 601 01:41 · 646 01:19 · 647 01:19 · 678 01:04 · 721 00:44 · 748 00:31 · **749 00:30** · 759 00:22 · 760 00:21 · 764 00:18 · 776 00:07 · 783 00:01 · **784 00:00** on "ศูนย์".
  - ▸▸ glyph on until G784; holds "00:00" G784–837 (B04-SH01; hidden in B04-SH02 … SH04); reappears at 00:00 on G1113 (B04-SH05 L0) and flips to "+1 ชม." G1117–1125 (8 f card turn), held in B04-SH05/SH06; hidden from G1300.
- **Progress** `q(G) = (499 − clk(G)) / 499` (0 at G170, 0.1366 at G395, 0.7595 at G559, 0.9399 at G749, 1 at G784); the ring and Earth ride on it.
- **News-front ring (VD08, SD11):** `R(G) = 0.10 + (R_meet − 0.10) · q(G)` su for G in [170, 784], `R_meet` = **0.89** (Earth's near limb in the split). B01-SH02 growth 0 → 0.10 (G45 → G170) unchanged. From G784 the front crosses the disc with the day-side wipe, R 0.89 → 1.11 over G784–794, then fades over G794–804. Values: G170 0.10 · G271 0.15 · G395 0.21 · G558 0.70 · G646 0.77 · G748 0.84 · G759 0.86 · G784 0.89.
- **Earth on the orbit:** `φ(G) = −60° + 15° · q(G)` (`earthAt(φ)`), −60° until G170; −57.95° at G395, −48.66° at G558, −47.37° at G646, −45.92° at G748, −45.64° at G759, −45° at G784; from then on the tangent (B04-SH03).
- **Pestle clock (ambient, VEN):** `P(G) = frac((G + 12.8) / 18)`, stroke `= 0.5 − 0.5 · cos(2π · P)`, period 18 f = 100 bpm (the NG-M1 tempo), **unchanged for G < 721**: contacts G ≡ 5 (mod 18) through G707. **R1.2 warp (SD12):** from G721 (the music is out from "แม้แต่ข่าวร้าย") the cycle runs 6 % faster so the top lands on 00:00: `P(G) = frac(40.7667 + (G − 721) · 3.7333 / 63)` for G in [721, 784) (period 16.9 f); contacts G725, 742, 759, 776; **stroke 1.0 (top) exactly on G784, frozen** from there through B04-SH02 (breath runs). B05 uses the seam clock.
- **Seam clocks (R09, `B_loop`):** in S01-B05-SH02/SH03 every ambient clock runs on **`G − 1579`** (pestle, breath, twinkle, cable sway), so G1579 (the last frame) equals G0; `ambientT` switches at G1400. Pestle contacts there: G1404, 1422, 1440, 1458 (off frame), 1476, 1494, 1512, 1530, 1548, 1566. CUS rig time = ambient t + 1.3 s everywhere (eyes open on G0 and G1579).

<a id="staging-deviations"></a>
## Staging deviations (Film decisions, from the projection run and the built set)

These win over the brief/storyboard est values; the brief owns everything not listed. SD01–SD07, SD09, SD10 are unchanged from R1.1 (cameras and stools); only their shots' G ranges moved.

- **SD01 Pose A and its shots use the built LF01 camera** `POSE_A = orbit((0.50, 1.05, −0.40), az 23, r 3.70, eye 1.30, pitch 5, f 1480, hy 770)` (W3 tuning, brief deviation (4)), not the brief's r 2.80 / f 1050. B01-SH01 pushes from it, B05-SH03 lands on it.
- **SD02 B01-SH01 tilt** 8 f, pitch 5° → 30° (brief 12 f to 40°): at 40° the Moon falls to y 1339 (caption band); at 30° it is at y 1057 (`meas`). The shot is **33 f (1.10 s)** (Q1 = c).
- **SD03 D01 close** `orbit((1.42, 1.00, 0.30), az 10→14, r 1.60→1.52, eye 1.05, pitch 0, f 1050, hy 800)`: head unit 289→304 px, forearm y 1134→1150 (`meas`).
- **SD04 D02 close** `orbit((0.20, 1.30, −0.86), az 18→14, r 1.70→1.58, eye 1.35, pitch 0, f 1050, hy 740)`: mortar mouth y 1109→1143, head unit 256→276 px (`meas`).
- **SD05 Behind-the-two (B04-SH04/SH05)** `pos (1.10, 1.55, 2.70)`, f 950, hy 880 (SH04) / 820 (SH05), pitch 5–8° / 4°: Moon y 647→699 above heads at y 866–969 (`meas`).
- **SD06 B04-SH05 pans right, not left** (look az −0.8°); row text "แพนขวา".
- **SD07 Stool 2 for the +1 h state:** VEN's stool at (0.60, 0, 0.45) beside CUS for B04-SH05 and B05-SH01; `JUP_DIR` (0.032, 0.425, −0.905) (az −2.0°, el 25.2°).
- **SD08 Clock, R1.2:** the card never hides between G170 and G837 (no cutaway). Segment A stays at 9.09× (R1.1, user Q3 kept for B02); B steps up to 56.9× on the cut into S01-B03-SH01 (the clock "runs fast" under L05); C steps down to 14.2× on the cut into S01-B03-SH05 so the clock sits **under 02:00 for the whole phone beat** (script V01 cue) while still counting visibly; D speeds up to 25.7× inside S01-B03-SH04 on L102 (G749), the visible race into 00:00. The step-down at G559 is on a hard cut and reads as suspense, not as a slowdown (still 14× real time). R02 is amended accordingly ([storyboard](storyboard.md#rules-carried-from-the-brief-and-fact-check-every-shot)). The R1.1 SD08 (return at 00:30 from the hidden cutaway) is withdrawn with the cutaway.
- **SD09 B05-SH01 tilt** pitch 0° → 35° with a pan az 23° → 18°, f 1150, hy 900 (`meas` Jupiter (1076, 304) → (919, 1071)).
- **SD10 B05-SH03** starts at az 19°, r 3.50 (CUS chin y 1144 `meas`).
- **SD11 Ring meets Earth's limb, not its centre:** `R_meet` 0.89 on G784; the ring stays outside the disc through B03-SH04 (≤ 0.856 su on G759).
- **SD12 Pestle warp (R1.2):** with 00:00 on G784 the 18 f cycle would put VEN 8 f before a contact (stroke 0.14, pestle almost in the mortar), which does not read as "stops mid-air" and breaks LF03's top freeze. From G721 the music is out (no tempo reference), so the last four strokes run 6 % faster (period 16.9 f) and the top lands exactly on G784; LF03's frozen top (stroke 1.0) is kept. Thocks are heard only to G742.
- **SD13 Phone close (S01-B03-SH05, `est`):** the phone is a flat card squared to the lens like every prop in this set, so its screen faces the camera while CUS looks down into it (a deliberate cheat; the clip must read). The kit phone (`{kind:'phone'}`, `cast.ts`) is a dark slab sized for wides; the close needs `new: phone-screen` at 0.09 × 0.17 m (stylised, about 1.2× a real phone, scaled to the 4-head cast). The camera is derived from SD03 (measured) shifted into the bottom panel; Boss runs the projection and tunes to the accept numbers.
- **SD14 The phone leaves before 00:00 (S01-B03-SH04):** CUS pockets the phone on L102–112 (G749–759), during the tick alone, so the B04 night shots keep R06 (no electric light, no screen glow) and LF03 unchanged; from G760 his pose is the R1.1 B04-SH01 pose.

<a id="sound-plan"></a>
## Sound plan (whole video; per-shot cues in the shot blocks)

Library re-checked 2026-11-08 at `~/ReelsStore/library/sound/INDEX.md` (238 lines). Since R1.1 the Editor generated NG-M1, NG-A1, NG-A2, NG-A3, NG-S1, NG-S3, NG-S4, NG-S7 (IDs below; all "not listened"); NG-M2, NG-M3, NG-S2 still play their fallbacks. **R1.2 needs no new generation:** the cat clip uses `creature_cat-mrrp_01` through a phone-speaker filter; V01 is the locked voice file. **Dropped with L06–L07:** NG-S5 whomp, NG-S6 ping, `impact_sub-hit-short_01`, the NG-A3 cutaway swell (G578–903). No notification ding (`ui_notification-ding_01` must not be used: nothing may warn before 00:00, Boat). Sound never carries a fact.

| Layer | Source | Global use (G) |
| --- | --- | --- |
| Street theme (NG-M1) | `bed_edu07-ukulele-street-100bpm_01` (100 bpm, seamless) | 0–33 full; under the pad 33–166; 166–601 full (thinner from 395); **from 601 (L15) a step down** (−5 dB, high-cut ~3 kHz: "a question"); **out over G721–727** on "แม้แต่ข่าวร้าย"; 1400–1580 full, loop placed so its loop point lands on G1580 (loop position at G1400 = 720 f) |
| Street ambience (NG-A1) | `city_soi-afternoon-day_01` | as the theme to 721; −6 dB at 721, **out by 749**; hard return 1400 |
| Space pad (NG-A3) | `space_thin-airy-pad_01` | 33–170 only |
| Clock tick | `ui_click-tick_01`, low-passed, sequenced | every 20 f G170–390; **every 10 f G395–555** (+2 dB); **every 15 f G559–709** (+2 dB more from 601); every 10 f G721, 731, 741; **the race every 5 f G749–779** (749, 754 … 779); none on/after 784. **G749–764: the tick is the only sound** (with no VO) |
| Riser | `reveal_riser-tension_01` (3.69 s, stops dead at its peak) | **G764 from file offset 3.02 s**, soft, **ends dead on G784** |
| Silence | — | **G784–875: no music, no ambience, no SFX** (VO L08 alone to G831, then 44 f of nothing) |
| Night air (NG-A2) | `city_still-night-air_01` | in G875–887 under D03; low under B04-SH04/SH05 and B05-SH01 |
| Cold pad (NG-M2) | fallback `bed_edu05-cold-theme_01` | G942–1300 |
| Jupiter tone | `tone_thin-unresolved_01` | G1135–1330 (fades 1300–1330) |
| Warm pad (NG-M3) | fallback `tone_soft-sustain-reflective_01` | G1300–1400 (12 f crossfade from M2), hard out on the cut 1400 |
| End tag (UT15) | `stinger_pizz-tag-ending_01`, 1.40 s, peak about −10 dB, fade 0.6 s | onset **G1538**, fade 1562–1580; NG-M1 ducks −8 dB from 1538, back to its B01 level by G1579 |
| One-shots | NG-S1 `foley_pestle-papaya-thock_01..03` (contact frames to G742); NG-S2 fallback `ui_pop_01` + `reveal_reverse-swell-airy_01`; NG-S3 `foley_paper-menu-fan_01`; NG-S4 `vehicle_motorbike-pass-doppler_01`; NG-S7 `creature_dog-bark-double-far_01`; `reveal_glass-shimmer-soft_01` (Moon); `whoosh_air-swish-rising_01` (optional); **V01** voice file G573; **cat clip** `creature_cat-mrrp_01` band-passed 800–4000 Hz, about −30 dB, G565 | per shot |

**Mix intent (EP08a), R1.2:** B01 hold → drop on the cut to space → lift on L02's end; B02 hold (oblivious); **B03 lift (the tick races under L05) → hold under the phone beat (the ukulele plays on obliviously, V01 small under it) → step down on L15 (the question) → the music falls out on "แม้แต่ข่าวร้าย" → tick alone (the hit is the emptiness) → soft riser → silence at 00:00**; B04 silence = the hit, then release into the cold pad, small hits on the Moon shimmer and the Jupiter tone; B05 warm lift, hard return on the sun, release into the tag and the seam.

<a id="caption-plan"></a>
## Caption plan

White captions with the edu stroke, no band (series default), `captionStyle.bottomEdgeY` 1344, band y 1176–1344, ≤ 2 lines, break after "…" when a cue wraps; `video.chrome` `@TamMaiLa` top-left; no other text except the card (R01). Cue = `[phrase onset, last voiced frame + 6)`, capped at the next cue's onset; text verbatim from the script. V01 has no caption.

| Cue | G [start, end) | Thai |
| --- | --- | --- |
| L01a | 16–69 | ถ้าดวงอาทิตย์หายไปตอนนี้… |
| L01b | 69–144 | คุณจะยังไม่รู้ตัวไปอีก 8 นาที |
| L02 | 146–172 | แค่สมมตินะ |
| L03 | 174–275 | แสงแดดเดินทางมาถึงโลก… ราว 8 นาที 20 วินาที |
| D01 | 276–345 | ร้อนจังวันนี้ |
| D02 | 345–396 | พรุ่งนี้ร้อนกว่านี้อีก |
| L05a | 410–445 | โลกยังวนต่อ… |
| L05b | 445–513 | ไอน์สไตน์บอกว่า แรงดึงที่หายไป… |
| L05c | 513–560 | ก็ต้องเดินทางมาเหมือนแสง |
| L15 | 601–641 | แล้วไม่มีใครเตือนเลยเหรอ |
| L16a | 651–721 | ไม่มีหรอก… ไม่มีอะไรเร็วกว่าแสง… |
| L16b | 721–755 | แม้แต่ข่าวร้าย |
| L08 | 764–837 | พอนาฬิกาถึงศูนย์… ฟ้าก็มืดลง |
| D03 | 875–937 | เอ้า… ไฟดับเหรอ |
| L09 | 946–1028 | โลกหลุดวงโคจร… พุ่งไปตรง ๆ |
| L10 | 1031–1115 | อีกไม่กี่วินาที… ดวงจันทร์ดับตาม |
| L11 | 1117–1213 | แต่ดาวพฤหัสบดี… ยังสว่างต่ออีกราวชั่วโมงกว่า |
| L12 | 1216–1301 | เพราะแสงต้องไปถึงมันก่อน… แล้วสะท้อนกลับมา |
| L13 | 1304–1402 | ที่จริง… ดาวทุกดวงที่คุณเห็น คือภาพในอดีต |
| L14a | 1404–1467 | และแสงแดดที่โดนตัวคุณอยู่ตอนนี้… |
| L14b | 1467–1544 | ออกจากดวงอาทิตย์มาตั้งแต่ 8 นาทีที่แล้ว |

- Captions cross cuts where the cue does (L05c ends 1 f into S01-B03-SH05; L16b 6 f past S01-B03-SH04's last voiced frame); no cue during V01, the tick alone (G755–764), the stinger silence or the last 36 f.
- **D01 take (Q2 = a):** caption "ร้อนจังวันนี้" from the take's onset G276 (unchanged).
- **Open check (Editor, W5.3):** caption legibility on bright frames (B01-SH01, B02-SH01, B05-SH03; Earth's edge in B01-SH02) and, new, **S01-B03-SH05** (L15 over CUS's shoulders and the sunlit street) with `scripts/caption-zone.py --band 1176:1344` and a viewed sheet; report, do not darken on your own.

## Shot map

| Shot | Beat | G [start, end) (len) | Voice | Claims / clues | R1.2 |
| --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | B01 | 0–33 (33) | L01a | C01/C02 hook; CL03 plant | unchanged |
| S01-B01-SH02 | B01 | 33–170 (137) | L01b, L02 | C01/C02; C04 premise | unchanged |
| S01-B02-SH01 | B02 | 170–272 (102) | L03 | C01; CL01 plant | unchanged |
| S01-B02-SH02 | B02 | 272–342 (70) | D01 | dramatization; CL03 (arm in frame) | unchanged |
| S01-B02-SH03 | B02 | 342–395 (53) | D02 | dramatization (irony) | unchanged |
| S01-B03-SH01 | B03 | 395–559 (164) | L05 | C03/C11 `hedge`; OQ3 | retimed + repaint |
| S01-B03-SH05 | B03 | 559–647 (88) | V01, L15 | OQ4 opened (no warning on the phone) | **new** |
| S01-B03-SH04 | B03 | 647–760 (113) | L16, tick | C12 `settled`; **CL04 plant**; OQ4 answered | restaged + repaint |
| S01-B04-SH01 | B04 | 760–837 (77) | L08 | C06 `hedge`; OQ1/OQ2 answered | retimed + repaint |
| S01-B04-SH02 | B04 | 837–942 (105) | silence, D03 | dramatization; OQ5 | shift −218 |
| S01-B04-SH03 | B04 | 942–1027 (85) | L09 | C03 (tangent) | shift −218 |
| S01-B04-SH04 | B04 | 1027–1113 (86) | L10 | C07 `hedge` | shift −218 |
| S01-B04-SH05 | B04 | 1113–1212 (99) | L11 | C08 (corrected); CL02 | shift −218 |
| S01-B04-SH06 | B04 | 1212–1300 (88) | L12 | C08 reason; CL02 | shift −218 |
| S01-B05-SH01 | B05 | 1300–1400 (100) | L13 | C10 | shift −218 |
| S01-B05-SH02 | B05 | 1400–1463 (63) | L14a | C09; CL03 payoff | shift −218 |
| S01-B05-SH03 | B05 | 1463–1580 (117) | L14b, tail | C09; `B_loop` seam | shift −218 |

Retired: S01-B03-SH02 (L06, 2017 merger) and S01-B03-SH03 (L07a, the race to Earth), SET-GW.

---

## Shot sheets

Picture intent per shot is the row's `seen` text in [review-rows.json](review-rows.json) and its look frame; the blocks add numbers. Rules R01–R09 of the [storyboard](storyboard.md#rules-carried-from-the-brief-and-fact-check-every-shot) apply to every shot (R02 as amended in R1.2, [SD08](#staging-deviations)). Casting (brief VD02/VD03): VEN **`woman-ponytail + vendor`**, CUS **`man-crop`**, both flat cards squared to the shot camera (`squareToCam`), painted by `paintSoi` / `paintPerson`. Day = `paintSoi(…, {night: 0})`, night = `{night: 1}`; shadows flat (v2, user 2026-11-08; the watercolour POC is not adopted). Card, captions and chrome are screen space.

### S01-B01-SH01 · 0–33 · LF01 the sunny soi, whip-tilt (L01a)

- **Time:** L01 onset L16 ("ถ้าดวงอาทิตย์…"; Q1 = c); the cut at L33 is 4 f before "หายไป" (G37).
- **Staging (SET-SOI m, day):** VEN at `VEN_AT`, `front`, **`woman-ponytail + vendor, new: pound-pestle, happy`**, pestle on `P(G)` (stroke 0.62 at L0, contacts L5, L23; fist grip v2). CUS at `CUS_AT` on stool 1, `front`, **`man-crop, P31, tired`**, near forearm on his knee in full sun (CL03, not featured; y 1320 `meas`, in the band as in LF01). Quarter Moon at `MOON_DIR` (screen (790, 400) at L0).
- **Camera:** `cam: POSE_A` at L0 → push `orbit((0.50, 1.05, −0.40), az 23→22, r 3.70→3.60, eye 1.30, pitch 5, f 1480, hy 770)` over L0–33; tilt pitch 5° → 30° over L25–33, ease-in (SD02). `meas` L0: VEN head unit 149 px, CUS 253 px (lead visible 883→1650 = 767 px), CUS chin y 1129; L25 (tilt start): VEN ≈ 155, CUS ≈ 268 px (`est`: R1 measured these at the tilt start of the 27 f push; the 33 f push is at a slightly later fraction); last frame L32: bright sky, Moon ≈ (787, 1057) (`meas` R1), no Sun.
- **Sound:** NG-A1 and NG-M1 at full B01 level from L0 (loop position as at the seam); NG-S1 thock L5, L23; `whoosh_air-swish-rising_01` very soft from L23 (optional). Mix: hold.
- **Entry → exit:** G0 = the loop frame (identical to G1579) → whip into empty bright sky; the cut is on the motion.
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

### S01-B03-SH01 · 395–559 · Earth keeps curving (L05)

- **Time:** 15 f of picture first (Earth sliding: "show, then tell", OQ3); L05 L15–159 (G410–554): "โลกยังวนต่อ…" L15, "ไอน์สไตน์บอกว่า" L50, "แรงดึงที่หายไป…" L82, "ก็ต้องเดินทางมาเหมือนแสง" L118; pause after "วนต่อ" L45–50 (G440–445). Card **07:11 → 02:02** on L163 (segment B, 56.9×: the minutes digit flips about once a second).
- **Staging:** split (VD06, seam y 760) as B02-SH01. Space panel: empty spot; Earth `φ(G)` −57.95° → −48.66° (a visible 9.3° slide along the polyline), ring 0.21 → 0.70 su, dashes beyond the ring flowing to Earth (never touching it). Street panel: day; CUS on stool 1, **`man-crop, P31 + new: fan-self, tired`** (the built `fan-self` menu from B02-SH02, 2 flaps/s, slower than D01's 3/s; script cue "CUS still fanning"), forearm on his knee in the sun; VEN pounding on `P(G)`, contacts L6, 24, 42, 60, 78, 96, 114, 132, 150 (G401 … 545). Motorbike: **sound only** (W5.2 build note: z +3.5 lies behind the street camera).
- **Camera:** space `cam: spaceCam((0.20, 0, 0.18), az 4→7, el 40, r 2.15, f 740, hy 430)`; street `cam: orbit(T_STALL (0.45, 1.05, −0.35), az 28→26, r 3.80, eye 1.30, pitch 4, f 900, hy 960)` (= R1.1 values; space az ends at 7 instead of 8 so SH05 continues 7→8).
- **Sound:** tick every 10 f (G395, 405 … 555), +2 dB over B02; NG-M1 a little thinner from L0, NG-A1 on; NG-S4 `vehicle_motorbike-pass-doppler_01`, Doppler peak **G442** (L47, in the pause after "วนต่อ"); NG-S1 soft at the contacts; NG-S3 fan flaps very soft (−8 dB vs D01, optional). L05 dry over.
- **Entry → exit:** cut from VEN's close (D02) back to the two worlds, Earth already moving → card 02:02, ring 0.70, CUS still fanning.
- **Accept:** Earth on the orbit polyline ±2 px every frame; ring front ≥ 0.15 su short of Earth's near limb; the card shows 07:11 on L0 and 02:02 on L163 and its minutes digit changes at least four times in the shot; nothing key in the band.

### S01-B03-SH05 · 559–647 · CUS laughs at a cat clip (V01, L15) — new R1.2

- **Time:** thumb flick L0–4 (a new clip comes up on L4); cat clip on the screen from L4; cat startle-hop L6–20 (clip time L − 6); **V01 snort-laugh L14–33** (G573–592); L15 "แล้วไม่มีใครเตือนเลยเหรอ" **L42–76** (G601–635); he keeps watching to L87; the cut at L88 is 4 f before L16's onset (G651). Card **02:00 → 01:19** (segment C, 14.2×: the seconds visibly run down; under 02:00 the whole shot).
- **Staging:** split (seam y 760, cream 3 px). **Space panel:** as SH01 continuing: Earth `φ` −48.61° → −47.37° on its curve, ring 0.70 → 0.77 su. **Street panel (SET-SOI m, day), close on CUS:** seated on stool 1 at `CUS_AT` (1.42, 0, 0.30), three-quarter front, **`man-crop, P31 + new: phone-watch, amused → laugh`**: the hand nearer screen-left holds the phone up at chin height, phone centre (1.30, 1.00, 0.55) `est` (0.25 m in front of his chest toward the camera, 0.12 m to −x), other forearm on his knee in the sun; eyes down-left into the screen; the fan menu is gone (put down off frame; time cut). Phone: the kit prop `{kind: 'phone'}` look (dark slab, `#1f2326`) at close size + **`new: phone-screen`** 0.09 × 0.17 m, screen card squared to the lens (SD13): a pale painted screen showing **one cat clip only: `cat-orange-tabby, startle-hop`** (kit `ANIMALS` + `animalMotion`) against a plain floor; **no text, no icons, no status bar, no badge, no notification, no news** (Boat: nothing may warn before 00:00). V01: shoulders bounce twice (±0.01 m) L14–26, eyes squint, mouth `smile` closed (a snort through the nose, not an open laugh; [no profile lips](../../../docs/user-taste.md) does not apply: three-quarter); then he stays smiling; second thumb flick L52 (the clip loops, `idle`). He does not react to the narrator (he cannot hear the question). VEN soft behind at screen left, pounding on `P(G)`, contacts L4, 22, 40, 58, 76 (G563 … 635).
- **Camera:** space `cam: spaceCam((0.20, 0, 0.18), az 7→8, el 40, r 2.15, f 740, hy 430)`; street `cam: orbit((1.40, 1.00, 0.35), az 8→11, r 1.55→1.50, eye 1.05, pitch 0, f 1000, hy 1010)` **`est`** (from SD03, measured head top 616 / chin 905 at hy 800, shifted ≈ 210 px into the bottom panel and opened slightly for the phone: expected head top ≈ 820, chin ≈ 1105, head unit ≈ 270→285 px). Street layer clipped to the bottom panel (y 763–1920). Boss runs the projection and tunes hy/r to the accept numbers.
- **Light:** day; sun on his forearm (CL03 continuity, not featured); a small cool screen glow on his chin and cheek (alpha ≤ 0.15); flat shadows (v2).
- **Sound:** NG-M1 full to L42, then **down a step from L42 (G601)** (−5 dB, high-cut); NG-A1 on; cat clip `creature_cat-mrrp_01` band-passed 800–4000 Hz (phone speaker), about −30 dB, onset **L6 (G565)**; **V01** onset **L14 (G573)**, low under the music (about −8 dB below the dialogue level; Editor by ear); tick every 15 f (G559, 574, 589, 604, 619, 634), +2 dB more from L42; NG-S1 soft at G563, 581, 599, 617, 635. **No ding, alert, siren or notification sound.**
- **Entry → exit:** CUS fanning in the wide → close, phone up, clip, snort → still smiling at the phone as the question lands; card 02:00 → 01:19.
- **Accept:** CUS head unit 260–300 px, head top ≥ 800 (≥ 40 px below the seam), chin ≤ 1130; the phone screen fully inside y 860–1160, not over his eyes or mouth, ≥ 110 px tall; at 540 px width a viewer says "he is laughing at a cat video" and sees nothing else on the screen; card visible and counting in every frame; space panel Earth on the polyline ±2 px; nothing key in the band (his shoulders may sit there).

### S01-B03-SH04 · 647–760 · nothing is faster than light; the race to 00:00 (L16, tick alone)

- **Time:** L16 **L4–102** (G651–749): "ไม่มีหรอก…" L4, "ไม่มีอะไรเร็วกว่าแสง…" L31 (G678), **"แม้แต่ข่าวร้าย" L74 (G721)**; **tick alone L102–117** (G749–764); L08 starts in the next shot (G764). Card **01:19 → 00:30 on L102** (G749), then **the race** (segment D, 25.7×) to **00:22 on L112** (G759); ▸▸ on.
- **Staging:** split, the B02-SH01 two-worlds wide (R1.1 SH04 framing). **Space panel:** the last light front (ring) 0.77 → 0.856 su, just short of Earth's near limb at 0.89 (SD11); the empty spot behind it; Earth `φ` −47.35° → −45.64° ahead of the front, still on its curve (CL04 picture: the front is the leading edge; nothing outruns it). **Street panel:** day; CUS seated, **`man-crop, P31 + P10 arms (kit `hold_phone_chest`, phone prop `{kind: 'phone'}`), smile`**, eyes on the phone, thumb flicks L20, L60; **`new: pocket-phone` L102–112** (G749–759): the phone hand drops to his trouser pocket at the hip and returns to his knee, so on L113 he is in the R1.1 B04-SH01 pose (hands on his knees, facing the road) and **no phone or screen glow appears in any later shot** (SD14). VEN pounding: contacts L6, 24, 42, 60 (G653, 671, 689, 707) on `P(G)`; from G721 the warped clock (SD12): contacts L78 (G725), L95 (G742), L112 (G759).
- **Camera:** space `cam: spaceCam((0.20, 0, 0.18), az 8→10, el 40, r 2.15, f 740, hy 430)`; street `cam: orbit(T_STALL, az 26, r 3.80, eye 1.30, pitch 4, f 900, hy 960)`, static (R1.1 values).
- **Sound:** NG-M1 at the stepped-down level to L74, **out over L74–80** (G721–727) on "แม้แต่ข่าวร้าย"; NG-A1 −6 dB at L74, out by L102; NG-S1 at G653, 671, 689, 707, 725, 742 (−6 dB from 725), none after; tick every 15 f (G649, 664, 679, 694, 709), every 10 f (G721, 731, 741), then the race every 5 f (G749, 754, 759; continues into B04-SH01); **L102–117 (G749–764): the tick is the only sound** (the beat's stinger). Riser starts in the next shot.
- **Entry → exit:** close on CUS with the phone → the two worlds wide, CUS still scrolling, oblivious → music gone, phone pocketed, card racing 00:30 → 00:22.
- **Accept:** the ring front never reaches Earth's disc (≤ 0.856 su); the card shows 00:30 on L102 and its seconds digit visibly speeds up from L102; the phone is gone from his hand by L112 and the street panel on L112 matches B04-SH01 L0 (pose, pestle, light).

### S01-B04-SH01 · 760–837 · 00:00 and the sky goes dark (L08)

- **Time:** L08 L4–71 (G764–831); **"ศูนย์" L24 = G784 = 00:00**; "ฟ้าก็มืดลง" L44 (G804).
- **Staging:** split, both cameras static. Card races **00:21 → 00:00 at L24** (00:01 on L23), ▸▸ off at L24, then holds 00:00. On L24 the ring front reaches Earth's near limb and crosses the disc L24–34 (SD11), fading L34–44; Earth's day side goes dark L24–34 (city specks appear, `paintEarth` `dark` 0 → 1); street `new: day-night-grade` 0 → 1 over **L24–54**, stars alpha from grade 0.4 (L36) to 1 (L54); the Moon stays lit; figures take the night grade; no electric light, no phone (pocketed, SD14). **VEN on the warped pestle clock (SD12): contact L16 (G776), top of the stroke exactly on L24 (G784, stroke 1.0), frozen** (R1.1: top on L26). CUS holds the B01 pose (hands on his knees).
- **Camera:** space `spaceCam((0.20, 0, 0.18), az 10, el 40, r 2.15, f 740, hy 430)`; street `orbit(T_STALL, az 26, r 3.80, eye 1.30, pitch 4, f 900, hy 960)`.
- **Sound:** tick every 5 f L4–19 (G764, 769, 774, 779) under "พอนาฬิกาถึง…", none from L24; **riser `reveal_riser-tension_01` from L4 (G764) at file offset 3.02 s, soft, ending dead on L24**; **from L24: total silence** (music, tick, street, pestle all out, no tails); VO alone. Mix: the hit is the silence.
- **Entry → exit:** day, card racing 00:21 → night with stars, card 00:00, pestle frozen at the top.
- **Accept:** spike 3 (00:00 on the frame of "ศูนย์" ± 1 f, Editor verifies the onset on the waveform); spike 4 on L76 (night, not black); Earth dark from L34; no frame of the card between 00:00 and 00:30 repeats a value for more than 2 f (it races).

### S01-B04-SH02 · 837–942 · LF03 silence, "ไฟดับเหรอ" (silence, D03)

- **Time:** silence L0–37 (with the 6 f before the cut: 44 f after "มืดลง"); D03 L38–94 ("ไฟดับเหรอ" L66); dog L95.
- **Staging (night):** VEN frozen, pestle at the top (stroke 1.0), `surprised` held, breath on the ambient clock. CUS `surprised` until L38, then MOTIONS `look-around` (seated; `unknown` capability, fallback head turns left/right) on the motion clock L − 38. Stars over the wall; the Moon gives a cool rim on both heads (LF03). No card.
- **Camera:** `cam: orbit((0.85, 1.05, −0.40), az 15→14, r 3.00→2.95, eye 1.25, pitch 0, f 1150, hy 900)` (= `camLF03` at L0). `meas` L0: VEN head unit 132 px, CUS 233 px (visible 858→1561 = 703 px), chins y 902 / 1090; Moon (577, 509).
- **Sound:** nothing L0–37; NG-A2 night air fades in L38–50 under D03; **NG-S7 dog, quick double bark, onset L95 (G932)**, off screen, far; its reverb tail fades to silence by G950 (crosses the cut 8 f, under the incoming pad). Mix: silence → release.
- **Accept:** spike 4 (faces readable, mean luma ≥ 0.12, < 35 % of pixels under 0.05; LF03 measured 0.229 / 0.0 %); the frozen pestle reads as a stop (breath runs); no light source anywhere.

### S01-B04-SH03 · 942–1027 · Earth goes straight (L09)

- **Time:** L09 L4–80; "พุ่งไปตรง ๆ" L50.
- **Staging (SET-SPACE su):** dark Earth (night side, city specks, blue rim) starts at `earthAt(−45°)` (0.707, 0, 0.707) on L0 and moves **at constant speed** along the tangent (0.707, 0, −0.707), 0.55 su over L0–85, leaving a faint straight dashed trail (≥ 3-point polyline); the orbit line curves on, empty; the ring is beyond the frame.
- **Camera:** `cam: spaceCam(T-EARTH-DEPART (0.95, 0, 0.45), az 10→14, el 28, r 1.60→1.75, f 880, hy 1000)`. `meas` Earth (363, 1062) → (623, 979); orbit points φ −30° (489, 1009), φ −70° (65, 1123).
- **Sound:** NG-M2 cold pad in from L0 (6 f fade); no whoosh.
- **Accept:** spike 5 (path straight, ≤ 3° from the orbit tangent at the departure point; no outward bend); Earth above y 1160.

### S01-B04-SH04 · 1027–1113 · the Moon goes dark (L10)

- **Time:** L10 L4–82; "ดวงจันทร์" L47; **"ดับตาม" L63 = Moon fade L63–83** (20 f).
- **Staging (night):** both standing, `back`, heads tilted up toward the Moon: CUS at (1.30, 0, 0.55) `man-crop, P01 + head up`, VEN at (0.50, 0, 0.40) `woman-ponytail + vendor, P01 + head up` (`unknown`: `back` with a head tilt; fallback plain `back`). The first-quarter Moon at `MOON_DIR` over the roofline fades to its unlit disc L63–83; the moon rim on their hair and shoulders fades with it. No card.
- **Camera:** SD05 `cam: pos (1.10, 1.55, 2.70), look az 13.2 (the Moon), pitch 5→8, f 950, hy 880`. `meas` L0: CUS head top (856, 866), VEN (516, 919), head units 219 / 177 px (visible CUS 866→1739 = 873 px); Moon (540, 647) → (540, 699).
- **Sound:** **`reveal_glass-shimmer-soft_01` L63**; NG-M2 and NG-A2 low.
- **Accept:** spike 6 (first-quarter shape, lit half toward the Sun's direction); the Moon and heads above y 1160; starlight keeps the frame readable after L83.

### S01-B04-SH05 · 1113–1212 · "+1 ชม." and Jupiter (L11)

- **Time:** L11 L4–94; the card reappears on L0 at 00:00 (no ▸▸); **card flip L4–12** (G1117–1125; 00:00 → "+1 ชม."); **Jupiter in L22–30** (8 f fade, 10 f after the flip); "ยังสว่างต่อ" L36 → VEN `point-up` raise L36–48, held.
- **Staging (night, +1 h):** both seated, `back`, facing −z: CUS on stool 1 at `CUS_AT`, `man-crop, P31`; VEN on stool 2 moved to (0.60, 0, 0.45) (SD07), `woman-ponytail + vendor, P32 + new: point-up`, right hand target (0.62, 1.28, −0.05) toward `JUP_DIR`. Jupiter: the brightest steady cream dot (core Ø 10 px, glow Ø 40 px, no twinkle) at `JUP_DIR`; the Moon's dark disc at (308, 560) stays faint.
- **Camera:** SD05/SD06 `cam: pos (1.10, 1.55, 2.70), look az −0.8 (pan right of SH04), pitch 4, f 950→1007 (push 6 %), hy 820`. `meas` L0 → L98: CUS top (654, 974) → (660, 984), VEN top (312, 1015) → (298, 1027), head units 182→193 / 185→196 px (visible CUS 974→1531 = 557 px); Jupiter (559, 452) → (560, 430).
- **Sound:** `tone_thin-unresolved_01` in at L22 with Jupiter, holds into SH06; NG-M2, NG-A2 low.
- **Accept:** Jupiter not drawn before L22 (R07); "+1 ชม." reads at 270 px; VEN's hand clearly points at the dot by L48.

### S01-B04-SH06 · 1212–1300 · the two legs of light (L12)

- **Time:** L12 L4–83; **"ไปถึงมันก่อน" L21 = incoming tail reaches Jupiter; Jupiter's lit half goes dark L21–29**; "แล้วสะท้อนกลับมา" L52.
- **Staging (SET-SPACE su, a replay diagram, not the +1 h world):** empty spot at the origin; dark Earth just off its orbit at (0.90, 0, 0.55); Jupiter r 0.16, banded, at (−2.08, 0, −1.20), lit only on its Sun-facing half. Both dash streams move at **0.030 su/f**: incoming tail 1.77 su from the origin at L0, at Jupiter (2.40 su) on L21; reflected dashes leave Jupiter's lit face toward Earth from L0, their tail leaves Jupiter at L29 and is mid-way (1.73 of 3.46 su) on L87. Card holds "+1 ชม.".
- **Camera:** `cam: spaceCam((−0.60, 0, 0.00), az 0, el 40, r 5.40→5.25, f 880, hy 1000)`. `meas` spot (638, 1000), Jupiter (334, 893), Earth (805, 1062); 139→143 px/su (Jupiter disc ≈ 45 px).
- **Sound:** Jupiter tone holds; NG-M2.
- **Accept:** spike 7 (a viewer says "light goes to Jupiter, then comes back to us"); Jupiter never lit on its far side or glowing by itself; all bodies and both legs above y 1160.

### S01-B05-SH01 · 1300–1400 · the sky full of stars (L13)

- **Time:** L13 L4–96; "ดาวทุกดวง" L26.
- **Staging (night, +1 h):** stall still; the two seated as in B04-SH05, `back`, small at the bottom at L0; dense star field with a faint Milky Way wash (ENV-STARS); Jupiter at `JUP_DIR` among them; the Moon's dark disc. No card.
- **Camera:** SD09 `cam: orbit((0.50, 1.05, −0.40), az 23→18, r 3.70, eye 1.30, pitch 0→35, f 1150, hy 900)`. `meas` L0: CUS / VEN head tops y 887 / 920 (back of the heads, above the band), head units 188 / 166 px (visible CUS 887→1454 = 567 px); Jupiter from the right edge (1076, 304) to (919, 1071) on the last frame L99 (R1 `meas` on L100 of the 101 f shot; the move now ends 1 f sooner); the people leave the frame bottom by about L45.
- **Sound:** NG-M3 warm pad in L0 (12 f crossfade from M2); Jupiter tone fades L0–30; NG-A2 low. Mix: lift (wonder).
- **Accept:** UT03 (stars fill the frame, not flat black); Jupiter readable as the same steady dot.

### S01-B05-SH02 · 1400–1463 · sunlight on the arm (L14a)

- **Time:** L14 onset L4 ("และแสงแดดที่โดนตัวคุณอยู่ตอนนี้…"); the cut at L63 is 4 f before "ออกจาก".
- **Staging (day, the real present, no card):** insert of CUS's near forearm resting on his knee, anchor `T-ARM` (1.27, 0.58, 0.45) (built CUS position + the brief's offset), hand relaxed (UT14 mitten) toward (1.22, 0.56, 0.62), elbow (1.33, 0.60, 0.27); the umbrella's shadow edge beside it; dust motes in the sun (`glow.tsx` `Bubbles` ≤ 0.3). Ambient clocks on the seam clock.
- **Camera:** `cam: orbit(T-ARM, az 30→32, r 0.62→0.58, eye 0.70, pitch 0, f 1050, hy 800)`. `meas` arm centre (540, 1003) → (540, 1017), hand (269, 1095) → (239, 1118), elbow (740, 941); knee y 1186 (in the band, not key).
- **Sound:** **hard return on L0**: NG-A1 and NG-M1 at the B01 level (NG-M1 at loop position 720 f), no fade-in; NG-S1 off frame −6 dB at G1404, 1422, 1440, 1458. Mix: hit.
- **Accept:** reads as warm sunlight on skin at 270 px; arm and hand above y 1160.

### S01-B05-SH03 · 1463–1580 · back to frame 0 (L14b, tail)

- **Time:** "ออกจากดวงอาทิตย์มาตั้งแต่ 8 นาทีที่แล้ว" L4–75 ("ที่แล้ว" L62); tail L75–117; camera still L87–117.
- **Staging:** the B01-SH01 day staging exactly: VEN pounding on the seam clock (contacts L13, 31, 49, 67, 85, 103 = G1476 … 1566), CUS seated facing the road, forearm on his knee, quarter Moon at `MOON_DIR`; CUS rig time = seam t + 1.3 s.
- **Camera:** SD10 `cam: orbit((0.50, 1.05, −0.40), az 19→23, r 3.50→3.70, eye 1.30, pitch 5, f 1480, hy 770)`, ease-out over L0–87, then **exactly `POSE_A`, still, L87–117** (G1550–1580). `meas` L0: CUS chin y 1144, head unit 270 px (visible 882→1699 = 817 px); VEN 157 px.
- **Sound:** **`stinger_pizz-tag-ending_01` onset L75 (G1538)**, 1.40 s, peak about −10 dB, fade L99–117; NG-M1 ducks −8 dB from L75 and returns to its B01 level by L116; NG-A1 continues; final 42 f speech-free. The audio of G1579 must flow into G0 (NG-M1 loop point on G1580; NG-A1 loop matched by the Editor).
- **Entry → exit:** day, r 3.50 → G1579 identical to G0 (camera, both poses, pestle phase 0.62, breath, twinkle, blink, Moon, light).
- **Accept:** spike 8 (last frame vs G0 identical at 270 px, PSNR ≥ 35 dB `est`; no camera jump on replay); `video.ending: 'B_loop'`, `endHoldSec: 0`; the tag ends inside the last frame.

---

## Boss and Editor handoff (W5.2 / W5.3 for R1.2)

- **Boss (plates, from this revision):**
  1. `clock.ts`: shot table per the [shot map](#shot-map) (S01-B03-SH02/SH03 removed, S01-B03-SH05 added at 559–647), `G_ZERO` 1002 → **784**, `G_SEAM` 1797 → **1579**, `ambientT` switch 1618 → **1400**, `clk99` → the four segments A–D ([clock](#story-clock-and-derived-values)), `pestleStrokeAt` → the SD12 warp (G721–784) and the frozen top from G784.
  2. **Repaint:** S01-B03-SH01 (new rates, CUS `fan-self` in the wide), **S01-B03-SH05 (new:** phone close camera, `phone-watch` pose, `phone-screen` with the `cat-orange-tabby` startle-hop clip, V01 shoulder bounce), S01-B03-SH04 (L16 staging, kit phone in the wide, `pocket-phone`), S01-B04-SH01 (card race, pestle top on G784).
  3. **Retime only:** S01-B04-SH02 … S01-B05-SH03 (content and shot-local frames unchanged; −218 f); re-render through the scene cache and confirm the seam (G1579 vs G0, PSNR ≥ 35 dB) and LF03's frozen top in B04-SH02.
  4. **Unchanged:** S01-B01-SH01 … S01-B02-SH03 (clock segment A, ring, Earth and pestle identical for G < 395): their pins should hold; confirm by scene-cache key.
  5. `new:` items this revision: `phone-watch` (seated, phone at chin height), `phone-screen` (close prop with a kit animal on it), `pocket-phone` (seated, 10 f). Proof: labelled frames at L0, L6, L14, L42, L87 of SH05, L0/L74/L102/L112 of SH04, L0/L23/L24/L34 of B04-SH01, plus measured head unit, head top, chin and phone-screen box for SH05.
- **Editor (narration, captions, sound):** re-place the narration from the [placement table](#narration-placement) (L05 take A replaces the R1.1 L05; L06/L07 out; V01 and L15+L16 in; L08–L14 and D03 −7.267 s); update `narration-place.py` and `cues.ts` from the [caption plan](#caption-plan); confirm "ศูนย์" at G784 ±1; update `sound-mix.py` per the [sound plan](#sound-plan) (TOTAL 1580; drop the merger whomp/ping and the NG-A3 cutaway swell; add V01 and the cat clip; music step-down at 601, out at 721; tick grid; riser from G764 at offset 3.02 s); file the R1.2 takes as `narration/lines/` copies if the timeline uses them (`store.py use`); `durationFrames` 1580.
- **Element captures:** none new; the W3 v2 stills (store `projects/EDU/previews/EDU-EP07-SHORT/look-frames/ep07/`) and the R1.1 final-cut frames of the carried shots remain the reference. SH05 has no look frame; Boss's first labelled stills of it go to the coordinator for the [viewer check](../../../docs/sequence-workflow.md#viewer-check) before the user sees them.

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Editor | "ศูนย์" onset on the waveform at G784 ± 1 | `meas-w` (R1.1 G1002 confirmed on the same file, shifted) |
| Editor | trim/level the R1.2 takes (heads 0.23–0.31 s; V01 click at 0.112 s; V01 −21.2 LUFS, used low) | open |
| Editor | V01 audibility under the music (should read as a snort, not a cough); if it does not read, drop it and keep the picture (the line is optional, script) | open, ear check |
| Editor | whether muting the pestle thocks from G742 (the "tick alone") reads as a bug; if so keep them at −12 dB to G764 | open, ear check (Film recommends the mute) |
| Boss | SH05 projection: head unit 260–300 px, head top ≥ 800, chin ≤ 1130, phone screen inside y 860–1160 and ≥ 110 px tall | `est` camera, to measure |
| Boss | `phone-watch`, `phone-screen`, `pocket-phone`, `fan-self` in the wide | missing (fan-self exists for the close) |
| Boss | remove S01-B03-SH02/SH03 from the composition; `gw.ts` and the two shot files become unused (keep or delete, Boss's call, recorded in build-notes) | open |
| Editor | caption legibility (B01-SH01, B02-SH01, B05-SH03, B01-SH02 Earth edge, **new: B03-SH05**) | open check |

### Decisions (Film, R1.2)

- **D-R12-1 Clock shape:** four visible rates (9.09× / 56.9× / 14.2× / 25.7×) with the steps on cuts, except the final race, so the clock stays visible all the time (ER06), sits under 02:00 for the phone beat and races into 00:00 (SD08). Alternative rejected: one constant rate 07:11 → 00:00 (34×) puts the phone beat at 03:30–00:40 (not "below 02:00") and has no race.
- **D-R12-2 One new shot, SH04 kept:** the phone beat needs a close (the screen must read); the answer (L16) needs the two worlds wide with the last light front. S01-B03-SH04 keeps its role (the split's last stretch into 00:00, riser, tick) and its ID; the close is new S01-B03-SH05.
- **D-R12-3 The phone leaves before 00:00** (SD14) to keep R06 and LF03 untouched.
- **D-R12-4 Pestle warp** (SD12) to keep LF03's frozen top on the new 00:00.
- No open user questions in this revision.

## Change log

- **EDU-EP07-SHEETS-R1 (2026-11-08, Film W5.1):** first timed scene sheets from the W4 voice lock (Kore A atempo 0.95 per-line files, D01–D03), script R1.1, brief R1, rows R1 and the W3 v2 look frames. Total **1795 f = 59.83 s** (≤ 60 s) by placement only: gaps 0.20–0.53 s, stinger 1.47 s, tail 1.40 s; no overlap, no retime, no script trim. Measured word anchors (energy pauses + Whisper), projection run on a `ycam.ts` mirror calibrated on LF01; SD01–SD10 (cameras from the built set and the caption band, B04-SH05 pan right, stool 2 at +1 h, Jupiter direction, the clock at 00:59). NEEDS-GEN NG-M1 exact 100 bpm 900 f loop, NG-S1 one-shots, NG-S7 quick double bark. Rows → EDU-EP07-ROWS-R1.1 (timed; text changed on S01-B03-SH04 and S01-B04-SH05). Open Q1–Q3.
- **EDU-EP07-SHEETS-R1.1 (2026-11-08, Film W5.1 revision):** user answers Q1 = c, Q2 = a, Q3 = b. L01 onset G10 → G16 (S01-B01-SH01 27 → 33 f, tilt L25–33); gaps L05→L06, L06→L07, L13→L14 9 → 8 f; **total 1798 f = 59.93 s** (2 f margin); all later lines, cues, shot ranges, event frames, sound cues and seam clocks re-derived (no line retimed, no script change). Clock: one visible rate 9.09×, hidden jump 06:15 → 00:30 in G578–903, `ceil` display, 00:00 on "ศูนย์" G1002 (was G998); SD08 rewritten (R02 holds as written), new SD11 (ring meets Earth's near limb 0.89 su on G1002, so it stays outside the disc on the return). D01 take kept. Store paths for EP07 audio set to `~/ReelsStore/projects/EDU/audio/EDU-EP07-SHORT/{narration,narr-samples}/` (D01/D02 = the `narr-samples` audition takes, md5-checked; `nar95-lines.json` still missing). Rows → EDU-EP07-ROWS-R1.2.
- **EDU-EP07-SHEETS-R1.2 (2026-11-08, Film W5.1 revision for script R1.2):** L06–L07 retired with S01-B03-SH02/SH03 and SET-GW (IDs not reused); L05 re-voiced (take A, voiced 4.77 s, onset G410 after 15 f of picture); new **S01-B03-SH05** (559–647: V01 + L15, CUS laughs at a cat clip on his phone, no alert); S01-B03-SH04 restaged (647–760: L16 over the last light front, CUS scrolls then pockets the phone, music out on "แม้แต่ข่าวร้าย", tick alone 15 f, the race); everything from L08 on **−218 f**, "ศูนย์" = 00:00 on **G784**; **total 1580 f = 52.67 s**, 17 shots. Clock rebuilt in four visible segments (SD08, D-R12-1); ring and Earth φ follow it; pestle warp G721–784 so the top freeze lands on 00:00 (SD12); phone close (SD13), phone pocketed before 00:00 (SD14). Sound: NG-S5/NG-S6/`impact_sub-hit-short_01` and the NG-A3 cutaway swell dropped; V01 and the cat clip (`creature_cat-mrrp_01`, phone-filtered) added; music step-down at L15 and drop-out at "แม้แต่ข่าวร้าย"; library IDs updated to the generated NG set. Captions re-cut for L05/L15/L16 and shifted from L08. Rows → **EDU-EP07-ROWS-R1.3** (ROWS-R1.2 was already taken).
