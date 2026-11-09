import type {Brush} from '../BrushCanvas';
import {makePainter} from '../kit/painter';
import {camPoint} from '../kit/ycam';
import {camAt} from './cams';
import {afterAt, BELL, GRIP, planAt, paintWoman} from './story';
import {fallY, shotAt} from './clock';

// EDU-EP11 W5.2 measure: head top against the ceiling (2.30 m) and lead heights. Usage: npx tsx src/painted/edu11/measure-w52.ts [G ...]
const brush = new Proxy({}, {get: () => () => {}}) as Brush;
const gs = process.argv.slice(2).map(Number);
for (const g of gs.length ? gs : [800]) {
  const id = shotAt(g), cam = camAt(id, g)!, pl = g >= 1340 ? afterAt(g) : planAt(Math.min(g, 893)), shaft = ['S01-B01-SH02', 'S01-B02-SH01', 'S01-B02-SH02', 'S01-B03-SH04'].includes(id);
  const a = paintWoman(makePainter(brush, {t: g / 30, frame: g}), cam, pl, {t: g / 30, shadow: false, reach: (pl as {reach?: number}).reach, seat: (pl as {seat?: number}).seat, origin: [0, shaft ? fallY(g) : 0, 0]});
  const cx = a ? a.head[0] : 540;
  const ceil = camPoint(cam, [pl.feet[0], 2.3, pl.feet[2]]);
  console.log(JSON.stringify({g, id, headTop: a?.headTop, top: a?.top, bottom: a?.bottom, lead: a ? Math.round(a.bottom - a.top) : null, ceilY: ceil ? Math.round(ceil[1]) : null, lift: pl.lift, rHand: a ? a.rHand.map(Math.round) : null, rSh: a ? a.rShoulder.map(Math.round) : null, bell: camPoint(cam, BELL)?.map(Math.round), grip: camPoint(cam, GRIP)?.map(Math.round)}));
}
