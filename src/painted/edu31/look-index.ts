// Standalone entry for the EDU-EP31-SHORT W3 look frames (Film, 2026-11-21). Kept out of src/Root.tsx and the episode registry; one
// BrushCanvas per page. Render on one Chrome: sh scripts/edu-series/ep31/short/render-looks.sh <version> [IDs]
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOKS} from './look';

registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(LOOKS).map(([k, component]) =>
    createElement(Composition, {key: k, id: `EDU31-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1}))),
);
