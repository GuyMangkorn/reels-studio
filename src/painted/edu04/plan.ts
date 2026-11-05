import {ell, hardFill, inkLine, INK, solid, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {LANE, type LaneNo} from './cast';

// `new: plan-diagram` (brief EDU-BRIEF-R1.1 VD09, space PLAN): orthographic top-down of CHECKOUT on cream paper at a uniform
// 130 px/m: screen x = 540 + 130 x, screen y = 300 - 130 z (till line z 0 -> y 300; S5 z -4.0 -> y 820). Lane x positions are locked
// to the store lanes (-2.2 / 0 / +2.2 -> 254 / 540 / 826 px). Dots: S1-S4 per lane, 4 dots each, MAN's navy with a white ring.
// Static highlights only (no race, no advancing dots). Look-defining asset written for W3; Boss hardens it at W5.2.

export const PLAN_PX = 130;
export const planX = (x: number) => 540 + PLAN_PX * x;
export const planY = (z: number) => 300 - PLAN_PX * z;
export const PAPER_PLAN = '#f3ead6';
const hsh = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// Outfit colours of the cast in the order of the store slots (kit PEOPLE shirt/jacket, so the dots match LF01).
export const DOTS: Record<LaneNo, string[]> = {
  1: ['#6b7a5a', '#7a8f6a', '#d8d2c4', '#8a6a46'],
  2: ['#6aa0b8', '#c9863f', '#34414f', '#8a8f9a'],
  3: ['#d8d0e0', '#b4552e', '#8a7a9a', '#c0a070'],
};
export const MAN_DOT = '#1f3a5f';

export type PlanState = {
  /** Lanes drawn at full strength; the others stay visible but dimmed (L08: [2]; L09: [1, 3]; L07: all). */
  lit: LaneNo[];
  /** The lane with MAN's dot. */
  manLane?: LaneNo;
  t?: number;
};

const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

export const paintPlan = (p: Painter, o: PlanState) => {
  hardFill(p, 100, PAPER_PLAN, rect(-20, -20, 1100, 1940));
  // paper grain: fibres and a faint grid of survey ticks
  for (let i = 0; i < 90; i++) {
    const x = hsh(i) * 1080, y = hsh(i + 200) * 1920;
    inkLine(p, 110 + i, [[x, y], [x + 18 + hsh(i + 50) * 26, y + (hsh(i + 90) - 0.5) * 8]], {closed: false, weight: 0.35, color: '#d9ccae'});
  }
  for (let z = 0; z >= -4.5; z -= 1) inkLine(p, 220 + z * 3, [[40, planY(z)], [60, planY(z)]], {closed: false, weight: 0.5, color: '#c9bb98'});
  const lanes: LaneNo[] = [1, 2, 3];
  const top = planY(0.55), bot = planY(-4.35);
  lanes.forEach((n) => {
    const x = planX((n - 2) * 2.2), on = o.lit.includes(n), w = 0.9 * PLAN_PX;
    const lane = rect(x - w / 2, top, x + w / 2, bot);
    washAt(p, 300 + n * 10, LANE[n], on ? 120 : 42, lane, 0.2, 0.5);
    if (on) washAt(p, 301 + n * 10, mixColor(LANE[n], '#fff4c8', 0.45), 60, rect(x - w / 2 + 6, top + 6, x + w / 2 - 6, bot - 6), 0.3, 0.5);
    inkLine(p, 302 + n * 10, lane, {weight: on ? 1.7 : 1.0, color: mixColor(LANE[n], INK, on ? 0.55 : 0.4)});
    // mint counter bar, 78 px wide (0.6 m), lane x +0.55..+1.15, z -2.4..+0.3
    const cx0 = planX((n - 2) * 2.2 + 0.55), cx1 = cx0 + 0.6 * PLAN_PX, c = rect(cx0, planY(0.3), cx1, planY(-2.4));
    solid(p, 340 + n * 10, '#8fd3b4', c, 3, 0.05, 0.1);
    inkLine(p, 341 + n * 10, c, {weight: 1.1, color: '#4c8a72'});
    // belt strip and the till icon (register square + lamp in the lane colour) at the top of the counter
    solid(p, 342 + n * 10, '#3a3f47', rect(cx0 + 12, planY(-0.6), cx1 - 12, planY(-2.35)), 2, 0.04, 0.1);
    solid(p, 343 + n * 10, '#cfd5d9', rect(cx0 + 8, planY(0.25), cx1 - 8, planY(-0.2)), 2, 0.04, 0.1);
    inkLine(p, 344 + n * 10, rect(cx0 + 8, planY(0.25), cx1 - 8, planY(-0.2)), {weight: 0.9, color: INK});
    const lx = (cx0 + cx1) / 2, ly = planY(0.62);
    hardFill(p, 345 + n * 10, LANE[n], ell(lx, ly, 17, 17, 16));
    inkLine(p, 346 + n * 10, ell(lx, ly, 17, 17, 16), {weight: 1.2, color: INK});
    // dots: S1-S4 (z -0.4 .. -3.1), diameter 0.5 m = 65 px
    for (let s = 0; s < 4; s++) {
      const dx = x, dy = planY(-0.4 - 0.9 * s), man = n === o.manLane && s === 2, col = man ? MAN_DOT : DOTS[n][s];
      const dim = on || man ? 1 : 0.78;
      washAt(p, 400 + n * 40 + s * 4, '#8a7c5c', 70, ell(dx + 4, dy + 6, 32, 32, 14), 0.2, 0.4);
      hardFill(p, 401 + n * 40 + s * 4, dim < 1 ? mixColor(col, PAPER_PLAN, 0.18) : col, ell(dx, dy, 32.5, 32.5, 18));
      inkLine(p, 402 + n * 40 + s * 4, ell(dx, dy, 32.5, 32.5, 18), {weight: 1.2, color: INK});
      if (man) inkLine(p, 403 + n * 40 + s * 4, ell(dx, dy, 41, 41, 20), {weight: 2.6, color: '#ffffff'});
    }
  });
};
