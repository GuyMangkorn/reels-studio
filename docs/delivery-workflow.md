# Select and track video deliverables

**Status:** Required for new editorial work and downstream handoffs. This document owns output selection, variant identity and delivery tracking. [Production requirements](production-requirements.md#outputs-and-story-timing) own duration, dimensions and fps; [editorial workflow](editorial-workflow.md) owns script/review content.

## Resolve the selection before writing

The coordinator resolves the selection, records it in `scripts/<episode>/delivery.md` and creates the [task file](#task-file) before any writing; the steps are in [coordinator](coordinator.md#resolve-the-selection). A role agent that receives no selection, channel or style profile returns the question to the coordinator.

## Style profile

**Requirement:** every deliverable record names one style profile. Rules written for the illustrated format both channels start from (the mystery/educational work made before the channels were split) are the **`channel-default`** profile; they bind a deliverable only through its profile, so a different profile overrides them with a recorded reason. Production requirements marked as the channel default (reference palette, demo lighting, rig contact, lead height, the [project defaults](#project-defaults), A/B endings) belong to that profile. Safety, licensing, Thai readability, deterministic frame-driven output, selected-deliverable independence, factual honesty and the hook/duration targets apply to every profile unless the user explicitly overrides them.

| Field | Choices (extend as needed) |
| --- | --- |
| Channel | `edu` or `fiction` ([channels](../channels/README.md)); asked in the selection call when the request does not make it clear, and an existing series keeps its channel; the channel file sets that channel's mark, voice, script rules and other values ([CH01–CH02](../channels/README.md#rules)) |
| Genre / purpose | the [channel file](../channels/README.md)'s genre (`edu`: educational; `fiction`: invented stories), which a request may narrow; other values for one-off work: mystery-educational, comedy, explainer/tutorial, vlog or documentary cut, news/recap, review, ad/promo, music/lyric video, slideshow/photo story, screen recording, motivational |
| Visual medium | illustrated 2D/3D/hybrid (existing library), user footage, stock/licensed footage, still images, typography/kinetic text, screen recording, mixed |
| Visual engine | for illustrated/animated media: painted 2D (p5.brush) with the [painted 3D camera](film-visual-brief-workflow.md#painted-3d-camera) + Remotion SVG (project default), a mix of these, Film's choice, or the user's own answer ([visual engine](#visual-engine)) |
| Voice | Gemini TTS ([project default](#project-defaults)), Niwat TTS (male, Edge), Premwadee TTS (female, Edge), user-supplied recording, on-camera audio, no voice |
| Music / SFX | none, user-supplied, licensed library (record the license), generated for the shot by Ton or a fitting shared-library file ([fit beats reuse](sound-generation-workflow.md#fit-beats-reuse)), sparse SFX; ducking under voice |
| Captions | outline (default), box, none; position; burned-in or SRT only |
| Chrome | channel label and progress bar on/off |
| Ending | `A_fade` / `B_loop` (default), `C_seamless` (seamless Reels loop: the last frame blends into the first, see [production requirements](production-requirements.md#outputs-and-story-timing)), hard cut, end card |
| Factual claims | none / opinion only, general knowledge, named real case (decides Boat's involvement) |

Record the chosen values in `delivery.md` as a compact block.

<a id="project-defaults"></a>
**Default — project defaults when the prompt does not say** (user decision, 30 Oct 2026, from WORLD FOG EP01). An illustrated story whose prompt and chosen [concept](#ideation) leave these open uses the values below without asking; record each in `delivery.md` as `default`. A prompt, brief or the user's answer overrides any of them, with the reason recorded.

| Field | Default | Reference |
| --- | --- | --- |
| Visual engine | **Painted 3D camera** (user, 5 Nov 2026): sets built in world metres and seen through the kit yaw camera ([`kit/ycam.ts`](../src/painted/kit/ycam.ts)), painted with p5.brush, for sets, characters and wide-to-medium shots; mixed with crisp Remotion SVG for close-ups and first-person (FPOV) inserts such as a phone screen or an object in the narrator's hands ([Film: painted 3D camera](film-visual-brief-workflow.md#painted-3d-camera)) | WORLD FOG VD01, VD09 (PHONE-SVG) in [the brief](../storyboards/world-fog/short/visual-brief.md) |
| Character proportions | The WORLD FOG cast: adult 4 heads tall (1.70 m; 1.60 m for a shorter adult with the same head), mitten hands, flat-face decal heads with face controls, drawn as a flat card at the character's depth in one of four views (see Character views) | `src/painted/worldfog/cast.ts`, `head.ts`; brief VD03 |
| Arm poses | Bent arms go back into depth with perspective (elbow behind the torso, a shade darker), never splayed out to the side | [CP-P](character-proportion-principles.md#cp-p-arm-depth); `Arm.via` / `Arm.behind` in `cast.ts` |
| Character views | Four body views (front, back, left, right), squared to the lens with `squareToCam` ([`kit/views.ts`](../src/painted/kit/views.ts)); the front three-quarter (`quarter`, 15–45°) is optional for close-ups; head acting with `headCock` (±6–12°) or the head turned aside on a front body. No back three-quarter views (user, 4–5 Nov 2026) | Sheets `VIEWSHEET-*`, `HEADTRICKS-YOU`; spike `SET45-*` |
| Character poses | Designed from the story first, then matched against the pose sheet P01–P45 and the template cast ([story first](../AGENTS.md#story-first)); a match is cited as a [casting line](character-proportion-principles.md#cp-casting-line), a new pose is proposed to Boss, not made one-off | [CP-P12](character-proportion-principles.md#cp-p-pose-sheet); `src/painted/kit/poses.ts` |
| Camera | Mostly eye level and observational. **Every shot moves the camera inside the set** (dolly, truck, arc up to about ±40°, push) so near and far slide at different speeds; by default the set stands at an angle to the lens (about 45°) so its lines run diagonally through the frame. A flat 2D push or zoom of the whole picture needs a recorded reason. Repeated fixed vantages where the repetition carries the story; the torch reveal is the quality reference (user, 5 Nov 2026) | WORLD FOG brief "Camera language", VD10, VD12; spikes `PARALLAX-AFTER`, `SET45-*` ([Film](film-visual-brief-workflow.md#painted-3d-camera)) |
| Voice | Gemini TTS with per-line emotion ([gemini-tts skill](../.agents/skills/gemini-tts/SKILL.md)); narrator Sulafat (female) or Orus (male), "brisk natural pace, no long pauses". A channel sets its own narrator in its [channel file](../channels/README.md) (edu: [Kore](../channels/edu/channel.md#voice)). Minor characters may stay on Edge TTS ([voice-tuning](../.agents/skills/voice-tuning/SKILL.md)) | WORLD FOG delivery record, 30 Oct 2026 casting |
| New assets | Build every new character, prop, set piece or UI element reusable from the start: it goes in the shared painted kit (`src/painted/kit/`, introduced by the shared-kit work), takes content, colours and lighting as parameters, and is listed in the kit catalog so Film pick it by picture. Story timing and episode-only logic stay in the episode folder. Existing episode modules are not retrofitted (user decision, 30 Oct 2026). | Kit README and catalog |
| Recurring cast | **Film decides per video** whether a character in the brief is an existing recurring character or a new one, and records it as a `VD` decision with the reason (story fit, age, sex, role). Reuse is a choice, not a duty: the cast has no male character yet, so a story that needs one gets a new character. A reused character keeps the same head and body so the viewer knows them on sight; only clothes, accessories and props change. Model each as a cast entry (head style, build, height) plus a swappable outfit, as `CastDef` already separates `head` and `outfit`, never as a per-episode redraw. A new character that is likely to return is added to the kit cast through the [look check](film-visual-brief-workflow.md#look-check); changing a recurring character's head or body is a [look change](film-visual-brief-workflow.md#look-change) and needs the user's approval. | `src/painted/worldfog/cast.ts` (to `src/painted/kit/` in the shared-kit phase 2a); [look check](film-visual-brief-workflow.md#look-check) |
| Channel mark | The deliverable's [channel](../channels/README.md) mark, top-left on every deliverable; `@TamMaiLa` for `edu`, which is also the code default `defaultChrome`; off only for internal compositions or with a recorded user reason | [channel label](production-requirements.md#thai-subtitles-narration-and-channel-label); user, 3 Nov 2026 |
| Thumbnails | Reuse an earlier thumbnail when it already shows the beat's framing; draw a new one only where none fits | Applies once the Film thumbnail sheet is adopted |

The [voice sample](#style-profile) requirement still applies: a default voice is not a user choice. The Gemini key is on the paid tier (per-token billing); keep generation bounded as in the [gemini-tts skill](../.agents/skills/gemini-tts/SKILL.md#limits-and-costs).

<a id="voice-audition-cap"></a>
**Requirement — voice audition cap (user, 3 Nov 2026).** Every take generated for the user to *choose* a voice, style, pace or delivery is at most **10 s** of audio: the opening line or two, the same text for every candidate. Never read the full script or a long passage per candidate. Evidence: three 1-minute candidates were generated just to pick a voice. A full read happens only after the choice, as the [length check](#length-check-at-script-lock) (one read, one voice) or the [voice lock](#voice-lock). A role agent that thinks a longer audition is needed asks the user first, through the coordinator.

<a id="sample-before-full-read"></a>
**Requirement — sample before every full read (user, 6 Nov 2026).** No full narration read (any narration longer than about 10 s) is generated until the user has picked from ≤ 10 s samples, through the structured-question tool. Order: (1) ≤ 10 s sample per candidate voice, style or pace; (2) user picks; (3) one full read in the picked setting. The same order applies to every regeneration that changes voice, style, pace or delivery (a re-tune after the [voice lock](#voice-lock) included): sample the change first, full read only after the pick. A full read is allowed without a new pick only when the setting is already user-picked and only the text changed (a script revision). Evidence: full-clip reads kept being generated before any choice, spending API calls on takes that were thrown away.

**Requirement — hear the voice before integration.** When the voice is TTS or new to the channel, the user hears a sample of about 10 s (the opening lines in the chosen voice, over the planned music bed if there is one) before Editor integrates the full narration. Record the user's choice in `delivery.md`; a default voice is not a user choice. A profile that needs a missing runtime capability is a Boss dependency, not a reason to change the story. Supported runtime fields are listed in [Remotion toolkit 10a](remotion-toolkit.md#10a-footage-stills-music-entry-transitions-and-caption-styles); inspect the active checkout before promising more.

### Visual engine

**Requirement:** before Film's brief or any scene work on an animated or illustrated deliverable, the record names the visual engine. When neither the prompt nor the record names one, use the [project default](#project-defaults) (painted 3D camera + SVG inserts) and record it as `default`; ask in the [selection call](#resolve-the-selection-before-writing) only when the request does not fit an illustrated story as a multi-select question in the user's language (Thai example: “จะทำภาพด้วยอะไร? เลือกได้หลายแบบเพื่อผสมกัน”):

| Option | Meaning | Runtime status (checkout `733808f`) |
| --- | --- | --- |
| Blender 3D | Rendered 3D shots and assets ([Blender workflow](blender-mcp-workflow.md)) | `deactivated` (user decision, 30 Oct 2026): not offered; code and assets are kept |
| Painted 2D (p5.brush) | Hand-painted watercolour and boiling ink, drawn per frame in `src/painted/BrushCanvas.tsx`, sets seen through the kit yaw camera by default ([painted 3D camera](film-visual-brief-workflow.md#painted-3d-camera)); method in the [painted-2d skill](../.claude/skills/painted-2d/SKILL.md) | `existing-integrated` (30 Oct 2026, `main` 59f8cee): painted scene type `src/scenes/painted.ts` with plates by ID in `src/painted/registry.ts`; shipped in WORLD FOG EP01 |
| Remotion rig 2D | The legacy vector joint rig (`src/rig/`; [character toolkit](character-toolkit.md)); painted work casts from `src/painted/kit` instead | `retired` (user decision, 1 Nov 2026): not offered; no video imports `src/rig`; code is kept |
| Let Film choose | Film picks per scene or element and records the reasons in the brief | — |

Selecting several options means a mix; the brief then states which engine owns each set, character, prop and effect. The harness's free-text answer covers any engine the user names themself. An engine marked `exists-unintegrated` makes its integration a Boss dependency, recorded before Editor work. Re-check the runtime status in the active checkout before relying on this table.

<a id="pipeline-tiers"></a>
## Pipeline

**Requirement (user, 2 Nov 2026):** every video deliverable runs the full pipeline. There are no lighter tiers: the Light and Edit-only tiers are retired.

[Ideation](#ideation) (Preaw pitch → Film annotation → user pick) → Boat research → Preaw script → Boat fact-check → Film brief → Film storyboard pass (VO-relative timing) + first [storyboard page](mark-storyboard-workflow.md#user-storyboard-review-page) → Editor [voice lock](#voice-lock) → Film timed scene sheets → Boss assets and Ton sounds ([cue sheet](sound-generation-workflow.md#sound-cue-sheet)) → Editor

- Record `Full` in `delivery.md`. A stage is `N/A` only when it has no subject at all (for example no narration, so no voice lock), with the reason recorded. A fictional profile still gets Boat research (the legend's sources) and a fact-check of the fact-versus-fiction boundary.
- Media the user supplies (footage, images, audio) is source material for the stages above, filed and inventoried as in Editor's [direct intake](editor-workflow.md#direct-intake); it does not skip Film's brief or scene sheets.
- **Legacy:** deliverables recorded as Light before 2 Nov 2026 (`KSO-EP01-SHORT`, `oldest-shipwreck`) keep the Light stages they were started with (Film's timed shot list in place of the scene sheets). They are not migrated.

Handoff checks apply to every stage: matching revisions, deliverable ID, covered beats and timing status. Progress is tracked in the [task file](#task-file).

<a id="wip-limit"></a>
### Finish first

**Default (user, 3 Nov 2026):** the coordinator proposes the open deliverable closest to W8 first; see [coordinator](coordinator.md#wip-limit).

<a id="length-check"></a>
### Length check at script lock

**Requirement (user, 3 Nov 2026):** before the user approves a script (W1.5), Editor reads the whole script once with the user-picked voice and records the measured length in `delivery.md`. A read more than 5 % over the target goes back to Preaw for trims before approval; an estimate does not count. The voice is picked from ≤ 10 s samples first ([sample before every full read](#sample-before-full-read)); never read the whole script in a default voice just to measure. When the script passes unchanged, this read also serves as the [voice lock](#voice-lock) read instead of a second call. Evidence: `ZOMBIE-7ELEVEN` was approved at an estimated ≈116 s while a sample read paced it at ≈130–140 s, and `WFOG-EP01-SHORT` went to script R6 and scene sheets SS-R6 after the picture was built.

<a id="ideation"></a>
### Ideation

**Requirement (user, 2 Nov 2026):** every new video starts with an ideation round before Boat research, so the channel looks for the best concept instead of repeating its defaults. The user skips it for one video by naming the concept (genre, format and visual medium) in the prompt; record `W0 N/A — concept given by user` with their words. Re-edits and new versions of an existing deliverable skip it.

1. **Preaw pitches** (one invocation) `scripts/<episode>/concepts.md`: six concepts `C1`–`C6` on the user's topic, or on topics Preaw proposes when the user gives none. Every concept belongs to the deliverable's [channel](../channels/README.md) and follows its channel files: the coordinator names the channel before this pass ([CH01](../channels/README.md#rules)) and passes `channels/<id>/channel.md` and, when it exists, `script.md` by path. Spread inside the channel: at least three clearly different angles (subject area, story shape or tone, as the channel file allows), at least two visual mediums, and one wild card that the current kit and [project defaults](#project-defaults) cannot make. A concept that belongs to the other channel is not pitched; Preaw notes it in one line at the end of the file for the user. Each concept gives: ID, Thai working title, genre, a one- or two-sentence logline, the hook's opening line in Thai, a 3–5 beat outline, ending type, voice and tone, why it would hold a viewer (hook mechanism, payoff, why someone would share it) and research load (none, general knowledge, named real case). Edu-channel concepts add the [pitch check](../channels/edu/script.md#edu-short-retention) (ER08); another channel adds its own check once its `script.md` has one.
2. **Film annotates** (one fresh invocation) the same file: per concept, the visual approach in one or two lines (medium, engine, look reference), buildability from the kit catalog (`ready`, `new assets: <list>` or `missing capability: <list>`) and a production size `S`, `M` or `L`. Film does not drop or rewrite concepts. The coordinator runs this pass on Opus ([per-call override](coordinator.md#coordinator-and-agent-parity)).
3. **The coordinator asks the user** to pick with the structured-question tool, after a summary table (ID, title, genre, medium, hook line, size; for edu concepts the ER08 pitch check, e.g. `4/4` or `3/4: who = dog owners`) in the reply. Where the tool caps options at four, ask two questions, `C1`–`C3` and `C4`–`C6`, each with a "none of these" option. The user may pick one, merge two, or ask for another round with a direction; a new round is a new revision of `concepts.md` (`R2`, …) and earlier rounds stay in the file.
4. `delivery.md` records the chosen concept ID, revision and the user's words, and the style profile fields the concept names. The [project defaults](#project-defaults) fill only what the concept leaves open.

Concepts are pitches, not research: no claim in `concepts.md` counts as checked until Boat's research and fact-check.

<a id="task-file"></a>
### Task file

**Requirement (user, 2 Nov 2026)** for every project: `scripts/<episode>/task.md` is a checklist of the [W0–W8 steps](sequence-workflow.md#painted-shot-by-shot) that answers "how far along is it" without reading `delivery.md`. It holds progress only; decisions, revisions and evidence stay in `delivery.md` and the handoff files, linked by path.

- **Created** by the coordinator in the turn it first writes `delivery.md`, from the template below, one section per deliverable.
- **Updated** by whoever finishes a step (role agent or coordinator), in the same change that updates the deliverable's `Stage / Next owner` cell. The two must agree; when they differ, `delivery.md` wins and `task.md` is corrected. Edit both with [`scripts/ep.py`](../scripts/ep.py) (`tick`, `now`, `cell`), not with one-off Python (usage review, 5 Nov 2026: about 600 inline scripts in five days edited these files and `review-rows.json`).
- **Published (W8.2):** the step is ticked only when the delivery render and the picked cover are in the [publish folder](../README.md#publish-folder) (`store.py publish <ID> --cover <pick> --reason "<why>"`). The note is the folder path `publish/<channel>/<PROJECT>/<ID>/`. A later re-render or cover fix is published again in the same turn, and the reply gives the user that path.
- **Posted:** when the user says a video is on the channel, the coordinator runs `store.py publish <ID> --posted <date>` and ticks W8 and W8.3 in that turn, with the date. It marks any W8 step it cannot evidence `not recorded`.
- <a id="performance-record"></a>**Performance (after posting; user, 8 Nov 2026):** at the first session at least 3 days after a video is posted, the coordinator asks the user once (structured question) for its views, average view duration, swiped-away % and where the retention curve drops, and adds a row to that video's channel record `channels/<id>/performance.md` ([edu](../channels/edu/performance.md); created with a channel's first posted video). Rough numbers are fine; a missing number is `-`. When an episode clearly beats or trails its series, the coordinator proposes a short retrospective in `scripts/<episode>/lessons-learned.md` (example: [EDU EP05](../scripts/edu-series/ep05/lessons-learned.md)).
- **Kit intake (W8.4):** Boss files the episode's new looks and sets into the kit after W8.2, under [KIT-P01](../src/painted/kit/README.md#kit-intake); the deliverable is not done until W8.4 is ticked or `N/A` with a reason.
- **Read first** when the user asks for progress ("ทำถึงไหนแล้ว"): answer from the `Now` line and the open steps, and open `delivery.md` only for detail.
- **Marks:** `[x]` done, `[ ]` open, `[x] … N/A — <reason>` for a step with no subject. Each line is one step plus at most one short note (revision, count, date); link instead of copying.
- **Per-shot steps** (W3.3, W5, W6, W7) carry a count, e.g. `12/26 shots passed`; the per-shot verdicts stay on the storyboard review page.
- For a deliverable whose engine is not painted 2D, W3.1–W3.2 are `N/A`; W5 is Editor's integration reviewed as the half-size draft cut split into storyboard shots, W6 the full-size final cut once every shot passed, and W7 pins, as for painted work ([render stage](render-rules.md#render-stage)).

```markdown
# Tasks — <EPISODE>

Record: [delivery.md](delivery.md) · Updated: <YYYY-MM-DD>, <role>

## <DELIVERABLE-ID>

**Now:** <W-step> — <one line>. **Next:** <owner> — <what, on which revision>

- [ ] W0 Ideation
  - [ ] W0.1 Preaw concepts (concepts.md R1)
  - [ ] W0.2 Film annotation
  - [ ] W0.3 User picks a concept
- [ ] W1 Script lock
  - [ ] W1.1 Boat research
  - [ ] W1.2 Preaw script
  - [ ] W1.3 Boat fact-check
  - [ ] W1.4 Length check: measured read ≤ target + 5 % (s)
  - [ ] W1.5 User approves the script
- [ ] W2 Brief and storyboard
  - [ ] W2.1 Film brief (text)
  - [ ] W2.2 Film storyboard rows (review-rows.json)
  - [ ] W2.3 Storyboard page published
- [ ] W3 Look frames and storyboard pass
  - [ ] W3.1 Look frames on the page (0/L locations)
  - [ ] W3.2 Look frames approved (look lock)
  - [ ] W3.3 Storyboard passed (0/N shots)
- [ ] W4 Voice lock
  - [ ] W4.1 Voice chosen
  - [ ] W4.2 Narration generated and measured
  - [ ] W4.3 User approves the voice
- [ ] W5 Draft
  - [ ] W5.1 Film timed scene sheets
  - [ ] W5.2 Boss assets and plates (shot groups 0/G)
  - [ ] W5.2s Ton sounds and cue sheet (0/C cues; generated/library)
  - [ ] W5.3 Draft passed (0/N shots)
- [ ] W6 Final passed (0/N shots)
- [ ] W7 Pinned (0/N shots)
- [ ] W8 Deliver
  - [ ] W8.1 Assembled from the cache, picture lock
  - [ ] W8.2 Delivery render and cover published (`publish/<channel>/<PROJECT>/<ID>/`)
  - [ ] W8.3 Posted to the channel (user, date; `publish --posted`)
  - [ ] W8.4 Kit intake: new people, outfits, animals, poses, sets filed (KIT-P01)
```

<a id="voice-lock"></a>
### Voice lock before timing

**Requirement** for every deliverable with narration or dialogue whose picture is timed in frames. Integer event frames come from the final read, not from an estimate.

1. The user has chosen the voice ([hear the voice](#style-profile)) and the script revision has passed its fact-check.
2. Editor generates the final narration with the chosen engine (`scripts/narration.py`, or the [gemini-tts skill](../.agents/skills/gemini-tts/SKILL.md#narration-one-narrator) for one continuous Gemini read). Editor measures each beat's anchor-phrase onsets and the speech end into a committed measure file next to the timeline, and records it with the script revision in `delivery.md` (timing status `audio-measured`).
3. Film may write staging, shot order and VO-relative timing ("on the word X", "+0.5 s after the line") before the lock, labelled `estimated`. Film writes the timed scene sheet (integer frames) from the measure file. Boss builds plates from timed sheets only.

A script or voice change after the lock re-opens it for the affected beats: regenerate, re-measure, then retime those beats once. The BLOOP-EP01-SHORT sheets went R1 → R8 because timing came before the read (30 Oct 2026).

**Look changes after the brief** (a new ending, a creature redesign) need Film's [key-pose stills and user approval](film-visual-brief-workflow.md#look-change) before Boss builds or rebuilds plates.

### Agent invocation

**Default.** The rules for how the coordinator runs a stage (AI01–AI08 and <a id="ai12"></a>AI12: whole stage per call, inline mechanical edits, separate checking, fresh invocation per pass, one fix list per round) live in [coordinator](coordinator.md#agent-invocation). These four bind a role agent inside its own run:

- **AI09 — Context checkpoint.** A role agent that passes about 80 turns or about 250k context stops at the next clean point. It records progress, open items and evidence paths in the episode's `build-notes.md` and returns. The coordinator starts a fresh invocation for the rest ([AI04](coordinator.md#agent-invocation)).
- <a id="ai13"></a>**AI13 — Value changes go straight to the implementer.** When the change is a value the user or Film already decided (a distance, position, scale, timing, shade or crop), Boss or Editor applies it in code and updates the matching scene-sheet line with a change-log entry naming Film as owner; Film reviews it in its next scheduled pass. Film is invoked first only for a staging redesign (new framing, pose, shot or camera move). Evidence: EG-EP01 door distance 1.5 m then 1.1 m and ZCONDO2 soi restage r2–r4 each ran as a Film-then-Boss relay (3 Nov 2026).
- <a id="ai10"></a>**AI10 — No handback mid-job.** A role agent finishes its own long jobs (render, TTS, alignment, Blender) before it returns: it runs them in the foreground, or starts them in the background and waits on the log's completion marker inline (`Monitor` or a bounded wait loop). It does not return while its background work is still running, because the coordinator would then resume it to collect the result. If it must return early (the [AI09](#agent-invocation) cap), the report names the job, its log path and the exact completion line the coordinator waits for.
- **AI11 — Hand off through files.** A role agent reads other roles' outputs (measure files, scene sheets, build notes, sample manifests) by path and revision. The coordinator passes paths, revisions and the user's decisions, never numbers or tables copied out of another agent's report. This keeps the coordinator, the most expensive model, lean, and keeps one source for each number.

## Separate story versions from frame shapes

Short and Long are separate editorial deliverables. Each needs its own full spoken script, claim mapping, exact-revision factual review, visual brief, scene-handoff set, executable timing, narration/amplitude and subtitle timing. A synopsis, crop, faster VO or a link to the other script is not a second script. Write a compact standalone question/payoff for Short and a developed causal progression for Long; do not pad or mechanically concatenate Shorts to fill Long.

Share inspected sources, claim/source IDs, character identity and reusable assets through references. Review each version's actual wording and visuals: shorter wording can change factual scope. Reuse unchanged review results only after an explicit change-impact check. Changes to a shared fact/asset identify all affected deliverables without resetting unrelated revisions.

A second aspect-ratio framing of the *same edit* is a framing adaptation, not the other editorial version. It preserves that edit's action/timing only when requested. Duration, composition names and a portrait canvas alone do not establish Short readiness. Existing `Short`/`Long` render IDs are historical bindings to inspect, not guaranteed delivery selections.

## Files and stable IDs

New work uses separate variant folders. This is an authoring convention; it adds no JSON loader, include directive or renderer registration:

```text
scripts/<episode>/
  delivery.md
  research.md
  short/
    script.md
    fact-check.md
    timeline.json             # only after explicit runtime implementation
  long/
    episode-script.md
    ch01-script.md            # optional chapter split
    fact-check.md
    timeline.json             # only after explicit runtime implementation
storyboards/<episode>/
  short/
    visual-brief.md
    index.md
    sc01.md
  long/
    visual-brief.md
    index.md
    ch01-sc01.md
```

Create only selected/assigned variant files. With both selected, there are two script packs and two scene handoff sets; a set may contain several written scene sheets. A chapter split within Long does not create extra deliverables. For new work, namespace deliverable/beat/shot IDs, for example `E01-SHORT-S01-B01` and `E01-LONG-C01-S01-B01`; preserve shared source/claim/asset IDs. Extra explicitly requested Shorts get distinct deliverable IDs and paths recorded in `delivery.md`.

## Delivery record and handoff checks

Keep `delivery.md` compact, linking authoritative packs instead of copying their contents:

| Deliverable ID | Stage / Next owner | Style profile + tier / target / timing status | Script + factual-review revisions | Brief + handoff/index revisions | Runtime binding + audio/subtitles + scene samples | Readiness / approval / open items |
| --- | --- | --- | --- | --- | --- | --- |
| `E01-SHORT` or `E01-LONG` | Last completed stage; who acts next and on what (e.g. `Editor — integrate SHORT-BOARD-R6`) | Target; estimated/read-aloud/audio-tested; measured duration when available | Paths, exact revisions and review coverage | Paths and matching revisions | Timeline/composition/input props and media/cue revisions, or not implemented | Separate writing, factual, planning, runtime, user-approval and release evidence |

**Stage / Next owner:** one line per deliverable that answers "where is it and who acts next" without reading the other columns. Name the last completed stage from the tier's pipeline (e.g. `fact-checked`, `handoff ready-for-dev`, `integrated`), then the next owner (a role, `User` for a pending approval, or `Boss #<issue>` for a named dependency) and the revision they act on. The role that finishes a stage updates this cell in the same change as the handoff; a skipped stage reads `N/A`, and a finished deliverable reads `done — no next owner`. The coordinator reads this cell when the user asks for status and when choosing which role agent to invoke next. It records state only and adds no approval gate or automatic runner.

**Published artifacts (user, 31 Oct 2026):** every Artifact the coordinator publishes for a deliverable (storyboard review page, scene samples, any page the user reviews) gets its URL recorded in `delivery.md` and the episode `handoff.md` in the turn it is published, with what it shows (revision, version) and where its data lives (e.g. the `db` collection holding verdicts), and the record is updated when the page is republished.

Before each handoff, confirm the deliverable ID, matching source revisions, covered beats and timing status. A passing review/handoff for one deliverable does not pass the other. Update stale readiness labels after a recheck; retain dated prior results as history. Record user approval only with evidence, separately from selection and readiness; this workflow adds no blanket approval gate.

Editor keeps one deterministic executable assembly **per selected deliverable**, using shared renderer/assets. Each has its own clock, boundaries, ending, audio and subtitle cues. Check actual source support before registering/loading it. Run blockout, visual-storytelling, Studio/render/seek and final-duration checks for the selected deliveries under their owning workflows. Shared-library changes additionally check affected consumers, including an unselected existing output when impacted; this does not authorize producing a new unselected version. Label missing evidence and do not claim release readiness from estimated timing. Link user-facing scene samples and their reproduction metadata under [Editor workflow](editor-workflow.md#scene-samples-for-the-user).
