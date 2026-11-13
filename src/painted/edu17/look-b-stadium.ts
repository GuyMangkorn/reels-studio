import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {mixColor} from '../kit/painter';
import type {V3} from '../kit/space';
import {camDepth, camPoint, camPoly, camUnit, type YCam} from '../kit/ycam';
import {clip} from '../kit/world';
import {castOf, lerpV, lookCam, paintHead} from './look-b-street';
import {bowlPt, SD, sh19Cam, standY} from './stadium';

// `SD`, `standY`, `bowlPt` and `sh19Cam` live in `stadium.ts` (N8, group 4); `sh19Cam` follows ROWS-R2.2 (lens 35.7 -> 33.6 m, 1.8 m over the seats; LF05B moves <= 3 px).
export {SD, sh19Cam, standY, bowlPt};

// EDU-EP17 look frames, set B (W3, Film): SET-STADIUM16 day (LF05A, shot 18 @ +25) and night (LF05B, shot 19 @ +24), and the instrument KB (LF06, shot 21 @ +12).
// Generic stadium (no logo, no name, no team colour theme, no performer). Space `T`: metres, origin field centre, +x toward the stage end, +z toward the instrument side.
// Look-defining paint: Boss hardens `stadium.ts` (N8) and the instrument (N9) from these stills (looks-b.md).

const W = (p: Painter, c: YCam, seed: number, color: string, pts: V3[], op = 255) => {
  const q = clip(camPoly(c, pts));
  if (q.length < 3) return;
  if (op >= 255) hardFill(p, seed, color, q); else washAt(p, seed, color, op, q, 0, 0);
};

/** Near seats around the lens: rows 0.8 m apart, seats 0.55 m, people from behind as head-and-shoulder cards (they face the field), far to near. */
const seatRows = (p: Painter, c: YCam, x0: number, x1: number, z0: number, z1: number, night: boolean) => {
  let i = 0;
  for (let z = z0; z <= z1; z += 0.8) for (let x = x0; x <= x1; x += 0.55) {
    const k = x * 13.1 + z * 7.7, h = standY(z - 24.5) + 1.15 + hash(k) * 0.25;
    const shirt = night ? mixColor('#23273a', SD.night.rim, 0.25 * hash(k + 1)) : SD.day.crowd[Math.floor(hash(k + 1) * 5)];
    const hair = night ? '#14161e' : ['#1d1a18', '#3b2f25', '#5a4636', '#9a9a9a'][Math.floor(hash(k + 2) * 4)];
    paintHead(p, c, {x: x + (hash(k + 3) - 0.5) * 0.12, z, h, skin: night ? '#5a4a48' : '#c8956a', hair, shirt, turn: 1}, 60000 + i++, {shoulders: 0.22, body: 3.6});
  }
};

type Quad = {pts: V3[]; depth: number; d0: number; s0: number; ring: number; seg: number};
/** The bowl as stand quads (perimeter segments x depth rings), sorted far to near for this camera. */
const bowlQuads = (c: YCam, segs = 72): Quad[] => {
  const rings = [6, 10, 15, 20, 26, 33, 40, 45, 52, 60, 68, 76, 88];
  const out: Quad[] = [];
  for (let j = 0; j < segs; j++) for (let i = 0; i < rings.length - 1; i++) {
    const s0 = j / segs, s1 = (j + 1) / segs, d0 = rings[i], d1 = rings[i + 1];
    const P = (d: number, s: number): V3 => { const [x, z] = bowlPt(d, s); return [x, standY(d === 40 ? 40 : d), z]; };
    const pts = [P(d0, s0), P(d0, s1), P(d1, s1), P(d1, s0)];
    const mid = pts.reduce((a, q) => [a[0] + q[0] / 4, a[1] + q[1] / 4, a[2] + q[2] / 4] as V3, [0, 0, 0] as V3);
    out.push({pts, depth: camDepth(c, mid), d0, s0, ring: i, seg: j});
  }
  return out.sort((a, b) => b.depth - a.depth);
};

