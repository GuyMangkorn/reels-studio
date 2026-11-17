import {demoCam, lerpStrip, paintDemo, stripAOver, stripAt} from '../demo';
import {lerp, ramp, smooth} from '../motion22';
import {DEMO_PAPER, makeShot, type Shot22} from '../shot';
import {sine01} from '../stage';
import {paintSulfur, repaintMitten, SH15_GRIP_U} from '../sulfur';

// B04-SH15 · G 1026-1144 (118 f) · sulfur, not poison (EDU-EP22-SCENES-R2). The mitten lifts strip A's tip from (-0.02, 0.015, 0) to (-0.02, 0.04, 0)
// l 0-10. R2 camera: a push l 0-40 (smoothstep; at (-0.03, 0.03, 0.01) -> (-0.002, 0.038, 0.012), yaw 4 -> 1, r 0.22 -> 0.125, hy 960 -> 860), then a
// hold l 40-118 (sine; yaw 1 -> 0, r 0.125 -> 0.115); pitch -40, f 1100, near 0.05 throughout (l 0 = R1 l 0). R2 motes (sulfur.ts, shot-local
// to SH15/SH16; demo.ts unchanged): 12 motes rise from the yolk l 14-40 and land l 40-73 on the still-bright part of the strip (u 0.64-0.87),
// each turning the silver black only under it; SH14's tarnish front stays 0.60. Nothing new from l 83. The mitten is repainted over the motes;
// R2 deviation (Boss): it pinches the strip's very end (sulfur.ts SH15_GRIP_U) so the bright part stays visible under the push.
const N = 118;
const LOW = stripAOver([-0.02, 0.015, 0]), HIGH = stripAOver([-0.02, 0.04, 0]);
const PUSH = 40;
export const def: Shot22 = {
  id: 'B04-SH15', N, paper: DEMO_PAPER,
  cam: (L) => {
    if (L < PUSH) {
      const k = smooth(L / PUSH), a0 = [-0.03, 0.03, 0.01], a1 = [-0.002, 0.038, 0.012];
      return demoCam([lerp(a0[0], a1[0], k), lerp(a0[1], a1[1], k), lerp(a0[2], a1[2], k)], lerp(4, 1, k), lerp(0.22, 0.125, k), -40, 1100, lerp(960, 860, k), 0.05);
    }
    const u = sine01((L - PUSH) / (N - 1 - PUSH));
    return demoCam([-0.002, 0.038, 0.012], lerp(1, 0, u), lerp(0.125, 0.115, u), -40, 1100, 860, 0.05);
  },
  paint: (p, L, c) => {
    const q = lerpStrip(LOW, HIGH, ramp(L, 0, 10));
    paintDemo(p, c, {stripA: q, tarnish: 0.6, hand: {at: stripAt(q, SH15_GRIP_U)}});
    paintSulfur(p, c, q, L);
    repaintMitten(p, c, q, undefined, SH15_GRIP_U);
  },
};
export const shot = makeShot(def);
