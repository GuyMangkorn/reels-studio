import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {animalMotion, animalMotionDuration} from '../src/painted/kit/animal-motions';
import {drawFlea, type FleaOpts} from '../src/painted/kit/flea';
import {MOTION_INFO, layerMotion, motionFrame} from '../src/painted/kit/motions';
import {makePainter, type Pt} from '../src/painted/kit/painter';

// EDU-EP13 kit intake (W8.4, KIT-P01): the flea card, the standing-jump motion (N5), the dog head-lift-sigh (N13b), `antenna`.
const recorder = () => {
  const log: string[] = [];
  const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => { log.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush;
  return {painter: () => makePainter(brush, {t: 0, frame: 0}), log};
};
const G: Pt = [540, 1500];
const draw = (o: FleaOpts, len = 600) => { const r = recorder(); const m = drawFlea(r.painter(), G, len, o); return {m, log: r.log.join('\n')}; };

test('flea card: every state and view draws, grounded states put the lowest toe on the floor at any scale', () => {
  for (const view of ['right', 'left', 'front'] as const) for (const state of ['rest', 'fold', 'crouch', 'extend', 'apex', 'land'] as const) assert.ok(draw({view, state}).log.length > 0, `${view} ${state}`);
  for (const len of [60, 600]) for (const state of ['rest', 'fold', 'crouch'] as const) {
    const {m} = draw({view: 'right', state}, len);
    const low = Math.max(...m.toes.map((t) => t[1]));
    assert.ok(Math.abs(low - G[1]) < 0.03 * len, `${state} len ${len}: toe ${low} vs floor ${G[1]}`);
  }
  assert.equal(draw({view: 'right', state: 'rest'}).log, draw({view: 'right', state: 'rest'}).log);
});

test('flea antenna: absent or 0 is the tucked drawing byte for byte, a value adds the lifted antenna', () => {
  const base = draw({view: 'right', state: 'rest'}).log;
  assert.equal(draw({view: 'right', state: 'rest', antenna: 0}).log, base);
  assert.notEqual(draw({view: 'right', state: 'rest', antenna: 0.6}).log, base);
});

test('standing-jump: grounded at both ends, apex clearance = amount, front view, arms and crouch in the library', () => {
  const info = MOTION_INFO['standing-jump'];
  assert.deepEqual(info.views, ['front']);
  const lift = (t: number, amount?: number) => motionFrame('standing-jump', t, {view: 'front', k: 1, seed: 1, amount}).body?.lift ?? 0;
  assert.equal(lift(0), 0); assert.equal(lift(info.duration + 1), 0);
  assert.ok(Math.abs(lift(17 / 30 - 1e-6) - 0.42) < 1e-3); assert.ok(Math.abs(lift(17 / 30 - 1e-6, 0.2) - 0.2) < 1e-3);
  let peak = 0; for (let f = 0; f <= 45; f++) peak = Math.max(peak, lift(f / 30)); assert.ok(peak <= 0.42 + 1e-9);
  const g: Pt = [540, 1500];
  const l = layerMotion({person: 'man-parted', motion: 'standing-jump', t: 0.4, g, unit: 540, amount: 0.3});
  assert.ok(l.pose.lift! > 0 && l.pose.lift! <= 0.3);
});

test('dog head-lift-sigh: eyes shut at both ends, open mid, head rotates about the skull only (no lean)', () => {
  const m = (t: number) => animalMotion('head-lift-sigh', t, {animal: 'dog-golden', view: 'left'}).pose;
  const dur = animalMotionDuration('head-lift-sigh', {animal: 'dog-golden'});
  assert.equal(dur, 2);
  assert.equal(m(0).lid, 1); assert.equal(m(dur).lid, 1); assert.equal(m(0.8).lid, 0.2);
  assert.equal(m(0).state, 'lie'); assert.equal(m(1).lean, undefined);
  assert.ok(Math.abs(m(0).tilt!) < 1e-9 && Math.abs(m(dur).tilt!) < 1e-6);
  assert.equal(m(0.6).mouth, 'open'); assert.equal(m(1.8).mouth, 'closed');
});
