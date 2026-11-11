import {loadFont} from '@remotion/fonts';
import {useCallback, type ReactNode} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {ell, washAt} from '../kit/draw';
import {paintFall} from '../kit/fall';
import {hash} from '../kit/hash';
import {makePainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {Grain} from '../kit/screen';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {paintDrop14} from '../kit/water-drop';
import {drawMosquito, MOSQ_BL_M, MOSQ_BL_SM, paintMosquito, type MosqMeasure, type MosqOpts} from './mosquito';

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

// EDU-EP18-SHORT look stills for the `new: mosquito` card (W3, brief EDU-EP18-BRIEF-R1.2 N1, SP2, LF00). Look stills only: no timeline,
// voice, caption or channel mark. The backdrops of SP2A/SP2B are stand-ins painted in screen space for the legibility test (the soi set N6,
// the macro world N7 and the woman are Boss's); the mosquito and the drop are placed through the yaw camera with the storyboard's numbers.
// Render: printf 'EDU18-LF00 0 out/edu18/look/LF00.png\n' | node scripts/stills.mjs src/painted/edu18/look-index.ts

const FPS = 30;
const PAPER = '#7d868d';
export type Grade = 'neutral' | 'cold' | 'coldest';
/** Chapter grades (brief "Light"): B03-B04 cool = -8 % warmth and #7f93a8 multiply 12 % (one multiply rgb(221,237,245)); coldest
 * (B04-SH02) adds -20 % saturation. DOM layers over the canvas, as the episode's screen grade will be. */
const gradeLayer = (g: Grade) => g === 'neutral' ? null : <AbsoluteFill style={{background: 'rgb(221,237,245)', mixBlendMode: 'multiply', pointerEvents: 'none'}} />;

export const Painted = ({paint, grade = 'neutral', children}: {paint: (p: Painter, frame: number) => void; grade?: Grade; children?: ReactNode}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: PAPER}), frame), [paint]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <AbsoluteFill style={{filter: grade === 'coldest' ? 'saturate(0.8)' : undefined}}>
        <BrushCanvas paint={fn} paper={PAPER} />
        <Grain opacity={0.05} />
      </AbsoluteFill>
      {gradeLayer(grade)}
      {children}
    </AbsoluteFill>
  );
};

const Tag = ({x, y, text}: {x: number; y: number; text: string}) => (
  <div style={{position: 'absolute', left: x - 200, top: y, width: 400, textAlign: 'center', fontFamily: 'Noto Sans Thai', fontWeight: 600, fontSize: 26, color: '#f4f1ea', textShadow: '0 2px 0 #1d2129'}}>{text}</div>
);

// ---------------------------------------------------------------- LF00 model sheet
/** Model-sheet cells: card centre, px per bl, options, label. Rows: hover L/R, clear/tip side, pressed/tip below, the 50 px row. */
export const LF00_CELLS: {g: Pt; len: number; o: MosqOpts; label: string}[] = [
  {g: [210, 290], len: 180, o: {view: 'left', state: 'hover', blur: false}, label: 'hover · left'},
  {g: [870, 290], len: 180, o: {view: 'right', state: 'hover', blur: false}, label: 'hover · right'},
  {g: [180, 790], len: 150, o: {view: 'left', state: 'clear', blur: false}, label: 'clear · left'},
  {g: [740, 790], len: 150, o: {view: 'right', state: 'tip'}, label: 'tip · right'},
  {g: [300, 1290], len: 140, o: {view: 'below', state: 'pressed'}, label: 'pressed · below'},
  {g: [800, 1290], len: 130, o: {view: 'below', state: 'tip', mirror: true}, label: 'tip · below'},
  {g: [170, 1700], len: 50, o: {view: 'left', state: 'hover'}, label: '50 px · hover blur'},
  {g: [450, 1700], len: 50, o: {view: 'right', state: 'clear'}, label: '50 px · clear'},
  {g: [720, 1700], len: 50, o: {view: 'below', state: 'pressed'}, label: '50 px · pressed'},
  {g: [960, 1700], len: 44, o: {view: 'right', state: 'hover'}, label: '44 px · LF06'},
];
/** Wingbeat phase of the sheet: a mid-up stroke so the beating wings show clear of the body. */
export const LF00_T = 0.12;

