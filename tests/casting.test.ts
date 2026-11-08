import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CARD_EXPRESSIONS, CARD_POSES, CASTING_FORMAT, formatCasting, parseCasting, roleLabel} from '../src/painted/kit/casting';
import {EXPRESSION_IDS} from '../src/painted/kit/expressions';
import {PERSON_IDS} from '../src/painted/kit/people';
import {ALL_POSE_IDS, POSE_INFO, hasView} from '../src/painted/kit/poses';
import {OUTFIT_IDS} from '../src/painted/kit/wardrobe';

// Casting lines (`kit/casting.ts`) and the casting-card data. Added 1 Nov 2026 (pass 3).

test('the format example from the brief parses to its three parts', () => {
  assert.deepEqual(parseCasting('man-parted + police, P15, scared'), {person: 'man-parted', outfit: 'police', pose: 'P15', expression: 'scared'});
});

test('every part is optional after the person, and spaces around + and , do not matter', () => {
  assert.deepEqual(parseCasting('boy-school'), {person: 'boy-school'});
  assert.deepEqual(parseCasting('boy-school, P07'), {person: 'boy-school', pose: 'P07'});
  assert.deepEqual(parseCasting('boy-school, happy'), {person: 'boy-school', expression: 'happy'});
  assert.deepEqual(parseCasting('woman-ponytail + nurse'), {person: 'woman-ponytail', outfit: 'nurse'});
  assert.deepEqual(parseCasting('  man-crop+police,P09,smug  '), {person: 'man-crop', outfit: 'police', pose: 'P09', expression: 'smug'});
  assert.deepEqual(parseCasting('man-crop , P02 , worried'), {person: 'man-crop', pose: 'P02', expression: 'worried'});
});

test('no optional field appears as an undefined key', () => {
  assert.deepEqual(Object.keys(parseCasting('man-crop')), ['person']);
});

test('every person, outfit, pose and expression id parses, and formatCasting gives the line back', () => {
  for (const id of PERSON_IDS) assert.equal(parseCasting(id).person, id);
  for (const o of OUTFIT_IDS) assert.deepEqual(parseCasting(`man-crop + ${o}`), {person: 'man-crop', outfit: o});
  for (const p of ALL_POSE_IDS) assert.deepEqual(parseCasting(`man-crop, ${p}`), {person: 'man-crop', pose: p});
  for (const e of EXPRESSION_IDS) assert.deepEqual(parseCasting(`man-crop, ${e}`), {person: 'man-crop', expression: e});
  for (const person of PERSON_IDS) {
    const m = {person, outfit: OUTFIT_IDS[0], pose: ALL_POSE_IDS[0], expression: EXPRESSION_IDS[0]};
    assert.deepEqual(parseCasting(formatCasting(m)), m);
    assert.equal(formatCasting({person}), person);
  }
  assert.equal(formatCasting(parseCasting('man-parted + police, P15, scared')), 'man-parted + police, P15, scared');
});

test('invalid lines throw with the line and the problem, never a partial member', () => {
  const cases: [string, RegExp][] = [
    ['', /missing person/],
    ['  ', /missing person/],
    ['nobody', /unknown person "nobody"/],
    ['man-crop + nope', /unknown outfit "nope"/],
    ['man-crop +', /empty outfit after "\+"/],
    ['man-crop + police + nurse', /more than one "\+"/],
    ['man-crop, P47', /unknown pose "P47"/],
    ['man-crop, P5', /unknown field "P5"/],
    ['man-crop, P07, P08', /second pose "P08"/],
    ['man-crop, scared, P07', /pose "P07" must come before the expression/],
    ['man-crop, happy, sad', /second expression "sad"/],
    ['man-crop, Scared', /unknown field "Scared"/],
    ['man-crop,', /empty field between commas/],
    ['man-crop, , happy', /empty field between commas/],
  ];
  for (const [line, why] of cases) {
    assert.throws(() => parseCasting(line), (e: Error) => why.test(e.message) && e.message.includes(`casting "${line}"`) && e.message.includes(CASTING_FORMAT), `${JSON.stringify(line)}`);
  }
});

test('the card catalog: three suggested poses per person, all front-view, with no prop the kit lacks', () => {
  for (const id of PERSON_IDS) {
    const poses = CARD_POSES[id];
    assert.equal(poses.length, 3, id);
    assert.equal(new Set(poses).size, 3, `${id} distinct`);
    for (const p of poses) {
      assert.ok((ALL_POSE_IDS as readonly string[]).includes(p), `${id} ${p} is a pose id`);
      assert.ok(hasView(p, 'front'), `${id} ${p} has a front view`);
      assert.equal(POSE_INFO[p].missing, undefined, `${id} ${p} needs no missing prop`);
    }
  }
});

test('the expression strip uses real expression ids, once each', () => {
  assert.equal(new Set(CARD_EXPRESSIONS).size, CARD_EXPRESSIONS.length);
  assert.equal(CARD_EXPRESSIONS.length, 7);
  for (const e of CARD_EXPRESSIONS) assert.ok((EXPRESSION_IDS as readonly string[]).includes(e), e);
});

test('role labels name the age group, gender and age of each person', () => {
  assert.equal(roleLabel('boy-school'), 'Child, male, about 9');
  assert.equal(roleLabel('woman-elder'), 'Older adult, female, about 70');
  assert.equal(roleLabel('man-parted'), 'Working-age adult, male, about 42');
  for (const id of PERSON_IDS) assert.ok(roleLabel(id).length > 10, id);
});
