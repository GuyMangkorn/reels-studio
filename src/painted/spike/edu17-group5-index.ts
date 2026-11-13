// Standalone entry for the EDU-EP17 group 5 check stills (Boss, 2026-11-12): N10 atom + loupe + speck ring, N11 balance, N13 phone map screen.
// Kept out of src/Root.tsx and the episode registry. Render on one Chrome:
//   printf 'EDU17-G5-SH14-f30 0 out/edu17/g5/SH14-f30.png\n' | node scripts/stills.mjs src/painted/spike/edu17-group5-index.ts --props='{"guides":false}'
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {G5, G5_COMPONENTS} from './Edu17Group5';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(G5_COMPONENTS).map(([k, component]) => createElement(Composition, {key: k, id: `EDU17-G5-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: G5[k].len})),
  ),
);
