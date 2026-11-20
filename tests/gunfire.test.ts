// test-scope: shared (kit gunfire effects, T04)
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  blastLean, blastPuffs, BLAST_CAP, circleAlpha, hazeCap, SMOKE_CAP, flashPolygon, GUNFIRE_GLOW_PEAK, GUNFIRE_PRESETS, paintMuzzleFlash, popFor, roundFrames, roundPhase, shakeAt, smokePuffs,
} from '../src/painted/kit/gunfire';
import type {Painter} from '../src/painted/kit/painter';
import type {YCam} from '../src/painted/kit/ycam';

// EDU-EP30-SHORT ticket T04 r1.
const CAM: YCam = {x: 0, y: 0.9, z: 6, yaw: 0, pitch: 0, f: 1000, hy: 960};
const B03 = roundFrames(2, 23, 3), B04 = roundFrames(10, 11, 3);
const SPEC = {x: 5, y: 7, roll: 0.3, tremor: 2, seed: 77};

/** A painter whose brush records every fill opacity and polygon. */
const recorder = () => {
  const fills: {color: string; opacity: number; wash: boolean}[] = [];
  let pending = {color: '', opacity: 0};
  const brush = new Proxy({}, {get: (_t, name: string) => (...a: unknown[]) => {
    if (name === 'fill') pending = {color: a[0] as string, opacity: a[1] as number};
    if (name === 'wash') fills.push({color: a[0] as string, opacity: a[1] as number, wash: true});
    if (name === 'polygon' && pending.opacity > 0) { fills.push({...pending, wash: false}); pending = {color: '', opacity: 0}; }
  }});
  return {p: {brush, t: 0, frame: 0, alpha: 1} as unknown as Painter, fills};
};

test('roundFrames: B03-SH01 ends at 68 (global 756), B04-SH03 at 40 (global 1033)', () => {
  assert.equal(B03.length, 23); assert.equal(B03[0], 2); assert.equal(B03[22], 68); assert.equal(688 + 68, 756); assert.equal(688 + 2, 690);
  assert.equal(B04.length, 11); assert.equal(B04[0], 10); assert.equal(B04[10], 40); assert.equal(993 + 40, 1033);
  assert.deepEqual(roundFrames(2, 3, 3), [2, 5, 8]);
});

test('roundPhase: n index and k frames since; n -1 before round 1', () => {
  assert.deepEqual(roundPhase(3, B03), {n: 0, k: 1});
  assert.deepEqual(roundPhase(2, B03), {n: 0, k: 0});
  assert.deepEqual(roundPhase(5, B03), {n: 1, k: 0});
  assert.deepEqual(roundPhase(70, B03), {n: 22, k: 2});
  assert.equal(roundPhase(1, B03).n, -1);
});

test('popFor: 0.08 on k0, 0.03 on k1, else 0', () => {
  assert.equal(popFor(2, B03), 0.08); assert.equal(popFor(3, B03), 0.03); assert.equal(popFor(4, B03), 0); assert.equal(popFor(0, B03), 0); assert.equal(popFor(68, B03), 0.08);
});

test('shakeAt: exactly 0 for every L >= stop, deterministic for a seed, different seeds differ', () => {
  const spec = {...GUNFIRE_PRESETS.B04_SH03.shake, seed: 5};
  for (let L = 42; L < 120; L++) assert.deepEqual(shakeAt(L, B04, spec), {dx: 0, dy: 0, rot: 0});
  assert.ok(Object.is(shakeAt(42, B04, spec).dx, 0));
  for (let L = 0; L < 80; L++) assert.deepEqual(shakeAt(L, B03, SPEC), shakeAt(L, B03, SPEC));
  assert.notDeepEqual(shakeAt(20, B03, SPEC), shakeAt(20, B03, {...SPEC, seed: 78}));
  // decays to 0 by local 70 (B03, no stop): 69 is 1 f after the last round plus no tremor; 71 and later zero
  for (let L = 71; L < 90; L++) assert.deepEqual(shakeAt(L, B03, SPEC), {dx: 0, dy: 0, rot: 0});
  assert.deepEqual(shakeAt(0, B03, SPEC), {dx: 0, dy: 0, rot: 0});
});

