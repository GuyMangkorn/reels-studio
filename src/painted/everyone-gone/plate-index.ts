// Standalone entry for the EG-EP01-SHORT shot plates (W5.2): one composition per timeline scene, ids `EG-PL-<shot id>`, shot-local
// frames. Kept out of src/Root.tsx and the episode registry (Editor mounts `ShotPlate` from shots.tsx when integrating). Stills:
// `printf 'EG-PL-S01-B01-SH01 0 out/eg/plates/x.png\n' | node scripts/stills.mjs src/painted/everyone-gone/plate-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {EG_SHOTS, ShotPlate} from './shots';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...EG_SHOTS.map(([id, frames]) =>
      createElement(Composition, {key: id, id: `EG-PL-${id}`, component: () => createElement(ShotPlate, {id}), width: 1080, height: 1920, fps: 30, durationInFrames: frames}),
    ),
  ),
);
