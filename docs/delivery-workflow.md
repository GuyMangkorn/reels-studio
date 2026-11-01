# Select and track video deliverables

**Status:** Required for new editorial work and downstream handoffs. This document owns output selection, variant identity and delivery tracking. [Production requirements](production-requirements.md#outputs-and-story-timing) own duration, dimensions and fps; [editorial workflow](editorial-workflow.md) owns script/review content.

## Resolve the selection before writing

1. Read the user's request and the existing episode delivery record. Reuse an explicit selection; do not ask again when the user already chose the formats or supplied a scoped revision request.
2. If the selection or [style profile](#style-profile) is missing or materially ambiguous, ask with the harness's structured-question tool: `AskUserQuestion` in Claude Code, `request_user_input_async` in Codex; if neither exists, ask in chat. Ask only for what the prompt leaves open, in one call in the user's language: the **selection** with three choices, **both**, **Short only**, **Long only**, showing the duration targets from production requirements (Thai example: “หัวข้อนี้ต้องการทำทั้ง Shorts และ YouTube แบบยาว หรือเลือกแบบใดแบบหนึ่ง?”), the **style** (genre/medium, voice, music) and the **target length** when none is stated or implied, and whether the user has a **look reference** (image, link or earlier episode) when the medium is illustrated or 3D. For an animated or illustrated deliverable, the same call also asks the [visual engine](#visual-engine) unless the prompt or record names one. Do not ask about a choice the prompt or the delivery record already settles. A sent question, preselected option or elapsed wait is not an answer. Continue independent research while waiting; begin format-dependent writing/scene sheets only after the selection is resolved.
3. Record the answer or existing instruction in `scripts/<episode>/delivery.md`: selection, style profile and pipeline (`Full`), evidence of the user's choice, deliverable IDs, target durations and scope. `short`, `long` and `both` are authoring labels, not runtime fields. Default counts are one standalone Short and one Long when both are selected. A chapter series, multiple Shorts or additional edits require explicit scope; selecting both does not make every Long chapter a Short.
4. Create `scripts/<episode>/task.md` ([task file](#task-file)) and route each selected deliverable through the [pipeline](#pipeline-tiers): Boat research → Preaw script → Boat fact-check → Film brief and written scene sheets → Boss shared assets/capabilities → Editor integration/editing. Shared research may feed both. A scriptwriting-only assignment ends with editorial handoff; selection does not authorize automatic downstream production, agent execution or cross-chat messaging.

Selection is complete when the record identifies the selected deliverables and the instruction resolving the choice. An explicit custom duration/scope overrides defaults with its reason recorded. For a new version of existing production, preserve existing IDs and evidence; record a migration map before changing paths or IDs. Workflow updates alone do not migrate historical episodes.

## Style profile

**Requirement:** every deliverable record names one style profile. Rules written for the channel's illustrated mystery/educational format are the **`channel-default`** profile; they bind a deliverable only through its profile, so a different profile overrides them with a recorded reason. Production requirements marked as the channel default (reference palette, demo lighting, rig contact, lead height, `ทำไมล่ะ` label, the [project defaults](#project-defaults), A/B endings) belong to that profile. Safety, licensing, Thai readability, deterministic frame-driven output, selected-deliverable independence, factual honesty and the hook/duration targets apply to every profile unless the user explicitly overrides them.

| Field | Choices (extend as needed) |
| --- | --- |
| Genre / purpose | mystery-educational (default), comedy, explainer/tutorial, vlog or documentary cut, news/recap, review, ad/promo, music/lyric video, slideshow/photo story, screen recording, motivational |
| Visual medium | illustrated 2D/3D/hybrid (existing library), user footage, stock/licensed footage, still images, typography/kinetic text, screen recording, mixed |
| Visual engine | for illustrated/animated media: painted 2D (p5.brush) + Remotion SVG (project default), Remotion rig 2D, Blender 3D (deactivated), Remotion rig 2D, a mix of these, Film's choice, or the user's own answer ([visual engine](#visual-engine)) |
| Voice | Gemini TTS ([project default](#project-defaults)), Niwat TTS (male, Edge), Premwadee TTS (female, Edge), user-supplied recording, on-camera audio, no voice |
| Music / SFX | none, user-supplied, licensed library (record the license), shared sound library / locally generated ([`sound-generation` skill](../.agents/skills/sound-generation/SKILL.md)), sparse SFX; ducking under voice |
| Captions | outline (default), box, none; position; burned-in or SRT only |
| Chrome | channel label and progress bar on/off |
| Ending | `A_fade` / `B_loop` (default), `C_seamless` (seamless Reels loop: the last frame blends into the first, see [production requirements](production-requirements.md#outputs-and-story-timing)), hard cut, end card |
| Factual claims | none / opinion only, general knowledge, named real case (decides Boat's involvement) |

Record the chosen values in `delivery.md` as a compact block.

<a id="project-defaults"></a>
**Default — project defaults when the prompt does not say** (user decision, 30 Oct 2026, from WORLD FOG EP01). An illustrated story whose prompt leaves these open uses the values below without asking; record each in `delivery.md` as `default`. A prompt, brief or the user's answer overrides any of them, with the reason recorded.

| Field | Default | Reference |
| --- | --- | --- |
| Visual engine | Painted 2D (p5.brush) for sets, characters and wide-to-medium shots, mixed with crisp Remotion SVG for close-ups and first-person (FPOV) inserts such as a phone screen or an object in the narrator's hands | WORLD FOG VD01, VD09 (PHONE-SVG) in [the brief](../storyboards/world-fog/short/visual-brief.md) |
| Character proportions | The WORLD FOG cast: adult 4 heads tall (1.70 m; 1.60 m for a shorter adult with the same head), mitten hands, flat-face decal heads with face controls, drawn as a flat card at the character's depth | `src/painted/worldfog/cast.ts`, `head.ts`; brief VD03 |
| Arm poses | Bent arms go back into depth with perspective (elbow behind the torso, a shade darker), never splayed out to the side | [CP-P](character-proportion-principles.md#cp-p-arm-depth); `Arm.via` / `Arm.behind` in `cast.ts` |
| Character poses | Pick from the standard pose sheet P01–P45 and the template cast, and cite IDs as a [casting line](character-proportion-principles.md#cp-casting-line); a new pose is proposed to Boss, not made one-off | [CP-P12](character-proportion-principles.md#cp-p-pose-sheet); `src/painted/kit/poses.ts` |
| Camera | Mostly eye level and observational; slow drift or push on every shot; repeated fixed vantages where the repetition carries the story; the torch reveal is the quality reference | WORLD FOG brief "Camera language", VD10, VD12 |
| Voice | Gemini TTS with per-line emotion ([gemini-tts skill](../.agents/skills/gemini-tts/SKILL.md)); narrator Sulafat (female) or Orus (male), "brisk natural pace, no long pauses". Minor characters may stay on Edge TTS ([voice-tuning](../.agents/skills/voice-tuning/SKILL.md)) | WORLD FOG delivery record, 30 Oct 2026 casting |
| New assets | Build every new character, prop, set piece or UI element reusable from the start: it goes in the shared painted kit (`src/painted/kit/`, introduced by the shared-kit work), takes content, colours and lighting as parameters, and is listed in the kit catalog so Film pick it by picture. Story timing and episode-only logic stay in the episode folder. Existing episode modules are not retrofitted (user decision, 30 Oct 2026). | Kit README and catalog |
| Recurring cast | **Film decides per video** whether a character in the brief is an existing recurring character or a new one, and records it as a `VD` decision with the reason (story fit, age, sex, role). Reuse is a choice, not a duty: the cast has no male character yet, so a story that needs one gets a new character. A reused character keeps the same head and body so the viewer knows them on sight; only clothes, accessories and props change. Model each as a cast entry (head style, build, height) plus a swappable outfit, as `CastDef` already separates `head` and `outfit`, never as a per-episode redraw. A new character that is likely to return is added to the kit cast through the [look check](film-visual-brief-workflow.md#look-check); changing a recurring character's head or body is a [look change](film-visual-brief-workflow.md#look-change) and needs the user's approval. | `src/painted/worldfog/cast.ts` (to `src/painted/kit/` in the shared-kit phase 2a); [look check](film-visual-brief-workflow.md#look-check) |
| Thumbnails | Reuse an earlier thumbnail when it already shows the beat's framing; draw a new one only where none fits | Applies once the Film thumbnail sheet is adopted |

The [voice sample](#style-profile) requirement still applies: a default voice is not a user choice. The Gemini key is on the paid tier (per-token billing); keep generation bounded as in the [gemini-tts skill](../.agents/skills/gemini-tts/SKILL.md#limits-and-costs).

**Requirement — hear the voice before integration.** When the voice is TTS or new to the channel, the user hears a sample of about 10 s (the opening lines in the chosen voice, over the planned music bed if there is one) before Editor integrates the full narration. Record the user's choice in `delivery.md`; a default voice is not a user choice. A profile that needs a missing runtime capability is a Boss dependency, not a reason to change the story. Supported runtime fields are listed in [Remotion toolkit 10a](remotion-toolkit.md#10a-footage-stills-music-entry-transitions-and-caption-styles); inspect the active checkout before promising more.

### Visual engine

**Requirement:** before Film's brief or any scene work on an animated or illustrated deliverable, the record names the visual engine. When neither the prompt nor the record names one, use the [project default](#project-defaults) (painted 2D + SVG inserts) and record it as `default`; ask in the [selection call](#resolve-the-selection-before-writing) only when the request does not fit an illustrated story as a multi-select question in the user's language (Thai example: “จะทำภาพด้วยอะไร? เลือกได้หลายแบบเพื่อผสมกัน”):

| Option | Meaning | Runtime status (checkout `733808f`) |
| --- | --- | --- |
| Blender 3D | Rendered 3D shots and assets ([Blender workflow](blender-mcp-workflow.md)) | `deactivated` (user decision, 30 Oct 2026): not offered; code and assets are kept |
| Painted 2D (p5.brush) | Hand-painted watercolour and boiling ink, drawn per frame in `src/painted/BrushCanvas.tsx`; method in the [painted-2d skill](../.claude/skills/painted-2d/SKILL.md) | `existing-integrated` (30 Oct 2026, `main` 59f8cee): painted scene type `src/scenes/painted.ts` with plates by ID in `src/painted/registry.ts`; shipped in WORLD FOG EP01 |
| Remotion rig 2D | The existing vector character rig and scene library (`src/rig/`, `src/scenes/`) | `existing-integrated` |
| Let Film choose | Film picks per scene or element and records the reasons in the brief | — |

Selecting several options means a mix; the brief then states which engine owns each set, character, prop and effect. The harness's free-text answer covers any engine the user names themself. An engine marked `exists-unintegrated` makes its integration a Boss dependency, recorded before Editor work. Re-check the runtime status in the active checkout before relying on this table.

<a id="pipeline-tiers"></a>
## Pipeline

**Requirement (user, 2 Nov 2026):** every video deliverable runs the full pipeline. There are no lighter tiers: the Light and Edit-only tiers are retired.

Boat research → Preaw script → Boat fact-check → Film brief → Film storyboard pass (VO-relative timing) + first [storyboard page](mark-storyboard-workflow.md#user-storyboard-review-page) → Editor [voice lock](#voice-lock) → Film timed scene sheets → Boss assets → Editor

- Record `Full` in `delivery.md`. A stage is `N/A` only when it has no subject at all (for example no narration, so no voice lock), with the reason recorded. A fictional profile still gets Boat research (the legend's sources) and a fact-check of the fact-versus-fiction boundary.
- Media the user supplies (footage, images, audio) is source material for the stages above, filed and inventoried as in Editor's [direct intake](editor-workflow.md#direct-intake); it does not skip Film's brief or scene sheets.
- **Legacy:** deliverables recorded as Light before 2 Nov 2026 (`KSO-EP01-SHORT`, `oldest-shipwreck`) keep the Light stages they were started with (Film's timed shot list in place of the scene sheets). They are not migrated.

Handoff checks apply to every stage: matching revisions, deliverable ID, covered beats and timing status. Progress is tracked in the [task file](#task-file).

<a id="task-file"></a>
### Task file

**Requirement (user, 2 Nov 2026)** for every project: `scripts/<episode>/task.md` is a checklist of the [W1–W8 steps](sequence-workflow.md#painted-shot-by-shot) that answers "how far along is it" without reading `delivery.md`. It holds progress only; decisions, revisions and evidence stay in `delivery.md` and the handoff files, linked by path.

- **Created** by the coordinator in the turn it first writes `delivery.md`, from the template below, one section per deliverable.
- **Updated** by whoever finishes a step (role agent or coordinator), in the same change that updates the deliverable's `Stage / Next owner` cell. The two must agree; when they differ, `delivery.md` wins and `task.md` is corrected.
- **Read first** when the user asks for progress ("ทำถึงไหนแล้ว"): answer from the `Now` line and the open steps, and open `delivery.md` only for detail.
- **Marks:** `[x]` done, `[ ]` open, `[x] … N/A — <reason>` for a step with no subject. Each line is one step plus at most one short note (revision, count, date); link instead of copying.
- **Per-shot steps** (W3.3, W5, W6, W7) carry a count, e.g. `12/26 shots passed`; the per-shot verdicts stay on the storyboard review page.
- For a deliverable whose engine is not painted 2D, W3.1–W3.2 are `N/A` and W5–W6 are Editor's integration and render review.

```markdown
# Tasks — <EPISODE>

Record: [delivery.md](delivery.md) · Updated: <YYYY-MM-DD>, <role>

## <DELIVERABLE-ID>

**Now:** <W-step> — <one line>. **Next:** <owner> — <what, on which revision>

- [ ] W1 Script lock
  - [ ] W1.1 Boat research
  - [ ] W1.2 Preaw script
  - [ ] W1.3 Boat fact-check
  - [ ] W1.4 User approves the script
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
  - [ ] W5.3 Draft passed (0/N shots)
- [ ] W6 Final passed (0/N shots)
- [ ] W7 Pinned (0/N shots)
- [ ] W8 Deliver
  - [ ] W8.1 Assembled from the cache, picture lock
  - [ ] W8.2 Delivery render archived
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

**Default** for how the [coordinator](../AGENTS.md#coordinator-and-agent-parity) runs a tier's stages. Every role agent starts cold and rereads AGENTS.md and its core documents, so invocations cost context. A brief may override a rule with a recorded reason.

- **AI01 — One invocation per stage and revision.** Send the whole stage scope in one brief (every beat, shot or asset it covers), not one call per shot or fix. Batch review notes for the same owner into one revision. **Exception for painting and rendering stages:** Boss and Editor plate work, and Film spikes that paint or render, go one invocation per shot group of 3–5 shots (or one asset family). The delivery record lists the remaining groups. Cost grows with turns × accumulated context, and whole-stage runs measured 150–170 turns at 500–580k peak context (ZCPAINT, 30 Oct 2026).
- **AI02 — Coordinator does mechanical edits inline.** Small edits with no judgment call do not need a role agent: a value, typo, link or `Stage / Next owner` update, applying a change the owning role already decided and recorded, a [single-value fact-check correction](editorial-workflow.md#inline-fact-fixes), or reading status. Name the owning role in the change (e.g. "coordinator for Film, SS-R2.5"). New or substantially revised scripts, fact-checks, briefs, scene sheets, assets and Blender/render work always go to the owning role.
- **AI03 — Keep authoring and checking separate.** The role that checks a piece of work never runs in the same invocation as the one that wrote it (Boat's fact-check of Preaw's script). Boss and Editor runtime work (Blender, renders, audio generation) runs in their own agent, so logs and frames stay out of the coordinator's context.
- **AI04 — Fresh invocation per pass.** Each pass of a role (a new revision, a review-and-fix round, the next shot group) starts a fresh invocation with a short brief: inputs by path and revision, the decisions made since the last pass and the delta to do. Do not resume one agent across passes: its context and cost grow with every pass (BLOOP-EP01-SHORT, 30 Oct 2026: Boss ran 7 passes in one context, 466 calls, 40 % of the session's tokens). Continue an agent (Claude Code: `SendMessage`) only for a clarification of the pass it just finished, minutes later, on the same revision.
- **AI05 — Point, don't paste.** Briefs name file paths, revisions and stable IDs. They do not paste document or handoff content into the brief, and they list only the trigger documents the stage needs beyond the role's core reads.
- **AI06 — Wait once for long jobs.** Batch renders and Blender jobs into one run and wait for it once (a background job or `Monitor`), not with repeated polling. Prove the shot with sampled frames or a low-resolution pass before a full render. A run longer than about 10 minutes renders in per-shot chunks, so a stop resumes at the next chunk, and writes progress (chunks or frames done of total, elapsed, estimate) to its log under `out/logs/`; the coordinator answers status questions from that log's last lines. [AI10](#ai10) covers who waits.
- **AI07 — Short sessions, handoff through the record.** A coordinator session covers one stage, or one review-and-fix round, for one deliverable. Before the session ends, the delivery record's `Stage / Next owner` cell, the [task file](#task-file) and the handoff files carry everything the next step needs (revisions, open items, evidence paths). The next session starts from `task.md`, `delivery.md` and the named revisions, not from chat history. Start a new session rather than continuing one whose context is already long. Keep the model fixed within a session, because switching models restarts the prompt cache.
- **AI08 — One correction, one pass.** When a user correction touches several handoff files (a prop state, a hand side, a mirrored camera), the coordinator invokes once the role whose judgment the correction needs. That invocation updates every affected file (brief, scene sheets, index) with a change-log line naming each file's owner; the other owners review it in their next scheduled pass instead of a relay of invocations. Boss or Editor re-runs once, after the files agree.
- **AI09 — Context checkpoint.** A role agent that passes about 80 turns or about 250k context stops at the next clean point. It records progress, open items and evidence paths in the episode's `build-notes.md` and returns. The coordinator starts a fresh invocation for the rest ([AI04](#agent-invocation)).

- <a id="ai10"></a>**AI10 — No handback mid-job.** A role agent finishes its own long jobs (render, TTS, alignment, Blender) before it returns: it runs them in the foreground, or starts them in the background and waits on the log's completion marker inline (`Monitor` or a bounded wait loop). It does not return while its background work is still running, because the coordinator would then resume it to collect the result. If it must return early (the [AI09](#agent-invocation) cap), the report names the job, its log path and the exact completion line the coordinator waits for.
- **AI11 — Hand off through files.** A role agent reads other roles' outputs (measure files, scene sheets, build notes, sample manifests) by path and revision. The coordinator passes paths, revisions and the user's decisions, never numbers or tables copied out of another agent's report. This keeps the coordinator, the most expensive model, lean, and keeps one source for each number.

Independent deliverables (a Short and a Long) may run as parallel invocations. Stages that depend on each other stay in tier order.

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
