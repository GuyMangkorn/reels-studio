# EDU-EP32-VOICE-R1 (voice lock for script R1)

Editor, 2026-11-21, for [EDU-EP32-SCRIPT-R1](script.md) (locked, SF02-SF05 applied). Status: **measured, user approval pending (W4.3)**. Not heard by ear: measures, Whisper and envelope checks only.

## Voices

- NARR: Gemini `Kore`, one continuous read of the 12 narrator lines, style "warm, friendly, smiling storyteller, speaking rapidly" (channel default, user 11 Nov 2026), ellipses as commas, "CIA" written "ซีไอเอ" and "ปี 1967" as "ปี พันเก้าร้อยหกสิบเจ็ด" in the TTS text, quote marks dropped; atempo **1.05** (the pace the projection and EP30/EP31 used; an x1.00 alt is filed, no API cost). Raw read 48.24 s, one API call. Text: `out/ep32-voice/narr.txt` (store `narration/ep32-voice-r1/narr.txt`).
- AGENT (L04, L07): Gemini `Algenib`, styles L04 "confident smug 1960s spy-movie field agent, clipped and quick, sure of himself", L07 "clipped radio report from the field, confidence cracking into flat tired defeat on the last words, speaking quickly". Not tempo-changed, leading and trailing silence trimmed at -45 dB. Chosen from three candidates (Algenib, Orus, Charon, same two lines) by fit to the script's slot lengths and the project's usual MAN voice, not by ear. The radio filter on L07 is Editor's mix, not baked in.
- Lines were cut from the read at energy gaps (Whisper alignment, [voice-lock-build.py](voice-lock-build.py)); pauses between lines were replaced by 0.2 s gaps, **0.8 s after L06** (the bridge shot needs about 18 f more than L06 plus its gap, Film), and a 1.6 s hold after L14 (delivery record, stamp insert B06-SH03 ends the clip).

## Per-line timing (seconds and 30 fps frames, timeline 0 = L01 file start)

"File" is the whole take on the timeline; speech on/off is the measured onset and end (10 ms peak envelope above 1500; frames = round(s x 30)). Internal pauses are 0.25 s or longer, timeline seconds and length.

| Line | Speaker | File | Speech on-off (s) | Frames | Dur | Internal pauses |
| --- | --- | --- | --- | --- | ---: | --- |
| L01 | NARR | 0.00-7.28 | 0.04-7.22 | 1-217 | 7.18 | 2.44 (0.28) |
| L02 | NARR | 7.48-10.16 | 7.57-10.11 | 227-303 | 2.54 | 8.07 (0.50) |
| L03 | NARR | 10.36-13.80 | 10.47-13.74 | 314-412 | 3.27 | none |
| L04 | AGENT | 14.00-15.69 | 14.00-15.49 | 420-465 | 1.49 | none |
| L05 | NARR | 15.89-18.19 | 16.22-18.14 | 487-544 | 1.92 | 16.60 (0.30) |
| L06 | NARR | 18.39-20.19 | 18.66-20.19 | 560-606 | 1.53 | none |
| L07 | AGENT | 20.99-23.79 | 20.99-23.79 | 630-714 | 2.80 | 22.04 (0.35) |
| L08 | NARR | 23.99-28.01 | 24.02-27.93 | 721-838 | 3.91 | none |
| L09 | NARR | 28.21-34.11 | 28.50-34.08 | 855-1022 | 5.58 | 30.43 (0.25), 31.81 (0.30) |
| L10 | NARR | 34.31-36.14 | 34.68-36.06 | 1040-1082 | 1.38 | none |
| L11 | NARR | 36.34-42.39 | 36.37-42.33 | 1091-1270 | 5.96 | 37.67 (0.31) |
| L12 | NARR | 42.59-45.08 | 43.05-44.68 | 1292-1340 | 1.63 | 43.63 (0.27) |
| L13 | NARR | 45.28-50.56 | 45.30-50.50 | 1359-1515 | 5.20 | 46.83 (0.28) |
| L14 | NARR | 50.76-52.58 | 50.78-52.42 | 1523-1573 | 1.64 | 51.07 (0.32) |

Speech ends at **52.42 s** (frame 1573); with the 1.6 s hold after the L14 file end the narration is **54.18 s (1625 f)**, `preview.wav` 54.178 s. Machine-readable: [voice-measure-r1.json](voice-measure-r1.json).

## Length against target and trim order

- Target 50-60 s: **54.18 s, inside it, no trim needed.** The script estimate was about 59.2 s with a 2.0 s hold (speech end 57.2 s): the read is 4.8 s shorter in speech (actual narrator rate about 4.9 syllables/s on speech, line-to-line pauses trimmed), so the projection at the EP30 all-in rate ran 9 % long. Uniform 0.2 s gaps instead of 0.8 s after L06 give 53.58 s.
- Film's trim order (L10, then the hold) is unused. L06 is untouched (1.53 s speech, file 1.80 s) and its gap is 0.8 s so the bridge fits.
- The x1.00 alt (no atempo) is 56.31 s (speech end 54.54 s), also inside the target.

## Checks

- Whisper (large-v3-turbo) on every line file, 0.5 s padded: each line reads its script words (Thai ASR spelling noise only: "CAA" for CIA, "ที่หูแมว" as "ที่หูแมว", L07 "ตากแดดแล้วครับ" intact). Log `out/ep32-voice/check.log`, script [voice-check.py](voice-check.py).
- Cuts: narrator joins L03|L05, L05|L06, L06|L08, L09|L10, L11|L12, L12|L13 sit in silent runs of only 0.01-0.07 s (the read has almost no pause there); ASR reads the first and last word of each line, but **a listen at those six joins is needed** for a clipped consonant. Other cuts sit in 0.13-0.40 s silences.
- Not measured by ear; loudness per line is the read's -16 LUFS family, level matching belongs to the mix.

## Files

Public: `public/narration/EDU-EP32-SHORT-narration-v1.wav` (48 kHz mono, copy of preview.wav). Store: `projects/edu/EDU/narration/ep32-voice-r1/` (narration v1, x1.00 alt, narr_raw.wav, narr.txt, lines.json, timing.json, voice-measure-r1.json), AGENT candidates `projects/edu/EDU/samples/ep32/agent/`; `archive --path` also filed the working folder flat under `projects/edu/EDU/narration/` (preview.wav, narr_raw.wav, lines/, cand/, send/, x1.0/). Reproduce: `zsh -ic 'zsh scripts/edu-series/ep32/short/voice-w4-gen.sh cand'` (6 calls), `... narr` (1 call), copy the Algenib takes to `out/ep32-voice/L04.wav` and `L07.wav`, `.venv-whisper/bin/python -I voice-lock-build.py 1.05`, `python3 -I voice-measure.py out/ep32-voice voice-measure-r1.json`.

## Requests used

7 Gemini TTS requests on 21 Nov 2026 (6 AGENT candidate lines, 1 Kore read); no retries, no regenerations. Tier 1 limit 100 per day.

## Open items

1. Lock pending: `store.py use --episode edu-ep32` fails ("no episode folder: src/videos/edu-ep32"); the narration is in `public/narration/` and the store but not yet in `assets.lock.json`. Run once the W5 composition folder exists.
2. L12 pause is 0.27 s; the sound plan wants a full beat of silence before "ใช้งานจริงไม่ได้". Editor can widen that gap at W5 only by re-opening the lock (the pause is inside one take).
3. L01 "ซีไอเอ" is spoken as the Thai reading; the subtitle keeps "CIA".
