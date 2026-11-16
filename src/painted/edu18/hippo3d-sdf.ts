// EDU-EP18 three.js hippo spike (Boss, 15 Nov 2026, AS-HIPPO3D-SPIKE). Code-geometry hippo as one smooth signed-distance skin:
// ellipsoids, round cones and rounded boxes blended with smooth unions, polygonised by marching cubes (three's MarchingCubes addon).
// Pure functions of the pose: no clock, no randomness, so the same pose always gives the same field (frame-pure under Remotion).
// World metres: +x forward (head), +y up, +z the hippo's left side; ground (river bottom) at y 0, in-water poses use the surface at HIPPO3D_WATER.
// Spike only: not registered in BEAST_KIT, not used by any shot. beast-hippo.ts is untouched; the pose table below mirrors HIPPO_POSES (copy, not move).
import {MarchingCubes} from 'three/examples/jsm/objects/MarchingCubes.js';
import type {Material} from 'three';

export type V3 = [number, number, number];
type RGB = [number, number, number];
/** Affine frame: world = m * local + t (m row-major 3x3 rotation). */
export type Aff = {m: number[]; t: V3};

export const HIPPO3D_WATER = 1.3;
export const HIPPO3D_GAPE = (140 * Math.PI) / 180;
/** Upper-jaw tip (front top of the muzzle) in the head frame: the point the brief's 1.4 m yawn height is measured at. */
export const H3_TIP: V3 = [0.84, 0.08, 0];
/** sRGB 0..1 palette (brief film-brief.md palette row "Hippo"). */
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
export const H3 = {skin: hex('#6c5f6a'), skinLit: hex('#7d6f7a'), under: hex('#8a6f72'), flush: hex('#c98a86'), mouth: hex('#d98a8f'), tongue: hex('#e6a0a2'), throat: hex('#7a3a44'), tusk: hex('#efe6cf'), eye: hex('#2a1c18'), nail: hex('#4a3e44'), nostril: hex('#3a2a30')};

export type Hippo3DPose = {
  walk?: number; stride?: number; bob?: number; jaw?: number; headPitch?: number; neckUp?: number;
  ears?: number; nostril?: number; pitch?: number; lift?: number; fwd?: number; float?: number;
};
const sm = (a: number, b: number, t: number) => { const u = Math.min(1, Math.max(0, (t - a) / (b - a))); return u * u * (3 - 2 * u); };
const water = (p: Hippo3DPose): Hippo3DPose => ({float: 1, ...p});
/** The seven brief states as pure functions of t (0..1 over the range or around the cycle); numbers copied from HIPPO_POSES, lifts retuned to this body.
 * v8 (round 2): the boxy head sits about 0.11 m lower than the v7 ball head, so the floating lifts (surface end, swim, halt end, snort, lurk) rose
 * by 0.10-0.13 m to keep eyes, ears and nostrils above the surface; YAWN rose 0.07 m and tips the upper jaw to 101 deg so the lower jaw clears the water. */
