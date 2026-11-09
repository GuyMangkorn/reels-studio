# EDU-EP13-SHORT build notes (Editor)

## W5.3 draft, 2026-11-09 (SHEETS-R2.0, uncommitted over 829d86e)

**Built:** composition `EDU-EP13-SHORT` (`src/videos/edu-ep13/index.ts`, `cues.ts`), plates `EDU13-<shot id>` (`src/painted/shots/edu13.tsx`, registered in `src/painted/registry.ts`), narration (`narration-place.py`), sound stems (`sound-mix.py`). 16 scenes = 16 shots, 1390 f. Store copies: `projects/EDU-EP13-SHORT/voice/` (locked read, placed narration, MAN V01/V02) and `audio/` (stem).

**Findings**
1. **QA band removed at the owner:** `Painted` (look.tsx) draws the dashed caption band only when `qaBand.on`; `shots-index.ts` and `look-index.ts` set it, compositions never do. Boss to confirm (minimal change, no shot component touched).
2. **Plates:** Boss components own a BrushCanvas and read `useCurrentFrame()`; each plate mounts one in a `Sequence from=<G start>` inside the PaintedStage overlay (plate `paint` is a no-op, nested canvas as in edu11). Stills at G frames match the scene-local frames.
3. **Mix vs levels (Ton to measure; Editor ran `mix-levels.py` as a self-check, logs `out/logs/mix-levels-v11.txt`):** no FAIL. Warns: B01 bg 14.2 (target 15), B03 bg 14.7 and bed 22.8 (hush by design), B04 bg 14.2, accent peaks B01 4.5, B03 4.2, B04 4.6 (target max 3, within the 3 LU tolerance). Cause: 0.19-0.4 s accents (S8, S16, S19) cannot reach the voice's 400 ms momentary level at a safe peak; they are tanh-driven (`drive` in sound-mix.py) to near -2 dBFS. Ton may want longer files or a relaxed accent row for sub-0.5 s cues.
4. **mix-levels.py bug:** a stem with exact digital zero makes ffmpeg ebur128 print `nan` momentary values; the script's regex drops them and every later step shifts (the first runs showed false `silent` rows). Workaround: +-1 LSB dither on the measuring stems. Fix belongs to the script owner.
5. **S16 snap on the word "ปล่อย"** (G763 on L09) plus voice peaked at 1.14 FS; a peak guard turns the accent alone down (min gain 0.52) so voice + stem stay under 0.97.
6. **V01 take** opens with 0.33 s of breath noise before "เฮ้ย" (onset G292); the first 0.30 s is attenuated 20 dB so S8 (G286) sits in a gap and the speech mask does not count it. Caption starts at the "เฮ้ย" onset (G291), not the slot start.
7. **sound-cues.json** (Ton's file) got two mechanical edits: `sources` gains `scripts/edu-series/ep13/sound-mix.py` (so the baked stem is checked) and `exempt` names the baked stem file. `python3 -I scripts/sound-cues.py` passes (52 cues).
8. **Whisper broken** here (`scripts/transcribe.py`: faster-whisper vs installed `av`, `metadata_errors` TypeError), so `est` anchors were checked by voiced-run starts only (see `measure.json` `placed_w53`); all within 2 f.
9. **Loudness:** `render.mjs` normalised the draft to -14.0 LUFS, -1.5 dBTP (was -15.9, -3.2); 0 clipped samples on the decoded track.
10. Caption cue `L12 b` ("แค่หลักสิบเซน ไม่ใช่ร้อยเมตร") shows from G1068 as one cue; "ไม่ใช่ร้อยเมตร" is spoken at G1098, so the second line is visible 30 f early. Split if Film wants it on the word.

**Open:** Thai words per `est` list unmeasured inside runs; full read not heard by the user; mix not listened (levels by number).
