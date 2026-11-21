// EDU-EP32 G1 paper plates (Boss W5.2, 2026-11-21): B01-SH01, B01-SH02 (screen callouts), B01-SH03 (yawn, lie-down, ear flick) on page BP.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {B01_SH01_N, paintB01SH01} from '../src/painted/edu32/b01-sh01';
import {B01_SH02_N, CO, b01Sh02Progress, paintB01SH02} from '../src/painted/edu32/b01-sh02';
import {B01_SH03, B01_SH03_N, b01Sh03Act, b01Sh03Cam, paintB01SH03} from '../src/painted/edu32/b01-sh03';
import {LABEL_H, calloutLayout} from '../src/painted/edu32/b01-callouts';
import {loafOf} from '../src/painted/edu32/b01-set';
import {CAM_B01_KEY, paintB01Ref} from '../src/painted/edu32/office';
import {MEASURE} from '../src/painted/edu32/looks';
import {paintedShots} from '../src/painted/registry';
import {paintedStateAt} from '../src/scenes/painted';
import {validateTimeline} from '../src/scenes/timeline';
import gates from '../src/videos/edu32-gates/index';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const g1 = gates.videos.find((v) => v.id === 'EDU32-G1')!;
const N = B01_SH01_N + B01_SH02_N + B01_SH03_N;
const stateAt = (C: number) => paintedStateAt(g1.timeline, C, 30, {ending: 'A_fade', durationInFrames: N, loopBlendFrames: 15, endingOptions: {holdSec: 0, fadeSec: 0}})!;
const cat = (id: string) => MEASURE[id]?.[0];

test('EDU32-G1: shot lengths match the timed sheet (G0-G328); each plate reads its shot frame; plates registered', () => {
  validateTimeline(g1.timeline);
  assert.deepEqual([B01_SH01_N, B01_SH02_N, B01_SH03_N], [81, 229 - 81, 328 - 229]);
  assert.deepEqual(stateAt(0).plates.map((p) => [p.shot, p.frame]), [['EDU32-B01-SH01', 0]]);
  assert.deepEqual(stateAt(81 + 32).plates.map((p) => [p.shot, p.frame]), [['EDU32-B01-SH02', 32]]);
  assert.deepEqual(stateAt(229 + 77).plates.map((p) => [p.shot, p.frame]), [['EDU32-B01-SH03', 77]]);
  for (const id of ['EDU32-B01-SH01', 'EDU32-B01-SH02', 'EDU32-B01-SH03']) assert.ok(paintedShots[id], id);
});

test('EDU32-G1: hero cat spans (acceptance G80 560-680 px with ears below y 230; staging above y 1200; mark box clear)', () => {
  paintB01SH01(noop(), 80, 'T-SH01-80');
  const a = cat('T-SH01-80')!;
  assert.ok(a.h >= 560 && a.h <= 680, `G80 cat ${a.h}`);
  assert.ok(a.top >= 230, `G80 ears ${a.top}`);
  for (const [paint, n, tag] of [[paintB01SH01, B01_SH01_N, 'A'], [paintB01SH02, B01_SH02_N, 'B'], [paintB01SH03, B01_SH03_N, 'C']] as const)
    for (let L = 0; L < n; L += 7) {
      paint(noop(), L, `T-${tag}-${L}`);
      const s = cat(`T-${tag}-${L}`)!;
      assert.ok(s.bottom < 1200 && s.top > 120, `${tag} L${L} cat y ${s.top}-${s.bottom}`);
    }
});

test('EDU32-G1: B01-SH03 end key equals the LF04-REF mirror reference (same camera, cat within 8 %)', () => {
  for (const L of [B01_SH03.push[1], B01_SH03_N - 1]) {
    const c = b01Sh03Cam(L) as unknown as Record<string, number>, k = CAM_B01_KEY as unknown as Record<string, number>;
    for (const f of ['x', 'y', 'z', 'yaw', 'pitch', 'f', 'hy']) assert.ok(Math.abs(c[f] - k[f]) < 1e-9, `L${L} ${f}`);
  }
  paintB01SH03(noop(), 77, 'T-SH03-77');
  paintB01Ref(noop(), CAM_B01_KEY, 'T-REF', 2.0);
  const s = cat('T-SH03-77')!, r = cat('T-REF')!;
  assert.ok(Math.abs(s.h - r.h) / r.h <= 0.08 && Math.abs(s.top - r.top) <= 0.08 * r.h, `${JSON.stringify(s)} vs ${JSON.stringify(r)}`);
  // acting beats: yawn widest at L28, settled lie from L67 (loaf on the settle frame), ear flick inside L68-L76
  assert.equal(b01Sh03Act(28).yawn, 1);
  assert.equal(b01Sh03Act(67).state, 'lie');
  assert.equal(loafOf(b01Sh03Act(66).blend), 0.49 * Math.min(1, ((14 / 15) - 0.5) / 0.5));
  assert.equal(loafOf(b01Sh03Act(67).blend), 1);
  assert.ok((b01Sh03Act(72).ears ?? 0) > 0.45 && !b01Sh03Act(77).ears && !b01Sh03Act(67).ears);
});

test('EDU32-G1: B01-SH02 truck ends at rest; callouts inside x 120-960, above y 1100, 20 px from the tail, clear of the mark box', () => {
  assert.equal(b01Sh02Progress(147), 1);
  assert.ok(Math.abs(b01Sh02Progress(147) - b01Sh02Progress(146)) < 1e-3);
  for (const L of [CO.co1[1], CO.co2[1], CO.co3[1], 147]) {
    const lay = calloutLayout(L)!;
    for (const l of [lay.l1, lay.l2, lay.l3]) {
      assert.ok(l.x >= 120 && l.x + l.w <= 960 && l.y + LABEL_H <= 1100, `L${L} label ${JSON.stringify(l)}`);
      assert.ok(l.y > 160 || l.x > 240, `L${L} label in the mark box`);
      const tail = lay.a.tail!;
      const dx = Math.max(l.x - tail[0], 0, tail[0] - (l.x + l.w)), dy = Math.max(l.y - tail[1], 0, tail[1] - (l.y + LABEL_H));
      assert.ok(Math.hypot(dx, dy) >= 20, `L${L} label near the tail`);
    }
    assert.ok(Math.hypot(lay.a.torso[0] - lay.a.tail![0], lay.a.torso[1] - lay.a.tail![1]) >= 20);
    assert.ok(lay.l2.y >= lay.l3.y + LABEL_H, 'CO2 below CO3');
  }
});
