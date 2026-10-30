// Standalone entry for the ZCPAINT R2 Film spike (first-person barricade + infected rage face, cream palette).
// Kept out of src/Root.tsx, the shared painted spike entry and the episode registry (integration is Boss's).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {ZcPaintB02PovFull, ZcPaintB02PovFullBare, ZcPaintB02PovFullCap, ZcPaintB02Low, ZcPaintB02LowCap, ZcPaintB02LowShade, ZcPaintB02Pov, ZcPaintRage} from './ZcPaintPov';

const {width, height, fps} = FORMATS.short;
const shot = {width, height, fps, durationInFrames: 3 * fps};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'ZCPAINT-SPIKE-B02POV', component: ZcPaintB02Pov, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-SPIKE-RAGE', component: ZcPaintRage, ...shot}),
    // R2.1: full-frame B02-SH02 POV (drag), with ZC-CAPSHADE, bare, and with a mock low caption.
    createElement(Composition, {id: 'ZCPAINT-SPIKE-B02POV-FULL', component: ZcPaintB02PovFull, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-SPIKE-B02POV-FULL-BARE', component: ZcPaintB02PovFullBare, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-SPIKE-B02POV-FULL-CAP', component: ZcPaintB02PovFullCap, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-SPIKE-B02LOW', component: ZcPaintB02Low, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-SPIKE-B02LOW-CAP', component: ZcPaintB02LowCap, ...shot}),
    createElement(Composition, {id: 'ZCPAINT-SPIKE-B02LOW-SHADE', component: ZcPaintB02LowShade, ...shot}),
  ),
);
