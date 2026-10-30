import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {hash} from '../hash';
import {mixColor, type Pt} from '../painter';
import {ell} from '../zcpaint/ctx';
import {flatKit, type Flat} from '../zcpaint/sets';
import {GLOW_PEAK} from '../glow';
import {CaptionShade, Grade, Grain} from '../screen';
import {Subtitles} from '../../scenes/Subtitles';

// Film key-art spike for B08-SH01 (brief VB-ZCPAINT-SHORT-R2.4, `VD-ZC-08`, 30 Oct 2026). Not a production plate:
// Boss ports the accepted look into src/painted/zcpaint/balcony.ts. Over-the-shoulder: his head and shoulder as a dark
// silhouette in the lower-right corner with a warm fire rim on the fire-facing edge; the burning city fills the rest.
// Four fires at three distances (main blaze, second blaze, two far fires; R2.4.1). Canvas (p5.brush, flat washes + thin ink): sky, smoke pall, three flowing smoke columns lit from below, four depth
// layers of towers with warm bounce on fire-facing faces and flicker reflections, flames, railing, silhouette.
// SVG (Remotion, user 30 Oct 2026 "ผสม svg + remotion ได้"): the glow bloom (screen blend, <= GLOW_PEAK) and embers
// (small p5 circles render square). Every value is a pure function of the plate frame `pf`.

const W = 1080;
const YH = 880; // horizon at pf 0
const FIRE = ['#8e321a', '#d8642a', '#f39a40', '#fcd98a'] as const;
const RIM = '#e8913f';
/** Firelight bounce on walls: a deep ember, not the rim orange (orange over slate mixes to olive). */
const EMBER = '#7e3a1e';
const NIGHT = '#0c1014';
const SIL = '#06080a';
const MAIN: Pt = [360, 472]; // main blaze roof centre (tower x 250-470)
const SECOND: Pt = [756, 798]; // second blaze, low block roof

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
/** Push progress over the plate (pf 0-204), sine in-out. */
const push = (pf: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(pf / 204));
/** Main blaze flare-up: 0.35 until pf 84, full by pf 110 (the line “มีแต่ควันกับเปลวไฟ” lands at pf 96). */
export const flare = (pf: number) => 0.35 + 0.65 * smooth(84, 110, pf);
/** His slump on “ไม่มีใครมาช่วยแน่” (pf 127): the silhouette drops 16 px over 10 f. */
const slump = (pf: number) => 16 * smooth(127, 137, pf);

/** Layer transforms of the multiplane push: scale about a focus and a drop, per layer. */
export type Layer = {s: number; fx: number; fy: number; dy: number};
export const layers = (pf: number) => {
  const k = push(pf);
  const city = (s: number, dy: number): Layer => ({s: 1 + s * k, fx: 420, fy: 760, dy: dy * k});
  return {
    sky: city(0.006, 0),
    far: city(0.012, 2),
    mid: city(0.022, 6),
    blaze: city(0.03, 10),
    near: city(0.045, 18),
    fore: {s: 1 + 0.05 * k, fx: 960, fy: 1920, dy: 10 * k} as Layer,
  };
};
const inLayer = (ctx: PaintContext, L: Layer, draw: () => void) => {
  const {brush} = ctx;
  brush.push();
  brush.translate(L.fx, L.fy + L.dy);
  brush.scale(L.s);
  brush.translate(-L.fx, -L.fy);
  draw();
  brush.pop();
};
export const svgTransform = (L: Layer) => `translate(${L.fx} ${L.fy + L.dy}) scale(${L.s}) translate(${-L.fx} ${-L.fy})`;

