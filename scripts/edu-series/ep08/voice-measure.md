# EDU-EP08-SHORT voice measure

## Samples (2026-11-08, W1.4 sample-before-full-read; no full read yet)

Text: script R1.1 L01-L03 with ellipses as commas, 42 syllables (hand count): `ถ้าคุณถอดหมวกกลางอวกาศ, ตัวคุณจะไม่ระเบิดอย่างในหนัง, แต่อาจมีสติอยู่แค่ประมาณ สิบถึงสิบห้าวินาที, หมวกจริงล็อกแน่นนะ, นี่แค่สมมติ`.
Voice Gemini Kore (`gemini-3.8-flash-tts`), 3 requests (3 of 100/day), each one attempt, exit 0, log `out/logs/ep08-samples.log`. **No atempo** on any sample (edu default). Only `--style` differs. Not listened by me; lengths are measured with ffmpeg silencedetect (-40 dB).

| Cand | Style (after "...") | File dur | Speech span | syl/s | Projected R1.1 (225 syl) |
| --- | --- | --- | --- | --- | --- |
| A | EP06 style A as used: "fast-paced, quick brisk delivery with short pauses between phrases, playful deadpan female narrator, dry and matter-of-fact, speaking quickly without dragging" | 8.64 s | 8.11 s | 5.18 | ~43.4 s |
| B | tense/urgent: "fast-paced, tense and urgent, controlled alarm, brisk delivery with short pauses..., female narrator warning of real danger, serious and matter-of-fact, speaking quickly without dragging" | 7.76 s | 7.15 s | 5.88 | ~38.3 s |
| C | calm, wry: "calm, wry and dry, relaxed brisk delivery with short pauses..., amused deadpan female narrator, matter-of-fact, speaking quickly without dragging" | 11.44 s (over the 10 s cap; trimmed copy 8.33 s, ends after L02 in a silence gap, 130 ms fade) | 10.68 s | 3.93 | ~57.2 s |

Projection = 225 x speech span / 42 (pauses inside the span included; R1.1 pauses between lines not added). Rough: syllable count is by hand and R1.1 length is the user's figure, so +-10 %.

Store (`projects/EDU/narration/ep08/`): `2026-11-08_ep08-nar-sample-kore-{A,B,C}.wav` + `.json` (C is the trimmed 8.33 s copy), untrimmed C `2026-11-08_ep08-nar-sample-kore-C-untrimmed-11.4s.wav`.

Findings: C is much slower and risks the 60 s limit at full read; B is fastest and leaves the most room. A lands between.

## Full read (W1.4, 2026-11-08)

User picked sample A on 2026-11-08. **One Gemini request** (1 of 100/day, today 4 of 100 with the 3 samples), one attempt, exit 0, log `out/logs/ep08-full.log`; `gemini-3.8-flash-tts`, Kore, EP06 style A exactly as sample A, **no atempo**. Text `out/ep08-voice/full/lines-nar.txt`: the 13 NAR lines L01-L13 (not V01/V02), one per line, ellipses as commas (L11 without trailing comma; "ปี 1966" kept as digits, read as in the script). Raw read 50.64 s, normalised -16 LUFS (48 kHz mono). **Not listened by me**; line edges come from ffmpeg `silencedetect -35 dB / 0.10 s` assigned by syllable position (no ASR available), so edges are +-0.1 s and two joins are the least certain: L03/L04 (9.29-9.42) and L08/L09 (32.16-32.52).

| Line | Start | End | Dur (s) | File start | File dur (s) |
| --- | --- | --- | --- | --- | --- |
| L01 | 0.19 | 1.68 | 1.49 | 0.14 | 1.62 |
| L02 | 2.10 | 7.22 | 5.12 | 2.05 | 5.25 |
| L03 | 7.43 | 9.29 | 1.86 | 7.38 | 1.98 |
| L04 | 9.42 | 12.19 | 2.77 | 9.37 | 2.90 |
| L05 | 12.48 | 16.54 | 4.06 | 12.43 | 4.19 |
| L06 | 16.77 | 21.45 | 4.68 | 16.72 | 4.81 |
| L07 | 22.08 | 27.36 | 5.28 | 22.03 | 5.41 |
| L08 | 28.02 | 32.16 | 4.14 | 27.97 | 4.27 |
| L09 | 32.52 | 34.79 | 2.27 | 32.47 | 2.40 |
| L10 | 34.99 | 40.64 | 5.65 | 34.94 | 5.78 |
| L11 | 41.11 | 41.80 | 0.69 | 41.06 | 0.82 |
| L12 | 42.37 | 46.91 | 4.54 | 42.32 | 4.67 |
| L13 | 47.56 | 50.38 | 2.82 | 47.51 | 2.95 |

