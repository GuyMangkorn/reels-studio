import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {CHIN, FACES, HEAD_SPAN, INK, paintHead, type Face, type HeadStyle} from './FaceSheet';
import {ellipse, limb, skeleton} from './ProportionSheet';

type Pt = [number, number];

// WORLD FOG cast sheet (proposal): the four speaking/acting roles of WFOG-SCRIPT-R1 at 4 heads tall, front view,
// flat-face decal heads, block-colour outfits with one thin ink outline. Designs are Film/Mark proposals for the
// user's review; nothing here is a rig. 1080x1920 frame, 2x2 grid.

const N = 4, UNIT = 190, COL_W = 540;
const GROUNDS = [930, 1800];

export type Outfit = {
  shoulder: number;
  shirt: string;
  sleeve: string;
  longSleeves: boolean;
  pants: string;
  shoes: string;
  boots?: boolean;
  jacket?: string;
  coat?: string;
  apron?: string;
  skirt?: string;
  helmet?: string;
};
export type Cast = {name: string; role: string; face: number; head: HeadStyle; outfit: Outfit};

// FACES indices: 0 neutral, 1 happy, 4 worried.
export const CAST: Cast[] = [
  {
    name: 'ผม', role: 'narrator / driver', face: 0,
    head: {skin: '#e2b084', hair: '#262422', cut: 'short'},
    outfit: {shoulder: 0.4, shirt: '#e9e6dc', sleeve: '#6b7a5a', longSleeves: true, jacket: '#6b7a5a', pants: '#3f5672', shoes: '#d9d4c8'},
  },
  {
    name: 'คนส่งของ', role: 'delivery worker', face: 1,
    head: {skin: '#c48c5c', hair: '#1f1d1b', cut: 'hood', hood: '#2f4a5e'},
    outfit: {shoulder: 0.42, shirt: '#2f4a5e', sleeve: '#2f4a5e', longSleeves: true, coat: '#2f4a5e', pants: '#2c3034', shoes: '#1c1e20', boots: true, helmet: '#b8392c'},
  },
  {
    name: 'พนักงานร้าน', role: 'shop worker', face: 0,
    head: {skin: '#efc39a', hair: '#2a2420', cut: 'tied'},
    outfit: {shoulder: 0.36, shirt: '#3d6f8f', sleeve: '#3d6f8f', longSleeves: false, apron: '#e8dcc2', pants: '#2b2d30', shoes: '#1f2022'},
  },
  {
    name: 'ลูกค้าอีกคน', role: 'other occupant', face: 4,
    head: {skin: '#e6b48c', hair: '#8f8a84', cut: 'bob', lines: true},
    outfit: {shoulder: 0.37, shirt: '#d8c9b0', sleeve: '#a5735a', longSleeves: true, jacket: '#a5735a', skirt: '#4c4a5e', pants: '#e6b48c', shoes: '#5a4636'},
  },
];

const cellOf = (i: number) => ({cx: (i % 2) * COL_W + COL_W / 2, ground: GROUNDS[Math.floor(i / 2)]});

/**
 * One cast member from the front, ground point (cx, ground), 4 heads at 190 px per head (447 px/m). `idx` keeps the
 * seeds apart on a shared canvas. `opts` (ZCPAINT): a face other than the cast default, the front-head blink switch
 * (`MK-ZCP-B1`, default on as in WORLD FOG), and `lift`: both forearms raised in front of the belly to hold a load
 * (front bucket lift, B05-SH01); `beforeArms` paints that load after the torso and before the arms/hands.
 */
