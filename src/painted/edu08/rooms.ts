import {ell, hardFill, inkLine} from '../kit/draw';
import {paintHalo} from '../kit/fog';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camDepth, camPoint, camPoly, type YCam} from '../kit/ycam';

// EDU-EP08-SHORT interiors (brief EDU-EP08-BRIEF-R1.1 set plans, N3/N4). LOOK-FRAME CODE.
// SET-AIRLOCK: origin on the cylinder axis at its middle, axis z, Ø 2.0 m x 2.4 m, outer hatch at z +1.20, inner hatch at z -1.20, the
// "floor" panel at y -1.00 (orientation only). SET-CHAMBER66: origin on the grated floor at the chamber centre, a vertical steel cylinder
// Ø 4.5 m, door + porthole and the gauge on the far wall (z about -2.2), two cage lamps; painted in full colour and graded sepia by the caller.

const fillW = (p: Painter, c: YCam, seed: number, color: string, pts: V3[]) => { const q = camPoly(c, pts); if (q.length >= 3) hardFill(p, seed, color, q); return q; };
const inkW = (p: Painter, c: YCam, id: number, pts: V3[], o: {closed?: boolean; weight?: number; color?: string} = {}) => {
  const q = pts.filter((v) => camDepth(c, v) > 0.32).map((v) => camPoint(c, v)).filter((v): v is Pt => !!v);
  if (q.length >= 2) inkLine(p, id, q, {closed: o.closed ?? false, weight: o.weight ?? 1, color: o.color, still: true, curve: 0.1});
};
const circleZ = (cx: number, cy: number, z: number, r: number, n = 28): V3[] => Array.from({length: n}, (_, i) => [cx + r * Math.cos((i / n) * Math.PI * 2), cy + r * Math.sin((i / n) * Math.PI * 2), z]);

export const AL = {panel: '#dfe6ee', shadow: '#8a97a8', fabric: '#9aa9bb', light: '#d8e4f0', amber: '#ffb347', gaugeFace: '#f4efe2', needle: '#c8342b', rail: '#e0b23a'};

export type AirlockOpts = {
  lamp?: number; needle?: number;
  /** Outer hatch (z +1.20) door angle in degrees: 0 or omitted = shut (the look-frame drawing), 100 = wide open (door nearly edge-on). */
  hatchOpen?: number;
  /** Paints what shows through the open hatch (the Earth) before the cap; called only while `hatchOpen` > 0. */
  behind?: (p: Painter) => void;
};

/** SET-AIRLOCK anchors (metres, brief unit table): the hatch centre and hinge, the gauge, the lamp, the handrails (x +-0.75, y 0.30). */
export const AIRLOCK = {
  radius: 1.0, z0: -1.2, z1: 1.2, hatchCentre: [0, 0, 1.2] as V3, hatchOpening: 0.5, doorRadius: 0.525, hingeX: -0.525,
  gauge: [0.86, 0.3, 0.3] as V3, lamp: [0.86, 0.5, 0.3] as V3, rails: [-0.75, 0.75] as const, railY: 0.3,
};
/** Door hatch angle at shot-local seconds for the B05-SH02 swing: 100 deg until 0.5 s, shut by 1.3 s (24 f), ease in-out. */
export const hatchAngle = (t: number, from = 100, t0 = 0.5, t1 = 1.3): number => { const u = Math.max(0, Math.min(1, (t - t0) / (t1 - t0))); return from * (1 - u * u * (3 - 2 * u)); };

