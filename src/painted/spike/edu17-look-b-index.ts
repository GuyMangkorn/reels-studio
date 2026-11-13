// Standalone entry for the EDU-EP17-SHORT look stills, set B (W3, Film): LF02, LF04, LF05A/B, LF06 thumbnails and finals, and the SH11 head-read check.
// Kept out of src/Root.tsx and the episode registry. Render on one Chrome:
//   printf 'EDU17-LB-LF02-A 0 out/edu17/look-b/LF02-A.png\n' | node scripts/stills.mjs src/painted/spike/edu17-look-b-index.ts [--props='{"guides":false}']
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOK_B_COMPONENTS} from '../edu17/look-b-frames';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(LOOK_B_COMPONENTS).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU17-LB-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
  ),
);
