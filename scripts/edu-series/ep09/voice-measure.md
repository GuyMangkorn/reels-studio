# EDU-EP09-SHORT voice measure

Samples and the "แบน" re-tune: [voice-sample.md](voice-sample.md).

## Full read (W1.4, 2026-11-08)

User picked style A (2026-11-08) and the ban1 treatment. **One Gemini request**, one attempt, exit 0, log `out/logs/ep09-full.log`; `gemini-3.8-flash-tts`, Kore, style A exactly as sample A plus "pronounce every word clearly" (the ban1 direction), **no atempo**. Text `out/ep09-voice/full/lines-nar.txt`: the 13 NAR lines of script R1.1 (L01-L13, L15 as in the script; not V01/V02), one per line, ellipses as commas; L01 TTS text has spaces around the word: `วางมือ แบน บนโต๊ะ พับนิ้วกลางลงไป, แล้วลองยกนิ้วนางดูสิ` (TTS text only; script unchanged). Raw read 49.48 s, normalised -16 LUFS, 48 kHz mono. **Not listened by me.** Line edges are from ffmpeg `silencedetect -35 dB / 0.10 s` assigned by syllable position and comma pauses (no ASR), so edges are +-0.1 s; least certain: L07/L08 (24.04-24.43, a 0.12 s blip at 24.2-24.3) and L09/L10.

| Line | Start | End | Dur (s) | Syl |
| --- | --- | --- | --- | --- |
| L01 | 0.26 | 3.96 | 3.71 | 17 |
| L02 | 4.75 | 7.03 | 2.28 | 10 |
| L03 | 7.58 | 9.07 | 1.49 | 9 |
| L04 | 9.52 | 11.70 | 2.19 | 9 |
| L05 | 12.41 | 14.92 | 2.51 | 13 |
| L06 | 15.73 | 19.91 | 4.18 | 18 |
| L07 | 20.51 | 24.04 | 3.53 | 16 |
| L08 | 24.43 | 28.50 | 4.07 | 21 |
| L09 | 29.03 | 33.45 | 4.41 | 21 |
| L10 | 34.11 | 38.01 | 3.90 | 20 |
| L11* | 38.63 | 42.63 | 4.00 | 19 |
| L12* | 43.21 | 45.46 | 2.25 | 13 |
| L13* | 46.04 | 49.18 | 3.14 | 17 |

*Rows 11-13 are script lines L12, L13, L15 (script IDs skip L11 and L14).

