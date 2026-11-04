// Standalone entry for the ZCONDO2-SHORT-TH kit-look frames (W3.1, brief VB-ZC2-SHORT-R2). Not part of src/Root.tsx or the episode
// registry. Render: printf 'ZC2K-SH05 0 out/zc2kit/SH05.png\n' | node scripts/stills.mjs src/painted/zc2kit/index.ts
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {ZC2K_SH02, ZC2K_SH03, ZC2K_SH04, ZC2K_SH05} from './frames';

const dur = {width: 1080, height: 1920, fps: 30, durationInFrames: 30};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZC2K-SH05', component: ZC2K_SH05, ...dur}),
    createElement(Composition, {id: 'ZC2K-SH03', component: ZC2K_SH03, ...dur}),
    createElement(Composition, {id: 'ZC2K-SH04', component: ZC2K_SH04, ...dur}),
    createElement(Composition, {id: 'ZC2K-SH02', component: ZC2K_SH02, ...dur}),
  ),
);
