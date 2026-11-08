import {AbsoluteFill} from 'remotion';
import {camMove, camOf} from '../kit/cam-moves';
import {paintEarth} from '../kit/earth';
import {paintGlitterFx} from '../kit/glitter';
import {Stamp, TimerRing} from '../kit/screen';
import {stampState} from '../kit/stamp';
import {ringOpacity} from '../kit/timer-ring';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {FLASK_T, FILM_T, chestAt, filmStripAt, flaskAt, paintChestOutline, paintDropDiagram, paintFilmStrip, paintFlaskCard} from './cards';
import {paintIceShell, suitParts} from './ice';
import {Painted} from './look';
import {paintFarModule, paintModule, paintTruss} from './orbit';
import {camRingClose, latchDeg, paintRingClose} from './ring-close';
import {AIRLOCK, hatchAngle, paintAirlock, paintChamberSepia, SEPIA} from './rooms';
import {AST_AT, FILM_BOX, camLF06, camLF07} from './scenes';
import {AST_DEF, TECH_DEF, ZG_NEUTRAL, paintSuited, type SuitedAnchors} from './suit';

// EDU-EP08-SHORT Boss pass B proof stills (N1-N10): one composition per asset; the frame is the shot-local clock (30 fps), so a still at
// frame f is the asset at f/30 s (the asset's own timeline: seek-safe by construction). Standalone entry `boss-b-index.ts`; render:
// printf 'EDU8-N5 15 out/edu08/boss-b/N5_f15.png\n' | node scripts/stills.mjs src/painted/edu08/boss-b-index.ts
export const NFRAMES = {N1: 4, N2: 5, N3: 60, N4: 90, N5: 30, N6: 60, N7: 4, N8a: 70, N8b: 90, N8c: 90, N8d: 150, N9: 20, N10: 45} as const;

const orbitCam = (yaw: [number, number], pitch: number, hy: number, u = 0): YCam => camOf(camMove([0, 1.0, 0.2], yaw, [3.2, 3.2], 1.9, {pitch: [pitch, pitch], f: 1100, hy}), u);

// N1 earth-backdrop: f0 default, f1 same camera yawed 40 deg (clouds and limb slide, nothing translates), f2 steeper pitch with warm sun, f3 altitude 800 km
export const N1 = () => <Painted paint={(p, f) => {
  const c = [orbitCam([0, 0], -10, 700), orbitCam([40, 40], -10, 700), orbitCam([0, 0], -26, 560), orbitCam([0, 0], -10, 700)][f];
  paintEarth(p, c, f === 2 ? {warm: 0.6, glow: 0.7} : f === 3 ? {altKm: 800} : {});
}} />;

// N2 SET-ORBIT: f0 the hook camera with the far module, f1 the same with the hatch shut and the radiator, f2 the reverse side, f3 the hatch halfway
export const N2 = () => <Painted paint={(p, f) => {
  const c = [orbitCam([55, 55], -16, 620), orbitCam([55, 55], -16, 620), orbitCam([-50, -50], -12, 700), orbitCam([75, 75], -10, 640), camOf(camMove([17, 2.4, -13], [0, 0], 16, 3.2, {pitch: [-4, -4], f: 1100, hy: 700}), 0)][f];
  paintEarth(p, c);
  if (f !== 2) paintFarModule(p, c);
  paintModule(p, c, {t: 0, radiator: f === 1, hatchOpen: [100, 0, 100, 50, 0][f]});
  paintTruss(p, c, {t: 0, tether: {from: [0.12, 0.99, 0.6]}});
}} />;

