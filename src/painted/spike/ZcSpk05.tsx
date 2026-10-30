import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {hash} from '../kit/hash';
import {mixColor, type Pt} from '../kit/painter';
import {ell, INK, placeAt} from '../zcpaint/ctx';
import {flatKit, type Flat} from '../zcpaint/sets';
import {section, SEC_2D, type Section} from '../zcpaint/space';
import {YOU, ZC_FACES} from '../zcpaint/cast';
import {paintSeatedFloor} from '../zcpaint/figure';
import {CaptionShade, Grade, Grain} from '../kit/screen';
import {Subtitles} from '../../scenes/Subtitles';
import {CHIN, FACES, HEAD_SPAN, paintHead, type Face} from './FaceSheet';
import {ellipse} from './ProportionSheet';
import {makePaint, paintHeadSide, type Paint} from './SideSheet';
import {paintBodyFront, type Cast} from './CastSheet';

// Film feasibility spike SPK-ZCP-05 (brief VB-ZCPAINT-SHORT-R2.5, 30 Oct 2026). Not production code: Boss ports what the
// user accepts. Answers the pass 5 look check: (1) cel shade, two tones, plus hard cast shadows from one key direction per
// shot, still flat and clean; (2) a ZCPAINT-only ~6-head body with the WORLD FOG decal heads (WORLD FOG code untouched);
// (3) arm-free B02-SH02 POV ("push done") and a B09-SH02B whose cabinet reads as a cabinet (grain, top lip, doors, knobs).
// Every value is a pure function of the frame. Washes (flatKit) for sets and shadows, textured fills for figures.

