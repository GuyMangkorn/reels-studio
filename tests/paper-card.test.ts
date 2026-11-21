import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Pt} from '../src/painted/kit/painter';
import {cardOutline, recordingPainter, traceOutline} from '../src/painted/kit/paper-card';

// Kit paper cut-out card (EDU-EP32 VD32-01): the traced outline grows the drawing by the cut margin, follows the recorder's transforms and is
// cut straight at the foot line.
const ext = (o: Pt[]) => ({x0: Math.min(...o.map((q) => q[0])), x1: Math.max(...o.map((q) => q[0])), y0: Math.min(...o.map((q) => q[1])), y1: Math.max(...o.map((q) => q[1]))});

test('traceOutline grows a square by the margin (within one cell)', () => {
  const o = traceOutline({polys: [[[100, 100], [200, 100], [200, 300], [100, 300]]], lines: []}, 7);
  const e = ext(o);
  for (const [v, want] of [[e.x0, 93], [e.x1, 207], [e.y0, 93], [e.y1, 307]] as const) assert.ok(Math.abs(v - want) <= 3, `${v} vs ${want}`);
});

test('recordingPainter follows push/translate/scale like the brush', () => {
  const r = recordingPainter();
  r.p.brush.push();
  r.p.brush.translate(50, 0);
  r.p.brush.scale(2, 1);
  r.p.brush.polygon([[0, 0], [10, 0], [10, 10]]);
  r.p.brush.pop();
  r.p.brush.polygon([[0, 0], [1, 0], [1, 1]]);
  assert.deepEqual(r.shapes.polys[0], [[50, 0], [70, 0], [70, 10]]);
  assert.deepEqual(r.shapes.polys[1], [[0, 0], [1, 0], [1, 1]]);
});

test('cardOutline is cut flat at the foot line', () => {
  const o = cardOutline((q) => q.flat('#000000', [[0, 0], [40, 0], [40, 80], [0, 80]]), 6, 80);
  assert.ok(Math.abs(ext(o).y1 - 80) < 1e-6);
  assert.ok(o.filter((q) => Math.abs(q[1] - 80) < 1e-6).length >= 2);
});
