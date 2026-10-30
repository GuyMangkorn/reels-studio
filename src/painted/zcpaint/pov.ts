import type {PaintContext} from '../BrushCanvas';
import {makePainter, mixColor, type Pt} from '../painter';
import {paintEdgeGrip, paintPovHand, ZC_HAND, type EdgeGrip, type PovHand} from '../hands';
import {ell, INK} from './ctx';
import {flatKit, type Flat} from './sets';

// ZCPAINT first-person parts (S-P10, Boss pass 5): the door scene, the cabinet and the two hand grips, shared by the
// POV plates (`povshots.ts`). Clean kit: every backdrop area is one flat wash (`flatKit`); the hands keep their textured
// character passes. Positions are the R2.1 layout in PLATE px (1080 x 1920). Moving parts take explicit offsets so each
// plate is a pure function of its own clock.

export const POV_CREAM = {
  wall: '#d9ccb0', wallShade: '#b9aa8c', jamb: '#e6dbc2', door: '#c4b392', doorShade: '#a8977a', panel: '#8a7a60',
  cabTop: '#e2cfa8', cabBack: '#c2a67c', cabEdge: '#b0956c', cabFront: '#8a7556', cabBase: '#6e5c44', knob: '#8a7458',
  floor: '#4e4134', floorEdge: '#5f5040', latch: '#2a2420', lock: '#6f665a', lockSlot: '#4f483f', corridor: '#c9cbc2',
  hinge: '#5b5650',
};
const C = POV_CREAM;
/** Wood grain and cabinet grain: the surface colour mixed toward the ink (hairlines, no blotch). */
const grainOf = (c: string) => mixColor(c, INK, 0.26);

/** Door scene at plate x offset `jolt` (leaf kick), latch edge `edge` (950 shut; 900 ajar), optional corridor gap strip
 *  and an optional door-layer scale about (540, 640) (B02-SH02 phase 2). Draws wall, jamb, leaf, panel, lock, floor. */
/** Corridor light colour of the door gaps (the top gap and the latch edge while the power is on). */
export const CORRIDOR_LIGHT = '#cfdde0';
export const paintDoorScene = (ctx: PaintContext, f: Flat, o: {jolt?: number; edge?: number; gap?: boolean; scale?: number; lock?: boolean; latchBlack?: boolean; panel?: [number, number, number, number]; line?: string} = {}) => {
  const {brush} = ctx;
  const jolt = o.jolt ?? 0, edge = o.edge ?? 950, s = o.scale ?? 1;
  const [px0, py0, px1, py1] = o.panel ?? [230, 60, 860, 460];
  // The leaf and its frame run past the bottom of the frame (sheet B02-SH01: "down past the frame bottom"); the lower
  // leaf is in shade, so no bright wall shows under the caption block. Cabinets and floors drawn later cover the rest.
  const BOTTOM = 2100;
  f.fill(C.wall, [[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]]);
  f.fill(C.wallShade, [[-100, -100], [110, -100], [110, BOTTOM], [-100, BOTTOM]]);
  // Floor tiles at the lower corners sit behind the cabinet (drawn in plate space, not scaled with the door).
  f.fill(C.floor, [[-100, 1500], [1200, 1500], [1200, 2100], [-100, 2100]]);
  f.fill(C.floorEdge, [[-100, 1500], [1200, 1500], [1200, 1530], [-100, 1530]]);
  if (s !== 1) {
    brush.push();
    brush.translate(540, 640);
    brush.scale(s);
    brush.translate(-540, -640);
  }
  f.fill(C.jamb, [[90, -100], [1010, -100], [1010, BOTTOM], [90, BOTTOM]]);
  f.line([[90, -100], [90, BOTTOM]], 1.2, INK, false);
  f.line([[1010, -100], [1010, BOTTOM]], 1.2, INK, false);
  // Ajar gap: corridor light strip between the latch edge and the jamb (flat; gone once the leaf is shut).
  if (o.gap) f.fill(C.corridor, [[edge + jolt, -100], [950, -100], [950, BOTTOM], [edge + jolt, BOTTOM]]);
  // Corridor light line (MK-ZC-ST-11): the gap above the head (y 34-40) and on the latch edge. In the canvas, so the hands
  // and the leaf cover it where they overlap (an SVG layer would draw over the hands).
  if (o.line) {
    f.fill(o.line, [[140 + jolt, 34], [edge + 6 + jolt, 34], [edge + 6 + jolt, 40], [140 + jolt, 40]]);
    f.fill(o.line, [[edge + jolt, 40], [edge + 5 + jolt, 40], [edge + 5 + jolt, BOTTOM], [edge + jolt, BOTTOM]]);
  }
  // Leaf (top edge y 40, head jamb above): the wood grain (hairlines across the leaf), the recessed panel, the hinges.
  f.fill(C.door, [[140 + jolt, 40], [edge + jolt, 40], [edge + jolt, BOTTOM], [140 + jolt, BOTTOM]]);
  f.fill(C.doorShade, [[140 + jolt, 520], [edge + jolt, 520], [edge + jolt, BOTTOM], [140 + jolt, BOTTOM]]);
  for (const y of [120, 230, 340, 610, 740]) f.line([[150 + jolt, y], [540 + jolt, y + 4], [edge - 20 + jolt, y - 2]], 0.4, grainOf(C.door), false);
  f.line([[140 + jolt, 40], [140 + jolt, BOTTOM]], 1.3, INK, false);
  f.line([[px0 + jolt, py0], [px1 + jolt, py0], [px1 + jolt, py1], [px0 + jolt, py1]], 0.9, C.panel);
  f.fill(C.hinge, [[140 + jolt, 176], [158 + jolt, 176], [158 + jolt, 226], [140 + jolt, 226]]);
  f.fill(C.hinge, [[140 + jolt, 636], [158 + jolt, 636], [158 + jolt, 686], [140 + jolt, 686]]);
  if (o.lock !== false) {
    f.fill(C.lock, ell(860 + jolt, 640, 30, 30, 16));
    f.fill(C.lockSlot, [[848 + jolt, 612], [872 + jolt, 612], [872 + jolt, 668], [848 + jolt, 668]]);
  }
  f.fill(o.latchBlack ? '#000000' : C.latch, [[edge + jolt, -100], [edge + 16 + jolt, -100], [edge + 16 + jolt, BOTTOM], [edge + jolt, BOTTOM]]);
  if (s !== 1) brush.pop();
};

