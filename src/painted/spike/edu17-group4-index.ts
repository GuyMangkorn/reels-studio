// Standalone entry for the EDU-EP17 group 4 check stills (Boss, 2026-11-12): SET-STADIUM16 N8 (SH17-SH20) and instrument KB N9 (SH21).
// Kept out of src/Root.tsx and the episode registry. Render on one Chrome:
//   printf 'EDU17-G4-SH18-f25 0 out/edu17/g4/SH18-f25.png\n' | node scripts/stills.mjs src/painted/spike/edu17-group4-index.ts --props='{"guides":false}'
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {G4, G4_COMPONENTS} from './Edu17Group4';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(G4_COMPONENTS).map(([k, component]) => createElement(Composition, {key: k, id: `EDU17-G4-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: G4[k].len})),
  ),
);
