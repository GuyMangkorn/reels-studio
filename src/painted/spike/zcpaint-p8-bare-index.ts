// Standalone entry for the ZCPAINT pass 8 BARE section and interior plates (Boss, 30 Oct 2026): the plate canvas only, with no Overlay, Grade,
// Grain or caption shade, so the flatness check (L3, `scripts/zombie-condo-paint/flatness.py`) measures the paint, not the paper grain.
// Kept out of src/Root.tsx and the episode registry, like the p5 and p8 entries.
import {createElement, Fragment, useCallback} from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame, useVideoConfig} from 'remotion';
import {FORMATS} from '../../videos/types';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawPlate} from '../plate';
import {zcpaintShots} from '../shots/zcpaint';

const {width, height, fps} = FORMATS.short;

/** One production plate on its canvas alone (drawPlate), the same paint as the review compositions without their Overlay. */
const BarePlate = ({id}: {id: string}) => {
  const frame = useCurrentFrame();
  const {fps: rate, width: w, height: h} = useVideoConfig();
  const shot = zcpaintShots.find((s) => s.id === id);
  if (!shot) throw new Error(`no ZCPAINT plate ${id}`);
  const paint = useCallback(({brush}: PaintContext) => drawPlate(brush, shot, {tl: frame / rate, fps: rate, width: w, height: h}), [shot, frame, rate, w, h]);
  return createElement(AbsoluteFill, {style: {backgroundColor: shot.paper}}, createElement(BrushCanvas, {paint, paper: shot.paper}));
};

const comp = (id: string, frames: number, plate: string) =>
  createElement(Composition, {
    id, width, height, fps, durationInFrames: frames,
    component: () => createElement(BarePlate, {id: plate}),
  });

registerRoot(() =>
  createElement(
    Fragment,
    null,
    comp('ZCPAINT-P8-BARE-B04-SH01', 60, 'ZCP-B04-SH01'),
    comp('ZCPAINT-P8-BARE-B06-SH01', 90, 'ZCP-B06-SH01'),
    comp('ZCPAINT-P8-BARE-B07-SH02', 90, 'ZCP-B07-SH02'),
    comp('ZCPAINT-P8-BARE-B09-SH01-TH', 156, 'ZCP-B09-SH01-TH'),
    comp('ZCPAINT-P8-BARE-B10-SH01', 186, 'ZCP-B10-SH01'),
  ),
);
