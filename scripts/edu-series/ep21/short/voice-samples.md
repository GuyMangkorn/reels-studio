# EP21 opening voice audition

- Revision: **EDU-EP21-VOICE-SAMPLES-R2**, Editor, 2026-11-16. R1 intake and measurements remain historical provenance.
- Scope: **EDU-EP21-SHORT**, channel `edu`, `channel-default`; [SCRIPT-R1](script.md), FACT-R1 ready-for-storyboard, [DELIVERY-R2](../delivery.md). User selected **Kore ×1.05** on 2026-11-16: "เลือก 1.05". W1.4's selected-setting projection is complete at 43.97 s; script approval remains explicitly deferred. No full narration, full-voice approval or W4 voice lock is established. Candidate tables and stored generation manifests below retain their at-handoff history; this selection and the delivery record govern current status.
- Settings: `gemini-3.8-flash-tts`, **Kore**, style exactly `warm, friendly, smiling storyteller, speaking rapidly`. Original R1 used one API response; its exact-key cache was absent before generation. R2 reuses that exact source and makes **zero TTS/API calls**, with no retranscription. No full narration, timed scene, video or music bed was generated.
- Evidence and absolute paths: [machine-readable manifest](voice-samples.json). Retained media, sidecars, input, measurements, local transcription and reproduction inputs are filed once under `projects/edu/EDU/samples/ep21/2026-11-16_r1-76603d9a5b7493a3/` in `/Users/mangkornkatawong/ReelsStore/`. `out/ep21-voice-samples-r1/` is a cache.

## Playable candidates

The user requested **1.03 and 1.05** and explicitly withheld script approval to read SCRIPT-R1 first. Neither requested pace is a selection. These current auditions override the channel's usual audition pair for this pass only. Both use the same R1 read and the same two lines; MP3s are listening derivatives of the corresponding WAV. Every retained audio file is at most 10 seconds; each WAV and MP3 was individually measured with `ffprobe`.

| Current candidate | Listen | WAV provenance | Container duration | Status |
| --- | --- | --- | ---: | --- |
| Kore atempo **1.03** | `/Users/mangkornkatawong/orca/workspaces/reels-creator/ep21-lightning-continuation/out/ep21-voice-samples-r2/EP21_L01-L02_kore_x1.03.mp3` | `/Users/mangkornkatawong/orca/workspaces/reels-creator/ep21-lightning-continuation/out/ep21-voice-samples-r2/EP21_L01-L02_kore_x1.03.wav` | **7.384771 s** (both formats, separately probed) | Choice pending; script not approved |
| Kore atempo **1.05** | `/Users/mangkornkatawong/orca/workspaces/reels-creator/ep21-lightning-continuation/out/ep21-voice-samples-r2/EP21_L01-L02_kore_x1.05.mp3` | `/Users/mangkornkatawong/orca/workspaces/reels-creator/ep21-lightning-continuation/out/ep21-voice-samples-r2/EP21_L01-L02_kore_x1.05.wav` | **7.249375 s** (both formats, separately probed) | Choice pending; script not approved |

Canonical R2 files, sidecars and reproduction/measurement evidence: `projects/edu/EDU/samples/ep21/2026-11-16_r1-76603d9a5b7493a3/r2-1.03-1.05/` in `/Users/mangkornkatawong/ReelsStore/`. The original source remains at its R1 store path; no duplicate source was filed. `out/ep21-voice-samples-r2/` is the new listening cache.

### Historical R1 candidates and shared source

| Candidate | Listen | WAV provenance | Container duration | Status |
| --- | --- | --- | ---: | --- |
| Kore atempo **1.08** | `/Users/mangkornkatawong/orca/workspaces/reels-creator/ep21-lightning-continuation/out/ep21-voice-samples-r1/EP21_L01-L02_kore_x1.08.mp3` | `/Users/mangkornkatawong/orca/workspaces/reels-creator/ep21-lightning-continuation/out/ep21-voice-samples-r1/EP21_L01-L02_kore_x1.08.wav` | **7.057250 s** (both formats) | Historical; not selected |
| Kore atempo **1.15** | `/Users/mangkornkatawong/orca/workspaces/reels-creator/ep21-lightning-continuation/out/ep21-voice-samples-r1/EP21_L01-L02_kore_x1.15.mp3` | `/Users/mangkornkatawong/orca/workspaces/reels-creator/ep21-lightning-continuation/out/ep21-voice-samples-r1/EP21_L01-L02_kore_x1.15.wav` | **6.623125 s** (both formats) | Historical; not selected |
| No-atempo source | `/Users/mangkornkatawong/orca/workspaces/reels-creator/ep21-lightning-continuation/out/ep21-voice-samples-r1/EP21_L01-L02_kore_source.wav` | Tool-normalized, 48 kHz mono | **7.600000 s** | Calibration source only |
| Original API response | `/Users/mangkornkatawong/orca/workspaces/reels-creator/ep21-lightning-continuation/out/ep21-voice-samples-r1/EP21_L01-L02_kore_api-raw.wav` | Original cached response, 24 kHz mono | **7.600000 s** | Preservation only |

