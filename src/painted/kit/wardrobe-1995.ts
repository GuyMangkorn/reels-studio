import type {CastDef, Outfit} from './cast';
import type {OutfitInfo} from './wardrobe';

// 1995 outfits filed from EDU-EP31-SHORT (KIT-P01 intake, W8.4, 21 Nov 2026): copies of the WHEELER and POLICE outfits in
// src/painted/edu31/set31.ts (brief VD31-14), which keeps its own code. They live beside `wardrobe.ts` (as `wardrobe-1850s.ts` and
// `wardrobe-travel.ts` do) because delivered episodes, EP31 among them, import `wardrobe.ts`: any edit there changes the scene-cache source
// hash of every pinned scene (render skill, render-by-scene). Merge into `WARDROBE` / `OUTFIT_IDS` when `wardrobe.ts` is next edited for
// another reason. Wear them with `dress1995` (same rules as `dress`). Sheet: KIT-WARDROBE (after the travel outfits).

export const OUTFIT_1995_IDS = ['windbreaker-1995', 'us-police-1995'] as const;
export type Outfit1995Id = (typeof OUTFIT_1995_IDS)[number];

const SHOULDER = 0.38;

export const WARDROBE_1995: Record<Outfit1995Id, Outfit> = {
  // EP31 WHEELER: two-tone nylon windbreaker worn open (teal shell and sleeves, purple chest panel as the `shirt` showing down the middle),
  // stone-wash jeans, white sneakers.
  'windbreaker-1995': {shoulder: SHOULDER, shirt: '#6b4c94', sleeve: '#2c8a88', longSleeves: true, jacket: '#2c8a88', pants: '#7d95b4', shoes: '#efebe2'},
  // EP31 POLICE: US city patrol uniform, navy short-sleeve shirt with breast pockets, plain silver badge (no text), black belt with a silver
  // buckle, navy-black trousers, black shoes; no cap (the brief's officer is bareheaded indoors).
  'us-police-1995': {
    shoulder: SHOULDER, shirt: '#27334d', sleeve: '#27334d', longSleeves: false, pants: '#1e2333', shoes: '#151413',
    gear: {badge: '#c8ccd3', belt: {color: '#141414', buckle: '#b9bcc2'}, pockets: true},
  },
};

export const WARDROBE_1995_INFO: Record<Outfit1995Id, OutfitInfo> = {
  'windbreaker-1995': {group: 'casual', description: '1990s casual (EDU-EP31 Wheeler): open two-tone nylon windbreaker, teal shell and sleeves over a purple chest panel, stone-wash jeans, white sneakers.'},
  'us-police-1995': {group: 'work', description: '1990s US patrol officer (EDU-EP31 police): navy short-sleeve shirt with breast pockets and a plain silver badge, black belt with silver buckle, navy-black trousers, black shoes, no cap.', bulk: 1.05},
};

/** `dress()` for the 1995 outfits: keeps the wearer's build and head; `bulk` widens the shoulder as `dress` does (the EP31 officer on
 *  `man-crop` 0.42 -> 0.441, the episode's 0.44). */
export const dress1995 = (def: CastDef, id: Outfit1995Id): CastDef => {
  const spec = WARDROBE_1995[id], info = WARDROBE_1995_INFO[id];
  return {...def, outfit: {...spec, shoulder: info.bulk ? Math.max(def.outfit.shoulder, 0.34) * info.bulk : def.outfit.shoulder}};
};
