import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {BONE, type CastDef} from './cast';
import {camMove, camOf} from './cam-moves';
import {ell, hardFill, inkLine, washAt} from './draw';
import {evaSuit, paintEva, paintHelmetProp, ZG_NEUTRAL} from './eva';
import {paintFigureAt} from './figure-at';
import {motionDuration, type MotionId} from './motions';
import {makePainter, type Painter, type Pt} from './painter';
import {PEOPLE} from './people';
import type {V3} from './space';
import {camPoint, camUnit, type YCam} from './ycam';

// ZEROG-* QA sheets (Boss pass A, EDU-EP08 B1/B3-B6): the weightless figure kit on one dark plate each. Time strips of the motions
// `zero-g-drift`, `pat-check`, `rail-tow` (8 time samples, 2 rows of 4), the whole-card `roll` ladder, the detached helmet prop and the
// P46 pose in every view. Kit proof only (no timeline, voice or caption). Entry: `zerog-index.ts`:
//   printf 'ZEROG-DRIFT 0 out/zerog/drift.png\n' | node scripts/stills.mjs src/painted/kit/zerog-index.ts

export const ZEROG_SHEETS = ['ZEROG-DRIFT', 'ZEROG-PAT', 'ZEROG-TOW', 'ZEROG-ROLL', 'ZEROG-HELMET', 'ZEROG-POSE'] as const;
const AST: CastDef = evaSuit(PEOPLE['woman-bob']), CREW: CastDef = evaSuit(PEOPLE['man-crop']);
const row = (hy: number): YCam => camOf(camMove([0, 1.0, 0], [0, 0], 2.7, 1.3, {pitch: [-8, -8], f: 1000, hy}), 0);
const ROWS = [row(660), row(1500)];
const X4 = [-1.09, -0.36, 0.36, 1.09];
const sky = (p: Painter) => { washAt(p, 1, '#0b1020', 255, [[-100, -100], [1180, -100], [1180, 2020], [-100, 2020]], 0.1, 0.1); washAt(p, 2, '#1d3a6b', 120, ell(540, 1980, 900, 300, 24), 0.3, 0.3); };
const label = (p: Painter, s: number, at: Pt, text: string) => void [p, s, at, text];

type Probe = {label: string; rHand?: Pt; lHand?: Pt; rShoulder?: Pt; lShoulder?: Pt; u: number; crewGlove?: Pt; rail?: Pt};
export const probe: Probe[] = [];

const strip = (p: Painter, motion: MotionId, ts: number[], opts: {def?: CastDef; face?: 'neutral' | 'worried'; view?: 'front' | 'right' | 'left'} = {}) => {
  ts.forEach((t, i) => {
    const c = ROWS[Math.floor(i / 4)], x = X4[i % 4], def = opts.def ?? AST;
    const at: V3 = [x, 0.2, 0];
    const a = paintEva(p, c, def, {at, view: opts.view ?? 'front', helmet: 'off', t, motion: {id: motion, t}, face: opts.face, seed: def.seed + i * 3});
    // a tick label above each figure (time in tenths of a second as dots would be unreadable: a bar whose length is t)
    const g = camPoint(c, at)!, u = camUnit(c, at);
    inkLine(p, 900 + i, [[g[0] - 0.3 * u, g[1] + 0.12 * u], [g[0] - 0.3 * u + (0.6 * u * t) / Math.max(...ts), g[1] + 0.12 * u]], {weight: 2, color: '#9fb4d8', closed: false});
    void a;
  });
};

