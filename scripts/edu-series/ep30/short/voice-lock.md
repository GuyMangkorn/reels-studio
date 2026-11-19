# EDU-EP30-VOICE-R1 (voice lock measure)

Editor, 2026-11-19, for script [EDU-EP30-SCRIPT-R1](script.md). Status: approved 2026-11-19; **R1.1** join fix applied the same day (see Revision notes). Not a cut: the user ruled no trimming for length (2026-11-19).

## Voice settings

- NARR: Gemini `Kore`, one continuous read, style "warm, friendly, smiling storyteller, speaking rapidly", ellipses as commas, years spoken ("ปี พันเก้าร้อยสามสิบสอง", "ปี พันเก้าร้อยแปด"), atempo **1.05** (user pick, 2026-11-19). Raw read 60.32 s, one API call; text in `out/ep30-voice/narr.txt` (store: `lines.json`).
- FARMER (L03): `Algenib`, style "exasperated rural Thai farmer shouting in panic, fast". EMU (L07, L15): `Puck`, style "unbothered, cheerful deadpan, matter-of-fact". Acted lines are not tempo-changed. Meredith: silent.
- Lines were cut from the read at real energy gaps (Whisper alignment, [voice-lock-build.py](voice-lock-build.py)); pauses between the lines were removed, then the script's gaps were set: 0.2 s between lines (17), 2.0 s hold after L18. Each line is a Whisper-aligned cut, not yet checked by ear for clipped words.

## Per-line timing (seconds, preview timeline, 0 = L01 start)

| Line | Speaker | Start | End | Dur | Spoken Thai |
| --- | --- | ---: | ---: | ---: | --- |
| L01 | NARR | 0.00 | 6.05 | 6.05 | ออสเตรเลียเคยส่งทหารพร้อมปืนกลไปรบกับนกอีมู… แล้วต้องถอนทัพ ไม่ใช่รอบเดียวนะ สองรอบ |
| L02 | NARR | 6.25 | 11.74 | 5.49 | ปี 1932 นกอีมูราว ๆ สองหมื่นตัว ลงกินไร่ข้าวสาลีเป็นบุฟเฟต์ |
| L03 | FARMER | 11.94 | 14.35 | 2.42 | กินหมดไร่แล้ว! เรียกทหารมาเลย! |
| L04 | NARR | 14.55 | 19.67 | 5.12 | กองทัพส่งมาเต็มกำลัง… แมเจอร์เมเรดิธ ทหารอีกสองนาย ปืนกลสองกระบอก |
| L05 | NARR | 19.87 | 21.64 | 1.77 | ฟังดูแล้ว… สองสัปดาห์ก็จบมั้ง |
| L06 | NARR | 21.84 | 25.83 | 3.99 | แผนแรก ยิงใส่ฝูง… นกแตกฝูง วิ่งหนีออกนอกระยะ |
| L07 | EMU | 26.03 | 28.30 | 2.28 | แยกวง! เจอกันหลังไร่! |
| L08 | NARR | 28.50 | 30.11 | 1.60 | นกไม่ได้อ่านแผนรบมาด้วยนะ |
| L09 | NARR | 30.31 | 34.35 | 4.04 | แผนสอง ซุ่มที่เขื่อน นกเป็นพันเดินเข้ามาเอง เหมือนต่อคิว |
| L10 | NARR | 34.55 | 36.73 | 2.19 | ยิงไปได้แค่สิบกว่าตัว… ปืนกลติด |
| L11 | NARR | 36.93 | 39.24 | 2.31 | วันที่นกยอมมาเองแท้ ๆ… ปืนดันไม่ยอม |
| L12 | NARR | 39.44 | 44.52 | 5.08 | แผนสาม เอาปืนกลขึ้นรถไล่ตาม… รถตามไม่ทัน ทางกระเด้งจนเล็งไม่ได้ |
| L13 | NARR | 44.72 | 48.04 | 3.32 | ผ่านไปหกวัน รัฐมนตรีสั่งถอนทัพ… รอบที่หนึ่ง |
| L14 | NARR | 48.24 | 52.00 | 3.75 | แมเจอร์เองยังพูดเลยว่า… นกพวกนี้ทนปืนกลได้อย่างกับรถถัง |
| L15 | EMU | 52.20 | 53.32 | 1.13 | ขอบคุณที่ชมครับ |
| L16 | NARR | 53.52 | 58.48 | 4.96 | ไม่กี่วันก็กลับมาภาคสอง ลากยาวไปถึงธันวา… แล้วก็ถอนอีก รอบที่สอง |
| L17 | NARR | 58.68 | 61.77 | 3.09 | ส่วนนกอีมู อยู่บนตราแผ่นดินออสเตรเลียมาตั้งแต่ปี 1908 |
| L18 | NARR | 61.97 | 65.07 | 3.10 | วันนี้ก็ยังอยู่… ไม่เคยถอยสักรอบ |

