import type {CastDef} from '../kit/cast';
import {PEOPLE} from '../kit/people';
import {dress} from '../kit/wardrobe';

// EDU-EP04-SHORT cast (brief EDU-BRIEF-R1.1 VD02-VD04). Every person is a kit PEOPLE entry; only outfits are tweaked.
// Look-defining asset written for W3 look frames; kit intake (KIT-P01) files `rush-hour-blazer` and `store-uniform` at W8.4.

/** Lane colours: teal / amber / coral, shared by the store floor stripes, till lights and the plan model (LF01 = LF02). */
export const LANE = {1: '#2fa7a0', 2: '#f2b030', 3: '#e8705a'} as const;
export type LaneNo = keyof typeof LANE;
export const STORE_GREEN = '#2f8a5e';
export const BASKET_RED = '#d6402f';

/** MAN: `man-parted + new: rush-hour-blazer`: the kit office outfit (navy blazer, white shirt) with a loosened burgundy tie. */
const office = dress(PEOPLE['man-parted'], 'office');
export const MAN: CastDef = {
  ...office,
  outfit: {...office.outfit, gear: {...office.outfit.gear, tie: {color: '#7a2236'}}},
};

/** `<person> + new: store-uniform`: kit `vendor` with the apron recoloured to the store green and a badge. */
export const uniform = (id: 'man-crop' | 'woman-ponytail' | 'woman-bob'): CastDef => {
  const v = dress(PEOPLE[id], 'vendor');
  return {...v, outfit: {...v.outfit, apron: STORE_GREEN, gear: {...v.outfit.gear, badge: '#f2f0ea'}}};
};
export const CSH1 = uniform('man-crop');
export const CSH2 = uniform('woman-ponytail');
export const CSH3 = uniform('woman-bob');

export const shopper = (id: keyof typeof PEOPLE): CastDef => PEOPLE[id];
