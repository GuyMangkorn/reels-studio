import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camSpace, camUnit, type YCam} from '../kit/ycam';
import {flatCircle, paintSorted, qx, qy, qz, wFill, wInk, wp, type Box, type Item} from '../kit/world';
import {paintStars} from '../kit/stars';

// SET-ROOF16 look (brief EDU-EP16-BRIEF-R2 "Set plan — SET-ROOF16", N4/N5; Film W3 group 2, 2026-11-14; Boss hardens). Space `R` in metres: origin on
// the deck under the stool seat centre, +x right seen from the main camera side, +y up, +z toward the main camera side (south); the skyline is north (-z).
// Pure paint functions of the frame. States: lamp on|off (the reply button goes dark with it, VD06), trace blip|flat, blip phase. Seeds 50000-52999.

/** Roof palette (brief colour and value key; W3 tune: zenith lifted from #070b16 to #0b1120 for UT03). */
export const RF = {
  zen: '#0b1120', mid: '#141c30', band: '#3a2a2a', haze: '#8a5530', glow: '#d9823f',
  tower: ['#151a26', '#1c2130'] as const, winWarm: '#e8b866', winCool: '#9fb8d6', avia: '#ff4a32',
  concrete: '#3c3c42', concreteLit: '#8a7458', tar: '#262528', crack: '#1e1d22',
  parapet: '#4a4846', parapetTop: '#5c5a55', parapetDark: '#26262c',
  bulb: '#fff1d6', pool: '#ffc98a', trace: '#7dffb0', screen: '#0b1a12', button: '#ff6a3d', ring: '#a33a20',
  crate: '#5a5e66', alu: '#9aa0a6', page: '#d9cdb2', stool: '#c0392b', steel: '#3a3f47', rust: '#5a3a2a', mesh: '#8e969e',
  night: '#1d2740',
} as const;

/** Set anchors (metres, brief SET-ROOF16; est). */
export const ROOF = {
  hips: [0, 0.3, 0] as V3, head: [0, 0.92, 0.02] as V3,
  crate: {x0: -0.68, x1: -0.28, y0: 0, y1: 0.3, z0: 0.07, z1: 0.37} as Box,
  rx: {x0: -0.61, x1: -0.39, y0: 0.3, y1: 0.44, z0: 0.09, z1: 0.23} as Box,
  reply: {x0: -0.39, x1: -0.27, y0: 0.3, y1: 0.355, z0: 0.3, z1: 0.38} as Box,
  button: [-0.33, 0.355, 0.34] as V3,
  rocker: [-0.4, 0.31, 0.28] as V3,
  logbook: {c: [-0.6, 0.305, 0.22] as V3, w: 0.21, d: 0.3, rot: 15},
  clamp: [-0.66, 0.3, 0.1] as V3, bulb: [-0.58, 0.58, 0.18] as V3,
  dish: {foot: [-1.1, 0, -0.8] as V3, c: [-1.1, 1.25, -0.8] as V3, r: 0.45},
  tank: {c: [2.7, 0, -1.2] as V3, r: 0.8, h: 2.0, stand: 0.8},
  ac: [[1.8, 0, 1.3], [2.7, 0, 1.3]] as V3[],
  thermos: [0.3, 0, 0.22] as V3, mug: [0.42, 0, 0.12] as V3,
  puddle: [1.0, 0, -1.2] as V3,
  stair: {x0: -4.0, x1: -2.4, y0: 0, y1: 2.4, z0: 1.6, z1: 3.8} as Box,
};

export type RoofState = {t: number; lamp: boolean; trace: 'blip' | 'flat'; blip?: number; /** 0..1 grade cooling per chapter (B01 0, L02 0.25, B04 0.5). */ cool?: number; /** W3 v10 (SH21): the shot paints its own 3D-aimed lamp head and neck; the crate skips its picture-space one. */ ownLamp?: boolean; /** W3 v11 (SH21-ON): the shot paints its own smaller deck pool; the deck skips this one. */ noDeckPool?: boolean; /** W5.2 (blip clock, `edu16/clock.ts` `traceAt`): spike height 0..1 at the `blip` position (undefined = the W3 look's full spike) */ spike?: number; /** W5.2: phosphor level 0..1 of the trace and its glow (undefined = the W3 look: 1 blipping, 0.7 flat) */ traceLv?: number};

const DEG = Math.PI / 180;
const W = 1080, H = 1920;

// ---------- sky ----------
/** Picture row of the horizon (elevation 0) for a pitched camera. */
export const horizonY = (c: YCam) => c.hy + c.f * Math.tan(c.pitch ?? 0);
const elevAt = (c: YCam, y: number) => ((c.pitch ?? 0) + Math.atan((c.hy - y) / c.f)) / DEG;
/** Sky colour by elevation (deg): sodium haze low over the city, cold dark navy up. */
export const skyAt = (e: number, cool = 0) => {
  const st: [number, string][] = [[-6, mixColor(RF.band, RF.glow, 0.42)], [0, mixColor(RF.band, RF.haze, 0.55)], [5, mixColor(RF.band, RF.haze, 0.3)], [11, RF.band], [20, '#232434'], [34, RF.mid], [60, RF.zen]];
  let col = st[st.length - 1][1];
  for (let i = 0; i < st.length - 1; i++) {
    if (e <= st[0][0]) { col = st[0][1]; break; }
    if (e >= st[i][0] && e < st[i + 1][0]) { col = mixColor(st[i][1], st[i + 1][1], (e - st[i][0]) / (st[i + 1][0] - st[i][0])); break; }
  }
  return cool ? mixColor(col, '#1a2236', 0.35 * cool) : col;
};

export const paintRoofSky = (p: Painter, c: YCam, o: {t: number; cool?: number; stars?: number; hazeLevel?: number}) => {
  const hz = horizonY(c), N = 64, yEnd = Math.min(H + 10, hz + 260);
  hardFill(p, 50000, skyAt(80, o.cool), [[-10, -10], [W + 10, -10], [W + 10, H + 10], [-10, H + 10]]);
  for (let i = 0; i < N; i++) {
    const y0 = -10 + ((yEnd + 10) * i) / N, y1 = -10 + ((yEnd + 10) * (i + 1)) / N + 1.5;
    hardFill(p, 50001 + i, skyAt(elevAt(c, (y0 + y1) / 2), o.cool), [[-10, y0], [W + 10, y0], [W + 10, y1], [-10, y1]]);
  }
  // a few thin, irregular high wisps catching the city glow (low value; texture so the sky is not one flat field, UT03). W3: fewer and broken, not bars.
  for (let i = 0; i < 4; i++) {
    const y = hz - 170 - 150 * i - 50 * hash(i + 4), x = 1080 * hash(i * 3.3 + 1), w = 150 + 170 * hash(i + 9);
    if (y < -40) continue;
    const col = mixColor(skyAt(elevAt(c, y), o.cool), RF.glow, 0.07 + 0.03 * (o.hazeLevel ?? 1));
    for (let k = 0; k < 3; k++) {
      const xx = x + (k - 1) * w * 0.8 + 40 * hash(i * 7 + k), ww = w * (0.35 + 0.4 * hash(i * 5 + k)), hh = 3 + 5 * hash(i * 11 + k);
      hardFill(p, 50080 + i * 4 + k, col, [[xx - ww, y + 2], [xx - ww * 0.3, y - hh], [xx + ww * 0.6, y - hh * 0.6], [xx + ww, y + 1], [xx + ww * 0.2, y + hh * 0.8], [xx - ww * 0.5, y + hh * 0.5]]);
    }
  }
  paintStars(p, c, skyAt(40), {seed: 61, count: 150, alpha: 0.5 * (o.stars ?? 1), t: o.t, color: '#e8ecf6', big: 0.05, upper: true, rect: [0, 0, W, Math.max(0, hz - 170)]});
};

