// Standalone entry for the EDU-EP15-SHORT shot frames (W5.2). Kept out of src/Root.tsx and the episode registry (Editor mounts `ShotFrame` in the scene): render one frame of a
// shot (the composition length is the shot length, the frame is the shot-local L):
//   printf 'EDU15-S01-B01-SH01 48 out/edu15/build/v1/SH01_48.png\n' | node scripts/stills.mjs src/painted/edu15/build-index.ts
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {SHOT_TABLE, type ShotId} from './clock';
import {ShotFrame} from './frame';
import './shots';

const size = {width: 1080, height: 1920, fps: 30};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...SHOT_TABLE.map(([id, , len]) => createElement(Composition, {key: id, id: `EDU15-${id}`, component: () => createElement(ShotFrame, {id: id as ShotId}), ...size, durationInFrames: len})),
  ),
);
