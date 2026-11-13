# MGF-EP01-LONG — full acted read measure (W1.4), R2

Script `MGF-EP01-SCRIPT-R2` (R2.1, `script.md`, Acting column). Measured 2026-11-11 by Editor, after the user picked sample A (moderate acted Leda). Voices from `delivery.md`: FON/NARR = Gemini TTS **Leda**, pace 1.0 (acted character, no atempo); MOM = **Sulafat**; RADIO = **Charon** + radio filter (highpass 400, lowpass 3400, acrusher 10 bits mix 0.25, volume 1.5, alimiter 0.9). Model `gemini-3.8-flash-tts`.

**Verdict: INSIDE the 180–300 s target.** Assembled voices-only length **281.3 s** (script estimate ≈ 262 s; W1.4 limit 315 s). Speech alone is 234.6 s. W1.4 ticked. Margin to 300 s is 18.7 s, and SFX holds longer than the script's stated ones would eat it (see What the numbers say).

## How it was read
- 68 clips, one take each, one `say` call per line with the row's Acting text as `--style` (short English) and its inline tags in the TTS text; `…` sent as a comma, except where the row names `<short pause>` (`L03`, `L07h`, `L16a`, `L16h`, `L16j`). Calls: **60 API calls + 8 cached takes** (`L03`, `L06`, `L16h`, `L27`, `L34b` from the `out/samples/mgf-ep01-acting/` samples; `L07a`, `L17`, `L30` from the R1.1 read: identical text and style). 0 failures, no exit 3/4. The primary key hit HTTP 429 on 22 calls; `gemini-tts.py` switched once per call to `GEMINI_API_KEY_REEL_EXTRA` as designed and all succeeded.
- Tag-only rows tried (one call each): `L05a` `<gasp>`, `L35e` `<whimper>`, `L17` `<cough>` (MOM). `L46` = `<cough> ฝน, ลูกแม่`. Not listened to by Editor (no ears in this run): check by ear whether these are acted sounds or speech; fallback is Ton SFX.
- SMS read by NARR as `L24`, `L27`, `L32`, `L34` (the SMS rows `L23/L26/L31/L33` carry the same text). Not voiced: SFX rows, SMS-only rows `L02`, `L07e`, `L16d`, `L16f`, `L35d`, `L38`, `L44c`, `L47`; bubble-only. Not generated: `L19` (cut in R2).
- Clips trimmed to speech (-45 dB, 0.04 s edge), `L07a`/`L07b` radio-filtered, concatenated in script cue order with floor gap 0.35 s and explicit holds (listed in `out/samples/mgf-ep01-fullread-r2/assemble.py`, `PRE`): opening 0.6, knocks before `L05` 1.4, `L06` 0.8, silence before `L15` 1.0, SMS exchange before `L16g` 3.5, no answer before `L16l` 1.5, stinger before `L22` 1.0, full silence `L27`→`L28` 1.5, creak before `L30` 1.2, taps before `L32c` 1.4, creak+buzz before `L35e` 1.2, door clack before `L46` 1.8, end hold 3.0. Loudnorm −16 LUFS, voices only (no SFX, no music).
- Files: `out/samples/mgf-ep01-fullread-r2/` (`assembled-voices-r2-preview.mp3`, `assembled-voices-r2.wav`, `lines/` raw takes + sidecars, `trim/`, `timeline.json`, `lines.tsv` styles and texts, `run.py`, `assemble.py`).

## Per line (speech seconds after edge trim; placed start in the assembled read)

