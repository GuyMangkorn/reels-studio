// SET45 spike (coordinator, 4 Nov 2026; user: "if I only have 4 angles and play with the set at 45 degrees, what does it look like").
// Not a deliverable. The character keeps only the four body views (front, right, back, left); the depth comes from the set: the
// camera stands at 45 deg to both streets of the PARALLAX-ORBIT360 crossroads, so every kerb, facade and road line runs diagonally
// through the frame, and it arcs 20 deg and pushes in over the shot so the near props slide past the far ones. `คุณ` is turned to
// square up with the lens (facing it, facing away or side-on), so her view is always one of the four, never a diagonal.
import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawFigure, type FigPose} from '../kit/cast';
import {washAt, ell} from '../kit/draw';
import {EXPRESSIONS} from '../kit/expressions';
import {layerMotion} from '../kit/motions';
import {makePainter, type Painter} from '../kit/painter';
import {poseArms} from '../kit/poses';
import {Grain} from '../kit/screen';
import type {V3} from '../kit/space';
import {paintCrossroads} from '../kit/test-sets';
import {figureView4, squareToCam, type View4} from '../kit/views';
import {camPoly, camSpace, camToPicture, camUnit, orbitYCam, type YCam} from '../kit/ycam';
import {StateGrade} from '../everyone-gone/ep02/look';
import {YOU2} from '../everyone-gone/ep02/places';

const FPS = 30;
const PAPER = '#e9e6e0';
export const SET45_FRAMES = 150;
const DEG = Math.PI / 180;
const ease = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, u)));

/** One test shot: camera azimuth at mid-shot (0 = behind her on +z), arc and push, and how she squares up with the lens. */
type Shot = {az: number; arc: number; r0: number; r1: number; eye: number; square: View4};
export const SET45_SHOTS: Record<string, Shot> = {
  // Behind her, 45 deg off both streets: she walks "into" the diagonal junction.
  BACK: {az: 45, arc: 20, r0: 3.0, r1: 2.0, eye: 1.45, square: 'back'},
  // In front, 45 deg off: the two streets fan out behind her.
  FRONT: {az: 225, arc: 20, r0: 2.8, r1: 1.9, eye: 1.35, square: 'front'},
  // Side-on, 45 deg off: she looks screen-right down one diagonal.
  SIDE: {az: 135, arc: 20, r0: 2.9, r1: 2.0, eye: 1.4, square: 'right'},
};

const camAt = (s: Shot, f: number): YCam => {
  const e = ease(f / (SET45_FRAMES - 1));
  return orbitYCam([0, 0, 0], s.r0 + (s.r1 - s.r0) * e, (s.az - s.arc / 2 + s.arc * e) * DEG, s.eye, 900, 900);
};
/** Her facing (world [x, z]) is fixed for the shot, squared to the mid-shot camera (kit `squareToCam`). */
const facingOf = (s: Shot): [number, number] => squareToCam(camAt(s, (SET45_FRAMES - 1) / 2), [0, 0, 0], s.square);

const paintYou = (p: Painter, c: YCam, t: number, facing: [number, number]) => {
  const at: V3 = [0, 0, 0];
  const g = camToPicture(c, camSpace(c, at)), u = camUnit(c, at);
  washAt(p, 31500, '#2c333b', 120, camPoly(c, ell(0, 0, 0.32, 0.26, 18).map(([x, z]): V3 => [x, 0, z])), 0.3, 0.3);
  const view = figureView4(c, at, facing);
  if (view === 'back') {
    drawFigure(p, YOU2, g, u, {view, face: EXPRESSIONS.neutral, ...poseArms('P01', YOU2, g, u)} as FigPose, t, YOU2.seed);
  } else {
    const m = layerMotion({person: YOU2, motion: 'idle-breathe', t, g, unit: u, view});
    drawFigure(p, m.def, m.g, u, {...m.pose, view}, t, m.seed);
  }
};

const make = (key: keyof typeof SET45_SHOTS) => () => {
  const f = useCurrentFrame();
  const fn = useCallback(({brush}: PaintContext) => {
    const s = SET45_SHOTS[key], c = camAt(s, f), t = f / FPS, facing = facingOf(s);
    const p = makePainter(brush, {t, frame: f, fade: PAPER});
    paintCrossroads(p, c, [{at: [0, 0, 0], draw: (q, cc) => paintYou(q, cc, t, facing)}]);
  }, [f]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={fn} paper={PAPER} />
      <StateGrade state="empty" />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};
export const Set45Back = make('BACK');
export const Set45Front = make('FRONT');
export const Set45Side = make('SIDE');
