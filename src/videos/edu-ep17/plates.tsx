import type {CSSProperties, ReactNode} from 'react';
import {camMove, camOf, type CamMove} from '../../painted/kit/cam-moves';
import {STILL_CAMERA} from '../../painted/kit/camera';
import {hardFill, inkLine} from '../../painted/kit/draw';
import {paintFall} from '../../painted/kit/fall';
import {paintFigureAt} from '../../painted/kit/figure-at';
import {hash} from '../../painted/kit/hash';
import type {Painter} from '../../painted/kit/painter';
import {PEOPLE} from '../../painted/kit/people';
import type {Item} from '../../painted/kit/world';
import {camPoint, camUnit, type YCam} from '../../painted/kit/ycam';
import type {PaintedShot} from '../../painted/shot';
import {
  LIGHT, NIGHT_IN, RIVER_LIGHT, RUNOFF, dressIsan, groundPropItem, paintCast, paintFire, paintGreenSmoke, paintHen, paintHenMotion, paintHeldProp, paintLongNeck, paintMosquitoMacro,
  paintMozzieCloud, paintGroundProp, paintPotOnFire, paintRiver, paintRoofRunoff, paintSauropodSilhouette, paintSpino, paintVillage, spinoStride, cylinder, cardAt, fireFlicker,
  type Light, type V3, type VilOpts, type Who, type CastOpts,
} from '../../painted/survival';
import {RuleSign} from '../../painted/survival/screens';
import {Vignette} from '../../painted/survival/frame';
import {FPS, PILE_DISSOLVE_SEC, PILE_STEPS_SH12, SHOT_TABLE} from './clock';
import {paintCuppedWater, paintPhoneNoBars, paintWoodpile, woodpileItem} from './props17';

