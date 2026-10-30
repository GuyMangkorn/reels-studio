import {mixColor, type Pt} from '../kit/painter';
import type {Section} from './space';

// ZCPAINT light kit, figure part (S-P11 partial; Boss pass 7 for the S-P12 look check). Owns the key vector, the two-tone
// cel (`LT-02`), the cast tone (`LT-03`) and the floor projection of a figure. Section receivers (floor and back wall per
// surface), per-shot keys and the room multipliers stay with S-P11 (`VD-ZCP-LIGHT`).

/** Key travel `KEY-SEC-DAY`, L = (Y, z, d) in ZC-UNIT metres (brief `VD-ZCP-LIGHT`): from screen-right, above, camera side. */
export const KEY_SEC_DAY: readonly [number, number, number] = [-0.4, -0.65, 0.5];

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c: number[]) => `#${c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
/** Multiply blend of `col` by the filter colour `by`. */
const mul = (col: string, by: string) => {
  const a = rgb(col), b = rgb(by);
  return hex(a.map((v, i) => (v * b[i]) / 255));
};

/** Cel tone of a lit colour: the lit tone multiplied by the cool plum `#bdb4c0` (`LT-02`, hard edge, no third tone). `step` 0.5 is the
 *  day-three step (`LT-02`: the lit tone mixed 0.5 toward the plum cel). */
export const cel = (col: string, step = 1) => (step >= 1 ? mul(col, '#bdb4c0') : mixColor(col, mul(col, '#bdb4c0'), step));
/** Cast-shadow tone of a receiving surface: its lit tone multiplied by `#9f99b1` (`LT-03`). */
export const castTone = (col: string) => mul(col, '#9f99b1');

const area = (p: Pt[]) => p.reduce((s, [x, y], i) => {
  const [x2, y2] = p[(i + 1) % p.length];
  return s + x * y2 - x2 * y;
}, 0) / 2;

/** Sutherland-Hodgman: `subject` clipped by the convex polygon `clip` (either winding). */
export const clipConvex = (subject: Pt[], clip: Pt[]): Pt[] => {
  const o = Math.sign(area(clip)) || 1;
  let out = subject;
  for (let i = 0; i < clip.length && out.length > 2; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length];
    const side = (p: Pt) => o * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]));
    const cut = (p: Pt, q: Pt): Pt => {
      const sp = side(p), sq = side(q), u = sp / (sp - sq);
      return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
    };
    const inp = out;
    out = [];
    for (let j = 0; j < inp.length; j++) {
      const cur = inp[j], prev = inp[(j + inp.length - 1) % inp.length];
      const ci = side(cur) >= 0, pi = side(prev) >= 0;
      if (ci) {
        if (!pi) out.push(cut(prev, cur));
        out.push(cur);
      } else if (pi) out.push(cut(prev, cur));
    }
  }
  return out;
};

/** Convex hull (monotone chain), counter-clockwise in screen coordinates. */
export const hull = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const p of s) {
    while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
    lo.push(p);
  }
  for (const p of [...s].reverse()) {
    while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
    up.push(p);
  }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

export const shift = (pts: Pt[], [dx, dy]: Pt): Pt[] => pts.map(([x, y]) => [x + dx, y + dy]);

/**
 * Light travel in a figure's local frame: screen travel is (Y, -z) = (-0.4, +0.65) for `KEY_SEC_DAY`. `dir` -1 mirrors the
 * figure to face left, so the travel's x flips with it. The y part is flattened toward horizontal, so the cel band reads as a
 * side band plus the underside (the spike's rule).
 */
export const localTravel = (dir: 1 | -1 = 1, key = KEY_SEC_DAY): Pt => {
  const x = dir * key[0], y = -key[1] * 0.45;
  const n = Math.hypot(x, y) || 1;
  return [x / n, y / n];
};

/**
 * Floor cast of one figure part for the elevation sheet. Local px (ground origin, y down, `pxPerM` px per metre). A point h
 * above the floor lands `kx · h` along the floor in x (`-0.615 h` for the key on the right) and `kd · h` into the scene
 * (`0.769 h`). A flat cut-out has a 0.24 m body depth (`LT-03`), so every point is projected at ±0.12 m. The floor is seen at
 * `floorKy` (15°), so depth shows as a rise on the sheet. Returns the convex hull of the projected points.
 */
