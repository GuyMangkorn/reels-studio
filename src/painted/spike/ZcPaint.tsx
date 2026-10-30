import {AbsoluteFill} from 'remotion';
import {BrushCanvas, hash, type Brush, type PaintContext} from '../BrushCanvas';
import {applyCamera, pushCamera} from '../camera';
import {ramp, type Pt} from '../painter';
import type {Cast} from './CastSheet';
import {headOutline} from './FaceSheet';
import {ellipse} from './ProportionSheet';
import {makePaint, paintBodySide, type Paint} from './SideSheet';
import {Grade, Grain} from './WfogShop';

// ZCPAINT Film feasibility spike (VB-ZCPAINT-SHORT-R1, 29 Oct 2026), on the WORLD FOG base (user, 29 Oct 2026):
// 4-head cast at 1.7 m (head 0.425 m, 447 px/m at scale 1), the flat-face decal head and profile body of
// SideSheet/FaceSheet/ProportionSheet, opaque decal fills (no brush.wash()), the grey fog-world palette with one warm
// light, and the WfogShop Grade + Grain screen layers. Two representative ZCONDO-SHORT shots; not a rig, not episode
// art, registered only on its own entry point (zcpaint-index.ts).

const UNIT_PX_PER_M = 447; // SideSheet calibration: 4 heads x 190 px = 1.7 m
const CAP = '#1c1f24';
const BLOOD = '#4a1010';

/** ZC "you": the WORLD FOG male narrator head (CastSheet R1 "ผม") with the ZCONDO outfit (teal tee, grey shorts, barefoot). */
export const YOU: Cast = {
  name: 'คุณ', role: 'you (zc-you)', face: 6,
  head: {skin: '#e2b084', hair: '#262422', cut: 'short'},
  outfit: {shoulder: 0.4, shirt: '#2f5a5c', sleeve: '#2f5a5c', longSleeves: false, pants: '#6c7072', shoes: '#e2b084'},
};
/** The infected neighbour: bob head under a long hair curtain (new), knee-length pale sleep shirt (the coat path). */
const INFECTED: Cast = {
  name: 'ผู้ติดเชื้อ', role: 'zc-infected', face: 0,
  head: {skin: '#b9b4a8', hair: '#141213', cut: 'bob'},
  outfit: {shoulder: 0.37, shirt: '#c9c5b8', sleeve: '#c9c5b8', longSleeves: false, pants: '#b9b4a8', shoes: '#b9b4a8', coat: '#c9c5b8'},
};

const scaleXY = (brush: Brush, x: number, y: number) => (brush.scale as unknown as (a: number, b: number) => void)(x, y);

/** A SideSheet profile figure at ground point (gx, gy), `pxPerM` on screen, facing +1 right / -1 left; `grip` in screen px. */
type HeadAnchor = {x: number; y: number; K: number};
const figure = (ctx: PaintContext, p: Paint, c: Cast, gx: number, gy: number, pxPerM: number, face: 1 | -1, grip?: Pt, extra?: (p: Paint, head: HeadAnchor) => void) => {
  const k = pxPerM / UNIT_PX_PER_M;
  const local = grip ? ([(face * (grip[0] - gx)) / k, (grip[1] - gy) / k] as Pt) : undefined;
  ctx.brush.push();
  ctx.brush.translate(gx, gy);
  scaleXY(ctx.brush, face * k, k);
  const {head} = paintBodySide(p, c, 0, 0, local);
  extra?.(p, head);
  ctx.brush.pop();
};

/** Hair curtain over the infected's profile face, bloody mouth and a faint eye-shine through it (SideSheet local px). */
const infectedFace = (lit: boolean) => (p: Paint, {x: cx, y: cy, K}: HeadAnchor) => {
  const L = (u: number, v: number): Pt => [cx + u * K, cy + v * K];
  if (lit) p.part(BLOOD, ellipse(cx + 0.8 * K, cy + 0.95 * K, 0.22 * K, 0.12 * K, 12), false, 6);
  p.part('#141213', [L(-0.9, -1.15), L(0.6, -1.2), L(1.25, -0.6), L(1.3, 0.6), L(1.05, 1.5), L(0.7, 1.1), L(0.55, 0.2), L(0.2, -0.5), L(-1.0, 0.2)], false, 6);
  if (lit) p.part('#e9e6d6', ellipse(cx + 0.95 * K, cy - 0.05 * K, 0.06 * K, 0.04 * K, 8), false, 6);
};

