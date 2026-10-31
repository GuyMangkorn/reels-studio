import type {PaintContext} from '../BrushCanvas';
import type {Pt} from '../kit/painter';
import {drawFig, H6, TEX_B, type Fig, type HU} from './body6';
import {bustFig, keyTravel, placeClose} from './bust';
import {YOU} from './cast';
import {cel} from './light';
import {dim, flatKit, type Flat} from './sets';
import {add3, dot3, lerp3, minJerk, mul3, nrm3, proj3, segment, sub3, type Cam3, type Reach3, type V3} from './proj';

// ZCPAINT B06-SH02 (Boss pass 14, Film SPK-ZCP-07 variant B; sheet `sc01-b06-b08.md` SS-R1.4 with the user's choice "B เอื้อมลึก"): the
// over-the-shoulder close into the fridge, one quick open. The back bust (`bust.ts`) at the left edge. His RIGHT arm (screen right in the back
// view: a back view shows the figure's right hand on the viewer's right) reaches INTO depth to the leftovers box on the shoulder-height shelf,
// projected by PJ-ZCP-07 (`proj.ts`). His LEFT hand is hidden in front of the torso (screen left, off the frame) while the door swings on its
// own hinge (open 0-6, shut 32-41). The interior is dark: no lamp, only the daylight spill on the food tops. Shared plate.
//
// The fridge is modelled in the same 3D head units as the arm (front face 0.38 m ahead of his shoulder plane, interior 0.51 m wide) and drawn
// larger than the R1.4 sketch, so the reach is near-straight. Draw order by depth: fridge, shelves, food, box, upper door, then the figure.

/** The card's placement (R1.4 waist cut): back-of-head column 135, head 560 px, chin y 900. */
const HEAD_X = 135, HEAD_PX = 560, CHIN_Y = 900;
const DIR = 1 as const;
/** PJ-ZCP-07 camera: F 1844 at head 0.283 m gives D 0.93 m = 3.29 heads; the axis is the VP (540, 560) in head units. */
export const PJ_B06: Cam3 = {D: 3.29, ax: (540 - HEAD_X) / HEAD_PX, ay: 5 + (CHIN_Y - 560) / HEAD_PX};

/** Fridge body (head units, y up from the floor): front face at depth ZF, back wall at ZB; interior x IX0-IX1, y IY0-IY1; the door on FX1. */
const ZF = 1.35, ZB = 3.2;
const FX0 = -0.2, FX1 = 1.9, IX0 = -0.05, IX1 = 1.75, IY0 = 3.0, IY1 = 6.25;
const SHELVES = [4.1, 5.15];

/** The leftovers box (cooked leftovers, bottom-centre on the shelf at y 4.1 = 1.16 m): the back half and to the right of his right shoulder
 *  (variant B, a near-straight reach); z 2.05 is 0.1 head nearer than the spike (Film 103 % fix, sheet R1.5 MK-ZCP-B5). */
const BOX_W = 0.62, BOX_H = 0.24, BOX_D = 0.42;
const BOX0: V3 = [1.1, 4.1, 2.05];
/** Lift (pf 17-24): the box comes up 0.08 and toward him 0.3. Draw in (pf 24-32, before the door shuts at 32): from there to the chest,
 *  bottom-centre (1.00, 4.34, 0.50) at his right shoulder height, its lid at the caption block's top edge (y 1060). Boss pass 15 (user). */
const LIFT: V3 = [-0.08, 0.08, -0.3];
const DRAW: V3 = [-0.02, 0.16, -1.25];
/** Shoulder lead at full reach (heads): the scapula protracts more for the longer reach (scapulohumeral rhythm). */
const LEAD = 0.35;
/** The shoulder root at full lead (heads: x out, y down, z forward into depth). Boss pass 18 (user: the arm read as wrapping round his neck,
 *  `DF-20261030-zcpaint-b06-shoulder-cap`): at x 0.02 / y 0.06 the projected cap sat inside the back and its top rose 0.14 head above the
 *  shoulder slope beside the neck (pf 18). At (0.14, −0.10) the cap sits on the outer edge of the back (the torso edge at that height is 0.73,
 *  the joint projects to 0.74) and no part of the reach arm clears the slope between the neck and the edge at any pf 0–62. Rest (pf 0–5) is unchanged. */
const SHOULDER_LEAD: V3 = [0.14, -0.1, LEAD];
/** Elbow pole: out to his right, a little down and back (a forward reach opens the elbow to the side and down). */
const POLE: V3 = nrm3([0.75, -0.8, -0.35]);
const W_REST: V3 = [0.9, 2.72, 0.05];
const F_REST: V3 = [0, -1, 0.08];
const N_REST: V3 = [-1, 0, 0];
/** His left hand is hidden (the door hand does not reach): the arm hangs off the frame, as a mitten at BODY-ZCP-6H width. */
const ACROSS = 0.7;

