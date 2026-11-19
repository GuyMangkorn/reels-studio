// EDU-EP26-SHORT draft fix round B (Boss, 2026-11-19): painted arm lengths per frame from the R5 arm probe (`ARM_LOG`, r4-looks.ts): each
// drawn arm's upper arm and forearm in metres at the figure's depth against the rig bone, `reach` = shoulder-hand / two bones, status
// ok / fixed / REACH. Prints one line per frame and arm plus the worst values per shot.
// Run: npx tsx scripts/edu-series/ep26/short/measure-arms.ts SHOT-ID:FROM-TO[:STEP] ...
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import '../../../../src/painted/shots/edu26';
import {SHOT_DEFS} from '../../../../src/painted/edu26/shot';
import {ARM_LOG, armTag} from '../../../../src/painted/edu26/r4-looks';

for (const a of process.argv.slice(2)) {
  const [id, range, step] = a.split(':'), [f0, f1] = range.split('-').map(Number), def = SHOT_DEFS[id];
  if (!def) { console.log(JSON.stringify({id, error: 'unknown shot'})); continue; }
  const start = ARM_LOG.length;
  for (let L = f0; L <= f1; L += Number(step ?? 2)) {
    armTag.still = `${id}:L${L}`;
    def.paint(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: L / 30, frame: L}), L, def.cam(L));
  }
  armTag.still = '';
  const rows = ARM_LOG.slice(start);
  rows.forEach((r) => console.log(JSON.stringify(r)));
  const max = (k: 'upper' | 'fore' | 'reach') => Math.max(...rows.map((r) => r[k]));
  console.log(JSON.stringify({id, frames: `${f0}-${f1}`, arms: rows.length, maxUpperOverBone: +(max('upper') / (rows[0]?.bone ?? 1)).toFixed(3),
    maxForeOverBone: +(max('fore') / (rows[0]?.bone ?? 1)).toFixed(3), maxReach: max('reach'), notOk: rows.filter((r) => r.status !== 'ok').length}));
}