test('shakeAt: impulse factors 1.0 / 0.5 / 0.2 and tremor bound', () => {
  const s = {x: 5, y: 7, roll: 0.3, tremor: 0, seed: 9}, one = [10];
  const a = shakeAt(10, one, s), b = shakeAt(11, one, s), c = shakeAt(12, one, s), d = shakeAt(13, one, s);
  assert.ok(Math.abs(Math.abs(a.dx) - 5) < 1e-9 && Math.abs(Math.abs(a.dy) - 7) < 1e-9 && Math.abs(Math.abs(a.rot) - 0.3) < 1e-9);
  assert.ok(Math.abs(Math.abs(b.dx) - 2.5) < 1e-9); assert.ok(Math.abs(Math.abs(c.dx) - 1) < 1e-9); assert.deepEqual(d, {dx: 0, dy: 0, rot: 0});
  for (let L = 2; L <= 68; L++) { const t = shakeAt(L, B03, {...SPEC, x: 0, y: 0, roll: 0}); assert.ok(Math.abs(t.dx) <= 2 && Math.abs(t.dy) <= 2); }
});

test('smoke: one puff per round born at the muzzle, radius 0.12 to 0.45 m over 30 f, fade 1 - (L - last)/45', () => {
  const o = {...GUNFIRE_PRESETS.B03_SH01.smoke, seed: 1}, m: [number, number, number] = [0.5, 0.6, 0];
  assert.equal(smokePuffs(m, 1, B03, o).length, 0); assert.equal(smokePuffs(m, 2, B03, o).length, 1); assert.equal(smokePuffs(m, 68, B03, o).length, 23);
  const born = smokePuffs(m, 2, B03, o)[0]; assert.deepEqual(born.at, m); assert.ok(Math.abs(born.r - 0.12) < 1e-9 && Math.abs(born.alpha - 0.35) < 1e-9);
  const aged = smokePuffs(m, 32, B03, o)[0]; assert.ok(Math.abs(aged.r - 0.45) < 1e-9 && Math.abs(aged.alpha - 0.15) < 1e-9);
  assert.ok(Math.abs(aged.at[0] - (0.5 - 0.25)) < 1e-9);
  const L = 75, a = smokePuffs(m, L, B03, o), r = smokePuffs(m, L, B03, o, false);
  a.forEach((q, i) => assert.ok(Math.abs(q.alpha / r[i].alpha - (1 - 7 / 45)) < 1e-9));
  assert.ok(smokePuffs(m, 68 + 45, B03, o).every((q) => q.alpha === 0));
});

test('haze caps: summed live alpha at L 68 <= 0.6 smoke and <= 0.5 blast', () => {
  const m: [number, number, number] = [0.5, 0.6, 0], o = {...GUNFIRE_PRESETS.B03_SH01.smoke, seed: 1};
  const sm = hazeCap(smokePuffs(m, 68, B03, o), SMOKE_CAP), bl = hazeCap(blastPuffs(m, [-1, 0, 0], 68, B03, {ground: 'wheat', seed: 3}), BLAST_CAP);
  assert.ok(sm.reduce((a, q) => a + q.alpha, 0) <= SMOKE_CAP + 1e-9); assert.ok(bl.reduce((a, q) => a + q.alpha, 0) <= BLAST_CAP + 1e-9);
  assert.ok(smokePuffs(m, 68, B03, o).reduce((a, q) => a + q.alpha, 0) > SMOKE_CAP);
});

test('smoke circle alpha: 0.34 gives 0.0797 and five stacked circles give back the puff alpha (T04 r4)', () => {
  assert.ok(Math.abs(circleAlpha(0.34) - 0.0797) < 0.0005);
  for (const a of [0.15, 0.34, 0.6]) assert.ok(Math.abs(1 - Math.pow(1 - circleAlpha(a), 5) - a) < 1e-12);
});

test('blast: puff per round 2.0 m ahead on the ground, radius 0.3 to 1.2 over 40 f; lean 0.44 / 0.17 / eases to 0', () => {
  const m: [number, number, number] = [0.54, 0.58, 0], b = blastPuffs(m, [-1, 0, 0], 2, B03, {ground: 'wheat', seed: 3});
  assert.equal(b.length, 1); assert.ok(Math.abs(b[0].r - 0.3) < 1e-9 && b[0].alpha === 0.2 && b[0].at[1] === 0);
  assert.ok(Math.abs(b[0].at[0] - (0.54 - 2)) <= 0.3 * 0.3 + 1e-9);
  assert.equal(blastPuffs(m, [-1, 0, 0], 42, B03, {ground: 'mud', seed: 3})[0].alpha, 0.15);
  assert.ok(Math.abs(blastPuffs(m, [-1, 0, 0], 42, B03, {ground: 'wheat', seed: 3})[0].r - 1.2) < 1e-9);
  assert.equal(blastLean(1, B03, 2), 0); assert.equal(blastLean(2, B03, 2), 0.44); assert.equal(blastLean(3, B03, 2), 0.17); assert.equal(blastLean(2, B03, 4), 0);
  assert.ok(blastLean(75, B03, 2) < 0.17 && blastLean(75, B03, 2) > 0); assert.equal(blastLean(83, B03, 2), 0); assert.equal(blastLean(120, B03, 2), 0);
});

