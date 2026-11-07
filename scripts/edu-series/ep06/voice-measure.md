# EDU-EP06-SHORT voice measure (W1.4 length check, measured 2026-11-07)

## Revision E (2026-11-07, user decision; Revision D kept below as history): L12 phrase "และให้มันเดินมาหาเอง" about 12 % slower

User request: the second half of L12 (`ไม่ใช่ทุกตัวจะตอบ… และให้มันเดินมาหาเอง`) should be a little slower. Only that phrase is slowed (extra 0.89); the rest of the read is Revision D.

- **Phrase located (measured; not aligned by ASR, not listened).** In the pre-slowdown source (`out/ep06-voice/slow92r13/splice.wav`) L12 is 32.70-35.29 s: run 1 32.70-33.70 (1.00 s, "ไม่ใช่ทุกตัวจะตอบ" 5 syllables), a 20 ms blip 33.78-33.80 (breath/click inside the pause), **comma pause to 34.11 (0.41 s, floor 18-38 dB rms)**, run 2 **34.11-35.29 (1.18 s)** = "และให้มันเดินมาหาเอง" 7 syllables (และ-ให้-มัน-เดิน-มา-หา-เอง); the onset is a hard rise (30 -> 55 -> 67 dB in 20 ms) and the end a ~0.14 s soft nasal tail (50 dB) into silence. Confidence: **high** (about 90 %): there is exactly one pause inside L12 and the two runs match 5 + 7 syllables at 5.0 and 5.9 syl/s; the only uncertainty is that the blip at 33.78 is not speech (it is 20 ms, 972 of 32767 peak, so it was left alone).
- **Method.** No second atempo: three pieces cut from the pre-slowdown source inside silence: [0, 34.09] and [35.31, end] at atempo 0.91675 (as D), and the phrase piece [34.08, 35.32] (1.24 s, 0.03 s silence either side) at atempo 0.91675 x 0.89 = **0.81591** (pitch preserved), joined with two 10 ms triangular acrossfades, then two-pass loudnorm -16 LUFS / TP -1.5 (linear; pass 1 -16.18 LUFS, pass 2 measured -16.04 I, LRA 2.2, TP -1.50). The same pipeline without the phrase change reproduces D's slowed file sample-exact (max diff 0), so the method is the D method. Work files `out/ep06-voice/slow92r13e/` (`slowE.wav`, `slowE-norm.wav`, `lines.json`, `shots.json`).
- **Cuts (measured, not listened):** both junctions are in silence (peak 143 / 60 of 32768 in the 75 ms / 60 ms around them, largest sample step 20 / 23 = noise floor), no new gap is created; the L12-L13 gap and the pause before the phrase are within 0.01 s of D. Whole-file largest step 27403 is ordinary speech. L01-L12 before the phrase are the same waveform as D (loudness gain differs by under 0.1 dB, max sample diff 54). **L13 is the same take but a separately tempo'd piece (different atempo phase), so its waveform is not bit-identical to D**; its runs are identical to D shifted +0.15 s (38.73-40.33, 40.46-42.14, 42.45-44.90, 45.25-45.70), length 6.97 s unchanged.
- **Phrase length:** D 37.20-38.48 = **1.28 s**; E 37.20-38.64 = **1.44 s** (x1.125; target x1.124). Phrase start unchanged (37.20), so the pause before it is unchanged.
- **Gaps:** comma pause before the phrase unchanged (D 36.86-37.20); L12 end to L13 start D 0.10 s, E 0.09 s.
- **Not listened:** nothing in this revision was heard by me; 12 % extra slowing on a 7-syllable phrase may sound drawn out or slightly smeared; for the user's ear on the A/B clips.
- Store: `projects/EDU/narration/ep06/2026-11-07_ep06-nar-kore-A-slow92-r13-e-fullread.wav` (+ `.json`), `lines/2026-11-07_ep06-nar-L12-kore-A-slow92-r13-e.wav` and `...-L13-...-r13-e.wav` (L13 re-cut because it moved +0.15 s; L01-L11 line files are unchanged and still valid), A/B clips `2026-11-07_ep06-nar-kore-A-slow92-r13-L12-D.wav` (2.92 s) and `2026-11-07_ep06-nar-kore-A-slow92-r13-e-L12-E.wav` (3.08 s), both cut from file start 35.62. `lines.json` / `shots.json` now hold Revision E; Revision D's are `lines-prev-D.json` / `shots-prev-D.json`. Gemini requests: 0.

### Lines (Revision E, positions in the slowed read, s; L01-L11 as D)

| Line | Start | End | Dur (s) | File start | File dur (s) |
| --- | --- | --- | --- | --- | --- |
| L11 | 31.58 | 35.60 | 4.02 | 31.52 | 4.11 |
| L12 | 35.67 | 38.66 | 2.99 | 35.62 | 3.08 |
| L13 | 38.73 | 45.70 | 6.97 | 38.68 | 7.09 |

- L12 end = D's 38.50 + the measured phrase-end shift 0.16 s; L13 = D + 0.15 (10 ms run grid; file +0.142 s long, 45.85 s).
- Speech alone **43.02 s** (D 42.86 s, +0.16). Re-gapped at 0.28 s (11 gaps) = **46.10 s NAR** (D 45.94 s).

### Shots (Revision E, 30 fps, 19 shots; `out/ep06-voice/slow/shots.py` with `lines.json` and sub-anchors 2.24, 2.24)

Only B05-SH02 and later changed; B01-B05-SH01 are identical to D.

| Shot | Start f | End f | Length f | Length s | D length f |
| --- | --- | --- | --- | --- | --- |
| S01-B05-SH02 | 1262 | 1360 | 98 | 3.27 | 93 |
| S01-B05-SH03 | 1360 | 1573 | 213 | 7.10 | 213 |
| S01-B05-SH04 | 1573 | 1603 | 30 | 1.00 | 30 |
| S01-B05-SH05 | 1603 | 1639 | 36 | 1.20 | 36 |

