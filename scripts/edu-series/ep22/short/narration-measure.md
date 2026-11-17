# EP22 narration measure (voice lock)

- Revision: **EDU-EP22-NARRATION-MEASURE-R2**, Editor, 2026-11-16 (W4.1). Supersedes R1 (kept below). Script [SCRIPT-R3](script.md); machine-readable: [narration-measure.json](narration-measure.json). fps 30.
- Audio: the cached Gemini Kore read (`gemini-3.8-flash-tts`, style `warm, friendly, smiling storyteller, speaking rapidly`), `atempo 0.9025` from the source take (= 0.95 x 0.95; user: "ช้าลง 5%" after hearing R1). No new Gemini call. Times are seconds from the start of the x0.9025 file.
- Method: 10 ms RMS at -40 dBFS, gaps under 120 ms merged, measured on the R2 file; each boundary is the RMS edge nearest R1's Whisper-guided boundary scaled by 0.95/0.9025 (within 0.01 s, except L06 onset 0.07 s later: R1 17.82 s x 1.0526 = 18.76 s, RMS edge 18.83 s). Anchors are R1 Whisper word times scaled by 0.95/0.9025 (faster-whisper missing in this checkout, no new Whisper pass), accuracy about +-0.15 s. **Not listened to by an agent.** Gaps are not trimmed (scaled 5.3% longer with the speech).

| Line | Onset s | Frame | End s | Frame | Gap before s | Anchors |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| L01 | 0.26 | 8 | 4.40 | 132 | - | คุณต้องชิมก่อนทุกจาน 2.84 (f85) |
| L02 | 4.85 | 146 | 8.11 | 243 | 0.45 | ไม่แตะ 6.11 (f183) |
| L03 | 8.78 | 263 | 10.08 | 302 | 0.67 | เด็กคนนี้ 9.33 (f280) |
| L04 | 10.70 | 321 | 14.57 | 437 | 0.62 | ราว ๆ ยี่สิบจาน 13.52 (f406) |
| L05 | 15.42 | 463 | 17.99 | 540 | 0.85 | โต๊ะยาวนั่น 16.74 (f502) |
| L06 | 18.83 | 565 | 22.06 | 662 | 0.84 | ทุกจาน 19.79 (f594) |
| L07 | 22.56 | 677 | 26.88 | 806 | 0.5 | แล้วขันทีน้อย 24.79 (f744); เปิดฝา 26.15 (f784) |
| L08 | 27.42 | 823 | 29.35 | 880 | 0.54 |  |
| L09 | 29.59 | 888 | 32.27 | 968 | 0.24 |  |
| L10 | 32.46 | 974 | 33.98 | 1019 | 0.19 | ทำเงินดำ 33.01 (f990) |
| L11 | 34.40 | 1032 | 38.04 | 1141 | 0.42 | เงินดำเพราะมัน 35.89 (f1077) |
| L12 | 38.20 | 1146 | 40.38 | 1211 | 0.16 | เงินก็เฉย 39.66 (f1190) |
| L13 | 40.82 | 1225 | 42.68 | 1280 | 0.44 |  |
| L14 | 43.45 | 1304 | 45.43 | 1363 | 0.77 | โต๊ะยาวนั่น 44.41 (f1332) |
| L15 | 46.15 | 1384 | 48.53 | 1456 | 0.72 | ไม่ได้ทำไว้กิน 47.64 (f1429) |
| L16 | 48.77 | 1463 | 54.24 | 1627 | 0.24 | มีไว้ให้ดูจริง ๆ 49.77 (f1493); ส่วนที่ปูยีกินจริง 51.53 (f1546); จานตรงหน้าเขา 53.33 (f1600) |

- Speech 0.26 -> 54.24 s (frame 1627); file 54.59 s (1638 frames). With the 3.0 s closing hold: **57.24 s** (frame 1717) vs the 60 s Short ceiling: 2.76 s spare. Projection 55.0 s: +2.24 s.
- Line gaps over 0.6 s: L03-prior 0.67, L04-prior 0.62, L05-prior 0.85, L06-prior 0.84, L14-prior 0.77, L15-prior 0.72. No trim applied.

## Superseded: R1 (atempo 0.95, EDU-EP22-NARRATION-MEASURE-R1)

| Line | Onset s | Frame | End s | Frame | Gap before s | Anchors |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| L01 | 0.25 | 8 | 4.18 | 125 | - | คุณต้องชิมก่อนทุกจาน 2.70 (f81) |
| L02 | 4.61 | 138 | 7.71 | 231 | 0.43 | ไม่แตะ 5.80 (f174) |
| L03 | 8.34 | 250 | 9.57 | 287 | 0.63 | เด็กคนนี้ 8.86 (f266) |
| L04 | 10.17 | 305 | 13.84 | 415 | 0.6 | ราว ๆ ยี่สิบจาน 12.84 (f385) |
| L05 | 14.65 | 440 | 17.09 | 513 | 0.81 | โต๊ะยาวนั่น 15.90 (f477) |
| L06 | 17.82 | 535 | 20.96 | 629 | 0.73 | ทุกจาน 18.80 (f564) |
| L07 | 21.43 | 643 | 25.54 | 766 | 0.47 | แล้วขันทีน้อย 23.55 (f706); เปิดฝา 24.84 (f745) |
| L08 | 26.04 | 781 | 27.88 | 836 | 0.5 |  |
| L09 | 28.11 | 843 | 30.65 | 920 | 0.23 |  |
| L10 | 30.83 | 925 | 32.29 | 969 | 0.18 | ทำเงินดำ 31.36 (f941) |
| L11 | 32.67 | 980 | 36.14 | 1084 | 0.38 | เงินดำเพราะมัน 34.10 (f1023) |
| L12 | 36.28 | 1088 | 38.36 | 1151 | 0.14 | เงินก็เฉย 37.68 (f1130) |
| L13 | 38.78 | 1163 | 40.55 | 1216 | 0.42 |  |
| L14 | 41.27 | 1238 | 43.16 | 1295 | 0.72 | โต๊ะยาวนั่น 42.19 (f1266) |
| L15 | 43.84 | 1315 | 46.11 | 1383 | 0.68 | ไม่ได้ทำไว้กิน 45.26 (f1358) |
| L16 | 46.34 | 1390 | 51.54 | 1546 | 0.23 | มีไว้ให้ดูจริง ๆ 47.28 (f1418); ส่วนที่ปูยีกินจริง 48.95 (f1468); จานตรงหน้าเขา 50.66 (f1520) |

- Speech 0.25 -> 51.54 s (frame 1546); file 51.86 s (1556 frames). With the 3.0 s closing hold: **54.54 s** (about 1636 frames) vs projection 55.0 s (-0.46 s). Short limit 40-60 s: inside, 5.5 s under the ceiling.
- Line gaps over 0.6 s: L02-L03 0.63, L03-L04 0.60, L04-L05 0.81, L05-L06 0.73, L13-L14 0.72, user prefers short pauses, so a trim pass (cut-gaps, no re-read) is an option pending the user's ear.
