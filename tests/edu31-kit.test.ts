import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter, type Painter, type Pt} from '../src/painted/kit/painter';
import {openHandParts, hardFill, inkLine} from '../src/painted/kit/draw';
import {mittenThumbSide} from '../src/painted/kit/hand-gestures';
import type {YCam} from '../src/painted/kit/ycam';
import {PEOPLE} from '../src/painted/kit/people';
import {OUTFIT_IDS} from '../src/painted/kit/wardrobe';
import {OUTFIT_1995_IDS, WARDROBE_1995, WARDROBE_1995_INFO, dress1995} from '../src/painted/kit/wardrobe-1995';
import * as K from '../src/painted/kit/props-edu31';
import {envMouth, speechOpen} from '../src/painted/kit/lip-sync';
import {WHISPER_CUP, paintWhisperHand, whisperCupArm} from '../src/painted/kit/motions-edu31';
import {PLATES} from '../src/painted/kit/plates';
import * as E from '../src/painted/edu31/props31';
import * as ESet from '../src/painted/edu31/set31';
import * as EReveal from '../src/painted/edu31/reveal31';
import * as EPolice from '../src/painted/edu31/police31';
import * as ESpeech from '../src/painted/edu31/speech31';
import {mouthAt} from '../src/rig/drivers';

