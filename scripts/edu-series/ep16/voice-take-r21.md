# EDU-EP16/17/18 voice take R21 (Editor, 2026-11-13)

Scripts R2.1 (`ep16|17|18/script.md`, `locked-pending-user`). Narrator **Kore**, style "warm, friendly, smiling storyteller, speaking rapidly", one continuous read per episode (NAR lines only, `…` sent as `,`, lines joined by a space), then **atempo 1.05** (user pick, 13 Nov 2026: "kore 1.05 ได้ไหม", "ลองดูแบบเต็ม"). Full read after the sample pick ([rule](../../../docs/delivery-workflow.md#sample-before-full-read)). Not a user approval of this take; the user still listens.

## Duration vs estimate

| Episode | Narration read (raw) | x1.05 | NAR syll | Syll/s (with pauses) | Character clips (sum) | Speech total | Script estimate (full video) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EP16 | 35.08 s | **33.41 s** | 157 | 4.70 | 8.84 s (V01 2.08, V02 1.48, V03 1.08, V04 2.44, V05 1.76) | 42.25 s | 55.5 s (52–59) |
| EP17 | 33.68 s | **32.06 s** | n/a in script | n/a | 8.24 s (V01 1.80, V02 2.28, V03 1.80, V04 2.36) + L10 whisper alt 2.40 s | 40.30 s | 53.9 s |
| EP18 | 37.48 s | **35.70 s** | 147 | 4.01 | 5.60 s (V01 2.48, V02 3.12) | 41.30 s | 49.4 s (47–53) |

The estimates also hold hens, W-beats, holds (~2 s) and gaps for pictures, which a voice-only read does not have. Speech is 10–13 s under each estimate: the narrator is faster than the estimate assumed. Film should retime from these numbers; with W-beats, ~2 s hold and inter-beat gaps the episodes land about 46–52 s, inside the 40–60 s target. Nothing runs long.

## Line timing (seconds in the x1.05 narration WAV; Whisper words plus silence gaps, about ±0.15 s; not a cut list, run `scripts/narration/cut-gaps.py` before cutting)

### EP16 (`ep16_narration_kore_x1.05.wav`, 33.41 s)

| Line | Start | End | Dur |
| --- | --- | --- | --- |
| L01 | 0.23 | 2.89 | 2.66 |
| L02 | 3.28 | 6.64 | 3.36 |
| L03 | 7.10 | 9.70 | 2.60 |
| L04 | 9.83 | 11.84 | 2.01 |
| L05 | 12.05 | 15.86 | 3.81 |
| L06 | 16.33 | 17.97 | 1.64 |
| L07 | 18.53 | 21.91 | 3.38 |
| L08 | 22.25 | 23.66 | 1.41 |
| L09 | 24.24 | 28.29 | 4.05 |
| L10 | 28.66 | 31.53 | 2.87 |
| L11 | 31.78 | 33.41 | 1.63 |

### EP17 (`ep17_narration_kore_x1.05.wav`, 32.06 s)

| Line | Start | End | Dur |
| --- | --- | --- | --- |
| L01 | 0.17 | 2.88 | 2.71 |
| L02 | 2.98 | 6.75 | 3.77 |
| L03 | 6.86 | 11.8 | 4.9 |
| L04 | 11.86 | 13.3 | 1.4 |
| L05 | 13.32 | 18.28 | 4.96 |
| L06 | 18.66 | 22.12 | 3.46 |
| L07 | 22.37 | 24.5 | 2.1 |
| L08 | 24.64 | 28.28 | 3.64 |
| L09 | 28.56 | 30.7 | 2.1 |
| L10 (normal-voice, in the read) | 30.9 | 31.8 | 0.9 |

L10 whisper alternative: `chars/ep17_L10_whisper_kore.wav`, 2.40 s (Kore, style "warm, friendly storyteller, a hushed secretive whisper, slow, same narrator"), per script N2 and the ending. Script says L10 is "…ยกเว้นเรื่องนี้" (the leading "…" is the held silence after L09).

### EP18 (`ep18_narration_kore_x1.05.wav`, 35.70 s)

| Line | Start | End | Dur |
| --- | --- | --- | --- |
| L01 | 0.27 | 3.60 | 3.33 |
| L02 | 3.75 | 6.85 | 3.10 |
| L03 | 7.84 | 11.33 | 3.49 |
| L04 | 11.56 | 16.05 | 4.49 |
| L05 | 16.51 | 18.82 | 2.31 |
| L06 | 19.0 | 21.98 | 2.98 |
| L07 | 22.69 | 26.80 | 4.11 |
| L08 | 26.90 | 27.86 | 0.96 |
| L08b | 28.26 | 31.04 | 2.78 |
| L09 | 31.37 | 35.41 | 4.04 |

EP18 OQ4 (ER09, limit about 10 s): recipe and sip (L07 start to L08 end) = 5.17 s; with W-KITCHEN 1.2 s before = 6.4 s. With the spoken safety line to L09's onset: 22.69 to 31.37 = 8.68 s, plus W-KITCHEN 1.2 s = **9.9 s**, right at the limit and with zero slack for the hold after L08b. Not over, but any gap Film adds between L08, L08b and L09 (script plans 0.5 s each) breaks 10 s. Suggest Film either shortens the W-KITCHEN to the speech (L07 starts at the kitchen cut) or counts L08b as outside the OQ4 answer (it is not part of the recipe); Film/Preaw decide.

## Character clips (each one API call, Gemini TTS; `chars/`)

| Character | Voice | Lines |
| --- | --- | --- |
| เก่ง (BOY, Preaw suggestion) | Leda (prebuilt, "Youthful"; adult voice, a child voice design is refused by the API, so this is the youngest prebuilt) | EP16 V01 V02 V04 V05; EP17 V01 V02 V03; EP18 V02 |
| ยาย (GRANDMA, Preaw suggestion) | Gacrux (prebuilt, "Mature"; no designed elderly voice, to stay one call per line) | EP16 V03; EP17 V04; EP18 V01 |

Styles per line follow each script's N2 (unimpressed V01, stubborn V02, stung V03, tired wry V04, anxious V01, weak whisper V02). HEN clucks (EP16 V06, EP18 V03) are designed sounds for Ton, not voiced. EP18 L08b stays in the narrator read (one narrator, no style change, so the "step out of story" quality comes from the words and Film's picture). Character takes are not user-approved; the gemini-tts skill says each new character voice is played to the user first.

## Checks

- Whisper large-v3-turbo (local, `out/whisper-venv`; not a project requirement) found every line in order in all three reads; the segment count matches the line count. Thai Whisper output is noisy on all three reads (hallucinated words at the L01 "ไดโนเสาร์", fully garbled on EP17 L04), so it proves line presence and order, not pronunciation. The hallucinations are on the same words in each episode, so they look like Whisper's weakness on the word, not a TTS fault; Ton/Film cannot settle that without listening.
- EP18 L07 recognised as "น้ำต้มสุก 1 ลิตร น้ำตาล 6 ช้อนชาปาด เกลือครึ่งช้อนชาปาด": both numbers and both "ปาด" present. EP18 L08b and L09 present.
- Silence analysis: each line starts after a gap of at least 0.1 s; no read starts or ends with a clipped run (leading silence 0.17–0.27 s). Not done: word-level clip detection.
- **Listen first (user or Editor ear):** EP16 V03 "อย่า!" (Whisper heard "เจ้า" in two takes: `chars/ep16_V03_grandma.wav` and `retake/ep16_V03_grandma_t2.wav`, 1.08/1.16 s), EP17 V03 "โอ๊ย! ยุง!" (heard "อ้อย ยอม"/"อ้อย ยอง"), EP18 V02 "ยาย… หิวน้ำ" (heard "หิวนอม"/"หิวนาม"), EP16 V01 ("มะม่วง" heard "มมวัง"). These are 1–3 s lines where Whisper is weakest; a mispronounced take means a re-take, not a script change. Second takes (`retake/*_t2.wav`) are alternates.
- No wording or retime issue found in the scripts. L08b is 2.78 s (script N1 estimates about 3.2 s), L07 numbers are distinct with short gaps (0.1 s between L07 and L08; widen in the edit if Film wants air).

## Files

- Work folder (ignored): `out/voice/ep16-18-r21/` (`raw/`, `chars/`, `retake/`, text inputs `ep16.txt ep17.txt ep18.txt`, tools `wh.py wh2.py runs.py`, `whisper.json` with word times).
- Clean copies: `out/voice/ep16-18-r21/send/` (3 narration WAVs, 12 character takes, 3 alternates).
- Asset store (kind=voice, project EDU): `~/ReelsStore/projects/edu/EDU/voice/` (`ep1{6,7,8}_narration_kore_x1.05.wav`, `chars/`, `retake/`, `raw/ep1{6,7,8}_nar_raw.wav`; the store flattens the folder, `send/` copies are the same files).
- Reproduce: `out/gemini-venv/bin/python -I scripts/gemini-tts.py say --voice Kore --style "warm, friendly, smiling storyteller, speaking rapidly" --text-file out/voice/ep16-18-r21/ep16.txt raw.wav` then `ffmpeg -af atempo=1.05`. Repeat calls hit the TTS cache. API calls used: 3 narration, 11 character, 1 whisper L10, 3 retakes = 18 (no 429, no retries).
