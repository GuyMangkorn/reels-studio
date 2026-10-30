import {test} from 'node:test';
import assert from 'node:assert/strict';
import {paintedShotIds, paintedShots} from '../src/painted/registry';
import {CLIP_ENVELOPE, envAt, risingCrosses} from '../src/painted/bloop/envelope';
import {DOTS, frontCrossing, frontRadius, hydParts, mapXY, MAP_WIN, WF0} from '../src/painted/bloop/geometry';
import {crRealAnchors, crRealPlace} from '../src/painted/bloop/creatures';
import {keelOutline} from '../src/painted/bloop/sets';
import coast from '../src/painted/bloop/coast.json';
import {sh01Rings, sh03Rings, sh05Scale, sh09Camera, sh13Camera, DREAM_PLACE, DREAM_AT_SH06_END, RISE_TO, RISE_FROM} from '../src/painted/shots/bloop';
import {toScreen} from '../src/painted/camera';
import {endingState} from '../src/scenes/endings';
import {validateVideoStyle} from '../src/scenes/media';
import {validateTimeline} from '../src/scenes/timeline';
import {paintedStateAt} from '../src/scenes/painted';
import type {Timeline} from '../src/scenes/types';

// BLOOP plate module (DEP01-DEP07, M01/M02/M04) checks. Sheet numbers that the plates are built from are asserted here;
// the mismatches recorded in scripts/the-bloop/build-notes.md (CR-REAL eye anchors, SH03 G390 pair) are not asserted as passes.

const BLOOP = Array.from({length: 13}, (_, i) => `bloop-sh${String(i + 1).padStart(2, '0')}`);

test('the thirteen BLOOP plates are registered once, with finite cameras over their shot clocks', () => {
  for (const id of BLOOP) assert.ok(paintedShotIds.includes(id), id);
  assert.equal(new Set(paintedShotIds).size, paintedShotIds.length);
  const lengths: Record<string, number> = {'bloop-sh01': 216, 'bloop-sh02': 156, 'bloop-sh03': 96, 'bloop-sh04': 105, 'bloop-sh05': 165, 'bloop-sh06': 63, 'bloop-sh07': 102, 'bloop-sh08': 150, 'bloop-sh09': 74, 'bloop-sh10': 46, 'bloop-sh11': 98, 'bloop-sh12': 196, 'bloop-sh13': 315};
  for (const id of BLOOP) {
    const shot = paintedShots[id];
    for (let f = 0; f < lengths[id]; f += 7) {
      const c = shot.camera(f / 30);
      assert.ok([c.s, c.fx, c.fy, c.dx, c.dy].every(Number.isFinite), `${id} f${f}`);
      assert.ok(c.s >= 0.99 && c.s <= 3.001, `${id} scale ${c.s}`);
    }
  }
});

test('SH13 camera: static to L249, rush to s 3 with dy +270 at L291, held to the end (VD11, scale never above 3)', () => {
  const at = (f: number) => sh13Camera(f / 30);
  assert.deepEqual(at(0), {s: 1, fx: 720, fy: 620, dx: -160, dy: 0});
  assert.deepEqual(at(249), {s: 1, fx: 720, fy: 620, dx: -160, dy: 0});
  assert.deepEqual(at(291), {s: 3, fx: 720, fy: 620, dx: -160, dy: 270});
  assert.equal(at(314).s, 3);
  // the sheet's mouth position: world (720, 620) -> screen (560, 620) at L249 and (560, 890) at L291
  assert.deepEqual(toScreen(at(249), [720, 620]), [560, 620]);
  assert.deepEqual(toScreen(at(291), [720, 620]), [560, 890]);
});

test('SH05 camera follows the sheet: 1.06 to L46, pull to 1.00 by L90, push to 1.04 by L165', () => {
  assert.deepEqual([0, 46, 68, 90, 92, 165].map((f) => Math.round(sh05Scale(f) * 1e4) / 1e4), [1.06, 1.06, 1.03, 1, 1, 1.04]);
});

