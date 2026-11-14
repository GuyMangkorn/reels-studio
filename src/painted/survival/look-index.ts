// Standalone entry for the EDU-EP16..18 survival-series look stills (W3, Film). Kept out of src/Root.tsx and the episode registry:
// render with `sh scripts/edu-series/ep16/render-looks.sh <version> [IDS]` (one Chrome, scripts/stills.mjs).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOKS_A} from './look';
import {LOOKS_B} from './look-b';
import {LOOKS_C} from './look-assets';
import {LOOKS_D} from './look-batch2';

const LOOKS = {...LOOKS_A, ...LOOKS_B, ...LOOKS_C, ...LOOKS_D};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(LOOKS).map(([k, component]) =>
      createElement(Composition, {key: k, id: `SURV-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
  ),
);
