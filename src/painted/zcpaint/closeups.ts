import type {PaintContext} from '../BrushCanvas';
import {ramp, type Pt} from '../painter';
import {FACES, type Face} from '../spike/FaceSheet';
import {drawFig, H6, K6, type Fig} from './body6';
import {bustFig, keyTravel} from './bust';
import {YOU, YOU_DAY3, ZC_FACES} from './cast';
import {CREAM, dim, flatKit, type Flat} from './sets';
import {paintCabinetR25, type CabinetR25} from './pov';
import {castTone, cel} from './light';

// ZCPAINT close plates. Boss pass 10 (user 30 Oct 2026: "วาดตัวช็อตใกล้แยก"): the close shots use the half-body bust (`bust.ts`) instead of
// the full 6-head body scaled up. B02-SH03 (his face close), B07-SH01 (the profile reach and the pinch on the stove case) and B09-SH02 (the
// seated profile before the knock). Sheet values from `sc01-b01-b03.md`, `sc01-b06-b08.md` and `sc01-b09-b10.md` (SS-R1.3). Flat fills.

const FPS = 30;

/** Figure placed so its head centre lands on (cx, cy) at scale `k`, facing `dir` (the head's local offset scales with k). */
export const placeHead = (fig: Fig, cx: number, cy: number, k: number, dir: 1 | -1) => ({gx: cx - dir * k * fig.head.x, gy: cy - k * fig.head.y, k, dir});

// ---------------------------------------------------------------- B02-SH03: the freeze (face close)

/** The sheet's faces: the heave (eyes dart between two looks, mouth wavy) and the freeze at pf 39 (worry brows, wide eyes, mouth shut). */
const HEAVE: Face = {name: 'heave', brow: 'flat', eyes: 'dot', look: [-0.6, 0], mouth: 'wavy'};
const SCARED: Face = {name: 'scared', brow: 'worry', eyes: 'wide', look: [-0.8, -0.3], mouth: 'flat'};
/** The freeze lands at pf 39 (TH f 18 with fromSec 0.7; EN f 39); the heave is 1.2 Hz shoulder breath before it. */
const FREEZE_PF = 39;
/** The sheet's head size: K 142 (the decal K), so the figure scale is K / K6 (head 322 px). */
const CLOSE_K = 142;

/** The R2.5 cabinet behind him: top far edge y 850, lit lip y 850-872, front in cel to the frame bottom; x 150-930. */
const B02_SH03_CABINET: CabinetR25 = {far: 850, near: 872, lip: 22, fx0: 150, fx1: 930, x0: 150, x1: 930, knobY: 1150};

/** Entry lamp above the door (`KEY-ENT-PWR`): the light travels straight down the frame, so the cel sits under each shape. */
const KEY_ENT = keyTravel(1, [0, 1]);

/** B02-SH03 (shared plate, pf 0-83; TH fromSec 0.7 so its freeze is pf 39 = TH f 18, EN fromSec 0 so it is EN f 39). Pass 10: the bust. */
export const paintB02Sh03 = (ctx: PaintContext, pf: number) => {
  const f: Flat = flatKit(ctx, 23000);
  // Door face behind his head (plain cream, no panel near the head) and the cabinet behind his upper arms.
  f.fill('#d9ccb0', [[-100, -100], [1200, -100], [1200, 850], [-100, 850]]);
  paintCabinetR25(f, B02_SH03_CABINET);
  // The breathing heave before the freeze: the whole figure moves about 6 px at 1.2 Hz; after the freeze the body is still.
  const frozen = pf >= FREEZE_PF;
  const breath = frozen ? 0 : 6 * Math.sin(2 * Math.PI * 1.2 * (pf / FPS));
  const face = frozen ? SCARED : {...HEAVE, look: (Math.floor(pf / 12) % 2 === 0 ? [-0.6, 0] : [-0.2, -0.2]) as [number, number]};
  const fig = bustFig(YOU, {view: 'front', face, blink: false});
  drawFig(ctx, 23400, fig, placeHead(fig, 515, 440 + breath, CLOSE_K / K6, 1), {light: KEY_ENT});
};

// ---------------------------------------------------------------- B07-SH01: the hand stops at the stove (profile close)

/** Staging (sheet): profile facing screen-left, head centre (695, 430) at a 260 px head; the case x 160-480 on the shelf (clasp at its right). */
const B07_HEAD = {x: 695, y: 430, px: 260};
const B07_DIR = -1 as const;
const B07_K = B07_HEAD.px / H6;
/** The placement is the same for every frame: the head offsets of the standing profile do not move with the arm. */
const B07_PLACE = placeHead(bustFig(YOU, {view: 'side'}), B07_HEAD.x, B07_HEAD.y, B07_K, B07_DIR);
/** Grip point of the case clasp (plate px): the fingertips meet it at pf 40 (TH f 25 / EN f 13). */
const B07_CLASP: Pt = [470, 592];
/** The hand's rest point at his side (plate px), where the arm hangs at pf 0 and after pf 75. */
const B07_REST: Pt = [742, 1086];
/** Faces: thinking while he reaches, worry and wide eyes on the stop, eyes half down from pf 75 (the sheet's keys). */
const B07_THINK = FACES[3];
const B07_STOP: Face = {name: 'stop', brow: 'worry', eyes: 'wide', look: [0, 0], mouth: 'flat'};
const B07_DOWN: Face = {name: 'down', brow: 'flat', eyes: 'half', look: [0, 0.6], mouth: 'flat'};
/** One blink, early (pf 12), none in pf 40-75 (the sheet's blink rule). */
const B07_BLINK_AT = 12 / FPS;

