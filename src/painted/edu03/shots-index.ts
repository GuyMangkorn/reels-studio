// Standalone entry for the EDU-EP03-SHORT shot plates (Boss W5.2), kept out of src/Root.tsx and the episode registry:
// `printf 'EDU3-S01-B01-SH01 30 out/edu03/shots/b01sh01_f30.png\n' | node scripts/stills.mjs src/painted/edu03/shots-index.ts`.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {EDU3_SHOTS, ShotPlate} from './shots';

const size = {width: 1080, height: 1920, fps: 30};

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...EDU3_SHOTS.map(([id, n]) => createElement(Composition, {key: id, id: `EDU3-${id}`, component: () => createElement(ShotPlate, {id}), ...size, durationInFrames: n})),
  ),
);
