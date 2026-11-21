import type {FigAnchors} from '../../kit/cast';
import {ell, hardFill, inkLine, washAt} from '../../kit/draw';
import {mittenThumbSide} from '../../kit/hand-gestures';
import {mixColor, type Painter, type Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint, camUnit, mixYCam, type YCam} from '../../kit/ycam';
import {paintBox, paintSorted, qz, sphereAt, wFill} from '../../kit/world';
import {candleOn, KITCHEN_PAPER, kitchenPool} from '../kitchen31';
import {paintCalendarPage} from '../props31';
import {kitchenTable, paintKitchenShell, paintPendant, WHEELER, type WorldText} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camOf, ein, ez, fig, gu, lin, mix, mix3, poseShoulder, reachArm, smooth} from '../stage31';

// B04-SH03 · F [1026, 1151) · three and a half months on the wall calendar (SCENE-R1 b04). Wheeler `new: feet-up-lean-back` + P19 (glass), `smug`,
// seated at S1 on the plain chair, heels crossed on the table corner (+0.25, 0.72, -0.20); the kit seated body is drawn with `seated` (no legs)
// and the raised legs (jeans, white sneakers, soles to the lens) are painted over the table top from the hips through the raised knees to the
// heels (thigh 0.38 m, shin 0.41 m). His RIGHT mitten (screen left) holds the lemonade at his chest, the LEFT rests on his belly. Behind him the
// `new: wall-calendar-1995` (0.30 x 0.45 at (-0.75, 1.55, -1.97)) tears JAN -> FEB (L39, F1065) -> MAR (L47) -> APR (L55): each torn page flies
// up-right 0.3 m spinning, gone in 8 f; month and year are world text. The window turns from January night to spring daylight L39-70, the sill
// snow melts L39-60, a pot plant on the sill flowers L50-62, the kitchen key warms a little. L73-88 the toast: the glass moves toward the lens
// (to (0, 0.98, -0.36), chest height for the kit seated figure; kept on his right side, the sheet's x +0.10 would cross his body), ice settles at L88, held to L124.
const N = 125, SHOT = 'B04-SH03';
const A = camOf({eye: [-0.15, 1.25, 1.25], yaw: -8, pitch: -2, f: 920, hy: 640}), B = camOf({eye: [-0.15, 1.25, 1.25], yaw: -5, pitch: -2, f: 990, hy: 640});
const CAM = (L: number) => mixYCam(A, B, ez(L, 0, N - 1));
const S1: V3 = [0, 0, -0.75];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR'], TEARS = [39, 47, 55];
const PAGE: [V3, V3, V3, V3] = [[-0.9, 1.78, -1.964], [-0.6, 1.78, -1.964], [-0.6, 1.33, -1.964], [-0.9, 1.33, -1.964]];
const monthAt = (L: number) => TEARS.filter((t) => L >= t).length;
const dayAt = (L: number) => smooth(lin(L, 39, 70));
/** A page region (u, v fractions) moved by the tear transform of progress k (0 = on the wall): up-right 0.3 m, spinning about its centre. */
const pageCorners = (k: number, u0 = 0, v0 = 0, u1 = 1, v1 = 1): [V3, V3, V3, V3] => {
  const [a, b, , d] = PAGE, P = (u: number, v: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (d[1] - a[1]) * v, a[2]];
  const c: V3 = P(0.5, 0.5), ang = k * 2.6, off: V3 = [0.22 * k, 0.2 * k + 0.1 * k * k, 0.04 * k];
  const T = (v: V3): V3 => { const dx = v[0] - c[0], dy = v[1] - c[1], co = Math.cos(ang), si = Math.sin(ang); return [c[0] + off[0] + dx * co - dy * si, c[1] + off[1] + dx * si + dy * co, v[2] + off[2]]; };
  return [T(P(u0, v0)), T(P(u1, v0)), T(P(u1, v1)), T(P(u0, v1))];
};
const pageTexts = (m: number, k: number): WorldText[] => [
  {text: MONTHS[m], corners: pageCorners(k, 0.1, 0.11, 0.9, 0.32), color: '#2a2a33', weight: 900},
  {text: '1995', corners: pageCorners(k, 0.22, 0.32, 0.78, 0.45), color: '#a8242a', weight: 900},
];
/** Torn page in flight at frame L (index of the month it shows and progress 0..1), or null. */
const flying = (L: number) => { for (let i = 0; i < 3; i++) if (L >= TEARS[i] && L < TEARS[i] + 8) return {m: i, k: ein(lin(L, TEARS[i], TEARS[i] + 8))}; return null; };
const GLASS0: V3 = [-0.1, 0.86, -0.52], GLASS1: V3 = [0, 0.98, -0.36];
const glassAt = (L: number): V3 => mix3(GLASS0, GLASS1, ez(L, 73, 88));

