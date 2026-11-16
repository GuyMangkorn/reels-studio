// Standalone stills entry for the EDU-EP18-SHORT W5 Boss QA cards and the post photo (Boss, 16 Nov 2026). Kept out of src/Root.tsx and the
// episode registry; one PaintedStack per page.  sh scripts/edu-series/ep18/short/render-w5.sh <version> [IDS]
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {PostPhoto} from './post-photo';
import {W5_CARDS} from './w5-cards';

registerRoot(() =>
  createElement(Fragment, null,
    ...W5_CARDS.map((k) => createElement(Composition, {key: k.id, id: k.id, component: k.C, width: 1080, height: 1920, fps: 30, durationInFrames: k.dur})),
    createElement(Composition, {key: 'photo', id: 'EDU18-POST-PHOTO', component: PostPhoto, width: 1080, height: 1920, fps: 30, durationInFrames: 1})),
);
