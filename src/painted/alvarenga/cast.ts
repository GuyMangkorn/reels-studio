import type {CastDef} from '../kit/cast';
import {PEOPLE} from '../kit/people';

// Alvarenga and Ezequiel (brief VD05, VD06). `man-buzz` and `man-spiky` are kit people used unchanged except the outfit.
// `man-buzz-long` is the user-decided variant from S06 (long hair and beard, thin look): same body, height and seed as man-buzz,
// cut 'long' (loose shoulder-length), faded loose tee, no apron or boots. LIMIT: HeadStyle has no beard length, so the beard is
// the kit beard; "longer beard" is a Boss/kit dependency (reported at the L3 look frame).

const buzz = PEOPLE['man-buzz'];
export const ALVARENGA: CastDef = {...buzz, outfit: {...buzz.outfit, apron: undefined, boots: false, shoes: '#6a5a4a'}};
export const ALVARENGA_LONG: CastDef = {
  ...buzz,
  head: {...buzz.head, cut: 'long', hair: '#2b221d'},
  outfit: {...buzz.outfit, shoulder: 0.42, shirt: '#a4a98c', sleeve: '#a4a98c', apron: undefined, boots: false, shoes: '#6a5a4a', pants: '#5a5650'},
};
const spiky = PEOPLE['man-spiky'];
/** Ezequiel: plain light tee (brief VD06), no jacket. */
export const EZEQUIEL: CastDef = {...spiky, outfit: {...spiky.outfit, shirt: '#e6e0d0', sleeve: '#e6e0d0', longSleeves: false, jacket: undefined}};
