# Film: visual brief and technical BA before Mark

Film receives the script and factual review, then chooses a rough visual approach before Mark writes the scene handoff. Agent configs: `.claude/agents/film.md` and `.codex/agents/film.toml`; Codex configuration reference: [OpenAI custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents). Permissions and MCP access are inherited from the calling chat.

Workflow: Boat research → Preaw script → Boat review / Preaw revision → **Film visual/technical brief** → **Mark written scene sheets** → **Boss shared assets/capabilities** → **Editor integration and rendered proof**. The coordinator invokes agents for the assigned scope; these files do not install an automatic pipeline or send cross-chat messages.

For Blender assets/rendered shots, read [blender-mcp-workflow.md](blender-mcp-workflow.md). Choose pre-render, GLB/Three.js or hybrid with reasons and integration evidence; hand Mark/Boss/Editor the camera/scale/light contract. Remotion retains timeline/audio/subtitles/final export ownership.

<a id="ขอบเขตและอำนาจตัดสินใจ"></a>
## Scope and decision ownership — requirements

- **Film** chooses medium per set/character/prop/effect, art direction, lighting/shadows/color, camera language and 2D/Three.js composition. Record reasons, constraints and risks the developer can act on.
- **Mark** develops shots/key states, blocking, acting, cuts and selected-deliverable framing, with scene sheets and sequence index. Reference Film decision IDs rather than reopening medium choices for every shot.
- **Boss** owns shared interfaces/APIs, assets/renderer capabilities and affected-consumer proof. **Editor** owns scene/timeline integration, editing and runtime QA; both feed observed constraints back into brief/handoff revisions.

Routine crop/staging/timing refinements preserving story and approach belong to Mark. Material changes to medium, spatial camera, light strategy, shared interfaces or reveal require recorded reasons and synchronized brief/handoff revisions. Routine work adds no user approval gate. Explicit user direction takes precedence over team recommendations.

<a id="ขั้นตอน"></a>
## Briefing steps

Read the [delivery record](delivery-workflow.md): prepare a distinct brief for each selected editorial version, matching its script/review and timing. Shared visual decisions/assets may be referenced; a paired crop of one edit is not two briefs. Checks cover selected deliverables plus affected shared consumers under production requirements.

Before selecting/revising medium/compositing/camera/light strategy, consult relevant [Boss dev findings](dev-findings.md) and follow their revalidation cycle. Link finding IDs to visual decisions and outcomes; compare evidence branch/commit with the target checkout.

