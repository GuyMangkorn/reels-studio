# Select and track video deliverables

**Status:** Required for new editorial work and downstream handoffs. This document owns output selection, variant identity and delivery tracking. [Production requirements](production-requirements.md#outputs-and-story-timing) own duration, dimensions and fps; [editorial workflow](editorial-workflow.md) owns script/review content.

## Resolve the selection before writing

1. Read the user's request and the existing episode delivery record. Reuse an explicit selection; do not ask again when the user already chose the formats or supplied a scoped revision request.
2. If the selection or [style profile](#style-profile) is missing or materially ambiguous, ask with the harness's structured-question tool: `AskUserQuestion` in Claude Code, `request_user_input_async` in Codex; if neither exists, ask in chat. Ask only for what the prompt leaves open, in one call in the user's language: the **selection** with three choices, **both**, **Short only**, **Long only**, showing the duration targets from production requirements (Thai example: “หัวข้อนี้ต้องการทำทั้ง Shorts และ YouTube แบบยาว หรือเลือกแบบใดแบบหนึ่ง?”), and the **style** (genre/medium, voice, music) when none is stated or implied. For an animated or illustrated deliverable, the same call also asks the [visual engine](#visual-engine) unless the prompt or record names one. Do not ask about a choice the prompt or the delivery record already settles. A sent question, preselected option or elapsed wait is not an answer. Continue independent research while waiting; begin format-dependent writing/scene sheets only after the selection is resolved.
3. Record the answer or existing instruction in `scripts/<episode>/delivery.md`: selection, style profile and pipeline tier, evidence of the user's choice, deliverable IDs, target durations and scope. `short`, `long` and `both` are authoring labels, not runtime fields. Default counts are one standalone Short and one Long when both are selected. A chapter series, multiple Shorts or additional edits require explicit scope; selecting both does not make every Long chapter a Short.
4. Route each selected deliverable through the [pipeline tier](#pipeline-tiers) in its record; the Full tier is Boat research → Preaw script → Boat fact-check → Film brief → Mark written scene sheets → Boss shared assets/capabilities → Editor integration/editing. Shared research may feed both. A scriptwriting-only assignment ends with editorial handoff; selection does not authorize automatic downstream production, agent execution or cross-chat messaging.

Selection is complete when the record identifies the selected deliverables and the instruction resolving the choice. An explicit custom duration/scope overrides defaults with its reason recorded. For a new version of existing production, preserve existing IDs and evidence; record a migration map before changing paths or IDs. Workflow updates alone do not migrate historical episodes.

## Style profile

**Requirement:** every deliverable record names one style profile. Rules written for the channel's illustrated mystery/educational format are the **`channel-default`** profile; they bind a deliverable only through its profile, so a different profile overrides them with a recorded reason. Production requirements marked as the channel default (reference palette, demo lighting, rig contact, lead height, `ทำไมล่ะ` label, Niwat TTS, A/B endings) belong to that profile. Safety, licensing, Thai readability, deterministic frame-driven output, selected-deliverable independence, factual honesty and the hook/duration targets apply to every profile unless the user explicitly overrides them.

| Field | Choices (extend as needed) |
| --- | --- |
| Genre / purpose | mystery-educational (default), comedy, explainer/tutorial, vlog or documentary cut, news/recap, review, ad/promo, music/lyric video, slideshow/photo story, screen recording, motivational |
| Visual medium | illustrated 2D/3D/hybrid (existing library), user footage, stock/licensed footage, still images, typography/kinetic text, screen recording, mixed |
| Visual engine | for illustrated/animated media: Blender 3D, painted 2D (p5.brush), Remotion rig 2D, a mix of these, Film's choice, or the user's own answer ([visual engine](#visual-engine)) |
| Voice | Niwat TTS (default), user-supplied recording, on-camera audio, no voice |
| Music / SFX | none, user-supplied, licensed library (record the license), shared sound library / locally generated ([sound workflow](sound-generation-workflow.md)), sparse SFX; ducking under voice |
| Captions | outline (default), box, none; position; burned-in or SRT only |
| Chrome | channel label and progress bar on/off |
| Ending | `A_fade` / `B_loop` (default), `C_seamless` (seamless Reels loop: the last frame blends into the first, see [production requirements](production-requirements.md#outputs-and-story-timing)), hard cut, end card |
| Factual claims | none / opinion only, general knowledge, named real case (decides Boat's involvement) |

Record the chosen values in `delivery.md` as a compact block. A profile that needs a missing runtime capability is a Boss dependency, not a reason to change the story. Supported runtime fields are listed in [Remotion toolkit 10a](remotion-toolkit.md#10a-footage-stills-music-entry-transitions-and-caption-styles); inspect the active checkout before promising more.

### Visual engine

**Requirement:** before Film's brief or any scene work on an animated or illustrated deliverable, the record names the visual engine. When neither the prompt nor the record names one, ask in the [selection call](#resolve-the-selection-before-writing) as a multi-select question in the user's language (Thai example: “จะทำภาพด้วยอะไร? เลือกได้หลายแบบเพื่อผสมกัน”):

| Option | Meaning | Runtime status (checkout `733808f`) |
| --- | --- | --- |
| Blender 3D | Rendered 3D shots and assets ([Blender workflow](blender-mcp-workflow.md)) | `existing-integrated` |
| Painted 2D (p5.brush) | Hand-painted watercolour and boiling ink, drawn per frame in `src/painted/BrushCanvas.tsx` | `exists-unintegrated`: a 5 s spike on its own entry point (`src/painted/spike/`), not wired into the scene renderer or episode registry |
| Remotion rig 2D | The existing vector character rig and scene library (`src/rig/`, `src/scenes/`) | `existing-integrated` |
| Let Film choose | Film picks per scene or element and records the reasons in the brief | — |

Selecting several options means a mix; the brief then states which engine owns each set, character, prop and effect. The harness's free-text answer covers any engine the user names themself. An engine marked `exists-unintegrated` makes its integration a Boss dependency, recorded before Editor work. Re-check the runtime status in the active checkout before relying on this table.

## Pipeline tiers

Choose the lightest tier whose outputs the deliverable needs, record it in `delivery.md` and mark skipped stages `N/A` with the reason. Skipping is a recorded scope decision, not a missing handoff.

| Tier | Use when | Stages |
| --- | --- | --- |
| **Full** | New illustrated story with staging, factual claims or twists | Boat research → Preaw script → Boat fact-check → Film brief → Mark scene sheets → Boss assets → Editor |
| **Light** | Short or simple video from a brief, footage-led or typographic edit with a script | Preaw script (Boat fact-check only when the profile has factual claims) → Film brief (medium, look, music, caption plan; one page) → Editor. Mark's scene sheet is replaced by a timed shot list inside the Film brief; Boss only for named capability gaps |
| **Edit-only** | The user supplies footage/images/audio and an edit brief | Editor directly ([direct intake](editor-workflow.md#direct-intake)); Boss only for named capability gaps. A script, if wanted, is Preaw's |

Tier changes after the start require a recorded reason. Handoff checks still apply to the stages that run: matching revisions, deliverable ID, covered beats and timing status. A lighter tier never waives licensing, factual review of asserted claims, Thai readability or the QA the owning workflows require for what is actually produced.

### Agent invocation

**Default** for how the [coordinator](../AGENTS.md#coordinator-and-agent-parity) runs a tier's stages. Every role agent starts cold and rereads AGENTS.md and its core documents, so invocations cost context. A brief may override a rule with a recorded reason.

- **AI01 — One invocation per stage and revision.** Send the whole stage scope in one brief (every beat, shot or asset it covers), not one call per shot or fix. Batch review notes for the same owner into one revision.
- **AI02 — Coordinator does mechanical edits inline.** Small edits with no judgment call do not need a role agent: a value, typo, link or `Stage / Next owner` update, applying a change the owning role already decided and recorded, or reading status. Name the owning role in the change (e.g. "coordinator for Mark, SS-R2.5"). New or substantially revised scripts, fact-checks, briefs, scene sheets, assets and Blender/render work always go to the owning role.
- **AI03 — Keep authoring and checking separate.** The role that checks a piece of work never runs in the same invocation as the one that wrote it (Boat's fact-check of Preaw's script). Boss and Editor runtime work (Blender, renders, audio generation) runs in their own agent, so logs and frames stay out of the coordinator's context.
- **AI04 — Continue instead of re-invoking.** A follow-up for a role whose agent finished minutes ago continues that agent (Claude Code: `SendMessage` to it). After a long gap or a new revision, start a fresh invocation with a short brief.
- **AI05 — Point, don't paste.** Briefs name file paths, revisions and stable IDs. They do not paste document or handoff content into the brief, and they list only the trigger documents the stage needs beyond the role's core reads.
- **AI06 — Wait once for long jobs.** Batch renders and Blender jobs into one run and wait for it once (a background job or `Monitor`), not with repeated polling. Prove the shot with sampled frames or a low-resolution pass before a full render.
- **AI07 — Short sessions, handoff through the record.** A coordinator session covers one stage, or one review-and-fix round, for one deliverable. Before the session ends, the delivery record's `Stage / Next owner` cell and the handoff files carry everything the next step needs (revisions, open items, evidence paths). The next session starts from `delivery.md` and the named revisions, not from chat history. Start a new session rather than continuing one whose context is already long. Keep the model fixed within a session, because switching models restarts the prompt cache.

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

Before each handoff, confirm the deliverable ID, matching source revisions, covered beats and timing status. A passing review/handoff for one deliverable does not pass the other. Update stale readiness labels after a recheck; retain dated prior results as history. Record user approval only with evidence, separately from selection and readiness; this workflow adds no blanket approval gate.

Editor keeps one deterministic executable assembly **per selected deliverable**, using shared renderer/assets. Each has its own clock, boundaries, ending, audio and subtitle cues. Check actual source support before registering/loading it. Run blockout, visual-storytelling, Studio/render/seek and final-duration checks for the selected deliveries under their owning workflows. Shared-library changes additionally check affected consumers, including an unselected existing output when impacted; this does not authorize producing a new unselected version. Label missing evidence and do not claim release readiness from estimated timing. Link user-facing scene samples and their reproduction metadata under [Editor workflow](editor-workflow.md#scene-samples-for-the-user).
