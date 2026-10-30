// Standalone entry for the ZCPAINT B08-SH01 production-plate review (Boss pass 6, VD-ZC-08 acceptance). Kept out of
// src/Root.tsx, the other spike entries and the episode registry: integration is Editor's (scene samples).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {B08Plate, B08PlateBare, B08SceneEN, B08SceneTH} from './ZcB08Plate';

const {width, height, fps} = FORMATS.short;
const dur = (n: number) => ({width, height, fps, durationInFrames: n});
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZCPAINT-B08-SH01', component: B08Plate, ...dur(204)}),
    createElement(Composition, {id: 'ZCPAINT-B08-SH01-BARE', component: B08PlateBare, ...dur(204)}),
    createElement(Composition, {id: 'ZCPAINT-B08-TL-TH', component: B08SceneTH, ...dur(180)}),
    createElement(Composition, {id: 'ZCPAINT-B08-TL-EN', component: B08SceneEN, ...dur(165)}),
  ),
);
