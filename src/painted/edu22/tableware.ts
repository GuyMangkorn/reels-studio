import {ell, hardFill, inkLine, INK} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {flatCircle, hull, wFill, wInk} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {TABLE} from './palette';

// EDU-EP22 tableware (brief N4, VD05; sizes from the projection contract, est). World metres in space H, drawn through the yaw camera:
// - `paintLidBowl`: the long-table bowl (porcelain, Ø 0.16 m, h 0.08 m) with its domed silver cover (Ø 0.17 m, h 0.06 m, knob 0.02 m) on, or
//   off and set down beside the bowl with the braised food and the small silver tag (0.06 x 0.015 m) leaning in it. The cover is the coolest
//   highlight in the hall; its lit side follows the key (the right-wall windows, +x).
// - `paintDish`: the child's open dishes (plate Ø 0.14-0.18, bowl Ø 0.12, rice bowl Ø 0.10) with a food fill; home-style mixed porcelain.
// - `paintTray`: the black-red lacquer tray (0.58 x 0.42 m) with a gold rim. `paintSpoon`: porcelain spoon 0.11 m.
// Rule (truth limit 2): the child's dishes never carry a tag, a cover or a glint; only the long-table bowls do.

const ring = (c: YCam, at: V3, r: number, y: number, n = 18): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) { const q = camPoint(c, [at[0] + r * Math.cos((i / n) * 6.283), y, at[2] + r * Math.sin((i / n) * 6.283)]); if (q) pts.push(q); }
  return pts;
};
/** Silhouette of a solid of revolution about the vertical through `at`: profile [radius, height] pairs, as one convex picture polygon. */
const solidOf = (c: YCam, at: V3, prof: [number, number][], n = 16): Pt[] => hull(prof.flatMap(([r, h]) => ring(c, at, r, at[1] + h, n)));

/** Contact shadow under a round prop (soft, toward -x: the key comes from +x). */
const contact = (p: Painter, c: YCam, seed: number, at: V3, r: number, op = 0.35) => {
  const q = flatCircle(c, [at[0] - r * 0.25, at[1] + 0.001, at[2]], r * 1.15, 16);
  if (q.length >= 3) hardFill(p.layer(op, seed * 3 + 7), seed, '#2a1410', q);
};

/** `held`: the cover is off the bowl and drawn by the caller in a hand (W5.1 N5 `cover-lift`); the bowl shows its food and tag. */
export type LidBowlOpts = {cover: 'on' | 'off' | 'held'; /** Where the lifted cover rests (world, on the runner); default beside the bowl toward -x. */ coverAt?: V3;
  /** Far props: fewer marks (no ink, no knob highlight) below this many px per metre. */ detailPx?: number; food?: string};

/** The silver cover as a dome at `at` (rim centre). Exported for covers in a hand (W5.1). */
export const paintCover = (p: Painter, c: YCam, seed: number, at: V3, detail: boolean) => {
  const prof: [number, number][] = [[0.085, 0], [0.082, 0.02], [0.07, 0.038], [0.05, 0.052], [0.02, 0.06]];
  const sil = solidOf(c, at, prof);
  if (sil.length < 3) return;
  hardFill(p, seed, TABLE.silver, sil);
  // shade on the side away from the key (-x) and under the rim, then the lit band on the +x shoulder
  const shade = solidOf(c, [at[0] - 0.03, at[1], at[2]], prof.map(([r, h]) => [r * 0.78, h * 0.96] as [number, number]));
  if (shade.length >= 3) hardFill(p.layer(0.55, seed * 5 + 1), seed + 1, TABLE.silverShade, shade);
  const hi = solidOf(c, [at[0] + 0.035, at[1] + 0.022, at[2] + 0.01], [[0.028, 0], [0.024, 0.012], [0.012, 0.022]], 10);
  if (hi.length >= 3) hardFill(p, seed + 2, TABLE.silverHi, hi);
  const rim = ring(c, at, 0.086, at[1] + 0.004, 18);
  if (detail) {
    const k = camPoint(c, [at[0], at[1] + 0.068, at[2]]), u = camUnit(c, at);
    if (k) { hardFill(p, seed + 3, TABLE.silverShade, ell(k[0], k[1], 0.013 * u, 0.009 * u, 10)); hardFill(p, seed + 4, TABLE.silverHi, ell(k[0] + 0.004 * u, k[1] - 0.003 * u, 0.005 * u, 0.004 * u, 8)); }
    inkLine(p, seed + 5, sil, {weight: 0.7, color: mixColor(TABLE.silverShade, INK, 0.5), still: true});
    if (rim.length >= 3) inkLine(p, seed + 6, rim, {weight: 0.5, color: TABLE.silverShade, still: true});
  }
};

