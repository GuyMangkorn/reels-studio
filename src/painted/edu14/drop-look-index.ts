// Standalone entry for the EDU-EP14-SHORT SP1 drop look stills (Film, W3). Kept out of src/Root.tsx and the episode registry:
//   printf 'EDU14-DROP-PENDANT 0 out/edu14/sp1/v1/pendant.png\n' | node scripts/stills.mjs src/painted/edu14/drop-look-index.ts
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {DROP_STILLS} from './drop-look';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(DROP_STILLS).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU14-DROP-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
  ),
);
