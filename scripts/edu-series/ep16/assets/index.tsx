// EDU-EP16 R1.4 Boss scene-asset comp cards (14 Nov 2026). Standalone stills entry, kept out of src/Root.tsx:
//   sh scripts/edu-series/ep16/assets/render.sh [CARD-IDS...]  -> out/ep16/assets/<ID>.png
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {CARDS} from './cards';

registerRoot(() =>
  createElement(Fragment, null, ...Object.keys(CARDS).map((k) =>
    createElement(Composition, {key: k, id: `AS-${k}`, component: CARDS[k], width: 1080, height: 1920, fps: 30, durationInFrames: 1}))),
);