/** Porcelain bowl body (and its blue rim line) with the rim centre at `at[1] + h`. */
const paintBowlBody = (p: Painter, c: YCam, seed: number, at: V3, r: number, h: number, detail: boolean, rimColor: string = TABLE.blue) => {
  const sil = solidOf(c, at, [[r * 0.5, 0], [r * 0.8, h * 0.35], [r, h]]);
  if (sil.length < 3) return;
  hardFill(p, seed, TABLE.porcelain, sil);
  const sh = solidOf(c, [at[0] - r * 0.25, at[1], at[2]], [[r * 0.4, 0], [r * 0.65, h * 0.35], [r * 0.75, h * 0.9]]);
  if (sh.length >= 3) hardFill(p.layer(0.45, seed * 5 + 2), seed + 1, TABLE.porcelainShade, sh);
  const top = ring(c, at, r, at[1] + h, 18);
  if (top.length >= 3) inkLine(p, seed + 2, top, {weight: detail ? 1.1 : 0.7, color: rimColor, still: true});
  if (detail) inkLine(p, seed + 3, sil, {weight: 0.6, color: mixColor(TABLE.porcelainShade, INK, 0.5), still: true});
};

/** Food surface inside a bowl or on a plate: a mound ellipse with a few pieces in a second colour. */
const paintFood = (p: Painter, c: YCam, seed: number, at: V3, r: number, y: number, color: string, bits?: string) => {
  const top = ring(c, at, r, y, 16);
  if (top.length < 3) return;
  hardFill(p, seed, color, top);
  const hi = ring(c, [at[0] + r * 0.2, y + 0.004, at[2] - r * 0.1], r * 0.45, y + 0.004, 12);
  if (hi.length >= 3) hardFill(p.layer(0.35, seed * 5 + 3), seed + 1, mixColor(color, '#fff2d0', 0.5), hi);
  if (!bits) return;
  for (let i = 0; i < 5; i++) {
    const a = i * 2.4 + seed * 0.37, rr = r * (0.25 + 0.12 * (i % 3));
    const q = camPoint(c, [at[0] + rr * Math.cos(a), y + 0.006, at[2] + rr * Math.sin(a)]), u = camUnit(c, at);
    if (q) hardFill(p, seed + 2 + i, bits, ell(q[0], q[1], 0.012 * u, 0.008 * u, 8, a));
  }
};

/** The small silver tag leaning in the food (0.06 x 0.015 m; staged, the memoir does not say how it was held: FACT-R2 ruling 1). */
export const paintTag = (p: Painter, c: YCam, seed: number, at: V3, detail: boolean) => {
  // W5.1 (B03-SH08 "tag readable at 540 px"): the plate's face turned toward +z (it was edge-on to the cameras looking down -z) and 0.02 m wide
  const a: V3 = [at[0] - 0.008, at[1], at[2] + 0.01], b: V3 = [at[0] + 0.01, at[1] + 0.055, at[2] - 0.004];
  const w = 0.01, d: V3 = [w, 0, w * 0.3], q = [[a[0] - d[0], a[1], a[2] - d[2]], [b[0] - d[0], b[1], b[2] - d[2]], [b[0] + d[0], b[1], b[2] + d[2]], [a[0] + d[0], a[1], a[2] + d[2]]] as V3[];
  const pts = wFill(p, c, seed, TABLE.tag, q);
  if (detail && pts.length >= 3) wInk(p, c, seed + 1, q, {color: TABLE.silverShade, weight: 0.5});
};