/** SET-AIRLOCK from inside: the outer-hatch end cap, the cylinder panels far to near, light strips, handrails, bags, gauge and lamp. */
export const paintAirlock = (p: Painter, c: YCam, o: AirlockOpts = {}) => {
  const R = 1.0, z0 = -1.2, z1 = 1.2, N = 16, id = 9500, open = (o.hatchOpen ?? 0) > 0.5;
  if (open) o.behind?.(p);
  // end caps (only the one in front of the lens shows)
  const capCol = (z: number) => (Math.sign(z - c.z) > 0 ? mixColor(AL.panel, AL.shadow, 0.35) : AL.panel);
  for (const z of [z1, z0]) {
    if (camDepth(c, [0, 0, z]) <= 0.3) continue;
    if (open && z === z1) {
      // open outer hatch: the cap is an annulus (slit join) around the opening, a raised rim, and the door leaf hinged on the -x edge
      const out = circleZ(0, 0, z, R, N), hole = circleZ(0, 0, z, 0.5, 24);
      fillW(p, c, id + 1, capCol(z), [...out, out[0], hole[0], ...[...hole].reverse()]);
      const rimO = circleZ(0, 0, z - 0.01, 0.6, 28), rimI = circleZ(0, 0, z - 0.01, 0.5, 28);
      fillW(p, c, id + 3, mixColor(AL.panel, '#ffffff', 0.2), [...rimO, rimO[0], rimI[0], ...[...rimI].reverse()]);
      inkW(p, c, id + 5, hole, {closed: true, weight: 1.1});
      const phi = ((o.hatchOpen ?? 0) * Math.PI) / 180, rr = AIRLOCK.doorRadius, hx = AIRLOCK.hingeX;
      const leaf = (s: number, v: number, lift = 0): V3 => [hx + s * Math.cos(phi) + lift * Math.sin(phi), v, z - 0.03 + s * Math.sin(phi) - lift * Math.cos(phi)];
      const disc = Array.from({length: 28}, (_, i): V3 => { const a = (i / 28) * Math.PI * 2; return leaf(rr + rr * Math.cos(a), rr * Math.sin(a)); });
      fillW(p, c, id + 13, mixColor(AL.panel, AL.shadow, 0.12 + 0.3 * Math.sin(phi)), disc);
      inkW(p, c, id + 14, disc, {closed: true, weight: 1.1});
      fillW(p, c, id + 16, '#7c8796', [leaf(rr - 0.22, -0.03, 0.05), leaf(rr + 0.22, -0.03, 0.05), leaf(rr + 0.22, 0.03, 0.05), leaf(rr - 0.22, 0.03, 0.05)]);
      continue;
    }
    fillW(p, c, id + (z > 0 ? 1 : 2), capCol(z), circleZ(0, 0, z, R, N));
    // hatch: a round door Ø 1.05 with a raised rim, a handle bar and four dogs
    fillW(p, c, id + 3 + (z > 0 ? 0 : 10), mixColor(AL.panel, '#ffffff', 0.2), circleZ(0, 0.0, z - Math.sign(z) * 0.02, 0.6));
    fillW(p, c, id + 4 + (z > 0 ? 0 : 10), mixColor(AL.panel, AL.shadow, 0.15), circleZ(0, 0.0, z - Math.sign(z) * 0.03, 0.52));
    inkW(p, c, id + 5 + (z > 0 ? 0 : 10), circleZ(0, 0, z - Math.sign(z) * 0.03, 0.52), {closed: true, weight: 1.1});
    fillW(p, c, id + 6 + (z > 0 ? 0 : 10), '#7c8796', [[-0.22, -0.03, z - Math.sign(z) * 0.06], [0.22, -0.03, z - Math.sign(z) * 0.06], [0.22, 0.03, z - Math.sign(z) * 0.06], [-0.22, 0.03, z - Math.sign(z) * 0.06]]);
    for (let k = 0; k < 4; k++) { const a = (k / 4) * Math.PI * 2 + Math.PI / 4; fillW(p, c, id + 20 + k + (z > 0 ? 0 : 10), '#6c7787', circleZ(0.47 * Math.cos(a), 0.47 * Math.sin(a), z - Math.sign(z) * 0.04, 0.04, 10)); }
  }
  // panels: inner faces of the cylinder, far first
  const facets = Array.from({length: N}, (_, i) => {
    const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2, am = (a0 + a1) / 2;
    return {i, am, a0, a1, d: Math.hypot(Math.cos(am) * R - c.x, Math.sin(am) * R - c.y)};
  }).sort((a, b) => b.d - a.d);
  for (const f of facets) {
    const P = (a: number, r: number, z: number): V3 => [Math.cos(a) * r, Math.sin(a) * r, z];
    const up = Math.sin(f.am); // +1 ceiling, -1 floor
    const base = mixColor(AL.panel, AL.shadow, 0.16 + 0.18 * Math.max(0, -up) + 0.04 * (f.i % 2));
    for (let s = 0; s < 3; s++) {
      const za = z0 + (s * (z1 - z0)) / 3, zb = z0 + ((s + 1) * (z1 - z0)) / 3;
      const near = camDepth(c, P((f.a0 + f.a1) / 2, R, (za + zb) / 2)) < 0.9;
      const col = near ? mixColor(AL.panel, AL.shadow, 0.3) : (f.i + s) % 5 === 2 && up < 0.5 ? AL.fabric : base;
      const q = fillW(p, c, id + 100 + f.i * 3 + s, col, [P(f.a0, R, za), P(f.a1, R, za), P(f.a1, R, zb), P(f.a0, R, zb)]);
      const mid: V3 = P((f.a0 + f.a1) / 2, R, (za + zb) / 2);
      if (q.length >= 3 && camDepth(c, mid) > 0.9) inkLine(p, id + 200 + f.i * 3 + s, q, {closed: true, weight: 0.6, color: mixColor(AL.shadow, '#2b211c', 0.2), still: true, curve: 0});
    }
    // light strips on the two upper facets
    if (up > 0.85) fillW(p, c, id + 300 + f.i, AL.light, [P(f.a0 + 0.05, R * 0.98, z0 + 0.1), P(f.a1 - 0.05, R * 0.98, z0 + 0.1), P(f.a1 - 0.05, R * 0.98, z1 - 0.1), P(f.a0 + 0.05, R * 0.98, z1 - 0.1)]);
  }
  // handrails at x +-0.75, y 0.30 along z, gold
  for (const x of [-0.75, 0.75]) {
    fillW(p, c, id + 400 + x * 10, AL.rail, [[x, 0.28, z0 + 0.25], [x, 0.28, z1 - 0.25], [x, 0.32, z1 - 0.25], [x, 0.32, z0 + 0.25]]);
  }
  // fabric bags strapped at (-0.85, -0.40, -0.20)
  fillW(p, c, id + 410, AL.fabric, [[-0.9, -0.62, -0.55], [-0.78, -0.62, 0.15], [-0.7, -0.15, 0.15], [-0.82, -0.15, -0.55]]);
  // gauge on the +x wall and the amber lamp above it
  const gc: V3 = [0.86, 0.3, 0.3], lc: V3 = [0.86, 0.5, 0.3];
  const gq = camPoint(c, gc);
  if (gq && camDepth(c, gc) > 0.35) {
    const disc: V3[] = Array.from({length: 24}, (_, i) => [0.86, 0.3 + 0.08 * Math.sin((i / 24) * Math.PI * 2), 0.3 + 0.08 * Math.cos((i / 24) * Math.PI * 2)]);
    fillW(p, c, id + 420, '#5a6372', disc.map(([x, y, z]): V3 => [x + 0.005, 0.3 + (y - 0.3) * 1.18, 0.3 + (z - 0.3) * 1.18]));
    fillW(p, c, id + 421, AL.gaugeFace, disc);
    for (let k = 0; k <= 8; k++) { const a = Math.PI * (1.25 - (1.5 * k) / 8); inkW(p, c, id + 430 + k, [[0.855, 0.3 + 0.065 * Math.sin(a), 0.3 + 0.065 * Math.cos(a)], [0.855, 0.3 + 0.078 * Math.sin(a), 0.3 + 0.078 * Math.cos(a)]], {weight: 0.8}); }
    const na = Math.PI * (1.25 - 1.5 * (o.needle ?? 0));
    inkW(p, c, id + 440, [[0.85, 0.3, 0.3], [0.85, 0.3 + 0.065 * Math.sin(na), 0.3 + 0.065 * Math.cos(na)]], {weight: 2, color: AL.needle});
    const lq = camPoint(c, lc), lamp = o.lamp ?? 0;
    const lens: V3[] = Array.from({length: 16}, (_, i) => [0.86, 0.5 + 0.035 * Math.sin((i / 16) * Math.PI * 2), 0.3 + 0.035 * Math.cos((i / 16) * Math.PI * 2)]);
    fillW(p, c, id + 450, mixColor('#7a5a2a', AL.amber, lamp), lens);
    if (lq && lamp > 0) paintHalo(p, {x: lq[0], y: lq[1], r: 220 * lamp, color: AL.amber, level: 0.3 * lamp, seed: id + 460});
  }
};