/** The projected reach at shot clock `pf` (Film's phases): door opens 0-6; transport 6-15 (minimum-jerk, the hand arcs out and up, the
 *  shoulder leads, the hand turns palm-in to palm-down-in); grasp 15-17; lift and draw back 17-24; draw in to the chest 24-32 (Boss
 *  pass 15: the arm bends, the elbow drops, the box stays in his right hand through the door's shut at 32-41 and to the last frame).
 *  The box rides with the hand from contact. Returns the arm and the box's bottom-centre. */
export const reachPose = (pf: number): {pose: Reach3; box: V3} => {
  const t = minJerk(segment(pf, 6, 15)), lift = minJerk(segment(pf, 17, 24)), draw = minJerk(segment(pf, 24, 32));
  const boxMove = add3(mul3(LIFT, lift), mul3(DRAW, draw));
  const box = add3(BOX0, boxMove);
  // Grasp from his side of the box: the hand lies on the box top, fingers toward his midline and a little forward, palm down.
  const Fg = nrm3([-1, -0.2, 0.35]);
  const Ng0: V3 = [0, -1, 0];
  const Ng = nrm3(sub3(Ng0, mul3(Fg, dot3(Ng0, Fg))));
  const grip = add3(BOX0, [0.04, BOX_H + 0.05, -0.04]);
  const Wg = sub3(grip, mul3(Fg, 0.2));
  // Transport: a straight line plus an outward and upward arc (the hand never travels a straight line).
  const arc = Math.sin(Math.PI * t);
  const W = add3(add3(lerp3(W_REST, Wg, t), mul3([0.14, 0.12, -0.05], arc)), boxMove);
  const F = nrm3(lerp3(F_REST, Fg, minJerk(segment(pf, 7, 14))));
  const N = nrm3(lerp3(N_REST, Ng, minJerk(segment(pf, 7, 14))));
  const lead = minJerk(segment(pf, 5, 12)) * (1 - 0.4 * lift);
  const S = add3([0.6, 4.4, 0], mul3(SHOULDER_LEAD, lead));
  // Elbow drop on the draw-back: the pole swings from out-and-down to down-and-back, so the forearm lowers instead of standing up.
  const pole = nrm3(lerp3(POLE, [0.35, -1, -0.45], lift));
  return {pose: {S, W, F, N, pole}, box};
};

/** Plate px of a card point (head units on the body plane, the bust placement). */
const REF = placeClose(bustFig(YOU, {view: 'back'}), HEAD_X, HEAD_PX, CHIN_Y, DIR);
const plate = (h: HU): Pt => [REF.gx + REF.k * h[0] * H6, REF.gy - REF.k * h[1] * H6];
const P3 = (p: V3): Pt => plate(proj3(PJ_B06, p));
const quad = (pts: V3[]): Pt[] => pts.map(P3);

/** A box in 3D: only the faces that face the camera, each a flat tone (top lit by the spill, front in cel, sides deeper). */
const box3 = (f: Flat, o: V3, sz: V3, col: string, ink = 1.2) => {
  const [x0, y0, z0] = o, x1 = x0 + sz[0], y1 = y0 + sz[1], z1 = z0 + sz[2];
  const camP: V3 = [PJ_B06.ax, PJ_B06.ay, -PJ_B06.D];
  const faces: {pts: V3[]; n: V3; col: string}[] = [
    {pts: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], n: [0, 0, -1], col: cel(col)},
    {pts: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], n: [0, 1, 0], col},
    {pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], n: [0, -1, 0], col: cel(col, 1.6)},
    {pts: [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], n: [-1, 0, 0], col: cel(col, 1.3)},
    {pts: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], n: [1, 0, 0], col: cel(col, 1.3)},
  ];
  for (const fc of faces) {
    const ctr = mul3(fc.pts.reduce((a, b) => add3(a, b), [0, 0, 0] as V3), 0.25);
    if (dot3(fc.n, sub3(camP, ctr)) <= 0) continue;
    const q = quad(fc.pts);
    f.fill(fc.col, q);
    if (ink > 0) f.line(q, ink);
  }
};

/** The leftovers box with the yogurt cup on top (ready-to-eat only). */
const leftovers = (f: Flat, b: V3) => {
  box3(f, [b[0] - BOX_W / 2, b[1], b[2] - BOX_D / 2], [BOX_W, BOX_H, BOX_D], '#d8c39a', 1.4);
  box3(f, [b[0] - 0.2, b[1] + BOX_H, b[2] - 0.12], [0.24, 0.28, 0.24], '#f4f1ea', 1.0);
};

/** The upper door's swing: 0 shut, 95° open at pf 6; it swings back shut over pf 32-41 (the seal). */
const doorAngle = (pf: number) => (Math.PI * 95) / 180 * (minJerk(segment(pf, 0, 6)) - minJerk(segment(pf, 32, 41)));

