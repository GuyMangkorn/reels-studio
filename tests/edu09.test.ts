import {test} from 'node:test';
import {camPoint} from '../src/painted/kit/ycam';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {macroSkeleton, paintHandMacro} from '../src/painted/kit/hands';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {JUG} from '../src/painted/edu09/dining';
import {boyHand, POV, povCam} from '../src/painted/edu09/handclose';
import {BOY_TONE, ELDER_TONE} from '../src/painted/edu09/palette';
import {camD01, D01_LAMP_Y, GRIN, MEASURE, paintQAGrin} from '../src/painted/edu09/scenes';
import {macroHand, macroSkeleton as skel, TP_LIFTS} from '../src/painted/kit/hands';
import {camSH03End, MEASURE as M2, paintQADangle, paintQALifts, paintQAStop} from '../src/painted/edu09/scenes';
import {BOB_AMP, bobAt, dangleHandAt, gentleStopAt, elderLeanAt, ELDER_LEAN, liftB01SH03, liftB02SH01, liftB03SH04, liftB03SH08, reachOwnHandAt, withLifts, BOY_TEST_HAND, DANGLE_UP} from '../src/painted/edu09/tracks';
import {CORD_MIN_PX, TIE_MIN_PX, diagramSH01, diagramSH02, diagramSH03, diagramSH04} from '../src/painted/edu09/tendons';
import {elbowOnTable, seatedHandsOnTable} from '../src/painted/kit/poses-seated';
import {pianistHand, DROP, FINGER_KEY, keysOf, PIANO_TUNE, tuneAt, type PianoFinger} from '../src/painted/edu09/piano';

// EDU-EP09-SHORT W3.1 look frames (brief EDU-EP09-BRIEF-R1.2): numeric checks behind the viewed stills out/edu09/look-frames/v1/.
const recorder = () => { const pts: Pt[] = []; const brush = new Proxy({}, {get: (_t, n) => (...a: unknown[]) => { if ((n === 'polygon' || n === 'spline') && Array.isArray(a[0])) for (const q of a[0] as Pt[]) pts.push(q); }}) as Brush; return {p: makePainter(brush, {t: 0, frame: 0}), pts}; };

test('VD26: macro hand skins equal their rig skins (user, 8 Nov 2026)', () => {
  assert.equal(BOY_TONE.skin, PEOPLE['boy-school'].head.skin);
  assert.equal(ELDER_TONE.skin, PEOPLE['man-elder'].head.skin);
});

test('VD07 CAM-POV R1.2: eye 36-40, r 26-30 at both ends; LF01 flat hand silhouette is at least 560 px wide', () => {
  for (const r of POV.r) assert.ok(r >= 26 && r <= 30, `r ${r}`);
  for (const e of POV.eye) assert.ok(e >= 36 && e <= 40, `eye ${e}`);
  const {p, pts} = recorder();
  paintHandMacro(p, povCam(0), {...boyHand('flat'), plane: undefined});
  const xs = pts.map((q) => q[0]);
  assert.ok(Math.max(...xs) - Math.min(...xs) >= 560, `width ${Math.round(Math.max(...xs) - Math.min(...xs))}`);
});

test('LF04 placeholder: the resting fingertips touch the key tops and the playing tip sits on its dropped key', () => {
  const sk = macroSkeleton(pianistHand('middle'));
  const pad = (f: 'index' | 'middle' | 'ring') => sk.fingers[f].joints[3][1] - sk.fingers[f].radii[3];
  assert.ok(Math.abs(Math.min(pad('index'), pad('ring'))) < 1e-6);
  assert.ok(pad('middle') <= 0 && pad('middle') >= -DROP - 0.5, `middle pad ${pad('middle').toFixed(2)}`);
});

test('W5.2 SD05: multi-finger piano press (dyad, chord): every pressing tip is on its dropped key, resting tips stay up, the wrist does not move', () => {
  const rest = pianistHand(null), tipPad = (h: ReturnType<typeof pianistHand>, f: PianoFinger) => { const sk = macroSkeleton(h); return sk.fingers[f].joints[3][1] - sk.fingers[f].radii[3]; };
  const restPad = Object.fromEntries((['thumb', 'index', 'middle', 'ring', 'little'] as const).map((f) => [f, tipPad(rest, f)]));
  for (const set of [['ring'], ['thumb'], ['little'], ['thumb', 'middle'], ['thumb', 'middle', 'little']] as PianoFinger[][]) {
    const h = pianistHand(set);
    assert.deepEqual(h.wrist, rest.wrist, `wrist moved for ${set}`);
    for (const f of ['thumb', 'index', 'middle', 'ring', 'little'] as const) {
      const drop = restPad[f] - tipPad(h, f);
      if (set.includes(f)) assert.ok(drop >= 0.4 && drop <= DROP + 0.6, `${set}: ${f} dropped ${drop.toFixed(2)} cm`);
      else assert.ok(Math.abs(drop) < 1e-9, `${set}: ${f} moved`);
    }
  }
});

