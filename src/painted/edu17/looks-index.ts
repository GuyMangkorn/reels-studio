// Standalone entry for the EDU-EP17-SHORT W3 finished look frames LF01-LF07 (Film). Kept out of src/Root.tsx and the episode registry: render with
// `sh scripts/edu-series/ep17/render-looks.sh <version> [IDS]` (one Chrome, scripts/stills.mjs).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOK_STILLS} from './looks';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(LOOK_STILLS).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU17-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
  ),
);
