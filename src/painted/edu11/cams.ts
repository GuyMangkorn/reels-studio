import {camMove, camMoveK, camOf, type CamMove} from '../kit/cam-moves';
import {hash} from '../kit/hash';
import type {V3} from '../kit/space';
import {mixYCam, orbitYCam, type YCam} from '../kit/ycam';
import {fallY, lerp, lin, REWIND, rewindU, SHOTS, type ShotId, FPS} from './clock';
import {hallJolt} from './hall';

// EDU-EP11-SHORT cameras (scene sheets SHEETS-R1.3, camera lines): one `YCam` per shot owns projection. `hy` is the HORIZON row everywhere (SD05); a shot
// whose horizon moves lerps it with the move's own ease. Shot-local fraction u = (G - start) / (end - start); moves run linearly unless `ease` is given.

const mv = (at: V3 | [V3, V3], yaw: [number, number], r: [number, number] | number, eye: [number, number] | number, o: {f: number; hy: number; ease?: [number, number]}) => camMove(at, yaw, r, eye, o);
const withHy = (m: CamMove, hy0: number, hy1: number, u: number): YCam => ({...camOf(m, u), hy: lerp(hy0, hy1, camMoveK(m, u))});
const DEG = Math.PI / 180;

/** CAM-SHAFT-TRACK / -CLOSE / -WIDE start: the camera rides the car (target y = car floor + 0.65, eye = target y). */
export const trackCam = (yCar: number, yawDeg = 0, hy = 930, r = 8.5): YCam => camOf(camMove([0, yCar + 0.65, 0], [yawDeg, yawDeg], [r, r], yCar + 0.65, {f: 2600, hy}), 0);

export const CAM_CAR_F0: YCam = camOf(mv([0, 0.95, -0.3], [10, 10], 2.5, 1.6, {f: 1200, hy: 740}), 0);
export const CAM_CAR_FREEZE = (u: number): YCam => camOf(mv([0, 1.3, -0.3], [12, -8], [2.4, 2.2], 1.4, {f: 1200, hy: 760}), u);
export const WIDE_END: YCam = camOf(mv([0, 30, 0], [0, 0], 120, 30, {f: 2600, hy: 960}), 0);
const WIDE_START_G = 540, WIDE_END_G = 569;
/** B03-SH04: 2 px camera shake from G878 (deterministic, +-2 px on the picture shift). */
export const shakePx = (g: number): number => (g < 878 ? 0 : Math.round((hash(g * 3 + 1) * 2 - 1) * 2));

const M = {
  carSH01: mv([0, 0.95, -0.3], [10, 6], [2.5, 2.35], 1.6, {f: 1200, hy: 740}),
  carSH03: mv([0, 1.0, -0.3], [6, 3], [2.35, 2.2], 1.6, {f: 1200, hy: 740}),
  crouch: mv([-0.26, 0.75, -0.3], [3, 8], [1.9, 1.75], 1.3, {f: 1200, hy: 760}),
  cu04: mv([-0.36, 0.8, -0.3], [12, 12], [1.0, 0.95], 0.85, {f: 1300, hy: 810}),
  pov: mv([0, 1.15, 0.65], [180, 180], 1.0, 1.15, {f: 800, hy: 1000}),
  cu: mv([-0.36, 0.8, -0.3], [12, 10], [1.0, 0.92], 0.85, {f: 1300, hy: 810}),
  low: mv([0, 1.25, -0.3], [8, 4], 2.3, 0.55, {f: 1150, hy: 1190}),
  hallW: mv([0, 3, 0], [-4, 2], [5.4, 5.1], 1.6, {f: 1600, hy: 0}),
  hallM3: mv([0, 3.2, 0], [4, 2], [4.2, 4.0], 1.9, {f: 1500, hy: 0}),
  hallRope: mv([-0.15, 3.0, 0.35], [31, 32], [5.0, 4.75], 1.82, {f: 2050, hy: 0}), // SD15 (SHEETS-R1.4): B04-SH03 only
  catchM: mv([0.72, 2.65, 0.1], [-15, -15], [1.3, 1.18], 2.8, {f: 2000, hy: 0, ease: [22 / 46, 45 / 46]}),
  hallM5: mv([0, 3.2, 0], [2, 0], [4.0, 3.85], 1.9, {f: 1500, hy: 0}),
  store: mv([[0, 4.0, 0], [0, 6.5, 0]], [0, 0], 5.0, 1.6, {f: 1300, hy: 0, ease: [0, 0.9]}),
  top: mv([0, 61.2, 0], [0, 2], 12, 61.2, {f: 2600, hy: 700}),
  settle: mv([-0.1, 0.85, -0.35], [6, 12], [2.3, 2.0], 1.4, {f: 1200, hy: 760}),
  sit05: mv([-0.3, 0.62, -0.4], [15, 20], [1.6, 1.5], 1.05, {f: 1300, hy: 760}),
  sit06: mv([-0.3, 0.62, -0.4], [20, 22], [1.5, 1.46], 1.05, {f: 1300, hy: 760}),
  postRewind: mv([0, 0.95, -0.3], [10, 8], [2.5, 2.44], 1.6, {f: 1200, hy: 740}),
};
/** CAM-JAWS (rides the car; the car-relative scene is drawn with y_car = 0): target (0.85, 0.95, 0.15), yaw -20, r 0.75, f 2600, hy 800. */
export const CAM_JAWS: YCam = camOf(mv([0.85, 0.95, 0.15], [-20, -20], 0.75, 0.95, {f: 2600, hy: 800}), 0);
export const CAM_HALL_W = (u: number): YCam => withHy(M.hallW, 1375, 1399, u);
export const CAM_HALL_M3 = (u: number): YCam => withHy(M.hallM3, 1164, 1188, u);
/** CAM-HALL-ROPE (SD15, R1.4): the cut and the drop of B04-SH03 against the open hall left of the upright. */
export const CAM_HALL_ROPE = (u: number): YCam => withHy(M.hallRope, 1240, 1240, u);
export const CAM_HALL_CATCH = (u: number): YCam => withHy(M.catchM, 529, 506, u);
export const CAM_HALL_M5 = (u: number): YCam => withHy(M.hallM5, 1188, 1206, u);
export const CAM_STORE = (u: number): YCam => withHy(M.store, 1584, 2234, u);

