import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {sceneFrames as runtimeSceneFrames} from '../src/scenes/timeline';
import {applyPins, sceneFrames, sceneRanges, scenesInRange, segmentKeys, sourceHash, variantOf} from '../scripts/segments.mjs';

type Scene = {durationSec: number; subtitle?: string; sfx?: unknown[]; actors?: unknown[];
  painted?: {shots: {shot: string; atSec: number; dissolveSec?: number}[]}; transitionIn?: {frames: number}};

const scenes: Scene[] = [1, 2.5, 0.4, 3, 2].map((durationSec, i) => ({durationSec, subtitle: `line ${i}`, sfx: [{src: 'a.wav', atSec: 0}]}));
const frameTotal = (timeline: Scene[]) => sceneRanges(timeline, 30).at(-1)![1] + 1;
const BASE_TOTAL = frameTotal(scenes);
const composition = (timeline: Scene[], props: Record<string, unknown> = {}, durationInFrames = frameTotal(timeline)) =>
  ({width: 1080, height: 1920, fps: 30, durationInFrames, props: {timeline, ending: 'A_fade', ...props}});
const keys = (timeline: Scene[] = scenes, props: Record<string, unknown> = {}, durationInFrames?: number) =>
  segmentKeys(composition(timeline, props, durationInFrames), {}, {gl: 'angle'}, 'src');
const changed = (a: string[], b: string[]) => a.flatMap((key, i) => (key === b[i] ? [] : [i]));
const withScene = (timeline: Scene[], i: number, patch: Partial<Scene>) => timeline.map((s, j) => (j === i ? {...s, ...patch} : s));

test('scene frames match the runtime and ranges tile the timeline', () => {
  for (const sec of [0, 0.4, 1.01, 2.5, 3.333]) assert.equal(sceneFrames(sec, 30), runtimeSceneFrames(sec, 30));
  assert.deepEqual(sceneRanges(scenes, 30), [[0, 29], [30, 104], [105, 116], [117, 206], [207, 266]]);
});

test('a caption edit re-renders that scene only when no neighbour reads it', () => {
  assert.deepEqual(changed(keys(), keys(withScene(scenes, 2, {subtitle: 'new'}))), [2]);
  assert.deepEqual(changed(keys(), keys(withScene(scenes, 0, {subtitle: 'new'}))), [0]);
  assert.deepEqual(changed(keys(), keys(withScene(scenes, 4, {subtitle: 'new'}))), [4]);
});

test('reordering the fields of the same props keeps every key', () => {
  const reordered = scenes.map(({durationSec, subtitle, sfx}) => ({sfx, subtitle, durationSec}));
  assert.deepEqual(keys(reordered, {ending: 'A_fade'}), keys());
  const shot = {shot: 'S', atSec: 0, dissolveSec: 0.3};
  const flipped = {dissolveSec: 0.3, atSec: 0, shot: 'S'};
  assert.deepEqual(keys(withScene(scenes, 1, {painted: {shots: [flipped]}})), keys(withScene(scenes, 1, {painted: {shots: [shot]}})));
});

test('a neighbour re-renders where the renderer reads it: actor poses, a first-cue dissolve, an entry transition', () => {
  const withActors = withScene(scenes, 1, {actors: [{id: 'host', type: 'narrator', pose: 'idle', x: 0.5}]});
  assert.deepEqual(changed(keys(withActors), keys(withScene(withActors, 0, {subtitle: 'new'}))), [0, 1]);
  const dissolve = withScene(scenes, 1, {painted: {shots: [{shot: 'HANAKO-B08-SH01', atSec: 0, dissolveSec: 0.5}]}});
  assert.deepEqual(changed(keys(dissolve), keys(withScene(dissolve, 0, {subtitle: 'new'}))), [0, 1]);
  const entry = withScene(scenes, 2, {transitionIn: {frames: 15}});
  assert.deepEqual(changed(keys(entry), keys(withScene(entry, 2, {subtitle: 'new'}))), [1, 2]);
});

