// EDU-EP08-SHORT W5.3 measurement (Editor, 2026-11-08): runs every shot's paint function with a no-op brush (no picture) and reads the figure anchors
// recorded by `MEAS` (src/painted/edu08/suit.ts), so head heights and figure bounds are the numbers of the shot as authored, at the frames given.
// Usage: npx tsx scripts/edu-series/ep08/qa-measure.ts > out/qa/ep08/measure.txt
import {makePainter} from '../../../src/painted/kit/painter';
import {paintedShots} from '../../../src/painted/registry';
import {MEAS} from '../../../src/painted/edu08/suit';
import {SHOT_RANGES} from '../../../src/painted/edu08/clock';

const noop: unknown = new Proxy(function () {}, {get: (_t, k) => (k === 'then' ? undefined : noop), apply: () => noop});
const brush = new Proxy({}, {get: () => noop}) as never;
const rows: string[] = ['| Shot | L | G | head px | fig px | head top y | chin y | other |', '| --- | --- | --- | --- | --- | --- | --- | --- |'];
for (const [id, a, b] of SHOT_RANGES) {
  const shot = paintedShots[`EDU8-${id}`];
  const n = b - a;
  for (const L of [0, Math.round(n / 2), n - 1]) {
    MEAS.ast = MEAS.crew = MEAS.tech = undefined;
    const p = makePainter(brush, {t: L / 30, frame: L, fade: shot.paper});
    try { shot.paint(p, {tl: L / 30, width: 1080, height: 1920}); } catch (e) { rows.push(`| ${id} | ${L} | ${a + L} | ERR ${(e as Error).message.slice(0, 60)} | | | | |`); continue; }
    const who = [['ast', MEAS.ast], ['crew', MEAS.crew], ['tech', MEAS.tech]] as const;
    for (const [name, m] of who) {
      if (!m) continue;
      const head = m.chin - m.headTop, h = m.feet[1] - m.headTop;
      rows.push(`| ${id} | ${L} | ${a + L} | ${head.toFixed(0)} (${name}) | ${h.toFixed(0)} | ${m.headTop.toFixed(0)} | ${m.chin.toFixed(0)} | feet y ${m.feet[1].toFixed(0)} x ${m.feet[0].toFixed(0)}, bubble r ${m.bubble.r.toFixed(0)} |`);
    }
  }
}
console.log(rows.join('\n'));
