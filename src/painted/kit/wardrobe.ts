import type {CastDef, Outfit} from './cast';
import {mixColor} from './painter';

// Job and school wardrobe for the painted kit: whole outfits a shot can put on any `CastDef` (usually a `PEOPLE` entry,
// `people.ts`) by id, so Film names "nurse" or "police" and Editor writes `dress(PEOPLE['woman-ponytail'], 'nurse')`.
// Added 1 Nov 2026 (people library pass 1). Sheet: KIT-WARDROBE (front and profile of every outfit). Ids are stable.
//
// - `WARDROBE[id]` is an `Outfit` for a 1.66 m adult build (`shoulder` 0.38). `dress()` is the way to wear it: it keeps the person's
//   `shoulder` (build), scales the skirt and coat hems to their height, gives bare legs the person's own skin, and returns a NEW
//   `CastDef` with the same `height`, `seed`, `headScale`, `armScale` and `head`. One exception: a monk's head is shaved, so
//   `dress(def, 'monk')` swaps the hair cut for `shaved` and drops facial hair (`WARDROBE_INFO.monk.shavesHead`).
// - Per video you may still change colours: `dress(def, 'nurse')` then `{...d, outfit: {...d.outfit, shirt: '#...'}}`.
// - Child sizes: every entry fits a child (`boy-school`, `girl-school`); the school uniforms are the intended ones.
// - Garment details (tie, collar, belt, hat, pack, overcoat, drape, wide sleeves) are `Outfit.gear` in `cast.ts`; they are default-absent,
//   so characters without `gear` draw exactly as before.

export const OUTFIT_IDS = [
  'student-th-trousers', 'student-th-skirt', 'school-jp-sailor', 'school-jp-gakuran', 'office', 'police', 'nurse', 'doctor',
  'monk', 'vendor', 'rider', 'hoodie', 'guard', 'yukata', 'kimono', 'kitchen-apron', 'park-casual', 'home-lounge', 'eva-suit',
  'trainer-vest', 'commuter',
] as const;
export type OutfitId = (typeof OUTFIT_IDS)[number];

/** The adult build `WARDROBE` hems are measured on, m. */
export const REF_HEIGHT = 1.66;
const SHOULDER = 0.38;

/** EVA suit palette (kit intake from EDU-EP08 look lock, user 8 Nov 2026): body white, shade, pack, mitten glove, neck ring, blue lock collar,
 * CREW leg stripe, gold visor, 1960s silver. `eva.ts` paints the neck ring, gloves and helmets with these. */
export const EVA = {
  white: '#eef0f2', shade: '#9eaec4', pack: '#dfe3e8', glove: '#c9ccd2', palm: '#5a5f68', ring: '#b8bec8', collar: '#3a6fb0',
  stripe: '#c8342b', visor: '#d9a441', visorDeep: '#8a5a1e', silver: '#c9c6bc',
};
/** Shoulder width factor of the suit's bulk (applied to the wearer's `shoulder`, floor 0.34 m). */
export const EVA_BULK = 1.22;
/** The suit as an `Outfit`: white long sleeves, boots, backpack and belt through `gear`; `tint` recolours the white (1960s silver). */
export const evaOutfit = (shoulder: number, tint: string = EVA.white): Outfit => ({
  shoulder: Math.max(shoulder, 0.34) * EVA_BULK, shirt: tint, sleeve: mixColor(tint, EVA.shade, 0.08), longSleeves: true,
  pants: mixColor(tint, EVA.shade, 0.12), shoes: mixColor(tint, '#8d95a1', 0.35), boots: true,
  gear: {pack: mixColor(tint, '#c3c9d1', 0.5), belt: {color: mixColor(tint, '#7c8796', 0.45), h: 0.05}},
});

