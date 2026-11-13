// Standalone entry for the EDU-EP17 group-3 stills (N3 map plate, N4 fill layer): one composition per G shot, EDU17-G3-SH01 ... EDU17-G3-SH22, frame = shot-local frame.
// Kept out of src/Root.tsx and the episode registry; render with scripts/stills.mjs or scripts/edu17/spike-bench.mjs --entry=src/painted/spike/edu17-group3-index.ts.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {G3_SHOTS, G3Shot, g3Len, type G3Key} from './Edu17Group3';

const {width, height, fps} = FORMATS.short;

registerRoot(() => createElement(Fragment, null, ...(Object.keys(G3_SHOTS) as G3Key[]).map((k) => createElement(Composition, {key: k, id: `EDU17-G3-${k}`, component: () => createElement(G3Shot, {k}), width, height, fps, durationInFrames: g3Len(k)}))));