test('a dissolve after the first cue does not read the previous scene', () => {
  const laterCue = withScene(scenes, 1, {painted: {shots: [{shot: 'HANAKO-B01-SH01', atSec: 0}, {shot: 'HANAKO-B01-SH02', atSec: 1, dissolveSec: 0.5}]}});
  assert.deepEqual(changed(keys(laterCue), keys(withScene(laterCue, 0, {subtitle: 'new'}))), [0]);
});

test('the last scene reads the first only for loop endings (C_seamless, B_loop); A_fade does not', () => {
  const first = withScene(scenes, 0, {subtitle: 'new'});
  assert.deepEqual(changed(keys(), keys(first)), [0]);
  for (const ending of ['C_seamless', 'B_loop', undefined]) {
    assert.deepEqual(changed(keys(scenes, {ending}), keys(first, {ending})), [0, 4], `ending ${String(ending)}`);
  }
});

test('a global sceneTransitionFrames keeps the neighbours and re-keys every scene when any boundary moves', () => {
  const props = {sceneTransitionFrames: 15};
  assert.deepEqual(changed(keys(scenes, props), keys(withScene(scenes, 4, {subtitle: 'new'}), props)), [3, 4]);
  assert.deepEqual(changed(keys(scenes, props, BASE_TOTAL), keys(withScene(scenes, 1, {durationSec: 3}), props, BASE_TOTAL)), [0, 1, 2, 3, 4]);
});

test('SFX and sound beds never change a picture key', () => {
  const edited = scenes.map((s) => ({...s, sfx: []}));
  assert.deepEqual(changed(keys(), keys(edited, {audio: [{src: 'b.wav'}]})), []);
});

test('a duration change re-renders every scene, because the total length is in every key', () => {
  assert.equal(changed(keys(), keys(withScene(scenes, 1, {durationSec: 3}))).length, 5);
});

test('with the total held, a duration change re-renders the scene and every later one', () => {
  const longer = withScene(scenes, 1, {durationSec: 3});
  assert.deepEqual(changed(keys(scenes, {}, BASE_TOTAL), keys(longer, {}, BASE_TOTAL)), [1, 2, 3, 4]);
});

test('a scene split that keeps the total re-keys scenes it does not touch only while the progress bar is on', () => {
  // The last scene (2 s) is split into two 1 s scenes: the total is unchanged and scene 1 has no changed neighbour.
  const split: Scene[] = [...scenes.slice(0, 4), {...scenes[4], durationSec: 1}, {...scenes[4], durationSec: 1, subtitle: 'b'}];
  assert.equal(frameTotal(split), BASE_TOTAL);
  assert.equal(keys(split, {}, BASE_TOTAL)[0], keys(scenes, {}, BASE_TOTAL)[0], 'no progress bar: the count is not read');
  const bar = {chrome: {progressBar: true}};
  assert.notEqual(keys(split, bar, BASE_TOTAL)[0], keys(scenes, bar, BASE_TOTAL)[0], 'progress bar: the count is read');
});

test('props and options change every key', () => {
  assert.equal(changed(keys(), keys(scenes, {captionStyle: {bottomEdgeY: 1200}})).length, 5);
  assert.notDeepEqual(segmentKeys(composition(scenes), {}, {gl: 'egl'}, 'src'), keys());
});

test('scenesInRange picks every scene a frame range touches', () => {
  const ranges = [[0, 29], [30, 104], [105, 116], [117, 206]];
  assert.deepEqual(scenesInRange(ranges, [0, 0]), [0]);
  assert.deepEqual(scenesInRange(ranges, [29, 30]), [0, 1]);
  assert.deepEqual(scenesInRange(ranges, [40, 120]), [1, 2, 3]);
  assert.deepEqual(scenesInRange(ranges, [300, 400]), []);
});

