import type {Brush} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {MEASURE, paintLF01, paintLF02, paintLF03, paintLF04, paintLF05} from './scenes';

// EDU-EP14 W3 measure: runs each look frame's paint function through a stub brush and prints the anchors it recorded (lead height, feet, lip, cloud base, storey pitch...).
// Usage: npx tsx src/painted/edu14/measure.ts
const brush = new Proxy({}, {get: () => () => {}}) as Brush;
const p = makePainter(brush, {t: 0.4, frame: 12});
for (const [id, paint] of Object.entries({LF01: paintLF01, LF02: paintLF02, LF03: paintLF03, LF04: paintLF04, LF05: paintLF05})) {
  paint(p);
  const m = MEASURE[id];
  console.log(JSON.stringify({id, lead: m?.lead ? {top: Math.round(m.lead.top), bottom: Math.round(m.lead.bottom), height: Math.round(m.lead.bottom - m.lead.top)} : undefined, ...m?.extra}));
}
