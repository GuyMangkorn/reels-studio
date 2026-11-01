// Standalone QA entry for the KSO interior look stills (LF04, LF05): the figures alone on magenta paper, at the same plate
// camera, so the visible artwork can be measured by pixels (lead height >= 480 px at 1920 px, brief acceptance; DF-20261101).
// LF04 (izakaya, round 5): the coworker with the table painted in the paper colour, so the figure ends at the table line.
// Not a deliverable: no registration in Root or src/videos. Render: printf 'KSO-QA-LEAD-04 81 out/x.png\n' |
// node scripts/stills.mjs src/painted/kuchisake/room-qa-index.tsx
import {createElement, Fragment, useCallback} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import type {Camera} from '../kit/camera';
import type {Painter} from '../kit/painter';
import {camDark, darkRoomFigures} from './darkroom';
import {camIzakaya, leadFigures} from './izakaya';
import {FPS, PICTURE_H, PICTURE_W, plate} from './rooms';

const MAGENTA = '#ff00ff';
const LEAD04 = leadFigures(MAGENTA);

/** The plate with the figures only (no set, no glow, no screen layers), on magenta paper. */
const Lead = ({cam, figures}: {cam: (tl: number) => Camera; figures: (p: Painter, tl: number) => void}) => {
  const paint = useCallback(({brush, frame}: PaintContext) => plate(brush, frame, cam, figures, MAGENTA), [cam, figures]);
  return (
    <AbsoluteFill style={{background: MAGENTA}}>
      <BrushCanvas paint={paint} paper={MAGENTA} />
    </AbsoluteFill>
  );
};

registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, {id: 'KSO-QA-LEAD-04', component: () => createElement(Lead, {cam: camIzakaya, figures: LEAD04}), durationInFrames: 162, width: PICTURE_W, height: PICTURE_H, fps: FPS}),
    createElement(Composition, {id: 'KSO-QA-LEAD-05', component: () => createElement(Lead, {cam: camDark, figures: darkRoomFigures}), durationInFrames: 84, width: PICTURE_W, height: PICTURE_H, fps: FPS}),
  ),
);
