// EDU-EP32 G6 (Boss W5.2, 2026-11-21): B05-SH01..SH03 and B06-SH01 timing (type-on, underline, stamp impact, printout drop, highlights) at the
// timed-sheet frames, the binding on-screen wording (Boat addendum), the stamp left uncovered by the printout, and paint smoke runs.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {camPoint} from '../src/painted/kit/ycam';
import {MEMO_STAMP, memoPt} from '../src/painted/edu32/office';
import {B05SH02_TYPE, B05SH03_STAMP, TYPE_A, TYPE_B, b05sh02Memo, b05sh03Memo, b05sh01Shade} from '../src/painted/edu32/b05-memo';
import {B05SH01, B05SH01_N, CAM_B05_SH01_B, b05sh01Cam, paintB05SH01, slowThird} from '../src/painted/edu32/b05-sh01';
import {B05SH02_N, b05sh02Cam, paintB05SH02} from '../src/painted/edu32/b05-sh02';
import {B05SH03_N, paintB05SH03} from '../src/painted/edu32/b05-sh03';
import {B06SH01_N, b06sh01Cam, b06sh01Highlights, paintB06SH01, printoutCorners, printoutPose} from '../src/painted/edu32/b06-sh01';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});

test('timed frame counts: 79 + 117 + 84 + 172 = G1131..G1583', () => {
  assert.deepEqual([B05SH01_N, B05SH02_N, B05SH03_N, B06SH01_N], [79, 117, 84, 172]);
  assert.equal(B05SH01_N + B05SH02_N + B05SH03_N + B06SH01_N, 1583 - 1131);
});

test('B05-SH01: first third slow (15 % by L26), arrives L76 and holds', () => {
  assert.ok(Math.abs(slowThird(26 / 76) - 0.15) < 0.03, `${slowThird(26 / 76)}`);
  for (const L of [B05SH01.arrive, B05SH01_N - 1]) {
    const c = b05sh01Cam(L);
    for (const k of ['x', 'y', 'z', 'yaw', 'pitch', 'f', 'hy'] as const) assert.ok(Math.abs((c[k] ?? 0) - (CAM_B05_SH01_B[k] ?? 0)) < 1e-9, `L${L} ${k}`);
  }
  assert.equal(b05sh01Shade(0).a, 0);
});

test('B05-SH02 type-on: TYPE_A L4-L37, pause, TYPE_B L48-L90 (G1300 complete), underline L92-L106 (G1316), monotonic and pure', () => {
  assert.equal(TYPE_A, 'This is in itself a');
  assert.equal(TYPE_B, 'remarkable scientific achievement.');
  assert.equal(b05sh02Memo(3).a, 0);
  assert.ok(b05sh02Memo(4).a >= 1);
  assert.equal(b05sh02Memo(B05SH02_TYPE.a[1]).a, TYPE_A.length);
  for (let L = 38; L <= 47; L++) assert.equal(b05sh02Memo(L).b, 0, `pause L${L}`);
  assert.ok(b05sh02Memo(48).b >= 1);
  assert.equal(b05sh02Memo(90).b, TYPE_B.length);
  assert.equal(1210 + 90, 1300);
  assert.ok(b05sh02Memo(89).b < TYPE_B.length);
  assert.equal(b05sh02Memo(91).underline, 0);
  assert.equal(b05sh02Memo(106).underline, 1);
  assert.ok(b05sh02Memo(105).underline < 1);
  for (let L = 1; L < B05SH02_N; L++) {
    const a = b05sh02Memo(L - 1), b = b05sh02Memo(L);
    assert.ok(b.a >= a.a && b.b >= a.b && b.underline >= a.underline, `L${L}`);
  }
  assert.deepEqual(b05sh02Memo(63), b05sh02Memo(63));
  assert.ok(b05sh02Cam(0).x !== b05sh02Cam(110).x);
});

test('B05-SH03 stamp: nothing before L37, slam from scale 1.3, impact L41 = G1368 at scale 1', () => {
  assert.equal(b05sh03Memo(36).stamp, null);
  assert.equal(b05sh03Memo(37).stamp?.scale, 1.3);
  assert.equal(b05sh03Memo(B05SH03_STAMP.impact).stamp?.scale, 1);
  assert.equal(1327 + B05SH03_STAMP.impact, 1368);
  assert.equal(b05sh03Memo(83).stamp?.opacity, 1);
});

test('B06-SH01 printout: off frame until it drops in, rests from L24, never covers the stamp at rest', () => {
  for (let L = 0; L <= 6; L++) {
    const q = printoutCorners(printoutPose(L)).map((v) => camPoint(b06sh01Cam(L), v));
    assert.ok(!q.every(Boolean) || Math.max(...q.map((p) => p![1])) < 0, `L${L} in frame`);
  }
  assert.deepEqual(printoutPose(24), printoutPose(171));
  const poly = printoutCorners(printoutPose(24)).map(([x, , z]) => [x, z] as const);
  const inside = ([px, pz]: readonly [number, number]) => {
    let s = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, zi] = poly[i], [xj, zj] = poly[j];
      if ((zi > pz) !== (zj > pz) && px < ((xj - xi) * (pz - zi)) / (zj - zi) + xi) s = !s;
    }
    return s;
  };
  const r = (MEMO_STAMP.rot * Math.PI) / 180;
  for (const [u, v] of [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5], [0, 0]]) {
    const x = u * MEMO_STAMP.w * Math.cos(r) - v * MEMO_STAMP.h * Math.sin(r), z = u * MEMO_STAMP.w * Math.sin(r) + v * MEMO_STAMP.h * Math.cos(r);
    const [wx, , wz] = memoPt(MEMO_STAMP.x + x, MEMO_STAMP.z + z);
    assert.ok(!inside([wx, wz]), `stamp point (${u}, ${v}) covered`);
  }
});

test('B06-SH01 highlights: "mind of its own" L59-L89, "familiar with" L140-L161', () => {
  assert.equal(b06sh01Highlights(58).hl1, 0);
  assert.ok(b06sh01Highlights(59).hl1 > 0);
  assert.equal(b06sh01Highlights(89).hl1, 1);
  assert.equal(b06sh01Highlights(139).hl2, 0);
  assert.equal(b06sh01Highlights(161).hl2, 1);
});

test('binding wording (Boat addendum): fragments verbatim, the second ends with an ellipsis; no extra page text', async () => {
  const {FRAG1, FRAG2} = await import('../src/painted/edu32/printout-text');
  assert.equal(FRAG1, '…had a mind of its own…');
  assert.equal(FRAG2, '…something all cat owners are quite familiar with…');
  const fs = await import('node:fs');
  const src = fs.readFileSync(new URL('../src/painted/edu32/printout-text.tsx', import.meta.url), 'utf8');
  for (const word of ['Acoustikitty', 'cia.gov', 'REJECTED', 'CLASSIFIED']) assert.ok(!src.includes(`'${word}`) && !src.includes(`>${word}`), word);
});

test('paint smoke: every G6 plate paints at its first, middle and last frame', () => {
  for (const [paint, n] of [[paintB05SH01, B05SH01_N], [paintB05SH02, B05SH02_N], [paintB05SH03, B05SH03_N], [paintB06SH01, B06SH01_N]] as const)
    for (const L of [0, Math.floor(n / 2), n - 1]) paint(noop(), L);
});