- Speech alone **45.37 s**; as read (0.19-50.38) span **50.19 s**; re-gapped at 0.28 s (12 gaps) = **48.73 s NAR**. Script N1 estimate 53.3 s: the read is -6 % (as read) to -9 % (re-gapped). Pace 225 syl / 45.37 s = 4.96 syl/s speech, same as sample A (5.18).
- **Projected video** = NAR + non-NAR beats from N1 (V01 0.6, post-helmet silence 0.4, three silent show beats 2.8, V02 1.0, closing with ~2 s fade 2.2 = 7.0 s): re-gapped **55.7 s**, as read (raw gaps) **57.2 s**. Both under the 60 s cap (63 s with the 5 % tolerance); slack 2.8-4.3 s. Caveat: the three ~1 s silent beats may overlap raw gaps in the read (not double-counted ones lower the total); the numbers are an estimate until Film retimes the shots.
- **Verdict: pass, no Preaw cuts needed** (N1 C1-C3 not applied; C1-C3 together would save about 1.4 s and are not required).
- Raw gaps worth knowing: 0.43 s after L01 (the hook beat), 0.63 s L06/L07, 0.67 s L07/L08, 0.65 s L12 internal and L13 start, 0.57 s L11/L12; 0.19-0.28 s elsewhere. N2: L03 starts at 7.43 s of the read (before adding V01 and the post-helmet silence it lands about 8.4-9.4 s of the video), a little after the ~7 s default; if long, shorten the silence beat.
- For the user's ear: pronunciation of "ปี 1966" (digits), "นาซ่า", "อุบัติเหตุ"; whether L11 "ปล่อยมันออกมา" (0.69 s) lands with enough air; L10 pauses before "เพราะข้างนอก…" and "ปอดอาจบาดเจ็บได้".
- Store: `projects/EDU/narration/ep08/2026-11-08_ep08-nar-kore-A-fullread.wav` (+ `.json`), `projects/EDU/narration/ep08/lines/2026-11-08_ep08-nar-L01..L13-kore-A-fullread.wav` (+ `.json` each, 0.05 s lead, <= 0.08 s tail), `lines/2026-11-08_ep08-nar-lines.json`. Local reproduction inputs `out/ep08-voice/full/` (ignored). task.md not ticked.


## W4 voice lock (Editor, 2026-11-08; timing status `audio-measured`)

