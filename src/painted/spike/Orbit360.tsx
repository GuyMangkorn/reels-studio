// PARALLAX-ORBIT360 spike (coordinator, 4 Nov 2026; user "ทำ 360° เลย"). Not a deliverable. The EG sets are built for a camera that
// looks down -z (`proj` has no yaw and cuts the near plane along z only) and have nothing behind the lens, so a full turn there
// breaks. The camera is now the kit yaw camera (`kit/ycam.ts`: yaw, near-plane polygon clip) and her view comes from the kit's
// six body views (`kit/views.ts`: front, front-right, right, back, left, front-left), so the spike keeps only a small set that is closed
// on every side: an empty Yaowarat-style crossroads at blue hour, `คุณ` (YOU2) standing in the middle facing -z, the camera circling her
// once at 3 m. Her view follows the camera angle by `VIEW_SECTORS` (back 135-225 deg, no back diagonals since r5; no cross-fade).
import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawFigure, type FigPose} from '../kit/cast';
import {hardFill, washAt, ell} from '../kit/draw';
import {EXPRESSIONS} from '../kit/expressions';
import {hash} from '../kit/hash';
import {layerMotion} from '../kit/motions';
import {makePainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {poseArms} from '../kit/poses';
import {Grain} from '../kit/screen';
import type {V3} from '../kit/space';
import {figureView, viewFields} from '../kit/views';
import {camDist, camPoly, camSpace, camToPicture, camUnit, orbitYCam, YCAM_NEAR, type CamPt, type YCam} from '../kit/ycam';
import {StateGrade} from '../everyone-gone/ep02/look';
import {YOU2, fillC, glow, sky, washC} from '../everyone-gone/ep02/places';

const FPS = 30;
const PAPER = '#e9e6e0';
export const ORBIT360_FRAMES = 240;

const NEAR = YCAM_NEAR;
type CP = CamPt;
const toCam = camSpace, scr = camToPicture, poly = camPoly;
const dist = camDist;

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

// --- `คุณ` -------------------------------------------------------------------------------------------------------------
const FACING: [number, number] = [0, -1]; // she faces -z: at azimuth 0 the camera is behind her
const paintYou = (p: Painter, c: YCam, t: number) => {
  const at: V3 = [0, 0, 0];
  const g = scr(c, toCam(c, at)), u = camUnit(c, at);
  // Contact shadow on the asphalt.
  washAt(p, 31500, '#2c333b', 120, poly(c, ell(0, 0, 0.32, 0.26, 18).map(([x, z]): V3 => [x, 0, z])), 0.3, 0.3);
  const vf = viewFields(figureView(c, at, FACING));
  if (vf.view === 'back') {
    drawFigure(p, YOU2, g, u, {...vf, face: EXPRESSIONS.neutral, ...poseArms('P01', YOU2, g, u)} as FigPose, t, YOU2.seed);
  } else {
    const m = layerMotion({person: YOU2, motion: 'idle-breathe', t, g, unit: u, view: vf.view as 'front' | 'left' | 'right'});
    drawFigure(p, m.def, m.g, u, {...m.pose, ...vf}, t, m.seed);
  }
};

/** Camera on a 3 m circle about her, eye 1.5 m, looking at her; one full turn, eased at both ends. */
export const orbitCam = (f: number): YCam => {
  const u = f / (ORBIT360_FRAMES - 1), e = u < 0.08 ? (u * u) / 0.16 : u > 0.92 ? 1 - ((1 - u) ** 2) / 0.16 : u - 0.04;
  return orbitYCam([0, 0, 0], 3.0, (e / 0.92) * Math.PI * 2, 1.5, 900, 880);
};

export const Orbit360 = () => {
  const f = useCurrentFrame();
  const fn = useCallback(({brush}: PaintContext) => {
    const c = orbitCam(f);
    const t = f / FPS;
    const p = makePainter(brush, {t, frame: f, fade: PAPER});
    paintSky(p, c);
    paintGround(p, c);
    const you: Item = {at: [0, 0, 0], draw: (q, cc) => paintYou(q, cc, t)};
    // Painter's order, far to near; the near-plane clip in `poly` drops whatever is behind the lens.
    [...SET, you].map((it) => ({it, d: dist(c, it.at)})).sort((a, b) => b.d - a.d).forEach((o) => o.it.draw(p, c));
  }, [f]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={fn} paper={PAPER} />
      <StateGrade state="empty" />
      <Grain opacity={0.1} />
    </AbsoluteFill>
  );
};

// Shared with the SET45 spike (Set45.tsx): the crossroads set, sky and ground.
export {SET, paintGround, paintSky, type Item};