test('flash: k0 halation = six circles of 0.05 summing to GLOW_PEAK, white core; k1 half alpha, #ffd27a; k >= 2 nothing', () => {
  const m: [number, number, number] = [0.54, 0.58, 0], d: [number, number, number] = [-1, 0, 0];
  const run = (L: number) => { const r = recorder(); paintMuzzleFlash(r.p, CAM, m, d, L, B03, {halo: 180, seed: 4}); return r.fills; };
  const f0 = run(2), halo0 = f0.filter((f) => f.color === '#fff2cc');
  assert.equal(halo0.length, 6); assert.ok(Math.abs(halo0.reduce((s, f) => s + f.opacity / 255, 0) - GUNFIRE_GLOW_PEAK) < 1e-9);
  assert.ok(f0.some((f) => f.wash && f.color === '#ffffff'));
  const f1 = run(3), halo1 = f1.filter((f) => f.color === '#fff2cc');
  assert.ok(Math.abs(halo1.reduce((s, f) => s + f.opacity / 255, 0) - 0.15) < 1e-9); assert.ok(f1.some((f) => f.wash && f.color === '#ffd27a'));
  assert.equal(run(4).length, 0); assert.equal(run(0).length, 0);
});

test('flash core: diameter 0.25-0.35 m, half size on k1, one seeded shape per round, clip drops the flash', () => {
  const m: [number, number, number] = [0.54, 0.58, 0], d: [number, number, number] = [-1, 0, 0];
  const w = (L: number, seed = 4) => { const q = flashPolygon(CAM, m, d, L, B03, seed)!; const xs = q.map((v) => v[0]); return Math.max(...xs) - Math.min(...xs); };
  assert.equal(flashPolygon(CAM, m, d, 4, B03, 4), null);
  for (let n = 0; n < 23; n++) assert.ok(flashPolygon(CAM, m, d, B03[n], B03, 4)!.length >= 3);
  assert.ok(w(3) < w(2) + 1e-9);
  const r = recorder(); paintMuzzleFlash(r.p, CAM, m, d, 2, B03, {halo: 180, seed: 4, clip: () => false}); assert.equal(r.fills.length, 0);
});

test('single shots: B05-SH02 rounds [72, 79] are each a k 0 flash frame, halo 160', () => {
  const r = GUNFIRE_PRESETS.B05_SH02.rounds as unknown as number[];
  assert.deepEqual(roundPhase(72, r), {n: 0, k: 0}); assert.deepEqual(roundPhase(79, r), {n: 1, k: 0}); assert.equal(GUNFIRE_PRESETS.B05_SH02.halo, 160);
});

// EDU-EP30-SHORT ticket T05 r4: casings, strikes, spouts, splash.
import {casingAt, casingKeyed, paintCasings, paintSpurts, paintSplash, restingCasings, spurtHeight, spurtProfile, strikePoints, type CasingSpec} from '../src/painted/kit/gunfire';
import {flockIn} from '../src/painted/edu30/flock';
import {STONE_AT} from '../src/painted/edu30/dam';
import {lewisAnchors} from '../src/painted/edu30/props';

const PORT03 = lewisAnchors([0, 0, 0], -Math.PI / 2).port;
const SPEC03: CasingSpec = {port: PORT03, side: 1, seed: 8100, dir: [0, 0, -1], ground: () => 0, box: {x: [0.8, 1.5], z: [-0.2, 0.4]}};

test('casings: none before rounds[i] + 1; frame L alone equals frame L after 0..L', () => {
  for (const i of [0, 7, 22]) {
    assert.equal(casingAt(i, B03[i], B03, SPEC03), null);
    assert.ok(casingAt(i, B03[i] + 1, B03, SPEC03));
  }
  const lone = casingAt(5, 40, B03, SPEC03);
  for (let L = 0; L <= 40; L++) casingAt(5, L, B03, SPEC03);
  assert.deepEqual(casingAt(5, 40, B03, SPEC03), lone);
});

test('casings: leave the port with up 2.6-3.1 m/s, rest once, 23 paddock casings rest inside the B03 box', () => {
  for (let i = 0; i < 23; i++) {
    const a = casingAt(i, B03[i] + 1, B03, SPEC03)!, b = casingAt(i, B03[i] + 2, B03, SPEC03)!;
    assert.deepEqual(a.pos, PORT03); assert.equal(a.state, 'air');
    const vy = (b.pos[1] - a.pos[1]) * 30 + (0.5 * 9.81) / 30;
    assert.ok(vy > 2.55 && vy < 3.15, `vy ${vy}`);
    const end = casingAt(i, 140, B03, SPEC03)!;
    assert.equal(end.state, 'rest');
    assert.ok(end.pos[0] >= 0.8 && end.pos[0] <= 1.5 && end.pos[2] >= -0.2 && end.pos[2] <= 0.4, `box ${end.pos}`);
    assert.deepEqual(casingAt(i, 200, B03, SPEC03)!.pos, end.pos);
  }
  assert.equal(restingCasings(B03, SPEC03).length, 23);
  let n = 0;
  for (let L = 0; L < 140; L++) if (casingAt(3, L, B03, SPEC03)?.glint) n++;
  assert.equal(n, 1);
});

