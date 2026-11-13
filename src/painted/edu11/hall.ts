import {camMove, camOf} from '../kit/cam-moves';
import type {CastDef, FigAnchors} from '../kit/cast';
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {paintFogCone} from '../kit/fog';
import {paintFigureAt, VIEW_CUES_OFF} from '../kit/figure-at';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {V3} from '../kit/space';
import {paintBox, qy, qz, wFill, wInk, type Box} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {dress} from '../kit/wardrobe';
import {poseMix} from '../kit/poses';
import {seg as sg, lin as ln, lerp as lp} from './clock';

// SET-HALL1854 (N3), the 1850s showman (N12), the crowd/passenger dress (N14) and the axe prop (N13, wind-up pose only) for look frame LF03 (and the store, LF04).
// HALL space (metres): origin on the hall floor under the platform centre; +x screen-right, +y up, +z toward the crowd/camera. Sepia palette of the brief.
export const SEP = {paper: '#efe2c4', mid: '#b89b6e', shadow: '#6e5a3e', ink: '#3d2f22', shaft: '#fff3d6', iron: '#4b4136', ironHi: '#7a6a58', amber: '#ffb84d', cool: '#8c93a0'} as const;

/** YCam `hy` is the HORIZON row; the brief's HALL/STORE `hy` is the TARGET's picture row (the est head/feet rows only work that way). Conversion: hy_cam = hy_brief + f (target.y - eye) / r. */
export const horizonHy = (hyTarget: number, f: number, targetY: number, eye: number, r: number) => hyTarget + (f * (targetY - eye)) / r;
/** CAM-HALL-W eased at f980 (LFREQ-R1): target (0, 3.00, 0), yaw 1.9, r 5.10, eye 1.60, f 1600, hy 960 (target row; horizon row 1399). */
export const HALL_CAM: YCam = camOf(camMove([0, 3.0, 0], [1.9, 1.9], [5.1, 5.1], 1.6, {f: 1600, hy: horizonHy(960, 1600, 3.0, 1.6, 5.1)}), 0);

let n = 0;
const F = (p: Painter, c: YCam, color: string, pts: V3[]) => wFill(p, c, 30000 + n++, color, pts);
const L = (p: Painter, c: YCam, pts: V3[], w = 1.1, color: string = SEP.ink, closed = false) => wInk(p, c, 31000 + n++, pts, {color, weight: w, closed});
const B = (p: Painter, c: YCam, b: Box, color: string, o: {ink?: boolean; grain?: number} = {ink: true, grain: 14}) => paintBox(p, c, 32000 + (n += 7), b, color, {top: -0.1, front: 0.0, left: 0.2, right: 0.3}, o);

/** The hall behind everything: floor, back wall, iron columns and ribs, arched glass roof with light shafts, bunting. */
export const paintHallBack = (p: Painter, c: YCam) => {
  n = 0;
  const S = SEP;
  F(p, c, mixColor(S.mid, S.paper, 0.45), qz(-10, -14, 14, 0, 14)); // far wall
  F(p, c, mixColor(S.mid, S.shadow, 0.25), qy(0, -14, 14, -10, 8)); // timber floor
  for (let i = -14; i <= 14; i++) L(p, c, [[i * 0.7, 0, -10], [i * 0.7, 0, 8]], 0.7, mixColor(S.mid, S.shadow, 0.6));
  for (let k = 0; k < 9; k++) L(p, c, [[-14, 0, -10 + k * 2], [14, 0, -10 + k * 2]], 0.5, mixColor(S.mid, S.shadow, 0.5));
  // glass roof: pale panes between iron ribs, arch from the column tops (y 9) to the ridge (y 13)
  F(p, c, mixColor(S.shaft, S.mid, 0.2), [[-4, 9, -10], [-2.5, 11.4, -10], [0, 13, -10], [2.5, 11.4, -10], [4, 9, -10], [4, 14, -10], [-4, 14, -10]]);
  for (let z = -2; z >= -10; z -= 4) {
    const rib: V3[] = Array.from({length: 13}, (_, i) => { const u = -4 + (8 * i) / 12; return [u, 9 + 4 * (1 - (u / 4) ** 2), z]; });
    L(p, c, rib, 2.4, S.iron);
    F(p, c, mixColor(S.shaft, S.mid, 0.25), [[-4, 9, z], ...rib, [4, 9, z]]);
    L(p, c, rib, 2.4, S.iron);
  }
  // iron columns x +-4, slim and dark, every 4 m in depth; nearer ones fall out of frame
  for (const x of [-4, 4]) for (let z = -2; z >= -10; z -= 4) { B(p, c, {x0: x - 0.16, x1: x + 0.16, y0: 0, y1: 9, z0: z - 0.16, z1: z + 0.16}, S.iron, {ink: true, grain: 6}); F(p, c, S.ironHi, qz(z + 0.16, x - 0.12, x - 0.08, 0.3, 9)); }
  // bunting at y 6.5 across the hall (textless pennants)
  for (const z of [-2, -6]) {
    const sag = (u: number): V3 => [-4 + 8 * u, 6.5 - 0.5 * Math.sin(Math.PI * u), z];
    L(p, c, Array.from({length: 17}, (_, i) => sag(i / 16)), 1.4, S.shadow);
    for (let i = 0; i < 16; i++) { const a = sag(i / 16), b = sag((i + 0.7) / 16), m: V3 = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 0.34, z]; F(p, c, [S.mid, S.shadow, '#d9c9a0', '#8a6a46'][i % 4], [a, b, m]); }
  }
  // shafts of dusty light from the upper left (ENV-FOG): wide soft cones, 40 %
  for (const [x, y, ang, len, sp] of [[-120, -60, 0.95, 1700, 0.07], [60, -90, 1.05, 1750, 0.06], [260, -110, 1.12, 1700, 0.055]] as const) paintFogCone(p, {x, y, angle: ang, length: len, spread: sp, color: S.shaft, level: 0.4});
};

