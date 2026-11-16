import {hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camDepth, camPoint, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';

// EDU-EP16 creature kit engine (Boss, 14 Nov 2026): lofted-volume creature painter with an explicit SKELETON, promoted from Film's R1.3/R1.4 look-frame prototype
// (scripts/edu-series/ep16/r13-looks/beasts.ts, starting material). New file, nothing existing is touched; creature builds live in beast-*.ts beside it.
// Why a skeleton (user, 14 Nov 2026: "the joints come apart"): every part belongs to a BONE; every bone except the root hangs on a named JOINT of its parent, the joint
// position is computed from the parent's loft in the pose (`onLoft`), and the child's first key IS that joint, so a part cannot be drawn without its parent. `checkJoints`
// and `drawnBones` (+ tests/beast-joints.test.ts) measure it in 3D and in the picture at every yaw.
type L3 = [number, number, number];   // creature-local metres: s forward (toward the head), y up, l toward the left flank
type Key = {p: L3; a: number; b: number};   // a half-width (along l), b half-height
export const add = (a: L3, b: L3): L3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: L3, b: L3): L3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a: L3, k: number): L3 => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a: L3, b: L3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: L3, b: L3): L3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const nrm = (a: L3): L3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
export const lerp = (a: L3, b: L3, u: number): L3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const crs = (a: number, b: number, c: number, d: number, t: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
export const spline = (ks: Key[], n: number): Key[] => {
  const out: Key[] = [];
  for (let i = 0; i < ks.length - 1; i++) {
    const k0 = ks[Math.max(0, i - 1)], k1 = ks[i], k2 = ks[i + 1], k3 = ks[Math.min(ks.length - 1, i + 2)];
    for (let j = 0; j < n; j++) { const t = j / n; out.push({p: [0, 1, 2].map((q) => crs(k0.p[q], k1.p[q], k2.p[q], k3.p[q], t)) as L3, a: Math.max(0.003, crs(k0.a, k1.a, k2.a, k3.a, t)), b: Math.max(0.003, crs(k0.b, k1.b, k2.b, k3.b, t))}); }
  }
  out.push(ks[ks.length - 1]);
  return out;
};
export const bez3 = (a: L3, b: L3, c: L3, n: number): L3[] => Array.from({length: n + 1}, (_, i) => { const t = i / n, m = 1 - t; return add(add(mul(a, m * m), mul(b, 2 * m * t)), mul(c, t * t)); });

export type {L3, Key};
/** One lofted part of bone `bone`. `col` base colour (a function of the station so a back band / belly can vary). `side` 1 = left flank (l > 0), -1 = right flank: the painter darkens the part
 * one value when that flank faces away from the camera (far limbs behind the near ones at every yaw). `fold` draws wrinkle rings every n stations. */
export type Part = {bone: string; keys: Key[]; m: number; col: (u: number, side: number) => string; side?: 1 | -1; cap?: boolean; fold?: number; ink?: string; /** skin texture: each front quad is cut into n x n scale cells whose colour varies by `amp` (0..1 toward a darker or lighter tone, seeded per cell, so it is stable), `scale` draws a darker scale edge on that share of the cells */ tex?: {n: number; amp: number; scale?: number; warm?: string; /** B-R15B-03: target cell size in screen px; when set the quad is cut into as many cells as keep them about this big (never fewer than `n`, at most `TEX_MAX_N` a side), so a close creature shows fine scales, not a mosaic. Unset = fixed `n` x `n` (other creatures unchanged). */ px?: number}};
/** A flat facet in local metres (frill, wing membrane, claw) of bone `bone`. `two` = seen from both sides; `op` < 255 = translucent wash. */
export type Flat = {bone: string; pts: L3[]; col: string; two?: boolean; op?: number; veins?: L3[][]; ink?: string};
/** A bone: `parent` null for the root; `joint` names the entry of `Build.joints` where it hangs on its parent (the pivot it rotates about). */
export type Bone = {id: string; parent: string | null; joint: string | null};
/** A built creature in one pose: the parts, its skeleton (`bones`, `joints` in creature-local metres) and the anchors the shot code reads. */
/** Opt-in soft look (EDU-EP18 hippo fix round 1, 15 Nov 2026; absent = the faceted kit look byte for byte): `sub` extra stations per loft span and `ring` x ring segments (a rounder,
 * finer loft), continuous light instead of the 4 value bands, a soft `rim` colour on the edges that turn away from the lens, thin low-contrast silhouette `edge` lines (weight),
 * no fold rings, `far` the darkening of the far flank (default 0.28). Meant to sit beside the flat 2D kit animals (painted soft wash) without a style clash. */
export type BeastLook = {sub?: number; ring?: number; rim?: string; rimK?: number; edge?: number; far?: number;
  /** with a `waterline` set, parts and flats on bones whose id contains one of these strings are not painted (legs tucked under the opaque water: their tops sat inside the body
   * above the plane and were depth-sorted in front of it as spikes along the waterline) */
  wetHide?: string[]};
export type Build = {parts: Part[]; flats: Flat[]; bones: Bone[]; joints: Record<string, L3>; feet: L3[]; shadow: {s: number; l: number; rs: number; rl: number}; anchors: Record<string, L3>; look?: BeastLook};

export type BeastPlace = {at: [number, number]; heading: number; ground?: number; /** nose-up pitch and bank about the body axis (rad), for fliers */ pitch?: number; bank?: number; seed?: number; sun?: V3; amb?: string; ambK?: number; shadowOp?: number; haze?: number; hazeCol?: string; /** comp-card skeleton overlay: joint dots and bone links drawn on top, see-through */ rig?: boolean; /** world y of a water plane: parts below it are clipped away (a wader's legs hidden below the knee); the scene paints the water and the splash rings at `waterRing` */ waterline?: number; /** N16-19: draw only the bones for which this is true (parts, flats and the ground shadow), so a creature can be painted as separate depth-sorted items; the shadow goes with `only('body')`-style root bone (the one with no parent) */ /** B-R15B-05 localized light: a warm band along the segment `a`..`b` (creature-local metres), `r` m wide on each side. Only lofted skin quads facing up (normal y > 0.2) take it, never flats (teeth, mouth lining); the core (d < 0.55 r) mixes `k` of `col` into the shaded colour, the edge half of that. */ glow?: {a: L3; b: L3; r: number; col: string; k: number}; only?: (bone: string) => boolean; /** N16-19 depth slab: draw only the quads/flats whose centre is between `d0` and `d1` m (horizontal) from the camera; `shadow` draws the ground shadow with this slab */ slab?: {d0: number; d1: number; shadow?: boolean; /** bone -> world point used for the slab test of ALL its quads (keeps a head in one slab) */ pin?: Record<string, V3>}};
export type DrawnPoly = {bone: string; poly: Pt[]};
export type BeastAnchors = {drawn: DrawnPoly[]; /** creature-local metres to world metres in this placement */ toWorld: (q: L3) => V3; pt: (name: string) => Pt | null; world: (name: string) => V3; left: number; right: number; top: number; bottom: number};

const SUN: L3 = nrm([-0.4, 0.85, 0.35]);
/** Paint a build through the yaw camera (`p` null = probe only). */
/** B-R15B-03: most cells a side when `tex.px` asks for fine cells. */
export const TEX_MAX_N = 14;
/** Cells a side for a quad of screen-pixel edge lengths `eu`, `ev` (B-R15B-03): `n` when `px` is unset, else enough cells for `px`-sized squares, clamped to [n, TEX_MAX_N]. */
export const texCells = (n: number, px: number | undefined, eu: number, ev: number): number => (px ? Math.min(TEX_MAX_N, Math.max(n, Math.round(Math.max(eu, ev) / px))) : n);
export const paintBeast = (p: Painter | null, c: YCam, B: Build, o: BeastPlace): BeastAnchors => {
  const h = o.heading, fx = Math.cos(h), fz = Math.sin(h), lx = Math.sin(h), lz = -Math.cos(h), gy = o.ground ?? 0, seed = o.seed ?? 70000;
  const pc = Math.cos(o.pitch ?? 0), ps = Math.sin(o.pitch ?? 0), bc = Math.cos(o.bank ?? 0), bs = Math.sin(o.bank ?? 0);
  const rot = ([s0, y0, l0]: L3): L3 => { const y1 = y0 * bc - l0 * bs, l1 = y0 * bs + l0 * bc; return [s0 * pc - y1 * ps, s0 * ps + y1 * pc, l1]; };
  const W = (q: L3): V3 => { const [s, y, l] = rot(q); return [o.at[0] + s * fx + l * lx, gy + y, o.at[1] + s * fz + l * lz]; };
  const WN = (q: L3): L3 => { const [s, y, l] = rot(q); return [s * fx + l * lx, y, s * fz + l * lz]; };
  const sun = o.sun ? nrm(o.sun as L3) : SUN, cam: L3 = [c.x, c.y, c.z];
  const toward = (pl: L3, nl: L3) => dot(WN(nl), sub(cam, W(pl) as L3)) > 0;
  const gl = o.glow, glowAt = (pl: L3, n: L3): number => { if (!gl || n[1] < 0.2) return 0; const ab = sub(gl.b, gl.a), t = clamp(dot(sub(pl, gl.a), ab) / (dot(ab, ab) || 1)), d = Math.hypot(...sub(pl, add(gl.a, mul(ab, t)))); return d < gl.r * 0.55 ? gl.k : d < gl.r ? gl.k * 0.5 : 0; };
  const LK = B.look;
  const shade = (col: string, nl: L3, dim: number, pl: L3, lit = false) => {
    const n = WN(nl), lam = Math.max(0, dot(n, sun)), band = lam < 0.12 ? 0 : lam < 0.4 ? 1 : lam < 0.7 ? 2 : 3;
    let k: string;
    if (LK) {   // soft look: a gentle continuous ramp (lighter shadow side) plus a soft rim where the surface turns away from the lens
      const r = clamp(lam * 1.1), e = r * r * (3 - 2 * r);
      k = mixColor(mixColor(col, '#1a1714', 0.3), mixColor(col, '#f6eedc', 0.2), 0.12 + 0.88 * e);
      if (LK.rim) { const v = nrm(sub(cam, W(pl) as L3)), fr = clamp((1 - Math.abs(dot(n, v)) - 0.55) / 0.45); k = mixColor(k, LK.rim, (LK.rimK ?? 0.35) * fr * fr); }
    } else k = mixColor(mixColor(col, '#16140f', 0.42), mixColor(col, '#f4ecd0', 0.22), [0, 0.38, 0.7, 1][band]);
    if (n[1] < -0.35) k = mixColor(k, '#2a2a1e', 0.12);   // belly bounce stays cool and dark
    if (pl[1] < 0.6) k = mixColor(k, '#1c1a14', 0.18 * (1 - pl[1] / 0.6));   // contact darkening toward the ground
    if (lit) { const g = glowAt(pl, n); if (g) k = mixColor(k, gl!.col, g); }
    k = mixColor(k, '#0e0d0a', dim);
    if (o.haze) k = mixColor(k, o.hazeCol ?? '#dfe8d4', o.haze);
    return o.amb ? mixColor(k, o.amb, o.ambK ?? 0.1) : k;
  };
  const grow = (q: Pt[], k = 0.6): Pt[] => { const mx = q.reduce((a, v) => a + v[0], 0) / q.length, my = q.reduce((a, v) => a + v[1], 0) / q.length; return q.map(([x, y]) => { const dx = x - mx, dy = y - my, l = Math.hypot(dx, dy) || 1; return [x + (dx / l) * k, y + (dy / l) * k]; }); };
  const inSlab = (w: V3, bone?: string) => { if (!o.slab) return true; const pw = bone ? o.slab.pin?.[bone] : undefined; if (pw) w = pw; const d = Math.hypot(w[0] - c.x, w[2] - c.z); return d >= o.slab.d0 && d < o.slab.d1; };
  const items: {d: number; f: () => void}[] = [];
  const all: Pt[] = [];
  let id = 0;
  const drawn: DrawnPoly[] = [];
  for (const part of B.parts) {
    if ((o.only && !o.only(part.bone)) || (LK?.wetHide && o.waterline !== undefined && LK.wetHide.some((w) => part.bone.includes(w)))) { id++; continue; }   // keep the part ids (and so every fill seed) the same as in an unsplit paint
    const ks = LK?.sub && part.keys.length > 2 ? spline(part.keys, LK.sub) : part.keys, n = ks.length, m = LK?.ring ? Math.round(part.m * LK.ring) : part.m;
    const mid = ks[Math.floor(n / 2)].p, far = part.side ? dot(WN([0, 0, part.side]), nrm(sub(W(mid) as L3, cam))) > 0.2 : false, dim = far ? LK?.far ?? 0.28 : 0;
    const rv: L3[][] = [], rn: L3[][] = [];
    ks.forEach((k, i) => {
      const T = nrm(sub(ks[Math.min(n - 1, i + 1)].p, ks[Math.max(0, i - 1)].p));
      let X = sub([0, 0, 1], mul(T, T[2]));
      if (Math.hypot(...X) < 0.05) X = sub([0, 1, 0], mul(T, T[1]));
      X = nrm(X);
      const Y = cross(X, T);
      const Yu: L3 = Y[1] < 0 ? mul(Y, -1) : Y;
      rv.push([]); rn.push([]);
      for (let j = 0; j < m; j++) { const th = (j / m) * Math.PI * 2, cs = Math.cos(th), sn = Math.sin(th); rv[i].push(add(k.p, add(mul(X, k.a * cs), mul(Yu, k.b * sn)))); rn[i].push(nrm(add(mul(X, cs / k.a), mul(Yu, sn / k.b)))); }
    });
    const scr = rv.map((r) => r.map((v) => camPoint(c, W(v))));
    const front: boolean[][] = [];
    for (let i = 0; i < n - 1; i++) { front.push([]); for (let j = 0; j < m; j++) { const j2 = (j + 1) % m, ctr = mul(add(add(rv[i][j], rv[i][j2]), add(rv[i + 1][j], rv[i + 1][j2])), 0.25), nl = nrm(add(add(rn[i][j], rn[i][j2]), add(rn[i + 1][j], rn[i + 1][j2]))); front[i].push(toward(ctr, nl)); } }
    const pid = id++;
    for (let i = 0; i < n - 1; i++) for (let j = 0; j < m; j++) {
      if (!front[i][j]) continue;
      const j2 = (j + 1) % m;
      let q: (Pt | null)[] = [scr[i][j], scr[i][j2], scr[i + 1][j2], scr[i + 1][j]];
      if (o.waterline !== undefined) {   // clip the quad to the part above the water plane (in world metres), then project
        const wq = [rv[i][j], rv[i][j2], rv[i + 1][j2], rv[i + 1][j]].map((v) => W(v));
        if (Math.max(...wq.map((v) => v[1])) <= o.waterline) continue;
        if (Math.min(...wq.map((v) => v[1])) < o.waterline) {
          const out: V3[] = [];
          wq.forEach((a, k) => { const b = wq[(k + 1) % 4], ina = a[1] >= o.waterline!, inb = b[1] >= o.waterline!; if (ina) out.push(a); if (ina !== inb) { const u = (o.waterline! - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * u, o.waterline!, a[2] + (b[2] - a[2]) * u]); } });
          q = out.map((v) => camPoint(c, v));
        }
      }
      if (!q.every(Boolean)) continue;
      const ctr = mul(add(add(rv[i][j], rv[i][j2]), add(rv[i + 1][j], rv[i + 1][j2])), 0.25), nl = nrm(add(add(rn[i][j], rn[i][j2]), add(rn[i + 1][j], rn[i + 1][j2])));
      if (!inSlab(W(ctr), part.bone)) continue;
      const col = shade(part.col(i / (n - 1), nl[1]), nl, dim, ctr, true), qq = q as Pt[];
      all.push(...qq); drawn.push({bone: part.bone, poly: qq});
      const edges: [Pt, Pt][] = [];
      if (qq.length === 4 && !front[i][(j + m - 1) % m]) edges.push([qq[0], qq[3]]);
      if (qq.length === 4 && !front[i][j2]) edges.push([qq[1], qq[2]]);
      const fold = !LK && part.fold && i % part.fold === 0 && i > 0 && Math.abs(nl[1]) < 0.85;
      const fid = seed + pid * 4000 + i * m + j;
      items.push({d: camDepth(c, W(ctr)), f: () => {
        if (!p) return;
        hardFill(p, fid, col, grow(qq));
        if (part.tex && qq.length === 4) {   // scale cells: bilinear n x n cut of the quad, each cell jittered in value (and warmth), a share with a darker lower-left edge
          const {amp, scale: sc = 0, warm} = part.tex, tn = texCells(part.tex.n, part.tex.px, Math.max(Math.hypot(qq[1][0] - qq[0][0], qq[1][1] - qq[0][1]), Math.hypot(qq[2][0] - qq[3][0], qq[2][1] - qq[3][1])), Math.max(Math.hypot(qq[3][0] - qq[0][0], qq[3][1] - qq[0][1]), Math.hypot(qq[2][0] - qq[1][0], qq[2][1] - qq[1][1]))), bl = (u: number, v: number): Pt => { const a: Pt = [qq[0][0] + (qq[1][0] - qq[0][0]) * u, qq[0][1] + (qq[1][1] - qq[0][1]) * u], b: Pt = [qq[3][0] + (qq[2][0] - qq[3][0]) * u, qq[3][1] + (qq[2][1] - qq[3][1]) * u]; return [a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v]; };
          for (let cu = 0; cu < tn; cu++) for (let cv = 0; cv < tn; cv++) {
            const hsh = Math.sin((fid * 12.9898 + cu * 78.233 + cv * 37.719) * 0.5) * 43758.5453, r = hsh - Math.floor(hsh), r2 = Math.sin(hsh * 1.7) * 0.5 + 0.5;
            let cc = r < 0.5 ? mixColor(col, '#0e0c08', amp * (1 - r * 2)) : mixColor(col, '#f4ecd0', amp * 0.8 * (r * 2 - 1));
            if (warm && r2 > 0.7) cc = mixColor(cc, warm, 0.18);
            const cell = [bl(cu / tn, cv / tn), bl((cu + 1) / tn, cv / tn), bl((cu + 1) / tn, (cv + 1) / tn), bl(cu / tn, (cv + 1) / tn)];
            hardFill(p, fid * (tn > 4 ? 256 : 16) + cu * tn + cv + 7, cc, grow(cell, 0.35));
            if (r2 < sc) inkLine(p, fid * (tn > 4 ? 256 : 16) + 5000000 + cu * tn + cv, [cell[0], cell[3], cell[2]], {closed: false, weight: 0.35, color: mixColor(cc, '#14100a', 0.45), still: true});
          }
        }
        if (fold) inkLine(p, fid + 900000, [qq[0], qq[1]], {closed: false, weight: 0.5, color: mixColor(col, '#1a1a16', 0.35), still: true});
        edges.forEach(([a, b], e) => inkLine(p, fid + 500000 + e, [a, b], {closed: false, weight: LK ? LK.edge ?? 0.6 : 1.1, color: part.ink ?? mixColor(col, '#100e0a', LK ? 0.32 : 0.6), still: true}));
      }});
    }
    if (part.cap) for (const end of [n - 1, 0]) {   // end caps (closed tubes): drawn when facing the camera, and counted in the silhouette
      let q: (Pt | null)[] = scr[end];
      const nl = end ? nrm(sub(ks[n - 1].p, ks[n - 2].p)) : nrm(sub(ks[0].p, ks[1].p));
      if (o.waterline !== undefined) {   // EDU-EP18 (15 Nov 2026): caps are clipped to the water plane like the quads (a submerged snout/chin cap was drawn over the water)
        const wl = o.waterline, wq = rv[end].map((v) => W(v));
        if (Math.max(...wq.map((v) => v[1])) <= wl) continue;
        if (Math.min(...wq.map((v) => v[1])) < wl) {
          const cl: V3[] = [];
          wq.forEach((a, k) => { const b = wq[(k + 1) % wq.length], ina = a[1] >= wl, inb = b[1] >= wl; if (ina) cl.push(a); if (ina !== inb) { const u = (wl - a[1]) / (b[1] - a[1]); cl.push([a[0] + (b[0] - a[0]) * u, wl, a[2] + (b[2] - a[2]) * u]); } });
          if (cl.length < 3) continue;
          q = cl.map((v) => camPoint(c, v));
        }
      }
      if (q.every(Boolean) && toward(ks[end].p, nl) && inSlab(W(ks[end].p), part.bone)) { const col = shade(part.col(end ? 1 : 0, 0), nl, dim, ks[end].p), cq = q as Pt[]; drawn.push({bone: part.bone, poly: cq}); all.push(...cq); items.push({d: camDepth(c, W(ks[end].p)) - 0.02, f: () => { if (p) hardFill(p, seed + pid * 4000 + 3999 - end, col, grow(cq, 1)); }}); }
    }
  }
  B.flats.forEach((fl, k) => {
    if ((o.only && !o.only(fl.bone)) || (LK?.wetHide && o.waterline !== undefined && LK.wetHide.some((w) => fl.bone.includes(w)))) return;
    if (o.waterline !== undefined && fl.pts.every((v) => W(v)[1] <= o.waterline!)) return;
    let q = fl.pts.map((v) => camPoint(c, W(v)));
    if (o.waterline !== undefined && fl.pts.some((v) => W(v)[1] < o.waterline!)) {   // EDU-EP18: a flat crossing the water plane is clipped to its part above
      const wl = o.waterline, wq = fl.pts.map((v) => W(v)), cl: V3[] = [];
      wq.forEach((a, k) => { const b = wq[(k + 1) % wq.length], ina = a[1] >= wl, inb = b[1] >= wl; if (ina) cl.push(a); if (ina !== inb) { const u = (wl - a[1]) / (b[1] - a[1]); cl.push([a[0] + (b[0] - a[0]) * u, wl, a[2] + (b[2] - a[2]) * u]); } });
      if (cl.length < 3) return;
      q = cl.map((v) => camPoint(c, v));
    }
    if (!q.every(Boolean)) return;
    const ctr = mul(fl.pts.reduce((a, v) => add(a, v), [0, 0, 0] as L3), 1 / fl.pts.length);
    let nl = nrm(cross(sub(fl.pts[1], fl.pts[0]), sub(fl.pts[fl.pts.length - 1], fl.pts[0])));
    if (!inSlab(W(ctr), fl.bone)) return;
    if (!toward(ctr, nl)) { if (!fl.two) return; nl = mul(nl, -1); }
    const col = fl.op !== undefined && fl.op < 255 ? mixColor(fl.col, shade(fl.col, nl, 0, ctr), 0.3) : shade(fl.col, nl, 0, ctr), qq = q as Pt[];   // translucent sheets stay pale, only lightly shaded
    all.push(...qq); drawn.push({bone: fl.bone, poly: qq});
    items.push({d: camDepth(c, W(ctr)), f: () => {
      if (!p) return;
      if (fl.op !== undefined && fl.op < 255) washAt(p, seed + 300000 + k, col, fl.op, qq, 0, 0.15); else hardFill(p, seed + 300000 + k, col, grow(qq, 0.5));
      (fl.veins ?? []).forEach((v, vi) => { const vq = v.map((x) => camPoint(c, W(x))); if (vq.every(Boolean)) inkLine(p, seed + 310000 + k * 40 + vi, vq as Pt[], {closed: false, weight: 0.55, color: fl.ink ?? mixColor(col, '#2a1a14', 0.6), still: true}); });
      if (fl.ink) inkLine(p, seed + 320000 + k, qq, {closed: true, weight: 0.6, color: fl.ink, still: true});
    }});
  });
  // ground shadow first (under everything)
  if (p && B.shadow.rs > 0 && (!o.only || o.only(B.bones.find((b) => b.parent === null)!.id)) && (!o.slab || o.slab.shadow)) {
    const sh = B.shadow, ring = Array.from({length: 24}, (_, j) => camPoint(c, W([sh.s + sh.rs * Math.cos((j / 24) * 6.283), -gy + gy + 0.01, sh.l + sh.rl * Math.sin((j / 24) * 6.283)])));
    if (ring.every(Boolean)) washAt(p, seed + 99, '#1e2418', o.shadowOp ?? 110, ring as Pt[], 0.35, 0.2);
    B.feet.forEach((f, i) => { const pr = Array.from({length: 14}, (_, j) => camPoint(c, W([f[0] + 0.5 * Math.cos((j / 14) * 6.283) * (B.shadow.rs / 6 + 0.3), 0.012, f[2] + 0.4 * Math.sin((j / 14) * 6.283) * (B.shadow.rs / 6 + 0.3)]))); if (f[1] < 0.2 && pr.every(Boolean)) washAt(p, seed + 120 + i, '#141810', 150, pr as Pt[], 0.2, 0.2); });
  }
  items.sort((x, y) => y.d - x.d).forEach((it) => it.f());
  if (p && o.rig) {
    const rootB = B.bones.find((b) => b.parent === null)!, rk = B.parts.find((x) => x.bone === rootB.id)!.keys, rootPos = rk[Math.floor(rk.length / 2)].p;
    const posOf = (b: Bone): L3 => (b.joint ? B.joints[b.joint] : rootPos);
    B.bones.forEach((b, i) => {
      if (!b.parent) return;
      const a = camPoint(c, W(posOf(B.bones.find((x) => x.id === b.parent)!))), z = camPoint(c, W(B.joints[b.joint!]));
      if (a && z) { inkLine(p, seed + 700000 + i, [a, z], {closed: false, weight: 1.6, color: '#ffd23a', still: true}); }
    });
    B.bones.forEach((b, i) => { const z = b.parent ? camPoint(c, W(B.joints[b.joint!])) : camPoint(c, W(rootPos)); if (z) hardFill(p, seed + 710000 + i, b.parent ? '#e0301e' : '#2a6ae0', Array.from({length: 10}, (_, k) => [z[0] + 6 * Math.cos((k / 10) * 6.283), z[1] + 6 * Math.sin((k / 10) * 6.283)] as Pt)); });
  }
  const xs = all.map((q) => q[0]), ys = all.map((q) => q[1]);
  return {drawn, toWorld: (q) => W(q), pt: (n) => (B.anchors[n] ? camPoint(c, W(B.anchors[n])) : null), world: (n) => W(B.anchors[n] ?? [0, 0, 0]), left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys)};
};


