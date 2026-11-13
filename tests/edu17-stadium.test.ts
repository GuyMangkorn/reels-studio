import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {camPoint} from '../src/painted/kit/ycam';
import {bounceLift, bowlD, bowlPt, FIELD, lensClearance, paintStadiumShot, ROOF, sh17Cam, sh18Cam, sh19Cam, sh20Cam, standY, seatHeads, SD, stadiumPx, STADIUM_SHOTS, type StadiumShot} from '../src/painted/edu17/stadium';
import {KB, paintSh21, sh21Cam, SH21_LEN, traceBurst, traceJitter} from '../src/painted/edu17/instrument';
import {sh19Cam as lookSh19Cam} from '../src/painted/edu17/look-b-stadium';

// EDU-EP17 group 4 (Boss, 2026-11-12): N8 SET-STADIUM16 (SH17-SH20) and N9 instrument KB (SH21), ROWS-R2.2 cameras and acceptance A17. Pixel evidence: out/edu17/g4/.
type Poly = {color: string; pts: [number, number][]};
const recording = () => {
  const polys: Poly[] = [];
  let cur = '';
  const brush = new Proxy({}, {get: (_t, k) => (...a: unknown[]) => { if (k === 'wash' || k === 'fill') cur = a[0] as string; if (k === 'polygon') polys.push({color: cur, pts: a[0] as [number, number][]}); }}) as Brush;
  return {painter: () => makePainter(brush, {t: 0, frame: 0}), polys};
};
const near = (a: number, b: number, tol: number, msg: string) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (tol ${tol})`);
const pt = (p: [number, number] | null, x: number, y: number, tol: number, msg: string) => { assert.ok(p, `${msg}: projects`); near(p![0], x, tol, `${msg} x`); near(p![1], y, tol, `${msg} y`); };

test('N8 bowl: lower 30 deg to y 18 at 40 m, upper deck 34 deg to y 45 at 88 m, outer wall 143 x 112.5 m; bowlD inverts bowlPt', () => {
  near(standY(6), 0, 1e-9, 'stand starts'); near(standY(40), 18, 0.01, 'lower bowl top'); near(standY(44), 18, 1e-9, 'concourse flat'); near(standY(45), 16, 1e-9, 'upper deck start'); near(standY(88), 45, 0.01, 'upper deck top');
  near(bowlPt(88, 0)[0], FIELD.hx + 88, 1e-6, 'x extent'); near(bowlPt(88, 0.25)[1], FIELD.hz + 88, 1e-6, 'z extent');
  for (const d of [10, 30, 67.5, 71.5]) for (const s of [0.03, 0.2, 0.3, 0.5, 0.8]) { const [x, z] = bowlPt(d, s); near(bowlD(x, z), d, 1e-6, `d ${d} s ${s}`); }
  assert.ok(ROOF.d0 < ROOF.d1 && ROOF.y0 > standY(ROOF.d1), 'the roof ring is above the upper deck');
  assert.equal(lookSh19Cam(0).y, sh19Cam(0).y, 'the look file follows the production camera (R2.2)');
});

test('R2.2 cameras: sheet pos and look-at at the ends, and the numbers the sheet computed (SH20 +0, SH19 +24, SH21 +0/+38/+52)', () => {
  const eq = (c: {x: number; y: number; z: number}, p: number[], msg: string) => { near(c.x, p[0], 1e-9, msg + ' x'); near(c.y, p[1], 1e-9, msg + ' y'); near(c.z, p[2], 1e-9, msg + ' z'); };
  eq(sh17Cam(0), [0, 601, 0.5], 'SH17 +0'); eq(sh17Cam(5), [0, 601, 0.5], 'SH17 hold to +5'); eq(sh17Cam(46), [-70, 120, 170], 'SH17 +46');
  eq(sh18Cam(0), [-10, 33, 92], 'SH18 +0'); eq(sh18Cam(52), [4, 33, 92], 'SH18 +52');
  eq(sh19Cam(0), [-30, 35.7, 96], 'SH19 +0'); eq(sh19Cam(45), [-28, 33.6, 93], 'SH19 +45');
  eq(sh20Cam(0), [15, 14.2, 52], 'SH20 +0'); eq(sh20Cam(58), [15, 11.9, 48], 'SH20 +58');
  eq(sh21Cam(0), [-0.3, 1.1, 146.45], 'SH21 +0'); eq(sh21Cam(22), [-0.3, 1.1, 146.45], 'SH21 hold to +22'); eq(sh21Cam(52), [-1.2, 1.5, 148.8], 'SH21 +52'); eq(sh21Cam(82), [-1.2, 1.5, 148.8], 'SH21 hold to +82');
  // sheet numbers (storyboard shots 20, 19 and 21)
  pt(stadiumPx('SH20', 0, [58, 2.5, 0]), 898, 875, 1.5, 'SH20 stage deck front'); pt(stadiumPx('SH20', 0, [62, 18, 0]), 976, 622, 1.5, 'SH20 back-wall top');
  pt(stadiumPx('SH20', 0, [20, 1.5, 22]), 373, 1095, 1.5, 'SH20 near floor head'); pt(stadiumPx('SH20', 0, [15, 1.4, 31]), 225, 1278, 2, 'SH20 lower-stand front head (crowd mass in the band)');
  pt(stadiumPx('SH19', 24, [50, 22, 0]), 492, 857, 1.5, 'SH19 truss top');
  const tip = (f: number) => camPoint(sh21Cam(f), [KB.penX, KB.drum.c[1] + KB.drum.R * Math.cos(KB.penA), KB.drum.c[2] + KB.drum.R * Math.sin(KB.penA)]);
  pt(tip(0), 602, 891, 1.5, 'SH21 pen +0');
  pt(tip(38), 813, 1062, 1.5, 'SH21 pen +38 (R2.4 B3)'); pt(tip(52), 788, 1034, 1.5, 'SH21 pen +52 (R2.4 B3)'); pt(camPoint(sh21Cam(52), [0.3, 0.9, 146.25]), 914, 1031, 1.5, 'SH21 box top right corner +52');
  const c0 = sh21Cam(0); near((c0.yaw * 180) / Math.PI, 33.7, 0.05, 'SH21 start yaw'); near((c0.pitch! * 180) / Math.PI, -29.0, 0.05, 'SH21 start pitch');
  const c1 = sh21Cam(52); near((c1.pitch! * 180) / Math.PI, -8.2, 0.05, 'SH21 end pitch'); near(sh21Cam(52).x, -1.2, 1e-9, 'x'); near(sh21Cam(52).y, 1.5, 1e-9, 'SH21 lens rises to 1.50');
});

test('A17 lens clear: shots 18-20 stand 1.8 m over the true stand surface in every frame; shot 17 is above the roof; shot 21 stays outside the box and above the pavement', () => {
  for (const [sh, lo, hi] of [['SH18', 1.8, 1.85], ['SH19', 1.74, 1.85], ['SH20', 1.78, 1.82]] as [StadiumShot, number, number][]) {
    for (let f = 0; f < STADIUM_SHOTS[sh].len; f++) { const k = lensClearance(STADIUM_SHOTS[sh].cam(f)); assert.ok(k >= lo && k <= hi, `${sh} f${f}: clearance ${k.toFixed(3)} m`); }
  }
  // the near row in front of SH19's lens has heads at y <= 34.74, below the start lens (35.7)
  const heads = seatHeads(-32, -26, 95.2, 95.2, true);
  assert.ok(Math.max(...heads.map((n) => n.h)) <= 34.8 && Math.max(...heads.map((n) => n.h)) < sh19Cam(0).y);
  for (let f = 0; f < STADIUM_SHOTS.SH17.len; f++) assert.ok(sh17Cam(f).y > ROOF.y0 + 50, `SH17 f${f}: above the roof`);
  const B = KB.box;
  for (let f = 0; f < SH21_LEN; f++) { const c = sh21Cam(f); assert.ok(c.y > 0.3, 'above the pavement'); assert.ok(!(c.x > B.x0 - 0.05 && c.x < B.x1 + 0.05 && c.y < B.y1 + 0.05 && c.z > B.z0 - 0.05 && c.z < B.z1 + 0.05), `SH21 f${f}: outside the box`); }
});

test('R2.4 B3 SH21: the lens is above the glass lid every frame and the pen tip is seen through the lid (not past the steel front edge) every frame', () => {
  const B = KB.box, tipW: [number, number, number] = [KB.penX, KB.drum.c[1] + KB.drum.R * Math.cos(KB.penA), KB.drum.c[2] + KB.drum.R * Math.sin(KB.penA)];
  for (let f = 0; f < SH21_LEN; f++) {
    const c = sh21Cam(f);
    assert.ok(c.y > KB.lidY + 0.1, `SH21 f${f}: lens ${c.y.toFixed(3)} over the lid ${KB.lidY}`);
    const t = (c.y - KB.lidY) / (c.y - tipW[1]), x = c.x + (tipW[0] - c.x) * t, z = c.z + (tipW[2] - c.z) * t;
    assert.ok(x > B.x0 && x < B.x1 && z > B.z0 && z < B.z1, `SH21 f${f}: the sight line to the pen tip crosses the lid at (${x.toFixed(3)}, ${z.toFixed(3)})`);
    const tz = (c.z - B.z1) / (c.z - tipW[2]), yAtFront = c.y + (tipW[1] - c.y) * tz;
    assert.ok(yAtFront > B.y1, `SH21 f${f}: the sight line clears the steel front top edge (y ${yAtFront.toFixed(3)} > ${B.y1})`);
    const q = camPoint(c, tipW); assert.ok(q && q[0] > 0 && q[0] < 1080 && q[1] > 0 && q[1] < 1920, `SH21 f${f}: pen tip on the picture`);
    const d = camPoint(c, [0, KB.drum.c[1], KB.drum.c[2]]); assert.ok(d && d[0] > 0 && d[0] < 1080 && d[1] > 0 && d[1] < 1920, `SH21 f${f}: drum on the picture`);
  }
});

test('N8 SH20 bounce: peaks at +6, +19, +32, +45 (13 f period), zero at the troughs, nothing before +0', () => {
  for (const f of [6, 19, 32, 45]) near(bounceLift(f), 0.14, 1e-9, `peak +${f}`);
  for (const f of [12.5, 25.5, 38.5]) assert.ok(bounceLift(f) < 1e-6, `trough ${f}`);
  assert.equal(bounceLift(-1), 0);
});

test('N9 trace clock: jitter is a pure function of (sample, line, frame); the live line bursts, the older lines do not follow the frame', () => {
  assert.equal(traceJitter(12, 0, 7), traceJitter(12, 0, 7));
  assert.equal(traceJitter(12, 5, 7), traceJitter(12, 5, 40), 'old lines are still');
  assert.notEqual(traceJitter(12, 0, 7), traceJitter(12, 0, 9), 'the live line changes every 2 f');
  let hi = 0, lo = 1; for (let f = 0; f < 60; f++) for (let i = 0; i < 90; i++) { const b = traceBurst(i, f); hi = Math.max(hi, b); lo = Math.min(lo, b); }
  assert.ok(hi > 0.95 && lo === 0, 'burst envelope spans 0..1');
});

test('N8/N9 paint: every shot paints through a recording brush inside the polygon budget, deterministically; day has no night colours and night has no foreground fans', () => {
  const counts: Record<string, number> = {};
  for (const sh of Object.keys(STADIUM_SHOTS) as StadiumShot[]) {
    const f = {SH17: 36, SH18: 25, SH19: 24, SH20: 27}[sh];
    const a = recording(), b = recording();
    paintStadiumShot(a.painter(), sh, f); paintStadiumShot(b.painter(), sh, f);
    counts[sh] = a.polys.length;
    assert.ok(a.polys.length > 500 && a.polys.length < 14000, `${sh}: ${a.polys.length} polygons`);
    assert.deepEqual(a.polys.slice(0, 200), b.polys.slice(0, 200), `${sh}: repeatable`);
    const colors = new Set(a.polys.map((q) => q.color));
    if (STADIUM_SHOTS[sh].state === 'day') assert.ok(colors.has(SD.day.turf) && !colors.has(SD.night.stage), `${sh}: day`); else assert.ok(colors.has(SD.night.stage) && !colors.has(SD.day.turf), `${sh}: night`);
  }
  console.log('stadium polygons', JSON.stringify(counts));
  for (const f of [2, 12, 38, 52]) { const r = recording(); const res = paintSh21(r.painter(), f); assert.ok(r.polys.length > 40 && r.polys.length < 4000, `SH21 f${f}: ${r.polys.length} polygons`); assert.ok(res.pen !== null || f >= 38, 'pen tip projects'); }
});

// Fix pass D (Boss, 2026-11-12): the stadium crowd must not sparkle. Identity is a hash of a world grid id, never of the camera, the depth sort or an array index.
test('fix pass D: seat grids are world-anchored (a moved range returns the same people), and the stand-quad ids ignore the depth sort', () => {
  const a = seatHeads(-9.9, 9.9, 72, 80, false), b = seatHeads(-4.4, 14.3, 72, 80, false), byId = new Map(b.map((n) => [n.id, n]));
  const shared = a.filter((n) => byId.has(n.id));
  assert.ok(shared.length > 100, 'ranges overlap');
  for (const n of shared) { const m = byId.get(n.id)!; assert.equal(m.x, n.x); assert.equal(m.h, n.h); assert.equal(m.shirt, n.shirt); assert.equal(m.skin, n.skin); }
  assert.equal(new Set(a.map((n) => n.id)).size, a.length, 'ids unique');
});

const LIMIT: Record<StadiumShot, number> = {SH17: 0.15, SH18: 0.08, SH19: 0.04, SH20: 0.05};
type Seen = Map<string, [number, number]>;
const recordSeeds = (sh: StadiumShot, f: number): Seen => {
  const out: Seen = new Map(), occ = new Map<number, number>();
  let seed = 0;
  const brush = new Proxy({}, {get: (_t, k) => (...a: unknown[]) => {
    if (k === 'seed') seed = a[0] as number;
    if (k === 'polygon') { const pts = a[0] as [number, number][], n = occ.get(seed) ?? 0; occ.set(seed, n + 1); out.set(`${seed}#${n}`, [pts.reduce((t, q) => t + q[0], 0) / pts.length, pts.reduce((t, q) => t + q[1], 0) / pts.length]); }
  }}) as Brush;
  paintStadiumShot(makePainter(brush, {t: 0, frame: 0}), sh, f);
  return out;
};

