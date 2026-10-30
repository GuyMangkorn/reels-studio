// Standalone entry for Film's look-check stills for BLOOP-EP01-SHORT (brief BLOOP-BRIEF-R1, VD16; 2026-10-30):
// L-A deep water, L-B dream creature designs, L-C solid SVG creature. Kept out of src/Root.tsx, the other spike entries
// and the episode registry; Boss ports what the user picks (DEP01/DEP02).
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {B04Still, CP3Rush, FarStill, HeroStill, IceRef, LookStill, LOOKS} from './BloopLook';

const {width, height, fps} = FORMATS.short;

registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...Object.keys(LOOKS).map((k) =>
      createElement(Composition, {key: k, id: `BLOOP-LOOK-${k.replace('L-', '')}`, width, height, fps, durationInFrames: 30, component: () => createElement(LookStill, {look: LOOKS[k]})}),
    ),
    ...(['sh11', 'sh12', 'sh13'] as const).map((s) => createElement(Composition, {key: s, id: `BLOOP-ICE-REF-${s.toUpperCase()}`, width, height, fps, durationInFrames: 1, component: () => createElement(IceRef, {scale: s})})),
    ...(['far', 'approach', 'ice', 'hyd', 'cover'] as const).map((b) => createElement(Composition, {key: b, id: `BLOOP-B10-HERO-${b.toUpperCase()}`, width, height, fps, durationInFrames: 1, component: () => createElement(HeroStill, {beat: b})})),
    ...(['p1a', 'p1b', 'p2a', 'p2b'] as const).map((b) => createElement(Composition, {key: b, id: `BLOOP-B10-FAR-${b.toUpperCase()}`, width, height, fps, durationInFrames: 1, component: () => createElement(FarStill, {beat: b})})),
    ...(['rest', 'reveal'] as const).map((b) => createElement(Composition, {key: `b04${b}`, id: `BLOOP-B04-HERO-${b.toUpperCase()}`, width, height, fps, durationInFrames: 1, component: () => createElement(B04Still, {beat: b})})),
    createElement(Composition, {key: 'rush', id: 'BLOOP-LOOK-CP3-RUSH', width, height, fps, durationInFrames: 66, component: CP3Rush}),
  ),
);
