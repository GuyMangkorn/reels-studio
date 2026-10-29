---
name: voice-tuning
description: "Thai character voices from the two Edge TTS voices (Premwadee, Niwat): child, elderly and alternate-adult registers, per-line rate, and short-line generation. Use when a line needs a voice other than the narrator, a rate other than the default, or a separately generated short line."
---

# Voice tuning

**Status:** Design/proposed. Recipes are measured (F0, duration, loudness) but **not yet approved by ear**; play the result to the user before it goes into a deliverable. Owner: **Editor**. Evidence and sources: [DF-20261029-edge-tts-voice-tuning](../../../docs/dev-findings/DF-20261029-edge-tts-voice-tuning.md).

## What is possible

- Edge TTS takes only `rate`, `pitch` (Hz) and `volume`. No SSML, styles or roles for Thai voices.
- Edge `pitch` alone raises F0 only → sounds like a high-pitched adult, not a child.
- Character register = edge pitch/rate **plus** an ffmpeg shift that scales pitch and formants together, then restores duration: `SHIFT(k)` = `asetrate` × k → `atempo` 1/k. Keep k within 0.9–1.3.
- Verdicts: alternate adult **feasible**; child and elderly **partly** (an adult reading in a character register; no breathiness, creak or child articulation). A lead child/elderly role with many lines → recorded or dedicated voice instead.

## Steps

1. Record the character, voice and preset per line in the edit plan.
2. Generate each line: `python3 -I scripts/voice-preset.py --preset <name> --text "<Thai line>" <out.wav> [--rate +5%]`. `--list` shows presets (`child-girl-a/b`, `child-boy-a/b`, `elder-woman-a/b`, `elder-man-a/b`, `woman-younger`, `woman-lower`, `man-bigger`, `man-younger`, `woman-base`, `man-base`).
3. Rate: the narration default is +5%; set another rate per line when the moment needs it and record why ([production requirements](../../../docs/production-requirements.md)). Elderly presets fix −15%.
4. Short lines: generate per sentence or per speaker. **Do not split inside one sentence**: each call is spoken as a complete utterance with its own falling end, so the join sounds wrong.
5. Mix the clips in at their cue times; output is already loudness-normalized (−16 LUFS target), re-check in the final mix. `scripts/narration.py` uses one voice for the whole timeline, so character lines are mixed separately until per-scene voice fields exist (Boss runtime change).
6. Send the user the clips to listen to before integrating; record approval.

Service errors (`NoAudioReceived`) are intermittent; the script retries.
