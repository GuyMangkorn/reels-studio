import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stageCanvasStyle, type PaintedShot} from '../src/painted/shot';
import {edu30Shots} from '../src/painted/shots/edu30';
import {SHOT_DEFS, canvasStyleOf} from '../src/painted/edu30/shot';

// EDU-EP30 ticket T34: optional `canvasStyle` hook on the shared canvas wrapper.
void edu30Shots;
const o = {width: 1080, height: 1920, fps: 30};
const stub = (canvasStyle?: PaintedShot['canvasStyle']) => ({id: 'S', serves: [], paper: '#fff', camera: () => ({} as never), paint: () => undefined, canvasStyle}) as PaintedShot;
const styled = stub(({tl}) => ({filter: `blur(${tl}px)`}));

test('(a) one visible plate with canvasStyle: the wrapper gets that style at the plate clock', () => {
  assert.deepEqual(stageCanvasStyle([{shot: styled, tl: 2}], false, o), {filter: 'blur(2px)'});
});
test('(b) two visible plates (dissolve) or a crossfade layer: {}', () => {
  assert.deepEqual(stageCanvasStyle([{shot: styled, tl: 2}, {shot: styled, tl: 1}], false, o), {});
  assert.deepEqual(stageCanvasStyle([{shot: styled, tl: 2}], true, o), {});
});
test('(c) a shot without canvasStyle: {}, and PaintedStage always renders the stable wrapper div', () => {
  assert.deepEqual(stageCanvasStyle([{shot: stub(), tl: 2}], false, o), {});
  assert.match(readFileSync('src/painted/PaintedStage.tsx', 'utf8'), /<div style=\{\{position: 'absolute', inset: 0, \.\.\.stageCanvasStyle\([^\n]*\)\}\}>\s*<BrushCanvas/);
});
test('(d) canvasStyleOf: B03-SH01 L2 overscan + shake; B01-SH01 L0 neither', () => {
  // B03-SH01 sets `shake` (T24): rotate at L 2, none after the bolt stop; the synthetic shake below pins the exact wiring.
  assert.match(String(canvasStyleOf(SHOT_DEFS['B03-SH01'], 2, 690).transform), /translate\(-?[\d.]+px, -?[\d.]+px\) rotate\(-?[\d.]+deg\) scale\(1\.05\)$/);
  const t71 = String(canvasStyleOf(SHOT_DEFS['B03-SH01'], 71, 759).transform);
  assert.match(t71, /scale\(1\.05\)$/);
  assert.doesNotMatch(t71, /rotate\(-?0*\.?0*[1-9]/);
  const a = String(canvasStyleOf({...SHOT_DEFS['B03-SH01'], shake: () => ({dx: 3, dy: -2, rot: 0.4})}, 2, 706).transform);
  assert.match(a, /scale\(1\.05\)/);
  assert.match(a, /translate\(3px, -2px\) rotate\(0\.4deg\) scale\(1\.05\)$/);
  const b = String(canvasStyleOf(SHOT_DEFS['B01-SH01'], 0, 0).transform);
  assert.doesNotMatch(b, /scale\(1\.05\)/);
  assert.doesNotMatch(b, /rotate/);
  assert.equal(canvasStyleOf(SHOT_DEFS['B01-SH01'], 0, 0).transformOrigin, '540px 960px');
});
test('registered EDU30 plate exposes canvasStyle and the style equals canvasStyleOf at its frame', () => {
  const plate = edu30Shots.find((x) => x.id === 'EDU30-B03-SH01')!;
  assert.equal(typeof plate.canvasStyle, 'function');
  assert.deepEqual(plate.canvasStyle!({tl: 2 / 30, ...o}), canvasStyleOf(SHOT_DEFS['B03-SH01'], 2, 688 + 2));
});