const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/** A pointed flame: four nested tongues, flicker stepped every 2 f (seeded), sway by pf. */
const flame = (f: Flat, cx: number, base: number, h: number, w: number, pf: number, seed: number, lean = 0) => {
  const flick = 0.78 + 0.22 * hash(seed + Math.floor(pf / 2) * 13);
  const sway = Math.sin(pf * 0.4 + seed) * 0.12 * w + lean * w;
  ([[1, FIRE[0]], [0.76, FIRE[1]], [0.52, FIRE[2]], [0.3, FIRE[3]]] as const).forEach(([k, c]) => {
    const hh = h * k * flick, ww = w * k;
    f.fill(c, [[cx - ww, base], [cx - ww * 0.62 + sway * 0.3, base - hh * 0.4], [cx - ww * 0.18 + sway * 0.7, base - hh * 0.78], [cx + sway * k, base - hh], [cx + ww * 0.3 + sway * 0.6, base - hh * 0.62], [cx + ww * 0.7 + sway * 0.2, base - hh * 0.34], [cx + ww, base]]);
  });
};
/** A row of tongues along a span (roof or window head), heights seeded per tongue. */
const flameRow = (f: Flat, x0: number, x1: number, base: number, h: number, pf: number, seed: number, n: number, lean = 0) => {
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n, hk = 0.55 + 0.45 * hash(seed + i * 7);
    flame(f, x0 + (x1 - x0) * u, base, h * hk, ((x1 - x0) / n) * 0.75, pf, seed + i * 3, lean);
  }
};

/** Smoke colour along a column: hot orange at the fire, brown, then night slate at the top. */
const SMOKE: [number, string][] = [[0, '#cc642c'], [0.12, '#7c3a22'], [0.3, '#4a2a22'], [0.55, '#2a2124'], [0.8, '#191b20'], [1, '#121519']];
const smokeAt = (s: number) => {
  for (let i = 1; i < SMOKE.length; i++) {
    const [b, cb] = SMOKE[i], [a, ca] = SMOKE[i - 1];
    if (s <= b) return mixColor(ca, cb, (s - a) / (b - a));
  }
  return SMOKE[SMOKE.length - 1][1];
};
type Column = {x: number; y: number; h: number; w0: number; w1: number; bend: number; ph: number; heat: number; haze: number};
/**
 * A flowing smoke column: a ribbon whose centreline bends with the wind, with a wobble that travels up the column over
 * time (the flow). Each segment is split along its length: the underside (+n, facing down to the fire) warmer, the
 * upper side darker. Two lighter flow lines run inside. Flat washes only, so the bands step like a cel shade.
 */
const column = (f: Flat, c: Column, pf: number) => {
  const N = 26;
  const P = (s: number): Pt => {
    const wob = Math.sin(s * 7.5 - pf * 0.07 + c.ph) * 22 * s + Math.sin(s * 3.1 - pf * 0.035 + c.ph * 2) * 30 * s;
    return [c.x + c.bend * Math.pow(s, 1.7) + wob, c.y - c.h * s];
  };
  const Wd = (s: number) => (c.w0 + (c.w1 - c.w0) * Math.pow(s, 0.75)) * (1 + 0.14 * Math.sin(s * 9 - pf * 0.09 + c.ph));
  const N_ = (s: number): Pt => {
    const a = P(Math.max(0, s - 0.02)), b = P(Math.min(1, s + 0.02));
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
    return [-ty / l, tx / l];
  };
  const edge = (s: number, side: number, k = 1): Pt => {
    const p = P(s), n = N_(s), w = Wd(s) * k;
    return [p[0] + n[0] * w * side, p[1] + n[1] * w * side];
  };
  for (let i = N - 1; i >= 0; i--) {
    const s0 = i / N, s1 = Math.min(1, (i + 1.25) / N), sm = (s0 + s1) / 2;
    const base = mixColor(smokeAt(sm * (1.15 - 0.15 * c.heat) + (1 - c.heat) * 0.12), '#1a1c21', c.haze);
    const lit = mixColor(base, FIRE[1], (0.12 + 0.3 * (1 - sm)) * c.heat * (1 - 0.5 * sm));
    const shade = mixColor(base, '#0a0e14', 0.3);
    f.fill(shade, [P(s0), edge(s0, -1), edge(s1, -1), P(s1)]);
    f.fill(lit, [P(s0), edge(s0, 1), edge(s1, 1), P(s1)]);
  }
  // Flow lines: thin, a step lighter than the smoke, following the travelling wobble.
  for (const [off, a, b] of [[0.45, 0.06, 0.7], [-0.35, 0.18, 0.88], [0.05, 0.32, 0.95]] as const) {
    const pts: Pt[] = [];
    for (let j = 0; j <= 14; j++) pts.push(edge(a + (b - a) * (j / 14), Math.sign(off) || 1, Math.abs(off) || 0.05));
    f.line(pts, 0.7, mixColor(smokeAt((a + b) / 2), '#c98a5a', 0.22 * c.heat + 0.06), false);
  }
};

