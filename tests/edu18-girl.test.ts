import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {CANOE, PADDLE, canoeAnchors, gunwaleY, halfBeam, paddleGrips, paintCanoeBack, paintCanoeFront, paintPaddle, seatGround} from '../src/painted/kit/canoe';
import {BONE, drawFigure, shoulderPoint, type FigPose} from '../src/painted/kit/cast';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {TRAVEL, TRAVEL_OUTFIT_IDS, WARDROBE_TRAVEL, WARDROBE_TRAVEL_INFO, dressTravel, paintBackpack, paintTravelGear} from '../src/painted/kit/wardrobe-travel';
import {camPoint, type YCam} from '../src/painted/kit/ycam';
import {GIRL, GIRL_BASE, GIRL_POSE_IDS, GIRL_POSES, girlPose, girlPoseViews, paddleSitArms, sitHipV} from '../src/painted/edu18/girl';
import {POST_CAPTION, POST_CAPTION_LINES, POST_HANDLE, SHARE_STEPS_B02, SHARE_STEPS_B06, shareAt, shareLabel} from '../src/painted/edu18/Post';

// EDU-EP18-SHORT pre-W3 comp card pass B (brief N2, N4, N5, N6, VD02, VD05, VD12): the girl's outfits and poses, the canoe and paddle,
// the post. Pictures are in the comp cards (src/painted/edu18/cards.tsx); this test pins geometry, ranges and the truth limits.
const brush = new Proxy({}, {get: () => () => undefined}) as Brush;
const p = () => makePainter(brush, {t: 0.4, frame: 0});

test('the girl is kit woman-long unchanged (head, height, seed); only the outfit changes', () => {
  assert.equal(GIRL_BASE, PEOPLE['woman-long']);
  for (const id of TRAVEL_OUTFIT_IDS) {
    const d = GIRL[id];
    assert.equal(d.head, GIRL_BASE.head, `${id} head`);
    assert.equal(d.height, 1.64);
    assert.equal(d.seed, 820);
    assert.equal(d.outfit.shoulder, GIRL_BASE.outfit.shoulder, `${id} keeps her build`);
    assert.ok(WARDROBE_TRAVEL_INFO[id].description.length > 40);
  }
  // Brief colour key (GIRL row).
  assert.equal(WARDROBE_TRAVEL['travel-safari'].jacket, '#c9b48a');
  assert.equal(WARDROBE_TRAVEL['travel-safari'].shirt, '#f2efe6');
  assert.equal(WARDROBE_TRAVEL['travel-safari'].pants, '#6a6a44');
  assert.equal(WARDROBE_TRAVEL['life-vest'].shirt, '#e8662f');
  assert.equal(WARDROBE_TRAVEL['home-lounge-night'].shirt, '#c9c3d9');
  assert.equal(WARDROBE_TRAVEL['home-lounge-night'].pants, '#4a5a7a');
  assert.equal(TRAVEL.pack, '#5a6068');
  // Bare ankles take the wearer's skin.
  assert.equal(dressTravel(PEOPLE['woman-curly'], 'travel-safari').outfit.shorts?.sock, PEOPLE['woman-curly'].head.skin);
});

test('every outfit draws in front, three-quarter, both profiles and back with its painted gear, anchors finite', () => {
  const g: Pt = [540, 1500], unit = 330;
  for (const id of TRAVEL_OUTFIT_IDS) {
    for (const pose of [{view: 'front'}, {view: 'front', quarter: 'left'}, {view: 'left'}, {view: 'right'}, {view: 'back'}] as Omit<FigPose, 'face'>[]) {
      const fig: FigPose = {...pose, face: EXPRESSIONS.neutral}, q = p();
      if (id === 'travel-backpack') paintBackpack(q, GIRL[id], g, unit, fig, 'behind');
      const a = drawFigure(q, GIRL[id], g, unit, fig, 0.4);
      if (id === 'travel-backpack') paintBackpack(q, GIRL[id], g, unit, fig, 'over');
      paintTravelGear(q, id, GIRL[id], a, fig, unit);
      for (const v of [...a.head, ...a.rHand, ...a.lHand, a.headTop]) assert.ok(Number.isFinite(v), `${id} ${pose.view}`);
      // Drawn height 1.64 m on the 4-head rig (head 0.425 m): 3.86 heads.
      assert.ok(Math.abs((g[1] - a.headTop) / unit - 1.64) < 0.05, `${id} ${pose.view} height`);
    }
  }
});

test('the six N6 poses exist with the views the shots need; no upper arm is longer than the bone', () => {
  assert.deepEqual([...GIRL_POSE_IDS], ['paddle-sit', 'selfie-peace', 'swat-neck', 'frozen-hand', 'step-freeze', 'sit-up-phone']);
  assert.deepEqual(girlPoseViews('paddle-sit'), ['front', 'left', 'right']);
  const g: Pt = [540, 1500], unit = 300;
  for (const id of GIRL_POSE_IDS) {
    const spec = GIRL_POSES[id];
    assert.ok(EXPRESSIONS[spec.face], `${id} face`);
    for (const view of girlPoseViews(id)) {
      const pose = girlPose(id, GIRL['travel-safari'], g, unit, view);
      const vs = view === 'front' ? spec.front! : spec.side!;
      for (const [side, t] of [['r', vs.r], ['l', vs.l]] as const) {
        if (!t) continue;
        assert.ok(Math.hypot(t.via[0], t.via[1]) <= BONE + 0.002, `${id} ${view} ${side} upper arm`);
        const arm = side === 'r' ? pose.rArm! : pose.lArm!, sh = shoulderPoint(GIRL['travel-safari'], g, unit, {view, ...vs.body}, side);
        assert.ok(Math.hypot(arm.via[0] - sh[0], arm.via[1] - sh[1]) <= (BONE + 0.002) * unit, `${id} ${view} ${side} px upper arm`);
      }
      const a = drawFigure(p(), GIRL['travel-safari'], g, unit, {...pose, face: EXPRESSIONS[spec.face]}, 0.4);
      assert.ok(Number.isFinite(a.headTop) && a.headTop < g[1], `${id} ${view} draws`);
    }
  }
});