export const WARDROBE: Record<OutfitId, Outfit> = {
  'student-th-trousers': {
    shoulder: SHOULDER, shirt: '#f4f1ea', sleeve: '#f4f1ea', longSleeves: false, pants: '#232b3e', shoes: '#1e1b1a',
    gear: {belt: {color: '#1b1a19', buckle: '#c9b266'}, badge: '#35507d'},
  },
  'student-th-skirt': {
    shoulder: SHOULDER, shirt: '#f4f1ea', sleeve: '#f4f1ea', longSleeves: false, skirt: '#232b3e', skirtHem: 0.36, pants: '#d9a77f', shoes: '#1e1b1a',
    gear: {badge: '#35507d'},
  },
  'school-jp-sailor': {
    shoulder: SHOULDER, shirt: '#f2f0ea', sleeve: '#f2f0ea', longSleeves: false, skirt: '#26334d', skirtHem: 0.4, pants: '#d9a77f', shoes: '#3a2a22',
    gear: {collar: {kind: 'sailor', color: '#26334d', trim: '#f2f0ea'}, tie: {color: '#b8483c', bow: true}},
  },
  'school-jp-gakuran': {
    shoulder: SHOULDER, shirt: '#1b1d22', sleeve: '#1b1d22', longSleeves: true, jacket: '#1b1d22', pants: '#1b1d22', shoes: '#1e1b1a',
    gear: {collar: {kind: 'v', color: '#1b1d22', trim: '#e6e2d6', depth: 0.06}, badge: '#c9a94a'},
  },
  office: {
    shoulder: SHOULDER, shirt: '#f2f0ea', sleeve: '#2d3646', longSleeves: true, jacket: '#2d3646', pants: '#2b2f3a', shoes: '#2a2523',
    gear: {tie: {color: '#8a2f3a'}},
  },
  police: {
    shoulder: SHOULDER, shirt: '#9a7b50', sleeve: '#9a7b50', longSleeves: false, pants: '#6b5136', shoes: '#1e1b1a',
    gear: {belt: {color: '#1b1a19', buckle: '#c9b266'}, hat: {kind: 'cap', color: '#8a6a45', band: '#1e1b1a'}, badge: '#c9b266', pockets: true},
  },
  nurse: {
    shoulder: SHOULDER, shirt: '#5fa8a5', sleeve: '#5fa8a5', longSleeves: false, pants: '#4f8f8d', shoes: '#f0eee8',
    gear: {collar: {kind: 'v', color: '#eef4f2', depth: 0.14}, badge: '#f4f1ea', hat: {kind: 'nurse', color: '#f4f1ea', band: '#5fa8a5'}},
  },
  doctor: {
    shoulder: SHOULDER, shirt: '#7fa6c9', sleeve: '#f2f0ea', longSleeves: true, pants: '#2f3440', shoes: '#2a2523',
    gear: {tie: {color: '#3d5a80'}, overcoat: {color: '#f2f0ea', hem: 0.52}, badge: '#3d5a80'},
  },
  monk: {
    shoulder: SHOULDER, shirt: '#d4801f', sleeve: '#d4801f', longSleeves: false, skirt: '#d4801f', skirtHem: 0.1, pants: '#d4801f', shoes: '#6b4a32',
    gear: {drape: '#a85d17'},
  },
  vendor: {
    shoulder: SHOULDER, shirt: '#d8d2c2', sleeve: '#d8d2c2', longSleeves: false, apron: '#3f6f6a', pants: '#4a5a7a', shoes: '#3a2e26',
    gear: {belt: {color: '#2f554f', h: 0.03}},
  },
  rider: {
    shoulder: SHOULDER, shirt: '#e07a2a', sleeve: '#e07a2a', longSleeves: true, pants: '#2d3138', shoes: '#2a2523',
    gear: {hat: {kind: 'helmet', color: '#2a2d33', band: '#e07a2a'}, pack: '#e07a2a', badge: '#f2f0ea'},
  },
  hoodie: {
    shoulder: SHOULDER, shirt: '#7a8a9a', sleeve: '#7a8a9a', longSleeves: true, pants: '#3b4a66', shoes: '#e8e4da',
    gear: {collar: {kind: 'hood', color: '#66778a', trim: '#e8e4da'}},
  },
  guard: {
    shoulder: SHOULDER, shirt: '#c9d3dd', sleeve: '#c9d3dd', longSleeves: false, pants: '#222a38', shoes: '#1e1b1a',
    gear: {belt: {color: '#1b1a19', buckle: '#c9b266'}, hat: {kind: 'cap', color: '#222a38', band: '#1a1c20'}, badge: '#c9b266', pockets: true},
  },
  yukata: {
    shoulder: SHOULDER, shirt: '#34507f', sleeve: '#34507f', longSleeves: true, skirt: '#34507f', skirtHem: 0.07, pants: '#34507f', shoes: '#6b4a32',
    gear: {collar: {kind: 'v', color: '#f2f0ea', depth: 0.34}, belt: {color: '#c9863f', h: 0.11}, wideSleeves: true},
  },
  kimono: {
    shoulder: SHOULDER, shirt: '#8a2f4a', sleeve: '#8a2f4a', longSleeves: true, skirt: '#8a2f4a', skirtHem: 0.06, pants: '#8a2f4a', shoes: '#2a2523',
    gear: {collar: {kind: 'v', color: '#f2f0ea', depth: 0.34}, belt: {color: '#d0a443', h: 0.15}, wideSleeves: true},
  },
  // Kit intake (KIT-P01) from EDU-EP02-SHORT `woman-curly + new: kitchen-apron` (src/painted/edu02/cast.ts COOK, copied, 5 Nov 2026):
  // woman-curly's mustard blouse and plum skirt with the rig apron panel in brick red; the belt stands in for the waist tie. The
  // episode's neck strap, bow tail and front pocket (`paintBibApron`, front view only) stay in the episode.
  'kitchen-apron': {
    shoulder: SHOULDER, shirt: '#c9863f', sleeve: '#c9863f', longSleeves: false, skirt: '#4a3a52', skirtHem: 0.166, apron: '#b5473a', pants: '#4a3a52', shoes: '#3a2a22',
    gear: {belt: {color: '#8a362c', h: 0.03}},
  },
  // Kit intake (KIT-P01) from EDU-EP03-SHORT `man-crop + new: park-casual` (src/painted/edu03/cast.ts OWNER, copied, 6 Nov 2026): the
  // cream sling bag is not filed (a painted overlay `paintSlingBag`, not a `Gear` kind).
  // Kit intake (KIT-P01) from EDU-EP06-SHORT `woman-curly + new: home-lounge` (Film's look-frame outfit, src/painted/edu06/cast.ts; Boss W5.2, 7 Nov 2026).
  'home-lounge': {
    shoulder: SHOULDER, shirt: '#c98b8b', sleeve: '#d9c7a8', longSleeves: true, jacket: '#d9c7a8', pants: '#8d8f96', shoes: '#f2ead8',
  },
  // Kit intake from EDU-EP08-SHORT `new: eva-suit` (src/painted/edu08 look frames LF00-LF07, B2). `dress()` widens the wearer's shoulder
  // by `EVA_BULK`; the neck ring, mitten gloves and helmets are painted by `paintEva` (`eva.ts`).
  'eva-suit': evaOutfit(SHOULDER),
  'park-casual': {
    shoulder: SHOULDER, shirt: '#e3b23c', sleeve: '#e3b23c', longSleeves: false, pants: '#4a6f9e', shoes: '#f2f0ea', shorts: {sock: '#f4f1ea'},
    gear: {hat: {kind: 'cap', color: '#2f5fb8', band: mixColor('#2f5fb8', '#0b1a3a', 0.45)}},
  },
  // EDU-EP19-SHORT comp card (W2.4, 15 Nov 2026; Film casting `woman-ponytail + new: trainer vest`, EDU-EP19-BRIEF-R1 N6). Proposed for kit
  // intake at W8.4: an open olive vest (`jacket` panels) over a grey tee, khaki cargo trousers, dark belt with the treat pouch on the right hip.
  // The stopwatch is a hand prop (`paintStopwatch`, props.ts), not part of the outfit.
  'trainer-vest': {
    shoulder: SHOULDER, shirt: '#a9a8a1', sleeve: '#a9a8a1', longSleeves: false, jacket: '#68703f', pants: '#b3a078', shoes: '#5a4a3c',
    gear: {pockets: true, belt: {color: '#3e3528', h: 0.03}, pouch: '#5b4330'},
  },
  // EDU-EP21-SHORT DRIVER (KIT-P01 intake, W8.4, 17 Nov 2026; Film casting `woman-ponytail + new: commuter`, EDU-EP21-BRIEF-R1 N3). Copy of
  // edu21/cast.ts DRIVER.outfit colours (the episode keeps its own); the episode drew it on woman-ponytail's 0.36 shoulder.
  commuter: {shoulder: SHOULDER, shirt: '#d9a23a', sleeve: '#d9a23a', longSleeves: false, pants: '#2f3a55', shoes: '#2a2a2c'},
};