/** A tower seen nearly head-on in one-point (VP x 540): front face, the receding side face toward the VP, windows. */
type Tower = {x0: number; x1: number; top: number; base: number; body: string; seed: number; win?: number; depth?: number};
const fireLight = (x: number, y: number, pf: number) => {
  const d = Math.hypot(x - MAIN[0], (y - MAIN[1] - 220) * 0.8);
  return clamp01(1 - d / 560) * (0.55 + 0.45 * flare(pf));
};
const tower = (f: Flat, t: Tower, pf: number, ink = true) => {
  const {x0, x1, top, base, body, seed} = t;
  const sideW = Math.min(46, Math.abs((x0 + x1) / 2 - 540) * 0.09) * (t.depth ?? 1);
  const right = (x0 + x1) / 2 < 540; // left of the VP: the right side face shows
  const sx = right ? x1 : x0, sx2 = right ? x1 + sideW : x0 - sideW;
  // Side face: faces the main blaze when the tower and the fire are on opposite sides of it.
  const facesFire = right ? sx < MAIN[0] : sx > MAIN[0];
  const sideCol = (y: number) => {
    const b = facesFire ? fireLight(sx, Math.floor(y / 110) * 110 + 55, pf) : 0;
    return mixColor(mixColor(body, NIGHT, 0.3), EMBER, Math.min(1, 0.9 * b * b + 0.25 * b));
  };
  // Stepped vertically: the bounce is strongest at the fire's height and falls into cool shadow below.
  if (sideW > 1.5) {
    const n = Math.max(1, Math.ceil((Math.min(base, 1920) - top) / 110));
    for (let i = 0; i < n; i++) {
      const ya = top + i * 110, yb = Math.min(base, ya + 112);
      f.fill(sideCol((ya + yb) / 2), [[sx, ya], [sx2, i === 0 ? top + sideW * 0.35 : ya], [sx2, yb], [sx, yb]]);
    }
    // Side-face glass: foreshortened slits that mirror the fire, flickering (the only warm "windows" in the city).
    if (facesFire && sideW > 12) {
      for (let wy = top + 20; wy < Math.min(base, 1900); wy += t.win ?? 30) {
        const lb = fireLight(sx, wy, pf);
        for (let c = 0; c < 2; c++) {
          const u0 = 0.18 + c * 0.42, wa = sx + (sx2 - sx) * u0, wb = sx + (sx2 - sx) * (u0 + 0.24);
          const on = hash(seed * 17 + wy * 0.13 + c * 5 + Math.floor(pf / 3) * 0.71) < 0.25 + 0.6 * lb;
          const g = on ? mixColor('#2a1610', FIRE[2], 0.2 + 0.6 * lb * (0.6 + 0.4 * hash(seed + wy + c + Math.floor(pf / 2)))) : mixColor(sideCol(wy), '#000000', 0.4);
          f.fill(g, [[Math.min(wa, wb), wy], [Math.max(wa, wb), wy], [Math.max(wa, wb), wy + (t.win ?? 30) * 0.45], [Math.min(wa, wb), wy + (t.win ?? 30) * 0.45]]);
        }
      }
    }
  }
  f.fill(body, rect(x0, top, x1, base));
  // Fire-facing edge of the front face and the roof lip catch a thin warm line.
  const fb = fireLight(right ? x1 : x0, top, pf);
  if (fb > 0.05) {
    const ex = x1 < MAIN[0] ? x1 - 5 : x0;
    if (Math.abs((x0 + x1) / 2 - MAIN[0]) > 60) f.fill(mixColor(body, EMBER, 0.8 * fb), rect(ex, top, ex + 5, base));
    f.fill(mixColor(body, RIM, 0.55 * fb), rect(x0, top, x1, top + 3));
  }
  // Windows: dark glass; on fire-facing faces some reflect the flicker (no window is lit from inside: the city is dark).
  const cols = Math.max(2, Math.round((x1 - x0) / 26)), cw = (x1 - x0 - 12) / cols;
  const rows = Math.floor((base - top - 14) / (t.win ?? 30));
  for (let r = 0; r < rows; r++) {
    const wy = top + 12 + r * (t.win ?? 30);
    if (wy > 1920) break;
    for (let c = 0; c < cols; c++) {
      const wx = x0 + 8 + c * cw;
      const lb = fireLight(wx, wy, pf);
      // Front faces look at us, not at the fire: only glass close to the blaze catches it, and only now and then.
      const refl = lb > 0.3 && hash(seed * 31 + r * 7 + c * 3 + Math.floor(pf / 3) * 0.37) < 0.5 * (lb - 0.3);
      const glass = refl ? mixColor('#3a2216', FIRE[2], 0.25 + 0.45 * lb * hash(seed + r + c * 5 + Math.floor(pf / 3))) : mixColor(body, '#000000', 0.35);
      f.fill(glass, rect(wx, wy, wx + cw * 0.55, wy + (t.win ?? 30) * 0.42));
    }
  }
  if (ink) f.line(rect(x0, top, x1, base), 0.6, '#05070a');
};

