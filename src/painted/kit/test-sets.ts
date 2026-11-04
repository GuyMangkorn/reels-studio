// TESTSET-CROSSROADS (kit test set, 4 Nov 2026; user "make it a test set"): an empty Yaowarat-style crossroads at blue hour,
// closed on every side, for trying the yaw camera (`ycam.ts`), the body views (`views.ts`) and camera moves in a set. **Test only
// (Requirement, ENV-P01 exception):** never painted in a delivered shot; a real street is designed from its story and stays in its
// episode. Moved unchanged from the PARALLAX-ORBIT360 spike; world metres, the figure under test at the origin.
// The small paint helpers below are copies of the EG-EP02 place helpers (`everyone-gone/ep02/places.ts`), kept private so the kit
// imports no episode.
import {clipHalf, ell, hardFill, washAt} from './draw';
import {hash} from './hash';
import {mixColor, type Painter, type Pt} from './painter';
import type {V3} from './space';
import {camDist, camPoly, camSpace, camToPicture, YCAM_NEAR, type YCam} from './ycam';

const NEAR = YCAM_NEAR;
const toCam = camSpace, scr = camToPicture, poly = camPoly;

type Rect = [number, number, number, number];
const SAFE: Rect = [-300, -300, 1380, 2220];
const clip = (pts: Pt[], [x0, y0, x1, y1]: Rect = SAFE): Pt[] => {
  let r = clipHalf(pts, [1, 0], x0);
  if (r.length) r = clipHalf(r, [-1, 0], -x1);
  if (r.length) r = clipHalf(r, [0, 1], y0);
  if (r.length) r = clipHalf(r, [0, -1], -y1);
  return r;
};
const fillC = (p: Painter, seed: number, color: string, pts: Pt[]) => {
  const c = clip(pts);
  if (c.length >= 3) hardFill(p, seed, color, c);
};
const washC = (p: Painter, seed: number, color: string, op: number, pts: Pt[], bleed = 0.2, tex = 0.45) => {
  const c = clip(pts);
  if (c.length >= 3) washAt(p, seed, color, op, c, bleed, tex);
};
const sky = (p: Painter, seed: number, top: string, low: string, y0: number, y1: number, n = 56, xr: [number, number] = [-20, 1100]) => {
  const dx = (xr[1] - xr[0]) / 8;
  for (let i = 0; i < n; i++) {
    const a = y0 + ((y1 - y0) * i) / n, b = y0 + ((y1 - y0) * (i + 1.6)) / n;
    const edge = (y: number, k: number): Pt[] => Array.from({length: 9}, (_, j): Pt => [xr[0] + j * dx, y + (hash(seed + i * 17 + j * 5 + k) - 0.5) * 10]);
    hardFill(p, seed + i, mixColor(top, low, (i / (n - 1)) ** 1.4), [...edge(a, 0), ...edge(b, 1).reverse()]);
  }
  if (xr[0] !== -20 || xr[1] !== 1100) return;
  const mid = (y0 + y1) / 2;
  washAt(p, seed + 90, top, 36, [[-20, y0], [1100, y0], [1100, mid + 120], [-20, mid + 60]], 0.3, 0.75);
  washAt(p, seed + 91, low, 40, [[-20, mid - 80], [1100, mid - 140], [1100, y1], [-20, y1]], 0.3, 0.75);
};
const glow = (p: Painter, seed: number, x: number, y: number, r: number, color: string, op: number) => {
  for (let i = 0; i < 3; i++) washAt(p, seed + i, color, op * (1 - i * 0.25), ell(x, y, r * (1 + i * 0.7), r * (1 + i * 0.7), 20), 0.35, 0.2);
};

// --- the crossroads (metres; `คุณ` at the origin) ---------------------------------------------------------------------
const ROAD = 4, FACADE = 7, FAR = 46;
const C = {
  asphalt: '#56616e', asphaltNear: '#454f5b', pave: '#7d848c', kerb: '#a4abb0', line: '#c3c9cc',
  tones: ['#7d8996', '#8e98a2', '#6f7c8a', '#98a0a6'], shutter: '#9aa3ab', win: '#4f5c69', signs: ['#a8463a', '#c9b07a', '#e2ddd0', '#8a3a30'],
};
type Item = {at: V3; draw: (p: Painter, c: YCam) => void};