| ID | Speaker | Voice | Placed start (s) | Speech s |
| --- | --- | --- | --- | --- |
| `L03` | NARR | Leda | 0.6 | 5.24 |
| `L05` | MOM | Sulafat | 7.24 | 4.02 |
| `L05a` | FON | Leda | 11.75 | 0.54 |
| `L06` | NARR | Leda | 13.09 | 2.55 |
| `L06a` | NARR | Leda | 15.99 | 4.13 |
| `L07` | NARR | Leda | 20.47 | 1.2 |
| `L07a` | RADIO | Charon + radio filter | 22.02 | 5.34 |
| `L07b` | RADIO | Charon + radio filter | 27.86 | 4.13 |
| `L07c` | NARR | Leda | 32.49 | 3.82 |
| `L07d` | NARR | Leda | 36.66 | 5.88 |
| `L07f` | NARR | Leda | 42.89 | 1.87 |
| `L07g` | NARR | Leda | 45.36 | 5.57 |
| `L07h` | NARR | Leda | 51.44 | 3.93 |
| `L07i` | NARR | Leda | 55.87 | 5.88 |
| `L08` | NARR | Leda | 62.55 | 2.61 |
| `L08a` | NARR | Leda | 65.5 | 1.66 |
| `L09` | NARR | Leda | 67.51 | 4.07 |
| `L10` | NARR | Leda | 71.93 | 3.12 |
| `L11` | FON | Leda | 75.85 | 3.01 |
| `L12` | MOM | Sulafat | 79.36 | 2.82 |
| `L13` | NARR | Leda | 82.58 | 2.18 |
| `L14` | FON | Leda | 85.11 | 1.96 |
| `L15` | MOM | Sulafat | 88.07 | 1.63 |
| `L16` | NARR | Leda | 90.05 | 1.19 |
| `L16a` | NARR | Leda | 91.59 | 5.8 |
| `L16b` | NARR | Leda | 97.74 | 3.3 |
| `L16c` | NARR | Leda | 101.39 | 2.28 |
| `L16g` | NARR | Leda | 107.17 | 1.27 |
| `L16h` | NARR | Leda | 108.84 | 3.5 |
| `L16i` | NARR | Leda | 112.74 | 2.98 |
| `L16j` | FON | Leda | 116.12 | 3.19 |
| `L16l` | MOM | Sulafat | 120.8 | 3.08 |
| `L16m` | NARR | Leda | 124.38 | 4.33 |
| `L17` | MOM | Sulafat | 129.22 | 1.69 |
| `L18` | MOM | Sulafat | 131.25 | 3.28 |
| `L20` | NARR | Leda | 135.04 | 3.89 |
| `L22` | NARR | Leda | 139.93 | 1.88 |
| `L24` | NARR | Leda | 142.31 | 3.98 |
| `L27` | NARR | Leda | 147.29 | 2.52 |
| `L28` | NARR | Leda | 151.31 | 5.21 |
| `L30` | MOM | Sulafat | 157.72 | 4.36 |
| `L32` | NARR | Leda | 162.88 | 0.75 |
| `L32a` | NARR | Leda | 164.04 | 4.12 |
| `L32c` | NARR | Leda | 169.55 | 1.7 |
| `L34` | NARR | Leda | 172.16 | 2.64 |
| `L34a` | NARR | Leda | 175.14 | 2.63 |
| `L34b` | NARR | Leda | 178.12 | 2.4 |
| `L35` | NARR | Leda | 180.88 | 4.2 |
| `L35a` | MOM | Sulafat | 185.48 | 3.28 |
| `L35b` | NARR | Leda | 189.11 | 4.34 |
| `L35e` | FON | Leda | 194.65 | 1.76 |
| `L36` | NARR | Leda | 197.31 | 4.52 |
| `L37` | NARR | Leda | 202.18 | 2.93 |
| `L39` | NARR | Leda | 205.91 | 9.57 |
| `L40` | NARR | Leda | 216.08 | 4.64 |
| `L41` | NARR | Leda | 221.07 | 5.79 |
| `L42` | NARR | Leda | 227.21 | 2.89 |
| `L43` | NARR | Leda | 230.45 | 5.56 |
| `L43a` | NARR | Leda | 236.35 | 3.03 |
| `L44` | NARR | Leda | 239.74 | 3.53 |
| `L44a` | NARR | Leda | 243.61 | 2.28 |
| `L46` | MOM | Sulafat | 247.69 | 4.26 |
| `L46a` | NARR | Leda | 252.44 | 7.68 |
| `L46b` | MOM | Sulafat | 260.47 | 2.44 |
| `L46c` | FON | Leda | 263.26 | 0.8 |
| `L46d` | NARR | Leda | 264.86 | 2.53 |
| `L46e` | NARR | Leda | 267.89 | 6.47 |
| `L46g` | NARR | Leda | 275.36 | 2.97 |

## Totals

