import type {ReactNode} from 'react';
import {Freeze, useCurrentFrame} from 'remotion';
import type {PaintedShot} from '../../painted/shot';
import {STILL_CAMERA} from '../../painted/kit/camera';
import {camMove, camOf, type CamMove} from '../../painted/kit/cam-moves';
import {hardFill} from '../../painted/kit/draw';
import {paintFigureAt} from '../../painted/kit/figure-at';
import {PEOPLE} from '../../painted/kit/people';
import type {Painter} from '../../painted/kit/painter';
import type {Item} from '../../painted/kit/world';
import {camPoint, camUnit, type YCam} from '../../painted/kit/ycam';
import {wFill, wInk, qy, qz} from '../../painted/kit/world';
import {FPS, Painted, Vignette} from '../../painted/survival/frame';
import {basket, groundPropItem, paintGroundProp, paintHeldProp} from '../../painted/survival/props';
import {dressIsan, paintCast} from '../../painted/survival/cast';
import {cardAt, worldAt, type Light, type V3} from '../../painted/survival/core';
import {LIGHT, paintVillage} from '../../painted/survival/village';
import {paintCycad} from '../../painted/survival/forest';
import {henPrintItem} from '../../painted/survival/hen-print';
import {laughFig, safeLean} from '../../painted/survival/poses';
import {paintHen, paintHenFootCU, paintHenMotion, type HenMotionId, type HenPose} from '../../painted/survival/hen';
import {paintLongNeck} from '../../painted/survival/creatures';
import {ankSpray, type AnkPose} from '../../painted/survival/beast-ankylo';
import {LONGNECK_POSES} from '../../painted/survival/beast-longneck';
import {vapourItem} from '../../painted/survival/trex-fx';
import {cycleAt, paddyStageAt, paddyStageItems, paintSkyCycle, postShadowItem, skyColorsAt, SHOT12_CYCLES} from '../../painted/survival/sky-cycle';
import {ankItems, ANKYLO_POSES, headingTo, longNeckItems, splashItem, toWorldOf} from './beasts';
import {paintFire} from '../../painted/survival/fire';
import {paintRiver, RIVER_LIGHT} from '../../painted/survival/river';
import {paintPterosaur, paintPterosaurShadow, pteroFlight} from '../../painted/survival/pterosaur';
import {paintFlowerPopCard, flowerSlide} from '../../painted/survival/cards';
import {FlowerPopFrame} from '../../painted/survival/screens';
import {CAM16_1, CAM16_2} from '../../painted/survival/look';
import {CAM16_8} from '../../painted/survival/look-b';
import {CAM16_16} from '../../painted/survival/look-assets';
import {PASS} from '../../painted/survival/look-batch2';
import {lin, mix, mix3, sm, SHOT_TABLE} from './clock';
import type {Env, Shot} from './shot-types';
import {RIVER_SHOTS} from './shots-river';

// EDU-EP16-SHORT shot plates (Editor, W5.3 Draft, 14 Nov 2026) on EDU-EP16-SHEET-R1.1 (scripts/edu-series/ep16/storyboard.md): one plate per shot, ID `EP16-<n>` (`EP16-12a..d` for the four paddy
// stages of shot 12), a pure function of the shot-local frame `L` (the plate mounts it in a `Freeze`, so Studio, random seek and the scene render draw the same picture). Ambient clocks (fire, hens,
// fronds, water, blinks) read the global frame `g`; event clocks read `L`. Assets come only from src/painted/survival (shared, read-only here); episode-only staging lives in this file.
// Camera lines are the sheet's `cam:` lines as `camMove(...)`; where Boss's look-frame camera superseded the sheet (shots 1, 2, 8: the sheet's own R1.1 proposal; shot 16: CAM16_16) the shared export is used.


const MORN = LIGHT.morning;
const V = (x: number, y: number, z: number): V3 => [x, y, z];
const FACE_T = (e: Env) => e.t;   // blink clock (global, ambient)
const vlerp = (a: V3, b: V3, k: number): V3 => mix3(a, b, k);
const path = (pts: V3[], k: number): V3 => {   // piecewise-linear through points, k 0..1 by segment length
  const d = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[2] - pts[i][2])), tot = d.reduce((a, b) => a + b, 0);
  let s = k * tot;
  for (let i = 0; i < d.length; i++) { if (s <= d[i] || i === d.length - 1) return vlerp(pts[i], pts[i + 1], d[i] ? Math.min(1, s / d[i]) : 1); s -= d[i]; }
  return pts[pts.length - 1];
};
const dir2 = (a: V3, b: V3): [number, number] => { const x = b[0] - a[0], z = b[2] - a[2], l = Math.hypot(x, z) || 1; return [x / l, z / l]; };
const hens = (p: Painter, c: YCam, e: Env, list: {at: V3; view: HenPose['view']; id: HenMotionId; ph?: number; seed: number}[], L = MORN) =>
  list.forEach((h) => { paintHenMotion(p, c, h.at, h.view, h.id, e.t + (h.ph ?? 0), L, h.seed, {phase: h.ph ?? 0}); });
/** Hen item for the village `extra` list (so it sorts with the set). */
const henItem = (c0: V3, view: HenPose['view'], id: HenMotionId, e: Env, seed: number, ph = 0) => ({at: c0, draw: (q: Painter, cc: YCam) => { paintHenMotion(q, cc, c0, view, id, e.t + ph, MORN, seed, {phase: ph}); }});
const castItem = (who: 'K' | 'Y' | 'V', at: V3, o: Parameters<typeof paintCast>[3], bias?: number) => ({at, bias, draw: (q: Painter, cc: YCam) => { paintCast(q, cc, who, o); }});
const seedDot = (q: Painter, c: YCam, at: V3, id: number) => { const k = cardAt(c, at); if (k) hardFill(q, id, '#e8721c', [[-0.03, 0], [0, 0.03], [0.03, 0], [0, -0.01]].map(([x, y]) => [k.g[0] + x * k.u, k.g[1] - y * k.u] as [number, number])); };

