// EDU-EP32 Space D real (VD32-23/24; Boss W3 gate LF04, 2026-11-21): memo placement, mirror camera, cat occlusion hole.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {camPoint} from '../src/painted/kit/ycam';
import {CAM_B01_KEY, CAM_B06_KEY, CAT_DESK, MEMO_STAMP, OFFICE_LOOKS, catHole, memoPt} from '../src/painted/edu32/office';
import {MEASURE} from '../src/painted/edu32/looks';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});

test('memo yaw +8 puts the stamp at the storyboard world point (+0.42, 0, +0.26)', () => {
  const [x, , z] = memoPt(MEMO_STAMP.x, MEMO_STAMP.z);
  assert.ok(Math.abs(x - 0.42) < 0.01 && Math.abs(z - 0.26) < 0.01, `${x} ${z}`);
});

test('B06-SH02 key camera = B01-SH03 key camera relative to its cat x4 (VD32-24)', () => {
  const b01Cat = [0.3, 0, -0.2];
  assert.ok(Math.abs((CAM_B06_KEY.x - CAT_DESK[0]) - 4 * (CAM_B01_KEY.x - b01Cat[0])) < 1e-9);
  assert.ok(Math.abs(CAM_B06_KEY.y - 4 * CAM_B01_KEY.y) < 1e-9);
  assert.ok(Math.abs((CAM_B06_KEY.z - CAT_DESK[2]) - 4 * (CAM_B01_KEY.z - b01Cat[2])) < 1e-9);
  for (const k of ['yaw', 'pitch', 'f', 'hy'] as const) assert.equal(CAM_B06_KEY[k], CAM_B01_KEY[k]);
});

test('LF04 and LF04-REF paint; cat and stamp stay above the caption band (y 860)', () => {
  for (const id of ['LF04', 'LF04-REF']) OFFICE_LOOKS[id]().paint(noop());
  const real = MEASURE.LF04[0], paper = MEASURE['LF04-REF'][0];
  assert.ok(real.bottom < 860 && paper.bottom < 860);
  assert.ok(Math.abs(real.h - paper.h) / paper.h < 0.08, `${real.h} vs ${paper.h}`);
  assert.ok(camPoint(CAM_B06_KEY, memoPt(MEMO_STAMP.x, MEMO_STAMP.z + MEMO_STAMP.h / 2))![1] < 860);
  const hole = catHole(CAM_B06_KEY)!;
  assert.ok(hole.length > 4 && hole.every(([px, py]) => Number.isFinite(px) && Number.isFinite(py)));
});
