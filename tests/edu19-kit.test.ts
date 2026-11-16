import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import type {FigAnchors} from '../src/painted/kit/cast';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {clipPainter as kitClip} from '../src/painted/kit/clip-circle';
import * as K from '../src/painted/kit/motions-edu19';
import {DOG, GIRL, MUM} from '../src/painted/edu19/cast';
import * as E from '../src/painted/edu19/motion19';
import {clipPainter as epClip} from '../src/painted/edu19/soi';
import {mumWatchAt, sheetCam, sheetMove} from '../src/painted/edu19/stage';
import {leanBackArms as epLeanBack} from '../src/painted/edu19/shots/B01-SH07';

// EDU-EP19 kit intake (KIT-P01, W8.4): the kit copies in motions-edu19.ts and clip-circle.ts return exactly what the episode code returns,
// so a later episode that casts `crouch-sniff`, `one-finger-idea`, ... gets the approved EP19 picture.
const M = sheetMove([6.5, 0.45, -0.25], [-24, -16], [1.8, 1.65], 0.95, {f: 1300, hy: 770, pitch: [-7, -7]});
const cams = [0, 20, 61].map((L) => sheetCam(M, L, 62));
const AT: [number, number, number] = [6.75, 0, -0.45];
const ks = [0, 0.04, 0.3, 0.55, 0.8, 1];

test('motions-edu19 pose helpers match the EP19 episode code', () => {
  for (const c of cams) {
    for (const k of ks) {
      assert.deepEqual(K.oneFingerArms(GIRL, c, AT, {view: 'front'}, k), E.oneFingerArms(c, AT, {view: 'front'}, k, GIRL));
      for (const view of ['left', 'right'] as const) {
        assert.deepEqual(K.crouchSniff(GIRL, c, AT, view, k), E.crouchSniff(c, AT, view, k, GIRL));
        assert.deepEqual(K.kneelRise(GIRL, c, AT, view, k), E.kneelRise(c, AT, view, k, GIRL));
        assert.deepEqual(K.matCarry(c, AT, view, [500, 1300], k), E.matCarry(c, AT, view, [500, 1300], k));
        const body = {floorSit: 1, lean: 0.4 * k, headCock: 0.3 * k};
        assert.deepEqual(K.leanBackArms(GIRL, c, AT, view, body), epLeanBack(c, AT, view, body));
      }
      assert.deepEqual(K.watchPress(MUM, c, AT, k), E.watchPress(c, AT, k));
      assert.deepEqual(K.watchRead(MUM, c, AT, k), E.watchRead(c, AT, k));
    }
  }
});

test('girl-run-noslide phase and the travel clock match the EP19 episode code', () => {
  assert.equal(K.runCycleLength(GIRL), E.runCycleLength(GIRL));
  for (const s of [0, 0.13, 0.9, 2.4, 7.7]) {
    assert.equal(K.noSlideRunPhase(GIRL, s), E.girlRunPhase(s, GIRL));
    assert.equal(K.animalTravelClock(DOG, s), E.dogClock(s));
    assert.equal(K.animalTravelClock(DOG, s, 'run'), E.dogClock(s, 'run'));
  }
  // The phase rises with the distance (the stance foot never slides back).
  const ph = [0, 0.2, 0.4, 0.6, 0.8, 1].map((s) => K.noSlideRunPhase(GIRL, s));
  ph.slice(1).forEach((v, i) => assert.ok(v >= ph[i]));
});

const record = () => {
  const log: string[] = [];
  const brush = new Proxy({}, {get: (_t, name) => (...a: unknown[]) => { log.push(String(name) + JSON.stringify(a)); }}) as Brush;
  return {p: makePainter(brush, {t: 0.5, frame: 15}), log};
};

test('paintIdeaFinger and clipPainter draw the same marks as the episode', () => {
  for (const k of [0.5, 0.7, 1]) {
    const a = record(), b = record();
    K.paintIdeaFinger(a.p, GIRL, [600, 900], 400, k);
    E.paintIdeaFinger(b.p, [600, 900], 400, k, GIRL);
    assert.deepEqual(a.log, b.log);
  }
  const a = record(), b = record();
  const poly: Pt[] = [[300, 500], [900, 520], [880, 1200], [320, 1100]];
  for (const [q, clip] of [[a, kitClip], [b, epClip]] as const) {
    const cp = clip(q.p, 540, 760, 300);
    cp.brush.polygon(poly as never);
    cp.brush.spline([[200, 760], [540, 760], [900, 760]] as never, 0.3);
    cp.wash('#336699', 120, poly);
    cp.flat('#ffffff', poly);
  }
  assert.ok(a.log.length > 0);
  assert.deepEqual(a.log, b.log);
});

test('wristWatchAt matches mumWatchAt', () => {
  const anchors = (hand: Pt): FigAnchors => ({lShoulder: [500, 700], lUpper: [520, 800], lHand: hand} as unknown as FigAnchors);
  for (const hand of [[540, 1000], [600, 760], [541, 901]] as Pt[]) {
    assert.deepEqual(K.wristWatchAt(anchors(hand), 400), mumWatchAt(anchors(hand), 400));
  }
});
