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
- Store: `projects/edu/EDU/voice/ep09-nar-kore-A-fullread.wav` (+ `.json`). Local reproduction inputs `out/ep09-voice/full/` (ignored). Per-line split is not done yet (W4 voice lock).

## User tweak 2026-11-08: 5% slower

User asked for the full read 5% slower. Take `~/ReelsStore/projects/edu/EDU/voice/ep09-nar-kore-A-fullread-x0.95.wav` (ffmpeg atempo=0.95 of the same Gemini take, no new request): raw 49.48 s -> 52.07 s. Projection (arithmetic, not re-measured): speech 41.66 s -> about 43.9 s, video as read 57.1 s -> about 59.7 s, re-gapped 53.2 s -> about 55.4 s. Under 60 s but with about 0.3 s margin as read; cut C1 (L13) if W6 timing runs over. This overrides the series "no atempo" default for EP09 only, at the user's request.

## Full read R1.3 (W4 step 2, 2026-11-08)

User decision 2026-11-08: L03 at the same pace as the other lines; no separate slow L03 take (s1-s3 discarded). **One Gemini request**, one attempt, exit 0, log `out/logs/ep09-r13-full.log`: `gemini-3.8-flash-tts`, Kore, **the same style prompt as the W1.4 read** (style A, "fast-paced ... pronounce every word clearly"), L01 ban1 spacing, ellipses as commas. Text `out/ep09-voice/r13/lines-nar.txt`: the 11 NAR lines of script EDU-EP09-SCRIPT-R1.3 (L01-L09, L12, L15 with "แค่"; L10, L13 cut). Raw 40.32 s, then ffmpeg atempo=0.95 (48 kHz mono, -16.0 LUFS, -1.5 dBTP) = **42.43 s**. **Not listened by me.** Edges: ffmpeg `silencedetect -35 dB / 0.10 s` assigned by line order and comma pauses; faster-whisper gave a usable check on L01-L02 (L01 first half ends about 2.3 s, "แล้วลองยก..." 2.3-3.7 s) and on the L07/L08/L09 starts, but is garbled elsewhere, so edges are +-0.1 s and sub-line anchors (marked ~) +-0.2 s.

Store (`projects/edu/EDU/voice/`): `ep09-nar-kore-A-r13-full.wav` (+ `.json`, slowed full read), `ep09-nar-kore-A-r13-full-raw.wav` (+ `.json`, unslowed), per-line `ep09-nar-kore-A-r13-full-L01.wav` ... `-L15.wav` (+ `.json`; cut at the middle of each inter-line gap, 11 files). Git copy of the full read: `public/narration/EDU-EP09-SHORT.wav` (candidate, not locked).

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

## Full read R1.3 s2 (x0.9025, 2026-11-08)

User, after listening to the x0.95 read: "too fast, slow it 5%". No new TTS request. Derived from the raw take `ep09-nar-kore-A-r13-full-raw.wav` with a single `atempo=0.9025` (0.95 x 0.95), then two-pass `loudnorm` (linear, I=-16, TP=-1.5; check -16.0 LUFS, -1.6 dBTP), 48 kHz mono. The previous x0.95 files are kept. Line times are the x0.95 anchors divided by 0.95 (exact for atempo), cross-checked with `silencedetect` (-40 dB; ends within ~0.04 s).

Store (`projects/edu/EDU/voice/`): `ep09-nar-kore-A-r13-full-s2.wav` (+ `.json`, 44.66 s) and per-line `ep09-nar-kore-A-r13-full-s2-L01.wav` ... `-L15.wav` (+ `.json` sidecars with source, factor, cut and speech times; 11 lines). Git candidate: `public/narration/EDU-EP09-SHORT.wav` replaced (not locked, no `store.py use`).

| Line | Start | End | Dur (s) | Syl/s | Gap after |
| --- | --- | --- | --- | --- | --- |
| L01 | 0.26 | 3.95 | 3.68 | 4.61 | 0.44 |
| L02 | 4.39 | 6.57 | 2.18 | 4.59 | 0.45 |
| L03 | 7.02 | 8.76 | 1.74 | **5.18** | 0.46 |
| L04 | 9.22 | 12.04 | 2.82 | 3.19 | 0.80 |
| L05 | 12.84 | 15.48 | 2.64 | 4.92 | 0.84 |
| L06 | 16.33 | 20.68 | 4.36 | 4.13 | 0.38 |
| L07 | 21.06 | 24.98 | 3.92 | 4.09 | **0.20** |
| L08 | 25.18 | 29.95 | 4.77 | 4.40 | 0.56 |
| L09 | 30.51 | 35.51 | 5.00 | 4.20 | 0.62 |
| L12 | 36.13 | 40.32 | 4.19 | 4.54 | 0.49 |
| L15 | 40.81 | 44.42 | 3.61 | 4.71 | n/a |

