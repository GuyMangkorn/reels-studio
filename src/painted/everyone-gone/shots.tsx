import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Camera} from '../kit/camera';
import {STILL_CAMERA} from '../kit/camera';
import type {Painter} from '../kit/painter';
import {H} from '../kit/cast';
import {hardFill} from '../kit/draw';
import {EG_PAL, flatA} from './set';
import {paintYouBack, YOU_DEF} from './figure-back';
import {paintReachHand, paintWaveHand} from './fpov';
import {Painted} from './look';
import {SensorCardShot} from './SensorCard';
import {paintSoiStore} from './set';
import {
  doorOpen, easeInOut3, easeOut3, lerpCam, bShift, proj, prog, STATION_A, STATION_B, STATION_C, STATION_G, unitAt, YOU_GLASS, type Cam,
} from './space';
import {paintStall, STALL_CAM} from './stall';
import {paintViaductTrain, TRAIN_W} from './viaduct';

// EG-EP01-SHORT shot plates (EG-SC-R1, 17 shots). One entry per timeline scene: its length, its camera and its painter as pure
// functions of the shot-local frame `f` (30 fps), so Editor mounts `<ShotPlate id=... />` in a Sequence and every frame is
// seekable. Boss W5.2, 3 Nov 2026. Scenes select an id; staging numbers live here, taken from the sheets (deviations are
// listed per shot and in docs/dev-findings). Nothing here owns narration, captions, sound or the timeline.

export const EG_SHOTS = [
  ['S01-B01-SH01', 160], ['S01-B02-SH01', 68], ['S01-B02-SH02', 147], ['S01-B02-SH03', 155], ['S01-B03-SH01', 81], ['S01-B03-SH02', 84],
  ['S01-B03-SH03', 94], ['S02-B01-SH01', 56], ['S02-B01-SH02', 110], ['S02-B01-SH03', 60], ['S02-B01-SH04', 125], ['S03-B01-SH01', 256],
  ['S03-B01-SH03', 116], ['S04-B01-SH01', 126], ['S04-B01-SH02', 90], ['S04-B01-SH03', 48], ['S04-B01-SH04', 169],
] as const;
export type ShotId = (typeof EG_SHOTS)[number][0];
export const SHOT_FRAMES: Record<ShotId, number> = Object.fromEntries(EG_SHOTS) as Record<ShotId, number>;

/** Fingertips on the glass seen from A/C (right of the figure's shoulder, so the arm is visible from behind). */
const HAND_A: [number, number, number] = [0.66, 1.42, 0.03];
/** Reflection strength at the FPOV stations (B, G): the street reads as a reflection in the glass, same in every shot there (viewer check 3 Nov 2026). */
const REFL_B = 205;
const FPS = 30;
const bob = (f: number, amp = 6) => amp * Math.sin((2 * Math.PI * 1.8 * f) / FPS);
const screen = (o: Partial<Camera> = {}): Camera => ({...STILL_CAMERA, ...o});
const breathe = (f: number, n: number): Camera => screen({s: 1 + 0.005 * prog(f, 0, n - 1), fx: 540, fy: 960});

type Plate = {cam: Camera; paint: (p: Painter) => void};
const soi = (c: Cam, o: Parameters<typeof paintSoiStore>[2] = {}, extra?: (p: Painter) => void): Plate['paint'] => (p) => {
  paintSoiStore(p, c, {paper: 0, ...o});
  if (o.reflectionOpacity === REFL_B) bandTone(p);
  extra?.(p);
};

/** VD14 caption band y 360-560 at the FPOV stations: a feathered cool-grey tone over glass, transom and sensor panel (a few percent, centre about 14%), so mean <= .80 and p95 <= .92. */
const bandTone = (p: Painter) => {
  [[300, 620], [330, 590], [360, 560], [390, 530], [420, 500]].forEach(([y0, y1], k) =>
    flatA(p, 7_860_000 + k, '#56656e', 11, [[-20, y0], [1100, y0], [1100, y1], [-20, y1]]));
};
/** S01-B02-SH02 caption band tone (fix pass 1): the same cool grey as `bandTone` but 12 finely stepped layers (a few percent each, centre about 32%), so the bright sky and train meet mean <= .80 without visible steps. */
const skyTone = (p: Painter) => {
  for (let k = 0; k < 12; k++) flatA(p, 7_861_000 + k, '#56656e', 10, [[-20, 270 + k * 14], [1100, 270 + k * 14], [1100, 650 - k * 14], [-20, 650 - k * 14]]);
};
// Door command frames (shot-local): doorOpen(f - cmd) with DOOR_CLOCK (space.ts).
const CMD = {'S01-B02-SH03': 5, 'S02-B01-SH04': 3, 'S04-B01-SH02': 15} as const;

