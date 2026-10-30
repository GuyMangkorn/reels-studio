import type {PaintContext} from '../BrushCanvas';
import {clamp01, lerp, mixColor, ramp, type Pt} from '../painter';
import {ZC_HAND, type PovHand} from '../hands';
import {ell, INK} from './ctx';
import {flatKit, CREAM, type Flat} from './sets';
import {joltAt, poundJoltPlateFrames, type Lang} from './jolts';
import {trackHand, type Key} from './pose';
import {CORRIDOR_LIGHT, paintCabinet, paintDoorScene, palmHand, hookHand, pinchHand, povHand} from './pov';

// ZCPAINT first-person plates (S-P10, Boss pass 5): B02-SH01, B02-SH02, B03-SH01 and B09-SH02B, each a pure function of
// its plate clock (plate frame pf = tl x 30; per-language keys where the sheets lock words to the picture). The SVG
// parts (corridor light line, thumb-turn, lamp glows) are in `overlays.tsx`; they read the same state functions here.

const BAG = '#3f4a45';
const squeezeOf = (age: number) => (age < 6 ? 0.5 * Math.exp(-0.8 * age) : 0);

/** Pound jolt state of one shot at its plate frame (from the seeded list in `jolts.ts`): kick px, shudder and press 0..1. */
export const poundState = (lang: Lang, shot: 'SH01' | 'SH02', pf: number) => {
  const j = joltAt(poundJoltPlateFrames(lang, shot), pf);
  return {kick: j?.kick ?? 0, shudder: j?.shudder ?? false, press: j ? squeezeOf(j.age) : 0};
};

// ---------------------------------------------------------------- B02-SH01: shut and lock

/** B02-SH01 keys per language (plate frames): the right hand reaches the thumb-turn and the bolt turns (sheet, f 3-5 /
 *  f 14-17 for the rise; bolt 4-7 TH / 17-21 EN). The slam lands at f 2 in both. */
export const B02_SH01_KEYS: Record<Lang, {rise: number; bolt: [number, number]}> = {
  TH: {rise: 5, bolt: [4, 7]},
  EN: {rise: 17, bolt: [17, 21]},
};
const GRIP_WRIST: Pt = [820, 1300];
// Every key carries the pinch fields: the pose track copies non-animated fields from the first key only.
const bagHand = (base: number, curl: number, dir: number): PovHand => ({
  side: 1, base, wrist: GRIP_WRIST, dir, size: 1.1, curl, spread: 0.2, elbow: [1080, 1640], sleeveFrom: [1160, 1960], tone: ZC_HAND,
  pinchGap: 49, fingerCurl: [0.35, 1, 1, 1],
});
const turnHand = (base: number): PovHand => pinchHand(base, [1068, 855], {curl: 1, elbow: [1100, 1560], sleeveFrom: [1160, 1960]});

/** Right-hand track: holds the bag, lets go by f 2, rises to the thumb-turn at `rise`, then holds on it. */
const rightHandKeys = (lang: Lang, base = 7400): Key<PovHand>[] => {
  const {rise} = B02_SH01_KEYS[lang];
  const keys: Key<PovHand>[] = [[0, bagHand(base, 0.45, -2.0)], [2, bagHand(base, 0.1, -2.0)]];
  if (rise - 3 > 2) keys.push([rise - 3, bagHand(base, 0.1, -2.0)]);
  keys.push([rise, turnHand(base)]);
  return keys;
};

/** Thumb-turn angle (deg) of one language: 0 open (bar vertical), 90 locked (bar horizontal). */
export const boltAngle = (lang: Lang, pf: number) => 90 * ramp(pf, B02_SH01_KEYS[lang].bolt[0], B02_SH01_KEYS[lang].bolt[1]);
/** Latch edge x of B02-SH01 at pf: ajar 900, shut 950 at f 2. */
export const sh01Edge = (pf: number) => lerp(900, 950, ramp(pf, 0, 2));

const paintBag = (f: Flat, x: number, y: number) => {
  const pts: Pt[] = [[x - 120, y - 60], [x - 70, y - 150], [x - 30, y - 175], [x + 30, y - 175], [x + 70, y - 150], [x + 120, y - 60], [x + 112, y + 90], [x + 60, y + 150], [x - 60, y + 150], [x - 112, y + 90]];
  f.fill(BAG, pts);
  f.line(pts, 1.0);
  f.fill(BAG, ell(x, y - 186, 26, 22, 12));
};

