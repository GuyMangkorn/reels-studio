import {capsule, ell, hardFill, inkLine, washAt} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import {paintCrowPx} from './crow';
import {C} from './palette';

// EDU-EP16 props (N6, W5.2): `new: hand-net` (1.2 m pole, 0.45 m hoop, green mesh), `new: stick` (a dry twig the crow carries), the held crow with
// two mitten hands (UT14) for `new: hold-bird`. Picture-space painters taking the figure's hand anchors (`FigAnchors`); `u` is px per metre.
// The coffee cup, tote and wool scarf live in `cast.ts` (`paintCup`, `paintTote`, `paintScarf`).

const POLE = '#8a6a48', POLE_SHADE = '#5f4630', MESH = '#6f9a72', MESH_DARK = '#4a6e50', HOOP = '#b8bcc0';

/** Hand mitten (UT14: a plain oval with a thumb lobe, no fingers; three short knuckle strokes when `fist`), width `w` px. */
export const paintMitten = (p: Painter, at: Pt, w: number, side: -1 | 1, skin: string, seed: number, o: {shade?: string; rot?: number} = {}) => {
  const sh = o.shade ?? '#9a6a50', r = o.rot ?? 0, co = Math.cos(r), si = Math.sin(r);
  const R = ([x, y]: Pt): Pt => [at[0] + (x * co - y * si) * w, at[1] + (x * si + y * co) * w];
  const hand: Pt[] = [[-0.7, -0.2], [0.1, -0.5], [0.6, -0.3], [0.55, 0.25], [-0.3, 0.3], [-0.75, 0.05]].map(([x, y]) => R([x * side, y]));
  hardFill(p, seed, skin, hand);
  inkLine(p, seed + 1, hand, {weight: Math.max(1, w * 0.012), color: sh, closed: true, still: true});
  for (let k = 0; k < 3; k++) inkLine(p, seed + 2 + k, [R([-0.5 * side + k * 0.2 * -side * -1, -0.2 + k * 0.05]), R([-0.45 * side + k * 0.2 * -side * -1, 0.1 + k * 0.05])], {weight: Math.max(1, w * 0.014), color: sh, closed: false, still: true});
};

export type NetOpts = {
  /** Lowering clock 0..1: 0 held up beside him (hoop high and to the side, facing us), 1 down in front (hoop flat on the grass). */
  k: number;
  /** Mesh drape 0..1 (0 taut in the hoop, 1 fallen into a bag over the crow). */
  drape?: number; seed: number; skin: string;
  /** Override the hoop centre (picture px), e.g. the crow's position on the grass: the pole runs from the grips to it. */
  hoopAt?: Pt;
};
/** `new: hand-net`: the pole from the lower grip through the upper grip to the hoop; both hands drawn over the pole. */
export const paintHandNet = (p: Painter, lo: Pt, hi: Pt, u: number, o: NetOpts): {hoop: Pt; rx: number; ry: number} => {
  const e = o.k * o.k * (3 - 2 * o.k);
  const H: Pt = o.hoopAt ?? [lo[0] + (0.42 * (1 - e) + 0.02 * e) * u, lo[1] - (0.78 * (1 - e) - 0.2 * e) * u];
  const rx = 0.225 * u, ry = rx * (0.62 - 0.27 * e);
  const dx = hi[0] - lo[0], dy = hi[1] - lo[1], L = Math.hypot(dx, dy) || 1;
  const butt: Pt = [lo[0] - (dx / L) * 0.2 * u, lo[1] - (dy / L) * 0.2 * u];
  // pole (wood) from the butt to the hoop edge nearest the hands
  const dh = [H[0] - lo[0], H[1] - lo[1]], dl = Math.hypot(dh[0], dh[1]) || 1;
  const end: Pt = [H[0] - (dh[0] / dl) * ry * 0.9, H[1] - (dh[1] / dl) * ry * 0.9];
  hardFill(p, o.seed, POLE_SHADE, capsule(butt, end, 0.021 * u, 0.017 * u, 5));
  hardFill(p, o.seed + 1, POLE, capsule([butt[0] - 0.004 * u, butt[1] - 0.004 * u], [end[0] - 0.004 * u, end[1] - 0.004 * u], 0.013 * u, 0.011 * u, 5));
  // mesh: a shallow cup under the hoop, deeper and wider as it drapes; translucent green with a net grid
  const dr = o.drape ?? 0, sag = (0.05 + 0.3 * dr) * u, spread = 1 + 0.18 * dr;
  const rim = ell(H[0], H[1], rx * spread, ry * spread, 20);
  const bag: Pt[] = [...rim.filter((q) => q[1] >= H[1] - 0.001).map((q): Pt => [q[0], q[1] + sag * 0.15]), ...Array.from({length: 7}, (_, i): Pt => {
    const a = Math.PI * (1 - i / 6); return [H[0] + Math.cos(a) * rx * spread * 0.92, H[1] + ry * spread * 0.2 + sag * Math.sin(Math.PI * (i / 6)) * 0.9 + Math.sin(a) * ry * 0.3];
  })];
  washAt(p, o.seed + 2, MESH, 110 + 60 * dr, bag, 0.15, 0.25);
  washAt(p, o.seed + 3, MESH, 70, rim, 0.12, 0.2);
  for (let i = -3; i <= 3; i++) inkLine(p, o.seed + 10 + i + 3, [[H[0] + (i / 3.4) * rx * spread, H[1] - ry * 0.4], [H[0] + (i / 4.4) * rx * spread * 0.8, H[1] + ry * 0.3 + sag * 0.75]], {weight: Math.max(0.8, 0.004 * u), color: MESH_DARK, closed: false, still: true});
  for (let j = 1; j <= 3; j++) inkLine(p, o.seed + 20 + j, [[H[0] - rx * spread * (1 - j * 0.12), H[1] + ry * 0.1 * j + sag * 0.2 * j], [H[0] + rx * spread * (1 - j * 0.12), H[1] + ry * 0.1 * j + sag * 0.2 * j]], {weight: Math.max(0.8, 0.004 * u), color: MESH_DARK, closed: false, still: true});
  // hoop ring (back half dark, front half light)
  inkLine(p, o.seed + 30, rim, {weight: Math.max(2, 0.013 * u), color: HOOP, closed: true, still: true});
  inkLine(p, o.seed + 31, rim.filter((q) => q[1] >= H[1]), {weight: Math.max(1.2, 0.006 * u), color: C.ink, closed: false, still: true});
  // hands over the pole
  paintMitten(p, lo, 0.1 * u, 1, o.skin, o.seed + 40);
  paintMitten(p, hi, 0.1 * u, -1, o.skin, o.seed + 50);
  return {hoop: H, rx, ry};
};

