import type {CastDef} from './cast';

// Central people library: episode-neutral template characters for the painted kit rig (`cast.ts` `drawFigure`), so an agent
// picks a ready cast member instead of designing one. Added 1 Nov 2026 (user decision): the WFOG/ZC cast is almost all women,
// so this set adds working-age men, children, older people and more women. These are NEW characters; the WFOG and ZC
// recurring entries (`worldfog/cast.ts` CAST, `zcpaint/cast.ts`) are untouched.
//
// How to use
// - Pick by `PEOPLE_INFO` (age group, gender, hair, outfit): `drawFigure(p, PEOPLE['man-crop'], g, unit, pose, t)`.
// - Per video change only `outfit` and props (README "Recurring cast"): `{...PEOPLE[id], outfit: {...PEOPLE[id].outfit, jacket: '#a2402f'}}`.
//   A character that recurs across videos keeps `head`, `height` and `seed` as listed here.
// - Motion: front, left and right views with head and body views, face controls and the `talk` mouth with `open`. No 3/4 turn;
//   a turn is a cut or crossfade between views. Model sheets: `people-sheet.tsx` (KIT-PEOPLE-LINEUP, KIT-PERSON-<id>).
// - Proportions: the rig is a 4-head adult (head 0.425 m, `H` in cast.ts). Child heights give 2.9-3.1 heads, which is the
//   8-9 year old of CP-A03 (6 heads at 7.5-head realism) on the 4-head scale (x4/7.5 = 3.2 heads). Children carry `headScale` 0.9
//   (a child's head is about 90% of an adult's) and `armScale` 0.72-0.75 (arm span about 0.30 of height, so the hands hang at the
//   crotch as on the adults); adults run 3.6-4.2 heads.
// - Seeds 710-810 are reserved for this library; give two figures of one plate different `seed` args if you draw one id twice.

export type PersonGroup = 'working-age' | 'child' | 'older';
export type PersonInfo = {
  group: PersonGroup;
  gender: 'female' | 'male';
  /** Approximate age in years (design intent, not a rig field). */
  age: number;
  /** One line for agents choosing a template: age group, gender, hair, outfit. */
  description: string;
};

const person = (def: CastDef): CastDef => def;

