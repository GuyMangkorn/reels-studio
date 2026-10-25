# reels-studio

Thai YouTube studio for Shorts and long-form videos, built with Remotion. Read [AGENTS.md](AGENTS.md) before making changes. Repository: [GuyMangkorn/reels-studio](https://github.com/GuyMangkorn/reels-studio).

## Character work in progress

This branch imports the existing Reels Creator character work for review. It replaces the original seven-second narrated rig demo with a silent twenty-second JSON demo and introduces a different Character API. `Short` and `Long` remain the render IDs; `Rig2DDemo`, the original `Pose`/`Costume` API, and amplitude-driven narration are not carried over by this import. Existing callers need migration before merging.

`AGENTS.md` is preserved from `main`; its descriptions of the original files and API still refer to that baseline. The implementation below documents this branch. Production story lengths, narration, and ending variants described in `AGENTS.md` remain future work; the included timeline is an asset demonstration.

## Little Wander — reusable cut-out animation

Flat SVG artwork, hierarchical joints and deterministic frame-based motion in React / TypeScript / Remotion. Both aspect ratios consume the **same five-scene JSON timeline**.

## Run

```sh
npm ci
npm start              # Remotion Studio, http://localhost:3000
npm run typecheck
npm test
npm run render:stills   # Five check frames per format in out/qa/
npm run render         # Both MP4s; bundles once, shares a browser
npm run render:short
npm run render:long
```

- `Short`: 1080 × 1920, 30fps, 600 frames / 20 seconds → `out/demo_short.mp4`
- `Long`: 1920 × 1080, 30fps, 600 frames / 20 seconds → `out/demo_long.mp4`
- H.264, yuv420p, CRF 18, no audio. Rendering uses port 3101 to avoid Studio's port.
- The first render may download Remotion's Chrome Headless Shell. The Noto Sans Thai font is bundled and requires no font network requests.
- Outputs, generated bundles and node_modules are ignored by Git.

## Files and responsibilities

| File | Responsibility |
| --- | --- |
| `src/index.ts` | Remotion entry point |
| `src/Root.tsx` | Short / Long composition registration and dynamic timeline duration |
| `src/rig/Character.tsx` | Separate head, torso, arm, hand, leg and foot SVG parts, appearance, expressions, blinking, breathing and talking |
| `src/rig/Joint.tsx` | Local pivot wrapper using CSS transform-origin; nested joints inherit rotation |
| `src/rig/poses.ts` | Seven named joint-angle sets, looping walk / wave, delayed pendulum motion and pure interpolation |
| `src/rig/Animal.tsx` | Shared quadruped skeleton, Cat and Dog, articulated legs, tail wag and ear twitch |
| `src/rig/index.ts` | Public rig exports |
| `src/assets/Background.tsx` | Forest, city, room, sea and nightSky builders; far/mid/near parallax and day/night palettes |
| `src/assets/Props.tsx` | Tree, House, Car, Boat, Sign and placement registry |
| `src/scenes/types.ts` | Timeline, Scene and Actor contracts |
| `src/scenes/timeline.ts` | JSON validation, duration, identity, movement, pose tracks and adaptive layout |
| `src/scenes/SceneRenderer.tsx` | Data-driven sequencing and scene staging shared by both formats |
| `src/scenes/Subtitles.tsx` | Local font loading and large stroked Thai subtitles |
| `scripts/demo.json` | Five 4-second scenes with all three actors and Thai placeholder text |
| `scripts/render.mjs` | Shared bundle/browser renderer and optional QA still export |
| `tests/animation.test.ts` | Timeline, validation, deterministic interpolation, walk loop and layout checks |
| `public/fonts/NotoSansThai.ttf` | Bundled variable Noto Sans Thai font |
| `public/fonts/OFL.txt` | Font license |
| `docs/superpowers/plans/2026-10-25-cutout-animation.md` | Implementation plan and verification record |
| `package.json`, `package-lock.json`, `tsconfig.json`, `.gitignore` | Reproducible build and project configuration |

## Character API

```tsx
import {Character, Cat, Dog} from './rig';

<Character
  x={400} y={850} scale={1.4} flip={false}
  skinColor="#efb78e" shirtColor="#fb947e" pantsColor="#666cac"
  hairStyle="short" expression="happy" talking
  pose={{from: 'idle', to: 'wave', startFrame: 30, durationFrames: 12}}
/>
<Cat x={1100} y={850} pose="walk" />
<Dog x={1500} y={850} pose="idle" />
```

`x/y` are pixel foot anchors for direct components; `scale` is a multiplier. Hair is `short | long | bald`, expressions are `neutral | happy | shock | think`. Character pose names are `idle | walk | point | shock | think | wave | sit`. Animal poses are `idle | walk | sit | wave`; `wave` lifts one front paw. `color`, `flip`, and `scale` also work on animals.

Live changes to a plain pose name blend from the currently displayed pose over 0.4 seconds. For **render-authored changes and reliable random seeking**, pass `{from, to, startFrame, durationFrames}`, use the JSON `poses` track, or pass a character-level track:

```tsx
<Character pose={{initial: 'idle', keys: [
  {frame: 30, pose: 'wave'},
  {frame: 36, pose: 'point'},
  {frame: 90, pose: 'think'},
]}} />
```

Tracks carry complete history and automatically interpolate every change, including interruptions mid-blend. A bare prop computed from the current frame alone cannot supply its earlier values to a fresh parallel render worker; author those changes as a track. Live name tracking resets on backward seeking. The default transition takes 0.4 seconds. All clocks use composition fps; optional `frame` overrides the rig clock in local frames.

The torso group contains shoulders and head. An arm contains a lower-arm joint, which contains a hand joint. Hips contain knees, which contain feet. Parts are named with `data-joint` attributes. The `Joint` wrapper first translates the pivot, then rotates artwork around the local `(0, 0)` origin. Face shapes remain part of the head and inherit its rotation. A deterministic 8.4-second blink schedule has 2.7, 3.3, and 2.4-second intervals. Talking uses procedural mouth flaps, not phoneme matching.

## Scene JSON

Edit `scripts/demo.json`, or pass a typed `timeline` prop to `SceneRenderer`. CLI input props can be an object with a `timeline` array; registered compositions calculate their duration from the supplied scene durations.

```json
[
  {
    "durationSec": 4,
    "bg": "forest",
    "time": "night",
    "title": "A little wander.",
    "actors": [
      {"id": "host", "type": "narrator", "pose": "shock", "x": 0.3, "talking": true,
       "poses": [{"atSec": 2, "pose": "think"}]},
      {"id": "cat", "type": "cat", "pose": "walk", "from": 1.1, "to": 0.7}
    ],
    "props": [{"type": "sign", "x": 0.8, "y": 0.65, "size": 190}],
    "subtitle": "ข้อความซับไทย"
  }
]
```

- Actor `x`, `from`, `to` are normalized horizontal positions; `from/to` override `x` and ease over the scene. Values outside 0–1 permit entrances. Movement does not automatically change pose; set `pose: "walk"` too.
- `y` is an optional normalized foot anchor. The default depends on aspect ratio and species; portrait staggers the dog forward. `scale` multiplies the responsive base scale. Prop `x/y` are normalized anchors; `size` is pixels before the portrait multiplier.
- Stable `id`s allow the narrator to interpolate from its previous scene's final pose. Without IDs, identity falls back to type + index. `poses` keyframes are scene-local seconds and must be strictly increasing, within scene duration. Keyframes choose the target at that time; interpolation takes the next 0.4 seconds.
- Scenes cut at exact duration boundaries. Secondary motion restarts on each scene's local clock. No audio is required or included.
- Animals have their own procedural pose sampling; their pose switches are immediate, with smooth cyclic leg / tail motion.
- Thai text wraps within a safe bottom region. The demo fits one line; extremely long subtitles should be split into shorter scenes.
- Runtime validation reports paths for malformed scene fields, unknown assets / poses, invalid timing and duplicate actor IDs.

## Add a new pose

1. Add its name to `PoseName` in `src/rig/poses.ts`.
2. Add a complete angle set to `poses`, spreading `poses.idle` or the local `base` and overriding joints in degrees. Positive rotation is clockwise. Joint names are listed in `joints`.
3. For a looping pose, add its frame-based offsets inside `samplePose`; use `frame / fps` for seconds. The interpolation and secondary motion functions will continue working.
4. Use the name in an actor's `pose` or `poses` track. Narrator validation reads the pose registry. Animal-specific names also require adding sampling in `Animal.tsx`, its prop union, and `animalPoses` in `timeline.ts`.

## Add a new background

1. Extend `BackgroundName` in `src/assets/Background.tsx`.
2. Add a builder to `backgroundRegistry`. It receives `{w, h, p, night, t}` and returns `{far, mid, near}` SVG nodes. Use normalized dimensions and the passed palette; allow a small horizontal overflow for parallax.
3. Add its JSON name to `bgNames` in `src/scenes/timeline.ts` so external timelines validate.
4. Set `"bg": "yourName"` in a scene and preview both formats. Day/night colors and three depth-dependent drift speeds are applied by the common wrapper.

For a new prop, add artwork on the 240×240 prop canvas, then update `PropName`, `propRegistry` and the validator's `propNames`. For a new character species, reuse the `Joint` hierarchy, add its actor type to the schema and dispatch in `SceneRenderer`, and give it a responsive scale in `layoutActor`.

## Verification

`npm run typecheck` and `npm test` verify contracts and deterministic math. QA stills at frames 90, 210, 330, 450 and 570 cover all five scenes in both aspect ratios. Final exports can be checked with Remotion's bundled ffprobe. The project pins all Remotion packages to 4.0.538 and overrides its transitive Zod dependency to patched 4.6.6; npm audit reports no known vulnerabilities at delivery.
