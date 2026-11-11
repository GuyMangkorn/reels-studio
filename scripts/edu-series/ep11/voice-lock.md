# EDU-EP11-SHORT voice lock measure (W4.2)

- **Revision EDU-EP11-VOICE-LOCK-R2 (Editor, 2026-11-09): current.** Locked NAR file: store `projects/edu/EDU/voice/ep11-nar-kore-A-r3-x0.92-regap028-L16t1.wav` (local `out/ep11-voice/l16/nar-regap028-L16t1.wav`, 49.64 s, 48 kHz mono): L01-L15 unchanged audio from the approved file, every line gap 0.28 s (user accepted re-gap), lead trimmed so L01 speech starts at 0.00 s, L16 = new take 1 (user pick). The R1 sections below are **superseded** (R1 as-read file, L16 old take) and kept as history; the R1 V01-V04 sample plan and slot table (lengths) still apply.
- Method R2: `ffmpeg silencedetect -35 dB 0.12 s` (`out/logs/ep11-sil-r2.txt`) for line edges, `faster_whisper` large-v3-turbo directly (`out/logs/ep11-whisper-r2.txt`, char timings, not scripts/transcribe.py). L01-L15 anchors = R1 anchor offsets inside each line (audio identical) rebased to the new line onset; spot-checked against the R2 Whisper run (L01 "ขาด" 0.64 s, L02 "แทบ" 5.52 vs 5.54, L13 "แทบ" 37.24 vs 37.23). L16 anchors measured on the new take. Precision +-0.1 s (+-3 f); L16 "ไม่ต้องกระโดดเลย" and "แล้วรอ" Whisper only (+-0.15 s), "กดปุ่มฉุกเฉิน" from the silence edge. Frames = round(s x 30). Line off edges use silence_start (L12 off 36.14 reads 0.08 s earlier than R1 duration; tail fade).
- Timeline rule: lead 0.10 s + NAR time + slots; each slot is `0.14 + slot + 0.14` which replaces one 0.28 s gap, so timeline s = NAR s + 0.10 + sum of earlier slot lengths. **Total 56.44 s (1693 f)** (R1 projected 56.51 s / 1695 f; -0.07 s). Speech ends f1633 (54.44 s), hold [1633, 1693). Series cap 60 s and Film target 53-57 s pass.
- NAR-only duration: 49.54 s speech end (file 49.64 s; 0.10 s tail).

## R2 line table (NAR-only timeline and projected full timeline)

| Line | NAR on s | off s | on f | off f | Dur | Timeline on f | off f |
|---|---|---|---|---|---|---|---|
| L01 | 0.00 | 4.17 | 0 | 125 | 4.17 | 3 | 128 |
| L02 | 4.45 | 6.93 | 134 | 208 | 2.48 | 155 | 229 |
| L03 | 7.21 | 11.56 | 216 | 347 | 4.35 | 288 | 419 |
| L04 | 11.84 | 14.03 | 355 | 421 | 2.19 | 427 | 493 |
| L05 | 14.31 | 16.35 | 429 | 491 | 2.04 | 501 | 563 |
| L06 | 16.63 | 19.47 | 499 | 584 | 2.84 | 586 | 671 |
| L07 | 19.75 | 21.44 | 593 | 643 | 1.68 | 680 | 730 |
| L08 | 21.73 | 23.16 | 652 | 695 | 1.43 | 751 | 794 |
| L09 | 23.44 | 25.56 | 703 | 767 | 2.12 | 814 | 878 |
| L10 | 25.84 | 29.35 | 775 | 880 | 3.51 | 886 | 992 |
| L11 | 29.63 | 31.66 | 889 | 950 | 2.03 | 1018 | 1079 |
| L12 | 31.97 | 36.14 | 959 | 1084 | 4.17 | 1088 | 1213 |
| L13 | 36.49 | 38.53 | 1095 | 1156 | 2.04 | 1224 | 1285 |
| L14 | 38.81 | 43.08 | 1164 | 1292 | 4.26 | 1293 | 1421 |
| L15 | 43.38 | 45.08 | 1301 | 1352 | 1.70 | 1448 | 1499 |
| L16 | 45.36 | 49.54 | 1361 | 1486 | 4.18 | 1508 | 1633 |

