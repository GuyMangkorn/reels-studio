import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EDU4_SHOTS, EDU4_TOTAL, G1, G2, G3, measureOf, plateOf} from '../src/painted/edu04/shots';
import {paintedShots} from '../src/painted/registry';
import videos from '../src/videos/edu-ep04';

// EDU-EP04-SHORT W5.2: scene boundaries = review-rows.json start/end, one registry plate per shot, G1 built.
const rows = JSON.parse(readFileSync('scripts/edu-series/ep04/review-rows.json', 'utf8')).shots as {id: string; start: number; end: number}[];

test('EDU-EP04-SHORT shots match the review-rows boundaries (1657 f)', () => {
  assert.equal(EDU4_TOTAL, 1657);
  assert.equal(EDU4_SHOTS.length, rows.length);
  let at = 0;
  EDU4_SHOTS.forEach(([id, n], i) => { assert.equal(id, rows[i].id); assert.equal(at, rows[i].start); assert.equal(at + n, rows[i].end); at += n; });
});
test('EDU-EP04-SHORT registers one plate and one scene per shot; G1, G2 and G3 plates are built', () => {
  const video = videos.videos[0];
  assert.equal(video.id, 'EDU-EP04-SHORT');
  assert.equal(video.timeline.length, 20);
  EDU4_SHOTS.forEach(([id, n], i) => {
    assert.ok(paintedShots[`EDU4-${id}`]);
    assert.equal(Math.round(video.timeline[i].durationSec * 30), n);
    assert.equal(plateOf(id, 0).built, G1.includes(id) || G2.includes(id) || G3.includes(id));
  });
});
test('EDU-EP04-SHORT G1 frames are seekable and keep MAN in the picture', () => {
  for (const id of [...G1, ...G3]) for (const f of [0, EDU4_SHOTS.find(([s]) => s === id)![1] - 1]) assert.doesNotThrow(() => measureOf(id, f));
  assert.ok(measureOf('S01-B01-SH01', 55)!.x > 0);
});
