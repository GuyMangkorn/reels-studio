# EP20 — short Kore audition and calibration

Coordinator final voice-lock record, 2026-11-16: user explicitly approved the complete47.107229 s E take with “ใช้เสียงเต็มนี้ต่อ”. W4.3 complete; E pace and full take are locked. Script approval remains unchanged. Use VOICE-MEASURE-R2 with its qualified anchors; Film owns the subsequent picture timing.

- Revision: **EDU-EP20-VOICE-AUDITION-R1**, Editor, 2026-11-16.
- Deliverable: EDU-EP20-SHORT; channel `edu`; [delivery](delivery.md) EDU-EP20-DELIVERY-R2.
- Inputs: [script](short/script.md) EDU-EP20-SCRIPT-R1, [review](short/fact-check.md) EDU-EP20-FACT-R1, [Hook Guide](hook-guide.md) EDU-EP20-HOOK-R1. No narration wording or factual claim changed.
- Status: four ≤10 s pace candidates derived from **one short read**. User explicitly selected **D/0.9975** with **"เอาอันนี้แหละที่ช้าลงอีก 5%"**, replacing C/1.05 on 2026-11-16. SCRIPT-R1 approval remains separate. No full narration generated; no completed W4 voice lock or audio-measured timeline is claimed. Pending-choice statements below are historical preparation notes.

## Sample contract

