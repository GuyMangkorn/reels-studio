// Standalone entry for the EDU-EP17-SHORT shot frames (Boss W5). Kept out of src/Root.tsx and the episode composition: one composition per shot plate,
// `EDU17-<shot id>`, whose length is the shot length and whose frame is the shot-local L. Render stills on one Chrome:
//   printf 'EDU17-S01-B01-SH01 56 out/edu17/build/v1/B01-SH01_f56.png\n' | node scripts/stills.mjs src/painted/edu17/build-index.ts
// or `sh scripts/edu-series/ep17/render-shots.sh <version> <SHOT:L ...>`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot, useCurrentFrame} from 'remotion';
import {paintedShots} from '../registry';
import {FPS, SHOT_TABLE} from './clock';
import {Still} from './frame';
import {edu17PlateId, RECON} from './stage';

const ShotStill = ({id}: {id: string}) => {
  const L = useCurrentFrame(), s = paintedShots[id];
  const ctx = {tl: L / FPS, width: 1080, height: 1920};
  return createElement(Still, {paint: (p) => s.paint(p, ctx), paper: s.paper, recon: RECON[id], overlay: s.Overlay ? createElement(s.Overlay, {...ctx, camera: s.camera(ctx.tl), opacity: 1}) : undefined});
};

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...SHOT_TABLE.map(([id, , len]) => createElement(Composition, {key: id, id: edu17PlateId(id), component: () => createElement(ShotStill, {id: edu17PlateId(id)}), width: 1080, height: 1920, fps: FPS, durationInFrames: len + 3})),
  ),
);
