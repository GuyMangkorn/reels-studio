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

Round 1 (below) is kept as history. Its child and elderly rows are **superseded** by [Round 2](#round-2-user-listening-2026-10-29) after the user listened; the alternate-adult rows are unchanged.

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

## Round 2 (user listening 2026-10-29)

**User verdict on round 1:** the child presets (`child-girl-a`, `child-boy-a`) "sound like a chipmunk"; the elderly presets "don't sound old at all". Round-1 child/elderly presets were removed from `scripts/voice-preset.py`.

**Diagnosis.** `SHIFT(k)` scales F0 **and** formants by the same `k`, and its F0 rise came mostly from the speed trick. Adult→child needs a large F0 rise with only a modest formant rise. Peterson & Barney (1952) averages put child formants about 1.12–1.23× adult-female values (/i/ F2 3200 vs 2790 Hz, /a/ F2 1370 vs 1220, /u/ F3 3260 vs 2670) and about 1.3–1.4× adult-male values ([table reproduced at CCRMA](https://ccrma.stanford.edu/~kglee/m220c/formant.html); dataset: [Praat manual](https://www.fon.hum.uva.nl/praat/manual/Create_formant_table__Peterson___Barney_1952_.html)). Children also show longer, more variable segment durations ([Lee, Potamianos & Narayanan 1999](https://pubmed.ncbi.nlm.nih.gov/10089598/)). The elderly change of round 1 (−8 Hz, k 0.97, light vibrato) was below the cues listeners use:
- speaking rate and F0 ([Harnsberger et al. 2008, J Voice 22(1) 58–69](https://www.frontiersin.org/articles/10.3389/fpsyg.2016.01814/pdf), cited there; speakers imitating old age lowered F0 and rate);
- noise and vocal tremor, which are perceptually relevant for aged male voices ([Harnsberger et al. 2010, J Voice 24, 523–530](https://biecoll.ub.uni-bielefeld.de/index.php/pundp2022/article/download/1047/1061/1066), cited there);
- breathiness (glottal open quotient) in male voices ([ZASPiL study](https://zaspil.leibniz-zas.de/article/download/267/267));
- frequency tremor intensity, a better age indicator than F0 or perturbation in female voices ([Brückl & Sendlmeier, VOQUAL 2003](https://www.isca-archive.org/voqual_2003/bruckl03_voqual.pdf)).

F0 falls with age in women. Men's F0 falls to middle age, then rises: 107 Hz at 40–49 years to 146 Hz at 80–89 years ([Hollien & Shipp 1972, JSHR 15, 155–159](https://labs.sonicfield.org/library/speech-frequency-and-duration-measures-as-a-function-of-chronologic-age)). Shimmer rises in old age, while jitter findings conflict across studies ([integrative review, Rev. CEFAC 2019](https://doaj.org/article/6c461bc46cb34007b4025dc1a4b2c613); [Graczi et al., Hungarian lifespan poster](https://conference.unisalento.it/ocs/public/conferences/27/fmgr_upload/Abstracts/poster_5_Graczi-etal.pdf)).

**Method (decoupled resynthesis, local venv `out/voice-venv`: praat-parselmouth 0.4.7, pyworld 0.3.5 + `setuptools<81` for its `pkg_resources` import, numpy 2.5.4):**
- **Child:** Praat `Change gender`. Its formant shift ratio works by resampling; new pitch median, pitch range factor and duration factor are applied by overlap-add, so F0, formants and length are set separately ([Praat manual](https://www.fon.hum.uva.nl/praat/manual/Sound__Change_gender___.html); 1.1 ≈ male→female). Edge pitch is left at +0Hz.
- **Elderly:** WORLD (`harvest`/`cheaptrick`/`d4c`/`synthesize`, [pyworld](https://github.com/JeremyCCHsu/Python-Wrapper-for-World-Vocoder)), with these edits:
  - log-F0 moved to the target median and its range narrowed;
  - frames stretched for duration and the envelope frequency-warped for formants;
  - ~5 Hz F0 tremor (wandering rate), per-frame jitter, amplitude tremor plus shimmer;
  - aperiodicity raised above ~0.6–3 kHz on voiced frames (breath).
  
  The method follows the WORLD whisper/breathiness approach of driving more noise through the aperiodicity ([Voice conversion for whispered speech synthesis, arXiv:1912.05289](https://arxiv.org/pdf/1912.05289)). Edge rate −20%.
- Output: two-pass `loudnorm` (linear) to −16 LUFS, 48 kHz mono. The script also highpasses at 70 Hz after resynthesis and gates WORLD silence.

| Preset (`scripts/voice-preset.py`) | Source | Parameters | F0 median (p10–p90) | Dur | Jitter / HNR |
| --- | --- | --- | --- | --- | --- |
| `child-girl` (best guess) | Premwadee, rate +5% | Praat f0 275, formant 1.12, range 1.15, dur 1.1 | 269 (214–391) | 2.93 s | 1.5% / 14.8 dB |
| `child-girl-lively` | Premwadee | Praat f0 280, formant 1.12, range 1.3, dur 1.08 | 273 (210–415) | 2.88 s | 1.6% / 14.2 dB |
| `child-boy` (best guess) | Premwadee | Praat f0 250, formant 1.08, range 1.15, dur 1.12 | 247 (196–357) | 2.98 s | 1.7% / 14.8 dB |
| `child-boy-niwat` | Niwat | Praat f0 250, formant 1.25, range 1.2, dur 1.12 | 248 (193–331) | 3.01 s | 2.1% / 13.4 dB |
| `elder-woman` (best guess) | Premwadee, rate −20% | WORLD f0 162, formant 0.95, range 0.7, dur 1.1, tremor 5% @ 5.5 Hz, jitter 3%, shimmer 1.5 dB, amp tremor 15%, breath 0.6 | 163 (140–211) | 3.84 s | 2.5% / 11.7 dB |
| `elder-woman-strong` | Premwadee, rate −20% | WORLD f0 165, formant 0.96, range 0.6, dur 1.12, tremor 7% @ 5 Hz, jitter 3.5%, shimmer 1.8 dB, breath 0.75 | 164 (141–202) | 3.91 s | 2.9% / 11.1 dB |
| `elder-man` (best guess) | Niwat, rate −20% | as `elder-woman`, f0 150 | 147 (126–185) | 3.86 s | 2.6% / 10.7 dB |
| `elder-man-strong` | Niwat, rate −20% | as `elder-woman-strong`, f0 142 | 143 (121–166) | 3.93 s | 2.9% / 10.4 dB |

Reference values for the unprocessed voices: Premwadee 189 Hz (152–262), 2.81 s, jitter 2.2%, HNR 13.9 dB; Niwat 128 Hz (103–163), jitter 2.8%, HNR 11.1 dB. Edge-TTS output already measures high jitter, so Praat jitter is a weak proxy for the added roughness. The tremor, breath and HNR drop are the intended cues.

- **Picks are acoustic best guesses, not listening verdicts.** The agent could not listen. Child picks follow the Peterson & Barney formant ratios with a moderate range, because a 1.3 range pushes Thai high tones past 400 Hz. Elderly picks are about 2.5× stronger than round 1 on tremor, with breath added; the `-strong` variants are the fallback if they still sound too young. Expected failure modes: a "small adult" for the child (too little formant shift), and a goat-like bleat or a hoarse/robotic WORLD timbre for the elderly.
- Elderly men land at −16.5 to −16.8 LUFS, because linear loudnorm stops at the −1.5 dBTP limit. Re-check in the mix.
- Still not reachable: child articulation and mispronunciation, real pause lengthening between phrases, and creak.

**Samples (local, ignored `out/`):** script outputs `out/voice-tests/r2/preset_<name>.wav` (measurements `preset_measurements.txt`). The exploration grid is `out/voice-tests/r2/*_{praat,world}_*.wav` plus `base_premwadee.wav` and `base_niwat.wav` (`measurements.json`, log `out/logs/voice-r2.log`). Reproduce one clip with `out/voice-venv/bin/python -I scripts/voice-preset.py --preset child-girl --text "วันนี้ฉันจะไปตลาดกับยายนะ" out.wav`.

## Samples (local only, ignored `out/`)

Regenerate by applying the recipes above to the test line (the experiment script was a scratch file and is not committed). Measurements: `out/voice-tests/measurements.json`; log `out/logs/voice-tests.log`.

- Listen first: `out/voice-tests/P_base_norm.wav`, `P_child_A.wav`, `P_child_B.wav`, `P_child_edge_only.wav`, `P_child_formant_only.wav`, `N_base_norm.wav`, `N_child_A.wav`, `N_child_B.wav`, `N_child_edge_only.wav`, `P_elder_A.wav`, `P_elder_B.wav`, `N_elder_A.wav`, `N_elder_B.wav`, `P_adult_younger.wav`, `P_adult_lower.wav`, `N_adult_bigger.wav`, `N_adult_younger.wav`, `P_spliced_2phrases.wav`.
- Raw edge-tts sweeps: `out/voice-tests/raw/{P,N}_pitch{+15,+30,+50,+100,-10,-20,-50}Hz.mp3`, `{P,N}_rate{+10,-20,-50}%.mp3`, `{P,N}_base(_repeat).mp3`, `P_ssml_injection.mp3`, `P_phrase1.mp3`, `P_phrase2.mp3`.

## Planning impact

- Film/Mark: child, elderly or extra adult characters may be planned with these voices only as **short lines or minor roles**, after the user approves a listened sample per character. Record the chosen preset name (e.g. `child-girl`) in the delivery record.
- Editor: until `narration.py` supports per-scene voice/pitch/filter, generate character lines separately and mix them as audio sequences; normalize each to the narration loudness.
- History: 2026-10-29 / `f830580` → edge-tts 7.3.1 param, SSML and role checks; F0/duration/LUFS sweeps and 18 processed presets → `workaround`; perceptual check pending (user). 2026-10-29 / `419c75a` → user: round-1 child = chipmunk, elderly = not old; round 2 decoupled Praat/WORLD presets, perceptual check pending (user).
