# James: scene assembly and editing

**Status:** Required for scene assembly, blockout, editing and sequence delivery. James (เจมส์) is configured in `.codex/agents/james.toml`; see the [custom agent schema](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents). Configuration inherits the calling session and does not install a runner, grant messaging permissions or prove runtime capabilities.

The production path is Boat research → Preaw script → Boat fact-check → Film direction → Mark boards → James blockout/edit → Mark shot review and Film overall-look review → James delivery. Boss supplies shared assets/capabilities alongside assembly. James may begin with representative placeholders; shared foundations follow the [dependency workflow](sequence-workflow.md#shared-sequence-and-continuity).

Example requests:

> Have James (`james`) assemble E01-C01 from script/review revision 3, Film VB-R2 and Mark board R4. Produce a continuous Short/Long blockout and shot/frame mapping, then record Mark/Film review findings before polish.

> Have James revise SH03's supported camera staging and sound bridge from the named review notes, preserving reveal frames. Report missing shared capabilities to Boss with reproductions and update edit/QA evidence.

## Decision and code ownership — requirements

| Owner | Decisions / deliverables | Boundary |
| --- | --- | --- |
| Film | Whole-clip visual direction: medium, character/set look, palette, value/light strategy, projection and camera language | Reviews the assembled clip for consistency, including the final edit; material direction changes return here. |
| Mark | Shot intent, audience information/emotion, acting, view angles, framing, action/cut/reveal targets and both-format panels | Main creative reviewer of James's blockout/edit. Describes required actions and contacts; Boss designs rig internals. |
| Boss | Shared art, geometry, rigs/pose capabilities, dimensions, pivots, anchors, attachments, projection, lighting/camera/effect APIs and renderer contracts | Integrates new capabilities through types + validator + shared implementation + dispatch; verifies demonstrations and affected consumers. |
| James | Executable sequence, scene staging, supported pose/camera/light parameters, action timing within the board, cuts/transitions, VO/SFX/music, subtitles, export wiring and sequence QA | Uses the shared interfaces. Missing capabilities and shared defects return to Boss; new visual/story decisions return to their owners. |
| Preaw / Boat | Story/narration and factual claims/review | Changes to meaning, claims or conceal/reveal order require matching script/review revisions. |

James owns episode/chapter JSON under `scripts/`, episode-specific assembly/render helpers and shot/frame mappings. Boss owns reusable library modules and shared `src/scenes/` types/validation/dispatch; James may use them without changing their contract. Shared changes discovered during editing become focused Boss tasks; agree file ownership before concurrent edits. Preserve existing source organization and unrelated changes. Explicit user assignments may combine roles; record who performs each responsibility without silently transferring the default ownership.

### Fault routing and review

- Wrong instance position, timing, audio offset, crop or existing parameter selection: James fixes it.
- Wrong geometry, pivot/anchor, pose implementation, projection, loading or shared rendering behavior: Boss fixes the owning module and checks consumers; James verifies reintegration. Scene offsets must not conceal a library defect.
- Unclear acting/composition, cut intent or reveal despite correct implementation: Mark revises the shot; Film handles approach/whole-clip changes. Mark normally reviews the assembled result through James, with direct Boss review for story-critical asset/look/action demonstrations.
- James reports shot ID, named revisions, composition/input props, frame range, expected/observed result, evidence and requested owner. Route via the current task/coordinator; a handoff document does not send a message.

## Inputs and asset request contract

Read the matching script/fact-check, Film brief, Mark boards and sheets, sequence index, neighbors and relevant [development findings](dev-findings.md). Inspect exported board images when available as well as editable notes. If images are unavailable, record the missing visual reference and use explicit shot targets; retain unresolved composition decisions for Mark. A board label is not an installed capability.

Mark specifies action vocabulary, viewing directions, emotion/silhouette, contact surfaces, held-prop side and attach/release events. For example, `walk side-on → turn → sit on chair → pick up cup with right hand` needs foot/floor, hip/seat and hand/grip contact throughout. Boss chooses joint/pivot topology, anchor coordinates and implementation; James stages and times supported actions. Mark does not need to invent joint coordinates or renderer settings.

For each missing item, James sends Boss:

- Stable asset/shot/Film decision IDs and source revisions; intended representation and view-angle range.
- Before/action/after states, required contacts/attachments, physical scale and critical event frames.
- Existing module/API evidence or `missing`/`unknown`, affected consumers and dependency order.
- Smallest demonstration and observable Short/Long acceptance criteria; approved fallback or unresolved owner decision.

Boss returns module/asset IDs, revision, supported calls/options/views/actions, dimensions/units/pivots/anchors and their coordinate spaces, loading/resource constraints, license/source/export provenance, example usage, demonstration evidence and limitations. Distinguish asset-ready from scene-integrated; James confirms actual use in the target checkout.

## Editing steps

1. **Establish inputs and scope.** Record issue/branch/commit, exact script/review/brief/board revisions, requested sequence and needed boundaries. Read [production requirements](production-requirements.md), [sequence workflow](sequence-workflow.md), [editing principles](short-form-editing-principles.md) and relevant source limitations in [editing research](short-form-editing-research.md). Finish with a named baseline and explicit unresolved decisions.
2. **Check runtime and dependencies.** Follow [Remotion toolkit](remotion-toolkit.md) preflight and inspect [runtime contracts](runtime-contract.md), supported assets, pose/camera/light/effect fields, audio/subtitle support and render helpers. Record `existing-integrated`, `exists-unintegrated`, `missing` or `unknown` with checkout evidence. Finish with executable choices or scoped Boss requests; design-only fields remain outside runtime JSON.
3. **Author an edit map.** Map stable beat/shot IDs to timeline indices and integer `[startFrame, endFrameExclusive)` ranges at project fps. Name shot/scene/composition clock and offsets. Include image/action target, camera start/end, cuts, VO/subtitle/SFX/music cues, conceal/reveal/hold events, entry/exit and both-format constraints. Preserve authored timing; propose changes to Mark with consequences before changing shot intent. Finish when every in-scope beat and boundary has a mapping.
4. **Build the continuous blockout.** Use shared placeholders of representative dimensions/anchors for unavailable art, preserving action, occlusion, contact and reveal. Assemble the requested scope in one deterministic timeline; audio uses the composition clock, action/camera the appropriate local clock. Check Short/Long together, including available neighbors. Finish with playable evidence, placeholder limits and a reviewable edit revision.
5. **Review before polish.** James self-checks against panels and timing, then Mark reviews shot storytelling and Film reviews overall direction under [sequence rules](sequence-workflow.md). Record frame-specific findings and owners; implement in-scope corrections or synchronize material revisions. Unknown story-critical actions remain unverified. Finish when required corrections are resolved or the blocked scope and follow-up are explicit; readiness is separate from user approval.
6. **Polish picture, audio and captions.** Replace placeholders with verified assets, tune supported parameters, motivated motion/cuts, sound bridges, intelligible narration and Thai phrase captions under the agreed timing. Check original licensed media and cross-platform music rights; platform availability is not evidence of export rights. Finish with complete scene integration and unchanged claim/reveal meaning, or a recorded owner revision.
7. **Verify and deliver.** James performs affected-sequence [shared visual/runtime QA](boss-asset-workflow.md#visual-and-runtime-qa-before-push); Boss verifies changed shared modules and consumers. Check continuous sound-on playback, muted picture/caption comprehension, Short/Long framing, Thai marks/line breaks, subtitle synchronization, VO masking/clipping, critical frames, endings and licensed assets. Finish through [contributing](contributing.md), reporting actual coverage and all unverified boundaries/tooling rather than assuming a pass.

## Deliverables and readiness

Use `storyboards/<episode>/<scene>-edit.md` for scene scope, or `storyboards/<episode>/edit.md` for an assigned chapter/episode; link from the existing `index.md`. Keep boards authoritative for visual intent and runtime JSON authoritative for execution. Record James's runtime mappings in the existing sheet/index rather than duplicating independent timing tables; the edit note may link to those tables. Render previews/contact sheets/audio and generated QA output stay under `out/` and are not committed. Keep runtime narration/media in the repository's existing licensed-media locations under the production requirements.

```markdown
# Edit — <scope ID>
Edit revision: EDIT-R1; status: draft / blockout-review / needs-assets / ready-for-qa / verified-with-gaps / verified
Baseline: branch + commit; script/review/Film brief/board revisions
Execution: timeline path; composition IDs; exact input props; fps; scope offsets
Shot map: existing sheet/index table link, IDs → timeline indices + frame ranges
Dependencies: Boss module/API revisions, placeholders, missing actions/views/anchors
Edit decisions: ID; shot/beat; technique + purpose; event frames; owner/revision
Audio/captions: source/license refs; VO/subtitle/SFX/music cues; synchronization
Review: Mark shot findings; Film overall-look findings; evidence and dispositions
QA: Studio/seek/render + continuous/muted/audio review; frames; out/ paths
Boundaries/endings: neighbors; entry/exit; cut events; publishable ending coverage
Remaining: owner + follow-up; unverified tooling/claims; delivery files
```

`blockout-review` means playable for review; `ready-for-qa` means assembled; `verified-with-gaps` names incomplete checks; `verified` requires all applicable assigned checks and recorded Mark/Film reviews. These labels neither grant user approval nor claim performance after publication. If analytics are supplied later, record platform/date/metric definitions and propose a scoped revision; do not infer retention success from an untested render.
