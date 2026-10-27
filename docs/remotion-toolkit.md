# Remotion toolkit for scene authors and agents

Read this before implementing or reviewing subtitles, overlays, camera effects, transitions or sound cues. [Production requirements](production-requirements.md) own production direction and asset conventions; [runtime contract](runtime-contract.md) identifies implementation evidence. This guide owns tool selection and integration recipes; `package.json` and the installed types own available versions and signatures.

## 1. Check the active checkout

```bash
npm ls --depth=0
npx remotion versions
```

Inspect `package.json`, `src/scenes/types.ts`, `validateTimeline` in `src/scenes/timeline.ts`, `src/scenes/SceneRenderer.tsx`, `src/Root.tsx` and the episode registry in `src/videos/<episode>/index.ts`. Check asset registries before drawing or adding a dependency. Read `scripts/render.mjs` before exporting because branches can select different timelines and audio.

The executable timeline is a `Scene[]`. The baseline supports `durationSec`, `bg`, `actors`, `subtitle` and the optional fields in its types. The package inventory and integration statements below describe the toolkit change that introduced this guide, not a fresh audit of the active checkout. Automatic text fitting, timed captions, scene transitions, SFX dispatch, `RuleCard` and `PhoneChat` were documented as **recipes to implement**, not features registered by that change. Confirm current modules, dependencies and dispatch before classifying any capability. See [planned visual components](planned-visual-components.md) for design specifications.

## 2. Choose by the shot's need

| Shot requirement | Tool to verify in the checkout | Put the reusable implementation here |
| --- | --- | --- |
| Fit a Thai heading, subtitle or bubble within a safe region | `@remotion/layout-utils` + `@remotion/fonts` | `src/scenes/` text layout helper, or the owning overlay |
| Pop a card, slide a phone, fade a title, combine CSS transforms | `@remotion/animation-utils` + core `spring` / `interpolate` | `src/assets/overlays/` |
| Subtle handheld drift, irregular light, atmospheric movement | `@remotion/noise` | `src/camera/`, shared lighting or background module |
| Subtitle cues within a shot, imported SRT/VTT, SRT export | `@remotion/captions` | `src/scenes/` and authoring/export helpers in `scripts/` |
| A scene handoff calls for a dissolve or wipe between shots | `@remotion/transitions` | Shared sequencing and timing in `src/scenes/` |
| Footage/stills, music, ducking, entry transitions, caption presets | Core `Img` / `OffthreadVideo` / `Audio` (integrated, see 10a) | `src/scenes/media.ts`, `MediaLayers.tsx` |
| Notification, page turn or whoosh at a specific beat | `@remotion/sfx` + core `Audio` / `Sequence` | Shared sound registry and renderer dispatch |
| Arrow, speech callout, star, heart or reaction symbol | `@remotion/shapes` | `src/assets/props/` or `src/assets/overlays/` |
| Find incorrect API usage and TypeScript / Hooks mistakes | `@remotion/eslint-config-flat` + `eslint` | `eslint.config.mjs`; run `npm run lint` |
| Stage and render the video | Core `remotion`, `@remotion/cli`, `@remotion/bundler`, `@remotion/renderer` | Existing compositions and render helpers |

`@remotion/fonts` already loads the local Noto Sans Thai font. Keep that local font and OFL notice. `@remotion/shapes` brings `@remotion/paths` transitively; add a direct, matching dependency if a source module needs to import paths itself. A transitive package is not an authored dependency contract.

Use core `spring()` for spring progress, `interpolate()` for numbers, `interpolateColors()` for colors, and `Sequence` for offsets. Animation-utils composes CSS values; it does not supply skeletal poses or replace the shared blink, mouth and joint drivers.

## 3. Integrate a capability once

