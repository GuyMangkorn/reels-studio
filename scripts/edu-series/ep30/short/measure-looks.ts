// EDU-EP30 W3 look-frame measures (Film, 2026-11-19): runs each LOOK_DEFS painter with a no-op brush and prints the lead spans (px, top,
// bottom, height, x) of the cast and emus the canvas paints (figure anchors top/bottom; emu silhouette extremes from the beast painter).
//   node --import tsx scripts/edu-series/ep30/short/measure-looks.ts [LF01a ...]
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {LOOK_DEFS, MEASURE} from '../../../../src/painted/edu30/looks';

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LOOK_DEFS);
for (const id of ids) {
  const d = LOOK_DEFS[id]();
  d.paint(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: d.t, frame: 0}));
  console.log(id, JSON.stringify(MEASURE[id] ?? []));
}
