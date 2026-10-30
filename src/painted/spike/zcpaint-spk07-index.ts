// Standalone entry for Film's spike SPK-ZCP-07 (30 Oct 2026): B06-SH02 reach into the fridge with the projected arm (`ZcSpk07.ts`),
// variants A, B, C with a burned-in label. Kept out of src/Root.tsx and the episode registry, like the other ZCPAINT spike entries.
import {createElement, Fragment} from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from 'remotion';
import {STILL_CAMERA} from '../camera';
import type {PaintedShot} from '../shot';
import {FORMATS} from '../../videos/types';
import {ctxOf} from '../zcpaint/ctx';
import {screenOnly} from '../zcpaint/overlays';
import {PlatePreview} from './PlatePreview';
import {paintSpk07, type Variant} from './ZcSpk07';

const {width, height, fps} = FORMATS.short;
const NOTE: Record<Variant, string> = {
  A: 'A · sheet camera, box at shoulder height, arm into depth',
  B: 'B · sheet camera, box deeper and right, near-straight reach',
  C: 'C · closer, higher camera over the right shoulder',
};
const Label = ({text}: {text: string}) => {
  const f = useCurrentFrame();
  return createElement('div', {style: {position: 'absolute', left: 24, top: 18, right: 24, fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 34, fontWeight: 700, color: '#fff', WebkitTextStroke: '6px #111', paintOrder: 'stroke'}}, `${text} · f${f}`);
};
const shot = (v: Variant): PaintedShot => ({
  id: `SPK07-B06-${v}`, serves: ['B06-SH02'], paper: '#d9ccb0', camera: () => STILL_CAMERA, Overlay: screenOnly(),
  paint: (p, ctx) => paintSpk07(v)(ctxOf(p), Math.round(ctx.tl * fps)),
});
const comp = (v: Variant) =>
  createElement(Composition, {
    id: `ZCPAINT-SPK07-${v}`, width, height, fps, durationInFrames: 63,
    component: () => createElement(AbsoluteFill, null, createElement(PlatePreview, {shot: shot(v), G0: 0, label: false, note: ''}), createElement(Label, {text: NOTE[v]})),
  });
registerRoot(() => createElement(Fragment, null, ...(['A', 'B', 'C'] as Variant[]).map(comp)));
