import type {PaintContext} from '../BrushCanvas';
import {ramp, type Pt} from '../painter';
import {drawFig, figFront, H6, type Part} from './body6';
import {keyTravel} from './bust';
import {YOU} from './cast';
import {ell} from './ctx';
import {cel} from './light';
import {CREAM, dim, flatKit, type Flat} from './sets';

// ZCPAINT B05-SH01 (Boss pass 10; sheet `sc01-b04-b05.md`, SS-R1.3): the bathroom medium, the six capped bottles on the basin counter, the
// cistern, the bucket lift. Per-language keys: TH lift f 20-36 (51 f), EN lift f 36-46 (48 f). The figure is the full 6-head front view
// (`figFront`, the approved S-P12 bucket lift): the shot is a medium, not a close, so the full body stays (the bust is for the closes).

const FLOOR_Y = 1416;
const WALL_BASE = 1101;
const LIFT = {TH: [20, 36], EN: [36, 46]} as const;
/** The bucket's rest point on the floor (plate px, at his right = screen-left) and the lifted box (sheet: x 443-637, y 699-908). */
const BUCKET_FLOOR: Pt = [600, 1330];
/** The bucket's HU insert (S-P12 bucket geometry, head units): the handle at u 3.9, the body from 3.55 to 2.6, a lid at the top. */
const bucketPart = (): Part => ({col: '', pts: [], cel: 0, draw: (p) => {
  const H = H6, pt = (x: number, u: number): Pt => [x * H, -u * H];
  p.part('#7aa0be', [pt(-0.5, 3.55), pt(0.5, 3.55), pt(0.42, 2.6), pt(-0.42, 2.6)], true);
  p.part('#5e7d96', [pt(-0.5, 3.55), pt(-0.36, 3.55), pt(-0.3, 2.6), pt(-0.42, 2.6)], false);
  p.part('#c9c3b4', [pt(-0.52, 3.62), pt(0.52, 3.62), pt(0.5, 3.52), pt(-0.5, 3.52)], true);
  p.ink([pt(-0.36, 3.85), pt(-0.1, 4.02), pt(0.1, 4.02), pt(0.36, 3.85)], 1.4, 0.4);
}});

/** A bottle standing on the counter (flat, capped; the water band lower). */
const bottle = (f: Flat, cx: number, yBase: number) => {
  const w = 44, h = 150;
  f.fill('#c9dedb', [[cx - w / 2, yBase], [cx + w / 2, yBase], [cx + w / 2, yBase - h + 30], [cx + 12, yBase - h], [cx - 12, yBase - h], [cx - w / 2, yBase - h + 30]]);
  f.fill('#9fd0da', [[cx - w / 2 + 3, yBase - 4], [cx + w / 2 - 3, yBase - 4], [cx + w / 2 - 3, yBase - 60], [cx - w / 2 + 3, yBase - 60]]);
  f.fill('#2f6fb0', [[cx - 14, yBase - h - 22], [cx + 14, yBase - h - 22], [cx + 14, yBase - h], [cx - 14, yBase - h]]);
};

/** The shared room: the cream wall, the aqua wainscot to 1.2 m with grout, the window louvre above and behind him, the mirror cabinet,
 *  the basin counter with the six bottles, the cistern and bowl, the floor. Values per the sheet's dressing (`MK-ZC-ST-12`). */
