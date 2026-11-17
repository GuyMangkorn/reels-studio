import {paintFall} from '../kit/fall';
import type {Painter, Pt} from '../kit/painter';
import {wp} from '../kit/world';
import type {YCam} from '../kit/ycam';
import {clipPolyPainter, paintCarExterior, type CarOpts} from './car';
import {paintAsphaltLip, paintFarFork, paintRoadSet, paintStormSky, paintVergePuddles, paintVergeTufts, paintWetReflection, TONE_LIVE, type Tone} from './road';

// SET-ROAD21 exterior stack for the plates (Boss W5.2 BG1, 2026-11-16), the LF01 look-frame order hardened for motion: storm sky, far fork
// at a level, land and road, the car mirrored in the wet asphalt (ending in a soft lip at the verge, LF03 defect 1) and in the verge
// puddles (defect 2, opt-in), CAR21 with whatever is inside, verge tufts. Rain is separate (`paintRain`), last, on the composition clock.

/** The wet asphalt (z -8.6..+2.4) as a clip for the mirror drawing, flipped about the horizon into the mirror's own coordinates. */
export const asphaltClip = (q: Painter, c: YCam): Painter =>
  clipPolyPainter(q, wp(c, [[-900, 0, -8.6], [900, 0, -8.6], [900, 0, 2.4], [-900, 0, 2.4]]).map(([x, y]) => [x, 2 * c.hy - y] as Pt));

export type ExteriorOpts = {
  /** Composition seconds (G / 30): splash rings and puddle rings. */
  t: number;
  tone?: Tone;
  car?: CarOpts;
  /** Far fork (N5 far) at picture column `x` over picture span `span`, painted at `level` 0..1 (0 = none). */
  fork?: {x: number; span: [number, number]; level: number};
  /** Near verge tufts (world x and z ranges, count); LF01 values by default. */
  tufts?: {x: [number, number]; z: [number, number]; n: number}[];
  /** Verge puddles (`VERGE_PUDDLES`, LF03 defect 2). Default off: the SH01/SH03 lenses stand beside them and the water would replace the
   *  approved LF01 verge with a mirrored red car in the caption band (open question to Film in the BG1 handoff). */
  puddles?: boolean;
  /** Mirror alpha in the wet asphalt (LF01 0.24) and its ripple band count (LF01 34). */
  mirror?: {alpha: number; ripples: number};
  /** Boss W5.2 BG3 (opt-in): extra marks drawn in each mirror after the mirrored car (the route glow coat), on the road under the car
   *  before it (the glow's road tint) and over the car before the tufts (the glow coat). Absent = BG1/BG2 unchanged. */
  inMirror?: (q: Painter, m: YCam) => void;
  underCar?: (p: Painter, c: YCam) => void;
  /** Dusk warmth 0..1 on the horizon band (road.ts `warm`, VD09; SH13 lifts it to #b8a48a). */
  warm?: number;
  overCar?: (p: Painter, c: YCam) => void;
};

export const paintExterior = (p: Painter, c: YCam, o: ExteriorOpts) => {
  const T = o.tone ?? TONE_LIVE, ro = {t: o.t, tone: T, ...(o.warm ? {warm: o.warm} : {})};
  paintStormSky(p, c, ro);
  if (o.fork && o.fork.level > 0) paintFarFork(p.layer(o.fork.level, 21390), c, T, o.fork.x, o.fork.span);
  paintRoadSet(p, c, ro);
  const carMirror = {...o.car, inside: undefined, tone: T};
  const mirrorDraw = (q: Painter, m: YCam) => { paintCarExterior(q, m, carMirror); o.inMirror?.(q, m); };
  paintWetReflection(p, c, (q, m) => mirrorDraw(asphaltClip(q, c), m), {alpha: o.mirror?.alpha ?? 0.24, ripples: o.mirror?.ripples ?? 34, tone: T});
  paintAsphaltLip(p, c, ro);
  if (o.puddles) paintVergePuddles(p, c, {...ro, mirror: mirrorDraw});
  o.underCar?.(p, c);
  const sil = paintCarExterior(p, c, {...o.car, tone: T});
  o.overCar?.(p, c);
  (o.tufts ?? [{x: [-1, 6], z: [2.5, 3.9], n: 46}]).forEach((k) => paintVergeTufts(p, c, {...ro, ...k}));
  return sil;
};

/** Rain on the composition clock, thinned in the caption band (as the look frames). */
export const paintRain = (p: Painter, t: number, o: {count?: number; color?: string; seed?: number} = {}) =>
  paintFall(p, 'rain', {width: 1080, height: 1920, t, seed: o.seed ?? 1, captionBand: [1176, 1344], style: {count: o.count ?? 220, color: o.color ?? '#b4c2cc'}});
