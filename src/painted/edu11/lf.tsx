import type {ComponentType} from 'react';
import {camMove, camOf} from '../kit/cam-moves';
import {paintFigureAt} from '../kit/figure-at';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintCar, paintFloat, paintPen, paintPhone, paintTissue, woman} from './car';
import {Hud} from './hud';
import {carCorners, paintShaft, trackCam, yCarAt} from './shaft';
import {hash} from '../kit/hash';
import {HALL_CAM, paintAssistant, paintCrowd, paintHallBack, paintHallPlatform, paintHallRope, paintSepiaGrade, paintShowman} from './hall';
import {Img, staticFile} from 'remotion';
import {CATCH_CAM_R12, JAWS_CAM, paintCatch, paintJaws} from './brakes';
import {paintCageFront, paintPassengers, paintStore, paintStoreFront, paintStoreGrade, STORE_CAM} from './store';
import {Painted} from './stage';
import {FEET} from './sp1';

// EDU-EP11-SHORT look frames LF01-LF05 (request EDU-EP11-LFREQ-R1; brief R1.2, rows ROWS-R1.2). Production owner module: the frames are the shots' real
// first frames, built on the spike sets (car.ts, shaft.ts, brakes.ts). Registered by lf-index.ts only (no episode composition in src/Root.tsx).
// Slots (DOM, frame px): LBL x 816-1020, y 148-204; HUD x 800-1040, y 224-600; CAP x 48-440, y 150-206; INSET x 760-1040, y 640-1138.

import {Cap, Pill} from './diagram';
export {Cap, Pill};

// ---------------------------------------------------------------- LF01 / LF01b (SET-CAR)
export const LF01_CAM: YCam = camOf(camMove([0, 0.95, -0.3], [10, 10], [2.5, 2.5], 1.6, {f: 1200, hy: 740}), 0);
export const paintLF01 = (p: Painter) => {
  paintCar(p, LF01_CAM, {light: 1, display: '20', bell: 0.3});
  return paintFigureAt(p, LF01_CAM, woman(0), {at: FEET, pose: 'P10', face: 'neutral', t: 0});
};

export const LF01B_CAM: YCam = camOf(camMove([0, 1.0, -0.3], [3.1, 3.1], [2.21, 2.21], 1.6, {f: 1200, hy: 740}), 0);
export const GRIP: V3 = [-0.66, 0.92, -0.3];
export const LF01B = {feet: [0.0, 0, -0.3] as V3, lift: 0.05, roll: -7, pen: [0.5, 1.28, -0.2] as V3, tissue: [0.7, 1.9, -0.2] as V3, phone: [0.62, 1.5, -0.2] as V3, phoneDeg: 40 * ((220 - 140) / 30)};
export const paintLF01b = (p: Painter, frame = 220, opts: {grip?: boolean; roll?: number; feet?: V3; lift?: number} = {}) => {
  paintCar(p, LF01B_CAM, {light: 0.85, display: '18', bell: 0.3});
  const a = paintFloat(p, LF01B_CAM, {at: opts.feet ?? LF01B.feet, t: frame / 30, lift: opts.lift ?? LF01B.lift, rise: 1, calm: true, face: 'scared', faceState: {mouth: 'flat', look: [0, 0]}, roll: opts.roll ?? LF01B.roll, grip: opts.grip === false ? undefined : GRIP});
  paintPhone(p, LF01B_CAM, LF01B.phone, 40 * ((frame - 140) / 30));
  paintPen(p, LF01B_CAM, LF01B.pen, 25 * ((frame - 140) / 30) + 20);
  paintTissue(p, LF01B_CAM, LF01B.tissue, -18 * ((frame - 140) / 30));
  return a;
};