const notches = (p: Painter, c: YCam, x: number, side: 1 | -1, y0: number, y1: number) => { // notched inner face: sawtooth, pitch 0.10, tooth tops face up
  for (let y = y0; y < y1; y += 0.1) F(p, c, SEP.shadow, [[x, y, 0.1], [x + side * 0.06, y + 0.04, 0.1], [x + side * 0.06, y + 0.0, 0.1]]);
};
/** Uprights, platform, rails and the stage props (crates, barrel). The showman is painted after this. */
export const paintHallPlatform = (p: Painter, c0: YCam, drop = 0) => {
  const S = SEP;
  for (const x of [-1, 1]) { B(p, c0, {x0: x - 0.1, x1: x + 0.1, y0: 0, y1: 7.5, z0: -0.1, z1: 0.1}, S.mid, {ink: true, grain: 18}); notches(p, c0, x - Math.sign(x) * 0.1, (-Math.sign(x)) as 1 | -1, 0.6, 7.4); }
  const c = drop ? {...c0, y: c0.y + drop} : c0; // the deck group drops by `drop` m (camera raised by the same: an exact translation, no pitch)
  // platform: deck 1.80 x 1.80 raised to y 2.40, timber, beam below; back rail with posts, rails on the sides
  for (const z of [-0.9]) { for (const x of [-0.9, -0.45, 0, 0.45, 0.9]) B(p, c, {x0: x - 0.03, x1: x + 0.03, y0: 2.4, y1: 3.25, z0: z - 0.03, z1: z + 0.03}, S.shadow, {ink: false}); B(p, c, {x0: -0.9, x1: 0.9, y0: 3.2, y1: 3.28, z0: z - 0.04, z1: z + 0.04}, S.mid, {ink: true}); B(p, c, {x0: -0.9, x1: 0.9, y0: 2.8, y1: 2.84, z0: z - 0.03, z1: z + 0.03}, S.mid, {ink: false}); }
  // crates and barrel at the back (staging)
  B(p, c, {x0: -0.78, x1: -0.3, y0: 2.4, y1: 2.9, z0: -0.8, z1: -0.35}, mixColor(S.mid, S.paper, 0.1));
  B(p, c, {x0: -0.72, x1: -0.38, y0: 2.9, y1: 3.2, z0: -0.7, z1: -0.4}, mixColor(S.mid, S.shadow, 0.25));
  B(p, c, {x0: 0.3, x1: 0.78, y0: 2.4, y1: 2.82, z0: -0.8, z1: -0.35}, mixColor(S.mid, S.paper, 0.18));
  const bar = (y: number, r: number): Pt[] => Array.from({length: 22}, (_, i) => camPoint(c, [0.0 + r * Math.cos((i / 22) * 6.283) + 0.55, y, -0.2 + r * Math.sin((i / 22) * 6.283)]) as Pt);
  { const q0 = bar(2.4, 0.22), q1 = bar(2.95, 0.22); hardFill(p, 30900, S.mid, [...q1, ...q0.slice().reverse()].slice(0, 44)); hardFill(p, 30901, mixColor(S.mid, S.shadow, 0.3), q1); inkLine(p, 30902, q1, {color: S.ink, weight: 1.1}); for (const y of [2.55, 2.8]) inkLine(p, 30903 + y * 10, bar(y, 0.23), {color: S.shadow, weight: 1.6}); }
  // deck, apron beam and side rails (the front is open)
  B(p, c, {x0: -0.9, x1: 0.9, y0: 2.2, y1: 2.4, z0: -0.9, z1: 0.9}, S.mid, {ink: true, grain: 22});
  for (const x of [-0.9, 0.9]) { B(p, c, {x0: x - 0.03, x1: x + 0.03, y0: 2.4, y1: 3.3, z0: 0.88, z1: 0.94}, S.shadow, {ink: false}); B(p, c, {x0: x - 0.03, x1: x + 0.03, y0: 3.24, y1: 3.3, z0: -0.9, z1: 0.94}, S.mid, {ink: true}); }
  B(p, c, {x0: -0.9, x1: 0.9, y0: 2.1, y1: 2.2, z0: 0.84, z1: 0.92}, S.shadow, {ink: true});
  for (let i = 0; i < 9; i++) L(p, c, [[-0.9 + i * 0.2, 2.2, 0.901], [-0.9 + i * 0.2, 2.4, 0.901]], 0.6, mixColor(S.mid, S.shadow, 0.6));
  // hoist: frame top block, rope up toward the pulley (y 7.6, out of frame)
  B(p, c, {x0: -0.12, x1: 0.12, y0: 2.9, y1: 3.0, z0: -0.08, z1: 0.08}, S.iron, {ink: true});
  L(p, c, [[0, 3.0, 0], [0, 8.0, 0]], 3.2, S.shadow);
};
/** Rope down the right (m = +1) or, mirrored, left (m = -1) upright to the winch, intact (cut point at (1.30, 2.60, 0.40) before `sx`), the trestle and the winch. `sx` shifts trestle, winch and cut toward the platform (negative). */
export const ROPE_CUT: V3 = [1.3, 2.6, 0.4];
/** Mirrored (m = -1) the assistant still faces -x, so the cut sits 0.3 m to his left; unmirrored it is at 1.30 + sx. */
export const ropeCutAt = (sx = 0, m: 1 | -1 = 1): V3 => [m > 0 ? ROPE_CUT[0] + sx : -(1.45 + sx) - 0.3, ROPE_CUT[1], ROPE_CUT[2]];
/** SH03 hero rope (SD15, PR-ROPE-HERO): a world-width ribbon along `pts` (screen width = dia * camUnit): hemp core, lit stripe on the upper-left, diagonal twist strokes every 0.06 m, outline. */
const HERO = {core: '#7a5a36', hi: '#d9c08a', fibre: '#efd9a0'};
const unitV = (a: Pt, b: Pt): Pt => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
const ribbon = (p: Painter, c: YCam, pts3: V3[], dia: number, seed: number) => {
  const dense: V3[] = [];
  pts3.forEach((a, i) => { if (i === 0) { dense.push(a); return; } const b0 = pts3[i - 1], n = Math.max(1, Math.ceil(Math.hypot(a[0] - b0[0], a[1] - b0[1], a[2] - b0[2]) / 0.1)); for (let k = 1; k <= n; k++) dense.push([lp(b0[0], a[0], k / n), lp(b0[1], a[1], k / n), lp(b0[2], a[2], k / n)]); });
  const S: Pt[] = [], H: number[] = [];
  for (const v of dense) { const q = camPoint(c, v) as Pt | null; if (!q) return; S.push(q); H.push((dia / 2) * camUnit(c, v)); }
  const T: Pt[] = S.map((q, i) => unitV(S[Math.max(0, i - 1)], S[Math.min(S.length - 1, i + 1)]));
  const edge = (k: number): Pt[] => S.map((q, i) => [q[0] - T[i][1] * H[i] * k, q[1] + T[i][0] * H[i] * k] as Pt);
  const tm = T[Math.floor(T.length / 2)], sgn = tm[1] - tm[0] >= 0 ? 1 : -1; // normal (-ty, tx) . (-1, -1): the sign that points up-left (the lit side)
  const A = edge(1), Bq = edge(-1);
  const hm = H.reduce((a, b) => a + b, 0) / H.length; // pen strokes carry the fill: the polygon wash erodes a ribbon this thin
  inkLine(p, seed, S, {color: HERO.core, weight: 2 * hm * 0.96, closed: false});
  inkLine(p, seed + 1, edge(sgn * 0.7), {color: HERO.hi, weight: 0.6 * hm, closed: false});
  const tw = mixColor(HERO.core, SEP.ink, 0.4);
  let acc = 0, nextAt = 0.03;
  for (let i = 1; i < S.length; i++) {
    const seg = Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1], dense[i][2] - dense[i - 1][2]);
    while (acc + seg >= nextAt) {
      const k = (nextAt - acc) / seg, q: Pt = [lp(S[i - 1][0], S[i][0], k), lp(S[i - 1][1], S[i][1], k)], h = lp(H[i - 1], H[i], k), t = T[i], nx = -t[1], ny = t[0];
      if (q[1] > -60 && q[1] < 1980) inkLine(p, seed + 10 + Math.round(nextAt * 100), [[q[0] + nx * h * 0.92 - t[0] * h * 0.55, q[1] + ny * h * 0.92 - t[1] * h * 0.55], [q[0] - nx * h * 0.92 + t[0] * h * 0.55, q[1] - ny * h * 0.92 + t[1] * h * 0.55]], {color: tw, weight: 1.3, closed: false});
      nextAt += 0.06;
    }
    acc += seg;
  }
  inkLine(p, seed + 2, A, {color: SEP.ink, weight: 2.5, closed: false});
  inkLine(p, seed + 3, Bq, {color: SEP.ink, weight: 2.5, closed: false});
};
/** Frayed end: the cut face (light fibres) and a tuft of `n` strands 0.04-0.06 m, splayed +-38 deg around the outward direction (`out`, screen). */
const tuft = (p: Painter, c: YCam, at: V3, out: Pt, dia: number, n: number, seed: number) => {
  const q = camPoint(c, at) as Pt | null; if (!q) return;
  const u = camUnit(c, at), h = (dia / 2) * u, nx = -out[1], ny = out[0];
  hardFill(p, seed, HERO.fibre, [[q[0] + nx * h, q[1] + ny * h], [q[0] + out[0] * 0.012 * u + nx * h * 0.8, q[1] + out[1] * 0.012 * u + ny * h * 0.8], [q[0] + out[0] * 0.012 * u - nx * h * 0.8, q[1] + out[1] * 0.012 * u - ny * h * 0.8], [q[0] - nx * h, q[1] - ny * h]]);
  for (let i = 0; i < n; i++) {
    const f = n === 1 ? 0 : i / (n - 1) - 0.5, a = f * 2 * 38 * DEG_ + ((i * 37) % 7 - 3) * 0.012, len = (0.04 + 0.02 * (((i * 5) % 3) / 2)) * u, ca = Math.cos(a), sa = Math.sin(a);
    const d: Pt = [out[0] * ca - out[1] * sa, out[0] * sa + out[1] * ca], b: Pt = [q[0] + nx * f * 1.5 * h + out[0] * 0.012 * u, q[1] + ny * f * 1.5 * h + out[1] * 0.012 * u];
    inkLine(p, seed + 1 + i * 2, [b, [b[0] + d[0] * len, b[1] + d[1] * len]], {color: SEP.ink, weight: 3.6, closed: false});
    inkLine(p, seed + 2 + i * 2, [b, [b[0] + d[0] * len, b[1] + d[1] * len]], {color: HERO.fibre, weight: 2.0, closed: false});
  }
};
const DEG_ = Math.PI / 180;
/** `parted` 0..1 (G1091-1099): the rope's two ends after the cut: the upper end flicks up and back toward the pulley, the lower end falls slack to the winch.
 *  `hero` ({dia, g}, B04-SH03 only): the world-width ribbon rope with the 0.03 m kink at the bite, the whip and sway, the slack fall and frayed ends; omitted = the thin line of SH02/SH05, unchanged. */
