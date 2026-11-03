import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type Brush, type PaintContext} from '../BrushCanvas';
import {applyCamera, pushCamera, type Camera} from '../kit/camera';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {paintYouBack} from './figure-back';
import {paintReachHand, paintWaveHand} from './fpov';
import {paintSoiStore} from './set';
import {proj, STATION_A, STATION_B, STATION_C, STATION_G, TOUCH, unitAt, YOU, YOU_GLASS, type Cam} from './space';
import type {V3} from '../kit/space';
import {paintStall} from './stall';
import {SensorCard} from './SensorCard';

// EG-EP01-SHORT look frames (brief EG-BRIEF-FILM-R1.3 look lock; workflow W3.1, review rows SS-R2). Look stills only: no
// timeline, no voice, no caption text. LF01 = FPOV at station B, your eyes, no hands (S02-B01-SH01, S04-B01-SH01; also the
// storefront-door family); LF01-WAVE = the P07 wave seen from your eyes (S02-B01-SH02); LF01-REACH = the P16 reach, your
// fingertips on the glass at station G (S04-B01-SH03). LF02 station A frame 0, LF03 the stall, LF04 the SVG card, LF05 the
// closing wide at station C with you small (unchanged from SS-R1). Q2 proposals: LF05-START (station A with you at the glass,
// the proposed first frame of the pull-back) and LF05-GLASS (C with the figure moved to the glass spot for continuity).

const FPS = 30;
const PAPER = '#ece9e1';

const plate = (brush: Brush, frame: number, cam: (tl: number) => Camera, paint: (p: Painter, tl: number) => void) => {
  const tl = frame / FPS;
  const p = makePainter(brush, {t: tl, frame, fade: PAPER});
  brush.push();
  applyCamera(brush, cam(tl));
  paint(p, tl);
  brush.pop();
};

/** Daylight grade: a light cool vignette only (the kit `Grade` is a night grade at 0.38 and muddies the high key, VD02). */
const DayGrade = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 65% at 50% 42%, rgba(40,52,62,0) 60%, rgba(40,52,62,0.16) 100%)'}} />
);

export const Painted = ({cam, paint}: {cam: (tl: number) => Camera; paint: (p: Painter, tl: number) => void}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => plate(brush, frame, cam, paint), [cam, paint]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={fn} paper={PAPER} />
      <DayGrade />
      <Grain opacity={0.07} />
    </AbsoluteFill>
  );
};

/** Drift < 1% over the shot (brief camera language), identity at frame 0. */
const drift = (fy: number) => (tl: number): Camera => pushCamera(tl, 4, {s0: 1, s1: 1.008, fx: 540, fy});

/** P16 away-reach hand target of the SS-R1 back-view figure (LF05 keeps it, unchanged). */
const HAND_REACH: V3 = [-0.05, 1.45, 1.2];
const figureAt = (c: Cam, at: V3 = YOU) => ({g: proj(c, at), unit: unitAt(c, at[2])});

// FPOV (R1.3): the camera is your eyes, so station B and G draw only the set, plus your right hand when it acts.
const camB = drift(900);
const paintB = (p: Painter) => paintSoiStore(p, STATION_B, {door: 0});
const paintBWave = (p: Painter, tl: number) => {
  paintSoiStore(p, STATION_B, {door: 0});
  paintWaveHand(p, 0.4 + 0.6 * Math.sin(tl * 7));
};
const camG = drift(1000);
const paintGReach = (p: Painter) => {
  paintSoiStore(p, STATION_G, {door: 0});
  paintReachHand(p, 1);
};
export const LF01 = () => <Painted cam={camB} paint={paintB} />;
export const LF01Wave = () => <Painted cam={camB} paint={paintBWave} />;
export const LF01Reach = () => <Painted cam={camG} paint={paintGReach} />;

const camA = drift(860);
const paintA = (p: Painter) => paintSoiStore(p, STATION_A, {door: 0});
export const LF02 = () => <Painted cam={camA} paint={paintA} />;

const camStall = drift(800);
export const LF03 = () => <Painted cam={camStall} paint={paintStall} />;

export const LF04 = () => <SensorCard />;

const camC = drift(1000);
const paintC = (p: Painter) => {
  paintSoiStore(p, STATION_C, {door: 0});
  const {g, unit} = figureAt(STATION_C);
  paintYouBack(p, g, unit, 'reach', {reachTo: proj(STATION_C, HAND_REACH)});
};
export const LF05 = () => <Painted cam={camC} paint={paintC} />;

/** Q2 proposal: the small figure at the FPOV reach spot (YOU_GLASS), fingertips at TOUCH, seen from station `c`. */
const figureAtGlass = (c: Cam) => (p: Painter) => {
  paintSoiStore(p, c, {door: 0});
  const {g, unit} = figureAt(c, YOU_GLASS);
  paintYouBack(p, g, unit, 'reach', {reachTo: proj(c, TOUCH)});
};
const paintAStart = figureAtGlass(STATION_A), paintCGlass = figureAtGlass(STATION_C);
export const LF05Start = () => <Painted cam={camA} paint={paintAStart} />;
export const LF05Glass = () => <Painted cam={camC} paint={paintCGlass} />;
