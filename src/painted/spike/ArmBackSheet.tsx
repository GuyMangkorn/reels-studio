import {STILL_CAMERA} from '../kit/camera';
import type {Pt} from '../kit/painter';
import type {PaintedShot} from '../shot';
import {VD18_LIGHT} from '../shots/worldfog';
import {drawFigure, type Arm} from '../worldfog/cast';
import {PlatePreview} from './PlatePreview';

// Arm-back sample (user request 30 Oct): the narrator from the front, 2x2. Cell 1 is the current IK (elbow splays to the
// side); cells 2-4 send the elbow back into depth with `Arm.behind` (upper arm or whole arm painted behind the torso).
// Arm points are local metres from the ground point (u toward screen right, v up); shoulders at about (+-0.136, 1.18).

const UNIT = 440;
const CELLS: {g: Pt; title: string; r?: Arm; l?: Arm}[] = [];
const at = (g: Pt, [u, v]: Pt): Pt => [g[0] + u * UNIT, g[1] - v * UNIT];
const cell = (i: number, title: string, arms: (g: Pt) => {r?: Arm; l?: Arm}) => {
  const g: Pt = [270 + (i % 2) * 540, 900 + Math.floor(i / 2) * 940];
  CELLS.push({g, title, ...arms(g)});
};
cell(0, '1 ตอนนี้: ศอกกางออกข้าง', (g) => ({r: {to: at(g, [-0.04, 1.0]), out: -1}, l: {to: at(g, [0.05, 0.98]), out: 1}}));
cell(1, '2 ศอกไปหลัง มือถือของหน้าอก', (g) => ({
  r: {to: at(g, [-0.04, 1.0]), via: at(g, [-0.15, 0.94]), behind: 'upper'},
  l: {to: at(g, [0.05, 0.98]), via: at(g, [0.155, 0.93]), behind: 'upper'},
}));
cell(2, '3 แขนเหวี่ยงไปหลัง (ข้างเดียว)', (g) => ({r: {to: at(g, [-0.2, 0.76]), via: at(g, [-0.17, 0.97]), behind: 'all'}}));
cell(3, '4 มือไพล่หลัง', (g) => ({
  r: {to: at(g, [-0.07, 0.74]), via: at(g, [-0.2, 0.95]), behind: 'all'},
  l: {to: at(g, [0.07, 0.74]), via: at(g, [0.2, 0.95]), behind: 'all'},
}));

const sheet: PaintedShot = {
  id: 'WFOG-ARMBACK-SAMPLE',
  serves: ['arm-back sample'],
  paper: '#5b6463',
  camera: () => STILL_CAMERA,
  paint: (p, {tl}) => {
    for (const c of CELLS) {
      drawFigure(p, 'narrator', c.g, UNIT, {
        view: 'front', light: VD18_LIGHT['CAM-INT-REV'], face: {brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'flat'},
        rArm: c.r, lArm: c.l,
      }, tl);
    }
  },
  Overlay: () => (
    <>
      {CELLS.map((c) => (
        <div key={c.title} style={{position: 'absolute', left: c.g[0] - 260, top: c.g[1] - 860, width: 520, textAlign: 'center', fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 34, color: '#fff', WebkitTextStroke: '5px #111', paintOrder: 'stroke'}}>
          {c.title}
        </div>
      ))}
    </>
  ),
};

export const ArmBackSheet = () => <PlatePreview shot={sheet} G0={0} label={false} note="" />;