/** The one slightly brighter star where the dish points (az 300 deg NW, el 55 deg; V01 look target). Unnamed, fictional (VD12). */
export const STAR_DIR: V3 = [Math.cos(55 * DEG) * Math.sin(300 * DEG), Math.sin(55 * DEG), -Math.cos(55 * DEG) * Math.cos(300 * DEG)];
export const paintFaintStar = (p: Painter, c: YCam, t: number) => {
  const q = camPoint(c, [c.x + STAR_DIR[0] * 1000, c.y + STAR_DIR[1] * 1000, c.z + STAR_DIR[2] * 1000]);
  if (!q || q[1] < 8 || q[1] > H) return;
  const tw = 0.85 + 0.15 * Math.sin(t * 1.7);
  hardFill(p, 50120, mixColor(RF.zen, '#dfe8ff', 0.22 * tw), ell(q[0], q[1], 9, 9, 12));
  hardFill(p, 50121, mixColor(RF.zen, '#f2f6ff', 0.95 * tw), ell(q[0], q[1], 3.6, 3.6, 10));
};

// ---------- city (all round; billboards far, so a yaw move slides them by distance) ----------
type Tower = {az: number; d: number; w: number; h: number; tone: number; seed: number};
// W3: Bangkok condo towers 60-260 m in every direction, denser toward the north skyline the dish faces, so the skyline clears the parapet from the seated eye.
export const TOWERS: Tower[] = Array.from({length: 120}, (_, i) => {
  const north = i < 48, az = north ? -75 + (150 * (i + 0.5)) / 48 + (hash(i * 2.1) - 0.5) * 2.5 : ((i - 48) / 72) * 360 + (hash(i * 2.1) - 0.5) * 4;
  const d = north ? 280 + 1300 * hash(i * 1.3) : 300 + 1700 * hash(i * 1.3), tall = hash(i * 5.1);
  return {az, d, w: 24 + 40 * hash(i * 3.9), h: tall < 0.12 ? 200 + 70 * hash(i * 4.4) : tall < 0.5 ? 110 + 80 * hash(i * 4.4) : 50 + 60 * hash(i * 4.4), tone: hash(i * 8.8), seed: i};
});
const azPos = (az: number, d: number, y: number): V3 => [Math.sin(az * DEG) * d, y, -Math.cos(az * DEG) * d];

/** City skyline: tower cards with sparse lit windows (<= 6 %), steady red aviation lights on the tallest, haze glow on their feet. `street` m below the deck. */
export const paintCity = (p: Painter, c: YCam, o: {cool?: number; street?: number; windows?: number}) => {
  const street = o.street ?? -25, hz = horizonY(c);
  const vis = TOWERS.map((tw) => ({tw, pos: azPos(tw.az, tw.d, street)})).map((v) => ({...v, s: camSpace(c, v.pos)})).filter((v) => v.s.d > 5).sort((a, b) => b.s.d - a.s.d);
  vis.forEach(({tw, pos, s}, k) => {
    const u = c.f / s.d, top = camPoint(c, [pos[0], street + tw.h, pos[2]]), base = camPoint(c, pos);
    if (!top || !base) return;
    const hw = (tw.w * u) / 2, x = top[0];
    if (x + hw < -20 || x - hw > W + 20) return;
    const far = Math.min(1, (tw.d - 260) / 1800);
    const col = mixColor(mixColor(RF.tower[0], RF.tower[1], tw.tone), mixColor(RF.band, RF.haze, 0.4), 0.18 + 0.4 * far);
    const sb = 51000 + tw.seed * 8;
    hardFill(p, sb, col, [[x - hw, top[1]], [x + hw, top[1]], [x + hw, base[1]], [x - hw, base[1]]]);
    // a stepped crown on some towers
    if (tw.h > 60 && hash(tw.seed + 0.5) < 0.6) hardFill(p, sb + 1, col, [[x - hw * 0.5, top[1] - tw.h * u * 0.06], [x + hw * 0.4, top[1] - tw.h * u * 0.06], [x + hw * 0.4, top[1] + 1], [x - hw * 0.5, top[1] + 1]]);
    // haze glow rising on the lower facade
    const gy = Math.min(base[1], hz + 30);
    washAt(p, sb + 2, RF.glow, 40 + 30 * (1 - far), [[x - hw, gy - (gy - top[1]) * 0.45], [x + hw, gy - (gy - top[1]) * 0.45], [x + hw, gy], [x - hw, gy]], 0, 0);
    // lit windows (sparse, deterministic; skipped when a window is below ~1 px)
    const wpx = 2.2 * u, rows = Math.floor(tw.h / 3.4), cols = Math.max(2, Math.floor(tw.w / 4.2));
    if (wpx >= 1.1 && (o.windows ?? 1) > 0) {
      let n = 0;
      for (let r = 1; r < rows && n < 34; r++) for (let q = 0; q < cols && n < 34; q++) {
        const hsh = hash(tw.seed * 131 + r * 17.3 + q * 3.1);
        if (hsh > 0.06) continue;
        const wx = x - hw + ((q + 0.5) / cols) * hw * 2, wy = base[1] - (r / rows) * (base[1] - top[1]);
        if (wy > hz + 40) continue;
        const wc = hash(hsh * 977) < 0.6 ? RF.winWarm : RF.winCool;
        hardFill(p, 52000 + tw.seed * 40 + n, mixColor(col, wc, 0.75 - 0.35 * far), [[wx - wpx * 0.5, wy - wpx * 0.7], [wx + wpx * 0.5, wy - wpx * 0.7], [wx + wpx * 0.5, wy + wpx * 0.7], [wx - wpx * 0.5, wy + wpx * 0.7]]);
        n++;
      }
    }
    if (tw.h > 200) { // steady red aviation light (no blinking: nothing rhythmic competes with the blip)
      const r = Math.max(2.2, 1.2 * u);
      hardFill(p, sb + 5, mixColor(col, RF.avia, 0.45), ell(x, top[1] - 2, r * 2.6, r * 2.6, 10));
      hardFill(p, sb + 6, RF.avia, ell(x, top[1] - 2, r, r, 8));
    }
    void k;
  });
};

