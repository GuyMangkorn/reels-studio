// Standalone entry for Film's look-check stills for BLOOP-EP01-SHORT (brief BLOOP-BRIEF-R1, VD16; 2026-10-30):
// L-A deep water, L-B dream creature designs, L-C solid SVG creature. Kept out of src/Root.tsx, the other spike entries
// and the episode registry; Boss ports what the user picks (DEP01/DEP02).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {CP3Rush, LookStill, LOOKS} from './BloopLook';

const {width, height, fps} = FORMATS.short;

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.keys(LOOKS).map((k) =>
      createElement(Composition, {key: k, id: `BLOOP-LOOK-${k.replace('L-', '')}`, width, height, fps, durationInFrames: 30, component: () => createElement(LookStill, {look: LOOKS[k]})}),
    ),
    createElement(Composition, {key: 'rush', id: 'BLOOP-LOOK-CP3-RUSH', width, height, fps, durationInFrames: 66, component: CP3Rush}),
  ),
);
