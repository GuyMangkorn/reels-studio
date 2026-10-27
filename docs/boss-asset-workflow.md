# Boss: reusable assets and scene implementation

Boss is the team's programmer for shared 2D/3D assets, rigs, props, backgrounds, scene-renderer capabilities and visual bug fixes in their owning modules. Use `.codex/agents/boss.toml`. Preaw owns scripts, Boat owns facts, [Film owns the visual/technical brief](film-visual-brief-workflow.md), and Mark owns detailed boards. Boss makes that plan render and supplies runtime evidence.

For Blender creation, editing, import/export or rendered shots, read [blender-mcp-workflow.md](blender-mcp-workflow.md). Boss owns shared sources/scripts/manifests, export contracts and Remotion integration. Verify the actual connection before changing a scene; report source → export → runtime → visual status separately.

Example requests:

> Have Boss build a sofa from this scene pack, with seat/grip anchors, and check contact and lighting in Short and Long.

> Have Boss implement E01-C01-S02 from storyboard revision 3, inspect Studio, and produce one-second contact sheets before the PR.

<a id="กฎการผลิตล่าสุดของผู้ใช้"></a>
<a id="latest-production-rules"></a>
## Latest production rules — requirements

This table is the authoritative home for the user's rules, updated 26 October 2026 after the user revoked background-only 3D and mandatory 2D characters/interaction props. Film selects the approach for story value and feasibility. These rules apply to Film, Mark and Boss. They replace earlier medium/prop-plane/effect-stage restrictions; lifecycle, demo lighting, contact/scale and QA requirements remain. Numeric values are project rules, not universal Three.js/Remotion settings.

| Requirement | Implementation and evidence |
| --- | --- |
| **Choose 2D / 3D / hybrid for story and technique** | Any set, character, prop or effect may use these media. Film records reasons and integration strategy, Mark develops boards, and Boss proves implementation. Check dependencies/APIs and both aspect ratios before claiming support. |
| **Props are shared assets in the chosen representation** | Complete images, layered planes or geometry may serve the required views/interactions. Define bounds, pivots and seat/grip anchors; assess contact, occlusion and texture cost rather than imposing one-image/one-plane construction. |
| **Physical dimensions precede perspective** | Follow [scale and perspective](scale-and-perspective-principles.md): define canonical dimensions/units and library anchors; compare people, animals, furniture and held objects before framing. Use one projection owner; check calibration, near/far views, depth motion and contact in both formats. |
| **Effects and cameras have explicit transform ownership** | Choose picture-stage pan/zoom/shake/flash or a spatial camera for the beat. Identify moving elements and screen-space elements. Avoid duplicate transforms that separate contact/shadows; retain readable subtitles and UI. |
| **Create textures once per mounted scene lifecycle** | Reuse each texture within its mounted scene/worker under stable keys instead of recreating/rasterizing every frame. Inspect allocations/dependencies, first frame and Studio seeking. Each worker/remount has its own lifecycle. |
| **Use the demo lighting baseline** | Ambient `#c8bdf0` around `2.6`, lantern flicker and surrounding glow. Material `emissiveIntensity` must be ≤`0.3`; normalized glow strength/opacity must also be ≤`0.3`. Point-light intensity uses different units: do not apply this cap to every light property. |
| **Characters remain readable and grounded** | Dark characters need rim/edge light; every human and animal needs a ground shadow. Choose real/fake shadows or a shared 2D layer per brief and tie them to foot/ground anchors. Shadows do not replace fixing floating hips/feet/grips. |
| **Short lead height is ≥25% of the frame** | Measure visible character artwork after camera/crop/scale, excluding transparent padding, glow and shadow. At 1920px height, the lead must remain ≥480px whenever visible. Check the minimum across motion. Fix framing/camera/staging while preserving physical ratios to sets/props. If a wide/reveal conflicts, return the shot to Film/Mark under the scale guide. |
| **Every shot has intentional picture/camera motion** | Author frame-driven picture pan/push or spatial movement per brief. Check start/mid/end for actual motion rather than crop-clamped stillness. Strong shaking is not a substitute; subtitles remain readable. |
| **Before pushing visual work, produce one-second contact sheets and check jumps** | For every affected composition, sample F0, Ffps, F2fps… and the final frame, with time/shot IDs. Add the temporal QA below to detect single-frame discontinuities. |

Existing 2D boards remain valid; converting everything to 3D is unnecessary. When another technique better serves the shot, Boss reports constraints/results to Film and Mark and synchronizes brief/board revisions while preserving story, beat and reveal. Permission to use a medium does not establish runtime integration.

