// Standalone entry for the ZCPAINT model sheet R2.6 (Boss pass 11, CS-ZCP-R26 costume, TX-ZCP-CLOTH, FR-ZCP-CLOSE): pages A-G.
// Kept out of src/Root.tsx, the shared painted spike entry and the episode registry, like the S-P12 and bust sheet entries.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {ZcR26A, ZcR26B, ZcR26C, ZcR26D, ZcR26E, ZcR26F, ZcR26G} from './ZcR26Sheet';

const {width, height, fps} = FORMATS.short;
const shot = {width, height, fps, durationInFrames: 3 * fps};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZCPAINT-R26-A', component: ZcR26A, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-R26-B', component: ZcR26B, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-R26-C', component: ZcR26C, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-R26-D', component: ZcR26D, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-R26-E', component: ZcR26E, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-R26-F', component: ZcR26F, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-R26-G', component: ZcR26G, ...shot}),
  ),
);