- Shots S01-B01-SH01 .. S01-B05-SH01 (15 shots) as in the Revision D table (starts 0 .. 1133, B05-SH01 1133-1262). **Video 1639 f = 54.63 s (D 1634 f = 54.47 s); 60 s limit holds, 5.37 s slack.** Shortest shot S01-B05-SH04 30 f. The whole +5 f lands in S01-B05-SH02 (L12 shot). Full list in `shots.json`.
- **S01-B01-SH04 >= 3 s: still borderline, unchanged by this revision** (86 f = 2.87 s, 92 f = 3.07 s with a 0.28 s L03-V01 gap); OWN/CAT voices not generated. Not confirmed.
- Film retimes from `lines.json` (Revision E); the Revision D section below is history.

## OWN takes (2026-11-07, user-picked v1 = Gemini Leda; Revision E otherwise unchanged)

- **Source:** `projects/EDU/narr-samples/ep06-sample-OWN-v1.wav` (user pick; style prompt in its `.json`). **0 Gemini requests spent**: the v1 lines cut cleanly. Gap between the two lines is 2.935-4.065 s in v1 = **1.13 s** of floor (rms -46 to -62 dB; single 5 ms blips only), well over the 1.1 s asked. Cuts sit inside that floor, 5 ms fades, no gain change (v1 is already -16.0 LUFS two-pass; L03 -15.6, L03b -17.6 LUFS integrated, so the whisper is 2.0 LU under L03 as it came, not boosted). 48 kHz mono.
- **Files** (store `projects/EDU/narration/ep06/lines/`, `.json` sidecars with voice, style, source span, requests used): `2026-11-07_ep06-own-L03-leda.wav` (file 2.76 s) and `2026-11-07_ep06-own-L03b-leda.wav` (file 1.05 s). Added to `lines.json` (`voice: OWN`, `placed: false`; NAR times untouched).
- **Durations (energy runs, 5 ms hop, -45 dB; head/tail 0.05 s):**

| Line | Voiced run in file (s) | Voiced dur (s) | File dur (s) | Sheet est (s) |
| --- | --- | --- | --- | --- |
| L03 | 0.05-2.73 (internal word gap 0.78-0.98 / 1.20-1.23 s in v1 = about 0.17 s) | **2.66** | 2.76 | 1.07 |
| L03b | 0.05-1.03 (internal dips only, whisper tail near the floor) | **0.95** | 1.05 | 1.00 |

  L03 is 2.5x the sheet estimate (the drawn-out "ยยย" and the coo). L03b is 0.05 s shorter. The whisper tail is quiet, so a -38 dB threshold ends it ~0.05 s earlier than -45 dB; v1's own json said 1.29 s from a looser cut.
- **Shots** (`out/ep06-voice/slow/shots-own.py` = shots.py with L03/L03b read from `lines.json`; lines.json Revision E, sub-anchors 2.24 / 2.24, 30 fps). Same assembly rules as the estimate: SH04 = 4 f lead + L03 + 2 f gap + V01 (est 18 f) + 30 f cat exit; B04-SH02 = 4 f lead + L03b + 5 f hold. V01 (0.60 s) and V02 stay estimates.

| Shot | Start f | End f | Length f | Length s |
| --- | --- | --- | --- | --- |
| S01-B01-SH01 | 0 | 46 | 46 | 1.53 |
| S01-B01-SH02 | 46 | 115 | 69 | 2.30 |
| S01-B01-SH03 | 115 | 156 | 41 | 1.37 |
| S01-B01-SH04 | 156 | 290 | 134 | 4.47 |
| S01-B02-SH01 | 290 | 339 | 49 | 1.63 |
| S01-B02-SH02 | 339 | 407 | 68 | 2.27 |
| S01-B02-SH03 | 407 | 522 | 115 | 3.83 |
| S01-B03-SH01 | 522 | 640 | 118 | 3.93 |
| S01-B03-SH02 | 640 | 787 | 147 | 4.90 |
| S01-B04-SH01 | 787 | 847 | 60 | 2.00 |
| S01-B04-SH02 | 847 | 884 | 37 | 1.23 |
| S01-B04-SH03 | 884 | 1040 | 156 | 5.20 |
| S01-B04-SH04 | 1040 | 1112 | 72 | 2.40 |
| S01-B04-SH05 | 1112 | 1179 | 67 | 2.23 |
| S01-B05-SH01 | 1179 | 1308 | 129 | 4.30 |
| S01-B05-SH02 | 1308 | 1406 | 98 | 3.27 |
| S01-B05-SH03 | 1406 | 1619 | 213 | 7.10 |
| S01-B05-SH04 | 1619 | 1649 | 30 | 1.00 |
| S01-B05-SH05 | 1649 | 1685 | 36 | 1.20 |

