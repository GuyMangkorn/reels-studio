import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {flatCircle} from '../kit/world';
import type {Pool31} from './overlay31';
import {BROKEN_CAM, paintLemonHalf, printCorners, REVEAL} from './set31';
import type {Probe31} from './shot';

// EDU-EP31-SHORT Space R plate helpers (Boss W5.2 batch 2, 2026-11-21): the reveal-table values B07-SH01..SH03 share (brief set plan R, SCENE-R1
// b07): LF07's lamp pool as a world point, the probe of every table item for the headless measure, and the lemon half that rocks and tips onto
// its cut face (B07-SH03, `new: lemon-half-tip`). React-free.

/** LF07's lamp pool (picture (330, 560), r 720 px at its camera C07) as a world point on the table and a radius in metres. */
export const POOL_AT: V3 = [-0.066, 0, -0.036];
export const revealPool = (c: YCam, op = 0.42): Pool31 | null => {
  const q = camPoint(c, POOL_AT);
  return q ? {x: q[0], y: q[1], r: 0.432 * camUnit(c, POOL_AT), color: '255,190,110', op} : null;
};
/** The broken camera's projected centre point (top face centre). */
export const CAM_CENTRE: V3 = [REVEAL.camera.c[0], BROKEN_CAM.d, REVEAL.camera.c[2]];

/** Picture spans of the table items (POLAROID, LEMON at `lemon`, CAMERA with its flash bar, PRINT, FACE on the print) for `measure-shots.ts`. */
export const probeTable = (c: YCam, pr: Probe31, lemon: V3 = REVEAL.lemon.c) => {
  const box = (name: string, pts: V3[]) => {
    const q = pts.map((v) => camPoint(c, v, 0.01)).filter(Boolean) as Pt[];
    if (q.length) pr.lead(name, {top: Math.min(...q.map((v) => v[1])), bottom: Math.max(...q.map((v) => v[1])), left: Math.min(...q.map((v) => v[0])), right: Math.max(...q.map((v) => v[0])), x: q.reduce((a, v) => a + v[0], 0) / q.length});
  };
  const P = REVEAL.polaroid, [px, , pz] = P.c;
  box('POLAROID', [[px - P.w / 2, 0, pz - P.h / 2], [px + P.w / 2, 0, pz - P.h / 2], [px + P.w / 2, 0, pz + P.h / 2], [px - P.w / 2, 0, pz + P.h / 2]]);
  const r = REVEAL.lemon.r;
  box('LEMON', Array.from({length: 16}, (_, i) => [lemon[0] + Math.cos(i / 16 * 6.283) * r, lemon[1], lemon[2] + Math.sin(i / 16 * 6.283) * r] as V3));
  const C = REVEAL.camera.c, {w, h} = BROKEN_CAM;
  box('CAMERA', [[C[0] - w / 2, BROKEN_CAM.d, C[2] - h / 2], [C[0] + w / 2 + 0.07, 0, C[2] - h / 2], [C[0] + w / 2, BROKEN_CAM.d, C[2] + h / 2], [C[0] - w / 2, 0, C[2] + h / 2]]);
  box('PRINT', printCorners());
  const R = REVEAL.print, f = camPoint(c, [R.c[0], 0, R.c[2] - R.h * 0.12]); // the CCTV face about 12 % above the print centre (pos 50% 30%)
  if (f) pr.lead('FACE', {top: f[1], bottom: f[1], x: f[0]});
};

/** Rotation about the z axis (row-major 3x3) that turns +y toward +x by `a` rad: a positive tip rolls the cut face toward +x. */
const rotZ = (a: number) => { const c = Math.cos(a), s = Math.sin(a); return [c, s, 0, -s, c, 0, 0, 0, 1]; };
/** Rotation about the x axis by `a` rad. */
const rotX = (a: number) => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, -s, 0, s, c]; };
const mul = (m: number[], n: number[]) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => m[i * 3] * n[j] + m[i * 3 + 1] * n[3 + j] + m[i * 3 + 2] * n[6 + j]));
const apply = (m: number[], [x, y, z]: V3): V3 => [m[0] * x + m[1] * y + m[2] * z, m[3] * x + m[4] * y + m[5] * z, m[6] * x + m[7] * y + m[8] * z];

/** `new: lemon-half-tip`: the reveal lemon half (cut face centre `at`, radius `r`) rocked by `rock` rad about the x axis and tipped by `tip` rad
 *  about the z axis (0 = cut side up, PI = cut side down, rind up), on a still table. Rigid: the cut face and its segments are painted through
 *  the camera with a body pre-transform about the contact pivot; past 90 degrees the cut face turns away and the rind dome shows. The contact
 *  shadow stays on the table. */
export const paintLemonTip = (p: Painter, c: YCam, seed: number, at0: V3, r: number, rock: number, tip: number) => {
  const at: V3 = [at0[0], at0[1] + (r / 4) * (1 - Math.cos(tip)), at0[2]]; // the roll lifts the half so it ends resting on its cut face
  const sh = flatCircle(c, [at[0] + r * 0.35 + r * 0.25 * Math.sin(Math.min(tip, Math.PI / 2)), 0.0005, at[2] + r * 0.3], r * 1.15, 24);
  if (sh.length > 2) washAt(p, seed, '#120c07', 120, sh, 0.25, 0.1);
  const m = mul(rotZ(tip), rotX(rock));
  const pivot: V3 = [at[0], at[1] - r * 0.5, at[2]];
  if (Math.cos(tip) > 0.05) {
    paintLemonHalf(p, {...c, body: {o: pivot, m}}, seed + 1, at, r, {shadow: false});
    return;
  }
  // rind dome toward the lens: the cut face centre moved by the rotation, the dome bulging along the rotated -normal
  const ctr = apply(m, [at[0] - pivot[0], at[1] - pivot[1], at[2] - pivot[2]]), C: V3 = [pivot[0] + ctr[0], pivot[1] + ctr[1], pivot[2] + ctr[2]];
  const n = apply(m, [0, 1, 0]), top: V3 = [C[0] - n[0] * r, C[1] - n[1] * r, C[2] - n[2] * r];
  const g = camPoint(c, C), gt = camPoint(c, top);
  if (!g || !gt) return;
  const u = camUnit(c, C) * r, k = Math.min(1, Math.hypot(gt[0] - g[0], gt[1] - g[1]) / u) * 0.18, x = g[0] + (gt[0] - g[0]) * k, y = g[1] + (gt[1] - g[1]) * k;
  // the dome's silhouette from above: the sphere outline about the cut-face centre (radius r); the dome top (gt) carries the light
  const cap = ell(g[0], g[1], u, u, 28);
  hardFill(p, seed + 2, '#d9a90c', cap);
  hardFill(p, seed + 3, '#f2cd1c', ell(x - u * 0.06, y - u * 0.06, u * 0.86, u * 0.84, 24)); // lit dome, shade rim away from the lamp (upper left)
  hardFill(p, seed + 4, '#f8e04a', ell(x - u * 0.2, y - u * 0.2, u * 0.5, u * 0.44, 18));
  hardFill(p, seed + 5, '#fffbe6', ell(x - u * 0.36, y - u * 0.34, u * 0.14, u * 0.09, 10, -0.6));
  for (let i = 0; i < 7; i++) { const a = i * 0.9; hardFill(p, seed + 10 + i, '#e3b20e', ell(x + Math.cos(a) * u * 0.55, y + Math.sin(a) * u * 0.5, u * 0.035, u * 0.035, 6)); } // rind pores
  inkLine(p, seed + 6, cap, {closed: true, weight: 0.6, color: '#8a6a10'});
};
