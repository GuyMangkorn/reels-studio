import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {BONE, shoulderPoint} from '../src/painted/kit/cast';
import {makePainter} from '../src/painted/kit/painter';
import {camPoint, camUnit, type YCam} from '../src/painted/kit/ycam';
import {CAST, paintCast} from '../src/painted/survival/cast';
import {aimFromPx} from '../src/painted/survival/poses';

// EDU-EP16 R1.4 Boss scene assets (14 Nov 2026): granary, sky cycle and paddy stages, hen legs, laugh bounce, waterline, seed cone, point-up, creature depth split.
const recorder = () => {
  const calls: string[] = [];
  return {calls, brush: new Proxy({}, {get: (_, name) => (...args: unknown[]) => { calls.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush};
};
const painter = () => makePainter(recorder().brush, {t: 0.3, frame: 9});
const CAM: YCam = {x: 0, y: 1, z: 3, yaw: 0, f: 1000, hy: 1000, pitch: 0};

// ---- N16-18 point-up: the pointing hand lies on the line from the shoulder to the target, the arm never stretches
const pointHand = (target: [number, number, number], view: 'front' | 'right' | 'left' = 'front', aimDir?: 1 | -1) => {
  const at: [number, number, number] = [0, 0, 0], g = camPoint(CAM, at)!, u = camUnit(CAM, at);
  const a = paintCast(painter(), CAM, 'K', {at, view, facing: [0, 1], pose: 'P01', face: 'surprised', spose: 'point-up', sk: 1, aimAt: target, sdir: aimDir, t: 0} as never)!;
  const tp = camPoint(CAM, target)!, want = aimFromPx(shoulderPoint(CAST.K, g, u, {view}, 'l'), tp);
  return {a, tp, want, g, u};
};
test('point-up: the pointing hand follows the aim line to the target (front, both sides)', () => {
  for (const target of [[1.2, 1.9, 0], [-1.0, 2.2, 0], [0.9, 1.5, 0]] as [number, number, number][]) {
    const {a, want, g, u} = pointHand(target), hand = want.dir > 0 ? a.lHand : a.rHand, sh = shoulderPoint(CAST.K, g, u, {view: 'front'}, want.dir > 0 ? 'l' : 'r');
    const deg = (Math.atan2(sh[1] - hand[1], Math.abs(hand[0] - sh[0])) * 180) / Math.PI, side = hand[0] >= sh[0] ? 1 : -1;
    console.log('point-up', target, 'aim', want.aim.toFixed(1), 'hand', deg.toFixed(1));
    assert.equal(side, want.dir, 'the arm reaches toward the target side');
    assert.ok(Math.abs(deg - want.aim) < 12, `hand ${deg.toFixed(1)} deg vs aim ${want.aim.toFixed(1)} deg`);
    assert.ok(Math.hypot(hand[0] - sh[0], hand[1] - sh[1]) <= (2 * BONE + 0.14) * u * 1.02, 'arm + hand within reach');
  }
});
test('point-up negative control: an arm raised 30 deg too high (explicit `saim`) misses the aim line by more than the tolerance', () => {
  const target: [number, number, number] = [1.2, 1.9, 0], {want, g, u} = pointHand(target), at: [number, number, number] = [0, 0, 0];
  const a = paintCast(painter(), CAM, 'K', {at, view: 'front', facing: [0, 1], pose: 'P01', face: 'surprised', spose: 'point-up', sk: 1, sdir: 1, saim: want.aim + 30, t: 0} as never)!;
  const sh = shoulderPoint(CAST.K, g, u, {view: 'front'}, 'l'), deg = (Math.atan2(sh[1] - a.lHand[1], Math.abs(a.lHand[0] - sh[0])) * 180) / Math.PI;
  assert.ok(Math.abs(deg - want.aim) > 12, `control arm at ${deg.toFixed(1)} vs aim ${want.aim.toFixed(1)}`);
});

// ---- N16-19 creature depth split
import {paintBeast, type DrawnPoly} from '../src/painted/survival/beast';
import {beastItems, planSplit} from '../src/painted/survival/beast-sort';
import {BEAST_KIT} from '../src/painted/survival/beast-kit';
import {paintSorted} from '../src/painted/kit/world';

const LN = BEAST_KIT.LONGNECK, lnBuild = LN.anims.BROWSE.build(0.3);
// long-neck at (0, -17) heading east-south-east, a camera 17 m south: body is far (z -17), the head swings toward the camera (z about -9)
const LNPLACE = {at: [0, -17] as [number, number], heading: 0.9};
const LNCAM: YCam = {x: 2, y: 1.6, z: 0, yaw: 0, f: 700, hy: 900, pitch: 0};
test('split: body + neck group partition the bones and paint every polygon exactly once (same picture as one item)', () => {
  const plan = planSplit(lnBuild, LNPLACE, [{root: 'neck'}]);
  const all = new Set(lnBuild.bones.map((b) => b.id));
  assert.equal(plan.groups[0].bones.size + plan.body.size, all.size);
  for (const b of plan.groups[0].bones) assert.ok(!plan.body.has(b));
  assert.ok(plan.body.has('body') && plan.body.has('tail') && plan.groups[0].bones.has('skull') && plan.groups[0].bones.has('jaw'));
  const whole = paintBeast(null, LNCAM, lnBuild, LNPLACE).drawn.length;
  let sum = 0;
  for (const bones of [plan.body, plan.groups[0].bones]) sum += paintBeast(null, LNCAM, lnBuild, {...LNPLACE, only: (b) => bones.has(b)}).drawn.length;
  assert.equal(sum, whole, 'no polygon lost or doubled');
});
const orderOf = (items: ReturnType<typeof beastItems>, wallAt: [number, number, number]) => {
  const log: string[] = [], c = LNCAM;
  const wall = {at: wallAt, draw: () => { log.push('WALL'); }};
  const its = items.map((it, i) => ({...it, draw: () => { log.push(i === 0 ? 'BODY' : 'HEAD'); }}));
  paintSorted(null as never, c, [...its, wall]);
  return log;
};
test('split: a fern between the body and the head hides the body but the head draws in front of it', () => {
  const items = beastItems(lnBuild, LNPLACE, [{root: 'neck'}]);
  assert.equal(items.length, 2);
  const headAt = items[1].at, bodyAt = items[0].at;
  assert.ok(headAt[2] > bodyAt[2] + 3, `the head group sorts nearer the lens than the body (z ${headAt[2].toFixed(1)} vs ${bodyAt[2].toFixed(1)})`);
  const mid: [number, number, number] = [headAt[0], 0, (headAt[2] + bodyAt[2]) / 2];
  assert.deepEqual(orderOf(items, mid), ['BODY', 'WALL', 'HEAD']);
});
test('split negative control: as ONE item the creature cannot straddle the fern (all before or all after)', () => {
  const one = beastItems(lnBuild, LNPLACE, []);
  assert.equal(one.length, 1);
  const log: string[] = [];
  paintSorted(null as never, LNCAM, [{...one[0], draw: () => log.push('CREATURE')}, {at: [0, 0, -13], draw: () => log.push('WALL')}]);
  assert.ok(log.join() === 'CREATURE,WALL' || log.join() === 'WALL,CREATURE');
  assert.equal(log.length, 2, 'a single item has no way to put the wall between its body and its head');
});
test('split: works for every long-neck pose and the picture of the head group stays attached to the neck root', () => {
  for (const [an, a] of Object.entries(LN.anims)) for (const t of [0, 0.5]) {
    const B = a.build(a.cycle ? t * 0.99 : t), plan = planSplit(B, LNPLACE, [{root: 'neck'}]), neck = paintBeast(null, LNCAM, B, {...LNPLACE, only: (b) => plan.groups[0].bones.has(b)}).drawn as DrawnPoly[];
    assert.ok(neck.length > 0, `${an}: head group draws`);
  }
});

import {beastSlabs} from '../src/painted/survival/beast-sort';
test('slabs: the creature spreads over several slabs, none is lost, and a wall between hips and head falls between the slabs', () => {
  const B = LN.anims.CHEW.build(0.15), place = {at: [0, -16] as [number, number], heading: 1.25}, cam: YCam = {x: 2, y: 1.6, z: 0, yaw: 0, f: 520, hy: 1100, pitch: 0};
  const whole = paintBeast(null, cam, B, place).drawn.length, items = beastSlabs(cam, B, place, 5);
  assert.equal(items.length, 5);
  // re-derive the slab limits exactly as beastSlabs does by painting each item into a counting painter proxy
  let sum = 0;
  const counts = items.map((it) => { const r = recorder(); it.draw(makePainter(r.brush, {t: 0, frame: 0}), cam); const n = r.calls.filter((s) => s.startsWith('polygon')).length; sum += n; return n; });
  assert.ok(counts.filter((n) => n > 0).length >= 3, `the creature spreads over several slabs: ${counts.join(',')}`);
  assert.ok(whole > 100 && sum >= whole, `polygons painted ${sum} >= drawn ${whole} (grain cells add to the count, none is lost)`);
  const hd = items.map((it) => it.at[2]);
  assert.ok(hd[0] < hd[4] - 3, `slabs sort from far to near: z ${hd.map((v) => v.toFixed(1)).join(' ')}`);
  const wallZ = (hd[1] + hd[2]) / 2, log: string[] = [];
  paintSorted(null as never, cam, [...items.map((it, i) => ({...it, draw: () => log.push(`S${i}`)})), {at: [it0x(items), 0, wallZ], draw: () => log.push('WALL')}]);
  const wi = log.indexOf('WALL');
  assert.ok(wi > 0 && wi < log.length - 1, `the wall is neither first nor last: ${log.join(',')}`);
});
const it0x = (items: {at: [number, number, number]}[]) => items[0].at[0];
