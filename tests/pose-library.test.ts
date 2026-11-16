// test-scope: shared
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {BONE, drawFigure, type CastDef, type FigPose} from '../src/painted/kit/cast';
import {CHIN, HEAD_SPAN, headOutline} from '../src/painted/kit/head';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {POSE_IDS, POSES, poseArms, shoulderAnchors, type PoseId} from '../src/painted/kit/poses';
import {CAST} from '../src/painted/worldfog/cast';

// Pose sheet P01-P30 (docs/character-proportion-principles.md#cp-p-pose-sheet). Geometry is in metres from the ground point
// (u toward screen right, v up), built the way drawFigure builds the head, neck and arm anchors (standing, no crouch).
const H = 0.425;
const FIGURES = Object.values(CAST) as CastDef[];
const sides = ['r', 'l'] as const;
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];

const neck = (def: CastDef) => {
  const chin = def.height - H, shV = chin - 0.16 * H;
  // cast.ts: the neck half-width is 0.24 H under a coat collar, 0.1 H otherwise; it spans chin + 0.051 down to shV - 0.013.
  return {half: (def.outfit.coat ? 0.24 : 0.1) * H, bottom: shV - 0.013, top: chin + 0.051};
};
/** Head silhouette in metres: headOutline (head units, y down from the centre) scaled by K = H / HEAD_SPAN. */
const head = (def: CastDef): Pt[] => {
  const K = H / HEAD_SPAN, cy = def.height - H + CHIN * K;
  return headOutline().map(([x, y]): Pt => [x * K, cy - y * K]);
};
const inPoly = (p: Pt, poly: Pt[]) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const inNeck = (p: Pt, n: ReturnType<typeof neck>) => Math.abs(p[0]) < n.half && p[1] > n.bottom && p[1] < n.top;

test('pose sheet P01-P30 is complete and every pose names both arms', () => {
  assert.deepEqual([...POSE_IDS], Array.from({length: 30}, (_, i) => `P${String(i + 1).padStart(2, '0')}`));
  for (const id of POSE_IDS) assert.ok(POSES[id].name && POSES[id].r.to && POSES[id].l.to, id);
});

test('elbows stay outside the neck and head, and forearms never cross the neck (CP-P08), for every cast figure', () => {
  for (const def of FIGURES) {
    const S = shoulderAnchors(def), n = neck(def), outline = head(def);
    for (const id of POSE_IDS) {
      for (const side of sides) {
        const elbow = add(S[side], POSES[id][side].via);
        assert.ok(!inNeck(elbow, n) && !inPoly(elbow, outline), `${id} ${side} elbow ${elbow.map((x) => x.toFixed(3))} inside the neck/head`);
        // The forearm from the elbow to the hand's rim (0.05 m short of the hand target) never enters the neck box. The
        // hand itself may touch the chin or face, so a target inside the neck box must sit at chin height or above.
        const hand = add(S[side], POSES[id][side].to), len = Math.hypot(hand[0] - elbow[0], hand[1] - elbow[1]);
        const rim = Math.max(0, 1 - 0.05 / len);
        for (let k = 0; k <= 200; k++) {
          const q: Pt = [elbow[0] + ((hand[0] - elbow[0]) * rim * k) / 200, elbow[1] + ((hand[1] - elbow[1]) * rim * k) / 200];
          assert.ok(!inNeck(q, n), `${id} ${side} forearm crosses the neck at ${q.map((x) => x.toFixed(3))}`);
        }
        assert.ok(!inNeck(hand, n) || hand[1] >= def.height - H - 0.05, `${id} ${side} hand ${hand.map((x) => x.toFixed(3))} sits on the collar below the chin`);
      }
    }
  }
});

test('arms never stretch past one bone each, and CP-P02 poses tuck the elbows behind the torso edge', () => {
  const CP_P02: PoseId[] = ['P10', 'P17', 'P25', 'P26', 'P28'];
  for (const def of FIGURES) {
    const S = shoulderAnchors(def), torso = def.outfit.shoulder * H;
    for (const id of POSE_IDS) {
      for (const side of sides) {
        const arm = POSES[id][side], elbow = add(S[side], arm.via), hand = add(S[side], arm.to);
        const upper = Math.hypot(arm.via[0], arm.via[1]), fore = Math.hypot(hand[0] - elbow[0], hand[1] - elbow[1]);
        // Targets are rounded to the millimetre in poses.ts, so allow 2 mm over one bone.
        assert.ok(upper <= BONE + 0.002 && fore <= BONE + 0.002, `${id} ${side} stretched: upper ${upper.toFixed(3)} forearm ${fore.toFixed(3)}`);
        if (CP_P02.includes(id)) {
          assert.equal(arm.behind, 'upper', `${id} ${side} must use behind 'upper' (CP-P10)`);
          assert.ok(Math.abs(elbow[0]) < torso && Math.abs(elbow[0]) > torso - 0.03, `${id} ${side} elbow ${elbow[0].toFixed(3)} not just inside the torso edge ${torso.toFixed(3)}`);
        }
      }
    }
  }
});

test('drawFigure places each pose arm at the targets it was converted to', () => {
  // A no-op brush: drawFigure only needs the arm anchors it returns, not the marks.
  const brush = new Proxy({}, {get: () => () => undefined}) as Brush;
  const FACE: FigPose['face'] = {brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'smile'};
  const unit = 440, g: Pt = [540, 1000];
  for (const id of POSE_IDS) {
    const pose: FigPose = {view: 'front', face: FACE, ...poseArms(id, CAST.narrator, g, unit)};
    const a = drawFigure(makePainter(brush, {t: 0, frame: 0}), CAST.narrator, g, unit, pose, 0);
    const S = shoulderAnchors(CAST.narrator);
    for (const side of sides) {
      const shoulder = a[side === 'r' ? 'rShoulder' : 'lShoulder'];
      const target = pose[side === 'r' ? 'rArm' : 'lArm']!.to;
      const sPx: Pt = [g[0] + S[side][0] * unit, g[1] - S[side][1] * unit];
      assert.ok(Math.hypot(shoulder[0] - sPx[0], shoulder[1] - sPx[1]) < 1e-6, `${id} ${side} shoulder anchor`);
      // drawArm returns the hand 0.03 unit past the target along the forearm.
      const hand = a[side === 'r' ? 'rHand' : 'lHand'];
      assert.ok(Math.abs(Math.hypot(hand[0] - target[0], hand[1] - target[1]) - 0.03 * unit) < 1e-6, `${id} ${side} hand off target`);
    }
  }
});
