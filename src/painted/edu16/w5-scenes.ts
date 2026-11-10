import {hardFill} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import {flapState, landState, paintCrow, paintCrowPx, takeoffState} from './crow';
import {MAN, paintPerson, WALKER, WOMAN, type WalkOpts} from './cast';
import {lookCam} from './palette';
import {paintShot16} from './aerial';
import {paintPathTimeline, SHOT17, SHOT19, fadeItem} from './season';
import {paintStick} from './props';
import type {CastDef} from '../kit/cast';
import {wFill, qy} from '../kit/world';
import {camUnit} from '../kit/ycam';
import type {V3} from '../kit/space';
import {C} from './palette';

// EDU-EP16 W5.2 asset stills (Boss): paint functions for the sheets (flight cycle, ...). Measures are printed by `w5-measure.ts`.
export const W5_MEASURE: Record<string, Record<string, number | string>> = {};

const sky = (p: Painter) => {
  paintSkyBands(p, {from: C.skyTop, to: C.skyHor, horizon: 1500, width: 1080, bands: 8});
  hardFill(p, 900, C.lawn, [[-50, 1560], [1130, 1560], [1130, 1980], [-50, 1980]]);
};
/** FL1: the flight cycle in profile, eight phases of one wingbeat (12 f at 2.5 Hz, every 1.5 f), adult-ringed, 230 px body length, two columns. */
export const paintFL1 = (p: Painter) => {
  sky(p);
  const L = 230;
  for (let i = 0; i < 8; i++) {
    const col = i % 2, row = Math.floor(i / 2), at: Pt = [300 + col * 480, 260 + row * 280];
    paintCrowPx(p, at, L, {variant: 'adult-ringed', view: 'right', state: flapState(i * 1.5), seed: 900 + i, sun: -1, anchor: 'body'});
  }
  W5_MEASURE.FL1 = {L};
};
/** FL2: from below (four wing phases), take-off (n = 0, 3, 6, 9) and landing (n = 0, 3, 6, 9) in profile. */
export const paintFL2 = (p: Painter) => {
  sky(p);
  for (let i = 0; i < 4; i++) paintCrowPx(p, [270 + (i % 2) * 540, 200 + Math.floor(i / 2) * 250], 190, {variant: 'adult', view: 'below', state: {wingUp: Math.sin((i / 4) * Math.PI * 2)}, seed: 920 + i, sun: -1});
  for (let i = 0; i < 4; i++) paintCrowPx(p, [260 + (i % 2) * 480, 880 + Math.floor(i / 2) * 270], 230, {variant: 'adult', view: 'right', state: takeoffState(i * 3), seed: 930 + i, sun: -1, anchor: i >= 2 ? 'body' : 'feet'});
  for (let i = 0; i < 4; i++) paintCrowPx(p, [200 + i * 240, 1480], 200, {variant: 'adult', view: 'right', state: landState(i * 3), seed: 940 + i, sun: -1, anchor: i < 2 ? 'body' : 'feet'});
};

