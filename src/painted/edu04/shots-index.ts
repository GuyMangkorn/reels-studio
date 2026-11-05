// Standalone entry for the EDU-EP04-SHORT shot plates (Boss W5.2), kept out of src/Root.tsx and the episode registry:
// `printf 'EDU4-S01-B01-SH01 55 out/edu04/w52/g1/b01sh01_f55.png\n' | node scripts/stills.mjs src/painted/edu04/shots-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {EDU4_SHOTS, ShotPlate} from './shots';

const size = {width: 1080, height: 1920, fps: 30};

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...EDU4_SHOTS.map(([id, n]) => createElement(Composition, {key: id, id: `EDU4-${id}`, component: () => createElement(ShotPlate, {id}), ...size, durationInFrames: n})),
  ),
);
