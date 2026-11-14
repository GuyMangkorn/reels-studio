import type {ReactNode} from 'react';
import {camMove, camOf} from '../kit/cam-moves';
import {hardFill, inkLine} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paintSkyBands, paintSkyDisc} from '../kit/sky';
import {shoulderPoint, type Arm} from '../kit/cast';
import {poseArms} from '../kit/poses';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintCast, YAI} from './cast';
import {cardAt, cell, strip, type Light, type V3} from './core';
import {paintFire} from './fire';
import {paintCupHeld, paintPhoneHeld} from './props';
import {Safety, RecipeCard} from './screens';
import {paintLongNeck, paintSauropodSilhouette, paintSpino, spinoStride} from './creatures';
import {paintConifer, paintCycad, paintFernClump, paintTreeFern} from './forest';
import {FPS, Mark, Painted, Vignette, label} from './frame';
import {cylinder, lampK, LAMP, NIGHT_IN, paintUnder} from './under';
import {LIGHT, paintVillage} from './village';

// EDU-EP16..18 look stills, part B (W3, Film): long-neck (EP16 shot 8 + approval sheet with the far herd and silhouette), EP17 predator by firelight
// (shot 21), EP18 under-house night (shot 4), the recipe card full (shot 18) and as the corner chip (shot 19).

// ------------------------------------------------------------------ EP16 shot 8 (+60): the long-neck eats from cycad C2
// W3 proposal (sheet R1.1 pending): r 9 -> 8.3 so the lens stands 1 m outside the fence (z -12) instead of in it; f 820 -> 1000 and
// hy 1050 -> 880 so Y is the lead (487 px). Cycad C2 moves from (7, -21) to (5.9, -18.4) and the head card scales x1.3 (0.85 m head)
// so the long-neck head reads (about 140 px wide). Projection: K feet (259, 1356), Y head (411, 886), mouth (656, 910).
export const CAM16_8 = camMove([6, 2.3, -20.5], [-24, -20], [8.3, 7.6], 0.8, {f: 1000, hy: 880, pitch: [12, 12], ease: [0, 1]});
const toC2: [number, number] = [5.9 - 3.4, -18.4 + 16.5];
const paintSh8 = (p: Painter) => {
  const c = camOf(CAM16_8, 60 / 143), L = LIGHT.morning, t = 697 / FPS;
  const Y = (q: Painter, cc: YCam) => { paintCast(q, cc, 'Y', {at: [3.75, 0, -16.15], facing: toC2, pose: 'P01', face: 'worried', t}); };
  const K = (q: Painter, cc: YCam) => { paintCast(q, cc, 'K', {at: [3.4, 0, -16.5], facing: toC2, pose: 'P05', face: 'surprised', t}); };
  paintVillage(p, c, {mode: 'morning', t, extra: [
    {at: [4.05, 0, -16.7], draw: (q, cc) => paintCycad(q, cc, [4.05, 0, -16.7], 2.0, L, 21000, {seeds: true})},
    {at: [5.9, 0, -18.4], draw: (q, cc) => paintCycad(q, cc, [5.9, 0, -18.4], 2.2, L, 21100)},
  ]});
  // the long-neck comes down out of the canopy in front of everything between it and the pair (its head is in front of the C2 crown); the pair repaint over it
  const k = cardAt(c, [5.95, 1.85, -18.4], -1, 1.3);
  if (k) paintLongNeck(p, k, L, {top: [-3.2, 9.5], chew: 0.5});
  K(p, c); Y(p, c);
};

