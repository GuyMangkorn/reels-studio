import {test} from 'node:test';
import assert from 'node:assert/strict';
import {paintedShots} from '../src/painted/registry';
import {KSO_SHOT_INDEX, kuchisakeShots, maskHook, maskReveal, walkZ} from '../src/painted/shots/kuchisake';
import {knowingMouth, lampOn} from '../src/painted/kuchisake/shot-art';
import {tearAt} from '../src/painted/kuchisake/shot-woman';
import {maskOutline} from '../src/painted/kuchisake/face';
import {CU_HEAD_Y, CU_UNIT} from '../src/painted/kuchisake/space';
import {H} from '../src/painted/kit/cast';
import {HEAD_SPAN} from '../src/painted/kit/head';
import {toScreen, type Camera} from '../src/painted/kit/camera';
import type {Pt} from '../src/painted/kit/painter';

const FPS = 30;

test('the KSO shot index is one contiguous timeline of 26 shots over 2461 frames', () => {
  assert.equal(KSO_SHOT_INDEX.length, 26);
  assert.equal(KSO_SHOT_INDEX[0].start, 0);
  KSO_SHOT_INDEX.forEach((row, i) => {
    assert.ok(row.end > row.start, `${row.id} has a positive length`);
    if (i > 0) assert.equal(row.start, KSO_SHOT_INDEX[i - 1].end, `${row.id} starts where the previous shot ends`);
  });
  assert.equal(KSO_SHOT_INDEX.at(-1)?.end, 2461);
});

test('every indexed shot is a registered plate that serves its deliverable shot ID', () => {
  for (const row of KSO_SHOT_INDEX) {
    const plate = paintedShots[row.plate];
    assert.ok(plate, `${row.plate} is in the painted registry`);
    assert.deepEqual(plate.serves, [row.serves]);
  }
  assert.equal(kuchisakeShots.length, KSO_SHOT_INDEX.length);
});

test('every plate camera is finite over its shot and starts at identity, so a cut lands on the look frame', () => {
  for (const row of KSO_SHOT_INDEX) {
    const plate = paintedShots[row.plate];
    const len = (row.end - row.start) / FPS;
    for (let k = 0; k <= 20; k++) {
      const c = plate.camera((len * k) / 20);
      for (const v of [c.s, c.fx, c.fy, c.dx, c.dy]) assert.ok(Number.isFinite(v), `${row.id} camera value finite at ${k}/20`);
      assert.ok(c.s >= 0.99 && c.s <= 2.4, `${row.id} scale within the crop range at ${k}/20`);
    }
  }
  // Shots that match an approved look frame (or the loop seam) open at identity; crops open at their authored scale.
  for (const id of ['S01-B01-SH01', 'S01-B02-SH01', 'S02-B02-SH01', 'S02-B03-SH03', 'S03-B01-SH03', 'S03-B02-SH02']) {
    assert.ok(Math.abs(paintedShots[`KSO-${id}`].camera(0).s - 1) < 1e-9, `${id} opens at scale 1.00`);
  }
});

test('the mouth tear runs over 12 frames from the closed line to the full grin, then holds', () => {
  const at = (f: number) => tearAt(f);
  assert.deepEqual(at(0), {corner: 0, open: 0});
  assert.equal(at(12).corner, 1);
  assert.equal(at(12).open, 1);
  assert.equal(at(18).open, 1, 'held after the tear');
  let prev = at(0);
  for (let f = 1; f <= 30; f++) {
    const cur = at(f);
    assert.ok(cur.corner >= prev.corner && cur.open >= prev.open, `monotonic at f${f}`);
    assert.ok(cur.corner >= 0 && cur.corner <= 1 && cur.open >= 0 && cur.open <= 1, `within 0..1 at f${f}`);
    prev = cur;
  }
  assert.ok(at(4).open === 0 && at(6).open > 0 && at(6).open < 1, 'the jaw opens after the corners have started (f4 onward)');
});

test('the mask covers the mouth until the hook ends and is clear at the start of the reveal', () => {
  assert.ok(maskHook(36) < 0.15, 'the mouth is still under the mask at the end of S02-B03-SH02');
  assert.equal(maskHook(0), 0);
  assert.ok(maskReveal(0) >= 0.15, 'the mouth is clear at the first frame of S02-B03-SH03 (f1554)');
  assert.equal(maskReveal(8), 1, 'the mask is out of frame by f8 of the reveal');
});

test('the streetlight flickers in the first frames, then the lamp is on when the woman first appears (f32)', () => {
  assert.equal(lampOn(0), 0);
  assert.equal(lampOn(1), 0);
  assert.equal(lampOn(3), 1);
  assert.equal(lampOn(10), 0);
  assert.equal(lampOn(31), 1);
  assert.equal(lampOn(32), 1);
  assert.equal(lampOn(189), 1, 'stays on for the rest of the shot');
});