/** One long-table bowl with its cover (brief VD05). `at` is the bowl's foot on the table top. */
export const paintLidBowl = (p: Painter, c: YCam, seed: number, at: V3, o: LidBowlOpts) => {
  const u = camUnit(c, at), detail = u > (o.detailPx ?? 260);
  contact(p, c, seed + 40, at, 0.075);
  paintBowlBody(p, c, seed, at, 0.08, 0.06, detail);
  if (o.cover === 'on') { paintCover(p, c, seed + 10, [at[0], at[1] + 0.058, at[2]], detail); return; }
  paintFood(p, c, seed + 20, at, 0.072, at[1] + 0.052, o.food ?? TABLE.braised, TABLE.greens);
  paintTag(p, c, seed + 30, [at[0], at[1] + 0.054, at[2]], detail);
  if (o.cover === 'held') return;
  const ca = o.coverAt ?? [at[0] - 0.17, at[1], at[2]];
  contact(p, c, seed + 41, ca, 0.08);
  paintCover(p, c, seed + 10, ca, detail);
};

export type DishKind = 'plate' | 'bowl' | 'rice' | 'deep';
export type Dish = {kind: DishKind; at: V3; r?: number; food: string; bits?: string; rim?: string; ware?: string};
/** One open dish of the child's table (home-style: warm porcelain, blue-and-white or celadon rims, food visible). */
export const paintDish = (p: Painter, c: YCam, seed: number, d: Dish) => {
  const u = camUnit(c, d.at), detail = u > 260;
  const r = d.r ?? (d.kind === 'plate' ? 0.08 : d.kind === 'rice' ? 0.05 : 0.06);
  contact(p, c, seed + 40, d.at, r * 0.9, 0.3);
  if (d.kind === 'plate') {
    const top = ring(c, d.at, r, d.at[1] + 0.012, 20), foot = ring(c, d.at, r * 0.7, d.at[1], 16), sil = hull([...top, ...foot]);
    if (sil.length >= 3) hardFill(p, seed, d.ware ?? TABLE.porcelain, sil);
    if (top.length >= 3) { hardFill(p, seed + 1, mixColor(d.ware ?? TABLE.porcelain, TABLE.porcelainShade, 0.35), top); inkLine(p, seed + 2, top, {weight: detail ? 1.0 : 0.6, color: d.rim ?? TABLE.blue, still: true}); }
    paintFood(p, c, seed + 10, d.at, r * 0.68, d.at[1] + 0.02, d.food, d.bits);
    return;
  }
  const h = d.kind === 'rice' ? 0.055 : d.kind === 'deep' ? 0.06 : 0.045;
  paintBowlBody(p, c, seed, d.at, r, h, detail, d.rim ?? TABLE.blue);
  paintFood(p, c, seed + 10, d.at, r * 0.86, d.at[1] + h * (d.kind === 'rice' ? 1.08 : 0.88), d.food, d.bits);
};

/** Lacquer tray (0.58 x 0.42 m, rim 0.025 m) centred at `at` on a table top; `rot` turns it about the vertical (radians, W5.1 carriers). The
 *  shadow is drawn only when `shadow` (a carried tray casts none on the table). */
export const paintTray = (p: Painter, c: YCam, seed: number, at: V3, w = 0.58, d = TRAY_D, rot = 0, shadow = true) => {
  const y = at[1], h = 0.022, cs = Math.cos(rot), sn = Math.sin(rot);
  const W = (lx: number, yy: number, lz: number): V3 => [at[0] + lx * cs - lz * sn, yy, at[2] + lx * sn + lz * cs];
  const x0 = -w / 2, x1 = w / 2, z0 = -d / 2, z1 = d / 2;
  if (shadow) wFill(p.layer(0.3, seed * 3 + 9), c, seed + 9, '#1e0e0a', [W(x0 - 0.02, y + 0.001, z0), W(x1 - 0.02, y + 0.001, z0), W(x1 - 0.02, y + 0.001, z1 + 0.02), W(x0 - 0.02, y + 0.001, z1 + 0.02)]);
  // sides the camera sees (outward normal toward the camera), then the floor of the tray and the gold rim
  const sides: [V3[], [number, number], number][] = [
    [[W(x0, y, z1), W(x1, y, z1), W(x1, y + h, z1), W(x0, y + h, z1)], [-sn, cs], 0.25],
    [[W(x1, y, z0), W(x1, y, z1), W(x1, y + h, z1), W(x1, y + h, z0)], [cs, sn], 0.35],
    [[W(x0, y, z0), W(x0, y, z1), W(x0, y + h, z1), W(x0, y + h, z0)], [-cs, -sn], 0.35],
    [[W(x0, y, z0), W(x1, y, z0), W(x1, y + h, z0), W(x0, y + h, z0)], [sn, -cs], 0.25],
  ];
  sides.forEach(([q, n, k], i) => {
    const m = q[0], fx = (m[0] + q[1][0]) / 2, fz = (m[2] + q[1][2]) / 2;
    if ((c.x - fx) * n[0] + (c.z - fz) * n[1] > 0) wFill(p, c, seed + (i === 0 ? 0 : i === 3 ? 5 : 1), mixColor(TABLE.tray, '#000000', k), q);
  });
  wFill(p, c, seed + 2, TABLE.trayRim, [W(x0, y + h, z0), W(x1, y + h, z0), W(x1, y + h, z1), W(x0, y + h, z1)]);
  const m = 0.02;
  wFill(p, c, seed + 3, TABLE.tray, [W(x0 + m, y + h, z0 + m), W(x1 - m, y + h, z0 + m), W(x1 - m, y + h, z1 - m), W(x0 + m, y + h, z1 - m)]);
  wFill(p.layer(0.25, seed * 3 + 4), c, seed + 4, '#8a4a3a', [W(x0 + m + 0.05, y + h, z0 + m), W(x1 - m, y + h, z0 + m), W(x1 - m, y + h, z0 + m + 0.08), W(x0 + m + 0.12, y + h, z0 + m + 0.08)]);
  return y + h;
};

