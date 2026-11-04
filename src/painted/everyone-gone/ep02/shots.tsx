import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../../BrushCanvas';
import {drawFigure, type CastDef, type FigPose} from '../../kit/cast';
import {PEOPLE} from '../../kit/people';
import {dress, tintHoodie} from '../../kit/wardrobe';
import {applyCamera, STILL_CAMERA, toScreen, type Camera} from '../../kit/camera';
import {EXPRESSIONS} from '../../kit/expressions';
import {makePainter, type Painter} from '../../kit/painter';
import {layerMotion} from '../../kit/motions';
import {inkLine} from '../../kit/draw';
import {poseArms} from '../../kit/poses';
import {Grain} from '../../kit/screen';
import {proj, unitAt, type Cam} from '../space';
import {YW_CROWD} from './crowds';
import {StateGrade} from './look';
import {SOI_CROWD, SOI_WIDE, paintSoiWide, soiYouAt} from './soi-wide';
import {VM_CROWD, VM_YOU_END, paintMonument, vmYouAt} from './monument';
import {
  PIER_CAM, PIER_MOTHER, fillC, PIER_SHEET, PIER_YOU, POSTER, SOI_CAM, YOU2, YW_CAM, YW_YOU, paintPier, paintSoiPost, paintSoiSideSky, paintYaowarat, pierItems, type State,
} from './places';
import {EG2_FRAMES, EG2_SHOTS, hoodPull, sheetFlip, type Eg2ShotId, type SheetState} from './sheet';
import {facingOf, paintCrowd} from './walk';

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
  const m = layerMotion({person: YOU2, motion: 'hood-pull', t: h.t, g, unit: u, view: 'back'});
  drawFigure(p, m.def, m.g, u, m.pose, p.t, m.seed);
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
  header?: {sx: number; /** The A2 notice at 0.5 scale (S04-B01-SH01). */ mini?: boolean};
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

/** Mini-notice scale of the retired SS-R2.3 assembly; kept only for the Editor adapter's header (`mini`), unused by any shot since SS-R2.4. */
export const SOI_NOTICE_K = 0.5, SOI_NOTICE_C: [number, number] = [540, 1020];

/**
 * `คุณ` over the shoulder in S03-B01-SH02 / S04-B01-SH01 (SS-R2.4, user: "only her head shows, down at the bottom of the screen"): the
 * kit back view of `woman-bob + hoodie, P01, neutral`, hood up, headYaw +0.52, headTilt +0.52, drawn with a very large unit and the feet
 * far below the frame so only the hood and the top of the nape land in the 1080 x 1920 frame. One painter for both shots; the only
 * argument is shot time (`f` frames since the S03 cut: the head rises f 0-20 and is still from f 20). Plate coordinates of
 * `SOI_CAM`; at the camera's s 1.2 the rest pose puts the hood top on screen y 1400 and the hood about 450 px tall.
 */