test('canoe: brief dimensions, cut at the waterline, paddler hips above the water, hands reach the paddle grips', () => {
  assert.equal(CANOE.length, 5.5);
  assert.equal(CANOE.beam, 0.65);
  assert.equal(gunwaleY(0), 0.25);
  assert.ok(Math.abs(halfBeam(0) - 0.325) < 1e-9 && halfBeam(1) === 0);
  assert.equal(PADDLE.length, 1.4);
  assert.ok(CANOE.seat > 0 && CANOE.seat < CANOE.gunwale, 'seat block above the water, below the gunwale');
  const def = GIRL['life-vest'];
  for (const [heading, cam, view] of [
    [135, {x: 0.9, y: 0.8, z: 5.0, yaw: 0, f: 1500, hy: 330, cx: 660}, 'front'],
    [90, {x: 0, y: 0.9, z: 4.2, yaw: 0, f: 1250, hy: 1010, cx: 660}, 'right'],
  ] as [number, YCam, FigPose['view']][]) {
    const o = {at: [0.5, 0, 0] as [number, number, number], heading};
    const an = canoeAnchors(cam, o);
    assert.equal(an.near, 1, `heading ${heading}: the right side faces the camera`);
    assert.ok(Math.abs(an.seat[1] - CANOE.seat) < 1e-9);
    paintCanoeBack(p(), cam, o);
    paintCanoeFront(p(), cam, o);
    const grips = paddleGrips(o, an.near, 0.3);
    assert.ok(grips.top[1] > CANOE.gunwale && grips.lower[1] > CANOE.gunwale, 'both grips above the gunwale');
    paintPaddle(p(), cam, grips, {waterY: 0, widthDir: an.fwd});
    const sg = seatGround(cam, an.seat, sitHipV(def, view))!;
    const top = camPoint(cam, grips.top)!, lower = camPoint(cam, grips.lower)!;
    const arms = paddleSitArms(def, sg.g, sg.unit, view, {top, lower}, an.near);
    const body = girlPose('paddle-sit', def, sg.g, sg.unit, view);
    for (const s of ['r', 'l'] as const) {
      const sh = shoulderPoint(def, sg.g, sg.unit, {view, sit: 1}, s), hand = (s === 'r' ? arms.rArm : arms.lArm)!.to;
      assert.ok(Math.hypot(hand[0] - sh[0], hand[1] - sh[1]) <= 2 * BONE * sg.unit, `heading ${heading} ${s} hand reaches its grip`);
    }
    // The whole stroke (catch, mid, exit) stays inside the reach, both views.
    for (const ph of [0, 0.25, 0.5, 0.75]) {
      const gr = paddleGrips(o, an.near, ph);
      for (const pt of [gr.top, gr.lower]) for (const s of ['r', 'l'] as const) {
        const sh = shoulderPoint(def, sg.g, sg.unit, {view, sit: 1}, s), q = camPoint(cam, pt)!;
        assert.ok(Math.hypot(q[0] - sh[0], q[1] - sh[1]) <= 0.95 * 2 * BONE * sg.unit, `heading ${heading} phase ${ph} ${s} reach`);
      }
    }
    const a = drawFigure(p(), def, sg.g, sg.unit, {...body, ...arms, face: EXPRESSIONS.neutral}, 0.4);
    assert.ok(Number.isFinite(a.headTop));
    // The hips sit on the seat block, above the water line the hull is cut at.
    assert.ok(sg.g[1] - sitHipV(def, view) * sg.unit <= (camPoint(cam, [an.seat[0], 0, an.seat[2]])![1]) + 0.5, 'hips above the waterline');
  }
});

test('post: caption verbatim, the 500 and the share counter are the only numbers, the counter only rises', () => {
  assert.equal(POST_CAPTION, 'รอดจากสัตว์ที่ฆ่าคนเยอะที่สุดในโลก! 500 คน/ปี');
  assert.equal(POST_CAPTION_LINES.join(' '), POST_CAPTION);
  assert.deepEqual(POST_CAPTION.match(/\d+/g), ['500']);
  assert.doesNotMatch(POST_HANDLE, /\d/);
  assert.equal(shareLabel(1200), '1.2K');
  assert.equal(shareLabel(58000), '58K');
  assert.equal(shareLabel(0), '0');
  assert.equal(shareLabel(SHARE_STEPS_B02.at(-1)!), '1.2K');
  assert.equal(shareLabel(SHARE_STEPS_B06[0]), '58K');
  for (const steps of [SHARE_STEPS_B02, SHARE_STEPS_B06]) {
    let last = -1;
    for (let t = 0; t <= 2; t += 0.05) { const v = shareAt(steps, t, 2); assert.ok(v >= last); last = v; }
  }
});