/** Crowd flecks over one stand quad: one person per ~0.55 m of seat, as a 2-tone fleck (head + jacket), packed. */
const flecks = (p: Painter, c: YCam, q: Quad, n0: number, pal: string[], bright: string[], brightShare: number, o: {phones?: number; rim?: (x: number) => number; rimCol?: string; max?: number; maxR?: number} = {}) => {
  const [a, b, , d] = q.pts, area = Math.hypot(b[0] - a[0], b[2] - a[2]) * Math.hypot(d[0] - a[0], d[1] - a[1], d[2] - a[2]);
  const n = Math.min(o.max ?? 700, Math.round(area / 0.45));
  for (let i = 0; i < n; i++) {
    const u = hash(n0 + i * 1.37), v = hash(n0 + i * 2.71 + 0.3);
    const w: V3 = [a[0] + (b[0] - a[0]) * u + (d[0] - a[0]) * v, a[1] + (b[1] - a[1]) * u + (d[1] - a[1]) * v + 1.1, a[2] + (b[2] - a[2]) * u + (d[2] - a[2]) * v];
    const s = camPoint(c, w);
    if (!s || s[0] < -10 || s[0] > 1090 || s[1] < -10 || s[1] > 1930) continue;
    const r = Math.max(0.9, camUnit(c, w) * 0.24);
    if (r > (o.maxR ?? 9)) continue; // near seats are painted by `seatRows` (head cards), not as confetti squares
    const k = hash(n0 + i * 5.3), rim = o.rim ? o.rim(w[0]) : 0;
    let col = k < brightShare ? bright[Math.floor(hash(n0 + i) * bright.length)] : pal[Math.floor(hash(n0 + i * 0.7) * pal.length)];
    if (rim > 0 && o.rimCol) col = mixColor(col, o.rimCol, rim * hash(n0 + i * 3.3));
    hardFill(p, n0 + i, col, r < 2.2 ? ell(s[0], s[1], r * 1.1, r * 1.3, 5) : [[s[0] - r * 1.15, s[1] - r * 0.4], [s[0] + r * 1.15, s[1] - r * 0.4], [s[0] + r * 1.25, s[1] + r * 2.2], [s[0] - r * 1.25, s[1] + r * 2.2]]);
    if (r >= 2.2) hardFill(p, n0 + i + 0.5, mixColor('#3b2a20', col, 0.2), ell(s[0], s[1] - r * 0.85, r * 0.55, r * 0.6, 6));
    if (o.phones && hash(n0 + i * 9.1) < o.phones) hardFill(p, n0 + i + 0.7, SD.night.phone, ell(s[0] + r * 0.4, s[1] - r * 1.8, Math.max(0.9, r * 0.28), Math.max(1.1, r * 0.4), 5));
  }
};

