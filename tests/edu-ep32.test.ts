import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import videos from '../src/videos/edu-ep32/index';
import {CAPTION_END, EDU32_CARDS, captionPose32} from '../src/videos/edu-ep32/captions32';
import {EDU32_SHOTS} from '../src/videos/edu-ep32/shots32';
import {labelOpacity, shadeCuesOf, shadeStrengthAt} from '../src/videos/edu-ep32/chrome-data';

// EDU-EP32-SHORT W5.3 draft composition (Editor, 21 Nov 2026): 1689 f, 19 shots, 55 caption cards in the EP26 look, 51 sound cues, label G0-G89 fading to G97.
const main = videos.videos.find((v) => v.id === 'EDU-EP32-SHORT')!;
const sheet = JSON.parse(readFileSync('scripts/edu-series/ep32/sound-cues.json', 'utf8'));

test('timeline is 1689 f at 30 fps in 19 scenes that match the shot table', () => {
  assert.equal(main.timeline.length, 19);
  assert.equal(Math.round(main.timeline.reduce((s, sc) => s + sc.durationSec, 0) * 30), 1689);
  assert.deepEqual(main.timeline.map((sc) => Math.round(sc.durationSec * 30)), EDU32_SHOTS.map((s) => s.len));
  assert.equal(sheet.durationFrames, 1689);
});

test('caption cards: contiguous from G0 to G1647, at least 15 f, one line, widths inside the caption-safe box', () => {
  assert.equal(EDU32_CARDS.length, 55);
  assert.equal(EDU32_CARDS[0].from, 0);
  assert.equal(EDU32_CARDS.at(-1)!.to, CAPTION_END);
  EDU32_CARDS.forEach((c, i) => {
    assert.ok(c.to - c.from >= 15, `${c.id} shorter than 15 f`);
    assert.ok(!c.text.includes('\n'), `${c.id} is not one line`);
    if (i) assert.equal(c.from, EDU32_CARDS[i - 1].to, `${c.id} not contiguous`);
    // width units (sheet): 1 per Thai base glyph, 1.6 per Latin letter or digit, 0.5 per space or "…", 0.8 per quote. A centred card may be 696 px wide (x120-888 about the 540 centre):
    // measured 38.6-40.4 px per unit on the rendered stills (widest 666 px), so 17.5 units keeps every card under 696 px.
    const units = [...c.text].reduce((s, ch) => s + (/[ัิ-ฺ็-๎]/.test(ch) ? 0 : /[A-Za-z0-9]/.test(ch) ? 1.6 : /[ …]/.test(ch) ? 0.5 : /["“”]/.test(ch) ? 0.8 : 1), 0);
    assert.ok(units <= 17.5, `${c.id} is ${units} units wide`);
  });
  assert.equal(captionPose32(CAPTION_END), null);
  assert.equal(captionPose32(1688), null, 'the stamp insert has no caption');
  assert.deepEqual([captionPose32(0)!.opacity, captionPose32(0)!.dy], [1, 0]);
});

test('timeline captions are data (preset none) and the shade cues clip to the shot', () => {
  assert.equal(main.captionStyle?.preset, 'none');
  assert.equal(shadeCuesOf(1651, 38).length, 0);
  assert.equal(shadeCuesOf(574, 72)[0][0], 0, 'L05c runs across the cut: the bridge opens already shaded');
  assert.ok(shadeStrengthAt('B03-SH01', 574) > shadeStrengthAt('B03-SH01', 600), 'the bridge shade eases down from G574');
});

test('story label is full G0-G89, fades over G90-G97 and is gone from G98', () => {
  assert.equal(labelOpacity(0), 1);
  assert.equal(labelOpacity(89), 1);
  assert.ok(labelOpacity(90) < 1 && labelOpacity(90) > labelOpacity(97) && labelOpacity(97) > 0);
  assert.equal(labelOpacity(98), 0);
  assert.equal(labelOpacity(1688), 0);
});

test('sound: 51 cues, stem baked from the sheet, no cue past the end', () => {
  assert.equal(sheet.cues.length, 51);
  assert.ok(sheet.cues.every((c: {frame: number; durationFrames: number}) => c.frame >= 0 && c.frame + c.durationFrames <= 1689 + 1));
  assert.deepEqual(main.audio?.map((a) => a.src), ['audio/edu/EDU-EP32-SHORT-draft-stem-v1.wav']);
  assert.equal(main.narration?.src, 'narration/EDU-EP32-SHORT-narration-v1.wav');
});