The normalized source and both WAV candidates are 48 kHz mono. The tool targets −16 LUFS/−1.5 dBTP; measured source/1.08/1.15 values are −16.60/−16.69/−16.74 LUFS, all −1.50 dBTP. These measurements are not listening approval. No Film sound-bed handoff exists yet, so the audition is dry; sound-bed choice remains pending.

## Exact input and provenance

Only existing L01–L02 were read. Preaw's recount is **14 + 17 = 31 syllables**. The Thai script is unchanged:

```text
ไม่ใช่ยางนะ...ที่ช่วยป้องกันคนในรถถูกฟ้าผ่า
ต้องเป็นรถปิดมิดชิด หลังคากับตัวถังโลหะ ปิดกระจกด้วย
```

Per the Gemini narration rule, only the TTS input replaces the ellipsis with a comma; the line boundary is preserved:

```text
ไม่ใช่ยางนะ,ที่ช่วยป้องกันคนในรถถูกฟ้าผ่า
ต้องเป็นรถปิดมิดชิด หลังคากับตัวถังโลหะ ปิดกระจกด้วย
```

| Identity | SHA-256 / key |
| --- | --- |
| Source `script.md` at generation | `562dcf53af393f1d6fa0904c3bad39acad28e7c593c39d679692ad275a36252c` |
| Exact original two-line text, UTF-8, no terminal newline | `c254c422777f4425cd3b046e6c6d43f9baa1784df07fc1914fcde407275538db` |
| Exact TTS two-line text, UTF-8, no terminal newline | `8cc607822ab50cd669aae2f31a046ac39bb88855c124334502e791aeac3069e9` |
| Model/voice/style/text cache key, shared by all derivatives | `76603d9a5b7493a3` |

The source is the original response processed by `scripts/gemini-tts.py` two-pass loudness normalization; “source” does not mean unprocessed API audio. Each candidate applies `ffmpeg -af atempo=<pace>` directly to that source, never to a previously sped-up candidate. R2 uses 1.03/1.05; R1 used 1.08/1.15. MP3 derivatives use `libmp3lame -q:a 2`. No trimming, new words or extra takes were used. Exact artifact hashes and storage paths are in the JSON manifest. WAV/MP3 files sharing a basename have one shared store JSON sidecar containing both artifact records.

## Calibration denominators

Primary acoustic estimates decode to mono 48 kHz, use 10 ms RMS windows and a −40 dBFS threshold. “Gross span” runs from the first to the last above-threshold window and retains internal pauses. Leading/trailing figures are below-threshold file edges, not a phonetic or listening verdict. The original API file differs by about 10 ms at the tail after normalization; calibration uses the actual normalized source and candidates.

| Audio | Lead / tail (s) | Gross start–end (s) | 31 / container (syllables/s) | 31 / gross span (syllables/s) | Identified line gap removed | Baseline denominator | 31 / baseline (syllables/s) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Source | 0.29 / 0.220000 | 0.29–7.38 = **7.09** | 4.0789 | 4.3724 | 3.14–3.46 = 0.32 s | **6.77 s** | 4.5790 |
| **1.03, current R2** | 0.27 / 0.214771 | 0.27–7.17 = **6.90** | 4.1978 | 4.4928 | 3.06–3.36 = 0.30 s | **6.60 s** | **4.6970** |
| **1.05, current R2** | 0.27 / 0.219375 | 0.27–7.03 = **6.76** | 4.2762 | 4.5858 | 2.99–3.30 = 0.31 s | **6.45 s** | **4.8062** |
| 1.08 | 0.26 / 0.227250 | 0.26–6.83 = **6.57** | 4.3926 | 4.7184 | 2.91–3.19 = 0.28 s | **6.29 s** | 4.9285 |
| 1.15 | 0.24 / 0.193125 | 0.24–6.43 = **6.19** | 4.6806 | 5.0081 | 2.74–3.02 = 0.28 s | **5.91 s** | 5.2453 |

