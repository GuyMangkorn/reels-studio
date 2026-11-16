import type {FigPose} from '../../kit/cast';
import {ANIMALS} from '../../kit/animals';
import {poseArms, poseFor} from '../../kit/poses';
import type {Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint, camUnit, mixYCam, type YCam} from '../../kit/ycam';
import {drawGirl, GIRL, girlPose} from '../girl';
import {drawDog18} from '../dog';
import {drawHen, HENS, type HenDef} from '../hen';
import {cam} from '../looks-cams';
import {mixColor} from '../../kit/painter';
import {openT} from '../looks';
import {DOG18_LICK} from '../path-shots';
import {paintFigureShadow, paintVillageBack, paintVillageFront, VILLAGE} from '../village';
import {clamp, k01, lerp, lerpArm, makeShot, outCubic, type Frame} from '../shotkit';
import type {Pass} from '../stack';

// EDU-EP18-SHORT village-set shots (Editor W5 draft): B03-SH01..SH03 and B04-SH01 (home gate, the dog). Gate leaf 110 deg (user, 16 Nov 2026).
const LEAF = 110;
const DOG = ANIMALS['dog-thai'];
const HENS_AT: {at: V3; id: 'hen-brown' | 'hen-buff'; view: 'left' | 'right' | 'front'; state: 'stand' | 'peck'}[] = [
  {at: [-0.85, 0, -3.6], id: 'hen-brown', view: 'right', state: 'peck'},
  {at: [0.1, 0, -3.5], id: 'hen-buff', view: 'left', state: 'stand'},
];
const shade = (d: HenDef) => ({...d, ...Object.fromEntries(Object.entries(d).filter(([, v]) => typeof v === 'string').map(([k, v]) => [k, mixColor(v as string, '#2a2030', 0.3)]))}) as HenDef;

const hens = (p: Parameters<Pass>[0], c: YCam, G: number) =>
  [...HENS_AT].sort((a, b) => b.at[2] - a.at[2]).forEach((h, i) => {
    const hg = camPoint(c, h.at);
    if (!hg) return;
    paintFigureShadow(p, c, h.at, 0.35, 29960 + i);
    drawHen(p, 760 + i * 7, shade(HENS[h.id]), hg, camUnit(c, h.at), {view: h.view, state: h.state, peck: 0.45 + 0.4 * Math.max(0, Math.sin((G + i * 17) / 9))}, G / 30);
  });

/** The frozen-hand pose's right hand sits near 1.0 m (hip); the sheet's H is 0.60 m and a dog's nose reaches about 0.5 m, so the hand is lowered toward the dog (k 0..1, hand `h` m above her feet). */
const lowHand = (pz: Omit<FigPose, 'face'>, g: Pt, u: number, k: number, h = 0.58) => {
  const a = pz.rArm;
  if (!a) return pz;
  const ty = lerp(a.to[1], g[1] - h * u, k), dy = ty - a.to[1];
  return {...pz, rArm: {...a, to: [a.to[0], ty] as Pt, ...(a.via ? {via: [a.via[0], a.via[1] + dy * 0.5] as Pt} : {})}};
};
const girlAt = (p: Parameters<Pass>[0], c: YCam, at: V3, pose: (g: Pt, u: number) => Omit<FigPose, 'face'>, face: Parameters<typeof drawGirl>[5], outfit: 'travel-backpack' | 'travel-safari', seed: number) => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return null;
  paintFigureShadow(p, c, at, 1.64, seed + 9000);
  return drawGirl(p, outfit, g, u, pose(g, u), face, openT(seed), seed);
};

