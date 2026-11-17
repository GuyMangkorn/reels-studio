import type {V3} from '../../kit/space';
import {demoCam, lerpStrip, paintDemo, stripAt, stripAOver, YOLK_L, type DemoState} from '../demo';
import {lerp, ramp, seg, smooth} from '../motion22';
import {DEMO_PAPER, makeShot, type Shot22} from '../shot';
import {sine01} from '../stage';

// B04-SH15 · G 1026-1144 (118 f) · sulfur, not poison (EDU-EP22-SCENES-R1). The mitten lifts strip A's tip from (-0.02, 0.015, 0) to (-0.02, 0.04, 0)
// l 0-10. 16 tiny yellow specks (#e8c84a, deterministic) emerge on the yolk l 14-40 and drift up a little, then each flies a 12 f (0.4 s) arc to
// the strip and lands l 40-80 on its lower 55 %; a dark spot grows only under each landed speck (6 f) on top of SH14's 60 % tarnish; the clean
// upper strip stays bright. Nothing new from l 83.
const N = 118;
const LOW = stripAOver([-0.02, 0.015, 0]), HIGH = stripAOver([-0.02, 0.04, 0]);
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const SPECKS = Array.from({length: 16}, (_, i) => ({
  emerge: 14 + Math.round(26 * (i / 15)), land: 40 + Math.round(40 * ((i * 7) % 16) / 15),
  from: [YOLK_L[0] + (rnd(i, 1) - 0.5) * 0.022, YOLK_L[1] + 0.002, YOLK_L[2] + (rnd(i, 2) - 0.5) * 0.018] as V3,
  u: 0.04 + 0.5 * rnd(i, 3), s: (rnd(i, 4) - 0.5) * 1.6,
})).map((s) => ({...s, land: Math.max(s.land, s.emerge + 14)}));
export const def: Shot22 = {
  id: 'B04-SH15', N, paper: DEMO_PAPER,
  cam: (L) => { const u = sine01(L / (N - 1)); return demoCam([-0.03, 0.03, 0.01], lerp(4, 0, u), lerp(0.22, 0.2, u), -40, 1100, 960, 0.05); },
  paint: (p, L, c) => {
    const q = lerpStrip(LOW, HIGH, ramp(L, 0, 10));
    const specks: V3[] = [], spots: NonNullable<DemoState['spots']> = [];
    for (const s of SPECKS) {
      if (L < s.emerge) continue;
      const launch = s.land - 12;
      if (L >= s.land) { spots.push({u: s.u, s: s.s, k: smooth(seg(L, s.land, s.land + 6))}); continue; }
      const rise = Math.min(1, (L - s.emerge) / 10) * 0.004;
      const start: V3 = [s.from[0], s.from[1] + rise, s.from[2]];
      if (L < launch) { specks.push(start); continue; }
      const k = (L - launch) / 12, end = stripAt(q, s.u), e2: V3 = [end[0] + q.side[0] * 0.0075 * s.s * 0.7, end[1] + 0.001, end[2] + q.side[2] * 0.0075 * s.s * 0.7];
      specks.push([lerp(start[0], e2[0], k), lerp(start[1], e2[1], k) + Math.sin(Math.PI * k) * 0.012, lerp(start[2], e2[2], k)]);
    }
    paintDemo(p, c, {stripA: q, tarnish: 0.6, spots, specks});
  },
};
export const shot = makeShot(def);