// ---------------------------------------------------------------------------------------------------------------------
// Light and shade helpers (proposed for Boss: `src/painted/zcpaint/light.ts`).

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c: number[]) => `#${c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
/** Multiply blend: `col` under a filter colour. */
const mul = (col: string, by: string) => {
  const a = rgb(col), b = rgb(by);
  return hex(a.map((v, i) => (v * b[i]) / 255));
};
/** Cel shade tone of a character or prop colour (one tone, cool plum multiply). */
export const cel = (col: string) => mul(col, '#bdb4c0');
/** Cast-shadow tone on a set surface (a little cooler and darker than the cel tone). */
export const castTone = (col: string) => mul(col, '#9f99b1');

const area = (p: Pt[]) => p.reduce((s, [x, y], i) => {
  const [x2, y2] = p[(i + 1) % p.length];
  return s + x * y2 - x2 * y;
}, 0) / 2;

/** Sutherland-Hodgman: `subject` clipped by the convex polygon `clip` (either winding). */
export const clipConvex = (subject: Pt[], clip: Pt[]): Pt[] => {
  const o = Math.sign(area(clip)) || 1;
  let out = subject;
  for (let i = 0; i < clip.length && out.length > 2; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length];
    const side = (p: Pt) => o * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]));
    const cut = (p: Pt, q: Pt): Pt => {
      const sp = side(p), sq = side(q), u = sp / (sp - sq);
      return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
    };
    const inp = out;
    out = [];
    for (let j = 0; j < inp.length; j++) {
      const cur = inp[j], prev = inp[(j + inp.length - 1) % inp.length];
      const ci = side(cur) >= 0, pi = side(prev) >= 0;
      if (ci) {
        if (!pi) out.push(cut(prev, cur));
        out.push(cur);
      } else if (pi) out.push(cut(prev, cur));
    }
  }
  return out;
};

const hull = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const p of s) {
    while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
    lo.push(p);
  }
  for (const p of [...s].reverse()) {
    while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
    up.push(p);
  }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
const shift = (pts: Pt[], [dx, dy]: Pt): Pt[] => pts.map(([x, y]) => [x + dx, y + dy]);
const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

// ---------------------------------------------------------------------------------------------------------------------
// Figures. A figure is a list of parts in local figure px (447 px/m, origin at the ground point, y down, facing +x for
// profiles). Parts are capsules and convex polygons in flat fills (washes: no texture, no blotch). A part with `cel`
// is painted first in the cel tone, then its lit side (the part clipped by itself shifted toward the light by `cel` px)
// in the base tone, then one ink outline. Parts turned from the light (far limbs, the neck under the head) are all cel.
// The same parts are the caster for cast shadows. The decal faces carry no shade (user: decal faces kept).

type Part = {col: string; pts: Pt[]; cel?: number; ink?: boolean; allShade?: boolean; head?: 'front' | 'side'};
type Fig = {parts: Part[]; head: {x: number; y: number; K: number; face: Face}; sil: Pt[][]};

/** A Paint (SideSheet interface) whose fills are flat washes; ink as WORLD FOG (rotring, boiling every 2 frames). */
const flatPaint = (ctx: PaintContext, base: number): Paint => {
  const {brush} = ctx;
  let seed = base, line = base + 900;
  const ink = (pts: Pt[], weight = 1.0, curve = 0.15, color = INK) => {
    ctx.boil(++line);
    brush.set('rotring', color, weight);
    brush.spline(pts, curve);
  };
  return {
    sil: false, t: ctx.t, id: base,
    fork: (o) => flatPaint(ctx, base + o),
    ink,
    part: (color, pts, outline = true) => {
      brush.seed(++seed);
      brush.noiseSeed(seed);
      brush.noStroke();
      brush.noFill();
      brush.wash(color, 255);
      brush.polygon(pts);
      brush.noWash();
      if (outline) ink([...pts, pts[0]]);
    },
  };
};

/** Paint a figure. `lt` is the light travel in local px (unit); figures use it flattened toward horizontal, so the cel
 *  tone reads as a side band (the far side) plus the underside. */
const drawFig = (ctx: PaintContext, p: Paint, c: Cast, fig: Fig, lt: Pt, cell: number) => {
  const n = Math.hypot(lt[0], 0.45 * lt[1]) || 1, l: Pt = [lt[0] / n, (0.45 * lt[1]) / n];
  for (const part of fig.parts) {
    if (part.head === 'front') {
      paintHead(ctx, cell, fig.head.x, fig.head.y, fig.head.K, fig.head.face, c.head, {blink: false});
      continue;
    }
    if (part.head === 'side') {
      paintHeadSide(p, fig.head.x, fig.head.y, fig.head.K, fig.head.face, c.head, {blink: false});
      continue;
    }
    if (part.allShade) {
      p.part(cel(part.col), part.pts, part.ink ?? true);
      continue;
    }
    if (part.cel && part.cel > 0) {
      p.part(cel(part.col), part.pts, false);
      const lit = clipConvex(part.pts, shift(part.pts, [-l[0] * part.cel, -l[1] * part.cel]));
      if (lit.length > 2) p.part(part.col, lit, false);
      if (part.ink ?? true) p.ink([...part.pts, part.pts[0]]);
    } else p.part(part.col, part.pts, part.ink ?? true);
  }
};

const H6 = 760 / 6; // one head at 447 px/m for a 1.70 m figure of 6 heads
const K6 = H6 / HEAD_SPAN;
const U = (x: number, up: number): Pt => [x * H6, -up * H6];
/** Capsule from a to b, radii r0/r1 (px): convex, rounded ends, so joints overlap without gaps. */
const capsule = (a: Pt, b: Pt, r0: number, r1: number, n = 7): Pt[] => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = ang + Math.PI / 2 + (i / n) * Math.PI;
    pts.push([a[0] + r0 * Math.cos(t), a[1] + r0 * Math.sin(t)]);
  }
  for (let i = 0; i <= n; i++) {
    const t = ang - Math.PI / 2 + (i / n) * Math.PI;
    pts.push([b[0] + r1 * Math.cos(t), b[1] + r1 * Math.sin(t)]);
  }
  return pts;
};
/** Capsule in head units: widths w0/w1 are diameters in heads. */
const C = (a: Pt, b: Pt, w0: number, w1: number) => capsule(a, b, (w0 * H6) / 2, (w1 * H6) / 2);
const E = (x: number, up: number, rx: number, ry: number, n = 18) => ellipse(x * H6, -up * H6, rx * H6, ry * H6, n);
const at = (a: Pt, b: Pt, u: number): Pt => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
/** Mitten hand (WORLD FOG language) with a thumb: a rounded paddle along the forearm direction. */
const mitten = (wrist: Pt, dir: Pt, s: number): Pt[] => {
  const n = Math.hypot(dir[0], dir[1]) || 1, d: Pt = [dir[0] / n, dir[1] / n];
  return capsule([wrist[0] + d[0] * 0.06 * s, wrist[1] + d[1] * 0.06 * s], [wrist[0] + d[0] * 0.3 * s, wrist[1] + d[1] * 0.3 * s], 0.105 * s, 0.11 * s);
};

/** Front view, 6 heads (1.70 m), standing. */
export const front6 = (c: Cast, face: Face = FACES[0]): Fig => {
  const o = c.outfit, sk = c.head.skin, parts: Part[] = [];
  for (const s of [-1, 1]) {
    parts.push({col: sk, pts: C(U(s * 0.27, 1.95), U(s * 0.25, 0.2), 0.36, 0.23), cel: 0.13 * H6});
    parts.push({col: sk, pts: E(s * 0.3, 0.07, 0.17, 0.075), cel: 0.06 * H6});
  }
  for (const s of [-1, 1]) parts.push({col: o.pants, pts: C(U(s * 0.3, 2.95), U(s * 0.29, 2.04), 0.5, 0.42), cel: 0.18 * H6});
  parts.push({col: o.pants, pts: [U(-0.66, 3.3), U(0.66, 3.3), U(0.62, 2.62), U(-0.62, 2.62)], cel: 0.36 * H6});
  for (const s of [-1, 1]) {
    const sh = U(s * 0.74, 4.42), el = U(s * 0.9, 3.56), wr = U(s * 0.93, 2.68);
    parts.push({col: sk, pts: C(sh, el, 0.32, 0.27), cel: 0.12 * H6});
    parts.push({col: sk, pts: C(el, wr, 0.27, 0.21), cel: 0.1 * H6});
    parts.push({col: sk, pts: mitten(wr, [0.02, 1], 1.25 * H6), cel: 0.09 * H6});
  }
  parts.push({col: o.shirt, pts: [U(-0.58, 4.78), U(0.58, 4.78), U(0.78, 4.6), U(0.66, 3.0), U(-0.66, 3.0), U(-0.78, 4.6)], cel: 0.46 * H6});
  for (const s of [-1, 1]) parts.push({col: o.sleeve, pts: C(U(s * 0.68, 4.56), U(s * 0.84, 4.02), 0.38, 0.34), cel: 0.14 * H6});
  parts.push({col: sk, pts: C(U(0, 4.7), U(0, 4.98), 0.3, 0.28), allShade: true, ink: false});
  parts.push({col: sk, pts: [], head: 'front'});
  const sil = parts.filter((q) => q.pts.length > 2).map((q) => q.pts);
  const head = {x: 0, y: -5 * H6 - CHIN * K6, K: K6, face};
  sil.push(ellipse(head.x, head.y - 0.08 * K6, 1.08 * K6, 1.25 * K6, 18));
  return {parts, head, sil};
};

/** Profile, 6 heads, mid-stride, facing +x. */
export const side6 = (c: Cast, face: Face = FACES[0], stride = 1): Fig => {
  const o = c.outfit, sk = c.head.skin, parts: Part[] = [];
  const hip = U(0, 3.0), a = 0.34 * stride;
  const kneeN: Pt = [hip[0] + Math.sin(a) * 1.4 * H6, hip[1] + Math.cos(a) * 1.4 * H6];
  const kneeF: Pt = [hip[0] - Math.sin(a * 0.7) * 1.4 * H6, hip[1] + Math.cos(a * 0.7) * 1.4 * H6];
  const ankN: Pt = [kneeN[0] - 0.12 * H6, -0.16 * H6], ankF: Pt = [kneeF[0] - 0.4 * H6, -0.24 * H6];
  const foot = (ank: Pt, lift: number): Pt[] => [[ank[0] - 0.13 * H6, ank[1] - 0.06 * H6], [ank[0] + 0.12 * H6, ank[1] - 0.1 * H6], [ank[0] + 0.46 * H6, -0.04 * H6 - lift], [ank[0] + 0.46 * H6, -lift * 0.5], [ank[0] - 0.13 * H6, 0.02 * H6 - lift * 0.2]];
  // Far side, turned from the light: all in the cel tone.
  const shF = U(0.02, 4.45), wrF = U(0.42, 2.78), elF: Pt = [0.26 * H6, -3.6 * H6];
  parts.push({col: sk, pts: C(elF, wrF, 0.27, 0.21), allShade: true});
  parts.push({col: sk, pts: mitten(wrF, [0.35, 1], 1.25 * H6), allShade: true});
  parts.push({col: sk, pts: C(shF, elF, 0.32, 0.27), allShade: true});
  parts.push({col: sk, pts: C(kneeF, ankF, 0.35, 0.22), allShade: true});
  parts.push({col: sk, pts: foot(ankF, 0.1 * H6), allShade: true});
  parts.push({col: o.pants, pts: C(hip, at(hip, kneeF, 0.8), 0.5, 0.42), allShade: true});
  // Shorts seat and the tee (one convex profile block).
  parts.push({col: o.pants, pts: [U(-0.44, 3.24), U(0.32, 3.24), U(0.38, 2.74), U(-0.46, 2.66)], cel: 0.3 * H6});
  parts.push({col: o.shirt, pts: [U(-0.34, 4.72), U(0.12, 4.78), U(0.38, 4.36), U(0.36, 3.5), U(0.32, 2.96), U(-0.42, 2.96), U(-0.42, 3.9)], cel: 0.34 * H6});
  // Near leg.
  parts.push({col: sk, pts: C(kneeN, ankN, 0.36, 0.22), cel: 0.12 * H6});
  parts.push({col: sk, pts: foot(ankN, 0), cel: 0.05 * H6});
  parts.push({col: o.pants, pts: C(hip, at(hip, kneeN, 0.8), 0.52, 0.44), cel: 0.18 * H6});
  // Near arm swings back.
  const shN = U(-0.06, 4.42), elN: Pt = [-0.22 * H6, -3.56 * H6], wrN = U(-0.36, 2.76);
  parts.push({col: sk, pts: C(shN, elN, 0.32, 0.27), cel: 0.12 * H6});
  parts.push({col: sk, pts: C(elN, wrN, 0.27, 0.21), cel: 0.1 * H6});
  parts.push({col: sk, pts: mitten(wrN, [-0.15, 1], 1.25 * H6), cel: 0.09 * H6});
  parts.push({col: o.sleeve, pts: C(U(-0.04, 4.52), at(shN, elN, 0.55), 0.42, 0.36), cel: 0.16 * H6});
  // Neck in the head's shadow, then the profile head.
  parts.push({col: sk, pts: C(U(0.02, 4.62), U(0.08, 4.92), 0.3, 0.28), cel: 0.14 * H6, ink: false});
  parts.push({col: sk, pts: [], head: 'side'});
  const head = {x: 0.1 * H6, y: -5.0 * H6 - CHIN * K6, K: K6, face};
  const sil = parts.filter((q) => q.pts.length > 2).map((q) => q.pts);
  sil.push(ellipse(head.x - 0.1 * K6, head.y - 0.05 * K6, 1.12 * K6, 1.2 * K6, 18));
  return {parts, head, sil};
};

/** Seated on the floor hugging the knees (B09), 6 heads, profile facing +x. */
export const seatHug6 = (c: Cast, face: Face = ZC_FACES.neutral ?? FACES[0]): Fig => {
  const o = c.outfit, sk = c.head.skin, parts: Part[] = [];
  const hip = U(0, 0.44), knee = U(0.9, 1.6), ank = U(1.22, 0.16), sh = U(0.34, 2.04);
  const foot: Pt[] = [[ank[0] - 0.13 * H6, ank[1] - 0.06 * H6], [ank[0] + 0.12 * H6, ank[1] - 0.1 * H6], [ank[0] + 0.48 * H6, -0.04 * H6], [ank[0] + 0.48 * H6, 0], [ank[0] - 0.13 * H6, 0.02 * H6]];
  // Far leg and far arm (cel), torso, near leg, clasped hands in front of the shins, near arm.
  parts.push({col: sk, pts: C([knee[0] - 0.06 * H6, knee[1]], [ank[0] - 0.08 * H6, ank[1]], 0.32, 0.21), allShade: true});
  parts.push({col: sk, pts: shift(foot, [-0.08 * H6, 0]), allShade: true});
  parts.push({col: o.pants, pts: C([hip[0] - 0.04 * H6, hip[1]], [knee[0] - 0.06 * H6, knee[1]], 0.62, 0.42), allShade: true});
  parts.push({col: o.pants, pts: [U(-0.46, 0.74), U(0.3, 0.5), U(0.36, 0.04), U(-0.42, 0.02)], cel: 0.24 * H6});
  parts.push({col: o.shirt, pts: [U(-0.42, 0.62), U(0.36, 0.5), U(0.66, 1.9), U(0.12, 2.18), U(-0.16, 2.1)], cel: 0.34 * H6});
  const hands = U(1.36, 1.22);
  const elF = U(0.62, 1.32);
  parts.push({col: sk, pts: C([sh[0] - 0.04 * H6, sh[1]], elF, 0.26, 0.22), allShade: true});
  parts.push({col: sk, pts: C(knee, ank, 0.34, 0.21), cel: 0.12 * H6});
  parts.push({col: sk, pts: foot, cel: 0.05 * H6});
  parts.push({col: o.pants, pts: C(hip, at(hip, knee, 0.86), 0.64, 0.46), cel: 0.2 * H6});
  parts.push({col: sk, pts: ellipse(knee[0] + 0.06 * H6, knee[1], 0.2 * H6, 0.19 * H6, 14), cel: 0.08 * H6});
  // Forearms cross in front of the shins just below the knees; hands clasped as closed fists.
  const elN = U(0.56, 1.24);
  parts.push({col: sk, pts: C(sh, elN, 0.27, 0.23), cel: 0.1 * H6});
  parts.push({col: o.sleeve, pts: C([sh[0], sh[1] + 0.04 * H6], at(sh, elN, 0.5), 0.46, 0.38), cel: 0.16 * H6});
  parts.push({col: sk, pts: C(elN, hands, 0.23, 0.2), cel: 0.09 * H6});
  parts.push({col: sk, pts: ellipse(hands[0] + 0.05 * H6, hands[1] - 0.02 * H6, 0.15 * H6, 0.13 * H6, 14), cel: 0.06 * H6});
  parts.push({col: sk, pts: C([sh[0] + 0.04 * H6, sh[1] + 0.06 * H6], [sh[0] + 0.14 * H6, sh[1] - 0.22 * H6], 0.3, 0.28), cel: 0.14 * H6, ink: false});
  parts.push({col: sk, pts: [], head: 'side'});
  const head = {x: sh[0] + 0.24 * H6, y: sh[1] - 0.26 * H6 - CHIN * K6, K: K6, face};
  const sil = parts.filter((q) => q.pts.length > 2).map((q) => q.pts);
  sil.push(ellipse(head.x - 0.1 * K6, head.y - 0.05 * K6, 1.12 * K6, 1.2 * K6, 18));
  return {parts, head, sil};
};
// ---------------------------------------------------------------------------------------------------------------------
// Section cast shadows: a key light travelling along L = (dY, dz, dd) in ZC-UNIT metres. Receivers are planar rectangles
// (floor z = 0, back wall d = BACK); each caster polygon is projected onto each receiver plane, clipped to the receiver
// rectangle in plane coordinates and painted in the receiver's shadow tone (correct for the room's convex corners).

type V3 = [number, number, number]; // (Y, z, d)
type Receiver = {plane: 'floor' | 'back'; r: [number, number, number, number]; col: string};
const BACK = 3.2;

const toFloor = ([Y, z, d]: V3, l: V3): Pt => {
  const t = z / -l[1];
  return [Y + l[0] * t, d + l[2] * t];
};
const toBack = ([Y, z, d]: V3, l: V3): Pt => {
  const t = (BACK - d) / l[2];
  return [Y + l[0] * t, z + l[1] * t];
};

const castPolys = (f: Flat, S: Section, l: V3, recv: Receiver[], casters: V3[][], convex: boolean) => {
  for (const rc of recv) {
    const [a0, a1, b0, b1] = rc.r;
    const box = rect(a0, b0, a1, b1);
    for (const cs of casters) {
      let q = cs.map((v) => (rc.plane === 'floor' ? toFloor(v, l) : toBack(v, l)));
      if (convex) q = hull(q);
      const c = clipConvex(q, box);
      if (c.length < 3) continue;
      f.fill(rc.col, c.map(([u, v]) => (rc.plane === 'floor' ? S.P(u, 0, v) : S.P(u, v, BACK))));
    }
  }
};
const boxCorners = ([y0, y1]: [number, number], [d0, d1]: [number, number], [z0, z1]: [number, number]): V3[] => {
  const out: V3[] = [];
  for (const y of [y0, y1]) for (const d of [d0, d1]) for (const z of [z0, z1]) out.push([y, z, d]);
  return out;
};

/** A box seen by the section camera with two-tone light from +Y: top lit, +Y side lit, -Y side cel, front base. */
const box2 = (f: Flat, S: Section, [y0, y1]: [number, number], [d0, d1]: [number, number], [z0, z1]: [number, number], col: {front: string; top: string; side: string}, ink = true) => {
  const {P} = S;
  const xl = P(y0, z1, d0)[0], xr = P(y1, z1, d0)[0];
  if (xr < 540) f.fill(col.side, [P(y1, z1, d0), P(y1, z1, d1), P(y1, z0, d1), P(y1, z0, d0)]);
  if (xl > 540) f.fill(cel(col.side), [P(y0, z1, d0), P(y0, z1, d1), P(y0, z0, d1), P(y0, z0, d0)]);
  if (P(y0, z1, d0)[1] > S.sec.vp[1]) f.fill(col.top, [P(y0, z1, d0), P(y1, z1, d0), P(y1, z1, d1), P(y0, z1, d1)]);
  const front = [P(y0, z1, d0), P(y1, z1, d0), P(y1, z0, d0), P(y0, z0, d0)];
  f.fill(col.front, front);
  if (ink) f.line(front, 0.9);
};

// Palette for the spike room (blackout day, B04): a warm cream unit, one accent per room, cool plum shadows.
const PAL = {
  neighbour: '#2b2724', cap: '#22201f', capEdge: '#4a433b',
  wallEntry: '#a99a80', wallBath: '#e3d7bd', tile: '#a9c2ba', tileLine: '#c9dbd4', floorBath: '#9a876c', floorEntry: '#7f7060', grout: '#cfc2a8',
  ceiling: '#cdbf9f', partition: '#d6c8aa', white: '#efece4', whiteTop: '#fbf9f3', whiteSide: '#d9d4c8', wood: '#b48a5c', woodTop: '#caa274',
  mirror: '#c9d6d6', plant: '#5d7f4e', plantDark: '#3f5c37', pot: '#c06a46', towel: '#d29b3e', mat: '#b4654a', curtain: '#e8e2d6', curtainStripe: '#8fb0ad',
  window: '#f2f1e6', glow: '#fff6dc',
};

/** Spike B04-SH01 frame: the bathroom with the shower running, section `SEC-2D` at Yc 2.3, him at Y 2.2, d 0.75. */
export const paintB04Lit = (ctx: PaintContext, pf: number) => {
  const S = section(SEC_2D, 2.3);
  const {P} = S;
  const f = flatKit(ctx, 51000);
  // Key: daylight from the balcony end (+Y, screen right), high, travelling left, down and a little into the room.
  const l: V3 = [-0.4, -0.65, 0.5];
  const top = SEC_2D.floorY - 2.85 * SEC_2D.U, bot = SEC_2D.floorY + 0.25 * SEC_2D.U;
  // Neighbours.
  f.fill(PAL.neighbour, [[-100, -100], [1200, -100], [1200, top], [-100, top]]);
  f.fill(PAL.neighbour, [[-100, bot], [1200, bot], [1200, 2100], [-100, 2100]]);
  // Entry slice (door end, darkest).
  const room = (y0: number, y1: number, wall: string, floor: string) => {
    f.fill(wall, [P(y0, 2.6, BACK), P(y1, 2.6, BACK), P(y1, 0, BACK), P(y0, 0, BACK)]);
    f.fill(floor, [P(y0, 0, 0), P(y1, 0, 0), P(y1, 0, BACK), P(y0, 0, BACK)]);
    f.fill(mul(PAL.ceiling, '#d8d0cc'), [P(y0, 2.6, 0), P(y1, 2.6, 0), P(y1, 2.6, BACK), P(y0, 2.6, BACK)]);
  };
  room(0.18, 1.5, PAL.wallEntry, PAL.floorEntry);
  f.fill(mul(PAL.wallEntry, '#9a8f8a'), [P(0.18, 0.12, BACK), P(1.5, 0.12, BACK), P(1.5, 0, BACK), P(0.18, 0, BACK)]);
  // Entry: wall-hung shoe shelf and a jacket on a hook (props read as silhouettes in the dim end).
  f.fill(mul(PAL.wood, '#8a8090'), [P(0.6, 1.25, BACK - 0.02), P(1.2, 1.25, BACK - 0.02), P(1.2, 1.2, BACK - 0.3), P(0.6, 1.2, BACK - 0.3)]);
  f.fill('#3b4a52', [P(1.05, 1.9, BACK - 0.05), P(1.32, 1.9, BACK - 0.05), P(1.36, 1.2, BACK - 0.08), P(1.0, 1.24, BACK - 0.08)]);
  f.line([P(1.05, 1.9, BACK - 0.05), P(1.32, 1.9, BACK - 0.05), P(1.36, 1.2, BACK - 0.08), P(1.0, 1.24, BACK - 0.08)], 0.7);
  // Bathroom slice: tile wainscot to 1.2 m, cream above, small floor tiles.
  // Kitchenette sliver beyond P2 (the light's side): the brightest room, a window patch on its back wall.
  room(3.4, 4.6, '#eee3c7', '#a8946f');
  f.fill('#fbf6e6', [P(3.7, 2.2, BACK), P(4.3, 2.2, BACK), P(4.3, 1.3, BACK), P(3.7, 1.3, BACK)]);
  f.fill('#b48a5c', [P(3.4, 0.9, 2.6), P(4.6, 0.9, 2.6), P(4.6, 0, 2.6), P(3.4, 0, 2.6)]);
  f.fill('#d8b98c', [P(3.4, 0.9, 2.6), P(4.6, 0.9, 2.6), P(4.6, 0.9, BACK), P(3.4, 0.9, BACK)]);
  room(1.6, 3.3, PAL.wallBath, PAL.floorBath);
  // Ceiling fixture (off in the blackout): a flat disc, no glow.
  f.fill('#e9e3d4', ell(P(2.4, 2.6, 1.4)[0], P(2.4, 2.6, 1.4)[1] + 3, 46, 9, 16));
  f.line(ell(P(2.4, 2.6, 1.4)[0], P(2.4, 2.6, 1.4)[1] + 3, 46, 9, 16), 0.6);
  f.fill(PAL.tile, [P(1.6, 1.2, BACK), P(3.3, 1.2, BACK), P(3.3, 0, BACK), P(1.6, 0, BACK)]);
  for (let y = 1.75; y < 3.3; y += 0.15) f.line([P(y, 1.2, BACK), P(y, 0, BACK)], 0.35, PAL.tileLine, false);
  for (let z = 0.15; z < 1.2; z += 0.15) f.line([P(1.6, z, BACK), P(3.3, z, BACK)], 0.35, PAL.tileLine, false);
  f.fill(mul(PAL.tile, '#d8e4e0'), [P(1.6, 1.24, BACK), P(3.3, 1.24, BACK), P(3.3, 1.2, BACK), P(1.6, 1.2, BACK)]); // tile cap
  for (let y = 1.6; y <= 3.3; y += 0.3) f.line([P(y, 0, 0.02), P(y, 0, BACK)], 0.35, PAL.grout, false);
  for (let d = 0.3; d < BACK; d += 0.3) f.line([P(1.6, 0, d), P(3.3, 0, d)], 0.35, PAL.grout, false);
  // Louvre window (frosted, slats) high on the back wall: the brightest set value, no glow layer.
  const win = [P(2.05, 2.35, BACK), P(2.6, 2.35, BACK), P(2.6, 1.85, BACK), P(2.05, 1.85, BACK)];
  f.fill(PAL.window, win);
  for (let z = 1.93; z < 2.35; z += 0.08) f.line([P(2.05, z, BACK), P(2.6, z, BACK)], 0.4, '#b9bcb4', false);
  f.line(win, 0.8);
  // Mirror over the vanity, towel on a ring, shower rail with a striped curtain bunched at the right.
  
  f.line([P(3.02, 2.05, 0.5), P(3.02, 2.05, BACK)], 0.9, '#8d8a84', false);
  const cur: Pt[] = [P(3.06, 2.04, 0.55), P(3.28, 2.04, 0.55), P(3.28, 0.25, 0.6), P(3.04, 0.25, 0.6)];
  f.fill(PAL.curtain, cur);
  for (const y of [3.1, 3.17, 3.24]) f.line([P(y, 2.02, 0.56), P(y, 0.27, 0.6)], 0.9, PAL.curtainStripe, false);
  f.line(cur, 0.8);
  // Shower tap on the back wall and the running stream (B04 story beat).
  const tap = P(2.98, 1.05, BACK - 0.05);
  f.fill('#9aa3a8', ell(tap[0], tap[1], 7, 7, 10));
  for (const [y, w] of [[2.96, 0], [2.99, 1], [3.02, 2]] as const) {
    const pts: Pt[] = [];
    for (let i = 0; i <= 10; i++) pts.push(P(y + 0.012 * Math.sin(i * 1.3 + w + pf * 0.6), 1.0 - (1.0 * i) / 10, BACK - 0.08));
    f.line(pts, 1.1, '#e6f2f6', false);
  }
  // Bath mat (accent) on the floor.
  const mat = [P(2.0, 0, 1.0), P(2.65, 0, 1.0), P(2.65, 0, 1.7), P(2.0, 0, 1.7)];
  f.fill(PAL.mat, mat);
  for (let i = 1; i < 6; i++) f.line([P(2.0 + 0.11 * i, 0, 1.0), P(2.0 + 0.11 * i, 0, 1.7)], 0.3, mul(PAL.mat, '#d6b8b0'), false);
  // Cast shadows on the floor and back wall: vanity, toilet, him.
  const recv: Receiver[] = [
    {plane: 'floor', r: [1.6, 3.3, 0, BACK], col: castTone(PAL.floorBath)},
    {plane: 'floor', r: [2.0, 2.65, 1.0, 1.7], col: castTone(PAL.mat)},
    {plane: 'back', r: [1.6, 3.3, 0, 1.2], col: castTone(PAL.tile)},
    {plane: 'back', r: [1.6, 3.3, 1.24, 2.6], col: castTone(PAL.wallBath)},
    {plane: 'floor', r: [0.18, 1.5, 0, 0.9], col: castTone(PAL.floorEntry)},
  ];
  const vanity = boxCorners([1.7, 2.2], [2.7, 3.2], [0, 0.85]);
  const toilet = [...boxCorners([2.42, 2.76], [2.55, 3.2], [0, 0.42]), ...boxCorners([2.45, 2.73], [3.0, 3.2], [0.42, 0.82])];
  const mirror = boxCorners([1.76, 2.0], [3.06, 3.2], [1.32, 1.82]);
  const towel = boxCorners([2.86, 3.02], [3.08, 3.14], [1.0, 1.5]);
  castPolys(f, S, l, recv, [vanity, toilet, mirror, towel], true);
  // Him: the 6-head profile walking toward the tap (+Y). His shadow from his parts.
  const figY = 2.75, figD = 0.75, k = S.pxPerM(figD) / 447;
  const fig = side6(YOU, ZC_FACES.neutral, 0.8);
  const toW = ([x, y]: Pt): V3 => [figY + x / 447, -y / 447, figD];
  // The cut-out figure is given a body depth of 0.24 m for its shadow (both faces of the silhouette, hulled).
  castPolys(f, S, l, recv, fig.sil.map((poly) => [...poly.map(toW).map(([y, z, d]): V3 => [y, z, d - 0.12]), ...poly.map(toW).map(([y, z, d]): V3 => [y, z, d + 0.12])]), true);
  // Fixtures (behind him), two-tone. Mirror cabinet and towel stand off the wall, so they are painted after their shadows.
  box2(f, S, [1.76, 2.0], [3.06, 3.2], [1.32, 1.82], {front: mul(PAL.wood, '#e0d0c0'), top: PAL.woodTop, side: PAL.woodTop});
  f.fill(PAL.mirror, [P(1.79, 1.79, 3.06), P(1.97, 1.79, 3.06), P(1.97, 1.35, 3.06), P(1.79, 1.35, 3.06)]);
  f.line([P(1.82, 1.74, 3.06), P(1.9, 1.62, 3.06)], 0.6, '#eef4f2', false);
  f.fill(PAL.towel, [P(2.86, 1.5, 3.08), P(3.02, 1.5, 3.08), P(3.02, 1.0, 3.08), P(2.86, 1.0, 3.08)]);
  f.fill(cel(PAL.towel), [P(2.86, 1.5, 3.08), P(2.9, 1.5, 3.08), P(2.9, 1.0, 3.08), P(2.86, 1.0, 3.08)]);
  f.line([P(2.86, 1.5, 3.08), P(3.02, 1.5, 3.08), P(3.02, 1.0, 3.08), P(2.86, 1.0, 3.08), P(2.86, 1.5, 3.08)], 0.7);
  box2(f, S, [1.7, 2.2], [2.7, 3.2], [0, 0.85], {front: PAL.wood, top: PAL.white, side: PAL.woodTop});
  f.fill(PAL.white, ell(P(1.97, 0.86, 2.95)[0], P(1.97, 0.86, 2.95)[1], 34, 7, 14));
  f.line([P(1.97, 0.86, 2.7), P(1.97, 0.4, 2.7)], 0.6, mul(PAL.wood, '#8a7a70'), false);
  // Plant on the vanity (green accent) with a terracotta pot.
  const pp = P(2.1, 0.85, 2.85);
  f.fill(PAL.pot, [[pp[0] - 14, pp[1] - 30], [pp[0] + 14, pp[1] - 30], [pp[0] + 10, pp[1]], [pp[0] - 10, pp[1]]]);
  for (let i = 0; i < 7; i++) {
    const a = -2.6 + i * 0.36 + 0.03 * Math.sin(pf * 0.05 + i);
    const tip: Pt = [pp[0] + Math.cos(a) * (36 + 10 * hash(i + 3)), pp[1] - 30 + Math.sin(a) * (34 + 12 * hash(i + 9))];
    f.fill(i % 2 ? PAL.plant : PAL.plantDark, [[pp[0], pp[1] - 30], [tip[0] - 6, tip[1] + 4], tip, [tip[0] + 6, tip[1] + 6]]);
  }
  box2(f, S, [2.42, 2.76], [2.55, 3.2], [0, 0.42], {front: PAL.white, top: PAL.whiteTop, side: PAL.whiteSide});
  box2(f, S, [2.45, 2.73], [3.0, 3.2], [0.42, 0.82], {front: PAL.white, top: PAL.whiteTop, side: PAL.whiteSide});
  // Partitions (edge-on faces) and the lintel caps.
  const partition = (y: number) => {
    const lit = P(y, 0, 0)[0] < 540;
    const col = lit ? PAL.partition : cel(PAL.partition);
    f.fill(col, [P(y, 2.6, 0.9), P(y, 2.6, BACK), P(y, 0, BACK), P(y, 0, 0.9)]);
    f.fill(col, [P(y, 2.6, 0), P(y, 2.6, 0.9), P(y, 2.05, 0.9), P(y, 2.05, 0)]);
  };
  partition(1.6);
  partition(3.3);
  // Him.
  const [gx, gy] = P(figY, 0, figD);
  const lt = (() => {
    const x = l[0], y = -l[1], n = Math.hypot(x, y);
    return [x / n, y / n] as Pt;
  })();
  placeAt(ctx.brush, gx, gy, k, 1, () => drawFig(ctx, flatPaint(ctx, 52000), YOU, fig, lt, 520));
  // Caps (poché) with a thin warm edge line.
  const x = (y: number) => P(y, 0, 0)[0];
  f.fill(PAL.cap, [[-100, P(0, 2.6, 0)[1]], [1200, P(0, 2.6, 0)[1]], [1200, top], [-100, top]]);
  f.fill(PAL.cap, [[-100, SEC_2D.floorY], [1200, SEC_2D.floorY], [1200, bot], [-100, bot]]);
  for (const [a, b] of [[1.5, 1.6], [3.3, 3.4]] as const) f.fill(PAL.cap, [P(a, 2.6, 0), P(b, 2.6, 0), P(b, 2.05, 0), P(a, 2.05, 0)]);
  f.line([[-100, P(0, 2.6, 0)[1]], [1200, P(0, 2.6, 0)[1]]], 0.6, PAL.capEdge, false);
  f.line([[-100, SEC_2D.floorY], [1200, SEC_2D.floorY]], 0.6, PAL.capEdge, false);
  void x;
};

// ---------------------------------------------------------------------------------------------------------------------
// Proportion sheet: 4-head WORLD FOG body (unchanged code) next to the 6-head ZCPAINT body, same 1.70 m, same floor.

export const paintBodies = (ctx: PaintContext) => {
  const {brush} = ctx;
  const f = flatKit(ctx, 61000);
  f.fill('#e7dcc6', rect(-10, -10, 1090, 1930));
  for (const g of [930, 1820]) f.fill('#cbbd9f', rect(-10, g, 1090, g + 6));
  const k = 0.8, lt: Pt = [-0.64, 0.77];
  // Head-unit ticks for the 6-head figure (1.70 m = 6 x 0.283 m) and the 4-head figure (4 x 0.425 m).
  for (let i = 0; i <= 6; i++) f.line([[548, 930 - i * H6 * k], [578, 930 - i * H6 * k]], 0.6, '#8c7f68', false);
  for (let i = 0; i <= 4; i++) f.line([[40, 930 - i * 190 * k], [70, 930 - i * 190 * k]], 0.6, '#8c7f68', false);
  // Row 1: 4-head front (WORLD FOG paintBodyFront), 6-head front, 6-head profile.
  placeAt(brush, 190, 930, k, 1, () => paintBodyFront(ctx, YOU, 0, 0, 0, {blink: false}));
  // Floor cast shadows for the 6-head figures (light from the upper right): a flat skewed shadow on the floor line.
  const floorShadow = (gx: number, w: number) => f.fill(castTone('#e7dcc6'), [[gx - w, 930], [gx + w, 930], [gx - w - 150, 960], [gx - w - 210, 960]]);
  floorShadow(440, 60);
  floorShadow(820, 50);
  placeAt(brush, 440, 930, k, 1, () => drawFig(ctx, flatPaint(ctx, 62000), YOU, front6(YOU), lt, 621));
  placeAt(brush, 820, 930, k, 1, () => drawFig(ctx, flatPaint(ctx, 63000), YOU, side6(YOU, FACES[0], 0.8), lt, 631));
  // Row 2: 4-head seated (Boss figure.ts), 6-head seated hugging the knees.
  placeAt(brush, 230, 1820, k, 1, () => paintSeatedFloor(makePaint(ctx, 64000), YOU, 0, 0, {face: ZC_FACES.neutral}));
  f.fill(castTone('#e7dcc6'), [[600, 1820], [860, 1820], [700, 1850], [480, 1850]]);
  placeAt(brush, 640, 1820, k, 1, () => drawFig(ctx, flatPaint(ctx, 65000), YOU, seatHug6(YOU), lt, 651));
};

// ---------------------------------------------------------------------------------------------------------------------
// B02-SH02 POV R2.5: arms out, the cabinet already against the door ("push done"). The last shove lands at pf 0-6 (the
// cabinet travels its last 24 px with a 1.5 % camera lurch, flush thud at pf 6), then it wobbles and settles; the door
// jolts on the pounding. Key light: the entry ceiling lamp above, just in front of the door: horizontal surfaces lit,
// the cabinet front in the cel tone (caption sits there), small hard shadows under every edge.

const WOOD = {top: '#d2b083', lip: '#e6c899', front: '#8f6e4b', grain: '#8f6f4a', knob: '#4a3a2c'};
const DOOR = {leaf: '#cdbd9c', panel: '#c2b190', jamb: '#ddd0b4', wall: '#e3d6ba', line: '#f3f6f2'};

const easeOut = (x: number) => 1 - (1 - Math.max(0, Math.min(1, x))) ** 3;
/** Pound jolts (spike list): door offset x at pf. */
const joltAt = (pf: number) => {
  const hits = [24, 37, 49, 60, 74, 86];
  let x = 0;
  for (const h of hits) {
    const t = pf - h;
    if (t >= 0 && t < 6) x += (8 + 4 * hash(h)) * Math.exp(-t * 0.7) * (t % 2 === 0 ? 1 : -0.6);
  }
  return x;
};

/** Cabinet face-on with grain, top lip, two doors, knobs; `top` = near top edge y; light from above (lip lit). */
const cabinetFront = (f: Flat, x0: number, x1: number, yTop: number, yBot: number, dark: (c: string) => string, o: {topFar?: number; farInset?: number} = {}) => {
  // Top surface (visible when the eye is above it).
  if (o.topFar !== undefined) {
    const inset = o.farInset ?? 40;
    const topPts: Pt[] = [[x0 + inset, o.topFar], [x1 - inset, o.topFar], [x1 + 6, yTop], [x0 - 6, yTop]];
    f.fill(dark(WOOD.top), topPts);
    for (let i = 1; i < 9; i++) {
      const u = i / 9, a = x0 - 6 + (x1 - x0 + 12) * u, b = x0 + inset + (x1 - x0 - 2 * inset) * u;
      f.line([[b, o.topFar + 2], [a + 6 * Math.sin(i * 2.1), (o.topFar + yTop) / 2], [a, yTop - 2]], 0.6, dark(WOOD.grain), false);
    }
    f.line([...topPts, topPts[0]], 0.8);
  }
  // Lip: the top slab's front edge, lit (the only bright edge), with the overhang's hard shadow under it.
  f.fill(dark(WOOD.lip), [[x0 - 8, yTop], [x1 + 8, yTop], [x1 + 8, yTop + 22], [x0 - 8, yTop + 22]]);
  f.line([[x0 - 8, yTop], [x1 + 8, yTop], [x1 + 8, yTop + 22], [x0 - 8, yTop + 22], [x0 - 8, yTop]], 0.8);
  f.fill(dark(cel(WOOD.front)), [[x0, yTop + 22], [x1, yTop + 22], [x1, yBot], [x0, yBot]]);
  // Front in the cel tone except a lit strip on the side nearer the light; grain lines run vertically.
  f.fill(dark(mul(WOOD.front, '#d9cbd6')), [[x0, yTop + 40], [x1, yTop + 40], [x1, yBot], [x0, yBot]]);
  const mid = (x0 + x1) / 2;
  for (const [a, b] of [[x0 + 18, mid - 6], [mid + 6, x1 - 18]] as const) {
    f.line([[a, yTop + 52], [b, yTop + 52], [b, yBot - 30], [a, yBot - 30], [a, yTop + 52]], 0.7, dark('#4d3c2c'), false);
    for (let i = 1; i < 6; i++) {
      const gx = a + ((b - a) * i) / 6 + 4 * Math.sin(i * 3.7);
      f.line([[gx, yTop + 62], [gx + 5 * Math.sin(i), (yTop + yBot) / 2], [gx - 3, yBot - 40]], 0.75, dark('#6a4c30'), false);
    }
  }
  f.line([[mid, yTop + 46], [mid, yBot - 24]], 1.0, dark('#3b2e22'), false);
  // Knobs with a small hard shadow below.
  for (const kx of [mid - 34, mid + 34]) {
    const ky = yTop + 150;
    f.fill(dark(mul(WOOD.front, '#a497b4')), ell(kx + 2, ky + 14, 11, 7, 12));
    f.fill(dark(WOOD.knob), ell(kx, ky, 11, 11, 12));
    f.fill(dark(mixColor(WOOD.knob, '#d9b88a', 0.5)), ell(kx - 3, ky - 4, 4, 3, 8));
  }
  f.line([[x0, yTop + 22], [x0, yBot]], 0.8, INK, false);
  f.line([[x1, yTop + 22], [x1, yBot]], 0.8, INK, false);
};

/** The inside door face with the head jamb shadow, the recessed panel (two-tone bevels) and the thumb-turn. */
const doorFace = (f: Flat, dx: number, dark: (c: string) => string, o: {lightLine: boolean; bolt: boolean}) => {
  f.fill(dark(DOOR.wall), rect(-20, -20, 1100, 1940));
  f.fill(dark(DOOR.jamb), rect(90 + dx * 0.2, 0, 1000 + dx * 0.2, 1940));
  f.fill(dark(cel(DOOR.jamb)), rect(90 + dx * 0.2, 0, 140 + dx * 0.2, 1940)); // hinge-side return in the cel tone
  f.fill(dark(DOOR.leaf), rect(140 + dx, 40, 950 + dx, 1940));
  f.fill(dark(cel(DOOR.leaf)), rect(140 + dx, 40, 950 + dx, 64)); // head jamb shadow
  const px0 = 230 + dx, px1 = 860 + dx, py0 = 150, py1 = 560;
  f.fill(dark(DOOR.panel), rect(px0, py0, px1, py1));
  f.fill(dark(cel(DOOR.panel)), rect(px0, py0, px1, py0 + 16)); // top rail shadow into the recess
  f.fill(dark(cel(DOOR.panel)), [[px0, py0], [px0 + 12, py0 + 12], [px0 + 12, py1], [px0, py1]]);
  f.fill(dark(mixColor(DOOR.leaf, '#fff8e8', 0.4)), rect(px0, py1 - 6, px1, py1)); // lit bottom bevel
  f.line([...rect(px0, py0, px1, py1), [px0, py0]], 0.8);
  f.line([...rect(140 + dx, 40, 950 + dx, 1940)], 1.0, INK, false);
  if (o.lightLine) {
    f.fill(DOOR.line, rect(140 + dx, 34, 950 + dx, 40));
    f.fill(DOOR.line, rect(950 + dx, 34, 955 + dx, 1000));
  } else f.fill('#0a0a0b', rect(950 + dx, 34, 966 + dx, 1000));
  if (o.bolt) {
    f.fill(dark(cel(DOOR.leaf)), [[820 + dx, 640], [900 + dx, 640], [904 + dx, 690], [824 + dx, 690]]); // bolt shadow
    f.fill(dark('#9c958a'), ell(860 + dx, 640, 36, 36, 18));
    f.fill(dark('#6f665a'), [[820 + dx, 634], [900 + dx, 634], [900 + dx, 646], [820 + dx, 646]]);
    f.line(ell(860 + dx, 640, 36, 36, 18), 0.8);
  }
};

export const paintB02Sh02 = (ctx: PaintContext, pf: number) => {
  const {brush} = ctx;
  const f = flatKit(ctx, 71000);
  const slide = 24 * (1 - easeOut(pf / 6)); // last 24 px of the shove, flush at pf 6
  const lurch = pf < 6 ? 0.015 * Math.sin((pf / 6) * Math.PI * 0.5) : 0.015 * Math.exp(-(pf - 6) * 0.18);
  const wob = pf >= 6 ? 3 * Math.exp(-(pf - 6) * 0.25) * Math.sin((pf - 6) * 1.4) : 0;
  const jolt = joltAt(pf);
  brush.push();
  brush.translate(540, 760);
  brush.scale(1 + lurch);
  brush.translate(-540, -760);
  const id = (c: string) => c;
  doorFace(f, jolt, id, {lightLine: true, bolt: true});
  // Cabinet: near top edge y 1000, far edge against the door at y 830 (eye 1.47 m above a 1.2 m top).
  brush.push();
  brush.translate(slide + wob, jolt * 0.25);
  cabinetFront(f, 170, 910, 1000, 2000, id, {topFar: 830, farInset: 60});
  brush.pop();
  brush.pop();
};

// ---------------------------------------------------------------------------------------------------------------------
// B09-SH02B R2.5: seated eye 0.75 m; the plate is tall (world y 0-3020) and the camera tilts up dy 1100 -> 0 over f 0-18.
// Start: the floor before the cabinet with the phone and the cans; variant A adds his two bare feet at the frame
// bottom (no knees, no hands), variant B no body. End: the cabinet (grain, top lip, doors, knobs) and the
// still door above it, latch line black. Day three, the door end darkest; key from the balcony behind him.

const DAY3 = (c: string) => mixColor(c, '#2e2c33', 0.38);
const tilt = (f: number) => {
  const x = Math.max(0, Math.min(1, f / 18));
  return 1100 * (1 - x * x * (3 - 2 * x));
};

export const fistTop = (p: Paint, cx: number, cy: number, s: number, dir: Pt, thumbSide: 1 | -1, skin: string) => {
  // Closed fist seen from above-behind (no open palm): the back of the hand, the knuckle row, the curled first finger
  // segments beyond it, the thumb tucked along the inner side. `dir` points from the wrist toward the knuckles.
  const n = Math.hypot(dir[0], dir[1]) || 1, d: Pt = [dir[0] / n, dir[1] / n], q: Pt = [-d[1], d[0]];
  const X = (u: number, v: number): Pt => [cx + (d[0] * u + q[0] * v * thumbSide) * s, cy + (d[1] * u + q[1] * v * thumbSide) * s];
  const back = [X(-0.4, -0.5), X(0.42, -0.56), X(0.56, -0.2), X(0.56, 0.36), X(0.4, 0.5), X(-0.4, 0.46)];
  p.part(skin, back, true);
  // Finger segments curled over: four rounded blocks past the knuckles, in the cel tone (they face away from the light).
  for (let i = 0; i < 4; i++) {
    const v = -0.5 + i * 0.27;
    p.part(cel(skin), capsule(X(0.54, v + 0.12), X(0.74, v + 0.12), 0.13 * s, 0.12 * s, 5), true);
  }
  // Knuckle highlights: the lit tops of the knuckles, small arcs.
  for (let i = 0; i < 4; i++) p.ink([X(0.42, -0.42 + i * 0.27), X(0.47, -0.32 + i * 0.27)], 0.8, 0.2);
  // Thumb along the inner side, wrapping over the index finger.
  p.part(skin, capsule(X(-0.1, 0.56), X(0.5, 0.62), 0.14 * s, 0.12 * s, 5), true);
};

export const paintB09Sh02b = (ctx: PaintContext, frame: number, variant: 'A' | 'B') => {
  const {brush} = ctx;
  const f = flatKit(ctx, 81000);
  const dy = tilt(frame);
  brush.push();
  brush.translate(0, -dy);
  // Door, jamb and wall in the darkest band; latch line black; no light line (B09).
  doorFace(f, 0, (c) => DAY3(mixColor(c, '#4d4a52', 0.25)), {lightLine: false, bolt: false});
  // Cabinet from y 900 (top lip above the eye) to the floor at y 2060; plinth; grain, doors and knobs.
  cabinetFront(f, 150, 930, 900, 2030, (c) => DAY3(c));
  f.fill(DAY3('#5d4a37'), rect(160, 2030, 920, 2075));
  // Floor between him and the cabinet (tiles in perspective), lit from behind: the lit tone, his and the props' shadows.
  const floor = DAY3('#9a8a72');
  f.fill(floor, rect(-20, 2075, 1100, 3040));
  for (const y of [2140, 2240, 2380, 2580, 2860]) f.line([[-20, y], [1100, y]], 0.35, DAY3('#b3a385'), false);
  for (let i = -6; i <= 6; i++) f.line([[540 + i * 120, 2075], [540 + i * 300, 3040]], 0.35, DAY3('#b3a385'), false);
  const sh = castTone(floor);
  // Shadows fall away from us (up the frame, toward the cabinet): feet, knees, cans, phone.
  if (variant === 'A') for (const s of [-1, 1]) f.fill(sh, ellipse(540 + s * 200, 2738, 112, 30, 18)); // toe shadows, cast ahead
  f.fill(sh, [[150, 2330], [290, 2330], [270, 2190], [160, 2190]]);
  f.fill(sh, [[790, 2380], [960, 2380], [940, 2300], [800, 2300]]);
  // Props: two can stacks (left), the phone face-up with a dark screen (right).
  for (const [cx, cy] of [[190, 2310], [250, 2330], [215, 2260]] as const) {
    f.fill(DAY3('#9aa2a6'), rect(cx - 26, cy - 46, cx + 26, cy));
    f.fill(DAY3('#c8ced0'), ell(cx, cy - 46, 26, 8, 12));
    f.fill(DAY3('#b2453a'), rect(cx - 26, cy - 34, cx + 26, cy - 20));
    f.line(rect(cx - 26, cy - 46, cx + 26, cy), 0.6);
  }
  const phone: Pt[] = [[800, 2392], [952, 2398], [946, 2318], [806, 2312]];
  f.fill(DAY3('#2a2d33'), phone);
  f.fill(DAY3('#15171b'), [[812, 2384], [940, 2389], [935, 2326], [817, 2321]]);
  f.line([...phone, phone[0]], 0.7);
  brush.pop();
  // His body (variant A only; flat fills, cel): two bare feet at the frame bottom, no knees and no hands. Light from
  // behind him. Variant B shows no body at all.
  const p = flatPaint(ctx, 82000);
  const skin = DAY3(YOU.head.skin);
  brush.push();
  brush.translate(0, -dy);
  if (variant === 'A') {
    for (const s of [-1, 1]) {
      // Bare foot seen from above (composed POV): the ankle at the frame bottom, the instep widening to the toes,
      // which point at the cabinet; big toe on the inner side. Lit from behind: the instep lit, the outer side in cel.
      const fx = 540 + s * 200;
      const foot: Pt[] = hull([...ellipse(fx, 2800, 116, 62, 20), [fx - 90, 3060], [fx + 90, 3060]]);
      p.part(cel(skin), foot, false);
      const litPart = clipConvex(foot, shift(foot, [s * 46, 0]));
      if (litPart.length > 2) p.part(skin, litPart, false);
      p.ink(foot.filter(([, y]) => y < 3040).sort((u, v) => u[0] - v[0]), 1.0, 0.25);
      for (let i = 0; i < 5; i++) {
        const k = s < 0 ? 4 - i : i; // k 0 = big toe (inner)
        const x = fx - 80 + i * 40;
        const r = k === 0 ? 27 : 20 - k * 1.5;
        const y = 2752 + (k === 0 ? -8 : k * 7);
        const toe = ellipse(x, y, r, r * 1.15, 12);
        p.part(cel(skin), toe, false);
        const tl = clipConvex(toe, shift(toe, [0, r * 0.5]));
        if (tl.length > 2) p.part(skin, tl, false);
        p.ink([...toe, toe[0]], 0.8, 0.2);
        p.part(mixColor(skin, '#f4e6d8', 0.35), ellipse(x, y - r * 0.35, r * 0.45, r * 0.32, 8), false); // nail
      }
      p.ink([[fx + s * 30, 2990], [fx + s * 34, 2900]], 0.7, 0.3); // tendon line
    }
  }
  brush.pop();
};

// ---------------------------------------------------------------------------------------------------------------------
// Compositions.

const capStyle = {preset: 'outline', position: 'bottom'} as const;
const Cap = ({text}: {text: string}) => (
  <AbsoluteFill style={{transform: 'translateY(-538px)'}}>
    <Subtitles text={text} style={capStyle} />
  </AbsoluteFill>
);

export const Spk05B04 = ({caption, bare, shade}: {caption?: string; bare?: boolean; shade?: boolean}) => {
  const pf = useCurrentFrame();
  const paint = (ctx: PaintContext) => paintB04Lit(ctx, pf);
  if (bare) return <BrushCanvas paint={paint} paper={PAL.neighbour} />;
  return (
    <AbsoluteFill>
      <BrushCanvas paint={paint} paper={PAL.neighbour} />
      <Grade />
      <Grain />
      {(caption || shade) && <CaptionShade tl={pf / 30} cues={[[0, 10]]} mode="band" />}
      {caption && <Cap text={caption} />}
    </AbsoluteFill>
  );
};

export const Spk05Bodies = () => (
  <AbsoluteFill>
    <BrushCanvas paint={paintBodies} paper="#e7dcc6" />
    <Grain />
  </AbsoluteFill>
);

export const Spk05B02 = ({caption, shade}: {caption?: string; shade?: boolean}) => {
  const pf = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BrushCanvas paint={(ctx) => paintB02Sh02(ctx, pf)} paper={DOOR.wall} />
      <Grade />
      <Grain />
      {shade && <CaptionShade tl={pf / 30} cues={[[0, 10]]} mode="soft" />}
      {caption && <Cap text={caption} />}
    </AbsoluteFill>
  );
};

export const Spk05B09 = ({variant}: {variant: 'A' | 'B'}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BrushCanvas paint={(ctx) => paintB09Sh02b(ctx, f, variant)} paper="#3a3634" />
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};
