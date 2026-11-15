import {ell, hardFill, washAt} from '../kit/draw';
import {paintFigureAt, VIEW_CUES_OFF} from '../kit/figure-at';
import {mixColor, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {YCam} from '../kit/ycam';
import {ease, mix, ramp} from './clock';
import {paintMonster, type MonsterOpts} from './monster';
import {TH} from './palette';
import {SH13} from './scenes';
import {paintBubble, paintDots, paintLight, paintLimb} from './thought';

// EDU-EP16-SHORT timed thought-space cards (Boss W5.2 r3, 2026-11-15) for the shot files SH13-SH15 (timed sheet EDU-EP16-SHEETS-R2, re-keyed W5.5).
// SH13: S01-B04-SH13 L07 IM2 standoff [803, 907) (sheet #13). Iris-in through her eyes [803, 815) is the timeline's. Star dust thCam(0.02 -> 0.16 rad, 0.20)
// over +6..+103; picture-stage push 1.00 -> 1.12 +6..+103; her bubble and theirs slide apart +-12 px with the arc. Keys: +6 her bubble blooms from her
// light (dots +6..+10, bubble +8..+19) and her fear (cold eyes) leans in; +24 their bubble blooms as the 180 deg mirror (amber eyes); +36 both claws frozen
// a hand apart (gap ~40 px, never closes); kind flicker: +47..+53 their monster recedes, +53..+72 the small `woman-bob, P07, happy` stands in warm light,
// +72..+83 the shadow rises and swallows her, eyes shut, amber eyes open +83..+87; frozen to the end. Staging is the W3 LF-THOUGHT / SH13-KIND stills.
// Boss re-key (W5.2 r3, caption zone; Film to confirm): the push is about (540, 1150) (gap x, her light's y) instead of the gap (540, 760). About the
// gap, 1.12 puts her light's centre at y 1197, inside the caption band, while C11 shows; about (540, 1150) it stays at y 1150 (26 px above the band).
export const SH13_PUSH_C: Pt = [540, 1150];
export const sh13Push = (L: number) => 1 + 0.12 * ease(L, 6, 103);
const S = SH13;
const towards = (a: Pt, b: Pt, k: number): Pt => [mix(a[0], b[0], k), mix(a[1], b[1], k)];
type M = Pick<MonsterOpts, 'base' | 'h' | 'lean' | 'reachTo' | 'level' | 'eyes'>;
const mixM = (a: M, b: M, k: number): M => ({
  base: towards(a.base, b.base, k), h: mix(a.h, b.h, k), lean: mix(a.lean ?? 0, b.lean ?? 0, k), reachTo: towards(a.reachTo, b.reachTo, k),
  level: mix(a.level ?? 1, b.level ?? 1, k), eyes: mix(a.eyes ?? 1, b.eyes ?? 1, k),
});
// their monster: standoff (LF-THOUGHT) and receded (SH13-KIND)
const THEIRS: M = {base: [930, 1420], h: 600, lean: 0.3, reachTo: S.theirTip, level: 1, eyes: 1};
const RECEDED: M = {base: [880, 1440], h: 520, lean: 0.1, reachTo: [700, 930], level: 0.5, eyes: 0.5};

/** SH13 cards at shot frame L (picture px, before the stage transform). Exported for SH14's fold (same space). */
export const paintSH13Cards = (p: Parameters<typeof paintLight>[0], L: number, t: number, o: {hersR?: number; theirsR?: number; fold?: number} = {}) => {
  const slide = 12 * ease(L, 6, 103), fold = o.fold ?? 0, sink = 1 - fold;
  paintLimb(p, {...S.herWorld, color: TH.amber, seed: 46560});
  paintLimb(p, {...S.theirWorld, color: TH.cold, seed: 46580});
  paintLight(p, {at: S.hers, r: o.hersR ?? 78, kind: 'hers', t});
  paintLight(p, {at: S.theirs, r: o.theirsR ?? 64, kind: 'theirs', t});
  // her side: dots, bubble, her fear of them (cold eyes, amber rim toward her light)
  const hb = sink * ramp(L, 6, 10), hp = sink * ease(L, 8, 19), hm = sink * ramp(L, 10, 19), hr = ease(L, 12, 36);
  const hx = -slide;
  paintDots(p, {from: [S.hers[0] + 6, S.hers[1] - 44], to: [262, 886], seed: 46700, pop: hb});
  paintBubble(p, {...S.herBubble, at: [S.herBubble.at[0] + hx, S.herBubble.at[1]], seed: 46800, pop: hp});
  // their side: the 180 deg mirror from +24
  const tb = sink * ramp(L, 24, 28), tp = sink * ease(L, 26, 36), tm = sink * ramp(L, 28, 36), tr = ease(L, 28, 36);
  const tx = slide;
  paintDots(p, {from: [S.theirs[0] - 6, S.theirs[1] + 40], to: [812, 700], seed: 46710, pop: tb});
  paintBubble(p, {...S.theirBubble, at: [S.theirBubble.at[0] + tx, S.theirBubble.at[1]], seed: 46820, pop: tp});
  if (hm > 0) {
    const base: Pt = [150 + hx, 830], reach0: Pt = [330 + hx, 700];
    paintMonster(p, {base, h: 600, facing: 1, lean: mix(0.1, 0.3, hr), reachTo: towards(reach0, S.herTip, hr), elbow: -1, aim: 0.84, hangTo: [300 + hx, 900], rim: TH.amber, rimDir: [-0.55, 1], eyeColor: TH.cold, level: hm, fadeTo: TH.bubbleIn, seed: 47000, t});
  }
  if (tm <= 0) return;
  // their monster through the kind flicker
  const m0: M = {...THEIRS, base: [THEIRS.base[0] + tx, THEIRS.base[1]], reachTo: towards([760 + tx, 1100], S.theirTip, tr)};
  const kRec = ease(L, 47, 53), kRise = ease(L, 72, 83);
  let m: M = kRec > 0 ? mixM(m0, RECEDED, kRec) : m0;
  if (kRise > 0) m = {...mixM(RECEDED, m0, kRise), eyes: L < 83 ? mix(0.5, 0, ramp(L, 72, 75)) : ramp(L, 83, 87)};
  m = {...m, level: (m.level ?? 1) * tm};
  const kind = L >= 53 && L < 83 ? ramp(L, 53, 56) * (1 - ramp(L, 75, 83)) : 0;
  const monster = () => paintMonster(p, {...m, facing: -1, elbow: 1, aim: kRec > 0 && kRise < 1 ? undefined : -0.84, hangTo: [800 + tx, 1400], rim: TH.cold, rimDir: [0.55, -1], eyeColor: TH.amber, fadeTo: TH.bubbleIn, seed: 47100, t});
  if (L < 72) monster();
  if (kind > 0) paintKind(kind < 1 ? p.layer(kind, 9000) : p, t);
  if (L >= 72) monster();
};

/** The kind-figure card (SH13-KIND): a warm pool (opaque premixed fills, UT04) and `woman-bob, P07, happy`, front. */
const paintKind = (p: Parameters<typeof paintLight>[0], t: number) => {
  hardFill(p, 47900, mixColor(TH.bubbleIn, TH.amber, 0.2), ell(790, 1095, 150, 175, 28));
  hardFill(p, 47901, mixColor(TH.bubbleIn, TH.amber, 0.36), ell(790, 1105, 105, 132, 24));
  washAt(p, 47903, TH.core, 40, ell(790, 1080, 60, 80, 18), 0, 0);
  hardFill(p, 47902, mixColor(TH.bubbleIn, TH.amber, 0.35), ell(790, 1196, 70, 13, 18));
  const cam: YCam = {x: 0, y: 0.8, z: 5, yaw: 0, f: 600, hy: 1100, cx: 250};
  paintFigureAt(p, cam, PEOPLE['woman-bob'], {...VIEW_CUES_OFF, at: [0, 0, 0], view: 'front', pose: 'P07', face: 'happy', t, shadow: false});
};

