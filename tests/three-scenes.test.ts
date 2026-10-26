import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  fovForAspect,
  threeCameraAt,
  watcherPlaceNames,
  type CameraPresetName,
} from '../src/camera/Camera';
import {validateTimeline} from '../src/scenes/timeline';
import {lampFlickerAt} from '../src/three/lighting';
import {resolveThreeBackground} from '../src/three/backgrounds/registry';
import {pixelSizeToWorld, stageMetrics} from '../src/three/space';
import {windowMoonPixelPoint} from '../src/three/backgrounds/Window3D';
import {linearOutputColor} from '../src/three/color';
import {createSceneTextureLayers} from '../src/three/textureLayers';
import type {Scene} from '../src/scenes/types';
import showcase from '../scripts/haunted-house-p1.json';

const presets: CameraPresetName[] = ['dolly', 'truck', 'povCreep', 'peek', 'watcher'];

test('camera FOV uses the authored portrait and landscape values', () => {
  assert.equal(fovForAspect(1080, 1920), 62);
  assert.equal(fovForAspect(1920, 1080), 42);
});

test('display-authored colors are encoded for linear WebGL output', () => {
  assert.equal(linearOutputColor('#808080'), '#bcbcbc');
  assert.equal(linearOutputColor('#ffffff'), '#ffffff');
  assert.equal(linearOutputColor('rebeccapurple'), 'rebeccapurple');
});

test('JSON camera schema accepts every preset and rejects unknown presets', () => {
  for (const preset of presets) {
    const timeline = structuredClone(showcase) as any;
    timeline[0].camera = {preset};
    assert.doesNotThrow(() => validateTimeline(timeline));
  }

  const malformed = structuredClone(showcase) as any;
  malformed[0].camera = {preset: 'orbit'};
  assert.throws(() => validateTimeline(malformed), /camera\.preset/);
});

test('watcher camera schema accepts known foreground places and rejects misplaced values', () => {
  for (const place of watcherPlaceNames) {
    const timeline = structuredClone(showcase) as any;
    timeline[0].camera = {preset: 'watcher', place};
    assert.doesNotThrow(() => validateTimeline(timeline), place);
  }

  const invalid = structuredClone(showcase) as any;
  invalid[0].camera = {preset: 'watcher', place: 'attic'};
  assert.throws(() => validateTimeline(invalid), /camera\.place/);

  const misplaced = structuredClone(showcase) as any;
  misplaced[0].camera = {preset: 'dolly', place: 'curtains'};
  assert.throws(() => validateTimeline(misplaced), /camera\.place/);
});

test('3D camera presets are deterministic, aspect-independent poses with a dolly default', () => {
  for (const preset of presets) {
    const first = threeCameraAt(preset, 42, 90, 30);
    const second = threeCameraAt(preset, 42, 90, 30);
    assert.deepEqual(first, second);
    assert.equal(first.preset, preset);
    assert.ok([...first.position, ...first.target].every(Number.isFinite));
  }

  assert.equal(threeCameraAt(undefined, 0, 90, 30).preset, 'dolly');
});

test('each 3D camera preset moves over a shot instead of holding a static frame', () => {
  for (const preset of presets) {
    const first = threeCameraAt(preset, 0, 91, 30);
    const last = threeCameraAt(preset, 90, 91, 30);
    assert.notDeepEqual(first.position, last.position, `${preset} camera position should move`);
  }
});

test('lamp light follows the specified oscillation and briefly drops out every 97 frames', () => {
  assert.equal(lampFlickerAt(0), 1);
  assert.equal(lampFlickerAt(30), 1 + 0.25 * Math.sin(27) * Math.sin(11.1));
  assert.equal(lampFlickerAt(97), 0.15 * (1 + 0.25 * Math.sin(87.3) * Math.sin(35.89)));
  assert.equal(lampFlickerAt(100), 1 + 0.25 * Math.sin(90) * Math.sin(37));
});

