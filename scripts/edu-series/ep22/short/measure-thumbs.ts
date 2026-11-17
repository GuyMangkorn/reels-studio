// EDU-EP22 W3 thumbnail measures (Boss W3.1): runs each THUMBS painter with a no-op brush and prints the CHILD lead span the canvas paints with
// (cap top to the visible bottom: the child-table back edge or the figure bottom), as boss-asset-workflow's lead-size rule measures it.
//   node --import tsx scripts/edu-series/ep22/short/measure-thumbs.ts [TH-A TH-B ...]
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {MEASURE, THUMBS} from '../../../../src/painted/edu22/looks';

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(THUMBS);
for (const id of ids) THUMBS[id].paint(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0}));
console.log(JSON.stringify(Object.fromEntries(ids.map((id) => [id, MEASURE[id] ?? 'no child lead (demo or cast check)'])), null, 1));
