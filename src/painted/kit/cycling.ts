// Filed from EDU-EP14 (KIT-P01, W8.4; a copy: the episode keeps edu14/rider.ts). `cycling kit` outfit on `man-spiky`, `racing-tuck` pose fields and a `road bike`
// painted from the rig's hip anchor (profile facing screen right; wheel spin, spray). Metres about the ground point under the saddle.
import {ell, hardFill, inkLine, washAt} from './draw';
import {hash} from './hash';
import {paintFigureAt, hipAnchor} from './figure-at';
import type {CastDef, FigPose} from './cast';
import {PEOPLE} from './people';
import {mixColor, type Painter, type Pt} from './painter';
import {camPoint, camUnit, type YCam} from './ycam';

const ink = (p: Painter, id: number, pts: Pt[], weight: number, color: string) => inkLine(p, id, pts, {weight, color, curve: 0.1, still: true});
const line = (p: Painter, id: number, a: Pt, b: Pt, w: number, color: string) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = (-dy / l) * (w / 2), ny = (dx / l) * (w / 2);
  inkLine(p, id, [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]], {weight: Math.max(0.8, w / 6), color, curve: 0, still: true});
  p.flat(color, [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]);
};
export const RIDER_KIT = {shell: '#26323a', shellLit: '#3d4e58', bibs: '#15171a', helmet: '#f4f4f0', frame: '#2a3a40', tyre: '#16191b', rim: '#aab4b8', skin: '#8d5a3c'} as const;
const BASE = PEOPLE['man-spiky'];
/** `new: cycling kit` on `man-spiky`: shell jacket, bib shorts (knee-length shorts, black socks), white helmet, clear glasses. */
export const RIDER: CastDef = {
  ...BASE, head: {...BASE.head, glasses: true},
  outfit: {...BASE.outfit, shirt: RIDER_KIT.shell, sleeve: RIDER_KIT.shell, jacket: RIDER_KIT.shell, longSleeves: true, pants: RIDER_KIT.bibs, shoes: '#20262a', shorts: {sock: '#15171a'}, gear: {hat: {kind: 'helmet', color: RIDER_KIT.helmet, band: '#d4d8d6'}}},
};
/** Body fields of the tuck: seated on the saddle (feet 0.42 m up on the pedals), torso pitched to the bars. */
export const TUCK: Partial<FigPose> = {sit: 1, lift: 0.42, bend: 1, head: 'right'};
/** Bike geometry in metres about the hip (x forward, y up from the ground): wheel radius 0.34, axles 0.98 m apart. */
export const BIKE = {wheelR: 0.34, rear: -0.45, front: 0.55, bb: 0.0, bbY: 0.3, bars: [0.5, 0.86] as [number, number]};

export const paintRider = (p: Painter, c: YCam, o: {at: [number, number, number]; t: number; spray?: boolean; seed?: number}) => {
  const g = camPoint(c, o.at), u = camUnit(c, o.at);
  if (!g) return null;
  const S = (x: number, y: number): Pt => [g[0] + x * u, g[1] - y * u]; // metres about the ground point under the saddle (x forward = screen right)
  const hip = hipAnchor(RIDER, g, u, {view: 'right', ...TUCK});
  const hipM: Pt = [(hip[0] - g[0]) / u, (g[1] - hip[1]) / u];
  const seed = o.seed ?? 34000, R = BIKE.wheelR, rear = S(hipM[0] + BIKE.rear, R), front = S(hipM[0] + BIKE.front, R), bb = S(hipM[0] + BIKE.bb, BIKE.bbY);
  const saddle = S(hipM[0] - 0.08, hipM[1] - 0.04), head = S(hipM[0] + 0.42, hipM[1] - 0.06), bars = S(hipM[0] + BIKE.bars[0], BIKE.bars[1]);
  const wheel = (cx: number, cy: number, k: number) => {
    const r = R * u, spin = o.t * 9;
    hardFill(p, seed + k, RIDER_KIT.tyre, ell(cx, cy, r, r, 30));
    hardFill(p, seed + k + 1, '#e3eaec', ell(cx, cy, r * 0.88, r * 0.88, 30));
    washAt(p, seed + k + 2, RIDER_KIT.rim, 60, ell(cx, cy, r * 0.88, r * 0.88, 30), 0, 0);
    for (let i = 0; i < 12; i++) { const a = spin + (i / 12) * 6.283; p.inkStill(seed + k + 10, 'pen', '#7c878b', 0.6); line(p, seed + k + 10 + i, [cx, cy], [cx + Math.cos(a) * r * 0.86, cy + Math.sin(a) * r * 0.86], 0.6, '#7c878b'); }
    ink(p, seed + k + 3, ell(cx, cy, r, r, 30), Math.max(1.2, r / 14), RIDER_KIT.tyre);
    hardFill(p, seed + k + 4, '#aab4b8', ell(cx, cy, r * 0.08, r * 0.08, 8));
  };
  // far side: wheels and frame behind the rider
  wheel(rear[0], rear[1], 0); wheel(front[0], front[1], 40);
  const fw = Math.max(2.2, 0.03 * u);
  [[saddle, bb], [saddle, head], [head, bb], [bb, rear], [saddle, rear], [head, front]].forEach(([a, b], i) => line(p, seed + 100 + i, a as Pt, b as Pt, fw, RIDER_KIT.frame));
  line(p, seed + 110, saddle, [saddle[0] - 0.05 * u, saddle[1] + 0.03 * u], 0.03 * u, '#111');
  line(p, seed + 111, head, [bars[0] - 0.02 * u, bars[1]], fw * 0.8, RIDER_KIT.frame);
  line(p, seed + 112, [bars[0] - 0.02 * u, bars[1]], [bars[0] + 0.07 * u, bars[1] + 0.05 * u], fw * 0.8, RIDER_KIT.frame);
  // rider: arms on the bars (the drops), legs seated on the pedals
  const a = paintFigureAt(p, c, RIDER, {at: o.at, view: 'right', pose: 'P01', face: 'neutral', t: o.t, shadow: false, seed: o.seed, fig: {...TUCK, rArm: {to: [bars[0] + 0.05 * u, bars[1] + 0.04 * u], via: [bars[0] - 0.12 * u, bars[1] - 0.14 * u]}, lArm: {to: [bars[0] + 0.05 * u, bars[1] + 0.04 * u], via: [bars[0] - 0.12 * u, bars[1] - 0.14 * u]}}});
  // spray off both wheels (the rain: pale streaks flung up and back), ground splash
  if (o.spray !== false) for (const w of [rear, front]) for (let i = 0; i < 9; i++) {
    const k = hash(seed + 300 + i + (w === rear ? 0 : 20)), len = (0.18 + 0.42 * k) * u, x0 = w[0] - 0.04 * u * i, y0 = w[1] - R * u * (0.6 + 0.4 * hash(seed + 330 + i));
    inkLine(p, seed + 400 + i + (w === rear ? 0 : 20), [[x0, y0], [x0 - len, y0 - len * 0.35 * k]], {weight: Math.max(1, u / 160), color: mixColor('#dfe9ee', '#9aa8ad', k), closed: false, still: true});
  }
  void hardFill;
  return a;
};
