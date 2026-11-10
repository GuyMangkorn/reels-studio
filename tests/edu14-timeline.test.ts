import assert from 'node:assert/strict';
import {test} from 'node:test';
import episodes from '../src/videos/edu-ep14';
import {collectEpisodes} from '../src/videos/registry';
import {SHOT_TABLE, TOTAL_FRAMES} from '../src/painted/edu14/clock';
import {paintedShots} from '../src/painted/registry';
import {EDU14_CUES} from '../src/videos/edu-ep14/cues';

// EDU-EP14-SHORT W5.3 draft: the registered video follows the R4.1 shot map and cue table.
test('EDU-EP14-SHORT: 21 scenes on the shot map, 1815 f, plates registered', () => {
  const [{videos}] = collectEpisodes([episodes]);
  const tl = videos[0].timeline;
  assert.equal(videos[0].id, 'EDU-EP14-SHORT');
  assert.equal(tl.length, 21);
  assert.equal(Math.round(tl.reduce((s, sc) => s + sc.durationSec, 0) * 30), TOTAL_FRAMES);
  SHOT_TABLE.forEach(([id, , len], i) => {
    assert.equal(Math.round(tl[i].durationSec * 30), len);
    assert.ok(paintedShots[`EDU14-${id}`], id);
  });
});

test('EDU-EP14-SHORT: captions C01-C20, none for V02 or the W700 slot, every scene starts with a cue', () => {
  assert.equal(EDU14_CUES.length, 20);
  const [{videos}] = collectEpisodes([episodes]);
  const tl = videos[0].timeline;
  assert.ok(tl.every((sc) => sc.subtitleCues![0].atSec === 0));
  assert.ok(EDU14_CUES.every((c) => c.to > c.from && (c.to <= 535 || c.from >= 565) && (c.to <= 1745 || c.from > 1760)));
  assert.equal(EDU14_CUES.find((c) => c.id === 'C09')!.to, 674);
});

test('EDU-EP14 caption patch: strengths name real shots (0..0.45) and the patch rectangle follows the caption lines', async () => {
  const {CALM} = await import('../src/painted/edu14/frame');
  const {quietRect, quietOpacity, QUIET} = await import('../src/painted/edu14/look');
  const ids = new Set<string>(SHOT_TABLE.map(([id]) => id));
  for (const [id, k] of Object.entries(CALM)) assert.ok(ids.has(id) && k! >= 0 && k! <= 0.45, `${id}: ${k}`);
  const w = (line: string) => line.length * 30;
  const one = quietRect('abcdefghij', w), two = quietRect('abcdefghij\nabcde', w);
  assert.equal(one.w, two.w);                                   // width follows the widest line
  assert.ok(Math.abs(two.h - one.h - 51 * 1.65) < 1e-6);          // height follows the line count
  assert.equal(one.y + one.h, 1344 + QUIET.pad);                  // bottom edge stays on the caption's bottom edge (+ padding)
  assert.equal(quietOpacity(100, 100, 200), 1);
  assert.ok(quietOpacity(98, 100, 200) < 1 && quietOpacity(98, 100, 200) > 0 && quietOpacity(90, 100, 200) === 0 && quietOpacity(200, 100, 200) === 0);
});
