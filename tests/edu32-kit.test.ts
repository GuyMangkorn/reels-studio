import assert from 'node:assert/strict';
import {test} from 'node:test';
import {b04Cat} from '../src/painted/edu32/b04-sh01';
import {catDef, paintSparrow as paintEpisodeSparrow} from '../src/painted/edu32/cast';
import {pictureGaitClock as episodeGaitClock} from '../src/painted/edu32/field-cat';
import {edu32Shots} from '../src/painted/shots/edu32';
import {ANIMALS as BASE_ANIMALS} from '../src/painted/kit/animals';
import {ANIMALS, ANIMAL_IDS, ANIMAL_INFO} from '../src/painted/kit/animals-catalog';
import {paintEarMic} from '../src/painted/kit/ear-mic';
import {catLoafGetUp, pictureGaitClock} from '../src/painted/kit/motions-edu32';
import {recordingPainter} from '../src/painted/kit/paper-card';
import {PLATES, plateStill} from '../src/painted/kit/plates';
import type {V3} from '../src/painted/kit/space';
import {paintSparrow} from '../src/painted/kit/sparrow';
import type {YCam} from '../src/painted/kit/ycam';

const camera: YCam = {x: 0, y: 0.5, z: 2, yaw: 0, pitch: -0.1, f: 980, hy: 500};
const def = ANIMALS['cat-gray-tabby-longhair'];

test('the long-haired tabby copies the approved coat at kit scale', () => {
  assert.deepEqual(def, catDef(1));
  assert.equal(ANIMALS['cat-gray-tabby'], BASE_ANIMALS['cat-gray-tabby']);
  assert.ok(ANIMAL_IDS.includes('cat-gray-tabby-longhair'));
  assert.match(ANIMAL_INFO['cat-gray-tabby-longhair'].description, /Long-haired/);
});

test('the loaf get-up matches the approved sampled pose and holds both endpoints', () => {
  for (let frame = 52; frame < 60; frame++) {
    assert.deepEqual(catLoafGetUp((frame - 52) / 8), b04Cat(frame).pose);
  }
  assert.deepEqual(catLoafGetUp(-1), catLoafGetUp(0));
  assert.deepEqual(catLoafGetUp(2), {view: 'left', from: 'lie', state: 'stand', blend: 1, loaf: 0, lid: 0});
});

test('the profile walk clock matches the episode and excludes motion of the camera alone', () => {
  const path = (f: number): V3 => [f / 100, 0, f / 200];
  const camAt = (f: number): YCam => ({...camera, x: f / 50});
  for (const f of [0, 0.3, 5, 14.25]) {
    assert.equal(pictureGaitClock(def, path, camAt, 0, f), episodeGaitClock(def, path, camAt, 0, f));
  }
  assert.equal(pictureGaitClock(def, () => [0, 0, 0], camAt, 0, 10), 0);
});

test('the sparrow copies perch and flight geometry in both directions', () => {
  for (const dir of [-1, 1] as const) {
    for (const pose of [{tail: 0.7}, {fly: true, flap: 0}, {fly: true, flap: 1}]) {
      const original = recordingPainter(), copy = recordingPainter();
      const at: V3 = [0, 0, 0];
      const extent = paintSparrow(copy.p, camera, at, 100, dir, 0.2, pose);
      assert.ok(extent && extent.top < extent.bottom);
      assert.deepEqual(extent, paintEpisodeSparrow(original.p, camera, at, 100, dir, 0.2, pose));
      assert.deepEqual(copy.shapes, original.shapes);
    }
  }
});

test('the ear-mic capsule has a body, lit side, copper collar and a single highlight', () => {
  const copy = recordingPainter();
  paintEarMic(copy.p, 100, [10, 10], [20, 30], 8);
  assert.equal(copy.shapes.polys.length, 3);
  assert.equal(copy.shapes.lines.length, 1);
  assert.ok(copy.shapes.lines[0][0][1] < copy.shapes.lines[0][1][1]);
});

test('eight gallery plates reference registered episode shots and distinct store stills', () => {
  const entries = PLATES.filter(({id}) => id.startsWith('PL-EDU-32-'));
  assert.equal(entries.length, 8);
  assert.equal(new Set(entries.map(({id}) => plateStill(id))).size, entries.length);
  for (const {id, shot, t} of entries) {
    assert.ok(edu32Shots.some((entry) => entry.id === shot), id);
    assert.ok(Number.isFinite(t) && t >= 0, id);
    assert.equal(plateStill(id), `projects/shared/KIT/plates/${id}.png`);
  }
});