// ------------------------------------------------------------------ approval sheet: long-neck head/neck close, far herd and the night silhouette
const paintLnSheet = (p: Painter) => {
  const L: Light = {amb: '#d6e2c8', k: 0.08};
  paintSkyBands(p, {from: '#a9c4c8', via: '#cfdcc4', to: '#e8e6c8', horizon: 960, width: 1080, top: 0, viaAt: 0.5, bands: 8, style: 'flat'});
  const c: YCam = {x: 0, y: 1.6, z: 9, yaw: 0, f: 900, hy: 700};
  for (let i = 0; i < 6; i++) paintConifer(p, c, [-9 + i * 3.6 + 1.5 * hash(i), 0, -14 - 6 * hash(i + 9)], 28, L, 21500 + i * 50, {haze: 0.35, hazeCol: '#dfe8d4'});
  hardFill(p, 21800, '#6f8a52', [[0, 900], [1080, 900], [1080, 960], [0, 960]]);
  for (let i = 0; i < 4; i++) paintTreeFern(p, c, [-5 + i * 3.5, 0, -2 - 2 * hash(i + 3)], 4 + hash(i), L, 21900 + i * 40);
  paintCycad(p, c, [1.2, 0, 1.2], 2.0, L, 22000, {seeds: true});
  paintLongNeck(p, {g: [760, 640], u: 300, s: 1}, L, {top: [-2.2, 4.6], chew: 0.4});
  for (let i = 0; i < 5; i++) paintFernClump(p, c, [-3.5 + i * 1.9, 0, 3.5], 0.9, L, 22100 + i * 30);
  // bottom half: dusk river plain with the far herd, then the night silhouette against the stars
  hardFill(p, 22200, '#3a3550', [[0, 960], [1080, 960], [1080, 1440], [0, 1440]]);
  paintSkyBands(p, {from: '#4a4a78', via: '#c98a6a', to: '#f0c890', horizon: 1360, width: 1080, top: 960, viaAt: 0.55, bands: 7, style: 'flat'});
  hardFill(p, 22201, '#5a5a4a', [[0, 1360], [1080, 1360], [1080, 1440], [0, 1440]]);
  [[160, 1372, 90, 1], [290, 1376, 120, 1], [470, 1368, 70, -1], [640, 1380, 140, 1], [860, 1370, 80, -1]].forEach(([x, b, h, d], i) => paintSauropodSilhouette(p, x, b, h, '#4a3e48', 22300 + i * 20, d, i === 2 ? 0.2 : 1));
  hardFill(p, 22400, '#0f1530', [[0, 1440], [1080, 1440], [1080, 1920], [0, 1920]]);
  for (let i = 0; i < 40; i++) hardFill(p, 22410 + i, '#c9d4f0', cell({g: [hash(i + 300) * 1080, 1450 + hash(i + 400) * 300], u: 1, s: 1}, 0, 0, 1.6, 1.6, 6));
  paintSkyDisc(p, {x: 880, y: 1530, r: 22, color: '#f2ecd8', glow: 0.5, glowColor: '#9fb0d8'});
  hardFill(p, 22450, '#141a2c', [[0, 1800], [300, 1770], [700, 1785], [1080, 1760], [1080, 1920], [0, 1920]]);
  paintSauropodSilhouette(p, 600, 1800, 150, '#060810', 22500, 1);
};
const LnLabels = () => (
  <>
    <div style={label(40, 40, 30)}>คอยาว (N16-06): หัว 0.85 m · คอ ≈ 7 m · ตัวไม่ออกจอ</div>
    <div style={label(40, 990, 30)}>ฝูงไกล (EP17 ช็อต 17 / EP18 ช็อต 3)</div>
    <div style={{...label(40, 1470, 30), color: '#e9dfc8'}}>เงาตัดฟ้าคืน (EP18 ช็อต 5: x 600, ฐาน y 1000, 150 px)</div>
  </>
);

// ------------------------------------------------------------------ EP17 shot 21 (+40): the predator's head lowers into the firelight and sniffs
// R1.2 (Film, 14 Nov 2026, user verdict "paper doll"): the animal turns so the lens sees a front-3/4 of its left flank (was 18 deg off side-on); the lens
// comes in to 5.2-4.8 m (was 6.4-6.0), a lens shift cx +110 keeps the fire in at the left edge, hy 820 -> 780 lifts the fire base out of the caption band.
export const CAM17_21 = camMove([1.2, 1.8, 3.0], [-74, -68], [5.2, 4.8], 0.5, {f: 820, hy: 780, cx: 110, pitch: [16, 16], ease: [0, 1]});
const FIRE: V3 = [-1, 0, 1.5];
// The spinosaurus-like predator (N17-02, volume build R1.2): snout tip 1.0 m over the ground at (-0.2, z 1.95), body axis toward the east-south-east
// (0.94, 0.342) (was (0.75, 0.661)); head lowered to the smoke; near foot ball at s 6.0 (world (5.41, 0.14, 3.29)), far foot at s 7.0.
export const SPINO = {O: [-0.2, 1.95] as [number, number], b: [0.94, 0.342] as [number, number]};
const paintPred = (p: Painter) => {
  const c = camOf(CAM17_21, 40 / 44), t = 1627 / FPS;
  const dark: Light = {amb: '#080a12', k: 0.86};
  paintVillage(p, c, {mode: 'night', t, light: dark});
  paintSpino(p, c, {...SPINO, fire: FIRE, t, amb: 0.55, reach: 8});
  paintFire(p, c, FIRE, t);
};

