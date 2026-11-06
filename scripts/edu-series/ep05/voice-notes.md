# EDU-EP05-SHORT voice notes (W4, Editor, 2026-11-06)

Status: **generated, `audio-measured` (provisional), NOT user-passed. CURRENT narrator read = section 2b (Kore brisk, x1.10, user decision 2026-11-06); sections 1-3 are the earlier teasing A/B history.** Nobody has listened yet; every pick below is by measurement, and the user chooses by ear. Script EDU-EP05-SCRIPT-R1.3a; wording unchanged, `…` became `,` in the TTS text only. Model gemini-tts `gemini-3.8-flash-tts`, no atempo (1.00x).

Store prefix `S/` = `~/ReelsStore/projects/EDU/narration/ep05/`. Local copies and reproduction inputs (style text, `lines-nar.txt`, tsv, alignment scripts) in `out/edu05/voice/` (ignored).

## 1. Kore A/B audition (L01-L02, text "ถ้าคุณตัวเล็กเท่ามด, ตกจากตึกสิบชั้น, คุณจะแทบไม่เป็นอะไรเลย")

| Take | Style | Length | File |
| --- | --- | --- | --- |
| A1 | teasing (brief.md#voice-casting text) | 4.48 s | `S/audition/2026-11-06_ep05-aud-A1.wav` |
| A2 | teasing | 4.32 s | `S/audition/2026-11-06_ep05-aud-A2.wav` |
| B1 | EP02 base prompt unchanged | 3.88 s | `S/audition/2026-11-06_ep05-aud-B1.wav` |
| B2 | EP02 base prompt unchanged | 4.56 s | `S/audition/2026-11-06_ep05-aud-B2.wav` |

Measured only: A (4.3-4.5 s) and B (3.9-4.6 s) overlap, so the teasing clause does not make the read drag. Tone (smirk, laughing, speaker identity) is not measurable; the user listens.

**Pick: A (teasing)**, provisional. Why: no pace penalty in the numbers, and it is the Film/user intent ("กวน ๆ") for a script that teases in its words. The full read was made with A. Fallback B needs a new full read (1 request, ~1 min).

## 2b. Full NAR read v2, user's decision 2026-11-06 (Kore, brisk style, atempo 1.10) - CURRENT

Supersedes sections 1-3 for the narrator (the teasing A pick and EP02 B are dropped; no teasing clause). Style text: "brisk delivery with short pauses between phrases, playful deadpan female narrator, dry and matter-of-fact, natural conversational pace, just a touch slower than very fast, without dragging". Voice Kore, `gemini-3.8-flash-tts`, ONE request, text = `out/edu05/voice/lines-nar.txt` as one continuous read (L01-L17 without L08, same method as the first full read). Reference sample the user approved: `out/edu05/voice/dogstyle/ep03style-touch-slower-x110.wav` (first 3 lines).

Files (store prefix `S/`):
- `S/2026-11-06_ep05-nar-kore-brisk-fullread-raw-api.wav` raw API take (unnormalised, as returned)
- `S/2026-11-06_ep05-nar-kore-brisk-fullread.wav` raw pace, 48 kHz mono, loudnorm -16 LUFS, 61.04 s (+ `.json` style/text/cache key)
- `S/2026-11-06_ep05-nar-kore-brisk-fullread-x110.wav` the same at atempo 1.10, 48 kHz mono, 55.50 s, -15.95 LUFS, LRA 2.3, true peak -1.5 dBFS (no clipping; max sample -1.5 dB)
Local: `out/edu05/voice/nar-kore-brisk*.wav`. Old first read stays in the store (`...teasing-fullread.wav`) as history. Status: generated, `audio-measured`, NOT user-passed (user has not heard the full read).

Per-line times at x1.10 (Whisper large-v3-turbo alignment, match ratio 0.83 on raw; boundaries +-0.3 s, L12-L15 least reliable; cross-checked with silence edges -35 dB / 0.18 s):

| Line | Start | End | Dur (s) | Gap before |
| --- | --- | --- | --- | --- |
| L01 | 0.00 | 1.24 | 1.24 | |
| L02 | 1.74 | 4.54 | 2.80 | 0.50 |
| L03 | 5.10 | 7.36 | 2.26 | 0.56 |
| L04 | 7.92 | 10.44 | 2.52 | 0.56 |
| L05 | 11.18 | 15.00 | 3.82 | 0.74 |
| L06 | 15.42 | 18.24 | 2.82 | 0.42 |
| L07 | 18.86 | 21.04 | 2.18 | 0.62 |
| L09 | 21.66 | 25.30 | 3.64 | 0.62 |
| L10 | 26.06 | 27.72 | 1.66 | 0.76 |
| L11 | 28.26 | 30.60 | 2.34 | 0.54 |
| L12 | 31.00 | 34.72 | 3.72 | 0.40 |
| L13 | 35.14 | 37.14 | 2.00 | 0.42 |
| L14 | 37.72 | 39.72 | 2.00 | 0.58 |
| L15 | 39.72 | 45.52 | 5.80 | (L14/L15 merged by alignment; silence edge at 41.24-41.67) |
| L16 | 46.30 | 51.14 | 4.84 | 0.78 |
| L17 | 51.50 | 55.18 | 3.68 | 0.36 |

Totals at x1.10: file 55.50 s; 27 internal gaps = 11.5 s (0.19-0.71 s by silence detection, plus 0.22 s lead and 0.27 s tail); speech alone 43.5 s. At raw pace: 61.04 s, gaps 13.4 s, speech 47.6 s. Whole-read ratio is 1/1.10 as expected; per-line differences from raw/1.1 are alignment noise.

### Length (W1.4) at x1.10

- Script estimate NAR ~49.5 s. **Measured 55.5 s as read (+12 %); 51.1 s with the 27 gaps re-set to 0.28 s** (43.5 + 27 x 0.28). The first read was 50.1 s re-gapped, so this style is about 1 s longer once re-gapped: the faster atempo does not buy length back.
- Video estimate (NAR + L08 ~2.4 s + non-overlapping V sounds ~5 s + 0.8 s silence + 2-3 s hold): **about 67 s as read, 61-65 s re-gapped. Both pass 60 s.** To land at 60 s the NAR needs about 2-5 s less speech.
- Lines to trim, longest first (x1.10 durations): **L15 5.8 s** (three clauses), **L16 4.8 s**, **L05 3.8 s**, **L12 3.7 s**, **L17 3.7 s**, **L09 3.6 s**. Cutting one clause from L15 and one from L16 would give about 3 s. Decision for the user/Preaw (script change, not mine). Alternative: accept ~62 s (a Short may run to 60 s; this is over).
- W1.4 not ticked.

(Older read, history)

## 2. Full NAR read (A style, one request, 16 NAR lines L01-L17 without L08)

File `S/2026-11-06_ep05-nar-kore-teasing-fullread.wav`: 56.00 s as read, -16.0 LUFS, LRA 4.3. Word alignment by Whisper (+-0.15 s) cross-checked with silence edges (-35 dB, 0.18 s).

| Line | Start | End | Dur (s) |
| --- | --- | --- | --- |
| L01 | 0.28 | 1.21 | 0.93 |
| L02 | 1.55 | 4.16 | 2.61 |
| L03 | 4.77 | 6.93 | 2.16 |
| L04 | 7.46 | 10.15 | 2.69 |
| L05 | 10.73 | 15.21 | 4.48 |
| L06 | 15.83 | 19.17 | 3.34 |
| L07 | 19.93 | 22.02 | 2.09 |
| (L08 TINY sits in the 0.6 s gap) | | | |
| L09 | 22.62 | 26.07 | 3.45 |
| L10 | 26.71 | 28.49 | 1.78 |
| (V04 sits in the 0.94 s gap) | | | |
| L11 | 29.43 | 31.78 | 2.35 |
| L12 | 32.33 | 35.92 | 3.59 |
| L13 | 36.56 | 38.54 | 1.98 |
| (planned silence + V06: gap is 0.78 s) | | | |
| L14 | 39.32 | 41.67 | 2.35 |
| L15 | 42.16 | 48.73 | 6.57 |
| L16 | 49.42 | 52.26 | 2.84 |
| L17 | 52.66 | 55.75 | 3.09 |

No late drift seen in the numbers (loudness steady, last lines same pace); timbre drift is for the ear. The read has the model's 28 internal gaps (13.3 s total, 0.18-0.94 s); speech alone is 42.2 s.

## 3. Length (W1.4)

- Estimate in the script: NAR ~49.5 s. **Measured: 55.5 s of narration as read (+12 %), 50.1 s with the gaps re-set to 0.28 s (28 gaps, EP04 convention), 47.7 s at that plus atempo 1.05** (not wanted for Kore; shown for reference).
- Brief threshold: report if the Kore read exceeds ~51 s of speech. As read it does; re-gapped it does not (50.1 s).
- Video estimate (NAR + non-overlapping TINY sounds + 0.8 s silence + 2-3 s end hold): re-gapped about **60-64 s** if L08 (~2.4 s speech) and the V sounds that do not overlap the NAR (V03, V04 trimmed, V06, V08 ~5 s) are all placed in series; as read about **68 s**. Shorts target is 40-60 s (production-requirements), so as read it is over by 13 %. Flags:
  - **L15 is 6.6 s** (three clauses, the longest line); the likeliest trim for Preaw if the user wants length back.
  - **L05 4.5 s**, **L12 3.6 s**, **L06 3.3 s** are the next longest.
  - Gap L13-L14 is 0.78 s but the script wants silence + V06 + the ant entrance there: Editor extends it (counted in the estimate above).
  - L08 is spoken over a 0.6 s gap: Editor inserts ~2.4 s.
- W1.4 verdict: **measured; borderline.** As read it fails (video ~68 s); with re-gapping it lands ~60-64 s, at the 5 % line. Decision for the user/Preaw: accept re-gap only, or trim L15 (and/or one line). Not ticked.

## 4. TINY (Leda, 2 takes each, 18 requests; files `S/tiny/<ID>-t1.wav`, `-t2.wav`)

| ID | t1 (s) | t2 (s) | Whisper heard (t1 / t2) | Provisional pick and note |
| --- | --- | --- | --- | --- |
| L08 | 3.24 | 3.24 | "ทำไมมันเหนียวแบบนี้" / "ทำไมน้ำเป็นเนี่ยแบบนี้" | t1 (closer to text; "น้ำ" may be swallowed, listen); speech ~2.4 s inside 3.24 s |
| V01 | 0.60 | 0.56 | "หัก" / "หัก" | t1 (a squeak; heard as a word by Whisper only) |
| V02 | 1.48 | 2.16 | "อาาาา" / "อ้าาาาาาา" | t2 (longer tail for the fade under L05) |
| V03 | 1.88 | 1.48 | "เฮ้" / "อ่ะ?" | open: both lack a "หือ"; check giggle by ear; maybe 3rd take |
| V04 | 6.20 | 4.16 | "อืม..." x6 / "อ่ะ...อ่ะ..." | t2, **needs trimming** (4.2 s is too long for the release; cut to the grunts + gasp) |
| V05 | 1.32 | 1.28 | "บรุ" / "อื้ออื้อ" | t1 (nearest to "บรึ๋ย") |
| V06 | 3.36 | 2.24 | "อ้าว...ห้อ..." / "น่า..." | t2 (shorter) |
| V07 | 0.72 | 0.64 | "หัว!" / "หัว" | t1; ear check |
| V08 | 1.00 | 1.16 | "หัก!" / **"โอ้โหโห"** | **t1; t2 rejected (heard as a word)** |

Whisper on wordless sounds hallucinates short words ("หัก", "หัว"), so these are not rejects by themselves; the brief rule is "reject any take heard as a word" and only V08 t2 is a clear case. The 2-of-3 Leda fallback test (Aoede) is not triggered by measurement; the user's ear decides. No Aoede take made.

## 5. Open issues

1. User must listen: audition A vs B, the full read (timbre drift, teasing tone), the Leda TINY takes. W4 is not passed.
2. Length: see section 3 (decision needed: re-gap only vs trim L15).
3. V03 has no "หือ" in either take; V04 t2 needs a cut; V08 t2 rejected.
4. Not done: per-beat split, anchor-onset measure file (`narration-measure.json`), final lock; these follow the user's approval of the voice and the length decision.
5. Quota: 4 + 1 + 18 = 23 Gemini requests today in this run.
