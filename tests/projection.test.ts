import {test} from 'node:test';
import assert from 'node:assert/strict';
import blockout from '../scripts/cat-boxes/blockout.json';
import {orthographicViewAt, worldPositionAt, worldToOutputPoint} from '../src/scenes/projection';
import {validateTimeline} from '../src/scenes/timeline';
import type {Scene} from '../src/scenes/types';

const fixture = () => structuredClone(blockout[11]) as unknown as Scene;
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} ≠ ${expected}`);

test('one metre projects uniformly on both axes and both output formats', () => {
  const projection = fixture().projection!;
  for (const [width, height, portrait] of [[1080, 1920, true], [1920, 1080, false]] as const) {
    const view = orthographicViewAt(projection, width, height, 1062, 30, portrait);
    const origin = worldToOutputPoint({x: 0, y: 0}, view);
    const right = worldToOutputPoint({x: 1, y: 0}, view);
    const up = worldToOutputPoint({x: 0, y: 1}, view);
    near(right.x - origin.x, origin.y - up.y);
    near(right.y, origin.y);
    near(up.x, origin.x);
    near(view.pixelsPerMeter, right.x - origin.x);
  }
});

test('camera cuts hold the prior framing until the authored cut frame', () => {
  const projection = fixture().projection!;
  const before = orthographicViewAt(projection, 1080, 1920, 689, 30, true);
  const cut = orthographicViewAt(projection, 1080, 1920, 690, 30, true);
  near((before.view.left + before.view.right) / 2, -.2);
  near((cut.view.left + cut.view.right) / 2, -.55);
  near(before.pixelsPerMeter, cut.pixelsPerMeter);
});

test('world motion and camera sampling reproduce a frame after backward seeking', () => {
  const scene = fixture();
  const keys = scene.actors[1].world!.keys;
  const sample = (frame: number) => ({
    actor: worldPositionAt(keys, frame, 30),
    camera: orthographicViewAt(scene.projection!, 1080, 1920, frame, 30, true),
  });
  const expected = sample(873);
  for (const frame of [1349, 0, 689, 1050, 690, 300]) sample(frame);
  assert.deepEqual(sample(873), expected);
  let previousX = worldPositionAt(keys, 690, 30).x;
  for (let frame = 691; frame <= 1050; frame++) {
    const current = worldPositionAt(keys, frame, 30).x;
    assert.ok(current >= previousX, `travel reversed at local frame ${frame}`);
    previousX = current;
  }
});

test('physical projection rejects unsupported or mixed coordinate contracts', () => {
  const cases: [string, (scene: Scene) => void][] = [
    ['unsupported background', scene => {scene.bg = 'forest';}],
    ['actor-only scaling', scene => {scene.actors[1].scale = 2;}],
    ['normalized sofa seating', scene => {scene.actors[0].seat = 'sofa';}],
    ['uncalibrated actor', scene => {scene.actors[1].type = 'dog';}],
    ['missing world path', scene => {delete scene.actors[1].world;}],
    ['non-finite position', scene => {scene.actors[1].world!.keys[0].x = NaN;}],
    ['world prop with screen placement', scene => {scene.props![0].x = .5;}],
    ['camera outside stage', scene => {scene.projection!.views.short.cameraMoves![0].x = 100;}],
    ['camera without frame-zero state', scene => {scene.projection!.views.short.cameraMoves![0].atSec = 1;}],
  ];
  validateTimeline([fixture()]);
  for (const [name, mutate] of cases) {
    const scene = fixture();
    mutate(scene);
    assert.throws(() => validateTimeline([scene]), name);
  }
});
