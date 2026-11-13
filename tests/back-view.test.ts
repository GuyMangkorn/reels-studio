import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {drawFigure, type FigPose} from '../src/painted/kit/cast';
import {hoodColorOf, hoodUpHead} from '../src/painted/kit/back';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE, PERSON_IDS} from '../src/painted/kit/people';
import {poseArms} from '../src/painted/kit/poses';
import {HOODIE_CORAL, dress, tintHoodie} from '../src/painted/kit/wardrobe';

// Back view (`FigPose.view: 'back'`, kit/back.ts), hood-up (`FigPose.hoodUp`) and the coral hoodie override. Added 3 Nov 2026 (EG-EP02).
const recorder = () => {
  const calls: string[] = [];
  return {calls, brush: new Proxy({}, {get: (_, name) => (...args: unknown[]) => { calls.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush};
};
const g: Pt = [540, 1500], unit = 600;
const draw = (def: Parameters<typeof drawFigure>[1], extra: Partial<FigPose>) => {
  const r = recorder();
  const a = drawFigure(makePainter(r.brush, {t: 0, frame: 0}), def, g, unit, {view: 'back', face: EXPRESSIONS.neutral, ...extra}, 0);
  return {a, calls: r.calls.join('|')};
};

test('every PEOPLE entry draws from behind with finite anchors, centred and within its height', () => {
  for (const id of PERSON_IDS) {
    const def = PEOPLE[id];
    const {a} = draw(def, poseArms('P01', def, g, unit));
    for (const v of [...a.head, ...a.rHand, ...a.lHand, a.top, a.bottom]) assert.ok(Number.isFinite(v), id);
    assert.ok(Math.abs(a.head[0] - g[0]) < 1, `${id} head on the centre line`);
    assert.ok(Math.abs(g[1] - a.top - def.height * unit) < 0.12 * def.height * unit, `${id} head top near its height`);
    assert.ok(a.rHand[0] > g[0] && a.lHand[0] < g[0], `${id}: the character's right hand is screen right from behind`);
  }
});

test('a front-view pose is mirrored about the centre line for the back view', () => {
  const def = PEOPLE['woman-bob'];
  const arms = poseArms('P09', def, g, unit); // hands on hips
  const back = draw(def, arms).a, front = drawFigure(makePainter(recorder().brush, {t: 0, frame: 0}), def, g, unit, {view: 'front', face: EXPRESSIONS.neutral, ...arms}, 0);
  // front: right hand on screen-left; back: right hand mirrored to screen-right, same height
  assert.ok(Math.abs((back.rHand[0] - g[0]) + (front.rHand[0] - g[0])) < unit * 0.1);
});

test('the back view is deterministic and the hood changes it', () => {
  const def = dress(PEOPLE['woman-bob'], 'hoodie');
  const a = draw(def, {}).calls, b = draw(def, {}).calls, up = draw(def, {hoodUp: true}).calls;
  assert.equal(a, b);
  assert.notEqual(a, up);
});

test('hood up covers the hair in every view; hood down keeps existing draws unchanged', () => {
  const def = dress(PEOPLE['woman-bob'], 'hoodie');
  const o = def.outfit;
  assert.equal(hoodColorOf(o), '#66778a');
  const head = hoodUpHead(def.head, o);
  assert.equal(head.cut, 'hood');
  assert.equal(head.hood, '#66778a');
  for (const view of ['front', 'left', 'right', 'back'] as const) {
    assert.notEqual(draw(def, {view}).calls, draw(def, {view, hoodUp: true}).calls, view);
  }
  // hoodUp absent or false is identical to the pre-change draw
  assert.equal(draw(def, {view: 'front'}).calls, draw(def, {view: 'front', hoodUp: false}).calls);
});

test('tintHoodie recolours through the outfit spread and keeps everything else', () => {
  const base = dress(PEOPLE['woman-bob'], 'hoodie'), coral = tintHoodie(base);
  assert.equal(coral.outfit.shirt, HOODIE_CORAL.body);
  assert.equal(coral.outfit.sleeve, HOODIE_CORAL.body);
  assert.equal(coral.outfit.gear?.collar?.color, HOODIE_CORAL.hood);
  assert.equal(coral.outfit.gear?.collar?.trim, '#e8e4da');
  assert.equal(coral.outfit.pants, base.outfit.pants);
  assert.equal(coral.outfit.shoes, base.outfit.shoes);
  assert.deepEqual(coral.head, base.head);
  assert.equal(coral.seed, base.seed);
  assert.equal(hoodColorOf(coral.outfit), HOODIE_CORAL.hood);
  assert.equal(base.outfit.shirt, '#7a8a9a'); // the input is not mutated
  // a def without a hood collar only gets the body colour
  assert.equal(tintHoodie(dress(PEOPLE['woman-bob'], 'office'), '#123456').outfit.gear?.collar, undefined);
});

// Body poses from behind (KIT-VIEW-AUDIT VA01, 13 Nov 2026): crouch, squat, kneel, floorSit and run use the front frame's legs.
test('body poses lower the figure from behind; zero amounts draw exactly as standing', () => {
  const def = PEOPLE['woman-curly'];
  const stand = draw(def, {});
  assert.equal(draw(def, {crouch: 0}).calls, stand.calls, 'crouch 0 = standing');
  assert.equal(draw(def, {kneel: 0, floorSit: 0, squat: 0}).calls, stand.calls, 'zero modes = standing');
  const low = (extra: Partial<FigPose>) => draw(def, extra).a.top - stand.a.top;
  for (const [name, extra] of [['crouch', {crouch: 0.9}], ['squat', {squat: 1}], ['kneel', {kneel: 1}], ['floorSit', {floorSit: 1}]] as const) {
    assert.ok(low(extra) > 0.15 * unit, `${name}: head top drops by more than 0.15 m (got ${(low(extra) / unit).toFixed(2)} m)`);
  }
  // Run: the body stays near standing height, and one foot is off the ground (a lifted sole is drawn).
  assert.ok(Math.abs(low({run: 0.25})) < 0.1 * unit, 'run keeps the standing height');
  assert.notEqual(draw(def, {run: 0.25}).calls, stand.calls);
});

test('run from behind pumps the arms with the phase: the back-swinging hand hangs lower, then the sides swap (VA06)', () => {
  const def = PEOPLE['woman-curly'];
  const a = draw(def, {run: 0.25}).a, b = draw(def, {run: 0.75}).a;
  assert.ok(Math.abs(a.rHand[1] - a.lHand[1]) > 0.04 * unit, 'one hand forward (high, hidden), one back (low)');
  assert.ok(Math.sign(a.rHand[1] - a.lHand[1]) === -Math.sign(b.rHand[1] - b.lHand[1]), 'half a cycle later the arms swap');
  assert.ok(a.rHand[0] > g[0] - 0.05 * unit && a.lHand[0] < g[0] + 0.05 * unit, 'each hand stays on its own side');
});
