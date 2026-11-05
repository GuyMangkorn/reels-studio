// Standalone entry for the EDU-EP02-SHORT look stills (W3.1). Kept out of src/Root.tsx and the episode registry (render.mjs
// bundles only the registry): render with `printf 'EDU2-LF01 24 out/edu02/look/LF01.png\n' | node scripts/stills.mjs src/painted/edu02/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LF01, LF02, LF03, LF_FRAMES, SPK_CELL} from './look';

const size = {width: 1080, height: 1920, fps: 30};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'EDU2-LF01', component: LF01, ...size, durationInFrames: LF_FRAMES.LF01}),
    createElement(Composition, {id: 'EDU2-LF02', component: LF02, ...size, durationInFrames: LF_FRAMES.LF02}),
    createElement(Composition, {id: 'EDU2-LF03', component: LF03, ...size, durationInFrames: LF_FRAMES.LF03}),
    createElement(Composition, {id: 'EDU2-SPK-CELL', component: SPK_CELL, ...size, durationInFrames: 30}),
  ),
);
