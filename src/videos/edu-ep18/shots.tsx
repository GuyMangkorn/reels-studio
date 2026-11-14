import type {ReactNode} from 'react';
import {Freeze, useCurrentFrame} from 'remotion';
import {camMove, camOf} from '../../painted/kit/cam-moves';
import {hardFill, inkLine} from '../../painted/kit/draw';
import {mixColor, type Painter, type Pt} from '../../painted/kit/painter';
import {paintFigureAt} from '../../painted/kit/figure-at';
import {PEOPLE} from '../../painted/kit/people';
import {paintSkyBands} from '../../painted/kit/sky';
import {camPoint, camUnit, type YCam} from '../../painted/kit/ycam';
import {wFill, qy, qz, paintSorted, type Item} from '../../painted/kit/world';
import {poseArms} from '../../painted/kit/poses';
import {shoulderPoint, type Arm} from '../../painted/kit/cast';
import {dressIsan, paintCast, KENG} from '../../painted/survival/cast';
import {cardAt, cell, cps, strip, type V3} from '../../painted/survival/core';
import {paintLongNeckHerd, paintSauropodSilhouette} from '../../painted/survival/creatures';
import {paintHen} from '../../painted/survival/hen';
import {Painted, Vignette, FPS} from '../../painted/survival/frame';
import {paintRiver} from '../../painted/survival/river';
import {paintShop} from '../../painted/survival/shop';
import {paintTorchBeam} from '../../painted/survival/props';
import {PhoneScreen} from '../../painted/survival/screens';
import {LIGHT, paintVillage} from '../../painted/survival/village';
import {cylinder, paintUnder, lampK} from '../../painted/survival/under';
import {SHOT_TABLE, shotLen, shotStart} from './clock';
import {RecipeCardAnim, SafetyAnim} from './screens';
import {JUG, K0, KHEAD, Y0, beamWorld, jugItem, kItem, kneelArm, slippersItem, tint, yItem} from './under-scenes';
import {paintHeldProp, paintPhoneHeld, paintCupHeld} from './under-scenes';

// EDU-EP18-SHORT plates (Editor, 14 Nov 2026): the 22 shots of scripts/edu-series/ep18/storyboard.md SHEET-R1.1 composed from Boss's shared survival assets
// (src/painted/survival, not edited). Each shot is a pure function of its shot-local frame L (and the global frame g for ambient clocks). Cameras are the sheet's `cam:` lines
// except where a line below says otherwise (every deviation is listed in scripts/edu-series/ep18/edit-plan.md).
type Def = {paint: (p: Painter) => void; paper: string; children?: ReactNode; overlay?: ReactNode};
type Par = {level?: number};
const DEFS: Record<string, (L: number, g: number, par: Par) => Def> = {};
const frac = (id: string, L: number) => L / (shotLen(id) - 1);
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => { const k = clamp(v); return k * k * (3 - 2 * k); };
const White = ({o}: {o: number}) => (o > 0 ? <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: o}} /> : null);
const NIGHT_TO = '#12121e';
const Night = (v: V3, u = 0.28) => ({to: NIGHT_TO, u: u - 0.1 * lampK(v)});
// warm morning wash over the night-built SET-UNDER (asset gap: SET-UNDER has no morning light, see the edit plan): lifts the darks toward warm daylight
const MorningWash = ({k = 1}: {k?: number}) => <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#f6d9a2 0%,#e8b87c 100%)', mixBlendMode: 'screen', opacity: 0.5 * k}} />;

// ---------------------------------------------------------------- 1 signature (shared with EP16 shot 1)
const C1 = camMove([-1, 2, -6], [35, 32], [22, 20.5], 1.6, {f: 760, hy: 880, ease: [0, 1]});
DEFS.SH01 = (L, g) => ({paper: '#0f1530', paint: (p) => paintVillage(p, camOf(C1, frac('SH01', L)), {mode: 'night', t: g / FPS, ripple: {speed: 1.6, glow: 0.55}}),
  children: <Vignette level={0.35} id="e18v1" />, overlay: <White o={ease((L - 78) / 13)} />});
// ---------------------------------------------------------------- 2 morning reveal
const C2 = camMove([[-1, 2, -6], [1.5, 1.5, -9]], [32, 22], [20.5, 15], [1.6, 1.5], {f: 760, hy: 880, ease: [0, 1]});
DEFS.SH02 = (L, g) => ({paper: '#cfdcc4', paint: (p) => paintVillage(p, camOf(C2, frac('SH02', L)), {mode: 'morning', t: g / FPS}),
  children: <Vignette level={0.2} id="e18v2" />, overlay: <White o={1 - clamp(L / 9)} />});
