// EDU-EP21-SHORT W5.2f FX1 measurement (Boss, 2026-11-17): B01-SH04 head vs headrest (SHEETS-R2 D-Q7 accept "at least half of her
// head's outline stays clear of the headrest on every frame"). Imports the shot camera, so the sheet move is measured as rendered.
// Head: the kit anchors from `paintDriverAt` run on a no-op painter (head centre, headTop, chin), outline = an ellipse of half-height
// (chin - headTop) / 2 and half-width 0.8 x that (the back-view head; checked against the frames), 72 points. Headrest: the convex hull of
// its front and rear faces (cabin.ts `paintSeatBack`, driver seat z 0.13..0.63: x -0.40 - 0.05 (y - 0.98) / 0.18 and 0.1 behind it,
// z 0.27..0.49, y 0.98..1.14). Outline points inside the hull are covered (the headrest is painted after her from this lens); the area
// figure is the same on a grid inside the ellipse.
// Also prints the lead (hip -> crown, crown -> her seat-back top) as bg2-measure.py. Usage: npx tsx scripts/edu-series/ep21/short/fx1-measure.ts
import {camMove, camOf} from '../../../../src/painted/kit/cam-moves';
import {camPoint, type YCam} from '../../../../src/painted/kit/ycam';
import type {Painter, Pt} from '../../../../src/painted/kit/painter';
import {HANDS, paintDriverAt} from '../../../../src/painted/edu21/driver';
import {CAM} from '../../../../src/painted/edu21/shots/B01-SH04';

const sink: object = new Proxy(function () {}, {get: (_t, k) => (k === 't' || k === 'frame' ? 0 : k === 'alpha' ? 1 : sink), apply: () => sink});
const noop = sink as Painter;
const hull = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const p of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of s.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
const inside = (q: Pt, h: Pt[]) => h.every((a, i) => { const b = h[(i + 1) % h.length]; return (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]) >= 0; })
  || h.every((a, i) => { const b = h[(i + 1) % h.length]; return (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]) <= 0; });
const headrest = (c: YCam) => {
  const pts: Pt[] = [];
  for (const y of [0.98, 1.14]) for (const z of [0.27, 0.49]) for (const dx of [0, -0.1]) {
    const q = camPoint(c, [-0.4 - (0.05 * (y - 0.98)) / 0.18 + dx, y, z]);
    if (q) pts.push(q);
  }
  return hull(pts);
};
// R1 (end yaw -100) for comparison, then the R2 camera as typed in the shot file
const R1 = camMove([0.3, 1.0, 0.3], [-104, -100], [1.35, 1.42], 1.08, {f: 760, hy: 820});
const N = 92, frames = [...Array.from({length: 92}, (_, i) => i)];
for (const [name, mv] of [['R1 yaw -104->-100', R1], ['R2 yaw -104->-106 (shot file)', CAM]] as const) {
console.log(name);
let worst = {L: -1, clear: 2};
for (const L of frames) {
  const c = {...camOf(mv, L / N), near: 0.12};
  const a = paintDriverAt(noop, c, {face: 'neutral', hands: HANDS.thighs, tint: 0.12}, {t: (223 + L) / 30});
  if (!a) { console.log(`L${L} no anchors`); continue; }
  const ry = (a.chin - a.headTop) / 2, rx = 0.8 * ry, cy = a.headTop + ry, cx = a.head[0];
  const hr = headrest(c), n = 72;
  let clear = 0;
  for (let k = 0; k < n; k++) { const t = (2 * Math.PI * k) / n; if (!inside([cx + rx * Math.cos(t), cy + ry * Math.sin(t)], hr)) clear++; }
  const hip = camPoint(c, [-0.15, 0.4, 0.38])!, crown = camPoint(c, [-0.15, 1.37, 0.38])!, seat = camPoint(c, [-0.511, 0.92, 0.38])!;
  let tot = 0, vis = 0;
  for (let gx = -1; gx <= 1; gx += 0.05) for (let gy = -1; gy <= 1; gy += 0.05) if (gx * gx + gy * gy <= 1) { tot++; if (!inside([cx + rx * gx, cy + ry * gy], hr)) vis++; }
  const fr = clear / n;
  if (fr < worst.clear) worst = {L, clear: fr};
  if (L % 10 === 0 || L === 91 || L === 67)
    console.log(`  L${L} head (${cx.toFixed(0)},${cy.toFixed(0)}) r ${rx.toFixed(0)}x${ry.toFixed(0)} · outline clear ${(100 * fr).toFixed(0)} % · area clear ${((100 * vis) / tot).toFixed(0)} % · headrest x ${Math.min(...hr.map((q) => q[0])).toFixed(0)} · hip->crown ${Math.hypot(crown[0] - hip[0], crown[1] - hip[1]).toFixed(0)} px · visible crown->seat top ${(seat[1] - crown[1]).toFixed(0)} px · crown (${crown[0].toFixed(0)},${crown[1].toFixed(0)})`);
}
console.log(`  worst outline clear ${(100 * worst.clear).toFixed(0)} % at L${worst.L} (accept >= 50 %)`);
}
