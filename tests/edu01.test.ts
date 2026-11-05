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
test('EDU-EP01-SHORT seam: B08 last frame and B01 f0 share the screen layers; the loop blend leaves frame 0 ink to the last frame', () => {
  const end = plateOf('S01-B08-SH01', 113), start = plateOf('S01-B01-SH01', 0);
  for (const k of ['spot', 'dim', 'flash', 'warm', 'grade', 'paper'] as const) assert.deepEqual(end[k], start[k], k);
  assert.equal(paintedShots['EDU1-S01-B01-SH01']?.loopExact, true);
});

// W5.3: narration, captions (script Sub text, none for the silent fall/freeze/jolt f490-579), the tag, sound stem.
test('EDU-EP01-SHORT W5.3 carries narration, captions without text in f490-579, the tag on B03-SH02..SH04 and the sound stem', () => {
  const video = videos.videos[0];
  assert.equal(video.narration?.src, 'narration/EDU-EP01-SHORT.wav');
  assert.equal(video.narration?.amplitude.length, 1860);
  assert.equal(video.audio?.length, 1);
  let at = 0;
  video.timeline.forEach((scene, i) => {
    const id = EDU1_SHOTS[i][0];
    const texts = (scene.subtitleCues ?? []).map((c) => c.text);
    if (at >= 490 && at < 579) assert.equal(texts.filter(Boolean).length, 0, `${id} has no caption`);
    assert.equal(scene.painted!.shots[0].label, ['S01-B03-SH02', 'S01-B03-SH03', 'S01-B03-SH04'].includes(id) ? 'ภาพจำลอง' : undefined, id);
    at += EDU1_SHOTS[i][1];
  });
});
