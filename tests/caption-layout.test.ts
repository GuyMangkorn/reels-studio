import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  CAPTION_SAFE_BOTTOM, DEFAULT_SHADE_CENTRE_Y, captionBlock, captionLineHeight, centerFromBottomEdge, maxSafeLines, shadeBandStops, shadePlateauCentre,
} from '../src/scenes/captionLayout';
import {validateVideoStyle} from '../src/scenes/media';

// Caption text vs shade band centring (EG-EP02 Draft r1, 3 Nov 2026). The text block is centred on `centerY`, the shade band on the same y.
test('1-, 2- and 3-line cues all share one vertical centre (the shade centre)', () => {
  for (const lines of [1, 2, 3]) {
    const b = captionBlock(1214, lines);
    assert.equal((b.top + b.bottom) / 2, 1214, `${lines} lines`);
    assert.ok(Math.abs(b.height - lines * captionLineHeight(true)) < 1e-9);
  }
});

test('regression: a bottom-edge anchor put a 1-line cue 42 px below the band centre, centre anchor does not', () => {
  const lineH = captionLineHeight(true);
  const bottomEdge = 1248, band = DEFAULT_SHADE_CENTRE_Y;
  const oneLineCentre = bottomEdge - lineH / 2, twoLineCentre = bottomEdge - lineH;
  assert.ok(Math.abs(oneLineCentre - band - lineH / 2) < 0.5 && lineH / 2 > 40, 'old layout: 1-line cue offset = half a line');
  assert.ok(Math.abs(twoLineCentre - band) < 0.5, 'old layout only centred the 2-line cue');
  assert.ok(Math.abs(centerFromBottomEdge(1248) - band) < 0.5);
});

test('the shade plateau is centred on the text centre (within 1 px) and shifts with it', () => {
  for (const c of [DEFAULT_SHADE_CENTRE_Y, 1214]) assert.ok(Math.abs(shadePlateauCentre(c) - c) <= 1, `centre ${c}`);
  assert.deepEqual(shadeBandStops(DEFAULT_SHADE_CENTRE_Y), [990, 1080, 1250, 1330], 'default band unchanged for existing episodes');
  assert.deepEqual(shadeBandStops(1214), [1040, 1130, 1300, 1380]);
});

test('EG-EP02 centre 1214 (captions 50 px lower): 2 lines end at y 1298, 3 lines still inside the safe limit', () => {
  assert.ok(Math.abs(captionBlock(1214, 2).bottom - (1248 + 50)) < 0.5);
  assert.ok(captionBlock(1214, 3).bottom <= CAPTION_SAFE_BOTTOM, `${captionBlock(1214, 3).bottom}`);
  assert.equal(maxSafeLines(1214), 3);
});

test('captionStyle.centerY is validated', () => {
  assert.throws(() => validateVideoStyle({captionStyle: {centerY: -5}}, 'X-1'), /centerY/);
  assert.doesNotThrow(() => validateVideoStyle({captionStyle: {centerY: 1214}}, 'X-1'));
});
