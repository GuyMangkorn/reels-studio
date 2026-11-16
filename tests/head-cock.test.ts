// test-scope: shared
import assert from 'node:assert/strict';
import {test} from 'node:test';
import type {Brush} from '../src/painted/BrushCanvas';
import {drawFigure, type CastDef, type FigPose} from '../src/painted/kit/cast';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE, PERSON_IDS} from '../src/painted/kit/people';
import {poseArms} from '../src/painted/kit/poses';
import {dress} from '../src/painted/kit/wardrobe';
import {YOU2} from '../src/painted/everyone-gone/ep02/places';

// FigPose.headCock (degrees, + = head top toward screen right; user, 4 Nov 2026).
const gp: Pt = [540, 1500], unit = 600;
const draw = (def: CastDef, view: FigPose['view'], extra: Partial<FigPose>) => {
  const calls: string[] = [];
  const brush = new Proxy({}, {get: (_, n) => (...a: unknown[]) => { calls.push(`${String(n)}${JSON.stringify(a)}`); }}) as Brush;
  const armView = view === 'back' ? 'front' : view;
  const a = drawFigure(makePainter(brush, {t: 0, frame: 0}), def, gp, unit, {view, face: EXPRESSIONS.neutral, ...poseArms('P01', def, gp, unit, armView as 'front'), ...extra} as FigPose, 0);
  return {a, calls};
};
const CASES: [FigPose['view'], Partial<FigPose>][] = [['front', {}], ['front', {quarter: 'left', quarterDeg: 30}], ['left', {}], ['right', {}], ['back', {}]];
const DEFS: CastDef[] = [YOU2, dress(PEOPLE['man-parted'], 'police'), PEOPLE['woman-long']];

test('headCock absent, 0 and undefined draw the same strokes in every view', () => {
  for (const def of DEFS) for (const [view, extra] of CASES) for (const hoodUp of [false, true]) {
    const plain = draw(def, view, {...extra, hoodUp}).calls.join('|');
    assert.equal(draw(def, view, {...extra, hoodUp, headCock: 0}).calls.join('|'), plain, `${view} ${JSON.stringify(extra)}`);
    assert.equal(draw(def, view, {...extra, hoodUp, headCock: undefined}).calls.join('|'), plain);
  }
});

test('front and profile: the cock is one rotation about the neck top around the head and hat; every other stroke is unchanged', () => {
  for (const def of DEFS) for (const [view, extra] of CASES.filter(([v]) => v !== 'back')) {
    const plain = draw(def, view, extra).calls;
    const cocked = draw(def, view, {...extra, headCock: 12}).calls;
    const rot = cocked.filter((c) => c.startsWith('rotate'));
    assert.equal(rot.length, 1);
    assert.ok(Math.abs(JSON.parse(rot[0].slice('rotate'.length))[0] - (12 * Math.PI) / 180) < 1e-12);
    const i = cocked.findIndex((c) => c.startsWith('rotate'));
    assert.ok(cocked[i - 2] === 'push[]' && cocked[i - 1].startsWith('translate') && cocked[i + 1].startsWith('translate'));
    let depth = 0, j = i + 2;
    for (; j < cocked.length; j++) {
      if (cocked[j] === 'push[]') depth++;
      else if (cocked[j] === 'pop[]' && depth-- === 0) break;
    }
    const stripped = cocked.filter((_, k) => k < i - 2 || (k > i + 1 && k !== j));
    assert.deepEqual(stripped, plain, `${view} ${JSON.stringify(extra)}`);
  }
});

test('the head anchors follow the cock: + moves the head toward screen right, - toward the left; back view too', () => {
  for (const def of DEFS) for (const [view, extra] of CASES) {
    const a0 = draw(def, view, extra).a, ap = draw(def, view, {...extra, headCock: 12}).a, am = draw(def, view, {...extra, headCock: -12}).a;
    assert.ok(ap.head[0] > a0.head[0] + 1 && am.head[0] < a0.head[0] - 1, `${view} ${JSON.stringify(extra)}`);
    assert.ok(Math.abs(ap.head[0] - a0.head[0] - (a0.head[0] - am.head[0])) < 1e-6, 'symmetric');
    assert.ok(ap.headTop > a0.headTop && ap.chin < a0.chin + 1, 'a tipped head is no taller than the upright one');
    assert.deepEqual([ap.feet, ap.rHand, ap.lHand], [a0.feet, a0.rHand, a0.lHand]);
  }
});

test('back view: the cock moves the head strokes and leaves the neck, collar and body strokes', () => {
  for (const def of DEFS) for (const hoodUp of [false, true]) {
    const plain = draw(def, 'back', {hoodUp}).calls, cocked = draw(def, 'back', {hoodUp, headCock: 10}).calls;
    assert.equal(cocked.length, plain.length);
    assert.notDeepEqual(cocked, plain);
    // the strokes before the first head stroke (body, neck, collar band) are identical
    const firstDiff = cocked.findIndex((c, k) => c !== plain[k]);
    assert.ok(firstDiff > plain.length / 3, `back hood=${hoodUp}: the first changed stroke is ${firstDiff} of ${plain.length}`);
  }
});

test('every PEOPLE entry draws a cocked head in every view with finite anchors and brush arguments', () => {
  for (const id of PERSON_IDS) for (const [view, extra] of CASES) for (const headCock of [-15, 15]) {
    const {a, calls} = draw(PEOPLE[id], view, {...extra, headCock});
    for (const v of [...a.head, a.headTop, a.chin]) assert.ok(Number.isFinite(v), `${id} ${view}`);
    const s = calls.join('|');
    assert.ok(!s.includes('NaN') && !s.includes('null'), `${id} ${view} ${headCock}`);
    assert.equal(calls.filter((c) => c === 'push[]').length, calls.filter((c) => c === 'pop[]').length, `${id} ${view}: push/pop balance`);
  }
});
