// EDU-EP32 W3 look-frame measures (Boss, 2026-11-21): runs each LOOK_DEFS painter with a no-op brush and prints the lead spans (px: top, bottom,
// height) of the cast cards, with each card's fold-tab picture height and its shadow reach below the foot line and sideways offset.
//   node --import tsx scripts/edu-series/ep32/short/measure-looks.ts [LF02 ...]
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {LOOK_DEFS as BASE, MEASURE} from '../../../../src/painted/edu32/looks';
import {BRIDGE_LOOKS} from '../../../../src/painted/edu32/bridge';
import {OFFICE_LOOKS} from '../../../../src/painted/edu32/office';
import {CORRIDOR_LOOKS, CORRIDOR_MEASURE} from '../../../../src/painted/edu32/corridor';

const LOOK_DEFS = {...BASE, ...BRIDGE_LOOKS, ...OFFICE_LOOKS, ...CORRIDOR_LOOKS};

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LOOK_DEFS);
for (const id of ids) {
  const d = LOOK_DEFS[id]();
  d.paint(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: d.t, frame: 0}));
  console.log(id, JSON.stringify(MEASURE[id] ?? CORRIDOR_MEASURE[id] ?? []));
}
