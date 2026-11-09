# Timed scene sheets and index — EDU-EP13-SHORT (EDU-EP13-SHEETS-R2.0)

- **Deliverable:** `EDU-EP13-SHORT` · **Revision:** EDU-EP13-SHEETS-R2.0 (Film, 2026-11-09, W5.1: first timed sheets from the W4 voice lock; the number continues the ROWS/BRIEF line, storyboard and rows move to ROWS-R2.0) · **Status:** `ready-for-dev`, voice-timed: Boss may build plates from this revision (W5.2), Editor may place the voice and assemble the blockout (W5.3); Ton may make the cues in [Sound cues for Ton](#sound-cues-for-ton). · **Timing:** `checked-with-audio` for line onsets, the listed anchors and every slot length (measure file below); anchors marked `est` are word onsets inside a line read off the 10 ms energy dips of the locked file (±3 f, not listened); Editor measures them at W5.3 and moves the tied key by the same frames without a Film revision (PL05).
- **Evidence:** runtime: none (no composition, no blockout) · audio: placed on paper from [measure.json](measure.json) (EDU-EP13-SCRIPT-R4, `ep13-nar-kore-slow6.wav`, 41.14 s, speech 0.19–40.71 s, `audio-measured`); not assembled, not heard by the user · render/samples: none · projection: cameras computed with the kit `orbitYCam`/`camSpace` formula (`src/painted/kit/ycam.ts`) replicated in Python; built cameras in `src/painted/edu13/scenes.ts` match the brief values · user approval: storyboard 16/16 `ok` (ROWS-R1.4/R1.5 content, unchanged here), looks LF01–LF04, LF04b, FL1–FL3 locked; no timing approval.
- **Inputs (by revision):** script **EDU-EP13-SCRIPT-R4** ([script.md](script.md), Thai unchanged) · [fact-check.md](fact-check.md) W1.3 + R2/R3 rechecks + R4 check (R09, R10 picture limits) · brief **EDU-EP13-BRIEF-R1.5** ([film-brief.md](film-brief.md); VD01–VD32, set plans with the R1.2 offsets, sound codes M1, A1–A3, S1–S23, TR1–TR7; not edited here) · storyboard **EDU-EP13-ROWS-R1.5 → R2.0** ([storyboard.md](storyboard.md), [review-rows.json](review-rows.json)) · [task.md](task.md).
- **Target:** branch `claude/education-ep13-5b4635` at `8431ca8` · 30 fps · `durationFrames` **1390** (46.33 s; target 40–60 s) · 1080×1920 · composition offset 0 (not registered; Editor, never in `src/Root.tsx`) · ending closed, 2.63 s hold.
- **Baseline (link, not copied):** spaces `R`, `M`, `D`, `S`, axes and units per the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline) and set plans. **All room numbers below are the shifted R1.2 values** (OX 0.50 on the chart group and chart-camera targets, DS 0.15 on the sofa group): MAN chart mark (0.50, 0, 0.35), giant feet centre (1.85, 0, 0.35), body x 0.95 → 2.75, chart centre x 0.50, MAN seat (3.30, 0.30, 0.45), dog (4.15, 0.30, 0.45). Street marks MAN (0.20, 0, 0), giant (1.50, 0, −0.60) (brief R1.2). Dog-free zone: every giant-flea room frame stays at x ≤ 2.95 at the actors' plane.
- **Camera lines:** `cam: target (x, y, z), yaw a→b, r, eye, f, hy[, pitch]` = one kit `camMove` (`orbitYCam`; yaw positive swings the camera toward +x). **`hy` is the eye-height (horizon) row** as the kit uses it (`y = hy − f·(Y − eye)/depth`); the storyboard's "row of the target" wording was wrong, its numbers were already eye-row numbers. A move runs linearly over the shot unless `ease [u0, u1]` is given.
- **Clocks:** `G` composition frame; shot-local `L` = G − shot start (written `+n`); ranges half-open `[start, end)`. Every event is a pure function of G or L (seek-safe).
- **One shot = one timeline scene** (scene ID = shot ID). Every join is a hard cut; the trailer inset in B04-SH02 is a DOM layer inside its shot.

<a id="placement-rules"></a>
## Placement rules

