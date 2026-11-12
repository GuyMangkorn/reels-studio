import {ell, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {ease, clamp01, type V3} from '../kit/space';
import {BUN_SM, MC, paintBun, wobble, WOBBLE_HZ} from './macro';

// N2 drop contact (brief EDU-EP18-BRIEF-R1.4: "dimple under a passenger, passengers between the drop's back and front halves, bun wobble clock";
// kit water-drop.ts stays as it is). `Dl` = drop-local sm, origin at the drop's centre, axes as `M`; the flat bottom face is at y = BUN_SM.bottom
// (-0.88, brief -0.875) as a disc of radius 0.90 and the widest half-width 1.255 sits at y -0.2. R04: passengers within 0.02 sm of the face.
export {wobble, WOBBLE_HZ};
export const FACE = {r: 0.9, widest: 1.255, widestY: -0.2, dimple: 0.08, tol: 0.02} as const;
/** Dimple depth (sm) on the event clock: 0 before contact, 0.08 sm after a 4 f ease (the bun gives a little under the weight). */
export const dimpleDepth = (L: number, contactL: number) => FACE.dimple * ease(clamp01((L - contactL) / 4));
/** Height (`Dl` y shifted by the drop's centre) of the face a passenger lies on: the passenger's contact surface sits here (R04, within 0.02 sm). The
 * dimple is a shading of the face under the body, not a move of the body, so passengers keep this height through the contact. */
export const passengerY = (centreY: number) => centreY + BUN_SM.bottom;
/** Gap (sm) between a passenger's contact surface and the face: must be <= FACE.tol (R04). `dip` (sm, + = toward the lens / down) is the pass-5 move of the face under a
 * reacting passenger (D5-02: the face gives, the body rides it); 0 at rest. */
export const contactGap = (surfaceY: number, centreY: number, dip = 0) => Math.abs(surfaceY - (centreY + BUN_SM.bottom - dip));

const ringAt = (c: YCam, ctr: V3, y: number, r: number, n = 40, rz = r): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI, q = camPoint(c, [ctr[0] + r * Math.cos(a), ctr[1] + y, ctr[2] + rz * Math.sin(a)], 0.3); if (q) out.push(q); }
  return out;
};

/**
 * The drop seen from BELOW (`Dl` below shots, SP3): the flat bottom face as a water disc (radius 0.90) inside the lower flank (to the widest
 * ring 1.255), the inverted shop glow, the cyan rim and highlight. Passengers are drawn by the shot AFTER this, in front of the water (they lie
 * on its face), then `paintDimple` rings under each and `paintFilm` rims over their edges. `t` = ambient seconds (wobble breathes the rim).
 */
export const paintUnderface = (p: Painter, c: YCam, ctr: V3, o: {t: number; seed?: number; cold?: number}) => {
  const s = o.seed ?? 43000, w = wobble(o.t), k = w.size / 6.2, cold = o.cold ?? 0;
  const bot = BUN_SM.bottom, wide = ringAt(c, ctr, FACE.widestY, FACE.widest * k, 48), face = ringAt(c, ctr, bot, FACE.r * k, 48), mid = ringAt(c, ctr, bot + 0.45, 1.12 * k, 48);
  if (wide.length >= 3) washAt(p, s, mixColor('#6e9aa6', '#5a7488', cold), 210, wide, 0.08, 0.05); // flank: deep water seen from beneath
  if (mid.length >= 3) washAt(p, s + 1, mixColor('#8fb8c0', '#7090a4', cold), 140, mid, 0.1, 0.05);
  if (face.length >= 3) {
    washAt(p, s + 2, mixColor('#b4d4d8', '#8aa8b8', cold), 175, face, 0.1, 0.05); // the flat face: lighter, thin water over the sky behind
    const g = camPoint(c, [ctr[0] + 0.12, ctr[1] + bot, ctr[2] - 0.1], 0.3), u = camUnit(c, ctr);
    if (g) {
      washAt(p, s + 3, MC.shop, 150, ell(g[0], g[1], 0.42 * u, 0.2 * u, 22), 0.25, 0.1); // the inverted shop glow
      washAt(p, s + 4, mixColor(MC.shop, '#ffffff', 0.4), 120, ell(g[0] + 0.03 * u, g[1] - 0.02 * u, 0.17 * u, 0.08 * u, 16), 0.2, 0.1);
    }
  }
  if (wide.length >= 3) {
    inkLine(p, s + 5, wide, {weight: 1.6, color: '#d7ecef', curve: 0.2});
    inkLine(p, s + 6, face, {weight: 1.1, color: mixColor('#e8f6f8', '#a8c4d0', cold), curve: 0.2});
  }
};

