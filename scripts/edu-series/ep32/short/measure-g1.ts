// EDU-EP32 G1 plate measures (Boss W5.2, 2026-11-21): runs the B01-SH01, B01-SH02 and B01-SH03 plate painters with a no-op brush at every shot
// frame and prints per shot the hero cat's lead span (px top / bottom / height; min and max), the acceptance-frame spans, the B01-SH02 callout
// boxes and their clearance from the tail tip, and the B01-SH03 end key against the LF04-REF reference (same cat, same camera).
//   node --import tsx scripts/edu-series/ep32/short/measure-g1.ts
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {MEASURE} from '../../../../src/painted/edu32/looks';
import {paintB01SH01, B01_SH01_N} from '../../../../src/painted/edu32/b01-sh01';
import {paintB01SH02, B01_SH02_N} from '../../../../src/painted/edu32/b01-sh02';
import {paintB01SH03, B01_SH03_N} from '../../../../src/painted/edu32/b01-sh03';
import {calloutLayout} from '../../../../src/painted/edu32/b01-callouts';
import {CAM_B01_KEY, paintB01Ref} from '../../../../src/painted/edu32/office';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const run = (label: string, n: number, paint: (L: number, id: string) => void, at: number[] = []) => {
  const all: {L: number; top: number; bottom: number; h: number}[] = [];
  for (let L = 0; L < n; L++) {
    const id = `M-${label}-${L}`;
    paint(L, id);
    for (const s of MEASURE[id] ?? []) all.push({L, ...s});
  }
  const hs = all.map((x) => x.h), mn = all[hs.indexOf(Math.min(...hs))], mx = all[hs.indexOf(Math.max(...hs))];
  console.log(`${label} CAT: frames ${all.length}/${n}; h min ${mn.h} (L${mn.L}, y ${mn.top}-${mn.bottom}) max ${mx.h} (L${mx.L}, y ${mx.top}-${mx.bottom}); top min ${Math.min(...all.map((x) => x.top))}; lowest ${Math.max(...all.map((x) => x.bottom))}`);
  for (const L of at) { const s = all.find((x) => x.L === L); console.log(`${label} L${L}: ${s ? `h ${s.h} y ${s.top}-${s.bottom}` : 'none'}`); }
};
run('B01-SH01', B01_SH01_N, (L, id) => paintB01SH01(noop(), L, id), [0, 80]);
run('B01-SH02', B01_SH02_N, (L, id) => paintB01SH02(noop(), L, id), [0, 147]);
run('B01-SH03', B01_SH03_N, (L, id) => paintB01SH03(noop(), L, id), [0, 28, 67, 77, 98]);
paintB01Ref(noop(), CAM_B01_KEY, 'M-REF', 2.0);
console.log('LF04-REF (CAM_B01_KEY, t 2.0):', JSON.stringify(MEASURE['M-REF']));
for (const L of [44, 77, 124, 147]) {
  const lay = calloutLayout(L);
  if (!lay) { console.log(`callouts L${L}: none`); continue; }
  const {a, l1, l2, l3} = lay, tail = a.tail;
  const minTail = tail ? Math.round(Math.min(...[[l1.x, l1.y], [l1.x + l1.w, l1.y + 64], [l2.x, l2.y + 32], [l2.x + l2.w, l2.y + 32], a.torso, [l3.x, l3.y + 64]].map((q) => Math.hypot(q[0] - tail[0], q[1] - tail[1])))) : -1;
  console.log(`callouts L${L}: ear ${a.ear.map(Math.round)} torso ${a.torso.map(Math.round)} tail ${tail?.map(Math.round)}; CO1 ${l1.x | 0},${l1.y | 0} w${l1.w}; CO2 ${l2.x | 0},${l2.y | 0} w${l2.w}; CO3 ${l3.x | 0},${l3.y | 0} w${l3.w}; min distance to tail ${minTail}`);
}
