import {blob, clipHalf, ell, hardFill, inkLine, INK, washAt} from './draw';
import {paintHalo} from './fog';
import {hash} from './hash';
import {mixColor, type Painter, type Pt} from './painter';

// KIT `cat-face-close` (CATFACE; brief EDU-EP06-BRIEF-R1.2 N2, VD18). Written by Film as look-frame code (EDU-EP06 W3, CF1-CF3,
// LF02); the user picked style CFa (painted, soft fur; 2026-11-07) and Boss hardened it here (W5.2): one style, no `style`
// argument. Painted head of `cat-orange-tabby` (kit colours and tabby pattern) at close scale.
// Set units: 1 set-m ~ 1 cm (the EP02 EYE convention). Head frame: origin at the skull centre, +x the cat's left (screen right when
// it faces the lens), +y up, +z out of the face. The head is an ellipsoid (A 4.5 wide, B 3.7 tall, C 3.6 deep) with a muzzle bulge;
// features sit on its surface and turn with `yaw`/`roll`; the camera looks down -z from `r` (orbit yaw `camYaw`).
// Controls (0..1 unless noted): lid (0 open, 0.58 the half-close, 1 shut), pupil (0.35 relaxed slit-oval, 0.9 wide round), ears (0 up
// and forward, 1 flat sideways), whiskers (0 relaxed drooping, 1 stiff forward fan), yaw deg (-60 turned away to screen left .. +20),
// roll deg, gaze [x, y] (eye look offset), brow (0 neutral, 1 relaxed: the forehead fur smooths with soft lids).

export const CAT = {coat: '#e09a4c', dark: '#b8632a', light: '#f4d6aa', eye: '#c9a43a', nose: '#d98c84', inner: '#e8a89a', lid: '#3a2214'} as const;
/** `lid` may be one number or [screen-left, screen-right] eyes. */
export type CatFace = {lid: number | [number, number]; pupil: number; ears: number; whiskers: number; yaw: number; roll?: number; gaze?: Pt; brow?: number};
export type CatCam = {r: number; f: number; hy: number; cx?: number; camYaw?: number};
export type CatLight = {warm?: number; halo?: number; motes?: number; /** `glare-repaint` state 0..1 (kit/glare.ts): cool key, hard brow shadow. */ glare?: number; t: number};
type V = [number, number, number];
const A = 4.5, B = 3.7, C = 3.6, DEG = Math.PI / 180;
/** Front-surface point of the head over (x, y), lifted along z (muzzle, pads). */
const surf = (x: number, y: number, lift = 0): V => {
  const d = 1 - (x / A) ** 2 - (y / B) ** 2;
  return [x, y, C * Math.sqrt(Math.max(0, d)) + lift];
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerpV = (a: V, b: V, u: number): V => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];

