import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {BONE, H, drawFigure, type FigPose} from '../src/painted/kit/cast';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {poseFor, type AnyPoseId} from '../src/painted/kit/poses';

// KIT-ARM-DEPTH fixes (13 Nov 2026, sheet src/painted/kit/arm-depth-sheet.tsx): A three-quarter arm at the lens, C P44 elbows past the
// torso, D elbow joint paint order, F the far hanging hand hidden behind the hip in a three-quarter view.
type Shape = {color: string; pts: Pt[]};
const recorder = () => {
  const shapes: Shape[] = [];
  let color = '';
  const brush = new Proxy({}, {get: (_, name) => (...args: unknown[]) => {
    if (name === 'fill' || name === 'wash') color = String(args[0]);
    if (name === 'polygon') shapes.push({color, pts: args[0] as Pt[]});
  }}) as Brush;
  return {shapes, brush};
};
const g: Pt = [540, 1500], unit = 600;
const centroid = (pts: Pt[]): Pt => [pts.reduce((a, q) => a + q[0], 0) / pts.length, pts.reduce((a, q) => a + q[1], 0) / pts.length];
const draw = (who: keyof typeof PEOPLE, id: AnyPoseId, extra: Partial<FigPose> = {}) => {
  const def = PEOPLE[who], r = recorder();
  const a = drawFigure(makePainter(r.brush, {t: 0, frame: 0}), def, g, unit, {view: 'front', face: EXPRESSIONS.neutral, ...poseFor(id, def, g, unit, 'front'), ...extra} as FigPose, 0);
  return {a, shapes: r.shapes, def};
};
const WHO = ['man-crop', 'woman-curly', 'boy-school'] as const;

test('A: a three-quarter arm at the lens reaches toward the facing side instead of folding onto the chest', () => {
  for (const who of WHO) for (const id of ['P13', 'P14', 'P16'] as const) {
    const left = draw(who, id, {quarter: 'left'}).a, right = draw(who, id, {quarter: 'right'}).a, front = draw(who, id).a;
    const reach = 2 * BONE * (PEOPLE[who].armScale ?? 1) * unit;
    // front: still the foreshortened arm (hand near the shoulder)
    assert.ok(Math.hypot(front.rHand[0] - front.rShoulder[0], front.rHand[1] - front.rShoulder[1]) < 0.35 * reach, `${who} ${id} front stays foreshortened`);
    // turned left (facing screen left): the hand goes well left of the shoulder; turned right: well right of it
    assert.ok(left.rHand[0] < left.rShoulder[0] - 0.4 * reach, `${who} ${id} left: ${left.rHand[0] - left.rShoulder[0]}`);
    assert.ok(right.rHand[0] > right.rShoulder[0] + 0.25 * reach, `${who} ${id} right: ${right.rHand[0] - right.rShoulder[0]}`);
  }
});

test('A: the far arm at the lens is painted after (over) the torso in a three-quarter view', () => {
  const {a, shapes, def} = draw('man-crop', 'P13', {quarter: 'left'});
  const shirt = shapes.map((s, i) => (s.color === def.outfit.shirt ? i : -1)).filter((i) => i >= 0);
  const hand = shapes.findIndex((s) => s.color === def.head.skin && Math.hypot(...(centroid(s.pts).map((v, k) => v - a.rHand[k]) as [number, number])) < 0.03 * unit);
  assert.ok(shirt.length > 0 && hand > shirt[0], `hand ${hand} after the torso ${shirt[0]}`); // the first shirt shape is the torso
});

test('F: a three-quarter standing figure shows no hand below the shirt hem inside the hips', () => {
  for (const who of WHO) for (const quarter of ['left', 'right'] as const) for (const extra of [{}, {walk: 0.25}]) {
    const {shapes, def} = draw(who, 'P01', {quarter, ...extra});
    const HD = H * (def.headScale ?? 1), chin = def.height - HD, shV = chin - 0.16 * HD, hip0 = shV - (chin - 0.068) * 0.44 + 0.034;
    const hemY = g[1] - (hip0 + 0.0255) * unit, hipX = 0.3 * HD * unit;
    const loose = shapes.filter((s) => s.color === def.head.skin).map((s) => centroid(s.pts)).filter(([x, y]) => y > hemY + 0.01 * unit && y < hemY + 0.2 * unit && Math.abs(x - g[0]) < 0.85 * hipX) // the hand zone, not bare shins;
    assert.equal(loose.length, 0, `${who} ${quarter} ${JSON.stringify(extra)}: ${JSON.stringify(loose)}`);
  }
});

test('C: P44 hands behind the back puts the elbows just past the torso edge (CP-P04)', () => {
  for (const who of WHO) {
    const def = PEOPLE[who], pose = poseFor('P44', def, g, unit, 'front');
    const sh = (side: 'r' | 'l') => draw(who, 'P44').a[side === 'r' ? 'rShoulder' : 'lShoulder'];
    assert.ok(pose.rArm!.via![0] < sh('r')[0], `${who} right elbow outside the shoulder`);
    assert.ok(pose.lArm!.via![0] > sh('l')[0], `${who} left elbow outside the shoulder`);
  }
});

test('D: a bent elbow paints the forearm first and the sleeve over it (front and back view)', () => {
  for (const view of ['front', 'back'] as const) {
    const {a, shapes, def} = draw('man-crop', 'P09', {view});
    const arm = poseFor('P09', def, g, unit, 'front').rArm!, mx = (q: Pt): Pt => (view === 'back' ? [2 * g[0] - q[0], q[1]] : q);
    const E = mx(arm.via!), T = mx(arm.to), mid = (p: Pt, q: Pt): Pt => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const near = (color: string, at: Pt) => shapes.findIndex((s) => s.color === color && Math.hypot(centroid(s.pts)[0] - at[0], centroid(s.pts)[1] - at[1]) < 0.04 * unit);
    const fore = near(def.head.skin, mid(E, T)), sleeve = near(def.outfit.sleeve, mid(a.rShoulder, E));
    assert.ok(fore >= 0 && sleeve >= 0 && fore < sleeve, `${view}: forearm ${fore} before sleeve ${sleeve}`);
  }
});
