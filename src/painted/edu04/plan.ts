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
  /** Lane the glow is drawn in the glow colour for (W5.2: `#f2c230` on the lit lane in L08-L10); default = lane colours. */
  glow?: boolean;
  /** 2D picture push (W5.2, sheet "scale about (540, 560)") and drift in px. */
  scale?: number;
  dx?: number;
  /** Dot ink-in 0..1 per lane (S01-B03-SH02: lanes ink in 6 f each, lane 1, 2, 3); default 1. */
  inkIn?: [number, number, number];
  /** MAN's dot at this plan-px centre (unscaled, the hop arc) instead of its slot; the slot dot of `manSlot` stays hidden. */
  man?: [number, number];
  /** The plain dot at lane 2 S3 (fades in as MAN leaves) and at lane 3 S3 (fades out under his landing), 0..1; default: lane 2 S3 is MAN's. */
  plain2?: number;
  plain3?: number;
  /** `new: paper wobble` (L10a): lane-edge jitter amplitude in px (0 = still) at phase `wobblePhase` (radians). */
  wobble?: number;
  wobblePhase?: number;
  /** `new: plan icons`: price-check sign on the till-1 icon and the big trolley on lane 2 S2, pop progress 0..1 (overshoot to 1.1 at 0.6). */
  sign?: number;
  trolley?: number;
};

const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const pop = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u < 0.6 ? 1.1 * Math.sin((u / 0.6) * (Math.PI / 2)) : 1.1 - 0.1 * ((u - 0.6) / 0.4));
/** Picture position of a plan-px point under the push. */
export const planPush = (o: Pick<PlanState, 'scale' | 'dx'>, [x, y]: Pt): Pt => [540 + (x - 540) * (o.scale ?? 1) + (o.dx ?? 0), 560 + (y - 560) * (o.scale ?? 1)];

