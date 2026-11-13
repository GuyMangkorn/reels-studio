import {test} from 'node:test';
import assert from 'node:assert/strict';
import {quarterDegAt, viewAtCam} from '../src/painted/kit/figure-at';
import type {YCam} from '../src/painted/kit/ycam';

// KIT-VIEW-AUDIT VA04 (13 Nov 2026): `quarterFollow` turns the three-quarter view by the real camera angle instead of a fixed 45.
const orbit = (deg: number): YCam => {
  const az = (deg * Math.PI) / 180;
  return {x: 4 * Math.sin(az), y: 0.85, z: 4 * Math.cos(az), yaw: -az, pitch: 0, f: 800, hy: 960, cx: 0};
};

test('quarterDegAt is the angle off the front, held to 15..60, the same on both sides', () => {
  assert.equal(quarterDegAt(30), 30);
  assert.equal(quarterDegAt(330), 30);
  assert.equal(quarterDegAt(66), 60);
  assert.equal(quarterDegAt(10), 15);
});

test('quarterFollow: 30 and 60 deg orbit cells differ; off they are both 45', () => {
  const o = {at: [0, 0, 0] as [number, number, number], facing: [0, 1] as [number, number]};
  const a = viewAtCam(orbit(30), {...o, quarterFollow: true}), b = viewAtCam(orbit(60), {...o, quarterFollow: true});
  assert.ok(a.quarter && b.quarter && a.quarter === b.quarter);
  assert.ok(Math.abs((a.quarterDeg ?? 0) - 30) < 1 && Math.abs((b.quarterDeg ?? 0) - 60) < 1);
  assert.equal(viewAtCam(orbit(30), o).quarterDeg, 45);
  assert.equal(viewAtCam(orbit(60), o).quarterDeg, 45);
  assert.equal(viewAtCam(orbit(0), {...o, quarterFollow: true}).quarterDeg, undefined);
});
