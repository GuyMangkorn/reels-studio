import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {createHash} from 'node:crypto';
import {CREW_REACH_3D, FARMER, GUNNER1, GUNNER2, GUNNER_JOLT, GUNNER_REACH, LOADER_AT, LOADER_LEAN, MEREDITH, PAN_RIM, farmerTalk, gunnerCheck, gunnerReach, gunnerShoulders, paintCrewPose, paintSeatedGunner, solveCrewPose} from '../src/painted/edu30/cast';
import {AT, CAM_FARMER, CAM_LOADER, CAM_P44, CAM_P44_FULL, CAM_SALUTE, GUNNER_PROOFS, gunnerProof, gunnerProofAt, loaderPan} from '../src/painted/edu30/proof-cast';
import {mittenThumbSide} from '../src/painted/kit/hand-gestures';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {camPoint, camUnit} from '../src/painted/kit/ycam';

// EDU-EP30-SHORT ticket T11 r3: GUNNER-1 `new: seated-gunner` reach, arm bones, jolt and lead height in the four views on the ticket's proof cameras.
const dry = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const BY = Object.fromEntries(GUNNER_PROOFS.map((d) => [d.id, d]));
const at = (id: string, L: number) => ({d: BY[id], ...gunnerProofAt(BY[id], L)});
const opts = (id: string, L: number) => { const x = at(id, L); return {x, o: {view: x.d.view, grip: x.a.grip, stock: x.a.stock, jolt: x.jolt, t: 1.2, seed: 33200}}; };

test('reach: each wrist target within 0.52 m of its world shoulder after the lean (j 0); at the jolt peak (j 1) within 1.05 x 2 bones', () => {
  for (const id of Object.keys(BY)) for (const L of [0, 1]) {
    const {d, a, jolt} = at(id, L), r = gunnerReach(GUNNER1, d.seat, a.grip, a.stock, jolt);
    console.log(`reach ${id} j${jolt}: r ${r.r.toFixed(3)} l ${r.l.toFixed(3)}`);
    const lim = jolt ? GUNNER_REACH * 1.05 : GUNNER_REACH;
    assert.ok(r.r <= lim && r.l <= lim, `${id} j${jolt}: ${r.r.toFixed(3)} / ${r.l.toFixed(3)}`);
  }
});

test('arm ratio: longest drawn bone <= 1.05 x the 0.26 m bone at j 0 and j 1, all four views', () => {
  for (const id of Object.keys(BY)) for (const L of [0, 1]) {
    const {x, o} = opts(id, L), k = gunnerCheck(x.d.cam, GUNNER1, x.d.seat, o);
    assert.ok(k, id);
    console.log(`arm ratio ${id} j${x.jolt}: r ${k.rRatio.toFixed(3)} l ${k.lRatio.toFixed(3)}`);
    assert.ok(k.rRatio <= 1.05 && k.lRatio <= 1.05, `${id} j${x.jolt}`);
    // hand-drawing section 1: the right arm is screen left facing the lens (front, 3/4), screen right from behind
    if (x.d.view !== 'right') assert.equal(k.rShoulder[0] < k.lShoulder[0], x.d.view !== 'back', `${id}: right shoulder side`);
  }
});

test('jolt: world shoulders move 0.015 m along -barrel at j 1, half at j 0.5; drawn shift in the profile view is 0.012-0.018 m', () => {
  const {x} = opts('C30-gunner-right', 0), {d, a} = x;
  const w = (j: number) => gunnerShoulders(GUNNER1, d.seat, a.grip, a.stock, j);
  assert.ok(Math.abs(w(0).r[0] - w(1).r[0] - GUNNER_JOLT) < 1e-9 && Math.abs(w(0).r[0] - w(0.5).r[0] - GUNNER_JOLT / 2) < 1e-9);
  const k = (j: number) => gunnerCheck(d.cam, GUNNER1, d.seat, {view: 'right', grip: a.grip, stock: a.stock, jolt: j, t: 1.2, seed: 33200})!;
  const shift = (k(0).shoulder[0] - k(1).shoulder[0]) / camUnit(d.cam, d.seat);
  console.log(`profile shoulder shift at j 1: ${shift.toFixed(4)} m`);
  assert.ok(shift >= 0.012 && shift <= 0.018, `shift ${shift}`);
  const b = opts('C30-gunner-back', 0), cb = (j: number) => gunnerCheck(b.x.d.cam, GUNNER1, b.x.d.seat, {...b.o, jolt: j})!;
  console.log(`back view shoulder px at j0 ${cb(0).shoulder[0].toFixed(2)} j1 ${cb(1).shoulder[0].toFixed(2)} (scale ${camUnit(b.x.d.cam, b.x.d.seat).toFixed(0)} px/m)`);
});

