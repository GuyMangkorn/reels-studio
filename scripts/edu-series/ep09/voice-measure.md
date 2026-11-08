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
