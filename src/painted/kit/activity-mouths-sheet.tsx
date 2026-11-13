// KIT-ACTIVITY-MOUTHS check sheet (standalone entry, not a deliverable): kit mouths per activity, chest-up, in the front, three-quarter
// (camera 45 deg off the front) and right profile views. Rows: run (P38), lift/strain (P26), talk (P05), surprise mid-action (P15).
// Frame 0 = the kit as it was before activity mouths (13 Nov 2026), frame 1 = the activity mouths on.
// Render: printf 'KIT-ACTIVITY-MOUTHS 0 out/activity-mouths/before.png\nKIT-ACTIVITY-MOUTHS 1 out/activity-mouths/after.png\n' | node scripts/stills.mjs src/painted/kit/activity-mouths-sheet.tsx
import {createElement, useCallback} from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {ACTIVITY_MOUTHS_OFF, type ActivityOpts} from './activity-mouths';
import type {ExpressionId} from './expressions';
import {paintFigureAt} from './figure-at';
import {makePainter} from './painter';
import {PEOPLE} from './people';
import type {AnyPoseId} from './poses';
import type {YCam} from './ycam';

const PAPER = '#efe8dc';
const ROWS: {pose: AnyPoseId; face: ExpressionId; label: string; on?: ActivityOpts}[] = [
  {pose: 'P38', face: 'neutral', label: 'run · P38 + neutral'},
  {pose: 'P26', face: 'neutral', label: 'lift · P26 + neutral'},
  {pose: 'P05', face: 'talk', label: 'talk · P05 + talk'},
  {pose: 'P15', face: 'surprised', label: 'surprise · P15 + surprised', on: {activity: 'surprise', activityAt: 0.2}},
];
const VIEWS = [{az: 0, label: 'front'}, {az: 45, label: '3/4'}, {az: 90, label: 'profile'}];
const CW = 1080 / VIEWS.length, CH = 1920 / ROWS.length, R = 2.3, F = 900, AIM = 1.3, EYE = 1.45;
const AT: [number, number, number] = [0, 0, 0];
const FACING: [number, number] = [0, 1];

const cellCam = (col: number, row: number): YCam => {
  const az = (VIEWS[col].az * Math.PI) / 180;
  return {x: AT[0] + R * Math.sin(az), y: EYE, z: AT[2] + R * Math.cos(az), yaw: -az, pitch: Math.atan2(AIM - EYE, R), f: F, hy: row * CH + CH / 2, cx: col * CW + CW / 2 - 540};
};

const Sheet = () => {
  const f = useCurrentFrame();
  const paint = useCallback(({brush}: PaintContext) => {
    const p = makePainter(brush, {t: 0, frame: f, fade: PAPER});
    // Rows top to bottom; after each row a paper underlayer covers what spilled below it (p5.brush has no clip).
    ROWS.forEach((r, row) => {
      VIEWS.forEach((_, col) => paintFigureAt(p, cellCam(col, row), PEOPLE['man-parted'], {at: AT, facing: FACING, ...(f === 0 ? ACTIVITY_MOUTHS_OFF : r.on ?? {}), pose: r.pose, face: r.face, t: 0.5, seed: 500 + row * 3 + col, shadow: false}));
      const y = (row + 1) * CH;
      p.flat(PAPER, [[0, y], [1080, y], [1080, 1920], [0, 1920]]);
    });
  }, [f]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      {ROWS.map((r, row) => VIEWS.map((v, col) => (
        <div key={`${row}-${col}`} style={{position: 'absolute', left: col * CW, top: row * CH, width: CW, height: CH, boxSizing: 'border-box', border: '1px solid #cbbfa9', fontFamily: 'sans-serif', fontSize: 20, color: '#3b3226', padding: 6, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <span>{col === 0 ? r.label : ''}</span><span>{v.label}</span>
        </div>
      )))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 4, textAlign: 'center', fontFamily: 'sans-serif', fontSize: 28, color: '#7a2e1d'}}>{f === 0 ? 'before: mouth = the expression passed' : 'after: activity mouths'}</div>
    </AbsoluteFill>
  );
};

registerRoot(() => createElement(Composition, {id: 'KIT-ACTIVITY-MOUTHS', component: Sheet, width: 1080, height: 1920, fps: 30, durationInFrames: 2}));
