# HANAKO-SHORT voice lock: measure note (voice lock v3, S3 tail re-read)

**Status:** `audio-measured` for `HANAKO-SHORT-SCRIPT-R2` (Editor, 31 Oct 2026). Voice lock v3 is S3 take 1 for B01–B04 and KA, plus the S3 tail re-read for B05–B09. The user said "use it as the new lock" (31 Oct 2026). It replaces voice lock v2 (S3 take 1), kept under `out/hanako-voice/final/lock-v2-s3take1/` (restore list in its `manifest.sha256`). The ×1.133 hushed lock stays under `lock-v1-hushed/`. Machine file: [voice-measure.json](voice-measure.json) (integer frames, 30 fps). Retime for Mark: [retime-r2-to-r3.md](retime-r2-to-r3.md). **Not heard by the agent:** every check below is a Whisper, energy, pitch or loudness proxy. The ear check is open (see Open items).

## Final narration

| Item | Value |
| --- | --- |
| Engine / model | Gemini TTS, `gemini-3.8-flash-tts` ([gemini-tts skill](../../../.agents/skills/gemini-tts/SKILL.md#narration-one-narrator)) |
| Voice | `Charon` |
| Style (exact) | `calm documentary mystery narrator, crisp clear articulation of every word, brisk steady pace, low resonant voice, not whispered` (S3; user choice 31 Oct 2026) |
| Reads | B01–B04 and KA: take 1 (whole read, unchanged since v2). B05–B09: tail re-read, one request, same voice and style (`out/hanako-voice/final/s3-tail-reread/`) |
| Pace | `ffmpeg -af atempo=1.05` on each read (pitch preserved), 48 kHz mono. Lengths: take 1 raw 85.880 s; tail re-read raw 57.680 s, ×1.05 54.943 s |
| Level | one linear gain of +1.20 dB on the 16-bit clips, measured on the un-gained track, clipping refused (`finish-tail.py`) |
| Track | `public/narration/HANAKO-SHORT.mp3` + `.amplitude.json` (MP3 gitignored). 82.033 s, 2461 frames. −16.0 LUFS integrated, LRA 4.2 LU, sample peak −0.5 dBFS (ebur128) |
| TTS input | take 1: `out/hanako-voice/final/tts-input.txt` (sha256 prefix `743066655166dc4a`). Tail: `tail-text.txt` = B05–B09 of `tts-beats.json` joined with one space (sha256 prefix `7cad8221ec29a011`). Same rules: `…` at beat ends is a sentence end, `…` inside beats is a comma, `1948`, `1990`, `80`, `90` spelled, «ค่ะ» removed from B02 (the reply is a separate clip) |
| Reply | `KA-T1` (Leda), unchanged, raw (no pace change) |

Numerals: `1948` → หนึ่งพันเก้าร้อยสี่สิบแปด, `1990` → หนึ่งพันเก้าร้อยเก้าสิบ, `80` → แปดสิบ, `90` → เก้าสิบ. Subtitles keep digits.

## Reads

| Check | Take 1 (B01–B04, KA; v2 lock) | Tail re-read (B05–B09; v3) |
| --- | --- | --- |
| Raw read | 85.880 s | 57.680 s (one request, no retry) |
| Align match (difflib on Whisper words) | 0.833 (709/851) | 0.862 (517/600) |
| Anchor fallbacks | `B07-a3` | `B06-a2`, `B07-a3` |
| Cut-gaps | 8 of 8 boundaries in real gaps | B05\|B06 cut moved from 10.315 s to 9.220 s when anchor `B06-a0` was added (the first pass cut inside «เรื่องฮานาโกะที่»). VERIFY passed after the fix |
| F0 median, opening B01–B04 → late B07–B09 | 102.3 → 127.1 Hz (+24.2 %) in v2 | 102.3 → 108.7 Hz (**+6.2 %**) in v3 |
| Decision | take 1 locked in v2 | **Locked in v3** (user, 31 Oct 2026) |

Take 2 (the earlier S3 retake) stays under `out/hanako-voice/final/s3-take2/`, not built.

## Beat measure (track frames, 30 fps; timeline = track + 45 frames pre-roll)

| Beat | Slot start (track) | Slot frames | Speech on–off (track) | Speech frames | Timeline on–off |
| --- | ---: | ---: | ---: | ---: | ---: |
| B01 | 0 | 259 | 1–252 | 251 | 46–297 |
| B02 | 259 | 112 | 260–364 | 104 | 305–409 |
| KA («ค่ะ» reply) | 371 | 27 | 372–391 | 19 | 417–436 |
| B03 | 398 | 202 | 399–593 | 194 | 444–638 |
| B04 | 600 | 255 | 601–848 | 247 | 646–893 |
| B05 | 855 | 272 | 858–1125 | 267 | 903–1170 |
| B06 | 1127 | 416 | 1128–1536 | 408 | 1173–1581 |
| B07 | 1543 | 466 | 1544–2002 | 458 | 1589–2047 |
| B08 | 2009 | 248 | 2010–2250 | 240 | 2055–2295 |
| B09 | 2257 | 204 | 2258–2460 | 202 | 2303–2505 |

- Written pauses: 9 gaps. Eight of them are 8 frames. `B04|B05` is **10** and `B05|B06` is **3** (0.10 s). Total 69 frames (2.300 s). Were 72 in v2.
- Narrator speech 2371 frames (79.033 s); reply 19 frames (0.633 s). Track = lead-in 1 + speech 2390 incl. reply + written pauses 69 + 1 trailing frame = 2461.
- Anchors: 32 rows in [voice-measure.json](voice-measure.json), Whisper word estimates (about ±0.2 s). Use the beat speech on/off as the reliable timing, and the amplitude file for word cues.

## Measure basis (changed in v3)

- **Edges are measured on the delivered MP3**, not on the clips. Inside each beat's slot: the first and last decoded 48 kHz sample with |x| ≥ 300 of 32767 (the builder's threshold). Frame = round(sample / 1600); the end is the last sample + 1.
- **Why B05 changed.** The +1.20 dB gain moved one clip head. The first sample ≥ 300 in the B05 clip went from clip sample 11878 to 8100. The assembler trims (first − head) samples, so the whole B05 clip sits 2.361 frames later in the track than the build measure. Its onset moves 856 → 858. Its tail crosses 300 later (1120 → 1125). B05 anchors move by the same 2.361 frames (rounded). No other beat moves (shifts below 0.01 frame). `measure_vs_build` in the JSON lists the one difference.
- **Onset check:** every beat's installed onset is within 0.4 frames of its build onset plus its clip-head shift. KA: installed 372, PCM onset 371.6.
- The measure is written by [write-measure.py](../../../out/hanako-voice/final/write-measure.py) (path-parametrised; see Reproduce). The shared `scripts/narration/*` tools are not changed.

## Timeline (against the 90 s cap)

| Part | Frames | Seconds |
| --- | ---: | ---: |
| Knock pre-roll (SFX at frame 0, VO starts after it) | 45 | 1.5 |
| Narration track (lead-in 1, speech 2390 incl. reply, written pauses 69, tail 1) | 2461 | 82.033 |
| `B_loop` hold after B09 speech (room tone, no VO) | 90 | 3.0 |
| **Total** | **2596** | **86.533** |

Cap 90 s: **86.53 s, 3.47 s under** (the cap counts the whole timeline). Estimate only: the composition is not built, so the rendered length is not proven until a render.

Compared with v2: track 2417 → 2461 (+44), timeline 2552 (85.07 s) → 2596 frames (86.53 s), hold [2462, 2552) → [2506, 2596). Beat-by-beat table: [retime-r2-to-r3.md](retime-r2-to-r3.md).

## Reply («ค่ะ»)

- `KA-T1` (Leda, unchanged). Not regenerated.
- ASR check: Whisper returns «ข้า» for KA-T1 and KA-T2 (near-homophones with «ค่ะ»). No pass. Use the ear.
- Distance effect (quiet, low-pass, reverb): not applied (no documented recipe).

## QA (proxies only, not listening)

| Check | v2 (take 1 lock) | v3 (this lock) |
| --- | ---: | ---: |
| Align match (align-full) | 0.833 | 0.833 (B01–B04, KA); 0.862 (B05–B09). Two reads, not one number |
| Anchor fallbacks | `B07-a3` | `B06-a2`, `B07-a3` |
| Loudness, integrated / LRA / sample peak | −16.8 LUFS / 4.3 LU / −1.7 dBFS | **−16.0 LUFS / 4.2 LU / −0.5 dBFS** |
| Max decoded sample | 26804 | 30880 (−0.5 dBFS). No sample ≥ 32000: no clipping |
| File end | — | See the end-of-file check below |

**Per-beat isolated-clip Whisper ratio** (`clip-asr.py`; difflib on normalised text). B01–B04 and KA from take 1 (unchanged clips). B05–B09 from the tail re-read:

| Beat | B01 | B02 | B03 | B04 | B05 | B06 | B07 | B08 | B09 | mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| v2 | 0.81 | 1.00 | 0.96 | 0.91 | 0.90 | 0.82 | 0.83 | 0.95 | 0.88 | 0.896 |
| v3 | 0.81 | 1.00 | 0.96 | 0.91 | 0.99 | 0.88 | 0.84 | 0.89 | 0.87 | 0.906 |

Single takes, one ASR model: treat each difference under about 0.05 as noise.

**Names** (fuzzy best window of the heard text, 1.0 = exact; no exact match in any read):

| Name | Where | v2 | v3 |
| --- | --- | ---: | ---: |
| «ฮานาโกะซัง» | B01, B03, B08 | 0.67 / 0.67 / 0.56 | 0.67 / 0.67 / 0.67 |
| «อิวาเตะ» | B06 | 0.92 | 0.92 |

The name is garbled in every read (for example «ฮนโกสัง»). B08 is read from the tail re-read in v3; the 0.56 in v2 came from take 1. Whisper cannot judge the Thai name; the ear decides.

**F0 and drift** (`beat-drift.py`, voice-match metrics, same method for both reads):

| Hz | B01 | B02 | B03 | B04 | B05 | B06 | B07 | B08 | B09 | Opening (B01–B04) → late (B07–B09) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| v2 | 106 | 107 | 100 | 96 | 120 | 108 | 141 | 126 | 114 | 102.3 → 127.1 (**+24.2 %**) |
| v3 | 106 | 107 | 100 | 96 | 117 | 113 | 123 | 108 | 96 | 102.3 → 108.7 (**+6.2 %**) |

The late climb in v2 is gone. B05 (117 Hz) and B07 (123 Hz) still sit above the opening; the ear decides whether the read still sounds "low resonant".

**B09 speech-off check** (the v2 lock had a residual; re-measured on the delivered audio):

| Rule (track frame of the last speech edge) | v2 lock | v3 |
| --- | ---: | ---: |
| 300 threshold (the build rule) | 2417 | 2460 |
| Energy, 10 ms blocks, −45 dBFS | 2410 | 2460 |
| Energy, 10 ms blocks, −50 dBFS | 2410 | 2460 |

In v2 the 300 rule was **7 frames late**. One block at 80.56 s (peak 353, RMS −48 dBFS, 11 samples ≥ 300) came after 0.25 s of quiet. The user's note said +8; the re-measure gives +7. In v3 the three rules agree at 2460: the track ends in the decay of «เคาะ» (about 82.00 s), not in residual.

**End of file** (click check): after the final decay (−48 dBFS block at 82.00 s) the level falls to −55…−63 dBFS. The last 150 samples step by at most 8 LSB. The last sample is +22 LSB (≈ −63 dBFS). No click found. The −40 dBFS point in the report is the decay of the last syllable, not a cut. **No fade applied.**

**Amplitude file:** 2461 frames; identical to a recomputation from the MP3 (max difference 0.0). It is the assembler's output (`scripts/narration/assemble-narration.py`) for the same clips.

**Other edge rules (for the owner, not applied):** on the same decoded audio the energy rules differ from the 300 rule on soft onsets (B07 +7 frames, B08 +11 at −45 dBFS) and on quiet final consonants (B05 end 1098 at −45 dBFS, 17 frames before the Whisper word end of «ต้นเรื่อง» at 1115). The 300 rule is kept.

## Listen for (by ear)

Track seconds (the MP3 file; the timeline adds 1.5 s of pre-roll):

1. **Late pitch rise (reduced, +6.2 %).** Compare B01–B02 (0–12 s) with B07 (51.5–66.7 s) and B08–B09 (67.0–82.0 s). Does the voice get higher and brighter late in the read?
2. **The seam B04 → B05 → B06.** Pause 10 frames at 28.3–28.6 s. The B05 tail (decay of «ต้นเรื่อง») then a 3-frame pause at 37.5–37.6 s before B06. Does the join between the two reads sound continuous (same voice, same pace)? Does the 3-frame pause sound cut?
3. **«ฮานาโกะซัง»** in B01 (0–8.4 s), B03 (13.3–19.8 s) and B08 (67.0–75.0 s). Does it come out clearly or as «ฮนโกสัง» / «ฮานาโกะ»?
4. **«อิวาเตะ»** in B06 (anchor `B06-a1` at about 40.0 s).
5. **Spelled numerals** in B06 («หนึ่งพันเก้าร้อยสี่สิบแปด», about 42.0–44.3 s; fallback anchor) and B07 («หนึ่งพันเก้าร้อยเก้าสิบ», about 58.8 s; fallback anchor). Do they read as numbers in a sentence?
6. **Pace and mood:** the brisk steady pace should not sound rushed. The 0.5 s pause before «ยกมือขึ้นเคาะ» (80.7–81.2 s) should sound like a deliberate beat.
7. **Reply «ค่ะ»** at 12.4–13.0 s: KA-T1 is unchanged. Judge it by ear.
8. **File end (82.0 s):** the last syllable should decay into the room tone with no click.

## Reproduce

Inputs and builders in `out/hanako-voice/final/` and `out/hanako-voice/final/s3-tail-reread/` (ignored). `<main>` is the main checkout (`/Users/mangkornkatawong/Documents/ChatGPT/Reels Creator`), which holds `.venv-whisper` (the worktree does not have one). Take 1 commands are in the v2 note under `lock-v2-s3take1/voice-measure.md`.

```
out/gemini-venv/bin/python -I scripts/gemini-tts.py say --voice Charon --style "calm documentary mystery narrator, crisp clear articulation of every word, brisk steady pace, low resonant voice, not whispered" --text-file out/hanako-voice/final/s3-tail-reread/tail-text.txt --timeout 180 out/hanako-voice/final/s3-tail-reread/tail-raw.wav
ffmpeg -y -i tail-raw.wav -filter:a atempo=1.05 -ar 48000 -ac 1 tail-x105.wav          # in s3-tail-reread/
<main>/.venv-whisper/bin/python -I scripts/narration/align-full.py --full tail-x105.wav --tts-beats tail-tts-beats.json --timeline tail-timeline.json --index tail-anchors.md --segments segments-align --out measure-tail-align.json
python3 -I scripts/narration/cut-gaps.py --full tail-x105.wav --measure measure-tail-cut.json --segments segments-cut --prev measure-tail-align-v0.json
<main>/.venv-whisper/bin/python -I out/hanako-voice/final/beat-drift.py --full tail-x105.wav --segments segments-new --tts-beats out/hanako-voice/final/tts-beats.json --out drift-tail.json
<main>/.venv-whisper/bin/python -I out/hanako-voice/final/clip-asr.py --segments segments-new --json clip-asr-tail.json
# the tail steps below run from out/hanako-voice/final/s3-tail-reread/ (the paths are relative to it)
python3 -I build-tail-track.py --segments segments-new --measure-take1 ../measure-take1.json --measure-tail measure-tail-cut.json --out-dir build-tail
python3 -I finish-tail.py --track-dir build-tail/track --out-dir sample --tag HANAKO-SHORT-tail        # +1.20 dB
python3 -I out/hanako-voice/final/write-measure.py --track-measure out/hanako-voice/final/s3-tail-reread/build-tail/track-measure.json --slots out/hanako-voice/final/s3-tail-reread/build-tail/track/slots.json --pcm-clips out/hanako-voice/final/s3-tail-reread/build-tail/track --installed-clips out/hanako-voice/final/s3-tail-reread/sample/HANAKO-SHORT-tail-track --mp3 public/narration/HANAKO-SHORT.mp3 --amplitude public/narration/HANAKO-SHORT.amplitude.json --anchors out/hanako-voice/final/anchors.md --align-take1 out/hanako-voice/final/measure-take1.json --align-tail out/hanako-voice/final/s3-tail-reread/measure-tail-align.json --asr-take1 out/hanako-voice/final/clip-asr-s3.json --asr-tail out/hanako-voice/final/s3-tail-reread/clip-asr-tail.json --drift-take1 out/hanako-voice/final/drift-s3.json --drift-tail out/hanako-voice/final/s3-tail-reread/drift-tail.json --tail-beats B05,B06,B07,B08,B09 --fallbacks B06-a2,B07-a3 --source narrator_read_raw_take1=out/hanako-voice/final/HANAKO-NARR-raw.wav --source narrator_tail_raw=out/hanako-voice/final/s3-tail-reread/tail-raw.wav --out scripts/hanako/short/voice-measure.json
```

Installed MP3: the sample file is byte-identical to a reassembly of `sample/HANAKO-SHORT-tail-track` with `scripts/narration/assemble-narration.py` (sha256 prefix `ed3a339f`). Its amplitude file is identical to the reassembly's (sha256 prefix `fdfe80f9`). Logs: `out/logs/hanako-voice-v3-*.log`.

## Limits

- No listening. Whisper output for the Thai names is noisy in every read.
- One ASR model, one take per read. Differences under about 0.05 are noise.
- The F0 metric is autocorrelation on voiced frames. It does not hear quality or timbre.
- The measure uses the 300 threshold on the decoded MP3. Other rules disagree on soft onsets and quiet endings (numbers above).
- The B05 onset and offset are measured on the installed audio; the B05|B06 pause (3 frames) is an edge measure of a decay, not a designed silence.
- Anchor timing is ±0.2 s. Two anchors are fallbacks (`B06-a2`, `B07-a3`).

## Open items

- **User ear check (required):** the lock as installed. Late pitch (+6.2 %), the join at B05 → B06 (37.5 s), the 3-frame and 10-frame pauses, the name, the reply, the file end. Nothing here is approved by ear.
- **Scene sheet:** `SCENE-R2` is still on the v2 timing (durationFrames 2552). Mark issues `SCENE-R3` from this measure and [retime-r2-to-r3.md](retime-r2-to-r3.md). This run did not edit the scene sheet.
- «ฮานาโกะซัง» reads 0.67 in every read; «อิวาเตะ» 0.92; the reply «ค่ะ» passes no ASR take (near-homophone).
- Anchor fallbacks `B06-a2` and `B07-a3`: word cues there should come from the amplitude file.
- `ค.ศ.` marker on the years (Preaw wording): not added.
- Music, ambience and SFX: not part of this lock (narration and room-tone hold only).
- Composition ID: `HANAKO-SHORT` is provisional; no `src/videos/hanako/` exists yet.
- Git: `public/narration/` is untracked. The MP3 is ignored by the `*.mp3` rule. The `.amplitude.json` is not ignored, so whether to commit it is open (not decided here).
