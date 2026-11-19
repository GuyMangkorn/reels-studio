import type {CastDef, FigAnchors, FigPose} from '../kit/cast';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {arm, noseOf} from './r4-looks';
import {MARCUS_BARE, paintRibbons, R4} from './r4-cast';
import {lerp, yc} from './stage26';

// EDU-EP26-SHORT shared shot acting (Boss W5.2, 2026-11-18): the moves several shot files share (tread cycle, walking between marks, a hand on a
// world point, the CL04 shoulder ribbons at ledger strength, Marcus's damp hem). Staging values stay in the shot files. No Remotion import.

/** CL01 template (B01-SH06 vow, B03-SH04 hands state): the two raised mittens' world anchors and the vow camera; they land on (380, 900) and
 *  (700, 900), the spots the B03-SH04 match cut puts his feet on. */
// W5.2 deviation: on the four-head rig the sheet's anchors (-0.447, 1.39, 0.38) / (-0.153, 1.39, 0.38) sit at mouth height (the chin is at
// about 1.21 m), so the raised mittens covered his face. The screen spots are the contract: the anchors drop to chest-to-shoulder height
// (y 1.08) and the vow camera's horizon rises (hy 643) so the drawn mitten centres still land on (380, 900) / (700, 900) (measure-shots.ts,
// no drift); his face moves up with it. Film to confirm.
export const CL01_R: V3 = [-0.465, 1.073, 0.38], CL01_L: V3 = [-0.154, 1.073, 0.38];
export const VOW_CAM = yc(-0.3, 1.4, 1.3, 0, -4, 1000, 643);

/** Marcus barefoot with the tunic damp-dark to the knee (B04 after the time-passing dissolve; sheet A change 4). */
export const MARCUS_DAMP: CastDef = {...MARCUS_BARE, outfit: {...MARCUS_BARE.outfit, skirt: mixColor(R4.tunicMarcus, '#1d2c40', 0.38)}};

/** Treading in place, front view: one step per `period` frames from `from` (right foot first), knee lift `amp` degrees (0 before `from`). */
export const treadKick = (L: number, from: number, period: number, amp = 26): FigPose['legKick'] => {
  if (L < from) return undefined;
  const s = (L - from) / period, n = Math.floor(s), k = Math.sin(Math.PI * (s - n)), lift = {hip: amp * k, knee: amp * 1.2 * k};
  return n % 2 ? {l: lift} : {r: lift};
};
/** Variable-rate tread: the step period eases from `p0` to `p1` frames over [a, b] (B03-SH06 slows to a bob); integrates the phase. */
export const treadSlowing = (L: number, p0: number, p1: number, a: number, b: number, amp = 22): FigPose['legKick'] => {
  let ph = 0;
  for (let i = 0; i < L; i++) { const k = Math.max(0, Math.min(1, (i - a) / (b - a))); ph += 1 / lerp(p0, p1, k); }
  const n = Math.floor(ph), k = Math.sin(Math.PI * (ph - n)), q = amp * (1 - 0.6 * Math.max(0, Math.min(1, (L - a) / (b - a))));
  const lift = {hip: q * k, knee: q * 1.2 * k};
  return n % 2 ? {l: lift} : {r: lift};
};

/** A walk between two marks: position eased linearly over [a, b], walk phase from the distance (0.62 m per cycle), stride easing in and out. */
export const walkBetween = (L: number, a: number, b: number, from: V3, to: V3) => {
  const k = Math.max(0, Math.min(1, (L - a) / (b - a))), at: V3 = [lerp(from[0], to[0], k), lerp(from[1], to[1], k), lerp(from[2], to[2], k)];
  const d = Math.hypot(to[0] - from[0], to[2] - from[2]) * k, moving = L > a && L < b;
  const stride = moving ? Math.min(1, (L - a) / 6, (b - L) / 6) : 0;
  return {at, walk: moving ? d / 0.62 : undefined, stride, k};
};

/** The hand at a world point; the elbow `drop` metres below and `out` metres outward of it in the picture (`side` 1 = the character's right
 *  arm, which is screen left on a figure facing the lens; `out` < 0 tucks the elbow in). `act` re-solves the elbow on the drawn shoulder. */
