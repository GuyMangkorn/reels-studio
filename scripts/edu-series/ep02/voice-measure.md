# EDU-EP02-SHORT voice measure (W4.2, revision gemini-fast)

- Script EDU-SCRIPT-R1.1; voice Gemini TTS **Kore**, one continuous read, style "fast-paced, quick brisk delivery with short pauses between phrases, playful deadpan female narrator, dry and matter-of-fact, speaking quickly without dragging" (user: the model speaks faster itself, no atempo stretch). Status: `audio-measured`, pending user voice approval. Data: [voice-measure.json](voice-measure.json).
- File `out/edu02/narration/narration-ep02.wav` (store `projects/edu/EDU/narration/ep02/2026-11-05_ep02-narration-kore-fast.wav`; raw `..._ep02-raw-kore-fast.wav`), 54.16 s; speech 0.25-53.97 s. Times are seconds in the file, +-0.15 s (silence boundaries; Whisper only as cross-check). Sobs, stings, end hold/fade are not in the file.
- **Length:** speech end 53.97 s (target <= 54.5) with no atempo and no pause shortening. With ~4 s of sob/sting gaps and ~1.5 s hold/fade the video is about **59.5 s**, ~0.5 s margin to 60 s (tempo 1.16 pass: 59.8 s). One Gemini request.
- Checks: integrated -16.3 LUFS, peak -1.7 dBFS, no clipping (flat factor 0.16, from the limiter touching a few peaks). Whisper large-v3-turbo transcribed L01-L07 and L12-L18 but dropped L08-L10 and mangled L11 (it did this on the earlier reads too; phonetic Thai slips normal), so the text was checked by script-order gap count (30 gaps matched 17 lines) and Whisper only where it read. Listen to L08-L11 before approving. Anchors: L06 and L08 second are interpolated (+-0.2 s).

| Beat | On (s) | End (s) |
| --- | --- | --- |
| B01 | 0.25 | 3.78 |
| B02 | 4.12 | 8.50 |
| B03 | 9.01 | 18.85 |
| B04 | 19.17 | 26.67 |
| B05 | 27.31 | 37.55 |
| B06 | 38.00 | 47.63 |
| B07 | 48.20 | 53.97 |

| Beat | Line | On (s) | End (s) | Anchors (phrase @ s) | LUFS before | gain dB | LUFS after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B01 | L01 | 0.25 | 1.83 |  | -14.9 | -1.1 | -16.0 |
| B01 | L02 | 1.96 | 3.78 |  | -17.4 | +1.4 | -16.4 |
| B02 | L04 | 4.12 | 7.40 | แทบไม่มีอะไรเกิดขึ้น @ 6.05 | -16.4 | +0.4 | -16.1 |
| B02 | L05 | 7.57 | 8.50 |  | -15.5 | -0.5 | -16.1 |
| B03 | L06 | 9.01 | 13.15 | ซึ่งปกติแยกกันอยู่ @ 11.90 | -16.1 | +0.1 | -16.0 |
| B03 | L07 | 13.38 | 18.85 | แล้วเอนไซม์อีกตัว @ 15.54; ที่ทำให้น้ำตาไหล @ 17.66 | -16.4 | +0.4 | -16.1 |
| B04 | L08 | 19.17 | 23.92 | ปลายประสาทที่กระจกตาจับได้ @ 20.86; ก็สั่งให้น้ำตาไหลออกมาล้าง @ 22.40 | -16.1 | +0.1 | -16.1 |
| B04 | L09 | 24.30 | 26.67 | ตาแค่กำลังล้างตัวเอง @ 25.40 | -14.8 | -1.2 | -16.0 |
| B05 | L10 | 27.31 | 28.63 |  | -13.4 | -2.6 | -16.0 |
| B05 | L11 | 29.10 | 32.08 | แต่ที่โดนแก๊สคือตา @ 30.54 | -14.8 | -1.2 | -16.0 |
| B05 | L12 | 32.46 | 35.19 | ผลที่คนลองกันเอง @ 33.36 | -16.2 | +0.2 | -16.1 |
| B05 | L13 | 35.60 | 37.55 | หลักฐานก็ยังไม่ชัด @ 36.39 | -15.7 | -0.3 | -16.0 |
| B06 | L14 | 38.00 | 41.41 | คือแว่นว่ายน้ำ @ 40.60 | -15.8 | -0.2 | -16.0 |
| B06 | L15 | 41.71 | 43.75 | แต่แก๊สไปถึงตาไม่ค่อยได้ @ 42.41 | -15.6 | -0.4 | -15.9 |
| B06 | L16 | 43.98 | 47.63 | กับการหั่นช้า ๆ @ 44.90; ช่วยลดละอองที่กระเด็นออกมา @ 46.10 | -16.1 | +0.1 | -16.0 |
| B07 | L17 | 48.20 | 49.78 |  | -14.7 | -1.3 | -16.0 |
| B07 | L18 | 50.16 | 53.97 | ก็เหมือนสัญญาณกันขโมย @ 51.03; ที่ดังเฉพาะตอนโดนบุก @ 52.80 | -16.9 | +0.9 | -16.2 |