// ------------------------------------------------------------------ skeleton builder
/** Builder for one pose. `bone(id, parent, joint, at)` registers a bone hanging on a named joint of its parent (`at` = the joint in creature metres, computed by the caller from the
 * parent's loft with `onLoft`, never typed in on its own); `loft` / `flat` add geometry to a bone, so no part exists without a bone and no bone without a parent. */
export const newRig = () => {
  const B: Build = {parts: [], flats: [], bones: [], joints: {}, feet: [], shadow: {s: 0, l: 0, rs: 0, rl: 0}, anchors: {}};
  const R = {
    B,
    bone(id: string, parent: string | null, joint: string | null = null, at?: L3) {
      if (B.bones.some((b) => b.id === id)) throw new Error(`bone ${id} twice`);
      if (parent !== null && !B.bones.some((b) => b.id === parent)) throw new Error(`bone ${id}: parent ${parent} is not registered yet`);
      if (joint) { if (!at) throw new Error(`joint ${joint} has no position`); B.joints[joint] = at; }
      B.bones.push({id, parent, joint});
      return id;
    },
    loft(bone: string, part: Omit<Part, 'bone'>) { B.parts.push({...part, bone}); },
    flat(bone: string, fl: Omit<Flat, 'bone'>) { B.flats.push({...fl, bone}); },
  };
  return R;
};
export type Rig = ReturnType<typeof newRig>;

