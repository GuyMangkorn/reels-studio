import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, getInputProps, staticFile, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../../painted/BrushCanvas';
import {makePainter, type Painter} from '../../painted/kit/painter';
import {Grain} from '../../painted/kit/screen';
import {G_ANCHORS, gProject, gShotCam} from '../../painted/edu17/geo';
import {AnchoredLabel, GeoLabel, LBL, LBL2, LBLW, labelStyle} from '../../painted/edu17/labels';
import {LOOK_COL, paintMapPlate, plateFor} from '../../painted/edu17/mapdraw';
import {paintScreenDot} from '../../painted/edu17/phone-map';
import {paintSh04, sh04Cam, squareCorners} from '../../painted/edu17/person-top';
import {paintSh21} from '../../painted/edu17/instrument';
import {paintStadiumShot} from '../../painted/edu17/stadium';
import {paintBalance, paintInset, paintSh13} from '../../painted/edu17/space';
import type {StreetShot} from '../../painted/edu17/street';
import {FPS, lin, SHOT_TABLE, type ShotId} from './clock';
import {paintStreetLive} from './street-live';
import {stageStreet} from './stage';

// The labels use the Noto Sans Thai face; load it in the browser only (as EP16), so node tests can import this module.
if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

// EDU-EP17-SHORT shot frames (W5.3 Draft, Editor): one component per shot, a pure function of the shot-local frame `L = useCurrentFrame()` (the plate mounts it in a Freeze at L; the standalone
// shot compositions in shots-index.ts give it the shot's own length). Picture = BrushCanvas (Boss's tested painters) + grain; labels (LBL, LBL-W, LBL2, OT02-OT06) are DOM above it, placed by global
// frame per the storyboard's "On-screen text (global ranges)". Captions and the channel mark come from the timeline. The dashed caption-band guide appears only on standalone stills (`band`).
type Fn = (p: Painter, L: number, t: number) => void;
type Def = {paper: string; paint: Fn; dom?: (L: number, g: number) => ReactNode};

const street = (shot: StreetShot, after?: (p: Painter, L: number, o: {quad?: import('../../painted/edu17/phone-map').Quad}) => void, dom?: Def['dom']): Def => ({
  paper: '#a9c8df', dom,
  paint: (p, L) => { const o: {quad?: import('../../painted/edu17/phone-map').Quad} = {}; paintStreetLive(p, shot, L, {extra: stageStreet(p, shot, L, o)}); after?.(p, L, o); },
});
const mapShot = (shot: ShotId, dom?: Def['dom']): Def => ({
  paper: LOOK_COL.gulf, dom,
  paint: (p, L, t) => paintMapPlate(p, gShotCam(shot, L), {...plateFor(shot, L), t: L / FPS + t, ...(getInputProps() as {shade?: number; shadeFrom?: number})}),
});

const BKK: [number, number] = [13.74, 100.6], NON: [number, number] = [13.93, 100.42];
/** OT02 province names: world-anchored at the province label points; pop in over 6 frames from shot-local `a` (Bangkok) and `b` (Nonthaburi); a negative start = already on. */
const OT02 = (shot: ShotId, a: number, b: number): Def['dom'] => (L) => {
  const cam = gShotCam(shot, L);
  return <>
    {L >= a && <GeoLabel cam={cam} lat={BKK[0]} lon={BKK[1]} text="กรุงเทพฯ" side="left" k={lin(a, a + 6, L)} />}
    {L >= b && <GeoLabel cam={cam} lat={NON[0]} lon={NON[1]} text="นนทบุรี" side="left" k={lin(b, b + 6, L)} />}
  </>;
};

const SH = (id: ShotId) => SHOT_TABLE.find(([i]) => i === id)![1];