/** Sky, warm underlit pall, moon (L0). */
const paintSky = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 20000);
  for (let i = 0; i < 20; i++) {
    const u = i / 19;
    const c = u < 0.6 ? mixColor('#0b0f13', '#1a1f26', u / 0.6) : mixColor('#1a1f26', '#33262a', (u - 0.6) / 0.4);
    f.fill(c, rect(-150, -150 + i * 55, W + 150, -90 + i * 55));
  }
  // The smoke ceiling glows warm over the fires: stepped rings, widest and faintest first.
  const g = 0.75 + 0.25 * flare(pf);
  for (let k = 0; k < 7; k++) {
    const u = k / 6;
    f.fill(mixColor('#2a2226', '#6a3524', (0.2 + 0.8 * u) * g * 0.85), ell(MAIN[0] + 40, 700 - 40 * u, 640 - 420 * u, 360 - 220 * u, 28));
  }
  // Moon, cool and small, upper left; a thin cool halo.
  f.fill('#161c22', ell(170, 232, 58, 58, 28));
  f.fill('#c7cfcc', ell(170, 232, 26, 26, 28));
  // Smoke pall across the top, drifting with the wind (to the right); a warm underside lip.
  const edge = (yb: number, amp: number, sp: number) => {
    const pts: Pt[] = [[-150, -150], [W + 150, -150]];
    for (let x = W + 150; x >= -150; x -= 40) pts.push([x, yb + amp * Math.sin(x / 150 - pf * sp) + 24 * Math.sin(x / 61 + 1.3 - pf * sp * 1.7)]);
    return pts;
  };
  f.fill('#2b2023', edge(150, 22, 0.02));
  f.fill('#15181c', edge(126, 26, 0.024));
};

/** Far skyline (L1): low blocks with atmospheric fade, two tiny distant fires with thin columns. */
const paintFar = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 21000);
  column(f, {x: 96, y: 862, h: 760, w0: 10, w1: 120, bend: 300, ph: 2.1, heat: 0.55, haze: 0.45}, pf);
  column(f, {x: 1004, y: 872, h: 700, w0: 8, w1: 70, bend: 140, ph: 4.4, heat: 0.45, haze: 0.5}, pf);
  let x = -40, i = 0;
  while (x < W + 40) {
    const w = 38 + 54 * hash(500 + i), top = YH - 18 - 70 * hash(600 + i);
    const warm = clamp01(1 - Math.abs(x - MAIN[0]) / 700);
    f.fill(mixColor('#22272e', '#3b2b2a', 0.6 * warm), rect(x, top, x + w + 2, YH + 40));
    x += w; i++;
  }
  flame(f, 96, 866, 22, 9, pf, 71);
  flame(f, 1004, 874, 16, 7, pf, 73);
  f.fill('#11151a', rect(-150, YH + 30, W + 150, 2100)); // the city floor below the far line
};

