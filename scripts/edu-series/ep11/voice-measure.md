# EDU-EP11-SHORT voice measure

Samples: [voice-sample.md](voice-sample.md). Script EDU-EP11-SCRIPT-R2.

## Full read (W1.4 step 2, 2026-11-08)

User pick (2026-11-08): Gemini Kore, style A, then slowed 8 % (atempo=0.92, sample `A-slow-0.92`). **One Gemini request**, one attempt, exit 0, log `out/logs/ep11-full.log`; `gemini-3.8-flash-tts`, style exactly as ep11-nar-kore-A: `fast-paced, brisk, short pauses, speaking quickly without dragging, playful deadpan female narrator, dry and matter-of-fact`. Text `out/ep11-voice/full/lines-nar.txt`: the 16 NAR lines of R2 (L01-L16, L16 last), one per line, ellipses as commas; L10 year spelled `หนึ่งพันแปดร้อยห้าสิบสี่` (N3); V01-V04 not read. Raw 50.88 s; `ffmpeg atempo=0.92` -> **55.29 s**. **Not listened by me.** Line edges from ffmpeg `silencedetect -35 dB / 0.10 s` assigned by syllable position and comma pauses (no ASR), +-0.1 s; least certain: L03/L04, L07/L08, L15/L16.

| Line | Start | End | Dur (s) | Syl |
| --- | --- | --- | --- | --- |
| L01 | 0.10 | 4.44 | 4.34 | 17 |
| L02 | 5.10 | 7.48 | 2.38 | 13 |
| L03 | 8.37 | 12.64 | 4.26 | 17 |
| L04 | 12.99 | 14.87 | 1.88 | 10 |
| L05 | 15.47 | 17.60 | 2.13 | 12 |
| L06 | 18.35 | 21.48 | 3.14 | 14 |
| L07 | 21.96 | 23.31 | 1.35 | 8 |
| L08 | 23.66 | 25.07 | 1.41 | 7 |
| L09 | 25.76 | 28.13 | 2.36 | 10 |
| L10 | 29.00 | 33.66 | 4.66 | 20 |
| L11 | 34.22 | 36.48 | 2.26 | 9 |
| L12 | 37.01 | 40.84 | 3.83 | 23 |
| L13 | 41.60 | 43.80 | 2.20 | 11 |
| L14 | 44.24 | 48.38 | 4.13 | 16 |
| L15 | 48.72 | 50.20 | 1.48 | 7 |
| L16 | 50.79 | 55.03 | 4.24 | 16 |

- Speech alone **46.08 s** (210 syl, 4.56 syl/s); NAR as read (0.10-55.03) **54.9 s**; re-gapped at 0.28 s (15 gaps, the EP08 standard) = **50.28 s NAR**. Script N1 estimate 49.8 s (0.237 s/syl x 210): re-gapped +1 %, as read +10 %.
- NAR per beat (as read, speech only): B01 L01-L02 0.1-7.5; B02 L03-L05 8.4-17.6; B03 L06-L08 18.3-25.1; B04 L09-L12 25.8-40.8; B05 L13-L16 41.6-55.0.
- **Projected video** = NAR + non-NAR items from N1 (V01 0.6, V02 1.7, V03 0.5, V04 0.4, black 0.4, gasp 0.6, clamp 0.6, hold 2.0 = 6.8 s): re-gapped **57.1 s**; as read (raw gaps, nothing overlapped) **61.7 s**. Caveat: V01-V04 may sit inside raw gaps (0.65-0.89 s) so the real total is between the two; estimate until Film retimes.
- **Verdict (cap 60 s, tolerance 5 % = 63 s):** re-gapped 57.1 s is under the cap; as read 61.7 s is 1.7 s over the cap (+2.9 %) but inside the 5 % rule. **Pass, no Preaw cut required**; the margin is thin (2.9 s under the cap re-gapped, 1.3 s under 63 s as read), so the 0.28 s re-gap is assumed in W2 timing.
- **Proposal only (not applied; script.md untouched):** if Film's retime runs over 60 s, N1 cut set C1 (L07 + V04, about -2.3 s nominal, -1.35 s measured L07 plus gap and V04 0.4), C2 (L09 shortened, about -0.7 s), C3 (L12 shortened, about -1.4 s). C1 first.
- For the user's ear: "ถ้าสลิงลิฟต์ขาด" start, "หนึ่งพันแปดร้อยห้าสิบสี่" (L10), "ซะอีก" (L12), whether L16 ends on a clean "แล้วรอ".
- Store: `projects/EDU/voice/ep11-nar-kore-A-fullread.wav` (raw, 50.88 s) and `ep11-nar-kore-A-fullread-x0.92.wav` (55.29 s) with `.json` sidecar. Local reproduction inputs `out/ep11-voice/full/` (ignored). Per-line split is not done (W4 voice lock).

