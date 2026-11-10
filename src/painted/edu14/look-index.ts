// Standalone entry for the EDU-EP14-SHORT look stills (W3). Kept out of src/Root.tsx and the episode registry (render.mjs bundles only the
// registry): render with `printf 'EDU14-LF01 0 out/edu14/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu14/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LF01, LF02, LF02U, LF03, LF04, LF05, LF_FRAMES} from './look';

const size = {width: 1080, height: 1920, fps: 30};
const comps = {LF01, LF02, LF02U, LF03, LF04, LF05} as const;
registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(comps).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU14-${k}`, component, ...size, durationInFrames: LF_FRAMES[k as keyof typeof LF_FRAMES]})),
  ),
);