/** Mid city (L2): towers with bounce and reflections, the second blaze on a low block with its column. */
const paintMid = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 22000);
  column(f, {x: SECOND[0], y: SECOND[1], h: 900, w0: 40, w1: 210, bend: 330, ph: 0.7, heat: 1, haze: 0}, pf);
  const towers: Tower[] = [
    {x0: 150, x1: 236, top: 690, base: 1100, body: '#1b2027', seed: 1},
    {x0: 492, x1: 586, top: 618, base: 1100, body: '#1a1f26', seed: 2},
    {x0: 606, x1: 690, top: 712, base: 1100, body: '#1c2128', seed: 3},
    {x0: 830, x1: 936, top: 596, base: 1100, body: '#181d24', seed: 4},
    {x0: 950, x1: 1040, top: 676, base: 1100, body: '#1a1f26', seed: 5},
  ];
  for (const t of towers) tower(f, t, pf);
  // Second blaze: a low block whose roof burns, flames above y 860 (RK-06).
  tower(f, {x0: 690, x1: 826, top: SECOND[1], base: 1100, body: '#1d1b1f', seed: 6, win: 28}, pf);
  f.fill(mixColor('#1d1b1f', FIRE[0], 0.7), rect(690, SECOND[1], 826, SECOND[1] + 8));
  flameRow(f, 694, 822, SECOND[1] + 4, 96, pf, 300, 5, 0.15);
};

/** Main blaze (L2.5): a mid-near tower burning on its upper floors and roof; the flare-up is `flare(pf)`. */
const paintBlaze = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 23000);
  const F = flare(pf);
  column(f, {x: MAIN[0], y: MAIN[1] + 6, h: 620, w0: 64 + 20 * F, w1: 300, bend: 430, ph: 0, heat: 0.7 + 0.3 * F, haze: 0}, pf);
  const x0 = 250, x1 = 470, top = MAIN[1];
  // Side face toward the VP (right), lit by its own fire from within: warm.
  f.fill('#3a2018', [[x1, top], [x1 + 30, top + 10], [x1 + 30, 1400], [x1, 1400]]);
  f.fill('#171a20', rect(x0, top, x1, 1400));
  // Burning floors (band openings with dark mullions) catch top-down as the fire flares; flames lick up the facade.
  // floor index, span start/end (0..1 of the width), the flare level at which it is fully alight.
  const floors: [number, number, number, number][] = [[0, 0, 1, 0], [1, 0.15, 1, 0.45], [2, 0, 0.7, 0.2], [4, 0.3, 1, 0.7], [5, 0, 0.55, 0.85], [7, 0.4, 0.9, 0.95]];
  const FH = 44;
  for (let r = 0; r < 20; r++) {
    const wy = top + 18 + r * FH;
    f.fill('#0c0e12', rect(x0 + 8, wy, x1 - 8, wy + 20)); // dark glazing band
  }
  for (const [r, a, b, need] of floors) {
    const on = clamp01((F - need + 0.25) / 0.25);
    if (on <= 0) continue;
    const wy = top + 18 + r * FH, xa = x0 + 8 + (x1 - x0 - 16) * a, xb = xa + (x0 + 8 + (x1 - x0 - 16) * b - xa) * on;
    f.fill(mixColor('#171a20', FIRE[0], 0.55), rect(xa - 4, wy - 10, xb + 4, wy + 26)); // scorched, lit facade
    f.fill(mixColor('#171a20', '#000000', 0.5), rect(xa + 6, wy - FH + 22, xb - 6, wy - 10)); // soot above the opening
    f.fill(FIRE[2], rect(xa, wy, xb, wy + 20));
    f.fill(FIRE[3], rect(xa + 4, wy + 5, xb - 4, wy + 17));
    for (let m = xa + 24; m < xb - 8; m += 34) f.fill('#2a1410', rect(m, wy, m + 4, wy + 20)); // mullions
    const n = Math.max(1, Math.round((xb - xa) / 34));
    flameRow(f, xa, xb, wy + 6, (34 + 22 * on) * (0.7 + 0.4 * F), pf, 1200 + r * 17, n, 0.18);
  }
  flameRow(f, x0 - 6, x1 + 18, top + 6, 70 + 120 * F, pf, 400, 7, 0.12);
  f.line(rect(x0, top, x1, 1400), 0.6, '#05070a');
};

