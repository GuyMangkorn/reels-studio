import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EDU1_SHOTS, EDU1_TOTAL, plateOf} from '../src/painted/edu01/plates';
import {paintedShots} from '../src/painted/registry';
import videos from '../src/videos/edu-ep01';

// EDU-EP01-SHORT W5.2: timeline scene boundaries = review-rows.json start/end, one registry plate per shot.
const rows = JSON.parse(readFileSync('scripts/edu-series/short/review-rows.json', 'utf8')).shots as {id: string; start: number; end: number}[];

test('EDU-EP01-SHORT has the sheet shots with the review-rows boundaries', () => {
    assert.equal(EDU1_TOTAL, 1860);
    assert.equal(EDU1_SHOTS.length, rows.length);
    let at = 0;
    EDU1_SHOTS.forEach(([id, n], i) => {
      assert.equal(id, rows[i].id);
      assert.equal(at, rows[i].start);
      assert.equal(at + n, rows[i].end);
      at += n;
    });
  });
test('EDU-EP01-SHORT registers one plate and one scene per shot', () => {
    const video = videos.videos[0];
    assert.equal(video.id, 'EDU-EP01-SHORT');
    assert.equal(video.timeline.length, 23);
    EDU1_SHOTS.forEach(([id, n], i) => {
      assert.ok(paintedShots[`EDU1-${id}`]);
      assert.equal(Math.round(video.timeline[i].durationSec * 30), n);
      assert.doesNotThrow(() => plateOf(id, 0));
    });
  });
test('EDU-EP01-SHORT ends on the seam state: B08 last frame camera = B01 first frame camera', () => {
    assert.deepEqual(plateOf('S01-B08-SH01', 113).cam, plateOf('S01-B01-SH01', 0).cam);
  });