test('fix pass D: across every consecutive frame pair of SH17-SH20, a seeded crowd member keeps its seed and does not teleport (pops and reseeds stay a small share of the polygons)', () => {
  const report: Record<string, string> = {};
  for (const sh of Object.keys(STADIUM_SHOTS) as StadiumShot[]) {
    let prev = recordSeeds(sh, 0), worst = 0, worstF = 0;
    for (let f = 1; f < STADIUM_SHOTS[sh].len; f++) {
      const cur = recordSeeds(sh, f), cells = new Map<string, [number, number][]>(), cell = (v: number[]) => `${Math.floor(v[0] / 96)},${Math.floor(v[1] / 96)}`;
      let bad = 0;
      for (const [k, v] of cur) { const o = prev.get(k); if (!o) bad++; else (cells.get(cell(o)) ?? cells.set(cell(o), []).get(cell(o))!).push([v[0] - o[0], v[1] - o[1]]); }
      for (const k of prev.keys()) if (!cur.has(k)) bad++;
      const med = (x: number[]) => x.sort((p, q) => p - q)[Math.floor(x.length / 2)];
      for (const [k, v] of cur) { const o = prev.get(k), g = o && cells.get(cell(o)); if (o && g && g.length >= 5 && Math.hypot(v[0] - o[0] - med(g.map((q) => q[0])), v[1] - o[1] - med(g.map((q) => q[1]))) > 60) bad++; }
      const share = bad / Math.max(cur.size, prev.size); if (share > worst) { worst = share; worstF = f; }
      prev = cur;
    }
    report[sh] = `${(worst * 100).toFixed(1)}% at +${worstF}`;
    assert.ok(worst < LIMIT[sh], `${sh}: worst pair ${(worst * 100).toFixed(1)}% of polygons pop or reseed at +${worstF}`);
  }
  console.log('stadium crowd churn (worst pair)', JSON.stringify(report));
});
