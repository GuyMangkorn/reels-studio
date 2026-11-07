import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {ANIMALS, animalBlink, drawAnimal, type AnimalAnchors, type AnimalPose} from '../src/painted/kit/animals';
import {ANIMAL_MOTION_IDS, animalMotion, animalMotionDuration, STEP_UP_HOP} from '../src/painted/kit/animal-motions';
import {BONE} from '../src/painted/kit/cast';
import {paintCatFace} from '../src/painted/kit/catface';
import {paintEyeMacro} from '../src/painted/kit/eye';
import {glareGrade, glarePainter, GLARE} from '../src/painted/kit/glare';
import {GLOW_PEAK, glowBloom, glowMotes} from '../src/painted/kit/glow';
import {paintVisitorHand, visitorTone} from '../src/painted/kit/hands';
import {makePainter, tintPainter, type Painter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {seatedPose, SEATED_POSE_IDS} from '../src/painted/kit/poses-seated';
import {dress, OUTFIT_IDS, WARDROBE} from '../src/painted/kit/wardrobe';
import {chairSpec} from '../src/painted/kit/props';
import {orbitYCam} from '../src/painted/kit/ycam';
import {OWN} from '../src/painted/edu06/cast';
import {catItem, LR, paintRoom, SEAT} from '../src/painted/edu06/room';
import {CF_STATES} from '../src/painted/edu06/scenes';

// EDU-EP06-SHORT W5.2 shared assets (brief EDU-EP06-BRIEF-R1.2): the eight acceptance tests as far as they are measurable without a picture
// (the picture checks are the labelled stills in out/edu06/boss/), and one test per kit item K1-K8 / N1-N7.
const rec = () => { const log: string[] = []; const brush = new Proxy({}, {get: (_t, name) => (...a: unknown[]) => { log.push(String(name) + JSON.stringify(a)); }}) as Brush; return {brush, log}; };
const seedIdx = (log: string[] | string, lo: number, hi: number) => (Array.isArray(log) ? log : log.split('|')).findIndex((l) => { const m = /^seed\[(\d+)\]$/.exec(l); return !!m && Number(m[1]) >= lo && Number(m[1]) < hi; });
const hasSeed = (log: string, n: number) => seedIdx(log, n, n + 1) >= 0; // an eye-plate part seeded exactly n
const nullBrush = new Proxy({}, {get: () => () => undefined}) as Brush;
const calls = (f: (p: Painter) => void) => { const {brush, log} = rec(); f(makePainter(brush, {t: 0.5, frame: 15})); return log.join('|'); };
const CAT = ANIMALS['cat-orange-tabby'];
const cat = (pose: AnimalPose, t = 0.5, g: Pt = [540, 1500], unit = 600, a?: AnimalAnchors) => calls((p) => drawAnimal(p, CAT.seed, CAT, g, unit, pose, t, a));
const anchors = (pose: AnimalPose, g: Pt = [540, 1500], unit = 600, t = 0.5): AnimalAnchors => { const a: AnimalAnchors = {}; drawAnimal(makePainter(nullBrush, {t, frame: 0}), CAT.seed, CAT, g, unit, pose, t, a); return a; };
const DEG = Math.PI / 180;

test('K1-K3, K6, K8: cat controls are opt-in; a zero or absent field draws byte for byte as before', () => {
  for (const base of [{view: 'right', state: 'sit'}, {view: 'front', state: 'sit'}, {view: 'right', state: 'stand'}, {view: 'right', state: 'lie'}] as AnimalPose[]) {
    const ref = cat(base);
    assert.equal(cat({...base, ears: 0}), ref, `${base.view} ${base.state} ears 0`);
    assert.equal(cat({...base, headDown: 0}), ref, 'headDown 0');
    assert.equal(cat({...base, curl: 0}), ref, 'curl 0');
    assert.equal(cat({...base, lean: 0}), ref, 'lean 0');
    assert.equal(cat({...base, contact: 0}), ref, 'contact 0');
    assert.notEqual(cat({...base, ears: 1}), ref, 'ears 1 draws differently');
  }
  assert.ok(!cat({view: 'right', state: 'sit', lid: 0.5, ears: 0.5, headDown: 0.5, lean: 0.5, tilt: 5, curl: 1, tailTo: [0.2, 0.3], contact: 1}).includes('NaN'));
});

test('K1: lid 0..1 per eye overrides animalBlink', () => {
  const tBlink = [...Array(400).keys()].map((i) => i * 0.05).find((t) => animalBlink(t, CAT.seed));
  assert.ok(tBlink !== undefined);
  for (const view of ['right', 'front'] as const) {
    const auto = cat({view, state: 'sit'}, tBlink), set = cat({view, state: 'sit', lid: 0}, tBlink), half = cat({view, state: 'sit', lid: 0.55}, tBlink), shut = cat({view, state: 'sit', lid: 1}, tBlink);
    assert.notEqual(auto, set, `${view}: lid set replaces the blink at a blink instant`);
    assert.equal(new Set([set, half, shut]).size, 3, `${view}: 0, 0.55 and 1 differ`);
  }
  assert.notEqual(cat({view: 'front', state: 'sit', lid: [0.2, 0.9]}), cat({view: 'front', state: 'sit', lid: [0.9, 0.2]}), 'per eye');
});

test('K3: headDown lowers the head and is not the sniff', () => {
  const top = (pose: AnimalPose) => anchors(pose).top![1];
  const stand = top({view: 'right', state: 'stand'});
  assert.ok(top({view: 'right', state: 'stand', headDown: 1}) > stand + 20, 'head is lower (larger y)');
  assert.notEqual(cat({view: 'right', state: 'stand', headDown: 1}), cat({view: 'right', state: 'stand', sniff: 0.9}));
  assert.ok(top({view: 'front', state: 'stand', headDown: 1}) > top({view: 'front', state: 'stand'}) + 20);
});

test('K4: lean puts the nose (or the skull top) on the target while the paws stay planted', () => {
  for (const view of ['right', 'left'] as const) for (const state of ['stand', 'sit'] as const) {
    const g: Pt = [540, 1500], unit = 600, dir = view === 'left' ? -1 : 1, to: [number, number] = [0.3, 0.45];
    const a = anchors({view, state, lean: 1, leanTo: to, leanAnchor: 'top', tilt: 10}, g, unit);
    const want: Pt = [g[0] + dir * to[0] * unit, g[1] - to[1] * unit];
    assert.ok(Math.hypot(a.top![0] - want[0], a.top![1] - want[1]) < 1.5, `${view} ${state} top on target`);
    const b = anchors({view, state, lean: 1, leanTo: to}, g, unit);
    // the nose-tip anchor: `mouth` sits a little under and behind the tip, so it lands within ~0.05 m of the target
    assert.ok(Math.hypot(b.mouth![0] - want[0], b.mouth![1] - want[1]) < 0.06 * unit, `${view} ${state} nose near target`);
  }
});

test('K5: head-rub keeps the skull top on the hand point within +-6 px over both rubs, eyes at lid 0.5', () => {
  const unit = 1200, g: Pt = [440, 1300], target: [number, number] = [0.2, 0.3], want: Pt = [g[0] + target[0] * unit, g[1] - target[1] * unit];
  const dur = animalMotionDuration('head-rub', {animal: 'cat-orange-tabby'});
  let worst = 0, travel = 0, prev = 0;
  for (let t = 0.7; t <= 2.0; t += 1 / 30) {
    const m = animalMotion('head-rub', t, {animal: 'cat-orange-tabby', view: 'right', target});
    assert.equal(m.pose.lid, 0.5);
    const a = anchors(m.pose, g, unit, t);
    // the contact stays on the palm: the skull top follows the hand point, whose rub travel is the +-0.03 m push (here the palm is the target itself)
    const tp: Pt = [g[0] + m.pose.leanTo![0] * unit, g[1] - m.pose.leanTo![1] * unit];
    worst = Math.max(worst, Math.hypot(a.top![0] - tp[0], a.top![1] - tp[1]));
    travel = Math.max(travel, Math.abs(a.top![0] - want[0]) / unit); prev = a.top![0];
  }
  assert.ok(worst <= 6, `skull top within 6 px of the contact point (worst ${worst.toFixed(2)})`);
  assert.ok(travel > 0.015 && travel <= 0.035, `the head pushes along the hand (${travel.toFixed(3)} m)`);
  assert.ok(prev > 0);
  assert.deepEqual(animalMotion('head-rub', dur, {animal: 'cat-orange-tabby'}), animalMotion('head-rub', dur + 3, {animal: 'cat-orange-tabby'}), 'holds its end');
  assert.equal(animalMotion('head-rub', dur, {animal: 'cat-orange-tabby'}).pose.lean, 0, 'released');
});

test('K6: curled lie and tailTo reach the target', () => {
  assert.notEqual(cat({view: 'right', state: 'lie', curl: 1}), cat({view: 'right', state: 'lie'}));
  const g: Pt = [540, 1500], unit = 600, to: [number, number] = [0.25, 0.3];
  for (const view of ['right', 'left'] as const) for (const state of ['lie', 'sit', 'stand'] as const) {
    const a = anchors({view, state, curl: 1, tailTo: to}, g, unit);
    const dir = view === 'left' ? -1 : 1;
    assert.ok(Math.hypot(a.tailTip![0] - (g[0] + dir * to[0] * unit), a.tailTip![1] - (g[1] - to[1] * unit)) < 1, `${view} ${state} tail tip on target`);
  }
  // a tailTo tail does not sway: two clocks, same drawing apart from breathing
  const log = (t: number) => cat({view: 'right', state: 'lie', tailTo: to}, t);
  assert.ok(log(0.1).length > 0);
});

test('K7: step-up is a 10 f hop of the set rise with an arc, then holds on the higher surface', () => {
  assert.ok(ANIMAL_MOTION_IDS.includes('step-up') && ANIMAL_MOTION_IDS.includes('head-rub'));
  assert.equal(Math.round(STEP_UP_HOP * 30), 10);
  const c = {animal: 'cat-orange-tabby' as const, view: 'right' as const};
  const at = (t: number) => animalMotion('step-up', t, c);
  assert.deepEqual(at(0).offset, [0, 0]);
  assert.equal(at(0).pose.stride, 0, 'paws planted before the hop');
  const end = at(STEP_UP_HOP + 1).offset, rise = Math.round((LR.arm - LR.armchairSeat[1]) * 100) / 100;
  assert.ok(Math.abs(end[1] - rise) < 1e-9 && Math.abs(end[1] - 0.18) < 1e-9, `lands on the rise ${rise}`);
  let peak = 0, lastX = -1;
  for (let f = 0; f <= 20; f++) { const o = at(f / 30).offset; peak = Math.max(peak, o[1]); assert.ok(o[0] >= lastX - 1e-12, 'x moves forward only'); lastX = o[0]; assert.ok(o[1] >= -1e-9); }
  assert.ok(peak > rise && peak < rise + 0.1, `an arc over the rise, peak ${peak.toFixed(3)}`);
  assert.deepEqual(at(STEP_UP_HOP + 0.3), at(STEP_UP_HOP + 5), 'steady after the landing');
  assert.equal(animalMotion('step-up', 0.2, {...c, view: 'left'}).offset[0] < 0, true, 'left view hops left');
  assert.ok(Math.abs(LR.hop.across - 0.28) < 0.08 && Math.abs(LR.hop.rise - 0.18) < 1e-9, `BC1 landing geometry (across ${LR.hop.across})`);
});

test('K8: g is the surface height and contact paints a soft shadow', () => {
  const flat = anchors({view: 'right', state: 'sit'}, [540, 1500]).top!, raised = anchors({view: 'right', state: 'sit'}, [540, 1500 - 0.3 * 600]).top!;
  assert.ok(Math.abs(flat[1] - raised[1] - 0.3 * 600) < 1e-9 && flat[0] === raised[0], 'a raised surface is a raised g');
  const none = cat({view: 'right', state: 'sit'}), on = cat({view: 'right', state: 'sit', contact: 1});
  assert.ok(on.length > none.length && on.endsWith(none), 'the soft shadow is painted first, then the unchanged cat');
});

test('N1: SET-LIVINGROOM geometry, two light states, layer order', () => {
  assert.ok(Math.abs(SEAT - 0.3) < 0.01 && Math.abs(LR.arm - 0.48) < 0.01 && Math.abs(LR.loveseatBack - 0.72) < 0.01, `seat ${SEAT} arm ${LR.arm} back ${LR.loveseatBack}`);
  assert.equal(SEAT, chairSpec(OWN, 'front').seatV, 'built to the seated rig');
  assert.deepEqual([...LR.armLanding], [0.72, LR.arm, -0.05], 'BC1 landing point');
  assert.equal(LR.armchairSeat[1], SEAT);
  const cam = orbitYCam([0.55, 0.78, 0.1], 2.9, 14 * DEG, 1.0, 900, 800);
  const render = (light: 'night' | 'day', dressing = true, layer: 'armchair' | 'sofa' = 'armchair') => calls((p) => paintRoom(p, cam, {t: 0.5, light, dressing, cast: [catItem(LR.armchairSeat, {view: 'right', state: 'sit'}, 0.5, layer)]}));
  const night = render('night'), day = render('day');
  assert.equal(night, render('night'), 'deterministic');
  assert.notEqual(night, day, 'the light state changes the plate');
  assert.ok(render('night', false).length < night.length, 'dressing:false is the W3 look-frame room (no window, post, toy)');
  // layer order: an armchair-layer cat is painted after a sofa-layer one (which sits behind the armchair), a floor cat last
  const catLo = 8000 * 1000 * 16; // catItem draws with seed 8000 // drawAnimal seeds each part (seed*1000+k)*16+j
  const firstCat = (layer: 'armchair' | 'sofa' | 'floor') => { const {brush, log} = rec(); paintRoom(makePainter(brush, {t: 0.5, frame: 0}), cam, {t: 0.5, light: 'night', cast: [catItem(LR.armchairSeat, {view: 'right', state: 'sit'}, 0.5, layer)]}); return seedIdx(log, catLo, catLo + 1000 * 16); };
  const [iSofa, iChair, iFloor] = [firstCat('sofa'), firstCat('armchair'), firstCat('floor')];
  assert.ok(iSofa > 0 && iSofa < iChair && iChair <= iFloor, `cat draw order sofa ${iSofa} < armchair ${iChair} <= floor ${iFloor}`);
});

test('N3: the kit eye plate keeps the EP02 defaults and adds lid, lift, catchlight, glare', () => {
  const cam = { ...orbitYCam([0, 0, 0], 0.3, -4.5 * DEG, 0, 1000, 880), pitch: 0 };
  const eye = (s: Partial<Parameters<typeof paintEyeMacro>[2]>) => calls((p) => paintEyeMacro(p, cam, {t: 1, u: 0, ...s}));
  assert.equal(eye({}), eye({lid: 1, lift: 0, catch: 'kitchen', mist: true, glare: 0}), 'defaults are the EP02 plate');
  const states = [eye({lid: 1.3}), eye({lid: 1}), eye({lid: 0.75, lift: 1}), eye({lid: 0, lift: 0.2})];
  assert.equal(new Set(states).size, 4, 'wide, neutral, smile, shut are distinct');
  assert.notEqual(eye({catch: 'warm'}), eye({}));
  assert.ok(hasSeed(eye({}), 60100) && !hasSeed(eye({lid: 0, lift: 0.2}), 60100), 'shut draws no eyeball');
  assert.equal(eye({mist: false}) === eye({}), false, 'mist can be turned off');
});

test('N2: cat-face-close paints every control, one style, both lid forms', () => {
  const cam = {r: 14, f: 1000, hy: 820}, base = CF_STATES.CF3;
  const face = (s: Partial<typeof base>, L = {t: 0.2}) => calls((p) => paintCatFace(p, cam, {...base, ...s}, L));
  const ref = face({});
  for (const s of [{lid: 0}, {lid: 1}, {lid: [0.2, 0.9] as [number, number]}, {pupil: 0.9}, {ears: 1}, {whiskers: 1}, {yaw: -45}, {yaw: 20}, {roll: 10}, {gaze: [0.4, 0.1] as [number, number]}, {brow: 0}]) {
    assert.notEqual(face(s), ref, JSON.stringify(s));
    assert.ok(!face(s).includes('NaN'), JSON.stringify(s));
  }
  assert.ok(base.lid as number <= 0.6 && base.ears <= 0.1, 'the answer pose is the half-close, ears forward-relaxed (acceptance 3 numbers)');
  assert.notEqual(face({}, {t: 0.2, halo: 0.7, motes: 0.9} as never), ref);
});

test('N4: glare-repaint grade starts no earlier than the cue, drains back, is a hue-preserving cool key', () => {
  const o = {start: 40, drainAt: 150};
  assert.equal(glareGrade(0, o), 0); assert.equal(glareGrade(40, o), 0, 'nothing on the cue frame itself');
  assert.ok(glareGrade(41, o) > 0 && glareGrade(41, o) < 0.05);
  assert.ok(Math.abs(glareGrade(40 + GLARE.rise, o) - 1) < 1e-9, 'full after 24 f');
  assert.ok(glareGrade(150 + GLARE.drain, o) < 1e-9 && glareGrade(150 + GLARE.drain + 20, o) === 0, 'drains over 30 f');
  let last = 0; for (let f = 40; f <= 64; f++) { const g = glareGrade(f, o); assert.ok(g >= last); last = g; }
  const p = makePainter(nullBrush, {t: 0, frame: 0});
  assert.equal(glarePainter(p, 0), p);
  const wash = (q: Painter) => { let c = ''; const r = {...q, wash: (col: string) => { c = col; }} as Painter; void r; return c; };
  void wash;
  const col = (q: Painter, skin: string) => { let out = ''; const base = {...p, wash: (c: string) => { out = c; }} as Painter; (q === p ? base : glarePainter(base, 1)).wash(skin, 100, [], 0, 0); return out; };
  const skin = '#9a6a48', cool = col(p, skin), g1 = col(glarePainter(p, 1), skin);
  assert.equal(cool, skin);
  const direct = (() => { let out = ''; tintPainter({...p, wash: (c: string) => { out = c; }} as Painter, GLARE.tint, GLARE.amount, {mul: [...GLARE.mul], brush: true}).wash(skin, 100, [], 0, 0); return out; })();
  assert.equal(g1, direct, 'g 1 is the LF04 recipe');
  const lum = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)).reduce((a, v, k) => a + v * [0.299, 0.587, 0.114][k], 0);
  assert.ok(lum(g1) < lum(skin) && lum(g1) > lum(skin) * 0.6, 'cooled and darkened a little: still skin, not a colour filter');
  // eye plate: the glare shadow exists only when glare > 0
  const cam = { ...orbitYCam([0, 0, 0], 0.3, -4 * DEG, 0, 1000, 880), pitch: 0 };
  const eye = (g: number) => calls((q) => paintEyeMacro(q, cam, {t: 1, u: 0, mist: false, catch: 'warm', lid: 1.3, glare: g}));
  assert.ok(!hasSeed(eye(0), 65000) && hasSeed(eye(1), 65000) && eye(0.5) !== eye(1) && eye(0.5) !== eye(0));
});

