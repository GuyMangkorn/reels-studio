# EDU-EP32-VOICE-R2 (voice lock at the user's pace, x1.00)

Editor, 2026-11-21, for [EDU-EP32-SCRIPT-R1](script.md). Supersedes [r1](voice-measure-r1.md) (kept as history). Status: **user decision applied (W4.3: Kore, no atempo, L12 pause 0.27 s, L06-L07 gap 0.8 s); measured, not heard by ear.** No API calls: the same raw Kore read and Algenib takes as r1, rebuilt at atempo 1.00 with [voice-lock-build.py](voice-lock-build.py) (`... voice-lock-build.py 1.0` writes `out/ep32-voice/x1.0/`).

## Per-line timing (seconds, 30 fps, timeline 0 = L01 file start)

| Line | Speaker | File | Speech on-off (s) | Frames | Dur | Internal pauses (timeline s, len) |
| --- | --- | --- | --- | --- | ---: | --- |
| L01 | NARR | 0.00-7.64 | 0.04-7.57 | 1-227 | 7.53 | 2.55 (0.28), 5.97 (0.27) |
| L02 | NARR | 7.84-10.64 | 7.93-10.59 | 238-318 | 2.66 | 8.45 (0.52) |
| L03 | NARR | 10.84-14.44 | 10.95-14.38 | 328-431 | 3.43 | none |
| L04 | AGENT | 14.64-16.34 | 14.65-16.14 | 440-484 | 1.49 | none |
| L05 | NARR | 16.54-18.94 | 16.89-18.88 | 507-566 | 1.99 | 17.27 (0.28) |
| L06 | NARR | 19.14-21.00 | 19.43-21.01 | 583-630 | 1.58 | none |
| L07 | AGENT | 21.80-24.61 | 21.80-24.60 | 654-738 | 2.80 | 22.86 (0.34) |
| L08 | NARR | 24.81-29.02 | 24.83-28.93 | 745-868 | 4.10 | none |
| L09 | NARR | 29.22-35.42 | 29.50-35.37 | 885-1061 | 5.87 | 31.54 (0.27), 32.99 (0.31) |
| L10 | NARR | 35.62-37.54 | 35.99-37.45 | 1080-1124 | 1.46 | none |
| L11 | NARR | 37.74-44.10 | 37.78-44.02 | 1133-1321 | 6.24 | 39.12 (0.32) |
| L12 | NARR | 44.30-46.89 | 44.78-46.48 | 1343-1394 | 1.70 | 45.37 (0.28) |
| L13 | NARR | 47.09-52.62 | 47.10-52.55 | 1413-1576 | 5.45 | 48.71 (0.29) |
| L14 | NARR | 52.82-54.71 | 52.83-54.54 | 1585-1636 | 1.71 | 53.12 (0.34) |

Speech ends **54.54 s (frame 1636)**; with the 1.6 s hold after the L14 file end the narration is **56.31 s (1689 f)**, `preview.wav` 56.315 s, 48 kHz mono. Machine-readable: [voice-measure-r2.json](voice-measure-r2.json).

## Against the 50-60 s target and against r1

- **56.31 s with the hold: inside 50-60 s, 3.7 s spare; no trim.** Film's trim order (L10, then the hold) is unused and the script is untouched.
- r1 (x1.05): speech end 52.42 s, total 54.18 s (1625 f). r2: +2.12 s speech end (+64 f), +2.13 s total (+64 f). The L06-L07 gap stays 0.80 s and the other gaps 0.2 s.
- Every line is longer by 4.8 % (the tempo ratio); AGENT lines L04 and L07 are the same length (1.49 s and 2.80 s, not tempo-changed). Speech start frames move later in line: L02 227 to 238, L06 560 to 583, L07 630 to 654, L12 1292 to 1343, L14 1523 to 1585 (full table in the json; the r1 frames no longer apply).
- L12 pause is now 0.28 s (r1 0.27 s, same take, the user kept it).
- L01 now lists a second internal pause, 0.27 s at 5.97 s, that the r1 x1.05 envelope measured under 0.25 s (same take, only slowed).

## Checks

- Whisper (large-v3-turbo) on every line file, 0.5 s padded, log `out/ep32-voice/check-x100.log` (store `narration/ep32-voice-r2/check.log`): each line reads its script words, same ASR spelling noise as r1 ("CAA" for CIA; L02 and L14 ASR spelling noise on the closing phrase; L06 repeats "สนามทดสอบ" from the padded tail; L07 "ตากแดดแล้วครับ" intact). No missing or swapped word.
- Cuts: the raw cut points are identical to r1 (`cuts_raw` equal), so each join is the same audio, only slowed. Silent run at the exact cut, 10 ms peak under 300: L03|L05 0.04 s, L05|L06 0.06 s, **L06|L08 0.01 s** (L06 file tail peak 6914, speech runs to the file end), **L09|L10 0.01 s**, **L11|L12 0.01 s**, L12|L13 0.07 s. The other cuts sit in 0.13-0.45 s silences (L01|L02 0.36, L02|L03 0.23, L08|L09 0.13, L10|L11 0.23, L13|L14 0.40). Peak in the 30 ms either side of the six tight cuts is 190-6914, so no cut lands inside a loud syllable by the envelope, but **a listen at the six tight joins is still needed**; atempo does not change the join positions' character, only stretches them 5 %.
- Not heard by ear. Loudness per line is the read's -16 LUFS family; level matching belongs to the mix.

## Files

Public: `public/narration/EDU-EP32-SHORT-narration-v1.wav` is now the x1.00 mix (identical bytes to `out/ep32-voice/x1.0/preview.wav` and r1's `alt_x1.00_EDU-EP32-SHORT-narration.wav`). The x1.05 version is not in public/; it is kept in the store.
Store (`projects/edu/EDU/narration/ep32-voice-r2/`, filed with `store.py put` one by one): `EDU-EP32-SHORT-narration-v1_x1.00.wav`, `alt_x1.05_EDU-EP32-SHORT-narration.wav`, `timing.json`, `check.log`, `voice-measure-r2.json`. `archive --path --kind narration/ep32-voice-r2` honoured the subfolder but skipped both wavs and the json as already stored (it dedupes by hash across the project, and archives media only), so `put` was used. r1 raw take, lines and AGENT candidates stay in `narration/ep32-voice-r1/` and `samples/ep32/agent/`.
Reproduce: `.venv-whisper/bin/python -I scripts/edu-series/ep32/short/voice-lock-build.py 1.0`, `python3 -I scripts/edu-series/ep32/short/voice-measure.py out/ep32-voice/x1.0 scripts/edu-series/ep32/short/voice-measure-r2.json`, `.venv-whisper/bin/python -I .../voice-check.py out/ep32-voice/x1.0`.

## Open items

1. `store.py use --episode edu-ep32` waits for `src/videos/edu-ep32` (W5); the narration is in `public/` and the store but not in `assets.lock.json`.
2. Listen at the six tight joins and at the L12 pause (0.28 s is short of a full beat before "ใช้งานจริงไม่ได้"; widening it re-opens the lock).
3. L01 "ซีไอเอ" is spoken as the Thai reading; the subtitle keeps "CIA".
4. Timeline frames from r1 (storyboard, cue sheet, Film's event timing if derived from r1) are 0 to 64 f earlier than r2 and need re-timing against r2.
