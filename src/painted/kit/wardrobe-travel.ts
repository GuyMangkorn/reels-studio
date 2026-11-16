import {shoulderPoint, type CastDef, type FigAnchors, type FigPose, type Outfit} from './cast';
import {ell, INK, inkLine, solid} from './draw';
import {mixColor, type Painter, type Pt} from './painter';
import {REF_HEIGHT, type OutfitInfo} from './wardrobe';

// Travel outfits built for EDU-EP18-SHORT (brief VD02, N5; pre-W3 comp card pass, 15 Nov 2026): the girl's Africa trip clothes, the
// orange canoe life vest, the same clothes with a backpack, and the night variant of `home-lounge` (cardigan off). They live beside
// `wardrobe.ts` (as `wardrobe-1850s.ts` does) because delivered episodes (EP01, EP04, EP06, EP07, EP08, EP11, EP13-EP15, EP17) import
// `wardrobe.ts`: any edit there changes the scene-cache source hash of every pinned scene (render skill, render-by-scene). Merge into
// `WARDROBE` / `OUTFIT_IDS` when `wardrobe.ts` is next edited for another reason. Wear them with `dressTravel` (same rules as `dress`).
//
// Two details the rig has no `Gear` kind for are painted over the figure by `paintTravelGear` after `drawFigure` (the EDU-EP03 sling
// bag precedent): the cross-body phone pouch and strap (`travel-safari`, `travel-backpack`) and the vest's chest strap and buckle
// (`life-vest`). The backpack is painted here too (`paintBackpack`), with its shoulder straps in `paintTravelGear`.
// Sheets: KIT-WARDROBE (people-sheet.tsx) and the EDU-EP18 comp cards (src/painted/edu18/cards.tsx).

export const TRAVEL_OUTFIT_IDS = ['travel-safari', 'life-vest', 'travel-backpack', 'home-lounge-night'] as const;
export type TravelOutfitId = (typeof TRAVEL_OUTFIT_IDS)[number];

const SHOULDER = 0.38;
/** Brief colour key (GIRL row): Africa shirt, tee, shorts, sandals, pouch; vest; backpack; night tee and shorts. */
export const TRAVEL = {
  shirt: '#c9b48a', tee: '#f2efe6', shorts: '#6a6a44', sandals: '#3a3a38', pouch: '#2f4a5a',
  vest: '#e8662f', strap: '#2a2b2e', buckle: '#d9d6cc', pack: '#5a6068', nightTee: '#c9c3d9', nightShorts: '#4a5a7a',
} as const;

const safari: Outfit = {
  // Khaki short-sleeve shirt worn open over the white tee: the rig's open `jacket` halves in khaki, the tee showing down the middle.
  shoulder: SHOULDER, shirt: TRAVEL.tee, sleeve: TRAVEL.shirt, longSleeves: false, jacket: TRAVEL.shirt, pants: TRAVEL.shorts, shoes: TRAVEL.sandals,
  shorts: {sock: '#e8b98f'}, // bare ankle: `dressTravel` repaints the sock in the wearer's skin
  gear: {pockets: true},
};

export const WARDROBE_TRAVEL: Record<TravelOutfitId, Outfit> = {
  'travel-safari': safari,
  // The orange life vest closed over the safari shirt: torso and both front halves orange (reads closed), khaki short sleeves showing
  // at the arm holes, a dark waist strap with a pale buckle; the chest strap is painted by `paintTravelGear`.
  'life-vest': {
    ...safari, shirt: TRAVEL.vest, jacket: TRAVEL.vest,
    gear: {belt: {color: TRAVEL.strap, h: 0.028, buckle: TRAVEL.buckle}, collar: {kind: 'v', color: mixColor(TRAVEL.vest, '#7a2a10', 0.25), depth: 0.05}},
  },
  // The backpack is painted by `paintBackpack` (behind the figure in front and profile, over it from the back): the rig's `gear.pack`
  // is a delivery box beside the shoulders, which read as wings on this girl (comp card R1, 15 Nov 2026).
  'travel-backpack': safari,
  // `home-lounge` with the cardigan off (brief VD02): the faded oversized night tee and soft shorts, bare feet.
  'home-lounge-night': {
    shoulder: SHOULDER, shirt: TRAVEL.nightTee, sleeve: TRAVEL.nightTee, longSleeves: false, pants: TRAVEL.nightShorts, shoes: '#e8b98f',
    shorts: {sock: '#e8b98f'},
  },
};

