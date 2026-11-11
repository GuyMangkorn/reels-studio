# ZCONDO2-SHORT-TH voice lock (W4.2)

Measured 4 Nov 2026 by Editor against storyboard ZC2-SB-R3 (29 shots; now ZC2-SB-R3.1, 30 shots after the B04-SH02 split, `storyboards/zombie-condo2/short/review-rows.json`, untimed). Script ZCONDO-SHORT-TH-R5 (reused).

- **Narration (final, reused, not regenerated):** ZCPAINT TH Gemini Kore +5 % (atempo 1.05), B09 call, no comment line. File `public/narration/ZCPAINT-SHORT-TH.mp3` (committed, 93.151 s). Store copies: `~/ReelsStore/projects/legacy/ZCONDO/audio/gemini-tts/zcpaint-th-approved-read/kore-measured-nocomment.wav` (source read). Note: `~/ReelsStore/projects/legacy/ZCONDO/audio/narration/ZCPAINT-SHORT-TH.mp3` (71.2 s) is the old Edge stand-in, do not use.
- **Measure file:** `short/ZCPAINT-SHORT-TH.lines.json` (40 lines, TH-01..TH-39 + TH-36a). Re-checked with ffmpeg silencedetect (-38 dB, 0.18 s): 38 of 40 onsets within 0.15 s; TH-02 (2.665 vs 2.90 detected, soft onset) and TH-18 (38.422 vs 38.19, breath before) are within one word-edge, measure file kept. Last speech ends 92.870 s.
- **Total:** timeline 95.9 s (2877 frames at 30 fps) kept; audio 93.151 s; tail after last word 3.03 s (B10 hold, silence/room tone).

## Per-shot VO windows

Shot boundaries are proposed (storyboard has no timing): a shot starts at its first line onset minus min(0.4 s, half the gap before it), ends where the next starts; SH01 starts at 0, B10-SH01 ends at 95.9. Film writes the final integer-frame sheet from this.