Script **EDU-EP08-SCRIPT-R1.1** (unchanged since the read: `git log` shows only commit 65094b0; the 13 NAR line texts of the read's sidecar match R1.1 L01-L13 with ellipses as commas). Read reused, **0 API requests today for W4** (4 of 100/day used W1.4): `projects/EDU/narration/ep08/2026-11-08_ep08-nar-kore-A-fullread.wav` (Kore, style A, no atempo, 50.64 s file). Reproduction: `python3 -I scripts/edu-series/ep08/voice-lock.py` (local, no API) writes [measure.json](measure.json) (read-time anchors, per-line video frames) and [timeline.json](timeline.json) (30 fps shot table); Whisper large-v3-turbo (`out/ep08-voice/whisper-words.json`) assigned energy runs to words. **Not listened by me.**

**Correction to the W1.4 line table above.** It assigned lines by syllable position and was wrong for L02-L06 (L02 and L03a were merged, so L02 = 2.10-7.22 s was really L02 2.10-5.99 + L03a 6.26-7.22; L03 7.43-9.29 was L03b + half of L04, and so on until L07, where it re-synchronised). L07-L13 and the speech end were right. Line files L02-L06 in `lines/` named `...-fullread.wav` are mis-cut: **use the `...-kore-A-cut2.wav` files** (all 13 re-cut at mid-gap, 0.05 s lead, <= 0.06 s tail, 8 ms/12 ms fades, sidecars with the text). Corrected line edges (read seconds, energy edge, +-0.05 s; word-level anchors in measure.json):

| Line | Start | End | Dur (s) | Video onset f | Video end f |
| --- | --- | --- | --- | --- | --- |
| L01 | 0.19 | 1.68 | 1.49 | 4 | 49 |
| L02 | 2.10 | 5.99 | 3.89 | 102 | 219 |
| L03 | 6.26 | 7.87 | 1.61 | 228 | 276 |
| L04 | 8.46 | 10.63 | 2.17 | 285 | 350 |
| L05 | 11.06 | 14.94 | 3.88 | 359 | 475 |
| L06 | 15.41 | 21.45 | 6.04 | 509 | 690 |
| L07 | 22.08 | 27.36 | 5.28 | 702 | 860 |
| L08 | 28.02 | 32.16 | 4.14 | 869 | 993 |
| L09 | 32.52 | 34.79 | 2.26 | 1002 | 1070 |
| L10 | 34.99 | 40.64 | 5.65 | 1104 | 1273 |
| L11 | 41.11 | 41.80 | 0.69 | 1301 | 1322 |
| L12 | 42.37 | 46.91 | 4.54 | 1378 | 1514 |
| L13 | 47.56 | 50.38 | 2.82 | 1529 | 1614 |

Speech alone 44.46 s (sum of line durations, inner pauses included), speech end in the read 50.383 s.

**Re-gap rules (frames, 30 fps).** Lines are placed whole (inner pauses stay as read: L03 0.21 s, L05 0.29, L06 0.39, L10 0.36, L12 0.37 s). A shot cut sits 4 f after a shot's last word and the next word starts 5 f later, so line-to-line gaps are 9 f = 0.30 s (project pause rule, raw gaps 0.27-0.67 s); first word on frame 4; L07 lead 8 f (flashback in, 0.40 s); L13 lead 11 f (closing breath, 0.50 s); glitter hold 12 f after L11. Silent beats from the storyboard: V01 shot 44 f (was 30, see pick), show beats 30 f before L06 and L10 (the word lands as the beat ends), exhale 24 f before L11, V02 shot 39 f, closing 66 f. V01 and V02 (acted vocal sounds) are **not generated yet**; their slots are the storyboard lengths.

**Per-shot frame table for W5.3 (timeline.json; shot cuts, integer frames, 30 fps).**

| Shot | Start f | End f | Frames | Covers |
| --- | --- | --- | --- | --- |
| S01-B01-SH01 | 0 | 53 | 53 | L01 |
| S01-B01-SH02 | 53 | 97 | 44 | V01 + silence |
| S01-B01-SH03 | 97 | 223 | 126 | L02 |
| S01-B01-SH04 | 223 | 260 | 37 | L03a |
| S01-B01-SH05 | 260 | 280 | 20 | L03b |
| S01-B02-SH01 | 280 | 354 | 74 | L04 |
| S01-B02-SH02 | 354 | 397 | 43 | L05a |
| S01-B02-SH03 | 397 | 479 | 82 | L05b |
| S01-B03-SH01 | 479 | 582 | 103 | show + L06a |
| S01-B03-SH02 | 582 | 694 | 112 | L06b |
| S01-B03-SH03 | 694 | 864 | 170 | L07 |
| S01-B03-SH04 | 864 | 997 | 133 | L08 |
| S01-B03-SH05 | 997 | 1074 | 77 | L09 |
| S01-B04-SH01 | 1074 | 1151 | 77 | show + L10a |
| S01-B04-SH02 | 1151 | 1277 | 126 | L10b |
| S01-B04-SH03 | 1277 | 1334 | 57 | exhale + L11 |
| S01-B05-SH01 | 1334 | 1373 | 39 | V02 |
| S01-B05-SH02 | 1373 | 1429 | 56 | L12a |
| S01-B05-SH03 | 1429 | 1518 | 89 | L12b |
| S01-B05-SH04 | 1518 | 1618 | 100 | L13 |
| S01-B05-SH05 | 1618 | 1684 | 66 | closing (no line) |

**Projected length: 1684 f = 56.13 s** (was 1670 f before the V01 pick, see the pick note below) at 30 fps (cap 60 s, 1800 f): slack 116 f (3.9 s). Matches the W1.4 estimate (55.7 s). Pass, no Preaw cuts. Anchor frames (e.g. `L03.stamp`, `L10.amber`, `L12b`, `L13.exhale`) are in measure.json `anchors`; `kind: whisper` anchors sit inside a continuous run (+-0.15 s), `gap` anchors are energy onsets.

**For the user's ear (open):** "ปี 1966", "นาซ่า" (Whisper heard "NASA"), "สมมติ", L11 air (0.74 s). A breath-like noise at read 8.19-8.35 s sits before L04 "ตัวอาจบวม" (voiced onset taken at 8.456 s); listen at the L03/L04 join. Store: `projects/EDU/narration/ep08/lines/2026-11-08_ep08-nar-L01..L13-kore-A-cut2.wav` (+ `.json`). `store.py use` (public lock) waits for W5.3: `src/videos/edu-ep08/` does not exist yet, so the placed narration track is locked there.

## W4 vocal-sound audition (V01, V02; 2026-11-08, Editor; not listened by me, for the user's pick)

4 Gemini requests (4 of 100/day for these; with the 4 earlier today about 8 used), `gemini-3.8-flash-tts`, one attempt each, exit 0, log `out/logs/ep08-vocal.log`, no atempo, nothing locked. V02 is the clean take; the radio filter is applied at mix time. Store `projects/EDU/audio/EDU-EP08-SHORT/vocal-samples/` (`2026-11-08_ep08-V0x-<voice>-<A|B>.wav` + `.json`).

| Take | Voice | Text | Style idea | Dur (s) | Voiced (s) |
| --- | --- | --- | --- | --- | --- |
| V01-aoede-A | Aoede (AST, woman) | เฮ้ย! | startled, one sharp shocked shout, cut off | 0.96 | 0.18-0.61 |
| V01-aoede-B | Aoede | `<gasp>` เฮ้ย! | breathless panic gasp then the word | 1.56 | 0.14-1.25 |
| V02-algenib-A | Algenib (CREW, man) | จับได้แล้ว! | urgent relieved shout, close to the mic | 1.24 | 0.30-0.88 (short gap 0.39-0.46) |
| V02-algenib-B | Algenib | จับได้แล้ว! | calm trained astronaut, firm | 1.04 | 0.28-0.71 |

The script's V01 is "เฮ้ย—" cut dead; the samples end naturally, the cut is done in the edit (the slot is 30 f, the shot's silence frame is about frame 10 of it).