export const paintCatFace = (p: Painter, cam: CatCam, s: CatFace, L: CatLight) => {
  const fill = (seed: number, color: string, pts: Pt[]) => hardFill(p, seed, color, pts);
  const yaw = s.yaw * DEG, roll = (s.roll ?? 0) * DEG, cy0 = Math.cos(yaw), sy0 = Math.sin(yaw), cr = Math.cos(roll), sr = Math.sin(roll);
  const cyaw = (cam.camYaw ?? 0) * DEG;
  /** Head frame -> camera frame (head yaw about y, roll about z, then the camera orbit). */
  const toCam = ([x, y, z]: V): V => {
    let X = x * cy0 + z * sy0, Z = -x * sy0 + z * cy0;
    const Y0 = y;
    const X1 = X * cr - Y0 * sr, Y1 = X * sr + Y0 * cr;
    X = X1 * Math.cos(cyaw) - Z * Math.sin(cyaw); Z = X1 * Math.sin(cyaw) + Z * Math.cos(cyaw);
    return [X, Y1, Z];
  };
  const pr = (v: V): Pt => { const [X, Y, Z] = toCam(v), d = Math.max(1, cam.r - Z); return [540 + (cam.cx ?? 0) + (cam.f * X) / d, cam.hy - (cam.f * Y) / d]; };
  /** Does the surface at head point v face the camera (ellipsoid normal)? */
  const facing = (v: V) => toCam([v[0] / A ** 2, v[1] / B ** 2, v[2] / C ** 2])[2] > 0.004;
  const px = (cm: number) => (cam.f * cm) / cam.r;
  const P = (pts: V[]) => pts.map(pr);
  const ribbon = (pts: V[], w: (f: number) => number): Pt[] => {
    const q = P(pts), Lf: Pt[] = [], Rt: Pt[] = [];
    q.forEach((v, i) => {
      const a = q[Math.max(0, i - 1)], b = q[Math.min(q.length - 1, i + 1)], dl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const nx = -(b[1] - a[1]) / dl, ny = (b[0] - a[0]) / dl, ww = px(w(i / (q.length - 1)));
      Lf.push([v[0] + nx * ww, v[1] + ny * ww]); Rt.push([v[0] - nx * ww, v[1] - ny * ww]);
    });
    return [...Lf, ...Rt.reverse()];
  };
  const warm = L.warm ?? 1;
  const coat = mixColor(CAT.coat, '#ffcf8a', 0.12 * warm), dark = CAT.dark, light = mixColor(CAT.light, '#fff1cf', 0.15 * warm);

  // ------------------------------------------------ background: the lamp-lit room, out of focus
  hardFill(p, 9000, '#4a3a34', [[-200, -200], [1300, -200], [1300, 2200], [-200, 2200]]);
  washAt(p, 9001, '#6a5446', 110, blob(9001, 160, 520, 560, 700, 0), 0.9, 0.4);
  washAt(p, 9002, '#3a3f5c', 120, blob(9002, 1040, 700, 460, 950, 0), 0.9, 0.4);
  paintHalo(p, {x: 120, y: 420, r: 520, color: '#ffcf8a', level: 0.3 * warm, t: L.t, seed: 9003});
  [[260, 260, 60], [900, 420, 44], [960, 300, 30], [120, 900, 50], [780, 180, 36]].forEach(([x, y, r], i) =>
    washAt(p, 9010 + i, i % 2 ? '#c9b48a' : '#ffd9a0', 70, ell(x, y, r, r, 16), 0.2, 0.2));

  // ------------------------------------------------ chest and shoulders below the head (no empty black at the bottom)
  // the body sits behind and below the head: chest about a head wide, widening to the forelegs and haunches at the frame bottom
  const sx = px(Math.sin(yaw) * 1.2), top = cam.hy + px(2.2);
  const X = (cm: number) => 540 + sx + px(cm), Y = (cm: number) => top + px(cm);
  // silhouette: neck under the head, a shoulder bulge, then the forelegs and haunches widening to the frame bottom
  const bodyL: Pt[] = [[X(-4.4), Y(0)], [X(-5.6), Y(2.5)], [X(-6.2), Y(5.5)], [X(-6.0), Y(9)], [X(-6.6), 2100]];
  const bodyR: Pt[] = bodyL.map(([x, y]): Pt => [2 * (540 + sx) - x, y]).reverse();
  fill(9020, coat, [...bodyL, ...bodyR]);
  // pale bib: fluffy at the top under the chin, narrowing down the chest between the forelegs
  const bib: Pt[] = [];
  for (let i = 0; i <= 12; i++) { const a = Math.PI * (i / 12); bib.push([X(-Math.cos(a) * 3.0), Y(0.4 - Math.sin(a) * 0.5 + (i % 2) * 0.35)]); }
  const bibSide = (sd: number): Pt[] => Array.from({length: 9}, (_, i): Pt => { const f = i / 8, x = lerp(2.9, 1.4, f ** 0.8) + (i % 2) * 0.35; return [X(sd * x), Y(lerp(0.6, 8.5, f))]; });
  const bibDown: Pt[] = [...bibSide(1), [X(1.3), 2100], [X(-1.3), 2100], ...bibSide(-1).reverse()];
  fill(9021, light, [...bib, ...bibDown]);
  // forelegs: two columns from the chest down, a soft shade between them and an ink line on the inner edges
  for (const sd of [-1, 1]) {
    const leg: Pt[] = [[X(sd * 1.3), Y(6.5)], [X(sd * 4.6), Y(7.5)], [X(sd * 4.4), 2100], [X(sd * 1.2), 2100]];
    void leg;
    inkLine(p, 9026 + (sd > 0 ? 1 : 0), [[X(sd * 1.5), Y(8.5)], [X(sd * 1.35), 2000]], {weight: 1.0, color: mixColor(dark, INK, 0.3), closed: false});
  }
  for (let k = 0; k < 2; k++) { // two soft stripes wrapping the shoulders, low contrast
    const y = top + px(3.0 + 2.6 * k);
    for (const sd of [-1, 1]) washAt(p, 9030 + k * 2 + (sd > 0 ? 1 : 0), dark, 80, ribbonFlat([[540 + sx + sd * px(6.6 + 0.6 * k), y + px(1.2)], [540 + sx + sd * px(5.4 + 0.5 * k), y + px(0.2)], [540 + sx + sd * px(4.0), y]], px(0.3)), 0.4, 0.3);
  }
  washAt(p, 9040, '#2a1a12', 70, blob(9040, 540 + sx + px(5.5), top + px(8), px(3), px(9), 0), 0.6, 0.3); // shadow side of the body

  // ------------------------------------------------ ears (far one first when turned)
  const ear = (sd: 1 | -1) => {
    const e = s.ears;
    const b0: V = surf(sd * 1.6, 3.0), b1: V = surf(sd * 3.9, 1.6);
    const tipUp: V = [sd * 3.2, 5.9, 0.9], tipFlat: V = [sd * 6.4, 2.9, -0.4];
    const tip = lerpV(tipUp, tipFlat, e), mid0 = lerpV(b0, tip, 0.5), mid1 = lerpV(b1, tip, 0.5);
    const outer = P([b0, [mid0[0] - sd * 0.15, mid0[1] + 0.2, mid0[2]], tip, [mid1[0] + sd * 0.25, mid1[1], mid1[2]], b1]);
    fill(9100 + (sd > 0 ? 10 : 0), coat, outer);
    inkLine(p, 9101 + (sd > 0 ? 10 : 0), outer, {weight: 1.1, color: mixColor(dark, INK, 0.4), closed: false, curve: 0.2});
    // inner ear: pink, less of it as the ear flattens and turns its opening away
    const inA = 1 - 0.75 * e, c0 = lerpV(b0, b1, 0.5);
    const inner = P([lerpV(b0, c0, 0.35), lerpV(tip, c0, 0.18), lerpV(b1, c0, 0.35), lerpV(c0, tip, 0.05)]);
    if (inA > 0.05) washAt(p, 9102 + (sd > 0 ? 10 : 0), CAT.inner, 210 * inA, inner, 0.15, 0.3);
  };
  // yaw < 0 turns the face to screen left, so the screen-right ear (+x) swings toward the lens and is the near one
  const nearSd: 1 | -1 = s.yaw < 0 ? 1 : -1;
  ear((-nearSd) as 1 | -1);

  // ------------------------------------------------ head silhouette: ellipsoid + cheek ruff + muzzle
  const sil: Pt[] = [];
  for (let i = 0; i < 40; i++) for (let j = 0; j < 9; j++) {
    const th = (i / 40) * 2 * Math.PI, ph = -Math.PI / 2 + (j / 8) * Math.PI;
    sil.push(pr([A * Math.cos(ph) * Math.sin(th) * (j >= 2 && j <= 4 ? 1.1 : 1), B * Math.sin(ph), C * Math.cos(ph) * Math.cos(th)]));
  }
  for (const sd of [-1, 1]) sil.push(pr([sd * 4.9, -1.2, 1.2]), pr([sd * 4.3, -2.3, 1.5]));
  sil.push(pr(surf(0, -2.6, 0.6)), pr(surf(-1.2, -2.2, 0.8)), pr(surf(1.2, -2.2, 0.8)));
  const head = hull(sil);
  fill(9200, coat, head);
  // cheek ruff tufts on the silhouette (fur, not a smooth egg)
  for (let k = 0; k < 14; k++) {
    const sd = k < 7 ? -1 : 1, f = (k % 7) / 6, y = lerp(0.6, -2.6, f), x = sd * (lerp(4.6, 3.6, f) + 0.5);
    const a = pr([x - sd * 0.9, y + 0.3, 1.0]), b = pr([x + sd * 0.25, y - 0.5, 1.0]), c = pr([x - sd * 0.9, y - 0.6, 1.2]);
    fill(9210 + k, f > 0.6 ? light : coat, [a, b, c]);
  }

  // ------------------------------------------------ light: warm key from screen left; shadow side to the right
  const soft = (seed: number, color: string, op: number, cx: number, cyy: number, rx: number, ry: number, n = 4) => {
    for (let k = 0; k < n; k++) { const g = 1 - k / (n + 1); washAt(p, seed + k, color, op / n, clipPoly(ell(cx, cyy, rx * g, ry * g, 24), head), 0.5, 0.25); }
  };
  const sR = pr([3.6, -0.2, 1.5]), sL = pr([-3.4, 0.8, 2]);
  soft(9250, '#7a3a1a', 120, sR[0], sR[1], px(2.8), px(4.2));
  soft(9255, '#3a3f5c', 60, sR[0] + px(1.0), sR[1], px(1.8), px(3.6));
  soft(9260, '#ffe2b0', 90 * warm, sL[0], sL[1], px(2.6), px(3.2));

  // ------------------------------------------------ tabby pattern: the M on the brow, forehead lines, cheek stripes
  const stripe = (seed: number, pts: V[], w: number, op = 190) => {
    if (!pts.every(facing)) return;
    const rb = ribbon(pts, (f) => w * Math.sin(Math.PI * (0.08 + 0.84 * f)) ** 0.7);
    washAt(p, seed, dark, op, rb, 0.12, 0.3);
  };
  const relax = s.brow ?? 0;
  // the M: two arches over the eyes meeting in the middle; the forehead lines lift and soften with tension
  const mH = 0.25 * (1 - relax);
  stripe(9300, [surf(-2.2, 1.45 + mH), surf(-1.6, 1.95 + mH), surf(-0.9, 1.6)], 0.15, 150);
  stripe(9301, [surf(0.9, 1.6), surf(1.6, 1.95 + mH), surf(2.2, 1.45 + mH)], 0.15, 150);
  stripe(9305, [surf(-0.9, 1.6), surf(-0.45, 2.05 + mH * 0.5), surf(0, 1.7)], 0.13, 140);
  stripe(9306, [surf(0, 1.7), surf(0.45, 2.05 + mH * 0.5), surf(0.9, 1.6)], 0.13, 140);
  stripe(9302, [surf(0, 2.0), surf(0, 2.7), surf(0.05, 3.4)], 0.16, 160);
  stripe(9303, [surf(-0.55, 2.4), surf(-0.6, 3.1), surf(-0.7, 3.55)], 0.16, 160);
  stripe(9304, [surf(0.55, 2.4), surf(0.6, 3.1), surf(0.7, 3.55)], 0.16, 160);
  for (const sd of [-1, 1]) {
    stripe(9310 + (sd > 0 ? 3 : 0), [surf(sd * 2.4, 0.35), surf(sd * 3.2, 0.1), surf(sd * 4.0, -0.3)], 0.18);
    stripe(9311 + (sd > 0 ? 3 : 0), [surf(sd * 2.3, -0.55), surf(sd * 3.1, -0.8), surf(sd * 3.9, -1.1)], 0.16, 160);
    stripe(9312 + (sd > 0 ? 3 : 0), [surf(sd * 3.3, 1.9), surf(sd * 3.8, 1.2), surf(sd * 4.1, 0.6)], 0.15, 130);
  }
  // fur strokes radiating from the nose (texture lives in the strokes, not the fills)
  for (let k = 0; k < 260; k++) {
    const x = -4.1 + 8.2 * hash(k * 2.31), y = -2.4 + 5.6 * hash(k * 5.77);
    if ((x / A) ** 2 + (y / B) ** 2 > 0.86) continue;
    const v0 = surf(x, y), dir = [x - 0, y + 0.8], dl = Math.hypot(dir[0], dir[1]) || 1, Lk = 0.28 + 0.25 * hash(k * 3.3);
    const v1 = surf(x + (dir[0] / dl) * Lk, y + (dir[1] / dl) * Lk);
    if (!facing(v0)) continue;
    const h = hash(k * 7.1), col = h < 0.45 ? '#f7c88a' : h < 0.8 ? mixColor(dark, '#000000', 0.1) : '#fbe6c4';
    inkLine(p.layer(0.32, 9400 + k), 9400 + k, P([v0, v1]), {weight: 0.9, color: col, closed: false});
  }

  // ------------------------------------------------ muzzle, chin, nose, mouth
  const facePart = (seed: number, color: string, op: number, cx: number, cyy: number, rx: number, ry: number, lift: number) => {
    const ring = Array.from({length: 18}, (_, i): V => surf(cx + rx * Math.cos((i / 18) * 6.283), cyy + ry * Math.sin((i / 18) * 6.283), lift));
    if (!ring.every(facing)) return;
    washAt(p, seed, color, op, P(ring), 0.15, 0.25);
  };
  facePart(9500, light, 240, 0, -2.25, 1.15, 0.6, 0.55); // chin
  facePart(9501, light, 240, -0.78, -1.45, 0.95, 0.72, 0.85); // whisker pads
  facePart(9502, light, 240, 0.78, -1.45, 0.95, 0.72, 0.85);
  facePart(9503, light, 110, -1.75, -0.05, 0.75, 0.28, 0.1); // pale fur under the eyes
  facePart(9504, light, 110, 1.75, -0.05, 0.75, 0.28, 0.1);
  facePart(9505, '#c98a50', 55, 1.05, -1.5, 0.6, 0.5, 0.9); // pad shade on the far side
  const nose = [surf(-0.5, -0.62, 1.05), surf(0.5, -0.62, 1.05), surf(0, -1.15, 1.1)];
  if (nose.every(facing)) {
    fill(9510, CAT.nose, P(nose));
    inkLine(p, 9511, P(nose), {weight: 1.0, color: '#6a3a30', curve: 0.3});
    washAt(p, 9512, '#f4c0b4', 160, P([surf(-0.25, -0.68, 1.1), surf(0.05, -0.68, 1.1), surf(-0.1, -0.85, 1.1)]), 0.1, 0.2);
  }
  const mouth = (sd: number): V[] => [surf(0, -1.15, 1.05), surf(0, -1.45, 1.0), surf(sd * 0.35, -1.72, 0.95), surf(sd * 0.75, -1.68, 0.9)];
  for (const sd of [-1, 1]) if (mouth(sd).every(facing)) inkLine(p, 9520 + sd, P(mouth(sd)), {weight: 1.1, color: '#5a3226', closed: false, curve: 0.5});
  for (let k = 0; k < 10; k++) { // whisker-pad dots
    const sd = k < 5 ? -1 : 1, i = k % 5, v = surf(sd * (0.55 + 0.28 * (i % 3)), -1.25 - 0.22 * Math.floor(i / 2), 0.9);
    if (facing(v)) { const q = pr(v); washAt(p, 9530 + k, '#b8835a', 160, ell(q[0], q[1], px(0.06), px(0.05), 8), 0.05, 0.1); }
  }

  // ------------------------------------------------ eyes
  const gz = s.gaze ?? [0, 0];
  for (const sd of [-1, 1] as const) {
    const lid = Math.max(0, Math.min(1, Array.isArray(s.lid) ? s.lid[sd < 0 ? 0 : 1] : s.lid));
    const ex = sd * 1.65, ey = 0.45, w = 0.82, hu = 0.66, hl = 0.56, slant = 0.14; // same sign on both eyes: outer corner higher on each (was * sd, which tilted both eyes the same way)
    const upH = (f: number) => hu * (1 - 0.82 * lid) * Math.sin(Math.PI * f) ** (0.75 - 0.25 * lid);
    const loH = (f: number) => -hl * (1 - 1.05 * lid) * Math.sin(Math.PI * f) ** 0.85;
    const N = 16, xs = Array.from({length: N + 1}, (_, i) => i / N);
    const xAt = (f: number) => ex - sd * w + sd * 2 * w * f; // inner corner (toward the nose) first
    const yOff = (f: number) => slant * (f - 0.5) * 2; // outer corner a little higher
    const upper = xs.map((f): V => surf(xAt(f), ey + yOff(f) + Math.max(upH(f), loH(f) + 0.04), 0.05));
    const lower = xs.map((f): V => surf(xAt(f), ey + yOff(f) + loH(f), 0.05));
    if (![...upper, ...lower].every(facing)) continue;
    const open = [...P(upper), ...P(lower).reverse()];
    // socket shadow and the dark eye rim
    washAt(p, 9600 + (sd > 0 ? 20 : 0), '#6a3a1a', 120, P(xs.map((f): V => surf(xAt(f), ey + yOff(f) + upH(f) + 0.28 * Math.sin(Math.PI * f), 0.02))).concat(P(lower).reverse()), 0.3, 0.3);
    hardFill(p, 9601 + (sd > 0 ? 20 : 0), mixColor(CAT.eye, '#5a3a10', 0.35), open);
    // iris: amber, lit lower half, then the pupil
    const ic = surf(ex + gz[0] * 0.25, ey + gz[1] * 0.2 - 0.03, 0.12), icp = pr(ic), ir = px(0.62);
    const inOpen = (q: Pt[]) => clipPoly(q, open);
    const irisQ = inOpen(ell(icp[0], icp[1], ir, ir * 1.02, 24));
    if (irisQ.length > 2) hardFill(p, 9602 + (sd > 0 ? 20 : 0), CAT.eye, irisQ);
    washAt(p, 9603 + (sd > 0 ? 20 : 0), '#f0d070', 170, inOpen(ell(icp[0], icp[1] + ir * 0.35, ir * 0.75, ir * 0.5, 18)), 0.2, 0.2);
    washAt(p, 9604 + (sd > 0 ? 20 : 0), '#7a5a10', 120, inOpen(ell(icp[0], icp[1] - ir * 0.55, ir * 0.95, ir * 0.45, 18)), 0.3, 0.2);
    const pw = ir * lerp(0.16, 0.86, Math.max(0, Math.min(1, s.pupil))), ph = ir * lerp(0.9, 0.86, s.pupil);
    const pup = inOpen(ell(icp[0], icp[1], pw, ph, 20));
    if (pup.length > 2) hardFill(p, 9605 + (sd > 0 ? 20 : 0), '#120a06', pup);
    // upper lid shadow on the eye and the catchlight (warm, from screen left)
    washAt(p, 9606 + (sd > 0 ? 20 : 0), '#2a1608', 110, inOpen([...P(upper), ...P(upper.map(([x, y, z]): V => [x, y - 0.22, z])).reverse()]), 0.2, 0.2);
    const cl = inOpen(blob(9607 + sd, icp[0] - ir * 0.35, icp[1] - ir * 0.3, ir * 0.17, ir * 0.14, 0, 10));
    if (cl.length > 2 && lid < 0.85) hardFill(p, 9607 + (sd > 0 ? 20 : 0), '#fff4dc', cl);
    // lid lines: a thick dark upper rim and a thinner lower rim (a cat's dark "eyeliner")
    inkLine(p, 9608 + (sd > 0 ? 20 : 0), P(upper), {weight: 2.4, color: CAT.lid, closed: false, curve: 0.3});
    inkLine(p, 9609 + (sd > 0 ? 20 : 0), P(lower), {weight: 1.4, color: CAT.lid, closed: false, curve: 0.3});
    // fur of the upper lid catching the light as it closes (soft, content), a cheek lift under the lower lid
    if (lid > 0.2) washAt(p, 9610 + (sd > 0 ? 20 : 0), '#f7c88a', 90 * lid, P([...upper, ...upper.slice().reverse().map(([x, y, z]): V => [x, y + 0.25, z])]), 0.2, 0.3);
    // tear-line mark at the inner corner (tabby "mascara" line running down from the outer corner)
    stripe(9611 + (sd > 0 ? 20 : 0), [surf(ex + sd * w * 1.02, ey + slant + 0.05), surf(ex + sd * (w + 0.6), ey - 0.15), surf(ex + sd * (w + 1.2), ey - 0.45)], 0.12, 220);
  }

  // ------------------------------------------------ whiskers: relaxed (drooping, out to the side) -> stiff (fanned forward)
  const wk = s.whiskers;
  for (const sd of [-1, 1] as const) for (let k = 0; k < 5; k++) {
    const root: V = surf(sd * (0.95 + 0.12 * k), -1.25 - 0.2 * k, 0.95);
    if (!facing(root)) continue;
    const fan = (k - 2) * lerp(0.16, 0.26, wk);
    const dir: V = [sd * lerp(1, 0.78, wk), lerp(-0.32, 0.05, wk) + fan, lerp(0.15, 0.62, wk)];
    const Lw = 4.4 + 0.6 * hash(k + sd * 3), sag = lerp(0.9, 0.15, wk);
    const pts: V[] = [0, 0.33, 0.66, 1].map((f): V => [root[0] + dir[0] * Lw * f, root[1] + dir[1] * Lw * f - sag * f * f, root[2] + dir[2] * Lw * f]);
    inkLine(p, 9700 + k + (sd > 0 ? 10 : 0), P(pts), {weight: 1.25, color: '#fbf6ea', closed: false, curve: 0.5});
  }
  for (const sd of [-1, 1] as const) for (let k = 0; k < 2; k++) { // brow whiskers
    const root = surf(sd * (1.3 + 0.4 * k), 1.35, 0.1), tip: V = [root[0] + sd * 1.4, root[1] + 2.0 - 0.3 * k, root[2] + 0.6];
    if (facing(root)) inkLine(p, 9730 + k + (sd > 0 ? 2 : 0), P([root, lerpV(root, tip, 0.5), tip]), {weight: 0.9, color: '#fbf2e2', closed: false, curve: 0.4});
  }

  // near ear last, over the head
  ear(nearSd);
  inkLine(p, 9201, head.filter((q) => q[1] > pr([0, 1.5, 0])[1]), {weight: 0.9, color: mixColor(dark, INK, 0.35), closed: false, curve: 0.3});

  // ------------------------------------------------ the glow pass (LF02): a warm halo bloom at the eyes + motes drifting to screen left
  if ((L.halo ?? 0) > 0) {
    const mid = pr(surf(0, 0.45, 0.2));
    // level 0.7 keeps the halo core at ~0.3 alpha (77/255), the brief's glow cap
    paintHalo(p, {x: mid[0], y: mid[1], r: px(6.5), color: '#ffd9a0', level: Math.min(0.7, L.halo ?? 0), squash: 0.55, t: L.t, seed: 9800});
  }
  if ((L.motes ?? 0) > 0) for (let k = 0; k < 7; k++) {
    const u = (L.motes ?? 0) * (0.6 + 0.4 * hash(k * 2.1)), x0 = 540 + px(1.5 * (hash(k) - 0.5)), y0 = cam.hy - px(0.2) + px(1.2 * (hash(k * 3.3) - 0.5));
    const x = x0 - px(1.2) - u * (420 + 260 * hash(k * 5.1)), y = y0 - u * 90 * (hash(k * 7.7) - 0.3), r = 12 + 14 * hash(k * 9.9);
    washAt(p, 9810 + k, '#ffe2b0', 60, ell(x, y, r * 2.2, r * 2.2, 14), 0.6, 0.1);
    washAt(p, 9820 + k, '#fff1cf', 170 * (1 - 0.4 * u), ell(x, y, r, r, 12), 0.3, 0.1);
  }
};

