import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';
import {paintDam, DAM_CAMS} from '../dam';
import {paintEmu, paintFlock, paintQueueFar, paintQueueWade, queue} from '../flock';
import {SUN} from '../paddock';
import type {YCam} from '../../kit/ycam';

// B04-SH02 (Boss T26, 2026-11-20): the queue along the shore. Space D (T10 dam, `DAM_CAMS.queue` eye), yaw 75 -> 77 ease-in-out over L 0-68. T16 `queue(L, 'B04-SH02')`: stands to L 40, one unison step
// L 41-49, walks on; EMU-HERO at the head, `paintQueueFar` beyond 40 m, `paintQueueWade` on the water legs. Queue contact shadows `shadowOp` 45 (TF37). Crew and G1 are behind the lens (not painted).
// Water ripple dashes and the windmill ride the ambient clock (L / 30 s).
const N = 69;
const ease = (u: number) => u * u * (3 - 2 * u);
const BASE = camLine({eye: [1.5, 1.1, -4.25], yaw: 75, pitch: 0, f: 900, hy: 820});
const CAM = (L: number): YCam => ({...BASE, ...DAM_CAMS.queue, yaw: ((75 + 2 * ease(Math.max(0, Math.min(1, L / 68)))) * Math.PI) / 180});

export const def: Shot30 = {
  id: 'B04-SH02', N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    const sun = SUN.morning, ms = queue(L, 'B04-SH02');
    paintDam(p, c, 38000, {ambient: L / 30});
    paintQueueFar(p, c);
    paintFlock(p, c, ms, {sun, shadowOp: 45});
    paintQueueWade(p, c, L, 'B04-SH02');
    if (pr) { const a = paintEmu(null, c, ms[0], {sun}); pr.lead('EMU-HERO', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2}); }
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
