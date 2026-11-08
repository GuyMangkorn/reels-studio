import {EXPRESSION_IDS, type ExpressionId} from './expressions';
import {PEOPLE_INFO, PERSON_IDS, type PersonGroup, type PersonId} from './people';
import {ALL_POSE_IDS, type AnyPoseId} from './poses';
import type {CastMember} from './shot-templates';
import {OUTFIT_IDS, type OutfitId} from './wardrobe';

// Casting lines: one cast member per line, written the way a scene sheet names a character.
//
//   person [+ outfit] [, pose] [, expression]        e.g.  man-parted + police, P15, scared
//
// - `person` is a `PEOPLE` id, `outfit` a `WARDROBE` id, `pose` P01-P46 (`poses.ts`), `expression` an `EXPRESSIONS` id. Each part is
//   optional after the person, but the order is fixed: the pose comes before the expression. Spaces around `+` and `,` do not matter.
// - `parseCasting` returns a `CastMember` (`shot-templates.ts`) or throws with the line, the field and the valid choices. Use it for
//   every casting string a scene or a test writes; it does not look at the picture (a pose the figure's view lacks falls back to P01).
// - Added 1 Nov 2026 (pass 3). Card sheet: `KIT-CAST-CARDS` (`cast-cards-sheet.tsx`). Stable IDs: the ids of the libraries it parses.

export const CASTING_FORMAT = 'person [+ outfit] [, pose] [, expression]';

const isPerson = (s: string): s is PersonId => (PERSON_IDS as readonly string[]).includes(s);
const isOutfit = (s: string): s is OutfitId => (OUTFIT_IDS as readonly string[]).includes(s);
const isPose = (s: string): s is AnyPoseId => (ALL_POSE_IDS as readonly string[]).includes(s);
const isExpression = (s: string): s is ExpressionId => (EXPRESSION_IDS as readonly string[]).includes(s);
const POSE_TOKEN = /^P\d{2}$/;

/** Parses one casting line. Throws `Error` naming the line and the problem; never returns a partial member. */
export const parseCasting = (line: string): CastMember => {
  const fail = (why: string): Error => new Error(`casting "${line}": ${why} (format: ${CASTING_FORMAT})`);
  const [head, ...fields] = line.split(',').map((s) => s.trim());
  const [person, outfit, extra] = (head ?? '').split('+').map((s) => s.trim());
  if (!person) throw fail('missing person');
  if (extra !== undefined) throw fail('more than one "+" before the first comma');
  if (!isPerson(person)) throw fail(`unknown person "${person}" (ids: ${PERSON_IDS.join(', ')})`);
  const m: CastMember = {person};
  if (outfit !== undefined) {
    if (!outfit) throw fail('empty outfit after "+"');
    if (!isOutfit(outfit)) throw fail(`unknown outfit "${outfit}" (ids: ${OUTFIT_IDS.join(', ')})`);
    m.outfit = outfit;
  }
  for (const token of fields) {
    if (!token) throw fail('empty field between commas');
    if (POSE_TOKEN.test(token)) {
      if (m.expression !== undefined) throw fail(`pose "${token}" must come before the expression`);
      if (m.pose !== undefined) throw fail(`second pose "${token}"`);
      if (!isPose(token)) throw fail(`unknown pose "${token}" (P01-P46 in poses.ts)`);
      m.pose = token;
    } else if (isExpression(token)) {
      if (m.expression !== undefined) throw fail(`second expression "${token}"`);
      m.expression = token;
    } else {
      throw fail(`unknown field "${token}": expected a pose (P01-P46) or an expression id`);
    }
  }
  return m;
};

/** The casting line of a member: `parseCasting(formatCasting(m))` gives `m` back. */
export const formatCasting = (m: CastMember): string => [`${m.person}${m.outfit ? ` + ${m.outfit}` : ''}`, m.pose, m.expression].filter(Boolean).join(', ');

const GROUP_LABEL: Record<PersonGroup, string> = {'working-age': 'Working-age adult', child: 'Child', older: 'Older adult'};
/** Role label on a card: age group, gender and approximate age (`PEOPLE_INFO`). */
export const roleLabel = (id: PersonId): string => {
  const i = PEOPLE_INFO[id];
  return `${GROUP_LABEL[i.group]}, ${i.gender}, about ${i.age}`;
};

/**
 * Three suggested poses per card (front view, no prop the kit lacks). Boss's picks for casting by age and gender; a scene may use any
 * P01-P46 pose the view has. Film or Mark overrides them by writing the pose into the casting line.
 */
export const CARD_POSES: Record<PersonId, readonly [AnyPoseId, AnyPoseId, AnyPoseId]> = {
  'man-crop': ['P03', 'P09', 'P15'],
  'man-parted': ['P02', 'P20', 'P03'],
  'man-spiky': ['P07', 'P29', 'P22'],
  'man-buzz': ['P06', 'P09', 'P13'],
  'woman-ponytail': ['P07', 'P08', 'P10'],
  'woman-curly': ['P06', 'P11', 'P23'],
  'woman-pixie': ['P02', 'P27', 'P24'],
  'boy-school': ['P07', 'P08', 'P21'],
  'girl-school': ['P29', 'P12', 'P23'],
  'man-elder': ['P02', 'P04', 'P06'],
  'woman-elder': ['P03', 'P06', 'P15'],
  'woman-long': ['P10', 'P23', 'P27'],
  'woman-bob': ['P07', 'P29', 'P12'],
  'man-shaved': ['P03', 'P24', 'P14'],
};

/** Expressions on each card's strip, in order. */
export const CARD_EXPRESSIONS: readonly ExpressionId[] = ['neutral', 'happy', 'worried', 'angry', 'sad', 'surprised', 'scared'];
