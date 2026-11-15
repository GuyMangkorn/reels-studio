---
name: gemini-tts
description: "Thai speech with real emotion and character voices from Gemini TTS: excited, sad, whispered, angry delivery; laughs, sighs, sobs; designed voices by age and gender. Use when a line needs an emotion or a character that Edge TTS cannot act."
---

# Gemini TTS

**Status:** live-tested on the free tier on 2026-10-30; the project key is on the **paid tier** since 2026-10-31 (samples in `out/gemini-tts-test/`): Thai lines generate with style (excited lines ~35% shorter, sad ~20% longer than neutral) and inline tags; an elderly designed voice works; a **child voice design is refused** (`Voice prompt was blocked by safety policies`). The user approved the Thai accent and emotion by ear for Kore and Charon (neutral, excited, sad, whisper, tags) on 2026-10-30; the designed elderly voice speaking Thai is not yet heard. Still play each new character voice to the user before it goes into a deliverable. Owner: **Editor**. Edge narration and the [voice-tuning skill](../voice-tuning/SKILL.md) stay the default narrator path; this skill is for acted lines.

## What is possible

Three layers, each with its own job. Keep each trait in its own layer; the docs report drift when they are mixed.

- **Voice = who speaks** (gender, age, timbre, accent). Pick a prebuilt voice, or design one from a text description for an adult age the prebuilt set lacks (elderly). Children: use the voice-tuning presets. Every voice is multilingual; none is Thai-native. Voices and descriptors: [reference.md](reference.md#voices).
- **Style = how this line is said** (emotion, pace, volume): `speech_metadata.style`, a short English phrase per line, e.g. `"excited and breathless, fast"`, `"heartbroken, slow and quiet"`, `"tense secretive whisper"`. Start empty; add style only where the line needs it.
- **Inline tags = moments inside the line**: `<laugh>`, `<sigh>`, `<sob>`, `<gasp>`, `<whispering>`, `<short pause>`… in English inside the Thai text. Emphasis = CAPITALS (Latin words only). Full list: [reference.md](reference.md#inline-tags).

Model `gemini-3.8-flash-tts` only (Flash-Lite has no Thai). Language is detected from the text. Output 24 kHz mono; the script resamples to 48 kHz and normalizes to −16 LUFS.

## Steps

1. **Cast.** Record per character in the edit plan: voice (prebuilt name or `voice_…` ID), and per line: style and tags. One voice per character for the whole episode.
2. **Design a voice** only when no prebuilt voice fits: `out/gemini-venv/bin/python -I scripts/gemini-tts.py design --name <id> --gender female|male --text "<one or two sentences: age, gender, timbre, accent, baseline delivery>" <sample.wav>`. Play the sample to the user; record the returned `voice_…` ID beside the character.
3. **Generate each line:** `out/gemini-venv/bin/python -I scripts/gemini-tts.py say --voice <voice> [--style "<phrase>"] --text "<Thai line with tags>" <out.wav>`. One call per line or speaker turn for acted dialogue; narration follows [one narrator](#narration-one-narrator) instead. The `.json` sidecar keeps the settings for regeneration. A repeat call with the same model, voice, style and text reuses the cached take (`$REELS_STORE/cache/tts/`) and makes no billed API call; pass `--fresh` only when the user wants a new take of an unchanged line.
4. **Listen and retry.** Results vary per call. Generate 2–3 takes for a key line and pick. Text is spoken verbatim: stage directions belong in `--style`, never in the line.
5. **Mix** the clips at their cue times, as in the voice-tuning skill (step 5). Re-check loudness in the final mix.
6. **Approve.** Send the user the clips before integrating; record approval per character voice.

Setup, key, and listing voices: the module docstring of `scripts/gemini-tts.py`.

## Narration (one narrator)

A narrator must sound like one speaker for the whole video. Per-beat calls with different moods sound like different speakers (BLOOP-EP01-SHORT, 30 Oct 2026).

1. **One read, one style.** Generate the whole narration in one call (`--text-file`), or in as few chunks as possible with the identical voice and the identical `--style` text. Do not vary style per beat; let the words carry the mood.
2. **Ellipses become commas** in the TTS text only (`…` / `...` → `,`); the script keeps them. Ellipses caused speaker changes inside one read.
3. **Late drift.** A long single read can drift late (faster, another timbre). Regenerate only the drifting tail as one chunk with the same style plus `same narrator as the opening, do not speed up`; make 2–3 variations and let the user pick by ear. Measured numbers (pitch, rate) can rank the takes, but they do not replace listening.
4. **Split per beat** with Whisper word alignment (`scripts/transcribe.py` gives estimates, not boundaries), then move each cut into the nearest real energy gap between audible runs so no word is clipped. Measure each beat's anchor onsets into the measure file for the [voice lock](../../../docs/delivery-workflow.md#voice-lock).

Tools for splitting one read (all local, no API calls; Whisper venv for the first and third): [`scripts/narration/align-full.py`](../../../scripts/narration/align-full.py) (Whisper alignment of one read to the script's anchor phrases, cuts it into beats), [`cut-gaps.py`](../../../scripts/narration/cut-gaps.py) (moves each cut into the nearest real energy gap), [`voice-match.py`](../../../scripts/narration/voice-match.py) (ranks tail variations against the opening by F0, centroid and rate; the user still picks by ear) and [`assemble-narration.py`](../../../scripts/narration/assemble-narration.py) (beat clips into a track on a slot plan). All take explicit paths; first used for BLOOP-EP01-SHORT.

## Limits and costs

- **Billing.** The project key is on the paid tier (since 31 Oct 2026). Billing is per token, not per request: text in plus audio out (≈ 1,500 tokens per minute of audio → about $0.014/min until 31 Dec 2026, double from 1 Jan 2027). Several calls per line (takes, tail variations) are fine; cost follows the length of what is generated. Paid-tier data is not used to improve Google's products, so unreleased scripts may go through it.
- **No loops.** Paid keys still have per-minute and per-day rate limits. The script makes one attempt per call with no SDK retries: HTTP 429 or a quota error exits 3 with the server message, and no answer within `--timeout` (default 180 s) exits 4. Rules for any wrapper or batch script:
  - Voice or style auditions for the user to choose from are **≤ 10 s each** (the opening line or two), never a full-script read per candidate: [voice audition cap](../../../docs/delivery-workflow.md#voice-audition-cap).
  - **Sample before every full read (Requirement):** no full narration read until the user picked from ≤ 10 s samples; re-tunes of voice, style or pace sample first too: [rule](../../../docs/delivery-workflow.md#sample-before-full-read).
  - Every loop over calls has a fixed bound (the list of lines × a fixed take count, 2–3 for a key line). No `while` until a take "sounds right" and no retry-until-success.
  - Stop the whole batch on the first exit 3 or 4 and report it; do not retry 429s automatically. A rerun after a pause is a single manual call.
  - A batch skips clips whose `.wav` and `.json` already exist, so a rerun never pays twice for a finished line.
- Prebuilt-voice dialogue can go in one request (2 speakers max); the script makes single-speaker calls, which also works for designed voices.
- Commercial-use terms and SynthID watermarking are **unchecked**; check before the first delivery that uses this voice.
