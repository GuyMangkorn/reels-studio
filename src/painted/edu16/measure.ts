import type {Brush} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {LF_IDS, MEASURE, paintCR1, paintCR2, paintCR3, paintCR4, paintLF01, paintLF02, paintLF03, paintLF04A, paintLF04B, paintLF05, paintMK1, paintMK2, paintMK3, paintMK4} from './scenes';

// EDU-EP16 W3 measure: runs each look still's paint function through a stub brush and prints the anchors it recorded (lead height, mask size,
// crow length / head / ring px, mob distances). Usage: npx tsx src/painted/edu16/measure.ts
const brush = new Proxy({}, {get: () => () => {}}) as Brush;
const p = makePainter(brush, {t: 0.4, frame: 12});
const PAINT = {LF01: paintLF01, LF02: paintLF02, LF03: paintLF03, LF04A: paintLF04A, LF04B: paintLF04B, LF05: paintLF05, CR1: paintCR1, CR2: paintCR2, CR3: paintCR3, CR4: paintCR4, MK1: paintMK1, MK2: paintMK2, MK3: paintMK3, MK4: paintMK4};
for (const id of LF_IDS) {
  PAINT[id](p);
  const m = MEASURE[id] ?? MEASURE[`MK-${id === 'MK1' ? 'A1' : id === 'MK2' ? 'A2' : id === 'MK3' ? 'A3' : 'x'}`];
  console.log(JSON.stringify({id, lead: m?.lead ? {top: m.lead.top, bottom: m.lead.bottom, height: m.lead.bottom - m.lead.top} : undefined, ...m?.extra}));
}
