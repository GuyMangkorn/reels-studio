import type {V3} from '../../kit/space';
import {demoCam, gripOf, lerpStrip, paintDemo, STRIP_A_RIM, STRIP_B_CUP, stripAOver, type StripPose} from '../demo';
import {lerp, lerp3, ramp, track} from '../motion22';
import {DEMO_PAPER, makeShot, type Shot22} from '../shot';
import {sine01} from '../stage';

// B04-SH16 · G 1144-1220 (76 f) · silver stays bright (EDU-EP22-SCENES-R1). Truck right to the cup (hy 1040). The mitten lays strip A on the dish
// rim (tarnished end on the rim) l 0-6, moves to strip B l 6-10, lifts it 2.5 cm l 10-11 and dips it back into the cup by l 12 (G 1156), then
// holds it upright, bright throughout. The CHILD (front-left 30 deg card behind the top's far edge, scaled, skullcap) leans in l 20-40
// `suspicious`, -> `surprised` l 46-52, hold; face anchor about (0.14, 0.15-0.30, -0.21).
const N = 76;
const HELD = stripAOver([-0.02, 0.04, 0]);
const up = (q: StripPose, h: number): StripPose => ({tip: [q.tip[0], q.tip[1] + h, q.tip[2]], top: [q.top[0], q.top[1] + h, q.top[2]], side: q.side});
const CH0: V3 = [0.15, -0.21, -0.27], CH1: V3 = [0.14, -0.21, -0.22];
export const def: Shot22 = {
  id: 'B04-SH16', N, paper: DEMO_PAPER,
  cam: (L) => { const u = sine01(L / (N - 1)); return demoCam([0.12, 0.03, -0.04], lerp(0, -4, u), lerp(0.36, 0.32, u), -30, 1100, 1040, 0.05); },
  paint: (p, L, c) => {
    const lean = ramp(L, 20, 40);
    const child = {at: lerp3(CH0, CH1, lean), scale: 0.55, face: L < 46 ? 'suspicious' as const : 'surprised' as const, look: [0.25, 0.55] as [number, number], t: L / 30};
    const b = L < 10 ? STRIP_B_CUP : L < 11 ? up(STRIP_B_CUP, 0.025 * (L - 10)) : lerpStrip(up(STRIP_B_CUP, 0.025), STRIP_B_CUP, ramp(L, 11, 12));
    if (L < 6) {
      paintDemo(p, c, {stripA: lerpStrip(HELD, STRIP_A_RIM, ramp(L, 0, 6)), tarnish: 0.6, child});
      return;
    }
    const hand = L < 10 ? {at: track(L, [[6, gripOf(STRIP_A_RIM)], [10, gripOf(STRIP_B_CUP)]]), dir: 0.5} : {on: "B" as const, dir: 0.45};
    paintDemo(p, c, {stripA: 'rim', tarnish: 0.6, stripB: b, hand, child});
  },
};
export const shot = makeShot(def);
