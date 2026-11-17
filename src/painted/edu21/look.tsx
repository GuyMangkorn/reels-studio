import type {ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {camMove, camOf} from '../kit/cam-moves';
import {ell, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {paintFall} from '../kit/fall';
import {paintFigureAt} from '../kit/figure-at';
import type {FigAnchors} from '../kit/cast';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {camPoint, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {CAR, clipPolyPainter, paintCarExterior} from './car';
import {hull, wp} from '../kit/world';
import {paintCabin} from './cabin';
import {DRIVER, DRIVER_HIP, seatedGround} from './cast';
import {GlowLight, LabelChip, paintRouteGlow} from './glow';
import {paintAsphaltLip, paintRoadSet, paintStormSky, paintVergePuddles, paintVergeTufts, paintWetReflection, TONE_EXPLAIN, TONE_LIVE, vergePuddlePolys, type Tone} from './road';

// EDU-EP21-SHORT W3.1 look frames (Film, 2026-11-16; docs/sequence-workflow.md W3; brief EDU-EP21-BRIEF-R3, rows EDU-EP21-ROWS-R3;
// user 2026-11-16: casting Q2 as briefed, Q3 three look frames). One real shot frame per look family, painted with the episode set, CAR21
// and the kit cast through the shot's camera line from the brief's shot plan:
//   LF01 exterior storm, B01-SH01 frame 0 (pre-strike: far fork, dash glow on her face, front tyre large)
//   LF02 cabin interior, B01-SH04 start (post-strike: dash dark, hands in the lap, rain on the glass)
//   LF03 explanatory glow state, B02-SH06 late (world desaturated and cooled, warm band over the whole shell and spread in the road, chip)
// Stills only (no timeline, voice or captions). Dashed lines mark the caption band y 1176-1344 and the mark zone; the top-right tag names
// the shot. Off with --props='{"guides":false}' for scripts/caption-zone.py. Render: sh scripts/edu-series/ep21/short/render-looks.sh <version>

/** Lead record per look (hip-to-crown px of DRIVER and the car body height px), written while painting; read by the probe in look-measure.ts. */
export const MEASURE: Record<string, Record<string, number>> = {};

type Look = {shot: string; cam: YCam; t: number; paper: string; paint: (p: Painter) => void; overlay?: ReactNode};

/** DRIVER seated at the wheel, facing +x (the view follows the camera: view cues on). */
const paintDriver = (p: Painter, c: YCam, o: {face: Parameters<typeof paintFigureAt>[3]['face']; t: number; glow?: boolean; tint?: number; view?: 'back' | 'right' | 'left'; id: string}) => {
  const at = seatedGround(DRIVER, DRIVER_HIP, 'right');
  const a: FigAnchors | null = paintFigureAt(p, c, DRIVER, {at, ...(o.view ? {view: o.view} : {facing: [1, 0] as [number, number]}), pose: 'P31', face: o.face, t: o.t, shadow: false,
    ...(o.tint ? {tint: {to: '#3a4656', u: o.tint}} : {})});
  if (a) {
    MEASURE[o.id] = {...(MEASURE[o.id] ?? {}), headTop: Math.round(a.headTop), chin: Math.round(a.chin), top: Math.round(a.top), bottom: Math.round(a.bottom)};
    if (o.glow) washAt(p, 33001, '#9cc8f0', 58, ell(a.head[0] + 0.15 * (a.chin - a.headTop), a.chin - 0.35 * (a.chin - a.headTop), 0.62 * (a.chin - a.headTop), 0.5 * (a.chin - a.headTop), 18), 0.4, 0.2);
  }
  return a;
};

/** The wet asphalt (z -8.6..+2.4) as the reflection's clip, flipped about the horizon into the mirror drawing's own coordinates. */
const asphaltClip = (q: Painter, c: YCam) => clipPolyPainter(q, wp(c, [[-900, 0, -8.6], [900, 0, -8.6], [900, 0, 2.4], [-900, 0, 2.4]]).map(([x, y]) => [x, 2 * c.hy - y] as [number, number]));

const rain = (p: Painter, t: number, o: {count?: number; op?: string; seed?: number} = {}) => {
  paintFall(p, 'rain', {width: 1080, height: 1920, t, seed: o.seed ?? 1, captionBand: [1176, 1344], style: {count: o.count ?? 220, color: o.op ?? '#b4c2cc'}});
};

// ------------------------------------------------------------------------------------------------ LF01 exterior storm (B01-SH01 frame 0)
// Revised from the brief's SH01 line (r 4.6, pitch +4, f 1250, hy 700): closer and level with a lower horizon, so the car is the lead
// (>= 480 px), the front tyre sits large lower right and the frame does not sit high (UT03). Estimate; the W5.1 sheet re-validates it.
const SH01 = camMove([0.6, 0.55, 0.4], [40, 34], [3.8, 3.5], 0.45, {f: 1150, hy: 1000});
const lf01 = (): Look => {
  const c = camOf(SH01, 0), t = 0.2;
  return {shot: 'B01-SH01', cam: c, t, paper: '#262e38', paint: (p) => {
    const o = {t, tone: TONE_LIVE, fork: 200, forkSpan: [250, 560] as [number, number]};
    paintStormSky(p, c, o);
    paintRoadSet(p, c, o);
    paintWetReflection(p, c, (q, m) => paintCarExterior(asphaltClip(q, c), m, {dashGlow: true}), {alpha: 0.24, ripples: 34});
    paintCarExterior(p, c, {dashGlow: true, inside: (q, cc) => paintDriver(q, cc, {face: 'worried', t, glow: true, id: 'LF01'})});
    paintVergeTufts(p, c, {...o, z: [2.5, 3.9], x: [-1, 6], n: 46});
    rain(p, t);
  }};
};

// ------------------------------------------------------------------------------------------------ LF02 cabin interior (B01-SH04 start)
// Revised from the brief's SH04 line (camera behind the passenger headrest, yaw -118, f 640): rear-seat centre looking forward, a little
// toward her side, so the whole shell (lining, both A-pillars, windscreen, side glass) frames her at once (UT01 inside at a glance).
// Round 2 (BRIEF-R3, after the viewer check): lens back and lower at (-1.01, 1.08, -0.03), f 760, so her shoulder-high seat back and
// head-height headrest sit between the lens and her and she reads seated (R2 lens 0.3 m behind low seat backs read as standing).
const SH04 = camMove([0.3, 1.0, 0.3], [-104, -100], [1.35, 1.42], 1.08, {f: 760, hy: 820});
const lf02 = (): Look => {
  const c = {...camOf(SH04, 0), near: 0.12}, t = 7.6;
  return {shot: 'B01-SH04', cam: c, t, paper: '#262e38', paint: (p) => {
    const o = {t, tone: TONE_LIVE};
    paintStormSky(p, c, o);
    paintRoadSet(p, c, o);
    paintCabin(p, c, {t, dashGlow: false, driver: (q, cc) => paintDriver(q, cc, {face: 'neutral', t, tint: 0.12, id: 'LF02'})});
  }};
};

// ------------------------------------------------------------------------------------------------ LF03 explanatory glow state (B02-SH06 late)
// Round 3 (ROWS-R4): a lower, closer front-quarter lens (was yaw 4->0, r 5.4->5.1, eye 1.3->0.8, f 880, hy 960, a flat side view with the
// car 300 px tall over an empty verge). A front quarter 36 deg off the side keeps the whole car in the width while the car grows
// (recorded size exception), shows the nose as a second lit surface and keeps the far sugar palms off her head (yaw 26 put one over the
// roof like spiky hair); eye 0.65 m puts the road under the car and its mirror in the low frame.
const SH06 = camMove([0.4, 0.7, 0], [38, 36], [4.3, 4.1], 0.65, {f: 880, hy: 940});
// Boss W5.2 (EDU-EP21-SHEETS-R1, LF03 known defects 1, 2, 4 fixed at the set): the verge water is SET-ROAD21's `VERGE_PUDDLES`, re-laid
// inside this lens's ground footprint (was five R3 puddles this lens mostly missed: grey diagonal bands), tufts between them; the road
// mirror ends in a soft wet lip and the glow smear's wet mask is feathered (no straight warm edge at z 2.4); palm P1 moved (SD10).
const lf03 = (): Look => {
  const c = camOf(SH06, 0.85), t = 16.6, T: Tone = TONE_EXPLAIN;
  const water = vergePuddlePolys(c);
  const road = wp(c, [[-900, 0, -8.6], [900, 0, -8.6], [900, 0, 2.4], [-900, 0, 2.4]]);
  return {shot: 'B02-SH06', cam: c, t, paper: '#2c333c', paint: (p) => {
    const o = {t, tone: T};
    paintStormSky(p, c, o);
    paintRoadSet(p, c, o);
    const mirror = (q: Painter, m: YCam) => { paintCarExterior(q, m, {tone: T}); paintRouteGlow(q, m, {phase: 'road'}); };
    paintWetReflection(p, c, (q, m) => mirror(asphaltClip(q, c), m), {alpha: 0.24, tone: T});
    paintAsphaltLip(p, c, o);
    paintVergePuddles(p, c, {...o, mirror});
    paintRouteGlow(p, c, {phase: 'road', under: true});
    paintCarExterior(p, c, {tone: T, inside: (q, cc) => paintDriver(q, cc, {face: 'neutral', t, view: 'right', id: 'LF03'})});
    paintRouteGlow(p, c, {phase: 'road'});
    paintVergeTufts(p, c, {...o, z: [2.45, 3.4], x: [-4.5, -2.4], n: 26});
    paintVergeTufts(p, c, {...o, z: [3.05, 3.45], x: [1.1, 2.0], n: 12});
    paintVergeTufts(p, c, {...o, z: [2.5, 3.3], x: [2.5, 3.3], n: 10});
    paintVergeTufts(p, c, {...o, z: [3.3, 3.75], x: [2.4, 4.5], n: 14});
    rain(p, t, {count: 150, op: '#9aa6b0'});
  }, overlay: <><GlowLight c={c} wet={[road, ...water]} /><LabelChip /></>};
};

export const LOOK_DEFS: Record<string, () => Look> = {LF01: lf01, LF02: lf02, LF03: lf03};

const tc = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
const Still = ({id}: {id: string}) => {
  useCurrentFrame();
  const look = LOOK_DEFS[id]();
  const fn = useCallback(({brush, frame}: PaintContext) => look.paint(makePainter(brush, {t: look.t, frame, fade: '#3c4855'})), [look]);
  const guides = (getInputProps() as {guides?: boolean}).guides !== false;
  return (
    <AbsoluteFill style={{background: look.paper}}>
      <BrushCanvas paint={fn} paper={look.paper} />
      {look.overlay}
      <Grain opacity={0.05} />
      {guides && <>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.7)', borderBottom: '2px dashed rgba(255,255,255,0.7)'}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 330, height: 140, border: '2px dashed rgba(255,255,255,0.5)'}} />
        <div style={{position: 'absolute', right: 16, top: 16, font: '700 40px sans-serif', lineHeight: '48px', textAlign: 'right', color: '#fff', background: 'rgba(20,16,12,0.6)', padding: '6px 14px'}}>{`${id} · ${look.shot}`}<br />{`EDU-EP21-SHORT · est ${tc(look.t)}`}</div>
      </>}
    </AbsoluteFill>
  );
};
export const LOOKS = Object.fromEntries(Object.keys(LOOK_DEFS).map((id) => [id, () => <Still id={id} />])) as Record<string, () => ReactNode>;
