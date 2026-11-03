import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../../BrushCanvas';
import {drawFigure, type FigPose} from '../../kit/cast';
import {applyCamera, STILL_CAMERA, toScreen, type Camera} from '../../kit/camera';
import {EXPRESSIONS} from '../../kit/expressions';
import {makePainter, type Painter} from '../../kit/painter';
import {poseMix} from '../../kit/poses';
import {Grain} from '../../kit/screen';
import {proj, unitAt, type Cam} from '../space';
import {YW_CROWD} from './crowds';
import {StateGrade} from './look';
import {SOI_CROWD, SOI_WIDE, paintSoiWide, soiYouAt} from './soi-wide';
import {VM_CROWD, VM_YOU_END, paintMonument, vmYouAt} from './monument';
import {
  PIER_CAM, PIER_MOTHER, fillC, PIER_SHEET, PIER_YOU, POSTER, SOI_CAM, YOU2, YW_CAM, YW_YOU, paintPier, paintSoiPost, paintYaowarat, pierItems, type State,
} from './places';
import {EG2_FRAMES, EG2_SHOTS, hoodPull, sheetFlip, type Eg2ShotId, type SheetState} from './sheet';
import {paintCrowd} from './walk';

// EG-EP02-SHORT shot sets (Boss W5.2, 3 Nov 2026; timed sheets EG2-SC-R2.0 under review rows SS-R2.1, 19 shots, 1939 frames).
// One entry per timeline scene: its length, camera and painter as pure functions of the shot-local frame `f` (30 fps), so the
// Editor mounts `plateOf(id, f)` (as EP01's `plateOf`) and every frame is seekable. Dissolves between the empty and crowd states
// (S04-B01-SH04..SH07, VD06) are inside the plate: the two states are painted into one canvas at `1 - m` and `m` with the same
// seeds (props land on identical pixels) and `คุณ` is the fixed lead, always opaque. Scene sheets own captions, narration, sound
// and the channel mark; nothing here draws text except the poster header `ตามหา` (VD07).

export {EG2_SHOTS, EG2_FRAMES, hoodPull, type Eg2ShotId};

const FPS = 30;
const PAPER = '#e9e6e0';
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const prog = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const smooth = (u: number) => u * u * (3 - 2 * u);
const easeOut = (u: number) => 1 - (1 - u) ** 3;
const cam = (s: number, fx = 540, fy = 960, dx = 0, dy = 0): Camera => ({s, fx, fy, dx, dy});
/** Linear push from s0 to s1 over `n` frames about (fx, fy). */
const lin = (f: number, n: number, s0: number, s1: number, fx: number, fy: number): Camera => cam(s0 + (s1 - s0) * prog(f, 0, n), fx, fy);

export const paintYouHood = (p: Painter, c: Cam, f: number) => {
  const h = hoodPull(f), at = YW_YOU, g = proj(c, at), u = unitAt(c, at[2]);
  const mixed = poseMix('P01', 'P23', h.arms, YOU2, g, u, 'front');
  const lift = h.pull * 0.015 * u;
  const lift2 = <T extends {to: [number, number]} | undefined>(a: T): T => (a && h.pull ? ({...a, to: [a.to[0], a.to[1] - lift]} as T) : a);
  const pose = {...mixed, rArm: lift2(mixed.rArm), lArm: lift2(mixed.lArm), view: 'back', hoodUp: h.hoodUp, face: EXPRESSIONS.neutral} as FigPose;
  drawFigure(p, YOU2, g, u, pose, p.t, YOU2.seed);
};

// --- close cameras (B3) ------------------------------------------------------------------------------------------------
/** Close cameras on the Yaowarat world (estimates in the sheets; Boss sets them so the props land where the sheet says). Lens lengthened so the prop fills the frame at a metric distance. */
export const CU_GARLAND: Cam = {x: 6.06, y: 1.1, z: -5.6, f: 2000, hy: 760};
export const CU_INCENSE: Cam = {x: 6.32, y: 1.1, z: -5.62, f: 560, hy: 800};
export const CU_POLE: Cam = {x: -5.2, y: 1.56, z: -10.86, f: 1000, hy: 780};

