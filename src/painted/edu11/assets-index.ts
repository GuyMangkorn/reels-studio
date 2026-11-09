// Standalone entry for the EDU-EP11 W5.2 proof stills (kept out of src/Root.tsx and the registry, like lf-index.ts).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {ASSETS} from './assets';

const size = {width: 1080, height: 1920, fps: 30};
registerRoot(() => createElement(Fragment, null, ...Object.entries(ASSETS).map(([k, v]) => createElement(Composition, {key: k, id: `EDU11-${k}`, component: v.component, ...size, durationInFrames: v.frames}))));
