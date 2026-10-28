// POOLDEPTH S0 scratch entry (not registered in src/Root.tsx). Render with:
//   npx remotion still scripts/pool-depth/spike/entry.tsx S0-Hold out/spike/x.png --frame=N
import {Composition, registerRoot} from 'remotion';
import {SceneRenderer} from '../../../src/scenes/SceneRenderer';
import type {Timeline} from '../../../src/scenes/types';

const clip = {kind: 'video' as const, src: 'pool-depth-spike/s0.mp4'};
const base = {bg: 'none' as const, actors: [], subtitle: ''};
// 2 s clip in a 5 s scene; under B_loop the last 90 frames hold (poseFrame freezes at frame 60).
const hold: Timeline = [{...base, durationSec: 5, media: [clip]}];
// 2 s clip in a 2 s scene, A_fade off: plain C_seamless-free check of frame-exact mapping.
const exact: Timeline = [{...base, durationSec: 2, media: [clip]}];

const Root = () => <>
  <Composition id="S0-Hold" component={SceneRenderer} width={1080} height={1920} fps={30} durationInFrames={150} defaultProps={{timeline: hold, ending: 'B_loop' as const, chrome: {channelLabel: false as const, progressBar: false}, captionStyle: {preset: 'none' as const}}}/>
  <Composition id="S0-Exact" component={SceneRenderer} width={1080} height={1920} fps={30} durationInFrames={60} defaultProps={{timeline: exact, chrome: {channelLabel: false as const, progressBar: false}, captionStyle: {preset: 'none' as const}}}/>
</>;
registerRoot(Root);
