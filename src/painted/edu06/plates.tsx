import type {ReactElement} from 'react';
import {AbsoluteFill} from 'remotion';
import {paintCatFace, type CatCam, type CatFace} from '../kit/catface';
import {paintEyeMacro} from '../kit/eye';
import {glareGrade, glarePainter} from '../kit/glare';
import {GLOW_DIR_LEFT, GlareVeil, GlowPass} from '../kit/glow';
import {paintVisitorHand} from '../kit/hands';
import {tintPainter, type Painter} from '../kit/painter';
import {seatedPose} from '../kit/poses-seated';
import type {V3} from '../kit/space';
import {camPoint, camUnit, mixYCam, orbitYCam, type YCam} from '../kit/ycam';
import {OWN, paintOwn} from './cast';
import {RoomLight} from './room-light';
import {catItem, LR, paintRoom, type CastItem} from './room';
import {T_PAIR} from './scenes';
import {camB01SH04, camB02SH03, camB04SH03, camB04SH05, camB05SH02, camB05SH03, glareB02SH03, paintB01SH04, paintB02SH03, paintB04SH03, paintB04SH05, paintB05SH02, paintB05SH03} from './shots';

// EDU-EP06-SHORT W5.3 plates (Editor, 2026-11-07), scene sheets EDU-EP06-SHEETS-R1.1. One plate per shot, pure in the shot-local frame L.
// Six shots call Boss's shot painters (`shots.ts`); the other thirteen are authored here from the sheet's camera and staging lines with the same kit and
// room calls. Cameras that the sheet gives as `pos -> target` use a camera at `pos` turned toward the target (sheet "Card convention").

const DEG = Math.PI / 180, FPS = 30;
export const EDU6_SHOTS = [
  ['S01-B01-SH01', 46], ['S01-B01-SH02', 69], ['S01-B01-SH03', 41], ['S01-B01-SH04', 134], ['S01-B02-SH01', 49], ['S01-B02-SH02', 68], ['S01-B02-SH03', 115],
  ['S01-B03-SH01', 118], ['S01-B03-SH02', 147], ['S01-B04-SH01', 60], ['S01-B04-SH02', 37], ['S01-B04-SH03', 156], ['S01-B04-SH04', 72], ['S01-B04-SH05', 67],
  ['S01-B05-SH01', 129], ['S01-B05-SH02', 98], ['S01-B05-SH03', 213], ['S01-B05-SH04', 30], ['S01-B05-SH05', 36],
] as const;
export type Edu6ShotId = (typeof EDU6_SHOTS)[number][0];
export const EDU6_TOTAL = EDU6_SHOTS.reduce((a, [, n]) => a + n, 0);

export type Plate = {paper: string; paint: (p: Painter, L: number) => void; overlay: (L: number) => ReactElement | null};

const PAPER = '#3a2f2a';
const sm = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
const ramp = (L: number, a: number, b: number) => Math.max(0, Math.min(1, (L - a) / (b - a)));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const ease = (L: number, n: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, L) / (n - 1)));
const orbit = (at: V3, yaw: number, r: number, eye: number, f: number, hy: number): YCam => orbitYCam(at, r, yaw * DEG, eye, f, hy);
const lenOf = (id: Edu6ShotId) => EDU6_SHOTS.find(([k]) => k === id)![1];
const T_OWN_CARD: V3 = [-0.15, 1.07, 0.05];
const T_GAP: V3 = [0.45, 0.9, 0.05];
const lookFrom = (pos: V3, target: V3, f: number, hy: number, pitch = 0): YCam => ({x: pos[0], y: pos[1], z: pos[2], yaw: -Math.atan2(pos[0] - target[0], pos[2] - target[2]), f, hy, pitch: pitch * DEG});
const night = (cam: (L: number) => YCam) => (L: number) => <RoomLight cam={cam(L)} />;
const warmEye = (p: Painter) => tintPainter(p, '#ffb060', 0.14, {mul: [1.04, 0.98, 0.9], brush: true});
const eyeCam = (yaw: number, r: number): YCam => ({...orbitYCam([0, 0, 0], r, yaw * DEG, 0, 1000, 880), pitch: 0});
const px = (c: YCam, at: V3) => { const g = camPoint(c, at); return g ? {g, u: camUnit(c, at)} : null; };
const ownSeated = (c: YCam, id: 'seated-lean-in' | 'seated-offer-palm', o: {amount?: number} = {}) => {
  const k = px(c, LR.ownFeet);
  return k ? {...seatedPose(id, OWN, k.g, k.u, 'front', id === 'seated-offer-palm' ? {toward: 1} : {amount: o.amount ?? 1})} : undefined;
};
const ownItem = (c: YCam, o: Parameters<typeof paintOwn>[2]): CastItem => ({at: LR.ownFeet, draw: (q, cc) => { paintOwn(q, cc, o); }});

