import {test} from 'node:test';
import assert from 'node:assert/strict';
import oldestShipwreck from '../src/videos/oldest-shipwreck/index';
import {collectEpisodes} from '../src/videos/registry';
import {timelineFrames} from '../src/scenes/timeline';
import {paintedSpans, paintedStateAt} from '../src/scenes/painted';
import {cameraAt, paintedShots} from '../src/painted/registry';
import {SH01_LEN} from '../src/painted/shots/shipwreck';

const video = oldestShipwreck.videos[0];
const fps = 30;
const total = timelineFrames(video.timeline, fps);
const state = (frame: number) => paintedStateAt(video.timeline, frame, fps, {ending: 'B_loop', durationInFrames: total, loopBlendFrames: 15})!;

test('SHIPWRECK-SHORT registers nine beat scenes, 1,775 frames, B_loop, outline captions in the middle band', () => {
  collectEpisodes([oldestShipwreck]);
  assert.equal(video.id, 'SHIPWRECK-SHORT');
  assert.equal(video.ending, 'B_loop');
  assert.equal(video.loopFadeFrames, undefined);
  assert.deepEqual(video.captionStyle, {preset: 'outline', position: 'middle'});
  assert.equal(video.timeline.length, 9);
  assert.equal(total, 1775);
  assert.ok(total / fps <= 60);
  assert.equal(video.narration?.amplitude.length, total);
});

test('plates follow the shot list and the reconstruction label covers every B03 frame and no other', () => {
  const spans = paintedSpans(video.timeline, fps);
  assert.deepEqual(spans.map((s) => [s.shot.replace('SHIPWRECK-', ''), s.startFrame]), [
    ['SH01', 0], ['SH02', 189], ['SH03a', 395], ['SH03b', 468], ['SH04a', 553], ['SH04b', 655], ['SH05', 803],
    ['SH06', 1014], ['SH07a', 1185], ['SH07b', 1305], ['SH08', 1416], ['SH09a', 1581], ['SH09b', 1631],
  ]);
  for (let f = 0; f < total; f++) {
    const labelled = state(f).plates.some((p) => p.label === 'ภาพจำลอง' && (p.alpha > 0 || p.overlayOpacity > 0));
    if (f >= 395 && f < 553) assert.ok(labelled, `B03 frame ${f} has the label`);
    if (f < 395 || f >= 553 + 30) assert.ok(!labelled, `frame ${f} outside B03 has no label`);
  }
});

test('B_loop seam: from the hold start the SH09b plate is SH01 at clock 0 with the SH01 frame-0 camera', () => {
  const hold = total - 3 * fps;
  for (const f of [hold, total - 1]) {
    const [plate] = state(f).plates;
    assert.equal(plate.shot, 'SHIPWRECK-SH09b');
    const shot = paintedShots[plate.shot];
    assert.equal(shot.clock!(plate.tl), 0);
    assert.deepEqual(cameraAt(plate.shot, plate.tl), cameraAt('SHIPWRECK-SH01', 0));
  }
  assert.ok(SH01_LEN > 0);
  // The ease is still moving one frame before the hold.
  assert.notDeepEqual(cameraAt('SHIPWRECK-SH09b', state(hold - 1).plates[0].tl), cameraAt('SHIPWRECK-SH01', 0));
});

test('sound: storm only inside B03, music out before the hold, ambience wraps to its frame-0 phase', () => {
  const storm = video.audio!.filter((t) => t.src.includes('weather_'));
  storm.forEach((t) => assert.ok(t.startSec! >= 395 / fps - 1e-3 && t.endSec! <= 553 / fps, t.src));
  const music = video.audio!.filter((t) => t.src.includes('bed_underwater'));
  music.forEach((t) => assert.ok(t.endSec! <= (total - 3 * fps) / fps, `music ends before the hold: ${t.endSec}`));
  const last = video.audio!.filter((t) => t.src.includes('underwater-shallow')).at(-1)!;
  const periods = (last.endSec! - last.startSec!) / 14.5;
  assert.ok(Math.abs(periods - Math.round(periods)) < 1e-3 && last.endSec! * fps >= total - 1, 'last ambience entry ends on a loop boundary at the end');
});