// ------------------------------------------------------------------------------------------------ B03-SH01 home at grandma's gate
const sh01Cam = (L: number) => mixYCam(cam([0.3, 1.0, 0], 200, 6.6, 1.4, 1900, 690), cam([0.3, 1.0, 0], 192, 6.0, 1.4, 1900, 690), k01(L, 0, 40));
export const B03_SH01 = makeShot('B03-SH01', (L, G): Frame => {
  const c = sh01Cam(L), def = GIRL['travel-backpack'];
  const back: Pass = (p) => {
    paintVillageBack(p, c, {leafOpen: LEAF});
    // walk-in L0-22 along the lane (z 1.3 -> 1.1), turn L18-28, step to G0 L24-36, wave L36-52 (P07)
    const walkK = k01(L, 0, 22, (x) => x), stepK = k01(L, 24, 36);
    const at: V3 = L < 24 ? [lerp(1.9, 0.4, walkK), 0, lerp(1.3, 1.1, walkK)] : [lerp(0.4, 0.3, stepK), 0, lerp(1.1, 0.4, stepK)];
    const walking = L < 22 || (L >= 24 && L < 36);
    const turn = k01(L, 18, 28);
    girlAt(p, c, at, (g, u) => {
      if (turn < 0.5 && L < 24) return {view: 'right', walk: (L / 11) % 1, stride: 1, farArmUnder: true};
      const ar = poseArms('P07', def, g, u, 'front');
      const wave = L >= 36 ? Math.sin(((L - 36) / 16) * Math.PI * 2) : 0;
      return {view: 'front', ...(walking ? {walk: (L / 11) % 1, stride: 0.8} : {}), ...ar, ...(L >= 36 && ar.rArm ? {rArm: {...ar.rArm, to: [ar.rArm.to[0] + 14 * u / 1000 * 10 * wave, ar.rArm.to[1]] as Pt}} : L < 36 ? {rArm: undefined, lArm: undefined} : {})};
    }, L < 18 ? 'neutral' : 'happy', 'travel-backpack', 840);
    paintVillageFront(p, c);
    hens(p, c, G);
  };
  return {paper: VILLAGE.yard, back};
});

// ------------------------------------------------------------------------------------------------ B03-SH02 the dog trots up
const sh02Cam = (L: number) => mixYCam(cam([0.3, 0.6, -0.5], 190, 2.85, 0.55, 1100, 880), cam([0.3, 0.6, -0.5], 182, 2.4, 0.55, 1100, 880), k01(L, 0, 54));
const GIRL_G0: V3 = [0.3, 0, 0.4];
/** Where the dog stands at her hand. The sheet's D1 is (0.35, 0, -0.5), 0.45 m in front of the hand in depth: from the camera the hand then reads 0.8 m above the dog's feet and the nose cannot reach it (neck stretched like a giraffe), so the dog stands level with the hand in depth (SD in build-notes). */
const DOG_SNIFF: V3 = [0.46, 0, -0.12];
const dogAt = (p: Parameters<Pass>[0], c: YCam, at: V3, pose: Parameters<typeof drawDog18>[5] | ((g: Pt, u: number) => Parameters<typeof drawDog18>[5]), G: number) => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return;
  paintFigureShadow(p, c, at, 0.45, 38000 + Math.round(at[0] * 10));
  drawDog18(p, 903, DOG, g, u, typeof pose === 'function' ? pose(g, u) : pose, G / 30);
};
export const B03_SH02 = makeShot('B03-SH02', (L, G): Frame => {
  const c = sh02Cam(L);
  const back: Pass = (p) => {
    paintVillageBack(p, c, {leafOpen: LEAF});
    const dk = k01(L, 0, 36, (x) => 1 - (1 - x) * (1 - x * 0.3)), moving = L < 36;
    const dz = lerp(-2.6, DOG_SNIFF[2], dk), dx = lerp(0.15, DOG_SNIFF[0], dk);
    // girl: finishes the wave L0-8, sees the dog L8, frozen-hand from L20
    const fz = k01(L, 8, 20);
    girlAt(p, c, GIRL_G0, (g, u) => {
      const def = GIRL['travel-backpack'], fh = girlPose('frozen-hand', def, g, u, 'front'), wv = poseArms('P07', def, g, u, 'front');
      const lo = lowHand(fh, g, u, k01(L, 24, 54));
      const arm = lerpArm(wv.rArm, lo.rArm, fz);
      return {...fh, rArm: arm, lArm: lerpArm(wv.lArm, fh.lArm, fz)};
    }, L < 8 ? 'happy' : L < 20 ? 'surprised' : 'scared', 'travel-backpack', 841);
    dogAt(p, c, [dx, 0, dz], {view: 'right', state: 'stand', walk: moving ? (L / 9) % 1 : 0, gait: 'walk', wag: 0.2}, G);
    paintVillageFront(p, c);
  };
  return {paper: VILLAGE.yard, back};
});

