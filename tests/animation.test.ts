import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advancePoseChange, mixAngles, poses, resolvePose, samplePose} from '../src/rig/poses';
import {actorPosition, layoutActor, poseAt, timelineFrames, validateTimeline} from '../src/scenes/timeline';
import demo from '../scripts/demo.json';
import amplitude from '../src/amplitude.json';
import type {Timeline} from '../src/scenes/types';

test('demo has five scenes and exactly 600 frames at 30fps', () => {
  validateTimeline(demo); assert.equal(demo.length, 5); assert.equal(timelineFrames(demo, 30), 600);
});
test('pose interpolation reaches both endpoints and is independent of sampling order', () => {
  assert.deepEqual(mixAngles(poses.idle, poses.shock, 0), poses.idle);
  assert.deepEqual(mixAngles(poses.idle, poses.shock, 1), poses.shock);
  const transition = {from: 'idle', to: 'shock', startFrame: 30, durationFrames: 12} as const;
  assert.deepEqual(resolvePose(transition, 30, 30), samplePose('idle', 30, 30));
  assert.deepEqual(resolvePose(transition, 42, 30), samplePose('shock', 42, 30));
  const sought = resolvePose(transition, 36, 30);
  for (let f = 0; f <= 50; f++) resolvePose(transition, f, 30);
  assert.deepEqual(resolvePose(transition, 36, 30), sought);
});
test('walk leg motion loops and opposite hips alternate', () => {
  const a = samplePose('walk', 7, 30); const b = samplePose('walk', 34, 30);
  assert.ok(Math.abs(a.upperLegL - b.upperLegL) < 1e-8);
  assert.equal(a.upperLegL, -a.upperLegR);
});
test('pose keys pick the correct transition before and after seeking', () => {
  const actor = {type: 'narrator', pose: 'wave', poses: [{atSec: 2, pose: 'point'}]} as const;
  const mutable = {...actor, poses: [...actor.poses]};
  assert.equal(poseAt(mutable, 59, 30).to, 'wave');
  const transition = poseAt(mutable, 60, 30);
  assert.equal(transition.from, 'wave'); assert.equal(transition.to, 'point'); assert.equal(transition.startFrame, 60);
});
test('offscreen entrances reach their exact destination', () => {
  const actor = {type: 'cat', from: 1.1, to: .7} as const;
  assert.equal(actorPosition(actor, 0, 120), 1.1);
  assert.equal(actorPosition(actor, 119, 120), .7);
});
test('both layouts keep settled actors inside stage and above subtitles', () => {
  for (const [w, h] of [[1080,1920], [1920,1080]]) for (const scene of demo as Timeline) for (const actor of scene.actors) {
    const p = layoutActor(actor, actor.to ?? actor.x ?? .5, w, h);
    const halfWidth = (actor.type === 'narrator' ? 110 : 130) * p.scale;
    assert.ok(p.x - halfWidth > 0 && p.x + halfWidth < w);
    assert.ok(p.y < h * .84);
  }
});
test('validation rejects bad duration, actors, key times, duplicates, palettes and props with paths', () => {
  for (const [mutate, path] of [
    [(d: any) => d[0].durationSec = 0, /durationSec/],
    [(d: any) => d[0].bg = 'unknown', /bg/],
    [(d: any) => d[0].time = 'sunset', /time/],
    [(d: any) => d[0].actors[0].x = NaN, /actors\[0\].x/],
    [(d: any) => d[0].actors[1].pose = 'think', /pose/],
    [(d: any) => d[0].actors[0].poses = [{atSec: 4, pose:'idle'}], /poses/],
    [(d: any) => d[0].actors[1].id = 'host', /id/],
    [(d: any) => d[0].props[0].type = 'unknown', /props/],
  ] as const) {
    const data = structuredClone(demo); mutate(data); assert.throws(() => validateTimeline(data), path);
  }
});

