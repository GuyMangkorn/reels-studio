// KIT-ARM-DEPTH check sheet (standalone entry, not a deliverable): arms that point toward or away from the camera (reach to the lens,
// point, hold out, swing behind) and the elbow and knee joints of bent limbs. One frame = one arm case; rows are three PEOPLE (adult man,
// adult woman, child), columns the front, front three-quarter, right profile and back views of a figure facing +z. Used to list what
// breaks before improving the arm and joint drawing (13 Nov 2026).
// Render: for f in $(seq 0 13); do printf "KIT-ARM-DEPTH $f out/arm-depth/f$f.png\n"; done | node scripts/stills.mjs src/painted/kit/arm-depth-sheet.tsx
import {createElement, useCallback} from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import type {FigPose} from './cast';
import {paintFigureAt} from './figure-at';
import {makePainter} from './painter';
import {PEOPLE} from './people';
import type {AnyPoseId} from './poses';
import type {YCam} from './ycam';

const PAPER = '#efe8dc';
/** The arm and joint cases, one per frame. */
export const CASES: {id: AnyPoseId; label: string; fig?: Partial<FigPose>}[] = [
  {id: 'P13', label: 'P13 punch toward camera'},
  {id: 'P14', label: 'P14 point at viewer'},
  {id: 'P16', label: 'P16 reach / grab camera'},
  {id: 'P11', label: 'P11 offer toward camera'},
  {id: 'P18', label: 'P18 offer cup forward'},
  {id: 'P05', label: 'P05 point to the side'},
  {id: 'P41', label: 'P41 point accuse'},
  {id: 'P10', label: 'P10 phone at chest (elbows back)'},
  {id: 'P44', label: 'P44 hands behind back'},
  {id: 'P01', label: 'walk (arm swung back)', fig: {walk: 0.25}},
  {id: 'P38', label: 'P38 run (pumping arms, knees)'},
  {id: 'P09', label: 'P09 hands on hips (elbow joint)'},
  {id: 'P22', label: 'P22 flex biceps (elbow joint)'},
  {id: 'P35', label: 'P35 crouch (knee joint)'},
];
const PEOPLE_ROWS = ['man-crop', 'woman-curly', 'boy-school'] as const;
/** Camera azimuths round a figure facing +z: front, front three-quarter, right profile, back. */
const VIEWS = [{az: 0, label: 'front'}, {az: 45, label: '3/4'}, {az: 90, label: 'profile'}, {az: 180, label: 'back'}];
const COLS = VIEWS.length, ROWS = PEOPLE_ROWS.length, CW = 1080 / COLS, CH = 1920 / ROWS, R = 3.2, F = 800, EYE = 1.0, AIM = 0.85;
const FACING: [number, number] = [0, 1];

const cellCam = (col: number, row: number): YCam => {
  const az = (VIEWS[col].az * Math.PI) / 180;
  return {x: R * Math.sin(az), y: EYE, z: R * Math.cos(az), yaw: -az, pitch: Math.atan2(AIM - EYE, R), f: F, hy: row * CH + CH / 2 + 40, cx: col * CW + CW / 2 - 540};
};

const Sheet = () => {
  const f = useCurrentFrame();
  const c0 = CASES[f % CASES.length];
  const paint = useCallback(({brush}: PaintContext) => {
    const p = makePainter(brush, {t: 0, frame: f, fade: PAPER});
    PEOPLE_ROWS.forEach((who, row) => VIEWS.forEach((_, col) => {
      paintFigureAt(p, cellCam(col, row), PEOPLE[who], {at: [0, 0, 0], facing: FACING, pose: c0.id, fig: c0.fig, t: 0, seed: 500 + row * 10 + col});
    }));
  }, [f, c0]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={paint} paper={PAPER} />
      {PEOPLE_ROWS.flatMap((who, row) => VIEWS.map((v, col) => (
        <div key={`${row}-${col}`} style={{position: 'absolute', left: col * CW, top: row * CH, width: CW, height: CH, boxSizing: 'border-box', border: '1px solid #cbbfa9', fontFamily: 'sans-serif', fontSize: 20, color: '#3b3226', padding: 6}}>
          {v.label}{col === 0 ? ` · ${who}` : ''}
        </div>
      )))}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center', fontFamily: 'sans-serif', fontSize: 30, color: '#7a2e1d'}}>{c0.label}</div>
    </AbsoluteFill>
  );
};

registerRoot(() => createElement(Composition, {id: 'KIT-ARM-DEPTH', component: Sheet, width: 1080, height: 1920, fps: 30, durationInFrames: CASES.length}));
