// Standalone entry for Film's look stills for HANAKO-SHORT (brief HANAKO-SHORT-FILM-R3). Kept out of src/Root.tsx and the
// episode registry; Boss ports what the user approves into the production plates.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {LF01, LF02, LF03} from './look';
import {LF04, LF05} from './look-r3';
import {LF01HOOK, LF06} from './look-r4';

const {width, height, fps} = FORMATS.short;
const dur = {width, height, fps, durationInFrames: 1};
registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'HANAKO-LF01', component: LF01, ...dur}),
    createElement(Composition, {id: 'HANAKO-LF01-NOJP', component: () => createElement(LF01, {jp: false}), ...dur}),
    createElement(Composition, {id: 'HANAKO-LF02', component: LF02, ...dur}),
    createElement(Composition, {id: 'HANAKO-LF03', component: () => createElement(LF03, {spread: false}), ...dur}),
    createElement(Composition, {id: 'HANAKO-LF03B', component: () => createElement(LF03, {spread: true}), ...dur}),
    createElement(Composition, {id: 'HANAKO-LF04', component: LF04, ...dur}),
    createElement(Composition, {id: 'HANAKO-LF05', component: () => createElement(LF05, {stage: 'end'}), ...dur}),
    createElement(Composition, {id: 'HANAKO-LF05-START', component: () => createElement(LF05, {stage: 'start'}), ...dur}),
    createElement(Composition, {id: 'HANAKO-LF05-PULSE', component: () => createElement(LF05, {stage: 'pulse'}), ...dur}),
    createElement(Composition, {id: 'HANAKO-LF06', component: () => createElement(LF06, {}), ...dur}),
    createElement(Composition, {id: 'HANAKO-LF06-EYE', component: () => createElement(LF06, {eye: true}), ...dur}),
    createElement(Composition, {id: 'HANAKO-LF01-HOOK-A', component: () => createElement(LF01HOOK, {lines: ['เคาะสามครั้ง… มีคนตอบ?']}), ...dur}),
    createElement(Composition, {id: 'HANAKO-LF01-HOOK-B', component: () => createElement(LF01HOOK, {lines: ['ผีที่ยังไม่พบ', 'ว่าเคยมีตัวตน']}), ...dur}),
  ),
);
