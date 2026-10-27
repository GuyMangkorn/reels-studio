import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {layoutWorldActor, orthographicViewAt} from '../src/scenes/projection';
import longTimeline from '../scripts/cat-boxes/blockout-long.json';
import type {Actor, OrthographicProjection} from '../src/scenes/types';

test('Long timeline retains the pre-Short-correction snapshot and cat scale', () => {
  const bytes = readFileSync('scripts/cat-boxes/blockout-long.json');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), 'e9f06242a67d1a7c67b031d9ba429dd64cce2c0a773b09a1e7c8a13cb54432a5');
  const scene = longTimeline.at(-1)!;
  const actor = scene.actors.find(a => a.type === 'cat') as Actor;
  const view = orthographicViewAt(scene.projection as OrthographicProjection, 1920, 1080, 0, 30, false);
  const layout = layoutWorldActor(actor, {x: 0, y: 0}, view);
  assert.ok(Math.abs(layout.scale * 208 / view.pixelsPerMeter - 0.45) < 1e-10);
});