/** Low city below the horizon (high cameras only): a dark sprawl with scattered street and window lights and a sodium glow. */
export const paintSprawl = (p: Painter, c: YCam, o: {street?: number; t: number}) => {
  const street = o.street ?? -25, hz = horizonY(c);
  if (hz > H) return;
  hardFill(p, 50200, '#15161d', [[-10, hz], [W + 10, hz], [W + 10, H + 10], [-10, H + 10]]);
  washAt(p, 50201, RF.glow, 70, [[-10, hz - 4], [W + 10, hz - 4], [W + 10, hz + 70], [-10, hz + 70]], 0, 0);
  washAt(p, 50202, mixColor(RF.band, RF.haze, 0.5), 110, [[-10, hz], [W + 10, hz], [W + 10, hz + 26], [-10, hz + 26]], 0, 0);
  // low blocks: real boxes (W3 v4: v3's camera-facing cards read as cardboard); dark walls, roofs a step lighter with a faint haze edge
  const blocks = Array.from({length: 220}, (_, i) => {
    const az = hash(i * 3.7) * 360, d = 45 + 700 * hash(i * 5.3) ** 1.3, hgt = -8 - 15 * hash(i * 2.9), w = 10 + 18 * hash(i * 6.1), dz = 10 + 16 * hash(i * 7.9);
    const c0 = azPos(az, d, street);
    return {i, b: {x0: c0[0] - w / 2, x1: c0[0] + w / 2, y0: street, y1: hgt, z0: c0[2] - dz / 2, z1: c0[2] + dz / 2} as Box, d: Math.hypot(c0[0] - c.x, c0[2] - c.z)};
  }).sort((a2, b2) => b2.d - a2.d);
  blocks.forEach(({i, b: bx, d}) => {
    const mid = camPoint(c, [(bx.x0 + bx.x1) / 2, bx.y1, (bx.z0 + bx.z1) / 2]);
    if (!mid || mid[0] < -300 || mid[0] > W + 300 || mid[1] > H + 200) return;
    const col = mixColor('#17181f', '#20202a', hash(i * 9.1)), far = Math.min(1, d / 700);
    box(p, c, 50300 + i * 6, bx, {base: mixColor(col, '#0c0d12', 0.3), front: col, top: mixColor(mixColor(col, '#3a3a46', 0.6), RF.glow, 0.06 + 0.1 * far)});
    if (hash(i * 4.3) < 0.5) { // one or two lit windows on the facing wall
      const wz = c.z > bx.z1 ? bx.z1 + 0.05 : bx.z0 - 0.05, wx = bx.x0 + (bx.x1 - bx.x0) * (0.2 + 0.6 * hash(i * 2.2)), wy = street + (bx.y1 - street) * (0.3 + 0.5 * hash(i * 3.1));
      const q = camPoint(c, [wx, wy, wz]);
      if (q) { const u = camUnit(c, [wx, wy, wz]), r = Math.max(1.2, 0.9 * u); hardFill(p, 50305 + i * 6, mixColor(col, hash(i) < 0.7 ? RF.winWarm : RF.winCool, 0.7), [[q[0] - r, q[1] - r * 1.3], [q[0] + r, q[1] - r * 1.3], [q[0] + r, q[1] + r * 1.3], [q[0] - r, q[1] + r * 1.3]]); }
    }
  });
  // scattered lights on the street plane
  for (let i = 0; i < 420; i++) {
    const az = hash(i * 1.37 + 7) * 360, d = 40 + 1400 * hash(i * 2.71 + 3) ** 1.4;
    const q = camPoint(c, azPos(az, d, street + 3 * hash(i)));
    if (!q || q[1] < hz + 2 || q[1] > H || q[0] < 0 || q[0] > W) continue;
    const r = Math.max(1, 3.2 - d / 500), col = hash(i * 4.1) < 0.7 ? RF.winWarm : RF.winCool;
    hardFill(p, 56000 + i, mixColor('#15161d', col, 0.75), ell(q[0], q[1], r, r * 0.8, 6));
  }
};

// ---------- set ----------
type Faces = Partial<Record<'top' | 'front' | 'back' | 'left' | 'right', string>>;
/** A box with explicit colours per visible face (front = +z). */
export const box = (p: Painter, c: YCam, seed: number, b: Box, f: Faces & {base: string}) => {
  const out: Pt[][] = [];
  const face = (k: keyof Faces, pts: V3[], i: number) => out.push(wFill(p, c, seed + i, f[k] ?? f.base, pts));
  if (c.x < b.x0) face('left', qx(b.x0, b.y0, b.y1, b.z0, b.z1), 1);
  if (c.x > b.x1) face('right', qx(b.x1, b.y0, b.y1, b.z0, b.z1), 2);
  if (c.z > b.z1) face('front', qz(b.z1, b.x0, b.x1, b.y0, b.y1), 3);
  if (c.z < b.z0) face('back', qz(b.z0, b.x0, b.x1, b.y0, b.y1), 4);
  if (c.y > b.y1) face('top', qy(b.y1, b.x0, b.x1, b.z0, b.z1), 5);
  return out;
};

/** Lamp light falling off with distance on the deck (0..1). */
const lampAt = (v: V3) => { const d = Math.hypot(v[0] - ROOF.bulb[0], v[2] - ROOF.bulb[2]); return Math.max(0, 1 - d / 1.25) ** 1.6; };

