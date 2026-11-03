# EG-EP02-SHORT narration: voice-lock candidate timing (not yet locked)

Status: **candidate, awaiting user ear-approval** (W4); **current file: T-v2 (below); P and T are superseded**. Script EG2-SCRIPT-R1.2 (text unchanged). Voice: Gemini TTS `Achernar` (narrator default), one full read per take, ellipses sent as commas, no per-line style. Generated 2026-11-03, 2 API requests total (A and B).

| Take | Style | Store raw read (80.0 s / 77.1 s, -16 LUFS) |
| --- | --- | --- |
| A | `soft close whisper, melancholy, slow` | `projects/EG/narration/EG-EP02-SHORT-narration-raw-A-whisper.wav` |
| B (recommended) | `warm, quiet, intimate, a little more awake` | `projects/EG/narration/EG-EP02-SHORT-narration-raw-B-warm.wav` |

Assembled from B: each line cut at the real energy gap (silencedetect -36 dB mapped on Whisper large-v3-turbo segments), internal pauses compressed to <= 0.35 s, `atempo=1.08`, written gaps per line ID. Accuracy about +-0.1 s. Loudness: B-x108-pauses -16.0 LUFS, B-x108-tight -16.1 LUFS (ebur128, integrated; mix to delivery level later).

| Version | Store | Speech end s | + 3 s hold |
| --- | --- | --- | --- |
| **P: chosen pauses, x1.08** | `projects/EG/narration/EG-EP02-SHORT-narration-B-x108-pauses.wav` | 64.98 | 67.98 |
| T: pauses x0.7, x1.08 | `projects/EG/narration/EG-EP02-SHORT-narration-B-x108-tight.wav` | 61.73 | 64.73 |
| T112: pauses x0.7, x1.12 (not filed) | n/a | 59.82 | 62.82 |

Gap plan P (seconds after the line): default 0.35; L01 0.45, L05 0.50, L09 0.60, L17 0.50; beat turns L04 0.95, L08 0.85, L11 1.25 (carries the 0.6 s wind SFX gap before L12), L12 0.75, L14 0.95, L18 1.05; L19 0 (then the 3 s hold). Version T multiplies every gap by 0.7.

| Line | P start s | P end s | Dur s | P gap after s | T start s | T end s | T gap after s |
| --- | --- | --- | --- | --- | --- | --- | --- |
| L01 | 0.00 | 4.10 | 4.10 | 0.45 | 0.00 | 4.10 | 0.32 |
| L02 | 4.55 | 7.16 | 2.61 | 0.35 | 4.42 | 7.03 | 0.24 |
| L03 | 7.51 | 10.00 | 2.49 | 0.35 | 7.27 | 9.76 | 0.24 |
| L04 | 10.35 | 13.36 | 3.01 | 0.95 | 10.00 | 13.01 | 0.66 |
| L05 | 14.31 | 19.96 | 5.65 | 0.50 | 13.67 | 19.32 | 0.35 |
| L06 | 20.46 | 23.05 | 2.59 | 0.35 | 19.67 | 22.26 | 0.24 |
| L07 | 23.40 | 24.37 | 0.97 | 0.35 | 22.50 | 23.47 | 0.24 |
| L08 | 24.72 | 27.88 | 3.16 | 0.85 | 23.71 | 26.87 | 0.59 |
| L09 | 28.73 | 31.75 | 3.02 | 0.60 | 27.46 | 30.48 | 0.42 |
| L10 | 32.35 | 36.93 | 4.58 | 0.35 | 30.90 | 35.48 | 0.24 |
| L11 | 37.28 | 39.15 | 1.87 | 1.25 | 35.72 | 37.59 | 0.88 |
| L12 | 40.40 | 42.18 | 1.79 | 0.75 | 38.47 | 40.25 | 0.52 |
| L13 | 42.93 | 45.18 | 2.24 | 0.35 | 40.77 | 43.02 | 0.24 |
| L14 | 45.53 | 48.66 | 3.13 | 0.95 | 43.26 | 46.39 | 0.66 |
| L15 | 49.61 | 52.21 | 2.60 | 0.35 | 47.05 | 49.65 | 0.24 |
| L16 | 52.56 | 56.84 | 4.28 | 0.35 | 49.89 | 54.17 | 0.24 |
| L17 | 57.19 | 60.09 | 2.90 | 0.50 | 54.41 | 57.31 | 0.35 |
| L18 | 60.59 | 62.17 | 1.57 | 1.05 | 57.66 | 59.24 | 0.73 |
| L19 | 63.22 | 64.98 | 1.76 | 0.00 | 59.97 | 61.73 | 0.00 |