export const HIPPO3D_POSES = {
  stand: (): Hippo3DPose => ({jaw: 0}),
  surface: (t: number): Hippo3DPose => water({lift: -0.62 + 0.67 * sm(0, 0.8, t), headPitch: 0.14 + 0.1 * sm(0.1, 0.5, t) * (1 - sm(0.6, 1, t)), ears: 0.5 * Math.sin(Math.max(0, t - 0.55) * 30) * sm(0.55, 0.65, t) * (1 - sm(0.85, 1, t)), nostril: sm(0.4, 0.55, t) * (1 - sm(0.7, 0.9, t))}),
  yawn: (t: number): Hippo3DPose => { const op = sm(0.12, 0.45, t) * (1 - sm(0.78, 0.98, t)), up = sm(0, 0.35, t) * (1 - 0.7 * sm(0.8, 1, t)); return water({lift: -0.05 + 0.6 * up, pitch: 0.3 * up, headPitch: 0.14 + 1.33 * op, jaw: op, ears: -0.4 * op, nostril: 0.3 * op}); },
  swim: (t: number): Hippo3DPose => water({lift: 0.03 + 0.03 * Math.sin(t * 6.283), walk: t, stride: 0.5, headPitch: 0.16 + 0.02 * Math.sin(t * 6.283 + 1), nostril: 0.2}),
  charge: (t: number): Hippo3DPose => { const b = Math.sin(t * 6.283); return water({lift: 0.08 + 0.1 * b, pitch: 0.2 + 0.05 * b, headPitch: 0.42 + 0.06 * Math.sin(t * 6.283 + 0.8), jaw: 0.16 + 0.06 * (b * 0.5 + 0.5), walk: t, stride: 1.0, ears: -0.35, nostril: 0.8}); },
  halt: (t: number): Hippo3DPose => { const k = sm(0, 0.7, t); return water({lift: 0.08 * (1 - k) + 0.05 * k + 0.04 * Math.sin(Math.PI * sm(0.35, 0.75, t)), pitch: 0.2 * (1 - k) - 0.03 * Math.sin(Math.PI * sm(0.3, 0.8, t)), headPitch: 0.42 * (1 - k) + 0.14 * k, jaw: 0.19 * (1 - sm(0.2, 0.6, t)), fwd: 0.35 * sm(0, 0.6, t), ears: -0.35 * (1 - k) + 0.3 * k, nostril: 0.8 * (1 - k)}); },
  snort: (t: number): Hippo3DPose => { const blow = sm(0.3, 0.42, t) * (1 - sm(0.55, 0.8, t)); return water({lift: 0 + 0.05 * blow, headPitch: 0.2 + 0.1 * blow, nostril: Math.max(0.15, blow), ears: 0.5 * Math.sin(t * 25) * sm(0.45, 0.55, t) * (1 - sm(0.75, 0.9, t))}); },
  lurk: (t: number): Hippo3DPose => water({lift: -0.32 + 0.015 * Math.sin(t * 6.283), pitch: 0.12, headPitch: 0.14, neckUp: 0.16, ears: 0.35 * Math.max(0, Math.sin(t * 6.283 * 2)) ** 6, nostril: 0.1}),
};
export type Hippo3DState = keyof typeof HIPPO3D_POSES;

// ---------------------------------------------------------------- affine helpers
const I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const rotZ = (a: number): Aff => { const c = Math.cos(a), s = Math.sin(a); return {m: [c, -s, 0, s, c, 0, 0, 0, 1], t: [0, 0, 0]}; };
const rotX = (a: number): Aff => { const c = Math.cos(a), s = Math.sin(a); return {m: [1, 0, 0, 0, c, -s, 0, s, c], t: [0, 0, 0]}; };
const tr = (v: V3): Aff => ({m: I3, t: v});
const mv = (m: number[], v: V3): V3 => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
export const mul = (A: Aff, B: Aff): Aff => {
  const a = A.m, b = B.m, m = new Array(9);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) m[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
  const t = mv(a, B.t);
  return {m, t: [t[0] + A.t[0], t[1] + A.t[1], t[2] + A.t[2]]};
};
const about = (p: V3, R: Aff): Aff => mul(tr(p), mul(R, tr([-p[0], -p[1], -p[2]])));
export const apply = (A: Aff, v: V3): V3 => { const r = mv(A.m, v); return [r[0] + A.t[0], r[1] + A.t[1], r[2] + A.t[2]]; };

// ---------------------------------------------------------------- rig
/** Joint positions in the body frame (stand pose). */
export const H3J = {pivot: [0, 0.95, 0] as V3, neck: [1.0, 1.06, 0] as V3, hinge: [0.04, -0.19, 0] as V3, ear: [-0.04, 0.3, 0.16] as V3,
  legs: [{x: 0.78, z: 0.37, ph: 0, fore: true}, {x: 0.78, z: -0.37, ph: 0.5, fore: true}, {x: -1.08, z: 0.4, ph: 0.5, fore: false}, {x: -1.08, z: -0.4, ph: 0, fore: false}]};
