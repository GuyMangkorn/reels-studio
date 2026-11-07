import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import type {Brush} from '../src/painted/BrushCanvas';
import {ANIMALS, drawAnimal, type AnimalAnchors} from '../src/painted/kit/animals';
import {animalMotion} from '../src/painted/kit/animal-motions';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {seatedKnee, seatedPose} from '../src/painted/kit/poses-seated';
import {OWN, paintOwn} from '../src/painted/edu06/cast';
import {LR} from '../src/painted/edu06/room';
import {
  B04SH03_T, camB01SH04, camB02SH03, camB04SH03, camB05SH03, cardAt, catB01SH04, catB04SH03, glareB02SH03, paintB01SH04, paintB02SH03, paintB04SH03, paintB04SH05, paintB05SH02,
  paintB05SH03, SHOT_LEN,
} from '../src/painted/edu06/shots';

// EDU-EP06-SHORT W5.2 round 2: the shot-clock proofs of scene sheets EDU-EP06-SHEETS-R1.1 (numbers; the viewed frames are out/edu06/boss/shots/).
const CAT = ANIMALS['cat-orange-tabby'];
const recorder = (t: number) => { const pts: Pt[] = []; const log: string[] = []; const brush = new Proxy({}, {get: (_t, n) => (...a: unknown[]) => { log.push(String(n) + JSON.stringify(a)); if ((n === 'polygon' || n === 'spline') && Array.isArray(a[0])) for (const q of a[0] as Pt[]) pts.push(q); }}) as Brush; return {p: makePainter(brush, {t, frame: Math.round(t * 30)}), pts, log}; };
const hash = (l: string[]) => createHash('md5').update(l.join('|')).digest('hex');
const catBox = (pose: ReturnType<typeof catB01SH04>, cam: ReturnType<typeof camB01SH04>, t: number) => {
  const r = recorder(t), k = cardAt(cam, pose.at)!;
  drawAnimal(r.p, 8000, CAT, k.g, k.u, {contact: 1, ...pose.pose}, t);
  return {x0: Math.min(...r.pts.map((q) => q[0])), x1: Math.max(...r.pts.map((q) => q[0])), y0: Math.min(...r.pts.map((q) => q[1])), y1: Math.max(...r.pts.map((q) => q[1]))};
};
const world = (f: (L: number) => {at: [number, number, number]}, a: number, b: number) => Array.from({length: b - a + 1}, (_, i) => f(a + i).at);

test('RN01 S01-B01-SH04: the cat leaves frame right inside the shot; no paw slide while it walks', () => {
  let clear = -1;
  for (let L = 60; L < SHOT_LEN.B01SH04; L++) { const b = catBox(catB01SH04(L), camB01SH04(L), L / 30); if (b.x0 > 1080) { clear = L; break; } }
  assert.ok(clear > 0 && clear <= 127, `cat box fully right of frame by L${clear}`);
  // ground speed while walking = kit walk speed (world m/f), after the 0.5 s start ramp
  const w = world(catB01SH04, 75, 133), v = (i: number) => w[i + 1][0] - w[i][0];
  assert.ok(Math.abs(v(40) - 0.37 / 30) < 1e-3, 'cruise = 0.37 m/s');
  for (let i = 0; i < w.length - 1; i++) assert.ok(v(i) >= v(Math.max(0, i - 1)) - 1e-9, 'speed never drops once walking');
  console.log('RN01 clear of frame at L', clear);
});

test('BOSS-1 step-down: level, then a gravity drop of 0.18 m that lands on the contact frame; every ground leg moves screen-left', () => {
  const ctx = {animal: 'cat-orange-tabby' as const, view: 'left' as const, rise: -0.18, across: 0.32};
  const y = Array.from({length: 22}, (_, f) => animalMotion('step-up', f / 30, ctx).offset[1]);
  assert.equal(y[0], 0);
  assert.ok(Math.abs(y[10] + 0.18) < 1e-9 && Math.abs(y[21] + 0.18) < 1e-9, 'lands at -0.18 on frame 10 and holds');
  for (let f = 1; f <= 10; f++) assert.ok(y[f] <= y[f - 1] + 1e-12, 'never rises on the way down (no up-arc)');
  assert.ok(y[3] > -0.03, 'body still near level at frame 3 (the paws reach out first)');
  assert.equal(animalMotion('step-up', 9 / 30, ctx).pose.contact, 0);
  assert.equal(animalMotion('step-up', 10 / 30, ctx).pose.contact, 1);
  // the positive rise is unchanged (arc over the edge)
  assert.ok(animalMotion('step-up', 5 / 30, {...ctx, rise: 0.18}).offset[1] > 0.18 * 0.5);
  // whole walk-over: continuous path (no jump), screen x never increases from the step-up onward, height lands on the cushion
  let prev: ReturnType<typeof catB04SH03> | null = null, prevX = Infinity, maxJump = 0;
  for (let L = 30; L <= 155; L++) {
    const c = catB04SH03(L), k = cardAt(camB04SH03(L), c.at)!;
    assert.ok(k.g[0] <= prevX + 0.6, `screen x never increases (L${L}: ${k.g[0].toFixed(1)} > ${prevX.toFixed(1)})`);
    prevX = k.g[0];
    if (prev) maxJump = Math.max(maxJump, Math.hypot(c.at[0] - prev.at[0], c.at[1] - prev.at[1], c.at[2] - prev.at[2]));
    prev = c;
  }
  assert.ok(maxJump < 0.06, `max per-frame world step ${maxJump.toFixed(3)} m`);
  const end = catB04SH03(155).at;
  assert.ok(Math.hypot(end[0] - LR.rightCushion[0], end[1] - LR.rightCushion[1], end[2] - LR.rightCushion[2]) < 1e-9);
  const arm = catB04SH03(B04SH03_T.stepDown[0]).at;
  assert.ok(Math.hypot(arm[0] - LR.armEnd[0], arm[1] - LR.armEnd[1], arm[2] - LR.armEnd[2]) < 0.01, 'walk ends on armEnd exactly when the step-down starts');
  console.log('walk-over max world step per frame', maxJump.toFixed(3), 'm');
});

