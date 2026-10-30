import type {PaintContext} from '../BrushCanvas';
import {clamp01, lerp, mixColor, ramp, type Pt} from '../painter';
import {INK} from './ctx';
import {flatKit, CREAM, type Flat} from './sets';
import {castTone} from './light';
import {joltAt, poundJoltPlateFrames, type Lang} from './jolts';
import {CORRIDOR_LIGHT, paintCabinetR25, paintDoorScene, type CabinetR25} from './pov';

// ZCPAINT first-person plates (S-P10, Boss pass 5): B02-SH01, B02-SH02, B03-SH01 and B09-SH02B, each a pure function of
// its plate clock (plate frame pf = tl x 30; per-language keys where the sheets lock words to the picture). The SVG
// parts (corridor light line, thumb-turn, lamp glows) are in `overlays.tsx`; they read the same state functions here.

const squeezeOf = (age: number) => (age < 6 ? 0.5 * Math.exp(-0.8 * age) : 0);

/** Pound jolt state of one shot at its plate frame (from the seeded list in `jolts.ts`): kick px, shudder and press 0..1. */
export const poundState = (lang: Lang, shot: 'SH01' | 'SH02', pf: number) => {
  const j = joltAt(poundJoltPlateFrames(lang, shot), pf);
  return {kick: j?.kick ?? 0, shudder: j?.shudder ?? false, press: j ? squeezeOf(j.age) : 0};
};

// ---------------------------------------------------------------- B02-SH01: shut and lock

/** B02-SH01 bolt keys per language (plate frames, sheet: bolt 4-7 TH / 17-21 EN). Pass 9 (user, 30 Oct 2026): no hand; the thumb-turn
 *  turns by itself on these keys. The slam lands at f 2 in both. */
export const B02_SH01_KEYS: Record<Lang, {bolt: [number, number]}> = {
  TH: {bolt: [4, 7]},
  EN: {bolt: [17, 21]},
};

/** B02-SH02 cabinet (R2.5 table, spike `paintB02Sh02`): top from the far edge y 830 (against the door) to the near edge y 1000, the lip
 *  1000-1022, the front from 1022 to the frame bottom, the doors split at x 540, knobs at y 1150. */
const B02_CABINET: CabinetR25 = {far: 830, near: 1000, lip: 22, fx0: 230, fx1: 850, x0: 164, x1: 916, knobY: 1150};

/** Thumb-turn angle (deg) of one language: 0 open (bar vertical), 90 locked (bar horizontal). */
export const boltAngle = (lang: Lang, pf: number) => 90 * ramp(pf, B02_SH01_KEYS[lang].bolt[0], B02_SH01_KEYS[lang].bolt[1]);
/** Latch edge x of B02-SH01 at pf: ajar 900, shut 950 at f 2. */
export const sh01Edge = (pf: number) => lerp(900, 950, ramp(pf, 0, 2));

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
  // Pass 9 (user, 30 Oct 2026): no hand at any frame. The camera pushes in on the thumb-turn and the bolt turns by itself (SVG-ZCP-2).
};


// ---------------------------------------------------------------- B02-SH02: the barricade already pushed (R2.5: no hands)

/** R2.5 staging: the last 24 px of the shove over pf 0-6, from the right; the flush thud is at pf 6 (TH f 3 / EN f 6, sound only). */
export const sh02Slide = (pf: number) => 24 * (1 - ramp(pf, 0, 6));
/** The wobble after the flush: ±3 px, decaying over pf 6-20 (R2.5 table). */
export const sh02Bob = (pf: number) => (pf > 6 && pf < 20 ? 3 * Math.sin((2 * Math.PI * (pf - 6)) / 7) * (1 - ramp(pf, 6, 20)) : 0);