// ------------------------------------------------------------------ EP17 shots 22 and 23 (R1.2 design stills): it steps around the fire, then leaves east
// Shot 22 (+25 of 51): over the shoulders from the south end of the veranda, kneeling eye 3.3 under the lean-to eave (the R1 lens at z -6.7 saw only the
// eave: it hangs 0.2-0.4 m over a standing eye, and the veranda floor hides the fire itself, so its glow lights the animal from below); the animal walks
// east 6-7 m beyond the fire, its left flank to the lens (high side view, the reference silhouette), mid-stride (spinoStride 0.3), head carried (0.6);
// the head runs out left and the tail out right; Y and K kneel at the rail as dark backs at the frame edges.
// Shot 23 (+20 of 132): low wide from behind the fire looking east (hy 960 -> 760 lifts the fire out of the band); the animal walks away north-east
// (rear-3/4 of its right flank), the tail tip past the fire's light. Walk speed proposal 2.0 m/s (one 2.6 m stride pair per 1.3 s): O moves 1.33 m by +20.
export const CAM17_22 = camMove([-1.8, 0, 5.2], [181, 179], 7.8, 3.3, {f: 820, hy: 720, pitch: [-8, -8], ease: [0, 1]});
export const SPINO_22 = {O: [5.4, 8.0] as [number, number], b: [-0.985, -0.17] as [number, number]};
export const CAM17_23 = camMove([2, 1, 2], [-80, -84], [5, 5.6], 1, {f: 850, hy: 760, ease: [0, 1]});
export const SPINO_23 = {O: [14.25, -4.33] as [number, number], b: [-0.866, 0.5] as [number, number], v: 2.0};
const paintSh22 = (p: Painter) => {
  const c = camOf(CAM17_22, 25 / 50), t = 1657 / FPS, dark: Light = {amb: '#080a12', k: 0.86};
  const Yp: V3 = [-2.45, 2.4, -1.35], Kp: V3 = [-1.2, 2.4, -1.3];
  paintVillage(p, c, {mode: 'night', t, light: dark, extra: [
    {at: [-0.5, 0, 7.0], draw: (q, cc) => { paintSpino(q, cc, {...SPINO_22, fire: FIRE, t, amb: 0.55, reach: 8, pose: {...spinoStride(0.3), head: 0.6}}); }},
    {at: FIRE, draw: (q, cc) => paintFire(q, cc, FIRE, t)},
  ]});
  paintCast(p, c, 'K', {at: Kp, view: 'back', pose: 'P34', face: 'scared', t, tint: {to: '#12121e', u: 0.72}});
  paintCast(p, c, 'Y', {at: Yp, view: 'back', pose: 'P34', face: 'worried', t, tint: {to: '#12121e', u: 0.72}});
};
const paintSh23 = (p: Painter) => {
  const c = camOf(CAM17_23, 20 / 131), t = 1703 / FPS, dark: Light = {amb: '#080a12', k: 0.86};
  const k = 20 / 30 * SPINO_23.v, O: [number, number] = [SPINO_23.O[0] - k * SPINO_23.b[0], SPINO_23.O[1] - k * SPINO_23.b[1]];
  paintVillage(p, c, {mode: 'night', t, light: dark, extra: [
    {at: [O[0] + 6 * SPINO_23.b[0], 0, O[1] + 6 * SPINO_23.b[1]], draw: (q, cc) => { paintSpino(q, cc, {O, b: SPINO_23.b, fire: FIRE, t, amb: 0.55, reach: 8, pose: {...spinoStride(0.55), head: 0.7}}); }},
  ]});
  paintFire(p, c, FIRE, t);
};