// EDU-EP17-SHORT plates (Editor, 14 Nov 2026; sheet EDU-EP17-SHEET-R1.2). One plate per shot, ID `EDU17-<shot id>`; each is a pure function of its shot-local frame
// (`f = round(tl * 30)`), so Studio, random seek and the scene render draw the same picture. Staging is authored from the sheet's per-shot lines with the
// survival module's painters (no shared module is edited). Ambient clocks (fire, hens, fronds, water, mosquitoes) run on the GLOBAL second `s.t`.
import {edu17PlateId} from './plate-ids';
export {edu17PlateId};
type S = {c: YCam; f: number; g: number; t: number; u: number; len: number};
type Draw = (p: Painter, s: S) => void;
type Def = {id: string; cam: CamMove; paper: string; vig?: number; draw: Draw; ov?: (f: number, len: number) => ReactNode};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sm = (x: number) => { const k = clamp(x); return k * k * (3 - 2 * k); };
const ramp = (f: number, a: number, b: number) => sm((f - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const E: [number, number] = [0, 1];

const MORN = LIGHT.morning;
const RAIN_L: Light = {amb: '#9aa8ae', k: 0.3};
const EVE_L: Light = {amb: '#e8b890', k: 0.3};
const DARK: Light = {amb: '#080a12', k: 0.86};
const NIGHT_TINT = {to: '#12121e', u: 0.55};
const FIRE: V3 = [-1, 0, 1.5];
const PILE: V3 = [-8.9, 0, -6.2];

const person = (who: Who, at: V3, t: number, o: Omit<CastOpts, 'at' | 't'>): Item => ({at, draw: (q, cc) => { paintCast(q, cc, who, {at, t, ...o}); }});
const WOMAN = dressIsan(PEOPLE['woman-curly'], 'isan-home-woman'), MAN = dressIsan(PEOPLE['man-elder'], 'isan-home-man'), MAN2 = dressIsan(PEOPLE['man-crop'], 'isan-home-man');
const extra = (def: typeof WOMAN, at: V3, t: number, o: Omit<CastOpts, 'at' | 't'>): Item => ({at, draw: (q, cc) => { paintFigureAt(q, cc, def, {at, t, ...o} as never); }});
const hen = (at: V3, view: 'right' | 'left' | 'front' | 'back', id: Parameters<typeof paintHenMotion>[4], t: number, seed: number, L: Light = MORN, phase = 0): Item =>
  ({at, draw: (q, cc) => { paintHenMotion(q, cc, at, view, id, t, L, seed, {phase}); }});
const fire = (t: number, at: V3 = FIRE): Item => ({at, draw: (q, cc) => paintFire(q, cc, at, t)});
const vil = (p: Painter, s: S, o: Partial<VilOpts> = {}) => paintVillage(p, s.c, {mode: 'morning', t: s.t, ...o});
/** Walk phase in cycles for a figure that moved `d` metres (a 1.0 m stride pair). */
const cyc = (d: number, stride = 1.0) => d / stride;
const lens = (c: YCam, v: V3) => { const g = camPoint(c, v); return g ? {g, u: camUnit(c, v)} : null; };

// ------------------------------------------------------------------------------------------------------------------ overlays
const WHITE = (a: number): ReactNode => a > 0 ? <div style={{position: 'absolute', inset: 0, background: '#ffffff', opacity: a}} /> : null;
/** Rule sign (VD17-01, slot RC x 760-1020, y 180-290): pops in over 6 f with a 2 deg wobble, out over 8 f at the end of the range. */
const signOv = (text: string, size = 64) => (f: number, len: number): ReactNode => {
  const inK = clamp(f / 6), out = clamp((len - 1 - f) / 8), k = Math.min(inK < 1 ? inK * 1.12 : 1 + 0.12 * (1 - clamp((f - 6) / 4)), 0.4 + 0.6 * out);
  const rot = (f < 14 ? 2 * Math.sin(f * 1.1) * (1 - f / 14) : 0);
  const wrap: CSSProperties = {position: 'absolute', left: 760, top: 180, width: 260, height: 110, transform: `scale(${Math.max(0, k)}) rotate(${rot}deg)`, transformOrigin: '50% 50%', opacity: out};
  return <div style={wrap}><div style={{transform: 'scale(0.7)', transformOrigin: 'top left', width: 371}}><RuleSign lines={[text]} left={0} top={0} width={371} size={size} /></div></div>;
};
const flashIn = (n: number) => (f: number) => WHITE(1 - f / n);
const flashOut = (from: number, to: number) => (f: number) => WHITE(clamp((f - from) / (to - from)));

// ------------------------------------------------------------------------------------------------------------------ shots
const CAM1 = camMove([-1, 2, -6], [35, 32], [22, 20.5], 1.6, {f: 760, hy: 880, ease: E});
const CAM2 = camMove([[-1, 2, -6], [-5, 1.8, -6]], [32, 26], [20.5, 16], [1.6, 1.5], {f: 760, hy: 880, ease: E});
const CAM3 = camMove([-3.1, 1.5, -3.0], [0, 6], [0.55, 0.5], 1.6, {f: 1000, hy: 900, ease: E});
const CAM4 = camMove([0.55, 1.5, 0.45], [30, 30], [0.9, 0.8], 1, {f: 1000, hy: 1100, pitch: [30, 30], near: 0.05, ease: E});
const CAM5 = camMove([-8, 1.5, -5], [30, 22], [7, 6], 1.1, {f: 820, hy: 880, pitch: [10, 10], ease: E});
const CAM6 = camMove([-5.6, 1, -1.2], [40, 48], [2.4, 2.1], 1, {f: 900, hy: 960, pitch: [6, 6], ease: E});
const CAM7 = camMove([-2, 0.45, -0.5], [30, 38], [1.3, 1.1], 0.9, {f: 950, hy: 900, pitch: [-15, -15], ease: E});
const CAM8 = camMove([-8.9, 0.7, -6.2], [10, 20], [2, 1.6], 1, {f: 950, hy: 940, ease: E});
const CAM9 = camMove([0.4, 0.6, 0.3], [160, 170], [2.2, 1.9], 0.55, {f: 900, hy: 1000, pitch: [8, 8], ease: E});
const CAM10 = camMove([0.4, 0.7, 0.3], [175, 168], [1, 0.9], 0.75, {f: 1000, hy: 900, ease: E});
const CAM11 = camMove([0.4, 0.7, 0.3], [175, 168], [0.9, 0.5], 0.75, {f: 1000, hy: 900, ease: E});
const CAM12 = camMove([[2, 1, 3], [-6, 1, -4.5]], [30, 25], [5, 7.5], 1.5, {f: 820, hy: 920, ease: [0.25, 0.9]});
const CAM13 = camMove([-6.5, 1.2, -4], [15, 8], [6, 5.2], 1.3, {f: 820, hy: 840, ease: E});
const CAM14 = camMove([-4, 0.4, -3.4], [40, 48], [1.6, 1.4], 0.7, {f: 950, hy: 820, ease: E});
const CAM15 = camMove([-5.5, 1, -2.4], [10, 0], [2.8, 2.5], 1.1, {f: 920, hy: 860, ease: E});
const CAM16 = camMove([0.8, 1, 1], [200, 192], [3.4, 2.8], 1, {f: 880, hy: 960, ease: E});
const CAM17 = camMove([-1.5, 0.62, 1], [80, 72], [0.06, 0.05], 0.63, {f: 1000, hy: 960, near: 0.02, ease: E});
const CAM18 = camMove([-1, 1.2, 1.5], [-30, -40], [4, 3.4], 1.3, {f: 850, hy: 860, ease: E});
const CAM19 = camMove([-1.5, 1, 2], [-10, -4], [1.8, 1.6], 1.1, {f: 950, hy: 920, ease: E});
const CAM20 = camMove([0.5, 1.5, -2], [30, 22], [9, 8], 1.2, {f: 820, hy: 960, pitch: [8, 8], ease: E});
const CAM21 = camMove([1.2, 1.8, 3.0], [-74, -68], [5.2, 4.8], 0.5, {f: 820, hy: 780, cx: 110, pitch: [16, 16], ease: E});
const CAM22 = camMove([-1.8, 0, 5.2], [181, 179], 7.8, 3.3, {f: 820, hy: 720, pitch: [-8, -8], ease: E});
const CAM23 = camMove([2, 1, 2], [-80, -84], [5, 5.6], 1, {f: 850, hy: 760, ease: E});
export const SPINO21 = {O: [-0.2, 1.95] as [number, number], b: [0.94, 0.342] as [number, number]};
export const SPINO22 = {O: [5.4, 8.0] as [number, number], b: [-0.985, -0.17] as [number, number], v: 2.0};
export const SPINO23 = {O: [14.25, -4.33] as [number, number], b: [-0.866, 0.5] as [number, number], v: 2.0};
const STRIDE = 2.6;
/** Animal on foot: the snout-tip origin after `f` frames at `v` m/s along -b (toward its head), and the stride phase (one cycle per S/0.6 m, the probe's rule). */
export const spinoWalk = (sp: {O: [number, number]; b: [number, number]; v: number}, f: number, f0: number) => {
  const d = ((f - f0) / FPS) * sp.v;
  return {O: [sp.O[0] - d * sp.b[0], sp.O[1] - d * sp.b[1]] as [number, number], ph: (((f / FPS) * sp.v * 0.6) / STRIDE) % 1 + 0};
};

const woodAt = (s: S, over: {level?: number; dry?: boolean; tarp?: number; leaves?: boolean; L?: Light} = {}): Item => woodpileItem(PILE, {dry: true, ...over});

const SHOTS: Def[] = [
  // ------------------------------------------------------------ B01 hook
  {id: 'S01-B01-SH01', cam: CAM1, paper: '#0f1530', vig: 0.35, ov: flashOut(84, 91), draw: (p, s) => vil(p, s, {mode: 'night', ripple: {speed: 1.6, glow: 0.55}, extra: [woodAt(s, {L: LIGHT.night})]})},
  {id: 'S01-B01-SH02', cam: CAM2, paper: '#cfdcc4', vig: 0.2, ov: flashIn(6), draw: (p, s) => vil(p, s, {extra: [
    woodAt(s),
    hen([-7.2, 0, -4.6], 'right', 'peck', s.t, 16000), hen([-5.6, 0, -3.8], 'left', 'idle', s.t, 16200),
    extra(WOMAN, [-0.5, 0, -1.8], s.t, {facing: [1, 0.2], pose: 'P01', face: 'neutral', fig: {walk: cyc(s.f * 0.04), stride: 1}}),
    extra(MAN, [3.4, 0, 1.2], s.t, {facing: [-1, 0.3], pose: 'P01', face: 'neutral', fig: {walk: cyc(s.f * 0.045), stride: 1}}),
  ]})},
  {id: 'S01-B01-SH03', cam: CAM3, paper: '#cfdcc4', vig: 0.2, draw: (p, s) => {
    vil(p, s, {extra: [
      {at: [-3.1, 0, -3.14], draw: (q, cc) => { cylinder(q, cc, 74000, [-3.1, 0, -3.14], 0.13, 2.4, '#8a6446', {ink: '#3a2a1c'}); }},
      {at: [-3.1, 1.55, -3.0], bias: -3, draw: (q, cc) => {
        const n: V3 = [-3.1, 1.59, -2.99];
        paintGroundProp(q, 'necklace-nail', cc, n, {seed: 74200});
        const k = clamp((s.f - 2) / 10), gp = camPoint(cc, [n[0] + 0.02, n[1] - 0.04 - 0.14 * Math.sin(k * 3.14) , n[2]]), gu = camUnit(cc, n);
        if (gp && k > 0 && k < 1) { hardFill(q, 74300, '#fff6c8', Array.from({length: 8}, (_, i): [number, number] => { const a = (i / 8) * 6.283, r = (i % 2 ? 0.012 : 0.034) * gu; return [gp[0] + r * Math.cos(a), gp[1] + r * Math.sin(a)]; })); }
      }},
    ]});
  }},
  {id: 'S01-B01-SH04', cam: CAM4, paper: '#cfdcc4', vig: 0.2, draw: (p, s) => {
    const wob = Math.sin(clamp((s.f - 4) / 22) * 6.283 * 2) * 0.16 * (s.f >= 4 && s.f <= 26 ? 1 : 0);
    vil(p, s, {extra: [
      person('K', [0.3, 0, -0.1], s.t, {facing: [0.5, 1], pose: 'P07', face: 'worried', held: (q, a, u) => paintPhoneNoBars(q, a.rHand, u, {sway: wob})})]});
  }},
  {id: 'S01-B01-SH05', cam: CAM5, paper: '#cfdcc4', vig: 0.2, draw: (p, s) => {
    const k = clamp((s.f - 6) / 46), P0: V3 = [-1.8, 0, -3.0], P1: V3 = [-5.6, 0, -1.2], at = lerp3(P0, P1, sm(k)), walking = k > 0 && k < 1;
    const eb = clamp((s.f - 56) / 10);
    vil(p, s, {extra: [
      woodAt(s),
      hen([-8.0, 0, -5.4], 'right', 'peck', s.t, 16000, MORN, 0.1), hen([-7.1, 0, -5.0], 'left', 'peck', s.t, 16200, MORN, 0.5), hen([-9.9, 0, -5.5], 'front', 'idle', s.t, 16400),
      person('K', at, s.t, {facing: [P1[0] - P0[0], P1[2] - P0[2]], pose: s.f < 50 ? 'P01' : 'P10', face: s.f > 56 ? 'smug' : 'neutral', fig: walking ? {walk: cyc(s.f * 0.052), stride: 1} : {},
        faceState: s.f > 56 ? {browR: -0.2 * eb} as never : undefined, held: s.f > 50 ? (q, a, u) => paintPhoneNoBars(q, a.rHand, u, {sway: 0}) : undefined}),
    ]});
  }},
  // ------------------------------------------------------------ B02 dry wood
  {id: 'S01-B02-SH06', cam: CAM6, paper: '#cfdcc4', vig: 0.2, draw: (p, s) => {
    const turn = s.f < 3 ? 'front' : s.f < 7 ? 'right' : 'back';
    const out = ramp(s.f, 8, 20);
    vil(p, s, {extra: [person('K', [-5.6, 0, -1.2], s.t, {view: turn, pose: s.f < 7 ? 'P10' : 'P05', face: 'happy', fig: s.f >= 7 && out < 1 ? {} : {},
      held: s.f < 7 ? (q, a, u) => paintPhoneNoBars(q, a.rHand, u) : (q, a, u) => paintHeldProp(q, 'matches', [a.lHand[0], a.lHand[1]], 0.01, {})})]});
  }},
  {id: 'S01-B02-SH07', cam: CAM7, paper: '#cfdcc4', vig: 0.2, draw: (p, s) => {
    const strike = ramp(s.f, 0, 6), after = ramp(s.f, 8, 20), lift = ramp(s.f, 22, 36);
    const hand = (k: number): V3 => lerp3([-2.25, 1.6, -0.6], [-2.02, 1.2, -0.5], k);
    const items: Item[] = [groundPropItem('chop-block', [-2, 0, -0.5], {seed: 74500})];
    if (s.f < 7) items.push({at: [-2, 0.42, -0.5], bias: -0.3, draw: (q, cc) => { cylinder(q, cc, 74600, [-2, 0.42, -0.5], 0.1, 0.3, '#a8845a', {ink: '#3a2a1c'}); }});
    else for (const sd of [-1, 1] as const) items.push({at: [-2 + sd * 0.1 * (0.4 + after), 0.42 + 0.05 * after, -0.5], bias: -0.3, draw: (q, cc) => {
      const g = camPoint(cc, [-2 + sd * (0.06 + 0.2 * after), 0.42 + 0.02 - 0.06 * after * after, -0.5]);
      if (g) paintGroundProp(q, 'log-wet', cc, [-2 + sd * (0.1 + 0.2 * after), 0.42 + (1 - after) * 0.0, -0.5], {s: sd, ang: sd * 0.5 * after, seed: 74700 + sd * 20});
    }});
    items.push({at: [-2, 1.2, -0.45], bias: -1, draw: (q, cc) => {
      const k = s.f < 7 ? strike : 1 - lift, h = camPoint(cc, hand(k)), u = camUnit(cc, hand(k));
      if (!h) return;
      const a = lerp(-0.55, Math.PI - 0.1, k);
      paintHeldProp(q, 'axe', h, u, {ang: a, s: k > 0.5 ? -1 : 1, seed: 74800});
      for (const dx of [-0.02, 0.07]) hardFill(q, 74900 + Math.round(dx * 100), '#b98a5e', Array.from({length: 10}, (_, i): [number, number] => [h[0] + dx * u + 0.05 * u * Math.cos((i / 10) * 6.283), h[1] + 0.04 * u * Math.sin((i / 10) * 6.283)]));
    }});
    vil(p, s, {extra: items});
  }},
  {id: 'S01-B02-SH08', cam: CAM8, paper: '#cfdcc4', vig: 0.2, draw: (p, s) => {
    const pull = ramp(s.f, 16, 36), tap = s.f >= 38 && s.f < 46;
    vil(p, s, {extra: [woodAt(s), person('Y', [-7.7, 0, -5.3], s.t, {facing: [-0.6, 1], pose: pull > 0 ? 'P11' : 'P01', face: 'smug',
      held: (q, a, u) => { paintHeldProp(q, 'log-dry', [a.rHand[0], a.rHand[1]], u, {ang: lerp(1.2, 0.2, pull), seed: 75000});
        if (tap) for (let i = 0; i < 3; i++) inkLine(q, 75100 + i, [[a.rHand[0] - 20 - i * 14, a.rHand[1] - 30 + i * 12], [a.rHand[0] - 44 - i * 18, a.rHand[1] - 34 + i * 22]], {closed: false, weight: 0.7, color: '#3a2a1c', still: true}); }})]});
  }},
  // ------------------------------------------------------------ B03 rule 1
  {id: 'S01-B03-SH09', cam: CAM9, paper: '#cfdcc4', vig: 0.2, ov: signOv('ข้อ 1'), draw: (p, s) => {
    const cup = ramp(s.f, 8, 20), wrist = ramp(s.f, 34, 42), point = ramp(s.f, 64, 74);
    paintRiver(p, s.c, {mode: 'day', t: s.t, extra: [
      person('K', [0.4, 0, 0.3], s.t, {facing: [0, -1], pose: 'P19', face: wrist > 0.5 ? 'worried' : 'happy', fig: {kneel: 1}}),
      person('Y', [1.1, 0, 0.9], s.t, {facing: [-0.5, -0.8], pose: wrist > 0.3 ? 'P05' : 'P01', face: 'suspicious'}),
      {at: [-3, 0, 2.2], draw: (q, cc) => paintPotOnFire(q, cc, [-3, 0, 2.2], s.t, {seed: 76000})},
    ]});
    void cup; void point;
  }},
  {id: 'S01-B03-SH10', cam: CAM10, paper: '#cfdcc4', vig: 0.2, draw: (p, s) => {
    paintRiver(p, s.c, {mode: 'day', t: s.t, extra: [person('K', [0.4, 0, 0.3], s.t, {facing: [0, -1], pose: 'P34', face: 'smug', fig: {kneel: 1},
      held: (q, a, u) => paintCuppedWater(q, [a.head[0], a.chin + 0.16 * u], u * 0.9, {seed: 76100, drip: s.f >= 60 ? (s.f - 60) / 14 : -1})})]});
  }},
  {id: 'S01-B03-SH11', cam: CAM11, paper: '#cfdcc4', vig: 0.2, draw: (p, s) => {
    paintRiver(p, s.c, {mode: 'day', t: s.t, extra: [person('K', [0.4, 0, 0.3], s.t, {facing: [0, -1], pose: 'P34', face: 'smug', fig: {kneel: 1},
      held: (q, a, u) => paintCuppedWater(q, [a.head[0], a.chin + 0.16 * u], u * 0.9, {seed: 76100, fill: 1})})]});
  }},
  {id: 'S01-B03-SH12', cam: CAM12, paper: '#cfdcc4', vig: 0.2, draw: (p, s) => draw12(p, s, 1)},
  // ------------------------------------------------------------ B04 rule 2
  {id: 'S01-B04-SH13', cam: CAM13, paper: '#9aa8ae', vig: 0.25, draw: (p, s) => {
    const tarp = ramp(s.f, 10, 30), fill = 0.15 + 0.5 * ramp(s.f, 40, 50), logs = s.f < 32;
    vil(p, s, {light: RAIN_L, extra: [
      woodpileItem(PILE, {dry: true, tarp, leaves: true, L: RAIN_L}),
      groundPropItem('bucket', RUNOFF.land, {level: s.f >= 40 ? fill : 0, seed: 93000}),
      extra(MAN, [-8.3, 0, -4.6], s.t, {facing: [-0.6, -1], pose: 'P16', face: 'worried', tint: {to: '#8a9aa4', u: 0.25}, fig: {walk: cyc(s.f * 0.05)}}),
      person('K', [lerp(-4.4, -5.3, ramp(s.f, 0, 30)), 0, 0.2], s.t, {facing: [-1, -0.2], pose: logs ? 'P26' : 'P01', face: 'worried', tint: {to: '#8a9aa4', u: 0.25},
        held: logs ? (q, a, u) => { for (let i = 0; i < 3; i++) paintHeldProp(q, 'log-dry', [a.rHand[0] - 10 + i * 8, a.rHand[1] - 20 - i * 14], u, {ang: 1.45, seed: 77000 + i * 9}); } : undefined}),
      {at: [-6.5, 0, 0.4], draw: (q, cc) => paintRoofRunoff(q, cc, {t: s.t, landAt: [RUNOFF.land[0], 0.3, RUNOFF.land[2]]})},
    ]});
    paintFall(p, 'rain', {width: 1080, height: 1920, t: s.t, seed: 3, style: {count: 170}});
  }},
  {id: 'S01-B04-SH14', cam: CAM14, paper: '#9aa8ae', vig: 0.25, ov: signOv('ข้อ 2'), draw: (p, s) => {
    const strikes = [26, 68, 100], act = strikes.findIndex((f) => s.f >= f && s.f < f + 14);
    const smoke = (f0: number, a: number): Item => ({at: [-3.5, 0.2, -3.6], bias: 3, draw: (q, cc) => {
      const g = camPoint(cc, [-3.6, 0.12, -3.5]), u = camUnit(cc, [-3.6, 0.12, -3.5]);
      if (!g || s.f < f0) return;
      const k = clamp((s.f - f0) / 26);
      for (let i = 0; i < 4; i++) hardFill(q, 78100 + i + f0, '#d8d8d4', Array.from({length: 8}, (_, j): [number, number] => [g[0] + (i - 1.5) * 8 + 0.08 * u * Math.sin(k * 5 + i) + 0.05 * u * Math.cos((j / 8) * 6.28), g[1] - k * (0.5 + 0.15 * i) * u + 0.04 * u * Math.sin((j / 8) * 6.28)]));
      void a;
    }});
    vil(p, s, {light: RAIN_L, extra: [
      {at: [-3.6, 0, -3.5], draw: (q, cc) => { cylinder(q, cc, 78000, [-3.6, 0, -3.5], 0.11, 0.2, '#4a3a2a', {top: '#6a5a46', ink: '#2a1e14'}); }},
      person('V', [-4.15, 0, -3.4], s.t, {facing: [1, 0.5], pose: 'P35', face: 'worried', tint: {to: '#8a9aa4', u: 0.15},
        held: (q, a, u) => { paintHeldProp(q, 'matches', a.rHand, u, {seed: 78200});
          if (act >= 0) { const k = (s.f - strikes[act]) / 14, g = [a.rHand[0] + 0.1 * u, a.rHand[1] - 0.05 * u] as [number, number];
            hardFill(q, 78300, '#ffd27a', Array.from({length: 8}, (_, i): [number, number] => [g[0] + 0.02 * u * Math.cos((i / 8) * 6.28) * (1 - k), g[1] - (0.02 + (i % 2 ? 0.05 : 0.02) * (1 - k)) * u + 0.02 * u * Math.sin((i / 8) * 6.28)])); } }}),
      smoke(strikes[0] + 6, 1), smoke(strikes[1] + 6, 1), smoke(strikes[2] + 6, 1),
    ]});
  }},
  {id: 'S01-B04-SH15', cam: CAM15, paper: '#9aa8ae', vig: 0.25, draw: (p, s) => {
    const sad = ramp(s.f, 56, 64), pointPile = s.f >= 50;
    vil(p, s, {light: RAIN_L, extra: [
      woodpileItem(PILE, {dry: true, tarp: 1, leaves: true, L: RAIN_L}),
      groundPropItem('pot-big', [-3.6, 0, -3.4], {seed: 79000}),
      person('K', [-6.2, 0, -2.4], s.t, {facing: [0.3, 1], pose: 'P26', face: sad > 0.5 ? 'sad' : 'happy', tint: {to: '#8a9aa4', u: 0.2},
        held: (q, a, u) => paintHeldProp(q, 'bucket', [(a.rHand[0] + a.lHand[0]) / 2, (a.rHand[1] + a.lHand[1]) / 2 + 0.05 * u], u, {level: 1, seed: 79100})}),
      person('Y', [-4.6, 0, -2.2], s.t, {facing: [-0.4, 1], pose: s.f >= 20 ? 'P05' : 'P01', face: 'suspicious', tint: {to: '#8a9aa4', u: 0.2}, fig: pointPile ? {} : {}}),
      {at: [-5.4, 0, -0.6], draw: (q, cc) => paintRoofRunoff(q, cc, {t: s.t, flow: 0.1, landAt: [RUNOFF.land[0], 0.2, RUNOFF.land[2]]})},
    ]});
  }},
  // ------------------------------------------------------------ B05 rule 3 (dusk)
  {id: 'S01-B05-SH16', cam: CAM16, paper: '#e8c0a0', vig: 0.2, draw: (p, s) => {
    const slap = s.f >= 41 ? 'rub-hand' : undefined;
    paintRiver(p, s.c, {mode: 'dusk', t: s.t, extra: [person('K', [1.0, 0, 1.2], s.t, {facing: [-0.3, -1], ...(slap ? {spose: 'rub-hand' as const, sph: (s.f - 41) / 20, face: 'ouch' as const} : {pose: 'P01', face: 'worried' as const}), tint: {to: '#e8a070', u: 0.12}})]});
    paintMozzieCloud(p, s.c, {at: [0.3, 1.25, -0.4], toward: [0.95, 1.2, 1.0], drift: ramp(s.f, 0, 34) * (s.f > 41 ? 1 - 0.4 * ramp(s.f, 41, 60) : 1), t: s.t, n: 54, radius: 0.6});
  }},
  {id: 'S01-B05-SH17', cam: CAM17, paper: '#e8c0a0', vig: 0.15, draw: (p, s) => {
    paintRiver(p, s.c, {mode: 'dusk', t: s.t});
    // far long-neck, out of focus (N17-03 stand-in: the shared silhouette layer, hazed; asset need reported)
    const up = ramp(s.f, 40, 70);
    paintSauropodSilhouette(p, lerp(514, 373, ramp(s.f, 0, 76)), 979, 266, '#8a8a86', 79500, 1, lerp(0.15, 1, up));
    hardFill(p, 79600, '#e8c0a0', [[0, 700], [1080, 700], [1080, 990], [0, 990]]);
    paintMosquitoMacro(p, s.c, [-1.5, 0.62, 1.0], {t: s.t, s: -1});
  }},
  {id: 'S01-B05-SH18', cam: CAM18, paper: '#cfdcc4', vig: 0.25, ov: signOv('ข้อ 3'), draw: (p, s) => {
    const amount = ramp(s.f, 28, 53), thin = ramp(s.f, 88, 120) * 0.85;
    vil(p, s, {light: EVE_L, extra: [fire(s.t, FIRE),
      person('Y', [-1.6, 0, 2.2], s.t, {facing: [1, -0.3], pose: 'P34', face: 'happy', held: (q, a, u) => paintHeldProp(q, 'green-leaves', a.rHand, u, {ang: s.f >= 28 ? 1.0 : 0.2, seed: 80000})})]});
    paintGreenSmoke(p, s.c, FIRE, s.t, {amount});
    paintMozzieCloud(p, s.c, {at: [1.8, 2.0, 1.0], t: s.t, n: 46, radius: 0.7, thin, color: '#2a2622'});
  }},
  {id: 'S01-B05-SH19', cam: CAM19, paper: '#cfdcc4', vig: 0.25, draw: (p, s) => {
    const k = ramp(s.f, 30, 42);
    vil(p, s, {light: EVE_L, extra: [fire(s.t, FIRE), person('Y', [-1.7, 0, 2.0], s.t, {facing: [1, -0.4], pose: 'P11', face: 'tired',
      held: (q, a, u) => { if (s.f < 42) paintHeldProp(q, 'log-dry', [a.rHand[0] + 0.15 * u * k, a.rHand[1] - 0.05 * u], u, {ang: lerp(1.3, 0.1, k), seed: 81000}); }})]});
    if (s.f >= 40) for (let i = 0; i < 14; i++) {
      const lp = lens(s.c, [FIRE[0], 0.4, FIRE[2]]), a = clamp((s.f - 40 - hash(i) * 6) / 30);
      if (lp && a > 0 && a < 1) hardFill(p, 81100 + i, '#ffc860', Array.from({length: 6}, (_, j): [number, number] => [lp.g[0] + (hash(i + 5) - 0.5) * 0.7 * lp.u * a + 3 * Math.cos((j / 6) * 6.28), lp.g[1] - a * (0.5 + hash(i + 9)) * lp.u + 3 * Math.sin((j / 6) * 6.28)]));
    }
  }},
  // ------------------------------------------------------------ B06 night
  {id: 'S01-B06-SH20', cam: CAM20, paper: '#0f1530', vig: 0.35, ov: signOv('ข้อสุดท้าย', 56), draw: (p, s) => {
    const huddle = ramp(s.f, 10, 20);
    const tint = NIGHT_TINT;
    vil(p, s, {mode: 'night', extra: [fire(s.t, FIRE),
      person('Y', [-1.4, 2.4, -5.5], s.t, {view: 'front', pose: 'P34', face: 'worried', tint}),
      person('K', [-1.0, 2.4, -5.3], s.t, {view: 'front', pose: 'P34', face: 'worried', tint}),
      hen([3.3, 0, -4.4], 'front', huddle > 0.5 ? 'huddle' : 'cluck', s.t, 16000, LIGHT.night), hen([3.9, 0, -4.2], 'front', huddle > 0.5 ? 'huddle' : 'peck', s.t, 16200, LIGHT.night),
      hen([4.5, 0, -4.4], 'front', huddle > 0.5 ? 'huddle' : 'cluck', s.t, 16400, LIGHT.night)]});
  }},
  {id: 'S01-B06-SH21', cam: CAM21, paper: '#080a12', vig: 0.3, draw: (p, s) => {
    const sniff = (f: number) => 0.06 * Math.max(0, Math.sin(clamp((s.f - f) / 7) * 3.14));
    vil(p, s, {mode: 'night', light: DARK, extra: [{at: [SPINO21.O[0] + 6 * SPINO21.b[0], 0, SPINO21.O[1] + 6 * SPINO21.b[1]], draw: (q, cc) => { paintSpino(q, cc, {...SPINO21, fire: FIRE, t: s.t, amb: 0.55, reach: 8, pose: {head: sniff(28) + sniff(38)}}); }}]});
    paintFire(p, s.c, FIRE, s.t);
  }},
  {id: 'S01-B06-SH22', cam: CAM22, paper: '#080a12', vig: 0.3, draw: (p, s) => {
    const w = spinoWalk(SPINO22, s.f, 25), Yp: V3 = [-2.45, 2.4, -1.35], Kp: V3 = [-1.2, 2.4, -1.3];
    vil(p, s, {mode: 'night', light: DARK, extra: [
      {at: [-0.5, 0, 7.0], draw: (q, cc) => { paintSpino(q, cc, {O: w.O, b: SPINO22.b, fire: FIRE, t: s.t, amb: 0.55, reach: 8, pose: {...spinoStride(w.ph, STRIDE), head: 0.6}}); }},
      fire(s.t, FIRE)]});
    paintCast(p, s.c, 'K', {at: Kp, view: 'back', pose: 'P34', face: 'scared', t: s.t, tint: {to: '#12121e', u: 0.72}});
    paintCast(p, s.c, 'Y', {at: Yp, view: 'back', pose: 'P34', face: 'worried', t: s.t, tint: {to: '#12121e', u: 0.72}});
    // Y's hand over K's mouth (the look still had none): a skin-coloured hand and forearm from Y's near shoulder to K's face
    const yg = lens(s.c, [Yp[0] + 0.1, Yp[1] + 0.95, Yp[2]]), kg = lens(s.c, [Kp[0] - 0.02, Kp[1] + 0.72, Kp[2]]);
    if (yg && kg) { inkLine(p, 82000, [yg.g, [(yg.g[0] + kg.g[0]) / 2, yg.g[1] + 14], kg.g], {closed: false, weight: 2.4, color: '#2a1e20', still: true});
      hardFill(p, 82001, '#6a4a3a', Array.from({length: 10}, (_, i): [number, number] => [kg.g[0] + 0.05 * kg.u * Math.cos((i / 10) * 6.28), kg.g[1] + 0.04 * kg.u * Math.sin((i / 10) * 6.28)])); }
  }},
  {id: 'S01-B06-SH23', cam: CAM23, paper: '#080a12', vig: 0.3, draw: (p, s) => {
    const w = spinoWalk(SPINO23, s.f, 0);
    vil(p, s, {mode: 'night', light: DARK, extra: [{at: [w.O[0] + 6 * SPINO23.b[0], 0, w.O[1] + 6 * SPINO23.b[1]], draw: (q, cc) => { paintSpino(q, cc, {O: w.O, b: SPINO23.b, fire: FIRE, t: s.t, amb: 0.55, reach: 8, pose: {...spinoStride(w.ph, STRIDE), head: 0.7}}); }}]});
    paintFire(p, s.c, FIRE, s.t);
  }},
];


/** Shot 12 at pile `level`: four temple-fair pots steaming in a row, villagers queueing with buckets, the lens trucking west to the woodpile. */
function draw12(p: Painter, s: S, level: number) {
  const items: Item[] = [0.6, 2.4, 4.2, 6.0].map((x, i) => ({at: [x, 0, 3] as V3, draw: (q: Painter, cc: YCam) => paintPotOnFire(q, cc, [x, 0, 3], s.t + i * 0.2, {seed: 51000 + i * 1000})}));
  const qx = [1.2, 2.3, 3.4, 4.5];
  qx.forEach((x, i) => items.push(extra(i % 2 ? MAN2 : WOMAN, [x, 0, 4.8 + 0.1 * i], s.t, {facing: [0, -1], pose: 'P26', face: 'neutral', held: (q, a, u) => paintHeldProp(q, 'bucket', [(a.rHand[0] + a.lHand[0]) / 2, (a.rHand[1] + a.lHand[1]) / 2], u, {level: 0.3, seed: 83000 + i * 40})})));
  items.push(woodpileItem(PILE, {dry: true, level}));
  vil(p, s, {extra: items});
}

const shotIndex = (id: string) => SHOT_TABLE.findIndex(([x]) => x === id);
const plate = (d: Def, idOverride?: string, paintOverride?: Draw): PaintedShot => {
  const [, start, len] = SHOT_TABLE[shotIndex(d.id)];
  const id = idOverride ?? edu17PlateId(d.id), vig = d.vig ?? 0.2;
  const state = (tl: number): S => {
    const f = clamp(Math.round(tl * FPS), 0, len + 400), fc = Math.min(f, len - 1), u = len > 1 ? fc / (len - 1) : 0;
    return {c: camOf(d.cam, u), f: fc, g: start + fc, t: (start + fc) / FPS, u, len};
  };
  return {
    id, serves: [d.id], paper: d.paper, camera: () => STILL_CAMERA,
    paint: (p, {tl}) => (paintOverride ?? d.draw)(p, state(tl)),
    Overlay: ({tl, opacity}) => (
      <div style={{position: 'absolute', inset: 0, opacity}}>
        <Vignette level={vig} id={`v-${id}`} color={d.paper === '#080a12' || d.paper === '#0f1530' ? '#05070d' : '#0f1216'} />
        {d.ov?.(state(tl).f, len)}
      </div>
    ),
  };
};

/** Shot 12's plates: the shrink states share one drawing and differ by the pile level (cues dissolve between them). */
export const SH12_PLATES = PILE_STEPS_SH12.map(([, level], i) => edu17PlateId(`S01-B03-SH12${i ? '-' + 'bcd'[i - 1] : ''}`).replace('SH12', 'SH12'));
export const edu17Shots: PaintedShot[] = [
  ...SHOTS.map((d) => plate(d)),
  ...PILE_STEPS_SH12.slice(1).map(([, level], i) => plate(SHOTS[shotIndex('S01-B03-SH12')], SH12_PLATES[i + 1], (p, s) => draw12(p, s, level))),
];
export {PILE_DISSOLVE_SEC};
void NIGHT_IN; void fireFlicker; void cardAt; void RIVER_LIGHT; void paintHen; void paintLongNeck; void paintWoodpile; void paintCuppedWater;
