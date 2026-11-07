import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EDU5_CUES, EDU5_CUTS, EDU5_TOTAL} from '../src/videos/edu-ep05/shots';
import videos from '../src/videos/edu-ep05';

// EDU-EP05-SHORT W5.3 blockout: scene boundaries = review-rows.json start/end (1989 f), captions inside the shot span, ending A_fade.
const rows = JSON.parse(readFileSync('scripts/edu-series/ep05/review-rows.json', 'utf8')).shots as {id: string; start: number; end: number}[];

test('EDU-EP05-SHORT cuts match the review-rows boundaries (1989 f)', () => {
  assert.equal(EDU5_TOTAL, 1989);
  assert.equal(EDU5_CUTS.length, rows.length);
  EDU5_CUTS.forEach((c, i) => { assert.equal(c.id, rows[i].id); assert.equal(c.start, rows[i].start); assert.equal(c.end, rows[i].end); });
});
test('EDU-EP05-SHORT registers one scene per shot with a caption cue at every scene start', () => {
  const video = videos.videos[0];
  assert.equal(video.id, 'EDU-EP05-SHORT');
  assert.equal(video.ending, 'A_fade');
  assert.equal(video.chrome?.channelLabel, '@TamMaiLa');
  assert.equal(video.timeline.length, 19);
  EDU5_CUTS.forEach((c, i) => assert.equal(Math.round(video.timeline[i].durationSec * 30), c.end - c.start));
  assert.equal(video.timeline.reduce((a, s) => a + Math.round(s.durationSec * 30), 0), 1989);
});
test('EDU-EP05-SHORT caption cues are ordered, non-overlapping and end before the fade completes', () => {
  EDU5_CUES.forEach((c, i) => { assert.ok(c.to > c.from); if (i) assert.ok(c.from >= EDU5_CUES[i - 1].to); });
  assert.ok(EDU5_CUES.at(-1)!.to <= EDU5_TOTAL);
});