## R2 anchor onsets

| Line | Anchor | NAR s | NAR f | Timeline s | Timeline f |
|---|---|---|---|---|---|
| L01 | ขาด | 0.64 | 19 | 0.74 | 22 |
| L01 | ร่วง | 1.19 | 36 | 1.29 | 39 |
| L01 | กระโดดตอนท้าย | 2.50 | 75 | 2.60 | 78 |
| L01 | รอดมั้ย | 3.62 | 109 | 3.72 | 112 |
| L02 | จากความสูงขนาดนี้ | 4.45 | 134 | 5.15 | 155 |
| L02 | แทบ | 5.54 | 166 | 6.24 | 187 |
| L02 | ไม่ช่วยอะไรเลย | 5.82 | 175 | 6.52 | 196 |
| L03 | ร้อยยี่สิบ | 8.73 | 262 | 11.12 | 334 |
| L03 | ลิฟต์เร็วเท่าไหร่ | 9.61 | 288 | 12.01 | 360 |
| L03 | คุณก็เร็วเท่านั้น | 10.57 | 317 | 12.96 | 389 |
| L04 | หักออกได้แค่ | 12.80 | 384 | 15.20 | 456 |
| L04 | ราวสิบ | 13.52 | 406 | 15.92 | 478 |
| L05 | ก็แค่กลายเป็นเหมือน | 14.88 | 446 | 17.28 | 518 |
| L05 | ชั้นสิบเจ็ด | 15.80 | 474 | 18.20 | 546 |
| L06 | ต้องกะให้ตรง | 17.93 | 538 | 20.83 | 625 |
| L06 | เสี้ยววินาที | 18.64 | 559 | 21.54 | 646 |
| L07 | ก็ลอยไปชนเพดาน | 20.16 | 605 | 23.06 | 692 |
| L08 | ก็ไม่ทันแล้ว | 22.28 | 668 | 25.58 | 767 |
| L09 | ลิฟต์ร่วงแบบนี้ได้จริงเหรอ | 24.27 | 728 | 27.97 | 839 |
| L10 | โอติส | 27.27 | 818 | 30.97 | 929 |
| L10 | แล้วสั่งให้ตัดเชือก | 28.39 | 852 | 32.09 | 963 |
| L10 | ตัดเชือก | 28.85 | 865 | 32.55 | 976 |
| L11 | แล้วเบรกก็จับราง | 30.43 | 913 | 34.73 | 1042 |
| L11 | จับราง | 31.05 | 932 | 35.35 | 1060 |
| L12 | ถูกแก้ไว้ก่อน | 32.96 | 989 | 37.26 | 1118 |
| L12 | ที่มีเบรกนิรภัยตัวแรก | 34.45 | 1034 | 38.75 | 1163 |
| L12 | ซะอีก | 35.81 | 1074 | 40.11 | 1203 |
| L13 | แทบ | 37.23 | 1117 | 41.53 | 1246 |
| L13 | ร่วงแบบนี้ไม่ได้เลย | 37.49 | 1125 | 41.79 | 1254 |
| L14 | เส้นเดียวก็รับไหว | 40.04 | 1201 | 44.34 | 1330 |
| L14 | ขาดหมด | 41.43 | 1243 | 45.73 | 1372 |
| L14 | เบรกก็จับราง | 42.13 | 1264 | 46.43 | 1393 |
| L14 | จับราง | 42.53 | 1276 | 46.83 | 1405 |
| L15 | คุณก็หยุดไปด้วย | 44.12 | 1324 | 49.02 | 1471 |
| L16 | ไม่ต้องกระโดดเลย | 46.55 | 1396 | 51.45 | 1543 |
| L16 | กดปุ่มฉุกเฉิน | 48.03 | 1441 | 52.93 | 1588 |
| L16 | แล้วรอ | 49.00 | 1470 | 53.90 | 1617 |

