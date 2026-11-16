import {hardFill} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camSpace, type YCam} from '../kit/ycam';
import {bandPts, hn, okPoly, poly, wFlat, wShadow, wStroke} from './scenery';

// STADIUM S (EDU-EP18-BRIEF-R1 N9, VD08; Film W3 look frame LF04, 16 Nov 2026). Designed from the script before the kit: L08 compares "500
// a year" with a body-sized picture, a football stadium full to the top, people as still soft dots; flat overcast, slightly cool, quiet. No
// team colours, banners, flags, screens or captions (brief truth limit 4). An oval bowl around a 105 x 68 m pitch: a lower tier, a concourse
// with a fascia, an upper tier to 31 m, a parapet and a battered outer wall; a thin roof only over the far side's upper tier; plaza, car park,
// trees and a low city reduced to haze outside. The camera is high (user, 16 Nov 2026: aerial / crane-up so the full bowl and the dot crowd
// read from above); the pitch-down must exceed the upper rake (36.7 deg) or the near stand's seats face away from the lens.
// S: metres, origin at the centre spot, +x along the pitch length, +y up, +z across the pitch. Bowl plan: a superellipse ring (exponent
// SE) offset outward by s metres from the front row. Cost: the stands are 64 brush sectors per band; the ~48,000 seats are drawn by
// `drawCrowd` on a plain 2D canvas layer (no brush), so the dot crowd adds milliseconds, not brush polygons.

export const STADIUM = {
  haze: '#d4d9dc', ground: '#a7ab9f', plaza: '#bdbdb5', road: '#8e9090', tree: '#5b6b55', treeDark: '#46553f',
  roofTop: '#e4e6e6', roofEdge: '#9ea3a6', concrete: '#b3b1aa', concreteShade: '#8f8e88', seatBare: '#7b8189', wall: '#c4c2bb', wallShade: '#9d9b94',
  apron: '#6f7c66', grassA: '#73935e', grassB: '#688957', line: '#eef0ea', vom: '#55595d', building: '#c2c0b8', buildingShade: '#a3a199', buildingRoof: '#b0b2ae',
  roofs: ['#9a9c9a', '#a8a39a', '#8f969b', '#b3ada3', '#7f8a86'],
};
/** Crowd palette: muted mixed clothing (no team colour), slightly cool under the overcast. */
export const CROWD = ['#e6e2da', '#3b4049', '#8a4d43', '#506b8a', '#c6b48e', '#6b6c5c', '#d6c8b8', '#2f3a3c', '#9c4a40', '#7c8b9b', '#efeae2', '#5c4c5c', '#a49a8c', '#44546a'];

const SE = 2.7;
const A0 = 52.5 + 9, B0 = 34 + 7;
/** Bowl sections: s offset (m from the front row) and height (m). */
export const BOWL = {
  frontWall: {s: 0, y0: 0, y1: 2},
  lower: {s0: 0, s1: 20, y0: 2, y1: 12.5},
  concourse: {s0: 20, s1: 21.5, y: 12.5},
  fascia: {s: 21.5, y0: 12.5, y1: 15},
  upper: {s0: 21.5, s1: 43, y0: 15, y1: 31},
  rim: {s0: 43, s1: 44, y: 32},
  outer: {s: 44, sBase: 46.5},
  roof: {s0: 28, s1: 49, y: 37, th: 1.2},
};
/** Rake (deg) of a tier: the camera's pitch-down must exceed the steepest one. */
export const rake = (t: {s0: number; s1: number; y0: number; y1: number}) => (Math.atan2(t.y1 - t.y0, t.s1 - t.s0) * 180) / Math.PI;

/** Plan point of the bowl ring at parameter angle th (rad from +x toward +z), s metres outside the front row, height y. */
export const ringPt = (th: number, s: number, y: number): V3 => {
  const c = Math.cos(th), sn = Math.sin(th), e = 2 / SE;
  return [(A0 + s) * Math.sign(c) * Math.abs(c) ** e, y, (B0 + s) * Math.sign(sn) * Math.abs(sn) ** e];
};
/** Roof span: centred on the side away from the camera (azimuth az deg; camera on +z at az 0, swinging toward +x), half-width deg. */
export const roofSpan = (az: number, half = 62): [number, number] => {
  const mid = Math.atan2(-Math.cos((az * Math.PI) / 180), -Math.sin((az * Math.PI) / 180));
  return [mid - (half * Math.PI) / 180, mid + (half * Math.PI) / 180];
};

