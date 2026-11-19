import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {paintBeast, type Build} from '../src/painted/survival/beast';
import {BEAST_KIT} from '../src/painted/survival/beast-kit';
import {EMU_POSES, buildEmu} from '../src/painted/edu30/emu';
import {camPoint, type YCam} from '../src/painted/kit/ycam';
import type {Painter} from '../src/painted/kit/painter';

// T35 (EDU-EP30): `BeastPlace.air` lifts the body only; the ground shadow and the foot contact shadows stay on the ground.
// The golden hashes were taken from `paintBeast` before the change (the stroke list of every existing caller must not move).
type Op = [string, unknown[]];
const recorder = (): {p: Painter; ops: Op[]} => {
  const ops: Op[] = [];
  const brush = new Proxy({} as Record<string, unknown>, {get: (_t, k) => (k === 'then' ? undefined : (...a: unknown[]) => { ops.push(['b.' + String(k), a]); })});
  const p = {brush, t: 0, frame: 0, alpha: 1, wash: (...a: unknown[]) => ops.push(['wash', a]), flat: (...a: unknown[]) => ops.push(['flat', a]), ink: (...a: unknown[]) => ops.push(['ink', a]), inkStill: (...a: unknown[]) => ops.push(['inkStill', a]), group: (...a: unknown[]) => ops.push(['group', a]), layer: () => { throw new Error('layer'); }} as unknown as Painter;
  return {p, ops};
};
const hash = (ops: Op[]) => createHash('sha1').update(JSON.stringify(ops)).digest('hex');
const C: YCam = {x: 0, y: 1.05, z: 2.5, yaw: 0, pitch: 0, f: 1000, hy: 760};
const GOLD: Record<string, string> = {emu: '5b025d09100beb3c58a53ef73b4ab56272323717', raptor: 'eed0377cf914680c011af4f2189480ca05444efe'};
const paint = (B: Build, o: Record<string, unknown> = {}) => { const r = recorder(); const a = paintBeast(r.p, C, B, {at: [0, -0.2], heading: Math.PI, ground: 0.2, seed: 36000, shadowOp: 80, ...o}); return {...r, a}; };
const emuB = () => buildEmu(EMU_POSES.stand());
const rapB = () => BEAST_KIT.RAPTOR.stand();

test('air 0 and absent paint exactly as before (stroke hash)', () => {
  for (const [k, B] of [['emu', emuB()], ['raptor', rapB()]] as const) {
    const h0 = hash(paint(B).ops), h1 = hash(paint(B, {air: 0}).ops);
    if (process.env.T35_GOLD) console.log('GOLD', k, h0);
    assert.equal(h1, h0, `${k}: air 0 differs from absent`);
    assert.equal(h0, GOLD[k], `${k}: differs from the pre-change build`);
  }
});

const shadowPoly = (ops: Op[]) => { const i = ops.findIndex((o) => o[0] === 'b.fill' && o[1][0] === '#1e2418'); return {fill: ops[i][1] as [string, number], poly: ops.slice(i).find((o) => o[0] === 'b.polygon')![1][0] as number[][]}; };
const ringAt = (B: Build, at: [number, number], gy: number, k: number) => Array.from({length: 24}, (_, j) => { const a = (j / 24) * 6.283, h = Math.PI, s = B.shadow.s + B.shadow.rs * k * Math.cos(a), l = B.shadow.l + B.shadow.rl * k * Math.sin(a); return camPoint(C, [at[0] + s * Math.cos(h) + l * Math.sin(h), gy, at[1] + s * Math.sin(h) - l * Math.cos(h)])!; });
const near = (a: number[][], b: number[][]) => a.length === b.length && a.every((q, i) => Math.hypot(q[0] - b[i][0], q[1] - b[i][1]) < 1e-6);

test('air 0.25: shadow ring on ground + 0.01, lowest foot at ground + 0.25 + pad height', () => {
  const B = emuB(), r = paint(B, {air: 0.25}), s = shadowPoly(r.ops);
  assert.ok(near(s.poly, ringAt(B, [0, -0.2], 0.21, 0.85)), 'ring world y is ground + 0.01');
  const lowest = Math.min(...B.feet.map((f) => r.a.toWorld(f)[1]));
  assert.ok(Math.abs(lowest - (0.2 + 0.25 + Math.min(...B.feet.map((f) => f[1])))) < 1e-9);
});

test('air 0.25: shadow radius x 0.85, opacity x 0.7, foot contact shadows gone', () => {
  const B = emuB(), r0 = paint(B), r1 = paint(B, {air: 0.25});
  const s0 = shadowPoly(r0.ops), s1 = shadowPoly(r1.ops);
  assert.ok(near(s0.poly, ringAt(B, [0, -0.2], 0.21, 1)));
  assert.ok(near(s1.poly, ringAt(B, [0, -0.2], 0.21, 0.85)));
  assert.ok(Math.abs(s1.fill[1] / s0.fill[1] - 0.7) < 1e-9, `opacity ratio ${s1.fill[1] / s0.fill[1]}`);
  const feet = (ops: Op[]) => ops.filter((o) => o[0] === 'b.fill' && o[1][0] === '#141810').length;
  assert.ok(feet(r0.ops) > 0 && feet(r1.ops) === 0);
  assert.ok(feet(paint(B, {air: 0.1}).ops) > 0, 'foot contact shadow still present at 0.1 m');
});
