// EDU-EP16 Film R13 look frames (dinosaur presence pass, 14 Nov 2026). Standalone stills entry, kept out of src/Root.tsx and the registry:
//   printf 'R13-AS-BEASTS 0 out/ep16/r13/looks/AS-BEASTS.png\n' | node scripts/stills.mjs scripts/edu-series/ep16/r13-looks/index.tsx
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {LOOKS_R13} from './looks';

registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(LOOKS_R13).map(([k, component]) =>
    createElement(Composition, {key: k, id: `R13-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1}))),
);
