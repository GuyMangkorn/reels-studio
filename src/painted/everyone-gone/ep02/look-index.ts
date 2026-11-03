// Standalone entry for the EG-EP02-SHORT look stills (W3.1). Kept out of src/Root.tsx and the episode registry: render with
// `printf 'EG2-LF01 0 out/eg2/look/LF01.png\n' | node scripts/stills.mjs src/painted/everyone-gone/ep02/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LF01, LF02, LF03, LF04, LF05} from './look';

const dur = {width: 1080, height: 1920, fps: 30, durationInFrames: 120};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'EG2-LF01', component: LF01, ...dur}),
    createElement(Composition, {id: 'EG2-LF02', component: LF02, ...dur}),
    createElement(Composition, {id: 'EG2-LF03', component: LF03, ...dur}),
    createElement(Composition, {id: 'EG2-LF04', component: LF04, ...dur}),
    createElement(Composition, {id: 'EG2-LF05', component: LF05, ...dur}),
  ),
);