const room = (f: Flat) => {
  const wall = dim('#d9ccb0', 0.8), tile = dim('#bfd9d4', 0.8), grout = dim('#a9c4bf', 0.8);
  f.fill(wall, [[-100, -100], [1200, -100], [1200, WALL_BASE], [-100, WALL_BASE]]);
  f.fill(tile, [[-100, 880], [1200, 880], [1200, WALL_BASE], [-100, WALL_BASE]]);
  for (let y = 940; y < WALL_BASE; y += 70) f.line([[-100, y], [1200, y]], 0.5, grout, false);
  for (let x = 0; x < 1200; x += 110) f.line([[x, 880], [x, WALL_BASE]], 0.5, grout, false);
  f.line([[-100, 880], [1200, 880]], 0.9, grout, false);
  // The louvre window above and behind him (KEY-INS-DAY): pale slats.
  f.fill('#f0efe6', [[700, 90], [980, 90], [980, 260], [700, 260]]);
  for (let y = 110; y < 260; y += 22) f.line([[706, y], [974, y]], 0.5, '#c9c5b6', false);
  // Mirror cabinet over the basin (wood, mirror panel).
  f.fill(dim('#b99c72', 0.9), [[185, 295], [420, 295], [420, 590], [185, 590]]);
  f.fill(dim('#c3d3d2', 0.9), [[210, 320], [395, 320], [395, 560], [210, 560]]);
  f.line([[210, 320], [395, 320], [395, 560], [210, 560]], 0.9);
  // Towel rail behind the torso (mustard towel).
  f.fill('#cfcac0', [[590, 630], [900, 630], [900, 642], [590, 642]]);
  f.fill(dim('#c9a04a', 0.9), [[600, 642], [640, 642], [640, 700], [600, 700]]);
  // Cistern (top y 862, x 470-670) and bowl.
  f.fill(dim('#e6e3da', 0.9), [[470, 862], [670, 862], [670, 1060], [470, 1060]]);
  f.fill(cel(dim('#e6e3da', 0.9)), [[600, 862], [670, 862], [670, 1060], [600, 1060]]);
  f.line([[470, 862], [670, 862], [670, 1060], [470, 1060]], 1.0);
  f.fill(dim('#e6e3da', 0.9), ell(560, 1060, 110, 36, 18));
  // Basin counter: top lit, the front in cel; the six bottles stand on the top (x 140-450).
  f.fill(dim('#e6e3da', 0.9), [[140, 826], [450, 826], [450, 846], [140, 846]]);
  f.fill(dim('#e6e3da', 0.9), [[140, 846], [450, 846], [450, 1010], [140, 1010]]);
  f.fill(cel(dim('#e6e3da', 0.9)), [[140, 930], [450, 930], [450, 1010], [140, 1010]]);
  f.line([[140, 826], [450, 826], [450, 1010], [140, 1010]], 1.0);
  for (let i = 0; i < 6; i++) bottle(f, 170 + i * 52, 826);
  // Floor (cast tone under the figure is painted by the figure's `floor` option).
  f.fill(dim(CREAM.tile, 0.9), [[-100, WALL_BASE], [1200, WALL_BASE], [1200, 2000], [-100, 2000]]);
  f.line([[-100, WALL_BASE], [1200, WALL_BASE]], 1.0);
};

/** B05-SH01 (TH 51 f, EN 48 f): lift from the floor to the chest by the language's key; the bucket is on the floor before the lift. */
export const paintB05Sh01 = (ctx: PaintContext, pf: number, lang: 'TH' | 'EN') => {
  const f = flatKit(ctx, 37000);
  room(f);
  const [a, b] = LIFT[lang];
  const lift = ramp(pf, a, b);
  const lifted = lift >= 0.5;
  const fig = figFront(YOU, {arms: lifted ? 'bucket' : 'hang', inserts: lifted ? [bucketPart()] : []});
  const k = 186 / H6;
  drawFig(ctx, 37400, fig, {gx: 738, gy: FLOOR_Y, k, dir: 1}, {floor: dim(CREAM.tile, 0.9), light: keyTravel(1, [0.1, 1])});
  if (!lifted) {
    // The bucket on the floor at his right (screen-left), lidded, in front of the leg.
    const f2 = flatKit(ctx, 37500);
    f2.fill('#7aa0be', [[BUCKET_FLOOR[0] - 60, BUCKET_FLOOR[1] - 130], [BUCKET_FLOOR[0] + 60, BUCKET_FLOOR[1] - 130], [BUCKET_FLOOR[0] + 66, BUCKET_FLOOR[1]], [BUCKET_FLOOR[0] - 66, BUCKET_FLOOR[1]]]);
    f2.fill('#c9c3b4', [[BUCKET_FLOOR[0] - 64, BUCKET_FLOOR[1] - 138], [BUCKET_FLOOR[0] + 64, BUCKET_FLOOR[1] - 138], [BUCKET_FLOOR[0] + 60, BUCKET_FLOOR[1] - 126], [BUCKET_FLOOR[0] - 60, BUCKET_FLOOR[1] - 126]]);
  }
};
