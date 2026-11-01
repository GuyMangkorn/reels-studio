# Blender MCP: assets and rendered shots for Remotion

> **Status: deactivated (user decision, 30 Oct 2026).** Blender used too many resources. The project's visual stack is painted 2D (p5.brush) + Remotion SVG (and Rive if its [feasibility spike](dev-findings.md) passes). Film does not select Blender or plan Blender shots and Boss does not build Blender assets unless the user reactivates it. This document and `assets/blender/` stay as they are. The Blender MCP tools are removed from the Film and Boss tool lists; reactivating means restoring them in `.claude/agents/film.md` and `boss.md`, connecting the Blender MCP server in the user's own settings (it is not in the project's `.mcp.json`), and rechecking this workflow.

Read this when Film selects Blender or plans Blender-produced shots, or Boss creates, edits or exports Blender work. The user authorized Blender in the workflow on 26 October 2026; the installation in progress at that time still required a live connection check. This document defines a workflow; it adds no renderer, loader or scene JSON fields. Verify session capabilities before claiming availability.

<a id="หน้าที่และทางเลือกส่งมอบ"></a>
## Ownership and delivery routes

Sequence: Boat researches → Preaw writes → Boat reviews → Film prepares the brief and writes scene handoffs → Boss produces shared Blender/code assets and capabilities → Editor integrates/edits in Remotion → QA.

- **Film** selects medium and delivery route per shot. Record decision ID/revision, story value, camera/scale/light contract, dependencies, fallback and missing evidence. Use Blender when geometry, new angles, parallax, lighting/shadows or occlusion serve the image. Keep 2D/3D/hybrid available for every element.
- **Film** details shots from the brief: cameras for selected output aspects, action/reveal frames, contact, foreground and boundaries. Record the Blender source/export revision reviewed in the written scene handoff. A viewport reference is not runtime proof.
- **Boss** owns Blender sources, scripts, reusable assets, export settings and shared loader/scene-pipeline capability integration. Editor assembles the scene timeline with those supported capabilities. Fix geometry/rig/anchors in the shared source, re-export, and check both Blender and the output actually used by Remotion.
- **Remotion** owns the executable timeline, narration/amplitude, Thai subtitles, channel label, screen overlays, endings and final export. Read [Remotion toolkit](remotion-toolkit.md) before adding capabilities.

| Route | Choose when | Required proof before timeline use |
| --- | --- | --- |
| Blender pre-render: stills/image sequence/video | Blender lighting, materials, effects or camera animation must be retained | Shared-renderer media support, frame mapping, alpha/color, loading and seeking; framing for each selected deliverable and explicitly requested framing adaptation; use separate views when a crop cannot preserve action |
| GLB/glTF export to Three.js | Reuse models and adjust staging/camera/animation in code | Declared dependencies, loader/stage, materials, animation sampling, anchors, shadows and type/validator/renderer integration in the target checkout |
| Hybrid / separate passes | Multiple representations must be composited | Matching cameras/projection, masks/depth/alpha, light/color and one transform owner per layer |

Start with a shared set/prop and one camera shot demonstrating contact/reveal in selected output aspects before adding rig or episode complexity. Pre-render is the recommended starting route when Blender's look matters and GLB runtime integration is unavailable. Its media integration still needs implementation and verification; fallback does not imply existing support.

<a id="1-preflight-ก่อนแก้ฉาก"></a>
## 1. Preflight before scene changes

1. Read the brief, scene sheet/index, [Boss workflow](boss-asset-workflow.md), [scale/perspective guide](scale-and-perspective-principles.md) and relevant [dev findings](dev-findings.md). Inspect checkout, manifest, dependency tree, Remotion versions and runtime contracts under the toolkit. Classify capabilities as `existing-integrated`, `exists-unintegrated`, `missing` or `unknown`.
2. Discover tools actually exposed to the session and read their schemas before calling them. Use read-only queries/viewport inspection to check Blender/addon/server versions where available, active file, scene, objects, cameras and render settings. State inaccessible information. Do not assume tool names from another version's README.
3. If MCP is disconnected, report the failing stage and continue brief/manifest/code work that does not depend on Blender. Keep Blender-dependent work unverified until connected and inspected. Installation/client configuration is separate scope unless already requested.
4. Confirm the open scene is the target work and preserve a copy before edits. Use stable collection/object/action/material names under the asset ID and modify only owned work. Keep repeatable repository scripts that update the same asset rather than adding duplicates on each run.

Preflight is complete when the handoff records connection/version evidence, source revision, selected route and integration gaps. Restrict Python tool calls to the assigned Blender work. Use a local connection by default. External imports require license and provenance like all channel assets.

<a id="2-shared-source-และ-export-contract"></a>
## 2. Shared source and export contract

Use these conventions for new Blender work; create directories only when an actual asset exists:

- `assets/blender/<asset-id>/source.blend`: editable shared asset/set/rig; episodes select it instead of copying geometry.
- `assets/blender/<asset-id>/build.py`: repeatable construction/update script and required settings; declare external dependencies.
- `assets/blender/<asset-id>/manifest.md`: contract, provenance/license, revision, exports and consumers.
- `public/assets/blender/<asset-id>/`: selected runtime exports such as GLB/textures/stills, with paths resolved by a shared module. Video/pre-render sequences need retrieval/regeneration and packaging usable by render workers under repository Git/media policy.
- `out/blender/` and `out/qa/`: previews, intermediate passes and review evidence. Keep generated review media out of commits.

Store editable source, build scripts, manifest and license under the [issue workflow](contributing.md). Check `.blend`/texture/export sizes before commit. If Git LFS or external storage is used, verify configuration and fetching on machines/workers, and record location/checksum and regeneration instructions. Package dependencies or use relative paths and verify reopening from a fresh checkout. Avoid machine-only absolute references. Adding LFS/storage requires its own authorized scope.

The manifest must contain at least:

| Group | Handoff data |
| --- | --- |
| Identity / revisions | Asset ID, source/build revision, Blender/exporter versions, brief decision/scene-sheet shot IDs, consumers, source/export paths and integration status |
| Physical contract | Units, axes/up/forward, canonical dimensions/bounds excluding padding, origin/pivots, named floor/foot/hip/seat/grip anchors with spaces/coordinates and required export transforms |
| Camera / framing | Projection, lens/FOV or ortho bounds, aspect, clipping, camera/target/path, selected-deliverable framing, requested alternate framing and camera owner so Blender and Remotion do not duplicate motion |
| Motion / clock | Actions/clips, duration, fps, source frame range with inclusive/exclusive bounds, shot-local frame mapping, holds/loop seam, composition audio offsets and cache/bake locations |
| Appearance | Renderer/settings, materials/textures, color management/view transform/output color space, alpha convention, light/shadow ownership, passes/masks and export settings |
| Delivery / evidence | Resolutions, output formats/paths, license/provenance, regeneration command/steps, load readiness/resource owner, QA frames and limitations |

Blender and Three.js camera, light and material numbers are not interchangeable. Compare output against the brief and Boss's demo-lighting rules, distinguish units and document mapping/limitations. Assign ownership for baked and runtime light/shadow to prevent applying either twice.

<a id="3-ผลิตแบบ-deterministic-แล้วเชื่อม-runtime"></a>
## 3. Deterministic production and runtime integration

1. Block out dimensions/anchors before polish. Compare actor–set–prop relationships on a common plane and camera start/mid/end in selected/affected aspects. Preserve identity and meet the Short lead-size rule through framing.
2. Use the shared timeline's 30 fps. Record frame mapping explicitly, including Blender's possible frame-1 start versus Remotion's frame 0. Author action/camera with absolute time, seed randomness and bake history-dependent physics/particles/constraints before export. Verify direct seeking and looping without prior playback.
3. Check the delivery route. For GLB, verify actual material/rig/animation/constraint export support, bake/convert as needed and inspect the destination renderer. For pre-render, inspect alpha edges, color, frame count and trim/hold independently of audio timing. Use motion blur only when it helps movement readability without concealing clues/reveals.
4. Export from one shared source revision. Produce framing matching each selected deliverable's written scene handoff and record reproducible settings. Include all required occluding/occluded passes. Flat output cannot reveal unrendered sides or automatically receive volumetric lighting.
5. Before JSON selects the asset/media/animation, Boss adds missing shared capabilities to the shared module, scene types, validator and renderer dispatch together. The shared representation owner handles model loading, frame/fps animation sampling, readiness/errors and disposal.
6. Editor updates the executable timeline, shot mapping/index and entry/exit states under [sequence rules](sequence-workflow.md). Return constraints that change medium/camera/light/interfaces to Film and align revisions.

Integration is complete when the timeline loads actual output through the shared pipeline and random seeking produces expected frames in each selected deliverable and affected shared consumer. Export success alone is insufficient.

<a id="render-engine-default"></a>
## Render engine default: Eevee

**Default (user decision, 28 Oct 2026, chat: “ชอบนะ คุณภาพไม่ต่างกันเท่าไหร่ถ้าดูจาก sample คลิปผมก็ไม่ได้เน้นสมจริงขนาดนั้นอยู่แล้ว”; extended to every Blender job on the same day):** pre-rendered plates use **Eevee** (`BLENDER_EEVEE`, Eevee Next in Blender 5.x) at **64 samples**. A brief or scene handoff may select Cycles for a shot with a recorded reason and cost.

- **Why:** on the M1, Eevee 64 measured about 4–11 s/frame against about 26–105 s/frame for Cycles at 40 spp + denoise, i.e. 3.8× to 18× faster on the heaviest cases tried (evidence: [`DF-20261028-zcondo-eevee-render-spike`](dev-findings/DF-20261028-zcondo-eevee-render-spike.md), [`DF-20261028-zcondo-sp01-corridor-plate`](dev-findings/DF-20261028-zcondo-sp01-corridor-plate.md), [`DF-20261028-zcondo-eevee-worstcase`](dev-findings/DF-20261028-zcondo-eevee-worstcase.md)). Numbers are machine- and scene-specific estimates; re-measure on real assets.
- **Interiors:** bake a volume GI probe whose bounds enclose every lit surface; without it Eevee's screen-space GI leaves ceilings and back-lit figures near black.
- **Volumes:** volumetric tile 8 is the baseline; tile 4/2 showed no visible gain for 13 %/103 % more cost.
- **Author what Eevee does not infer:** a warm rim from distant fires, hair shader colour (the same Principled Hair settings differ between engines) and emissive strengths (embers clip to white at high emission).
- **Cycles remains right when** the shot relies on real refraction/caustics (for example the water-glass set in [`DF-20261028-blender-cycles-water-spike`](dev-findings/DF-20261028-blender-cycles-water-spike.md)) or on bounce light Eevee cannot approximate. Record the exception and expected cost in the manifest.
- **Record in the manifest:** engine, sample count, GI/volume settings and measured s/frame, so the plate can be regenerated. 32 samples left visible grain on dark ceilings; do not lower below 64 without a still check.
- **Not yet verified for production assets:** temporal flicker of hair/decals across a full plate, and cost with rigged, textured characters beyond the blockout cases above. Verify on the first real plate.

<a id="4-qa-และส่งต่อ"></a>
## 4. QA and handoff

For visual/runtime changes, complete [Boss's pre-push QA](boss-asset-workflow.md#qa-ก่อน-push-งานภาพหรือ-runtime): Studio cold load/play/scrub/random seeking, renders for selected deliverables and affected shared consumers, one-second/final-frame contact sheets, event/cut `F-1/F/F+1`, continuous sequence review and available neighbors.

Also compare Blender export and Remotion at corresponding source/output frames: scale/contact, foot sliding, grip/seat, clipping, occlusion, alpha halos, color/shadows, texture/model loading, animation starts/ends, reveals and subtitle safe regions. Check rendered files separately from previews. When evaluating cost, measure production/render times; MCP alone does not prove smoother visuals or faster rendering.

Boss delivers source/manifest/export/shared-code evidence; Editor delivers timeline/input props, runtime QA and [scene samples](editor-workflow.md#scene-samples-for-the-user). Assign `source-ready`, `export-ready`, `runtime-integrated` and `visual-verified` only with stage-specific evidence. Identify unverified stages and record reusable limitations/follow-ups in dev findings. Documentation, a `.blend` file or a viewport image is not a Remotion visual pass.

<a id="อ้างอิงสำหรับตรวจรุ่นจริง"></a>
## References for version checks

- [MCP for Blender — community project](https://github.com/ahujasid/mcp-for-blender): verify installed tools, addon/server requirements and limitations; this is not a Blender Foundation plugin.
- [Blender Manual: glTF export](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html): match supported materials, animation and export options to the Blender version in use.
- [Remotion Three.js integration](https://www.remotion.dev/docs/three): verify dependencies/APIs and implementation in the target checkout before use.
