// Standalone entry for the ZCONDO2-SHORT-TH look thumbnails (W3.1, brief VB-ZC2-SHORT-R1.1). Kept out of src/Root.tsx and
// the episode registry: render with `printf 'ZC2-LKA 0 out/zc2/look/LKA.png\n' | node scripts/stills.mjs src/painted/zcondo2/look-index.ts`.
import React, {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LKA, LKB, LKC, LKM, LKS} from './look';
import * as LF from './frames';

const dur = {width: 1080, height: 1920, fps: 30, durationInFrames: 30};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZC2-LKA', component: LKA, ...dur}),
    createElement(Composition, {id: 'ZC2-LKB', component: LKB, ...dur}),
    createElement(Composition, {id: 'ZC2-LKC', component: LKC, ...dur}),
    createElement(Composition, {id: 'ZC2-LKM', component: LKM, ...dur}),
    createElement(Composition, {id: 'ZC2-LKS', component: LKS, ...dur}),
    // W3.1 look frames in LK-S (frames.tsx), one per location.
    ...Object.entries(LF).filter(([k]) => k.startsWith('LF_')).map(([k, c]) =>
      createElement(Composition, {key: k, id: `ZC2-${k.replace('_', '-')}`, component: c as React.FC, ...dur})),
  ),
);
