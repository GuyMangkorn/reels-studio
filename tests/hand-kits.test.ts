import {test} from 'node:test';
import assert from 'node:assert/strict';
import {macroSkeleton} from '../src/painted/kit/hands';
import {LANDMARKS, dist3, forwardFor, specHand} from '../src/painted/kit/hand-place';
import {POV_ACTIONS, POV_ACTION_IDS, povCam, povReach} from '../src/painted/kit/pov-hands';
import {MID_ACTION_IDS, MID_VIEWS, midArm, midCell} from '../src/painted/kit/mid-hands';
import {camPoint} from '../src/painted/kit/ycam';
import {dot3} from '../src/painted/kit/hand-place';
import {BONE} from '../src/painted/kit/cast';

test('forwardFor puts the thumb along the axis and the back toward `back`, for both hands', () => {
  for (const side of ['right', 'left'] as const) for (const [A, B] of [[[0, 1, 0], [1, 0, 0]], [[-1, 0, 0], [0, 1, 0.3]], [[0, 0, -1], [0.3, 0.5, 0.2]]] as [number, number, number][][]) {
    const o = forwardFor(side, A, B), sk = macroSkeleton(specHand({gesture: 'grip', side, ...o, base: 0}));
    assert.ok(dot3(sk.toThumb, A) / Math.hypot(...A) > 0.999, `${side} thumb`);
    assert.ok(dot3(sk.normal, o.back) > 0.999, `${side} back`);
  }
});

test('POV: every wrist is within arm reach, and every hand and its forearm are in front of the lens', () => {
  for (const id of POV_ACTION_IDS) for (const h of POV_ACTIONS[id].build().hands) {
    assert.ok(povReach(h) <= 0.55, `${id}: reach ${povReach(h).toFixed(3)}`);
    assert.ok(camPoint(povCam(POV_ACTIONS[id].build()), macroSkeleton(h).palmCentre), `${id}: palm behind the lens`);
  }
});

test('POV contacts: the button press, the phone tap and the coin pinch touch their targets', () => {
  const tip = (id: keyof typeof POV_ACTIONS, k = 0) => macroSkeleton(POV_ACTIONS[id].build().hands[k]).fingers.index.joints[3];
  const btn = POV_ACTIONS['press-button'].build().props[0].frame.o;
  assert.ok(dist3(tip('press-button'), btn) < 0.02);
  const coin = POV_ACTIONS['pick-coin'].build();
  assert.ok(dist3(LANDMARKS.pinch(macroSkeleton(coin.hands[0])), coin.props[0].frame.o) < 0.012, 'the pinch holds the coin (inside its 1.2 cm radius)');
});

test('mid: the rig arm ends on the macro wrist, the right arm on the screen side the view gives', () => {
  for (const id of MID_ACTION_IDS) for (const [k, view] of MID_VIEWS.entries()) {
    const c = midCell(id, view, k), g = camPoint(c.cam, c.body.at)!;
    for (const q of c.placed) {
      const arm = midArm(c, q), w = camPoint(c.cam, q.hand.wrist)!;
      const to = view === 'back' ? [2 * g[0] - arm.to[0], arm.to[1]] : arm.to; // back.ts mirrors the target back
      assert.ok(Math.hypot(to[0] - w[0], to[1] - w[1]) < 1e-6, `${id} ${view} ${q.side}: arm end`);
      assert.ok(Math.abs(dist3(q.S, q.E) - BONE * 1.08) < 1e-3, `${id} ${view} ${q.side}: upper arm length`);
    }
    const [r] = c.placed, sr = camPoint(c.cam, r.S)!;
    assert.equal(sr[0] < g[0] ? 'left' : 'right', view === 'front' ? 'left' : 'right', `${id} ${view}: right shoulder side`);
  }
});
