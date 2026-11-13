// Standalone entry for the EDU-EP17 group-1 spikes (SP1 altitude chain, SP2 crowd density, N14 labels). Kept out of src/Root.tsx and the episode registry; render
// with scripts/stills.mjs or scripts/edu17/spike-bench.mjs. Compositions: EDU17-SP1-CHAIN, EDU17-SP1-SEAMS, EDU17-SP2-SH04, EDU17-SP2-SH11, EDU17-N14-SH03, EDU17-N14-SH22.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {N14Sheet, SEAMS, SP1_FRAMES, Sp1Chain, Sp1Seams, Sp2} from './Edu17Spike';

const {width, height, fps} = FORMATS.short;
const size = {width, height, fps};

registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'EDU17-SP1-CHAIN', component: Sp1Chain, ...size, durationInFrames: SP1_FRAMES}),
    createElement(Composition, {id: 'EDU17-SP1-SEAMS', component: Sp1Seams, ...size, durationInFrames: SEAMS.length * 2}),
    createElement(Composition, {id: 'EDU17-SP2-SH04', component: () => createElement(Sp2, {shot: 'S01-B01-SH04'}), ...size, durationInFrames: 67}),
    createElement(Composition, {id: 'EDU17-SP2-SH11', component: () => createElement(Sp2, {shot: 'S01-B03-SH03'}), ...size, durationInFrames: 45}),
    createElement(Composition, {id: 'EDU17-N14-SH03', component: () => createElement(N14Sheet, {which: 'sh03'}), ...size, durationInFrames: 1}),
    createElement(Composition, {id: 'EDU17-N14-SH22', component: () => createElement(N14Sheet, {which: 'sh22'}), ...size, durationInFrames: 1}),
  ),
);
