import {test} from 'node:test';
import assert from 'node:assert/strict';
import {poseWeightAt, advancePoseChange, mixAngles, poses, resolvePose, samplePose} from '../src/rig/poses';
import {actorPoseTrack, actorPosition, layoutActor, layoutSceneProp, pictureMoveAt, poseAt, propVisibleAt, subtitleAt, timelineFrames, validateTimeline} from '../src/scenes/timeline';
import demo from '../scripts/demo.json';
import catboxBlockout from '../scripts/cat-boxes/blockout.json';
import amplitude from '../src/amplitude.json';
import {sofaSeat} from '../src/assets/props/Sofa';
import type {Scene, Timeline} from '../src/scenes/types';

test('demo has five scenes and exactly 600 frames at 30fps', () => {
  validateTimeline(demo); assert.equal(demo.length, 5); assert.equal(timelineFrames(demo, 30), 600);
});
test('CATBOX blockout maps all 12 storyboard scenes into one 9-minute timeline', () => {
  validateTimeline(catboxBlockout);
  assert.equal(catboxBlockout.length, 12);
  assert.equal(timelineFrames(catboxBlockout, 30), 16200);
  for (const scene of catboxBlockout as Timeline) {
    assert.equal(scene.durationSec, 45);
    assert.equal(scene.pictureMove?.length, 5);
    assert.equal(scene.subtitleCues?.[0]?.atSec, 0);
    assert.ok(scene.props?.some(prop => prop.type === 'catbox-old'));
  }
  assert.equal(catboxBlockout[0].eyebrow?.startsWith('CATBOX-C01-S01'), true);
  assert.equal(catboxBlockout[11].eyebrow?.startsWith('CATBOX-C06-S02'), true);
  const stimuli = catboxBlockout[0].props?.filter(prop => prop.type === 'catbox-stimulus') ?? [];
  assert.equal(stimuli.length, 3);
  assert.equal(propVisibleAt(stimuli[0], 17 * 30, 30, 45), false);
  assert.equal(propVisibleAt(stimuli[0], 18 * 30, 30, 45), true);
  assert.equal(propVisibleAt(stimuli[1], 22 * 30, 30, 45), false);
  assert.equal(propVisibleAt(stimuli[1], 23 * 30, 30, 45), true);
  assert.equal(catboxBlockout[11].props?.find(prop => prop.type === 'catbox-old')?.layer, 'front');
  const oldBox = catboxBlockout[11].props?.find(prop => prop.type === 'catbox-old');
  assert.ok(oldBox);
  const portraitBox = layoutSceneProp(oldBox, 1080, 1920);
  const landscapeBox = layoutSceneProp(oldBox, 1920, 1080);
  assert.ok(Math.abs(portraitBox.x - 680.4) < 1e-8);
  assert.ok(Math.abs(portraitBox.y - 1612.8) < 1e-8);
  assert.equal(portraitBox.size, 297);
  assert.ok(Math.abs(landscapeBox.x - 1516.8) < 1e-8);
  assert.equal(landscapeBox.size, 300);
  const finalOwner = catboxBlockout[11].actors[0];
  const finalOwnerX = actorPosition(finalOwner, 1349, 1350, true);
  assert.equal(finalOwnerX, .13);
  const finalOwnerPortrait = layoutActor(finalOwner, finalOwnerX, 1080, 1920);
  assert.ok(430 * finalOwnerPortrait.scale >= 480, 'portrait owner lead must meet the storyboard minimum');
  const finalCat = catboxBlockout[11].actors[1];
  assert.equal(actorPosition(finalCat, 0, 1350, true), .63);
  assert.equal(actorPosition(finalCat, 1349, 1350, true), .67);
  const finalCatPortrait = layoutActor(finalCat, .67, 1080, 1920);
  assert.ok(210 * finalCatPortrait.scale >= 480, 'portrait cat lead must meet the storyboard minimum');
});
test('picture-stage movement interpolates from frame data and is stable under random seeking', () => {
  const scene: Scene = {
    durationSec: 10, bg: 'room', actors: [], subtitle: 'test',
    pictureMove: [{atSec: 0, x: -.01, y: 0, scale: 1.04}, {atSec: 10, x: .01, y: .02, scale: 1.08}],
  };
  assert.deepEqual(pictureMoveAt(scene, 0, 30), {x: -.01, y: 0, scale: 1.04});
  const middle = pictureMoveAt(scene, 150, 30);
  assert.ok(Math.abs(middle.x) < 1e-12);
  assert.equal(middle.y, .01);
  assert.equal(middle.scale, 1.06);
  const sought = pictureMoveAt(scene, 126, 30);
  for (const frame of [270, 0, 150, 30, 90]) pictureMoveAt(scene, frame, 30);
  assert.deepEqual(pictureMoveAt(scene, 126, 30), sought);
  assert.deepEqual(pictureMoveAt(scene, 330, 30), {x: .01, y: .02, scale: 1.08});
});
test('scene-local subtitle cues hold until the next authored cue and work after seeking backward', () => {
  const scene: Scene = {
    durationSec: 5, bg: 'room', actors: [], subtitle: 'เปิด',
    subtitleCues: [{atSec: 0, text: 'เปิด'}, {atSec: 2, text: 'ถัดไป'}],
  };
  assert.equal(subtitleAt(scene, 0, 30), 'เปิด');
  assert.equal(subtitleAt(scene, 59, 30), 'เปิด');
  assert.equal(subtitleAt(scene, 60, 30), 'ถัดไป');
  assert.equal(subtitleAt(scene, 15, 30), 'เปิด');
});
test('validation checks picture movement, subtitle cue timing and reusable CATBOX prop parameters', () => {
  const base = structuredClone(catboxBlockout);
  const invalidCases = [
    [(data: typeof base) => data[0].pictureMove![1].atSec = 0, /pictureMove\[1\]\.atSec/],
    [(data: typeof base) => data[0].pictureMove![1].scale = .9, /pictureMove\[1\]\.scale/],
    [(data: typeof base) => data[0].subtitleCues![0].atSec = .2, /subtitleCues\[0\]\.atSec/],
    [(data: typeof base) => Object.assign(data[0].props![2], {variant: 'unsupported'}), /props\[2\]\.variant/],
    [(data: typeof base) => Object.assign(data[0].props![0], {layer: 'middle'}), /props\[0\]\.layer/],
    [(data: typeof base) => Object.assign(data[0].props![2], {startSec: 46}), /props\[2\]\.startSec/],
    [(data: typeof base) => Object.assign(data[11].props![0], {portrait: {x: 1.5}}), /props\[0\]\.portrait\.x/],
    [(data: typeof base) => Object.assign(data[0].actors[1], {portrait: {scale: 0}}), /actors\[1\]\.portrait\.scale/],
  ] as const;
  for (const [mutate, path] of invalidCases) {
    const data = structuredClone(base); mutate(data); assert.throws(() => validateTimeline(data), path);
  }
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
test('portrait actor layout reframes the same scene while Long keeps the authored room position', () => {
  const actor = {type: 'cat', from: .66, to: .74, portrait: {from: .52, to: .65}, scale: 2.25} as const;
  assert.equal(actorPosition(actor, 0, 120, true), .52);
  assert.equal(actorPosition(actor, 119, 120, true), .65);
  assert.equal(actorPosition(actor, 119, 120, false), .74);
  const portrait = layoutActor(actor, .65, 1080, 1920);
  const landscape = layoutActor(actor, .74, 1920, 1080);
  assert.ok(Math.abs(portrait.x - 1080 * (.06 + .65 * .88)) < 1e-8);
  assert.ok(Math.abs(portrait.scale - 2.3625) < 1e-10);
  assert.equal(landscape.x, 1920 * .74);
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
    [(d: typeof demo) => d[0].durationSec = 0, /durationSec/],
    [(d: typeof demo) => d[0].bg = 'unknown', /bg/],
    [(d: typeof demo) => d[0].time = 'sunset', /time/],
    [(d: typeof demo) => d[0].actors[0].x = NaN, /actors\[0\].x/],
    [(d: typeof demo) => d[0].actors[1].pose = 'think', /pose/],
    [(d: typeof demo) => Object.assign(d[0].actors[0], {poses: [{atSec: 4, pose:'idle'}]}), /poses/],
    [(d: typeof demo) => d[0].actors[1].id = 'host', /id/],
    [(d: typeof demo) => d[0].props![0].type = 'unknown', /props/],
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

test('moving animals face their travel direction unless flip is explicitly authored', () => {
  for (const type of ['cat', 'dog'] as const) {
    assert.equal(layoutActor({type, from: 1.12, to: .63}, .8, 1080, 1920).flip, true);
    assert.equal(layoutActor({type, from: .46, to: .61}, .5, 1080, 1920).flip, false);
    assert.equal(layoutActor({type, from: 1, to: 0, flip: false}, .5, 1080, 1920).flip, false);
    assert.equal(layoutActor({type, x: .5, flip: true}, .5, 1080, 1920).flip, true);
  }
});
test('seated human hip contacts the sofa cushion at both aspect ratios and scales', () => {
  for (const [width,height] of [[1080,1920], [1920,1080]]) for (const scale of [1, .8, 1.3]) {
    const actor = {type: 'narrator' as const, scale};
    const seatY = sofaSeat(width, height).y;
    const p = layoutActor(actor, .28, width, height, {y:seatY, amount:1});
    assert.ok(Math.abs(p.y - 185 * p.scale - seatY) < 1e-8, `hip must meet cushion at ${width}x${height}`);
  }
});

test('sofa contact eases with sit joints and preserves interrupted seating progress', () => {
  const actor = {type:'narrator' as const, pose:'think' as const, poses:[{atSec:1,pose:'sit' as const},{atSec:1.2,pose:'wave' as const}]};
  const track = actorPoseTrack(actor, 30);
  assert.equal(poseWeightAt(track, 'sit', 30, 30), 0);
  assert.equal(poseWeightAt(track, 'sit', 36, 30), .5);
  assert.equal(poseWeightAt(track, 'sit', 48, 30), 0);
  const withoutInterrupt = actorPoseTrack({...actor,poses:actor.poses.slice(0,1)},30);
  assert.equal(poseWeightAt(withoutInterrupt, 'sit', 36, 30), .5);
  assert.equal(poseWeightAt(withoutInterrupt, 'sit', 42, 30), 1);
  const sought = poseWeightAt(track, 'sit', 39, 30);
  for (const frame of [100, 0, 30, 48]) poseWeightAt(track, 'sit', frame, 30);
  assert.equal(poseWeightAt(track, 'sit', 39, 30), sought);
});
