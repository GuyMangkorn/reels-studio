import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {BONE, shoulderPoint, type CastDef, type FigPose} from '../src/painted/kit/cast';
import {camMove, camOf} from '../src/painted/kit/cam-moves';
import {ZG_NEUTRAL, evaSuit, paintEva, paintHelmetProp} from '../src/painted/kit/eva';
import {hipAnchor, paintFigureAt, rollPt} from '../src/painted/kit/figure-at';
import {MOTION_IDS, MOTION_INFO, TOW_GRAB_SEC, layerMotion, motionFrame, twoBone, type MotionId} from '../src/painted/kit/motions';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {hasView, poseFor, POSE_INFO} from '../src/painted/kit/poses';
import {BODY_POSES} from '../src/painted/kit/poses-more';
import {camPoint, camUnit} from '../src/painted/kit/ycam';

// Weightless figure kit (EDU-EP08 B1 roll, B3 helmet prop, B4 P46 + zero-g-drift, B5 pat-check, B6 rail-tow; Boss pass A, 8 Nov 2026).
const recorder = () => {
  const log: string[] = [];
  const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => { log.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush;
  return {brush, log};
};
const cam = camOf(camMove([0, 1.0, 0], [0, 0], 2.7, 1.3, {pitch: [-8, -8], f: 1000, hy: 700}), 0);
const AT: [number, number, number] = [0, 0.2, 0];
const AST = evaSuit(PEOPLE['woman-bob']), CREW = evaSuit(PEOPLE['man-crop']);
const d = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const g: Pt = [540, 1500], unit = 540;

test('P46 zero-g-neutral: arms are the ZG_NEUTRAL numbers, crouch 0.22, bones within BONE, front and profile', () => {
  const info = POSE_INFO.P46;
  assert.equal(info.name, 'zero-g-neutral');
  for (const v of ['front', 'left', 'right'] as const) assert.ok(hasView('P46', v), v);
  const arms = BODY_POSES.P46.front!.arms;
  assert.ok(arms !== 'rig');
  assert.deepEqual(arms.r, {via: ZG_NEUTRAL('r').via, to: ZG_NEUTRAL('r').to});
  assert.deepEqual(arms.l, {via: ZG_NEUTRAL('l').via, to: ZG_NEUTRAL('l').to});
  assert.equal(poseFor('P46', AST, g, unit, 'front').crouch, 0.22);
  for (const v of ['front', 'left', 'right'] as const) {
    const p = poseFor('P46', AST, g, unit, v);
    for (const [arm, side] of [[p.rArm, 'r'], [p.lArm, 'l']] as const) {
      if (!arm?.via) continue;
      const sh = shoulderPoint(AST, g, unit, {...p, view: v}, side);
      assert.ok(d(arm.via, sh) / unit <= BONE * 1.01, `${v} ${side} upper`);
      assert.ok(d(arm.to, arm.via) / unit <= BONE * 1.01, `${v} ${side} fore ${d(arm.to, arm.via) / unit}`);
    }
  }
});

test('B1 roll: roll 0 is the plain placement; a roll rotates the card about the hips and the anchors with it, push/pop balanced', () => {
  const plain = recorder(), zero = recorder(), rolled = recorder();
  const a0 = paintFigureAt(makePainter(plain.brush, {t: 0, frame: 0}), cam, AST, {at: AT, pose: 'P46', shadow: false, t: 0})!;
  const az = paintFigureAt(makePainter(zero.brush, {t: 0, frame: 0}), cam, AST, {at: AT, pose: 'P46', shadow: false, roll: 0, t: 0})!;
  assert.deepEqual(zero.log, plain.log);
  assert.deepEqual(az, a0);
  const ar = paintFigureAt(makePainter(rolled.brush, {t: 0, frame: 0}), cam, AST, {at: AT, pose: 'P46', shadow: false, roll: 40, t: 0})!;
  const n = (l: string[], k: string) => l.filter((x) => x.startsWith(k)).length;
  assert.equal(n(rolled.log, 'push'), n(rolled.log, 'pop'));
  assert.equal(n(rolled.log, 'push') - n(plain.log, 'push'), 1);
  assert.equal(n(rolled.log, 'rotate') - n(plain.log, 'rotate'), 1);
  const gp = camPoint(cam, AT)! as Pt, u = camUnit(cam, AT);
  const pivot = hipAnchor(AST, gp, u, {view: 'front', crouch: 0.22});
  // rolled anchors = plain anchors rotated 40 deg about the hips: distance to the pivot kept (no growth), angle +40
  for (const k of ['head', 'rHand', 'lHand', 'rShoulder', 'lShoulder', 'feet'] as const) {
    const q = a0[k] as Pt, r = ar[k] as Pt;
    assert.ok(Math.abs(d(q, pivot) - d(r, pivot)) < 1e-6, `${k} distance`);
    assert.ok(d(rollPt(q, pivot, 40), r) < 1e-6, `${k} rotated`);
  }
  assert.ok(Math.abs(ar.chin - rollPt([a0.head[0], a0.chin], pivot, 40)[1]) < 1e-6);
  // positive roll tips the head toward screen right
  assert.ok(ar.head[0] > a0.head[0]);
});

test('B1 roll in paintEva: lips, bubble and ring rotate with the card and the bubble radius is unchanged', () => {
  const m = recorder();
  const a0 = paintEva(makePainter(m.brush, {t: 0, frame: 0}), cam, AST, {at: AT, view: 'front', helmet: 'bubble', t: 0, pose: 'P46'})!;
  const ar = paintEva(makePainter(m.brush, {t: 0, frame: 0}), cam, AST, {at: AT, view: 'front', helmet: 'bubble', t: 0, pose: 'P46', roll: -25})!;
  const pivot = hipAnchor(AST, camPoint(cam, AT)! as Pt, a0.u, {view: 'front', crouch: 0.22});
  assert.equal(ar.roll, -25);
  assert.equal(ar.bubble.r, a0.bubble.r);
  assert.ok(d(rollPt(a0.bubble.c, pivot, -25), ar.bubble.c) < 1e-6);
  assert.ok(d(rollPt(a0.lips, pivot, -25), ar.lips) < 1e-6);
  assert.ok(d(rollPt(a0.ring, pivot, -25), ar.ring) < 1e-6);
  assert.ok(ar.head[0] < a0.head[0]);
});

test('paintEva takes a named pose or a motion: the P46 pose equals the hand-authored ZG_NEUTRAL arms (hands within 2 px)', () => {
  const m = recorder();
  const a = paintEva(makePainter(m.brush, {t: 0, frame: 0}), cam, AST, {at: AT, view: 'front', helmet: 'off', t: 0, pose: 'P46'})!;
  const b = paintEva(makePainter(m.brush, {t: 0, frame: 0}), cam, AST, {at: AT, view: 'front', helmet: 'off', t: 0, r: ZG_NEUTRAL('r'), l: ZG_NEUTRAL('l')})!;
  assert.ok(d(a.rHand, b.rHand) < 2 && d(a.lHand, b.lHand) < 2, `${d(a.rHand, b.rHand)} ${d(a.lHand, b.lHand)}`);
  const c = paintEva(makePainter(m.brush, {t: 0, frame: 0}), cam, AST, {at: AT, view: 'front', helmet: 'off', t: 0, motion: {id: 'zero-g-drift', t: 1.5}})!;
  assert.ok(c.roll !== 0 && Number.isFinite(c.head[0]));
  assert.ok(paintEva(makePainter(m.brush, {t: 0, frame: 0}), cam, CREW, {at: AT, view: 'right', helmet: 'visor', t: 0, stripes: true, motion: {id: 'rail-tow', t: 0.9}}));
});

test('B3 helmet prop: draws, spin slides the latch tab off the visible half, roll rotates the ring, radius follows the lens', () => {
  const m = recorder();
  const a = paintHelmetProp(makePainter(m.brush, {t: 0, frame: 0}), cam, {at: [0, 1.4, 0], spin: 0})!;
  const back = paintHelmetProp(makePainter(m.brush, {t: 0, frame: 0}), cam, {at: [0, 1.4, 0], spin: 180})!;
  const side = paintHelmetProp(makePainter(m.brush, {t: 0, frame: 0}), cam, {at: [0, 1.4, 0], spin: 90, roll: 30, glint: 1})!;
  assert.ok(a.tab && !back.tab && !side.tab);
  assert.ok(Math.abs(a.r - 0.29 * camUnit(cam, [0, 1.4, 0])) < 1e-6);
  assert.ok(side.ring[0] !== a.ring[0]);
  assert.equal(paintHelmetProp(makePainter(m.brush, {t: 0, frame: 0}), cam, {at: [0, 1.4, 40]}), null === null ? paintHelmetProp(makePainter(m.brush, {t: 0, frame: 0}), cam, {at: [0, 1.4, 40]}) : null);
  for (const helmet of ['bubble', 'round1966'] as const) assert.ok(paintHelmetProp(makePainter(m.brush, {t: 0, frame: 0}), cam, {at: [0.3, 1.0, 0], helmet, spin: 33, glint: 0.5}));
  // deterministic
  const x = recorder(), y = recorder();
  paintHelmetProp(makePainter(x.brush, {t: 0, frame: 0}), cam, {at: [0, 1.4, 0], spin: 20});
  paintHelmetProp(makePainter(y.brush, {t: 0, frame: 0}), cam, {at: [0, 1.4, 0], spin: 20});
  assert.deepEqual(x.log, y.log);
});

test('twoBone: exact bone lengths, hand pulled back when out of reach', () => {
  for (const to of [[0.17, -0.19], [0.4, -0.1], [-0.3, 0.2], [0.9, 0.0]] as Pt[]) for (const bend of [1, -1] as const) {
    const r = twoBone(to, bend);
    assert.ok(Math.abs(Math.hypot(r.via[0], r.via[1]) - BONE) < 2e-4, `${to} upper`);
    assert.ok(Math.abs(d(r.to, r.via) - BONE) < 2e-4, `${to} fore`);
  }
  assert.ok(Math.hypot(...twoBone([0.9, 0], 1).to) <= 2 * BONE);
});

const arms = (id: MotionId, t: number, view: 'front' | 'left' | 'right' = 'front', person: CastDef = AST) => {
  const f = layerMotion({person, motion: id, t, g, unit, view});
  const fv = f.view === 'back' ? 'front' : f.view;
  const sh = (side: 'r' | 'l') => shoulderPoint(f.def, f.g, unit, {...f.pose, view: fv}, side);
  return {f, sh, rArm: f.pose.rArm!, lArm: f.pose.lArm!};
};

test('B4 zero-g-drift: loops on 6 s, small bob, roll within 4 deg, arms within BONE of the shoulder (no growth), near <= 0.32 m', () => {
  assert.equal(MOTION_INFO['zero-g-drift'].duration, 6);
  const l0 = layerMotion({person: AST, motion: 'zero-g-drift', t: 0.7, g, unit}), l1 = layerMotion({person: AST, motion: 'zero-g-drift', t: 6.7, g, unit});
  assert.ok(d(l0.pose.rArm!.to, l1.pose.rArm!.to) < 1e-6 && d(l0.pose.lArm!.via!, l1.pose.lArm!.via!) < 1e-6 && d(l0.g, l1.g) < 1e-6 && Math.abs(l0.roll - l1.roll) < 1e-9);
  const hand0: Record<string, Pt> = {};
  let rollMax = 0, bobMax = 0, handMove = 0;
  for (let t = 0; t < 6; t += 0.1) {
    const {f, sh, rArm, lArm} = arms('zero-g-drift', t);
    rollMax = Math.max(rollMax, Math.abs(f.roll));
    bobMax = Math.max(bobMax, Math.abs(f.g[1] - g[1]) / unit);
    for (const [arm, side] of [[rArm, 'r'], [lArm, 'l']] as const) {
      const s = sh(side);
      assert.ok(d(arm.via!, s) / unit <= BONE * 1.0, `t=${t.toFixed(1)} ${side} upper ${d(arm.via!, s) / unit}`);
      assert.ok(d(arm.to, arm.via!) / unit <= BONE * 1.0, `t=${t.toFixed(1)} ${side} fore`);
      const rel: Pt = [(arm.to[0] - s[0]) / unit, (arm.to[1] - s[1]) / unit];
      if (hand0[side]) handMove = Math.max(handMove, d(rel, hand0[side])); else hand0[side] = rel;
    }
    assert.ok((f.near.r ?? 0) <= 0.32 && (f.near.l ?? 0) <= 0.32);
  }
  assert.ok(rollMax > 1.5 && rollMax <= 4, `roll ${rollMax}`);
  assert.ok(bobMax > 0.02 && bobMax <= 0.04, `bob ${bobMax}`);
  assert.ok(handMove > 0.02 && handMove < 0.1, `drift ${handMove}`); // the hands do drift, slowly
});

test('B5 pat-check: gloves on the chest at 0.4 / 0.8 s, right glove on the left upper arm at 1.55, left on the right at 2.05, exact bones', () => {
  const chest = (t: number, side: 'r' | 'l') => { const {sh, rArm, lArm} = arms('pat-check', t); const s = sh(side), h = (side === 'r' ? rArm : lArm).to; return [(h[0] - s[0]) / unit * (side === 'r' ? 1 : -1), -(h[1] - s[1]) / unit] as Pt; };
  for (const t of [0.4, 0.8]) for (const side of ['r', 'l'] as const) {
    const [x, y] = chest(t, side);
    assert.ok(Math.abs(x - 0.15) < 0.04 && Math.abs(y + 0.19) < 0.04, `t=${t} ${side} x=${x} y=${y}`);
  }
  // between the taps the glove lifts off the chest
  assert.ok(chest(0.6, 'r')[0] > chest(0.4, 'r')[0] + 0.01 || chest(0.6, 'r')[1] !== chest(0.4, 'r')[1]);
  for (const [t, side] of [[1.55, 'r'], [2.05, 'l']] as const) {
    const [x] = chest(t, side);
    assert.ok(x > 0.35 && x < 0.5, `t=${t} ${side} x=${x}`); // across the body to the opposite upper arm
  }
  // exact bones on every sample (hand reach limited to 2 BONE), shoulders drop 0.02 m after 2.2 s
  for (let t = 0; t <= 3.1; t += 0.05) {
    const {sh, rArm, lArm} = arms('pat-check', t);
    for (const [arm, side] of [[rArm, 'r'], [lArm, 'l']] as const) {
      const s = sh(side);
      assert.ok(d(arm.via!, s) / unit <= BONE * 1.01, `t=${t.toFixed(2)} ${side} upper ${d(arm.via!, s) / unit}`);
      assert.ok(d(arm.to, arm.via!) / unit <= BONE * 1.01, `t=${t.toFixed(2)} ${side} fore`);
    }
  }
  assert.equal(motionFrame('pat-check', 2.55, {view: 'front', k: 1, seed: 1}).body!.rise, -0.02);
  assert.equal(motionFrame('pat-check', 0.5, {view: 'front', k: 1, seed: 1}).face, 'worried');
});

test('B6 rail-tow: one grip planted at a time (+-4 px at 540 px/m), hand-over-hand re-grip one stroke ahead, wrist hand locked after the grab', () => {
  for (const [view, dir] of [['right', 1], ['left', -1]] as const) {
    const far = (t: number) => { const {f} = arms('rail-tow', t, view, CREW); return {to: (view === 'right' ? f.pose.lArm! : f.pose.rArm!).to, f}; };
    // pull phases: [0.05, 0.40] s of each 0.7 s cycle (phase 0.07-0.57 of the 0.62 pull): the far glove stays put on the screen
    for (const n of [0, 1]) {
      const t0 = n * 0.7 + 0.03, h0 = far(t0).to;
      for (let t = t0; t <= n * 0.7 + 0.43; t += 0.02) assert.ok(d(far(t).to, h0) <= 4, `${view} cycle ${n} t=${t.toFixed(2)} moved ${d(far(t).to, h0).toFixed(2)} px`);
    }
    // next cycle grips one stroke (0.34 m x k) ahead of this one, toward the facing side
    const k = CREW.height / 1.7, grip0 = far(0.03).to, grip1 = far(0.73).to;
    assert.ok(Math.abs((grip1[0] - grip0[0]) * dir / unit - 0.34 * k) < 0.02, `stroke ${(grip1[0] - grip0[0]) * dir / unit}`);
    // the body travels toward the facing side: offset grows with time
    assert.ok((far(1.0).f.g[0] - far(0).f.g[0]) * dir > 0.3 * unit);
    // wrist hand: a fixed reach relative to the shoulder after the grab (locked), moving before it
    const hold = (t: number) => { const {f} = arms('rail-tow', t, view, CREW); const a = view === 'right' ? f.pose.rArm! : f.pose.lArm!; const s = shoulderPoint(f.def, f.g, unit, {...f.pose, view}, view === 'right' ? 'r' : 'l'); return [a.to[0] - s[0], a.to[1] - s[1]] as Pt; };
    assert.ok(d(hold(TOW_GRAB_SEC), hold(1.2)) <= 1, 'wrist hand locked after the grab');
    assert.ok(d(hold(0), hold(TOW_GRAB_SEC)) > 5, 'the wrist hand closes in during the first 6 frames');
    // exact bones
    for (let t = 0; t <= 1.4; t += 0.05) {
      const {f, sh} = arms('rail-tow', t, view, CREW);
      for (const [arm, side] of [[f.pose.rArm!, 'r'], [f.pose.lArm!, 'l']] as const) {
        const s = sh(side);
        assert.ok(d(arm.via!, s) / unit <= BONE * (CREW.armScale ?? 1) * 1.01 + 1e-9, `${view} t=${t.toFixed(2)} ${side} upper`);
        assert.ok(d(arm.to, arm.via!) / unit <= BONE * (CREW.armScale ?? 1) * 1.01 + 1e-9, `${view} t=${t.toFixed(2)} ${side} fore`);
      }
    }
  }
});

test('new motions are registered, deterministic and carry roll / near through layerMotion', () => {
  for (const id of ['zero-g-drift', 'pat-check', 'rail-tow'] as const) {
    assert.ok(MOTION_IDS.includes(id) && MOTION_INFO[id].views.length > 0, id);
    const a = JSON.stringify(layerMotion({person: AST, motion: id, t: 0.9, g, unit, view: MOTION_INFO[id].views[0]})), b = JSON.stringify(layerMotion({person: AST, motion: id, t: 0.9, g, unit, view: MOTION_INFO[id].views[0]}));
    assert.equal(a, b);
  }
  assert.equal(layerMotion({person: AST, motion: 'idle-breathe', t: 1, g, unit}).roll, 0);
  assert.deepEqual(layerMotion({person: AST, motion: 'idle-breathe', t: 1, g, unit}).near, {});
  assert.ok((layerMotion({person: AST, motion: 'zero-g-drift', t: 0, g, unit}).near.r ?? 0) > 0);
});

void ({} as FigPose);