test('interrupting a transition preserves the currently displayed joint angles', () => {
  const actor = {type:'narrator', pose:'shock', poses:[{atSec:.1, pose:'wave'}]} as const;
  const source = {...actor, poses:[...actor.poses]};
  const withoutKey = {...source, poses:[]};
  const expected = resolvePose(poseAt(withoutKey, 3, 30), 3, 30);
  const atChange = resolvePose(poseAt(source, 3, 30), 3, 30);
  assert.deepEqual(atChange, expected);
  assert.deepEqual(resolvePose(poseAt(source, 9, 30), 9, 30), resolvePose(poseAt(source, 9, 30), 9, 30));
});


test('live pose-name edits ease from the displayed pose, including interruptions', () => {
  let state = advancePoseChange(null, 'idle', 0, 30);
  const idleAt30 = resolvePose(state.pose, 30, 30);
  state = advancePoseChange(state, 'shock', 30, 30);
  assert.deepEqual(resolvePose(state.pose, 30, 30), idleAt30);
  const midway = resolvePose(state.pose, 33, 30);
  state = advancePoseChange(state, 'wave', 33, 30);
  assert.deepEqual(resolvePose(state.pose, 33, 30), midway);
  assert.deepEqual(resolvePose(state.pose, 45, 30), samplePose('wave', 45, 30));
});
test('character-level pose tracks support random seeking and closely spaced keys', () => {
  const track = {initial:'shock', from:'idle', keys:[{frame:3, pose:'wave'}, {frame:6, pose:'think'}]} as const;
  const input = {...track, keys:[...track.keys]};
  const reference = resolvePose(input, 8, 30);
  for (const frame of [100, 0, 8, 3, 7, 8]) assert.ok(Number.isFinite(resolvePose(input, frame, 30).upperArmR));
  assert.deepEqual(resolvePose(input, 8, 30), reference);
});

import {mouthAt, blinkAt} from '../src/rig/drivers';
import {endingState} from '../src/scenes/endings';
test('mouth follows audio, gates silence and respects clip offsets and boundaries', () => {
  const amplitude = [0, .8, .5, 0, 0];
  assert.equal(mouthAt(amplitude, 9, 10), 0);
  assert.equal(mouthAt(amplitude, 10, 10), 0);
  assert.ok(mouthAt(amplitude, 11, 10) > .5);
  assert.equal(mouthAt(amplitude, 14, 10), 0);
  assert.equal(mouthAt(amplitude, 15, 10), 0);
  assert.equal(mouthAt([], 0), 0);
  const sought = mouthAt(amplitude, 12, 10);
  for (const frame of [14, 10, 99, 11]) mouthAt(amplitude, frame, 10);
  assert.equal(mouthAt(amplitude, 12, 10), sought);
});
test('endings hold final pose, retain three readable seconds, then fade only A', () => {
  assert.equal(endingState(29, 120, 30, 'B_loop').poseFrame, 29);
  for (const ending of ['A_fade', 'B_loop'] as const) {
    assert.equal(endingState(30, 120, 30, ending).poseFrame, 30);
    assert.equal(endingState(119, 120, 30, ending).poseFrame, 30);
    assert.equal(endingState(89, 120, 30, ending).opacity, 1);
  }
  assert.equal(endingState(119, 120, 30, 'A_fade').opacity, 0);
  assert.equal(endingState(119, 120, 30, 'B_loop').opacity, 1);
  assert.ok(endingState(105, 120, 30, 'A_fade').opacity > 0);
  assert.ok(endingState(105, 120, 30, 'A_fade').opacity < 1);
});
test('blink driver is deterministic under seeking', () => {
  assert.equal(blinkAt(25, 30), blinkAt(25, 30));
  assert.equal(blinkAt(25, 30), 1);
  assert.equal(blinkAt(0, 30), 0);
});

test('demo envelope spans all five scenes with speech and closed-mouth pauses', () => {
  assert.equal(amplitude.length, timelineFrames(demo as Timeline, 30));
  assert.ok(amplitude.every(value => Number.isFinite(value) && value >= 0 && value <= 1));
  for (let start = 0; start < 600; start += 120) {
    assert.ok(amplitude.slice(start, start + 100).some(value => value > .2));
    assert.equal(mouthAt(amplitude, start + 119), 0);
  }
});
