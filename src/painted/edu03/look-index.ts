// Standalone entry for the EDU-EP03-SHORT look stills and spike S1 (W3). Kept out of src/Root.tsx and the episode registry (render.mjs
// bundles only the registry): render with `printf 'EDU3-LF01 30 out/edu03/look/LF01.png\n' | node scripts/stills.mjs src/painted/edu03/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {B04_BASE_DOG, B04_FRAME_DOG, B04_FRAME_NORMAL, B04_BASE_NORMAL, LF03, LF03_NORMAL, LF01, LF01_DOGVIEW, LF02, LF_FRAMES, S1_BLUE_DOG, S1_BLUE_NORMAL, S1_DOG, S1_MID, S1_NORMAL} from './look';

const size = {width: 1080, height: 1920, fps: 30};
const comp = (id: string, component: () => ReturnType<typeof LF01>, durationInFrames: number) => createElement(Composition, {id, component, ...size, durationInFrames});
registerRoot(() =>
  createElement(
    Fragment,
    null,
    comp('EDU3-LF01', LF01, LF_FRAMES.LF01),
    comp('EDU3-LF01-DOGVIEW', LF01_DOGVIEW, LF_FRAMES.LF01),
    comp('EDU3-S1-NORMAL', S1_NORMAL, LF_FRAMES.S1),
    comp('EDU3-S1-DOG', S1_DOG, LF_FRAMES.S1),
    comp('EDU3-S1-BLUE-NORMAL', S1_BLUE_NORMAL, LF_FRAMES.S1),
    comp('EDU3-S1-BLUE-DOG', S1_BLUE_DOG, LF_FRAMES.S1),
    comp('EDU3-S1-MID', S1_MID, LF_FRAMES.S1),
    comp('EDU3-LF02', LF02, LF_FRAMES.LF02),
    comp('EDU3-LF03', LF03, LF_FRAMES.LF03),
    comp('EDU3-LF03-NORMAL', LF03_NORMAL, LF_FRAMES.LF03),
    comp('EDU3-B04-BASE-NORMAL', B04_BASE_NORMAL, LF_FRAMES.LF03),
    comp('EDU3-B04-BASE-DOG', B04_BASE_DOG, LF_FRAMES.LF03),
    comp('EDU3-B04-FRAME-NORMAL', B04_FRAME_NORMAL, LF_FRAMES.LF03),
    comp('EDU3-B04-FRAME-DOG', B04_FRAME_DOG, LF_FRAMES.LF03),
  ),
);
