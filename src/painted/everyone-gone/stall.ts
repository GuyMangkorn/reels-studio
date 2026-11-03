import {clipHalf, ell, hardFill, inkLine, washAt} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {EG_PAL, shadowFill, stoolCard} from './set';
import {frontRect, groundQuad, proj, SUN_DIR, SUN_K, type Cam} from './space';

// EG-EP01-SHORT soi-corner stall (brief R1.2 VD09; storyboard S01-B03-SH01..SH03). Look-defining first version by Film
// (W3.1, 3 Nov 2026); Boss hardens `drawPot`/`drawStool`/`drawGlass` into kit `props.ts`. Stall space: metres, origin on the
// pavement under the table front edge, +x right, +y up, +z toward the camera; the shophouse side wall stands at z -2.5.
// Warm accents only on the clue objects (VD02): the steam and the iced coffee. Ice = whole cubes, no melt, no condensation.
// Same low sun as the soi (camera-left, SUN_DIR): long shadows to the right and away plant the sun's direction for CL07.

/** Medium-wide of the whole stall (SH03 framing), seated eye height so the table top reads. */
export const STALL_CAM: Cam = {x: -0.2, y: 1.3, z: 3.4, f: 1300, hy: 620};
const WALL_Z = -2.5;
/** Table footprint (m) and the two pushed-back stools (x, z). */
const TX0 = -0.85, TX1 = 0.05, TZ0 = 0.0, TZ1 = 0.7;
const ST = [[-1.05, 0.95], [0.45, 0.8]] as const;

const hull = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const q of s) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  for (const q of [...s].reverse()) {
    while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
/** Ground shadow of a set of object points (x, y, z): each point slides along the sun to the ground; hull in x/z, cut at the wall. */
const shadowOf = (c: Cam, seed: number, p: Painter, pts: V3[], opacity = 120) => {
  const g = hull(pts.map(([x, y, z]): Pt => [x + SUN_DIR[0] * SUN_K * y, Math.max(WALL_Z, z + SUN_DIR[1] * SUN_K * y)]));
  const cut = clipHalf(g, [0, 1], WALL_Z);
  if (cut.length) shadowFill(p, seed, cut.map(([x, z]) => proj(c, [x, 0, z])), opacity, false);
};
const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): V3[] =>
  [[x0, y0, z0], [x1, y0, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z0], [x1, y1, z0], [x0, y1, z1], [x1, y1, z1]];

/** Steam from the pot: soft wisps rising and drifting, a pure function of `t` (hold-safe ambient clock). */
const steam = (p: Painter, c: Cam, seed: number, t: number, cx: number, top: number, z: number) => {
  // Fix pass 1 (viewer check: bubbles at f530): no outlines, ragged lobed blobs, smaller and more of them, a faint cool-grey core so they read as vapour.
  for (let k = 0; k < 7; k++) {
    const ph = (t * 0.35 + k / 7) % 1;
    const y = top + 0.04 + ph * 0.8, x = cx + 0.05 * Math.sin(t * 1.3 + k * 1.7) + ph * 0.14 * (k % 2 ? 1 : -0.6);
    const [sx, sy] = proj(c, [x, y, z]);
    const r = (0.05 + ph * 0.11) * c.f / (c.z - z);
    const blob = (rr: number, ry: number, ph0: number) => Array.from({length: 14}, (_, i): Pt => {
      const a = (i / 14) * Math.PI * 2, w = 1 + 0.22 * Math.sin(3 * a + k + ph0) + 0.12 * Math.sin(5 * a + t * 2 + ph0 * 2);
      return [sx + rr * w * Math.cos(a), sy + ry * w * Math.sin(a)];
    });
    const fade = (1 - ph) * Math.min(1, ph * 6);
    washAt(p, seed + k, '#e9ecea', 120 * fade, blob(r * 1.15, r * 1.5, 0), 0.45, 0.6);
    washAt(p, seed + 10 + k, '#fff6e4', 95 * fade, blob(r * 0.7, r * 1.0, 1.7), 0.5, 0.6);
  }
};