// the lead is read to the visible top of the figure, the slouch hat crown, 0.1 - 0.14 x 0.86 = -0.0204 U above the head top anchor (`paintHat`)
const HAT_ABOVE_HEAD = 0.0204;
test('lead height (hat top): front at the LF01 camera within 5 % of the legacy (LF01a) drawing, 3/4 at the B04-SH06 start 593 +- 30 px', () => {
  const lead = (id: string, grip: boolean) => {
    const {x, o} = opts(id, 0), r = paintSeatedGunner(dry(), x.d.cam, GUNNER1, x.d.seat, grip ? o : {view: o.view, t: 1.2, seed: 33200});
    return r!.bottom - r!.top + HAT_ABOVE_HEAD * camUnit(x.d.cam, x.d.seat);
  };
  const old = lead('C30-gunner-front', false), now = lead('C30-gunner-front', true), q = lead('C30-gunner-34', true);
  console.log(`lead front legacy ${old.toFixed(1)} new ${now.toFixed(1)}; 3/4 ${q.toFixed(1)}`);
  assert.ok(Math.abs(now / old - 1) <= 0.05, `front ${now} vs ${old}`);
  assert.ok(Math.abs(q - 593) <= 30, `3/4 ${q}`);
});

// ---- T12 r5 row G0: the stroke lists of the four gunner proof views (recorded painter, j 0 and j 1). Front, back and right are the pre-G0 lists; the 3/4 view
// now repaints its fists over the gun (`man(); gun(); fists()`), baseline 8c1a7bda3a0f / 105bd70aef30.
const hashOf = (id: string, L: number) => {
  const log: string[] = [], brush = new Proxy({}, {get: (_, k) => (...a: unknown[]) => { log.push(String(k) + JSON.stringify(a)); }}) as Brush;
  gunnerProof(BY[id]).paint(makePainter(brush, {t: 0, frame: 0}), L, BY[id].cam);
  return createHash('sha1').update(log.join('\n')).digest('hex').slice(0, 12);
};
test('G0: front, back and right stroke hashes unchanged; the 3/4 view changed (fists over the gun)', () => {
  const want: Record<string, string[]> = {'C30-gunner-front': ['ece08c32feb6', '49d43cfbb97a'], 'C30-gunner-back': ['480ed2012f79', 'f8c43e8db24b'], 'C30-gunner-right': ['02e699a0d326', '3b773b588193']};
  for (const [id, h] of Object.entries(want)) assert.deepEqual([hashOf(id, 0), hashOf(id, 1)], h, id);
  const q = [hashOf('C30-gunner-34', 0), hashOf('C30-gunner-34', 1)];
  console.log(`G0 3/4 hashes ${q.join(' ')} (baseline 8c1a7bda3a0f 105bd70aef30)`);
  assert.deepEqual(q, ['263fbaa585ac', '0eb5abad8b31']);
});

// ---- T12: salute (A), P44 back (D), loader (F), farmer (G)
const SIDE = (v: Pt) => `${v[1] < 0 ? 'upper' : 'lower'}-${v[0] < 0 ? 'left' : 'right'}`;
/** Screen side of the thumb crease (y down): +1 = clockwise of wrist -> fingers (screen: rotate (dx, dy) to (-dy, dx)), -1 = counter-clockwise. */
const thumbSide = (from: Pt, to: Pt, s: 1 | -1): string => { const dx = to[0] - from[0], dy = to[1] - from[1]; return SIDE([-dy * s, dx * s]); };
type Case = {name: string; pose: 'salute' | 'p44-back' | 'loader' | 'farmer'; cam: typeof CAM_SALUTE; def: typeof MEREDITH; at: [number, number, number]; N: number};
const CASES: Case[] = [
  {name: 'salute', pose: 'salute', cam: CAM_SALUTE, def: MEREDITH, at: AT.meredith, N: 29},
  {name: 'farmer', pose: 'farmer', cam: CAM_FARMER, def: FARMER, at: AT.farmer, N: 61},
  {name: 'p44back', pose: 'p44-back', cam: CAM_P44, def: MEREDITH, at: AT.p44, N: 1},
  {name: 'p44back-full', pose: 'p44-back', cam: CAM_P44_FULL, def: MEREDITH, at: AT.p44, N: 1},
  {name: 'loader', pose: 'loader', cam: CAM_LOADER, def: GUNNER2, at: LOADER_AT, N: 47},
];
const sv = (k: Case, L: number) => solveCrewPose(k.cam, k.def, k.at, {pose: k.pose, L, seed: 1, pan: loaderPan()})!;
const dryP = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});