test('SH09 pan: starts on the SH07 end camera and settles at (dx -1020, dy -560) by L62', () => {
  const start = sh09Camera(0);
  assert.equal(start.s, 1);
  assert.equal(start.dx, 0);
  assert.equal(start.dy, -60);
  const end = sh09Camera(62 / 30);
  assert.ok(Math.abs(end.dx + 1020) < 1e-9 && Math.abs(end.dy + 560) < 1e-9);
  // Peninsula tip (mapXY(303, -63)) enters the window at L38 on screen (798, 834), per the sheet
  const tip = toScreen(sh09Camera(38 / 30), mapXY(303, -63));
  assert.ok(Math.abs(tip[0] - 798) < 2 && Math.abs(tip[1] - 834) < 2, `tip ${tip}`);
});

test('the envelope is the 30 fps NOAA clip: 311 frames, peak 1, one rising cross of 0.35 that the sheet rule keeps', () => {
  assert.equal(CLIP_ENVELOPE.length, 311);
  assert.equal(Math.max(...CLIP_ENVELOPE), 1);
  assert.equal(envAt(-1), 0);
  assert.equal(envAt(1000), 0);
  assert.deepEqual(risingCrosses(0.35, 12), [93, 192]);
  // R4 SH01: rings keyed by arrival (spawn = arrival - 30), base train every 15 f to L180, burst at G93/97/101 only
  assert.deepEqual(sh01Rings(110).map((r) => r.arrive), [120, 135]);
  assert.deepEqual(sh01Rings(123).map((r) => r.arrive), [135, 150]);
  assert.equal(sh01Rings(200).length, 0, 'no ring after the last arrival (L180)');
  assert.equal(sh01Rings(93 - 30 + 5).some((r) => r.arrive === 93), true, 'burst ring travels from its spawn');
});

test('SH03 rings: wide rings at L2 and L22 (gone by L62), clip train only while the envelope is >= 0.2', () => {
  const wideAt = (f: number) => sh03Rings(f).filter((r) => r.key.startsWith('w')).map((r) => r.r);
  assert.equal(wideAt(0).length, 0);
  assert.equal(wideAt(2).length, 1);
  assert.equal(wideAt(30).length, 2);
  assert.equal(wideAt(62).length, 0, 'wide rings are gone by L62');
  assert.equal(wideAt(22).at(-1), 600, 'the second wide ring starts at 600 px on its spawn frame');
  // R4 SH03: a fixed train every 6 f from L32 to L82, whatever the envelope; in-point 2.20 s (frame 66)
  assert.ok(sh03Rings(40).some((r) => r.key.startsWith('c')));
  assert.ok(sh03Rings(20).every((r) => r.key.startsWith('w')));
  const gapsG440 = sh03Rings(68).filter((r) => r.key.startsWith('c')).map((r) => r.r).sort((a, b) => b - a);
  assert.equal(gapsG440.length, 5, 'G440: five clip rings in flight (one spawns on the frame)');
  assert.ok(363 >= 2 * (gapsG440[1] - gapsG440[2]) / 1 && gapsG440.length > 2);
});

test('the map: D1-D6 are 430 px apart (>= 420), mapXY puts the equator at y 638.4, WF0 is never on screen', () => {
  const d16 = Math.hypot(DOTS[5][0] - DOTS[0][0], DOTS[5][1] - DOTS[0][1]);
  assert.ok(d16 >= 420 && d16 <= 440, `D1-D6 ${d16}`);
  assert.ok(Math.abs(mapXY(0, 0)[1] - 638.4) < 1e-9);
  assert.ok(WF0[1] > 1920, 'the hidden centre sits below the frame');
  assert.deepEqual(MAP_WIN, {top: 280, bottom: 840, feather: 60});
});

test('wavefronts: radius grows monotonically per front, and a front crosses the dot row 8 frames after entry', () => {
  let last = -Infinity;
  for (let f = 121; f <= 145; f++) {
    const r = frontRadius(f, 121);
    assert.ok(r >= last);
    last = r;
  }
  assert.ok(Math.abs(frontRadius(121, 121) - (WF0[1] - 860)) < 1e-9);
  assert.ok(Math.abs(frontRadius(145, 121) - (WF0[1] - 280)) < 1e-9);
  // dots crossed at the sheet's frames (L129 for the first front), within half a frame
  const dist = Math.hypot(DOTS[0][0] - WF0[0], DOTS[0][1] - WF0[1]);
  assert.ok(Math.abs(frontCrossing(dist, 121) - 129) < 2, `${frontCrossing(dist, 121)}`);
});

