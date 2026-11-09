// Standalone entry for the EDU-EP13-SHORT look stills (W3.1). Kept out of src/Root.tsx and the episode registry (render.mjs bundles only the
// registry): render with `printf 'EDU13-LF01 0 out/edu13/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu13/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {F1, F2, F3, F3b, F4, F5, F6, LF01, LF02, LF03, LF04, LF04b, LF_FRAMES} from './look';

const size = {width: 1080, height: 1920, fps: 30};
const comps = {LF01, LF02, LF03, LF04, LF04b, F1, F2, F3, F3b, F4, F5, F6} as const;
registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(comps).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU13-${k}`, component, ...size, durationInFrames: LF_FRAMES[k as keyof typeof LF_FRAMES]})),
  ),
);
