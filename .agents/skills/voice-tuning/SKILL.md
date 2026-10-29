---
name: voice-tuning
description: "Thai character voices from the two Edge TTS voices (Premwadee, Niwat): child, elderly and alternate-adult registers, per-line rate, and short-line generation. Use when a line needs a voice other than the narrator, a rate other than the default, or a separately generated short line."
---

# Voice tuning

**Status:** Design/proposed. Recipes are measured (F0, duration, loudness) but **not yet approved by ear**; play the result to the user before it goes into a deliverable. Owner: **Editor**. Evidence and sources: [DF-20261029-edge-tts-voice-tuning](../../../docs/dev-findings/DF-20261029-edge-tts-voice-tuning.md).

## What is possible

- Edge TTS takes only `rate`, `pitch` (Hz) and `volume`. No SSML, styles or roles for Thai voices.
- Edge `pitch` alone raises F0 only → sounds like a high-pitched adult, not a child.
- Alternate adult = edge pitch **plus** an ffmpeg shift that scales pitch and formants together (`SHIFT(k)`, k 0.9–1.3).
- Child and elderly must **not** use that shift (user, 2026-10-29: child = chipmunk, elderly = not old). They resynthesize with F0, formants, range and duration set separately: child via Praat `Change gender` (F0 ~250–275 Hz, formants only ×1.08–1.12 from Premwadee), elderly via WORLD (F0 ~162 / ~150 Hz, narrower range, slower, ~5 Hz tremor, jitter, shimmer, breath). These need the venv `out/voice-venv` (install line in the script docstring).
- Verdicts: alternate adult **feasible**; child and elderly round 2 **pending the user's ear**. No child articulation or creak. A lead child/elderly role with many lines → recorded or dedicated voice instead.

## Steps

1. Record the character, voice and preset per line in the edit plan.
2. Generate each line: `python3 -I scripts/voice-preset.py --preset <name> --text "<Thai line>" <out.wav> [--rate +5%]` (child/elderly: `out/voice-venv/bin/python -I scripts/voice-preset.py …`). `--list` shows presets: `child-girl`, `child-girl-lively`, `child-boy`, `child-boy-niwat`, `elder-woman(-strong)`, `elder-man(-strong)`, `woman-younger`, `woman-lower`, `man-bigger`, `man-younger`, `woman-base`, `man-base`.
3. Rate: the narration default is +5%; set another rate per line when the moment needs it and record why ([production requirements](../../../docs/production-requirements.md)). Elderly presets fix −20% and stretch a further ×1.1.
4. Short lines: generate per sentence or per speaker. **Do not split inside one sentence**: each call is spoken as a complete utterance with its own falling end, so the join sounds wrong.
5. Mix the clips in at their cue times; output is already loudness-normalized (−16 LUFS target), re-check in the final mix. `scripts/narration.py` uses one voice for the whole timeline, so character lines are mixed separately until per-scene voice fields exist (Boss runtime change).
6. Send the user the clips to listen to before integrating; record approval.

Service errors (`NoAudioReceived`) are intermittent; the script retries.
