import {ell, hardFill, washAt} from '../kit/draw';
import {paintFigureAt, VIEW_CUES_OFF} from '../kit/figure-at';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {YCam} from '../kit/ycam';
import {forestCam, paintForest} from './forest';
import {paintMonster, paintMonsterArm} from './monster';
import {TH} from './palette';
import {paintBead, paintBubble, paintDots, paintLimb, paintFrameRim, paintLight, paintShockRing, paintStrikeFlash, paintThread, paintVoid, threadAt} from './thought';

// EDU-EP16-SHORT thought-space and forest look stills (Film W3, group 1, 2026-11-14): SH13 standoff (= LF-THOUGHT) and its kind-figure flicker, SH15's last
// frame (giant risen, arm raised), the SH15S W-STRIKE keys on one shot-local clock (STK-K0..K6, 24 f est), and LF-FOREST (SH18). Staging in picture px
// derived from the brief's TH placements (her light lower-left, theirs upper-right; symbolic metres, not physical claims). Brief EDU-EP16-BRIEF-R2.

/** TH camera for the star dust (directions at infinity only; TH cards are staged in picture px for these stills). */
export const thCam = (yaw = 0, pitch = 0.15): YCam => ({x: 0, y: 0, z: 0, yaw, f: 1000, hy: 960, pitch});

// ---------- SH13 (IM2 standoff), LF-THOUGHT ----------
/** SH13 staging (px): lights on the diagonal, the claw gap at its centre (~40 px), her bubble upper-left, theirs lower-right (180 deg about the gap). */
export const SH13 = {
  hers: [250, 1150] as Pt, theirs: [830, 370] as Pt, gap: [540, 760] as Pt,
  herBubble: {at: [290, 540] as Pt, rx: 250, ry: 330}, theirBubble: {at: [790, 1060] as Pt, rx: 250, ry: 345},
  herTip: [524, 742] as Pt, theirTip: [556, 778] as Pt,
  herWorld: {c: [150, 1960] as Pt, r: 800}, theirWorld: {c: [930, -440] as Pt, r: 800},
};

/** `kind` = the ~0.5 s flicker at "ต่อให้คุณใจดี" / "เขาก็ไม่รู้": in their bubble the monster has receded behind a small kind figure of her in warm light, and its shadow is rising again. */
export const paintSH13 = (p: Painter, o: {t: number; kind?: boolean}) => {
  const S = SH13, t = o.t;
  paintVoid(p, {cam: thCam(0.02, 0.2), t, diag: [S.hers, S.theirs]});
  paintLimb(p, {...S.herWorld, color: TH.amber, seed: 46560});
  paintLimb(p, {...S.theirWorld, color: TH.cold, seed: 46580});
  paintLight(p, {at: S.hers, r: 78, kind: 'hers', t});
  paintLight(p, {at: S.theirs, r: 64, kind: 'theirs', t});
  paintDots(p, {from: [S.hers[0] + 6, S.hers[1] - 44], to: [262, 886], seed: 46700});
  paintDots(p, {from: [S.theirs[0] - 6, S.theirs[1] + 40], to: [812, 700], seed: 46710});
  paintBubble(p, {...S.herBubble, seed: 46800});
  paintBubble(p, {...S.theirBubble, seed: 46820});
  // her fear of them: cold eyes, amber rim on the edges facing her light (lower-left)
  paintMonster(p, {base: [150, 830], h: 600, facing: 1, lean: 0.3, reachTo: S.herTip, elbow: -1, aim: 0.84, hangTo: [300, 900], rim: TH.amber, rimDir: [-0.55, 1], eyeColor: TH.cold, seed: 47000, t});
  if (!o.kind) {
    // their fear of her: the same silhouette mirrored, amber eyes, cold rim toward their light (upper-right)
    paintMonster(p, {base: [930, 1420], h: 600, facing: -1, lean: 0.3, reachTo: S.theirTip, elbow: 1, aim: -0.84, hangTo: [800, 1400], rim: TH.cold, rimDir: [0.55, -1], eyeColor: TH.amber, seed: 47100, t});
    return;
  }
  // kind flicker: the monster recedes (faint, lower), its shadow already rising behind a small her (woman-bob, P07 wave, front) in a warm pool
  paintMonster(p, {base: [880, 1440], h: 520, facing: -1, lean: 0.1, reachTo: [700, 930], elbow: 1, rim: TH.cold, rimDir: [0.55, -1], eyeColor: TH.amber, eyes: 0.5, level: 0.5, fadeTo: TH.bubbleIn, seed: 47100, t});
  // warm pool as opaque premixed fills (a translucent amber over the navy turns olive; UT04 clean colour)
  hardFill(p, 47900, mixColor(TH.bubbleIn, TH.amber, 0.2), ell(790, 1095, 150, 175, 28));
  hardFill(p, 47901, mixColor(TH.bubbleIn, TH.amber, 0.36), ell(790, 1105, 105, 132, 24));
  washAt(p, 47903, TH.core, 40, ell(790, 1080, 60, 80, 18), 0, 0);
  hardFill(p, 47902, mixColor(TH.bubbleIn, TH.amber, 0.35), ell(790, 1196, 70, 13, 18));
  const cam: YCam = {x: 0, y: 0.8, z: 5, yaw: 0, f: 600, hy: 1100, cx: 250};
  paintFigureAt(p, cam, PEOPLE['woman-bob'], {...VIEW_CUES_OFF, at: [0, 0, 0], view: 'front', pose: 'P07', face: 'happy', t, shadow: false});
};

