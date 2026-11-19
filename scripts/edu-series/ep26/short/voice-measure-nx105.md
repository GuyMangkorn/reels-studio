# Voice measure R2: EDU-EP26-SHORT (EDU-EP26-VOICE-R2-NX105)

- Editor W4 re-build, 2026-11-18, on script **EDU-EP26-SCRIPT-R2** (Thai unchanged). Machine file [voice-measure-nx105.json](voice-measure-nx105.json). History: [voice-measure.md](voice-measure.md) / [voice-measure.json](voice-measure.json) (R1, NARR x1.00) are kept unchanged.
- Change: ffmpeg `atempo=1.05` on the 13 NARR lines only (user, 2026-11-18). Source: the R1 trimmed line files cut from the single Kore read `narr-kore-full-raw.wav`; character takes and per-line rates (x1.15 / x1.08) unchanged; 0.20 s gaps unchanged. **0 Gemini requests.**
- Timing status: durations and placement measured from the rebuilt audio; **anchor onsets are derived** by linear scaling of the R1 Whisper onsets (atempo is linear; the faster-whisper env failed to open files today, so Whisper was not re-run). NOT LISTENED by Editor; W4.3 user approval pending.
- Files (store `~/ReelsStore/projects/edu/EDU/narration/`): `EP26-narration-full-nx105.wav` (48 kHz mono), `timeline-nx105.json`, `lines-nx105/`.

## Length check

- **Speech end 68.152 s + 2.0 s hold = 70.152 s** against 50-60 s: **10.15 s over 60 s (+16.9 %)**. R1 was 72.35 s; saved 2.19 s. NARR speech 44.58 s (was 46.78), character speech 19.77 s, gaps 3.8 s.
- Not fixed silently. Options (arithmetic on the measured lines; stack from 70.15 s):
  1. Gaps 0.20 to 0.12 s: -1.5 s -> 68.65 s.
  2. Character lines x1.25 (flattens L05, L10 hesitations): about -2.0 s.
  3. Preaw cuts L09 (3.06 s with gap) + L11 (3.96 s): -7.02 s -> 63.13 s; with option 1: **61.63 s**; with options 1 + 2: **59.6 s**.
  4. NARR x1.10 instead of x1.05: -2.0 s more; with options 1 + 3: **59.6 s** (the user picked x1.05; x1.10 is a further decision).
  5. Accept about 70 s and change the target (user decision).
  No pace-only route reaches 60 s.

## L01-L04 gap between strong jokes

- L01 punch (ใช่ ฉี่) onset 2.59 s, L01 ends 4.46 s; L04 lid beat (ฝาเปิดปุ๊บ) onset 14.29 s, smell line (กลิ่นมาถึงก่อน) onset 15.19 s, L04 ends 17.02 s.
- Gap L01 end to the L04 lid onset **9.83 s: under the 10 s rule by 0.17 s (was 10.10 s)**; onset to onset 11.70 s (12.60 s to the smell line). Margin is thin and the rule is read end-to-onset; any added pause or slower retake breaks it.

## Low-confidence anchors (R1 Whisper match < 0.8)

L05 ไหนี่มันฉี่ 0.73; L08 ย่ำผ้า 0.67; L09 ย่ำองุ่น 0.62; L15 เหรียญแรก 0.78; L17 ภาษีฉี่ 0.43 (reported at 56.19 s before เวสปาเซียน 56.44 s: probably misplaced, check by ear).

## Lines (start-end s, dur s; anchor onsets s)

| Line | Spk | Start | End | Dur | Anchors |
| --- | --- | ---: | ---: | ---: | --- |
| L01 | NARR | 0.0 | 4.464 | 4.464 | ใช่ ฉี่ 2.59 |
| L02 | NARR | 4.664 | 7.855 | 3.19 | วันนี้เป็นวันแรก 4.91; ยังไม่มีใครบอกเขา 6.70 |
| L03 | MARCUS | 8.055 | 11.801 | 3.746 | ผมจะทำให้เสื้อ 8.05; ขาวที่สุด 9.06 |
| L04 | NARR | 12.001 | 17.015 | 5.014 | ยื่นไหให้ใบหนึ่ง 12.96; ฝาเปิดปุ๊บ 14.29; กลิ่นมาถึงก่อน 15.19 |
| L05 | MARCUS | 17.215 | 20.468 | 3.253 | ไหนี่มันฉี่ 18.33 (low) |
| L06 | SENIOR | 20.668 | 22.973 | 2.306 | ของดีนะ 20.67; ไม่ต้องเกรงใจ 22.27 |
| L07 | NARR | 23.173 | 25.368 | 2.195 | ผิดจ้ะ 24.81 |
| L08 | NARR | 25.568 | 30.65 | 5.082 | สองมือที่สัญญาไว้ 25.57; เปลี่ยนเป็นสองเท้า 26.70; ย่ำผ้า 26.11 (low) |
| L09 | NARR | 30.85 | 33.71 | 2.859 | ย่ำองุ่น 31.02 (low); ไม่มีใครอยากชิม 32.65 |
| L10 | MARCUS | 33.91 | 37.608 | 3.699 | แม่ครับ 33.94; สมัครงานผิดร้าน 35.63 |
| L11 | NARR | 37.808 | 41.568 | 3.76 | ล้างน้ำอีกอ่าง 38.56; ไม่ได้จ่ายเงินซื้อกลิ่น 40.16 |
| L12 | NARR | 41.768 | 44.325 | 2.557 | ตกเย็น 41.77; ส่องแดด 43.47 |
| L13 | CUSTOMER | 44.525 | 46.396 | 1.871 | ขาวดีนะ 44.52; ใช้อะไรซัก 45.38 |
| L14 | MARCUS | 46.596 | 49.066 | 2.471 | สูตรลับของร้าน 47.52 |
| L15 | NARR | 49.266 | 52.382 | 3.115 | เหรียญแรก 50.00 (low); ยกขึ้นมาดม 51.59 |
| L16 | MARCUS | 52.582 | 55.003 | 2.421 | ไม่มีกลิ่น 53.10; รอดแล้ว 54.38 |
| L17 | NARR | 55.203 | 58.492 | 3.289 | เวสปาเซียน 56.44; ภาษีฉี่ 56.19 (low) |
| L18 | NARR | 58.692 | 61.751 | 3.059 | เหรียญจ่อจมูก 59.25; เหม็นไหม 61.32 |
| L19 | NARR | 61.951 | 65.241 | 3.29 | ลูกบอกไม่ 62.01; ได้มาจากฉี่ 64.55 |
| L20 | NARR | 65.441 | 68.152 | 2.711 | ไม่มีกลิ่นหรอก 65.76; แต่มาร์คุสยังมี 67.04 |
