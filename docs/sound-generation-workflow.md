# Sound Generation and Shared Sound Library

**Status:** Requirement for generating sound effects, ambience or music with the local `audio-studio` MCP server and for storing them in the shared sound library. Owner: **Editor** (sound is part of Editor's audio/SFX ownership). Mixing, cue timing and seam rules stay in [editing principles](editor-principles.md#ep08--make-thai-captions-and-voice-lead-the-mix); timeline fields stay in [Remotion toolkit](remotion-toolkit.md#9-sound-cues-sfx--core-audio).

Source of the prompting rules: the [audio-studio-mcp README](https://github.com/kanaworksai-hue/audio-studio-mcp) and the instructions the server sends to the client (`src/audio_studio_mcp/prompts.py`), which follow the official Stable Audio 3 prompt guide. Checked 2026-10-28 at upstream commit `5dc6311`.

## Runtime facts

- Server: `audio-studio` (project-scope MCP in `.mcp.json`; `AUDIO_STUDIO_DIR` overrides the install folder). Tools: `generate_audio`, `edit_audio`, `process_audio`, `unload_models`. Model: Stable Audio 3 medium on Apple Silicon (MLX). Runtime status: `existing-integrated` on this machine (2026-10-28, tools listed by a direct stdio check).
- Instrumental and effects only. It cannot produce intelligible speech, singing or Thai dialogue; narration stays with the [Niwat TTS path](production-requirements.md).
- `generate_audio` / `edit_audio` write 44.1 kHz 24-bit stereo WAV plus a `<name>.wav.json` sidecar (prompt, seed, settings; the README's `<name>.json` is wrong for this version) to the server's output folder (`/Users/mangkornkatawong/Documents/ChatGPT/audio-studio-mcp/outputs/`). `process_audio` never changes its input; it writes a new file and sidecar to the same folder, with the generation info kept under `source`.
- `process_audio` needs `ffmpeg` on `PATH` (`brew install ffmpeg`) for resampling to 48 kHz and loudness normalization; it fails with `ffmpeg not found` otherwise. Remotion's bundled ffmpeg is not a substitute (no OGG/FLAC encoders or spectrogram filter).
- Loaded models use about 5–7 GB of memory. Call `unload_models` after a batch when Blender or a render needs the memory.

## Shared sound library

The library lives **outside this repository** so other projects can use it:

```
/Users/mangkornkatawong/Documents/ChatGPT/sound-library/
  README.md               layout, naming and license (for any project's agent)
  NOTICE.md               license of generated audio
  <type>/<category>/<id>.wav
  <type>/<category>/<id>.json
```

**Types** (top-level folder, one per file):

| Type | Content | `audio_type` | Typical length |
| --- | --- | --- | --- |
| `sfx` | One-shots and short actions: impacts, clicks, whooshes, foley | `sfx` | 1–3 s one-shots, 3–6 s actions |
| `ambience` | Room tone and environment beds, usually looped | `sfx` | 6–15 s, longer for beds |
| `music` | BGM, stingers, beds | `music` | 6–20 s loops, 30–300 s tracks |
| `instrument` | Solo instrument loops and stems | `instrument` | 6–20 s loops, 20–180 s stems |

**Categories** (second-level folder): `action`, `impact`, `whoosh`, `ui`, `foley`, `water`, `nature`, `weather`, `mechanical`, `vehicle`, `electric`, `creature`, `tension`, `reveal`, `comedy`, `room`, `city`, `stinger`, `bed`. Use an existing category when one fits. When none fits, add a lowercase kebab-case category and list it in the library `README.md` in the same step.

**File ID:** `<category>_<descriptor>_<nn>`, lowercase ASCII kebab-case descriptor, two-digit counter, e.g. `sfx/water/water_pool-splash-small_01.wav`. IDs are stable: never rename or overwrite a library file another project may reference. A better take is a new `_02`.

**Library master format:** 48 kHz, 24-bit WAV, stereo. Level: `sfx` peak-normalized to −1 dBFS; `ambience`, `music` and `instrument` loudness-normalized to −14 LUFS (peak ceiling −1 dBFS). The mix level is set later by the timeline `volume`, not by re-processing the master.

**Sidecar:** keep the `process_audio` sidecar `<file>.wav.json` (it embeds the generation prompt, seed and settings) renamed to `<id>.json`, and add a `library` block:

```json
"library": {
  "id": "water_pool-splash-small_01",
  "type": "sfx",
  "category": "water",
  "tags": ["splash", "pool", "small", "indoor"],
  "description": "Small splash of a hand hitting pool water, close, light tile reverb",
  "loop": false,
  "generator": "audio-studio-mcp / Stable Audio 3 medium",
  "license": "Stability AI Community License (see NOTICE.md)",
  "created": "2026-10-28",
  "first_used_by": "Reels Creator / POOLDEPTH"
}
```

`tags` and `description` are English so any project can search them.

## Workflow

1. **Search before generating.** Look for an existing sound by folder and sidecar text, e.g. `grep -ril "splash" /Users/mangkornkatawong/Documents/ChatGPT/sound-library --include=*.json`. Reuse a match that fits; generate only for a gap.
2. **Write the request.** For each needed cue record the cue ID, scene/shot, sync point, intended type/category, length and what the viewer should notice. Thai requests are translated to English for the prompt; the user's own words go verbatim in `original_idea`.
3. **Generate.** Call `generate_audio` with the right `audio_type` (the server adds the `TrackType:` prefix; without the SFX prefix effects often come out as music), `variations` 3–4 and a length from the table above. Prompt rules:
   - English, one or two dense natural sentences, at most about 45 words, no markdown and no vocal words (vocals, singer, lyrics, rap, choir voice).
   - **SFX and ambience:** fill `sound_source` (what makes it), `sound_action` (trigger and evolution: attack, decay, movement, doppler), `sound_material` (texture, timbre, material) and `sound_space` (room, distance, dry/reverberant, mic). `prompt` may hold a one-line overall description. Example: source `glass bottle`, action `shattering on impact, fragments scattering`, material `thick green glass, sharp bright transient`, space `concrete floor, close-up, dry`.
   - **Music:** genre/style + adjectives → main instruments → supporting layers/FX → drums/rhythm → mood, with tempo in `bpm`.
   - **Instrument loop/stem:** instrument + technique + timbre/material + style/mood + recording/production qualities, plus `bpm`.
   - Keep `steps=8`, `cfg=1.0` (the official distilled settings; more steps do not help). Raise `cfg` to 3–7 only for stricter adherence or to make `negative_prompt` work (about 2× slower).
   - Do not ask for precise timing ("hit at 1.2 s"); the model does not follow it reliably. Shape timing afterwards with `edit_audio` (`inpaint` a range, `continue` to extend) or with trimming.
4. **Choose a candidate.** Agents cannot listen, so measure each candidate: duration, peak, RMS envelope (onset time, tail length, residual noise) and a spectrogram image (`ffmpeg -i in.wav -lavfi showspectrumpic=s=1024x384 out.png`) to catch music-like tonal content in an effect or clipping. Pick the candidate whose measured shape matches the request. For a prominent cue, give the user the candidate paths to listen to. Record `listened: user | no` in the cue notes; a measured pick is not an audio approval.
5. **Process.** Call `process_audio` with `sample_rate: 48000`, `format: "wav"` and:
   - `sfx`: `trim_silence: true`, `normalize: "peak"`, a short `fade_out_ms` (10–50 ms) when the tail ends abruptly, and `mono: true` only when a point source should sit centered.
   - `ambience`: `normalize: "loudness"`, `target_lufs: -14`, and `loop: true` with `loop_crossfade_ms` 500–2000 when it will loop.
   - `music`/`instrument`: `normalize: "loudness"`, `target_lufs: -14`; for loops cut on a bar line and use `loop_crossfade_ms` 50–200. Do not fade out music that must loop or end on a `C_seamless` seam ([EP08](editor-principles.md#ep08--make-thai-captions-and-voice-lead-the-mix)).
6. **File into the library.** Copy the processed WAV and its `.wav.json` sidecar to `<type>/<category>/<id>.wav` and `<id>.json`, add the `library` block, and leave the raw candidates in the server output folder (they are scratch). Do not put library files in this repository.
7. **Use in a project.** Copy the library file into the consuming project; do not reference the library path from a timeline. In this repository: `public/sfx/<category>/<id>.wav` for `scene.sfx[]` and `public/audio/<category>/<id>.wav` for `video.audio[]`, plus a sibling `NOTICE` naming the library ID, generator and license ([toolkit §9](remotion-toolkit.md#9-sound-cues-sfx--core-audio), [licenses](production-requirements.md#secrets-brands-and-licenses)). WAV is not Git-ignored: commit only files the episode needs.
8. **Verify in context.** Render the affected range and check the cue against picture and narration per [EP08](editor-principles.md#ep08--make-thai-captions-and-voice-lead-the-mix): attack on the intended frame, tail not cut at a shot boundary, no clipping, no retrigger at a loop seam, narration still clear.

<a id="role-responsibilities"></a>
## Sound across roles

**Requirement:** every role considers music, ambience and SFX for its own output. Sound is a story element (rhythm, mood, reveals, silence), not a late add-on. Roles that the tier skips record `N/A`. Generation, library filing, mixing and sound QA stay with Editor; other roles supply intent and requests, never generated files.

| Role | Sound duty | Output |
| --- | --- | --- |
| Preaw | Record **sound intent** per beat: music mood/energy, where silence helps, and where a stinger, riser or effect carries the beat (hook, clue, twist, ending). English notes beside the beat; Thai narration is unchanged. Sound may add feeling but never replaces a clue or states a fact the script does not. | Script pack beat list |
| Boat | Fact-check sound implications: a siren, gunshot, crowd or music cue must not assert an event, place or casualty the evidence does not support; fictional or reconstructed sound is labelled like fictional visuals. Flag any real recording that needs a source. | Review notes |
| Film | Put a **sound direction** in the brief (checklist below) and check the library [index](#library-index) before asking for new sounds. | Brief `Sound direction` section |
| Mark | Write a `Sound` line in each shot block: ambience/music state, SFX cues with shot-local frame and library ID or `NEEDS-GEN` (prompt fields: source, action, material, space, length), ducking or continuity notes. Cues support the written event frames; they do not replace them. | Scene sheet |
| Boss | Own shared sound capability: registry/renderer fields, asset-attached sounds (contact, footsteps) and tests. Route generation requests to Editor; do not generate sound unless asked. | Shared modules |
| Editor | Generate, filter by measurement, file into the library, mix with narration by beat ([EP08a](editor-principles.md#ep08a-shape-audio-emphasis-by-story-beat) hold/lift/drop/hit/release), run sound QA ([EP08](editor-principles.md#ep08--make-thai-captions-and-voice-lead-the-mix)). | Timeline + library |

### Sound direction checklist

1. **Music:** one bed family per video, two or three energy levels (bed, build, hit), tempo that fits the cut rhythm, an ending plan (fade, hard stop or `C_seamless` continuity), and room for the voice.
2. **Ambience:** a bed per location or time-of-day, with a deliberate change when the place changes; room tone under quiet moments.
3. **Transitions and UI:** a whoosh on movement or cut, a riser into an impact before a reveal (place the riser's stop on the reveal frame), a pop or tick for captions and overlays, and a hit for emphasis. Silence before a hit can be stronger than a cue over every cut.
4. **Foley and creatures:** sounds that sell contact and presence (steps, doors, glass, bites, groans) with a direction and distance that match the shot.
5. **Restraint:** the voice leads. Do not put a sound on every cut; repeated cues become noise. Judge with the actual narration.
6. **Gaps:** list sounds that are not in the library as generation requests (type, category, ID idea, length, sync frame).

### Common cue set

The core set below comes from generic editing and sound-design guides (whoosh, riser, impact, pop/click for transitions and overlays; drones, heartbeats, footsteps, groans and sparse music for horror). They are not platform statistics. Sources checked 2026-10-28: [FlexClip transition sounds](https://flexclip.com/learn/transition-sound-effects.html), [Jupitrr viral breakdown](https://jupitrr.com/video-formats/vault/53iymufzosqe), [Morphic whoosh guide](https://morphic.com/resources/sounds/whoosh-sound-effect), [Dyerbolical on zombie-film sound](https://dyerbolical.com/symphonies-of-the-undead-zombie-films-that-haunt-through-sound/).

<a id="library-index"></a>
### Library index

`/Users/mangkornkatawong/Documents/ChatGPT/sound-library/INDEX.md` lists every file with ID, path, length, loop flag, use and tags. The first batch (2026-10-28, 39 files, **none listened to by a human yet**) covers transitions, UI, impacts, risers and stingers, zombie/horror creatures and foley, ambience beds and music for tension, chase, mystery/explainer and endings. Regenerate the index whenever a sound is added. Loop-flagged beds were crossfaded automatically; listen for a seam before relying on one.

## License

Generated audio falls under the [Stability AI Community License](https://huggingface.co/stabilityai/stable-audio-3-optimized) of the model weights (the server code is MIT). At the time of checking it allows commercial use for individuals and organizations with less than US$1M total annual revenue. Commercial-use eligibility is the user's decision: record the license in each `NOTICE`, and flag it in the delivery record if the channel's eligibility is unknown or changes.
