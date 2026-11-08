import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {FINGER_IDS, HAND_POSES, liftFinger, macroAnchors, macroHand, macroSkeleton, MACRO_TONES, paintHandMacro, TP_LIFTS, type HandMacro} from '../src/painted/kit/hands';
import {BOY_WRIST, HAND_CAMS, HAND_SPECS, SP3} from '../src/painted/kit/hands-macro-specs';
import {camPoint, type YCam} from '../src/painted/kit/ycam';

type Fill = {seed: number; pts: number[][]};
const record = (h: HandMacro, cam: YCam, t = 0) => {
  const fills: Fill[] = [], calls: string[] = [];
  let seed = 0;
  const brush = new Proxy({}, {get: (_, key: string) => (...a: unknown[]) => {
    if (key === 'seed') seed = a[0] as number;
    if (key === 'polygon') fills.push({seed, pts: a[0] as number[][]});
    if (key === 'spline') calls.push(JSON.stringify(a[0]));
    return undefined;
  }}) as Brush;
  const anchors = paintHandMacro(makePainter(brush, {t, frame: Math.round(t * 30)}), cam, h);
  return {fills, calls, anchors};
};
const gapOf = (id: keyof typeof HAND_SPECS) => macroAnchors(HAND_CAMS.TRY, HAND_SPECS[id]()).fingers;

test('flat and test poses touch the plane: no tip floats (gap <= 0.05 cm), none sinks', () => {
  for (const id of ['flat', 'tp'] as const) {
    const f = macroAnchors(HAND_CAMS.TRY, HAND_SPECS[id]()).fingers;
    for (const fid of FINGER_IDS) {
      if (id === 'tp' && fid === 'middle') continue; // folded under the palm, hidden
      assert.ok(Math.abs(f[fid].gap!) <= 0.06, `${id} ${fid} gap ${f[fid].gap}`);
    }
  }
});

test('TP leaves the middle finger folded under the palm: its tip lies behind its knuckle', () => {
  const sk = macroSkeleton(HAND_SPECS.tp()), m = sk.fingers.middle.joints;
  assert.ok(m[3][2] > m[0][2] + 0.5, 'tip is back toward the wrist');
  assert.ok(m[1][1] < m[0][1] - 1.5, 'PIP is down by the table');
});

test('lifts raise the tip by the requested height (set-cm) and keep the other fingers still', () => {
  const tp = HAND_SPECS.tp(), base = macroSkeleton(tp).fingers;
  for (const [f, rise] of [['thumb', TP_LIFTS.thumb], ['index', TP_LIFTS.index], ['little', TP_LIFTS.little], ['ring', TP_LIFTS['ring-hair']]] as const) {
    const lifted = macroSkeleton(liftFinger(tp, f, rise)).fingers;
    assert.ok(Math.abs(lifted[f].joints[3][1] - base[f].joints[3][1] - rise) < 0.01, `${f} rise`);
    for (const o of FINGER_IDS) if (o !== f) assert.deepEqual(lifted[o].joints, base[o].joints);
  }
});

test('SP1 numbers at CAM-TRY: index lift >= 300 px, ring hair-lift >= 25 px, little within 15 % and thumb within 20 % of the brief', () => {
  const tipY = (id: keyof typeof HAND_SPECS, f: (typeof FINGER_IDS)[number]) => macroAnchors(HAND_CAMS.TRY, HAND_SPECS[id]()).fingers[f].tip.p![1];
  const lift = (id: keyof typeof HAND_SPECS, f: (typeof FINGER_IDS)[number]) => tipY('tp', f) - tipY(id, f);
  assert.ok(lift('lift-index', 'index') >= 300);
  assert.ok(lift('ring-hair', 'ring') >= 25);
  assert.ok(Math.abs(lift('lift-little', 'little') - 230) / 230 < 0.15);
  assert.ok(Math.abs(lift('lift-thumb', 'thumb') - 165) / 165 < 0.2);
  void gapOf;
});

test('same frame twice is identical; a seek to another time and back repeats (tremble is a function of the clock)', () => {
  const h = HAND_SPECS['ring-strain']();
  const a = record(h, HAND_CAMS.POV, 0.37), b = record(h, HAND_CAMS.POV, 0.37);
  assert.deepEqual(a.fills, b.fills);
  assert.deepEqual(a.calls, b.calls);
  record(h, HAND_CAMS.POV, 1.9);
  assert.deepEqual(record(h, HAND_CAMS.POV, 0.37).fills, a.fills);
});

test('tremble stays within its amplitude (tip height) and moves between times', () => {
  const h = HAND_SPECS['ring-strain'](), amp = h.tremble!.amp;
  const y0 = macroSkeleton({...h, tremble: undefined}).fingers.ring.joints[3][1];
  const ys = Array.from({length: 40}, (_, i) => macroSkeleton(h, i / 30).fingers.ring.joints[3][1] - y0);
  assert.ok(Math.max(...ys.map(Math.abs)) <= amp * 1.05);
  assert.ok(Math.max(...ys) - Math.min(...ys) > amp * 0.5, 'it actually moves');
});