export const PEOPLE = {
  'man-crop': person({
    height: 1.76, seed: 710, head: {skin: '#d4a073', hair: '#1d1b1a', cut: 'crop', look: {lash: false, eye: 'hooded', wing: false, nose: 'nostrils', brow: 'thick', browDrop: 0.08, mouth: 'lip'}},
    outfit: {shoulder: 0.42, shirt: '#5d7385', sleeve: '#5d7385', longSleeves: false, pants: '#3a3f47', shoes: '#2a2523'},
  }),
  'man-parted': person({
    height: 1.8, seed: 720, head: {skin: '#efc9a3', hair: '#4a3326', cut: 'parted', look: {lash: false, eye: 'lidded', nose: 'ell', brow: 'tapered', browDrop: 0.07, mouth: 'thin', iris: '#5a4a3a'}},
    outfit: {shoulder: 0.4, shirt: '#e8e6df', sleeve: '#34414f', longSleeves: true, jacket: '#34414f', pants: '#2d3138', shoes: '#3a2a22'},
  }),
  'man-spiky': person({
    height: 1.72, seed: 730, head: {skin: '#8d5a3c', hair: '#241d19', cut: 'spiky', look: {lash: false, eye: 'almond', nose: 'broad', brow: 'thick', browDrop: 0.07, mouth: 'full', iris: '#2e2019'}},
    outfit: {shoulder: 0.39, shirt: '#d9d3c4', sleeve: '#b4552e', longSleeves: true, jacket: '#b4552e', pants: '#4a5a7a', shoes: '#e8e4da'},
  }),
  'man-buzz': person({
    height: 1.78, seed: 740, head: {skin: '#b57e55', hair: '#201c1a', cut: 'buzz', facial: 'beard', look: {lash: false, eye: 'lidded', nose: 'broad', brow: 'thick', browDrop: 0.08, mouth: 'lip', iris: '#3a2a20'}},
    outfit: {shoulder: 0.45, shirt: '#6b7a5a', sleeve: '#6b7a5a', longSleeves: false, apron: '#8a6a46', pants: '#3d3a36', shoes: '#3a2e26', boots: true},
  }),
  'woman-ponytail': person({
    height: 1.66, seed: 750, head: {skin: '#f1cfa8', hair: '#2a1e18', cut: 'ponytail', accent: '#b8483c', look: {eye: 'almond', nose: 'hook', brow: 'arch', browDrop: 0.06, mouth: 'lip'}},
    outfit: {shoulder: 0.36, shirt: '#f0ece3', sleeve: '#3f6f6a', longSleeves: true, jacket: '#3f6f6a', pants: '#2b2f3a', shoes: '#e8e4da'},
  }),
  'woman-curly': person({
    height: 1.62, seed: 760, head: {skin: '#8a5a3b', hair: '#1f1816', cut: 'curly', look: {eye: 'almond', nose: 'broad', brow: 'arch', browDrop: 0.06, mouth: 'full', iris: '#2e2019'}},
    outfit: {shoulder: 0.36, shirt: '#c9863f', sleeve: '#c9863f', longSleeves: false, skirt: '#4a3a52', pants: '#8a5a3b', shoes: '#3a2a22'},
  }),
  'woman-pixie': person({
    height: 1.6, seed: 770, head: {skin: '#e6b48c', hair: '#6a3f2a', cut: 'pixie', glasses: true, look: {eye: 'lidded', nose: 'ell', brow: 'tapered', browDrop: 0.06, mouth: 'lip', iris: '#6b5a34'}},
    outfit: {shoulder: 0.35, shirt: '#7a8f6a', sleeve: '#7a8f6a', longSleeves: true, pants: '#d8cdb8', shoes: '#2a2523'},
  }),
  'boy-school': person({
    height: 1.3, headScale: 0.9, armScale: 0.75, seed: 780, head: {skin: '#d4a073', hair: '#1a1716', cut: 'bowl', look: {lash: false, eye: 'round', nose: 'button', brow: 'tapered', browDrop: 0.05, mouth: 'line'}},
    outfit: {shoulder: 0.32, shirt: '#f2f0ea', sleeve: '#f2f0ea', longSleeves: false, jacket: '#26334d', pants: '#26334d', shoes: '#f0eee8'},
  }),
  'girl-school': person({
    height: 1.24, headScale: 0.9, armScale: 0.72, seed: 790, head: {skin: '#efc39a', hair: '#1a1716', cut: 'pigtails', accent: '#b8483c', look: {eye: 'round', nose: 'button', brow: 'arch', browDrop: 0.05, mouth: 'line'}},
    outfit: {shoulder: 0.3, shirt: '#f4f1ea', sleeve: '#f4f1ea', longSleeves: false, jacket: '#26334d', skirt: '#26334d', skirtHem: 0.27, pants: '#efc39a', shoes: '#2a2523'},
  }),
  'man-elder': person({
    height: 1.64, seed: 800, head: {skin: '#e0ae86', hair: '#bdb8b0', cut: 'balding', facial: 'mustache', lines: true, brows: '#8a8680', look: {lash: false, eye: 'hooded', nose: 'ell', brow: 'thick', browDrop: 0.06, mouth: 'thin'}},
    outfit: {shoulder: 0.38, shirt: '#d8d2c2', sleeve: '#7a5a3f', longSleeves: true, jacket: '#7a5a3f', pants: '#4a4640', shoes: '#3a2e26'},
  }),
  'woman-elder': person({
    height: 1.52, seed: 810, head: {skin: '#efc9a3', hair: '#d9d5cf', cut: 'perm', glasses: true, lines: true, brows: '#9a948c', look: {eye: 'lidded', nose: 'hook', brow: 'arch', browDrop: 0.06, mouth: 'thin'}},
    outfit: {shoulder: 0.35, shirt: '#e8e2d6', sleeve: '#8a7a9a', longSleeves: true, jacket: '#8a7a9a', skirt: '#5a5a68', pants: '#efc9a3', shoes: '#5a4636'},
  }),
  'woman-long': person({
    height: 1.64, seed: 820, head: {skin: '#e8b98f', hair: '#17130f', cut: 'long', look: {eye: 'almond', nose: 'hook', brow: 'arch', browDrop: 0.06, mouth: 'full', iris: '#3a2a20'}},
    outfit: {shoulder: 0.35, shirt: '#e9d9cf', sleeve: '#e9d9cf', longSleeves: true, skirt: '#2f3a4a', pants: '#e8b98f', shoes: '#2a2523'},
  }),
  'woman-bob': person({
    height: 1.58, seed: 830, head: {skin: '#f2d2b0', hair: '#1c1714', cut: 'bob', look: {eye: 'lidded', nose: 'button', brow: 'tapered', browDrop: 0.05, mouth: 'line', iris: '#4a3226'}},
    outfit: {shoulder: 0.34, shirt: '#f3efe6', sleeve: '#c46a5a', longSleeves: true, jacket: '#c46a5a', pants: '#3e4a5e', shoes: '#e8e4da'},
  }),
  'man-shaved': person({
    height: 1.74, seed: 840, head: {skin: '#c08c62', hair: '#2a2420', cut: 'shaved', glasses: true, brows: '#2a2420', look: {lash: false, eye: 'lidded', nose: 'nostrils', brow: 'thick', browDrop: 0.08, mouth: 'lip', iris: '#3a2a20'}},
    outfit: {shoulder: 0.43, shirt: '#3f5a5a', sleeve: '#3f5a5a', longSleeves: false, pants: '#c9bba0', shoes: '#4a3a2e'},
  }),
} satisfies Record<string, CastDef>;

