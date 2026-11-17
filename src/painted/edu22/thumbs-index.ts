// Standalone entry for the EDU-EP22-SHORT W3 thumbnails and asset checks (Boss W3.1). Kept out of src/Root.tsx and the episode registry; render on
// one Chrome: sh scripts/edu-series/ep22/short/render-thumbs.sh <version> [IDS]  (scripts/stills.mjs; GUIDES=0 for the caption-zone measure)
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {THUMB_STILLS} from './thumbs';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(THUMB_STILLS).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU22-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
  ),
);