test('--draft changes every segment key', () => {
  const plain = segmentKeys(composition(scenes), {}, {scale: 1}, 'src');
  const draft = segmentKeys(composition(scenes), {paintDraft: true}, {scale: 1}, 'src');
  assert.ok(plain.every((key, i) => key !== draft[i]));
});

test('applyPins keeps unchanged pins and stops on changed ones', () => {
  const pins = {1: {key: 'old1', shots: ['B01-SH02'], range: [30, 104]}, 2: {key: 'k2', shots: ['B02-SH01'], range: [105, 116]}};
  const picked = [0, 1, 2], keys = ['k0', 'new1', 'k2'];
  const plain = applyPins(pins, picked, keys);
  assert.deepEqual(plain.changed, [{scene: 1, shots: ['B01-SH02'], range: [30, 104]}]);
  assert.deepEqual(plain.use, keys);
  const keep = applyPins(pins, picked, keys, {keep: true});
  assert.deepEqual([keep.use, keep.kept, keep.changed], [['k0', 'old1', 'k2'], [1], []]);
  const repaint = applyPins(pins, picked, keys, {repaint: ['B01-SH02']});
  assert.deepEqual([repaint.use, repaint.unpin, repaint.changed], [keys, [1], []]);
  assert.deepEqual(applyPins(pins, picked, keys, {repaint: ['all']}).unpin, [1]);
  assert.deepEqual(applyPins(undefined, picked, keys).changed, []);
});

test('variantOf separates finals from draft and preview renders', () => {
  const c = composition(scenes);
  assert.equal(variantOf(c, {}), 'A_fade');
  assert.equal(variantOf(c, {ending: 'B_loop'}), 'B_loop');
  assert.equal(variantOf(c, {paintDraft: true}), 'A_fade|draft');
  assert.equal(variantOf(c, {paintScale: 0.5}), 'A_fade|scale0.5');
});

test('sourceHash: sound lock entries stay out; picture lock entries, src files and the episode lock file go in', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'segments-hash-'));
  const write = (rel: string, text: string) => {
    mkdirSync(path.dirname(path.join(root, rel)), {recursive: true});
    writeFileSync(path.join(root, rel), text);
  };
  const lock = (sound: string, picture: string) => JSON.stringify({
    'public/audio/bed/x.wav': {store: 'library/x.wav', sha256: sound},
    'public/images/p.png': {store: 'library/p.png', sha256: picture},
  });
  try {
    write('package-lock.json', '{}');
    write('src/index.ts', "import './scene';");
    write('src/scene.ts', 'export const a = 1;');
    write('src/videos/ep/index.ts', "export default {episode: 'ep', videos: [{id: 'EP'}]};");
    write('public/images/p.png', 'picture bytes');
    write('src/videos/ep/assets.lock.json', lock('s1', 'p1'));
    const timeline = [{durationSec: 1, media: [{kind: 'image', src: 'images/p.png'}]}];
    const composition = {id: 'EP', width: 1080, height: 1920, fps: 30, durationInFrames: 30, props: {timeline}};
    const hash = () => sourceHash(root, composition);
    const base = hash();
    assert.equal(hash(), base, 'known project inputs reuse the source hash');
    write('src/videos/ep/assets.lock.json', lock('s2', 'p1'));
    assert.equal(hash(), base, 'a sound lock entry does not change the source hash');
    write('src/videos/ep/index.ts', "export default {episode: 'ep', videos: [{id: 'EP', audio: []}]};");
    assert.equal(hash(), base, 'the episode file is outside the source hash');
    write('src/videos/ep/assets.lock.json', lock('s2', 'p2'));
    assert.notEqual(hash(), base, 'a picture lock entry changes the source hash');
    const pictureHash = hash();
    write('src/scene.ts', 'export const a = 2;');
    assert.notEqual(hash(), pictureHash, 'shared src changes the source hash');
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
