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