/** Shophouse bays along the four corner blocks, each facing the road it fronts. */
const bays = (): Item[] => {
  const items: Item[] = [];
  let n = 0;
  for (const sa of [-1, 1]) for (const sb of [-1, 1]) for (const axis of ['x', 'z'] as const) {
    let s = FACADE;
    let i = 0;
    while (s < FAR) {
      const len = 4 + 1.5 * hash(n * 7.1 + 3), top = 11 + 9 * hash(n * 3.7 + 1), tone = C.tones[n % 4], id = 30000 + n * 50;
      const s0 = s, s1 = s + len;
      // axis 'x': facade plane x = sa*FACADE, running along z on side sb; axis 'z': plane z = sb*FACADE running along x on side sa.
      const P = (along: number, y: number): V3 => (axis === 'x' ? [sa * FACADE, y, sb * along] : [sa * along, y, sb * FACADE]);
      const out = (along: number, y: number, o: number): V3 => (axis === 'x' ? [sa * (FACADE - o), y, sb * along] : [sa * along, y, sb * (FACADE - o)]);
      const signAt = hash(n * 5.3 + 7) > 0.35 ? {h0: 3.6 + 1.2 * hash(n + 9), h1: 8 + 5 * hash(n * 2 + 4), out: 1.4 + hash(n * 9) * 1.0, col: C.signs[n % 4]} : null;
      const mid = (s0 + s1) / 2;
      items.push({
        at: P(mid, 0),
        draw: (p, c) => {
          fillC(p, id, tone, poly(c, [P(s0, 0), P(s1, 0), P(s1, top), P(s0, top)]));
          fillC(p, id + 1, C.shutter, poly(c, [P(s0 + 0.3, 0), P(s1 - 0.3, 0), P(s1 - 0.3, 2.9), P(s0 + 0.3, 2.9)]));
          for (let k = 1; k < 7; k++) fillC(p, id + 2 + k, mixColor(C.shutter, '#6f7881', 0.45), poly(c, [P(s0 + 0.3, k * 0.42), P(s1 - 0.3, k * 0.42), P(s1 - 0.3, k * 0.42 + 0.04), P(s0 + 0.3, k * 0.42 + 0.04)]));
          fillC(p, id + 10, mixColor(tone, '#3e4852', 0.35), poly(c, [P(s0, 3.0), P(s1, 3.0), P(s1, 3.25), P(s0, 3.25)]));
          for (const y0 of [4.2, 7.4]) if (y0 + 1.6 < top) fillC(p, id + 12 + y0, C.win, poly(c, [P(s0 + 0.7, y0), P(s1 - 0.7, y0), P(s1 - 0.7, y0 + 1.6), P(s0 + 0.7, y0 + 1.6)]));
        },
      });
      if (signAt) {
        const e = s1 - 0.3, sg = signAt;
        items.push({
          at: out(e, 0, sg.out / 2),
          draw: (p, c) => {
            fillC(p, id + 20, sg.col, poly(c, [out(e, sg.h0, 0.2), out(e, sg.h0, 0.2 + sg.out), out(e, sg.h1, 0.2 + sg.out), out(e, sg.h1, 0.2)]));
            const mark = sg.col === C.signs[2] ? '#7a2a22' : '#f1e6cf';
            for (let k = 0; k < 4; k++) {
              const y = sg.h1 - 0.9 - k * ((sg.h1 - sg.h0 - 1.2) / 4), o0 = 0.2 + sg.out * 0.3, o1 = 0.2 + sg.out * 0.7;
              fillC(p, id + 30 + k, mark, poly(c, [out(e, y, o0), out(e, y, o1), out(e, y + 0.18, o1), out(e, y + 0.18, o0)]));
            }
          },
        });
      }
      s = s1;
      i++;
      n++;
    }
    void i;
  }
  return items;
};

