// Standalone entry for the ZCPAINT bust model sheet (Boss pass 10, user 30 Oct 2026): pages A-E of the close-shot bust (`zcpaint/bust.ts`).
// Kept out of src/Root.tsx, the shared painted spike entry and the episode registry, like the S-P12 sheet entry.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {ZcBustA, ZcBustB, ZcBustC, ZcBustD, ZcBustE} from './ZcBustSheet';

const {width, height, fps} = FORMATS.short;
const shot = {width, height, fps, durationInFrames: 3 * fps};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZCPAINT-P10-BUST-A', component: ZcBustA, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-P10-BUST-B', component: ZcBustB, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-P10-BUST-C', component: ZcBustC, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-P10-BUST-D', component: ZcBustD, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-P10-BUST-E', component: ZcBustE, ...shot}),
  ),
);