// ---------- SH15 last frame (IM3: giant risen, arm raised) ----------
export const SH15 = {hers: [300, 1130] as Pt, glow: [640, 360] as Pt, bead: 0.44};

/** The swelled far light: a vast cold glow filling the upper half (their light, never dimmed). */
export const paintFarGlow = (p: Painter, at: Pt, r: number, level = 1) => {
  [[1.0, 50], [0.78, 60], [0.56, 80], [0.36, 110], [0.2, 150]].forEach(([k, a], i) =>
    washAt(p, 46640 + i, i < 2 ? TH.coldMid : TH.cold, a * level, ell(at[0], at[1], r * k, r * k * 0.92, 32), 0, 0));
  hardFill(p, 46650, mixColor(TH.cold, TH.core, 0.5), ell(at[0], at[1], r * 0.07, r * 0.07, 20));
};

export const paintSH15End = (p: Painter, o: {t: number}) => {
  const S = SH15, t = o.t;
  paintVoid(p, {cam: thCam(0.05, 0.45), t, diag: [S.hers, S.glow]});
  paintFarGlow(p, S.glow, 820);
  const bead = threadAt(S.hers, S.glow, S.bead);
  paintThread(p, {a: S.hers, b: S.glow, shadowFrom: S.bead + 0.02}); // the giant's shadow has taken the thread ahead of the bead
  paintLight(p, {at: S.hers, r: 58, kind: 'hers', t});
  paintBead(p, bead, 0.75);
  // arm raised: elbow high, forearm hanging, claws cocked over her light (wind-up)
  paintMonster(p, {base: [910, 1100], h: 1250, facing: -1, lean: 0.0, keystone: 0.12, reachTo: [214, 700], elbow: -1, aim: 1.2, hangTo: [960, 1210], rim: TH.amber, rimDir: [-0.45, 1], rimW: 3.5, rimAll: mixColor(TH.coldMid, TH.cold, 0.5), eyeColor: TH.cold, eyeCount: 6, seed: 47200, t});
};

// ---------- SH15S W-STRIKE (24 f, shot-local keys STK-K0..K6, est) ----------
export const STK = {
  len: 24, contact: 8, blackFrom: 18,
  hers: [330, 1010] as Pt, glow: [1070, 70] as Pt,
  tipFrom: [236, 430] as Pt, tipAt: [212, 1282] as Pt, shoulder: [900, -300] as Pt, u: 1600,
  bead: 0.4,
};
const easeIn = (x: number) => x * x;
/** Flash level by shot frame: 2 f rise from contact, 4 f decay (one flash only). */
export const flashAt = (f: number) => ({8: 0.6, 9: 1, 10: 0.72, 11: 0.45, 12: 0.22, 13: 0.06} as Record<number, number>)[f] ?? 0;

