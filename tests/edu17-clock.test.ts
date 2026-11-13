import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SHOT_TABLE, TOTAL_FRAMES, shotAt} from '../src/videos/edu-ep17/clock';
import {EDU17_CUES} from '../src/videos/edu-ep17/cues';

// EDU-EP17-SHORT shot map (ROWS-R2.4): 22 contiguous shots covering 1561 f, and captions inside the film.
test('shot table is contiguous, 22 shots, 1561 f', () => {
  assert.equal(SHOT_TABLE.length, 22);
  let at = 0;
  for (const [, start, len] of SHOT_TABLE) {
    assert.equal(start, at);
    assert.ok(len > 0);
    at += len;
  }
  assert.equal(at, TOTAL_FRAMES);
});

test('shotAt maps every frame to its shot and local frame', () => {
  assert.equal(shotAt(0)?.no, 1);
  assert.equal(shotAt(396)?.no, 6);
  assert.equal(shotAt(397)?.no, 7);
  assert.equal(shotAt(1560)?.id, SHOT_TABLE[21][0]);
  assert.equal(shotAt(TOTAL_FRAMES), undefined);
});

test('caption cues are ordered and inside the film', () => {
  let prev = 0;
  for (const c of EDU17_CUES) {
    const [from, to] = [c.from, c.to];
    assert.ok(from >= prev, `${c.id} starts after the previous cue`);
    assert.ok(to > from && to <= TOTAL_FRAMES, `${c.id} range`);
    prev = from;
  }
});