export const SOI_HEAD_X = 342, SOI_HEAD_REST_TOP = 1055, SOI_HEAD_U = 706, SOI_HEAD_RISE = 168;
const SOI_HEAD_DEF: CastDef = tintHoodie(dress(PEOPLE['woman-bob'], 'hoodie'), '#5f2018', '#4a1d14');
/** S04-B01-SH01's last camera (f 88): the hold pose's screen position, kept by SH02 / SH03 (the head stays put on the screen under their own cameras). */
const SOI_HEAD_HOLD_CAM = cam(1.22 + 0.02 * prog(88, 0, 89), 540, 594, 0, 63), SOI_HEAD_HOLD_F = 74 + 88;
const soiHead = (p: Painter, f: number, to?: Camera, exitF?: number) => {
  const e = easeOut(prog(f, 0, 20)), r = to ? SOI_HEAD_HOLD_CAM.s / to.s : 1;
  // `to`: a close shot with its own camera; points go plate (hold camera) -> screen -> plate of `to`, and the unit scales by `r`.
  const M = (q: [number, number]): [number, number] => { if (!to) return q; const [X, Y] = toScreen(SOI_HEAD_HOLD_CAM, q); return [(X - to.fx - to.dx) / to.s + to.fx, (Y - to.fy - to.dy) / to.s + to.fy]; };
  const u = SOI_HEAD_U * r;
  // S04-B01-SH03 exit (SS-R2.5): the head slides down 520 screen px, ease-in over shot-local f 0-72 (plate px = screen px / camera scale).
  const dyExit = exitF === undefined ? 0 : (520 * prog(exitF, 0, 72) ** 2) / (to?.s ?? 1);
  // Gust (S04-B01-SH01 f 4-26 = f 78-100 here): the hood cloth shifts about 2 px on screen; the head does not move.
  const gust = 1.6 * Math.sin(Math.PI * prog(f, 78, 100));
  const g = M([SOI_HEAD_X + gust, SOI_HEAD_REST_TOP + SOI_HEAD_RISE * (1 - e) + 1.938 * SOI_HEAD_U]); g[1] += dyExit; // 1.938 u = hood top above the soles at tilt 0.52 (measured)
  // Gust: the hood cloth shifts 2 px (S04-B01-SH01 f 4-26; the head does not move).
  const tilt = 0.52 * e;
  drawFigure(p, SOI_HEAD_DEF, g, u, {view: 'back', hoodUp: true, face: EXPRESSIONS.neutral, ...poseArms('P01', SOI_HEAD_DEF, g, u), headYaw: 0.52, headTilt: tilt, cowl: 'drape'} as FigPose, 0, YOU2.seed);
  // Lamp spill: a thin coral rim (about 4 px on screen) on the pole-side (screen-right) edge of the hood; the points are the measured rest edge
  // (plate, s 1.22), carried with the entry rise (hood top 1639 -> 1401 on screen = 198 plate px).
  const rise = 195 * (1 - e) + 3, pts = SOI_HEAD_RIM.map(([x, y]): [number, number] => { const q = M([x + gust, y + rise]); return [q[0], q[1] + dyExit]; });
  inkLine(p, 41997, pts, {color: '#c85a40', weight: 3.3 * r, closed: false, curve: 0.5, still: true});
};
const SOI_HEAD_RIM: [number, number][] = [[427, 1440], [462, 1480], [484, 1520], [498, 1560], [506, 1600], [509, 1640], [509, 1680], [506, 1720], [502, 1760], [493, 1800]].map(([x, y]): [number, number] => [540 + (x - 540) / 1.2197, 594 + (y - 657) / 1.2197]);