const rng = (id: ShotId): [number, number] => { const s = SHOTS.find((q) => q[0] === id)!; return [s[1], s[2]]; };
/** The shot's camera at composition frame G (`null` for the black). Shaft cameras follow the fall clock. */
export const camAt = (id: ShotId, g: number): YCam | null => {
  const [a, b] = rng(id), u = Math.max(0, Math.min(1, (g - a) / (b - a)));
  switch (id) {
    case 'S01-B01-SH01': return camOf(M.carSH01, u);
    case 'S01-B01-SH02': return trackCam(fallY(g), lerp(0, 1, u));
    case 'S01-B01-SH03': return camOf(M.carSH03, u);
    case 'S01-B01-SH04': return camOf(M.crouch, u);
    case 'S01-B02-SH01': return trackCam(fallY(g), lerp(0, 2, u), 768, 5.0);
    case 'S01-B02-SH02': return trackCam(fallY(g), lerp(0, -2, u), 768, 5.0);
    case 'S01-B02-SH03': { const k = 1 - (1 - lin(g, WIDE_START_G, WIDE_END_G)) ** 2; return k >= 1 ? WIDE_END : mixYCam(trackCam(fallY(WIDE_START_G - 1), -2, 768, 5.0), WIDE_END, k); }
    case 'S01-B02-SH04': return camOf(M.cu04, u);
    case 'S01-B03-SH01': return camOf(M.pov, u);
    case 'S01-B03-SH02': return camOf(M.cu, u);
    case 'S01-B03-SH03': return camOf(M.low, u);
    case 'S01-B03-SH04': { const c = trackCam(fallY(g), lerp(0, 1, u)); return {...c, cx: (c.cx ?? 0) + shakePx(g)}; }
    case 'S01-B03-SH05': return null;
    case 'S01-B04-SH01': return CAM_CAR_FREEZE(u);
    case 'S01-B04-SH02': return CAM_HALL_W(u);
    case 'S01-B04-SH03': { const c = CAM_HALL_ROPE(u); return {...c, cx: (c.cx ?? 0) + hallJolt(g)}; } // 3 px jolt as the platform stops (G1101)
    case 'S01-B04-SH04': return CAM_HALL_CATCH(u);
    case 'S01-B04-SH05': return CAM_HALL_M5(u);
    case 'S01-B04-SH06': return CAM_STORE(u);
    case 'S01-B05-SH01': {
      if (g < REWIND.start) return CAM_CAR_FREEZE((977 - 905) / 73);
      if (g < REWIND.end) return mixYCam(CAM_CAR_FREEZE((977 - 905) / 73), CAM_CAR_F0, rewindU(g)); // k = 1 would be 1 ulp off: it snaps at G1340
      return camOf(M.postRewind, (g - REWIND.end) / (b - REWIND.end));
    }
    case 'S01-B05-SH02': return camOf(M.top, u);
    case 'S01-B05-SH03': return CAM_JAWS;
    case 'S01-B05-SH04': return camOf(M.settle, u);
    case 'S01-B05-SH05': return camOf(M.sit05, u);
    case 'S01-B05-SH06': return camOf(M.sit06, u);
  }
};
void orbitYCam; void DEG; void FPS;
