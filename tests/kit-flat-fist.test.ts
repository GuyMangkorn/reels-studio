import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import type {Brush} from '../src/painted/BrushCanvas';
import {drawFigure, type CastDef, type FigPose} from '../src/painted/kit/cast';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {flatFistAt} from '../src/painted/kit/draw';
import {mittenThumbSide} from '../src/painted/kit/hand-gestures';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {camPoint, camUnit} from '../src/painted/kit/ycam';
import {GUNNER1, paintSeatedGunner} from '../src/painted/edu30/cast';
import {GUNNER_PROOFS, gunnerProofAt} from '../src/painted/edu30/proof-cast';

// EDU-EP30-SHORT ticket T36: `Arm.flatFist`, the unshaped kit fist with its thumb on a held point (front, profile and back views).

/** A painter over a brush that records every call; splines keep their points. */
const recorder = () => {
  const log: string[] = [], splines: Pt[][] = [];
  const brush = new Proxy({}, {get: (_, k) => (...a: unknown[]) => { log.push(String(k) + JSON.stringify(a)); if (k === 'spline') splines.push(a[0] as Pt[]); }}) as Brush;
  return {p: makePainter(brush, {t: 0, frame: 0}), splines, hash: () => createHash('sha1').update(log.join('\n')).digest('hex').slice(0, 12), n: () => log.length};
};

// Fists on three existing characters in the three view families; flatFist absent (or added for the live check).
const POSES: {id: keyof typeof PEOPLE; pose: Partial<FigPose> & {view: FigPose['view']}}[] = [
  {id: 'man-crop', pose: {view: 'front', rArm: {to: [470, 1000], via: [440, 900], exact: true, fist: -1}, lArm: {to: [610, 1000], via: [640, 900], fist: 1}}},
  {id: 'man-parted', pose: {view: 'back', rArm: {to: [610, 1000], via: [640, 900], exact: true, fist: 1}, lArm: {to: [470, 1000], fist: -1}}},
  {id: 'man-elder', pose: {view: 'right', rArm: {to: [600, 950], fist: 1}}},
];
const drawHash = (flat: boolean) => POSES.map(({id, pose}) => {
  const r = recorder(), tw = (a: FigPose['rArm']) => (a && flat ? {...a, flatFist: true} : a);
  drawFigure(r.p, PEOPLE[id] as CastDef, [540, 1500], 600, {face: EXPRESSIONS.neutral, ...pose, rArm: tw(pose.rArm), lArm: tw((pose as FigPose).lArm)} as FigPose, 1.2, 77);
  return r.hash();
});
const gunnerLegacy = () => {
  const d = GUNNER_PROOFS[0], r = recorder();
  paintSeatedGunner(r.p, d.cam, GUNNER1, d.seat, {view: 'front', t: 1.2, seed: 33200});
  return r.hash();
};

// Hashes of the stroke lists from the build before T36 (ea37ad9).
const BASE_DRAW = ['39e4b2d3867d', 'ef68705b3b89', '73a01e4ee318'];
const BASE_GUNNER = '8ac3d266aa4a';

test('a) flatFist absent: stroke lists of three existing characters and the LF01a gunner call are the pre-change lists', () => {
  const h = drawHash(false), g = gunnerLegacy();
  console.log(`hashes draw ${h.join(' ')} gunner ${g}`);
  assert.deepEqual(h, BASE_DRAW);
  assert.equal(g, BASE_GUNNER);
});

test('a2) flatFist true changes the strokes (the option is live) in front, back and profile', () => {
  const h = drawHash(true);
  h.forEach((x, i) => assert.notEqual(x, BASE_DRAW[i], `pose ${i}`));
});

test('b) flat fist centre within 0.01 hu of the held point, never more than 0.05 hu past it along the forearm; thumb crease on the side edge', () => {
  for (const ang of [0, 0.7, Math.PI / 2, 2.4, -2.1, Math.PI]) for (const side of [1, -1] as const) {
    const T: Pt = [540, 900], hu = 600, F = flatFistAt(T, ang, hu, side), c = Math.cos(ang), s = Math.sin(ang);
    const u = F.back.map(([x, y]) => ((x - T[0]) * c + (y - T[1]) * s) / hu), v = F.back.map(([x, y]) => (-(x - T[0]) * s + (y - T[1]) * c) / hu);
    const uc = (Math.min(...u) + Math.max(...u)) / 2;
    assert.ok(Math.abs(uc) <= 0.01, `centre ${uc} at ang ${ang}`);
    assert.ok(Math.max(...u) <= 0.05, `past T ${Math.max(...u)}`);
    const w = Math.max(...v) - Math.min(...v), l = Math.max(...u) - Math.min(...u);
    console.log(`fist bbox ang ${ang.toFixed(2)} side ${side}: along ${l.toFixed(3)} across ${w.toFixed(3)} hu, centre ${uc.toFixed(4)}`);
    assert.ok(Math.abs(l - 0.097) < 0.01 && Math.abs(w - 0.069) < 0.01);
    const tv = F.thumbCrease.map(([x, y]) => -(x - T[0]) * s + (y - T[1]) * c);
    assert.ok(tv.every((q) => q * side > 0), `thumb side ${side}`);
    assert.equal(F.creases.length, 3);
  }
});

