# EDU-EP04-SHORT voice measure (W1.4, provisional)

- Script EDU-EP04-SCRIPT-R1.1 (wording unchanged; `…` became `,` in the TTS text only). Voice: Gemini TTS **Charon**, provisional (the user picks the real voice at W4). Style: "dry, knowing, deadpan male narrator, matter-of-fact with a hint of amusement, natural brisk pace, short natural pauses between lines, same narrator throughout, do not speed up". Tempo 1.00x (no atempo applied). **1 Gemini request**, one read of all 25 lines (NAR, MAN and CSH all in the one voice).
- File: `out/edu04/narration/ep04-raw-charon.wav`; store `projects/EDU/narration/ep04/2026-11-05_ep04-raw-charon-provisional.wav`. Lines text: `out/edu04/narration/lines.txt`.
- As read: **78.88 s** (speech ends 78.64 s). Speech without pauses: ~50.5 s. The model left 48 gaps (0.15-1.2 s) totalling ~27.9 s.
- Assumption: EP01 gap convention (0.28 s per gap, 48 gaps) gives **~64.0 s** at 1.00x, **~60.9 s** at atempo 1.05; plus ~1.5 s silent gag and ~2.5 s end hold the video is ~68 s (~65 s at 1.05).
- Loudness: -16.5 LUFS integrated, LRA 3.3.
- Per-line seconds not measured (single read, no alignment at this step).
- Length check (40-60 s): **fail** at 1.00x as read and with 0.28 s gaps. Borderline fail even at 1.05 with the hold.

## R1.2 measure (W1.4 re-do, provisional)

- Script EDU-EP04-SCRIPT-R1.2 (wording unchanged; 20 spoken lines = R1.1 minus cut L06, L08, L13, L18, L20; `…` became `,` in the TTS text only). Same voice (Charon), model, style, 1.00x. **1 Gemini request**, one read of all lines. Text `out/edu04/narration/lines-r12.txt`.
- Files: `out/edu04/narration/ep04-r12-charon.wav` (raw read, 52.88 s); store `projects/EDU/narration/ep04/2026-11-05_ep04-r12-charon-raw-provisional.wav`, re-gapped `projects/EDU/narration/ep04/2026-11-05_ep04-r12-charon-regap028-provisional.wav`.
- Speech without pauses **36.4 s**; with 0.28 s gaps (30) **44.8 s** at 1.00x, **42.6 s** at atempo 1.05. Plus ~1.5 s silent gag and ~2.5 s end hold: video **~48.8 s** at 1.00x, **~46.6 s** at 1.05.
- Threshold note: the silence filter here (-35 dB, 0.18 s) gives R1.1 as 62.4 s regap versus 64.0 s earlier, so against the R1.1 figures R1.2 is up to ~1.6 s higher (~50.4 s video).
- Loudness: -16.9 LUFS integrated, LRA 3.0 (-16.9 / 2.4 after re-gap).
- Length check (40-60 s): **pass**; about 5 s under the ~55 s trim target.

## R1.2 Kore narrator (W4, user-chosen voice)

- Script EDU-EP04-SCRIPT-R1.2, wording unchanged; the 16 NAR lines only (MAN L03/L05/L23a and CSH L04 are not in this read; `…` became `,` in the TTS text only). Text `out/edu04/narration/lines-r12-nar.txt`.
- Voice: Gemini TTS **Kore** (EP02 narrator), model gemini-3.8-flash-tts, EP02 style prompt unchanged: "fast-paced, quick brisk delivery with short pauses between phrases, playful deadpan female narrator, dry and matter-of-fact, speaking quickly without dragging". No atempo (1.00x). User words: "เปลี่ยนเป็น Kore เสียงผู้หญิง EP02 style".
- **1 Gemini request** (one read of all 16 NAR lines).
- Raw read 44.56 s. Speech without pauses **37.87 s**; with 0.28 s gaps (21, every silence over 0.18 s at -35 dB, commas included as in the Charon measure) **43.75 s** at 1.00x. Plus ~1.5 s silent gag and ~2.5 s end hold: video **~47.75 s** at 1.00x.
- Loudness (re-gapped): -16.3 LUFS integrated, LRA 2.4. Not listened to: gap count not matched to line count, line order and wording unchecked by ear.
- Store: `projects/EDU/narration/ep04/2026-11-05_ep04-r12-kore-regap028.wav` (raw: `..._ep04-r12-kore-raw.wav`). Local: `out/edu04/narration/ep04-r12-kore-regap028.wav`.

## R1.2 Kore take 2 (crackle check, same prompt and settings)

