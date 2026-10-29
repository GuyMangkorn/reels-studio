// Standalone entry for the painted-2D spikes, kept out of src/Root.tsx and the episode registry until the approach is approved.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {FireFog} from './FireFog';
import {RainHut} from './RainHut';
import {Shipwreck} from './Shipwreck';

const {width, height, fps} = FORMATS.short;
const shot = {width, height, fps, durationInFrames: 5 * fps};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'PAINTED-SPIKE-Short', component: RainHut, ...shot}),
    createElement(Composition, {id: 'PAINTED-FIREFOG-Short', component: FireFog, ...shot}),
    // Film style test for SHIPWRECK-SHORT (scripts/oldest-shipwreck/delivery.md): 3 shots x 3 s.
    createElement(Composition, {id: 'PAINTED-SPIKE-Shipwreck', component: Shipwreck, ...shot, durationInFrames: 9 * fps}),
  ),
);