/** Near layer (L3): framing towers and the low-rise roofs under the caption (no fire in the near layer). */
const paintNear = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 24000);
  // Left framing tower: its right side face takes the strongest bounce in frame.
  tower(f, {x0: -60, x1: 196, top: 318, base: 2000, body: '#11151a', seed: 11, win: 40, depth: 1.7}, pf);
  tower(f, {x0: 900, x1: 1140, top: 400, base: 2000, body: '#10141a', seed: 12, win: 40, depth: 1.4}, pf);
  // Low-rise roofs, stepping down toward us (dark; warm lips on the fire side).
  const roofs: [number, number, number][] = [[180, 470, 1150], [440, 700, 1210], [660, 920, 1130], [150, 420, 1330], [700, 980, 1360]];
  roofs.forEach(([a, b, y], i) => tower(f, {x0: a, x1: b, top: y, base: 2000, body: mixColor('#0d1014', '#141820', i % 2 ? 0 : 1), seed: 20 + i, win: 34}, pf));
  // The street below: a dark, unlit gap (user Q-ZCP-9 B, 30 Oct 2026: no near street fire).
  f.fill('#0f0d10', [[300, 1470], [800, 1440], [800, 1580], [300, 1580]]);
  tower(f, {x0: 340, x1: 620, top: 1560, base: 2000, body: '#0b0e12', seed: 30}, pf);
};

/** Foreground (L4): the railing, then his head and shoulder as a silhouette with a fire rim on the fire-facing edge. */
const paintFore = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 25000);
  // Railing: a metal top rail with a warm highlight (stronger on the fire side) and balusters with a warm fire-side edge.
  for (let i = 0; i < 18; i++) {
    const x = -20 + i * 66, k = clamp01(1 - x / 1100);
    f.fill('#07090c', rect(x, 1736, x + 10, 2000));
    f.fill(mixColor('#07090c', RIM, 0.25 + 0.35 * k), rect(x, 1736, x + 2, 2000));
  }
  f.fill('#07090c', rect(-150, 1716, W + 150, 1738));
  f.fill(mixColor('#07090c', RIM, 0.75), rect(-150, 1713, 560, 1718));
  f.fill(mixColor('#07090c', RIM, 0.4), rect(560, 1713, W + 150, 1718));
  // His rim is motivated by the main blaze glow (upper left). His head and shoulders: one flat dark mass (a silhouette has no inner marks), the same shape offset up-left in the
  // rim colour first, so the rim shows only on the fire-facing edge. Head = the WORLD FOG egg (4-head figure) from behind.
  const dy = slump(pf);
  const sil = (ox: number, oy: number): Pt[][] => {
    const hx = 884 + ox, hy = 1556 + dy + oy;
    const head: Pt[] = [];
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      const rx = 172, ry = a > 0 && a < Math.PI ? 176 : 196; // egg: fuller crown, the jaw line tucked
      // Short hair from behind: a few low irregular tufts on the crown edge (no tall spikes: they read as ears).
      const tuft = a > Math.PI * 1.1 && a < Math.PI * 1.9 ? 1 + 0.02 * Math.max(0, Math.sin(a * 11 + 0.6)) : 1;
      head.push([hx + Math.cos(a) * rx * tuft, hy + Math.sin(a) * ry * tuft]);
    }
    const ear = (sgn: number): Pt[] => ell(hx + sgn * 168, hy + 34, 22, 42, 14);
    const body: Pt[] = [[hx - 62, hy + 140], [hx + 62, hy + 140], [hx + 70, hy + 236], [hx + 170, hy + 262], [hx + 300, hy + 300], [hx + 360, hy + 420], [hx - 400, hy + 420], [hx - 330, hy + 318], [hx - 210, hy + 262], [hx - 72, hy + 236]];
    return [body, ear(-1), ear(1), head];
  };
  for (const pts of sil(-7, -6)) f.fill(RIM, pts);
  for (const pts of sil(0, 0)) f.fill(SIL, pts);
};

