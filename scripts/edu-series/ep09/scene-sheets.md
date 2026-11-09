# Timed scene sheets and index — EDU-EP09-SHORT (EDU-EP09-SHEETS-R2.2)

- **Deliverable:** `EDU-EP09-SHORT` · **Revision:** EDU-EP09-SHEETS-R2.2 (Film, Draft fix round 3, 2026-11-09: milk box removed from SET-DINING and ELDER's stop arm re-routed (FX13, SD12); pianist-hand look for every macro and dining hand (FX11, FX12, SD11, [fixlist-r3.md](fixlist-r3.md#pianist-hand)); R2.1 Film, Draft fix round 2, 2026-11-09: milk box moved right of ELDER's hands to match Boss 76fbd43 (FX08); S01-B05-SH04 dropped by the user (FX10), its 24 f carried by S01-B05-SH01 (Editor task, SD10); R2 Film W5.1, 2026-11-08: user answers Q-S1 accepted, D01 added as S01-B05-SH04; R1 first timed sheets) · **Status:** `ready-for-dev`, voice-timed: Boss may build plates from this revision (W5.2), Editor may place the narration and assemble the blockout (W5.3). · **Timing:** `checked-with-audio` for the narration (line onsets and ends `meas` on the locked read). Word anchors inside a line are `meas-e` where an energy pause or segment locates them (±3 f) and `est` where only syllable proportion does (B03 sub-line cuts ±8 f, **re-measure on the draft**). V01 and V02 are not generated yet: their slots are `est` and end-anchored (PL05).
- **Evidence:** runtime: none (no composition `src/videos/EDU-EP09-SHORT`, no blockout) · audio: locked read measured from [voice-measure.md](voice-measure.md) "Full read R1.4 s2" plus a Film energy pass on the per-line files (ffmpeg `silencedetect` −32 dB / 0.04 s; 20 ms RMS on L04; no ASR, faster-whisper does not run here); placed on paper, not assembled · render/samples: none · projection: look-frame values as measured in W3 (LF01m, LF02, LF03, LF04); the three changed room cameras (SD01–SD03) come from a Python mirror of `kit/ycam.ts` `orbitYCam`/`camSpace` + `cam-moves.ts` `camOf` (Film scratch, not committed) with estimated fingertip points, so they are `est` · audio/subtitle sync: none (frames computed, not rendered) · user approval: script R1.4 L12 wording (user), storyboard ROWS-R1.8 18/18 ok, look frames R1.8 passed (W3.2), voice lock 2026-11-08 (`ep09-nar-kore-A-r14-full-s2.wav`), **Q-S1 B04 picture change (SD05) accepted** (user via coordinator, 2026-11-08), **D01 ADD** (user via coordinator, 2026-11-08). Not approved: this timing. R2.1: S01-B05-SH04 dropped by the user (fixlist-r2 FX10, 2026-11-09, "ไม่ต้องมีก็ได้", confirmed); the B05-SH01 extension that carries its frames is not user-reviewed yet.
- **Inputs (by revision):** script **EDU-EP09-SCRIPT-R1.4** ([script.md](script.md)); fact-check [fact-check.md](fact-check.md) W1.3 plus the **R1.4 recheck of L12/F013** (Boat, picture rule: the pianist insert is generic hands playing, no finger drill or stretching, no "ฝึกได้" line); brief **EDU-EP09-BRIEF-R1.9** ([film-brief.md](film-brief.md): set plans, VD01–VD27, N1–N11, SP1–SP4, sound direction); storyboard **EDU-EP09-ROWS-R1.8** ([storyboard.md](storyboard.md): rules R01–R09, untimed staging); voice lock [voice-measure.md](voice-measure.md) "Full read R1.4 s2" (store `projects/EDU/voice/ep09-nar-kore-A-r14-full-s2.wav`, 44.98 s; git copy `public/narration/EDU-EP09-SHORT.wav`); look frames and built cameras `src/painted/edu09/` (`scenes.ts`, `handclose.ts`, `dining.ts`, `tendons.ts`, `piano.ts`).
- **Target:** worktree `check-project-pipeline-4ec3f9`, branch `claude/education-series-ep09-storyboard-d3ed3b` at `4cac7ce` (R1 at `8c3755c`) · 30 fps · `durationFrames` **1606** (53.53 s; R1 1582) · 1080×1920 · composition offset 0 (not registered; Editor, never in `src/Root.tsx`) · `video.ending: 'B_loop'`, `endHoldSec: 0`.
- **Baseline (link, not copied):** SET-DINING metres, HAND-CLOSE set-cm (and its dining mapping), PIANO-CLOSE set-cm, axes and scale per the [brief](film-brief.md#projection-contract-and-scale-baseline) and the units line of [storyboard.md](storyboard.md); built anchors win: `SEAT` boy (−0.26, 0.17, −0.62), elder (0.3, 0.06, −0.7), `TABLE_Y` 0.72, `LAMP` (0, 1.45, −0.15) (`dining.ts`); **milk box** removed (R2.2, user FX13): no `JUG` in SET-DINING; ELDER's hands rest at (0.15–0.17, 0.72, −0.15…−0.20) right and (0.4, 0.72, −0.16) left with nothing between or beside them (R2.1 had the box at x 0.255–0.38, R2 and earlier at x 0–0.125; LF02 v4 still shows it, see [Dependencies](#dependencies)); `BOY_WRIST` HAND (0.3, 6.5), `POV`, `DIAG_W` (`handclose.ts`); `pianoCam` (`piano.ts`).
- **Camera lines:** `cam: target, yaw a→b, r, eye, pitch, f, hy, cx` = one kit `camMove` (as [storyboard.md](storyboard.md) units line). A move runs linearly over the whole shot unless the block gives `ease [u0, u1]` (smoothstep between those shot fractions, `camMoveK`).
- **Clocks:** `G` composition frame; shot-local `L` = G − shot start; ranges half-open `[start, end)`. Every event is a pure function of G or L (seek-safe); trembles from `hash(frame)` (brief, Motion / clock).
- **One shot = one timeline scene** (scene ID = shot ID). Every join is a hard cut; S01-B05-SH02 → SH03 continues the same camera path, so that cut is invisible.

<a id="placement-rules"></a>
## Placement rules

- **PL01 Stable:** shot IDs, order, beats, line assignment (`lines`), casting, looks and checks of ROWS-R1.8 stay. Ranges, event frames and the deviations SD01–SD09 change. R2 added one shot, **S01-B05-SH04** (D01, SD09), between S01-B05-SH01 and S01-B05-SH02; **R2.1 drops it** (user, FX10, 2026-11-09): the ID is retired, not reused; no ID is renumbered.
- **PL02 The read is not retimed:** the locked file is placed in four pieces (A–D below), cut inside silences only. Inside a piece every line and gap is exactly as the user locked it (no atempo, no inner cut, no gap edit).
- **PL03 Inserts sit between pieces:** try + V01 between A and B; L04 hold + V02 between B and C; retry between C and D (R2.1: the D01 grin is dropped; the retry shot carries its frames, SD10); the closing hold after D.
- **PL04 Shot starts:** a voice-led shot starts 3 f before the onset frame of its first word (onset frame = floor of the onset in G; last voiced frame = floor of the end). In-line cuts follow the same rule on their word ("เหมือน", "ไม่มี", "ชุด", "พอ").
- **PL05 Character slots are end-anchored:** V01 must end by G197 and V02 by G503. A take shorter than its slot starts later; a take up to 3 f longer starts earlier inside its shot. A take that does not fit goes back to Film (retime), never pushes the later frames.
- **PL06 Rows:** [review-rows.json](review-rows.json) **EDU-EP09-ROWS-R2.1** carries `start`/`end` (G frames) and `untimed: false`, 18 rows; R2.1 removes the S01-B05-SH04 row and gives S01-B05-SH01 1355–1415 with a Thai `changed` note; Thai VO text unchanged. S01-B04-SH01 (R1.9 change) is user-passed (Q-S1, 2026-11-08) and carries no `changed` note.

<a id="narration-placement"></a>
## Narration placement (Editor)

Source = `public/narration/EDU-EP09-SHORT.wav` (= the locked store file). Source frames on a 30 fps clock (`<Audio startFrom endAt>`); every cut point is inside a silence.

| Piece | Source frames [from, to) | Source s | Placed at G | Lines (onset → last voiced frame, G) |
| --- | --- | --- | --- | --- |
| A | 0–128 | 0.000–4.267 | 0 | L01 6 → 118 |
| B | 128–370 | 4.267–12.333 | 197 | L02 206 → 272 · L03 286 → 335 · L04 354 → 425 |
| C | 370–1226 | 12.333–40.867 | 501 | L05 514 → 597 · L06 625 → 757 · L07 771 → 878 · L08 897 → 1020 · L09 1046 → 1191 · L12 1217 → 1348 |
| D | 1226–end (1349.3) | 40.867–44.978 | **1410** (R1 1386) | L15 1418 → 1525 |

- G = source frame + offset (A 0, B +69, C +131, D **+184**; R1 +160, moved by the 24 f D01 insert; R2.1 keeps +184: dropping D01 moves no audio, SD10). Gaps inside a piece are the read's (0.46–0.92 s).
- **Word anchors (G):** L01 "พับนิ้วกลาง" 46 `meas-e`, "ยก" 92 `est`; L02 "นิดเดียว" 222, "หรือไม่ขึ้นเลย" 240 `meas-e`; L03 "อย่า" 302 `est`; L04 "นิ้วโป้ง" 365, "นิ้วชี้" 384, "นิ้วก้อย" 398, "ขึ้นหมด" 409 (`meas-e`: energy segments assigned by order, ±3 f); L05 "มันโดน" 564 `meas-e`; L06 "ปลายแขน" 678 `est`, "ดึงนิ้ว" 696 `meas-e`, "เส้นเอ็น" 716 `est`, **"เหมือน" 730 `est` ±8**; L07 "นิ้วก้อย" 788 `est`, "นิ้วนาง" 846 `meas-e`, **"ไม่มี" 862 `est` ±8**; L08 **"ชุด" 908 `est` ±8**, "แถม" 963 `meas-e`, "แถบ" 989 `est`, "ผูก" 1004 `meas-e`; L09 "พอ" 1083 `meas`, "สายร่วม" 1106, "นิ้วนางเลยติด" 1169 `meas-e`; L12 "เล่นมา" 1258, "แค่ควบคุม" 1296 `meas-e`; L15 "มันแค่" 1474 `meas-e`, "สายร่วม" 1491 `est`.

<a id="total-runtime"></a>
## Total runtime

| Component | Frames | Seconds |
| --- | --- | --- |
| Piece A (head 6 f + L01) to the end of L01 | 119 | 3.97 |
| Try window (L01 end → V01) | 60 | 2.00 |
| V01 slot | 18 | 0.60 |
| V01 → L02 onset (piece B lead-in) | 9 | 0.30 |
| L02 onset → L04 end (read) | 220 | 7.33 |
| L04 hold (three fingers up) | 14 | 0.47 |
| B02-SH02 lead-in + V02 slot | 63 | 2.10 |
| V02 → L05 onset (piece C lead-in) | 11 | 0.37 |
| L05 onset → L12 end (read) | 835 | 27.83 |
| B04 tail + retry (R2.1: + the 24 f of the dropped D01 shot, held stuck ring) | 66 | 2.20 |
| L15 lead-in | 3 | 0.10 |
| L15 (read) + 6 f tail | 113 | 3.77 |
| Closing hold (S01-B05-SH03) | 75 | 2.50 |
| **Total, 18 shots (R2.1; R2 19)** | **1606** | **53.53** |

R2.1: same length, 18 shots (D01 dropped, its 0.80 s kept as the retry hold, SD10). R2: 6.47 s under the 60 s cap (R1 1582 f = 52.73 s, 7.27 s under; D01 takes 0.80 s of that spare time, no voice piece changes). R1 note: 5 f shorter than the coordinator's estimate table (52.90 s). Differences: V01 → L02 0.30 s instead of the read's 0.62 s gap, the taps sit on the words with a 14 f hold after L04 (was a 0.6 s insert), V02 slot 2.0 s (was 1.5), retry 1.2 s with a 0.2 s B04 tail (was 1.0 + the 0.58 s read gap).

<a id="sound-plan"></a>
## Sound plan (whole video; per-shot cues in the shot blocks)

Brief [Sound direction](film-brief.md#sound-direction) owns the music family, levels intent and silence policy; library checked again 2026-11-08 (`~/ReelsStore/library/sound/INDEX.md`, every listed ID present; M1, M2, S1 still not in the library).

| Layer | G range | Source | State |
| --- | --- | --- | --- |
| Dining bed | 0–1214, 1355–1606 | `room_condo-night-quiet_01` + far `tension_clock-pulse_01` | B01 level; −6 dB dip 622–1214 (B03 diagram and its cutaways); back to the B01 level at 1355 |
| Piano room | 1214–1355 | dining bed low-passed and lower, no clock | B04 only |
| M1 motif | 203–622 | NEEDS-GEN M1 (fallback `bed_curious-explainer-light_01`) | enters soft at 206 (L02), out by 622 (cut to the diagram) |
| Cord plucks | 622–1043 | `pluck_soft-note-01_01`…`06_01` | per shot |
| Taut tone | 1169–1214 | `tone_thin-unresolved_01` | cut dead at 1214 |
| M2 piano | 1214–1355 | NEEDS-GEN M2 (fallback `bed_edu06-felt-piano-theme_01` excerpt, no wrong notes) | first note on G1214, phrase ends by 1355 |
| L15 phrase + tag | 1415–1582 | sparse plucks; `stinger_pizz-tag-ending_01` (UT15) at 1525, trimmed ≤ 57 f with a 15 f fade | tag silent from G1582 (24 f before the seam) |

- **Seam audio:** G1582–1605 and G0–G6 are room tone and clock only. Editor makes the bed continuous across the loop (bed phase at G1605 → G0, or a 6 f crossfade at both ends) so two loops play without a click or level bump.
- **NEEDS-GEN (unchanged from the brief):** M1 (cheeky pizzicato + muted marimba, 90 bpm, loopable 20 s); M2 (gentle fluent solo piano phrase, 88–90 bpm, about 4.7 s used, no wrong notes, ends on a resolved chord; see SD05); S1 (soft string vibrato flutter, 0.6 s).

<a id="caption-plan"></a>
## Caption plan

White captions with the edu stroke, no band (series default, user 2026-11-06), `captionStyle.bottomEdgeY` 1344, band y 1176–1344, ≤ 2 lines, break after "…" when a cue wraps; `video.chrome` `@TamMaiLa` top-left; label "ภาพประกอบ" in its slot (R01, R06). Cue = `[phrase onset frame, last voiced frame + 6)`, capped at the next cue's onset; text verbatim from the script (V02 without the bracketed direction).

| Cue | G [start, end) | Thai |
| --- | --- | --- |
| L01a | 6–81 | วางมือแบนบนโต๊ะ พับนิ้วกลางลงไป… |
| L01b | 81–124 | แล้วลองยกนิ้วนางดูสิ |
| V01 | 179–202 `est` | ไม่ขึ้น! |
| L02 | 206–278 | ยกได้นิดเดียว… หรือไม่ขึ้นเลยใช่ไหม |
| L03 | 286–341 | เบา ๆ นะ อย่าเอามืออีกข้างดึง |
| L04 | 354–431 | แต่นิ้วโป้ง… นิ้วชี้… นิ้วก้อย… ขึ้นหมด |
| V02 | 455–508 `est` | ตาก็ยกไม่ขึ้นเหมือนกันแหละ |
| L05a | 514–564 | นิ้วนางไม่ได้อ่อนแอนะ… |
| L05b | 564–603 | มันโดนอะไรรั้งไว้ |
| L06a | 625–696 | กล้ามเนื้อที่ยกนิ้ว อยู่ที่ปลายแขน… |
| L06b | 696–763 | ดึงนิ้วผ่านเส้นเอ็น เหมือนสายเชิดหุ่น |
| L07a | 771–846 | นิ้วชี้กับนิ้วก้อย มีกล้ามเนื้อเสริมของตัวเอง… |
| L07b | 846–884 | นิ้วนางไม่มี |
| L08a | 897–963 | ต้องใช้ชุดเดียวกับนิ้วกลางและนิ้วก้อย… |
| L08b | 963–1026 | แถมเส้นเอ็นยังมีแถบเล็ก ๆ ผูกกันอยู่ |
| L09a | 1046–1083 | มักอธิบายกันว่า… |
| L09b | 1083–1169 | พอนิ้วกลางพับลง สายร่วมก็ถูกกดไว้ |
| L09c | 1169–1197 | นิ้วนางเลยติด |
| L12a | 1217–1258 | แล้วนักเปียโนล่ะ… |
| L12b | 1258–1354 | เล่นมาหลายปี แค่ควบคุมได้ดีกว่าคนทั่วไป |
| L15a | 1418–1474 | นิ้วนางคุณไม่ได้ขี้เกียจหรอก… |
| L15b | 1474–1531 | มันแค่ใช้สายร่วมกับนิ้วข้าง ๆ |

- No cue during the try window (124–179), the retry (1355–1418; R2.1, D01 dropped) or the closing hold (1531–1606). V01 and V02 cues move with their takes inside the slots (PL05).
- **Open check (Editor, W5.3):** stroke legibility on the bright wood of the macro plates (B01-SH01, B02-SH01, B05-SH02): `scripts/caption-zone.py --band 1176:1344` and a viewed sheet; if a cue is not legible, report to Film and the user (no darkening or band move on your own).

<a id="staging-deviations"></a>
## Staging deviations from ROWS-R1.8 (Film decisions)

- **SD01 S01-B01-SH02 hy drift.** The R1.4 push r 1.60→1.52 brings the table fingertips to y ≈ 1186–1190 at the shot end (mirror, `est`), inside the band. Now `hy 780→748` over the same push: tips ≈ 1154 (BOY) / 1158 (ELDER) at L47. LF02 (frame 0) is unchanged.
- **SD02 S01-B03-SH07 camera.** Was yaw 6→5, r 1.52→1.47 (table tips ≈ 1176–1188, in the band). Now `yaw 6→5, r 1.56→1.52, hy 768→752`: table tips ≤ 1158, the raised hand y ≈ 932–1040.
- **SD03 S01-B03-SH08 camera.** Was r 1.60→1.55 (BOY's tips ≈ 1177 at the end). Now `yaw 7→6, r 1.60→1.56, hy 780→764`: tips ≤ 1155; the 2 cm lifts ≈ 33 px.
- **SD04 Lengths from the locked read (the five flagged shots).** B01-SH02 1.60 s (row 1.4): V01 → L02 tightened to 0.30 s instead of the read's 0.62 s gap; the outraged face holds 6 f after V01. B02-SH02 2.37 s (row 1.5): V02 is a laugh plus 8 syllables, about 2.0 s; 1.5 s could not carry it. B02-SH03 3.70 s (row 3.0): the read's 0.92 s pause after "มันโดนอะไรรั้งไว้" is kept as the question's hang; the shrug stinger plays in it and the push lands on the cut into the reveal. B03-SH04 4.47 s (row 3.6): after "นิ้วนางเลยติด" the stuck state holds still for 0.77 s (the read's gap before L12) before the hard cut. B05-SH01 1.20 s (row 1.0): the retry was compressed in R1.5; 1.2 s lets the hair-lift read and settle before L15 (B04 tail 0.2 s instead of the 0.58 s read gap).
- **SD05 S01-B04-SH01 pianist picture (Boat's R1.4 picture rule).** Was "one finger at a time, thumb → little and back" (reads as a five-finger exercise). Now a short melodic phrase in mixed finger order with a dyad and a closing three-note chord, legato, inside the C–G position (no stretch, no spread, no finger held up alone). The row's Thai title, VO and `seen` change; brief VD20 changed in BRIEF-R1.9.
- **SD06 S01-B02-SH01 taps on the words.** The taps land inside L04 on each word (they were a 0.6 s insert after it); the hold after L04 is the three-fingers-up frame (14 f).
- **SD07 Camera eases.** B02-SH03 push `ease [0.2, 1.0]` now ends on the cut; B03-SH03 push `ease [0.30, 0.72]` so the ties arrive as the camera settles; B03-SH04 `ease [0, 0.75]`, still for the held stuck frame; B05-SH03 `ease [0, 0.6]`, still for the last 30 f.
- **SD08 B05-SH02 tail.** SH02 ends 6 f after L15's last voiced frame so the tag's attack lands in SH02; the closing hold stays 2.5 s.
- **SD09 S01-B05-SH04 ELDER's grin (D01, R2; user ADD 2026-11-08).** The script cue "ELDER grins" in the retry, dropped for time in BRIEF-R1 (D01), is restored as a 24 f (0.80 s) high two-shot between the retry and L15, taken from the 7.27 s spare time. Reasons: the try ends with the grandpa who shares the stuck finger (CL01) reacting warmly to BOY's failed retry, the script's beat; the two-shot is the only frame that shows BOY's stuck hand and ELDER's face together; it reuses B01-SH04's camera, so no new set or look. Effect: piece D and S01-B05-SH02, SH03 move +24 f; nothing before G1391 moves; the retry stays 36 f. **R2.1: dropped** (user, FX10, 2026-11-09); see SD10.
- **SD10 S01-B05-SH01 carries the dropped D01 frames (R2.1; Editor task).** The 24 f G1391–1415 go to the shot before: S01-B05-SH01 becomes **1355–1415 (60 f, 2.00 s)**; S01-B05-SH02 keeps 1415–1531 and SH03 1531–1606. Reason: nothing is voiced or captioned in G1355–1417 (`cues.ts`: L12b ends 1354, L15a starts 1418; piece D is placed at G1410 and its first voiced frame is 1418), so extending SH01 leaves every narration piece, word anchor, caption, the tag at 1525 and the B_loop seam (G1582–1605 → G0) where they are. Rejected: (a) starting SH02 at 1391 would open the L15 POV 27 f before the voice and break PL04 (voice-led shots start 3 f before the first word); (b) cutting the 24 f out would pull piece D, the L15 captions, the tag and the closing hold 24 f earlier and change the ending timing.
- **SD11 Pianist hand look (R2.2, user FX11/FX12).** Every macro and dining hand (BOY, ELDER; the B04 pianist already is one) gets the full, soft hand body of [fixlist-r3.md](fixlist-r3.md#pianist-hand): back-of-hand dome with a rolled light-to-core-shadow gradient, thumb-web and little-finger edges bowing outward, knuckle bumps, a tapered wrist flaring into a rounded heel; palm side with full thenar/hypothenar pads and soft creases. Volume only: lengths, SPLIT, poses and every event frame unchanged. Owner: kit `drawPalm` (`hands.ts`), dining `paintTableArm` wrist join (`dining.ts`).
- **SD12 Milk box removed, ELDER's stop arm re-routed (R2.2, user FX13).** `JUG` leaves the set. S01-B01-SH04: hand path and frames kept; elbow forward on the wood (0.20, 0.746, −0.36) → (−0.04, 0.746, −0.34) (`est`, solved against `man-elder` limb lengths), lean up to −0.22 m, stop point may shift up to +0.04 m in x; acceptance in [fixlist-r3.md](fixlist-r3.md#fx13-staging).

<a id="shot-map"></a>
## Shot map

| Shot | Beat | G [start, end) | Frames / s | Row R1.8 s | Lines / claims | Look |
| --- | --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | B01 | 0–155 | 155 / 5.17 | 5.2 | L01, try · F001 | LF01 |
| S01-B01-SH02 | B01 | 155–203 | 48 / 1.60 | 1.4 | try, V01 | LF02 |
| S01-B01-SH03 | B01 | 203–283 | 80 / 2.67 | 2.4 | L02 · F001, F002 | (LF01) |
| S01-B01-SH04 | B01 | 283–351 | 68 / 2.27 | 2.1 | L03 · F017 | (LF02) |
| S01-B02-SH01 | B02 | 351–440 | 89 / 2.97 | 2.8 | L04 · CL02 | (LF01) |
| S01-B02-SH02 | B02 | 440–511 | 71 / 2.37 | 1.5 | V02 · CL01 | (LF02) |
| S01-B02-SH03 | B02 | 511–622 | 111 / 3.70 | 3.0 | L05 · F012 | (LF01) |
| S01-B03-SH01 | B03 | 622–727 | 105 / 3.50 | 3.3 | L06 to "เส้นเอ็น" · F003 | LF03 |
| S01-B03-SH07 | B03 | 727–768 | 41 / 1.37 | 1.0 | L06 "เหมือนสายเชิดหุ่น" | (LF02) |
| S01-B03-SH02 | B03 | 768–859 | 91 / 3.03 | 3.3 | L07 to "นิ้วนาง" · F005 | (LF03) |
| S01-B03-SH08 | B03 | 859–905 | 46 / 1.53 | 1.0 | L07 "ไม่มี", L08 "ต้องใช้" | (LF02) |
| S01-B03-SH03 | B03 | 905–1043 | 138 / 4.60 | 4.5 | L08 from "ชุดเดียวกับ" · F006, F004 | (LF03) |
| S01-B03-SH09 | B03 | 1043–1080 | 37 / 1.23 | 1.4 | L09 "มักอธิบายกันว่า" · F007 | (LF02) |
| S01-B03-SH04 | B03 | 1080–1214 | 134 / 4.47 | 3.6 | L09 from "พอนิ้วกลางพับลง" · F007 | (LF03) |
| S01-B04-SH01 | B04 | 1214–1355 | 141 / 4.70 | 4.5 | L12 · F013, F017 | LF04 |
| S01-B05-SH01 | B05 | 1355–1415 (R2 1355–1391) | 60 / 2.00 | 1.0 | retry · CL03 | (LF01) |
| ~~S01-B05-SH04~~ (R2 D01; **dropped R2.1**, FX10) | — | — (was 1391–1415) | — | — | frames carried by B05-SH01 (SD10) | — |
| S01-B05-SH02 | B05 | 1415–1531 (R1 1391–1507) | 116 / 3.87 | 4.0 | L15 · F004, F006 | (LF01) |
| S01-B05-SH03 | B05 | 1531–1606 (R1 1507–1582) | 75 / 2.50 | 2.5 | hold, seam | (LF01) |

Beats: B01 0–351, B02 351–622, B03 622–1214, B04 1214–1355, B05 1355–1606. Longest stretch without a character on screen: B03-SH03, 4.60 s. Label "ภาพประกอบ" in its slot from G631 to G1355 without a blink (R01), and again G1491–1521 (ghost; R1 G1467–1497).

<a id="shot-sheets"></a>
## Shot sheets

Casting, set points, poses and looks not restated here are in [storyboard.md](storyboard.md) per-shot staging and the brief; this sheet owns the frames and the values it changes. Poses in HAND-CLOSE cm unless named.

### S01-B01-SH01 · 0–155 · LF01 our own hand, the try (L01)
- **Time:** L01 onset L6, "พับนิ้วกลาง" L46, "ยก" L92 (`est`), last voiced L118; try silence L119–154 (the first 1.2 s of the window).
- **Staging:** BOY's left hand `flat` at `BOY_WRIST`, still L0–5. L46–60 the middle folds under to `test-fold-middle` (knuckle ridge to y 3.0, the other three arch, tips on the wood). From L92 the ring strains (`ring-strain`: MCP −4°, no tip gap, tremble ±0.08 cm, two crease strokes over the ring knuckle), held to L154.
- **Camera:** `cam: (0, 1.5, 1.0), yaw 0, r 28→26, eye 40→38, f 3500, hy 750, ease [0, 1]` (= `POV`). Measured LF01 (L0): silhouette 585 px wide, tips y 345–398, wrist y 1113; end: wrist y 1144.
- **Sound:** dining bed + far clock at the B01 level; no music; NAR L01. Mix: hold (instruction clear).
- **Captions:** L01a, L01b.
- **Entry → exit:** G0 = the loop frame (identical to G1605 (R1 G1581): camera, pose, light, bed) → TP `ring-strain`, the same hand that ends on the table in SH02.
- **Accept:** SP1; at L60 the folded middle reads as folded (its knuckle bump between index and ring); ring tip gap 0 px L92–154; no music before G206.

### S01-B01-SH02 · 155–203 · LF02 strain face, V01
- **Time:** strain L0–23; V01 slot L24–41 (G179–196, end-anchored at G197, PL05); hold L42–47.
- **Staging (SET-DINING, R1.8 points):** BOY `front`, test hand (middle MCP) (−0.20, 0.72, −0.09) `ring-strain`, elbow (−0.13, 0.746, −0.32); right hand flat (−0.33, 0.72, −0.12), elbow (−0.405, 0.746, −0.33); ELDER's right hand flat (0.15, 0.72, −0.15), cuff behind the hand; casting **`boy-school, new: seated-hands-on-table, new: strain`**. L0–23 `new: strain` with a small shoulder tremble; L24–28 head lifts and turns 15° toward screen-right; L24–41 `angry` + `talk`; hold `angry` L42–47.
- **Camera (SD01):** `cam: (−0.26, 1.00, −0.62), yaw 7→6, r 1.60→1.52, eye 0.98, pitch −2°, f 1650, hy 780→748, cx −245`. LF02 (L0) measured: BOY head 409 px (y 447–856), ELDER's face whole at the right. L47 (`est`): table tips y ≈ 1154 / 1158, head top ≈ 413.
- **Sound:** bed and clock only; V01 dry and close, nothing under it. Mix: hit on V01.
- **Captions:** V01 (moves with the take).
- **Entry → exit:** BOY's left hand in `ring-strain` (continues SH01's end) → `angry`, face toward ELDER.
- **Accept:** comic, not pained (R02); head ≈ 409 px at L0; no fingertip below y 1160 at L47; V01 ends by G197.

### S01-B01-SH03 · 203–283 · low macro, the hair-lift (L02)
- **Time:** L02 onset L3, "นิดเดียว" L19, "หรือไม่ขึ้นเลย" L37, last voiced L69.
- **Staging:** TP. L19–26 the ring tip lifts to 0.4 cm (`TP_LIFTS['ring-hair']`), L27–35 holds with tremble, L36–41 drops back; tip on the wood from L42 to the end.
- **Camera:** `cam: (0, 1.5, −1.5), yaw 168→164, r 26, eye 8, f 2000, hy 760` (CAM-TRY). Est: tips y ≈ 890–955, hair-lift ≈ 33 px.
- **Sound:** M1 enters soft at L3; NG-S1 tremble at L19 (fallback: silence). Mix: lift (small).
- **Captions:** L02.
- **Entry → exit:** TP, ring flat → TP, ring flat (lift on camera).
- **Look (R2.2, SD11):** pianist hand body, wrist tapering into a rounded heel (no flat tube seam).
- **Accept:** SP1 hair-lift ≥ 25 px with a visible shadow gap at L27; gap 0 px from L42; R2.2: at L30 the hand body rolls light to core shadow in ≥ 3 tone steps, no edged highlight.

### S01-B01-SH04 · 283–351 · the stop (L03)
- **Time:** L03 onset L3, "อย่า" L19 (`est`), last voiced L52.
- **Staging (SET-DINING):** BOY's left hand TP at (−0.14, 0.72, −0.26); right hand from (−0.38, 0.72, −0.28) moves toward his left ring finger from L6; ELDER's right hand lifts from (0.17, 0.72, −0.20) at L12 and slides straight across (built `gentleStopAt` 76fbd43: arc peak +0.07 m mid-move; R2.2: no milk box in the set) to settle palm-down over BOY's right wrist at (−0.25, 0.72, −0.205) at L27 (R2.2 may move up to +0.04 m in x, still over the wrist, ≥ 4 cm short of the left hand); R2.2 (SD12): his elbow comes forward on the wood, (0.20, 0.746, −0.36) → (−0.04, 0.746, −0.34) `est` (R2.1 trailed over the back edge, (0.19, 0.746, −0.46) → (−0.13, 0.746, −0.45), and read stretched); ELDER's body leans in (−0.18, 0, +0.10) m over L10–27 (`ELDER_LEAN`; R2.2 up to −0.22 m in x if the solve needs it); his left hand rests at (0.4, 0.72, −0.16), elbow (0.47, 0.746, −0.38), as in the other dining shots; both hands lower to the table L27–47; ELDER `happy`, a small head shake L30–40; BOY `worried` → `neutral` at L40. Casting: BOY **`new: reach-own-hand`**, ELDER **`new: gentle-stop`**.
- **Camera:** `cam: (−0.05, 0.86, −0.42), yaw −12→−8, r 1.30→1.24, eye 1.62, pitch −30°, f 1150, hy 760`. Est: BOY head 485–731 at x ≈ 350, ELDER head 371–665 at x ≈ 745, hands y ≈ 856–945.
- **Sound:** M1 low. Mix: hold.
- **Captions:** L03.
- **Entry → exit:** BOY right hand flat at (−0.38, 0.72, −0.28) → under ELDER's palm on the table; BOY's left hand TP throughout.
- **Accept:** no finger touched (R02); the stop lands at L27, after "อย่า"; ELDER's cuff ends at his wrist behind the hand (R1.8); SP3; R2.2: no milk box; at L27 and L47 ELDER's right upper arm and forearm each within ±10% of his left arm's segments, elbow bent ≥ 25°; both characters' hands show the SD11 dome and thumb web.

### S01-B02-SH01 · 351–440 · three taps (L04)
- **Time:** L04 onset L3; "นิ้วโป้ง" L14, "นิ้วชี้" L33, "นิ้วก้อย" L47, "ขึ้นหมด" L58 (`meas-e`, ±3 f); last voiced L74; hold L75–88.
- **Staging:** TP. Thumb up L14–21 (2.5 cm), down L22–26 (tap L26). Index up L33–40 (4.0 cm), down L41–45 (tap L45). Little up L47–52 (3.0 cm), down L53–56 (tap L56). L58–65 all three lift together and hold to L88; ring flat with a small tremble (SD06).
- **Camera:** CAM-TRY `yaw 168→160`, r 26, eye 8, f 2000, hy 760. Est: index lift ≈ 340 px, little ≈ 230, thumb ≈ 165.
- **Sound:** `foley_soft-landing-tap_01` at L26, L45, L56 (fallback `foley_knife-tok-wood_01` first 0.12 s, low-passed); M1 continues. Mix: hit ×3, then hold.
- **Captions:** L04.
- **Entry → exit:** TP all down → thumb, index, little up, ring down.
- **Accept:** each tap within ±2 f of its landing and after its word onset (re-measure the words on the draft); ring gap 0 px L0–88; three shadow gaps open at L65.

### S01-B02-SH02 · 440–511 · grandpa fails too (V02)
- **Time:** V02 slot L3–62 (G443–502, end-anchored at G503, PL05): laugh about L3–14, line about L15–62 (`est`); hold L63–70.
- **Staging (SET-DINING):** ELDER `front`, right hand TP at (0.16, 0.72, −0.30) (macro size 1.25, `ring-strain` tremble); `laugh` from L3, shoulders bounce at L5 and L13; line delivered warm. BOY at frame left `surprised`, look down-right at ELDER's hand.
- **Camera:** `cam: (0.12, 0.95, −0.45), yaw −6, r 0.95, eye 1.02, pitch −6°, f 1250, hy 620` (static). Est: ELDER's hand ≥ 150 px wide at y ≈ 866–925.
- **Sound:** V02 (laugh acted inside the TTS line); M1 ducked under V02. Mix: lift (warm).
- **Captions:** V02 (from the line's first word, moves with the take).
- **Entry → exit:** ELDER's hand TP → TP (continues into B02-SH03 and B03-SH09).
- **Accept:** SP3; ELDER's ring reads flat beside the arched others; V02 ends by G503.

### S01-B02-SH03 · 511–622 · two hands, not weakness (L05)
- **Time:** L05 onset L3, "มันโดน" L53, last voiced L86; pause L87–110.
- **Staging (HAND-CLOSE):** BOY's left TP at the origin; ELDER's right TP at (−30, 0, 4) (mirrored, thumb toward −x); both ring fingers flat, faint tremble.
- **Camera:** `cam: (−15, 1.5, 3)→(−4, 1.5, 2), yaw 0, r 44→30, eye 36→27, f 1250, hy 650, ease [0.2, 1.0]` (push L22–110, lands on the cut). Est: start ELDER thumb x ≈ 30, BOY thumb x ≈ 990, hands y ≈ 570–840.
- **Sound:** M1; `stinger_pizz-shrug_01` at L87 (right on the end of "ไว้", rings into the pause); M1 thins under the pause. Mix: hit, then hold.
- **Captions:** L05a, L05b.
- **Entry → exit:** both hands TP, both rings flat → the same, framed on BOY's hand.
- **Look (R2.2, SD11):** both hands get the pianist hand body (ELDER older surface, spots kept; BOY smoother).
- **Accept:** both hands fully in frame at L0; the stinger starts after the last word, not under it; R2.2: at L0 and L110 each hand body rolls light to core shadow in ≥ 3 tone steps, thumb-web and little-finger outlines bow outward, no edged highlight.

### S01-B03-SH01 · 622–727 · see-through, the forearm muscle (L06 to "เส้นเอ็น")
- **Time:** L06 onset L3, "ปลายแขน" L56 (`est`), "ดึงนิ้ว" L74, "เส้นเอ็น" L94 (`est`); cut at L104 = 3 f before "เหมือน" (`est` ±8).
- **Staging:** BOY's left hand `flat` (pose change hidden by the cut), forearm to the elbow. L0–17 skin fades to 28 % from the fingertips to the elbow; L9 label on (held to G1355); L56 shared muscle glows coral; L74–94 the four cords pulse once, muscle to tips; L80 the puppet-cross ghost (40 %, four short strings) appears 4 cm above the belly and holds to L104. Diagram **`new: tendon-diagram`** (`tendons.ts`).
- **Camera:** `cam: (0.3, 1.5, 12), yaw 0, r 40→37, eye 58→55, f 2350, hy 660` (= `DIAG_W`). Measured LF03 (u 0.75): tips y 221–273, wrist 513, muscle 591–1017, elbow 1259 (in the band; nothing critical), cords ≈ 11 px.
- **Look:** room dims to 70 %; diagram self-lit (brief).
- **Sound:** `reveal_glass-shimmer-soft_01` at L0; M1 out at L0; bed −6 dB from L0; `pluck_soft-note-01_01`…`04_01` at L74, L77, L80, L83. Mix: release into the reveal.
- **Captions:** L06a, L06b (crosses into SH07).
- **Entry → exit:** flat opaque hand → see-through, cords relaxed, puppet ghost on.
- **Accept:** SP2 (cords ≥ 6 px); R01 (no flesh read, label on from L9).

### S01-B03-SH07 · 727–768 · marionette hand (L06 "เหมือนสายเชิดหุ่น")
- **Time:** "เหมือน" L3 (`est` ±8); L06 last voiced L30.
- **Staging (SET-DINING):** seating as B01-SH02 (R1.8). BOY's left elbow stays at (−0.13, 0.746, −0.32); the hand (middle MCP) lifts L0–7 from (−0.20, 0.72, −0.09) to (−0.19, 0.83, −0.14), palm down, fingers hanging (MCP 15°, PIP 25°, DIP 10°, **`new: hand-lifted-dangle`**); L8–40 the wrist bobs ±0.012 m in y at 3 Hz (10 f period), each finger 1 f behind the previous from index to little. BOY `surprised` L0–14 → `happy` from L15, head 10° down, look at the raised hand. ELDER at the right edge `happy`, look at BOY's hand. No speech.
- **Camera (SD02):** `cam: (−0.26, 1.00, −0.62), yaw 6→5, r 1.56→1.52, eye 0.98, pitch −2°, f 1650, hy 768→752, cx −245`. Est: raised MCP y ≈ 932–940, hanging tips ≈ 1036–1055 over the bob, table tips ≤ 1158.
- **Look:** room 100 % (a cut out of the dimmed diagram).
- **Sound:** plucks 01–04 at L9, L11, L13, L15 (quicker than SH01); bed stays at the B03 dip. Mix: hold.
- **Captions:** L06b continues to G763.
- **Entry → exit:** BOY's left hand flat on the wood (matches SH01's flat diagram hand) → raised, mid-bob; right hand flat.
- **Accept:** elbow on the wood every frame; no finger pulled or bent back (R02); five separate dangling fingers at 270 px; label on.

### S01-B03-SH02 · 768–859 · own extras, not the ring (L07 to "นิ้วนาง")
- **Time:** L07 onset L3, "นิ้วก้อย" L20 (`est`), "นิ้วนาง" L78 (`meas-e`); cut at L90 = 3 f before "ไม่มี" (`est` ±8).
- **Staging:** index's own muscle (forearm, thumb side) and cord light teal L3–9; little's own L20–26; L78–83 the ring cord flashes cream once, alone, and holds to L90; thumb unlit.
- **Camera:** DIAG-W `r 37→33, eye 55→50`, f 2350, hy 660 (the push resumes from SH01's end across SH07).
- **Sound:** `pluck_soft-note-05_01` at L3, `06_01` at L20, a lone `03_01` at L78, ringing over the cut. Mix: hit, hit, then a single hit.
- **Captions:** L07a, L07b.
- **Entry → exit:** see-through, cords relaxed → index and little extras teal, ring cord cream.
- **Accept:** R03 (the ring has no second cord); thumb unlit; the ring flash on screen ≥ 10 f before the cut (re-check with the draft's "ไม่มี" frame).

### S01-B03-SH08 · 859–905 · suspicious ring finger (L07 "ไม่มี", L08 "ต้องใช้")
- **Time:** "ไม่มี" L3 (`est` ±8); L07 last voiced L19; L08 onset L38; cut at L45 = 3 f before "ชุด" (`est` ±8).
- **Staging (SET-DINING):** seating as SH07; BOY's left hand flat at (−0.20, 0.72, −0.09). L0 `suspicious` (one brow up, side-eye), look at the left hand; L5–10 index and little lift 2.0 cm (MCP extension only) and hold; ring, middle, thumb flat. ELDER at the right edge `happy`. No speech.
- **Camera (SD03):** `cam: (−0.26, 1.00, −0.62), yaw 7→6, r 1.60→1.56, eye 0.98, pitch −2°, f 1650, hy 780→764, cx −245`. Est: lifts ≈ 33 px, tips ≤ 1155.
- **Sound:** no SFX; SH02's lone pluck decays; bed at the B03 dip. Mix: hold.
- **Captions:** L07b to G884; L08a from G897.
- **Entry → exit:** hand flat → index and little up 2 cm, ring down.
- **Accept:** ring gap 0 px; lifts ≥ 20 px; label on.

### S01-B03-SH03 · 905–1043 · shared set and the ties (L08 from "ชุดเดียวกับ")
- **Time:** "ชุด" L3 (`est` ±8), "แถม" L58, "แถบ" L84 (`est`), "ผูก" L99 (`meas-e`); L08 last voiced L115; hold L116–137.
- **Staging:** L3–13 shared muscle and the middle, ring and little cords turn amber; L84–92 the middle–ring tie draws in; L99–107 the ring–little tie; both held to L137.
- **Camera (SD07):** `cam: (0.3, 1.5, 12)→(−1.2, 1.8, 3), yaw 0, r 33→16, eye 50→24, f 2350→2000, hy 660→640, ease [0.30, 0.72]` (push L41–99). Est at the end: ties y ≈ 610–645, x ≈ 420–560.
- **Sound:** plucks 01–03 as a soft chord at L6; one soft pluck at L84 and L99. Mix: lift.
- **Captions:** L08a, L08b.
- **Entry → exit:** DIAG-W framing, extras teal → DIAG-B on the back of the hand, shared set amber, both ties on.
- **Accept:** SP2 (both ties ≥ 20 px tall at L137); both ties present (R03).

### S01-B03-SH09 · 1043–1080 · grandpa knows (L09 "มักอธิบายกันว่า")
- **Time:** L09 onset L3; the comma pause after "กันว่า" runs to the cut.
- **Staging (SET-DINING):** B02-SH02 staging held: ELDER's right hand TP at (0.16, 0.72, −0.30) (size 1.25, ring flat, faint tremble). L0 `smug`, look toward BOY; two slow nods (9 f down-up, 6°) at L6 and L18. BOY at frame left `neutral`, look at ELDER's face. No speech.
- **Camera:** `cam: (0.12, 0.95, −0.45), yaw −6→−4, r 0.95→0.92, eye 1.02, pitch −6°, f 1250, hy 620`. Est (mirror): ELDER's hand y ≈ 942–1026; BOY's test hand off frame left.
- **Sound:** no SFX; NAR; bed at the dip. Mix: hold.
- **Captions:** L09a.
- **Entry → exit:** ELDER's hand TP (as B02-SH02's exit) → TP, after the second nod.
- **Accept:** SP3 framing; ring reads flat; the nod reads knowing, not mocking; label on.

### S01-B03-SH04 · 1080–1214 · pinned (L09 from "พอนิ้วกลางพับลง")
- **Time:** "พอ" L3 (`meas`), "สายร่วม" L26, "นิ้วนางเลยติด" L89 (`meas-e`); last voiced L111; held still L112–133; hard cut at G1214.
- **Staging:** TP with the diagram. L3–12 the middle cord darkens and bends round its folded knuckle (held); L26–38 the middle–ring tie pulls toward the middle; L89–95 the ring cord straightens taut (highlight, 1–2 px vibration); L92–101 the ring tip rises 0.3 cm (`TP_LIFTS['ring-diagram']`) and stops; held to L133.
- **Camera (SD07):** CAM-TRY `yaw 168→172, r 26→24`, eye 8, f 2000, hy 760, `ease [0, 0.75]` (still from L100).
- **Sound:** `tone_thin-unresolved_01` from L89, held, **cut dead at G1214** (no tail, no crossfade). Mix: hold, then the tone builds tension.
- **Captions:** L09b, L09c.
- **Cut to B04:** hard cut at G1214, 3 f before L12; the first M2 note on G1214 is the release; light jumps to the cool piano top light; the dining bed drops out and the piano room takes over; label stays on (both shots labelled).
- **Entry → exit:** TP with the diagram on, cords relaxed → middle held, tie pulled, ring cord taut, tip 0.3 cm up, still.
- **Accept:** R02 (no pain cue); the taut cord distinct from the relaxed cords; frames L100–133 identical except the 1–2 px vibration; no tone in G1214.

### S01-B04-SH01 · 1214–1355 · LF04 the pianist (L12)
- **VO:** `แล้วนักเปียโนล่ะ… เล่นมาหลายปี แค่ควบคุมได้ดีกว่าคนทั่วไป` (script R1.4).
- **Time:** L12 onset L3, "เล่นมา" L44, "แค่ควบคุม" L82 (`meas-e`), last voiced L134; tail L135–140.
- **Staging (PIANO-CLOSE, SD05):** pianist's right hand (`size 1.2`, generic tone, dark sleeve, no face) in the C–G position, wrist (4, 6, 16) with ±0.3 cm drift; thumb C, index D, middle E, ring F, little G. Provisional presses (shot-local, key down 1.0 cm in 2 f, held legato to 1 f before the next): L0 E · L10 G · L20 F · L30 D · L42 C+E held to L60 · L64 D · L74 F · L84 E · L96 G · L108 C+E+G held to L140. Fingers not pressing stay curved 0.5–1.0 cm over their keys. Once M2 exists, Editor gives Boss its note onsets and the presses move onto them (one press per audible note), keeping the rules below.
- **Picture rule (Boat, R1.4 recheck):** generic hands playing music. No run through all five fingers in order, no finger raised high or held up alone, no stretching or spreading beyond the C–G position, no exercise, no on-screen text except the label.
- **Camera:** `cam: (6, 2, 2), yaw 80→74, r 34→31, eye 40, f 2300, hy 880` (= `pianoCam`). Measured LF04 (u 0.4): tips y 794–1062, wrist (238, 886).
- **Look:** cool top light, dark surround (brief VD20).
- **Sound:** M2 first note on L0, phrase resolves on the C+E+G chord at L108 and decays to L140; piano room tone; no clock. Mix: release, then lift.
- **Captions:** L12a, L12b.
- **Entry → exit:** cut in on a key press → the closing chord held; music stops on the cut to B05-SH01.
- **Accept:** R05 (generic, faceless, no logo); the picture rule above; at least one press with the ring finger (F); label on in its slot; no wrong-sounding note in M2.

### S01-B05-SH01 · 1355–1415 (R2 1355–1391) · the retry
- **Time:** no speech; 60 f (R2.1, SD10: + the 24 f of the dropped S01-B05-SH04).
- **Staging (HAND-CLOSE):** from `flat`, the middle folds to TP L0–9; L14–18 the ring trembles up 0.4 cm, drops by L27 (CL03); still L28–35; R2.1: L36–59 the stuck TP holds (ring tip gap 0, ring micro-tremble ±0.05 cm from `hash(frame)` as in S01-B05-SH03, nothing else moves). Event frames L0–35 unchanged.
- **Camera:** CAM-TRY `r 26→25`, yaw 168, eye 8, f 2000, hy 760, `ease [0, 0.6]` (R2.1: the push keeps about its R2 speed and lands by L36, then holds L36–59).
- **Look:** room 100 %, warm.
- **Sound:** music out at L0; bed and clock back at the B01 level; NG-S1 tremble at L14, its tail decays into room tone and clock; no SFX L36–59; piece D's lead-in silence starts at G1410 (L55, room tone only). Mix: drop, then hold.
- **Entry → exit:** flat → TP, ring stuck after the hair-lift; R2.1: hard cut to S01-B05-SH02 at G1415 (L15 onset at SH02 L3), pose change hidden by the cut as before.
- **Accept:** hair-lift visible and ≤ 0.4 cm; ring gap 0 px L28–59; no music, caption or label in G1355–1414.
- **Editor (R2.1, Draft fix round 2):** set the scene to 1355–1415 (60 f) and remove S01-B05-SH04 from the timeline; leave SH02, SH03, narration, captions and sound frames as they are; re-cut the B05 clips for the review page.

### ~~S01-B05-SH04~~ · dropped R2.1 (was 1391–1415, D01 grin)
- **Dropped** by the user on the Draft review (fixlist-r2 FX10, 2026-11-09: "ไม่ต้องมีก็ได้อันนี้ผมว่า", confirmed). ID retired, not reused. Its 24 f are carried by S01-B05-SH01 (SD10; Editor closes the gap). The R2 staging, camera and sound block is in Git history (SHEETS-R2).

### S01-B05-SH02 · 1415–1531 (R1 1391–1507) · not lazy, shared string (L15)
- **Time:** L15 onset L3, "มันแค่" L59 (`meas-e`), "สายร่วม" L76 (`est`), last voiced L110; tail L111–115.
- **Staging:** BOY's hand `flat`; L76–99 a 35 % ghost of the shared cords and both ties glows across the middle, ring and little fingers; L100–106 it fades; label on only L76–106.
- **Camera:** CAM-POV `r 26→26.8, eye 38→39`, f 3500, hy 750 (continues into SH03).
- **Look:** frame 0's light.
- **Sound:** sparse plucked phrase from L3; `stinger_pizz-tag-ending_01` at L110 (end of the last word; peak about −10 dB, trimmed ≤ 57 f, 15 f fade). Mix: lift, then the tag hit.
- **Captions:** L15a, L15b.
- **Entry → exit:** flat → flat, ghost gone.
- **Accept:** ghost never above 35 %; label only while the ghost shows; the tag starts on the last word's end.

### S01-B05-SH03 · 1531–1606 (R1 1507–1582) · hold and loop seam
- **Time:** no speech; 75 f.
- **Staging:** hand `flat`; ring tremble ±0.05 cm L0–29, still from L30.
- **Camera (SD07):** CAM-POV `r 26.8→28, eye 39→40`, f 3500, hy 750, `ease [0, 0.6]`, still L45–74 = B01-SH01's L0 camera.
- **Sound:** the tag ends by G1582; room tone and clock only G1582–1605, continuous into G0 (seam audio, [sound plan](#sound-plan)). Mix: release.
- **Entry → exit:** flat → G1605 identical to G0.
- **Accept:** SP4 (last frame = frame 0 within render-run noise); no tag audio in G1582–1605; two loops play without a click.

<a id="handoff"></a>
## Boss and Editor handoff (W5.2 / W5.3)

- **Boss (W5.2), from this revision:** N2 tendon diagram hardening (Film look asset in `tendons.ts`), N3 SET-DINING (`dining.ts`), N4 seated-hands-on-table (episode `paintTableArm` exists; the kit pose is missing), N5 reach-own-hand / gentle-stop, N6 strain face, N8 piano: `pianistHand` presses one finger only, so **dyads and the closing chord need a multi-finger press** (SD05), N11 hand-lifted-dangle; lift tracks per finger from `TP_LIFTS` and `liftFinger`; SP1–SP4. Shot groups of 3–5 (AI01): suggested G1 B01-SH01..SH04, G2 B02 + B05-SH01, G3 B03 diagram shots (SH01, SH02, SH03, SH04), G4 room cutaways (B03-SH07, SH08, SH09) + B04-SH01 (R2 also B05-SH04, dropped R2.1), G5 B05-SH02, SH03 + seam. **R2 kit note (D01):** no named `grin` expression exists in `src/painted/kit/expressions.ts` (`laugh` has the `grin` mouth with shut eyes; `happy` has `smile`); ELDER's face in B05-SH04 is the FaceState `{brow: 'up', eyes: 'dot', mouth: 'grin'}`, built from existing kit parts (`head.ts` mouth `grin`), so it is **not a new asset**; Boss may file it as a named `grin` expression at kit intake (optional). R2.1: B05-SH04 dropped, so nothing in this deliverable uses the grin face. **R2.2 (Draft fix round 3, [fixlist-r3.md](fixlist-r3.md)):** SD11 pianist hand in kit `drawPalm` + `paintTableArm` wrist join; SD12 remove `JUG`/`paintJug` from `dining.ts`, re-solve ELDER's stop arm in `tracks.ts` `gentleStopAt` (elbow forward, lean, stop x within the limits).
- **Editor (W5.3):** composition `src/videos/EDU-EP09-SHORT` (then `store.py use` for `public/narration/EDU-EP09-SHORT.wav`, pending since W4); narration pieces A–D; V01 and V02 TTS within their slots (PL05); NG-M1, NG-M2, NG-S1; captions per the plan; re-measure the B03 cut words ("เหมือน", "ไม่มี", "ชุด") and the L04 tap words on the draft and send the frames to Film if any moves by more than 3 f. **R2.1 (Draft fix round 2, Editor task):** drop S01-B05-SH04 from the timeline and extend S01-B05-SH01 to 1355–1415 (SD10); `durationFrames` stays 1606, no audio or caption frame moves. **R2.2 (Draft fix round 3):** after Boss lands SD11/SD12, re-render every scene whose cache key moves (kit `hands.ts` touches all hand shots), no timing change; rewrite the review-rows clips keys; frame check B01-SH03 L30, B01-SH04 L27/L47, B02-SH03 L0/L110 against bfa78a5.

<a id="dependencies"></a>
## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | N1 hand macro (`hands.ts`, 847c064): flat, TP, ring-strain, lifts | existing, exists-unintegrated (no composition) |
| Boss | N2 `tendons.ts`, N3 `dining.ts`, N8 `piano.ts` (Film look assets, LF02–LF04) | exists-unintegrated; Boss hardens |
| Boss | N4, N5, N6, N11; multi-finger piano press (SD05) | missing |
| Boss | ~~B05-SH04 ELDER grin face~~ | N/A (shot dropped R2.1) |
| Editor | V01, V02 TTS; NG-M1, NG-M2, NG-S1; composition | missing |
| Editor | Re-measure B03 sub-line cuts and L04 taps on the draft (±8 f / ±3 f) | open |
| Film | Check SD01–SD03 tip heights on the first draft frames (mirror / hand estimates, not renders); B05-SH04 dropped R2.1 | open |
| Editor | R2.1: remove S01-B05-SH04, extend S01-B05-SH01 to 1355–1415 (SD10); re-cut its review clip | open |
| Boss | R2.2: SD11 pianist hand (`hands.ts` `drawPalm`, `dining.ts` wrist join); SD12 box out + ELDER stop arm (`dining.ts`, `tracks.ts`) | missing |
| Editor | R2.2: re-render the moved scenes, rewrite clips keys, frame check | open |
| User (via coordinator) | FX14: S01-B02-SH01 verdict `change` with no note; what to change? | open |
| Film / coordinator | R2.1: the LF02 still (`out/edu09/look-frames/v3/LF02.png`) shows the milk box at its old place between the sitters; the code (76fbd43) puts it beside ELDER. Re-render LF02 as v4 from `EDU9-LF02` (a refresh of a passed look frame, not a new look) so the review page matches the plates; R2.2: v4 still shows the box (now removed) and the old palm, re-render as v5 after SD11/SD12 | open |

- **Element captures:** look frames LF01, LF01b, LF02, LF03, LF04 (`out/edu09/look-frames/v1/`, LF02 `v3/`; store `projects/EDU-EP09-SHORT/look-frames/`), R1.8 kit thumb; LF04's key-contact pose is a placeholder. No new captures in this pass.
- **Editor scene sample proposal:** B02-SH01 (taps on the words) and B03-SH04 → B04-SH01 (the dead-cut tone and the first piano note on one frame).
- **D01 — added (user ADD, 2026-11-08, via coordinator):** S01-B05-SH04, G1391–1415, 24 f (SD09). **Dropped R2.1** (user, Draft fix round 2 FX10, 2026-11-09); frames carried by S01-B05-SH01 (SD10).
- **Q-S1 — accepted (user, 2026-11-08, via coordinator):** the B04 picture plays a short tune with a closing chord (SD05). Row S01-B04-SH01 is user-passed; its `changed` note is removed in ROWS-R2.0 (coordinator records `pass` for `reviews/S01-B04-SH01@board` if the page does not hold it yet).

<a id="change-log"></a>
## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP09-SHEETS-R1 | 2026-11-08 | Film | First timed scene sheets (W5.1) from the W4 voice lock (R1.4 s2, 44.98 s): 18 shots, 1582 f = 52.73 s; narration in four pieces with the read's gaps kept; SD01–SD08 (band-safe hy drifts on B01-SH02, B03-SH07, B03-SH08; lengths of the five flagged shots; pianist picture per Boat's R1.4 rule; taps on the words; eases; SH02 tail); caption plan; ROWS-R1.9 timed; brief R1.9. |
| EDU-EP09-SHEETS-R2 | 2026-11-08 | Film | User answers 2026-11-08 (via coordinator): Q-S1 accepted (B04 tune picture, SD05; row user-passed); D01 ADD: new shot S01-B05-SH04 (ELDER's grin, T-PAIR-L03 end camera, 24 f) at G1391–1415 from the spare time (SD09). Piece D +24 f (placed G1410); S01-B05-SH02 → 1415–1531, S01-B05-SH03 → 1531–1606; L15 captions, word anchors, label ghost, tag and seam frames +24; 19 shots, 1606 f = 53.53 s; voice pieces unchanged. ROWS-R2.0, BRIEF-R2.0. |
| EDU-EP09-SHEETS-R2.1 | 2026-11-09 | Film | Draft fix round 2 (fixlist-r2): FX08 milk box position synced to Boss 76fbd43 (`JUG` x 0.255–0.38, right of ELDER's right hand, beside his body in close-ups; baseline line); S01-B01-SH04 ELDER stop restated from the built `gentleStopAt` (hand straight across from (0.17, 0.72, −0.20), elbow over the back edge, left arm at rest, lean); FX10 S01-B05-SH04 dropped (ID retired), its 24 f G1391–1415 carried by S01-B05-SH01 → 1355–1415 (SD10, Editor task); 18 shots, 1606 f unchanged, no narration, caption, tag or seam frame moves; LF02 still flagged for a refresh (old box place). ROWS-R2.1, BRIEF-R2.1. |
| EDU-EP09-SHEETS-R2.2 | 2026-11-09 | Film | Draft fix round 3 ([fixlist-r3.md](fixlist-r3.md) FX11–FX14): SD11 pianist hand look for every macro and dining hand (B01-SH03, B02-SH03 look/accept lines; volume only, no length, pose or frame change); SD12 milk box removed from SET-DINING (baseline line), S01-B01-SH04 ELDER elbow forward on the wood, lean and stop-x limits, arm-length acceptance; Boss/Editor handoff and dependencies; FX14 B02-SH01 open question for the user; LF02 v5 needed. 18 shots, 1606 f, no narration, caption or event frame moves. |