// --- plates ------------------------------------------------------------------------------------------------------------
export type Plate = {
  cam: Camera;
  paint: (p: Painter) => void;
  /** Grade weights per state (cross-faded in a dissolve). */
  grade: Partial<Record<State, number>>;
  /** Poster header `ตามหา`: horizontal scale (0 hidden) and the camera it follows. */
  header?: {sx: number};
  /** Black overlay opacity (end fade). */
  black?: number;
  /** Added to the painter clock in frames (ambient motion is not restarted at a cut). */
  clock?: number;
};

const ywPlate = (f: number, m: number): Plate['paint'] => (p) => {
  const cam0 = YW_CAM;
  if (m <= 0) { paintYaowarat(p, 'empty', {cam: cam0, you: true}); return; }
  paintYaowarat(p.layer(1 - m, 0), 'empty', {cam: cam0, you: false});
  paintYaowarat(p.layer(m, 0), 'crowd', {cam: cam0, you: false});
  paintCrowd(p, YW_CROWD, f, m, 0);
};

/** Pier states into one canvas: `m` = weight of the crowd state; `คุณ` is painted last, opaque. */
const pierPlate = (f: number, m: number, ref: number): Plate['paint'] => (p) => {
  if (m <= 0) { paintPier(p, 'empty', {f, ref}); return; }
  paintPier(p.layer(1 - m, 0), 'empty', {f, ref, you: false});
  paintPier(p.layer(m, 0), 'crowd', {f, ref, you: false});
  pierItems('crowd', {f, ref}, {p, w: 1}).order.filter((it) => it.id === 'you').forEach((it) => it.draw()); // the fixed lead, opaque, last
};

const vmPlate = (f: number, m: number): Plate['paint'] => (p) => {
  if (m <= 0) { paintMonument(p, 'empty', {you: VM_YOU_END}); return; }
  paintMonument(p.layer(1 - m, 0), 'empty', {you: false});
  paintMonument(p.layer(m, 0), 'crowd', {you: false});
  paintCrowd(p, VM_CROWD, f, m, 0);
};
const soiWidePlate = (f: number, m: number): Plate['paint'] => (p) => {
  const sheet = sheetFlip(-1);
  if (m <= 0) { paintSoiWide(p, 'empty', {sheet, you: true, f: 148}); return; }
  paintSoiWide(p.layer(1 - m, 0), 'empty', {sheet, you: false});
  paintSoiWide(p.layer(m, 0), 'crowd', {sheet, you: false});
  paintCrowd(p, SOI_CROWD, f, m, 0);
};

const youLeftEdge = (p: Painter, camera: Camera) => {
  // `คุณ` at the left edge of the close post frame (~30 % of the frame height, back view, hood up), placed in plate coordinates under `camera`.
  const s = camera.s, u = 372 / s, fx = camera.fx, fy = camera.fy;
  const g: [number, number] = [(70 - fx) / s + fx, (1180 - fy) / s + fy];
  drawFigure(p, YOU2, g, u, {...poseMix('P01', 'P01', 0, YOU2, g, u, 'front'), view: 'back', hoodUp: true, face: EXPRESSIONS.neutral} as FigPose, p.t, YOU2.seed);
};

const soiClose = (sheet: SheetState | undefined, poster: 'front' | 'back', withYou: boolean, camera: Camera): Plate['paint'] => (p) => {
  // The pull-back scales (< 1) show the plate edges: extend the sky above and the road below (the backdrop is painted for 1080 x 1920).
  fillC(p, 41990, '#8ea0b6', [[-300, -700], [1400, -700], [1400, 40], [-300, 40]]);
  fillC(p, 41991, '#6b7682', [[-300, 1880], [1400, 1880], [1400, 2700], [-300, 2700]]);
  paintSoiPost(p, 'empty', sheet ? {sheet} : {poster});
  if (withYou) youLeftEdge(p, camera);
};