export const CH = {steel: '#8e9196', steelDark: '#4d5156', floor: '#5d6064', grate: '#3a3d41', lamp: '#ffe2a8', glass: '#2b3a44', control: '#d8c48a'};

/** SET-CHAMBER66 anchors (metres): the wall hose fitting, the door and porthole, the gauge beside the door, the cage lamps. The gauge sits at x 0.62 as in
 * the approved look frame (LF03); brief R1.3 / storyboard ROWS-R1.3 target the same point (was written +0.75). */
export const CHAMBER = {radius: 2.25, height: 3.2, hose: [-1.1, 0.9, -1.7] as V3, gauge: [0.62, 1.45, -2.15] as V3, porthole: [1.3, 1.45, -2.17] as V3, lamps: [[-1.2, 2.6, -1.0], [1.2, 2.6, -1.0]] as V3[]};
/** The flashback grade: the chamber painted in full colour through a sepia tint painter (`tintPainter`, brush mix). `u` 0..1 = how sepia (0.62 in LF03; drains to ~0 on L09). */
export const SEPIA = {color: '#c9a46b', u: 0.62, paper: '#2a2116'};
export const paintChamberSepia = (p0: Painter, c: YCam, o: {lights?: number; needle?: number; u?: number} = {}): Painter => {
  const p = tintPainter(p0, SEPIA.color, o.u ?? SEPIA.u, {brush: true});
  paintChamber(p, c, o);
  return p;
};