/** Lemonade tumbler in picture px (bottom centre x, y; `u` px/m): pale juice, ice, a lime-yellow lemon wheel on the rim. `settle` 0..1 shifts the ice. */
const paintGlass = (p: Painter, x: number, y: number, u: number, settle: number) => {
  const w = 0.036 * u, h = 0.12 * u, tw = w * 1.15;
  const body: Pt[] = [[x - w, y], [x + w, y], [x + tw, y - h], [x - tw, y - h]];
  hardFill(p, 38980, '#efe7a6', [[x - w * 0.95, y - 2], [x + w * 0.95, y - 2], [x + tw * 0.95, y - h * 0.82], [x - tw * 0.95, y - h * 0.82]]);
  for (let i = 0; i < 3; i++) { const ix = x + (i - 1) * w * 0.6 + settle * (i === 1 ? 2 : -1), iy = y - h * (0.55 + (i % 2) * 0.16) + settle * 3; hardFill(p, 38981 + i, '#fbfbf2', [[ix - w * 0.3, iy - w * 0.3], [ix + w * 0.3, iy - w * 0.25], [ix + w * 0.26, iy + w * 0.3], [ix - w * 0.28, iy + w * 0.26]]); }
  washAt(p, 38985, '#ffffff', 70, [[x - tw * 0.8, y - h * 0.95], [x - tw * 0.55, y - h * 0.95], [x - w * 0.5, y - h * 0.1], [x - w * 0.75, y - h * 0.1]], 0.1, 0.1);
  inkLine(p, 38986, body, {closed: true, weight: 0.8, color: '#7a8a8a'});
  inkLine(p, 38987, ell(x, y - h, tw, tw * 0.28, 16), {closed: true, weight: 0.7, color: '#7a8a8a'});
  hardFill(p, 38988, '#f2cd1c', ell(x + tw * 0.75, y - h, tw * 0.42, tw * 0.42, 14)); hardFill(p, 38989, '#fbf2c4', ell(x + tw * 0.75, y - h, tw * 0.3, tw * 0.3, 12));
};
/** The raised legs (jeans, sneakers) from both hips through the knees to the crossed heels on the table corner; drawn over the table top. */
const paintLegs = (p: Painter, c: YCam, hips: [V3, V3]) => {
  const knees: [V3, V3] = [[0.02, 0.83, -0.5], [0.16, 0.81, -0.48]], heels: [V3, V3] = [[0.2, 0.735, -0.22], [0.3, 0.75, -0.19]];
  const seg = (s: number, a: V3, b: V3, wa: number, wb: number, col: string) => {
    const pa = camPoint(c, a), pb = camPoint(c, b); if (!pa || !pb) return;
    const ua = camUnit(c, a) * wa / 2, ub = camUnit(c, b) * wb / 2, dx = pb[0] - pa[0], dy = pb[1] - pa[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
    const q: Pt[] = [[pa[0] + nx * ua, pa[1] + ny * ua], [pb[0] + nx * ub, pb[1] + ny * ub], [pb[0] - nx * ub, pb[1] - ny * ub], [pa[0] - nx * ua, pa[1] - ny * ua]];
    hardFill(p, s, col, q); hardFill(p, s + 1, col, ell(pb[0], pb[1], ub, ub, 12)); inkLine(p, s + 2, q, {closed: true, weight: 0.7});
  };
  const pants = WHEELER.outfit!.pants!, shade = mixColor(pants, '#2a3040', 0.25);
  for (const i of [0, 1]) { seg(38990 + i * 10, hips[i], knees[i], 0.15, 0.12, i ? pants : shade); seg(38993 + i * 10, knees[i], heels[i], 0.12, 0.1, i ? pants : shade); }
  for (const i of [0, 1]) { // sneakers, soles toward the lens
    const h = camPoint(c, heels[i]); if (!h) continue; const s = camUnit(c, heels[i]);
    hardFill(p, 39010 + i * 4, '#efebe2', ell(h[0] + 0.01 * s, h[1] - 0.05 * s, 0.05 * s, 0.075 * s, 16));
    hardFill(p, 39011 + i * 4, '#c9c2b2', ell(h[0] + 0.01 * s, h[1] - 0.05 * s, 0.036 * s, 0.06 * s, 14));
    inkLine(p, 39012 + i * 4, ell(h[0] + 0.01 * s, h[1] - 0.05 * s, 0.05 * s, 0.075 * s, 16), {closed: true, weight: 0.8});
  }
};

export const def: Shot31 = {
  id: SHOT, N, paper: KITCHEN_PAPER, vignette: 0.4,
  cam: CAM,
  texts: (L) => { const f = flying(L); return [...pageTexts(Math.min(3, monthAt(L)), 0), ...(f ? pageTexts(f.m, f.k) : [])]; },
  pool: (L, c) => kitchenPool(c, [0, 0.95, -0.25], 560, mix(0.3, 0.36, dayAt(L))),
  fx: (L, c) => {
    const d = dayAt(L), w = camPoint(c, [-2.0, 1.5, -1.98]);
    return d > 0 && w ? <div style={{position: 'absolute', left: w[0] - 700, top: w[1] - 700, width: 1400, height: 1400, borderRadius: '50%', mixBlendMode: 'screen', background: `radial-gradient(circle, rgba(225,240,255,${0.22 * d}) 0%, rgba(225,240,255,${0.08 * d}) 40%, transparent 70%)`}} /> : null;
  },
  paint: (p, L, c, pr) => {
    const t = L / 30 + 3, d = dayAt(L); // rig clock +3 s: one blink at L44-47, eyes open on the toast
    paintKitchenShell(p, c);
    // window: night -> spring daylight, mullions, sill snow melting, the pot plant flowering
    wFill(p, c, 39020, mixColor('#25375a', '#bcdcec', d), qz(-1.979, -2.4, -1.6, 1.0, 2.0));
    wFill(p, c, 39021, mixColor('#3e5a86', '#e8f2d8', d), qz(-1.9785, -2.4, -1.6, 1.0, 1.25));
    wFill(p, c, 39022, '#efe7d2', qz(-1.977, -2.4, -1.6, 1.48, 1.52)); wFill(p, c, 39023, '#efe7d2', qz(-1.977, -2.02, -1.98, 1.0, 2.0));
    const melt = ez(L, 39, 60);
    paintBox(p, c, 39024, {x0: -2.55, x1: -1.45, y0: 0.9, y1: 0.98, z0: -2.0, z1: -1.85}, mixColor('#f6f4ee', '#c9ad7e', melt), {}, {});
    if (melt < 1) paintBox(p, c, 39025, {x0: -2.5 + 0.2 * melt, x1: -1.5 - 0.2 * melt, y0: 0.98, y1: 0.98 + 0.03 * (1 - melt), z0: -1.99, z1: -1.87}, '#fbfbf6', {}, {});
    paintBox(p, c, 39026, {x0: -1.78, x1: -1.62, y0: 0.98, y1: 1.1, z0: -1.97, z1: -1.87}, '#b8643a', {}, {ink: true}); // pot
    const bloom = ez(L, 50, 62);
    for (let i = 0; i < 5; i++) { const s = sphereAt(c, [-1.7 + Math.sin(i * 1.9) * 0.05, 1.14 + i * 0.025, -1.92], 0.035); if (s) hardFill(p, 39030 + i, i % 2 ? '#4f7d44' : '#3f6b3a', ell(s.x, s.y, s.r, s.r * 0.7, 10)); }
    if (bloom > 0) for (let i = 0; i < 4; i++) { const s = sphereAt(c, [-1.7 + Math.cos(i * 1.6) * 0.045, 1.2 + (i % 2) * 0.03, -1.91], 0.016 * bloom); if (s) { hardFill(p, 39040 + i, '#f08ab0', ell(s.x, s.y, s.r, s.r, 10)); hardFill(p, 39044 + i, '#ffe07a', ell(s.x, s.y, s.r * 0.35, s.r * 0.35, 6)); } }
    // the calendar: current month page on the wall, the torn page flying
    paintCalendarPage(p, c, 39050, PAGE);
    const f = flying(L); if (f) paintCalendarPage(p, c, 39120, pageCorners(f.k), 0.1);
    // Wheeler: arms by character side, one chain each
    const {u} = gu(c, S1), shR = poseShoulder(WHEELER, c, S1, 'P31', 'front', 'r'), shL = poseShoulder(WHEELER, c, S1, 'P31', 'front', 'l');
    const g = camPoint(c, glassAt(L))!, belly = camPoint(c, [0.04, 0.95, -0.66])!;
    const rA = reachArm(shR, [g[0], g[1] + 0.02 * u], u, -1, {fist: mittenThumbSide('right', 'back')});
    const lA = reachArm(shL, belly, u, 1, {open: mittenThumbSide('left', 'back')});
    const out: {a?: FigAnchors | null} = {};
    paintSorted(p, c, [fig(WHEELER, {at: S1, view: 'front', pose: 'P31', face: 'smug', seed: 3101, t, fig: {seated: true, rArm: rA.arm, lArm: lA.arm}}, true, out), ...kitchenTable({camera: false, candle: candleOn(L / 30, 0)})]);
    paintPendant(p, c);
    paintLegs(p, c, [[-0.09, 0.47, -0.72], [0.09, 0.47, -0.72]]);
    paintGlass(p, rA.hand[0], rA.hand[1] + 0.03 * u, 1.6 * camUnit(c, glassAt(L)), lin(L, 88, 92)); // 1.6: the glass at the four-head cast scale (hands and head drawn large)
    const sk = WHEELER.head.skin, m = rA.hand; hardFill(p, 39060, sk, ell(m[0], m[1] + 0.005 * u, 0.04 * u, 0.034 * u, 14)); inkLine(p, 39061, ell(m[0], m[1] + 0.005 * u, 0.04 * u, 0.034 * u, 14), {closed: true, weight: 0.8}); // the mitten round the glass
    if (pr && out.a) {
      pr.lead('WHEELER', {top: out.a.top, bottom: out.a.bottom, x: out.a.head[0]}); pr.lead('HEAD', {top: out.a.headTop, bottom: out.a.chin, x: out.a.head[0]});
      pr.lead('ARM-R', {top: rA.ratio, bottom: 0}); pr.lead('ARM-L', {top: lA.ratio, bottom: 0}); pr.lead('GLASS', {top: g[1], bottom: g[1], x: g[0]});
      const ct = camPoint(c, PAGE[0]), cb = camPoint(c, PAGE[2]); if (ct && cb) pr.lead('CALENDAR', {top: ct[1], bottom: cb[1], left: ct[0], right: cb[0], x: (ct[0] + cb[0]) / 2});
      const h0 = camPoint(c, [0.2, 0.735, -0.22]), h1 = camPoint(c, [0.3, 0.75, -0.19]); if (h0 && h1) pr.lead('HEELS', {top: h0[1], bottom: h1[1], x: (h0[0] + h1[0]) / 2});
    }

  },
};
export const shot = makeShot(def);
