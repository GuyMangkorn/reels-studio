// Standalone entry for the painted-2D spike, kept out of src/Root.tsx and the episode registry until the approach is approved.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {FireFog} from './FireFog';
import {RainHut} from './RainHut';

const {width, height, fps} = FORMATS.short;
const shot = {width, height, fps, durationInFrames: 5 * fps};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'PAINTED-SPIKE-Short', component: RainHut, ...shot}),
    createElement(Composition, {id: 'PAINTED-FIREFOG-Short', component: FireFog, ...shot}),
  ),
);
