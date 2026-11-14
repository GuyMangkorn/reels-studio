// EDU-EP16 creature kit comp cards (Boss, 14 Nov 2026). Standalone stills entry, kept out of src/Root.tsx and the registry:
//   sh scripts/edu-series/ep16/creature-kit/render.sh v1 [IDS]      -> out/ep16/kit/<version>/<ID>.png
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {CARDS} from './cards';

registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(CARDS).map(([k, component]) =>
    createElement(Composition, {key: k, id: `KIT-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1}))),
);
