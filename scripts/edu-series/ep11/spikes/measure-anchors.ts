// EDU-EP11 spike measures that need no pixels: figure anchors through a stub Painter (every brush call a no-op), so drawFigure returns its anchors.
// Run: node --import tsx scripts/edu-series/ep11/spikes/measure-anchors.ts   (prints JSON)
import type {Painter} from '../../../../src/painted/kit/painter';
import {paintFigureAt} from '../../../../src/painted/kit/figure-at';
import {camPoint, camUnit} from '../../../../src/painted/kit/ycam';
import {paintFloat, woman} from '../../../../src/painted/edu11/car';
import {F0_CAM, FEET, SP1_CAM} from '../../../../src/painted/edu11/sp1';
import {carCorners, trackCam, yCarAt} from '../../../../src/painted/edu11/shaft';
import {hudAt} from '../../../../src/painted/edu11/hud';
import {sp3At, storyAt} from '../../../../src/painted/edu11/sp3';

const noop: (...a: unknown[]) => unknown = () => undefined;
const brush = new Proxy({}, {get: () => noop}) as unknown as Painter['brush'];
const stub: Painter = {brush, t: 0, frame: 0, alpha: 1, wash: noop, flat: noop, ink: noop, inkStill: noop, group: noop, layer: () => stub} as unknown as Painter;
const out: Record<string, unknown> = {};
const r = (v: number) => Math.round(v * 10) / 10;

for (const [name, rise] of [['R0', 0], ['R05', 0.5], ['R1', 1]] as const) {
  const t = 4.6;
  const a = paintFloat(stub, SP1_CAM, {at: FEET, t, lift: 0.15, rise, face: 'scared'})!;
  const floor = camPoint(SP1_CAM, FEET)!, u = camUnit(SP1_CAM, FEET);
  // hair fan top: hairRise adds up to ~0.9 m? measured in head units: the fan reaches ~2.7 head units above the head centre (1 unit = head height / 2.27)
  out[`SP1-${name}`] = {leadPx: r(a.bottom - a.headTop), headTopY: r(a.headTop), feetY: r(a.feet[1]), floorY: r(floor[1]), feetGapPx: r(floor[1] - a.feet[1]), pxPerM: r(u), headPx: r(a.chin - a.headTop)};
}
{
  const a = paintFigureAt(stub, F0_CAM, woman(0), {at: FEET, pose: 'P10', face: 'neutral', t: 0})!;
  out['F0'] = {leadPx: r(a.bottom - a.headTop), headTopY: r(a.headTop), feetY: r(a.feet[1])};
}
// SP1 arm pop check: arm anchors frame to frame over 2 s of zero-g-drift (max per-frame hand jump, px)
{
  let max = 0, prev: [number, number, number, number] | null = null;
  for (let i = 0; i < 90; i++) {
    const a = paintFloat(stub, SP1_CAM, {at: FEET, t: 4.6 + i / 30, lift: 0.15, rise: 1, face: 'scared'})!;
    const cur: [number, number, number, number] = [a.rHand[0], a.rHand[1], a.lHand[0], a.lHand[1]];
    if (prev) max = Math.max(max, Math.hypot(cur[0] - prev[0], cur[1] - prev[1]), Math.hypot(cur[2] - prev[2], cur[3] - prev[3]));
    prev = cur;
  }
  out['SP1-armJump-90f-maxPxPerFrame'] = r(max);
}
// SP2 car corners (picture px) at the three frames and the yaw-drift pair
for (const f of [286, 600, 790]) { const yc = yCarAt(f), c = carCorners(trackCam(yc), yc); out[`SP2-f${f}`] = {yCar: r(yc * 100) / 100, corners: c.map(([x, y]) => [r(x), r(y)])}; }
{ const f = 600, yc = yCarAt(f); out['SP2-f600-yaw3'] = {corners: carCorners(trackCam(yc, 3), yc).map(([x, y]) => [r(x), r(y)])}; out['SP2-px-per-frame-at-f790'] = r((yCarAt(789) - yCarAt(790)) * 2600 / 8.5); }
// SP3 states
for (const f of [866, 872, 877, 1211, 1216, 1221, 1228, 1236]) { const s = sp3At(f); out[`SP3-f${f}`] = {kind: s.kind, s: r(s.s), box: Object.fromEntries(Object.entries(s.box).map(([k, v]) => [k, r(v)])), hud: hudAt(s.s), story: (({light, mode, rise, lift, roll}) => ({light, mode, rise: r(rise * 100) / 100, lift, roll}))(storyAt(s.s))}; }
out['SP3-f1236-equals-story0'] = JSON.stringify([storyAt(sp3At(1236).s), hudAt(sp3At(1236).s)]) === JSON.stringify([storyAt(0), hudAt(0)]) && JSON.stringify(sp3At(1236).cam) === JSON.stringify(F0_CAM);
console.log(JSON.stringify(out, null, 1));
// SP2: WOMAN inside the section car (lead-size rule, Short lead >= 480 px): crouched P35 (B01-SH04..B03-SH02) and standing P01 for reference
{
  const yc = yCarAt(600);
  for (const [camName, cam] of [['r8.5 hy930', trackCam(yc)], ['r5.0 hy770', trackCam(yc, 0, 770, 5.0)]] as const)
  for (const [name, pose] of [['crouch-P35', 'P35'], ['standing-P01', 'P01']] as const) {
    const a = paintFigureAt(stub, cam, woman(0.3), {at: [-0.2, yc, -0.3], pose, face: 'worried', t: 0, shadow: false})!;
    console.error(`SP2 ${camName} ${name}: lead ${r(a.bottom - a.headTop)} px (head top ${r(a.headTop)}, feet ${r(a.feet[1])}); px/m ${r(camUnit(cam, [-0.2, yc, -0.3]))}`);
  }
}
