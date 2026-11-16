# EP20 continuous narration measure

## VOICE-MEASURE-R3: narration R2 (locked E + new L13, Editor, 16 Nov 2026)

- Current revision: **EDU-EP20-VOICE-MEASURE-R3**, for **EDU-EP20-SHORT** narration **R2** against **EDU-EP20-SCRIPT-R2** (L13 only changed). [voice-measure.json](voice-measure.json) holds R3 at top level and the full R2 record under `r2Record`; R1 stays in the store (`edu-ep20-r1/voice-measure-r1-preserved.json`).
- **Approval boundary.** The full read rests on the user's pick of sample B (“B ต่อเข้าเทคที่ล็อก”, 16 Nov 2026). **Nobody has listened to this full file, the 44.401 s seam or the L13 pronunciation yet.** Local Whisper transcribes L13 as `เพราะคราวนี้อากาศด้านหน้ากลับดันแรงกว่าด้านหลังนั่นเอง`, an exact text match. That is objective evidence, not pronunciation approval.
- **Build.** Locked E `kore-full-selected-E-slower3.wav` (`ebfe0bd3…`) up to the B seam at **44.4010 s** (sample 2131248), then the fresh L13 `B-tempo_L13.wav` (`5d7be477…`, cache `e174b9b5a09fe36c`, atempo 0.967575) from source **0.121 s**. 3 ms linear fades on both seam edges, no gain change, no fade at the file head, **zero API calls**. `splice.py` reproduces sample B bit-exactly (`29ebdfe7…`). The full file equals E up to 44.398 s and equals sample B from E 42.3285 s on, except 105 samples inside B's own 3 ms head fade (the script asserts both).
- **File.** Store `projects/edu/EDU/narration/edu-ep20-r2/kore-full-selected-E-L13r2.wav` (+ `.json` sidecar, `splice-full.py`). 48 kHz mono PCM16, **2307537 samples = 48.073688 s**. SHA256 **`b6f8490d2af1ea5975ba612dc35cae308719a8296e1126189d441cdc5ce11d68`**. Loudness **−15.90 LUFS / −1.51 dBTP / 2.00 LU LRA** (ffmpeg loudnorm analysis; E was −15.92 / −1.51 / 2.30). Segment loudness: E's L12 −14.2 LUFS, new L13 −15.8 LUFS, the same step as E's old L13.

| Anchor | Onset | Onset f@30 | End | End f@30 | Source |
| --- | --- | --- | --- | --- | --- |
| B01 / L01 | 0.105091 s | f3 | | | R2 estimate (audio unchanged) |
| B02 / L04 | 11.840851 s | f355 | | | R2 estimate (audio unchanged) |
| B03 / L06 | 16.557173 s | f497 | | | R2 estimate (audio unchanged) |
| B04 / L09 | 28.564411 s | f857 | | | R2 estimate (audio unchanged) |
| B05 / L11 | 36.572272 s | f1097 | 47.928604 s | **f1438** | onset R2 estimate; end measured |
| L12 | 42.465042 s | **f1274** | 44.355125 s | **f1331** | measured on R3 (peak ≥300/32767) |
| L13 | 44.447313 s | **f1333** | 47.928604 s | **f1438** | measured on R3 (peak ≥300/32767) |
| Seam | 44.401 s | f1332.0 | | | inside the L12→L13 quiet 44.36–44.44 s |
| Narration file end | | | 48.073688 s | **G1442.2** | file length |

