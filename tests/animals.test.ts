import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {ANIMALS, ANIMAL_IDS, ANIMAL_INFO, animalWalkSpeed, drawAnimal, type AnimalPose} from '../src/painted/kit/animals';
import {makePainter} from '../src/painted/kit/painter';

// Every animal draws in every view and state without throwing, every id has info, and walks move at a finite speed.
const brush = new Proxy({}, {get: () => () => undefined}) as Brush;

test('animal ids, defs and info agree', () => {
  assert.equal(new Set(ANIMAL_IDS).size, ANIMAL_IDS.length);
  assert.deepEqual(Object.keys(ANIMALS).sort(), [...ANIMAL_IDS].sort());
  assert.deepEqual(Object.keys(ANIMAL_INFO).sort(), [...ANIMAL_IDS].sort());
  assert.ok(ANIMAL_IDS.some((id) => id.startsWith('dog-')) && ANIMAL_IDS.some((id) => id.startsWith('cat-')));
  assert.equal(new Set(ANIMAL_IDS.map((id) => ANIMALS[id].seed)).size, ANIMAL_IDS.length, 'unique seeds');
});

test('every animal paints in every view and state', () => {
  const poses: AnimalPose[] = [];
  for (const view of ['left', 'right', 'front'] as const) for (const state of ['stand', 'sit', 'lie'] as const) poses.push({view, state}, {view, state, walk: 0.3, wag: 1, mouth: 'open'});
  for (const id of ANIMAL_IDS) {
    const def = ANIMALS[id];
    const v = animalWalkSpeed(def);
    assert.ok(Number.isFinite(v) && v > 0, `${id} walk speed`);
    for (const pose of poses) drawAnimal(makePainter(brush, {t: 0.5, frame: 15}), def.seed, def, [540, 1500], 300, pose, 0.5);
  }
});

test('animal motions: every id is in the reel once, frames are finite and hold their end', async () => {
  const {ANIMAL_MOTION_IDS, ANIMAL_MOTION_INFO, ANIMAL_REEL, animalMotion, animalMotionDuration} = await import('../src/painted/kit/animal-motions');
  assert.deepEqual(ANIMAL_REEL.map((e) => e.motion).sort(), [...ANIMAL_MOTION_IDS].sort());
  assert.deepEqual(Object.keys(ANIMAL_MOTION_INFO).sort(), [...ANIMAL_MOTION_IDS].sort());
  for (const id of ANIMAL_MOTION_IDS) for (const animal of ['dog-golden', 'cat-black'] as const) {
    const dur = animalMotionDuration(id, {animal});
    assert.ok(dur > 0 && dur < 10, `${id} duration`);
    for (const t of [0, dur / 2, dur, dur + 1]) {
      const m = animalMotion(id, t, {animal});
      assert.ok(m.offset.every(Number.isFinite), `${id} offset at ${t}`);
      drawAnimal(makePainter(brush, {t, frame: 0}), 900, ANIMALS[animal], [540, 1500], 300, m.pose, t);
    }
    if (!ANIMAL_MOTION_INFO[id].loop) assert.deepEqual(animalMotion(id, dur, {animal}), animalMotion(id, dur + 2, {animal}), `${id} holds`);
  }
  // A walk-in ends at the rest point.
  assert.ok(Math.abs(animalMotion('walk-in-from-left', 99, {animal: 'dog-golden'}).offset[0]) < 1e-9);
});

// EDU-EP03 `charge` (opt-in front-view run/brake pose): absent or 0 leaves the front pose byte-identical; set, it paints a different, finite drawing.
test('dog charge pose is opt-in and does not change the existing front pose', () => {
  const calls = (pose: AnimalPose) => {
    const log: string[] = [];
    const rec = new Proxy({}, {get: (_t, name) => (...a: unknown[]) => { log.push(String(name) + JSON.stringify(a)); }}) as Brush;
    const def = ANIMALS['dog-golden'];
    drawAnimal(makePainter(rec, {t: 0.5, frame: 15}), def.seed, def, [540, 1500], 300, pose, 0.5);
    return log.join('|');
  };
  const base: AnimalPose = {view: 'front', state: 'stand', gait: 'run', walk: 0.2, stride: 1, mouth: 'open'};
  assert.equal(calls(base), calls({...base, charge: 0}));
  assert.equal(calls(base), calls({...base, yaw: 0.5}));
  assert.notEqual(calls(base), calls({...base, charge: 1}));
  assert.ok(!calls({...base, charge: 1, yaw: 0.9, stride: 0.15}).includes('NaN'));
});

// EDU-EP03 `quarter` / `brake` (opt-in front-three-quarter run/brake view): absent leaves every existing view byte-identical; set, it paints a finite drawing for both facings.
test('dog three-quarter view is opt-in and finite', () => {
  const calls = (pose: AnimalPose) => {
    const log: string[] = [];
    const rec = new Proxy({}, {get: (_t, name) => (...a: unknown[]) => { log.push(String(name) + JSON.stringify(a)); }}) as Brush;
    const def = ANIMALS['dog-golden'];
    drawAnimal(makePainter(rec, {t: 0.5, frame: 15}), def.seed, def, [540, 1500], 300, pose, 0.5);
    return log.join('|');
  };
  for (const view of ['right', 'left', 'front'] as const) {
    const base: AnimalPose = {view, state: 'stand', gait: 'run', walk: 0.2, stride: 1, mouth: 'open'};
    assert.equal(calls(base), calls({...base, brake: 0.5}));
    if (view === 'front') continue;
    for (const [quarter, brake] of [[0, 0], [0.5, 0], [1, 1]]) {
      const out = calls({...base, quarter, brake});
      assert.notEqual(out, calls(base));
      assert.ok(!out.includes('NaN'));
    }
  }
});
