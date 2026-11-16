import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {ANIMALS, drawAnimal, type AnimalAnchors, type AnimalPose} from '../src/painted/kit/animals';
import {drawFigure} from '../src/painted/kit/cast';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {makePainter} from '../src/painted/kit/painter';
import {poseFor} from '../src/painted/kit/poses';
import {paintLongLine, paintStopwatch, stopwatchText} from '../src/painted/kit/props';
import {WARDROBE, WARDROBE_INFO} from '../src/painted/kit/wardrobe';
import {GIRL, HARNESS, MUM} from '../src/painted/edu19/cast';
import {MAT_COLORS, O2_LEVELS, ORDER_O1, ORDER_O2} from '../src/painted/edu19/mats';
import {ROUND1_LEVELS} from '../src/painted/edu19/trail';

// EDU-EP19 W2.4 comp-card assets: trainer-vest outfit + pouch, dog harness / ring anchor / head roll, stopwatch and long line, mat orders.
const record = () => {
  const log: string[] = [];
  const brush = new Proxy({}, {get: (_t, name) => (...a: unknown[]) => { log.push(String(name) + JSON.stringify(a)); }}) as Brush;
  return {p: makePainter(brush, {t: 0.5, frame: 15}), log};
};
const dog = ANIMALS['dog-black-lab'];
const dogCalls = (pose: AnimalPose, anc?: AnimalAnchors) => {
  const r = record();
  drawAnimal(r.p, dog.seed, dog, [540, 1500], 300, pose, 0.5, anc);
  return r.log.join('|');
};

test('trainer-vest is a work outfit with the treat pouch; MUM and GIRL keep the casting sizes', () => {
  assert.ok(WARDROBE['trainer-vest'].gear?.pouch);
  assert.equal(WARDROBE_INFO['trainer-vest'].group, 'work');
  assert.equal(MUM.height, 1.64);
  assert.equal(GIRL.height, 1.34);
  assert.equal(GIRL.outfit.shirt, '#e0654f');
  assert.equal(GIRL.outfit.gear?.hat, undefined, 'cap off');
});

test('the pouch draws only when set (other outfits unchanged) and every MUM view paints finite', () => {
  const calls = (pouch: boolean, view: 'front' | 'left' | 'right' | 'back') => {
    const r = record(), g: [number, number] = [540, 1500];
    const def = pouch ? MUM : {...MUM, outfit: {...MUM.outfit, gear: {...MUM.outfit.gear, pouch: undefined}}};
    drawFigure(r.p, def, g, 300, {face: EXPRESSIONS.neutral, ...(view === 'back' ? {view} : poseFor('P01', def, g, 300, view))}, 0.5);
    return r.log.join('|');
  };
  for (const v of ['front', 'left', 'right'] as const) assert.notEqual(calls(true, v), calls(false, v));
  for (const v of ['front', 'left', 'right', 'back'] as const) assert.ok(!calls(true, v).includes('NaN'));
});

test('harness is opt-in, returns the ring anchor on the back, and paints finite in every plain view and state', () => {
  for (const view of ['left', 'right', 'front'] as const) for (const state of ['stand', 'sit', 'lie'] as const) {
    const base: AnimalPose = {view, state};
    assert.notEqual(dogCalls(base), dogCalls({...base, harness: HARNESS}));
    const anc: AnimalAnchors = {};
    assert.ok(!dogCalls({...base, harness: HARNESS}, anc).includes('NaN'));
    assert.ok(anc.ring && Number.isFinite(anc.ring[0]) && anc.ring[1] < 1500, `${view} ${state} ring above the ground`);
  }
  const anc: AnimalAnchors = {};
  dogCalls({view: 'right', state: 'stand', harness: HARNESS}, anc);
  // Ring on the back: near the shoulder height (0.58 m = 174 px at 300 px/m) above the ground point.
  assert.ok(anc.ring && 1500 - anc.ring[1] > 140 && 1500 - anc.ring[1] < 230, `ring height ${anc.ring && 1500 - anc.ring[1]}`);
});

test('front head roll is opt-in and changes the drawing', () => {
  const base: AnimalPose = {view: 'front', state: 'sit', lid: 0};
  assert.equal(dogCalls(base), dogCalls({...base, roll: 0}));
  assert.notEqual(dogCalls(base), dogCalls({...base, roll: 14}));
});

test('stopwatch text and painters', () => {
  assert.equal(stopwatchText(0), '00:00');
  assert.equal(stopwatchText(1200), '20:00');
  assert.equal(stopwatchText(65.9), '01:05');
  const r = record();
  const box = paintStopwatch(r.p, 1, [100, 100], 20);
  assert.equal(box.w, 30);
  paintLongLine(r.p, 2, [0, 0], [300, 50], {coil: 2});
  assert.ok(!r.log.join('|').includes('NaN'));
});