/** Cabinet (0.80 m wide, flush at the door): top slab, back edge, front face and base in shadow, two doors and knobs,
 *  wood grain on the front. `dx`/`dy` move it (drag, bob, lift). The front grain sits below the caption block. */
export const paintCabinet = (ctx: PaintContext, f: Flat, dx = 0, dy = 0) => {
  const T = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [x + dx, y + dy]);
  f.fill(C.cabTop, T([[120, 800], [960, 800], [1040, 1030], [40, 1030]]));
  f.fill(C.cabBack, T([[120, 800], [960, 800], [972, 840], [108, 840]]));
  f.fill(C.cabEdge, T([[40, 1030], [1040, 1030], [1040, 1062], [40, 1062]]));
  f.line(T([[120, 800], [960, 800], [1040, 1030], [40, 1030]]), 1.2);
  f.fill(C.cabFront, T([[40, 1062], [1040, 1062], [1070, 1720], [10, 1720]]));
  f.fill(C.cabBase, T([[10, 1500], [1070, 1500], [1080, 1720], [0, 1720]]));
  f.line(T([[40, 1062], [1040, 1062], [1070, 1720], [10, 1720]]), 1.1);
  for (const y of [1290, 1420, 1560]) f.line(T([[60, y], [300, y + 3], [700, y - 2], [1030, y + 1]]), 0.4, grainOf(C.cabFront), false);
  f.line(T([[470, 1100], [470, 1680]]), 0.9, C.knob, false);
  f.fill(C.knob, ell(440 + dx, 1380 + dy, 10, 10, 10));
  f.fill(C.knob, ell(500 + dx, 1380 + dy, 10, 10, 10));
};

/** Palm hand on the cabinet top, fingers toward the door (the B02-SH02 shove pose and the B02-SH01 door hand). */
export const palmHand = (ctx: PaintContext, side: -1 | 1, o: {x: number; y: number; press?: number; base: number; elbow?: Pt; sleeveFrom?: Pt}) => {
  const p = makePainter(ctx.brush, {t: ctx.t, frame: ctx.frame, fade: C.wall});
  paintPovHand(p, {
    side, base: o.base, wrist: [o.x, o.y], dir: -Math.PI / 2, size: 1.1, curl: 0.05, spread: 0.15, thumb: [100, 190],
    press: o.press ?? 0, elbow: o.elbow, sleeveFrom: o.sleeveFrom, tone: ZC_HAND,
  });
};

