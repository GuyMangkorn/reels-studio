// Standalone entry for the EDU-EP01-SHORT look stills (W3.1). Kept out of src/Root.tsx and the episode registry: render with
// `printf 'EDU1-LF01 0 out/edu01/look/LF01.png\n' | node scripts/stills.mjs src/painted/edu01/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LF01, LF02, LF03, LF04, LF05} from './look';

const dur = {width: 1080, height: 1920, fps: 30, durationInFrames: 120};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'EDU1-LF01', component: LF01, ...dur}),
    createElement(Composition, {id: 'EDU1-LF02', component: LF02, ...dur}),
    createElement(Composition, {id: 'EDU1-LF03', component: LF03, ...dur}),
    createElement(Composition, {id: 'EDU1-LF04', component: LF04, ...dur}),
    createElement(Composition, {id: 'EDU1-LF05', component: LF05, ...dur}),
  ),
);