const camTo = (pos: V3, target: V3, f: number, hy: number): YCam => {
  const dx = target[0] - pos[0], dz = target[2] - pos[2], L = Math.hypot(dx, dz);
  return {x: pos[0], y: pos[1], z: pos[2], yaw: Math.atan2(dx, -dz), pitch: Math.atan2(target[1] - pos[1], L), f, hy};
};
// N3 SET-AIRLOCK: B05-SH02 camera, hatch swing 100 -> 0 deg over 0.5-1.3 s (frames 0, 15, 24, 39), then the lamp/needle close (B05-SH05) at frames 50/59
export const N3 = () => <Painted paper="#8a97a8" paint={(p, f) => {
  const t = f / 30;
  if (f < 45) {
    const u = Math.min(1, t / 1.9), c = camTo([0.3 - 0.06 * u, -0.25 + 0.03 * u, -0.95 + 0.1 * u], [-0.05, 0.05, 1.2], 900, 800);
    // the outer hatch faces the Earth: the backdrop camera for the opening is pitched down 32 deg (staging choice of the shot)
    paintAirlock(p, c, {hatchOpen: hatchAngle(t), behind: (q) => paintEarth(q, {...c, pitch: (c.pitch ?? 0) - 0.56}, {seed: 8840})});
  } else {
    const c = camOf(camMove([0.15, 0.25, 0.3], [-80, -72], [0.62, 0.56], 0.32, {pitch: [0, 0], f: 1000, hy: 800}), (f - 45) / 15);
    paintAirlock(p, c, {lamp: 1, needle: 0.18 * (f - 45) / 15});
  }
}} />;

// N4 SET-CHAMBER66 + sepia: f0 LF03 camera lights 100 %, f30 lights 45 % needle 5 %, f60 gauge close, sepia draining to 0.15 and warm lights, f89 further drained
const camCh = (f: number) => f < 60 ? camOf(camMove([0, 1.1, -0.8], [10, 4], [2.6, 2.0], 1.3, {pitch: [0, 0], f: 1000, hy: 820}), 0.5) : camOf(camMove([0.62, 1.45, -2.15], [0, 6], [0.62, 0.52], 1.48, {pitch: [0, 0], f: 1000, hy: 820}), (f - 60) / 30);
export const N4 = () => <Painted paper={SEPIA.paper} paint={(p0, f) => {
  const c = camCh(f), spec = f < 30 ? {lights: 1, needle: 1, u: 0.62} : f < 60 ? {lights: 0.45, needle: 0.05, u: 0.62} : {lights: 0.45 + 0.55 * (f - 60) / 30, needle: 0.05 + 0.85 * (f - 60) / 30, u: 0.62 - 0.5 * (f - 60) / 30};
  const p = paintChamberSepia(p0, c, spec);
  if (f < 60) { const tech = paintSuited(p, c, TECH_DEF, {at: [0, 0, -0.8], view: 'back', helmet: 'round1966', t: 0, seed: 7401}); void tech; }
}} />;

// N5 RING-CLOSE: the latch over 1.1 s (frames 0, 8, 15 (stage 1 click), 17, 29 (locked))
export const N5 = () => <Painted band={false} paint={(p, f) => { const t = f / 30; paintRingClose(p, camRingClose(t / 1.1), {latch: latchDeg(t)}); }} />;

// N6 vac-glitter: lip-sized emitter (flow, life 1.2 s) at (300, 760) and a long exhale stream (life 2 s) across the Earth; frames 0, 12, 30, 59
export const N6 = () => <Painted paint={(p, f) => {
  const t = f / 30, c = orbitCam([-60, -50], -12, 740);
  paintEarth(p, c, {warm: 0.6, glow: 0.7});
  paintGlitterFx(p, {o: [300, 760], dir: [0.8, -0.6], n: 44, len: 130, spread: 0.8, size: 8, t, life: 1.2, seed: 8610});
  paintGlitterFx(p, {o: [160, 1400], dir: [0.82, 0.57], n: 560, len: 820, spread: 0.3, size: 11, t, life: 2.0, seed: 8620});
}} />;

// N7 timer-ring (screen layer): f0 story 2.6, f1 story 7.5, f2 paused 4.3 (flashback), f3 stopped at 9 and fading
export const N7 = () => <Painted band={false} paint={(p, f) => { paintEarth(p, orbitCam([0, 0], -10, 700)); void f; }}>
  <Ring />
