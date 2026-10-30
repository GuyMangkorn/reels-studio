# NYOS-EP01-SHORT build notes

Owner: Editor. Stage record for the production pipeline; generated media stays in ignored `out/`.

## Tools (TL)

| ID | Procedure (repeats seen) | Script / location | Status: episode / promoted (scripts/README.md) |
| --- | --- | --- | --- |
| TL01 | Voice-sample measurement (duration, lead/trail silence, speech span, LUFS/TP/LRA) and tempo change with the −16 LUFS pass. Seen in VS-R1 (measured, method not recorded) and VS-R2 | `scripts/lake-nyos/voice-sample-tools.py` (`measure`, `tempo`); reuses `normalize()` of `scripts/voice-preset.py` | episode |
| TL02 | VO-lock inputs from the script: per-beat VO, TTS text (`…` → `,` only), the one-read text, the timeline for alignment, and a check that every anchor phrase is in its beat's TTS text in order. Seen in VS-R1 (text checked inline) and VS-R3 | `scripts/lake-nyos/vo-lock-inputs.py` (writes `out/lake-nyos/vo/`; reads `short/script.md`) | episode |

## VS-R1 narrator voice sample (Gemini TTS, 3 candidates)

- **Date and status:** 2026-10-31. Sample for user choice before the [voice lock](../../docs/delivery-workflow.md#voice-lock). Status `voice-sample-generated`. Not approved, not the final read, no measure file, no `audio-measured` timing. Listening by the user is still required.
- **Script input:** `NYOS-SCRIPT-R1` (`short/script.md`, last changed in commit `df597cf`, 2026-10-30; no working-tree change at sampling). Beats `NYOS-EP01-SHORT-B00` and `B01`, VO text only, read verbatim. `script.md` not edited.
- **TTS text transform:** `…` → `,` only, per the [gemini-tts narration rule](../../.agents/skills/gemini-tts/SKILL.md#narration-one-narrator). Checked by script: the TTS text equals the script VO with that substitution and no other change.
  - Input file: `out/lake-nyos/voice-sample/tts-text.txt` (sha256 prefix `2651a4e00fb31b7c`, 133 characters).
  - Text: `ถ้าคืนนี้, อะไรบางอย่างขึ้นมาจากทะเลสาบหลังหมู่บ้านคุณ, คุณจะรู้ตัวไหม? คนราว 1,700 คน, ตายในคืนเดียว หลายคนหลับไปแล้ว, ไม่ตื่นอีกเลย`
- **Model and settings (same for all candidates):** `gemini-3.8-flash-tts`; one `say` call per voice (one read, one style); no inline tags; style `calm, respectful documentary narrator, measured and steady`.
- **Voices:** one prebuilt voice per file. Gender and pitch are from `voices --search` (confirmed).

| Candidate | Voice | Gender / pitch | Listing descriptor | Why this candidate |
| --- | --- | --- | --- | --- |
| VS-R1a | Kore | female / medium | Firm, direct, authoritative | Accent and emotion approved by ear on 2026-10-30 |
| VS-R1b | Charon | male / low | Informative, steady | Accent and emotion approved by ear on 2026-10-30 |
| VS-R1c | Sulafat | female / medium | Warm, inviting, comforting | Third option, softer register for a respectful tone (Editor's choice) |

- **Output:** 48 kHz mono 16-bit WAV, two-pass `loudnorm` to −16 LUFS (per `scripts/gemini-tts.py`). Each file has a `.json` sidecar with model, voice, style and the TTS text. Measured integrated loudness −17.0 / −16.6 / −16.1 LUFS, true peak −1.5 dBFS.
- **Reproduction:** `out/gemini-venv/bin/python -I scripts/gemini-tts.py say out/lake-nyos/voice-sample/voice-sample-<voice>.wav --voice <Voice> --style "calm, respectful documentary narrator, measured and steady" --text-file out/lake-nyos/voice-sample/tts-text.txt` (`<Voice>` = `Kore`, `Charon`, `Sulafat`). Venv: `google-genai` 2.34.0 in `out/gemini-venv`. Logs: `out/logs/voice-sample-<voice>.log`, `out/logs/gemini-venv-install.log`.
- **Quota:** 3 requests of the free-tier limit (10 a day for `gemini-3.8-flash-tts`) on 2026-10-31. Earlier use that day is unknown. All three calls exited 0 on the first attempt.

### Output files

| Voice | File | Duration | Start silence | Whisper check (large-v3-turbo, not proof) |
| --- | --- | --- | --- | --- |
| Kore | `out/lake-nyos/voice-sample/voice-sample-kore.wav` (+ `.json`) | 14.36 s | 0.31 s | All four segments present. Closest match to the script. |
| Charon | `out/lake-nyos/voice-sample/voice-sample-charon.wav` (+ `.json`) | 17.08 s | 0.32 s | All four segments present. "อะไรบังอย่าง" for "อะไรบางอย่าง" (ASR error or a mis-read; listen). |
| Sulafat | `out/lake-nyos/voice-sample/voice-sample-sulafat.wav` (+ `.json`) | 15.24 s | 0.26 s | All four segments present, but "คนเรา 1,700 คน" for "คนราว 1,700 คน". Listen to "ราว" (about) versus "เรา" (we/people). |

Transcripts: `out/transcripts/voice-sample-<voice>.{srt,json}`; logs `out/logs/transcribe-voice-sample-<voice>.log`. The Whisper check used the existing `.venv-whisper` of the main checkout.

### Findings

- **FIND-VS-01 Length over target.** The sample is 14.4–17.1 s, not the ~10 s asked. The script estimate for B00 + B01 is 9.1 s (4.5 + 4.6 s est.). Measured pace is 1.6–1.9× the estimate, with the same text and all three voices. The likely cause is the style `measured and steady`, which slows the read. This is not tested. A probe with an empty style or `calm documentary narrator` (reference table) would test it for one request. If the read stays this slow, the 50–80 s Short budget and the B-beat estimates need a retime after the voice lock.
- **FIND-VS-02 Listening points for the user.** (1) Sulafat "คนราว" versus "คนเรา". (2) Digits "1,700" read as Thai numerals; the script keeps digits per its convention. (3) The script's "…" pauses (0.3–0.6 s) are commas in the TTS text, so pause length depends on the voice.
- **FIND-VS-03 Not heard by Editor.** Editor cannot listen. Pronunciation, accent, emotion and tone are the user's call. The Whisper check only shows that the words are present.
- **FIND-VS-04 Terms and data tier (open, not verified).** The [gemini-tts skill](../../.agents/skills/gemini-tts/SKILL.md#limits-and-costs) says to use the paid tier for unreleased scripts. This script is unreleased. The tier of the `GEMINI_API_KEY` in this environment was not checked and cannot be read from the key. Commercial-use terms and SynthID watermarking are also unchecked. Check both before the first delivery that uses a Gemini voice.

### Next steps (not done)

- User listens to the three files and picks one (or asks for a re-run). The user approves the voice by ear, and approval is recorded per character voice.
- If the pace is kept: decide whether to re-run the candidates with a different style (3 requests per full set), then re-measure.
- Voice lock per [delivery-workflow](../../docs/delivery-workflow.md#voice-lock): final narration read, measure file, `audio-measured` in `delivery.md`. Not started. `delivery.md` was not edited.

## VS-R2 faster Sulafat voice samples (prompted pace and atempo 1.05)

- **Request and status:** 2026-10-31. The user picked Sulafat (VS-R1c) and asked for about 5% faster. Two comparison takes plus the VS-R1c baseline. Status `voice-sample-generated`. Not approved; the pick of Sulafat is not approval of the fast takes. Not the final read, no measure file, no `audio-measured` timing, voice lock still open. Editor cannot listen (FIND-VS-03 applies).
- **Text and model:** the same TTS text, `out/lake-nyos/voice-sample/tts-text.txt` (sha256 prefix `2651a4e00fb31b7c`, unchanged since VS-R1), `gemini-3.8-flash-tts`, voice `Sulafat`.
- **Method (a), prompted pace:** one Gemini `say` call. Only the pace phrase of the style changed, `measured and steady` → `brisk but calm pace, steady`; pace is set in the style per the [gemini-tts skill](../../.agents/skills/gemini-tts/SKILL.md#what-is-possible). Same two-pass `loudnorm` to −16 LUFS as `scripts/gemini-tts.py`. Exit 0 on the first attempt. Log `out/logs/voice-sample-sulafat-fast-prompt.log`.
- **Method (b), atempo:** `atempo=1.05` (pitch preserved) on the existing `voice-sample-sulafat.wav`, no API call, then the same two-pass `loudnorm` to −16 LUFS / −1.5 dBTP / LRA 11. 48 kHz mono 16-bit WAV. The sidecar keeps the VS-R1c fields and adds `derived_from`, `filter` and `factor`. Log `out/logs/voice-sample-sulafat-fast-atempo105.log`.
- **Target:** about 5% faster means a speech span of about 14.0 s from 14.73 s (file about 14.5 s).
- **Quota:** 1 request on 2026-10-31 (free tier, 10 a day for `gemini-3.8-flash-tts`). With VS-R1's 3, 4 are known; earlier use that day is unknown.

### Output files and measures

Files in `out/lake-nyos/voice-sample/` (each with `.json`). Measured by `scripts/lake-nyos/voice-sample-tools.py measure`:

| Take | File | Duration | Lead / trail silence | Speech span | Pace vs VS-R1c | LUFS / TP / LRA |
| --- | --- | --- | --- | --- | --- | --- |
| VS-R1c baseline | `voice-sample-sulafat.wav` | 15.24 s | 0.26 / 0.25 s | 14.73 s | 1.00× | −16.17 / −1.50 dBTP / 2.6 LU |
| (a) prompted pace | `voice-sample-sulafat-fast-prompt.wav` | 13.04 s | 0.33 / 0.28 s | 12.44 s | 1.18× (speech −15.5%) | −16.51 / −1.49 dBTP / 3.9 LU |
| (b) atempo 1.05 | `voice-sample-sulafat-fast-atempo105.wav` | 14.53 s | 0.25 / 0.25 s | 14.03 s | 1.05× (speech −4.8%) | −16.07 / −1.50 dBTP / 2.7 LU |

- Speech span = duration − lead − trail. Silence = silencedetect −35 dB, at least 0.15 s. LUFS, TP and LRA = `loudnorm` pass 1 on the final file, target −16 / −1.5 / 11.
- The baseline re-measures at −16.17 LUFS. VS-R1 listed −16.1 for its third candidate, consistent within 0.1 LU.

### Whisper check (large-v3-turbo, `th`, not proof)

| Take | "คนราว 1,700 คน" (about 1,700) | "อะไรบางอย่าง" | Transcript |
| --- | --- | --- | --- |
| VS-R1c baseline | not heard: "คนเรา 1,700 คน" | heard | VS-R1 transcript |
| (a) prompted | heard: "คนราว 1,700 คน" | not heard: "อะไรบัง…" ("อะไรบังอย่าง") | all four clauses present, with other spelling noise |
| (b) atempo | not heard: "คนเรา 1,700 คน" | heard | same text as the baseline |

- Transcripts: `out/transcripts/voice-sample-sulafat-fast-{prompt,atempo105}.{srt,json}`; logs `out/logs/transcribe-voice-sample-sulafat-fast-{prompt,atempo105}.log`.
- The "อะไรบัง" reading in (a) matches the mis-hear already seen for Charon in VS-R1. Whisper hears "คนราว" only in (a), and (b) is the same audio as the baseline. These are two hypotheses for the user to listen to, not verdicts.

### Findings

- **FIND-VS-05 Prompted pace overshoots the target.** `brisk but calm pace` gave a speech span 1.18× the baseline (−15.5%), not 1.05×. One take only. The pace phrase is coarse, so no further tuning was run (no extra requests). A milder phrase might land nearer 5% at one request per take; not tested. Changing one pace phrase moved the speech span by 15%, which supports FIND-VS-01's suspicion that `measured and steady` slows the read. It is one comparison, not proof.
- **FIND-VS-06 Atempo meets the 5% target.** Speech 1.05× and file 14.53 s. Pitch preservation is the atempo design; pitch was not measured. Loudness −16.07 LUFS, true peak −1.50 dBTP.
- **FIND-VS-07 Prompted take loudness.** −16.51 LUFS, 0.5 LU under the −16 target, true peak −1.49 dBTP. VS-R1 gave −16.1 to −17.0 LUFS with the same processing, so this is inside the spread already accepted for the candidates. Likely cause, not verified: the true-peak ceiling limits the gain.
- **FIND-VS-08 Length still over the brief's ≈10 s.** The open items in `short/film-brief.md` ask for a ≈10 s Gemini sample. Both fast takes are longer (13.0 s prompted, 14.5 s atempo). The 5% request does not reach 10 s. Any length target belongs to the user and Film; not changed here.
- **FIND-VS-09 Stale sample path in Film's brief.** `short/film-brief.md` points the voice samples at `scripts/lake-nyos/short/voice-sample*`. The samples live in the ignored `out/lake-nyos/voice-sample/`. Film owns the brief, so it is not edited here; Film should correct the path.
- **FIND-VS-04 is unchanged.** Terms, data tier and SynthID remain unchecked, and they apply to the two new takes too.
- **Listening points for the user (in addition to FIND-VS-02):** (1) "คนราว" in (a) versus "คนเรา" in the baseline and (b). (2) "อะไรบางอย่าง" in (a) versus "อะไรบัง" in the Whisper text. (3) Overall pace: (a) is the prompted pace, (b) is 5% of the same read.

### Reproduction (VS-R2)

```
out/gemini-venv/bin/python -I scripts/gemini-tts.py say out/lake-nyos/voice-sample/voice-sample-sulafat-fast-prompt.wav --voice Sulafat --style "calm, respectful documentary narrator, brisk but calm pace, steady" --text-file out/lake-nyos/voice-sample/tts-text.txt
python3 -I scripts/lake-nyos/voice-sample-tools.py tempo out/lake-nyos/voice-sample/voice-sample-sulafat.wav out/lake-nyos/voice-sample/voice-sample-sulafat-fast-atempo105.wav --factor 1.05
python3 -I scripts/lake-nyos/voice-sample-tools.py measure out/lake-nyos/voice-sample/voice-sample-sulafat.wav out/lake-nyos/voice-sample/voice-sample-sulafat-fast-prompt.wav out/lake-nyos/voice-sample/voice-sample-sulafat-fast-atempo105.wav
<main checkout>/.venv-whisper/bin/python -I scripts/transcribe.py out/lake-nyos/voice-sample/voice-sample-sulafat-fast-prompt.wav --model large-v3-turbo --language th
```

Repeat the transcribe line for `voice-sample-sulafat-fast-atempo105.wav`. The Whisper venv is the main checkout's `.venv-whisper`, as in VS-R1.

### Changes this round

- Created `scripts/lake-nyos/voice-sample-tools.py` (TL01). Its first `tempo` run imported `scripts/voice-preset.py`, which rewrote the tracked `scripts/__pycache__/voice-preset.cpython-312.pyc`. Restored with `git checkout` on that one file. The script now sets `sys.dont_write_bytecode`; a re-run of `tempo` into a scratch path is byte-identical to the atempo deliverable, and the tracked file stays unchanged.
- Moved `scripts/lake-nyos/short/build-notes.md` to `scripts/lake-nyos/build-notes.md`, the episode location in [AGENTS.md](../../AGENTS.md) and [contributing](../../docs/contributing.md#tools-and-document-improvements). Moved, not copied, so there is one record. Four relative links now use `../../`. A grep of `scripts/`, `docs/`, `AGENTS.md`, `.agents/`, `.claude/` and `.codex/` found no other reference to the old path.
- Generated under ignored `out/`: three WAV and JSON pairs, transcripts and logs.
- Not edited: `scripts/lake-nyos/delivery.md` and `scripts/lake-nyos/short/film-brief.md`. Both changed in the working tree during this run (around 01:25) by another session. Editor left them alone. The stage cell for the voice sample is not recorded in `delivery.md`; the coordinator records it after the user's pick.
- No commit.

### Next steps (not done)

- User listens to the baseline, (a) and (b), and picks the pace. Approval is recorded by the user per voice, not by Editor.
- If the prompted take is kept but ~5% is wanted, one milder-phrase take (one request) and a re-measure.
- Voice lock per [delivery-workflow](../../docs/delivery-workflow.md#voice-lock) is unchanged: final read, measure file, `audio-measured`. Not started.

## VS-R3 full narration read B00–B13 (Sulafat, prompted pace), voice-lock inputs

- **Request and status:** 2026-10-31. User rule: narrator Sulafat; pace = the prompted quicker style of VS-R2 take (a); if the full read is too short for the 50–80 s budget, fall back to the slower VS-R1 style. Status `voice read measured, pending user listen; not locked` (see FIND-VS-13). Not approved by ear. Editor cannot listen (FIND-VS-03 applies).
- **Pace variant used:** (a) prompted, style `calm, respectful documentary narrator, brisk but calm pace, steady`. **Fallback not used:** the read is too long, not too short. The slower style would lengthen it. Its length is extrapolated only (≈130–135 s from the 133-character VS-R1/VS-R2 sample ratio 1.18); it was not generated. No `atempo` was applied.
- **Script input:** `NYOS-SCRIPT-R1` (`short/script.md`, not edited). Beats `NYOS-EP01-SHORT-B00`…`B13` verbatim, 14 VO lines, 1,174 TTS characters, TTS text sha256 prefix `0ce14c37cb9d49d0`. The 17 `…` became `,`. `B_loop` hold (≈2–3 s) is visual, not VO.
- **Quota:** 1 request (`gemini-3.8-flash-tts`, free tier). Exit 0 on the first attempt, no retry. With VS-R1 (3) and VS-R2 (1) this is 5 of 10 for 2026-10-31, if the earlier count is right. 5 remain. The reset time was not checked.
- **Read:** one call, `--text-file`, beats joined with one space (no inserted pause). The sidecar `out/lake-nyos/vo/vo-full-prompt.json` keeps model, voice, style and text.

### Measured read (joined track, −16 LUFS)

| Item | Value | Method |
| --- | --- | --- |
| Track | `out/lake-nyos/vo/vo-full-prompt.wav`, 48 kHz mono 16-bit | `scripts/gemini-tts.py say` two-pass `loudnorm` to −16 LUFS |
| Duration | 113.24 s (lead 0.33 s, trail 0.21 s, speech span 112.7 s) | `voice-sample-tools.py measure` |
| Loudness | −16.15 LUFS, true peak −1.42 dBTP, LRA 3.9 LU | same (loudnorm pass 1, target −16 / −1.5 / 11) |
| VO end (last speech) | 113.04 s | `align-full` speech window (threshold 300 / 32767) |
| Budget check | 113.0 s VO + B13 hold 2–3 s = 115–116 s, against 50–80 s: **over by 33–36 s** | delivery record |

- **Join check:** the 14 per-beat segments, concatenated, are bit-identical to the full read (10,871,040 bytes each, max sample difference 0). The joined track is the full read itself.
- **Loudness of segments:** cut from the −16 LUFS file without a second normalization. Only the full track was measured.

### Per-beat timing (measure file, cut at energy gaps)

Measure file: `scripts/lake-nyos/short/measure-vo-vs-r3.json` (committed-ready, untracked). Per-beat segments: `out/lake-nyos/vo/segments-vs-r3/<BEAT>.wav`. Times are seconds from the start of the full read.

| Beat | Segment start–end | Segment dur. | Speech on–off | Speech span | Gap to next beat |
| --- | --- | --- | --- | --- | --- |
| B00 | 0.000–6.215 | 6.215 | 0.083–5.750 | 5.67 | 0.92 |
| B01 | 6.215–13.965 | 7.750 | 6.674–13.460 | 6.79 | 1.00 |
| B02 | 13.965–23.420 | 9.455 | 14.464–22.953 | 8.49 | 0.94 |
| B03 | 23.420–30.290 | 6.870 | 23.888–29.832 | 5.94 | 0.91 |
| B04 | 30.290–36.590 | 6.300 | 30.740–36.113 | 5.37 | 0.95 |
| B05 | 36.590–47.305 | 10.715 | 37.064–46.802 | 9.74 | 1.00 |
| B06 | 47.305–53.185 | 5.880 | 47.802–52.691 | 4.89 | 0.98 |
| B07 | 53.185–60.680 | 7.495 | 53.671–60.364 | 6.69 | 0.63 |
| B08 | 60.680–65.865 | 5.185 | 60.994–65.782 | 4.79 | 0.17 |
| B09 | 65.865–75.620 | 9.755 | 65.948–75.530 | 9.58 | 0.18 |
| B10 | 75.620–86.235 | 10.615 | 75.706–86.109 | 10.40 | 0.26 |
| B11 | 86.235–96.150 | 9.915 | 86.365–96.048 | 9.68 | 0.20 |
| B12 | 96.150–103.000 | 6.850 | 96.251–102.879 | 6.63 | 0.25 |
| B13 | 103.000–113.240 | 10.240 | 103.129–113.035 | 9.91 | hold 2–3 s (visual) |

- **Alignment:** `align-full` matched 1,000 of 1,081 normalized TTS characters (0.93). All 40 phrase anchors matched inside their phrase (none by fallback). Anchor and cut times are Whisper estimates, refined by `cut-gaps`, which clamped 9 anchor edges to the first or last audible sample of their new segment. The anchor table is `scripts/lake-nyos/short/vo-anchors-vs-r3.md`. Its `estOn`/`estEnd` columns are 0 placeholders: no phrase timing exists yet. Anchor on/end times are in the measure file.

### Whisper check (large-v3-turbo, `th`, not proof)

| Item | Heard? | Note |
| --- | --- | --- |
| คนราว | yes (B01 "คนราว 1,700 คน") | key word |
| 1,700 / 1986 / 2001 | yes, as digits | Thai reading of digits is for the user to hear |
| อะไรบางอย่าง | **no** in both places: "อะไรบังอย่าง" (B00, B05) | same mis-hear as VS-R1 Charon and VS-R2 (a); listen |
| ก๊าซคาร์บอนไดออกไซด์ (B09) | no, garbled | listen |
| สัตว์ร้าย (B05, B07) | "สัปรา", "สัดร้าย" | listen |
| non-Thai tokens in B09–B10 | yes | ASR noise, not evidence about the audio |

### Drift check (no API, `voice-match.py` metrics only)

Config and outputs: `out/lake-nyos/vo/drift-config-{mid,tail}.json`, `drift-match-{mid,tail}.json`. Reference is the opening, B00–B03 (0–30.29 s). "Rate" is TTS characters per active second, active = 10 ms blocks ≥ 300 / 32767.

| Span | Beats | F0 median Hz | F0 spread Hz | Centroid Hz | Rate | Rate vs opening |
| --- | --- | --- | --- | --- | --- | --- |
| Opening (ref) | B00–B03 | 175.8 | 67.1 | 2024 | 12.8 | 1.00 |
| Mid | B05–B08 | 174.5 | 93.1 | 2084 | 16.1 | 1.26 (fails the tool's 10 % pace gate) |
| Tail | B11–B13 | 174.5 | 82.5 | 2217 | 13.6 | 1.06 |

- F0 holds (within 1 %). The centroid of the tail is 9.6 % brighter than the opening.
- Active rate varies more than the tail alone. The mid section reads faster per active second, and the gaps between beats are about 0.9–1.0 s for B00–B07 and 0.17–0.26 s for B08–B13 (table above). Text density and pauses both contribute, so the cause is not verified. This is a candidate for the gemini-tts "late drift" check; the user should listen to B05–B08 against B00–B03.

### Findings

- **FIND-VS-10 Length over budget (blocking).** The read is 113.2 s; the budget is 50–80 s. The script's estimate for B01–B13 was 70.2 s; the read's B01–B13 span is 107.0 s (1.52×). The VS-R1 sample predicted this: 0.0935 s per character at prompted pace, 1,174 characters gives ≈110 s. The fallback rule covers only a short read, so it was not run. To reach ≈77 s of VO (80 s less the hold) at the same pace, about 36 s (≈32 %) must come out of the text. The same text needs ≈1.47× the prompted speed. Neither change is Editor's to make: text is Preaw's (changed claims to Boat), and the pace is the user's choice.
- **FIND-VS-11 Levers measured but not applied.** (1) Capping the beat gaps of B00–B07 (0.63–1.00 s) at 0.30 s would save ≈4.9 s, without touching speech. This is a per-beat assembly choice for Mark's slot plan. (2) Removing all gaps would still leave ≈104.6 s of speech. (3) A faster pace than the prompted take is untested: VS-R2 showed one style phrase moving speech by 15 %; atempo above 1.05× has no evidence on this voice.
- **FIND-VS-12 Script estimates are not a basis for timing.** The script's `estimated` per-beat times run about 35 % short of this read (FIND-VS-01 again). Mark should use the measure file's per-beat times, not the script table.
- **FIND-VS-13 Voice lock not applied.** The lock needs (1) the user's choice of voice (Sulafat chosen by rule on 2026-10-31, not by ear); (2) the script revision passed its fact-check (`NYOS-FACTCHECK-R1` is `revision-required`; FC01–FC03 applied inline, checked in the script text; Boat's recheck of B00 was waived by the user, which is not a Boat verdict); (3) a VO length within the 50–80 s budget (FIND-VS-10). Only the measured read exists. The row is recorded as `voice read measured, pending user listen; not locked`.
- **FIND-VS-14 Key words not confirmed.** Whisper hears "คนราว" and the numbers, but not "อะไรบางอย่าง" (both times) or "ก๊าซคาร์บอนไดออกไซด์". The same "อะไรบัง" pattern has now appeared in three takes (VS-R1 Charon, VS-R2 (a), VS-R3). It may be Gemini's pronunciation of "บาง" or a consistent ASR error. The user should listen to `B00` at about 0.9–3.2 s and `B05` at about 43.9–46.8 s.
- **FIND-VS-15 Free tier for the full unreleased script.** The whole script went to the free tier. The gemini-tts skill says use the paid tier for unreleased scripts. The key's tier was not checked (FIND-VS-04). The user chose the free tier for quota reasons; confirm before any further call.

### Reproduction (VS-R3)

```
python3 -I scripts/lake-nyos/vo-lock-inputs.py
out/gemini-venv/bin/python -I scripts/gemini-tts.py say out/lake-nyos/vo/vo-full-prompt.wav --voice Sulafat --style "calm, respectful documentary narrator, brisk but calm pace, steady" --text-file out/lake-nyos/vo/tts-full.txt --timeout 300
python3 -I scripts/lake-nyos/voice-sample-tools.py measure out/lake-nyos/vo/vo-full-prompt.wav
<main>/.venv-whisper/bin/python -I scripts/narration/align-full.py --full out/lake-nyos/vo/vo-full-prompt.wav --tts-beats out/lake-nyos/vo/tts-beats.json --timeline out/lake-nyos/vo/narration-timeline.json --index scripts/lake-nyos/short/vo-anchors-vs-r3.md --segments out/lake-nyos/vo/segments-vs-r3 --out scripts/lake-nyos/short/measure-vo-vs-r3.json
python3 -I scripts/narration/cut-gaps.py --full out/lake-nyos/vo/vo-full-prompt.wav --measure scripts/lake-nyos/short/measure-vo-vs-r3.json --segments out/lake-nyos/vo/segments-vs-r3 --prev out/lake-nyos/vo/measure-vo-vs-r3-whisper-cut.json
<main>/.venv-whisper/bin/python -I scripts/narration/voice-match.py --config out/lake-nyos/vo/drift-config-tail.json --out out/lake-nyos/vo/drift-match-tail.json
```

`<main>` is the main checkout, as in VS-R1 and VS-R2. The timeline for alignment is `out/lake-nyos/vo/narration-timeline.json` (beat and subtitle only). The alignment run used an identical scratch copy, since deleted; `vo-lock-inputs.py` regenerates that file and the TTS inputs byte-identical to the ones sent (checked).

### Changes this round

- Created `scripts/lake-nyos/vo-lock-inputs.py` (TL02) and `scripts/lake-nyos/short/vo-anchors-vs-r3.md` (Editor's measurement anchors, not a Mark index). Created the measure file `scripts/lake-nyos/short/measure-vo-vs-r3.json`.
- Generated under ignored `out/`: `vo-full-prompt.wav` and its sidecar, the TTS inputs, 14 segments, the `cut-gaps` previous measure, the drift configs and results, logs under `out/logs/` (`voice-lock-vs-r3-full-prompt.log`, `align-full-vs-r3.log`, `cut-gaps-vs-r3.log`, `drift-match-{mid,tail}.log`).
- Not edited: `short/script.md`. `delivery.md` and `short/film-brief.md` were changed by the other session before this run and were not touched by Editor beyond the VS-R3 lines. No commit.

### Next steps (not done)

- Coordinator asks the user (structured question) how to handle the length: (a) Preaw trims the script to fit (changed claims to Boat, then a new read: VS-R4); (b) a faster pace variant (one request, then re-measure; atempo only with a stated limit); (c) keep the length and change the budget (the user's call, not Editor's). Until then, do not start timed scene sheets from this read.
- User listens to the read (`out/lake-nyos/vo/vo-full-prompt.wav`): the key spots above, and the B05–B08 vs B00–B03 pace. Approval is recorded by the user, not Editor.
- Per FIND-VS-15, confirm the tier for any further call.
- Lock per [delivery-workflow](../../docs/delivery-workflow.md#voice-lock) only after the length decision and the user's listen.
