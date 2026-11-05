// Standalone entry for the EDU-EP02-SHORT shot plates (Boss W5.2), kept out of src/Root.tsx and the episode registry:
// `printf 'EDU2-S01-B01-SH02 29 out/edu02/shots/b01sh02_f29.png\n' | node scripts/stills.mjs src/painted/edu02/shots-index.ts`.
// `EDU2-X-<from>-<to>` are QA stand-ins for the in-canvas dissolves (frame l of the incoming shot, dissolve over the first frames).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {DissolvePlate, EDU2_DISSOLVES, EDU2_FRAMES, EDU2_SHOTS, ShotPlate} from './shots';

const size = {width: 1080, height: 1920, fps: 30};
const short = (id: string) => id.replace('S01-', '').replace(/-/g, '');

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...EDU2_SHOTS.map(([id, n]) => createElement(Composition, {key: id, id: `EDU2-${id}`, component: () => createElement(ShotPlate, {id}), ...size, durationInFrames: n})),
    ...EDU2_DISSOLVES.map(([from, to, d]) =>
      createElement(Composition, {key: `x-${to}`, id: `EDU2-X-${short(from)}-${short(to)}`, component: () => createElement(DissolvePlate, {from, to, frames: d}), ...size, durationInFrames: Math.min(EDU2_FRAMES[to], d + 15)}),
    ),
  ),
);
