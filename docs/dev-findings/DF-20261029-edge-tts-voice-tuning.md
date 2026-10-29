# DF-20261029-edge-tts-voice-tuning — Child, elderly and alternate-adult characters from the two Edge TTS Thai voices

- Owner: Editor; First observed: 29 October 2026; last checked: 29 October 2026
- Status: `workaround`; Type: `tool-limitation` (no Thai character voices or roles; approximated by prosody + ffmpeg post-processing)
- Tags: narration / TTS / sound / character voices
- Scope: branch `claude/editor-workflow-improvements-0f77f3` HEAD `f830580`; macOS arm64; edge-tts `7.3.1`; Homebrew ffmpeg `9.0.2` (no `rubberband` filter); voices `th-TH-PremwadeeNeural`, `th-TH-NiwatNeural`; test line `วันนี้ฉันจะไปตลาดกับยายนะ`
- Consumers: Editor (dialogue lines, `scripts/narration.py`), Film/Mark when a script assigns lines to child or elderly characters. **Perceptual quality is unverified**: the agent that ran the test could not listen. Every verdict below is acoustic measurement plus sources; the user must listen before a recipe is used in delivery.

## Symptoms and evidence

- **edge-tts exposes only `rate`, `volume`, `pitch`.** `TTSConfig` validates `rate` and `volume` against `^[+-]\d+%$` and `pitch` against `^[+-]\d+Hz$` (no `st`, no `%`, no absolute Hz). `mkssml()` builds exactly one `<voice>` with one `<prosody pitch rate volume>`; the text is XML-escaped (`xml.sax.saxutils.escape`). Source: installed `edge_tts/data_classes.py` and `edge_tts/communicate.py` 7.3.1. The README states custom SSML support was removed because the service rejects SSML the Edge client could not generate, and only one voice tag with one prosody tag is allowed ([README](https://github.com/rany2/edge-tts/blob/master/README.md)). Negative CLI values need `--pitch=-10Hz` form (same README).
- **Injection test:** text `<prosody pitch='+50Hz'>…</prosody>` came back 5.71 s vs 2.81 s for the plain line, i.e. the tag was spoken as text (`raw/P_ssml_injection.mp3`). `mstts:express-as`, styles, roles, `range`, `contour`, `<break>` are not reachable through edge-tts.
- **No Thai styles or roles exist anyway.** Azure language-support lists `th-TH-PremwadeeNeural`, `th-TH-NiwatNeural`, `th-TH-AcharaNeural` (Standard) with an empty styles/roles cell; the only Thai voice with styles is the HD `th-TH-Krit:MAI-Voice-2` (roles "Not supported"). Roles (`Girl`, `Boy`, `OlderAdultMale`, `SeniorFemale`, …) are listed only for some `zh-CN` voices such as `zh-CN-XiaomoNeural`, `zh-CN-YunxiNeural`, `zh-CN-YunyeNeural` ([language support, voice styles and roles](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts#voice-styles-and-roles); [SSML role attribute](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice#use-speaking-styles-paralinguistics-and-roles), which says an unsupported role is ignored). `edge_tts.list_voices()` returns only Niwat and Premwadee for `th-TH`, tagged `Friendly, Positive`.
- **Azure prosody limits:** pitch changes "should be within 0.5 to 1.5 times the original"; rate within 0.5–2× ([SSML prosody](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice#adjust-prosody)).
- **Measured edge `pitch` (median F0, autocorrelation, voiced frames):** Premwadee base 190 Hz → +15Hz 205, +30Hz 222, +50Hz 258, +100Hz 286, −20Hz 167, −50Hz 131. Niwat base 136 Hz → +15Hz 148, +50Hz 178, +100Hz 205, −20Hz 118, −50Hz 89. Duration unchanged (2.81 s) at every pitch. Large offsets are accepted but compressed (Niwat +100Hz gave about +70 Hz).
- **Measured edge `rate`:** −20% → 3.48–3.50 s, −50% → 5.54–5.57 s, +10% → 2.54–2.57 s; F0 nearly unchanged.
- **Repeatability:** two identical calls gave the same length (67,392 samples), same F0 and LUFS, but not bit-identical PCM (max sample delta ~12% of peak). Treat a regenerated line as the same take for timing, not as a byte-identical file.
- **Native loudness:** Premwadee −18 LUFS, Niwat −21 LUFS integrated (ebur128); normalize per line before mixing.
- **Word boundaries:** `boundary="WordBoundary"` returns Thai word events with offsets (e.g. `ตลาด` 0.800 s, dur 0.338 s; `out/voice-tests/word_boundaries.json`). They describe the **unprocessed** clip; scale offsets by `1/atempo` only if a recipe changes duration (the recipes below restore it within 1%).
- **Spectral centroid** moved with edge pitch as well as with `asetrate`; centroid is not a formant measurement, so whether edge pitch preserves formants is **inconclusive**.

## Why the recipe works (reference)

- Perceived age, sex and size depend jointly on glottal-pulse rate (F0) and vocal-tract length (formant scale); vocal-tract length strongly drives perceived size, and listeners separate children from adults readily ([Smith & Patterson 2005, JASA 118(5) 3177, doi:10.1121/1.2047107](https://www.pdn.cam.ac.uk/system/files/documents/SPjasa05.pdf); [Smith, Walters & Patterson 2007, JASA 122(6)](https://www.pdn.cam.ac.uk/system/files/documents/SWPjasa07.pdf)). Raising F0 alone tends to give a "high-pitched adult".
- Children have higher F0 and formants, longer and more variable segment durations, converging to adult values around ages 12–15; male formant change fits uniform vocal-tract growth ([Lee, Potamianos & Narayanan 1999, JASA 105(3) 1455, PMID 10089598](https://pubmed.ncbi.nlm.nih.gov/10089598/)).
- Older voices show more jitter, shimmer and F0 variability; F0 tends to fall in women and its direction in men differs between studies ([Korean 20–40 vs 60–80 comparison, 1997](https://www.koreascience.kr/article/JAKO199711922425481.page); [Mongolian 20–79 adults, 2021](https://doaj.org/article/bc66b58633734f15bd9e0f66e292c320)). So: slight F0 drop, slower rate, small periodic F0/amplitude modulation, reduced brightness.
- **Decoupling trick:** edge `pitch` changes F0 inside the synthesizer; `asetrate=48000*k,aresample=48000,atempo=1/k` then scales F0 **and** formants by `k` and restores duration. Total F0 ≈ (F0 + edge Hz) × k; formants × k. Local ffmpeg has no `rubberband` (formant-preserving pitch), `atempo` accepts 0.5–100, `vibrato`/`tremolo` take `f` in Hz and `d` 0–1 (`ffmpeg -h filter=…` on ffmpeg 9.0.2; [ffmpeg filters](https://ffmpeg.org/ffmpeg-filters.html#asetrate)).

## Verdicts and recipes

`SHIFT(k)` = `aresample=48000,asetrate=<48000*k>,aresample=48000,atempo=<1/k>`; `NORM` = `loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000` (single-pass; short clips landed −15.0 to −20.4 LUFS, so re-measure or normalize in the final mix).

| Character | Verdict | Recipe (edge-tts args → ffmpeg `-af`) | Measured F0 / duration |
| --- | --- | --- | --- |
| Child girl from Premwadee | **partly** (cartoon-ish risk above k 1.25) | `--pitch=+15Hz` → `SHIFT(1.18),highpass=f=180,NORM` (A); stronger `--pitch=+30Hz` → `SHIFT(1.25),highpass=f=180,NORM` (B) | A 235 Hz, B 286 Hz / 2.78 s |
| Child boy from Niwat | **partly** (adult articulation and timing remain) | `--pitch=+50Hz` → `SHIFT(1.25),highpass=f=180,NORM` (A); `--pitch=+100Hz` → `SHIFT(1.3),…` (B) | A 211 Hz, B 258 Hz / 2.78 s |
| Child, edge pitch only | **not** recommended | `--pitch=+30Hz` (P) / `+50Hz` (N), no shift: F0 rises, formant scale untouched | 222 / 178 Hz |
| Elderly woman (Premwadee) | **partly** | `--rate=-15% --pitch=-8Hz` → `SHIFT(0.97),vibrato=f=5.5:d=0.08,tremolo=f=5:d=0.15,highpass=f=140,lowpass=f=6500,NORM` (A); B: `SHIFT(0.95),vibrato=f=6:d=0.15,tremolo=f=6:d=0.25,highpass=f=160,lowpass=f=5500,equalizer=f=2500:t=q:w=1:g=-3,NORM` | A 178 Hz, B 174 Hz / 3.27 s |
| Elderly man (Niwat) | **partly** | same as above with `highpass` 120 (A) / 140 (B) | 125 / 127 Hz / 3.27 s |
| Different adult woman | **feasible** | younger/brighter: `--pitch=+15Hz` → `SHIFT(1.06),NORM`; lower/older: `--pitch=-20Hz` → `SHIFT(0.93),NORM` | 211 / 160 Hz |
| Different adult man | **feasible** | bigger/deeper: `--pitch=-10Hz` → `SHIFT(0.9),equalizer=f=150:t=q:w=1:g=2,NORM`; younger: `--pitch=+15Hz` → `SHIFT(1.06),NORM` | 114 / 157 Hz |

- Keep `k` within about 0.9–1.3; beyond that, `asetrate` artefacts (chipmunk / slowed tape) dominate. Edge pitch stays within Azure's 0.5–1.5× guidance.
- Breathiness and creak (elderly) and childlike articulation, mispronunciation or uneven timing cannot be produced by these parameters; an elderly or child voice remains an "adult reading in a character register". For a lead child/elderly role with much dialogue, a recorded or dedicated character voice is the reliable path; these recipes suit short lines and minor characters.

## Short-phrase generation and splicing

- `scripts/narration.py` already synthesizes **one clip per timeline scene** (`synthesize()` → `edge_tts.Communicate(text, voice, rate=rate)`), places each in its scene slot, and supports `closeGaps`, `cuts`, `gains`, `trimHeadSec`, `leadSec`. It passes no `pitch` and takes one voice for the whole timeline, so per-line characters need a per-scene `voice`/`pitch`/post-chain field (not implemented; Boss/Editor runtime change if adopted).
- Per-call voice and pitch are stable (same length, F0, loudness), so per-line character presets are consistent.
- Each call is phrased as a complete utterance: splitting the line into `วันนี้ฉันจะไปตลาด` + `กับยายนะ` gave phrase F0 205 Hz then 163 Hz (separate declination and final fall) and a 2.54 s splice vs 2.81 s whole (`P_spliced_2phrases.wav`, 60 ms gap). Splice at a real sentence or speaker change; inside one sentence the join is likely audible (unverified by ear).
- The service intermittently returns `NoAudioReceived` (Premwadee failed many retries in this run, then succeeded); keep the retry loop (`narration.py` uses 15 attempts) and lower concurrency to 2.

## Samples (local only, ignored `out/`)

Regenerate by applying the recipes above to the test line (the experiment script was a scratch file and is not committed). Measurements: `out/voice-tests/measurements.json`; log `out/logs/voice-tests.log`.

- Listen first: `out/voice-tests/P_base_norm.wav`, `P_child_A.wav`, `P_child_B.wav`, `P_child_edge_only.wav`, `P_child_formant_only.wav`, `N_base_norm.wav`, `N_child_A.wav`, `N_child_B.wav`, `N_child_edge_only.wav`, `P_elder_A.wav`, `P_elder_B.wav`, `N_elder_A.wav`, `N_elder_B.wav`, `P_adult_younger.wav`, `P_adult_lower.wav`, `N_adult_bigger.wav`, `N_adult_younger.wav`, `P_spliced_2phrases.wav`.
- Raw edge-tts sweeps: `out/voice-tests/raw/{P,N}_pitch{+15,+30,+50,+100,-10,-20,-50}Hz.mp3`, `{P,N}_rate{+10,-20,-50}%.mp3`, `{P,N}_base(_repeat).mp3`, `P_ssml_injection.mp3`, `P_phrase1.mp3`, `P_phrase2.mp3`.

## Planning impact

- Film/Mark: child, elderly or extra adult characters may be planned with these voices only as **short lines or minor roles**, after the user approves a listened sample per character. Record the chosen recipe ID (e.g. `P_child_A`) in the delivery record.
- Editor: until `narration.py` supports per-scene voice/pitch/filter, generate character lines separately and mix them as audio sequences; normalize each to the narration loudness.
- History: 2026-10-29 / `f830580` → edge-tts 7.3.1 param, SSML and role checks; F0/duration/LUFS sweeps and 18 processed presets → `workaround`; perceptual check pending (user).