const N = 64;
const TH = (k: number) => (k / N) * Math.PI * 2;
/** Overcast sky-dome light: upward faces brighter, faces turned toward the camera a touch lighter (soft, no cast shadows). */
const skyTone = (col: string, slopeUp: number) => mixColor(col, '#f4f6f6', 0.18 * slopeUp);
const hazeAt = (c: YCam, col: string, v: V3, k = 1) => mixColor(col, STADIUM.haze, Math.min(0.85, (k * Math.max(0, camSpace(c, v).d - 120)) / 900));

/** Draw a band of ring sectors from (s0, y0) to (s1, y1), back sectors first. */
const ringBand = (p: Painter, c: YCam, seed: number, col: string, s0: number, y0: number, s1: number, y1: number, up: number, o: {skip?: (th: number) => boolean; vary?: number} = {}) => {
  const order = Array.from({length: N}, (_, k) => k).sort((a, b) => camSpace(c, ringPt(TH(b + 0.5), s1, y1)).d - camSpace(c, ringPt(TH(a + 0.5), s1, y1)).d);
  for (const k of order) {
    const a = TH(k), b = TH(k + 1);
    if (o.skip?.((a + b) / 2)) continue;
    const q = poly(c, [ringPt(a, s0, y0), ringPt(b, s0, y0), ringPt(b, s1, y1), ringPt(a, s1, y1)]);
    if (!okPoly(q)) continue;
    const tone = mixColor(skyTone(col, up), '#6a6e72', (o.vary ?? 0.05) * hn(seed + k));
    hardFill(p, seed + k, hazeAt(c, tone, ringPt((a + b) / 2, s1, y1)), q);
  }
};

const inSpan = (th: number, [a, b]: [number, number]) => {
  const w = (x: number) => ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return w(th - a) <= w(b - a);
};

/** Ground outside the bowl: haze-graded ground, ring road, car park, trees and a low city of boxes fading into the haze. */
const paintSurrounds = (p: Painter, c: YCam) => {
  // ground graded by depth in picture bands (the far city is haze, no horizon in frame at this pitch)
  for (let y = -40; y < 1960; y += 80) {
    const v = groundAt(c, y + 40);
    hardFill(p, 81000 + y, v ? hazeAt(c, STADIUM.ground, v, 1.3) : STADIUM.haze, bandPts(y, y + 82));
  }
  // ring road and plaza around the bowl
  const loop = (s: number) => Array.from({length: 73}, (_, k) => ringPt((k / 72) * Math.PI * 2, s, 0));
  const ring = (s0: number, s1: number, col: string, seed: number) => {
    for (let k = 0; k < 72; k++) {
      const a = (k / 72) * Math.PI * 2, b = ((k + 1) / 72) * Math.PI * 2;
      wFlat(p, c, seed + k, hazeAt(c, col, ringPt(a, s1, 0)), [ringPt(a, s0, 0), ringPt(b, s0, 0), ringPt(b, s1, 0), ringPt(a, s1, 0)]);
    }
  };
  ring(60, 72, STADIUM.road, 81500);
  ring(44, 60, STADIUM.plaza, 81600);
  wStroke(p, c, 81700, loop(66), mixColor(STADIUM.road, '#e8e8e2', 0.5), 0.5);
  // car-park bays: dashed rows on the plaza's two long sides
  for (const side of [-1, 1]) for (let r = 0; r < 3; r++) for (let k = 0; k < 26; k++) {
    const x = -75 + k * 6, z = side * (B0 + 47 + r * 4);
    wStroke(p, c, 81800 + side * 400 + r * 40 + k, [[x, 0.02, z - 1.6], [x, 0.02, z + 1.6]], mixColor(STADIUM.plaza, '#f2f2ee', 0.6), 0.4);
  }
  // tree clumps on the plaza edge and outside the ring road
  for (let k = 0; k < 90; k++) {
    const th = (k / 90) * Math.PI * 2 + hn(82000 + k) * 0.05, s = k % 2 ? 56 + 3 * hn(82100 + k) : 76 + 6 * hn(82200 + k);
    tree(p, c, 82300 + k * 3, ringPt(th, s, 0), 2.6 + 1.6 * hn(82400 + k));
  }
  // low city blocks beyond, far to near
  const blocks: {x: number; z: number; w: number; d: number; h: number; k: number}[] = [];
  for (let i = -12; i <= 12; i++) for (let j = -12; j <= 12; j++) {
    const k = (i + 12) * 25 + (j + 12), x = i * 34 + (hn(83000 + k) - 0.5) * 8, z = j * 34 + (hn(83100 + k) - 0.5) * 8;
    if (((x / (A0 + 90)) ** 2 + (z / (B0 + 90)) ** 2) < 1.05) continue;
    blocks.push({x, z, w: 14 + 12 * hn(83200 + k), d: 12 + 12 * hn(83300 + k), h: 6 + 18 * hn(83400 + k) ** 2, k});
  }
  blocks.filter((b) => { const q = camPoint(c, [b.x, 0, b.z]); return q && q[0] > -260 && q[0] < 1340 && q[1] > -400 && q[1] < 2300; })
    .sort((a, b) => camSpace(c, [b.x, 0, b.z]).d - camSpace(c, [a.x, 0, a.z]).d)
    .forEach((b) => { building(p, c, 84000 + b.k * 4, b); if (hn(85500 + b.k) < 0.45) tree(p, c, 86000 + b.k * 3, [b.x + b.w / 2 + 3, 0, b.z + (hn(b.k) - 0.5) * b.d], 3 + 2 * hn(b.k + 9)); });
};