/** Lamp poles at the four corners and a red spirit shrine on one, the props that cross in front of her. */
const props = (): Item[] => {
  const items: Item[] = [];
  [[5.2, 5.2], [-5.2, 5.2], [5.2, -5.2], [-5.2, -5.2]].forEach(([x, z], k) => {
    items.push({
      at: [x, 0, z],
      draw: (p, c) => {
        const w = 0.09;
        const tc = toCam(c, [x, 0, z]);
        if (tc.d < NEAR) return;
        const r: V3 = [Math.cos(c.yaw) * w, 0, Math.sin(c.yaw) * w]; // a pole is round: a billboard across the view
        fillC(p, 31000 + k, '#3d4650', poly(c, [[x - r[0], 0, z - r[2]], [x + r[0], 0, z + r[2]], [x + r[0], 6.5, z + r[2]], [x - r[0], 6.5, z - r[2]]]));
        const toRoad: V3 = [-Math.sign(x) * 1.2, 0, -Math.sign(z) * 1.2];
        const arm = (u: number): V3 => [x + toRoad[0] * u, 6.4 + 0.15 * u, z + toRoad[2] * u];
        const a = poly(c, [arm(0), arm(1), [arm(1)[0], arm(1)[1] + 0.08, arm(1)[2]], [arm(0)[0], arm(0)[1] + 0.08, arm(0)[2]]]);
        fillC(p, 31010 + k, '#3d4650', a);
        const lamp = toCam(c, arm(1));
        if (lamp.d > NEAR) {
          const [lx, ly] = scr(c, lamp);
          glow(p, 31020 + k * 3, lx, ly + 6, Math.min(60, (c.f * 0.25) / lamp.d), '#f3d9a4', 55);
        }
      },
    });
  });
  // Shrine on the (+x, -z) corner: a red house on a post.
  const [sx, sz] = [5.8, -6.2];
  items.push({
    at: [sx, 0, sz],
    draw: (p, c) => {
      const b = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, col: string, seed: number) => {
        // The two faces that look toward the camera.
        const fx = c.x > (x0 + x1) / 2 ? x1 : x0, fz = c.z > (z0 + z1) / 2 ? z1 : z0;
        fillC(p, seed, mixColor(col, '#000000', 0.12), poly(c, [[fx, y0, z0], [fx, y0, z1], [fx, y1, z1], [fx, y1, z0]]));
        fillC(p, seed + 1, col, poly(c, [[x0, y0, fz], [x1, y0, fz], [x1, y1, fz], [x0, y1, fz]]));
      };
      b(sx - 0.06, sx + 0.06, 0, 1.3, sz - 0.06, sz + 0.06, '#5a4636', 31100);
      b(sx - 0.4, sx + 0.4, 1.3, 1.95, sz - 0.4, sz + 0.4, '#b8352b', 31110);
      b(sx - 0.48, sx + 0.48, 1.95, 2.05, sz - 0.48, sz + 0.48, '#d4a24a', 31120);
    },
  });
  return items;
};

const SET = [...bays(), ...props()];

/** Far skyline: towers on a ring 110-160 m out, each a card square to the centre, so they barely move as the camera circles. */
const TOWERS = Array.from({length: 46}, (_, i) => {
  const a = (i / 46) * Math.PI * 2 + 0.05 * hash(i * 3.1), r = 110 + 50 * hash(i * 7.7), w = 10 + 14 * hash(i * 1.3), h = 30 + 70 * hash(i * 5.9);
  return {a, r, w, h, tone: mixColor('#9fb0c2', '#b9c6d3', hash(i * 2.2))};
});
/** Moon direction (world, horizontal unit) and elevation: down the -z street, a little left. */
const MOON = {dir: [-0.42, -0.91] as [number, number], el: 0.36};

