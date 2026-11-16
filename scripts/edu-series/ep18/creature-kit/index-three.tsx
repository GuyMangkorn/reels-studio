// EDU-EP18 three.js hippo spike stills entry (Boss, 15 Nov 2026, AS-HIPPO3D-SPIKE). Standalone, kept out of src/Root.tsx and the registry:
//   sh scripts/edu-series/ep18/creature-kit/render-three.sh <version> [IDS]   -> out/ep18/kit/<version>/HIPPO3D-<ID>.png
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {CARDS_THREE, YAWN_CLIP_FRAMES, YawnClip} from './cards-three';

registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(CARDS_THREE).map(([k, component]) =>
    createElement(Composition, {key: k, id: `KIT-EP18-HIPPO3D-${k}`, component, width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
    createElement(Composition, {key: 'clip', id: 'KIT-EP18-HIPPO3D-YAWN-CLIP', component: YawnClip, width: 1080, height: 1920, fps: 30, durationInFrames: YAWN_CLIP_FRAMES})),
);