/** Pound shudder strokes on both leaf edges for the 5 frames after a blow (sheet: "shudder strokes at both edges"). */
const shudder = (f: Flat, kick: number, on: boolean) => {
  if (!on) return;
  for (const x of [128, 962]) {
    f.line([[x + kick - 10, 150], [x + kick - 10, 250]], 0.9, INK, false);
    f.line([[x + kick - 6, 560], [x + kick - 6, 680]], 0.9, INK, false);
  }
};

export const paintB02Sh01 = (ctx: PaintContext, pf: number, lang: Lang) => {
  const f = flatKit(ctx, 11000);
  const j = poundState(lang, 'SH01', pf);
  const shut = ramp(pf, 0, 2);
  paintDoorScene(ctx, f, {jolt: j.kick, edge: sh01Edge(pf), gap: shut < 1, line: CORRIDOR_LIGHT});
  shudder(f, j.kick, j.shudder);
  // Left palm: the slam at f 2, then flat on the leaf and squeezed on each pound.
  palmHand(ctx, -1, {x: 330, y: 842, press: (pf >= 2 ? 0.3 : 0) + j.press, base: 7200, elbow: [40, 1400], sleeveFrom: [-60, 1900]});
  // The bag falls out of the bottom of the frame from f 2 (fingers open by f 2).
  if (pf < 7) paintBag(f, 760, 1180 + Math.max(0, pf - 2) * 200);
  povHand(ctx, trackHand(rightHandKeys(lang), pf));
};

// ---------------------------------------------------------------- B02-SH02: drag and shove the cabinet

/** Cabinet x offset (drag from the right, +420 to flush) and the bob of the three strides, then the lift at the shove. */
export const sh02Slide = (pf: number) => 420 * (1 - ramp(pf, 9, 39));
export const sh02Bob = (pf: number) => (pf > 9 && pf < 39 ? 8 * Math.sin((2 * Math.PI * 3 * (pf - 9)) / 30) : 0) - 20 * ramp(pf, 39, 54);
/** Door layer scale: 0.92 until the shove, then 1.00 at flush (about (540, 640)). */
export const sh02DoorScale = (pf: number) => 0.92 + 0.08 * ramp(pf, 39, 54);
/** Hooked over the lip while dragging; regrip to palms flat on the top from f 47 (shove pose). */
export const sh02Hooked = (pf: number) => pf < 47;

export const paintB02Sh02 = (ctx: PaintContext, pf: number, lang: Lang) => {
  const f = flatKit(ctx, 11500);
  const j = poundState(lang, 'SH02', pf);
  const slide = sh02Slide(pf), bob = sh02Bob(pf);
  paintDoorScene(ctx, f, {jolt: j.kick, scale: sh02DoorScale(pf), line: CORRIDOR_LIGHT});
  shudder(f, j.kick, j.shudder);
  paintCabinet(ctx, f, slide, bob);
  const press = pf >= 54 ? 0.25 + j.press : 0;
  if (sh02Hooked(pf)) {
    hookHand(ctx, -1, slide, bob, 7600);
    hookHand(ctx, 1, slide, bob, 7700);
  } else {
    for (const side of [-1, 1] as const) {
      palmHand(ctx, side, {x: 540 + side * 215 + slide, y: 1040 + bob, press, base: side < 0 ? 7200 : 7300, elbow: [540 + side * 300 + slide, 1480 + bob], sleeveFrom: [540 + side * 300 + slide, 1960]});
    }
  }
};

// ---------------------------------------------------------------- B03-SH01: the blackout from inside (POV, whip, room)

/** B03 keys per language (plate frames): key 1 (corridor light and entry lamp out), whip start (7 frames), lamps out
 *  near -> far and the neighbour window (`VD-ZC-03`, word-locked). */
export const B03_KEYS: Record<Lang, {key1: number; whip: number; lamps: {bath: number; kitchen: number; living: number}; neighbour: number}> = {
  TH: {key1: 9, whip: 11, lamps: {bath: 18, kitchen: 20, living: 23}, neighbour: 24},
  EN: {key1: 18, whip: 20, lamps: {bath: 27, kitchen: 30, living: 33}, neighbour: 36},
};
export const WHIP_FRAMES = 7;
/** Shared frame at the view boundary: 0 = view A in place, 1080 = view B in place. */
export const b03Offset = (pf: number, lang: Lang) => 1080 * ramp(pf, B03_KEYS[lang].whip, B03_KEYS[lang].whip + WHIP_FRAMES);
/** Light level of one source at pf: 1 lit, 0 out, a two-frame value lerp (no alpha fade). */
export const lampLevel = (pf: number, outAt: number | null) => (outAt === null ? 1 : 1 - clamp01((pf - outAt) / 2));