/** A point on a spline loft: `u` 0..1 along it, `lat` -1..1 of the half-width toward the left flank, `up` -1..1 of the half-height. Joints are taken from here. */
export const onLoft = (keys: Key[], u: number, lat = 0, up = 0): L3 => {
  const t = clamp(u) * (keys.length - 1), i = Math.min(keys.length - 2, Math.floor(t)), f = t - i, a = keys[i], b = keys[i + 1];
  const p = lerp(a.p, b.p, f), A = a.a + (b.a - a.a) * f, Bh = a.b + (b.b - a.b) * f;
  return [p[0], p[1] + up * Bh, p[2] + lat * A];
};
/** The interpolated key (centre and radii) at `u` along a loft. */
export const keyAt = (keys: Key[], u: number): Key => {
  const t = clamp(u) * (keys.length - 1), i = Math.min(keys.length - 2, Math.floor(t)), f = t - i, a = keys[i], b = keys[i + 1];
  return {p: lerp(a.p, b.p, f), a: a.a + (b.a - a.a) * f, b: a.b + (b.b - a.b) * f};
};
/** Two-bone IK: the middle joint (knee/elbow) of a limb with segment lengths `l1`, `l2` from `hip` to `foot`, bending toward `bend`. The foot is pulled in if out of reach, so lengths stay constant. */
export const ik2 = (hip: L3, foot: L3, l1: number, l2: number, bend: L3): L3 => {
  let v = sub(foot, hip), d = Math.hypot(...v);
  const dm = (l1 + l2) * 0.9995; if (d > dm) { v = mul(v, dm / d); d = dm; }
  const u = nrm(v), a = (d * d + l1 * l1 - l2 * l2) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  let pb = sub(bend, mul(u, dot(bend, u))); if (Math.hypot(...pb) < 1e-6) pb = [0, 1, 0]; pb = nrm(pb);
  return add(add(hip, mul(u, a)), mul(pb, h));
};
/** The fraction `u` along a (nearly horizontal) loft at which its station x = `s`. */
export const uOfS = (keys: Key[], s: number): number => {
  for (let i = 0; i < keys.length - 1; i++) { const x0 = keys[i].p[0], x1 = keys[i + 1].p[0]; if ((s - x0) * (s - x1) <= 0 && x0 !== x1) return (i + (s - x0) / (x1 - x0)) / (keys.length - 1); }
  return keys[0].p[0] > keys[keys.length - 1].p[0] ? (s > keys[0].p[0] ? 0 : 1) : (s < keys[0].p[0] ? 0 : 1);
};
/** A ball of radius `r` (a short two-way loft along `dir`) centred on `at`: closes the outer wedge where two tube segments bend at a joint; its axis passes through the joint. */
export const ballKeys = (at: L3, r: number, dir: L3): Key[] => { const d = nrm(dir); return [{p: sub(at, mul(d, r * 0.95)), a: r * 0.35, b: r * 0.35}, {p: sub(at, mul(d, r * 0.6)), a: r * 0.85, b: r * 0.85}, {p: at, a: r, b: r}, {p: add(at, mul(d, r * 0.6)), a: r * 0.85, b: r * 0.85}, {p: add(at, mul(d, r * 0.95)), a: r * 0.35, b: r * 0.35}]; };

