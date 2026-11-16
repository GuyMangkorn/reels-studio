import type {CastDef} from '../kit/cast';
import {PEOPLE} from '../kit/people';
import {dress} from '../kit/wardrobe';
import {ANIMALS} from '../kit/animals';
import type {AnimalPose} from '../kit/animals';

// EDU-EP19-SHORT cast (EDU-EP19-BRIEF-R1 VD02/VD03, casting lines in scene-sheets.md EDU-EP19-SHEETS-R1). Kit people and outfits by id;
// the episode only recolours and resizes (brief: projection contract, cast sizes). Comp cards: comp-cards.tsx (W2.4).

/** GIRL `girl-school + park-casual`, cap off, tee recoloured coral #e0654f; 1.34 m (about ten), headScale/armScale kept. */
export const GIRL: CastDef = (() => {
  const d = dress(PEOPLE['girl-school'], 'park-casual');
  return {...d, height: 1.34, outfit: {...d.outfit, shirt: '#e0654f', sleeve: '#e0654f', gear: {...d.outfit.gear, hat: undefined}}};
})();

/** MUM `woman-ponytail + trainer-vest`, 1.64 m. */
export const MUM: CastDef = {...dress(PEOPLE['woman-ponytail'], 'trainer-vest'), height: 1.64};

/** YOU (L03b soi inset) `woman-bob + hoodie`, 1.58 m, back view only. */
export const YOU: CastDef = dress(PEOPLE['woman-bob'], 'hoodie');

/** DOG `dog-black-lab` (0.58 m shoulder) and its orange tracking harness (VD03; #e8892f, steel back ring). `soft`: the kit's soft dog drawing
 *  (rounded parts, near-coat cut lines, polished tongue), draft fix round 1 (user 2026-11-16: "the black coat reads as boxes"). */
export const DOG = {...ANIMALS['dog-black-lab'], soft: true};
export const HARNESS: NonNullable<AnimalPose['harness']> = {color: '#e8892f', ring: '#c3c6ca'};

/** Stopwatch face radius in life, m (brief: 0.05 m face). */
export const STOPWATCH_R = 0.025;