// ---- long-necks (Boss N16-06 R2 volume creature, staging per sheet R1.3-R1.5): LN-A/B/C in shot 2, LN-F in shot 15, LN-G in shot 21
const AMB_LN = {amb: '#9aa890', ambK: 0.5};
const ln2 = (c: YCam, e: Env): Item[] => [
  ...longNeckItems(c, [-4, -17], [8, -24], {head: [7.6, mix(12.5, 14.5, sm(55, 85, e.L)), 0], jaw: 0.1}, {haze: 0.02, seed: 71010, ...AMB_LN}),
  ...longNeckItems(c, [-14, -36], [8, -40], {head: [7.0, 13.5, -1]}, {haze: 0.42, seed: 71020, ...AMB_LN}),
  ...longNeckItems(c, [16, -40], [-100, -40], {walk: e.L / 125 * 0.3 * 3, stride: 2.2, head: [9.4, 10.6, 0]}, {haze: 0.5, seed: 71030, ...AMB_LN}),
];
const ln15 = (c: YCam, e: Env): Item[] => {
  const L = e.L, chew = L < 48 ? 0.2 + 0.15 * Math.sin(L * 0.8 * 2 * Math.PI / FPS * 6) : 0, swing = sm(52, 64, L);
  return longNeckItems(c, [42, -9], [40, -2], {head: [7.4 + 0 * swing, 12.5, mix(0, 1.2, swing)], jaw: Math.max(0, chew)}, {haze: 0.3 + 0.1 * sm(30, 40, L), seed: 71040, ...AMB_LN});
};
const ln21 = (c: YCam, e: Env): Item[] => longNeckItems(c, [15, -27], [2, -24], {head: [7.4, mix(9.0, 13.2, sm(20, 40, e.L)), 1.5]}, {haze: 0.15, seed: 71050, ...AMB_LN});

// ------------------------------------------------------------------ shots 1-2: night village, the sky ripples, white flash; morning reveal
const SH: Record<string, Shot> = {};
SH['1'] = {cam: CAM16_1, paper: '#0f1530', vig: 0.35,
  draw: (p, c, e) => paintVillage(p, c, {mode: 'night', t: e.L / FPS, ripple: {speed: 1.6, glow: 0.35 + 0.6 * lin(0, 84, e.L)}}),
  over: (e) => <div style={{position: 'absolute', inset: 0, background: '#ffffff', opacity: sm(82, 90, e.L)}} />};
const K2_PATH: V3[] = [V(-3.5, 0, -3.6), V(2.3, 0, -5.3), V(2.1, 0, -12.0)];
SH['2'] = {cam: CAM16_2, paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const k = sm(0, 73, e.L), pos = path(K2_PATH, k), running = e.L < 73, tt = e.L / FPS;
    const sc = e.L > 30 ? 1 : 0, back = e.L >= 73;
    const hn = (at: V3, view: HenPose['view'], ph: number, seed: number, away: V3): V3 => at;
    void hn;
    // hens fuss and scatter aside from +30 (flap-lift, trot away from his path)
    const hen = (at: V3, view: HenPose['view'], away: [number, number], seed: number, ph: number) => {
      const s = sc ? sm(30, 48, e.L) : 0, pos2: V3 = [at[0] + away[0] * s, 0, at[2] + away[1] * s];
      return {at: pos2, draw: (q: Painter, cc: YCam) => { paintHen(q, cc, [pos2[0], s > 0 && s < 1 ? Math.abs(Math.sin(tt * 18)) * 0.12 : 0, pos2[2]], {view, peck: s > 0 ? 0 : 0.5 + 0.4 * Math.sin(e.t * 3 + ph), lift: s > 0 && s < 1 ? 1 : 0, fluff: s > 0 && s < 1 ? 0.6 : 0, tilt: 12 * Math.sin(e.t * 2 + ph)}, MORN, seed); }};
    };
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [
      ...ln2(c, e),
      hen(V(3.2, 0, -3.9), 'right', [1.2, 0.5], 16000, 0.3), hen(V(4.9, 0, -3.7), 'left', [1.4, 0.2], 16200, 1.1), hen(V(6.6, 0, -1.3), 'right', [0.8, 0.6], 16600, 2.0),
      hen(V(6.0, 0, -0.6), 'front', [1.0, 0.9], 16800, 0.7), hen(V(2.5, 0, -6.6), 'front', [-1.3, 0.2], 16400, 1.7),
      {at: pos, draw: (q, cc) => { paintCast(q, cc, 'K', {at: pos, ...(back ? {view: 'back' as const, pose: 'P01' as const, face: 'worried' as const} : {facing: dir2(path(K2_PATH, Math.max(0, k - 0.02)), path(K2_PATH, Math.min(1, k + 0.02))), pose: 'P38' as const, face: 'happy' as const}), t: running ? tt : e.t, held: (qq, a, u) => basket(qq, a.lHand, u, back)}); }},
    ]});
  },
  over: (e) => <div style={{position: 'absolute', inset: 0, background: '#ffffff', opacity: Math.max(0, 1 - e.L / 3)}} />};

// ------------------------------------------------------------------ shots 3-5: forest edge (SET-EDGE = the village forest beyond the fence), flower card
SH['3'] = {cam: camMove([3.4, 1, -16.5], [75, 85], [2.4, 2], 0.95, {pitch: [15, 15], f: 900, hy: 1020, ease: [0, 1]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const look = e.L < 18 ? -0.8 : e.L < 36 ? 0.8 : e.L < 48 ? -0.2 : 0;
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [castItem('K', V(3.4, 0, -16.5), {at: V(3.4, 0, -16.5), facing: [0, -1], pose: 'P01', face: 'worried', faceState: {look: [look, 0.5]}, t: FACE_T(e), held: (qq, a, u) => basket(qq, e.L < 60 ? [a.lHand[0], a.lHand[1] - 0.25 * u] : a.lHand, u)})]});
  }};