/** Paint the stall at shot-local time `t` (s). `o.ice` = ice-cube turn in revolutions. */
export const paintStall = (p: Painter, t: number, c: Cam = STALL_CAM, o: {ice?: number} = {}) => {
  const S = 7_600_000;
  // Wall and a closed shutter, a drainpipe; pavement with joints; the sunlit wedge on the wall (camera-left brighter).
  // Viewer check 3 Nov 2026 (UT01): the stall reads outdoors. Milky sky above a low (3.9 m) cool-grey wall, an alley opening to the
  // left of the shutter with a far street end, wires across. The beige room is gone; the pot stays the one warm point.
  const WALL_TOP = 3.9, ALLEY: [number, number] = [-3.4, 0.2], FAR_Z = -9;
  hardFill(p, S + 1, '#b7bfc1', [[-300, -300], [1380, -300], [1380, 2300], [-300, 2300]]);
  washAt(p, S + 7, '#c2c7c5', 170, [[-300, 0], [1380, 0], [1380, 900], [-300, 900]], 0.3, 0.3);
  hardFill(p, S + 8, '#8e9a9f', frontRect(c, FAR_Z, ALLEY[0], ALLEY[1], 0, 3.4));
  hardFill(p, S + 9, '#c6cbc9', frontRect(c, FAR_Z + 0.01, ALLEY[0] + 0.9, ALLEY[1] - 0.9, 0, 2.3));
  hardFill(p, S + 21, '#b9bcb7', groundQuad(c, ALLEY[0], ALLEY[1], FAR_Z, WALL_Z));
  // fix pass 2: the far-ground wash (S + 22, 8d979c) is removed; it switched on as a dark blot under the table edge at S01-B03-SH02 f623-f679.
  hardFill(p, S + 10, '#a5b0b4', frontRect(c, WALL_Z, 0.2, 6, 0, WALL_TOP));
  hardFill(p, S + 11, '#9ca7ab', frontRect(c, WALL_Z, -6, ALLEY[0], 0, WALL_TOP));
  hardFill(p, S + 12, '#b4bcbe', frontRect(c, WALL_Z + 0.02, 0.2, 6, WALL_TOP - 0.18, WALL_TOP));
  hardFill(p, S + 13, '#b4bcbe', frontRect(c, WALL_Z + 0.02, -6, ALLEY[0], WALL_TOP - 0.18, WALL_TOP));
  hardFill(p, S + 2, EG_PAL.shutter, frontRect(c, WALL_Z + 0.01, 0.6, 3.6, 0, 2.8));
  for (let k = 1; k < 14; k++) inkLine(p, S + 30 + k, [proj(c, [0.6, (2.8 * k) / 14, WALL_Z + 0.01]), proj(c, [3.6, (2.8 * k) / 14, WALL_Z + 0.01])], {color: EG_PAL.shutterLine, weight: 0.6, closed: false, curve: 0, still: true});
  hardFill(p, S + 3, '#8f999d', frontRect(c, WALL_Z + 0.05, 0.28, 0.38, 0, WALL_TOP));
  hardFill(p, S + 4, EG_PAL.upperWin, frontRect(c, WALL_Z + 0.01, -5.4, -4.2, 1.9, 3.2));
  washAt(p, S + 5, '#d3d9d8', 60, frontRect(c, WALL_Z + 0.02, -6, 0.2, 0, WALL_TOP), 0.4, 0.4);
  hardFill(p, S + 6, '#c4c7c2', groundQuad(c, -6, 6, WALL_Z, 3));
  for (const [h, sag] of [[3.5, 0.25], [3.3, 0.3]] as const) {
    const wp: Pt[] = Array.from({length: 14}, (_, j) => {
      const u = j / 13;
      return proj(c, [-4 + 10 * u, h - sag * Math.sin(Math.PI * u), WALL_Z + 0.8 + 0.4 * u]);
    });
    inkLine(p, S + 60 + h * 10, wp, {color: EG_PAL.wire, weight: 1.2, closed: false, curve: 0.4, still: true});
  }
  for (let x = -6; x <= 6; x += 0.6) inkLine(p, S + 100 + Math.round(x * 10), [proj(c, [x, 0, WALL_Z]), proj(c, [x, 0, 1.7])], {color: EG_PAL.pavementLine, weight: 0.5, closed: false, curve: 0, still: true});
  for (let z = WALL_Z + 0.6; z < 1.8; z += 0.6) inkLine(p, S + 200 + Math.round(z * 10), [proj(c, [-6, 0, z]), proj(c, [6, 0, z])], {color: EG_PAL.pavementLine, weight: 0.5, closed: false, curve: 0, still: true});

  // Shadows first (VD13 sun): cart, pot, table top and legs, both stools.
  const cart = {x0: 0.45, x1: 1.45, z0: -1.05, z1: -0.55, top: 0.86};
  shadowOf(c, S + 300, p, box(cart.x0, cart.x1, 0, cart.top, cart.z0, cart.z1), 95);
  shadowOf(c, S + 301, p, box(0.62, 1.02, cart.top, 1.22, -0.95, -0.65), 90);
  shadowOf(c, S + 302, p, box(TX0, TX1, 0.7, 0.74, TZ0, TZ1), 95);
  shadowOf(c, S + 303, p, box(ST[0][0] - 0.17, ST[0][0] + 0.17, 0, 0.45, ST[0][1] - 0.15, ST[0][1] + 0.15), 95);
  shadowOf(c, S + 304, p, box(ST[1][0] - 0.17, ST[1][0] + 0.17, 0, 0.45, ST[1][1] - 0.15, ST[1][1] + 0.15), 95);

  // Cart: stainless body, darker kick plate, a glass display shelf with noodles, the burner ring.
  const P = (x: number, y: number, z: number) => proj(c, [x, y, z]);
  hardFill(p, S + 400, '#b9c2c6', frontRect(c, cart.z1, cart.x0, cart.x1, 0.12, cart.top));
  hardFill(p, S + 401, '#7e878b', frontRect(c, cart.z1, cart.x0, cart.x1, 0, 0.12));
  hardFill(p, S + 402, '#d7dde0', [P(cart.x0, cart.top, cart.z1), P(cart.x1, cart.top, cart.z1), P(cart.x1, cart.top, cart.z0), P(cart.x0, cart.top, cart.z0)]);
  hardFill(p, S + 403, '#e9ece9', frontRect(c, cart.z1 + 0.01, cart.x0 + 0.08, cart.x1 - 0.08, 0.45, 0.78));
  washAt(p, S + 404, '#e08a3c', 200, frontRect(c, cart.z1 + 0.02, cart.x0 + 0.14, cart.x1 - 0.5, 0.5, 0.6), 0.05, 0.4);
  inkLine(p, S + 405, frontRect(c, cart.z1, cart.x0, cart.x1, 0, cart.top), {color: EG_PAL.frameInk, weight: 1.0, curve: 0});
  for (const wx of [cart.x0 + 0.1, cart.x1 - 0.1]) {
    const [wcx, wcy] = P(wx, 0.06, cart.z1 + 0.02);
    washAt(p, S + 406 + wx, EG_PAL.tyre, 255, ell(wcx, wcy, 22, 22, 14), 0.02, 0.1);
  }
  // Pot: a dented aluminium stock pot, lid pushed aside (someone just served), the warm broth line, a ladle handle.
  const pz = -0.8, pcx = 0.82, pr = 0.2, py0 = cart.top, py1 = 1.2;
  const [lx, ly0] = P(pcx - pr, py0, pz), [rx] = P(pcx + pr, py0, pz), [, ly1] = P(pcx, py1, pz);
  const ry = (rx - lx) * 0.16;
  washAt(p, S + 500, '#c3c9cb', 255, [[lx, ly1], [rx, ly1], [rx, ly0], [(lx + rx) / 2, ly0 + ry], [lx, ly0]], 0.02, 0.2);
  hardFill(p, S + 501, '#e8ebea', [[lx, ly1], [lx + (rx - lx) * 0.3, ly1], [lx + (rx - lx) * 0.25, ly0 + ry * 0.6], [lx, ly0]]);
  hardFill(p, S + 502, '#8b9397', [[rx - (rx - lx) * 0.22, ly1], [rx, ly1], [rx, ly0], [rx - (rx - lx) * 0.2, ly0 + ry * 0.6]]);
  washAt(p, S + 503, '#d9c08c', 255, ell((lx + rx) / 2, ly1, (rx - lx) / 2, ry, 20), 0.02, 0.3);
  washAt(p, S + 504, '#e9c27a', 200, ell((lx + rx) / 2, ly1 + 2, (rx - lx) * 0.42, ry * 0.75, 20), 0.1, 0.4);
  inkLine(p, S + 505, ell((lx + rx) / 2, ly1, (rx - lx) / 2, ry, 20), {color: '#545d62', weight: 1.0});
  inkLine(p, S + 506, [[lx, ly1], [lx, ly0], [(lx + rx) / 2, ly0 + ry], [rx, ly0], [rx, ly1]], {color: '#545d62', weight: 1.0, closed: false, curve: 0.3});
  const lid = [P(1.05, cart.top + 0.005, -0.75), P(1.4, cart.top + 0.005, -0.75)];
  washAt(p, S + 507, '#cfd5d7', 255, ell((lid[0][0] + lid[1][0]) / 2, lid[0][1] - 8, (lid[1][0] - lid[0][0]) / 2, 18, 18), 0.02, 0.2);
  inkLine(p, S + 508, ell((lid[0][0] + lid[1][0]) / 2, lid[0][1] - 8, (lid[1][0] - lid[0][0]) / 2, 18, 18), {color: '#545d62', weight: 0.9});
  inkLine(p, S + 509, [P(0.7, 1.15, pz + 0.05), P(0.55, 1.4, pz + 0.1)], {color: '#545d62', weight: 2.2, closed: false, curve: 0});
  steam(p, c, S + 520, t, pcx, py1, pz);

  // Folding table (top seen from above at seated eye height), legs; the iced coffee on its front-left.
  const tt = 0.72;
  for (const [x, z] of [[TX0 + 0.05, TZ0 + 0.05], [TX1 - 0.05, TZ0 + 0.05], [TX0 + 0.05, TZ1 - 0.05], [TX1 - 0.05, TZ1 - 0.05]] as const) hardFill(p, S + 600 + x * 10 + z * 100, '#8f989c', [P(x - 0.015, 0, z), P(x + 0.015, 0, z), P(x + 0.015, tt, z), P(x - 0.015, tt, z)]);
  hardFill(p, S + 610, '#e6e1d4', [P(TX0, tt, TZ1), P(TX1, tt, TZ1), P(TX1, tt, TZ0), P(TX0, tt, TZ0)]);
  washAt(p, S + 614, '#f7f2e6', 120, [P(TX0, tt, TZ1), P((TX0 + TX1) / 2, tt, TZ1), P((TX0 + TX1) / 2, tt, TZ0), P(TX0, tt, TZ0)], 0.3, 0.3);
  hardFill(p, S + 611, '#c7c0b0', [P(TX0, tt, TZ1), P(TX1, tt, TZ1), P(TX1, tt - 0.035, TZ1), P(TX0, tt - 0.035, TZ1)]);
  hardFill(p, S + 615, '#c7c0b0', [P(TX1, tt, TZ1), P(TX1, tt, TZ0), P(TX1, tt - 0.035, TZ0), P(TX1, tt - 0.035, TZ1)]);
  inkLine(p, S + 612, [P(TX0, tt, TZ1), P(TX1, tt, TZ1), P(TX1, tt, TZ0), P(TX0, tt, TZ0)], {color: EG_PAL.frameInk, weight: 0.9, curve: 0});
  // Glass shadow on the table top (right and away).
  const gx = -0.3, gz = 0.55, gr = 0.042, gh = 0.14;
  shadowFill(p, S + 613, [P(gx - gr, tt, gz), P(gx + gr, tt, gz), P(gx + gr + SUN_DIR[0] * SUN_K * gh, tt, gz + SUN_DIR[1] * SUN_K * gh), P(gx - gr + SUN_DIR[0] * SUN_K * gh, tt, gz + SUN_DIR[1] * SUN_K * gh)], 90);
  const [g0x, g0y] = P(gx - gr, tt, gz), [g1x] = P(gx + gr, tt, gz), [, gty] = P(gx, tt + gh, gz);
  const w = g1x - g0x, ery = w * 0.13;
  // Iced coffee: milk-brown, darker at the bottom, whole cubes in the top third, a straw. Clear glass rim, no droplets.
  washAt(p, S + 620, '#8a5a3a', 255, [[g0x + w * 0.04, gty + w * 0.3], [g1x - w * 0.04, gty + w * 0.3], [g1x - w * 0.08, g0y], [g0x + w * 0.08, g0y]], 0.02, 0.2);
  washAt(p, S + 621, '#c99a6c', 230, [[g0x + w * 0.04, gty + w * 0.3], [g1x - w * 0.04, gty + w * 0.3], [g1x - w * 0.06, gty + w * 0.9], [g0x + w * 0.06, gty + w * 0.9]], 0.05, 0.3);
  const cubes: [number, number, number][] = [[0.12, 0.34, 0.1], [0.5, 0.3, -0.08], [0.3, 0.62, 0.05], [0.66, 0.62, 0.12]];
  cubes.forEach(([u, v, a], i) => {
    const cx = g0x + u * w + w * 0.12, cy = gty + v * w * 0.9, s = w * 0.2;
    const ar = a + 2 * Math.PI * (o.ice ?? 0) * (i % 2 ? -1 : 1); // `ice` = revolutions (S01-B03-SH02 turns 0.15 rev); cubes stay whole
    const sq: Pt[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => [cx + s * (x * Math.cos(ar) - y * Math.sin(ar)), cy + s * (x * Math.sin(ar) + y * Math.cos(ar))]);
    // Fix pass 1: clear ice, not paper: pale blue-green body, a white highlight on the upper-left edge, a cool edge line, a darker lower facet.
    washAt(p, S + 630 + i, '#cfe4e8', 235, sq, 0.02, 0.15);
    washAt(p, S + 660 + i, '#8fb3be', 150, [sq[1], sq[2], sq[3], [(sq[0][0] + sq[3][0]) / 2 + (sq[2][0] - sq[3][0]) * 0.1, (sq[0][1] + sq[3][1]) / 2]], 0.02, 0.15);
    inkLine(p, S + 640 + i, [sq[0], sq[1]], {color: '#ffffff', weight: 1.6, curve: 0, closed: false, still: true});
    inkLine(p, S + 670 + i, sq, {color: '#5f8794', weight: 0.7, curve: 0});
  });
  washAt(p, S + 650, '#e3a35e', 120, ell((g0x + g1x) / 2, gty + w * 0.32, w * 0.46, ery, 16), 0.1, 0.3);
  inkLine(p, S + 651, [[g0x, gty], [g0x + w * 0.08, g0y], [g1x - w * 0.08, g0y], [g1x, gty]], {color: '#6e675e', weight: 0.9, closed: false, curve: 0.1});
  inkLine(p, S + 652, ell((g0x + g1x) / 2, gty, w / 2, ery, 16), {color: '#6e675e', weight: 0.8});
  hardFill(p, S + 653, '#ffffff', [[g0x + w * 0.1, gty + w * 0.1], [g0x + w * 0.18, gty + w * 0.1], [g0x + w * 0.2, g0y - w * 0.1], [g0x + w * 0.12, g0y - w * 0.1]]);
  inkLine(p, S + 654, [[g0x + w * 0.62, gty + w * 0.4], [g0x + w * 0.8, gty - w * 0.55]], {color: '#3f6f7c', weight: 3.0, closed: false, curve: 0});

  // Two plastic stools pushed back from the table, in front of the table (pushed back toward the camera, painted last).
  stoolCard(p, c, S + 700, ST[0][0], ST[0][1]);
  stoolCard(p, c, S + 710, ST[1][0], ST[1][1], '#8aa1ad');
};