/** Porcelain spoon (0.11 m) lying from `at` along the angle `a` (radians in the table plane). */
export const paintSpoon = (p: Painter, c: YCam, seed: number, at: V3, a: number) => {
  const L = 0.11, dx = Math.cos(a), dz = Math.sin(a), y = at[1] + 0.008;
  const bowlC: V3 = [at[0] + dx * 0.025, y, at[2] + dz * 0.025], tip: V3 = [at[0] + dx * L, y + 0.012, at[2] + dz * L];
  // W5.1 (Film LF01b note: spoon too small to read): bowl 0.022 -> 0.03 m, a darker blue rim and a shade wash inside the bowl
  const bowl = ring(c, bowlC, 0.03, y, 14);
  if (bowl.length >= 3) hardFill(p, seed, TABLE.porcelain, bowl);
  const inner = ring(c, [bowlC[0] - 0.004, y + 0.001, bowlC[2]], 0.019, y + 0.001, 12);
  if (inner.length >= 3) hardFill(p.layer(0.45, seed * 3 + 5), seed + 5, TABLE.porcelainShade, inner);
  const n: V3 = [-dz * 0.006, 0, dx * 0.006];
  wFill(p, c, seed + 1, TABLE.porcelain, [[bowlC[0] + n[0], y, bowlC[2] + n[2]], [tip[0] + n[0] * 0.6, tip[1], tip[2] + n[2] * 0.6], [tip[0] - n[0] * 0.6, tip[1], tip[2] - n[2] * 0.6], [bowlC[0] - n[0], y, bowlC[2] - n[2]]]);
  if (bowl.length >= 3) inkLine(p, seed + 2, bowl, {weight: 1.0, color: mixColor(TABLE.blue, INK, 0.35), still: true});
};

/** Porcelain spoon in a hand (W5.1 N5): the handle end at `hand`, the bowl centre at `bowl` (world), the bowl held level. */
export const paintSpoonHeld = (p: Painter, c: YCam, seed: number, hand: V3, bowl: V3) => {
  const dx = bowl[0] - hand[0], dz = bowl[2] - hand[2], L = Math.hypot(dx, dz) || 1, n: V3 = [(-dz / L) * 0.006, 0, (dx / L) * 0.006];
  const e: V3 = [bowl[0] - (dx / L) * 0.022, bowl[1] + 0.004, bowl[2] - (dz / L) * 0.022];
  wFill(p, c, seed + 1, TABLE.porcelain, [[e[0] + n[0], e[1], e[2] + n[2]], [hand[0] + n[0] * 0.7, hand[1], hand[2] + n[2] * 0.7], [hand[0] - n[0] * 0.7, hand[1], hand[2] - n[2] * 0.7], [e[0] - n[0], e[1], e[2] - n[2]]]);
  const b = ring(c, bowl, 0.03, bowl[1], 14);
  if (b.length >= 3) { hardFill(p, seed, TABLE.porcelain, hull(b)); inkLine(p, seed + 2, hull(b), {weight: 1.0, color: mixColor(TABLE.blue, INK, 0.35), still: true}); }
};

