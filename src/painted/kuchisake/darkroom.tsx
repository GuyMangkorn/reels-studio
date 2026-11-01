import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawFigure} from '../kit/cast';
import {ell, hardFill, inkLine, quadX, quadY, quadZ, rectPts, washAt, type InteriorLight} from '../kit/draw';
import type {FaceState} from '../kit/head';
import type {Painter, Pt} from '../kit/painter';
import {Grade, Grain} from '../kit/screen';
import {smoothstep, type V3} from '../kit/space';
import {ColdGrade, LowerFalloff} from './room-screen';
import {FPS, hangArms, NARRATOR_DARK, PAPER_DARK, PICTURE_H, plate, push, roomP, roomUnit} from './rooms';

// KSO-EP01-SHORT LF05, the dark room (brief KSO-BRIEF-FILM-R2, VD10; shot S03-B01-SH03 "dark room, front": she slides down the
// door (crouch), ends slumped, eyes down and aside, not at the lens). At night: a door at the back, a dark window with blinds at
// the left, and ONE blind stripe of cool light (#5b7fa6) that crosses the wall behind her head. Cold grade: near-black walls and
// a blue-grey screen lift (ColdGrade). The narrator (dark jacket, P01 arms, crouched) is front-facing with the door behind her.
// Lead: at 470 px/m (depth 3.0 m) a crouch of 0.8 with the head drop (nod 0.2) leaves about 510 px of figure height, measured
// on the magenta QA entry (rule: >= 480 px).

const ZW = 1.5; // back wall and door plane (m); the narrator stands at z 1.7, her back about 0.2 m from the door
const ZFD = 3.3; // nearest floor edge painted
const STRIPE = '#5b7fa6';
const NARR_G: V3 = [0, 0, 1.7];
const CROUCH_END = 0.8; // the slump: 0 standing, 1 full crouch; 0.8 keeps the lead above 480 px
const SLIDE_END_F = 56; // the slide takes 56 f of the 84 f shot (SH03), then holds slumped

/** Crouch by the frame clock: a smooth slide down the door, then held. */
export const crouchAt = (tl: number) => CROUCH_END * smoothstep(0, SLIDE_END_F / FPS, tl);
/** Head drops with the slump (head units; positive = down), eyes down and aside. Capped at 0.2 for the lead rule. */
export const nodAt = (tl: number): Pt => [0, 0.2 * smoothstep(0.6, 2.3, tl)];

/** Narrator: the brief's `crouch` read; the face looks down and to screen-left (away from the lens). */
const L_DARK: InteriorLight = {key: [0.6, 0.35], rim: [0.9, 0.2], rimScale: 0.9};
const DARK_FACE: FaceState = {brow: 'worry', eyes: 'half', look: [-0.4, 0.6], mouth: 'flat'};

/** LF05 camera: slow push 1.00 -> 1.06 over the 84 f shot, about her head. */
export const camDark = (tl: number) => push(tl, 2.8, 1.06, 540, 700);

const q = (pts: V3[]): Pt[] => pts.map(roomP);

/** The dark room: walls and floor (washes), door and window (hard shapes), one blind stripe (translucent wash + one edge). */
export const paintDarkRoomSet = (p: Painter) => {
  washAt(p, 6_500_001, PAPER_DARK, 255, rectPts(-300, -300, 1380, 2220), 0.1, 0.2);
  washAt(p, 6_500_002, '#0d1521', 255, q(quadZ(ZW, -2, 2, 0, 2.6)), 0.2, 0.3);
  washAt(p, 6_500_003, '#0a111b', 255, q(quadX(-2, 0, 2.6, ZW, ZFD)), 0.2, 0.3);
  washAt(p, 6_500_004, '#080d14', 255, q(quadX(2, 0, 2.6, ZW, ZFD)), 0.2, 0.3);
  hardFill(p, 6_500_005, '#070b11', q(quadY(0, -2, 2, ZW, ZFD))); // crisp wall-floor edge (straight architecture)

  // Window with blinds (left of the door): a dark opening and nine slats.
  hardFill(p, 6_500_010, '#05080c', q(quadZ(ZW + 0.005, -1.65, -0.85, 0.9, 2.1)));
  for (let k = 0; k < 9; k++) inkLine(p, 6_500_020 + k, q([[-1.65, 0.95 + k * 0.14, ZW + 0.006], [-0.85, 0.95 + k * 0.14, ZW + 0.006]]), {color: '#1e2a3b', weight: 2.2, closed: false, curve: 0});

  // Door: dark frame, panel, two raised panels, a cold knob.
  hardFill(p, 6_500_040, '#05080c', q(quadZ(ZW + 0.01, -0.5, 0.5, 0, 2.05)));
  hardFill(p, 6_500_041, '#152030', q(quadZ(ZW + 0.02, -0.42, 0.42, 0.04, 2.0)));
  hardFill(p, 6_500_042, '#1b2939', q(quadZ(ZW + 0.025, -0.3, 0.3, 1.1, 1.85)));
  hardFill(p, 6_500_043, '#1b2939', q(quadZ(ZW + 0.025, -0.3, 0.3, 0.18, 0.95)));
  const [kx, ky] = roomP([0.3, 0.7, ZW + 0.03]), kr = roomUnit(ZW + 0.03) * 0.025;
  hardFill(p, 6_500_044, '#7c8ea5', ell(kx, ky, kr, kr, 12));

  // The one blind stripe: from the blind, across the wall and the door, behind her head; one hard edge on top.
  washAt(p, 6_500_050, STRIPE, 120, q([[-0.85, 1.2, ZW + 0.007], [0.9, 0.86, ZW + 0.007], [0.9, 0.8, ZW + 0.007], [-0.85, 1.12, ZW + 0.007]]), 0.05, 0.1);
  inkLine(p, 6_500_051, q([[-0.85, 1.2, ZW + 0.008], [0.9, 0.86, ZW + 0.008]]), {color: '#8fb0d6', weight: 1.2, closed: false});
};

/** The narrator sliding down the door: front view, P01 arms (hanging from the crouched shoulders), frame-driven crouch and nod. */
export const darkRoomFigures = (p: Painter, tl: number) => {
  const c = crouchAt(tl);
  const g = roomP(NARR_G), u = roomUnit(NARR_G[2]);
  drawFigure(p, NARRATOR_DARK, g, u, {view: 'front', crouch: c, nod: nodAt(tl), face: DARK_FACE, light: L_DARK, ...hangArms(NARRATOR_DARK, g, u, c, 'front')}, tl);
};

/** LF05 still composition: the set and the crouched narrator, the cold grade, lower-frame falloff, the shared grain. */
export const LF05 = ({falloff = true}: {falloff?: boolean}) => {
  const paint = useCallback(
    ({brush, frame}: PaintContext) => plate(brush, frame, camDark, (p, tl) => {
      paintDarkRoomSet(p);
      darkRoomFigures(p, tl);
    }, PAPER_DARK),
    [],
  );
  return (
    <AbsoluteFill style={{background: PAPER_DARK}}>
      <BrushCanvas paint={paint} paper={PAPER_DARK} />
      {falloff && <LowerFalloff from={800} to={PICTURE_H} peak={0.5} />}
      <ColdGrade opacity={0.16} />
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};
