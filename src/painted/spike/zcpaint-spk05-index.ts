// Standalone entry for Film's feasibility spike SPK-ZCP-05 (brief VB-ZCPAINT-SHORT-R2.5): cel light + cast shadows on a
// section room, the ~6-head ZCPAINT body next to the 4-head WORLD FOG body, the arm-free B02-SH02 POV and B09-SH02B.
// Kept out of src/Root.tsx, the other spike entries and the episode registry; Boss ports what the user accepts.
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {Spk05B02, Spk05B04, Spk05B09, Spk05Bodies} from './ZcSpk05';

const {width, height, fps} = FORMATS.short;
const c = (id: string, frames: number, component: () => ReturnType<typeof createElement>) =>
  createElement(Composition, {id, width, height, fps, durationInFrames: frames, component});

registerRoot(() =>
  createElement(
    Fragment,
    null,
    c('ZCPAINT-SPK05-B04', 30, () => createElement(Spk05B04, {})),
    c('ZCPAINT-SPK05-B04-CAP', 30, () => createElement(Spk05B04, {caption: 'แต่ก๊อกน้ำยังไหล'})),
    c('ZCPAINT-SPK05-B04-BARE', 30, () => createElement(Spk05B04, {bare: true})),
    c('ZCPAINT-SPK05-B04-SHADE', 30, () => createElement(Spk05B04, {shade: true})),
    c('ZCPAINT-SPK05-BODIES', 1, () => createElement(Spk05Bodies)),
    c('ZCPAINT-SPK05-B02SH02', 96, () => createElement(Spk05B02, {})),
    c('ZCPAINT-SPK05-B02SH02-CAP', 96, () => createElement(Spk05B02, {caption: 'ลากตู้มาดัน'})),
    c('ZCPAINT-SPK05-B02SH02-CAPSHADE', 96, () => createElement(Spk05B02, {caption: 'ลากตู้มาดัน', shade: true})),
    c('ZCPAINT-SPK05-B02SH02-SHADE', 96, () => createElement(Spk05B02, {shade: true})),
    c('ZCPAINT-SPK05-B09SH02B-A', 39, () => createElement(Spk05B09, {variant: 'A'})),
    c('ZCPAINT-SPK05-B09SH02B-B', 39, () => createElement(Spk05B09, {variant: 'B'})),
  ),
);