export const paintDeck = (p: Painter, c: YCam, s: RoofState) => {
  const cool = s.cool ?? 0, base = mixColor(RF.concrete, RF.night, 0.15 + 0.2 * cool);
  wFill(p, c, 50400, base, qy(0, -4.0, 4.0, -2.2, 3.8));
  // far deck picks up the haze (the parapet side), near deck the sky
  wWashSafe(p, c, 50401, mixColor(base, RF.glow, 0.5), 60, qy(0, -4.0, 4.0, -2.2, -1.2));
  // tar-patched waterproofing (irregular patches 0.5-1.5 m)
  for (let i = 0; i < 16; i++) {
    const x = -3.6 + 7.2 * hash(i * 2.3 + 1), z = -2.0 + 5.6 * hash(i * 3.1 + 2), r = 0.25 + 0.5 * hash(i * 4.7), n = 9;
    const pts: V3[] = Array.from({length: n}, (_, k) => { const a = (k / n) * Math.PI * 2, w = r * (0.7 + 0.5 * hash(i * 13 + k)); return [x + Math.cos(a) * w * 1.4, 0.001, z + Math.sin(a) * w]; });
    wFill(p, c, 50410 + i, mixColor(RF.tar, base, 0.25 + 0.2 * hash(i)), pts);
  }
  // hairline cracks and the drain grate
  for (let i = 0; i < 9; i++) {
    const x = -3.4 + 6.8 * hash(i * 5.9 + 3), z = -1.9 + 5 * hash(i * 7.3 + 1);
    const pts: V3[] = [0, 1, 2, 3].map((k) => [x + k * 0.35 * (hash(i + k) - 0.3), 0.002, z + k * 0.28 * (hash(i * 2 + k) - 0.5)]);
    wInk(p, c, 50430 + i, pts, {closed: false, color: mixColor(base, RF.crack, 0.7), weight: 0.6});
  }
  wFill(p, c, 50440, mixColor(RF.tar, '#0e0e12', 0.4), qy(0.002, -1.95, -1.65, -2.05, -1.8));
  // puddle holding the sky and the haze
  const pu = flatCircle(c, ROOF.puddle, 0.6, 24).map(([x, y]): Pt => [x, y]);
  if (pu.length > 2) {
    const ell2 = wp(c, Array.from({length: 24}, (_, k): V3 => [ROOF.puddle[0] + 0.62 * Math.cos((k / 24) * 6.283), 0.003, ROOF.puddle[2] + 0.3 * Math.sin((k / 24) * 6.283)]));
    hardFill(p, 50450, mixColor(RF.zen, RF.mid, 0.6), ell2);
    const streak = wp(c, Array.from({length: 16}, (_, k): V3 => [ROOF.puddle[0] - 0.05 + 0.26 * Math.cos((k / 16) * 6.283), 0.004, ROOF.puddle[2] - 0.15 + 0.045 * Math.sin((k / 16) * 6.283)]));
    hardFill(p, 50451, mixColor(RF.band, RF.haze, 0.4), streak);
  }
  // lamp pool: warm rings on the deck (UT04: a clean warm, opaque premixed, never a translucent orange over navy)
  if (s.lamp && !s.noDeckPool) {
    // W3: smaller (the bulb hangs 0.58 m up, aimed down-right at the crate and her hands) and a cleaner amber than the beige `concreteLit`
    const g: V3 = [ROOF.bulb[0] + 0.16, 0.004, ROOF.bulb[2] + 0.2], lit = '#d29a5c';
    [[0.64, 0.05], [0.56, 0.09], [0.48, 0.13], [0.4, 0.18], [0.32, 0.23], [0.24, 0.28], [0.16, 0.33], [0.09, 0.37]].forEach(([r, k], i) => {
      const pts = wp(c, Array.from({length: 28}, (_, j): V3 => [g[0] + r * 1.1 * Math.cos((j / 28) * 6.283) + 0.03 * Math.sin(j * 1.7), g[1], g[2] + r * Math.sin((j / 28) * 6.283)]));
      if (pts.length > 2) hardFill(p, 50460 + i, mixColor(base, lit, k * (1 - 0.3 * cool)), pts);
    });
  }
};
const wWashSafe = (p: Painter, c: YCam, seed: number, col: string, op: number, pts: V3[]) => { const q = wp(c, pts); if (q.length > 2) washAt(p, seed, col, op, q, 0, 0); };

export const paintParapet = (p: Painter, c: YCam, s: RoofState, o: {rim?: number} = {}) => {
  const rim = mixColor(RF.parapetTop, RF.glow, 0.45 * (o.rim ?? 1)), dark = mixColor(RF.parapetDark, RF.night, 0.2), side = mixColor(RF.parapet, RF.night, 0.45);
  const walls: Box[] = [
    {x0: -4.0, x1: 4.0, y0: 0, y1: 1.0, z0: -2.4, z1: -2.2},
    {x0: -4.2, x1: -4.0, y0: 0, y1: 1.0, z0: -2.4, z1: 4.0},
    {x0: 4.0, x1: 4.2, y0: 0, y1: 1.0, z0: -2.4, z1: 4.0},
    {x0: -4.0, x1: 4.0, y0: 0, y1: 1.0, z0: 3.8, z1: 4.0},
  ];
  walls.map((b, i) => ({b, i, d: Math.hypot((b.x0 + b.x1) / 2 - c.x, (b.z0 + b.z1) / 2 - c.z)})).sort((a, b) => b.d - a.d).forEach(({b, i}) => {
    box(p, c, 50500 + i * 10, b, {base: side, front: dark, back: dark, top: rim});
    // peeling paint patches and a moss line at the foot (inner face toward the deck)
    if (i === 0 && c.z > b.z1) for (let k = 0; k < 10; k++) {
      const x = -3.7 + 7.4 * hash(k * 3.3 + 2), y = 0.2 + 0.6 * hash(k * 1.9), w = 0.12 + 0.25 * hash(k);
      wFill(p, c, 50550 + k, mixColor(dark, RF.parapet, 0.35), qz(b.z1 + 0.001, x, x + w, y, y + 0.08 + 0.1 * hash(k + 3)));
    }
    if (i === 0 && c.z > b.z1) wFill(p, c, 50570, mixColor(dark, '#2f3a26', 0.5), qz(b.z1 + 0.002, -4.0, 4.0, 0, 0.05));
    // the haze rim along the top edge facing the camera
    const edge: V3[] = c.z > b.z1 ? [[b.x0, b.y1, b.z1], [b.x1, b.y1, b.z1]] : c.z < b.z0 ? [[b.x0, b.y1, b.z0], [b.x1, b.y1, b.z0]] : c.x > b.x1 ? [[b.x1, b.y1, b.z0], [b.x1, b.y1, b.z1]] : [[b.x0, b.y1, b.z0], [b.x0, b.y1, b.z1]];
    wInk(p, c, 50590 + i, edge, {closed: false, color: mixColor(rim, '#ffd9a8', 0.4), weight: 1.1});
  });
  void s;
};

// ---------- props ----------
/** Red plastic stool (seat 0.30 m, centre at the origin). */
/** Drawn by the figure item, before the figure, so it always stays under her (v4: sorted on its own it covered her from behind). */
export const paintStool = (p: Painter, c: YCam, at: V3 = [0, 0, 0]) => {
  const top = wp(c, Array.from({length: 18}, (_, k): V3 => [at[0] + 0.15 * Math.cos((k / 18) * 6.283), 0.3, at[2] + 0.15 * Math.sin((k / 18) * 6.283)]));
  const foot = wp(c, Array.from({length: 18}, (_, k): V3 => [at[0] + 0.18 * Math.cos((k / 18) * 6.283), 0.0, at[2] + 0.18 * Math.sin((k / 18) * 6.283)]));
  const all = [...top, ...foot];
  if (all.length < 6) return;
  const xs = all.map((q) => q[0]), xl = Math.min(...xs), xr = Math.max(...xs), yt = Math.min(...top.map((q) => q[1])), yb = Math.max(...foot.map((q) => q[1]));
  hardFill(p, 50600, mixColor(RF.stool, RF.night, 0.45), [[xl + 6, yt], [xr - 6, yt], [xr, yb], [xl, yb]]);
  hardFill(p, 50601, mixColor(RF.stool, RF.night, 0.2), top);
};

