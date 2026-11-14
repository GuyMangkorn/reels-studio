import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildTRex, trexFoot, trexSettlePhase, trexWalkDist, trexWalkPhase, TREX_DUTY, TREX_STALK, TREX_POSES} from '../src/painted/survival/beast-trex';
import {checkJoints, JOINT_TOL, texCells, type Build} from '../src/painted/survival/beast';
import {BEAST_KIT} from '../src/painted/survival/beast-kit';

// EDU-EP16 R1.5b close-up fixes (Boss, 14 Nov 2026): B-R15B-02 shut jaw, B-R15B-03 skin cell clamp, B-R15B-06 planted feet.

// ---- B-R15B-02: a shut jaw closes flush (jaw top on the skull's lower line, tip behind the snout) at every head drop
/** Largest gap (m) between the skull's lower edge and the top of the lower jaw along the head, and the jaw tip's forward distance behind the snout tip. */
const jawGap = (B: Build) => {
  const sk = B.parts.filter((p) => p.bone === 'skull')[1].keys, jw = B.parts.find((p) => p.bone === 'jaw')!.keys;
  const low = (x: number) => { for (let i = 0; i + 1 < sk.length; i++) { const a = sk[i], b = sk[i + 1]; if (x >= a.p[0] && x <= b.p[0]) { const f = (x - a.p[0]) / (b.p[0] - a.p[0]); return a.p[1] - a.b + (b.p[1] - b.b - (a.p[1] - a.b)) * f; } } return NaN; };
  let gap = 0;
  for (const k of jw.slice(2)) { const l = low(k.p[0]); if (!Number.isNaN(l)) gap = Math.max(gap, l - (k.p[1] + k.b)); }
  return {gap, tipBehind: sk[sk.length - 1].p[0] - jw[jw.length - 1].p[0]};
};
for (const drop of [0, 1.6, 1.9, 2.0]) {
  test(`T. rex jaw 0, drop ${drop}: the lower jaw is flush with the tooth line and behind the snout`, () => {
    const r = jawGap(buildTRex({drop, jaw: 0}));
    assert.ok(r.gap < 0.02, `gap ${r.gap.toFixed(3)} m`);
    assert.ok(r.tipBehind > 0.05, `jaw tip ${r.tipBehind.toFixed(3)} m behind the snout`);
  });
}
test('negative control: a jaw lowered 0.12 m is caught by the flush check', () => {
  const B = buildTRex({drop: 2.0, jaw: 0});
  for (const p of B.parts) if (p.bone === 'jaw') p.keys = p.keys.map((k) => ({...k, p: [k.p[0], k.p[1] - 0.12, k.p[2]] as [number, number, number]}));
  assert.ok(jawGap(B).gap > 0.05);
});
test('an open jaw is unchanged by the closure: the roar still opens a gap', () => {
  assert.ok(jawGap(buildTRex({jaw: 1})).gap > 0.5);
});

// ---- B-R15B-03
test('skin cells: fixed n x n without tex.px, finer when asked and clamped', () => {
  assert.equal(texCells(4, undefined, 400, 400), 4);
  assert.equal(texCells(4, 7, 100, 60), 14 > Math.round(100 / 7) ? Math.round(100 / 7) : 14);
  assert.equal(texCells(4, 7, 600, 600), 14);
  assert.equal(texCells(4, 7, 8, 8), 4);
  for (const [k, e] of Object.entries(BEAST_KIT)) for (const [an, a] of Object.entries(e.anims)) if (!/trex|raptor/i.test(k)) for (const p of a.build(0).parts) assert.equal(p.tex?.px, undefined, `${k}.${an} ${p.bone} keeps the fixed cell count`);
});

