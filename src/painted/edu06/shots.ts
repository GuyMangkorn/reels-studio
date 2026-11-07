import type {Brush} from '../BrushCanvas';
import {ANIMALS, animalCycleLength, animalGaitPeriod, animalWalkSpeed, drawAnimal, type AnimalAnchors, type AnimalPose} from '../kit/animals';
import {animalMotion, STEP_UP_HOP} from '../kit/animal-motions';
import type {FigAnchors} from '../kit/cast';
import {glareGrade, glarePainter} from '../kit/glare';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import {seatedKnee, seatedPose} from '../kit/poses-seated';
import type {V3} from '../kit/space';
import {camPoint, camUnit, orbitYCam, type YCam} from '../kit/ycam';
import {OWN, paintOwn} from './cast';
import {catItem, LR, paintRoom, type CastItem, type RoomLayer} from './room';
import {T_PAIR} from './scenes';

// EDU-EP06-SHORT Boss W5.2 shot-clock proofs (scene sheets EDU-EP06-SHEETS-R1.1, voice-timed). Every function is a pure function of the shot-local
// frame L (the sheet's L), so the Editor's scene reads the same numbers and seeks without state. Cameras are the sheet's (SD01, SD03, SD04, SD05,
// SD08, SD09), eased with the look-frame cosine ease over the shot; the sheet gives no ease, so that is an assumption (the Editor's own ease
// moves the measured margins by a few px only). Painters return the anchors the proof measures. `qa.tsx` renders them, `tests/edu06-shots.test.ts`
// measures them.

const DEG = Math.PI / 180, FPS = 30;
export const SHOT_LEN = {B01SH04: 134, B02SH03: 115, B04SH03: 156, B04SH05: 67, B05SH02: 98, B05SH03: 213} as const;
const smooth = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
const shotEase = (L: number, n: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, L) / (n - 1)));
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const CAT = ANIMALS['cat-orange-tabby'];
const orbit = (at: V3, yaw: number, r: number, eye: number, f: number, hy: number): YCam => orbitYCam(at, r, yaw * DEG, eye, f, hy);
const OWN_FEET = LR.ownFeet;

export const camB01SH04 = (L: number): YCam => { const e = shotEase(L, SHOT_LEN.B01SH04); return {...orbit(T_PAIR, 14 + 4 * e, 1.6 - 0.1 * e, 0.95, 1100, 760), cx: 60}; };
export const camB02SH03 = (L: number): YCam => { const e = shotEase(L, SHOT_LEN.B02SH03); return orbit([-0.15, 1.07, 0.05], 40 - 4 * e, 0.72 - 0.04 * e, 1.1, 1100, 700); };
export const camB04SH03 = (L: number): YCam => { const e = shotEase(L, SHOT_LEN.B04SH03); return {...orbit([0.35, 0.6, -0.3], -25 + 7 * e, 1.9, 0.85, 1000, 760), cx: -40}; };
export const camB04SH05 = (L: number): YCam => { const e = shotEase(L, SHOT_LEN.B04SH05); return orbit([0.24, 0.62, -0.05], 20 + 6 * e, 1.05 - 0.05 * e, 0.8, 1100, 760); };
export const camB05SH02 = (L: number): YCam => { const e = shotEase(L, SHOT_LEN.B05SH02); return {...orbit([0.1, 0.42, -0.02], 30 + 4 * e, 0.7 - 0.05 * e, 0.65, 1100, 760), pitch: -20 * DEG}; };
export const camB05SH03 = (L: number): YCam => { const e = shotEase(L, SHOT_LEN.B05SH03); return {...orbit(T_PAIR, 12 - 4 * e, 1.75 - 0.13 * e, 1.0, 1050, 660), cx: 60}; };

const nullPainter = (t: number): Painter => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t, frame: 0});
const px = (c: YCam, at: V3): {g: Pt; u: number} | null => { const g = camPoint(c, at), u = camUnit(c, at); return g ? {g, u} : null; };
/** The picture-plane ground distance (px/m) and ground point of a card. */
export const cardAt = px;