export const WARDROBE_TRAVEL_INFO: Record<TravelOutfitId, OutfitInfo> = {
  'travel-safari': {group: 'casual', description: 'Backpacker on safari (EDU-EP18 girl): khaki short-sleeve shirt worn open over a white tee, olive knee-length cargo shorts, dark trail sandals, small slate-blue cross-body phone pouch (painted by paintTravelGear; four views).'},
  'life-vest': {group: 'casual', description: 'Canoe life vest over the safari outfit: closed orange vest with a dark waist strap and pale buckle, a chest strap, khaki short sleeves at the arm holes, olive shorts (EDU-EP18; front, profile, seated).'},
  'travel-backpack': {group: 'casual', description: 'The safari outfit plus a grey daypack (painted by paintBackpack: behind the back, straps over the shoulders) and the cross-body pouch: the traveller arriving home (EDU-EP18).'},
  'home-lounge-night': {group: 'casual', description: 'At home at night, home-lounge with the cardigan off: faded lilac oversized short-sleeve tee, soft blue-grey shorts, bare feet (EDU-EP18 bedroom).'},
};

/** `dress()` for the travel outfits: keeps the wearer's build and head; bare ankles and feet take the wearer's skin. */
export const dressTravel = (def: CastDef, id: TravelOutfitId): CastDef => {
  const spec = WARDROBE_TRAVEL[id];
  const outfit: Outfit = {...spec, shoulder: def.outfit.shoulder};
  if (spec.shorts) outfit.shorts = {sock: def.head.skin};
  if (id === 'home-lounge-night') outfit.shoes = mixColor(def.head.skin, '#000000', 0.06);
  if (spec.skirtHem !== undefined) outfit.skirtHem = spec.skirtHem * (def.height / REF_HEIGHT);
  return {...def, outfit};
};

/**
 * The painted details of a travel outfit, over a figure `drawFigure` just drew (`a` its anchors, `pose` the same pose, `unit` px per
 * metre). Front and three-quarter: the pouch strap runs from the left shoulder across the chest to a small pouch on the right hip; the
 * backpack straps run down from both shoulders; the vest gets a chest strap and buckle. Profile: the pouch on the hip and the strap
 * over the near shoulder. Back view and seated modes skip the pouch (it is under the arms or the hull).
 */
