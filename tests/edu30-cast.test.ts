import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {createHash} from 'node:crypto';
import {CREW_REACH_3D, FARMER, GUNNER1, GUNNER2, GUNNER_JOLT, GUNNER_REACH, LOADER_AT, LOADER_LEAN, MEREDITH, PAN_RIM, farmerTalk, gunnerCheck, gunnerReach, gunnerShoulders, paintCrewPose, paintSeatedGunner, solveCrewPose} from '../src/painted/edu30/cast';
import {AT, CAM_FARMER, CAM_LOADER, CAM_P44, CAM_P44_FULL, CAM_SALUTE, CREW_PROOFS, GUNNER_PROOFS, gunnerProof, gunnerProofAt, loaderPan} from '../src/painted/edu30/proof-cast';
import {rackShake, rackTalk, solveGunner as solveG17} from '../src/painted/edu30/cast';
import {RACK, rackAt, rackCam} from '../src/painted/edu30/proof-cast';
import {lewisAnchors as lewisAnchors17} from '../src/painted/edu30/props';
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

/** Pixel samples inside the oval `h` (centre, forearm angle, radii) that also satisfy `inside`. */
const ovalPx = (h: {c: Pt; ang: number; rx: number; ry: number}, inside: (x: number, y: number) => boolean) => {
  let n = 0;
  for (let y = Math.floor(h.c[1] - h.rx - 2); y <= h.c[1] + h.rx + 2; y++) for (let x = Math.floor(h.c[0] - h.rx - 2); x <= h.c[0] + h.rx + 2; x++) {
    const dx = x - h.c[0], dy = y - h.c[1], a = dx * Math.cos(h.ang) + dy * Math.sin(h.ang), b = -dx * Math.sin(h.ang) + dy * Math.cos(h.ang);
    if ((a / h.rx) ** 2 + (b / h.ry) ** 2 <= 1 && inside(x, y)) n++;
  }
  return n;
};
test('T12 A2 (r6): salute right arm is screen left; at the hold the mitten centre is at the brim front edge 0.30 head widths to his right, over the brim and the forehead; the elbow is raised (lowest reachable)', () => {
  const k = CASES[0], u = camUnit(CAM_SALUTE, AT.meredith);
  assert.equal(sv(k, 0).rTo, null);
  assert.equal(sv(k, 28).rTo, null);
  assert.equal(sv(k, 0).hand, undefined);
  for (const L of [8, 15, 22]) {
    const s = sv(k, L), h = s.hand!, [S, E] = h.chain!, a = paintCrewPose(dryP(), CAM_SALUTE, MEREDITH, AT.meredith, {pose: 'salute', L, seed: 1})!;
    assert.ok(s.shoulders.r[0] < s.shoulders.l[0], 'right shoulder screen left (front)');
    assert.equal(s.lTo, null);
    const hw = 0.88 * (a.chin - a.headTop), yB = a.headTop + 0.1 * u, r = 0.23 * u, hx = a.head[0];
    const widths = (hx - h.c[0]) / hw, elbowDy = (S[1] - E[1]) / u;   // + = elbow above the shoulder
    const brim = ovalPx(h, (x, y) => y >= yB && ((x - hx) / r) ** 2 + ((y - yB) / (0.028 * u)) ** 2 <= 1);
    const browY = a.head[1] - 0.24 * ((a.chin - a.headTop) / 2.27), fore = ovalPx(h, (x, y) => y > yB + 0.028 * u && y < browY && x < hx && x > hx - 0.5 * hw);
    console.log(`A2 salute L${L}: mitten centre ${widths.toFixed(3)} head widths right of the face line (head width ${hw.toFixed(1)} px); centre y ${((h.c[1] - yB) / u).toFixed(3)} m below the brim row; elbow y - shoulder y ${(-elbowDy).toFixed(3)} m (- = above; row limit +-0.06 is out of reach: the brim is ${((S[1] - h.chain![2][1]) / u).toFixed(2)} m above the shoulder, the forearm reaches ${(1.05 * 0.26).toFixed(2)} m; built to the lowest elbow, limit 0.15 above); brim overlap ${brim} px, forehead overlap ${fore} px; arm ratio ${s.rRatio.toFixed(3)}`);
    console.log(`thumb check: MEREDITH RIGHT: open oval, no thumb drawn (unshaped kit); palm forward, fingers screen up-right (forearm ${(h.ang * 180 / Math.PI).toFixed(0)} deg)`);
    if (L >= 8) {
      assert.ok(Math.abs(widths - 0.3) < 0.005, `centre ${widths}`);
      assert.ok(elbowDy >= 0 && elbowDy <= 0.15, `elbow ${elbowDy}`);
      assert.ok(brim > 0 && fore > 0, `overlap brim ${brim} forehead ${fore}`);
      assert.ok(s.rRatio <= 1.05);
    }
  }
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

test('T12 G2 (r6): farmer point: the line from the shoulder through the mitten centre passes within 60 px of the emu head; mitten clear of head and hat by 40 px; talk, gaze, lean unchanged', () => {
  const k = CASES[1], s = (L: number) => sv(k, L), c = CAM_FARMER, emu = camPoint(c, [-3.6, 1.0, 3.0])!;
  assert.equal(s(3).rFlex, 0);
  assert.equal(s(0).hand, undefined);
  for (const L of [9, 45]) {
    const x = s(L), h = x.hand!, S = x.shoulders.r, a = paintCrewPose(dryP(), c, FARMER, AT.farmer, {pose: 'farmer', L, seed: 1})!, u = camUnit(c, AT.farmer);
    const dx = h.c[0] - S[0], dy = h.c[1] - S[1], len = Math.hypot(dx, dy), dist = Math.abs((emu[0] - S[0]) * dy - (emu[1] - S[1]) * dx) / len, ahead = ((emu[0] - S[0]) * dx + (emu[1] - S[1]) * dy) / len;
    const hh = a.chin - a.headTop, hw = 0.88 * hh, yB = a.headTop + 0.1 * u, rb = 0.25 * u;
    const boxes = [[a.head[0] - rb, yB - 0.15 * u, a.head[0] + rb, yB + 0.03 * u], [a.head[0] - hw / 2, a.headTop, a.head[0] + hw / 2, a.chin]];
    const m = [h.c[0] - h.rx, h.c[1] - h.rx, h.c[0] + h.rx, h.c[1] + h.rx], gap = Math.min(...boxes.map((b) => Math.hypot(Math.max(b[0] - m[2], m[0] - b[2], 0), Math.max(b[1] - m[3], m[1] - b[3], 0))));
    console.log(`G2 farmer L${L}: emu head px (${emu[0].toFixed(0)}, ${emu[1].toFixed(0)}); shoulder (${S[0].toFixed(0)}, ${S[1].toFixed(0)}) mitten (${h.c[0].toFixed(0)}, ${h.c[1].toFixed(0)}); line-to-emu ${dist.toFixed(1)} px (limit 60, ahead ${ahead.toFixed(0)} px); gap to head and hat ${gap.toFixed(1)} px (limit 40); arm ratio ${x.rRatio.toFixed(3)}; 3D reach ${x.g2!.reach.toFixed(3)} m, 3D elbow flexion ${x.g2!.flex3.toFixed(1)} deg, drawn ${x.rFlex.toFixed(1)} deg; d ${x.g2!.d.map((v) => v.toFixed(3)).join(', ')}`);
    assert.ok(dist <= 60 && ahead > 0, `line ${dist}`);
    assert.ok(gap >= 40, `gap ${gap}`);
    assert.ok(x.rRatio <= 1.05);
  }
  console.log('thumb check: FARMER RIGHT: open oval, no thumb drawn (unshaped kit); edge to the lens, fingers screen lower-left');
  assert.deepEqual([s(0).lean, s(46).lean, s(53).lean], [-0.06, -0.06, 0]);
  const look = (L: number) => solveCrewPose(k.cam, FARMER, AT.farmer, {pose: 'farmer', L, seed: 1})!.faceState!.look!;
  assert.deepEqual([look(0), look(46), look(53)], [[-0.8, 0], [-0.8, 0], [0, 0]]);
  const talk = Array.from({length: 76}, (_, L) => farmerTalk(L));
  assert.ok(talk[2] === null && talk[3] !== null && talk[38] !== null && talk[39] === null && talk[46] === null && talk[47] !== null && talk[75] !== null);
  assert.ok(Math.abs(Math.max(...talk.map((x) => x ?? 0)) - 0.7) < 0.01 && farmerTalk(6) === 0 && Math.abs(farmerTalk(9)! - 0.7) < 1e-9);
  const a = paintCrewPose(dryP(), k.cam, FARMER, k.at, {pose: 'farmer', L: 9, seed: 1})!, lead = a.bottom - a.top;
  console.log(`farmer lead (visible top to feet) ${lead.toFixed(1)} px at the start camera (sheet 604)`);
  assert.ok(lead >= 480, `lead ${lead}`);
});

// r6: only the salute hold and the farmer rise/hold/lower change; every other T12 stroke list (recorded painter) is the r5 one.
test('T12 r6: stroke hashes of the unchanged poses (salute L 0 and 28, kit, P44 back x2, loader, farmer L 0 and 60) equal r5', () => {
  const want: Record<string, Record<number, string>> = {
    'C30-crew-salute': {0: '955499eec8cc', 28: '955499eec8cc'}, 'C30-crew-kit': {0: '52be5f62c0d9'}, 'C30-crew-p44back': {0: 'e2c643d40f56'}, 'C30-crew-p44back-full': {0: 'eb83acf1e4cf'},
    'C30-crew-loader': {0: '16ea4b4382e4', 25: '4b47c9077c23', 28: '2cfaa618c384', 30: 'ff29f9f394f9', 45: 'a9b593eb9fa5', 46: '14b5a0c9778f'}, 'C30-crew-farmer': {0: 'e8ee1df53ce1', 60: '5bad13134d9f'}};
  for (const d of CREW_PROOFS) for (const [L, h] of Object.entries(want[d.id] ?? {})) {
    const log: string[] = [], brush = new Proxy({}, {get: (_, k) => (...a: unknown[]) => { log.push(String(k) + JSON.stringify(a)); }}) as Brush;
    d.paint(makePainter(brush, {t: 0, frame: 0}), Number(L), d.cam(0));
    assert.equal(createHash('sha1').update(log.join('\n')).digest('hex').slice(0, 12), h, `${d.id} L${L}`);
  }
});

// T17: GUNNER-1 cocking pull and angry talking face at B04-SH06 (local 0-23)
const rackSolve = (L: number) => { const c = rackCam(L), {opts} = rackAt(L), s = solveG17(c, GUNNER1, RACK.seat, opts as never)!; return {c, opts, s}; };
const cockW = (k: number) => lewisAnchors17(RACK.gun, RACK.heading, {cock: k}).cock;
test('T17 rack: right wrist on cock at L 0, 3, 6 (+-0.01 m) and on the grip from L 8; left wrist on the stock every frame', () => {
  const want: Record<number, number> = {0: 0, 3: 1, 6: 0};
  for (let L = 0; L <= 23; L++) {
    const {c, s} = rackSolve(L), a = rackAt(L).a, u = camUnit(c, RACK.seat), r = s.fig.rArm!.to as Pt, l = s.fig.lArm!.to as Pt, sk = camPoint(c, a.stock)!;
    assert.ok(Math.hypot(l[0] - sk[0], l[1] - sk[1]) / u <= 0.001, `left L${L}`);
    const tgt = L in want ? camPoint(c, cockW(want[L])) : L >= 8 ? camPoint(c, a.grip) : null;
    if (L === 0 || L === 23) { const q = camPoint(c, cockW(0))!; console.log(`T17 L${L}: knob at cock 0 projects to (${q[0].toFixed(0)}, ${q[1].toFixed(0)})`); }
    if (tgt) { const e = Math.hypot(r[0] - tgt[0], r[1] - tgt[1]) / u; console.log(`T17 L${L}: right wrist ${e.toFixed(4)} m from ${L >= 8 ? 'grip' : 'cock'}`); assert.ok(e <= 0.01, `right L${L} ${e}`); }
  }
});
test('T17 rack: arm ratio <= 1.05 on every frame L 0-23; purity (frame alone = frame after others)', () => {
  let worst = 0;
  for (let L = 0; L <= 23; L++) { const k = rackSolve(L).s.check; worst = Math.max(worst, k.rRatio, k.lRatio); if (L <= 8) console.log(`T17 L${L}: arm check: GUNNER-1 r/l: attached ok; ratio r ${k.rRatio.toFixed(3)} l ${k.lRatio.toFixed(3)}; turn ${(k.turn * 180 / Math.PI).toFixed(2)} deg`); assert.ok(k.rRatio <= 1.05 && k.lRatio <= 1.05, `ratio L${L}`); }
  console.log(`T17 worst ratio ${worst.toFixed(3)}`);
  const a = JSON.stringify(rackSolve(5).s.fig); rackSolve(2); rackSolve(7); assert.equal(JSON.stringify(rackSolve(5).s.fig), a);
});
test('T17 rack: right fist thumb on the screen-right (handle), elbow low, face keys, lead and face height', () => {
  for (const L of [0, 3, 6, 8]) {
    const {c, s} = rackSolve(L), r = s.fig.rArm!, S = s.check.rShoulder, W = r.to as Pt, E = r.via as Pt;
    const side = mittenThumbSide('right', 'back'), dx = W[0] - E[0], dy = W[1] - E[1], tv: Pt = [-dy * side, dx * side];
    const tr = Math.abs(tv[0]) >= Math.abs(tv[1]) ? (tv[0] > 0 ? 'right' : 'left') : (tv[1] > 0 ? 'down' : 'up');
    console.log(`T17 L${L}: thumb check: GUNNER-1 RIGHT: screen ${tr}; elbow ${((E[1] - S[1]) / camUnit(c, RACK.seat)).toFixed(3)} m below shoulder, ${((E[0] - S[0]) / camUnit(c, RACK.seat)).toFixed(3)} m screen x`);
  }
  assert.deepEqual(rackShake(12), [0, 0]); assert.ok(Math.abs(rackShake(14)[0] - 0.1) < 1e-9 && Math.abs(rackShake(17)[0] + 0.1) < 1e-9); assert.deepEqual(rackShake(20), [0, 0]);
  assert.equal(rackTalk(6), null); assert.equal(rackTalk(7), 0); assert.ok(Math.abs(rackTalk(10)! - 0.7) < 1e-9); assert.equal(rackTalk(18), 0); assert.equal(rackTalk(24), null);
  for (const L of [0, 23]) {
    const {c, opts} = rackSolve(L), r = paintSeatedGunner(dry(), c, GUNNER1, RACK.seat, opts)!, lead = r.bottom - r.top + HAT_ABOVE_HEAD * camUnit(c, RACK.seat);
    console.log(`T17 L${L}: lead ${lead.toFixed(1)} px, head ${r.head[0].toFixed(0)}, ${r.head[1].toFixed(0)}, chin ${r.chin.toFixed(0)}`);
    assert.ok(lead >= 570 && lead <= 640 && r.chin < 1100, `lead L${L} ${lead}`);
  }
});

// ---- T18: MEREDITH `new: order-chop` (B03-SH05, local 0-20) and R9-1 `loaderLean`
import {CHOP_LOOK, chopTalk, chopU} from '../src/painted/edu30/cast';
import {CHOP, chopCam} from '../src/painted/edu30/proof-cast';
const chopAt = (L: number) => { const c = chopCam(L), s = solveCrewPose(c, MEREDITH, CHOP.at, {pose: 'chop', L, seed: 1})!; return {c, s, a: paintCrewPose(dryP(), c, MEREDITH, CHOP.at, {pose: 'chop', L, seed: 1})!}; };

test('T18: arm ratio <= 1.05 and right wrist reach <= 0.52 m at every frame L 0-20; the arm is one attached chain through the chop', () => {
  let worst = 0, reach = 0;
  for (let L = 0; L < CHOP.N; L++) {
    const {c, s} = chopAt(L), u = camUnit(c, CHOP.at), [S, E, W] = s.hand!.chain!, wr = Math.hypot(W[0] - S[0], W[1] - S[1]) / u;
    worst = Math.max(worst, s.rRatio); reach = Math.max(reach, wr);
    assert.ok(s.rRatio <= 1.05, `ratio L${L} ${s.rRatio}`);
    assert.ok(wr <= 0.52 + 1e-9, `reach L${L} ${wr}`);
    assert.deepEqual(S, s.shoulders.r); assert.deepEqual(W, s.rTo);
    const att = Math.hypot(s.hand!.c[0] - W[0], s.hand!.c[1] - W[1]) / u;   // the mitten centre is 0.03-0.04 m beyond the wrist
    assert.ok(att <= 0.041 && Math.hypot(E[0] - S[0], E[1] - S[1]) > 0, `attached L${L}`);
  }
  console.log(`arm check: MEREDITH r: attached ok; max arm ratio ${worst.toFixed(3)}; max wrist reach ${reach.toFixed(3)} m`);
});

test('T18: start key (L 0-4 hold) and end key (L 7-20 hold): mitten centre, thumb side, ease-in chop, straight point', () => {
  const m = (L: number) => chopAt(L).s.hand!.c, near = (p: Pt, q: Pt) => Math.abs(p[0] - q[0]) <= 40 && Math.abs(p[1] - q[1]) <= 40;
  const p0 = m(0), p7 = m(7);
  console.log(`T18 mitten L0 (${p0[0].toFixed(0)}, ${p0[1].toFixed(0)}) guide (470, 591); L7 (${p7[0].toFixed(0)}, ${p7[1].toFixed(0)}) guide (250, 712)`);
  assert.ok(near(p0, [470, 591]) && near(p7, [250, 712]));
  assert.deepEqual([chopU(0), chopU(4), chopU(7), chopU(20)], [0, 0, 1, 1]);
  assert.ok(chopU(5) < chopU(6) && chopU(6) - chopU(5) < chopU(7) - chopU(6), 'ease-in: fastest at the end');
  assert.ok(chopAt(0).s.rFlex > 10 && chopAt(7).s.rFlex < 12, `elbow straightens: ${chopAt(0).s.rFlex.toFixed(1)} -> ${chopAt(7).s.rFlex.toFixed(1)} deg`);
  // thumb: screen direction of the nub = +1 x (-dy, dx) of the forearm direction
  const side = (L: number): Pt => { const h = chopAt(L).s.hand!; return [-Math.sin(h.ang) * h.thumb!, Math.cos(h.ang) * h.thumb!]; };
  const t0 = side(0), t7 = side(7);
  console.log(`thumb check: MEREDITH RIGHT: screen ${t0[0] > 0 ? 'right' : 'left'} ok (L 0, palm to the lens); screen ${t7[1] < 0 ? 'top' : 'bottom'} ok (L 7, edge, thumb up)`);
  assert.ok(t0[0] > 0.8 && t7[1] < -0.6);
  assert.ok(chopAt(0).s.shoulders.r[0] < chopAt(0).s.shoulders.l[0], 'right shoulder is screen left');
  assert.ok(Math.abs(chopAt(7).s.lean - -0.04) < 1e-9 && chopAt(0).s.lean === 0 && chopAt(20).s.lean === -0.04 && chopAt(7).s.fig.lArm === undefined);
});

test('T18: lead height at L 7 (sheet range 654-696 px; the decided staging and camera give ~737, see the ticket Result); the face is neutral, eyes down the line of the point, mouth schedule local 6-16', () => {
  for (const L of [0, 7, 20]) {
    const {c, a} = chopAt(L), lead = a.bottom - a.top + HAT_ABOVE_HEAD * camUnit(c, CHOP.at);
    console.log(`T18 lead L${L} ${lead.toFixed(1)} px`);
    if (L === 7) assert.ok(lead >= 654 && lead <= 745, `lead ${lead}`);
  }
  const f = (L: number) => chopAt(L).s;
  assert.equal(f(7).face, 'neutral');
  assert.deepEqual(f(7).faceState!.look, CHOP_LOOK); assert.ok(CHOP_LOOK[0] < 0, 'gaze screen left, never to the lens');
  assert.equal(f(5).faceState!.mouth, undefined);
  const open = Array.from({length: 21}, (_, L) => chopTalk(L));
  assert.deepEqual(open, [...Array(6).fill(null), 0.3, 0.8, 0.8, 0.8, 0.8, 0.8, 0.5, 0.5, 0.5, 0.2, ...Array(5).fill(0)]);
  assert.deepEqual([f(6).faceState!.mouth, f(6).faceState!.open, f(16).faceState!.open, f(20).faceState!.open], ['talk', 0.3, 0, 0]);
});

test('T18 R9-1: loaderLean 0 gives lean 0 at L 0; default and 1 keep the lean', () => {
  const k = CASES[4], s = (o: object) => solveCrewPose(k.cam, k.def, k.at, {pose: 'loader', L: 0, seed: 1, pan: loaderPan(), ...o})!;
  assert.equal(s({loaderLean: 0}).lean, 0);
  assert.equal(s({}).lean, LOADER_LEAN); assert.equal(s({loaderLean: 1}).lean, LOADER_LEAN);
  assert.ok(Math.abs(s({loaderLean: 0.5}).lean - LOADER_LEAN / 2) < 1e-12);
});