- Speech per voice: NARR (Leda) 183.0 s, FON (Leda) 11.3 s (Leda total 194.3 s), MOM (Sulafat) 30.9 s, RADIO (Charon) 9.5 s. Speech total **234.6 s** (script estimate 197.7 s at 3 syll/s: the acted read is ≈ 19 % slower, ≈ 2.5 syll/s).
- **Assembled 281.3 s** vs target 180–300 s: inside. Per-stage assembled time (voices + holds; stage boundary = first line of the next stage): S1 12.3 s (speech 9.8), S2 126.6 s (107.1), S3 10.9 s (8.4), S4 65.7 s (54.4), S5 65.8 s (54.9). Script estimate per stage: 13.0 / 124.5 / 9.2 / 54.8 / 60.9; S4 and S5 run 11 s and 5 s over because `L39` reads 9.6 s and `L46a`/`L46e` 7.7/6.5 s.

## What the numbers say (Editor, not a script decision)
- The edit may add SFX-only beats (taps, buzzes, door, fog) that the 0.35 s default gaps only partly cover. The picture-side holds already counted are those in the script; if the shots need more air than ≈ 18 s in total, the pre-listed cut order applies: `L06a` (4.1 s), `L07` lead-in (1.2 s), `L16b` (3.3 s), `L46d` (2.5 s), `L35b` (4.3 s), together ≈ 15.4 s of speech plus their gaps ≈ 18 s.
- `L39` (9.6 s for a 17-syllable line) and `L46a` (7.7 s) are the slowest reads (acted slow/tearful); a user listen may want them tighter. Not changed here.

## Lines for Ton (SFX/voice sounds to check or supply)
- Check by ear, then keep or replace with an SFX cough/whimper/gasp: `L05a` `<gasp>` (0.54 s), `L17` `<cough>` (1.69 s), `L35e` `<whimper>` (1.76 s), the cough at the start of `L46`, `<chuckle>` end of `L07d`, `<sob>` end of `L46a`, `<exhales>` end of `L16`.
- Silent bubble-only rows need no voice; their buzz/tap SFX come from the cue sheet.
- Stems for levels: NARR/FON, MOM, RADIO are separable by `timeline.json` speaker.

---

# Superseded: MGF-EP01-SHORT R1.1 full read (kept for reference)


Script R1.1 (`script.md`); voices from `delivery.md` (FON/NARR = Gemini TTS Leda pace 1.0, MOM = Sulafat, RADIO = Charon + hp400/lp3400/acrusher 0.25). One take per clip, no retries, no exit 3/4. Measured 2026-11-11 by Editor.

**Verdict: OVER.** Measured speech 102.1 s alone exceeds the 94.5 s limit; assembled ≈ 124.4 s (target 60–90 s, limit 94.5 s). W1.4 not ticked.

## How it was read
- NARR + FON: one call (`narr.wav`, 96.1 s raw incl. ≈ 1 s breaths between lines; ellipses to commas; style "young woman telling her own story in first person, tense hushed storyteller, quiet and controlled, one steady style"). 27 lines (L03 … L44, FON rows L11/L14 inside). Cut into lines at whisper word starts, cut in the middle of the silence before each line; edges trimmed to speech (+0.04/+0.08 s). No late drift check by ear (not listened to); line order confirmed from the transcript gaps.
- MOM Sulafat: one call per line (L05, L12, L15, L17, L18, L30, L46). L30 style "hoarse and urgent, panicked, short of breath, banging on a closed door". L17 = `<cough>` alone, L46 = `<cough> ฝน, ลูกแม่` (the reference lists `<cough>`). Not listened to: whether the coughs are acted coughs or speech; Whisper heard L17 as "อื้อ" (vocal sound), so check by ear, else Ton SFX.
- RADIO L07a: Charon (cached sample take, same text), filter applied.
- Lines `L23/L26/L31/L33` (SMS) are read by NARR as `L24/L27/L32/L34`; `L38`, `L47` not voiced.

## Per line (speech seconds after edge trim)

