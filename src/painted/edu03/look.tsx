import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {PaintedLabel} from '../Label';
import {makePainter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {orbitYCam, type YCam} from '../kit/ycam';
import {DogView} from './dog-view-pass';
import {PARK_LIGHT_B04} from './cast';
import {BALL_R, paintPark, POS, T, type ParkState} from './park';

// EDU-EP03-SHORT look frames and the dog-view spike S1 (brief EDU-BRIEF-R1, workflow W3, review rows SS-R1). Look stills only: no
// timeline, voice, captions or channel mark. Painted 3D camera: the frame is the shot's camera in the world-metre `PARK` set.
// LF01 = B01-SH01 (hook two-shot, normal colour); S1 = `V-BALL` in normal and in dog view with the same seed; LF02 = B03-SH01's settled
// frame (dog view, tag). The dog-view picture pass wraps only the painted canvas (`DogView`); grain and the tag sit above it.

const FPS = 30;
const DEG = Math.PI / 180;
const PAPER = '#f3e6c4';
const ease = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, u)));

export const LF_FRAMES = {LF01: 60, S1: 30, LF02: 108, LF03: 60} as const;
export const LOOK_FRAME = {LF01: 30, S1: 0, LF02: 40} as const;

/**
 * LF01 camera (B01-SH01). Brief est. `cam: T-TWO, yaw 30->38 arc, r 1.60->1.40, eye 1.20, f 1100`; W3 look frame: the same arc mirrored to the
 * -x side (azimuth -24 -> -32), so that the golden-shower tree, the marigold bed, the path and the flame tree stand behind the two actors
 * (from +30..38 the set behind them was empty lawn and the bed fell off the right edge). `hy` places the red ball above the caption band.
 */
export const LF01_CAM = {at: T.TWO, az0: -24, az1: -32, r0: 1.9, r1: 1.7, eye: 1.2, f: 1100, hy: 660};
export const camLF01 = (frame: number): YCam => {
  const k = LF01_CAM, e = ease(frame / (LF_FRAMES.LF01 - 1));
  return orbitYCam(k.at, k.r0 + (k.r1 - k.r0) * e, (k.az0 + (k.az1 - k.az0) * e) * DEG, k.eye, k.f, k.hy);
};
export const LF01_DOG_AT = [-3.85, 0, -0.85] as [number, number, number];

/**
 * `V-BALL` (brief est.: camera (-0.55, 0.20, 0.95), aimed at (+0.60, 0.30, -0.90), f 1100). W3 look frame: same camera position, yaw 44 deg so
 * that the ball (about 1.1 m ahead) and the dog at S1 (3.3 m) are both inside the 1080 frame (the est. aim, yaw 32, put the dog off the right
 * edge), and `hy` 910 so the ball (y ~1060) and the sniffing head stand ABOVE the caption band (a ball below the band, as the row's ballZone
 * says, forces the dog's whole body into the band).
 */
export const VBALL_CAM: YCam = {x: -0.55, y: 0.2, z: 0.95, yaw: 44 * DEG, f: 1100, hy: 910};

/**
 * B04 two-shot (LF03; brief VD12 option A). `base` = the brief's B04-SH01 camera at its end (`r` 1.80, yaw -5, eye 0.90, f 1000) with the
 * unchanged `PARK_LIGHT`; LF03 = the push (r 1.50, inside the VD12 limit r <= 1.6) with `PARK_LIGHT_B04` and a warm face key. Owner kneels
 * (P34 front) beside the sitting dog, both front; the dog sits nearer the lens than his hands so the faces stay clear of the caption band.
 */
export const B04_CAM = {at: T.TWO, az: -5, eye: 0.9, f: 1000, hy: 700};
export const camB04 = (r: number): YCam => orbitYCam(B04_CAM.at, r, B04_CAM.az * DEG, B04_CAM.eye, B04_CAM.f, B04_CAM.hy);
export const B04_OWNER_AT = [-4.55, 0, -1.3] as [number, number, number];
export const B04_DOG_AT = [-3.75, 0, -1.15] as [number, number, number];

