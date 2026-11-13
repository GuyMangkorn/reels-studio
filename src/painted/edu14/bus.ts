// EDU-EP14 bus-stop shots (N1, N2, N15): the set (busstop.ts) + the GIRL on her mark + the K01 pendants drawn with `drop.ts` + ENV-FALL rain. One paint function for
// every shot that stands in SET-BUSSTOP (B01-SH01/02/03/09, B02-SH03, B03-SH02, B04-SH01, B05-SH01/03), parameterised by pose, view, face, world and extras.
import {paintFall} from '../kit/fall';
import {paintFigureAt, type FigureAtOpts, VIEW_CUES_OFF} from '../kit/figure-at';
import {poseArms} from '../kit/poses';
import {layerMotion, type LayerArgs} from '../kit/motions';
import type {FigAnchors} from '../kit/cast';
import type {Painter} from '../kit/painter';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintBusStop, paintLipDrips, SHELTER, type World} from './busstop';
import {paintDrop14, REFRACT_NOAIR, REFRACT_REAL} from './drop';
import {GIRL, GIRL_AT} from './palette';

export const CAPTION_BAND: [number, number] = [1176, 1344];

export type BusShot = {
  world: World;
  /** Seconds on the plate clock (rain, drip phase); frozen worlds pass a constant. */
  t?: number;
  pose?: FigureAtOpts['pose'];
  view?: FigureAtOpts['view'];
  face?: FigureAtOpts['face'];
  faceState?: FigureAtOpts['faceState'];
  /** Fixed arms/fields over the pose (e.g. a motion's frame). */
  fig?: FigureAtOpts['fig'];
  at?: [number, number, number];
  girl?: boolean;
  /** ENV-FALL rain count (real world only; 0 = none). Default 260. */
  rain?: number;
  /** Rain only inside this x range (px): the curtain beyond the drip line. */
  rainX?: [number, number];
  /** Pendant drops on the lip: 'placeholder' = busstop tiny beads, 'drop' = `drop.ts` where >= 20 px tall; the one at `release` lets go. */
  lips?: boolean;
  lead?: Lead;
  /** Sky card after the base sky bands (SET-COLUMN deck when looking up). */
  sky?: (p: Painter, c: YCam) => void;
  /** Painting after the set and before the girl (a prop behind her). */
  behind?: (p: Painter, c: YCam) => void;
  /** Painting inside the set after the ground, road and shophouses and before the shelter and near props (z <= 1.4): the road traffic beyond the kerb, which the
   * shelter posts, the power pole, the sign pole and the bin must cover. */
  road?: (p: Painter, c: YCam) => void;
  /** Extra painting after the girl and before the rain (e.g. a held prop). */
  extra?: (p: Painter, c: YCam) => void;
  held?: FigureAtOpts['held'];
  seed?: number;
  shadow?: FigureAtOpts['shadow'];
};

/** P30's hand (the kit table is for the 1.66 m adult) lands on the child's eye: raise the visor hand 0.055 m (as LF01). */
export const p30Fix = (c: YCam, at = GIRL_AT): FigureAtOpts['fig'] => {
  const g = camPoint(c, at), u = camUnit(c, at), base = g ? poseArms('P30', GIRL, g, u, 'front') : null;
  const lArm = base?.lArm ? {...base.lArm, to: [base.lArm.to[0] + 0.012 * u, base.lArm.to[1] - 0.055 * u] as [number, number], via: base.lArm.via ? [base.lArm.via[0], base.lArm.via[1] - 0.02 * u] as [number, number] : undefined} : undefined;
  return lArm ? {lArm} : undefined;
};

/** The lead pendant (K01): the lip bead nearest x 0.25 (x 0.2337 in the seeded sequence; `tests/edu14-assets.test.ts` checks it) swells in B01-SH01 and lets go in B03-SH02. */
export const LEAD_X = 0.2337;
const isLead = (x: number) => Math.abs(x - LEAD_X) < 0.002;

/** Pendant callback for `paintLipDrips`: `drop.ts` teardrops where >= 14 px tall; the lead one swells (`lead.swell`) and lets go (`lead.release` 0..1, `lead.fall` mm below the lip). */
const pendantWith = (world: World, lead: Lead) => (p: Painter, c: YCam, x: number, swell: number, i: number) => {
  const q = camPoint(c, [x, SHELTER.yLip - 0.05, SHELTER.zLip + 0.012]);
  if (!q) return true;
  const u = camUnit(c, [x, SHELTER.yLip - 0.05, SHELTER.zLip]) / 1000, L = isLead(x);
  const rel = L ? lead.release ?? 0 : 0, fall = L && rel > 0 ? lead.fall ?? 0 : 0;
  paintDrop14(p, [q[0], q[1] + fall * u], u, {kind: 'pendant', size: 6, swell: L && lead.swell !== undefined ? lead.swell : swell, release: rel}, {refract: world === 'noair' ? REFRACT_NOAIR : REFRACT_REAL, seed: 14000 + i * 300});
  return true;
};
export type Lead = {swell?: number; release?: number; fall?: number};

export const paintBus = (p: Painter, c: YCam, s: BusShot): FigAnchors | null => {
  const t = s.t ?? 0.4, w = s.world, o = {world: w, t, sky: s.sky, pendant: pendantWith(w, s.lead ?? {}), mid: s.road};
  paintBusStop(p, c, o);
  s.behind?.(p, c);
  let a: FigAnchors | null = null;
  if (s.girl !== false) {
    const fig = s.fig ?? (!s.pose || s.pose === 'P30' ? p30Fix(c, s.at ?? GIRL_AT) : undefined);
    a = paintFigureAt(p, c, GIRL, {...VIEW_CUES_OFF, at: s.at ?? GIRL_AT, view: s.view ?? 'front', pose: s.pose ?? 'P30', face: s.face ?? 'neutral', faceState: s.faceState ?? {look: [0.0, -0.8]}, fig, t, shadow: s.shadow ?? {op: 70}, held: s.held, seed: s.seed});
  }
  s.extra?.(p, c);
  if (s.lips !== false) paintLipDrips(p, c, o);
  if (w === 'real' && (s.rain ?? 260) > 0) paintFall(p, 'rain', {width: 1080, height: 1920, t, captionBand: [...CAPTION_BAND], xRange: s.rainX, style: {count: s.rain ?? 260}});
  return a;
};

/** A motion layered on the GIRL for the camera `c`: `fig` and `faceState` to hand to `paintBus` (the arm targets are px about her ground point at this lens). */
export const motionFig = (c: YCam, motion: LayerArgs['motion'], t: number, o: {view?: 'front' | 'left' | 'right' | 'back'; pose?: LayerArgs['pose']; at?: [number, number, number]} = {}) => {
  const at = o.at ?? GIRL_AT, g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return {};
  const l = layerMotion({person: GIRL, motion, t, g, unit: u, view: o.view ?? 'front', pose: o.pose ?? 'P30'});
  const {face, view: _v, ...fig} = l.pose as unknown as Record<string, unknown> & {face: unknown; view: unknown};
  void _v;
  return {fig: fig as FigureAtOpts['fig'], faceState: face as FigureAtOpts['faceState']};
};
