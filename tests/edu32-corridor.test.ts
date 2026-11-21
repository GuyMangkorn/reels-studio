// EDU-EP32 Space C corridor (VD32-22; Boss W3 gate LF05, 2026-11-21; rebuilt at the R3 keys, G5): door span on the R3 key, the dark gap at the
// latch side, the sign above the caption band, the leaf and card clip at the latch-side jamb, the shut door leaves no gap, the bowl paints.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {camPoint} from '../src/painted/kit/ycam';
import {CAM_B04_SH02, CORRIDOR, CORRIDOR_LOOKS, CORRIDOR_MEASURE, LEAF_W, LF05_AJAR, SIGN, clipLinear, leafPt, leafVisS, signClipCss, signCorners, signVisible} from '../src/painted/edu32/corridor';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});

test('LF05 (R3 start key): door y about 470-1162 (R3 proj 510-1162), whole sign shows above y 1000, a dark gap at the latch side', () => {
  CORRIDOR_LOOKS.LF05().paint(noop());
  const m = CORRIDOR_MEASURE.LF05;
  assert.ok(Math.abs(m.doorTop - 490) < 40 && Math.abs(m.doorBottom - 1162) < 15, JSON.stringify(m));
  assert.ok(m.signClipped === 0 && m.signBottom < 1000 && m.signX1 - m.signX0 > 50, JSON.stringify(m));
  assert.ok(m.gapPx > 25, `gap ${m.gapPx}`);
});

test('the R3 key stands on the latch side: at 40 deg the leaf slides behind the jamb (no gap), at the start state it clears it', () => {
  assert.ok(leafVisS(CAM_B04_SH02, (40 * Math.PI) / 180) < LEAF_W);
  assert.ok(leafVisS(CAM_B04_SH02, LF05_AJAR) >= LEAF_W);
  assert.ok(signVisible(CAM_B04_SH02, (40 * Math.PI) / 180).clipped);
  assert.equal(signVisible(CAM_B04_SH02, 0).clipped, false);
  assert.equal(signClipCss(CAM_B04_SH02, 0, 2, 0, 1000), null);
  assert.match(signClipCss(CAM_B04_SH02, (40 * Math.PI) / 180, 2, 0, 1000) ?? '', /^polygon\(/);
});

test('clipLinear keeps the half-plane and marks the cut points', () => {
  const k = clipLinear([[0, 0], [2, 0], [2, 1], [0, 1]], (q) => 1 - q[0]);
  assert.deepEqual(k.pts, [[0, 0], [1, 0], [1, 1], [0, 1]]);
  assert.deepEqual(k.cut, [false, true, true, false]);
});

test('shut door (ajar 0): the leaf face spans the opening just behind the wall face, so no gap shows', () => {
  const [hx, , hz] = leafPt(0, 0, 1), [ex, , ez] = leafPt(0, LEAF_W, 1);
  assert.ok(hz < 0 && hz > -CORRIDOR.wall && Math.abs(ez - hz) < 1e-9);
  assert.ok(hx <= CORRIDOR.door.x0 + 0.02 && ex >= CORRIDOR.door.x1 - 0.02);
});

test('sign card stays on the leaf plane (0.012 m off it) for any swing; lift moves only the bottom edge', () => {
  for (const sw of [-14, 0, 3, 14]) for (const [x, , z] of signCorners(LF05_AJAR, sw)) {
    const [hx, , hz] = leafPt(LF05_AJAR, 0, 0), n = [Math.sin(LF05_AJAR), Math.cos(LF05_AJAR)];
    assert.ok(Math.abs((x - hx) * n[0] + (z - hz) * n[1] - SIGN.off) < 1e-9);
  }
  const a = signCorners(0, 2, 0), b = signCorners(0, 2, 0.03);
  assert.deepEqual(a[0], b[0]);
  assert.ok(Math.abs(b[2][2] - a[2][2] - 0.03) < 1e-9);
  assert.ok(signCorners(LF05_AJAR, 3).every((v) => camPoint(CAM_B04_SH02, v)));
});

test('LF05-BOWL (R3 end key, hy 880) paints the steel bowl in front of the shut door, above the caption band', () => {
  CORRIDOR_LOOKS['LF05-BOWL']().paint(noop());
  const b = CORRIDOR_MEASURE['LF05-BOWL'];
  assert.ok(b.bowlW > 150 && b.bowlW < 260 && b.bowlTop > 850 && b.bowlBottom < 1200, JSON.stringify(b));
});
