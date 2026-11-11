# KSO-EP01-SHORT voice lock v5 (1 Nov 2026)

Script revision unchanged (KSO-SCRIPT-R3). Measure file: [voice-measure.json](../voice-measure.json) (revision v5).
Proxy QA only: nobody listened. The user's ear decides. v4 stays in the store as the A/B baseline.

## Verdict and line

- User, after listening to v4 (+1.5 st, `โทษ` vowel about 195 Hz): not sharp at all; wants a bit more pitch on `โทษ`, to compare against v4.
- Line: same as v4. NARR (Erinome), S03-B02 `ขอโทษนะ… ที่เล่าให้ฟัง`, anchors KSO-A16 / KSO-A17, B06 clip. Changed track window 77.21–77.66 s (strong part 77.24–77.64 s, frames 2317–2329).

## Decision

- Shift `โทษ` by +3.0 st from v3 (+1.5 st more than v4). Ratio 1.18921. Same method, same span (14.42–14.74 s clip), same crossfades (14.36–14.42 s in, 14.74–14.79 s out), length-preserving: track 2461 frames, 82.033 s, slots and anchors unchanged.
- No back-off needed. At +3.0 st: no clipping (peak −1.5 dBFS, as v3 and v4), no splice step, no timing drift, no narrow tone in 8–16 kHz. The fallback (+2.5 st, `--st 2.5`) was not run.
- One fix to the v4 script, needed for +3.0: `best_lag` assumed equal lengths. At +3.0 st the shifter returns 1052 samples (22 ms) less than the 45600-sample context, so the lag is estimated on a copy padded or cut to the context length. The shifted audio itself is used as before. v4 at +1.5 st happened to be equal.

## Measured (proxy)

| Measure | v3 | v4 | v5 |
| --- | --- | --- | --- |
| `โทษ` vowel median F0, clip 14.58–14.72 s | 178.1 Hz | 195.5 Hz | **211.0 Hz** |
| word median F0, clip 14.42–14.74 s | 180.1 Hz | 197.9 Hz | 212.4 Hz |
| Rising end: max F0, clip 14.58–14.74 s (search 70–450 Hz) | 227.5 Hz | 242.4 Hz | **269.7 Hz** (last 4 voiced frames 206, 212, 238, 270) |
| Largest F0 step between 10 ms voiced frames, word | 1.72 st | 2.44 st | 2.19 st |
| Timing residual vs v3, word / vowel end | 0 / 0 ms | 0 / 5 ms | 0 / 0 ms |
| Span RMS 14.42–14.74 s | −15.77 dBFS | −15.77 dBFS | −15.77 dBFS (span gain before match +0.03 dB; v4 −0.52 dB) |
| Track loudness, TP, LRA | −16.64 LUFS, −1.64 dBTP, 5.1 LU | same | same |
| B06 clip loudness, TP, LRA | −16.45 LUFS, −1.49 dBTP, 5.5 LU | −16.45 LUFS, −1.49 dBTP, 5.5 LU | −16.44 LUFS, −1.47 dBTP, 5.5 LU |
| Track length | 2461 frames, 82.033 s | same | same |
| Whisper letters ratio, B06 (no padding, v5-check) | 0.982 | 0.982 | 0.961 (see limits) |

Rising end: 269.7 Hz is the highest F0 in 14.58–14.74 s, below the 330 Hz limit. On the same search v3 reads 227.5 Hz, so v5 is ×1.19 of v3, as the +3.0 st ratio predicts. The v4 note's estimate of 281 Hz (×1.09 of 258 Hz) was not measured.

Splice (v5 against v3): ramp-in 14.36–14.42 s, residual −35.7 dBFS (v4 −34.6), largest output sample step 0.126 (source 0.185); ramp-out 14.74–14.79 s, residual −42.7 dBFS, largest output step 0.0071 (source 0.0066). Largest 5 ms envelope jump: 26.0 dB at ramp-in (source 30.6 dB), 13.7 dB at ramp-out (source 12.8 dB). No click or step found.