test('W5.2 SD05 tune: onsets match the sheet, a dyad and a closing chord exist, a ring (F) press exists, no five-finger run, keys stay inside C-G', () => {
  assert.deepEqual(PIANO_TUNE.map((n) => n.f), [0, 10, 20, 30, 42, 64, 74, 84, 96, 108]);
  assert.ok(PIANO_TUNE.some((n) => n.press.length === 2) && PIANO_TUNE[PIANO_TUNE.length - 1].press.length === 3);
  assert.ok(PIANO_TUNE.some((n) => n.press.includes('ring')));
  for (const n of PIANO_TUNE) for (const k of keysOf(n.press)) assert.ok(k >= 0 && k <= 4);
  const order = PIANO_TUNE.filter((n) => n.press.length === 1).map((n) => FINGER_KEY[n.press[0]]);
  for (let i = 0; i + 4 < order.length; i++) { const w = order.slice(i, i + 5); assert.notDeepEqual([...w].sort(), [0, 1, 2, 3, 4], 'five-finger run'); }
  assert.deepEqual(tuneAt(0), ['middle']); assert.deepEqual(tuneAt(9), ['middle']); assert.deepEqual(tuneAt(10), ['little']);
  assert.deepEqual(tuneAt(60), ['thumb', 'middle']); assert.deepEqual(tuneAt(62), []); assert.deepEqual(tuneAt(140), ['thumb', 'middle', 'little']); assert.deepEqual(tuneAt(141), []);
});

test('W5.2 D01: ELDER grin FaceState {brow up, eyes dot, mouth grin} paints at the D01 camera and BOY keeps his ring flat', () => {
  assert.deepEqual({brow: GRIN.brow, eyes: GRIN.eyes, mouth: GRIN.mouth}, {brow: 'up', eyes: 'dot', mouth: 'grin'});
  const {p, pts} = recorder();
  paintQAGrin(p);
  assert.ok(pts.length > 500);
  const out = MEASURE.QAGRIN;
  assert.ok(out.elder && out.boy, 'both seated figures painted');
  const [ex, ey] = out.elder!.head ?? [0, 0];
  assert.ok(ex > 540 && ey < 800, `elder head at ${ex},${ey}`);
});

test('W5.2 D01: the raised pendant (lampY) keeps the shade clear of ELDER eyes at the D01 camera', () => {
  const {p} = recorder();
  paintQAGrin(p);
  const head = MEASURE.QAGRIN.elder!.head;
  const lampBottom = camPoint(camD01, [0, D01_LAMP_Y - 0.08 - 0.0, -0.15]);
  assert.ok(lampBottom && lampBottom[1] < head[1] - 40, `lamp rim y ${lampBottom?.[1]} vs ELDER head ${head[1]}`);
});

// ---- W5.2 (second pass): N2 tendons, N4 seated-hands-on-table, N5 reach/stop, N11 dangle, lift tracks, D01 measures.
const tipRise = (a: ReturnType<typeof macroHand>, b: ReturnType<typeof macroHand>, f: 'thumb' | 'index' | 'little' | 'ring') => skel(b).fingers[f].joints[3][1] - skel(a).fingers[f].joints[3][1];
const boyTP = () => macroHand('test-fold-middle', {side: -1, base: 1000, at: [0, 0]});

