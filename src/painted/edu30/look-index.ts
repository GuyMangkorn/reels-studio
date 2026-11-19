// Standalone entry for the EDU-EP30-SHORT W3 look frames, thumbnails and KP-EMU stills (Film, 2026-11-19). Kept out of src/Root.tsx and the
// episode registry; one BrushCanvas per page. Render on one Chrome: sh scripts/edu-series/ep30/short/render-looks.sh <version> [IDs]
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOKS} from './look';

registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(LOOKS).map(([k, component]) =>
    createElement(Composition, {key: k, id: `EDU30-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1}))),
);