- **S01-B01-SH04: 134 f = 4.47 s (was 86 f = 2.87 s est), >= 3 s holds** (the full-exit condition of the sheets' user answer is met; with a 0.28 s L03-V01 gap it would be 140 f = 4.67 s). **S01-B04-SH02: 37 f = 1.23 s (was 39 f).**
- **Total 1685 f = 56.17 s (E 1639 f = 54.63 s, +46 f = +1.53 s); 60 s limit holds, 3.83 s slack.** Shortest shot S01-B05-SH04 30 f. B01-SH01..SH03 unchanged; **every shot from S01-B02-SH01 on shifts +48 f (+1.60 s), and from S01-B04-SH03 on +46 f (+1.53 s)** because B04-SH02 is 2 f shorter. NAR audio is placed by shot start, so the NAR line positions on the timeline shift by the same amounts; the NAR gaps are unchanged.
- **Measured, not listened.** Cuts, durations, loudness and gap are measured; no one has heard the cut takes by ear. They are the user-picked audio, but the user's ear on the standalone line files is pending. Film retimes the sheets from `lines.json` + this section; no shot-sheet or script change made here.

## Revision D (2026-11-07, superseded by Revision E; supersedes Revision C numbers): L13 = script R1.3, user-chosen splice V2

L13 text changed to script R1.3 ("แต่ถ้ามันกะพริบกลับมา, นั่นคือสัญญาณที่ดีที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก, รัก"). The user chose splice V2 (`ep06-sample-L13r13-splice-V2.wav`: t1 head + 0.30 s pause + pitch-matched "รัก" from A-t2, the A-t2 "รัก" pitch-shifted by WORLD -7.2 st). Revision C is kept below as history. **0 Gemini requests.**

- Method: L01-L12 = the first 35.33 s of `out/ep06-voice/slow/splice.wav` (pre-slowdown source, old L13 dropped); V2 (already tempo 1.0, -16.0 LUFS) appended from V2 0.10 s, which puts the speech onset 0.09 s after the L12 end (the same raw L12/L13 gap rule as Revision B/C; no 0.28 s gap is baked in, the 0.28 s gaps are applied by the timeline). Then **one atempo=0.91675 on the whole assembled read** (pitch preserved), then two-pass loudnorm (-16 LUFS, TP -1.5, linear). Result I -16.05, LRA 2.2, true peak -1.50 dBFS, 48 kHz mono, **45.70 s** file. Work files `out/ep06-voice/slow92r13/` (`splice.wav`, `slow.wav`, `slow-norm.wav`, `lines.json`, `shots.json`).
- Seam: the cut sits at 35.33 s source = 38.54 s in the slowed read, inside the 0.19 s silence after L12 (38.48-38.67 at -38 dB). Measured +-20 ms around it: peak 60 of 32768, largest sample step 22 (noise floor); no click by measurement (not listened). Whole-file largest step 27434 is ordinary speech.
- **L13 (measured, slowed read):** starts 38.58, ends 45.55 (6.97 s of speech, Revision C 5.60 s). Speech runs 38.58-40.18, 40.32-41.99, 42.29-44.76, then "รัก" 45.11-45.55. Gaps 0.14 (after "...กลับมา"), 0.30 (before "ที่คนเลี้ยง..."), then **pause before "รัก" 0.35 s** (-38 dB silence 44.74-45.12 = 0.38 s; V2 at tempo 1.0 had 0.33 s, x1.09 = 0.36). "รัก" is **0.44 s** (V2 0.40 s x 1.09).
- **"รัก" pitch (autocorrelation, measured, not listened):** V2 at tempo 1.0: ~136 Hz at onset, 151 Hz peak, 140 Hz dip, then **rising to 172 Hz** (about +3.6 semitones from the dip, +4.2 from the onset). Slowed read: the same contour (136, 151, 140, then 157, 165, 172 Hz at 45.42-45.50). The rise survives the atempo; level falls only in the last 0.04 s (-18 dB until 45.48, -25 dB at 45.50).
- **Gap check inside "สัญญาณที่ดี...เชื่อว่ามันกำลังบอก" (flag):** words were not aligned by ASR; I located them from syllable counts of the three speech runs (run 2 = "นั่นคือสัญญาณที่ดี" 1.67 s, run 3 = "ที่คนเลี้ยงแมวหลายคนเชื่อว่ามันกำลังบอก" 2.47 s). **Run 3 ("ที่คน...เชื่อว่ามันกำลังบอก") is continuous: no silence at or above 0.02 s inside it at -38 dB, so no gap inside "เชื่อว่ามันกำลังบอก".** But a **0.30-0.33 s pause (41.97-42.30) sits between "สัญญาณที่ดี" and "ที่คนเลี้ยง"**, i.e. inside the span written "สัญญาณที่ดี...เชื่อว่า". It is the same pause that is already in V2 (V2 3.27-3.56 s) and so in the sample the user chose; the position is inferred from syllable counts, so for the user's ear. Not changed.
- Not listened: nothing in this revision was heard by me; all numbers are measured only. Slowing the spliced "รัก" by 9 % may add slight tempo artefacts; for the user's ear.
- Store (old files kept): `projects/EDU/narration/ep06/2026-11-07_ep06-nar-kore-A-slow92-r13-fullread.wav` (+ `.json`), `lines/2026-11-07_ep06-nar-<L>-kore-A-slow92-r13.wav` (12 files, cut from the new file at file start/dur), `lines.json` and `shots.json` now hold Revision D; Revision C's are `lines-prev-slow92.json` and `shots-prev-slow92.json`; the slow92 audio is unchanged. L01-L12 line times are unchanged from Revision C (same source, same tempo).

### Lines (Revision D, positions in the slowed read, s)

| Line | Start | End | Dur (s) | File start | File dur (s) |
| --- | --- | --- | --- | --- | --- |
| L01 | 0.27 | 1.51 | 1.24 | 0.22 | 1.38 |
| L02 | 1.94 | 5.34 | 3.40 | 1.89 | 3.50 |
| L04 | 5.43 | 6.81 | 1.38 | 5.38 | 1.51 |
| L05 | 7.03 | 8.99 | 1.96 | 6.97 | 2.07 |
| L06 | 9.10 | 12.65 | 3.55 | 9.05 | 3.69 |
| L07 | 13.25 | 16.91 | 3.66 | 13.20 | 3.75 |
| L08 | 16.99 | 21.58 | 4.59 | 16.94 | 4.65 |
| L09 | 21.62 | 26.54 | 4.92 | 21.59 | 5.04 |
| L10 | 27.13 | 31.47 | 4.34 | 27.08 | 4.45 |
| L11 | 31.58 | 35.60 | 4.02 | 31.52 | 4.11 |
| L12 | 35.67 | 38.50 | 2.83 | 35.62 | 2.92 |
| L13 | 38.58 | 45.55 | 6.97 | 38.53 | 7.09 |

- Speech alone **42.86 s** (Revision C 41.49 s). Re-gapped at 0.28 s (11 gaps) = **45.94 s NAR** (Revision C 44.57 s, +1.37 s, all in L13). Script N1 estimate 43.6 s: +5 %.

### Shots (Revision D, 30 fps, 19 shots, OWN/CAT still estimates)

| Shot | Start f | End f | Length f | Length s |
| --- | --- | --- | --- | --- |
| S01-B01-SH01 | 0 | 46 | 46 | 1.53 |
| S01-B01-SH02 | 46 | 115 | 69 | 2.30 |
| S01-B01-SH03 | 115 | 156 | 41 | 1.37 |
| S01-B01-SH04 | 156 | 242 | 86 | 2.87 |
| S01-B02-SH01 | 242 | 291 | 49 | 1.63 |
| S01-B02-SH02 | 291 | 359 | 68 | 2.27 |
| S01-B02-SH03 | 359 | 473 | 114 | 3.80 |
| S01-B03-SH01 | 473 | 592 | 119 | 3.97 |
| S01-B03-SH02 | 592 | 739 | 147 | 4.90 |
| S01-B04-SH01 | 739 | 799 | 60 | 2.00 |
| S01-B04-SH02 | 799 | 838 | 39 | 1.30 |
| S01-B04-SH03 | 838 | 994 | 156 | 5.20 |
| S01-B04-SH04 | 994 | 1066 | 72 | 2.40 |
| S01-B04-SH05 | 1066 | 1133 | 67 | 2.23 |
| S01-B05-SH01 | 1133 | 1262 | 129 | 4.30 |
| S01-B05-SH02 | 1262 | 1355 | 93 | 3.10 |
| S01-B05-SH03 | 1355 | 1568 | 213 | 7.10 |
| S01-B05-SH04 | 1568 | 1598 | 30 | 1.00 |
| S01-B05-SH05 | 1598 | 1634 | 36 | 1.20 |

- **Video 1634 f = 54.47 s (Revision C 1593 f = 53.10 s); 60 s limit holds, 5.53 s slack.** Shortest shot S01-B05-SH04 30 f, none under 24 f. S01-B05-SH03 (L13) 213 f = 7.10 s (Revision C 172 f = 5.73 s); only the L13 shot and the shots after it moved, B01-B05-SH02 are identical to Revision C. Same RT rules (`out/ep06-voice/slow/shots.py` with `lines.json` and the two sub-anchors 2.24).
- **S01-B01-SH04 >= 3 s: still borderline, unchanged by this revision** (estimate 86 f = 2.87 s, 92 f = 3.07 s with a 0.28 s L03-V01 gap); OWN/CAT voices are not generated. Not confirmed.
- Film retimes from `lines.json` (Revision D); the Revision C table below is history.

## Revision C (2026-11-07, superseded by Revision D; supersedes Revision B numbers): a further 3.5 % slower

User request: slow the narration another 3-4 % on top of the 5 % already applied (3.5 % chosen, middle of the range). **Explicit user decision overriding the no-atempo default; cumulative about 8.4 % slower than the original read** (1 - 0.95 x 0.965 = 8.3 %; tempo 0.91675).

- Method: the pre-slowdown spliced source (`out/ep06-voice/slow/splice.wav`, L01-L12 of the first read + user-picked L13 sample A-t2, 40.57 s) was still available, so **one atempo=0.91675 pass** (no double atempo), pitch preserved, then two-pass loudnorm with the `scripts/gemini-tts.py` filter (`I=-16:TP=-1.5:LRA=11`). Result I -16.0, LRA 2.2, true peak -1.50 dBFS, 48 kHz mono, **44.24 s** file. **0 Gemini requests.** OWN/CAT voices unchanged.
- Line times: Revision B times x 1/0.965 (rounded to 10 ms; Revision B was itself scaled and checked the same way). Check against the new file's 10 ms energy runs: L01 0.26, L02 1.93, L05 7.00, L06 9.08, L08 16.97, L10 27.10, L11 31.53, L12 35.67 (merged runs hide some starts, e.g. L07/L09), L13 38.58; line ends L06 12.64, L07 16.89, L09 26.52, L10 31.46, L11 35.58, L12 38.48, L13 44.17. Every one within 0.02 s of the scaled value (the bridged blip makes L01 end 1.51 either way). Per-line files are cut from the new file at file start/dur.
- **L13 gaps** (speech runs 38.58-39.89, 40.06-41.64, 41.78-43.55, then "รัก" 43.73-44.17): 0.17, 0.14, 0.18 s (Revision B 0.16, 0.14, 0.16); proportional, no new gap opened. N7 doubt from Revision B (whether a gap falls inside "แปลว่า") is unchanged and still for the user's ear. L13 speech is now 5.60 s, "รัก" 0.44 s.
- Not listened: nothing in this revision was heard by me; all numbers are measured only. A 3.5 % extra stretch on a sped-and-stretched Gemini read may add slight tempo artefacts; for the user's ear.
- Sub-anchors scale by 1/0.9168 from the original: L02 "เป็นการท้าทาย" onset 2.24 s after L02 start; L10 pause centre 2.24 s after L10 start (used in the shot table).
- Store (old files kept): `projects/EDU/narration/ep06/2026-11-07_ep06-nar-kore-A-slow92-fullread.wav` (+ `.json`), `lines/2026-11-07_ep06-nar-<L>-kore-A-slow92.wav` (12 files), `lines.json` and `shots.json` now hold Revision C; Revision B's are `lines-prev-slow95.json` and `shots-prev-slow95.json`; the slow95 audio is unchanged. Work files: `out/ep06-voice/slow92/`.

### Lines (Revision C, positions in the slowed read, s)

| Line | Start | End | Dur (s) | File start | File dur (s) |
| --- | --- | --- | --- | --- | --- |
| L01 | 0.27 | 1.51 | 1.24 | 0.22 | 1.38 |
| L02 | 1.94 | 5.34 | 3.40 | 1.89 | 3.50 |
| L04 | 5.43 | 6.81 | 1.38 | 5.38 | 1.51 |
| L05 | 7.03 | 8.99 | 1.96 | 6.97 | 2.07 |
| L06 | 9.10 | 12.65 | 3.55 | 9.05 | 3.69 |
| L07 | 13.25 | 16.91 | 3.66 | 13.20 | 3.75 |
| L08 | 16.99 | 21.58 | 4.59 | 16.94 | 4.65 |
| L09 | 21.62 | 26.54 | 4.92 | 21.59 | 5.04 |
| L10 | 27.13 | 31.47 | 4.34 | 27.08 | 4.45 |
| L11 | 31.58 | 35.60 | 4.02 | 31.52 | 4.11 |
| L12 | 35.67 | 38.50 | 2.83 | 35.62 | 2.92 |
| L13 | 38.57 | 44.17 | 5.60 | 38.52 | 5.72 |

- Speech alone **41.49 s** (Revision B 40.04 s). Re-gapped at 0.28 s (11 gaps) = **44.57 s NAR** (Revision B 43.12 s, +3.4 %). Script N1 estimate 43.6 s: +2 %.

### Shots (Revision C, 30 fps, 19 shots, OWN/CAT still estimates)

| Shot | Start f | End f | Length f | Length s |
| --- | --- | --- | --- | --- |
| S01-B01-SH01 | 0 | 46 | 46 | 1.53 |
| S01-B01-SH02 | 46 | 115 | 69 | 2.30 |
| S01-B01-SH03 | 115 | 156 | 41 | 1.37 |
| S01-B01-SH04 | 156 | 242 | 86 | 2.87 |
| S01-B02-SH01 | 242 | 291 | 49 | 1.63 |
| S01-B02-SH02 | 291 | 359 | 68 | 2.27 |
| S01-B02-SH03 | 359 | 473 | 114 | 3.80 |
| S01-B03-SH01 | 473 | 592 | 119 | 3.97 |
| S01-B03-SH02 | 592 | 739 | 147 | 4.90 |
| S01-B04-SH01 | 739 | 799 | 60 | 2.00 |
| S01-B04-SH02 | 799 | 838 | 39 | 1.30 |
| S01-B04-SH03 | 838 | 994 | 156 | 5.20 |
| S01-B04-SH04 | 994 | 1066 | 72 | 2.40 |
| S01-B04-SH05 | 1066 | 1133 | 67 | 2.23 |
| S01-B05-SH01 | 1133 | 1262 | 129 | 4.30 |
| S01-B05-SH02 | 1262 | 1355 | 93 | 3.10 |
| S01-B05-SH03 | 1355 | 1527 | 172 | 5.73 |
| S01-B05-SH04 | 1527 | 1557 | 30 | 1.00 |
| S01-B05-SH05 | 1557 | 1593 | 36 | 1.20 |

- **Video 1593 f = 53.10 s (Revision B 1550 f = 51.67 s); 60 s limit holds, 6.90 s slack.** Shortest shot S01-B05-SH04 30 f, none under 24 f. S01-B05-SH03 (L13) 172 f = 5.73 s. Same RT rules as before (`out/ep06-voice/slow/shots.py`, run with lines.json and the two sub-anchors 2.24).
- **S01-B01-SH04 >= 3 s: still borderline, unchanged by this revision.** It is OWN/CAT-led (estimate 86 f = 2.87 s, 92 f = 3.07 s with a 0.28 s L03-V01 gap); OWN/CAT voices are not generated. Not confirmed.
- Film retimes from `lines.json` (Revision C); the Revision B and A tables below are history.

## Revision B (2026-11-07, superseded by Revision C): 5 % slower + L13 from sample A-t2

User feedback on the style-A full read: (1) 5 % slower, (2) the last word "รัก" of L13 did not sound like the picked sample `ep06-sample-A-t2.wav`.

- **Explicit user decision overrides the no-atempo default:** `atempo=0.95` on the whole NAR read (pitch preserved), then two-pass loudnorm (-16 LUFS). Result I -16.0, LRA 2.4, true peak -1.5 dBFS, 48 kHz mono, **42.70 s** file. OWN/CAT voices are not part of this change.
- **L13 fix, 0 Gemini requests (3 requests still remain of the 4 for this read):** sample A-t2 is the exact take the user picked and its raw file was still in the TTS cache (`98531c9df31ef2e0`, same model/voice/style/text as L13). I spliced that take (0.193-5.43 s of the normalised sample) into the read at the old L13 position (raw gap to L12 kept at 0.09 s), then slowed the whole read. No retake was needed.
- **Measured difference (sample A-t2 vs the full-read L13), measured only, not listened:** the full-read "รัก" is 0.15-0.17 s, level -15 dB at onset, pitch ~125-145 Hz and falling or flat, with the phrase trailing off in the last 0.1 s; the picked sample "รัก" is 0.38 s, onset -15 dB, pitch 213-229 Hz then **rising to ~267 Hz** (about +4 semitones) with level held at -19 to -20 dB to the end, after a 0.18 s pause (full read 0.19 s). So the sample ends on a longer, higher, rising "รัก"; the full read ended short and low. Now identical by construction (same audio).
- **Doubt, L13 (N7 condition):** the sample has more internal pauses than the full-read L13 (silence >= 0.06 s at sample 0.88-0.95, 1.42-1.60, 2.88-3.19 and 4.79-4.97 before "รัก"; the full read had only the 0.19 s one). In the slowed read: speech runs 37.22-38.49, 38.65-40.18, 40.32-42.04, then "รัก" 42.20-42.62 (gaps 0.16, 0.14, 0.16 s). Script N7 asked for "สัญญาณที่ดีที่ทาสแมวหลายคนแปลว่า" with no gap before "แปลว่า"; I did not locate the words, so I cannot say whether a gap falls inside that phrase. Also L13 now runs 5.40 s of speech (4.59 s x 1.053 would be 4.83 s), i.e. the sample is about 11 % slower than the old L13 before the 5 % slow-down: it will sound a bit slower than L12. Both are for the user's ear.
- Not listened: no part of this revision was heard by me. The splice seam (35.33 s head / 0.193 s of the sample, in the slowed read 37.17 s) sits in silence (both sides below -35 dB at the cut by construction of the gap); level of the two sources is the same (both normalised to -16.2 LUFS before the splice).
- Store (old files kept): `projects/EDU/narration/ep06/2026-11-07_ep06-nar-kore-A-slow95-fullread.wav` (+ `.json` with sources), `lines/2026-11-07_ep06-nar-<L>-kore-A-slow95.wav` (12 files), `lines.json` and `shots.json` now hold Revision B; the first read's are `lines-prev-A-fullread.json` and `shots-prev-A-fullread.json`; previous audio `2026-11-07_ep06-nar-kore-A-fullread.wav` unchanged. Local work files and scripts: `out/ep06-voice/slow/` (`ana.py` pitch/level, `runs.py` energy runs, `shots.py` shot table).
- Method: line positions are the first-read energy-run positions x 1/0.95 (rounded to 10 ms; the new read's 10 ms peak runs agree within 0.02 s at every line start, L01 end reads 1.54 vs scaled 1.46 because the tail blip now bridges), L13 measured on the new file. Shot table computed by the same RT rules as before (script `shots.py`; run on the old lines it reproduces the old table to +-1 frame at one boundary, total identical 1473 f).

### Lines (Revision B, positions in the slowed read, s)

| Line | Start | End | Dur (s) | File start | File dur (s) |
| --- | --- | --- | --- | --- | --- |
| L01 | 0.26 | 1.46 | 1.20 | 0.21 | 1.33 |
| L02 | 1.87 | 5.15 | 3.28 | 1.82 | 3.38 |
| L04 | 5.24 | 6.57 | 1.33 | 5.19 | 1.46 |
| L05 | 6.78 | 8.68 | 1.90 | 6.73 | 2.00 |
| L06 | 8.78 | 12.21 | 3.43 | 8.73 | 3.56 |
| L07 | 12.79 | 16.32 | 3.53 | 12.74 | 3.62 |
| L08 | 16.40 | 20.82 | 4.42 | 16.35 | 4.49 |
| L09 | 20.86 | 25.61 | 4.75 | 20.83 | 4.86 |
| L10 | 26.18 | 30.37 | 4.19 | 26.13 | 4.29 |
| L11 | 30.47 | 34.35 | 3.88 | 30.42 | 3.97 |
| L12 | 34.42 | 37.15 | 2.73 | 34.37 | 2.82 |
| L13 | 37.22 | 42.62 | 5.40 | 37.17 | 5.52 |

- Speech alone **40.04 s** (was 37.48). Re-gapped at 0.28 s (11 gaps) = **43.12 s NAR** (was 40.56; +6.3 %: 5 % from the tempo, rest from the longer L13). Script N1 estimate 43.6 s: -1 %.
- Sub-anchors scale by 1/0.95: L02 "เป็นการท้าทาย" onset 2.16 s after L02 start; L10 pause centre 2.16 s after L10 start.

### Shots (Revision B, 30 fps, 19 shots, OWN/CAT still estimates)

| Shot | Start f | End f | Length f | Length s |
| --- | --- | --- | --- | --- |
| S01-B01-SH01 | 0 | 44 | 44 | 1.47 |
| S01-B01-SH02 | 44 | 111 | 67 | 2.23 |
| S01-B01-SH03 | 111 | 151 | 40 | 1.33 |
| S01-B01-SH04 | 151 | 237 | 86 | 2.87 |
| S01-B02-SH01 | 237 | 285 | 48 | 1.60 |
| S01-B02-SH02 | 285 | 350 | 65 | 2.17 |
| S01-B02-SH03 | 350 | 462 | 112 | 3.73 |
| S01-B03-SH01 | 462 | 576 | 114 | 3.80 |
| S01-B03-SH02 | 576 | 719 | 143 | 4.77 |
| S01-B04-SH01 | 719 | 779 | 60 | 2.00 |
| S01-B04-SH02 | 779 | 818 | 39 | 1.30 |
| S01-B04-SH03 | 818 | 969 | 151 | 5.03 |
| S01-B04-SH04 | 969 | 1037 | 68 | 2.27 |
| S01-B04-SH05 | 1037 | 1103 | 66 | 2.20 |
| S01-B05-SH01 | 1103 | 1228 | 125 | 4.17 |
| S01-B05-SH02 | 1228 | 1318 | 90 | 3.00 |
| S01-B05-SH03 | 1318 | 1484 | 166 | 5.53 |
| S01-B05-SH04 | 1484 | 1514 | 30 | 1.00 |
| S01-B05-SH05 | 1514 | 1550 | 36 | 1.20 |

- **Video 1550 f = 51.67 s (was 1473 f = 49.1 s); 60 s limit holds, 8.33 s slack.** Shortest shot S01-B05-SH04 30 f, none under 24 f. S01-B05-SH03 (L13) is now 166 f = 5.53 s.
- **S01-B01-SH04 >= 3 s: unchanged, still borderline.** It is OWN/CAT-led (est 86 f = 2.87 s, 92 f = 3.07 s with a 0.28 s L03-V01 gap); the slow-down does not touch it and OWN/CAT voices are not generated yet. Not confirmed.
- Film retimes the sheets (R1.1) from `lines.json`; the earlier Revision A tables below are history.

## Superseded: first read (Revision A)

- Script EDU-EP06-SCRIPT-R1.2 (user-approved 2026-11-07). **Measured read made; the user has not yet listened.** W4 voice lock is not ticked: the user must hear it first. I measured only (silence, energy, Whisper word times); I did not listen.
- Narrator style **A (house deadpan)**, picked by the user from the 2026-11-07 samples: Gemini TTS `gemini-3.8-flash-tts`, voice Kore, `--style "fast-paced, quick brisk delivery with short pauses between phrases, playful deadpan female narrator, dry and matter-of-fact, speaking quickly without dragging"`. No atempo (edu default). **One request, one attempt, exit 0** (log `out/logs/ep06-full.log`); no retake needed: no tail drift measured (see below). 1 of the 4 allowed requests used.
- Text: `lines-nar.txt` = the 12 NAR lines L01, L02, L04-L13 verbatim, one per line, ellipses → commas in the TTS text only (script unchanged). L13 TTS text has no comma after "สัญญาณที่ดี" (script N7): `แต่ถ้ามันกะพริบกลับมา, นั่นคือสัญญาณที่ดีที่ทาสแมวหลายคนแปลว่า, รัก`. **OWN lines L03 and L03b are not in the NAR read** (owner voice open item below).
- Raw read 40.28 s (peak -1.5 dBFS, no clipping). Normalised read (48 kHz mono, loudnorm -16 LUFS, I -16.3, LRA 2.4, true peak -1.5 dBFS) `2026-11-07_ep06-nar-kore-A-fullread.wav` 40.28 s. Source of every number below is this read.
- Method: ffmpeg 10 ms peak runs (>= 300 of 32767, 60 ms bridge) and `silencedetect -35 dB / 0.10 s`, plus Whisper large-v3-turbo word times for sub-anchors (Whisper Thai output is noisy on this read; used only for sub-anchor estimates, line edges come from the energy runs). Local copies and reproduction inputs in `out/ep06-voice/full/` (ignored).

## Lines (positions in the raw/normalised read)

| Line | Start | End | Dur (s) | File start | File dur (s) | Note |
| --- | --- | --- | --- | --- | --- | --- |
| L01 | 0.25 | 1.39 | 1.14 | 0.20 | 1.27 |  |
| L02 | 1.78 | 4.89 | 3.11 | 1.73 | 3.24 | "เป็นการท้าทาย" onset 3.83 (gap 3.70-3.83) |
| L04 | 4.98 | 6.24 | 1.26 | 4.93 | 1.39 |  |
| L05 | 6.44 | 8.25 | 1.81 | 6.39 | 1.94 |  |
| L06 | 8.34 | 11.60 | 3.26 | 8.29 | 3.39 | "มากกว่าความรัก" onset 10.94 (gap 10.81-10.94) |
| L07 | 12.15 | 15.50 | 3.35 | 12.10 | 3.47 | 0.37 s soft breath 11.70-12.07 before speech; onset = speech 12.15 |
| L08 | 15.58 | 19.78 | 4.20 | 15.53 | 4.28 | หนึ่ง ~17.83, สอง ~18.30, "ลืม" ~19.50 (Whisper, +-0.1 s); ends with a 0.04 s soft join into L09 |
| L09 | 19.82 | 24.33 | 4.51 | 19.79 | 4.62 | onset soft (nasal ง); "พบว่า," gap 21.79-21.93; 0.3 s breath 24.47-24.77 after "ตอบ" is dropped |
| L10 | 24.87 | 28.85 | 3.98 | 24.82 | 4.11 | onset after breath 24.87; pause after "คนแปลกหน้า" 26.89-26.94 (centre 26.92, a ~0.05-0.1 s dip only) |
| L11 | 28.95 | 32.63 | 3.68 | 28.90 | 3.79 | "ลองคืนนี้ดู" 28.95-30.07, gap 30.04-30.22, no pause before "แล้ว" (dip at 31.51-31.55); L10/L11 gap only 0.10 s |
| L12 | 32.70 | 35.29 | 2.59 | 32.65 | 2.72 |  |
| L13 | 35.38 | 39.97 | 4.59 | 35.33 | 4.72 | ONE phrase: no gap >= 0.06 s from "แต่" to "แปลว่า"; only pause 39.58-39.78 (0.19 s) before "รัก" 39.76-39.97 (0.21 s) |

- Speech alone **37.48 s** over 12 lines. Re-gapped at 0.28 s (EP05 value, 11 gaps) = **40.56 s NAR** (script N1 estimate 43.6 s: the read is -7 % vs the estimate; EP05's read ran +12 %, this one runs under). As read (raw gaps 0.09-0.4 s, 0.25 s lead) the speech span is 0.25-39.97 s.
- Split files carry 0.05 s lead and up to 0.08 s tail (shortened where the neighbour is closer); onset in file 0.05 s (L09 0.03 s). Seams checked: audible speech stays off both file edges except two soft joins with **no real pause**: L08/L09 (0.04 s dip at 19.80) and L10/L11 (0.10 s, 28.85-28.95). The L01 tail carries a 0.01 s blip at -34 dBFS (not speech).
- Store: `projects/EDU/narration/ep06/` (`2026-11-07_ep06-nar-kore-A-raw.wav` + `.json`, `2026-11-07_ep06-nar-kore-A-fullread.wav`, `lines/2026-11-07_ep06-nar-<L>-kore-A.wav`, `lines-nar.txt`, `lines.json`, `shots.json`).

## Drift and clipping (measured only, not listened)

- No clipping (peak -1.5 dBFS, loudnorm true peak -1.5). Level steady: LRA 2.4 LU, loudest 10 ms peak 27.6k at the tail, first lines 25-27k.
- Rate by syllable (script N1 counts) per line: L05 4.4/s, L06 5.2/s, L07 4.8/s (from 12.15), L08 3.8/s, L09 5.3/s, L10 5.3/s, L11 4.1/s, L12 5.8/s, L13 5.4/s. L12 and L13 run slightly faster than the opening (L02 4.8/s, L01 5.3/s) but no step change, so **no late drift detected by rate**; timbre/pitch drift was not measured and nothing was listened to. No tail retake made (0 of 1 used). The user's ear decides.
- Quiet breaths inside the read (not speech, dropped from line files): 11.70-12.07 before L07 (peak ~ -26 dBFS) and 24.47-24.77 before L10. They are TTS inhales; keep them out of the mix unless the user likes them.
- **L13 condition (N7), measured:** "สัญญาณที่ดี" runs straight into "ที่ทาสแมวหลายคนแปลว่า" with no gap above the 0.06 s detection floor; the only pause is 0.19 s before "รัก" (39.76-39.97, 0.21 s). "แปลว่า… รัก" is therefore audible as a short breath plus the word. Whisper heard "รัก" at 39.84-40.00. Not confirmed by ear.

## Video estimate (19 shots, 30 fps, measured NAR + estimated OWN/CAT)

Rules used (RT01-RT06 of the scene sheets; sheets NOT edited): NAR 0.28 s gaps; each shot starts 4 f before its line onset (L01 onset at f4); S01-B01-SH03 cuts 2 f before "เป็นการท้าทาย"; S01-B04-SH05 cuts in L10's pause (26.92 s of the read); S01-B04-SH01 60 f, S01-B05-SH04 30 f, S01-B05-SH05 36 f fixed; L08 shot ends 6 f after "ลืม", then 60 f silence, L03b onset 4 f into the next shot (sheet est tail); L13 shot ends 8 f after "รัก". **OWN L03, L03b and CAT V01 are not recorded yet:** sheet estimates used (L03 1.07 s, V01 0.60 s with a 2 f gap, L03b 1.00 s, exit tail 30 f after V01). Replace them when the owner voice exists.

| Shot | Start f | End f | Length f | Length s | Line |
| --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | 0 | 43 | 43 | 1.43 | L01 |
| S01-B01-SH02 | 43 | 106 | 63 | 2.10 | L02a |
| S01-B01-SH03 | 106 | 144 | 38 | 1.27 | L02b |
| S01-B01-SH04 | 144 | 230 | 86 | 2.87 | L03 (est), V01 (est) |
| S01-B02-SH01 | 230 | 277 | 47 | 1.57 | L04 |
| S01-B02-SH02 | 277 | 339 | 62 | 2.07 | L05 |
| S01-B02-SH03 | 339 | 445 | 106 | 3.53 | L06 |
| S01-B03-SH01 | 445 | 554 | 109 | 3.63 | L07 |
| S01-B03-SH02 | 554 | 690 | 136 | 4.53 | L08 |
| S01-B04-SH01 | 690 | 750 | 60 | 2.00 | silence |
| S01-B04-SH02 | 750 | 789 | 39 | 1.30 | L03b (est) |
| S01-B04-SH03 | 789 | 933 | 144 | 4.80 | L09 |
| S01-B04-SH04 | 933 | 998 | 65 | 2.17 | L10a |
| S01-B04-SH05 | 998 | 1060 | 62 | 2.07 | L10b |
| S01-B05-SH01 | 1060 | 1179 | 119 | 3.97 | L11 |
| S01-B05-SH02 | 1179 | 1265 | 86 | 2.87 | L12 |
| S01-B05-SH03 | 1265 | 1407 | 142 | 4.73 | L13 |
| S01-B05-SH04 | 1407 | 1437 | 30 | 1.00 | closing |
| S01-B05-SH05 | 1437 | 1473 | 36 | 1.20 | closing, fade |

- **Video 1473 f = 49.1 s** (sheets est 1602 f = 53.4 s; 60 s limit holds with 10.9 s of slack; shortest shot S01-B05-SH05 36 f, then S01-B01-SH03 38 f, none under 24 f). Starts are positions in the 0.28 s re-gapped timeline; Film retimes the sheets (R1.1) from `lines.json`.
- **S01-B01-SH04 >= 3 s? Borderline, undetermined from the NAR read.** It is OWN/CAT-led, so its length is 4 f lead + L03 + gap + V01 + exit tail. With sheet estimates: **86 f = 2.87 s** (L03 32 f, 2 f, V01 18 f, tail 30 f), **92 f = 3.07 s** if the L03-V01 gap is 0.28 s. The 90 f (3.0 s) full-exit threshold (SD01) is met only with a longer L03 take (>= 1.14 s), a gap of >= 6 f or an exit tail of >= 34 f. The video has 10.9 s of slack, so Film can pad the tail without breaking the limit (Film decision, RT02 says "at least 30 f").

## Open items

- **User listen** to `2026-11-07_ep06-nar-kore-A-slow95-fullread.wav` (Revision B supersedes `...-A-fullread.wav`) (tone, rate, any late drift, L13 "แปลว่า… รัก"), then W4 lock; if the tail drifts by ear, one tail retake as in the skill (3 of the 4 requests left today for this task).
- **OWN voice for L03 "น่ารักจังเลยยย" (cooing) and L03b (whisper) "ตอบกลับมาด้วย…" not generated.** Sample first (<= 10 s, the user picks) per [sample-before-full-read](../../../docs/delivery-workflow.md#sample-before-full-read); CAT V01/V02 come from the sound library.
- Scene-sheet retime (R1.1) by Film from `lines.json`; OWN/CAT durations then replace the estimates above.

## Earlier history (kept)

- The earlier "404 model gemini-3.8-flash-tts not found" blocker was retracted 2026-11-07: the model works on both keys (log `out/logs/ep06-samples.log`).
- NARR samples (2026-11-07, Kore, only `--style` differs): store `~/ReelsStore/projects/EDU/narr-samples/`:
  - A house deadpan: "fast-paced, quick brisk delivery with short pauses between phrases, playful deadpan female narrator, dry and matter-of-fact, speaking quickly without dragging" — `ep06-sample-A-t1.wav` 5.72 s, `-A-t2.wav` 5.64 s
  - B warmer: "fast-paced, brisk delivery with short pauses between phrases, playful female narrator, light and warm with a hint of a smile, matter-of-fact, speaking quickly without dragging" — `-B-t1.wav` 5.16 s, `-B-t2.wav` 4.96 s
  - C drier: "fast-paced, quick brisk delivery with short pauses between phrases, very dry deadpan female narrator, flat, understated and unimpressed, speaking quickly without dragging" — `-C-t1.wav` 6.32 s, `-C-t2.wav` 6.16 s
