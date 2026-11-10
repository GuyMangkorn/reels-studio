// Standalone entry for the EDU-EP15-SHORT look stills (W3, Film). Kept out of src/Root.tsx and the episode registry (render.mjs bundles only the
// registry): render with `sh scripts/edu-series/ep15/render-looks.sh <version> [IDS]` (one Chrome, scripts/stills.mjs).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOKS} from './look';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(LOOKS).map(([k, component]) =>
      createElement(Composition, {key: k, id: `EDU15-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
  ),
);