export type Rig = {body: Aff; head: Aff; jaw: Aff; ears: [Aff, Aff]; legs: {hip: V3; knee: V3; foot: V3; fore: boolean}[]; gape: number; nostril: number};
export const rig = (P: Hippo3DPose): Rig => {
  const body = mul(tr([P.fwd ?? 0, (P.lift ?? 0) + (P.bob ?? 0), 0]), about(H3J.pivot, rotZ(P.pitch ?? 0)));
  const n = H3J.neck, neckAt: V3 = [n[0], n[1] + (P.neckUp ?? 0), 0];
  const head = mul(body, mul(tr(neckAt), rotZ(P.headPitch ?? 0)));
  const gape = HIPPO3D_GAPE * (P.jaw ?? 0);
  const jaw = mul(head, mul(tr(H3J.hinge), rotZ(-gape)));
  const ears = [1, -1].map((s) => mul(head, mul(tr([H3J.ear[0], H3J.ear[1], s * H3J.ear[2]]), mul(rotZ(P.ears ?? 0), rotX(s * 0.25))))) as [Aff, Aff];
  const legs = H3J.legs.map((L) => {
    const ph = (P.walk ?? 0) + L.ph, st = P.stride ?? 0, sw = st * 0.42 * Math.sin(ph * 6.283), lift = st * 0.12 * Math.max(0, Math.cos(ph * 6.283)), fl = P.float ?? 0;
    const back = fl * (L.fore ? 0.12 : -0.18), a = sw + back;
    const hipB: V3 = [L.x, 0.84, L.z], len1 = 0.38, len2 = 0.3, bend = (L.fore ? 1 : -1) * (0.08 + 1.4 * lift + 0.25 * fl);
    const kneeB: V3 = [hipB[0] + len1 * Math.sin(a), hipB[1] - len1 * Math.cos(a), L.z];
    const footB: V3 = [kneeB[0] + len2 * Math.sin(a - bend), kneeB[1] - len2 * Math.cos(a - bend), L.z];
    return {hip: apply(body, hipB), knee: apply(body, kneeB), foot: apply(body, footB), fore: L.fore};
  });
  return {body, head, jaw, ears, legs, gape, nostril: P.nostril ?? 0};
};

// ---------------------------------------------------------------- distance primitives (local frames)
const sdEll = (x: number, y: number, z: number, a: number, b: number, c: number) => {
  const k0 = Math.sqrt((x / a) ** 2 + (y / b) ** 2 + (z / c) ** 2), k1 = Math.sqrt((x / (a * a)) ** 2 + (y / (b * b)) ** 2 + (z / (c * c)) ** 2);
  return k1 === 0 ? -Math.min(a, b, c) : (k0 * (k0 - 1)) / k1;
};
/** Conservative ellipsoid distance (never overestimates): for thin leaves (ears), where the sdEll estimate overshoots and the 4^3 block skip in
 * buildHippo3D then dropped most of the ear (v8 finding). The zero set is the same ellipsoid. */
const sdEllSafe = (x: number, y: number, z: number, a: number, b: number, c: number) => (Math.sqrt((x / a) ** 2 + (y / b) ** 2 + (z / c) ** 2) - 1) * Math.min(a, b, c);
const sdRBox = (x: number, y: number, z: number, bx: number, by: number, bz: number, r: number) => {
  const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r, qz = Math.abs(z) - bz + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r;
};
/** Round cone between a (radius r1) and b (radius r2) (iq). */
const sdRCone = (p: V3, a: V3, b: V3, r1: number, r2: number) => {
  const bax = b[0] - a[0], bay = b[1] - a[1], baz = b[2] - a[2], pax = p[0] - a[0], pay = p[1] - a[1], paz = p[2] - a[2];
  const l2 = bax * bax + bay * bay + baz * baz, rr = r1 - r2, a2 = l2 - rr * rr, il2 = 1 / l2;
  const y = pax * bax + pay * bay + paz * baz, z = y - l2;
  const xx = (pax * l2 - bax * y) ** 2 + (pay * l2 - bay * y) ** 2 + (paz * l2 - baz * y) ** 2, y2 = y * y * l2, z2 = z * z * l2;
  const k = Math.sign(rr) * rr * rr * xx;
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(xx + z2) * il2 - r2;
  if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(xx + y2) * il2 - r1;
  return (Math.sqrt(xx * a2 * il2) + y * rr) * il2 - r1;
};
const inv = (A: Aff, p: V3, o: V3) => { const m = A.m, x = p[0] - A.t[0], y = p[1] - A.t[1], z = p[2] - A.t[2]; o[0] = m[0] * x + m[3] * y + m[6] * z; o[1] = m[1] * x + m[4] * y + m[7] * z; o[2] = m[2] * x + m[5] * y + m[8] * z; };
const ss = (e0: number, e1: number, x: number) => { const u = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return u * u * (3 - 2 * u); };
const mixc = (a: RGB, b: RGB, u: number): RGB => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];