/** `new: stick`: a dry twig (0.45 m, one side fork) at picture point `at` (its middle), `angle` in degrees (0 = horizontal, positive turns the tip down), `u` px per metre. */
export const paintStick = (p: Painter, at: Pt, u: number, angle: number, seed: number, len = 0.45) => {
  const a = (angle * Math.PI) / 180, d: Pt = [Math.cos(a), Math.sin(a)], n: Pt = [-d[1], d[0]], h = (len * u) / 2;
  const P = (s: number, off = 0): Pt => [at[0] + d[0] * s * h + n[0] * off * u, at[1] + d[1] * s * h + n[1] * off * u];
  const w = Math.max(1.4, 0.011 * u);
  hardFill(p, seed, '#4a3a2c', capsule(P(-1), P(1), w, w * 0.55, 4));
  hardFill(p, seed + 1, '#7a6048', capsule(P(-1, -0.002), P(1, -0.002), w * 0.5, w * 0.25, 4));
  inkLine(p, seed + 2, [P(0.1), P(0.55, 0.07), P(0.8, 0.09)], {weight: w * 0.8, color: '#4a3a2c', closed: false, still: true});
  inkLine(p, seed + 3, [P(-0.4), P(-0.2, -0.05)], {weight: w * 0.6, color: '#4a3a2c', closed: false, still: true});
};

/** `new: hold-bird`: a calm crow (folded, tucked, eye open) lying across two mitten hands at `rHand`/`lHand`; the hands are redrawn over its wings. */
export const paintHeldBird = (p: Painter, rHand: Pt, lHand: Pt, u: number, o: {seed: number; skin: string; lean?: number; ring?: boolean; headTilt?: number; head?: 'profile-right' | 'front'}) => {
  const M: Pt = [(rHand[0] + lHand[0]) / 2, (rHand[1] + lHand[1]) / 2], L = 0.5 * u;
  const m = paintCrowPx(p, [M[0] - 0.095 * L, M[1] + 0.167 * L], L, {variant: o.ring ? 'adult-ringed' : 'adult', view: 'right', head: o.head ?? 'profile-right', state: {tuck: true, lean: o.lean ?? 32, headTilt: o.headTilt ?? 0}, seed: o.seed, sun: -1});
  paintMitten(p, rHand, 0.12 * u, 1, o.skin, o.seed * 20 + 1);
  paintMitten(p, lHand, 0.12 * u, -1, o.skin, o.seed * 20 + 11);
  return m;
};