1. **Read story before technique:** read AGENTS.md, [editorial workflow](editorial-workflow.md), matching script/review revisions, and available index/neighbor scenes. Preserve beat/clue/claim IDs, story timing, narration and conceal/reveal intent. Label factual gaps when working from a draft. Establish [visual progression](#visual-progression-before-asset-selection) before asset mapping. Finish when every scene in scope has a clear audience knowledge/emotion/observation purpose.
2. **Inspect target checkout:** inspect `package.json`, `npm ls --depth=0`, `npx remotion versions`, types/validator/renderer and shared asset owners under [Remotion toolkit](remotion-toolkit.md). Check resource licenses. Classify `existing-integrated`, `exists-unintegrated`, `missing` or `unknown`, with paths and inspected branch/commit. Extraneous node_modules are not clean-install dependencies. Finish when important capabilities have evidence or explicit follow-up questions.
3. **Choose per-scene approach:** state visual purpose, mood/value/color key and medium per element. Sets, characters and props may use 2D, 3D or hybrid under [current production rules](boss-asset-workflow.md#latest-production-rules--requirements). Beyond the illustrated media, a scene may use user/stock footage, still images, typography/kinetic text or screen recordings when the [style profile](delivery-workflow.md#style-profile) calls for them; check what the runtime supports in [Remotion toolkit 10a](remotion-toolkit.md#10a-footage-stills-music-entry-transitions-and-caption-styles) and record missing capability as a Boss dependency. Choose Three.js when spatial parallax, new-angle rotation, occlusion or spatial light/shadows serves the beat; compare simpler story-preserving approaches. Finish with a recommended approach and reason for every scene rather than an undecided menu for Mark.
4. **Perform technical BA at seams:** apply the table below. Separate desired look, integration proposal and tested evidence, including shared foundations needed before scenes. Finish when Boss knows module/interface scope, dependencies, risks and proof criteria while retaining implementation discretion.
5. **Hand rough brief to Mark:** use the format below and link the sequence index where present. Hand over matching script/review/brief revisions, constraints and decisions left to Mark. Episode work covers the episode; single-scene work covers that scene and needed boundaries. Finish when Mark can write shot direction without guessing the medium or primary integration strategy.

This role is planning. It does not install packages, implement runtime or author detailed scene sheets as a side effect. Specify the smallest feasibility spike/blockout and observable acceptance criteria for Boss. Run a spike yourself only when separately assigned, following implementation workflow.

## Light tier brief

For a [Light-tier](delivery-workflow.md#pipeline-tiers) deliverable the brief is one page and replaces Mark's scene sheet: style profile, per-scene medium and look, a **timed shot list** (scene/beat ID, start–end seconds, visible content or source clip with in/out, caption, transition, audio/music note), music and caption plan, capability gaps, acceptance criteria. Numeric XYZ staging is needed only where world-space staging exists. The visual-progression table below still applies.

## Visual progression before asset selection

Before asset selection, plan the visual treatment for the full requested sequence. Episode work covers the episode; single-scene work reuses the existing plan and nearby context. Include this table in the brief:

| Scene / beat refs | Visible action | Information / emotional change | Visual form and reason | Repetition / reason to return |
| --- | --- | --- | --- | --- |

Choose action, interaction, demonstration, comparison, diagram or reconstruction for the beat's purpose, then map the library and missing work. Checkout inventory informs feasibility; missing assets call for shared capabilities and a story-preserving fallback, with added work and tradeoffs. Simplifications must identify changed information/reveals and be reconciled with brief/handoff owners.

Factual visuals retain claim IDs and existing review results. Make reconstructions, hypothetical examples and explanatory diagrams recognizable as such to viewers. Return unsupported details to Preaw/Boat; generating a new image does not authorize new factual claims or making a reconstruction appear to be documentary evidence.

Before `ready-for-mark`, review the table continuously: every section needs a visual purpose. Identify repeated action/information delivery, such as consecutive narrator-and-card beats; revise or justify them in story terms. Changing camera angle, crop, light or text alone does not demonstrate visual progression. One-room scenes and cards are valid when serving the purpose; there are no location/technique/cut quotas. Record beats requiring blockout proof for Mark/Boss/Editor. Before polish, Film and Mark review the actual assembled sequence for each selected deliverable and record shot references, evidence, issues and corrections in the index. Planning readiness and runtime approval are distinct.

<a id="technical-ba-ต้องตอบอะไรเมื่อผสม-2d-กับ-threejs"></a>
## Technical BA for 2D and Three.js

Apply relevant rows; `N/A` with a reason is valid. Hybrid is not mandatory. Read evidence/cautions in [asset-engineering-principles.md](asset-engineering-principles.md).

Before choosing camera or projected size, follow [scale and perspective](scale-and-perspective-principles.md) for 2D, 3D and hybrid. Film establishes shared units, size references and projection contract for Mark/Boss/Editor. Finish with a scale baseline, sources/estimated status, and separate physical/projected measurement checks. Record affected decisions/revisions when the approach changes.

| Seam | Brief decision / handoff | Evidence to establish |
| --- | --- | --- |
| Composition | DOM/SVG over WebGL, world-space cut-outs, full 3D or separate pre-render passes; screen/world-space elements and transform owners | DOM overlays do not share the Three.js depth buffer. Alternating occlusion requires an explicit world-space adapter, masks or compositing passes. |
| Scale / projection | Library scale baseline: dimensions/units/anchors, neutral pose and stylization exceptions; perspective/orthographic/shared 2D mapping with camera height/pose/FOV or bounds | Compare actors, animals, furniture and props on one plane before depth staging; near/far, depth motion and contact use one projection owner under the scale guide. |
| Coordinates / camera | Named spaces, origin/axes/units, pixel↔world mapping, projection, camera target and safe bounds for the selected output | Camera start/mid/end preserve contact and avoid thin-edge cut-out views; document fixed-plane/billboard strategy and allowable view-angle range. |
| Contact / identity | Asset IDs, logical bounds, foot/hip/grip/seat anchors, facing, held-prop parent and attach/detach events | Identify anchor spaces/conversions; pose/scale/camera and cross-cut representation changes retain identity/contact. |
| Depth / alpha | Foreground/midground/background, opaque/alpha-cutout/soft transparency, required reveal occlusion | Test crossing objects and extreme camera angles. `transparent`, `DoubleSide` and `renderOrder` are not universal fixes. |
| Lighting / color | Motivated key/fill/rim, lit/unlit materials, painted 2D light versus runtime light, caster/receiver or fake/contact shadows | Three.js lights do not automatically illuminate DOM/SVG; flat images lack mesh-like volume. Define texture color space, tone mapping/output and overall look checks rather than compensating for pipeline errors with emissive. |
| Motion / clock | Picture-stage effect or spatial move, with reason; shot-local action clock and composition audio clock | Frame/fps/seed yield the same frame on random seek/reload. Identify world versus picture movement to avoid duplicate transforms and detached shadows. |
| Loading / resources | Image/font/model readiness, texture resolution/cache keys, resource ownership/disposal and per-frame changes | Wait under Remotion lifecycle; check Studio and render separately. Dynamic rigs use transforms or update existing textures instead of allocating each frame. |
| Contract / delivery | Owner paths, proposed interfaces/fields, validator/renderer changes, dependencies and consumer scenes | Types + validation + shared implementation + dispatch must exist before JSON use. Distinguish pseudo-interfaces from actual APIs. |
| Feasibility / cost | Reusable work, render/texture/shadow costs, unknowns and beat-preserving fallback | Explain difficulty; benchmark numbers require measurement. A spike names composition, key frames and observable acceptance criteria. |

Design example, not an existing feature: a 2D actor walking behind a 3D door during spatial camera movement cannot be specified merely as “SVG overlay + Three.js.” Choose world-space cut-outs with shared anchors/depth, or synchronized masks/passes. If the adapter is absent, mark `missing` and propose a blockout: door-edge crossing + camera start/mid/end + backward seeking in Short/Long, with a full-2D fallback preserving the reveal.

<a id="ไฟล์ส่งมอบ"></a>
## Deliverables

Use `storyboards/<episode>/<short|long>/visual-brief.md` for each selected deliverable, with its ID and scope metadata; follow [delivery paths](delivery-workflow.md#files-and-stable-ids). Preserve legacy paths until an explicit migration. A single scene uses `<scene>-visual-brief.md` to preserve the episode brief. Update existing `index.md` or create a compact scoped index without claiming a sequence blockout exists.

```markdown
# Visual brief — <episode/chapter/scene>
Deliverable: <ID>; delivery record: <path>; target duration / timing status: ...
Revision: VB-R1; status: draft / ready-for-mark / needs-feasibility
Script: <path + revision>; fact-check: <path + revision/coverage>
Target checkout: <branch + commit>; scope / adjacent boundaries: ...

## Visual intent
Audience knowledge + mood; color/value key; camera language; conceal/reveal constraints

## Visual progression
Scene/beat refs; visible action; information/emotional change; visual form/reason;
repetition/return rationale; missing assets and story-preserving alternatives;
factual status and claim references for explanatory or reconstructed images

## Scene decisions
| Scene / beat refs | Decision ID | Set / actors / props / effects medium | Framing / camera intent for this deliverable | Light / shadow / color | Why / fallback |
| ... | VD01 | ... | ... | ... | ... |

## Technical handoff
Scale baseline: shared reference path/revision, dimensions/units/anchors,
source or estimated status, stylization exceptions; calibration view
Projection contract: named spaces/origin/axes/units, camera/ground plane, perspective or orthographic,
FOV/bounds + this deliverable's aspect/crop; shared projection owner + feasibility
Per decision: composition strategy, spaces/anchors/camera, depth/alpha/light,
clocks/loading/resource ownership, actual paths + implementation status,
proposed shared interface (design only), dependency order + consumers,
risk/difficulty, smallest spike + observable acceptance criteria
Dev findings: relevant finding IDs + last-checked date/commit, scope match,
effect on each decision and chosen response; none relevant if applicable

## Handoff to Mark
Constraints to preserve; choices left to Mark; missing evidence;
scene/boundary continuity; affected decisions on revision
```

`ready-for-mark` means sufficient information to scene handoff, not user-approved or runtime-tested. For `needs-feasibility`, identify which unknown affects which decision; Mark may rough-handoff independent portions. Use [cinematography principles](cinematography-principles.md) and [scene handoff principles](storyboard-principles.md) as visual guidance, separate from observed experimental results.
