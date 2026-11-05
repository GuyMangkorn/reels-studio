import assert from 'node:assert/strict';
import {test} from 'node:test';
import type {Brush} from '../src/painted/BrushCanvas';
import {drawFigure, type FigPose} from '../src/painted/kit/cast';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE, PERSON_IDS} from '../src/painted/kit/people';
import {poseArms} from '../src/painted/kit/poses';
import {clipHalf, curvedEdge, polarUnion, quarterGeo, simplify, splitByCurve} from '../src/painted/kit/quarter';
import {dress} from '../src/painted/kit/wardrobe';
import {figureView, viewFields, viewNameAt} from '../src/painted/kit/views';
import {camPoly, camPoint, orbitYCam} from '../src/painted/kit/ycam';

test('figureView follows the orbit angle through the six views (figure faces -z, camera starts behind her)', () => {
  // Orbit angle o sees the figure at view angle 180 - o: back covers 135-225, the profiles 67.5-135 / 225-292.5, the front diagonals 45 deg steps.
  const orbit = [0, 40, 50, 90, 135, 180, 225, 270, 310, 320];
  const names = orbit.map((deg) => figureView(orbitYCam([0, 0, 0], 3, (deg * Math.PI) / 180, 1.5, 900, 880), [0, 0, 0], [0, -1]));
  assert.deepEqual(names, ['back', 'back', 'right', 'right', 'front-right', 'front', 'front-left', 'left', 'left', 'back']);
  assert.equal(viewNameAt(-90), 'left');
  assert.deepEqual([0, 22.5, 67.5, 134.9, 135, 224.9, 225, 292.5, 337.5, 360].map(viewNameAt), ['front', 'front-right', 'right', 'right', 'back', 'back', 'left', 'front-left', 'front', 'front']);
  assert.deepEqual(viewFields('front-left'), {view: 'front', quarter: 'left', quarterDeg: 45});
  assert.deepEqual(viewFields('back'), {view: 'back'});
  // Hysteresis keeps the previous view a few degrees past its edge, then lets go.
  const cam = (o: number) => orbitYCam([0, 0, 0], 3, (o * Math.PI) / 180, 1.5, 900, 880);
  assert.equal(figureView(cam(47), [0, 0, 0], [0, -1], {prev: 'back', hysteresis: 5}), 'back'); // view angle 133
  assert.equal(figureView(cam(52), [0, 0, 0], [0, -1], {prev: 'back', hysteresis: 5}), 'right'); // view angle 128
});

test('camPoly clips at the near plane and camPoint drops points behind the lens', () => {
  const c = {x: 0, y: 1.5, z: 0, yaw: 0, f: 900, hy: 880};
  assert.equal(camPoint(c, [0, 0, 5]), null);
  const quad = camPoly(c, [[-5, 0, 10], [5, 0, 10], [5, 0, -10], [-5, 0, -10]]);
  assert.ok(quad.length >= 4 && quad.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y)));
});

test('quarterGeo clamps the turn to 15..60 degrees and splits the silhouette into front and side plane', () => {
  assert.equal(quarterGeo({}), undefined);
  assert.ok(Math.abs(quarterGeo({quarter: 'left', quarterDeg: 90})!.qr - (60 * Math.PI) / 180) < 1e-9);
  assert.ok(Math.abs(quarterGeo({quarter: 'right', quarterDeg: 1})!.qr - (15 * Math.PI) / 180) < 1e-9);
  const g45 = quarterGeo({quarter: 'left'})!;
  assert.equal(g45.qdir, -1);
  // 45 degrees: the front plane is about 62 % of the width, the side plane the rest; a bigger turn gives the side plane more.
  assert.ok(g45.sf > 0.55 && g45.sf < 0.7);
  assert.ok(quarterGeo({quarter: 'left', quarterDeg: 60})!.sf < g45.sf && g45.sf < quarterGeo({quarter: 'left', quarterDeg: 30})!.sf);
});

test('clipHalf keeps the side of the line holding the reference point; curvedEdge dips most at the plane edge and not at the ends', () => {
  const sq: Pt[] = [[0, 0], [10, 0], [10, 10], [0, 10]];
  const kept = clipHalf(sq, [5, -1], [5, 11], [9, 5]);
  assert.ok(kept.length >= 4 && kept.every(([x]) => x >= 5 - 1e-9));
  const e = curvedEdge(1, -1, 0, 0.2, 0.05, 8);
  assert.equal(e.length, 9);
  assert.ok(Math.abs(e[0][1]) < 1e-9 && Math.abs(e[8][1]) < 1e-9);
  assert.ok(Math.min(...e.map(([, v]) => v)) < -0.049);
});