const paintGround = (p: Painter, c: YCam) => {
  fillC(p, 30001, C.asphalt, [[-200, c.hy - 2], [1280, c.hy - 2], [1280, 2200], [-200, 2200]]);
  for (let k = 0; k < 6; k++) fillC(p, 30010 + k, mixColor(C.asphalt, C.asphaltNear, (k + 1) / 6), [[-200, c.hy + 90 + k * 110], [1280, c.hy + 90 + k * 110], [1280, 2200], [-200, 2200]]);
  // Pavements: the four corner squares, with kerb strips along both roads.
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    fillC(p, 30100 + sx * 4 + sz, C.pave, poly(c, [[sx * ROAD, 0, sz * ROAD], [sx * FAR, 0, sz * ROAD], [sx * FAR, 0, sz * FAR], [sx * ROAD, 0, sz * FAR]]));
    fillC(p, 30120 + sx * 4 + sz, C.kerb, poly(c, [[sx * ROAD, 0, sz * ROAD], [sx * (ROAD + 0.18), 0, sz * ROAD], [sx * (ROAD + 0.18), 0, sz * FAR], [sx * ROAD, 0, sz * FAR]]));
    fillC(p, 30140 + sx * 4 + sz, C.kerb, poly(c, [[sx * ROAD, 0, sz * ROAD], [sx * FAR, 0, sz * ROAD], [sx * FAR, 0, sz * (ROAD + 0.18)], [sx * ROAD, 0, sz * (ROAD + 0.18)]]));
  }
  // Zebra crossings at the four mouths of the junction, and centre dashes down each road.
  for (const s of [-1, 1]) for (let k = -3; k <= 3; k++) {
    const a = k * 1.0 - 0.25, b = a + 0.5;
    fillC(p, 30200 + s * 20 + k, C.line, poly(c, [[a, 0, s * 4.6], [b, 0, s * 4.6], [b, 0, s * 6.6], [a, 0, s * 6.6]]));
    fillC(p, 30250 + s * 20 + k, C.line, poly(c, [[s * 4.6, 0, a], [s * 6.6, 0, a], [s * 6.6, 0, b], [s * 4.6, 0, b]]));
  }
  for (const s of [-1, 1]) for (let d = 8; d < FAR; d += 5) {
    fillC(p, 30300 + s * 100 + d, C.line, poly(c, [[-0.07, 0, s * d], [0.07, 0, s * d], [0.07, 0, s * (d + 2.5)], [-0.07, 0, s * (d + 2.5)]]));
    fillC(p, 30400 + s * 100 + d, C.line, poly(c, [[s * d, 0, -0.07], [s * (d + 2.5), 0, -0.07], [s * (d + 2.5), 0, 0.07], [s * d, 0, 0.07]]));
  }
};

const paintSky = (p: Painter, c: YCam) => {
  sky(p, 30500, '#8fa2b8', '#e4dcd2', -20, c.hy + 10);
  for (const [i, t] of TOWERS.entries()) {
    const cx = Math.sin(t.a) * t.r, cz = -Math.cos(t.a) * t.r, tx = Math.cos(t.a) * t.w / 2, tz = Math.sin(t.a) * t.w / 2;
    fillC(p, 30600 + i, t.tone, poly(c, [[cx - tx, 0, cz - tz], [cx + tx, 0, cz + tz], [cx + tx, t.h, cz + tz], [cx - tx, t.h, cz - tz]]));
  }
  washC(p, 30700, '#c9d0d8', 70, [[-200, c.hy - 70], [1280, c.hy - 70], [1280, c.hy + 30], [-200, c.hy + 30]], 0.35, 0.6);
  const m = toCam(c, [c.x + MOON.dir[0] * 1000, c.y + MOON.el * 1000, c.z + MOON.dir[1] * 1000]);
  if (m.d > 0) {
    const [mx, my] = scr(c, m);
    if (mx > -40 && mx < 1120) {
      hardFill(p, 30710, '#f4efe2', ell(mx, my, 22, 22, 24));
      hardFill(p, 30711, '#a2b2c4', ell(mx + 9, my - 5, 19, 19, 24));
    }
  }
};

/** One depth-sorted piece of a test set: its ground point (for painter's order) and its paint call. */
export type TestSetItem = Item;
/**
 * Paint the crossroads seen from `c`, with extra items (the figures under test) sorted into it far to near. Sky and ground first;
 * the near-plane clip in `camPoly` drops whatever is behind the lens.
 */
export const paintCrossroads = (p: Painter, c: YCam, extra: TestSetItem[] = []) => {
  paintSky(p, c);
  paintGround(p, c);
  [...SET, ...extra].map((it) => ({it, d: camDist(c, it.at)})).sort((a, b) => b.d - a.d).forEach((o) => o.it.draw(p, c));
};