/** Smooth-union accumulator carrying a blended colour. */
class Acc {
  d = 1e9; c: RGB = [0, 0, 0]; want: boolean;
  constructor(want: boolean) { this.want = want; }
  add(d: number, k: number, col?: () => RGB) {
    if (this.d >= 1e8) { this.d = d; if (this.want && col) this.c = col(); return; }
    const h = Math.min(1, Math.max(0, 0.5 + (0.5 * (d - this.d)) / k));   // h=1 keeps the old
    if (this.want && col && h < 1) { const cc = col(); this.c = mixc(cc, this.c, h); }
    this.d = d + (this.d - d) * h - k * h * (1 - h);
  }
}

export type Part = 'all' | 'head';
/** Builds the distance (and optionally colour) function for one rig. */
export const hippoSdf = (R: Rig, part: Part = 'all') => {
  const lb: V3 = [0, 0, 0], lh: V3 = [0, 0, 0], lj: V3 = [0, 0, 0], le: V3 = [0, 0, 0];
  const nos = 0.012 + 0.03 * R.nostril;
  return (p: V3, want: boolean): {d: number; c: RGB} => {
    inv(R.body, p, lb); inv(R.head, p, lh); inv(R.jaw, p, lj);
    const [bx, by, bz] = lb, [hx, hy, hz] = lh, [jx, jy, jz] = lj;
    // colour helpers in each frame
    // v8 papercut: the hide is two flat cuts (back and belly) with a narrow step between them, not a height gradient
    const hide = (): RGB => { const u = ss(0.74, 0.68, by); return mixc(mixc(H3.skin, H3.skinLit, ss(1.36, 1.42, by) * 0.6), H3.under, u * 0.8); };
    const A = new Acc(want);
    if (part === 'all') {
      A.add(sdEll(bx + 0.25, by - 0.92, bz, 1.44, 0.6, 0.68), 0.1, hide);                 // barrel
      A.add(sdEll(bx - 0.5, by - 1.1, bz, 0.62, 0.4, 0.58), 0.25, hide);                   // shoulder hump
      A.add(sdEll(bx + 1.2, by - 1.0, bz, 0.5, 0.48, 0.62), 0.25, hide);                   // rump
      A.add(sdRCone(lb, [-1.55, 1.08, 0], [-1.84, 0.82, 0], 0.08, 0.035), 0.06, hide);     // tail stub
      for (const L of R.legs) {
        const lc = (): RGB => mixc(H3.under, H3.skin, 0.55);
        A.add(sdRCone(p, L.hip, L.knee, 0.25, 0.17), 0.14, lc);
        A.add(sdRCone(p, L.knee, L.foot, 0.17, 0.155), 0.05, lc);
      }
      for (const L of R.legs) {   // feet: flattened pads with darker nails at the front
        const fx = p[0] - L.foot[0], fy = p[1] - L.foot[1] + 0.07, fz = p[2] - L.foot[2];
        A.add(sdEll(fx - 0.03, fy, fz, 0.19, 0.1, 0.18), 0.05, () => mixc(H3.under, H3.nail, ss(0.06, 0.16, fx) * 0.8));
      }
    }
    const neck = sdEll(bx - 0.88, by - 0.95, bz, 0.45, 0.42, 0.55);   // v8: top lowered 8 cm so the ears and turrets stand above it
    // neck; head-only cards cut it to a collar (v8: the whole neck ball behind the head read as a round toy head)
    A.add(part === 'all' ? neck : Math.max(neck, 0.78 - bx), part === 'all' ? 0.2 : 0.01, hide);
    // head (frame origin at the neck joint)
    const flush = (): RGB => {
      const eye = Math.hypot(hx - 0.2, hy - 0.3, Math.abs(hz) - 0.22), cheek = Math.hypot(hx - 0.42, (hy + 0.06) * 1.6, (Math.abs(hz) - 0.3) * 1.4);
      const k = 0.5 * ss(0.15, 0.13, eye) + 0.3 * ss(0.17, 0.15, cheek);   // v8: flat flush patches with a cut edge
      return mixc(mixc(H3.skin, H3.skinLit, ss(0.12, 0.16, hy) * 0.5), H3.flush, k);
    };
    const HA = new Acc(want);
    // v8 head (round 2): a long boxy head, not a ball. Back skull/cheeks, a narrower bridge, wide swollen lip pads at the front, nostril domes,
    // eye turrets and ears standing on the flat top; the lower jaw is deep and heavy with a jowl at the back and a wide chin (0.95 x 0.7 m).
    HA.add(sdRBox(hx - 0.14, hy - 0.02, hz, 0.26, 0.2, 0.3, 0.16), 0.08, flush);          // skull and cheeks
    HA.add(sdRBox(hx - 0.48, hy, hz, 0.3, 0.16, 0.25, 0.13), 0.12, flush);                 // bridge (narrower waist)
    for (const s of [1, -1]) {
      const zz = hz - s * 0.11;
      HA.add(sdEll(hx - 0.7, hy + 0.03, hz - s * 0.14, 0.17, 0.16, 0.2), 0.1, flush);     // lip pads (the wide flat muzzle)
      HA.add(sdEll(hx - 0.74, hy - 0.11, zz, 0.09, 0.06, 0.075), 0.05, () => {           // nostril domes with slits on top
        const slit = ((hx - 0.76) / 0.045) ** 2 + (zz / nos) ** 2;
        return mixc(flush(), H3.nostril, ss(1.2, 0.8, slit) * ss(0.13, 0.16, hy));
      });
      HA.add(sdEll(hx - 0.16, hy - 0.28, hz - s * 0.19, 0.11, 0.11, 0.095), 0.05, flush);  // eye turrets (stand clear of the flat top)
    }
    // ears (thin leaves on their own frames)
    for (const E of R.ears) { inv(E, p, le); HA.add(sdEllSafe(le[0], le[1] - 0.06, le[2], 0.05, 0.1, 0.032), 0.025, () => mixc(H3.skin, H3.flush, ss(0.03, -0.01, le[0]) * 0.6)); }
    // lower jaw (frame origin at the hinge): deep heavy jaw, jowl at the back, wide chin flare at the front, tongue bed on top
    const JA = new Acc(want);
    const jcol = (): RGB => mixc(mixc(H3.skin, H3.under, ss(-0.05, -0.2, jy) * 0.7), H3.flush, 0.15 * ss(0.4, 0.75, jx));
    JA.add(sdRBox(jx - 0.4, jy + 0.11, jz, 0.4, 0.12, 0.27, 0.1), 0.08, jcol);
    JA.add(sdEll(jx - 0.66, jy + 0.08, jz, 0.18, 0.13, 0.33), 0.1, jcol);                   // chin flare
    JA.add(sdEll(jx - 0.1, jy + 0.1, jz, 0.22, 0.17, 0.3), 0.08, jcol);                    // jowl / hinge corner mass
    JA.add(sdEll(jx - 0.4, jy - 0.005, jz, 0.3, 0.05, 0.17), 0.04, () => H3.tongue);       // tongue
    // head + jaw: tiny blend along the lips, a wide one at the hinge corner (the rounded cheek web when it gapes)
    const dh = Math.hypot(hx - H3J.hinge[0], hy - H3J.hinge[1]);
    const kj = 0.015 + 0.12 * ss(0.32, 0.05, dh) * Math.min(1, R.gape / 0.5);
    const hd = HA.d, jd = JA.d, h = Math.min(1, Math.max(0, 0.5 + (0.5 * (jd - hd)) / kj)), d2 = jd + (hd - jd) * h - kj * h * (1 - h);
    let col: RGB = [0, 0, 0];
    if (want) {
      col = mixc(JA.c, HA.c, h);
      // mouth interior: between the palate plane (head frame) and the tongue-bed plane (jaw frame), inside the lips
      const pal = H3J.hinge[1] + 0.02;   // palate y in the head frame (the muzzle floor sits near the hinge height)
      const inside = ss(pal + 0.1, pal + 0.04, hy) * ss(-0.1, -0.04, jy) * ss(0.3, 0.24, Math.abs(hz)) * ss(0.86, 0.78, hx) * Math.min(1, R.gape / 0.15);
      if (inside > 0) {
        const deep = ss(0.32, 0.08, Math.hypot(jx, jy));
        const m = mixc(h > 0.5 ? H3.mouth : (jy > -0.02 && Math.abs(jz) < 0.17 && jx > 0.1 && jx < 0.7 ? H3.tongue : H3.mouth), H3.throat, deep * 0.75);
        col = mixc(col, m, inside);
      }
    }
    A.add(d2, part === 'all' ? 0.14 : 0.1, () => col);
    return {d: A.d, c: A.c};
  };
};