test('T12 arm ratio: longest drawn bone <= 1.05 x the 0.26 m bone on every frame of A, D, F, G', () => {
  for (const k of CASES) {
    let m = 0;
    for (let L = 0; L < k.N; L++) { const s = sv(k, L); m = Math.max(m, s.rRatio, s.lRatio); assert.ok(s.rRatio <= 1.05 && s.lRatio <= 1.05, `${k.name} L${L}: ${s.rRatio} / ${s.lRatio}`); }
    console.log(`arm check: ${k.name}: max ratio ${m.toFixed(3)} over L 0..${k.N - 1}: attached ok`);
  }
});

test('T12 purity: a frame solved alone equals the same frame after others', () => {
  for (const k of CASES) { const a = JSON.stringify(sv(k, k.N - 1)); for (let L = 0; L < k.N; L++) sv(k, L); assert.equal(JSON.stringify(sv(k, k.N - 1)), a, k.name); }
});

test('T12 A: salute right arm is screen left; at L 8 the palm-forward right hand sits at the brim and its thumb is screen lower-right; P01 at L 0 and L 28', () => {
  const k = CASES[0], s = sv(k, 8), E = s.rTo!, via = (s.fig.rArm as {via: Pt}).via;
  assert.ok(s.shoulders.r[0] < s.shoulders.l[0], 'right shoulder screen left (front)');
  assert.equal(s.lTo, null);
  const side = thumbSide(via, E, mittenThumbSide('right', 'palm'));
  console.log(`thumb check: MEREDITH RIGHT: screen ${side} ok (oval kit mitten, palm forward; the unshaped hand draws no thumb, so the side is the rule's, hand-drawing section 2)`);
  assert.equal(side, 'lower-right');
  assert.equal(sv(k, 0).rTo, null);
  assert.equal(sv(k, 28).rTo, null);
  const u = camUnit(CAM_SALUTE, AT.meredith), head = paintCrewPose(dryP(), CAM_SALUTE, MEREDITH, AT.meredith, {pose: 'salute', L: 15, seed: 1})!, hand = sv(k, 15).rTo!;
  assert.ok(hand[0] < head.head[0] && Math.abs(hand[1] - (head.headTop + 0.13 * u)) < 0.05 * u, 'wrist at the brim row, screen left of the head');
});

test('T12 D: P44 back, crossed wrists at the sacrum (0.95 m), thumbs and elbows measured', () => {
  for (const k of [CASES[2], CASES[3]]) {
    const s = sv(k, 0), g = camPoint(k.cam, k.at)!, u = camUnit(k.cam, k.at), over = s.over!;
    assert.ok(s.shoulders.r[0] > s.shoulders.l[0], 'back view: right shoulder screen right');
    assert.ok(Math.abs((g[1] - s.rTo![1]) / u - 0.95) < 0.01, 'right wrist at 0.95 m');
    const tr = thumbSide(over.r[1], over.r[2], mittenThumbSide('right', 'back')), tl = thumbSide(over.l[1], over.l[2], mittenThumbSide('left', 'back'));
    console.log(`${k.name}: thumb check: MEREDITH RIGHT: screen ${tr} ok (flat fist, back); LEFT: oval mitten over the right wrist (rule side ${tl}); elbow flexion ${s.rFlex.toFixed(0)} / ${s.lFlex.toFixed(0)} deg; ratio ${s.rRatio.toFixed(3)} / ${s.lRatio.toFixed(3)}`);
    assert.ok(s.rFlex > 40 && s.lFlex > 40);
  }
});