- **PL01 Stable:** shot IDs, order, beats, line-to-shot assignment (the rows' per-shot VO split is kept exactly), casting, looks, clue IDs CL01–CL02, deviations D01–D14 and rules R01–R10 of ROWS-R1.5 / BRIEF-R1.5 stay. Ranges, event frames, the four `hy` values in [SD01](#sd01) and the trailer hold numbers change.
- **PL02 Voice is placed, not retimed:** narration = `out/edu13/voice/full/ep13-nar-kore-slow6.wav` (store copy: Editor files it at W5.3 and cites the store path here). It is cut only at three silent points inside line gaps and each piece is shifted whole; no atempo, no inner cut:

  | Piece | Read range (s) | Shift | Holds |
  | --- | --- | --- | --- |
  | N1 | 0.00–4.69 | +10 f (0.333 s) | L01 |
  | N2 | 4.69–8.52 | +26 f (0.867 s) | L02 |
  | N3 | 8.52–31.31 | +72 f (2.400 s) | L03, L05, L06, L07, L09, L15, L16 |
  | N4 | 31.31–end | +90 f (3.000 s) | L12, L13, L14 |

  G of a narration point = round(read s × 30) + shift. Inserted silence: 10 f lead-in (room tone and the sleeping dog first, so the room reads before the first word, UT01), 16 f for TR01, 46 f for V01, 18 f for the crouch and V02. 100 f in all.
- **PL03 Shot starts:** a narration-led cut sits **3 f before the onset frame** of the shot's first word; exceptions with reasons in the shot blocks (SH04C starts at the launch's end, B01-SH05 and B04-SH02 start in a gap, B05-SH02 ends on the hold).
- **PL04 Slots:** V01 and V02 are placed start-anchored at their slot frame. A take shorter than its slot leaves the shot end where it is (the picture holds); a take longer than the slot goes back to Film (retime), never pushes later frames.
- **PL05 Estimated anchors:** a key tied to an `est` word moves with Editor's measured onset (±3 f) without a Film revision; a move of more than 3 f, or one that would cross a shot cut or the rows' VO split, comes back to Film.
- **PL06 Rows:** [review-rows.json](review-rows.json) **EDU-EP13-ROWS-R2.0** carries `start`/`end` (G) and `untimed: false`; title, VO, seen and sound are unchanged on all 16 shots (timing is outside the storyboard hash, so the user's verdicts hold).

<a id="narration-placement"></a>
## Timeline and voice placement (Editor)

| Item | G on | G off | Shot | Word anchors (G; measure file unless `est`) |
| --- | --- | --- | --- | --- |
| lead-in | 0 | 16 | B01-SH01 | room tone, S1 dog breathing; no voice |
| L01 | 16 | 140 | SH01 → SH04B | "หมัดกระโดดได้สูงกว่า" 16 · "สูงกว่า" 30 `est` · "หลายสิบเท่า" 43 `est` · "ถ้ามันตัวเท่าคุณ" 79 · "คุณ" 102 `est` · "จะกระโดด" 112 `est` · "ข้ามตึก" 122 `est` · "ได้มั้ย" 132 `est` |
| TR01 | 140 | 177 | SH04B, SH04C | no speech, 37 f (1.23 s): launch, rise, apex hold |
| L02 | 177 | 274 | SH04C, SH04D | "ไม่หรอก" 177 · "มันน่าจะกระโดดได้" 198 · "หลักสิบเซน" 231 `est` · "พอ ๆ กับคุณ" 253 |
| V01 | 282 | ≤ 324 | B01-SH05 | MAN "เฮ้ย… ตัวเท่าเราเลย!" slot 42 f (≤ 1.40 s), separate take |
| L03 | 335 | 410 | B02-SH01 | "ขามันแรงขึ้น" 335 · "ก็จริง" 359 `est` · "แต่ตัวก็หนักขึ้นตาม" 379 · "หนัก" 392 `est` |
| L05 | 428 | 510 | B02-SH03 | "เหมือนขาคุณแรงสองเท่า" 428 · "แต่แบกเป้หนักสองเท่า" 476 · "แบกเป้" 480 `est` |
| L06 | 529 | 593 | B02-SH03 | "ตัวใหญ่ขึ้น" 529 · "กระโดดไม่ได้สูงขึ้นตาม" 560 · "ไม่ได้สูงขึ้นตาม" 570 `est` |
| L07 | 614 | 685 | B03-SH01 | "แต่" 614 · "แล้วหมัดตัวจิ๋ว" 637 |
| L09 | 700 | 806 | B03-SH03 | "มันบีบแผ่นยางยืด" 700 · "บีบ" 706 `est` · "แล้วปล่อยทีเดียว" 757 · "ปล่อย" 762 `est` · "เหมือนหนังสติ๊ก" 790 · "หนังสติ๊ก" 796 `est` |
| L15 | 828 | 892 | B04-SH01 | "แล้วหมัดยักษ์ล่ะ" 828 · "หมัดยักษ์" 834 `est` · "ยังต้องพึ่งหนังสติ๊กมั้ย" 863 |
| L16 | 907 | 1004 | B04-SH01 | "ไม่ค่อยต้องแล้ว" 907 · "ขามันยาว" 937 · "มีเวลา" 964 `est` · "กล้าม" 984 `est` · "ดันพื้น" 989 `est` |
| V02 | 1020 | ≤ 1032 | B04-SH02 | MAN "ฮึบ!" slot 12 f (≤ 0.40 s), separate take, on the take-off |
| L12 | 1036 | 1119 | B04-SH02 | "สูงพอ ๆ กัน" 1036 (ends 1059 `est`) · "แค่หลักสิบเซน" 1070 · "ไม่ใช่ร้อยเมตร" 1098 |
| L13 | 1141 | 1239 | B05-SH01 | "แต่ถ้าวัดเป็นเซน" 1141 · "เซน" 1165 `est` · "ปกติ คุณก็กระโดดสูงกว่า" 1175 · "คุณ" 1189 `est` · "สูงกว่า" 1207 `est` |
| L14 | 1257 | 1311 | B05-SH02 | "หมัดดูเก่ง" 1257 · "ก็เพราะตัวมันเล็กมาก" 1284 · "เล็กมาก" 1302 `est` |
| V03 | 1322 | 1358 | B05-SH02 | dog sigh, SFX (Ton, S20 dog sigh 1.2 s), no voice, no subtitle |
| hold | 1311 | 1390 | B05-SH02 | 79 f (2.63 s) after speech end: ending tag, dog, room tone to zero |

- **Total:** speech ends G1311 (43.70 s); hold [1311, 1390) → **1390 f = 46.33 s** (was 1561 f ≈ 52.0 s est; inside 40–60 s).
- **Captions:** = VO, one cue per line (Editor splits long lines at the "…" per the series caption rule), on at the line's G on, off at G off + 6 f or the next cue; V01 and V02 subtitled, V03 and TR01 not. Caption band rows 1176–1344 (edu stroke style, no band fill).
- **Silent stretches:** TR01 1.23 s (picture and trailer bed carry it) · V01 gap 61 f around a 42 f slot · apex freeze 30 f (NAR only) · end hold 2.63 s.

<a id="voices"></a>
## Character voices (Editor, before W5.3)

- **V01** MAN "เฮ้ย… ตัวเท่าเราเลย!": separate TTS take, MAN voice per the brief (Algenib or the edu MAN voice, Editor's call; the take itself is under 10 s, so the user picks from 2–3 takes as the sample). Startled then amazed, the "…" a short gulp. **Length ≤ 1.40 s** (slot 42 f from G282); ideal 1.1–1.3 s. Over 1.40 s returns to Film.
- **V02** MAN "ฮึบ!": separate take, same voice, a short effort grunt on the take-off. **Length ≤ 0.40 s** (slot 12 f from G1020); L12 starts at G1036, so 4 f of air stay after it.
- **V03** dog sigh: not a voice; Ton's S20 dog sigh (NEEDS-GEN, 1.2 s), placed by Editor at G1322.
- Every gap holds its insert; none needs the read to move.

<a id="sd01"></a>
## Staging deviations from ROWS-R1.5 (Film decisions, W5.1)

- **SD01 Feet out of the caption band (framing only).** With `hy` as the eye row, three chart cameras put the floor inside the caption band (CAM-CHART-2S feet row 1188, CAM-CHART-LOW 1199 → 1233, CAM-FLEA-LEGS giant feet 1259 → 1299). Each now holds the floor row at **1158** by lowering `hy` only (target, yaw, r, f unchanged): CAM-CHART-2S hy 740 at r 6.6 (shot 3), 682 at r 5.8 (shot 8 push end), 716 at r 6.3 (shot 13 end); CAM-CHART-LOW hy 659 → 625; CAM-FLEA-LEGS hy 759 → 719. The picture tilts down 30–141 px; the locked looks F3/F4/F6 keep composition and lens, so no look re-approval is asked. CAM-TRUTH (floor 1150), CAM-INSERT (1138) and the macro cameras are unchanged. CAM-SOFA keeps MAN's feet at ≈ 1395 (LF01 look as locked; no contact beat there), and the street back views stay below the band (R07 exception).
- **SD02 Trailer is shorter.** The read moves "ได้มั้ย" to G132 and "ไม่หรอก" follows 37 f after L01 ends; SH04 is 20 f (was 30), SH04C 39 f (was 45; droop 9 f, card off +36 when the silhouette has left the frame). The peak hold stays 9 f (≤ 15 f, R09) and the card rule holds.
- **SD03 Apex freeze 30 f (was 27 f est).** "สูงพอ ๆ กัน" is spoken over the frozen apex and ends at about +47; the landing falls in the 11 f pause before "แค่" (brief handoff question answered).
- **SD04 Macro rest shorter.** B01-SH02 rests 16 f (was 15 of 60) and leaves on "หลายสิบเท่า"; counter steps every 6 f; ×50 shows 4 f while still rising (B-P2 kept).
- **SD05 Dog moves sooner.** The ending tag starts at L14's end (+57 in B05-SH02, was +92); the dog lifts its head at +62 and sighs at +68; the hold after L14 is 2.63 s (rows say about 2.5 s).

## Shot map

| # | Shot | Beat | G range | Len | Lines | Claims / clues |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | [0, 27) | 27 | L01 a | CL01 (chart) |
| 2 | S01-B01-SH02 | B01 | [27, 76) | 49 | L01 b | CL04; CL02 (folded legs) |
| 3 | S01-B01-SH03 | B01 | [76, 109) | 33 | L01 c | VD05 size |
| 4 | S01-B01-SH04 | B01 | [109, 129) | 20 | L01 d (TR01) | R09 card |
| 5 | S01-B01-SH04B | B01 | [129, 156) | 27 | L01 tail (TR01) | R09; CL02 echo |
| 6 | S01-B01-SH04C | B01 | [156, 195) | 39 | TR01, L02 "ไม่หรอก" | R09 hold ≤ 15 f |
| 7 | S01-B01-SH04D | B01 | [195, 278) | 83 | L02 | CL09 |
| 8 | S01-B01-SH05 | B01 | [278, 332) | 54 | V01 | CL02 look |
| 9 | S01-B02-SH01 | B02 | [332, 425) | 93 | L03 | CL10 |
| 10 | S01-B02-SH03 | B02 | [425, 611) | 186 | L05, L06 | CL08/CL10, B-P6 |
| 11 | S01-B03-SH01 | B03 | [611, 697) | 86 | L07 | CL02 recall |
| 12 | S01-B03-SH03 | B03 | [697, 825) | 128 | L09 | CL05, B-P4 |
| 13 | S01-B04-SH01 | B04 | [825, 1012) | 187 | L15, L16 | CL11, R10 |
| 14 | S01-B04-SH02 | B04 | [1012, 1138) | 126 | V02, L12 | CL09, N4 e, R04, R05 |
| 15 | S01-B05-SH01 | B05 | [1138, 1254) | 116 | L13 | CL13, B-P3 |
| 16 | S01-B05-SH02 | B05 | [1254, 1390) | 136 | L14, V03, hold | CL13 |

## Shot sheets

### S01-B01-SH01 · 0–27 · the room (L01 a)

- **Camera:** CAM-SOFA `cam: target (3.30, 0.70, 0.55), yaw 40→39, r 2.80→2.75, eye 1.15, f 1200, hy 850` (LF01 values; slow push).
- **Staging (R m):** MAN `man-parted + home-lounge (cardigan off), P31, neutral` seated front at seat (3.30, 0.30, 0.45), feet (3.30, 0, 0.90), phone face-down on his thigh, eyes on the dog; head ≈ (567, 829), feet ≈ (433, 1395) computed (seated ≈ 570 px). DOG `dog-golden, lie, idle` + `lid: 1`, left profile at (4.15, 0.30, 0.45) ≈ (908, 1288), head toward MAN, breathing. Chart at ≈ (110, 886), background left. Sun patches on the dog and rug.
- **Keys:** +0 frame reads at once (LF01, UT01); +16 L01 starts; +18–+26 MAN's eyes drift up to the window.
- **VO:** "หมัดกระโดดได้…" (+16 → into SH02).
- **Sound:** room tone from +0 (`city_soi-afternoon-day_01` low + A1 fan); S1 dog breathing +0–+27 (the first slow breath of the 5 s cue; the rest is not used here); M1 enters at +6, energy 2, under the voice at −14 dB.
- **Entry → exit:** LF01 → MAN still seated, eyes up; dog asleep.
- **Acceptance:** +0 reads "inside, a home, afternoon, man and sleeping dog" at 270 px · no music in +0–+5 · dog never moves.

### S01-B01-SH02 · 27–76 · macro leap and counter (L01 b)

- **Camera:** CAM-MACRO `cam: target (0, 0.45, 0) mm, yaw 0, r 4.0, eye 0.45, f 1200, hy 900` +0–+15; crane +16–+49: target y rides the flea, r 4.0 → 40 mm, linear, still rising at the cut (no settle, B-P2).
- **Staging (M mm):** FLEA `new: flea` right profile at (0, 0, 0), 2.0 mm, legs folded (CL02), ≈ 600 px long; "2 มม." bar (600 px, y ≈ 1100) and "ภาพจำลอง" in LBL.
- **Keys:** +0–+15 rest; **+16 gone** (on "หลายสิบเท่า" G43 `est`; 1-frame take-off, smear streak, contact shadow stays); bar fades +16–+21; flea shrinks with the pull-back to ≈ 60 px by +40, ring marker from +36; counter pill: ×10 +21, ×20 +27, ×30 +33, ×40 +39, ×50 +45 (heights 20…100 mm); ×50 on screen +45–+48 only while ring and camera still rise; no digit past ×50.
- **VO:** "…สูงกว่าตัวมันหลายสิบเท่า…" ("สูงกว่า" +3 `est`, sentence ends ≈ +23); silence after.
- **Sound:** A2 studio hush replaces room tone at +0; S2 `ui_click-tick_01` at +16; S3 `whoosh_air-swish-rising_01` +16 → through the cut (mono); S4 ticks at +21, +27, +33, +39, +45, rising pitch; M1 continues, energy 2 → 3.
- **Entry → exit:** rest pose → empty sweep, ring rising, ×50 pill.
- **Acceptance:** "2 มม." and "ภาพจำลอง" readable +0–+15 · take-off is one frame · ×50 never held (≤ 4 f) · no ruler, fur or skin.

### S01-B01-SH03 · 76–109 · the grow (L01 c)

- **Camera:** CAM-CHART-2S **fixed** `cam: target (1.45, 1.00, 0.35), yaw 0, r 6.6, eye 1.15, f 2400, hy 740` (SD01).
- **Staging (R m, plane z 0.35):** MAN `man-parted + home-lounge, P02, neutral` front at (0.50, 0, 0.35): feet (195, 1158), head (195, 504), **654 px**, left side; eyes up-left, unaware. Ring marker on the floor at (1.85, 0, 0.35) ≈ (685, 1158) +0–+8. Frame right edge at the plane ≈ x 2.94 (dog-free).
- **Keys:** +3 "ถ้ามัน"; **+4 grow starts** about the feet ground point, k(n) = 900^((n − 4)/22) for n in [+4, +26]; **+26 full size** (1.80 m long, 1.05 m tall; head (1013, 776)) on "คุณ" (G102 `est`); +28 the giant tilts its head up; MAN still thinking; cut +33 before "จะกระโดด".
- **VO:** "…ถ้ามันตัวเท่าคุณ…".
- **Sound:** room tone back at +0 (A2 out); S5 grow glissando +4–+30 (now 0.9 s, see cue list); M1 lifts to energy 3 and **cuts dead on the last frame**.
- **Entry → exit:** MAN P02 thinking, empty ring → full giant at rest beside him, head tilted up.
- **Acceptance:** feet of both ≤ y 1160 · giant's feet never leave the floor during the grow · full size by +26.

### S01-B01-SH04 · 109–129 · trailer 1, the shadow (L01 d)

- **Camera:** CAM-TR-SOI `cam: target (1.0, 8.0, −30), yaw 0, r 46→45.7, eye 1.6, pitch +8, f 1100, hy 900` (brief VD27, SP4 computes; creep scaled to 20 f).
- **Staging (S m, trailer grade N15):** MAN back view P30 at (0.20, 0, 0), ≈ 124 px (est), tiny; tower cropped by the top edge; textless shophouses; nobody else.
- **Keys:** +0 card "ถ้าคิดแบบง่าย ๆ" fades in in TC over 4 f; **+4–+16 the long soft shadow** (N18) sweeps down the road toward the lens and passes over MAN at +10; +10–+18 MAN's head tilts up; cut +20.
- **VO:** "…จะกระโดดข้ามตึก…" ("จะกระโดด" +3, "ข้ามตึก" +13, both `est`).
- **Sound:** M1 out (dead at G109); **TR1 braam at +0** (fiction bed; −10 dB under the voice); soi bed 30 % + A3 high wind; TR2 shadow pass +4–+16 (now 0.5 s); `reveal_riser-tension_01` its last 1.27 s (38 f) from +0 to its dead stop at G147 (SH04B +18).
- **Entry → exit:** dusk soi, MAN looking down the road → shadow passed, head tilting up; card on.
- **Acceptance:** card on from +0 (R09) · no damage, crowd, sign text or digits · MAN reads as the size reference.

### S01-B01-SH04B · 129–156 · trailer 2, crouch and launch (L01 tail)

- **Camera:** CAM-MYTH (trailer grade) `cam: target (1.0, 1.4, 0), yaw −6, r 2.6, eye 0.45, pitch +30, f 820, hy 900` (locked; no push).
- **Staging (S m):** MAN back view P30 at (0.20, 0, 0): feet (206, 1591), head (311, 926), 665 px computed. Giant right profile at (1.50, 0, −0.60): feet (678, 1538), head (881, 1196); folds toward the LF04b pose state `crouch`. Near-silhouette, warm rims. Card on in TC.
- **Look:** LF04b at about +10.
- **Keys:** +0–+16 hind legs fold deeper to `crouch`; **+18 launch** (body out of the top edge by +22, smear streak, small grit swirl, no crack or debris); +18–+27 MAN's head tilts up after it; cut +27.
- **VO:** "…ได้มั้ย" (+3 → L01 ends +11; `est`, the cut sits 3 f before Editor's measured "ได้").
- **Sound:** TR3 drum pulse 4 hits at +0, +7, +12, +15; riser dead stop at +18; **TR4 launch whoosh-boom at +18**; A3 wind on.
- **Entry → exit:** giant at rest folding → empty mark, grit settling, MAN looking up.
- **Acceptance:** +10 matches LF04b · launch on one frame · no debris · card on throughout.

### S01-B01-SH04C · 156–195 · trailer 3, money shot and the break (TR01, "ไม่หรอก")

- **Camera:** CAM-TR-SKY **locked** `cam: target (10, 70, −60), yaw −9, r 327, eye 25, pitch +8, f 3600, hy 820` (LF04; ≈ 11 px/m).
- **Staging (S m + skyline N16):** tower centred against the sun disc; giant as `new: flea silhouette` (N17) at true scale (≈ 20 px) inside the ring marker, dotted trail behind it (`skyTrail`, near-vertical with a slight lean from lower left); apex point `SKY_APEX` (10.8, 134, −60) ≈ row 160. Card on in TC (mid-tower). Sky and sun ungraded (look lock).
- **Keys:** +0 silhouette enters low and rises along the LF04 trail; **+12 apex** (LF04 frame; no end marker, tick or "ผล"); **+12–+21 hold (9 f ≤ 15 f)**; **+21 "ไม่หรอก": tape-stop** (N19: clock eases to a stop over 6 f, frame sags 2 %, grade drains to flat grey); +27–+36 droop arc drops the silhouette out of the frame bottom, trail fades with it; **+36 card off**; cut +39.
- **VO:** "ไม่หรอก…" at +21 (G177, measured); "มันน่าจะ" starts in SH04D.
- **Sound:** TR5 height wind +0–+12 (0.4 s), then near-silence +12–+21 (thin high air only); **TR6 tape-stop at +21** kills the bed; S7 slide-whistle droop from +27 (0.8 s, runs across the cut into SH04D +12); NAR on top.
- **Entry → exit:** empty sky → silhouette gone below, frame grey and sagged.
- **Acceptance:** apex hold ≤ 15 f, broken on the first frame of "ไม่หรอก" (R09) · card on until the silhouette leaves (+36) · no floor count, metre or digit.

### S01-B01-SH04D · 195–278 · plain soi, knee-high hop (L02)

- **Camera:** CAM-MYTH plain (LF03, no grade) `cam: target (1.0, 1.4, 0), yaw −6→−3, r 2.6→2.45, eye 0.45, pitch +30, f 820, hy 900` (slow push).
- **Staging (S m):** MAN back view P30 at (0.20, 0, 0) (as SH04B). Giant right profile drops into (1.50, 0, −0.60) from y 3.0 (row ≈ 783) over +0–+6, lands a little deflated (antennae droop); no arc, no card.
- **Keys:** +0–+6 drop, land +6; **+36 one small hop** on "หลักสิบเซน" (G231 `est`): 0.36 m (feet row ≈ 1404 at the apex), airtime 18 f +36–+54, `new: flea-muscle-jump` small amplitude; +58 "พอ ๆ กับคุณ": MAN's head tips down and turns toward it +58–+70; hold to the cut +83.
- **VO:** "…มันน่าจะกระโดดได้แค่หลักสิบเซน… พอ ๆ กับคุณนี่แหละ" (+3 → +79).
- **Sound:** `city_soi-afternoon-day_01` full + A3 breeze from +0; S7 tail to +12; `foley_soft-landing-tap_01` at +6 and small at +54; M1 re-enters at +10, energy 1.
- **Entry → exit:** empty mark → giant at its mark after the hop, MAN's head turned to it.
- **Acceptance:** hop apex ≈ knee height of MAN, not higher · captions do not hide the hop apex (Editor `caption-zone.py`; if they do, the hop key stays and Editor lifts the cue as allowed by the series rule) · no card.

### S01-B01-SH05 · 278–332 · "เฮ้ย" (V01)

- **Range note:** starts 4 f after L02 ends (gap-led, PL03).
- **Camera:** CAM-CHART-2S `cam: target (1.45, 1.00, 0.35), yaw 0, r 6.6→5.8, eye 1.15, f 2400, hy 740→682, ease [0.11, 0.26]` (push +6–+14, then held; floor row 1158 throughout, SD01). At r 5.8: MAN head (147, 413), 745 px; frame right edge ≈ x 2.80 at the plane (dog-free).
- **Staging (R m):** MAN front at (0.50, 0, 0.35); giant right profile at (1.85, 0, 0.35), rest (shot 3 exit).
- **Keys:** +0–+6 MAN `turn-head-right`; +4 V01 starts; +6–+20 `gasp-recoil` with `shock`, V01 lip-sync; +10–+22 giant `front` head looks at the lens, then back to profile; **+36–+44 MAN's eyes drop**, head tips about 10° to the giant's folded near hind leg (gaze target the knee (1.35, 0.50, 0.35)), `shock` softening to wide-eyed `neutral`; hold to +54. (+36 is tied to V01's "เลย"; Editor moves it with the take.)
- **VO:** MAN "เฮ้ย… ตัวเท่าเราเลย!" +4 → ≤ +46 (subtitled).
- **Sound:** room tone back at +0 (soi bed out); M1 half-beat dropout +0–+12; S8 flinch sting at +8; no cue on the look.
- **Entry → exit:** shot 3 exit staging → MAN wide-eyed, looking at the leg; leg unlit.
- **Acceptance:** leg stays in frame and unlit (clue CL02) · feet ≤ y 1160 during the push · no dog.

### S01-B02-SH01 · 332–425 · strength up, weight up (L03)

- **Camera:** CAM-FLEA-LEGS `cam: target (1.70, 0.55, 0.35), yaw 6→10, r 3.4→3.1, eye 0.9, f 1500, hy 759→719` (SD01; giant feet row 1158; tail ≈ (218, 931) → (197, 905), head ≈ (1016, 896) → (1072, 873); MAN's shoulder at the left edge ≈ x 32).
- **Staging (R m):** giant at rest at (1.85, 0, 0.35).
- **Keys:** coral glow on the hind-leg muscle 0 → 1 from +3 ("ขามันแรงขึ้น") to +92; "แรง ↑" beside the leg at +11; glow ≈ 0.6 at "ก็จริง" (+27 `est`); **+49 weight dial** (no numerals) pops in above the back (≈ row 507 → re-projected), needle swings up +49–+85 in step with the still-rising glow; small down-arrow under the body at +60 ("หนัก" `est`). No digits, "×" or equal bars.
- **VO:** "ขามันแรงขึ้นก็จริง… แต่ตัวก็หนักขึ้นตาม" (+3 → +78).
- **Sound:** M1 back at energy 2; S9 `reveal_warmth-fwoop_01` at +3; S10 floor groan +60–+90 (1.0 s).
- **Entry → exit:** plain giant → leg glowing, dial up, arrow down.
- **Acceptance:** glow and dial carry no figure (Boat R3) · dial pops after "แต่" (+47) · no dog.

### S01-B02-SH03 · 425–611 · backpack insert and refrain (L05, L06)

- **Camera:** CAM-INSERT `cam: target (0, 0.95, 0), yaw 0→3, r 2.9→2.7, eye 1.0, f 1300, hy 690` (MAN feet (361, 1138), head (361, 331), **807 px** computed at r 2.9).
- **Staging (D m):** MAN right profile at (−0.40, 0, 0); GHOST (MAN at 40 %, no glow, no pack) right profile at (+0.40, 0, 0); chart strip at (0, 0, −0.30). "ภาพจำลอง" in LBL +0 to the end.
- **Keys:** +5 coral glow on MAN's legs + "×2"; **+55 backpack** drops onto his shoulders + "×2" ("แบกเป้" `est`); +85–+90 both crouch; **+90 both take off** (0.20 m, 12 f; apex feet row ≈ 1049 at +96, dashed line at that row); **+102 both land** on one frame (2 f before L06); both straighten +104–+112, dashed line stays; **+145 "ไม่ได้สูงขึ้นตาม"** (`est`): dashed line pulses once, MAN swaps to his `front` head, deadpan to the lens, to the end.
- **VO:** L05 "เหมือนขาคุณแรงสองเท่า… แต่แบกเป้หนักสองเท่า" (+3 → +85); L06 "ตัวใหญ่ขึ้น… กระโดดไม่ได้สูงขึ้นตาม" (+104 → +168).
- **Sound:** A2 hush; S11 backpack thump at +55; `whoosh_fast-slide_01` at +90; `foley_soft-landing-tap_01` at +102 (quieter than shot 14's thud); S12 `stinger_pizz-shrug_01` at +145.
- **Entry → exit:** MAN and ghost standing → both landed on one line, MAN front head deadpan.
- **Acceptance:** both feet on the dashed line at +96 within 4 px · landing on one frame · label on throughout (B-P6).

### S01-B03-SH01 · 611–697 · the tiny flea (L07)

- **Camera:** CAM-MACRO `cam: target (0, 0.45, 0) mm, yaw 0→4, r 4.0→3.6, eye 0.5, f 1200, hy 900` (slow push).
- **Staging (M mm):** real flea at rest, legs folded (CL02 recall); "2 มม." bar; "ภาพจำลอง" in LBL.
- **Keys:** still; push only. Ends on the exact rest frame shot 12 opens on.
- **VO:** "แต่… แล้วหมัดตัวจิ๋ว กระโดดเก่งได้ยังไง" (+3 → +74).
- **Sound:** A2 hush (room tone out); M1 thins, energy 1.5.
- **Acceptance:** same flea drawing and pose as shot 2 +0 · no fur, skin or floor.

### S01-B03-SH03 · 697–825 · the spring pad (L09)

- **Camera:** CAM-MACRO-THORAX `cam: target (0, 0.55, 0) mm, yaw 0, r 2.9→2.7, eye 0.55, f 1200, hy 900` (F2 still).
- **Staging (M mm):** "ภาพจำลอง" in LBL. Body goes translucent +0–+6 (cut from the matching rest frame).
- **Keys:** **+9 "บีบ"** (`est`): amber pad squeezes (scale-y 1 → 0.7, glow up) to +37; catch icon clicks shut +39; hold to +65; **+65 "ปล่อย"** (`est`): release, **flea gone at +66** in one frame, smear up, pad glow fading in the air +66–+83; **+99 "หนังสติ๊ก"** (`est`): slingshot icon (the B04 drawing, colour) pops in beside the empty spot; hold to the cut. Not slowed (label stays "ภาพจำลอง", FIX-4).
- **VO:** "มันบีบแผ่นยางยืดในตัวไว้… แล้วปล่อยทีเดียว เหมือนหนังสติ๊ก" (+3 → +109).
- **Sound:** S15 squeeze +9–+37; lock `foley_flashlight-click_01` at +39; **S16 snap + whip at +66**; M1 stops dead at +66; A2 hush only to the end.
- **Entry → exit:** rest → empty spot, slingshot icon (colour).
- **Acceptance:** pad compresses, never stretches (B-P4) · gone on one frame · icon drawing identical to shots 13–14.

### S01-B04-SH01 · 825–1012 · does the giant still need it? (L15, L16)

- **Camera:** CAM-CHART-2S `cam: target (1.45, 1.00, 0.35), yaw 0→−3, r 6.6→6.3, eye 1.15, f 2400, hy 740→716` (slow push; floor row 1158 held; MAN 654 → 692 px; right edge ≈ x 2.94 → 2.90 at the plane, dog-free).
- **Staging (R m):** MAN front at (0.50, 0, 0.35), `neutral`; giant right profile at (1.85, 0, 0.35), rest (shot 3/8 anchors). Slingshot icon (shot-12 drawing, 90 px, colour) anchored to world (1.70, 1.25, 0.35) ≈ (631, 704) → (635, 678), re-projected each frame (DOM); "?" (ink, 40 px) at its upper right.
- **Keys:** +3 L15; **+5 icon pops in with "?"** (scale 0 → 1.1 → 1 over 6 f); +9–+17 the giant tilts its head up to the icon ("หมัดยักษ์" `est`); +30 MAN glances right at the giant; L15 ends +67 (light lift on "มั้ย"). **+80 the "?" pops off (2 f), icon fades colour → grey +80–+92, then stays grey to the cut** (R10); +86–+94 giant's head levels (antennae shrug). **+112 "ขามันยาว": soft white light line** (N21; `#fff6e0` core, `#bfe3ff` glow 50 %, ≈ 10 px) travels along the near hind leg from the hip (1.45, 0.60, 0.35) ≈ (540, 940) through the knee to the foot (1.12, 0, 0.35) ≈ (420, 1158) over +112–+130; even faint glow to +160, out by +172; no figure, ruler, tick or label. +159 "กล้าม" (`est`): MAN's eyes leg → lens → leg by +172. +177–+187 both settle their weight (2 f anticipation, knees soften ≈ 5°); cut +187 before the crouch.
- **VO:** L15 "แล้วหมัดยักษ์ล่ะ… ยังต้องพึ่งหนังสติ๊กมั้ย" (+3 → +67); L16 "ไม่ค่อยต้องแล้ว… ขามันยาว มีเวลาให้กล้ามดันพื้นทัน" (+82 → +179).
- **Sound:** room tone back at +0 (A2 out); M1 resumes at +0, energy 2.5; **S21 question pluck at +5**; **S23 de-tune blip at +80**; **S22 rising tone +112–+130**, stopping as the light reaches the foot; M1 builds a little from +150 into the cut. SFX in syllable gaps (Editor ±3 f).
- **Entry → exit:** two-shot at rest, no icon → grey icon over the back, both settled, ready.
- **Acceptance:** icon never fades out, pops off or is crossed out (R10) · the light is light only · short flea legs not re-shown · no dog.

### S01-B04-SH02 · 1012–1138 · the truth shot (V02, L12)

- **Range note:** starts 8 f after L16 ends (gap-led): crouch and V02 sit in the inserted 32 f before L12.
- **Camera:** CAM-TRUTH **locked** `cam: target (1.45, 1.00, 0.35), yaw 0, r 10.0, eye 1.0, f 3600, hy 790` (no move; brief VD21).
- **Staging (R m, both on z 0.35):** MAN front at (0.50, 0, 0.35): feet (198, 1150), head (198, 502), **648 px**; giant right profile at (1.85, 0, 0.35): feet (684, 1150), head (1008, 772). **Greyed slingshot icon** 60 px anchored to (1.70, 1.25, 0.35) + the giant's jump height: ≈ (630, 700) at rest, (630, 570) at the apex; on screen to the cut; clear of tag (rows 190–300), band (970–1114) and inset (340–600, shown only after the landing).
- **Keys:** **+0–+8 crouch** (both, matched; MAN `new: standing-jump` crouch, giant legs fold); **+8 take-off** with V02; **+17 apex** (MAN feet row 999 at 0.42 m, giant 1020 at 0.36 m); **freeze +17–+47 (30 f)**: band 0.10–0.50 m (rows 970–1114) fades in +18–+24 with "หลักสิบเซน" at its left end; tag "สูงพอ ๆ กัน" (rows 190–300) with a leader to the band pops at +24 with the word; **resume +47**, **landing +56** (both on one frame, in the pause before "แค่" +58); +86 "ไม่ใช่": **inset pops in** upper right (x ≈ 600–1040, rows ≈ 340–600; the SH04C apex frame, tape-stopped grey, card "ถ้าคิดแบบง่าย ๆ" inside, no ruler, no number); **+112 inset snaps off** (5 f after "ร้อยเมตร"); band and tag fade +112–+124; +100 MAN glances at the giant; both straighten; cut +126.
- **VO:** V02 MAN "ฮึบ!" +8 → ≤ +20 (subtitled); L12 "สูงพอ ๆ กัน… แค่หลักสิบเซน ไม่ใช่ร้อยเมตร" (+24 → +107).
- **Sound:** S17 crouch pair at +0; S18 jump pair + V02 at +8; **silence +17–+47** (music and room tone out, NAR only); S19 landing thud at +56 (Editor may move it earlier, never later than +56), room tone back; M1 back at energy 2 from +56; **TR7 braam echo** +86, cut dead at +112 with a pitched-down `ui_click-tick_01`.
- **Entry → exit:** settled two-shot (shot 13 exit, flattened by the lens change) → both standing after the landing, grey icon on the back.
- **Acceptance:** camera never moves (R05) · both apex feet inside the band, giant ≥ 15 px below MAN (R04) · tag says only "สูงพอ ๆ กัน" · inset beside, never on, the band, with the card (R09).
- **Cut note:** shot 13 ends at r 6.3, ≈ 381 px/m, floor 1158; this opens at ≈ 360 px/m, floor 1150: a small flattening, not a new angle. If the draft reads it as a jump, shot 13's push ends at r 6.0 (hy 698) instead.

### S01-B05-SH01 · 1138–1254 · the real measure (L13)

- **Camera:** CAM-CHART-LOW `cam: target (0.55, 0.85, 0.30), yaw −8→−4, r 2.75→2.60, eye 1.0, f 1400, hy 659→625` (SD01; MAN feet row 1158; MAN head (738, 260) → (753, 199), ≈ 900 → 960 px).
- **Staging (R m):** MAN front at (0.95, 0, 0.30), chart at screen left of him. Opens on the giant shrinking away about its feet.
- **Keys:** +0–+12 giant shrinks away (sparkle out by +20; no flea remains); **+27 "เซน"** (`est`): flea mark (line + tiny flea icon) ticks on at 0.15 m (row ≈ 1052 → 1037); **+51 "คุณ"** (`est`): MAN's mark (line + tiny man icon) at 0.42 m (row ≈ 927 → 906); MAN glances down at both +54–+68; **+69 "สูงกว่า"** (`est`): P09 hands on hips, `smug` to the lens; hold to +116.
- **VO:** "แต่ถ้าวัดเป็นเซน… ปกติ คุณก็กระโดดสูงกว่าหมัดตัวจริงอีกนะ" (+3 → +101).
- **Sound:** `comedy_shrink-pop-gliss_01` at +0; ticks at +27 (high) and +51 (low); M1 warm, energy 2.
- **Acceptance:** marks carry no digits (B-P3) · MAN's mark clearly higher · feet ≤ y 1160.

### S01-B05-SH02 · 1254–1390 · home, the dog sighs (L14, V03, hold)

- **Camera:** CAM-SOFA `cam: target (3.30, 0.70, 0.55), yaw 37→35, r 2.65→2.55, eye 1.15, f 1200, hy 850` (very slow push to the last frame).
- **Staging (R m):** MAN in front of his seat, feet (3.30, 0, 0.90), standing ≈ 911 px computed → `sit-down` (front, 1.8 s) +0–+54 onto (3.30, 0.30, 0.45), `relieved` → `neutral`. DOG at (4.15, 0.30, 0.45), asleep.
- **Keys:** L14 +3 → +57 as he settles; +62 the dog lifts its head (`new: dog-head-lift-sigh`); **V03 sigh +68–+104**; lies back down by +118; hold to +136.
- **VO:** "หมัดดูเก่ง… ก็เพราะตัวมันเล็กมาก" (+3 → +57).
- **Sound:** S20 sofa press at +40; **`stinger_pizz-tag-ending_01` at +57** (end of "เล็กมาก"; 2.5 s, rings out by +132); S1 collar jingle at +62; dog sigh +68; room tone fades to zero at +135; no loop seam.
- **Acceptance:** dog never scratches and no flea in frame (R01) · tag starts after the last word · last frame silent.

## Sound cues for Ton

<a id="sound-cues-for-ton"></a>
All cue descriptions are in the brief's [Sound direction](film-brief.md#sound-direction); only the timing-driven changes and the G frames are here. `fiction` = trailer bed (Boat R3).

| Code | G | Change vs brief |
| --- | --- | --- |
| M1 pulse | in 6, dead 109; back 205; dropout 278–290; thins 611; dead 763; back 825; out 1029–1068; back 1068 | 104 bpm bed; total ≈ 46 s now, a 50 s file is enough |
| A1, A2, A3, room/soi beds | per shot blocks | none |
| S1 breathing / jingle | 0–27; jingle 1316 | first breath only in shot 1 |
| S5 grow | 80–106 | **0.9 s** (was 1.3 s): the grow is 22 f |
| TR1 braam (fiction) | 109 | none (2.5 s, runs under SH04–SH04B) |
| TR2 shadow pass (fiction) | 113–125 | **0.5 s** (was 0.9 s) |
| riser `reveal_riser-tension_01` | 109–147 | last **1.27 s** (was 1.6 s), dead stop on 147 |
| TR3 drum pulse (fiction) | 129, 136, 141, 144 | 4 hits over **0.53 s** |
| TR4 launch (fiction) | 147 | none |
| TR5 height wind (fiction) | 156–168 | **0.4 s** rise then near-silence to 177 |
| TR6 tape-stop | 177 | none (0.4 s) |
| S7 droop | 183–207 | none (0.8 s; crosses the SH04C/SH04D cut) |
| landing taps | 201, 249 | none |
| S8 flinch sting | 286 | none |
| S9 / S10 | 335 / 392–422 | S10 **1.0 s** (was 1.2 s) |
| S11 / hop whoosh / tap / S12 | 480 / 515 / 527 / 570 | none |
| S15 / click / S16 + whip | 706–734 / 736 / 763 | none |
| S21 / S23 / S22 | 830 / 905 / 937–955 | none |
| S17 / S18 / S19 | 1012 / 1020 / 1068 | none |
| TR7 echo + tick | 1098–1124 | 0.87 s audible, cut dead |
| shrink pop / mark ticks | 1138 / 1165, 1189 | none |
| sofa / tag / dog sigh | 1294 / 1311 / 1322 | dog sigh 1.2 s; tag 2.5 s ends 1386 |

Library files still "not listened" (Ton confirms by ear before use): `reveal_riser-tension_01`, `stinger_pizz-tag-ending_01`, `whoosh_air-swish-rising_01`, `reveal_warmth-fwoop_01`, `stinger_pizz-shrug_01`, `comedy_shrink-pop-gliss_01`, `foley_soft-landing-tap_01`, `foley_flashlight-click_01`, `ui_click-tick_01`, `whoosh_fast-slide_01`.

## Prop states (pre-handoff check)

| Prop | Entry → exit per shot |
| --- | --- |
| MAN's phone | shot 1 face-down on his right thigh; not seen again (off the sofa during the macro cut, D06); not in shot 16 (on the sofa arm, unseen) |
| Backpack (insert) | shot 10 drops onto both shoulders at +55, worn to the cut; hands free for the crouch (straps only) |
| Slingshot icon | shot 12 colour from +99 → shot 13 colour +5, grey from +92 → shot 14 grey throughout, rides the giant; never removed |
| Trailer card | SH04 +0 → SH04C +36; inside the shot-14 inset +86–+112 |
| Marks (B05) | flea mark +27, MAN's mark +51, both to the cut |

## Boss and Editor handoff (W5.2 / W5.3)

- **Boss:** assets N1–N21 and spikes SP2–SP4 as in the brief ([New assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies-w52)); build plates from these ranges and keys only. Camera code: set the `hy` values of SD01 (CAM-CHART-2S, CAM-CHART-LOW, CAM-FLEA-LEGS; `scenes.ts` keeps the look-frame constants for the stills). Priority for the first draft group: shots 3, 8, 13, 14 (one set, one lens family), then trailer 4–6 (SP4), then macro 2, 11, 12.
- **Editor:** place the four narration pieces (PL02), record V01/V02 ([voices](#voices)), cut on the G ranges, measure the `est` anchors and move tied keys (PL05), build captions, and run `caption-zone.py` on shots 5, 7 (street views: giant body in the band rows) and 16.
- **Draft checks for Film (W5.3 review):** shot 1 at 0.9 s reads as the room (UT01); shot 2's 16 f rest is enough to read "2 มม."; SH04 at 20 f still shows the shadow pass; the 13 → 14 cut (above).

## Dependencies and open items

| Owner | Item | Status |
| --- | --- | --- |
| Editor | V01 (≤ 1.40 s) and V02 (≤ 0.40 s) takes, MAN voice; user picks | open |
| Editor | Store path of `ep13-nar-kore-slow6.wav`; user has not heard the full read | open |
| Ton | NEEDS-GEN cues with the lengths above | open |
| Boss | N2–N21 missing or `exists-unintegrated`; SP2–SP4 | open |
| Film | Review the draft against the checks above | after W5.3 |

Element captures: look stills `out/edu13/look-frames/v5/` (LF01–LF03, F1–F6), `v6/LF04.png`, `v7/LF04b.png` (code `src/painted/edu13/` uncommitted over `eb1b583`); they show composition and look, not motion or these `hy` values.

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP13-SHEETS-R2.0 | 2026-11-09 | Film | First timed sheets (W5.1) from the W4 voice lock (`measure.json`, slow6, 41.14 s). Narration cut into four pieces at line gaps, shifted +10/+26/+72/+90 f (lead-in, TR01, V01, crouch + V02). 16 shots, **1390 f = 46.33 s** (R1.5 est 1561 f ≈ 52.0 s). Per-shot VO split of ROWS-R1.5 kept; content unchanged. SD01 `hy` lowered on CAM-CHART-2S (770 → 740/682/716), CAM-CHART-LOW (700 → 659/625), CAM-FLEA-LEGS (860 → 759/719) so feet stay out of the caption band; SD02 trailer SH04 30 → 20 f, SH04C 45 → 39 f, card off +42 → +36; SD03 apex freeze 27 → 30 f; SD04 macro rest 16 f, counter every 6 f; SD05 ending tag +92 → +57, dog +95 → +62. Storyboard camera note "hy = row of the target" corrected to the kit's eye row. Ton cue lengths changed: S5 0.9 s, TR2 0.5 s, riser 1.27 s, TR3 0.53 s, TR5 0.4 s, S10 1.0 s. |
