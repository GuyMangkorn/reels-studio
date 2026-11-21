// EDU-EP32 G5 plate measures (Boss W5.2, 2026-11-21): B04-SH02 door, visible sign span, latch-side dark gap and sign glyph height per frame
// (every 2nd frame plus the keys), the LF05 alternatives (ajar 40 vs the built start state), and B04-SH03 bowl span and kibble per key frame.
//   node --import tsx scripts/edu-series/ep32/short/measure-g5.ts
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {CAM_B04_SH02, corridorSpans, LF05_AJAR, SIGN} from '../../../../src/painted/edu32/corridor';
import {B04SH02_N, b04sh02Door, b04sh02Spans} from '../../../../src/painted/edu32/b04-sh02';
import {B04SH03_N, b04sh03Bowl, b04sh03Cam, b04sh03Kibble, paintB04SH03} from '../../../../src/painted/edu32/b04-sh03';
import {camPoint} from '../../../../src/painted/kit/ycam';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
// Thai glyph body (x-height) of the sign text: 0.078 m font, Noto Sans Thai x-height ~0.53 em -> 0.041 m on a 0.22 m card
const XH = (0.078 * 0.53) / SIGN.h;
const row = (L: number) => {
  const d = b04sh02Door(L), m = b04sh02Spans(L), s = m.sign;
  const sh = s ? s.y1 - s.y0 : 0;
  return `L${L} ajar ${(d.ajar * 57.2958).toFixed(1)} swing ${d.swing.toFixed(1)} lift ${(d.lift * 1000).toFixed(0)}mm | door y ${m.door.y0}-${m.door.y1} | sign ${s ? `x ${s.x0}-${s.x1} y ${s.y0}-${s.y1} w ${s.x1 - s.x0}` : 'hidden'}${m.signClipped ? ' CLIPPED' : ''} xh~${(sh * XH).toFixed(1)}px | gap ${m.gapPx}px`;
};
for (let L = 0; L < B04SH02_N; L += 2) console.log('B04-SH02', row(L));
console.log('B04-SH02', row(20), '| last', row(B04SH02_N - 1));
for (const deg of [40, 60, 70, 75, 80]) {
  const m = corridorSpans(CAM_B04_SH02, (deg * Math.PI) / 180);
  console.log(`LF05 alt ajar ${deg}: sign ${m.sign ? `w ${m.sign.x1 - m.sign.x0} y ${m.sign.y0}-${m.sign.y1}` : 'hidden'}${m.signClipped ? ' CLIPPED' : ''} gap ${m.gapPx}px${(deg * Math.PI) / 180 === LF05_AJAR ? ' (built)' : ''}`);
}
for (const L of [0, 6, 10, 14, 20, 22, 23, 28, 35, 45, 58]) {
  const r = paintB04SH03(noop(), L), k = b04sh03Kibble(L), c = b04sh03Cam(L);
  const sg = r.sign, door = camPoint(c, [0, 0, 0]);
  console.log(`B04-SH03 L${L} bowl x ${b04sh03Bowl(L)[0].toFixed(3)} ${r.bowl ? `y ${Math.round(r.bowl.top)}-${Math.round(r.bowl.bottom)} w ${Math.round(r.bowl.w)}` : 'off'} | kibble landed ${k.landed} falling ${k.falling.length} | sign y ${sg ? `${Math.round(sg.y0)}-${Math.round(sg.y1)}` : '-'} | door base y ${door ? Math.round(door[1]) : '-'}`);
}
console.log('frames', B04SH02_N, B04SH03_N);