export const paintHallRope = (p: Painter, c: YCam, sx = 0, m: 1 | -1 = 1, parted = 0, hero?: {dia: number; g: number}) => {
  const S = SEP, X = (x: number) => m * (x + sx), bx = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): Box => ({x0: Math.min(X(x0), X(x1)), x1: Math.max(X(x0), X(x1)), y0, y1, z0, z1});
  const qzX = (z: number, x0: number, x1: number, y0: number, y1: number) => qz(z, Math.min(X(x0), X(x1)), Math.max(X(x0), X(x1)), y0, y1);
  B(p, c, bx(1.15, 1.75, 0.0, 1.2, 0.3, 0.8), mixColor(S.mid, S.shadow, 0.2), {ink: true, grain: 18});
  F(p, c, S.shadow, qzX(0.801, 1.2, 1.7, 0.1, 1.1));
  F(p, c, mixColor(S.mid, S.paper, 0.2), qzX(0.802, 1.2, 1.7, 1.12, 1.2));
  L(p, c, [[X(1.2), 0.1, 0.803], [X(1.7), 1.1, 0.803]], 2, S.mid); L(p, c, [[X(1.7), 0.1, 0.803], [X(1.2), 1.1, 0.803]], 2, S.mid);
  B(p, c, bx(1.2, 1.7, 1.2, 1.27, 0.3, 0.8), mixColor(S.mid, S.paper, 0.15), {ink: true});
  B(p, c, bx(1.78, 2.05, 0.3, 0.9, 0.15, 0.45), S.iron, {ink: true, grain: 4}); // winch drum
  const cut = ropeCutAt(sx, m);
  const draw = (pts: V3[]) => { L(p, c, pts, 6, mixColor(S.shadow, S.ink, 0.5)); L(p, c, pts, 2.6, mixColor(S.mid, S.paper, 0.25)); };
  if (hero) {
    const d = hero.dia, g = hero.g, W: V3[] = [[X(1.45), 0.9, 0.3], [X(1.9), 0.62, 0.3]];
    if (parted <= 0) { ribbon(p, c, [[m * 1.055, 7.5, 0.1], [m * 1.07, 4.4, 0.16], [m * 1.08, 3.5, 0.32], [cut[0], cut[1] + 0.35, cut[2]], [cut[0] + m * 0.03, cut[1], cut[2]], [cut[0], cut[1] - 0.35, cut[2]], ...W], d, 34000); return; }
    const e = parted, eo = 1 - Math.pow(1 - e, 2.2), sway = -0.08 * (0.5 - 0.5 * Math.cos(e * Math.PI * 2)) * (1 - 0.5 * e), sl = sg(g, 1099, 1125);
    const up: V3 = [cut[0] + sway, cut[1] + 0.9 * eo, cut[2]], upMid: V3 = [lp(m * 1.08, up[0], 0.5) + sway * 0.8, lp(4.2, up[1], 0.5), 0.26];
    ribbon(p, c, [[m * 1.055, 7.5, 0.1], [m * 1.07, 4.2, 0.12], upMid, up], d, 34100); // top 0.025 m toward the hall: keeps the rope 20 px off the channel mark
    const lowY = cut[1] - 0.45 * eo - 0.85 * sl, lowX = cut[0] - m * 0.06 * e + (X(1.45) - cut[0]) * 0.8 * sl, low: V3 = [lowX, lowY, cut[2]];
    const lowMid: V3 = [lp(lowX, X(1.45), 0.5), lp(lowY, 0.9, 0.5), 0.35];
    ribbon(p, c, [low, lowMid, ...W], d, 34200);
    const tu = (a: V3, b: V3): Pt => { const pa = camPoint(c, a) as Pt, pb = camPoint(c, b) as Pt; return unitV(pb, pa); }; // outward = from the neighbour toward the end
    tuft(p, c, up, tu(upMid, up), d, 6, 34300);
    tuft(p, c, low, tu(lowMid, low), d, 6, 34400);
    return;
  }
  if (parted <= 0) draw([[m * 1.08, 7.5, 0.1], [m * 1.08, 3.4, 0.12], cut, [X(1.45), 0.9, 0.3], [X(1.9), 0.62, 0.3]]);
  else { // flick: the upper end whips up 0.5 m and sways, the lower end drops to the winch
    const e = parted, whip = Math.sin(e * Math.PI * 2) * 0.12 * (1 - e * 0.5);
    draw([[m * 1.08, 7.5, 0.1], [m * 1.08, 3.4 + 0.9 * e, 0.12], [cut[0] + m * whip, cut[1] + 0.9 * e, cut[2]]]);
    draw([[cut[0] - m * 0.06 * e, cut[1] - 0.45 * e, cut[2]], [X(1.45), 0.9, 0.3], [X(1.9), 0.62, 0.3]]);
  }
};