test('W5.2 lift tracks: peaks equal TP_LIFTS (cm), start and end at 0, ring never moves in the taps', () => {
  assert.equal(liftB01SH03(0).ring, 0); assert.ok(Math.abs(liftB01SH03(30).ring! - TP_LIFTS['ring-hair']) < 1e-9); assert.ok(Math.abs(liftB01SH03(42).ring!) < 1e-9);
  assert.ok(Math.abs(liftB02SH01(21).thumb! - TP_LIFTS.thumb) < 1e-9 && liftB02SH01(26).thumb! < 1e-9);
  assert.ok(Math.abs(liftB02SH01(40).index! - TP_LIFTS.index) < 1e-9 && Math.abs(liftB02SH01(52).little! - TP_LIFTS.little) < 1e-9);
  const hold = liftB02SH01(80); assert.deepEqual([hold.thumb, hold.index, hold.little], [TP_LIFTS.thumb, TP_LIFTS.index, TP_LIFTS.little]); assert.equal(hold.ring, undefined);
  assert.ok(Math.abs(liftB03SH04(101).ring! - TP_LIFTS['ring-diagram']) < 1e-9 && liftB03SH04(91).ring! < 1e-9);
  const h0 = boyTP(), h1 = withLifts(h0, liftB02SH01(40));
  assert.ok(Math.abs(tipRise(h0, h1, 'index') - TP_LIFTS.index) < 0.02, `index rise ${tipRise(h0, h1, 'index')}`);
  assert.ok(Math.abs(tipRise(h0, h1, 'ring')) < 1e-9);
  const fl = macroHand('flat', {side: -1, base: 1000, at: [0, 0]}), l8 = withLifts(fl, liftB03SH08(10));
  assert.ok(Math.abs(tipRise(fl, l8, 'index') - 2) < 0.02 && Math.abs(tipRise(fl, l8, 'little') - 2) < 0.02 && Math.abs(tipRise(fl, l8, 'ring')) < 1e-9);
});

test('W5.2 N11 dangle: pose hangs the fingers (15/25/10), the lift reaches DANGLE_UP, the bob is +-0.012 at 10 f, the fingers lag the wrist', () => {
  const h = macroHand('hand-lifted-dangle', {side: -1, base: 1000, at: [0, 0]});
  assert.deepEqual(h.fingers.middle, {mcp: 15, pip: 25, dip: 10, abd: 0});
  assert.deepEqual(dangleHandAt(7), DANGLE_UP); assert.equal(dangleHandAt(0)[1], 0.72);
  const bobs = Array.from({length: 33}, (_, i) => bobAt(8 + i)); assert.ok(Math.max(...bobs) <= BOB_AMP + 1e-9 && Math.max(...bobs) > BOB_AMP * 0.9 && Math.min(...bobs) < -BOB_AMP * 0.9);
  assert.ok(Math.abs(bobAt(20) - bobAt(30)) < 1e-9);
  const {p} = recorder(); paintQADangle(p, 18);
  const a = M2.QADANGLE.hands!.boyL!; for (const f of ['index', 'middle', 'ring', 'little'] as const) assert.ok(a.fingers[f].gap! > 0.05, `${f} gap ${a.fingers[f].gap}`);
});

test('W5.2 N4: seated-hands-on-table gives arms to the given hands only, elbows on the wood', () => {
  const {p} = recorder(); paintQAStop(p, 0);
  const pose = seatedHandsOnTable(camSH03End, PEOPLE['boy-school'], [540, 1000], 300, {tableY: 0.72, lHand: [-0.2, 0.72, -0.09]});
  const ev = camPoint(camSH03End, elbowOnTable([-0.2, 0.72, -0.09], 1, 0.72))!; assert.equal(pose.view, 'front'); assert.deepEqual(pose.lArm!.via, ev);
  assert.equal(elbowOnTable([-0.2, 0.72, -0.09], 1, 0.72)[1], 0.746);
});

test('W5.2 N5: reach-own-hand starts at (-0.38, -0.28), stops 6+ cm short of BOY test hand; gentle-stop settles palm-down on the wrist at L27 and rests; no fingertip touches the test hand', () => {
  const r0 = reachOwnHandAt(0), r27 = reachOwnHandAt(27), r67 = reachOwnHandAt(67);
  assert.deepEqual([r0.hand[0], r0.hand[2]], [-0.38, -0.28]);
  assert.ok(BOY_TEST_HAND[0] - (r27.hand[0] + 0.065) > 0.02, 'right hand tips stay clear of the left hand');
  assert.deepEqual(r67.hand, reachOwnHandAt(47).hand); assert.equal(r67.hand[1], 0.72);
  const s0 = gentleStopAt(0), s12 = gentleStopAt(12), s27 = gentleStopAt(27), s67 = gentleStopAt(67);
  assert.equal(s0.hand[1], 0.72); assert.deepEqual(s12.hand, s0.hand); assert.ok(s27.hand[1] > 0.72);
  assert.ok(Math.hypot(s27.hand[0] - r27.hand[0], s27.hand[2] - r27.hand[2]) < 0.1, 'ELDER hand over BOY right wrist');
  assert.ok(s67.hand[1] < s27.hand[1] && s67.hand[1] > 0.72);
  const {p} = recorder(); paintQAStop(p, 27);
  const h = M2.QASTOP.hands!;
  for (const f of ['thumb', 'index', 'middle', 'ring', 'little'] as const) {
    const q = h.elderR!.fingers[f].tip.w, left = h.boyL!.fingers.ring.tip.w;
    assert.ok(Math.hypot(q[0] - left[0], q[2] - left[2]) > 0.05, `${f} within 5 cm of the test hand`);
  }
});

