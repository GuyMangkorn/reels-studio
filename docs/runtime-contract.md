# Runtime Contract and Module Ownership

**Status:** Runtime source is authoritative for implementation support. The architecture notes below describe the historical baseline and intended module responsibilities, not a new verification of every working branch.

For any capability, record `existing-integrated`, `exists-unintegrated`, `missing` or `unknown` with checkout/revision and evidence. A design or installed package alone does not establish runtime support.

**Role ownership:** [James's contract](james-editing-workflow.md#decision-and-code-ownership--requirements) assigns episode-specific timeline/staging/edit helpers and runtime shot mappings to James. Boss owns reusable modules, rig/anchor/projection/camera/light/effect capabilities and shared types/validator/dispatch. James requests shared changes from Boss and verifies their use in the assembled sequence; documentation adds no automatic importer or runtime fields.

## Architecture and implementation status

**Implemented baseline:** The JSON pipeline exists: `src/scenes/SceneRenderer.tsx`, `types.ts` and `timeline.ts` sequence and validate scenes for both formats. `src/Root.tsx` registers `Short` and `Long`, with duration calculated from scene durations. The historical `Demo.tsx`, `rig/presets.ts`, `rig/types.ts` and `Rig2DDemo` API are no longer the baseline.

**Historical baseline / recheck required:** The `main` baseline includes the 2D human/cat/dog library and JSON demo. Three.js integration and episode assets are being developed on working branches. The paths below establish ownership for that work; their presence and supported options must be checked in the active checkout. A design specification or installed dependency alone does not mean a feature is integrated or renderable.

| Path | Responsibility |
| --- | --- |
| `storyboards/` | Editable storyboard sources and shot breakdowns; create on first use |
| `scripts/` | One JSON timeline per short/chapter, narration and render helpers |
| `src/scenes/` | Scene contracts, validation, sequencing and shared staging |
| `src/three/` | Shared Remotion/Three.js stage, coordinate conversion and 2D cut-out integration |
| `src/three/backgrounds/` | Reusable 3D sets and their registry |
| `src/three/primitives/` | Shared geometry/material helpers; reusable 3D props may live under `src/three/props/` |
| `src/camera/` | Shared frame-driven camera presets and camera effects |
| `src/rig/` | Existing human/quadruped skeletons, poses, appearance variants and drivers |
| `src/assets/backgrounds/`, `src/assets/props/` | Reusable 2D locations and objects |
| `src/assets/overlays/` | Shared screen graphics; see [planned visual components](planned-visual-components.md) |
| `src/config/channel.ts` | Shared channel identity when introduced; scene/input props may override it |
| `public/` | Licensed fonts and local narration/media |

Use `src/scenes/types.ts` and `validateTimeline` in `src/scenes/timeline.ts` as the runtime contract. The current baseline timeline is an array of scenes with `durationSec`, `bg`, `actors`, `subtitle` and optional supported fields. It is not the old illustrative `{fps, hook, moral, shots}` object. Add camera, lighting, overlay or asset-selection fields to the contract and renderer before documenting them as usable JSON. Keep planned examples explicitly labeled as designs.

Read [docs/character-toolkit.md](character-toolkit.md) when changing the existing rig or pose tracks. Confirm APIs against the source because development branches may extend them.