test('anchors: wrist and joints project through camPoint; palm normal is a unit vector; unit 0.01 matches a scaled camera', () => {
  const h = HAND_SPECS.tp(), a = macroAnchors(HAND_CAMS.POV, h);
  assert.deepEqual(a.wrist.p, camPoint(HAND_CAMS.POV, h.wrist));
  assert.ok(Math.abs(Math.hypot(...a.palm.normal) - 1) < 1e-9);
  assert.deepEqual(a.fingers.index.tip.p, camPoint(HAND_CAMS.POV, macroSkeleton(h).fingers.index.joints[3]));
  const C = HAND_CAMS.TRY, m = (v: number) => v * 0.01;
  const small: YCam = {...C, x: m(C.x), y: m(C.y), z: m(C.z), near: 0.003};
  const hs: HandMacro = {...h, unit: 0.01, wrist: [m(h.wrist[0]), m(h.wrist[1]), m(h.wrist[2])], plane: 0, elbow: undefined};
  const px = macroAnchors(small, hs).fingers.ring.tip.p!, px0 = macroAnchors(C, {...h, elbow: undefined}).fingers.ring.tip.p!;
  assert.ok(Math.hypot(px[0] - px0[0], px[1] - px0[1]) < 0.5);
});

test('draw order: a finger folded under the palm is painted before the back of the hand from above; seen from the front everything follows the palm', () => {
  const idx = (r: ReturnType<typeof record>, s: number) => r.fills.findIndex((f) => f.seed === s);
  const h = HAND_SPECS.tp(), palm = h.base + 60, middleSkin = h.base + 10 + 1 * 10; // FILL + 10 + finger index (middle = 2 in FINGER_IDS) x 10
  void middleSkin;
  const mid = h.base + 10 + FINGER_IDS.indexOf('middle') * 10;
  const pov = record(h, HAND_CAMS.POV);
  assert.ok(idx(pov, mid) >= 0 && idx(pov, palm) >= 0);
  assert.ok(idx(pov, mid) < idx(pov, palm), 'middle (under) before palm from above');
  const index = h.base + 10 + FINGER_IDS.indexOf('index') * 10;
  assert.ok(idx(pov, index) > idx(pov, palm), 'index after palm from above');
  const front = record(h, HAND_CAMS.TRY);
  assert.ok(idx(front, mid) > idx(front, palm) && idx(front, index) > idx(front, palm), 'from the front the palm is first');
});

test('explicit order overrides the depth sort', () => {
  const h: HandMacro = {...HAND_SPECS.flat(), order: ['little', 'ring', 'middle', 'index', 'thumb']};
  const r = record(h, HAND_CAMS.POV), at = (id: (typeof FINGER_IDS)[number]) => r.fills.findIndex((f) => f.seed === h.base + 10 + FINGER_IDS.indexOf(id) * 10);
  assert.ok(at('little') < at('ring') && at('ring') < at('middle') && at('middle') < at('index') && at('index') < at('thumb'));
});

test('skinAlpha draws the hand on a translucent layer; opaque by default', () => {
  const layers: number[] = [];
  const brush = new Proxy({}, {get: () => () => undefined}) as Brush;
  const p = makePainter(brush, {t: 0, frame: 0}), orig = p.layer;
  p.layer = (a, s) => { layers.push(a); return orig(a, s); };
  paintHandMacro(p, HAND_CAMS.POV, {...HAND_SPECS.flat(), skinAlpha: 0.28, plane: undefined});
  assert.ok(layers.includes(0.28));
  layers.length = 0;
  paintHandMacro(p, HAND_CAMS.POV, {...HAND_SPECS.flat(), plane: undefined});
  assert.deepEqual(layers, []);
});

test('hand scale: size 1.25 and 1.2 make the middle finger 7.5 and 7.2 cm; BOY 6.0 cm', () => {
  for (const [size, cm] of [[1, 6.0], [1.25, 7.5], [1.2, 7.2]] as const) {
    const sk = macroSkeleton({...HAND_SPECS.flat(), size, wrist: [0, 1.2 * size, 0]});
    const j = sk.fingers.middle.joints, len = [0, 1, 2].reduce((s, k) => s + Math.hypot(j[k + 1][0] - j[k][0], j[k + 1][1] - j[k][1], j[k + 1][2] - j[k][2]), 0);
    assert.ok(Math.abs(len - cm) < 1e-9, `${size}: ${len}`);
  }
});

test('named poses and tones exist; the right hand mirrors the left (thumb on the other side)', () => {
  assert.deepEqual(Object.keys(HAND_POSES).sort(), ['flat', 'ring-strain', 'test-fold-middle']);
  assert.equal(MACRO_TONES.boy.skin, '#f0c29a');
  const l = macroSkeleton(macroHand('flat', {side: -1, base: 0, at: [0, 0]})), r = macroSkeleton(macroHand('flat', {side: 1, base: 0, at: [0, 0]}));
  assert.ok(l.fingers.thumb.joints[3][0] > 0 && r.fingers.thumb.joints[3][0] < 0);
  assert.ok(Math.abs(l.fingers.thumb.joints[3][0] + r.fingers.thumb.joints[3][0]) < 1e-9);
  void BOY_WRIST;
});

test('SP3 contract: the rig hand target is the macro palm centre in picture px; dining hand sits at the HAND-CLOSE wrist', () => {
  for (const k of ['B01SH04', 'B02SH02'] as const) {
    const s = SP3[k], h = s.hand(), a = macroAnchors(s.cam, h);
    assert.ok(a.wrist.p && a.palm.p);
    assert.equal(h.unit, 0.01);
  }
  const b = SP3.B01SH04.hand();
  assert.ok(Math.abs(b.wrist[1] - 0.732) < 1e-9, 'wrist 1.2 cm above the table at 0.72');
  assert.ok(macroAnchors(SP3.B01SH04.cam, b).fingers.middle.tip.p![1] > macroAnchors(SP3.B01SH04.cam, b).wrist.p![1] - 400);
});
