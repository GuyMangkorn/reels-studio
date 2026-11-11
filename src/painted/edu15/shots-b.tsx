// EDU-EP15 B02 shots 5-6 (storyboard EDU-EP15-ROWS-R2.0): her thought of the plunger on the dusty plaster, and the tokay walking over the dust.
import type {V3} from '../kit/space';
import {camPoint} from '../kit/ycam';
import {camBetween, lin, mix, sm, type CamKey} from './clock';
import {defShot} from './frame';
import {CalmBand, CloudFrame, Vignette} from './look';
import {CEIL, lookCam} from './palette';
import {paintGrit, paintPlunger, paintSpeck, specksFor, type Speck} from './plunger';
import {paintMoth} from './room';
import {roomBack} from './scenes';
import {paintTokay, paintTokayShadow} from './tokay';
import {walkAt, type WalkCfg} from './walk';
import {mothAt} from './shots-a';

const calm = (level: number, id: string, vig = 0.3) => <><Vignette level={vig} id={`v-${id}`} />{level > 0 && <CalmBand level={level} id={`calm-${id}`} />}</>;

// ---- 5. S01-B02-SH01 [317, 414): her-thought grade, cloud-edged frame. +0-+8 the plunger rises and thwops on (+8); +32 gap under the rim; +62 rim lifted; +65 it drops; +88 the bubble pops; flash +95-+96.
export const PLUNGER_AT: V3 = [0, CEIL, 0.38];
export const KEY5A: CamKey = {pos: [0, 2.55, 0.42], at: [0, 2.68, 0.38], f: 1000, hy: 745, near: 0.02};
export const KEY5B: CamKey = {pos: [0, 2.56, 0.38], at: [0, 2.68, 0.38], f: 1000, hy: 745, near: 0.02};
export const camSH05 = (L: number) => camBetween(KEY5A, KEY5B, lin(0, 96, L));
export const plungerState = (L: number): {off: V3; lift: number; squash: number; visible: boolean} => {
  const rise = Math.min(1, Math.max(0, L / 8)), e = rise * rise;
  const dt = Math.max(0, (L - 65) / 30);
  const drop: V3 = [0.01 * dt, -0.5 * 3 * dt * dt, -(0.5 * dt + 0.9 * dt * dt)];
  const lift = 0.0022 * sm(14, 32, L) + 0.016 * sm(32, 62, L);
  const squash = L < 8 ? 0 : Math.max(0, 1 - (L - 8) / 7) * (1 - 0.3 * lin(8, 10, L));
  return {off: [drop[0], -0.38 * (1 - e) + drop[1], -0.22 * (1 - e) + drop[2]], lift, squash, visible: L >= 0 && L < 78};
};
defShot('S01-B02-SH01', (L) => {
  const c = camSH05(L), ps = plungerState(L);
  return {
    paint: (p) => {
      roomBack(p, c, {focus: PLUNGER_AT, stippleR: 0.16, stippleStep: 0.0042, halo: 0.8});
      paintGrit(p, c, PLUNGER_AT, 0.06);
      if (ps.visible && L >= 1) paintPlunger(p, c, {at: PLUNGER_AT, off: ps.off, lift: ps.lift, squash: ps.squash, tilt: -0.9});
    },
    thought: lin(0, 3, L),
    children: calm(0.82, 'sh05', 0.35),
    overlay: <><CloudFrame open={L < 88 ? 1 : 1 - sm(88, 95, L)} id="cf5" />{L >= 95 && L <= 96 && <div style={{position: 'absolute', inset: 0, background: '#ffffff', opacity: 0.9}} />}</>,
  };
});

// ---- 6. S01-B02-SH02 [414, 522): straight up; the tokay walks T0 -> T1, 9 foot-falls (+12 to +83), specks fall from each lift from +48, two cling to two toes.
export const T1: V3 = [0.14, CEIL, -0.4];
export const WALK6: WalkCfg = {from: {at: [0.42, CEIL, -0.12], heading: 180}, to: {at: T1, heading: 225}, m0: 3, m1: 90, steps: [12, 21, 30, 39, 48, 57, 66, 75, 83, 90]};
export const camSH06 = (L: number) => {
  const c = lookCam([0.27, 2.15, -0.26], [0.2891, 2.7, -0.26], 900, {hy: 745, near: 0.02}); // looking up, screen up = -x, lamp glow at screen right
  return {...c, yaw: c.yaw + (4 * Math.PI / 180) * lin(0, 107, L)};
};
const DUST_STEPS = [4, 5, 6, 7, 8]; // landings whose lift drops specks
export const specks6 = (): Speck[] => DUST_STEPS.flatMap((k) => {
  const T = WALK6.steps[k], w = walkAt(WALK6, T), feet = (k - 1) % 2 === 0 ? (['fl', 'hr'] as const) : (['fr', 'hl'] as const);
  return specksFor(feet.map((f) => w.toes[f]), T, 39000 + k * 100);
});
const SPECKS6 = specks6();
defShot('S01-B02-SH02', (L, g) => {
  const c = camSH06(L), w = walkAt(WALK6, L);
  return {
    paint: (p) => {
      roomBack(p, c, {focus: [0.28, CEIL, -0.26], stippleR: 0.42, stippleStep: 0.012, halo: 1});
      paintTokayShadow(p, c, w.frame, 61990, [0.004, 0.006]);
      paintTokay(p, c, w.frame, w.pose, {t: g / 30});
      if (L >= 40) for (const [f, id] of [['fl', 0], ['hr', 1]] as const) { // two specks cling to two toes (partial recovery)
        const sp: Speck = {id: 39900 + id, from: w.toes[f], t0: 1e9, r: 0.0042, vx: 0, vz: 0};
        paintSpeck(p, c, {...sp, t0: 0, from: w.toes[f]}, 0);
      }
      const mo = mothAt(g); paintMoth(p, c, mo.at, mo.phase);
      for (const s of SPECKS6) paintSpeck(p, c, s, L);
      void camPoint; void mix;
    },
    children: calm(0.8, 'sh06', 0.3),
  };
});