/** Shallow dimple under a passenger at `at` (on the face, `Dl` sm): a shaded ellipse on the face plane, its far rim lit, its near rim shaded;
 * `depth` is `dimpleDepth` (0..0.08 sm), `rx`/`rz` the passenger's footprint half-extents (sm). */
export const paintDimple = (p: Painter, c: YCam, ctr: V3, at: V3, rx: number, rz: number, depth: number, seed = 43100) => {
  if (depth <= 0.002) return;
  const k = depth / FACE.dimple;
  const ring = (kx: number, ox = 0, oz = 0) => ringAt(c, [at[0] + ox, ctr[1], at[2] + oz], BUN_SM.bottom, rx * kx, rz * kx);
  const o = ring(1.18), i = ring(0.92, 0, 0);
  if (o.length >= 3) washAt(p, seed, '#5f8794', 90 * k, o, 0.3, 0.05);
  if (i.length >= 3) washAt(p, seed + 1, '#4a6e7e', 70 * k, ring(0.8, 0.02, -0.02), 0.3, 0.05);
  if (o.length >= 3) inkLine(p, seed + 2, o, {weight: 0.9, color: '#e4f3f5', curve: 0.25, still: true});
};

/** The thin water film over a passenger's edge on a drop seen from the side (fallback layering): a cyan veil over the lowest `h` sm of the bun and
 * a rim highlight along its bottom, drawn after the riders so they read inside the water. Never over faces (the shot places the riders below the film). */
export const paintFilm = (p: Painter, c: YCam, ctr: V3, o: {h?: number; t: number; seed?: number}) => {
  const g = camPoint(c, [ctr[0], ctr[1] + BUN_SM.bottom, ctr[2]]), u = camUnit(c, ctr);
  if (!g) return;
  const w = wobble(o.t), hw = (BUN_SM.w / 2) * 0.72 * (w.size / 6.2), h = (o.h ?? 0.16) * u, s = o.seed ?? 43200;
  washAt(p, s, '#9fd0d8', 70, [[g[0] - hw * u, g[1]], [g[0] + hw * u, g[1]], [g[0] + hw * u * 0.9, g[1] - h], [g[0] - hw * u * 0.9, g[1] - h]], 0.3, 0.05);
  inkLine(p, s + 1, [[g[0] - hw * u, g[1] + 1], [g[0], g[1] + 2], [g[0] + hw * u, g[1] + 1]], {weight: 1.3, color: '#d9eef1', closed: false, curve: 0.4, still: true});
};

/** Convenience for the side-view shots: the bun with its film drawn after `riders` (callback draws the passengers between back and front). */
export const paintBunWithRiders = (p: Painter, c: YCam, ctr: V3, o: {t: number; seed?: number}, riders: () => void) => {
  const b = paintBun(p, c, ctr, {t: o.t, seed: o.seed});
  riders();
  paintFilm(p, c, ctr, {t: o.t});
  return b;
};

/** One ring on the bottom face plane (pass 5, F5-B01/B02: the drop's surface tension answering a touch): centre `at` (world; only x and z are used, the ring lies on the face of the drop
 * centred `ctr`), radius `r` sm, 2 px `#e8f2f4` at `alpha`, clipped to the face radius 0.9 sm (the parts of the circle outside the face are not drawn). */
export const paintFaceRing = (p: Painter, c: YCam, ctr: V3, at: V3, r: number, alpha: number, seed: number) => {
  if (alpha <= 0.004 || r <= 0) return;
  const n = 64, runs: Pt[][] = [];
  let run: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * 2 * Math.PI, x = at[0] + r * Math.cos(a), z = at[2] + r * Math.sin(a), q = Math.hypot(x - ctr[0], z - ctr[2]) <= FACE.r ? camPoint(c, [x, ctr[1] + BUN_SM.bottom, z], 0.3) : null;
    if (q) run.push(q); else { if (run.length >= 2) runs.push(run); run = []; }
  }
  if (run.length >= 2) runs.push(run);
  const q = p.layer(Math.min(1, alpha), seed);
  runs.forEach((pts, i) => inkLine(q, seed + 1 + i, pts, {weight: 2, color: '#e8f2f4', curve: 0.25, closed: false, still: true}));
};