// ---------------------------------------------------------------- field + marching cubes
export type Box = {min: V3; max: V3};
/** Conservative bounds of the rig (sphere bounds of every primitive), clipped to y >= clipY. */
export const rigBounds = (R: Rig, part: Part = 'all'): Box => {
  const pts: [V3, number][] = [];
  const add = (A: Aff, c: V3, r: number) => pts.push([apply(A, c), r]);
  if (part === 'all') {
    add(R.body, [-0.25, 0.96, 0], 1.5); add(R.body, [0.6, 1.0, 0], 0.7); add(R.body, [-1.2, 1.0, 0], 0.7); add(R.body, [-1.75, 0.9, 0], 0.2);
    for (const L of R.legs) { pts.push([L.hip, 0.3], [L.knee, 0.25], [L.foot, 0.25]); }
  }
  add(R.body, [1.02, 1.02, 0], 0.6);
  add(R.head, [0.14, 0.02, 0], 0.5); add(R.head, [0.5, 0.0, 0], 0.5); add(R.head, [0.72, 0.0, 0], 0.4); add(R.head, [0.16, 0.26, 0], 0.35); add(R.head, [-0.02, 0.3, 0], 0.3);
  add(R.jaw, [0.4, -0.1, 0], 0.55); add(R.jaw, [0.68, -0.08, 0], 0.45); add(R.jaw, [0.1, -0.1, 0], 0.45); add(R.jaw, [0.65, 0.15, 0], 0.4);
  const min: V3 = [1e9, 1e9, 1e9], max: V3 = [-1e9, -1e9, -1e9];
  for (const [c, r] of pts) for (let i = 0; i < 3; i++) { min[i] = Math.min(min[i], c[i] - r); max[i] = Math.max(max[i], c[i] + r); }
  return {min, max};
};

