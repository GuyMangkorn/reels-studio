// Standalone entry for the EDU-EP21-SHORT W3.1 look frames (Film, 2026-11-16). Kept out of src/Root.tsx and the episode registry; one
// BrushCanvas per page. Render on one Chrome: sh scripts/edu-series/ep21/short/render-looks.sh <version> [LF01 LF02 LF03]
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOKS} from './look';

registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(LOOKS).map(([k, component]) =>
    createElement(Composition, {key: k, id: `EDU21-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1}))),
);
