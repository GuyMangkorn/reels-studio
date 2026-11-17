# Voice measure — EDU-EP21-SHORT (EDU-EP21-VOICE-R2)

- **Revision:** EDU-EP21-VOICE-R2 (Editor W4.2, 2026-11-16) on script **EDU-EP21-SCRIPT-R1**; machine file [voice-measure.json](voice-measure.json). Timing status **audio-measured, NOT LISTENED by Editor**; W4.3 user approval pending.
- **Supersedes EDU-EP21-VOICE-R1** (Kore x1.05, 38.90 s, store `.../2026-11-16_kore-105-r1/`). Why: the user chose a slower pace, exact words "เอาช้าลง 5% เนี่ยแหละ": R1's take slowed 5 % (atempo 0.95), net **x0.9975 of the raw take**. This is a pace choice only, **not** W4.3 voice approval. R1 files stay in the store as history; R1 times no longer apply.
- **Narration:** Gemini TTS Kore, style `warm, friendly, smiling storyteller, speaking rapidly`, the same single full read (input `out/ep21-narr/tts-input.txt`), raw 40.84 s, atempo 1.05 then 0.95, **no trimming**, 40.945 s: `out/ep21-narr/full_1.05x0.95.wav`. Store `projects/edu/EDU/narration/ep21/2026-11-16_kore-x0.9975-r2/`. **No new Gemini calls.** Times are seconds on the 40.945 s take clock.
- **Method:** same as R1: line boundaries at the centre of the gap between audible runs (10 ms peak blocks >= 800/32767) nearest the R1 boundaries rescaled by 1/0.95; line edges = first/last block >= 800; lines cut with 30 ms pad and 20 ms fades, loudnorm-measured, gained to -16 LUFS (alimiter 0.89, level disabled). Boundaries L08|L09 (blip at 27.16-27.22 s assigned to L09) and L10|L11 (33.36 s, shallow trough, 0.13 s gap) are +-0.1 s.

## Lines (L01–L12)

| Line | Start s | End s | Dur s | Syll | LUFS raw | Gain dB | LUFS out | Peak dBFS | Internal gaps >= 0.12 s (at+len) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L01 | 0.10 | 3.18 | 3.08 | 14 | -15.1 | -0.9 | -16.0 | -2.5 | 0.11+0.20 |
| L02 | 3.43 | 7.20 | 3.77 | 17 | -15.3 | -0.7 | -16.0 | -2.2 | 3.46+0.17, 4.82+0.33 |
| L03 | 7.61 | 10.19 | 2.58 | 12 | -13.5 | -2.5 | -16.0 | -4.0 | - |
| L04 | 10.67 | 13.28 | 2.61 | 13 | -14.4 | -1.6 | -16.0 | -3.5 | 10.95+0.30, 12.12+0.20 |
| L05 | 13.78 | 18.12 | 4.34 | 19 | -16.1 | +0.1 | -16.0 | -1.4 | 16.07+0.24, 17.25+0.19 |
| L06 | 18.41 | 21.07 | 2.66 | 12 | -14.6 | -1.4 | -16.2 | -3.4 | 19.76+0.16 |
| L07 | 21.20 | 24.77 | 3.57 | 17 | -15.8 | -0.2 | -16.0 | -2.0 | 23.09+0.26 |
| L08 | 25.36 | 26.97 | 1.61 | 10 | -15.4 | -0.6 | -16.0 | -2.5 | - |
| L09 | 27.15 | 30.47 | 3.32 | 17 | -18.2 | +2.2 | -16.2 | -1.0 | 27.22+0.17 |
| L10 | 30.86 | 33.29 | 2.43 | 12 | -16.8 | +0.8 | -16.0 | -1.0 | 31.85+0.13 |
| L11 | 33.42 | 36.19 | 2.77 | 16 | -16.3 | +0.3 | -16.0 | -1.2 | - |
| L12 | 36.67 | 40.67 | 4.00 | 17 | -17.3 | +1.3 | -16.1 | -1.0 | 38.36+0.33 |

Between-line gaps (s): L01>L02 0.25, L02>L03 0.41, L03>L04 0.48, L04>L05 0.50, L05>L06 0.29, L06>L07 0.13, L07>L08 0.59, L08>L09 0.18, L09>L10 0.39, L10>L11 0.13, L11>L12 0.48.

## Totals vs TIMING-R2