const frameFor = (id: (typeof ZEROG_SHEETS)[number], p: Painter) => {
  sky(p);
  if (id === 'ZEROG-DRIFT') strip(p, 'zero-g-drift', [0, 0.75, 1.5, 2.25, 3, 3.75, 4.5, 5.25]);
  else if (id === 'ZEROG-PAT') strip(p, 'pat-check', [0.1, 0.4, 0.8, 1.2, 1.5, 1.8, 2.1, 2.4], {face: 'worried'});
  else if (id === 'ZEROG-TOW') {
    // CREW facing right, hand-over-hand: the rail is a gold bar at world y 1.08 m; markers on it are the grips
    ROWS.forEach((c) => { const a = camPoint(c, [-1.6, 1.08, 0])!, b = camPoint(c, [1.6, 1.08, 0])!; hardFill(p, 5, '#d9a441', [[a[0], a[1] - 5], [b[0], b[1] - 5], [b[0], b[1] + 5], [a[0], a[1] + 5]]); });
    const ts = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4];
    ts.forEach((t, i) => {
      const c = ROWS[Math.floor(i / 4)], x = X4[i % 4] * 0.9 - 0.45;
      const a = paintEva(p, c, CREW, {at: [x, 0.2, 0], view: 'right', helmet: 'visor', stripes: true, t, motion: {id: 'rail-tow', t}, seed: CREW.seed + i * 3});
      if (a) { probe.push({label: `t=${t}`, rHand: a.rHand, lHand: a.lHand, rShoulder: a.rShoulder, lShoulder: a.lShoulder, u: a.u}); }
    });
  } else if (id === 'ZEROG-ROLL') {
    const rolls = [0, 12, 30, 60, -20, -45, 90, 180];
    rolls.forEach((r, i) => {
      const c = ROWS[Math.floor(i / 4)], at: V3 = [X4[i % 4], 0.2, 0];
      const a = i % 2 === 0
        ? paintEva(p, c, AST, {at, view: 'front', helmet: 'bubble', t: 0, pose: 'P46', roll: r, seed: 70 + i})
        : paintFigureAt(p, c, AST, {at, pose: 'P46', shadow: false, roll: r, t: 0, seed: 70 + i, held: (q, an, u) => { hardFill(q, 940 + i, '#ff5a3c', ell(an.rHand[0], an.rHand[1], 0.04 * u, 0.04 * u, 10)); }});
      if (a) { for (const q of [a.head, a.rHand, a.lHand, a.feet]) hardFill(p, 950 + i, '#4ff0a8', ell(q[0], q[1], 5, 5, 8)); }
    });
  } else if (id === 'ZEROG-HELMET') {
    const spins = [0, 40, 90, 140, 180, -60, 25, 25];
    spins.forEach((s, i) => {
      const c = ROWS[Math.floor(i / 4)];
      paintHelmetProp(p, c, {at: [X4[i % 4], 1.0, 0], spin: s, roll: i === 6 ? 25 : i === 7 ? -40 : 0, glint: i >= 6 ? 1 : i === 0 ? 0.6 : 0, helmet: i === 5 ? 'round1966' : 'bubble', seed: 8800 + i * 20});
    });
  } else {
    // P46 in every view next to the ZG_NEUTRAL hand-authored arms (front)
    const views = ['front', 'left', 'right', 'back'] as const;
    views.forEach((v, i) => paintEva(p, ROWS[0], AST, {at: [X4[i], 0.2, 0], view: v, helmet: v === 'back' ? 'bubble' : 'off', t: 0, pose: 'P46', seed: 80 + i}));
    paintEva(p, ROWS[1], AST, {at: [X4[0], 0.2, 0], view: 'front', helmet: 'off', t: 0, r: ZG_NEUTRAL('r'), l: ZG_NEUTRAL('l'), seed: 90});
    paintEva(p, ROWS[1], AST, {at: [X4[1], 0.2, 0], view: 'front', helmet: 'bubble', t: 0, pose: 'P46', quarter: 'left', seed: 91});
    paintEva(p, ROWS[1], CREW, {at: [X4[2], 0.2, 0], view: 'right', helmet: 'visor', t: 0, pose: 'P46', stripes: true, seed: 92});
    paintEva(p, ROWS[1], AST, {at: [X4[3], 0.2, 0], view: 'front', helmet: 'bubble', t: 0, motion: {id: 'zero-g-drift', t: 1.5}, seed: 93});
  }
  void label; void BONE; void motionDuration;
};

const Sheet = ({id}: {id: (typeof ZEROG_SHEETS)[number]}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => frameFor(id, makePainter(brush, {t: frame / 30, frame, fade: '#0b1020'})), [id]);
  return <AbsoluteFill style={{background: '#0b1020'}}><BrushCanvas paint={fn} paper="#0b1020" /></AbsoluteFill>;
};
export const ZerogSheet = Sheet;
