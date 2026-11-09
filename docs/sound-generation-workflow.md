# Sound Generation and Shared Sound Library

**Status:** Requirement. This document holds each role's sound duties, the sound direction checklist, the library index, the sound cue sheet and the generated-audio license. Owner: **Ton** (sound engineer). Mixing, cue timing and seam rules stay in [editing principles](editor-principles.md#ep08--make-thai-captions-and-voice-lead-the-mix); timeline fields stay in [Remotion toolkit](remotion-toolkit.md#9-sound-cues-sfx--core-audio).

<a id="runtime-facts"></a>
<a id="shared-sound-library"></a>
<a id="workflow"></a>
**Generating, processing or filing a sound** with the local `audio-studio` MCP follows the [`sound-generation` skill](../.agents/skills/sound-generation/SKILL.md): runtime facts, the eight-step workflow, and the [library layout and naming](../.agents/skills/sound-generation/library.md). Claude Code and Codex both load it as a skill; any agent can read the file directly.

<a id="role-responsibilities"></a>
## Sound across roles

**Requirement:** every role considers music, ambience and SFX for its own output. Sound is a story element (rhythm, mood, reveals, silence), not a late add-on. A stage recorded `N/A` records `N/A` for sound too. Generation, library filing and the [cue sheet](#sound-cue-sheet) stay with Ton; mixing and sound QA stay with Editor; other roles supply intent and requests, never generated files.

| Role | Sound duty | Output |
| --- | --- | --- |
| Preaw | Record **sound intent** per beat: music mood/energy, where silence helps, and where a stinger, riser or effect carries the beat (hook, clue, twist, ending). English notes beside the beat; Thai narration is unchanged. Sound may add feeling but never replaces a clue or states a fact the script does not. | Script pack beat list |
| Boat | Fact-check sound implications: a siren, gunshot, crowd or music cue must not assert an event, place or casualty the evidence does not support; fictional or reconstructed sound is labelled like fictional visuals. Flag any real recording that needs a source. | Review notes |
| Film | Put a **sound direction** in the brief (checklist below), designed from the story ([fit beats reuse](#fit-beats-reuse)). | Brief `Sound direction` section |
| Film | Write a `Sound` line in each shot block: ambience/music state, and each SFX cue with its shot-local frame and a **description** of the sound (source, action, material, space, length, what the viewer should feel), then a library ID only when that file fits the description, otherwise `NEEDS-GEN`; ducking or continuity notes. Cues support the written event frames; they do not replace them. | Scene sheet |
| Boss | Own shared sound capability: registry/renderer fields, asset-attached sounds (contact, footsteps) and tests. Route generation requests to Ton; do not generate sound unless asked. | Shared modules |
| Ton | After the timed scene sheets (W5.1), in parallel with Boss: make every cue's sound from its description ([fit beats reuse](#fit-beats-reuse)), choose candidates by measurement, file them into the library, lock them for the episode and write the [cue sheet](#sound-cue-sheet) with its level targets ([EP08b](editor-principles.md#ep08b-keep-each-layer-at-its-distance-from-the-voice)) (W5.2s). A cue Ton cannot make goes back to Film with the reason. After each draft cut, measure the stems with `python3 -I scripts/mix-levels.py <cue sheet>` and send failing rows to Editor through the round's [fix list](delivery-workflow.md#ai12). | Cue sheet + library + level report |
| Editor | Place the cue sheet's sounds, mix with narration by beat ([EP08a](editor-principles.md#ep08a-shape-audio-emphasis-by-story-beat) hold/lift/drop/hit/release), run sound QA ([EP08](editor-principles.md#ep08--make-thai-captions-and-voice-lead-the-mix)) and pass `python3 -I scripts/sound-cues.py <cue sheet>` before every draft and final render. Mix to the cue sheet's level targets and export the draft stems into its `levels.stems` ([EP08b](editor-principles.md#ep08b-keep-each-layer-at-its-distance-from-the-voice)). A cue that fails in the mix goes back to Ton through the round's [fix list](delivery-workflow.md#ai12); a different sound needs a swap in the cue sheet. | Timeline |

### Sound direction checklist

1. **Music:** one bed family per video, two or three energy levels (bed, build, hit), tempo that fits the cut rhythm, an ending plan (fade, hard stop or `C_seamless` continuity), and room for the voice.
2. **Ambience:** a bed per location or time-of-day, with a deliberate change when the place changes; room tone under quiet moments.
3. **Transitions and UI:** a whoosh on movement or cut, a riser into an impact before a reveal (place the riser's stop on the reveal frame), a pop or tick for captions and overlays, and a hit for emphasis. Silence before a hit can be stronger than a cue over every cut.
4. **Foley and creatures:** sounds that sell contact and presence (steps, doors, glass, bites, groans) with a direction and distance that match the shot.
5. **Restraint:** the voice leads. Do not put a sound on every cut; repeated cues become noise. Judge with the actual narration.
6. **Cues:** describe every cue from its shot (type, source, action, material, space, length, sync frame, what the viewer should feel). Add a library ID only to a cue whose file fits that description ([fit beats reuse](#fit-beats-reuse)); the rest are `NEEDS-GEN`.

<a id="fit-beats-reuse"></a>
### Fit beats reuse

**Requirement (user, 9 Nov 2026):** each sound is designed for its shot first and taken from the library second, the sound version of [story first, kit second](../AGENTS.md#story-first). A library sound is used only when it fits the cue's description as well as a new generation would; a near match is generated new. A library ID written by Film is a candidate Ton tests against the description, not a default. Reuse saves time, never the brief. Evidence: Editor placed older library sounds in place of the sounds Film's briefs described (user, 9 Nov 2026).

<a id="sound-cue-sheet"></a>
### Sound cue sheet

**Requirement** for every deliverable with sound. Ton writes `scripts/<episode>/sound-cues.json` (`sound-cues-<DELIVERABLE-ID>.json` when the episode has more than one deliverable) from the timed scene sheets, and records its path and the scene-sheet revision in `delivery.md`. Editor places exactly these sounds; `scripts/sound-cues.py` checks the timeline against the sheet.

```json
{
  "deliverable": "EDU-EP12-SHORT",
  "sceneSheets": "SS-R3",
  "video": "src/videos/edu-ep12",
  "sources": ["src/videos/edu-ep12", "scripts/edu-series/ep12/sound-mix.py"],
  "cues": [
    {"cue": "B02-SH01-hit", "shot": "B02-SH01", "frame": 14, "brief": "Film's description of the sound", "id": "impact_sub-hit-short_02", "origin": "generated"},
    {"cue": "B01-amb", "shot": "B01-SH01", "frame": 0, "brief": "…", "id": "room_condo-night-quiet_01", "origin": "library", "fit": "why this file matches the brief"}
  ],
  "swaps": [{"cue": "B02-SH01-hit", "to": "impact_sub-hit-short_03", "reason": "the first hit masks the stressed word", "approvedBy": "film"}],
  "exempt": [{"src": "audio/edu/EDU-EP12-SHORT-stem-v1.wav", "reason": "stem baked by sound-mix.py"}],
  "levels": {
    "stems": {"voice": "out/stems/voice.wav", "bed": "out/stems/bed.wav", "accent": "out/stems/accent.wav"},
    "checks": [
      {"beat": "B01", "layer": "background", "when": "speech", "min": 15, "fromSec": 0, "toSec": 6.2},
      {"beat": "B01", "layer": "bed", "when": "speech", "warnAbove": 20, "fromSec": 0, "toSec": 6.2},
      {"beat": "B03", "layer": "accent", "when": "peak", "min": -6, "max": 3, "fromSec": 21.4, "toSec": 22.4}
    ]
  }
}
```

- `sources` lists what the check reads (default: the `video` folder); add a mix script that bakes a stem, and exempt the stem itself.
- A cue is done when its `id` names a filed library sound (no `NEEDS-GEN` left), its `origin` is `generated` or `library`, and a `library` pick carries a `fit` note.
- **Levels:** Ton writes one `checks` row per beat and layer from the [EP08b](editor-principles.md#ep08b-keep-each-layer-at-its-distance-from-the-voice) table, in dV (voice minus layer, LU), with the beat's window in seconds on the composition clock; Editor fills `stems` with the draft stems. `background` is the sum of all non-voice stems. `python3 -I scripts/mix-levels.py <cue sheet>` measures them.
- **Swaps:** Editor or Ton may change a cue's sound only through `swaps`, with a reason and the approval of Film (a fresh Film pass) or the user.

### Common cue set

The core set below comes from generic editing and sound-design guides (whoosh, riser, impact, pop/click for transitions and overlays; drones, heartbeats, footsteps, groans and sparse music for horror). They are not platform statistics. Sources checked 2026-10-28: [FlexClip transition sounds](https://flexclip.com/learn/transition-sound-effects.html), [Jupitrr viral breakdown](https://jupitrr.com/video-formats/vault/53iymufzosqe), [Morphic whoosh guide](https://morphic.com/resources/sounds/whoosh-sound-effect), [Dyerbolical on zombie-film sound](https://dyerbolical.com/symphonies-of-the-undead-zombie-films-that-haunt-through-sound/).

<a id="library-index"></a>
### Library index

`$REELS_STORE/library/sound/INDEX.md` (default `~/ReelsStore/library/sound/INDEX.md`, see the [asset store](../README.md#asset-store)) lists every file with ID, path, length, loop flag, use and tags. The first batch (2026-10-28, 39 files, **none listened to by a human yet**) covers transitions, UI, impacts, risers and stingers, zombie/horror creatures and foley, ambience beds and music for tension, chase, mystery/explainer and endings. Regenerate the index whenever a sound is added. Loop-flagged beds were crossfaded automatically; listen for a seam before relying on one.

## License

Generated audio falls under the [Stability AI Community License](https://huggingface.co/stabilityai/stable-audio-3-optimized) of the model weights (the server code is MIT). At the time of checking it allows commercial use for individuals and organizations with less than US$1M total annual revenue. Commercial-use eligibility is the user's decision: record the license in each `NOTICE`, and flag it in the delivery record if the channel's eligibility is unknown or changes.
