// EDU-EP17 shot measures (Boss W5): runs a shot plate's paint at shot-local frames with a no-op brush and prints MAN's projected anchors (lead height,
// head, chin, hands, hose end) as the yard shots computed them. Pinhole numbers from the shot code itself, not a pixel scan.
//   npx tsx scripts/edu-series/ep17/shot-measure.ts B01-SH05:0 B01-SH05:58 ...
import {makePainter} from '../../../src/painted/kit/painter';
import {paintedShots} from '../../../src/painted/registry';
import {LAST} from '../../../src/painted/edu17/yardshot';

const noop: unknown = new Proxy(function () {}, {get: (_t, k) => (k === Symbol.toPrimitive ? () => 0 : noop), apply: () => noop});
const r = (v: number | undefined) => (v === undefined ? '-' : Math.round(v));
for (const a of process.argv.slice(2)) {
  const [s, l] = a.split(':'), L = Number(l), shot = paintedShots[`EDU17-S01-${s}`];
  if (!shot) { console.log(a, 'no such plate'); continue; }
  LAST.man = undefined; LAST.end = undefined;
  shot.paint(makePainter(noop as never, {t: L / 30, frame: L}), {tl: L / 30, width: 1080, height: 1920});
  const m = LAST.man;
  if (!m) { console.log(`${s} f${L}: no MAN`); continue; }
  const top = Math.max(0, m.top), bottom = Math.min(1920, m.bottom);
  console.log(`${s} f${L}: lead ${r(bottom - top)} px (top ${r(m.top)}, bottom ${r(m.bottom)}), head (${r(m.head[0])}, ${r(m.head[1])}) headTop ${r(m.headTop)} chin ${r(m.chin)}, rHand (${r(m.rHand[0])}, ${r(m.rHand[1])}), lHand (${r(m.lHand[0])}, ${r(m.lHand[1])})${LAST.end ? `, hose end (${r(LAST.end[0])}, ${r(LAST.end[1])})` : ''}`);
}
