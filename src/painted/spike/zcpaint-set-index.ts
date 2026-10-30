// Standalone entry for the ZCPAINT set look-check sheets (S-P03) and the grip review (hands on the cabinet lip).
// Kept out of src/Root.tsx, the shared painted spike entry and the episode registry.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {ZcPovB02, ZcGrip, ZcSetB04, ZcSetB04Cap, ZcSetB04Diagram, ZcSetB06, ZcSetB07, ZcSetB08, ZcSetB10} from './ZcSetSheet';

const {width, height, fps} = FORMATS.short;
const dur = (n: number) => ({width, height, fps, durationInFrames: n});
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZCPAINT-SET-B04-SH01', component: ZcSetB04, ...dur(90)}),
    createElement(Composition, {id: 'ZCPAINT-SET-B04-SH01-CAP', component: ZcSetB04Cap, ...dur(90)}),
    createElement(Composition, {id: 'ZCPAINT-SET-B04-SH02-TH', component: ZcSetB04Diagram, ...dur(210)}),
    createElement(Composition, {id: 'ZCPAINT-SET-B06-SH01', component: ZcSetB06, ...dur(90)}),
    createElement(Composition, {id: 'ZCPAINT-SET-B07-SH02', component: ZcSetB07, ...dur(90)}),
    createElement(Composition, {id: 'ZCPAINT-SET-B08-SH01', component: ZcSetB08, ...dur(216)}),
    createElement(Composition, {id: 'ZCPAINT-SET-B10-SH01', component: ZcSetB10, ...dur(130)}),
    createElement(Composition, {id: 'ZCPAINT-GRIP', component: ZcGrip, ...dur(3)}),
    createElement(Composition, {id: 'ZCPAINT-POV-B02-SH02', component: ZcPovB02, ...dur(90)}),
  ),
);