export const floorCast = (pts: Pt[], pxPerM: number, dir: 1 | -1 = 1, key = KEY_SEC_DAY, floorKy = 0.26): Pt[] => {
  const kx = (dir * key[0]) / -key[1];
  const kd = key[2] / -key[1];
  const out: Pt[] = [];
  for (const [x, y] of pts) {
    const h = Math.max(0, -y) / pxPerM;
    for (const side of [-0.12, 0.12]) {
      const u = x + kx * h * pxPerM;
      const v = (kd * h + side) * pxPerM;
      out.push([u, -v * floorKy]);
    }
  }
  return hull(out);
};

// --- section key, cast shadows and face tones (S-P11, pass 8) -----------------------------------------------------------

/** Key travel `KEY-SEC-D3` (B09-SH01/SH03): the same direction as `KEY-SEC-DAY`, overcast, so the cel step is half (`LT-02`). */
export const KEY_SEC_D3 = KEY_SEC_DAY;
/** Calibration of the figure frame: 447 px per metre at scale 1 (`SCALE-ZCP-R1`). */
const PX_M_LIGHT = 447;
/** B10 interior key (`KEY-B10`, day three, from behind the camera): travel toward the door (-Y), down, a little toward the balcony (+d). */
export const KEY_B10: readonly [number, number, number] = [-0.5, -0.6, 0.3];
/** The room's back wall in section metres (`rooms.ts` BACK). */
export const SEC_BACK = 3.2;

/** A projection of a stage point (Y along the section or the room, z up, d depth) to plate pixels: `S.P` for sections, `B10_PERSP`. */
export type Proj = (Y: number, z: number, d: number) => Pt;
/** A figure's place for the cast: the ground point (Y, d), the facing `dir`, and the axis its local x runs along (`lat`): 'Y' for a
 *  section profile (body depth along d), 'd' for a figure seen from the front or back (body depth along Y). */
export type CastAt = {Y: number; d: number; dir: 1 | -1; lat?: 'Y' | 'd'};

/** Floor cast of one figure part (`LT-03`): local px (447 px/m, mirrored by `dir`) lifted to 3D with a body depth of 0.24 m, projected
 *  along the key to z = 0, then through `proj`. Returns the hull of the projected points. */
export const castBy = (proj: Proj, pts: Pt[], at: CastAt, key: readonly number[] = KEY_SEC_DAY, pxPerM = PX_M_LIGHT): Pt[] => {
  const kY = key[0] / -key[1], kD = key[2] / -key[1];
  const lat = at.lat ?? 'Y';
  const out: Pt[] = [];
  for (const [x, y] of pts) {
    const X = (at.dir * x) / pxPerM, H = Math.max(0, -y) / pxPerM;
    for (const side of [-0.12, 0.12]) {
      const Y = (lat === 'Y' ? at.Y + X : at.Y + side) + kY * H;
      const d = (lat === 'd' ? at.d + X : at.d + side) + kD * H;
      out.push(proj(Y, 0, d));
    }
  }
  return hull(out);
};

/** Section floor cast of one figure part (`castBy` through the section projection `S.P`, profile lateral axis). */
export const secFloorCast = (S: Section, pts: Pt[], at: {Y: number; d: number; dir: 1 | -1}, key: readonly number[] = KEY_SEC_DAY, pxPerM = PX_M_LIGHT): Pt[] =>
  castBy(S.P, pts, {...at, lat: 'Y'}, key, pxPerM);

/** A solid box that casts (cabinet, fridge, basin, bucket, can row): Y, d and z ranges in metres. */
export type Caster = {y: readonly [number, number]; d: readonly [number, number]; z: readonly [number, number]};

/** Floor shadow of one box: its eight corners lifted along the key to z = 0 (the hull). */
export const boxFloorCast = (S: Section, c: Caster, key: readonly number[] = KEY_SEC_DAY): Pt[] => {
  const kY = key[0] / -key[1], kD = key[2] / -key[1];
  const out: Pt[] = [];
  for (const y of c.y) for (const d of c.d) for (const z of c.z) out.push(S.P(y + kY * z, 0, d + kD * z));
  return hull(out);
};

/** The floor quad of one room between Y y0 and y1 (convex, screen space), for clipping shadows to the room (`RK-26`: floor only). */
export const roomFloorQuad = (S: Section, [y0, y1]: readonly [number, number], back = SEC_BACK): Pt[] => [S.P(y0, 0, 0), S.P(y1, 0, 0), S.P(y1, 0, back), S.P(y0, 0, back)];

/** Lit and cel tones of a box under the section key (`LT-02`): top and +Y side take the lit colour, the camera-facing front the cel tone. */
export const keyFaces = (col: string, light: (c: string) => string, step = 1, top = mixColor(col, '#ffffff', 0.18)) => ({
  front: light(cel(col, step)), top: light(top), side: light(col),
});

