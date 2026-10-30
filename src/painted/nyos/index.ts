// Standalone entry for Film's NYOS look-check stills (NYOS-BRIEF-R2, VD01). Outside src/Root.tsx and the registry.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {LookStill, LOOKS} from './NyosLook';

const {width, height, fps} = FORMATS.short;
registerRoot(() =>
  createElement(Fragment, null, ...Object.keys(LOOKS).map((k) =>
    createElement(Composition, {key: k, id: `NYOS-LOOK-${k.replace('LF-', '')}`, width, height, fps, durationInFrames: 30, component: () => createElement(LookStill, {look: LOOKS[k]})}))),
);