## R2 slot positions (timeline)

| Slot | Start s | End s | Start f | End f |
|---|---|---|---|---|
| V01 | 4.41 | 5.01 | 132 | 150 |
| V02 | 7.77 | 9.47 | 233 | 284 |
| V03 | 18.89 | 19.39 | 567 | 582 |
| V04 | 24.48 | 24.88 | 734 | 746 |
| black | 26.6 | 27.0 | 798 | 810 |
| gasp | 33.19 | 33.79 | 996 | 1014 |
| clamp | 47.52 | 48.12 | 1425 | 1443 |
| hold | 54.44 | 56.44 | 1633 | 1693 |

## R2 notes for Film (retime at W5.1, not applied here)

- **L16 new take, superseded R1 numbers:** line on f1361 NAR-only / f1508 timeline (R1 f1507), off f1633 (R1 f1635). Anchors: "ไม่ต้องกระโดดเลย" f1543 (R1 1545), **"กดปุ่มฉุกเฉิน" f1588 (R1 1579, +9 f)**, "แล้วรอ" f1617 (R1 1615). New take has an internal pause 47.66-48.03 s NAR-only (0.36 s; timeline 52.37-52.93 s) between "เลย" and "กดปุ่มฉุกเฉิน"; the button press should hit f1588, not f1579. Hold starts f1633.
- Other lines are -1..+2 f from R1 timeline projection (L03 288, L10 886, L12 b 1118, L13 "แทบ" f1246); the R1 table notes still apply.
- **"ขาด" lands at f22** (L01 onset f3, NAR-only f19); the ROWS snap sits at f40: move the snap, flicker and hair lift 18 f earlier, or hang the snap on "ร่วง" (f39). Unchanged by the re-gap.

## V01-V04 woman's voice samples (3 Gemini requests, 2026-11-09, no retries, all exit 0)

Model gemini-3.8-flash-tts, one request per voice with all four lines in one clip: `<gasp> เฮ้ย! <short pause> เอาไงดี, <short pause> โดดสวนขึ้นไป! <short pause> ห๊ะ... <sigh> <short pause> โอ๊ย!` (V02 ellipsis written as a comma for the TTS). Style (identical): "young Thai woman in her twenties, bright and breathy; startled gasp, then panicked and fast, then deflated and sighing, then a small pained yelp; natural acting, not a narrator". Post-edit: runs of speech separated by silences >= 0.15 s re-joined with 0.30 s gaps (so inner breath pauses are also 0.30 s); raw takes in `out/ep11-voice/v/raw-<voice>.wav` (-16 LUFS). Not checked by ear by the Editor; lines are not individually verified, the user judges.

| Choice | Voice (docs descriptor) | Sample (local `out/ep11-voice/v/`, store `projects/edu/EDU/voice/`) | Length |
|---|---|---|---|
| W1 | Leda (Youthful) | ep11-v-W-Leda.wav, ep11-v-woman-sample-Leda.wav | 5.70 s |
| W2 | Aoede (Breezy) | ep11-v-W-Aoede.wav, ep11-v-woman-sample-Aoede.wav | 5.76 s |
| W3 | Zephyr (Bright) | ep11-v-W-Zephyr.wav, ep11-v-woman-sample-Zephyr.wav | 4.67 s |

Next: user picks W1/W2/W3/regenerate. Only after the pick: full V01-V04 takes (4 requests, +1-2 retakes), then V-slot lengths are measured.

---

## R1 (superseded: as-read file, old L16)