// ------------------------------------------------------------------ N17-02 turnaround (R1.2): front-3/4, side, rear-3/4 of one pose, lit by one off-frame fire
// Model sheet for the user's approval (not a shot): animal at O (0, 0) with the tail toward +x; the camera orbits the body centre (6.5, 0, 0) at 12.3 m,
// eye 2.5, f 900, one row each (az -45 = front-3/4 seen from its left, 0 = side, +45 = rear-3/4). The fire stands 4 m out on its left at the chest.
const TURN_FIRE: V3 = [3.0, 0, 4.0];
const TURN = [{az: -45, at: 4.5}, {az: 0, at: 6.5}, {az: 45, at: 8.0}];
const paintTurn = (p: Painter) => {
  TURN.forEach(({az, at}, k) => {
    const y0 = 640 * k, c = {...camOf(camMove([at, 0, 0], [az, az], 12.3, 2.5, {f: 900, hy: 640 * k + 400}), 0)};
    hardFill(p, 25000 + k, '#121830', [[0, y0], [1080, y0], [1080, y0 + 640], [0, y0 + 640]]);
    hardFill(p, 25010 + k, '#0d0c0b', [[0, y0 + 430], [1080, y0 + 430], [1080, y0 + 640], [0, y0 + 640]]);
    paintSpino(p, c, {O: [0, 0], b: [1, 0], fire: TURN_FIRE, t: 0, reach: 13, low: 0.25, pose: {head: 0.7}});
    // 1.70 m scale post 1 m off its left flank at the hip
    const g = camPoint(c, [6.6, 0, 2.2]), u = camUnit(c, [6.6, 0, 2.2]);
    if (g) hardFill(p, 25020 + k, '#d8c8a0', [[g[0] - 3, g[1]], [g[0] + 3, g[1]], [g[0] + 3, g[1] - 1.7 * u], [g[0] - 3, g[1] - 1.7 * u]]);
    if (k) hardFill(p, 25030 + k, '#000000', [[0, y0 - 2], [1080, y0 - 2], [1080, y0 + 2], [0, y0 + 2]]);
  });
};
const TurnLabels = () => (
  <>
    {['หน้าเฉียง 3/4 (ช็อต 21)', 'ด้านข้าง (ยาว ≈ 13 m)', 'หลังเฉียง 3/4 (ช็อต 23)'].map((t, k) => <div key={t} style={{...label(30, 640 * k + 22, 30), color: '#e9dfc8'}}>{t}</div>)}
    <div style={{...label(30, 1880, 24), color: '#bfb59c'}}>เสาขาว = คนสูง 1.70 m · แสงจากกองไฟนอกภาพทางซ้ายของตัว</div>
  </>
);

// ------------------------------------------------------------------ EP18 shot 4 (+60): Keng on the mat, Grandma kneeling with the phone at her ear
// R1.1 (Film, 14 Nov 2026, user check of the lying grandson): the lens stands 1.9-2.05 m off the platform centre at eye 1.05 (was 1.7-1.9 m at eye 0.95, which put
// K's body on the caption band and Y against the left edge); hy 750 keeps every contact above y 1160.
export const CAM18_4 = camMove([-4.6, 0.75, -4.5], [12, 6], [2.05, 1.9], 1.05, {f: 1000, hy: 750, ease: [0, 1]});
const kneelArm = (c: YCam, at: V3, id: 'P20' | 'P18' | 'P34'): {rArm?: Arm; lArm?: Arm} => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return {};
  const st = poseArms(id, YAI, g, u), a = shoulderPoint(YAI, g, u, {view: 'front'}, 'r'), b = shoulderPoint(YAI, g, u, {view: 'front', kneel: 1}, 'r');
  const d: Pt = [b[0] - a[0], b[1] - a[1]], sh = (q?: Pt) => (q ? [q[0] + d[0], q[1] + d[1]] as Pt : undefined);
  const m = (x?: Arm) => (x ? {...x, to: sh(x.to)!, via: sh(x.via)} : undefined);
  return {rArm: m(st.rArm), lArm: m(st.lArm)};
};
const paintUnderNight = (p: Painter) => {
  const c = camOf(CAM18_4, 60 / 112), t = 250 / FPS;
  // K lies on his side on the mat (P37, head toward -x, so his head rests just in front of Y's knees, 0.3 m nearer the lens than her); Y kneels on the platform at his head (P34) with the
  // phone at her ear (P20 arm). Both contacts are on the mat top y 0.46 (was 0.45: 1 cm into the mat). The clay water jug (shot 15) stands full behind him.
  const Y: V3 = [-5.15, 0.46, -4.75], K: V3 = [-3.95, 0.46, -4.45], JUG: V3 = [-4.2, 0.46, -4.85];
  const tint = (v: V3) => ({to: '#2a2a40', u: 0.42 - 0.3 * lampK(v)});
  paintUnder(p, c, {t, extra: [
    {at: JUG, draw: (q, cc) => { cylinder(q, cc, 24020, JUG, 0.1, 0.16, '#7a4a30', {ink: '#3a2418', top: '#5a3420'}); cylinder(q, cc, 24023, [JUG[0], 0.62, JUG[2]], 0.06, 0.05, '#6a3e28', {top: '#2a3a48'}); }},
    // floor in front of the platform: her slippers, left off before she climbed on
    {at: [-4.85, 0, -3.6], draw: (q, cc) => { for (const [i, dx] of [[0, -0.07], [1, 0.07]] as const) { const k = cardAt(cc, [-4.85 + dx, 0.01, -3.6]); if (k) hardFill(q, 24030 + i, '#2e2622', cell(k, 0, 0.01, 0.06, 0.025, 12, 0.2)); } }},
    {at: K, draw: (q, cc) => { paintCast(q, cc, 'K', {at: K, view: 'front', pose: 'P37', face: 'sad', t, tint: tint(K), shadow: {op: 40}}); }},
    {at: Y, bias: -0.05, draw: (q, cc) => { const arms = kneelArm(cc, Y, 'P20'); paintCast(q, cc, 'Y', {at: Y, view: 'front', pose: 'P34', face: 'worried', t, tint: tint(Y), fig: {rArm: arms.rArm}, held: (qq, a, u) => paintPhoneHeld(qq, a.rHand, u)}); }},
  ]});
};

