// EDU-EP32 G2 plate measures (Boss W5.2, 2026-11-21): runs the B02-SH01, B02-SH02 and B02-SH03 plate painters with a no-op brush at every shot
// frame and prints per shot the lead spans (px top / bottom / height; min and max over the shot, lowest bottom), the B02-SH01 bench line at L100
// against the gate camera (LF02 = bridge PA F0), the AGENT face span in B02-SH02 and the paper cat in B02-SH03 at L0 / L44 / L73.
//   node --import tsx scripts/edu-series/ep32/short/measure-g2.ts
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {MEASURE} from '../../../../src/painted/edu32/looks';
import {bridgeMarks} from '../../../../src/painted/edu32/bridge';
import {AGENT} from '../../../../src/painted/edu32/cast';
import {camPoint} from '../../../../src/painted/kit/ycam';
import {BENCH_P} from '../../../../src/painted/edu32/looks';
import {B02SH01_N, b02sh01Cam, paintB02SH01} from '../../../../src/painted/edu32/b02-sh01';
import {B02SH02, B02SH02_AGENT_AT, B02SH02_N, b02sh02Cam, paintAgentCard, paintB02SH02} from '../../../../src/painted/edu32/b02-sh02';
import {B02SH03_N, paintB02SH03} from '../../../../src/painted/edu32/b02-sh03';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const run = (label: string, n: number, paint: (L: number, id: string) => void, at: number[] = []) => {
  const all: Record<string, {L: number; top: number; bottom: number; h: number}[]> = {};
  for (let L = 0; L < n; L++) {
    const id = `M-${label}-${L}`;
    paint(L, id);
    for (const s of MEASURE[id] ?? []) (all[s.name] ??= []).push({L, top: s.top, bottom: s.bottom, h: s.h});
  }
  for (const [name, list] of Object.entries(all)) {
    const hs = list.map((x) => x.h), mn = list[hs.indexOf(Math.min(...hs))], mx = list[hs.indexOf(Math.max(...hs))];
    console.log(`${label} ${name}: frames ${list.length}/${n}; h min ${mn.h} (L${mn.L}, y ${mn.top}-${mn.bottom}) max ${mx.h} (L${mx.L}, y ${mx.top}-${mx.bottom}); lowest y ${Math.max(...list.map((x) => x.bottom))}; top min ${Math.min(...list.map((x) => x.top))}`);
  }
  for (const L of at) console.log(`${label} L${L}:`, JSON.stringify(MEASURE[`M-${label}-${L}`]));
};
run('B02-SH01', B02SH01_N, (L, id) => paintB02SH01(noop(), L, id), [100]);
const gate = bridgeMarks(0), c100 = b02sh01Cam(100);
const mine = {seatL: camPoint(c100, [BENCH_P.x0, BENCH_P.seat, BENCH_P.zf]), seatR: camPoint(c100, [BENCH_P.x1, BENCH_P.seat, BENCH_P.zf]), catFoot: camPoint(c100, [0, BENCH_P.seat, -0.3])};
console.log('B02-SH01 L100 vs bridge PA F0 (px):', JSON.stringify({gate: {seatL: gate.seatL, seatR: gate.seatR, catFoot: gate.catFoot}, mine}));
run('B02-SH02', B02SH02_N, (L, id) => paintB02SH02(noop(), L, id), [0, 63]);
for (const L of [0, B02SH02.brow[1], B02SH02_N - 1]) {
  const a = paintAgentCard(noop(), b02sh02Cam(L), AGENT, {at: B02SH02_AGENT_AT, t: 3 + L / 30, talk: false, browMix: 0});
  if (a) console.log(`B02-SH02 L${L} AGENT face y ${Math.round(a.faceTop)}-${Math.round(a.chin)}, lead ${Math.round(a.top)}-${Math.round(a.bottom)} (${Math.round(a.bottom - a.top)} px)`);
}
run('B02-SH03', B02SH03_N, (L, id) => paintB02SH03(noop(), L, id), [0, 44, 73]);
