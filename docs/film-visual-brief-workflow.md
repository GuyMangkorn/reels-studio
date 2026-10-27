# Film: visual brief and technical BA before Mark

Film receives the script and factual review, then chooses a rough visual approach before Mark storyboards it. Use `.codex/agents/film.toml`; configuration reference: [OpenAI custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents). Permissions and MCP access are inherited from the calling chat.

Workflow: Boat research → Preaw script → Boat review / Preaw revision → **Film visual/technical brief** → **Mark scene boards** → **James blockout/edit** → **Mark shot review + Film overall-look review** → **James delivery**. Boss supplies shared assets/capabilities and runtime proof alongside assembly. The coordinator invokes assigned scopes; these files do not install an automatic pipeline or send cross-chat messages.

For Blender assets/rendered shots, read [blender-mcp-workflow.md](blender-mcp-workflow.md). Choose pre-render, GLB/Three.js or hybrid with reasons and integration evidence; hand Mark/Boss the camera/scale/light contract. Remotion retains timeline/audio/subtitles/final export ownership.

<a id="ขอบเขตและอำนาจตัดสินใจ"></a>
## Scope and decision ownership — requirements

- **Film** owns whole-clip visual direction: medium per set/character/prop/effect, character/set look, art direction, lighting/shadows/color, camera language and 2D/Three.js composition. Record reasons, constraints and risks the developer can act on. Review James's continuous blockout and final edit for consistency, in addition to briefing before boards.
- **Mark** develops shots/panels, blocking, acting, cuts and both-format framing, with scene sheets and sequence index. Reference Film decision IDs rather than reopening medium choices for every shot.
- **Boss** owns shared interfaces/APIs, reusable implementation, renderer integration and affected-consumer QA; feed constraints back into brief/board revisions.
- **James** owns executable scene staging, timeline/camera/action authoring through supported APIs, editing/audio/subtitles, sequence QA and delivery under [the ownership contract](james-editing-workflow.md#decision-and-code-ownership--requirements).

Mark owns routine shot refinements preserving story and approach; James implements the agreed plan and tunes supported staging/timing within its constraints. Material changes to medium, spatial camera, light strategy, shared interfaces or reveal require recorded reasons and synchronized brief/board revisions. Routine work adds no user approval gate. Explicit user direction takes precedence over team recommendations.

<a id="ขั้นตอน"></a>
## Briefing steps

Before selecting/revising medium/compositing/camera/light strategy, consult relevant [Boss dev findings](dev-findings.md) and follow their revalidation cycle. Link finding IDs to visual decisions and outcomes; compare evidence branch/commit with the target checkout.

1. **Read story before technique:** read AGENTS.md, [editorial workflow](editorial-workflow.md), matching script/review revisions, and available index/neighbor scenes. Preserve beat/clue/claim IDs, story timing, narration and conceal/reveal intent. Label factual gaps when working from a draft. Establish [visual progression](#visual-progression-before-asset-selection) before asset mapping. Finish when every scene in scope has a clear audience knowledge/emotion/observation purpose.
2. **Inspect target checkout:** inspect `package.json`, `npm ls --depth=0`, `npx remotion versions`, types/validator/renderer and shared asset owners under [Remotion toolkit](remotion-toolkit.md). Check resource licenses. Classify `existing-integrated`, `exists-unintegrated`, `missing` or `unknown`, with paths and inspected branch/commit. Extraneous node_modules are not clean-install dependencies. Finish when important capabilities have evidence or explicit follow-up questions.
3. **Choose per-scene approach:** state visual purpose, mood/value/color key and medium per element. Sets, characters and props may use 2D, 3D or hybrid under [current production rules](boss-asset-workflow.md#latest-production-rules--requirements). Choose Three.js when spatial parallax, new-angle rotation, occlusion or spatial light/shadows serves the beat; compare simpler story-preserving approaches. Finish with a recommended approach and reason for every scene rather than an undecided menu for Mark.
4. **Perform technical BA at seams:** apply the table below. Separate desired look, integration proposal and tested evidence, including shared foundations needed before scenes. Finish when Boss knows module/interface scope, dependencies, risks and proof criteria while retaining implementation discretion.
5. **Hand rough brief to Mark:** use the format below and link the sequence index where present. Hand over matching script/review/brief revisions, constraints and decisions left to Mark. Episode work covers the episode; single-scene work covers that scene and needed boundaries. Finish when Mark can board without guessing the medium or primary integration strategy.

This role is planning. It does not install packages, implement runtime or draw detailed boards as a side effect. Specify the smallest feasibility spike/blockout and observable acceptance criteria for Boss. Run a spike yourself only when separately assigned, following implementation workflow.

## Visual progression before asset selection

Before asset selection, plan the visual treatment for the full requested sequence. Episode work covers the episode; single-scene work reuses the existing plan and nearby context. Include this table in the brief:

| Scene / beat refs | Visible action | Information / emotional change | Visual form and reason | Repetition / reason to return |
| --- | --- | --- | --- | --- |

Choose action, interaction, demonstration, comparison, diagram or reconstruction for the beat's purpose, then map the library and missing work. Checkout inventory informs feasibility; missing assets call for shared capabilities and a story-preserving fallback, with added work and tradeoffs. Simplifications must identify changed information/reveals and be reconciled with brief/board owners.

Factual visuals retain claim IDs and existing review results. Make reconstructions, hypothetical examples and explanatory diagrams recognizable as such to viewers. Return unsupported details to Preaw/Boat; generating a new image does not authorize new factual claims or making a reconstruction appear to be documentary evidence.

Before `ready-for-mark`, review the table continuously: every section needs a visual purpose. Identify repeated action/information delivery, such as consecutive narrator-and-card beats; revise or justify them in story terms. Changing camera angle, crop, light or text alone does not demonstrate visual progression. One-room scenes and cards are valid when serving the purpose; there are no location/technique/cut quotas. Record beats requiring blockout proof for Mark/Boss. Before polish, Film and Mark review the actual assembled sequence in both formats and record shot references, evidence, issues and corrections in the index. Planning readiness and runtime approval are distinct.

<a id="technical-ba-ต้องตอบอะไรเมื่อผสม-2d-กับ-threejs"></a>
## Technical BA for 2D and Three.js

Apply relevant rows; `N/A` with a reason is valid. Hybrid is not mandatory. Read evidence/cautions in [asset-engineering-principles.md](asset-engineering-principles.md).

Before choosing camera or projected size, follow [scale and perspective](scale-and-perspective-principles.md) for 2D, 3D and hybrid. Film establishes shared units, size references and projection contract for Mark/Boss. Finish with a scale baseline, sources/estimated status, and separate physical/projected measurement checks. Record affected decisions/revisions when the approach changes.

| Seam | Brief decision / handoff | Evidence to establish |
| --- | --- | --- |
| Composition | DOM/SVG over WebGL, world-space cut-outs, full 3D or separate pre-render passes; screen/world-space elements and transform owners | DOM overlays do not share the Three.js depth buffer. Alternating occlusion requires an explicit world-space adapter, masks or compositing passes. |
| Scale / projection | Library scale baseline: dimensions/units/anchors, neutral pose and stylization exceptions; perspective/orthographic/shared 2D mapping with camera height/pose/FOV or bounds | Compare actors, animals, furniture and props on one plane before depth staging; near/far, depth motion and contact use one projection owner under the scale guide. |
| Coordinates / camera | Named spaces, origin/axes/units, pixel↔world mapping, projection, camera target and both-format safe bounds | Camera start/mid/end preserve contact and avoid thin-edge cut-out views; document fixed-plane/billboard strategy and allowable view-angle range. |
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

Use `storyboards/<episode>/visual-brief.md` for the assigned episode/chapter, with scope metadata. A single scene uses `<scene>-visual-brief.md` to preserve the episode brief. Update existing `index.md` or create a compact scoped index without claiming a sequence blockout exists.

```markdown
# Visual brief — <episode/chapter/scene>
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
| Scene / beat refs | Decision ID | Set / actors / props / effects medium | Framing / camera intent Short + Long | Light / shadow / color | Why / fallback |
| ... | VD01 | ... | ... | ... | ... |

## Technical handoff
Scale baseline: shared reference path/revision, dimensions/units/anchors,
source or estimated status, stylization exceptions; calibration view
Projection contract: camera/ground plane, perspective or orthographic,
FOV/bounds + aspect/crop Short/Long; shared projection owner + feasibility
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

`ready-for-mark` means sufficient information to storyboard, not user-approved or runtime-tested. For `needs-feasibility`, identify which unknown affects which decision; Mark may rough-board independent portions. Use [cinematography principles](cinematography-principles.md) and [storyboard principles](storyboard-principles.md) as visual guidance, separate from observed experimental results.
