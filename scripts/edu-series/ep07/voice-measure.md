# EDU-EP07-SHORT voice measure

## W4.1 audition samples (2026-11-08, Editor; script EDU-EP07-SCRIPT-R1.1)

All samples are at most 10 s, Gemini `gemini-3.8-flash-tts`, no atempo, levelled to -16 LUFS by `scripts/gemini-tts.py`. Not judged by ear by the agent: for the user's pick. Store: `~/ReelsStore/projects/edu/EDU/audio/EDU-EP07-SHORT/narr-samples/` (scratch `out/ep07-voice/audition/`, `.json` sidecars hold voice, style and text).

| File | Voice | Content | Dur (s) | LUFS | Peak dBFS |
| --- | --- | --- | --- | --- | --- |
| `ep07-aud-NAR-A-brisk.wav` | Kore | L01, L02, L03 (house deadpan brisk, EP06 style A) | 7.76 | -16.1 | -1.5 |
| `ep07-aud-NAR-B-eerie.wav` | Kore | same text, calm slightly eerie, low and hushed, still brisk; L03 ends at "ราว 8 นาที" (the "20 วินาที" tail is left out to fit 10 s) | 9.40 | -16.7 | -1.5 |
| `ep07-aud-VEN-1.wav` | Aoede | D02 "พรุ่งนี้ร้อนกว่านี้อีก", cheerful breezy teasing vendor | 2.04 | -16.0 | -1.5 |
| `ep07-aud-CUS-1.wav` | Algenib | D01 "ร้อนจังวันนี้", tired mildly whiny working man | 2.64 | -16.0 | -1.7 |

- Styles: A "fast-paced, quick brisk delivery with short pauses between phrases, playful deadpan female narrator, dry and matter-of-fact, speaking quickly without dragging"; B "fast-paced, quick brisk delivery, calm and slightly eerie dry female narrator, low hushed tone, short pauses between phrases, deadpan on the short aside, speaking quickly without dragging"; VEN "cheerful bright breezy street food vendor woman, friendly, a little teasing, casual and quick"; CUS "tired working man, mildly whiny, fanning himself in the heat, casual". TTS text: ellipses as commas, `.` between L01/L02/L03.
- **Requests: 6** (4 kept, 2 discarded NAR-B takes over the 10 s cap: 14.88 s with "deliberate pauses" style, 10.64 s full L03; kept in `out/ep07-voice/discarded/`, not archived). Quota Tier 1: 100/day.
- Open: VEN voice Aoede and CUS voice Algenib are first guesses (Algenib is the series man voice); one voice each, no alternatives offered. After the user pick: ONE full NAR read (sample-before-full-read), then the voice lock measure.

## W4.2 full read (2026-11-08, Editor; script EDU-EP07-SCRIPT-R1.1; measured, NOT listened to) - SUPERSEDED by atempo 0.95 below (user choice 2026-11-08; the 0.90 numbers are kept for history)

User picks (2026-11-08, final): NAR = Kore style A (prompt of `ep07-aud-NAR-A-brisk`), then **atempo 0.90** on the whole NAR read by the user's explicit override of the edu "no atempo" default; VEN = Aoede (D02, = `ep07-aud-VEN-1`); CUS = Algenib (D01 = `ep07-aud-CUS-1`, D03 new).

- **Method.** One Gemini call for all 13 NAR lines (one narrator, one style; ellipses as commas, `.` between lines, text in `out/ep07-voice/full/nar-text.txt`), raw 51.80 s -> `atempo=0.90` -> 57.55 s -> two-pass loudnorm to -16 LUFS / TP -1.5 (measured **-16.0 LUFS, peak -1.5 dBFS**). Lines cut at the midpoint of the silence between lines (Whisper large-v3-turbo transcript used only to place the cuts; local numpy energy floor -40 dBFS for voiced start/end), 10 ms in / 20 ms out fades, 0.06 s head and 0.08 s tail of silence kept. Whisper transcript matched every line in order; it spelled "ไอน์สไตน์" in Latin letters (its own habit), no line missing or repeated.
- **Requests: 2 new** (1 NAR full read, 1 D03). D01 and D02 came from the cache (the audition takes, same voice, style and text; 0 requests). Earlier today: 6. Total today about 8 of 100.
- Dialogue styles: D01 "tired working man, mildly whiny, fanning himself in the heat, casual" (Algenib); D02 "cheerful bright breezy street food vendor woman, friendly, a little teasing, casual and quick" (Aoede); D03 "tired working man, puzzled, looking around in the sudden dark, casual" (Algenib), text "เอ้า, ไฟดับเหรอ". D03 measured -17.2 LUFS (one take of 2.32 s; D01/D02 -16.0); not re-levelled.
- Store: `projects/edu/EDU/audio/EDU-EP07-SHORT/narration/2026-11-08_ep07-nar-kore-A-slow90-fullread.wav` (the locked-candidate full read), `..._ep07-nar-kore-A-raw-pre-atempo.wav` (+ `.json`), `..._ep07-D01/D02/D03.wav`, `lines/2026-11-08_ep07-nar-<ID>.wav`, `lines.json`. Scratch `out/ep07-voice/full/`.

