import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {GUNNER1, GUNNER_JOLT, GUNNER_REACH, gunnerCheck, gunnerReach, gunnerShoulders, paintSeatedGunner} from '../src/painted/edu30/cast';
import {GUNNER_PROOFS, gunnerProofAt} from '../src/painted/edu30/proof-cast';
import {makePainter} from '../src/painted/kit/painter';
import {camUnit} from '../src/painted/kit/ycam';

// EDU-EP30-SHORT ticket T11 r3: GUNNER-1 `new: seated-gunner` reach, arm bones, jolt and lead height in the four views on the ticket's proof cameras.
const dry = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const BY = Object.fromEntries(GUNNER_PROOFS.map((d) => [d.id, d]));
const at = (id: string, L: number) => ({d: BY[id], ...gunnerProofAt(BY[id], L)});
const opts = (id: string, L: number) => { const x = at(id, L); return {x, o: {view: x.d.view, grip: x.a.grip, stock: x.a.stock, jolt: x.jolt, t: 1.2, seed: 33200}}; };

test('reach: each wrist target within 0.52 m of its world shoulder after the lean (j 0); at the jolt peak (j 1) within 1.05 x 2 bones', () => {
  for (const id of Object.keys(BY)) for (const L of [0, 1]) {
    const {d, a, jolt} = at(id, L), r = gunnerReach(GUNNER1, d.seat, a.grip, a.stock, jolt);
    console.log(`reach ${id} j${jolt}: r ${r.r.toFixed(3)} l ${r.l.toFixed(3)}`);
    const lim = jolt ? GUNNER_REACH * 1.05 : GUNNER_REACH;
    assert.ok(r.r <= lim && r.l <= lim, `${id} j${jolt}: ${r.r.toFixed(3)} / ${r.l.toFixed(3)}`);
  }
});

test('arm ratio: longest drawn bone <= 1.05 x the 0.26 m bone at j 0 and j 1, all four views', () => {
  for (const id of Object.keys(BY)) for (const L of [0, 1]) {
    const {x, o} = opts(id, L), k = gunnerCheck(x.d.cam, GUNNER1, x.d.seat, o);
    assert.ok(k, id);
    console.log(`arm ratio ${id} j${x.jolt}: r ${k.rRatio.toFixed(3)} l ${k.lRatio.toFixed(3)}`);
    assert.ok(k.rRatio <= 1.05 && k.lRatio <= 1.05, `${id} j${x.jolt}`);
    // hand-drawing section 1: the right arm is screen left facing the lens (front, 3/4), screen right from behind
    if (x.d.view !== 'right') assert.equal(k.rShoulder[0] < k.lShoulder[0], x.d.view !== 'back', `${id}: right shoulder side`);
  }
});

test('jolt: world shoulders move 0.015 m along -barrel at j 1, half at j 0.5; drawn shift in the profile view is 0.012-0.018 m', () => {
  const {x} = opts('C30-gunner-right', 0), {d, a} = x;
  const w = (j: number) => gunnerShoulders(GUNNER1, d.seat, a.grip, a.stock, j);
  assert.ok(Math.abs(w(0).r[0] - w(1).r[0] - GUNNER_JOLT) < 1e-9 && Math.abs(w(0).r[0] - w(0.5).r[0] - GUNNER_JOLT / 2) < 1e-9);
  const k = (j: number) => gunnerCheck(d.cam, GUNNER1, d.seat, {view: 'right', grip: a.grip, stock: a.stock, jolt: j, t: 1.2, seed: 33200})!;
  const shift = (k(0).shoulder[0] - k(1).shoulder[0]) / camUnit(d.cam, d.seat);
  console.log(`profile shoulder shift at j 1: ${shift.toFixed(4)} m`);
  assert.ok(shift >= 0.012 && shift <= 0.018, `shift ${shift}`);
  const b = opts('C30-gunner-back', 0), cb = (j: number) => gunnerCheck(b.x.d.cam, GUNNER1, b.x.d.seat, {...b.o, jolt: j})!;
  console.log(`back view shoulder px at j0 ${cb(0).shoulder[0].toFixed(2)} j1 ${cb(1).shoulder[0].toFixed(2)} (scale ${camUnit(b.x.d.cam, b.x.d.seat).toFixed(0)} px/m)`);
});

// the lead is read to the visible top of the figure, the slouch hat crown, 0.1 - 0.14 x 0.86 = -0.0204 U above the head top anchor (`paintHat`)
const HAT_ABOVE_HEAD = 0.0204;
test('lead height (hat top): front at the LF01 camera within 5 % of the legacy (LF01a) drawing, 3/4 at the B04-SH06 start 593 +- 30 px', () => {
  const lead = (id: string, grip: boolean) => {
    const {x, o} = opts(id, 0), r = paintSeatedGunner(dry(), x.d.cam, GUNNER1, x.d.seat, grip ? o : {view: o.view, t: 1.2, seed: 33200});
    return r!.bottom - r!.top + HAT_ABOVE_HEAD * camUnit(x.d.cam, x.d.seat);
  };
  const old = lead('C30-gunner-front', false), now = lead('C30-gunner-front', true), q = lead('C30-gunner-34', true);
  console.log(`lead front legacy ${old.toFixed(1)} new ${now.toFixed(1)}; 3/4 ${q.toFixed(1)}`);
  assert.ok(Math.abs(now / old - 1) <= 0.05, `front ${now} vs ${old}`);
  assert.ok(Math.abs(q - 593) <= 30, `3/4 ${q}`);
});