const fridge = (f: Flat, pf: number, box: V3) => {
  // Kitchen wall (cream, dim): the whole plate behind the fridge.
  f.fill(dim('#d9ccb0', 1.0), [[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]]);
  // Front panel and the lower door seam.
  f.fill('#e6e3da', quad([[FX0, 0, ZF], [FX1, 0, ZF], [FX1, 6.45, ZF], [FX0, 6.45, ZF]]));
  f.line(quad([[FX0, 0, ZF], [FX1, 0, ZF], [FX1, 6.45, ZF], [FX0, 6.45, ZF]]), 1.0);
  f.line(quad([[FX0, 2.9, ZF], [FX1, 2.9, ZF]]), 1.0, undefined, false);
  // Interior (no lamp): back wall, side walls, ceiling, floor, then the glass shelves (front edge lit by the spill).
  f.fill('#2a313a', quad([[IX0, IY0, ZB], [IX1, IY0, ZB], [IX1, IY1, ZB], [IX0, IY1, ZB]]));
  f.fill('#343d48', quad([[IX0, IY0, ZF], [IX0, IY1, ZF], [IX0, IY1, ZB], [IX0, IY0, ZB]]));
  f.fill('#252b33', quad([[IX1, IY0, ZF], [IX1, IY1, ZF], [IX1, IY1, ZB], [IX1, IY0, ZB]]));
  f.fill('#20262d', quad([[IX0, IY1, ZF], [IX1, IY1, ZF], [IX1, IY1, ZB], [IX0, IY1, ZB]]));
  f.fill('#3c4754', quad([[IX0, IY0, ZF], [IX1, IY0, ZF], [IX1, IY0, ZB], [IX0, IY0, ZB]]));
  for (const y of SHELVES) {
    f.fill('#46515e', quad([[IX0, y, ZF + 0.05], [IX1, y, ZF + 0.05], [IX1, y, ZB], [IX0, y, ZB]]));
    f.line(quad([[IX0, y, ZF + 0.05], [IX1, y, ZF + 0.05]]), 1.6, '#7d8896', false);
  }
  // Food on the shelves (ready-to-eat only): yogurt cups, a cheese block, a fruit box; tops lit by the daylight spill.
  box3(f, [1.0, 5.15, 2.3], [0.3, 0.32, 0.3], '#c9d3dc', 0.8);
  box3(f, [1.35, 5.15, 2.1], [0.28, 0.3, 0.28], '#b9c6cf', 0.8);
  box3(f, [0.0, 4.1, 2.55], [0.45, 0.22, 0.4], '#d6c27a', 0.8);
  box3(f, [0.05, 3.0, 2.2], [0.7, 0.4, 0.6], '#8fa07a', 0.8);
  box3(f, [1.0, 3.0, 2.0], [0.6, 0.35, 0.5], '#c9d3dc', 0.8);
  // Depth order: the box's front face (z) against the door's free edge. The box is painted first while the door is nearer (the open door,
  // and the box still on the shelf behind the door plane); after the door once the box is nearer (shut door, box drawn in to the chest).
  const th = doorAngle(pf), W = FX1 - FX0;
  const fx = FX1 - W * Math.cos(th), fz = ZF - W * Math.sin(th);
  const boxFirst = box[2] - BOX_D / 2 > fz;
  if (boxFirst) leftovers(f, box);
  // The upper door, hinged on the right, swung toward the camera; its inner face with two door bins.
  const door = quad([[FX1, 2.95, ZF], [fx, 2.95, fz], [fx, 6.45, fz], [FX1, 6.45, ZF]]);
  f.fill(th > 0.05 ? '#eeebe2' : '#e6e3da', door);
  f.line(door, 1.0);
  if (th > 0.05) {
    for (const y of [3.6, 4.7]) f.line(quad([[FX1, y, ZF], [fx, y, fz]]), 1.0, cel('#eeebe2', 1.5), false);
  } else {
    f.fill('#6b7079', quad([[fx + 0.04, 4.3, fz - 0.02], [fx + 0.1, 4.3, fz - 0.02], [fx + 0.1, 5.3, fz - 0.02], [fx + 0.04, 5.3, fz - 0.02]]));
  }
  if (!boxFirst) leftovers(f, box);
};

/** The figure: his right arm projected (`reach3`, drawn before the torso in the back view), his left arm hanging off the frame. */
const figure = (q: Reach3): Fig => bustFig(YOU, {
  view: 'back', legs: false, proj: PJ_B06,
  arms: {L: {kind: 'hang', hand: 'mitten', across: ACROSS}, R: {kind: 'reach3', pose: q}},
});

/** B06-SH02 (TH 76 f on `ZCP-B06-SH02-TH`; shared `ZCP-B06-SH02` for EN, cuts at f 45): the fridge open, the arm into depth to the box. */
export const paintB06Sh02 = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 38000);
  const {pose, box} = reachPose(pf);
  fridge(f, pf, box);
  drawFig(ctx, 38400, figure(pose), REF, {light: keyTravel(1, [-0.9, 0.3]), tex: TEX_B});
};