// ------------------------------------------------------------------------------------------------ S01-B01-SH04: the exit (RN01)
/**
 * Cat clocks of S01-B01-SH04 (user review 2026-11-07: the first exit walked through the sofa's right arm): sit `left` (lid 0.15), ears 0 -> 1 on L50-56,
 * view swap and `stand-up` L60-81, a short stand to L84 (its forepaws already reach the arm's inner face), then the BC1 `step-up` hop (10 f) from the
 * cushion onto the arm top and a walk over the arm top and out of frame right. On the seat the cat is on the `sofa` layer (the arm box overpaints it);
 * from mid-hop it is on the `arm` layer, so it is never inside the arm.
 */
export const B01SH04_HOP = 84;
const exitCtx = {animal: 'cat-orange-tabby' as const, view: 'right' as const};
const B01_ARM_TOP: V3 = [0.72, LR.arm, LR.catStart[2]];
const B01_HOP = {rise: LR.arm - LR.seat, across: B01_ARM_TOP[0] - LR.catStart[0]};
export const catB01SH04 = (L: number): {at: V3; pose: AnimalPose; layer: RoomLayer} => {
  const ears = smooth((L - 50) / 6);
  if (L < 60) return {at: LR.catStart, pose: {view: 'left', state: 'sit', lid: 0.15, ears}, layer: 'sofa'};
  const blend = Math.min(1, (L - 60) / 21);
  if (L < B01SH04_HOP) return {at: LR.catStart, pose: {view: 'right', from: 'sit', state: 'stand', blend, lid: 0.15, ears: 1}, layer: 'sofa'};
  const hopEnd = B01SH04_HOP + STEP_UP_HOP * FPS;
  if (L < hopEnd) {
    const tt = (L - B01SH04_HOP) / FPS, m = animalMotion('step-up', tt, {...exitCtx, ...B01_HOP}), g = lerp3(LR.catStart, B01_ARM_TOP, smooth(tt / STEP_UP_HOP));
    return {at: [g[0], LR.seat + m.offset[1], g[2]], pose: {...m.pose, lid: 0.15, ears: 1}, layer: L < B01SH04_HOP + 5 ? 'sofa' : 'arm'};
  }
  const landed = animalMotion('step-up', 1, {...exitCtx, ...B01_HOP}).pose.walk ?? 0, s = ((L - hopEnd) / FPS) * WALK_V;
  return {at: [B01_ARM_TOP[0] + s, LR.arm, B01_ARM_TOP[2]], pose: {view: 'right', state: 'stand', walk: landed + gaitOf(s), stride: 1, contact: 1, lid: 0.15, ears: 1}, layer: 'arm'};
};
export const paintB01SH04 = (p: Painter, L: number) => {
  const c = camB01SH04(L), t = L / FPS, cat = catB01SH04(L), out: {own?: FigAnchors | null} = {};
  const o = px(c, OWN_FEET);
  paintRoom(p, c, {t, fore: false, cast: [
    catItem(cat.at, cat.pose, t, cat.layer),
    {at: OWN_FEET, draw: (q, cc) => { out.own = paintOwn(q, cc, {at: OWN_FEET, view: 'front', pose: 'P31', face: 'happy', faceState: {eyes: 'wide', look: [0.8, 0.1]}, t, warm: 0.08,
      fig: o ? {...seatedPose('seated-lean-in', OWN, o.g, o.u, 'front', {amount: smooth(L / 31)})} : undefined}); }},
  ]});
  return out.own ?? null;
};