/** Hand-bent aluminium mesh dish on a camera tripod, aimed up at 55 deg toward the NW. Seen from the camera side as a dark mesh edged by the haze. */
const paintDish = (p: Painter, c: YCam, s: RoofState) => {
  const {foot, c: dc, r} = ROOF.dish;
  // tripod legs and column
  const hub: V3 = [dc[0], dc[1] - 0.3, dc[2]];
  [[0.35, 0], [-0.2, 0.3], [-0.2, -0.3]].forEach(([dx, dz], i) => wInk(p, c, 50700 + i, [[foot[0] + dx, 0, foot[2] + dz], hub], {closed: false, color: '#15171c', weight: 1.6}));
  wInk(p, c, 50703, [hub, dc], {closed: false, color: '#15171c', weight: 2});
  // dish rim: a circle in the plane normal to the aim (az 300, el 55)
  const az = 300 * DEG, el = 55 * DEG, n: V3 = [Math.cos(el) * Math.sin(az), Math.sin(el), -Math.cos(el) * Math.cos(az)];
  const a: V3 = [Math.cos(az), 0, Math.sin(az)], b: V3 = [n[1] * a[2] - n[2] * a[1], n[2] * a[0] - n[0] * a[2], n[0] * a[1] - n[1] * a[0]];
  const ringPts = (rr: number, sink: number): V3[] => Array.from({length: 28}, (_, k) => { const t = (k / 28) * 6.283; return [dc[0] + rr * (Math.cos(t) * a[0] + Math.sin(t) * b[0]) - n[0] * sink, dc[1] + rr * (Math.cos(t) * a[1] + Math.sin(t) * b[1]) - n[1] * sink, dc[2] + rr * (Math.cos(t) * a[2] + Math.sin(t) * b[2]) - n[2] * sink]; });
  const facing = (c.x - dc[0]) * n[0] + (c.y - dc[1]) * n[1] + (c.z - dc[2]) * n[2] > 0;
  const outer = wp(c, ringPts(r, 0));
  if (outer.length < 3) return;
  hardFill(p, 50710, facing ? mixColor(RF.mesh, RF.night, 0.55) : mixColor('#20242c', RF.night, 0.2), outer);
  if (facing) hardFill(p, 50711, mixColor(RF.mesh, RF.night, 0.7), wp(c, ringPts(r * 0.72, 0.06)));
  // mesh lines (hand-bent: a little irregular)
  for (let k = -3; k <= 3; k++) {
    const t = k / 4, pts: V3[] = [-1, 1].map((sg) => { const w = Math.sqrt(Math.max(0, 1 - t * t)) * sg; return [dc[0] + r * (t * a[0] + w * b[0]), dc[1] + r * (t * a[1] + w * b[1]), dc[2] + r * (t * a[2] + w * b[2])]; });
    wInk(p, c, 50720 + k + 3, pts, {closed: false, color: mixColor(RF.mesh, RF.night, facing ? 0.3 : 0.6), weight: 0.5});
    const pts2: V3[] = [-1, 1].map((sg) => { const w = Math.sqrt(Math.max(0, 1 - t * t)) * sg; return [dc[0] + r * (w * a[0] + t * b[0]), dc[1] + r * (w * a[1] + t * b[1]), dc[2] + r * (w * a[2] + t * b[2])]; });
    wInk(p, c, 50730 + k + 3, pts2, {closed: false, color: mixColor(RF.mesh, RF.night, facing ? 0.3 : 0.6), weight: 0.5});
  }
  wInk(p, c, 50740, ringPts(r, 0), {closed: true, color: mixColor(RF.parapetTop, RF.glow, 0.55), weight: 1.2});
  // feed arm and LNB at the focus
  const focus: V3 = [dc[0] + n[0] * 0.32, dc[1] + n[1] * 0.32, dc[2] + n[2] * 0.32];
  wInk(p, c, 50741, [ringPts(r, 0)[21], focus], {closed: false, color: '#15171c', weight: 1.1});
  const fq = camPoint(c, focus);
  if (fq) hardFill(p, 50742, '#2a2e36', ell(fq[0], fq[1], 0.04 * camUnit(c, focus), 0.03 * camUnit(c, focus), 10));
  // cable along the deck to the receiver
  wInk(p, c, 50743, [[foot[0], 0.005, foot[2]], [-0.9, 0.005, -0.3], [-0.7, 0.005, 0.0], [-0.62, 0.005, 0.08]], {closed: false, color: '#121318', weight: 0.9});
  void s;
};

/** Water tank on its rusty stand (the right side of the main angle), with a folded plastic chair leaning on a leg. */
const paintTank = (p: Painter, c: YCam) => {
  const {c: tc, r, h, stand} = ROOF.tank;
  const leg = mixColor(RF.rust, RF.night, 0.4);
  [[-0.55, -0.55], [0.55, -0.55], [0.55, 0.55], [-0.55, 0.55]].forEach(([dx, dz], i) => wInk(p, c, 50800 + i, [[tc[0] + dx, 0, tc[2] + dz], [tc[0] + dx, stand, tc[2] + dz]], {closed: false, color: leg, weight: 2.4}));
  wInk(p, c, 50804, [[tc[0] - 0.55, 0.35, tc[2] + 0.55], [tc[0] + 0.55, 0.35, tc[2] + 0.55]], {closed: false, color: leg, weight: 1.6});
  wInk(p, c, 50805, [[tc[0] - 0.55, 0.05, tc[2] + 0.55], [tc[0] + 0.55, 0.65, tc[2] + 0.55]], {closed: false, color: leg, weight: 1.2});
  // W3: a real cylinder: the silhouette between the two rim ellipses' outer points, curved bottom edge, a domed lid, vertical light from the haze side
  const n = 32, ring = (y: number): {q: Pt; ang: number}[] => Array.from({length: n}, (_, k) => ({ang: (k / n) * 6.283, q: camPoint(c, [tc[0] + r * Math.cos((k / n) * 6.283), y, tc[2] + r * Math.sin((k / n) * 6.283)]) as Pt})).filter((v) => v.q);
  const lo = ring(stand), hi = ring(stand + h);
  if (lo.length < n || hi.length < n) return;
  // the near half of each ellipse: points whose world position is nearer the camera than the centre
  const near = (k: number) => Math.hypot(tc[0] + r * Math.cos((k / n) * 6.283) - c.x, tc[2] + r * Math.sin((k / n) * 6.283) - c.z) <= Math.hypot(tc[0] - c.x, tc[2] - c.z) + 0.01;
  const loNear = lo.filter((_, k) => near(k)).map((v) => v.q).sort((a, b2) => a[0] - b2[0]), hiAll = hi.map((v) => v.q);
  const xl = Math.min(...hiAll.map((q) => q[0]), ...loNear.map((q) => q[0])), xr = Math.max(...hiAll.map((q) => q[0]), ...loNear.map((q) => q[0]));
  const hiTop = hi.filter((_, k) => !near(k)).map((v) => v.q).sort((a, b2) => a[0] - b2[0]);
  const body = mixColor('#5e6672', RF.night, 0.72); // UT12a: under the subject's value
  const sil: Pt[] = [...hiTop, [xr, hiTop.length ? hiTop[hiTop.length - 1][1] : 0], ...loNear.slice().reverse(), [xl, loNear.length ? loNear[0][1] : 0]];
  hardFill(p, 50810, body, sil);
  const band = (u0: number, u1: number, col: string, seed: number) => {
    const X = (u: number) => xl + (xr - xl) * u, yAt = (pts: Pt[], x: number) => { let best = pts[0]; pts.forEach((q) => { if (Math.abs(q[0] - x) < Math.abs(best[0] - x)) best = q; }); return best[1]; };
    hardFill(p, seed, col, [[X(u0), yAt(hiAll, X(u0))], [X(u1), yAt(hiAll, X(u1))], [X(u1), yAt(loNear, X(u1))], [X(u0), yAt(loNear, X(u0))]]);
  };
  band(0.0, 0.2, mixColor(body, RF.glow, 0.22), 50811);
  band(0.7, 1.0, mixColor(body, '#0c0e14', 0.38), 50812);
  // lid: seen from below the rim the top is hidden; above, a lit ellipse
  if (c.y > stand + h) hardFill(p, 50815, mixColor(body, RF.glow, 0.15), hiAll);
  else hardFill(p, 50815, mixColor(body, '#0c0e14', 0.1), hiTop.length > 2 ? [...hiTop, ...hiAll.filter((_, k) => near(k)).sort((a, b2) => b2[0] - a[0])] : hiAll);
  // ladder on the camera side
  const lx = tc[0] - 0.62;
  wInk(p, c, 50816, [[lx, 0, tc[2] + 0.35], [lx, stand + h, tc[2] + 0.35]], {closed: false, color: leg, weight: 1.2});
  wInk(p, c, 50817, [[lx, 0, tc[2] + 0.6], [lx, stand + h, tc[2] + 0.6]], {closed: false, color: leg, weight: 1.2});
  for (let k = 1; k < 9; k++) wInk(p, c, 50818 + k, [[lx, (k / 9) * (stand + h), tc[2] + 0.35], [lx, (k / 9) * (stand + h), tc[2] + 0.6]], {closed: false, color: leg, weight: 0.9});
  wFill(p, c, 50830, mixColor('#3a6a5a', RF.night, 0.55), qx(tc[0] + 0.62, 0.05, 0.85, tc[2] - 0.2, tc[2] + 0.25)); // folded chair (leaning)
};