test('W5.2 D01 measures: BOY TP ring gap 0, every fingertip band y <= 1160, heads on sheet', () => {
  const {p} = recorder(); paintQAGrin(p);
  const h = MEASURE.QAGRIN.hands!;
  assert.ok(Math.abs(h.boyL!.fingers.ring.gap!) < 0.0005, `ring gap ${h.boyL!.fingers.ring.gap}`);
  for (const a of Object.values(h)) for (const f of Object.values(a!.fingers)) assert.ok(f.tip.p![1] + 14 <= 1160, `tip y ${f.tip.p![1]}`);
  const m = MEASURE.QAGRIN;
  assert.ok(m.boy!.head[0] > 300 && m.boy!.head[0] < 500 && m.elder!.head[0] > 640 && m.elder!.head[0] < 780);
  void paintQALifts;
});

test('W5.2 N2: diagram tracks hit the sheet times; ring has no own cord; widths meet SP2', () => {
  assert.ok(diagramSH01(0).skinAlpha === 1 && Math.abs(diagramSH01(17).skinAlpha - 0.28) < 1e-9);
  assert.equal(diagramSH01(73).state.pulse, undefined); assert.equal(diagramSH01(94).state.pulse, 1); assert.equal(diagramSH01(79).state.cross, 0); assert.ok(diagramSH01(86).state.cross === 1);
  assert.ok(diagramSH02(9).state.ownLit!.index === 1 && diagramSH02(2).state.ownLit!.index === 0 && diagramSH02(25).state.ownLit!.little! > 0.9 && diagramSH02(83).state.cordLit!.ring === 1 && diagramSH02(77).state.cordLit!.ring === 0);
  assert.deepEqual(diagramSH03(137).state.ties, [1, 1]); assert.deepEqual(diagramSH03(83).state.ties, [0, 0]);
  const s4 = diagramSH04(120).state; assert.equal(s4.taut, 'ring'); assert.equal(s4.cordDark!.middle, 1); assert.equal(s4.tiePull, 1); assert.equal(diagramSH04(88).state.taut, undefined);
  assert.ok(Math.abs(diagramSH04(120).ringLiftCm - TP_LIFTS['ring-diagram']) < 1e-9);
  assert.ok(CORD_MIN_PX >= 6 && TIE_MIN_PX >= 20);
  const keys = new Set(Object.keys(diagramSH02(50).state.ownLit ?? {})); assert.deepEqual([...keys].sort(), ['index', 'little']);
});

test('FX04: the ELDER gentle-stop keeps elbow, forearm and hand 2 cm or more outside the milk box (JUG) on every frame (FX08: the hand goes behind the box, trailing elbow, ELDER leans in)', () => {
  const rect = (x: number, z: number) => Math.hypot(Math.max(JUG.x0 - x, 0, x - JUG.x1), Math.max(JUG.z0 - z, 0, z - JUG.z1));
  let worst = 9;
  for (let f = 0; f <= 67; f++) {
    const {hand, elbow} = gentleStopAt(f), L = Math.hypot(hand[0] - elbow[0], hand[2] - elbow[2]), ux = (hand[0] - elbow[0]) / L, uz = (hand[2] - elbow[2]) / L;
    const wrist = [hand[0] - ux * 0.08, hand[2] - uz * 0.08], tip = [hand[0] + ux * 0.1, hand[2] + uz * 0.1];
    for (let k = 0; k <= 40; k++) { const t = k / 40; for (const [a, b] of [[[elbow[0], elbow[2]], wrist], [wrist, tip]]) worst = Math.min(worst, rect(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)); }
  }
  assert.ok(worst >= 0.02, `closest approach ${(worst * 100).toFixed(1)} cm`);
  const e27 = gentleStopAt(27);
  assert.ok(Math.abs(e27.elbow[0] + 0.13) < 0.01 && Math.abs(e27.elbow[2] + 0.45) < 0.01, 'elbow settles behind and left of the wrist');
  // FX08: the forearm (elbow to hand) stays within 0.3 m so the arm cannot read longer than BOY's scaled by 1.25
  for (let f = 0; f <= 67; f++) { const g = gentleStopAt(f); assert.ok(Math.hypot(g.hand[0] - g.elbow[0], g.hand[2] - g.elbow[2]) <= 0.3, `forearm at L${f}`); }
  assert.ok(Math.abs(elderLeanAt(0)[0]) < 1e-9 && elderLeanAt(27)[0] === ELDER_LEAN[0] && elderLeanAt(67)[1] === ELDER_LEAN[1]);
});