## Full read R3 (text-only re-read, 2026-11-08)

Script EDU-EP11-SCRIPT-R3 changed two lines only: L02 (dropped นะ) and L16 (หรอก -> เลย). Setting already user-picked (Kore, style A, atempo 0.92), so no new sample ([sample before full read](../../../docs/delivery-workflow.md#sample-before-full-read)). **One Gemini request**, one attempt, exit 0, log `out/logs/ep11-full-r3.log`; same model and style string as the first full read. Text `out/ep11-voice/full/lines-nar-r3.txt` = the first file with L02 `...อะไรเลย` and L16 `ถ้าเจอลิฟต์ค้างจริง, ไม่ต้องกระโดดเลย, กดปุ่มฉุกเฉิน แล้วรอ` (comma, i.e. the script's ellipsis, after เลย so the word ends cleanly and is not run into กดปุ่ม); no respelling, no other wording change (the gemini-tts skill has no pronunciation tag; punctuation only). It is a whole new take, so every line moved. Raw 48.80 s; `atempo=0.92` -> **53.02 s** (previous 55.29 s). **Not listened by me**; a Whisper (large-v3-turbo) pass reads L02 as `จากความ... แทบไม่ช่วยอะไรเลย` (one เลย) and L16 as `...ไม่ต้องกระโดดเลย / ... แล้วรอ` with no โอย-like word; it is an ASR check, not an ear check. Edges from silencedetect -35 dB / 0.10 s plus Whisper segments, +-0.1 s.

| Line | Start | End | Dur (s) |
| --- | --- | --- | --- |
| L01 | 0.25 | 4.41 | 4.16 |
| L02 | 4.99 | 7.47 | 2.48 |
| L03 | 7.64 | 11.98 | 4.35 |
| L04 | 12.52 | 14.71 | 2.19 |
| L05 | 15.15 | 17.34 | 2.19 |
| L06 | 17.71 | 20.55 | 2.84 |
| L07 | 21.07 | 22.76 | 1.69 |
| L08 | 23.10 | 24.53 | 1.43 |
| L09 | 25.04 | 27.16 | 2.12 |
| L10 | 27.71 | 31.22 | 3.51 |
| L11 | 31.68 | 33.74 | 2.06 |
| L12 | 34.08 | 38.32 | 4.25 |
| L13 | 38.84 | 40.88 | 2.04 |
| L14 | 41.26 | 45.56 | 4.29 |
| L15 | 45.94 | 47.64 | 1.70 |
| L16 | 48.10 | 52.75 | 4.65 |

- Speech alone **45.95 s** (209 syl); NAR as read (0.25-52.75) **52.5 s**; re-gapped at 0.28 s (15 gaps) = **50.15 s NAR**.
- **Projected video** (+ 6.8 s non-NAR items from N1): re-gapped **56.95 s**; as read **59.3 s**. Both under the 60 s cap; the 5 % rule (63 s) is not needed. Margin 3.0 s re-gapped (cap). No Preaw cut required.
- L16 now has a 0.4 s pause after เลย (the comma) and runs 4.65 s; ending "กดปุ่มฉุกเฉิน แล้วรอ" 51.7-52.75.
- Store: `projects/EDU/voice/ep11-nar-kore-A-r3-x0.92.wav` (53.02 s) with `.json` sidecar, raw `ep11-nar-kore-A-r3.wav` (48.80 s), beside the first take (kept). Local `out/ep11-voice/r3/`.

## R3 loudness note (user, 2026-11-08, after hearing the R3 read)

User: "กดปุ่มฉุกเฉินแล้วรอ => เสียงเหมือน db สูงกว่าเพื่อน". Measured (volumedetect mean, take `ep11-nar-kore-A-r3-x0.92`): the speech average is about −15.8 dB (−16.3 to −15.0 across L01–L16 front); "กดปุ่มฉุกเฉิน" (50.85–51.74 s) −13.8 dB (+2.0); "แล้วรอ" (52.07–52.75 s) −12.8 dB (+3.0). The text and voice are unchanged; this is level only.

Check take (coordinator, not filed): `out/ep11-voice/full/ep11-nar-kore-A-r3-x0.92-lvl.wav`, gain −2.0 dB at 50.60–51.95 s and −3.0 dB at 51.95–53.2 s; the two phrases now measure −15.8 dB. **For Editor at W4/W5:** apply the same two gains (or loudness-match each NAR phrase) when placing the line, and re-measure per line before the mix; peak stays −1.5 dB.
