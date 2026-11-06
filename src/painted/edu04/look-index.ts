// Standalone entry for the EDU-EP04-SHORT look stills (W3). Kept out of src/Root.tsx and the episode registry (render.mjs bundles
// only the registry): render with `printf 'EDU4-LF01 30 out/edu04/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu04/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {EX01, LF01, LF02, LF03, LF04, LF_FRAMES} from './look';

const size = {width: 1080, height: 1920, fps: 30};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'EDU4-LF01', component: LF01, ...size, durationInFrames: LF_FRAMES.LF01}),
    createElement(Composition, {id: 'EDU4-LF02', component: LF02, ...size, durationInFrames: LF_FRAMES.LF02}),
    createElement(Composition, {id: 'EDU4-LF03', component: LF03, ...size, durationInFrames: LF_FRAMES.LF03}),
    createElement(Composition, {id: 'EDU4-EX01', component: EX01, ...size, durationInFrames: LF_FRAMES.EX01}),
    createElement(Composition, {id: 'EDU4-LF04', component: LF04, ...size, durationInFrames: LF_FRAMES.LF04}),
  ),
);