// ---- B-R15B-06: planted feet. Walk a path, integrate the body, and measure how far a stance foot moves in the world.
type Foot = (ph: number) => [number, number, number];
/** Largest distance a stance foot ends up from where it was planted (m), over every stance in the span. */
const worldMove = (foot: Foot, hd: (ph: number) => number, ph0: number, ph1: number) => {
  let x = 0, z = 0, worst = 0, plant: [number, number] | null = null;
  const N = 1000, dph = (ph1 - ph0) / N;
  for (let i = 0; i <= N; i++) {
    const ph = ph0 + i * dph, h = hd(ph), [s, y, l] = foot(ph), w: [number, number] = [x + s * Math.cos(h) + l * Math.sin(h), z + s * Math.sin(h) - l * Math.cos(h)];
    if (y < 1e-9) { plant = plant ?? w; worst = Math.max(worst, Math.hypot(w[0] - plant[0], w[1] - plant[1])); } else plant = null;
    x += Math.cos(h) * trexWalkDist(dph); z += Math.sin(h) * trexWalkDist(dph);
  }
  return worst;
};
const S0 = TREX_STALK.stride;
const drift = (hd: (ph: number) => number, ph0: number, ph1: number, g = 1) => worldMove((ph) => trexFoot(ph + (g > 0 ? 0 : 0.5), S0, (q) => hd(q - (g > 0 ? 0 : 0.5)), -1.75, g * 0.65, 0.45), hd, ph0, ph1);
test('straight walk: the stance foot does not move in the world', () => { assert.ok(drift(() => 0.4, 0.2, 2.2) < 0.005); });
test('turning walk (16D +30..+42: 1.3 rad in 0.56 m): the stance foot does not skate', () => {
  const hd = (ph: number) => 0.85 - 1.3 * Math.min(1, Math.max(0, (ph - 1) / 0.144)) ** 2 * (3 - 2 * Math.min(1, Math.max(0, (ph - 1) / 0.144)));
  for (const g of [1, -1]) assert.ok(drift(hd, 0.9, 1.4, g) < 0.08, `foot ${g} moved ${drift(hd, 0.9, 1.4, g).toFixed(3)} m while planted`);
});
test('negative control: ignoring the heading change skates the foot', () => {
  const hd = (ph: number) => 0.85 - 1.3 * Math.min(1, Math.max(0, (ph - 1) / 0.144));
  const bad = worldMove((ph) => trexFoot(ph, S0, () => 0, -1.75, 0.65, 0.45), hd, 0.9, 1.4);   // the foot function told "straight" while the body turns
  assert.ok(bad > 0.4, `skated ${bad.toFixed(3)} m`);
});
test('settle phase lands where both feet are down; walk distance and phase invert', () => {
  for (const p of [0.05, 0.2, 0.5, 0.58, 0.7, 0.97, 1.3]) {
    const q = trexSettlePhase(p), f = q - Math.floor(q);
    assert.ok(q >= p - 1e-9 && (f < TREX_DUTY - 0.5 || (f >= 0.5 && f < TREX_DUTY)), `${p} -> ${q}`);
  }
  assert.ok(Math.abs(trexWalkPhase(trexWalkDist(0.37)) - 0.37) < 1e-12);
  assert.ok(Math.abs(TREX_STALK.speed - TREX_STALK.hz * trexWalkDist(1)) < 1e-12);
});
test('both feet down at a held phase: no foot is lifted and every joint hangs on its parent', () => {
  const pose = {...TREX_POSES.sniff(0.5), walk: 0.6, stride: TREX_STALK.stride};
  const B = buildTRex(pose);
  for (const id of ['LL', 'LR']) assert.ok(B.joints[`${id}.ankle`][1] < 1.2, `${id} ankle ${B.joints[`${id}.ankle`][1]}`);
  assert.ok(checkJoints(B).every((j) => j.attach < JOINT_TOL.attach && j.embed < JOINT_TOL.embed));
});

// ---- BOSS-R15-ARMS (14 Nov 2026): the forearms are ~8% of the body length, bent at the elbow, rooted in the chest, with two claws
import {TRX_ARM} from '../src/painted/survival/beast-trex';
import {checkRoots} from '../src/painted/survival/beast';
const armPoses: Record<string, Parameters<typeof buildTRex>[0]> = {rest: {}, walk: {walk: 0.3, stride: TREX_STALK.stride}, sniff: {drop: 1.6, jaw: 0}, turn: {yaw: 0.5}};
const d3 = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
/** Arm numbers of bone AL/AR: segment lengths, elbow angle (deg), claw count, embed of the shoulder in the chest. */
const armRow = (B: Build, id: string) => {
  const hip = B.joints[`${id}.hip`], el = B.joints[`${id}.knee`], wr = B.joints[`${id}.ankle`], u = d3(hip, el), f = d3(el, wr);
  const a = hip.map((v, i) => v - el[i]), b = wr.map((v, i) => v - el[i]);
  return {u, f, elbow: (Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (u * f)) * 180) / Math.PI, claws: B.flats.filter((q) => q.bone === `${id}.foot`).length, embed: checkRoots(B).find((r) => r.bone === `${id}.thigh`)!.embed};
};
const armOk = (r: ReturnType<typeof armRow>) => Math.abs(r.u - TRX_ARM[0]) < 0.01 && Math.abs(r.f - TRX_ARM[1]) < 0.01 && r.elbow > 60 && r.elbow < 120 && r.claws === 2 && r.embed <= 1;
for (const [nm, o] of Object.entries(armPoses)) {
  test(`T. rex arms (${nm}): both arms 0.75 + 0.62 m, elbow bent 60-120 deg, two claws, shoulder inside the chest`, () => {
    const B = buildTRex(o);
    for (const id of ['AL', 'AR']) { const r = armRow(B, id); assert.ok(armOk(r), `${id} ${JSON.stringify(r)}`); }
  });
}
test('negative control: the old 0.42 + 0.42 m stub fails the arm check', () => {
  const r = armRow(buildTRex({}), 'AL');
  assert.ok(armOk(r));
  assert.ok(!armOk({...r, u: 0.42, f: 0.42}));
  assert.ok(!armOk({...r, claws: 1}));
});