- Speech alone **41.66 s** (203 syl, 4.87 syl/s); as read (0.26-49.18) span **48.93 s**; re-gapped at 0.28 s (12 gaps, the EP08 standard) = **45.02 s NAR**. Script N1 estimate 48.1 s: the read is +1.7 % as read, -6 % re-gapped. The read runs slower than EP08 (4.96) because of the added "pronounce every word clearly" and the commas.
- Raw gaps worth knowing: 0.79 s L01/L02 (the spaces in L01 plus the comma), 0.55 s L02/L03, 0.70 s L04/L05, 0.81 s L05/L06, 0.60 s L06/L07, 0.54 s inside L08, 0.67 s L09/L10, 0.62 s L10/L11, 0.58 s L11/L12 and L12/L13.
- **Projected video** = NAR + non-NAR beats from N1 (try silence 2.0, V01 0.6, V02 1.5, taps 0.6, retry 1.0, closing hold 2.5 = 8.2 s): re-gapped **53.2 s**, as read (raw gaps) **57.1 s**. Both under the 60 s cap (63 s with the 5 % tolerance); slack 2.9-6.8 s. Caveat: the try window and V01 may overlap the raw L01/L02 gap (0.79 s), so the real total can be slightly lower; estimate until Film retimes the shots.
- **Verdict: pass, no Preaw cuts needed.** Script N1 cuts C1 (drop L13, about -2.2 s measured: L13 as read is the script's L13 "แต่สายในมือ…", 2.25 s + 0.28 gap), C2 (L06 "เหมือนสายเชิดหุ่น") and C3 (L10) are **not needed**; all three stay available if Film's retime runs long.
- For the user's ear: "แบน" in L01 (spaced), "เบา ๆ นะ", "ระบบประสาท", "สายเชิดหุ่น"; whether the L04 list "นิ้วโป้ง, นิ้วชี้, นิ้วก้อย" has even beats for the three taps.
- Store: `projects/EDU/voice/ep09-nar-kore-A-fullread.wav` (+ `.json`). Local reproduction inputs `out/ep09-voice/full/` (ignored). Per-line split is not done yet (W4 voice lock).

## User tweak 2026-11-08: 5% slower

User asked for the full read 5% slower. Take `~/ReelsStore/projects/EDU/voice/ep09-nar-kore-A-fullread-x0.95.wav` (ffmpeg atempo=0.95 of the same Gemini take, no new request): raw 49.48 s -> 52.07 s. Projection (arithmetic, not re-measured): speech 41.66 s -> about 43.9 s, video as read 57.1 s -> about 59.7 s, re-gapped 53.2 s -> about 55.4 s. Under 60 s but with about 0.3 s margin as read; cut C1 (L13) if W6 timing runs over. This overrides the series "no atempo" default for EP09 only, at the user's request.

## Full read R1.3 (W4 step 2, 2026-11-08)

User decision 2026-11-08: L03 at the same pace as the other lines; no separate slow L03 take (s1-s3 discarded). **One Gemini request**, one attempt, exit 0, log `out/logs/ep09-r13-full.log`: `gemini-3.8-flash-tts`, Kore, **the same style prompt as the W1.4 read** (style A, "fast-paced ... pronounce every word clearly"), L01 ban1 spacing, ellipses as commas. Text `out/ep09-voice/r13/lines-nar.txt`: the 11 NAR lines of script EDU-EP09-SCRIPT-R1.3 (L01-L09, L12, L15 with "แค่"; L10, L13 cut). Raw 40.32 s, then ffmpeg atempo=0.95 (48 kHz mono, -16.0 LUFS, -1.5 dBTP) = **42.43 s**. **Not listened by me.** Edges: ffmpeg `silencedetect -35 dB / 0.10 s` assigned by line order and comma pauses; faster-whisper gave a usable check on L01-L02 (L01 first half ends about 2.3 s, "แล้วลองยก..." 2.3-3.7 s) and on the L07/L08/L09 starts, but is garbled elsewhere, so edges are +-0.1 s and sub-line anchors (marked ~) +-0.2 s.

Store (`projects/EDU/voice/`): `ep09-nar-kore-A-r13-full.wav` (+ `.json`, slowed full read), `ep09-nar-kore-A-r13-full-raw.wav` (+ `.json`, unslowed), per-line `ep09-nar-kore-A-r13-full-L01.wav` ... `-L15.wav` (+ `.json`; cut at the middle of each inter-line gap, 11 files). Git copy of the full read: `public/narration/EDU-EP09-SHORT.wav` (candidate, not locked).

| Line | Start | End | Dur (s) | Syl | Syl/s | Gap after |
| --- | --- | --- | --- | --- | --- | --- |
| L01 | 0.25 | 3.75 | 3.50 | 17 | 4.86 | 0.42 |
| L02 | 4.17 | 6.24 | 2.07 | 10 | 4.83 | 0.43 |
| L03 | 6.67 | 8.32 | 1.65 | 9 | **5.45** | 0.44 |
| L04 | 8.76 | 11.44 | 2.68 | 9 | 3.36 (commas) | 0.76 |
| L05 | 12.20 | 14.71 | 2.51 | 13 | 5.18 | 0.80 |
| L06 | 15.51 | 19.65 | 4.14 | 18 | 4.35 | 0.36 |
| L07 | 20.01 | 23.73 | 3.72 | 16 | 4.30 | **0.19** |
| L08 | 23.92 | 28.45 | 4.53 | 21 | 4.64 | 0.53 |
| L09 | 28.98 | 33.73 | 4.75 | 21 | 4.42 | 0.59 |
| L12 | 34.32 | 38.30 | 3.98 | 19 | 4.77 | 0.47 |
| L15 | 38.77 | 42.20 | 3.43 | 17 | 4.96 | n/a |

Sub-line anchors (~): L06 "เหมือนสายเชิดหุ่น" ~18.87; L07 "นิ้วนางไม่มี" 22.97 (after the comma), "ไม่มี" ~23.3; L08 "ชุดเดียวกับ" ~24.2, comma pause 25.58-26.12; L09 "พอนิ้วกลางพับลง" ~30.1, "นิ้วนางเลยติด" 32.95.

- Speech 36.96 s in lines (170 syl, 4.60 syl/s in speech); first sound to last 41.95 s (4.05 syl/s with gaps). Script R1.3 estimate audio ~40.3 s: the read is +2.1 s (file 42.43). **L03: 1.65 s, 5.45 syl/s**, the fastest line (L05 5.18, L15 4.96, L01 4.86, L02 4.83), about 18 % above the 4.60 average and 12 % above the next. It is at the pace of the other lines as the user asked, but it is still the line he found too fast, so it is the one to listen to first. No take was re-done.
- Flags: **no line pair has a gap under 0.15 s**; the smallest is L07/L08 0.19 s (a 0.08 s blip at 20.09-20.25 also sits at the L07 start, the L06/L07 edge is the least certain). Largest gaps L05/L06 0.80 and L04/L05 0.76 (comma pauses at each end of L05's neighbour). The 0.76 and 0.80 gaps are where the V02 and the L05 beat sit.

### Per-shot timing for W5.1 (video time, estimated, from the read)

Rule: the read is NAR only. Non-speech items are inserted at the end of the line before them, each at the script R1.3 length, and the read's natural gap follows them: try 2.0 s + V01 0.6 s after L01 (+2.6 s), taps 0.6 s + V02 1.5 s after L04 (+2.1 s), retry 1.0 s after L12 (+1.0 s), closing hold 2.5 s after L15. A shot starts on its line's first word and ends where the next shot starts (so the gap after a line is the tail of that shot). Row length = shot length in [storyboard.md](storyboard.md) (`review-rows.json` ROWS-R1.8 carries no lengths). Film's rows are not edited; the sheet times and the V01/V02/taps/retry lengths are Film's call.

| Shot | Content | Start | Length | Row (est) | Diff |
| --- | --- | --- | --- | --- | --- |
| B01-SH01 | L01 + try 1.2 | 0.00 | 4.95 | 5.2 | -0.25 |
| B01-SH02 | try 0.8 + V01 | 4.95 | 1.82 | 1.4 | +0.42 (0.42 s gap tail) |
| B01-SH03 | L02 | 6.77 | 2.50 | 2.4 | +0.10 |
| B01-SH04 | L03 | 9.27 | 2.09 | 2.1 | -0.01 (L03 1.65 s) |
| B02-SH01 | L04 + taps | 11.36 | 3.28 | 2.8 | **+0.48** |
| B02-SH02 | V02 | 14.64 | 2.26 | 1.5 | +0.76 (0.76 s gap tail) |
| B02-SH03 | L05 | 16.90 | 3.31 | 3.0 | +0.31 |
| B03-SH01 | L06 to "เส้นเอ็น" | 20.21 | 3.36 | 3.3 | +0.06 |
| B03-SH07 | L06 "เหมือนสายเชิดหุ่น" | 23.57 | 1.14 | 1.0 | +0.14 |
| B03-SH02 | L07 to "นิ้วนาง" | 24.71 | 3.29 | 3.3 | -0.01 |
| B03-SH08 | L07 "ไม่มี" + L08 "ต้องใช้" | 28.00 | 0.90 | 1.0 | -0.10 |
| B03-SH03 | L08 from "ชุดเดียวกับ" | 28.90 | 4.78 | 4.5 | +0.28 |
| B03-SH09 | L09 "มักอธิบายกันว่า" | 33.68 | 1.12 | 1.4 | -0.28 |
| B03-SH04 | L09 from "พอนิ้วกลางพับลง" | 34.80 | 4.22 | 3.6 | +0.62 |
| B04-SH01 | L12 | 39.02 | 3.98 | 4.5 | -0.52 |
| B05-SH01 | retry | 43.00 | 1.47 | 1.0 | +0.47 (0.47 s gap tail) |
| B05-SH02 | L15 | 44.47 | 3.43 | 4.0 | -0.57 |
| B05-SH03 | hold | 47.90 | 2.50 | 2.5 | 0.00 |

Video total **50.4 s** (estimate 48.5 s, +1.9 s; audio 42.43 s vs ~40.3 s); under the 60 s cap, 9.6 s slack. Beats: B01 0-11.36 (est 0-11.1), B02 11.36-20.21 (11.1-18.4), B03 20.21-39.02 (18.4-36.5), B04 39.02-43.00 (36.5-41.0), B05 43.00-50.40 (41.0-48.5). B02 grew most (+1.8 s: L04 commas and the 0.76/0.80 gaps around the V02 beat).

**Shots where the speech (plus inserts) is longer than the row length** (speech durations, gap tails excluded): B02-SH01 L04 2.68 s + taps 0.6 = 3.28 s vs 2.8 s (+0.48); B03-SH01 L06 part ~3.36 vs 3.3 (+0.06); B03-SH04 L09 part ~3.63 vs 3.6 (+0.03, within anchor error). Every other line fits its row; shot windows longer than the row (B01-SH02, B02-SH02, B05-SH01) are the read's gaps after the inserts, which Film can trim. The sub-line cuts in B03 (~, +-0.2 s) should be re-measured on the final cut if the user keeps this read.
