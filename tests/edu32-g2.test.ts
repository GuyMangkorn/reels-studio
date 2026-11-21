// EDU-EP32 G2 paper plates (Boss W5.2, 2026-11-21): B02-SH01 (page slide, pop-up ripple, cat slide, gate camera end key), B02-SH02 (paper AGENT,
// P09 smug, brow lift), B02-SH03 (paper cat look left / right and yawn) on the shot clock; kit cat `catLook` / `yawn` opt-in.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {ANIMALS, drawAnimal} from '../src/painted/kit/animals';
import {makePainter} from '../src/painted/kit/painter';
import {recordingPainter} from '../src/painted/kit/paper-card';
import {B02SH01, B02SH01_N, b02sh01Cam, b02sh01State, paintB02SH01} from '../src/painted/edu32/b02-sh01';
import {B02SH02, B02SH02_AGENT_AT, B02SH02_N, b02sh02Cam, paintAgentCard} from '../src/painted/edu32/b02-sh02';
import {B02SH03, B02SH03_N, b02sh03Cat, paintB02SH03} from '../src/painted/edu32/b02-sh03';
import {BRIDGE_CAM0} from '../src/painted/edu32/bridge';
import {AGENT} from '../src/painted/edu32/cast';
import {MEASURE} from '../src/painted/edu32/looks';
import {paintedShots} from '../src/painted/registry';
import {paintedStateAt} from '../src/scenes/painted';
import {validateTimeline} from '../src/scenes/timeline';
import gates from '../src/videos/edu32-gates/index';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const g2 = gates.videos.find((v) => v.id === 'EDU32-G2')!;
const N = B02SH01_N + B02SH02_N + B02SH03_N;
const stateAt = (C: number) => paintedStateAt(g2.timeline, C, 30, {ending: 'A_fade', durationInFrames: N, loopBlendFrames: 15, endingOptions: {holdSec: 0, fadeSec: 0}})!;

test('EDU32-G2: shot lengths match the timed sheet (G328-G574); each plate reads its shot frame', () => {
  validateTimeline(g2.timeline);
  assert.deepEqual([B02SH01_N, B02SH02_N, B02SH03_N], [436 - 328, 500 - 436, 574 - 500]);
  for (const id of ['EDU32-B02-SH01', 'EDU32-B02-SH02', 'EDU32-B02-SH03']) assert.ok(paintedShots[id], id);
  assert.deepEqual(stateAt(0).plates.map((p) => [p.shot, p.frame]), [['EDU32-B02-SH01', 0]]);
  assert.deepEqual(stateAt(B02SH01_N + 20).plates.map((p) => [p.shot, p.frame]), [['EDU32-B02-SH02', 20]]);
  assert.deepEqual(stateAt(N - 1).plates.map((p) => [p.shot, p.frame]), [['EDU32-B02-SH03', B02SH03_N - 1]]);
});

test('B02-SH01: page slides in by L8, cards rise L4-L22, cat slides onto the seat L32-L46 (G360-G374), end key = the gate camera', () => {
  assert.ok(b02sh01State(0).slide! > 5);
  assert.equal(b02sh01State(B02SH01.slide[1]).slide, 0);
  const r3 = b02sh01State(3).rise!, r22 = b02sh01State(22).rise!;
  assert.ok(Object.values(r3).every((k) => (k ?? 1) < 0.03)); // flat (riseAbout skips k < 0.03)
  assert.ok(Object.values(r22).every((k) => Math.abs((k ?? 0) - 1) < 1e-9));
  assert.equal(b02sh01State(B02SH01.cat[0]).catX, B02SH01.catFrom);
  assert.equal(b02sh01State(B02SH01.cat[1]).catX, 0);
  assert.deepEqual(b02sh01Cam(100), BRIDGE_CAM0);
  assert.deepEqual(b02sh01Cam(107), BRIDGE_CAM0);
  for (let L = 0; L < B02SH01_N; L++) paintB02SH01(noop(), L, `T-B02SH01-${L}`);
  const end = MEASURE['T-B02SH01-100'];
  const cat = end.find((l) => l.name.startsWith('CAT'))!;
  assert.ok(Math.abs(cat.bottom - 587) <= 1, `cat foot ${cat.bottom}`); // bridge PA F0 cat foot (582, 587)
});

test('B02-SH02: AGENT face above y 520 and right of the mark box; talk window holds the line', () => {
  for (const L of [0, 40, B02SH02_N - 1]) {
    const a = paintAgentCard(noop(), b02sh02Cam(L), AGENT, {at: B02SH02_AGENT_AT, t: 3, talk: false, browMix: 0})!;
    assert.ok(a.chin < 520, `L${L} chin ${a.chin}`);
  }
  assert.deepEqual(B02SH02.talk, [4, 48]);
});

test('B02-SH03: look left L4, right L14, front by L33; yawn peak L44 (G544), mouth closed and front at L73; cat above y 1200', () => {
  assert.ok(b02sh03Cat(6).catLook! < -0.99);
  assert.ok(b02sh03Cat(17).catLook! > 0.99);
  assert.ok(Math.abs(b02sh03Cat(33).catLook!) < 1e-9);
  assert.equal(b02sh03Cat(B02SH03.yawn.peak).yawn, 1);
  assert.equal(b02sh03Cat(73).yawn, undefined);
  assert.equal(b02sh03Cat(73).catLook, 0);
  for (let L = 0; L < B02SH03_N; L++) paintB02SH03(noop(), L, `T-B02SH03-${L}`);
  for (let L = 0; L < B02SH03_N; L++) {
    const cat = MEASURE[`T-B02SH03-${L}`].find((l) => l.name.startsWith('CAT'))!;
    assert.ok(cat.bottom < 1200, `L${L} cat bottom ${cat.bottom}`);
  }
});

test('kit cat catLook / yawn: absent or 0 draws the cat byte for byte as before; set, the head turns and the mouth opens', () => {
  const def = {...ANIMALS['cat-gray-tabby'], fluffy: true, soft: true};
  const shapes = (pose: object) => { const r = recordingPainter(); drawAnimal(r.p, def.seed, def, [540, 1200], 900, {view: 'front', state: 'sit', ...pose}, 1.0); return JSON.stringify(r.shapes); };
  const base = shapes({});
  assert.equal(shapes({catLook: 0, yawn: 0}), base);
  assert.equal(shapes({look: 0.8}), base); // cats still ignore the dogs' `look`
  assert.notEqual(shapes({catLook: 0.8}), base);
  assert.notEqual(shapes({yawn: 1}), base);
});