**Length finding:** the read is longer than the script estimate (45 s speech): speech is 54.3 s at x1.08 even with compressed internal pauses. Total with the 3 s hold is 65-68 s, over the 60 s Short limit by 5-8 s. Options for the user/Preaw: cut L03 and/or L08 (about 2.3 s + 2.9 s with their gaps), or accept x1.12 plus tight gaps (62.8 s, still over). Not decided here.

**Take comparison:** A is about 11 % slower (speech-only 49.5 s vs 44.4 s at x1.08 before gaps) and Whisper could not recognise `ธูปยังมีควัน`, `ยกเว้นคุณ`, `เหมือนใครบางคน` or the L10-L12 block (one hallucinated 15 s segment), so per-line cuts for A were not made (it needs a listening pass before use). B was recognised on all 19 lines.

**Thai word landing (Whisper large-v3-turbo transcription, a proxy, not a listen):** `ตามหา`, `เส้นทาง`, `ท่าเรือ` land in both takes; `ศาลเจ้า` heard as `สารเจ้า` in both (ศ/ส same sound, treat as OK); `ฮู้ด` heard as `หูด` in both (possible short/rising tone, listen to L02); `เยาวราช` heard `เย่วราช` (B) / `ย่าวราช` (A): the `ao` glide may be clipped, listen to L03; `พวงมาลัย` heard `พรมมาลัย` (B) / `พวกมารายบน` (A): listen to L06; `ควัน` heard `ควร` (B) and the whole word garbled in A: listen to L07; `กรุงเทพฯ` heard `กรุงเทพ` (B) / `กลงแทบชาว` (A).

Reproduce: `out/eg2-voice/` (`full.txt`, `build.py`, `assemble.py`); `out/gemini-venv/bin/python -I scripts/gemini-tts.py say --voice Achernar --style "<style>" --text-file out/eg2-voice/full.txt <out.wav>`.

## T-v2 (2026-11-03, current: use this one)

User feedback after listening: switch to T (tight: atempo 1.08, every gap x0.7); L19 `มันแค่ไม่ได้ยินคุณอีกแล้ว` sounded different from the rest and the pause before it was a bit long. **P is superseded by T-v2; T (v1) is superseded too.**

| File | Store | Speech end s | + 3 s hold |
| --- | --- | --- | --- |
| **T-v2 (use)** | `projects/EG/narration/EG-EP02-SHORT-narration-B-x108-tight-v2.wav` | 61.24 | 64.24 |
| T-v2alt (L19 = processed original, listen-compare only) | `projects/EG/narration/EG-EP02-SHORT-narration-B-x108-tight-v2alt-L19processed.wav` | 61.45 | 64.45 |
| Regenerated L18+L19 raw (1 API request) | `projects/EG/narration/EG-EP02-SHORT-narration-raw-B-L18L19-regen.wav` | n/a | n/a |

Loudness of both: -16.2 LUFS integrated, true peak about -1.5 dBFS (ebur128).