export type FrontOpts = {face?: Face; blink?: boolean; blinkAt?: number; stoop?: number; lift?: {handsX: number; handsY: number}; beforeArms?: () => void};
export const paintBodyFront = (ctx: PaintContext, c: Cast, idx: number, cx: number, ground: number, opts: FrontOpts = {}) => {
  const {brush, still, boil} = ctx;
  const h = UNIT;
  const o = c.outfit;
  const k = skeleton(cx, N, ground, h, o.shoulder);
  const STOOP = opts.stoop ?? 0;
  if (STOOP) {
    // Stoop (ZCPAINT infected, 0..1): shoulders drop 0.09 head, head 0.17 head, arms follow; default off.
    k.chin += 0.17 * h * STOOP;
    k.shoulderY += 0.09 * h * STOOP;
    for (const a of k.arms) { a.shoulder[1] += 0.09 * h * STOOP; a.elbow[1] += 0.07 * h * STOOP; a.wrist[1] += 0.05 * h * STOOP; }
  }
  let seed = 20000 + idx * 2000, line = 40000 + idx * 200;
  // Opaque block colour with one thin ink outline (decal look). Light colours over dark ones need more passes.
  const part = (color: string, pts: Pt[], outline = true, passes = 4) => {
    for (let p = 0; p < passes; p++) {
      still(++seed);
      brush.noStroke();
      brush.fill(color, 255);
      brush.fillBleed(0);
      brush.fillTexture(0.08, 0.2);
      brush.polygon(pts);
      brush.noFill();
    }
    if (!outline) return;
    boil(++line);
    brush.set('rotring', INK, 1.0);
    brush.spline([...pts, pts[0]], 0.15);
  };
  const hw = 0.3 * h;
  const kneeY = k.legs[0].knee[1];

  // Legs and feet.
  for (const {hip, ankle} of k.legs) part(o.pants, limb([hip[0], hip[1] - 0.04 * h], ankle, 0.26 * h, 0.19 * h));
  for (const {ankle} of k.legs) {
    const sx = Math.sign(ankle[0] - cx);
    if (o.boots) part(o.shoes, [[ankle[0] - 0.12 * h, ankle[1] - 0.32 * h], [ankle[0] + 0.12 * h, ankle[1] - 0.32 * h], [ankle[0] + 0.14 * h + sx * 0.04 * h, ground], [ankle[0] - 0.14 * h + sx * 0.04 * h, ground]]);
    else part(o.shoes, ellipse(ankle[0] + sx * 0.04 * h, ground - 0.05 * h, 0.16 * h, 0.07 * h));
  }
  // Hips/seat, unless a skirt or coat covers them.
  if (!o.skirt && !o.coat) part(o.pants, [[cx - hw - 0.02 * h, k.hipY - 0.06 * h], [cx + hw + 0.02 * h, k.hipY - 0.06 * h], [cx + hw, k.crotchY], [cx - hw, k.crotchY]], false);
  if (o.skirt) part(o.skirt, [[cx - hw - 0.02 * h, k.hipY - 0.08 * h], [cx + hw + 0.02 * h, k.hipY - 0.08 * h], [cx + hw + 0.12 * h, kneeY + 0.45 * h], [cx - hw - 0.12 * h, kneeY + 0.45 * h]]);

  // Torso: shirt, then an open jacket, a long raincoat to below the knee, or an apron.
  const torso: Pt[] = [[cx - k.sw + 0.04 * h, k.shoulderY], [cx + k.sw - 0.04 * h, k.shoulderY], [cx + k.sw, k.shoulderY + 0.08 * h], [cx + hw + 0.03 * h, k.hipY], [cx - hw - 0.03 * h, k.hipY], [cx - k.sw, k.shoulderY + 0.08 * h]];
  if (o.coat) {
    part(o.coat, [[cx - k.sw + 0.04 * h, k.shoulderY], [cx + k.sw - 0.04 * h, k.shoulderY], [cx + k.sw + 0.02 * h, k.shoulderY + 0.1 * h], [cx + hw + 0.2 * h, kneeY + 0.12 * h], [cx - hw - 0.2 * h, kneeY + 0.12 * h], [cx - k.sw - 0.02 * h, k.shoulderY + 0.1 * h]]);
    boil(++line);
    brush.set('rotring', INK, 1.0);
    brush.line(cx, k.shoulderY + 0.12 * h, cx, kneeY + 0.12 * h); // front closure
  } else {
    part(o.shirt, torso);
    if (o.jacket) {
      for (const s of [-1, 1]) part(o.jacket, [[cx + s * (k.sw - 0.04 * h), k.shoulderY], [cx + s * 0.12 * h, k.shoulderY], [cx + s * 0.1 * h, k.hipY + 0.06 * h], [cx + s * (hw + 0.05 * h), k.hipY + 0.06 * h], [cx + s * k.sw, k.shoulderY + 0.08 * h]]);
    }
    if (o.apron) part(o.apron, [[cx - 0.2 * h, k.shoulderY + 0.22 * h], [cx + 0.2 * h, k.shoulderY + 0.22 * h], [cx + 0.26 * h, k.hipY + 0.32 * h], [cx - 0.26 * h, k.hipY + 0.32 * h]], true, 8); // light over dark needs more passes
  }

  // Arms: sleeve to the elbow, then sleeve or bare forearm; mitten hands. The right hand holds the helmet.
  opts.beforeArms?.();
  k.arms.forEach(({shoulder, elbow: elbow0, wrist: wrist0}, i) => {
    // Lift: hands at (cx +- handsX, handsY) in px relative to the ground line, elbows out and low.
    const lift = opts.lift;
    const side = i === 0 ? -1 : 1;
    const wrist: Pt = lift ? [cx + side * lift.handsX, ground + lift.handsY] : wrist0;
    const elbow: Pt = lift ? [shoulder[0] + side * 0.17 * h, shoulder[1] + (wrist[1] - shoulder[1]) * 0.78] : elbow0;
    part(o.sleeve, limb(shoulder, elbow, 0.19 * h, 0.16 * h));
    part(o.longSleeves ? o.sleeve : c.head.skin, limb(elbow, wrist, 0.15 * h, 0.13 * h));
    if (o.helmet && i === 1) {
      const [hx, hy] = [wrist[0] + 0.1 * h, wrist[1] + 0.2 * h];
      const dome: Pt[] = Array.from({length: 15}, (_, j): Pt => [hx + 0.27 * h * Math.cos(Math.PI + (j / 14) * Math.PI), hy + 0.24 * h * Math.sin(Math.PI + (j / 14) * Math.PI)]);
      part(o.helmet, [...dome, [hx + 0.27 * h, hy + 0.06 * h], [hx - 0.27 * h, hy + 0.06 * h]]);
      part('#3a4148', [[hx - 0.02 * h, hy - 0.16 * h], [hx + 0.25 * h, hy - 0.1 * h], [hx + 0.27 * h, hy + 0.0 * h], [hx - 0.02 * h, hy - 0.02 * h]]); // visor
    }
    part(c.head.skin, ellipse(wrist[0], wrist[1] + 0.07 * h, 0.1 * h, 0.12 * h));
  });
  // Neck; under a raincoat it is the hood's collar, joining the hood to the coat.
  const nw = o.coat ? 0.24 * h : 0.1 * h;
  part(o.coat ?? c.head.skin, [[cx - nw, k.chin - 0.1 * h], [cx + nw, k.chin - 0.1 * h], [cx + nw + 0.01 * h, k.shoulderY + 0.02 * h], [cx - nw - 0.01 * h, k.shoulderY + 0.02 * h]], false);
  const K = h / HEAD_SPAN;
  paintHead(ctx, 100 + idx, cx, k.chin - CHIN * K, K, opts.face ?? FACES[c.face], c.head, {blink: opts.blink, blinkAt: opts.blinkAt});
};

