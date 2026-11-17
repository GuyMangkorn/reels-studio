// Standalone entry for the EDU-EP24-SHORT W3 look frames LF01-LF04 (Film, 2026-11-17). Kept out of src/Root.tsx and the episode registry;
// one BrushCanvas per page. Render on one Chrome: sh scripts/edu-series/ep24/short/render-looks.sh <version> [LF01 LF02 LF03 LF04]
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOKS} from './look';

registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(LOOKS).map(([k, component]) =>
    createElement(Composition, {key: k, id: `EDU24-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1}))),
);