### User picks (2026-11-08)

V01 = `2026-11-08_ep08-V01-aoede-B.wav` ("<gasp> เฮ้ย!", file 1.56 s, voiced 0.14-1.25 s = 1.11 s). V02 = `2026-11-08_ep08-V02-algenib-A.wav` (1.24 s, voiced 0.30-0.88 s). Fit: V01's voiced part is 34 f, longer than the 30 f slot, so **S01-B01-SH02 grows 30 -> 44 f (+14 f)**: the file is placed whole from the slot start, voiced f 57-91 (gasp ends 6 f before the cut), every later frame shifts +14 and L02 onset is f102. **Total 1670 -> 1684 f = 56.13 s** (cap 1800 f). V02 slot 39 f unchanged (f 1334-1373, voiced f 1343-1360, radio filter at mix time). Note for Film's timed sheet: the storyboard's "silence frame at about 0.35 s of SH02" now falls at the gasp's end, about 1.3 s into SH02 (rim-clear, hard cut to silence); the helmet drift and lip-press staging stretch to 44 f or the sheet cuts the gasp earlier (a user call, since the pick was heard whole). Slots and file starts are in measure.json `vocal`. Re-run `voice-lock.py` regenerates all frames.

### R2 placement at tempo 0.95 (Editor, W5.3 Draft R2, 2026-11-08)

`narration-place.py` runs every locked line file and V01/V02 through `atempo=0.95` (V02 radio filter after, L13 `afade` 0.9 s `qsin` after, fade start = stretched duration - 0.9 s = 2.170 s in the file), places each file whole by `measure.json` (start sample = round(onset G / 30 x 48000) - stretched onset in file), 1762 f = 2 819 200 samples, and zeroes G95-100 sample-exact (9600 samples, verified 0; the sample before is 45 = -57 dBFS, so the step is inaudible). Measured (-40 dBFS, 10 ms) stretched-file onsets differ from the silencedetect (-35 dB) values of the lock by 0.01-0.11 s (L10 0.160 vs 0.053 s: a breath before the word), as in R1; placement uses the lock values. Levels: Kore mean -14.8 dB, V01 +3.6 dB, V02 -1.4 dB. V01's file tail continues at <= -53 dBFS to G103.8 after the zero (below the -35 dB gate). L13 voiced end G1690.8 on the faded file; narration is -80 dB from G1692. Locked: `projects/EDU/audio/EDU-EP08-SHORT/EDU-EP08-SHORT-narration-v3.wav`. Not listened to.

