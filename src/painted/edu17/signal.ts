import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {C} from './palette';
import type {YardLayer} from './yard';

// N5 signal line + data pulse (brief N5; scene sheets B01-SH01, B01-SH02, B06-SH04; Boss W5). One world path in space R (metres): out of the phone top,
// up 2.5 m toward the sky (top-right from LF01), curling down over the wall, along the beach at about 0.5 m over the sand into the water at the entry
// point (-0.6, -1.5, -14), then (B06-SH04 only) along the bay surface toward the headland. Drawn by arc fraction `s` 0..1 over the land part; `sea`
// 0..1 extends it over the bay. Depth-correct in the yard: each segment is painted in the yard slot its z belongs to (behind the right palm, behind
// CP1, behind the wall top / in front of the plank, before the man), so the CP1 trunk and the wall occlude it (brief check).

const LAND: V3[] = [[-0.40, 1.19, -0.60], [-0.30, 2.2, -0.9], [0.10, 3.3, -1.4], [0.35, 3.6, -1.9], [0.0, 3.45, -2.3], [-0.6, 2.7, -2.7], [-0.85, 1.5, -3.2],
  [-0.75, 0.5, -4.5], [-0.62, -0.1, -7.5], [-0.58, -0.75, -11], [-0.60, -1.5, -14]];
/** Key arc fractions on LAND: the top of the rise, the curl down over the wall (B01-SH01 hold, B01-SH02 start), the water entry. */
export const S_TOP = 0.3, S_CURL = 0.6, S_WATER = 1;
const SEA: V3[] = [[-0.60, -1.5, -14], [-3, -1.5, -40], [-15, -1.5, -110], [-60, -1.5, -320], [-250, -1.5, -1100], [-600, -1.5, -1600]];

const cat = (P: V3[], u: number): V3 => {
  const n = P.length - 1, x = Math.min(n - 1e-6, Math.max(0, u * n)), i = Math.floor(x), t = x - i;
  const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)];
  const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  return [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1]), f(p0[2], p1[2], p2[2], p3[2])];
};
/** World point at land fraction `s` (0 phone .. 1 water entry). */
export const signalAt = (s: number): V3 => cat(LAND, s);
export const ENTRY: V3 = [-0.60, -1.5, -14];
const slotOf = (z: number): YardLayer => (z < -4.5 ? 'far' : z < -2.5 ? 'p1' : z < -0.75 ? 'p2' : 'plank');
const ORDER: YardLayer[] = ['far', 'p1', 'p2', 'plank', 'near'];

export type SignalOpts = {s: number; sea?: number; dashed?: boolean; alpha?: number; /** tip squash 0..1 (the brake). */ squash?: number; t?: number};
/** Paint the parts of the line that belong to `slot` (call from paintYard's `layer`); `slot` undefined paints all (no occlusion: under water). */
export const paintSignal = (p: Painter, c: YCam, o: SignalOpts, slot?: YardLayer) => {
  const a = o.alpha ?? 1, core = mixColor('#ffffff', C.sand, 1 - a), glow = mixColor(C.glow, C.sand, (1 - a) * 0.85), edge = mixColor('#2a8fb0', C.sand, 1 - a);
  const pts: {q: Pt; v: V3}[] = [];
  const nL = Math.max(2, Math.ceil(o.s * 140));
  for (let i = 0; i <= nL; i++) { const v = signalAt((o.s * i) / nL); const q = camPoint(c, v); if (q) pts.push({q, v}); }
  if (o.sea) for (let i = 1; i <= 80; i++) { const v = cat(SEA, (o.sea * i) / 80); const q = camPoint(c, v); if (q) pts.push({q, v}); }
  // split into runs by slot, painting only this slot's runs
  const runs: {pts: Pt[]; ws: number[]}[] = [];
  let cur: {pts: Pt[]; ws: number[]} | null = null;
  pts.forEach(({q, v}, i) => {
    const mine = slot === undefined || slotOf(v[2]) === slot || (slot === 'near' && !ORDER.includes(slotOf(v[2])));
    if (mine) { if (!cur) { cur = {pts: i > 0 ? [pts[i - 1].q] : [], ws: i > 0 ? [camUnit(c, pts[i - 1].v)] : []}; runs.push(cur); } cur.pts.push(q); cur.ws.push(camUnit(c, v)); }
    else if (cur) { cur.pts.push(q); cur.ws.push(camUnit(c, v)); cur = null; }
  });
  runs.forEach((r, k) => {
    if (r.pts.length < 2) return;
    const w = Math.max(1.6, Math.min(14, 0.035 * r.ws[Math.floor(r.ws.length / 2)]));
    if (o.dashed) {
      for (let i = 0; i + 1 < r.pts.length; i += 4) inkLine(p, 8700 + ((k * 61 + i) % 900), [r.pts[i], r.pts[Math.min(r.pts.length - 1, i + 2)]], {closed: false, color: core, weight: w * 0.55, still: true, curve: 0});
      return;
    }
    inkLine(p, 8600 + k * 3, r.pts, {closed: false, color: edge, weight: w * 1.25, still: true, curve: 0.4});
    inkLine(p, 8601 + k * 3, r.pts, {closed: false, color: glow, weight: w * 0.95, still: true, curve: 0.4});
    inkLine(p, 8602 + k * 3, r.pts, {closed: false, color: core, weight: w * 0.4, still: false, curve: 0.4});
  });
  // the head: a bright drop, squashed against the sky on the brake
  const head = pts[pts.length - 1];
  if (!o.dashed && head && (slot === undefined || slotOf(head.v[2]) === slot) && o.s < 0.999) {
    const k = camUnit(c, head.v), r = Math.max(4, Math.min(26, 0.07 * k)), sq = o.squash ?? 0;
    washAt(p, 8690, C.glow, 110 * a, ell(head.q[0], head.q[1], r * 2.4 * (1 + sq * 0.5), r * 2.4 * (1 - sq * 0.4), 14), 0.2, 0);
    hardFill(p, 8691, core, ell(head.q[0], head.q[1], r * (1 + sq * 0.6), r * (1 - sq * 0.45), 12));
  }
};

/** The splash where the line enters the water (B01-SH02 L27-33): a ring and a few drops, `u` 0..1 over the splash. */
export const paintEntrySplash = (p: Painter, c: YCam, u: number) => {
  const q = camPoint(c, ENTRY);
  if (!q || u <= 0 || u >= 1) return;
  const k = camUnit(c, ENTRY), r = (0.4 + 1.6 * u) * k;
  inkLine(p, 8695, ell(q[0], q[1], r, r * 0.3, 24), {color: mixColor('#ffffff', C.bayNear, u), weight: Math.max(1.5, 0.08 * k * (1 - u)), still: true});
  for (let i = 0; i < 7; i++) { const a = Math.PI * (0.15 + 0.1 * i), h = Math.sin(Math.PI * u) * 0.9 * k; hardFill(p, 8696 + i, '#ffffff', ell(q[0] + Math.cos(a) * r * 0.5 * (i % 2 ? 1 : -1), q[1] - h * (0.5 + 0.5 * Math.sin(a)), 0.06 * k + 1, 0.08 * k + 1, 8)); }
  hardFill(p, 8694, mixColor(C.glow, '#ffffff', 0.4), ell(q[0], q[1], 0.25 * k * (1 - u) + 1, 0.1 * k * (1 - u) + 1, 10));
};
