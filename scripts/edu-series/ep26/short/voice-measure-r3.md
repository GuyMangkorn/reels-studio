# Voice measure R3: EDU-EP26-SHORT (EDU-EP26-VOICE-R3)

- Editor W4 rebuild, 2026-11-18, on script **EDU-EP26-SCRIPT-R3** (R2 minus L09 and L11; Thai otherwise unchanged). Machine file [voice-measure-r3.json](voice-measure-r3.json). History kept unchanged: [voice-measure-nx105.md](voice-measure-nx105.md) (R2), [voice-measure.md](voice-measure.md) (R1).
- Assembly: the existing `lines-nx105` files (NARR atempo 1.05; character rates unchanged), L09 and L11 dropped, 0.20 s gaps, 48 kHz mono. **0 Gemini requests.** No further speed or gap change.
- Timing status: durations from the rebuilt audio. Anchor onsets from a **Whisper re-run on the rebuilt narration** (large-v3-turbo; the av error was bypassed by passing a 16 kHz float array decoded with ffmpeg, project untouched). Whisper onsets are about +-0.2 s (L03 and L08 first anchors read 0.1-0.2 s before the line start). NOT LISTENED by Editor.
- Files (store `~/ReelsStore/projects/edu/EDU/narration/`): `EP26-narration-full-r3.wav`, `timeline-r3.json`, `lines-r3/`, `whisper-r3.json`, `anchors-r3.json`.

## Length check

- **Speech end 61.133 s + 2.0 s hold = 63.133 s** against 50-60 s: **3.133 s over 60 s (+5.2 %)**. R2 was 70.152 s; saved 7.019 s. NARR speech 37.96 s, character speech 19.77 s, gaps 3.4 s.
- Not fixed. Remaining arithmetic if the user wants it under 60 s (stack from 63.13 s): gaps 0.20 to 0.12 s about -1.5 s (61.6 s); character lines x1.25 about -2.0 s; NARR x1.10 about -1.8 s (with both gap and character changes about 58.5 s). Or accept about 63 s and change the target. User decision pending.

## L01-L04 gap between strong jokes

- L01 ends 4.464 s; L04 lid beat (ฝาเปิดปุ๊บ) onset 14.3 s: gap **9.84 s, under the 10 s rule by 0.16 s**. Unchanged by the cut (L01-L04 sit before L09); thin margin, any added pause breaks it.

## L14-L17 gap

- L14 punch (สูตรลับของร้าน) onset 40.50 s, L14 ends 42.047 s; L17 starts 48.184 s, Vespasian (เวสปาเซียน) onset 49.46 s. Gap L14 end to L17 start **6.14 s**; to the Vespasian onset **7.41 s**; onset to onset 8.96 s. Between them: L15 (coin) and L16 (Marcus "ไม่มีกลิ่น ... รอดแล้ว"). In R2 the same L14 end to L17 start was 6.14 s (L14 end 49.07, L17 start 55.20) and onset to Vespasian onset 8.92 s: the cut changes nothing here, as neither L09 nor L11 sits between L14 and L17. The 8.96 s onset gap is under 10 s.

## Low-confidence anchors (match < 0.8 in this re-run)

L05 ไหนี่มันฉี่ 0.73 (18.34 s); L15 เหรียญแรก 0.78 (42.98 s); L17 ภาษีฉี่ 0.71 (49.18 s, reads before เวสปาเซียน 49.46 s: probably misplaced, check by ear). **L08 ย่ำผ้า now matches 1.00 (28.94 s; R1 was 0.67 with a misplaced 26.11 s onset)**: resolved by the re-run, still worth one listen. L09 is cut. Anchors at 0.85-0.9 (L03, L06, L12, L13, L16, L18, L20) are acceptable.

## Lines (start-end s, dur s; anchor onsets s)

| Line | Spk | Start | End | Dur | Anchors |
| --- | --- | ---: | ---: | ---: | --- |
| L01 | NARR | 0.0 | 4.464 | 4.464 | ใช่ ฉี่ 2.6 |
| L02 | NARR | 4.664 | 7.855 | 3.19 | วันนี้เป็นวันแรก 4.9; ยังไม่มีใครบอกเขา 6.7 |
| L03 | MARCUS | 8.055 | 11.801 | 3.746 | ผมจะทำให้เสื้อ 7.94; ขาวที่สุด 9.08; ด้วยสองมือ 8.58 |
| L04 | NARR | 12.001 | 17.015 | 5.014 | ยื่นไหให้ใบหนึ่ง 12.96; ฝาเปิดปุ๊บ 14.3; กลิ่นมาถึงก่อน 15.18 |
| L05 | MARCUS | 17.215 | 20.468 | 3.253 | ไหนี่มันฉี่ 18.34 (low) |
| L06 | SENIOR | 20.668 | 22.973 | 2.306 | ของดีนะ 20.6; ไม่ต้องเกรงใจ 22.24 |
| L07 | NARR | 23.173 | 25.368 | 2.195 | ผิดจ้ะ 24.76 |
| L08 | NARR | 25.568 | 30.65 | 5.082 | สองมือที่สัญญาไว้ 25.34; เปลี่ยนเป็นสองเท้า 26.72; ย่ำผ้า 28.94 |
| L10 | MARCUS | 30.85 | 34.549 | 3.699 | แม่ครับ 30.84; สมัครงานผิดร้าน 32.58 |
| L12 | NARR | 34.749 | 37.306 | 2.557 | ตกเย็น 34.6; ส่องแดด 36.46 |
| L13 | CUSTOMER | 37.506 | 39.377 | 1.871 | ขาวดีนะ 37.34; ใช้อะไรซัก 38.22 |
| L14 | MARCUS | 39.577 | 42.047 | 2.471 | สูตรลับของร้าน 40.5 |
| L15 | NARR | 42.247 | 45.362 | 3.115 | เหรียญแรก 42.98 (low); ยกขึ้นมาดม 44.76 |
| L16 | MARCUS | 45.562 | 47.984 | 2.421 | ไม่มีกลิ่น 46.02; รอดแล้ว 47.04 |
| L17 | NARR | 48.184 | 51.473 | 3.289 | เวสปาเซียน 49.46; ภาษีฉี่ 49.18 (low) |
| L18 | NARR | 51.673 | 54.732 | 3.059 | เหรียญจ่อจมูก 52.24; เหม็นไหม 54.3 |
| L19 | NARR | 54.932 | 58.222 | 3.289 | ลูกบอกไม่ 55.0; ได้มาจากฉี่ 57.54 |
| L20 | NARR | 58.422 | 61.133 | 2.711 | ไม่มีกลิ่นหรอก 58.74; แต่มาร์คุสยังมี 60.12 |
