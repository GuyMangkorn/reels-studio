// Standalone entry for the painted-2D spike, kept out of src/Root.tsx and the episode registry until the approach is approved.
import {createElement} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {RainHut} from './RainHut';

const {width, height, fps} = FORMATS.short;
registerRoot(() => createElement(Composition, {id: 'PAINTED-SPIKE-Short', component: RainHut, width, height, fps, durationInFrames: 5 * fps}));
