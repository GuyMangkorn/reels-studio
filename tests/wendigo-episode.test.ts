import {test} from 'node:test';
import assert from 'node:assert/strict';
import {paintedShots} from '../src/painted/registry';
import {timelineFrames, sceneFrames, validateTimeline} from '../src/scenes/timeline';
import {WDG_SHOTS, WDG_FRAMES, WDG_FPS} from '../src/painted/wendigo/timed';
import {CAPTIONS, SHOT_ORDER, cuesOf, wendigoTimeline} from '../src/videos/wendigo/episode';
import {chromeAt} from '../src/videos/wendigo/chrome';

// WDG-EP01-SHORT assembly (Editor): mapping, caption frames, the SH03 ruling, chrome frames.

test('20 scenes, one per shot, tiling 2861 frames in order, each on its WDG-<shot ID> plate', () => {
  const tl = wendigoTimeline();
  assert.equal(tl.length, 20);
  assert.equal(timelineFrames(tl, WDG_FPS), WDG_FRAMES);
  let at = 0;
  SHOT_ORDER.forEach((shot, i) => {
    assert.equal(at, WDG_SHOTS[shot].g, shot);
    assert.equal(tl[i].painted?.shots[0].shot, `WDG-${shot}`);
    assert.ok(Object.hasOwn(paintedShots, `WDG-${shot}`), shot);
    at += sceneFrames(tl[i].durationSec, WDG_FPS);
  });
  assert.equal(at, WDG_FRAMES);
  validateTimeline(tl, WDG_FPS);
});

test('only S03-B01-SH03 dissolves, over 7 frames', () => {
  const dissolves = wendigoTimeline().flatMap((s, i) => s.painted!.shots[0].dissolveSec ? [[SHOT_ORDER[i], Math.round(s.painted!.shots[0].dissolveSec! * WDG_FPS)]] : []);
  assert.deepEqual(dissolves, [['S03-B01-SH03', 7]]);
});

test('every caption lies inside the shot cues, in order, without overlap', () => {
  let last = 0;
  for (const [from, to, text] of CAPTIONS) { assert.ok(from >= last, text); assert.ok(to > from, text); assert.ok(to <= WDG_FRAMES, text); last = to; }
  for (const shot of SHOT_ORDER) { const c = cuesOf(shot); assert.equal(c[0].atSec, 0); assert.ok(c.every((x, i) => i === 0 || x.atSec > c[i - 1].atSec)); }
  assert.equal(cuesOf('S01-B03-SH05').every((c) => c.text === ''), true); // silent shot, no caption
  assert.equal(cuesOf('S01-B02-SH03').every((c) => c.text === ''), true);
});

test('S03-B01-SH03 carries only the narration text: no word of the silhouette ruling (fact-check, Boat)', () => {
  const banned = ['ผู้ต้องโทษ', 'นักโทษ', 'ตะแลงแกง', 'ลานประหาร', 'เชือก', 'Fort Saskatchewan', 'สวิฟต์', 'รันเนอร์', 'ภาพจริง', 'ภาพถ่ายจริง', '1879'];
  const text = cuesOf('S03-B01-SH03').map((c) => c.text).join('|');
  assert.equal(text, '|แต่ศาลตัดสินประหารชีวิตเขา|');
  for (const w of banned) assert.ok(!text.includes(w), w);
  assert.equal(chromeAt(2470).year, 0); // no 1879 on this shot
});

test('chrome frames: marker swap, title window, name card 134 frames to the cut, 1879 held to the cut, the fiction marker is brief and hidden at both seam frames', () => {
  assert.equal(chromeAt(0).fiction, 0); assert.equal(chromeAt(6).fiction, 1); assert.equal(chromeAt(30).fiction, 1); assert.equal(chromeAt(38).fiction, 0); assert.equal(chromeAt(1249).fiction, 0);
  assert.equal(chromeAt(1250).fact, 0); assert.equal(chromeAt(1280).fact, 1);
  assert.ok(chromeAt(1366).title > 0 && chromeAt(1376).title === 1 && chromeAt(1390).title === 0);
  assert.equal(chromeAt(1502).card, 0); assert.equal(chromeAt(1510).card, 1); assert.equal(chromeAt(1641).card, 1); assert.equal(chromeAt(1642).card, 0);
  assert.equal(chromeAt(2364).year, 1); assert.equal(chromeAt(2365).year, 0);
  assert.equal(chromeAt(2860).fiction, chromeAt(0).fiction); assert.equal(chromeAt(2860).fact, 0);
});