### R1.2 voice re-lock (Editor, 2026-11-08; script EDU-EP08-SCRIPT-R1.2; tempo 0.95, gaps unstretched)

User decisions: **L12** = the cut2 take trimmed before "แต่ข้อมูล…" (same start; voiced 1.5466 s at 1.0, 1.63 s at 0.95; store `projects/EDU/narration/ep08/lines/2026-11-08_ep08-nar-L12-kore-A-trim.wav`). **L13** = the new "comma" take A (`...-L13-kore-A-comma.wav` + `.json`, 5.24 s, text "คุณจะอยากกลั้นหายใจไว้, แต่ในที่ที่ไม่มีอากาศ สิ่งที่ช่วยปอดคุณ คือหายใจออก"), with atempo 0.95 then afade 0.9 s qsin. Other lines, V01, V02 and the exact zero at G95-100 are unchanged (G0-G1443 identical to R1.1). Run: `python3 -I scripts/edu-series/ep08/voice-lock.py --tempo 0.95`, then `narration-place.py` and `sound-mix.py` (both now read the total from `timeline.json`; the sound tail cues shift by D = total - 1762). R1.1 files kept in `out/EDU-EP08-SHORT/audio/prev/` (`-v3-prev`) and `out/edu08/prev-r11/` (measure/timeline JSON).

| Line | Voiced in take (1.0 s) | Voiced at 0.95 (in file) | Onset G | Voiced end G | Frames |
| --- | --- | --- | --- | --- | --- |
| L12 | 0.05-1.597 (of 1.66 s file) | 0.053-1.683 | 1444 | 1493 | 49 (was 144, ends G1588) |
| L13 | 0.2035-4.929 (of 5.24 s file) | 0.201-5.180 (faded: 5.167) | 1512 | 1661 | 149 (was 89, G1603-1692) |