Voice `Kore`; model `gemini-3.8-flash-tts`; exact channel style `warm, friendly, smiling storyteller, speaking rapidly`. The unchanged opening L01–L02 is 27 estimated spoken syllables (9 + 18, matching Preaw's recount). The Gemini skill's ellipsis-to-comma substitution applies only in the TTS input:

> รถเร่ง,ลูกโป่งจะเอนไปทางไหน? เอาลูกโป่งฮีเลียมที่ลอยได้ ผูกเชือกไว้กับพื้นรถ แล้วปิดกระจก

The base read is normalized by `gemini-tts.py` to its −16 LUFS target, 48 kHz mono WAV; local ffmpeg atempo creates both candidates without additional API reads. Voice alone: Film/Ton have not supplied an approved music plan or cue sheet, so no bed was invented.

## Files and objective measurements

All paths below are relative to the asset store root `$REELS_STORE` (default `~/ReelsStore`). Local preview copies are under `out/samples/edu-ep20-voice-r1/`.

| Candidate | Store path | File duration | First–last energy | Span | Estimated gross rate |
| --- | --- | --- | --- | --- | --- |
| A — atempo 1.08 | `projects/edu/EDU/samples/edu-ep20-voice-r1/A_kore_x1.08.wav` | 5.486708 s | 0.210–5.190 s | 4.980 s | 5.4217 syllables/s |
| B — atempo 1.15 | `projects/edu/EDU/samples/edu-ep20-voice-r1/B_kore_x1.15.wav` | 5.159125 s | 0.180–4.870 s | 4.690 s | 5.7569 syllables/s |
| Source, not a third choice | `projects/edu/EDU/samples/edu-ep20-voice-r1/kore-base.wav` | 5.920000 s | 0.210–5.590 s | 5.380 s | 5.0186 syllables/s |

Measurement method: 10 ms RMS windows, energy threshold −40 dBFS, rate = 27 estimated syllables / first-to-last-energy span. The measured span includes internal cadence and pauses; adding those same pauses again would double count them. Sum of above-threshold windows is A 4.080 s, B 3.870 s and source 4.370 s; these are **not** phonetic articulation durations, because quiet/unvoiced consonants can fall below threshold. Boundary precision is approximately one analysis window, not word alignment.

Each candidate has a `.json` settings sidecar. `measurements.json` records duration, threshold, windows, spans and WAV SHA256 values. All three WAVs were archived with `store.py archive`; sidecars and measurements were then filed with `store.py import` at the same store prefix. The shared `manifest.tsv` records their source checkout/commit and hashes. Generation log: `out/logs/edu-ep20-voice-audition-r1.log`.

The source read's cache key is `1ab2a31a5c851266`. No regeneration or candidate sweep was run. Agent review is objective file/energy measurement only: pronunciation, timbre and listening preference remain for the user. Short-sample calibration is an estimate for script projection, not a guarantee of full-read cadence. Preaw owns the conditional full-script calculation in [timing-projection.md](short/timing-projection.md).

## Reproduction

Use the existing Gemini venv (this checkout reused `/Users/mangkornkatawong/Developer/reels-creator/out/gemini-venv/bin/python`). A key is needed only if the raw cache is absent. Preserve the source read rather than generating another take to compare paces.

```sh
<gemini-venv>/bin/python -I scripts/gemini-tts.py say --voice Kore \
  --style 'warm, friendly, smiling storyteller, speaking rapidly' \
  --text 'รถเร่ง,ลูกโป่งจะเอนไปทางไหน? เอาลูกโป่งฮีเลียมที่ลอยได้ ผูกเชือกไว้กับพื้นรถ แล้วปิดกระจก' \
  --timeout 180 out/samples/edu-ep20-voice-r1/kore-base.wav
ffmpeg -hide_banner -loglevel error -y -i out/samples/edu-ep20-voice-r1/kore-base.wav \
  -af atempo=1.08 -ar 48000 -ac 1 out/samples/edu-ep20-voice-r1/A_kore_x1.08.wav
ffmpeg -hide_banner -loglevel error -y -i out/samples/edu-ep20-voice-r1/kore-base.wav \
  -af atempo=1.15 -ar 48000 -ac 1 out/samples/edu-ep20-voice-r1/B_kore_x1.15.wav
```

Next owner: coordinator presents A/B through the structured question, records the selected pace, then uses Preaw's same-setting projection for W1.4 before asking for explicit W1.5 script approval. A full read remains gated on the sample pick and W2.3 storyboard publication.

## Requested 1.05 variant — 2026-11-16

The user replied **“1.05 ให้หน่อย”** to the A/B pace question. Editor created **C — atempo 1.05** from the existing `kore-base.wav`, preserving the same Kore voice, style, text and take. This required no new Gemini/API call. The request establishes the target pace to audition; it does not approve the unheard result or SCRIPT-R1.

- Local preview: `out/samples/edu-ep20-voice-r1/C_kore_x1.05.wav`.
- Durable store: `projects/edu/EDU/samples/edu-ep20-voice-r1/C_kore_x1.05.wav`, plus `C_kore_x1.05.json` settings and the separately named `measurements-C-x1.05.json`. Original A/B/base artifacts and `measurements.json` were preserved.
- Duration **5.649229 s**; first–last energy **0.210–5.330 s**; span **5.120 s**; above-threshold windows **4.170 s**. The same 10 ms RMS / −40 dBFS method gives **27 / 5.12 = 5.2734375 syllables/s**. Existing `measure-sfx.py` decoding/dB helpers supplied the analysis; no new source module was introduced.
- Conditional application of Preaw's existing formula: **195 / 5.2734375 + 3–5 s additional editorial gaps + 3 s final hold = 42.9778–44.9778 s**, centre **43.9778 s**. This includes sampled ordinary cadence once; it is an estimate, not full-read measurement or new shot timing.
- WAV SHA-256: `f4cfb3d0084c89d8bbbd32c229d0f86de7e2142ca06c3d2a910b944d49408f95`. The ≤10 s cap passed. Archive added one new media file; settings/measurements import had zero conflicts. No full read or listening claim.

Reproduction (local transform only):

```sh
ffmpeg -hide_banner -loglevel error -y -i out/samples/edu-ep20-voice-r1/kore-base.wav \
  -af atempo=1.05 -ar 48000 -ac 1 out/samples/edu-ep20-voice-r1/C_kore_x1.05.wav
```

Next owner: coordinator presents C for the user's listening decision, then records the setting/projection before the separate W1.5 script decision. No full narration before the applicable sample and W2.3 gates.

Coordinator selection record, 2026-11-16: user answered the C listening question **"ใช้ 1.05 นี้"**. Use Kore with the unchanged channel style and atempo **1.05** for this episode. No repeat sample-choice question is needed. Next open decision is W1.5 explicit SCRIPT-R1 approval; first full read follows W2.3. No new media or API call was needed to record the choice.

## Requested 5% slower than C — 2026-11-16

User requested **"ลองช้าลง 5% ได้ไหม เสียง"** after selecting C/1.05. Interpret speed multiplicatively: **1.05 × 0.95 = 0.9975**, not 1.00. Editor derived **D — atempo 0.9975** directly from the original `kore-base.wav`; no API call, new text/style or full read. The previously selected C remains chosen until the user accepts this replacement audition; SCRIPT-R1 approval remains pending.

- Local preview: `out/samples/edu-ep20-voice-r1/D_kore_x0.9975.wav`.
- Durable store: `projects/edu/EDU/samples/edu-ep20-voice-r1/D_kore_x0.9975.wav`, with `D_kore_x0.9975.json` settings and `measurements-D-x0.9975.json`. Existing base/A/B/C evidence is preserved.
- File duration **5.924354 s**; first–last energy **0.210–5.600 s**; span **5.390 s**; above-threshold windows **4.400 s**. Same 10 ms RMS / −40 dBFS method gives **27 / 5.39 = 5.00927644 syllables/s**. Quiet consonants and internal pauses retain the same measurement limitations described above.
- Conditional existing-formula projection: **195 / 5.00927644 + 3–5 s additional gaps + 3 s final hold = 44.9278–46.9278 s**, centre **45.9278 s**. This is a projection for the requested audition, not a newly chosen setting, full-read measurement or integer shot timing.
- WAV SHA-256: `7f76859d4333e14d491d42392d4a1629a71c77bfc396427c02ec68f1fb486c73`. The ≤10 s cap passed. Archive/import completed with zero conflicts; no agent listening/pronunciation approval is claimed.

Reproduction (one local transform from the base):

```sh
ffmpeg -hide_banner -loglevel error -y -i out/samples/edu-ep20-voice-r1/kore-base.wav \
  -af atempo=0.9975 -ar 48000 -ac 1 out/samples/edu-ep20-voice-r1/D_kore_x0.9975.wav
```

Next owner: coordinator presents D for the new listening decision and updates the selected-setting projection only if the user accepts it. No full read before the applicable sample/script/storyboard gates.

Coordinator final sample-choice record, 2026-11-16: user accepted D with **"เอาอันนี้แหละที่ช้าลงอีก 5%"**. Use Kore, unchanged channel warm-smiling style, atempo **0.9975** (=1.05×0.95), original-base-derived D. The C choice is superseded. Selected-setting projection is **44.93–46.93 s**; W1.4 updated. Next open decision is W1.5 approval of SCRIPT-R1, followed by Film; first full read remains after W2.3. No further sample or API call was needed to record this choice.

## Requested a little slower than full D — 2026-11-16

User requested **"อยากช้ากว่านี้อีกนิดนึงได้มะ"** after hearing the first full read. Coordinator chose a small **3% relative slowdown** for audition **E**: relative atempo **0.97**, equivalent original-base atempo **0.967575** (=0.9975×0.97). This is a pending sample choice, not approval or a new full-track lock. SCRIPT-R1 approval remains valid; selected D and its complete measured take are preserved.

Editor derived only **L01–L02 from the actual full-read take**, source `out/voice/edu-ep20-r1/kore-full-selected-x0.9975.wav`, SHA256 `9839d787e154f2fa98fe365e658e2a3b348ebc26bad91f9372a7040d7b17055f`. Input interval **0–6.14 s** ends in the measured quiet interval **6.08–6.22 s**, after L02 peak-energy end **6.070083 s** and before L03 onset **6.220458 s** (VOICE-MEASURE-R1; semantic alignment remains approximate). Same Kore/style/take; pitch-preserving local tempo processing, **zero API calls**. This sample uses the actual full take rather than the earlier independent opening audition.

- Local: `out/samples/edu-ep20-voice-r1/E_kore_full-opening_slower3.wav` and `.json`.
- Durable: `projects/edu/EDU/samples/edu-ep20-voice-r1/E_kore_full-opening_slower3.wav` and `.json`.
- Measured duration **6.317979 s**, 303263 samples, 48 kHz mono PCM16; −40 dBFS/10 ms RMS first/last active windows **0.17–6.21 s**. SHA256 **4623cca86e77a3c652b9dde5ebde387c8d89da7a57200bcfe4efec955364cb05**. Human pronunciation/preference remains unvalidated.
- Reproduction filter: `atrim=start=0:end=6.14,asetpts=PTS-STARTPTS,atempo=0.97` applied to the selected full take. Trim precedes tempo so the complete two-line excerpt is retained. An initial output-limit test was rejected before presentation; the corrected E above is the only presented candidate. A rejected test was inadvertently archived at `projects/edu/EDU/samples/E_kore_full-opening_x0.967575.wav`; do not use it.

No full narration transformation, new timing lock, timeline edit or video render. Next owner: coordinator presents E for listening and records the user's choice before transforming the complete existing take and remeasuring. No background jobs remain.

Coordinator selection evidence / Editor application, 2026-11-16: user answered the E sample question **“ใช้ความเร็วนี้”**. E/relative0.97 (absolute equivalent0.967575) is now the selected pace, superseding D. Editor applied that exact transform to the complete existing D take, zero API calls, no trim/padding. Actual E full file **47.107229 s**; with reference3 s ending hold **50.107229 s**, within40–60 s target. Full E listening approval remains separate and pending. Durable file: `projects/edu/EDU/narration/edu-ep20-r1/kore-full-selected-E-slower3.wav`; current evidence [VOICE-MEASURE-R2](short/voice-measure.md).

## VOICE-R2 — new L13 samples (Editor, 16 Nov 2026)

User chose a new L13 (16 Nov 2026): "เพราะคราวนี้ อากาศด้านหน้ากลับดันแรงกว่าด้านหลังนั่นเอง" (TTS: `เพราะคราวนี้, อากาศด้านหน้า กลับดันแรงกว่าด้านหลัง นั่นเอง`). Kore, unchanged channel style, absolute atempo 0.967575 on the −16 LUFS base. Two Gemini API calls total (one per candidate). Samples only: no full read, no timeline or narration change, not approved. Store `projects/edu/EDU/samples/edu-ep20-voice-r2/` (sidecars hold settings, hashes, repro; `splice.py`, `env.py` alongside).

| Candidate | File | Duration | Loudness | SHA256 | L13 active (−40 dBFS) |
| --- | --- | --- | --- | --- | --- |
| A — fresh L12+L13 pair, one call (cache `77f260800303c081`) | `A_kore_L12-L13-fresh.wav` | 6.394854 s | −16.0 LUFS, −1.7 dBFS peak | `a88a855936af4be0e0643674214d8f6669e381415c0906378005c5be8cdca772` | 2.30–6.08 = **3.78 s** |
| B — locked-E L12 + fresh L13 (cache `e174b9b5a09fe36c`) | `B_kore_L12-locked-E+L13-fresh.wav` | 5.745188 s | −15.3 LUFS, −1.9 dBFS peak | `29ebdfe74c4f01746bfd62681cd6c0acfc8d313865b015f4006bffdcb7166806` | 2.11–5.59 = **3.48 s** |

B seam: E trimmed 42.3285–44.4010 s; seam at the quietest 1 ms in E's quiet 44.36–44.44 (L12 −50 dBFS tail end → L13 onset); fresh L13 enters at source 0.121 s so its onset lands 0.039 s after the seam, E's own spacing (L12 end → L13 onset gap 0.41 s at −40 dBFS kept). 3 ms edge fades. E's L12 segment is −14.2 LUFS, the fresh L13 −15.9 LUFS, equal to E's old L13 (−15.9), so no gain change.

Timing impact (old L13 in E 44.44–46.84 = 2.40 s; E tail after speech 0.267 s kept; SS-R4 rule total = ceil(end×30)+176): B → narration end 48.187 s = **G1445.6** (+32.4 f vs G1413.2), total **1622** f (54.07 s), or 144.4 f hold if total stays 1590. A (pair replaces L12+L13 from E's L12 onset 42.48) → end 48.617 s = **G1458.5** (+45.3 f), total **1635** f (54.50 s), or 131.5 f hold at 1590. Not yet listened; pronunciation unchecked.

Coordinator selection / Editor application, 16 Nov 2026: the user picked **B** (“B ต่อเข้าเทคที่ล็อก”). Editor built full narration **R2** by splicing the same fresh L13 into the complete locked E take at the B seam (E 44.4010 s, L13 source 0.121 s, 3 ms seam fades, no gain change, zero API calls). `splice.py` reproduced sample B bit-exactly first. Store `projects/edu/EDU/narration/edu-ep20-r2/kore-full-selected-E-L13r2.wav`: 48.073688 s, SHA256 `b6f8490d2af1ea5975ba612dc35cae308719a8296e1126189d441cdc5ce11d68`, −15.90 LUFS / −1.51 dBTP. Narration end G1442.2 and SS-R4 total 1619 f. The estimate above (G1445.6 / 1622) assumed E's longer tail. The full file, the seam and the L13 pronunciation have not been listened to by anyone. Measures: [VOICE-MEASURE-R3](short/voice-measure.md).
