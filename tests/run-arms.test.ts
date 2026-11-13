import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {H, drawFigure, type FigAnchors, type FigPose} from '../src/painted/kit/cast';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {VIEW_CUES_OFF} from '../src/painted/kit/figure-at';
import {makePainter, mixColor, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {poseFor} from '../src/painted/kit/poses';

// KIT-RUN-ARMS (user 13 Nov 2026, sheet src/painted/kit/run-arms-sheet.tsx, clip KIT-RUN-ARMS-CLIP): the front and three-quarter run arm
// pump (elbow low, fist to the chest, the other hand by the hip) and the turned side of an open jacket in its own darker colour.
type Shape = {color: string; alpha: number; pts: Pt[]};
const recorder = () => {
  const shapes: Shape[] = [];
  let color = '', alpha = 255;
  const brush = new Proxy({}, {get: (_, name) => (...args: unknown[]) => {
    if (name === 'fill' || name === 'wash') { color = String(args[0]); alpha = Number(args[1] ?? 255); }
    if (name === 'polygon') shapes.push({color, alpha, pts: args[0] as Pt[]});
  }}) as Brush;
  return {shapes, brush};
};
const g: Pt = [540, 1500], unit = 600;
const centroid = (pts: Pt[]): Pt => [pts.reduce((a, q) => a + q[0], 0) / pts.length, pts.reduce((a, q) => a + q[1], 0) / pts.length];
const run = (who: keyof typeof PEOPLE, phase: number, extra: Partial<FigPose> = {}) => {
  const def = PEOPLE[who], r = recorder();
  const pose = {face: EXPRESSIONS.neutral, ...poseFor('P38', def, g, unit, 'front'), run: phase, ...extra} as FigPose;
  const a = drawFigure(makePainter(r.brush, {t: 0, frame: 0}), def, g, unit, pose, 0);
  return {a, shapes: r.shapes, def};
};
const WHO = ['man-parted', 'woman-curly', 'boy-school'] as const;
const elbow = (a: FigAnchors, s: 'r' | 'l'): Pt => {
  const S = s === 'r' ? a.rShoulder : a.lShoulder, Up = s === 'r' ? a.rUpper : a.lUpper;
  return [2 * Up[0] - S[0], 2 * Up[1] - S[1]];
};

test('front run: the forward arm keeps its elbow low and lifts the fist to the chest; the back hand drops by the hip', () => {
  for (const who of WHO) {
    const {a} = run(who, 0.25); // phase 0.25: the left arm forward, the right arm back
    const scale = PEOPLE[who].armScale ?? 1;
    const fwdE = elbow(a, 'l');
    // elbow below the fist (screen y grows downward), not on the shoulder-fist line as the old punch toward the camera
    assert.ok(fwdE[1] > a.lHand[1] + 0.06 * unit * scale, `${who}: elbow ${fwdE[1]} vs fist ${a.lHand[1]}`);
    // the fist at chest height: below the shoulder, well above the back hand
    assert.ok(a.lHand[1] > a.lShoulder[1] && a.lHand[1] < a.lShoulder[1] + 0.2 * unit * scale, `${who}: fist height ${a.lHand[1] - a.lShoulder[1]}`);
    assert.ok(a.rHand[1] > a.lHand[1] + 0.2 * unit * scale, `${who}: back hand ${a.rHand[1]} below fist ${a.lHand[1]}`);
  }
});

test('front run: both arms pump the same amount (mirror phases) and the old run keeps its punch', () => {
  for (const who of WHO) {
    const q = run(who, 0.25).a, h = run(who, 0.75).a;
    assert.ok(Math.abs((q.lHand[1] - q.lShoulder[1]) - (h.rHand[1] - h.rShoulder[1])) < 0.01 * unit, `${who}: left and right fists at the same height`);
    assert.ok(Math.abs((q.rHand[1] - q.rShoulder[1]) - (h.lHand[1] - h.lShoulder[1])) < 0.01 * unit, `${who}: left and right back hands at the same height`);
    const old = run(who, 0.25, {runPump: false}).a, oldE = elbow(old, 'l');
    assert.ok(oldE[1] < old.lHand[1], `${who}: runPump false keeps the elbow above the fist (the drawing before)`);
  }
});

test('three-quarter run: the forward fist turns toward the facing side and the far hand is hidden behind the hip', () => {
  for (const who of WHO) for (const quarter of ['left', 'right'] as const) {
    const qd = quarter === 'left' ? -1 : 1;
    for (const phase of [0.25, 0.75]) {
      const {a, shapes, def} = run(who, phase, {quarter});
      const fwd = phase === 0.25 ? 'l' : 'r', T = fwd === 'l' ? a.lHand : a.rHand, S = fwd === 'l' ? a.lShoulder : a.rShoulder;
      assert.ok(qd * (T[0] - S[0]) > -0.02 * unit, `${who} ${quarter} ${phase}: fist toward the facing side`);
      const HD = H * (def.headScale ?? 1), chin = def.height - HD, shV = chin - 0.16 * HD, hip0 = shV - (chin - 0.068) * 0.44 + 0.034;
      const hemY = g[1] - (hip0 + 0.0255) * unit, hipX = 0.3 * HD * unit;
      const loose = shapes.filter((s) => s.color === def.head.skin).map((s) => centroid(s.pts)).filter(([x, y]) => y > hemY + 0.01 * unit && y < hemY + 0.2 * unit && Math.abs(x - g[0]) < 0.85 * hipX);
      assert.equal(loose.length, 0, `${who} ${quarter} ${phase}: ${JSON.stringify(loose)}`);
    }
  }
});

test('three-quarter jacket: the turned side is the jacket a shade darker, painted solid', () => {
  for (const quarter of ['left', 'right'] as const) {
    const {shapes, def} = run('man-parted', 0, {quarter, run: undefined});
    const o = def.outfit, jacketSide = mixColor(o.jacket!, '#0a0d12', 0.22);
    assert.ok(shapes.some((s) => s.color === jacketSide), `${quarter}: a jacket-coloured side plane`);
    // the side is the jacket itself a shade darker, painted solid; sideCloth: false is the drawing before: a light glaze over it
    assert.ok(shapes.some((s) => s.color === jacketSide && s.alpha === 255), `${quarter}: the jacket side painted solid`);
    const old = run('man-parted', 0, {quarter, run: undefined, sideCloth: false}).shapes.filter((s) => s.color === jacketSide);
    assert.ok(old.length > 0 && old.every((s) => s.alpha < 255), `${quarter}: sideCloth false keeps the glaze`);
  }
});

test('VIEW_CUES_OFF also turns the KIT-RUN-ARMS fixes off for episodes made before 13 Nov 2026', () => {
  assert.equal(VIEW_CUES_OFF.runPump, false);
  assert.equal(VIEW_CUES_OFF.sideCloth, false);
});
