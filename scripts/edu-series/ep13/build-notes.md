# EDU-EP13-SHORT build notes (Editor)

## W5.3 draft v2, 2026-11-09 (SHEETS-R2.1, 1542 f, uncommitted over 29c1bf5)

**Rebuilt for R2.1 / script R5 / Take B:** `narration-place.py` (NAR r5b-B-slow10, cuts 5.58/9.97/35.20 snapped to 5.545/9.995/35.255, shifts +10/+26/+72/+90, V01 G321, V02 G1143) -> `public/narration/EDU-EP13-SHORT-narration-v2.wav`; `sound-mix.py` (all 51 cue frames + segments re-timed, tag dropped, S24 settle tone added at G1463 quiet with -6 dB duck over 80 ms from G1474, M1 fades 1433-1463, riser last 1.37 s ss 2.32, TR7 echo 1.07 s, room tone back at 1192 and fading 1477 -> 1541) -> `public/audio/edu/EDU-EP13-SHORT-draft-stem-v2.wav`; `cues.ts` re-derived (31 cues, voiced runs of the v2 narration; L03/L05 "ดีด" text; L12 b split at the word G1226; L02 c ends on the SH05 cut G317); `index.ts` guard 1542. v1 files kept: narration/stem `-v1.wav`, v1 draft at `out/EDU-EP13-SHORT/draft-v1/`.

**Findings**
1. **S24 level:** peak -27 dBFS (about room-tone RMS). Row `B05 accent peak 6..24` reads dV 24.7 (warn, inside tolerance).
2. **FAIL `B05 accent peak -6..3` (V03 dog sigh G1474-1510): dV 11.9** after raising the sigh to peak -5 dBFS with 10 dB tanh drive (was dV 19.5 at -8 dBFS). The file is a quiet breath; no safe level reaches 3 dV. Goes to Ton via fixlist: a denser/louder sigh file or a relaxed row (like the sub-0.5 s accent warns of v1). Logs `out/logs/edu13-levels-v2.log`.
3. Other mix-levels: no FAIL; warns B03 bed 21.4 (hush), B04 background 14.5 (target 15), accent peaks B01 4.6, B03 5.3, B04 4.7 (short transients, `drive`). `sound-cues.py`: 52 cues, 0 FAIL. `exempt` in sound-cues.json renamed to the v2 stem (mechanical).
4. **Room tone fade:** sheet table says "1403 -> zero at 1541", the cue note says "fade 1476-1542"; built as hold to 1477 (sigh + 3 f), then linear to zero at 1541. Film to confirm.
5. **est anchors (PL05, +-3 f)**, measured on the placed narration by 5 ms energy: deepest dip / steepest rise within +-6 f (`out/logs/edu13-est-anchors.txt`). Within +-3 f by the steepest rise: สูงกว่า +1.5, หลายสิบเท่า +2.0, คุณ(L01) +0.2, ข้ามตึก -1.2, ดีด 0.0, ก็จริง -1.0, หนัก -1.9, ไม่ได้สูงขึ้นตาม +0.5, กล้าม 0.0, ดันพื้น +0.8, สูงกว่า(L13) +0.9. **Beyond 3 f (no key moved, Boss shots unchanged, back to Film/Boss per PL05):** ได้มั้ย -3.7, หลักสิบเซน +4.3, แบกเป้ -4.0, บีบ -5.6, เหมือนหนังสติ๊ก +5.3, หนังสติ๊ก +5.4, หมัดยักษ์ -4.8, เซน -4.4, เล็กมาก +5.4. Energy rises can be a syllable inside the word, so these need listening before a key moves. The caption cues use the same words (L09 b/c split at G874).
6. **Captions:** edu stroke, no band; caption-zone luma thresholds fail on every frame (they were set for non-stroke captions); judged by crops (`out/EDU-EP13-SHORT/qa2/crops/caps-v2.png`): shots 5 (G168), 7 (G270, over the flea body), 9 (G397/G1440) legible. "แรงดีด ↑" label pops at G397, full by G402, legible (`labels2-v2.png`).
7. **Runtime checks:** cross-correlation of the draft's decoded audio with narration+stem: lag 0 samples, r 0.9997; loudness -14.1 LUFS, -1.5 dBTP; seek parity: 6 frames rendered in a second order vs first, PSNR 75-81 dB; `npm test` 621/621. Draft render 195 s (16/16 scenes, half size); a second pass after the L02 c trim re-rendered 1 scene.

**Open:** mix and the full v2 read not heard; est anchors above; sigh row FAIL; room-fade reading.

## W5.3 draft, 2026-11-09 (SHEETS-R2.0, uncommitted over 829d86e)

**Built:** composition `EDU-EP13-SHORT` (`src/videos/edu-ep13/index.ts`, `cues.ts`), plates `EDU13-<shot id>` (`src/painted/shots/edu13.tsx`, registered in `src/painted/registry.ts`), narration (`narration-place.py`), sound stems (`sound-mix.py`). 16 scenes = 16 shots, 1390 f. Store copies: `projects/edu/EDU/voice/EDU-EP13-SHORT/` (locked read, placed narration, MAN V01/V02) and `audio/` (stem).

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

## Ending reversal, 2026-11-10 (user: "do it like ep02")
After hearing the closing melody the user chose the ep02 ending: `stinger_pizz-tag-ending_01` (library, 2.5 s, rings out) replaces `S24-closing-melody` (and the earlier `S24-settle`, SD08 of 2026-11-09 is reversed at the user's instruction). Mechanical mix change, narration untouched.
- `sound-cues.json`: cue `tag-ending` at G1463 (end of "เล็กมาก"); B05 accent level rows re-labelled (tag before the sigh, sigh = button with the tag ducked -6 dB, tag ring-out); closing-melody tail rows gone; V03 sigh (G1474) and room fade unchanged.
- `sound-mix.py`: `tag` at HIT (-2 dBFS peak), fout 0.4 s, ducked -6 dB over 80 ms from G1474; M1 final segment now ends under the tag (-12 dB from G1463, out by G1480) instead of fading to silence by G1463. Tag ring-out is below -40 dB by G1540 and finishes inside the 1542 f (no cut).
- `assets.lock.json`: closing-melody and settle-tone entries removed (nothing else uses them); files stay in the library. Tag entry already locked.
- Checks: `sound-cues.py` 52 cues 0 FAIL; `mix-levels.py` 0 FAIL (B05 accent tag dV -1.7, sigh -2.8, tail 16.5; B05 background 17.6), log `out/logs/mix-levels-tag.txt`; `npm test` 621 pass. Draft render -14.0 LUFS, -1.5 dBTP.
- Open: nobody has listened. Tag at HIT may be loud next to the quiet sigh (by number the sigh sits 1.1 LU under it); Film/user to judge.