</Painted>;
import {useCurrentFrame} from 'remotion';
const Ring = () => {
  const f = useCurrentFrame(), st = [2.6, 7.5, 4.3, 9][f] ?? 2.6;
  return <TimerRing story={st} paused={f === 2} opacity={f === 3 ? ringOpacity(6, {inAt: -20, stopAt: 0, outFrames: 12}) : 1} />;
};

// shared orbit backdrop with AST for the card and gag stills
const astAt = (p: Parameters<typeof paintEarth>[0], c: YCam, t: number, face: 'neutral' | 'surprised' | 'suspicious' = 'neutral'): SuitedAnchors | null => {
  paintEarth(p, c);
  paintTruss(p, c, {t, tether: {from: [AST_AT[0] + 0.12, AST_AT[1] + 0.57, AST_AT[2] + 0.05]}});
  return paintSuited(p, c, AST_DEF, {at: AST_AT, view: 'front', helmet: 'off', face, t, rim: -1, r: ZG_NEUTRAL('r'), l: ZG_NEUTRAL('l'), seed: 7201});
};

// N8a film-strip: frames 0 (before), 12 (pops in), 25, 32 (balloon), 40 (popped), 50 (cross), 66 (sliding out); N8a stills use t = f/30
export const N8a = () => <Painted paint={(p, f) => {
  const t = f / 30, s = filmStripAt(t);
  astAt(p, camLF06, t, 'surprised');
  if (s.visible) paintFilmStrip(p, FILM_BOX, {tilt: -4, cross: s.cross, panels: s.panels, scale: s.scale, dx: s.dx});
}} />;
void FILM_T;
// N8b flask-card: card opens at 0.3 s, wiggle bounces at 1.2 s and 2.0 s
export const N8b = () => <Painted paint={(p, f) => {
  const t = f / 30;
  astAt(p, camLF07, t);
  paintFlaskCard(p, [430, 470, 1010, 1080], 9300, flaskAt(t));
}} />;
void FLASK_T;
// N8c drop-diagram: full-frame card
export const N8c = () => <Painted band={false} paint={(p, f) => paintDropDiagram(p, f / 30)} />;
// N8d chest-outline over AST
export const N8d = () => <Painted paint={(p, f) => {
  const t = f / 30, c = camOf(camMove([0, 1.1, 0.55], [4, -4], [2.1, 1.85], 1.6, {pitch: [-10, -10], f: 1100, hy: 700}), 0.5);
  const a = astAt(p, c, t);
  if (a) paintChestOutline(p, [(a.rShoulder[0] + a.lShoulder[0]) / 2, (a.rShoulder[1] + a.lShoulder[1]) / 2 + 0.22 * a.u], a.u, t);
  void chestAt;
}} />;

// N9 stamp (screen layer) over the helmet shot's Earth: lands at frame 2, fades from frame 12
export const N9 = () => <Painted band paint={(p) => paintEarth(p, orbitCam([10, 16], -22, 700))}><StampLayer /></Painted>;
const StampLayer = () => { const f = useCurrentFrame(), s = stampState(f, {land: 2, fadeAt: 12}); return s.visible ? <Stamp scale={s.scale} opacity={s.opacity} /> : <AbsoluteFill />; };

// N10 ice-shell-gag on AST: creep 0-0.33 s, hold, crack 0.47-0.65 s, crumble 0.65-1.4 s
export const N10 = () => <Painted paint={(p, f) => {
  const t = f / 30, c = camOf(camMove([0, 1.1, 0.25], [35, 42], [2.6, 2.4], 1.7, {pitch: [-14, -14], f: 1100, hy: 660}), t / 1.4);
  const a = astAt(p, c, t, 'suspicious');
  if (a) paintIceShell(p, suitParts(a, AST_DEF), a.u, t);
}} />;
void AIRLOCK;