const VIGNETTE = 'radial-gradient(ellipse 95% 75% at 50% 42%, rgba(0,0,0,0) 55%, rgba(30,22,18,0.35) 100%)';
const Vignette = () => <AbsoluteFill style={{pointerEvents: 'none', background: VIGNETTE}} />;
const Motes = ({children}: {children: ReactElement}) => <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>{children}</svg>;

const CAT_CAM = (r: number, camYaw = 0): CatCam => ({r, f: 1000, hy: 820, camYaw});

// ------------------------------------------------------------------------------------------------ the plates
const plates: Record<Edu6ShotId, Plate> = {
  'S01-B01-SH01': (() => {
    const n = lenOf('S01-B01-SH01');
    const cam = (L: number): YCam => { const e = ease(L, n); return {...orbit(T_PAIR, 28 - 8 * e, 1.75 - 0.15 * e, 1.0, 1050, 760), cx: 60}; };
    return {paper: PAPER, overlay: night(cam), paint: (p, L) => {
      const c = cam(L), t = L / FPS, e = ease(L, n);
      paintRoom(p, c, {t, fore: false, cast: [
        catItem(LR.catStart, {view: 'left', state: 'sit', lid: 0.5, ears: 0}, t, 'sofa'),
        ownItem(c, {at: LR.ownFeet, view: 'front', pose: 'P31', face: 'happy', faceState: {eyes: 'wide', brow: 'up', look: [0.7, 0.1]}, t, warm: 0.08, fig: ownSeated(c, 'seated-lean-in', {amount: e})}),
      ]});
    }};
  })(),
  'S01-B01-SH02': (() => {
    const n = lenOf('S01-B01-SH02');
    const cam = (L: number) => { const e = ease(L, n); return eyeCam(-8 + 3 * e, 0.3 - 0.024 * e); };
    return {paper: PAPER, overlay: () => <Vignette />, paint: (p, L) => paintEyeMacro(warmEye(p), cam(L), {t: (L + 46) / FPS, u: 0, mist: false, catch: 'warm', lid: 1.3, lift: 0, glare: 0})};
  })(),
  'S01-B01-SH03': {paper: PAPER, overlay: () => <Vignette />, paint: (p, L) => {
    const e = ease(L, 41), cam: CatCam = {r: 16 - 2 * e, f: 1000, hy: 820, camYaw: 6 - 4 * e};
    const s: CatFace = {lid: mix(0.5, 0.15, sm(ramp(L, 2, 14))), pupil: mix(0.35, 0.9, sm(ramp(L, 8, 38))), whiskers: sm(ramp(L, 12, 26 + 12)), ears: 0, yaw: -5, gaze: [0, 0], brow: 0};
    paintCatFace(p, cam, s, {t: (L + 115) / FPS, warm: 1});
  }},
  'S01-B01-SH04': {paper: PAPER, overlay: night(camB01SH04), paint: (p, L) => { paintB01SH04(p, L); }},
  'S01-B02-SH01': (() => {
    const n = lenOf('S01-B02-SH01');
    const a = lookFrom([1.0, 0.72, 0.7], T_OWN_CARD, 1050, 700, 10), b = lookFrom([0.92, 0.74, 0.58], T_OWN_CARD, 1050, 700, 10);
    const cam = (L: number) => mixYCam(a, b, ease(L, n));
    const g = (L: number) => 0.4 * glareGrade(L, {start: 4, rise: 40});
    return {paper: PAPER, overlay: (L) => <><RoomLight cam={cam(L)} /><GlareVeil g={g(L)} /></>, paint: (p, L) => {
      const c = cam(L), t = L / FPS;
      paintRoom(glarePainter(p, g(L)), c, {t, fore: false, cast: [
        ownItem(c, {at: LR.ownFeet, view: 'front', pose: 'P31', face: 'neutral', faceState: {eyes: 'wide', look: [0, 0]}, t, fig: ownSeated(c, 'seated-lean-in', {amount: 1 - 0.5 * ease(L, n)})}),
      ]});
    }};
  })(),
  'S01-B02-SH02': (() => {
    const n = lenOf('S01-B02-SH02');
    const g = (L: number) => 0.4 + 0.6 * glareGrade(L, {start: 0, rise: 24});
    return {paper: PAPER, overlay: (L) => <GlareVeil g={g(L)} />, paint: (p, L) => {
      const e = ease(L, n), gg = g(L);
      paintEyeMacro(glarePainter(warmEye(p), gg), eyeCam(-4 + 2 * e, 0.3 - 0.03 * e), {t: (L + 339) / FPS, u: 0, mist: false, catch: gg < 0.5 ? 'warm' : 'sharp', lid: 1.3, lift: 0, glare: gg});
    }};
  })(),
  'S01-B02-SH03': {paper: PAPER, overlay: (L) => <><RoomLight cam={camB02SH03(L)} /><GlareVeil g={glareB02SH03(L)} /></>, paint: (p, L) => { paintB02SH03(p, L); }},
  'S01-B03-SH01': (() => {
    const n = lenOf('S01-B03-SH01');
    const cam = (L: number): YCam => { const e = ease(L, n); return orbit(T_GAP, -20 + 8 * e, 2.0 - 0.15 * e, 0.95, 1000, 760); };
    return {paper: PAPER, overlay: night(cam), paint: (p, L) => {
      const c = cam(L), t = L / FPS, ears = 1 - sm(ramp(L, 67, 109));
      paintRoom(p, c, {t, fore: true, cast: [
        catItem(LR.armchairSeat, {view: 'right', state: 'sit', lid: 0.15, ears}, t, 'armchair'),
        ownItem(c, {at: LR.ownFeet, view: 'front', pose: 'P31', face: L < 61 ? 'neutral' : 'happy', faceState: {eyes: 'dot', look: [0.8, 0]}, t, warm: 0.08}),
      ]});
    }};
  })(),
  'S01-B03-SH02': {paper: PAPER, overlay: () => <Vignette />, paint: (p, L) => {
    const e = ease(L, 147);
    // lid 1.0/lift 0 -> 0.75/1 (L6-20) -> 0/0.2 (L46-60) -> held to L129 -> 1.0/0 (L129-145)
    const a = sm(ramp(L, 6, 20)), b = sm(ramp(L, 46, 60)), c = sm(ramp(L, 129, 145));
    const lid = L < 46 ? mix(1.0, 0.75, a) : L < 129 ? mix(0.75, 0, b) : mix(0, 1.0, c);
    const lift = L < 46 ? mix(0, 1, a) : L < 129 ? mix(1, 0.2, b) : mix(0.2, 0, c);
    paintEyeMacro(warmEye(p), eyeCam(-6 + 3 * e, 0.3 - 0.03 * e), {t: (L + 640) / FPS, u: 0, mist: false, catch: 'warm', lid, lift});
  }},
  'S01-B04-SH01': (() => {
    const CF2: CatFace = {lid: 0.15, pupil: 0.5, ears: 0.5, whiskers: 0.4, yaw: -45, brow: 0, gaze: [-0.3, 0]};
    const CF3: CatFace = {lid: 0.58, pupil: 0.35, ears: 0.05, whiskers: 0, yaw: 0, brow: 1, gaze: [0, 0]};
    const y = (L: number) => sm(ramp(L, 0, 10)), h = (L: number) => sm(ramp(L, 30, 45));
    const state = (L: number): CatFace => ({
      lid: mix(CF2.lid as number, CF3.lid as number, h(L)), pupil: mix(CF2.pupil, CF3.pupil, h(L)), ears: mix(mix(CF2.ears, 0.5, 1), CF3.ears, h(L)),
      whiskers: mix(CF2.whiskers, 0, h(L)), yaw: mix(-45, 0, y(L)), gaze: [mix(-0.3, 0, y(L)), 0], brow: h(L),
    });
    // Draft-only (user 2026-11-07): the glow pass in this shot is the face painter's own motes (0.9 at the end, as the approved LF02), because kit GlowPass
    // clamps at GLOW_PEAK 0.3 and reads dimmer than LF02 (BOSS-7). Scope: this shot only.
    return {paper: PAPER, overlay: () => <Vignette />, paint: (p, L) => {
      const u = ramp(L, 45, 60);
      paintCatFace(p, CAT_CAM(14 - L / 59), state(L), {t: (L + 787) / FPS, warm: 1, halo: 0.7 * u, motes: 0.9 * u});
    }};
  })(),
  'S01-B04-SH02': (() => {
    const n = lenOf('S01-B04-SH02');
    const cam = (L: number): YCam => { const e = ease(L, n); return orbit(T_OWN_CARD, 40 - 2 * e, 0.75 - 0.05 * e, 1.12, 1100, 700); };
    return {paper: PAPER, overlay: (L) => <><RoomLight cam={cam(L)} /><Motes><GlowPass x={1180} y={760} u={L / 30} dir={GLOW_DIR_LEFT} seed={5} lead={0.5} travel={640} /></Motes></>, paint: (p, L) => {
      const c = cam(L), t = (L + 847) / FPS, talk = L >= 4 && L < 33;
      paintRoom(p, c, {t, fore: false, cast: [
        ownItem(c, {at: LR.ownFeet, view: 'front', pose: 'P31', face: 'happy', faceState: {eyes: 'half', mouth: talk ? 'talk' : 'smile', open: talk ? 0.2 : undefined, look: [0.25, 0]}, t, warm: 0.1, fig: {quarter: 'right', quarterDeg: 25}}),
      ]});
    }};
  })(),
  'S01-B04-SH03': {paper: PAPER, overlay: night(camB04SH03), paint: (p, L) => { paintB04SH03(p, L); }},
  'S01-B04-SH04': (() => {
    const n = lenOf('S01-B04-SH04');
    const cam = (L: number): YCam => { const e = ease(L, n); return orbit([0.15, 0.15, 1.3], 15 - 5 * e, 0.9 - 0.1 * e, 0.22, 1050, 900); };
    const sniff = (L: number) => 0.01 * (L >= 52 && L < 70 ? Math.sin((Math.PI * 2 * (L - 52)) / 6) : 0);
    return {paper: '#bfc2c4', overlay: (L) => <RoomLight cam={cam(L)} light="day" />, paint: (p, L) => {
      const c = cam(L), t = L / FPS;
      const lean = L < 48 ? 0.5 * sm(ramp(L, 8, 30)) : 0.5 + 0.2 * sm(ramp(L, 48, 58));
      const x = mix(0.38, 0.3, sm(ramp(L, 34, 48)));
      paintRoom(p, c, {t, light: 'day', fore: true, cast: [
        catItem([x, 0, 1.32], {view: 'left', state: 'stand', lean, leanTo: [0.24, 0.15 + sniff(L)], leanAnchor: 'nose', contact: 1}, t, 'floor'),
      ]});
      const w = camPoint(c, LR.visitorHand), u = camUnit(c, LR.visitorHand);
      if (w) paintVisitorHand(p, {base: 30000, wrist: w, dir: Math.PI + 0.3, size: 0.9 * (u / 700), side: -1, skin: 'light', watch: true});
    }};
  })(),
  'S01-B04-SH05': {paper: PAPER, overlay: night(camB04SH05), paint: (p, L) => { paintB04SH05(p, L); }},
  'S01-B05-SH01': (() => {
    const n = lenOf('S01-B05-SH01');
    const cam = (L: number): YCam => { const e = ease(L, n); return orbit(T_GAP, -12 - 6 * e, 1.85 + 0.1 * e, 0.95, 1000, 760); };
    return {paper: PAPER, overlay: night(cam), paint: (p, L) => {
      const c = cam(L), t = (L + 1179) / FPS;
      // blink on "กะพริบช้า ๆ" (32 f): half L97-102, shut L103-118, half L119-123, dot + squint 0.5 L124-129
      const st = L < 97 ? {eyes: 'dot' as const} : L < 103 ? {eyes: 'half' as const} : L < 119 ? {eyes: 'shut' as const} : L < 124 ? {eyes: 'half' as const} : {eyes: 'dot' as const, squint: 0.5};
      paintRoom(p, c, {t, fore: true, cast: [
        catItem(LR.armchairSeat, {view: 'left', state: 'sit', lid: 0.5, ears: 0}, t, 'armchair'),
        ownItem(c, {at: LR.ownFeet, view: 'front', pose: 'P31', face: 'happy', faceState: {...st, look: [0.8, 0]}, t, warm: 0.12}),
      ]});
    }};
  })(),
  'S01-B05-SH02': {paper: PAPER, overlay: night(camB05SH02), paint: (p, L) => { paintB05SH02(p, L); }},
  'S01-B05-SH03': {paper: PAPER, overlay: night(camB05SH03), paint: (p, L) => { paintB05SH03(p, L); }},
  'S01-B05-SH04': {paper: PAPER, overlay: () => <Vignette />, paint: (p, L) => {
    const e = ease(L, 30);
    paintCatFace(p, CAT_CAM(15 - e), {lid: mix(0.2, 0.6, sm(ramp(L, 2, 20))), pupil: 0.35, ears: 0.1, whiskers: 0, yaw: 0, roll: 10, gaze: [0, 0], brow: 1}, {t: (L + 1619) / FPS, warm: 1, halo: 0, motes: 0});
  }},
  'S01-B05-SH05': (() => {
    const n = lenOf('S01-B05-SH05');
    const cam = (L: number): YCam => { const e = ease(L, n); return orbit(T_OWN_CARD, 36 - 2 * e, 0.75 - 0.03 * e, 1.12, 1100, 700); };
    return {paper: PAPER, overlay: night(cam), paint: (p, L) => {
      const c = cam(L), t = (L + 1649) / FPS;
      paintRoom(p, c, {t, fore: false, cast: [
        ownItem(c, {at: LR.ownFeet, view: 'front', pose: 'P31', face: 'happy', faceState: {eyes: 'half', look: [0.25, 0]}, t, warm: 0.12, fig: {quarter: 'right', quarterDeg: 25}}),
      ]});
    }};
  })(),
};

export const plateOf = (id: Edu6ShotId): Plate => plates[id];