/** Lit state of the B03 sources at plate frame `pf`. */
export const b03Lights = (pf: number, lang: Lang) => {
  const k = B03_KEYS[lang];
  return {
    corridor: lampLevel(pf, k.key1),
    bath: lampLevel(pf, k.lamps.bath),
    kitchen: lampLevel(pf, k.lamps.kitchen),
    living: lampLevel(pf, k.lamps.living),
    neighbour: lampLevel(pf, k.neighbour),
  };
};

/** Fixed lamp positions in View B (plate px, the sheet's composed one-point layout, VP (600, 600)). */
export const B03_LAMPS = {bath: [440, 190], kitchen: [540, 380], living: [580, 480]} as const;

const mixDark = (c: string, level: number) => mixColor('#1d1915', c, 0.12 + 0.88 * level);

const paintViewA = (ctx: PaintContext, f: Flat, pf: number, lang: Lang) => {
  const L = b03Lights(pf, lang);
  paintDoorScene(ctx, f, {line: mixColor('#1d1915', CORRIDOR_LIGHT, L.corridor)});
  paintCabinet(ctx, f, 0, 0);
  // Entry fixture on the top edge (lit until key 1; its glow is an SVG layer).
  f.fill(mixDark('#f6eed8', L.corridor), [[480, -20], [600, -20], [600, 40], [480, 40]]);
  f.line([[480, -20], [600, -20], [600, 40], [480, 40]], 0.8);
  if (pf < B03_KEYS[lang].whip) hookHand(ctx, -1, 0, 0, 7600); // left hand on the cabinet edge until the whip starts
};

const paintViewB = (ctx: PaintContext, f: Flat, pf: number, lang: Lang) => {
  const L = b03Lights(pf, lang);
  const avg = (L.bath + L.kitchen + L.living) / 3;
  const ceil = mixDark(CREAM.ceiling, avg), floor = mixDark(CREAM.tile, avg * 0.8);
  f.fill(ceil, [[-100, -100], [1200, -100], [800, 380], [400, 380]]);
  f.fill(mixDark(CREAM.wallShade, avg), [[-100, -100], [400, 380], [400, 800], [-100, 1500]]);
  f.fill(mixDark(CREAM.wallShade, avg), [[1200, -100], [800, 380], [800, 800], [1200, 1500]]);
  f.fill(floor, [[-100, 1500], [400, 800], [800, 800], [1200, 1500], [1200, 2100], [-100, 2100]]);
  // Balcony glazing at the far end (daylight, the brightest value) and the neighbour's block beyond the divider x 680.
  f.fill('#dfe8ea', [[400, 380], [800, 380], [800, 800], [400, 800]]);
  f.fill(mixDark('#7d8a8e', 0.6), [[680, 380], [800, 380], [800, 800], [680, 800]]);
  f.fill(mixColor('#4a3a2a', '#e8b56a', L.neighbour), [[690, 470], [770, 470], [770, 540], [690, 540]]);
  f.line([[680, 380], [680, 800]], 0.9);
  // Doorways P1 and P2 as wide openings framing the line of sight (composed; `MK-ZCP-F9`).
  f.fill(mixDark('#2a2420', Math.min(1, avg + 0.2)), [[120, 560], [240, 480], [240, 1010], [120, 1140]]);
  f.fill(mixDark('#2a2420', Math.min(1, avg + 0.2)), [[860, 470], [960, 500], [960, 1100], [860, 1020]]);
  // Ceiling lamp fixtures (their glow is an SVG layer): a small flat shape each.
  for (const [k, [x, y]] of Object.entries(B03_LAMPS) as [keyof typeof B03_LAMPS, readonly [number, number]][]) {
    const lit = L[k];
    f.fill(mixDark('#f6eed8', lit), [[x - 22, y - 7], [x + 22, y - 7], [x + 22, y + 7], [x - 22, y + 7]]);
  }
};

