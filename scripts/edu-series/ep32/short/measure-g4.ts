// EDU-EP32 G4 plate measures (Boss W5.2, 2026-11-21): runs the B03-SH02, B03-SH03, B03-SH04 and B04-SH01 plate painters with a no-op brush at
// every shot frame and prints per shot the lead spans (px top / bottom / height; min and max over the shot), the frames where the cat leaves
// frame, the sun-patch front row, the paw-path clearance from the red circle and the AGENT arm bone ratios.
//   node --import tsx scripts/edu-series/ep32/short/measure-g4.ts
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {BONE} from '../../../../src/painted/kit/cast';
import {camPoint} from '../../../../src/painted/kit/ycam';
import {MEASURE} from '../../../../src/painted/edu32/looks';
import {SF} from '../../../../src/painted/edu32/field';
import {SH02_ARMS, SH02_N, paintB03SH02} from '../../../../src/painted/edu32/b03-sh02';
import {SH03_N, paintB03SH03, sh03Cam} from '../../../../src/painted/edu32/b03-sh03';
import {SH04_N, paintB03SH04, pathCircleClearance} from '../../../../src/painted/edu32/b03-sh04';
import {B04_N, b04Cam, paintB04SH01} from '../../../../src/painted/edu32/b04-sh01';
import {bridgeCam} from '../../../../src/painted/edu32/bridge';
import {paintBridgePB} from '../../../../src/painted/edu32/bridge';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
type Span = {name: string; top: number; bottom: number; h: number};
const run = (label: string, n: number, paint: (L: number, id: string) => void, at: number[] = []) => {
  const all: Record<string, {L: number; s: Span}[]> = {};
  for (let L = 0; L < n; L++) {
    const id = `M-${label}-${L}`;
    paint(L, id);
    for (const s of MEASURE[id] ?? []) (all[s.name] ??= []).push({L, s});
  }
  for (const [name, list] of Object.entries(all)) {
    const hs = list.map((x) => x.s.h), mn = list[hs.indexOf(Math.min(...hs))], mx = list[hs.indexOf(Math.max(...hs))];
    const low = Math.max(...list.map((x) => x.s.bottom));
    console.log(`${label} ${name}: frames ${list.length}/${n}; h min ${mn.s.h} (L${mn.L}, y ${mn.s.top}-${mn.s.bottom}) max ${mx.s.h} (L${mx.L}, y ${mx.s.top}-${mx.s.bottom}); lowest y ${low}; top min ${Math.min(...list.map((x) => x.s.top))}`);
  }
  for (const L of at) console.log(`${label} L${L}:`, JSON.stringify(MEASURE[`M-${label}-${L}`]));
};
run('B03-SH02', SH02_N, (L, id) => paintB03SH02(noop(), L, id), [0, 42]);
run('B03-SH03', SH03_N, (L, id) => paintB03SH03(noop(), L, 'sun', id), [0, 86, 96]);
run('B03-SH04', SH04_N, (L) => paintB03SH04(noop(), L));
run('B04-SH01', B04_N, (L, id) => paintB04SH01(noop(), L, id), [0, 51]);
paintBridgePB(noop(), 71, 'M-BR-71');
console.log('B03-SH01 F71 (bridge exit):', JSON.stringify(MEASURE['M-BR-71']));
// sun patch front row (patch ellipse front edge z +0.7 + 0.3 * 1.18 outer glaze)
for (const [k, c] of [['B03-SH03 L0', sh03Cam(0)], ['B03-SH03 L96', sh03Cam(96)], ['B04-SH01 L0', b04Cam(0)], ['B04-SH01 L112', b04Cam(112)]] as const) {
  const front = camPoint(c, [SF.patch[0], 0, SF.patch[2] + 0.3 * 1.18]), centre = camPoint(c, SF.patch), core = camPoint(c, [SF.patch[0], 0, SF.patch[2] + 0.3]);
  console.log(`${k}: patch centre ${centre?.map(Math.round)}, front (k1.0) y ${Math.round(core![1])}, outer glaze front y ${Math.round(front![1])}`);
}
console.log('B03-SH04 paw path: closest approach to the red circle =', pathCircleClearance().toFixed(2), 'x ring radius (> 1 = clear)');
const len = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1]);
for (const side of ['l', 'r'] as const) {
  const A = SH02_ARMS[side];
  console.log(`AGENT ${side === 'l' ? 'LEFT' : 'RIGHT'} arm: upper ${(len([0, 0], A.via) / BONE).toFixed(3)} x BONE, fore ${(len(A.via, A.to) / BONE).toFixed(3)} x BONE`);
}