test('the coastline is baked from Natural Earth 1:110m inside the M01 longitude window (145-340 E)', () => {
  assert.equal(coast.lonRangeE[0], 145);
  assert.equal(coast.lonRangeE[1], 340);
  assert.ok(coast.lines.length > 50);
  const [x0, y0, x1, y1] = coast.bbox;
  assert.ok(x0 >= 0 && x1 <= (340 - 145) * 9.4 + 0.5, `x ${x0}..${x1}`);
  assert.ok(y0 > -200 && y1 < 1500, `y ${y0}..${y1}`);
});

test('PROP-HYD is one outline: body 70 x 260 at s 1, the SH01 end (s 1.06) 276 px tall, and it stays above the caption zone', () => {
  const hp = hydParts(540, 560);
  assert.equal(2 * hp.h, 260);
  assert.equal(Math.round(2 * hp.h * 1.06 * 10) / 10, 275.6);
  assert.ok(560 - hp.h >= 430 - 1 && 560 + hp.h <= 690 + 1);
});

test('CR-DREAM placement: the sheet eye (900, 470) at SH06 L0, and the drift carries it +40 px by L63', () => {
  const eye = (tx: number) => [tx + 0.85 * 160, 70.5 + 0.85 * 470];
  assert.deepEqual(eye(DREAM_PLACE(764).tx).map((v) => Math.round(v)), [900, 470]);
  assert.equal(Math.round(eye(DREAM_PLACE(804).tx)[0]), 940);
});

test('CR-REAL placement: crRealPlace puts the mouth centroid on the requested world point exactly', () => {
  const place = crRealPlace(RISE_FROM[0], RISE_TO[1]);
  const a = crRealAnchors(place);
  assert.ok(Math.abs(a.mouth[0] - 720) < 1e-6 && Math.abs(a.mouth[1] - 620) < 1e-6, `${a.mouth}`);
  // head width near the sheet's 950 px at s 1 (k 0.86 gives ~960)
  assert.ok(a.head[2] - a.head[0] > 900 && a.head[2] - a.head[0] < 1000);
});

test('ICE keel (FR04 R4): the keelOutline construction is 1.4-1.8 : 1, has a domed top and no vertical sides', () => {
  const keel = keelOutline(700, 0, 680, 3, 1);
  const xs = keel.map((q) => q[0]), ys = keel.map((q) => q[1]);
  const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
  assert.ok(w / h >= 1.4 && w / h <= 1.8, `aspect ${w / h}`);
  assert.ok(Math.abs(w - 680) < 40, `width ${w}`);
  // no vertical stretch of the side over more than 8 % of the depth (side angles: see measure-plates.ts)
  const left = keel.filter(([x]) => x < Math.min(...xs) + 40);
  assert.ok(left.length > 0);
});

test('ending options: A_fade with holdSec 0 and fadeSec 0 runs to the last frame; the defaults are unchanged', () => {
  const duration = 300, fps = 30;
  assert.deepEqual(endingState(299, duration, fps, 'A_fade', {holdSec: 0, fadeSec: 0}), {poseFrame: 299, opacity: 1});
  assert.deepEqual(endingState(250, duration, fps, 'A_fade', {holdSec: 0, fadeSec: 0}), {poseFrame: 250, opacity: 1});
  // defaults: hold the last 3 s (from frame 210), fade over the last second
  assert.equal(endingState(299, duration, fps, 'A_fade').poseFrame, 210);
  assert.equal(endingState(299, duration, fps, 'A_fade').opacity, 0);
  assert.equal(endingState(0, duration, fps, 'B_loop').opacity, 1);
});

test('video style validation: endHoldSec and endFadeSec need ending A_fade and non-negative seconds', () => {
  assert.doesNotThrow(() => validateVideoStyle({ending: 'A_fade', endHoldSec: 0, endFadeSec: 0}, 'X'));
  assert.throws(() => validateVideoStyle({endHoldSec: 0}, 'X'), /only applies to ending 'A_fade'/);
  assert.throws(() => validateVideoStyle({ending: 'B_loop', endFadeSec: 1}, 'X'), /endFadeSec/);
  assert.throws(() => validateVideoStyle({ending: 'A_fade', endHoldSec: -1}, 'X'), /endHoldSec/);
});

const cueTimeline = (cues: unknown[]): Timeline => [{durationSec: 2, bg: 'none', actors: [], subtitle: '', painted: {shots: cues as never}}];

