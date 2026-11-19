import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import type {Painter} from '../src/painted/kit/painter';
import type {V3} from '../src/painted/kit/space';
import {camPoint} from '../src/painted/kit/ycam';
import {camLine} from '../src/painted/edu30/shot';
import * as pad from '../src/painted/edu30/paddock';

// EDU-EP30-SHORT ticket T09 r1: paddock states (light mix, stubble, eaten ridges, blast lean, ruts, high view, fence from the track).

/** A painter that records every call (a null painter with a log), so a stroke list can be compared. */
const recorder = () => {
  const log: string[] = [];
  const rec = (name: string) => (...a: unknown[]) => { log.push(name + JSON.stringify(a)); };
  const brush = new Proxy({}, {get: (_, k) => rec('brush.' + String(k))});
  const p = {brush, t: 0, frame: 0, alpha: 1, wash: rec('wash'), flat: rec('flat'), ink: rec('ink'), inkStill: rec('inkStill'), group: rec('group')} as unknown as Painter;
  return {p, log, hash: () => createHash('sha1').update(log.join('\n')).digest('hex').slice(0, 12), n: () => log.length};
};

const C1 = camLine({eye: [-3.2, 0.95, -3.4], yaw: 134.5, pitch: 6, f: 1450, hy: 640});   // LF01-like low camera
const C2 = camLine({eye: [-20, 1.5, -20], yaw: 0, pitch: 0, f: 900, hy: 800});   // sees the gum at (-22, 0, -38)
const stalks: V3[] = [[0, 0, -2], [1, 0, -2.5], [-1, 0, -3]];

test('light 0 and 1 give the colours and sun of morning and west', () => {
  assert.deepEqual(pad.skyColors(0), pad.skyColors('morning'));
  assert.deepEqual(pad.skyColors(1), pad.skyColors('west'));
  assert.equal(pad.skyColors('west').from, '#b8c2c8');
  assert.equal(pad.skyColors('morning').from, pad.PAD.skyTop);
  assert.notDeepEqual(pad.skyColors(0.5), pad.skyColors(0));
  assert.notDeepEqual(pad.skyColors(0.5), pad.skyColors(1));
  assert.equal(pad.sunOf('west'), pad.SUN.west);
  const norm = (v: V3) => { const n = Math.hypot(...v); return v.map((a) => a / n); };
  for (const [m, name] of [[0, 'morning'], [1, 'west']] as const) pad.sunOf(m).forEach((a, i) => assert.ok(Math.abs(a - norm(pad.SUN[name])[i]) < 1e-9));
  const mid = pad.sunOf(0.5);
  assert.ok(Math.abs(Math.hypot(...mid) - 1) < 1e-9);
  assert.ok(mid[0] < pad.sunOf(0)[0] && mid[0] > pad.sunOf(1)[0]);
  assert.equal(pad.lightM('west'), 1); assert.equal(pad.lightM(2), 1); assert.equal(pad.lightM(-1), 0);
});

test('shadows follow the sun vector: a west post shadow is at least 2.5 x the morning one, cast +x instead of -x', () => {
  const len = (m: number) => { const t = pad.shadowOf(pad.sunOf(m), [0, 1.1, 6]); return Math.hypot(t[0], t[2] - 6); };
  assert.ok(len(1) >= 2.5 * len(0));
  assert.ok(pad.shadowOf(pad.sunOf(1), [0, 1.1, 6])[0] > 0);
  assert.ok(pad.shadowOf(pad.sunOf(0), [0, 1.1, 6])[0] < 0);
  // projected length in the B05-SH03 start camera (the P30-P3 proof frame), logged
  const P3 = camLine({eye: [-1.0, 1.55, 2.4], yaw: 160, pitch: 0, f: 900, hy: 820});
  const px = (m: number) => { const t = pad.shadowOf(pad.sunOf(m), [0, 1.1, 6]), a = camPoint(P3, [0, 0.012, 6]), b = camPoint(P3, t); return Math.hypot(b![0] - a![0], b![1] - a![1]); };
  console.log(`post shadow px at m 0 ${px(0).toFixed(1)}, m 0.5 ${px(0.5).toFixed(1)}, m 1 ${px(1).toFixed(1)}, ratio m1/m0 ${(px(1) / px(0)).toFixed(2)}`);
  assert.ok(px(1) >= 2.5 * px(0));
});

