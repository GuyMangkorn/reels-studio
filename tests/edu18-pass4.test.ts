import assert from 'node:assert/strict';
import {test} from 'node:test';
import {STREAM_N, streamGY, streamNY} from '../src/painted/edu18/macro';
import {OT02_LINES, LBL_L} from '../src/painted/edu18/labels';
import {wander21} from '../src/painted/edu18/shots';

test('SH09 streaming (D4-09): at least 5 near motes in frame every frame, 38-75 px/f, guide drops 24 px/f', () => {
  for (let L = 0; L <= 82; L++) assert.ok(STREAM_N.filter((m, i) => { const y = streamNY(i, L); return y + m.r > 0 && y - m.r < 1920; }).length >= 5, `frame +${L}`);
  STREAM_N.forEach((m) => assert.ok(m.v >= 38 && m.v <= 75 && 2 * m.r >= 20 && 2 * m.r <= 60));
  assert.equal(streamGY(0, 0) - streamGY(0, 30), 720);
});
test('OT02 sits in the left slot LBL-L as three lines (D4-03)', () => {
  assert.deepEqual([...OT02_LINES], ['เม็ดใหญ่สุด', 'หนักได้ถึง', '50 เท่าของยุง']);
  assert.ok(LBL_L.x === 48 && LBL_L.x + LBL_L.w <= 330 && LBL_L.y === 236);
});
test('SH21 wander is zero before +72 and bounded by 10 x 6 px (D4-21)', () => {
  assert.ok(wander21(71).every((v) => v === 0));
  for (let L = 72; L <= 129; L++) { const [x, y] = wander21(L); assert.ok(Math.abs(x) <= 10.01 && Math.abs(y) <= 6.01); }
});
