# EDU-EP31-VOICE-R1 (voice lock measure)

Editor, 2026-11-21, for script [EDU-EP31-SCRIPT-R2](script.md) (user-confirmed; not edited). Status: **measured, user approval pending (W4.3)**. Timing status of the script's projection becomes `audio-measured` only after W4.3 and Film's timed sheets. Not a cut: no script trim was needed.

## Voice settings (W4.1)

- **NARR: Gemini `Kore`, one continuous read**, style "warm, friendly, smiling storyteller, speaking rapidly" (edu channel default, [channel voice](../../../../channels/edu/channel.md#voice); no second style tried). Ellipses written as commas in the TTS text only, years spoken ("ปี พันเก้าร้อยเก้าสิบห้า"), no `<short pause>` tags. **atempo 1.05**, the pace EDU-EP30 locked and the one the script projection assumed; the user confirms the pace at W4.3 (1.00 would run about 62.3 s by calculation, still inside 63 s, not rendered). Memory `narrator-pace-plus5` and `voice-achernar-narrator` do not apply to the edu channel (channel file and `gemini-style-pace-word` govern).
- Why a full read without a new audition: the voice and style are the channel default already picked by the user (11 Nov 2026) and EP30 used them; the pace is an ffmpeg atempo on the same read, so the pace pick costs no call ([sample-before-full-read](../../../../docs/delivery-workflow.md#sample-before-full-read): setting already user-picked, only the text is new). The user still approves the voice at W4.3.
- Characters (Editor's pick, script note; one take each, no tempo change): **ANCHOR L11 `Charon`** "brisk, serious 1990s local TV news anchor, clear and even"; **POLICE L13 `Alnilam`** "flat, matter-of-fact police officer asking a question, calm and quiet, speaking normally" (text with a question mark; take 2); **WHEELER L14 `Algenib`** (the usual MAN voice) "flat and sincere, a little confused, speaking at a normal pace". These three voices are new to the user for this episode: W4.3 listens to them too.
- Pauses and trims (memory `narration-trim-pauses`): cuts at real energy gaps of the take; isolated breaths and -30 dB tails removed (0.12 s kept after the last audible block, 0.08 s before the first); the only long pause inside a line (L08, "หามุมก่อน…", 0.93 s) is shortened to 0.45 s; the other pauses inside lines are already 0.15-0.45 s and stay (L06, L15 punchline pauses untouched). Gaps between lines 0.2 s (14), hold 2.0 s after L15. Loudness of the preview −15.9 LUFS integrated (narrator lines −14.4 to −18.4 LUFS per line, peaks ≤ −1.5 dBFS); the final mix levels are the cue sheet's, not this file's.

## Per-line timing (seconds and 30 fps frames, timeline 0 = L01 file start)

"File" is the whole take on the timeline; "Speech" is the measured on/off (10 ms envelope above 1500; frames = round(s × 30)); per-line anchors, pauses and syllable onsets: [voice-anchors-R1.txt](voice-anchors-R1.txt) and [voice-timing.json](voice-timing.json).

| Line | Speaker | File | Speech on-off (s) | Speech frames | Dur |
| --- | --- | --- | --- | --- | ---: |
| L01 | NARR | 0.00-7.67 | 0.01-7.53 | 0-226 | 7.67 |
| L02 | NARR | 7.87-10.88 | 7.88-10.85 | 236-326 | 3.02 |
| L03 | NARR | 11.08-16.55 | 11.18-16.40 | 335-492 | 5.47 |
| L04 | NARR | 16.75-19.85 | 16.86-19.80 | 506-594 | 3.10 |
| L05 | NARR | 20.05-24.50 | 20.15-24.45 | 605-734 | 4.45 |
| L06 | NARR | 24.70-26.75 | 24.75-26.68 | 743-800 | 2.05 |
| L07 | NARR | 26.95-29.90 | 27.00-29.84 | 810-895 | 2.95 |
| L08 | NARR | 30.10-34.10 | 30.11-34.05 | 903-1022 | 4.00 |
| L09 | NARR | 34.30-38.25 | 34.31-38.16 | 1029-1145 | 3.95 |
| L10 | NARR | 38.45-41.22 | 38.48-41.07 | 1154-1232 | 2.77 |
| L11 | ANCHOR | 41.42-43.38 | 41.42-43.38 | 1243-1301 | 1.96 |
| L12 | NARR | 43.58-45.71 | 43.59-45.56 | 1308-1367 | 2.12 |
| L13 | POLICE | 45.91-47.09 | 45.91-47.09 | 1377-1413 | 1.18 |
| L14 | WHEELER | 47.29-50.53 | 47.29-50.53 | 1419-1516 | 3.24 |
| L15 | NARR | 50.73-57.82 | 50.76-57.77 | 1523-1733 | 7.09 |

Speech ends at **57.77 s** (frame 1733); with the 2.0 s hold the short is **59.82 s** (1795 frames), 3.2 s under the 63 s limit, inside the 50-60 s target, and 2.8 s under the script's 62.6 s projection (which used EP30's all-in rate; this read plus the trims is faster). Narrator speech 48.64 s for 219 syllables = 4.50 syllables/s with its internal pauses (EP30 VOICE-R2 used for the projection: 4.41 all-in). The raw read is 56.2 s (one API call). **No script trim applied** (L07 and L14's second sentence stay, as scripted). The L06 and L15 pauses were left as read: the closing "ไม่ได้รู้จริงเลย" starts 0.29 s after the "เรื่องนั้น" pause (L15 pause 56.61-56.90 s), a short beat; Film's hold and Ton's music pull-back sit on that and on the 2.0 s hold (57.77-59.82 s).

## Checks done and not done

- Done: each line file transcribed by Whisper (large-v3-turbo, Thai) against its script text: all 15 lines end on the right words; ASR character noise is normal for Thai TTS and is not a pronunciation test. L13's first take read as "เนี่ คุณจะม่ะ" (ratio 0.5), so one second take was generated and used (it transcribes as "นี่คุณใช่ไหม"); the first take is kept in the store as `L13.wav`.
- Join review: L09 and L10 run together in the read (no silence between "เนี่ย" and "จน…"): cut at the quietest point (42.58 s of the raw take, 85/32767 after a -30 dB tail); needs a listen for a clipped "จ". All other cuts sit inside 0.15-0.8 s silences.
- **Not done: no ear listen** (an agent cannot hear); W4.3 is the user's listen. Possible weak points to hear first: L14 (WHEELER) starts with a 0.4 s dip after "แต่" and has a 0.4 s dip before the repeat; L13 is 1.18 s; the L09/L10 join.

## Files and reproduction

Store `projects/edu/EDU/narration/ep31-voice-r1-1/` (`preview.wav` combined, `lines/L01-L15.wav` per line, `narr_raw.wav` + `.json` the one Kore read, `L11/L13/L13_b/L14.wav` + `.json` the character takes (L13_b is the one used), `timing.json`, `anchors-R1.txt`, `narr.txt`). The first filing `ep31-voice-r1/` (store files are immutable) holds the earlier build of the same takes and is superseded. Local `out/ep31-voice/`. Text inputs in Git: [voice-narr-tts.txt](voice-narr-tts.txt), [voice-timing.json](voice-timing.json), [voice-anchors-R1.txt](voice-anchors-R1.txt). Reproduce: `zsh -ic 'zsh scripts/edu-series/ep31/short/voice-w4-chars.sh out/ep31-voice'` (4 character calls; the narration call is `scripts/gemini-tts.py say --voice Kore --style "<style>" --text-file out/ep31-voice/narr.txt out/ep31-voice/narr_raw.wav`; takes cache under `$REELS_STORE/cache/tts`, a repeat is free), then `python3 -I scripts/edu-series/ep31/short/voice-lock-build.py` (fixed cut points, no Whisper, no API) and `VO_DIR=out/ep31-voice python3 -I scripts/edu-series/ep31/short/vo-anchors.py`. API requests used by this lock: **8** (1 narration, L11, L13, L14, L13 take 2; plus 3 L01 candidates c1-c3 for the 2026-11-21 amendment below); `public/` narration is not placed or locked yet (after W4.3).

## Amendment 2026-11-21: L01 = candidate c1 (VOICE-R1.3)

The user listened to three re-reads of L01 (Kore, same style, one request each, text unchanged: [l01.txt](#), "มะนาว" the point of the re-read) and **chose c1, clearer "มะนาว"** (user pick, 2026-11-21). This is a user choice of one take, not a new voice approval: voice, style, pace (atempo 1.05) and L02-L15 are the locked R1.1 takes, byte for byte. Request count 5 to 8 (c1, c2, c3).

- **L01 paragraph (replaces the R1 L01 timing):** file 0.00-7.67 s (same length as before: c1 is 7.599 s, padded with 0.069 s of silence = the old 2-frame tail pad, 368083 samples), speech 0.01-7.53 (f0-226, unchanged on/off). Pauses inside L01 (s, frames): 1.38-1.52 (f41-46, new, after the year), 2.62-2.85 (f79-86), 4.39-4.63 (f132-139), 5.48-5.73 (f164-172); R1 had 2.19-2.49, 4.28-4.64, 5.65-5.92. Whisper reads "น้ำมะนาว" as มา-น-า-ว in c1 (R1 read มา-ต-า-ว). Full anchors: [voice-anchors-R2.txt](voice-anchors-R2.txt) (R1 file kept; only the L01 line differs), words: L01 line of [voice-words-R1.txt](voice-words-R1.txt) replaced.
- **Unchanged:** L02-L15 start frames, speech frames and the total, **59.82 s = 1795 frames** (rebuild with the old L01 is byte-identical to R1.1 `preview.wav`; with c1, samples from L02's start on are identical). Loudness: preview -16.0 LUFS integrated, LRA 3.1 LU, same as R1.1 (diff under 0.05 dB at one decimal; L01 alone -15.8 vs -15.7 LUFS). Join: L01 ends on a decaying tail to digital zero (last 10 ms blocks 296 to 0, no click), starts at 37/32767 peak in the first 10 ms; gap to L02 0.2 s plus the 0.35 s pause as before.
- **Not done:** no ear listen of the joined file by an agent; the user listened to c1 in context (`context_c1.wav`). Captions, scene sheets, cues, plates and the draft cut still follow R1 timing for L01 and are retimed in the next steps.
- **Files:** store `projects/edu/EDU/narration/ep31-voice-r1-3/` (`preview.wav`, `lines/L01.wav` ... `L15.wav`, `timing.json`, `anchors-R2.txt`, `words-L01.txt`), candidates in `ep31-voice-r1-2/`; `public/narration/EDU-EP31-SHORT-narration-v1.wav` now locked to `ep31-voice-r1-3/preview.wav`. Reproduce: `python3 -I scripts/edu-series/ep31/short/voice-lock-join-r1-3.py` ([voice-lock-join-r1-3.py](voice-lock-join-r1-3.py); `--check-r1` proves the rebuild), then `VO_DIR=out/ep31-voice-r1-3 python3 -I scripts/edu-series/ep31/short/vo-anchors.py`.
