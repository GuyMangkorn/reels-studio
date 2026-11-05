import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {orbitYCam, mixYCam, type YCam} from '../kit/ycam';
import {paintKitchen, T} from './kitchen';
import {paintCellMacro, paintEyeMacro, type CellState} from './macro';

// EDU-EP02-SHORT look frames (brief EDU-BRIEF-R1, workflow W3.1, review rows SS-R1). Look stills only: no timeline, no voice,
// no caption, eyebrow or channel mark. Painted 3D camera: every frame is the shot's own yaw-camera move in a world-metre set.
// LF01 kitchen (S01-B01-SH02), LF02 cell macro (S01-B03-SH01), LF03 eye macro (S01-B04-SH02). The look still is the frame
// named in `LOOK_FRAME`; the comps run the shot's estimated length so the camera move can be checked start / middle / end.

const FPS = 30;
const DEG = Math.PI / 180;
const ease = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, u)));

/** Estimated shot lengths (frames, brief shot list `est`) and the frame used as the look still. */
export const LF_FRAMES = {LF01: 48, LF02: 126, LF03: 102} as const;
export const LOOK_FRAME = {LF01: 24, LF02: 110, LF03: 45, SPK_CELL: 0} as const;

type Kind = 'kitchen' | 'cell' | 'eye';
const PAPER: Record<Kind, string> = {kitchen: '#efe0c4', cell: '#f3dfa6', eye: '#8a5a3b'};
const GRADE: Record<Kind, string> = {
  kitchen: 'radial-gradient(ellipse 95% 75% at 45% 40%, rgba(255,236,190,0) 55%, rgba(90,54,40,0.22) 100%)',
  cell: 'radial-gradient(ellipse 90% 70% at 50% 32%, rgba(255,244,210,0.10) 0%, rgba(160,110,40,0) 55%, rgba(150,96,40,0.22) 100%)',
  eye: 'radial-gradient(ellipse 95% 70% at 50% 30%, rgba(255,240,220,0) 50%, rgba(50,28,18,0.25) 100%)',
};

const Painted = ({kind, paint}: {kind: Kind; paint: (p: Painter, frame: number) => void}) => {
  const fn = useCallback(
    ({brush, frame}: PaintContext) => {
      const p = makePainter(brush, {t: frame / FPS, frame, fade: PAPER[kind]});
      paint(p, frame);
    },
    [paint, kind],
  );
  return (
    <AbsoluteFill style={{background: PAPER[kind]}}>
      <BrushCanvas paint={fn} paper={PAPER[kind]} />
      <AbsoluteFill style={{pointerEvents: 'none', background: GRADE[kind]}} />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// ---- LF01 kitchen, S01-B01-SH02. Brief est. `cam: T-CHEST, yaw -40 -> -32, r 1.9 -> 1.6, eye 1.30, f 1000, hy 560`; W3.1 revision
// (look frame r1-r2: the island front and an empty island top filled the lower half, lead 441 px): a longer lens from further
// back, `r 2.35 -> 2.05, eye 1.55, pitch -8, f 1600, hy 520`, so the island stops looming and the cook's visible height is >= 480 px.
export const LF01_CAM = {at: T.CHEST, yaw0: -40, yaw1: -32, r0: 2.35, r1: 2.05, eye: 1.55, pitch: -8, f: 1600, hy: 520};
export const camLF01 = (frame: number): YCam => {
  const k = LF01_CAM, e = ease(frame / (LF_FRAMES.LF01 - 1));
  return {...orbitYCam(k.at, k.r0 + (k.r1 - k.r0) * e, (k.yaw0 + (k.yaw1 - k.yaw0) * e) * DEG, k.eye, k.f, k.hy), pitch: k.pitch * DEG};
};
const paintLF01 = (p: Painter, frame: number) =>
  void paintKitchen(p, camLF01(frame), {t: frame / FPS, cook: {pose: 'P07', face: 'smug', knife: 'raised', headCock: 6, look: [-0.25, -0.1]}});
export const LF01 = () => <Painted kind="kitchen" paint={paintLF01} />;

// ---- LF02 cell macro, S01-B03-SH01: `cam: CELL, dolly z +1.20 -> +0.55, truck x -0.10 -> 0, yaw 10 -> 0, eye -0.06, f 1000, hy 600`.
export const LF02_CAM = {a: {x: -0.1, y: -0.06, z: 1.2, yaw: 10 * DEG, f: 1000, hy: 600}, b: {x: 0, y: -0.06, z: 0.55, yaw: 0, f: 1000, hy: 600}};
export const camLF02 = (frame: number): YCam => mixYCam(LF02_CAM.a, LF02_CAM.b, ease(frame / (LF_FRAMES.LF02 - 1)));
const cellAt = (frame: number): CellState => {
  const t = frame / FPS;
  // Glint on the beads around "สารที่มีกำมะถัน", then the sac pulse on "เอนไซม์" (est. word times; locked at W4).
  return {t, beadGlint: Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 1.4) / 1.2)))), sacPulse: Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 2.8) / 1.2))))};
};
const paintLF02 = (p: Painter, frame: number) => paintCellMacro(p, camLF02(frame), cellAt(frame));
export const LF02 = () => <Painted kind="cell" paint={paintLF02} />;

// Spike 1 (brief: cell model reads at 270 px): the SH02 key state on the LF02 end camera, sac torn open, teal meeting yellow.
const paintSpkCell = (p: Painter, frame: number) =>
  paintCellMacro(p, camLF02(LF_FRAMES.LF02 - 1), {t: frame / FPS, beadGlint: 0, sacPulse: 0, burst: 1});
export const SPK_CELL = () => <Painted kind="cell" paint={paintSpkCell} />;

// ---- LF03 eye macro, S01-B04-SH02. Brief est. `cam: EYE, yaw -7 -> +6 arc, r 0.30 -> 0.26, eye 0, f 1000, hy 560`; W3.1 revision:
// r 0.34 -> 0.30 so both eye corners stay inside the 1080 width (UT01: reads as an eye at a glance).
export const LF03_CAM = {yaw0: -7, yaw1: 6, r0: 0.34, r1: 0.3, eye: 0, f: 1000, hy: 560};
export const camLF03 = (frame: number): YCam => {
  const k = LF03_CAM, e = ease(frame / (LF_FRAMES.LF03 - 1));
  return orbitYCam([0, 0, 0], k.r0 + (k.r1 - k.r0) * e, (k.yaw0 + (k.yaw1 - k.yaw0) * e) * DEG, k.eye, k.f, k.hy);
};
const paintLF03 = (p: Painter, frame: number) => paintEyeMacro(p, camLF03(frame), {t: frame / FPS, u: frame / (LF_FRAMES.LF03 - 1)});
export const LF03 = () => <Painted kind="eye" paint={paintLF03} />;