const quad = (a: Pt, b: Pt, c: Pt, d: Pt): Pt[] => [a, b, c, d];
/** Translucent textured veil (haze, light spill); seeded per id so it holds still. */
const veil = (ctx: PaintContext, id: number, color: string, opacity: number, pts: Pt[]) => {
  ctx.still(id);
  ctx.brush.noStroke();
  ctx.brush.fill(color, opacity);
  ctx.brush.fillBleed(0.3);
  ctx.brush.fillTexture(0.4, 0.4);
  ctx.brush.polygon(pts);
  ctx.brush.noFill();
};

// --- B01-SH01: OTS down the powered corridor (one-point perspective, eye 1.6 m, F = 1844 px ~ vFOV 55 deg) ----------

const VP: Pt = [600, 560];
const F = 1844;
const C = (x: number, y: number, d: number): Pt => [VP[0] + (x * F) / d, VP[1] - ((y - 1.6) * F) / d];

const b01Paint = (ctx: PaintContext) => {
  const {brush, t} = ctx;
  const set = makePaint(ctx, 1000);
  const fill = (color: string, pts: Pt[], passes = 3) => set.part(color, pts, false, passes);
  brush.push();
  applyCamera(brush, pushCamera(t, 3.5, {s0: 1, s1: 1.035, fx: 640, fy: 690}));
  const near = 0.6, far = 15;
  fill('#5d625e', quad(C(-0.9, 2.6, near), C(0.9, 2.6, near), C(0.9, 2.6, far), C(-0.9, 2.6, far))); // ceiling
  fill('#6b706c', quad(C(-0.9, 0, near), C(-0.9, 2.6, near), C(-0.9, 2.6, far), C(-0.9, 0, far))); // left wall
  fill('#646a68', quad(C(0.9, 0, near), C(0.9, 2.6, near), C(0.9, 2.6, far), C(0.9, 0, far))); // right wall
  fill('#3d4646', quad(C(-0.9, 0, near), C(0.9, 0, near), C(0.9, 0, far), C(-0.9, 0, far))); // floor
  fill('#c9cbc2', quad(C(-0.9, 2.6, far), C(0.9, 2.6, far), C(0.9, 0, far), C(-0.9, 0, far)), 4); // far window, cold fog-white
  for (const [side, d] of [[-1, 3.2], [1, 5.0], [-1, 7.6], [1, 9.8], [-1, 12.2]] as const) {
    fill('#484c4b', quad(C(side * 0.9, 0, d), C(side * 0.9, 2.1, d), C(side * 0.9, 2.1, d + 0.9), C(side * 0.9, 0, d + 0.9))); // doors, no peephole
  }
  // Fluorescent strips; strip 2 flickers on a seeded 1/8 s step (seek-safe).
  const flick = hash(Math.floor(t * 8) + 17) > 0.62;
  [3, 6, 9, 12].forEach((d, i) => fill(i === 1 && flick ? '#8d948f' : '#e8efe9', quad(C(-0.1, 2.59, d), C(0.1, 2.59, d), C(0.1, 2.59, d + 1.2), C(-0.1, 2.59, d + 1.2))));
  veil(ctx, 3050, '#3a1515', 150, [C(-0.08, 0, 11.8), C(0.0, 0, 11.8), C(0.1, 0, 9.6), C(0.06, 0, 8.8), C(0.02, 0, 9.5)]); // drag trail: matte, dark, soft
  // Haze veils (WFOG fog language, indoors): thin grey layers that thicken with depth.
  for (const [d0, op] of [[6, 40], [9, 55], [12.5, 70]] as const) veil(ctx, 3000 + d0, '#878b83', op, quad(C(-0.9, 2.6, d0), C(0.9, 2.6, d0), C(0.9, 0, d0), C(-0.9, 0, d0)));
  // Her: profile silhouette at 12 m against the window (SideSheet silhouette mode).
  const [gx, gy] = C(0.15, 0, 12);
  figure(ctx, makePaint(ctx, 5000, '#21272a'), INFECTED, gx, gy, F / 12, -1, undefined, infectedFace(false));
  // The one warm light: unit lamp spill from his open door on the floor, lower left.
  veil(ctx, 3100, '#d89a4e', 70, [C(-0.9, 0, 0.9), C(-0.2, 0, 0.9), C(-0.5, 0, 2.2), C(-0.9, 0, 2.6)]);
  // Foreground: back of his decal head (hair cap over the egg), ears, neck, shoulders; OTS left third.
  const me = makePaint(ctx, 7000);
  const K = 150, hx = 250, hy = 470;
  const H = (pts: Pt[]) => pts.map(([u, v]): Pt => [hx + u * K, hy + v * K]);
  me.part('#2f5a5c', [[hx - 1.1 * K, 700], [hx + 1.1 * K, 700], [hx + 1.6 * K, 800], [hx + 1.8 * K, 1990], [hx - 1.9 * K, 1990], [hx - 1.6 * K, 800]], true, 4);
  me.part('#24484a', [[hx + 1.1 * K, 700], [hx + 1.6 * K, 800], [hx + 1.8 * K, 1990], [hx + 1.2 * K, 1990], [hx + 1.15 * K, 900]], false, 4);
  me.part('#e2b084', H([[-0.42, 0.9], [0.42, 0.9], [0.5, 1.75], [-0.5, 1.75]]), false, 4);
  for (const s of [-1, 1]) me.part('#e2b084', H(ellipse(s * 1.0, 0.12, 0.14, 0.21, 16)), true, 3);
  me.part('#262422', H(headOutline()), true, 6);
  brush.pop();
  // Screen-space falloff: the corridor light does not reach the camera; keeps the caption band dark (ZC-CAPZONE).
  veil(ctx, 3400, '#101514', 150, [[-60, 820], [1140, 820], [1140, 1990], [-60, 1990]]);
};