/** Plate px to the figure's head units, through the placement `pl` (inverse of `placeHead` for a point on the figure's plane). */
export const toHU = (pl: {gx: number; gy: number; k: number; dir: 1 | -1}, p: Pt): [number, number] => [(p[0] - pl.gx) / (pl.dir * pl.k) / H6, -(p[1] - pl.gy) / (pl.k * H6)];

/** Grip point over the plate frame: rest to the clasp (pf 15-45, eased), held to pf 57 (the stop at 48 sits 2 cm off the clasp), back by 75. */
export const b07Grip = (pf: number): Pt => {
  const s = ramp(pf, 15, 45) * (1 - ramp(pf, 57, 75));
  const e = s * s * (3 - 2 * s);
  const stop: Pt = [B07_CLASP[0] + 26, B07_CLASP[1]];
  return [B07_REST[0] + (stop[0] - B07_REST[0]) * e, B07_REST[1] + (stop[1] - B07_REST[1]) * e];
};

/** B07-SH01 (shared plate, 141 frames; TH fromSec 0.5 = pf f + 15, EN fromSec 0.9 = pf f + 27). Kitchenette light from the screen-right window. */
export const paintB07Sh01 = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 26000);
  // Kitchenette wall, the warm wood shelf edge at y 640 (the accent), the floor below the figure's feet.
  f.fill(dim('#d9ccb0', 1.0), [[-100, -100], [1200, -100], [1200, 640], [-100, 640]]);
  f.fill(dim('#cfc2a6', 1.0), [[-100, 640], [1200, 640], [1200, 2000], [-100, 2000]]);
  f.fill('#b99c72', [[-100, 640], [1200, 640], [1200, 668], [-100, 668]]);
  f.line([[-100, 640], [1200, 640]], 1.2);
  // The boxed camp stove on the shelf: closed case, unbranded, no canister, no pot; top lit, front in cel, a plain shadow on the shelf.
  const caseTop = '#6d737a', caseFront = '#4a4f55';
  f.fill(castTone('#b99c72'), [[170, 640], [490, 640], [490, 662], [170, 662]]);
  f.fill(caseFront, [[160, 540], [480, 540], [480, 640], [160, 640]]);
  f.fill(caseTop, [[160, 540], [480, 540], [470, 522], [170, 522]]);
  f.fill(cel(caseFront), [[160, 600], [480, 600], [480, 640], [160, 640]]);
  f.line([[160, 540], [480, 540], [480, 640], [160, 640]], 1.0);
  f.fill('#2f3439', [[446, 572], [470, 572], [470, 600], [446, 600]]); // the clasp
  // The figure: profile, facing screen-left, the near arm reaching to the clasp (pinch). Head offsets are fixed; the target moves.
  const grip = b07Grip(pf);
  const face = pf < 48 ? B07_THINK : pf < 75 ? B07_STOP : B07_DOWN;
  const to = toHU(B07_PLACE, grip);
  const fig = bustFig(YOU, {view: 'side', face, blink: true, blinkAt: B07_BLINK_AT, arms: {R: {kind: 'reach', to, hand: 'pinch', bend: -1}}});
  drawFig(ctx, 26400, fig, B07_PLACE, {light: keyTravel(B07_DIR, [-1, 0.25]), floor: dim(CREAM.tile, 1.0)});
};

// ---------------------------------------------------------------- B09-SH02: the face close before the knock (seated profile)

/** B09-SH02 (held plate, fromSec 0): head centre (540, 610) at a 360 px head; the knees, crossed forearms and fists in the lower frame. */
const B09_HEAD = {x: 540, y: 610, px: 360};
/** Day three: the entry wall (B09 light 0.6), the balcony behind him at screen right (`KEY-B09-POV`, low daylight), the floor below y 1290. */
const B09_FLOOR_Y = 1290;

export const paintB09Sh02 = (ctx: PaintContext) => {
  const f = flatKit(ctx, 27000);
  f.fill(dim('#d9ccb0', 0.5), [[-100, -100], [1200, -100], [1200, B09_FLOOR_Y], [-100, B09_FLOOR_Y]]);
  f.fill(dim('#d9ccb0', 0.85), [[700, -100], [1200, -100], [1200, B09_FLOOR_Y], [700, B09_FLOOR_Y]]);
  f.fill(dim(CREAM.tile, 0.6), [[-100, B09_FLOOR_Y], [1200, B09_FLOOR_Y], [1200, 2000], [-100, 2000]]);
  const fig = bustFig(YOU_DAY3, {view: 'side', seated: true, pitch: 0, overlay: 'day3', face: ZC_FACES.tired, blink: true, blinkAt: 10 / FPS});
  const k = B09_HEAD.px / H6;
  drawFig(ctx, 27400, fig, {gx: B09_HEAD.x - k * fig.head.x, gy: B09_HEAD.y - k * fig.head.y, k, dir: 1}, {light: keyTravel(1, [1, 0.15])});
};