const paintAC = (p: Painter, c: YCam, at: V3, k: number) => {
  const b: Box = {x0: at[0] - 0.4, x1: at[0] + 0.4, y0: 0, y1: 0.6, z0: at[2] - 0.15, z1: at[2] + 0.15};
  const col = mixColor('#c9c6bc', RF.night, 0.6);
  box(p, c, 50850 + k * 10, b, {base: mixColor(col, '#0c0e14', 0.2), top: mixColor(col, RF.glow, 0.15), front: col, back: mixColor(col, '#0c0e14', 0.15)});
  const face = c.z > b.z1 ? b.z1 + 0.001 : b.z0 - 0.001, fc = camPoint(c, [at[0] + 0.12, 0.3, face]);
  if (fc) { const u = camUnit(c, [at[0] + 0.12, 0.3, face]); hardFill(p, 50858 + k * 10, mixColor(col, '#0c0e14', 0.45), ell(fc[0], fc[1], 0.2 * u, 0.2 * u, 16)); }
};

const paintStair = (p: Painter, c: YCam) => {
  const col = mixColor('#6a665e', RF.night, 0.5);
  box(p, c, 50880, ROOF.stair, {base: mixColor(col, '#0c0e14', 0.25), top: mixColor(col, RF.glow, 0.2), front: col, right: mixColor(col, '#0c0e14', 0.1)});
  if (c.x > ROOF.stair.x1) wFill(p, c, 50888, mixColor('#3e4450', RF.night, 0.5), qx(ROOF.stair.x1 + 0.002, 0, 2.0, 2.3, 3.2)); // closed, unlit steel door
};

const paintLaundry = (p: Painter, c: YCam) => {
  wInk(p, c, 50890, [[0.8, 1.7, 3.2], [2.2, 1.64, 3.2], [3.6, 1.7, 3.2]], {closed: false, color: '#2a2c32', weight: 0.7});
  wFill(p, c, 50891, mixColor('#7a8aa0', RF.night, 0.5), qz(3.2, 1.6, 2.15, 1.05, 1.66));
};

const paintThermos = (p: Painter, c: YCam, s: RoofState) => {
  const lit = s.lamp ? 0.25 : 0;
  const cyl = (at: V3, r: number, h: number, col: string, seed: number) => {
    const lo = camPoint(c, at), hi = camPoint(c, [at[0], at[1] + h, at[2]]);
    if (!lo || !hi) return;
    const u = camUnit(c, at), w = r * u;
    hardFill(p, seed + 9, '#14141a', ell(lo[0] + 0.04 * u, lo[1], w * 1.5, w * 0.5, 12));
    hardFill(p, seed, col, [[hi[0] - w, hi[1]], [hi[0] + w, hi[1]], [lo[0] + w, lo[1]], [lo[0] - w, lo[1]]]);
    hardFill(p, seed + 1, mixColor(col, '#fff4dc', 0.25 + lit), [[hi[0] - w, hi[1]], [hi[0] - w * 0.55, hi[1]], [lo[0] - w * 0.55, lo[1]], [lo[0] - w, lo[1]]]);
    hardFill(p, seed + 2, mixColor(col, '#fff4dc', 0.15), ell(hi[0], hi[1], w, w * 0.35, 12));
  };
  cyl(ROOF.thermos, 0.045, 0.28, mixColor('#3a5a7a', RF.night, 0.35), 50900);
  cyl(ROOF.mug, 0.04, 0.09, mixColor('#9aa0a6', RF.night, 0.35), 50910);
};