export const band = (base: string, back: string, belly: string, k = 0.5) => (_u: number, side: number) => (side > k ? back : side < -0.3 ? belly : base);

/** Leg of three bones `<id>.thigh` (joint `<id>.hip`), `<id>.shin` (joint `<id>.knee`), `<id>.foot` (joint `<id>.ankle`); every joint is a ball so a bent leg never opens a wedge. The hip joint is `hip` (on the
 * parent's loft, from `onLoft`). Radii r = [hip, knee, ankle, pad]. Toes are two-sided facets of the foot bone rooted on the pad. */
export const limb = (R: Rig, o: {id: string; parent: string; hip: L3; knee: L3; foot: L3; r: [number, number, number, number]; col: Part['col']; side: 1 | -1; toes?: number; toeCol?: string; toeLen?: number; fwd?: L3; /** digitigrade foot: the ball of the foot on the ground, the `foot` joint being the raised ankle (the foot bone is then a long metatarsus from the ankle to here) */ pad?: L3; /** skin texture on every part of the limb */ tex?: Part['tex']; /** least half-height (m) of the foot at the pad; default 0.06 (pad) / 0.05 (no pad), sized for the large creatures; a small creature passes its own */ padMin?: number}) => {
  const loft = (b: string, part: Omit<Part, 'bone'>) => R.loft(b, {...part, tex: o.tex});
  const {id, hip, knee, foot, r, col, side} = o, fwd = o.fwd ?? [1, 0, 0];
  const th = R.bone(`${id}.thigh`, o.parent, `${id}.hip`, hip), sh = R.bone(`${id}.shin`, th, `${id}.knee`, knee), ft = R.bone(`${id}.foot`, sh, `${id}.ankle`, foot);
  loft(th, {m: 8, col, side, keys: ballKeys(hip, r[0] * 1.02, sub(knee, hip))});
  loft(th, {m: 10, col, side, fold: 3, keys: spline([{p: hip, a: r[0], b: r[0] * 1.05}, {p: lerp(hip, knee, 0.5), a: (r[0] + r[1]) * 0.55, b: (r[0] + r[1]) * 0.58}, {p: knee, a: r[1], b: r[1]}], 3)});
  loft(sh, {m: 8, col, side, keys: ballKeys(knee, r[1] * 1.08, sub(foot, knee))});
  loft(sh, {m: 10, col, side, fold: 3, keys: spline([{p: knee, a: r[1], b: r[1]}, {p: lerp(knee, foot, 0.5), a: (r[1] + r[2]) * 0.5, b: (r[1] + r[2]) * 0.5}, {p: foot, a: r[2], b: r[2]}], 3)});
  const padc = o.pad ?? add(foot, add(mul(fwd, r[3] * 0.55), [0, -0.0, 0]));
  loft(ft, {m: 8, col, side, keys: ballKeys(foot, r[2] * 1.1, [0, 1, 0])});
  loft(ft, {m: 10, col, side, keys: o.pad ? spline([{p: foot, a: r[2], b: r[2]}, {p: lerp(foot, padc, 0.5), a: (r[2] + r[3]) * 0.5, b: (r[2] + r[3]) * 0.5}, {p: padc, a: r[3], b: Math.max(o.padMin ?? 0.06, r[3] * 0.45)}], 3) : spline([{p: foot, a: r[2], b: r[2]}, {p: add(foot, [0, -0.0, 0]), a: r[3] * 0.95, b: r[3] * 0.6}, {p: padc, a: r[3] * 1.0, b: Math.max(o.padMin ?? 0.05, r[3] * 0.32)}], 2)});
  if (o.toes && o.toeCol) for (let t = 0; t < o.toes; t++) {
    const ang = (t - (o.toes - 1) / 2) * 0.5, L = o.toeLen ?? r[3], base = add(padc, [r[3] * 0.4 * Math.cos(ang), 0.02, r[3] * 0.9 * Math.sin(ang) * 0.7]);
    R.flat(ft, {pts: [foot, add(base, [0, 0.1, -0.07 * L / 0.3]), add(base, [0.45 * L, 0.0, 0.0 + 0.9 * L * Math.sin(ang) * 0.4]), add(base, [0, 0.0, 0.07 * L / 0.3])], col: o.toeCol, two: true});
  }
  R.B.feet.push(foot);
  return {thigh: th, shin: sh, foot: ft};
};