/** The taster's saucer SAU (Ø 0.12 m porcelain, blue rim): a plain dish on the runner at the near end of LT. */
export const paintSaucer = (p: Painter, c: YCam, seed: number, at: V3) => {
  const u = camUnit(c, at), detail = u > 260;
  contact(p, c, seed + 40, at, 0.06, 0.3);
  const top = ring(c, at, 0.06, at[1] + 0.012, 20), foot = ring(c, at, 0.04, at[1], 16), sil = hull([...top, ...foot]);
  if (sil.length >= 3) hardFill(p, seed, TABLE.porcelain, sil);
  if (top.length >= 3) { hardFill(p, seed + 1, mixColor(TABLE.porcelain, TABLE.porcelainShade, 0.3), top); inkLine(p, seed + 2, top, {weight: detail ? 1.0 : 0.6, color: TABLE.blue, still: true}); }
};

/** The four trays of the child's table (set plan: tray centres) with five dishes each = 20 dishes; `TRAY_AT` y is the table top. */
// W5.1 (Film LF01b note "cup contact at the tray edge"): trays 0.42 -> 0.40 m deep and TR1/TR2 1 cm toward +z, TR3/TR4 1 cm toward +z, so the
// rice bowl RB (Ø 0.09) stands on the bare lacquer between the trays' far rims (z -0.35) and CT's back edge (z -0.45) instead of on a rim.
export const TRAY_D = 0.4;
export const TRAY_AT: V3[] = [[-0.3, 0.66, -0.15], [0.3, 0.66, -0.15], [-0.3, 0.66, 0.25], [0.3, 0.66, 0.25]];
/** The child's rice bowl RB and spoon CS rest points (W5.1: RB z -0.40 so it clears the tray rims; CS beside it). */
export const RB_AT: V3 = [0, 0.661, -0.4];
export const CS_AT: V3 = [0.1, 0.661, -0.41];
const F = TABLE;
/** Dish layouts on a tray, offsets from the tray centre (m): five dishes, varied (brief: home-style mixed porcelain, food warm). */
export const TRAY_DISHES: Omit<Dish, 'at'>[][] = [
  [{kind: 'plate', r: 0.085, food: F.braised, bits: F.greens}, {kind: 'bowl', food: F.egg, bits: F.greens, rim: F.celadon}, {kind: 'plate', r: 0.07, food: F.greens, bits: F.red, ware: '#f6f0e2'}, {kind: 'bowl', r: 0.055, food: F.tofu, bits: F.braised}, {kind: 'deep', r: 0.06, food: '#c98a4a', bits: F.greens, rim: F.red}],
  [{kind: 'plate', r: 0.08, food: F.red, bits: F.greens, rim: F.celadon}, {kind: 'bowl', food: F.braised, bits: F.egg}, {kind: 'plate', r: 0.07, food: F.egg, bits: F.red}, {kind: 'bowl', r: 0.055, food: F.greens, bits: F.tofu, rim: F.celadon}, {kind: 'deep', r: 0.06, food: '#a8643a', bits: F.greens}],
  [{kind: 'plate', r: 0.085, food: F.greens, bits: F.egg}, {kind: 'bowl', food: F.red, bits: F.tofu}, {kind: 'plate', r: 0.07, food: F.braised, bits: F.greens, rim: F.celadon}, {kind: 'bowl', r: 0.055, food: F.egg, bits: F.greens}, {kind: 'deep', r: 0.06, food: '#d9a85a', bits: F.braised, rim: F.celadon}],
  [{kind: 'plate', r: 0.08, food: F.tofu, bits: F.red}, {kind: 'bowl', food: F.greens, bits: F.braised, rim: F.celadon}, {kind: 'plate', r: 0.07, food: F.braised, bits: F.egg}, {kind: 'bowl', r: 0.055, food: F.red, bits: F.greens}, {kind: 'deep', r: 0.06, food: '#b8743e', bits: F.egg}],
];
const SLOT: [number, number][] = [[-0.16, -0.08], [0.0, -0.1], [0.16, -0.07], [-0.09, 0.1], [0.1, 0.1]];
/** The 20 dishes in world positions on the four trays (tray top = y + 0.022). */
export const childDishes = (): Dish[] => TRAY_AT.flatMap((t, i) => TRAY_DISHES[i].map((d, k): Dish => ({...d, at: [t[0] + SLOT[k][0], t[1] + 0.022, t[2] + SLOT[k][1]]})));
