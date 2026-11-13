import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {paintFigureAt} from '../kit/figure-at';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {castOf, manDef, paintStreetShot, pitchScale, STREET_SHOTS, type DepthItem, type StreetShot} from '../edu17/street';
import {stage} from './Edu17Group2';
import {heldPhone, paintPhone, paintScreenDot, type Quad} from '../edu17/phone-map';
import {paintBalance, paintInset, paintSh13, SH13_LEN, SH14_LEN, SH15_LEN} from '../edu17/space';

// EDU-EP17 group 5 check stills (Boss, 2026-11-12): N10 atom + loupe + speck ring (SH13, SH15 inset), N11 balance (SH14), N13 phone map screen (SH02). Spike entry only
// (edu17-group5-index.ts): no timeline, voice or captions; MAN here is check staging, Editor stages the real one. Guides (caption band) off with --props='{"guides":false}'.
const Painted = ({paint, paper, byFrame}: {paint: (p: Painter, f: number) => void; paper: string; byFrame?: boolean}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / 30, frame, fade: paper}), byFrame ? frame : 0), [paint, paper, byFrame]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <Grain opacity={0.05} />
      {(getInputProps() as {guides?: boolean}).guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

/** SH02 check staging: MAN's back with the phone up (P10), the phone map in his right hand (held prop). */
const sh02 = (p: Painter, f: number, out: {quad?: Quad}) => (c: Parameters<typeof pitchScale>[0]): DepthItem[] => {
  const man = manDef(), t = f / 30;
  return [{z: 0, draw: () => void paintFigureAt(p, c, man, {at: [0, 0, 0], view: 'back', pose: 'P10', face: 'neutral', t, seed: 77, scale: pitchScale(c, [0, 0, 0], man.height), held: (q, a, u) => { out.quad = heldPhone(q, a, u, t, man.outfit.sleeve).quad; }})}];
};

export const G5: Record<string, {paint: (p: Painter) => void; paper: string; len: number}> = {};
for (const f of [0, 21, 26, 30, 36, 40, 45, 60, 72, 92]) G5[`SH13-f${f}`] = {paint: (p) => void paintSh13(p, f), paper: '#0b1430', len: SH13_LEN};
for (const f of [0, 6, 10, 14, 18, 30, 64, 89]) G5[`SH14-f${f}`] = {paint: (p) => void paintBalance(p, f), paper: '#0b1430', len: SH14_LEN};
for (const f of [24, 30, 40, 50, 66]) G5[`SH15-f${f}`] = {paint: (p) => { paintStreetShot(p, 'SH15', 40, {extra: (c) => stage(p, 'SH15', 40)(c)}); paintInset(p, f); }, paper: '#a9c8df', len: SH15_LEN};
for (const f of [2, 28, 42]) G5[`SH02-f${f}`] = {paint: (p) => { const o: {quad?: Quad} = {}; paintStreetShot(p, 'SH02', f, {extra: (c) => sh02(p, f, o)(c)}); if (o.quad) paintScreenDot(p, o.quad, f / 30); }, paper: '#a9c8df', len: STREET_SHOTS.SH02.len};
for (const t of [0, 1.0]) G5[`PHONE-t${t * 10}`] = {paint: (p) => { paintPhone(p, [540, 900], 360, t, {tilt: -8, taper: 0.06}); }, paper: '#8c8f93', len: 30};
export const G5_COMPONENTS = Object.fromEntries(Object.entries(G5).map(([id, s]) => [id, () => <Painted paint={(p) => s.paint(p)} paper={s.paper} />])) as Record<string, () => ReactNode>;
// frame-driven (fix pass C): the Remotion frame is the shot-local frame, for sweeps (pops) of SH13.
export const G5_BYFRAME: Record<string, {paint: (p: Painter, f: number) => void; paper: string}> = {'SH13': {paint: (p, f) => void paintSh13(p, f), paper: '#0b1430'}};
Object.entries(G5_BYFRAME).forEach(([id, s]) => { (G5_COMPONENTS as Record<string, () => ReactNode>)[`${id}-F`] = () => <Painted paint={s.paint} paper={s.paper} byFrame />; G5[`${id}-F`] = {paint: () => undefined, paper: s.paper, len: 93}; });