/** Plate of one shot at shot-local frame `f`. */
export const plateOf = (id: Eg2ShotId, f: number): Plate => {
  switch (id) {
    case 'S01-B01-SH01':
      return {cam: lin(f, 128, 1, 1.008, 540, 900), grade: {empty: 1}, paint: (p) => paintYaowarat(p, 'empty', {you: false})};
    case 'S01-B01-SH02': {
      // Crop scale 3.09 about (282, 1183) puts the feet at (560, 1000) and the figure 670 px tall (the sheet's 1.9 would give 410 px / 21 %).
      const s0 = 3.09, s = s0 + (3.18 - s0) * prog(f, 0, 78);
      const fx = (372 * s - 560) / (s - 1), fy = (1124 * s - 1000) / (s - 1);
      return {cam: cam(s, fx, fy), grade: {empty: 1}, paint: (p) => { paintYaowarat(p, 'empty', {you: false}); paintYouHood(p, YW_CAM, f); }};
    }
    case 'S01-B02-SH01':
      return {cam: lin(f, 82, 1, 1.006, 540, 900), grade: {empty: 1}, paint: (p) => paintYaowarat(p, 'empty', {you: true})};
    case 'S01-B02-SH02': {
      return {cam: lin(f, 108, 1, 1.007, 540, 960), grade: {empty: 1}, paint: (p) => {
        const a = vmYouAt(f);
        paintMonument(p, 'empty', {you: a, youWalk: Math.abs(a[0] - vmYouAt(0)[0]) / 0.8});
      }};
    }
    case 'S01-B02-SH03':
      return {cam: lin(f, 181, 1, 1.008, 540, 860), grade: {empty: 1}, paint: (p) => paintPier(p, 'empty', {f})};
    case 'S02-B01-SH01':
      return {cam: lin(f, 86, 1, 1.04, 540, 760), grade: {empty: 1}, paint: (p) => paintYaowarat(p, 'empty', {cam: CU_GARLAND, haze: 0.55, you: false})};
    case 'S02-B01-SH02':
      // The smoke clock is 20 f old at the cut (not restarted).
      return {cam: lin(f, 36, 1, 1.02, 540, 800), grade: {empty: 1}, clock: 20, paint: (p) => paintYaowarat(p, 'empty', {cam: CU_INCENSE, haze: 0.55, you: false})};
    case 'S02-B01-SH03':
      return {cam: lin(f, 107, 1, 1.05, 540, 780), grade: {empty: 1}, paint: (p) => paintYaowarat(p, 'empty', {cam: CU_POLE, haze: 0.5, you: false})};
    case 'S02-B01-SH04': {
      const [ax, ay] = proj(PIER_CAM, [PIER_SHEET.x, PIER_SHEET.y, PIER_SHEET.z]);
      return {cam: cam(1 + 0.03 * easeOut(prog(f, 0, 95)), ax, ay), grade: {empty: 1}, paint: (p) => paintPier(p, 'empty', {f: 181 + f})};
    }
    case 'S03-B01-SH01':
      return {cam: lin(f, 148, 1, 1.04, 540, 1000), grade: {empty: 1}, paint: (p) => paintSoiWide(p, 'empty', {sheet: sheetFlip(-1), you: 'walk', f})};
    case 'S03-B01-SH02': {
      const c = cam(0.62 + 0.04 * prog(f, 0, 74), 540, 650);
      return {cam: c, grade: {empty: 1}, paint: soiClose(sheetFlip(-1 - f), 'back', true, c)};
    }
    case 'S04-B01-SH01': {
      const c = cam(0.66 + 0.02 * prog(f, 0, 89), 540, 650);
      const sheet = sheetFlip(f);
      return {cam: c, grade: {empty: 1}, header: {sx: sheet.face === 'front' ? sheet.width : 0}, paint: soiClose(sheet, 'back', true, c)};
    }
    case 'S04-B01-SH02':
      return {cam: lin(f, 74, 1, 1.06, 540, 600), grade: {empty: 1}, header: {sx: 1}, paint: soiClose(undefined, 'front', false, STILL_CAMERA)};
    case 'S04-B01-SH03': {
      // Push 1 -> 3 about the photo centre (the vector plate is re-rendered under the scale, not an upscaled raster), ease-in-out f0-94, hold with a 1 px breath.
      const e = smooth(prog(f, 0, 94));
      return {cam: cam(1 + 2 * e, 540, 593, 0, f >= 94 ? Math.sin(((f - 94) / FPS) * Math.PI * 2 * 0.5) : 0), grade: {empty: 1}, header: {sx: 1}, paint: soiClose(undefined, 'front', false, STILL_CAMERA)};
    }
    case 'S04-B01-SH04': {
      const m = smooth(prog(f, 42, 72));
      return {cam: lin(f, 87, 1, 1.006, 540, 900), grade: {empty: 1 - m, crowd: m}, paint: ywPlate(f, m)};
    }
    case 'S04-B01-SH05': {
      const m = smooth(prog(f, 10, 34));
      return {cam: lin(f, 108, 1, 1.007, 540, 960), grade: {empty: 1 - m, crowd: m}, paint: vmPlate(f, m)};
    }
    case 'S04-B01-SH06': {
      const m = smooth(prog(f, 6, 24));
      return {cam: lin(f, 36, 1.008, 1.01, 540, 860), grade: {empty: 1 - m, crowd: m}, paint: pierPlate(f, m, 35)};
    }
    case 'S04-B01-SH07': {
      const m = smooth(prog(f, 6, 24));
      return {cam: lin(f, 37, 1.04, 1.045, 540, 1000), grade: {empty: 1 - m, crowd: m}, paint: soiWidePlate(f, m)};
    }
    case 'S05-B01-SH01': {
      const hy = 860 - 80 * easeOut(prog(f, 0, 209)), pc: Cam = {...PIER_CAM, hy};
      const [mx, my] = proj(pc, [PIER_MOTHER[0], 1.2, PIER_MOTHER[2]]);
      const push = f < 209 ? 0.035 * easeOut(prog(f, 0, 209)) : 0.035 + 0.005 * prog(f, 209, 299); // one third of the speed through the hold, never frozen
      return {cam: cam(1 + push, mx, my), grade: {mother: 1}, black: prog(f, 269, 299), paint: (p) => paintPier(p, 'mother', {f, ref: 0, cam: pc})};
    }
  }
};

