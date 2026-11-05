// Standalone entry for the SET45 spike (Set45.tsx), kept apart from parallax-index.ts:
// `printf 'SET45-BACK 0 out/set45/b0.png\n' | node scripts/stills.mjs src/painted/spike/set45-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {SET45_FRAMES, Set45Back, Set45Front, Set45Side} from './Set45';

const dur = {width: 1080, height: 1920, fps: 30, durationInFrames: SET45_FRAMES};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'SET45-BACK', component: Set45Back, ...dur}),
    createElement(Composition, {id: 'SET45-FRONT', component: Set45Front, ...dur}),
    createElement(Composition, {id: 'SET45-SIDE', component: Set45Side, ...dur}),
  ),
);