Changed audio: first changed sample 77.21 s; strong change 77.24–77.64 s; MP3 spill up to 79.16 s with at most 0.0058 (about −45 dBFS) after 77.72 s, the same spill as v4. The v4 note's "track 77.26–77.69 s, frames 2317–2330" was an estimate; this is the measured window.

Amplitude (repo JSON, 30 fps): 22 frames differ from v3 (2317–2369), largest 0.0501 peak-normalized (v4 0.1285). Against v4: 17 frames (2316–2333), largest 0.1373.

## Spectrum (new finding)

- The v3 source is band-limited near 13.5 kHz (word window: 12–14 kHz 7.6 dB, 14–16 kHz −26.5 dB). Shifting the formants moves that edge up: 14–16 kHz is −4.0 dB in v4 and +9.6 dB in v5. The 4–8 kHz band is unchanged (v3 37.1, v5 36.3 dB).
- No narrow tone: 8–16 kHz peak-to-median per 40 ms frame, median v3 29.3 dB, v4 25.5, v5 19.5 dB. The added top band is broadband, not a squeak.
- So the word may sound a little brighter or airier than the rest of the track. Listen for it. The fix, if heard, is a low-pass near 13.5 kHz on the shifted span. That is a method change and needs the user's go-ahead.

## Whisper proxy (not a pitch test)

- v5 letters ratio 0.961 (v3 0.982, v4 0.982 in the same run, no padding). The 0.961 is the ratio the v3 read already scores in `out/kso-ep01-short/voice-lock-r3/qa/asr-r3.json` (0.5 s silence padding; `หยุด` reads `อยู่` there too). The drop is one word before 14.2 s of the clip, where the PCM equals v3, so it is Whisper input sensitivity, not v5.
- Apology words keep their text: `ข อ โ ท ษ นะ` at 14.14–14.92 s (v5 boundaries 14.42/14.56/14.60/14.76 s).

## Method and cost

- `pitch-fix-v5.py` (copy of `pitch-fix-v4.py`): ffmpeg `asetrate` plus `atempo` on a 0.95 s context, envelope lag, span gain match, raised-cosine blend in the silent gaps. Source is the v3 clip, not v4. `--st` sets the shift for a back-off run.
- Formants move about +19 % with the pitch at +3.0 st (ratio 1.189). Same limit as the voice-tuning SHIFT(k) route; the larger shift makes it more noticeable.
- Loudness is unchanged: span gain before match +0.03 dB; track and clip LUFS equal v3 and v4 to 0.01 LU.

## Files

- Store (`$REELS_STORE` = `~/ReelsStore`):
  - `projects/legacy/KSO/audio/voice-lock-v5/final/KSO-EP01-SHORT_narration_voicelock-v5.mp3` (sha256 c25dc1b5…; this is the public lock).
  - `…/final/KSO-EP01-SHORT_narration_voicelock-v5.amplitude.json` (d7cdc003…).
  - `…/segments-v5/B06.wav` (01e02624…).
  - `…/qa/pitch-fix-v5.json`, `…/qa/v5-check.json`, `…/qa/v5-spectrum.json`, `…/qa/loudness-v5.jsonl`.
  - `…/measure/voice-measure-v4.json` (the v4 measure, base for this revision; sha 8867d45e…).
- v4, untouched: `projects/legacy/KSO/audio/voice-lock-v4/` (9 files, sha256 identical to the baseline taken before this run; `store.py verify`: 0 problems).
- Public lock: `public/narration/KSO-EP01-SHORT.mp3` = v5 (`store.py use --replace`, episode `kuchisake-onna`; `src/videos/kuchisake-onna/assets.lock.json` points to the v5 store path).
- Repo amplitude input: `scripts/kuchisake-onna/short/KSO-EP01-SHORT.amplitude.json` = v5 (copy of the store file, same sha). Composition and the timeline test read it.
- Measure: `scripts/kuchisake-onna/short/voice-measure.json` (revision v5; slots and beats equal v4).
- Draft clips, `out/KSO-EP01-SHORT-C/clips/`:
  - `S03-B02-SH01_draft.mp4` = v5 (sha 3eacc470…); `S03-B02-SH01_draft.full.mp4` = v5 (88c1eb3a…).
  - `S03-B02-SH01_draft_v4.mp4` = v4 (sha 23ae9545…, copy of the v4 render); `S03-B02-SH01_draft_v4.full.mp4` = v4 (23ba8d7f…), backed up as well.
