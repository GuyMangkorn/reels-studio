import {hardFill, inkLine} from '../../painted/kit/draw';
import {hash} from '../../painted/kit/hash';
import type {Item} from '../../painted/kit/world';
import {cardAt, cell, cps, lit, type Light, type Painter, type Pt, type V3} from '../../painted/survival/core';

// EDU-EP17 episode-only stand-ins (Editor): the woodpile W1 (needs a Boss asset: shared prop with shrink states and a tarp state, see the report) and the
// no-bars phone. Both are painted from world metres through the survival module's card helpers; nothing here is shared art.

export type PileOpts = {w?: number; h?: number; level?: number; dry?: boolean; tarp?: number; leaves?: boolean; seed?: number; L?: Light};
/** The woodpile W1 at `at` (the foot of its front face): split logs seen end-on, `level` 0..1 how much is left, `tarp` 0..1 how far a blue tarp is pulled over it. */
export const paintWoodpile = (p: Painter, at: V3, c: Parameters<typeof cardAt>[0], o: PileOpts = {}) => {
  const k = cardAt(c, at);
  if (!k) return;
  const w = o.w ?? 1.2, h = (o.h ?? 1.3) * Math.max(0.12, o.level ?? 1), L = o.L ?? {amb: '#d6e2c8', k: 0.1}, seed = o.seed ?? 70000, r = 0.062;
  const ww = w * (0.55 + 0.45 * Math.min(1, o.level ?? 1));
  hardFill(p, seed, lit(L, '#2e2218'), cps(k, [[-ww / 2 - 0.02, 0], [ww / 2 + 0.02, 0], [ww / 2 + 0.02, h + 0.05], [-ww / 2 - 0.02, h + 0.05]]));
  const rows = Math.max(1, Math.floor(h / (r * 1.8)));
  const dry = ['#9a8c7a', '#8a7c6a', '#a89a86', '#7e7060'], wet = ['#b8946a', '#a8845a', '#c0a074', '#9a7a52'];
  let n = 1;
  for (let j = 0; j < rows; j++) {
    const per = Math.max(2, Math.floor(ww / (r * 2)) - (j % 2));
    for (let i = 0; i < per; i++) {
      const cx = -ww / 2 + r + (i + (j % 2 ? 0.5 : 0)) * ((ww - 2 * r) / Math.max(1, per - (j % 2 ? 0 : 1))), cy = r + j * r * 1.78;
      const s = seed + 10 + n++ * 3, col = (o.dry ? dry : wet)[Math.floor(hash(s) * 4)];
      const ring = cell(k, cx, cy, r * (0.92 + 0.12 * hash(s + 1)), r * 0.92, 10);
      hardFill(p, s, lit(L, col), ring);
      hardFill(p, s + 1, lit(L, o.dry ? '#5a4c3e' : '#7a5a3a'), cell(k, cx, cy, r * 0.42, r * 0.4, 8));
      if (o.dry && hash(s + 2) > 0.4) inkLine(p, s + 2, cps(k, [[cx - r * 0.1, cy], [cx + r * (0.5 + 0.3 * hash(s + 3)), cy + r * (hash(s + 4) - 0.5)]]), {closed: false, weight: 0.35, color: lit(L, '#3a2e22'), still: true});
      inkLine(p, s + 2, ring, {weight: 0.4, color: lit(L, '#3a2a1c'), still: true});
    }
  }
  const tarp = Math.min(1, Math.max(0, o.tarp ?? 0));
  if (tarp > 0) {
    const top = h + 0.12, edge = w / 2 + 0.12, t = tarp, s = seed + 4000;
    // the tarp is pulled from the left: its right edge sweeps across the pile
    const xr = -edge + 2 * edge * t;
    const poly: [number, number][] = [[-edge, 0], [xr + 0.05, 0], [xr, top * 0.55], [xr - 0.1, top * 0.9], [xr - 0.4, top], [-edge * 0.8, top * 0.96], [-edge, top * 0.7]];
    hardFill(p, s, lit(L, '#3f6fa8'), cps(k, poly));
    hardFill(p, s + 1, lit(L, '#2f5a8c'), cps(k, [[xr - 0.3, 0], [xr + 0.05, 0], [xr, top * 0.55], [xr - 0.22, top * 0.85], [xr - 0.3, top * 0.5]]));
    for (let i = 0; i < 4; i++) inkLine(p, s + 2 + i, cps(k, [[-edge + (i + 0.5) * (xr + edge) / 4, top * (0.2 + 0.1 * i)], [-edge + (i + 0.6) * (xr + edge) / 4, top * (0.95 - 0.04 * i)]]), {closed: false, weight: 0.45, color: lit(L, '#1f3a5a'), still: true});
    inkLine(p, s + 8, cps(k, poly), {weight: 0.7, color: lit(L, '#1f3050'), still: true});
    if (o.leaves && t > 0.8) hardFill(p, s + 9, lit(L, '#5a8a3a'), cps(k, [[-edge * 0.3, top * 0.96], [edge * 0.6, top * 0.9], [edge * 0.9, top * 0.55], [edge * 0.2, top * 0.7]]));
  }
};
export const woodpileItem = (at: V3, o: PileOpts = {}): Item => ({at, bias: 0, draw: (p, c) => paintWoodpile(p, at, c, o)});

