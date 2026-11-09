// Standalone entry for the EDU-EP11-SHORT spikes SP1-SP4 (Boss, 2026-11-09). Kept out of src/Root.tsx and the episode registry:
// printf 'EDU11-SP1-R1 0 out/edu11/spikes/sp1-r1.png\n' | node scripts/stills.mjs src/painted/edu11/spike-index.ts --gl=angle
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {SPIKES} from './spikes';

const size = {width: 1080, height: 1920, fps: 30};
registerRoot(() =>
  createElement(Fragment, null, ...Object.entries(SPIKES).map(([id, s]) => createElement(Composition, {key: id, id: `EDU11-${id}`, component: s.component, ...size, durationInFrames: s.frames}))),
);