export const paintB08Key = (ctx: PaintContext, pf: number) => {
  const L = layers(pf);
  inLayer(ctx, L.sky, () => paintSky(ctx, pf));
  inLayer(ctx, L.far, () => paintFar(ctx, pf));
  inLayer(ctx, L.mid, () => paintMid(ctx, pf));
  inLayer(ctx, L.blaze, () => paintBlaze(ctx, pf));
  inLayer(ctx, L.near, () => paintNear(ctx, pf));
  inLayer(ctx, L.fore, () => paintFore(ctx, pf));
};

/** SVG glow bloom (screen) over the fires, each in its own layer transform, flicker stepped per 2 f; <= GLOW_PEAK. */
const Bloom = ({pf}: {pf: number}) => {
  const L = layers(pf);
  const fl = (s: number) => 0.86 + 0.14 * hash(s + Math.floor(pf / 2) * 17);
  const spots: [Layer, number, number, number, number, number][] = [
    [L.blaze, MAIN[0] + 10, MAIN[1] + 90, 300, GLOW_PEAK * (0.55 + 0.45 * flare(pf)) * fl(1), 1],
    [L.mid, SECOND[0], SECOND[1] - 20, 170, GLOW_PEAK * 0.75 * fl(2), 2],
  ];
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        <defs>
          {spots.map(([, , , , o, id]) => (
            <radialGradient key={id} id={`b08g${id}`}>
              <stop offset="0" stopColor="#ffb060" stopOpacity={o} />
              <stop offset="0.45" stopColor="#ff7a30" stopOpacity={o * 0.45} />
              <stop offset="1" stopColor="#ff6020" stopOpacity={0} />
            </radialGradient>
          ))}
        </defs>
        {spots.map(([l, x, y, r, , id]) => (
          <g key={id} transform={svgTransform(l)}>
            <ellipse cx={x} cy={y} rx={r} ry={r * 0.9} fill={`url(#b08g${id})`} />
          </g>
        ))}
        <Embers pf={pf} L={L.blaze} />
      </svg>
    </AbsoluteFill>
  );
};

/** Embers rising from the main blaze and drifting right with the wind; a pure function of pf. */
const Embers = ({pf, L}: {pf: number; L: Layer}) => (
  <g transform={svgTransform(L)}>
    {Array.from({length: 22}, (_, i) => {
      const period = 70 + 60 * hash(i * 3 + 1);
      const u = (((pf / period) + hash(i * 3 + 2)) % 1 + 1) % 1;
      const x = MAIN[0] - 90 + 200 * hash(i * 5) + 260 * u * u + 18 * Math.sin(pf * 0.11 + i);
      const y = MAIN[1] - 20 - 380 * u;
      const o = Math.min(1, u * 6) * (1 - u) * (0.6 + 0.4 * hash(i + Math.floor(pf / 3)));
      return <circle key={i} cx={x} cy={y} r={1.6 + 1.6 * hash(i * 7)} fill="#ffc070" opacity={o} />;
    })}
  </g>
);

/** Key-art composition: painted plate, SVG bloom + embers, Grade, Grain; optional mock caption and shade. */
export const ZcB08Key = ({caption, shade}: {caption?: string; shade?: boolean}) => {
  const frame = useCurrentFrame();
  const pf = frame;
  return (
    <AbsoluteFill style={{backgroundColor: NIGHT}}>
      <BrushCanvas paint={(ctx) => paintB08Key(ctx, pf)} paper={NIGHT} />
      <Bloom pf={pf} />
      <Grade />
      <Grain />
      {shade && <CaptionShade tl={frame / 30} cues={[[0, 7]]} mode="band" strength={0.4} />}
      {caption && (
        <AbsoluteFill style={{transform: 'translateY(-538px)'}}>
          <Subtitles text={caption} style={{preset: 'outline', position: 'bottom'}} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
export const ZcB08KeyPlain = () => <ZcB08Key />;
export const ZcB08KeyCap = () => <ZcB08Key caption="มีแต่ควันกับเปลวไฟ" />;
/** Determinism probe: the painted canvas alone (no SVG, Grade or Grain). */
export const ZcB08KeyBare = () => {
  const pf = useCurrentFrame();
  return <BrushCanvas paint={(ctx) => paintB08Key(ctx, pf)} paper={NIGHT} />;
};
