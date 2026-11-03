// Standalone entry for the EG-EP02-SHORT shot-set stills (Boss W5.2): every SS-R2.1 shot as its own composition. Kept out of
// src/Root.tsx and the episode registry. Render with
// `printf 'EG2-S01-B01-SH01 0 out/eg2/assets/S01-B01-SH01_f0.png\n' | node scripts/stills.mjs src/painted/everyone-gone/ep02/assets-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {EG2_SHOTS, ShotPlate, type Eg2ShotId} from './shots';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...EG2_SHOTS.map(([id, n]) =>
      createElement(Composition, {
        key: id, id: `EG2-${id}`, component: () => createElement(ShotPlate, {id: id as Eg2ShotId}), width: 1080, height: 1920, fps: 30, durationInFrames: n,
      }),
    ),
  ),
);
