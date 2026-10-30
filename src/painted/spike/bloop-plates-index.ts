// Standalone entry for the BLOOP-EP01-SHORT plate QA (DEP01): one composition per plate (`BLOOP-PLATE-SHnn`, its sheet
// frame count) and the QA-only sequence `BLOOP-QA-SEQUENCE` (SceneRenderer, A_fade with no hold or fade). Kept out of
// src/Root.tsx and the episode registry; render with scripts/the-bloop/stills.mjs.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {SceneRenderer} from '../../scenes/SceneRenderer';
import {timelineFrames} from '../../scenes/timeline';
import {BLOOP_QA_ID, bloopQaTimeline, BloopPlate, PLATE_FRAMES} from './BloopPlates';

const {width, height, fps} = FORMATS.short;

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.entries(PLATE_FRAMES).map(([plate, frames]) =>
      createElement(Composition, {
        key: plate,
        id: `BLOOP-PLATE-${plate.replace('bloop-', '').toUpperCase()}`,
        width, height, fps, durationInFrames: frames,
        component: () => createElement(BloopPlate, {id: plate, note: 'BLOOP-SHEETS-R3 · DEP01'}),
      }),
    ),
    createElement(Composition, {
      key: 'qa',
      id: BLOOP_QA_ID,
      width, height, fps, durationInFrames: timelineFrames(bloopQaTimeline, fps),
      component: () => createElement(SceneRenderer, {timeline: bloopQaTimeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, chrome: {channelLabel: false, progressBar: false}}),
    }),
  ),
);
