import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {drawFigure, type CastDef} from '../src/painted/kit/cast';
import {camMove, camOf} from '../src/painted/kit/cam-moves';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {camPoint, camPoly, camUnit, mixYCam, YCAM_NEAR} from '../src/painted/kit/ycam';
import {ISAN_OUTFITS, ISAN_OUTFIT_IDS, ISAN_OUTFIT_INFO, KHAOMA, YAI, VILLAGER, dressIsan} from '../src/painted/survival/cast';
import {paintLongNeckHerd} from '../src/painted/survival/creatures';
import {paintFire, fireFlicker} from '../src/painted/survival/fire';
import {HEN_MOTIONS, HEN_MOTION_IDS, paintHenMotion} from '../src/painted/survival/hen';
import {paintRiver} from '../src/painted/survival/river';
import {paintSkyRipple} from '../src/painted/survival/sky';
import {paintTorchBeam} from '../src/painted/survival/props';
import {LIGHT} from '../src/painted/survival/village';
import {paintPterosaur, pteroFlight} from '../src/painted/survival/pterosaur';
import {FLOWER_TILES, FLOWER_POP_FRAMES, flowerPopScale, paintFlowerPopCard} from '../src/painted/survival/cards';
import {SURV_POSE_IDS, survPoseFig} from '../src/painted/survival/poses';
import {paintShop} from '../src/painted/survival/shop';
import {mozzieAt, paintMozzieCloud, paintMosquitoMacro} from '../src/painted/survival/bugs';
import {paintRoofRunoff, RUNOFF} from '../src/painted/survival/rain';
import {paintGreenSmoke} from '../src/painted/survival/fire';
import {PROP_IDS, paintHeldProp, paintGroundProp} from '../src/painted/survival/props';
import {worldAt} from '../src/painted/survival/core';
import {spinoStride} from '../src/painted/survival/creatures';

