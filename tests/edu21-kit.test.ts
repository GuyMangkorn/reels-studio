import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {camMove, camOf} from '../src/painted/kit/cam-moves';
import {makePainter, type Painter} from '../src/painted/kit/painter';
import type {YCam} from '../src/painted/kit/ycam';
import {dress, WARDROBE, WARDROBE_INFO} from '../src/painted/kit/wardrobe';
import {PEOPLE} from '../src/painted/kit/people';
import * as KCar from '../src/painted/kit/sedan';
import * as KCabin from '../src/painted/kit/sedan-cabin';
import * as KBolt from '../src/painted/kit/lightning';
import * as KSeat from '../src/painted/kit/car-seat';
import * as ECar from '../src/painted/edu21/car';
import * as ECabin from '../src/painted/edu21/cabin';
import * as EBolt from '../src/painted/edu21/bolt';
import * as ERoad from '../src/painted/edu21/road';
import * as EDriver from '../src/painted/edu21/driver';
import {DRIVER, DRIVER_HIP, seatedGround} from '../src/painted/edu21/cast';

// EDU-EP21 kit intake (KIT-P01, W8.4): the kit copies (sedan.ts, sedan-cabin.ts, lightning.tsx, car-seat.ts, wardrobe `commuter`) paint and
// return exactly what the episode code does, so a later episode that casts `sedan-red`, `lightning-bolt`, `car-seat-sit` or
// `woman-ponytail + commuter` gets the approved EP21 picture.
const recorder = () => {
  const log: string[] = [];
  const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => { log.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush;
  return {brush, log};
};
const paint = (fn: (p: Painter) => void) => {
  const r = recorder();
  fn(makePainter(r.brush, {t: 0.4, frame: 12}));
  return r.log.join('\n');
};
const EXT = camMove([0.6, 0.55, 0.4], [40, 34], [3.8, 3.5], 0.45, {f: 1150, hy: 1000});
const CAB = camMove([0.3, 1.0, 0.3], [-104, -106], [1.35, 1.42], 1.08, {f: 760, hy: 820});
const ext: YCam[] = [0, 0.5, 1].map((u) => camOf(EXT, u));
const cab: YCam[] = [0, 0.5, 1].map((u) => ({...camOf(CAB, u), near: 0.12}));

test('commuter outfit is the EP21 DRIVER outfit on woman-ponytail', () => {
  const d = dress(PEOPLE['woman-ponytail'], 'commuter');
  for (const k of ['shirt', 'sleeve', 'longSleeves', 'pants', 'shoes'] as const) assert.equal(d.outfit[k], DRIVER.outfit[k]);
  assert.equal(WARDROBE.commuter.shirt, '#d9a23a');
  assert.match(WARDROBE_INFO.commuter.description, /mustard/);
});

test('sedan exterior and tones match the EP21 car', () => {
  assert.deepEqual(KCar.CAR, ECar.CAR);
  for (const c of ext) {
    const e = paint((p) => ECar.paintCarExterior(p, c, {}));
    assert.ok(e.length > 1000, 'the exterior paints marks');
    assert.equal(paint((p) => KCar.paintCarExterior(p, c, {})), e);
    const o = {frDamage: KCar.FR_DONE, sag: 0.04, inkBreakWheels: true, dashGlow: true};
    assert.equal(paint((p) => KCar.paintCarExterior(p, c, {...o, tone: KCar.TONE_EXPLAIN})), paint((p) => ECar.paintCarExterior(p, c, {...o, tone: ERoad.TONE_EXPLAIN})));
    assert.deepEqual(KCar.carSilhouette(c), ECar.carSilhouette(c));
  }
  for (const col of ['#b8322c', '#2a3440', '#d9a23a']) assert.equal(KCar.toneMix(0.4)(col), ERoad.toneMix(0.4)(col));
});

test('sedan cabin matches the EP21 cabin', () => {
  assert.deepEqual(KCabin.SEDAN_DRIVER_HIP, DRIVER_HIP);
  for (const c of cab) {
    const o = {t: 0.4, rainRun: true, sheen: 0.5, radio: {light: 0.2, press: 1}};
    assert.ok(paint((p) => ECabin.paintCabin(p, c, o)).length > 1000, 'the cabin paints marks');
    assert.equal(paint((p) => KCabin.paintCabin(p, c, o)), paint((p) => ECabin.paintCabin(p, c, o)));
    assert.equal(paint((p) => KCabin.paintCabin(p, c, {...o, lens: 'side', dashGlow: true})), paint((p) => ECabin.paintCabin(p, c, {...o, lens: 'side', dashGlow: true})));
  }
});

test('lightning bolt matches the EP21 bolt', () => {
  const o = {path: [[-0.7, 1.49, 0.62], [-0.4, 2.6, 0.3], [-0.9, 4.0, 0.1]] as [number, number, number][], branches: [[[-0.4, 2.6, 0.3], [0.2, 3.1, 0.1]]] as [number, number, number][][], top: 9, seed: 7};
  for (const c of ext) {
    assert.deepEqual(KBolt.boltPaths(c, o), EBolt.boltPaths(c, o));
    assert.deepEqual(KBolt.boltPaths(c, {tip: [0, 3.8, 0], seed: 3}), EBolt.boltPaths(c, {tip: [0, 3.8, 0], seed: 3}));
    assert.equal(paint((p) => KBolt.paintStrikeRim(p, c, [900, 700], 1)), paint((p) => EBolt.paintStrikeRim(p, c, [900, 700], 1)));
  }
  for (const d of [-2, -1, 0, 1, 3, 8]) for (const k of ['single', 'double'] as const) assert.deepEqual(KBolt.boltEnv(k, d), EBolt.boltEnv(k, d));
});

test('car-seat sit and radio reach match the EP21 DRIVER', () => {
  assert.deepEqual(KSeat.CAR_SEAT_HANDS, EDriver.HANDS);
  assert.deepEqual(KSeat.seatedGround(DRIVER, DRIVER_HIP), seatedGround(DRIVER, DRIVER_HIP));
  const kd = dress(PEOPLE['woman-ponytail'], 'commuter');
  for (const G of [0, 14, 30, 60, 80, 99]) {
    const s = EDriver.B01_DRIVER(G);
    for (const c of [...ext, ...cab]) {
      const e = paint((p) => EDriver.paintDriverAt(p, c, s, {t: 0.4}));
      assert.ok(e.length > 0 || c.yaw !== cab[0].yaw, 'the driver paints marks in the cabin lens');
      assert.equal(paint((p) => KSeat.paintSeatedAt(p, c, DRIVER, DRIVER_HIP, s, {t: 0.4})), e);
      assert.deepEqual(KSeat.seatedLead(c, DRIVER_HIP, s), EDriver.driverLead(c, s));
    }
    assert.equal(paint((p) => KSeat.paintSeatedAt(p, cab[1], kd, DRIVER_HIP, s, {t: 0.4})).length > 0, true);
  }
  for (const G of [770, 785, 794, 800, 812]) {
    const {s} = EDriver.B04_DRIVER(G, ECabin.RADIO_BUTTON);
    for (const c of cab) assert.equal(paint((p) => KSeat.paintSeatedAt(p, c, DRIVER, DRIVER_HIP, s, {t: 0.4})), paint((p) => EDriver.paintDriverAt(p, c, s, {t: 0.4})));
  }
  assert.deepEqual(KSeat.leftShoulderW(DRIVER_HIP, 10, 8), EDriver.leftShoulderW(DRIVER_HIP, 10, 8));
  assert.deepEqual(KSeat.reachArm([0, 1, 0], [0.4, 0.9, -0.2], [0, -1, -0.6]), EDriver.reachArm([0, 1, 0], [0.4, 0.9, -0.2], [0, -1, -0.6]));
});
