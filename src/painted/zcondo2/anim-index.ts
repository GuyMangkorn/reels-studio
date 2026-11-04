// Standalone entry for spike SPK-ZC2-01 (character animation test of the LK-S look). Kept out of src/Root.tsx and the episode registry:
// `node scripts/render.mjs ZC2-ANIM --gl=angle` with the entry set as in the spike notes, or stills via scripts/stills.mjs.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {ZC2Anim, ZC2AnimBoil} from './anim-test';

const dur = {width: 1080, height: 1920, fps: 30, durationInFrames: 120};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZC2-ANIM', component: ZC2Anim, ...dur}),
    createElement(Composition, {id: 'ZC2-ANIM-BOIL', component: ZC2AnimBoil, ...dur}),
  ),
);