/** SET-CHAMBER66 in full colour (the caller grades it sepia): wall facets, ceiling, grated floor, door with porthole, gauge, cage lamps, the wall hose fitting. `lights` 0..1. */
export const paintChamber = (p: Painter, c: YCam, o: {lights?: number; needle?: number} = {}) => {
  const R = 2.25, H = 3.2, N = 18, id = 9700, L = o.lights ?? 1;
  const dim = (col: string) => mixColor('#151310', col, 0.35 + 0.65 * L);
  // ceiling and floor discs
  fillW(p, c, id, dim('#3e4044'), Array.from({length: N}, (_, i): V3 => [R * Math.cos((i / N) * Math.PI * 2), H, R * Math.sin((i / N) * Math.PI * 2)]));
  fillW(p, c, id + 1, dim(CH.floor), Array.from({length: N}, (_, i): V3 => [R * Math.cos((i / N) * Math.PI * 2), 0, R * Math.sin((i / N) * Math.PI * 2)]));
  for (let k = -5; k <= 5; k++) { inkW(p, c, id + 10 + k, [[k * 0.4, 0.001, -2.2], [k * 0.4, 0.001, 2.2]], {weight: 0.6, color: dim(CH.grate)}); inkW(p, c, id + 30 + k, [[-2.2, 0.001, k * 0.4], [2.2, 0.001, k * 0.4]], {weight: 0.6, color: dim(CH.grate)}); }
  // wall facets, far first (inner faces)
  const facets = Array.from({length: N}, (_, i) => { const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2, am = (a0 + a1) / 2; return {i, a0, a1, am, d: Math.hypot(R * Math.cos(am) - c.x, R * Math.sin(am) - c.z)}; }).sort((a, b) => b.d - a.d);
  for (const f of facets) {
    const P = (a: number, y: number): V3 => [R * Math.cos(a), y, R * Math.sin(a)];
    const lit = 0.5 + 0.5 * Math.cos(f.am + Math.PI / 2);
    const q = fillW(p, c, id + 100 + f.i, dim(mixColor(CH.steelDark, CH.steel, 0.4 + 0.5 * lit)), [P(f.a0, 0), P(f.a1, 0), P(f.a1, H), P(f.a0, H)]);
    if (q.length >= 3) inkLine(p, id + 150 + f.i, q, {closed: true, weight: 0.7, color: dim('#2a2826'), still: true, curve: 0});
    // riveted bands
    for (const y of [0.9, 2.2]) {
      fillW(p, c, id + 200 + f.i * 2 + (y > 1 ? 1 : 0), dim(CH.steelDark), [P(f.a0, y), P(f.a1, y), P(f.a1, y + 0.08), P(f.a0, y + 0.08)]);
      for (let r = 0; r < 3; r++) { const a = f.a0 + ((r + 0.5) / 3) * (f.a1 - f.a0); const rq = camPoint(c, [R * 0.99 * Math.cos(a), y + 0.04, R * 0.99 * Math.sin(a)]); if (rq && camDepth(c, P(a, y)) > 0.4) hardFill(p, id + 300 + f.i * 6 + r + (y > 1 ? 3 : 0), dim('#b9bcc0'), ell(rq[0], rq[1], 2.2, 2.2, 6)); }
    }
  }
  // door (rectangle) with the round porthole: a dim control room glows through
  const dz = -2.18;
  fillW(p, c, id + 400, dim('#6f7378'), [[0.75 + 0.2, 0.15, dz], [1.85, 0.15, dz], [1.85, 2.15, dz], [0.95, 2.15, dz]]);
  inkW(p, c, id + 401, [[0.95, 0.15, dz], [1.85, 0.15, dz], [1.85, 2.15, dz], [0.95, 2.15, dz]], {closed: true, weight: 1.1, color: dim('#2a2826')});
  const port = (r: number): V3[] => Array.from({length: 24}, (_, i) => [1.3 + r * Math.cos((i / 24) * Math.PI * 2), 1.45 + r * Math.sin((i / 24) * Math.PI * 2), dz + 0.01]);
  fillW(p, c, id + 402, dim('#3a3d41'), port(0.3));
  fillW(p, c, id + 403, mixColor(CH.glass, CH.control, 0.55 * (0.6 + 0.4 * L)), port(0.25));
  fillW(p, c, id + 404, mixColor(CH.glass, '#f1dfb8', 0.5), port(0.07).map(([x, y, z]): V3 => [x - 0.1, y + 0.08, z + 0.01])); // glass glint
  // gauge beside the door (ticks only, no numerals or labels)
  const gz = -2.15, gx = 0.62, gy = 1.45;
  const disc = (r: number): V3[] => Array.from({length: 24}, (_, i) => [gx + r * Math.cos((i / 24) * Math.PI * 2), gy + r * Math.sin((i / 24) * Math.PI * 2), gz]);
  fillW(p, c, id + 410, dim('#2f3236'), disc(0.13));
  fillW(p, c, id + 411, dim('#efe6cf'), disc(0.105));
  for (let k = 0; k <= 10; k++) { const a = Math.PI * (1.25 - (1.5 * k) / 10); inkW(p, c, id + 420 + k, [[gx + 0.085 * Math.cos(a), gy + 0.085 * Math.sin(a), gz + 0.005], [gx + 0.1 * Math.cos(a), gy + 0.1 * Math.sin(a), gz + 0.005]], {weight: 0.8, color: dim('#2a2826')}); }
  const na = Math.PI * (1.25 - 1.5 * (o.needle ?? 1));
  inkW(p, c, id + 440, [[gx, gy, gz + 0.01], [gx + 0.09 * Math.cos(na), gy + 0.09 * Math.sin(na), gz + 0.01]], {weight: 2.2, color: '#b8352a'});
  // wall hose fitting at (-1.10, 0.90, -1.70)
  fillW(p, c, id + 450, dim('#5b5f64'), circleZ(-1.1, 0.9, -1.75, 0.07, 12));
  // cage lamps
  for (const [k, x] of [[0, -1.2], [1, 1.2]] as const) {
    const lc: V3 = [x, 2.6, -1.0], q = camPoint(c, lc);
    if (!q || camDepth(c, lc) < 0.4) continue;
    paintHalo(p, {x: q[0], y: q[1], r: 220 * L, color: CH.lamp, level: 0.45 * L, squash: 0.9, seed: id + 460 + k * 5});
    hardFill(p, id + 470 + k, mixColor('#5a4a30', CH.lamp, L), ell(q[0], q[1], 26, 30, 14));
    for (let j = -2; j <= 2; j++) inkLine(p, id + 480 + k * 10 + j, [[q[0] + j * 10, q[1] - 30], [q[0] + j * 10, q[1] + 30]], {closed: false, weight: 0.8, color: '#2a2826', still: true});
  }
};

/** A hose from a picture point (suit port) to a world fitting, sagging (picture px). */
export const paintHose = (p: Painter, c: YCam, from: Pt, to: V3, seed = 9790) => {
  const q = camPoint(c, to);
  if (!q) return;
  const pts: Pt[] = Array.from({length: 13}, (_, i): Pt => { const u = i / 12; return [from[0] + (q[0] - from[0]) * u, from[1] + (q[1] - from[1]) * u + Math.sin(Math.PI * u) * 70]; });
  inkLine(p, seed, pts, {closed: false, weight: 4, color: '#3a3833', still: true, curve: 0.5});
  inkLine(p, seed + 1, pts.map(([x, y]): Pt => [x, y - 3]), {closed: false, weight: 1.2, color: '#8a867c', still: true, curve: 0.5});
};
