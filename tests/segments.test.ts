import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sceneFrames as runtimeSceneFrames} from '../src/scenes/timeline';
import {sceneFrames, sceneRanges, segmentKeys} from '../scripts/segments.mjs';

const scenes = [1, 2.5, 0.4, 3, 2].map((durationSec, i) => ({durationSec, subtitle: `line ${i}`, sfx: [{src: 'a.wav', atSec: 0}]}));
const composition = (timeline: typeof scenes, props: Record<string, unknown> = {}) =>
  ({width: 1080, height: 1920, fps: 30, durationInFrames: 270, props: {timeline, ending: 'A_fade', ...props}});
const keys = (timeline = scenes, props = {}) => segmentKeys(composition(timeline, props), {}, {gl: 'angle'}, 'src');
const changed = (a: string[], b: string[]) => a.flatMap((key, i) => (key === b[i] ? [] : [i]));

test('scene frames match the runtime and ranges tile the timeline', () => {
  for (const sec of [0, 0.4, 1.01, 2.5, 3.333]) assert.equal(sceneFrames(sec, 30), runtimeSceneFrames(sec, 30));
  assert.deepEqual(sceneRanges(scenes, 30), [[0, 29], [30, 104], [105, 116], [117, 206], [207, 266]]);
});

test('a caption edit re-renders that scene and its neighbours only', () => {
  const edited = scenes.map((s, i) => (i === 2 ? {...s, subtitle: 'new'} : s));
  assert.deepEqual(changed(keys(), keys(edited)), [1, 2, 3]);
});

test('SFX and sound beds never change a picture key', () => {
  const edited = scenes.map((s) => ({...s, sfx: []}));
  assert.deepEqual(changed(keys(), keys(edited, {audio: [{src: 'b.wav'}]})), []);
});

test('the last scene follows the first (loop); durations, props and options change every key', () => {
  const first = scenes.map((s, i) => (i === 0 ? {...s, subtitle: 'new'} : s));
  assert.deepEqual(changed(keys(), keys(first)), [0, 1, 4]);
  const longer = scenes.map((s, i) => (i === 1 ? {...s, durationSec: 3} : s));
  assert.equal(changed(keys(), keys(longer)).length, 5);
  assert.equal(changed(keys(), keys(scenes, {captionStyle: {bottomEdgeY: 1200}})).length, 5);
  assert.notDeepEqual(segmentKeys(composition(scenes), {}, {gl: 'egl'}, 'src'), keys());
});
