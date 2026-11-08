import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {drawFigure, type FigPose} from '../src/painted/kit/cast';
import {EVA, ZG_NEUTRAL, evaSuit, paintEva, type Helmet} from '../src/painted/kit/eva';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {camOf, camMove} from '../src/painted/kit/cam-moves';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import {WARDROBE, dress} from '../src/painted/kit/wardrobe';
import {camPoint, camUnit} from '../src/painted/kit/ycam';

// EVA suit and helmet (kit/eva.ts, wardrobe `eva-suit`; kit intake from EDU-EP08 look lock, Boss B2).
const brush = new Proxy({}, {get: () => () => undefined}) as Brush;
const cam = camOf(camMove([0, 1.0, 0], [0, 0], 2.7, 1.3, {pitch: [-8, -8], f: 1000, hy: 700}), 0);
const AT: [number, number, number] = [0, 0.2, 0];
const len = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

test('eva-suit is a wardrobe class: bulk shoulder, long white sleeves, boots, pack; evaSuit() = dress() and tint recolours', () => {
  const w = PEOPLE['woman-bob'], d = dress(w, 'eva-suit');
  assert.equal(d.outfit.shoulder, Math.max(w.outfit.shoulder, 0.34) * 1.22);
  assert.equal(d.outfit.longSleeves, true);
  assert.equal(d.outfit.boots, true);
  assert.ok(d.outfit.gear?.pack);
  assert.deepEqual(d.head, w.head);
  assert.deepEqual(evaSuit(w), d);
  assert.equal(WARDROBE['eva-suit'].shirt, EVA.white);
  assert.equal(evaSuit(PEOPLE['man-parted'], {tint: EVA.silver}).outfit.shirt, EVA.silver);
});

test('paintEva: arm segments on the BONE 0.26 m, head and body untouched by the helmet, every view and helmet draws', () => {
  const def = evaSuit(PEOPLE['woman-bob']);
  const u = camUnit(cam, AT);
  const a = paintEva(makePainter(brush, {t: 0, frame: 0}), cam, def, {at: AT, view: 'front', helmet: 'bubble', t: 0, r: ZG_NEUTRAL('r'), l: ZG_NEUTRAL('l')});
  assert.ok(a);
  // upper arm stays 0.26 m x u (+/-12%: foreshortening only shortens)
  for (const [sh, el] of [[a.rShoulder, a.rUpper], [a.lShoulder, a.lUpper]] as [Pt, Pt][]) {
    const seg = (2 * len(sh, el)) / u; // `rUpper` is the upper-arm midpoint
    assert.ok(seg > 0.2 && seg <= 0.26 * 1.12, `upper arm ${seg.toFixed(3)} m`);
  }
  // head height is the rig's, whatever helmet is worn
  const g = camPoint(cam, AT)!;
  const bare = drawFigure(makePainter(brush, {t: 0, frame: 0}), def, g, u, {view: 'front', face: EXPRESSIONS.neutral, noShadow: true, crouch: 0.22} as FigPose, 0, def.seed);
  assert.ok(Math.abs((a.chin - a.headTop) - (bare.chin - bare.headTop)) < 0.5);
  for (const view of ['front', 'left', 'right', 'back'] as const)
    for (const helmet of ['bubble', 'off', 'visor', 'round1966'] as Helmet[]) {
      const r = paintEva(makePainter(brush, {t: 0, frame: 0}), cam, def, {at: AT, view, helmet, t: 0, stripes: true});
      assert.ok(r && r.bubble.r > 0, `${view} ${helmet}`);
    }
  assert.ok(paintEva(makePainter(brush, {t: 0, frame: 0}), cam, def, {at: AT, view: 'front', quarter: 'left', helmet: 'bubble', t: 0}));
});
