import type {PaintContext} from '../BrushCanvas';
import {ramp, type Pt} from '../kit/painter';
import {FACES, type Face} from '../spike/FaceSheet';
import {drawFig, H6, TEX_B, type Fig} from './body6';
import {bustFig, keyTravel, placeClose} from './bust';
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
/** R1.4 waist cut (`FR-ZCP-CLOSE`, the stopped pass 11 framing): head centre column 515, head 587 px, chin y 1002; the heave is ±11 px. */
const CLOSE_X = 515, CLOSE_HEAD_PX = 587, CLOSE_CHIN_Y = 1002, HEAVE_PX = 11;

/** The R1.4 cabinet behind his chest: top edge y 1455, lit lip y 1455-1477, front in cel to the frame bottom. It spans the frame, so the lip
 *  shows only beside the shoulders (his torso covers x 15-1015). Knobs sit behind the torso (y 1600). */
const B02_SH03_CABINET: CabinetR25 = {far: 1455, near: 1477, lip: 22, fx0: -100, fx1: 1200, x0: -100, x1: 1200, knobY: 1600};

/** Entry lamp above the door (`KEY-ENT-PWR`): the light travels straight down the frame, so the cel sits under each shape. */
const KEY_ENT = keyTravel(1, [0, 1]);

/** B02-SH03 (shared plate, pf 0-83; TH fromSec 0.7 so its freeze is pf 39 = TH f 18, EN fromSec 0 so it is EN f 39). Pass 10: the bust. */
export const paintB02Sh03 = (ctx: PaintContext, pf: number) => {
  const f: Flat = flatKit(ctx, 23000);
  // Door face behind his head (plain cream, no panel near the head, y 0-1455) and the cabinet behind his chest.
  f.fill('#d9ccb0', [[-100, -100], [1200, -100], [1200, B02_SH03_CABINET.far], [-100, B02_SH03_CABINET.far]]);
  paintCabinetR25(f, B02_SH03_CABINET);
  // The breathing heave before the freeze: the whole figure moves ±11 px at 1.2 Hz; after the freeze the body is still.
  const frozen = pf >= FREEZE_PF;
  const breath = frozen ? 0 : HEAVE_PX * Math.sin(2 * Math.PI * 1.2 * (pf / FPS));
  const face = frozen ? SCARED : {...HEAVE, look: (Math.floor(pf / 12) % 2 === 0 ? [-0.6, 0] : [-0.2, -0.2]) as [number, number]};
  const fig = bustFig(YOU, {view: 'front', face, blink: false});
  drawFig(ctx, 23400, fig, placeClose(fig, CLOSE_X, CLOSE_HEAD_PX, CLOSE_CHIN_Y + breath, 1), {light: KEY_ENT, tex: TEX_B});
};

// ---------------------------------------------------------------- B07-SH01: the hand stops at the stove (profile close)

/** Staging (R1.4, `FR-ZCP-CLOSE` prop default): profile facing screen-left, chin y 760 at a 600 px head. The eye (560, 430) sets the column:
 *  the profile eye sits 0.72 K in front of the head centre, so the centre is x 750. The case x 30-400 stands on the shelf edge y 1030. */
const B07_CHIN_Y = 760, B07_HEAD_PX = 600, B07_CX = 750;
const B07_DIR = -1 as const;
/** The placement is the same for every frame: the head offsets of the standing profile do not move with the arm. */
const B07_BUST = bustFig(YOU, {view: 'side'});
const B07_PLACE = placeClose(B07_BUST, B07_CX, B07_HEAD_PX, B07_CHIN_Y, B07_DIR);
/** Grip point of the case clasp (plate px, its right edge): the fingertips meet it at pf 40 (TH f 25 / EN f 13). */
const B07_CLASP: Pt = [384, 921];
/** Boss pass 19 (user: the pinch looked odd): a mitten rests on the case front, fingers forward and a little down, the thumb lobe on top
 *  beside the clasp, the wrist and sleeve cuff behind it. `to` is the wrist plus 0.17 head along these fingers (`reachPts`). The forearm
 *  rises from the elbow below, so no frame has a raised or wai pose. */
const B07_LAY = 1.15; // rad: the hand folds forward at the wrist
/** The hand's rest point at his side (plate px): the hanging near wrist, below the frame; the arm hangs there at pf 0 and after pf 75. */
const B07_REST: Pt = (() => {
  const [wx, wy] = B07_BUST.anchors.hands[0];
  return [B07_PLACE.gx + B07_DIR * B07_PLACE.k * wx, B07_PLACE.gy + B07_PLACE.k * wy];
})();
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
  const stop: Pt = [B07_CLASP[0] + 30, B07_CLASP[1] - 20]; // wrist ≈ 0.17 head behind: the mitten lies over the clasp
  return [B07_REST[0] + (stop[0] - B07_REST[0]) * e, B07_REST[1] + (stop[1] - B07_REST[1]) * e];
};