export type OutfitInfo = {
  group: 'school' | 'work' | 'traditional' | 'casual';
  /** One line for agents choosing an outfit: garments, colours, headwear. */
  description: string;
  /** Skirt or robe outfit: `dress()` paints the legs in the wearer's skin tone. */
  bareLegs?: boolean;
  /** `dress()` replaces the wearer's hair cut with `shaved` and drops facial hair. */
  shavesHead?: boolean;
  /** `dress()` sets the shoulder to `max(wearer shoulder, 0.34) x bulk` instead of keeping it (EVA suit). */
  bulk?: number;
};

export const WARDROBE_INFO: Record<OutfitId, OutfitInfo> = {
  'student-th-trousers': {group: 'school', description: 'Thai school uniform, trousers: white short-sleeve shirt with name tag, navy trousers, black belt and shoes.'},
  'student-th-skirt': {group: 'school', description: 'Thai school uniform, skirt: white short-sleeve blouse with name tag, navy knee-length skirt, black shoes.', bareLegs: true},
  'school-jp-sailor': {group: 'school', description: 'Japanese sailor uniform: white short-sleeve blouse, navy sailor collar with white stripe, red bow, navy pleated skirt, brown loafers.', bareLegs: true},
  'school-jp-gakuran': {group: 'school', description: 'Japanese boys uniform (gakuran): black stand-collar jacket and trousers, white undershirt at the neck, gold button.'},
  office: {group: 'work', description: 'Office worker: white shirt, red tie, navy blazer, charcoal trousers, black shoes.'},
  police: {group: 'work', description: 'Thai police: khaki-brown short-sleeve shirt with breast pockets and gold badge, dark brown trousers, black belt, brown peaked cap with black band.'},
  nurse: {group: 'work', description: 'Nurse: teal scrub top with white V-collar and ID card, teal trousers, white shoes, white nurse cap with teal band.'},
  doctor: {group: 'work', description: 'Doctor: knee-length white coat over a light-blue shirt and navy tie, dark trousers, ID tag.'},
  monk: {group: 'traditional', description: 'Buddhist monk: saffron robe over both shoulders with a darker diagonal fold, saffron lower wrap to the ankles, sandals; head shaved.', bareLegs: true, shavesHead: true},
  vendor: {group: 'work', description: 'Market vendor: cream short-sleeve shirt, teal apron tied at the waist, blue-grey trousers.'},
  rider: {group: 'work', description: 'Delivery rider: orange long-sleeve jacket, black open-face helmet with orange band, orange delivery box on the back, dark trousers.'},
  hoodie: {group: 'casual', description: 'Casual: grey-blue hoodie with the hood down and white drawstrings, jeans, white sneakers.'},
  guard: {group: 'work', description: 'Security guard: light blue-grey short-sleeve shirt with pockets and gold badge, navy trousers, black belt, navy peaked cap.'},
  yukata: {group: 'traditional', description: 'Japanese yukata: indigo summer robe with white crossover collar, wide sleeves, orange obi sash, ankle-length hem, geta.', bareLegs: true},
  kimono: {group: 'traditional', description: 'Japanese kimono: plum robe with white crossover collar, wide sleeves, wide gold obi, ankle-length hem.', bareLegs: true},
  'kitchen-apron': {group: 'casual', description: 'Home cook: mustard short-sleeve blouse, plum skirt just below the knee, brick-red bib apron from the chest to below the hip with a dark red waist tie, dark shoes.', bareLegs: true},
  'home-lounge': {group: 'casual', description: 'At home in the evening: loose oatmeal knit cardigan over a dusty-rose T-shirt, grey lounge trousers, cream socks (EDU-EP06 owner; front, profile).'},
  'eva-suit': {group: 'work', description: 'EVA spacesuit: white long-sleeve suit with boots, blue neck lock collar, backpack and belt; wider shoulder for the bulk. Gloves, neck ring and the bubble / visor / 1966 round helmet come from `paintEva` (eva.ts); `evaSuit()` adds the CREW / 1960s tints (four views and front three-quarter).', bulk: EVA_BULK},
  'park-casual': {group: 'casual', description: 'Weekend park walk: mustard crew-neck tee, denim-blue knee-length shorts with bare shins and white socks, white sneakers, blue baseball cap (four views).'},
  'trainer-vest': {group: 'work', description: 'Dog trainer: open olive multi-pocket vest over a grey short-sleeve tee, khaki cargo trousers, dark belt with a brown treat pouch on the right hip, trail shoes (EDU-EP19; stopwatch = props.ts `paintStopwatch`).'},
  commuter: {group: 'casual', description: 'Weekday commuter: mustard short-sleeve blouse, navy trousers, dark flats; reads warm through tinted car glass (EDU-EP21 DRIVER on woman-ponytail, seated with car-seat.ts).'},
};