// ---- poses (N5) and props (N6): three figures per still on a plain lawn, camera 4.6 m back, f 1500 (about 350 px/m), ground row y ~1250
const camPS = lookCam([0, 1.1, 4.6], [0, 1.0, 0.3], 1500, {hy: 700});
type Fig = {def: CastDef; o: Omit<WalkOpts, 'at' | 't'>; x: number};
const lineupPS = (p: Painter, key: string, figs: Fig[], bg = true) => {
  const c = camPS;
  if (bg) {
    paintSkyBands(p, {from: C.skyTop, to: C.skyHor, horizon: 700, width: 1080, bands: 8});
    wFill(p, c, 950, C.lawn, qy(0, -30, 30, -30, 8));
  }
  const out: Record<string, number | string> = {};
  figs.forEach((f, i) => {
    const m = paintPerson(p, c, f.def, {...f.o, at: [f.x, 0, 0.3] as V3, t: 0.4, seed: 1000 + i * 37});
    out[`fig${i}Top`] = Math.round(m?.top ?? 0); out[`fig${i}Bottom`] = Math.round(m?.bottom ?? 0);
    if (m?.maskPx) out[`fig${i}MaskPx`] = m.maskPx;
  });
  out.pxPerM = Math.round(camUnit(c, [0, 0, 0.3]));
  W5_MEASURE[key] = out;
};
/** PS1: kneel-net (MAN, front): raised k 0, lowering k 0.6, down with the mesh draped k 1 / drape 1; masked, as in shot 3. */
export const paintPS1 = (p: Painter) => lineupPS(p, 'PS1', [
  {def: MAN, x: -1.2, o: {view: 'front', mask: 'A1', ep: {id: 'kneel-net', k: 0}, net: {k: 0}}},
  {def: MAN, x: 0, o: {view: 'front', mask: 'A1', ep: {id: 'kneel-net', k: 0.6}, net: {k: 0.6}}},
  {def: MAN, x: 1.2, o: {view: 'front', mask: 'A1', ep: {id: 'kneel-net', k: 1}, net: {k: 1, drape: 1}}},
]);
/** PS2: hold-bird (the calm crow in two mitten hands, ringed), open-hands k 0.5 and k 1 (the release; the crow is gone). */
export const paintPS2 = (p: Painter) => lineupPS(p, 'PS2', [
  {def: MAN, x: -1.2, o: {view: 'front', mask: 'A1', ep: {id: 'hold-bird', k: 1}, bird: {ring: true}}},
  {def: MAN, x: 0, o: {view: 'front', mask: 'A1', ep: {id: 'open-hands', k: 0.5}}},
  {def: MAN, x: 1.2, o: {view: 'front', mask: 'A1', ep: {id: 'open-hands', k: 1}}},
]);
/** PS3: duck-cover (MAN right profile, walking, cup out) k 0 / 0.5 / 1, masked. */
export const paintPS3 = (p: Painter) => lineupPS(p, 'PS3', [
  {def: MAN, x: -1.2, o: {view: 'right', mask: 'A1', walk: 0.3, cup: 'walk', ep: {id: 'duck-cover', k: 0}}},
  {def: MAN, x: 0, o: {view: 'right', mask: 'A1', walk: 0.3, cup: 'walk', ep: {id: 'duck-cover', k: 0.5}}},
  {def: MAN, x: 1.2, o: {view: 'right', mask: 'A1', walk: 0.3, cup: 'walk', ep: {id: 'duck-cover', k: 1}}},
]);
/** PS4: mask-off (MAN front, k 0.1 masked / 0.55 lifting / 1 bare, mask hanging from the right hand). */
export const paintPS4 = (p: Painter) => lineupPS(p, 'PS4', [
  {def: MAN, x: -1.2, o: {view: 'front', mask: 'A1', ep: {id: 'mask-off', k: 0}}},
  {def: MAN, x: 0, o: {view: 'front', mask: 'A1', face: 'suspicious', ep: {id: 'mask-off', k: 0.55}, maskLift: 0.9}},
  {def: MAN, x: 1.2, o: {view: 'front', mask: 'A1', face: 'suspicious', ep: {id: 'mask-off', k: 1}, maskHand: true, maskTilt: 8}},
]);
/** PS5: mask-on (WOMAN front, k 0 holding it / 0.5 over the head / 1 pulled down). */
export const paintPS5 = (p: Painter) => lineupPS(p, 'PS5', [
  {def: WOMAN, x: -1.2, o: {view: 'front', mask: 'A1', maskHand: true, ep: {id: 'mask-on', k: 0}}},
  {def: WOMAN, x: 0, o: {view: 'front', mask: 'A1', maskLift: 1, ep: {id: 'mask-on', k: 0.5}}},
  {def: WOMAN, x: 1.2, o: {view: 'front', mask: 'A1', ep: {id: 'mask-on', k: 1}}},
]);
/** PS6: tote-over-head (WOMAN right profile, walking, masked) toteUp 0 / 0.5 / 1. */
export const paintPS6 = (p: Painter) => lineupPS(p, 'PS6', [
  {def: WOMAN, x: -1.2, o: {view: 'right', mask: 'A1', walk: 0.3, tote: true, toteUp: 0, ep: {id: 'tote-over-head', k: 0}}},
  {def: WOMAN, x: 0, o: {view: 'right', mask: 'A1', walk: 0.3, tote: true, toteUp: 0.5, ep: {id: 'tote-over-head', k: 0.5}}},
  {def: WOMAN, x: 1.2, o: {view: 'right', mask: 'A1', walk: 0.3, tote: true, toteUp: 1, ep: {id: 'tote-over-head', k: 1}}},
]);
/** PS7: props: the stick, WALKER with the wool scarf (right, back), hands free. */
export const paintPS7 = (p: Painter) => {
  lineupPS(p, 'PS7', [
    {def: WALKER, x: -0.9, o: {view: 'right', mask: 'A1', walk: 0.3, scarf: true}},
    {def: WALKER, x: 0.9, o: {view: 'back', mask: 'A1', scarf: true}},
  ]);
  paintStick(p, [540, 330], 520, 12, 1900);
};

