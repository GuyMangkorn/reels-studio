---
name: narration-trim-pauses
description: Trim silent gaps between narration sentences shorter; EG-EP01 voice = Achernar, awake style, atempo 1.08
type: feedback
---

Cut the pauses/silence between sentences in generated narration shorter (user, 3 Nov 2026, EVERYONE-GONE voice samples).

**Why:** Gemini TTS leaves long gaps (esp. around `<short pause>` and commas); user wants tighter pacing.
**How to apply:** after generating, trim inter-sentence silence (e.g. ffmpeg silenceremove / cap gaps to ~0.2-0.3 s) before measuring line durations; use fewer `<short pause>` tags. Chosen for EG-EP01: Achernar, style "calm, soft and close, awake, quiet wonder" (not sleepy), atempo 1.08. See [[voice-achernar-narrator]] and [[narrator-pace-plus5]].
Opening arc chosen: one read, "starts sleepy ... gradually wakes up", Achernar, x1.08 (take t1).
