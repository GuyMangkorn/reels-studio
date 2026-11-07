// Standalone entry for the EDU-EP06-SHORT look stills (W3). Kept out of src/Root.tsx and the episode registry (render.mjs bundles
// only the registry): render with `printf 'EDU6-LF01 27 out/edu06/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu06/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {CF1, CF2, CF3, CFa, LF01, LF02, LF03, LF04, LF_FRAMES} from './look';

const size = {width: 1080, height: 1920, fps: 30};
const comps = {LF01, LF02, LF03, LF04, CF1, CF2, CF3, CFa} as const;
registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(comps).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU6-${k}`, component, ...size, durationInFrames: LF_FRAMES[k as keyof typeof LF_FRAMES]})),
  ),
);
