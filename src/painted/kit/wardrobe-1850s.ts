import type {CastDef, Outfit} from './cast';
import {mixColor} from './painter';
import {REF_HEIGHT, type OutfitInfo} from './wardrobe';

// Period outfits filed from EDU-EP11-SHORT (KIT-P01 intake, 9 Nov 2026): copies of `showmanDef` and `crowdDef` in src/painted/edu11/hall.ts,
// which keeps its own code. They live beside `wardrobe.ts` instead of inside it because the episode imports `wardrobe.ts` (`dress`): any
// edit there changes the scene-cache source hash of every pinned EP11 scene (docs/render-rules.md#render-by-scene). Merge them into
// `WARDROBE` / `OUTFIT_IDS` when `wardrobe.ts` is next edited for another reason. Until then wear them with `dressPeriod` (same rules as `dress`).
// Hat kinds `top` and `bonnet` and the `overcoat`/bow-tie gear are in `gear.ts` / `cast.ts`. Sheet: KIT-WARDROBE (after the `wardrobe.ts` outfits).

export const PERIOD_OUTFIT_IDS = ['frock-1850s', 'bonnet-1850s'] as const;
export type PeriodOutfitId = (typeof PERIOD_OUTFIT_IDS)[number];

const SHOULDER = 0.38;
const CROWD_WOMAN = '#6a4f3a';

export const WARDROBE_1850S: Record<PeriodOutfitId, Outfit> = {
  // The showman: black frock coat to the knee over a tan waistcoat, cream cravat bow, black top hat. Retint `jacket`, `sleeve`,
  // `gear.overcoat.color` and `gear.hat.color` for a crowd man (the episode mixes the tint toward cream for the shirt).
  'frock-1850s': {
    shoulder: SHOULDER, shirt: '#8a6240', sleeve: '#2b2420', longSleeves: true, jacket: '#2b2420', pants: '#3a342e', shoes: '#17130f',
    gear: {tie: {color: '#efe2c4', bow: true}, overcoat: {color: '#2b2420', hem: 0.62}, hat: {kind: 'top', color: '#211b17', band: '#5a4632'}},
  },
  // The crowd woman at tone `CROWD_WOMAN`: long-sleeve bodice, ankle-length skirt, ribbon bonnet; dark trousers stay under the skirt.
  'bonnet-1850s': {
    shoulder: SHOULDER, shirt: CROWD_WOMAN, sleeve: CROWD_WOMAN, longSleeves: true, jacket: CROWD_WOMAN, skirt: mixColor(CROWD_WOMAN, '#3a2b2e', 0.3), skirtHem: 0.1, pants: '#2e2a26', shoes: '#17130f',
    gear: {hat: {kind: 'bonnet', color: mixColor(CROWD_WOMAN, '#d9c9a0', 0.35), band: '#6e3a3a'}},
  },
};

export const WARDROBE_1850S_INFO: Record<PeriodOutfitId, OutfitInfo> = {
  'frock-1850s': {group: 'traditional', description: '1850s gentleman (EDU-EP11 showman): black knee-length frock coat over a tan waistcoat, cream cravat bow, dark trousers and boots, black top hat with a brown band; recolour the coat for a crowd (four views).'},
  'bonnet-1850s': {group: 'traditional', description: '1850s woman (EDU-EP11 crowd): brown long-sleeve bodice, darker ankle-length skirt, dark boots, ribbon bonnet with a pale crown and wine band (four views).'},
};

/** `dress()` for the period outfits: keeps the wearer's build and head, scales the skirt and coat hems to their height. */
export const dressPeriod = (def: CastDef, id: PeriodOutfitId): CastDef => {
  const spec = WARDROBE_1850S[id], k = def.height / REF_HEIGHT;
  const outfit: Outfit = {...spec, shoulder: def.outfit.shoulder};
  if (spec.skirtHem !== undefined) outfit.skirtHem = spec.skirtHem * k;
  if (spec.gear?.overcoat) outfit.gear = {...spec.gear, overcoat: {...spec.gear.overcoat, hem: spec.gear.overcoat.hem * k}};
  return {...def, outfit};
};
