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
  // SS-R1.7: TH is the measured Gemini read plus the B09 call (2877 f = 95.9 s); EN is unchanged (paused).
  assert.equal(timelineFrames(th.timeline, fps), 2877);
  assert.equal(timelineFrames(en.timeline, fps), 2130);
  // The TH track is 93.15 s (candidate call, 31 Oct 2026); the envelope covers every spoken frame, and the composition holds 3.0 s after the last line.
  const lastEnd = (linesTH as {speechEndSec: number}[]).at(-1)!.speechEndSec;
  assert.ok(Math.abs((th.narration?.amplitude.length ?? 0) / fps - 93.15) < 0.1);
  assert.ok((th.narration?.amplitude.length ?? 0) >= Math.floor(lastEnd * fps));
  assert.ok(timelineFrames(th.timeline, fps) / fps - lastEnd >= 3.0 - 0.05, 'closing hold after the last line');
  assert.ok(Math.abs((en.narration?.amplitude.length ?? 0) / fps - 71.0) < 0.1);
});

test('TH cue events (SS-R1.7): no knocks in B09, three knocks after the last line of B10, sub hit at f 2632 under TH-37, the call uncaptioned, B09/B10 overlay keys', () => {
  const startOf = (i: number) => th.timeline.slice(0, i).reduce((sum, s) => sum + Math.round(s.durationSec * fps), 0);
  const sceneOf = (frame: number) => th.timeline.findIndex((s, k) => frame >= startOf(k) && frame < startOf(k) + Math.round(s.durationSec * fps));
  const events = th.timeline.flatMap((s, i) => (s.sfx ?? []).map((e) => ({src: e.src, frame: startOf(i) + Math.round(e.atSec * fps)})));
  const knocks = events.filter((e) => e.src.includes('knuckle-rap')).map((e) => e.frame);
  // B09 has the call instead of knocks; the user's B10 ending (1 Nov 2026) is three soft knocks after the last spoken line (TH-39 ends 92.87 s), no thin tone.
  assert.equal(knocks.length, 3, 'three knocks, all in B10');
  assert.ok(knocks.every((f) => f > Math.round(92.87 * fps) && f < 2877), 'knocks come after TH-39 and before the end');
  assert.ok(!(th.audio ?? []).some((a) => a.src.includes('thin-unresolved')), 'no thin tone under B10');
  assert.ok(events.some((e) => e.src.includes('sub-hit-short') && e.frame === 2632), 'sub hit at TH f 2632');
  const captionAt = (frame: number) => {
    const i = sceneOf(frame);
    const local = frame - startOf(i);
    return (th.timeline[i].subtitleCues ?? []).filter((c) => Math.round(c.atSec * fps) <= local).at(-1)?.text ?? '';
  };
  const line = (id: string) => (linesTH as {id: string; caption: string | null}[]).find((l) => l.id === id)!;
  assert.equal(line('TH-36a').caption, null, 'the call has no caption');
  assert.equal(captionAt(2560), '', 'no caption during the call (TH-36a, 2550-2587)');
  assert.equal(captionAt(2640), line('TH-37').caption, 'TH-37 caption from the sub hit');
  assert.equal(captionAt(2700), line('TH-38').caption, 'TH-38 caption on the B10 choice');
  // Quad text start frames are scene-local: B09 day card + counters on Boss's B09-SH01 keys 36 / 84 / 136; B10 labels 2696 / 2728 / 2772.
  const quadStarts = (i: number) => (th.timeline[i].quadTexts ?? []).map((q) => q.startFrame);
  assert.deepEqual(quadStarts(8), [0, 36, 84, 136]);
  assert.deepEqual(quadStarts(9), [10, 42, 86]);
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