- −40 dBFS 10 ms RMS runs: L12 42.48–44.03 s, L13 44.44–47.92 s, gap 0.41 s (E's own spacing kept). Whisper L13 on/end ≈ 44.35 / 47.79 s (±0.1–0.2 s).
- **SS-R4 rule:** total = ceil(1442.21) + 176 = **1619 f (53.967 s)**, narration end **G1442.2** (+29.0 f against E's G1413.2). The VOICE-R2 estimate (G1445.6 / 1622) assumed E's 0.267 s post-speech tail; the fresh L13 has 0.145 s after its last energy, so the measured end is **3.4 f earlier**. Nothing was padded. At an unchanged total of 1590 f, 147.8 f remain after the file end (R2: 176.8 f). Film decides.
- Braking answer L12–L13: **5.463562 s** (R2: 4.368 s); every answer span is still under 10 s. File + 3 s hold = 51.074 s, within the channel's 40–60 s.
- **Not touched:** timeline, compositions, `public/` narration, captions, sound cues and sound mix. Film re-anchors the B05 events (PX20 in B05-SH03, END20, L13b captions, music fade, `SFX20-END` at G1531) first. Then Editor integrates, and Ton re-times the cue sheet.

```sh
python3 -I splice-full.py <store>/edu-ep20-r1/kore-full-selected-E-slower3.wav \
  <store>/samples/edu-ep20-voice-r2/B-tempo_L13.wav <store>/samples/edu-ep20-voice-r2/B_kore_L12-locked-E+L13-fresh.wav \
  out/voice/edu-ep20-r2/kore-full-selected-E-L13r2.wav
```

## VOICE-MEASURE-R2 record (superseded by R3 for L12–L13 and the file end)

- Revision: **EDU-EP20-VOICE-MEASURE-R2**, Editor, 2026-11-16. **EDU-EP20-SHORT** only; SCRIPT-R1, FACT-R1, HOOK-R1 and BOARD-R1 unchanged.
- User selected E with **“ใช้ความเร็วนี้”** after the <=10 s E audition. Exact local full-track transform: D selected WAV through **atempo=0.97**, equivalent original-base atempo **0.967575**. Same take/Kore/style, pitch-preserving tempo processing; **zero API calls**, no trim, padding, silence insertion or normalization rewrite. D is retained intact.
- **Voice locked:** user explicitly approved the complete E take with “ใช้เสียงเต็มนี้ต่อ” on 2026-11-16, after selecting its pace. W4.3 is complete. Timing anchors retain the uncertainty below; no visual proof is implied.

[Listen to full E narration](/Users/mangkornkatawong/ReelsStore/projects/edu/EDU/narration/edu-ep20-r1/kore-full-selected-E-slower3.wav)

### Actual E measurements

48 kHz mono PCM16, **47.107229 s**, 2261147 samples. SHA256 **`ebfe0bd3b3d730e9668a89638cea3677f12716a7132b9bb14cd4fdbd42148a0f`**. Analysis-only loudness **-15.92 LUFS / -1.51 dBTP / 2.30 LU LRA**. Actual E 10 ms RMS >=-40 dBFS envelope **0.170–46.840 s**, span **46.670 s**, active windows 34.670 s. Quiet/low-energy portions are not all reusable silence.

Untrimmed audio + reference 3 s ending hold = **50.107229 s**. This is **0.757229 s** beyond the former 49.35 s sensitivity reference, within the channel 40–60 s target. The user's selected slower pace supersedes the earlier pace projection. No compression or padding to that reference. Film owns the final hold/reaction placement; retain acceleration, settling ellipsis and late braking reversal.

### Qualified transformed anchors

These are **R1 audio-relative line/beat/gap estimates divided by0.97**, rounded to nearest30fps audio frame. Actual output duration/RMS/loudness were measured independently; these semantic anchors were **not re-aligned or newly measured on E**. R1 ASR uncertainty approximately ±0.1–0.2 s becomes ~±0.103–0.206 s, **plus unquantified local atempo mapping error**. Do not treat these as frame-exact phoneme or authored shot boundaries. Film must check actual E near each event before integer timing lock.

| Anchor | Estimated onset (s) | Audio-relative frame |
| --- | --- | --- |
| L01 / B01 | 0.105091 | f3 |
| L04 / B02 | 11.840851 | f355 |
| L06 / B03 | 16.557173 | f497 |
| L09 / B04 | 28.564411 | f857 |
| L11 / B05 | 36.572272 | f1097 |

JSON retains every L01–L13, beat, answer span and gap with the same transformed-estimate limitation. No fresh ASR/pronunciation certification; original0.939 character alignment and unmatched substitutions remain historical R1 evidence. Human listening priorities remain L02 helium/tether wording, L05 force question and L09 constant speed/settling.

### Reproduction and preservation

```sh
ffmpeg -hide_banner -loglevel error -nostdin -i out/voice/edu-ep20-r1/kore-full-selected-x0.9975.wav \
  -af atempo=0.97 -ar 48000 -ac 1 -c:a pcm_s16le out/voice/edu-ep20-r1/kore-full-selected-E-slower3.wav
```

Durable prefix `projects/edu/EDU/narration/edu-ep20-r1/`: E WAV/settings, `voice-measure-r2.json`, and preserved R1 `voice-measure-r1-preserved.json`/`.md`. Prior D, normalized base and raw Gemini source remain unchanged. No runtime/composition/public audio or video/still render in this pass. No jobs remain running.

Next owner: coordinator presents full E for listening, records approval separately, then Film uses the qualified measured read for timing. Coordinator owns task/delivery/handoff/context-map updates.

## Historical R1 report (superseded timing; retained provenance)

### Original R1 report

- Revision: **EDU-EP20-VOICE-MEASURE-R1**, Editor, 2026-11-16. Deliverable **EDU-EP20-SHORT**, channel `edu`, Short only, channel-default.
- Inputs: **EDU-EP20-SCRIPT-R1** (L01–L13 unchanged), **FACT-R1**, **HOOK-R1**, **TIMING-R3**, **BOARD-R1**, **DELIVERY-R2**. W2.3 publication and user-selected D authorize this first full read. Source checkout `c420a2cf7d96f5aa7a3a63c5c744a7dc7c75603b` plus concurrent working changes; no shared runtime or Film files edited.
- Result: **one continuous Gemini call succeeded**, exact `Kore`, model `gemini-3.8-flash-tts`, style `warm, friendly, smiling storyteller, speaking rapidly`, then **atempo=0.9975**. No new audition, retry, retune, tail replacement, content cut, silence insertion or timeline integration. The script helper's fallback key was explicitly disabled for this call.
- Approval boundary: the setting is user-picked; this **full take is not user-approved**. Objective energy/timing evidence is complete. Whisper provides semantic alignment estimates; pronunciation and exact phoneme onsets still need listening. No voice-lock acceptance, visual evidence, final mix or delivery claim is implied.

## Audio and preservation

[Selected full narration](/Users/mangkornkatawong/ReelsStore/projects/edu/EDU/narration/edu-ep20-r1/kore-full-selected-x0.9975.wav) · [normalized base](/Users/mangkornkatawong/ReelsStore/projects/edu/EDU/narration/edu-ep20-r1/kore-full-base.wav) · [unaltered API source](/Users/mangkornkatawong/ReelsStore/projects/edu/EDU/narration/edu-ep20-r1/gemini-source-raw.wav).

All durable media/settings/alignment/reproduction evidence are stored once under `$REELS_STORE/projects/edu/EDU/narration/edu-ep20-r1/`. Local generated cache: `out/voice/edu-ep20-r1/`; no MP3/amplitude or public timeline dependency authored yet. The selected WAV is 48 kHz mono PCM16, **45.706604 s**, 2193917 samples. Selected measured loudness: **−15.97 LUFS**, **−1.50 dBTP**, **1.70 LU LRA** (ffmpeg loudnorm analysis only; no further audio rewrite).

| Artifact | SHA-256 |
| --- | --- |
| Selected `kore-full-selected-x0.9975.wav` | `9839d787e154f2fa98fe365e658e2a3b348ebc26bad91f9372a7040d7b17055f` |
| Normalized base `kore-full-base.wav` | `bc2436c53a35b7a10be7479cb044284513c643079ae99835d9dccb4413f7b775` |
| API source `gemini-source-raw.wav` | `7cbdf7af47146cfb0f243b3f876a3a5f7f40ea7d14af556295e9eb52f4a07196` |
| [narration.txt](narration.txt) | `71bd60a2cab5390504133dc201a301c3fd8e52dbda1eba8a76a2380d058441ca` |

Gemini raw cache key **f0d13294169b6bf7** did not exist before this call. One API request created it. The exact TTS input is committed as `narration.txt`; it joins all 13 narration rows with spaces and normalizes `...`/`…` to commas only. No stage direction or closing hold was spoken. Full settings and hashes: [voice-measure.json](voice-measure.json).

## Timing and actual story space

10 ms RMS windows at −40 dBFS locate first/last energy at **0.180–45.440 s**, speech-envelope span **45.260 s**, leading silence **0.180 s**, tail **0.266604 s**. Above-threshold windows total **33.160 s**; the remaining **12.100 s inside that envelope includes both pauses and low-energy phonemes** and is not a bank of reusable silence. Per-sample peak ≥300/32767 gives the wider line envelopes below; this distinct threshold captures quiet edges and is intentionally not conflated with the RMS projection measure.

- **Zero extra gaps + 3 s final hold: 48.706604 s untrimmed**, within the 49.35 s reference by **0.643396 s**. A hold starting at the actual speech end can overlap existing tail silence; Film owns that placement.
- RMS-envelope-only sensitivity plus 3 s is **48.260 s**, but no leading/tail trim is authored. The file is preserved whole.
- The R3 3–5 s model is **not automatically added** to the real read. Existing cadence/reaction gaps are listed below. If Film needs a further 3–5 s beyond those already retained, total becomes **51.706604–53.706604 s** (2.356604–4.356604 s over the 49.35 s reference), requiring an owner decision before any retune/trim. No mandatory missing story space has been established by this measurement pass.
- First forward payment L04 energy onset **11.485625 s**, **23.58%** of the untrimmed+hold reference length. Air explanation L06–L07 **6.745042 s**; settled-speed answer L09–L10 **7.329104 s**; braking answer L12–L13 **4.237146 s**. All answer spans are below 10 s. B03 includes the next question L08 and must not be counted wholly as explanation.

## Audio-relative anchor handoff

Frames below use **30 fps**, nearest integer (`round(seconds × 30)`). They refer to the **continuous selected WAV from sample zero**, not composition-global time, authored shot cuts or a Film timing sheet. A later authored audio offset moves all anchors together. Alignment: `scripts/narration/align-full.py`, cached `large-v3-turbo` CPU int8, **566/603** normalized TTS characters matched (**0.939**), **13 inside-phrase matches, zero fallbacks**. ASR word times are approximately ±0.1–0.2 s estimates, not native WordBoundary events. Energy envelopes use ASR-associated line partitions separated at nearby real quiet gaps. Their numerical samples are measured; semantic identification/phoneme precision remains unvalidated until listening.

| Beat | Anchor | Energy onset / audio frame | ASR onset estimate |
| --- | --- | --- | --- |
| `EDU-EP20-SHORT-S01-B01` | L01 | 0.101938 s / **f3** | 0.000 s |
| `EDU-EP20-SHORT-S01-B02` | L04 | 11.485625 s / **f345** | 11.420 s |
| `EDU-EP20-SHORT-S01-B03` | L06 | 16.060458 s / **f482** | 15.960 s |
| `EDU-EP20-SHORT-S01-B04` | L09 | 27.707479 s / **f831** | 27.640 s |
| `EDU-EP20-SHORT-S01-B05` | L11 | 35.475104 s / **f1064** | 35.400 s |

| Line | ASR on–end estimate (s) | Measured peak-energy envelope (s) | Audio onset frame |
| --- | --- | --- | --- |
| L01 | 0.000–2.060 | 0.101938–2.205792 | f3 |
| L02 | 2.480–6.020 | 2.472250–6.070083 | f74 |
| L03 | 6.380–10.900 | 6.220458–10.992792 | f187 |
| L04 | 11.420–13.480 | 11.485625–13.185333 | f345 |
| L05 | 13.480–15.640 | 13.567250–15.761583 | f407 |
| L06 | 15.960–20.380 | 16.060458–20.536313 | f482 |
| L07 | 20.560–22.760 | 20.638500–22.805500 | f619 |
| L08 | 23.100–27.180 | 22.985563–27.254604 | f690 |
| L09 | 27.640–32.080 | 27.707479–32.142146 | f831 |
| L10 | 32.080–35.040 | 32.232021–35.036583 | f967 |
| L11 | 35.400–41.060 | 35.475104–40.997375 | f1064 |
| L12 | 41.200–42.740 | 41.205417–43.033375 | f1236 |
| L13 | 43.020–45.260 | 43.126312–45.442563 | f1294 |

## Existing inter-line gaps

These are detected quiet intervals using 10 ms peak windows <300/32767, nearest the ASR inter-line midpoint within ±0.4 s, at least 60 ms wide. They are measurement candidates for Film's reaction/cut decisions, not authored edits or physical settling durations. The L11→L12 anticipatory gap is only 0.20 s; Film should assess whether that existing space supports the intended prediction before requesting extra time. L09 still contains the spoken waiting condition; picture must show an unspecified story-time ellipsis rather than treat its duration as measured settling.

| Between | Quiet interval (s) | Duration (s) |
| --- | --- | --- |
| L01 → L02 | 2.21–2.47 | 0.26 |
| L02 → L03 | 6.08–6.22 | 0.14 |
| L03 → L04 | 11.00–11.48 | 0.48 |
| L04 → L05 | 13.19–13.56 | 0.37 |
| L05 → L06 | 15.77–16.06 | 0.29 |
| L06 → L07 | 20.54–20.63 | 0.09 |
| L07 → L08 | 22.81–22.98 | 0.17 |
| L08 → L09 | 27.26–27.70 | 0.44 |
| L09 → L10 | 32.15–32.23 | 0.08 |
| L10 → L11 | 35.04–35.47 | 0.43 |
| L11 → L12 | 41.00–41.20 | 0.20 |
| L12 → L13 | 43.04–43.12 | 0.08 |

## Checks and reproduction

- Exact narration input verified against all L01–L13 after only ellipsis normalization; all line/beat onsets monotonic; all answer spans <10 s. Decode, duration, SHA-256 and loudness checks passed.
- ASR comparison leaves **37 of 603 expected Unicode characters unmatched**; insertions are additional and excluded from that count. Differences cluster in repeated `ลูกโป่ง` variants, `ฮีเลียม/ฮีเรียม`, `เชือกไว้/เชียกไป`, `เบาะ/บ่อ`, `ไม่มี/มิมี`, `มัน/บัน`, `อะไร/ว่าไล`, `ลอย/รอย`, `ค้าง/ครั้ง`, `คงที่/ของที่`, `หยุดแกว่ง/อยู่ดกว่าง`, and `ท้าย/ทาย`. These resemble phonetic ASR substitutions; calling them merely spelling differences would overstate certainty. All lines have aligned material, with no complete-line omission detected. **Every spoken word is not certified.** Listen especially to L02's low-tether wording, L05's force question, and L09's constant-speed/waiting qualification. No definite audible omission has been established and no regeneration was attempted. Full character-level opcodes are preserved in store `asr-differences.json`.
- Reproduction uses the existing Gemini venv `/Users/mangkornkatawong/Developer/reels-creator/out/gemini-venv/bin/python` and Whisper venv `/Users/mangkornkatawong/Developer/reels-creator/.venv-whisper/bin/python`; no installation. Cached reruns reuse the exact raw take; do not request a fresh take to reproduce it.

```sh
env -u GEMINI_API_KEY_REEL_EXTRA <gemini-venv>/bin/python -I scripts/gemini-tts.py say \
  --voice Kore --style 'warm, friendly, smiling storyteller, speaking rapidly' \
  --text-file scripts/edu-series/ep20/short/narration.txt --timeout 180 \
  out/voice/edu-ep20-r1/kore-full-base.wav
ffmpeg -hide_banner -loglevel error -y -i out/voice/edu-ep20-r1/kore-full-base.wav \
  -af atempo=0.9975 -ar 48000 -ac 1 out/voice/edu-ep20-r1/kore-full-selected-x0.9975.wav
```

The store prefix includes `alignment-input.json`, `tts-beats.json` and `alignment-anchors.md` (measurement-only inputs, **not runtime timeline/Film sheets**), `alignment-whisper.json`, `measurement-segments/whisper-words.json`, `energy-measure.json`, settings sidecars, logs and `finish-measure.py`. For exact local analysis reproduction run `align-full.py` with those explicit inputs as recorded in the generation session, then `python3 -I out/voice/edu-ep20-r1/finish-measure.py`; the reproduction script generates the core JSON before the documented raw-source/loudness summary fields are appended. Segment WAVs are measurement artifacts; the only selected performance is the unchanged continuous full WAV.

No runtime/composition change or video/still render occurred. Package/API, visual samples, mix/SFX, final-cut rendering and caption QA are N/A for this narrowly assigned narration-measure pass. Coordinator owns task/delivery/context-map registration and contribution bookkeeping. No jobs remain running.

Next owner: coordinator presents the selected full take for listening; Film uses the qualified audio-relative measures and existing gaps to write integer sheets after resolving any pronunciation/boundary listening notes. Preserve front-lean early payment, the later settled interval and braking-only late reversal.
