// KIT-RUN-ARMS check sheet (standalone entry, not a deliverable): the P38 run arm pump and the turned side of the torso in the front and
// front three-quarter views (13 Nov 2026). One frame = one person; rows are four run phases, columns the camera azimuths round a figure
// with a fixed world facing +z (front 0, three-quarter 45 and 315 deg).
// Render: for f in 0 1 2; do printf "KIT-RUN-ARMS $f out/run-arms/f$f.png\n"; done | node scripts/stills.mjs src/painted/kit/run-arms-sheet.tsx
import {createElement, useCallback} from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {paintFigureAt} from './figure-at';
import {makePainter} from './painter';
import {PEOPLE} from './people';
import type {YCam} from './ycam';

const PAPER = '#efe8dc';
export const RUN_ARMS_PEOPLE = ['man-parted', 'woman-curly', 'boy-school'] as const;
/** Run phases (cycles) per row: passing, the left arm forward, passing, the right arm forward. */
export const RUN_ARMS_PHASES = [0, 0.25, 0.5, 0.75];
const VIEWS = [{az: 0, label: 'front 0°'}, {az: 45, label: '3/4 45°'}, {az: 315, label: '3/4 315°'}];
const COLS = VIEWS.length;
const FACING: [number, number] = [0, 1];

const ROWS = RUN_ARMS_PHASES.length, CW = 1080 / COLS, CH = 1920 / ROWS, R = 3.4, F = 760, EYE = 1.0, AIM = 0.85;

const cellCam = (col: number, row: number): YCam => {
  const az = (VIEWS[col].az * Math.PI) / 180;
  return {x: R * Math.sin(az), y: EYE, z: R * Math.cos(az), yaw: -az, pitch: Math.atan2(AIM - EYE, R), f: F, hy: row * CH + CH / 2 + 20, cx: col * CW + CW / 2 - 540};
};

const Sheet = () => {
  const f = useCurrentFrame();
  const who = RUN_ARMS_PEOPLE[f % RUN_ARMS_PEOPLE.length];
  const paint = useCallback(({brush}: PaintContext) => {
    const p = makePainter(brush, {t: 0, frame: f, fade: PAPER});
    RUN_ARMS_PHASES.forEach((run, row) => VIEWS.forEach((_, col) => {
      paintFigureAt(p, cellCam(col, row), PEOPLE[who], {at: [0, 0, 0], facing: FACING, pose: 'P38', fig: {run}, t: 0, seed: 600 + row * 10 + col});
    }));
  }, [f, who]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      {RUN_ARMS_PHASES.flatMap((run, row) => VIEWS.map((v, col) => (
        <div key={`${row}-${col}`} style={{position: 'absolute', left: col * CW, top: row * CH, width: CW, height: CH, boxSizing: 'border-box', border: '1px solid #cbbfa9', fontFamily: 'sans-serif', fontSize: 20, color: '#3b3226', padding: 6}}>
          {v.label} · run {run}
        </div>
      )))}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center', fontFamily: 'sans-serif', fontSize: 30, color: '#7a2e1d'}}>P38 run arms · {who}</div>
    </AbsoluteFill>
  );
};

registerRoot(() => createElement(Composition, {id: 'KIT-RUN-ARMS', component: Sheet, width: 1080, height: 1920, fps: 30, durationInFrames: RUN_ARMS_PEOPLE.length}));