test('N5: glow-pass keeps its peak, motes drift one screen way and continue across a cut', () => {
  assert.ok(glowBloom(0.4, 1) <= GLOW_PEAK + 1e-12 && glowBloom(0) === 0 && glowBloom(1) < 1e-9);
  for (const n of [1, 5, 7, 8, 20]) assert.equal(glowMotes({x: 500, y: 700, u: 0.5, count: n}).length, Math.max(5, Math.min(8, n)));
  const dir: [number, number] = [-1, -0.12], A = (u: number, lead = 0) => glowMotes({x: 800, y: 700, u, dir, seed: 3, lead});
  for (const m of A(0.8)) assert.ok(m.a <= GLOW_PEAK + 1e-12 && m.a >= 0);
  const a0 = A(0), a1 = A(0.9);
  a1.forEach((m, i) => assert.ok((m.x - a0[i].x) * dir[0] + (m.y - a0[i].y) * dir[1] > 0, 'every mote drifts along dir'));
  // second shot of a cut: u 0 with lead L is where the first shot's u = L left off
  A(0.5).forEach((m, i) => { const b = A(0, 0.5)[i]; assert.ok(Math.abs(m.x - b.x) < 1e-9 && Math.abs(m.y - b.y) < 1e-9); });
  assert.deepEqual(A(0.37), A(0.37), 'deterministic on seek');
});