export const paintPlan = (p: Painter, o: PlanState) => {
  const k = o.scale ?? 1, S = (pt: Pt): Pt => planPush(o, pt), SM = (pts: Pt[]) => pts.map(S);
  hardFill(p, 100, PAPER_PLAN, rect(-20, -20, 1100, 1940));
  // paper grain: fibres and a faint grid of survey ticks
  for (let i = 0; i < 90; i++) {
    const x = hsh(i) * 1080, y = hsh(i + 200) * 1920;
    inkLine(p, 110 + i, SM([[x, y], [x + 18 + hsh(i + 50) * 26, y + (hsh(i + 90) - 0.5) * 8]]), {closed: false, weight: 0.35, color: '#d9ccae'});
  }
  for (let z = 0; z >= -4.5; z -= 1) inkLine(p, 220 + z * 3, SM([[40, planY(z)], [60, planY(z)]]), {closed: false, weight: 0.5, color: '#c9bb98'});
  const wob = (n: number, c: number) => (o.wobble ? o.wobble * Math.sin((o.wobblePhase ?? 0) + n * 1.7 + c * 2.3) : 0);
  const lanes: LaneNo[] = [1, 2, 3];
  const top = planY(0.55), bot = planY(-4.35);
  lanes.forEach((n) => {
    const x = planX((n - 2) * 2.2), on = o.lit.includes(n), w = 0.9 * PLAN_PX;
    const lane = rect(x - w / 2, top, x + w / 2, bot).map(([px, py], c): Pt => [px + wob(n, c), py + wob(n, c + 5)]);
    const glowCol = o.glow && on ? '#f2c230' : LANE[n];
    washAt(p, 300 + n * 10, glowCol, on ? 120 : 42, SM(lane), 0.2, 0.5);
    if (on) washAt(p, 301 + n * 10, mixColor(glowCol, '#fff4c8', 0.45), 60, SM(rect(x - w / 2 + 6, top + 6, x + w / 2 - 6, bot - 6)), 0.3, 0.5);
    inkLine(p, 302 + n * 10, SM(lane), {weight: on ? 1.7 : 1.0, color: mixColor(LANE[n], INK, on ? 0.55 : 0.4)});
    // mint counter bar, 78 px wide (0.6 m), lane x +0.55..+1.15, z -2.4..+0.3
    const cx0 = planX((n - 2) * 2.2 + 0.55), cx1 = cx0 + 0.6 * PLAN_PX, c = rect(cx0, planY(0.3), cx1, planY(-2.4));
    solid(p, 340 + n * 10, '#8fd3b4', SM(c), 3, 0.05, 0.1);
    inkLine(p, 341 + n * 10, SM(c), {weight: 1.1, color: '#4c8a72'});
    // belt strip and the till icon (register square + lamp in the lane colour) at the top of the counter
    solid(p, 342 + n * 10, '#3a3f47', SM(rect(cx0 + 12, planY(-0.6), cx1 - 12, planY(-2.35))), 2, 0.04, 0.1);
    solid(p, 343 + n * 10, '#cfd5d9', SM(rect(cx0 + 8, planY(0.25), cx1 - 8, planY(-0.2))), 2, 0.04, 0.1);
    inkLine(p, 344 + n * 10, SM(rect(cx0 + 8, planY(0.25), cx1 - 8, planY(-0.2))), {weight: 0.9, color: INK});
    const lx = (cx0 + cx1) / 2, ly = planY(0.62), lc = S([lx, ly]);
    hardFill(p, 345 + n * 10, LANE[n], ell(lc[0], lc[1], 17 * k, 17 * k, 16));
    inkLine(p, 346 + n * 10, ell(lc[0], lc[1], 17 * k, 17 * k, 16), {weight: 1.2, color: INK});
    // dots: S1-S4 (z -0.4 .. -3.1), diameter 0.5 m = 65 px
    const q = o.inkIn?.[n - 1] ?? 1;
    for (let s = 0; s < 4; s++) {
      const man = n === o.manLane && s === 2 && !o.man, col = man ? MAN_DOT : DOTS[n][s];
      let a = q;
      if (n === 2 && s === 2 && o.man !== undefined) a *= o.plain2 ?? 0;
      if (n === 3 && s === 2 && o.plain3 !== undefined) a *= o.plain3;
      if (n === 2 && s === 1 && (o.trolley ?? 0) > 0) a = 0;
      if (a <= 0) continue;
      const g = S([x, planY(-0.4 - 0.9 * s)]), dim = on || man ? 1 : 0.78, d = a < 1 ? p.layer(a, 5000 + n * 100 + s * 10) : p;
      washAt(d, 400 + n * 40 + s * 4, '#8a7c5c', 70, ell(g[0] + 4 * k, g[1] + 6 * k, 32 * k, 32 * k, 14), 0.2, 0.4);
      hardFill(d, 401 + n * 40 + s * 4, dim < 1 ? mixColor(col, PAPER_PLAN, 0.18) : col, ell(g[0], g[1], 32.5 * k, 32.5 * k, 18));
      inkLine(d, 402 + n * 40 + s * 4, ell(g[0], g[1], 32.5 * k, 32.5 * k, 18), {weight: 1.2, color: INK});
      if (man) inkLine(d, 403 + n * 40 + s * 4, ell(g[0], g[1], 41 * k, 41 * k, 20), {weight: 2.6, color: '#ffffff'});
    }
  });
  if (o.man) {
    const g = S(o.man), x = g[0], y = g[1];
    washAt(p, 600, '#8a7c5c', 70, ell(x + 4 * k, y + 6 * k, 32 * k, 32 * k, 14), 0.2, 0.4);
    hardFill(p, 601, MAN_DOT, ell(x, y, 32.5 * k, 32.5 * k, 18));
    inkLine(p, 602, ell(x, y, 32.5 * k, 32.5 * k, 18), {weight: 1.2, color: INK});
    inkLine(p, 603, ell(x, y, 41 * k, 41 * k, 20), {weight: 2.6, color: '#ffffff'});
  }
  // `new: plan icons` (L10a): the trolley replaces lane 2 S2; the CL01 price-check sign sits on the till-1 icon
  const tr = pop(o.trolley ?? 0);
  if (tr > 0) {
    const c = S([planX(0), planY(-1.3)]), w = 0.9 * PLAN_PX * 0.5 * tr * k, h = 0.6 * PLAN_PX * 0.5 * tr * k, body = rect(c[0] - w, c[1] - h, c[0] + w, c[1] + h);
    solid(p, 700, '#6aa0b8', body, 3, 0.05, 0.1);
    inkLine(p, 701, body, {weight: 1.6, color: INK});
    for (let i = 1; i < 5; i++) inkLine(p, 702 + i, [[c[0] - w + (2 * w * i) / 5, c[1] - h], [c[0] - w + (2 * w * i) / 5, c[1] + h]], {closed: false, weight: 0.7, color: '#34414f'});
    inkLine(p, 710, [[c[0] - w, c[1] + h + 10 * k * tr], [c[0] + w, c[1] + h + 10 * k * tr]], {closed: false, weight: 6, color: INK}); // handle bar, 10 px under the body
    // goods in the grid: warm, yellow, green, warm (14-22 px)
    ([[-0.55, -0.3, 20, '#e48a3a'], [-0.1, 0.25, 16, '#f2c230'], [0.35, -0.2, 22, '#4f9a5c'], [0.62, 0.3, 14, '#d9473a']] as const).forEach(([gx, gy, d, col], i) => {
      const gc: Pt = [c[0] + gx * w, c[1] + gy * h];
      hardFill(p, 712 + i * 2, col, ell(gc[0], gc[1], (d / 2) * k * tr, (d / 2) * k * tr, 10));
      inkLine(p, 713 + i * 2, ell(gc[0], gc[1], (d / 2) * k * tr, (d / 2) * k * tr, 10), {weight: 0.9, color: INK});
    });
  }
  const sg = pop(o.sign ?? 0);
  if (sg > 0) {
    // CL01 price-check sign on the till-1 icon (R1.1): pad centre (364, 186), 80 x 64 px, stick 4 px from (364, 218) to the register top (364, 267)
    const c = S([364, 186]), rx = 40 * sg * k, ry = 32 * sg * k, pad = ell(c[0], c[1], rx, ry, 18), s0 = S([364, 218]), s1 = S([364, 267]);
    inkLine(p, 720, [s0, s1], {closed: false, weight: 4, color: INK});
    solid(p, 721, '#d6402f', pad, 3, 0.05, 0.1);
    inkLine(p, 722, pad, {weight: 2.4, color: INK});
    inkLine(p, 723, [[c[0] - rx * 0.5, c[1] - ry * 0.25], [c[0] + rx * 0.5, c[1] - ry * 0.25]], {closed: false, weight: 3, color: '#fff4e8'});
    inkLine(p, 724, [[c[0] - rx * 0.5, c[1] + ry * 0.25], [c[0] + rx * 0.5, c[1] + ry * 0.25]], {closed: false, weight: 3, color: '#fff4e8'});
  }
};
