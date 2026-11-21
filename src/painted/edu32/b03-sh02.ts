import {capsule, hardFill, inkLine, openHandParts} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {mittenThumbSide} from '../kit/hand-gestures';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {BONE} from '../kit/cast';
import {shoulderAnchors} from '../kit/poses';
import {camPoint, camUnit, mixYCam, type YCam} from '../kit/ycam';
import {AGENT, MANNEQUIN_L, MANNEQUIN_R, TRENCH, paintFedora, paintRealCat, paintSeatedMannequin} from './cast';
import {SF, paintFieldBack, paintFieldBenchBack, paintFieldBenchSeat, paintFieldTree, paintNearGroundShade, paintNearLawn, paintShadedNearLawn, groundZAtRow, BAND_RAMP} from './field';
import {easeInOut, smooth} from './field-cat';
import {lead} from './looks';

// EDU-EP32-SHORT B03-SH02 "the AGENT on the radio" (timed sheet EDU-EP32-SHEET-R1, G [646, 689), 43 f; VD32-08, VD32-19; Boss G4, 2026-11-21).
// One plate EDU32-B03-SH02, Space F, overcast. AGENT real `man-parted + new: agent-1960s` front at (+3.6, 0, +2.4), outside the rope; the bench with
// the mannequins and the cat small at the left edge behind his pointing hand. Shot-local frame L = round(tl * 30).
// Arms (hand-drawing skill; front view: his RIGHT arm is screen-left, his LEFT arm screen-right):
//   AGENT LEFT hand, fist round `new: radio-handset-1960s` at his left ear (P20 mirrored), shows back, fingers up -> thumb clockwise = screen right
//     (`mittenThumbSide('left', 'back')` = +1 = `Arm.fist`). The kit flat fist is repainted over the handset (`Arm.onFlatFist`).
//   AGENT RIGHT hand, open mitten pointing screen-left at the bench (P05 mirrored, aimed a little down), shows palm, fingers screen-left -> thumb
//     clockwise = up (`mittenThumbSide('right', 'palm')` = +1), painted after the figure on the arm end (`Arm.noHand`).
// Talk L8-L40 (L07 AGENT "เป้าหมายอยู่ซ้าย… ซ้าย…" G654-G686), confident nod on the second "ซ้าย" (L27).

export const SH02_N = 43;
const DEG = Math.PI / 180;
export const SH02 = {talk: [8, 40], nod: 27} as const;
export const SH02_CAM0: YCam = {x: 3.5, y: 1.35, z: 5.1, yaw: -8 * DEG, pitch: 0, f: 900, hy: 560};
export const SH02_CAM1: YCam = {x: 3.45, y: 1.35, z: 4.8, yaw: -11 * DEG, pitch: 0, f: 900, hy: 560};
export const sh02Cam = (L: number): YCam => mixYCam(SH02_CAM0, SH02_CAM1, easeInOut(L / (SH02_N - 1)));
/** Caption band y 1230-1344: near-lawn shade steps in front of his feet (picture row, opacity). */
export const SH02_SHADE = {color: '#18221b', steps: BAND_RAMP};
/** Arm targets, metres from the shoulder anchors (y up). LEFT = P20's phone arm mirrored ([0.074, 0.218] via [0.254, 0.038]: both bones = `BONE`
 *  within 2 %, the fist at the side of the kit's large head so the handset's speaker sits on the ear). RIGHT = P05's point arm mirrored, straight
 *  (0.99 x 2 `BONE`), aimed 14 deg down at the bench. */
const POINT_DOWN = 14 * DEG, SH = shoulderAnchors(AGENT);
export const SH02_ARMS = {
  l: {to: [0.074, 0.218] as Pt, via: [0.254, 0.038] as Pt},
  r: {to: [-2 * BONE * 0.99 * Math.cos(POINT_DOWN), -2 * BONE * 0.99 * Math.sin(POINT_DOWN)] as Pt, via: [-BONE * Math.cos(POINT_DOWN), -BONE * Math.sin(POINT_DOWN)] as Pt},
};
export const SH02_THUMB = {l: mittenThumbSide('left', 'back'), r: mittenThumbSide('right', 'palm')} as const;

/** `new: radio-handset-1960s`: a brick walkie-talkie (0.07 x 0.2 m, olive-grey case, speaker slots at the top, a telescopic whip antenna from the top
 *  outer corner), upright against the ear; `grip` = the fist centre (px), `u` px per metre, `out` +1 = the antenna corner away from the face. */