export const paintB02Sh02 = (ctx: PaintContext, pf: number, lang: Lang) => {
  const f = flatKit(ctx, 11500);
  const j = poundState(lang, 'SH02', pf);
  paintDoorScene(ctx, f, {jolt: j.kick, panel: [230, 150, 860, 560], line: CORRIDOR_LIGHT});
  shudder(f, j.kick, j.shudder);
  // The cabinet jolts at a quarter of the door's kick (R2.5 table). No hand or forearm at any frame.
  paintCabinetR25(f, B02_CABINET, sh02Slide(pf) + 0.25 * j.kick, sh02Bob(pf));
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
  paintCabinetR25(f, B02_CABINET); // the barricade; no hand on its edge (R2.5 HD-02)
  // Entry fixture on the top edge (lit until key 1; its glow is an SVG layer).
  f.fill(mixDark('#f6eed8', L.corridor), [[480, -20], [600, -20], [600, 40], [480, 40]]);
  f.line([[480, -20], [600, -20], [600, 40], [480, 40]], 0.8);
  // Key 1 (pass 9): View A drops to its blackout tones with the entry key (LT-07): a flat veil over the set.
  shadeRegion(ctx, '#1d1915', 0.8 * (1 - L.corridor), [[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]]);
};

/** Flat translucent veil over a region (one wash): the blackout tone over View A at key 1 (KEY-ENT-PWR goes out). */
const shadeRegion = (ctx: PaintContext, color: string, alpha: number, pts: Pt[]) => {
  if (alpha <= 0) return;
  ctx.brush.noStroke();
  ctx.brush.noFill();
  ctx.brush.wash(color, Math.round(255 * Math.min(1, alpha)));
  ctx.brush.polygon(pts);
  ctx.brush.noWash();
};

/** View B (KEY-B03-B, pass 9): each wall takes its own lamp (bath on the left wall, living on the right, the ceiling and floor the mean), so a
 *  room drops to its blackout tones on its key frame. The dressing (MK-ZC-ST-12) and its floor shadows from the far window point toward the
 *  camera and stay after the lamps die. Glazing and neighbour are daylight and the building beat as before. */