// ------------------------------------------------------------------ joint integrity (numbers the comp card and tests/beast-joints.test.ts state)
export type JointRow = {bone: string; parent: string; joint: string; /** metres from the joint to the child's root part axis (must be ~0: the child hangs on its joint) */ attach: number; /** the joint's distance from the parent's axis as a fraction of the parent's radius there (<= 1: inside the parent) */ embed: number};
export const JOINT_TOL = {attach: 0.001, embed: 1.0, /** px (at 1080 wide) of silhouette gap between a bone and its parent, and between any two parts of the whole creature */ gapPx: 6, /** px of tolerance for a bone touching its parent: the parent's silhouette is built from front-facing quads only, so at a contour it undershoots by up to one quad (eyes, brows) */ bonePx: 12} as const;
const axisDist = (keys: Key[], p: L3): {d: number; r: number} => {
  let best = {d: Infinity, r: 1};
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i].p, b = keys[i + 1].p, ab = sub(b, a), l2 = dot(ab, ab) || 1e-9, t = clamp(dot(sub(p, a), ab) / l2), q = add(a, mul(ab, t)), d = Math.hypot(...sub(p, q));
    if (d < best.d) best = {d, r: Math.max(keys[i].a + (keys[i + 1].a - keys[i].a) * t, keys[i].b + (keys[i + 1].b - keys[i].b) * t)};
  }
  return best;
};
/** One row per child bone: where it hangs and how deep the joint sits in its parent. Throws on a part or bone with no registered parent chain to the root. */
export const checkJoints = (B: Build): JointRow[] => {
  const ids = new Set(B.bones.map((b) => b.id)), rows: JointRow[] = [];
  const roots = B.bones.filter((b) => b.parent === null);
  if (roots.length !== 1) throw new Error(`expected one root bone, got ${roots.length}`);
  for (const pt of B.parts) if (!ids.has(pt.bone)) throw new Error(`part on unknown bone ${pt.bone}`);
  for (const fl of B.flats) if (!ids.has(fl.bone)) throw new Error(`flat on unknown bone ${fl.bone}`);
  for (const b of B.bones) {
    let up: string | null = b.id, hops = 0;
    while (up && hops++ < 50) up = B.bones.find((x) => x.id === up)!.parent;
    if (up !== null) throw new Error(`bone ${b.id} does not reach the root`);
    if (b.parent === null) continue;
    const j = B.joints[b.joint!], own = B.parts.find((x) => x.bone === b.id), par = B.parts.filter((x) => x.bone === b.parent);
    if (!j || !par.length) throw new Error(`bone ${b.id}: joint or parent geometry missing`);
    let attach: number;
    if (own) attach = axisDist(own.keys, j).d;
    else { const fl = B.flats.filter((x) => x.bone === b.id); if (!fl.length) throw new Error(`bone ${b.id} has no geometry`); attach = Math.min(...fl.flatMap((x) => x.pts).map((q) => Math.hypot(...sub(q, j)))); }
    const embed = Math.min(...par.map((x) => { const pa = axisDist(x.keys, j); return pa.d / pa.r; }));
    rows.push({bone: b.id, parent: b.parent, joint: b.joint!, attach, embed});
  }
  return rows;
};
/** `foot` pulled toward `hip` until a two-bone limb of lengths `l1`, `l2` reaches it. */
export const clampReach = (hip: L3, foot: L3, l1: number, l2: number): L3 => { const v = sub(foot, hip), d = Math.hypot(...v), dm = (l1 + l2) * 0.9995; return d > dm ? add(hip, mul(v, dm / d)) : foot; };
/** Sauropod-style gait foot: `ph` 0..1 phase of this foot, `duty` share on the ground, stride `S` m. Returns [ds (m along s, + forward), lift (m)]: the foot slides back on the ground, then swings forward lifted. */
export const gaitFoot = (ph: number, S: number, duty: number, lift: number): [number, number] => {
  const t = ((ph % 1) + 1) % 1;
  return t < duty ? [S / 2 - S * (t / duty), 0] : [-S / 2 + S * ((t - duty) / (1 - duty)), lift * Math.sin(Math.PI * (t - duty) / (1 - duty))];
};

