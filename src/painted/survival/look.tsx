import type {ReactNode} from 'react';
import {camMove, camOf} from '../kit/cam-moves';
import {hardFill} from '../kit/draw';
import {mixColor, type Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import {paintCast, type Who} from './cast';
import {cell} from './core';
import {paintHen, paintHenCard, paintHenFootCU} from './hen';
import {basket} from './props';
import {LIGHT, paintVillage} from './village';
import {FPS, Painted, Vignette, label} from './frame';

// EDU-EP16..18 look stills (W3, Film): the new looks of the survival series. Stills only (no timeline, voice or captions); the dashed band marks
// the caption band y 1176-1344 (off with --props='{"guides":false}' for the caption-zone measure).
// Render: sh scripts/edu-series/ep16/render-looks.sh <version> [IDS]

// ------------------------------------------------------------------ EP16 shot 1 (+60) and shot 2 (+80)
// W3 proposal (Film, sheet R1.1 pending): shots 1-2 look across the flooded empty paddy at the village (UT01/UT03: the lower frame is water that mirrors the sky).
export const CAM16_1 = camMove([0, 2, -6], [62, 59], [22, 20.5], 1.6, {f: 820, hy: 880, ease: [0, 1]});
export const CAM16_2 = camMove([[0, 2, -6], [2, 1.5, -10]], [59, 40], [20.5, 13], [1.6, 1.5], {f: 820, hy: 880, ease: [0, 1]});

const paintNight = (p: Painter) => {
  const c = camOf(CAM16_1, 60 / 91);
  paintVillage(p, c, {mode: 'night', t: 60 / FPS, ripple: {speed: 1.6, glow: 0.55}});
};
const paintMorning = (p: Painter) => {
  const c = camOf(CAM16_2, 80 / 124), L = LIGHT.morning;
  paintVillage(p, c, {mode: 'morning', t: 172 / FPS, extra: [
    {at: [2.1, 0, -11.6], draw: (q, cc) => { paintCast(q, cc, 'K', {at: [2.1, 0, -11.6], view: 'back', pose: 'P01', t: 2.9, face: 'worried', held: (qq, a, u) => basket(qq, a.lHand, u, true)}); }},
    {at: [3.2, 0, -3.9], draw: (q, cc) => { paintHen(q, cc, [3.2, 0, -3.9], {view: 'right'}, L, 16000); }},
    {at: [4.9, 0, -3.7], draw: (q, cc) => { paintHen(q, cc, [4.9, 0, -3.7], {view: 'left', peck: 0.8}, L, 16200); }},
    {at: [6.6, 0, -1.3], draw: (q, cc) => { paintHen(q, cc, [6.6, 0, -1.3], {view: 'right', peck: 0.7}, L, 16600); }},
    {at: [6.0, 0, -0.6], draw: (q, cc) => { paintHen(q, cc, [6.0, 0, -0.6], {view: 'front', tilt: -14}, L, 16800); }},
    {at: [2.5, 0, -6.6], draw: (q, cc) => { paintHen(q, cc, [2.5, 0, -6.6], {view: 'front', tilt: 12}, L, 16400); }},
  ]});
};
// ------------------------------------------------------------------ approval sheet: cast in four views
const rowCam = (row: number, f = 1700): YCam => ({x: 0, y: 0.85, z: 6, yaw: 0, f, hy: 560 + row * 600 - (0.85 * f) / 6});
const paintCastSheet = (p: Painter) => {
  const rows: Who[] = ['Y', 'K', 'V'];
  rows.forEach((who, r) => {
    const c = rowCam(r), gy = 560 + r * 600;
    hardFill(p, 18000 + r, mixColor('#e9dfc8', '#c8b48e', 0.3), [[30, gy - 520], [1050, gy - 520], [1050, gy + 50], [30, gy + 50]]);
    hardFill(p, 18010 + r, '#b39a72', [[30, gy - 10], [1050, gy - 10], [1050, gy + 50], [30, gy + 50]]);
    (['front', 'right', 'back', 'left'] as const).forEach((view, i) => {
      const x = -1.53 + i * 1.02;
      paintCast(p, c, who, {at: [x, 0, 0], view, pose: 'P01', face: who === 'K' ? 'happy' : 'neutral', t: 0.4 + i * 0.3, shadow: {op: 50}});
    });
  });
};
const CastLabels = () => (
  <>
    {['ยาย · woman-elder + isan-home', 'เก่ง · boy-school + kid-home', 'ชาวบ้าน · man-elder + isan-home'].map((t, r) => <div key={t} style={label(50, 52 + r * 600, 30)}>{t}</div>)}
    {['front', 'right', 'back', 'left'].map((v, i) => <div key={v} style={{...label(150 + i * 289, 1790, 26), color: '#e9dfc8'}}>{v}</div>)}
  </>
);

// ------------------------------------------------------------------ approval sheet: the hen
const paintHenSheet = (p: Painter) => {
  const L = {amb: '#e8e2d0', k: 0};
  hardFill(p, 18100, '#e9dfc8', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  hardFill(p, 18101, '#c9b48e', [[0, 690], [1080, 690], [1080, 760], [0, 760]]);
  paintHenCard(p, {g: [330, 700], u: 1350, s: 1}, {view: 'right'}, L, 16000);
  paintHenCard(p, {g: [800, 700], u: 1100, s: 1}, {view: 'right', tilt: 22}, L, 16100);
  hardFill(p, 18102, '#c9b48e', [[0, 1200], [1080, 1200], [1080, 1250], [0, 1250]]);
  paintHenCard(p, {g: [150, 1210], u: 900, s: 1}, {view: 'front'}, L, 16200);
  paintHenCard(p, {g: [400, 1210], u: 900, s: 1}, {view: 'front', tilt: 20}, L, 16300);
  paintHenCard(p, {g: [650, 1210], u: 900, s: 1}, {view: 'back'}, L, 16400);
  paintHenCard(p, {g: [910, 1210], u: 900, s: -1}, {view: 'left', peck: 0.9}, L, 16500);
  hardFill(p, 18103, '#b39a72', [[0, 1700], [1080, 1700], [1080, 1920], [0, 1920]]);
  paintHenFootCU(p, {g: [300, 1720], u: 3200, s: 1}, L);
  paintHenCard(p, {g: [780, 1720], u: 1000, s: -1}, {view: 'left', lift: 1, fluff: 0.3}, L, 16600);
  void cell;
};
const HenLabels = () => (
  <>
    <div style={label(40, 40, 30)}>ไก่บ้าน (K01) · 0.42 m · side / head-tilt</div>
    <div style={label(40, 790, 30)}>front · front tilt · back · peck</div>
    <div style={label(40, 1290, 30)}>three-toed foot (shot 20 proof) · lifted foot, fluffed</div>
  </>
);

export const LOOKS_A: Record<string, () => ReactNode> = {
  'LF16-VIL-NIGHT': () => <Painted paint={paintNight} frame={60} paper="#0f1530"><Vignette level={0.35} id="v1" /></Painted>,
  'LF16-VIL-MORN': () => <Painted paint={paintMorning} frame={172} paper="#cfdcc4"><Vignette level={0.2} id="v2" /></Painted>,
  'AS-CAST': () => <Painted paint={paintCastSheet} band={false} paper="#3a332c" overlay={<CastLabels />} />,
  'AS-HEN': () => <Painted paint={paintHenSheet} band={false} paper="#e9dfc8" overlay={<HenLabels />} />,
};
