import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {BALLOON_U_MAX, PASSENGER_LEAN_MAX, cabinDriveAt, roadStripAt, type RoadStrip, paintCabinBack, paintCabinFore, paintCabinPassenger, paintPassengerBelt, paintTetheredBalloon, type DriveKey, type PassengerAct} from '../kit/car-cabin';
import {makePainter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import {Grain} from '../kit/screen';
import {BALLOON, LOOKS, PASSENGER, ROAD_KEYS} from './cabin-look-data';

/** EDU-EP20 W5.2 Boss capability check (16 Nov 2026): the kit cabin's lean, belt and tether driven by frame/params only, on the
 * frozen LF20-CABIN-B camera, light and cast. Not a shot: it serves no specific shot and is not the episode timeline (Editor). */

/** DRIVE demo: settled cruise, acceleration held, cruise (swing settles), braking held. */
export const DRIVE_KEYS: DriveKey[] = [{at: 0, phase: 'cruise'}, {at: 30, phase: 'accelerate'}, {at: 120, phase: 'cruise'}, {at: 270, phase: 'brake'}];
export const DRIVE_FRAMES = 360;
/** EXTREMES: one contact state per frame (shoulder offset m, balloon neck offset m, face). */
export const EXTREMES: (PassengerAct & {u: number; name: string})[] = [
  {name: 'rest', lean: 0, u: 0},
  {name: 'accel SS-R1', lean: -0.07, u: 0.2, face: 'surprised'},
  {name: 'brake SS-R1', lean: 0.07, u: -0.2, face: 'surprised'},
  {name: 'accel limit', lean: -PASSENGER_LEAN_MAX, u: BALLOON_U_MAX},
  {name: 'brake limit', lean: PASSENGER_LEAN_MAX, u: -BALLOON_U_MAX},
];

const B = LOOKS.B;
/** SS-R2 cameras for the W5.3 extremes stills (scene sheet camera lines; A is the LF20-CABIN-B camera). */
export const CHECK_CAMERAS: Record<'A' | 'D-R' | 'D' | 'CLOSE', YCam> = {
  A: B.camera,
  'D-R': {x: 0.36, y: 0.975, z: 2.3655, yaw: 0.03, f: 1300, hy: 305},
  D: {x: 0.46, y: 0.975, z: 2.3655, yaw: 0.03, f: 1300, hy: 305},
  CLOSE: {x: -0.24, y: 1.04, z: 1.95, yaw: 0, f: 1500, hy: 300},
};
const scene = (state: PassengerAct & {u: number}, road?: RoadStrip, cam: YCam = B.camera) => ({brush}: PaintContext) => {
  const p = makePainter(brush, {t: 0, frame: 0, seedBase: 20000});
  p.flat(B.palette.shell, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  paintCabinBack(p, cam, B.palette, PASSENGER, true, road);
  paintCabinPassenger(p, cam, PASSENGER, 1, true, state);
  paintPassengerBelt(p, cam, PASSENGER, undefined, state.lean ?? 0);
  paintTetheredBalloon(p, cam, BALLOON, true, state.u);
  paintCabinFore(p, cam, B.palette, true);
};
const Label = ({lines}: {lines: string[]}) => <div style={{position: 'absolute', left: 120, top: 1300, font: '500 30px monospace', color: '#f1e9d9', textShadow: '0 2px 4px #26313b', whiteSpace: 'pre'}}>{lines.join('\n')}</div>;

export const CabinDriveCheck = () => {
  const f = useCurrentFrame(), s = cabinDriveAt(f, DRIVE_KEYS);
  return <AbsoluteFill>
    <BrushCanvas paint={scene({lean: s.lean, u: s.u})} paper={B.palette.shell}/>
    <Grain opacity={0.07}/>
    <Label lines={['EDU20-CABIN-DRIVE · capability check', 'no specific shot · LF20-CABIN-B', `F${f} ${s.phase}${s.settled ? ' (settled)' : ''}`, `u ${s.u.toFixed(3)} m · lean ${s.lean.toFixed(3)} m`]}/>
  </AbsoluteFill>;
};
/** EXTREMES on camera A (`EDU20-CABIN-EXTREMES`, LF20-CABIN-B) or another SS-R2 camera (`EDU20-CABIN-EXTREMES-<cam>`, W5.3). */
export const CabinExtremesCheck = ({camera = 'A'}: {camera?: keyof typeof CHECK_CAMERAS}) => {
  const f = useCurrentFrame(), s = EXTREMES[Math.min(f, EXTREMES.length - 1)];
  const id = camera === 'A' ? 'EDU20-CABIN-EXTREMES' : `EDU20-CABIN-EXTREMES-${camera}`;
  const shots = camera === 'D-R' ? 'end B02-SH01/B03-SH01/B03-SH02' : 'no specific shot';
  return <AbsoluteFill>
    <BrushCanvas paint={scene(s, undefined, CHECK_CAMERAS[camera])} paper={B.palette.shell}/>
    <Grain opacity={0.07}/>
    <Label lines={[`${id} · capability check`, `camera ${camera} · ${shots} · LF20-CABIN-B`, `F${f} ${s.name}`, `u ${s.u.toFixed(2)} m · lean ${(s.lean ?? 0).toFixed(2)} m`]}/>
  </AbsoluteFill>;
};

/** ROAD: the W5.2b far-window road strip alone on the G clock (`ROAD_KEYS`), upright rest passenger and balloon.
 * The strip's speed is the only thing that changes; the drive acting is shown by EDU20-CABIN-DRIVE. SS-R5: G0-G1618 (SS-R4 1589). */
export const ROAD_FRAMES = 1619;
export const CabinRoadCheck = () => {
  const f = useCurrentFrame(), r = roadStripAt(f, ROAD_KEYS);
  const phase = f < 187 ? 'steady (opening)' : f < 352 ? 'speeding up' : f < 1209 ? 'steady' : f < 1443 ? 'slowing' : 'steady (end)';
  return <AbsoluteFill>
    <BrushCanvas paint={scene({lean: 0, u: 0}, r)} paper={B.palette.shell}/>
    <Grain opacity={0.07}/>
    <Label lines={['EDU20-CABIN-ROAD · capability check', 'no specific shot · LF20-CABIN-B · SS-R5 G clock', `G${f} ${phase}`, `road ${(r.speed * 1000).toFixed(2)} mm/f · offset ${r.offset.toFixed(4)} m`]}/>
  </AbsoluteFill>;
};

/** END20 (scene sheet SS-R5 #ss-r5-end20, B05-SH03 G1443-1618; SS-R4 frames +29) on the G clock, so the kit can be checked before
 * Editor's drive keys exist. S = END20_START (G1465, SS-R4 G1436).
 * `sheet`: the sheet's formula as written, u = -0.20 e^(-t/24) cos(2 pi t/72) (1 - ss(S+96,S+120)), t = G - S, u 0 from S+120.
 * `kit`: the kit's cruise release (`cabinDriveAt`, zero start velocity) with the sheet's decay and period (swingPeriod 72, overshoot
 * e^-1.5, i.e. e^(-t/24)): u = -0.20 e^(-t/24) (cos wt + sin(wt) / (24 w)); it lands the sheet's prose numbers (+0.0446 m at S+36).
 * Both: shoulder +0.07 -> 0 by ss(S,S+30); face surprised -> neutral at S+10; camera D -> A by ss(S,S+120); road `ROAD_KEYS`.
 * Capability check only (Editor owns `src/painted/edu20/drive.ts` and the B05-SH03 plate). */
export const END20_START = 1465, END20_FROM = 1443, END20_TO = 1619;
export type End20Variant = 'sheet' | 'kit';
export const END20_KIT_KEYS: DriveKey[] = [{at: 1274, phase: 'brake'}, {at: END20_START, phase: 'cruise'}];
export const END20_KIT_OPTS = {ramp: 18, swingPeriod: 72, overshoot: Math.exp(-1.5)};
const ssw = (G: number, a: number, b: number) => { const x = Math.max(0, Math.min(1, (G - a) / (b - a))); return x * x * (3 - 2 * x); };
export const end20At = (G: number, variant: End20Variant = 'sheet'): PassengerAct & {u: number; lean: number; camera: YCam} => {
  const S = END20_START, t = G - S;
  const u = variant === 'kit' ? cabinDriveAt(G, END20_KIT_KEYS, END20_KIT_OPTS).u
    : t <= 0 ? -0.2 : t >= 120 ? 0 : -0.2 * Math.exp(-t / 24) * Math.cos((2 * Math.PI * t) / 72) * (1 - ssw(G, S + 96, S + 120));
  const lean = 0.07 * (1 - ssw(G, S, S + 30)), k = ssw(G, S, S + 120), D = CHECK_CAMERAS.D, A = CHECK_CAMERAS.A;
  const mix = (a: number, b: number) => a + (b - a) * k;
  return {u, lean, face: G < S + 10 ? 'surprised' : 'neutral', camera: {x: mix(D.x, A.x), y: mix(D.y, A.y), z: mix(D.z, A.z), yaw: mix(D.yaw, A.yaw), f: mix(D.f, A.f), hy: mix(D.hy, A.hy)}};
};
export const CabinEnd20Check = ({variant = 'sheet'}: {variant?: End20Variant}) => {
  const G = Math.max(END20_FROM, useCurrentFrame()), s = end20At(G, variant), r = roadStripAt(G, ROAD_KEYS);
  return <AbsoluteFill>
    <BrushCanvas paint={scene(s, r, s.camera)} paper={B.palette.shell}/>
    <Grain opacity={0.07}/>
    <Label lines={[`EDU20-CABIN-END20${variant === 'kit' ? '-KIT' : ''} · capability check`, `B05-SH03 END20 (SS-R5) · camera D->A · u ${variant}`, `F${G} (f${G - 1332})`, `u ${s.u.toFixed(3)} m · lean ${s.lean.toFixed(3)} m`]}/>
  </AbsoluteFill>;
};