export const paintTravelGear = (p: Painter, id: TravelOutfitId, def: CastDef, a: FigAnchors, pose: FigPose, unit: number, seed = 8600) => {
  if (id === 'home-lounge-night' || pose.view === 'back' || pose.lie) return;
  const seated = !!(pose.sit || pose.floorSit || pose.kneel);
  const front = pose.view === 'front';
  const torso = def.height * 0.3 * unit; // shoulder to hip along the body, px (0.49 m on the 1.64 m rig)
  const sh: Pt = front ? [(a.rShoulder[0] + a.lShoulder[0]) / 2, (a.rShoulder[1] + a.lShoulder[1]) / 2] : a.rShoulder;
  const w = 0.012 * unit;
  if (id === 'life-vest') {
    if (!front) return;
    const y = sh[1] + 0.17 * unit, x0 = a.rShoulder[0] + 0.035 * unit, x1 = a.lShoulder[0] - 0.035 * unit;
    solid(p, seed, TRAVEL.strap, [[x0, y - w], [x1, y - w], [x1, y + w], [x0, y + w]], 3);
    const bx = (x0 + x1) / 2;
    solid(p, seed + 1, TRAVEL.buckle, [[bx - 0.022 * unit, y - 0.016 * unit], [bx + 0.022 * unit, y - 0.016 * unit], [bx + 0.022 * unit, y + 0.016 * unit], [bx - 0.022 * unit, y + 0.016 * unit]], 3);
    inkLine(p, seed + 2, [[bx - 0.022 * unit, y - 0.016 * unit], [bx + 0.022 * unit, y - 0.016 * unit], [bx + 0.022 * unit, y + 0.016 * unit], [bx - 0.022 * unit, y + 0.016 * unit]], {weight: 0.6, curve: 0, color: INK});
    return;
  }
  const strapC = mixColor(TRAVEL.pouch, '#000000', 0.25);
  if (id === 'travel-backpack' && front) {
    for (const [i, s] of [a.rShoulder, a.lShoulder].entries()) {
      const k = i ? -1 : 1, top: Pt = [s[0] + k * 0.03 * unit, s[1] + 0.005 * unit], bot: Pt = [s[0] + k * 0.055 * unit, s[1] + 0.2 * unit];
      solid(p, seed + 10 + i, mixColor(TRAVEL.pack, '#000000', 0.2), [[top[0] - w, top[1]], [top[0] + w, top[1]], [bot[0] + w, bot[1]], [bot[0] - w, bot[1]]], 3);
    }
  }
  if (seated) return;
  if (front) {
    // Strap from the character's left shoulder (screen right) to the pouch at the right hip (screen left).
    const from: Pt = [a.lShoulder[0] - 0.02 * unit, a.lShoulder[1]], to: Pt = [a.rShoulder[0] + 0.01 * unit, sh[1] + torso * 0.86];
    const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy), nx = (-dy / L) * w * 0.8, ny = (dx / L) * w * 0.8;
    solid(p, seed + 20, strapC, [[from[0] + nx, from[1] + ny], [to[0] + nx, to[1] + ny], [to[0] - nx, to[1] - ny], [from[0] - nx, from[1] - ny]], 3);
    paintPouch(p, seed + 21, [to[0], to[1] + 0.04 * unit], unit);
    return;
  }
  // Profile: strap over the shoulder line, pouch at the hip just ahead of the body centre.
  const dir = pose.view === 'left' ? -1 : 1;
  const hip: Pt = [sh[0] + dir * 0.06 * unit, sh[1] + torso * 0.88];
  solid(p, seed + 30, strapC, [[sh[0] - dir * 0.04 * unit - w, sh[1]], [sh[0] - dir * 0.04 * unit + w, sh[1]], [hip[0] + w, hip[1]], [hip[0] - w, hip[1]]], 3);
  paintPouch(p, seed + 31, [hip[0], hip[1] + 0.03 * unit], unit);
};

/** Small zipped phone pouch, 0.1 x 0.13 m, centred at `c` px. */
const paintPouch = (p: Painter, seed: number, c: Pt, unit: number) => {
  const hw = 0.05 * unit, hh = 0.065 * unit;
  const box: Pt[] = [[c[0] - hw, c[1] - hh], [c[0] + hw, c[1] - hh], [c[0] + hw * 1.04, c[1] + hh], [c[0] - hw * 1.04, c[1] + hh]];
  solid(p, seed, TRAVEL.pouch, box, 3);
  inkLine(p, seed + 1, box, {weight: 0.8, curve: 0.05, color: mixColor(TRAVEL.pouch, INK, 0.6)});
  inkLine(p, seed + 2, [[c[0] - hw * 0.8, c[1] - hh * 0.55], [c[0] + hw * 0.8, c[1] - hh * 0.55]], {closed: false, weight: 0.5, curve: 0, color: mixColor(TRAVEL.pouch, '#ffffff', 0.35)});
  solid(p, seed + 3, TRAVEL.buckle, ell(c[0] + hw * 0.6, c[1] - hh * 0.55, 0.008 * unit, 0.008 * unit, 8), 2);
};

/** Daypack 0.30 m wide, 0.42 m tall, 0.18 m deep, top just below the shoulder line (brief backpack `#5a6068`). */
export const BACKPACK = {w: 0.3, h: 0.42, d: 0.18} as const;

