// Standalone entry for the EG-EP01-SHORT look stills (W3.1). Kept out of src/Root.tsx and the episode registry: render with
// `printf 'EG-LF01 0 out/eg/look/LF01.png\n' | node scripts/stills.mjs src/painted/everyone-gone/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LF01, LF01Reach, LF01Wave, LF02, LF03, LF04, LF05, LF05Glass, LF05Start} from './look';

const dur = {width: 1080, height: 1920, fps: 30, durationInFrames: 120};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'EG-LF01', component: LF01, ...dur}),
    createElement(Composition, {id: 'EG-LF01-WAVE', component: LF01Wave, ...dur}),
    createElement(Composition, {id: 'EG-LF01-REACH', component: LF01Reach, ...dur}),
    createElement(Composition, {id: 'EG-LF02', component: LF02, ...dur}),
    createElement(Composition, {id: 'EG-LF03', component: LF03, ...dur}),
    createElement(Composition, {id: 'EG-LF04', component: LF04, ...dur}),
    createElement(Composition, {id: 'EG-LF05', component: LF05, ...dur}),
    createElement(Composition, {id: 'EG-LF05-START', component: LF05Start, ...dur}),
    createElement(Composition, {id: 'EG-LF05-GLASS', component: LF05Glass, ...dur}),
  ),
);