test('the narrator walks away from the camera up the street axis and stays above the 480 px lead floor', () => {
  assert.ok(walkZ(0) > walkZ(2.15) && walkZ(2.15) > walkZ(4.3), 'z decreases: away from the camera');
  assert.ok(walkZ(0) <= 3.1, 'starts with the whole figure in frame');
  const lead = (z: number) => 1.7 * (1410 / (4.7 - z));
  assert.ok(lead(walkZ(4.3)) >= 480, `the far end is at least 480 px (${lead(walkZ(4.3)).toFixed(0)})`);
  assert.equal(walkZ(9), walkZ(4.3), 'holds after the walk');
});

test('the lip-sync envelope is a pure function of the timeline frame and stays within the cap', async () => {
  const {talkOpen, KSO_AMP} = await import('../src/painted/kuchisake/shot-motion');
  for (let g = 0; g < 2461; g += 7) {
    const o = talkOpen(g, 0.45);
    assert.ok(o >= 0 && o <= 0.45, `open within 0..0.45 at ${g}`);
    assert.equal(o, talkOpen(g, 0.45));
  }
  assert.ok(Math.max(...Array.from({length: 600}, (_, i) => talkOpen(i, 0.45))) > 0.1, 'speech opens the mouth');
  const saved = KSO_AMP.amp;
  KSO_AMP.amp = [];
  assert.ok(talkOpen(40, 0.45) >= 0, 'the default envelope runs when no amplitude is loaded');
  KSO_AMP.amp = saved;
});

test('the knowing smile starts neutral (a thin closed line) and curls into the half smile', async () => {
  const {smileAt} = await import('../src/painted/kuchisake/shot-art');
  assert.equal(smileAt(0), 0);
  assert.equal(smileAt(102), 1);
  const h = (k: number) => Math.max(...knowingMouth(k).map(([, y]) => y)) - Math.min(...knowingMouth(k).map(([, y]) => y));
  assert.ok(h(0) < 0.04, 'neutral mouth is a thin line');
  assert.ok(h(1) > 0.12 && h(1) < 0.2, 'the full smile is curved, the lips only a little parted (round 3: no wide open mouth)');
  const [l0, r0] = [knowingMouth(0)[0], knowingMouth(0)[4]];
  assert.ok(Math.abs(l0[1] - r0[1]) < 0.02, 'the corners are level at k 0');
});

test('the close-up that ends the episode returns to scale 1.00 before the last 15 frames', () => {
  const cam = paintedShots['KSO-S03-B02-SH02'].camera;
  assert.ok(cam(25 / FPS).s > 1.03, 'pushes to about 1.04');
  assert.ok(Math.abs(cam(51 / FPS).s - 1) < 1e-9, 'eased back to 1.00 by f51');
  assert.ok(Math.abs(cam(72 / FPS).s - 1) < 1e-9, 'holds 1.00 to the last frame');
});

/** Ray-casting point-in-polygon in head units. */
const inside = (poly: Pt[], [x, y]: Pt): boolean => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

test('the coworker smile is symmetric (round 3: a normal smile, no sneer), and the shape covers the kit flat mouth line', () => {
  const pts = knowingMouth();
  const [left, right] = [pts[0], pts[4]];
  assert.ok(Math.abs(left[1] - right[1]) < 1e-9 && Math.abs(left[0] + right[0]) < 1e-9, 'the corners are mirrored');
  assert.ok(left[1] < 0.55, 'the corners lift above the mouth line');
  for (const u of [-0.2, 0, 0.2]) assert.ok(inside(pts, [u, 0.6]), `the kit flat mouth line at u ${u} is covered, so no line shows through`);
});

test('the S02-B02-SH03 close-up keeps the mask edge above the caption band (y 860) through its push', () => {
  const plate = paintedShots['KSO-S02-B02-SH03'];
  const K = (H / HEAD_SPAN) * CU_UNIT;
  const lowest = Math.max(...maskOutline(0).map(([, v]) => v));
  const len = (1433 - 1346) / FPS;
  for (let k = 0; k <= 20; k++) {
    const [, y] = toScreen(plate.camera((len * k) / 20), [540, CU_HEAD_Y + lowest * K]);
    assert.ok(y < 860, `the mask lower edge is above the caption band at ${k}/20 (y ${y.toFixed(0)})`);
  }
});

test('the S02-B02-SH03 close-up matches its neighbours: head size within 5% of the S02-B02-SH02 close and within 8% of the S02-B02-SH05 open', () => {
  const headPx = (cam: Camera) => H * CU_UNIT * cam.s;
  const lastSh02 = paintedShots['KSO-S02-B02-SH02'].camera(46 / FPS);
  const firstSh03 = paintedShots['KSO-S02-B02-SH03'].camera(0);
  const lastSh03 = paintedShots['KSO-S02-B02-SH03'].camera(87 / FPS);
  const firstSh05 = paintedShots['KSO-S02-B02-SH05'].camera(0);
  assert.ok(Math.abs(headPx(firstSh03) / headPx(lastSh02) - 1) < 0.05, 'the cut from the narrator close-up lands within 5% in head size');
  assert.ok(Math.abs(headPx(lastSh03) / headPx(firstSh05) - 1) < 0.08, 'the cut into the narrator reaction lands within 8% in head size');
});
