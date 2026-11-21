// EDU-EP32 B03-SH01 bridge (VD32-18; Boss W3 gate LF-BR, 2026-11-21): two plates on one camera function of the shot frame.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {BRIDGE, BRIDGE_CAM0, BRIDGE_CAM1, NEAR_SHADE, bridgeCam, bridgeFold, paintBridgePA, paintBridgePB} from '../src/painted/edu32/bridge';
import {MEASURE, paintParkPopUp} from '../src/painted/edu32/looks';
import {paintedShots} from '../src/painted/registry';
import {crossfadeOf, paintedStateAt} from '../src/scenes/painted';
import {validateTimeline} from '../src/scenes/timeline';
import gates from '../src/videos/edu32-gates/index';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const timeline = gates.videos[0].timeline;
const stateAt = (F: number) => paintedStateAt(timeline, F, 30, {ending: 'A_fade', durationInFrames: 72, loopBlendFrames: 15, endingOptions: {holdSec: 0, fadeSec: 0}})!;

test('EDU32-LF-BR: both plates read the shot frame; PB is a crossfade layer over f24-f39 only', () => {
  validateTimeline(timeline);
  assert.equal(paintedShots['EDU32-B03-SH01-PB'].crossfade, true);
  for (const F of [0, 23, 40, 71]) assert.deepEqual(stateAt(F).plates.map((p) => p.frame), [F]);
  for (const F of [24, 32, 39]) {
    const s = stateAt(F);
    assert.deepEqual(s.plates.map((p) => [p.shot, p.frame]), [['EDU32-B03-SH01-PA', F], ['EDU32-B03-SH01-PB', F]]);
    assert.ok(crossfadeOf(s.plates, (id) => Boolean(paintedShots[id]?.crossfade)));
  }
});

test('bridge camera: gate camera at f0, cat-height key at f62, fold 0 -> 75 deg over f20-f40', () => {
  assert.deepEqual(bridgeCam(0), {...BRIDGE_CAM0, cx: 0});
  const c = bridgeCam(BRIDGE.diveTo);
  for (const k of ['x', 'y', 'z', 'yaw', 'pitch', 'f', 'hy'] as const) assert.ok(Math.abs((c[k] ?? 0) - (BRIDGE_CAM1[k] ?? 0)) < 1e-9, k);
  assert.equal(bridgeFold(BRIDGE.foldFrom), 0);
  assert.ok(Math.abs(bridgeFold(BRIDGE.foldTo) - (75 * Math.PI) / 180) < 1e-9);
});

test('paper cat and real cat coincide (same anchor and size) at every dissolve frame', () => {
  for (const F of [24, 28, 32, 36, 40]) {
    paintBridgePA(noop(), F, `T-PA-${F}`);
    paintBridgePB(noop(), F, `T-PB-${F}`);
    const pa = MEASURE[`T-PA-${F}`].find((l) => l.name.startsWith('CAT'))!, pb = MEASURE[`T-PB-${F}`].find((l) => l.name.startsWith('CAT'))!;
    assert.deepEqual([pa.top, pa.bottom], [pb.top, pb.bottom], `f${F}`);
  }
});

test('caption-band near shade: PA f0 is the bare LF02 pop-up (entry frame), the shade is in from f10; R3 key hy 820 at f62', () => {
  const calls = (paint: (p: ReturnType<typeof noop>) => void) => {
    let n = 0;
    paint(makePainter(new Proxy({}, {get: () => () => { n++; }}) as Brush, {t: 0, frame: 0}));
    return n;
  };
  assert.equal(calls((p) => paintBridgePA(p, 0, 'T-SH-0')), calls((p) => paintParkPopUp(p, bridgeCam(0), 'T-POP-0', 1.2, bridgeFold(0))));
  assert.ok(calls((p) => paintBridgePA(p, NEAR_SHADE.paRamp, 'T-SH-10')) > calls((p) => paintParkPopUp(p, bridgeCam(NEAR_SHADE.paRamp), 'T-POP-10', 1.2 + NEAR_SHADE.paRamp / 30, bridgeFold(NEAR_SHADE.paRamp))));
  assert.equal(BRIDGE_CAM1.hy, 820);
});
