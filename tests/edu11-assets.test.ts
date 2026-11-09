import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {hatFront, hatSide} from '../src/painted/kit/gear';
import {paintHeadFront} from '../src/painted/kit/head';
import {camAt} from '../src/painted/edu11/cams';
import {counterFlips, fallY, FREEZE, hudFrameAt, hudNumbers, insetAt, poseFrameAt, REWIND, SHOTS, shotAt} from '../src/painted/edu11/clock';
import {afterAt, BELL, GRIP, paintWoman, planAt} from '../src/painted/edu11/story';
import {camPoint} from '../src/painted/kit/ycam';
import {paintShot} from '../src/painted/edu11/shots';

// EDU-EP11-SHORT Boss W5.2: the one fall clock, the timed clocks of SHEETS-R1.3, every shot camera and a paint smoke through a counting brush.
// Pixel evidence lives in out/edu11/w52/ (sheets A-C).
const counting = () => { let n = 0; const brush = new Proxy({}, {get: () => () => { n++; }}) as Brush; return {painter: (g: number) => makePainter(brush, {t: g / 30, frame: g}), calls: () => n}; };

test('fall clock: holds 20 until the car has dropped 0.5 m, then the sheet flip table (19 is G121: y crosses 56.5 at G120.4)', () => {
  assert.equal(fallY(0), 57); assert.equal(fallY(39), 57); assert.equal(fallY(893), 2); assert.equal(fallY(1500), 2);
  assert.equal(hudNumbers(54).counter, 20); assert.equal(hudNumbers(120).counter, 20);
  const want = '19@121, 18@239, 17@322, 16@385, 15@438, 14@485, 13@528, 12@567, 11@604, 10@638, 9@670, 8@701, 7@730, 6@759, 5@786, 4@812, 3@837, 2@862, 1@886';
  assert.equal(counterFlips().map(([n, g]) => `${n}@${g}`).join(', '), want);
  assert.equal(hudNumbers(375).pill, true); assert.equal(hudNumbers(374).pill, false);
});

test('rewind clocks: pose frames 842 to 0, HUD 892 to 54, inset raster after G977', () => {
  assert.equal(poseFrameAt(905), FREEZE.pose); assert.equal(poseFrameAt(REWIND.start), FREEZE.pose); assert.equal(poseFrameAt(REWIND.end), 0);
  assert.equal(hudFrameAt(REWIND.start), FREEZE.hud); assert.equal(hudFrameAt(REWIND.end), FREEZE.hudAfter);
  assert.equal(insetAt(1000).kind, 'raster'); assert.equal(insetAt(970).kind, 'live-shrink');
});

test('story: planAt(0) is the same in forward and rewind windows; mode windows are deterministic', () => {
  assert.deepEqual(planAt(0), planAt(0, true)); assert.deepEqual(planAt(400), planAt(400));
});

test('cameras: every shot has a finite camera (null only in the black), horizon rows kept, seeks identical', () => {
  for (const [id, a, b] of SHOTS) for (const g of [a, Math.floor((a + b) / 2), b - 1]) {
    const c = camAt(id, g);
    if (id === 'S01-B03-SH05') { assert.equal(c, null); continue; }
    assert.ok(c && [c.x, c.y, c.z, c.f, c.hy].every(Number.isFinite), `${id}@${g}`);
    assert.deepEqual(c, camAt(id, g));
  }
  assert.equal(camAt('S01-B03-SH03', 756)!.hy, 1190);
  assert.equal(shotAt(0), 'S01-B01-SH01');
});

test('paint smoke: sampled frames of every shot paint something', () => {
  const k = counting();
  for (const [id, a, b] of SHOTS) { if (id === 'S01-B03-SH05') continue; const g = Math.floor((a + b) / 2), before = k.calls(); paintShot(k.painter(g), g); assert.ok(k.calls() > before, id); }
});

test('kit intake: top hat and bonnet parts, ouch/relieved faces, hairRise/hairCalm head paints', () => {
  for (const kind of ['top', 'bonnet'] as const) { assert.ok(hatFront(kind).length >= 2); assert.ok(hatSide(kind).length >= 2); }
  assert.ok(EXPRESSIONS.ouch && EXPRESSIONS.relieved);
  const k = counting();
  for (const calm of [false, true]) {
    const n = k.calls();
    paintHeadFront(k.painter(0), 1, 540, 600, 1, EXPRESSIONS.ouch, {cut: 'long', hair: '#14110e', skin: '#e8b88a', hairRise: 1, hairCalm: calm} as never, 0);
    assert.ok(k.calls() > n);
  }
});

test('contact: head top meets the ceiling at G800 (+-6 px), fist on the rail (+-2 px) and on the bell at G1688 (+-6 px), lead 801 at G0', () => {
  const k = counting(), at = (g: number, pl: ReturnType<typeof planAt> | ReturnType<typeof afterAt>) => paintWoman(k.painter(g), camAt(shotAt(g), g)!, pl, {t: g / 30, shadow: false, reach: (pl as {reach?: number}).reach, seat: (pl as {seat?: number}).seat})!;
  const c800 = camAt(shotAt(800), 800)!, pl800 = planAt(800), a800 = at(800, pl800), ceil = camPoint(c800, [pl800.feet[0], 2.3, pl800.feet[2]])!;
  assert.ok(Math.abs(a800.headTop - ceil[1]) <= 6, `bonk ${a800.headTop} vs ${ceil[1]}`);
  const c220 = camAt(shotAt(220), 220)!, a220 = at(220, planAt(220)), gp = camPoint(c220, GRIP)!;
  assert.ok(Math.hypot(a220.rHand[0] - gp[0], a220.rHand[1] - gp[1]) <= 2, 'grip');
  const c = camAt(shotAt(1688), 1688)!, a = at(1688, afterAt(1688)), bp = camPoint(c, BELL)!;
  assert.ok(Math.hypot(a.rHand[0] - bp[0], a.rHand[1] - bp[1]) <= 6, 'bell');
  const a0 = at(0, planAt(0)); assert.ok(Math.abs(a0.bottom - a0.top - 800.8) < 2, 'lead');
});
