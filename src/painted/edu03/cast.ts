import type {CastDef, FigAnchors} from '../kit/cast';
import {bodyFrame, H} from '../kit/cast';
import {ell, hardFill, inkLine, limb, solid, washAt, INK} from '../kit/draw';
import type {InteriorLight} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';

// EDU-EP03-SHORT cast (brief EDU-BRIEF-R1 VD02/VD03). Look-defining assets written at W3 (look frames); kit intake (KIT-P01) files the
// outfit in WARDROBE and the gear in `Gear` at delivery. All colours are the brief's colour key.
//
// `new: park-casual` on `man-crop`: mustard crew-neck tee, denim knee-length shorts, white sneakers, blue baseball cap (kit `gear.hat`
// cap, four views), cream canvas sling bag worn across the body. The rig has no shorts: the trousers are drawn denim to the knee
// (`paintShortsLegs` over the front-view standing legs puts bare shins and white socks over the lower half) and the bag is painted
// over the torso (`paintSlingBag`).

export const TEE = '#e3b23c', DENIM = '#4a6f9e', CAP = '#2f5fb8', BAG = '#e8dcc0', SNEAKER = '#f2f0ea';
const crop = PEOPLE['man-crop'];

export const OWNER: CastDef = {
  ...crop,
  outfit: {...crop.outfit, shirt: TEE, sleeve: TEE, longSleeves: false, pants: DENIM, shoes: SNEAKER,
    gear: {hat: {kind: 'cap', color: CAP, band: mixColor(CAP, '#0b1a3a', 0.45)}}},
};

/** Sunny-morning light for the cast (brief "Light"): sun key from screen-left-back travels to the right and down; a warm rim on the left. */
export const PARK_LIGHT: InteriorLight = {
  key: [0.55, 0.8], rim: [0.8, 0.6], rimScale: 0.7, under: true, shaped: true, handScale: 1.3, noHatch: true,
  pal: {ambient: '#ffe6b0', ambientMix: 0.08, shadow: '#4b4a6a', shadowMix: 0.3, shadowOpacity: 120, light: '#fff3d0', lightMix: 0.2, lightOpacity: 70,
    rimColor: '#ffdc8a', rimMix: 0.5, rimTo: 0.012, falloff: '#3b4a2a', falloffOpacity: 60, glazeOpacity: 40, ground: '#2a3a1c', groundCore: '#1c2a12'},
};

/** Sunlit skin for the B04 face key (VD12 option A): the owner's `#d4a073` as it reads under the warm key on the face and hands. A lit-skin tone in the scene lighting, not a change to the dog-view map. */
export const SKIN_LIT = '#f5c27a';
export const OWNER_B04: CastDef = {...OWNER, head: {...OWNER.head, skin: SKIN_LIT}};

/**
 * B04 face key (VD12 option A, EP03 scene lighting only). Same sun direction as `PARK_LIGHT`, but the face and arms are lit warmer and paler
 * (less cool ambient and form-shadow grey, a stronger lit plane in a warm cream) and the rim from screen-left-back is stronger and wider, so a
 * face reads by value in the dog view, not by a hue the map flattens. `warm` (kit torch light) is set per shot on `OwnerState`.
 */
export const PARK_LIGHT_B04: InteriorLight = {
  ...PARK_LIGHT, rimScale: 1.25,
  pal: {...PARK_LIGHT.pal, ambient: '#ffe6b0', ambientMix: 0.05, shadowMix: 0.16, shadowOpacity: 95, lightMix: 0.38, lightOpacity: 120, light: '#fff0c8',
    rimMix: 0.7, rimTo: 0.05, rimColor: '#ffe3a0'},
};

/**
 * B04 face key as paint (VD12 option A): a warm cream glaze over the face (it adds yellow and value, which the dog-view map keeps, instead
 * of the red it flattens), a brighter lit crescent on the sun side (screen-left) and a light rim on the left edge of face, ear and jaw.
 * Translucent, so eyes, brows and mouth stay as drawn. EP03 scene lighting only; call right after `drawFigure`. `a.head` is the head centre.
 */
export const paintFaceKey = (p: Painter, a: FigAnchors, unit: number, seed: number, k = 1) => {
  // Face window: from the cap brim to the chin (a.chin is the chin's picture y), about 0.26 m wide at the cheeks.
  const rx = 0.145 * unit, ry = 0.118 * unit, cx = a.head[0], cy = a.chin - ry * 0.97;
  // Neck under the jaw: the kit's neck block is shaded for the park light and reads grey-green in the dog view; repaint it in the lit skin, a step darker than the face.
  const nk = mixColor(SKIN_LIT, '#8a5a4a', 0.16), top = a.chin - 0.01 * unit;
  solid(p, seed + 2, nk, [[cx - 0.05 * unit, top], [cx + 0.05 * unit, top], [cx + 0.058 * unit, top + 0.075 * unit], [cx - 0.058 * unit, top + 0.075 * unit]], 6, 0.03, 0.08);
  // Rim: a thin pale crescent on the skull's left contour (cheek to jaw), not across the cheek. The skull is wider than the face window.
  const sx = 0.168 * unit, sy = 0.185 * unit, sy0 = a.chin - sy;
  const rim: Pt[] = Array.from({length: 9}, (_, i): Pt => { const ang = Math.PI * (0.66 + 0.3 * (i / 8)); return [cx + 0.004 * unit + sx * Math.cos(ang), sy0 + sy * Math.sin(ang)]; });
  washAt(p, seed + 3, '#fff8e0', 170 * k, [...rim, ...[...rim].reverse().map(([x, y]): Pt => [x + 0.028 * unit, y - 0.003 * unit])], 0.03, 0.1);
};