/** Crate desk with the receiver (phosphor trace), the logbook and the clip lamp; the reply box is painted separately (nearest prop). */
export const paintCrate = (p: Painter, c: YCam, s: RoofState) => {
  const L = s.lamp ? 1 : 0, cr = mixColor(RF.crate, RF.night, 0.35);
  // contact shadow
  wFill(p, c, 50950, mixColor(RF.tar, '#0a0a0e', 0.4), qy(0.003, ROOF.crate.x0 - 0.03, ROOF.crate.x1 + 0.05, ROOF.crate.z0 - 0.02, ROOF.crate.z1 + 0.06));
  const faces = box(p, c, 50951, ROOF.crate, {base: mixColor(cr, '#0c0e14', 0.3), front: mixColor(cr, RF.pool, 0.18 * L), right: mixColor(cr, '#0c0e14', 0.15), top: mixColor(cr, RF.pool, 0.35 * L)});
  // crate slats (a plastic crate on its side)
  if (c.z > ROOF.crate.z1) for (let k = 1; k < 4; k++) {
    const x = ROOF.crate.x0 + (k / 4) * (ROOF.crate.x1 - ROOF.crate.x0);
    wFill(p, c, 50960 + k, mixColor(cr, '#0c0e14', 0.45), qz(ROOF.crate.z1 + 0.001, x - 0.012, x + 0.012, 0.04, 0.26));
  }
  void faces;
  // logbook: open spiral notebook rotated 15 deg, rows of dates (texture), a pen in the gutter
  const lb = ROOF.logbook, ca = Math.cos(lb.rot * DEG), sa = Math.sin(lb.rot * DEG);
  const P = (u: number, v: number): V3 => [lb.c[0] + u * ca - v * sa, lb.c[1] + 0.004, lb.c[2] + u * sa + v * ca];
  const page = mixColor(RF.page, RF.night, s.lamp ? 0.18 : 0.62);
  wFill(p, c, 50970, page, [P(-lb.w / 2, -lb.d / 2), P(lb.w / 2, -lb.d / 2), P(lb.w / 2, lb.d / 2), P(-lb.w / 2, lb.d / 2)]);
  wInk(p, c, 50971, [P(0, -lb.d / 2), P(0, lb.d / 2)], {closed: false, color: mixColor(page, '#3a3a40', 0.6), weight: 0.8});
  for (let r = 0; r < 9; r++) {
    const v = -lb.d / 2 + 0.03 + r * 0.03;
    [-1, 1].forEach((sd) => wInk(p, c, 50972 + r * 2 + (sd > 0 ? 1 : 0), [P(sd * 0.012, v), P(sd * (0.02 + 0.06 * (0.6 + 0.4 * hash(r + sd))), v)], {closed: false, color: mixColor(page, '#2b3550', 0.55), weight: 0.5}));
  }
  wInk(p, c, 50995, [P(0.004, -0.11), P(0.012, 0.1)], {closed: false, color: '#2a3a7a', weight: 1.4});
  // receiver: box + screen on the +z face + green trace
  box(p, c, 51700, ROOF.rx, {base: mixColor('#2c3038', RF.night, 0.2), top: mixColor('#3a3f48', RF.pool, 0.3 * L), front: '#23272e', right: mixColor('#2c3038', '#0c0e14', 0.2), left: mixColor('#2c3038', RF.pool, 0.2 * L)});
  paintScreen(p, c, s);
  // clip lamp: clamp, gooseneck, shade, bulb
  const {clamp, bulb} = ROOF;
  if (!s.ownLamp) wInk(p, c, 51720, [clamp, [clamp[0] - 0.02, 0.42, clamp[2] + 0.01], [bulb[0] - 0.05, bulb[1] + 0.06, bulb[2] - 0.04], [bulb[0], bulb[1] + 0.03, bulb[2]]], {closed: false, color: '#0e0f13', weight: 1.8});
  // W3: a small cone shade aimed down-right (toward the crate and her hands), the bulb seen as a lit crescent under its rim
  const bq = s.ownLamp ? null : camPoint(c, bulb);
  if (bq) {
    const u = camUnit(c, bulb), ax = 0.75, ay = 0.66; // cone axis in the picture (down-right)
    const tip: Pt = [bq[0] - ax * 0.06 * u, bq[1] - ay * 0.06 * u], rimC: Pt = [bq[0] + ax * 0.01 * u, bq[1] + ay * 0.01 * u], px = -ay, py = ax, rr = 0.045 * u;
    hardFill(p, 51721, '#121318', [tip, [rimC[0] + px * rr, rimC[1] + py * rr], [rimC[0] - px * rr, rimC[1] - py * rr]]);
    hardFill(p, 51722, L ? RF.bulb : '#3a3a40', ell(rimC[0], rimC[1], rr * 0.95, rr * 0.38, 12, Math.atan2(py, px)));
    if (L) hardFill(p, 51725, mixColor(RF.bulb, RF.pool, 0.5), ell(rimC[0] + ax * 0.006 * u, rimC[1] + ay * 0.006 * u, rr * 0.55, rr * 0.2, 10, Math.atan2(py, px)));
  }
  // lamp cord with the rocker switch on the crate top
  wInk(p, c, 51723, [clamp, [-0.55, 0.302, 0.2], ROOF.rocker, [-0.3, 0.302, 0.36], [-0.25, 0.01, 0.42]], {closed: false, color: '#101116', weight: 0.8});
  const rq = camPoint(c, ROOF.rocker);
  if (rq) { const u = camUnit(c, ROOF.rocker); hardFill(p, 51724, '#18191e', ell(rq[0], rq[1], 0.022 * u, 0.012 * u, 10)); }
};

/** Green phosphor screen on the receiver's +z face; `blip` phase 0..1 of the 21 f period puts the spike; `flat` draws the line dimmed 30 %. */
export const paintScreen = (p: Painter, c: YCam, s: RoofState) => {
  const z = ROOF.rx.z1 + 0.001, x0 = -0.575, x1 = -0.425, y0 = 0.325, y1 = 0.415;
  const scr = wp(c, qz(z, x0, x1, y0, y1));
  if (scr.length < 3) return;
  const lv = s.traceLv ?? (s.trace === 'flat' ? 0.7 : 1), sp = s.spike ?? 1; // W5.2: undefined fields keep the W3 look (LF-ROOF unchanged)
  hardFill(p, 51730, mixColor(RF.screen, RF.trace, 0.1 * lv), scr);
  // grid
  for (let k = 1; k < 4; k++) wInk(p, c, 51731 + k, [[x0 + (k / 4) * (x1 - x0), y0, z], [x0 + (k / 4) * (x1 - x0), y1, z]], {closed: false, color: mixColor(RF.screen, RF.trace, 0.25 * lv), weight: 0.4});
  const ph = s.blip ?? 0.35, n = 40, pts: V3[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = x0 + 0.008 + u * (x1 - x0 - 0.016);
    let y = (y0 + y1) / 2 + 0.0015 * Math.sin(u * 40 + (s.t * 3));
    if (s.trace === 'blip' && sp > 0) { const dd = Math.abs(u - ph); if (dd < 0.06) y += sp * (0.035 * (1 - dd / 0.06)) * (u < ph ? 1 : 0.85); if (dd < 0.11 && dd >= 0.06) y -= sp * 0.006 * (1 - (dd - 0.06) / 0.05); }
    pts.push([x, y, z]);
  }
  wInk(p, c, 51740, pts, {closed: false, color: mixColor(RF.screen, RF.trace, lv), weight: 1.4});
  // glow spill around the screen
  const cq = camPoint(c, [(x0 + x1) / 2, (y0 + y1) / 2, z]);
  if (cq) { const u = camUnit(c, [(x0 + x1) / 2, (y0 + y1) / 2, z]); washAt(p, 51741, RF.trace, 26 * lv * (s.spike === undefined ? 1 : 0.8 + 0.45 * s.spike), ell(cq[0], cq[1], 0.16 * u, 0.11 * u, 18), 0, 0); }
};

