import {test} from 'node:test';
import assert from 'node:assert/strict';
import poolDepth from '../src/videos/pool-depth/index';
import {collectEpisodes} from '../src/videos/registry';
import {sceneFrames, subtitleAt, timelineFrames, validateTimeline} from '../src/scenes/timeline';
import {boxToQuadHomography, quadAt, quadMatrix3d} from '../src/scenes/quadText';
import type {Scene} from '../src/scenes/types';

const video = poolDepth.videos[0];
const fps = 30;
const starts = video.timeline.reduce<number[]>((acc, s, i) => [...acc, i ? acc[i - 1] + sceneFrames(video.timeline[i - 1].durationSec, fps) : 0], []);
const captionAt = (globalFrame: number) => {
  const i = starts.filter(start => start <= globalFrame).length - 1;
  return subtitleAt(video.timeline[i], globalFrame - starts[i], fps);
};

test('POOLDEPTH-SHORT registers and maps the eight clips onto the BOARD-R2 frame windows', () => {
  collectEpisodes([poolDepth]);
  assert.equal(video.id, 'POOLDEPTH-SHORT');
  assert.equal(video.ending, 'B_loop');
  assert.equal(video.loopFadeFrames, undefined);
  assert.equal(video.sceneTransitionFrames, undefined);
  assert.equal(timelineFrames(video.timeline, fps), 1620);
  assert.deepEqual(starts, [0, 180, 480, 780, 1140, 1240, 1320, 1410]);
  video.timeline.forEach((scene, i) => {
    assert.equal(scene.bg, 'none');
    assert.deepEqual(scene.actors, []);
    assert.equal(scene.projection, undefined);
    assert.equal(scene.media?.[0].src, `pool-depth/shot-0${i + 1}.mp4`);
  });
});

test('label is on SH01 only, visible and unfaded at frame 0', () => {
  assert.equal(video.timeline[0].eyebrow, 'ฉากสมมติ');
  assert.equal(video.timeline[0].eyebrowStyle?.fade, false);
  video.timeline.slice(1).forEach(scene => assert.equal(scene.eyebrow, undefined));
});

test('numeric depth captions exist only in the SH04 straight-down state, always with "มองตรงลงมา"', () => {
  for (let frame = 0; frame < 1620; frame++) {
    const text = captionAt(frame);
    if (/[¾]|1\.5|2 ม\./.test(text)) {
      assert.ok(frame >= 780 + 90 && frame < 780 + 270, `numeric caption at ${frame}`);
      assert.ok(text.includes('มองตรงลงมา'), `no straight-down condition at ${frame}`);
    }
  }
  assert.equal(captionAt(780 + 269).includes('¾'), true);
  assert.equal(captionAt(780 + 270), '');
  assert.equal(captionAt(780 + 299), '');
  assert.equal(captionAt(780 + 300), 'มองเฉียง: ยิ่งดูตื้นขึ้น');
  assert.equal(captionAt(1619), 'แล้วน้ำตรงหน้าคุณตอนนี้...');
  assert.equal(captionAt(0), 'ดูตื้นแค่เข่า... จริงเหรอ?');
});

test('SH05 plate text tracks all 100 quads', () => {
  const plate = video.timeline[4].quadTexts![0];
  assert.equal(plate.text, '1.0 m');
  assert.equal(plate.quads.length, 100);
  assert.deepEqual(quadAt(plate, 0)[0], [299.58, 798.02]);
  assert.deepEqual(quadAt(plate, 99), plate.quads[99]);
  assert.deepEqual(quadAt(plate, 250), plate.quads[99], 'frames past the last key hold it');
});

test('quad homography maps the box corners onto the quad and is order independent', () => {
  const quad = [[299.58, 798.02], [787.61, 804], [789.82, 1110.48], [297.4, 1108.8]] as const;
  const h = boxToQuadHomography(640, 400, quad);
  const apply = (x: number, y: number) => {const w = h[6] * x + h[7] * y + 1; return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w];};
  [[0, 0], [640, 0], [640, 400], [0, 400]].forEach(([x, y], i) => {
    const [u, v] = apply(x, y);
    assert.ok(Math.abs(u - quad[i][0]) < 1e-6 && Math.abs(v - quad[i][1]) < 1e-6, `corner ${i}`);
  });
  assert.equal(quadMatrix3d(640, 400, quad), quadMatrix3d(640, 400, quad));
});

test('new scene fields are validated', () => {
  const base = (extra: Partial<Scene>): Scene[] => [{durationSec: 1, bg: 'none', actors: [], subtitle: '', ...extra}];
  validateTimeline(base({subtitleCues: [{atSec: 0, text: ''}, {atSec: .5, text: 'ก'}]}));
  assert.throws(() => validateTimeline(base({subtitleCues: [{atSec: 0, text: '  '}]})), /subtitleCues\[0\]\.text/);
  assert.throws(() => validateTimeline(base({eyebrowStyle: {fade: 'no' as unknown as boolean}})), /eyebrowStyle\.fade/);
  assert.throws(() => validateTimeline(base({quadTexts: [{text: 'x', quads: [[[0, 0], [1, 0], [1, 1]]]}]})), /quadTexts\[0\]\.quads\[0\]/);
  assert.throws(() => validateTimeline(base({quadTexts: [{text: '', quads: []}]})), /quadTexts\[0\]\.text/);
});
