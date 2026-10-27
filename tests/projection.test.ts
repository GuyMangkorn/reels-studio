import {test} from 'node:test';
import assert from 'node:assert/strict';
import blockout from '../scripts/cat-boxes/blockout.json';
import {orthographicViewAt, worldPositionAt, worldToOutputPoint} from '../src/scenes/projection';
import {validateTimeline} from '../src/scenes/timeline';
import {PHYSICAL_ACTOR_SPECS} from '../src/rig/physicalScale';
import {CAT_SEATED_BODY_DROP_UNITS} from '../src/rig/geometry';
import type {Scene, Timeline} from '../src/scenes/types';

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

test('all twelve Short scenes use the shared physical scale and frame Mochi between 420 and 560px at midpoint', () => {
  const ownerHeight = PHYSICAL_ACTOR_SPECS.narrator!.heightM;
  const catSpec = PHYSICAL_ACTOR_SPECS.cat!;
  near(ownerHeight / catSpec.heightM, 6);
  const timeline = blockout as unknown as Timeline;
  for (const [i, scene] of timeline.entries()) {
    assert.ok(scene.projection, `S${i + 1} has no shared projection`);
    assert.ok(scene.actors.every(actor => actor.world && actor.scale === undefined && actor.portrait === undefined), `S${i + 1} has a per-scene scale override`);
    assert.equal(scene.bg, 'room');
    const cat = scene.actors.find(actor => actor.type === 'cat');
    assert.ok(cat);
    const midpoint = Math.round(scene.durationSec * 15);
    const view = orthographicViewAt(scene.projection, 1080, 1920, midpoint, 30, true);
    let pose = cat.pose ?? 'idle';
    for (const key of cat.poses ?? []) if (key.atSec <= midpoint / 30) pose = key.pose;
    const seatedRatio = pose === 'sit' ? (208 - CAT_SEATED_BODY_DROP_UNITS) / 208 : 1;
    const projectedHeight = catSpec.heightM * view.pixelsPerMeter * seatedRatio;
    assert.ok(projectedHeight >= 420 && projectedHeight <= 560, `S${i + 1} midpoint cat height ${projectedHeight.toFixed(1)}px`);
    if (i < 11) assert.ok((scene.projection.views.short.cameraMoves?.length ?? 0) > 2, `S${i + 1} camera is static`);
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