Speech ends at **65.07 s**; with the 2.0 s hold the short is **67.07 s**. Script estimate: 59.4 s (speech end 57.4 s); the read is +7.67 s (+13 %) and misses the 60–63 s risk by 4.1–7.1 s. The sample projection said about 71 s; the read came in 4 s shorter because the line-to-line pauses were trimmed.

## Files

Store `projects/edu/EDU/narration/ep30-voice-r1/` (preview.wav, narr_raw.wav, timing.json, lines.json, lines/Lnn.wav). Reproduce: `out/ep30-voice/gen.sh` calls (Kore, Algenib, Puck takes cache under `$REELS_STORE/cache/tts`), then `voice-lock-build.py`.

## Revision notes

- **R1.1, 2026-11-19, Editor** (user decision by structured question, same day: move the gap to after "แปด"). O1: the L17/L18 cut fell inside the spoken year "1908" (L17 ended "...ปีพัน(เก้า)", L18 began "(เก้า)ร้อยแปด"), leaving a 0.2 s silent hole at 61.77-61.97 s. Fix: the hole is removed and the same 0.2 s is inserted in the middle of L18's own pause after "แปด" (file offset 0.775 s). No re-generation, line files untouched, total stays 67.07 s (2012 frames). Script: [voice-lock-join-r11.py](voice-lock-join-r11.py) (input = the R1 build output kept as `out/ep30-voice/preview-R1.wav` + `timing-R1.json`; output `preview.wav`, `timing.json` with a `join_fix` key). The L18 row above is the R1 listing; in R1.1 the year runs unbroken 61.77-62.42 s, the pause after "แปด" is 62.42-62.87 s (0.46 s, was 0.26 s), and everything from "วันนี้" on is at its R1 time (speech to 65.07 s). Measured: envelope of preview.wav differs from R1 only at 61.77-62.73 s; no silence run inside the year; start/end of every other line unchanged. Effect on the scene sheets: the tail of the year ("ร้อยแปด") now ends at 62.42 s (frame 1873) instead of 62.62 s (frame 1879), 6 frames earlier; L18's later words (onset 62.87 s, frame 1886) are unchanged. Film to confirm the 1879 anchor in the L17 row may read 1873 (one cell, no shot change).
- Join check by ear-proxy (envelope at each cut, R1 build): L13/L14 joins on a 0.01 s dip inside continuous sound (L13 tail 1192 with 10 ms trailing silence, L14 head 1727 with 0 ms lead): speech to speech with no pause, possibly a clipped onset on "แมเจอร์"; needs a listen. L16/L17 cut sits on a 0.07 s dip (natural comma, passes). All other cuts sit in 0.15-0.75 s silences (pass).

<a id="voice-r2"></a>
# EDU-EP30-VOICE-R2 (voice lock for script R2.1)