/**
 * One hand hooked over the cabinet's front lip (`paintEdgeGrip`, user 30 Oct 2026: "นิ้วงอรอบขอบตู้"): knuckles on the top
 * face near the end, the four fingers turn over the lip and hang down the front face, the thumb on the top at the end.
 * The layout is offsets from the lip anchor (938, 1036) scaled by HOOK_SCALE (the POV hands are ~1.6 x the grip sheet).
 * `side` +1 the right hand (cabinet end at screen right), -1 the left. `dx`/`dy` ride with the cabinet.
 */
const HOOK_SCALE = 1.6;
export const hookHand = (ctx: PaintContext, side: -1 | 1, dx = 0, dy = 0, base = 7600) => {
  const p = makePainter(ctx.brush, {t: ctx.t, frame: ctx.frame, fade: C.wall});
  const mx = (x: number) => (side > 0 ? x : 1080 - x) + dx; // the left hand is the right-hand layout mirrored
  const my = (y: number) => y + dy;
  const A: Pt = [938, 1036];
  const at = ([ox, oy]: Pt): Pt => [mx(A[0] + ox * HOOK_SCALE), my(A[1] + oy * HOOK_SCALE)];
  const grip: EdgeGrip = {
    base, tone: ZC_HAND, width: 42, scale: HOOK_SCALE,
    knuckles: ([[-20, -102], [2, -112], [23, -106], [40, -90]] as Pt[]).map(at),
    lip: ([[-22, -2], [0, 0], [21, 0], [38, 4]] as Pt[]).map(at),
    tips: ([[-26, 60], [-2, 66], [20, 68], [34, 62]] as Pt[]).map(at),
    thumb: {base: [mx(985), my(976)], tip: [mx(1026), my(1030)]},
    wrist: at([30, 60]), elbow: [mx(1080), my(1600)], sleeveFrom: [mx(1140), my(1960)],
  };
  paintEdgeGrip(p, grip);
};

/** Hand pose for the thumb-turn pinch (`pinch` [195, 165] is the grip sheet's pinch at size 1.1: the index tip on the turn's
 *  right side, the thumb tip 54 px across it, the knob in the gap at the turn centre (860, 640) with the wrist at (1068, 855)). */
export const pinchHand = (base: number, wrist: Pt, o: {curl?: number; press?: number; elbow?: Pt; sleeveFrom?: Pt}): PovHand => ({
  side: 1, base, wrist, dir: -Math.PI / 2, size: 1.1, curl: o.curl ?? 1, spread: 0.05, pinch: [195, 165], pinchGap: 49,
  fingerCurl: [0.35, 1, 1, 1], press: o.press ?? 0, elbow: o.elbow, sleeveFrom: o.sleeveFrom, tone: ZC_HAND,
});

/** Paint one `PovHand` (pinch, palm or fist) through the shared painter. */
export const povHand = (ctx: PaintContext, h: PovHand) => paintPovHand(makePainter(ctx.brush, {t: ctx.t, frame: ctx.frame, fade: C.wall}), h);

/**
 * The B02-SH02 backdrop (spike compatibility): door scene, cabinet, both palms flat on the top. Kept for the spike sheet
 * `ZcPovB02`; the production plates compose the parts above.
 */
export type PovOpts = {
  /** Cabinet drag: px in x (+ is right of the door; the drag starts at +420). */
  slide?: number;
  /** Cabinet bob (px, y) during the drag. */
  bob?: number;
  /** Door leaf kick (px, x) on a pound. */
  jolt?: number;
  /** Hand squeeze 0..1 (palm press). */
  press?: number;
};
export const paintPovBackdrop = (ctx: PaintContext, o: PovOpts = {}) => {
  const f = flatKit(ctx, 11000);
  const slide = o.slide ?? 0, bob = o.bob ?? 0, press = o.press ?? 0;
  paintDoorScene(ctx, f, {jolt: o.jolt ?? 0});
  paintCabinet(ctx, f, slide, bob);
  for (const side of [-1, 1] as const) {
    palmHand(ctx, side, {x: 540 + side * 215 + slide, y: 1040 + bob, press, base: side < 0 ? 7200 : 7300, elbow: [540 + side * 300 + slide, 1480 + bob], sleeveFrom: [540 + side * 300 + slide, 1960]});
  }
};