/** LF05A: shot 18 @ +25, overcast afternoon, game look. Camera (sheet R2.1) truck pos (-10, 40, 92) -> (4, 40, 92), look-at (0,0,0) -> (4,0,0). `opt` B lowers the pitch 4 deg (more far stands and roof, less near deck). */
export const sh18Cam = (f: number, opt: 'A' | 'B' = 'A'): YCam => {
  const u = Math.min(1, Math.max(0, f / 52)), e = u < 0.11 ? (u / 0.11) ** 2 * 0.055 : u > 0.89 ? 1 - ((1 - u) / 0.11) ** 2 * 0.055 : u;
  const cam = lookCam(lerpV([-10, 40, 92], [4, 40, 92], e), lerpV([0, 0, 0], [4, 0, 0], e));
  return opt === 'B' ? lookCam(lerpV([-10, 33, 92], [4, 33, 92], e), lerpV([0, 0, 0], [4, 0, 0], e)) : cam;
};
export const paintLf05A = (p: Painter, f: number, opt: 'A' | 'B') => {
  const c = sh18Cam(f, opt), P = SD.day, t = f / 30;
  hardFill(p, 1, P.sky, [[-40, -40], [1120, -40], [1120, 1960], [-40, 1960]]);
  washAt(p, 2, P.skyLo, 200, [[-40, 300], [1120, 300], [1120, 900], [-40, 900]], 0, 0);
  // outer wall and the far roof canopy (z -), with its steel edge and a damp sheen
  W(p, c, 3, P.wall, [[-140, 0, -115], [140, 0, -115], [140, 52, -115], [-140, 52, -115]]);
  W(p, c, 4, P.roof, [[-120, 50, -84.5], [120, 50, -84.5], [120, 58, -129.5], [-120, 58, -129.5]]);
  W(p, c, 5, mixColor(P.roof, '#d8dcdf', 0.4), [[-120, 49.2, -84.5], [120, 49.2, -84.5], [120, 50.4, -84.5], [-120, 50.4, -84.5]]);
  // the blank video board at the -x end (dark, no text)
  W(p, c, 6, '#1d2126', [[-100, 22, -14], [-100, 22, 14], [-100, 34, 14], [-100, 34, -14]]);
  // field: turf, stripes every 4.6 m, sideline
  W(p, c, 10, P.turf, [[-62, 0, -31], [62, 0, -31], [62, 0, 31], [-62, 0, 31]]);
  for (let i = 0; i < 24; i++) if (i % 2) W(p, c, 11 + i, P.stripe, [[-55 + i * 4.6, 0.01, -24.5], [-55 + (i + 1) * 4.6, 0.01, -24.5], [-55 + (i + 1) * 4.6, 0.01, 24.5], [-55 + i * 4.6, 0.01, 24.5]]);
  const sl = ([[-55, -24.5], [55, -24.5], [55, 24.5], [-55, 24.5]] as [number, number][]).map(([x, z]) => camPoint(c, [x, 0.02, z])).filter(Boolean) as Pt[];
  inkLine(p, 40, sl, {color: P.line, weight: 0.8, still: true});
  // two plain teams lined up (white and dark grey), 1-2 px figures
  for (let i = 0; i < 11; i++) for (const [x, col] of [[-3, '#f4f4f0'], [3, '#3a3e44']] as [number, string][]) {
    const s = camPoint(c, [x, 1, -15 + i * 3]); if (s) hardFill(p, 50 + i * 2 + (x > 0 ? 1 : 0), col, ell(s[0], s[1], 1.4, 2.6, 6));
  }
  // stands: concrete quads with the packed crowd, far to near
  bowlQuads(c).forEach((q, k) => {
    const sh = q.ring === 6 ? P.concSh : mixColor(P.conc, P.concSh, (q.ring % 2) * 0.3);
    W(p, c, 1000 + k, sh, q.pts);
    if (q.ring !== 6) flecks(p, c, q, 20000 + k * 300, P.crowd, P.bright, 0.15);
  });
  // near roof canopy underside (we stand under it at z 92)
  W(p, c, 7, '#4a4f55', [[-140, 50, 84.5], [140, 50, 84.5], [140, 52, 120], [-140, 52, 120]]);
  if (opt === 'B') seatRows(p, c, c.x - 9, c.x + 9, 72, 91, false);
  // foreground fans from behind, rain jackets, arms up (kit back-view cards on the deck in front of the lens)
  const fz = (z: number) => standY(z - 24.5), zb = opt === 'B' ? 3.2 : 0;
  const fans: [V3, keyof typeof import('../kit/people').PEOPLE][] = [[[c.x - 1.6, fz(85.5 + zb), 85.5 + zb], 'man-crop'], [[c.x + 1.3, fz(86 + zb), 86 + zb], 'woman-ponytail'], [[c.x - 0.1, fz(84.8 + zb), 84.8 + zb], 'man-buzz'], [[c.x + 2.9, fz(85), 85], 'man-parted'], [[c.x - 3.0, fz(84.6 + zb), 84.6 + zb], 'woman-bob'], [[c.x + 0.6, fz(87.4 + zb), 87.4 + zb], 'man-shaved'], [[c.x - 2.2, fz(87.6 + zb), 87.6 + zb], 'woman-curly']];
  fans.sort((a, b) => a[0][2] - b[0][2]).forEach(([at, id], i) => {
    const jacket = ['#2d3440', '#4a5a6a', '#3a3f4a', '#6b7480', '#c94f3d', '#2d3440', '#55606c'][i];
    paintFigureAt(p, c, castOf(id, 'hoodie'), {at, view: 'back', pose: i % 3 === 1 ? 'P01' : 'P08', t, seed: 1500 + i * 11, tint: {to: jacket, u: 0.55}, fig: {hoodUp: i === 2 || i === 5}});
  });
  return c;
};

