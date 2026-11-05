import type {CastDef} from '../kit/cast';
import {PEOPLE} from '../kit/people';
import {dress} from '../kit/wardrobe';

// EDU-EP01-SHORT cast (brief EDU-BRIEF-R1 VD01; user Q1, 4 Nov 2026: woman-bob + new: pyjama). Look-defining asset written by
// Film at W3.1 (look frames); Boss hardens it, and kit intake (KIT-P01) files the pyjama in WARDROBE at W8.4.
// `new: pyjama`: lavender long-sleeve sleep top with a pale V collar, matching long trousers, bare feet. The brief's "shorts"
// became long trousers because the rig has no shorts and a cool night room reads warmer with long sleeves (W3.1 note).

const bob = PEOPLE['woman-bob'];

/** The sleeper (`woman-bob + new: pyjama`): same head, body, height and seed as the kit person; only the outfit changes. */
export const SLEEPER: CastDef = {
  ...bob,
  outfit: {
    ...bob.outfit,
    shirt: '#b9a2d6', sleeve: '#b9a2d6', longSleeves: true, jacket: undefined,
    pants: '#a48fc6', shoes: bob.head.skin, // bare feet
    gear: {collar: {kind: 'v', color: '#efe6f6', depth: 0.09}},
  },
};

/**
 * The doctor (`woman-long + doctor (no tie, rose blouse), P01, happy (soft)`; user, 4 Nov 2026, after the LF05 v1 viewer check
 * read the `woman-pixie` doctor as a man): long dark hair over the shoulders, kit `doctor` coat and ID tag, a rose blouse with a
 * soft V neck instead of shirt and tie. The stethoscope, waist/bust shaping and soft closed smile are painted in `set.ts`
 * (`paintDoctor`) from the rig anchors until Boss adds them to the kit (gear `stethoscope`, a female torso shape).
 */
const doc = dress(PEOPLE['woman-long'], 'doctor');
export const DOCTOR: CastDef = {
  ...doc,
  outfit: {
    ...doc.outfit,
    shirt: '#d9a3a6', pants: '#3e4658',
    gear: {...doc.outfit.gear, tie: undefined, collar: {kind: 'v', color: '#f2dcd8', depth: 0.1}},
  },
};