- Why: the user heard crackling in the first Kore read; a new take with the same voice, EP02 style prompt and the same 16 NAR lines tests whether it was a one-off. **1 Gemini request** (`--fresh`, text and style copied from the first take's JSON).
- Raw 41.80 s; speech without pauses **39.76 s**; with 0.28 s gaps (8 silences over 0.18 s at -35 dB) **42.00 s** at 1.00x; video **~46.0 s** at 1.00x (+1.5 s gag, +2.5 s hold). Take 1 for comparison: 37.87 s speech, 43.75 s, ~47.75 s.
- Artifact check (stdlib python, mono 48 kHz; clipped = |x| >= 32700; jump = sample step > 8000):

| File | Peak | Clipped | Jumps | Jumps/s |
| --- | --- | --- | --- | --- |
| take 1 raw | 27578 | 0 | 247 | 5.5 |
| take 1 regap | 27578 | 0 | 247 | 5.6 |
| take 2 raw | 27572 | 0 | 2425 | 58.0 |
| take 2 regap | 27572 | 0 | 2425 | 57.7 |

- Reading: no clipping in either. Take 2 has about 10x the large sample jumps per second, so the roughness is a property of the generation (varies per take), not of the re-gap. A high count may be bright fricatives/energetic delivery rather than crackle; not listened to, unverified by ear.
- Store: `projects/EDU/narration/ep04/2026-11-05_ep04-r12-kore-take2-raw.wav`, `..._kore-take2-regap028.wav` (sidecars `.sidecar.json`). Local: `out/edu04/narration/ep04-r12-kore-take2-*.wav`. Earlier takes untouched.

## R1.3 Kore read (W4, same prompt and settings)

- Script EDU-EP04-SCRIPT-R1.3, wording unchanged; the 17 NAR lines (L10a and L20 new; MAN/CSH left for Film's W4 voices Algenib and Charon). `…` became `,` in the TTS text only. Text `out/edu04/narration/lines-r13-nar.txt`. EP02 style prompt unchanged. User words: "ตัดให้จบในตัว ไม่ loop, เพิ่มลดได้, gen Kore ใหม่".
- **1 Gemini request** (`--fresh`).
- Raw 45.72 s; speech without pauses **40.80 s**; re-gapped with 0.28 s silences (13 interior silences over 0.18 s at -35 dB) speech + gaps **44.44 s** (file 44.96 s with edge silences) at 1.00x; video **~48.4 s** at 1.00x (+1.5 s gag, +2.5 s hold; MAN/CSH lines not included, ~4.5 s more with their gaps, see N1).
- Loudness -16.2 LUFS (LRA 2.3). Peak 27573, clipped 0.

| File | Peak | Clipped | Jumps | Jumps/s |
| --- | --- | --- | --- | --- |
| R1.3 raw | 27573 | 0 | 3083 | 67.4 |
| R1.3 regap | 27573 | 0 | 3083 | 68.6 |

- Compare: take 1 5.5/s, take 2 58/s; this read is higher than both. Not listened to; crackle unverified by ear.
- Store: `projects/EDU/narration/ep04/2026-11-05_ep04-r13-kore-raw.wav`, `..._kore-regap028.wav` (sidecars `.sidecar.json`). Local: `out/edu04/narration/ep04-r13-kore-*.wav`.

## R1.3 Kore take 3 (same EP02 style prompt, new read)

- Why: user words "ขอ kore ใหม่อีกครั้ง prompt style เดียวกับ ep2". Script EDU-EP04-SCRIPT-R1.3, same 17 NAR lines (`out/edu04/narration/lines-r13-nar.txt`, identical to take 1's text). Voice Kore, gemini-3.8-flash-tts, 1.00x. Style string copied from `projects/EDU/narration/ep02/2026-11-05_ep02-raw-kore-fast.json`; it is byte-identical to the style in the R1.2 take 1, R1.2 take 2 and R1.3 take 1 sidecars. **1 Gemini request** (`--fresh`).
- Raw 49.36 s. Re-gap (0.28 s, every interior silence over 0.18 s at -35 dB): 29 interior silences (take 1 had 13), file 47.00 s. Speech without pauses **38.62 s** (take 1: 40.80 s); speech + gaps **46.74 s** (take 1: 44.44 s) at 1.00x; video **~50.7 s** (+1.5 s gag, +2.5 s hold; MAN/CSH not included, see N1) against take 1 ~48.4 s.
- Loudness -16.2 LUFS (LRA 2.2); take 1 -16.2 (LRA 2.3). Peak 27578 (take 1 27573). Clipped 0 in both.

| File | Peak | Clipped | Jumps | Jumps/s |
| --- | --- | --- | --- | --- |
| take 3 raw | 27578 | 0 | 2024 | 41.0 |
| take 3 regap | 27578 | 0 | 2024 | 43.1 |
| take 1 raw | 27573 | 0 | 3083 | 67.4 |
| take 1 regap | 27573 | 0 | 3083 | 68.6 |

- Reading: lower jump rate than R1.3 take 1 but far above R1.2 take 1 (5.6/s); more pauses, so a different pacing. Not listened to; crackle and wording unverified by ear.
- Store: `projects/EDU/narration/ep04/2026-11-05_ep04-r13-kore-take3-raw.wav`, `..._kore-take3-regap028.wav` (sidecars `.json`). Local: `out/edu04/narration/ep04-r13-kore-take3-*.wav`. Earlier takes untouched.