| Shot | Lines | VO onset s | VO end s | Shot start s | Shot end s | Length s | Flag |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ZC2-B01-SH01 | TH-01 | 0.000 | 2.312 | 0.00 | 2.49 | 2.49 |  |
| ZC2-B01-SH02 | TH-02 | 2.665 | 4.965 | 2.49 | 5.32 | 2.83 |  |
| ZC2-B01-SH03 | TH-03 | 5.676 | 6.543 | 5.32 | 6.88 | 1.56 |  |
| ZC2-B02-SH01 | TH-04 | 7.227 | 7.433 | 6.88 | 7.75 | 0.87 | SHORT |
| ZC2-B02-SH02 | TH-05 | 8.058 | 8.318 | 7.75 | 8.65 | 0.90 | SHORT |
| ZC2-B02-SH03 | TH-06 | 8.974 | 9.872 | 8.65 | 10.16 | 1.51 |  |
| ZC2-B02-SH04 | TH-07..TH-08 | 10.442 | 13.766 | 10.16 | 13.95 | 3.79 |  |
| ZC2-B02-SH05 | TH-09 | 14.127 | 16.485 | 13.95 | 17.02 | 3.07 |  |
| ZC2-B03-SH01 | TH-10 | 17.423 | 18.381 | 17.02 | 18.92 | 1.90 |  |
| ZC2-B04-SH01 | TH-11 | 19.318 | 20.170 | 18.92 | 20.55 | 1.63 |  |
| ZC2-B04-SH02 | TH-12 | 20.926 | 24.091 | 20.55 | 24.37 | 3.82 |  |
| ZC2-B04-SH02b | TH-13..TH-15 | 24.642 | 30.286 | 24.37 | 30.41 | 6.04 |  |
| ZC2-B04-SH03 | TH-16 | 30.529 | 34.992 | 30.41 | 35.54 | 5.13 |  |
| ZC2-B05-SH01 | TH-17 | 35.938 | 38.312 | 35.54 | 38.37 | 2.83 |  |
| ZC2-B05-SH02 | TH-18 | 38.422 | 40.938 | 38.37 | 41.03 | 2.66 |  |
| ZC2-B05-SH03 | TH-19 | 41.129 | 44.814 | 41.03 | 45.02 | 3.99 |  |
| ZC2-B05-SH04 | TH-20..TH-21 | 45.228 | 48.407 | 45.02 | 48.93 | 3.91 |  |
| ZC2-B06-SH01 | TH-22..TH-23 | 49.334 | 55.393 | 48.93 | 55.72 | 6.79 |  |
| ZC2-B06-SH02 | TH-24 | 56.042 | 58.110 | 55.72 | 58.34 | 2.62 |  |
| ZC2-B06-SH03 | TH-25 | 58.561 | 59.421 | 58.34 | 59.95 | 1.61 |  |
| ZC2-B07-SH01 | TH-26 | 60.348 | 62.422 | 59.95 | 62.74 | 2.79 |  |
| ZC2-B07-SH02 | TH-27 | 63.056 | 65.881 | 62.74 | 65.97 | 3.23 |  |
| ZC2-B07-SH03 | TH-28 | 66.050 | 67.576 | 65.97 | 68.23 | 2.26 |  |
| ZC2-B08-SH01 | TH-29 | 68.631 | 71.341 | 68.23 | 71.57 | 3.34 |  |
| ZC2-B08-SH02 | TH-30..TH-31 | 71.802 | 74.980 | 71.57 | 75.94 | 4.37 |  |
| ZC2-B09-SH01 | TH-32..TH-35 | 76.344 | 82.149 | 75.94 | 82.53 | 6.59 |  |
| ZC2-B09-SH02 | TH-36 | 82.918 | 84.516 | 82.53 | 84.76 | 2.23 |  |
| ZC2-B09-SH03 | TH-36a | 85.000 | 86.222 | 84.76 | 87.33 | 2.57 |  |
| ZC2-B09-SH04 | TH-37 | 87.726 | 88.793 | 87.33 | 89.17 | 1.84 |  |
| ZC2-B10-SH01 | TH-38..TH-39 | 89.543 | 92.870 | 89.17 | 95.90 | 6.73 |  |

## Mismatches (shot length vs its line)

1. **ZC2-B02-SH01 (0.87 s, "ปิด!") and ZC2-B02-SH02 (0.90 s, "ล็อก!")**: words last 0.21 s and 0.26 s; as single-word shots they are hard cuts under 1 s. Fine as an intentional rapid pair; if Film wants longer, take the time from SH03 (1.51 s) or from the 0.62 s gap after "ล็อก" (the gap is natural room for the knock SFX).
2. **ZC2-B04-SH02 (9.86 s, four lines TH-12..TH-15)**: longest shot, one picture for the pump explanation. Needs an internal camera move or a split into two shots (TH-12 at 20.926-24.091 and TH-13..15 at 24.642-30.286). **Decided 4 Nov 2026 (user): split in two** at 24.37 s (midpoint of the 0.55 s gap between TH-12 and TH-13): ZC2-B04-SH02 (TH-12) and ZC2-B04-SH02b (TH-13..TH-15); total unchanged, 30 shots.
3. Long-ish but matching: B06-SH01 6.79 s (two lines), B09-SH01 6.59 s (four counted items, one per ~1.3 s, cut on items if wanted), B10-SH01 6.73 s (includes 3.03 s silent end hold).
4. All other shots are 1.5-5.1 s and carry whole lines; no line is split across shots.

Pace: speech 0.0-92.87 s, longest inter-line gap 1.43 s (TH-31 to TH-32, B08 to B09); no change to pauses made.

## Status

W4.2 measured. W4.3 (user listens) is open. Listening file: `~/ReelsStore/projects/legacy/ZCONDO2/previews/ZC2-voice/ZCPAINT-SHORT-TH.mp3`.
