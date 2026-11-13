import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {ACTIVITY_MOUTHS_OFF, PANT_HZ, activityFace, activityOf, pantOpen, surpriseOpen, syllableOpen} from '../src/painted/kit/activity-mouths';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {ACTIVITY_MOUTHS_OFF as OFF_FROM_FIGURE_AT, paintFigureAt, type FigureAtOpts} from '../src/painted/kit/figure-at';
import {paintHeadFront, paintHeadSide, type FaceState} from '../src/painted/kit/head';
import {layerMotion} from '../src/painted/kit/motions';
import {makePainter} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import type {YCam} from '../src/painted/kit/ycam';

// Activity mouths (kit/activity-mouths.ts, 13 Nov 2026): the defaults per pose, motion and expression, what a scene keeps, the cycles,
// and that a placement drawn with the activity off paints exactly what the kit painted before.
const recorder = () => {
  const log: string[] = [];
  const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => { log.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush;
  return {brush, log};
};
const cam: YCam = {x: 0, y: 1.4, z: 3, yaw: 0, pitch: 0, f: 900, hy: 960};
const placed = (o: Omit<FigureAtOpts, 'at'>) => {
  const r = recorder();
  paintFigureAt(makePainter(r.brush, {t: o.t, frame: 0}), cam, PEOPLE['man-parted'], {at: [0, 0, 0], ...o});
  return r.log.join('\n');
};
const N = EXPRESSIONS.neutral, ctx = {t: 0.5, seed: 3};

test('defaults: P38 pants, P26 clenches, a talk preset cycles, run motions pant', () => {
  assert.equal(activityOf(N, {...ctx, pose: 'P38', preset: 'neutral'}), 'pant');
  assert.equal(activityOf(N, {...ctx, pose: 'P26', preset: 'neutral'}), 'clench');
  assert.equal(activityOf(EXPRESSIONS.talk, {...ctx, pose: 'P05', preset: 'talk'}), 'talk');
  assert.equal(activityOf(EXPRESSIONS.whisper, {...ctx, preset: 'whisper'}), 'talk');
  assert.equal(activityOf(N, {...ctx, motion: 'run-left-to-right', pose: 'P01', preset: 'neutral'}), 'pant');
  assert.equal(activityOf(N, {...ctx, pose: 'P01', preset: 'neutral'}), null);
});

test('a default replaces only a resting mouth; the scene keeps its own mouth', () => {
  for (const id of ['happy', 'sad', 'surprised', 'furious', 'worried'] as const) assert.equal(activityOf(EXPRESSIONS[id], {...ctx, pose: 'P38', preset: id}), null, id);
  assert.equal(activityOf(EXPRESSIONS.suspicious, {...ctx, pose: 'P38', preset: 'suspicious'}), 'pant');
  assert.equal(activityOf(N, {...ctx, pose: 'P38', preset: 'neutral', sceneMouth: true}), null);
  assert.equal(activityOf(N, {...ctx, pose: 'P38'}), null, 'a whole FaceState from the scene is kept');
  assert.equal(activityOf(N, {...ctx, pose: 'P38', preset: 'neutral', activity: false}), null);
});

test('a forced activity wins over the expression mouth, not over a scene-set mouth', () => {
  assert.equal(activityOf(EXPRESSIONS.happy, {...ctx, preset: 'happy', activity: 'pant'}), 'pant');
  assert.equal(activityOf(EXPRESSIONS.happy, {...ctx, preset: 'happy', activity: 'pant', sceneMouth: true}), null);
  assert.equal(activityOf(N, {...ctx, activity: 'surprise'}), 'surprise');
});

test('pant opens and half-closes with the breath, never shut; seeded phase', () => {
  const vals = Array.from({length: 40}, (_, i) => pantOpen(i / 40, 5));
  assert.ok(Math.min(...vals) >= 0.3 - 1e-9 && Math.max(...vals) <= 1 + 1e-9);
  assert.ok(Math.max(...vals) - Math.min(...vals) > 0.6, 'the cycle has range');
  assert.ok(Math.abs(pantOpen(0.13, 5) - pantOpen(0.13 + 1 / PANT_HZ, 5)) < 1e-9, 'periodic at PANT_HZ');
  assert.notEqual(pantOpen(0.1, 5), pantOpen(0.1, 6));
  const f = activityFace(N, {t: 0.2, seed: 5, pose: 'P38', preset: 'neutral'});
  assert.equal(f.mouth, 'gape');
  assert.equal(f.brow, N.brow);
  assert.equal(f.eyes, N.eyes);
});

test('clench, talk and surprise mouths', () => {
  assert.equal(activityFace(N, {...ctx, pose: 'P26', preset: 'neutral'}).mouth, 'clench');
  const talk = activityFace(EXPRESSIONS.talk, {t: 0.3, seed: 9, preset: 'talk'});
  assert.equal(talk.mouth, 'talk');
  assert.equal(talk.open, syllableOpen(0.3, 9));
  const wh = activityFace(EXPRESSIONS.whisper, {t: 0.3, seed: 9, preset: 'whisper'});
  assert.ok((wh.open ?? 0) <= 0.5 * 1.0001 + 0.0001, 'a whisper cycles smaller');
  assert.equal(surpriseOpen(-0.1), 0);
  assert.equal(surpriseOpen(0.2), 1);
  assert.ok(Math.abs(surpriseOpen(2) - 0.55) < 1e-9);
  const before = activityFace(N, {t: 0.9, seed: 1, preset: 'neutral', activity: 'surprise', activityAt: 1});
  assert.deepEqual(before, N);
  assert.equal(activityFace(N, {t: 1.2, seed: 1, preset: 'neutral', activity: 'surprise', activityAt: 1}).mouth, 'gape');
});

test('paintFigureAt: activity off paints what the kit painted before (resting mouth kept)', () => {
  assert.equal(OFF_FROM_FIGURE_AT, ACTIVITY_MOUTHS_OFF);
  const asBefore = placed({pose: 'P38', face: 'neutral', t: 0.4, faceState: {mouth: 'flat'}});
  assert.equal(placed({...ACTIVITY_MOUTHS_OFF, pose: 'P38', face: 'neutral', t: 0.4}), asBefore);
  assert.notEqual(placed({pose: 'P38', face: 'neutral', t: 0.4}), asBefore, 'the default pants');
  assert.equal(placed({pose: 'P01', face: 'neutral', t: 0.4}), placed({...ACTIVITY_MOUTHS_OFF, pose: 'P01', face: 'neutral', t: 0.4}), 'P01 is untouched');
  assert.equal(placed({pose: 'P38', face: 'happy', t: 0.4}), placed({...ACTIVITY_MOUTHS_OFF, pose: 'P38', face: 'happy', t: 0.4}), 'a smile on a run stays');
});

test('layerMotion: a run motion pants, the talk motion keeps driving its own mouth, false turns it off', () => {
  const run = layerMotion({person: 'man-parted', motion: 'run-left-to-right', t: 0.3, g: [540, 1500], unit: 500});
  assert.equal(run.pose.face.mouth, 'gape');
  assert.equal(layerMotion({person: 'man-parted', motion: 'run-left-to-right', t: 0.3, g: [540, 1500], unit: 500, activity: false}).pose.face.mouth, 'flat');
  const talk = layerMotion({person: 'man-parted', motion: 'talk', t: 0.3, g: [540, 1500], unit: 500});
  assert.equal(talk.pose.face.mouth, 'talk');
  assert.equal(talk.pose.face.open, talk.frame.talk);
  const own: FaceState = {...N, mouth: 'flat'};
  assert.equal(layerMotion({person: 'man-parted', motion: 'run-left-to-right', t: 0.3, g: [540, 1500], unit: 500, expression: own}).pose.face.mouth, 'flat', 'a scene FaceState is kept');
});

test('gape and clench paint finite marks in front, turned and profile heads', () => {
  for (const face of [{...N, mouth: 'gape', open: 0.6}, {...N, mouth: 'clench'}] as FaceState[]) {
    const r = recorder(), p = makePainter(r.brush, {t: 0, frame: 0}), head = PEOPLE['man-parted'].head;
    paintHeadFront(p, 1, 540, 400, 120, face, head, 0.4);
    paintHeadFront(p, 2, 540, 800, 120, face, head, 0.4, 0, undefined, 0.7);
    paintHeadSide(p, 3, 540, 1200, 120, face, head, 1, 0.4);
    const all = r.log.join('\n');
    assert.ok(all.length > 0);
    assert.ok(!/NaN|null/.test(all), `${face.mouth}: finite`);
  }
});