// ---------------------------------------------------------------- 3 Keng drinks from the stream, long-necks wading far upstream
const C3 = camMove([0, 0.8, 0.2], [75, 68], [3.2, 2.8], 0.8, {f: 880, hy: 940, ease: [0, 1]});
DEFS.SH03 = (L, g) => {
  const t = g / FPS, c = camOf(C3, frac('SH03', L)), K: V3 = [0.4, 0, 0.3];
  return {paper: '#cfdcc4', children: <Vignette level={0.2} id="e18v3" />, paint: (p) => paintRiver(p, c, {mode: 'day', t, extra: [
    {at: [0, 0, -70], draw: (q) => { paintLongNeckHerd(q, {x0: 150, x1: 560, base: 948, h: 150, n: 5, color: '#8a9b92', seed: 32000, drink: 0.4}); }},
    {at: K, draw: (q, cc) => {
      // kneeling on the bank, one cupped hand to the mouth (P19 arm on the P34 kneel)
      const g0 = camPoint(cc, K), u = camUnit(cc, K); if (!g0) return;
      const st = poseArms('P19', KENG, g0, u, 'right'), a = shoulderPoint(KENG, g0, u, {view: 'right'}, 'r'), b = shoulderPoint(KENG, g0, u, {view: 'right', kneel: 1}, 'r');
      const d: Pt = [b[0] - a[0], b[1] - a[1]], m = (x?: Arm) => (x ? {...x, to: [x.to[0] + d[0], x.to[1] + d[1]] as Pt, via: x.via ? [x.via[0] + d[0], x.via[1] + d[1]] as Pt : undefined} : undefined);
      paintCast(q, cc, 'K', {at: K, view: 'right', pose: 'P34', face: 'neutral', t, shadow: {op: 30}, fig: {rArm: m(st.rArm)}});
    }},
  ]})};
};
// ---------------------------------------------------------------- 4 night under the house; V01 phone call (LF18-UNDER camera)
const C4 = camMove([-4.6, 0.75, -4.5], [12, 6], [2.05, 1.9], 1.05, {f: 1000, hy: 750, ease: [0, 1]});
DEFS.SH04 = (L, g) => {
  const c = camOf(C4, frac('SH04', L)), t = g / FPS, awake = L >= 40;
  const phoneDown = L >= 90;
  return {paper: '#151a2a', children: <Vignette level={0.3} id="e18v4" />, paint: (p) => paintUnder(p, c, {t, extra: [
    jugItem(1), slippersItem, kItem({spose: 'belly-lie', face: 'sad', t}),
    yItem({arm: phoneDown ? 'P18' : 'P20', face: 'worried', t, held: (q, a, u) => paintPhoneHeld(q, a.rHand, u, awake ? 0.9 : 0.1)}),
  ]})};
};
// ---------------------------------------------------------------- 5 W-PHONE: Grandma climbs the ladder, the phone to the sky
const C5 = camMove([0.4, 2.2, -5], [110, 100], [4, 3.6], 1, {pitch: [22, 22], f: 850, hy: 1100, ease: [0, 1]});
DEFS.SH05 = (L, g) => {
  const c = camOf(C5, frac('SH05', L)), t = g / FPS;
  const s = 0.55 + 0.25 * ease(L / 20), at: V3 = [0.6 - 1.6 * s, 2.4 * s, -5.0];
  const arm = clamp((L - 22) / 6), wave = L > 30 ? Math.sin((L - 30) * 0.5) * 0.28 : 0;
  return {paper: '#0f1530', children: <Vignette level={0.35} id="e18v5" />, paint: (p) => paintVillage(p, c, {mode: 'night', t, extra: [
    {at: [0, 0, -300], draw: (q) => paintSauropodSilhouette(q, 600, 1000, 150, '#0a0f24', 40200, 1, 0.9)},
    {at, draw: (q, cc) => {
      const hand: V3 = [at[0] - 0.05, at[1] + 1.45 + 0.4 * arm, at[2] + 0.3 + wave];
      const hp = camPoint(cc, hand), hu = camUnit(cc, hand);
      paintCast(q, cc, 'Y', {at, view: 'left', pose: 'P01', face: 'worried', t, tint: Night(at), fig: arm > 0 && hp ? {rArm: {to: hp}} : {}, held: (qq, a, u) => paintPhoneHeld(qq, a.rHand, u, 0.9)});
      void hu;
    }},
  ]})};
};
// ---------------------------------------------------------------- 6 the phone screen: full battery, no bars (screen-space insert, no world camera)
DEFS.SH06 = (L, g) => {
  const push = 1 + 0.05 * frac('SH06', L), skin = '#efc9a3', blink = L >= 39 && L < 47 && Math.floor((L - 39) / 4) % 2 === 0;
  return {paper: '#10151f', children: <Vignette level={0.45} id="e18v6" />,
    paint: (p) => {
      hardFill(p, 41000, '#161c2a', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
      hardFill(p, 41001, '#1d2638', [[0, 1180], [1080, 1180], [1080, 1920], [0, 1920]]);
      // her fingers on the phone edges (painted mittens), the thumb over the right edge
      const fp = (id: number, pts: Pt[]) => { hardFill(p, id, skin, pts); inkLine(p, id + 1, pts, {weight: 0.7, color: '#8a5a3a', still: true}); };
      fp(41010, [[250, 940], [330, 880], [350, 1000], [330, 1190], [250, 1230], [190, 1100]]);
      fp(41020, [[790, 960], [740, 900], [725, 1010], [745, 1160], [800, 1180], [850, 1070]]);
      fp(41030, [[300, 1110], [740, 1110], [780, 1330], [520, 1420], [260, 1330]]);
    },
    overlay: <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '540px 700px'}}><PhoneScreen x={540} y={700} w={420} state={blink ? 'wake' : 'nobars'} battery={100} /></div>};
};
// ---------------------------------------------------------------- 7 high wide: the village, no tower on the skyline
const C7 = camMove([-0.2, 3.4, 5], [180, 172], 10, 3.6, {pitch: [4, 4], f: 780, hy: 1000, ease: [0, 1]});
DEFS.SH07 = (L, g) => ({paper: '#0f1530', children: <Vignette level={0.35} id="e18v7" />, paint: (p) => paintVillage(p, camOf(C7, frac('SH07', L)), {mode: 'night', t: g / FPS})});
// ---------------------------------------------------------------- 8 Grandma thumbs the torch on (K03), walks to the gate
const C8 = camMove([[1.2, 1.2, -3], [1.2, 1.2, -1.5]], [200, 190], [2.6, 3.2], 1.5, {f: 880, hy: 940, ease: [0, 1]});
DEFS.SH08 = (L, g) => {
  const c = camOf(C8, frac('SH08', L)), t = g / FPS, on = L >= 8 ? 1 : 0, walk = ease((L - 12) / 27);
  const at: V3 = [1.2 - 0.1 * walk, 0, -3.0 + 1.5 * walk], back = L >= 12;
  return {paper: '#0f1530', children: <Vignette level={0.35} id="e18v8" />, paint: (p) => {
    paintVillage(p, c, {mode: 'night', t, extra: [{at, draw: (q, cc) => {
      const hand: V3 = [at[0] + 0.2, 0.95, at[2] + (back ? 0.15 : -0.05)], target: V3 = [at[0] + 0.5, 0, at[2] + 1.6];
      const a = camPoint(cc, hand), b = camPoint(cc, target);
      if (a && b && on) paintTorchBeam(q, a, b, {level: 0.85, spread: 0.16});
      paintCast(q, cc, 'Y', {at, view: back ? 'back' : 'front', pose: 'P01', face: L < 8 ? 'sad' : 'worried', t, tint: Night(at), fig: back ? {walk: (L - 12) * 0.28} : {}, held: (qq, aa, u) => paintPhoneHeld(qq, aa.rHand, u, on ? 0.9 : 0.3)});
    }}]});
  }};
};
// ---------------------------------------------------------------- 9 the village shop at night (look-frame camera)
const C9 = camMove([0.6, 1.4, -1.2], [20, 8], [3.2, 2.6], 1.45, {f: 880, hy: 940, ease: [0, 1]});
const KEEPER = dressIsan(PEOPLE['woman-bob'], 'isan-home-woman');
DEFS.SH09 = (L, g) => {
  const c = camOf(C9, frac('SH09', L)), t = g / FPS, yx = 0.4 + 0.9 * (1 - ease(L / 20));
  return {paper: '#12161f', children: <Vignette level={0.35} id="e18v9" />, paint: (p) => paintShop(p, c, {t, stock: 'few', curtain: L < 14 ? 'full' : 'off', extra: [
    {at: [0.4, 0, -1.6], draw: (q, cc) => { paintFigureAt(q, cc, KEEPER, {at: [0.4, 0, -1.6], view: L < 30 ? 'front' : 'back', pose: 'P16', face: 'worried', t, tint: {to: NIGHT_TO, u: 0.3}}); }},
    {at: [yx, 0, -0.5], draw: (q, cc) => { paintCast(q, cc, 'Y', {at: [yx, 0, -0.5], view: 'front', pose: 'P01', face: 'worried', t, tint: {to: NIGHT_TO, u: 0.25}, held: (qq, a, u) => paintPhoneHeld(qq, a.rHand, u, 0.8)}); }},
  ]})};
};
// ---------------------------------------------------------------- 10 the last box handed over; the shelf bare
const C10 = camMove([1, 1.4, -2.2], [15, 8], [1.3, 1.15], 1.4, {f: 950, hy: 940, ease: [0, 1]});
DEFS.SH10 = (L, g) => {
  const c = camOf(C10, frac('SH10', L)), t = g / FPS;
  const hx = L < 20 ? -60 + 330 * ease(L / 20) : 270 - 400 * ease((L - 22) / 18), box = L >= 8 && L < 42;
  return {paper: '#12161f', children: <Vignette level={0.35} id="e18v10" />, paint: (p) => {
    paintShop(p, c, {t, stock: L < 42 ? 'last' : 'bare', curtain: 'off'});
    // the shopkeeper's hand and sleeve from frame left, holding the last box once it is lifted
    const hy = 1330, skin = '#efc9a3', sleeve = '#ece2cc';
    hardFill(p, 42000, sleeve, strip([[-120, hy + 30], [hx - 60, hy + 10]], [90, 70]));
    hardFill(p, 42002, skin, strip([[hx - 80, hy + 10], [hx, hy]], [60, 48]));
    hardFill(p, 42004, skin, cell({g: [hx + 12, hy], u: 1, s: 1}, 0, 0, 42, 36, 14));
    if (box) paintHeldProp(p, 'pill-box', [hx + 20, hy - 6], 700, {seed: 42100});
  }};
};
// ---------------------------------------------------------------- 11 Grandma scolds and wipes his forehead (SET-UNDER night)
const C11 = camMove([-4.5, 0.7, -4.3], [-30, -22], [1.6, 1.4], 0.95, {f: 950, hy: 860, ease: [0, 1]});
DEFS.SH11 = (L, g) => {
  const c = camOf(C11, frac('SH11', L)), t = g / FPS, wipe = L >= 10 && L < 70 ? Math.sin((L - 10) * 0.55) * 0.07 : 0;
  const Y: V3 = [-4.35, 0.46, -4.0], head = camPoint(c, [KHEAD[0] + 0.15 + wipe, 0.62, KHEAD[2] + 0.25]);
  return {paper: '#151a2a', children: <Vignette level={0.3} id="e18v11" />, paint: (p) => paintUnder(p, c, {t, extra: [
    jugItem(1), slippersItem, kItem({spose: 'belly-lie', face: 'sad', t}),
    yItem({at: Y, view: 'front', face: L < 40 ? 'angry' : 'worried', t, ...(head ? {armTo: head} : {}), held: (q, a, u) => paintHeldProp(q, 'cloth', a.rHand, u, {seed: 43000})}),
  ]})};
};
// ---------------------------------------------------------------- 12 close: weak, eyes half closed, a guilty smile (K lies at the shot 4 mark; camera target moved to his head)
const C12 = camMove([-4.45, 0.6, -4.4], [10, 16], [0.9, 0.8], 0.75, {pitch: [-10, -10], f: 1000, hy: 900, ease: [0, 1]});
DEFS.SH12 = (L, g) => {
  const c = camOf(C12, frac('SH12', L)), t = g / FPS;
  return {paper: '#151a2a', children: <Vignette level={0.3} id="e18v12" />, paint: (p) => paintUnder(p, c, {t, extra: [jugItem(1), kItem({spose: 'belly-lie', face: 'tired', guilty: true, t})]})};
};
// ---------------------------------------------------------------- 13 limp and pale on the mat; Grandma fans him slowly
const C13 = camMove([-4.6, 0.6, -4.4], [50, 42], [2, 1.7], 1, {pitch: [-8, -8], f: 920, hy: 940, ease: [0, 1]});
DEFS.SH13 = (L, g) => {
  const c = camOf(C13, frac('SH13', L)), t = g / FPS, sw = 0.5 + 0.5 * Math.sin(g * 0.22);
  return {paper: '#151a2a', children: <Vignette level={0.3} id="e18v13" />, paint: (p) => paintUnder(p, c, {t, extra: [
    jugItem(1), kItem({spose: 'belly-lie', face: 'sleepy', t}),
    yItem({at: [-4.3, 0.46, -3.95], view: 'left', face: 'worried', t, held: (q, a, u) => paintHeldProp(q, 'hand-fan', a.rHand, u, {swing: sw, seed: 44000})}),
  ]})};
};
// ---------------------------------------------------------------- 14 close whisper "ยาย... หิวน้ำ"
const C14 = camMove([-4.45, 0.6, -4.4], [340, 348], [0.75, 0.65], 0.7, {pitch: [-6, -6], f: 1000, hy: 900, ease: [0, 1]});
DEFS.SH14 = (L, g) => {
  const c = camOf(C14, frac('SH14', L)), t = g / FPS;
  return {paper: '#151a2a', children: <Vignette level={0.3} id="e18v14" />, paint: (p) => paintUnder(p, c, {t, extra: [jugItem(0.2), kItem({spose: 'belly-lie', face: 'whisper', t})]})};
};
// ---------------------------------------------------------------- 15 the water jug level drops (three painted dissolves: plates 15a-15d)
const C15 = camMove([-4.2, 0.6, -4.8], [30, 22], [0.9, 0.8], 0.62, {f: 1000, hy: 940, ease: [0, 1]});
DEFS.SH15 = (L, g, par) => {
  const c = camOf(C15, frac('SH15', L)), t = g / FPS;
  return {paper: '#151a2a', children: <Vignette level={0.3} id="e18v15" />, paint: (p) => paintUnder(p, c, {t, extra: [jugItem(par.level ?? 1), kItem({spose: 'belly-lie', face: 'sleepy', t})]})};
};
// ---------------------------------------------------------------- 16 by the torch: the low jug, his dry lips, the beam drifts up to the shelf
const C16 = camMove([[-4.3, 0.5, -4.6], [-4.4, 1.1, -7.6]], [10, 2], [1.1, 3.8], [0.75, 1], {pitch: [-10, 4], f: 920, hy: 960, ease: [0, 1]});
DEFS.SH16 = (L, g) => {
  const c = camOf(C16, frac('SH16', L)), t = g / FPS, lens: V3 = [-4.85, 0.95, -4.6];
  const tgt: V3 = L < 25 ? [-4.2, 0.55, -4.85] : L < 59 ? [KHEAD[0] + 0.1, 0.55, KHEAD[2] + 0.05] : [-4.4, 0.6 + 0.6 * ease((L - 59) / 24), -7.85 + 0 * L];
  const up: V3 = L < 59 ? tgt : [-4.4, 0.6 + 0.55 * ease((L - 59) / 24), -7.5 - 0.35 * ease((L - 59) / 24)];
  return {paper: '#151a2a', children: <Vignette level={0.3} id="e18v16" />, paint: (p) => {
    paintUnder(p, c, {t, extra: [jugItem(0.2), kItem({spose: 'belly-lie', face: 'sleepy', t}), yItem({arm: 'P18', face: 'worried', t, held: (q, a, u) => paintPhoneHeld(q, a.rHand, u, 0.9)})]});
    beamWorld(p, c, lens, up, 0.8, 0.13);
  }};
};
// ---------------------------------------------------------------- 17 W-KITCHEN: the beam lands on the sugar jar and the salt jar
const C17 = camMove([-4.42, 1.15, -7.85], [6, 0], [1.3, 1], 1.25, {f: 950, hy: 940, ease: [0, 1]});
DEFS.SH17 = (L, g) => {
  const c = camOf(C17, frac('SH17', L)), t = g / FPS, jl = ease((L - 12) / 12);
  const x = L < 14 ? -4.9 + 0.3 * (L / 14) : L < 24 ? -4.6 + 0.2 * ((L - 14) / 10) : -4.42;
  return {paper: '#151a2a', children: <Vignette level={0.3} id="e18v17" />, paint: (p) => {
    paintUnder(p, c, {t, jarLight: jl});
    beamWorld(p, c, [-5.0, 0.7, -6.4], [x, 1.2, -7.85], 0.85, L < 24 ? 0.1 : 0.18);
  }};
};
// ---------------------------------------------------------------- 18 overhead: Grandma's hands make the drink (LF18-RECIPE camera); card, strip
const C18 = camMove([-4, 0.5, -5], [0, 6], [0.75, 0.7], 1.45, {f: 950, hy: 1180, pitch: [-58, -58], near: 0.05, ease: [0, 1]});
const SKIN = '#efc9a3', SLEEVE = '#ece2cc', BOTTLE = '#d9ecef';
const mitten = (p: Painter, id: number, at: Pt, u: number, ang: number) => {
  const r = (x: number, y: number): Pt => [at[0] + (x * Math.cos(ang) - y * Math.sin(ang)) * u, at[1] + (x * Math.sin(ang) + y * Math.cos(ang)) * u];
  hardFill(p, id, SKIN, [r(-0.04, -0.035), r(0.04, -0.04), r(0.05, 0.02), r(0.0, 0.05), r(-0.045, 0.03)]);
  hardFill(p, id + 1, SKIN, [r(-0.02, -0.045), r(0.02, -0.075), r(0.04, -0.06), r(0.01, -0.03)]);
  inkLine(p, id + 2, [r(-0.04, -0.035), r(0.04, -0.04), r(0.05, 0.02), r(0.0, 0.05), r(-0.045, 0.03)], {weight: 0.6, color: '#8a5a3a', still: true});
};
const SUGAR_JAR: V3 = [-4.3, 0.46, -5.1], SALT_JAR: V3 = [-3.78, 0.46, -5.12], BOT: V3 = [-4.05, 0.46, -5.0];
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
DEFS.SH18 = (L, g) => {
  const c = camOf(C18, frac('SH18', L)), t = g / FPS;
  // stages (shot-local): pour 0-36; six sugar spoons 38-78 (one per ~6.7 f); salt half spoon 88-108 (scrape at 100); stir 110-128
  let spoonAt: V3 | null = null, load = 0, pour = 0, stir = 0;
  if (L < 34) pour = 1;
  // six sugar spoons: the funnel contacts land on the six tap onsets of S18-11 (spoon-taps _02 stretched x1.2 from f1300: f1301.8, 1309.4, 1316.2, 1323.4, 1329.2, 1336.4 = +37.8 ... +72.4)
  const hits = [37.8, 45.4, 52.2, 59.4, 65.2, 72.4];
  if (L >= 34 && L < 80) {
    const imp = hits.find((h) => L < h + 3.4) ?? hits[5], d = (L - imp) / 3.4, k = 1 - Math.min(1, Math.abs(d));
    spoonAt = lerp3([-4.3, 0.74, -5.1], [-4.05, 0.84, -4.99], ease(k)); load = L < imp ? 1 : 0;
    if (L >= hits[5] + 3.4) spoonAt = null;
  }
  if (L >= 88 && L < 110) { const ph = clamp((L - 88) / 12); spoonAt = ph < 1 ? lerp3([-3.78, 0.74, -5.12], [-4.03, 0.86, -4.98], ph) : [-4.03, 0.86, -4.98]; load = 0.6; if (L >= 102) load = 0; }
  if (L >= 110) { stir = Math.sin((L - 110) * 0.9) * 0.02; spoonAt = [-4.05 + stir, 0.8, -5.0]; load = 0; }
  const water = clamp(L / 34) * 0.9, sugarLeft = 1 - clamp((L - 38) / 36) * 0.6, saltLeft = 1 - clamp((L - 90) / 14) * 0.15;
  return {paper: '#151a2a', children: <Vignette level={0.3} id="e18v18" />, overlay: <><RecipeCardAnim g={g} /><SafetyAnim g={g} /></>, paint: (p) => {
    paintUnder(p, c, {t});
    const P = (v: V3) => camPoint(c, v)!, U = (v: V3) => camUnit(c, v);
    cylinder(p, c, 24100, SUGAR_JAR, 0.065, 0.16, '#d9e6e8', {top: '#efe6d0', ink: '#5a6670'});
    cylinder(p, c, 24102, SUGAR_JAR, 0.06, 0.11 * sugarLeft, '#efe6d0');
    hardFill(p, 24105, '#c23a2a', cell({g: P([-4.42, 0.47, -4.9]), u: U([-4.42, 0.47, -4.9]), s: 1}, 0, 0, 0.07, 0.07, 14));
    cylinder(p, c, 24110, SALT_JAR, 0.065, 0.16, '#d9e6e8', {top: '#f8f8f4', ink: '#5a6670'});
    cylinder(p, c, 24112, SALT_JAR, 0.06, 0.11 * saltLeft, '#f8f8f4');
    cylinder(p, c, 24120, BOT, 0.043, 0.22, BOTTLE, {ink: '#6a8a90'});
    cylinder(p, c, 24125, [BOT[0], 0.46, BOT[2]], 0.041, 0.2 * water, '#bfe3f2');
    cylinder(p, c, 24130, [BOT[0], 0.68, BOT[2]], 0.043, 0.06, BOTTLE, {taper: 0.4, ink: '#6a8a90'});
    cylinder(p, c, 24135, [BOT[0], 0.74, BOT[2]], 0.012, 0.03, '#2f6fb8');
    cylinder(p, c, 24140, [BOT[0], 0.77, BOT[2]], 0.012, 0.06, '#e8b84a', {taper: 4.5, top: '#c99a3a', ink: '#8a6a2a'});
    // hands: forearms from the frame sides; right hand = the pot (pour), then the spoon; left hand = the bottle neck (pour), then the knife
    let rW: V3 = [-3.88, 0.88, -4.86], lW: V3 = [-4.18, 0.88, -4.9];
    if (pour) {
      rW = [-3.85, 1.0, -4.95]; lW = [-4.22, 0.78, -5.0];
      const pot = P([-3.95, 1.0, -4.97]), pu = U([-3.95, 1.0, -4.97]);
      hardFill(p, 24300, '#8a8e92', cell({g: pot, u: pu, s: 1}, 0, 0, 0.11, 0.075, 16));
      hardFill(p, 24301, '#5a5e62', cell({g: pot, u: pu, s: 1}, 0, -0.01, 0.085, 0.05, 14));
      const a = P([-4.03, 0.98, -4.97]), b = P([BOT[0], 0.8, BOT[2]]);
      hardFill(p, 24302, '#bfe3f2', strip([a, b], [3 * (U(BOT) / 900), 2 * (U(BOT) / 900)]));
    } else if (spoonAt) {
      rW = [spoonAt[0] + 0.14, spoonAt[1] + 0.02, spoonAt[2] + 0.02];
      const sg = P(spoonAt), su = U(spoonAt);
      hardFill(p, 24150, '#c8ccd0', cell({g: sg, u: su, s: 1}, 0, 0, 0.022, 0.016, 14));
      if (load) hardFill(p, 24151, L >= 88 ? '#ffffff' : '#efe6d0', cell({g: [sg[0] - 0.004 * su, sg[1] + 0.002 * su], u: su, s: 1}, 0, 0, 0.012, 0.012, 12));
      inkLine(p, 24152, cell({g: sg, u: su, s: 1}, 0, 0, 0.022, 0.016, 14), {weight: 0.6, color: '#5a5e62', still: true});
      const hd = P(rW);
      hardFill(p, 24153, '#c8ccd0', [[sg[0] + 0.018 * su, sg[1] - 0.004 * su], [hd[0], hd[1] - 0.005 * su], [hd[0], hd[1] + 0.006 * su], [sg[0] + 0.018 * su, sg[1] + 0.004 * su]]);
      if (L < 110) {
        const kb: Pt = [sg[0] - 0.035 * su, sg[1] - 0.012 * su], ke: Pt = [sg[0] + 0.03 * su, sg[1] - 0.02 * su], kh = P(lW);
        hardFill(p, 24160, '#b8bcc0', [[kb[0], kb[1] - 0.006 * su], [ke[0], ke[1] - 0.004 * su], [ke[0], ke[1] + 0.004 * su], [kb[0], kb[1] + 0.008 * su]]);
        hardFill(p, 24161, '#5a3a22', [[kb[0], kb[1] - 0.008 * su], [kh[0], kh[1] - 0.01 * su], [kh[0], kh[1] + 0.01 * su], [kb[0], kb[1] + 0.009 * su]]);
      } else lW = [-4.22, 0.78, -5.0];
    }
    const rH = P(rW), lH = P(lW), hu = U(rW), ARM = mixColor(SKIN, '#ffb060', 0.1), ARM_SH = mixColor(SKIN, '#5a3a2a', 0.25);
    for (const [h, id, dx] of [[rH, 24170, 0.12], [lH, 24180, -0.12]] as const) {
      const s0: Pt = [dx > 0 ? 1140 : -60, h[1] + 0.42 * hu], s1: Pt = [h[0] + dx * hu * 0.2, h[1] + 0.05 * hu];
      const arm = strip([s0, s1], [0.075 * hu, 0.04 * hu]);
      hardFill(p, id, ARM, arm);
      hardFill(p, id + 2, ARM_SH, strip([[s0[0], s0[1] + 0.058 * hu], [s1[0], s1[1] + 0.028 * hu]], [0.018 * hu, 0.01 * hu]));
      inkLine(p, id + 3, arm, {weight: 0.7, color: '#8a5a3a', still: true});
      const e: Pt = [s0[0] + (s1[0] - s0[0]) * 0.14, s0[1] + (s1[1] - s0[1]) * 0.14];
      hardFill(p, id + 4, SLEEVE, strip([s0, e], [0.11 * hu, 0.095 * hu]));
    }
    mitten(p, 24190, rH, hu, -0.5);
    mitten(p, 24200, lH, hu, Math.PI + 0.4);
  }};
};
// ---------------------------------------------------------------- 19 the cup at his lips; the jug refills (plates 19a-19d); chip + both safety lines
const C19 = camMove([-4.5, 0.8, -4.4], [35, 28], [1.9, 1.7], 1, {f: 920, hy: 900, pitch: [-6, -6], ease: [0, 1]});
DEFS.SH19 = (L, g, par) => {
  const c = camOf(C19, frac('SH19', L)), t = g / FPS, Y: V3 = [-4.05, 0.46, -4.25], K: V3 = [-4.45, 0.46, -4.5];
  let mouth: Pt | undefined;
  return {paper: '#151a2a', children: <Vignette level={0.3} id="e18v19" />, overlay: <><RecipeCardAnim g={g} /><SafetyAnim g={g} /></>, paint: (p) => paintUnder(p, c, {t, extra: [
    jugItem(par.level ?? 1, [-3.75, 0.46, -4.75], 24400),
    {at: K, draw: (q, cc) => { const a = paintCast(q, cc, 'K', {at: K, view: 'right', pose: 'P33', face: 'tired', t, tint: tint(K), shadow: {op: 40}}); if (a) { const u = camUnit(cc, K); mouth = [a.head[0] + 0.09 * u, a.head[1] + 0.06 * u]; } }},
    {at: Y, bias: -0.05, draw: (q, cc) => {
      const u = camUnit(cc, Y), to: Pt | undefined = mouth ? [mouth[0] + 0.05 * u, mouth[1] + 0.07 * u] : undefined;
      const a = paintCast(q, cc, 'Y', {at: Y, view: 'left', pose: 'P34', face: 'worried', t, tint: tint(Y), fig: to ? {lArm: {to}, rArm: {to: [to[0] + 0.02 * u, to[1] + 0.02 * u]}} : {}});
      if (a) paintCupHeld(q, a.lHand, u);
    }},
  ]})};
};
// ---------------------------------------------------------------- 20-22 morning: SET-UNDER has no morning light, door or yard (asset gap N18-02): night geometry under a warm wash, a placeholder bright door opening and the yard hens
const doorYard = (hens: {at: V3; view: 'left' | 'right' | 'front'; peck?: number; cluck?: number}[], seed: number): Item => ({at: [-4, 0, 3], draw: (q, cc) => {
  wFill(q, cc, seed, '#e6efd2', qz(-1.2, -7.4, -1.4, 0, 2.0));
  wFill(q, cc, seed + 1, '#b8c9a0', qy(0.0, -7.4, -1.4, -1.2, 5));
  wFill(q, cc, seed + 2, '#8aa874', qz(2.0, -9, 1, 0, 1.4));
  for (const [i, h] of hens.entries()) paintHen(q, cc, h.at, {view: h.view, ...(h.peck !== undefined ? {peck: h.peck} : {}), ...(h.cluck !== undefined ? {cluck: h.cluck} : {})}, {amb: '#d6e2c8', k: 0.1}, seed + 100 + i * 100);
}});
const C20 = camMove([-4.5, 0.8, -4.4], [160, 150], [2.4, 2.1], 0.95, {f: 920, hy: 960, ease: [0, 1]});
DEFS.SH20 = (L, g) => {
  const c = camOf(C20, frac('SH20', L)), t = g / FPS, sw = 0.5 + 0.5 * Math.sin(g * 0.22);
  const peck = 0.5 + 0.5 * Math.sin(g * 0.3);
  return {paper: '#cfd6c0', children: <Vignette level={0.2} id="e18v20" />, overlay: <MorningWash k={ease(L / 15)} />, paint: (p) => paintUnder(p, c, {t, extra: [
    doorYard([{at: [-3.2, 0, 0.8], view: 'right', peck}, {at: [-4.6, 0, 1.4], view: 'left', peck: 1 - peck}], 45000),
    jugItem(1, [-3.75, 0.46, -4.75], 24400), slippersItem,
    kItem({at: [-4.45, 0.46, -4.5], spose: 'sip-lean', sdir: 1, face: L < 40 ? 'relieved' : 'happy', t}),
    yItem({at: [-4.05, 0.46, -4.25], view: 'front', face: 'happy', t, held: (q, a, u) => paintHeldProp(q, 'hand-fan', a.rHand, u, {swing: sw, seed: 45500})}),
  ]})};
};
const C21 = camMove([-4.42, 1.15, -7.85], [2, 0], [0.9, 0.6], 1.25, {f: 950, hy: 880, ease: [0, 1]});
DEFS.SH21 = (L, g) => {
  const c = camOf(C21, frac('SH21', L)), t = g / FPS;
  return {paper: '#cfd6c0', children: <Vignette level={0.2} id="e18v21" />, overlay: <MorningWash />, paint: (p) => paintUnder(p, c, {t, jarLight: 0.5})};
};
const C22 = camMove([-4.4, 0.8, -4.35], [40, 46], [2, 2.3], 1, {f: 920, hy: 960, ease: [0, 1]});
DEFS.SH22 = (L, g) => {
  const c = camOf(C22, frac('SH22', L)), t = g / FPS;
  return {paper: '#cfd6c0', children: <Vignette level={0.2} id="e18v22" />, overlay: <MorningWash />, paint: (p) => paintUnder(p, c, {t, extra: [
    jugItem(1, [-3.75, 0.46, -4.75], 24400),
    {at: [-3.3, 0, -3.0], draw: (q, cc) => paintHen(q, cc, [-3.3, 0, -3.0], {view: 'left', cluck: L < 18 ? clamp(Math.sin((L / 18) * Math.PI)) : 0}, {amb: '#d6e2c8', k: 0.1}, 46000)},
    kItem({at: [-4.45, 0.46, -4.5], spose: 'sip-lean', sdir: 1, face: 'happy', t}),
    yItem({at: [-4.05, 0.46, -4.25], view: 'left', face: 'happy', t, spose: 'cup-offer', sdir: -1, held: (q, a, u) => paintCupHeld(q, a.lHand, u)}),
  ]})};
};
void LIGHT; void paintSkyBands; void paintSorted; void cps; void cardAt; void kneelArm; void JUG; void K0; void Y0; void yItem; void kItem;