// EDU-EP31 kit intake (KIT-P01, W8.4, 21 Nov 2026): the kit copies (wardrobe-1995.ts, props-edu31.ts, lip-sync.ts, motions-edu31.ts) paint and
// return exactly what the delivered episode code does, so a later episode that casts `man-buzz + windbreaker-1995`, `instant-camera-1995-broken`
// or `whisper-cup` gets the approved EP31 picture. The episode files stay unchanged (their pinned scene keys stand).
const recorder = () => {
  const log: string[] = [];
  const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => { log.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush;
  return {brush, log};
};
const paint = (fn: (p: Painter) => void) => {
  const r = recorder();
  fn(makePainter(r.brush, {t: 0.4, frame: 12}));
  return r.log.join('\n');
};
const DEG = Math.PI / 180;
const cams: YCam[] = [
  {x: 0.05, y: 1.2, z: 0.35, yaw: 0, pitch: -20 * DEG, f: 950, hy: 810, cx: 0},
  {x: 2.6, y: 1.3, z: -0.6, yaw: -90 * DEG, pitch: 4 * DEG, f: 1000, hy: 700, cx: 0},
  {x: 0, y: 1.6, z: 0.5, yaw: 0, pitch: -70 * DEG, f: 1300, hy: 900, cx: 0},
];
const same = (label: string, k: (p: Painter) => unknown, e: (p: Painter) => unknown) => {
  const a = paint(e);
  assert.ok(a.length > 50, `${label}: the episode function paints marks`);
  assert.equal(paint(k), a, label);
};

test('1995 outfits: the EP31 WHEELER and POLICE outfits on their kit people', () => {
  for (const id of OUTFIT_1995_IDS) {
    assert.ok(WARDROBE_1995[id] && WARDROBE_1995_INFO[id].description.length > 40, id);
    assert.ok(!(OUTFIT_IDS as readonly string[]).includes(id), `${id} does not shadow WARDROBE`);
  }
  const w = dress1995(PEOPLE['man-buzz'], 'windbreaker-1995');
  assert.deepEqual(w.outfit, ESet.WHEELER.outfit);
  assert.equal(w.head, PEOPLE['man-buzz'].head);
  const po = dress1995(PEOPLE['man-crop'], 'us-police-1995');
  const {shoulder, ...rest} = po.outfit, {shoulder: es, ...erest} = ESet.POLICE.outfit;
  assert.deepEqual(rest, erest);
  assert.ok(Math.abs(shoulder - es) < 0.005, `police shoulder ${shoulder} vs ${es}`);
});

test('props-edu31 carries the episode source verbatim (props31 body, lemons, tip, 8x10 print)', () => {
  const kit = readFileSync('src/painted/kit/props-edu31.ts', 'utf8');
  const props31 = readFileSync('src/painted/edu31/props31.ts', 'utf8');
  assert.ok(kit.includes(props31.slice(props31.indexOf('const DEG = Math.PI / 180;')).trimEnd()), 'props31.ts body');
  const set31 = readFileSync('src/painted/edu31/set31.ts', 'utf8');
  assert.ok(kit.includes(set31.slice(set31.indexOf('/** Whole lemon'), set31.indexOf('// ------------------------------------------------------------------ Space K')).trimEnd()), 'set31 lemons');
  const reveal = readFileSync('src/painted/edu31/reveal31.ts', 'utf8');
  assert.ok(kit.includes(reveal.slice(reveal.indexOf('/** Rotation about the z axis')).trimEnd()), 'reveal31 tip');
});

test('props-edu31 paints the same brush calls as the episode', () => {
  const lit = {broken: true, crack: 1, swing: 0.4, eject: 0.5, spark: 0.7, puff: 0.5, fire: 0.3, scale: 1.3};
  for (const [i, c] of cams.entries()) {
    const f = E.standFrame([0.3, 0.68, -0.2], 20 + i * 40, 5);
    assert.deepEqual(K.standFrame([0.3, 0.68, -0.2], 20 + i * 40, 5), f);
    same(`instant cam intact ${i}`, (p) => K.paintInstantCam(p, c, 37000, f), (p) => E.paintInstantCam(p, c, 37000, f));
    same(`instant cam broken ${i}`, (p) => K.paintInstantCam(p, c, 37000, f, lit), (p) => E.paintInstantCam(p, c, 37000, f, lit));
    let ka: unknown, ea: unknown;
    paint((p) => { ka = K.paintInstantCam(p, c, 1, f, lit); });
    paint((p) => { ea = E.paintInstantCam(p, c, 1, f, lit); });
    assert.deepEqual(ka, ea, `instant cam anchors ${i}`);
    same(`instant print ${i}`, (p) => K.paintInstantPrint(p, c, 37100, f, 0.6), (p) => E.paintInstantPrint(p, c, 37100, f, 0.6));
    same(`ink paper ${i}`, (p) => K.paintInkPaper(p, c, 37200, f, 0.8), (p) => E.paintInkPaper(p, c, 37200, f, 0.8));
    same(`lime half ${i}`, (p) => K.paintLimeHalf(p, c, 37300, f, 0.03, 0.4), (p) => E.paintLimeHalf(p, c, 37300, f, 0.03, 0.4));
    same(`candle ${i}`, (p) => K.paintCandle(p, c, 37600, [0.25, 0.68, 0.1], 1.3), (p) => E.paintCandle(p, c, 37600, [0.25, 0.68, 0.1], 1.3));
    same(`krok ${i}`, (p) => K.paintKrok(p, c, 37700, [0, 0.85, -0.3], 0.5), (p) => E.paintKrok(p, c, 37700, [0, 0.85, -0.3], 0.5));
    same(`lime basket ${i}`, (p) => K.paintLimeBasket(p, c, 37750, [-0.3, 0.85, -0.35]), (p) => E.paintLimeBasket(p, c, 37750, [-0.3, 0.85, -0.35]));
    same(`bag top ${i}`, (p) => K.paintBagTop(p, c, 37800, [0.2, 0.68, -0.3], 0.6), (p) => E.paintBagTop(p, c, 37800, [0.2, 0.68, -0.3], 0.6));
    same(`desk phone ${i}`, (p) => K.paintDeskPhone(p, c, 38500, [0, 0.75, -0.1], {light: 1, lift: [0, 0.002, 0]}), (p) => E.paintDeskPhone(p, c, 38500, [0, 0.75, -0.1], {light: 1, lift: [0, 0.002, 0]}));
    const page: [[number, number, number], [number, number, number], [number, number, number], [number, number, number]] = [[-0.9, 1.78, -1.964], [-0.6, 1.78, -1.964], [-0.6, 1.33, -1.964], [-0.9, 1.33, -1.964]];
    same(`calendar page ${i}`, (p) => K.paintCalendarPage(p, c, 38600, page, 0.3), (p) => E.paintCalendarPage(p, c, 38600, page, 0.3));
    same(`floor flash ${i}`, (p) => K.floorFlash(p, c, 38700, [0.3, 0, -0.3], 0.4, 0.5), (p) => E.floorFlash(p, c, 38700, [0.3, 0, -0.3], 0.4, 0.5));
    same(`lemon ${i}`, (p) => K.paintLemon(p, c, 31000, [0.1, 0.72, -0.2], 0.04), (p) => ESet.paintLemon(p, c, 31000, [0.1, 0.72, -0.2], 0.04));
    same(`lemon half ${i}`, (p) => K.paintLemonHalf(p, c, 31010, [0.1, 0.69, -0.2], 0.055), (p) => ESet.paintLemonHalf(p, c, 31010, [0.1, 0.69, -0.2], 0.055));
    for (const tip of [0, 1.2, Math.PI * 0.9]) {
      same(`lemon tip ${i} ${tip}`, (p) => K.paintLemonTip(p, c, 39000, [0.05, 0.69, 0], 0.055, 0.1, tip), (p) => EReveal.paintLemonTip(p, c, 39000, [0.05, 0.69, 0], 0.055, 0.1, tip));
    }
  }
  same('lemonPx', (p) => K.lemonPx(p, 1, 400, 600, 40, {glint: 0.6}), (p) => ESet.lemonPx(p, 1, 400, 600, 40, {glint: 0.6}));
  same('lemonHalfSide', (p) => K.lemonHalfSide(p, 2, 400, 600, 40, 0.3, 0.2), (p) => E.lemonHalfSide(p, 2, 400, 600, 40, 0.3, 0.2));
  same('printPx', (p) => K.printPx(p, 3, 540, 700, 900, 0.1, 0.5), (p) => E.printPx(p, 3, 540, 700, 900, 0.1, 0.5));
  same('sparkBurst', (p) => K.sparkBurst(p, 4, 500, 500, 40, 0.7), (p) => E.sparkBurst(p, 4, 500, 500, 40, 0.7));
  same('puff', (p) => K.puff(p, 5, 500, 500, 40, 0.7), (p) => E.puff(p, 5, 500, 500, 40, 0.7));
  same('starGlint', (p) => K.starGlint(p, 6, 500, 500, 40, 0.7), (p) => E.starGlint(p, 6, 500, 500, 40, 0.7));
  same('droplets', (p) => K.droplets(p, 7, [300, 300], [500, 600], 0.5, 6), (p) => E.droplets(p, 7, [300, 300], [500, 600], 0.5, 6));
  same('whipSmear', (p) => K.whipSmear(p, 8, ['#6d3c28', '#beb39a'], 0.6), (p) => E.whipSmear(p, 8, ['#6d3c28', '#beb39a'], 0.6));
  const b = {cx: 780, cy: 390, r: 220, grow: 1, trail: [1, 1, 1], trailPts: [[600, 600, 20], [650, 560, 28], [700, 500, 36]] as [number, number, number][], walk: 0.4, camPan: 20, camTilt: 10};
  same('bubble', (p) => K.paintBubble(p, 37500, b), (p) => E.paintBubble(p, 37500, b));
  assert.deepEqual(K.printQuad([0.1, 0.684, 0.25], 12), EPolice.printQuad([0.1, 0.684, 0.25], 12));
  assert.deepEqual(K.armHoles([500, 600], [600, 800], [700, 760], 900), EPolice.armHoles([500, 600], [600, 800], [700, 760], 900));
});

test('lip-sync: speechOpen and envMouth match the episode and the rig', () => {
  for (const env of [ESpeech.ANCHOR_ENV, ESpeech.WHEELER_ENV]) {
    for (let L = -2; L < env.length + 3; L++) {
      assert.equal(envMouth(env, L), mouthAt(env, L), `envMouth L${L}`);
      assert.equal(speechOpen(env, L), ESpeech.speechOpen(env, L), `speechOpen L${L}`);
      assert.equal(speechOpen(env, L, 0.6, 0.2), ESpeech.speechOpen(env, L, 0.6, 0.2));
    }
  }
});

test('whisper-cup: the B02-SH01 arm and open hand', () => {
  const sh: Pt = [400, 900], u = 620;
  const arm = whisperCupArm(sh, u);
  assert.deepEqual(arm.to, [sh[0] + 0.18 * u, sh[1] - 0.1 * u]);
  assert.deepEqual(arm.via, [sh[0] + 0.15 * u, sh[1] + 0.1 * u]);
  assert.equal(arm.noHand, true);
  assert.deepEqual(WHISPER_CUP, {elbow: [0.15, -0.1], hand: [0.18, 0.1]});
  const left = whisperCupArm(sh, u, 'left');
  assert.equal(left.to[0], sh[0] - 0.18 * u);
  // the shot's `held` paint (B02-SH01.tsx, FRIEND skin, seeds 32520+)
  const skin = PEOPLE['man-spiky'].head.skin, hand: Pt = [520, 830];
  same('whisper hand', (q) => paintWhisperHand(q, hand, u, skin, 32520), (q) => {
    const h = openHandParts([hand[0], hand[1]], -Math.PI / 2 + 0.35, u * 1.1, mittenThumbSide('right', 'back'));
    hardFill(q, 32520, skin, h.palm);
    inkLine(q, 32521, h.palm, {closed: true, weight: 0.9, color: '#3a2216'});
    inkLine(q, 32522, h.thumbCrease, {weight: 0.7, color: '#3a2216'});
    h.creases.forEach((cr, i) => inkLine(q, 32523 + i, cr, {weight: 0.6, color: '#3a2216'}));
  });
});

test('EP31 plates: one entry per finished set, unique ids, EDU31 shots', () => {
  const ep31 = PLATES.filter((p) => p.shot.startsWith('EDU31-'));
  assert.equal(ep31.length, 11);
  assert.equal(new Set(PLATES.map((p) => p.id)).size, PLATES.length);
  for (const p of ep31) assert.ok(p.palette.length === 5 && p.mood.length >= 3 && p.title.length > 40, p.id);
});
