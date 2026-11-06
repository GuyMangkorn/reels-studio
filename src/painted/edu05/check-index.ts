// Standalone entry for the EDU-EP05 W5.2 element check stills (kept out of src/Root.tsx and the registry like look-index.ts).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {CHECK_FRAMES, CHK_ANTW, CHK_DRIFT, CHK_FAC, CHK_FX, CHK_SPECK, CHK_DROP2, CHK_DROP3, CHK_DROP4, CHK_EDGE, CHK_POSES, CHK_CRUMB} from './check';

const size = {width: 1080, height: 1920, fps: 30};
const comps = {EDGE: CHK_EDGE, DROP2: CHK_DROP2, DROP3: CHK_DROP3, DROP4: CHK_DROP4, ANTW: CHK_ANTW, FX: CHK_FX, FAC: CHK_FAC, SPECK: CHK_SPECK, DRIFT: CHK_DRIFT, POSES: CHK_POSES, CRUMB: CHK_CRUMB} as const;
registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(comps).map(([k, component]) => createElement(Composition, {key: k, id: `EDU5-CHK-${k}`, component, ...size, durationInFrames: CHECK_FRAMES[k as keyof typeof CHECK_FRAMES]}))),
);
