// EDU-EP32 G5 (Boss W5.2, 2026-11-21): B04-SH02 door close and sign swing, B04-SH03 bowl slide and kibble, at the timed-sheet frames.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {camPoint} from '../src/painted/kit/ycam';
import {LF05_AJAR, SIGN_REST} from '../src/painted/edu32/corridor';
import {B04SH02_N, b04sh02Door, b04sh02Spans, paintB04SH02} from '../src/painted/edu32/b04-sh02';
import {B04SH03_N, SH03D, b04sh03Bowl, b04sh03Cam, b04sh03Kibble, kibbleLand, paintB04SH03} from '../src/painted/edu32/b04-sh03';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});

test('timed frame counts: B04-SH02 79 f, B04-SH03 59 f', () => {
  assert.equal(B04SH02_N, 79);
  assert.equal(B04SH03_N, 59);
});

test('B04-SH02: ajar L0-L3, closes monotonically L4-L20, latched from L20 (G1013); the gap shows only while open', () => {
  for (let L = 0; L <= 4; L++) assert.equal(b04sh02Door(L).ajar, LF05_AJAR);
  for (let L = 5; L <= 20; L++) assert.ok(b04sh02Door(L).ajar < b04sh02Door(L - 1).ajar, `L${L}`);
  for (let L = 20; L < B04SH02_N; L++) assert.equal(b04sh02Door(L).ajar, 0);
  assert.ok(b04sh02Spans(0).gapPx > 25);
  for (let L = 20; L < B04SH02_N; L++) assert.equal(b04sh02Spans(L).gapPx, 0);
});

test('B04-SH02: the card swings to about +14 deg after the latch, settles to rest by L50; taps (lift back to 0) at L22 and L30', () => {
  const peak = Math.max(...Array.from({length: 30}, (_, i) => b04sh02Door(20 + i).swing - SIGN_REST));
  assert.ok(peak > 12 && peak < 18, `peak ${peak}`);
  for (let L = 50; L < B04SH02_N; L++) assert.ok(Math.abs(b04sh02Door(L).swing - SIGN_REST) < 1e-9, `L${L}`);
  assert.ok(b04sh02Door(21).lift > 0 && Math.abs(b04sh02Door(22).lift) < 1e-9 && b04sh02Door(26).lift > 0 && Math.abs(b04sh02Door(30).lift) < 1e-9);
});

test('B04-SH02: door base stays above the caption band (y 1230) and the sign shows whole at L0 and once settled', () => {
  for (let L = 0; L < B04SH02_N; L++) assert.ok(b04sh02Spans(L).door.y1 < 1230, `L${L}`);
  for (const L of [0, 50, 78]) { const m = b04sh02Spans(L); assert.ok(m.sign && !m.signClipped, `L${L}`); }
  for (const L of [0, 20, 78]) paintB04SH02(noop(), L);
});

test('B04-SH03: bowl off frame before L6, stopped from L20 (wobble L20-L24 only), above y 1200; kibble lands L23-L35', () => {
  const sx = (L: number) => camPoint(b04sh03Cam(L), b04sh03Bowl(L))![0];
  assert.ok(sx(0) > 1180 && sx(6) > 1180);
  for (const L of [24, 30, 58]) assert.ok(Math.hypot(b04sh03Bowl(L)[0] - 0.1, b04sh03Bowl(L)[2] - 0.25) < 1e-9, `L${L}`);
  assert.equal(kibbleLand(0), 23);
  assert.equal(kibbleLand(SH03D.pieces - 1), 35);
  assert.equal(b04sh03Kibble(22).landed, 0);
  assert.equal(b04sh03Kibble(23).landed, 1);
  assert.equal(b04sh03Kibble(35).landed, SH03D.pieces);
  assert.equal(b04sh03Kibble(35).falling.length, 0);
  for (const L of [20, 35, 58]) { const r = paintB04SH03(noop(), L); assert.ok(r.bowl && r.bowl.bottom < 1200, `L${L}`); }
});