export const SHOT_DEFS: Record<ShotId, Def> = {
  'S01-B01-SH01': mapShot('S01-B01-SH01'),
  'S01-B01-SH02': street('SH02', (p, L, o) => { if (o.quad) paintScreenDot(p, o.quad, L / FPS); }),
  'S01-B01-SH03': mapShot('S01-B01-SH03', OT02('S01-B01-SH03', 43, 60)),
  'S01-B01-SH04': {
    paper: '#26231f', paint: (p, L) => paintSh04(p, L),
    dom: (L) => {
      if (L < 27) return null;
      const q = squareCorners(sh04Cam(L)), mid: [number, number] = [(q[1][0] + q[2][0]) / 2, (q[1][1] + q[2][1]) / 2];
      return <AnchoredLabel anchor={mid} text="50 × 50 ซม." size={44} side="right" to={[mid[0] + 70, mid[1]]} ring={false} lineWidth={1} k={lin(27, 33, L)} />;
    },
  },
  'S01-B01-SH05': street('SH05'),
  'S01-B02-SH01': mapShot('S01-B02-SH01', OT02('S01-B02-SH01', 0, 0)),
  'S01-B02-SH02': mapShot('S01-B02-SH02', OT02('S01-B02-SH02', -10, -10)),
  'S01-B02-SH03': mapShot('S01-B02-SH03'),
  'S01-B03-SH01': mapShot('S01-B03-SH01'),
  'S01-B03-SH02': street('SH10'),
  'S01-B03-SH03': {
    ...street('SH11'),
    dom: (L) => {
      const n = L < 15 ? '3' : L < 30 ? '2' : '1', k = lin(0, 4, L % 15);
      return <div style={{position: 'absolute', left: 0, width: 1080, top: 520 - 150, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.35 + 0.65 * k, transform: `scale(${0.9 + 0.1 * k})`, ...labelStyle(260, '#ffffff', 22)}}>{L < 45 ? n : ''}</div>;
    },
  },
  'S01-B03-SH04': street('SH12'),
  'S01-B03-SH05': {paper: '#0b1430', paint: (p, L) => void paintSh13(p, L)},
  'S01-B03-SH06': {paper: '#0b1430', paint: (p, L) => void paintBalance(p, L)},
  'S01-B03-SH07': {
    paper: '#a9c8df',
    paint: (p, L) => { paintStreetLive(p, 'SH15', L, {extra: stageStreet(p, 'SH15', L)}); paintInset(p, L); },
  },
  'S01-B04-SH01': mapShot('S01-B04-SH01'),
  'S01-B04-SH02': {paper: '#9aa3ab', paint: (p, L) => void paintStadiumShot(p, 'SH17', L)},
  'S01-B04-SH03': {paper: '#9aa3ab', paint: (p, L) => void paintStadiumShot(p, 'SH18', L)},
  'S01-B04-SH04': {paper: '#101828', paint: (p, L) => void paintStadiumShot(p, 'SH19', L)},
  'S01-B04-SH05': {paper: '#101828', paint: (p, L) => void paintStadiumShot(p, 'SH20', L)},
  'S01-B04-SH06': {paper: '#1a2236', paint: (p, L) => void paintSh21(p, L)},
  'S01-B05-SH01': mapShot('S01-B05-SH01', (L) => {
    if (L < 141) return null;
    const cam = gShotCam('S01-B05-SH01', L), dot = gProject(cam, G_ANCHORS.MC.lat, G_ANCHORS.MC.lon);
    return <AnchoredLabel anchor={[dot.x, dot.y]} to={[760, 820]} text="คนทั้งโลก" ring={false} k={lin(141, 149, L)} />;
  }),
};

/** Slots by global frame g: LBL "ภาพจำลอง" [0, 118) and [1006, end); OT01 in LBL-W [118, 1006) with the cross-fade over [112, 118); OT05a/b in LBL2 [1103, 1154) / [1156, 1342). */
export const Slots = ({g}: {g: number}) => {
  const x = lin(112, 118, g);
  return (
    <>
      {(g < 118 || g >= 1006) && <div style={{opacity: g < 118 ? 1 - x : 1}}><LBL /></div>}
      {g >= 112 && g < 1006 && <LBLW fade={x} />}
      {g >= 1103 && g < 1154 && <LBL2 text="ซีแอตเทิล · 2011" />}
      {g >= 1156 && g < 1342 && <LBL2 text="ซีแอตเทิล · 2023" />}
    </>
  );
};

export const PAPER_OF = (id: ShotId) => SHOT_DEFS[id].paper;

export const ShotFrame = ({id, band = false}: {id: ShotId; band?: boolean}) => {
  const L = useCurrentFrame(), start = SH(id), g = start + L, def = SHOT_DEFS[id];
  const paint = useCallback(({brush, frame, t}: PaintContext) => def.paint(makePainter(brush, {t: frame / FPS, frame, fade: def.paper}), frame, t), [def]);
  return (
    <AbsoluteFill style={{background: def.paper}}>
      <BrushCanvas paint={paint} paper={def.paper} />
      {def.paper !== LOOK_COL.gulf && <Grain opacity={0.05} />}
      <Slots g={g} />
      {def.dom?.(L, g)}
      {band && (getInputProps() as {guides?: boolean}).guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};
export const shotLen = (id: ShotId) => SHOT_TABLE.find(([i]) => i === id)![2];