export type Hippo3DMesh = {mc: MarchingCubes; box: Box; rig: Rig; ms: number; tris: number};
/**
 * Marching-cubes skin for a pose. `res` cells per axis over the rig box (cells are anisotropic; three's MarchingCubes is a cube scaled to the box).
 * Blocks of 4^3 cells far from the surface take one distance sample, so cost scales with the surface, not the volume.
 */
export const buildHippo3D = (P: Hippo3DPose, {res = 128, part = 'all' as Part, material, clipBelow}: {res?: number; part?: Part; material?: Material; clipBelow?: number} = {}): Hippo3DMesh => {
  const t0 = Date.now(), R = rig(P), f = hippoSdf(R, part), box = rigBounds(R, part);
  if (clipBelow !== undefined) box.min[1] = Math.max(box.min[1], clipBelow - 0.05);
  const mc = new MarchingCubes(res, material as Material, false, true, 600000);
  mc.isolation = 0;
  const N = res, size = [0, 1, 2].map((i) => box.max[i] - box.min[i]), cell = size.map((s) => s / (N - 1)) as V3;
  // MarchingCubes local coordinate for index i is (i - N/2) / (N/2); map index i to world min + i * cell, then fix the mesh transform so they agree.
  const field = mc.field, pal = mc.palette, cmax = Math.max(...cell), B = 4;
  const p: V3 = [0, 0, 0], margin = 2.5 * cmax, brad = Math.hypot(cell[0] * B, cell[1] * B, cell[2] * B) * 0.5;
  const at = (i: number, j: number, k: number) => { p[0] = box.min[0] + i * cell[0]; p[1] = box.min[1] + j * cell[1]; p[2] = box.min[2] + k * cell[2]; return p; };
  for (let k0 = 0; k0 < N; k0 += B) for (let j0 = 0; j0 < N; j0 += B) for (let i0 = 0; i0 < N; i0 += B) {
    const dc = f(at(i0 + B / 2 - 0.5, j0 + B / 2 - 0.5, k0 + B / 2 - 0.5), false).d;
    const far = Math.abs(dc) > brad * 1.3 + margin;
    for (let k = k0; k < Math.min(N, k0 + B); k++) for (let j = j0; j < Math.min(N, j0 + B); j++) for (let i = i0; i < Math.min(N, i0 + B); i++) {
      const q = k * N * N + j * N + i;
      // outside the box edge cells stay "outside" so the skin closes
      if (i === 0 || j === 0 || k === 0 || i >= N - 2 || j >= N - 2 || k >= N - 2) { field[q] = -1; continue; }
      if (far) { field[q] = -dc; continue; }
      const d = f(at(i, j, k), false).d;
      field[q] = -d;
      if (Math.abs(d) < 1.1 * cmax) {
        // colour at the nearest skin point (p - n d), so colour masks stay constant along the normal and do not alias into grid-row stripes
        const e = 0.004, x = p[0], y = p[1], z = p[2];
        // tetrahedral gradient (4 samples)
        const a = f([x + e, y - e, z - e], false).d, b = f([x - e, y - e, z + e], false).d, c2 = f([x - e, y + e, z - e], false).d, d4 = f([x + e, y + e, z + e], false).d;
        const gx = a - b - c2 + d4, gy = -a - b + c2 + d4, gz = -a + b - c2 + d4;
        const gl = Math.hypot(gx, gy, gz) || 1, c = f([x - (gx / gl) * d, y - (gy / gl) * d, z - (gz / gl) * d], true).c;
        pal[q * 3] = c[0]; pal[q * 3 + 1] = c[1]; pal[q * 3 + 2] = c[2];
      }
    }
  }
  mc.update();
  // local x_l = (i - N/2)/(N/2) -> world = min + i*cell  =>  world = min + (x_l*N/2 + N/2)*cell
  mc.scale.set((cell[0] * N) / 2, (cell[1] * N) / 2, (cell[2] * N) / 2);
  mc.position.set(box.min[0] + (cell[0] * N) / 2, box.min[1] + (cell[1] * N) / 2, box.min[2] + (cell[2] * N) / 2);
  mc.updateMatrixWorld(true);
  return {mc, box, rig: R, ms: Date.now() - t0, tris: mc.count / 3};
};