// ------------------------------------------------------------------------------------------------ S01-B04-SH03: the walk-over (BOSS-1)
const WALK_V = animalWalkSpeed(CAT);
const ARM_WALK = Math.hypot(LR.armEnd[0] - LR.armLanding[0], LR.armEnd[2] - LR.armLanding[2]); // 0.35 m
export const B04SH03_T = {standUp: [0, 21], stepUp: [30, 51], hop: 30 + STEP_UP_HOP * FPS, walk: [51, 84], stepDown: [84, 105], land: 84 + STEP_UP_HOP * FPS, sitDown: [110, 134]} as const;
/** Painter order: `arm` (over the sofa front and arm, as the cat is behind or on them) from the step-up landing to the end: on the `sofa` layer the arm box overpaints the cat's rear once it is back on the cushion. */
/** The walk starts at full speed (the step-up lands mid-stride) and the stride eases to 0 at the step-down L84; the ease starts so the 0.35 m is covered exactly. */
const WALK_EASE_FROM = B04SH03_T.walk[1] - 2 * (B04SH03_T.walk[1] - B04SH03_T.walk[0] - (ARM_WALK / WALK_V) * FPS);
const walkStride = (L: number) => 1 - smooth((L - WALK_EASE_FROM) / (B04SH03_T.walk[1] - WALK_EASE_FROM));
const walkDist = (L: number) => { let s = 0; for (let k = B04SH03_T.walk[0]; k < Math.min(L, B04SH03_T.walk[1]); k++) s += (WALK_V / FPS) * walkStride(k + 0.5); return s; };
const gaitOf = (s: number) => (s / animalCycleLength(CAT, 'walk')) * animalGaitPeriod(CAT, 'walk');
const RIM: V3 = [0.9, LR.armchairSeat[1], 0.22];
export const catB04SH03 = (L: number): {at: V3; pose: AnimalPose; layer: RoomLayer} => {
  const [su0] = B04SH03_T.stepUp, [sd0] = B04SH03_T.stepDown;
  const ctx = {animal: 'cat-orange-tabby' as const, view: 'left' as const};
  if (L < su0) return {at: RIM, pose: {view: 'left', from: 'sit', state: 'stand', blend: Math.min(1, L / 21), lid: 0.3}, layer: 'armchair'};
  if (L < B04SH03_T.stepUp[1]) {
    const tt = (L - su0) / FPS, m = animalMotion('step-up', tt, {...ctx, rise: LR.hop.rise, across: LR.hop.across}), u = smooth(tt / STEP_UP_HOP);
    const g = lerp3(RIM, LR.armLanding, u);
    return {at: [g[0], RIM[1] + m.offset[1], g[2]], pose: {...m.pose, lid: 0.3}, layer: L < B04SH03_T.hop ? 'armchair' : 'arm'};
  }
  const landedWalk = animalMotion('step-up', 1, {...ctx, rise: LR.hop.rise, across: LR.hop.across}).pose.walk ?? 0;
  if (L < sd0) {
    const s = walkDist(L);
    return {at: lerp3(LR.armLanding, LR.armEnd, s / ARM_WALK), pose: {view: 'left', state: 'stand', walk: landedWalk + gaitOf(s), stride: walkStride(L), contact: 1, lid: 0.3}, layer: 'arm'};
  }
  if (L < B04SH03_T.stepDown[1]) {
    const tt = (L - sd0) / FPS, m = animalMotion('step-up', tt, {...ctx, rise: -LR.hop.rise, across: 0.32}), u = smooth(tt / STEP_UP_HOP);
    const g = lerp3(LR.armEnd, LR.rightCushion, u);
    return {at: [g[0], LR.armEnd[1] + m.offset[1], g[2]], pose: {...m.pose, lid: 0.3}, layer: 'arm'};
  }
  if (L < B04SH03_T.sitDown[0]) return {at: LR.rightCushion, pose: {view: 'left', state: 'stand', contact: 1, lid: 0.3}, layer: 'arm'};
  const blend = Math.min(1, (L - B04SH03_T.sitDown[0]) / 24);
  return {at: LR.rightCushion, pose: {view: 'left', from: 'stand', state: 'sit', blend, contact: 1, lid: 0.3 + 0.2 * blend}, layer: 'arm'};
};
export const paintB04SH03 = (p: Painter, L: number) => {
  const c = camB04SH03(L), t = L / FPS, cat = catB04SH03(L), look: [number, number] = [0.8 - 0.4 * smooth((L - 40) / 60), 0.1 * smooth((L - 40) / 60)];
  const out: {own?: FigAnchors | null} = {};
  paintRoom(p, c, {t, fore: true, cast: [
    catItem(cat.at, cat.pose, t, cat.layer),
    {at: OWN_FEET, draw: (q, cc) => { out.own = paintOwn(q, cc, {at: OWN_FEET, view: 'front', pose: 'P31', face: 'happy', faceState: {eyes: 'wide', look}, t, warm: 0.08}); }},
  ]});
  return out.own ?? null;
};