**L19 diagnosis (raw take B, measured per line, 48 kHz):** the raw L19 differs from L16-L18 in level and pitch, not in speed or contour. LUFS -13.2 vs -16.9 / -15.4 / -17.2 (L16 / L17 / L18), so about +4 dB over L18; F0 median 181 Hz vs 161 / 172 / 166 Hz (+9 % over L18); spectral centroid 1728 Hz vs 1556 / 1893 / 1736 Hz (similar); rate 13.3 chars/active s vs 15.9 / 14.1 / 14.4 (slightly slower, +-10 %). Also its second quarter peaks at 234 Hz and -10 dB (stressed "คุณ"-side peak), against 195 Hz and -16 dB in L18.

**Fix:** L18 + L19 regenerated once (1 request, voice Achernar, style `warm, quiet, intimate, a little more awake; soft and close, even low energy, calm, do not raise pitch or volume on the last sentence`, text `เมืองนี้ไม่เคยเงียบเลย, มันแค่ไม่ได้ยินคุณอีกแล้ว.`). Only the regenerated L19 is used (original L18 kept: its F0 spread is closer to the rest of the clip). Regenerated L19 vs regenerated L18 in the same read: F0 155.6 vs 157.9 Hz, level +0.8 dB (original: +4 dB, +9 % pitch). After x1.08 and a gain of -1.1 dB: L19 -17.0 LUFS, F0 155 Hz (L16-L18: -17.1 / -15.4 / -17.1 LUFS, 161 / 171 / 166 Hz); Whisper large-v3-turbo transcribes it exactly `มันแค่ไม่ได้ยินคุณอีกแล้ว`. Alternative v2alt: original L19 with -4 dB and pitch -6 % (asetrate/atempo; F0 171 Hz, -17.2 LUFS, same transcription), kept only to compare by ear. Splice: 12 ms fade-in and 20 ms fade-out on L19 around a silent gap (a crossfade across a gap adds nothing).

**Gap L18 -> L19:** T was 0.73 s; T-v2 is **0.45 s** (other T beat turns: 0.52-0.88 s; 0.45 is shorter than any). Change it by `python3 out/eg2-voice/assemble-v2.py <L19 wav> <tag> <gap>`.

| Line | T-v2 start s | T-v2 end s | Dur s | Gap after s |
| --- | --- | --- | --- | --- |
| L01 | 0.00 | 4.10 | 4.10 | 0.32 |
| L02 | 4.42 | 7.03 | 2.61 | 0.24 |
| L03 | 7.27 | 9.76 | 2.49 | 0.24 |
| L04 | 10.00 | 13.01 | 3.01 | 0.66 |
| L05 | 13.67 | 19.32 | 5.65 | 0.35 |
| L06 | 19.67 | 22.26 | 2.59 | 0.24 |
| L07 | 22.50 | 23.47 | 0.97 | 0.24 |
| L08 | 23.71 | 26.87 | 3.16 | 0.59 |
| L09 | 27.46 | 30.48 | 3.02 | 0.42 |
| L10 | 30.90 | 35.48 | 4.58 | 0.24 |
| L11 | 35.72 | 37.59 | 1.87 | 0.88 |
| L12 | 38.47 | 40.25 | 1.79 | 0.52 |
| L13 | 40.77 | 43.02 | 2.24 | 0.24 |
| L14 | 43.26 | 46.39 | 3.13 | 0.66 |
| L15 | 47.05 | 49.65 | 2.60 | 0.24 |
| L16 | 49.89 | 54.17 | 4.28 | 0.24 |
| L17 | 54.41 | 57.31 | 2.90 | 0.35 |
| L18 | 57.66 | 59.24 | 1.57 | 0.45 |
| L19 | 59.69 | 61.24 | 1.55 | 0.00 |

Narration ends at 61.24 s; the 3 s hold makes 64.24 s. Lines L01-L18 are sample-identical to T (v1); everything from L19 on moves 0.28 s earlier than in T, so L19 starts at 59.69 s (T: 59.97 s). Reproduce: `out/eg2-voice/assemble-v2.py`, `out/eg2-voice/v2/` (measure script in the scratchpad: voice-match.py metrics per line).