export const armTo = (c: YCam, w: V3, side: 1 | -1, o: {open?: boolean; fist?: boolean; drop?: number; out?: number} = {}) => {
  const to = camPoint(c, w);
  if (!to) return undefined;
  const u = camUnit(c, w), via: Pt = [to[0] - side * (o.out ?? 0.1) * u, to[1] + (o.drop ?? 0.22) * u];
  return arm(to, via, o.fist ? {fist: side} : {open: side});
};

const unit = (f: [number, number]) => { const n = Math.hypot(f[0], f[1]); return [f[0] / n, f[1] / n] as [number, number]; };
/** Two hand points in front of a figure at `at` facing `f`: `y` height, `fwd` reach, `half` the half-spread (character's right first). */
export const handsOf = (at: V3, f: [number, number], y: number, fwd = 0.3, half = 0.2): [V3, V3] => {
  const [fx, fz] = unit(f), rx = -fz, rz = fx; // body right = forward x up
  const c: V3 = [at[0] + fx * fwd, y, at[2] + fz * fwd];
  return [[c[0] + rx * half, y, c[2] + rz * half], [c[0] - rx * half, y, c[2] - rz * half]];
};

/** CL04 ribbons off a figure's shoulders (ledger count and strength): up and out past the head, the wave travelling with `t`. */
export const shoulderRibbons = (p: Painter, an: FigAnchors, u: number, t: number, o: {n: number; strength: number; grow?: number; seed: number;
  side?: 'both' | 'l' | 'r'; thin?: boolean; reach?: number; under?: boolean}) => {
  const K = (an.chin - an.headTop) / 2.39, reach = o.reach ?? 1, w = (o.thin ? 0.045 : 0.07) * u;
  const sides: ('l' | 'r')[] = o.side === 'l' ? ['l'] : o.side === 'r' ? ['r'] : ['l', 'r'];
  let left = o.n;
  sides.forEach((s, i) => {
    const n = i === sides.length - 1 ? left : Math.ceil(o.n / sides.length);
    left -= n;
    if (n <= 0) return;
    const sh = s === 'l' ? an.lShoulder : an.rShoulder, dir = sh[0] < an.head[0] ? -1 : 1;
    const from: Pt = [sh[0], sh[1] - 0.02 * u], to: Pt = [an.head[0] + dir * (1.0 * K + 0.2 * u) * reach, an.headTop - 0.35 * u * reach];
    const ro = {spread: 0.06 * u, bow: dir * 0.22, waves: 1.6, count: n, t, grow: o.grow, strength: o.strength};
    // `under` (B03-SH06 W5.3): the LF04 darker under-pass lifts the ribbons off the light well
    if (o.under) paintRibbons(p, o.seed + i * 40, from, to, {...ro, w: w * 1.6, op: 120, color: '#8a8443', edge: 0});
    paintRibbons(p, o.seed + i * 40, from, to, {...ro, w, op: 220, edge: o.under ? 1.8 : undefined});
  });
};
/** Ribbons from a world source (jar mouth, liquid) to a picture target (a nose), ledger strength. */
export const sourceRibbons = (p: Painter, c: YCam, src: V3, to: Pt, t: number, o: {n: number; strength: number; grow?: number; seed: number; w?: number; bow?: number; under?: boolean}) => {
  const a = camPoint(c, src);
  if (!a) return;
  const u = camUnit(c, src);
  if (o.under) paintRibbons(p, o.seed, a, to, {w: (o.w ?? 0.08 * u) * 1.6, op: 120, color: '#8a8443', edge: 0, spread: 0.06 * u, bow: o.bow ?? 0.18, waves: 1.7, count: o.n, t, grow: o.grow, strength: o.strength});
  paintRibbons(p, o.seed, a, to, {w: o.w ?? 0.08 * u, op: 200, edge: o.under ? 1.8 : undefined, spread: 0.06 * u, bow: o.bow ?? 0.18, waves: 1.7, count: o.n, t, grow: o.grow, strength: o.strength});
};
export {noseOf};
