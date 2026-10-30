// Standalone entry for the ZCPAINT Film feasibility spike (VB-ZCPAINT-SHORT-R1). Kept out of src/Root.tsx, the shared
// painted spike entry and the episode registry: integration is Boss's (scripts/zombie-condo-paint/delivery.md).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {ZcPaintB01, ZcPaintB02} from './ZcPaint';

const {width, height, fps} = FORMATS.short;
const shot = {width, height, fps, durationInFrames: 4 * fps};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZCPAINT-SPIKE-B01', component: ZcPaintB01, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-SPIKE-B02S', component: ZcPaintB02, ...shot}),
  ),
);