/** Whip: horizontal smear strokes in the turn direction and a translucent flat veil (seeded fill, not a wash). */
const whip = (ctx: PaintContext, f: Flat, k: number) => {
  const paper = '#d6d0c0';
  for (const y of [260, 520, 800, 1080, 1360, 1640]) f.line([[40 + 20 * k, y], [1040, y + 6]], 2.2, mixColor(INK, paper, 0.45), false);
  ctx.still(9311 + k);
  ctx.brush.noStroke();
  ctx.brush.fill(paper, 40); // translucent veil over the whip (a lighter veil keeps the caption band dark enough)
  ctx.brush.fillBleed(0);
  ctx.brush.fillTexture(0, 0.4);
  ctx.brush.polygon([[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]]);
  ctx.brush.noFill();
};

export const paintB03Sh01 = (ctx: PaintContext, pf: number, lang: Lang) => {
  const {brush} = ctx;
  const f = flatKit(ctx, 13000);
  const oA = b03Offset(pf, lang), w = B03_KEYS[lang].whip;
  if (oA < 1080) {
    brush.push();
    brush.translate(oA, 0);
    paintViewA(ctx, f, pf, lang);
    brush.pop();
  }
  if (oA > 0) {
    brush.push();
    brush.translate(oA - 1080, 0);
    paintViewB(ctx, f, pf, lang);
    brush.pop();
  }
  if (pf >= w && pf < w + WHIP_FRAMES) whip(ctx, f, pf - w);
};

// ---------------------------------------------------------------- B09-SH02B: the look up at the door

const day3Cabinet = (f: Flat) => {
  f.fill('#7d6a4e', [[90, 900], [1000, 900], [1000, 1920], [90, 1920]]);
  f.line([[90, 900], [1000, 900]], 1.1);
  for (const y of [1230, 1420]) f.line([[120, y], [520, y + 3], [960, y - 2]], 0.4, mixColor('#7d6a4e', INK, 0.25), false);
};

/** Knees, shins, clasped hands, phone and cans, in world px (the camera tilt moves them up into view). */
const kneesAndHands = (ctx: PaintContext, f: Flat) => {
  f.fill('#666a6c', ell(310, 2150, 170, 92, 18));
  f.fill('#666a6c', ell(770, 2150, 170, 92, 18));
  f.fill(ZC_HAND.skin, [[170, 2200], [460, 2200], [440, 2640], [190, 2640]]);
  f.fill(ZC_HAND.skin, [[620, 2200], [910, 2200], [890, 2640], [640, 2640]]);
  f.line([[170, 2200], [460, 2200], [440, 2640]], 0.7);
  f.line([[620, 2200], [910, 2200], [890, 2640]], 0.7);
  // Phone face-up (dark screen) and two can stacks on the floor, in front of the cabinet base.
  f.fill('#2a2c30', [[860, 2010], [940, 2010], [940, 2100], [860, 2100]]);
  f.line([[860, 2010], [940, 2010], [940, 2100], [860, 2100]], 0.6);
  for (const x of [150, 190]) f.fill('#b8c0c4', [[x, 1960], [x + 34, 1960], [x + 34, 2030], [x, 2030]]);
  f.line([[150, 1960], [184, 1960], [184, 2030], [150, 2030]], 0.6);
};

/** B09-SH02B: the door and cabinet, the floor and his knees in world px. The picture is static; the camera tilt (dy
 *  -1100 -> 0 over 18 f, `drawPlate`) lifts the view from the knees to the door. Hands clasped round the knees. */
export const paintB09Sh02b = (ctx: PaintContext) => {
  const f = flatKit(ctx, 12000);
  paintDoorScene(ctx, f, {lock: false, latchBlack: true, panel: [260, 140, 820, 600]});
  day3Cabinet(f);
  kneesAndHands(ctx, f);
  povHand(ctx, {side: -1, base: 7500, wrist: [470, 2060], dir: 0.35, size: 1.0, curl: 0.5, spread: 0.2, elbow: [300, 2480], sleeveFrom: [250, 2700], tone: ZC_HAND});
  povHand(ctx, {side: 1, base: 7560, wrist: [610, 2060], dir: Math.PI - 0.35, size: 1.0, curl: 0.5, spread: 0.2, elbow: [780, 2480], sleeveFrom: [830, 2700], tone: ZC_HAND});
};