// --- B02-SH02: section cutaway, corridor open | door wall | entry (SEC-2D) ----------------------------------------

const SVP: Pt = [540, 600];
const U = 340; // px per metre on the cut plane
const D0 = 6;
const sd = (d: number) => 1 / (1 + d / D0);
const S = (y: number, z: number, d: number): Pt => {
  const fx = 420 + y * U, fy = 860 - z * U, s = sd(d);
  return [SVP[0] + (fx - SVP[0]) * s, SVP[1] + (fy - SVP[1]) * s];
};

const b02Paint = (ctx: PaintContext) => {
  const {brush, t} = ctx;
  const set = makePaint(ctx, 1000);
  const fill = (color: string, pts: Pt[], passes = 3, outline = false) => set.part(color, pts, outline, passes);
  brush.push();
  applyCamera(brush, pushCamera(t, 3.6, {s0: 1, s1: 1.02, fx: 540, fy: 520}));
  const back = 3.2;
  // Corridor (cool, lit) as a deep tunnel; its door-wall face recedes into the picture.
  fill('#3d4646', quad(S(-1.8, 2.6, 0), S(0, 2.6, 0), S(0, 0, 0), S(-1.8, 0, 0)));
  fill('#5d625e', quad(S(-1.8, 2.6, 0), S(0, 2.6, 0), S(0, 2.6, 9), S(-1.8, 2.6, 9)));
  fill('#4a5250', quad(S(-1.8, 0, 0), S(0, 0, 0), S(0, 0, 9), S(-1.8, 0, 9)));
  fill('#6b706c', quad(S(0, 0, 0), S(0, 2.6, 0), S(0, 2.6, 9), S(0, 0, 9)));
  fill('#2a3030', quad(S(-1.8, 2.6, 9), S(0, 2.6, 9), S(0, 0, 9), S(-1.8, 0, 9)));
  fill('#e8efe9', quad(S(-1.0, 2.59, 0.4), S(-0.8, 2.59, 0.4), S(-0.8, 2.59, 2.0), S(-1.0, 2.59, 2.0)));
  fill('#484c4b', quad(S(0, 0, 0.3), S(0, 2.1, 0.3), S(0, 2.1, 1.2), S(0, 0, 1.2))); // unit door, edge-on leaf
  // Entry (warm lamp: the one warm light) and the bathroom slice beyond the partition.
  const room = (y0: number, y1: number, wall: string, floor: string, ceil: string) => {
    fill(wall, quad(S(y0, 2.6, back), S(y1, 2.6, back), S(y1, 0, back), S(y0, 0, back)));
    fill(floor, quad(S(y0, 0, 0), S(y1, 0, 0), S(y1, 0, back), S(y0, 0, back)));
    fill(ceil, quad(S(y0, 2.6, 0), S(y1, 2.6, 0), S(y1, 2.6, back), S(y0, 2.6, back)));
  };
  room(0.18, 1.68, '#b39a78', '#7d6c58', '#9c8a70');
  room(1.78, 3.4, '#8f918b', '#676a66', '#7d807b');
  veil(ctx, 3200, '#e2b779', 60, [S(0.4, 2.6, 1.2), S(1.5, 2.6, 1.2), S(1.68, 0, 1.2), S(0.25, 0, 1.2)]); // lamp pool
  // Neighbour unit below the slab: dim, curtained, nobody (a dark field behind the caption band).
  fill('#262a2b', [[-200, 945], [1300, 945], [1300, 2000], [-200, 2000]], 4);
  fill('#3a3430', [[560, 1010], [1000, 1010], [1000, 1640], [560, 1640]]);
  // Caps (poche): door wall, partition, slabs; matte, unlit, solid.
  for (const pts of [[[420, -60], [479, -60], [479, 945], [420, 945]], [[420 + 1.68 * U, -60], [420 + 1.78 * U, -60], [420 + 1.78 * U, 945], [420 + 1.68 * U, 945]], [[-200, 860], [1300, 860], [1300, 945], [-200, 945]], [[-200, -60], [1300, -60], [1300, -24], [-200, -24]]] as Pt[][]) fill(CAP, pts, 4);
  // Cabinet: light, hollow; slides from +0.87 m to flush against the door wall.
  const slide = 0.87 * (1 - ramp(t, 0.5, 2.6));
  const cy0 = 0.18 + slide, cy1 = cy0 + 0.4, cd0 = 0.35, cd1 = 1.15;
  fill('#a58e6b', quad(S(cy1, 1.2, cd0), S(cy1, 1.2, cd1), S(cy1, 0, cd1), S(cy1, 0, cd0)), 4);
  fill('#ddc7a2', quad(S(cy0, 1.2, cd0), S(cy1, 1.2, cd0), S(cy1, 1.2, cd1), S(cy0, 1.2, cd1)), 4);
  fill('#c8b08a', quad(S(cy0, 1.2, cd0), S(cy1, 1.2, cd0), S(cy1, 0, cd0), S(cy0, 0, cd0)), 4, true);
  // Her: profile facing the door, near hand pounding the door-wall face (~2.4 beats/s), bloody hand.
  const d = 0.75, s = sd(d);
  const beat = Math.abs(Math.sin(t * Math.PI * 2.4));
  const [hx, hy] = S(-0.45, 0, d);
  const fist = S(0, 1.35 + 0.25 * (1 - beat), d);
  figure(ctx, makePaint(ctx, 5000), INFECTED, hx, hy, U * s, 1, fist, infectedFace(true));
  veil(ctx, 3300, '#3a1515', 200, ellipse(fist[0] - 4, fist[1] + 4, 11, 9, 10)); // blood on the fist, matte
  // Him: profile facing the door, near hand on the cabinet's side, leaning in.
  const [mx, my] = S(cy1 + 0.36, 0, d);
  figure(ctx, makePaint(ctx, 6000), YOU, mx, my, U * s, -1, S(cy1, 0.95, d));
  // Door shudder strokes on impact (ink, boiling).
  if (beat > 0.85) {
    ctx.boil(9000);
    brush.set('rotring', '#e9e1cf', 1.2);
    const [ex, ey] = S(0, 1.3, d);
    for (let k = 0; k < 3; k++) brush.line(ex + 26, ey - 50 + k * 50, ex + 56, ey - 62 + k * 50);
  }
  brush.pop();
};

const Shot = ({paint}: {paint: (ctx: PaintContext) => void}) => (
  <AbsoluteFill>
    <BrushCanvas paint={paint} paper="#7c8380" />
    <Grade />
    <Grain />
  </AbsoluteFill>
);
export const ZcPaintB01 = () => <Shot paint={b01Paint} />;
export const ZcPaintB02 = () => <Shot paint={b02Paint} />;
