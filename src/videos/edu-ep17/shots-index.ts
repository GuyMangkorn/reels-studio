// Standalone entry for the EDU-EP17 shot stills (Editor, W5.3 Draft): one composition per shot, `EDU17S-<shot id>`, the Remotion frame is the shot-local frame. Kept out of src/Root.tsx.
//   printf 'EDU17S-S01-B01-SH05 15 out/qa/edu-ep17/x.png\n' | node scripts/stills.mjs src/videos/edu-ep17/shots-index.ts --props='{"guides":false}'
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {SHOT_TABLE} from './clock';
import {ShotFrame} from './frame';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...SHOT_TABLE.map(([id, , len]) => createElement(Composition, {key: id, id: `EDU17S-${id}`, component: () => createElement(ShotFrame, {id, band: true}), width: 1080, height: 1920, fps: 30, durationInFrames: len})),
  ),
);
