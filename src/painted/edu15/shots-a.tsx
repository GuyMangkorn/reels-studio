// EDU-EP15 B01 shots 1-4 (storyboard EDU-EP15-ROWS-R2.0): the room and the crane to the tokay's feet, the imagined hang, the ceiling-level foot, her "เอ๊ะ?" and the thought bubble.
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint} from '../kit/ycam';
import {paintBubbleSmall} from './bubble';
import {camBetween, camKey, eo, lin, mix, sm, type CamKey} from './clock';
import {defShot} from './frame';
import {paintHang, hangPoseA, swayAt} from './hang';
import {CalmBand, Lbl, Vignette} from './look';
import {C, CEIL, T0, W0_FEET} from './palette';
import {paintCeilingFan, paintMoth, paintSlippers, paintSofaSide, paintTable} from './room';
import {paintWomanPhone} from './cast';
import {ceilingFrame, restLegs, paintTokay, paintTokayShadow, type TokayPose} from './tokay';
import {paintPadPlate} from './padplate';
import {roomBack, restPose, tok, T0F} from './scenes';

export const LAMP_C: V3 = [0, 2.56, 0];
/** The moth's ambient orbit round the lamp (K03): global frame `g`. */
export const mothAt = (g: number): {at: V3; phase: number} => { const a = 0.9 + g * 0.085; return {at: [LAMP_C[0] + 0.33 * Math.cos(a), LAMP_C[1] + 0.03 * Math.sin(a * 2), LAMP_C[2] + 0.33 * Math.sin(a)], phase: g / 6}; };
export const fanAngle = (g: number) => g * 0.16;
const calm = (level: number, id: string, vig = 0.3) => <><Vignette level={vig} id={`v-${id}`} />{level > 0 && <CalmBand level={level} id={`calm-${id}`} />}</>;

// ---- 1. S01-B01-SH01 [0, 140): hold +0-+40, crane up +40-+115, hold to +139. WOMAN scrolling, the tokay at T0 on the ceiling, the moth orbiting the lamp.
export const KEY1A: CamKey = {pos: [0.1, 0.7, 1.5], at: [0, 1.3, -0.75], f: 950, hy: 860};
export const KEY1B: CamKey = {pos: [0.34, 2.36, 0.12], at: [0.33, 2.7, -0.16], f: 1000, hy: 860};
export const camSH01 = (L: number) => camBetween(KEY1A, KEY1B, sm(40, 115, L));
export const paintRoomReal = (p: Painter, c: ReturnType<typeof camSH01>, g: number, o: {pose?: TokayPose; woman?: boolean; focus?: V3; stippleR?: number; stippleStep?: number; halo?: number} = {}) => {
  const t = g / 30;
  roomBack(p, c, {focus: o.focus, stippleR: o.stippleR, stippleStep: o.stippleStep, halo: o.halo});
  paintCeilingFan(p, c, fanAngle(g));
  const m = paintTokayAt(p, c, T0F, o.pose ?? restPose(), t);
  const mo = mothAt(g); paintMoth(p, c, mo.at, mo.phase);
  paintSofaSide(p, c);
  const a = o.woman === false ? null : paintWomanPhone(p, c, {at: W0_FEET, face: 'neutral', faceState: {look: [0, 0.6]}, t, glow: 1, tint: 0.05});
  paintSlippers(p, c);
  paintTable(p, c);
  return {tokay: m, woman: a};
};
const paintTokayAt = (p: Painter, c: ReturnType<typeof camSH01>, f: typeof T0F, pose: TokayPose, t: number) => {
  paintTokayShadow(p, c, f, 61990, [0.004, 0.006]);
  return paintTokay(p, c, f, pose, {t});
};
defShot('S01-B01-SH01', (L, g) => ({
  paint: (p) => { paintRoomReal(p, camSH01(L), g); },
  children: calm(0.59 + 0.17 * sm(60, 115, L), 'sh01'),
}));

