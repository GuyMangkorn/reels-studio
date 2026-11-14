import {capsule, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor} from '../kit/painter';
import {camPoint, camUnit} from '../kit/ycam';
import {cardAt, cell, cp, cps, strip, type Card, type Painter, type Pt, type V3, type YCam} from './core';

// N17-05 mosquito cloud layer and single mosquito macro (EP17 sh16-18; EP16-18 forest insects). Boss, 14 Nov 2026.
// The cloud is a swarm of tiny bodies that hover and weave round a centre, drift toward a target and thin out as `thin` goes 0 -> 1 (shot 18: the smoke drives
// them off). Every position is a pure function of `t` (seekable; ambient clock). Seen from 3 m a mosquito is under 1 px at real size, so bodies are drawn at
// 0.025 m (exaggerated, painted: 2-4 px at the shot-16 lens), each with two wing flicks that blink on a 24 fps step, over a faint warm haze of the swarm.
// The macro is one mosquito (Aedes-like: banded legs, feathery antennae, a long proboscis, folded wings with veins) on a frond tip, drawn in its own
// metres: body 6 mm, so use a camera with `near` under the lens distance (EP17 sh17 camera r 0.05-0.06 m).

export type MozzieCloud = {
  /** Centre of the swarm (world metres) and the point it drifts toward. */ at: V3; toward?: V3;
  /** Seconds (ambient clock) and 0..1 how far it has drifted toward `toward`. */ t: number; drift?: number;
  /** Count (default 46), radius (m, default 0.55) and 0..1 thinning (fewer bodies, default 0). */ n?: number; radius?: number; thin?: number;
  /** Colour of the bodies and the haze (default dusk-lit dark). */ color?: string; haze?: string; seed?: number;
};
/** Position of mosquito `i` of the cloud at its `t`. */
export const mozzieAt = (o: MozzieCloud, i: number): V3 => {
  const R = o.radius ?? 0.55, s = (o.seed ?? 60000) + i * 7, d = Math.min(1, Math.max(0, o.drift ?? 0));
  const c: V3 = o.toward ? [o.at[0] + (o.toward[0] - o.at[0]) * d, o.at[1] + (o.toward[1] - o.at[1]) * d, o.at[2] + (o.toward[2] - o.at[2]) * d] : o.at;
  const w1 = 1.6 + 2.4 * hash(s + 1), w2 = 1.1 + 2.0 * hash(s + 2), a = hash(s + 3) * 6.28, b = hash(s + 4) * 6.28;
  const r = R * (0.25 + 0.75 * Math.sqrt(hash(s + 5)));
  return [c[0] + r * Math.cos(a + o.t * w1 * 0.4) * (0.8 + 0.2 * Math.sin(o.t * w1 + b)), c[1] + r * 0.55 * Math.sin(b + o.t * w2 * 0.5) + 0.04 * Math.sin(o.t * 9 + i), c[2] + r * Math.sin(a + o.t * w1 * 0.4) * 0.8];
};
export const paintMozzieCloud = (p: Painter, c: YCam, o: MozzieCloud) => {
  const n = o.n ?? 46, thin = o.thin ?? 0, col = o.color ?? '#2a2622', seed = o.seed ?? 60000;
  const g = camPoint(c, o.toward && o.drift ? [o.at[0] + (o.toward[0] - o.at[0]) * (o.drift ?? 0), o.at[1] + (o.toward[1] - o.at[1]) * (o.drift ?? 0), o.at[2] + (o.toward[2] - o.at[2]) * (o.drift ?? 0)] : o.at);
  const u = camUnit(c, o.at), R = (o.radius ?? 0.55) * u;
  if (g) washAt(p, seed + 5000, o.haze ?? '#5a4a44', 34 * (1 - thin * 0.8), cell({g, u: 1, s: 1}, 0, 0, R * 1.05, R * 0.62, 16), 0.9, 0.2);
  const step = Math.floor(o.t * 24);
  for (let i = 0; i < n; i++) {
    if (i / n >= 1 - thin) continue;                 // the last ones to go are the first ones in the list order reversed: thinning removes from the end
    const q = camPoint(c, mozzieAt(o, i));
    if (!q) continue;
    const s = Math.max(1.4, 0.025 * camUnit(c, mozzieAt(o, i))), on = hash(seed + i * 3 + step) > 0.5 ? 1 : -1;
    hardFill(p, seed + 100 + i * 4, col, cell({g: q, u: 1, s: 1}, 0, 0, s * 0.55, s * 0.3, 6, 0.4 * on));
    inkLine(p, seed + 101 + i * 4, [q, [q[0] - s * 1.1 * on, q[1] - s * 0.9]], {closed: false, weight: 0.25, color: mixColor(col, '#e8dcc8', 0.4), still: true});
    inkLine(p, seed + 102 + i * 4, [q, [q[0] + s * 0.2 * on, q[1] - s * 1.3]], {closed: false, weight: 0.25, color: mixColor(col, '#e8dcc8', 0.4), still: true});
  }
};