- Logs: `out/kso-ep01-short/voice-lock-v5/logs/` (pitch, assemble, check, spectrum, loudness, clip audit), `out/logs/kso-v5-clip-S03-B02-SH01-draft.log`, `out/logs/kso-v5-tests.log`.

## Draft clip

- Command: `node scripts/storyboard-page/clips.mjs KSO-EP01-SHORT-C scripts/kuchisake-onna/short/review-rows.json --shots=S03-B02-SH01 --draft --gl=angle --timeout=180000`.
- `--timeout` is in milliseconds (clips.mjs passes it as `timeoutInMilliseconds`), so 180000 = 180 s, the same as the v4 render and the AGENTS rule for painted renders. The "flag units are seconds" note does not apply to this flag.
- Result: 3 of 3 segments rendered, 0 reused (the amplitude sits in the scene cache key), 36 s. `review-rows.json` rewritten by clips.mjs, content unchanged (sha a46d6593…).
- Format: 360×640, H.264 and AAC 48 kHz, 5.12 s; composition frames 2265–2417; shot 1.0–4.1 s.
- Audio check (`clip_audit`, 48 kHz mono): clip against the v5 track at 76.5–78.0 s, correlation 0.983 (against v4 0.517); word 77.24–77.64 s, 0.993 against v5 and 0.254 against v4. The v4 backup clip matches the v4 track at 0.983 / 0.994.
- Picture: not blank (mean luma 44.7, 27.9, 27.1 at 0.5, 2.5, 4.0 s). The picture differs slightly from the v4 clip in every frame (mean absolute 0.34 of 255, largest 0.65), including clip frames 0–29, before the amplitude change. So the mouth is not the only cause. Most likely Boss's `src/painted/kuchisake/` edits at 16:47–16:50, after the v4 render at 16:46 (not isolated). The picture is therefore not a clean A/B; the audio is.
- No visual judgment was made; this is a proxy render, not a sample.

## What to listen to

- Track 76.5–79.1 s: compare v4 (`projects/legacy/KSO/audio/voice-lock-v4/final/…v4.mp3`) and v5 at 77.21–77.66 s, `โทษ` in `ขอโทษนะ`.
- Sharper without a squeak at the end of `โทษ` (rising end 270 Hz), same narrator, and no extra brightness or sizzle on the word against the rest of the track.
- To go back to v4 for listening: `python3 -I scripts/store.py use projects/legacy/KSO/audio/voice-lock-v4/final/KSO-EP01-SHORT_narration_voicelock-v4.mp3 public/narration/KSO-EP01-SHORT.mp3 --episode kuchisake-onna --replace`, and copy `projects/legacy/KSO/audio/voice-lock-v4/final/KSO-EP01-SHORT_narration_voicelock-v4.amplitude.json` over `scripts/kuchisake-onna/short/KSO-EP01-SHORT.amplitude.json` (the picture and the timeline test read it).

## Open

- Ear check (user), as above.
- If the word sounds brighter: low-pass near 13.5 kHz on the shifted span (method change; ask first).
- Scene samples and the review page: not produced here. The coordinator rebuilds the review page; the S03-B02 mouth frames (2317–2369) changed with the amplitude.
- Scene cache: the amplitude is a picture input and sits in the scene cache key, so this change re-keyed every scene. Already recorded in v4-notes and build-notes (Boss finding), no new decision.
