import type {PaintContext} from '../BrushCanvas';
import {hash} from '../hash';
import {ramp, type Pt} from '../painter';
import {drawFig, figSlack, H6, K6, toPx, type Fig, type Part} from './body6';
import {bustFig, keyTravel} from './bust';
import {INFECTED, INFECTED_SCALE, YOU} from './cast';
import {layerAt} from './ctx';
import {flatKit, type Flat} from './sets';

// ZCPAINT corridor plates (Boss pass 9): B01-SH01 (over his right shoulder down the powered corridor) and B01-SH02 (the long-lens turn,
// the rage face, the charge at the lens). One-point perspective `PERSP-2D` (F 1844 px, eye 1.60 m, VP (600, 560), the sheet's staging),
// on the R2 cream corridor key: walls #b9b19b, ceiling #aaa392, floor #3f3a33, window #e9e4d4, veil #7e7a6c. The infected is the 6-head
// `figSlack` body (BODY-ZCP-6H, left to gravity). Flat fills only (the flat-fill rule); haze is translucent flat washes laid far to near.

const VP: Pt = [600, 560];
const F = 1844;
const EYE = 1.6;
const PX_M = 447;
/** Corridor point: lateral x (m, +right), height y (m), depth d (m from the camera plane). */
const C = (x: number, y: number, d: number): Pt => [VP[0] + (x * F) / d, VP[1] - ((y - EYE) * F) / d];

const KEY = {
  wall: '#b9b19b', wallShade: '#a9a28c', ceiling: '#aaa392', floor: '#3f3a33', window: '#e9e4d4', veil: '#7e7a6c',
  door: '#8f8369', doorFrame: '#c9bfa5', strip: '#f3f1e6', stripOff: '#b9b6a6', stripDead: '#6f6c60',
};
/** Infected silhouette colour (texture-free, one colour; B01-SH01 and the B01-SH02 profile). */
const SILHOUETTE = '#21272a';
/** Drag trail (blood, `VD-ZC-GORE`): a dark smear on the floor, not legible as blood at 270 px. */
const BLOOD_DARK = '#3a1515';
/** Trash bag (dark plastic) in the right hand, B01-SH01 only (`MK-ZC-ST-07`). */
const BAG = '#3d4340';
/** Haze planes (depth m, opacity): each veils the corridor beyond its depth; painted far to near so the bands stack. */
const HAZE: readonly [number, number][] = [[12.5, 0.7], [9, 0.55], [6, 0.4]];
const FAR = 15;

/** Translucent flat veil over a region: one wash, no texture. */
const veil = (ctx: PaintContext, color: string, alpha: number, pts: Pt[]) => {
  const {brush} = ctx;
  brush.noStroke();
  brush.noFill();
  brush.wash(color, Math.round(255 * alpha));
  brush.polygon(pts);
  brush.noWash();
};

/** Place a figure so its head centre lands on (cx, cy) at scale `k` (head units of the fig's local px), facing `dir`. */
const placeHead = (fig: Fig, cx: number, cy: number, k: number, dir: 1 | -1) => ({gx: cx - dir * k * fig.head.x, gy: cy - k * fig.head.y, k, dir});

/** The corridor shell (far to near): ceiling, walls, floor and the far window; the doors (no peepholes, CL05); the four strips. */
const shell = (f: Flat, strip2Off: boolean) => {
  const near = 0.6;
  f.fill(KEY.ceiling, [C(-0.9, 2.6, near), C(0.9, 2.6, near), C(0.9, 2.6, FAR), C(-0.9, 2.6, FAR)]);
  f.fill(KEY.wall, [C(-0.9, 0, near), C(-0.9, 2.6, near), C(-0.9, 2.6, FAR), C(-0.9, 0, FAR)]);
  f.fill(KEY.wallShade, [C(0.9, 0, near), C(0.9, 2.6, near), C(0.9, 2.6, FAR), C(0.9, 0, FAR)]);
  f.fill(KEY.floor, [C(-0.9, 0, near), C(0.9, 0, near), C(0.9, 0, FAR), C(-0.9, 0, FAR)]);
  f.fill(KEY.window, [C(-0.9, 2.6, FAR), C(0.9, 2.6, FAR), C(0.9, 0, FAR), C(-0.9, 0, FAR)]);
  for (const [side, d] of [[-1, 3.2], [1, 5.0], [-1, 7.6], [1, 9.8], [-1, 12.2]] as const) {
    const x = side * 0.9;
    f.fill(KEY.doorFrame, [C(x, 0, d), C(x, 2.1, d), C(x, 2.1, d + 0.9), C(x, 0, d + 0.9)]);
    f.fill(KEY.door, [C(x, 0, d + 0.05), C(x, 2.05, d + 0.05), C(x, 2.05, d + 0.85), C(x, 0, d + 0.85)]);
  }
  // Strips at d 3, 6, 9, 12: strip 2 (d 6) flickers in the ceiling values only; strip 4 (d 12, above her) is dead.
  [3, 6, 9, 12].forEach((d, i) => {
    const col = i === 3 ? KEY.stripDead : i === 1 && strip2Off ? KEY.stripOff : KEY.strip;
    f.fill(col, [C(-0.1, 2.59, d), C(0.1, 2.59, d), C(0.1, 2.59, d + 1.2), C(-0.1, 2.59, d + 1.2)]);
  });
};