/**
 * Put `WARDROBE[outfitId]` on a character: a new `CastDef` with the same `height`, `seed` and body build (`shoulder`, `headScale`,
 * `armScale`) and the same head, except the monk's shaved head. Pants are painted in the wearer's skin for skirt and robe outfits
 * (`bareLegs`), and hems scale with height so a child's skirt stays knee length.
 */
export const dress = (def: CastDef, outfitId: OutfitId): CastDef => {
  const spec = WARDROBE[outfitId], info = WARDROBE_INFO[outfitId];
  const k = def.height / REF_HEIGHT;
  const outfit: Outfit = {...spec, shoulder: info.bulk ? Math.max(def.outfit.shoulder, 0.34) * info.bulk : def.outfit.shoulder};
  if (info.bareLegs) outfit.pants = def.head.skin;
  if (spec.skirtHem !== undefined) outfit.skirtHem = spec.skirtHem * k;
  if (spec.gear?.overcoat) outfit.gear = {...spec.gear, overcoat: {...spec.gear.overcoat, hem: spec.gear.overcoat.hem * k}};
  let head = def.head;
  if (info.shavesHead) {
    head = {...def.head, cut: 'shaved'};
    delete head.facial; // a shaved monk keeps no beard or hair tie (head is a copy)
    delete head.accent;
  }
  return {...def, head, outfit};
};

/** Coral hoodie colours (EG-EP02 `คุณ`; Film brief EG2-BRIEF-FILM-R1 VD03): body and sleeves, and the darker hood. The grey-blue kit hoodie vanishes on a cool dawn plate. */
export const HOODIE_CORAL = {body: '#d0503f', hood: '#a8432f'} as const;

/**
 * Per-video colour override of a worn hoodie, through the same `outfit` spread an episode would write by hand: `shirt` and `sleeve`
 * take `body`; the hood (`gear.collar.color`, which the hood-down bunch and the hood-up hood both use) takes `hood`, default 20% darker
 * than `body`. White drawstrings, jeans and sneakers stay. A def without a hood collar is returned with only the body recoloured.
 */
export const tintHoodie = (def: CastDef, body: string = HOODIE_CORAL.body, hood: string = body === HOODIE_CORAL.body ? HOODIE_CORAL.hood : mixColor(body, '#000000', 0.2)): CastDef => {
  const gear = def.outfit.gear, collar = gear?.collar;
  return {...def, outfit: {...def.outfit, shirt: body, sleeve: body, ...(gear && collar?.kind === 'hood' ? {gear: {...gear, collar: {...collar, color: hood}}} : {})}};
};
