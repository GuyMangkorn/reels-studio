import type {YCam} from '../kit/ycam';
import {checkJoints, JOINT_TOL, paintBeast, type Build, type BeastPlace, type DrawnPoly, type JointRow} from './beast';

// Joint-integrity numbers for the creature kit (Boss, 14 Nov 2026), shared by tests/beast-joints.test.ts and the comp-card report script.
// 3D: `checkJoints` (attach, embed per bone). Picture: every drawn polygon of the creature is rasterised in 2 px cells; the creature is one connected silhouette
// (gaps up to JOINT_TOL.gapPx bridged) and every child bone's raster touches its parent's, so a part drawn without its parent shows up as a count > 1 or a failed bone.

const CELL = 3;
/** A bbox-limited raster on the shared lattice: cell (c, r) of the picture is `a[(r - r0) * w + (c - c0)]`. */
type Grid = {c0: number; r0: number; w: number; h: number; a: Uint8Array};
const mk = (c0: number, r0: number, w: number, h: number): Grid => ({c0, r0, w, h, a: new Uint8Array(Math.max(1, w * h))});
const get = (g: Grid, c: number, r: number) => (c >= g.c0 && r >= g.r0 && c < g.c0 + g.w && r < g.r0 + g.h ? g.a[(r - g.r0) * g.w + (c - g.c0)] : 0);
const set = (g: Grid, c: number, r: number) => { if (c >= g.c0 && r >= g.r0 && c < g.c0 + g.w && r < g.r0 + g.h) g.a[(r - g.r0) * g.w + (c - g.c0)] = 1; };
/** Even-odd scanline fill of a polygon (picture px) plus its edge cells (so hairline claws survive). */
const fill = (g: Grid, poly: [number, number][]) => {
  const ys = poly.map((q) => q[1]), r0 = Math.floor(Math.min(...ys) / CELL), r1 = Math.floor(Math.max(...ys) / CELL);
  for (let r = r0; r <= r1; r++) {
    const y = (r + 0.5) * CELL, xs: number[] = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
    }
    xs.sort((p, q) => p - q);
    for (let i = 0; i + 1 < xs.length; i += 2) for (let c = Math.floor(xs[i] / CELL); c <= Math.floor(xs[i + 1] / CELL); c++) set(g, c, r);
  }
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / CELL));
    for (let k = 0; k <= n; k++) set(g, Math.floor((a[0] + ((b[0] - a[0]) * k) / n) / CELL), Math.floor((a[1] + ((b[1] - a[1]) * k) / n) / CELL));
  }
};
const dilate = (g: Grid, n: number): Grid => {
  const o = mk(g.c0 - n, g.r0 - n, g.w + 2 * n, g.h + 2 * n);
  for (let r = 0; r < g.h; r++) for (let c = 0; c < g.w; c++) if (g.a[r * g.w + c]) for (let dr = -n; dr <= n; dr++) for (let dc = -n; dc <= n; dc++) o.a[(r + n + dr) * o.w + (c + n + dc)] = 1;
  return o;
};
const components = (g: Grid): number => {
  const seen = new Uint8Array(g.a.length), st: number[] = [];
  let n = 0;
  for (let i = 0; i < g.a.length; i++) {
    if (!g.a[i] || seen[i]) continue;
    n++; st.push(i); seen[i] = 1;
    while (st.length) {
      const j = st.pop()!, r = (j / g.w) | 0, c = j % g.w;
      if (r > 0 && g.a[j - g.w] && !seen[j - g.w]) { seen[j - g.w] = 1; st.push(j - g.w); }
      if (r < g.h - 1 && g.a[j + g.w] && !seen[j + g.w]) { seen[j + g.w] = 1; st.push(j + g.w); }
      if (c > 0 && g.a[j - 1] && !seen[j - 1]) { seen[j - 1] = 1; st.push(j - 1); }
      if (c < g.w - 1 && g.a[j + 1] && !seen[j + 1]) { seen[j + 1] = 1; st.push(j + 1); }
    }
  }
  return n;
};
export type PictureRow = {bones: number; hidden: number; components: number; /** bones whose raster does not touch the parent's (dilated by the gap tolerance) */ detached: string[]};
const bbox = (polys: DrawnPoly[]) => {
  const xs = polys.flatMap((d) => d.poly.map((q) => q[0])), ys = polys.flatMap((d) => d.poly.map((q) => q[1]));
  return {c0: Math.floor(Math.min(...xs) / CELL) - 1, r0: Math.floor(Math.min(...ys) / CELL) - 1, c1: Math.floor(Math.max(...xs) / CELL) + 1, r1: Math.floor(Math.max(...ys) / CELL) + 1};
};
/** Picture-space connectivity of one drawn view (`drawn` from `paintBeast`): one silhouette, and every bone touches its parent, with `gapPx` (whole silhouette) and `bonePx` (bone to parent) of tolerance, rounded to whole cells. */
export const pictureCheck = (B: Build, drawn: DrawnPoly[], gapPx: number = JOINT_TOL.gapPx, bonePx: number = JOINT_TOL.bonePx): PictureRow => {
  if (!drawn.length) return {bones: B.bones.length, hidden: B.bones.length, components: 0, detached: []};
  const tol = Math.max(1, Math.round(gapPx / 2 / CELL)), tolB = Math.max(1, Math.round(bonePx / 2 / CELL));
  const bb = bbox(drawn), all = mk(bb.c0, bb.r0, bb.c1 - bb.c0 + 1, bb.r1 - bb.r0 + 1), by = new Map<string, DrawnPoly[]>();
  for (const d of drawn) { fill(all, d.poly as [number, number][]); (by.get(d.bone) ?? by.set(d.bone, []).get(d.bone)!).push(d); }
  const per = new Map<string, Grid>();
  for (const [id, ds] of by) { const b = bbox(ds), g = mk(b.c0, b.r0, b.c1 - b.c0 + 1, b.r1 - b.r0 + 1); ds.forEach((d) => fill(g, d.poly as [number, number][])); per.set(id, g); }
  const detached: string[] = [];
  let hidden = 0;
  for (const b of B.bones) {
    const g = per.get(b.id);
    if (!g) { hidden++; continue; }
    if (!b.parent) continue;
    let up: string | null = b.parent;
    while (up && !per.get(up)) up = B.bones.find((x) => x.id === up)!.parent;   // a fully culled parent: nearest drawn ancestor
    if (!up) continue;
    const pd = dilate(per.get(up)!, tolB);
    let touch = false;
    for (let r = 0; r < g.h && !touch; r++) for (let c = 0; c < g.w; c++) if (g.a[r * g.w + c] && get(pd, g.c0 + c, g.r0 + r)) { touch = true; break; }
    if (!touch) detached.push(b.id);
  }
  return {bones: B.bones.length, hidden, components: components(dilate(all, tol)), detached};
};