/** Ground point (y 0) seen at picture row y on the frame's centre column, or null above the horizon. */
const groundAt = (c: YCam, y: number): V3 | null => {
  const pitch = c.pitch ?? 0, v = (c.hy - y) / c.f;
  // ray in camera space (r 0, u v, d 1) -> world (yaw, pitch)
  const cs = Math.cos(pitch), sn = Math.sin(pitch);
  const uW = v * cs + sn, dW = cs - v * sn;
  if (uW >= -1e-4) return null;
  const t = -c.y / uW, dist = t * dW;
  return [c.x + dist * Math.sin(c.yaw), 0, c.z - dist * Math.cos(c.yaw)];
};

const tree = (p: Painter, c: YCam, seed: number, at: V3, r: number) => {
  const q = camPoint(c, [at[0], r * 0.9, at[2]]);
  if (!q) return;
  const px = (c.f * r) / Math.max(1, camSpace(c, at).d);
  if (px < 1.5) return;
  const g = camPoint(c, at);
  if (g) hardFill(p.layer(0.3, seed), seed, '#4a4e4a', ellPts(g[0] + px * 0.3, g[1], px * 1.05, px * 0.5));
  hardFill(p, seed + 1, hazeAt(c, STADIUM.treeDark, at), ellPts(q[0], q[1], px, px * 0.85));
  hardFill(p, seed + 2, hazeAt(c, STADIUM.tree, at), ellPts(q[0] - px * 0.2, q[1] - px * 0.25, px * 0.62, px * 0.5));
};
const ellPts = (cx: number, cy: number, rx: number, ry: number, n = 12): Pt[] => Array.from({length: n}, (_, k) => [cx + rx * Math.cos((k / n) * 6.283), cy + ry * Math.sin((k / n) * 6.283)] as Pt);

