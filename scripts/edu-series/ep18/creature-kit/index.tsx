// EDU-EP18 creature comp cards (Boss, 15 Nov 2026, pre-W3 pass A). Standalone stills entry, kept out of src/Root.tsx and the registry:
//   sh scripts/edu-series/ep18/creature-kit/render.sh v1 [GROUP|IDS]      -> out/ep18/kit/<version>/<ID>.png
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {CARDS} from './cards';

registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(CARDS).map(([k, component]) =>
    createElement(Composition, {key: k, id: `KIT-EP18-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1}))),
);