test('3D scene routing selects reusable haunted-house sets and falls back elsewhere', () => {
  const timeline = structuredClone(showcase) as any;
  const scene = (bg: string, variant?: string) => ({
    ...timeline[0],
    bg,
    background: variant ? {variant} : undefined,
  });

  assert.equal(resolveThreeBackground(scene('oldHouseExterior')), 'exterior');
  assert.equal(resolveThreeBackground(scene('houseInterior', 'drawing')), 'drawingRoom');
  assert.equal(resolveThreeBackground(scene('houseInterior', 'kitchen')), 'drawingRoom');
  assert.equal(resolveThreeBackground(scene('houseInterior', 'bedroomPOV')), 'bedroom');
  assert.equal(resolveThreeBackground(scene('houseInterior', 'staircase')), 'staircase');
  assert.equal(resolveThreeBackground(scene('houseInterior', 'window')), 'window');
  assert.equal(resolveThreeBackground(scene('room')), null);
  assert.equal(resolveThreeBackground(scene('basement')), null);
});

test('3D scene routing supplies detailed texture layers and leaves unhandled sets on 2D', () => {
  const expectedLayers = [
    {variant: 'oldHouseExterior', id: 'exterior-house'},
    {variant: 'drawing', id: 'interior-furnishings'},
    {variant: 'dining', id: 'interior-furnishings'},
    {variant: 'kitchen', id: 'interior-furnishings'},
    {variant: 'staircase', id: 'stair-tread-0'},
    {variant: 'bedroomPOV', id: 'bedroom-bed-rails'},
    {variant: 'window', id: 'interior-wall-art'},
  ] as const;

  for (const {variant, id} of expectedLayers) {
    const scene = (variant === 'oldHouseExterior'
      ? showcase[0]
      : {...showcase[2], background: {variant}}) as unknown as Scene;
    const layers = createSceneTextureLayers(scene, 1080, 1920, 0, 30, 90);
    assert.ok(
      layers.some((layer) => layer.id === id),
      `${variant} should retain its 2D art`,
    );
    assert.equal(new Set(layers.map((layer) => layer.id)).size, layers.length);
  }

  assert.deepEqual(
    createSceneTextureLayers(
      {...showcase[0], bg: 'basement'} as unknown as Scene,
      1080,
      1920,
      0,
      30,
      90,
    ),
    [],
  );
});

test('window-depth actors are valid only for the reusable window scene', () => {
  const timeline = structuredClone(showcase) as any;
  const windowScene = {
    ...timeline[0],
    bg: 'houseInterior',
    background: {variant: 'window'},
    actors: [{type: 'ghost', depth: 'window', ghostVariant: 'womanBlack'}],
  };

  assert.doesNotThrow(() => validateTimeline([windowScene]));
  assert.throws(
    () => validateTimeline([{...windowScene, background: {variant: 'drawing'}}]),
    /actors\[0\]\.depth/,
  );
});

test('stage conversion preserves plane shape ratio and fills both aspect ratios at each depth', () => {
  for (const [width, height] of [
    [1080, 1920],
    [1920, 1080],
  ]) {
    const [planeWidth, planeHeight] = pixelSizeToWorld(320, 430, width, height, -4);
    assert.ok(Math.abs(planeWidth / planeHeight - 320 / 430) < 1e-12);
    const metrics = stageMetrics(width, height, -4);
    assert.ok(metrics.width > 0);
    assert.ok(metrics.height > 0);
    assert.ok(metrics.centerY < -0.8);
  }
});

test('window moon stays within its opening at both composition aspects', () => {
  const opening = {x: 0.53, y: 0.46, width: 620, height: 700};
  for (const [width, height] of [
    [1080, 1920],
    [1920, 1080],
  ]) {
    const [moonX, moonY] = windowMoonPixelPoint(
      width,
      height,
      opening.x,
      opening.y,
      opening.width,
      opening.height,
    );
    const radius = 142 / 2;
    const openingRight = width * opening.x + opening.width / 2 - 34;
    const openingTop = height * opening.y - opening.height / 2 + 34;
    const openingBottom = height * opening.y + opening.height / 2 - 34;

    assert.ok(moonX - radius > width * opening.x - opening.width / 2 + 34);
    assert.ok(moonX + radius < openingRight);
    assert.ok(moonY - radius > openingTop);
    assert.ok(moonY + radius < openingBottom);
  }
});