/** The haze stack: each veil covers the corridor beyond its depth (far plane first, so the bands carry the veils beyond them). */
const haze = (ctx: PaintContext) => {
  for (const [d0, alpha] of HAZE) veil(ctx, KEY.veil, alpha, [C(-0.9, 2.6, d0), C(0.9, 2.6, d0), C(0.9, 0, d0), C(-0.9, 0, d0), C(-0.9, 0, FAR), C(-0.9, 2.6, FAR), C(0.9, 2.6, FAR), C(0.9, 0, FAR)]);
};

/** The bag in the right hand (plate px knot ~(500, 1340), body to ~(620, 1700)) as one part in the back view's head units. */
const bagPart = (): Part => ({col: BAG, cel: 0.12 * H6, pts: toPx([[0.8, 2.4], [1.02, 2.42], [1.3, 1.62], [1.36, 0.95], [1.1, 0.78], [0.86, 1.1], [0.78, 1.7]])});

// ---------------------------------------------------------------- B01-SH01: OTS down the corridor

/** His back view: head centre (250, 440) at pf 0, (290, 420) by pf 29 (eased, one shoulder bob), head ~280 px (K ~ 123). */
const OTS = {x0: 250, y0: 440, x1: 290, y1: 420, head: 280};
const otsCentre = (pf: number): Pt => {
  const t = ramp(pf, 0, 29), s = t * t * (3 - 2 * t);
  return [OTS.x0 + (OTS.x1 - OTS.x0) * s, OTS.y0 + (OTS.y1 - OTS.y0) * s - 4 * Math.sin(Math.PI * t)];
};

/** B01-SH01 (TH and EN share one paint: plate frame pf = f). The camera is the plate's (`pushCamera` 1.000 -> 1.035 about (640, 690)). */
export const paintB01Sh01 = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 21000);
  shell(f, hash(Math.floor((pf / 30) * 8) + 17) > 0.62);
  haze(ctx);
  // Drag trail (static) from her feet toward the camera, d 11.8 -> 8.8 m.
  veil(ctx, BLOOD_DARK, 0.6, [C(-0.08, 0, 11.8), C(0.0, 0, 11.8), C(0.1, 0, 9.6), C(0.06, 0, 8.8), C(0.02, 0, 9.5)]);
  // Her: the silhouette at 12 m, facing screen-left, the body left to gravity (`figSlack`), one colour, no features.
  const her = figSlack(INFECTED, {view: 'side', slump: 1});
  const [hx, hy] = C(0.15, 0, 12);
  const kHer = ((F / 12) / PX_M) * INFECTED_SCALE;
  drawFig(ctx, 21400, her, {gx: hx, gy: hy, k: kHer, dir: -1}, {sil: SILHOUETTE});
  // Her shadow (estimate, ~3 m toward the camera along the floor): one flat tone over the drag trail.
  veil(ctx, '#1f1c22', 0.35, [[hx - 22, hy], [hx + 24, hy], [hx + 30, hy + 70], [hx - 4, hy + 82], [hx - 26, hy + 40]]);
  // His back view, 6 heads, foreground left third; the right arm (screen-right) carries the bag; the head and shoulders are ink-lined.
  const [cx, cy] = otsCentre(pf);
  const back = bustFig(YOU, {view: 'back', inserts: [bagPart()]});
  const kOts = OTS.head / H6;
  drawFig(ctx, 21700, back, placeHead(back, cx, cy, kOts, 1), {light: keyTravel(1, [0.15, 1])});
};

// ---------------------------------------------------------------- B01-SH02: the long-lens turn and the charge

/** Head size of the long-lens figure: K 220 (the decal K at 6 heads is K6 = 55.8 px at scale 1; the head is ~500 px). */
const LENS_K = 220;
const LENS_HEAD = {x: 540, y: 560};
/** The stride bob (plate frames): a 6 px drop on each footstep frame of the charge. */
const STEPS = [33, 38, 42, 46];

/** B01-SH02 (TH [105,153), EN [93,141), both pf = f). Profile silhouette to f 23, the rage front from f 23 (a hair smear f 19-23), the
 *  charge from f 33: scale 1.00 -> 1.12 about the head centre, eased, with the stride bob. The settle tilt (4 deg -> 0) is not painted. */
export const paintB01Sh02 = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 22000);
  // Far end of the corridor behind her: cream wall, the far window at x 60-250, y 160-620, under the veil.
  f.fill(KEY.wall, [[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]]);
  f.fill(KEY.window, [[60, 160], [250, 160], [250, 620], [60, 620]]);
  veil(ctx, KEY.veil, 0.5, [[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]]);
  const e = ramp(pf, 33, 47), s = 1 + 0.12 * e * e * (3 - 2 * e);
  const bob = STEPS.some((x) => pf >= x && pf < x + 2) ? -6 : 0;
  layerAt(ctx.brush, LENS_HEAD.x, LENS_HEAD.y, s, bob, () => {
    if (pf < 23) {
      const side = bustFig(INFECTED, {view: 'side', slump: 1});
      const k = LENS_K / K6;
      drawFig(ctx, 22400, side, placeHead(side, LENS_HEAD.x, LENS_HEAD.y, k, -1), {sil: SILHOUETTE});
    } else {
      const front = bustFig(INFECTED, {view: 'front', slump: 1, overlay: 'rage', blood: true, dirt: true});
      drawFig(ctx, 22500, front, placeHead(front, LENS_HEAD.x, LENS_HEAD.y, LENS_K / K6, 1), {light: keyTravel(1, [0.1, 1])});
    }
  });
  if (pf >= 19 && pf < 23) veil(ctx, '#14110f', 0.85, [[400, 470], [700, 420], [712, 540], [410, 600]]);
};
