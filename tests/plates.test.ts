import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FALL} from '../src/painted/kit/fall';
import {PLATES, findPlates, plateStill} from '../src/painted/kit/plates';
import {paintedShotIds} from '../src/painted/registry';

const LAYER = new RegExp(`^(ENV-SKY|ENV-FOG|ENV-GLOW|ENV-SEA|ENV-EARTH|ENV-GLITTER|ENV-FALL:(${Object.keys(FALL).join('|')}))$`);

test('every plate entry is complete and points at a registered shot', () => {
  assert.ok(PLATES.length >= 20);
  assert.equal(new Set(PLATES.map((p) => p.id)).size, PLATES.length, 'unique ids');
  for (const p of PLATES) {
    assert.match(p.id, /^PL-[A-Z]+-[A-Z0-9-]+$/, p.id);
    assert.ok(p.id.startsWith(`PL-${p.episode}-`), `${p.id} episode prefix`);
    assert.ok(paintedShotIds.includes(p.shot), `${p.id}: shot ${p.shot} is not registered`);
    assert.ok(p.t >= 0, `${p.id} t`);
    assert.ok(p.title.trim().length > 0, `${p.id} title`);
    assert.ok(p.mood.length >= 1 && p.mood.length <= 4, `${p.id} mood tags`);
    assert.ok(p.palette.length >= 3 && p.palette.length <= 5 && p.palette.every((c) => /^#[0-9a-f]{6}$/.test(c)), `${p.id} palette`);
    assert.ok(p.kitLayers.every((l) => LAYER.test(l)), `${p.id} kitLayers ${p.kitLayers.join(',')}`);
  }
});

test('findPlates filters by every field and plateStill names the store path', () => {
  const night = findPlates({time: 'night'});
  assert.ok(night.length > 0 && night.every((p) => p.time === 'night'));
  const snow = findPlates({layer: 'ENV-FALL'});
  assert.ok(snow.every((p) => p.kitLayers.some((l) => l.startsWith('ENV-FALL:'))));
  const first = PLATES[0];
  assert.deepEqual(findPlates({episode: first.episode, kind: first.kind, time: first.time, mood: first.mood[0]}).map((p) => p.id).includes(first.id), true);
  assert.equal(plateStill('PL-X-Y'), 'projects/KIT/plates/PL-X-Y.png');
});
