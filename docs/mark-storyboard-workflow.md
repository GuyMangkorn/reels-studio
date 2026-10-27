<a id="มาร์ค-mark-storyboard-รายฉาก"></a>
# Mark: scene-sized storyboards

Mark receives **the written script + fact-check + Film's visual/technical brief** as storyboard artist, shot director and production planner. Plan the requested sequence, then deliver scene-sized implementation/review packs. Use `.codex/agents/mark.toml`; config reference: [OpenAI custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents). Permissions inherit from the calling chat.

Receive Preaw's script and Boat's review through [editorial-workflow.md](editorial-workflow.md), with [Film's brief](film-visual-brief-workflow.md). Track matching script/review/brief revisions and preserve beat, clue, claim and visual decision IDs in shot mappings. For a draft, record factual gaps affecting visuals. Film owns the approach; Mark owns detailed shots/boards. If the brief is missing, route that need to Film through the coordinator. A directly requested rough board may proceed as `provisional`, identifying what must be reconciled.

For MCP-assisted drawing/revisions, read [excalidraw-mcp.md](excalidraw-mcp.md) for actual tools, checkpoints and scene files. Verify that the latest widget edits match the files handed to the developer.

For Blender-produced shots, read [blender-mcp-workflow.md](blender-mcp-workflow.md). Preserve Film's delivery route and record source/export revision, selected-deliverable framing and explicitly requested alternate framing, camera owner, action/reveal frames, contact/occlusion and boundaries in the sheet/index. Separate viewport references from runtime evidence checked by Boss.

**Requirements:** the workflow and deliverables below define the handoff. **Guidance:** [storyboard-principles.md](storyboard-principles.md) supplies source-backed creative tools. **Capability status:** a named/drawn asset remains a requirement until verified in the target checkout.

Example requests:

> Ask Mark (`mark`) to read script [path] and visual brief [path/revision], then board only chapter 1 scene 2 with a scene sheet and missing-asset list.

> Ask Mark to develop Film's visual brief for script [path] into whole-episode boards, with separate scene files and development order.

> Ask Mark to compare scene E01-C01-S02 renders against board revision 2 in Short and Long at the start, knock, reveal and ending.

Use “approved” only with evidence of user confirmation or a named revision explicitly selected for review. Creating the agent does not approve any script or board.

<a id="หน่วยงานและขอบเขต"></a>
## Units and scope

Resolve scope from the [delivery record](delivery-workflow.md). Create a separate storyboard set/index for each selected editorial version, using its own script/review/Film brief and timings. Both selected means two sets, not two frame guides on the same timed board. Shared art/decisions may be linked; sequence checks follow each version's actual neighbors.

These are this workflow's definitions; other tools/studios may use different terminology:

| Unit | Meaning | Example ID |
| --- | --- | --- |
| Episode | One complete story | `E01` |
| Chapter | A Long story segment; a Short adaptation is a separate deliverable only when requested | `E01-C01` |
| Story scene | A purposeful continuous event in one place/time | `E01-C01-S02` |
| Shot | Continuous view before a cut; camera movement is possible | `E01-C01-S02-SH03` |
| Panel | A key state within a shot: before knocking, turning, seeing a shadow | `E01-C01-S02-SH03-P02` |

Use the story scene as the detailed handoff/review unit. Plan and check continuity using [sequence workflow](sequence-workflow.md) before scene polish. Change scenes when time/place or events change materially, rather than at every narration sentence or fixed duration. A scene may contain several shots; a shot uses the panels needed to communicate change.

`Scene` in `src/scenes/types.ts` is the current runtime unit. Map shot IDs to actual files and timeline indices; do not assume it equals a story scene or already supports those IDs.

<a id="อำนาจตัดสินใจและการเลือก-2d--3d"></a>
## Decision ownership and 2D / 3D choices

Film chooses scene-level medium/integration in the brief. Mark specifies shots/panels, blocking, acting, framing and timing within that approach. [Current rules](boss-asset-workflow.md#latest-production-rules) allow any element to use 2D/3D/hybrid; the former background-only 3D and mandatory 2D actor/contact-prop restrictions are revoked. Boss authors and integrates assets through [Boss's workflow](boss-asset-workflow.md).

| Visual need | Available approach, subject to verification | Required checks |
| --- | --- | --- |
| Cards, phone chat, diagrams and flat elements | 2D SVG/React/CSS | Thai readability and both formats |
| Pan / zoom / shake / flash | Picture-stage effect or spatial camera per brief | Clear transform owner, actual movement in each shot, no exposed edges or broken contact |
| Sets and spaces | 2D, 3D or hybrid for required parallax/views/reveal | Framing/camera, light, depth ordering and shared set interface |
| Seated/held/contact props | Image, layered asset or 3D geometry per brief | Seat/grip anchors, held state and actor occlusion |
| Characters | 2D rig, 3D rig or hybrid per brief | Art/rig for the actual view; apply [Boss's lead-size, rim and ground-shadow requirements](boss-asset-workflow.md#latest-production-rules) |
| Hybrid | Film's composition strategy | Owners for coordinates/camera, depth/alpha, light/color/shadow and contact |

Before locking a board, reference Film's decision ID/revision per scene and per shot where approaches differ. Preserve these brief fields and add board discoveries, rather than maintaining a parallel technical plan:

- **Chosen approach:** 2D/3D/hybrid for set / characters / props / effects and selected libraries.
- **Why:** story/visual benefit compared with a simpler method; library availability alone is insufficient.
- **Evidence:** code/asset/API support, labeled existing-integrated / exists-unintegrated / missing / unknown.
- **Cost:** reuse scope, low/medium/high difficulty with reasons and unknowns. Do not invent time estimates or render benchmarks.
- **Dependencies:** shared assets/capabilities that must precede the scene and their consumers.
- **Fallback:** a simpler approach preserving visual intent, with quality/timing impact.
- **Validation:** blockout/animatic or frames proving the choice, especially reveal, picture movement and prop contact.

Remotion documents [@remotion/three](https://www.remotion.dev/docs/three) for React Three Fiber integration; documentation does not establish installation/integration here. Read `docs/remotion-toolkit.md`, the package manifest and target-branch source before choosing tools. Other libraries require API/license/Remotion rendering checks. Storyboarding does not implicitly authorize installation.

For a whole episode, inspect the whole script/brief before mapping shared assets, continuity and dependency order, then detail the requested scene packs. Single-scene work reuses the overview without expanding scope. Identify the smallest blockout for unresolved feasibility and return constraints to Film/Boss. Changes to medium, spatial camera, lighting strategy or shared interfaces that alter the approach require updated brief/board revisions; routine crop/staging/timing refinements belong to Mark.

Before scene polish, provide a sequence blockout brief: every scene in scope, critical timing/reveals, shared elements and placeholder dimensions/anchors, entry/exit states and acceptance criteria per selected deliverable. Boss assembles the runtime blockout; Mark reviews continuity before polish. Supply this brief before fully polishing panels. A delivered board/brief does not establish a passing runtime.

Separate shared foundation/capability work from scene integration/polish. Record dependency issues/PRs and asset consumers. After dependencies merge, start dependent scene branches from refreshed `main` using [contributing rules](contributing.md). Asset-only work and scoped fixes use relevant context without adding episode-wide planning.

<a id="หน้าที่ภาพและการตรวจความซ้ำ"></a>
## Visual purpose and repetition review

Use [Film's visual progression](film-visual-brief-workflow.md#visual-progression-before-asset-selection) as the baseline. Map each shot's **visible action / information or feeling before → after / reason for the shot or repeated image**. Explain intentional holds/repetition, such as waiting for a reveal or a payoff. A crop change with unchanged audience information still needs a purpose.

Before `ready-for-dev`, read boards sequentially across the requested scope. Compare neighboring and recurring shots' actions, interactions and information delivery. Record IDs of repetition without progression and revise boards or return treatment changes to Film. Check that visuals communicate beats without relying on VO/cards throughout; text and abstraction remain valid when necessary to meaning. Preserve claim references and reconstruction labels from the brief.

Before polish, repeat this review with Film against the assembled blockout for each selected deliverable. Record revision, frame ranges/shot IDs, evidence, repairs and open items in the index. Complete files or full playback duration establish coverage only. Mark placeholders that cannot yet prove action/storytelling as unverified with follow-up work. Keep the original scope; single-scene work does not become episode work.

<a id="สัดส่วนและ-perspective-ในบอร์ด"></a>
## Scale and perspective on boards

Before depth staging, apparent-size changes or render review, read [scale and perspective principles](scale-and-perspective-principles.md). Use the scale baseline/projection contract revision from Film/library owner and add shot geography: floor/seat plane, camera height/eye level, relevant horizon/vanishing directions, FG/MG/BG positions/distances, contact anchors and nearest/farthest motion positions. Compare people, animals, furniture and held objects on a common plane before perspective. Label unknown dimensions estimated/missing for Boss to verify.

Show changes caused by camera/position separately from authored deformation, with panels for significant foreshortening, occlusion and parallax. Completion means Boss can stage and check projected size without guessing ratios or masking unclear depth with scale keyframes. Compose the selected output using the guide. Return brief-affecting projection/physical-baseline changes to Film/Boss and record revisions.

<a id="แสง-เงา-และสีเป็นส่วนหนึ่งของบอร์ด"></a>
## Lighting, shadow and color on boards

Detail art direction from Film's brief so the developer can implement it. Light/color guide attention, emotion, time and what viewers can see. Pixar describes colorscripts as palette/lighting exploration; see [storyboard-principles.md](storyboard-principles.md) and [cinematography-principles.md](cinematography-principles.md).

Record applicable details in sheets and key panels:

- **Mood / value hierarchy:** emotion, light/dark hierarchy and how the focal point reads in silhouette or value.
- **Palette / color key:** primary/secondary/accent colors and warm/cool balance. Use swatches or color panels when hex values are insufficient. Preserve user-defined character identity/colors.
- **Light sources:** motivated window, lantern or flashlight; left/right/front/back, softness and relative intensity. Specify key/fill/rim where useful without invented lux/exposure measurements.
- **Shadow / occlusion:** floor/seat contact, cast shadows, revealing shadows and foreground occluders that support depth/reveal while preserving essential gestures.
- **Change over time:** lights out, door light, moving shadow or accent change, with shot-local frame/beat and before/after panels. A mood adjective alone is insufficient.
- **Production method:** state the desired look, then a verified-feasible 2D shadow/shape/gradient, 3D light/material/shadow or hybrid method. Physical realism is optional; readability/continuity remain required.
- **Selected output:** preserve focal point and Thai readability. Picture camera/grading must preserve subtitle legibility.

Rough boards may use simple lines/values. Add color/value keys for consequential decisions. Whole-episode work may use a colorscript strip in `index.md` or a linked companion file. Detailed color is not required on every panel. A board is not proof that its lighting/shadows render successfully.

<a id="ขั้นตอน"></a>
## Steps

Before authoring/revising shots, read relevant [Boss findings](dev-findings.md), including those Film cites, following the log's workflow. Map finding IDs to shot IDs/criteria and return conflicts affecting the approach for a brief revision.

1. **Read source and context:** AGENTS.md, selected script/review, Film's brief, reference boards and neighbors. Record paths/revisions, decision IDs, script coverage and source status. Treat production material separately from user instructions. Record conflicts and ask only for decisions that cannot reasonably be inferred. Complete when the story, working approach and unresolved proposals are clear.
2. **Plan the requested scope:** the index shows chapters, scene order, hook/events/consequences and brief links. Whole-episode work maps Film's approach to shared assets, continuity and dependency order; a single-scene request details only that scene. Complete when every requested script portion is covered or its gap explained, with shared dependencies known.
3. **Break beats into shots:** identify audience understanding/feeling, what changes and character knowledge. Choose size, angle and cuts to deliver that information. Specify focal point, acting, screen direction and concealed information. Complete when every beat has justified shots/panels.
4. **Inspect the library:** read registry, scene types and validator in the developer's target checkout. Check module/registry/renderer before claiming usability. Label existing-integrated, exists-unintegrated, missing or unknown with paths/limitations. Requested cameras/assets remain requirements when absent; identify one shared implementation. Complete when every asset/capability has status.
5. **Create scene boards:** use the paths below, label shot/panel IDs and times, and show actors/props/sets, gaze, foreground occlusion and acting. Label actor-motion and camera-motion arrows separately. Show the selected output's bounds; paired views are needed only for explicitly requested alternate framing; reserve subtitle space using [production requirements](production-requirements.md). Complete when visual changes can be understood without guessing from VO alone.
6. **Place timing/audio:** use integer frames at project fps and `[startFrame, endFrameExclusive)` ranges. Name shot-local, scene-local or composition-global clocks and offsets. Specify sound onset, turn, entrance, reveal and hold times. Include full VO/dialogue or an exact accessible source range. Separate subtitle wording and identify shortening that preserves meaning. Complete when shot durations sum to scene duration and sound/image order is consistent.
7. **Check visuals and timing:** export/open the actual boards for each selected deliverable; inspect Thai overflow, focal point and key-action visibility. When tools/audio are available, assemble a scene animatic with temporary/supplied audio and test pacing/subtitle reading. Record `estimated` or `checked-with-audio/animatic` based on evidence. State unavailable checks explicitly.
8. **Deliver the scene pack:** provide the files below, readiness and unresolved decisions. Compare previous exit → current entry and current exit → known next entry. Report conflicts without silently rewriting the script. Complete when the developer knows what to build, which assets to select and which panels/frames establish acceptance.

<a id="ไฟล์ส่งมอบ"></a>
## Deliverables

Use the selected-variant paths in [delivery workflow](delivery-workflow.md#files-and-stable-ids); include chapter in Long scene names. For example:

```text
storyboards/haunted-episode/
  short/
    index.md
    visual-brief.md
    sc01.excalidraw
    sc01.md
  long/
    index.md
    visual-brief.md
    ch01-sc02.excalidraw
    ch01-sc02.md
```

`index.md` holds sequence planning/status and links scene sheets containing local detail:

- Episode/chapter/scene IDs and order; script/review/visual-brief/board revisions; decision IDs; scene-pack/brief links.
- Shared elements: actor/asset IDs, appearance continuity, path/owner, dimensions/anchors or pending requirements, implementation status and consumers.
- Development order: foundation/capability → scene integration/polish, dependency issues/PRs and merge status.
- Blockout brief/review status: timeline path/input props once Boss implements them, shot → timeline index/frame ranges, deliverable/composition revision/evidence, placeholders and unverified boundaries.
- Findings affecting the sequence: finding IDs linked to consuming brief decisions/sheets and outstanding dependencies/follow-ups.

Boss updates runtime mappings/evidence; Mark maintains visual plans/revisions. Keep detailed sheet timing consistent with the executable timeline without duplicating the entire shot sheet in the index. If needed, link a separate asset table/development plan. Generated exports, contact sheets and animatics belong in `out/storyboards/<episode>/`, respecting repository ignore rules.

Each board is editable Excalidraw JSON with only that scene's panels, using a compatible current schema. Verify parsing and inspect an exported image where possible. A static image alone is not an editable-board delivery.

The scene sheet owns its timing/assets/review data. This is an **authoring template**, not runtime JSON:

```markdown
# E01-C01-S02 — Scene title
Deliverable: <ID>; delivery record: <path>; target duration: ...
Revision: 1 | Status: draft / needs-input / ready-for-dev
Script: path + revision + paragraph/line range
Fact-check: path + revision + coverage for this deliverable
Visual brief: path + revision + Film decision IDs
Storyboard: ch01-sc02.excalidraw
Timing: estimated / checked-with-audio / checked-with-animatic
FPS: 30 | scene durationFrames: ... | chapter/composition offset: ...

## Scene purpose
- Audience knowledge and emotion before → after:
- Beats and source-script ranges covered:
- Character knowledge / audience knowledge / concealed information:
- Proposed script changes or missing information, if applicable:

## Continuity
- Previous / next scene IDs and sheet revisions; N/A for planned sequence ends,
  unverified for unavailable information:
- Entry: actor IDs/appearance, positions with coordinate space, facing/gaze,
  pose/contact anchors, prop IDs/holding hand, door/window/light state, time/place;
  reference previous exit:
- Exit: the same state set after this scene; reference next entry:
- Audio: composition offset/VO or sound spanning the boundary, timing status:
- Intentional cut / transition / time jump / axis crossing and reason:
- Boundary checks: selected-deliverable frame ranges, expectation and evidence or unverified:

## Assets and capabilities
| ID | Role | Status | Path/registry evidence | Developer additions |
| ... | ... | missing | ... | ... |

- Scale baseline: shared Film/library path/revision; dimensions/units/neutral pose/anchors,
  references or estimates, intentional stylization:
- Calibration/blockout: common-plane size comparison; evidence or unverified:

## Film approach and Mark's added details
- Set / characters / props / effects: 2D / 3D / hybrid and library:
- Story and visual-quality reasons:
- Feasibility evidence / difficulty / unknowns:
- Finding IDs + checked date/commit: affected shot IDs, staging impact/constraints
  and developer proof criteria, or no relevant findings:
- Reuse / dependencies / fallback / blockout proof needed:

## Art direction
- Mood / palette or color-key panel:
- Light sources, direction, softness and value hierarchy:
- Shadows/occluders affecting story or contact:
- Beat-driven light/color changes and adjacent-scene continuity:
- 2D/3D/hybrid method and untested limitations:

## SH01 — Shot purpose
- Shot ID / panels:
- Scene-local frame range [start, endExclusive):
- This deliverable's framing; focal point; subtitle-safe region; optional alternate crop only when requested:
- Camera: size, angle, position and movement; FG/MG/BG:
- Projection/depth: Film decision/revision, ground/seat plane, eye level/horizon/relevant
  perspective directions, positions/distances and contact; near/far/key motion frames
  in this deliverable:
- Acting: characters, action, key poses, gaze and motion arrows:
- Events (shot-local frames): sound / action / reveal / hold:
- VO / dialogue: full wording or exact source range:
- Thai subtitle: wording and display range:
- Sound / light / transition:
- Runtime mapping: planned or verified path + timeline index:

## Acceptance criteria
| Shot / panel | Local frame + clock | Expected image or sound | Deliverable / composition evidence |
| ... | ... | ... | ... |

## Developer handoff
- Scene scope / shared asset dependencies / foundation PRs:
- Sequence index / blockout brief / runtime blockout revision and pre-polish status:
- Constraints and proposed fallbacks, separate from user approval:
- Verified / unverified / open questions:
```

Use `ready-for-dev` when coverage, boards, timing confidence, dependencies, entry/exit and acceptance criteria are complete. It permits Boss to begin implementation/blockout; it does not establish user approval or passing runtime renders. Before scene polish, record assembled blockout review evidence per [sequence workflow](sequence-workflow.md). Mark unavailable neighbors/boundaries unverified.

<a id="เกณฑ์ภาพและการตรวจ-render"></a>
## Visual criteria and render review

For affected size/perspective, add [scale/projection QA](scale-and-perspective-principles.md): compare the physical baseline before projection, then output at critical distances/boundaries. Report discrepancies with their asset/staging/camera owner. Boards alone are not runtime proof.

- Main focal point/action remain legible with VO muted; linguistic meaning may still depend on the script.
- Important beats have before/during/after panels as needed, without fixed shot/panel counts.
- Positions, directions, eyelines, props and set states remain continuous; document motivated axis crossings.
- Color, light, shapes and camera preserve channel continuity and board intent. [Channel requirements](production-requirements.md) are distinct from general cinema principles.
- Test sound-before-image, reveals and holds in an animatic before claiming timing works. Stills cannot establish pacing.
- Check each selected output using [production requirements](production-requirements.md), preserving beat and character proportions rather than assuming automatic cropping works.

Example observable criterion: “`SH02-P02`, shot-local F54: the shadow first enters from the right after the knock at F36; F53 still shows an empty hallway; both formats show the full event.” These frames illustrate criterion writing, not approved timing for a specific story.

For render review, identify board revision, composition, shot ID, clock and evidence frame/timecode. Compare start/key action/reveal/end, playback of previous → changed → next scene in the assembled timeline and adjacent cut frames. Distinguish intentional cuts/time jumps from defects. Report expected → observed → owning rig/prop/camera/timeline and neighboring impact. Mark missing audio or format evidence unverified.

For technical problems, propose a repair with story/selected-deliverable impact. Revise boards only when a new revision is explicitly selected. Preserve IDs and a change log for the next comparison.

<a id="หลักการอ้างอิง"></a>
## Reference principles

Read [storyboard-principles.md](storyboard-principles.md) for research on story purpose, staging, continuity, anticipation, suspense and animatics, plus observations from the user's example file.
