// EDU-EP24 W3 look-frame measures (Film, 2026-11-17): runs each LOOK_DEFS painter with a no-op brush and prints the lead spans the canvas
// paints with (bidders: crown to the projected hip, seat + 0.05 m; host: crown to the table top) and the board text quad boxes (px).
//   node --import tsx scripts/edu-series/ep24/short/measure-looks.ts [LF01 ...]
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {boardTextBoxes} from '../../../../src/painted/edu24/board-text';
import {LOOK_DEFS, MEASURE} from '../../../../src/painted/edu24/looks';

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LOOK_DEFS);
const out: Record<string, unknown> = {};
for (const id of ids) {
  const d = LOOK_DEFS[id]();
  d.paint(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: d.t, frame: 0}));
  out[id] = {...MEASURE[id], board: d.board ? boardTextBoxes(d.cam) : 'none'};
}
console.log(JSON.stringify(out));
