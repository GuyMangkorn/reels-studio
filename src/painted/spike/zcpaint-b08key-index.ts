// Standalone entry for Film's B08-SH01 key-art spike (brief VB-ZCPAINT-SHORT-R2.4, VD-ZC-08). Kept out of src/Root.tsx,
// the other spike entries and the episode registry; Boss ports the accepted look into the production plate.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {ZcB08KeyBare, ZcB08KeyCap, ZcB08KeyPlain} from './ZcB08Key';

const {width, height, fps} = FORMATS.short;
const dur = (n: number) => ({width, height, fps, durationInFrames: n});
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZCPAINT-KEY-B08', component: ZcB08KeyPlain, ...dur(216)}),
    createElement(Composition, {id: 'ZCPAINT-KEY-B08-BARE', component: ZcB08KeyBare, ...dur(216)}),
    createElement(Composition, {id: 'ZCPAINT-KEY-B08-CAP', component: ZcB08KeyCap, ...dur(216)}),
  ),
);
