import {camMove, camOf} from '../../kit/cam-moves';
import {inkLine, washAt} from '../../kit/draw';
import type {Painter, Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {wp} from '../../kit/world';
import {camPoint, type YCam} from '../../kit/ycam';
import {ghPt} from '../car';
import {B01_DRIVER, paintDriverAt} from '../driver';
import {paintExterior, paintRain} from '../exterior';
import {horizonY} from '../road';
import {makeShot} from '../shot';

// B01-SH03 · G100-223 · the whole closed car (L02). EDU-EP21-SHEETS-R1 shot block (SD01 oblique, Q4); Boss W5.2 BG1, 2026-11-16.
// Camera `cam((0.3, 0.75, 0), 34->40, 4.4->4.6, 0.9->2.3, 880, 900, pitch 0->-20)` over L0-123, linear (crane up, roof read at the end).
// VD05 sweeps: one painted specular band #f2f4f6 at 0.8 travelling 14 f then fading 6 f: roof edge across the windscreen header
// (TF z -0.64 -> +0.64) then down the drip rail TF -> TR (z +0.64, y 1.49), 2x width (SHEETS-R2 D-Q5) L53-67,
// body shoulder line nose -> tail (z +0.85) L68-82, side glass front door -> rear door L89-101 (12 f). Far fork flickers once at L20 on
// the horizon left. DRIVER still, `worried`, hands on the thighs (B01 track). No text labels; damage unreadable (SD12).

const CAM = camMove([0.3, 0.75, 0], [34, 40], [4.4, 4.6], [0.9, 2.3], {f: 880, hy: 900, pitch: [0, -20]});
const N = 123;
const SPEC = '#f2f4f6';

/** Sweep level and travel (0..1) for a sweep that starts at `a` and travels `n` frames, then fades 6 frames. */
const sweep = (L: number, a: number, n: number) => (L < a ? null : L <= a + n ? {k: (L - a) / n, lv: 0.8} : L < a + n + 6 ? {k: 1, lv: 0.8 * (1 - (L - a - n) / 6)} : null);

/** Upper edge of the flank (the beltline / bonnet / deck line from the profile), y at x, just under it. */
const shoulderY = (x: number) => {
  const pts: [number, number][] = [[2.18, 0.76], [1.98, 0.84], [1.05, 0.92], [-1.55, 0.96], [-2.08, 0.94], [-2.2, 0.86]];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    if (x <= x0 && x >= x1) return y0 + ((y1 - y0) * (x0 - x)) / (x0 - x1) - 0.015;
  }
  return 0.9;
};

type Band = {quad: V3[]; core: V3[]; lv: number; seed: number; weight?: number};