/** Final tilt of the train shot (sc01 S01-B02-SH02: pitch 0 -> +38 deg; 63.2 deg in Final fix pass 1 (3 Nov 2026): the 240 px car sits at y 302-542, below the platform top UI, on a 56 f easeInOut tilt). */
const TILT = (63.2 * Math.PI) / 180;

/** Pavement and road under the tilting camera of the train shot (plain fills; the full ground painter assumes no pitch, so the lower half was bare paper). */
const groundBackdrop = (p: Painter, c: Cam) => {
  const g = (x0: number, x1: number, z0: number, z1: number, h = 0): [number, number][] =>
    [proj(c, [x0, h, Math.min(z0, c.z - 0.6)]), proj(c, [x1, h, Math.min(z0, c.z - 0.6)]), proj(c, [x1, h, Math.min(z1, c.z - 0.6)]), proj(c, [x0, h, Math.min(z1, c.z - 0.6)])];
  hardFill(p, 7_850_001, EG_PAL.roadFar, g(-30, 30, 2.5, 30));
  hardFill(p, 7_850_002, EG_PAL.pavement, g(-30, 30, 0, 2.5));
  hardFill(p, 7_850_003, EG_PAL.kerb, g(-30, 30, 2.5, 2.7));
};

/** Painted-plate definition of a shot at local frame f. The two S03 shots composite a card on top (see ShotPlate). */
export const plateOf = (id: ShotId, f: number): Plate => {
  const n = SHOT_FRAMES[id];
  switch (id) {
    case 'S01-B01-SH01': {
      const c: Cam = {...STATION_A, z: 5.5 - 0.05 * prog(f, 0, 159)};
      return {cam: STILL_CAMERA, paint: soi(c)};
    }
    case 'S01-B02-SH01': {
      // Viewer check r2 (3 Nov 2026): the walk is mainly forward. x -1.5 -> 0.5 m, z 12 -> 5.5 m; the camera starts turned ~30 deg
      // down the alley (a lens shift, planes stay axis-aligned: f * tan(30 deg) = 548 px, the door enters from the right edge) and
      // squares up to the shopfront at the end = STATION_A (continues into S01-B02-SH03). Walking bob 1.5 cm at 2 Hz on the eye height.
      const u = prog(f, 0, 68), e = 1 - (1 - u) ** 2;
      const yaw = (30 * Math.PI) / 180 * (1 - easeInOut3(u));
      const c: Cam = {...STATION_A, x: -1.5 + 2 * e, z: 12 - 6.5 * e, cx: STATION_A.f * Math.tan(yaw), y: STATION_A.y + 0.015 * Math.sin((2 * Math.PI * 2 * f) / FPS) * (1 - prog(f, 52, 67))};
      return {cam: STILL_CAMERA, paint: soi(c)};
    }
    case 'S01-B02-SH02': {
      const tilt = easeInOut3(prog(f, 0, 56)), pitch = TILT * tilt;
      const pan = -Math.round(950 * Math.tan((4 * Math.PI) / 180) * prog(f, 40, 115));
      // Final note (3 Nov 2026): the picture settles 40 px lower than the pure tilt (lens shift on hy, eased with the tilt, so f0 = STATION_A and the cut from S01-B02-SH01 stays continuous),
      // moving the cornice and window sills out of the caption band y 360-560.
      const c: Cam = {...STATION_A, pitch, cx: pan, hy: STATION_A.hy + 40 * tilt};
      const trainX = f < 40 || f > 115 ? null : -TRAIN_W + (1080 + TRAIN_W) * prog(f, 40, 115);
      return {cam: STILL_CAMERA, paint: (p) => { paintSoiStore(p, c, {ground: false, props: true, behind: (q) => { groundBackdrop(q, c); paintViaductTrain(q, c, trainX, pan); }}); skyTone(p); /* the sky and train fill the caption band here */ }};
    }
    case 'S01-B02-SH03':
      return {cam: STILL_CAMERA, paint: soi(STATION_A, {door: doorOpen(f - CMD[id])})};
    case 'S01-B03-SH01': {
      // Stall space (own origin, see stall.ts). Pot at (0.82, 1.2, -0.8): camera 1.4 -> 1.3 m in front of it, f 950.
      const c: Cam = {x: 0.82, y: 1.15, z: -0.8 + 1.4 - 0.1 * prog(f, 0, 80), f: 950, hy: 970};
      return {cam: STILL_CAMERA, paint: (p) => paintStall(p, (f + 0) / FPS, c)};
    }
    case 'S01-B03-SH02': {
      // Deviation: 0.42 m from the glass instead of 0.9 m (the glass is 0.14 m tall: 148 px at 0.9 m, cubes under 4 px at 270 px width).
      const c: Cam = {x: -0.3, y: 0.9, z: 0.55 + 0.42 - 0.02 * prog(f, 0, 83), f: 950, hy: 751};
      return {cam: STILL_CAMERA, paint: (p) => paintStall(p, (f + 81) / FPS, c, {ice: 0.15 * prog(f, 0, 83)})};
    }
    case 'S01-B03-SH03': {
      // Pull-back from near the table to the LF03 framing (STALL_CAM). Deviation from the sheet's z 3.1 -> 4.4 at f 950: the end frame is LF03's.
      const e = easeOut3(prog(f, 0, 70));
      const c: Cam = {...STALL_CAM, z: 2.4 + (STALL_CAM.z - 2.4) * e};
      return {cam: STILL_CAMERA, paint: (p) => paintStall(p, (f + 175) / FPS, c, {ice: 0.15})};
    }
    case 'S02-B01-SH01': {
      const e = easeOut3(prog(f, 0, 44));
      const z = 2.4 - (2.4 - STATION_B.z) * e;
      const c: Cam = {...STATION_B, z, cx: bShift(z)};
      return {cam: screen({dy: bob(f) * (1 - prog(f, 28, 44))}), paint: soi(c, {reflectionOpacity: REFL_B})};
    }
    case 'S02-B01-SH02': {
      const hop = (a: number) => (f >= a && f <= a + 12 ? 0.2 * Math.sin((Math.PI * (f - a)) / 12) : 0);
      const c: Cam = {...STATION_B, y: STATION_B.y + hop(50) + hop(64)};
      const lift = f < 14 ? easeOut3(f / 14) : f < 40 ? 1 : 1 - prog(f, 40, 48);
      const sway = f >= 14 && f <= 40 ? Math.sin((2 * Math.PI * 2.2 * (f - 14)) / FPS) : 0;
      return {cam: STILL_CAMERA, paint: soi(c, {reflectionOpacity: REFL_B}, (p) => { if (lift > 0.001) paintWaveHand(p, sway, lift); })};
    }
    case 'S02-B01-SH03':
      return {cam: breathe(f, n), paint: soi(STATION_B, {reflectionOpacity: REFL_B})};
    case 'S02-B01-SH04':
      return {cam: STILL_CAMERA, paint: soi(STATION_B, {door: doorOpen(f - CMD[id]), reflectionOpacity: REFL_B})};
    case 'S03-B01-SH01': {
      // Tilt-down about the sensor box (z 0.08, x +-0.22, y 2.3..2.45) that ends at f16, when the dissolve starts, with the drawn box over the card box
      // CARD_BOX (540, 960, 200 wide). At B 1.1 m the box draws 233 px wide, so the lens eases wider (f 540 -> 464 = 200 px) while the box slides to (540, 960): a real camera move,
      // not the screen scale used at 1.5 m (a screen scale cannot go under 1). Box depth 1.02 m from the lens, centre y 2.375 m.
      const e = easeInOut3(prog(f, 0, 16)), d = STATION_B.z - 0.08;
      const fEnd = (200 * d) / 0.44;
      const end: Cam = {...STATION_B, f: fEnd, cx: (fEnd * STATION_B.x) / d, hy: 960 + (fEnd * (2.375 - STATION_B.y)) / d};
      return {cam: STILL_CAMERA, paint: soi(lerpCam(STATION_B, end, e), {reflectionOpacity: REFL_B})};
    }
    case 'S03-B01-SH03':
      return {cam: STILL_CAMERA, paint: soi(STATION_B, {reflectionOpacity: REFL_B})};
    case 'S04-B01-SH01':
      return {cam: breathe(f, n), paint: soi(STATION_B, {reflectionOpacity: REFL_B, shimmer: 0.03 * Math.sin((2 * Math.PI * f) / 90)})};
    case 'S04-B01-SH02': {
      // Flyer by the door (viewer check r2): slides ~40 px right and turns ~7 deg as the door starts to open (command f 15, slide f 20-34).
      const k = easeOut3(prog(f, 20, 34));
      return {cam: STILL_CAMERA, paint: (p) => paintSoiStore(p, STATION_A, {door: doorOpen(f - CMD[id]), paper: 40 * k, paperRot: 0.12 * k})};
    }
    case 'S04-B01-SH03': {
      // Fix pass 1: smootherstep over 32 f (was easeOut3 over 18 f, a lurch on the first frames); the hand follows later.
      const u = prog(f, 0, 32), c = lerpCam(STATION_B, STATION_G, u ** 3 * (u * (6 * u - 15) + 10));
      const reach = easeOut3(prog(f, 18, 42));
      return {cam: STILL_CAMERA, paint: soi(c, {reflectionOpacity: REFL_B}, (p) => { if (reach > 0.001) paintReachHand(p, reach, STATION_G); })};
    }
    case 'S04-B01-SH04': {
      const e = easeInOut3(prog(f, 5, 104));
      const c = lerpCam(STATION_A, STATION_C, e);
      return {
        cam: STILL_CAMERA,
        paint: (p) => {
          paintSoiStore(p, c, {paper: 0});
          // P16 reach held the whole shot: from A the hand at TOUCH hides behind the torso (line of sight passes through the body), so the
          // arm is drawn in front of the torso, out past the right shoulder (hand at x 0.66 on the glass, S04-B01-SH04 fix, 3 Nov 2026).
          const sh = YOU_DEF.outfit.shoulder * H, shY = YOU_DEF.height - H - 0.16 * H;
          const sx = YOU_GLASS[0] + sh - 0.03;
          const hand = proj(c, [HAND_A[0], HAND_A[1], HAND_A[2]]);
          const elbow = proj(c, [sx + 0.13, shY - 0.1, YOU_GLASS[2] / 2]);
          paintYouBack(p, proj(c, YOU_GLASS), unitAt(c, YOU_GLASS[2]), 'reach', {reachTo: hand, reachElbow: elbow, reachHandPx: 0.09 * unitAt(c, 0.03)});
        },
      };
    }
  }
};