- Sum of line durations 36.74 s (includes 2.68 s of internal gaps >= 0.12 s); between-line gaps 3.83 s; **speech span 40.57 s** (first onset 0.1 s, last end 40.67 s; file 40.945 s).
- TIMING-R2 projected 40.97 s (36.62 s speech + 4.35 s authored pauses) + 3 s hold = **43.97 s**. Measured, with the natural gaps as read: 40.57 + 3 s hold = **43.57 s**; deviation **-0.4 s** (-0.9 %), inside the 40–60 s target. R1 was 41.55 s (-2.42 s); the slowdown lands within 0.4 s of the projection.
- Natural gaps as read: 3.83 s between lines + 0.79 s at the L04/L06/L12 commas = 4.62 s against the 4.35 s authored budget. Speech itself is 35.95 s (4.90 syllables/s vs 4.81 projected).
- **Gap flags:** L01 comma has no detectable gap (< 0.12 s; the 0.11+0.20 entry is just after a 10 ms onset blip, not the comma). L06>L07 is **0.13 s** (R1 0.11) and L10>L11 is **0.13 s** (R1 0.11): still the tightest joins, now just above the 0.12 s detection threshold. L12 comma pause 0.33 s at 38.36 s; L04 comma 0.30 s; L06 comma 0.16 s. Line starts for Film: each line's file start plus 0.03 s pad.
- Boundary uncertainty: L08|L09 and L10|L11 are +-0.1 s.

## Whisper-heard text per line (large-v3-turbo on the R1 (1.05) line files; carried over, the same words in the slowed R2 take and not re-run; not a pronunciation verdict)

| Line | Script | Heard |
| --- | --- | --- |
| L01 | ไม่ใช่ยางนะ,ที่ช่วยป้องกันคนในรถถูกฟ้าผ่า | ไม่ใช่อย่างที่ช่วยป้องกันคนในรถถูกฟ้าผ่า |
| L02 | ต้องเป็นรถปิดมิดชิด หลังคากับตัวถังโลหะ ปิดกระจกด้วย | ต้องเป็นรถปิดมิดชิด รังค่ากับตัวถังโลหะปิดกระจกด้วย |
| L03 | ตัวที่ช่วยป้องกัน กลับเป็นเปลือกโลหะรอบคุณ | ตัวที่ช่วยป้องกัน ปลับเป็นเปลือกโลหารอบคุณ |
| L04 | เดี๋ยว,โลหะนำไฟฟ้า แล้วมันจะช่วยได้ยังไง? | เดี๋ยว เราหาดังไฟฟ้า แล้วมันจะช่วยได้ยังไง |
| L05 | เพราะกระแสไฟไหลไปตามเปลือกโลหะด้านนอก รอบคนข้างใน แล้วลงดิน | เพราะก็แสไฟไหลไปตามเปลือกลูหาด้านนอก รอบขนข้างใน แล้วลงดิน |
| L06 | แต่ถ้าคิดว่ารถไม่เป็นอะไร,ดูยางก่อน | แต่ถ้าคิดว่ารวนไม่เป็นอะไร ดูยางก่อน |
| L07 | ฟ้าผ่ายังทำให้ยางเสียหายได้ มันไม่ได้หยุดอยู่เหนือยางนะ | ฟ้าผ่ายังทำให้ยางเสียหายได้ มันไม่ได้หยุดอยู่เนื้วยางนะ |
| L08 | งั้นทำไมไฟหน้าปัดถึงดับไปด้วย? | งั้นทำไมไฟหน้าปัดถึงดับไปด้วย |
| L09 | เพราะกระแสไฟบางส่วนอาจเข้าไปทำลายระบบไฟของรถได้ | เพราะก็แสไฟบางส่วน อาจเขาไปทำลายระบบไฟของรถได้ |
| L10 | ช่วยป้องกันคน ไม่ได้แปลว่ารถจะไม่พัง | ช่วยปองกันขน ไม่ได้แปลว่าเราจะไม่พัง |
| L11 | แล้วก็ไม่ได้รับประกันว่าคนข้างในจะปลอดภัยทุกครั้ง | และก็ไม่ได้รับประกันว่าคนข้างในจะปลอดภัยทุกครั้ง |
| L12 | โลหะที่คุณกลัวว่านำไฟ,กลับเป็นทางให้ไฟผ่านรอบตัวคุณ | โลหาที่คุณกลัวว่าน่ำไฟ กลับเป็นทางให้ไฟผ่านรอบตัวคุณ |

Flags to listen for: L01 **ยาง** heard as อย่าง (same at raw rate and at the W1.4 sample); L02 **หลังคา** heard as รังค่า; L04 โลหะนำไฟฟ้า garbled; L05/L09 กระแส heard as ก็แส; L10 คน heard as ขน; L11 แล้วก็ heard as และก็; L12 โลหะ heard as โลหา. ASR garbles Kore's Thai words of this kind elsewhere, so only a listening pass decides.
