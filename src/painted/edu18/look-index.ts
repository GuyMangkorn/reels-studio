// Standalone entry for the EDU-EP18-SHORT mosquito look stills (W3: LF00 model sheet, SP2 at 50 px and 843 px). Kept out of src/Root.tsx
// and the episode registry: render with `printf 'EDU18-LF00 0 out/edu18/look/LF00.png\n' | node scripts/stills.mjs src/painted/edu18/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LF00, LF00Cold, SP2A, SP2ACold, SP2B, SP2BCold} from './look';

const size = {width: 1080, height: 1920, fps: 30, durationInFrames: 60};
const comps = {LF00, 'LF00-COLD': LF00Cold, SP2A, 'SP2A-COLD': SP2ACold, SP2B, 'SP2B-COLD': SP2BCold} as const;
registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(comps).map(([k, component]) => createElement(Composition, {key: k, id: `EDU18-${k}`, component, ...size}))),
);
