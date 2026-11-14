# EDU-EP16/17/18 voice take R22 (Editor, 2026-11-14)

Scripts R2.2 (`ep16|17|18/script.md`, `locked-pending-user`, Boat-rechecked). Narrator **Kore** x1.05 (user pick, 13-14 Nov 2026), same method as [R2.1](voice-take-r21.md): one continuous read per episode (NAR lines only, leading `…` dropped, other `…` sent as `,`, lines joined by a space; texts in `out/voice/ep16-18-r22/ep16.txt ep17.txt ep18.txt`), style "warm, friendly, smiling storyteller, speaking rapidly", then `atempo=1.05`; loudness -16 LUFS per `gemini-tts.py`. EP18 L07-L08b are inside the continuous read. Not user-approved takes.

## Durations and estimated finished length

Estimate = N1 method ([EP16 N1](script.md#n1)) rebuilt on the real read: lead 0.25 s; narration lines at their measured durations; gaps between two narration lines as measured in the read; every boundary next to a character line or W-beat +0.2 s; V03 overlapping the end of V02 (EP16) by 0.3 s; character clips measured; W-beats as planned (W-RIVER 2.5 incl. V09, W-HEN 1.0, W-RAIN 1.5, W-DUSK 1.0, W-PRED 3.0, W-PHONE 1.5, W-SHOP 1.2, W-KITCHEN 1.2); hen cluck 0.6 s (placeholder, Ton's sound decides); end hold 2.0 s. Model in `out/voice/ep16-18-r22/est.py`.

| Episode | Narration (x1.05) | NAR syll | Syll/s (with pauses) | Character clips (sum) | Estimated finished | Script N1 est. | vs 60 s |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EP16 | **42.37 s** (R2.1 33.41) | 179 | 4.22 | 22.72 s: V01 2.08, V02 1.48, V03 1.08, V04 2.44, V05 1.76, V07 1.84, V08 2.32, V09 2.12, V10 3.60, + hen 0.6 | **63.4 s** | 60.6 (58-63) | +3.4 s, just above the script's own range |
| EP17 | **40.80 s** (R2.1 32.06) | 172 | 4.22 | 13.76 s: V01 1.80, V02 2.28, V03 1.80, V04 2.36, V05 2.52, + L10 whisper 2.40 | **60.5 s** (59.0 with the normal-voice L10 0.86 s) | 60.0 (58-63) | +0.5 s, on target |
| EP18 | **39.97 s** (R2.1 35.70) | 166 | 4.15 | 13.56 s: V01 2.48, V02 3.12, V04 2.72, V05 2.04, + hen 0.6 | **56.9 s** | 58.0 (56-61) | -3.1 s, in range, a little short |

Whole-video numbers are estimates, not a render; voice lock plus Film's picture decide. New character takes (Leda boy, Gacrux grandma, one call each): EP16 V07 1.84 s, V08 2.32, V09 2.12, V10 3.60; EP17 V05 2.52; EP18 V04 2.72 (grandma), V05 2.04.

## Line timing (seconds in the x1.05 narration WAV; ±0.15 s: silence gaps of 0.3 s or more at -30 dB, checked against Whisper with and without the script as prompt; not a cut list, run `scripts/narration/cut-gaps.py` before cutting)

### EP16 (`ep16_narration_kore_x1.05.wav`, 42.37 s)

| Line | Start | End | Dur |
| --- | --- | --- | --- |
| L01 | 0.32 | 3.19 | 2.87 |
| L02 | 3.74 | 7.11 | 3.37 |
| L03 | 7.58 | 10.09 | 2.51 |
| L04 | 10.63 | 12.62 | 1.99 |
| L05 | 13.11 | 16.93 | 3.82 |
| L06 | 17.46 | 19.43 | 1.97 |
| L06b | 19.86 | 21.87 | 2.01 |
| L07 | 22.64 | 25.85 | 3.21 |
| L07b | 26.57 | 28.93 | 2.36 |
| L08 | 29.28 | 31.32 | 2.04 |
| L09 | 32.10 | 36.34 | 4.24 |
| L10 | 36.75 | 40.05 | 3.30 |
| L11 | 40.42 | 42.05 | 1.63 |

### EP17 (`ep17_narration_kore_x1.05.wav`, 40.80 s)

| Line | Start | End | Dur |
| --- | --- | --- | --- |
| L01 | 0.36 | 3.20 | 2.84 |
| L02 | 3.46 | 7.83 | 4.37 |
| L02b | 8.20 | 11.39 | 3.19 |
| L03 | 11.85 | 15.31 | 3.46 |
| L04 | 15.65 | 17.26 | 1.61 |
| L05 | 17.61 | 22.24 | 4.63 |
| L06 | 22.72 | 26.51 | 3.79 |
| L06b | 26.85 | 29.12 | 2.27 |
| L07 | 29.65 | 31.67 | 2.02 |
| L08 | 32.23 | 36.24 | 4.01 |
| L09 | 36.72 | 39.36 | 2.64 |
| L10 (normal voice, in the read) | 39.67 | 40.53 | 0.86 |

L10 whisper take unchanged from R2.1: `chars/ep17_L10_whisper_kore.wav`, 2.40 s.

### EP18 (`ep18_narration_kore_x1.05.wav`, 39.97 s)

| Line | Start | End | Dur |
| --- | --- | --- | --- |
| L01 | 0.26 | 3.49 | 3.23 |
| L02 | 3.81 | 7.23 | 3.42 |
| L03 | 7.61 | 11.29 | 3.68 |
| L03b | 11.57 | 12.72 | 1.15 |
| L04 | 13.20 | 16.83 | 3.63 |
| L05 | 17.34 | 19.86 | 2.52 |
| L06 | 20.24 | 23.23 | 2.99 |
| L06b | 23.65 | 26.23 | 2.58 |
| L07 | 26.70 | 30.62 | 3.92 |
| L08 | 31.03 | 31.63 | 0.60 |
| L08b | 32.10 | 35.08 | 2.98 |
| L09 | 35.58 | 39.66 | 4.08 |

## EP18 OQ4 (ER09, limit about 10 s)

- L07 onset 26.70 s to L09 onset 35.58 s = **8.88 s** (L07 3.92, gap 0.41, L08 0.60, gap 0.47, L08b 2.98, gap 0.50). Margin to 10 s: **1120 ms** (R2.1 read: 8.68 s; +0.20 s). Script model 9.2 s; the read is 0.32 s shorter.
- Counting W-KITCHEN (1.2 s picture) in front: **10.08 s**, 80 ms over the limit (R2.1: 9.9 s). The script counts ER09 from L07, so this passes; if Film counts the W-KITCHEN picture it is at the limit with no slack, so keep the read's own gaps and add no air between L07, L08, L08b and L09. Resolution of the line edges is about ±0.1 s.
- Present in the read: L07 recognised unprompted as "น้ำต้มสุก 1 l น้ำตาล 6 ช้อนชาปาด เกลือครึ่งช้อนชาปาด": both numbers (1 litre, 6 teaspoons) and both "ปาด" are there; L08 "ค่อย ๆ จิบนะ", L08b and L09 present.

## Issues and retime levers (no script edited)

1. **EP16 runs about 3.4 s long (63.4 s vs 60 s; script range 58-63).** The new lines read slower than the model: V10 is 3.60 s (model about 2.5 s), and the narration is 42.37 s (R2.1 33.41 s, +8.96 s for +22 syllables and two extra beats). Script "if long" order: T1 cut V10 (-3.8 s with its gap, lands 59.6 s) or, kinder to the gag, a faster V10 re-take of about 2.3 s (-1.3 s) then T2 cut "ไม่เอานะ" from L09 (-0.6 s) and T3 merge W-HEN under L10 (-1.2 s) = about 60.3 s. Editor recommendation: re-take V10 faster first (the whisper-heard double-take costs 1.1 s over model), then T3, then T2; T1 only if the user prefers a cut over a re-take. Raising atempo from 1.05 to 1.08 would take about 1.2 s off the narration (the user chose 1.05, not changed).
2. **EP17 lands 60.5 s with the whisper L10;** nothing long. "If short" levers unused.
3. **EP18 lands 56.9 s,** 3.1 s under 60: "if short" lets W-PHONE and W-SHOP breathe (+0.5 s each) and the end hold grow; never add air inside the OQ4 window.
4. No line is individually long: the longest are EP16 L09 4.24 s (about 24 syllables), EP17 L05 4.63 s (26 syllables, the T1 candidate "อย่างกับมีงานบุญทุกวัน" would save about 1.5 s), EP18 L09 4.08 s.
5. **Listen first (ear):** Whisper (noisy on Thai, proves presence and order only) misheard the new takes: EP16 V10 as "ค่อยเป็นดินาสาวล่ะ" (the double-take "ไก่… เป็นไดโนเสาร์เหรอ?", the longest clip), V08 as "เข้าในยุงก็มีนี่" (ข้าว), EP17 V05 as "ไม่นี่ป่า มีเต็มไปหมด", EP18 V04 as "บอกแล้วว่าจะกินน้ำดีบ", EP18 V05 as "ก็มิ่งสัยออก" (ใส); V07 and V09 matched. The R2.1 flagged takes (EP16 V03, EP17 V03, EP18 V02) are unchanged and still need the same ear check.
6. Whisper with the script text as prompt found every narration line in order in all three reads. Silence analysis: leading silence 0.18-0.36 s, trailing 0.27-0.32 s, no clipped start or end; word-level clip detection not done.

## Files

- Work folder (ignored): `out/voice/ep16-18-r22/` (`raw/` raw reads, `chars/` new takes, text inputs `ep16.txt ep17.txt ep18.txt`, tools `wh.py wh2.py wh3.py runs.py dips.py est.py`, `whisper.json`, `whisper3.json`).
- Clean copies: `out/voice/ep16-18-r22/send/` (3 narration WAVs, 7 new character takes, 12 unchanged R2.1 character takes copied in for convenience).
- Asset store (kind=voice, project EDU): `~/ReelsStore/projects/edu/EDU/voice/`. The R2.1 files kept the plain names, so the R2.2 narrations are filed with a hash suffix: `ep16_narration_kore_x1.05.b56a7013.wav`, `ep17_narration_kore_x1.05.3f4b801b.wav`, `ep18_narration_kore_x1.05.5bfff882.wav`; raw reads `raw/ep1{6,7,8}_nar_raw.{8cf68c32,0d724aa2,be886c8a}.wav`; new takes `chars/ep16_V0{7,8,9}_boy.wav`, `chars/ep16_V10_boy.wav`, `chars/ep17_V05_boy.wav`, `chars/ep18_V04_grandma.wav`, `chars/ep18_V05_boy.wav`.
- Reproduce: `out/gemini-venv/bin/python -I scripts/gemini-tts.py say --voice Kore --style "warm, friendly, smiling storyteller, speaking rapidly" --text-file out/voice/ep16-18-r22/ep16.txt raw.wav`, then `ffmpeg -af atempo=1.05`. New take styles (Leda boy "a ten-year-old boy, ..."): V07 smug and pleased with his idea; V08 triumphant, sure he has found the answer; V09 outraged, shouting in alarm; V10 slow wide-eyed double-take, amazed, half whispering; EP17 V05 clever, thinks he has won the argument; EP18 V05 sheepish and weak, faint and tired. EP18 V04 (Gacrux): "a worried elderly Thai grandmother, scolding and worried at once, cross on the first words then soft and tender at the end". API calls used: 3 narration + 7 character = 10 (no 429, no retries). The venv is in the main checkout (`~/Developer/reels-creator/out/gemini-venv`); this worktree has none.
