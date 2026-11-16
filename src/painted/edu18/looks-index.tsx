// Standalone stills entry for the EDU-EP18-SHORT W3 look frames (Film). Kept out of src/Root.tsx and the episode registry; one PaintedStack per page.
//   sh scripts/edu-series/ep18/short/render-looks.sh <version> [IDS]   -> out/edu18/looks/<version>/<ID>.png
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOKS} from './looks';

registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(LOOKS).map(([k, l]) =>
    createElement(Composition, {key: k, id: `EDU18-${k}`, component: l.C, width: 1080, height: 1920, fps: 30, durationInFrames: 1}))),
);
