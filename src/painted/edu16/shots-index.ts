// Standalone entry for the EDU-EP16-SHORT shot stills (W5.3, Editor): one composition `EDU16S-<shot id>` per shot (the shot's own length), the dashed caption band on unless --props='{"guides":false}'.
// Kept out of src/Root.tsx and the episode registry: render with `sh scripts/edu-series/ep16/render-shots.sh <outdir> <shot:L ...>` (one Chrome, scripts/stills.mjs).
import {createElement, Fragment} from 'react';
import {Composition, getInputProps, registerRoot} from 'remotion';
import {SHOT_TABLE} from './clock';
import {ShotFrame} from './frame';

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...SHOT_TABLE.map(([id, , len]) => createElement(Composition, {key: id, id: `EDU16S-${id}`, component: () => createElement(ShotFrame, {id, band: true, calm: (getInputProps() as {calm?: number}).calm}), width: 1080, height: 1920, fps: 30, durationInFrames: len})),
  ),
);
