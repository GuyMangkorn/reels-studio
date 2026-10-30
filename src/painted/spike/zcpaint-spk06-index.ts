// Standalone entry for Film's look spike SPK-ZCP-06 (30 Oct 2026, the "puppet" look): B04-SH01, B09-SH01 and B02-SH03 as the pass 10
// production plate (`P10`), the pass 10 bust at the close waist framing (`P10W`, B02 only) and the costume variants A, B, C
// (`ZcSpk06.tsx`), each with a burned-in label. Kept out of src/Root.tsx and the episode registry, like the other ZCPAINT spike entries.
import {createElement, Fragment} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {FORMATS} from '../../videos/types';
import {zcpaintShots} from '../shots/zcpaint';
import {PlatePreview} from './PlatePreview';
import {spk06Shot, type Variant} from './ZcSpk06';

const {width, height, fps} = FORMATS.short;
const NOTE: Record<Variant, string> = {
  P10: 'P10 · pass 10 as shipped (tee, shorts, bare limbs)',
  P10W: 'P10 · pass 10 bust at the waist close framing',
  A: 'A · 6 heads, overshirt + tee, long trousers, full sleeves, flat cel',
  B: 'B · A + light brush texture in the cloth',
  C: 'C · B on a 5.5-head chunkier build',
};
const Label = ({text}: {text: string}) =>
  createElement('div', {style: {position: 'absolute', left: 24, top: 18, right: 24, fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 34, fontWeight: 700, color: '#fff', WebkitTextStroke: '6px #111', paintOrder: 'stroke'}}, text);
const shotOf = (id: string) => {
  const s = zcpaintShots.find((x) => x.id === id);
  if (!s) throw new Error(`no plate ${id}`);
  return s;
};
const PROD = {B04: 'ZCP-B04-SH01', B09: 'ZCP-B09-SH01-TH', B02: 'ZCP-B02-SH03'} as const;
const comp = (shot: 'B04' | 'B09' | 'B02', v: Variant) => {
  const plate = v === 'P10' ? shotOf(PROD[shot]) : spk06Shot(shot, v);
  return createElement(Composition, {
    id: `ZCPAINT-SPK06-${shot}-${v}`, width, height, fps, durationInFrames: 120,
    component: () => createElement(AbsoluteFill, null, createElement(PlatePreview, {shot: plate, G0: 0, label: false, note: ''}), createElement(Label, {text: `${plate.serves[0]} · ${NOTE[v]}`})),
  });
};
const V: Variant[] = ['P10', 'A', 'B', 'C'];
registerRoot(() =>
  createElement(
    Fragment,
    null,
    ...(['B04', 'B09', 'B02'] as const).flatMap((s) => (s === 'B02' ? (['P10', 'P10W', ...V.slice(1)] as Variant[]) : V).map((v) => comp(s, v))),
  ),
);