### NAR lines (positions in the slowed full read, s; speech = voiced run above -40 dBFS)

| Line | Start | End | Dur (s) | Gap before (s) | File start | File dur (s) | Onset in file |
| --- | --- | --- | --- | --- | --- | --- | --- |
| L01 | 0.26 | 4.53 | 4.27 | - | 0.200 | 4.410 | 0.060 |
| L02 | 4.90 | 5.57 | 0.67 | 0.37 | 4.840 | 0.810 | 0.060 |
| L03 | 6.25 | 9.59 | 3.34 | 0.68 | 6.190 | 3.480 | 0.060 |
| L05 | 10.04 | 16.18 | 6.14 | 0.45 | 9.980 | 6.280 | 0.060 |
| L06 | 16.98 | 22.76 | 5.78 | 0.80 | 16.920 | 5.920 | 0.060 |
| L07 | 23.21 | 30.89 | 7.68 | 0.45 | 23.150 | 7.820 | 0.060 |
| L08 | 31.77 | 34.11 | 2.34 | 0.88 | 31.710 | 2.480 | 0.060 |
| L09 | 34.76 | 37.43 | 2.67 | 0.65 | 34.700 | 2.810 | 0.060 |
| L10 | 37.89 | 40.62 | 2.73 | 0.46 | 37.830 | 2.870 | 0.060 |
| L11 | 41.42 | 44.58 | 3.16 | 0.80 | 41.360 | 3.300 | 0.060 |
| L12 | 45.24 | 48.02 | 2.78 | 0.66 | 45.180 | 2.920 | 0.060 |
| L13 | 48.68 | 51.91 | 3.23 | 0.66 | 48.620 | 3.370 | 0.060 |
| L14 | 52.55 | 57.24 | 4.69 | 0.64 | 52.490 | 4.830 | 0.060 |

- Speech alone **49.48 s**; whole read 57.55 s (0.26 s lead, 0.31 s tail). Gaps between lines are 0.37-0.88 s as generated (longest before L08 0.88, L06 0.80, L11 0.80); inner comma pauses 0.28-0.60 s; none clipped by measurement (all line cuts sit in silence).

### Dialogue

| Line | Voice | Dur (s) | LUFS | File |
| --- | --- | --- | --- | --- |
| D01 | Algenib | 2.64 | -16.0 | `..._ep07-D01.wav` |
| D02 | Aoede | 2.04 | -16.0 | `..._ep07-D02.wav` |
| D03 | Algenib | 2.32 | -17.2 | `..._ep07-D03.wav` |

### Length flag (open, for the user or Preaw)

- NAR speech 49.48 s + dialogue 7.00 s + the script's ~1.5 s blackout silence + ~0.5 s loop seam = about **58.5 s of speech and silence if nothing overlaps**, and about 64 s once NAR line gaps (0.37-0.88 s as generated) are kept in a serial timeline. The Short target is 40-60 s ([production-requirements](../../../docs/production-requirements.md)); the script estimated NAR 48.3 s before the atempo 0.90 override (the override adds about 5.7 s on its own). Film's timing must overlap D01/D02 with the countdown picture where it can, tighten line gaps in placement, or the user decides to trim (script trim goes to Preaw).
- **Not listened:** pace, pronunciation, emotion and the atempo 0.90 artifacts were not heard by me. Checks done: Whisper transcript in order, silence-gap and duration measures, loudness. The user's ear is the lock.

## W4.2 full read, atempo 0.95 (2026-11-08, Editor; user heard 0.90 and chose to slow only 5%; measured, NOT listened to)

- **Method.** Same raw read (`out/ep07-voice/full/nar-raw.wav`, 51.80 s, 0 new Gemini requests) -> `atempo=0.95` -> 54.52 s -> two-pass loudnorm -16 LUFS / TP -1.5 (re-measured **-16.1 LUFS, peak -1.5 dBFS**). Line cuts at the midpoint of the silence between lines (boundaries taken from the 0.90 cuts scaled by 0.90/0.95, snapped to the silence they fall in; energy floor -40 dBFS), 10 ms in / 20 ms out fades, 0.06 s head and 0.08 s tail kept. Cut positions come from energy only; no new Whisper pass (cuts fall in silence, not verified by transcript).
- **D03 re-levelled** to **-16.0 LUFS** (was -17.2): the take already peaked at -1.5 dBFS, so loudnorm could not raise it; +1.4 dB gain plus a peak limiter (alimiter limit 0.84) gives -16.04 LUFS, peak -1.49 dBFS. A limiter was used, so listen for pumping on D03.
- Store (`projects/edu/EDU/audio/EDU-EP07-SHORT/narration/`): `2026-11-08_ep07-nar-kore-A-slow95-fullread.wav`, `2026-11-08_ep07-D03-lvl16.wav`, `2026-11-08_ep07-nar95-lines.json`, `lines/2026-11-08_ep07-nar95-<ID>.wav`. D01/D02 unchanged (already -16.0). Scratch `out/ep07-voice/full95/` (script reproduces from `nar-raw.wav` + the commands above).