// ------------------------------------------------------------------------------------------------ S01-B04-SH05: the head-rub (RN05)
export const RUB_GROUND: V3 = [0.5, LR.rightCushion[1], -0.1];
export const rubClock = (L: number) => (L + 11) / FPS;
/** The head-rub `target` that puts the skull-top anchor on `hand` (px) for a cat of ground point `g` (px) and scale `u` (px/m), `view: 'left'` (forward = screen left). */
export const rubTarget = (g: Pt, u: number, hand: Pt): [number, number] => [(g[0] - hand[0]) / u, (g[1] - hand[1]) / u];
export const RUB_PRESS = 0.01; // m: the skull dips this far into the palm at each push (kit default 0.012); the target sits half of it below the palm so the gap is +-press/2
export const paintB04SH05 = (p: Painter, L: number, o: {press?: number} = {}) => {
  const press = o.press ?? RUB_PRESS;
  const c = camB04SH05(L), t = L / FPS, out: {own?: FigAnchors | null; top?: Pt; hand?: Pt; g?: Pt; u?: number} = {};
  const cg = px(c, RUB_GROUND), og = px(c, OWN_FEET);
  if (!cg || !og) return out;
  // her palm anchor for this frame's camera (no painting), then the cat's target from it
  const own = paintOwn(nullPainter(t), c, {at: OWN_FEET, view: 'front', pose: 'P31', face: 'happy', t, fig: {...seatedPose('seated-offer-palm', OWN, og.g, og.u, 'front', {toward: 1})}});
  const hand = own?.lHand ?? og.g;
  const t0 = rubTarget(cg.g, cg.u, hand), target: [number, number] = [t0[0], t0[1] + press / 2];
  const m = animalMotion('head-rub', Math.min(rubClock(L), 2.6), {animal: 'cat-orange-tabby', view: 'left', target, press});
  const anchors: AnimalAnchors = {};
  paintRoom(p, c, {t, fore: false, cast: [
    {at: RUB_GROUND, draw: (q, cc) => { const k = px(cc, RUB_GROUND)!; drawAnimal(q, 8000, CAT, k.g, k.u, {contact: 1, polish: true, ...m.pose}, t, anchors); }},
    {at: OWN_FEET, draw: (q, cc) => { out.own = paintOwn(q, cc, {at: OWN_FEET, view: 'front', pose: 'P31', face: 'happy', faceState: {eyes: 'half', look: [0.6, 0.3]}, t, warm: 0.12,
      fig: {...seatedPose('seated-offer-palm', OWN, og.g, og.u, 'front', {toward: 1})}}); }},
  ]});
  return {...out, top: anchors.top, hand, g: cg.g, u: cg.u};
};

// ------------------------------------------------------------------------------------------------ S01-B05-SH02 / SH03: the curled cat, the tail on her knee
export const CURL_AT: V3 = [0.2, LR.rightCushion[1], -0.1];
/**
 * B05-SH02 / SH03 (user review 2026-11-07: "the tail flicking her knee is not needed, let her just stroke the cat"): the cat lies curled and still, her hand rests
 * on its back; no tail reach (`tailTo` dropped). Returns the pose with the knee px (her left knee) for the checks. `L` is kept so callers read the same clock.
 */
