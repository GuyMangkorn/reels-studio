// Standalone entry for the ZCPAINT model sheet S-P12 (BODY-ZCP-6H, Boss pass 7): pages A-C and the bare measure compositions M1-M8.
// Kept out of src/Root.tsx, the shared painted spike entry and the episode registry.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {ZcS12A, ZcS12B, ZcS12C, ZcS12M1, ZcS12M2, ZcS12M3, ZcS12M4, ZcS12M5, ZcS12M6, ZcS12M7, ZcS12M8, ZcS12M9} from './ZcS12Sheet';

const {width, height, fps} = FORMATS.short;
const shot = {width, height, fps, durationInFrames: 3 * fps};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZCPAINT-S-P12-A', component: ZcS12A, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-S-P12-B', component: ZcS12B, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-S-P12-C', component: ZcS12C, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-S-P12-M1', component: ZcS12M1, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-S-P12-M2', component: ZcS12M2, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-S-P12-M3', component: ZcS12M3, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-S-P12-M4', component: ZcS12M4, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-S-P12-M5', component: ZcS12M5, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-S-P12-M6', component: ZcS12M6, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-S-P12-M7', component: ZcS12M7, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-S-P12-M8', component: ZcS12M8, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-S-P12-M9', component: ZcS12M9, ...shot}),
  ),
);