const sheetBackdrop = (p: Painter) => {
  washAt(p, 30000, '#8b949b', 255, [[0, 0], [1080, 0], [1080, 1560], [0, 1560]], 0, 0);
  washAt(p, 30001, '#6f787f', 120, [[0, 900], [1080, 900], [1080, 1560], [0, 1560]], 0.2, 0.2);
  // the small-size row on wet concrete (B01-SH01 / LF06 surroundings)
  washAt(p, 30002, '#5a5e60', 255, [[0, 1560], [1080, 1560], [1080, 1920], [0, 1920]], 0, 0);
};
export const paintLF00 = (p: Painter): MosqMeasure[] => {
  sheetBackdrop(p);
  return LF00_CELLS.map((c) => drawMosquito(p, c.g, c.len, {...c.o, t: LF00_T}));
};
export const LF00 = ({grade = 'neutral'}: {grade?: Grade}) => (
  <Painted paint={(p) => { paintLF00(p); }} grade={grade}>
    {LF00_CELLS.map((c, i) => <Tag key={i} x={c.g[0]} y={i < 2 ? c.g[1] + 315 : i < 4 ? c.g[1] + 230 : i < 6 ? c.g[1] + 245 : 1820} text={c.label} />)}
  </Painted>
);
export const LF00Cold = () => <LF00 grade="cold" />;

// ---------------------------------------------------------------- SP2A: B01-SH01 @ +0, full size, 50 px body
/** Storyboard SH01 camera at +0 (`H`, metres): pos (1.13, 0.16, 0.66), look-at (1.85, 0.34, 1.45), f 1000, near 0.02. */
export const lookCam = (pos: V3, at: V3, f: number, near?: number): YCam => {
  const dx = at[0] - pos[0], dy = at[1] - pos[1], dz = at[2] - pos[2];
  return {x: pos[0], y: pos[1], z: pos[2], yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)), f, hy: 960, near};
};
export const CAM_SH01 = lookCam([1.13, 0.16, 0.66], [1.85, 0.34, 1.45], 1000, 0.02);
export const MOSQ_SH01: V3 = [1.19, 0.2, 0.71];
const HEEL: V3 = [1.62, 0, 1.22], KNEE: V3 = [1.62, 0.47, 1.22], HIP: V3 = [1.62, 0.84, 1.22];

const paintSP2A = (p: Painter) => {
  const c = CAM_SH01;
  // stand-in soi beyond (N6 is Boss's): dusk sky, the damp wall and gate across the lane, wet concrete with warm streaks
  washAt(p, 30100, '#56616c', 255, [[0, 0], [1080, 0], [1080, 520], [0, 520]], 0, 0);
  washAt(p, 30101, '#7f776a', 255, [[0, 380], [1080, 330], [1080, 860], [0, 900]], 0.1, 0.2);
  washAt(p, 30102, '#3c4448', 230, [[640, 420], [960, 400], [960, 860], [640, 870]], 0.05, 0.1);
  washAt(p, 30103, '#3f5a3a', 200, ell(820, 330, 330, 150, 20), 0.3, 0.3);
  washAt(p, 30104, '#5a5e60', 255, [[0, 860], [1080, 830], [1080, 1920], [0, 1920]], 0, 0);
  washAt(p, 30105, '#43484b', 160, [[0, 1180], [1080, 1120], [1080, 1170], [0, 1230]], 0.2, 0.2);
  washAt(p, 30106, '#e0a85a', 90, [[0, 1000], [180, 980], [260, 1920], [0, 1920]], 0.4, 0.3); // the shop glow warming the far left
  washAt(p, 30107, '#dfe9f2', 120, ell(120, 120, 60, 60, 16), 0.3, 0.2); // LED lamp bokeh
  // her leg behind (stand-in, out of focus): skirt hem to the knee, calf to the heel, a flip-flop
  const H = camPoint(c, HEEL), K = camPoint(c, KNEE), P = camPoint(c, HIP);
  if (H && K && P) {
    const u = camUnit(c, KNEE);
    const calf: Pt[] = [[K[0] - 0.05 * u, K[1]], [K[0] - 0.062 * u, K[1] + 0.12 * u], [H[0] - 0.03 * u, H[1] - 0.07 * u], [H[0] + 0.035 * u, H[1] - 0.07 * u], [K[0] + 0.07 * u, K[1] + 0.1 * u], [K[0] + 0.055 * u, K[1]]];
    washAt(p, 30110, '#8a5a3b', 235, calf, 0.15, 0.1);
    const skirt: Pt[] = [[P[0] - 0.13 * u, -20], [P[0] + 0.14 * u, -20], [K[0] + 0.17 * u, K[1] + 10], [K[0] + 0.06 * u, K[1] + 34], [K[0] - 0.06 * u, K[1] + 36], [K[0] - 0.16 * u, K[1] + 14]];
    washAt(p, 30111, '#4a3a52', 245, skirt, 0.1, 0.1);
    washAt(p, 30112, '#3a2a22', 245, [[H[0] - 0.07 * u, H[1] - 10], [H[0] + 0.13 * u, H[1] - 14], [H[0] + 0.14 * u, H[1] + 10], [H[0] - 0.08 * u, H[1] + 12]], 0.05, 0.05);
    washAt(p, 30113, '#c7d0d6', 150, ell(H[0], H[1] + 6, 0.12 * u, 18, 18), 0.4, 0.3); // the footfall splash
  }
  // rain: far streaks, then a few near wide streaks (ENV-FALL)
  paintFall(p, 'rain', {width: 1080, height: 1920, t: p.t, captionBand: [1176, 1344]});
  paintFall(p, 'rain', {width: 1080, height: 1920, t: p.t, seed: 7, style: {count: 22, weight: 4, len: [180, 260]}, captionBand: [1176, 1344]});
  return paintMosquito(p, c, MOSQ_SH01, MOSQ_BL_M, {view: 'left', state: 'hover', t: p.t, blur: true, rimColor: '#9aa8b8'});
};
export const SP2A = () => <Painted paint={(p) => { paintSP2A(p); }} />;