// Draw smoke test: every PEOPLE entry in the front three-quarter views at 15/30/45/60 degrees has finite anchors and no NaN brush argument.
const recorder = () => {
  const calls: string[] = [];
  return {calls, brush: new Proxy({}, {get: (_, name) => (...args: unknown[]) => { calls.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush};
};
const gp: Pt = [540, 1500], unit = 600;
const drawView = (def: Parameters<typeof drawFigure>[1], view: FigPose['view'], extra: Partial<FigPose>) => {
  const r = recorder();
  const armView = view === 'back' ? 'front' : view;
  const a = drawFigure(makePainter(r.brush, {t: 0, frame: 0}), def, gp, unit, {view, face: EXPRESSIONS.neutral, ...poseArms('P01', def, gp, unit, armView as 'front'), ...extra} as FigPose, 0);
  return {a, calls: r.calls.join('|')};
};
test('every PEOPLE entry draws the front three-quarter turn range with finite anchors', () => {
  for (const id of PERSON_IDS) {
    for (const view of ['front'] as const) {
      for (const quarter of ['left', 'right'] as const) {
        for (const quarterDeg of [15, 30, 45, 60]) {
          const {a, calls} = drawView(PEOPLE[id], view, {quarter, quarterDeg});
          for (const v of [...a.head, ...a.rHand, ...a.lHand, a.top, a.bottom]) assert.ok(Number.isFinite(v), `${id} ${view} ${quarter} ${quarterDeg}`);
          assert.ok(!calls.includes('NaN') && !calls.includes('null'), `${id} ${view} ${quarter} ${quarterDeg}: non-finite brush argument`);
        }
      }
    }
  }
});

test('a turned front body differs from the plain view, turns with the angle and mirrors its side', () => {
  const def = dress(PEOPLE['man-parted'], 'police');
  for (const view of ['front'] as const) {
    const plain = drawView(def, view, {}).calls, l45 = drawView(def, view, {quarter: 'left'}).calls, r45 = drawView(def, view, {quarter: 'right'}).calls;
    assert.notEqual(plain, l45);
    assert.notEqual(l45, r45);
    assert.notEqual(l45, drawView(def, view, {quarter: 'left', quarterDeg: 30}).calls);
    assert.equal(l45, drawView(def, view, {quarter: 'left', quarterDeg: 45}).calls);
  }
});

test('a cap seen from behind has no badge and no visor shade (4 Nov 2026 bug); the front keeps both', () => {
  const def = dress(PEOPLE['man-parted'], 'police');
  const back = drawView(def, 'back', {}).calls, backQ = drawView(def, 'back', {quarter: 'left'}).calls, front = drawView(def, 'front', {}).calls;
  // the badge colour is #e8dcb0 (hatFront 'white'); it appears in the front draw only
  assert.ok(front.toLowerCase().includes('#e8dcb0'));
  assert.ok(!back.toLowerCase().includes('#e8dcb0'));
  assert.equal(backQ, back);
});

test('quarter is a front-view field: back and profile views ignore it (back three-quarter views removed, user 4 Nov 2026)', () => {
  for (const def of [dress(PEOPLE['man-parted'], 'police'), PEOPLE['woman-long']]) {
    for (const view of ['back', 'left', 'right'] as const) {
      const plain = drawView(def, view, {}).calls;
      for (const quarter of ['left', 'right'] as const) assert.equal(drawView(def, view, {quarter, quarterDeg: 30}).calls, plain, `${view} ${quarter}`);
    }
  }
});

test('polarUnion merges a skull and a hair cap into one outline; splitByCurve cuts along the curve, not a straight edge; simplify keeps corners', () => {
  const circle = (r: number, n = 48): Pt[] => Array.from({length: n}, (_, i) => [r * Math.cos((i / n) * 2 * Math.PI), r * Math.sin((i / n) * 2 * Math.PI)] as Pt);
  const cap: Pt[] = [[-1.2, 0], [-1.2, -1.2], [1.2, -1.2], [1.2, 0], [0.5, -0.3], [-0.5, -0.3]];
  const u = polarUnion([circle(1), cap], [0, 0], 120);
  const top = u.reduce((a, q) => (q[1] < a[1] ? q : a));
  assert.ok(Math.abs(top[1] + 1.2) < 1e-6, 'the cap raises the top of the union');
  assert.ok(Math.abs(Math.max(...u.map(([, v]) => v)) - 1) < 0.01, 'the skull keeps the bottom');
  const h = (x: number) => 0.2 * x * x;
  const below = splitByCurve(circle(1, 96), h, 'below');
  assert.ok(below.poly.length > 10 && below.poly.every(([x, y]) => y >= h(x) - 1e-6));
  // The cut follows the curve: its points include the curve's interior samples (not just the two crossings joined by a chord).
  assert.ok(below.poly.some(([x, y]) => Math.abs(x) < 0.2 && Math.abs(y - h(x)) < 1e-6));
  const zig: Pt[] = Array.from({length: 101}, (_, i) => [i / 100, i === 50 ? 0.5 : 0] as Pt);
  const s = simplify(zig, 0.01);
  assert.equal(s.length, 5); // ends, the spike tip and its two feet
  assert.ok(s.some(([, y]) => y === 0.5));
});

test('four views: squareToCam shows the asked view to the camera at any set angle, view4At snaps in 90 degree steps', async () => {
  const {figureView4, squareToCam, view4At} = await import('../src/painted/kit/views');
  const {orbitYCam} = await import('../src/painted/kit/ycam');
  for (const az of [0, 45, 135, 225, 300]) {
    const cam = orbitYCam([0, 0, 0], 3, (az * Math.PI) / 180, 1.5, 900, 900);
    for (const v of ['front', 'right', 'back', 'left'] as const) assert.equal(figureView4(cam, [0, 0, 0], squareToCam(cam, [0, 0, 0], v)), v, `az ${az} ${v}`);
  }
  assert.deepEqual([0, 44, 46, 134, 136, -46, -44, 200].map(view4At), ['front', 'front', 'right', 'right', 'back', 'left', 'front', 'back']);
});
