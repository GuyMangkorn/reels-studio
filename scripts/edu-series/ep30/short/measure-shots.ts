// EDU-EP30 plate lead probe (Boss T03, 2026-11-19): paints a shot (or `CAL`) at the given shot-local frames with a no-op brush and prints the
// lead spans the plate records: `SHOT L name top bottom h x` (px, no browser; a prop with a width adds `w`). Uses the stack camera (overscan
// compensated), so numbers equal the sheet projection.
//   node --import tsx scripts/edu-series/ep30/short/measure-shots.ts <SHOT-ID|CAL> <L,L,...>
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {edu30Shots} from '../../../../src/painted/shots/edu30';
import {CAL} from '../../../../src/painted/edu30/calibration';
import {SHOT_DEFS, stackCam, type Probe30} from '../../../../src/painted/edu30/shot';

void edu30Shots;
const [id, ls = '0'] = process.argv.slice(2);
const def = id === 'CAL' ? CAL : SHOT_DEFS[id];
if (!def) { console.error(`unknown shot ${id}`); process.exit(1); }
for (const L of ls.split(',').map(Number)) {
  const pr: Probe30 = {lead: (name, a) => {
    if (!a) return;
    const w = a.left !== undefined && a.right !== undefined ? ` w ${(a.right - a.left).toFixed(0)}` : '';
    console.log(id, L, name, Math.round(a.top), Math.round(a.bottom), Math.round(a.bottom - a.top), Math.round(a.x ?? 0) + w);
  }};
  def.paint(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: L / 30, frame: L}), L, stackCam(def, L), pr);
}