type Kind = 'lf01' | 'vball' | 'b04' | 'b04base';
const stateOf = (kind: Kind, o: {blue?: boolean; frame: number}): ParkState => {
  const t = o.frame / FPS;
  if (kind === 'lf01') {
    return {t, owner: {held: 'red', pose: 'P11', face: 'happy'},
      dog: {at: LF01_DOG_AT, pose: {view: 'front', state: 'stand', wag: 0.8, mouth: 'open'}}, balls: []};
  }
  if (kind === 'b04' || kind === 'b04base') {
    const fin = kind === 'b04';
    return {t, owner: {at: B04_OWNER_AT, pose: 'P34', face: 'happy', ...(fin ? {light: PARK_LIGHT_B04, warm: 0, faceKey: true} : {})},
      dog: {at: B04_DOG_AT, pose: {view: 'front', state: 'sit', wag: 0.5, mouth: 'open'}}, balls: []};
  }
  return {t, dog: {at: POS.S1, pose: {view: 'left', state: 'stand', sniff: 0.9, wag: 0}},
    balls: [{at: [POS.R0[0], BALL_R, POS.R0[2]], color: o.blue ? 'blue' : 'red'}]};
};

const Painted = ({cam, kind, u, tag, blue, frame0 = 0}: {cam: (f: number) => YCam; kind: Kind; u: number; tag?: boolean; blue?: boolean; frame0?: number}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => {
    const f = frame + frame0;
    const p = makePainter(brush, {t: f / FPS, frame: f, fade: PAPER});
    paintPark(p, cam(f), stateOf(kind, {blue, frame: f}));
  }, [cam, kind, blue, frame0]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <DogView u={u}><BrushCanvas paint={fn} paper={PAPER} /></DogView>
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 95% 75% at 48% 42%, rgba(255,240,200,0) 58%, rgba(60,70,40,0.18) 100%)'}} />
      <Grain opacity={0.08} />
      {tag && <PaintedLabel text="ภาพจำลอง (โดยประมาณ)" top={200} />}
    </AbsoluteFill>
  );
};

export const LF01 = () => <Painted cam={camLF01} kind="lf01" u={0} />;
export const S1_NORMAL = () => <Painted cam={() => VBALL_CAM} kind="vball" u={0} />;
export const S1_DOG = () => <Painted cam={() => VBALL_CAM} kind="vball" u={1} />;
export const S1_BLUE_NORMAL = () => <Painted cam={() => VBALL_CAM} kind="vball" u={0} blue />;
export const S1_BLUE_DOG = () => <Painted cam={() => VBALL_CAM} kind="vball" u={1} blue />;
export const LF02 = () => <Painted cam={() => VBALL_CAM} kind="vball" u={1} tag />;
export const LF01_DOGVIEW = () => <Painted cam={camLF01} kind="lf01" u={1} />;
/** Seek-parity probe (S1 f): a half-way blend of the map, rendered twice in separate sessions. */
export const S1_MID = () => <Painted cam={() => VBALL_CAM} kind="vball" u={0.5} />;

/** LF03 = B04 two-shot, dog view, tag on (VD12 option A). `B04_BASE_*` = the same frame before the fix (r 1.80, `PARK_LIGHT`) for the face measurement. */
export const LF03 = () => <Painted cam={() => camB04(1.5)} kind="b04" u={1} tag />;
export const LF03_NORMAL = () => <Painted cam={() => camB04(1.5)} kind="b04" u={0} />;
export const B04_BASE_NORMAL = () => <Painted cam={() => camB04(1.8)} kind="b04base" u={0} />;
export const B04_BASE_DOG = () => <Painted cam={() => camB04(1.8)} kind="b04base" u={1} tag />;
export const B04_FRAME_NORMAL = () => <Painted cam={() => camB04(1.5)} kind="b04base" u={0} />;
export const B04_FRAME_DOG = () => <Painted cam={() => camB04(1.5)} kind="b04base" u={1} tag />;
