// PARALLAX-ORBIT360 spike (coordinator, 4 Nov 2026; user "ทำ 360° เลย"). Not a deliverable. The EG sets are built for a camera that
// looks down -z (`proj` has no yaw and cuts the near plane along z only) and have nothing behind the lens, so a full turn there
// breaks. The camera is now the kit yaw camera (`kit/ycam.ts`: yaw, near-plane polygon clip) and her view comes from the kit's
// six body views (`kit/views.ts`: front, front-right, right, back, left, front-left), so the spike keeps only a small set that is closed
// on every side: an empty Yaowarat-style crossroads at blue hour, `คุณ` (YOU2) standing in the middle facing -z, the camera circling her
// once at 3 m. Her view follows the camera angle by `VIEW_SECTORS` (back 135-225 deg, no back diagonals since r5; no cross-fade).
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
import {figureView, viewFields} from '../kit/views';
import {paintCrossroads} from '../kit/test-sets';
import {camPoly, camSpace, camToPicture, camUnit, orbitYCam, type YCam} from '../kit/ycam';
import {StateGrade} from '../everyone-gone/ep02/look';
import {YOU2} from '../everyone-gone/ep02/places';

const FPS = 30;
const PAPER = '#e9e6e0';
export const ORBIT360_FRAMES = 240;

const toCam = camSpace, scr = camToPicture, poly = camPoly;

// --- `คุณ` -------------------------------------------------------------------------------------------------------------
const FACING: [number, number] = [0, -1]; // she faces -z: at azimuth 0 the camera is behind her
const paintYou = (p: Painter, c: YCam, t: number) => {
  const at: V3 = [0, 0, 0];
  const g = scr(c, toCam(c, at)), u = camUnit(c, at);
  // Contact shadow on the asphalt.
  washAt(p, 31500, '#2c333b', 120, poly(c, ell(0, 0, 0.32, 0.26, 18).map(([x, z]): V3 => [x, 0, z])), 0.3, 0.3);
  const vf = viewFields(figureView(c, at, FACING));
  if (vf.view === 'back') {
    drawFigure(p, YOU2, g, u, {...vf, face: EXPRESSIONS.neutral, ...poseArms('P01', YOU2, g, u)} as FigPose, t, YOU2.seed);
  } else {
    const m = layerMotion({person: YOU2, motion: 'idle-breathe', t, g, unit: u, view: vf.view as 'front' | 'left' | 'right'});
    drawFigure(p, m.def, m.g, u, {...m.pose, ...vf}, t, m.seed);
  }
};

/** Camera on a 3 m circle about her, eye 1.5 m, looking at her; one full turn, eased at both ends. */
export const orbitCam = (f: number): YCam => {
  const u = f / (ORBIT360_FRAMES - 1), e = u < 0.08 ? (u * u) / 0.16 : u > 0.92 ? 1 - ((1 - u) ** 2) / 0.16 : u - 0.04;
  return orbitYCam([0, 0, 0], 3.0, (e / 0.92) * Math.PI * 2, 1.5, 900, 880);
};

export const Orbit360 = () => {
  const f = useCurrentFrame();
  const fn = useCallback(({brush}: PaintContext) => {
    const c = orbitCam(f);
    const t = f / FPS;
    const p = makePainter(brush, {t, frame: f, fade: PAPER});
    // The kit test set (TESTSET-CROSSROADS), with her sorted into it far to near.
    paintCrossroads(p, c, [{at: [0, 0, 0], draw: (q, cc) => paintYou(q, cc, t)}]);
  }, [f]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={fn} paper={PAPER} />
      <StateGrade state="empty" />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

