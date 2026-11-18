// Hand gesture reference sheet (KIT-HAND-GESTURES): one 1080x1920 still per gesture, six views each:
//   RIGHT palm | RIGHT back
//   LEFT palm  | LEFT back
//   RIGHT thumb edge | RIGHT back 3/4
// The thumb tip carries an orange ring, and each cell states which screen side the thumb is on (measured by `handFacing`, not typed).
// Render: node scripts/painted-kit/hand-gestures.mjs --out=DIR [--only=point,fist]; tile with scripts/qa-sheet.sh.
// Own entry (kept out of src/Root.tsx), like hands-macro-sheet.tsx.
import {createElement, Fragment, type ComponentType} from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';
import {BrushCanvas} from '../BrushCanvas';
import {GESTURE_IDS, HAND_GESTURES, gestureHand, gestureViewDir, handCentre, handFacing, viewCam, type GestureId, type GestureView, type HandSide} from './hand-gestures';
import {inkLine, macroSkeleton, paintHandMacro, MACRO_TONES} from './hands';
import {makePainter, type Pt} from './painter';
import {camPoint, camUnit} from './ycam';

const CELLS: {side: HandSide; view: GestureView; col: number; row: number}[] = [
  {side: 'right', view: 'palm', col: 0, row: 0}, {side: 'right', view: 'back', col: 1, row: 0},
  {side: 'left', view: 'palm', col: 0, row: 1}, {side: 'left', view: 'back', col: 1, row: 1},
  {side: 'right', view: 'thumb-edge', col: 0, row: 2}, {side: 'right', view: 'back-3q', col: 1, row: 2},
];
const TOP = 150, CELL_W = 540, CELL_H = 560;
const cellCentre = (col: number, row: number): Pt => [col * CELL_W + CELL_W / 2, TOP + row * CELL_H + CELL_H / 2 - 10];

const cellOf = (id: GestureId, c: (typeof CELLS)[number], k: number) => {
  const h0 = gestureHand(id, {side: c.side, wrist: [0, 0, 0], base: 1000 + k * 240, tone: MACRO_TONES.generic});
  const ctr = handCentre(h0), hand = {...h0, wrist: [-ctr[0], -ctr[1], -ctr[2]] as [number, number, number]};
  const [x, y] = cellCentre(c.col, c.row);
  const cam = viewCam([0, 0, 0], gestureViewDir(hand, c.view), 70, 1500, y, x - 540);
  return {hand, cam, facing: handFacing(cam, hand)};
};

const Still = ({gesture}: {gesture: GestureId}) => {
  const g = HAND_GESTURES[gesture];
  const cells = CELLS.map((c, k) => ({...c, ...cellOf(gesture, c, k)}));
  return (
    <AbsoluteFill style={{background: '#efe6d2', fontFamily: 'Helvetica, Arial, sans-serif', color: '#2b2622'}}>
      <BrushCanvas paint={({brush}) => {
        const p = makePainter(brush, {t: 0, frame: 0});
        cells.forEach(({hand, cam}, k) => {
          paintHandMacro(p, cam, hand);
          const tip = macroSkeleton(hand).fingers.thumb.joints[3], at = camPoint(cam, tip);
          if (!at) return;
          const r = camUnit(cam, tip) * 1.6;
          inkLine(p, 90000 + k, Array.from({length: 24}, (_, i): Pt => [at[0] + r * Math.cos((i / 24) * 6.283), at[1] + r * Math.sin((i / 24) * 6.283)]), 4, 0.1, true, '#ff6a1a');
        });
      }} />
      <div style={{position: 'absolute', left: 40, top: 30, width: 1000}}>
        <div style={{fontSize: 54, fontWeight: 700}}>{gesture}</div>
        <div style={{fontSize: 28, marginTop: 6}}>{g.verb}</div>
      </div>
      {cells.map((c) => {
        const [x, y] = cellCentre(c.col, c.row);
        return (
          <div key={`${c.side}-${c.view}`} style={{position: 'absolute', left: x - CELL_W / 2 + 16, top: y + CELL_H / 2 - 64, width: CELL_W - 32, fontSize: 24, lineHeight: 1.25}}>
            <b>{c.side.toUpperCase()} · {c.view}</b> (sees {c.facing.shows})<br />thumb on screen {c.facing.thumbOnScreen.toUpperCase()}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 40, bottom: 26, width: 1000, fontSize: 22}}>{g.note}</div>
    </AbsoluteFill>
  );
};

registerRoot(() => createElement(Fragment, null, createElement(Composition as unknown as ComponentType<Record<string, unknown>>, {
  id: 'KIT-HAND-GESTURES', component: Still, defaultProps: {gesture: GESTURE_IDS[0]}, width: 1080, height: 1920, fps: 30, durationInFrames: 1,
})));