// ------------------------------------------------------------------ EP18 shot 18 (+100): overhead hands, the half teaspoon of salt scraped flat; recipe card full
// W3 change: r 0.45 -> 0.75 and eye 1.05 -> 1.45 (lens about 1 m from the bottle), so jars stay in frame; spoon (505, 882), bottle base (501, 1119).
export const CAM18_18 = camMove([-4, 0.5, -5], [0, 6], [0.75, 0.7], 1.45, {f: 950, hy: 1180, pitch: [-58, -58], near: 0.05, ease: [0, 1]});
const SKIN = '#efc9a3', SLEEVE = '#ece2cc';
const mitten = (p: Painter, id: number, at: Pt, u: number, ang: number, fist = false) => {
  const r = (x: number, y: number): Pt => [at[0] + (x * Math.cos(ang) - y * Math.sin(ang)) * u, at[1] + (x * Math.sin(ang) + y * Math.cos(ang)) * u];
  const palm = fist ? [r(-0.04, -0.035), r(0.04, -0.04), r(0.05, 0.02), r(0.0, 0.05), r(-0.045, 0.03)] : [r(-0.045, -0.04), r(0.05, -0.05), r(0.075, 0.0), r(0.04, 0.05), r(-0.04, 0.045)];
  hardFill(p, id, SKIN, palm);
  hardFill(p, id + 1, SKIN, [r(-0.02, -0.045), r(0.02, -0.075), r(0.04, -0.06), r(0.01, -0.03)]);
  for (let i = 0; i < 3; i++) inkLine(p, id + 2 + i, [r(0.02 + i * 0.012, -0.02 + i * 0.02), r(0.045 + i * 0.01, -0.03 + i * 0.022)], {closed: false, weight: 0.6, color: '#8a5a3a', still: true});
  inkLine(p, id + 6, palm, {weight: 0.6, color: '#8a5a3a', still: true});
};
const paintRecipe = (p: Painter) => {
  const c = camOf(CAM18_18, 100 / 129), t = 1364 / FPS, L = NIGHT_IN;
  paintUnder(p, c, {t});
  const P = (v: V3) => camPoint(c, v)!, U = (v: V3) => camUnit(c, v);
  // the lamp light pool on the mat (shot lit from above-left by the lamp)
  const B: V3 = [-4.05, 0.46, -5.0];
  cylinder(p, c, 24100, [-4.3, 0.46, -5.1], 0.065, 0.16, '#d9e6e8', {top: '#efe6d0', ink: '#5a6670'});
  hardFill(p, 24105, '#c23a2a', cell({g: P([-4.42, 0.47, -4.9]), u: U([-4.42, 0.47, -4.9]), s: 1}, 0, 0, 0.07, 0.07, 14));
  cylinder(p, c, 24110, [-3.78, 0.46, -5.12], 0.065, 0.16, '#d9e6e8', {top: '#f8f8f4', ink: '#5a6670'});
  cylinder(p, c, 24120, B, 0.043, 0.22, UC_BOTTLE, {ink: '#6a8a90'});
  cylinder(p, c, 24125, [B[0], 0.46, B[2]], 0.041, 0.2, '#e8f4f6');
  cylinder(p, c, 24130, [B[0], 0.68, B[2]], 0.043, 0.06, UC_BOTTLE, {taper: 0.4, ink: '#6a8a90'});
  cylinder(p, c, 24135, [B[0], 0.74, B[2]], 0.012, 0.03, '#2f6fb8');
  // funnel in the mouth
  cylinder(p, c, 24140, [B[0], 0.77, B[2]], 0.012, 0.06, '#e8b84a', {taper: 4.5, top: '#c99a3a', ink: '#8a6a2a'});
  // teaspoon held level over the funnel with half a spoon of salt; the knife scrapes it flat
  const sp: V3 = [-4.03, 0.86, -4.98], sg = P(sp), su = U(sp);
  hardFill(p, 24150, '#c8ccd0', cell({g: sg, u: su, s: 1}, 0, 0, 0.022, 0.016, 14));
  hardFill(p, 24151, '#ffffff', cell({g: [sg[0] - 0.004 * su, sg[1] + 0.002 * su], u: su, s: 1}, 0, 0, 0.011, 0.012, 12));
  inkLine(p, 24152, cell({g: sg, u: su, s: 1}, 0, 0, 0.022, 0.016, 14), {weight: 0.6, color: '#5a5e62', still: true});
  const hd = P([-3.9, 0.88, -4.88]);
  hardFill(p, 24153, '#c8ccd0', [[sg[0] + 0.018 * su, sg[1] - 0.004 * su], [hd[0], hd[1] - 0.005 * su], [hd[0], hd[1] + 0.006 * su], [sg[0] + 0.018 * su, sg[1] + 0.004 * su]]);
  // knife blade flat across the bowl, handle to the left hand
  const kb: Pt = [sg[0] - 0.035 * su, sg[1] - 0.012 * su], ke: Pt = [sg[0] + 0.03 * su, sg[1] - 0.02 * su], kh = P([-4.16, 0.88, -4.9]);
  hardFill(p, 24160, '#b8bcc0', [[kb[0], kb[1] - 0.006 * su], [ke[0], ke[1] - 0.004 * su], [ke[0], ke[1] + 0.004 * su], [kb[0], kb[1] + 0.008 * su]]);
  hardFill(p, 24161, '#5a3a22', [[kb[0], kb[1] - 0.008 * su], [kh[0], kh[1] - 0.01 * su], [kh[0], kh[1] + 0.01 * su], [kb[0], kb[1] + 0.009 * su]]);
  // Grandma's bare forearms (short-sleeved blouse) entering from the frame sides with the sleeve edge at the edge, and the mitten hands (UT14)
  const rH = P([-3.88, 0.88, -4.86]), lH = P([-4.18, 0.88, -4.9]), hu = U([-3.9, 0.88, -4.86]);
  const ARM = mixColor(SKIN, '#ffb060', 0.1), ARM_SH = mixColor(SKIN, '#5a3a2a', 0.25);
  for (const [h, id, dx] of [[rH, 24170, 0.12], [lH, 24180, -0.12]] as const) {
    const s0: Pt = [dx > 0 ? 1140 : -60, h[1] + 0.42 * hu], s1: Pt = [h[0] + dx * hu * 0.2, h[1] + 0.05 * hu];
    const arm = strip([s0, s1], [0.075 * hu, 0.04 * hu]);
    hardFill(p, id, ARM, arm);
    hardFill(p, id + 2, ARM_SH, strip([[s0[0], s0[1] + 0.058 * hu], [s1[0], s1[1] + 0.028 * hu]], [0.018 * hu, 0.01 * hu]));
    inkLine(p, id + 3, arm, {weight: 0.7, color: '#8a5a3a', still: true});
    const e: Pt = [s0[0] + (s1[0] - s0[0]) * 0.14, s0[1] + (s1[1] - s0[1]) * 0.14];
    hardFill(p, id + 4, SLEEVE, strip([s0, e], [0.11 * hu, 0.095 * hu]));
  }
  mitten(p, 24190, rH, hu, -0.5, true);
  mitten(p, 24200, lH, hu, Math.PI + 0.4, true);
  void L; void LAMP;
};
const UC_BOTTLE = '#d9ecef';