/** One painted frame of a shot: a pure function of the shot-local frame (`useCurrentFrame()` of the surrounding Freeze). */
export const ShotFrame = ({id, par = {}}: {id: string; par?: Par}) => {
  const L = useCurrentFrame(), g = shotStart(id) + L, d = DEFS[id](L, g, par);
  return <Painted paint={(p) => d.paint(p)} paper={d.paper} band={false} frame={g} overlay={d.overlay}>{d.children}</Painted>;
};

/** Plate IDs: `EDU18-SHnn`; the jug shots add `a`-`d` plates for their painted dissolves (levels in `JUG_LEVELS`). */
export const edu18PlateId = (id: string, v = '') => `EDU18-${id}${v}`;
export const JUG_LEVELS = {SH15: [1, 0.7, 0.45, 0.2], SH19: [0.2, 0.45, 0.7, 1]} as const;
export const edu18Plates = [
  ...SHOT_TABLE.filter(([id]) => !(id in JUG_LEVELS)).map(([id]) => ({plate: edu18PlateId(id), def: id, par: {} as Par, serves: [id]})),
  ...(['SH15', 'SH19'] as const).flatMap((id) => JUG_LEVELS[id].map((level, i) => ({plate: edu18PlateId(id, 'abcd'[i]), def: id as string, par: {level} as Par, serves: [id]}))),
];