Audio 44.66 s (speech 38.91 s in lines, 4.37 syl/s; first sound to last 44.16 s). L03 is still the fastest line (5.18 syl/s, about 19 % above the average, 5 % above L05 4.92). No gap under 0.15 s; smallest L07/L08 0.20 s.

### Per-shot timing for W5.1 (s2)

Same insert lengths as the x0.95 table (try 2.0 + V01 0.6 after L01; taps 0.6 + V02 1.5 after L04; retry 1.0 after L12; hold 2.5).

| Shot | Start | Length | Row | Diff |
| --- | --- | --- | --- | --- |
| B01-SH01 | 0.00 | 5.15 | 5.2 | -0.05 |
| B01-SH02 | 5.15 | 1.84 | 1.4 | +0.44 |
| B01-SH03 | 6.99 | 2.63 | 2.4 | +0.23 |
| B01-SH04 | 9.62 | 2.20 | 2.1 | +0.10 |
| B02-SH01 | 11.82 | 3.42 | 2.8 | **+0.62** |
| B02-SH02 | 15.24 | 2.30 | 1.5 | +0.80 |
| B02-SH03 | 17.54 | 3.48 | 3.0 | +0.48 |
| B03-SH01 | 21.03 | 3.54 | 3.3 | +0.24 |
| B03-SH07 | 24.56 | 1.20 | 1.0 | +0.20 |
| B03-SH02 | 25.76 | 3.46 | 3.3 | +0.16 |
| B03-SH08 | 29.23 | 0.95 | 1.0 | -0.05 |
| B03-SH03 | 30.17 | 5.03 | 4.5 | +0.53 |
| B03-SH09 | 35.21 | 1.18 | 1.4 | -0.22 |
| B03-SH04 | 36.38 | 4.44 | 3.6 | +0.84 |
| B04-SH01 | 40.83 | 4.19 | 4.5 | -0.31 |
| B05-SH01 | 45.02 | 1.49 | 1.0 | +0.49 |
| B05-SH02 | 46.51 | 3.61 | 4.0 | -0.39 |
| B05-SH03 | 50.12 | 2.50 | 2.5 | 0.00 |

Video total **52.62 s** (x0.95 table 50.4 s); 7.38 s slack under the 60 s cap. Speech longer than its row: B02-SH01 (L04 2.82 + taps 0.6 = 3.42 vs 2.8, +0.62), B03-SH01 (+0.24), B03-SH04 (L09 part ~3.82 vs 3.6, +0.22). Windows longer than the row by a gap tail: B01-SH02, B02-SH02, B03-SH04, B05-SH01. Anchors are scaled, not re-listened. Not approved; the user listens next.

## Full read R1.4 s2 (x0.9025, 2026-11-08)

Script EDU-EP09-SCRIPT-R1.4 (only L12 changed: `เล่นมาหลายปี แค่ควบคุมได้ดีกว่าคนทั่วไป`; user approved the wording, Boat recheck b1d4fce no change). Same process as R1.3 s2: **one Gemini request**, one attempt, exit 0, log `out/logs/ep09-r14-full.log`: `gemini-3.8-flash-tts`, Kore, the same style A prompt, L01 ban1 spacing, same 11 NAR lines (L01-L09, L12, L15), ellipses as commas (`out/ep09-voice/r14/lines-nar.txt`; only the L12 text differs from the r13 file). Raw 40.60 s (R1.3 raw 40.32 s), then a single `atempo=0.9025` and two-pass `loudnorm` (linear, I=-16, TP=-1.5; check -16.1 LUFS, -1.5 dBTP), 48 kHz mono = **44.98 s** (R1.3 s2 44.66 s). This is a **new take**, so every line differs slightly from the R1.3 read, not only L12; no L03 pace change beyond the process. **Not listened by me**; edges by `silencedetect -35 dB / 0.06 s` (+-0.1 s). faster-whisper failed to run here (av `metadata_errors` TypeError), so there is no transcript check.

Store (`projects/edu/EDU/voice/`): `ep09-nar-kore-A-r14-full-s2.wav` (+ `.json`), `ep09-nar-kore-A-r14-full-raw.wav` (+ `.json`, unslowed take), per-line `ep09-nar-kore-A-r14-full-s2-L01.wav` ... `-L15.wav` (+ `.json`; cut at the middle of each gap, 11 files). Not copied to `public/narration`, no `store.py use`; the locked-candidate file there is still the R1.3 s2 read.