// EDU-EP16..18 shared survival module (Boss, 14 Nov 2026): near-plane close-ups, belt checks Gear, hen motions, fire, river, herd.
const recorder = () => {
  const calls: string[] = [];
  return {calls, brush: new Proxy({}, {get: (_, name) => (...args: unknown[]) => { calls.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush};
};
const painter = (r = recorder()) => ({r, p: makePainter(r.brush, {t: 0.3, frame: 9})});
const g: Pt = [540, 1500], unit = 600;

test('camera near plane: a close-up lens keeps points 0.2 m ahead and the default still drops them', () => {
  const m = camMove([0, 0.5, 0], [0, 0], [0.45, 0.45], 0.5, {f: 950, hy: 960});
  const plain = camOf(m, 0), close = camOf(camMove([0, 0.5, 0], [0, 0], 0.45, 0.5, {f: 950, hy: 960, near: 0.05}), 0);
  assert.equal(plain.near, undefined, 'absent near stays absent: every existing camera is unchanged');
  assert.equal(close.near, 0.05);
  assert.equal(camPoint(plain, [0, 0.5, 0.25]), null, 'inside the default 0.3 m near plane');
  assert.ok(camPoint(close, [0, 0.5, 0.25]), 'kept with near 0.05');
  assert.ok(camUnit(close, [0, 0.5, 0.25]) > camUnit(plain, [0, 0.5, 0.25]) - 1e-9);
  assert.ok(camPoly(close, [[-0.1, 0, 0.3], [0.1, 0, 0.3], [0.1, 0, -2], [-0.1, 0, -2]]).length >= 4);
  assert.equal(YCAM_NEAR, 0.3);
  const mid = mixYCam(plain, close, 0.5);
  assert.ok(Math.abs((mid.near ?? 0) - 0.175) < 1e-9, 'mixYCam blends near');
  assert.equal(mixYCam(plain, plain, 0.5).near, undefined);
});

test('Gear.belt.checks: absent draws the same marks as before; present adds the chequer in front and back view', () => {
  for (const view of ['front', 'back'] as const) {
    const base: CastDef = {...PEOPLE['woman-elder'], outfit: {...PEOPLE['woman-elder'].outfit, gear: {belt: {color: KHAOMA.red, h: 0.07}}}};
    const withChecks: CastDef = {...base, outfit: {...base.outfit, gear: {belt: {color: KHAOMA.red, h: 0.07, checks: KHAOMA.white}}}};
    const plain = painter(), again = painter(), checked = painter();
    drawFigure(plain.p, base, g, unit, {view, face: EXPRESSIONS.neutral}, 0.3);
    drawFigure(again.p, base, g, unit, {view, face: EXPRESSIONS.neutral}, 0.3);
    drawFigure(checked.p, withChecks, g, unit, {view, face: EXPRESSIONS.neutral}, 0.3);
    assert.deepEqual(plain.r.calls, again.r.calls, `${view}: deterministic`);
    assert.ok(checked.r.calls.length > plain.r.calls.length, `${view}: the chequer adds marks`);
    assert.ok(checked.r.calls.some((c) => c.toLowerCase().includes(KHAOMA.white.toLowerCase())), `${view}: white squares drawn`);
  }
  // profile view keeps the plain band
  const side: CastDef = {...PEOPLE['woman-elder'], outfit: {...PEOPLE['woman-elder'].outfit, gear: {belt: {color: KHAOMA.red, h: 0.07, checks: KHAOMA.white}}}};
  const a = painter(), b = painter();
  drawFigure(a.p, side, g, unit, {view: 'right', face: EXPRESSIONS.neutral}, 0.3);
  drawFigure(b.p, {...side, outfit: {...side.outfit, gear: {belt: {color: KHAOMA.red, h: 0.07}}}}, g, unit, {view: 'right', face: EXPRESSIONS.neutral}, 0.3);
  assert.deepEqual(a.r.calls, b.r.calls, 'profile: no chequer (documented)');
});

test('Isan outfits: ids, info lines, the cast uses the checks, dressIsan keeps the person', () => {
  assert.deepEqual([...ISAN_OUTFIT_IDS], ['isan-home-woman', 'kid-home', 'isan-home-man']);
  for (const id of ISAN_OUTFIT_IDS) {
    assert.match(id, /^[a-z-]+$/);
    assert.ok(ISAN_OUTFIT_INFO[id].description.length > 20 && !ISAN_OUTFIT_INFO[id].description.includes('\n'));
    assert.ok(ISAN_OUTFITS[id].shirt);
  }
  assert.equal(YAI.outfit.gear?.belt?.checks, KHAOMA.white);
  assert.equal(VILLAGER.outfit.gear?.belt?.checks, KHAOMA.white);
  const d = dressIsan(PEOPLE['man-parted'], 'isan-home-man');
  assert.equal(d.head, PEOPLE['man-parted'].head);
  assert.equal(d.height, PEOPLE['man-parted'].height);
  assert.equal(d.outfit.gear?.belt?.checks, KHAOMA.white);
});

test('hen motions: ids, bounded fields, loops, and the trot walks', () => {
  assert.deepEqual([...HEN_MOTION_IDS], ['idle', 'peck', 'trot', 'head-tilt', 'huddle', 'cluck']);
  for (const id of HEN_MOTION_IDS) for (let i = 0; i < 80; i++) {
    const m = HEN_MOTIONS[id](i / 20), q = m.pose;
    for (const k of ['peck', 'lift', 'liftFar', 'cluck', 'fluff'] as const) if (q[k] !== undefined) assert.ok(q[k]! >= 0 && q[k]! <= 1.0001, `${id}.${k} in 0..1 at ${i}`);
    assert.ok(Math.abs(q.tilt ?? 0) <= 23, `${id} tilt bounded`);
  }
  assert.ok(HEN_MOTIONS.trot(1).dx > HEN_MOTIONS.trot(0).dx);
  assert.ok(Math.abs((HEN_MOTIONS.peck(0.4).pose.peck ?? 0) - (HEN_MOTIONS.peck(0.4 + 1.4).pose.peck ?? 0)) < 1e-6, 'peck loops every 1.4 s');
  const maxPeck = Math.max(...Array.from({length: 70}, (_, i) => HEN_MOTIONS.peck(i / 50).pose.peck ?? 0));
  assert.ok(maxPeck > 0.9, 'the head reaches the ground');
  assert.ok(Math.max(...Array.from({length: 40}, (_, i) => HEN_MOTIONS.cluck(i / 25).pose.cluck ?? 0)) === 1);
  const cam = {x: 0, y: 0.5, z: 3, yaw: 0, f: 1300, hy: 700};
  const a = painter(), b = painter();
  paintHenMotion(a.p, cam, [0, 0, 0], 'right', 'cluck', 0.05, LIGHT.morning);
  paintHenMotion(b.p, cam, [0, 0, 0], 'right', 'idle', 0.05, LIGHT.morning);
  assert.ok(a.r.calls.length > 0 && b.r.calls.length > 0 && a.r.calls.join() !== b.r.calls.join());
});

test('fire, ripple, torch, herd and river draw, are deterministic, and a fire behind the lens draws nothing', () => {
  const cam = {x: 0, y: 1.2, z: 6, yaw: 0, f: 900, hy: 1000};
  const f1 = painter(), f2 = painter(), none = painter();
  paintFire(f1.p, cam, [0, 0, 0], 0.4);
  paintFire(f2.p, cam, [0, 0, 0], 0.4);
  paintFire(none.p, cam, [0, 0, 20], 0.4);
  assert.ok(f1.r.calls.length > 40);
  assert.deepEqual(f1.r.calls, f2.r.calls);
  assert.equal(none.r.calls.length, 0);
  assert.ok(fireFlicker(1.3) >= 0.84 && fireFlicker(1.3) <= 1.12);
  const r1 = painter(), r2 = painter();
  paintSkyRipple(r1.p, {cx: 500, cy: 400, t: 0.5, speed: 1.6, glow: 0.2});
  paintSkyRipple(r2.p, {cx: 500, cy: 400, t: 0.9, speed: 1.6, glow: 0.2});
  assert.notDeepEqual(r1.r.calls, r2.r.calls, 'rings move with t');
  const off = painter();
  paintTorchBeam(off.p, [100, 100], [300, 300], {level: 0});
  assert.equal(off.r.calls.length, 0);
  const on = painter();
  paintTorchBeam(on.p, [100, 100], [300, 300]);
  assert.ok(on.r.calls.length > 0);
  const h1 = painter(), h2 = painter();
  paintLongNeckHerd(h1.p, {x0: 0, x1: 800, base: 500, h: 120, n: 5, color: '#444', seed: 3});
  paintLongNeckHerd(h2.p, {x0: 0, x1: 800, base: 500, h: 120, n: 5, color: '#444', seed: 3});
  assert.deepEqual(h1.r.calls, h2.r.calls);
  assert.ok(h1.r.calls.length > 20);
  const rv = painter(), rcam = {x: 0.5, y: 1.55, z: 2, yaw: 0, f: 860, hy: 880};
  paintRiver(rv.p, rcam, {t: 1, nets: [{at: [-3, -3.5]}]});
  assert.ok(rv.r.calls.length > 300, 'river plate has water, bed, banks and forest');
  const rv2 = painter();
  paintRiver(rv2.p, {...rcam, near: 0.05}, {t: 1, mode: 'dusk'});
  assert.ok(rv2.r.calls.length > 300);
});

// Batch 2 (Boss, 14 Nov 2026): pterosaur, flower card, series poses, shop, mosquitoes, run-off, smoke, props, spino stride.
const cam2 = camOf(camMove([0, 1.2, 6], [0, 0], 5, 3, {f: 900, hy: 800, near: 0.02}), 0.5);
const L0 = {amb: '#303848', k: 0.8};

test('worldAt inverts camPoint at the depth it is given', () => {
  const w = worldAt(cam2, 700, 900, 4), pt = camPoint(cam2, w);
  assert.ok(pt && Math.abs(pt[0] - 700) < 0.5 && Math.abs(pt[1] - 900) < 0.5);
});

test('pteroFlight is a pure function of u and the pass; the wings keep a finite pose', () => {
  const pass = {from: [8, 6, 2] as [number, number, number], grab: [0, 1.2, -3] as [number, number, number], to: [-8, 5, -2] as [number, number, number], tGrab: 0.4};
  assert.deepEqual(pteroFlight(0.3, pass), pteroFlight(0.3, pass));
  for (let u = 0; u <= 1; u += 0.1) { const o = pteroFlight(u, pass); assert.ok(o.at.every(Number.isFinite) && Number.isFinite(o.heading) && (o.grab ?? 0) >= 0 && (o.grab ?? 0) <= 1); }
  const g = pteroFlight(0.4, pass);
  assert.ok(Math.hypot(g.at[0] - pass.grab[0], g.at[2] - pass.grab[2]) < 0.05, 'passes through the grab point at tGrab');
  const a = painter(), b = painter();
  paintPterosaur(a.p, cam2, g, L0); paintPterosaur(b.p, cam2, g, L0);
  assert.ok(a.r.calls.length > 200, 'volume: many shaded facets'); assert.deepEqual(a.r.calls, b.r.calls);
  const an = paintPterosaur(null, cam2, g, L0);
  assert.equal(an.feetWorld.length, 3);
  assert.ok(an.bounds.right > an.bounds.left && an.bounds.bottom > an.bounds.top, 'bounds cover every vertex');
  assert.ok(an.tips.every((t) => !t || (t[0] >= an.bounds.left - 1 && t[0] <= an.bounds.right + 1)), 'wing tips lie inside the bounds');
  const wide = paintPterosaur(null, cam2, {...g, span: 4}, L0).bounds, small = paintPterosaur(null, cam2, {...g, span: 2}, L0).bounds;
  assert.ok(wide.right - wide.left > small.right - small.left);
});

test('flower-pop card: four tiles pop in order, scale overshoots then settles, painting is deterministic', () => {
  const f = FLOWER_TILES.map((id) => FLOWER_POP_FRAMES[id]);
  assert.deepEqual([...f].sort((x, y) => x - y), f);
  assert.equal(flowerPopScale('mango', 0), 0);
  assert.ok(flowerPopScale('mango', f[0] + 3) > 1 && Math.abs(flowerPopScale('mango', f[0] + 30) - 1) < 1e-9);
  const a = painter(), b = painter();
  paintFlowerPopCard(a.p, 90); paintFlowerPopCard(b.p, 90);
  assert.ok(a.r.calls.length > 50); assert.deepEqual(a.r.calls, b.r.calls);
  assert.ok(painter().r.calls.length === 0 && (paintFlowerPopCard(painter().p, 90), true));
});

test('series poses: every id gives px arms near the shoulder; mime-stir moves with phase', () => {
  for (const id of SURV_POSE_IDS) {
    const fig = survPoseFig(id, Object.values(PEOPLE)[0] as CastDef, g, unit, {ph: 0.2});
    for (const arm of [fig.rArm, fig.lArm]) assert.ok(arm && arm.to.every(Number.isFinite) && (arm.via ?? []).every(Number.isFinite), id);
  }
  const d = Object.values(PEOPLE)[0] as CastDef;
  assert.notDeepEqual(survPoseFig('mime-stir', d, g, unit, {ph: 0}).rArm, survPoseFig('mime-stir', d, g, unit, {ph: 0.25}).rArm);
});

test('shop stock variants differ, mosquito cloud is seeded and positions stay in the swarm radius', () => {
  const calls = (stock: 'few' | 'last' | 'bare') => { const x = painter(); paintShop(x.p, cam2, {t: 1, stock}); return x.r.calls.join(''); };
  assert.notEqual(calls('few'), calls('bare')); assert.equal(calls('last'), calls('last'));
  const cl = {at: [0, 1.4, 2] as [number, number, number], t: 3, radius: 0.5};
  for (let i = 0; i < 40; i++) { const q = mozzieAt(cl, i); assert.ok(Math.hypot(q[0] - 0, q[2] - 2) < 0.5 * 1.05 && Math.abs(q[1] - 1.4) < 0.4, `mosquito ${i}`); }
  assert.deepEqual(mozzieAt(cl, 5), mozzieAt(cl, 5));
  const a = painter(); paintMozzieCloud(a.p, cam2, cl); assert.ok(a.r.calls.length > 40);
  const m = painter(); const bb = paintMosquitoMacro(m.p, cam2, [0, 1.2, 5.9], {t: 1}); assert.ok(m.r.calls.length > 30 && bb);
});

test('roof run-off, green smoke and every prop paint something and repeat exactly', () => {
  const ro = () => { const x = painter(); paintRoofRunoff(x.p, cam2, {t: 2, flow: 1}); return x.r.calls; };
  assert.ok(ro().length > 10); assert.deepEqual(ro(), ro()); assert.equal(RUNOFF.from[1] > RUNOFF.land[1], true);
  const sm = () => { const x = painter(); paintGreenSmoke(x.p, cam2, [0, 0, 0], 2, {amount: 1}); return x.r.calls; };
  assert.ok(sm().length > 5); assert.deepEqual(sm(), sm());
  assert.equal(PROP_IDS.length, 32);   // 31 + seed-cone (N16-17)
  for (const id of PROP_IDS) {
    const h = painter(), q = painter();
    paintHeldProp(h.p, id, [540, 1200], 140); paintGroundProp(q.p, id, cam2, [0, 0, 2]);
    assert.ok(h.r.calls.length > 0, `${id} held`);
  }
});

test('spinoStride: the stance foot is planted when the body advances S/0.6 per cycle; swing lifts, stance stays on the ground', () => {
  const S = 2.6;
  for (let i = 0; i < 20; i++) {
    const ph = i / 20, st = spinoStride(ph, S), q = ph;
    if (q < 0.6) { assert.equal(st.legs.near[1], 0); const adv = (S / 0.6) * ph; assert.ok(Math.abs((st.legs.near[0] - adv) - (-S / 2)) < 1e-9, 'world s of the stance foot is constant'); }
    else assert.ok(st.legs.near[1] > 0 || Math.abs(q - 0.6) < 1e-9);
  }
});