export const catB05 = (L: number, c: YCam, t: number, o: {earTwitch?: boolean; breath?: boolean} = {}) => {
  const k = px(c, CURL_AT), og = px(c, OWN_FEET);
  if (!k || !og) return null;
  const knee = seatedKnee(OWN, og.g, og.u, 'l', 'front');
  const tw = o.earTwitch ? 0.22 * (twitch(L, 118) + twitch(L, 171)) : 0;
  return {knee, k, og, pose: {view: 'left', state: 'lie', curl: 1, lid: 0.55, ears: tw} as AnimalPose};
};
/** A 7 f ear flick (a bump) centred on shot frame `at`. */
export const twitch = (L: number, at: number) => Math.max(0, Math.sin(Math.PI * (L - at + 3.5) / 7)) * (Math.abs(L - at) < 3.5 ? 1 : 0);
export const paintB05SH02 = (p: Painter, L: number) => {
  const c = camB05SH02(L), t = L / FPS, cat = catB05(L, c, t), out: {tip?: Pt; knee?: Pt; hand?: Pt} = {};
  if (!cat) return out;
  const anchors: AnimalAnchors = {};
  paintRoom(p, c, {t, fore: false, cast: [
    {at: OWN_FEET, draw: (q, cc) => { const o = paintOwn(q, cc, {at: OWN_FEET, view: 'front', pose: 'P31', face: 'happy', faceState: {eyes: 'half'}, t, warm: 0.12, fig: {...seatedPose('seated-offer-palm', OWN, cat.og.g, cat.og.u, 'front', {toward: 1})}}); out.hand = o?.lHand; }},
    {at: [OWN_FEET[0], OWN_FEET[1], OWN_FEET[2] + 0.2], draw: (q, cc) => { const k = px(cc, CURL_AT)!; drawAnimal(q, 8000, CAT, k.g, k.u, {contact: 1, polish: true, ...cat.pose}, t, anchors); }},
  ]});
  return {...out, knee: cat.knee};
};
export const paintB05SH03 = (p: Painter, L: number) => {
  const c = camB05SH03(L), t = (L + 1406 - 1308) / FPS, cat = catB05(100, c, t, {earTwitch: false, breath: true});
  const og = px(c, OWN_FEET);
  if (!cat || !og) return;
  const catL = { ...cat.pose, ears: 0.22 * (twitch(L, 118) + twitch(L, 171)) } as AnimalPose;
  const g = smooth((L - 60) / 40), look: [number, number] = [0.6 + 0.15 * g, 0.2 + 0.1 * g];
  paintRoom(p, c, {t, fore: false, cast: [
    {at: OWN_FEET, draw: (q, cc) => { paintOwn(q, cc, {at: OWN_FEET, view: 'front', pose: 'P31', face: 'happy', faceState: {eyes: 'half', look}, t, warm: 0.12, fig: {...seatedPose('seated-offer-palm', OWN, og.g, og.u, 'front', {toward: 1})}}); }},
    {at: [OWN_FEET[0], OWN_FEET[1], OWN_FEET[2] + 0.2], draw: (q, cc) => { const k = px(cc, CURL_AT)!; drawAnimal(q, 8000, CAT, k.g, k.u, {contact: 1, polish: true, ...catL}, t); }},
  ]});
};

// ------------------------------------------------------------------------------------------------ S01-B02-SH03: her face in the glare, drain (BOSS-4, BOSS-5)
export const glareB02SH03 = (L: number) => glareGrade(L, {start: -24, drainAt: 88, drain: 27});
export const paintB02SH03 = (p: Painter, L: number) => {
  const c = camB02SH03(L), t = L / FPS, g = glareB02SH03(L), q = glarePainter(p, g), out: {own?: FigAnchors | null} = {};
  paintRoom(q, c, {t, fore: false, cast: [
    {at: OWN_FEET, draw: (r, cc) => { out.own = paintOwn(r, cc, {at: OWN_FEET, view: 'front', pose: 'P31', face: 'neutral', faceState: {eyes: 'wide', look: [0.25, 0]}, t, fig: {quarter: 'right', quarterDeg: 25}}); }},
  ]});
  return out.own ?? null;
};

export type ShotItem = CastItem;
