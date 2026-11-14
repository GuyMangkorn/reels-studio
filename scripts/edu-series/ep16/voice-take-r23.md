# EDU-EP16/18 voice take R23 (Editor, 2026-11-14)

Patch on [R2.2](voice-take-r22.md) (Kore x1.05 and the character takes user-approved 14 Nov 2026; goal about 60 s per episode). Scripts unchanged (`script.md` text not edited). EP17: no change (60.5 s).

## Levers applied

| Episode | Lever | Change | Effect |
| --- | --- | --- | --- |
| EP16 | V10 re-take | "ไก่… เป็นไดโนเสาร์เหรอ?", Leda, style "a ten-year-old boy, quick surprised double-take, amazed, speaking fast"; one call, one take kept. File 2.52 s (speech 0.29-2.21 s; R2.2 take 3.60 s) | -1.08 s |
| EP16 | W-HEN under L10 | W-HEN picture (1.0 s) plays under the start of L10; no sequential beat or +0.2 s gaps; L09 to L10 gap is the read's own 0.41 s | -1.2 s |
| EP16 | cut "ไม่เอานะ" from L09 | Clean edit of the existing R2.2 narration, no re-read: removed 35.055-35.74 s (inside the 0.15 s breath after "ดิบ" to the 0.14 s breath before "เสี่ยง"), 12 ms triangle crossfade. L09 4.24 -> 3.54 s; narration 42.37 -> 41.67 s (-0.70 s); a 0.13 s breath now separates "ดิบ" and "เสี่ยง". Script line to change if Preaw wants the text to match: L09 becomes "ปลาในแม่น้ำ น่าจะหาง่ายสุด… แต่ก้อยปลาดิบ เสี่ยงพยาธิ" (subtitle must drop "ไม่เอานะ") | -0.70 s |
| EP18 | W-PHONE | 1.5 -> 2.0 s | +0.5 s |
| EP18 | W-SHOP | 1.2 -> 1.7 s | +0.5 s |
| EP18 | end hold | open, see below | |

## New estimated finished length (same N1 method as R2.2, script `out/voice/ep16-18-r23/est.py`)

| Episode | R2.2 | R2.3 | Note |
| --- | --- | --- | --- |
| EP16 | 63.4 s | **60.6 s** (hold 2.0 s) | L09 now 32.10-35.64, L10 from 36.05 in the new narration |
| EP17 | 60.5 s | **60.5 s** | unchanged |
| EP18 | 56.9 s | **57.9 s** with hold 2.0 s; **58.9 s** with hold 3.0 s; **59.9 s** with hold 4.0 s | the two +0.5 s levers give +1.0 s; "about 60" needs the end hold too |

Estimates, not a render.

## EP18 OQ4 (ER09, limit about 10 s)

Unchanged by R2.3. L07 onset 26.70 s to L09 onset 35.58 s = **8.88 s**, margin to 10 s **1.12 s**. W-PHONE and W-SHOP sit before L07; no air added between L07, L08, L08b and L09 (re-checked in est.py: L07 41.13 -> L09 50.01 = 8.88 s). Counting the W-KITCHEN picture in front: 10.08 s, as in R2.2 (not changed; W-KITCHEN stays 1.2 s).

## Checks and caveats

- Whisper is not installed in this session, so the V10 re-take and the L09 splice are verified by silence analysis only (dips at -35 dB: the breath after "ดิบ" is 0.13 s, speech continues into "เสี่ยง"; syllable pacing 0.21 s per syllable before and after the cut matches). **Ear check needed** on the V10 take (word "ไดโนเสาร์", "เหรอ?" rise) and the L09 splice ("...ก้อยปลาดิบ เสี่ยงพยาธิ").
- Cut points were chosen from energy dips; the removed 0.69 s is the "ไม่เอานะ" syllables (3 syllables at about 0.2 s plus half of each neighbouring breath).
- Timeline: EP16 lines after L09 move 0.70 s earlier in the narration WAV (L10 36.05-39.35, L11 39.72-41.35); earlier line timings are unchanged.

## Files

- Work folder (ignored): `out/voice/ep16-18-r23/` (`chars/ep16_V10_boy.{wav,json,log}`, `est.py`, `send/`).
- Clean copies: `out/voice/ep16-18-r23/send/`: new `ep16_narration_kore_x1.05.wav` (41.67 s) and `ep16_V10_boy.wav` (2.52 s); the other 20 files are the unchanged R2.2 set copied in (EP17 and EP18 narration, character takes).
- Asset store (kind voice, project EDU): `projects/edu/EDU/voice/ep16_narration_kore_x1.05_r23.wav`, `projects/edu/EDU/voice/chars/ep16_V10_boy_r23.wav`.
- Reproduce V10: `~/Developer/reels-creator/out/gemini-venv/bin/python -I scripts/gemini-tts.py say --voice Leda --style "a ten-year-old boy, quick surprised double-take, amazed, speaking fast" --text "ไก่… เป็นไดโนเสาร์เหรอ?" out.wav` (1 API call; model gemini-3.8-flash-tts; cached by `chars/ep16_V10_boy.json`).
- Reproduce the L09 cut: `ffmpeg -i out/voice/ep16-18-r22/ep16_narration_kore_x1.05.wav -filter_complex "[0]atrim=0:35.055,asetpts=PTS-STARTPTS[a];[0]atrim=35.74,asetpts=PTS-STARTPTS[b];[a][b]acrossfade=d=0.012:c1=tri:c2=tri" ep16_narration_kore_x1.05.wav`.

## User decision (14 Nov 2026)
Keep "ไม่เอานะ" in L09: R2.2 narration (42.37 s) is the EP16 narration; the L09 splice is NOT used. EP16 est ≈ 61.3 s (R2.3 levers 1+2 only). EP18 end hold stays 2 s (57.9 s).