// --- standalone plate (QA stills, Studio) -------------------------------------------------------------------------------
const Header = ({camera, sx}: {camera: Camera; sx: number}) => {
  if (sx <= 0.02) return null;
  const [x, y] = toScreen(camera, [POSTER.x, POSTER.y + 28]);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: POSTER.w, transformOrigin: '0 0', transform: `scale(${camera.s})`, pointerEvents: 'none'}}>
      <div style={{transformOrigin: 'left center', transform: `scaleX(${sx})`, textAlign: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 800, fontSize: 118, lineHeight: 1.1, color: '#1d1a17', mixBlendMode: 'multiply', opacity: 0.92}}>ตามหา</div>
    </div>
  );
};
void SOI_CAM; void SOI_WIDE; void soiYouAt; void PIER_YOU;

/** Standalone shot (own canvas): the layers the Editor's adapter reproduces on the shared `PaintedStage` canvas. */
export const ShotPlate = ({id}: {id: Eg2ShotId}) => {
  const f = useCurrentFrame();
  const plate = plateOf(id, f);
  const fn = useCallback(
    ({brush, frame}: PaintContext) => {
      const p = makePainter(brush, {t: (f + (plate.clock ?? 0)) / FPS, frame: f, fade: PAPER});
      void frame;
      brush.push();
      applyCamera(brush, plate.cam);
      plate.paint(p);
      brush.pop();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, f],
  );
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={fn} paper={PAPER} />
      {plate.header && <Header camera={plate.cam} sx={plate.header.sx} />}
      {(Object.entries(plate.grade) as [State, number][]).map(([s, v]) => v > 0 && <AbsoluteFill key={s} style={{opacity: v}}><StateGrade state={s} /></AbsoluteFill>)}
      <Grain opacity={0.1} />
      {plate.black ? <AbsoluteFill style={{background: '#000', opacity: plate.black}} /> : null}
    </AbsoluteFill>
  );
};