// ---------------------------------------------------------------- LF02 (SET-SHAFT, CAM-SHAFT-CLOSE, S01-B02-SH01 @ f400)
export const LF02_F = 445; // G445 on the production fall clock (counter 15, needle 48 %): the same look as the 2026-11-09 frame
export const LF02_YC = yCarAt(LF02_F);
export const LF02_CAM: YCam = trackCam(LF02_YC, 1.9, 768, 5.0);
/** Crouch feet x: -0.36 (set plan -0.20) so the arrow at x 505-575 stands beside her instead of over her face (finding, see look-frames-report). */
export const LF02_FEETX = -0.36;
export const LF02_GRIP: V3 = [-0.66, LF02_YC + 0.92, -0.3];
export const paintLF02 = (p: Painter) => paintShaft(p, LF02_CAM, LF02_YC, {streak: 0, inside: 'crouch', t: LF02_F / 30, face: 'angry', rise: 1, grip: LF02_GRIP, feetX: LF02_FEETX}).a;
/** Speed streaks (R1.2): screen-aligned vertical strokes over the shaft only (never over the car), alpha 42 %, length = px/frame x 3, colour #dfe6ec, #ffe9b0 trailing work lights. */
export const SHAFT_PXF = ((yCarAt(LF02_F - 1) - yCarAt(LF02_F)) * 2600) / 5.0;
export const Streaks = ({alpha, car}: {alpha: number; car: [number, number, number, number]}) => {
  const len = Math.round(SHAFT_PXF * 3), items: {x: number; y: number; w: number; c: string}[] = [];
  for (let i = 0; items.length < 12 && i < 200; i++) {
    const x = Math.round(hash(i * 5 + 11) * 1060 + 10), y = Math.round(hash(i * 9 + 3) * 1900), w = 2 + Math.round(hash(i * 3 + 7) * 2);
    if (x + w > car[0] - 6 && x < car[2] + 6 && y + len > car[1] - 6 && y < car[3] + 6) continue;
    items.push({x, y, w, c: '#dfe6ec'});
  }
  return (
    <>{items.map((q, i) => <div key={i} style={{position: 'absolute', left: q.x, top: q.y, width: q.w, height: len, borderRadius: q.w / 2, background: q.c, opacity: alpha}} />)}</>
  );
};
const ArrowDown = ({x, y0, y1, w = 70}: {x: number; y0: number; y1: number; w?: number}) => {
  const cx = x + w / 2, hh = 80, sw = 30, yh = y1 - hh;
  return <polygon points={`${cx - sw / 2},${y0} ${cx + sw / 2},${y0} ${cx + sw / 2},${yh} ${x + w},${yh} ${cx},${y1} ${x},${yh} ${cx - sw / 2},${yh}`} fill="#ffffff" stroke="#2b211c" strokeWidth={5} strokeLinejoin="round" />;
};
const Lf02 = () => {
  const cc = carCorners(LF02_CAM, LF02_YC), xs = cc.map((c) => c[0]), ys = cc.map((c) => c[1]);
  return (
    <Painted band={false} paper="#1b1c1e" paint={paint(paintLF02)}>
      <Streaks alpha={0.42} car={[Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}><ArrowDown x={925} y0={700} y1={960} /><ArrowDown x={505} y0={700} y1={960} /></svg>
      <Hud counter={15} needle={0.477} pill />
    </Painted>
  );
};

// ---------------------------------------------------------------- LF03 (SET-HALL1854, S01-B04-SH02 @ f980)
export const paintLF03 = (p: Painter, sx = 0, m: 1 | -1 = 1) => {
  paintHallBack(p, HALL_CAM);
  paintHallPlatform(p, HALL_CAM);
  const show = paintShowman(p, HALL_CAM, m);
  paintHallRope(p, HALL_CAM, sx, m);
  const asst = paintAssistant(p, HALL_CAM, sx, m);
  const crowd = paintCrowd(p, HALL_CAM);
  paintSepiaGrade(p);
  return {show, asst, crowd};
};
// ---------------------------------------------------------------- LF04 (SET-STORE1857, S01-B04-SH06 @ f1180)
export const paintLF04 = (p: Painter) => {
  paintStore(p, STORE_CAM);
  const pax = paintPassengers(p, STORE_CAM);
  paintCageFront(p, STORE_CAM);
  paintStoreFront(p, STORE_CAM);
  paintStoreGrade(p);
  return pax;
};
// ---------------------------------------------------------------- LF05 (two brakes): jaws S01-B05-SH03 @ f1405, catch S01-B04-SH04 @ f1050 (+ f1042, f1045)
export const paintLF05Catch = (p: Painter, frame = 1050) => paintCatch(p, CATCH_CAM_R12(frame >= 1050 ? 1.28 : 1.28 + 0.02 * ((1050 - frame) / 3)), frame >= 1050 ? 1 : 0, {slack: frame >= 1042 ? 1 : 0.4, spring: frame >= 1045 ? 1 : 0});
export const paintLF05Jaws = (p: Painter) => paintJaws(p, JAWS_CAM, 0.1, 0);
export const Inset = ({src = 'edu11/inset-g977.png'}: {src?: string}) => (
  <div style={{position: 'absolute', left: 760, top: 640, width: 280, height: 498, boxSizing: 'border-box', border: '6px solid #fff', boxShadow: '0 6px 22px rgba(0,0,0,0.35)', overflow: 'hidden', background: '#000'}}>
    <Img src={staticFile(src)} style={{width: 268, height: 486}} />
  </div>
);

const paint = (fn: (p: Painter) => unknown) => (p: Painter) => { fn(p); };
export const LFS: Record<string, {component: ComponentType; frames: number}> = {
  'LF03': {component: () => <Painted band={false} paper="#efe2c4" paint={paint((p) => paintLF03(p, -0.7, -1))}><Cap>นิวยอร์ก 1854</Cap><Inset /></Painted>, frames: 1},
  'LF03-brief-layout': {component: () => <Painted band={false} paper="#efe2c4" paint={paint((p) => paintLF03(p, 0, 1))}><Cap>นิวยอร์ก 1854</Cap></Painted>, frames: 1},
  'LF04': {component: () => <Painted band={false} paper="#efe2c4" paint={paint(paintLF04)}><Cap>1857</Cap><Inset /></Painted>, frames: 1},
  'LF05-jaws': {component: () => <Painted band={false} paper="#20262c" paint={paint(paintLF05Jaws)}><Pill>ภาพประกอบ</Pill><Hud counter={20} needle={0.02} pill={false} /></Painted>, frames: 1},
  'LF05-catch': {component: () => <Painted band={false} paper="#efe2c4" paint={paint((p) => paintLF05Catch(p, 1050))}><Pill>ภาพประกอบ</Pill></Painted>, frames: 1},
  'LF05-catch-f1042': {component: () => <Painted band={false} paper="#efe2c4" paint={paint((p) => paintLF05Catch(p, 1042))}><Pill>ภาพประกอบ</Pill></Painted>, frames: 1},
  'LF05-catch-f1045': {component: () => <Painted band={false} paper="#efe2c4" paint={paint((p) => paintLF05Catch(p, 1045))}><Pill>ภาพประกอบ</Pill></Painted>, frames: 1},
  'LF03-noinset': {component: () => <Painted band={false} paper="#efe2c4" paint={paint((p) => paintLF03(p, -0.7, -1))}><Cap>นิวยอร์ก 1854</Cap></Painted>, frames: 1},
  'LF01b-f219': {component: () => <Painted band={false} paint={paint((p) => paintLF01b(p, 219))}><Hud counter={18} needle={0.24} pill={false} /></Painted>, frames: 1},
  'LF01b-f221': {component: () => <Painted band={false} paint={paint((p) => paintLF01b(p, 221))}><Hud counter={18} needle={0.24} pill={false} /></Painted>, frames: 1},
  'LF02': {component: Lf02, frames: 1},
  'LF01': {component: () => <Painted band={false} paint={paint(paintLF01)} />, frames: 1},
  'LF01b': {component: () => <Painted band={false} paint={paint((p) => paintLF01b(p))}><Hud counter={18} needle={0.24} pill={false} /></Painted>, frames: 1},
};
