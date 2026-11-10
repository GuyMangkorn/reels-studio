import type {Brush} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {LF_IDS, MEASURE, paintLF01, paintLF02, paintLF03, paintLF04, paintLF05A, paintLF05B, paintTK1, paintTK2, paintTK4, paintTK5, paintTK6, paintTK7, paintTK8} from './scenes';

// EDU-EP15 W3 measure: runs each look still's paint function through a stub brush and prints the anchors it recorded (lead height, face, tokay
// length and feet, contact line, floor gap ...). Usage: npx tsx src/painted/edu15/measure.ts
const brush = new Proxy({}, {get: () => () => {}}) as Brush;
const p = makePainter(brush, {t: 0.4, frame: 12});
const PAINT = {LF01: paintLF01, LF02: paintLF02, LF03: paintLF03, LF04: paintLF04, LF05A: paintLF05A, LF05B: paintLF05B, TK1: paintTK1, TK2: paintTK2, TK4: paintTK4, TK5: paintTK5, TK6: paintTK6, TK7: paintTK7, TK8: paintTK8};
for (const id of LF_IDS) {
  PAINT[id](p);
  const m = MEASURE[id];
  console.log(JSON.stringify({id, lead: m?.lead ? {top: Math.round(m.lead.top), bottom: Math.round(m.lead.bottom), height: Math.round(m.lead.bottom - m.lead.top)} : undefined, ...m?.extra}));
}