const building = (p: Painter, c: YCam, seed: number, b: {x: number; z: number; w: number; d: number; h: number}) => {
  const x0 = b.x - b.w / 2, x1 = b.x + b.w / 2, z0 = b.z - b.d / 2, z1 = b.z + b.d / 2, h = b.h, at: V3 = [b.x, 0, b.z];
  const face = (pts: V3[], col: string, k: number) => wFlat(p, c, seed + k, hazeAt(c, mixColor(col, '#8a8f93', 0.25 * hn(seed)), at, 1.8), pts);
  // soft overcast contact shadow (the EP18 papercut drop shadow, no sun direction), the two walls facing the camera, then the roof
  wShadow(p, c, seed + 7, [[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]], Math.min(10, 2 + (c.f * h) / Math.max(1, camSpace(c, at).d) * 0.15), 0.22);
  const cx = c.x > b.x ? x1 : x0, cz = c.z > b.z ? z1 : z0;
  face([[x0, 0, cz], [x1, 0, cz], [x1, h, cz], [x0, h, cz]], STADIUM.building, 0);
  face([[cx, 0, z0], [cx, 0, z1], [cx, h, z1], [cx, h, z0]], STADIUM.buildingShade, 1);
  face([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]], STADIUM.roofs[Math.floor(hn(seed + 5) * STADIUM.roofs.length)], 2);
  // window rows on the lit wall and a roof parapet line, only where the building is big enough to carry them
  const px = (c.f * b.w) / Math.max(1, camSpace(c, at).d);
  if (px > 40) {
    const ink = hazeAt(c, '#8c8f92', at, 1.8);
    for (let fl = 3; fl < h - 1; fl += 3) wStroke(p, c, seed + 10 + fl, [[x0 + 1, fl, cz], [x1 - 1, fl, cz]], ink, 0.35);
    wStroke(p, c, seed + 9, [[x0, h + 0.05, z0], [x1, h + 0.05, z0], [x1, h + 0.05, z1], [x0, h + 0.05, z1], [x0, h + 0.05, z0]], hazeAt(c, '#d8d8d2', at, 1.8), 0.4);
  }
};

/** The pitch: apron, mown stripes, white lines, goals. */
const paintPitch = (p: Painter, c: YCam) => {
  const inner = Array.from({length: 97}, (_, k) => ringPt((k / 96) * Math.PI * 2, 0, 0));
  wFlat(p, c, 85000, STADIUM.apron, inner);
  for (let i = 0; i < 14; i++) {
    const x0 = -52.5 + (105 * i) / 14, x1 = -52.5 + (105 * (i + 1)) / 14;
    wFlat(p, c, 85010 + i, i % 2 ? STADIUM.grassA : STADIUM.grassB, [[x0, 0, -34], [x1, 0, -34], [x1, 0, 34], [x0, 0, 34]]);
  }
  const L = (id: number, pts: V3[]) => wStroke(p, c, 85100 + id, pts.map(([x, , z]) => [x, 0.02, z] as V3), STADIUM.line, 0.7);
  L(0, [[-52.5, 0, -34], [52.5, 0, -34], [52.5, 0, 34], [-52.5, 0, 34], [-52.5, 0, -34]]);
  L(1, [[0, 0, -34], [0, 0, 34]]);
  L(2, Array.from({length: 33}, (_, k) => [9.15 * Math.cos((k / 32) * 6.283), 0, 9.15 * Math.sin((k / 32) * 6.283)] as V3));
  for (const sx of [-1, 1]) {
    L(10 + sx, [[sx * 52.5, 0, -20.16], [sx * 36, 0, -20.16], [sx * 36, 0, 20.16], [sx * 52.5, 0, 20.16]]);
    L(20 + sx, [[sx * 52.5, 0, -9.16], [sx * 47, 0, -9.16], [sx * 47, 0, 9.16], [sx * 52.5, 0, 9.16]]);
    L(30 + sx, Array.from({length: 11}, (_, k) => { const a = -0.93 + (1.86 * k) / 10; return [sx * (41.5 - 9.15 * Math.cos(a)), 0, 9.15 * Math.sin(a)] as V3; }));
    // goal frame (posts 7.32 m apart, 2.44 m high) and its net depth
    wStroke(p, c, 85200 + sx, [[sx * 52.5, 0, -3.66], [sx * 52.5, 2.44, -3.66], [sx * 52.5, 2.44, 3.66], [sx * 52.5, 0, 3.66]], '#fbfbf8', 0.9);
    wFlat(p.layer(0.35, 85300 + sx), c, 85300 + sx, '#e8ebe6', [[sx * 52.5, 2.44, -3.66], [sx * 54.5, 1.6, -3.66], [sx * 54.5, 1.6, 3.66], [sx * 52.5, 2.44, 3.66]]);
  }
};

