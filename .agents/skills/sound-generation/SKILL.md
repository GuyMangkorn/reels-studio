---
name: sound-generation
description: "Sound effects, ambience and music from the local audio-studio MCP, filed into the shared sound library. Use when a cue needs a sound the library lacks, when searching the library for a reusable sound, or when processing or filing generated audio."
---

# Sound generation

**Status:** Requirement for generating sound effects, ambience or music with the local `audio-studio` MCP server and for storing them in the shared sound library. Owner: **Editor** (sound is part of Editor's audio/SFX ownership). Each role's sound duties, the direction checklist, the library index and the license stay in [sound across roles](../../../docs/sound-generation-workflow.md). Mixing, cue timing and seam rules stay in [editing principles](../../../docs/editor-principles.md#ep08--make-thai-captions-and-voice-lead-the-mix); timeline fields stay in [Remotion toolkit](../../../docs/remotion-toolkit.md#9-sound-cues-sfx--core-audio).

Source of the prompting rules: the [audio-studio-mcp README](https://github.com/kanaworksai-hue/audio-studio-mcp) and the instructions the server sends to the client (`src/audio_studio_mcp/prompts.py`), which follow the official Stable Audio 3 prompt guide. Checked 2026-10-28 at upstream commit `5dc6311`.

## Runtime facts

- Server: `audio-studio` (project-scope MCP in `.mcp.json`; `AUDIO_STUDIO_DIR` overrides the install folder). Tools: `generate_audio`, `edit_audio`, `process_audio`, `unload_models`. Model: Stable Audio 3 medium on Apple Silicon (MLX). Runtime status: `existing-integrated` on this machine (2026-10-28, tools listed by a direct stdio check).
- Instrumental and effects only. It cannot produce intelligible speech, singing or Thai dialogue; narration stays with the [Niwat TTS path](../../../docs/production-requirements.md).
- `generate_audio` / `edit_audio` write 44.1 kHz 24-bit stereo WAV plus a `<name>.wav.json` sidecar (prompt, seed, settings; the README's `<name>.json` is wrong for this version) to the server's output folder (`/Users/mangkornkatawong/Documents/ChatGPT/audio-studio-mcp/outputs/`). `process_audio` never changes its input; it writes a new file and sidecar to the same folder, with the generation info kept under `source`.
- `process_audio` needs `ffmpeg` on `PATH` (`brew install ffmpeg`) for resampling to 48 kHz and loudness normalization; it fails with `ffmpeg not found` otherwise. Remotion's bundled ffmpeg is not a substitute (no OGG/FLAC encoders or spectrogram filter).
- Loaded models use about 5–7 GB of memory. Call `unload_models` after a batch when Blender or a render needs the memory.

Library layout, types, categories, file IDs, master format and the sidecar `library` block: [library.md](library.md).

## Workflow

1. **Search before generating.** Look for an existing sound by folder and sidecar text, with `python3 -I scripts/sound-library.py search splash` (or `grep -ril "splash" /Users/mangkornkatawong/Documents/ChatGPT/sound-library --include=*.json`). Reuse a match that fits; generate only for a gap. Done when every needed cue has a library ID or is listed as a gap.
2. **Write the request.** For each gap record the cue ID, scene/shot, sync point, intended type/category ([library.md](library.md)), length and what the viewer should notice. Thai requests are translated to English for the prompt; the user's own words go verbatim in `original_idea`.
3. **Generate.** Call `generate_audio` with the right `audio_type` (the server adds the `TrackType:` prefix; without the SFX prefix effects often come out as music), `variations` 3–4 and a length from the [type table](library.md#types). Prompt rules:
   - English, one or two dense natural sentences, at most about 45 words, no markdown and no vocal words (vocals, singer, lyrics, rap, choir voice).
   - **SFX and ambience:** fill `sound_source` (what makes it), `sound_action` (trigger and evolution: attack, decay, movement, doppler), `sound_material` (texture, timbre, material) and `sound_space` (room, distance, dry/reverberant, mic). `prompt` may hold a one-line overall description. Example: source `glass bottle`, action `shattering on impact, fragments scattering`, material `thick green glass, sharp bright transient`, space `concrete floor, close-up, dry`.
   - **Music:** genre/style + adjectives → main instruments → supporting layers/FX → drums/rhythm → mood, with tempo in `bpm`.
   - **Instrument loop/stem:** instrument + technique + timbre/material + style/mood + recording/production qualities, plus `bpm`.
   - Keep `steps=8`, `cfg=1.0` (the official distilled settings; more steps do not help). Raise `cfg` to 3–7 only for stricter adherence or to make `negative_prompt` work (about 2× slower).
   - Shape timing after generation with `edit_audio` (`inpaint` a range, `continue` to extend) or with trimming; the model does not follow precise timing requests ("hit at 1.2 s") reliably.
4. **Choose a candidate.** Agents cannot listen, so measure each candidate: duration, peak, RMS envelope (onset time, tail length, residual noise) and a spectrogram image (`ffmpeg -i in.wav -lavfi showspectrumpic=s=1024x384 out.png`) to catch music-like tonal content in an effect or clipping. Pick the candidate whose measured shape matches the request. For a prominent cue, give the user the candidate paths to listen to. Record `listened: user | no` in the cue notes; a measured pick is not an audio approval.
5. **Process.** Call `process_audio` with `sample_rate: 48000`, `format: "wav"` and:
   - `sfx`: `trim_silence: true`, `normalize: "peak"`, a short `fade_out_ms` (10–50 ms) when the tail ends abruptly, and `mono: true` only when a point source should sit centered.
   - `ambience`: `normalize: "loudness"`, `target_lufs: -14`, and `loop: true` with `loop_crossfade_ms` 500–2000 when it will loop.
   - `music`/`instrument`: `normalize: "loudness"`, `target_lufs: -14`; for loops cut on a bar line and use `loop_crossfade_ms` 50–200. Music that must loop or end on a `C_seamless` seam keeps its full level to the last sample, with no fade-out ([EP08](../../../docs/editor-principles.md#ep08--make-thai-captions-and-voice-lead-the-mix)).
6. **File into the library.** `python3 -I scripts/sound-library.py file <processed>.wav <type>/<category>/<id> --description "…" --tags "…" [--loop] [--first-used-by "Reels Creator / <EPISODE>"]` copies the processed WAV and its `.wav.json` sidecar to `<type>/<category>/<id>.wav` and `<id>.json`, adds the `library` block and appends the INDEX row (`index` reports drift). Then add `selection` notes if candidates were compared, and leave the raw candidates in the server output folder (they are scratch). Library files live only in the shared library, outside this repository.
7. **Use in a project.** Copy the library file into the consuming project; timelines reference the copy, never the library path. In this repository: `public/sfx/<category>/<id>.wav` for `scene.sfx[]` and `public/audio/<category>/<id>.wav` for `video.audio[]`, plus a sibling `NOTICE` naming the library ID, generator and license ([toolkit §9](../../../docs/remotion-toolkit.md#9-sound-cues-sfx--core-audio), [licenses](../../../docs/production-requirements.md#secrets-brands-and-licenses), [generated-audio license](../../../docs/sound-generation-workflow.md#license)). WAV is not Git-ignored: commit only files the episode needs.
8. **Verify in context.** Render the affected range and check the cue against picture and narration per [EP08](../../../docs/editor-principles.md#ep08--make-thai-captions-and-voice-lead-the-mix): attack on the intended frame, tail not cut at a shot boundary, no clipping, no retrigger at a loop seam, narration still clear. Done when every new cue passes these checks on rendered frames.