Editor, 2026-11-19, for script [EDU-EP30-SCRIPT-R2.1](script.md) (user-approved). Status: **measured, user approval pending (W4.3)**. Replaces VOICE-R1.1 (kept intact in store `ep30-voice-r1/`). Build: [voice-lock-build-r2.py](voice-lock-build-r2.py); anchors: `VO_DIR=out/ep30-voice-r2 python3 -I vo-anchors.py` (10 ms peak envelope, speech above 1500, 30 fps). Store `projects/edu/EDU/narration/ep30-voice-r2/` (preview.wav, narr.wav = narrator lines only on the timeline, lines/, lines.json, timing.json, anchors-R2.txt, takeD_raw_L16-18.wav). No new API calls.

## Voices (user picks, 2026-11-19, structured question)

- NARR: Kore x1.05. L01-L04, L06, L09, L10, L12-L14 are the R1 Kore cuts re-used (the retired L05, L08, L11 were separate cuts, so they simply drop; no splice remains inside a retired line's neighbours). L16-L18 are re-read take D (store `samples/ep30/r2-lines`, chosen earlier with the 0.33 s lead; the lead is now moot, the lines are placed on the new timeline).
- FARMER L03 Algenib, EMU L07/L15 Puck: R1 takes. MEREDITH L22 Alnilam, GUNNER L23 Umbriel, EMU L19 `Puck L19_a`, L21 `Puck L21_a` from store `samples/ep30/w4-char/`.
- Character takes: leading and trailing silence trimmed at -45 dB (as R1). Gaps 0.2 s between lines (18), hold 2.0 s after L18.

## Per-line timing (seconds and 30 fps frames, timeline 0 = L01 file start)

"File" is the whole take on the timeline; "Speech" is the measured on/off (frames = round(s x 30)).

| Line | Speaker | File | Speech on-off (s) | Speech frames | Dur |
| --- | --- | --- | --- | --- | ---: |
| L01 | NARR | 0.00-6.05 | 0.06-5.93 | 2-178 | 6.05 |
| L02 | NARR | 6.25-11.74 | 6.88-11.69 | 206-351 | 5.49 |
| L03 | FARMER | 11.94-14.35 | 11.94-14.35 | 358-431 | 2.42 |
| L04 | NARR | 14.55-19.67 | 14.99-19.60 | 450-588 | 5.12 |
| L19 | EMU | 19.87-22.24 | 19.89-22.22 | 597-667 | 2.36 |
| L22 | MEREDITH | 22.44-22.76 | 22.44-22.75 | 673-683 | 0.33 |
| L06 | NARR | 22.96-26.95 | 23.48-26.87 | 704-806 | 3.99 |
| L07 | EMU | 27.15-29.43 | 27.15-29.43 | 815-883 | 2.28 |
| L09 | NARR | 29.63-33.67 | 29.96-33.61 | 899-1008 | 4.04 |
| L10 | NARR | 33.87-36.05 | 34.20-35.96 | 1026-1079 | 2.19 |
| L23 | GUNNER | 36.25-38.29 | 36.39-38.27 | 1092-1148 | 2.03 |
| L12 | NARR | 38.49-43.57 | 38.89-43.50 | 1167-1305 | 5.08 |
| L13 | NARR | 43.77-46.99 | 44.14-46.77 | 1324-1403 | 3.22 |
| L21 | EMU | 47.19-48.27 | 47.19-48.24 | 1416-1447 | 1.07 |
| L14 | NARR | 48.47-52.22 | 48.82-52.18 | 1465-1565 | 3.75 |
| L15 | EMU | 52.42-53.54 | 52.45-53.54 | 1574-1606 | 1.13 |
| L16 | NARR | 53.74-58.81 | 53.77-58.76 | 1613-1763 | 5.06 |
| L17 | NARR | 59.01-62.69 | 59.02-62.64 | 1771-1879 | 3.68 |
| L18 | NARR | 62.89-64.91 | 62.90-64.88 | 1887-1946 | 2.02 |

Last speech at **64.88 s** (frame 1946); with the 2.0 s hold the short is **66.91 s** (2007 frames; preview.wav 66.905 s). That is 0.16 s shorter than R1.1 (67.07 s) and 0.09 s shorter than the script estimate (about 67.0 s): the user's 67 s ceiling holds, nothing must be tightened. GUNNER L23 trimmed to 2.03 s (raw take 2.60 s: the rest was padding, speech 1.88 s); MEREDITH L22 is 0.33 s of speech (raw 0.88 s). Per-line internal pauses and syllable onsets: `anchors-R2.txt` in the store.

## Change log vs R1.1

- Retired L05, L08, L11 removed; new L19 (after L04), L22 (before L06), L23 (after L10), L21 (after L13), in script order L01-L04, L19, L22, L06, L07, L09, L10, L23, L12, L13, L21, L14, L15, L16-L18.
- L16-L18 replaced by take D: L17 contains the whole year, "ตั้งแต่ปี 1908" with no cut inside it (the R1.1 gap hole in "1908" is gone; L17 and L18 are separate takes, 0.2 s gap after "1908", L18 starts "วันนี้"). Whisper transcript of L17 reads "...ตั้งแต่ปี 1908".
- L13 file end trimmed by 0.10 s: the R1 cut carried a 40 ms noise tick (about -28 dBFS) after "หนึ่ง" that the anchor script read as speech; R2 L13 speech off is 46.77 s (frame 1403).
- The L13/L14 R1 join is gone: L21 sits between them, so L14's onset (48.82 s) follows a 0.35 s lead in its own file; no clipped "แมเจอร์" (Whisper reads "เมเจอร์เองยังพูดเลยว่า...").
- All narrator and farmer/emu R1 lines are unchanged files; their on/off differ from R1 only by the new timeline offsets.

## Checks done

Whisper (large-v3-turbo) transcription of every R2 line file, 0.5 s padded: every line reads its script words (Thai ASR spelling noise only: "ออสเตรลียา", "ร่ายข้าวสาริ", "โหเฮ้ย" for "โธ่เอ๊ย", "ไว้มาไหมนะ" for "ไว้มาใหม่นะ"). Envelope at every cut: each line starts and ends in silence or decay, except the points under open items. Not heard by ear.

## Open items (for the listening pass / user)

1. **L16 "ธันวา…"**: the script text ends the word at "ธันวา" with an ellipsis, so the take says "ธันวา" and stops (Whisper reads "ทันวา"). It is the script's wording, not a clipped cut; Preaw/user may prefer "ธันวาคม".
2. **L19 internal pause**: the comma "สามคนเหรอ… เรามีสองหมื่นนะ" is a 0.77 s pause (20.63-21.40 s) inside a 2.36 s line; it works as the emu's beat but is long. L21 Puck is louder (-16.0 LUFS) than L19 (-20.5 LUFS) and L07/L15 (-18.3/-20.0): level matching belongs to the mix.
3. **L22 "ยิง!"** is only 0.33 s of speech and L23 is 1.88 s of speech; both fit their slots (script estimates 0.8 s and 1.4 s) but the scene sheets must be re-timed (see below).
4. **Narrator lead silences kept as R1**: L06, L09, L10, L12, L13, L14 carry 0.3-0.5 s of low room noise before the first word (R1 behaviour, approved), so audible gaps before them are 0.5-0.7 s rather than 0.2 s. Say if the user wants them trimmed to a flat 0.2 s (would shorten the total by about 2 s).
5. **Scene sheets**: every anchor from L19 on changed against SCENE-R1 (timed to R1.1) and the order changed; Film re-times from this table. Editor did not edit scene sheets.
6. Not heard by ear: user approval of VOICE-R2 (W4.3) covers it.


<a id="voice-r21"></a>
# EDU-EP30-VOICE-R2.1 (voice lock for script R2.2)

Editor, 2026-11-19, for script [EDU-EP30-SCRIPT-R2.2](script.md#r22-changes) (emu L07 and L15 are silent mime beats; L19 and L21 stay spoken). Status: **built and measured, user approval pending (W4.3)**. Replaces VOICE-R2 (kept intact in store `ep30-voice-r2/`; `ep30-voice-r1/` also intact). Build: [voice-lock-build-r2-1.py](voice-lock-build-r2-1.py) (from the R2 builder; no API calls), anchors: `VO_DIR=out/ep30-voice-r2-1 python3 -I vo-anchors.py` (mime lines are printed as silent slots). Store: `projects/edu/EDU/narration/ep30-voice-r2-1/` (`preview.wav`, `timing.json`, `anchors-R2.1.txt`, `lines/`).

## Change vs R2

- L07 and L15 Puck takes removed; each slot is replaced by silence of the same length (L07 27.15-29.43 s, frames 815-883; L15 52.42-53.55 s, frames 1574-1606), so the 0.2 s gaps stay and nothing else moves.
- Every other line file is a byte copy of the R2 file. Checked: the start and end of all 19 line slots are identical to R2 (timing.json diff empty), and the anchors diff against `anchors-R2.txt` shows only the L07 and L15 rows. Total unchanged.
- The silent slots are the mime beats for Film's scene sheets: L07 wing wave both ways and flock splits; L15 bow (VD30-05b). Ton may put a SFX/foley bed there; no voice under them.

## Anchors (seconds and 30 fps frames, timeline 0 = L01 file start)

| Line | Speaker | File | Speech on-off (s) | Speech frames | Dur |
| --- | --- | --- | --- | --- | ---: |
| Line | Speaker | File | Speech on-off (s) | Speech frames | Dur |
| L01 | NARR | 0.00-6.05 | 0.06-5.93 | 2-178 | 6.05 |
| L02 | NARR | 6.25-11.74 | 6.88-11.69 | 206-351 | 5.49 |
| L03 | FARMER | 11.94-14.35 | 11.94-14.35 | 358-431 | 2.42 |
| L04 | NARR | 14.55-19.67 | 14.99-19.60 | 450-588 | 5.12 |
| L19 | EMU | 19.87-22.24 | 19.89-22.22 | 597-667 | 2.36 |
| L22 | MEREDITH | 22.44-22.76 | 22.44-22.75 | 673-683 | 0.33 |
| L06 | NARR | 22.96-26.95 | 23.48-26.87 | 704-806 | 3.99 |
| L07 | EMU | 27.15-29.43 (slot) | mime, silent | 815-883 (slot) | 2.28 |
| L09 | NARR | 29.63-33.67 | 29.96-33.61 | 899-1008 | 4.04 |
| L10 | NARR | 33.87-36.05 | 34.20-35.96 | 1026-1079 | 2.19 |
| L23 | GUNNER | 36.25-38.29 | 36.39-38.27 | 1092-1148 | 2.03 |
| L12 | NARR | 38.49-43.57 | 38.89-43.50 | 1167-1305 | 5.08 |
| L13 | NARR | 43.77-46.99 | 44.14-46.77 | 1324-1403 | 3.22 |
| L21 | EMU | 47.19-48.27 | 47.19-48.24 | 1416-1447 | 1.07 |
| L14 | NARR | 48.47-52.22 | 48.82-52.18 | 1465-1565 | 3.75 |
| L15 | EMU | 52.42-53.55 (slot) | mime, silent | 1574-1606 (slot) | 1.13 |
| L16 | NARR | 53.74-58.81 | 53.77-58.76 | 1613-1763 | 5.06 |
| L17 | NARR | 59.01-62.69 | 59.02-62.64 | 1771-1879 | 3.68 |
| L18 | NARR | 62.89-64.91 | 62.90-64.88 | 1887-1946 | 2.02 |

Last speech **64.88 s** (frame 1946); with the 2.0 s hold the short is **66.91 s** (2007 frames; preview.wav 66.905 s), identical to VOICE-R2.


<a id="voice-r22"></a>
# EDU-EP30-VOICE-R2.2 (voice lock for script R2.2, tightened mime slots)

Editor, 2026-11-19. Status: **built and measured; approved by the user (2026-11-19, structured question) as VOICE-R2.1 with the mime slots tightened** (W4.3). Replaces VOICE-R2.1 (kept intact in store `ep30-voice-r2-1/`; `ep30-voice-r2/` and `ep30-voice-r1/` also intact). Build: [voice-lock-build-r2-2.py](voice-lock-build-r2-2.py) (from the R2.1 builder; no API calls), anchors: `VO_DIR=out/ep30-voice-r2-2 python3 -I vo-anchors.py`. Store: `projects/edu/EDU/narration/ep30-voice-r2-2/` (`preview.wav`, `timing.json`, `anchors-R2.2.txt`, `lines/`).

## Change vs R2.1

- L07 silent slot **2.28 s to 1.50 s** (two wing flicks and the split need about 1.5 s; floor 1.3 s) and L15 silent slot **1.13 s to 0.90 s**, by cutting silence at the slot end. The 0.2 s gap before the next line is unchanged.
- Every other line file is a byte copy of the R2.1 file; the anchor rows up to and including L06 are identical to R2.1, every row after L07 moved earlier by 0.78 s (L09 to L14) and 1.01 s (L16 to L18).
- Silent slots stay the mime beats for Film: L07 wing wave both ways and flock splits (frames 815-860); L15 bow, VD30-05b (frames 1549-1576). Ton may put a SFX/foley bed there; no voice under them.

## Anchors (seconds and 30 fps frames, timeline 0 = L01 file start)

| Line | Speaker | File | Speech on-off (s) | Speech frames | Dur |
| --- | --- | --- | --- | --- | ---: |
| L01 | NARR | 0.00-6.05 | 0.06-5.93 | 2-178 | 6.05 |
| L02 | NARR | 6.25-11.74 | 6.88-11.69 | 206-351 | 5.49 |
| L03 | FARMER | 11.94-14.35 | 11.94-14.35 | 358-431 | 2.42 |
| L04 | NARR | 14.55-19.67 | 14.99-19.60 | 450-588 | 5.12 |
| L19 | EMU | 19.87-22.24 | 19.89-22.22 | 597-667 | 2.36 |
| L22 | MEREDITH | 22.44-22.76 | 22.44-22.75 | 673-683 | 0.33 |
| L06 | NARR | 22.96-26.95 | 23.48-26.87 | 704-806 | 3.99 |
| L07 | EMU | 27.15-28.65 (slot) | mime, silent | 815-860 (slot) | 1.50 |
| L09 | NARR | 28.85-32.89 | 29.18-32.83 | 875-985 | 4.04 |
| L10 | NARR | 33.09-35.28 | 33.42-35.18 | 1003-1055 | 2.19 |
| L23 | GUNNER | 35.48-37.51 | 35.62-37.50 | 1069-1125 | 2.03 |
| L12 | NARR | 37.71-42.79 | 38.11-42.72 | 1143-1282 | 5.08 |
| L13 | NARR | 42.99-46.22 | 43.36-45.99 | 1301-1380 | 3.22 |
| L21 | EMU | 46.42-47.49 | 46.42-47.47 | 1393-1424 | 1.07 |
| L14 | NARR | 47.69-51.44 | 48.04-51.40 | 1441-1542 | 3.75 |
| L15 | EMU | 51.64-52.54 (slot) | mime, silent | 1549-1576 (slot) | 0.90 |
| L16 | NARR | 52.74-57.81 | 52.77-57.76 | 1583-1733 | 5.06 |
| L17 | NARR | 58.01-61.68 | 58.02-61.64 | 1741-1849 | 3.68 |
| L18 | NARR | 61.88-63.90 | 61.89-63.87 | 1857-1916 | 2.02 |

Last speech **63.87 s** (frame 1916); with the 2.0 s hold the short is **65.90 s** (1977 frames; preview.wav 65.904 s), 1.01 s shorter than VOICE-R2.1 (66.91 s, 2007 frames).