export const paintSH15S = (p: Painter, f: number) => {
  const S = STK, t = f / 30;
  if (f >= S.blackFrom) { // STK-K6: black inside the rim, dust off; rim at 35 % of normal (>= 30 %, Boat P5); label stays (DOM)
    paintVoid(p, {cam: thCam(), t, dust: 0, nebula: 0});
    return;
  }
  paintVoid(p, {cam: thCam(0.04, 0.3), t, diag: [S.hers, S.glow]});
  paintFarGlow(p, S.glow, 560); // far light top-right, untouched and undimmed throughout
  const k = Math.min(1, f / S.contact), tip: Pt = f >= S.contact ? S.tipAt : [S.tipFrom[0] + (S.tipAt[0] - S.tipFrom[0]) * easeIn(k), S.tipFrom[1] + (S.tipAt[1] - S.tipFrom[1]) * easeIn(k)];
  const beadLv = f <= 8 ? 0.6 : Math.max(0, 0.6 * (1 - (f - 8) / 3));
  const threadDark = f <= 8 ? 0 : Math.min(1, (f - 8) / 3);
  paintThread(p, {a: S.hers, b: S.glow, upTo: S.bead, shadowFrom: f <= 8 ? S.bead : Math.max(0, S.bead * (1 - threadDark)), dark: threadDark * 0.6});
  paintBead(p, threadAt(S.hers, S.glow, S.bead), beadLv);
  if (f < S.contact) paintLight(p, {at: S.hers, r: 70, kind: 'hers', t});
  paintStrikeFlash(p, S.hers, flashAt(f));
  if (f >= S.contact && f <= 15) {
    const e = (f - S.contact) / 7;
    paintShockRing(p, S.hers, 60 + 200 * e, 0.6 * (1 - e));
  }
  // motion smear behind the downstroke (shadow wisps, body colour), only while moving
  if (f > 0 && f < S.contact) {
    const back: Pt = [S.tipFrom[0] + (S.tipAt[0] - S.tipFrom[0]) * easeIn(Math.max(0, k - 0.3)), S.tipFrom[1] + (S.tipAt[1] - S.tipFrom[1]) * easeIn(Math.max(0, k - 0.3))];
    [-38, 0, 38].forEach((off, i) => {
      const nx = 0.85, ny = 0.53;
      washAt(p, 47960 + i, TH.body, 90 - 20 * Math.abs(i - 1), [[back[0] + off * nx, back[1] + off * ny - 30], [tip[0] + off * nx * 0.4 + 20, tip[1] + off * ny * 0.4 - 60], [tip[0] + off * nx * 0.4 - 10, tip[1] + off * ny * 0.4 - 40]], 0, 0);
    });
  } else if (f === 0) {
    [-38, 0, 38].forEach((off, i) => washAt(p, 47960 + i, TH.body, 70 - 20 * Math.abs(i - 1), [[tip[0] + 150 + off * 0.85, tip[1] - 230 + off * 0.53], [tip[0] + 20 + off * 0.3, tip[1] - 60], [tip[0] - 5 + off * 0.3, tip[1] - 40]], 0, 0));
  }
  paintMonsterArm(p, {shoulder: S.shoulder, reachTo: tip, u: S.u, facing: -1, elbow: 1, rim: TH.amber, rimDir: [-0.5, 1], rimW: 4, rimAll: mixColor(TH.coldMid, TH.cold, 0.4), seed: 47600});
  void hash;
};

// ---------- LF-FOREST (SH18, IM4) ----------
export const paintLFForest = (p: Painter, o: {t: number; k?: number}) => paintForest(p, forestCam(o.k ?? 0.5), o.t);

export {paintFrameRim};
