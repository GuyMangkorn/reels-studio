// EDU-EP11 look-frame measures that need no pixels: figure anchors through a stub Painter. Run: node --import tsx scripts/edu-series/ep11/spikes/measure-lf.ts
import type {Painter, Pt} from '../../../../src/painted/kit/painter';
import {camPoint, camUnit} from '../../../../src/painted/kit/ycam';
import {carCorners} from '../../../../src/painted/edu11/shaft';
import {GRIP, LF01B, LF01B_CAM, LF01_CAM, LF02_CAM, LF02_YC, paintLF01, paintLF01b, paintLF02, paintLF03} from '../../../../src/painted/edu11/lf';
import {FEET} from '../../../../src/painted/edu11/sp1';
import {HALL_CAM, ropeCutAt} from '../../../../src/painted/edu11/hall';
import {paintLF04} from '../../../../src/painted/edu11/lf';
import {CATCH_CAM_R12, JAWS_CAM} from '../../../../src/painted/edu11/brakes';
import {STORE_CAM} from '../../../../src/painted/edu11/store';

const noop: (...a: unknown[]) => unknown = () => undefined;
const brush = new Proxy({}, {get: () => noop}) as unknown as Painter['brush'];
const stub: Painter = {brush, t: 0, frame: 0, alpha: 1, wash: noop, flat: noop, ink: noop, inkStill: noop, group: noop, layer: () => stub} as unknown as Painter;
const r = (v: number) => Math.round(v * 10) / 10;
const out: Record<string, unknown> = {};
type A = {headTop: number; bottom: number; feet: Pt; rHand: Pt; lHand: Pt; head: Pt} | null | undefined;
const lead = (a: A) => (a ? {leadPx: r(a.bottom - a.headTop), headTopY: r(a.headTop), bottomY: r(a.bottom)} : null);

out.LF01 = {...lead(paintLF01(stub)), floorY: r(camPoint(LF01_CAM, FEET)![1])};
{
  const a = paintLF01b(stub, 220)!, fl = camPoint(LF01B_CAM, LF01B.feet)!;
  out.LF01b = {...lead(a), floorY: r(fl[1]), feetGapPx: r(fl[1] - a.bottom), rHand: a.rHand.map(r), gripPx: camPoint(LF01B_CAM, GRIP)!.map(r), phone: camPoint(LF01B_CAM, LF01B.phone)!.map(r), pen: camPoint(LF01B_CAM, LF01B.pen)!.map(r), tissue: camPoint(LF01B_CAM, LF01B.tissue)!.map(r), headCentre: a.head.map(r)};
  const hands = [219, 220, 221].map((f) => { const b = paintLF01b(stub, f)!; return [...b.rHand, ...b.lHand]; });
  const jump = (i: number) => Math.max(Math.hypot(hands[i + 1][0] - hands[i][0], hands[i + 1][1] - hands[i][1]), Math.hypot(hands[i + 1][2] - hands[i][2], hands[i + 1][3] - hands[i][3]));
  out['LF01b-armJump-219-221-maxPx'] = {'219-220': r(jump(0)), '220-221': r(jump(1))};
}
{ const a = paintLF02(stub) as A; const cc = carCorners(LF02_CAM, LF02_YC); out.LF02 = {...lead(a), carBottomY: r(Math.max(...cc.map((c) => c[1]))), carTopY: r(Math.min(...cc.map((c) => c[1]))), carX: [r(Math.min(...cc.map((c) => c[0]))), r(Math.max(...cc.map((c) => c[0])))], head: a ? a.head.map(r) : null, torsoApprox: a ? [r(a.rShoulder[0]), r(a.lShoulder[0])] : null, railX: [camPoint(LF02_CAM, [-0.85, LF02_YC + 1, 0])![0], camPoint(LF02_CAM, [0.85, LF02_YC + 1, 0])![0]].map(r)}; }
{ const o = paintLF03(stub, -0.7, -1) as unknown as {show: A; asst: A; crowd: A[]}; const cut = camPoint(HALL_CAM, ropeCutAt(-0.7, -1))!; out.LF03 = {showman: lead(o.show), assistant: lead(o.asst), assistantHead: o.asst ? o.asst.head.map(r) : null, ropeCutPx: cut.map(r), crowdHeadTops: o.crowd.map((c) => (c ? r(c.headTop) : null)), showmanFeetX: o.show ? r(o.show.feet[0]) : null}; }
{ const o = paintLF04(stub) as unknown as A[]; out.LF04 = {passengers: o.map(lead), bayWidthPx: [camPoint(STORE_CAM, [-2, 6, 0])![0], camPoint(STORE_CAM, [2, 6, 0])![0]].map(r), cageFloorY: r(camPoint(STORE_CAM, [0, 5.85, 0])![1]), cageX: [camPoint(STORE_CAM, [-0.8, 6, 0])![0], camPoint(STORE_CAM, [0.8, 6, 0])![0]].map(r)}; }
{ const c = CATCH_CAM_R12(1.28); out['LF05-catch'] = {pawlTipPx: camPoint(c, [0.965, 2.43, 0.15])!.map(r), notchPocketPx: camPoint(c, [0.9, 2.42, 0.1])!.map(r), springEndsPx: [camPoint(c, [0.5, 2.88, 0.14])!.map(r), camPoint(c, [0.77, 2.72, 0.14])!.map(r)], ropeEndsPx: [camPoint(c, [0.37, 3.05, 0.14])!.map(r), camPoint(c, [0.55, 2.92, 0.14])!.map(r)], notchPitchPx: r(camPoint(c, [0.9, 2.4, 0.1])![1] - camPoint(c, [0.9, 2.5, 0.1])![1])}; }
{ const j = JAWS_CAM; out['LF05-jaws'] = {biteCentrePx: camPoint(j, [0.85, 0.955, 0.1])!.map(r), blockTopY: r(camPoint(j, [0.82, 1.04, 0.09])![1]), blockBottomY: r(camPoint(j, [0.82, 0.87, 0.09])![1]), unit: r(camUnit(j, [0.85, 0.95, 0.1]))}; }
console.log(JSON.stringify(out, null, 1));
