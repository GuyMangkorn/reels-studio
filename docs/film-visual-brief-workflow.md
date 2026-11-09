# Film: visual brief and technical BA

Film receives the script and factual review, then chooses a rough visual approach and, in a later separate pass, writes the scene sheets ([storyboard workflow](mark-storyboard-workflow.md); Mark's role merged into Film, 2 Nov 2026). Agent configs: `.claude/agents/film.md` and `.codex/agents/film.toml`; Codex configuration reference: [OpenAI custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents). Permissions and MCP access are inherited from the calling chat.

Workflow: Boat research → Preaw script → Boat review / Preaw revision → **Film visual/technical brief** → **Film written scene sheets (separate pass)** → **Boss shared assets/capabilities** → **Editor integration and rendered proof**. The coordinator invokes agents for the assigned scope; these files do not install an automatic pipeline or send cross-chat messages.

For Blender assets/rendered shots, read [blender-mcp-workflow.md](blender-mcp-workflow.md). Choose pre-render, GLB/Three.js or hybrid with reasons and integration evidence; hand Boss/Editor the camera/scale/light contract and use it in the scene sheets. Remotion retains timeline/audio/subtitles/final export ownership.

<a id="ขอบเขตและอำนาจตัดสินใจ"></a>
## Scope and decision ownership — requirements

- **Film** chooses medium per set/character/prop/effect, art direction, lighting/shadows/color, camera language and 2D/Three.js composition. Record reasons, constraints and risks the developer can act on.
- **Film** develops shots/key states, blocking, acting, cuts and selected-deliverable framing, with scene sheets and sequence index. Reference Film decision IDs rather than reopening medium choices for every shot.
- **Boss** owns shared interfaces/APIs, assets/renderer capabilities and affected-consumer proof; Film writes look-defining assets under [Film and Boss by kind of work](#look-assets). **Editor** owns scene/timeline integration, editing and runtime QA; both feed observed constraints back into brief/handoff revisions.

Routine crop/staging/timing refinements preserving story and approach belong to Film. Material changes to medium, spatial camera, light strategy, shared interfaces or reveal require recorded reasons and synchronized brief/handoff revisions. Routine work adds no user approval gate. Explicit user direction takes precedence over team recommendations.

<a id="ขั้นตอน"></a>
## Briefing steps

Read the [delivery record](delivery-workflow.md): prepare a distinct brief for each selected editorial version, matching its script/review and timing. Shared visual decisions/assets may be referenced; a paired crop of one edit is not two briefs. Checks cover selected deliverables plus affected shared consumers under production requirements.

Before selecting/revising medium/compositing/camera/light strategy, consult relevant [Boss dev findings](dev-findings.md) and follow their revalidation cycle. Link finding IDs to visual decisions and outcomes; compare evidence branch/commit with the target checkout.

1. **Read story before technique:** read AGENTS.md, [editorial workflow](editorial-workflow.md), matching script/review revisions, and available index/neighbor scenes. Preserve beat/clue/claim IDs, story timing, narration and conceal/reveal intent. Label factual gaps when working from a draft. Establish [visual progression](#visual-progression-before-asset-selection) before asset mapping. Finish when every scene in scope has a clear audience knowledge/emotion/observation purpose.
2. **Inspect target checkout:** inspect `package.json`, `npm ls --depth=0`, `npx remotion versions`, types/validator/renderer and shared asset owners under [Remotion toolkit](remotion-toolkit.md). Check resource licenses. Classify `existing-integrated`, `exists-unintegrated`, `missing` or `unknown`, with paths and inspected branch/commit. Extraneous node_modules are not clean-install dependencies. Finish when important capabilities have evidence or explicit follow-up questions.
3. **Choose per-scene approach:** state visual purpose, mood/value/color key and medium per element. Sets, characters and props may use 2D, 3D or hybrid under [current production rules](boss-asset-workflow.md#latest-production-rules--requirements). Beyond the illustrated media, a scene may use user/stock footage, still images, typography/kinetic text or screen recordings when the [style profile](delivery-workflow.md#style-profile) calls for them; check what the runtime supports in [Remotion toolkit 10a](remotion-toolkit.md#10a-footage-stills-music-entry-transitions-and-caption-styles) and record missing capability as a Boss dependency. Choose Three.js when spatial parallax, new-angle rotation, occlusion or spatial light/shadows serves the beat; compare simpler story-preserving approaches. Finish with a recommended approach and reason for every scene rather than an undecided menu for the scene-sheet pass.
4. **Perform technical BA at seams:** apply the table below. Separate desired look, integration proposal and tested evidence, including shared foundations needed before scenes. Finish when Boss knows module/interface scope, dependencies, risks and proof criteria while retaining implementation discretion.
5. **Close the brief for the scene-sheet pass:** use the format below and link the sequence index where present. Record matching script/review/brief revisions, constraints and decisions left to the scene-sheet pass. Episode work covers the episode; single-scene work covers that scene and needed boundaries. Finish when Film can write shot direction without guessing the medium or primary integration strategy.

<a id="look-check"></a>
**Default — story first, then the template library** ([story first, kit second](../AGENTS.md#story-first); user, 3 Nov 2026). Film designs each character, set and light from the script, the situation and the mood of the story, and only then looks through the kit. A template that matches is used as it is and recorded as a [casting line](character-proportion-principles.md#cp-casting-line); a design nothing matches is built new, with no justification beyond the story, and counts as a new look below.

<a id="kit-layers"></a>
**Default — kit layers after the set design.** For painted sets Film designs the set from the story first, then checks the kit's atmosphere layers and the plate gallery (`findPlates` in [src/painted/kit/plates.ts](../src/painted/kit/plates.ts)) and uses a layer that matches the design. Kit layers used are named in the scene sheet next to the casting line ([ENV-P02](../src/painted/kit/README.md#env-rules)). Gallery plates are reference, never a default set.

**Requirement — look check for new looks.** When a look-defining element has no approved precedent (a new character, a new medium or style, a new key set mood), the user picks its look before Boss builds it. Film shows up to three options as reference images or links, or the coordinator assigns one low-resolution still of one shot in the proposed look to Film or Boss. Record the pick and the user's words in the brief. An approved precedent (an accepted character template, an earlier episode's accepted set) skips the check. Budget: one reference set or one still per element, never a pass over every scene. Outside the look check and the look lock, the brief cites existing frames (an accepted precedent, a reference plate) and paints no key art, unless the user asks or the brief changes medium, light or projection and only a picture can settle it.

<a id="look-lock"></a>
**Requirement — look lock before the full build.** Before Boss builds more than a few shots of a deliverable, Film locks a finished-grade **look frame** for each look family the deliverable uses (for example exterior, interior, character close-up). Each look frame:
- is one real shot from the scene sheets;
- is rendered through the production library, not a spike, at final light, texture, line and face detail;
- passes the caption-zone and lead-size checks;
- is approved by the user (record their words in the brief as a `VD` decision).

Boss then builds every shot of that family to its look frame and compares each plate with it before reporting. Fix passes batch every known defect into one round instead of one defect per round. A look family with an approved precedent (an earlier episode's accepted look) reuses that frame instead. Evidence: on WORLD FOG EP01 (30 Oct 2026) 22 plates built before the interior/character look was locked needed two fix passes, a late look-dev pass (VD18) and a re-apply pass. Boss runs were about half of that session's usage.

<a id="look-assets"></a>
**Requirement — Film and Boss split by kind of work, not by person.** BLOOP-EP01-SHORT had Film write spike code in `src/painted/spike/BloopLook.tsx` and Boss re-port it into `src/painted/bloop/`; the duplicate drifted (lip-line frame, a 186 px hydrophone pop, a shadow value) and cost extra rounds, while Film's output was often usable as-is (30 Oct 2026).
- **Film writes look-defining assets** (a new creature, a new look or ending) directly in the production owner module, `src/painted/<episode>/` or the shared library, with stills for [user approval](#look-change). No throwaway spike unless the work is genuinely exploratory. Film does not change the shared renderer or runtime contracts.
- **Boss** owns runtime/renderer integration and shared capabilities, re-keying plates to Film's timed sheets, measured QA ([caption zone](boss-asset-workflow.md#visual-and-runtime-qa-before-push), repeatability, RGB 0, anchors) and hardening Film's code.
- **Cross-check stays:** Boss checks Film's work with measured numbers; Film checks the look on rendered frames. The roles are not merged: Boss's high-volume work stays on the cheaper model.

<a id="look-change"></a>
**Requirement — key-pose stills for look changes.** Any user-visible look change after the brief (a new ending, a creature or character redesign, a changed key set or medium) is approved before Boss builds or rebuilds plates for it. Film paints spike stills of the changed element in its key poses, normally 3–6 low-resolution stills (the poses the scene sheets actually use), with the caption band shown. The user picks or approves them; record their words as a `VD` decision and link the stills in the brief. Boss then builds to those stills. A change that only fixes a defect against an already approved look needs no stills. BLOOP-EP01-SHORT rebuilt plates after look changes made once Boss had built them (30 Oct 2026).

This role is planning. It does not install packages, implement runtime or author detailed scene sheets as a side effect. Specify the smallest feasibility spike/blockout and observable acceptance criteria for Boss. Run an exploratory spike yourself only when separately assigned, following implementation workflow.

<a id="light-tier-brief"></a>
## Light tier brief (legacy)

The Light tier was retired on 2 Nov 2026; this applies only to [legacy Light deliverables](delivery-workflow.md#pipeline-tiers) that keep their recorded stages. For those the brief is one page and replaces Film's scene sheet: style profile, per-scene medium and look, a **timed shot list** (scene/beat ID, start–end seconds, visible content or source clip with in/out, caption, transition, audio/music note), music and caption plan, capability gaps, acceptance criteria. With the brief Film writes `review-rows.json` from the shot list for the [first storyboard page](mark-storyboard-workflow.md#user-storyboard-review-page). Numeric XYZ staging is needed only where world-space staging exists. The visual-progression table below still applies.

## Visual progression before asset selection

Before asset selection, plan the visual treatment for the full requested sequence. Episode work covers the episode; single-scene work reuses the existing plan and nearby context. Include this table in the brief:

| Scene / beat refs | Visible action | Information / emotional change | Visual form and reason | Repetition / reason to return |
| --- | --- | --- | --- | --- |

Choose action, interaction, demonstration, comparison, diagram or reconstruction for the beat's purpose, then map the library and missing work. Checkout inventory informs feasibility; missing assets call for shared capabilities and a story-preserving fallback, with added work and tradeoffs. Simplifications must identify changed information/reveals and be reconciled with brief/handoff owners.

Factual visuals retain claim IDs and existing review results. Make reconstructions, hypothetical examples and explanatory diagrams recognizable as such to viewers. Return unsupported details to Preaw/Boat; generating a new image does not authorize new factual claims or making a reconstruction appear to be documentary evidence.

Before `ready-for-mark`, review the table continuously: every section needs a visual purpose. Identify repeated action/information delivery, such as consecutive narrator-and-card beats; revise or justify them in story terms. Changing camera angle, crop, light or text alone does not demonstrate visual progression. One-room scenes and cards are valid when serving the purpose; there are no location/technique/cut quotas. Record beats requiring blockout proof for Film/Boss/Editor. Before polish, Film reviews the actual assembled sequence for each selected deliverable and record shot references, evidence, issues and corrections in the index. Planning readiness and runtime approval are distinct.

<a id="technical-ba-ต้องตอบอะไรเมื่อผสม-2d-กับ-threejs"></a>
<a id="painted-3d-camera"></a>
## Painted 3D camera — requirements (user, 5 Nov 2026)

The [project default](delivery-workflow.md#project-defaults) look for every project: painted p5.brush sets built in world metres, seen through the kit yaw camera, with the depth carried by the set and the camera move rather than by character angles.

- **Set layout in metres (Requirement).** The brief gives each set a plan: origin, +x right, +y up, the main walls, kerbs, props and lights with sizes and positions in metres, and where each character stands and faces.
- **A camera line per shot (Requirement).** Every scene sheet row names the camera as yaw to the set, move and lens, e.g. `cam: yaw 45, arc 35→55, r 3.0→2.0 m, eye 1.4, f 900`, or `cam: dolly z 6.0→4.0, truck x 0→-0.5, eye 1.5`. A shot without a camera move records why.
- **Characters square to the lens (Default).** Name the body view (`front`, `back`, `left`, `right`) per character per shot; it is held with `squareToCam` from the mid-shot camera, so an arc up to about ±40° keeps it. The front three-quarter (15–45°) only for a close-up that needs it; head acting by `headCock` or a head turned aside. A view change inside a shot is a cut-on-turn, written in the sheet.
- **Test before look frames (Default).** Camera ideas can be tried in the kit test set TESTSET-CROSSROADS (`kit/test-sets.ts`, spikes `SET45-*`); it is never painted in a delivered shot.

## Technical BA for 2D and Three.js

> **Legacy (2 Nov 2026):** the Three.js rows apply only if the user reactivates a 3D engine ([visual engine](delivery-workflow.md#visual-engine)). For painted 2D (the default), answer the scale, camera, lighting and determinism rows for the painted set, with the camera row as the [painted 3D camera](#painted-3d-camera) line and record the Three.js rows `N/A (painted 2D)`.

Apply relevant rows; `N/A` with a reason is valid. Hybrid is not mandatory. Read evidence/cautions in [asset-engineering-principles.md](asset-engineering-principles.md).

Before choosing camera or projected size, follow [scale and perspective](scale-and-perspective-principles.md) for 2D, 3D and hybrid. Film establishes shared units, size references and projection contract for the scene sheets, Boss and Editor. Finish with a scale baseline, sources/estimated status, and separate physical/projected measurement checks. Record affected decisions/revisions when the approach changes.

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

**Look frame — Default for painted deliverables (user, 1 Nov 2026; order changed 2 Nov 2026):** the brief itself is text: it names each location and its look notes, with no stills. After Film's first storyboard pass is on the [storyboard review page](mark-storyboard-workflow.md#user-storyboard-review-page), Film adds one look frame per location: a finished-grade painted still of that location's first storyboard shot (the set with its characters), painted by Boss from the brief and that shot's row. Film writes it into `review-rows.json` (`looks` with `src` and a Thai `caption`, and `look` on every beat at that location) and reports `review page: pending`; the coordinator republishes, so the user sees each look frame in the header of the beats it covers, never as a loose image. The user's approval is the look lock ([W3](sequence-workflow.md#painted-shot-by-shot)): shared painted code is frozen for the episode. A location that reuses an approved look with no new set or character records `look frame: reused (<episode>)` instead.

```markdown
# Visual brief — <episode/chapter/scene>
Deliverable: <ID>; delivery record: <path>; target duration / timing status: ...
Revision: VB-R1; status: draft / ready-for-mark / needs-feasibility
Script: <path + revision>; fact-check: <path + revision/coverage>
Target checkout: <branch + commit>; scope / adjacent boundaries: ...

## Visual intent
Audience knowledge + mood; color/value key; camera language; conceal/reveal constraints

## Sound direction
Music family/tempo/energy arc and ending plan; ambience per location; SFX language (transitions, UI, foley); silence policy; each cue designed from the story, with a library ID only where the file fits ([fit beats reuse](sound-generation-workflow.md#fit-beats-reuse), [checklist](sound-generation-workflow.md#role-responsibilities))

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

## Handoff to the scene-sheet pass
Constraints to preserve; choices left to the scene sheets; missing evidence;
scene/boundary continuity; affected decisions on revision
```

<a id="brief-history"></a>
**Brief history (Default).** The brief holds current decisions plus the latest change-log entry. When a new revision lands, move the earlier change-log entries and earlier "affected decisions" lists unchanged to `visual-brief-history.md` beside the brief, and leave a one-line link in their place. Decision tables that scene sheets cite as their source (for example per-revision Film handoff verdicts) stay in the brief until no current sheet links them. When a decision table moves, a stub anchor is left in the brief.

`ready-for-mark` means sufficient information to scene handoff, not user-approved or runtime-tested. For `needs-feasibility`, identify which unknown affects which decision; Film may rough-handoff independent portions. Use [cinematography principles](cinematography-principles.md) and [scene handoff principles](storyboard-principles.md) as visual guidance, separate from observed experimental results.