test('defaults reproduce the locked painter: no new option leaves the stroke list changed', () => {
  // golden hashes recorded from the pre-T09 paddock.ts (3c3d6d3) with this recorder; the ground changes only by the ruts (ticket value)
  const GOLD: Record<string, string> = {ridges: '6b9bb3f70504:621', texture: '6b6d6630bd52:440', stalks: '6e37c3ddb4bc:243', fence: '870ac65a78bb:175', gum: '54522304f1fe:84', camp: '83d4a9adbb52:1026', sky: '81987f74ab69:10'};
  const run = (m: typeof pad) => {
    const out: Record<string, string> = {};
    const go = (k: string, f: (p: Painter) => void) => { const r = recorder(); f(r.p); out[k] = r.hash() + ':' + r.n(); };
    go('ridges', (p) => m.paintWheatRidges(p, C1, 1, {}));
    go('texture', (p) => m.paintWheatTexture(p, C1, 2));
    go('stalks', (p) => m.paintNearStalks(p, C1, 3, stalks));
    go('fence', (p) => m.paintFence(p, C1, 4));
    go('gum', (p) => m.paintGum(p, C2, 5, [-22, 0, -38], 14, 'west'));
    go('camp', (p) => m.paintCamp(p, C1, 6));
    go('sky', (p) => m.paintPadSky(p, C1, 'morning'));
    return out;
  };
  const now = run(pad);
  for (const k of Object.keys(GOLD)) assert.equal(now[k], GOLD[k], k);
  // explicit zero options equal the defaults
  const r1 = recorder(), r2 = recorder();
  pad.paintWheatRidges(r1.p, C1, 1, {}); pad.paintWheatRidges(r2.p, C1, 1, {stubble: 0});
  assert.equal(r1.hash(), r2.hash());
});

test('stubble shortens and thins: fewer strokes, lower tops, straw colour', () => {
  const count = (s: number) => { const r = recorder(); pad.paintNearStalks(r.p, C1, 3, stalks, {stubble: s}); return r.n(); };
  assert.ok(count(1) < count(0));
  const r0 = recorder(), r1 = recorder();
  pad.paintWheatTexture(r0.p, C1, 2, 4, 60, 900, {stubble: 0}); pad.paintWheatTexture(r1.p, C1, 2, 4, 60, 900, {stubble: 1});
  assert.ok(r1.n() < r0.n());
  assert.ok(r1.log.join().includes('#b89a62'));
  const a = recorder(), b = recorder();
  pad.paintWheatRidges(a.p, C1, 1, {stubble: 0}); pad.paintWheatRidges(b.p, C1, 1, {stubble: 1});
  assert.ok(b.n() < a.n());
});

test('blast lean tilts stalks away from the muzzle only where lean is non-zero', () => {
  const base = recorder(), leaned = recorder(), still = recorder();
  pad.paintNearStalks(base.p, C1, 3, stalks);
  pad.paintNearStalks(leaned.p, C1, 3, stalks, {lean: () => 0.5, leanFrom: [0, 0.72, -1.1]});
  pad.paintNearStalks(still.p, C1, 3, stalks, {lean: () => 0, leanFrom: [0, 0.72, -1.1]});
  assert.notEqual(base.hash(), leaned.hash());
  assert.equal(base.hash(), still.hash());
});

test('high view: no ridge rows at any distance, texture and patches instead; low view unchanged', () => {
  const HI = camLine({eye: [0, 22, 12], yaw: 0, pitch: -40, f: 820, hy: 960});
  const flat = camLine({eye: [0, 22, 12], yaw: 0, pitch: -10, f: 820, hy: 960});
  const hi = recorder(), lo = recorder();
  pad.paintWheatRidges(hi.p, HI, 1, {}); pad.paintWheatRidges(lo.p, flat, 1, {});
  assert.notEqual(hi.hash(), lo.hash());
  // value bands of the ground are dropped in the high view
  const gh = recorder(), gl = recorder();
  pad.paintPadGround(gh.p, HI, 1); pad.paintPadGround(gl.p, flat, 1);
  assert.ok(gh.n() < gl.n());
  // patches are world-fixed: moving the camera 1 m keeps a far patch's colour list a subset
  assert.ok(pad.HIGH_NEAR === 30 && pad.HIGH_PITCH < -0.34 && pad.HIGH_PITCH > -0.35);
  // r3: no ridge row at any distance. Ridge faces are hardFill calls (brush.* fills at ridge radii); the high view paints only the patches' wFill
  // and the texture's ink strokes. A high view with the ridge radius range limited to 3 m (r1 = 3) draws the same strokes as the default range.
  const wide = recorder(), narrow = recorder();
  pad.paintWheatRidges(wide.p, HI, 1, {}); pad.paintWheatRidges(narrow.p, HI, 1, {r0: 2.5, r1: 3, rows: 2});
  assert.equal(wide.hash(), narrow.hash());
  // the texture covers the near ground (d0 0): a stroke inside 30 m exists
  assert.ok(wide.n() > 1000);
});

