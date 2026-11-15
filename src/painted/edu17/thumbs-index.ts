// Standalone entry for the EDU-EP17-SHORT W3 thumbnails (Film). Kept out of src/Root.tsx and the episode registry: render with
// `sh scripts/edu-series/ep17/render-thumbs.sh <version> [IDS]` (one Chrome, scripts/stills.mjs).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {THUMB_STILLS} from './thumbs';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(THUMB_STILLS).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU17-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
  ),
);