| Line | Start | End | Dur (s) | Gap before (s) | File start | File dur (s) | Onset in file |
| --- | --- | --- | --- | --- | --- | --- | --- |
| L01 | 0.25 | 4.29 | 4.04 | - | 0.187 | 4.178 | 0.06 |
| L02 | 4.63 | 5.28 | 0.64 | 0.34 | 4.575 | 0.783 | 0.06 |
| L03 | 5.92 | 9.08 | 3.16 | 0.64 | 5.862 | 3.295 | 0.06 |
| L05 | 9.52 | 15.33 | 5.82 | 0.44 | 9.457 | 5.957 | 0.06 |
| L06 | 16.08 | 21.57 | 5.49 | 0.75 | 16.017 | 5.631 | 0.06 |
| L07 | 21.99 | 29.27 | 7.28 | 0.42 | 21.93 | 7.423 | 0.06 |
| L08 | 30.10 | 32.32 | 2.22 | 0.83 | 30.035 | 2.365 | 0.06 |
| L09 | 32.93 | 35.46 | 2.53 | 0.61 | 32.869 | 2.673 | 0.06 |
| L10 | 35.90 | 38.48 | 2.58 | 0.44 | 35.839 | 2.717 | 0.06 |
| L11 | 39.23 | 42.23 | 3.00 | 0.75 | 39.17 | 3.136 | 0.06 |
| L12 | 42.86 | 45.49 | 2.63 | 0.63 | 42.798 | 2.773 | 0.06 |
| L13 | 46.11 | 49.18 | 3.06 | 0.62 | 46.055 | 3.203 | 0.06 |
| L14 | 49.79 | 54.22 | 4.44 | 0.61 | 49.727 | 4.577 | 0.06 |

- **Totals.** NAR speech **46.89 s** (0.90: 49.48 s); line gaps sum 7.08 s; whole read 54.52 s (0.25 s lead, 0.30 s tail). Plus dialogue D01-D03 7.00 s, blackout 1.5 s, seam 0.5 s: **55.9 s** if nothing overlaps and gaps are ignored; **about 63 s** serial with the generated line gaps kept (46.89 + 7.08 + 7.00 + 1.5 + 0.5 = 62.97). Target 40-60 s: placement must overlap D01/D02 with picture or tighten gaps (about 3 s to save), or the user trims (script trim goes to Preaw).
- **Not listened:** pace and the atempo 0.95 artifacts were not heard by me. The user's ear is the lock.

## R1.2 samples (2026-11-08, Editor; script EDU-EP07-SCRIPT-R1.2; measured, NOT listened to)

New lines L05 (reworded), L15, L16 and optional V01, for the user to pick A or B. Same voice and prompt as the locked read (Kore, style A: "fast-paced, quick brisk delivery with short pauses between phrases, playful deadpan female narrator, dry and matter-of-fact, speaking quickly without dragging"), ellipses as commas, `.` between L15 and L16, then `atempo=0.95` and two-pass loudnorm -16 LUFS / TP -1.5 (same chain as the locked 0.95 read; here per clip, since the new lines are separate calls, not part of the one full read). Store: `projects/edu/EDU/audio/EDU-EP07-SHORT/narr-samples/2026-11-08_ep07-r12-*.wav`; scratch `out/ep07-voice/r12/` (`.json` sidecars hold voice, style, text).

| File | Content | Dur (s) | LUFS | Speech rate (non-space chars / s, whole clip) |
| --- | --- | --- | --- | --- |
| `ep07-r12-L05-A` | L05 | 5.20 | -16.0 | 12.3 |
| `ep07-r12-L05-B` | L05 | 4.91 | -16.0 | 13.0 |
| `ep07-r12-L15L16-A` | L15 + L16 (pauses 0.57 s between phrases, 0.38 s before the last) | 5.67 | -15.8 | 11.8 |
| `ep07-r12-L15L16-B` | L15 + L16 | 6.05 | -16.0 | 11.1 |
| `ep07-r12-V01-CUS` | V01, Algenib, tag `<laugh>`, style "tired working man, casual, a short amused snort-laugh through the nose at his phone"; no atempo | 1.24 | -21.2 (not re-levelled) | - |

- Locked neighbours for comparison (rate = chars / line seconds, digits not counted as spoken): L03 3.30 s file, L08 2.36 s file (about 11 chars / s). The new lines run about 11-13 chars / s, i.e. L05 slightly faster than the locked pace (L05-B fastest). All new clips sit at -16 LUFS like the locked read.
- **Requests: 5** (L05 x2, L15+L16 x2, V01 x1). Total today about 13 of 100.
- Pick by ear; not heard by me. V01 is a first guess (a `<laugh>` tag may not read as a snort); skip it if it does not sound right. After the pick, the chosen clips need cut-and-place (0.06 s head, 0.08 s tail like the locked lines).
