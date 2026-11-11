# KSO-EP01-SHORT voice lock v4 (1 Nov 2026)

Script revision unchanged (KSO-SCRIPT-R3). Measure file: [voice-measure.json](../voice-measure.json) (revision v4).
Proxy QA only: nobody listened. The user's ear decides.

## Verdict and line

- User, on the Draft of S03-B02-SH01: the spoken `ขอโทษ` sounds odd; the pitch of `โทษ` should be higher, it reads too low.
- Line: NARR (Erinome), S03-B02 `ขอโทษนะ… ที่เล่าให้ฟัง`, anchors KSO-A16 / KSO-A17, in the B06 clip (track frames 2295–2373).
- WOMAN (Despina) has no `ขอโทษ` line; the script's only occurrence is the NARR line.

## Decision

- Fix: pitch +1.5 semitones on `โทษ` only, in the B06 clip. Length-preserving, so the pace, the slot, every anchor and frame of the 2461-frame lock stay as in v3.
- Not chosen as the lock: a regenerated tail take (Erinome, `ขอโทษนะ, ที่เล่าให้ฟัง`, three takes). Its `โทษ` is higher (204 Hz) and its ASR passes, but the whole tail is about 25 % faster (speech 1.8–2.0 s against 2.5 s in v3). Using it needs a time-fit, and the fit changes the performance. It stays in the store as an alternative.

## Measured (proxy)

| Measure | v3 | v4 |
| --- | --- | --- |
| `โทษ` vowel median F0, clip 14.58–14.72 s (10 voiced frames) | 178.1 Hz | 195.5 Hz |
| word span median F0, clip 14.42–14.74 s (12 voiced frames) | 180.1 Hz | 197.9 Hz |
| Span RMS, clip 14.42–14.74 s | −15.77 dBFS | −15.77 dBFS (gain-matched) |
| B06 clip loudness | −16.45 LUFS | −16.45 LUFS |
| Track loudness, TP, LRA | −16.64 LUFS, −1.64 dBTP, 5.1 LU | same |
| Track length | 2461 frames, 82.033 s | 2461 frames, 82.033 s |
| Whisper letters ratio, B06 clip | 0.982 | 0.982 (same words; `ขอโทษนะ` at 14.14–14.92 s) |

- Changed audio: clip 14.36–14.79 s (track 77.26–77.69 s, frames 2317–2330). Crossfades sit in the silent gaps at 14.38–14.44 s and 14.73–14.78 s.
- Amplitude JSON differs in 22 frames (2316–2369); the designed change is frames 2317–2329. Largest change 0.1285 on the peak-normalized scale.
- PCM outside the window matches v3 except MP3 re-encode noise (≤ 0.0002, below −70 dBFS) up to frame 2374.
- Alignment check: onsets of the `ท` release, vowel start and vowel end match v3 within about 2 ms.

## Method and cost

- `pitch-fix-v4.py`: ffmpeg `asetrate` plus `atempo` on a 0.95 s context, lag-aligned by envelope, gain-matched, raised-cosine blend.
- Formants move about +9 % with the pitch. This is the same limit as the voice-tuning SHIFT(k) route.
- The vowel's rising end (14.72 s, 258 Hz in v3) moves to about 281 Hz (estimate, not measured). Listen for a squeak at the end of `โทษ`.
- Rebuilt v3 from the v3 clips bit-exact (MP3 sha 9e6e7f5f…, amplitude identical). So v4 differs from v3 only in B06.

## Draft clip re-rendered

- Composition `KSO-EP01-SHORT-C`, shot `S03-B02-SH01` (beat S03-B02, frames 2295–2388). Clip `out/KSO-EP01-SHORT-C/clips/S03-B02-SH01_draft.mp4`: 360×640, H.264 and AAC 48 kHz, 5.12 s, composition frames 2265–2417 (1 s pad), shot in 1.0 s, out 4.1 s.
- Command: `node scripts/storyboard-page/clips.mjs KSO-EP01-SHORT-C scripts/kuchisake-onna/short/review-rows.json --shots=S03-B02-SH01 --draft --gl=angle --timeout=180000`. Log: `out/logs/kso-v4-clip-S03-B02-SH01-draft.log`.
- Repo at HEAD `4568c05` with Boss's uncommitted `src/painted/` changes present in the working tree at render time; the draft picture reflects that state. Scene cache: 3 of 3 segments rendered, 0 reused (amplitude re-key, see build-notes).
- Audio check: clip audio against the v4 track at 76.5–78.0 s, correlation 0.983 at 0 ms offset; against v3, 0.384. Whole clip 75.5–80.5 s: v4 0.978, v3 0.784.
- Picture check: mean luma 45 (0.5 s), 28 (2.5 s), 27 (4.0 s). Not blank. No visual judgment was made; v4 changes no picture.
- Not re-rendered: `S03-B01-SH05` (visible audio ends at 76.5 s) and `S03-B02-SH02` (starts at 79.6 s, after the changed window that ends at 77.69 s). The B variant has no draft clips in the review rows.

## Files

- Track: `projects/legacy/KSO/audio/voice-lock-v4/final/KSO-EP01-SHORT_narration_voicelock-v4.mp3` (sha256 64d8eb15…); amplitude JSON beside it.
- B06 v4 clip: `projects/legacy/KSO/audio/voice-lock-v4/segments-v4/B06.wav`.
- Alternative tail takes (not in the lock): `projects/legacy/KSO/audio/voice-lock-v4/takes/B06-tail_take{1,2,3}.wav`.
- QA: `projects/legacy/KSO/audio/voice-lock-v4/qa/pitch-fix-v4.json`, `qa/v4-check.json`; loudness in `out/kso-ep01-short/voice-lock-v4/qa/loudness-v4.jsonl`.
- v3 measure (base): `projects/legacy/KSO/audio/voice-lock-r3/voice-measure-v3.json`.
- Public narration lock: `public/narration/KSO-EP01-SHORT.mp3` is the v4 file (`store.py use`, episode `kuchisake-onna`). Both `KSO-EP01-SHORT-C` and `-B` import this one file.
- Repo amplitude input: `scripts/kuchisake-onna/short/KSO-EP01-SHORT.amplitude.json` (v4).

## What to listen to

- Track 76.5–79.1 s (the apology line). Compare v3 and v4 `โทษ` at 77.26–77.69 s.
- Whether `โทษ` now sounds high enough without a squeak at its end, and whether the word still sounds like the same narrator.
- If it still sounds odd: the alternative tail take, which needs a time-fit before use.

## Open (carried into the measure file)

- Length decision (82.03 s) from v3 is still open.
- Whether the apology needs a written pause: `เธอจะไปหาคนนั้น <whispering> ขอโทษนะ` has none.
- Scene cache: narration amplitude is a picture input and sits in the scene cache key, so any amplitude change re-keys every scene. Recorded as a finding for Boss.