/** Bare shins and white socks below knee-length shorts (front view, standing, no crouch). Call right after `drawFigure`. */
export const paintShortsLegs = (p: Painter, def: CastDef, g: Pt, unit: number, seed: number) => {
  const f = bodyFrame(def, {view: 'front'}), skin = def.head.skin;
  const hipV = f.hipV, kneeV = (hipV + 0.038) / 2, hem = kneeV + 0.035, ankle = 0.038;
  const P = (u: number, v: number): Pt => [g[0] + u * unit, g[1] - v * unit];
  for (const s of [-1, 1]) {
    const shin = limb(P(s * 0.078, hem), P(s * 0.08, ankle + 0.045), 0.088 * unit, 0.066 * unit);
    hardFill(p, seed + s * 3, skin, shin);
    washAt(p, seed + s * 3 + 1, mixColor(skin, '#6b3f26', 0.5), 70, limb(P(s * 0.078 + s * 0.02, hem), P(s * 0.08 + s * 0.016, ankle + 0.045), 0.03 * unit, 0.022 * unit), 0.1, 0.3);
    inkLine(p, seed + 10 + s, [P(s * 0.078 - 0.044, hem - 0.004), P(s * 0.08 - 0.033, ankle + 0.045)], {closed: false, weight: 0.55, color: mixColor(skin, INK, 0.6)});
    inkLine(p, seed + 14 + s, [P(s * 0.078 + 0.044, hem - 0.004), P(s * 0.08 + 0.033, ankle + 0.045)], {closed: false, weight: 0.55, color: mixColor(skin, INK, 0.6)});
    hardFill(p, seed + 20 + s, '#f4f1ea', limb(P(s * 0.08, ankle + 0.055), P(s * 0.08, ankle + 0.005), 0.07 * unit, 0.066 * unit));
  }
  // Shorts hem: a darker denim cuff line across each leg.
  for (const s of [-1, 1]) inkLine(p, seed + 30 + s, [P(s * 0.078 - 0.05, hem), P(s * 0.078 + 0.05, hem)], {closed: false, weight: 0.7, color: mixColor(DENIM, INK, 0.55)});
  void H;
};

/**
 * Cream canvas sling bag: strap from his right shoulder (screen left) across the chest to a flap bag at his left hip (screen right).
 * Front view, standing. Closed until B06 (`open` 0). `a` are the anchors `drawFigure` returned.
 */
export const paintSlingBag = (p: Painter, def: CastDef, g: Pt, unit: number, seed: number, a: FigAnchors) => {
  const f = bodyFrame(def, {view: 'front'});
  const P = (u: number, v: number): Pt => [g[0] + u * unit, g[1] - v * unit];
  const sh = a.rShoulder;
  const strapW = 0.045 * unit, edge = mixColor(BAG, INK, 0.45), dark = mixColor(BAG, '#6a5a3a', 0.4);
  // Strap, shoulder -> bag top corner.
  const s0: Pt = [sh[0] + 0.01 * unit, sh[1] - 0.012 * unit], s1: Pt = P(0.15, f.hipV + 0.1);
  solid(p, seed + 1, BAG, limb(s0, s1, strapW, strapW), 6, 0.03, 0.1);
  inkLine(p, seed + 2, limb(s0, s1, strapW, strapW), {weight: 0.6, color: edge});
  // Bag body (a soft rectangle 0.26 wide, 0.20 tall) with a flap and a buckle tab.
  const w = 0.12, cu = 0.17, h0 = f.hipV + 0.1, h1 = f.hipV - 0.1;
  const body: Pt[] = [P(cu - w, h0), P(cu + w, h0), P(cu + w + 0.005, h1), P(cu - w - 0.005, h1)];
  solid(p, seed + 3, BAG, body, 8, 0.03, 0.1);
  const flap: Pt[] = [body[0], body[1], [body[1][0] + 0.002 * unit, body[1][1] + 0.12 * unit], [(body[0][0] + body[1][0]) / 2, body[1][1] + 0.16 * unit], [body[0][0] - 0.002 * unit, body[0][1] + 0.12 * unit]];
  solid(p, seed + 4, mixColor(BAG, '#b09a6a', 0.22), flap, 6, 0.03, 0.1);
  inkLine(p, seed + 5, body, {weight: 0.75, color: edge});
  inkLine(p, seed + 6, flap, {weight: 0.65, color: edge});
  const bx = (body[0][0] + body[1][0]) / 2, by = body[1][1] + 0.13 * unit;
  solid(p, seed + 7, '#8a6a3a', ell(bx, by, 0.018 * unit, 0.014 * unit, 10), 3, 0.03, 0.1);
  // Stitch/denim-tone contact shade under the flap.
  washAt(p, seed + 8, dark, 90, [body[3], body[2], [body[2][0], body[2][1] - 0.03 * unit], [body[3][0], body[3][1] - 0.03 * unit]], 0.1, 0.3);
};