/** The views a shot may use: eye-level at 8 headings, high-angle (35 deg) at 4, and top-down (70 deg) at 2. `size` = the creature's longest extent in m (sets the camera scale). */
export const CHECK_VIEWS: {name: string; heading: number; alpha: number}[] = [
  ...[0, 45, 90, 135, 180, 225, 270, 315].map((a) => ({name: `eye@${a}`, heading: (a * Math.PI) / 180, alpha: 0})),
  ...[0, 90, 180, 270].map((a) => ({name: `high35@${a}`, heading: (a * Math.PI) / 180, alpha: 35})),
  ...[0, 90].map((a) => ({name: `top70@${a}`, heading: (a * Math.PI) / 180, alpha: 70})),
];
/** Camera for a check view: 600 px for `size` m, looking at (0, hc, 0) from distance 6 x size, pitched down `alpha`. */
export const viewCam = (size: number, hc: number, alpha: number): YCam => {
  const D = size * 6, al = (alpha * Math.PI) / 180, f = 600 * (D / size);
  return {x: 0, y: hc + D * Math.sin(al), z: D * Math.cos(al), yaw: 0, f, hy: 960, pitch: -al};
};
export type SampleRow = {view: string; picture: PictureRow};
/** Run every check view on one pose; `place` adds e.g. flight pitch/bank. */
export const checkBuild = (B: Build, size: number, hc: number, place: Partial<BeastPlace> = {}): {joints: JointRow[]; views: SampleRow[]} => {
  const joints = checkJoints(B);
  const views = CHECK_VIEWS.map((v) => {
    const a = paintBeast(null, viewCam(size, hc, v.alpha), B, {at: [0, 0], heading: v.heading, ...place});
    return {view: v.name, picture: pictureCheck(B, a.drawn)};
  });
  return {joints, views};
};

/** Picture gap in px (at the camera used) between the raster of bone `a` and bone `b`: 0 when they touch or overlap, else the smallest dilation (in 1-cell steps of CELL px) that makes them touch, capped at `cap` cells (returns cap * CELL + 1 beyond that). Null when either bone is not drawn. */
/** Picture overlap in px^2 between the rasters of bones `a` and `b` (cells of `a` that are also covered by `b`), 0 when apart; null when either is not drawn. A tail that merely touches the body has a small overlap; one buried in it a large one. */
export const boneOverlapPx = (drawn: DrawnPoly[], a: string, b: string): number | null => {
  const da = drawn.filter((d) => d.bone === a), db = drawn.filter((d) => d.bone === b);
  if (!da.length || !db.length) return null;
  const g = (ds: DrawnPoly[]) => { const bb = bbox(ds), gr = mk(bb.c0, bb.r0, bb.c1 - bb.c0 + 1, bb.r1 - bb.r0 + 1); ds.forEach((d) => fill(gr, d.poly as [number, number][])); return gr; };
  const ga = g(da), gb = g(db);
  let n = 0;
  for (let r = 0; r < ga.h; r++) for (let c = 0; c < ga.w; c++) if (ga.a[r * ga.w + c] && get(gb, ga.c0 + c, ga.r0 + r)) n++;
  return n * CELL * CELL;
};
export const boneGapPx = (drawn: DrawnPoly[], a: string, b: string, cap = 12): number | null => {
  const da = drawn.filter((d) => d.bone === a), db = drawn.filter((d) => d.bone === b);
  if (!da.length || !db.length) return null;
  const g = (ds: DrawnPoly[]) => { const bb = bbox(ds), gr = mk(bb.c0, bb.r0, bb.c1 - bb.c0 + 1, bb.r1 - bb.r0 + 1); ds.forEach((d) => fill(gr, d.poly as [number, number][])); return gr; };
  const ga = g(da), gb = g(db);
  for (let n = 0; n <= cap; n++) {
    const d = n ? dilate(ga, n) : ga;
    for (let r = 0; r < gb.h; r++) for (let c = 0; c < gb.w; c++) if (gb.a[r * gb.w + c] && get(d, gb.c0 + c, gb.r0 + r)) return n * CELL;
  }
  return cap * CELL + 1;
};
