// Standalone entry for the EDU-EP05 W5.2 element check stills (kept out of src/Root.tsx and the registry like look-index.ts).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {CHECK_FRAMES, CHK_EDGE} from './check';

const size = {width: 1080, height: 1920, fps: 30};
const comps = {EDGE: CHK_EDGE} as const;
registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(comps).map(([k, component]) => createElement(Composition, {key: k, id: `EDU5-CHK-${k}`, component, ...size, durationInFrames: CHECK_FRAMES[k as keyof typeof CHECK_FRAMES]}))),
);