test('T12 F: loader reaches the pan rim (3D) within 0.52 m lifted and seated; hands stay on it to L 40; thighs by L 46', () => {
  const pan = loaderPan(), c = CAM_LOADER, u = camUnit(c, LOADER_AT), dz = Math.abs(LOADER_AT[2] - pan[2]);
  for (const L of [0, 10, 20, 25, 30, 35, 40]) {
    const s = sv(CASES[4], L), lift = L <= 20 ? 0.1 : L >= 30 ? 0 : 0.1 * (1 - ((L - 20) / 10) ** 2);
    const rims = [1, -1].map((q) => camPoint(c, [pan[0] + q * PAN_RIM, pan[1] + lift, pan[2]])!).sort((a, b) => a[0] - b[0]);
    const r3 = (S: Pt, T: Pt) => Math.hypot(Math.hypot(S[0] - T[0], S[1] - T[1]) / u, dz), reach = [r3(s.shoulders.r, rims[0]), r3(s.shoulders.l, rims[1])];
    const hand = [Math.hypot(s.rTo![0] - rims[0][0], s.rTo![1] - rims[0][1]), Math.hypot(s.lTo![0] - rims[1][0], s.lTo![1] - rims[1][1])].map((d) => d / u);
    if (L === 0 || L === 30) console.log(`loader L${L}: 3D reach r ${reach[0].toFixed(3)} l ${reach[1].toFixed(3)} m; hands-to-pan ${hand[0].toFixed(4)} / ${hand[1].toFixed(4)} m; lean ${(s.lean * 180 / Math.PI).toFixed(1)} deg`);
    assert.ok(reach[0] <= CREW_REACH_3D && reach[1] <= CREW_REACH_3D, `L${L}: ${reach}`);
    assert.ok(hand[0] <= 0.02 && hand[1] <= 0.02, `L${L}: hands ${hand}`);
  }
  assert.ok(Math.abs(sv(CASES[4], 30).lean - LOADER_LEAN) < 1e-9);
  assert.ok(sv(CASES[4], 46).rTo === null && sv(CASES[4], 46).lean === 0, 'back on P34 thighs by L 46');
  const s30 = sv(CASES[4], 30);
  console.log(`thumb check: GUNNER-2 RIGHT: screen ${thumbSide(s30.shoulders.r, s30.rTo!, mittenThumbSide('right', 'back'))} (flat fist, back); LEFT: screen ${thumbSide(s30.shoulders.l, s30.lTo!, mittenThumbSide('left', 'back'))}`);
});

test('T12 G: farmer arm key frames, gaze, lean, talk windows and lead height', () => {
  const k = CASES[1], s = (L: number) => sv(k, L);
  assert.equal(s(3).rFlex, 0);
  assert.ok(Math.abs(s(9).rFlex - 70) < 0.5 && Math.abs(s(45).rFlex - 70) < 0.5, 'elbow bent 70 deg at the hold');
  assert.ok(s(9).rTo![1] < s(9).shoulders.r[1], 'mitten above the shoulder');
  assert.deepEqual([s(0).lean, s(46).lean, s(53).lean], [-0.06, -0.06, 0]);
  const look = (L: number) => solveCrewPose(k.cam, FARMER, AT.farmer, {pose: 'farmer', L, seed: 1})!.faceState!.look!;
  assert.deepEqual([look(0), look(46), look(53)], [[-0.8, 0], [-0.8, 0], [0, 0]]);
  const talk = Array.from({length: 76}, (_, L) => farmerTalk(L));
  assert.ok(talk[2] === null && talk[3] !== null && talk[38] !== null && talk[39] === null && talk[46] === null && talk[47] !== null && talk[75] !== null);
  assert.ok(Math.abs(Math.max(...talk.map((x) => x ?? 0)) - 0.7) < 0.01 && farmerTalk(6) === 0 && Math.abs(farmerTalk(9)! - 0.7) < 1e-9);
  const a = paintCrewPose(dryP(), k.cam, FARMER, k.at, {pose: 'farmer', L: 9, seed: 1})!, lead = a.bottom - a.top;
  console.log(`farmer lead (visible top to feet) ${lead.toFixed(1)} px at the start camera (sheet 604); thumb: oval pointing hand, edge to the lens, none drawn`);
  assert.ok(lead >= 480, `lead ${lead}`);
});
