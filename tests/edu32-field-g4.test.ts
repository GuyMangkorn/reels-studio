// EDU-EP32 G4 field plates (Boss W5.2, 2026-11-21): B03-SH02, B03-SH03 (overcast + sun crossfade), B03-SH04, B04-SH01 on the shot clock.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {BONE} from '../src/painted/kit/cast';
import {mittenThumbSide} from '../src/painted/kit/hand-gestures';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {SH02_ARMS, SH02_N, SH02_THUMB, paintB03SH02} from '../src/painted/edu32/b03-sh02';
import {SH03, SH03_N, paintB03SH03, sh03Cat, sh03Sparrow} from '../src/painted/edu32/b03-sh03';
import {PAWS, SH04_N, pathCircleClearance, pathDrawn} from '../src/painted/edu32/b03-sh04';
import {B04, B04_N, b04Cam, b04Cat, paintB04SH01} from '../src/painted/edu32/b04-sh01';
import {SF} from '../src/painted/edu32/field';
import {paintRealCat} from '../src/painted/edu32/cast';
import {MEASURE} from '../src/painted/edu32/looks';
import {paintedShots} from '../src/painted/registry';
import {crossfadeOf, paintedStateAt} from '../src/scenes/painted';
import {validateTimeline} from '../src/scenes/timeline';
import gates from '../src/videos/edu32-gates/index';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const g4 = gates.videos.find((v) => v.id === 'EDU32-G4')!;
const N = SH02_N + SH03_N + SH04_N + B04_N;
const stateAt = (C: number) => paintedStateAt(g4.timeline, C, 30, {ending: 'A_fade', durationInFrames: N, loopBlendFrames: 15, endingOptions: {holdSec: 0, fadeSec: 0}})!;

test('EDU32-G4: shot lengths match the timed sheet (G646-G993); each plate reads its shot frame; B03-SH03 sun is a crossfade over L18-L33', () => {
  validateTimeline(g4.timeline);
  assert.deepEqual([SH02_N, SH03_N, SH04_N, B04_N], [689 - 646, 786 - 689, 880 - 786, 993 - 880]);
  assert.equal(N, 993 - 646);
  assert.deepEqual(stateAt(0).plates.map((p) => [p.shot, p.frame]), [['EDU32-B03-SH02', 0]]);
  assert.deepEqual(stateAt(SH02_N + 10).plates.map((p) => [p.shot, p.frame]), [['EDU32-B03-SH03-O', 10]]);
  const mid = stateAt(SH02_N + 25);
  assert.deepEqual(mid.plates.map((p) => [p.shot, p.frame]), [['EDU32-B03-SH03-O', 25], ['EDU32-B03-SH03-S', 25]]);
  assert.ok(crossfadeOf(mid.plates, (id) => Boolean(paintedShots[id]?.crossfade)));
  assert.deepEqual(stateAt(SH02_N + 40).plates.map((p) => [p.shot, p.frame]), [['EDU32-B03-SH03-S', 40]]);
  assert.deepEqual(stateAt(SH02_N + SH03_N + SH04_N + 52).plates.map((p) => [p.shot, p.frame]), [['EDU32-B04-SH01', 52]]);
});

test('B03-SH03: cat sits at the seat, lands on the grass at L40, settles in the patch by L86 (G775), always above y 1200', () => {
  assert.deepEqual(sh03Cat(0).at, SF.catSeat);
  assert.equal(sh03Cat(0).pose.view, 'left'); // looking at MANNEQUIN L
  assert.equal(sh03Cat(SH03.step[1]).at[1], 0);
  assert.equal(sh03Cat(SH03.step[1] - 1).at[1] > 0, true);
  assert.deepEqual(sh03Cat(86).at, SF.patch);
  assert.equal(sh03Cat(86).pose.state, 'lie');
  assert.equal(sh03Cat(86).pose.view, 'left');
  for (let L = 0; L < SH03_N; L++) paintB03SH03(noop(), L, 'sun', `T-SH03-${L}`);
  for (let L = 0; L < SH03_N; L++) {
    const cat = MEASURE[`T-SH03-${L}`].find((l) => l.name.startsWith('CAT'))!;
    assert.ok(cat.bottom < 1200, `L${L} cat bottom ${cat.bottom}`);
  }
  const end = MEASURE['T-SH03-96'].find((l) => l.name.startsWith('CAT'))!;
  assert.ok(Math.abs(end.top - 869) < 6 && Math.abs(end.bottom - 1103) < 6, `${end.top}-${end.bottom}`);
});

