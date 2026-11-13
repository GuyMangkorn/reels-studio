// KIT-VIEW-AUDIT check sheet (standalone entry, not a deliverable): how a kit figure reads as the yaw camera orbits it. One frame =
// one pose at one camera height; the 12 cells are azimuths 0..330 deg in 30 deg steps around a figure with a fixed world facing
// (six-view `figureView`, no hysteresis), each cell labelled with the azimuth and the view the kit picks. Camera heights: eye level,
// high (looking down 30 deg) and low (looking up 20 deg). Frames 18-35 repeat 0-17 with `pitchCue` on. Used to list where views jump or break before improving them.
// Render: for f in $(seq 0 35); do printf "KIT-VIEW-AUDIT $f out/view-audit/f$f.png\n"; done | node scripts/stills.mjs src/painted/kit/view-audit-sheet.tsx
import {createElement, useCallback} from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {paintFigureAt, viewAtCam} from './figure-at';
import {makePainter} from './painter';
import {PEOPLE} from './people';
import type {AnyPoseId} from './poses';
import {figureView} from './views';
import type {YCam} from './ycam';

const PAPER = '#efe8dc';
const POSES: {id: AnyPoseId; label: string}[] = [
  {id: 'P01', label: 'P01 stand'},
  {id: 'P38', label: 'P38 run'},
  {id: 'P31', label: 'P31 sit chair'},
  {id: 'P35', label: 'P35 crouch'},
  {id: 'P34', label: 'P34 kneel'},
  {id: 'P33', label: 'P33 floor sit'},
];
/** Camera heights: eye (m) and the aim height on the figure. Pitch is solved so the aim point sits at the cell centre. */
const HEIGHTS = [
  {label: 'eye level', eye: 0.85},
  {label: 'high (down 30°)', eye: 0.85 + 4 * Math.tan((30 * Math.PI) / 180)},
  {label: 'low (up 20°)', eye: 0.85 - 4 * Math.tan((20 * Math.PI) / 180)},
];
const BASE = POSES.length * HEIGHTS.length;
/** Frames BASE.. repeat every cell with `pitchCue` on (VA03). */
export const FRAMES = 2 * BASE;
const COLS = 3, ROWS = 4, CW = 1080 / COLS, CH = 1920 / ROWS, R = 4, F = 800, AIM = 0.85;
const AT: [number, number, number] = [0, 0, 0];
const FACING: [number, number] = [0, 1];

const cellCam = (i: number, eye: number): YCam => {
  const az = (i * 30 * Math.PI) / 180, col = i % COLS, row = Math.floor(i / COLS);
  const pitch = Math.atan2(AIM - eye, R);
  return {x: AT[0] + R * Math.sin(az), y: eye, z: AT[2] + R * Math.cos(az), yaw: -az, pitch, f: F, hy: row * CH + CH / 2 + 30, cx: col * CW + CW / 2 - 540};
};
const frameSpec = (f: number) => ({pose: POSES[Math.floor((f % BASE) / HEIGHTS.length)], height: HEIGHTS[f % HEIGHTS.length], cue: f >= BASE});

const Sheet = () => {
  const f = useCurrentFrame();
  const {pose, height, cue} = frameSpec(f);
  const paint = useCallback(({brush}: PaintContext) => {
    const p = makePainter(brush, {t: 0, frame: f, fade: PAPER});
    for (let i = 0; i < 12; i++) {
      const c = cellCam(i, height.eye);
      paintFigureAt(p, c, PEOPLE['woman-curly'], {at: AT, facing: FACING, pose: pose.id, t: 0, seed: 400 + i, pitchCue: cue});
    }
  }, [f, pose, height, cue]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      {Array.from({length: 12}, (_, i) => {
        const c = cellCam(i, height.eye), col = i % COLS, row = Math.floor(i / COLS);
        const v = figureView(c, AT, FACING), vf = viewAtCam(c, {at: AT, facing: FACING});
        return (
          <div key={i} style={{position: 'absolute', left: col * CW, top: row * CH, width: CW, height: CH, boxSizing: 'border-box', border: '1px solid #cbbfa9', fontFamily: 'sans-serif', fontSize: 22, color: '#3b3226', padding: 8}}>
            {i * 30}° · {v}{vf.quarter ? ` (${vf.quarter})` : ''}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center', fontFamily: 'sans-serif', fontSize: 30, color: '#7a2e1d'}}>
        {pose.label} · {height.label}{cue ? ' · pitchCue' : ''}
      </div>
    </AbsoluteFill>
  );
};

registerRoot(() => createElement(Composition, {id: 'KIT-VIEW-AUDIT', component: Sheet, width: 1080, height: 1920, fps: 30, durationInFrames: FRAMES}));