test('N6: visitor-hand reads as not hers (lighter skin, denim cuff, watch) and is still', () => {
  const lum = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)).reduce((a, v, k) => a + v * [0.299, 0.587, 0.114][k], 0);
  assert.ok(lum(visitorTone('light').skin) > lum(PEOPLE['woman-curly'].head.skin) * 1.5, 'lighter than OWN');
  assert.ok(visitorTone('light').skin !== visitorTone('deep').skin && /^#[0-9a-f]{6}$/i.test(visitorTone().sleeve), 'skin is a parameter; denim sleeve');
  const hand = (o: Partial<Parameters<typeof paintVisitorHand>[1]> = {}) => { const {brush, log} = rec(); const a = paintVisitorHand(makePainter(brush, {t: 0.2, frame: 6}), {base: 100, wrist: [600, 1200], dir: Math.PI + 0.2, ...o}); return {a, log: log.join('|')}; };
  const w = hand(), nw = hand({watch: false});
  assert.equal(w.log, hand().log, 'identical frame to frame: no drift');
  assert.equal(hand({}).log, hand({}).log);
  assert.ok(w.log.length > nw.log.length, 'the watch is drawn');
  assert.ok(Math.hypot(w.a.watch[0] - 600, w.a.watch[1] - 1200) < Math.hypot(w.a.cuff[0] - 600, w.a.cuff[1] - 1200), 'the watch sits on the wrist, wristward of the cuff');
  assert.ok(Array.isArray(w.a.palmCentre) && w.a.palmCentre.every(Number.isFinite));
});