/** LF05B: shot 19 @ +24, concert night. Camera (sheet R2.1) pos (-30, 32, 96) -> (-28, 31, 93), look-at (58, 8, 0). `opt` B adds a thin haze veil over the floor and warmer stands rim. */
export const paintLf05B = (p: Painter, f: number, opt: 'A' | 'B') => {
  const c = sh19Cam(f), N = SD.night;
  hardFill(p, 1, N.sky, [[-40, -40], [1120, -40], [1120, 1960], [-40, 1960]]);
  W(p, c, 3, '#1a2030', [[-140, 0, -115], [140, 0, -115], [140, 52, -115], [-140, 52, -115]]);
  W(p, c, 4, N.roof, [[-120, 50, -84.5], [120, 50, -84.5], [120, 58, -129.5], [-120, 58, -129.5]]);
  W(p, c, 10, N.turf, [[-62, 0, -31], [62, 0, -31], [62, 0, 31], [-62, 0, 31]]);
  const rim = (x: number) => Math.max(0, Math.min(1, (x + 40) / 100)) * (opt === 'B' ? 0.8 : 0.6);
  bowlQuads(c).forEach((q, k) => {
    W(p, c, 1000 + k, q.ring === 6 ? N.concSh : N.conc, q.pts);
    if (q.ring !== 6) flecks(p, c, q, 20000 + k * 300, N.crowd, ['#7a6a78', '#8a7060'], 0.2, {phones: 0.1, rim, rimCol: N.rim, max: 700, maxR: 7});
  });
  // the floor crowd on the field, packed, phone lights (stage end lit warm)
  for (let i = 0; i < 140; i++) for (let j = 0; j < 40; j++) {
    const x = -50 + i * 0.7 + (hash(i * 7 + j) - 0.5), z = -22 + j * 1.15 + (hash(i * 1.3 + j * 3) - 0.5) * 0.5;
    if (x > 46) continue;
    const s = camPoint(c, [x, 1.5, z]); if (!s) continue;
    const r = Math.max(0.9, camUnit(c, [x, 1.5, z]) * 0.25), warm = Math.max(0, (x + 20) / 66);
    hardFill(p, 40000 + i * 40 + j, mixColor('#3a3f52', '#e0a070', warm * warm * 0.85 * (0.5 + 0.5 * hash(i * j + 0.2))), ell(s[0], s[1], r * 1.2, r * 1.5, 6));
    if (hash(i * 31 + j * 7) < 0.1) hardFill(p, 41000 + i * 40 + j, N.phone, ell(s[0] + r * 0.3, s[1] - r * 1.6, Math.max(0.9, r * 0.35), Math.max(1.2, r * 0.5), 5));
  }
  // the stage at the +x end: deck, back wall glow, truss to y 22 (no performer)
  W(p, c, 60, '#3a3440', [[48, 0, -20], [70, 0, -20], [70, 2.5, -20], [48, 2.5, -20]]);
  W(p, c, 61, N.stage, [[48, 2.5, -20], [70, 2.5, -20], [70, 2.5, 20], [48, 2.5, 20]]);
  W(p, c, 62, mixColor(N.stage, '#ffb070', 0.3), [[62, 2.5, -18], [62, 2.5, 18], [62, 18, 18], [62, 18, -18]]);
  W(p, c, 63, '#2a2630', [[48, 2.5, 20], [70, 2.5, 20], [70, 0, 20], [48, 0, 20]]);
  for (const z of [-20, 20]) W(p, c, 64 + z, '#5a5866', [[50, 2.5, z - 0.4], [50, 2.5, z + 0.4], [50, 22, z + 0.4], [50, 22, z - 0.4]]);
  W(p, c, 66, '#5a5866', [[50, 21.5, -20.4], [50, 21.5, 20.4], [50, 22.5, 20.4], [50, 22.5, -20.4]]);
  // beams from the truss into haze (translucent wedges)
  for (let i = 0; i < 8; i++) {
    const z0 = -18 + i * 5.1, col = i % 2 ? N.beamA : N.beamB, sw = (hash(i) - 0.5) * 50;
    const a = camPoint(c, [50, 21.8, z0]), b1 = camPoint(c, [-10 + sw, 60, z0 - 12]), b2 = camPoint(c, [-4 + sw, 60, z0 + 6]);
    if (a && b1 && b2) washAt(p, 70 + i, col, 64, [a, b1, b2], 0, 0);
  }
  // haze lit by the stage: a soft warm column over the stage end and a lavender veil over the bowl (no disc)
  const sg = camPoint(c, [58, 10, 0]) as Pt;
  for (let i = 0; i < 4; i++) washAt(p, 90 + i, N.stage, 34, [[sg[0] - 90 - 70 * i, sg[1] + 120], [sg[0] + 90 + 70 * i, sg[1] + 120], [sg[0] + 60 + 40 * i, sg[1] - 380 - 120 * i], [sg[0] - 60 - 40 * i, sg[1] - 380 - 120 * i]], 0, 0);
  washAt(p, 96, '#4a3f66', 36, [[-40, 300], [1120, 300], [1120, 1100], [-40, 1100]], 0, 0);
  seatRows(p, c, c.x - 2, c.x + 22, 74, 93, true);
  // (no foreground fans at night: from this lens their heads overlap the stage and read as performers; the near seats are dark head cards)
  if (opt === 'B') washAt(p, 91, '#6a5a7a', 50, [[-40, 600], [1120, 600], [1120, 1100], [-40, 1100]], 0, 0);
  return c;
};

