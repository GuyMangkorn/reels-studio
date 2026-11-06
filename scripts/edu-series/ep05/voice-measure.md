# EDU-EP05-SHORT voice measure (W4 lock, 2026-11-06)

- Script EDU-EP05-SCRIPT-R1.3a. NAR = Gemini TTS Kore brisk, atempo 1.10 (user passed by ear 2026-11-06). TINY = Leda picks per [voice-notes.md](voice-notes.md) section 4 plus V03 t2. **0 Gemini requests** in this step.
- Source read `projects/EDU/narration/ep05/2026-11-06_ep05-nar-kore-brisk-fullread-x110.wav`, 55.50 s. Speech alone 47.21 s over 16 lines; re-gapped at 0.28 s (15 gaps) = 51.41 s (note only; placement is Film W5, the user accepted the video slightly over 60 s).
- Method: Whisper alignment snapped to silencedetect edges (-35 dB, 0.15 s). Start/End are positions in the x1.10 read. Split files `lines/` carry 0.05 s lead (onset in file = 0.05 s) and 0.08 s tail. Machine-readable: [voice-measure.json](voice-measure.json).

| Line | Start | End | Dur (s) | File dur (s) | Note |
| --- | --- | --- | --- | --- | --- |
| L01 | 0.22 | 1.21 | 0.99 | 1.12 |  |
| L02 | 1.72 | 4.62 | 2.90 | 3.03 |  |
| L03 | 5.15 | 7.37 | 2.22 | 2.35 |  |
| L04 | 7.99 | 10.69 | 2.70 | 2.83 |  |
| L05 | 11.22 | 14.96 | 3.75 | 3.88 |  |
| L06 | 15.55 | 18.40 | 2.85 | 2.98 |  |
| L07 | 19.00 | 21.31 | 2.31 | 2.44 |  |
| L09 | 21.80 | 25.48 | 3.68 | 3.81 |  |
| L10 | 25.81 | 27.75 | 1.95 | 2.08 |  |
| L11 | 28.35 | 30.63 | 2.29 | 2.42 |  |
| L12 | 31.08 | 34.68 | 3.60 | 3.73 |  |
| L13 | 35.08 | 37.13 | 2.05 | 2.18 |  |
| L14 | 37.80 | 39.79 | 1.99 | 2.12 | UNCERTAIN: boundary L14/L15 (Whisper merged them; silence gap 39.79-40.23 used; +-0.3 s) |
| L15 | 40.23 | 45.70 | 5.47 | 5.60 | UNCERTAIN: start (same gap) and end (45.52 Whisper vs 45.70 silence) |
| L16 | 46.41 | 51.14 | 4.73 | 4.86 | UNCERTAIN: opens with a 0.5 s 'แล้วคุณล่ะ' (46.41-46.91) then a 0.55 s pause; assigned to L16, not L15 |
| L17 | 51.51 | 55.23 | 3.73 | 3.86 |  |

Store: `projects/EDU/narration/ep05/lines/2026-11-06_ep05-nar-<L>-kore-x110.wav` (48 kHz mono, 16-bit). L08 is TINY, not in the NAR read.

## TINY picks (durations)

| ID | Take | Dur (s) | Store |
| --- | --- | --- | --- |
| L08 | t1 | 3.24 | `projects/EDU/narration/ep05/tiny/L08-t1.wav` |
| V01 | t1 | 0.60 | `projects/EDU/narration/ep05/tiny/V01-t1.wav` |
| V02 | t2 | 2.16 | `projects/EDU/narration/ep05/tiny/V02-t2.wav` |
| V03 | t2 | 1.48 | `projects/EDU/narration/ep05/tiny/V03-t2.wav` |
| V04 | t2 trimmed | 3.90 | `projects/EDU/narration/ep05/tiny/2026-11-06_ep05-V04-t2-trim.wav` |
| V05 | t1 | 1.32 | `projects/EDU/narration/ep05/tiny/V05-t1.wav` |
| V06 | t2 | 2.24 | `projects/EDU/narration/ep05/tiny/V06-t2.wav` |
| V07 | t1 | 0.72 | `projects/EDU/narration/ep05/tiny/V07-t1.wav` |
| V08 | t1 | 1.00 | `projects/EDU/narration/ep05/tiny/V08-t1.wav` |

- V03: **t2** chosen by measurement (no new request): 1.48 s vs t1 1.88 s, same structure (huh 0.26-0.60 s, giggle 0.94-1.37 s); Whisper heard t2 as a puzzled "อ่ะ?" and t1 as an exclamation "เฮ้". The user found both fine.
- V04: original t2 (4.16 s) kept. Trim `...V04-t2-trim.wav` = 0-3.90 s, grunt 0.29-0.87, gap 1.15, grunt 2.01-2.73, gap 0.60, gasp 3.34-3.74, tail cut (3.90 s). Optional `...V04-t2-tight.wav` = the same three sounds with both gaps set to 0.30 s (2.75 s) if the release needs to be shorter. Film/Editor choose at W5.

## Uncertain boundaries (+-0.3 s)

- L14/L15: Whisper merged them; the 0.44 s silence at 39.79-40.23 s is used as the boundary.
- L15 end (Whisper 45.52, silence 45.70) and L16 opening "แล้วคุณล่ะ" (0.5 s fragment at 46.41-46.91, pause to 47.46): assigned to L16.
- All other lines agree between Whisper and silence edges within 0.25 s.