const paint = (ctx: PaintContext) => {
  const {brush, still} = ctx;
  const h = UNIT;

  // Head-unit guides per row, held still so they read as a ruler.
  GROUNDS.forEach((g, row) => {
    for (let i = 0; i <= N; i++) {
      still(19000 + row * 10 + i);
      brush.set('HB', i === 0 ? INK : '#b3c3cf', i === 0 ? 1.4 : 0.8);
      brush.line(30, g - i * h, 1050, g - i * h);
    }
  });

  CAST.forEach((c, idx) => {
    const {cx, ground} = cellOf(idx);
    paintBodyFront(ctx, c, idx, cx, ground);
  });
};

const Labels = () => (
  <AbsoluteFill style={{fontFamily: 'Noto Sans Thai, sans-serif', color: INK}}>
    <div style={{position: 'absolute', left: 40, top: 30, fontSize: 36}}>WORLD FOG cast · 4 heads</div>
    {CAST.map((c, i) => {
      const {cx, ground} = cellOf(i);
      return (
        <div key={c.role} style={{position: 'absolute', left: cx - 250, width: 500, top: ground + 12, textAlign: 'center', fontSize: 30, lineHeight: 1.15}}>
          <b>{c.name}</b> <span style={{fontSize: 22, color: '#5d6b78'}}>{c.role}</span>
        </div>
      );
    })}
  </AbsoluteFill>
);

export const CastSheet = () => (
  <AbsoluteFill style={{backgroundColor: '#f3ecdc'}}>
    <BrushCanvas paint={paint} paper="#f3ecdc" />
    <Labels />
  </AbsoluteFill>
);