/** B07-SH01 (shared plate, 141 frames; TH fromSec 0.5 = pf f + 15, EN fromSec 0.9 = pf f + 27). Kitchenette light from the screen-right window. */
export const paintB07Sh01 = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 26000);
  // Kitchenette wall, the warm wood shelf edge at y 1030 (the accent), the cabinet front below it.
  f.fill(dim('#d9ccb0', 1.0), [[-100, -100], [1200, -100], [1200, 1030], [-100, 1030]]);
  f.fill(dim('#cfc2a6', 1.0), [[-100, 1030], [1200, 1030], [1200, 2000], [-100, 2000]]);
  f.fill('#b99c72', [[-100, 1030], [1200, 1030], [1200, 1058], [-100, 1058]]);
  f.line([[-100, 1030], [1200, 1030]], 1.2);
  // The boxed camp stove on the shelf (R1.4: x 30-400, y 830-1030): closed case, unbranded, no canister, no pot; top lit, front in cel,
  // a plain shadow on the shelf.
  const caseTop = '#6d737a', caseFront = '#4a4f55';
  f.fill(castTone('#b99c72'), [[40, 1030], [410, 1030], [410, 1054], [40, 1054]]);
  f.fill(caseFront, [[30, 830], [400, 830], [400, 1030], [30, 1030]]);
  f.fill(caseTop, [[30, 830], [400, 830], [390, 812], [40, 812]]);
  f.fill(cel(caseFront), [[30, 950], [400, 950], [400, 1030], [30, 1030]]);
  f.line([[30, 830], [400, 830], [400, 1030], [30, 1030]], 1.0);
  f.fill('#2f3439', [[356, 893], [384, 893], [384, 949], [356, 949]]); // the clasp
  // The figure: profile, facing screen-left, the near arm reaching to the clasp (pinch). Head offsets are fixed; the target moves.
  const grip = b07Grip(pf);
  const face = pf < 48 ? B07_THINK : pf < 75 ? B07_STOP : B07_DOWN;
  const to = toHU(B07_PLACE, grip);
  const fig = bustFig(YOU, {view: 'side', face, blink: true, blinkAt: B07_BLINK_AT, arms: {R: {kind: 'reach', to, hand: 'mitten', across: 0.75, bend: -1, lay: B07_LAY}}});
  drawFig(ctx, 26400, fig, B07_PLACE, {light: keyTravel(B07_DIR, [-1, 0.25]), floor: dim(CREAM.tile, 1.0), tex: TEX_B});
};

// ---------------------------------------------------------------- B09-SH02: the face close before the knock (seated profile)

/** B09-SH02 (held plate, fromSec 0; sheet SS-R1.4 FR-ZCP-CLOSE, carried by R1.5): head centre (560, 720) at a 600 px head (face y 420-1020);
 *  the knees, crossed forearms and fists in the lower frame. Boss pass 15 moves the R1.3 framing (540, 610; 360 px) to this one: the R1.3
 *  floor line and the bare foot were in frame, which the sheet's acceptance rules out. */
const B09_HEAD = {x: 560, y: 720, px: 600};
/** Day three: the entry wall (B09 light 0.6), the balcony behind him at screen right (`KEY-B09-POV`, low daylight). The floor line is below
 *  the frame (sheet R1.4: "the floor line and his feet below the frame bottom"). */
const B09_FLOOR_Y = 1960;

export const paintB09Sh02 = (ctx: PaintContext) => {
  const f = flatKit(ctx, 27000);
  f.fill(dim('#d9ccb0', 0.5), [[-100, -100], [1200, -100], [1200, B09_FLOOR_Y], [-100, B09_FLOOR_Y]]);
  f.fill(dim('#d9ccb0', 0.85), [[700, -100], [1200, -100], [1200, B09_FLOOR_Y], [700, B09_FLOOR_Y]]);
  f.fill(dim(CREAM.tile, 0.6), [[-100, B09_FLOOR_Y], [1200, B09_FLOOR_Y], [1200, 2000], [-100, 2000]]);
  const fig = bustFig(YOU_DAY3, {view: 'side', seated: true, pitch: 0, overlay: 'day3', face: ZC_FACES.tired, blink: true, blinkAt: 10 / FPS});
  const k = B09_HEAD.px / H6;
  drawFig(ctx, 27400, fig, {gx: B09_HEAD.x - k * fig.head.x, gy: B09_HEAD.y - k * fig.head.y, k, dir: 1}, {light: keyTravel(1, [1, 0.15]), tex: TEX_B});
};

