import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {frontOf, hullOf, hullsOverlap, intersects} from '../src/painted/everyone-gone/ep02/collide';
import {
  BENCH_CLEAR, BENCH_DEPTH, BENCH_SEAT, BOAT, PIER_BENCHES, benchBox, PIER_BOUNDS, SEAT_TOL, YW_CAM, YW_YOU, paintPier, pierLayout, ywSolids, type State,
} from '../src/painted/everyone-gone/ep02/places';
import {makePainter} from '../src/painted/kit/painter';
import {proj} from '../src/painted/everyone-gone/space';

// EG-EP02 crowd collision and occlusion rule VD13 (brief EG2-BRIEF-FILM-R1.3; user notes 3 Nov 2026: "people go through the
// bench" on S05-B01-SH01, "the boat passes through the pier" on LF03/LF05). Checks every pier state, not only rendered frames.
const STATES: State[] = ['empty', 'crowd', 'mother'];

for (const state of STATES) {
  const L = pierLayout(state);
  const standing = L.people.filter((q) => q.bench === undefined);
  const seated = L.people.filter((q) => q.bench !== undefined);

  test(`pier ${state}: no standing person intersects a solid`, () => {
    for (const q of standing) for (const s of L.solids) assert.ok(!intersects(q.box, s.box), `${q.id} at ${q.at} intersects ${s.id}`);
  });

  test(`pier ${state}: a walker drawn over a bench or a sitter is clearly in front of or behind it (no feet on a seat)`, () => {
    const bad: string[] = [];
    const benchParts = [...PIER_BENCHES.map((b, k) => ({id: `bench${k}`, box: benchBox(b)})), ...seated];
    for (const q of standing) for (const s of benchParts) {
      if (!hullsOverlap(hullOf(L.cam, q.box), hullOf(L.cam, s.box))) continue;
      const gap = Math.max(s.box.z0 - q.box.z1, q.box.z0 - s.box.z1);
      if (gap < BENCH_CLEAR) bad.push(`${q.id} at ${q.at} overlaps ${s.id} in the picture with ${gap.toFixed(2)} m depth gap`);
    }
    assert.deepEqual(bad, []);
  });

  test(`pier ${state}: people do not intersect each other`, () => {
    for (let i = 0; i < L.people.length; i++) for (let j = i + 1; j < L.people.length; j++) {
      const a = L.people[i], b = L.people[j];
      assert.ok(!intersects(a.box, b.box), `${a.id} at ${a.at} intersects ${b.id} at ${b.at}`);
    }
  });

  test(`pier ${state}: sitters sit on a bench seat at the right height`, () => {
    for (const q of seated) {
      const b = PIER_BENCHES[q.bench!];
      assert.ok(Math.abs(q.seatV! - BENCH_SEAT) <= SEAT_TOL, `${q.id} seat ${q.seatV!.toFixed(3)} vs bench ${BENCH_SEAT}`);
      assert.ok(q.hipX! >= b.x + 0.1 && q.hipX! <= b.x + BENCH_DEPTH - 0.05, `${q.id} hip x ${q.hipX!.toFixed(2)} off the seat ${b.x}..${b.x + BENCH_DEPTH}`);
      assert.ok(q.at[2] >= b.z0 + 0.2 && q.at[2] <= b.z1 - 0.2, `${q.id} z ${q.at[2]} off the bench ${b.z0}..${b.z1}`);
    }
  });

  test(`pier ${state}: people stay on the deck, on the camera side of the rail and wall`, () => {
    for (const q of L.people) {
      assert.ok(q.box.x0 > PIER_BOUNDS.edge + 0.05 && q.box.x1 < PIER_BOUNDS.wall - 0.05, `${q.id} x ${q.box.x0.toFixed(2)}..${q.box.x1.toFixed(2)}`);
      assert.ok(q.box.z0 > PIER_BOUNDS.end && q.box.z1 < PIER_BOUNDS.near, `${q.id} z`);
      assert.ok(q.box.y1 < PIER_BOUNDS.roof - 1, `${q.id} height`);
    }
  });

  test(`pier ${state}: paint order puts the nearer of every overlapping pair later`, () => {
    const idx = new Map(L.order.map((o, i) => [o.id, i]));
    for (let i = 0; i < L.order.length; i++) for (let j = i + 1; j < L.order.length; j++) {
      const a = L.order[i], b = L.order[j];
      if (!hullsOverlap(hullOf(L.cam, a.box), hullOf(L.cam, b.box))) continue;
      const f = frontOf(L.cam, a.box, b.box);
      if (f === 1) assert.ok(idx.get(a.id)! > idx.get(b.id)!, `${a.id} is in front of ${b.id} but painted first`);
    }
  });

  test(`pier ${state}: paints without error`, () => {
    const brush = new Proxy({}, {get: () => () => {}}) as Brush;
    paintPier(makePainter(brush, {t: 0, frame: 0}), state);
  });
}

test('pier: the boat floats beside the deck with water between, clear of every deck solid', () => {
  assert.ok(BOAT.x1 <= PIER_BOUNDS.edge - 0.5, `hull at x ${BOAT.x1}, deck edge ${PIER_BOUNDS.edge}`);
  assert.ok(BOAT.y0 < -0.3, 'hull reaches the water below the deck');
  for (const s of pierLayout('crowd').solids) if (s.id !== 'boat') assert.ok(!intersects(BOAT, s.box), `boat intersects ${s.id}`);
});

test('Yaowarat: `คุณ` stands clear of the shrine, pole, lamps and signs', () => {
  const you = {x0: YW_YOU[0] - 0.3, x1: YW_YOU[0] + 0.3, y0: 0, y1: 1.7, z0: YW_YOU[2] - 0.2, z1: YW_YOU[2] + 0.2};
  for (const s of ywSolids()) assert.ok(!intersects(you, s.box), `you intersects ${s.id}`);
  assert.ok(proj(YW_CAM, YW_YOU)[1] < 1920);
});
