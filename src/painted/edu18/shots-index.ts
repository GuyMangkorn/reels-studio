// Standalone dev entry: every EDU-EP18 shot plate as its own composition (still checks without the timeline).
// printf 'EDU18-S01-B01-SH02 10 out/edu18/x.png\n' | node scripts/stills.mjs src/painted/edu18/shots-index.ts
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {SHOT_TABLE} from './clock';
import {ShotFrame} from './shots';

registerRoot(() => createElement(Fragment, null, ...SHOT_TABLE.map(([id, , n]) => createElement(Composition, {key: id, id: `EDU18-${id}`, component: () => createElement(ShotFrame, {id}), width: 1080, height: 1920, fps: 30, durationInFrames: n}))));
