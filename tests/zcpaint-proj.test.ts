import {test} from 'node:test';
import assert from 'node:assert/strict';
import {YOU} from '../src/painted/zcpaint/cast';
import {bustFig} from '../src/painted/zcpaint/bust';
import {COSTUME, H6, type Fig} from '../src/painted/zcpaint/body6';
import {PJ_B06, reachPose} from '../src/painted/zcpaint/fridge';
import {ARM_FORE, ARM_UPPER, ik3, len3, proj3, reachArm, sub3, type V3} from '../src/painted/zcpaint/proj';

// BOSS PASS 14 (PJ-ZCP-07, Film SPK-ZCP-07 variant B, sheet R1.5 MK-ZCP-B5): the projection is the identity on the body plane, the two-bone
// solve keeps both segments at their lengths, the B06-SH02 reach stays inside the arm length at the grasp, the reaching arm is his right
// (screen right in the back view), and it is drawn before the torso in the back view and after it in the front view.

test('PJ-ZCP-07: the projection is the identity on the body plane and moves deeper points toward the axis', () => {
  const q = proj3(PJ_B06, [1.2, 4.0, 0]);
  assert.ok(Math.abs(q[0] - 1.2) < 1e-9 && Math.abs(q[1] - 4.0) < 1e-9, 'z 0 is the identity');
  const far = proj3(PJ_B06, [1.2, 4.0, 2]);
  assert.ok(Math.abs(far[0] - PJ_B06.ax) < Math.abs(1.2 - PJ_B06.ax), 'a deeper point moves toward the axis in x');
});

test('PJ-ZCP-07: the two-bone solve keeps the upper arm and the forearm at their lengths inside the arm length', () => {
  const S: V3 = [0.6, 4.4, 0.35], W: V3 = [1.2, 4.2, 1.9], pole: V3 = [0.75, -0.8, -0.35];
  const E = ik3(S, W, ARM_UPPER, ARM_FORE, pole);
  assert.ok(Math.abs(len3(sub3(E, S)) - ARM_UPPER) < 1e-9, 'upper arm length');
  assert.ok(Math.abs(len3(sub3(W, E)) - ARM_FORE) < 1e-9, 'forearm length');
});

// BOSS PASS 15 (B06-SH02 draw-in, sheet R1.5 exit "box + cup in his right hand at about shoulder height"): after the lift the box is drawn in
// to the chest by pf 32 and held through the door's shut (pf 32-41) to the last frame; the wrist stays inside the arm length the whole time.
test('B06-SH02 draw-in: the wrist stays inside the arm length from pf 6 to 62; the box reaches the chest by pf 32 and holds to pf 62', () => {
  let worst = 0;
  for (let pf = 6; pf <= 62; pf++) {
    const {pose} = reachPose(pf);
    worst = Math.max(worst, len3(sub3(pose.W, pose.S)) / (ARM_UPPER + ARM_FORE));
  }
  assert.ok(worst <= 1, `reach ${worst.toFixed(3)} of the arm length`);
  const at32 = reachPose(32).box, at62 = reachPose(62).box;
  assert.deepEqual(at32.map((v) => +v.toFixed(6)), at62.map((v) => +v.toFixed(6)), 'the box holds from pf 32');
  assert.ok(at62[2] > 0.2 && at62[2] < 0.8, `the box is in front of his chest, nearer than the shut door (z ${at62[2]})`);
  assert.ok(at62[1] > 4.2 && at62[1] < 4.5, `the box sits at shoulder height (y ${at62[1]})`);
});

test('B06-SH02 reach: the wrist stays inside the arm length from pf 6 to 24 (Film 103 % risk, measured 0.98 at the grasp), on his right', () => {
  let worst = 0;
  for (let pf = 6; pf <= 24; pf++) {
    const {pose} = reachPose(pf);
    worst = Math.max(worst, len3(sub3(pose.W, pose.S)) / (ARM_UPPER + ARM_FORE));
  }
  assert.ok(worst <= 1, `reach ${worst.toFixed(3)} of the arm length`);
  assert.ok(reachPose(15).pose.W[0] > 0, 'his right arm reaches to screen right in the back view');
});

test('reach3: the projected arm is drawn before the torso in the back view and after it in the front view', () => {
  const pose = reachPose(15).pose;
  const tee = (f: Fig) => f.parts.findIndex((p) => p.col === COSTUME.tee && !p.tube);
  const arm = (f: Fig) => f.parts.findIndex((p) => p.tube !== undefined && p.col === COSTUME.over && p.tube.c[0][0] > 0.5);
  const back = bustFig(YOU, {view: 'back', proj: PJ_B06, arms: {R: {kind: 'reach3', pose}}});
  const front = bustFig(YOU, {view: 'front', proj: PJ_B06, arms: {R: {kind: 'reach3', pose}}});
  assert.ok(arm(back) >= 0 && arm(back) < tee(back), 'back view: the reaching sleeve comes before the tee');
  assert.ok(arm(front) >= 0 && arm(front) > tee(front), 'front view: the reaching sleeve comes after the tee');
  assert.equal(back.anchors.hands.length, 2, 'both wrists are anchored (the left hangs, the right is projected)');
});

test('reach3 without a projection fails loudly instead of drawing the arm in the wrong place', () => {
  assert.throws(() => bustFig(YOU, {view: 'back', arms: {R: {kind: 'reach3', pose: reachPose(15).pose}}}), /BustOpts.proj/);
});

// BOSS PASS 18 (user, Film SPK-ZCP-07 variant B, pass 17 look check: "มือยังพันคอตัวเอง"): the reaching sleeve starts at the back's outer shoulder,
// not inside the back beside the neck. The back-view torso top edge (`BUST_TEE`, bust.ts; copied here) bounds the projected reach arm between the
// neck (x 0.2) and the outer edge (x 0.62 is inside the shoulder line) at every pf 0-62. Head units, y up (plate y is down, so y = -py / H6).
test('B06-SH02 shoulder cap (pass 18): no reach-arm point between the neck and the shoulder line rises above the back slope, pf 0-62', () => {
  const topAt = (x: number) => (x <= 0.22 ? 4.84 : x <= 0.48 ? 4.84 - ((x - 0.22) / 0.26) * 0.08 : 4.76 - (x - 0.48));
  let worst = -Infinity;
  for (let pf = 0; pf <= 62; pf++) {
    for (const part of reachArm(PJ_B06, reachPose(pf).pose, COSTUME.over, '#c08a66')) {
      for (const [px, py] of part.pts) {
        const x = px / H6, y = -py / H6;
        if (x >= 0.2 && x <= 0.62) worst = Math.max(worst, y - topAt(x));
      }
    }
  }
  assert.ok(worst <= 0, `the highest arm point is ${worst.toFixed(3)} head above the slope (pass 17 was +0.14 at pf 18)`);
});