/** The fists a recorded gunner draws: outline (many points) followed by its four 3-point strokes; centre, forward direction and thumb offset in px. */
const fists = (splines: Pt[][]) => {
  const out: {centre: Pt; fwd: Pt; thumb: Pt; len: number; across: number}[] = [];
  const mean = (pts: Pt[]): Pt => [pts.reduce((a, b) => a + b[0], 0) / pts.length, pts.reduce((a, b) => a + b[1], 0) / pts.length];
  splines.forEach((sp, i) => {
    const q = splines.slice(i + 1, i + 5);
    if (sp.length < 20 || q.length < 4 || !q.every((x) => x.length === 3)) return;
    const centre = mean(sp), fc = mean(q.slice(0, 3).flat()), tm = mean(q[3]);
    const fl = Math.hypot(fc[0] - centre[0], fc[1] - centre[1]);
    if (fl > 60 || fl < 0.5) return;
    const fwd: Pt = [(fc[0] - centre[0]) / fl, (fc[1] - centre[1]) / fl];
    const xs = sp.map((a) => (a[0] - centre[0]) * fwd[0] + (a[1] - centre[1]) * fwd[1]), ys = sp.map((a) => -(a[0] - centre[0]) * fwd[1] + (a[1] - centre[1]) * fwd[0]);
    // the fist centre is the middle of its extent along and across the forearm (the point mean of a smoothed outline is biased toward the knuckles)
    const xm = (Math.max(...xs) + Math.min(...xs)) / 2, ym = (Math.max(...ys) + Math.min(...ys)) / 2;
    const mid: Pt = [centre[0] + xm * fwd[0] - ym * fwd[1], centre[1] + xm * fwd[1] + ym * fwd[0]];
    out.push({centre: mid, fwd, thumb: [tm[0] - mid[0], tm[1] - mid[1]], len: Math.max(...xs) - Math.min(...xs), across: Math.max(...ys) - Math.min(...ys)});
  });
  return out;
};
const EXPECT: Record<string, {r: string; l: string}> = {'C30-gunner-front': {r: 'right', l: 'left'}, 'C30-gunner-back': {r: 'left', l: 'right'}, 'C30-gunner-34': {r: 'right', l: 'left'}, 'C30-gunner-right': {r: 'right', l: 'hidden'}};

test('c) gunner: fist on the grip and stock, thumb on the mittenThumbSide edge (back of the hand), measured on the recorded strokes', () => {
  for (const d of GUNNER_PROOFS) for (const L of [0, 1]) {
    const {a, jolt} = gunnerProofAt(d, L), r = recorder();
    paintSeatedGunner(r.p, d.cam, GUNNER1, d.seat, {view: d.view, grip: a.grip, stock: a.stock, jolt, t: 1.2, seed: 33200});
    const F = fists(r.splines), Wr = camPoint(d.cam, a.grip)!, Wl = camPoint(d.cam, a.stock)!;
    console.log(`${d.id} j${jolt}: ${F.length} fists`);
    for (const [name, W, side, hand] of [['RIGHT', Wr, 'right', 'r'], ['LEFT', Wl, 'left', 'l']] as const) {
      const near = F.map((x) => ({x, e: Math.hypot(x.centre[0] - W[0], x.centre[1] - W[1])})).sort((p, q) => p.e - q.e)[0];
      const f = near?.x, err = near?.e ?? NaN;
      if (!f || err > 8) { console.log(`${d.id} j${jolt} thumb check: GUNNER-1 ${name}: hidden (no fist stroke at the point)`); assert.equal(EXPECT[d.id][hand], 'hidden', `${d.id} ${name}`); continue; }
      // rule (hand-drawing section 2): back of a RIGHT hand = counter-clockwise of wrist -> fingers; back of a LEFT hand = clockwise (screen, y down)
      const ccw: Pt = [f.fwd[1], -f.fwd[0]], want: Pt = side === 'right' ? ccw : [-ccw[0], -ccw[1]];
      assert.equal(mittenThumbSide(side, 'back'), side === 'right' ? -1 : 1);
      const dot = f.thumb[0] * want[0] + f.thumb[1] * want[1];
      const screen = Math.abs(f.thumb[0]) >= Math.abs(f.thumb[1]) ? (f.thumb[0] > 0 ? 'right' : 'left') : (f.thumb[1] > 0 ? 'down' : 'up');
      console.log(`${d.id} j${jolt} thumb check: GUNNER-1 ${name}: screen ${screen} ${dot > 0 ? 'ok' : 'FAIL'}; fist centre ${err.toFixed(2)} px from the point; fist ${f.len.toFixed(1)} x ${f.across.toFixed(1)} px; thumb offset (${f.thumb[0].toFixed(1)}, ${f.thumb[1].toFixed(1)}) px; fingers (${f.fwd[0].toFixed(2)}, ${f.fwd[1].toFixed(2)})`);
      assert.ok(dot > 0, `${d.id} ${name} thumb side`);
      assert.ok(err <= Math.max(3, 0.01 * camUnit(d.cam, d.seat)), `${d.id} ${name} fist on point ${err}`);
    }
  }
});