// ---- 2. S01-B01-SH02 [140, 204): imagined grade snaps in +0-+3; hold +0-+4, pull back and crane down +4-+36 (ease-out), hold. "ภาพจำลอง" from +0.
export const KEY2A: CamKey = {pos: [0.33, 2.42, 1.1], at: [0.33, 2.56, 0.38], f: 1050};
export const KEY2B: CamKey = {pos: [-1.5, 1.0, 2.2], at: [0.33, 1.5, 0.38], f: 1000};
export const camSH02 = (L: number) => camBetween(KEY2A, KEY2B, eo(4, 36, L));
/** W5-F3: hands lower on the tokay (hind legs / pelvis). The shared rig's hands sit 0.04 m above the hind feet in the close fallback anchor (+0-+4) and 0.19 m above once the true-feet anchor takes over (+5-+8); this drop (m) lands the fist on the hind legs through both, eased over +4-+8. */
const handDrop2 = (L: number) => 0.072 + 0.154 * (1 - (1 - lin(4, 8, L)) ** 2);
defShot('S01-B01-SH02', (L, g) => {
  const c = camSH02(L), kicks = [22, 40];
  const pose = hangPoseA({blink: L >= 8 && L < 14 ? Math.sin(((L - 8) / 6) * Math.PI) : 0});
  return {
    paint: (p) => { paintHang(p, c, pose, {t: g / 30, sway: swayAt(L, kicks), kicks, L, handDrop: handDrop2(L)}); },
    grade: lin(0, 3, L),
    children: calm(0.7, 'sh02'),
    overlay: <Lbl />,
  };
});

// ---- 3. S01-B01-SH03 [204, 277): real colour back; hold +0-+12 (= shot 1's end), descend and swing round the head side +12-+52 (arc, front-loaded so the pad is framed by +44), hold on the front-left pad to +72.
export const KEY3B: CamKey = {pos: [0.343, 2.678, -0.205], at: [0.314, 2.696, -0.18], f: 1000, hy: 960, near: 0.01};
export const camSH03 = (L: number) => camBetween(KEY1B, KEY3B, 1 - (1 - sm(12, 52, L)) ** 2, [-0.3, -0.12, 0]);
defShot('S01-B01-SH03', (L, g) => {
  const c = camSH03(L), t = g / 30;
  return {
    paint: (p) => {
      roomBack(p, c, {focus: [0.32, CEIL, -0.18], stippleR: 0.28, stippleStep: 0.0075, halo: mix(1, 0.6, sm(12, 52, L))});
      paintCeilingFan(p, c, fanAngle(g));
      paintTokayAt(p, c, T0F, restPose(), t);
      const mo = mothAt(g); paintMoth(p, c, mo.at, mo.phase);
      // +30 (the camera passes the grazing angle): cut on the move to the foot's underside pressed on the plaster (padplate.ts), pushing in to rest by +52.
      if (L >= 30) paintPadPlate(p, {cy: 800, k: mix(1.62, 1.46, sm(30, 52, L)), drift: mix(18, 0, sm(30, 52, L))});
    },
    children: calm(0.75, 'sh03'),
  };
});

// ---- 4. S01-B01-SH04 [277, 317): WOMAN medium close; eyes up +4-+14, `surprised` at +14, V01 at +16, the thought bubble pops at +22.
export const KEY4A: CamKey = {pos: [-0.3, 0.7, 1.1], at: [-0.35, 1.2, -0.8], f: 1000};
export const KEY4B: CamKey = {pos: [-0.3, 0.71, 1.05], at: [-0.35, 1.2, -0.8], f: 1000};
export const camSH04 = (L: number) => camBetween(KEY4A, KEY4B, lin(0, 39, L));
defShot('S01-B01-SH04', (L, g) => {
  const c = camSH04(L), t = g / 30, up = sm(4, 14, L);
  return {
    paint: (p) => {
      roomBack(p, c);
      paintCeilingFan(p, c, fanAngle(g));
      paintSofaSide(p, c);
      const a = paintWomanPhone(p, c, {at: W0_FEET, face: L >= 14 ? 'surprised' : 'neutral', faceState: {look: [0, mix(0.6, -0.9, up)]}, t, glow: 1 - 0.6 * up, tint: 0.05});
      paintSlippers(p, c);
      paintTable(p, c);
      if (a) {
        const pop = lin(22, 28, L);
        paintBubbleSmall(p, {from: [a.head[0] + 90, a.headTop - 10], at: [770, 490], r: 225, pop, plunger: 0.12});
      }
      void camPoint; void C; void T0; void ceilingFrame; void restLegs; void tok;
    },
    children: calm(0.62, 'sh04'),
  };
});
void camKey;
