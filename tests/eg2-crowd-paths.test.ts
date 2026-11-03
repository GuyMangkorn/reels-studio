import {test} from 'node:test';
import assert from 'node:assert/strict';
import {frontOf, hullOf, hullsOverlap, intersects} from '../src/painted/everyone-gone/ep02/collide';
import {YW_CROWD} from '../src/painted/everyone-gone/ep02/crowds';
import {VM_CROWD, VM_YOU_FRAMES, vmYouAt} from '../src/painted/everyone-gone/ep02/monument';
import {SOI_CROWD, soiYouAt} from '../src/painted/everyone-gone/ep02/soi-wide';
import {PIER_BOUNDS, pierLayout} from '../src/painted/everyone-gone/ep02/places';
import {crowdViolations} from '../src/painted/everyone-gone/ep02/walk';

import {EG2_FRAMES, EG2_SHOTS, FLIP, hoodPull, sheetFlip} from '../src/painted/everyone-gone/ep02/sheet';

// EG-EP02 W5.2 (Boss): VD13 on EVERY frame of each crowd cue (not only the end states), plus the sheet flip and hood pull as pure,
// deterministic functions of the shot-local frame.

const range = (a: number, b: number) => Array.from({length: b - a + 1}, (_, i) => a + i);

for (const [name, set] of [['Yaowarat', YW_CROWD], ['monument', VM_CROWD], ['soi', SOI_CROWD]] as const) {
  test(`${name} crowd cue ${set.cue[0]}..${set.cue[1]}: no person intersects a solid, another person or the lead; paint order is consistent, every frame`, () => {
    const bad: string[] = [];
    for (const f of range(set.cue[0], set.cue[1])) for (const v of crowdViolations(set, f)) bad.push(`f${f}: ${v}`);
    assert.deepEqual(bad.slice(0, 12), []);
  });
}

test('pier crowd (S04-B01-SH06, ref 35, f 6..35): people clear of solids and each other; `คุณ` is never painted over by a person in front of her', () => {
  const bad: string[] = [];
  for (const f of range(6, 35)) {
    const L = pierLayout('crowd', {f, ref: 35});
    for (let i = 0; i < L.people.length; i++) {
      const a = L.people[i];
      if (a.bench === undefined) for (const s of L.solids) if (intersects(a.box, s.box)) bad.push(`f${f}: ${a.id} intersects ${s.id}`);
      for (let j = i + 1; j < L.people.length; j++) if (intersects(a.box, L.people[j].box)) bad.push(`f${f}: ${a.id} intersects ${L.people[j].id}`);
      assert.ok(a.box.x0 > PIER_BOUNDS.edge + 0.05 && a.box.x1 < PIER_BOUNDS.wall - 0.05, `f${f} ${a.id} off the deck`);
    }
    const you = L.order.find((o) => o.id === 'you')!;
    for (const o of L.order) if (o.id !== 'you' && hullsOverlap(hullOf(L.cam, o.box), hullOf(L.cam, you.box)) && frontOf(L.cam, o.box, you.box) === 1) bad.push(`f${f}: ${o.id} is in front of you`);
  }
  assert.deepEqual(bad.slice(0, 12), []);
});

test('pier mother (S05-B01-SH01, f 0..298): people clear of solids and each other on every frame', () => {
  const bad: string[] = [];
  for (const f of range(0, 298)) {
    const L = pierLayout('mother', {f, ref: 0});
    for (let i = 0; i < L.people.length; i++) {
      const a = L.people[i];
      if (a.bench === undefined) for (const s of L.solids) if (intersects(a.box, s.box)) bad.push(`f${f}: ${a.id} intersects ${s.id}`);
      for (let j = i + 1; j < L.people.length; j++) if (intersects(a.box, L.people[j].box)) bad.push(`f${f}: ${a.id} intersects ${L.people[j].id}`);
    }
  }
  assert.deepEqual(bad.slice(0, 12), []);
});

test('pier empty: pigeons never intersect a solid on any frame of S01-B02-SH03 and S02-B01-SH04', () => {
  const bad: string[] = [];
  for (const f of range(0, 290)) {
    const L = pierLayout('empty', {f});
    const pigeons = L.solids.filter((s) => s.id.startsWith('pigeon'));
    for (const g of pigeons) for (const s of L.solids) if (s !== g && !s.id.startsWith('pigeon') && intersects(g.box, s.box)) bad.push(`f${f}: ${g.id} intersects ${s.id}`);
  }
  assert.deepEqual(bad.slice(0, 8), []);
});

test('the lead walks inside the walkable ground in S01-B02-SH02 and the soi entrance, ending where the crowd shots start her', () => {
  assert.deepEqual(vmYouAt(VM_YOU_FRAMES), vmYouAt(VM_YOU_FRAMES + 50));
  assert.deepEqual(soiYouAt(148), soiYouAt(200));
  assert.ok(vmYouAt(0)[0] < vmYouAt(VM_YOU_FRAMES)[0]);
});

test('sheetFlip: deterministic, edge-on mid-flip, face swaps once, overshoot <= 2 px, settled and hanging states', () => {
  for (const f of range(-2, 40)) assert.deepEqual(sheetFlip(f), sheetFlip(f));
  const mid = Math.round((FLIP.start + FLIP.end) / 2);
  assert.ok(sheetFlip(mid).width < 0.1, `edge-on at f${mid}: ${sheetFlip(mid).width}`);
  const faces = range(0, 40).map((f) => sheetFlip(f).face);
  assert.equal(faces.filter((v, i) => i > 0 && v !== faces[i - 1]).length, 1, 'the face swaps exactly once');
  assert.equal(sheetFlip(0).face, 'back');
  assert.equal(sheetFlip(40).face, 'front');
  for (const f of range(0, 40)) assert.ok(sheetFlip(f).width <= 1 + 2 / 420, `f${f} overshoot ${sheetFlip(f).width}`);
  const hang = sheetFlip(-1);
  assert.equal(hang.face, 'back');
  assert.ok(hang.droop > 0.5, 'the loose top sheet hangs');
  const settled = sheetFlip(FLIP.settleEnd + 10);
  assert.ok(Math.abs(settled.width - 1) < 0.01 && Math.abs(settled.dy) < 0.5);
});

test('hoodPull: deterministic; hands up by f45, hood swaps at f60, hands released by f70', () => {
  for (const f of range(0, 78)) assert.deepEqual(hoodPull(f), hoodPull(f));
  assert.ok(hoodPull(45).arms > 0.95);
  assert.equal(hoodPull(59).hoodUp, false);
  assert.equal(hoodPull(60).hoodUp, true);
  assert.ok(hoodPull(70).arms < 0.01 && hoodPull(0).arms === 0);
});

test('SS-R2.1: 19 shots, 1939 frames, S03-B01-SH02 is 74', () => {
  assert.equal(EG2_SHOTS.length, 19);
  assert.equal(EG2_SHOTS.reduce((a, [, n]) => a + n, 0), 1939);
  assert.equal(EG2_FRAMES['S03-B01-SH02'], 74);
});
