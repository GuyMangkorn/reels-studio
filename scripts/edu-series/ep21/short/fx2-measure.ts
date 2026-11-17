// EDU-EP21-SHORT W5.2f FX2 measurement (Boss, 2026-11-17): B04-SH10 end camera choice (SHEETS-R2 SD16, D-Q13). For each candidate end
// camera (sheet R2 yaw 28; R1 yaw 34; the fallback yaw 34 with the end `at` moved +x by 0.05 / 0.10 / 0.15 m) and for the move typed in
// the shot file, over L51-78 (the branch at full travel) it projects through the sagged camera (car.ts `sagCam`, as the shot draws it):
//  - the inner branch route (glow.tsx `BRANCH`, 24 samples per segment);
//  - the near A-pillar: the picture hull of the windscreen's near frame strip (s 0.95-1) and the door glass's front frame strip (s 0-0.06),
//    v 0-1; "inner edge" = the door glass's front edge (s 0.06), as bg3-measure.ts prints it;
//  - her head outline: the kit anchors from `paintDriverAt` (view `right`, as the shot) on a no-op painter, an ellipse of half-height
//    (chin - headTop) / 2 and half-width 0.85 x that, 72 points.
// Accept (sheet SH10 R2): route >= 30 px clear of the pillar (outside the hull) and >= 60 px from her head outline on every frame L51-78.
// The route crosses the pillar's foot from every candidate (the cowl is seen through the windscreen, the cluster through the door
// glass), so the route figure is negative; the route-end figure is the cluster end's clearance. Also prints the cluster face centre at L107. B05-SH11 section: see below. Usage: npx tsx scripts/edu-series/ep21/short/fx2-measure.ts
import {camMove, camOf, type CamMove} from '../../../../src/painted/kit/cam-moves';
import {camPoint, type YCam} from '../../../../src/painted/kit/ycam';
import type {Painter, Pt} from '../../../../src/painted/kit/painter';
import {CAR, ghPt, SAG_FULL, sagCam} from '../../../../src/painted/edu21/car';
import type {V3} from '../../../../src/painted/kit/space';
import {camAt as sh11, HUB_SH11, SAG_SH11} from '../../../../src/painted/edu21/shots/B05-SH11';
import {HANDS, paintDriverAt} from '../../../../src/painted/edu21/driver';
import {BRANCH} from '../../../../src/painted/edu21/glow';
import {CAM as SHOT} from '../../../../src/painted/edu21/shots/B04-SH10';

const sink: object = new Proxy(function () {}, {get: (_t, k) => (k === 't' || k === 'frame' ? 0 : k === 'alpha' ? 1 : sink), apply: () => sink});
const noop = sink as Painter;
const hull = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const p of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of s.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
const segDist = (q: Pt, a: Pt, b: Pt) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy);
};
const inConvex = (q: Pt, h: Pt[]) => h.every((a, i) => { const b = h[(i + 1) % h.length]; return (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]) >= 0; });
/** Signed distance to a convex polygon (negative inside). */
const polyDist = (q: Pt, h: Pt[]) => { const d = Math.min(...h.map((a, i) => segDist(q, a, h[(i + 1) % h.length]))); return inConvex(q, h) ? -d : d; };
const route = (c: YCam): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < BRANCH.length - 1; i++) for (let k = 0; k <= 24; k++) {
    const a = BRANCH[i], b = BRANCH[i + 1], u = k / 24, q = camPoint(c, [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]);
    if (q) out.push(q);
  }
  return out;
};
const pillar = (c: YCam) => hull([0, 1].flatMap((v) => [ghPt('windscreen', 0.95, v), ghPt('windscreen', 1, v), ghPt('glassR', 0, v), ghPt('glassR', 0.06, v)])
  .map((w) => camPoint(c, w)).filter((q): q is Pt => !!q));

const N = 108;
const mv = (yaw: number, dx = 0): CamMove => camMove([[0.4, 0.7, 0], [0.45 + dx, 0.95, 0.3]], [36, yaw], [4.1, 2.3], [0.65, 1.25], {f: 880, hy: 940, ease: [0.25, 1]});
const CANDS: [string, CamMove][] = [['R1 yaw 34', mv(34)], ['R2 yaw 28 (SD16)', mv(28)], ['yaw 34, at +x 0.05', mv(34, 0.05)],
  ['yaw 34, at +x 0.10', mv(34, 0.1)], ['yaw 34, at +x 0.15', mv(34, 0.15)], ['shot file CAM', SHOT]];
