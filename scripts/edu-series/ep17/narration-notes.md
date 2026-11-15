# EDU-EP17-SHORT narration notes (Editor, W4 voice lock)

## Step 1: NARR pace sample (2026-11-15), awaiting the user's pick

- Script: R1.2.1 (script.md L01-L03). Voice Kore, style "warm, friendly, smiling storyteller, speaking rapidly" ([channel voice](../../../channels/edu/channel.md#voice)). One API call, one take, no retry.
- TTS text (one read, the "…" in L01 as a comma, L03 "เก้าสิบเก้าเปอร์เซ็นต์" as written): `วิดีโอคอลหาคนต่างประเทศ, เสียงคุณแทบไม่ได้ขึ้นดาวเทียมนะ มันวิ่งไปตามสายที่นอนอยู่ก้นทะเล เน็ตข้ามประเทศ ราว ๆ เก้าสิบเก้าเปอร์เซ็นต์ ไปทางนี้` (42 syllables by the script: 18 + 10 + 14).
- Command: `~/Developer/reels-creator/out/gemini-venv/bin/python -I scripts/gemini-tts.py say --voice Kore --style "<style>" --text "<text>" out/ep17-narr/ep17-nar-kore-sample-raw.wav` (this worktree has no venv; the main checkout's was used). x1.08 and x1.15 are `ffmpeg -af atempo=P` of that one raw take.
- Store (projects/edu/EDU/audio/): `2026-11-15_ep17-nar-kore-sample-raw.wav`, `-x1.08.wav`, `-x1.15.wav` (raw has its .json sidecar).

| File | File length | Speech span | Syllables/s over the span |
| --- | --- | --- | --- |
| raw | 8.96 s | 0.288-8.586 = 8.30 s | 5.06 |
| x1.08 | 8.30 s | 0.266-7.942 = 7.68 s | 5.47 |
| x1.15 | 7.80 s | 0.246-7.466 = 7.22 s | 5.82 |

Pauses: only one gap over 0.15 s registers at -40 dB (0.19 s at 6.01 s raw, before L03); the L01 comma pause is shorter, so the real pauses are tight.
Next (after the user picks 1.08 or 1.15): full read of L01-L16 in one call, then the V01-V03 man voices, then the length check ([voice lock](../../../docs/delivery-workflow.md#voice-lock)). Note: store audio dated 2026-11-11 named `ep17-nar-kore-warm-fullread-r2-*` belongs to the earlier, reverted EP17; not used here.

## Step 1b: NARR pace sample, pause re-take (2026-11-15), awaiting the user's pick

- User picked "re-read, adjust the pause rhythm" after sample 1. One API call (call 2 of the voice; no retry): same voice and style, TTS text with `<short pause>` after "ต่างประเทศ" (the "…") and between L01/L02 and L02/L03: `วิดีโอคอลหาคนต่างประเทศ <short pause> เสียงคุณแทบไม่ได้ขึ้นดาวเทียมนะ <short pause> มันวิ่งไปตามสายที่นอนอยู่ก้นทะเล <short pause> เน็ตข้ามประเทศ ราว ๆ เก้าสิบเก้าเปอร์เซ็นต์ ไปทางนี้`.
- Finding: the tag barely changed the breaths (energy gaps at -25 dB: sample 1 0.26/0.25/0.37 s, raw take 2 0.31/0.26/0.36 s) and slowed the read (4.72 syl/s raw vs 5.06).
- Deterministic fix (local, no API, [skill step 4](../../../.agents/skills/gemini-tts/SKILL.md#narration-one-narrator)): silence inserted at the middle of each of the three gaps so each is 0.45 s raw, then atempo. Files `sample2p-*`; `sample2-raw` is the untouched take.
- Store (projects/edu/EDU/audio/, prefix `2026-11-15_ep17-nar-kore-`): `sample2-raw.wav`, `sample2p-raw.wav`, `sample2p-x1.08.wav` (9.26 s), `sample2p-x1.15.wav` (8.69 s).
- Gaps at -25 dB, d>=0.12 s (x1.08 / x1.15): L01 "…" 0.41 / 0.39 s at 1.67 / 1.57 s; L01-L02 0.41 / 0.38 s at 3.70 / 3.48 s; L02-L03 0.40 / 0.39 s at 5.77 / 5.41 s. Other gaps are word-internal (0.12-0.14 s).
- Pace over the speech span, pauses included: x1.08 4.87 syl/s, x1.15 5.18 syl/s; below the 5.5 / 5.9 target because take 2 was slower and the pauses now sit inside the span. Without the added silence: 5.10 / 5.43. Reaching target would need atempo about 1.22 / 1.30 (not tried; distorts). Decision for the user: accept the slower pace with these pauses, or one more take.

## Step 2: full read, V01-V03, sister laugh, length check (2026-11-15, Editor W4), not listened

- User decisions (2026-11-15): narrator Kore, style "warm, friendly, smiling storyteller, speaking rapidly", atempo **1.05** on the whole NAR read, pauses as sample 1b (about 0.4 s on every script "..." and between lines), short silences.
- NAR: one API call (call 3 of the voice; no retry), TTS text `ep17-nar-tts.txt` (16 NAR rows L01-L07, L09, L10, L12-L15, L17-L19; the ellipsis as a comma, L14 "2024" as "สองพันยี่สิบสี่", spaces between lines, no tags: sample 1's base, because the tag take in 1b was slower). Raw take 55.28 s.
- Pauses: `scripts/edu-series/ep17/narration-pauses.py` sets each of the 26 pauses (11 ellipses + 15 line boundaries) to 0.40 s raw: short gaps get silence at the middle, long ones lose their middle (0.2 s kept each side), 8 ms fades. The L04 ellipsis had no real gap (a shallow dip at 10.28 s), so 0.40 s is inserted inside the dip. Then `ffmpeg -af atempo=1.05` (pause = 0.381 s in the file). Gap positions: silencedetect -25 dB, classified by position and checked with faster-whisper word times (rough: Thai word times garble; the PyAV in the main venv needs the audio passed as an array).
- Files (store projects/edu/EDU/audio/, prefix `2026-11-15_ep17-`): `nar-kore-fullread-raw.wav`, `nar-kore-fullread-paused-raw.wav` (56.50 s), `nar-kore-fullread-x1.05.wav` (**53.82 s, the read**), `nar-pause-map.json`, `nar-tts.txt`, `nar-lines.txt`.
- MAN V01-V03: Algenib (project default adult male), one call each (3 calls), `char-v01-algenib.wav` (2.04 s file; voiced 0.15-0.45 "ห๊ะ" + 1.07-1.79 "ใต้ทะเล?", a 0.62 s gap inside), `char-v02-algenib.wav` (1.72 s; voiced 0.30-1.41), `char-v03-algenib.wav` (0.88 s; voiced 0.29-0.88). Styles in the sidecars. All normalised to -16 LUFS by the tool; trim to the voiced span in the mix.
- Sister laugh (B06, storyboard line 268: "sister's laugh through the phone speaker"): Aoede, `<laugh> ฮ่า ฮ่า`, one call (`sister-laugh-aoede.wav`, 2.16 s; voiced 0.26-1.05 and 1.65-1.87). The small-speaker filter is a mix job (W5). Total API calls today for this voice: 7 (2 samples + 1 NAR + 3 V + 1 laugh).
- Length check: NAR file 53.82 s (speech 0.22-53.55 s), against the estimate 53.9 s at 1.08. Video implied about 59.9 s with no padding, about 60-61 s with breathing room at the V edges: at or just above the 60 s top of the 54-60 s window, inside the 5 % rule. Measure file: `measure.json` (line onsets, ends, ellipsis and boundary pauses in the x1.05 file).
- Script note: the script counts 10 "..." pauses; the TTS text has 11 (L01, L04, L05, L07, L10, L12, L13, L14, L15, L18, L19). Script row L15 mentions are as R1.2.1. No line read badly in the text; unverified by ear.
- Status: NOT LISTENED by the Editor. The user listens and approves; nothing is committed or locked.

## Step 3: voice re-lock to NAR candidate B (2026-11-15, Editor W4 redo), not listened

- The user picked candidate B (`2026-11-15_ep17-nar-v2-B-fullread-x1.05.wav`, 50.256 s; same prompt/Kore/atempo 1.05, no pause surgery; raw `...v2-B-fullread-raw.wav` + sidecar). It supersedes the v1 lock (53.82 s). No new API call.
- Measure: [measure-v2.py](measure-v2.py) -> [measure-v2.json](measure-v2.json) (silencedetect -25 dB / 0.10 s, 35 gaps mapped to the 26 pause slots by syllable-count position plus whisper words). The natural gaps are 0.125-0.62 s (v1: 0.381 s each); the L04 ellipsis has no gap (as in v1); L01|L02 is the shortest (0.125 s, above the 0.12 s floor).
- Placement v2: [narration-place.py](narration-place.py) keeps the v1 slot gaps (V01, W-SKY, V02, V03, B05-SH05) and fills every extension with crossfaded room tone from the cut gap; lead and tail the same. Output `public/narration/EDU-EP17-SHORT-narration-v2.wav` (generated; 1709 f = 56.967 s).
- Status: NOT LISTENED by the Editor. Film retimes the sheets from `placement_proposal` in measure-v2.json.