test('ruts: two, at z 8.6 and 10.4, 0.25 m wide, on the track band', () => {
  const r = recorder();
  pad.paintPadGround(r.p, camLine({eye: [-2, 1.5, 14], yaw: 0, pitch: -10, f: 900, hy: 860}), 1);
  const rut = r.log.filter((l) => l.includes('#6a4a32'));
  assert.equal(rut.length, 2);
});

test('fence from the track: verge band z 6.0-7.5 in dry grass with 40 marks, the fence drawn after it', () => {
  const REV = camLine({eye: [-0.2, 1.35, 7.9], yaw: -6.6, pitch: 0, f: 950, hy: 860});
  const r = recorder();
  pad.paintVerge(r.p, REV, 7, {tussocks: 12});
  assert.ok(r.log.some((l) => l.includes('#b59a6a')));
  // top wire (y 1.02) at x -0.5 projects to the sheet's (501, 1033) within 30 px. The sheet's post (1020, 991) is not reproducible: the locked
  // posts stand at multiples of 3 m, so the nearest is x 0 at (753, 987); a post at u 1020 would stand at x 0.6 (question to Film, T09 Result).
  const wire = camPoint(REV, [-0.5, 1.02, 6])!, post = camPoint(REV, [0, 1.1, 6])!;
  console.log(`B05-SH04 start: wire x -0.5 -> (${wire[0].toFixed(0)}, ${wire[1].toFixed(0)}) sheet (501, 1033); post x 0 top -> (${post[0].toFixed(0)}, ${post[1].toFixed(0)}) sheet (1020, 991)`);
  assert.ok(Math.abs(wire[0] - 501) <= 30 && Math.abs(wire[1] - 1033) <= 30);
});

test('fence wire option: weight and colour only on request; wires with a far end behind the lens draw as spans', () => {
  const REV = camLine({eye: [-0.2, 1.35, 7.9], yaw: -6.6, pitch: 0, f: 950, hy: 860});
  const def = recorder(), opt = recorder(), same = recorder();
  pad.paintFence(def.p, C1, 4); pad.paintFence(opt.p, C1, 4, -60, 60, undefined, {wireW: 2.5, wireCol: '#3e3226'}); pad.paintFence(same.p, C1, 4, -60, 60, undefined, {});
  assert.equal(def.hash(), same.hash());
  assert.ok(opt.log.some((l) => l.includes('#3e3226') && l.includes('2.5')));
  assert.ok(!def.log.some((l) => l.includes('#3e3226')));
  // from the track the whole-wire polyline has an end behind the lens: it must still draw (spans), and the top wire shows near x 501
  const r = recorder();
  pad.paintFence(r.p, REV, 4, -60, 60, 1, {wireW: 2.5, wireCol: '#3e3226'});
  assert.ok(r.log.filter((l) => l.includes('#3e3226')).length >= 3);
  const post = camPoint(REV, [0, 1.1, 6])!;
  assert.ok(Math.abs(post[0] - 753) <= 30 && Math.abs(post[1] - 987) <= 30, `post x 0 top (${post[0].toFixed(0)}, ${post[1].toFixed(0)})`);
});

test('paintPaddockScene: bare variant is ground and wheat only; cast and fence order; defaults paint the locked stack', () => {
  const REV = camLine({eye: [-0.2, 1.35, 7.9], yaw: -6.6, pitch: 0, f: 950, hy: 860});
  const bare = recorder(), full = recorder();
  pad.paintPaddockScene(bare.p, C1, {eaten: 0, bare: true}); pad.paintPaddockScene(full.p, C1, {eaten: 0});
  assert.ok(bare.n() < full.n());
  const order = (c: typeof C1) => { const log: string[] = []; const r = recorder(); pad.paintPaddockScene(r.p, c, {}, () => { log.push('cast@' + r.n()); }); return {at: Number(log[0].split('@')[1]), n: r.n()}; };
  assert.ok(order(C1).at < order(C1).n);
  assert.ok(order(REV).at < order(REV).n);
  const a = recorder(), b = recorder();
  pad.paintPaddockScene(a.p, C1, {}); pad.paintPaddockScene(b.p, C1, {stubble: 0});
  assert.notEqual(a.n(), 0);
  assert.equal(a.hash(), b.hash());
});