const soiClose = (sheet: SheetState | undefined, poster: 'front' | 'back', head?: number, holdCam?: Camera, exitF?: number): Plate['paint'] => (p) => {
  if (head === undefined) {
    // S04-B01-SH02/SH03 (poster alone): sky above, road below and sky beside the 1080 x 1920 plate; unchanged.
    fillC(p, 41990, '#8ea0b6', [[-300, -700], [1400, -700], [1400, 40], [-300, 40]]);
    paintSoiSideSky(p, 'empty');
    fillC(p, 41991, '#6b7682', [[-300, 1880], [1400, 1880], [1400, 2700], [-300, 2700]]);
    paintSoiPost(p, 'empty', sheet ? {sheet} : {poster});
    if (holdCam && (exitF === undefined || exitF < 73)) soiHead(p, SOI_HEAD_HOLD_F, holdCam, exitF); // SH02 / SH03: she stays in shot, the hold pose of SH01's last frame
    return;
  }
  // SS-R2.4: the full-size assembly at its picture space (visible plate x 90-990, y 47-1646 at s 1.2: no sky, side or road extension), then the head.
  paintSoiPost(p, 'empty', {sheet: sheet!});
  soiHead(p, head);
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
      return {cam: lin(f, 108, 1.22, 1.23, 540, 1000), grade: {empty: 1}, paint: (p) => {
        const a = vmYouAt(f), a0 = vmYouAt(0);
        paintMonument(p, 'empty', {you: a, youWalk: Math.hypot(a[0] - a0[0], a[2] - a0[2]) / 0.8, youFacing: facingOf(VM_YOU_END[0] - a0[0], VM_YOU_END[2] - a0[2])});
      }};
    }
    case 'S01-B02-SH03':
      return {cam: lin(f, 181, 1, 1.008, 540, 860), grade: {empty: 1}, paint: (p) => paintPier(p, 'empty', {f})};
    case 'S02-B01-SH01':
      return {cam: lin(f, 86, 1, 1.04, 540, 760), grade: {empty: 1}, paint: (p) => paintYaowarat(p, 'empty', {cam: CU_GARLAND, haze: 0.55, you: false, detail: 'garland'})};
    case 'S02-B01-SH02':
      // The smoke clock is 20 f old at the cut (not restarted).
      return {cam: lin(f, 36, 1, 1.02, 540, 800), grade: {empty: 1}, clock: 20, paint: (p) => paintYaowarat(p, 'empty', {cam: CU_INCENSE, haze: 0.55, you: false, detail: 'incense'})};
    case 'S02-B01-SH03':
      return {cam: lin(f, 107, 1, 1.05, 540, 780), grade: {empty: 1}, paint: (p) => paintYaowarat(p, 'empty', {cam: CU_POLE, haze: 0.5, you: false, detail: 'pole'})};
    case 'S02-B01-SH04': {
      const [ax, ay] = proj(PIER_CAM, [PIER_SHEET.x, PIER_SHEET.y, PIER_SHEET.z]);
      return {cam: cam(1 + 0.03 * easeOut(prog(f, 0, 95)), ax, ay), grade: {empty: 1}, paint: (p) => paintPier(p, 'empty', {f: 181 + f})};
    }
    case 'S03-B01-SH01':
      return {cam: lin(f, 148, 1, 1.04, 540, 1000), grade: {empty: 1}, paint: (p) => paintSoiWide(p, 'empty', {sheet: sheetFlip(-1), you: 'walk', f})};
    case 'S03-B01-SH02': {
      return {cam: cam(1.2 + 0.02 * prog(f, 0, 74), 540, 594, 0, 63), grade: {empty: 1}, paint: soiClose(sheetFlip(-1 - f), 'back', f)};
    }
    case 'S04-B01-SH01': {
      const c = cam(1.22 + 0.02 * prog(f, 0, 89), 540, 594, 0, 63);
      const sheet = sheetFlip(f);
      return {cam: c, grade: {empty: 1}, header: {sx: sheet.face === 'front' ? sheet.width : 0}, paint: soiClose(sheet, 'back', 74 + f)};
    }
    case 'S04-B01-SH02': {
      const c = lin(f, 74, 1, 1.06, 540, 600);
      return {cam: c, grade: {empty: 1}, header: {sx: 1}, paint: soiClose(undefined, 'front', undefined, c)};
    }
    case 'S04-B01-SH03': {
      // Push 1 -> 3 about the photo centre (the vector plate is re-rendered under the scale, not an upscaled raster), ease-in-out f0-94, hold with a 1 px breath.
      const e = smooth(prog(f, 0, 94));
      const c = cam(1 + 2 * e, 540, 593, 0, f >= 94 ? Math.sin(((f - 94) / FPS) * Math.PI * 2 * 0.5) : 0);
      return {cam: c, grade: {empty: 1}, header: {sx: 1}, paint: soiClose(undefined, 'front', undefined, c, f)};
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
const Header = ({camera, sx, mini}: {camera: Camera; sx: number; mini?: boolean}) => {
  if (sx <= 0.02) return null;
  const k = mini ? SOI_NOTICE_K : 1, [x, y] = toScreen(camera, mini ? [(POSTER.x - 540) * k + SOI_NOTICE_C[0], (POSTER.y + 28 - 594) * k + SOI_NOTICE_C[1]] : [POSTER.x, POSTER.y + 28]);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: POSTER.w, transformOrigin: '0 0', transform: `scale(${camera.s * k})`, pointerEvents: 'none'}}>
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
      {plate.header && <Header camera={plate.cam} sx={plate.header.sx} mini={plate.header.mini} />}
      {(Object.entries(plate.grade) as [State, number][]).map(([s, v]) => v > 0 && <AbsoluteFill key={s} style={{opacity: v}}><StateGrade state={s} /></AbsoluteFill>)}
      <Grain opacity={0.1} />
      {plate.black ? <AbsoluteFill style={{background: '#000', opacity: plate.black}} /> : null}
    </AbsoluteFill>
  );
};
