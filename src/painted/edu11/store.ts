import {camMove, camOf} from '../kit/cam-moves';
import type {CastDef, FigAnchors} from '../kit/cast';
import {ell, hardFill, washAt} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {V3} from '../kit/space';
import {paintBox, qz, wFill, wInk, type Box} from '../kit/world';
import {camPoint, type YCam} from '../kit/ycam';
import {crowdDef, horizonHy, SEP} from './hall';

// SET-STORE1857 (N4) for look frame LF04 (S01-B04-SH06 @ f1180). STORE space (metres): origin at street level under the centre bay; +x right, +y up, +z toward the street.
// Facade plane z 0, five storeys x 4.2 m cast-iron front; the centre bay x -2.0..+2.0 is cut open from y 4.2 up (stylised: the real shaft was inside the building).
// Boat W2 conditions: no store, street or maker name anywhere, no safety catch and no rope detail on the cage car (the hoist stays in shadow above the cut).
/** CAM-STORE tilt eased at f1180: target (0, 5.95, 0), yaw 0, r 5.0, eye 1.60, f 1300, hy 960 (target row; horizon row from `horizonHy`). */
export const STORE_CAM: YCam = camOf(camMove([0, 5.95, 0], [0, 0], [5.0, 5.0], 1.6, {f: 1300, hy: horizonHy(960, 1300, 5.95, 1.6, 5.0)}), 0);
export const Y_CAR = 5.85;

let n = 0;
const F = (p: Painter, c: YCam, color: string, pts: V3[]) => wFill(p, c, 40000 + n++, color, pts);
const L = (p: Painter, c: YCam, pts: V3[], w = 1.2, color: string = SEP.ink, closed = false) => wInk(p, c, 41000 + n++, pts, {color, weight: w, closed});
const B = (p: Painter, c: YCam, b: Box, color: string, o: {ink?: boolean; grain?: number} = {ink: true, grain: 14}) => paintBox(p, c, 42000 + (n += 7), b, color, {top: -0.1, front: 0.0, left: 0.2, right: 0.3}, o);
const arch = (x0: number, x1: number, y0: number, y1: number, z: number): V3[] => { // window with a round head
  const cx = (x0 + x1) / 2, r = (x1 - x0) / 2, pts: V3[] = [[x0, y0, z], [x1, y0, z], [x1, y1 - r, z]];
  for (let i = 1; i < 12; i++) { const a = (i / 12) * Math.PI; pts.push([cx + r * Math.cos(a), y1 - r + r * Math.sin(a), z]); }
  pts.push([x0, y1 - r, z]);
  return pts;
};

