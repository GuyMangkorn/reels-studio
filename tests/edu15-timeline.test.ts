import assert from 'node:assert/strict';
import {test} from 'node:test';
import episodes from '../src/videos/edu-ep15';
import {collectEpisodes} from '../src/videos/registry';
import {SHOT_TABLE, TOTAL_FRAMES} from '../src/painted/edu15/clock';
import {paintedShots} from '../src/painted/registry';
import {EDU15_CUES} from '../src/videos/edu-ep15/cues';

// EDU-EP15-SHORT W5.3 draft: the registered video follows the R2.3 shot map and cue table.
test('EDU-EP15-SHORT: 20 scenes on the shot map, 1793 f, plates registered', () => {
  const [{videos}] = collectEpisodes([episodes]);
  const tl = videos[0].timeline;
  assert.equal(videos[0].id, 'EDU-EP15-SHORT');
  assert.equal(tl.length, 20);
  assert.equal(Math.round(tl.reduce((s, sc) => s + sc.durationSec, 0) * 30), TOTAL_FRAMES);
  SHOT_TABLE.forEach(([id, , len], i) => {
    assert.equal(Math.round(tl[i].durationSec * 30), len);
    assert.ok(paintedShots[`EDU15-${id}`], id);
  });
});

test('EDU-EP15-SHORT: captions C01-C15 + V01/V02, none for V03, every scene starts with a cue, cues do not overlap', () => {
  assert.equal(EDU15_CUES.length, 18);
  const [{videos}] = collectEpisodes([episodes]);
  assert.ok(videos[0].timeline.every((sc) => sc.subtitleCues![0].atSec === 0));
  EDU15_CUES.forEach((c, i) => { assert.ok(c.to > c.from); if (i) assert.ok(EDU15_CUES[i - 1].to <= c.from, c.id); });
  assert.ok(EDU15_CUES.every((c) => c.to <= 1700));   // V03 (f1700-1733) has no caption
});
