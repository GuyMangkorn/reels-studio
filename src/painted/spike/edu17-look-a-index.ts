// Standalone entry for the EDU-EP17 W3 look frames, set A (Film): LF01A, LF01B, LF03, LF07 with their thumbnail options. Kept out of src/Root.tsx and the episode
// registry; render with scripts/stills.mjs. Compositions: EDU17-LFA-<frame>-<opt> (01A-a/b/c, 01B-a/b/c, 03-a/b, 07-a/b/c), one frame each.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {LF01A_OPTS, LF01B_OPTS, LF03_OPTS, LF07_OPTS, Lf01A, Lf01B, Lf03, Lf07} from './Edu17LookA';

const {width, height, fps} = FORMATS.short;
const size = {width, height, fps, durationInFrames: 1};
const set = (name: string, opts: Record<string, unknown>, C: (p: {opt: string}) => ReturnType<typeof Lf01A>) =>
  Object.keys(opts).map((o) => createElement(Composition, {key: `${name}-${o}`, id: `EDU17-LFA-${name}-${o}`, component: () => createElement(C, {opt: o}), ...size}));

registerRoot(() => createElement(Fragment, null, ...set('01A', LF01A_OPTS, Lf01A), ...set('01B', LF01B_OPTS, Lf01B), ...set('03', LF03_OPTS, Lf03), ...set('07', LF07_OPTS, Lf07)));
