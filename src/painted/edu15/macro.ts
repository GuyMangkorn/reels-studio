import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {C, lookCam} from './palette';

// SET-TOEMACRO look (brief N2, VD11; LF03 and the SP1 pad still; Film W3). Space T in MILLIMETRES: the pad surface of one ridge (lamella) is the
// plane y 0, its hairs stand along +y (110 um = 0.11 mm long, 5 um wide, packed about 8 um apart), ridges run across the frame (along x) and repeat
// every 0.5 mm in depth (z), separated by a dark trough. The camera skims over the carpet so rows run to a soft horizon; the room behind is warm
// bokeh. Hairs are drawn many and uniform (never counted); near rows are out of focus (soft, dark: the caption band sits on them).

const ridgeHairs = (k: number) => ({step: 0.0105 * (1 + k * 1.2)});
const HAIR = 0.11;

/** LF03: S01-B03-SH01 @ +80, over the hair carpet of toe 3 (camera 0.3 mm above the carpet, pitch -12 deg, before the +86 rise). */
export const camLF03: YCam = {...lookCam([0, HAIR + 0.3, 0.32], [0, HAIR, -1.1], 1000, {hy: 900}), near: 0.02};

export const paintMacroCarpet = (p: Painter, o: {t: number}): Record<string, number> => {
  const c = camLF03;
  // backdrop: warm room bokeh above the horizon, a dark warm field below it
  p.flat(mixColor(C.bokeh, '#2a2420', 0.35), [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  const horizon = camPoint(c, [0, HAIR * 0.6, -60])?.[1] ?? 700;
  washAt(p, 62000, '#8a7a62', 160, [[0, 0], [1080, 0], [1080, horizon + 40], [0, horizon + 40]], 0.3, 0.2);
  for (let i = 0; i < 16; i++) { // bokeh discs: the lamp (big, warm), the cream ceiling, a cool window
    const x = hash(62010 + i) * 1080, y = hash(62030 + i) * (horizon - 60) + 20, r = 40 + 120 * hash(62050 + i);
    const col = i === 0 ? C.halo : i % 5 === 0 ? '#9fb0c8' : i % 2 ? '#e9dcc0' : '#b9a27e';
    washAt(p, 62070 + i, col, i === 0 ? 150 : 60 + 50 * hash(62090 + i), ell(i === 0 ? 300 : x, i === 0 ? 240 : y, i === 0 ? 210 : r, i === 0 ? 210 : r, 24), 0.2, 0.15);
  }
  washAt(p, 62110, '#fff4dc', 120, ell(300, 240, 110, 110, 24), 0.2, 0.15);
  // ridges, far to near: trough (dark), the ridge's surface band, then its hairs back row to front row
  let drawn = 0;
  const R = 13;
  for (let k = R - 1; k >= 0; k--) {
    const z1 = -k * 0.5, z0 = z1 - 0.42, zt = z1 + 0.08; // band [z0, z1], trough to zt
    const d = Math.max(0.05, 0.32 - (z0 + z1) / 2), far = Math.min(1, (d - 0.4) / 5);
    const halfW = 0.06 + d * 0.58;
    const band = (y: number, a: number, b: number) => [[-halfW, y, a], [halfW, y, a], [halfW, y, b], [-halfW, y, b]].map((v) => camPoint(c, v as V3, 0.02)).filter((x): x is Pt => !!x);
    const tq = band(-0.03, z1, zt); if (tq.length > 2) hardFill(p, 62200 + k, '#1e1915', tq);
    const bq = band(0, z0, z1); if (bq.length > 2) hardFill(p, 62220 + k, mixColor('#4a3f34', '#2a2420', far), bq);
    const {step} = ridgeHairs(k);
    const rows = Math.floor((z1 - z0) / step);
    for (let r = 0; r <= rows; r++) {
      const z = z0 + r * step, dd = 0.32 - z, u = camUnit(c, [0, 0, z], 0.02);
      const blurRow = Math.max(0, Math.min(1, (0.75 - dd) / 0.45));
      const st = blurRow > 0.3 ? step * 2 : step, xs = Math.ceil(halfW / st);
      if (blurRow > 0.3 && r % 2) continue;
      const fog = Math.min(1, Math.max(0, (dd - 0.6) / 4.5));
      const blur = Math.max(0, Math.min(1, (0.75 - dd) / 0.45)); // near rows soft (out of focus)
      const colTip = mixColor(mixColor(C.hair, '#8a7a62', fog), '#5a4d40', blur * 0.65), colBase = mixColor('#6f6252', '#2a2420', Math.max(fog, blur * 0.7));
      for (let i = -xs; i <= xs; i++) {
        const id = 63000 + k * 9000 + r * 90 + i + 45;
        const x = i * st + (hash(id) - 0.5) * st * 0.7 + (r % 2) * st * 0.5;
        const lean = 0.012 + 0.006 * hash(id + 1);
        const b0 = camPoint(c, [x, 0, z], 0.02), b1 = camPoint(c, [x + 0.002, HAIR * 0.55, z + lean * 0.5], 0.02), b2 = camPoint(c, [x + 0.004, HAIR, z + lean], 0.02);
        if (!b0 || !b1 || !b2) continue;
        if (b2[0] < -40 || b2[0] > 1120 || b2[1] > 1960 || b0[1] < -40) continue;
        const w = Math.max(0.5, 0.005 * u * 0.22);
        if (blur > 0.3) { // soft near hairs: wide, translucent
          washAt(p, id, colTip, 50, [[b0[0] - w * 2.2, b0[1]], [b2[0] - w * 1.4, b2[1]], [b2[0] + w * 1.4, b2[1]], [b0[0] + w * 2.2, b0[1]]], 0.3, 0.2);
        } else {
          inkLine(p, id, [b0, b1, b2], {closed: false, weight: Math.min(3.2, w), color: colBase, still: true, curve: 0.4});
          inkLine(p, id + 4000000, [b1, b2], {closed: false, weight: Math.min(2.6, w * 0.8), color: colTip, still: true, curve: 0.4});
          if (fog < 0.35 && w > 0.9) { // tip fan glint on the lamp side
            for (let s = -1; s <= 1; s++) inkLine(p, id + 5000000 + s, [b2, [b2[0] + s * w * 2.2 - w, b2[1] - w * 1.6]], {closed: false, weight: 0.5, color: C.hairRim, still: true});
          }
        }
        drawn++;
      }
    }
  }
  // depth haze toward the horizon and a dark soft foreground (out of focus) over the caption band
  washAt(p, 62900, '#7d6e5a', 90, [[0, horizon - 20], [1080, horizon - 20], [1080, horizon + 160], [0, horizon + 160]], 0.4, 0.2);
  washAt(p, 62901, '#1d1814', 150, [[0, 1150], [1080, 1150], [1080, 1920], [0, 1920]], 0.4, 0.2);
  washAt(p, 62902, '#1d1814', 110, [[0, 1080], [1080, 1080], [1080, 1150], [0, 1150]], 0.4, 0.2);
  void o;
  return {hairs: drawn, horizonY: Math.round(horizon), pxPerMmAt0_3: Math.round(camUnit(c, [0, 0, -0.1], 0.02))};
};

/** TK5 / B03-SH01 +0: the lifted front-left foot, pad toward the lens (~420 px across, 16.8 px/mm): five splayed toes with about 15 pale transverse
 * ridges each, the palm pad, the leg leaving the top of frame; the room as warm bokeh. Screen-space macro drawing (one plane, no perspective). */
export const paintPadUnderside = (p: Painter, o: {t: number}): Record<string, number> => {
  const S = 16.8, cx = 540, cy = 760;
  p.flat('#3b332b', [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  for (let i = 0; i < 12; i++) { const x = hash(62300 + i) * 1080, y = hash(62320 + i) * 1500, r = 60 + 160 * hash(62340 + i); washAt(p, 62360 + i, i === 0 ? C.halo : i % 3 ? '#8a7a62' : '#c9b48e', i === 0 ? 140 : 70, ell(i === 0 ? 820 : x, i === 0 ? 300 : y, i === 0 ? 240 : r, i === 0 ? 240 : r, 22), 0.2, 0.15); }
  // leg (wrist) from the top of frame
  hardFill(p, 62400, C.tkShade, [[cx - 150, -10], [cx + 130, -10], [cx + 62, cy - 40], [cx - 72, cy - 40]]);
  hardFill(p, 62401, C.tkBack, [[cx - 128, -10], [cx + 100, -10], [cx + 44, cy - 60], [cx - 54, cy - 60]]);
  for (let i = 0; i < 18; i++) { const y = 40 + hash(62410 + i) * (cy - 140), x = cx - 50 + hash(62430 + i) * 90; hardFill(p, 62450 + i, i % 2 ? C.tkOrange : C.tkPale, ell(x, y, 9 + 6 * hash(62470 + i), 7, 10)); }
  // palm
  hardFill(p, 62500, mixColor(C.tkBelly, C.tkPad, 0.5), ell(cx, cy, 6.5 * S, 5.2 * S, 24));
  const toes = [-58, -29, 0, 29, 56];
  let ridges = 0;
  toes.forEach((deg, i) => {
    const a = ((deg * 1.25 + 90) * Math.PI) / 180, L = [7.6, 9.8, 10.6, 10.0, 9.0][i] * S;
    const dx = Math.cos(a), dy = Math.sin(a); // toes fan DOWN-out from the palm's lower rim (the wrist leaves the top of frame)
    const base: Pt = [cx + dx * 3.6 * S, cy + dy * 3.0 * S];
    const nx = -dy, ny = dx, W = [2.3, 3.3, 3.6, 3.5, 2.9][i] * S;
    const at = (u: number, s: number): Pt => [base[0] + dx * u * L + nx * s, base[1] + dy * u * L + ny * s];
    const wAt = (u: number) => W * (0.45 + 0.55 * Math.sin(Math.min(1, u * 1.25) * Math.PI * 0.62)) * (u > 0.88 ? 1 - (u - 0.88) * 3.5 : 1) / 2;
    const outline: Pt[] = [];
    for (let k = 0; k <= 14; k++) outline.push(at(k / 14, wAt(k / 14)));
    for (let k = 14; k >= 0; k--) outline.push(at(k / 14, -wAt(k / 14)));
    hardFill(p, 62510 + i, C.tkShade, outline.map(([x, y]) => [x + 3, y + 3] as Pt));
    hardFill(p, 62520 + i, C.tkPad, outline);
    // transverse ridges (lamellae): pale arcs across the pad with a dark line on their distal edge (about 15 per toe)
    const n = 15;
    for (let r = 0; r < n; r++) {
      const u = 0.22 + (r / n) * 0.68, w = wAt(u) * 0.92, bow = 0.2 * S;
      const pts = [at(u - bow / L, -w), at(u, 0), at(u - bow / L, w)];
      inkLine(p, 62600 + i * 20 + r, pts, {closed: false, weight: 1.6, color: C.tkRidge, still: true, curve: 0.5});
      inkLine(p, 62700 + i * 20 + r, pts.map(([x, y]) => [x + dx * 2.4, y + dy * 2.4] as Pt), {closed: false, weight: 1.1, color: '#f3f1ea', still: true, curve: 0.5});
      ridges++;
    }
    inkLine(p, 62800 + i, outline, {weight: 1.0, color: mixColor(C.tkShade, C.tkInk, 0.4), still: true});
    // tiny claw at the tip
    const tip = at(1.0, 0);
    hardFill(p, 62820 + i, '#3a3530', [[tip[0] - nx * 3, tip[1] - ny * 3], [tip[0] + dx * 8, tip[1] + dy * 8], [tip[0] + nx * 3, tip[1] + ny * 3]]);
  });
  void o;
  return {pxPerMm: S, footPx: Math.round(2 * 13 * S * 0.97), ridges};
};
