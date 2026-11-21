// EDU-EP31 plate lead probe (Boss W5.2 batch 1, 2026-11-21): paints a shot at the given shot-local frames with a no-op brush and prints the spans
// the plate records: `SHOT f name top bottom h x [w]` (px, no browser). ARM-* rows carry the reach ratio (|shoulder->hand| / 2 BONE) in `top`.
//   node --import tsx scripts/edu-series/ep31/short/measure-shots.ts <SHOT-ID> <f,f,...>
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {edu31Shots} from '../../../../src/painted/shots/edu31';
import {SHOT_DEFS, type Probe31} from '../../../../src/painted/edu31/shot';

void edu31Shots;
const [id, ls = '0'] = process.argv.slice(2);
const def = SHOT_DEFS[id];
if (!def) { console.error(`unknown shot ${id}`); process.exit(1); }
for (const L of ls.split(',').map(Number)) {
  const pr: Probe31 = {lead: (name, a) => {
    if (!a) return;
    if (name.startsWith('ARM')) { console.log(id, L, name, 'ratio', a.top.toFixed(3)); return; }
    const w = a.left !== undefined && a.right !== undefined ? ` w ${(a.right - a.left).toFixed(0)}` : '';
    console.log(id, L, name, Math.round(a.top), Math.round(a.bottom), Math.round(a.bottom - a.top), Math.round(a.x ?? 0) + w);
  }};
  def.paint(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: L / 30, frame: L}), L, def.cam(L), pr);
}