/** World-space vertex positions of the built skin (for camera fit and measurement). */
export const skinVerts = (M: Hippo3DMesh, step = 1): V3[] => {
  const pos = M.mc.geometry.getAttribute('position').array as Float32Array, out: V3[] = [], s = M.mc.scale, o = M.mc.position;
  for (let v = 0; v < M.mc.count; v += step) out.push([pos[v * 3] * s.x + o.x, pos[v * 3 + 1] * s.y + o.y, pos[v * 3 + 2] * s.z + o.z]);
  return out;
};

// ---------------------------------------------------------------- separate hard parts (tusks, teeth, eyes): frames + local placement
export type HardPart = {kind: 'tusk' | 'peg' | 'canine' | 'eye' | 'glint'; frame: Aff; at: V3; dir: V3; len: number; r: number; side: number};
export const hardParts = (R: Rig): HardPart[] => {
  const out: HardPart[] = [];
  for (const s of [1, -1]) {
    out.push({kind: 'tusk', frame: R.jaw, at: [0.68, -0.03, s * 0.24], dir: [-0.25, 1, s * 0.12], len: 0.27, r: 0.04, side: s});
    out.push({kind: 'peg', frame: R.jaw, at: [0.7, 0.0, s * 0.07], dir: [0.45, 0.9, 0], len: 0.07, r: 0.018, side: s});
    out.push({kind: 'peg', frame: R.jaw, at: [0.68, 0.0, s * 0.15], dir: [0.4, 0.9, s * 0.1], len: 0.06, r: 0.016, side: s});
    out.push({kind: 'canine', frame: R.head, at: [0.66, -0.16, s * 0.25], dir: [0.15, -1, 0], len: 0.08, r: 0.025, side: s});
    out.push({kind: 'eye', frame: R.head, at: [0.22, 0.315, s * 0.24], dir: [0.7, 0.2, s * 0.7], len: 0, r: 0.046, side: s});
    out.push({kind: 'glint', frame: R.head, at: [0.252, 0.34, s * 0.27], dir: [0, 0, 0], len: 0, r: 0.011, side: s});
  }
  return out;
};