- Revision: **EDU-EP11-VOICE-LOCK-R1** (Editor, 2026-11-09). Script EDU-EP11-SCRIPT-R3; storyboard EDU-EP11-ROWS-R1.2; brief EDU-EP11-BRIEF-R1.2. Timing status: NAR **audio-measured**; V01-V04 and non-speech slots **estimated** (not generated). **0 Gemini requests** in this step.
- Source: store `projects/edu/EDU/voice/ep11-nar-kore-A-r3-x0.92-lvl-gap.wav` (already filed; byte-identical to local `out/ep11-voice/full/ep11-nar-kore-A-r3-x0.92-lvl-gap.wav`), 52.649 s, Kore A, atempo 0.92, level fix and L16 gap 0.59 -> 0.22 s baked in. User-approved 2026-11-09 (W4.3).
- Method: silencedetect (-35 dB, 0.12 s) gives line on/off edges; faster-whisper large-v3-turbo (word times, run with `faster_whisper` directly because `scripts/transcribe.py` fails on the venv's `av`: `open() got an unexpected keyword argument 'metadata_errors'`, setup finding) gives anchor onsets. Whisper mis-spells Thai (log `out/logs/ep11-whisper.txt`), so its words only locate anchors inside silence-bounded lines. Precision about +-0.1 s (+-3 f); anchors inside a line (no silence edge) +-0.15 s. Silence logs `out/logs/ep11-sil.txt`. Frames = round(s x 30).
- Uncertain: L07 onset (Whisper 20.96 vs silence edge 21.07: edge used); L05 "ชั้นสิบเจ็ด" and L04 "ราวสิบ" (no silence edge inside, +-0.15 s); L10 year words (Whisper spelled "18 54", onset 27.82 +-0.15 s).

## Line table (L01-L16)

"As-read" = positions in the approved file. "Timeline" = projected placement under the recommended gap policy below (lead 0.10 s, gaps 0.28 s, slots inserted); Film retimes shots to these once the policy is accepted.

| Line | As-read on s | off s | on f | off f | Timeline on f (re-gap 0.28) | off f | Dur s |
|---|---|---|---|---|---|---|---|
| L01 | 0.24 | 4.41 | 7 | 132 | 3 | 128 | 4.16 |
| L02 | 4.99 | 7.47 | 150 | 224 | 154 | 229 | 2.48 |
| L03 | 7.63 | 11.98 | 229 | 359 | 288 | 418 | 4.35 |
| L04 | 12.52 | 14.71 | 376 | 441 | 427 | 492 | 2.19 |
| L05 | 15.15 | 17.19 | 455 | 516 | 501 | 562 | 2.04 |
| L06 | 17.71 | 20.55 | 531 | 616 | 585 | 670 | 2.83 |
| L07 | 21.07 | 22.76 | 632 | 683 | 679 | 729 | 1.68 |
| L08 | 23.09 | 24.53 | 693 | 736 | 750 | 793 | 1.43 |
| L09 | 25.04 | 27.16 | 751 | 815 | 813 | 877 | 2.12 |
| L10 | 27.71 | 31.22 | 831 | 937 | 885 | 990 | 3.51 |
| L11 | 31.68 | 33.74 | 950 | 1012 | 1017 | 1079 | 2.06 |
| L12 | 34.08 | 38.32 | 1022 | 1150 | 1087 | 1215 | 4.25 |
| L13 | 38.84 | 40.88 | 1165 | 1226 | 1223 | 1284 | 2.04 |
| L14 | 41.26 | 45.55 | 1238 | 1367 | 1293 | 1421 | 4.29 |
| L15 | 45.94 | 47.64 | 1378 | 1429 | 1448 | 1499 | 1.70 |
| L16 | 48.10 | 52.37 | 1443 | 1571 | 1507 | 1635 | 4.27 |


### Anchor onsets

| Line | Anchor | As-read s | Source f | Timeline s | Timeline f |
|---|---|---|---|---|---|
| L01 | ขาด | 0.88 | 26 | 0.73 | 22 |
| L01 | ร่วง | 1.43 | 43 | 1.29 | 39 |
| L01 | กระโดดตอนท้าย | 2.74 | 82 | 2.60 | 78 |
| L01 | รอดมั้ย | 3.86 | 116 | 3.71 | 111 |
| L02 | จากความสูงขนาดนี้ | 4.99 | 150 | 5.14 | 154 |
| L02 | แทบ | 6.08 | 182 | 6.23 | 187 |
| L02 | ไม่ช่วยอะไรเลย | 6.36 | 191 | 6.51 | 195 |
| L03 | ร้อยยี่สิบ | 9.14 | 274 | 11.10 | 333 |
| L03 | ลิฟต์เร็วเท่าไหร่ | 10.03 | 301 | 11.99 | 360 |
| L03 | คุณก็เร็วเท่านั้น | 10.98 | 329 | 12.94 | 388 |
| L04 | หักออกได้แค่ | 13.48 | 404 | 15.18 | 455 |
| L04 | ราวสิบ | 14.20 | 426 | 15.90 | 477 |
| L05 | ก็แค่กลายเป็นเหมือน | 15.72 | 472 | 17.26 | 518 |
| L05 | ชั้นสิบเจ็ด | 16.64 | 499 | 18.18 | 545 |
| L06 | ต้องกะให้ตรง | 19.01 | 570 | 20.81 | 624 |
| L06 | เสี้ยววินาที | 19.72 | 592 | 21.52 | 646 |
| L07 | ก็ลอยไปชนเพดาน | 21.48 | 644 | 23.03 | 691 |
| L08 | ก็ไม่ทันแล้ว | 23.64 | 709 | 25.54 | 766 |
| L09 | ลิฟต์ร่วงแบบนี้ได้จริงเหรอ | 25.87 | 776 | 27.93 | 838 |
| L10 | โอติส | 29.14 | 874 | 30.94 | 928 |
| L10 | แล้วสั่งให้ตัดเชือก | 30.26 | 908 | 32.06 | 962 |
| L10 | ตัดเชือก | 30.72 | 922 | 32.52 | 975 |
| L11 | แล้วเบรกก็จับราง | 32.48 | 974 | 34.70 | 1041 |
| L11 | จับราง | 33.10 | 993 | 35.32 | 1060 |
| L12 | ถูกแก้ไว้ก่อน | 35.07 | 1052 | 37.23 | 1117 |
| L12 | ที่มีเบรกนิรภัยตัวแรก | 36.56 | 1097 | 38.72 | 1162 |
| L12 | ซะอีก | 37.92 | 1138 | 40.08 | 1202 |
| L13 | แทบ | 39.58 | 1187 | 41.51 | 1245 |
| L13 | ร่วงแบบนี้ไม่ได้เลย | 39.84 | 1195 | 41.77 | 1253 |
| L14 | เส้นเดียวก็รับไหว | 42.49 | 1275 | 44.31 | 1329 |
| L14 | ขาดหมด | 43.88 | 1316 | 45.70 | 1371 |
| L14 | เบรกก็จับราง | 44.58 | 1337 | 46.40 | 1392 |
| L14 | จับราง | 44.98 | 1349 | 46.80 | 1404 |
| L15 | คุณก็หยุดไปด้วย | 46.68 | 1400 | 49.00 | 1470 |
| L16 | ไม่ต้องกระโดดเลย | 49.36 | 1481 | 51.50 | 1545 |
| L16 | กดปุ่มฉุกเฉิน | 50.48 | 1514 | 52.62 | 1579 |
| L16 | แล้วรอ | 51.70 | 1551 | 53.84 | 1615 |

### Slot positions (timeline, re-gap 0.28 s)

| Slot | After | Start s | End s | Start f | End f |
|---|---|---|---|---|---|
| V01 | L01 | 4.40 | 5.00 | 132 | 150 |
| V02 | L02 | 7.76 | 9.46 | 233 | 284 |
| V03 | L05 | 18.87 | 19.37 | 566 | 581 |
| V04 | L07 | 24.45 | 24.85 | 734 | 746 |
| black | L08 | 26.57 | 26.97 | 797 | 809 |
| gasp | L10 | 33.16 | 33.76 | 995 | 1013 |
| clamp | L14 | 47.52 | 48.12 | 1426 | 1444 |
| hold | L16 | 54.51 | 56.51 | 1635 | 1695 |

## Gap policy (decision)

- As-read gaps: 15 gaps total 6.71 s (0.17-0.59 s, mean 0.45 s); speech alone 45.41 s; first onset 0.245 s, last speech end 52.37 s (file tail 0.28 s).
- **Decision: re-gap at 0.28 s** (the project default, EP05 precedent) with every slot inserted as `0.14 s + slot + 0.14 s`. Reasons: (1) it reproduces Film's ROWS-R1.2 plan exactly (1695 f = 56.51 s), so no shot-length rework; (2) the as-read gaps with the same slots would run **58.02 s**, over Film's 53-57 s target (under the 60 s cap) and slower than the user-approved brisk edu feel; (3) three as-read gaps cannot hold their slot anyway (L01-L02 0.59 s for V01 0.6 s, L02-L03 0.17 s for V02 1.7 s, L07-L08 0.34 s for V04 0.4 s). Cost: Editor cuts the approved file at the gaps and re-assembles (`scripts/narration/cut-gaps.py` / `assemble-narration.py`), a mechanical edit on the user-approved read; speech, level and pace are untouched, only silence changes. The user approved the file with its as-read gaps, so Editor lists this re-gap in the W4 note for the user and keeps the as-read file as fallback.
- Projected totals: **re-gap 0.28 s = 56.51 s (1695 f)**; as-read gaps = 58.02 s (1741 f). Series cap 60 s: both pass. Film target 53-57 s: re-gap passes (0.49 s margin), as-read fails by 1.02 s. Contents: lead 0.10 + speech 45.41 + gaps 9.00 (8 plain 0.28 + 7 slots) + hold 2.0.
- Speech ends at f1635 (54.51 s) and the hold runs [1635, 1695).

## Findings for Film (retime at W5.1, not applied here)

- "ขาด" lands at **f22** (L01 onset f3); ROWS-R1.2 puts the snap at f40 (shot 1 [0,75)). The snap, flicker and hair lift move 18 f earlier, or the snap sits on "ร่วง" (f39). Shot 2 (L01 b) begins at "กระโดดตอนท้าย" f78, near the plan's f75.
- L03-L16 line onsets fall within +-6 f of the R1.2 shot starts except where noted above (L03 f288 vs 286, L10 f885 vs 878, L12 b 1117 vs 1108); Film confirms from the table.
- "แทบ" (L02) at f187, stamp "แทบ" (L13) at f1245 vs plan f1238 (7 f later).

## Non-NAR slots (estimated, V01-V04 not generated)

Slot lengths are Film's (brief header). Positions are in the table above. V01-V04 are the woman's voice (WOMAN, `woman-long + office`); black, gasp, clamp and hold are sound design, not speech.

| Slot | Text / content | Length s | Source |
| --- | --- | --- | --- |
| V01 | "เฮ้ย!" (gasp acted inside the line) | 0.6 | Editor TTS, to generate |
| V02 | "เอาไงดี… โดดสวนขึ้นไป!" | 1.7 | Editor TTS, to generate |
| V03 | "ห๊ะ…" (deflated) | 0.5 | Editor TTS, to generate |
| V04 | "โอ๊ย!" | 0.4 | Editor TTS, to generate |
| black | total silence, no impact sound | 0.4 | no audio |
| gasp | crowd gasp, reconstructed | 0.6 | library / generate (sound-generation) |
| clamp | metal clamp hit then silence | 0.6 | library / generate |
| hold | room tone, exhale, closing pad | 2.0 | exhale acted (gemini-tts), rest library |

## V01-V04 woman's voice: one sample plan (do not generate yet)

- Engine: Gemini TTS (gemini-tts skill, acted lines), the same 3.8-flash-tts model as the narration. Voice must read as a young adult Thai woman in an office outfit, clearly different from narrator Kore (deadpan, female): pick a **brighter, younger, more breathy female voice than Kore**; candidates to audition (names from the skill's voice list, Editor confirms exact IDs when generating): 3 voices, labelled W1, W2, W3.
- Sample set: **one sample per candidate**, each <= 10 s and the same text for all: V01 "เฮ้ย!" + V02 "เอาไงดี… โดดสวนขึ้นไป!" + V03 "ห๊ะ…" + V04 "โอ๊ย!" with 0.3 s between, one request each (3 requests), style prompt: young Thai woman, startled then panicked, then deflated, small comic exhale; no narration voice quality. All four reaction types in one clip lets the user judge range in a single listen.
- Quota: 3 of 100 requests/day (Tier 1), then **one** full set (4 short takes, 4 requests, +1-2 retakes budget) only after the user picks (sample-before-full-read rule), about 8 requests total. Per-line rate/pitch tuning, if needed, uses the voice-tuning skill.
- Pick through the structured-question tool (coordinator asks: W1 / W2 / W3 / none, regenerate). Files go under `out/ep11-voice/woman/`, filed with `store.py archive` after the pick.
- Acted vocal sounds in V01/V03/V04 (gasp, sigh, "โอ๊ย") are inside the lines; the hold exhale is a separate acted take after the pick.

## Status

- W4.2 measured (this file); the re-gap decision awaits the coordinator's accept (nothing was cut). W4 stays open until V01-V04 are picked and generated. Next: coordinator asks the user the V01-V04 sample question; then Film retimes (W5.1) from the Timeline columns.

## R2.1 V01-V04 full takes, Leda (W1), measured (Editor, 2026-11-09)

- 5 Gemini requests, no retakes, all exit 0 (log `out/logs/ep11-vfull.log`). Voice Leda, model gemini-3.8-flash-tts, style identical to the sample (see sample section). Hold-exhale style: "young Thai woman in her twenties, breathy; she has been holding her breath in terror and now slowly releases it in one long shaky exhale of relief, no words", text `<sigh>`. Raw takes `out/ep11-voice/v/full/raw-*.wav`; trimmed to silence edges (`silenceremove -45 dB`). Not checked by ear; the user judges.
- Slot map follows the slot list above (4 speech slots): V02 is one take, `เอาไงดี, <short pause> โดดสวนขึ้นไป!`; V03 `ห๊ะ, <sigh>`; V04 `โอ๊ย!`.

| Slot | Text | Trim s | Frames @30 | Peak / mean dB | Slot plan s |
|---|---|---|---|---|---|
| V01 | `<gasp> เฮ้ย!` | 0.895 | 27 | -3.3 / -16.4 | 0.6 |
| V02 | เอาไงดี, โดดสวนขึ้นไป! | 2.784 | 84 | -4.0 / -17.6 | 1.7 |
| V03 | ห๊ะ, `<sigh>` | 1.766 | 53 | -1.5 / -23.6 | 0.5 |
| V04 | โอ๊ย! | 0.917 | 28 | -3.5 / -16.7 | 0.4 |
| hold exhale | `<sigh>` (breath held, released) | 1.570 | 47 | -1.5 / -19.2 | inside hold 2.0 |

- Files: local `out/ep11-voice/v/ep11-v-<slot>-Leda.wav`, store `projects/edu/EDU/voice/ep11-v-<slot>-Leda.wav` (slot V01..V04, V05hold).
- **Projected timeline total (slot = 0.14 + slot + 0.14 replaces a 0.28 s gap): 56.44 + (6.362 - 3.2) = 59.60 s (about 1788 f)**: under the 60 s cap, **over the 53-57 s target by 2.6 s**. Slots are 3.16 s longer than Film's estimate (V03 +1.27, V02 +1.08, V04 +0.52, V01 +0.30). Cutting to target needs tighter takes (V03 sigh, V02 inner pause) or a shorter hold; the coordinator decides. Slot positions after V01 shift later by the cumulative extra (V01 +0.30 s, V02 +1.38 s, V03 +2.65 s, V04 +3.16 s); Film retimes at W5.1.
