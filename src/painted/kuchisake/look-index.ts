// Standalone entry for the KSO-EP01-SHORT look stills (brief KSO-BRIEF-FILM-R1). Kept out of src/Root.tsx and the episode
// registry: render with `printf 'KSO-LF02 37 out/x.png\n' | node scripts/stills.mjs src/painted/kuchisake/look-index.ts`.
// `-RAW` variants drop the lower-frame falloff, so the caption-zone numbers can be read with and without it.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LF01, LF02, LF03} from './look';
import {LF04} from './izakaya';
import {LF05} from './darkroom';

const dur = {width: 1080, height: 1920, fps: 30};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'KSO-LF01', component: LF01, durationInFrames: 1, ...dur}),
    createElement(Composition, {id: 'KSO-LF01-RAW', component: () => createElement(LF01, {falloff: false}), durationInFrames: 1, ...dur}),
    createElement(Composition, {id: 'KSO-LF02', component: LF02, durationInFrames: 90, ...dur}),
    createElement(Composition, {id: 'KSO-LF02-RAW', component: () => createElement(LF02, {falloff: false}), durationInFrames: 90, ...dur}),
    createElement(Composition, {id: 'KSO-LF03', component: LF03, durationInFrames: 30, ...dur}),
    createElement(Composition, {id: 'KSO-LF03-RAW', component: () => createElement(LF03, {falloff: false}), durationInFrames: 30, ...dur}),
    // LF04 izakaya (S01-B02-SH01, 162 f; izakaya.tsx, narrator-back.ts) and LF05 dark room (S03-B01-SH03, 84 f; darkroom.tsx).
    createElement(Composition, {id: 'KSO-LF04', component: LF04, durationInFrames: 162, ...dur}),
    createElement(Composition, {id: 'KSO-LF04-RAW', component: () => createElement(LF04, {falloff: false}), durationInFrames: 162, ...dur}),
    createElement(Composition, {id: 'KSO-LF05', component: LF05, durationInFrames: 84, ...dur}),
    createElement(Composition, {id: 'KSO-LF05-RAW', component: () => createElement(LF05, {falloff: false}), durationInFrames: 84, ...dur}),
  ),
);
