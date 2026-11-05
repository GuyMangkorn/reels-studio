// Standalone entry for the EDU-EP02-SHORT shot plates (Boss W5.2), kept out of src/Root.tsx and the episode registry:
// `printf 'EDU2-S01-B01-SH02 29 out/edu02/shots/b01sh02_f29.png\n' | node scripts/stills.mjs src/painted/edu02/shots-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {EDU2_SHOTS, ShotPlate} from './shots';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...EDU2_SHOTS.map(([id, n]) =>
      createElement(Composition, {key: id, id: `EDU2-${id}`, component: () => createElement(ShotPlate, {id}), width: 1080, height: 1920, fps: 30, durationInFrames: n}),
    ),
  ),
);