// ---------------------------------------------------------------- people
const sepiaTint = {to: '#8a6a3c', u: 0.16, mul: [1, 0.97, 0.9] as [number, number, number]};
/** N12: `man-parted + 1850s showman`: black frock coat to the knee, waistcoat, cream cravat bow, top hat (kit `gear` `top`). */
export const showmanDef = (): CastDef => {
  const d = dress(PEOPLE['man-parted'], 'office');
  return {...d, outfit: {...d.outfit, shirt: '#8a6240', sleeve: '#2b2420', longSleeves: true, jacket: '#2b2420', pants: '#3a342e', shoes: '#17130f', gear: {tie: {color: '#efe2c4', bow: true}, overcoat: {color: '#2b2420', hem: 0.62}, hat: {kind: 'top', color: '#211b17', band: '#5a4632'}}}};
};
/** N14: 1850s crowd dress on a kit person: men frock coat + top hat, women bonnet + long skirt; `height` overrides, `tone` the coat colour. */
export const crowdDef = (id: keyof typeof PEOPLE, height: number, kind: 'man' | 'woman', tone: string, seed?: number): CastDef => {
  const d = dress(PEOPLE[id], 'office');
  if (kind === 'man') return {...d, height, seed: seed ?? d.seed, outfit: {...d.outfit, shirt: mixColor(tone, '#efe2c4', 0.55), sleeve: tone, longSleeves: true, jacket: tone, pants: '#2e2a26', shoes: '#17130f', gear: {tie: {color: '#d9c9a0', bow: true}, overcoat: {color: tone, hem: 0.62}, hat: {kind: 'top', color: mixColor(tone, '#17130f', 0.5), band: '#4a3a2a'}}}};
  return {...d, height, seed: seed ?? d.seed, outfit: {...d.outfit, shirt: tone, sleeve: tone, longSleeves: true, jacket: tone, skirt: mixColor(tone, '#3a2b2e', 0.3), skirtHem: 0.1, pants: '#2e2a26', shoes: '#17130f', gear: {hat: {kind: 'bonnet', color: mixColor(tone, '#d9c9a0', 0.35), band: '#6e3a3a'}}}};
};
/** N13: the assistant's axe in the wind-up (75 % of `axe-chop`): haft through both hands, head up and back over the shoulder, edge toward the rope (-x). */
export const paintAxe = (p: Painter, a: FigAnchors, u: number, face: 1 | -1 = -1) => {
  const lo = a.lHand, hi = a.rHand;
  const dx = hi[0] - lo[0], dy = hi[1] - lo[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const s: Pt = [lo[0] - ux * 0.16 * u, lo[1] - uy * 0.16 * u], e: Pt = [hi[0] + ux * 0.4 * u, hi[1] + uy * 0.4 * u];
  inkLine(p, 33000, [s, e], {color: '#6b4a2b', weight: 0.032 * u * 1.0, closed: false, still: true});
  // blade side: the edge faces the rope (face -1 = toward -x) and, on a near-horizontal haft, down; the head sits on the haft's far end
  const n0x = -uy, n0y = ux, sg0 = n0x * face + n0y * 0.6 >= 0 ? 1 : -1, nx = n0x * sg0, ny = n0y * sg0;
  const px = (k: number, w: number): Pt => [e[0] - ux * k * u + nx * w * 0.75 * u, e[1] - uy * k * u + ny * w * 0.75 * u];
  const blade = [px(0.0, 0.0), px(-0.02, 0.2), px(0.1, 0.24), px(0.2, 0.2), px(0.17, 0.0), px(0.2, -0.05), px(0.02, -0.05)];
  hardFill(p, 33001, '#aeb2b8', blade);
  inkLine(p, 33002, blade, {color: '#2a2c30', weight: 1.6});
  hardFill(p, 33003, '#6a6f78', [px(0.0, 0.0), px(0.04, -0.06), px(0.17, -0.06), px(0.17, 0.0)]);
};
const WORLD_SHADOW = {color: '#3b2f20', op: 55};
/** A picture point `dx` m right of and `h` m above a world point, at that point's scale. */
const up = (c: YCam, at: V3, dx: number, h: number): Pt => { const g = camPoint(c, at) as Pt, u = camUnit(c, at); return [g[0] + dx * u, g[1] - h * u]; };
export const paintShowman = (p: Painter, c: YCam, m: 1 | -1 = 1): FigAnchors | null => {
  const at: V3 = [0, 2.4, 0.3], pt = {to: up(c, at, 0.44 * m, 0.3), via: up(c, at, 0.26 * m, 1.0), out: m};
  const hip = {to: up(c, at, -0.22 * m, 0.98), via: up(c, at, -0.36 * m, 1.2), out: -m};
  const arms = m > 0 ? {lArm: pt, rArm: hip} : {rArm: pt, lArm: hip}; // screen-right arm is his left
  return paintFigureAt(p, c, showmanDef(), {...VIEW_CUES_OFF, at, pose: 'P05', face: 'neutral', t: 0, tint: sepiaTint, shadow: WORLD_SHADOW, fig: arms});
};
export const paintAssistant = (p: Painter, c: YCam, sx = 0, m: 1 | -1 = 1): FigAnchors | null => {
  const at: V3 = [m * (1.45 + sx), 1.2, 0.55], g = camPoint(c, at) as Pt, u = camUnit(c, at), f = -1 as 1 | -1; // f: facing sign: he always looks toward -x, at the rope (mirrored it is on his left)
  const up2 = (dx: number, h: number): Pt => [g[0] + dx * u, g[1] - h * u], bk = -f; // `bk` is behind him
  const outfit = {...PEOPLE['man-buzz'].outfit, gear: {hat: {kind: 'cap' as const, color: '#6a5a46', band: '#2b2420'}}};
  // axe raised in FRONT of him over the rope (the rope is on the side he faces): hands forward and up, haft rising toward the rope, clear of his face and of the showman
  const fig = {lArm: {to: up2(f * -0.04, 1.3), via: up2(f * 0.12, 1.1), out: f}, rArm: {to: up2(f * -0.3, 1.74), via: up2(f * -0.12, 1.56), out: f}};
  return paintFigureAt(p, c, {...PEOPLE['man-buzz'], outfit}, {...VIEW_CUES_OFF, at, view: 'left', pose: 'P01', face: 'neutral', t: 0, tint: sepiaTint, shadow: WORLD_SHADOW, fig, held: (q, an, uu) => paintAxe(q, an, uu, f)});
};
export const CROWD: {at: V3; height: number; kind: 'man' | 'woman'; id: keyof typeof PEOPLE; tone: string}[] = [
  {at: [-0.6, 0, 3.0], height: 1.72, kind: 'man', id: 'man-crop', tone: '#463a30'},
  {at: [0.7, 0, 2.8], height: 1.65, kind: 'woman', id: 'woman-curly', tone: '#6a4f3a'},
  {at: [-1.5, 0, 3.6], height: 1.6, kind: 'woman', id: 'woman-bob', tone: '#4b3f48'},
  {at: [1.6, 0, 3.4], height: 1.78, kind: 'man', id: 'man-spiky', tone: '#3a3a40'},
];
export const paintCrowd = (p: Painter, c: YCam): (FigAnchors | null)[] =>
  CROWD.map((q, i) => paintFigureAt(p, c, crowdDef(q.id, q.height, q.kind, q.tone, 900 + i), {...VIEW_CUES_OFF, at: q.at, view: 'back', pose: 'P01', t: 0, tint: {...sepiaTint, u: 0.22}, shadow: false}));
/** Warm sepia grade and vignette over the whole frame (the hall is a 1854 reconstruction). */
export const paintSepiaGrade = (p: Painter) => {
  washAt(p, 34000, SEP.shadow, 20, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]], 0.2, 0.2);
  washAt(p, 34001, SEP.paper, 16, ell(540, 900, 560, 760, 24), 0.3, 0.1);
};

