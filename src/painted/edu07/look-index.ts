// Standalone entry for the EDU-EP07-SHORT look stills (W3). Kept out of src/Root.tsx and the episode registry (render.mjs bundles only the
// registry): render with `printf 'EDU7-LF01 0 out/edu07/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu07/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LF01, LF01Poc, LF01Wc, LF02, LF03, LF04, LF_FRAMES} from './look';

const size = {width: 1080, height: 1920, fps: 30};
const comps = {LF01, LF01Poc, LF01Wc, LF02, LF03, LF04} as const;
registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(comps).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU7-${k}`, component, ...size, durationInFrames: LF_FRAMES[k as keyof typeof LF_FRAMES]})),
  ),
);
