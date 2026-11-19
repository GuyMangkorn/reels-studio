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