// ---------------------------------------------------------------- production states of the 1854 hall (B04-SH02..SH05, pure in G)
/** Platform drop (m): 0.15 m G1093-1101 after the cut; the catch holds it there. */
export const hallDrop = (g: number): number => 0.15 * sg(g, 1093, 1101);
/** Rope parting 0..1 from G1091 over 8 f. */
export const ropeParted = (g: number): number => ln(g, 1091, 1099);
/** B04-SH03 frame jolt (px) as the platform stops at G1101: 3 px decaying over 3 f. */
export const hallJolt = (g: number): number => (g >= 1101 && g < 1104 ? [3, -2, 1][g - 1101] : 0);
/** Showman: pointing down-left at the assistant G1058-1066 (held, lowered G1100-1110); the top hat raised G1180-1200 (`hat-raise`, right hand), `smug` from G1180. */
export const showmanAt = (g: number) => ({point: g < 1058 ? 0 : g < 1100 ? sg(g, 1058, 1066) : 1 - sg(g, 1100, 1110), hat: g < 1180 ? 0 : sg(g, 1180, 1200), face: (g >= 1180 ? 'smug' : 'neutral') as 'smug' | 'neutral'});
export const paintShowmanAt = (p: Painter, c: YCam, m: 1 | -1, g: number): FigAnchors | null => {
  const st = showmanAt(g), y = 2.4 - hallDrop(g), at: V3 = [0, y, 0.3], def = showmanDef();
  const hang = (dx: number, h: number) => up(c, at, dx * m, h);
  const pt = {to: lerpP(hang(0.2, 0.95), hang(0.46, 0.62), st.point), via: lerpP(hang(0.14, 1.05), hang(0.3, 1.0), st.point), out: m}; // 0.62 m: the pointing hand stays within the arm's reach (user, B04-SH03)
  const hip = {to: hang(-0.22, 0.98), via: hang(-0.36, 1.2), out: -m as number};
  const HAT_GRAB = 0.4, HAT_HOLD = 0.7; // the hand first rises to the brim on his head (k < 0.4), grabs it, then lifts it (hat and hand move as one)
  const k = st.hat, k1 = seg1(k / HAT_GRAB), k2 = seg1((k - HAT_GRAB) / (1 - HAT_GRAB));
  const brim = {to: hang(0.17, 1.74), via: hang(0.3, 1.3), out: m};
  const hatArm = {to: hang(0.3, 1.95), via: hang(0.36, 1.45), out: m};
  const useHat = k >= HAT_GRAB; // hatless (hat in the hand) from the grab
  const ptArm = k > 0.01 ? {to: lerpP(lerpP(pt.to, brim.to, k1), hatArm.to, k2), via: lerpP(lerpP(pt.via, brim.via, k1), hatArm.via, k2), out: m} : st.point > 0.01 ? pt : undefined;
  const arms = m > 0 ? {lArm: ptArm, rArm: hip} : {rArm: ptArm, lArm: hip}; // screen-right arm is his left
  // the hat comes off the head while the hand lifts it: the figure is drawn hatless from the first frame of the lift
  const hatless = {...def, outfit: {...def.outfit, gear: {...def.outfit.gear, hat: undefined}}};
  const a = paintFigureAt(p, c, useHat ? hatless : def, {...VIEW_CUES_OFF, at, pose: 'P05', face: st.face, t: 0, tint: sepiaTint, shadow: WORLD_SHADOW, fig: arms as never});
  if (a && useHat) paintTopHat(p, c, at, a, seg1((k - HAT_GRAB) / (HAT_HOLD - HAT_GRAB)), m, brim.to);
  return a;
};
/** Top hat in the lifted hand: lerps from the head top to above the hand. */
const paintTopHat = (p: Painter, c: YCam, at: V3, a: FigAnchors, k: number, m: 1 | -1, grab: Pt) => {
  const hand = (m > 0 ? a.lHand : a.rHand), u = camUnit(c, at), headTop: Pt = [a.head[0], a.headTop];
  // the hat rides the hand rigidly from the grab: the offset between the hat on his head and the hand on the brim decays to the hat resting on the fist (no gap, no flight)
  const o0: Pt = [headTop[0] - grab[0], headTop[1] + 0.03 * u - grab[1]], kk = seg1(k), ctr: Pt = [hand[0] + lp(o0[0], 0, kk), hand[1] + lp(o0[1], 0.02 * u, kk)];
  const w = 0.2 * u, h = 0.24 * u, bw = 0.3 * u;
  const body: Pt[] = [[ctr[0] - w / 2, ctr[1]], [ctr[0] + w / 2, ctr[1]], [ctr[0] + w * 0.46, ctr[1] - h], [ctr[0] - w * 0.46, ctr[1] - h]];
  hardFill(p, 33100, '#211b17', body);
  hardFill(p, 33101, '#5a4632', [[ctr[0] - w / 2, ctr[1] - 0.03 * u], [ctr[0] + w / 2, ctr[1] - 0.03 * u], [ctr[0] + w / 2, ctr[1] - 0.07 * u], [ctr[0] - w / 2, ctr[1] - 0.07 * u]]);
  hardFill(p, 33102, '#211b17', ell(ctr[0], ctr[1], bw / 2, 0.035 * u, 16));
  inkLine(p, 33103, body, {color: SEP.ink, weight: 1.2});
};
const seg1 = (k: number) => Math.max(0, Math.min(1, k));
const lerpP = (a: Pt, b: Pt, u: number): Pt => [lp(a[0], b[0], u), lp(a[1], b[1], u)];
/** Assistant (`axe-chop`): hands low G<1063, axe raised on the rope side G1063-1083, chop G1086-1092 (bite G1091), then rests low. */
export const assistantAt = (g: number): {raise: number; chop: number; fwd: boolean} => ({fwd: g < 1092, raise: g < 1063 ? 0 : g < 1086 ? sg(g, 1063, 1083) : 1, chop: g < 1086 ? 0 : g < 1092 ? sg(g, 1086, 1092) : 1 - sg(g, 1096, 1112)});
/** B04-SH03 (SD15) assistant mark: feet (-0.50, 1.20, 0.45), left view squared to the lens. */
export const SH03_ASSISTANT: V3 = [-0.5, 1.2, 0.45];
const SH03_LEAN = 0.08; // leans back from the swing so the cap brim clears the rope (66 px at G1091), upright again as the axe is lowered
/** B04-SH03 axe keys (world, m): the edge on the cut point K (-1.05, 2.60) sunk half a rope diameter at G1091, follow-through to (-1.18, 2.52) G1092-1094 (ease-out), then lowered to hang at his side G1095-1110. Haft 27 deg below horizontal (hands 0.44 m behind the edge). */
export const heroAxeAt = (g: number) => {
  const t = ln(g, 1091, 1094), ft = 1 - (1 - t) * (1 - t), lw = sg(g, 1095, 1110);
  const dx = -0.1175 * ft, dy = -0.08 * ft;
  const edge0: V3 = [-1.0625 + dx, 2.6 + dy, 0.4], front0: V3 = [-0.66 + dx, 2.8 + dy, 0.45], rear0: V3 = [-0.48 + dx, 2.89 + dy, 0.45];
  const edge1: V3 = [-0.64, 1.47, 0.4], front1: V3 = [-0.5, 1.92, 0.45], rear1: V3 = [-0.46, 2.14, 0.45];
  const mx = (a: V3, b: V3): V3 => [lp(a[0], b[0], lw), lp(a[1], b[1], lw), lp(a[2], b[2], lw)];
  const elbF = mx([-0.5 + dx, 2.4 + dy, 0.55], [-0.4, 2.0, 0.55]), elbR = mx([-0.32 + dx, 2.5 + dy, 0.55], [-0.36, 2.2, 0.55]);
  return {edge: mx(edge0, edge1), front: mx(front0, front1), rear: mx(rear0, rear1), elbF, elbR};
};
/** The hero axe: haft from the rear hand to the head, a wedge head with its edge facing the rope (-x), the blade 0.22 m. */
const paintAxeHero = (p: Painter, c: YCam, an: FigAnchors, edge: V3) => {
  const E = camPoint(c, edge) as Pt | null; if (!E) return;
  const u = camUnit(c, edge), r = an.lHand, d = unitV(r, E), nx = -d[1], ny = d[0];
  const at = (a: number, b: number): Pt => [E[0] + d[0] * a * u + nx * b * u, E[1] + d[1] * a * u + ny * b * u];
  inkLine(p, 33010, [at(-1.2, 0), at(-0.1, 0)].map((q, i) => (i === 0 ? [r[0] - d[0] * 0.24 * u, r[1] - d[1] * 0.24 * u] : q) as Pt), {color: '#6b4a2b', weight: 0.034 * u, closed: false, still: true});
  const blade = [at(0, 0.11), at(0, -0.11), at(-0.15, -0.045), at(-0.15, 0.045)];
  hardFill(p, 33011, '#aeb2b8', blade);
  inkLine(p, 33012, blade, {color: '#2a2c30', weight: 1.8, still: true});
  hardFill(p, 33013, '#6a6f78', [at(-0.11, 0.05), at(-0.11, -0.05), at(-0.19, -0.05), at(-0.19, 0.05)]);
  inkLine(p, 33014, [at(0, 0.11), at(0, -0.11)], {color: '#e9ecef', weight: 1.6, closed: false, still: true});
};
const paintAssistantHero = (p: Painter, c: YCam, g: number): FigAnchors | null => {
  const at = SH03_ASSISTANT, k = heroAxeAt(g), P = (v: V3) => camPoint(c, v) as Pt, f = -1;
  const outfit = {...PEOPLE['man-buzz'].outfit, gear: {hat: {kind: 'cap' as const, color: '#6a5a46', band: '#2b2420'}}};
  const fig = {lArm: {to: P(k.rear), via: P(k.elbR), out: f}, rArm: {to: P(k.front), via: P(k.elbF), out: f}, lean: SH03_LEAN * (1 - sg(g, 1095, 1110))};
  return paintFigureAt(p, c, {...PEOPLE['man-buzz'], outfit}, {...VIEW_CUES_OFF, at, view: 'left', pose: 'P01', face: 'neutral', t: 0, tint: sepiaTint, shadow: WORLD_SHADOW, fig, held: (q, an) => paintAxeHero(q, c, an, k.edge)});
};
export const paintAssistantAt = (p: Painter, c: YCam, sx: number, m: 1 | -1, g: number): FigAnchors | null => {
  const at: V3 = [m * (1.45 + sx) - m * 0.2, 1.2, 0.55], g0 = camPoint(c, at) as Pt, u = camUnit(c, at), f = -1 as 1 | -1; // 0.2 m back from the rope so the swing clears his face
  const up2 = (dx: number, h: number): Pt => [g0[0] + dx * u, g0[1] - h * u];
  const st = assistantAt(g);
  const lo = {l: up2(f * 0.18, 0.8), r: up2(f * 0.3, 0.95), lv: up2(f * 0.1, 0.78), rv: up2(f * 0.18, 0.9)};
  const hi = {l: up2(f * -0.04, 1.3), r: up2(f * -0.14, 1.8), lv: up2(f * 0.1, 1.1), rv: up2(f * -0.06, 1.56)};
  // downswing: the haft comes over from behind, clear of his face (over: haft behind the head), the head ends on the rope's cut point (0.24 m ahead, 1.37 m up)
  const ch = {l: up2(f * 0.0, 2.0), r: up2(f * 0.17, 1.8), lv: up2(f * -0.1, 1.6), rv: up2(f * 0.08, 1.9)};
  const ov = {l: up2(f * -0.32, 1.7), r: up2(f * -0.3, 2.1), lv: up2(f * -0.2, 1.5), rv: up2(f * -0.3, 1.9)};
  const mix = (a: Pt, b: Pt, d: Pt, r: number, ck: number) => {
    const base = lerpP(a, b, r), o = a === lo.l ? ov.l : a === lo.r ? ov.r : a === lo.lv ? ov.lv : ov.rv;
    return ck < 0.45 ? lerpP(base, o, ck / 0.45) : lerpP(o, d, (ck - 0.45) / 0.55); // out and back over the shoulder, never across his face
  };
  const outfit = {...PEOPLE['man-buzz'].outfit, gear: {hat: {kind: 'cap' as const, color: '#6a5a46', band: '#2b2420'}}};
  const fig = {
    lArm: {to: mix(lo.l, hi.l, ch.l, st.raise, st.chop), via: mix(lo.lv, hi.lv, ch.lv, st.raise, st.chop), out: f},
    rArm: {to: mix(lo.r, hi.r, ch.r, st.raise, st.chop), via: mix(lo.rv, hi.rv, ch.rv, st.raise, st.chop), out: f},
  };
  return paintFigureAt(p, c, {...PEOPLE['man-buzz'], outfit}, {...VIEW_CUES_OFF, at, view: 'left', pose: 'P01', face: 'neutral', t: 0, tint: sepiaTint, shadow: WORLD_SHADOW, fig, held: (q, an, uu) => paintAxe(q, an, uu, f)});
};
/** Crowd gasp (B04-SH03, from G1092): a hop of 3 cm, a lean and both hands up (P01 -> P15), 14 f up, 10 f settle (back view, so no kit motion: `gasp-recoil` has no back view). */
export const crowdRecoil = (g: number): number => (g < 1092 ? 0 : Math.sin(Math.PI * Math.min(1, ln(g, 1092, 1106))) * (g < 1106 ? 1 : 1 - sg(g, 1106, 1116)));
/** B04-SH03 crowd marks (SD15): crowd2 woman-curly (0.55, 0, 2.60), crowd4 man-spiky (1.55, 0, 2.20); crowd1/3 unchanged. */
export const SH03_CROWD: Record<number, V3> = {1: [0.55, 0, 2.6], 3: [1.55, 0, 2.2]};
/** SD15 crowd gasp keys: up G1092-1106 (peak on 1106), settled to rest by G1116. */
export const crowdRecoilHero = (g: number): number => sg(g, 1092, 1106) * (g < 1106 ? 1 : 1 - sg(g, 1106, 1116));
export const paintCrowdAt = (p: Painter, c: YCam, g: number, hero = false): (FigAnchors | null)[] => {
  const k = hero ? crowdRecoilHero(g) : crowdRecoil(g);
  return CROWD.map((q, i) => {
    const pos: V3 = hero && SH03_CROWD[i] ? SH03_CROWD[i] : q.at;
    const def = crowdDef(q.id, q.height, q.kind, q.tone, 900 + i), gp = camPoint(c, pos) as Pt, u = camUnit(c, pos);
    const pose = k > 0 ? poseMix('P01', 'P15', k, def, gp, u, 'front') : undefined;
    let fig: unknown = pose ? {rArm: pose.rArm, lArm: pose.lArm, lean: (i % 2 ? 1 : -1) * 0.08 * k, rise: 0.02 * k} : undefined;
    if (hero && (i === 1 || i === 3) && k > 0) { // SD15: crowd2 hands up beside and above the head (visible from behind); crowd4 hands to the collarbone, leaning back
      const hh = q.height / 1.78, hp = (dx: number, h: number): Pt => [gp[0] + dx * u, gp[1] - h * hh * u], r0 = poseMix('P01', 'P01', 0, def, gp, u, 'front');
      const arm = (rest: {to: Pt; via: Pt; out: number}, to: Pt, via: Pt) => ({to: lerpP(rest.to, to, k), via: lerpP(rest.via, via, k), out: rest.out});
      fig = i === 1
        ? {lArm: arm(r0.lArm as never, hp(0.34, 2.05), hp(0.42, 1.55)), rArm: arm(r0.rArm as never, hp(-0.34, 2.05), hp(-0.42, 1.55)), lean: 0.08 * k, rise: 0.02 * k}
        : {lArm: arm(r0.lArm as never, hp(0.13, 1.33), hp(0.3, 1.0)), rArm: arm(r0.rArm as never, hp(-0.13, 1.33), hp(-0.3, 1.0)), lean: 0.08 * k, rise: 0.02 * k};
    }
    return paintFigureAt(p, c, def, {...VIEW_CUES_OFF, at: [pos[0], pos[1] + 0.03 * k, pos[2]], view: 'back', pose: 'P01', t: 0, tint: {...sepiaTint, u: 0.22}, shadow: false, fig: fig as never});
  });
};
/** SH03 fibre flecks off the bite (6, 3-5 px, #efd9a0): burst up-left of the cut point 0.10-0.25 m, shrinking, gone by G1096. */
const FLECKS: [number, number, number][] = [[-0.6, 0.8, 0.25], [-0.9, 0.5, 0.2], [-0.35, 1.0, 0.18], [-1.0, 0.15, 0.13], [-0.7, 0.45, 0.1], [-0.2, 0.9, 0.22]];
const paintFlecks = (p: Painter, c: YCam, sx: number, m: 1 | -1, g: number) => {
  if (g >= 1096) return;
  const K = ropeCutAt(sx, m), t = ln(g, 1091, 1096), ee = 0.4 + 0.6 * (1 - (1 - t) * (1 - t));
  FLECKS.forEach(([a, b, d], i) => {
    const v: V3 = [K[0] + a * d * ee, K[1] + b * d * ee, 0.45], q = camPoint(c, v) as Pt | null; if (!q) return;
    const r = (4.5 - 2 * t - (i % 2) * 0.8) / 2;
    hardFill(p, 34500 + i, HERO.fibre, ell(q[0], q[1], r, r * 0.7, 8, i));
  });
};
/** The 1854 hall at composition frame G for B04-SH02..SH05 (the mirrored staging of SD07: sx -0.7, m -1). Back to front: hall, platform (dropped), showman, rope, assistant, crowd, sepia grade. */
export const paintHallAt = (p: Painter, c: YCam, g: number, sx = -0.7, m: 1 | -1 = -1, hero = false) => {
  paintHallBack(p, c);
  paintHallPlatform(p, c, hallDrop(g));
  const show = paintShowmanAt(p, c, m, g);
  paintHallRope(p, c, sx, m, ropeParted(g), hero ? {dia: 0.05, g} : undefined);
  const asst = hero ? paintAssistantHero(p, c, g) : paintAssistantAt(p, c, sx, m, g);
  if (hero) paintFlecks(p, c, sx, m, g);
  const crowd = paintCrowdAt(p, c, g, hero);
  paintSepiaGrade(p);
  return {show, asst, crowd};
};