const paintViewB = (ctx: PaintContext, f: Flat, pf: number, lang: Lang) => {
  const L = b03Lights(pf, lang);
  const avg = (L.bath + L.kitchen + L.living) / 3;
  const ceil = mixDark(CREAM.ceiling, avg), floor = mixDark(CREAM.tile, avg * 0.8);
  f.fill(ceil, [[-100, -100], [1200, -100], [800, 380], [400, 380]]);
  f.fill(mixDark(CREAM.wallShade, L.bath), [[-100, -100], [400, 380], [400, 800], [-100, 1500]]);
  f.fill(mixDark(CREAM.wallShade, L.living), [[1200, -100], [800, 380], [800, 800], [1200, 1500]]);
  f.fill(floor, [[-100, 1500], [400, 800], [800, 800], [1200, 1500], [1200, 2100], [-100, 2100]]);
  // Balcony glazing at the far end (daylight, the brightest value) and the neighbour's block beyond the divider x 680.
  f.fill('#dfe8ea', [[400, 380], [800, 380], [800, 800], [400, 800]]);
  f.fill(mixDark('#7d8a8e', 0.6), [[680, 380], [800, 380], [800, 800], [680, 800]]);
  f.fill(mixColor('#4a3a2a', '#e8b56a', L.neighbour), [[690, 470], [770, 470], [770, 540], [690, 540]]);
  f.line([[680, 380], [680, 800]], 0.9);
  // Doorways P1 and P2 as wide openings framing the line of sight (composed; `MK-ZCP-F9`).
  f.fill(mixDark('#2a2420', Math.min(1, avg + 0.2)), [[120, 560], [240, 480], [240, 1010], [120, 1140]]);
  f.fill(mixDark('#2a2420', Math.min(1, avg + 0.2)), [[860, 470], [960, 500], [960, 1100], [860, 1020]]);
  // Dressing (pass 9, MK-ZC-ST-12): the pale aqua bathroom wainscot on the left wall (lit by the bath lamp), the warm wood counter edge, two
  // cream curtains framing the glazing, one mustard cushion by the glazing on the right. Thin outlines, flat fills only.
  f.fill(mixDark('#a9cfc8', L.bath), [[-100, 1300], [400, 690], [400, 800], [-100, 1500]]);
  f.line([[-100, 1300], [400, 690]], 0.7, mixDark('#4a433b', L.bath));
  f.fill(mixDark('#b07d4f', avg), [[-100, 1240], [360, 730], [380, 752], [-100, 1262]]);
  f.fill(mixDark('#e6dcc2', avg), [[400, 380], [446, 380], [466, 800], [400, 800]]);
  f.fill(mixDark('#e6dcc2', avg), [[754, 380], [800, 380], [800, 800], [734, 800]]);
  f.line([[422, 400], [436, 790]], 0.5, mixDark('#b9aa8c', avg), false);
  f.line([[772, 400], [770, 790]], 0.5, mixDark('#b9aa8c', avg), false);
  f.fill(mixDark('#c9a040', L.living), [[700, 762], [756, 742], [776, 792], [720, 812]]);
  // Floor shadows from the far window (KEY-B03-B): toward the camera along the floor; not lamp-dependent, so they stay after the lamps die.
  const shadow = castTone(floor); // LT-03 cast tone of the floor (was a near-black mix that read as legs)
  f.fill(shadow, [[400, 800], [446, 800], [500, 1100], [360, 1100]]);
  f.fill(shadow, [[734, 800], [800, 800], [840, 1060], [700, 1060]]);
  f.fill(shadow, [[700, 812], [776, 792], [820, 880], [740, 900]]);
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


// ---------------------------------------------------------------- B09-SH02B: the look up at the door (R2.5: no body part)

/** The cabinet at the end frame (R2.5 table, B09-SH02B): the lit top lip y 900-922 (his eye line; the only highlight), the front to the bottom. */
const B09_CABINET: CabinetR25 = {far: 900, near: 900, lip: 22, fx0: 150, fx1: 930, x0: 150, x1: 930, knobY: 1150};

/** The tiled floor below the cabinet base (plate y 2100 down): flat tiles, grout lines one step darker (sheet B09-SH02B staging). */
const floorTiles = (f: Flat) => {
  f.fill(CREAM.tile, [[-100, 2100], [1200, 2100], [1200, 2900], [-100, 2900]]);
  const grout = mixColor(CREAM.tile, '#4a4036', 0.22);
  for (let y = 2210; y < 2900; y += 110) f.line([[-100, y], [1200, y]], 0.6, grout, false);
  for (let r = 0, y = 2100; y < 2900; r++, y += 110) for (let x = (r % 2) * 90; x < 1200; x += 180) f.line([[x, y], [x, y + 110]], 0.6, grout, false);
};

/**
 * Floor props of the first frame (`Q-ZCP-13` B, user: floor props only), on the floor below the cabinet base: two stacks of two pull-tab cans
 * and the phone face-up with a dark screen (sheet f 0 at dy +1100: cans ≈ y 1130-1230, phone ≈ 1255 on screen). Each casts a short flat
 * shadow toward the cabinet.
 */
const floorProps = (f: Flat) => {
  const shadow = castTone(CREAM.tile);
  for (const x of [165, 231]) {
    f.fill(shadow, [[x - 10, 2232], [x + 46, 2232], [x + 40, 2214], [x - 16, 2214]]);
    for (const y of [2232, 2290]) {
      f.fill('#b8c0c4', [[x, y], [x + 44, y], [x + 44, y + 58], [x, y + 58]]);
      f.line([[x, y], [x + 44, y], [x + 44, y + 58], [x, y + 58]], 0.6);
    }
  }
  f.fill(shadow, [[836, 2312], [906, 2312], [900, 2292], [830, 2292]]);
  f.fill('#2a2c30', [[846, 2310], [906, 2310], [906, 2400], [846, 2400]]);
  f.line([[846, 2310], [906, 2310], [906, 2400], [846, 2400]], 0.6);
};

/**
 * B09-SH02B: the door (panel x 230-860, y 150-560, the darkest value; latch line pure black, no light line; static on every knock), the
 * cabinet, then the floor props. The camera tilt (`CAM_B09_SH02B`, dy -1100 -> 0 over 18 f, `drawPlate`) lifts the view from the floor to the
 * still door. No hand, knee or foot in any frame (R2.5 `Q-ZCP-13` B).
 */
export const paintB09Sh02b = (ctx: PaintContext) => {
  const f = flatKit(ctx, 12000);
  paintDoorScene(ctx, f, {lock: false, latchBlack: true, panel: [230, 150, 860, 560]});
  // Defocus veil (pass 9, sheet L0): the door and jamb above the cabinet are soft under #d6c9ad at 60/255; the latch line stays black under it.
  shadeRegion(ctx, '#d6c9ad', 60 / 255, [[-100, -100], [1200, -100], [1200, 900], [-100, 900]]);
  floorTiles(f);
  paintCabinetR25(f, B09_CABINET);
  f.line([[150, 2100], [930, 2100]], 1.0);
  floorProps(f);
};
