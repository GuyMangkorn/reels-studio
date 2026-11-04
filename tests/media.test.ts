import {test} from 'node:test';
import assert from 'node:assert/strict';
import {timelineFrames, validateTimeline} from '../src/scenes/timeline';
import {duckGainAt, entryTransitionStyle, outlineLook, trackFadeAt, validateVideoStyle} from '../src/scenes/media';
import type {Scene} from '../src/scenes/types';

const plain = (extra: Partial<Scene> = {}): Scene => ({durationSec: 2, bg: 'none', actors: [], subtitle: '', ...extra});

test('footage scenes validate and keep the summed duration', () => {
  const timeline = [
    plain({media: [{kind: 'video', src: 'media/clip.mp4', trimStartSec: 1, volume: 0.5}]}),
    plain({media: [{kind: 'image', src: 'https://example.com/a.png', fit: 'contain', box: {x: .1, y: .1, width: .8, height: .5}}], transitionIn: {type: 'slide', frames: 12, direction: 'up'}, sfx: [{src: 'sfx/pop.wav', atSec: .5}]}),
  ];
  validateTimeline(timeline);
  assert.equal(timelineFrames(timeline, 30), 120);
});

test('invalid media, cues and transitions are rejected with a path', () => {
  assert.throws(() => validateTimeline([plain({media: [{kind: 'image', src: '../secret.png'}]})]), /\[0\]\.media\[0\]\.src/);
  assert.throws(() => validateTimeline([plain({media: [{kind: 'image', src: 'a.png', volume: 1}]})]), /only video clips/);
  assert.throws(() => validateTimeline([plain({sfx: [{src: 'a.wav', atSec: 2}]})]), /sfx\[0\]\.atSec/);
  assert.throws(() => validateTimeline([plain({transitionIn: {type: 'fade', frames: 6}})]), /first scene/);
  assert.throws(() => validateTimeline([plain(), plain({transitionIn: {type: 'fade', frames: 60}})]), /fit inside the previous scene/);
  assert.throws(() => validateTimeline([plain(), plain({transitionIn: {type: 'fade', frames: 6, direction: 'left'}})]), /fade has no direction/);
});

test('video style validates tracks, captions and chrome', () => {
  validateVideoStyle({audio: [{src: 'music/bed.mp3', volume: .4, duckUnderNarration: .25, loop: true, fadeOutSec: 2}], captionStyle: {preset: 'box', position: 'top'}, chrome: {channelLabel: false, progressBar: false}}, 'X');
  assert.throws(() => validateVideoStyle({audio: [{src: 'a.mp3', duckUnderNarration: 2}]}, 'X'), /duckUnderNarration/);
  assert.throws(() => validateVideoStyle({captionStyle: {preset: 'karaoke'}}, 'X'), /captionStyle\.preset/);
  validateVideoStyle({captionStyle: {position: 'lower'}}, 'X');
  validateVideoStyle({captionStyle: {strokeWidth: 8, strokeColor: '#101018', textShadow: '0 0 8px #000'}}, 'X');
  assert.throws(() => validateVideoStyle({captionStyle: {strokeWidth: 40}}, 'X'), /captionStyle\.strokeWidth/);
  assert.throws(() => validateVideoStyle({captionStyle: {textShadow: 3}}, 'X'), /captionStyle\.textShadow/);
  assert.throws(() => validateVideoStyle({captionStyle: {position: 'left'}}, 'X'), /captionStyle\.position/);
  assert.throws(() => validateVideoStyle({chrome: {channelLabel: 3}}, 'X'), /chrome\.channelLabel/);
});

test('ducking engages around speech and releases in silence', () => {
  const amplitude = [...Array(30).fill(0), ...Array(10).fill(.5), ...Array(30).fill(0)];
  assert.equal(duckGainAt(amplitude, 5, .25), 1);
  assert.equal(duckGainAt(amplitude, 35, .25), .25);
  assert.equal(duckGainAt(amplitude, 25, .25), .25, 'duck starts within the look-ahead window');
  assert.equal(duckGainAt(amplitude, 65, .25), 1);
});

test('track fades and entry transitions reach their end states', () => {
  assert.equal(trackFadeAt({fadeInSec: 1}, 0, 300, 30), 0);
  assert.equal(trackFadeAt({fadeInSec: 1}, 30, 300, 30), 1);
  assert.equal(trackFadeAt({fadeOutSec: 1}, 299, 300, 30), 0);
  assert.deepEqual(entryTransitionStyle({type: 'fade', frames: 10}, 10), {});
  assert.equal(entryTransitionStyle({type: 'fade', frames: 10}, 0).opacity, 0);
  assert.equal(entryTransitionStyle({type: 'slide', frames: 10, direction: 'left'}, 0).transform, 'translateX(100%)');
  assert.equal(entryTransitionStyle({type: 'wipe', frames: 10, direction: 'up'}, 5).clipPath, 'inset(50% 0 0 0)');
});

import {endingState, loopBlendOpacity} from '../src/scenes/endings';
import {collectEpisodes} from '../src/videos/registry';

test('C_seamless has no hold or fade and blends the last frame into the first', () => {
  assert.deepEqual(endingState(119, 120, 30, 'C_seamless'), {poseFrame: 119, opacity: 1});
  assert.equal(loopBlendOpacity(104, 120, 15), 0);
  assert.ok(loopBlendOpacity(112, 120, 15) > 0 && loopBlendOpacity(112, 120, 15) < 1);
  assert.equal(loopBlendOpacity(119, 120, 15), 1, 'last frame equals the frozen first frame');
  assert.equal(loopBlendOpacity(119, 120, 0), 0);
});

test('loopBlendFrames must be a frame count shorter than the last scene', () => {
  const video = (loopBlendFrames: number) => ({episode: 'x', videos: [{id: `L${loopBlendFrames}`, format: 'short' as const, ending: 'C_seamless' as const, loopBlendFrames, timeline: [plain({durationSec: 1})]}]});
  collectEpisodes([video(10)]);
  assert.throws(() => collectEpisodes([video(30)]), /shorter than the last scene/);
  assert.throws(() => collectEpisodes([video(-1)]), /loopBlendFrames/);
});

test('outline look: unset fields keep the original stroke and shadow', () => {
  const original = {WebkitTextStroke: '7px #3d3c53', paintOrder: 'stroke fill', textShadow: '0 4px 0 #3d3c53'};
  assert.deepEqual(outlineLook(), original);
  assert.deepEqual(outlineLook({preset: 'outline', position: 'bottom', bottomEdgeY: 1248}), original);
  assert.deepEqual(outlineLook({strokeWidth: 8, strokeColor: '#101018', textShadow: '0 0 8px #000'}), {WebkitTextStroke: '8px #101018', paintOrder: 'stroke fill', textShadow: '0 0 8px #000'});
});
