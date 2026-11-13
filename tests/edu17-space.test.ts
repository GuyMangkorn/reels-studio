import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {atomGeo, balanceGeo, BAL, beamAngle, circlePts, clipPoly, clipTo, INSET, insetAt, insetSpeck, LIMB, loupeAt, paintBalance, paintInset, paintMarkerRing, paintSh13, panSway, pushAt, SH13_LEN, SH14_LEN} from '../src/painted/edu17/space';
import {paintPhone, paintScreenDot, pulseAt, quadAt, screenQuad} from '../src/painted/edu17/phone-map';

// EDU-EP17 group 5 (Boss, 2026-11-12): N10 atom + loupe + speck ring, N11 balance, N13 phone map screen; ROWS-R2.3 shots 2, 13, 14, 15. Pixel evidence: out/edu17/g5/.
type Poly = {color: string; pts: [number, number][]};
const recording = () => {
  const polys: Poly[] = [];
  let cur = '';
  const brush = new Proxy({}, {get: (_t, k) => (...a: unknown[]) => { if (k === 'wash' || k === 'fill') cur = a[0] as string; if (k === 'polygon') polys.push({color: cur, pts: a[0] as [number, number][]}); }}) as Brush;
  return {painter: (frame = 0) => makePainter(brush, {t: frame / 30, frame}), polys};
};
const near = (a: number, b: number, tol: number, msg: string) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (tol ${tol})`);

test('N10 clip: polygons are cut to the loupe circle, nothing outside, and a polygon fully inside is unchanged', () => {
  const ring = circlePts(100, 100, 50), big = clipPoly([[-500, -500], [800, -500], [800, 800], [-500, 800]], ring);
  assert.ok(big.length >= 60 && big.every(([x, y]) => Math.hypot(x - 100, y - 100) <= 50.001), 'a huge square becomes the circle');
  const small: [number, number][] = [[90, 90], [110, 90], [110, 110], [90, 110]];
  assert.deepEqual(clipPoly(small, ring), small);
  const rec = recording(), q = clipTo(rec.painter(), 100, 100, 50);
  q.brush.polygon([[-500, -500], [800, -500], [800, 800], [-500, 800]] as never);
  assert.ok(rec.polys.length === 1 && rec.polys[0].pts.every(([x, y]) => Math.hypot(x - 100, y - 100) <= 50.001));
  q.brush.polygon([[900, 900], [950, 900], [950, 950]] as never);
  assert.equal(rec.polys.length, 1, 'a polygon outside draws nothing');
});

test('R2.3 SH13: limb arc top y 600 at the patch, loupe opens +22-+36 from the patch to the frame centre, push 6 % from +38, ring 44 px x push, ring draws on +40-+45', () => {
  near(LIMB.c[1] - LIMB.R, 600, 1e-9, 'arc top'); assert.deepEqual(LIMB.patch, [540, 600]);
  assert.equal(loupeAt(22).open, 0); assert.equal(loupeAt(36).open, 1); assert.deepEqual(loupeAt(36).c, [540, 960]); assert.ok(loupeAt(36).r >= 1180, 'covers the frame');
  assert.deepEqual(loupeAt(22).c, [540, 600]);
  const g0 = atomGeo(38), g1 = atomGeo(92);
  near(g0.s, 1, 1e-9, 'no push at +38'); near(g1.s, 1.06, 1e-9, 'push 6 % at +92'); near(g0.ring * 2, 44, 1e-9, 'ring 44 px'); near(g1.ring * 2, 44 * 1.06, 1e-9, 'ring x push');
  near(g0.hero[0], 540, 1e-9, 'hero x'); near(g0.hero[1], 760, 1e-9, 'hero y');
  // the speck sits on the hero's lower edge (LF04): distance from the hero centre = its radius (180) within 8 px
  near(Math.hypot(g0.speck[0] - g0.hero[0], g0.speck[1] - g0.hero[1]), 180, 8, 'speck on the edge');
  const r = recording(); paintSh13(r.painter(), 30);
  assert.ok(r.polys.length > 100);
  assert.equal(SH13_LEN, 93);
});

test('marker ring: ring colour #ffd34a with a #1a2140 keyline, 5 px wide, sweep draws it on, alpha 0 draws nothing', () => {
  const r = recording(); paintMarkerRing(r.painter(), 1, 100, 100, 22);
  const col = r.polys.map((q) => q.color.toLowerCase()); assert.ok(col.includes('#ffd34a') && col.includes('#1a2140'));
  const ringPoly = [...r.polys].reverse().find((q) => q.color.toLowerCase() === '#ffd34a')!, radii = ringPoly.pts.map(([x, y]) => Math.hypot(x - 100, y - 100));
  near(Math.max(...radii) - Math.min(...radii), 5, 0.3, 'stroke 5 px');
  const half = recording(); paintMarkerRing(half.painter(), 1, 100, 100, 22, {sweep: 0.5});
  const hp = [...half.polys].reverse().find((q) => q.color.toLowerCase() === '#ffd34a')!; assert.ok(hp.pts.every(([x]) => x >= 100 - 28.001), 'half sweep stays on the right-hand half from the top clockwise');
  const none = recording(); paintMarkerRing(none.painter(), 1, 100, 100, 22, {alpha: 0}); assert.equal(none.polys.length, 0);
});

test('R2.3 SH14: beam level +0-+2, 28 deg stop by +10, rebound short to 26 at +14 and settled by +18, 28 deg sheet end points, pans hang 270 px, ring 52 px', () => {
  assert.equal(beamAngle(0), 0); assert.equal(beamAngle(2), 0); near(beamAngle(10), 28, 1e-9, 'stop at +10');
  let mx = 0; for (let f = 0; f <= 89; f++) mx = Math.max(mx, beamAngle(f)); near(mx, 28, 1e-9, 'never above the 28 deg stop'); near(beamAngle(14), 26, 0.1, 'rebound low point 26 at +14');
  for (let f = 18; f <= 89; f++) assert.equal(beamAngle(f), 28);
  for (let f = 3; f <= 10; f++) assert.ok(beamAngle(f) > beamAngle(f - 1), 'slam accelerates');
  const g = balanceGeo(30);
  near(g.le[0], 224.5, 0.5, 'left end x'); near(g.le[1], 738, 0.5, 'left end y'); near(g.re[0], 895.5, 0.5, 'right end x'); near(g.re[1], 382, 0.5, 'right end y');
  near(g.lp[1] - g.le[1], BAL.hang, 1e-9, 'earth pan hangs 270'); near(BAL.ringR * 2, 52, 1e-9, 'ring 52 px');
  near(g.earth[0], 225, 1, 'earth x'); near(g.earth[1], 738 + 270 - 169, 1, 'earth rests in the pan');
  assert.equal(panSway(40, 'crowd'), 0); assert.ok(Math.abs(panSway(12, 'crowd')) > 1, 'the crowd pan wobbles after the throw'); assert.equal(panSway(5, 'crowd'), 0);
  near(pushAt(40), 1, 1e-12, 'static to +40'); near(pushAt(89), 1.08, 1e-12, 'push 8 %');
  // the Earth is lower than the crowd pan (never level, never the crowd pan unmoved)
  assert.ok(balanceGeo(30).lp[1] > balanceGeo(30).rp[1] + 300);
  const r = recording(); paintBalance(r.painter(), 30); assert.ok(r.polys.length > 60); assert.equal(SH14_LEN, 90);
});

test('R2.3 SH15 inset: circle (850, 430) r 150, opens +20-+28, speck slides back +36-+46, ring fades +46-+60, closes +70-+78', () => {
  assert.deepEqual(INSET.c, [850, 430]); assert.equal(INSET.r, 150);
  assert.equal(insetAt(20).r, 0); near(insetAt(28).r, 150, 1e-9, 'open'); near(insetAt(60).r, 150, 1e-9, 'held'); assert.equal(insetAt(78).r, 0);
  near(insetAt(36).off, 34, 1e-9, 'displaced to +36'); assert.equal(insetAt(46).off, 0); near(insetAt(46).ring, 1, 1e-9, 'ring held to +46'); assert.equal(insetAt(60).ring, 0);
  // speck back on the edge line at +46: distance from the hero centre = the atom radius
  const e = insetSpeck(46); near(Math.hypot(e[0] - INSET.hero[0], e[1] - INSET.hero[1]), INSET.R, 1e-9, 'on the edge line');
  const d = insetSpeck(30); near(Math.hypot(d[0] - INSET.hero[0], d[1] - INSET.hero[1]), INSET.R + 34, 1e-9, 'hangs off the edge');
  assert.ok(Math.hypot(e[0] - 850, e[1] - 430) < 150 - 30, 'the speck is inside the glass (ring fits)');
  const r = recording(); paintInset(r.painter(), 5); assert.equal(r.polys.length, 0, 'closed inset draws nothing');
  const o = recording(); paintInset(o.painter(), 40); assert.ok(o.polys.length > 20);
});

test('N13 phone map: screen is 1 : 2, the dot is on the K01 blue #2f7df6 with a white rim, 6 px at SH02 size, pulse 2.5 s period, map textless and inside the screen', () => {
  const q = screenQuad([430, 1085], 35); near(Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]), 35, 1e-9, 'width'); near(Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1]), 70, 1e-9, 'height');
  const mid = quadAt(q, 0.5, 0.5); near(mid[0], 430, 1e-9, 'centre x'); near(mid[1], 1085, 1e-9, 'centre y');
  const r = recording(), ph = paintPhone(r.painter(), [430, 1085], 35, 0);
  near(ph.d, 6, 0.05, 'dot 6 px'); assert.ok(r.polys.some((p) => p.color.toLowerCase() === '#2f7df6') && r.polys.some((p) => p.color === '#ffffff'));
  near(pulseAt(0).u, 0, 1e-9, 'pulse start'); near(pulseAt(2.5).u, 0, 1e-9, 'period 2.5 s'); assert.ok(pulseAt(1.25).r > pulseAt(0.1).r && pulseAt(1.25).a < pulseAt(0.1).a);
  // every map polygon lies inside the phone body quad's bounding box (roads are clipped to the screen)
  const xs = r.polys.flatMap((p) => p.pts.map((pt) => pt[0])), ys = r.polys.flatMap((p) => p.pts.map((pt) => pt[1]));
  const body = [Math.min(...q.map((a) => a[0])) - 8, Math.max(...q.map((a) => a[0])) + 8, Math.min(...q.map((a) => a[1])) - 8, Math.max(...q.map((a) => a[1])) + 8];
  assert.ok(Math.min(...xs) >= body[0] && Math.max(...xs) <= body[1] && Math.min(...ys) >= body[2] && Math.max(...ys) <= body[3], 'nothing outside the phone');
  const d = recording(); paintScreenDot(d.painter(), q, 0); assert.ok(d.polys.length >= 3 && d.polys.length <= 5);
  // a seek gives the same polygons
  const a = recording(), b = recording(); paintPhone(a.painter(), [430, 1085], 35, 1.1); paintPhone(b.painter(), [430, 1085], 35, 1.1); assert.deepEqual(a.polys, b.polys);
});
