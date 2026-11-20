import {paintPaddockScene, sunOf} from '../paddock';
import {EMU_POSES, mixEmuPose} from '../emu';
import {paintFlock, type EmuMember} from '../flock';
import {FARMER, paintCrewPose} from '../cast';
import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';

// B02-SH02 (Boss T20, 2026-11-20): the farmer at the gate. Space P, light 0, eaten 0.4, stubble 0. FARMER through T12's `paintCrewPose` 'farmer' (point back
// L 3-45, turn to the lens L 47-53, talk windows); one emu behind his right shoulder stands and pecks once, the full peck at L 40 (feet planted).
const N = 85, LIGHT = 0, EATEN = 0.4, FARMER_AT: [number, number, number] = [-2.5, 0, 5.2], EMU_AT: [number, number, number] = [-3.6, 0, 3.0];
const ease3 = (u: number) => u * u * (3 - 2 * u);
const CAM = (L: number) => {
  const e = ease3(Math.max(0, Math.min(1, L / 84)));
  return camLine({eye: [-2.2, 1.45, 7.6 - 0.4 * e], yaw: -1 - 7.5 * e, pitch: -2, f: 900, hy: 860});
};
// Grazing carriage (u 0.75, head 0.69 m: the sheet's pecking head sits near 1.0 m, and a standing head at 1.6 m misses the pointing line by 177 px) with the full peck (u 1) at L 40.
const peckU = (L: number) => { const d = Math.abs(L - 40); return Math.round((0.75 + 0.25 * (d <= 1 ? 1 : d >= 6 ? 0 : ease3(1 - (d - 1) / 5))) * 8) / 8; };
const emu = (L: number): EmuMember => ({at: EMU_AT, heading: Math.PI, pose: mixEmuPose(EMU_POSES.stand(), EMU_POSES.peck(), peckU(L)), scale: 1, seed: 36020});

export const def: Shot30 = {
  id: 'B02-SH02', N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    paintPaddockScene(p, c, {light: LIGHT, eaten: EATEN, stubble: 0}, () => {
      paintFlock(p, c, [emu(L)], {sun: sunOf(LIGHT)});
    });
    const a = paintCrewPose(p, c, FARMER, FARMER_AT, {pose: 'farmer', L, seed: 34900});
    if (pr && a) pr.lead('FARMER', {top: a.top, bottom: a.bottom, x: a.head[0]});
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
