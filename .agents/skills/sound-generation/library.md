# Shared sound library

The library lives **outside this repository** so other projects can use it:

```
/Users/mangkornkatawong/Documents/ChatGPT/sound-library/
  README.md               layout, naming and license (for any project's agent)
  NOTICE.md               license of generated audio
  INDEX.md                every file with ID, path, length, loop flag, use and tags
  <type>/<category>/<id>.wav
  <type>/<category>/<id>.json
```

## Types

One top-level folder per type:

| Type | Content | `audio_type` | Typical length |
| --- | --- | --- | --- |
| `sfx` | One-shots and short actions: impacts, clicks, whooshes, foley | `sfx` | 1–3 s one-shots, 3–6 s actions |
| `ambience` | Room tone and environment beds, usually looped | `sfx` | 6–15 s, longer for beds |
| `music` | BGM, stingers, beds | `music` | 6–20 s loops, 30–300 s tracks |
| `instrument` | Solo instrument loops and stems | `instrument` | 6–20 s loops, 20–180 s stems |

## Categories

Second-level folder: `action`, `impact`, `whoosh`, `ui`, `foley`, `water`, `nature`, `weather`, `mechanical`, `vehicle`, `electric`, `creature`, `tension`, `reveal`, `comedy`, `room`, `city`, `stinger`, `bed`. Use an existing category when one fits. When none fits, add a lowercase kebab-case category and list it in the library `README.md` in the same step.

## File ID

`<category>_<descriptor>_<nn>`, lowercase ASCII kebab-case descriptor, two-digit counter, e.g. `sfx/water/water_pool-splash-small_01.wav`. IDs are stable: a library file another project may reference keeps its name and content forever. A better take is a new `_02`.

## Master format

48 kHz, 24-bit WAV, stereo. Level: `sfx` peak-normalized to −1 dBFS; `ambience`, `music` and `instrument` loudness-normalized to −14 LUFS (peak ceiling −1 dBFS). The mix level is set later by the timeline `volume`, not by re-processing the master.

## Sidecar

Keep the `process_audio` sidecar `<file>.wav.json` (it embeds the generation prompt, seed and settings) renamed to `<id>.json`, and add a `library` block (`scripts/sound-library.py file` does both):

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
