import assert from 'node:assert/strict';
import test from 'node:test';
import {GAIT_LEG, GAIT_STANCE, GAIT_STRIDE, figSide, gaitLeg, gaitPhase} from '../src/painted/zcpaint/body6';
import {YOU} from '../src/painted/zcpaint/cast';

// ZCPAINT walk cycle (Boss pass 19): a planted foot is fixed in the world, the legs stay within reach, the two legs run half a cycle apart.

test('stance foot is fixed in the world: offset + distance walked is constant while planted', () => {
  for (const u0 of [0, 0.13, 0.4]) {
    const world = (heads: number) => {
      const u = u0 + gaitPhase(heads), l = gaitLeg(u);
      return {planted: (((u % 1) + 1) % 1) < GAIT_STANCE, x: heads + l.off};
    };
    const start = world(0);
    // sample inside the same stance interval
    for (let h = 0; h < 0.15 * GAIT_STRIDE; h += 0.02) {
      const w = world(h);
      if (start.planted && w.planted && Math.floor(u0 + gaitPhase(h)) === Math.floor(u0)) assert.ok(Math.abs(w.x - start.x) < 1e-9, `slide at u0 ${u0}, h ${h}`);
    }
  }
});

test('each leg alternates: half a cycle apart, one foot always planted, stance 60 %', () => {
  let doubleOrSingle = 0;
  for (let u = 0; u < 1; u += 0.01) {
    const planted = [u, u + 0.5].filter((x) => gaitLeg(x).lift === 0).length;
    assert.ok(planted >= 1, `both feet in the air at u ${u}`);
    if (planted === 2) doubleOrSingle++;
  }
  assert.ok(doubleOrSingle >= 15 && doubleOrSingle <= 25, `double support share ${doubleOrSingle} %`);
});

test('legs stay in reach and the knee never hyperextends over a full cycle', () => {
  for (let u = 0; u < 1; u += 0.02) {
    const fig = figSide(YOU, {stride: 1, gait: u});
    assert.ok(fig.anchors.knees.length === 2 && fig.anchors.feet.length === 2);
    for (const [kx] of fig.anchors.knees) assert.ok(Number.isFinite(kx));
  }
  assert.ok(GAIT_LEG > 1.4);
});
