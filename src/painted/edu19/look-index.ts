// Standalone entry for the EDU-EP19-SHORT look frames (Boss W3.1, W3.3). Kept out of src/Root.tsx and the episode registry. Render on one Chrome:
//   printf 'EDU19-LF01 0 out/edu19-lf/LF01.png\n' | node scripts/stills.mjs src/painted/edu19/look-index.ts [--props='{"guides":false}']
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOKS} from './look';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(LOOKS).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU19-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
  ),
);
