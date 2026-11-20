// Standalone entry for the REGISTERED EDU30 plates through `PaintedStage` (Boss T34, 2026-11-19): `EDU30-REG-<shot id>`, shot-local clock = composition frame,
// no captions or chrome. Used to compare the registered plate with the QA stack (`shots-index.tsx`). Kept out of src/Root.tsx.
//   printf 'EDU30-REG-B03-SH01 2 out/edu30-T34/reg_B03-SH01_L2.png\n' | node scripts/stills.mjs src/painted/edu30/registered-index.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {Composition, registerRoot} from 'remotion';
import {PaintedStage} from '../PaintedStage';
import type {Timeline} from '../../scenes/types';
import {EDU30_SHOTS, FPS} from './shots/index';

const Reg = ({id, N}: {id: string; N: number}) => {
  const timeline: Timeline = [{durationSec: N / FPS, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: `EDU30-${id}`, atSec: 0}]}}];
  return <PaintedStage timeline={timeline} ending="C_seamless" loopBlendFrames={0} />;
};

registerRoot(() => createElement(Fragment, null,
  ...EDU30_SHOTS.map((row) => createElement(Composition, {key: row.id, id: `EDU30-REG-${row.id}`, component: () => <Reg id={row.id} N={row.N} />, width: 1080, height: 1920, fps: FPS, durationInFrames: row.N}))));