export type PersonId = keyof typeof PEOPLE;
export const PERSON_IDS = Object.keys(PEOPLE) as PersonId[];

export const PEOPLE_INFO: Record<PersonId, PersonInfo> = {
  'man-crop': {group: 'working-age', gender: 'male', age: 34, description: 'Working-age man, 1.76 m: short black crop, tan skin; grey-blue short-sleeve work shirt, dark trousers.'},
  'man-parted': {group: 'working-age', gender: 'male', age: 42, description: 'Working-age man, 1.80 m: side-parted brown hair, pale skin; navy blazer over white shirt, dark trousers.'},
  'man-spiky': {group: 'working-age', gender: 'male', age: 24, description: 'Young man, 1.72 m: messy spiky black hair, deep brown skin; rust jacket over cream tee, jeans, white sneakers.'},
  'man-buzz': {group: 'working-age', gender: 'male', age: 38, description: 'Working-age man, 1.78 m, broad: buzz cut and full beard, medium-brown skin; olive tee, brown work apron, boots.'},
  'woman-ponytail': {group: 'working-age', gender: 'female', age: 25, description: 'Young woman, 1.66 m: dark ponytail with red tie, pale skin; teal jacket over white top, dark trousers, white sneakers.'},
  'woman-curly': {group: 'working-age', gender: 'female', age: 45, description: 'Middle-aged woman, 1.62 m: voluminous curly dark hair, deep brown skin; mustard blouse, plum skirt.'},
  'woman-pixie': {group: 'working-age', gender: 'female', age: 38, description: 'Middle-aged woman, 1.60 m: chestnut pixie cut, round glasses; sage knit top, cream trousers.'},
  'boy-school': {group: 'child', gender: 'male', age: 9, description: 'Schoolboy about 9, 1.30 m: black bowl cut; white short-sleeve shirt, navy vest and trousers, white shoes.'},
  'girl-school': {group: 'child', gender: 'female', age: 8, description: 'Schoolgirl about 8, 1.24 m: black pigtails with red ties; white blouse, navy vest and pleated skirt.'},
  'man-elder': {group: 'older', gender: 'male', age: 72, description: 'Older man, 1.64 m: bald crown with grey side hair, grey moustache, age lines; brown cardigan over tan shirt.'},
  'woman-elder': {group: 'older', gender: 'female', age: 70, description: 'Older woman, 1.52 m: short white permed hair, glasses, age lines; lavender cardigan, grey skirt.'},
  'woman-long': {group: 'working-age', gender: 'female', age: 28, description: 'Young woman, 1.64 m: long straight black hair past the shoulders, light tan skin; blush long-sleeve blouse, navy skirt.'},
  'woman-bob': {group: 'working-age', gender: 'female', age: 21, description: 'Young woman (student age), 1.58 m: black chin-length bob, fair skin; coral cardigan over white top, slate trousers, white sneakers.'},
  'man-shaved': {group: 'working-age', gender: 'male', age: 52, description: 'Middle-aged man, 1.74 m, broad: clean-shaved head, round glasses, medium skin; teal polo, khaki trousers.'},
};
