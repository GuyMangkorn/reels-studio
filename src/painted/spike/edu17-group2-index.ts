// Standalone entry for the EDU-EP17 group 2 check stills (Boss, 2026-11-12): street N7, crowd-heads N6, squeezed N12 (SH05 @ +15 = LF02's shot, SH02, SH10, SH11, SH12, SH15) and person-top N5 (SH04).
// Kept out of src/Root.tsx and the episode registry. Render on one Chrome:
//   printf 'EDU17-G2-SH05-LF02 0 out/edu17/g2/SH05-LF02.png\n' | node scripts/stills.mjs src/painted/spike/edu17-group2-index.ts --props='{"guides":false}'
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {G2, G2_COMPONENTS} from './Edu17Group2';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(G2_COMPONENTS).map(([k, component]) => createElement(Composition, {key: k, id: `EDU17-G2-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: G2[k].len})),
  ),
);