const flowerCard = (f: number) => (p: Painter, c: YCam, e: Env) => { void e; paintVillage(p, c, {mode: 'morning', t: 1}); paintFlowerPopCard(p, f); };
SH['4'] = {cam: camMove([6, 2.3, -20.5], [-24, -24], [8, 8], 0.8, {f: 1000, hy: 880}), paper: '#2a3a2a',
  draw: (p, c, e) => flowerCard(e.L)(p, c, e),
  over: (e) => <FlowerPopFrame slide={flowerSlide(e.L)} />,
  wrap: (e, inner) => <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + 0.05 * lin(0, e.len - 1, e.L)})`, transformOrigin: '540px 900px'}}>{inner}</div>};
SH['5'] = {cam: camMove([3.4, 1.2, -16.5], [75, 82], [6, 5], 1.2, {pitch: [8, 8], f: 850, hy: 960, ease: [0, 1]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => paintVillage(p, c, {mode: 'morning', t: e.t, extra: [castItem('K', V(3.4, 0, -16.5), {at: V(3.4, 0, -16.5), view: 'back', pose: 'P01', face: 'worried', t: FACE_T(e)})]}),
  over: (e) => {
    // ghost flower tiles (the card from shot 4 at its positions) fading one by one at +34, +40, +46, +52 (8 f each)
    const tiles: [number, number][] = [[150, 300], [560, 300], [150, 710], [560, 710]];
    return <>{tiles.map(([x, y], i) => { const a = 0.55 * (1 - sm(34 + 6 * i, 42 + 6 * i, e.L)); return a > 0.004 ? <svg key={i} width={370} height={370} viewBox="0 0 370 370" style={{position: 'absolute', left: x, top: y, opacity: a}}><rect width={370} height={370} fill="#e4e2c4" /><rect y={300} width={370} height={70} fill="#d6d4b4" /><path d="M120 300 Q110 200 200 150" stroke="#7ea06a" strokeWidth={8} fill="none" /><ellipse cx={150} cy={210} rx={26} ry={14} fill="#7ea06a" transform="rotate(-30 150 210)" /><g transform="translate(225 140)" fill="#b4a6d8">{[0, 72, 144, 216, 288].map((r) => <circle key={r} cx={0} cy={-34} r={26} transform={`rotate(${r})`} />)}<circle r={12} fill="#f1e9a6" /></g></svg> : null; })}</>;
  }};

// ------------------------------------------------------------------ shots 6-10: the seed cycad, Grandma's slap, the long-neck
const C1: V3 = [4.05, 0, -16.7], C2: V3 = [5.9, 0, -18.4];
const cycads = (extra: boolean, seedsFall = false, e?: Env): {at: V3; draw: (q: Painter, c: YCam) => void}[] => [
  {at: C1, draw: (q, c) => { paintCycad(q, c, C1, 2.0, MORN, 21000, {seeds: !seedsFall || (e?.L ?? 0) < 47}); }},
  ...(extra ? [{at: C2, draw: (q: Painter, c: YCam) => { paintCycad(q, c, C2, 2.2, MORN, 21100); }}] : []),
];
SH['6'] = {cam: camMove([3.4, 0.9, -16.2], [55, 62], [2.8, 2.5], 1, {f: 950, hy: 980, ease: [0, 1]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const yx = mix(5.6, 4.5, sm(28, 45, e.L)), reach = e.L >= 7 && e.L < 45, slapped = e.L >= 45;
    const Ypos = V(yx, 0, -16.9), Kpos = V(3.6, 0, -16.0), tt = e.t;
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [
      ...cycads(false, true, e),
      castItem('K', Kpos, {at: Kpos, facing: dir2(Kpos, V(3.95, 0, -16.55)), pose: reach ? 'P16' : 'P01', face: slapped ? 'ouch' : 'happy', t: tt}),
      castItem('Y', Ypos, {at: Ypos, facing: dir2(Ypos, Kpos), pose: e.L >= 38 ? 'P16' : 'P01', face: 'angry', t: tt, held: (qq, a, u) => { if (e.L < 38) { paintHeldProp(qq, 'sack', a.lHand, u); paintHeldProp(qq, 'knife', a.rHand, u, {ang: 0.9}); } }}),
      ...(slapped ? [0, 1, 2].map((i) => ({at: V(3.95 + 0.12 * i, 0, -16.55 + 0.08 * i), draw: (q: Painter, cc: YCam) => { const f = lin(47 + 3 * i, 55 + i, e.L); seedDot(q, cc, V(3.95 + 0.1 * (i - 1), 0.92 * (1 - f * f) + 0.02, -16.55 + 0.1 * i), 21200 + i); }})) : []),
    ]});
  }};
SH['7'] = {cam: camMove([3.95, 1, -16], [70, 78], [2, 1.8], 1.05, {f: 1000, hy: 960, ease: [0, 1]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const Kp = V(3.75, 0, -16.15), Yp = V(4.15, 0, -15.9), shake = e.L >= 10 && e.L < 40 ? 7 * Math.sin((e.L - 10) * 0.55) : 0;
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [
      ...cycads(false),
      castItem('K', Kp, {at: Kp, spose: 'rub-hand', sph: (e.L / FPS) * 1.1, face: e.L < 40 ? 'ouch' : 'sad', t: e.t}),
      castItem('Y', Yp, {at: Yp, facing: dir2(Yp, Kp), pose: e.L >= 52 ? 'P05' : 'P01', face: e.L < 40 ? 'angry' : 'worried', fig: {headCock: shake}, t: e.t}),
    ]});
  }};
const CAM8 = (e: Env) => camOf(CAM16_8, e.L / (e.len - 1));
SH['8'] = {cam: CAM8, paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const toC2: [number, number] = [5.9 - 3.4, -18.4 + 16.5], land = sm(0, 40, e.L), bite = e.L >= 40 ? 0.5 + 0.5 * Math.sin((e.L - 40) * 0.55) : 0;
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: cycads(true)});
    const k = cardAt(c, V(5.95, 1.85 + 6.3 * (1 - land), -18.4), -1, 1.3);
    if (k) paintLongNeck(p, k, MORN, {top: [-3.2, 9.5], chew: bite});
    paintCast(p, c, 'Y', {at: V(3.75, 0, -16.15), facing: toC2, pose: 'P01', face: 'worried', t: e.t});
    paintCast(p, c, 'K', {at: V(3.4, 0, -16.5), facing: toC2, pose: e.L >= 12 && e.L < 95 ? 'P05' : 'P01', face: e.L < 40 ? 'surprised' : e.L < 95 ? 'smug' : 'sad', t: e.t});
  }};
SH['9'] = {cam: camMove([3.75, 0.8, -16.15], [40, 48], [1.9, 1.7], 0.95, {f: 1000, hy: 940, ease: [0, 1]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const Kp = V(3.75, 0, -16.15);
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [
      ...cycads(false),
      e.L < 22 ? castItem('K', Kp, {at: Kp, view: 'front', pose: 'P34', face: 'smug', t: e.t}) : castItem('K', Kp, {at: Kp, spose: 'mime-stir', sph: ((e.L - 20) / FPS) * 1.7, face: 'smug', t: e.t}),
      ...[0, 1, 2].map((i) => ({at: V(3.55 + 0.1 * i, 0, -16.0), draw: (q: Painter, cc: YCam) => { if (e.L < 8) seedDot(q, cc, V(3.55 + 0.1 * i, 0.02, -16.0 - 0.05 * i), 21300 + i); }})),
    ]});
  }};
SH['10'] = {cam: camMove([5.6, 1.8, -19.5], [-20, -8], [7.6, 7], 1.1, {pitch: [8, 8], f: 820, hy: 920, ease: [0, 1]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const Kp = V(3.75, 0, -16.15), Yp = V(4.15, 0, -15.9), land: V3 = [6.2, 0.02, -20.0], toL = dir2(Kp, C2);
    const fly = lin(14, 30, e.L), sp: V3 = [mix(4.0, land[0], fly), mix(1.0, land[1], fly) + 1.4 * Math.sin(Math.PI * fly), mix(-16.0, land[2], fly)];
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [
      ...cycads(true),
      castItem('K', Kp, {at: Kp, facing: toL, pose: 'P01', face: e.L < 45 ? 'sad' : 'surprised', faceState: e.L > 58 ? {open: 1} : undefined, t: e.t}),
      castItem('Y', Yp, {at: Yp, facing: toL, pose: e.L >= 12 && e.L < 24 ? 'P16' : 'P01', face: 'stern' as never, t: e.t}),
      ...(e.L >= 14 ? [{at: sp, draw: (q: Painter, cc: YCam) => { seedDot(q, cc, sp, 21400); seedDot(q, cc, [sp[0] + 0.12, sp[1] + 0.05, sp[2] + 0.05], 21401); seedDot(q, cc, [sp[0] - 0.1, sp[1] - 0.03, sp[2]], 21402); }}] : []),
    ]});
    const down = sm(18, 45, e.L), kk = cardAt(c, V(6.0 + 0.2 * down, mix(1.85, 0.5, down), mix(-18.4, -19.9, down)), -1, 1.3);
    if (kk) paintLongNeck(p, kk, MORN, {top: [-3.2, 9.5], chew: e.L >= 45 ? 0.5 + 0.5 * Math.sin((e.L - 45) * 0.55) : 0});
    // the pair repaint over the neck as in the look frame
    paintCast(p, c, 'K', {at: Kp, facing: toL, pose: 'P01', face: e.L < 45 ? 'sad' : 'surprised', t: e.t});
    paintCast(p, c, 'Y', {at: Yp, facing: toL, pose: e.L >= 12 && e.L < 24 ? 'P16' : 'P01', face: 'angry', t: e.t});
  }};

// ------------------------------------------------------------------ shots 11-15: the paddy, the day/night sky, the granary, bowl of rice

// ---- shot 11 (R1.4 11R4): the ankylosaur wades the flooded paddy behind Keng, mud splash on each front-foot plant, huff, head-shake spray, drops on K's cheek
const AN_FROM: [number, number] = [21.4, 5.8], AN_A: [number, number] = [20.3, 4.6], AN_B: [number, number] = [19.4, 3.6];
const mixP2 = (a: [number, number], b: [number, number], k: number): [number, number] => [mix(a[0], b[0], k), mix(a[1], b[1], k)];
const AN_SPLASH: [number, number][] = [[6, 0], [21, 1], [36, 0], [62, 1]];   // [+frame, foot index]
SH['11'] = {cam: camMove([15.6, 1, -1], [-125, -115], [2.6, 2.3], 0.95, {f: 950, hy: 960, pitch: [4, 4], cx: -190, ease: [0, 0.62]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const L = e.L, Kp = V(mix(14.2, 15.6, sm(0, 6, L)), 0, -1.0), run = L < 6, thump = L >= 40;
    const at = L < 59 ? mixP2(AN_FROM, AN_A, sm(0, 40, L)) : mixP2(AN_A, AN_B, sm(59, 68, L));
    const moving = L < 40 || (L >= 59 && L < 68), ph = L < 40 ? lin(0, 40, L) * 1.33 : L < 59 ? 1.33 : 1.33 + lin(59, 68, L) * 0.5;
    const shaking = L >= 66 && L < 72, headDown = L < 46 ? 0.3 : L < 52 ? mix(0.3, -0.12, sm(46, 52, L)) : L < 66 ? -0.12 : 0.3;
    const pose: AnkPose = shaking ? ANKYLO_POSES.headShake(lin(66, 72, L)) : {...ANKYLO_POSES.wade(ph), stride: moving ? 0.8 : 0, headDown};
    const heading = headingTo(at, [Kp[0], Kp[2]]) - 0.55;
    const {items: anItems, B, place} = ankItems(c, {at, heading, pose, ground: -0.45, waterline: 0, seed: 72100});
    const fx: Item[] = [];
    for (const [f0, foot] of AN_SPLASH) { const age = (L - f0) / 9; if (age > 0 && age < 1) { const w = toWorldOf(c, B, place, B.feet[foot]); fx.push(splashItem([w[0], 0, w[2]], age, {seed: 7300 + f0})); } }
    if (L >= 50 && L < 62) { const sn = toWorldOf(c, B, place, B.anchors.snout); fx.push(vapourItem([sn[0], sn[1], sn[2]], [Math.cos(heading), Math.sin(heading)], lin(50, 62, L), {scale: 0.35})); }
    if (shaking) { const k = Math.sin(Math.PI * lin(66, 72, L)), hj = B.joints['head.joint'] ?? B.anchors.snout, yaw = pose.headYaw ?? 0;
      fx.push({at: [at[0], 0, at[1] + 0.5], bias: 3, draw: (q, cc) => { for (const d of ankSpray(hj, yaw, Math.cos(lin(66, 72, L) * 6 * Math.PI), k)) { const w = toWorldOf(cc, B, place, d.p), r = d.r; wFill(q, cc, 7400 + Math.round(d.p[0] * 50), '#7a6446', [[w[0] - r, w[1], w[2]], [w[0], w[1] + r, w[2]], [w[0] + r, w[1], w[2]], [w[0], w[1] - r * 0.8, w[2]]]); } }}); }
    const face = L < 50 ? 'happy' : L < 75 ? 'surprised' : 'sad';
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [
      ...anItems, ...fx,
      {at: Kp, draw: (q, cc) => {
        const toAn = L >= 50 ? dir2(Kp, V(at[0], 0, at[1])) : [-0.55, 0.85] as [number, number], look = sm(50, 56, L), fc: [number, number] = [mix(-0.55, toAn[0], look), mix(0.85, toAn[1], look)];
        const a = paintCast(q, cc, 'K', {at: Kp, facing: run ? [1, 0] : fc, pose: run ? 'P38' : 'P09', face, t: run ? L / FPS : e.t,
          held: thump ? undefined : (qq, aa, u) => paintHeldProp(qq, 'hoe', [aa.rHand[0], aa.rHand[1]], u, {ang: -0.5})});
        if (a && L >= 72) for (let i = 0; i < 5; i++) { const age = lin(72, 76, L); if (age > 0) hardFill(q, 7500 + i, '#6e5a3c', [[a.head[0] + (i - 2) * 9 - 5, a.head[1] + 4 + 8 * (i % 3)], [a.head[0] + (i - 2) * 9, a.head[1] - 3 + 8 * (i % 3)], [a.head[0] + (i - 2) * 9 + 5, a.head[1] + 4 + 8 * (i % 3)], [a.head[0] + (i - 2) * 9, a.head[1] + 9 + 8 * (i % 3)]]); }
      }},
      ...(thump ? [groundPropItem('hoe', V(15.95, 0, -1.0), {seed: 50500, ang: 0.0})] : []),
    ]});
  }};

// ---- shot 12 (R1.3 12R, Boss N16-20): days and nights race across the sky while the paddy ripens; seven day cycles of 18/16/14/14/12/12/10 f, gold at +96; a calendar page peels at each dawn
const POSTS: [number, number][] = [-1.5, 0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5].map((x) => [x, -12]);
const DAWN_END = SHOT12_CYCLES.reduce<number[]>((a, n) => [...a, (a.at(-1) ?? 0) + n], []);
SH['12'] = {cam: camMove([16, 1.2, -1.0], [-88, -86], [17.6, 17.0], 1.6, {f: 820, hy: 900, ease: [0, 1]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const cy = cycleAt(e.L), u = cy.hold ? 0 : cy.u, gold = lin(96, 102, e.L), day = Math.min(6, cy.hold ? 6 : cy.cycle + sm(0.9, 1.0, cy.u));
    const L = skyColorsAt(u, gold).light, stage = paddyStageAt(day);
    const night3 = e.L >= 41 && e.L < 52, nk = night3 ? sm(41, 44, e.L) * (1 - sm(48, 52, e.L)) : 0;
    const dark = skyColorsAt(0.77, 0).light;
    paintVillage(p, c, {mode: 'morning', t: e.t, light: L, sky: (q, cc) => { paintSkyCycle(q, cc, u, {t: e.t, gold}); }, extra: [
      ...paddyStageItems(stage, L, {t: e.t}), postShadowItem(POSTS, u, 1.2),
      ...(nk > 0.02 ? [0, 1, 2].flatMap((i) => longNeckItems(c, [31 - 3 * i + 0.4 * (e.L - 41), -21 + 3.2 * i + 0.15 * (e.L - 41)], [31 - 3 * i, -9], LONGNECK_POSES.walk((e.L - 41) / 22 + i * 0.3), {haze: 0.5 * (1 - nk) + 0.2, amb: dark.amb, ambK: 0.85 * nk, seed: 71200 + i * 40})) : []),
    ]});
    const hang = V(-1.02, 1.5, -1.3), g = camPoint(c, hang), un = camUnit(c, hang);
    if (!g) return;
    paintHeldProp(p, 'calendar', [g[0], g[1]], un * 1.0, {seed: 50600});
    DAWN_END.slice(0, 6).forEach((end, i) => { const k = lin(end - 6, end, e.L); if (k > 0 && k < 1) paintHeldProp(p, 'calendar', [g[0] + 0.25 * un * k, g[1] + 0.5 * un * k * k], un, {seed: 50700 + i * 20, ang: 0.9 * k + 0.1}); });
  }};

/** The granary seen from inside (episode-only staging; SET-GRANARY-IN is a Boss need): dark planks, a doorway of bright yard, the shelf, sacks. */
const camIn = (m: CamMove) => (e: Env) => camOf(m, e.L / (e.len - 1));
const darkRoom = (p: Painter, c: YCam, hole: {w: number; top: number; bottom: number}, id: number, wall = '#3a2a1c') => {
  const x0 = 540 - hole.w / 2, x1 = 540 + hole.w / 2;
  hardFill(p, id, wall, [[0, 0], [x0, 0], [x0, hole.bottom], [0, hole.bottom]]);
  hardFill(p, id + 1, wall, [[x1, 0], [1080, 0], [1080, hole.bottom], [x1, hole.bottom]]);
  hardFill(p, id + 2, wall, [[x0, 0], [x1, 0], [x1, hole.top], [x0, hole.top]]);
  hardFill(p, id + 3, '#2a1d12', [[0, hole.bottom], [1080, hole.bottom], [1080, 1920], [0, 1920]]);
  for (let y = 40; y < hole.bottom; y += 62) { hardFill(p, id + 10 + y, '#2f2216', [[0, y], [x0, y], [x0, y + 3], [0, y + 3]]); hardFill(p, id + 400 + y, '#2f2216', [[x1, y], [1080, y], [1080, y + 3], [x1, y + 3]]); }
  void c;
};
SH['13'] = {cam: camIn(camMove([7.75, 1.5, -7.3], [180, 180], [1.9, 1.6], 1.7, {pitch: [-8, -8], f: 900, hy: 900, ease: [0, 1]})), paper: '#2a1d12', vig: 0.3,
  draw: (p, c, e) => {
    // yard through the door: a camera at the door plane with the same orientation
    const door = {...c, x: c.x - 0, z: c.z + 1.9 * Math.cos(Math.PI) * -1 * 0 + 1.9 * 1};   // moved 1.9 m forward (+z) to the door plane
    paintVillage(p, {...door, z: c.z + 1.9, pitch: c.pitch}, {mode: 'morning', t: e.t, extra: [{at: V(7.75, 0, -4), draw: () => undefined}]});
    const swing = sm(0, 8, e.L), w = 150 + 520 * swing;
    darkRoom(p, c, {w, top: 330, bottom: 1330}, 51000);
    // sacks stacked frame right (inside), 7.6, 0.6..1.2, -8.6
    for (let i = 0; i < 3; i++) { const at = V(7.2 + 0.05 * i, 0.6 + 0.5 * i, -8.6 - 0.08 * i); const k = cardAt(c, at); if (k) paintGroundProp(p, 'sack', c, at, {seed: 51100 + i * 40}); }
    const Kp = V(7.75, 0.6, -7.05), k = lin(0, 30, e.L);
    if (e.L >= 6) paintCast(p, c, 'K', {at: Kp, view: 'front', spose: 'arms-wide', sk: sm(8, 30, e.L), face: 'happy', t: e.t, shadow: {op: 30}});
    void k;
  }};
SH['14'] = {cam: camIn(camMove([7.5, 1.9, -8.8], [20, 12], [1.5, 1.3], 2.2, {f: 900, hy: 960, ease: [0, 1]})), paper: '#2a1d12', vig: 0.3,
  draw: (p, c, e) => {
    hardFill(p, 51500, '#46321f', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
    for (let y = 20; y < 1700; y += 58) hardFill(p, 51510 + y, '#38271a', [[0, y], [1080, y], [1080, y + 3], [0, y + 3]]);
    const sh = cardAt(c, V(7.0, 2.0, -9.3));
    if (sh) hardFill(p, 51900, '#5a3e24', [[0, sh.g[1]], [1080, sh.g[1]], [1080, sh.g[1] + 0.05 * sh.u], [0, sh.g[1] + 0.05 * sh.u]]);
    const Yp = V(7.4, 0.6, -8.9), lift = sm(30, 50, e.L);
    hardFill(p, 51910, '#cdb98a', [[0, 1180], [1080, 1180], [1080, 1920], [0, 1920]]);
    paintCast(p, c, 'K', {at: V(8.5, 0, -7.2), view: 'front', pose: 'P01', face: 'happy', t: e.t, scale: 1, tint: {to: '#2a1d12', u: 0.5}});
    paintCast(p, c, 'Y', {at: Yp, view: 'front', pose: 'P34', face: 'worried', t: e.t, held: (qq, a, u) => {
      if (e.L < 58) paintHeldProp(qq, 'seed-sack', [a.rHand[0] - 0.02 * u, a.rHand[1] - 0.3 * u * (1 - lift) - 0.35 * u * lift * 0], u, {seed: 51920});
      else { paintHeldProp(qq, 'coconut-scoop', a.rHand, u, {ang: 0.3}); paintHeldProp(qq, 'rice-bowl', [a.lHand[0], a.lHand[1]], u, {seed: 51930}); }
    }});
    if (e.L >= 50) { const at = V(7.0, 2.0, -9.3), g = camPoint(c, at); if (g) paintHeldProp(p, 'seed-sack', [g[0], g[1]], camUnit(c, at), {seed: 51940}); }
  }};
const VILL = ['man-elder', 'man-buzz', 'woman-curly', 'woman-bob', 'man-crop', 'man-elder', 'woman-curly', 'man-buzz'] as const;
SH['15'] = {cam: camMove([[16, 1.2, -0.4], [15.3, 1, -0.4]], [-80, -70], [5.5, 1], [2.2, 1.4], {pitch: [-4, -22], f: 850, hy: 900, ease: [0.15, 0.55]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const Yp = V(15.25, 0, -0.45);
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [
      ...ln15(c, e),
      ...VILL.map((w, i) => { const at = V(14.0 + 0.15 * (i % 3), 0, -3.4 + i * 0.95), def = dressIsan(PEOPLE[w], w.startsWith('woman') ? 'isan-home-woman' : 'isan-home-man');
        return {at, draw: (q: Painter, cc: YCam) => { paintFigureAt(q, cc, def, {at, facing: [1, 0.1], pose: 'P01', face: 'worried', t: e.t + i * 0.3}); }}; }),
      castItem('Y', Yp, {at: Yp, facing: [1, 0], pose: 'P01', face: 'worried', t: e.t, held: (qq, a, u) => paintHeldProp(qq, 'rice-bowl', [a.rHand[0], a.rHand[1]], u, {seed: 52000})}),
    ]});
  }};

// ------------------------------------------------------------------ shots 16-17: evening fire (shot 16 lives in shots-river.tsx)
const FIRE: V3 = [-1, 0, 1.5];
const DARK: Light = {amb: '#1a2442', k: 0.55};
SH['17'] = {cam: camMove([-1, 0.8, 1.5], [15, 5], [3.4, 2.9], 1, {f: 880, hy: 960, ease: [0, 1]}), paper: '#0f1530', vig: 0.3,
  draw: (p, c, e) => {
    const tint = {to: '#2a1f30', u: 0.3};
    const bowl = lin(70, 95, e.L), bx = mix(0.0, -0.75, bowl), reachN = e.L >= 58 && e.L < 78;
    paintVillage(p, c, {mode: 'night', t: e.t, light: DARK, extra: [
      {at: FIRE, draw: (q, cc) => paintFire(q, cc, FIRE, e.t)},
      ...[[-1.35, 1.2], [-0.6, 1.0], [-1.0, 0.85]].map(([x, z], i) => groundPropItem('fish-sticks', V(x, 0, z), {seed: 52100 + i * 50, ang: 0.15 + 0.1 * i})),
      groundPropItem('koi-bowl', V(bx, 0, 2.0 - 0.1 * bowl), {seed: 52300}),
      castItem('Y', V(-1.6, 0, 2.4), {at: V(-1.6, 0, 2.4), facing: dir2(V(-1.6, 0, 2.4), FIRE), pose: 'P32', face: e.L >= 70 && e.L < 98 ? 'angry' : 'worried', fig: e.L >= 80 && e.L < 100 ? {headCock: 7 * Math.sin((e.L - 80) * 0.6)} : undefined, t: e.t, tint}),
      castItem('K', V(-2.25, 0, 2.5), {at: V(-2.25, 0, 2.5), facing: dir2(V(-2.25, 0, 2.5), FIRE), pose: 'P32', face: 'happy', t: e.t, tint, held: (qq, a, u) => paintHeldProp(qq, 'fish-sticks', a.rHand, u, {ang: 0.5, seed: 52400})}),
      castItem('V', V(0.2, 0, 2.2), {at: V(0.2, 0, 2.2), facing: dir2(V(0.2, 0, 2.2), FIRE), pose: reachN ? 'P16' : 'P01', face: e.L >= 109 ? 'sad' : e.L >= 90 ? 'smug' : 'neutral', t: e.t, tint}),
    ]});
  }};

// ------------------------------------------------------------------ shots 18-22: hens, the three-toed foot, the end
SH['18'] = {cam: camMove([3.7, 0.35, -4.3], [20, 12], [1.6, 1.4], 0.45, {pitch: [4, 4], f: 950, hy: 900, ease: [0, 1]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const hx = mix(3.0, 3.7, sm(0, 30, e.L)), ys = sm(6, 22, e.L), Yp = V(mix(4.0, 4.5, ys), 0, mix(-4.45, -4.1, ys));
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [
      {at: V(hx, 0, -4.3), draw: (q, cc) => { paintHenMotion(q, cc, V(hx, 0, -4.3), 'right', 'idle', e.t, MORN, 16000); paintHen(q, cc, V(hx, 0, -4.3), {view: 'right', lift: Math.max(0, Math.sin(e.L * 0.7)), liftFar: Math.max(0, -Math.sin(e.L * 0.7))}, MORN, 16010, {shadow: false}); }},
      henItem(V(5.1, 0, -4.1), 'left', 'huddle', e, 16100, 1.2), henItem(V(2.6, 0, -4.0), 'right', 'peck', e, 16200, 0.4),
      ...(e.L >= 6 ? [castItem('Y', Yp, {at: Yp, facing: [0.1, 1], pose: 'P01', face: 'happy', t: e.t, held: (qq, a, u) => paintHeldProp(qq, 'eggs-apron', [a.rHand[0], a.rHand[1]], u, {seed: 52600})})] : []),
    ]});
  }};
SH['19'] = {cam: camMove([2.6, 1, -9], [140, 150], [2.3, 2.1], 1.05, {f: 950, hy: 940, ease: [0, 1]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const a = Math.PI * sm(4, 18, e.L), Kp = V(2.6, 0, -9.0), fc: [number, number] = [Math.sin(a), -Math.cos(a)];
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [
      castItem('K', Kp, {at: Kp, facing: fc, pose: 'P01', face: e.L >= 18 ? 'surprised' : 'worried', t: e.t}),
      henItem(V(3.6, 0, -6.6), 'left', 'peck', e, 16300, 0.5), henItem(V(1.9, 0, -6.2), 'right', 'idle', e, 16310, 0.2),
    ]});
  }};
SH['20'] = {cam: camMove([3.4, 0.25, -8.4], [200, 190], [0.8, 0.7], 0.12, {pitch: [14, 14], f: 1000, hy: 1100, ease: [0, 1]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    paintVillage(p, c, {mode: 'morning', t: e.t});
    // the hen tilts its head at the lens (front view), then steps: the foot lifts at +24 and plants close to the lens at +32 (contact y 0)
    const tilt = e.L < 8 ? 0 : 22 * sm(2, 8, e.L);
    paintHen(p, c, V(3.4, 0, -8.4), {view: 'front', tilt: tilt * (e.L < 38 ? 1 : 1 - sm(38, 52, e.L))}, MORN, 16500);
    if (e.L >= 22) { const at = V(3.45, 0, -8.2), k = cardAt(c, at, 1); if (k) { const lift = 0.14 * (1 - sm(24, 32, e.L)); paintHenFootCU(p, {g: [k.g[0], k.g[1] - lift * k.u], u: k.u, s: 1}, MORN, 16800); } }
  }};
SH['21'] = {cam: camMove([3, 1.2, -8], [-10, -24], [3, 7.5], [1.2, 2.4], {pitch: [0, -5], f: 850, hy: 920, ease: [0, 0.9]}), paper: '#cfdcc4', vig: 0.2,
  draw: (p, c, e) => {
    const Kp = V(2.6, 0, -8.6), Yp = V(3.6, 0, -8.2);
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [
      ...ln21(c, e),
      castItem('K', Kp, {at: Kp, facing: [-0.3, 0.95], pose: 'P01', face: 'surprised', t: e.t}),
      castItem('Y', Yp, {at: Yp, facing: [-0.4, 0.92], pose: 'P01', face: 'happy', t: e.t, held: (qq, a, u) => paintHeldProp(qq, 'eggs-apron', [a.rHand[0], a.rHand[1]], u, {seed: 52700})}),
      henItem(V(3.2, 0, -7.2), 'left', 'peck', e, 16600, 0.3), henItem(V(4.6, 0, -7.8), 'right', 'idle', e, 16610, 0.9), henItem(V(2.0, 0, -7.5), 'right', 'peck', e, 16620, 1.6), henItem(V(4.2, 0, -6.4), 'left', 'trot', e, 16630, 0.5),
    ]});
  }};
// ---- shot 22 (R1.5b 22R5): the nose-to-beak scene, then the camera drops to hen height; the hen takes one step, its foot lands with a giant's thud (sound only), Keng flinches, the hen pecks. No sky, no T. rex, no text.
const C22A = camMove([3, 0, -8.5], [95, 100], [1.6, 2.2], 0.55, {f: 950, hy: 880, ease: [0, 1]});
const C22B = camMove([[3.0, 0, -8.5], [3.3, 0, -8.5]], [100, 100], [2.2, 1.0], [0.55, 0.14], {f: 950, hy: 850, pitch: [0, 4], ease: [0, 1]});
const C22C = camMove([[3.3, 0, -8.5], [3.35, 0, -8.5]], [100, 100], [1.0, 0.85], [0.14, 0.12], {f: 950, hy: 820, pitch: [4, 6], ease: [0, 1]});
const cam22 = (e: Env) => e.L < 100 ? camOf(C22A, e.L / 100) : e.L < 114 ? camOf(C22B, lin(100, 114, e.L)) : camOf(C22C, lin(114, 124, e.L));
SH['22'] = {cam: cam22, paper: '#b39a72', vig: 0.2,
  wrap: (e, inner) => <div style={{position: 'absolute', inset: 0, transform: e.L >= 120 && e.L < 122 ? 'translate(3px, 2px)' : undefined}}>{inner}</div>,
  draw: (p, c, e) => {
    const L = e.L, Kp = V(3.2, 0, -8.1), Yp = V(3.0, 0, -9.3);
    const step = lin(108, 120, L), Hp = V(mix(3.25, 3.5, step), 0, mix(-8.5, -8.48, step)), clk = L >= 81 && L < 99;
    const view: HenPose['view'] = L < 100 ? 'left' : 'front', turn = sm(100, 106, L);
    const stepping = L >= 108 && L < 120, planted = L >= 120, peckK = L >= 128 && L < 133 ? Math.sin(Math.PI * lin(128, 133, L)) : 0, cl = L >= 134 && L < 142 && Math.floor((L - 134) / 4) % 2 === 0 ? 1 : 0;
    const hen = {view, tilt: view === 'front' ? 10 * turn * (L < 108 ? 1 : 0.2) : 8 * Math.sin(e.t * 1.4), cluck: clk && Math.floor((L - 81) / 5) % 2 === 0 ? 1 : cl, thrust: clk ? 0.03 : 0, peck: peckK, lift: stepping ? Math.max(0, Math.sin(lin(108, 120, L) * Math.PI * 2)) : 0} as HenPose;
    const flinch = lin(120, 134, L), kBack = L >= 120 && L < 134, kPose = 'P34', kFace = L < 100 ? 'surprised' : L < 120 ? 'worried' : kBack ? 'surprised' : L >= 134 ? 'happy' : 'surprised';
    const kLean = kBack ? safeLean(-0.21 * Math.sin(Math.PI * Math.min(1, flinch * 1.2))) : 0;
    const yl = L >= 84 && L < 110 ? laughFig((L - 84) / FPS, {amp: 4, hz: 2}) : L >= 122 && L < 140 ? laughFig((L - 122) / FPS, {amp: 4, hz: 2}) : undefined;
    const dust: Item = {at: V(Hp[0] + 0.05, 0, Hp[2]), bias: 3, draw: (q, cc) => { const a = lin(120, 128, L); if (a <= 0 || a >= 1) return; for (let i = 0; i < 7; i++) { const an = i * 0.9, r = 0.08 * a * (0.6 + 0.4 * ((i * 37) % 5) / 5), h = 0.05 * Math.sin(Math.PI * a), x = Hp[0] + 0.1 + Math.cos(an) * r, z = Hp[2] + 0.02 + Math.sin(an) * r * 0.8, sz = 0.012 * (1 - a * 0.6); wFill(q, cc, 78000 + i, '#c8b488', [[x - sz, h, z], [x, h + sz, z], [x + sz, h, z], [x, h - sz * 0.8, z]]); } }};
    paintVillage(p, c, {mode: 'morning', t: e.t, extra: [
      {at: Hp, draw: (q, cc) => { paintHen(q, cc, Hp, hen, MORN, 16700); }},
      castItem('K', Kp, {at: Kp, facing: [0, -1], pose: kPose, face: kFace, fig: kBack ? {lean: kLean} : undefined, t: e.t} as any),
      castItem('Y', Yp, {at: Yp, facing: [0, 1], pose: 'P01', face: yl ? 'laugh' : 'happy', fig: yl, t: e.t, held: (qq: Painter, a: any, u: number) => paintHeldProp(qq, 'eggs-apron', [a.rHand[0], a.rHand[1]], u, {seed: 52800})} as any),
      henItem(V(1.9, 0, -9.6), 'right', 'peck', e, 16710, 0.7), henItem(V(4.2, 0, -9.2), 'left', 'idle', e, 16720, 1.4),
      dust, ...(L >= 126 ? [henPrintItem(V(3.5 + 0.1, 0, -8.46), Math.min(1, lin(126, 130, L)), MORN, {heading: 0, minPx: 80})] : []),
    ]});
  }};

// ------------------------------------------------------------------ plates
export const ep16PlateId = (key: string) => `EP16-${key}`;
Object.assign(SH, RIVER_SHOTS);
const PLATE_KEYS = Object.keys(SH);
/** Shot-table row of a plate key ('16C' -> S01-B05-SH16C). */
const rowOf = (key: string) => { const r = SHOT_TABLE.find(([id]) => id.endsWith(`-SH${key.padStart(2, '0')}`)); if (!r) throw new Error(`EDU-EP16: no shot row for plate ${key}`); return r; };
const ShotView = ({k}: {k: string}) => {
  const L = useCurrentFrame(), s = SH[k], [, start, len] = rowOf(k);
  const e: Env = {L, g: start + L, t: (start + L) / FPS, len};
  const c = typeof s.cam === 'function' ? s.cam(e) : camOf(s.cam, L / (len - 1));
  const inner = (
    <>
      <Painted paint={(q) => s.draw(q, c, e)} frame={L} paper={s.paper} band={false}>{s.vig ? <Vignette level={s.vig} id={`v${k}`} /> : null}</Painted>
      {s.over?.(e)}
    </>
  );
  return <div style={{position: 'absolute', inset: 0}}>{s.wrap ? s.wrap(e, inner) : inner}</div>;
};
export const ep16Shots: PaintedShot[] = PLATE_KEYS.map((k) => ({
  id: ep16PlateId(k), serves: [rowOf(k)[0]], paper: SH[k].paper, camera: () => STILL_CAMERA, paint: () => {},
  Overlay: ({tl, opacity}) => <div style={{position: 'absolute', inset: 0, opacity}}><Freeze frame={Math.round(tl * FPS)}><ShotView k={k} /></Freeze></div>,
}));
void worldAt; void qz; void hens;