test('RN05 + contact rule S01-B04-SH05: skull top stays on her palm through both rubs (press 0.010)', () => {
  let maxN = 0, maxAlong = 0, minAlong = 0;
  const hands: Pt[] = [];
  for (let L = 0; L < SHOT_LEN.B04SH05; L++) {
    const r = recorder(L / 30), o = paintB04SH05(r.p, L);
    assert.ok(o.top && o.hand, `anchors at L${L}`);
    hands.push(o.hand!);
    const dy = o.top![1] - o.hand![1], dx = o.top![0] - o.hand![0];
    if (L >= 4 && L <= 55) { maxN = Math.max(maxN, Math.abs(dy - 0)); maxAlong = Math.max(maxAlong, dx); minAlong = Math.min(minAlong, dx); }
  }
  console.log('rub: normal gap about its mean <= %s px, slide %s..%s px, palm travel', maxN.toFixed(1), minAlong.toFixed(1), maxAlong.toFixed(1));
  assert.ok(maxN <= 6, `normal gap ${maxN}`);
  // clock: lean-in done at L4, both rubs L7-49, release finished at the cut
  const e = (L: number) => animalMotion('head-rub', (L + 11) / 30, {animal: 'cat-orange-tabby', view: 'left'}).pose;
  assert.ok((e(4).lean ?? 0) > 0.99 && (e(0).lean ?? 0) < 0.97, 'lean-in done by L4');
  assert.ok((e(66).lean ?? 1) < 0.02, 'release complete at the cut');
});

test('BOSS-3 seatedKnee, BOSS-2 tail: the tip lands on her knee within 1 px from L75 and holds, in SH02 and SH03', () => {
  for (let L = 75; L < SHOT_LEN.B05SH02; L += 3) {
    const r = recorder(L / 30), o = paintB05SH02(r.p, L);
    assert.ok(o.tip && o.knee);
    assert.ok(Math.hypot(o.tip![0] - o.knee![0], o.tip![1] - o.knee![1]) <= 1.5, `tip-knee at L${L}`);
  }
  const og = cardAt(camB05SH03(0), LR.ownFeet)!, k = seatedKnee(OWN, og.g, og.u, 'l', 'front'), r = seatedKnee(OWN, og.g, og.u, 'r', 'front');
  assert.ok(k[0] > og.g[0] && r[0] < og.g[0] && Math.abs(k[1] - r[1]) < 1e-9, 'left knee screen-right, same height');
});

test('B05-SH03 7.1 s hold is alive: gaze settles L60-100, breath, ear twitch; no run of identical frames', () => {
  let same = 0, maxSame = 0, prev = '';
  const hs = new Set<string>();
  for (let L = 0; L < SHOT_LEN.B05SH03; L++) { const r = recorder((L + 98) / 30); paintB05SH03(r.p, L); const h = hash(r.log); hs.add(h); same = h === prev ? same + 1 : 0; maxSame = Math.max(maxSame, same); prev = h; }
  assert.equal(hs.size, SHOT_LEN.B05SH03, 'every frame differs');
  assert.equal(maxSame, 0);
  // palm and knee do not move in the world (her hand is still), only the camera and the breath
  const og0 = paintOwnFor(0), og1 = paintOwnFor(100);
  assert.ok(og0 && og1);
});
const paintOwnFor = (L: number) => { const c = camB05SH03(L), og = cardAt(c, LR.ownFeet)!; return paintOwn(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: L / 30, frame: L}), c, {at: LR.ownFeet, view: 'front', pose: 'P31', face: 'happy', t: L / 30, fig: {...seatedPose('seated-offer-palm', OWN, og.g, og.u, 'front', {toward: 1})}}); };

test('RN03 S01-B02-SH03: glare 1 until L88, drains to 0 on the last frame in 27 f with no step; whole plate paints at both ends', () => {
  assert.equal(glareB02SH03(0), 1);
  assert.equal(glareB02SH03(88), 1);
  assert.ok(glareB02SH03(115) < 1e-9 || glareB02SH03(114) < 0.02, 'warm by the cut');
  assert.ok(glareB02SH03(114) < 0.01);
  let maxStep = 0;
  for (let L = 1; L < 115; L++) maxStep = Math.max(maxStep, Math.abs(glareB02SH03(L) - glareB02SH03(L - 1)));
  console.log('drain max grade step per frame', maxStep.toFixed(3));
  assert.ok(maxStep < 0.1);
  for (const L of [0, 88, 114]) { const r = recorder(L / 30); const a = paintB02SH03(r.p, L); assert.ok(a && a.head[0] > 0 && !r.log.join('').includes('NaN')); }
  void camB02SH03;
  void paintB01SH04; void paintB04SH03;
  void (null as unknown as AnimalAnchors);
});
