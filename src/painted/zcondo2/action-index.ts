// Standalone entry for spike SPK-ZC2-02 (full-body action test of the LK-S look). Kept out of src/Root.tsx and the episode registry;
// render with `node scripts/zombie-condo2/render-action.mjs ZC2-ACT-A [--stills=0,15,30]`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {ActA, ActB, ActC, ActD} from './action-test';

const dur = {width: 1080, height: 1920, fps: 30, durationInFrames: 90};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZC2-ACT-A', component: ActA, ...dur}),
    createElement(Composition, {id: 'ZC2-ACT-B', component: ActB, ...dur}),
    createElement(Composition, {id: 'ZC2-ACT-C', component: ActC, ...dur}),
    createElement(Composition, {id: 'ZC2-ACT-D', component: ActD, ...dur}),
  ),
);
