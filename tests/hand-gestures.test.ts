import {test} from 'node:test';
import assert from 'node:assert/strict';
import {macroSkeleton} from '../src/painted/kit/hands';
import {GESTURE_IDS, HAND_GESTURES, gestureHand, gestureViewDir, handCentre, handFacing, mittenThumbSide, viewCam, type HandSide} from '../src/painted/kit/hand-gestures';
import {solveThumb, THUMB_TARGETS} from '../scripts/painted-kit/solve-thumbs';
import {camPoint} from '../src/painted/kit/ycam';

const SIDES: HandSide[] = ['right', 'left'];
const setup = (id: (typeof GESTURE_IDS)[number], side: HandSide, view: 'palm' | 'back', tilt = 0) => {
  const h0 = gestureHand(id, {side, wrist: [0, 0, 0], base: 0, yaw: tilt});
  const c = handCentre(h0), hand = {...h0, wrist: [-c[0], -c[1], -c[2]] as [number, number, number]};
  return {hand, cam: viewCam([0, 0, 0], gestureViewDir(hand, view), 70, 1500, 960)};
};

test('palm and back views see the face they name, for every gesture and both hands', () => {
  for (const id of GESTURE_IDS) for (const side of SIDES) for (const view of ['palm', 'back'] as const) {
    const {hand, cam} = setup(id, side, view);
    assert.equal(handFacing(cam, hand).shows, view, `${id} ${side} ${view}`);
  }
});

test('thumb chirality: the thumb lies on the side mittenThumbSide gives, relative to the finger direction on screen', () => {
  // +1 = clockwise of wrist -> middle knuckle on screen (y down): cross(dir, thumbBase - wrist) > 0
  for (const id of GESTURE_IDS) for (const side of SIDES) for (const view of ['palm', 'back'] as const) for (const tilt of [0, 40, 130]) {
    const {hand, cam} = setup(id, side, view, tilt), sk = macroSkeleton(hand);
    const w = camPoint(cam, hand.wrist)!, m = camPoint(cam, sk.fingers.middle.joints[0])!, t = camPoint(cam, sk.fingers.thumb.joints[0])!, l = camPoint(cam, sk.fingers.little.joints[0])!;
    const dir = [m[0] - w[0], m[1] - w[1]], tl = [t[0] - l[0], t[1] - l[1]];
    const got = Math.sign(dir[0] * tl[1] - dir[1] * tl[0]);
    assert.equal(got, mittenThumbSide(side, view), `${id} ${side} ${view} tilt ${tilt}`);
  }
});

test('fingers up: right palm -> thumb screen right, right back -> left; the left hand mirrors', () => {
  const want = {right: {palm: 'right', back: 'left'}, left: {palm: 'left', back: 'right'}} as const;
  for (const side of SIDES) for (const view of ['palm', 'back'] as const) {
    const {hand, cam} = setup('open-spread', side, view);
    assert.equal(handFacing(cam, hand).thumbOnScreen, want[side][view], `${side} ${view}`);
  }
});

test('contact gestures keep the solved thumb on its contact point (within 2.5 mm: `four` reaches across the palm at the cmc limit)', () => {
  for (const id of Object.keys(THUMB_TARGETS) as (keyof typeof THUMB_TARGETS)[]) {
    const {thumb, miss} = solveThumb(id);
    assert.ok(miss < 0.25, `${id} miss ${miss}`);
    assert.deepEqual(HAND_GESTURES[id].thumb, thumb, `${id}: paste the solver output into HAND_GESTURES`);
  }
});
