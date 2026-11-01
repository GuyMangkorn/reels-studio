import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {Brush} from '../src/painted/BrushCanvas';
import {drawFigure, shoulderHeight, type CastDef, type FigPose} from '../src/painted/kit/cast';
import {EXPRESSIONS, EXPRESSION_IDS, EXPRESSION_INFO} from '../src/painted/kit/expressions';
import {hatFront, hatSide, type HatKind} from '../src/painted/kit/gear';
import type {FaceState} from '../src/painted/kit/head';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE, PERSON_IDS} from '../src/painted/kit/people';
import {OUTFIT_IDS, REF_HEIGHT, WARDROBE, WARDROBE_INFO, dress} from '../src/painted/kit/wardrobe';
import {CAST} from '../src/painted/worldfog/cast';

// Expression presets (kit/expressions.ts) and job wardrobe (kit/wardrobe.ts, `Outfit.gear` in kit/cast.ts). Added 1 Nov 2026.
const brush = new Proxy({}, {get: () => () => undefined}) as Brush;
/** A brush that records every call, to compare two draws mark for mark. */
const recorder = () => {
  const calls: string[] = [];
  return {calls, brush: new Proxy({}, {get: (_, name) => (...args: unknown[]) => { calls.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush};
};
const g: Pt = [540, 1500], unit = 600;
const HEX = /^#[0-9a-f]{6}$/i;
const FACE: FaceState = EXPRESSIONS.neutral;

const REQUIRED_EXPRESSIONS = ['neutral', 'happy', 'laugh', 'smug', 'sad', 'crying', 'angry', 'furious', 'surprised', 'scared', 'terrified', 'worried', 'suspicious', 'disgusted', 'sleepy', 'whisper', 'shock', 'talk'];

test('expression ids are unique and every id has a preset and an info line', () => {
  assert.equal(new Set(EXPRESSION_IDS).size, EXPRESSION_IDS.length);
  assert.deepEqual(Object.keys(EXPRESSIONS).sort(), [...EXPRESSION_IDS].sort());
  assert.deepEqual(Object.keys(EXPRESSION_INFO).sort(), [...EXPRESSION_IDS].sort());
  for (const id of REQUIRED_EXPRESSIONS) assert.ok((EXPRESSION_IDS as readonly string[]).includes(id), `${id} listed`);
  for (const id of EXPRESSION_IDS) {
    assert.match(id, /^[a-z]+$/, 'stable English id');
    const info = EXPRESSION_INFO[id];
    assert.ok(info.description.length > 15 && info.use.length > 15 && !info.description.includes('\n') && !info.use.includes('\n'), `${id} one-line description and use`);
  }
});

test('no two expression presets are the same face, and the nine people-sheet faces kept their values', () => {
  const keys = EXPRESSION_IDS.map((id) => JSON.stringify(EXPRESSIONS[id]));
  assert.equal(new Set(keys).size, keys.length, 'distinct presets');
  assert.deepEqual(EXPRESSIONS.neutral, {brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'flat'});
  assert.deepEqual(EXPRESSIONS.happy, {brow: 'up', eyes: 'dot', look: [0, 0], mouth: 'smile'});
  assert.deepEqual(EXPRESSIONS.sad, {brow: 'worry', eyes: 'half', look: [0, 0.5], mouth: 'frown'});
  assert.deepEqual(EXPRESSIONS.angry, {brow: 'angry', eyes: 'dot', look: [0, 0], mouth: 'frown', squint: 0.5});
  assert.deepEqual(EXPRESSIONS.surprised, {brow: 'up', eyes: 'wide', look: [0, 0], mouth: 'o'});
  assert.deepEqual(EXPRESSIONS.scared, {brow: 'worry', eyes: 'wide', look: [-0.6, 0], mouth: 'gasp'});
  assert.deepEqual(EXPRESSIONS.worried, {brow: 'worry', eyes: 'dot', look: [0.3, 0.2], mouth: 'wavy'});
  assert.deepEqual(EXPRESSIONS.talk, {brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'talk', open: 0.7});
  assert.deepEqual(EXPRESSIONS.asleep, {brow: 'flat', eyes: 'shut', look: [0, 0], mouth: 'flat'});
  for (const id of EXPRESSION_IDS) {
    const f = EXPRESSIONS[id];
    assert.ok(f.look.length === 2 && f.look.every(Number.isFinite), `${id} look`);
    for (const v of [f.open, f.squint, f.browMix, f.tears]) assert.ok(v === undefined || (v >= 0 && v <= 1), `${id} 0..1 control`);
  }
});

test('every expression draws finite in front, left and right on an adult, a child and an elder', () => {
  for (const who of ['man-parted', 'girl-school', 'man-elder'] as const) {
    for (const view of ['front', 'left', 'right'] as const) {
      for (const id of EXPRESSION_IDS) {
        const a = drawFigure(makePainter(brush, {t: 0.3, frame: 9}), PEOPLE[who], g, unit, {view, face: EXPRESSIONS[id]}, 0.3);
        for (const v of [...a.head, a.headTop, a.chin]) assert.ok(Number.isFinite(v), `${who} ${view} ${id}`);
      }
    }
  }
});

test('tears and sweat paint only when asked: a face without them draws the same marks as before', () => {
  const calls = (face: FaceState) => {
    const r = recorder();
    drawFigure(makePainter(r.brush, {t: 0.3, frame: 9}), PEOPLE['man-parted'], g, unit, {view: 'front', face}, 0.4);
    return r.calls.length;
  };
  const base = calls(EXPRESSIONS.worried);
  assert.equal(calls({...EXPRESSIONS.worried, tears: 0, sweat: false}), base);
  assert.ok(calls({...EXPRESSIONS.worried, tears: 1}) > base, 'tears add marks');
  assert.ok(calls({...EXPRESSIONS.worried, sweat: true}) > base, 'sweat adds marks');
});

test('the wardrobe lists unique ids, each with an outfit and an info line, and the requested jobs are present', () => {
  assert.equal(new Set(OUTFIT_IDS).size, OUTFIT_IDS.length);
  assert.deepEqual(Object.keys(WARDROBE).sort(), [...OUTFIT_IDS].sort());
  assert.deepEqual(Object.keys(WARDROBE_INFO).sort(), [...OUTFIT_IDS].sort());
  for (const want of ['office', 'police', 'nurse', 'doctor', 'monk', 'vendor', 'rider', 'hoodie', 'guard', 'kimono', 'yukata']) assert.ok((OUTFIT_IDS as readonly string[]).includes(want), want);
  assert.ok(OUTFIT_IDS.some((id) => id.startsWith('student-th')) && OUTFIT_IDS.some((id) => id.startsWith('school-jp')), 'Thai and Japanese school uniforms');
  for (const id of OUTFIT_IDS) {
    assert.match(id, /^[a-z]+(-[a-z]+)*$/, 'stable English id');
    const info = WARDROBE_INFO[id], o = WARDROBE[id];
    assert.ok(info.description.length > 30 && !info.description.includes('\n'), `${id} one-line description`);
    for (const c of [o.shirt, o.sleeve, o.pants, o.shoes, o.jacket, o.apron, o.skirt, o.gear?.drape, o.gear?.pack, o.gear?.badge, o.gear?.belt?.color, o.gear?.belt?.buckle, o.gear?.collar?.color, o.gear?.collar?.trim,
      o.gear?.tie?.color, o.gear?.hat?.color, o.gear?.hat?.band, o.gear?.overcoat?.color]) {
      if (c !== undefined) assert.match(c, HEX, `${id} colour ${c}`);
    }
    if (o.skirt) assert.ok(o.skirtHem !== undefined && o.skirtHem > 0 && o.skirtHem < 0.6, `${id} skirt hem`);
  }
});

test('dress() returns a new CastDef that keeps height, seed, build and head (the monk alone is shaved) and mutates nothing', () => {
  const snapshotW = JSON.stringify(WARDROBE);
  for (const pid of PERSON_IDS) {
    const def = PEOPLE[pid], before = JSON.stringify(def);
    for (const oid of OUTFIT_IDS) {
      const d = dress(def, oid);
      assert.notEqual(d, def);
      assert.equal(d.height, def.height, `${pid} ${oid} height`);
      assert.equal(d.seed, def.seed);
      assert.equal(d.headScale, def.headScale);
      assert.equal(d.armScale, def.armScale);
      assert.equal(d.outfit.shoulder, def.outfit.shoulder, `${pid} ${oid} build`);
      if (WARDROBE_INFO[oid].shavesHead) {
        assert.equal(d.head.cut, 'shaved');
        assert.equal(d.head.facial, undefined);
        assert.equal(d.head.skin, def.head.skin);
        assert.equal(d.head.hair, def.head.hair);
        assert.equal(d.head.glasses, def.head.glasses);
        assert.equal(d.head.lines, def.head.lines);
      } else assert.deepEqual(d.head, def.head, `${pid} ${oid} head`);
      if (WARDROBE_INFO[oid].bareLegs) assert.equal(d.outfit.pants, def.head.skin, `${pid} ${oid} bare legs`);
      assert.equal(shoulderHeight(d), shoulderHeight(def), `${pid} ${oid} shoulder anchor`);
    }
    assert.equal(JSON.stringify(def), before, `${pid} not mutated`);
  }
  assert.equal(JSON.stringify(WARDROBE), snapshotW, 'WARDROBE not mutated');
});

test('hems scale with the wearer: a child skirt is knee length on the child, an adult skirt on the adult', () => {
  for (const oid of OUTFIT_IDS.filter((id) => WARDROBE[id].skirt)) {
    const adult = dress(PEOPLE['woman-ponytail'], oid), child = dress(PEOPLE['girl-school'], oid);
    assert.ok(Math.abs(adult.outfit.skirtHem! / adult.height - WARDROBE[oid].skirtHem! / REF_HEIGHT) < 1e-9, `${oid} adult hem fraction`);
    assert.ok(Math.abs(child.outfit.skirtHem! / child.height - WARDROBE[oid].skirtHem! / REF_HEIGHT) < 1e-9, `${oid} child hem fraction`);
    assert.ok(child.outfit.skirtHem! < adult.outfit.skirtHem!, `${oid} child hem is lower to the ground than the adult's`);
  }
  const coat = dress(PEOPLE['girl-school'], 'doctor').outfit.gear!.overcoat!;
  assert.ok(coat.hem < WARDROBE.doctor.gear!.overcoat!.hem, 'coat hem scales down for a child');
});

test('every outfit on every person draws finite in front, left, right and crouched, with the head at the character height', () => {
  for (const pid of PERSON_IDS) {
    for (const oid of OUTFIT_IDS) {
      const def = dress(PEOPLE[pid], oid);
      for (const view of ['front', 'left', 'right'] as const) {
        for (const crouch of [0, 0.6]) {
          const pose: FigPose = {view, face: FACE, crouch};
          const a = drawFigure(makePainter(brush, {t: 0.3, frame: 9}), def, g, unit, pose, 0.3);
          for (const v of [...a.head, ...a.rHand, ...a.lHand, a.headTop, a.chin]) assert.ok(Number.isFinite(v), `${pid} ${oid} ${view}`);
          if (crouch === 0) assert.ok(Math.abs((g[1] - a.headTop) / unit - def.height) < 0.03 * def.height, `${pid} ${oid} ${view} drawn height`);
        }
      }
      const sil = drawFigure(makePainter(brush, {t: 0, frame: 0}), def, g, unit, {view: 'front', face: FACE, silhouette: '#101010'}, 0);
      assert.ok(Number.isFinite(sil.headTop), `${pid} ${oid} silhouette`);
    }
  }
});

test('gear is default-absent: an empty gear object and a missing one draw the same marks, and no existing character carries gear', () => {
  for (const def of [...PERSON_IDS.map((id) => PEOPLE[id]), ...Object.values(CAST)] as CastDef[]) {
    assert.equal(def.outfit.gear, undefined);
    for (const view of ['front', 'right'] as const) {
      const a = recorder(), b = recorder();
      drawFigure(makePainter(a.brush, {t: 0.3, frame: 9}), def, g, unit, {view, face: FACE}, 0.4);
      drawFigure(makePainter(b.brush, {t: 0.3, frame: 9}), {...def, outfit: {...def.outfit, gear: {}}}, g, unit, {view, face: FACE}, 0.4);
      assert.ok(a.calls.length > 50);
      assert.deepEqual(a.calls, b.calls, `${view} marks unchanged by an empty gear`);
    }
  }
});

test('gear adds marks only for the garments it names', () => {
  const marks = (def: CastDef, view: 'front' | 'right') => {
    const r = recorder();
    drawFigure(makePainter(r.brush, {t: 0.3, frame: 9}), def, g, unit, {view, face: FACE}, 0.4);
    return r.calls.length;
  };
  const def = PEOPLE['man-parted'];
  for (const view of ['front', 'right'] as const) {
    const base = marks(def, view);
    const withGear = (gear: NonNullable<CastDef['outfit']['gear']>) => marks({...def, outfit: {...def.outfit, gear}}, view);
    assert.ok(withGear({hat: {kind: 'cap', color: '#445566'}}) > base, `${view} hat`);
    assert.ok(withGear({pack: '#cc7722'}) > base, `${view} pack`);
    assert.ok(withGear({belt: {color: '#222222'}}) > base, `${view} belt`);
    assert.ok(withGear({overcoat: {color: '#eeeeee', hem: 0.5}}) > base, `${view} overcoat`);
    assert.ok(withGear({drape: '#aa6611'}) > base, `${view} drape`);
  }
  assert.ok(marks({...def, outfit: {...def.outfit, gear: {tie: {color: '#aa2233'}}}}, 'front') > marks(def, 'front'), 'tie');
  assert.ok(marks({...def, outfit: {...def.outfit, gear: {wideSleeves: true}}}, 'front') > marks(def, 'front'), 'wide sleeves');
});

test('hat shapes are finite polygons near the head in both views', () => {
  for (const kind of ['cap', 'helmet', 'nurse'] as HatKind[]) {
    for (const parts of [hatFront(kind), hatSide(kind)]) {
      assert.ok(parts.length >= 2, `${kind} parts`);
      for (const {pts} of parts) {
        assert.ok(pts.length >= 4, `${kind} polygon`);
        for (const [x, y] of pts) assert.ok(Number.isFinite(x) && Number.isFinite(y) && Math.abs(x) < 1.8 && y > -1.7 && y < 0.8, `${kind} point ${x},${y}`);
      }
    }
  }
});

test('the sheet entry registers KIT-EXPRESSIONS and KIT-WARDROBE', () => {
  const text = readFileSync(new URL('../src/painted/kit/people-sheet.tsx', import.meta.url), 'utf8');
  assert.match(text, /id: 'KIT-EXPRESSIONS'/);
  assert.match(text, /id: 'KIT-WARDROBE'/);
});