/**
 * The daypack of `travel-backpack`. Call with `layer: 'behind'` BEFORE `drawFigure` (front, three-quarter and profile: it peeks out
 * beside the shoulders, or sits behind the back) and with `layer: 'over'` AFTER it (back view: over the back). `pose` is the same pose.
 */
export const paintBackpack = (p: Painter, def: CastDef, g: Pt, unit: number, pose: FigPose, layer: 'behind' | 'over', seed = 8680) => {
  if (pose.lie || pose.sit || pose.floorSit || pose.kneel) return;
  const back = pose.view === 'back', profile = pose.view === 'left' || pose.view === 'right';
  if ((layer === 'over') !== back) return;
  const body = {...pose, view: back ? ('front' as const) : pose.view};
  const r = shoulderPoint(def, g, unit, body, 'r'), l = shoulderPoint(def, g, unit, body, 'l');
  const top = Math.min(r[1], l[1]) + 0.02 * unit, bot = top + BACKPACK.h * unit, col = TRAVEL.pack, dark = mixColor(col, '#000000', 0.25);
  let x0: number, x1: number;
  if (profile) {
    const dir = pose.view === 'left' ? -1 : 1, bx = r[0] - dir * 0.075 * unit;
    [x0, x1] = [bx - dir * BACKPACK.d * unit, bx + dir * 0.02 * unit].sort((a, b) => a - b);
  } else {
    const cx = (r[0] + l[0]) / 2, hw = back ? (BACKPACK.w / 2) * unit : Math.abs(l[0] - r[0]) / 2 + 0.035 * unit;
    [x0, x1] = [cx - hw, cx + hw];
  }
  const rr = 0.05 * unit;
  const shape: Pt[] = [[x0, top + rr], [x0 + rr * 0.3, top + rr * 0.3], [x0 + rr, top], [x1 - rr, top], [x1 - rr * 0.3, top + rr * 0.3], [x1, top + rr], [x1, bot - 0.02 * unit], [x1 - 0.02 * unit, bot], [x0 + 0.02 * unit, bot], [x0, bot - 0.02 * unit]];
  solid(p, seed, col, shape, 4);
  inkLine(p, seed + 1, shape, {weight: 0.9, curve: 0.1, color: mixColor(col, INK, 0.6)});
  if (back) {
    // Front pocket with a zip line, and the haul loop on top.
    const py = top + BACKPACK.h * 0.5 * unit, pk: Pt[] = [[x0 + 0.04 * unit, py], [x1 - 0.04 * unit, py], [x1 - 0.035 * unit, bot - 0.035 * unit], [x0 + 0.035 * unit, bot - 0.035 * unit]];
    solid(p, seed + 2, dark, pk, 3);
    inkLine(p, seed + 3, pk, {weight: 0.7, curve: 0.05, color: mixColor(col, INK, 0.65)});
    inkLine(p, seed + 4, [[x0 + 0.05 * unit, top + 0.07 * unit], [x1 - 0.05 * unit, top + 0.07 * unit]], {closed: false, weight: 0.6, curve: 0, color: mixColor(col, '#ffffff', 0.3)});
  } else if (profile) {
    const px0 = profile && pose.view === 'right' ? x0 : x1, side = pose.view === 'right' ? 1 : -1;
    const pk: Pt[] = [[px0, top + 0.2 * unit], [px0 + side * 0.05 * unit, top + 0.2 * unit], [px0 + side * 0.05 * unit, bot - 0.03 * unit], [px0, bot - 0.03 * unit]];
    solid(p, seed + 2, dark, pk, 3);
  }
  const cx = (x0 + x1) / 2;
  inkLine(p, seed + 5, [[cx - 0.035 * unit, top + 0.005 * unit], [cx - 0.02 * unit, top - 0.03 * unit], [cx + 0.02 * unit, top - 0.03 * unit], [cx + 0.035 * unit, top + 0.005 * unit]], {closed: false, weight: 1.0, curve: 0.3, color: dark});
};
