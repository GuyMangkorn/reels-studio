import type {FigAnchors} from '../kit/cast';
import type {Painter} from '../kit/painter';
import {orbitYCam, type YCam} from '../kit/ycam';
import {tinyItem} from './cast';
import {paintPlanter, sweep} from './garden';
import {clump, type Blade} from './macro';

// EDU5-COVER-A (covers.md N-A, option A "รอดไหม?"): TINY just shrunk, small on the planter soil in a clearing, a ring of grass blades
// 20-38 sm tall (13-24x her height) rising round her, the lip and hazy towers far behind the gap. Painted 3D camera, set metres `sm`
// k 320, same TINY rig and blades as the film (SET-MACRO-PLANTER). One still: she is the small scale, the blades and the far wall the big one.
const DEG = Math.PI / 180;
export const MEASURE_COVER: {a: FigAnchors | null} = {a: null};
const PAL = {base: '#5f8a34', body: '#b9d86a', edge: '#e8f2a0', vein: '#8fb24a'};
export const COVER_A_CAM = {at: [0.2, 1.0, -2.2] as const, yaw: 0, r: 3.6, eye: 0.55, pitch: 12, f: 1000, hy: 690};
export const camCoverA = (): YCam => ({...orbitYCam([COVER_A_CAM.at[0], COVER_A_CAM.at[1], COVER_A_CAM.at[2]], COVER_A_CAM.r, COVER_A_CAM.yaw * DEG, COVER_A_CAM.eye, COVER_A_CAM.f, COVER_A_CAM.hy), pitch: COVER_A_CAM.pitch * DEG});
const blades = (): Blade[] => [
  [-2.6, -1.2, 6, 1], [-4.2, -3.2, 7, 2], [2.8, -1.4, 6, 3], [4.4, -3.0, 7, 4], [-1.6, -5.0, 4, 5], [1.4, -5.2, 3, 6], [-7, -5, 5, 7], [7, -5.5, 5, 8],
].flatMap(([x, z, n, i]) => clump({x, z, n, h: [20, 38], w: [1.0, 1.6], pal: PAL, seed: 3300 + i * 11, spread: 0.8, beads: true, beadAt: [0.03, 0.14], lean: [2, 10], curl: [3, 16], sway: 1.2}));
export const paintCoverA = (p: Painter, frame: number) => {
  const c = camCoverA(), t = frame / 30 + 40, out: {a?: FigAnchors | null} = {};
  paintPlanter(p, c, {t, blades: blades(), items: [tinyItem({at: [0.2, 0, -2.2], view: 'front', pose: 'P12', face: 'surprised', faceState: {look: [0.15, -0.9]}, headCock: -3, t}, out)],
    fore: [sweep([-1.6, 0, 0.9], [0.5, -1], 4, 26, 9931, 0.8, 22, '#2f4a22'), sweep([1.7, 0, 0.8], [-0.4, -1], 6, 20, 9932, 0.9, 24, '#2f4a22')]});
  MEASURE_COVER.a = out.a ?? null;
};
