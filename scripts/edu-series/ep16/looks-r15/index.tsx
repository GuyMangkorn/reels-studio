// EDU-EP16 SHEET-R1.5b look frames (Film, 14 Nov 2026). Standalone stills entry, kept out of src/Root.tsx:
//   sh scripts/edu-series/ep16/looks-r15/render.sh [IDS...]  -> out/ep16/r15/looks/<ID>.png
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FRAMES} from './frames';

registerRoot(() =>
  createElement(Fragment, null, ...Object.keys(FRAMES).map((k) =>
    createElement(Composition, {key: k, id: k, component: FRAMES[k], width: 1080, height: 1920, fps: 30, durationInFrames: 1}))),
);