/** LF06: shot 21 @ +12, close on the pen. A = sheet camera (looking +z, away from the stadium; the lamp from screen right, the stadium glow as a rim from behind the lens);
 * B = reverse angle (looking -z across the box toward the stadium wall glowing behind it, same distance and height). Instrument KB at (0, 0, 146): box 0.6 x 0.9 x 0.5 m, drum 0.25 m x 0.35 m (axis x). */
export const sh21Cam = (f: number, opt: 'A' | 'B'): YCam => opt === 'A' ? lookCam([0.30, 1.10, 145.55], [0, 0.80, 146.0]) : lookCam([-0.30, 1.10, 146.45], [0, 0.80, 146.0]);
export const paintLf06 = (p: Painter, f: number, opt: 'A' | 'B') => {
  const c = sh21Cam(f, opt), N = SD.night, t = f / 30;
  const box: Pt[] = [[-40, -40], [1120, -40], [1120, 1960], [-40, 1960]];
  if (opt === 'B') {
    // looking -z: the street, the glowing stadium wall across it, the bowl's light over its rim
    hardFill(p, 1, '#1a2236', box);
    washAt(p, 2, '#3a2f4a', 255, [[-40, -40], [1120, -40], [1120, 700], [-40, 700]], 0, 0);
    W(p, c, 3, '#3b3f52', [[-200, 0, 115], [200, 0, 115], [200, 40, 115], [-200, 40, 115]]);
    // the wall: a lit concourse band at street level and rows of narrow glowing vents, light spilling over the rim
    W(p, c, 4, '#6a5a52', [[-200, 2, 114.9], [200, 2, 114.9], [200, 5, 114.9], [-200, 5, 114.9]]);
    W(p, c, 5, '#f2c46a', [[-200, 2.6, 114.8], [200, 2.6, 114.8], [200, 4.4, 114.8], [-200, 4.4, 114.8]], 150);
    for (let i = 0; i < 90; i++) for (const y of [12, 22, 32]) { if (hash(i * 3.7 + y) < 0.45) continue; const x = -90 + i * 2 + (hash(i + y) - 0.5) * 0.8; W(p, c, 6 + i * 3 + y, (i + y) % 5 ? '#e9c79a' : '#9ad8e6', [[x, y, 114.9], [x + 0.5, y, 114.9], [x + 0.5, y + 4, 114.9], [x, y + 4, 114.9]], 170); }
    for (let i = 0; i < 6; i++) { const b0 = camPoint(c, [-30 + i * 12, 44, 100]), b1 = camPoint(c, [-60 + i * 30, 140, 60]), b2 = camPoint(c, [-48 + i * 30, 140, 60]); if (b0 && b1 && b2) washAt(p, 60 + i, i % 2 ? SD.night.beamA : SD.night.beamB, 50, [b0, b1, b2], 0, 0); }
    const g = camPoint(c, [0, 45, 115]); if (g) { washAt(p, 50, '#ffb4e0', 70, ell(g[0], g[1], 900, 260, 30), 0, 0); washAt(p, 51, N.stage, 80, ell(g[0], g[1] + 40, 600, 160, 30), 0, 0); }
    W(p, c, 52, '#2c2c30', [[-200, 0, 125], [200, 0, 125], [200, 0, 140], [-200, 0, 140]]);
    W(p, c, 53, '#4a4a50', [[-200, 0, 140], [200, 0, 140], [200, 0, 150], [-200, 0, 150]]);
  } else {
    // looking +z: dark pavement, a low wall and far flats with a few lit windows
    hardFill(p, 1, '#121826', box);
    W(p, c, 2, '#3e3f46', [[-20, 0, 140], [20, 0, 140], [20, 0, 152], [-20, 0, 152]]);
    W(p, c, 3, '#23262f', [[-20, 0, 152], [20, 0, 152], [20, 1.2, 152], [-20, 1.2, 152]]);
    W(p, c, 4, '#1b2030', [[-40, 1.2, 175], [40, 1.2, 175], [40, 30, 175], [-40, 30, 175]]);
    for (let i = 0; i < 30; i++) if (hash(i * 3.3) < 0.35) { const x = -20 + (i % 10) * 4, y = 4 + Math.floor(i / 10) * 4; W(p, c, 10 + i, '#d9b070', [[x, y, 174.9], [x + 1.4, y, 174.9], [x + 1.4, y + 1.6, 174.9], [x, y + 1.6, 174.9]]); }
    washAt(p, 50, N.lamp, 60, [[700, -40], [1120, -40], [1120, 1960], [760, 1960]], 0, 0);
  }
  // the steel cabinet (top at y 0.9) and its glass lid
  const B = {x0: -0.3, x1: 0.3, y0: 0, y1: 0.9, z0: 145.75, z1: 146.25};
  const steel = '#7d868c', steelSh = '#4f565c';
  W(p, c, 100, steelSh, [[B.x0, B.y0, opt === 'A' ? B.z0 : B.z1], [B.x1, B.y0, opt === 'A' ? B.z0 : B.z1], [B.x1, B.y1, opt === 'A' ? B.z0 : B.z1], [B.x0, B.y1, opt === 'A' ? B.z0 : B.z1]]);
  W(p, c, 101, steel, [[opt === 'A' ? B.x1 : B.x0, B.y0, B.z0], [opt === 'A' ? B.x1 : B.x0, B.y0, B.z1], [opt === 'A' ? B.x1 : B.x0, B.y1, B.z1], [opt === 'A' ? B.x1 : B.x0, B.y1, B.z0]]);
  // inside the box: dark well, the paper drum (axis x) with grid and trace, the brass pen arm
  W(p, c, 102, '#23272c', [[B.x0 + 0.03, 0.9, B.z0 + 0.03], [B.x1 - 0.03, 0.9, B.z0 + 0.03], [B.x1 - 0.03, 0.9, B.z1 - 0.03], [B.x0 + 0.03, 0.9, B.z1 - 0.03]]);
  const dc: V3 = [0, 0.735, 146.0], R = 0.125, L = 0.175;
  const surf = (x: number, a: number): V3 => [x, dc[1] + R * Math.cos(a), dc[2] + R * Math.sin(a)];
  const vis = (a: number) => { const n: V3 = [0, Math.cos(a), Math.sin(a)], toC: V3 = [c.x - 0, c.y - (dc[1] + R * n[1]), c.z - (dc[2] + R * n[2])]; return n[1] * toC[1] + n[2] * toC[2] > 0; };
  const A0 = -1.25, A1 = 1.25, NA = 28;
  for (let i = 0; i < NA; i++) {
    const a0 = A0 + ((A1 - A0) * i) / NA, a1 = A0 + ((A1 - A0) * (i + 1)) / NA;
    if (!vis((a0 + a1) / 2)) continue;
    const shade = 0.25 * Math.abs(Math.sin((a0 + a1) / 2));
    W(p, c, 110 + i, mixColor('#f2ead8', '#8a7f6a', shade), [surf(-L, a0), surf(L, a0), surf(L, a1), surf(-L, a1)]);
  }
  // faint grid (no numbers) and the trace lines (one per turn; the pen moves along x)
  for (let k = 0; k < 10; k++) { const x = -L + 0.02 + k * 0.034; const pts = Array.from({length: 24}, (_, i) => camPoint(c, surf(x, A0 + ((A1 - A0) * i) / 23))).filter(Boolean) as Pt[]; inkLine(p, 200 + k, pts, {color: '#d8cdb6', weight: 0.4, closed: false, still: true}); }
  const penX = 0.02, penA = opt === 'A' ? -0.28 : 0.28;
  for (let k = 0; k < 18; k++) {
    const x0 = penX - k * 0.011, pts: Pt[] = [];
    for (let i = 0; i <= 90; i++) {
      const a = A0 + ((A1 - A0) * i) / 90; if (!vis(a)) continue;
      if (k === 0 && (opt === 'A' ? a < penA : a > penA)) continue;
      const burst = k === 0 ? Math.max(0, Math.sin(i * 0.37 + f * 0.2)) ** 3 : k < 4 ? 0.35 * Math.max(0, Math.sin(i * 0.21 + k * 2)) ** 2 : 0.06;
      const jit = (hash(i * 7.3 + k * 91 + (k === 0 ? Math.floor(f / 2) : 0)) - 0.5) * (0.0012 + 0.012 * burst);
      const q = camPoint(c, surf(x0 + jit, a)); if (q) pts.push(q);
    }
    inkLine(p, 300 + k, pts, {color: k === 0 ? '#2b211c' : '#5a4a3a', weight: k === 0 ? 1.2 : 0.55, curve: 0, closed: false, still: k > 0});
  }
  // drum end caps
  { const x = c.x > 0 ? L : -L; const pts = Array.from({length: 21}, (_, i) => camPoint(c, surf(x, A0 + ((A1 - A0) * i) / 20))).filter(Boolean) as Pt[]; const hub = camPoint(c, [x, dc[1], dc[2]]) as Pt; hardFill(p, 400, '#9a8a60', [...pts, hub]); hardFill(p, 401, '#6a5a3a', ell(hub[0], hub[1], 10, 10, 10)); }
  // the brass pen arm from a pivot at the back of the box to the pen tip on the drum
  const tip = surf(penX, penA), piv: V3 = [penX + 0.13, 0.875, opt === 'A' ? 146.16 : 145.84];
  const pt = camPoint(c, tip) as Pt, pp = camPoint(c, piv) as Pt;
  if (pt && pp) {
    const w = camUnit(c, tip) * 0.006, dx = pp[0] - pt[0], dy = pp[1] - pt[1], l = Math.hypot(dx, dy), nx = (-dy / l) * w, ny = (dx / l) * w;
    hardFill(p, 450, '#8a6a2a', [[pt[0] + nx, pt[1] + ny - w], [pp[0] + nx * 1.6, pp[1] + ny * 1.6], [pp[0] - nx * 1.6, pp[1] - ny * 1.6], [pt[0] - nx, pt[1] - ny - w]]);
    hardFill(p, 451, '#c9a24a', [[pt[0] + nx * 0.5, pt[1] + ny * 0.5 - w], [pp[0] + nx, pp[1] + ny], [pp[0], pp[1]], [pt[0], pt[1] - w]]);
    hardFill(p, 452, '#2b211c', ell(pt[0], pt[1], w * 0.9, w * 0.9, 8));
    hardFill(p, 453, '#c9a24a', ell(pp[0], pp[1], w * 2.6, w * 2.6, 12));
  }
  // the glass lid (dark blue sheen) and its frame; lamp and stadium highlights on it
  const lid: V3[] = [[B.x0, 0.905, B.z0], [B.x1, 0.905, B.z0], [B.x1, 0.905, B.z1], [B.x0, 0.905, B.z1]];
  W(p, c, 500, '#2b3550', lid, 60);
  const fr = lid.map((v) => camPoint(c, v)).filter(Boolean) as Pt[];
  inkLine(p, 501, fr, {color: '#a7b0b6', weight: 1.6, still: true});
  const s0 = camPoint(c, [B.x0 + 0.05, 0.906, B.z0 + 0.1]), s1 = camPoint(c, [B.x1 - 0.15, 0.906, B.z1 - 0.05]);
  if (s0 && s1) washAt(p, 502, opt === 'A' ? '#ffb4e0' : N.lamp, 45, [[s0[0], s0[1]], [s0[0] + 70, s0[1] - 10], [s1[0] + 70, s1[1] - 10], [s1[0], s1[1]]], 0, 0);
  void t;
  if (typeof console !== 'undefined') console.log('lf06-pen ' + JSON.stringify(pt));
  return {c, pen: pt};
};
