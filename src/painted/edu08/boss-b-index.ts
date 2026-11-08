// Standalone entry for the EDU-EP08-SHORT Boss pass B proof stills (kept out of src/Root.tsx and the registry, like look-index.ts).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import * as B from './boss-b';

const size = {width: 1080, height: 1920, fps: 30};
const comps = B as unknown as Record<string, React.FC>;
registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.keys(B.NFRAMES).map((k) =>
      createElement(Composition, {key: k, id: `EDU8-${k}`, component: comps[k], ...size, durationInFrames: B.NFRAMES[k as keyof typeof B.NFRAMES]})),
  ),
);