test('B03-SH03: sparrow enters at L2, lands on the right armrest at L12, faces the cat', () => {
  assert.equal(sh03Sparrow(1), null);
  assert.equal(sh03Sparrow(5)!.m.fly, true);
  assert.deepEqual(sh03Sparrow(13)!.at, SF.sparrow);
  assert.ok(!sh03Sparrow(20)!.m.fly);
});

test('B03-SH04: paw path draws L4-L32, holds L32-L34, ends at L76, never touches the red circle', () => {
  assert.equal(pathDrawn(4), 0);
  assert.equal(pathDrawn(32), pathDrawn(34));
  assert.ok(pathDrawn(48) > pathDrawn(34));
  assert.equal(pathDrawn(76), 1);
  assert.equal(pathDrawn(SH04_N - 1), 1);
  assert.ok(PAWS.length > 40);
  assert.ok(pathCircleClearance() > 1.2);
});

test('B04-SH01: loaf in the patch to L51, gets up on "เล่าว่า" (L52), cat fully out of frame by L100 (G980)', () => {
  assert.deepEqual(b04Cat(51).at, SF.patch);
  assert.equal(b04Cat(51).pose.state, 'lie');
  assert.equal(b04Cat(53).pose.from, 'lie');
  // every painted mark of the cat (recorded polygons and splines, tail and thread included) is right of the frame from L100
  const catX0 = (L: number) => {
    const pts: Pt[] = [], brush = new Proxy({}, {get: (_t, n) => (...a: unknown[]) => { if ((n === 'polygon' || n === 'spline') && Array.isArray(a[0])) for (const q of a[0] as Pt[]) pts.push(q); }}) as Brush;
    paintRealCat(makePainter(brush, {t: 0, frame: L}), b04Cam(L), {at: b04Cat(L).at, t: 4 + L / 30, pose: b04Cat(L).pose});
    return Math.min(...pts.map((q) => q[0]));
  };
  let out = -1;
  for (let L = 64; L < B04_N; L++) if (catX0(L) > 1080) { out = L; break; }
  assert.ok(out > 0 && out <= 100, `cat fully out of frame at L${out}`);
  for (let L = out; L < B04_N; L++) assert.ok(catX0(L) > 1080, `stays out L${L}`);
  console.log('B04-SH01 cat fully out of frame at L', out);
  for (let L = 0; L < B04_N; L++) paintB04SH01(noop(), L, `T-B04-${L}`);
  for (let L = 0; L < B04_N; L++) for (const l of MEASURE[`T-B04-${L}`] ?? []) if (l.name.startsWith('CAT')) assert.ok(l.bottom < 1200, `L${L}`);
  assert.ok(B04.getUp[0] === 52);
});

test('B03-SH02: AGENT arms are one chain within 1.05 x BONE; mitten thumbs follow the hand-drawing rule; face clear of the mark box', () => {
  for (const side of ['l', 'r'] as const) {
    const {to, via} = SH02_ARMS[side];
    assert.ok(Math.hypot(...via) / BONE <= 1.05 && Math.hypot(to[0] - via[0], to[1] - via[1]) / BONE <= 1.05, side);
  }
  assert.equal(SH02_THUMB.l, mittenThumbSide('left', 'back'));
  assert.equal(SH02_THUMB.r, mittenThumbSide('right', 'palm'));
  for (let L = 0; L < SH02_N; L += 6) {
    paintB03SH02(noop(), L, `T-SH02-${L}`);
    const a = MEASURE[`T-SH02-${L}`].find((l) => l.name === 'AGENT')!;
    assert.ok(a.h >= 480 && a.top > 180, `L${L} ${a.top} ${a.h}`);
  }
});
