// test-scope: shared
import assert from 'node:assert/strict';
import {test} from 'node:test';
import type {Brush} from '../src/painted/BrushCanvas';
import {MACRO_CAMS, camOf as edu05CamOf} from '../src/painted/edu05/cams';
import * as edu02 from '../src/painted/edu02/world';
import {camMove, camMoveK, camOf} from '../src/painted/kit/cam-moves';
import type {FigAnchors} from '../src/painted/kit/cast';
import {figureItem, paintFigureAt, viewAtCam} from '../src/painted/kit/figure-at';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import type {V3} from '../src/painted/kit/space';
import {boxFaces, clip, flatCircle, hull, paintSorted, qy, sphereAt, wp, type Box} from '../src/painted/kit/world';
import {camUnit, orbitYCam} from '../src/painted/kit/ycam';

const recorder = () => {
  const calls: string[] = [];
  return {calls, brush: new Proxy({}, {get: (_, name) => (...args: unknown[]) => { calls.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush};
};
const DEG = Math.PI / 180;
const cam = orbitYCam([0, 0, 0], 4, 30 * DEG, 1.5, 900, 900);

// --- world.ts -------------------------------------------------------------------------------------------------------------
test('kit world helpers match the EDU-EP02 copy they were promoted from', () => {
  const box: Box = {x0: -0.5, x1: 0.5, y0: 0, y1: 0.8, z0: -0.4, z1: 0.4};
  assert.deepEqual(boxFaces(cam, box), edu02.boxFaces(cam, box));
  const floor = qy(0, -3, 3, -3, 3);
  assert.deepEqual(wp(cam, floor), edu02.wp(cam, floor));
  assert.deepEqual(flatCircle(cam, [0, 0, 0], 0.5), edu02.flatCircle(cam, [0, 0, 0], 0.5));
  assert.deepEqual(sphereAt(cam, [0, 1, 0], 0.2), edu02.sphereAt(cam, [0, 1, 0], 0.2));
});

test('clip keeps a polygon inside the safe box; boxFaces shows only faces turned to the camera', () => {
  const big: Pt[] = [[-5000, -5000], [5000, -5000], [5000, 5000], [-5000, 5000]];
  const c = clip(big);
  assert.ok(c.length >= 4 && c.every(([x, y]) => x >= -300 - 1e-6 && x <= 1380 + 1e-6 && y >= -300 - 1e-6 && y <= 2220 + 1e-6));
  // Camera above and on +x, +z of the box: top, right and front show; bottom, left and back do not.
  const faces = boxFaces(cam, {x0: -0.5, x1: 0.5, y0: 0, y1: 0.8, z0: -0.4, z1: 0.4}).map((f) => f.face).sort();
  assert.deepEqual(faces, ['front', 'right', 'top']);
});

test('hull drops interior points; sphereAt is null behind the lens; paintSorted paints far to near', () => {
  assert.equal(hull([[0, 0], [10, 0], [10, 10], [0, 10], [5, 5]]).length, 4);
  assert.equal(sphereAt(cam, [cam.x + 10 * Math.sin(cam.yaw), 1, cam.z + 10 * Math.cos(cam.yaw)], 0.2), null);
  const order: string[] = [];
  const p = makePainter(recorder().brush, {t: 0, frame: 0});
  const toward = (d: number): V3 => [cam.x - d * Math.sin(cam.yaw), 0, cam.z - d * Math.cos(cam.yaw)];
  paintSorted(p, cam, [
    {at: toward(2), draw: () => order.push('near')},
    {at: toward(6), draw: () => order.push('far')},
    {at: toward(2.5), bias: -1, draw: () => order.push('biased')},
  ]);
  assert.deepEqual(order, ['far', 'near', 'biased']);
});

// --- cam-moves.ts ---------------------------------------------------------------------------------------------------------
test('kit camOf matches the EDU-EP05 copy on every macro shot', () => {
  for (const [id, m] of Object.entries(MACRO_CAMS)) for (const u of [0, 0.2, 0.5, 0.83, 1]) assert.deepEqual(camOf(m, u), edu05CamOf(m, u), `${id} u ${u}`);
});

test('camMove expands static values; ease holds the camera before and after its window', () => {
  const m = camMove([0, 1, 0], [0, 20], 3, [1, 2], {f: 1000, hy: 800, ease: [0.25, 0.75]});
  assert.deepEqual(m.r, [3, 3]);
  assert.deepEqual(m.at, [[0, 1, 0], [0, 1, 0]]);
  assert.equal(camMoveK(m, 0.1), 0);
  assert.equal(camMoveK(m, 0.9), 1);
  assert.equal(camMoveK(m, 0.5), 0.5);
  assert.deepEqual(camOf(m, 0), camOf(m, 0.25));
  assert.deepEqual(camOf(m, 0), {...orbitYCam([0, 1, 0], 3, 0, 1, 1000, 800), pitch: 0, cx: 0});
});

// --- figure-at.ts ---------------------------------------------------------------------------------------------------------
test('paintFigureAt places the feet at the ground point, sized by the lens, with finite anchors', () => {
  const r = recorder(), p = makePainter(r.brush, {t: 0, frame: 0});
  const def = PEOPLE['woman-curly'];
  const at: V3 = [0.3, 0, -0.2];
  let held = 0;
  const a = paintFigureAt(p, cam, def, {at, pose: 'P01', face: 'happy', t: 0, held: (_q, _a, u) => { held = u; }});
  assert.ok(a);
  assert.ok(Object.values(a).flat().every((v) => typeof v !== 'number' || Number.isFinite(v)));
  assert.ok(Math.abs(held - camUnit(cam, at)) < 1e-9);
  assert.ok(r.calls.length > 20 && !r.calls.some((c) => c.includes('null'))); // JSON turns NaN into null
  // Feet behind the lens: nothing is painted.
  const behind: V3 = [cam.x + 3 * Math.sin(cam.yaw), 0, cam.z + 3 * Math.cos(cam.yaw)];
  assert.equal(paintFigureAt(p, cam, def, {at: behind, t: 0}), null);
});

test('viewAtCam squares four views to the lens and follows a world facing through six views', () => {
  for (const v of ['front', 'right', 'back', 'left'] as const) assert.deepEqual(viewAtCam(cam, {at: [0, 0, 0], view: v}), {view: v});
  // Facing -z, camera orbiting from behind (+z) to the front (-z) passes back, right, front-right, front.
  const views = [0, 90, 135, 180].map((o) => viewAtCam(orbitYCam([0, 0, 0], 3, o * DEG, 1.5, 900, 880), {at: [0, 0, 0], facing: [0, -1]}));
  assert.deepEqual(views, [{view: 'back'}, {view: 'right'}, {view: 'front', quarter: 'right', quarterDeg: 45}, {view: 'front'}]);
});

test('figureItem paints through paintSorted and hands out the anchors', () => {
  const out: {a?: FigAnchors | null} = {};
  paintSorted(makePainter(recorder().brush, {t: 0, frame: 0}), cam, [figureItem(PEOPLE['man-parted'], {at: [0, 0, 0], view: 'back', t: 0}, {out})]);
  assert.ok(out.a);
});

test('Arm.exact keeps a projected hand point on a turned body (front and back three-quarter); without it the turn pulls it in', () => {
  // EDU-EP26 draft fix B (19 Nov 2026): 3D hands and held props sat off the painted arm ends because the turn remapped `to`.
  for (const o of [135, 45]) {
    const c = orbitYCam([0, 0, 0], 3, o * DEG, 1.5, 900, 880), v = viewAtCam(c, {at: [0, 0, 0], facing: [0, -1]});
    assert.ok(v.quarter, `orbit ${o}: a three-quarter view`);
    const to: Pt = [470, 1000], via: Pt = [500, 1080];
    const run = (exact: boolean) => paintFigureAt(makePainter(recorder().brush, {t: 0, frame: 0}), c, PEOPLE['man-parted'],
      {at: [0, 0, 0], facing: [0, -1], t: 0, fig: {rArm: {to, via, noHand: true, ...(exact ? {exact: true} : {})}}})!;
    const a = run(true), b = run(false);
    // the back view's hand anchor is the hand centre, 3 cm past the arm end along the forearm
    const da = Math.hypot(a.rHand[0] - to[0], a.rHand[1] - to[1]), db = Math.hypot(b.rHand[0] - to[0], b.rHand[1] - to[1]), tol = 0.035 * camUnit(c, [0, 1, 0]);
    assert.ok(da < tol, `orbit ${o}: exact hand ${a.rHand} on ${to} (${da.toFixed(1)} px, tol ${tol.toFixed(1)})`);
    assert.ok(db > da + 5, `orbit ${o}: remapped hand moves (${db.toFixed(1)} px)`);
  }
});