/** Back pass: surrounds, outer wall, pitch, stands (bare concrete and seat tone; the crowd is the canvas layer), roof. */
export const paintStadium = (p: Painter, c: YCam, az: number) => {
  const B = BOWL, span = roofSpan(az);
  paintSurrounds(p, c);
  // the bowl's soft contact shadow on the plaza (papercut family; overcast, so it spreads evenly), outer wall (battered), parapet top
  wShadow(p, c, 85900, Array.from({length: 73}, (_, k) => ringPt((k / 72) * Math.PI * 2, B.outer.sBase + 0.5, 0)), 14, 0.3);
  ringBand(p, c, 86000, STADIUM.wallShade, B.outer.sBase, 0, B.outer.s, B.rim.y, 0.1, {vary: 0.08});
  paintPitch(p, c);
  ringBand(p, c, 86100, STADIUM.wall, 0, B.frontWall.y0, 0, B.frontWall.y1, 0);
  // seating bands: bare seat tone (shows only in the aisles and the few empty seats), concourse, fascia
  ringBand(p, c, 86200, STADIUM.seatBare, B.lower.s0, B.lower.y0, B.lower.s1, B.lower.y1, 0.6);
  ringBand(p, c, 86300, STADIUM.concrete, B.concourse.s0, B.concourse.y, B.concourse.s1, B.concourse.y, 1);
  ringBand(p, c, 86400, STADIUM.concreteShade, B.fascia.s, B.fascia.y0, B.fascia.s, B.fascia.y1, 0);
  ringBand(p, c, 86500, STADIUM.seatBare, B.upper.s0, B.upper.y0, B.upper.s1, B.upper.y1, 0.5);
  ringBand(p, c, 86600, STADIUM.concrete, B.rim.s0, B.rim.y, B.rim.s1, B.rim.y, 1);
  ringBand(p, c, 86700, STADIUM.concreteShade, B.upper.s1, B.upper.y1, B.rim.s0, B.rim.y, 0.3);
  // vomitory portals in the lower tier (16 dark mouths evenly round the ring; the crowd leaves them clear)
  vomitories().forEach(({a, b}, i) => wFlat(p, c, 86800 + i, STADIUM.vom, [ringPt(a, 9.4, 6.9), ringPt(b, 9.4, 6.9), ringPt(b, 11.2, 7.8), ringPt(a, 11.2, 7.8)]));
  // the roof over the far upper tier: underside edge then the top sheet, and its front fascia line
  const R = B.roof, n = 24, th = (k: number) => span[0] + ((span[1] - span[0]) * k) / n;
  for (let k = 0; k < n; k++) {
    wFlat(p, c, 86900 + k, STADIUM.roofEdge, [ringPt(th(k), R.s0, R.y - R.th), ringPt(th(k + 1), R.s0, R.y - R.th), ringPt(th(k + 1), R.s0, R.y), ringPt(th(k), R.s0, R.y)]);
    wFlat(p, c, 86950 + k, hazeAt(c, STADIUM.roofTop, ringPt(th(k), R.s1, R.y)), [ringPt(th(k), R.s0, R.y), ringPt(th(k + 1), R.s0, R.y), ringPt(th(k + 1), R.s1, R.y), ringPt(th(k), R.s1, R.y)]);
  }
  wStroke(p, c, 87000, Array.from({length: n + 1}, (_, k) => ringPt(th(k), R.s0, R.y)), '#f6f7f6', 0.6);
  for (let k = 1; k < n; k += 2) wStroke(p, c, 87010 + k, [ringPt(th(k), R.s0 + 0.5, R.y + 0.05), ringPt(th(k), R.s1 - 0.5, R.y + 0.05)], STADIUM.roofEdge, 0.35);
};

/** Picture polygon of the roof (to keep crowd dots under it hidden). */
export const roofPoly = (c: YCam, az: number): Pt[] => {
  const R = BOWL.roof, span = roofSpan(az), n = 24, th = (k: number) => span[0] + ((span[1] - span[0]) * k) / n;
  return poly(c, [...Array.from({length: n + 1}, (_, k) => ringPt(th(k), R.s0, R.y - R.th)), ...Array.from({length: n + 1}, (_, k) => ringPt(th(n - k), R.s1, R.y))]);
};

