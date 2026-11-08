// EDU-EP08-SHORT W5.3 R2: helmet-to-hair margin of S01-B01-SH02 (Editor, 2026-11-08). Runs the shot's real paint function with a no-op brush; the helmet prop anchors
// come from paintHelmetProp's own projection (camPoint/camUnit), the hair top from the figure anchors (MEAS.ast.headTop). Usage: npx tsx scripts/edu-series/ep08/qa-helmet-margin.ts
import {makePainter} from '../../../src/painted/kit/painter';
import {paintedShots} from '../../../src/painted/registry';
import {MEAS} from '../../../src/painted/edu08/suit';
import {camMove} from '../../../src/painted/kit/cam-moves';
import {camAt} from '../../../src/painted/edu08/stage';
import {camPoint, camUnit} from '../../../src/painted/kit/ycam';
import {helmetSH02, startOf} from '../../../src/painted/edu08/clock';

const noop: unknown = new Proxy(function () {}, {get: (_t, k) => (k === 'then' ? undefined : noop), apply: () => noop});
const brush = new Proxy({}, {get: () => noop}) as never;
const N = 46, cam = (L: number) => camAt(camMove([0, 1.76, 0.6], [25, 30], [1.9, 1.8], 1.16, {pitch: [12, 16], f: 1050, hy: 1000}), L, N);
const shot = paintedShots['EDU8-S01-B01-SH02'];
console.log('| L | G | helmet cy | R px | glass bottom y (cy+1.02R) | collar-ring bottom y | hair top y | margin glass | margin ring |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (let L = 34; L <= 46; L++) {
  MEAS.ast = undefined;
  shot.paint(makePainter(brush, {t: L / 30, frame: L, fade: shot.paper}), {tl: L / 30, width: 1080, height: 1920});
  const c = cam(L), h = helmetSH02(L), g = camPoint(c, h), u = camUnit(c, h);
  if (!g || !MEAS.ast) continue;
  const R = 0.29 * u, glass = g[1] + 1.02 * R, pitch = Math.abs(c.pitch ?? 0), ringRy = R * 0.74 * Math.min(0.5, 0.2 + pitch * 0.9), ring = g[1] + 0.82 * R + ringRy, top = MEAS.ast.headTop;
  console.log(`| ${L} | ${startOf('S01-B01-SH02') + L} | ${g[1].toFixed(0)} | ${R.toFixed(0)} | ${glass.toFixed(0)} | ${ring.toFixed(0)} | ${top.toFixed(0)} | ${(top - glass).toFixed(0)} | ${(top - ring).toFixed(0)} |`);
}
