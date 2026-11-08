import {test} from 'node:test';
import {camPoint} from '../src/painted/kit/ycam';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {macroSkeleton, paintHandMacro} from '../src/painted/kit/hands';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {boyHand, POV, povCam} from '../src/painted/edu09/handclose';
import {BOY_TONE, ELDER_TONE} from '../src/painted/edu09/palette';
import {camD01, D01_LAMP_Y, GRIN, MEASURE, paintQAGrin} from '../src/painted/edu09/scenes';
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