// ------------------------------------------------------------------------------------------------ B03-SH03 the sniff
const sh03Cam = (L: number) => mixYCam(cam([0.35, 0.85, -0.2], 145, 1.6, 0.85, 1100, 760), cam([0.35, 0.85, -0.2], 135, 1.4, 0.85, 1100, 760), k01(L, 0, 141, (x) => x));
export const B03_SH03 = makeShot('B03-SH03', (L, G): Frame => {
  const c = sh03Cam(L);
  const back: Pass = (p) => {
    paintVillageBack(p, c, {leafOpen: LEAF});
    let hand: Pt | undefined;
    girlAt(p, c, GIRL_G0, (g, u) => { const pz = lowHand(girlPose('frozen-hand', GIRL['travel-backpack'], g, u, 'front'), g, u, 1); hand = pz.rArm?.to; return pz; }, L < 56 ? 'scared' : L < 70 ? 'worried' : 'scared', 'travel-backpack', 841);
    const bob = L >= 4 && L <= 128 ? 0.01 * Math.sin((L / 12) * Math.PI * 2) : 0;
    // the nose goes to the hand (contact L4-128): lean target in metres from the dog's ground point, read off the hand's pixel
    dogAt(p, c, DOG_SNIFF, (g, u) => ({view: 'left', state: 'stand', wag: L > 110 ? 0.3 : 0, ...(hand && L >= 4 ? {lean: 0.9, leanAnchor: 'nose' as const, leanTo: [(g[0] - hand[0]) / u - 0.02, Math.min(0.62, (g[1] - hand[1]) / u) + bob] as [number, number]} : {headDown: 0.2})}), G);
    paintVillageFront(p, c);
  };
  return {paper: VILLAGE.yard, back};
});

// ------------------------------------------------------------------------------------------------ B04-SH01 the lick, the dog leaves
const sh04Cam = (L: number) => mixYCam(cam([0.3, 1.0, -0.2], 195, 2.6, 1.3, 1050, 700), cam([0.3, 1.0, -0.2], 188, 2.3, 1.3, 1050, 700), k01(L, 0, 43, (x) => x));
export const B04_SH01 = makeShot('B04-SH01', (L, G): Frame => {
  const c = sh04Cam(L);
  const back: Pass = (p) => {
    paintVillageBack(p, c, {leafOpen: LEAF});
    const shake = L >= 16 && L < 26 ? Math.sin(((L - 16) / 10) * Math.PI * 4) : 0, drop = k01(L, 22, 34);
    let hand: Pt | undefined;
    girlAt(p, c, GIRL_G0, (g, u) => {
      const def = GIRL['travel-backpack'], fh = lowHand(girlPose('frozen-hand', def, g, u, 'front'), g, u, 1);
      hand = fh.rArm?.to;
      const rArm = fh.rArm ? {...fh.rArm, to: [fh.rArm.to[0] + 0.07 * u * shake, fh.rArm.to[1] + 0.04 * u * Math.abs(shake)] as Pt} : undefined;
      return {...fh, rArm, rise: lerp(0.03, 0, drop)};
    }, L < 16 ? 'surprised' : 'relieved', 'travel-backpack', 841);
    const out = k01(L, 12, 40, (x) => x * x), lk = DOG18_LICK(L);
    dogAt(p, c, [lerp(DOG_SNIFF[0], 2.2, out), 0, lerp(DOG_SNIFF[2], -0.9, out)], (g, u) => ({view: 'left', state: 'stand', wag: 0.9, lick: lk, walk: L >= 20 ? (L / 9) % 1 : 0, gait: 'walk', ...(hand && L < 20 ? {lean: 0.9 * (1 - k01(L, 8, 20)), leanAnchor: 'nose' as const, leanTo: [(g[0] - hand[0]) / u - 0.03, Math.min(0.62, (g[1] - hand[1]) / u)] as [number, number]} : {})}), G);
    paintVillageFront(p, c);
  };
  return {paper: VILLAGE.yard, back};
});
void clamp; void outCubic; void poseFor;