| Line | Start | End | Dur (s) | Syl | Syl/s | Gap after |
| --- | --- | --- | --- | --- | --- | --- |
| L01 | 0.20 | 3.96 | 3.75 | 17 | 4.53 | 0.62 |
| L02 | 4.58 | 6.80 | 2.22 | 10 | 4.51 | 0.46 |
| L03 | 7.26 | 8.88 | 1.63 | 9 | **5.54** | 0.65 |
| L04 | 9.53 | 11.87 | 2.34 | 9 | 3.84 (commas) | 0.90 |
| L05 | 12.78 | 15.56 | 2.78 | 13 | 4.67 | 0.92 |
| L06 | 16.48 | 20.87 | 4.39 | 18 | 4.10 | 0.48 |
| L07 | 21.35 | 24.91 | 3.57 | 16 | 4.49 | 0.63 |
| L08 | 25.54 | 29.64 | 4.10 | 21 | 5.12 | 0.86 |
| L09 | 30.50 | 35.34 | 4.84 | 21 | 4.34 | 0.88 |
| **L12** | **36.22** | **40.59** | **4.37** | 19 | **4.35** | 0.58 |
| L15 | 41.16 | 44.70 | 3.54 | 17 | 4.81 | n/a |

Syllable counts are the R1.3 counts (R1.4 L12 has the same count: `นิ้วแยกกัน` and `แค่ควบคุม` are 3 syllables each).

- Audio 44.98 s; speech 37.52 s in lines (4.53 syl/s in speech); first sound to last 44.50 s. No gap under 0.15 s; smallest gaps L02/L03 0.46 and L06/L07 0.48 (all gaps 0.46-0.92 s).
- **L12 timing: 36.22-40.59 s, 4.37 s (R1.3 s2 4.19 s, +0.18 s), 4.35 syl/s**. That is 4 % under the other ten lines (4.55 syl/s) and the fourth slowest (L04 3.84, L06 4.10, L09 4.34), so **L12 is not fast**; no flag. Inside L12 there are two pauses: after `แล้วนักเปียโนล่ะ,` (37.09-37.59, 0.50 s) and a 0.32 s pause before `แค่ควบคุม` (38.52-38.84, at the former space; not a comma in the TTS text). Gap before L12 (after L09) 0.88 s, after L12 0.58 s.
- **L03: 1.63 s, 5.54 syl/s**, still the fastest line (R1.3 s2 5.18); the next is L08 5.12, 8 % below, and L03 is 22 % above the 4.53 average. It is the same process, so the user's note (L03 as fast as other lines) is kept; listen to L03 first. L08 (5.12) is also quick in this take.

### Per-shot timing for W5.1 (R1.4 s2)

Same rule and inserts as R1.3 s2 (try 2.0 + V01 0.6 after L01; taps 0.6 + V02 1.5 after L04; retry 1.0 after L12; hold 2.5). Sub-line starts in B03 are re-estimated for this take: L09 "พอนิ้วกลางพับลง" 31.74 s (measured, end of the comma pause 31.42-31.74); L06 "เหมือนสายเชิดหุ่น" ~20.00 s, L07 "ไม่มี" ~24.40 s, L08 "ชุดเดียวกับ" ~25.83 s are proportional estimates (+-0.25 s; no pause marks them).

| Shot | Start | Length | Row | Diff |
| --- | --- | --- | --- | --- |
| B01-SH01 | 0.00 | 5.16 | 5.2 | -0.04 |
| B01-SH02 | 5.16 | 2.02 | 1.4 | +0.62 |
| B01-SH03 | 7.18 | 2.67 | 2.4 | +0.27 |
| B01-SH04 | 9.86 | 2.27 | 2.1 | +0.17 |
| B02-SH01 | 12.13 | 2.94 | 2.8 | +0.14 |
| B02-SH02 | 15.07 | 2.40 | 1.5 | +0.90 |
| B02-SH03 | 17.48 | 3.71 | 3.0 | +0.71 |
| B03-SH01 | 21.18 | 3.52 | 3.3 | +0.22 |
| B03-SH07 | 24.70 | 1.35 | 1.0 | +0.35 |
| B03-SH02 | 26.05 | 3.05 | 3.3 | -0.25 |
| B03-SH08 | 29.10 | 1.43 | 1.0 | +0.43 |
| B03-SH03 | 30.53 | 4.67 | 4.5 | +0.17 |
| B03-SH09 | 35.20 | 1.24 | 1.4 | -0.16 |
| B03-SH04 | 36.44 | 4.48 | 3.6 | +0.88 |
| B04-SH01 | 40.92 | 4.37 | 4.5 | -0.13 |
| B05-SH01 | 45.29 | 1.58 | 1.0 | +0.58 |
| B05-SH02 | 46.87 | 3.54 | 4.0 | -0.46 |
| B05-SH03 | 50.40 | 2.50 | 2.5 | 0.00 |

Video total **52.90 s** (R1.3 s2 52.62 s); 7.10 s slack under the 60 s cap. Speech longer than its row (gap tails excluded): only B03-SH01 (L06 part ~3.5 vs 3.3, +0.2); B03-SH04's L09 part is ~3.6 vs 3.6 (0) after the 31.74 anchor. Windows longer than the row are gap tails after inserts (B01-SH02, B02-SH02, B02-SH03, B03-SH04, B05-SH01), which Film can trim. B04-SH01 (L12, 4.37 s) fits its 4.5 s row with 0.13 s spare. Not approved; the user listens next.
