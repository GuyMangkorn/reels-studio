// Standalone entry for the ZCPAINT model sheet S-P01 (calibration, standing, seated, POV hands).
// Kept out of src/Root.tsx, the shared painted spike entry and the episode registry.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {ZcModelA, ZcModelB, ZcModelC} from './ZcModelSheet';

const {width, height, fps} = FORMATS.short;
const shot = {width, height, fps, durationInFrames: 3 * fps};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZCPAINT-MODEL-A', component: ZcModelA, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-MODEL-B', component: ZcModelB, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-MODEL-C', component: ZcModelC, ...shot}),
  ),
);
