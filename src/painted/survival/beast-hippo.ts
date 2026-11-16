import {mixColor} from '../kit/painter';
import {camPoint, type YCam} from '../kit/ycam';
import type {Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {add, ballKeys, clamp, clampReach, gaitFoot, ik2, keyAt, lerp, limb, mul, newRig, nrm, onLoft, spline, sub, uOfS, type BeastPlace, type Build, type Key, type L3} from './beast';

// HIPPO kit creature AS-HIPPO-R1 (Boss, 15 Nov 2026; EDU-EP18-BRIEF-R1 N3 / VD03, pre-W3 comp-card pass). Designed from the brief, not from an existing creature:
// big and heavy, wet grey-purple skin with a pink flush round the eyes, ears and mouth; eyes, ears and nostrils on top of the head so it can lie almost hidden;
// a huge, slightly comic yawn (gape to ~140 deg, pink mouth, ivory tusks); a real charge with the head high.
// Sizes (brief, picture sizes, est): body 3.6 m snout to rump, shoulder 1.5 m, head 0.95 m long x 0.7 m wide. Creature-local metres: s forward, y up, l left flank.
// Skeleton: body (root) -> tail [tail.base]; body -> neck [neck.base] -> skull [skull.joint] -> jaw [jaw.hinge]; skull -> eye.L/R [eye.*.pivot], ear.L/R [ear.*.base];
// body -> legs HL/HR/FL/FR (limb(): thigh [hip] -> shin [knee] -> foot [ankle]). Whole-body pitch/lift/forward shift is one rigid transform about HIPPO_PIVOT, so joints stay attached.
// Water: in-water anims carry `place.waterline = HIPPO_WATER` (cards and tests stand the hippo on a river bottom at y 0); a shot in space R (water surface y 0) passes
// `ground: -HIPPO_WATER, waterline: 0`. `waterCut` gives the screen ring where the skin meets the water, for the scene's ripple / bow-wave paint.

export const HPX = {skin: '#6c5f6a', wet: '#a99aa6', under: '#8a6f72', flush: '#c98a86', mouth: '#d98a8f', mouthDeep: '#a85a64', throat: '#5a2a32', tusk: '#efe6cf', eye: '#2a1c18', sheen: '#f2e2d0', nail: '#4a3e44'} as const;
/** Water depth (m) the in-water anims are built for: bottom at y 0, surface at this height. */
export const HIPPO_WATER = 1.3;
/** Fix round 1 (user, 15 Nov 2026: "soften, not faceted low-poly"): the soft beast look, so the hippo sits beside the flat 2D kit animals (dog, hen) without a style clash. */
// v6 polish (user, 15 Nov 2026: keep the mass, fewer facets): 5 extra stations per span and 3x ring segments, a thinner turn-edge line; colours below are continuous ramps.
export const HIPPO_LOOK: NonNullable<Build['look']> = {sub: 5, ring: 3, rim: '#c9c2d2', rimK: 0.3, edge: 0.35, far: 0.16, wetHide: ['.thigh', '.shin', '.foot']};
export const HIPPO_PIVOT: L3 = [0, 0.95, 0];
/** Gape (rad) between the upper and lower jaw at `jaw` = 1 (brief: about 140 deg at the yawn peak). */
export const HIPPO_GAPE = (140 * Math.PI) / 180;
/** head length scale on the station tables (fits the brief's 0.95 m head) */
const HS = 0.93;
const LEG = {hind: [0.36, 0.32] as const, fore: [0.36, 0.34] as const};

export type HippoPose = {
  /** bottom-walk / swim phase (cycles) and stride (m); 0 = standing */
  walk?: number; stride?: number;
  /** body bob (m) */
  bob?: number;
  /** jaw open 0..1 (HIPPO_GAPE at 1) */
  jaw?: number;
  /** head pitch (rad, + nose up) about the skull joint, neck lift (m) */
  headPitch?: number; neckUp?: number;
  /** ear flick angle (rad, + forward), nostril 0 shut slit .. 1 flared round */
  ears?: number; nostril?: number;
  /** whole body: pitch about HIPPO_PIVOT (rad, + nose up), lift (m), forward shift (m) */
  pitch?: number; lift?: number; fwd?: number;
  /** 0 = feet planted in the ground frame, 1 = legs tucked and floating in the body frame (swimming) */
  float?: number;
};

const sm = (a: number, b: number, t: number) => { const u = clamp((t - a) / (b - a)); return u * u * (3 - 2 * u); };
/** v6: soft colour ramp across the loft's side value (-1 belly .. 1 back) instead of hard bands. */
/** v6: close a capped loft with a short dome (two shrinking keys past its last key), so the end cap is a small dot, not a flat oval lid. */
const domeEnd = (ks: Key[]): Key[] => { const k = ks[ks.length - 1], d = nrm(sub(k.p, ks[ks.length - 2].p)), r = Math.min(k.a, k.b); return [...ks, {p: add(k.p, mul(d, 0.35 * r)), a: k.a * 0.78, b: k.b * 0.78}, {p: add(k.p, mul(d, 0.6 * r)), a: k.a * 0.3, b: k.b * 0.3}]; };
const ramp3 = (sd: number, belly: string, mid: string, back: string, lo = -0.75, hi = 0.75) => (sd < 0 ? mixColor(mid, belly, sm(-0.05, lo, sd)) : mixColor(mid, back, sm(0.05, hi, sd)));
const pitchAbout = (p: L3, c: L3, a: number): L3 => { const x = p[0] - c[0], y = p[1] - c[1], cs = Math.cos(a), sn = Math.sin(a); return [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs, p[2]]; };
const xform = (B: Build, f: (p: L3) => L3) => {
  for (const q of B.parts) q.keys = q.keys.map((k) => ({...k, p: f(k.p)}));
  for (const fl of B.flats) fl.pts = fl.pts.map(f);
  for (const j of Object.keys(B.joints)) B.joints[j] = f(B.joints[j]);
  B.feet = B.feet.map(f);
  for (const a of Object.keys(B.anchors)) B.anchors[a] = f(B.anchors[a]);
};

// upper head stations (m along the skull axis from the skull joint): vt top, vb mouth line, wd half width
const ST = [
  {u: -0.08, vt: 0.26, vb: -0.16, wd: 0.3}, {u: 0.08, vt: 0.33, vb: -0.18, wd: 0.34}, {u: 0.28, vt: 0.25, vb: -0.18, wd: 0.28}, {u: 0.5, vt: 0.24, vb: -0.19, wd: 0.31},
  {u: 0.72, vt: 0.27, vb: -0.19, wd: 0.37}, {u: 0.86, vt: 0.26, vb: -0.18, wd: 0.36}, {u: 0.94, vt: 0.2, vb: -0.15, wd: 0.3}, {u: 0.985, vt: 0.08, vb: -0.08, wd: 0.16},
];
/** the mouth line sits this far above the upper head's lower boundary: the upper head and the jaw overlap there, so the closed mouth has no crease */
const LIP = 0.06;
// lower jaw stations: d depth below the mouth line, w half width
const JW = [{u: -0.02, d: 0.22, w: 0.28}, {u: 0.12, d: 0.34, w: 0.33}, {u: 0.36, d: 0.28, w: 0.28}, {u: 0.62, d: 0.27, w: 0.33}, {u: 0.84, d: 0.25, w: 0.35}, {u: 0.93, d: 0.17, w: 0.3}, {u: 0.975, d: 0.06, w: 0.15}];
const interp = <T extends {u: number}>(tab: T[], u: number, k: keyof T): number => { let i = 0; while (i < tab.length - 2 && u > tab[i + 1].u) i++; const f = clamp((u - tab[i].u) / (tab[i + 1].u - tab[i].u)); return (tab[i][k] as number) + ((tab[i + 1][k] as number) - (tab[i][k] as number)) * f; };

export const buildHippo = (o: HippoPose = {}): Build => {
  const R = newRig(), B = R.B, bob = o.bob ?? 0, jaw = clamp(o.jaw ?? 0), fl = clamp(o.float ?? 0);
  const pitch = o.pitch ?? 0, lift = o.lift ?? 0, fwd = o.fwd ?? 0;
  const T = (p: L3): L3 => { const q = pitchAbout(p, HIPPO_PIVOT, pitch); return [q[0] + fwd, q[1] + lift, q[2]]; };
  const Tinv = (p: L3): L3 => pitchAbout([p[0] - fwd, p[1] - lift, p[2]], HIPPO_PIVOT, -pitch);
  const TEX = undefined;   // smooth wet skin: no scale cells (they read as a mosaic at the head close)
  const hide = (_u: number, sd: number) => ramp3(sd, HPX.under, HPX.skin, mixColor(HPX.skin, HPX.wet, 0.25));
  const root = R.bone('body', null);
  // barrel: rounded rump, deep wide belly, a slight dip behind the high shoulders, short thick neck base
  const body = spline([
    {p: [-1.458, 0.95 + bob, 0], a: 0.2, b: 0.22}, {p: [-1.36, 0.97 + bob, 0], a: 0.46, b: 0.43}, {p: [-1.05, 0.98 + bob, 0], a: 0.62, b: 0.52}, {p: [-0.45, 0.93 + bob, 0], a: 0.68, b: 0.56},
    {p: [0.09, 0.95 + bob, 0], a: 0.67, b: 0.54}, {p: [0.54, 1.02 + bob, 0], a: 0.58, b: 0.48}, {p: [0.855, 1.03 + bob, 0], a: 0.46, b: 0.41},
  ], 4);
  R.loft(root, {m: 16, col: hide, tex: TEX, fold: 5, cap: true, keys: body});
  // tail: short, flat-ish, with a dark bristle tuft
  const tb = onLoft(body, 0.02, 0, 0.1), tail = R.bone('tail', root, 'tail.base', tb);
  const tt = add(tb, [-0.32, -0.3, 0]);
  R.loft(tail, {m: 8, col: () => HPX.skin, keys: spline([{p: tb, a: 0.07, b: 0.08}, {p: add(tb, [-0.2, -0.12, 0]), a: 0.05, b: 0.05}, {p: tt, a: 0.025, b: 0.03}], 3)});
  R.flat(tail, {pts: [add(tt, [0.03, 0.02, 0.02]), add(tt, [-0.06, -0.1, 0.04]), add(tt, [-0.02, -0.12, -0.04]), add(tt, [0.03, 0.02, -0.02])], col: '#2e262b', two: true});
  // neck: short and as thick as the head
  const nb = onLoft(body, 0.94), nbk = keyAt(body, 0.94), neck = R.bone('neck', root, 'neck.base', nb), nu = o.neckUp ?? 0;
  const sk: L3 = [1.0, 1.2 + nu + bob, 0];
  R.loft(neck, {m: 14, col: hide, tex: TEX, keys: spline([{p: nb, a: nbk.a, b: nbk.b}, {p: lerp(nb, sk, 0.55), a: 0.4, b: 0.38}, {p: sk, a: 0.33, b: 0.3}], 3)});
  // skull: upper head (cranium + upper jaw), axis pitched by hp
  const hp = -0.14 + (o.headPitch ?? 0), skull = R.bone('skull', neck, 'skull.joint', sk);
  const H = (u0: number, v: number, w = 0): L3 => { const u = u0 * HS; return [sk[0] + u * Math.cos(hp) - v * Math.sin(hp), sk[1] + u * Math.sin(hp) + v * Math.cos(hp), w]; };
  const st = (u: number) => ({vt: interp(ST, u, 'vt'), vb: interp(ST, u, 'vb'), wd: interp(ST, u, 'wd')});
  const onSkull = (u: number, vf: number, g: number, out = 0): L3 => { const s = st(u), vm = (s.vt + s.vb) / 2, hh = (s.vt - s.vb) / 2; return H(u, vm + vf * hh, g * (s.wd * Math.sqrt(Math.max(0, 1 - vf * vf)) + out)); };
  const headCol = (u: number, sd: number) => ramp3(sd, mixColor(HPX.under, HPX.flush, 0.3), mixColor(HPX.skin, HPX.flush, 0.22 * sm(0.7, 0.95, u)), mixColor(HPX.skin, HPX.wet, 0.2));
  R.loft(skull, {m: 12, col: () => HPX.skin, tex: TEX, keys: ballKeys(sk, 0.3, [Math.cos(hp), Math.sin(hp), 0])});
  R.loft(skull, {m: 16, cap: true, tex: TEX, fold: 6, col: headCol, keys: domeEnd(spline(ST.map((q) => ({p: H(q.u, (q.vt + q.vb) / 2), a: q.wd, b: (q.vt - q.vb) / 2}) as Key), 3))});
  // eyes on raised turrets, small ears behind them, nostril bumps on top of the muzzle (the three things that show when it lurks)
  for (const [g, nm] of [[1, 'L'], [-1, 'R']] as const) {
    const e = onSkull(0.1, 0.62, g, -0.03), eb = R.bone(`eye.${nm}`, skull, `eye.${nm}.pivot`, e), out: L3 = nrm(add([0.35, 0.55, g * 0.75], [0, 0, 0]));
    R.loft(eb, {m: 10, col: () => HPX.skin, keys: ballKeys(e, 0.085, [0, 1, 0])});   // turret
    R.loft(eb, {m: 10, col: () => HPX.flush, keys: ballKeys(add(e, mul(out, 0.052)), 0.042, out)});   // flushed lid ring
    R.loft(eb, {m: 8, col: () => HPX.eye, keys: ballKeys(add(e, mul(out, 0.07)), 0.028, out)});   // dark eye
    R.loft(eb, {m: 6, col: () => '#e8dccc', keys: ballKeys(add(add(e, mul(out, 0.094)), [0.006, 0.01, 0]), 0.006, out)});   // small catch-light
    const eaB = onSkull(-0.07, 0.86, g, -0.02), ear = R.bone(`ear.${nm}`, skull, `ear.${nm}.base`, eaB), ea = o.ears ?? 0;
    const edir = nrm([-0.35 + 0.9 * Math.sin(ea), 1, g * 0.55]), etip = add(eaB, mul(edir, 0.13));
    R.loft(ear, {m: 8, cap: true, col: () => HPX.skin, keys: [{p: eaB, a: 0.05, b: 0.04}, {p: lerp(eaB, etip, 0.5), a: 0.055, b: 0.035}, {p: etip, a: 0.022, b: 0.018}]});
    const en = nrm([Math.cos(ea), 0.2, g * 0.6]);
    R.flat(ear, {pts: [add(lerp(eaB, etip, 0.2), mul(en, 0.03)), add(lerp(eaB, etip, 0.85), mul(en, 0.02)), add(add(lerp(eaB, etip, 0.55), mul(en, 0.03)), [0, 0, g * 0.03])], col: HPX.flush, two: true});
    const nz = onSkull(0.84, 0.82, g, -0.12);
    R.loft(skull, {m: 10, col: () => mixColor(HPX.skin, HPX.flush, 0.15), keys: ballKeys(nz, 0.055, [0, 1, 0])});
    const ns = add(nz, [0, 0.05, 0]), nw = 0.006 + 0.016 * clamp(o.nostril ?? 0);
    R.flat(skull, {pts: [add(ns, [-0.03, 0.004, g * -0.005]), add(ns, [0, 0.006, g * nw]), add(ns, [0.03, 0.004, g * 0.004]), add(ns, [0, 0.006, -g * nw * 0.6])], col: '#1e1418', two: true});
  }
  // lower jaw on its hinge under the back of the skull; jaw 0..1 opens it by HIPPO_GAPE
  const vb0 = st(0).vb + LIP, hinge = H(0, vb0), ja = hp - HIPPO_GAPE * jaw, jawB = R.bone('jaw', skull, 'jaw.hinge', hinge);
  const J = (u0: number, v: number, w = 0): L3 => { const u = u0 * HS; return [hinge[0] + u * Math.cos(ja) - v * Math.sin(ja), hinge[1] + u * Math.sin(ja) + v * Math.cos(ja), w]; };
  const jt = (u: number) => st(u).vb + LIP - vb0;   // mouth line relative to the hinge
  const jawCol = (u: number, sd: number) => ramp3(sd, mixColor(HPX.under, HPX.flush, 0.35), mixColor(HPX.skin, HPX.flush, 0.3 * sm(0.7, 0.95, u)), HPX.skin);
  R.loft(jawB, {m: 10, col: () => HPX.skin, keys: ballKeys(add(hinge, mul([Math.cos(ja), Math.sin(ja), 0], -0.08 * jaw)), 0.14, [Math.cos(ja), Math.sin(ja), 0])});   // slides back along its axis as the jaw opens, out of the mouth cavity   // hinge (the jaw's root part sits on its joint)
  R.loft(jawB, {m: 12, col: () => mixColor(HPX.skin, HPX.flush, 0.12), tex: TEX, keys: ballKeys(J(0.06, -0.14 - 0.07 * jaw), 0.2, [Math.cos(ja), Math.sin(ja), 0])});   // jowl (closes the hinge corner when it gapes)
  R.loft(jawB, {m: 14, cap: true, tex: TEX, col: jawCol, keys: domeEnd(spline(JW.map((q) => ({p: J(q.u, jt(q.u) - q.d / 2 + LIP / 2), a: q.w, b: q.d / 2 + LIP / 2}) as Key), 3))});
  // closed mouth: a dark, slightly wavy lip line along both sides where the upper head meets the jaw
  if (jaw <= 0.04) for (const g of [1, -1]) {
    const lat = (u: number) => { const q = st(u), vm = (q.vt + q.vb) / 2, hh = (q.vt - q.vb) / 2, f = (q.vb + LIP - vm) / hh; return q.wd * Math.sqrt(Math.max(0, 1 - f * f)) + 0.01; };
    const us = [0.04, 0.2, 0.4, 0.6, 0.78, 0.9, 0.95];
    for (let i = 0; i < us.length - 1; i++) {
      const a = us[i], b = us[i + 1], wv = (u: number) => 0.012 * Math.sin(u * 14);
      R.flat(skull, {pts: [H(a, st(a).vb + LIP + 0.012 + wv(a), g * lat(a)), H(b, st(b).vb + LIP + 0.012 + wv(b), g * lat(b)), H(b, st(b).vb + LIP - 0.01 + wv(b), g * lat(b)), H(a, st(a).vb + LIP - 0.01 + wv(a), g * lat(a))], col: '#3a2a30', two: true});
    }
  }
  if (jaw > 0.04) {
    // mouth (fix round 1: rounded, no boxy slabs): a domed pink palate that narrows to a U at the front, a rounded floor and a thick tongue in the lower jaw,
    // curved cheek membranes near the hinge, a soft dark throat, ivory tusks (lower canines) and peg incisors
    const tip = (u: number) => (u < 0.8 ? 1 : 1 - 0.62 * ((u - 0.8) / 0.17) ** 1.5);   // U-shaped front: the width falls off toward the tip
    R.loft(skull, {m: 14, cap: true, col: (u) => mixColor(HPX.throat, HPX.mouth, 0.2 + 0.8 * u), keys: spline([0.03, 0.18, 0.38, 0.58, 0.76, 0.87, 0.94].map((u, i) => ({p: H(u, st(u).vb + 0.02), a: st(u).wd * 0.8 * tip(u), b: [0.07, 0.075, 0.07, 0.065, 0.06, 0.055, 0.045][i]}) as Key), 3)});
    R.loft(jawB, {m: 14, cap: true, col: (u) => mixColor(HPX.throat, HPX.mouthDeep, 0.25 + 0.75 * u), keys: spline([0.03, 0.2, 0.42, 0.62, 0.8, 0.9].map((u, i) => ({p: J(u, jt(u) + LIP - 0.025), a: interp(JW, u, 'w') * 0.8 * tip(u), b: [0.06, 0.065, 0.06, 0.055, 0.05, 0.04][i]}) as Key), 3)});
    R.loft(jawB, {m: 14, cap: true, col: (u) => mixColor(HPX.mouthDeep, HPX.mouth, 0.35 + 0.65 * u), keys: spline([{p: J(0.04, jt(0.04) + LIP + 0.03), a: 0.12, b: 0.06}, {p: J(0.22, jt(0.22) + LIP + 0.06), a: 0.17, b: 0.08}, {p: J(0.42, jt(0.42) + LIP + 0.06), a: 0.18, b: 0.075}, {p: J(0.6, jt(0.6) + LIP + 0.04), a: 0.14, b: 0.055}, {p: J(0.68, jt(0.68) + LIP + 0.025), a: 0.07, b: 0.03}], 3)});
    // throat: a soft dark-red ball on the mouth's bisector just in front of the hinge, big enough to cover the hinge/jowl insides that showed as grey slats
    const bis = (hp + ja) / 2, bd: L3 = [Math.cos(bis), Math.sin(bis), 0];
    R.loft(skull, {m: 14, cap: true, col: (u) => mixColor(HPX.mouthDeep, HPX.throat, 0.35 + 0.4 * Math.abs(2 * u - 1)), keys: ((c0: L3, r: number, L: number) => [-1, -0.9, -0.6, 0, 0.6, 0.9, 1].map((z, i) => ({p: add(c0, [0, 0, z * L]), a: r * [0.08, 0.5, 0.85, 1, 0.85, 0.5, 0.08][i], b: r * [0.08, 0.5, 0.85, 1, 0.85, 0.5, 0.08][i]}) as Key))(add(hinge, mul(bd, 0.06 * jaw)), 0.11 + 0.06 * jaw, 0.2 + 0.1 * jaw)});
    for (const g of [1, -1]) {
      // cheek membrane: a sheet from the palate edge to the floor edge, bowed outward in the middle, three rows x four columns so it reads curved, not as one flat quad
      const us = Array.from({length: 9}, (_, i) => 0.27 * (i / 8));
      const row = (u: number, f: number): L3 => { const a0 = H(u, st(u).vb + 0.0, g * st(u).wd * 0.8 * tip(u)), b0 = J(u, jt(u) + LIP - 0.01, g * interp(JW, u, 'w') * 0.8 * tip(u)); const q = lerp(a0, b0, f); return [q[0] - 0.05 * Math.sin(Math.PI * f), q[1], q[2] + g * 0.05 * Math.sin(Math.PI * f) * (1 - u / 0.3)]; };
      const fs = Array.from({length: 7}, (_, i) => i / 6);
      for (let i = 0; i < us.length - 1; i++) for (let k = 0; k < fs.length - 1; k++) R.flat(skull, {pts: [row(us[i], fs[k]), row(us[i + 1], fs[k]), row(us[i + 1], fs[k + 1]), row(us[i], fs[k + 1])], col: mixColor(mixColor(HPX.throat, HPX.mouthDeep, 0.35 + 0.6 * (i / (us.length - 2))), HPX.mouth, 0.15 * Math.sin(Math.PI * ((k + 0.5) / (fs.length - 1)))), two: true});
      // lower tusk: a curved ivory tube rising from the jaw edge toward the upper jaw
      const tb0 = J(0.72, jt(0.72) + LIP - 0.03, g * 0.25), up: L3 = [-Math.sin(ja), Math.cos(ja), 0], fw: L3 = [Math.cos(ja), Math.sin(ja), 0];
      const tk = (f: number): L3 => add(add(tb0, mul(up, 0.3 * f)), add(mul(fw, -0.06 * f * f), [0, 0, g * 0.03 * f]));
      R.loft(jawB, {m: 8, cap: true, col: () => HPX.tusk, keys: [0, 0.35, 0.7, 1].map((f) => ({p: tk(f), a: 0.045 * (1 - f) + 0.008, b: 0.04 * (1 - f) + 0.008}) as Key)});
      // upper canine: short, down from the upper jaw edge
      const uc = H(0.66, st(0.66).vb + 0.02, g * 0.25), dn: L3 = [Math.sin(hp), -Math.cos(hp), 0];
      R.loft(skull, {m: 6, cap: true, col: () => HPX.tusk, keys: [{p: uc, a: 0.03, b: 0.03}, {p: add(uc, mul(dn, 0.06)), a: 0.02, b: 0.02}, {p: add(uc, mul(dn, 0.1)), a: 0.007, b: 0.007}]});
      // lower incisors: two pegs each side, pointing forward from the chin
      for (const w of [0.06, 0.13]) { const ib = J(0.9, jt(0.9) + LIP - 0.03, g * w); R.loft(jawB, {m: 6, cap: true, col: () => HPX.tusk, keys: [{p: ib, a: 0.022, b: 0.022}, {p: add(ib, add(mul(fw, 0.09), mul(up, 0.03))), a: 0.012, b: 0.012}]}); }
    }
  }
  // legs: short columns, broad round feet (pads), elbows/knees nearly straight
  const ph = o.walk ?? 0, S = o.stride ?? 0;
  const legs = [['HL', 1, -0.92, 0, 'hind'], ['HR', -1, -0.92, 0.5, 'hind'], ['FL', 1, 0.47, 0.25, 'fore'], ['FR', -1, 0.47, 0.75, 'fore']] as const;
  for (const [id, g, s0, off, kind] of legs) {
    const [l1, l2] = LEG[kind], hip = onLoft(body, uOfS(body, s0), g * 0.52, -0.46);
    const [ds, lf] = S ? gaitFoot(ph + off, S, 0.6, 0.12) : [0, 0];
    const padG: L3 = [s0 + 0.04 + ds, lf, g * 0.42];
    const padF: L3 = add(hip, [kind === 'hind' ? -0.25 : 0.2 + 0.25 * Math.sin((ph + off) * 6.283) * Math.sign(S || 0), -0.48, g * 0.06]);   // tucked: hind back, fore forward, paddling
    const pad = lerp(Tinv(padG), padF, fl), ankT = add(pad, [0, 0.12, 0]), ank = clampReach(hip, ankT, l1, l2);
    const knee = ik2(hip, ank, l1, l2, kind === 'hind' ? [1, 0, 0.15 * g] : [-1, 0, 0.15 * g]);
    limb(R, {id, parent: root, hip, knee, foot: ank, side: g, col: (_u, sd) => ramp3(sd, HPX.under, HPX.skin, HPX.skin), tex: TEX, pad: add(ank, [0.07, -0.1, 0]), padMin: 0.07, r: kind === 'hind' ? [0.3, 0.19, 0.16, 0.17] : [0.28, 0.18, 0.155, 0.17]});
    for (let k = 0; k < 4; k++) { const a = (k - 1.5) * 0.45, c = add(ank, [0.07 + 0.15 * Math.cos(a), -0.1, 0.15 * Math.sin(a)]); R.flat(`${id}.foot`, {pts: [add(c, [0, 0.04, -0.03]), add(c, [0.04, 0.0, 0]), add(c, [0, -0.02, 0.03]), add(c, [-0.02, 0.0, 0])], col: HPX.nail, two: true}); }
  }
  B.shadow = fl > 0.5 ? {s: 0, l: 0, rs: 0, rl: 0} : {s: -0.2 + fwd, l: 0, rs: 2.0, rl: 0.75};
  B.anchors = {...B.anchors, snout: H(0.97, -0.02), upperTip: H(0.97, 0.02), lowerTip: J(0.96, jt(0.96) - 0.02), hinge, eyeL: add(onSkull(0.1, 0.62, 1, -0.03), mul(nrm([0.35, 0.55, 0.75]), 0.098)), eyeR: add(onSkull(0.1, 0.62, -1, -0.03), mul(nrm([0.35, 0.55, -0.75]), 0.098)), nostril: add(onSkull(0.84, 0.82, 1, -0.12), [0, 0.055, 0]), earL: onSkull(-0.07, 0.86, 1), backTop: onLoft(body, uOfS(body, 0.54), 0, 1), rump: onLoft(body, 0), chest: onLoft(body, uOfS(body, 0.63), 0, -0.6)};
  if (pitch || lift || fwd) xform(B, T);
  B.look = HIPPO_LOOK;
  return B;
};

/** Where the lofted skin crosses the water plane `waterline` (world y) in this placement, as screen points (unordered), for the scene's waterline ring, ripples and bow wave. */
export const waterCut = (c: YCam, B: Build, place: BeastPlace, waterline: number): Pt[] => {
  const h = place.heading, fx = Math.cos(h), fz = Math.sin(h), lx = Math.sin(h), lz = -Math.cos(h), gy = place.ground ?? 0;
  const W = ([s, y, l]: L3): V3 => [place.at[0] + s * fx + l * lx, gy + y, place.at[1] + s * fz + l * lz];
  const out: Pt[] = [];
  for (const part of B.parts) {
    if (part.bone.endsWith('.foot') || part.bone.endsWith('.shin')) continue;
    for (const k of part.keys) for (let j = 0; j < 12; j++) {
      const th = (j / 12) * 6.283, a = W([k.p[0], k.p[1] + k.b * Math.sin(th), k.p[2] + k.a * Math.cos(th)]);
      if (Math.abs(a[1] - waterline) < Math.max(0.03, k.b * 0.3)) { const q = camPoint(c, [a[0], waterline, a[2]]); if (q) out.push(q); }
    }
  }
  return out;
};

/** Yawn timing (s) and the anim poses. Every pose is a pure function of t (0..1 over the range, or around the cycle). */
export const HIPPO_YAWN_SEC = 2.6;
const water = (p: HippoPose): HippoPose => ({float: 1, ...p});
export const HIPPO_POSES = {
  stand: (): HippoPose => ({jaw: 0}),
  /** rises from just under the surface: ripples first, then the head (eyes, ears, nostrils), then the back; ears flick as they clear the water */
  surface: (t: number): HippoPose => water({lift: -0.62 + 0.57 * sm(0, 0.8, t), headPitch: 0.14 + 0.1 * sm(0.1, 0.5, t) * (1 - sm(0.6, 1, t)), ears: 0.5 * Math.sin(Math.max(0, t - 0.55) * 30) * sm(0.55, 0.65, t) * (1 - sm(0.85, 1, t)), nostril: sm(0.4, 0.55, t) * (1 - sm(0.7, 0.9, t))}),
  /** yawn: rises out of the water chest-high, head back, jaw drops to the full 140 deg gape (hold), closes; the top jaw tip ~1.4 m above the water at the peak */
  yawn: (t: number): HippoPose => { const op = sm(0.12, 0.45, t) * (1 - sm(0.78, 0.98, t)), up = sm(0, 0.35, t) * (1 - 0.7 * sm(0.8, 1, t)); return water({lift: -0.05 + 0.38 * up, pitch: 0.32 * up, headPitch: 0.14 + 0.86 * op, jaw: op, ears: -0.4 * op, nostril: 0.3 * op}); },
  /** swim / bottom-walk: back and head at the surface, slow bob, legs paddling below */
  swim: (t: number): HippoPose => water({lift: -0.07 + 0.03 * Math.sin(t * 6.283), walk: t, stride: 0.5, headPitch: 0.16 + 0.02 * Math.sin(t * 6.283 + 1), nostril: 0.2}),
  /** charge cycle: surging bounds, head high, mouth a little open, chest pushing the bow wave */
  charge: (t: number): HippoPose => { const b = Math.sin(t * 6.283); return water({lift: 0.08 + 0.1 * b, pitch: 0.2 + 0.05 * b, headPitch: 0.42 + 0.06 * Math.sin(t * 6.283 + 0.8), jaw: 0.16 + 0.06 * (b * 0.5 + 0.5), walk: t, stride: 1.0, ears: -0.35, nostril: 0.8}); },
  /** halt: from the charge to a stop, head drops, chest settles back into the water, mouth closes; a last forward lurch at the stop */
  halt: (t: number): HippoPose => { const k = sm(0, 0.7, t); return water({lift: 0.08 * (1 - k) - 0.05 * k + 0.04 * Math.sin(Math.PI * sm(0.35, 0.75, t)), pitch: 0.2 * (1 - k) - 0.03 * Math.sin(Math.PI * sm(0.3, 0.8, t)), headPitch: 0.42 * (1 - k) + 0.14 * k, jaw: 0.19 * (1 - sm(0.2, 0.6, t)), fwd: 0.35 * sm(0, 0.6, t), ears: -0.35 * (1 - k) + 0.3 * k, nostril: 0.8 * (1 - k)}); },
  /** snort: head at the surface, nostrils flare and blow (the scene adds the spray), ears flick */
  snort: (t: number): HippoPose => { const blow = sm(0.3, 0.42, t) * (1 - sm(0.55, 0.8, t)); return water({lift: -0.1 + 0.05 * blow, headPitch: 0.2 + 0.1 * blow, nostril: Math.max(0.15, blow), ears: 0.5 * Math.sin(t * 25) * sm(0.45, 0.55, t) * (1 - sm(0.75, 0.9, t))}); },
  /** lurk cycle: only the eyes, ears, nostrils and a thin line of the head show; slow bob, ear twitch */
  lurk: (t: number): HippoPose => water({lift: -0.45 + 0.015 * Math.sin(t * 6.283), pitch: 0.12, headPitch: 0.14, neckUp: 0.16, ears: 0.35 * Math.max(0, Math.sin(t * 6.283 * 2)) ** 6, nostril: 0.1}),
};