// ------------------------------------------------------------------ root continuity (added 14 Nov 2026 after "the tail comes away from the body in some frames": the joint-integrity numbers passed on a tail that left a step and a notch at its root)
export type RootRow = {bone: string; joint: string; /** child's radius at its joint (m): the largest radius of the child's key nearest the joint, over its parts */ childR: number; /** parent's radius at the joint (m) */ parentR: number; /** childR / parentR: ~1 = the child leaves the parent without a step, << 1 = a thin stalk stuck on a fat body */ ratio: number; /** joint's distance from the parent's axis / parent radius (< 0.6 = well buried) */ embed: number; /** axis length (m) of the parent's loft from the joint to its nearer end, divided by childR: < ~0.3 = the child is stuck on the parent's end face instead of growing out of its body */ buried: number};
export const ROOT_TOL = {/** a thick bone (childR >= minR m) must leave its parent with ratio in [min, max] */ /** the bones this applies to: the ones that continue the parent's axis (tail, neck, head, skull) */ axial: /^(tail|neck|head|skull)$/, minR: 0.3, min: 0.6, max: 1.2, /** buried: nearer-end distance / childR, required of fat roots (childR >= buriedFrom m) */ buried: 0.3, buriedFrom: 0.9, /** picture: overlap area of the child's raster with its parent's, over (childR in px)^2, in every view where both are drawn */ overlap: 0.5, /** and its joint must lie this deep inside the parent (fraction of the parent radius) */ embed: 0.6} as const;
/** One row per child bone with its own loft: radius step and burial depth at the joint (3D). */
export const checkRoots = (B: Build): RootRow[] => {
  const rows: RootRow[] = [];
  for (const b of B.bones) {
    if (!b.parent) continue;
    const j = B.joints[b.joint!], own = B.parts.filter((x) => x.bone === b.id), par = B.parts.filter((x) => x.bone === b.parent);
    if (!own.length || !par.length) continue;
    let childR = 0, bestD = Infinity;
    for (const p of own) for (const k of p.keys) { const d = Math.hypot(...sub(k.p, j)); if (d < bestD - 1e-9 || (Math.abs(d - bestD) < 1e-9 && Math.max(k.a, k.b) > childR)) { bestD = d; childR = Math.max(k.a, k.b); } }
    let pr = {d: Infinity, r: 1}; for (const x of par) { const a = axisDist(x.keys, j); if (a.d / a.r < pr.d / pr.r) pr = a; }
    const big = par.reduce((m, x) => (x.keys.length > m.keys.length ? x : m), par[0]);
    let best = Infinity, run = 0, tot = 0, at = 0; { let bd = Infinity; const ks = big.keys; for (let i = 0; i < ks.length - 1; i++) { const a0 = ks[i].p, ab = sub(ks[i + 1].p, a0), l = Math.hypot(...ab), l2 = l * l || 1e-9, t = clamp(dot(sub(j, a0), ab) / l2), d = Math.hypot(...sub(j, add(a0, mul(ab, t)))); if (d < bd) { bd = d; at = run + t * l; } run += l; } tot = run; best = Math.min(at, tot - at); }
    rows.push({bone: b.id, joint: b.joint!, childR, parentR: pr.r, ratio: childR / pr.r, embed: pr.d / pr.r, buried: best / childR});
  }
  return rows;
};