// ------------------------------------------------------------------ EP18 shot 19 (+60): the cup at his lips; recipe chip and both safety lines
// R1.1 (Film): hy 960 -> 900 so Y's knee contact on the mat stays above y 1160 (1122 at +0, 1137 at +60, 1159 at +135); K sits P33 (floor sit, hugging his knees).
export const CAM18_19 = camMove([-4.5, 0.8, -4.4], [35, 28], [1.9, 1.7], 1, {f: 920, hy: 900, pitch: [-6, -6], ease: [0, 1]});
const paintCup = (p: Painter) => {
  const c = camOf(CAM18_19, 60 / 135), t = 1454 / FPS;
  const Y: V3 = [-4.05, 0.46, -4.25], K: V3 = [-4.45, 0.46, -4.5];   // both on the mat top (y 0.46)
  let mouth: Pt | undefined;   // K's mouth in picture px, set when K paints (he is farther, so he paints first)
  const tint = (v: V3) => ({to: '#2a2a40', u: 0.42 - 0.3 * lampK(v)});
  paintUnder(p, c, {t, extra: [
    {at: [-3.75, 0.45, -4.75], draw: (q, cc) => { cylinder(q, cc, 24300, [-3.75, 0.46, -4.75], 0.07, 0.2, '#cfe6ea', {ink: '#5a6a70'}); cylinder(q, cc, 24305, [-3.75, 0.46, -4.75], 0.066, 0.16, '#e8f2f4'); }},
    {at: K, draw: (q, cc) => { const a = paintCast(q, cc, 'K', {at: K, view: 'right', pose: 'P33', face: 'tired', t, tint: tint(K), shadow: {op: 40}}); if (a) { const u = camUnit(cc, K); mouth = [a.head[0] + 0.09 * u, a.head[1] + 0.06 * u]; } }},
    {at: Y, bias: -0.05, draw: (q, cc) => {
      const u = camUnit(cc, Y), to: Pt | undefined = mouth ? [mouth[0] + 0.05 * u, mouth[1] + 0.07 * u] : undefined;
      const a = paintCast(q, cc, 'Y', {at: Y, view: 'left', pose: 'P34', face: 'worried', t, tint: tint(Y), fig: to ? {lArm: {to}, rArm: {to: [to[0] + 0.02 * u, to[1] + 0.02 * u]}} : {}});
      // the cup tipped toward his lips, held in her hand
      if (a) paintCupHeld(q, a.lHand, u);
    }},
  ]});
};