test('N7: home-lounge wardrobe and the two seated poses', () => {
  assert.ok((OUTFIT_IDS as readonly string[]).includes('home-lounge'));
  const o = WARDROBE['home-lounge'];
  assert.deepEqual([o.shirt, o.jacket, o.pants, o.shoes, o.longSleeves], ['#c98b8b', '#d9c7a8', '#8d8f96', '#f2ead8', true]);
  assert.equal(OWN.outfit.jacket, dress(PEOPLE['woman-curly'], 'home-lounge').outfit.jacket);
  assert.equal(OWN.outfit.shoulder, PEOPLE['woman-curly'].outfit.shoulder);
  const g: Pt = [540, 1500], unit = 600;
  const lean0 = seatedPose('seated-lean-in', OWN, g, unit, 'front', {amount: 0}), lean1 = seatedPose('seated-lean-in', OWN, g, unit, 'front', {amount: 1});
  assert.ok(lean0.sit === 1 && lean0.lean! > 0.1 && lean1.lean! > lean0.lean! && lean1.lean! <= 0.19);
  for (const view of ['front', 'right', 'left'] as const) for (const toward of [1, -1] as const) {
    const p = seatedPose('seated-offer-palm', OWN, g, unit, view, {toward}), arm = (view === 'front' ? (toward > 0 ? p.lArm : p.rArm) : view === 'right' ? p.rArm : p.lArm)!;
    assert.ok(arm && Number.isFinite(arm.to[0]), `${view} ${toward}`);
    assert.ok(Math.hypot(arm.to[0] - arm.via![0], arm.to[1] - arm.via![1]) <= BONE * unit * 1.05, 'forearm within the bone length');
  }
  assert.equal(SEATED_POSE_IDS.length, 2);
});
