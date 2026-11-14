import type {ReactNode} from 'react';
import {camMove, camOf} from '../kit/cam-moves';
import {hardFill} from '../kit/draw';
import type {Painter} from '../kit/painter';
import {paintSkyBands} from '../kit/sky';
import {paintCast, type Who} from './cast';
import type {Light, YCam} from './core';
import {paintLongNeckHerd} from './creatures';
import {paintFire} from './fire';
import {FPS, Mark, Painted, Vignette, label} from './frame';
import {HEN_MOTION_IDS, paintHenMotion} from './hen';
import {basket, paintPhoneHeld, paintTorchBeam} from './props';
import {paintRiver, RIVER_LIGHT} from './river';
import {PhoneScreen, RecipeCard, RuleSign, Safety} from './screens';
import {paintSkyRipple} from './sky';

// Boss hardening stills (14 Nov 2026): the shared assets that had no Film look frame (river, hen motions, far herd, fire layer, belt checks, screen layers).
// Render: sh scripts/edu-series/ep16/render-looks.sh <version> LF16-RIVER AS-SURV-KIT AS-SURV-SCREENS

// ------------------------------------------------------------------ LF16-RIVER: EP16 shot 16 framing (+14): villagers in the shallows, K at the net
export const CAM16_16 = camMove([0.5, 1.0, -2], [0, 0], [3.6, 3.4], 1.55, {f: 860, hy: 880, ease: [0, 1]});
const paintRiverShot = (p: Painter) => {
  const c = camOf(CAM16_16, 14 / 81), t = 1308 / FPS, L = RIVER_LIGHT.day;
  paintRiver(p, c, {mode: 'day', t, nets: [{at: [-3.8, -3.2], span: 1.8}, {at: [4.5, -5.2], span: 1.6}], extra: [
    {at: [1.7, -0.15, -0.6], draw: (q, cc) => { paintCast(q, cc, 'K', {at: [1.7, -0.15, -0.6], view: 'right', pose: 'P01', face: 'happy', t, shadow: {op: 30}}); }},
    {at: [-1.2, -0.1, -2.4], draw: (q, cc) => { paintCast(q, cc, 'V', {at: [-1.2, -0.1, -2.4], view: 'left', pose: 'P01', face: 'neutral', t}); }},
    {at: [3.1, 0, 0.9], draw: (q, cc) => { paintCast(q, cc, 'Y', {at: [3.1, 0, 0.9], view: 'left', pose: 'P01', face: 'happy', t, held: (qq, a, u) => basket(qq, a.lHand, u)}); }},
  ]});
  void L;
};

// ------------------------------------------------------------------ AS-SURV-KIT: belt checks, hen motions, fire layer, far herd, torch, phone, sky ripple
const paintKit = (p: Painter) => {
  const L: Light = {amb: '#e8e2d0', k: 0.02};
  hardFill(p, 30000, '#e6dcc2', [[0, 0], [1080, 0], [1080, 1000], [0, 1000]]);
  // row 0 (ground y 720): Isan outfits in front and back view (belt checks follow the belt)
  const c0: YCam = {x: 0, y: 0.95, z: 6, yaw: 0, f: 1500, hy: 720 - (0.95 * 1500) / 6};
  hardFill(p, 30001, '#c9b48e', [[0, 720], [1080, 720], [1080, 770], [0, 770]]);
  ([['Y', 'front'], ['Y', 'back'], ['V', 'front'], ['V', 'back'], ['K', 'front']] as [Who, 'front' | 'back'][]).forEach(([who, view], i) =>
    paintCast(p, c0, who, {at: [-1.6 + i * 0.8, 0, 0], view, pose: 'P01', face: 'neutral', t: 0.4, shadow: {op: 40}}));
  // row 1 (ground y 975): hen motions, one frame of each loop
  hardFill(p, 30010, '#c9b48e', [[0, 975], [1080, 975], [1080, 1000], [0, 1000]]);
  const c1: YCam = {x: 0, y: 0.5, z: 3.2, yaw: 0, f: 1300, hy: 975 - (0.5 * 1300) / 3.2};
  HEN_MOTION_IDS.forEach((id, i) => paintHenMotion(p, c1, [-1.05 + i * 0.42, 0, 0], i % 2 ? 'left' : 'right', id, id === 'cluck' ? 0.05 : 0.35 + 0.1 * i, L, 31000 + i * 200));
  // row 2 (y 1000-1500): far herd over a dusk plain (right), fire layer on a night panel (left)
  paintSkyBands(p, {from: '#4a4a78', via: '#c98a6a', to: '#f0c890', horizon: 1360, width: 1080, top: 1000, viaAt: 0.55, bands: 7, style: 'flat'});
  hardFill(p, 30021, '#5a5a4a', [[0, 1360], [1080, 1360], [1080, 1500], [0, 1500]]);
  paintLongNeckHerd(p, {x0: 580, x1: 1040, base: 1372, h: 130, n: 6, color: '#4a3e48', seed: 32000, drink: 0.4});
  hardFill(p, 30020, '#121830', [[0, 1000], [540, 1000], [540, 1500], [0, 1500]]);
  paintFire(p, {x: 0, y: 1.2, z: 6, yaw: 0, f: 1400, hy: 1160, cx: -250}, [0, 0, 0], 0.7);
  // row 3 (y 1500-1920): sky ripple and a phone torch beam from the hand
  hardFill(p, 30030, '#151a2a', [[0, 1500], [1080, 1500], [1080, 1920], [0, 1920]]);
  paintSkyRipple(p, {cx: 780, cy: 1700, t: 0.6, speed: 1.6, glow: 0.4, seed: 33000});
  paintTorchBeam(p, [160, 1700], [470, 1860]);
  paintPhoneHeld(p, [160, 1705], 700, 0.6);
};
const KitLabels = () => (
  <>
    <div style={label(20, 8, 24)}>ยาย/ชาวบ้าน/เก่ง: Gear.belt.checks (หน้า-หลัง)</div>
    <div style={label(20, 728, 24)}>ไก่: idle · peck · trot · head-tilt · huddle · cluck</div>
    <div style={{...label(20, 1010, 24), color: '#e9dfc8'}}>ENV-FIRE (paintFire)</div>
    <div style={label(560, 1010, 24)}>ฝูงไกล (paintLongNeckHerd)</div>
    <div style={{...label(20, 1510, 24), color: '#e9dfc8'}}>torch beam + phone · sky ripple</div>
  </>
);

// ------------------------------------------------------------------ AS-SURV-SCREENS: rule sign, phone screen, recipe chip on a plain plate
const paintPlain = (p: Painter) => hardFill(p, 34000, '#2a2e3c', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
const LOOKS_C: Record<string, () => ReactNode> = {
  'LF16-RIVER': () => <Painted paint={paintRiverShot} frame={1308} paper="#cfdcc4" overlay={<Mark />}><Vignette level={0.2} id="v16r" /></Painted>,
  'AS-SURV-KIT': () => <Painted paint={paintKit} band={false} paper="#e6dcc2" overlay={<KitLabels />} />,
  'AS-SURV-SCREENS': () => (
    <Painted paint={paintPlain} band={false} paper="#2a2e3c" overlay={<><Mark /><RuleSign lines={['กฎข้อ 1', 'ไม่รู้ว่ากินได้ อย่าแตะ']} top={420} /><PhoneScreen x={300} y={900} w={190} /><PhoneScreen x={560} y={900} w={190} state="wake" /><RecipeCard chip /><Safety top={1180} line2={1294} /></>} />
  ),
};
export {LOOKS_C};