Pure 2D creates lighting/look through grading, fills, masks and controlled glow. Separate desired appearance from renderer properties; DOM/SVG does not contain an actual `ambientLight`. Hybrid scenes must define composition strategy, coordinate/camera mapping, depth/alpha and per-representation lighting/shadows under [Film's technical BA](film-visual-brief-workflow.md#technical-ba-for-2d-and-threejs). Floor/seat/grip anchors are logical asset interfaces independent of plane/geometry counts.

<a id="โครงรวมก่อน-polish-รายฉาก"></a>
## Sequence baseline before scene polish — requirements

Follow [sequence workflow](sequence-workflow.md). Read the episode index, scene sheets and adjacent scenes before splitting work.

| Area | Boss deliverable |
| --- | --- |
| Shared elements | One library module/capability per element, stable identity, appearance interface, logical bounds/pivots/anchors and coordinates agreed with Mark; record consumers/status in the index. |
| Sequence blockout | Executable timeline for the entire requested scope, shared placeholders with representative scale/contact, retained timing/reveal, and continuous playback in Short/Long before polish. |
| Scene integration | Replace placeholders and author staging/timing with the same library; update the combined timeline and shot mapping in the same PR. |
| Boundary evidence | Implemented entry/exit states, composition audio offsets and adjacent-cut checks, identifying unverified parts. |

Inspect `Root`, types, validator and renderer before choosing timeline assembly. If the checkout loads a single array, use it. Split sources require one deterministic, tested assembly path. Designed `entry`/`exit`, presets or include/import fields are not automatically usable JSON.

Cross-scene states must be derived directly from authored data and the sought frame: use consistent actor IDs with explicit positions/appearances. Prefer supported fields; extend state resolution through shared types/validation/renderer and regression tests when needed. Playback-dependent mutable inheritance cannot reproduce direct seeks.

Before polish, record blockout revision, timeline/input props, scene/shot mapping, placeholders, both-format continuous review and unresolved issues in index/QA notes. Missing neighbors require a labeled boundary placeholder or an explicitly unverified gap. Single-scene work covers needed boundaries only; asset-only/scoped bug fixes cover affected consumers without a new episode blockout.

Merge foundation/capability PRs before starting dependent scene branches from refreshed `main`. Track dependency issues instead of copying foundations into every branch. Shared-interface changes update affected consumers and regression checks. Intermediate scenes use authored cuts/transitions; fade/loop endings belong at publishable output boundaries.

<a id="สร้าง-library-ให้รองรับหน้าที่ภาพ"></a>
## Build the library to serve the visual purpose

When mapping boards to the library, record missing requirements against shot/decision IDs. Propose shared assets/capabilities, dependencies and qualitative costs/risks; label unmeasured costs `estimated`. Include a fallback and its effect on action, information and reveal. Reconcile material changes with Film/Mark and update brief/board before changing the plan. An available asset alone does not justify replacing the required demonstration/event with a narrator pointing at cards.

Blockout placeholders must demonstrate action and information delivery from [visual progression](film-visual-brief-workflow.md#visual-progression-before-asset-selection) well enough for Film/Mark to judge. Before polish, submit both-format sequences and record shot/frame references, review results and unresolved items in the index. If a placeholder cannot demonstrate the purpose, mark it unverified and state the required follow-up. Code/contact/continuity QA and correct total duration do not establish a storytelling pass.

<a id="ขั้นตอนทำงาน"></a>
## Implementation steps

Read and update [dev findings](dev-findings.md) when blockers, workarounds or reusable lessons affect technique/shot decisions. Record them during dev/blockout/QA, revisit status before the PR, and link finding IDs to affected Film/Mark decisions.

1. **Establish scope:** identify issue, branch, asset/scene/shot IDs and script/brief/board revisions. Read index, brief decisions, scene sheet and adjacent entry/exit states. Classify foundation/blockout versus integration/polish and dependencies. Resolve conflicts before writing; preserve story/facts/timing or record the agreed revision.
2. **Inspect checkout:** read AGENTS.md and [remotion-toolkit.md](remotion-toolkit.md); run `npm ls --depth=0` and `npx remotion versions`. Inspect APIs/registries/types/validator/renderer/render helpers; use [character-toolkit.md](character-toolkit.md) for rigs/poses. Finish when every dependency is classified `existing-integrated`, `exists-unintegrated`, `missing` or `unknown`.
3. **Define ownership/interfaces:** one library owner per asset, with ID, bounds, pivot, seat/grip/floor anchors, appearance parameters and resource ownership. Scenes select IDs and stage/time them. One explicit owner converts logical asset coordinates to stage space.
4. **Build continuous blockout before polish:** assemble every scene in scope using Film/Mark's representation. Place hips/feet/hands on anchors; review framing, scale, motion, occlusion, timing/reveal and boundaries in both formats, especially hybrid seams. Record evidence before detail. Install/integrate capabilities required by scope only.
5. **Implement deterministically:** frame/fps clock, seeded flicker/noise, static-art texture keys independent of frame, loading/error/disposal and readiness consistent in Studio/render. Read [asset-engineering-principles.md](asset-engineering-principles.md) for `ThreeCanvas`, `useLoader`, color space and alpha/depth constraints.
6. **Integrate the full pipeline:** update types + validator + shared component + renderer dispatch together. Tests should exercise input, timing, contact or actual regressions rather than restating implementation constants. Keep SVG/geometry in shared assets.
7. **Review picture/time:** complete QA below, fix root causes in shared owners and check affected consumers. Scale/color/lighting changes must preserve their scenes.
8. **Deliver:** follow [contributing.md](contributing.md) for issue branch/commit/push/PR. Report reusable assets, shot mapping, actual checks, limitations, finding IDs and Film/Mark follow-up. Distinguish asset-ready from scene-integrated and code-pass from visual-pass.

<a id="texture-lighting-และ-contact-ที่ต้องตรวจเป็นพิเศษ"></a>
## Texture, lighting and contact checks

- Static texture keys use asset ID, source revision, appearance and necessary resolution. Frame/pose values changing every frame must not create allocate/dispose loops. When pixels truly change, update the existing texture; normal pose animation uses transforms/joints.
- The owner creates stable canvas/texture resources and cleans up at actual end of use. A consumer must not dispose a shared cache resource while another uses it. `useMemo` does not guarantee one creation across remounts/workers.
- Wait for async image/font/data and captured canvas commits; handle errors/cancellation/cleanup and render only when ready. Check Studio separately: render gating does not prove preview readiness.
- Inspect sRGB/linear, output conversion and tone mapping before increasing ambient/emissive. Do not compensate for color-pipeline errors with layered light; inspect rim/glow/dark backgrounds in actual output.
- Lantern flicker is a frame/seed function rather than timers or new random values per render. One lantern source coordinates glow, light and shadow positions. Audit existing demo values against current rules before reuse.
- Foot/hip/grip/shadow share stage-space anchors across pose changes, attach/release and picture pan/zoom. Cat/dog facing and walk cycles follow travel direction, with explicit facing overrides supported.
- Inspect black gaps, halos, intersecting planes and foreground ordering during motion. `DoubleSide`, `renderOrder`, `depthWrite=false` or disabling all depth are not universal fixes.

<a id="qa-ก่อน-push-งานภาพหรือ-runtime"></a>
<a id="visual-and-runtime-qa-before-push"></a>
## QA before pushing visual or runtime work — requirements

1. Run repository typecheck, lint and relevant tests. For instruction-only changes, use diff/TOML/link checks under [the documentation exception](contributing.md); adding agent rules does not establish scene verification.
2. Open Studio with `npm run start` or the checkout's command. Check cold load, play/pause, backward scrub and unordered seeks. Compare the same frame after seek/reload with render for stale textures, empty first frames and pops. Record composition, scene/shot, frames and procedure.
3. Render each affected Short/Long composition, including shot start/mid/end and full motion/reveal ranges. Frames 0–5 are only a smoke test; cover later bugs explicitly. Match inputProps/timeline to the reviewed revision.
4. Generate contact sheets for delivery renders at every second and the final frame in each affected composition. Label composition/shot/time/frame; split sheets to cover the full range. Store under `out/qa/<episode>/<scene>/<composition>/` with frame manifest/QA notes.
5. Add F−1/F/F+1 at cuts, transitions, pose switches, attach/detach, sit/stand, texture readiness/change, reveals, flashes and loop seams. Separate intentional cuts from pops. Compare adjacent positions, sizes, colors, shadows, occlusion and contact.
6. Review the full affected sequence continuously from the assembled timeline, including previous → changed → next scenes where available. Check authored entry/exit, IDs/appearance, positions/facing/pose/contact, prop states, lighting and composition audio offsets. Mark absent neighbors unverified with follow-up; distinguish intentional cuts/time jumps from defects. Shared assets/interfaces require affected-consumer checks. Inspect adjacent frames at discontinuities/risky ranges. A claim of no jump in any frame requires full sequential coverage, such as every adjacent pair plus outlier/intentional-cut review; 1Hz sampling alone is insufficient. A large image difference is not automatically a bug, especially at hard cuts/flashes.
7. Measure the minimum visible Short lead height against the table above after transforms/crop. Confirm actual motion every shot without clipping or exposed stage edges; inspect rim/ground shadows and prop contact. Scale/projection changes add calibration and near/far/depth-motion checks from the scale guide, with physical/projected measurements or explicit unverified status. Screen readability is not grounds for inflating one actor relative to its surroundings.
8. Check Thai subtitles, overlay safe regions, audio/reveal timing and affected endings. Report exactly the evidence observed. If Studio/render/tooling is unavailable, identify limitations/unverified checks rather than claiming visual-pass or jump-free output.

QA notes include commit/revision, executable timeline, composition/inputProps, shot/frame ranges, blockout/placeholders, neighbor IDs and boundary results, contact-sheet paths, Studio/seek results, cut/event coverage, minimum lead height, lighting/material checks and corrected defects. Generated images/audio/video belong in `out/` and are not committed.

<a id="ขอบเขตที่ตรวจในรอบตั้ง-agent"></a>
## Historical inspection — not current runtime verification

At agent setup, `main` used matching Remotion `4.0.538` packages but had no Three.js/R3F package/source integration; 3D work and some demos existed in other working checkouts. Inspect the target branch each time.

Source inspected on 26 October 2026 in a working checkout showed `SharedLighting` in `src/three/ThreeStage.tsx` using the specified ambient, and `emissiveIntensity={0.8}` in `src/three/SvgTexturePlane.tsx`, above the new cap. This is historical code evidence, not a rendered-look claim, and setup did not fix runtime. Boss must audit actual values and lifecycle before reuse.
