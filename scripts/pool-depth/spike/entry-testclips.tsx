// POOLDEPTH test-clip scratch entry (not registered in src/Root.tsx). Render stills with:
//   npx remotion still scripts/pool-depth/spike/entry-testclips.tsx TC-SH08-Hold out/pooldepth-test/x.png --frame=N
import {Composition, registerRoot} from 'remotion';
import {SceneRenderer} from '../../../src/scenes/SceneRenderer';
import type {Timeline} from '../../../src/scenes/types';

const base = {bg: 'none' as const, actors: [], subtitle: ''};
const tl = (src: string, durationSec: number): Timeline => [{...base, durationSec, media: [{kind: 'video' as const, src}]}];
const props = (timeline: Timeline, ending?: 'B_loop') => ({timeline, ...(ending ? {ending} : {}), chrome: {channelLabel: false as const, progressBar: false}, captionStyle: {preset: 'none' as const}});
const C = ({id, src, sec, ending}: {id: string; src: string; sec: number; ending?: 'B_loop'}) =>
  <Composition id={id} component={SceneRenderer} width={1080} height={1920} fps={30} durationInFrames={sec * 30} defaultProps={props(tl(src, sec), ending)}/>;

const Root = () => <>
  {/* 30-frame clip, 4 s scene under B_loop: frames 30-119 are the hold (clip end + 3 s) */}
  <C id="TC-SH08-Hold" src="pool-depth/test/tc_sh08.mp4" sec={4} ending="B_loop"/>
  <C id="TC-SH03-Hold" src="pool-depth/test/tc_sh03.mp4" sec={4} ending="B_loop"/>
  <C id="TC-Seam-SH08" src="pool-depth/test/tc_seam_sh08_f209.mp4" sec={1}/>
  <C id="TC-Seam-SH01" src="pool-depth/test/tc_seam_sh01_f000.mp4" sec={1}/>
</>;
registerRoot(Root);
