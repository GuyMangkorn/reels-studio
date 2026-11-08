// Standalone entry for the EDU-EP08-SHORT look stills (W3). Kept out of src/Root.tsx and the episode registry (render.mjs bundles only the
// registry): render with `printf 'EDU8-LF01 0 out/edu08/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu08/look-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import * as L from './look';

const size = {width: 1080, height: 1920, fps: 30};
const comps = L as unknown as Record<string, React.FC>;
registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.keys(L.LF_FRAMES).map((k) =>
      createElement(Composition, {key: k, id: `EDU8-${k}`, component: comps[k], ...size, durationInFrames: L.LF_FRAMES[k as keyof typeof L.LF_FRAMES]})),
  ),
);