export const paintStore = (p: Painter, c: YCam, yCar = Y_CAR) => {
  n = 0;
  const S = SEP, ironC = '#5a4f43', cool = S.cool;
  // shaft (the cut-open bay): back wall z -1.4, warm plaster over a cooler shadow toward the top where the hoist hides
  F(p, c, mixColor(S.mid, S.paper, 0.3), qz(-1.4, -2.0, 2.0, 3.0, 22));
  for (let k = 0; k < 40; k++) F(p, c, mixColor(S.mid, S.shadow, 0.14), qz(-1.399, -2.0, 2.0, 3.0 + k * 0.5, 3.0 + k * 0.5 + 0.02)); // plaster courses
  for (const y of [4.2, 8.4, 12.6]) { F(p, c, mixColor(S.shadow, S.ink, 0.25), qz(-1.39, -2.0, 2.0, y, y + 0.28)); F(p, c, mixColor(S.mid, S.shadow, 0.5), qz(-1.38, -2.0, 2.0, y + 0.28, y + 0.34)); } // floor slabs seen in the shaft back wall
  // side walls of the bay, seen at an angle: floor-to-floor cooler shade
  for (const s of [-1, 1]) F(p, c, mixColor(cool, S.mid, 0.4), [[s * 2.0, 3.0, 0], [s * 2.0, 22, 0], [s * 2.0, 22, -1.4], [s * 2.0, 3.0, -1.4]]);
  // guide timbers x +-0.95
  for (const x of [-0.95, 0.95]) B(p, c, {x0: x - 0.07, x1: x + 0.07, y0: 3.0, y1: 22, z0: -0.5, z1: -0.36}, mixColor(S.mid, S.shadow, 0.25), {ink: true, grain: 12});
  // shadow above the cut: the hoist stays hidden
  const sh = c.hy; void sh;
  washAt(p, 40900, S.ink, 70, [[0, 0], [1080, 0], [1080, 330], [0, 330]], 0.1, 0.1);
  washAt(p, 40901, S.ink, 50, [[0, 0], [1080, 0], [1080, 520], [0, 520]], 0.1, 0.1);
  // open-cage car 1.6 x 2.2 m: floor plank, roof plate, back bars, side bars (no rope, no catch, no hoist detail)
  const cb = {x0: -0.8, x1: 0.8, z0: -0.3, z1: 0.3};
  B(p, c, {...cb, y0: yCar - 0.12, y1: yCar, }, S.mid, {ink: true, grain: 10});
  F(p, c, mixColor(S.paper, S.mid, 0.55), qz(cb.z0, cb.x0, cb.x1, yCar, yCar + 2.2));
  for (let i = 0; i <= 8; i++) F(p, c, ironC, qz(cb.z0 + 0.001, cb.x0 + i * 0.2 - 0.012, cb.x0 + i * 0.2 + 0.012, yCar, yCar + 2.2));
  B(p, c, {...cb, y0: yCar + 2.2, y1: yCar + 2.3}, mixColor(ironC, S.paper, 0.1), {ink: true, grain: 4});
};
export const paintCageFront = (p: Painter, c: YCam, yCar = Y_CAR) => { // thin lattice in front of the passengers: corner posts and a waist rail
  const ironC = '#5a4f43', x0 = -0.8, x1 = 0.8, z = 0.3;
  for (const x of [x0, x1]) F(p, c, ironC, [[x - 0.03, yCar, z], [x + 0.03, yCar, z], [x + 0.03, yCar + 2.2, z], [x - 0.03, yCar + 2.2, z]]);
  for (const y of [yCar + 0.4]) F(p, c, ironC, [[x0, y, z], [x1, y, z], [x1, y + 0.025, z], [x0, y + 0.025, z]]);
};
/** The cast-iron front: pilasters, spandrels, arched windows on storeys 2-5 beyond the cut bay, and the closed ground storey below y 4.2 (shop front, arched dark glass). */
export const paintStoreFront = (p: Painter, c: YCam) => {
  const S = SEP, ironC = mixColor(S.mid, S.shadow, 0.35);
  // ground storey y 0..4.2 across the whole width: closed iron front with arched shop windows (blank glass, no sign)
  F(p, c, mixColor(S.mid, S.shadow, 0.15), qz(0.0, -4, 4, 0, 4.2));
  for (const x0 of [-3.4, -1.15, 1.15]) { F(p, c, mixColor(S.shadow, S.ink, 0.55), arch(x0, x0 + (x0 > 0 ? 2.25 : 2.25), 0.5, 3.7, 0.01)); L(p, c, arch(x0, x0 + 2.25, 0.5, 3.7, 0.011), 2.0, S.ink, true); }
  F(p, c, mixColor(S.mid, S.paper, 0.25), qz(0.02, -4, 4, 4.0, 4.3)); L(p, c, [[-4, 4.0, 0.03], [4, 4.0, 0.03]], 2.2, S.ink); // cornice over the ground storey
  // upper storeys left and right of the bay (x beyond +-2.0): iron piers with arched windows
  for (const s of [-1, 1]) for (let k = 1; k <= 4; k++) {
    const y0 = 4.2 * k + 0.35;
    F(p, c, mixColor(S.mid, S.paper, 0.1), qz(0.0, Math.min(s * 2.0, s * 4), Math.max(s * 2.0, s * 4), 4.2 * k, 4.2 * k + 4.2));
    F(p, c, mixColor(S.shadow, S.ink, 0.5), arch(Math.min(s * 2.3, s * 3.3), Math.max(s * 2.3, s * 3.3), y0 + 0.4, y0 + 3.2, 0.01)); L(p, c, arch(Math.min(s * 2.3, s * 3.3), Math.max(s * 2.3, s * 3.3), y0 + 0.4, y0 + 3.2, 0.011), 1.8, S.ink, true);
    F(p, c, ironC, qz(0.03, s * 2.0 - 0.15, s * 2.0 + 0.15, 4.2 * k, 4.2 * k + 4.2)); L(p, c, [[s * 2.0 - 0.15, 4.2 * k, 0.04], [s * 2.0 - 0.15, 4.2 * k + 4.2, 0.04]], 1.4, S.ink); L(p, c, [[s * 2.0 + 0.15, 4.2 * k, 0.04], [s * 2.0 + 0.15, 4.2 * k + 4.2, 0.04]], 1.4, S.ink);
    F(p, c, mixColor(S.paper, S.mid, 0.5), qz(0.04, Math.min(s * 1.85, s * 4), Math.max(s * 1.85, s * 4), 4.2 * k + 4.0, 4.2 * k + 4.2));
  }
  // bay pilasters at the cut edge
  for (const s of [-1, 1]) { F(p, c, ironC, qz(0.05, s * 2.0 - 0.18, s * 2.0 + 0.18, 4.2, 22)); }
  F(p, c, mixColor(S.shadow, S.ink, 0.3), qz(0.06, -2.0, 2.0, 4.15, 4.3)); // the lintel / floor edge under the cut
};
const sepia = {to: '#8a6a3c', u: 0.14, mul: [1, 0.97, 0.9] as [number, number, number]};
export const passengers = (yCar = Y_CAR): {def: CastDef; at: V3}[] => [
  {def: crowdDef('man-parted', 1.78, 'man', '#3d352d', 950), at: [-0.3, yCar, 0.0]},
  {def: crowdDef('woman-curly', 1.62, 'woman', '#5a4a58', 951), at: [0.3, yCar, 0.02]},
];
/** Cage car height (m) in B04-SH06: rises 4.6 -> 6.2 over G1210-1316. */
export const cageY = (g: number): number => 4.6 + 1.6 * Math.max(0, Math.min(1, (g - 1210) / 106));
export const paintPassengers = (p: Painter, c: YCam, yCar = Y_CAR): (FigAnchors | null)[] =>
  passengers(yCar).map(({def, at}) => paintFigureAt(p, c, def, {at, view: 'front', pose: 'P01', face: 'neutral', t: 0, tint: sepia, shadow: {color: '#3b2f20', op: 40}}));
export const paintStoreGrade = (p: Painter) => {
  washAt(p, 43000, SEP.shadow, 16, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]], 0.2, 0.2);
  washAt(p, 43001, SEP.paper, 14, ell(540, 820, 500, 640, 24), 0.3, 0.1);
};
void camPoint; void hardFill; void PEOPLE;
export type {Pt};