// ---- shot 16 (aerial move) frames: n = 0, 10, 14, 18, 30, 42, 50, 60 (AE1-AE8), clean of movers except the wire crows at +0..+10
const AEN = [0, 10, 14, 18, 30, 42, 50, 60];
const paintAE = (i: number) => (p: Painter) => {
  const n = AEN[i];
  const movers = n < 14 ? [0, 1, 2].map((k) => ({at: [4.2 + k * 0.7, 5.85, -2.4] as V3, draw: (pp: Painter, cc: ReturnType<typeof lookCam>) => { paintCrow(pp, cc, [4.2 + k * 0.7, 5.85, -2.4], {variant: k ? 'adult' : 'adult-ringed', view: 'left', state: {beak: 0.6, lean: 14}, seed: 1300 + k, sun: -1}); }})) : [];
  const c = paintShot16(p, n, movers);
  W5_MEASURE[`AE${i + 1}`] = {n, camY: Math.round(c.y), camX: Math.round(c.x), pitchDeg: Math.round(((c.pitch ?? 0) * 180) / Math.PI), hy: Math.round(c.hy)};
};
export const paintAE1 = paintAE(0), paintAE2 = paintAE(1), paintAE3 = paintAE(2), paintAE4 = paintAE(3), paintAE5 = paintAE(4), paintAE6 = paintAE(5), paintAE7 = paintAE(6), paintAE8 = paintAE(7);

// ---- shot 17 season dissolve (SD1: n = 20, 33, 38, 46, 50, 60 on camLF04B) and shot 19 dusk states (SD2: n = 30, 70, 84, 110)
import {camLF04B} from './scenes';
const sd17 = (p: Painter, ns: number[]) => ns.forEach(() => undefined) as unknown as void;
void sd17;
const paintSD17 = (n: number) => (p: Painter) => {
  const c = camLF04B, scarf = n < 40;
  const walker = {at: [1.3 + 0.0433 * (n - 13), 0, 0.3] as V3, draw: (pp: Painter, cc: typeof c) => { paintPerson(pp, cc, WALKER, {at: [1.3 + 0.0433 * (n - 13), 0, 0.3], view: 'right', walk: n * 0.04, t: 0.4, mask: 'A1', scarf}); }};
  const movers = n < 44 ? [fadeItem(walker, n < 30 ? 1 : Math.max(0, 1 - (n - 30) / 10))] : [];
  paintPathTimeline(p, c, SHOT17, n, movers);
};
export const paintSD1 = paintSD17(20), paintSD2 = paintSD17(34), paintSD3 = paintSD17(40), paintSD4 = paintSD17(48), paintSD5 = paintSD17(56);
const camSD19 = lookCam([-10.4, 5.75, -1.9], [-3.5, 2.4, -0.6], 900, {near: 0.05});
const paintSD19 = (n: number) => (p: Painter) => {
  const spots = (n < 66 ? [-10, -7, -4, -2.5, -1, 0.5] : n < 80 ? [-7, -4, -1, 0.5] : [-4, 0.5]).map((x, i) => ({at: [x, 5.8, -2.4] as V3, draw: (pp: Painter, cc: typeof camSD19) => { paintCrow(pp, cc, [x, 5.8 + 0.4 * ((x + 3) / 15) ** 2 - 0.0, -2.4], {variant: i % 2 ? 'adult-ringed' : 'adult', view: 'right', state: {headTilt: 0.3}, seed: 1400 + i, sun: 0, rim: C.duskRim}); }}));
  paintPathTimeline(p, camSD19, SHOT19, n, spots);
};
export const paintSD6 = paintSD19(30), paintSD7 = paintSD19(70), paintSD8 = paintSD19(84), paintSD9 = paintSD19(110);
