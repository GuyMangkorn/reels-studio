# Voice measure: EDU-EP26-SHORT (EDU-EP26-VOICE-R1)

- Editor W4.2, 2026-11-18, on script **EDU-EP26-SCRIPT-R2**; machine file [voice-measure.json](voice-measure.json). Timing status **audio-measured, NOT LISTENED by Editor**; W4.3 user approval pending. Anchor onsets are Whisper large-v3-turbo (+-0.1-0.2 s; `match` < 0.8 is low confidence). Line durations and placement come from the generated audio.
- Voices: NARR Kore, style `warm, friendly, smiling storyteller, speaking rapidly`, x1.00 (user pick), one request for the 13 NARR lines. MARCUS `ep26-marcus-a`, SENIOR `ep26-senior-a`, CUSTOMER `ep26-customer-a`. Gemini requests this step: **4** (1 NARR read + 3 new character lines; L03, L05, L06, L13 reuse the step-1 sample takes).
- Assembly: lines L01 to L20 in order, **0.20 s** between lines (script estimate used 0.30 s), edges trimmed, 20 ms fades, no internal pause trimming.
- Files (store, see delivery.md): `EP26-narration-full.wav`, `lines/Lxx.wav`, `narr-kore-full-raw.wav` (the one NARR read, 51.76 s), `timeline.json`.

## Length check

- **Speech end 70.346 s + 2.0 s hold = 72.35 s** against the 50-60 s target: **12.35 s over 60 s (+20.6 %)**. The estimate was 55.86 s (speech end 53.86 s): the read is 16.5 s longer. NARR speech 46.78 s (estimate about 35 s), character speech 19.77 s after per-line rates, gaps 3.8 s.
- Cause: Kore at x1.00 with this style reads about 4 syllables/s with 0.2-0.5 s comma beats, against the projection cadence of 5.42 syllables/s (Kore 1.08). L01 alone is 4.68 s against 2.77 s estimated. Character lines run 1.2-2.2x their slots.
- **Not fixed silently.** Options for the coordinator (arithmetic from the measured lines, not measured renders):
  1. Pace only: NARR x1.05 saves 2.2 s, x1.10 4.3 s, x1.15 6.1 s. The user picked x1.00 over those, and no pace alone reaches 60 s (needs about x1.21 on everything).
  2. Gaps 0.20 s to 0.12 s saves 1.5 s; character lines at x1.25 save a further 2.0 s but flatten the acted hesitations (L05, L10).
  3. Script cut by Preaw: L09 costs 3.2 s with its gap, L11 4.1 s, L12 2.9 s, L07 2.5 s, L02 3.6 s. L09 + L11 saves 7.4 s; with option 2 and NARR x1.05 the total lands near 60 s.
  4. Accept a longer cut (about 72 s) and change the target: a user decision, outside the 50-60 s rule.

## L01-L04 gap between strong jokes

- L01 punch (ใช่ ฉี่) onset 2.72 s, L01 ends 4.68 s. L04 lid beat (ฝาเปิดปุ๊บ) onset 14.78 s, smell line (กลิ่นมาถึงก่อน) onset 15.72 s, L04 ends 17.65 s. Gap L01 end to the L04 lid onset **10.10 s**; onset to onset **12.06 s** (13.0 s to the smell line). Rule < 10 s: **over by 0.1-3 s** depending on the points taken. L03 (the vow, irony) sits between at 8.43-12.18 s. Trimming L01's internal pauses or the L02 gap would close it.

## Lines

