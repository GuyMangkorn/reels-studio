import {test} from 'node:test';
import assert from 'node:assert/strict';
import zombieCondoPaint from '../src/videos/zombie-condo-paint/index';
import {collectEpisodes} from '../src/videos/registry';
import {timelineFrames} from '../src/scenes/timeline';
import {paintedShots} from '../src/painted/registry';
import {poundJoltFrames} from '../src/painted/zcpaint/jolts';
import linesTH from '../scripts/zombie-condo-paint/short/ZCPAINT-SHORT-TH.lines.json';

// ZCPAINT-SHORT Editor pass 1 (30 Oct 2026): registration, frame counts, caption timing and the B02 pound blows.
const [th, en] = zombieCondoPaint.videos;
const fps = 30;

test('ZCPAINT-SHORT-TH and -EN register under unique IDs, outline captions in the middle band, chrome off, A_fade', () => {
  collectEpisodes([zombieCondoPaint]);
  assert.deepEqual([th.id, en.id], ['ZCPAINT-SHORT-TH', 'ZCPAINT-SHORT-EN']);
  for (const video of [th, en]) {
    assert.equal(video.format, 'short');
    assert.equal(video.ending, 'A_fade');
    assert.deepEqual(video.captionStyle, video === th ? {preset: 'outline', position: 'bottom', bottomEdgeY: 1248} : {preset: 'outline', position: 'middle'});
    assert.deepEqual(video.chrome, {channelLabel: false, progressBar: false});
    assert.equal(video.timeline.length, 10, 'one scene per story beat B01-B10');
  }
});

test('frame counts follow the cue sheets and the narration envelope covers the composition', () => {
  assert.equal(timelineFrames(th.timeline, fps), 2136);
  assert.equal(timelineFrames(en.timeline, fps), 2130);
  assert.ok(Math.abs((th.narration?.amplitude.length ?? 0) / fps - 71.2) < 0.1);
  assert.ok(Math.abs((en.narration?.amplitude.length ?? 0) / fps - 71.0) < 0.1);
});

test('every painted cue names a registered plate and starts each scene at zero', () => {
  for (const video of [th, en]) {
    for (const scene of video.timeline) {
      const shots = scene.painted?.shots ?? [];
      assert.ok(shots.length > 0);
      assert.equal(shots[0].atSec, 0);
      for (const cue of shots) assert.ok(Object.hasOwn(paintedShots, cue.shot), cue.shot);
    }
  }
});

test('captions: first cue at zero in every scene, cues increase, TH captions are the script chunks verbatim', () => {
  for (const video of [th, en]) {
    for (const scene of video.timeline) {
      const cues = scene.subtitleCues ?? [];
      assert.equal(cues[0].atSec, 0, `${video.id} scene first caption cue`);
      cues.forEach((cue, i) => {
        if (i > 0) assert.ok(cue.atSec > cues[i - 1].atSec, `${video.id} cue order`);
        assert.ok(cue.atSec < scene.durationSec);
      });
    }
  }
  const thCaptions = th.timeline.flatMap((s) => (s.subtitleCues ?? []).map((c) => c.text)).filter(Boolean);
  const expected = linesTH.filter((l) => l.caption !== null).map((l) => l.caption);
  assert.deepEqual(thCaptions, expected);
  assert.ok(thCaptions.includes('ปิด! ล็อก!'));
  assert.ok(thCaptions.includes('ในโลกนี้... พวกมันตามเสียง'));
});

test('B02 pound blows: one fist blow per jolt after the slam, at the jolt frame', () => {
  const jolts = poundJoltFrames('TH');
  const blows = th.timeline.flatMap((s, i) => {
    const start = th.timeline.slice(0, i).reduce((sum, p) => sum + p.durationSec, 0);
    return (s.sfx ?? []).filter((e) => e.src.includes('fist-blow')).map((e) => Math.round((start + e.atSec) * fps));
  });
  for (const frame of jolts.slice(1)) assert.ok(blows.some((b) => Math.abs(b - frame) <= 1), `blow at frame ${frame}`);
});
