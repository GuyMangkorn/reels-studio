import {loadFont} from '@remotion/fonts';
import {useCallback} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {orbitYCam, type YCam} from '../kit/ycam';
import {glaze} from '../kit/draw';
import {paintHotBubble, paintPaleBubble} from './bubbles';
import {b01Cast, b06Cast, paintCheckout, paintWho} from './checkout';
import {MAN} from './cast';
import {paintPlan} from './plan';
import {FractionLockup, ModelEyebrow, YouTag} from './plan-labels';
import {paintTally, StampText, TitleStrip} from './props';

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

// EDU-EP04-SHORT look frames (brief EDU-BRIEF-R1.1, workflow W3). Look stills only: no timeline, voice, caption or channel mark.
// LF01 store checkout (S01-B01-SH01), LF04 shared queue (S01-B06-SH01). Painted 3D camera: world-metre set + yaw camera.
// Render: printf 'EDU4-LF01 0 out/edu04/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu04/look-index.ts

const FPS = 30;
const DEG = Math.PI / 180;
export const PAPER = '#ece6d6';
export const LF_FRAMES = {LF01: 66, LF02: 150, LF03: 108, LF04: 96, EX01: 30} as const;

export const Painted = ({paint, paper = PAPER, grade = true}: {paint: (p: Painter, frame: number) => void; paper?: string; grade?: boolean}) => {
  const fn = useCallback(
    ({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: paper}), frame),
    [paint, paper],
  );
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      {grade && <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 95% 75% at 50% 42%, rgba(255,255,255,0) 58%, rgba(60,70,80,0.20) 100%)'}} />}
      <Grain opacity={0.09} />
    </AbsoluteFill>
  );
};

// ---- LF01 store checkout, S01-B01-SH01. Brief est `cam: T-MAN, yaw -30 -> -22, r 2.6 -> 2.3, eye 1.50, f 1100, hy 600`.
export const T_MAN: [number, number, number] = [0, 1.55, -1.3];
export const LF01_CAM = {yaw0: -6, yaw1: -4, r0: 3.8, r1: 3.5, eye: 1.9, pitch: -6, f: 860, hy: 790, cx: -90};
export const camLF01 = (frame: number): YCam => {
  const k = LF01_CAM, e = 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, frame / (LF_FRAMES.LF01 - 1)));
  return {...orbitYCam(T_MAN, k.r0 + (k.r1 - k.r0) * e, (k.yaw0 + (k.yaw1 - k.yaw0) * e) * DEG, k.eye, k.f, k.hy), pitch: k.pitch * DEG, cx: k.cx};
};
const paintLF01 = (p: Painter, frame: number) =>
  paintCheckout(p, camLF01(frame), {t: frame / FPS, who: b01Cast({face: 'suspicious', look: [-0.9, 0], headCock: -4}), lights: {1: 'off', 2: 'off', 3: 'off'}});
export const LF01 = () => <Painted paint={paintLF01} />;

// ---- LF04 shared queue, S01-B06-SH01. Brief est `cam: T-HEAD, yaw -20 -> -8, r 5.2 -> 4.8, eye 2.40, pitch -12, f 1000, hy 560`.
export const T_HEAD: [number, number, number] = [0, 1.55, -3.0];
export const LF04_CAM = {yaw0: 4, yaw1: 2, r0: 3.5, r1: 3.2, eye: 2.0, pitch: -3, f: 1050, hy: 640, cx: 0};
export const camLF04 = (frame: number): YCam => {
  const k = LF04_CAM, e = 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, frame / (LF_FRAMES.LF04 - 1)));
  return {...orbitYCam(T_HEAD, k.r0 + (k.r1 - k.r0) * e, (k.yaw0 + (k.yaw1 - k.yaw0) * e) * DEG, k.eye, k.f, k.hy), pitch: k.pitch * DEG, cx: k.cx};
};
const paintLF04 = (p: Painter, frame: number) =>
  paintCheckout(p, camLF04(frame), {t: frame / FPS, shared: true, who: b06Cast(), lights: {1: 'off', 2: 'green', 3: 'off'}});
export const LF04 = () => <Painted paint={paintLF04} paper="#efe6d2" />;

// ---- LF02 plan model, S01-B03-SH03 at the L08 state: lane 2 lit, "คุณ" on MAN's dot, "1/3" + "แบบจำลอง". `PLAN` space at 130 px/m.
const paintLF02 = (p: Painter, frame: number) => paintPlan(p, {lit: [2], manLane: 2, t: frame / FPS});
export const LF02 = () => (
  <AbsoluteFill>
    <Painted paint={paintLF02} paper="#f3ead6" grade={false} />
    <ModelEyebrow />
    <YouTag x={540 - 40} y={300 + 130 * 2.2} />
    <FractionLockup frac="1/3" />
  </AbsoluteFill>
);

// ---- LF03 memory bubbles, S01-B05-SH01 (L15). Brief est `cam: T-MAN, yaw -10 -> -4, r 1.5 -> 1.35, eye 1.50, f 1100, hy 900`; W3 v1:
// hy 1000 so the head sits y ~770-1095 (brief: head y 760-1100, bubbles y 220-700).
export const LF03_CAM = {yaw0: -10, yaw1: -4, r0: 1.5, r1: 1.4, eye: 1.5, f: 1100, hy: 1000};
export const camLF03 = (frame: number): YCam => {
  const k = LF03_CAM, e = 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, frame / (LF_FRAMES.LF03 - 1)));
  return orbitYCam([0, 1.55, -2.2], k.r0 + (k.r1 - k.r0) * e, (k.yaw0 + (k.yaw1 - k.yaw0) * e) * DEG, k.eye, k.f, k.hy);
};
const paintLF03 = (p: Painter, frame: number) => {
  const c = camLF03(frame), t = frame / FPS;
  paintCheckout(p, c, {t, who: [], empty: false, lights: {}});
  // the memory pulls focus: a cream veil over the set behind him
  glaze(p, 7000, '#f1e8d2', 120, [[-100, -100], [1180, -100], [1180, 2020], [-100, 2020]], {border: 0});
  paintWho(p, c, {key: 'man', def: MAN, at: [0, 0, -2.2], face: 'neutral', look: [0.35, -0.7], headCock: 5, basket: true}, {t, who: []});
  paintHotBubble(p, 285, 450, 235, 210, t);
  paintPaleBubble(p, 800, 500, 205, 190, t, 0.75);
};
export const LF03 = () => <Painted paint={paintLF03} />;

// ---- Props proof (not a look frame): title strip over MAN (L02), tally strokes (L12-L14) and the stamp (L16) on one card.
const paintEX = (p: Painter, frame: number) => {
  const c = camLF03(frame), t = frame / FPS;
  paintCheckout(p, c, {t, who: [], lights: {}});
  glaze(p, 7000, '#f1e8d2', 120, [[-100, -100], [1180, -100], [1180, 2020], [-100, 2020]], {border: 0});
  paintWho(p, c, {key: 'man', def: MAN, at: [0, 0, -2.2], face: 'angry', look: [0.9, 0], headCock: 6, basket: true}, {t, who: []});
  paintTally(p, 3, 400, 590, 38);
};
export const EX01 = () => (
  <AbsoluteFill>
    <Painted paint={paintEX} />
    <TitleStrip />
    <StampText y={1130} rot={-6} />
  </AbsoluteFill>
);