/** Aluminium project case with one big round button (lit warm red until W-OFF, VD06). */
export const paintReplyBox = (p: Painter, c: YCam, s: RoofState) => {
  const L = s.lamp ? 1 : 0;
  wFill(p, c, 51750, '#121216', qy(0.302, ROOF.reply.x0 - 0.01, ROOF.reply.x1 + 0.015, ROOF.reply.z0 - 0.005, ROOF.reply.z1 + 0.02));
  box(p, c, 51751, ROOF.reply, {base: mixColor(RF.alu, RF.night, 0.55), top: mixColor(RF.alu, RF.pool, 0.25 * L), front: mixColor(RF.alu, RF.night, 0.45), right: mixColor(RF.alu, '#0c0e14', 0.5)});
  const b = ROOF.button;
  const ringP = wp(c, Array.from({length: 20}, (_, k): V3 => [b[0] + 0.024 * Math.cos((k / 20) * 6.283), b[1] + 0.001, b[2] + 0.024 * Math.sin((k / 20) * 6.283)]));
  const capP = wp(c, Array.from({length: 20}, (_, k): V3 => [b[0] + 0.0175 * Math.cos((k / 20) * 6.283), b[1] + 0.006, b[2] + 0.0175 * Math.sin((k / 20) * 6.283)]));
  if (ringP.length > 2) hardFill(p, 51760, L ? RF.ring : '#2a1a18', ringP);
  if (capP.length > 2) {
    hardFill(p, 51761, L ? RF.button : '#3a2622', capP);
    if (L) {
      const q = camPoint(c, [b[0], b[1] + 0.008, b[2]]), u = camUnit(c, b);
      if (q) {
        hardFill(p, 51762, mixColor(RF.button, '#fff1d6', 0.45), ell(q[0] - Math.min(10, 0.005 * u), q[1] - Math.min(2, 0.001 * u), Math.min(12, 0.007 * u), Math.min(5, 0.0035 * u), 10));
        if (u < 2500) washAt(p, 51763, RF.button, 40, ell(q[0], q[1], 0.06 * u, 0.04 * u, 18), 0, 0);
      }
    }
  }
};

/** Warm bulb halo (light on top of the set, kept off her face; UT04 clean warm). */
export const paintLampGlow = (p: Painter, c: YCam, s: RoofState) => {
  if (!s.lamp) return;
  const q = camPoint(c, ROOF.bulb);
  if (!q) return;
  const u = camUnit(c, ROOF.bulb), at: Pt = [q[0] + 0.02 * u, q[1] + 0.02 * u];
  // UT04: small premixed rings (a big translucent warm wash over the navy read grey); the light itself is carried by the pool and the lit faces
  washAt(p, 51771, RF.pool, 34, ell(at[0], at[1], 0.06 * u, 0.05 * u, 18), 0, 0);
};

/** Foreground (W3, UT12 depth layer, kept darker and lower in contrast, UT12a): her soldering box with a coiled cable, near the lens at lower left. */
export const paintToolbox = (p: Painter, c: YCam, s: RoofState) => {
  const at: V3 = [-1.28, 0, 1.18], b: Box = {x0: at[0] - 0.19, x1: at[0] + 0.19, y0: 0, y1: 0.16, z0: at[2] - 0.11, z1: at[2] + 0.11};
  const col = mixColor('#2e3530', '#101218', 0.5), lit = s.lamp ? 0.04 : 0;
  wFill(p, c, 51780, '#121216', qy(0.002, b.x0 - 0.03, b.x1 + 0.06, b.z0 - 0.02, b.z1 + 0.04));
  box(p, c, 51781, b, {base: mixColor(col, '#0c0e14', 0.25), top: mixColor(col, RF.pool, lit), front: col, right: mixColor(col, '#0c0e14', 0.15)});
  // handle, a soldering iron and a coil of wire on the deck beside it
  wInk(p, c, 51790, [[at[0] - 0.1, 0.16, at[2]], [at[0] - 0.08, 0.21, at[2]], [at[0] + 0.08, 0.21, at[2]], [at[0] + 0.1, 0.16, at[2]]], {closed: false, color: '#16181d', weight: 1.6});
  wInk(p, c, 51791, [[at[0] - 0.15, 0.165, at[2] + 0.06], [at[0] + 0.12, 0.165, at[2] + 0.02]], {closed: false, color: '#2a2a30', weight: 2.2});
  const coil = Array.from({length: 3}, (_, k) => Array.from({length: 18}, (_, j): V3 => [at[0] + 0.32 + (0.09 - k * 0.012) * Math.cos((j / 18) * 6.283), 0.004 + k * 0.006, at[2] - 0.05 + (0.06 - k * 0.008) * Math.sin((j / 18) * 6.283)]));
  coil.forEach((ring, k) => wInk(p, c, 51792 + k, ring, {closed: true, color: mixColor('#5a2a22', '#101218', 0.4), weight: 1.1}));
};

/** The whole roof behind and around the cast: sky, city, parapet, deck and the depth-sorted props; `cast` items are sorted in. */
export const paintRoof = (p0: Painter, c: YCam, s: RoofState, o: {cast?: Item[]; sprawl?: boolean; replyAfter?: boolean; /** W3 v9 (SH21 lamp off): a night grade on the deck and everything on it; sky and city keep their values. */ tint?: {to: string; u: number}} = {}) => {
  paintRoofSky(p0, c, {t: s.t, cool: s.cool});
  if (o.sprawl) paintSprawl(p0, c, {t: s.t});
  paintCity(p0, c, {cool: s.cool});
  paintFaintStar(p0, c, s.t);
  const p = o.tint ? tintPainter(p0, o.tint.to, o.tint.u, {brush: true}) : p0;
  paintDeck(p, c, s);
  const items: Item[] = [
    {at: [0, 0, -2.3], bias: 50, draw: (q, cc) => paintParapet(q, cc, s)},
    {at: ROOF.dish.foot, draw: (q, cc) => paintDish(q, cc, s)},
    {at: ROOF.tank.c, draw: (q, cc) => paintTank(q, cc)},
    {at: ROOF.ac[0], draw: (q, cc) => paintAC(q, cc, ROOF.ac[0], 0)},
    {at: ROOF.ac[1], draw: (q, cc) => paintAC(q, cc, ROOF.ac[1], 1)},
    {at: [-3.2, 0, 2.7], draw: (q, cc) => paintStair(q, cc)},
    {at: [2.2, 0, 3.2], draw: (q, cc) => paintLaundry(q, cc)},
    {at: ROOF.thermos, draw: (q, cc) => paintThermos(q, cc, s)},
    {at: [-1.28, 0, 1.18], draw: (q, cc) => paintToolbox(q, cc, s)},
    ...(o.cast?.length ? [] : [{at: [0, 0, -0.05] as V3, draw: (q: Painter, cc: YCam) => paintStool(q, cc)}]),
    {at: [-0.48, 0, 0.22], draw: (q, cc) => { paintCrate(q, cc, s); if (!o.replyAfter) paintReplyBox(q, cc, s); }},
    ...(o.cast ?? []),
  ];
  paintSorted(p, c, items);
  if (o.replyAfter) paintReplyBox(p, c, s);
  paintLampGlow(p, c, s);
};

export {inkLine};
