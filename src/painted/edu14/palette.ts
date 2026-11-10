// EDU-EP14-SHORT colours (brief EDU-EP14-BRIEF-R1 "Colour and value key"; tuned at the W3 look frames).
import type {CastDef} from '../kit/cast';
import {PEOPLE} from '../kit/people';
import {dress} from '../kit/wardrobe';

export const C = {
  // sky and cloud (real)
  skyTop: '#6f7f86', skyLow: '#9aa8ad', cloudBase: '#4f5c63', cloudLit: '#9aa8ad', haze: '#9aa6ab',
  // rain
  rain: '#b4c2cc', crown: '#dfe9ee',
  // shelter
  post: '#4d6b5a', postShade: '#33493e', tin: '#8a6a52', tinCool: '#6e6a64', lipWet: '#e9f1f3', lightbox: '#dfe8ea', steel: '#7d8588',
  // pavement, kerb, road
  paving: '#8c7a72', pavingDark: '#6d625d', kerbRed: '#b4473c', kerbWhite: '#ece6dc', asphalt: '#3f4448', shopGlow: '#e8b765',
  // across the road
  ochre: '#c49a5a', teal: '#4f7f80', cream: '#d9cdb4', shutter: '#8b8f91',
  // school behind
  wall: '#d8cfb9', railing: '#4d6b5a', tree: '#3e5a3f', treeLit: '#5c7a4e',
  // girl
  blouse: '#f4f1ea', skirt: '#232b3e', badge: '#35507d', pack: '#b8483c',
  // drop
  drop: '#a9cfe0', dropEdge: '#bfe6f2',
  // diagrams (series)
  white: '#ffffff', ink: '#2b211c', amber: '#ffc24a',
  // gauges
  realFace: '#11181b', realTick: '#f4ead6', needleA: '#ffc24a', needleB: '#8fc9e8',
} as const;

const GIRL0 = PEOPLE['girl-school'];
/** VD `girl-school + student-th-skirt` with the red school backpack (`Outfit.gear.pack`, hair-tie red `#b8483c`). N15: the outfit's hem scales with the 1.24 m height in `dress`. */
export const GIRL: CastDef = (() => { const d = dress(GIRL0, 'student-th-skirt'); return {...d, outfit: {...d.outfit, gear: {...d.outfit.gear, pack: C.pack}}}; })();
/** The GIRL mark (brief "GIRL mark"): feet centre, facing +z, right at the drip line. */
export const GIRL_AT: [number, number, number] = [0.25, 0, 0.02];