test('mat orders: 13 slots, same colour counts before and after the swap, levels in range', () => {
  assert.equal(ORDER_O1.length, 13);
  assert.equal(ORDER_O2.length, 13);
  const count = (o: string[]) => Object.keys(MAT_COLORS).map((k) => o.filter((c) => c === k).length).join(',');
  assert.equal(count(ORDER_O1), count(ORDER_O2));
  assert.equal(O2_LEVELS.length, 13);
  for (const l of [...O2_LEVELS, ...ROUND1_LEVELS]) assert.ok(l > 0 && l <= 0.3);
  for (let i = 1; i < ROUND1_LEVELS.length; i++) assert.ok(ROUND1_LEVELS[i] > ROUND1_LEVELS[i - 1], 'round 1 rises swing -> tree');
});

// ------------------------------------------------------------------------------------------------ W3.1 look-frame assets (15 Nov 2026)
test('dog look / earLift / lick are opt-in: absent leaves the drawing unchanged, set changes it', async () => {
  const front: AnimalPose = {view: 'front', state: 'stand'}, side: AnimalPose = {view: 'right', state: 'stand'};
  assert.equal(dogCalls({...front, look: 0, earLift: 0, lick: 0}), dogCalls(front));
  assert.equal(dogCalls({...side, lick: 0}), dogCalls(side));
  for (const extra of [{look: -1}, {look: 1}, {earLift: 1}, {lick: 1}] as Partial<AnimalPose>[]) assert.notEqual(dogCalls({...front, ...extra}), dogCalls(front));
  assert.notEqual(dogCalls({...side, lick: 1}), dogCalls(side));
});

test('N5 dog motions: look-left-right keys, head-tilt holds, sniff-track walks and holds', async () => {
  const {animalMotion, animalMotionDuration} = await import('../src/painted/kit/animal-motions');
  const look = (t: number) => animalMotion('look-left-right', t, {animal: dog, view: 'front'}).pose.look ?? 0;
  assert.ok(look(0.17) < -0.95 && look(0.44) > 0.95 && look(0.7) < -0.95 && Math.abs(look(1.2)) < 1e-9);
  const tilt = animalMotion('head-tilt', 5, {animal: dog, view: 'front'}).pose;
  assert.equal(tilt.roll, 14); assert.equal(tilt.earLift, 1);
  const d = animalMotionDuration('sniff-track', {animal: dog, view: 'right', distance: 2.4}), end = animalMotion('sniff-track', d, {animal: dog, view: 'right', distance: 2.4});
  assert.ok(Math.abs(end.offset[0] - 2.4) < 1e-9 && (end.pose.sniff ?? 0) >= 0.85);
});

test('SET-FIELD19 cameras, trail, glow ramp and the LF03 lead height', async () => {
  const {camOf} = await import('../src/painted/kit/cam-moves');
  const {sheetMove, paintFieldShot} = await import('../src/painted/edu19/stage');
  const {trailPrints, glowRamp} = await import('../src/painted/edu19/trail');
  const {B01_SH07} = await import('../src/painted/edu19/shots/B01-SH07');
  // Sheet B01-SH01: camera at (-2.12, 1.10, 1.97) at l 0 (camera = at + r(-sin yaw, 0, cos yaw)).
  const c0 = camOf(sheetMove([[2.2, 0.5, -2.2], [2.0, 0.5, -1.8]], [46, 38], [6.0, 5.3], 1.1, {f: 760, hy: 760}), 0);
  assert.ok(Math.abs(c0.x + 2.116) < 0.01 && Math.abs(c0.z - 1.968) < 0.01 && c0.y === 1.1);
  const prints = trailPrints();
  assert.equal(prints.length, 19);
  assert.ok(Math.abs(prints[1].at[0] - prints[0].at[0] - 0.6) < 1e-9 && Math.abs(prints[9].at[0]) < 1e-9);
  assert.equal(glowRamp(0.1, 0.2, 0.3), 0); assert.ok(Math.abs(glowRamp(0.4, 0.2, 0.3) - 0.3) < 1e-9);
  const probe: {girl?: {top: number; bottom: number} | null} = {};
  paintFieldShot(record().p, B01_SH07.cam(16), {...B01_SH07.state(16), probe: probe as never});
  assert.ok(probe.girl && probe.girl.bottom - probe.girl.top >= 480, 'GIRL >= 480 px in LF03');
});

