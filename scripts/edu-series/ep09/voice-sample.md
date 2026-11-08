# EDU-EP09-SHORT voice samples (W1.4 step 1, Editor, 2026-11-08)

No full read yet; the user picks first. Script EDU-EP09-SCRIPT-R1.1 L01-L03 (V01 skipped), ellipses as commas in the TTS text only:
`วางมือแบนบนโต๊ะ พับนิ้วกลางลงไป, แล้วลองยกนิ้วนางดูสิ, ยกได้นิดเดียว, หรือไม่ขึ้นเลยใช่ไหม, เบา ๆ นะ อย่าเอามืออีกข้างดึง`

Voice Gemini Kore, `gemini-3.8-flash-tts`, no atempo, 3 requests (one attempt each, exit 0), log `out/logs/ep09-samples.log`, inputs `out/ep09-voice/`. Only `--style` differs. Not listened by me; durations by ffprobe.

Store: `~/ReelsStore/projects/EDU/voice/ep09-nar-kore-{A,B,C}.wav` (+ `.json`).

| Cand | Style | Dur |
| --- | --- | --- |
| A | EP06/EP08 style A: playful deadpan, dry, matter-of-fact | 8.76 s |
| B | teasing challenge, "daring a friend to try it now", playful, curious | 8.20 s |
| C | warm, gently amused, friend guiding step by step, reassuring | 9.00 s |

All styles include "fast-paced, brisk, short pauses, speaking quickly without dragging".

## Re-tune: "แบน" in L01 (user pick A, 2026-11-08)

Note: "the word แบน sounds odd". 2 takes of L01 only (`วางมือแบนบนโต๊ะ พับนิ้วกลางลงไป`), style A + "pronounce every word clearly", Kore, 2 requests, exit 0. Script text unchanged; TTS text only. Not listened by me.

| Take | TTS text change | Dur |
| --- | --- | --- |
| ban1 | spaces around the word: `วางมือ แบน บนโต๊ะ,` | 2.60 s |
| ban2 | respelling `แบนน` (same tone, longer final) | 3.36 s |

Store: `~/ReelsStore/projects/EDU/voice/ep09-nar-kore-A-ban{1,2}.wav`. Synonym fallback "ราบ" not used (would change script wording).
