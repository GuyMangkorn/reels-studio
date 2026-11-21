// test-scope: shared
import assert from 'node:assert/strict';
import {test} from 'node:test';
import type {Brush} from '../src/painted/BrushCanvas';
import {drawFigure, type CastDef, type FigPose} from '../src/painted/kit/cast';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {poseArms} from '../src/painted/kit/poses';

// Front-view brows (EDU-EP32 LF02 gate note, 21 Nov 2026): a face with a `look` draws only its look brow. 13101c7 left the legacy bar brow in
// the `else` of the sideDetail brow-hair branch, so every look face without sideDetail painted two stacked brows per eye.
const BROW = '#123456';
const gp: Pt = [540, 1500], unit = 600;
const browCalls = (def: CastDef) => {
  let n = 0;
  const brush = new Proxy({}, {get: () => (...a: unknown[]) => { if (a.includes(BROW)) n++; }}) as Brush;
  drawFigure(makePainter(brush, {t: 0, frame: 0}), def, gp, unit, {view: 'front', face: EXPRESSIONS.neutral, ...poseArms('P01', def, gp, unit, 'front')} as FigPose, 0);
  return n;
};
const withHead = (def: CastDef, head: Partial<CastDef['head']>): CastDef => ({...def, head: {...def.head, brows: BROW, ...head}});

test('a look face paints the same brow fills with and without sideDetail (no second, legacy bar brow)', () => {
  for (const id of ['man-crop', 'man-buzz', 'man-parted'] as const) {
    const plain = browCalls(withHead(PEOPLE[id], {sideDetail: false}));
    const detail = browCalls(withHead(PEOPLE[id], {sideDetail: true}));
    assert.ok(plain > 0, id);
    assert.equal(plain, detail, `${id}: brow-coloured calls without sideDetail ${plain}, with ${detail}`);
  }
});

test('a face without a look still paints the legacy bar brows', () => {
  assert.ok(browCalls(withHead(PEOPLE['man-crop'], {look: undefined})) > 0);
});