L13 inner gaps (1.0 s, voiced edge to edge): comma 1.508-1.734 = 0.23 s, "แต่ในที่ที่ไม่มีอากาศ" to "สิ่งที่ช่วยปอดคุณ" 0.20 s, to "คือหายใจออก" 0.17 s. All <= 0.3 s (the pause rule); L13 anchors G1560 (แต่), G1599 (สิ่งที่ช่วยปอด; inner cut mid-gap), G1639 (คือหายใจออก). Gap L12 end G1493 -> L13 onset G1512 = 19 f = 0.63 s (cut G1497 + LEAD 15 f = 15 f picture-only; LEAD_OVR L13 11 -> 15 for Film's 15 f; the closing-breath exception, rule gap is 9 f). Take artifacts: two 4 ms / 20 us click blips at -44 dB RMS (peak -31.7 dBFS) at 0.098 s and 1.654 s of the raw take (silence detection joins them; they sit inside the pauses at about G1509 and G1555, under the room tone, unlistened). Total **1731 f = 57.70 s** (was 1762 f; the est. 1750 assumed a shorter L13: 149 f voiced vs 84). L13 faded voiced end G1660.8; closing 66 f from cut G1665.

| Shot | Start | End | Frames | Covers |
| --- | --- | --- | --- | --- |
| S01-B05-SH02 | 1439 | 1497 | 58 | L12a ("ก็อาจรอด"), was 1439-1498 |
| S01-B05-SH03 | 1497 | 1596 | 99 | silent beat 15 f + L13a (was 1498-1592 L12b) |
| S01-B05-SH04 | 1596 | 1665 | 69 | L13b (was 1592-1696 L13) |
| S01-B05-SH05 | 1665 | 1731 | 66 | closing (was 1696-1762) |

### R1.3 voice re-lock (Editor, 2026-11-08; script EDU-EP08-SCRIPT-R1.3; tempo 0.95, gaps unstretched)

User request: **L11** "ปล่อยมันออกมา…" -> "ปล่อยลมหายใจออกมา…" (ER05: "มัน" unclear); user picked take A (cached Gemini result, no API call; raw `out/edu08/pace/L11-new-A-raw.wav`, store `projects/EDU/narration/ep08/lines/2026-11-08_ep08-nar-L11-kore-A-r13-raw.wav` + `.json`). The raw take has 0.272 s of leading silence (voiced 0.272-1.408 s of 1.64 s); it is trimmed 0.222 s so 0.05 s of lead stays, as the cut2 file had (store `...-L11-kore-A-r13-trim.wav`, 1.418 s, voiced 0.050-1.186 s = 1.136 s at 1.0; 1.2416 - 0.0406 = 1.20 s measured at 0.95, onset in file 0.041 s). No inner pause. Rules unchanged: atempo 0.95 per line, gaps unstretched (L11 lead = the exhale beat end, TAIL_OVR 12 f after L11), L13 fade, G95-100 exact zero (verified 0 in both public files), V01/V02 untouched in the lock (V01 slot 55-101, V02 slot keeps 41 f; V02 file and slot just move +14). Script change `voice-lock.py`: L11 now an own-file line (like L13), `L11_READ` keeps the old read times for the neighbours' cut windows; `narration-place.py` asserts R1.3; `sound-mix.py` shifts every cue from the V02 slot on by `E11` (14 f, from timeline.json).

| Item | R1.2 | R1.3 | Delta |
| --- | --- | --- | --- |
| L11 voiced G | 1364-1386 (22 f) | 1364-1400 (36 f) | +14 f |
| V02 slot G (voiced) | 1398-1439 (1407-1426) | 1412-1453 (1421-1440) | +14 |
| L12 voiced G | 1444-1493 | 1458-1507 | +14 |
| L13 voiced G | 1512-1661 | 1526-1675 | +14 |
| Total | 1731 f = 57.70 s | **1745 f = 58.17 s** | **D = +14 f** (cap 1800, slack 55 f) |

| Shot | R1.2 start-end | R1.3 start-end | Moves |
| --- | --- | --- | --- |
| S01-B04-SH03 (exhale + L11) | 1340-1398 (58 f) | 1340-1412 (72 f) | end +14, +14 f longer |
| S01-B05-SH01 (V02) | 1398-1439 | 1412-1453 | +14 |
| S01-B05-SH02 (L12a) | 1439-1497 | 1453-1511 | +14 |
| S01-B05-SH03 (silent beat + L13a) | 1497-1596 | 1511-1610 | +14 |
| S01-B05-SH04 (L13b) | 1596-1665 | 1610-1679 | +14 |
| S01-B05-SH05 (closing) | 1665-1731 | 1679-1745 | +14 |

Every shot before B04-SH03 is unchanged (G0-G1340 identical timeline; narration samples before G1340 differ only inside the V01 gasp, <= 113 LSB = -49 dBFS, because the V01/V02 level match uses the mean Kore level, which moved 0.1 dB: V01 +3.5 dB (was +3.6), V02 -1.4 unchanged; stem differs <= 2 LSB). Anchors L12.maybe 1476 -> 1490, L13.but 1560 -> 1574, L13.help 1599 -> 1613, L13.exhale 1639 -> 1653. Sound plan: tail cues (1692 + D etc.) land on the new L13 end G1675 automatically; cues from the V02 slot on moved +14 (heartbeat 1400/1430, ticks 1433/1482, V02 crackle 1399, warm pad 1417/1433/1481/1487, hatch thud 1482); cues before G1400 (heartbeats 1340/1370, tick 1366, glitter exhale 1349, riser end 1349) unchanged. Files: `public/narration/EDU-EP08-SHORT-narration-v3.wav` and `public/audio/edu/EDU-EP08-SHORT-draft-stem-v3.wav` (1745 f, store `...-v3-r13.wav`, `store.py use --replace`); R1.2 copies in `out/EDU-EP08-SHORT/audio/prev/*-r12-prev.wav`, timeline/measure in `out/ep08-voice/prev-r12/`. Not listened by me; the new L11 and the join to V02 are for the user's ear. Film: shot hold of B04-SH03 (+14 f after L11 voiced end G1400 + 12 f tail) and the scene sheet timings are open.
