// EDU-EP12-SHORT colours (brief EDU-EP12-BRIEF-R1.1 "Colour and value key"; tuned at the W3 look frames, R1.2).
import type {CastDef} from '../kit/cast';
import {PEOPLE} from '../kit/people';
import {dress} from '../kit/wardrobe';

export const C = {
  // SET-HOME
  wall: '#efe0c2', wallShade: '#8f7a5e', wallMid: '#d8c49f', teak: '#8a5630', teakLit: '#b07443', teakDark: '#5e3a20', floor: '#9b6537', floorLit: '#c08550', seam: '#6d4426',
  lamp: '#ffc477', night: '#24345c', nightLit: '#3a4f7f', morning: '#ffe2a8', sky: '#cfe6f2', coolShade: '#a9a3b8',
  quilt: '#7fa7c9', quiltShade: '#5d83a6', pillow: '#f3efe6', sheet: '#e9e4d8', moon: '#9fb6dc',
  pencil: '#4a4a52',
  // SET-CABIN
  panel: '#e9ecef', panelShade: '#9aa6b4', panelMid: '#c9d1da', rail: '#5f86b3', bag: '#d8d2c2', strap: '#8c8577', velcro: '#3c4048', laptop: '#2a2d33', led: '#f3f7ff',
  // diagrams and cards
  veil: '#24262b', bone: '#f2ead8', boneInk: '#3b3226', pad: '#7cc4e4', drop: '#6fb9e0', glow: '#c8eeff',
  card: '#f4efe4', cardInk: '#23324a', sponge: '#f2c94c', spongeShade: '#d9a92c', scourer: '#3f8f4e', bookR: '#c24a3a', bookB: '#3f6fb0', bookG: '#5a9a5a', water: '#6fb9e0',
  ink: '#2b211c',
} as const;

const BOY0 = PEOPLE['boy-school'];
/** VD01 `boy-school + student-th-trousers` with `new: bare-feet` (shoes = skin; episode copy, filed at kit intake). */
export const BOY_UNIFORM: CastDef = (() => { const d = dress(BOY0, 'student-th-trousers'); return {...d, outfit: {...d.outfit, shoes: BOY0.head.skin}}; })();
/** VD01 `boy-school + new: kid-pyjamas`: pale blue long sleeves and long trousers, bare feet; messy hair is drawn by `messyHair`. */
export const BOY_PJ: CastDef = {...BOY0, outfit: {shoulder: BOY0.outfit.shoulder, shirt: '#a9c7e3', sleeve: '#a9c7e3', longSleeves: true, pants: '#a9c7e3', shoes: BOY0.head.skin,
  gear: {collar: {kind: 'v', color: '#f4f7fb', depth: 0.06}}}};
/** VD16 `woman-pixie + new: station-wear`: navy polo (white collar piping), khaki cargo trousers, grey socks; no patch, flag or name. */
export const AST: CastDef = {...PEOPLE['woman-pixie'], outfit: {shoulder: PEOPLE['woman-pixie'].outfit.shoulder, shirt: '#2e4a78', sleeve: '#2e4a78', longSleeves: false,
  pants: '#b8a27a', shoes: '#9a9ca3', gear: {collar: {kind: 'v', color: '#2a4270', depth: 0.07}, belt: {color: '#5d5340', h: 0.03}}}};
/** VD16 `man-crop + new: station-wear` (teal polo). */
export const CREW: CastDef = {...PEOPLE['man-crop'], outfit: {...AST.outfit, shoulder: PEOPLE['man-crop'].outfit.shoulder, shirt: '#2f7f7a', sleeve: '#2f7f7a',
  gear: {collar: {kind: 'v', color: '#28706b', depth: 0.07}, belt: {color: '#5d5340', h: 0.03}}}};
