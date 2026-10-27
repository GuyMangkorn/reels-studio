# reels-studio

A Thai YouTube studio that develops videos from storyboards, using Remotion for timing and export, and Three.js for 3D sets, cameras, depth and lighting. Existing 2D cut-out characters and screen overlays can be combined with 3D scenes when the storyboard calls for them.

Choose Shorts, YouTube Long or both before scriptwriting through the [delivery workflow](docs/delivery-workflow.md). Each selected video has its own script, factual review, visual brief, storyboard set, timeline and audio/subtitle timing, using shared research and reusable assets. [Production requirements](docs/production-requirements.md#outputs-and-story-timing) define duration, dimensions and fps. Both means one Short and one Long by default; extra Shorts require explicit scope. Shorter storyboard fragments and asset demos are development previews.

Agents start at [AGENTS.md](AGENTS.md), the task router for authoritative workflows and requirements. Agent-facing documentation is English; narration, subtitles and other viewer-facing copy remain Thai.

The planning handoff is **Boat research → Preaw script → Boat fact-check → Film visual/technical brief → Mark storyboard → Boss implementation**. [Film](docs/film-visual-brief-workflow.md) chooses suitable 2D/3D/hybrid techniques, lighting and camera language, and specify how the parts can work together. [Mark](docs/mark-storyboard-workflow.md) develops the brief into scene boards. Sets, characters and interaction props may all use 2D or 3D as appropriate; actual capabilities still require checkout verification. Agent files, including configured models and reasoning efforts, live in `.codex/agents/`; this is a handoff convention, not an automatic runner.

[docs/remotion-toolkit.md](docs/remotion-toolkit.md) maps the installed animation, text layout, noise, captions, transitions, sound and SVG tools to reusable scene components, with examples and integration checks. Run `npm run lint` for the Remotion, TypeScript and React Hooks checks.

## From storyboard to video

1. **Storyboard:** start with an editable board such as `sceneA.excalidraw`. Give each panel a shot id, duration, action, camera direction, lighting, narration/subtitle and framing for the selected deliverable.
2. **Shot breakdown:** map each panel to existing character, pose, set, prop and camera ids. List missing assets and record whether the shot needs 2D, 3D or a hybrid.
3. **Animatic / 3D blockout:** check pacing, camera paths, reveals, silhouettes and framing with simple shared assets before polishing the shot.
4. **Library and timeline:** add missing assets once, then select them in a JSON timeline under `scripts/`. Remotion sequences the shots; Three.js stages spatial shots. Subtitles and channel graphics remain readable in screen space.
5. **Review and render:** compare key frames with each selected deliverable's board, add narration/sound, then render the delivery endings.

New boards belong under `storyboards/<episode>/<short|long>/` with a matching `<scene>.md` scene sheet and a shared `index.md`; create the folder on first use. Keep editable sources and shot-to-timeline mapping in Git. Generated exports and animatics belong in `out/`. An Excalidraw board is an authoring reference; its drawing JSON is translated into the project's scene contract.

## Current implementation

The JSON scene pipeline already exists in [SceneRenderer](src/scenes/SceneRenderer.tsx), [scene types](src/scenes/types.ts) and [timeline validation](src/scenes/timeline.ts). [Root.tsx](src/Root.tsx) registers `Short` and `Long` with duration derived from the timeline. `Rig2DDemo` and the original seven-second hand-written rig demo are historical APIs.

The historical `main` baseline ships the reusable 2D human/cat/dog library and a five-shot JSON demo. Three.js integration and episode-specific assets are under development on working branches. The intended home for shared 3D staging is `src/three/`, with cameras under `src/camera/`. Check the active branch's source and validator for available sets and camera fields; a requested asset or planned POV example is not automatically implemented.

[docs/character-toolkit.md](docs/character-toolkit.md) documents the existing rig, pose tracks and JSON layout. [Planned visual components](docs/planned-visual-components.md) contains overlay and POV designs, explicitly separate from the [runtime contract](docs/runtime-contract.md).

## Setup and preview

```bash
npm ci
npm start
```

Studio opens the compositions registered in `src/Root.tsx`. The baseline demo expects local `public/narration.mp3` plus the committed amplitude envelope in `src/amplitude.json`. To generate its Niwat Thai narration at +5%, `npm run narration` requires Python with `edge-tts==7.3.1` and sends the demo subtitle text to the TTS provider. For a silent custom preview, pass `narration: null` as an input prop.

## Timeline data

The executable timeline is an array of scenes. This example uses fields supported by the baseline renderer:

```json
[
  {
    "durationSec": 4,
    "bg": "room",
    "time": "night",
    "actors": [
      {"id": "host", "type": "narrator", "pose": "shock", "x": 0.4}
    ],
    "subtitle": "คืนแรก... มีเสียงดังจากชั้นบน"
  }
]
```

The default timeline is selected in `src/Root.tsx`. To preview another timeline, supply input props with a `timeline` array and optional `narration` and `ending`. Keep storyboard panel ids mapped to timeline indices in the shot sheet. For new 3D camera, lighting or asset options, extend types, validation and scene dispatch together before adding those fields to an episode.

## Render and verify

The render helper uses the timeline and input props selected in its source. In the baseline, it renders the demo with both `_A_fade` and `_B_loop` endings; working branches may select another episode or a silent showcase. Check `scripts/render.mjs` before exporting.

```bash
npm run render:short
npm run render:long
npm run render:stills
```

For direct composition renders:

```bash
npx remotion render src/index.ts Short out/short.mp4
npx remotion render src/index.ts Long out/long.mp4
```

Check contracts and representative frames before a visual PR (full requirements: [contribution workflow](docs/contributing.md) and [Boss QA](docs/boss-asset-workflow.md#visual-and-runtime-qa-before-push)):

```bash
npm run lint
npm run typecheck
npm test
npx remotion render src/index.ts Short out/short-check.mp4 --frames=0-5
npx remotion render src/index.ts Long out/long-check.mp4 --frames=0-5
```

Also inspect the storyboard's key action/reveal frames and the start/middle/end of camera moves. Check 3D depth ordering, actor contact, clipping and subtitle safety in each selected or affected output. Narration uses Niwat (`th-TH`) at +5%; Thai subtitles use Noto Sans Thai or Sarabun from frame 0. Hold the closing line or final beat for about 3 seconds. Use the shared `A_fade` and `B_loop` endings and review the loop seam.

`out/`, generated MP4/MP3 files, dependencies and secrets are gitignored. Commit timeline/amplitude JSON, editable boards, reusable assets and their commercial-use license notices.

## Code ownership

| Path | Responsibility |
| --- | --- |
| `src/Root.tsx`, `src/index.ts` | Composition registration and Remotion entry |
| `src/scenes/` | Scene contracts, validation, sequencing, subtitles and endings |
| `src/rig/` | Shared 2D skeletons, poses, appearance and animation drivers |
| `src/assets/` | Reusable 2D backgrounds, props and screen overlays as implemented |
| `src/three/` | Shared 3D stage, sets, geometry/material helpers and cut-out integration; under development |
| `src/camera/` | Shared camera behavior; under development |
| `storyboards/` | Editable boards and shot sheets; created on first use |
| `scripts/` | Episode/chapter JSON and narration/render helpers |
| `public/` | Licensed fonts and local media |

## Documentation map

- [Production requirements](docs/production-requirements.md): output formats, timing, Thai narration/subtitles, reusable assets and licensing.
- [Sequence workflow](docs/sequence-workflow.md): storyboard-to-runtime authoring, blockout, boundaries and continuity.
- [Runtime contract](docs/runtime-contract.md): capability evidence and module ownership.
- [Planned visual components](docs/planned-visual-components.md): overlay and POV design specifications.
- [Contribution workflow](docs/contributing.md): issues, branches, verification and PR delivery.

The role workflows linked from [AGENTS.md](AGENTS.md) own their detailed handoff and review procedures. Requirements, defaults, reference examples and proposed capabilities are labeled separately.