Only two explicit slots were considered for removal: L01 `นะ...ที่` and L01→L02 `ผ่า`→`ต้อง`. The former has **no ≥40 ms gap at −40 dBFS**, so the primary calculation removes **0.00 s** there; that does not establish a zero audible pause. At −35 dBFS, source 1.19–1.23 is a 40 ms low-energy run. Ordinary within-L02 phrase gaps remain in the baseline. The identified line-boundary low-energy run may include a quiet initial consonant: machine ASR places L01's end at 3.12 s and L02's start at 3.30 s, overlapping the energy estimate. Treat the removed gap as provisional acoustic evidence.

Sensitivity at −45/−35 dBFS gives gross spans source **7.09/7.08 s**, 1.08 **6.58/6.57 s**, 1.15 **6.20/6.17 s**. At −45 dBFS the line gap is source **0.31 s**, 1.08 **0.26 s**, 1.15 **0.27 s**. Full window/gap measurements are preserved in the store's `measurements.json`.

Preaw owns the [length projection](timing-projection.md): explicit-slot baseline followed by the authored full-script pause budget, plus the unchanged closing hold. Gross-span extrapolation is a separate sensitivity that must not add those pauses twice. The EP16 channel reference rates (about 5.5/5.9 syllables/s) are not measured rates of this EP21 take. These two lines cannot establish full-read consistency, late drift or final scene timings.

## QA and limits

- Generation succeeded with exit 0 using the existing main-checkout Gemini venv (`google-genai 2.34.0`); one request, no `--fresh`, no alternate-key switch and no automatic retry. All six retained audio files passed the ≤10 s `ffprobe` check.
- The shared `scripts/transcribe.py` failed locally at PyAV `av.open(..., metadata_errors='ignore')`: `TypeError: open() got an unexpected keyword argument 'metadata_errors'`. A local ffmpeg→float32 NumPy adapter bypassed PyAV and used the already cached `large-v3-turbo`, CPU/int8, Thai, word timestamps and VAD. No package install, model download or extra API call was needed. Both logs and the adapter are stored.
- Machine transcript covered both lines, but wrote `ไม่ใช่อย่างนะ` for script `ไม่ใช่ยางนะ`, and `หลังค่า` for `หลังคา`. This can be recognition error; **listen to “ยาง” and “หลังคา” before approval**. Neither Thai pronunciation nor emotional delivery has been approved by an agent or the user.
- No Film music choice, Ton cue sheet, integrated mix, caption timing, scene runtime, visual sample, full narration or voice lock is claimed. This is an audition and calibration handoff only.

Current next step: W1.5 remains deferred while the user reads SCRIPT-R1. Kore ×1.05 was explicitly selected; no further pace question is pending. Full narration, its pronunciation/delivery review and W4 voice lock follow the script/storyboard gates.

## R2 verification and next boundary

- Original normalized source cache/store SHA-256 matches R1 `407947b0007373e86aa310c402f18d7b994c15332e116e9e42e92e8186cf502e`. All four new media cache/store hashes match; WAV and MP3 durations were independently probed and are below 10 s.
- R2 reused the same acoustic method and source words; it did not load Whisper or repeat transcription. Prior R1 ASR limitations remain unresolved listening notes, not new pronunciation findings. R2 ellipsis removal is also zero because no ≥40 ms gap is detected at the primary threshold; this is not proof of no audible pause.
- Reproduction and raw measurements are retained beside the R2 media as `derive-measure.py`, `file-handoff.py` and `measurements.json`. Local logs are `out/logs/ep21-voice-r2-derive.log` and `out/logs/ep21-voice-r2-store.log`.
- Present only the requested current 1.03/1.05 pair for the next choice and provide the unchanged script for reading. Do not treat a sample pick as script approval or ask approval again as part of this audio pass. No full narration or Film work is authorized by the user's sample request.
