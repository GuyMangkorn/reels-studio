import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cameraAt} from '../src/camera/Camera';
import {samplePose, resolvePose} from '../src/rig/poses';
import {validateTimeline, timelineFrames} from '../src/scenes/timeline';
import {staircaseSteps} from '../src/assets/backgrounds/HouseInterior';
import showcase from '../scripts/haunted-house-p1.json';

test('P1 showcase selects every set, costume, ghost and required pose through JSON', () => {
  validateTimeline(showcase);
  assert.equal(timelineFrames(showcase, 30), 1140);
  assert.deepEqual(
    new Set(
      showcase
        .flatMap((s) => s.actors.map((a) => ('character' in a ? a.character : undefined)))
        .filter(Boolean),
    ),
    new Set(['mrsH', 'mrH', 'brotherH']),
  );
  assert.deepEqual(
    new Set(
      showcase
        .flatMap((s) => s.actors.map((a) => ('ghostVariant' in a ? a.ghostVariant : undefined)))
        .filter(Boolean),
    ),
    new Set(['womanBlack', 'seatedPair', 'crawler']),
  );
  assert.deepEqual(
    new Set(showcase.filter((s) => s.bg === 'houseInterior').map((s) => s.background?.variant)),
    new Set(['drawing', 'dining', 'staircase', 'window', 'bedroomPOV', 'kitchen']),
  );
  assert.deepEqual(
    new Set(showcase.map((scene) => scene.camera?.preset).filter(Boolean)),
    new Set(['dolly', 'truck', 'povCreep', 'peek', 'watcher']),
  );
});
test('every bedroom beat is POV-only and places ghosts at the bed end', () => {
  const bedroomScenes = showcase.filter(
    (scene) => scene.bg === 'houseInterior' && scene.background?.variant === 'bedroomPOV',
  );
  assert.equal(bedroomScenes.length, 3);
  assert.equal(
    showcase.filter(
      (scene) => scene.bg === 'houseInterior' && scene.background?.variant === 'bedroom',
    ).length,
    0,
  );
  for (const scene of bedroomScenes) {
    assert.ok(
      scene.actors
        .filter((actor) => actor.type === 'ghost')
        .every((actor) => 'depth' in actor && actor.depth === 'bedEnd'),
    );
  }
});
test('kitchen lie beat is anchored on the floor below the counter', () => {
  const kitchen = showcase.find(
    (scene) => scene.bg === 'houseInterior' && scene.background?.variant === 'kitchen',
  );
  const actor = kitchen?.actors.find((item) => item.type === 'narrator');
  assert.ok(
    actor && 'y' in actor && typeof actor.y === 'number' && actor.y >= 0.8 && actor.y <= 0.85,
  );
});
test('staircase descends through two complete turns into the central well', () => {
  const first = staircaseSteps[0];
  const last = staircaseSteps.at(-1)!;
  assert.ok(last.angle - first.angle >= 700);
  assert.ok(last.outer < first.inner);
  assert.ok(staircaseSteps.every((step) => step.outer > step.inner));
});
test('camera reaches exact endpoints, clamps seeking and has deterministic midpoint', () => {
  const camera = {zoom: [1, 2], pan: {from: [0, 0], to: [-0.1, 0.08]}} as {
    zoom: [number, number];
    pan: {from: [number, number]; to: [number, number]};
  };
  assert.deepEqual(cameraAt(camera, 0, 61), {zoom: 1, x: 0, y: 0});
  assert.deepEqual(cameraAt(camera, 60, 61), {zoom: 2, x: -0.1, y: 0.08});
  assert.deepEqual(cameraAt(camera, 30, 61), {zoom: 1.5, x: -0.05, y: 0.04});
  assert.deepEqual(cameraAt(camera, 999, 61), cameraAt(camera, 60, 61));
  assert.deepEqual(cameraAt(undefined, 0, 1), {zoom: 1, x: 0, y: 0});
});
test('lying rotates the whole shared skeleton and blends under random seeking', () => {
  assert.equal(samplePose('lie', 30, 30).root, 90);
  assert.equal(samplePose('stand', 30, 30).root, 0);
  const transition = {from: 'stand', to: 'lie', startFrame: 0, durationFrames: 12} as const;
  assert.equal(resolvePose(transition, 6, 30).root, 45);
  assert.equal(resolvePose(transition, 12, 30).root, 90);
  resolvePose(transition, 100, 30);
  assert.equal(resolvePose(transition, 6, 30).root, 45);
});
test('external JSON rejects malformed camera, variants and bounded prop/actor inputs', () => {
  const cases: [string, unknown, RegExp][] = [
    ['camera', {zoom: [0, 2]}, /camera.zoom/],
    ['camera', {zoom: [1, Infinity]}, /camera.zoom/],
    ['camera', {pan: {from: [0], to: [0, 0]}}, /camera.pan/],
    ['camera', {parallax: 2}, /camera.parallax/],
    ['camera', {view: 'bird'}, /camera.view/],
    ['camera', {view: 'topDown'}, /camera.view/],
    ['camera', {lighting: 'dark'}, /camera.lighting/],
    ['background', {variant: 'attic'}, /background.variant/],
    ['background', {windowLights: 'on'}, /windowLights/],
    ['actors', [{type: 'ghost', ghostVariant: 'unknown'}], /ghostVariant/],
    ['actors', [{type: 'ghost', opacity: -0.1}], /opacity/],
    ['actors', [{type: 'narrator', character: 'unknown'}], /character/],
    ['actors', [{type: 'cat', pose: 'lie'}], /pose/],
    ['props', [{type: 'furnace', x: 0.5, smoke: 2}], /smoke/],
  ];
  for (const [key, value, path] of cases) {
    const data = structuredClone(showcase) as any;
    data[0][key] = value;
    assert.throws(() => validateTimeline(data), path);
  }
});

test('camera pan stays within zoom overscan on both axes', () => {
  for (const zoom of [1, 1.1, 2, 4])
    for (const frame of [0, 30, 60]) {
      const sample = cameraAt(
        {zoom: [zoom, zoom], pan: {from: [-10, 10], to: [10, -10]}},
        frame,
        61,
      );
      assert.ok(Math.abs(sample.x) <= (sample.zoom - 1) / 2);
      assert.ok(Math.abs(sample.y) <= (sample.zoom - 1) / 2);
    }
});
