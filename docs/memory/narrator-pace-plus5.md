---
name: narrator-pace-plus5
description: Default narrator (non-character voice) is sped up +5% (ffmpeg atempo=1.05) after TTS generation
type: feedback
updated: 2026-10-30
---

For a narrator that is not a story character, speed the generated narration up 5% by default (pitch-preserving, `ffmpeg -filter:a atempo=1.05`).

**Why:** user decision 31 Oct 2026 on HANAKO-SHORT, where the Gemini read ran 94.4 s vs 56.2 s estimated; +5% alone gives ≈89.9 s, so length still needs a script or pacing fix. Character voices are not covered.
**How to apply:** apply to narrator clips after generation and measure durations on the sped clips; do not change character voices. Matches the existing Edge default (Niwat +5%) in docs/production-requirements.md. This is a user preference only: the written rule in docs is proposed, not edited (DP01).
