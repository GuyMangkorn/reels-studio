// EDU-EP26-SHORT W5.2 plate measures (Boss, 2026-11-18): runs each shot's painter headless (no-op brush) at its key frames (shots/index.ts `keys`,
// or the frames given) and prints the probed lead spans per figure (`<who>Px` visible px, `Top`, `HeadX/Y`, `Chin`, hands packed x*10000+y) and
// the coin-shot points (`noseX/Y`, `coinX/Y`, `coinPx`), one JSON line per frame.
// Run: npx tsx scripts/edu-series/ep26/short/measure-shots.ts [SHOT-ID[:L,L...] ...]
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import '../../../../src/painted/shots/edu26';
import {SHOT_DEFS} from '../../../../src/painted/edu26/shot';
import {EDU26_SHOTS} from '../../../../src/painted/edu26/shots/index';
import type {Probe26} from '../../../../src/painted/edu26/stage26';

const args = process.argv.slice(2);
const want = args.length ? args.map((a) => a.split(':')) : EDU26_SHOTS.map((r) => [r.id]);
for (const [id, frames] of want) {
  const row = EDU26_SHOTS.find((r) => r.id === id), def = SHOT_DEFS[id];
  if (!row || !def) { console.log(JSON.stringify({id, error: 'unknown shot'})); continue; }
  for (const L of frames ? frames.split(',').map(Number) : row.keys) {
    const pr: Probe26 = {};
    def.paint(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: L / 30, frame: L}), L, def.cam(L), pr);
    console.log(JSON.stringify({id, L, G: row.start + L, ...pr}));
  }
}
