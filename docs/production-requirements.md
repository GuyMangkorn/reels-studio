# Production Requirements

**Status:** Authoritative production requirements unless a passage is explicitly labeled as a default, reference or proposed capability. Applies across editorial, planning, implementation and review. English is the documentation language; viewer-facing content stays Thai.

**Style profiles:** the visual-direction, lighting, rig, label, TTS and ending rules below are the **`channel-default` style profile** ([delivery workflow](delivery-workflow.md#style-profile)). A deliverable with another profile (footage, typography, comedy, ad, etc.) overrides them with a recorded reason; rules on safety, licenses, Thai readability, determinism and the hook/duration targets still apply.

For medium flexibility, demo lighting, texture lifecycle, lead size, shot movement and visual QA, use the authoritative [Boss production rules](boss-asset-workflow.md#latest-production-rules). For sequence assembly and boundaries, read [sequence-workflow.md](sequence-workflow.md).

## Visual direction and motion

Use original stylized artwork, readable silhouettes, simple forms and a consistent channel palette. Existing 2D characters keep solid fills, rounded shapes and dark outlines. Character representation follows Film's brief; preserve identity and appearance when switching medium. Keep the chosen 2D/3D/hybrid assets visually consistent through shape language, materials, lighting and color. The brief and scene handoff determine daylight, dusk, night, moonlight, shadows and atmosphere; bright daytime pastel lighting is not mandatory for every shot. Three.js is an intended production tool, including for actual 3D geometry and spatial camera movement.

**Reference palette:** The existing colors guide asset continuity; the brief determines the shot lighting and grade:

| Role | Hex |
| --- | --- |
| Skin | `#FFD9B8` |
| Shirt / accent | `#FF8FA3` / `#FFF3B0` |
| Pants | `#7ED6B2` |
| Shoes | `#FF9F5A` |
| Hair | `#6B4A3A` |
| Cheek | `#FFADAD` |
| Outline | `#4A3B3B` |
| Sky | `#FFF1C9` → `#FFE0E6` |
| Sun / ground | `#FFD166` / `#B8F2C9` |

- Keep nested pivots: shoulder → elbow → wrist, hip → knee → ankle, torso → head. Limbs retain phase-lagged secondary motion; use `src/rig/poses.ts` and shared drivers.
- Use `blinkAt` and audio-amplitude-driven `mouthAt`. Use authored pose tracks for reliable random seeking and interrupted transitions. Check pivots with `showPivots`, then disable debug markers for delivery.
- Derive animation, cameras, lighting, flicker and particles from Remotion frame/fps and seeded deterministic functions. Render seeking and parallel workers must reproduce the same frame.
- Place reusable 2D rigs in 3D through a shared cut-out adapter when needed. Preserve depth ordering, transparent edges, shadows and floor/seat contact across camera motion.
- Wait for textures, models and fonts through Remotion's render-loading lifecycle. Release GPU resources in shared components.
- Keep Thai subtitles, cards and channel labels in screen space unless the scene handoff explicitly places an element in the world. Camera movement must keep the subtitle band readable.


## Adding reusable assets

For a pose, extend `PoseName`, the pose registry and frame sampling in `src/rig/poses.ts`; update species-specific sampling and validation when needed. Start from an existing joint set, keep lag and use the shared transition system.

Choose 2D or 3D characters from Film's brief, checking available rigs, assets and render feasibility. Reuse shared character assets across scenes. For a variant of an existing character, reuse its body type and expose appearance parameters or named costumes. The current 2D `Character` uses appearance props and pose inputs; confirm the exported API before writing an example. New 3D rigs/adapters require explicit shared implementation and integration. Add a new skeleton only when the selected body or representation requires it. Cat and Dog currently share `src/rig/Animal.tsx`.

For 3D sets, characters or props, implement shared modules and register them with the scene pipeline. Follow Film's composition strategy for hybrid work: specify spaces, camera, depth/alpha, lighting, anchors and resource ownership. Compose from reusable geometry, materials and lighting. Expose parameters for time of day, reveal state or set dressing when the scene handoff needs them. Define dimensions and floor/seat/grip anchors so actors stay in contact as assets move or scale. DOM overlays do not automatically share WebGL depth or lighting.

For a 2D background or prop, extend its shared registry and validator. For an overlay, implement the shared screen component and scene dispatch. A chapter references library ids and timing rather than copying SVG, geometry, pose functions or layout code.


## Outputs and story timing

Resolve the requested deliverables through [delivery workflow](delivery-workflow.md) before writing. Each selected editorial version has its own script, scene sheets, timeline, narration and subtitle timing, using shared scene components and assets at 30 fps:

| Composition | Size | Use |
| --- | --- | --- |
| `Short` | 1080×1920 | YouTube Shorts / Reels |
| `Long` | 1920×1080 | Long-form |

Short and Long may have different scene order, beat timing and spoken wording. Adapt framing, camera aspect/FOV and safe regions to each selected version's own scene handoff while keeping character proportions and 3D geometry intact. An explicitly requested alternate framing of the same edit preserves that edit's action/timing; it does not supply the other editorial version. In production guides, “both formats” checks apply when both are selected or an affected shared consumer needs regression coverage; a single-format request does not create another deliverable.

**Duration defaults:** A standalone Short targets **40–60 seconds**; a normal YouTube Long targets **9–10 minutes (540–600 seconds)**. These are full-video durations including closing holds and ending behavior, not targets for each scene. Long chapters follow the story; no fixed chapter duration or automatic chapter-to-Short split is required. Explicit user durations override these defaults with a recorded reason. Keep timing `estimated` until a spoken read or audio/animatic check supports it; verify the final executable/rendered duration before release. Do not pad silence, repeat material or speed up narration merely to reach the range. **Hook requirement:** Each publishable chapter/Short opens with a hook in the first 2 seconds (60 frames), without an intro/logo/subscribe card. A 20-second scene handoff fragment or shorter asset demo is valid development material; its length is not a new production requirement.

Subtitles are visible from frame 0. Hold the closing line, moral when appropriate, or intended final beat for about 3 seconds. Deliver two endings through the shared ending behavior: `_A_fade` holds then fades; `_B_loop` holds and uses the shared loop seam. Check the last-to-first transition against the intended scene handoff. **Seamless loop (optional third ending, Reels/Shorts):** `_C_seamless` for platforms that replay automatically. It has no closing hold or fade; the last `loopBlendFrames` (default 15) crossfade into a frozen copy of frame 0, so the last frame equals the first. It replaces the 3-second hold requirement for that output only; the closing beat must land before the blend window (see [loop-friendly writing](scriptwriting-principles.md#loop-friendly-writing)). Choose it when the deliverable's style profile asks for a loop; A/B stay the default pair. Store MP4s in `out/`, for example `scene-a_A_fade.mp4` and `scene-a_B_loop.mp4`.


## Thai subtitles, narration and channel label

- Use large Thai subtitles near the bottom, white with a dark stroke, in Noto Sans Thai or Sarabun. Keep glyphs above platform controls and within the safe region in both formats. Use Thai from the first frame, without a duplicate English subtitle over it.
- Narration uses Thai **Niwat** (`th-TH`) at **+5%** (`speakingRate: 1.05`). `scripts/narration.py` generates local audio for the existing demo; inspect its inputs when authoring a new episode.
- Keep narration MP3s local under `public/`; commit their amplitude JSON. At 30 fps, decode mono 48 kHz audio and compute RMS per 1600 samples, normalized to 0..1. The demo uses `src/amplitude.json`; per-video narration uses `public/narration/<CompositionId>.mp3` with `<CompositionId>.amplitude.json` beside its timeline ([README](../README.md#videos-and-parallel-work)).
- Audio and its amplitude envelope use the composition clock across scene cuts. Pose and camera motion use the shot-local clock.
- **Channel default and proposed configuration:** Use a shared channel configuration for the default Thai name **ทำไมล่ะ**. Scene/input props may override it; `null` or `false` hides it once supported by the schema. Keep the label clear of the subtitle band.


## Shared visual correctness

Fix contact, facing and layout in the owning rig, prop or stage so every scene benefits:

- Cat/dog facing follows travel direction, and the walk cycle travels with that facing. Explicit facing overrides remain supported.
- A sofa exposes its cushion surface. Sitting places the hip on that surface through the shared pose transition; scene-specific body nudges are not the contact model.
- In 3D, verify near/far clipping, transparent cut-out ordering, foreground occlusion, shadow/floor contact and framing at the start, middle and end of the camera move.
- The channel footer and all overlays stay clear of Thai subtitles in both formats.


## Secrets, brands and licenses

- Keep secrets, tokens, `.env` files and service-account credentials outside commits. Helpers read secrets from the environment.
- Use original channel characters and artwork. No real brand logos, trademarked characters or copied network bugs.
- Imported fonts, models, textures, sounds and other assets need a license allowing commercial YouTube use. Record it beside the asset in a `NOTICE` or license comment. Noto Sans Thai and Sarabun use OFL and are approved subtitle fonts.
