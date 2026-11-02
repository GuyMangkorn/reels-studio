import {STILL_CAMERA} from '../kit/camera';
import {drawFigure, type FigPose} from '../kit/cast';
import type {Painter, Pt} from '../kit/painter';
import {poseFor} from '../kit/poses';
import {paintRain} from '../sea';
import type {PaintedShot} from '../shot';
import {ALVARENGA, ALVARENGA_LONG, EZEQUIEL} from '../alvarenga/cast';
import {T1_DAWN, T2_STORM, T5_REEF} from '../alvarenga/palette';
import {W, hatOnHead, paintBoatBack, paintBoatFront, paintCoast, paintIslet, paintReef, paintSea, paintSky, paintSun, paintTicks, paintWaterFront, type BoatBox} from '../alvarenga/set';

// ALV-EP01-SHORT look frames L1-L3 (W3.1, Film, 2 Nov 2026; brief ALV-BRIEF-R1.1 VD11). Look-defining plates: still frames of the
// first storyboard shot at each location, not timeline shots. Boss hardens and splits per shot after the look lock (W3.2).
//   alv-look-l1  S02-SH01 open calm sea, two men, hat (T1 dawn)         wide tier 150 px/m
//   alv-look-l2  S03-SH03 storm sky over flat water, boat small (T2)     60 % scale
//   alv-look-l3  S06-SH01 reef, islet, man-buzz-long standing (T5)       medium tier 300 px/m
// Registered in the episode video `ALV-LOOK` (src/videos/alvarenga/index.ts).

const HORIZON = 760;
const seated = (def: typeof ALVARENGA, g: Pt, s: number, face: FigPose['face'], view: 'left' | 'right', id: 'P31' | 'P32' = 'P31'): FigPose => ({face, ...poseFor(id, def, g, s, view)});

const l1 = (p: Painter) => {
  const t = T1_DAWN, s = 150;
  const b: BoatBox = {cx: 500, wl: 860, s};
  paintSky(p, t, HORIZON);
  paintSun(p, t, 800, HORIZON, 70);
  paintCoast(p, t, -80, 330, HORIZON);
  paintSea(p, t, HORIZON, 1980);
  paintTicks(p, t, HORIZON + 40, 1000, 26, '#D2E1EA');
  paintBoatBack(p, t, b, [1.47, -1.47]);
  // Alvarenga seated at the stern thwart facing the bow (left); Ezequiel standing at the bow facing right, hat on.
  const gA: Pt = [500 + 1.47 * s, 860 + 0.2 * s];
  const gE: Pt = [500 - 1.47 * s, 860 + 0.2 * s];
  drawFigure(p, ALVARENGA, gA, s, seated(ALVARENGA, gA, s, {brow: 'flat', eyes: 'dot', look: [0.5, 0], mouth: 'flat'}, 'left'), 0);
  const aE = drawFigure(p, EZEQUIEL, gE, s, {face: {brow: 'flat', eyes: 'dot', look: [0.5, 0], mouth: 'smile'}, ...poseFor('P01', EZEQUIEL, gE, s, 'right')}, 0);
  hatOnHead(p, t, aE, s);
  paintBoatFront(p, t, b);
  paintWaterFront(p, t, 880, 960);
};

const l2 = (p: Painter) => {
  const t = T2_STORM, s = 90;
  const b: BoatBox = {cx: 540, wl: 880, s};
  paintSky(p, t, HORIZON);
  paintSea(p, t, HORIZON, 1980);
  paintBoatBack(p, t, b, [0.9]);
  const g: Pt = [540 + 0.9 * s, 880 + 0.2 * s];
  drawFigure(p, ALVARENGA, g, s, seated(ALVARENGA, g, s, {brow: 'worry', eyes: 'dot', look: [0.5, 0.2], mouth: 'flat'}, 'left', 'P32'), 0);
  paintBoatFront(p, t, b);
  paintWaterFront(p, t, 896, 950);
};
const l2Screen = (p: Painter) => paintRain(p, W, 1920, 0.3, 120, '#d9dbe8');

const l3 = (p: Painter) => {
  const t = T5_REEF, s = 300;
  const b: BoatBox = {cx: 1010, wl: 950, s};
  paintSky(p, t, HORIZON);
  paintSun(p, t, 300, HORIZON, 60);
  paintIslet(p, t, 820, 280, HORIZON);
  paintSea(p, t, HORIZON, 1980);
  paintReef(p, t, [{x: 180, y: 850, w: 230, h: 20}, {x: 640, y: 890, w: 300, h: 26}, {x: 300, y: 980, w: 330, h: 34}]);
  paintTicks(p, t, HORIZON + 40, 1150, 18, '#D6EEEA');
  paintBoatBack(p, t, b, [-0.6, 1.4]);
  const g: Pt = [470, 950 + 0.16 * s];
  drawFigure(p, ALVARENGA_LONG, g, s, {face: {brow: 'flat', eyes: 'dot', look: [0.6, -0.1], mouth: 'flat'}, ...poseFor('P01', ALVARENGA_LONG, g, s, 'right')}, 0);
  paintBoatFront(p, t, b);
  paintWaterFront(p, t, 1050, 1130);
};

const mk = (id: string, serves: string[], paper: string, paint: (p: Painter) => void, screen?: (p: Painter) => void): PaintedShot => ({
  id, serves, paper, camera: () => STILL_CAMERA, paint: (p) => paint(p), screen: screen ? (p) => screen(p) : undefined,
});

export const alvarengaShots: PaintedShot[] = [
  mk('alv-look-l1', ['S02-SH01'], '#F6D3B8', l1),
  mk('alv-look-l2', ['S03-SH03'], '#B7B3C6', l2, l2Screen),
  mk('alv-look-l3', ['S06-SH01'], '#F8F1DC', l3),
];