export const paintRadioHandset = (p: Painter, seed: number, grip: Pt, u: number, out: 1 | -1) => {
  const w = 0.07 * u, h = 0.2 * u, x0 = grip[0] - w / 2, y0 = grip[1] - 0.13 * u, case_ = '#4a4f45', dark = '#2c2f2a';
  hardFill(p, seed, case_, [[x0, y0 + 0.01 * u], [x0 + w, y0 + 0.01 * u], [x0 + w, y0 + h], [x0, y0 + h]]);
  hardFill(p, seed + 1, mixColor(case_, '#c9cfc4', 0.22), [[x0 + 0.1 * w, y0 + 0.02 * u], [x0 + 0.42 * w, y0 + 0.02 * u], [x0 + 0.42 * w, y0 + h - 0.01 * u], [x0 + 0.1 * w, y0 + h - 0.01 * u]]);
  for (let k = 0; k < 4; k++) inkLine(p, seed + 2 + k, [[x0 + 0.2 * w, y0 + (0.03 + k * 0.012) * u], [x0 + 0.8 * w, y0 + (0.03 + k * 0.012) * u]], {color: dark, weight: Math.max(0.6, 0.004 * u), closed: false, still: true, curve: 0});
  hardFill(p, seed + 6, dark, capsule([x0 + w * (out > 0 ? 0.85 : 0.15), y0 + 0.012 * u], [x0 + w * (out > 0 ? 0.85 : 0.15), y0 - 0.01 * u], 0.016 * u, 0.016 * u, 4));
  const ax = x0 + w * (out > 0 ? 0.85 : 0.15);
  inkLine(p, seed + 7, [[ax, y0 - 0.01 * u], [ax + out * 0.02 * u, y0 - 0.26 * u]], {color: '#b8bcc0', weight: Math.max(1, 0.006 * u), closed: false, still: true, curve: 0});
  hardFill(p, seed + 8, '#d9dde0', capsule([ax + out * 0.02 * u, y0 - 0.26 * u], [ax + out * 0.02 * u, y0 - 0.265 * u], 0.008 * u, 0.008 * u, 4));
  inkLine(p, seed + 9, [[x0, y0 + 0.01 * u], [x0 + w, y0 + 0.01 * u], [x0 + w, y0 + h], [x0, y0 + h]], {color: dark, weight: 0.9, closed: true, still: true, curve: 0});
};

/** Open mitten (UT14) at the arm end `T` pointing along `ang`, thumb lobe on `side` (kit `openHandParts`, the shaped-arm hand). */
const paintOpenMitten = (p: Painter, seed: number, T: Pt, ang: number, k: number, side: 1 | -1, skin: string) => {
  const H = openHandParts(T, ang, k, side);
  hardFill(p, seed, skin, H.palm);
  const ink = mixColor(skin, '#3a2418', 0.55);
  inkLine(p, seed + 1, H.palm, {color: ink, weight: 1.0, closed: true, still: true, curve: 0.3});
  [...H.creases, H.thumbCrease].forEach((cr, i) => inkLine(p, seed + 2 + i, cr, {color: ink, weight: 0.9, closed: false, still: true, curve: 0.5}));
};

/** The B03-SH02 plate at shot frame L. */
export const paintB03SH02 = (p: Painter, L: number, id = 'B03-SH02') => {
  const c = sh02Cam(L), t = 1.0 + L / 30, light = 'overcast' as const, shade = 0.04;
  paintFieldBack(p, c, light);
  paintFieldTree(p, c, SF.treeR, 35000, light);
  paintFieldTree(p, c, SF.treeL, 35100, light);
  paintFieldBenchBack(p, c, light);
  paintFieldBenchSeat(p, c, light);
  paintRealCat(p, c, {at: SF.catSeat, t, pose: {view: 'left', state: 'sit'}}); // looking at MANNEQUIN L, as B03-SH03 opens
  paintSeatedMannequin(p, c, MANNEQUIN_L, {at: SF.manL, t, seed: 34100, coat: TRENCH.tan, shade});
  paintSeatedMannequin(p, c, MANNEQUIN_R, {at: SF.manR, t, seed: 34200, coat: TRENCH.grey, hat: true, shade});
  paintNearLawn(p, c, light, -Infinity, SF.agent[2]);
  // AGENT
  const g = camPoint(c, SF.agent)!, u = camUnit(c, SF.agent), S = SH;
  const px = (side: 'r' | 'l', q: Pt): Pt => [g[0] + (S[side][0] + q[0]) * u, g[1] - (S[side][1] + q[1]) * u];
  const talk = L >= SH02.talk[0] && L < SH02.talk[1];
  const nod = Math.sin(Math.PI * smooth((L - (SH02.nod - 3)) / 7));
  let redrawFist: ((q: Painter) => void) | null = null;
  const a = paintFigureAt(p, c, AGENT, {at: SF.agent, view: 'front', pose: 'P01', face: 'smug', t, seed: 34300, activity: talk ? 'talk' : false,
    shadow: {color: '#2c3324', op: 80},
    fig: {
      nod: [0, -0.07 * nod],
      lArm: {to: px('l', SH02_ARMS.l.to), via: px('l', SH02_ARMS.l.via), fist: SH02_THUMB.l, flatFist: true, onFlatFist: (r) => { redrawFist = r; }},
      rArm: {to: px('r', SH02_ARMS.r.to), via: px('r', SH02_ARMS.r.via), noHand: true},
      lHold: undefined, rHold: undefined,
    },
    held: (q, an) => {
      paintFedora(q, an, 34390);
      paintRadioHandset(q, 34400, px('l', SH02_ARMS.l.to), u, 1);
      (redrawFist as ((q: Painter) => void) | null)?.(q);
      const e = px('r', SH02_ARMS.r.via);
      paintOpenMitten(q, 34420, an.rHand, Math.atan2(an.rHand[1] - e[1], an.rHand[0] - e[0]), u, SH02_THUMB.r, AGENT.head.skin);
    }});
  if (a) lead(id, 'AGENT', {top: a.headTop - 0.2 * (a.chin - a.headTop), bottom: a.bottom});
  const zRamp = groundZAtRow(c, BAND_RAMP[0][0]);
  paintNearLawn(p, c, light, SF.agent[2], zRamp);
  paintNearGroundShade(p, c, 37200, SH02_SHADE.color, SH02_SHADE.steps);
  paintShadedNearLawn(p, c, light, zRamp, SH02_SHADE.color);
};
