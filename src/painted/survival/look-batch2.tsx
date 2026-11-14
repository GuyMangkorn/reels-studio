import type {ReactNode} from 'react';
import {camMove, camOf} from '../kit/cam-moves';
import {hardFill} from '../kit/draw';
import {paintFall} from '../kit/fall';
import {paintFigureAt} from '../kit/figure-at';
import {type Painter} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {camSpace, type YCam} from '../kit/ycam';
import {FPS, Mark, Painted, Vignette, label} from './frame';
import {paintCast, dressIsan, type Who} from './cast';
import {worldAt, type Light, type V3} from './core';
import {paintFlowerPopCard, flowerSlide} from './cards';
import {FlowerPopFrame} from './screens';
import {paintGreenSmoke, paintFire} from './fire';
import {paintMosquitoMacro, paintMozzieCloud} from './bugs';
import {PROP_IDS, PROPS, groundPropItem, paintCupOffered, paintGroundProp, paintHeldProp, paintPotOnFire, type PropId} from './props';
import {paintPterosaur, paintPterosaurShadow, pteroFlight} from './pterosaur';
import {RUNOFF, paintRoofRunoff} from './rain';
import {CAM16_16} from './look-assets';
import {paintRiver, RIVER_LIGHT} from './river';
import {paintShop} from './shop';
import {SURV_FACES, SURV_POSE_IDS} from './poses';
import {LIGHT, paintVillage} from './village';
import {paintUnder, NIGHT_IN} from './under';
import {CAM18_4} from './look-b';

// Boss batch 2 stills (14 Nov 2026): the new shared assets, shown in the shot framings of the storyboards (stills only, no timeline, voice or captions).
// Render: sh scripts/edu-series/ep16/render-looks.sh <version> B2-PTERO-1 B2-PTERO-2 ... (ids below); GUIDES=0 for the caption-zone measure.

// ------------------------------------------------------------------ N16-07 pterosaur swoop over the river (EP16 sh16, look-frame camera)
const PT_FIRST = 4, PT_LAST = 30, PT_GRAB = 14;
const c0 = camOf(CAM16_16, 14 / 81);
const kPos: V3 = [1.7, -0.1, -0.6];
// the net hand (character right, raised): from the probe in the first run; fixed here so the path is identical in every frame
const FISH_PX: [number, number] = [455, 705];
const grabWorld = worldAt(c0, FISH_PX[0], FISH_PX[1], camSpace(c0, kPos).d);
export const PASS = {from: worldAt(c0, 650, 260, 10), grab: grabWorld, to: worldAt(c0, 520, 380, 7), tGrab: (PT_GRAB - PT_FIRST) / (PT_LAST - PT_FIRST)};
const passU = (f: number) => (f - PT_FIRST) / (PT_LAST - PT_FIRST);
const paintPteroScene = (f: number) => (p: Painter) => {
  const c = camOf(CAM16_16, f / 81), t = (1294 + f) / FPS, L = RIVER_LIGHT.day, u = passU(f);
  const pose = pteroFlight(Math.min(1, Math.max(0, u)), PASS, 2.2);
  const snatched = f >= PT_GRAB;
  paintRiver(p, c, {mode: 'day', t, nets: [{at: [-3.8, -3.2], span: 1.8}, {at: [4.5, -5.2], span: 1.6}], extra: [
    {at: [pose.at[0], 0, pose.at[2]], bias: 3, draw: (q, cc) => { if (u > -0.05 && u < 1.05) paintPterosaurShadow(q, cc, pose, 0.02, 41900, 80); }},
    {at: kPos, draw: (q, cc) => { paintCast(q, cc, 'K', {at: kPos, view: 'front', pose: 'P07', face: snatched ? 'angry' : 'happy', t, shadow: {op: 30},
      held: (qq, a, uu) => { paintHeldProp(qq, 'hand-net', a.rHand, uu, {ang: 0.12}); if (!snatched) paintHeldProp(qq, 'fish', [a.rHand[0] + 0.1 * uu, a.rHand[1] - 0.68 * uu], uu, {ang: -0.5 + 0.4 * Math.sin(f * 1.3), swing: Math.sin(f * 1.7)}); }}); }},
    {at: [-1.2, -0.1, -2.4], draw: (q, cc) => { paintCast(q, cc, 'V', {at: [-1.2, -0.1, -2.4], view: 'left', pose: 'P01', face: 'laugh', t}); }},
  ]});
  void L;
  if (u > -0.05 && u < 1.05) {
    const a = paintPterosaur(p, c, pose, L, 41000);
    if (snatched && f < PT_GRAB + 14 && a.feet) paintHeldProp(p, 'fish', a.feet, camSpace(c, pose.at).d > 0 ? 880 / camSpace(c, pose.at).d : 300, {ang: 1.2, swing: Math.sin(f * 2)});
  }
};