| Line | Spk | Start s | End s | Dur s | Est dur s | Delta s | Rate | Anchors (onset s, match) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| L01 | NARR | 0.0 | 4.68 | 4.68 | 2.77 | +1.91 | x1.0 | ใช่ ฉี่ 2.72 (1.0) |
| L02 | NARR | 4.88 | 8.23 | 3.35 | 2.76 | +0.59 | x1.0 | วันนี้เป็นวันแรก 5.14 (1.0); ยังไม่มีใครบอกเขา 7.02 (1.0) |
| L03 | MARCUS | 8.43 | 12.176 | 3.746 | 3.32 | +0.43 | x1.15 | ผมจะทำให้เสื้อ 8.43 (1.0); ขาวที่สุด 9.44 (1.0); ด้วยสองมือ 8.96 (0.9) |
| L04 | NARR | 12.376 | 17.646 | 5.27 | 3.51 | +1.76 | x1.0 | ยื่นไหให้ใบหนึ่ง 13.38 (0.94); ฝาเปิดปุ๊บ 14.78 (1.0); กลิ่นมาถึงก่อน 15.72 (1.0) |
| L05 | MARCUS | 17.846 | 21.099 | 3.253 | 1.59 | +1.66 | x1.08 | ไหนี่มันฉี่ 18.96 (0.73) |
| L06 | SENIOR | 21.299 | 23.605 | 2.306 | 1.84 | +0.47 | x1.15 | ของดีนะ 21.3 (1.0); ไม่ต้องเกรงใจ 22.9 (0.85) |
| L07 | NARR | 23.805 | 26.095 | 2.29 | 1.85 | +0.44 | x1.0 | ผิดจ้ะ 25.52 (1.0) |
| L08 | NARR | 26.295 | 31.625 | 5.33 | 4.06 | +1.27 | x1.0 | สองมือที่สัญญาไว้ 26.3 (1.0); เปลี่ยนเป็นสองเท้า 27.48 (1.0); ย่ำผ้า 26.86 (0.67) |
| L09 | NARR | 31.825 | 34.835 | 3.01 | 2.58 | +0.43 | x1.0 | ย่ำองุ่น 32.0 (0.62); ไม่มีใครอยากชิม 33.72 (1.0) |
| L10 | MARCUS | 35.035 | 38.733 | 3.699 | 2.14 | +1.56 | x1.08 | แม่ครับ 35.06 (1.0); สมัครงานผิดร้าน 36.76 (1.0) |
| L11 | NARR | 38.933 | 42.873 | 3.94 | 3.32 | +0.62 | x1.0 | ล้างน้ำอีกอ่าง 39.72 (0.93); ไม่ได้จ่ายเงินซื้อกลิ่น 41.4 (1.0) |
| L12 | NARR | 43.073 | 45.743 | 2.67 | 2.03 | +0.64 | x1.0 | ตกเย็น 43.07 (1.0); ส่องแดด 44.86 (0.86) |
| L13 | CUSTOMER | 45.943 | 47.814 | 1.871 | 1.48 | +0.39 | x1.15 | ขาวดีนะ 45.94 (1.0); ใช้อะไรซัก 46.8 (0.9) |
| L14 | MARCUS | 48.014 | 50.485 | 2.471 | 1.4 | +1.07 | x1.15 | สูตรลับของร้าน 48.94 (0.86) |
| L15 | NARR | 50.685 | 53.965 | 3.28 | 2.22 | +1.06 | x1.0 | เหรียญแรก 51.46 (0.78); ยกขึ้นมาดม 53.12 (1.0) |
| L16 | MARCUS | 54.165 | 56.586 | 2.421 | 1.22 | +1.2 | x1.15 | ไม่มีกลิ่น 54.68 (1.0); รอดแล้ว 55.96 (1.0) |
| L17 | NARR | 56.786 | 60.236 | 3.45 | 2.77 | +0.68 | x1.0 | เวสปาเซียน 58.08 (1.0); ภาษีฉี่ 57.82 (0.43) |
| L18 | NARR | 60.436 | 63.656 | 3.22 | 2.76 | +0.46 | x1.0 | เหรียญจ่อจมูก 61.02 (0.85); เหม็นไหม 63.2 (0.88) |
| L19 | NARR | 63.856 | 67.306 | 3.45 | 2.22 | +1.23 | x1.0 | ลูกบอกไม่ 63.92 (1.0); ได้มาจากฉี่ 66.58 (0.82) |
| L20 | NARR | 67.506 | 70.346 | 2.84 | 2.32 | +0.52 | x1.0 | ไม่มีกลิ่นหรอก 67.84 (1.0); แต่มาร์คุสยังมี 69.18 (0.87) |

## Per-line rate decisions (character lines)

- **L03** (MARCUS): x1.15: bright eager line, gen 4.30 s trimmed -> 3.75 s; still 0.4 s over the 3.32 s slot.
- **L05** (MARCUS): x1.08 only: the stunned hesitant ellipsis is the joke; 3.51 -> 3.25 s, 1.7 s over the 1.59 s slot (cannot fit by rate).
- **L06** (SENIOR): x1.15: casual line 2.65 -> 2.31 s.
- **L10** (MARCUS): x1.08 only: plaintive half-laugh needs room; 3.98 -> 3.70 s.
- **L13** (CUSTOMER): x1.15: 2.14 -> 1.87 s, 0.4 s over the 1.48 s slot.
- **L14** (MARCUS): x1.15: 2.84 -> 2.47 s.
- **L16** (MARCUS): x1.15: 2.77 -> 2.42 s.

Whole-line retakes were not made: they cost requests and cannot shorten the acted ellipsis beats; a rate/script decision comes first.
