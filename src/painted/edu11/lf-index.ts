// Standalone entry for the EDU-EP11-SHORT look frames LF01-LF05 (Boss, 2026-11-09). Kept out of src/Root.tsx and the episode registry:
// printf 'EDU11-LF01 0 out/edu11/lf/LF01.png\n' | node scripts/stills.mjs src/painted/edu11/lf-index.ts --gl=angle
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LFS} from './lf';

const size = {width: 1080, height: 1920, fps: 30};
registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(LFS).map(([id, s]) => createElement(Composition, {key: id, id: `EDU11-${id}`, component: s.component, ...size, durationInFrames: s.frames}))),
);