test('W3.3 R2: glow size ladder, rim per camera, LF03 dog without lean', async () => {
  const {GLOW_STEPS, GLOW_OPACITY, glowStep} = await import('../src/painted/edu19/glow');
  const {GLOW_PEAK} = await import('../src/painted/kit/glow');
  const {rimStrength} = await import('../src/painted/edu19/stage');
  const {B01_SH07} = await import('../src/painted/edu19/shots/B01-SH07');
  const {B01_SH01} = await import('../src/painted/edu19/shots/B01-SH01');
  // VD04 R2: one opacity under the cap; round 1 climbs S1..S5; the O2 mat jumble by slot as the sheet writes it.
  assert.ok(GLOW_OPACITY <= GLOW_PEAK);
  assert.deepEqual(ROUND1_LEVELS.map(glowStep), [0, 1, 2, 3, 4]);
  assert.deepEqual(O2_LEVELS.map((l) => glowStep(l) + 1), [2, 5, 2, 4, 1, 5, 2, 4, 3, 5, 1, 4, 2]);
  assert.deepEqual([...GLOW_STEPS], [0.4, 0.55, 0.7, 0.85, 1]);
  // VD16: rim in 0.25..1 for every camera.
  for (const c of [B01_SH07.cam(16), B01_SH01.cam(0)]) { const r = rimStrength(c); assert.ok(r >= 0.25 && r <= 1); }
  // VD15: the dog has no lean / leanTo in B01-SH07 (the neck stays the kit length), head raised 12 deg.
  for (const L of [0, 16, 34, 42]) { const d = B01_SH07.state(L).dog!; assert.equal(d.pose.lean, undefined); assert.equal(d.pose.leanTo, undefined); assert.equal(d.pose.tilt, -12); }
  assert.equal(B01_SH07.state(16).girl?.view, 'left');
});

test('soi clip painter keeps polygons inside the vignette circle', async () => {
  const {clipPainter, VIG} = await import('../src/painted/edu19/soi');
  const polys: number[][][] = [];
  const brush = new Proxy({}, {get: (_t, k) => (...a: unknown[]) => { if (k === 'polygon') polys.push(a[0] as number[][]); }}) as Brush;
  const q = clipPainter(makePainter(brush, {t: 0, frame: 0}), VIG.cx, VIG.cy, VIG.r);
  q.flat('#000000', [[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]]);
  q.wash('#000000', 100, [[0, 0], [100, 0], [100, 100]]);
  assert.equal(polys.length, 1);
  assert.ok(polys[0].every(([x, y]) => Math.hypot(x - VIG.cx, y - VIG.cy) <= VIG.r + 1e-6));
});

// ------------------------------------------------------------------------------------------------ W5.5 draft fix round 1 (16 Nov 2026)
test('soft dog is opt-in: absent or false draws the kit dog unchanged, set rounds it; EP19 DOG is soft, other dogs are not', async () => {
  const {DOG} = await import('../src/painted/edu19/cast');
  const draw = (def: typeof dog, pose: AnimalPose) => { const r = record(); drawAnimal(r.p, def.seed, def, [540, 1500], 300, pose, 0.5); return r.log.join('|'); };
  const poses: AnimalPose[] = [{view: 'right', state: 'stand', sniff: 0.9, harness: HARNESS}, {view: 'front', state: 'sit', mouth: 'open'}, {view: 'left', state: 'stand', lick: 0.6}, {view: 'front', state: 'stand', walk: 0.3, sniff: 0.3, headLow: true}];
  for (const pose of poses) {
    assert.equal(draw({...dog, soft: false}, pose), draw(dog, pose), 'soft false = absent');
    const soft = draw({...dog, soft: true}, pose);
    assert.notEqual(soft, draw(dog, pose), 'soft changes the drawing');
    assert.ok(!soft.includes('NaN') && !soft.includes('null'), 'soft paints finite');
  }
  assert.equal(DOG.soft, true);
  for (const id of ['dog-golden', 'dog-black-lab', 'dog-thai'] as const) assert.equal(ANIMALS[id].soft, undefined, `${id} keeps the kit drawing`);
});

test('MUM watch follows the forearm: 7 cm up it from the hand, angle along elbow -> hand, hanging fallback', async () => {
  const {mumWatchAt} = await import('../src/painted/edu19/stage');
  const u = 400, base = {head: [0, 0], headTop: 0, chin: 0, feet: [0, 0], rHand: [0, 0], rShoulder: [0, 0], rUpper: [0, 0], top: 0, bottom: 0} as const;
  // Forearm raised horizontally: shoulder (0,0), elbow (0,100) (upper mid (0,50)), hand (-100,100): the watch sits 28 px toward the elbow.
  const w = mumWatchAt({...base, lShoulder: [0, 0], lUpper: [0, 50], lHand: [-100, 100]} as never, u);
  assert.ok(Math.abs(w.c[0] - -72) < 1e-9 && Math.abs(w.c[1] - 100) < 1e-9);
  assert.ok(Math.abs(Math.abs(w.angle) - Math.PI) < 1e-9, 'angle along the forearm (pointing -x)');
  // Forearm seen end-on (hand on the elbow): falls back to hanging.
  const f = mumWatchAt({...base, lShoulder: [0, 0], lUpper: [0, 50], lHand: [1, 100]} as never, u);
  assert.ok(Math.abs(f.angle - Math.PI / 2) < 1e-9);
});