/** The sweep bands live at frame L (0..3 of them): world quads and their core lines, with level. */
const sweepBands = (L: number): Band[] => {
  const out: Band[] = [];
  // roof edge (Boss W5.2f FX1, SHEETS-R2 D-Q5): from this near-level lens (eye ~1.5 m at L53) the roof plane is edge-on, so the band runs
  // across the windscreen header (TF z -0.64 -> +0.64) first, then turns down the near drip rail (TF -> TR at z +0.64): one 0.7 m
  // highlight travelling the 2.66 m path, each piece twice the width of the other two sweeps (0.2 m across the edge, on the face the lens sees: the
  // header / the side-frame top, v 0.775..1 of the 0.88 m slant; core weight 8 on the edge; a thin roof strip for the crane's end). Value cap 0.8 and frames L53-67 (+6 fade) unchanged.
  const r = sweep(L, 53, 14);
  if (r) {
    const HW = 1.28, RL = 1.38, LEN = 0.7, h = (HW + RL + LEN) * r.k, a = Math.max(0, h - LEN), e = Math.min(HW + RL, h);
    // header piece: windscreen s (z -0.64 at s 0 -> +0.64 at s 1 along the top edge), v 0.775..1, and the roof strip 0.1 m behind TF
    if (a < HW && e > 0) {
      const z0 = -0.64 + Math.max(0, a), z1 = -0.64 + Math.min(HW, e), s0 = (z0 + 0.64) / HW, s1 = (z1 + 0.64) / HW;
      const lift = ([x, y, z]: V3): V3 => [x + 0.003, y + 0.002, z];
      out.push({lv: r.lv, seed: 42000, quad: [[0.4, 1.493, z0], [0.4, 1.493, z1], [0.3, 1.493, z1], [0.3, 1.493, z0]], core: [[0.4, 1.495, z0], [0.4, 1.495, z1]], weight: 8});
      out.push({lv: r.lv, seed: 42003, quad: [ghPt('windscreen', s0, 1), ghPt('windscreen', s1, 1), ghPt('windscreen', s1, 0.775), ghPt('windscreen', s0, 0.775)].map(lift), core: []});
    }
    // drip-rail piece: the roof strip z 0.54..0.64 and the top of the near side frame (glassR v 0.775..1), TF (0.40) -> TR (-0.98)
    if (e > HW) {
      const u0 = Math.max(0, a - HW), u1 = e - HW, x0 = 0.4 - u0, x1 = 0.4 - u1, s0 = u0 / RL, s1 = u1 / RL;
      out.push({lv: r.lv, seed: 42001, quad: [[x0, 1.493, 0.64], [x1, 1.493, 0.64], [x1, 1.493, 0.54], [x0, 1.493, 0.54]], core: [[x0, 1.495, 0.64], [x1, 1.495, 0.64]], weight: 8});
      out.push({lv: r.lv, seed: 42005, quad: [ghPt('glassR', s0, 1), ghPt('glassR', s1, 1), ghPt('glassR', s1, 0.775), ghPt('glassR', s0, 0.775)].map(([x, y, z]) => [x, y, z + 0.004] as V3), core: []});
    }
  }
  // body shoulder line: nose (2.18) -> tail (-2.2) on the near flank z +0.85; a 0.8 m highlight just under the upper edge
  const b = sweep(L, 68, 14);
  if (b) {
    const x = 2.18 + 0.4 - (4.38 + 0.8) * b.k, x0 = Math.min(2.18, x), x1 = Math.max(-2.2, x - 0.8);
    if (x0 > x1) {
      const xs = Array.from({length: 7}, (_, i) => x0 + ((x1 - x0) * i) / 6);
      out.push({lv: b.lv, seed: 42010, quad: [...xs.map((v) => [v, shoulderY(v), 0.853] as V3), ...[...xs].reverse().map((v) => [v, shoulderY(v) - 0.1, 0.853] as V3)],
        core: xs.map((v) => [v, shoulderY(v) - 0.02, 0.854] as V3)});
    }
  }
  // side glass: a slanted glint across the front door glass (s 0.06-0.53) then the rear door glass (s 0.58-0.86)
  const g = sweep(L, 89, 12);
  if (g) {
    const s = 0.02 + 0.9 * g.k, w = 0.06, d = 0.05;
    const quad = [ghPt('glassR', s - w + d, 0.08), ghPt('glassR', s + w + d, 0.08), ghPt('glassR', s + w - d, 0.92), ghPt('glassR', s - w - d, 0.92)].map(([x, y, z]) => [x, y, z + 0.004] as V3);
    out.push({lv: g.lv * 0.85, seed: 42020, quad, core: [ghPt('glassR', s + d, 0.1), ghPt('glassR', s - d, 0.9)]});
  }
  return out;
};

/** In-canvas part of a sweep: a washed band and a white core line. */
const paintSweeps = (p: Painter, c: YCam, L: number) => sweepBands(L).forEach(({quad, core, lv, seed, weight}) => {
  const q = wp(c, quad);
  if (q.length >= 3) washAt(p, seed, SPEC, 230 * lv, q, 0.3, 0.2);
  const k = core.map((v) => camPoint(c, v)).filter((v): v is Pt => !!v);
  if (k.length > 1) inkLine(p.layer(lv, seed + 5), seed + 1, k, {closed: false, color: SPEC, weight: weight ?? 4, still: true});
});

/** Screen part: the same bands blurred and screened (the specular bloom), so each sweep reads at 1080 width. */
const SweepGlow = ({c, L}: {c: YCam; L: number}) => {
  const bands = sweepBands(L);
  if (!bands.length) return null;
  const d = (q: Pt[]) => `M${q.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}Z`;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen'}}>
      <defs><filter id="ep21-sweep" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter></defs>
      <g filter="url(#ep21-sweep)">{bands.map((b, i) => { const q = wp(c, b.quad); return q.length >= 3 ? <path key={i} d={d(q)} fill={SPEC} opacity={0.7 * b.lv} /> : null; })}</g>
    </svg>
  );
};

export const shot = makeShot({
  id: 'B01-SH03', N, paper: '#262e38',
  paint: (p, L, G) => {
    const c = camOf(CAM, L / N), t = G / 30, hz = horizonY(c);
    const fork = L === 20 ? 1 : L === 21 ? 0.4 : 0;
    paintExterior(p, c, {t, fork: {x: 170, span: [hz - 420, hz - 40], level: fork},
      car: {inside: (q, cc) => paintDriverAt(q, cc, {...B01_DRIVER(G), tint: 0.1}, {t})}});
    paintSweeps(p, c, L);
    paintRain(p, t);
  },
  overlay: (L) => <SweepGlow c={camOf(CAM, L / N)} L={L} />,
});
