import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createElement, type ReactElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {uniformStage, uniformStageTransform} from '../src/layout/uniformStage';
import {houseInterior} from '../src/assets/backgrounds/HouseInterior';
import {exteriorFit, exteriorPath} from '../src/assets/backgrounds/OldHouseExterior';
import {BedroomPOV} from '../src/assets/backgrounds/BedroomPOV';
import {layoutActor} from '../src/scenes/timeline';
import {samplePose} from '../src/rig/poses';
import {HUMAN_HIP_FROM_ANCHOR} from '../src/rig/geometry';

const frames = [
  [1080, 1920],
  [1920, 1080],
] as const;

test('stage scale is one number on both axes and wide frames keep side room', () => {
  for (const [width, height] of [...frames, [1080, 1080] as const]) {
    const stage = uniformStage(width, height);
    assert.equal(stage.scale, Math.min(width / 1080, height / 1920));
    assert.equal(stage.contentW / 1080, stage.scale);
    assert.equal(stage.contentH / 1920, stage.scale);
    const transform = uniformStageTransform(width, height);
    assert.match(transform, new RegExp(`scale\\(${stage.scale}\\)`));
    assert.doesNotMatch(transform, /scale\([^)]*\s[^)]*\)/);
  }
  assert.ok(uniformStage(1920, 1080).offsetX > 200);
  assert.equal(uniformStage(1080, 1920).offsetX, 0);
});

test('interior furniture transform stays uniform in both layouts', () => {
  for (const [w, h] of frames) {
    const node = houseInterior({
      w,
      h,
      p: {sky: '#111', far: '#222', mid: '#333', near: '#444', accent: '#555'},
      night: true,
      t: 0,
      time: 'night',
      options: {variant: 'kitchen'},
    }).mid;
    const html = renderToStaticMarkup(node as ReactElement);
    const stage = uniformStage(w, h);
    assert.ok(html.includes(`scale(${stage.scale})`));
    assert.ok(html.includes('data-uniform-scale="interior"'));
    assert.doesNotMatch(html, /scale\([^)]*\s[^)]*\)/);
  }
});

test('bedroom POV does not stretch the 1080x1920 stage', () => {
  const html = renderToStaticMarkup(
    createElement(BedroomPOV, {
      width: 1920,
      height: 1080,
      frame: 10,
      fps: 30,
      duration: 90,
      options: {blanketPull: 0},
    }),
  );
  assert.equal(html.includes('preserveAspectRatio="none"'), false);
  assert.ok(html.includes(`scale(${uniformStage(1920, 1080).scale})`));
  assert.ok(html.includes('data-uniform-scale'));
});

test('long exterior people are shorter than one story and stand on the path', () => {
  const fit = exteriorFit(1920, 1080);
  const person = 397 * 0.8 * 1.42 * fit.actorBoost;
  assert.ok(person < fit.storyPx * 0.75, `person ${person} story ${fit.storyPx}`);
  for (const nx of [0.35, 0.66]) {
    const y = fit.groundY(1920 * nx);
    assert.ok(y > 1080 * 0.84, `${nx} y ${y}`);
    assert.ok(y < 1080 * 0.97, `${nx} y ${y}`);
    const t = (y / 1080 - exteriorPath.farY) / (exteriorPath.nearY - exteriorPath.farY);
    const left = exteriorPath.leftFar + t * (exteriorPath.leftNear - exteriorPath.leftFar);
    const right = exteriorPath.rightFar + t * (exteriorPath.rightNear - exteriorPath.rightFar);
    assert.ok(nx > left + 0.03 && nx < right - 0.03, `${nx} outside ${left}..${right}`);
  }
});

test('overhead staircase fills the frame and keeps a single scale', () => {
  for (const [w, h] of frames) {
    const node = houseInterior({
      w,
      h,
      p: {sky: '#111', far: '#222', mid: '#333', near: '#444', accent: '#555'},
      night: true,
      t: 0,
      time: 'night',
      options: {variant: 'staircase'},
      view: 'topDown',
    }).mid;
    const html = renderToStaticMarkup(node as ReactElement);
    assert.ok(html.includes('data-stairwell="top-down"'));
    assert.ok(html.includes('data-footstep-track="stairwell"'));
    assert.ok(html.includes(`width="${w}"`));
    assert.ok(html.includes(`height="${h}"`));
    assert.doesNotMatch(html, /scale\([^)]*\s[^)]*\)/);
    assert.equal(html.includes('preserveAspectRatio="none"'), false);
  }
});

test('lie pose plants the hip on the floor in both layouts', () => {
  const actor = {type: 'narrator' as const, y: 0.9, scale: 0.85};
  for (const [width, height] of frames) {
    const standing = layoutActor(actor, 0.5, width, height);
    const lying = layoutActor(actor, 0.5, width, height, undefined, {lie: 1});
    const hip = lying.y - HUMAN_HIP_FROM_ANCHOR * lying.scale;
    assert.ok(hip > height * 0.82, `hip ${hip} too high`);
    assert.ok(hip < height * 0.94, `hip ${hip} too low`);
    assert.ok(lying.y > standing.y);
  }
});

test('point pose bends the elbow instead of holding a straight arm', () => {
  const pose = samplePose('point', 0, 30);
  assert.ok(pose.upperArmR < -40 && pose.upperArmR > -85);
  assert.ok(pose.lowerArmR < -30);
});
