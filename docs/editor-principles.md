# Editing Principles for Thai Reels and Long Videos

**Status:** Practical reference for Editor. Project requirements are linked below; sections labeled **Default** are creative synthesis that an agreed script/scene handoff may override with a recorded reason. External source facts are identified separately. Sources checked **27 October 2026**. This reference does not establish runtime capability or a rendered-video pass.

## EP01 — Respect the production contract

**Requirement:** Follow these owning documents rather than copying their numeric rules into editing presets:

| Owner | Apply during the edit |
| --- | --- |
| [Production requirements](production-requirements.md) | Selected format dimensions/fps, duration defaults, first-two-second hook, Thai text/audio, closing holds/endings, motion and licenses. |
| [Delivery workflow](delivery-workflow.md) | Selected deliverables, separate Short/Long editorial versions, exact revisions and readiness evidence. |
| [Sequence workflow](sequence-workflow.md) | Blockout before polish, deterministic assembly, explicit entry/exit states and adjacent-scene review. |
| [Remotion toolkit](remotion-toolkit.md) | Package/API preflight, shared integration, clock choice, captions, effects, transitions and sound. |
| [Visual and runtime QA](boss-asset-workflow.md#visual-and-runtime-qa-before-push) | Studio/seek/render checks, contact sheets, event-boundary frames and continuous sequence review. |

**Ownership:** Film owns the medium, coordinate and projection baseline. Mark owns the written scene handoff: exact shots, staging, camera and timing; storyboard drawings are not required. Boss owns reusable assets and shared renderer capabilities. Editor owns executable timeline/scene integration, editing, narration/audio/captions/effects/transitions and runtime QA. Return material visual-plan or reveal changes to the relevant owner and synchronize revisions before integrating them.

## EP02 — Cut for a change the viewer needs

**Default:** A cut should reveal useful information, clarify an action, show a reaction, change viewpoint, compress elapsed time or turn a story beat. Decide what the viewer must understand before choosing the cut point.

- Cut after the action or clue becomes legible, unless withholding it is the authored question.
- Prefer a clear shot long enough to understand over several redundant angles. Remove repeated explanations before accelerating narration.
- Use reaction shots to show consequence; an insert should answer or sharpen the current question.
- Keep necessary orientation or explanatory setup when trimming. A shorter edit that breaks cause and effect is unfinished.
- Do not impose a universal cut-every-N-seconds rule, a transition quota or a promised retention improvement.

## EP03 — Preserve space, action and sound direction

**Default:** Keep screen travel, eyelines, relative positions, object state and sound-source direction coherent across a continuous event. Use the handoff's named spaces and entry/exit states.

- Match the useful phase of an action across the cut; avoid repeating or dropping the decisive contact, release or impact.
- Preserve facing, hand/prop ownership, light direction and movement intent. An intentional reversal or time jump needs an orienting cue.
- Keep offscreen sound attached to the intended source/location. Reframing does not by itself justify a stereo reversal or an unexplained ambience change.
- Bridge room tone or ambience when the place continues; change it deliberately when place, time or point of view changes.
- Review previous → changed → next scenes in motion. A convincing isolated shot does not prove a convincing cut.

## EP04 — Shape rhythm with contrast and comprehension

**Default:** Pace around thought, action and emotional consequence. Alternate setup, discovery, reaction and explanation as the story requires; do not add motion solely to fill every beat.

- Let an important clue, Thai caption or demonstration be understood before the next demand on attention.
- Tighten repetition, dead lead-ins and unmotivated pauses. Retain breathing room that allows a realization or uneasy silence to land.
- A silent hold can sustain an authored look, listening beat or consequence. Define its purpose and duration; silence is not padding.
- Picture movement can remain restrained during a hold under the project's motion rule. Do not add distracting shake to manufacture energy.
- Judge timing with the actual Thai read and continuous playback. Estimates stay estimates until checked against speech/audio.

## EP05 — Reveal information progressively and fairly

**Default:** Give the viewer one dominant new idea at a time, with enough context to connect it to the previous beat. Use emphasis to establish an attention order among action, captions, diagrams and sound.

- Preserve the reviewed script's clue → interpretation → payoff order. Inspect first/last frames and transition overlaps for an accidental early reveal.
- For a mystery, keep fair clues readable while allowing a plausible incomplete interpretation. Do not replace the eventual explanation with missing evidence.
- Do not use an insert, reaction, ominous sting or juxtaposition to imply an unsupported real-world cause, guilt, quotation or chronology.
- Distinguish reconstruction, hypothesis and documented fact using the reviewed wording/visual plan. Return changed factual implications to Boat and Preaw.
- A replay at the payoff should add a new interpretation or show the relevant evidence clearly; repeating the entire setup weakens the resolution.

## EP06 — Make each Reel stand alone

**Default:** Build one compact question, causal progression and satisfying payoff that works without the Long video.

- Start with the agreed hook and readable Thai text; avoid spending the opening explaining the channel or advertising another edit.
- Retain the minimum context needed for the claim, clue and consequence. A crop, trailer or sped-up Long is not automatically a complete Reel.
- Frame for portrait comprehension: readable lead/action, short caption pages and an uncluttered visual hierarchy.
- Make the ending resolve the opening promise. For the loop version, connect the ending to the first image/sound without hiding the payoff or replaying a cue accidentally.
- Test the last → first seam and fade ending separately under the production requirements; a loop is an authored ending, not evidence of a retention result.

## EP07 — Develop the 9–10 minute arc

**Default:** Sustain a larger question through meaningful developments: establish the problem, examine evidence or attempts, complicate the interpretation, then resolve it and show its consequence.

- Give each chapter a distinct job and a local question/payoff that advances the whole. Chapters need not have equal lengths.
- Change the kind of visual evidence when the reasoning changes: demonstrate, compare, test, reconstruct or inspect a consequence as appropriate to the handoff.
- Reorient briefly after a genuine conceptual shift. Recap only what the next inference needs; do not restart the full hook every few minutes.
- Preserve earned quiet, demonstrations and reactions while removing circular explanation. Avoid mechanical strings of Shorts, inflated chapter cards and silence added to reach duration.
- Keep one continuous audio and editorial arc. Use chapter boundaries to express story structure rather than treating each as a separate ending.

## EP08 — Make Thai captions and voice lead the mix

**Requirement:** Use the shared Thai subtitle presentation, actual font/loading policy, narration settings and licenses in [production requirements](production-requirements.md) and [toolkit](remotion-toolkit.md). Review each selected deliverable's actual caption/audio timing.

**Default:** Voice carries meaning; music, ambience and SFX support it.

- Cue captions to the spoken phrase and intended reveal. Avoid captions that disclose the answer before the voice/action reaches it.
- Use authored Thai phrase/word boundaries and short readable pages; preserve tone marks, punctuation and sufficient vertical room. Split a cue before shrinking it below readable size.
- Keep captions stable through picture motion and transitions. Choose one active subtitle layer rather than dissolving two full subtitle layers together.
- Lower or reshape competing music/SFX around speech; check that consonants, quiet words and line endings remain understandable on ordinary listening devices.
- For a `C_seamless` loop, keep voice, music and SFX continuous across the seam: no fade-out on the music (end it at the loop point at the same level the start begins), no speech in the final blend window, no cue that retriggers audibly at frame 0, and a last spoken beat that leads into the opening line. Listen to the render looped back to back.
- Set cue attack, tail, trimming and fades deliberately. Listen for clicks, clipping, abrupt ambience loss, doubled cues and a loop seam that retriggers sound.
- Use silence intentionally. A constant music bed or a whoosh on every cut is not the default.
- Verify each imported sound's commercial-use license and attribution. A package license does not establish the license of every sound file.

**Source fact:** Remotion documents frame-based audio start offsets and animatable volume; these are mechanisms, not loudness or mixing targets. Current online examples may use different audio packages from the installed checkout. Follow the toolkit preflight before using them. [Audio timing](https://www.remotion.dev/docs/audio/delaying), [volume](https://www.remotion.dev/docs/audio/volume).

<a id="ep08a-shape-audio-emphasis-by-story-beat"></a>
## EP08a — Shape audio emphasis by story beat

**Ownership:** Editor decides and executes audio emphasis; no separate audio role is needed. Preaw's script and Mark's handoff state *where* a beat matters (hook, clue, reveal, payoff, quiet hold) through the `mix intent` field; Editor chooses *how* it sounds. A missing level change that needs new runtime behavior goes to Boss.

**Default:** Emphasis comes from **contrast and change**, not absolute loudness. A beat feels important because the sound around it changed: it got quieter, emptier or denser just before, or the bed dropped out. Raising everything raises nothing.

Plan the mix per beat with one label each, recorded in the edit plan:

| Mix intent | Use for | Typical treatment (starting point, judge by ear) |
| --- | --- | --- |
| `hold` | Explanation, setup, context | Voice alone or over a low bed; bed steady, ducked under speech. |
| `lift` | Build-up, rising question, escalating test | Bed rises gradually across the section (fade, not a jump); denser cues allowed between phrases. |
| `drop` | The moment just before a reveal, a realization, an uneasy silence | Pull the bed and ambience down or out for roughly 0.3–1.5 s; keep the voice. The silence is the emphasis. |
| `hit` | The reveal, the key number, the payoff image | One accent (SFX or bed returning) aligned to the picture event or the stressed word; not on top of a word that must be understood. |
| `release` | Resolution, ending, loop seam | Bed returns to a settled level; for `C_seamless` follow EP08's seam rules. |

- **Requirement — the mix moves with the story.** Every Short and Long carries a **mix cue sheet** in the edit plan: one row per beat with its mix intent and the actual gains for voice, bed and SFX. A flat mix (one bed level, every SFX at the same volume, one voice level throughout) fails review. A Short has at least one `drop` → `hit` and at least two distinct bed levels; an SFX volume is chosen per cue for its role (accent, texture, background), not copied. Why: uploaded Reels sounded flat because voice, music and effects never changed level with the situation (user feedback 2026-10-28).
- **Voice rides by beat, never by word.** Narration level follows the situation per line or beat within a small range: about −3 dB (`0.7`) for an intimate, uneasy or confiding line; 0 dB for `hold`; up to +2 dB (`1.25`, measured to stay under −1 dBTP) for the hook or the payoff line. Per-word gain sounds artificial; stress inside a line comes from script wording, pauses (`leadSec`, `closeGaps` in `scripts/narration.py`) and caption timing. The bed and SFX carry the larger moves.

Treatment palette (Editor picks per beat; each must serve a mix intent):

| Device | Effect | Typical use |
| --- | --- | --- |
| Duck depth by beat | `duckUnderNarration` ≈ `0.35` in `hold`, ≈ `0.15` under a line that must be understood exactly | Clue lines, numbers, Thai words that are easy to mishear |
| Swell in the gap | Bed rises 3–6 dB in a pause of ≥ 0.5 s, back under before the next word | `lift`, scene changes, after a joke lands |
| Hard stop | Music and ambience cut to silence on a frame | `drop` right before the reveal; a comic beat |
| Sting / accent SFX | One SFX louder than the bed, placed in a speech gap | `hit` on the reveal frame or key number |
| Pre-lap (J cut) | Next scene's ambience or SFX starts 0.3–1 s before the cut | Pull the viewer across a cut; location change |
| Ambience as the bed | Room tone or location sound instead of music | Realism, tension, a quiet `hold` |
| Tail ring-out | Let the final note or SFX decay instead of fading early | `release`, ending hold (not `C_seamless`) |

**Scope:** the cue sheet requirement applies to deliverables started on or after 2026-10-28; existing episodes are not remixed (user decision 2026-10-28).

**Runtime gap (2026-10-28, `main` 1dfe58f):** narration has no gain field; `SceneRenderer` plays the narration file at a fixed level and `scripts/narration.py` writes one level for every scene. Until Boss adds a per-scene narration gain (in the narration timeline or the renderer), record the planned voice levels in the cue sheet and mark them as a missing capability; do not fake them by duplicating the narration track.
- **Ration the accents.** A Short normally has one main `hit` (the reveal/payoff) and at most a few minor ones (hook, key clue). If every cut has a whoosh or every line has a swell, nothing reads as important.
- **Drop before you hit.** A short `drop` before a `hit` makes the hit land without making it louder. Avoid a hit with no contrast before it.
- **One foreground sound at a time.** At any moment either the voice, an SFX accent or the music is in front. Never stack an accent on a stressed word; place it in the gap before or after.
- **Change level on a beat, not mid-word.** Start lifts/drops at phrase boundaries, cuts or picture events; ramp over about 0.3–1 s unless an abrupt change is the point (a `drop` or `hit` may be instant).
- **Match emphasis to the reviewed claim.** An ominous drop or sting must not imply a cause, danger or certainty the script does not support (EP05).
- **Respect the profile.** A voice-only edit (no music, no SFX) still has `hold`/`drop` through pauses and silence; do not add music just to create emphasis without the user's or delivery record's choice.

**Runtime mapping (current checkout):** `video.audio[]` entries have a static `volume` with `fadeInSec`/`fadeOutSec` and `duckUnderNarration`; `scene.sfx[]` cues have a static `volume` ([toolkit 10a](remotion-toolkit.md#10a-footage-stills-music-entry-transitions-and-caption-styles)). Express a section level change by splitting the bed into consecutive entries of the same file with continuous `trimStartSec` and short overlapping fades; express `drop` as a fade-out/fade-in gap. As a gain reference, `0.5` ≈ −6 dB, `0.25` ≈ −12 dB, `0.1` = −20 dB. If a beat needs a keyframed volume envelope inside one entry, record it as a missing capability for Boss rather than faking it with many tiny entries.

**Verification:** Listen to the full render at least once on ordinary speakers or a phone, focused only on the mix: is each `hit` the most noticeable sound in its section, is every stressed Thai word understandable, and do level changes sound motivated? Measure the master with ffmpeg `ebur128` (or `loudnorm` print mode) and record integrated loudness and true peak. **Default delivery check:** integrated around −14 LUFS with true peak at or below −1 dBTP; this is a project default for mobile-first upload, not a platform specification. Because platforms normalize playback loudness, a louder master does not play louder; it only loses contrast.

## EP09 — Choose effects and transitions by purpose

**Default:** Start with a hard cut. Add an effect when its meaning or visual connection is clearer than the cut; use a small consistent vocabulary for the episode. Adobe identifies cuts, dissolves, fades and wipes as transition forms; the choices below are this project's synthesis, not a prescribed Adobe formula. [Transition overview](https://www.adobe.com/creativecloud/video/discover/video-transitions.html).

| Choice | Useful motivation | Check / avoid |
| --- | --- | --- |
| Hard cut | New information, reaction, clear time/viewpoint change; ordinary continuous action. | Check orientation and action phase; distinguish intentional jump from a pop. |
| Match cut / cut on action | Connect shape, motion, gaze or an action phase across shots. | Match the relevant feature; do not imply an unsupported causal link. |
| J / L cut | Anticipate the next space with sound, or carry dialogue/reaction/ambience across picture. | Name the sound source and exact lead/tail; protect clue timing and speech clarity. |
| Dissolve | Authored elapsed time, association or a softened passage. | Two pictures coexist: inspect ghosting, premature clues and caption doubling. |
| Motivated wipe | A moving foreground object, doorway or authored spatial passage motivates replacement. | Align motion/direction and coverage; avoid an arbitrary wipe that confuses geography. |
| Fade | Deliberate closure, separation or beginning where permitted by the output rules. | Reserve publishable endings for output boundaries; avoid repeatedly stopping a continuing chapter. |
| Stylized transition | A specific comic, subjective or heightened beat calls for zoom/whip/glitch/flash. | Preserve legibility, identity and reveal; avoid cumulative motion, loud stings or concealing a continuity defect. |

**Source fact:** In a J cut, incoming sound precedes incoming picture; in an L cut, outgoing sound continues after the picture changes. These sound edits do not require a picture dissolve. [Adobe J/L cuts](https://www.adobe.com/creativecloud/video/discover/j-cut-and-l-cut.html).

**Default:** Use shake, zoom, blur, glow, flash, particles or speed changes only to direct attention, describe force, mark point of view or support an authored beat. Keep subtitles stable and readable. Film's transform/projection baseline and Boss's shared ownership still apply; Editor selects supported effects rather than duplicating asset/camera transforms in a scene.

## EP10 — Specify exact frames and integrate one clock

**Requirement:** Editor maps every boundary/effect to deliverable, scene/shot IDs, matching handoff revision and composition frames. Record picture cut frame; transition start/end and duration in integer frames; outgoing/incoming shot handles; easing/presentation; transform/layer owner; and audio/caption offsets. Use half-open ranges `[start, end)` and identify any shot-local values explicitly.

Keep narration, its amplitude sampling and global cues on the composition clock. Shot animation uses its declared local clock. Record which cue tails cross a cut and which source owns them; two overlapping scene mounts must not duplicate global narration or captions.

**Source fact:** Remotion transitions render both scenes during overlap and shorten the total duration; `TransitionSeries` overlays leave sequence duration unchanged. A transition may not exceed either adjacent sequence. [Transitions](https://www.remotion.dev/docs/transitioning), [TransitionSeries timing and rules](https://www.remotion.dev/docs/transitions/transitionseries).

**Integration caveat:** Package availability is not timeline-schema support. Before using overlap, inspect installed versions/APIs, scene types, validator, assembly/timing helper, composition metadata and renderer together. Boss implements missing shared capability; Editor integrates it. Recalculate scene starts, total duration, narration/amplitude, captions, cues and ending holds through one shared timing calculation. Record whether supplied shot durations include overlap. Preserve the authored reveal and final duration; do not subtract transition frames independently in audio and picture.

## EP11 — Prove the edit and hand off reviewable evidence

**Requirement:** Follow the owning [QA workflow](boss-asset-workflow.md#visual-and-runtime-qa-before-push). Check full motion, speech/captions, critical adjacent frames, continuity and endings for each selected deliverable; check affected existing consumers when shared code changes.

Deliver scene samples under the authoritative [Editor sample contract](editor-workflow.md#scene-samples-for-the-user); representative stills supplement motion/continuity/audio QA and record review evidence separately from user approval.

**Default:** Review the continuous edit once for understanding and once for timing/sound/readability. Fix causes in their owning shared module or timing data; record remaining uncertainty instead of calling unobserved behavior correct.

**Source fact:** YouTube's retention report shows video-level viewing patterns; spikes can reflect rewatching/sharing and dips can reflect skipping/abandonment. Use those observations to form hypotheses for later edits, then inspect context; they do not prove why a cut worked or prescribe a universal cadence. [YouTube retention guidance](https://support.google.com/youtube/answer/9314415).

## Evidence and limits

| Primary source checked 27 October 2026 | Supported point | Limit |
| --- | --- | --- |
| [Adobe J/L cuts](https://www.adobe.com/creativecloud/video/discover/j-cut-and-l-cut.html) | Sound and picture can change at different times; definitions of J/L cuts. | Creative guidance; no measured retention guarantee. |
| [Adobe transition types](https://www.adobe.com/creativecloud/video/discover/video-transitions.html) | Cuts, dissolves, fades, wipes and sound bridges have different narrative uses. | Not a mandate for counts, durations or this project's choices. |
| [YouTube retention](https://support.google.com/youtube/answer/9314415) | Retention patterns and their possible interpretations. | Observational analytics; does not establish editing causality. |
| [Remotion transitions](https://www.remotion.dev/docs/transitioning) / [TransitionSeries](https://www.remotion.dev/docs/transitions/transitionseries) | Overlap duration, overlay distinction and transition constraints. | Online API documentation; verify installed version and project integration. |
| [Remotion audio timing](https://www.remotion.dev/docs/audio/delaying) / [volume](https://www.remotion.dev/docs/audio/volume) / [SFX](https://www.remotion.dev/docs/audio/sfx) | Audio start, volume automation and sound playback mechanisms. | Not a LUFS standard, an approved sound license list or current checkout evidence. |

| [EBU R 128](https://tech.ebu.ch/publications/r128) / [ITU-R BS.1770](https://www.itu.int/rec/R-REC-BS.1770) | How integrated loudness (LUFS) and true peak are measured. | Broadcast standard; its −23 LUFS target is not this project's upload target. The −14 LUFS default in EP08a is a project choice. |

Project-specific defaults above synthesize these tools with the reviewed story and production contract. No platform safe-zone pixel specification, universal loudness target, transition count or retention promise is inferred from the sources.