/** Phone held at `hand` with its screen showing no signal: a dark body, a lit screen, four crossed-out bars (no words), a low red battery. `sway` rotates it about the hand (radians). */
export const paintPhoneNoBars = (p: Painter, hand: Pt, u: number, o: {sway?: number; seed?: number; dim?: number} = {}) => {
  const seed = o.seed ?? 71000, a = o.sway ?? 0, ca = Math.cos(a), sa = Math.sin(a);
  const pt = (x: number, y: number): Pt => [hand[0] + (x * ca - y * sa) * u, hand[1] - (x * sa + y * ca) * u];
  const bw = 0.036, bh = 0.078, cy = 0.04;
  const body: Pt[] = [pt(-bw, cy - bh), pt(bw, cy - bh), pt(bw, cy + bh), pt(-bw, cy + bh)];
  hardFill(p, seed, '#22262c', body);
  hardFill(p, seed + 1, '#10161e', [pt(-bw + 0.005, cy - bh + 0.008), pt(bw - 0.005, cy - bh + 0.008), pt(bw - 0.005, cy + bh - 0.008), pt(-bw + 0.005, cy + bh - 0.008)]);
  for (let i = 0; i < 4; i++) inkLine(p, seed + 2 + i, [pt(-0.026 + i * 0.011, cy + 0.052), pt(-0.026 + i * 0.011, cy + 0.052 + 0.008 + i * 0.008), pt(-0.02 + i * 0.011, cy + 0.052 + 0.008 + i * 0.008), pt(-0.02 + i * 0.011, cy + 0.052)], {weight: 0.45, color: '#aab4c0', still: true});
  inkLine(p, seed + 8, [pt(-0.03, cy + 0.048), pt(0.0, cy + 0.082)], {closed: false, weight: 1.1, color: '#e24a3a', still: true});
  inkLine(p, seed + 9, [pt(0.0, cy + 0.048), pt(-0.03, cy + 0.082)], {closed: false, weight: 1.1, color: '#e24a3a', still: true});
  hardFill(p, seed + 10, '#e24a3a', [pt(0.008, cy + 0.07), pt(0.03, cy + 0.07), pt(0.03, cy + 0.08), pt(0.008, cy + 0.08)]);
  inkLine(p, seed + 11, body, {weight: 0.6, color: '#0a0c10', still: true});
};

/** Skin-coloured cupped hands holding a little clear water, centred on `c` (px) at `u` px per metre. */
export const paintCuppedWater = (p: Painter, c: Pt, u: number, o: {seed?: number; skin?: string; drip?: number; fill?: number} = {}) => {
  const s = o.seed ?? 72000, skin = o.skin ?? '#c58e62';
  hardFill(p, s, skin, cell({g: c, u, s: 1}, -0.045, 0.02, 0.07, 0.045, 12));
  hardFill(p, s + 1, skin, cell({g: c, u, s: 1}, 0.045, 0.02, 0.07, 0.045, 12));
  hardFill(p, s + 2, '#cfe6ee', cell({g: c, u, s: 1}, 0, 0.055, 0.075 * (o.fill ?? 1), 0.022, 12));
  inkLine(p, s + 3, cell({g: c, u, s: 1}, -0.045, 0.02, 0.07, 0.045, 12), {weight: 0.5, color: '#4a2e1c', still: true});
  inkLine(p, s + 4, cell({g: c, u, s: 1}, 0.045, 0.02, 0.07, 0.045, 12), {weight: 0.5, color: '#4a2e1c', still: true});
  if (o.drip !== undefined && o.drip >= 0) hardFill(p, s + 5, '#cfe6ee', cell({g: c, u, s: 1}, 0.02, -0.03 - o.drip * 0.3, 0.012, 0.022, 8));
};