test('casings: a first contact inside the water is sunk; the side flips the ejection direction', () => {
  const wet: CasingSpec = {...SPEC03, box: undefined, water: {y: 0, inside: () => true}};
  assert.equal(casingAt(2, 140, B03, wet)!.state, 'sunk');
  const spec: CasingSpec = {...SPEC03, box: undefined, side: -1};
  assert.ok(casingAt(0, 140, B03, spec)!.pos[0] < PORT03[0]);
});

test('painters: casings, spurts and splash draw plain fills and nothing outside their life', () => {
  const r = recorder(); paintCasings(r.p, CAM, 1, B03, SPEC03); assert.equal(r.fills.length, 0);
  const r2 = recorder(); paintCasings(r2.p, CAM, 75, B03, SPEC03); assert.ok(r2.fills.length >= 23 * 2);
  const pts: [number, number, number][] = B03.map((_, i) => [i * 0.1, 0, -10]);
  const r3 = recorder(); paintSpurts(r3.p, CAM, 12, B03, {points: pts, kind: 'dust', h: [0.6, 1.2], seed: 5}); assert.ok(r3.fills.length > 0);
  const r4 = recorder(); paintSpurts(r4.p, CAM, 200, B03, {points: pts, kind: 'dust', h: [0.6, 1.2], seed: 5}); assert.equal(r4.fills.length, 0);
  const r5 = recorder(); paintSplash(r5.p, CAM, 4, [1, 0, -3], 2, 3); assert.ok(r5.fills.length > 0);
  const r6 = recorder(); paintSplash(r6.p, CAM, 40, [1, 0, -3], 2, 3); assert.equal(r6.fills.length, 0);
  assert.equal(spurtProfile(2), 1); assert.equal(spurtProfile(8), 0);
});

test('strikes: B03 walks z -14 to -26, h 0.6-1.2 m, none within 4 m of an F1 bird (seed 31000)', () => {
  const birds = flockIn(31000, 40, [-30, 30], [-60, -30]).map((m) => m.at);
  const {points} = strikePoints({count: 23, seed: 9100, minDist: 4, x: [-6, 6], z: (i) => -14 - (12 * i) / 22, ground: () => 0, avoid: birds});
  assert.equal(points.length, 23);
  points.forEach((q, i) => {
    assert.ok(Math.abs(q[2] - (-14 - (12 * i) / 22)) < 1e-9); assert.ok(q[0] >= -6 && q[0] <= 6);
    for (const b of birds) assert.ok(Math.hypot(b[0] - q[0], b[2] - q[2]) >= 4);
    const h = spurtHeight({points, kind: 'dust', h: [0.6, 1.2], seed: 9200}, i);
    assert.ok(h >= 0.6 && h <= 1.2);
  });
});

test('jam casing keys: linear between the keys, built port and moved stone', () => {
  const port = lewisAnchors([-5.6, 0.32, -5.0], 0).port;
  const top: [number, number, number] = [STONE_AT[0], STONE_AT[1] + 0.05, STONE_AT[2]];
  assert.ok(Math.abs(port[0] + 5.679) < 0.002 && Math.abs(port[1] - 0.857) < 0.002 && Math.abs(port[2] + 4.95) < 0.002, `${port}`);
  assert.ok(Math.abs(top[0] + 5.63) < 1e-9 && Math.abs(top[1] - 0.38) < 1e-9 && Math.abs(top[2] + 4.9) < 1e-9);
  const keys = [{L: 13, pos: port, angle: 0}, {L: 17, pos: top, angle: 1}, {L: 19, pos: [top[0], top[1] + 0.04, top[2]] as [number, number, number], angle: 2}, {L: 21, pos: top, angle: 3}];
  assert.deepEqual(casingKeyed(keys, 13).pos, port); assert.deepEqual(casingKeyed(keys, 17).pos, top);
  assert.ok(Math.abs(casingKeyed(keys, 19).pos[1] - (top[1] + 0.04)) < 1e-9); assert.deepEqual(casingKeyed(keys, 30).pos, top);
  assert.ok(Math.abs(casingKeyed(keys, 15).pos[1] - (port[1] + top[1]) / 2) < 1e-9);
});