// ---------------------------------------------------------------- SP2B: B05-SH01 @ +70, macro, 843 px body
/** Storyboard SH16 camera at +70 (`Dl` of D0, sm): pos (0.45, -1.55, 2.35), look-at (0, -0.95, 0), f 1300. */
export const CAM_SH16 = lookCam([0.45, -1.55, 2.35], [0, -0.95, 0], 1300);
export const MOSQ_SH16: V3 = [0, -0.95, 0];
const SM_PER_MM = 0.405;

const paintSP2B = (p: Painter) => {
  const c = CAM_SH16;
  // stand-in macro backdrop (N7 is Boss's): the dark lane, the shop glow as large warm bokeh behind the drop, the lamp, far drops
  washAt(p, 30200, '#2f3438', 255, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]], 0, 0);
  washAt(p, 30201, '#4f5a66', 200, [[0, 0], [1080, 0], [1080, 700], [0, 820]], 0.3, 0.2);
  [[260, 260, 230], [700, 160, 170], [940, 420, 140]].forEach(([x, y, r], i) => washAt(p, 30210 + i, '#f2b866', 70, ell(x, y, r, r, 24), 0.3, 0.1));
  washAt(p, 30215, '#dfe9f2', 60, ell(120, 760, 90, 90, 20), 0.3, 0.1);
  for (let i = 0; i < 14; i++) washAt(p, 30220 + i, '#9fb7c2', 70, ell(80 + 920 * hash(i * 3 + 1), 1300 + 600 * hash(i * 3 + 2), 18 + 30 * hash(i * 3 + 3), 18 + 30 * hash(i * 3 + 3), 14), 0.2, 0.1);
  // D0: the 6.2 x 4.3 mm bun (axis ratio 0.70, flat 0.47) at its centre, with the inverted shop glow inside
  const g = camPoint(c, [0, 0, 0]);
  if (g) {
    const u = camUnit(c, [0, 0, 0]) * SM_PER_MM;
    paintDrop14(p, g, u, {kind: 'bun', size: 6.2, flat: 0.47}, {seed: 30300, light: -1});
    washAt(p, 30330, '#f2b866', 175, ell(g[0] + 40, g[1] + 0.9 * u, 1.6 * u, 0.55 * u, 24), 0.2, 0.1);
    washAt(p, 30331, mixColor('#f2b866', '#ffffff', 0.3), 160, ell(g[0] + 30, g[1] + 0.95 * u, 0.7 * u, 0.25 * u, 18), 0.2, 0.1);
  }
  // the camera sits 14 deg below the face plane, so the rider reads from the side with its back on the water: `pressed`, `left` (head to -x)
  return paintMosquito(p, c, MOSQ_SH16, MOSQ_BL_SM, {view: 'left', state: 'pressed', rimColor: '#e9b46a'});
};
export const SP2B = () => <Painted paint={(p) => { paintSP2B(p); }} />;
export const SP2BCold = () => <Painted paint={(p) => { paintSP2B(p); }} grade="coldest" />;
export const SP2ACold = () => <Painted paint={(p) => { paintSP2A(p); }} grade="coldest" />;

/** Measurements of the stills' cards (px), for the tests and the handoff. */
export const measureLook = () => ({
  sh01: {at: camPoint(CAM_SH01, MOSQ_SH01), bodyPx: camUnit(CAM_SH01, MOSQ_SH01) * MOSQ_BL_M},
  sh16: {at: camPoint(CAM_SH16, MOSQ_SH16), bodyPx: camUnit(CAM_SH16, MOSQ_SH16) * MOSQ_BL_SM},
});