for (const [name, m] of CANDS) {
  let wp = {d: 1e9, L: -1}, wh = {d: 1e9, L: -1}, wc = {d: 1e9, L: -1};
  for (let L = 51; L <= 78; L++) {
    const c = sagCam(camOf(m, L / (N - 1)), SAG_FULL), r = route(c), pl = pillar(c);
    const a = paintDriverAt(noop, c, {face: 'neutral', hands: HANDS.thighs}, {t: (822 + L) / 30, view: 'right'});
    const dp = Math.min(...r.map((q) => polyDist(q, pl)));
    if (dp < wp.d) wp = {d: dp, L};
    const dc = polyDist(r[r.length - 1], pl);
    if (dc < wc.d) wc = {d: dc, L};
    if (a) {
      const ry = (a.chin - a.headTop) / 2, rx = 0.85 * ry, cy = a.headTop + ry, cx = a.head[0];
      const ol: Pt[] = Array.from({length: 72}, (_, k) => [cx + rx * Math.cos((2 * Math.PI * k) / 72), cy + ry * Math.sin((2 * Math.PI * k) / 72)]);
      const dh = Math.min(...r.map((q) => (((q[0] - cx) / rx) ** 2 + ((q[1] - cy) / ry) ** 2 <= 1 ? -1 : Math.min(...ol.map((o) => Math.hypot(q[0] - o[0], q[1] - o[1]))))));
      if (dh < wh.d) wh = {d: dh, L};
    }
  }
  const c = sagCam(camOf(m, 1), SAG_FULL), r = route(c), cl = camPoint(c, [0.519, 0.97, 0.38]), inner = camPoint(c, ghPt('glassR', 0.06, 0.1));
  const xs = r.map((q) => q[0]), ys = r.map((q) => q[1]);
  console.log(`${name}: route vs pillar min ${wp.d.toFixed(0)} px (L${wp.L}) · route end (cluster top) vs pillar min ${wc.d.toFixed(0)} px (L${wc.L}) · head clearance min ${wh.d.toFixed(0)} px (L${wh.L}) · `
    + `L107 route x ${Math.min(...xs).toFixed(0)}..${Math.max(...xs).toFixed(0)} y ${Math.min(...ys).toFixed(0)}..${Math.max(...ys).toFixed(0)}, cluster (${cl?.map((n) => n.toFixed(0)).join(', ')}), `
    + `pillar inner (${inner?.map((n) => n.toFixed(0)).join(', ')}) · ${wp.d >= 30 && wh.d >= 60 ? 'PASS' : 'FAIL'}`);
}

// B05-SH11 (SD17, D-Q19): R1 (sag 0.06, hub 0.06) against the shot file (SAG_SH11 body sag, HUB_SH11 hub drop), at its key frames.
// Arch gap: the arch's top (body point (x, 0.68, 0.851), car.ts arch circle centre 0.31 r 0.37, through the sagged camera) to the tyre's
// top (world (x, 2 r - hub, 0.86)), picture px, FR and RR (RR = the other visible wheel; FL is hidden behind the body from this lens).
// Tyre widths: the outer sidewall ring (car.ts `tyrePt` replicated) at 10 % below its top and at the road; FR contact = the ring's lowest y.
console.log('B05-SH11');
const tyre = (x: number, sag: number, hub: number): V3[] => {
  const r = CAR.wheelR, cy = r - hub;
  return Array.from({length: 73}, (_, i) => {
    const a = (i / 72) * 2 * Math.PI; let dx = r * Math.cos(a); const dy = r * Math.sin(a);
    if (sag > 0 && dy < 0) dx *= 1 + 0.26 * (sag / SAG_FULL) * Math.min(1, -dy / cy);
    return [x + dx, Math.max(0, cy + dy), 0.86] as V3;
  });
};
const widthAt = (pts: V3[], y: number, c: YCam) => {
  const sel = pts.filter((v) => Math.abs(v[1] - y) < 0.02).map((v) => camPoint(c, v)!).map((q) => q[0]);
  return sel.length > 1 ? Math.max(...sel) - Math.min(...sel) : 0;
};
for (const [name, sag, hub] of [['R1 0.06/0.06', SAG_FULL, SAG_FULL], [`FX2 ${SAG_SH11}/${HUB_SH11}`, SAG_SH11, HUB_SH11]] as const) {
  for (const L of [0, 40, 80]) {
    const c = sh11(L), cb = sagCam(c, sag), r = CAR.wheelR;
    const gap = (x: number, h: number) => camPoint(c, [x, 2 * r - h, 0.86])![1] - camPoint(cb, [x, 0.68, 0.851])![1];
    const fr = tyre(CAR.wheelX, sag, hub), ys = fr.map((v) => camPoint(c, v)![1]);
    const top = widthAt(fr, 2 * r - hub - 0.1 * 2 * r, c), bot = Math.max(widthAt(fr, 0, c), widthAt(fr, 0.01, c));
    console.log(`  ${name} L${L}: arch gap FR ${gap(CAR.wheelX, hub).toFixed(1)} px, RR ${gap(-CAR.wheelX, 0).toFixed(1)} px · FR width near top ${top.toFixed(0)} px, at the road ${bot.toFixed(0)} px · FR contact y ${Math.max(...ys).toFixed(0)}`);
  }
}
