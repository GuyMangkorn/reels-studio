---
name: gemini-tts-quota-tier1
description: "Gemini TTS key is Tier 1 (paid): 100 requests/day, 10/min; voice library filled 50 clips/day"
type: project
updated: 2026-11-02
---

Gemini `gemini-3.8-flash-tts` on the user's key: Tier 1 (billing on, not free tier) = 100 requests/day and 10/min, shared with editing. Tier 2 needs $100 cumulative spend + 3 days after first payment (automatic), or the "Request paid tier rate limit increase" form.

**Why:** a 256-clip voice-library batch hit the daily cap at 98 clips on 2 Nov 2026.
**How to apply:** fill the voice library with `voice-lib.py batch --max 50` per day (user chose 50, 2 Nov 2026), leaving ~50 requests for editing; never loop on 429.