// ------------------------------------------------------------------ N16-07 pterosaur turnaround (UT16): front 3/4, side, rear 3/4, glide and dive
const paintPteroSheet = (p: Painter) => {
  hardFill(p, 91000, '#cfdcc4', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  const rows = [330, 960, 1590];
  const cam = (r: number): YCam => ({x: 0, y: 3.4, z: 7, yaw: 0, f: 1400, hy: rows[r] - (2.5 * 1400) / 7});
  const L = RIVER_LIGHT.day;
  const views: [number, number, number, number][] = [[0.95, 0.05, 0.1, 0.2], [0, 0.05, 0.1, 0.2], [-2.2, 0.25, 0.1, 0.3]];
  views.forEach(([h, pitch, bank, fold], r) => { [0, 1].forEach((k) => {
    const at: V3 = [k ? 1.5 : -1.5, 0.9, 0];
    paintPterosaur(p, cam(r), {at, heading: h + (k ? 0.0 : 0), pitch, bank: k ? -bank : bank, flap: k ? 0.3 : 0, amp: k ? 0.5 : 0.05, fold: k ? fold : 0, span: 2.2}, L, 41000 + r * 50 + k);
  }); });
};

// ------------------------------------------------------------------ N16-09 flower-pop card
const FOREST_PLATE = (p: Painter) => {
  const c = camOf(camMove([6, 2.3, -20.5], [-24, -24], [8, 8], 0.8, {f: 1000, hy: 880}), 0);
  paintVillage(p, c, {mode: 'morning', t: 1});
};
const paintFlower = (f: number) => (p: Painter) => { FOREST_PLATE(p); paintFlowerPopCard(p, f); };

// ------------------------------------------------------------------ N16-13, N18-09 poses: sheet
const rowCam = (row: number, f = 1500): YCam => ({x: 0, y: 0.85, z: 6, yaw: 0, f, hy: 330 + row * 520 - (0.85 * f) / 6});
const paintPoses = (p: Painter) => {
  const gys = [560, 1080, 1600];
  hardFill(p, 90000, '#e6dcc2', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  gys.forEach((gy, r) => hardFill(p, 90001 + r, '#c9b48e', [[0, gy], [1080, gy], [1080, gy + 40], [0, gy + 40]]));
  const cam = (r: number): YCam => ({x: 0, y: 0.85, z: 6, yaw: 0, f: 1500, hy: gys[r] - (0.85 * 1500) / 6});
  const at = (i: number, n: number): V3 => [-1.9 + (3.8 * (i + 0.5)) / n, 0, 0];
  // row 0: mime-stir (two phases), rub-hand (two phases)
  [0, 0.25].forEach((ph, i) => paintCast(p, cam(0), 'K', {at: at(i, 4), spose: 'mime-stir', sph: ph, face: 'smug', t: 0.4, shadow: {op: 40}}));
  [0, 0.5].forEach((ph, i) => paintCast(p, cam(0), 'K', {at: at(i + 2, 4), spose: 'rub-hand', sph: ph, face: i ? 'sad' : 'ouch', t: 0.4, shadow: {op: 40}}));
  // row 1: arms-wide k 0, 0.5, 1 and belly-lie
  [0, 0.5, 1].forEach((k, i) => paintCast(p, cam(1), 'K', {at: at(i, 4), spose: 'arms-wide', sk: k, face: 'happy', t: 0.4, shadow: {op: 40}}));
  paintCast(p, cam(1), 'K', {at: [at(3, 4)[0] + 0.45, 0, 0], spose: 'belly-lie', face: 'sad', t: 0.4, shadow: {op: 40}});
  // row 2: Y cup-offer + K sip-lean as the pair (shot 19), guilty smile close
  paintCast(p, cam(2), 'Y', {at: [-1.45, 0, 0], spose: 'cup-offer', sdir: 1, face: 'worried', t: 0.4, shadow: {op: 40}, held: (q, a, u) => paintCupOffered(q, a.lHand, u, 1)});
  paintCast(p, cam(2), 'K', {at: [-0.55, 0, 0], spose: 'sip-lean', sdir: -1, face: 'tired', faceState: SURV_FACES['guilty-smile'], t: 0.4, shadow: {op: 40}});
  paintCast(p, {x: 0, y: 1.0, z: 1.9, yaw: 0, f: 1500, hy: 1518}, 'K', {at: [0.4, 0, 0], pose: 'P01', face: 'tired', faceState: SURV_FACES['guilty-smile'], t: 0.4, shadow: false});
};
const PoseLabels = () => (
  <>
    <div style={label(20, 8, 24)}>mime-stir (ph 0, 0.25) · rub-hand (ph 0, 0.5)</div>
    <div style={label(20, 535, 24)}>arms-wide k 0 / 0.5 / 1 · belly-lie</div>
    <div style={label(20, 1048, 24)}>cup-offer (ยาย) + sip-lean (เก่ง) + guilty-smile (close, right)</div>
    <div style={label(20, 1650, 24)}>poses: P10+P26 / P10+P42 / P05+P08 / P37 / P34+P18 / P33+P19</div>
  </>
);

// ------------------------------------------------------------------ props sheet: every PROPS id on a plain plate
const DIM: Record<string, number> = {hoe: 1.2, sack: 0.6, knife: 0.33, 'seed-sack': 0.34, 'coconut-scoop': 0.38, 'rice-bowl': 0.15, 'hand-net': 1.15, fish: 0.24, 'fish-sticks': 0.62, 'koi-bowl': 0.24, calendar: 0.46, 'eggs-apron': 0.3,
  'necklace-nail': 0.25, axe: 0.8, 'chop-block': 0.45, 'log-wet': 0.7, 'log-dry': 0.85, bucket: 0.46, 'pot-big': 0.85, tarp: 1.5, 'banana-leaf': 1.3, matches: 0.12, 'green-leaves': 0.35, bottle: 0.31, teaspoon: 0.15,
  'pot-small': 0.25, cup: 0.12, cloth: 0.27, 'basin-bowl': 0.28, 'hand-fan': 0.45, 'pill-box': 0.17};
const COLS = 6, CW = 172, CH = 300;
const cellOf = (i: number): [number, number] => [(i % COLS) * CW + CW / 2 + 14, 130 + Math.floor(i / COLS) * CH + 215];
const paintProps = (p: Painter) => {
  hardFill(p, 91000, '#e6dcc2', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  PROP_IDS.forEach((id, i) => {
    const [x, y] = cellOf(i), dim = DIM[id] ?? 0.4, u = 130 / dim;
    hardFill(p, 91010 + i, '#d6c6a0', [[x - 76, y], [x + 76, y], [x + 76, y + 6], [x - 76, y + 6]]);
    const top = id === 'necklace-nail' || id === 'calendar';
    const opts = id === 'bucket' ? {level: 0.7} : id === 'hand-fan' ? {swing: 0.3} : id === 'cup' ? {dir: 1 as const} : {};
    const gr = PROPS[id].grip;
    paintHeldProp(p, id, [x + gr[0] * u, y - gr[1] * u], u, {...opts, seed: 91100});
    void top; void paintGroundProp;
  });
};
const PropLabels = () => (
  <>
    <div style={label(14, 8, 28)}>PROPS (33): grip on hand, base on ground · batch 2</div>
    {PROP_IDS.map((id, i) => { const [x, y] = cellOf(i); return <div key={id} style={{...label(x - 80, y + 12, 17), width: 160, textAlign: 'center', fontWeight: 700}}>{id}</div>; })}
  </>
);
// held on figures: six people holding series props
const paintHeld = (p: Painter) => {
  hardFill(p, 92000, '#e6dcc2', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  const rows = [560, 1180, 1800];
  rows.forEach((gy, r) => hardFill(p, 92001 + r, '#c9b48e', [[0, gy], [1080, gy], [1080, gy + 40], [0, gy + 40]]));
  const cam = (r: number): YCam => ({x: 0, y: 0.85, z: 6, yaw: 0, f: 1500, hy: rows[r] - (0.85 * 1500) / 6});
  const place = (r: number, i: number, n: number, who: Who, pose: 'P01' | 'P07' | 'P05' | 'P10' | 'P18', draw: (q: Painter, a: {rHand: [number, number]; lHand: [number, number]}, u: number) => void, face: 'happy' | 'neutral' | 'worried' = 'neutral') =>
    paintCast(p, cam(r), who, {at: [-1.75 + (3.5 * (i + 0.5)) / n, 0, 0], view: 'front', pose, face, t: 0.4, shadow: {op: 40}, held: (q, a, u) => draw(q, a, u)});
  place(0, 0, 4, 'V', 'P01', (q, a, u) => paintHeldProp(q, 'hoe', a.lHand, u, {ang: 0.0}));
  place(0, 1, 4, 'K', 'P07', (q, a, u) => paintHeldProp(q, 'fish', a.rHand, u, {ang: 0.3}), 'happy');
  place(0, 2, 4, 'Y', 'P01', (q, a, u) => { paintHeldProp(q, 'eggs-apron', a.rHand, u); }, 'happy');
  place(0, 3, 4, 'V', 'P01', (q, a, u) => paintHeldProp(q, 'axe', a.rHand, u, {ang: 0.0}));
  place(1, 0, 4, 'K', 'P01', (q, a, u) => paintHeldProp(q, 'bottle', a.rHand, u));
  place(1, 1, 4, 'Y', 'P01', (q, a, u) => paintHeldProp(q, 'green-leaves', a.lHand, u, {ang: 0.2}));
  place(1, 2, 4, 'Y', 'P01', (q, a, u) => paintHeldProp(q, 'hand-fan', a.rHand, u, {swing: 0.5}));
  place(1, 3, 4, 'K', 'P01', (q, a, u) => paintHeldProp(q, 'fish-sticks', a.rHand, u, {ang: 0.15}));
  place(2, 0, 4, 'Y', 'P01', (q, a, u) => paintHeldProp(q, 'knife', a.rHand, u, {ang: 0.9}));
  place(2, 1, 4, 'Y', 'P01', (q, a, u) => paintHeldProp(q, 'cup', a.lHand, u, {dir: 1}));
  place(2, 2, 4, 'K', 'P01', (q, a, u) => paintHeldProp(q, 'seed-sack', a.rHand, u));
  place(2, 3, 4, 'V', 'P01', (q, a, u) => paintHeldProp(q, 'sack', a.lHand, u));
};
const HeldLabels = () => (
  <>
    <div style={label(20, 8, 24)}>ถือในมือ: จอบ · ปลา · ไข่ในผ้ากันเปื้อน · ขวาน</div>
    <div style={label(20, 628, 24)}>ขวด 1 ลิตร · ใบไม้เขียว · พัด · ปลาเสียบไม้</div>
    <div style={label(20, 1248, 24)}>มีด · ถ้วย · ถุงเมล็ด · กระสอบ</div>
  </>
);

// ------------------------------------------------------------------ N18-03 SET-SHOP (EP18 sh9 and sh10)
const CAM18_9 = camMove([0.6, 1.4, -1.2], [20, 8], [3.2, 2.6], 1.45, {f: 880, hy: 940, ease: [0, 1]});
const CAM18_10 = camMove([1, 1.4, -2.2], [15, 8], [1.3, 1.15], 1.4, {f: 950, hy: 940, ease: [0, 1]});
const KEEPER = dressIsan(PEOPLE['woman-bob'], 'isan-home-woman');
const paintShop9 = (p: Painter) => {
  const c = camOf(CAM18_9, 60 / 99), t = (528 + 60) / FPS;
  paintShop(p, c, {t, stock: 'few', extra: [
    {at: [0.4, 0, -1.6], draw: (q, cc) => { paintFigureAt(q, cc, KEEPER, {at: [0.4, 0, -1.6], view: 'back', pose: 'P16', face: 'worried', t, tint: {to: '#12121e', u: 0.3}}); }},
    {at: [0.4, 0, -0.5], draw: (q, cc) => { paintCast(q, cc, 'Y', {at: [0.4, 0, -0.5], view: 'front', pose: 'P01', face: 'worried', t, tint: {to: '#12121e', u: 0.25}}); }},
  ]});
};
const paintShop10 = (p: Painter) => {
  const c = camOf(CAM18_10, 42 / 73), t = (627 + 42) / FPS;
  paintShop(p, c, {t, stock: 'bare', curtain: 'off'});
};

// ------------------------------------------------------------------ N17-05 mosquitoes (EP17 sh16 cloud, sh17 macro)
const CAM17_16 = camMove([0.8, 1, 1], [200, 192], [3.4, 2.8], 1, {f: 880, hy: 960, ease: [0, 1]});
const paintMozz16 = (p: Painter) => {
  const c = camOf(CAM17_16, 41 / 96), t = (1126 + 41) / FPS;
  paintRiver(p, c, {mode: 'dusk', t, extra: [{at: [1.0, 0, 1.2], draw: (q, cc) => { paintCast(q, cc, 'K', {at: [1.0, 0, 1.2], view: 'back', pose: 'P01', face: 'ouch', t, tint: {to: '#e8a070', u: 0.12}}); }}]});
  paintMozzieCloud(p, c, {at: [0.3, 1.25, -0.4], toward: [0.95, 1.2, 1.0], drift: 0.9, t, n: 54, radius: 0.6});
};
const CAM17_17 = camMove([-1.5, 0.62, 1], [80, 72], [0.06, 0.05], 0.63, {f: 1000, hy: 960, near: 0.02, ease: [0, 1]});
const paintMozz17 = (p: Painter) => {
  const c = camOf(CAM17_17, 20 / 77), t = (1222 + 20) / FPS;
  paintRiver(p, c, {mode: 'dusk', t});
  paintMosquitoMacro(p, c, [-1.5, 0.62, 1.0], {t, s: -1});
};

// ------------------------------------------------------------------ N17-07 roof run-off (EP17 sh13)
const CAM17_13 = camMove([-6.5, 1.2, -4], [15, 8], [6, 5.2], 1.3, {f: 820, hy: 840, ease: [0, 1]});
const RAIN_L: Light = {amb: '#9aa8ae', k: 0.3};
const paintRunoff13 = (p: Painter) => {
  const c = camOf(CAM17_13, 45 / 51), t = (877 + 45) / FPS;
  paintVillage(p, c, {mode: 'morning', t, light: RAIN_L, extra: [
    groundPropItem('bucket', RUNOFF.land, {level: 0.5, seed: 93000}),
    {at: [-5.3, 0, 0.2], draw: (q, cc) => { paintCast(q, cc, 'K', {at: [-5.3, 0, 0.2], view: 'front', pose: 'P01', face: 'worried', t, tint: {to: '#8a9aa4', u: 0.25}}); }},
    {at: [-6.5, 0, 0.4], draw: (q, cc) => paintRoofRunoff(q, cc, {t, landAt: [RUNOFF.land[0], 0.3, RUNOFF.land[2]]})},
  ]});
  paintFall(p, 'rain', {width: 1080, height: 1920, t, seed: 3, style: {count: 150}});
};

// ------------------------------------------------------------------ N17-08 smoke (EP17 sh18)
const CAM17_18 = camMove([-1, 1.2, 1.5], [-30, -40], [4, 3.4], 1.3, {f: 850, hy: 860, ease: [0, 1]});
const FIRE17: V3 = [-1, 0, 1.5];
const paintSmoke18 = (p: Painter) => {
  const c = camOf(CAM17_18, 88 / 126), t = (1299 + 88) / FPS;
  const L = {amb: '#e8b890', k: 0.3};
  paintVillage(p, c, {mode: 'morning', t, light: L, extra: [
    {at: FIRE17, draw: (q, cc) => paintFire(q, cc, FIRE17, t)},
    {at: [-1.6, 0, 2.2], draw: (q, cc) => { paintCast(q, cc, 'Y', {at: [-1.6, 0, 2.2], view: 'right', pose: 'P34', face: 'happy', t, held: (qq, a, u) => paintHeldProp(qq, 'green-leaves', a.rHand, u)}); }},
  ]});
  paintGreenSmoke(p, c, FIRE17, t, {amount: 1});
  paintMozzieCloud(p, c, {at: [1.8, 2.0, 1.0], t, n: 46, radius: 0.7, thin: 0.75, color: '#2a2622'});
};
const POTS_CAM = camMove([2.5, 1.2, 3], [-10, -10], [6, 6], 1.2, {f: 820, hy: 860});
const paintPots = (p: Painter) => {
  const c = camOf(POTS_CAM, 0), t = 1;
  paintVillage(p, c, {mode: 'morning', t, extra: [0.6, 2.4, 4.2, 6.0].map((x, i) => ({at: [x, 0, 3] as V3, draw: (q: Painter, cc: YCam) => paintPotOnFire(q, cc, [x, 0, 3], t + i * 0.2, {seed: 51000 + i * 1000})}))});
};

export const LOOKS_D: Record<string, () => ReactNode> = {
  'B2-PTERO-SHEET': () => <Painted paint={paintPteroSheet} frame={0} paper="#cfdcc4" overlay={<Mark />} />,
  'B2-PTERO-1': () => <Painted paint={paintPteroScene(6)} frame={6} paper="#cfdcc4" overlay={<Mark />}><Vignette level={0.2} id="vb1" /></Painted>,
  'B2-PTERO-2': () => <Painted paint={paintPteroScene(11)} frame={11} paper="#cfdcc4" overlay={<Mark />}><Vignette level={0.2} id="vb2" /></Painted>,
  'B2-PTERO-3': () => <Painted paint={paintPteroScene(14)} frame={14} paper="#cfdcc4" overlay={<Mark />}><Vignette level={0.2} id="vb3" /></Painted>,
  'B2-PTERO-4': () => <Painted paint={paintPteroScene(22)} frame={22} paper="#cfdcc4" overlay={<Mark />}><Vignette level={0.2} id="vb4" /></Painted>,
  'B2-FLOWER-30': () => <Painted paint={paintFlower(30)} frame={30} paper="#2a3a2a" overlay={<><Mark /><FlowerPopFrame slide={flowerSlide(30)} /></>} />,
  'B2-FLOWER-90': () => <Painted paint={paintFlower(90)} frame={90} paper="#2a3a2a" overlay={<><Mark /><FlowerPopFrame slide={1} /></>} />,
  'B2-POSES': () => <Painted paint={paintPoses} band={false} paper="#e6dcc2" overlay={<PoseLabels />} />,
  'B2-PROPS': () => <Painted paint={paintProps} band={false} paper="#e6dcc2" overlay={<PropLabels />} />,
  'B2-HELD': () => <Painted paint={paintHeld} band={false} paper="#e6dcc2" overlay={<HeldLabels />} />,
  'B2-SHOP-9': () => <Painted paint={paintShop9} frame={60} paper="#12161f" overlay={<Mark />}><Vignette level={0.35} id="vb9" /></Painted>,
  'B2-SHOP-10': () => <Painted paint={paintShop10} frame={42} paper="#12161f" overlay={<Mark />}><Vignette level={0.35} id="vb10" /></Painted>,
  'B2-MOZZ-16': () => <Painted paint={paintMozz16} frame={41} paper="#e8c0a0" overlay={<Mark />}><Vignette level={0.2} id="vb16" /></Painted>,
  'B2-MOZZ-17': () => <Painted paint={paintMozz17} frame={20} paper="#e8c0a0" overlay={<Mark />}><Vignette level={0.15} id="vb17" /></Painted>,
  'B2-RUNOFF-13': () => <Painted paint={paintRunoff13} frame={45} paper="#9aa8ae" overlay={<Mark />}><Vignette level={0.25} id="vb13" /></Painted>,
  'B2-SMOKE-18': () => <Painted paint={paintSmoke18} frame={88} paper="#cfdcc4" overlay={<Mark />}><Vignette level={0.25} id="vb18" /></Painted>,
  'B2-POTS-12': () => <Painted paint={paintPots} frame={0} paper="#cfdcc4" overlay={<Mark />} />,
};
void paintUnder; void NIGHT_IN; void CAM18_4; void SURV_POSE_IDS; void paintGroundProp;