export const LOOKS_B: Record<string, () => ReactNode> = {
  'LF16-LONGNECK': () => <Painted paint={paintSh8} frame={697} paper="#cfdcc4"><Vignette level={0.2} id="v8" /></Painted>,
  'AS-LONGNECK': () => <Painted paint={paintLnSheet} band={false} paper="#cfdcc4" overlay={<LnLabels />} />,
  'LF17-PRED': () => <Painted paint={paintPred} frame={1627} paper="#080a12"><Vignette level={0.3} id="v17" /></Painted>,
  'LF17-PRED-22': () => <Painted paint={paintSh22} frame={1657} paper="#080a12"><Vignette level={0.3} id="v17b" /></Painted>,
  'LF17-PRED-23': () => <Painted paint={paintSh23} frame={1703} paper="#080a12"><Vignette level={0.3} id="v17c" /></Painted>,
  'AS-SPINO-TURN': () => <Painted paint={paintTurn} band={false} paper="#121830" overlay={<TurnLabels />} />,
  'LF18-UNDER': () => <Painted paint={paintUnderNight} frame={250} paper="#151a2a" overlay={<Mark />}><Vignette level={0.3} id="v18a" /></Painted>,
  'LF18-RECIPE': () => <Painted paint={paintRecipe} frame={1364} paper="#151a2a" overlay={<><Mark /><RecipeCard /><Safety top={515} /></>}><Vignette level={0.3} id="v18b" /></Painted>,
  'LF18-CHIP': () => <Painted paint={paintCup} frame={1454} paper="#151a2a" overlay={<><Mark /><RecipeCard chip /><Safety top={345} line2={459} /></>}><Vignette level={0.3} id="v18c" /></Painted>,
};
