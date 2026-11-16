// test-scope: shared
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {capsule, paintPovHand, type Pt} from '../src/painted/kit/hands';

const polygons = (forearmElbowScale?: number, sleeveCuffFraction?: number, crispFill?: boolean) => {
  const calls: Pt[][] = [];
  const brush = new Proxy({}, {get: (_, key) => key === 'polygon' ? (p: Pt[]) => calls.push(p) : () => undefined}) as Brush;
  paintPovHand(makePainter(brush, {t: 0, frame: 0}), {base: 100, side: 1, wrist: [0, 0], dir: 0,
    elbow: [100, 0], sleeveFrom: [200, 0], forearmElbowScale, sleeveCuffFraction, crispFill});
  return calls;
};

test('default forearm retains the original sleeve and skin polygons', () => {
  const calls = polygons();
  assert.deepEqual(calls[0], capsule([200, 0], [150, 0], 330, 300));
  assert.deepEqual(calls[10], capsule([100, 0], [0, 0], 150, 128));
});

test('opted-in forearm widens the elbow without changing wrist width', () => {
  const calls = polygons(2);
  assert.deepEqual(calls[0], capsule([32, 0], [0, 0], 128 + (300 - 128) * .32, 128));
  assert.deepEqual(calls[6], capsule([200, 0], [32, 0], 360, (128 + (300 - 128) * .32) * 1.12));
});

test('HANAKO knock and ending share the sheet elbow and settled wrist', async () => {
  const {KNOCK_ELBOW, KNOCK_DIR, knockPose, endingHandPose} = await import('../src/painted/hanako/assets');
  const {B02_ELBOW} = await import('../src/painted/hanako/plates-r4');
  assert.deepEqual(KNOCK_ELBOW, [540 + 936 * .34 / .36, 596 + 936 * .15 / .36]);
  assert.equal(KNOCK_DIR, -2.2);
  assert.deepEqual(B02_ELBOW, [1115, 1000]);
  assert.deepEqual(endingHandPose(2595)?.wrist, knockPose(0).wrist);
});

test('opted-in cuff fraction shortens exposed skin without changing default geometry', () => {
  const calls = polygons(2, .04);
  assert.deepEqual(calls[0], capsule([4, 0], [0, 0], 128 + (300 - 128) * .04, 128));
  assert.deepEqual(calls[6], capsule([200, 0], [4, 0], 360, (128 + (300 - 128) * .04) * 1.12));
});

test('crisp foreground opts into a single hard fill for each shape', () => {
  const crisp = polygons(2, .04, true);
  const repeated = polygons(2, .04);
  assert.deepEqual(crisp[0], repeated[0]);
  assert.ok(crisp.length < repeated.length);
});
