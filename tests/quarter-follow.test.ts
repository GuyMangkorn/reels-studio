import {test} from 'node:test';
import assert from 'node:assert/strict';
import {quarterDegAt, viewAtCam} from '../src/painted/kit/figure-at';
import {quarterGeo, quarterLate} from '../src/painted/kit/quarter';
import type {YCam} from '../src/painted/kit/ycam';

// KIT-VIEW-AUDIT VA04 (13 Nov 2026): `quarterFollow` turns the three-quarter view by the real camera angle instead of a fixed 45.
const orbit = (deg: number): YCam => {
  const az = (deg * Math.PI) / 180;
  return {x: 4 * Math.sin(az), y: 0.85, z: 4 * Math.cos(az), yaw: -az, pitch: 0, f: 800, hy: 960, cx: 0};
};

test('quarterDegAt is the angle off the front, held to 15..75, the same on both sides', () => {
  assert.equal(quarterDegAt(30), 30);
  assert.equal(quarterDegAt(330), 30);
  assert.equal(quarterDegAt(66), 66);
  assert.equal(quarterDegAt(80), 75);
  assert.equal(quarterDegAt(200), 75);
  assert.equal(quarterDegAt(10), 15);
});

test('quarterFollow (default on): 30 and 60 deg orbit cells differ; off they are both 45', () => {
  const o = {at: [0, 0, 0] as [number, number, number], facing: [0, 1] as [number, number]};
  const a = viewAtCam(orbit(30), {...o, quarterFollow: true}), b = viewAtCam(orbit(60), {...o, quarterFollow: true});
  assert.ok(a.quarter && b.quarter && a.quarter === b.quarter);
  assert.ok(Math.abs((a.quarterDeg ?? 0) - 30) < 1 && Math.abs((b.quarterDeg ?? 0) - 60) < 1);
  assert.equal(viewAtCam(orbit(30), o).quarterDeg, a.quarterDeg);
  assert.equal(viewAtCam(orbit(30), {...o, quarterFollow: false}).quarterDeg, 45);
  assert.equal(viewAtCam(orbit(60), {...o, quarterFollow: false}).quarterDeg, 45);
  assert.equal(viewAtCam(orbit(0), {...o, quarterFollow: true}).quarterDeg, undefined);
});

// Orbit turn (13 Nov 2026): with the cues on, the three-quarter runs on to 75 deg and the cut to the profile sits at 82.5 deg, a 15 deg
// step instead of the 30 deg jump from 60 at 67.5; the back three-quarter the same toward the back. VIEW_CUES_OFF keeps the old sectors.
test('orbit turn: three-quarter to 75 deg, profile from 82.5 deg, front and back; cues off unchanged', () => {
  const o = {at: [0, 0, 0] as [number, number, number], facing: [0, 1] as [number, number]};
  const at = (deg: number, off = false) => viewAtCam(orbit(deg), off ? {...o, quarterFollow: false, backQuarter: false} : o);
  for (const d of [75, 80]) assert.ok(at(d).quarter && Math.abs((at(d).quarterDeg ?? 0) - 75) < 1, `front quarter at ${d}`);
  for (const d of [85, 90, 95]) assert.equal(at(d).quarter, undefined, `profile at ${d}`);
  for (const d of [100, 105]) assert.ok(at(d).quarter && Math.abs((at(d).quarterDeg ?? 0) - 75) < 1, `back quarter at ${d}`);
  assert.equal(at(70, true).quarter, undefined);
  assert.equal(at(60, true).quarterDeg, 45);
});

test('late turn: 0 up to 60 deg (the approved drawing), 1 at 75, carried on quarterGeo', () => {
  assert.equal(quarterLate(45), 0);
  assert.equal(quarterLate(60), 0);
  assert.equal(quarterLate(-75), 1);
  assert.ok(quarterLate(67.5) > 0.4 && quarterLate(67.5) < 0.6);
  assert.equal(quarterGeo({quarter: 'left', quarterDeg: 45})!.late, 0);
  assert.equal(quarterGeo({quarter: 'right', quarterDeg: 75})!.late, 1);
});
