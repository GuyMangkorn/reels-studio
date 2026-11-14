# EDU-EP16 narrator audition samples (Editor, 2026-11-13)

User request (13 Nov 2026): several narrator voices for EDU-EP16..18 including Kore, picked by ear. Script R2.1 (`script.md`), ≤ 10 s per sample ([audition cap](../../../docs/delivery-workflow.md#voice-audition-cap)); full read only after the pick ([rule](../../../docs/delivery-workflow.md#sample-before-full-read)). Not a user choice yet.

## Text (identical, from script.md R2.1, unaltered)

L01 + L02 (32 syllables): `สมมติว่ารูหนอน พาหมู่บ้านคุณ ไปโผล่ยุคไดโนเสาร์… ป่ารอบบ้านเขียวทั้งป่า… แต่แทบไม่มีอะไรที่คุณกินได้`

Each voice was read once with L01 + L02 + L03 (47 syllables, `…` sent as `,`); the raw reads ran 10.1–13.9 s, so every sample is cut at the pause after L02 (inside the silent gap, 80 ms fade-out). L03 does not fit 10 s for the slower voices (Achernar, Umbriel), so it is dropped for all to keep the text identical. API calls: 5 (one per voice), no retries, no 429.

## Samples

Measured syllables/s = 32 / (duration minus 0.2 s lead silence / rate); includes the two pauses. Loudness: each raw read normalised to -16 LUFS by `gemini-tts.py`. Raw reads are kept as `raw_<voice>.wav` (not for the user).

| ID | File | Voice | Style prompt | Rate | Duration | Syll/s |
| --- | --- | --- | --- | --- | --- | --- |
| A | `A_kore_warm-smiling_x1.08.wav` | Kore (f, Firm) | warm, friendly, smiling storyteller, speaking rapidly | x1.08 | 6.42 s | 5.13 |
| B | `B_kore_warm-smiling_x1.15.wav` | Kore | same read as A | x1.15 | 6.02 s | 5.47 |
| C | `C_achernar_playful-camping_x1.05.wav` | Achernar (f, Soft) | playful and a little cheeky, like a friend who has been camping (Preaw's EP16 tone, script.md series plan) | x1.05 | 8.93 s | 3.66 |
| D | `D_achernar_playful-camping_x1.08.wav` | Achernar | same read as C | x1.08 | 8.69 s | 3.76 |
| E | `E_puck_camp-leader_x1.05.wav` | Puck (m, Upbeat) | brisk upbeat camp leader, energetic and confident, with a dry joke | x1.05 | 7.68 s | 4.27 |
| F | `F_umbriel_gentle-calm_x1.05.wav` | Umbriel (m, Easy-going) | gentle, calm and reassuring, easy-going, unhurried | x1.05 | 8.76 s | 3.73 |
| G | `G_schedar_dry-deadpan_x1.05.wav` | Schedar (m, Even) | dry deadpan, matter-of-fact, amused, speaking quickly | x1.05 | 8.36 s | 3.92 |

Rate for E-G is x1.05, the narrator default (memory: non-character narrator +5%); one file per voice, no other variants.

## Why these three (by gemini-tts reference descriptors)

- **Puck (Upbeat, male):** matches EP17's brisk camp-leader countdown; the lively male colour is furthest from Kore and Achernar.
- **Umbriel (Easy-going, male):** the calm, unhurried voice for EP18's gentle warmth; lower energy than every other sample.
- **Schedar (Even, male):** an even, flat delivery for the dry-joke register ("หรอก", "แทบไม่มี"); differs from Puck (energy) and Umbriel (warmth) by staying level.

Male picks differ in colour from the two female voices; if the user wants another female colour, Sulafat (Warm) and Aoede were heard in earlier EDU rounds (`J-sulafat-...`, `edu18-woman-opt-*` in the samples store).

## Findings

- Achernar reads about 25% slower than Kore on the same text (3.7 vs 4.8 syll/s at near pace); at x1.08 it is still slower than Kore x1.08. The user may want a faster Achernar if picked.
- Cut points were chosen from silence gaps at about 68% of each read (the L02/L03 boundary), not from alignment; no Whisper check, listen for a clipped last word.

## Files

- Clean folder (to send): `out/samples/ep16-voices/send/` (ignored)
- Asset store: `~/ReelsStore/projects/edu/EDU/samples/send/<file>` (archive kind=samples, project EDU; the store flattened the folder, raw reads are in `.../samples/raw_*.wav`)
- Reproduce: `gemini-tts.py say --voice <voice> --style "<style>" --text <L01-L03 with … as ,> out.wav`, then `ffmpeg -t <cut> -af afade,atempo=<rate>` (cuts s: Kore 6.92, Achernar 9.37, Puck 8.05, Umbriel 9.18, Schedar 8.77).
