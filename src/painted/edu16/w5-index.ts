// Standalone entry for the EDU-EP16 W5.2 asset stills (Boss): flight cycle, poses, props, season dissolves, aerial move, mob distance.
// Kept out of src/Root.tsx and the episode registry. Render: sh scripts/edu-series/ep16/render-w5.sh <version> [IDS]
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {W5} from './w5-look';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(W5).map(([k, component]) => createElement(Composition, {key: k, id: `EDU16W5-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
  ),
);