/** Radial aisles per ring (1.2 m wide), at the same perimeter fractions on every row so they line up down the rake. */
const AISLES = 56;
const vomitories = () => Array.from({length: 16}, (_, i) => { const m = ((i + 0.5) / 16) * Math.PI * 2; return {a: m - 0.022, b: m + 0.022}; });

export type CrowdStats = {dots: number; tiers: number; ms: number};
/**
 * The dot crowd on a plain 2D canvas (no brush): every seat of both tiers, rows 0.8 m apart along the rake, seats 0.5 m apart, a radial
 * aisle every 1/56 of the ring, the vomitory mouths left clear, ~1 % empty seats. Each person is a soft dot (head + shoulders read as one blob at this
 * distance), muted mixed colours, hazed with depth, darker under the roof. `t` adds a faint shimmer (a few dots swap tone per frame).
 * Dots under `occluder` (the roof's picture polygon) are not drawn. Returns counts and the draw time.
 */
export const drawCrowd = (ctx: CanvasRenderingContext2D, c: YCam, o: {occluder?: Pt[]; az: number; frame?: number}): CrowdStats => {
  const t0 = performance.now();
  const span = roofSpan(o.az);
  if (o.occluder && o.occluder.length > 2) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(-10, -10, 1100, 1940);
    o.occluder.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.clip('evenodd');
  }
  let dots = 0;
  const vom = vomitories();
  for (const [ti, tier] of [BOWL.lower, BOWL.upper].entries()) {
    const rows = Math.round((tier.s1 - tier.s0) / 0.8);
    for (let r = 0; r < rows; r++) {
      const s = tier.s0 + ((r + 0.55) / rows) * (tier.s1 - tier.s0), y = tier.y0 + ((r + 0.55) / rows) * (tier.y1 - tier.y0) + 0.55;
      // seats along the ring at this offset: sample the perimeter
      const M = 720, pts: V3[] = Array.from({length: M + 1}, (_, k) => ringPt((k / M) * Math.PI * 2, s, y));
      const seg = pts.slice(1).map((b, k) => Math.hypot(b[0] - pts[k][0], b[2] - pts[k][2])), perim = seg.reduce((m, v) => m + v, 0);
      const bay = perim / AISLES;
      let at = 0, carry = 0, seat = 0;
      for (let k = 0; k < M; k++) {
        const a = pts[k], b = pts[k + 1], len = seg[k];
        for (let u = carry; u < len; u += 0.5) {
          seat++;
          const along = (at + u) % bay;
          if (along < 0.6 || along > bay - 0.6) continue;
          const th = ((k + u / len) / M) * Math.PI * 2;
          if (ti === 0 && s > 8.6 && s < 11.9 && vom.some((v) => th > v.a - 0.004 && th < v.b + 0.004)) continue;
          const id = ti * 1e7 + r * 1e5 + seat;
          if (hn(id) < 0.012) continue;
          const v: V3 = [a[0] + ((b[0] - a[0]) * u) / len, y, a[2] + ((b[2] - a[2]) * u) / len];
          const q = camSpace(c, v);
          if (q.d < 1) continue;
          const px = 540 + (c.cx ?? 0) + (c.f * q.r) / q.d, py = c.hy - (c.f * q.u) / q.d;
          if (px < -4 || px > 1084 || py < -4 || py > 1924) continue;
          const shimmer = o.frame ? (hn(id * 3 + Math.floor(o.frame / 3)) < 0.01 ? 1 : 0) : 0;
          let col = CROWD[Math.floor(hn(id * 7 + shimmer) * CROWD.length)];
          if (ti === 1 && s > BOWL.roof.s0 - 6 && inSpan(th, span)) col = mixColor(col, '#3a3e44', 0.35);
          col = hazeAt(c, col, v, 0.9);
          const rad = Math.max(0.75, (c.f * 0.2) / q.d);
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, 6.2832);
          ctx.fill();
          dots++;
        }
        carry = (0.5 - ((len - carry) % 0.5)) % 0.5;
        at += len;
      }
    }
  }
  if (o.occluder && o.occluder.length > 2) ctx.restore();
  return {dots, tiers: 2, ms: Math.round(performance.now() - t0)};
};