/** Opacity of the painted layer and of the card layer for the two S03 shots (dissolves of sc03). */
export const cardMix = (id: ShotId, f: number): {painted: number; card: number} => {
  if (id === 'S03-B01-SH01') {
    const u = prog(f, 16, 28);
    return {painted: 1 - u, card: u};
  }
  if (id === 'S03-B01-SH03') {
    const u = prog(f, 97, 113);
    return {painted: u, card: 1 - u};
  }
  return {painted: 1, card: 0};
};
/** Card clock F of SensorCardShot (continues from SH01 into SH03). */
export const cardClock = (id: ShotId, f: number) => (id === 'S03-B01-SH03' ? 256 + f : f);
/** Black overlay opacity (end fade of S04-B01-SH04: 31 f linear, pure black on the last frame). */
export const fadeBlack = (id: ShotId, f: number) => (id === 'S04-B01-SH04' ? prog(f, 138, 168) : 0);

export const ShotPlate = ({id}: {id: ShotId}) => {
  const f = useCurrentFrame();
  const mix = cardMix(id, f);
  const black = fadeBlack(id, f);
  const plate = plateOf(id, f);
  const dissolving = mix.painted < 1;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {(mix.card > 0 || dissolving) && (
        <AbsoluteFill>
          <SensorCardShot F={cardClock(id, f)} />
        </AbsoluteFill>
      )}
      {mix.painted > 0 && (
        <AbsoluteFill style={{opacity: mix.painted}}>
          <Painted cam={() => plate.cam} paint={(p) => plate.paint(p)} />
        </AbsoluteFill>
      )}
      {black > 0 && <AbsoluteFill style={{background: '#000', opacity: black}} />}
    </AbsoluteFill>
  );
};