const ribbonFlat = (q: Pt[], w: number): Pt[] => {
  const Lf: Pt[] = [], Rt: Pt[] = [];
  q.forEach((v, i) => {
    const a = q[Math.max(0, i - 1)], b = q[Math.min(q.length - 1, i + 1)], dl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const ww = w * Math.sin(Math.PI * (0.1 + (0.8 * i) / (q.length - 1)));
    Lf.push([v[0] - ((b[1] - a[1]) / dl) * ww, v[1] + ((b[0] - a[0]) / dl) * ww]); Rt.push([v[0] + ((b[1] - a[1]) / dl) * ww, v[1] - ((b[0] - a[0]) / dl) * ww]);
  });
  return [...Lf, ...Rt.reverse()];
};
const hull = (pts: Pt[]): Pt[] => {
  const q = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const v of q) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], v) <= 0) lo.pop(); lo.push(v); }
  for (const v of q.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], v) <= 0) up.pop(); up.push(v); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
/** Clip polygon q to a polygon `clipTo` (Sutherland-Hodgman against each edge; the eye opening is convex enough). */
const clipPoly = (q: Pt[], clipTo: Pt[]): Pt[] => {
  let out = q;
  const n = clipTo.length;
  // orientation of the clip polygon
  let area = 0;
  for (let i = 0; i < n; i++) { const a = clipTo[i], b = clipTo[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; }
  const sgn = area > 0 ? 1 : -1;
  for (let i = 0; i < n && out.length; i++) {
    const a = clipTo[i], b = clipTo[(i + 1) % n];
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) continue;
    const side = (v: Pt) => sgn * ((b[0] - a[0]) * (v[1] - a[1]) - (b[1] - a[1]) * (v[0] - a[0]));
    const res: Pt[] = [];
    for (let j = 0; j < out.length; j++) {
      const P0 = out[j], P1 = out[(j + 1) % out.length], s0 = side(P0), s1 = side(P1);
      if (s0 >= 0) res.push(P0);
      if ((s0 >= 0) !== (s1 >= 0)) { const t = s0 / (s0 - s1); res.push([P0[0] + (P1[0] - P0[0]) * t, P0[1] + (P1[1] - P0[1]) * t]); }
    }
    out = res;
  }
  return out;
};
