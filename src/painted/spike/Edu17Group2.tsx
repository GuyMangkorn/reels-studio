import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {paintFigureAt} from '../kit/figure-at';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {castOf, manDef, paintStreetShot, pitchScale, STREET_SHOTS, type DepthItem, type StreetShot} from '../edu17/street';
import {paintSh04} from '../edu17/person-top';
import {NEIGHBOURS, squeezedFig, squeezeK} from '../edu17/squeezed';

// EDU-EP17 group 2 check stills (Boss, 2026-11-12): street N7 + crowd N6 + squeezed N12 (SH05 @ +15 = LF02's shot, SH11, SH02, SH10, SH12), person-top N5 (SH04). Spike entry only
// (edu17-group2-index.ts): no timeline, voice or captions; MAN and neighbours here are check staging, Editor stages the real ones. Guides (caption band) off with --props='{"guides":false}'.

/** The check staging per street shot: SH05 squeezed man + two neighbours (as LF02); SH02 his back with the phone up; SH10 and SH12 him standing, front. */
export const stage = (p: Painter, shot: StreetShot, f: number) => (c: Parameters<typeof pitchScale>[0]): DepthItem[] => {
  const man = manDef(), t = f / 30, items: DepthItem[] = [];
  if (shot === 'SH05') {
    const kM = squeezeK(f), press = NEIGHBOURS.press * kM, sq = squeezedFig(man, c, [0, 0, 0], kM);
    const off = castOf('man-crop', 'office'), nur = castOf('woman-long', 'nurse');
    items.push({z: 0, draw: () => void paintFigureAt(p, c, sq.def, {at: [0, 0, 0], view: 'front', pose: 'P10', face: 'tired', fig: sq.fig, t, seed: 77, scale: pitchScale(c, [0, 0, 0], man.height)})});
    items.push({z: 0.12, draw: () => void paintFigureAt(p, c, off, {at: [NEIGHBOURS.left.x + press, 0, NEIGHBOURS.left.z], view: 'front', fig: {quarter: NEIGHBOURS.left.quarter, quarterDeg: NEIGHBOURS.deg}, pose: 'P01', face: 'neutral', t, seed: 311, scale: pitchScale(c, [NEIGHBOURS.left.x, 0, NEIGHBOURS.left.z], off.height)})});
    items.push({z: 0.13, draw: () => void paintFigureAt(p, c, nur, {at: [NEIGHBOURS.right.x - press, 0, NEIGHBOURS.right.z], view: 'front', fig: {quarter: NEIGHBOURS.right.quarter, quarterDeg: NEIGHBOURS.deg}, pose: 'P01', face: 'neutral', t, seed: 313, scale: pitchScale(c, [NEIGHBOURS.right.x, 0, NEIGHBOURS.right.z], nur.height)})});
  } else if (shot === 'SH02') {
    items.push({z: 0, draw: () => void paintFigureAt(p, c, man, {at: [0, 0, 0], view: 'back', pose: 'P10', face: 'neutral', t, seed: 77, scale: pitchScale(c, [0, 0, 0], man.height)})});
  } else if (shot === 'SH10' || shot === 'SH12' || shot === 'SH15') {
    items.push({z: 0, draw: () => void paintFigureAt(p, c, man, {at: [0, 0, 0], view: 'front', pose: 'P01', face: 'neutral', t, seed: 77, scale: pitchScale(c, [0, 0, 0], man.height)})});
  }
  return items;
};

const Painted = ({paint, paper}: {paint: (p: Painter) => void; paper: string}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / 30, frame, fade: paper})), [paint, paper]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <Grain opacity={0.05} />
      {(getInputProps() as {guides?: boolean}).guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

/** Each check still: id -> [paint, paper]. `f` is the shot-local frame the still shows. */
export const G2: Record<string, {paint: (p: Painter) => void; paper: string; len: number}> = {};
const street = (key: StreetShot, f: number, id = `${key}-f${f}`) => { G2[id] = {paint: (p) => void paintStreetShot(p, key, f, {extra: (c) => stage(p, key, f)(c)}), paper: '#a9c8df', len: STREET_SHOTS[key].len}; };
street('SH05', 15, 'SH05-LF02'); street('SH05', 54); street('SH02', 2); street('SH02', 40); street('SH10', 10); street('SH11', 0, 'SH11-f0'); street('SH11', 44); street('SH12', 3); street('SH15', 40);
G2['SH04-f0'] = {paint: (p) => void paintSh04(p, 0), paper: '#26231f', len: 67};
G2['SH04-f43'] = {paint: (p) => void paintSh04(p, 43), paper: '#26231f', len: 67};
G2['SH04-f66'] = {paint: (p) => void paintSh04(p, 66), paper: '#26231f', len: 67};

export const G2_COMPONENTS = Object.fromEntries(Object.entries(G2).map(([id, s]) => [id, () => <Painted paint={s.paint} paper={s.paper} />])) as Record<string, () => ReactNode>;
