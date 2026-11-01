# Sound Generation and Shared Sound Library

**Status:** Requirement. This document holds each role's sound duties, the sound direction checklist, the library index and the generated-audio license. Owner: **Editor** (sound is part of Editor's audio/SFX ownership). Mixing, cue timing and seam rules stay in [editing principles](editor-principles.md#ep08--make-thai-captions-and-voice-lead-the-mix); timeline fields stay in [Remotion toolkit](remotion-toolkit.md#9-sound-cues-sfx--core-audio).

<a id="runtime-facts"></a>
<a id="shared-sound-library"></a>
<a id="workflow"></a>
**Generating, processing or filing a sound** with the local `audio-studio` MCP follows the [`sound-generation` skill](../.agents/skills/sound-generation/SKILL.md): runtime facts, the eight-step workflow, and the [library layout and naming](../.agents/skills/sound-generation/library.md). Claude Code and Codex both load it as a skill; any agent can read the file directly.

<a id="role-responsibilities"></a>
## Sound across roles

**Requirement:** every role considers music, ambience and SFX for its own output. Sound is a story element (rhythm, mood, reveals, silence), not a late add-on. A stage recorded `N/A` records `N/A` for sound too. Generation, library filing, mixing and sound QA stay with Editor; other roles supply intent and requests, never generated files.

| Role | Sound duty | Output |
| --- | --- | --- |
| Preaw | Record **sound intent** per beat: music mood/energy, where silence helps, and where a stinger, riser or effect carries the beat (hook, clue, twist, ending). English notes beside the beat; Thai narration is unchanged. Sound may add feeling but never replaces a clue or states a fact the script does not. | Script pack beat list |
| Boat | Fact-check sound implications: a siren, gunshot, crowd or music cue must not assert an event, place or casualty the evidence does not support; fictional or reconstructed sound is labelled like fictional visuals. Flag any real recording that needs a source. | Review notes |
| Film | Put a **sound direction** in the brief (checklist below) and check the library [index](#library-index) before asking for new sounds. | Brief `Sound direction` section |
| Film | Write a `Sound` line in each shot block: ambience/music state, SFX cues with shot-local frame and library ID or `NEEDS-GEN` (prompt fields: source, action, material, space, length), ducking or continuity notes. Cues support the written event frames; they do not replace them. | Scene sheet |
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

`$REELS_STORE/library/sound/INDEX.md` (default `~/ReelsStore/library/sound/INDEX.md`, see the [asset store](../README.md#asset-store)) lists every file with ID, path, length, loop flag, use and tags. The first batch (2026-10-28, 39 files, **none listened to by a human yet**) covers transitions, UI, impacts, risers and stingers, zombie/horror creatures and foley, ambience beds and music for tension, chase, mystery/explainer and endings. Regenerate the index whenever a sound is added. Loop-flagged beds were crossfaded automatically; listen for a seam before relying on one.

## License

Generated audio falls under the [Stability AI Community License](https://huggingface.co/stabilityai/stable-audio-3-optimized) of the model weights (the server code is MIT). At the time of checking it allows commercial use for individuals and organizations with less than US$1M total annual revenue. Commercial-use eligibility is the user's decision: record the license in each `NOTICE`, and flag it in the delivery record if the channel's eligibility is unknown or changes.
