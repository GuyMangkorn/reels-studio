// Standalone entry for the EDU-EP16-SHORT look stills (W3, Film). Kept out of src/Root.tsx and the episode registry (render.mjs bundles only the
// registry). Render on one Chrome: printf 'EDU16-<ID> <frame> <out.png>\n' | node scripts/stills.mjs src/painted/edu16/look-index.ts [--props='{"guides":false}']
// Group 1 (look.tsx): thought-space, monster, strike, forest. Group 2 (look-roof.tsx): roof set and woman.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOK_PAINT, LOOKS} from './look';
import {ROOF_LOOK_FRAMES, ROOF_LOOKS} from './look-roof';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(LOOKS).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU16-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: LOOK_PAINT[k].frames})),
    ...Object.entries(ROOF_LOOKS).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU16-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: ROOF_LOOK_FRAMES[k]})),
  ),
);
