import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Footer} from '../src/scenes/Footer';
import {captionLayout} from '../src/scenes/captionLayout';
import {cameraAt, impactAt} from '../src/camera/Camera';
import {validateTimeline, layoutActor} from '../src/scenes/timeline';
import {BedroomPOV, bedroomPOVAt, bedEndPlacement} from '../src/assets/backgrounds/BedroomPOV';
import type {Scene} from '../src/scenes/types';

const room: Scene = {
  durationSec: 4,
  bg: 'houseInterior',
  background: {variant: 'staircase'},
  actors: [],
  subtitle: 'เงาที่ปลายเตียง',
};
test('footer renders Thai default, override, and explicitly hidden labels in both formats', () => {
  for (const [width, height] of [
    [1080, 1920],
    [1920, 1080],
  ]) {
    for (const [channelName, label] of [
      [undefined, 'ทำไมล่ะ'],
      ['Custom channel', 'Custom channel'],
      [null, null],
      [false, null],
    ] as const) {
      const html = renderToStaticMarkup(
        createElement(Footer, {
          width,
          height,
          index: 0,
          total: 1,
          progress: 0.5,
          night: true,
          channelName,
        }),
      );
      if (label) assert.ok(html.includes(label));
      else assert.ok(!html.includes('data-channel-label'));
      const options = [{...room, channelName}];
      assert.doesNotThrow(() => validateTimeline(options));
    }
    const layout = captionLayout(width, height);
    assert.ok(layout.subtitleBottom > layout.footerBottom + layout.footerHeight + 8);
  }
});
test('top-down validator accepts the authored staircase only', () => {
  assert.doesNotThrow(() =>
    validateTimeline([{...room, background: {variant: 'staircase'}, camera: {view: 'topDown'}}]),
  );
  for (const variant of ['drawing', 'dining', 'kitchen', 'bedroomPOV'])
    assert.throws(
      () => validateTimeline([{...room, background: {variant}, camera: {view: 'topDown'}}]),
      /camera.view.*staircase/,
    );
  assert.throws(
    () => validateTimeline([{...room, background: {variant: 'bedroom' as never}}]),
    /background.variant/,
  );
  for (const bg of ['forest', 'oldHouseExterior', 'basement'])
    assert.throws(
      () => validateTimeline([{...room, bg, background: undefined, camera: {view: 'topDown'}}]),
      /camera.view.*houseInterior/,
    );
});
test('bedroom POV depth motion and blanket pull remain deterministic when seeking', () => {
  const start = bedroomPOVAt(0, 30, 121, [0, 1]);
  const end = bedroomPOVAt(120, 30, 121, [0, 1]);
  assert.equal(start.pull, 0);
  assert.equal(end.pull, 1);
  const midway = bedroomPOVAt(60, 30, 121, [0, 1]);
  assert.equal(midway.pull, 0.5);
  assert.ok(Math.abs(midway.blanketY) > Math.abs(midway.figuresY));
  assert.ok(Math.abs(midway.figuresY) > Math.abs(midway.wallY));
  assert.deepEqual(bedroomPOVAt(60, 30, 121, [0, 1]), midway);
  for (const [width, height] of [
    [1080, 1920],
    [1920, 1080],
  ]) {
    const actor = {
      type: 'ghost' as const,
      ghostVariant: 'seatedPair' as const,
      depth: 'bedEnd' as const,
    };
    const base = layoutActor(actor, 0.5, width, height);
    const placed = bedEndPlacement(base, actor, height, midway);
    assert.ok(placed.scale < base.scale);
    assert.ok(placed.y < height * 0.6);
    const html = renderToStaticMarkup(
      createElement(
        BedroomPOV,
        {width, height, frame: 60, fps: 30, duration: 121, options: {blanketPull: [0, 1]}},
        createElement('div', null, 'ghosts'),
      ),
    );
    const layers = ['back-wall', 'bed-end', 'figures', 'blanket'].map((name) =>
      html.indexOf(`data-depth="${name}"`),
    );
    assert.ok(layers.every((index) => index >= 0));
    assert.deepEqual(
      layers,
      [...layers].sort((a, b) => a - b),
    );
    assert.ok(html.indexOf('ghosts') < layers[3]);
    assert.ok(html.includes('data-duvet-edge="only"'));
    assert.doesNotMatch(html, /M210 1810|M355 1480/);
  }
});
test('POV impact adds a bounded camera shake and shadow flicker without moving captions', () => {
  const impact = {atSec: 1.5};
  assert.deepEqual(impactAt(undefined, 45, 30), {x: 0, y: 0, flicker: 0});
  assert.ok(impactAt(impact, 50, 30).flicker > 0);
  assert.deepEqual(impactAt(impact, 100, 30), {x: 0, y: 0, flicker: 0});
  assert.notDeepEqual(cameraAt({}, 50, 121, 30, impact), cameraAt({}, 50, 121));
  const pov = {
    ...room,
    background: {variant: 'bedroomPOV', blanketPull: [0, 1]},
    actors: [{type: 'ghost', ghostVariant: 'seatedPair', depth: 'bedEnd'}],
    impact,
  };
  assert.doesNotThrow(() => validateTimeline([pov]));
  assert.throws(() => validateTimeline([{...room, impact}]), /impact/);
  assert.throws(() => validateTimeline([{...pov, impact: {atSec: 4}}]), /impact.atSec/);
  const html = renderToStaticMarkup(
    createElement(BedroomPOV, {
      width: 1080,
      height: 1920,
      frame: 50,
      fps: 30,
      duration: 121,
      options: {blanketPull: [0, 1]},
      impact,
    }),
  );
  assert.ok(html.includes('data-impact-flicker'));
});
test('POV scene JSON validates bounded pull and rejects misplaced depth controls', () => {
  const pov = {
    ...room,
    background: {variant: 'bedroomPOV', blanketPull: [0, 1]},
    actors: [{type: 'ghost', ghostVariant: 'seatedPair', depth: 'bedEnd'}],
  };
  assert.doesNotThrow(() => validateTimeline([pov]));
  for (const blanketPull of [-1, 2, [0, 2], [0], NaN, 'pull'])
    assert.throws(
      () => validateTimeline([{...pov, background: {...pov.background, blanketPull}}]),
      /blanketPull/,
    );
  assert.throws(() => validateTimeline([{...pov, background: {variant: 'staircase'}}]), /depth/);
  assert.throws(
    () => validateTimeline([{...pov, background: {variant: 'bedroom' as never}, actors: []}]),
    /background.variant/,
  );
  assert.throws(() => validateTimeline([{...room, channelName: 2}]), /channelName/);
});