1. Map the scene handoff beat to a row above and to an existing asset id. State whether the capability already works in this checkout or needs implementation.
2. Implement the missing behavior in its shared owner. Keep SVG, geometry, layout and package imports there; the episode selects ids and parameters.
3. When exposing it to JSON, update `types.ts`, `validateTimeline` and `SceneRenderer.tsx` together. Validate known ids, finite numbers, bounds, ordering and the chosen clock. Add meaningful validation/timing tests for the new behavior.
4. Match each selected deliverable's scene handoff and check affected shared consumers under [delivery workflow](delivery-workflow.md). Keep screen overlays and subtitles outside camera transforms. World objects remain in the camera's coordinate system.
5. Check start, key action/reveal, end and random-seek frames; use the package-specific checks below. Follow the [issue/PR workflow](contributing.md).

The examples below are independent authoring recipes, not registered assets. A copied component still needs shared placement, schema integration where applicable and visual verification before a timeline can select it.

## 4. Text layout: layout-utils + fonts

Use [measureText](https://www.remotion.dev/docs/layout-utils/measure-text) for dimensions, [fitText](https://www.remotion.dev/docs/layout-utils/fit-text) for a single line and [fillTextBox](https://www.remotion.dev/docs/layout-utils/fill-text-box) when assembling lines. The existing entry point is `src/scenes/Subtitles.tsx`; derive safe bounds from composition dimensions and any shared caption layout in the checkout.

Wait for the **actual font and weight** before measuring. Match the measured font, weight, spacing and width to the rendered element. Cache by text, font settings and bounds rather than doing a DOM measurement on every animation frame. See [layout best practices](https://www.remotion.dev/docs/layout-utils/best-practices).

```tsx
import {loadFont} from '@remotion/fonts';
import {fitText} from '@remotion/layout-utils';
import {staticFile} from 'remotion';

const thaiFontReady = loadFont({
  family: 'Noto Sans Thai',
  url: staticFile('fonts/NotoSansThai.ttf'),
  weight: '100 900',
});

export async function fitThaiHeading(text: string, width: number) {
  await thaiFontReady;
  const fitted = fitText({
    text,
    withinWidth: width,
    fontFamily: 'Noto Sans Thai',
    fontWeight: 700,
  });
  if (fitted.fontSize < 44) {
    throw new Error('Split the Thai heading into shorter authored lines');
  }
  return Math.min(72, fitted.fontSize);
}
```

This helper is for a short, single-line heading. The 44–72 px range is this recipe's choice, not a replacement subtitle specification. Call async measurement from the shared component's loading effect; gate rendering with `useDelayRender`, continue only after layout is ready, and route failures to `cancelRender`. Account for unmounting when updating state.

Thai needs a word-boundary policy. In the recorded 4.0.538 implementation, `fitTextOnNLines()` splits on spaces. For unspaced Thai, use authored breaks or `Intl.Segmenter('th', {granularity: 'word'})`, then measure each **whole candidate line** so shaping is retained. Preserve punctuation and authored spaces. Prefer another subtitle cue/page to unreadably small text. Reserve space for vowel/tone marks, line height, dark stroke and platform controls; width fitting alone does not prove a subtitle fits vertically. Inspect real Thai glyphs in each selected/affected output.

## 5. Overlay motion: animation-utils

Use [makeTransform](https://www.remotion.dev/docs/animation-utils/make-transform) for ordered CSS transforms and [interpolateStyles](https://www.remotion.dev/docs/animation-utils/interpolate-styles) for style keyframes. Create the card/phone once under `src/assets/overlays/`; use the [planned visual component contracts](planned-visual-components.md) when implementing them.

```tsx
import {makeTransform, scale, translateY} from '@remotion/animation-utils';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const PopInLabel = ({text, startFrame = 0}: {
  text: string;
  startFrame?: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < startFrame) return null;
  const progress = spring({frame: frame - startFrame, fps, config: {damping: 18}});
  return <div style={{
    transform: makeTransform([translateY((1 - progress) * 20), scale(0.92 + progress * 0.08)]),
  }}>{text}</div>;
};
```

For a RuleCard item, use `startFrame + index * staggerFrames` and keep earlier items mounted. For PhoneChat, derive typing-dot phases from frame/fps and message time. CSS transform order matters; preserve pivot origins and use SVG transform syntax for SVG attributes. Drive animation from the frame, so seeking directly to the middle produces the same result as playback. Keep rig pendulum lag in `src/rig/poses.ts`.

## 6. Atmosphere and camera drift: noise

[noise2D](https://www.remotion.dev/docs/noise/noise-2d) returns -1..1 for a seed and coordinates. Use separate seeds per axis/object and time in seconds. Keep intentional beats, such as an authored light failure or reveal, controlled by their own timing; noise adds small variation around them.

```tsx
import {noise2D} from '@remotion/noise';

export function handheldOffset(frame: number, fps: number, shotId: string) {
  const seconds = frame / fps;
  return {
    x: noise2D(`${shotId}:x`, seconds * 0.35, 0) * 3,
    y: noise2D(`${shotId}:y`, seconds * 0.35, 0) * 2,
  };
}
```

These are **pixels for a 2D wrapper**, not Three.js world units. In a 3D camera preset, choose appropriately small world-space offsets and keep the same pure frame function. The owning camera handles crop safety, clipping and aspect ratio. Keep the subtitle layer stationary. For light intensity, use a positive baseline and clamp the noise contribution. Stable shot/asset ids make seeds repeatable; avoid wall-clock time, `Math.random()`, accumulating state or unseeded randomness. Test the same frame after out-of-order sampling.

## 7. Timed subtitles and export: captions

The [captions API](https://www.remotion.dev/docs/captions/api) supplies a common `Caption` shape, `parseSrt`, `parseVtt`, `serializeSrt` and `createTikTokStyleCaptions`. It neither transcribes audio nor generates Niwat speech. Obtain timestamps from the TTS/authoring process or a separately selected transcription step; preserve Thai text and review the timing.

```tsx
import {serializeSrt, type Caption} from '@remotion/captions';

export const openingCaptions: Caption[] = [{
  text: 'มีเสียงอะไรอยู่หลังประตู...',
  startMs: 0,
  endMs: 1800,
  timestampMs: null,
  confidence: null,
}];

export function captionAt(captions: Caption[], frame: number, fps: number) {
  const nowMs = frame / fps * 1000;
  return captions.find(cue => nowMs >= cue.startMs && nowMs < cue.endMs)?.text ?? '';
}

export const openingSrt = serializeSrt({lines: openingCaptions.map(cue => [cue])});
```

Choose a clock in the schema: composition-global captions use `sceneStartFrame + localFrame`; shot-local captions use `localFrame`. Use half-open intervals `[startMs, endMs)` and validate increasing times, positive durations and supported overlap behavior. Feed the selected text to the shared subtitle presentation so font, outline and safe region remain consistent. Keep the required hook visible at composition frame 0 even if speech starts later.

`createTikTokStyleCaptions()` groups existing timestamped tokens; it does not discover Thai word boundaries. Highlighting individual words requires reviewed word timings. Export SRT from a Node helper under `scripts/`, while the composition renders the same cue data. Keep committed cue JSON separate from ignored audio. Continue using the existing RMS amplitude JSON for `mouthAt`; adding captions does not change lip-flap sampling.

## 8. Scene transitions: transitions

Use [TransitionSeries](https://www.remotion.dev/docs/transitions/transitionseries), `linearTiming` / `springTiming` and presentations such as `fade()` or `wipe()` when the scene handoff calls for them. A hard cut remains a valid shot boundary.

```tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AbsoluteFill} from 'remotion';

export const DissolveExample = () => <TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={120}>
    <AbsoluteFill style={{backgroundColor: '#424668'}} />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({durationInFrames: 12})}
  />
  <TransitionSeries.Sequence durationInFrames={120}>
    <AbsoluteFill style={{backgroundColor: '#69647e'}} />
  </TransitionSeries.Sequence>
</TransitionSeries>;
```

This example lasts **228 frames**, because the 12-frame overlap is subtracted from 240. The documented baseline `timelineFrames()` sums durations without overlaps; inspect its current implementation before integrating transitions. Before enabling JSON transitions, update scene starts and total duration together with composition metadata, narration, amplitude sampling, captions and ending holds. Preserve scene handoff timing by defining whether supplied durations include the overlap. A transition must fit within both adjacent shots. Use a single shared timing calculation rather than separately adjusting the audio and picture.

Keep subtitles legible during a dissolve; fading two complete SceneViews together can put two subtitle lines on top of each other. Choose the active subtitle separately from picture transitions. Test a cut, a transition, the shortest permitted shot, the overlap boundary, both ending variants and the last-to-first loop seam.

## 9. Sound cues: sfx + core Audio

[`@remotion/sfx`](https://www.remotion.dev/docs/sfx/) exports **remote sound URLs**, not bundled local WAV files. Its npm code is MIT; sound licenses are per file. For example, [whoosh](https://www.remotion.dev/docs/sfx/whoosh) is credited to 1bob under CC0. Check each sound's own page and original source; record title, creator, source URL and license beside any imported local sound. Select original/generic commercially usable sounds that fit the channel rather than assuming every meme sound is approved.

```tsx
import {whoosh} from '@remotion/sfx';
import {Audio, Sequence, useVideoConfig} from 'remotion';

export const WhooshCue = ({atSec}: {atSec: number}) => {
  const {fps} = useVideoConfig();
  return <Sequence from={Math.round(atSec * fps)}>
    <Audio src={whoosh} volume={0.2} />
  </Sequence>;
};
```

Inside a shot Sequence, `atSec` in this recipe is shot-local. Mount a global cue outside the shot sequence and use composition time. Use a shared allowlisted sound id in JSON, then resolve it through a registry; arbitrary episode URLs are not a sound library. For dependable offline exports, import approved sounds to `public/sfx/` with a sibling NOTICE and resolve them via `staticFile`. Remote playback needs network access. Check current Git ignore rules before adding media: MP3/MP4 are ignored; WAV is not automatically ignored.

Set duration/trimming and volume deliberately; listen to a rendered segment with narration. The example gain is a starting point, not an audio loudness standard. Ensure cues are not cut off at shot boundaries or replayed accidentally at a loop seam. A cue before a visual reveal should retain that authored offset.

## 10. Reusable vector symbols: shapes

[`@remotion/shapes`](https://www.remotion.dev/docs/shapes/) provides components such as `Arrow`, `Callout`, `Star`, `Heart` and matching `make*` SVG path functions. Use components in HTML overlays; use generated paths inside an existing SVG rather than accidentally mixing coordinate systems.

```tsx
import {Star} from '@remotion/shapes';

export const ReactionStar = () => <Star
  points={5}
  innerRadius={22}
  outerRadius={48}
  fill="#FFD166"
  stroke="#4A3B3B"
  strokeWidth={4}
/>;
```

Wrap and name channel symbols once in the shared asset library, then expose parameters such as color/size and register ids if JSON needs them. Keep outline weight consistent after scaling. Use existing human/animal rigs for characters; a shape generator does not replace an articulated skeleton. Verify clipping, pivot placement and selected/affected aspect ratios when animating a symbol.

## 10a. Footage, stills, music, entry transitions and caption styles

**Status:** `existing-integrated` in `src/scenes/` (types in `types.ts`, validation in `media.ts` + `validateTimeline`, rendering in `MediaLayers.tsx` and `SceneRenderer.tsx`; issue #70). Use these fields for genres that are not illustrated stories: footage-led edits, slideshows, talking-head cutaways, ads and screen recordings. Existing timelines render unchanged.

| Need | Field | Notes |
| --- | --- | --- |
| Footage or still image | `scene.media[]` (`kind: 'video' \| 'image'`, `src`, `startSec`/`endSec`, `fit`, `box`, `layer`, `opacity`; video: `trimStartSec`, `playbackRate`, `volume`) | `src` is a path under `public/` or an `http(s)` URL. Video is muted unless `volume` is set. Scene-local seconds. Not supported in projected scenes. |
| Scene without an illustrated set | `scene.bg: 'none'` | Pair with `media` or overlays. |
| One-shot sound | `scene.sfx[]` (`src`, `atSec`, `volume`, `trimStartSec`, `durationSec`) | Mounted on the composition clock at the scene start. |
| Music / ambience | `video.audio[]` (`src`, `startSec`/`endSec`, `trimStartSec`, `volume`, `fadeInSec`/`fadeOutSec`, `loop`, `duckUnderNarration`) | `duckUnderNarration: 0.25` multiplies the track gain while the narration amplitude envelope is speaking. Without narration it has no effect. |
| Transition into a scene | `scene.transitionIn` (`type: 'fade' \| 'slide' \| 'wipe'`, `frames`, `direction`) | The incoming scene enters over the last `frames` of the previous scene, held on its first frame. **Scene durations, cut frames and narration sync do not change**; `frames` must be shorter than the previous scene. Subtitles and chrome of the incoming scene appear when the transition ends. `sceneTransitionFrames` (the older dip-to-dark) is separate. |
| Caption look | `video.captionStyle` (`preset: 'outline' \| 'box' \| 'none'`, `position`, `color`, `scale`) | Default is the channel's white-on-dark outline at the bottom. |
| Seamless loop ending | `video.ending: 'C_seamless'`, `video.loopBlendFrames` (default 15) | No closing hold or dip to dark. The last `loopBlendFrames` crossfade into a frozen frame 0 (the last frame is byte-identical to frame 0 in the check render), and the last scene's captions/chrome are hidden during the blend, so keep speech out of that window. Render with `node scripts/render.mjs <ID> --endings=C_seamless`. Music should not fade out; end it at the loop point. |
| Channel label / progress bar | `video.chrome` (`channelLabel: string \| false`, `progressBar`) | Default keeps `ทำไมล่ะ` and the bar. |

Authoring rules:

- Imported footage, images and music need a license that allows commercial YouTube use; record it beside the file in a `NOTICE` ([production requirements](production-requirements.md#secrets-brands-and-licenses)). WAV/PNG are not Git-ignored (MP3/MP4 are): keep large local media out of commits unless the episode needs them.
- Footage playback is deterministic under seeking (`OffthreadVideo`), but confirm the codec renders and that clip length covers its `startSec`–`endSec` window.
- Check actual frames: one still inside each clip, the first/middle/last frame of every `transitionIn`, music level with and without narration, and the Thai caption against busy footage (use `preset: 'box'` for contrast).
- Verification evidence for this capability (2026-10-27, `main` + issue #70 branch): unit tests in `tests/media.test.ts`; a three-scene check render with full-frame video, contained image, picture-in-picture video, slide and wipe transitions, box captions and hidden channel label; audio RMS confirmed SFX spike, fade-in/out and a 0.2× duck while narration speaks.

## 11. Verification and dependency maintenance

`npm run lint` applies Remotion's flat config plus TypeScript and Hooks rules to `src` and `tests`. `npm run typecheck` remains responsible for TypeScript contract checking. New runtime behavior also needs relevant tests and scene handoff-frame checks.

The documented ESLint 10 setup requires Node.js 20.19+, 22.13+, or 24+. Check `node --version` when setting up another machine.

```bash
npm run lint
npm run typecheck
npm test
npx remotion versions
npx remotion render src/index.ts Short out/short-check.mp4 --frames=0-5
npx remotion render src/index.ts Long out/long-check.mp4 --frames=0-5
```

For a silent CLI check when local narration is absent, add `--props='{"narration":null}'`. The standalone render helper can still require a local audio file; inspect it first. A render of frames 0–5 only proves startup: add frames covering the changed text, pop-in, noise, caption, transition or reveal, and listen to changed sound cues.

Keep direct `remotion` and `@remotion/*` dependencies at one exact version; the documented toolkit installation used **4.0.538**; verify the active manifest and installed versions. Use `npx remotion add @remotion/<package>` to select the matching version, inspect the resulting dependency section, and place lint-only tools in `devDependencies`. Pin any newly added tool versions and commit both manifest and lockfile. Run `npm ci` to verify a fresh installation. Do not upgrade the whole renderer just to add one helper.

Add another package only when a shot or product requirement needs it. Google Fonts downloads, transcription engines, Lottie/Rive, an embedded Player and cloud rendering are separate decisions. The current local font, Niwat generation, RMS mouth driver and CLI render pipeline already have owners; extend them deliberately rather than introducing a second competing system.