/** Fern frond tip card (the perch of the macro): a tapering rachis with paired pinnae, in card metres (x right, y up), tip at (0, 0). */
const frondTip = (p: Painter, k: Card, seed: number, col = '#5a8a3e') => {
  inkLine(p, seed, cps(k, [[-0.05, -0.12], [-0.03, -0.05], [0.0, 0.0]]), {closed: false, weight: 2.0, color: '#3a5a2a', still: true});
  for (let i = 0; i < 7; i++) {
    const y = -0.012 - i * 0.017, w = 0.052 * (1 - i * 0.07) + 0.01;
    for (const sd of [-1, 1]) {
      const b: Pt = cp(k, -0.003 * i * 0.2, y);
      const leaf = strip([b, cp(k, sd * w * 0.55, y + 0.012), cp(k, sd * w, y + 0.006 - 0.004 * i)], [0.0036, 0.0046, 0.0008]);
      hardFill(p, seed + 10 + i * 2 + (sd > 0 ? 1 : 0), mixColor(col, '#9ac060', 0.15 * (i % 2)), leaf);
    }
  }
};
/**
 * One mosquito perched on a frond tip, side view facing screen left (`s` -1 mirrors), at world point `at` (the frond tip). `t` drives the slow idle (a leg shift, the
 * antenna twitch). Painted sharp (the shot's background is the soft one); `size` scales the real 6 mm body. Pass `null` to probe the card height in px.
 */
