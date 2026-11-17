import {ell, hardFill, INK, inkLine} from '../../kit/draw';
import {mixColor, type Painter, type Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {flatCircle, hull} from '../../kit/world';
import {camDepth, camPoint, camUnit, type YCam} from '../../kit/ycam';
import {LIGHT_DAY} from '../crew';
import {paintMitten, TASTER_MITTEN} from '../demo';
import {LT, LT_BOWLS, paintHall} from '../hall';
import {coverLift, lerpPt} from '../motion22';
import {TABLE} from '../palette';
import {makeShot, type Shot22} from '../shot';
import {BOWL_A01, sheetMove, shotCam} from '../stage';

// B03-SH08 · G 562-674 (112 f) · the silver tag (EDU-EP22-SCENES-R1). Close on A01 (LT_BOWLS[1]); T's mitten and slate sleeve only (`new:
// cover-lift` one hand; demo.ts `paintMitten` with TASTER_MITTEN): enters from screen right l 0-4, lifts the cover up and out l 4-22 and sets it on
// the runner at its rest point (-3.35, 0.823, 1.85) by l 30, exits right l 30-40. The tag in the braised food reads from l 40.
const N = 112;
const M = sheetMove([-3.35, 0.86, 1.68], [22, 14], [0.38, 0.32], 1.02, {f: 1100, hy: 760, pitch: [-25, -25]});
const LIFT = {up: 9, carry: 17, approach: 4, leave: 10};
// R2 (SCENES-R2 fix 8; viewer note "the strip reads as a stick"): a shot-local metal read on A01's tag from l 36, over tableware.ts `paintTag`'s
// own quad (same world corners, no new geometry): a 2 px #5f6870 edge, the face lifted to cool silver #dfe6ee (R2b #eef2f6), a white streak at 0.85 opacity
// 0.003 m wide along the middle 70 % of the plate's long axis.
const TAG_FROM = 36;
const tagQuad = (): {q: V3[]; a: V3; b: V3} => {
  const bw = LT_BOWLS[BOWL_A01].at, at: V3 = [bw[0], LT.y + 0.003 + 0.054, bw[2]];
  const a: V3 = [at[0] - 0.008, at[1], at[2] + 0.01], b: V3 = [at[0] + 0.01, at[1] + 0.055, at[2] - 0.004], d: V3 = [0.01, 0, 0.003];
  return {a, b, q: [[a[0] - d[0], a[1], a[2] - d[2]], [b[0] - d[0], b[1], b[2] - d[2]], [b[0] + d[0], b[1], b[2] + d[2]], [a[0] + d[0], a[1], a[2] + d[2]]]};
};
/** Picture polygon shrunk by `px` toward its centroid along each vertex's bisector (a convex quad). */
const inset = (pts: Pt[], px: number): Pt[] => {
  const n = pts.length;
  return pts.map((v, i) => {
    const pv = pts[(i + n - 1) % n], nx = pts[(i + 1) % n];
    const e1 = [v[0] - pv[0], v[1] - pv[1]], e2 = [nx[0] - v[0], nx[1] - v[1]], l1 = Math.hypot(e1[0], e1[1]) || 1, l2 = Math.hypot(e2[0], e2[1]) || 1;
    // inward normals of both edges (sign from the polygon's winding), then the bisector scaled to keep both edges `px` inside
    const area = pts.reduce((s, p, k) => s + p[0] * pts[(k + 1) % n][1] - pts[(k + 1) % n][0] * p[1], 0), sg = area > 0 ? 1 : -1;
    const n1 = [-e1[1] / l1 * sg, e1[0] / l1 * sg], n2 = [-e2[1] / l2 * sg, e2[0] / l2 * sg], m = [n1[0] + n2[0], n1[1] + n2[1]], ml = Math.hypot(m[0], m[1]) || 1;
    const k = px / Math.max(0.3, (m[0] * n1[0] + m[1] * n1[1]) / ml);
    return [v[0] + (m[0] / ml) * k, v[1] + (m[1] / ml) * k] as Pt;
  });
};
const paintTagMetal = (p: Painter, c: YCam) => {
  const {q, a, b} = tagQuad(), px = q.map((v) => camPoint(c, v));
  if (px.some((v) => !v)) return;
  const poly = px as Pt[];
  hardFill(p, 26900, '#5f6870', poly);
  hardFill(p, 26901, '#eef2f6', inset(poly, 2));
  const L = (u: number, s: number): V3 => [a[0] + (b[0] - a[0]) * u + 0.0015 * s, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u + 0.00045 * s];
  const st = [L(0.15, -1), L(0.85, -1), L(0.85, 1), L(0.15, 1)].map((v) => camPoint(c, v));
  if (st.every(Boolean)) hardFill(p.layer(0.85, 26902 * 3), 26902, '#ffffff', st as Pt[]);
};
// R2b (W6.2 viewer check, "the lifted cover's white highlight fills the caption zone and reads as a second silver object"): A01's cover, held and
// at rest, is painted here instead of by tableware.ts `paintCover` (shared by every EP22 bowl, unchanged): same dome profile, rim ink, shade and
// contact shadow, but the body mid-grey #a7adb4 and the white shoulder blob replaced by a thin #c0c6cc rim light (luma 197, under the caption band's 200) along the lit (+x) silhouette,
// 0.5 rad of arc (at most about 7 % of the cover's width), so the tag stays the only white thing near the caption lines.
const COVER_BODY = '#a7adb4', COVER_RIM = '#c0c6cc';
const PROF: [number, number][] = [[0.085, 0], [0.082, 0.02], [0.07, 0.038], [0.05, 0.052], [0.02, 0.06]];
const domeAt = (at: V3, r: number, h: number, ph: number): V3 => [at[0] + r * Math.cos(ph), at[1] + h, at[2] + r * Math.sin(ph)];
const solid = (c: YCam, at: V3, prof: [number, number][], n = 16): Pt[] =>
  hull(prof.flatMap(([r, h]) => Array.from({length: n}, (_, i) => camPoint(c, domeAt(at, r, h, (i / n) * 6.283))).filter((q): q is Pt => !!q)));
const paintCoverSH08 = (p: Painter, c: YCam, seed: number, at: V3) => {
  const sil = solid(c, at, PROF);
  if (sil.length < 3) return;
  hardFill(p, seed, COVER_BODY, sil);
  const shade = solid(c, [at[0] - 0.03, at[1], at[2]], PROF.map(([r, h]) => [r * 0.78, h * 0.96] as [number, number]));
  if (shade.length >= 3) hardFill(p.layer(0.55, seed * 5 + 1), seed + 1, TABLE.silverShade, shade);
  // rim light: per profile ring the rightmost picture point (the lit silhouette) and the point 0.5 rad round toward the lens
  const outer: Pt[] = [], inner: Pt[] = [];
  for (const [r, h] of PROF.slice(0, 4)) {
    let best = 0, bx = -Infinity;
    for (let i = 0; i < 96; i++) { const q = camPoint(c, domeAt(at, r, h, (i / 96) * 6.283)); if (q && q[0] > bx) { bx = q[0]; best = (i / 96) * 6.283; } }
    const o = camPoint(c, domeAt(at, r, h, best));
    const a = domeAt(at, r, h, best + 0.5), b = domeAt(at, r, h, best - 0.5), n = camPoint(c, camDepth(c, a) < camDepth(c, b) ? a : b);
    if (o && n) { outer.push(o); inner.push(n); }
  }
  if (outer.length >= 2) hardFill(p, seed + 2, COVER_RIM, [...outer, ...inner.reverse()]);
  const k = camPoint(c, [at[0], at[1] + 0.068, at[2]]), u = camUnit(c, at);
  if (k) { hardFill(p, seed + 3, TABLE.silverShade, ell(k[0], k[1], 0.013 * u, 0.009 * u, 10)); hardFill(p, seed + 4, COVER_RIM, ell(k[0] + 0.004 * u, k[1] - 0.003 * u, 0.005 * u, 0.004 * u, 8)); }
  inkLine(p, seed + 5, sil, {weight: 0.7, color: mixColor(TABLE.silverShade, INK, 0.5), still: true});
  const rim = Array.from({length: 18}, (_, i) => camPoint(c, domeAt(at, 0.086, 0.004, (i / 18) * 6.283))).filter((q): q is Pt => !!q);
  if (rim.length >= 3) inkLine(p, seed + 6, rim, {weight: 0.5, color: TABLE.silverShade, still: true});
};
/** tableware.ts `contact` under the resting cover (soft, toward -x). */
const coverContact = (p: Painter, c: YCam, seed: number, at: V3) => {
  const q = flatCircle(c, [at[0] - 0.08 * 0.25, at[1] + 0.001, at[2]], 0.08 * 1.15, 16);
  if (q.length >= 3) hardFill(p.layer(0.35, seed * 3 + 7), seed, '#2a1410', q);
};
export const def: Shot22 = {
  id: 'B03-SH08', N,
  cam: (L) => shotCam(M, N, L, 0.05),
  paint: (p, L, c) => {
    const lf = coverLift(BOWL_A01, L, 4, LIFT);
    paintHall(p, c, {
      light: LIGHT_DAY,
      // A01's cover is always painted here (R2b, on the bowl l 0-4 too, so its look does not change at the lift), so the hall draws the bowl as
      // 'held' (food and tag, no cover; the cover painted after hides them while it is on)
      longTable: {covers: 'on', coverOf: (i) => (i === BOWL_A01 ? 'held' : 'on'), detailPx: 200},
      after: (q, cc) => {
        if (L >= TAG_FROM) paintTagMetal(q, cc);
        if (lf.state === 'off') coverContact(q, cc, 24100 + BOWL_A01 * 60 + 41, lf.cover);
        paintCoverSH08(q, cc, 24100 + BOWL_A01 * 60 + 10, lf.cover);
        const k = camPoint(cc, lf.knob);
        if (!k || lf.w <= 0) return;
        const off: Pt = [1260, k[1] + 140], pinch = lerpPt(off, k, lf.w);
        paintMitten(q, [pinch[0] + 6, pinch[1] - 4], camUnit(cc, lf.knob), 0.32, TASTER_MITTEN);
      },
    });
  },
};
export const shot = makeShot(def);
