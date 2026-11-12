import {ell, inkLine, solid, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {clamp01, ease} from '../kit/space';

// N10 `new: feather + ball` insert (`I`, metres; brief "Set plan - feather insert I"; SH10 +0..+45). A downy white feather 6 cm long hangs turning slowly; a red rubber
// ball 6.5 cm across enters from the left at x(n) = -0.24 + 0.0104 n m (slow motion x20, 0.30 m/s on screen), meets the feather at +23 ("โดน"); the feather folds
// onto the ball's front and travels WITH it at the ball's speed (no deflection, no bounce: D06). Contact x: the ball's front edge reaches the feather's vane at +23
// (x(23) = -0.0008 m, front +0.0317 m), so the feather hangs at x = 0.0317 m (brief says (0, 0, 0): a 3 cm difference at 133 px/6 cm, recorded).
export const FB = {r: 0.0325, len: 0.06, x0: -0.24, v: 0.0104, hit: 23, ball: '#c9362f', ballDk: '#7e1f1c', feather: '#f6f4ee'};
export const ballX = (L: number) => FB.x0 + FB.v * L;
export const FEATHER_X = ballX(FB.hit) + FB.r;
/** Feather centre x (m): hangs at FEATHER_X until the hit, then rides the ball's front (the ball's speed). */
export const featherX = (L: number) => (L <= FB.hit ? FEATHER_X : ballX(L) + FB.r);
/** Pass 4 (D4-10): the vane yields over +23..+27: both ends swing back (toward -x) to 30 deg and wrap the ball's front at a curve radius of 1.3 x the ball's radius. */
export const FEATHER_WRAP = {deg: 30, radius: 1.3 * FB.r, swing: [FB.hit, FB.hit + 4] as const, flutterHz: 5, flutterPx: 2, calamus: 0.22, lead: 0.35, trail: 0.65, splits: [0.4, 0.65] as const};
export const featherWrap = (L: number) => ease(clamp01((L - FEATHER_WRAP.swing[0]) / (FEATHER_WRAP.swing[1] - FEATHER_WRAP.swing[0])));
export const paintFeatherBall = (p: Painter, c: YCam, L: number, tAmb: number) => {
  const at = (x: number, y = 0): Pt | null => camPoint(c, [x, y, 0]);
  const u = camUnit(c, [0, 0, 0]);
  // ball
  const bg = at(ballX(L));
  if (bg) {
    const r = FB.r * u;
    solid(p, 55000, FB.ball, ell(bg[0], bg[1], r, r, 28), 4);
    washAt(p, 55001, FB.ballDk, 150, ell(bg[0] + r * 0.18, bg[1] + r * 0.22, r * 0.78, r * 0.7, 24), 0.1, 0);
    washAt(p, 55002, '#ffd9cf', 190, ell(bg[0] - r * 0.36, bg[1] - r * 0.4, r * 0.2, r * 0.13, 12, -0.7), 0, 0);
    inkLine(p, 55003, ell(bg[0], bg[1], r, r, 28), {weight: 1.1, color: '#4a1613', curve: 0.1});
  }
  // feather (F4-B10): calamus 22 % of the length below the vane, asymmetric vane (35 % leading / 65 % trailing, rounded tip), two splits in the wide vane at 40 % and
  // 65 % of the length, 6 down curls at the base. The spine yields over +23..+27 (tangent angle up to 30 deg, curve radius 1.3 x the ball's) and holds, trailing barbs flutter.
  const fx = featherX(L), fold = featherWrap(L), turn = Math.cos(tAmb * 1.1), cen = at(fx, 0);
  if (!cen) return;
  const Lpx = FB.len * u, Rpx = FEATHER_WRAP.radius * u, phiMax = (FEATHER_WRAP.deg * Math.PI) / 180, W = Math.max(0.6, Math.abs(turn)) * 0.017 * u * (1 - 0.15 * fold);
  const half = Lpx / 2, step = 4, n = Math.ceil(half / step), sp: {a: number; x: number; y: number; phi: number}[] = [{a: 0, x: 0, y: 0, phi: 0}];
  for (const dir of [1, -1]) { // integrate the spine outward from the vane's centre (up = +a)
    let x = 0, y = 0;
    for (let i = 1; i <= n; i++) {
      const a0 = dir * (i - 0.5) * step, phi = fold * Math.max(-phiMax, Math.min(phiMax, a0 / Rpx));
      x += dir * -Math.sin(phi) * step; y += dir * Math.cos(phi) * step; // tangent (-sin phi, cos phi): up and back
      sp.push({a: dir * i * step, x, y, phi: fold * Math.max(-phiMax, Math.min(phiMax, (dir * i * step) / Rpx))});
    }
  }
  sp.sort((q, r) => q.a - r.a);
  const flutter = (b: number) => fold >= 1 && b > 0 ? FEATHER_WRAP.flutterPx * Math.sin(2 * Math.PI * FEATHER_WRAP.flutterHz * tAmb + b * 0.05) : 0;
  /** Point at along-offset `a` (px, up) from the vane centre and lateral `b` (px, + = trailing, toward +x). */
  const M = (a: number, b: number): Pt => {
    const ac = Math.max(sp[0].a, Math.min(sp[sp.length - 1].a, a));
    const i0 = sp.findIndex((q) => q.a >= ac - 1e-9), i1 = Math.max(1, i0), A = sp[i1 - 1], B = sp[i1], k = B.a === A.a ? 0 : (ac - A.a) / (B.a - A.a);
    const x = A.x + (B.x - A.x) * k, y = A.y + (B.y - A.y) * k, phi = A.phi + (B.phi - A.phi) * k, bb = b + flutter(b);
    return [cen[0] + x + bb * Math.cos(phi), cen[1] - (y + bb * Math.sin(phi))];
  };
  const sa = (sFrac: number) => (sFrac - 0.5) * Lpx; // s: 0 bottom .. 1 tip -> a
  const v0 = FEATHER_WRAP.calamus, env = (v: number) => { // vane envelope 0..1 over v = 0..1 along the vane (rounded tip, fuller low)
    if (v <= 0 || v >= 1) return 0;
    return v < 0.45 ? Math.pow(Math.sin((Math.PI / 2) * (v / 0.45)), 0.8) : Math.sqrt(Math.max(0, 1 - ((v - 0.45) / 0.55) ** 2));
  };
  const sOf = (v: number) => v0 + (1 - v0) * v, vOf = (sv: number) => (sv - v0) / (1 - v0);
  const edge = (side: 1 | -1, sFrac: number, k = 1): number => side * env(vOf(sFrac)) * W * (side > 0 ? FEATHER_WRAP.trail * 2 : FEATHER_WRAP.lead * 2) * k;
  const strip = (side: 1 | -1, s0: number, s1: number, inner: number, outer: number, slantTo = 0): Pt[] => {
    const N = 7, out: Pt[] = [], inn: Pt[] = [];
    for (let i = 0; i <= N; i++) {
      const sv = s0 + (s1 - s0) * (i / N);
      out.push(M(sa(sv + slantTo), edge(side, sv, outer))); inn.push(M(sa(sv), edge(side, sv, inner)));
    }
    return [...out, ...inn.reverse()];
  };
  const base = FB.feather, shade = mixColor(FB.feather, '#c9d2d8', 0.3), gap = 0.03, [sp1, sp2] = FEATHER_WRAP.splits;
  // leading vane (35 %): one piece
  solid(p, 55100, base, strip(-1, v0, 1, 0, 1), 3); inkLine(p, 55101, strip(-1, v0, 1, 0, 1), {weight: 0.8, color: '#9aa5ad', curve: 0.2});
  // trailing vane (65 %): inner 45 % continuous, outer 55 % cut by the two splits (angled toward the tip like the barbs)
  solid(p, 55105, shade, strip(1, v0, 1, 0, 0.45), 3);
  const segs: [number, number][] = [[v0, sp1 - gap], [sp1 + gap, sp2 - gap], [sp2 + gap, 1]];
  segs.forEach(([a0, a1], i) => { const P = strip(1, a0, a1, 0.45, 1, 0.05); solid(p, 55110 + i * 2, shade, P, 3); inkLine(p, 55111 + i * 2, P, {weight: 0.8, color: '#9aa5ad', curve: 0.15}); });
  // shaft through the vane, then the bare calamus below it (3 px, cream with a dark tip)
  const spine = [0, 0.25, 0.5, 0.75, 1].map((k) => M(sa(v0 + (1 - v0) * k), 0)), cal = [0, 0.5, 1].map((k) => M(sa(k * v0), 0));
  inkLine(p, 55120, spine, {weight: 1.6, color: '#b9c2c8', closed: false, curve: 0.3});
  inkLine(p, 55121, cal, {weight: 3, color: '#efe8d4', closed: false, curve: 0.1});
  inkLine(p, 55122, [cal[0], M(sa(0.05 * v0), 0)], {weight: 3, color: '#a89c80', closed: false, curve: 0});
  // barbs: strokes angled toward the tip on both sides
  for (let k = 1; k < 13; k++) {
    const sv = v0 + (1 - v0) * (k / 13);
    [1, -1].forEach((sd, i) => { const e = edge(sd as 1 | -1, sv), e2 = edge(sd as 1 | -1, sv + 0.05); if (Math.abs(e) > 2) inkLine(p, 55130 + k * 2 + i, [M(sa(sv), 0), M(sa(sv + 0.04), e * 0.97)], {weight: 0.8, color: '#8f9aa2', closed: false, curve: 0.1}); void e2; });
  }
  // 6 soft down curls (20-30 px) at the base of the vane
  for (let i = 0; i < 6; i++) {
    const b = (i - 2.5) * 0.18 * W, len = 20 + 10 * ((i * 7) % 5) / 4, sd = i % 2 ? 1 : -1;
    inkLine(p, 55170 + i, [M(sa(v0 + 0.01), b), M(sa(v0 - 0.02) - len * 0.45, b + sd * len * 0.3), M(sa(v0) - len, b + sd * len * 0.55)], {weight: 1.6, color: '#fbf8ee', closed: false, curve: 0.5});
  }
};
