import {test} from 'node:test';
import assert from 'node:assert/strict';
import kso from '../src/videos/kuchisake-onna/index';
import {collectEpisodes} from '../src/videos/registry';
import {timelineFrames} from '../src/scenes/timeline';
import {paintedStateAt} from '../src/scenes/painted';
import {KSO_SHOT_INDEX} from '../src/painted/shots/kuchisake';
import {paintedShots} from '../src/painted/registry';
import narrationAmplitude from '../scripts/kuchisake-onna/short/KSO-EP01-SHORT.amplitude.json';

const fps = 30;
const [primary, loop] = kso.videos;

test('KSO-EP01-SHORT registers two compositions with unique IDs and the measured frame counts', () => {
  collectEpisodes([kso]);
  assert.deepEqual(kso.videos.map((v) => [v.id, v.ending, v.endHoldSec]), [['KSO-EP01-SHORT-C', 'C_seamless', undefined], ['KSO-EP01-SHORT-B', 'B_loop', 2]]);
  assert.equal(timelineFrames(primary.timeline, fps), 2461);
  assert.equal(timelineFrames(loop.timeline, fps), 2521);
  assert.equal(primary.loopBlendFrames, 15);
  assert.equal(narrationAmplitude.length, 2461);
});

test('one scene per shot: plate IDs and frame starts follow KSO_SHOT_INDEX with no gaps', () => {
  assert.equal(KSO_SHOT_INDEX.length, 26);
  primary.timeline.forEach((scene, i) => {
    const row = KSO_SHOT_INDEX[i];
    assert.equal(scene.painted!.shots.length, 1, `${row.id} has one plate`);
    assert.equal(scene.painted!.shots[0].shot, row.plate);
    assert.ok(Object.hasOwn(paintedShots, row.plate), `${row.plate} is registered`);
    assert.equal(Math.round(scene.durationSec * fps), row.end - row.start, `${row.id} length`);
  });
  KSO_SHOT_INDEX.forEach((row, i) => assert.equal(i === 0 ? 0 : KSO_SHOT_INDEX[i - 1].end, row.start, `${row.id} starts where the previous ends`));
});

test('B_loop shares every scene with C_seamless and extends only the last shot by the 60 f (2 s) hold', () => {
  assert.equal(loop.timeline.length, primary.timeline.length);
  loop.timeline.slice(0, -1).forEach((scene, i) => assert.deepEqual(scene, primary.timeline[i]));
  const last = loop.timeline.at(-1)!;
  assert.equal(Math.round(last.durationSec * fps), 133);
  // C_seamless ends the closing line with a blank cue at frame 2446; B_loop keeps the line up through the hold.
  assert.deepEqual(last.subtitleCues, primary.timeline.at(-1)!.subtitleCues!.slice(0, -1));
});

// Painted state of one frame with the blend overlay off (C_seamless blends frame 0 over 2446-2460; B does not).
const paint = (video: typeof loop, frame: number) => paintedStateAt(video.timeline, frame, fps, {
  ending: video.ending!, durationInFrames: timelineFrames(video.timeline, fps), loopBlendFrames: 0, endingOptions: {holdSec: video.endHoldSec},
});

test('B_loop 2 s hold freezes the final shot at the picture end (frame 2461); frames 0-2460 paint what C_seamless paints', () => {
  for (let frame = 0; frame < 2461; frame++) assert.deepEqual(paint(loop, frame), paint(primary, frame), `frame ${frame}`);
  const held = paint(loop, 2461);
  assert.ok(held, 'the frozen picture is painted');
  for (let frame = 2461; frame < 2521; frame++) assert.deepEqual(paint(loop, frame), held, `frame ${frame} is frozen`);
  assert.notDeepEqual(paint(loop, 2460), held, 'the picture still moves on frame 2460');
});

test('the closing caption starts at frame 2394 and stays up to the end of B (frame 2521)', () => {
  const start = loop.timeline.slice(0, -1).reduce((n, scene) => n + Math.round(scene.durationSec * fps), 0);
  assert.equal(start, 2388, 'the final shot starts at 2388');
  const finalCues = loop.timeline.at(-1)!.subtitleCues!;
  const closing = finalCues.find((cue) => cue.text === 'ถึงตาเธอแล้ว…')!;
  assert.equal(start + Math.round(closing.atSec * fps), 2394, 'closing caption onset');
  assert.equal(finalCues.at(-1)!.text, 'ถึงตาเธอแล้ว…', 'no blank cue after it: visible to the end');
  assert.equal(start + Math.round(loop.timeline.at(-1)!.durationSec * fps), 2521, 'caption end = composition end');
});

test('every scene starts with a caption cue, and the closing line only holds in B_loop', () => {
  for (const video of [primary, loop]) {
    for (const scene of video.timeline) {
      assert.equal(scene.subtitleCues![0].atSec, 0, 'first caption at the shot start');
    }
  }
  const finalC = primary.timeline.at(-1)!.subtitleCues!;
  assert.equal(finalC.at(-1)!.text, '', 'C_seamless ends on a blank caption (speech ends by frame 2445)');
  const finalB = loop.timeline.at(-1)!.subtitleCues!;
  assert.equal(finalB.at(-1)!.text, 'ถึงตาเธอแล้ว…', 'B_loop keeps the closing line through the hold');
});

test('fiction marker appears on the first shot only and channel chrome is off', () => {
  primary.timeline.forEach((scene, i) => assert.equal(scene.eyebrow, i === 0 ? 'เรื่องแต่ง • จากตำนานญี่ปุ่น' : undefined));
  assert.equal(primary.chrome?.channelLabel, false);
  assert.equal(loop.chrome?.channelLabel, false);
});

test('the appearance murmur starts on the riser stop (first lit frame of S02-B01-SH04) and stays inside that shot', () => {
  const row = KSO_SHOT_INDEX.find((r) => r.id === 'S02-B01-SH04')!;
  const cue = primary.audio!.find((t) => t.src.endsWith('tension_whispers-children-murmur_01.wav'))!;
  assert.equal(Math.round(cue.startSec! * fps), 1062);
  assert.ok(Math.round(cue.startSec! * fps) >= row.start && Math.round(cue.endSec! * fps) <= row.end);
  assert.ok(cue.fadeInSec! > 0 && cue.fadeOutSec! > 0 && cue.duckUnderNarration! < 1);
});

test('scene sound cues fall inside the composition and stay on the composition clock', () => {
  const total = timelineFrames(primary.timeline, fps);
  let start = 0;
  primary.timeline.forEach((scene) => {
    const sceneFrames = Math.round(scene.durationSec * fps);
    for (const cue of scene.sfx ?? []) {
      const at = start + Math.round(cue.atSec * fps);
      assert.ok(at >= start && at < start + sceneFrames && at < total, `${cue.src} at ${at}`);
    }
    start += sceneFrames;
  });
});