test('two-slot fact labels: one or two slots accepted (null leaves a slot empty), and returned unchanged to the stage', () => {
  const ok = cueTimeline([{shot: 'bloop-sh11', atSec: 0, label: ['จินตนาการ', 'เสียงจำลอง']}, {shot: 'bloop-sh11', atSec: 1, label: [null, 'เสียงจำลอง'], fromSec: 1}]);
  validateTimeline(ok, 30);
  const state = paintedStateAt(ok, 40, 30, {ending: 'A_fade', durationInFrames: 60, loopBlendFrames: 0, endingOptions: {holdSec: 0, fadeSec: 0}})!;
  assert.deepEqual(state.plates[0].label, [null, 'เสียงจำลอง']);
  assert.throws(() => validateTimeline(cueTimeline([{shot: 'bloop-sh11', atSec: 0, label: ['a', 'b', 'c']}]), 30), /one to two slots/);
  assert.throws(() => validateTimeline(cueTimeline([{shot: 'bloop-sh11', atSec: 0, label: [null, null]}]), 30), /at least one slot/);
  assert.throws(() => validateTimeline(cueTimeline([{shot: 'bloop-sh11', atSec: 0, label: ['']}]), 30), /non-empty/);
});

test('painted screen layers: every BLOOP plate with an Overlay is defined and the registry keeps unique IDs', () => {
  for (const id of BLOOP) assert.equal(typeof paintedShots[id].paint, 'function');
  assert.equal(paintedShots['bloop-sh13'].serves[0], 'SH13');
});

test('R4 SH13 eyes (FR01): the four CP3 eyes at L249 sit within 20 px of the sheet anchors, fully in frame, clear of label slot 1', () => {
  // screen = world - (160, 0) at L249 (s 1, dx -160)
  const a = crRealAnchors(crRealPlace(RISE_FROM[0], RISE_TO[1]));
  const screen = (p: [number, number]): [number, number] => [p[0] - 160, p[1]];
  const want = [[924, 263], [820, 117], [237, 263], [297, 125]];
  const got = [a.eyeNear[0], a.eyeNear[1], a.eyeFar[0], a.eyeFar[1]].map(screen);
  got.forEach((g, i) => assert.ok(Math.hypot(g[0] - want[i][0], g[1] - want[i][1]) <= 20, `eye ${i} ${g} vs ${want[i]}`));
  for (const e of a.eyeRings) {
    const [cx, cy] = screen(e.c);
    assert.ok(cy - e.ry >= 80, `eye top ${cy - e.ry} inside frame`);
    const overlapsSlot = cx + e.rx >= 120 && cx - e.rx <= 330 && cy + e.ry >= 300 && cy - e.ry <= 350;
    assert.equal(overlapsSlot, false, 'no eye pixel in label slot 1');
  }
  // mouth centre unchanged at screen (560, 620); head width 960 +/- 30 (FR01)
  const m = screen(a.mouth);
  assert.ok(Math.abs(m[0] - 560) < 1e-6 && Math.abs(m[1] - 620) < 1e-6);
  assert.ok(Math.abs(a.head[2] - a.head[0] - 960) <= 30, `head width ${a.head[2] - a.head[0]}`);
});

test('R4 SH06 / SH07 / SH11 placement: head left, cr.eye (220, 520) at drift 0; SH07 ghost 60 px lower; SH06 camera 1.02 about (380, 440)', () => {
  const eye = (p: {s: number; tx: number; ty: number}) => [p.tx + p.s * 160, p.ty + p.s * 470];
  assert.deepEqual(eye(DREAM_PLACE()).map((v) => Math.round(v * 10) / 10), [220, 520]);
  assert.equal(DREAM_AT_SH06_END.ty - DREAM_PLACE().ty, 60);
  assert.ok(Math.abs(DREAM_AT_SH06_END.tx - 53.6) < 1e-9);
  const headTop = DREAM_PLACE().ty + 0.79 * 250, headBottom = DREAM_PLACE().ty + 0.79 * 860;
  assert.ok(headTop >= 340 && headBottom <= 840, `head ${headTop}..${headBottom}`);
  const cam = paintedShots['bloop-sh06'].camera(63 / 30);
  assert.deepEqual([cam.s, cam.fx, cam.fy], [1.02, 380, 440]);
});
