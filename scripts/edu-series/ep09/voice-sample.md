# EDU-EP09-SHORT voice samples (W1.4 step 1, Editor, 2026-11-08)

No full read yet; the user picks first. Script EDU-EP09-SCRIPT-R1.1 L01-L03 (V01 skipped), ellipses as commas in the TTS text only:
`วางมือแบนบนโต๊ะ พับนิ้วกลางลงไป, แล้วลองยกนิ้วนางดูสิ, ยกได้นิดเดียว, หรือไม่ขึ้นเลยใช่ไหม, เบา ๆ นะ อย่าเอามืออีกข้างดึง`

Voice Gemini Kore, `gemini-3.8-flash-tts`, no atempo, 3 requests (one attempt each, exit 0), log `out/logs/ep09-samples.log`, inputs `out/ep09-voice/`. Only `--style` differs. Not listened by me; durations by ffprobe.

Store: `~/ReelsStore/projects/edu/EDU/voice/ep09-nar-kore-{A,B,C}.wav` (+ `.json`).

| Cand | Style | Dur |
| --- | --- | --- |
| A | EP06/EP08 style A: playful deadpan, dry, matter-of-fact | 8.76 s |
| B | teasing challenge, "daring a friend to try it now", playful, curious | 8.20 s |
| C | warm, gently amused, friend guiding step by step, reassuring | 9.00 s |

All styles include "fast-paced, brisk, short pauses, speaking quickly without dragging".

## Re-tune: "แบน" in L01 (user pick A, 2026-11-08)

Note: "the word แบน sounds odd". 2 takes of L01 only (`วางมือแบนบนโต๊ะ พับนิ้วกลางลงไป`), style A + "pronounce every word clearly", Kore, 2 requests, exit 0. Script text unchanged; TTS text only. Not listened by me.

| Take | TTS text change | Dur |
| --- | --- | --- |
| ban1 | spaces around the word: `วางมือ แบน บนโต๊ะ,` | 2.60 s |
| ban2 | respelling `แบนน` (same tone, longer final) | 3.36 s |

Store: `~/ReelsStore/projects/edu/EDU/voice/ep09-nar-kore-A-ban{1,2}.wav`. Synonym fallback "ราบ" not used (would change script wording).

## L03 re-read, slower (W4 step 1, user note after the full read, 2026-11-08)

Script EDU-EP09-SCRIPT-R1.3 L03 `เบา ๆ นะ อย่าเอามืออีกข้างดึง`, text kept; commas are added in the TTS text only. Gemini Kore, `gemini-3.8-flash-tts`, style A base (playful deadpan, dry, matter-of-fact, pronounce every word clearly) with the "fast-paced, brisk" part replaced by slowness directions. 3 requests, one attempt each, all exit 0, logs `out/logs/ep09-l03-s{1,2,3}.log`, inputs `out/ep09-voice/l03/`. No atempo on the Gemini take; the filed `-s{n}.wav` then has the x0.95 slowdown (ffmpeg atempo=0.95, 48 kHz), as the full read did; `-raw.wav` is the unslowed take. Not listened by me; the user picks. Speech = first to last sound by silencedetect -35 dB.

| Cand | Direction (style add-on; TTS text) | Raw dur | Raw speech | x0.95 dur | x0.95 speech |
| --- | --- | --- | --- | --- | --- |
| s1 | "slightly slower than normal, unhurried, a short beat after each clause"; `เบา ๆ นะ, อย่าเอามืออีกข้างดึง` | 3.96 s | 3.42 s | 4.15 s | 3.60 s |
| s2 | "slow and deliberate, short beat before each clause, clearly separated phrases"; `เบา ๆ นะ, อย่าเอามือ, อีกข้าง, ดึง` | 6.28 s | 5.68 s | 6.60 s | 5.98 s |
| s3 | "very slow, one word at a time, clear beat before each clause, calm and careful like a safety warning"; `เบา ๆ นะ,, อย่า, เอามือ, อีกข้าง, ดึง` | 7.72 s | 7.09 s | 8.11 s | 7.46 s |

Earlier full read L03: 1.49 s speech (9 syl, 6.0 syl/s), 1.57 s after x0.95.

Timing effect (arithmetic, not re-measured): R1.3 estimate audio ~40.3 s, video ~48.5 s, L03 slot 2.1 s (B01-SH04, 9.0-11.1 s). Speech at x0.95 needs 3.6 / 6.0 / 7.5 s, so the beat grows by about +1.5 / +3.9 / +5.4 s over the 2.1 s slot (the R1.3 estimate has no x0.95; applying x0.95 to the other lines adds about +2.0 s first). Projected video with x0.95 elsewhere: about 52.0 / 54.4 / 55.9 s; audio about 42.2 / 44.6 / 46.1 s. All under the 60 s cap; B01 shot lengths are estimates and Film retimes B01-SH04 after the pick (SH04 no longer fits 2.1 s in any candidate).

Store: `~/ReelsStore/projects/edu/EDU/voice/ep09-nar-kore-A-l03-{s1,s2,s3}.wav` (+ `.json`, + `-raw.wav`).

**Superseded (user, 8 Nov 2026):** the slower L03 samples s1-s3 are discarded; the user wants L03 at the same pace as the other lines, so there is no separate L03 take. L03 is read inside the R1.3 full read ([voice-measure.md](voice-measure.md)).