| ID | Speaker | Voice | Placed start (s) | Speech s |
| --- | --- | --- | --- | --- |
| `L03` | NARR | Leda | 0.6 | 5.45 |
| `L05` | MOM | Sulafat | 7.4 | 4.06 |
| `L06` | NARR | Leda | 12.1 | 2.46 |
| `L07` | NARR | Leda | 14.9 | 1.22 |
| `L07a` | RADIO | Charon + radio filter | 16.5 | 5.39 |
| `L08` | NARR | Leda | 22.4 | 2.91 |
| `L09` | NARR | Leda | 25.7 | 2.60 |
| `L10` | NARR | Leda | 28.6 | 3.16 |
| `L11` | FON | Leda | 32.1 | 2.16 |
| `L12` | MOM | Sulafat | 34.7 | 3.83 |
| `L13` | NARR | Leda | 38.8 | 4.91 |
| `L14` | FON | Leda | 44.1 | 2.22 |
| `L15` | MOM | Sulafat | 47.3 | 1.81 |
| `L16` | NARR | Leda | 49.5 | 0.66 |
| `L17` | MOM | Sulafat | 50.5 | 1.99 |
| `L18` | MOM | Sulafat | 52.8 | 2.82 |
| `L19` | NARR | Leda | 56.0 | 1.70 |
| `L20` | NARR | Leda | 58.1 | 1.59 |
| `L22` | NARR | Leda | 60.4 | 1.15 |
| `L24` | NARR | Leda | 61.9 | 1.37 |
| `L27` | NARR | Leda | 63.8 | 1.11 |
| `L28` | NARR | Leda | 66.1 | 2.37 |
| `L30` | MOM | Sulafat | 69.3 | 4.58 |
| `L32` | NARR | Leda | 74.4 | 0.96 |
| `L34` | NARR | Leda | 75.9 | 1.73 |
| `L35` | NARR | Leda | 78.0 | 3.14 |
| `L36` | NARR | Leda | 81.4 | 3.63 |
| `L37` | NARR | Leda | 85.4 | 2.66 |
| `L39` | NARR | Leda | 88.6 | 5.75 |
| `L40` | NARR | Leda | 94.9 | 2.64 |
| `L41` | NARR | Leda | 97.9 | 5.12 |
| `L42` | NARR | Leda | 103.4 | 2.00 |
| `L43` | NARR | Leda | 105.7 | 4.85 |
| `L44` | NARR | Leda | 110.9 | 4.64 |
| `L46` | MOM | Sulafat | 117.4 | 3.49 |

## Totals

- Speech per voice: NARR 69.8 s, FON 4.4 s (both Leda = 74.2 s), MOM 22.6 s, RADIO 5.4 s. Speech total **102.1 s** (script estimate 54.7 s: the Leda read is ≈ 1.9× the 5.5 syll/s reference; ≈ 3 syll/s).
- Assembly (rough, `assemble` = script cue order): each line starts after the previous line's end plus a floor gap 0.35 s; script holds as explicit gaps: knocks before L05 1.4, L07 lead 0.35, L15 1.0 (silence), L22 0.8 (stinger), L27 to L28 1.2 (full silence, via L28 pre 1.2), creak before L30 0.9, L40 0.6, door clack before L46 1.8, other buzz leads 0.3–0.5, opening 0.6, end hold 3.5 s after L46 (L47 hold, no speech). Non-speech ≈ 22.3 s. SFX lengths are the script's, not generated.
- **Assembled ≈ 124.4 s**. At ±2 s uncertainty on floors this stays > 94.5 s. Files: `out/samples/mgf-ep01-fullread/assembled-voices-preview.mp3` (voices only, loudnorm −16 LUFS, no SFX, no music).

## What the numbers say (Editor, not a script decision)
- To fit 94.5 s with ≈ 22 s non-speech, speech must be ≤ ≈ 72 s: about 30 s (29 %) less than measured. Preaw's named cuts: `L19` 1.70 s, `L22` 1.15 s, `L13` to "หนูต้องถามเรื่องที่มันไม่มีทางรู้" (about 1 s, unmeasured) ≈ 4 s of speech, ≈ 5 s with lead gaps: not enough.
- A +5 % speed-up of Leda saves ≈ 3.7 s on NARR+FON; user picked pace 1.0, so any speed change needs a sample first (sample-before-full-read). Speed alone to 1.4× is not credible.
- Back to Preaw (via coordinator): script cut of roughly 30 s of spoken text (≈ 100 spoken syllables out of 301), keeping clue order P1–P8 and `L40–L44`; then re-measure. Voice pace change is the user's call.