export const paintMosquitoMacro = (p: Painter, c: YCam, at: V3, o: {t?: number; s?: 1 | -1; size?: number; seed?: number; frond?: boolean} = {}): {top: number; bottom: number; left: number; right: number} | null => {
  const k0 = cardAt(c, at, o.s ?? 1, o.size ?? 1);
  if (!k0) return null;
  const k: Card = {...k0, u: k0.u}, S = 0.006, seed = o.seed ?? 61000, t = o.t ?? 0;
  const P = (x: number, y: number) => cp(k, x * S, y * S);
  const out = {top: P(0, 1)[1], bottom: P(0, 1)[1], left: 0, right: 0};
  const track = (q: Pt) => { out.top = Math.min(out.top, q[1]); out.bottom = Math.max(out.bottom, q[1]); out.left = out.left ? Math.min(out.left, q[0]) : q[0]; out.right = Math.max(out.right, q[0]); };
  if (o.frond !== false) frondTip(p, {...k, u: k.u}, seed, '#5a8a3e');
  // body in mosquito units (1 = 6 mm): abdomen back-right, thorax hump, head front-left, proboscis down-left to the leaf
  const ab = cell({g: P(1.55, 0.95), u: k.u * S, s: k.s}, 0, 0, 1.55, 0.42, 14, 0.5), th = cell({g: P(0, 1.35), u: k.u * S, s: k.s}, 0, 0, 0.62, 0.55, 12, -0.1), hd = cell({g: P(-0.82, 1.18), u: k.u * S, s: k.s}, 0, 0, 0.3, 0.27, 10);
  ab.concat(th, hd).forEach(track);
  hardFill(p, seed + 20, '#4a4038', ab);
  for (let i = 0; i < 5; i++) { const x = 0.5 + i * 0.48; hardFill(p, seed + 21 + i, '#e8e0cc', [P(x, 0.55 + 0.08 * i), P(x + 0.12, 0.62 + 0.06 * i), P(x + 0.18, 1.02 + 0.04 * i), P(x + 0.04, 0.9 + 0.04 * i)]); }
  hardFill(p, seed + 30, '#3a322c', th); washAt(p, seed + 31, '#7a6e60', 120, cell({g: P(-0.1, 1.55), u: k.u * S, s: k.s}, 0, 0, 0.34, 0.2, 8, 0), 0.1, 0.2);
  hardFill(p, seed + 32, '#2e2824', hd); hardFill(p, seed + 33, '#b8342a', cell({g: P(-0.9, 1.26), u: k.u * S, s: k.s}, 0, 0, 0.12, 0.12, 6));
  inkLine(p, seed + 34, [P(-1.05, 1.12), P(-1.9, 0.55), P(-2.45, 0.2)], {closed: false, weight: 1.5, color: '#1e1a16', still: true});
  const tw = 0.1 * Math.sin(t * 5.1);
  for (const sd of [0, 1]) inkLine(p, seed + 35 + sd, [P(-0.95, 1.38), P(-1.35 - 0.1 * sd, 1.9 + tw), P(-1.6 - 0.2 * sd, 2.15 + tw)], {closed: false, weight: 0.8, color: '#4a4038', still: true});
  // folded wings along the back, translucent, with veins
  const wing: Pt[] = [P(0.4, 1.7), P(1.4, 1.62), P(3.3, 1.45), P(3.2, 1.2), P(1.4, 1.3)];
  washAt(p, seed + 40, '#d8e4e8', 110, wing, 0.1, 0.1); inkLine(p, seed + 41, wing, {weight: 0.5, color: '#6a7a80', still: true});
  for (let i = 0; i < 3; i++) inkLine(p, seed + 42 + i, [P(0.7, 1.6 - i * 0.06), P(3.1, 1.4 - i * 0.05)], {closed: false, weight: 0.3, color: '#7a8a90', still: true});
  // six legs: banded black and white, long knees up and tarsi to the frond
  const legs: [Pt, Pt, Pt, Pt][] = [
    [P(-0.25, 1.1), P(-1.1, 0.55), P(-1.7, 1.3 + 0.02 * Math.sin(t * 2)), P(-2.3, 0.05)], [P(0.1, 1.0), P(-0.6, 0.2), P(-0.9, 1.05), P(-1.1, 0.0)],
    [P(0.55, 0.95), P(0.35, 0.1), P(0.2, 0.8), P(0.15, -0.05)], [P(1.2, 0.8), P(1.5, -0.1), P(1.9, 0.75), P(2.0, -0.05)],
    [P(1.9, 0.9), P(2.7, -0.2), P(3.1, 0.7), P(3.4, 0.02)], [P(0.3, 1.25), P(-0.2, 1.9), P(-0.7, 1.5), P(-1.2, 1.2)],
  ];
  legs.forEach((l, i) => {
    for (let j = 0; j < 3; j++) { const col = j === 2 && i < 5 ? '#efe8d8' : '#2a2420'; inkLine(p, seed + 50 + i * 3 + j, [l[j], l[j + 1]], {closed: false, weight: 1.0 - j * 0.15, color: col, still: true}); }
    l.forEach(track);
  });
  void capsule;
  return out;
};
