import {mixColor} from '../kit/painter';
import {add, ballKeys, clamp, clampReach, gaitFoot, ik2, keyAt, lerp, limb, mul, newRig, nrm, onLoft, spline, sub, uOfS, type Build, type Key, type L3, type Rig} from './beast';

// RAPTOR kit creature (Boss, 14 Nov 2026, kit test pass): a feathered Velociraptor-type dromaeosaur, about 2 m snout to tail, back 0.53 m over the hips. Built to the proportions measured on the
// store references `projects/shared/KIT/references/web/2026-11-14_raptor-velociraptor-{recon,td,head}.png` and `..._raptor-deinonychus-steveoc.jpg` (ratios to body length L = 2 m):
// hip joint 0.19 L, skull 0.12 L (long, low, narrow), tail 0.6 L (stiff, feather fan on its last 55 %), arm 0.175 L (three clawed fingers, wing of trailing feathers),
// femur 0.085 L, tibia 0.12 L, metatarsus 0.06 L, toe II held up with the sickle claw.
// Skeleton: body (root) -> tail [tail.base]; body -> neck [neck.base] -> skull [skull.joint] -> jaw [jaw.hinge], eye.L/R; body -> arms AL/AR (thigh = upper arm [hip = shoulder], shin = forearm
// [knee = elbow], foot = hand [ankle = wrist]); body -> legs LL/LR: thigh [hip] -> shin [knee] -> foot = metatarsus [ankle] with toes III-IV, the raised toe II and its sickle claw.
// Whole-body pitch and lift (the pounce) are applied after the build by one rigid transform about the hip, so every joint stays attached.

export const RPX = {back: '#4a3626', skin: '#7a5a3c', belly: '#e9e0cf', crown: '#5e4632', face: '#a08b72', throat: '#efe8da', snout: '#4a4540', leg: '#8d887d', legDark: '#6c675e', claw: '#1c1814', eye: '#e2b232', wing: '#523b28', wingDark: '#3e2c1e', wingPale: '#cdbb9c', tailDark: '#3a2b1f', tailPale: '#ddd1b8', mouth: '#a8585f', tooth: '#efe8d4'} as const;
/** Bone lengths (m): femur, tibia, metatarsus; humerus, forearm. */
export const RAPTOR_LEG = [0.17, 0.24, 0.12] as const;
export const RAPTOR_ARM = [0.12, 0.1] as const;
/** Hip joint height (m) standing, and the nominal pivot of the body transform. */
export const RAPTOR_HIP: L3 = [0, 0.39, 0];

export type RaptorPose = {
  /** walk phase (cycles) and stride (m); 0 stride = standing */
  walk?: number; stride?: number;
  /** body bob (m) */
  bob?: number;
  /** jaw open 0..1 (0.5 rad) */
  jaw?: number;
  /** tail yaw (rad, + toward the left flank) and pitch (rad, + up) about its base: the tail is stiff, so it turns as one piece */
  tail?: number; tailUp?: number;
  /** head: neck lift (m, + up) and head pitch (rad, + nose up) */
  neckUp?: number; headPitch?: number;
  /** wing spread 0 (folded along the flank) .. 1 (arms out and forward, feathers fanned) */
  wing?: number;
  /** whole body: pitch about the hip (rad, + nose up), lift (m) and forward shift (m) */
  pitch?: number; lift?: number; fwd?: number;
  /** foot pads in the GROUND frame [s, y, l] (left, right); overrides the walk. */
  pads?: [L3, L3];
  /** air feet: 0 = pads as given/walk, 1 = feet swung forward under the chest, sickle claws forward (body frame) */
  air?: number;
  /** sickle claw raise 0 (carried) .. 1 (swung forward to strike) */
  sickle?: number;
};

const sm = (a: number, b: number, t: number) => { const u = clamp((t - a) / (b - a)); return u * u * (3 - 2 * u); };
/** rotate `p` about `c` in the s-y plane by `a` (+ = nose up) */
const pitchAbout = (p: L3, c: L3, a: number): L3 => { const x = p[0] - c[0], y = p[1] - c[1], cs = Math.cos(a), sn = Math.sin(a); return [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs, p[2]]; };
/** Apply a rigid map to every point of a build (parts, flats, joints, feet, anchors); radii are unchanged. */
const xform = (B: Build, f: (p: L3) => L3) => {
  for (const q of B.parts) q.keys = q.keys.map((k) => ({...k, p: f(k.p)}));
  for (const fl of B.flats) { fl.pts = fl.pts.map(f); if (fl.veins) fl.veins = fl.veins.map((v) => v.map(f)); }
  for (const j of Object.keys(B.joints)) B.joints[j] = f(B.joints[j]);
  B.feet = B.feet.map(f);
  for (const a of Object.keys(B.anchors)) B.anchors[a] = f(B.anchors[a]);
};
/** a feather: quad from a base segment (`a`..`b`) to a narrower tip `len` along `dir` */
const feather = (R: Rig, bone: string, a: L3, b: L3, dir: L3, len: number, col: string, ink: string, tipW = 0.35) => {
  const m = lerp(a, b, 0.5), tip = add(m, mul(dir, len)), hw = mul(sub(b, a), tipW * 0.5);
  R.flat(bone, {pts: [a, b, add(tip, hw), sub(tip, hw)], col, two: true, ink});
};

export const buildRaptor = (o: RaptorPose = {}): Build => {
  const R = newRig(), B = R.B, bob = o.bob ?? 0, wg = clamp(o.wing ?? 0), air = clamp(o.air ?? 0), sk2 = clamp(o.sickle ?? 0), jaw = clamp(o.jaw ?? 0);
  const pitch = o.pitch ?? 0, lift = o.lift ?? 0, fwd = o.fwd ?? 0;
  const T = (p: L3): L3 => { const q = pitchAbout(p, RAPTOR_HIP, pitch); return [q[0] + fwd, q[1] + lift, q[2]]; };
  const Tinv = (p: L3): L3 => pitchAbout([p[0] - fwd, p[1] - lift, p[2]], RAPTOR_HIP, -pitch);
  const TEX = {n: 3, amp: 0.14, scale: 0.35, warm: '#9c6a3c', px: 6};
  const plum = (u: number, sd: number) => (sd > 0.45 ? RPX.back : sd < -0.4 ? RPX.belly : RPX.skin);
  const root = R.bone('body', null);
  // body: rump -> hips -> ribcage -> deep feathered chest -> neck base (measured: back 0.53 m over the hips, chest depth ~0.3 m)
  const body = spline([
    {p: [-0.24, 0.47 + bob, 0], a: 0.055, b: 0.062}, {p: [-0.1, 0.445 + bob, 0], a: 0.085, b: 0.095}, {p: [0.05, 0.415 + bob, 0], a: 0.1, b: 0.125},
    {p: [0.2, 0.395 + bob, 0], a: 0.097, b: 0.148}, {p: [0.32, 0.425 + bob, 0], a: 0.082, b: 0.132}, {p: [0.4, 0.51 + bob, 0], a: 0.055, b: 0.075},
  ], 4);
  R.loft(root, {m: 14, col: plum, tex: TEX, fold: 4, cap: true, keys: body});
  // tail: stiff and straight from the rump (0.6 L with its fan), turned as one piece by `tail` (yaw) and `tailUp` (pitch)
  const tb = onLoft(body, 0), tk = keyAt(body, 0), tail = R.bone('tail', root, 'tail.base', tb), NT = 10, TL = 1.0;
  const ty = o.tail ?? 0, tu = o.tailUp ?? 0;
  const tdir = (v: L3): L3 => { const c = Math.cos(tu), s = Math.sin(tu), x0 = v[0] * c - v[1] * s, y0 = v[0] * s + v[1] * c; return [x0 * Math.cos(ty) - v[2] * Math.sin(ty), y0, x0 * Math.sin(ty) + v[2] * Math.cos(ty)]; };
  const tpts: L3[] = Array.from({length: NT + 1}, (_, i) => { const f = i / NT; return add(tb, tdir([-TL * f, 0.035 * Math.sin(Math.PI * f * 0.8), 0])); });
  const tr = (f: number) => ({a: 0.011 + (tk.a - 0.011) * (1 - f) ** 1.4, b: 0.013 + (tk.b - 0.013) * (1 - f) ** 1.4});
  R.loft(tail, {m: 10, col: (u, sd) => (sd > 0.3 ? RPX.back : sd < -0.4 ? mixColor(RPX.belly, RPX.skin, 0.4) : RPX.skin), tex: TEX, keys: tpts.map((p, i) => ({p, ...tr(i / NT)}) as Key)});
  // tail fan: paired feathers on the last 55 %, swept back and drooping ~30 deg so the fan reads from the side as in the references; barred dark/pale toward the tip, then a terminal spray
  const tAt = (f: number): L3 => { const t = f * NT, i = Math.min(NT - 1, Math.floor(t)); return lerp(tpts[i], tpts[i + 1], t - i); };
  for (let k = 0; k < 14; k++) {
    const f = 0.36 + (k / 13) * 0.62, len = 0.05 + 0.14 * Math.sin(Math.PI * Math.min(1, (f - 0.32) / 0.72) * 0.85), bar = k >= 7 && k % 2 === 1;
    for (const g of [1, -1]) {
      const a = add(tAt(f - 0.03), [0, 0, g * tr(f).a * 0.6]), b = add(tAt(f + 0.03), [0, 0, g * tr(f).a * 0.6]);
      feather(R, tail, a, b, nrm(tdir([-0.6, -0.7, g * 0.6])), len, bar ? RPX.tailPale : k % 2 ? mixColor(RPX.tailDark, RPX.skin, 0.25) : RPX.tailDark, '#20160e', 0.55);
    }
  }
  for (let k = -2; k <= 2; k++) feather(R, tail, tAt(0.96), tAt(1), nrm(tdir([-1, -0.12, k * 0.28])), 0.15 - Math.abs(k) * 0.015, Math.abs(k) === 1 ? RPX.tailPale : RPX.tailDark, '#20160e', 1.6);
  // neck: slender S from the chest to the back of the skull (head carried a little above the back)
  const nb = onLoft(body, 0.9), nbk = keyAt(body, 0.9), neck = R.bone('neck', root, 'neck.base', nb), nu = o.neckUp ?? 0;
  const sk: L3 = [0.53, 0.6 + nu + bob, 0];
  R.loft(neck, {m: 12, col: (u, sd) => (sd < -0.2 ? RPX.throat : u > 0.6 ? RPX.crown : plum(u, sd)), tex: TEX, keys: spline([{p: nb, a: nbk.a, b: nbk.b}, {p: [0.45, 0.6 + nu * 0.6 + bob, 0], a: 0.042, b: 0.05}, {p: sk, a: 0.034, b: 0.038}], 3)});
  // skull: 0.24 m, low (depth 0.37 of its length at the back) and narrow; stations in metres along the head: vt/vb top and tooth line, wd half width
  const hp = -0.1 + (o.headPitch ?? 0), skull = R.bone('skull', neck, 'skull.joint', sk);
  const H = (u: number, v: number, w = 0): L3 => [sk[0] + u * Math.cos(hp) - v * Math.sin(hp), sk[1] + u * Math.sin(hp) + v * Math.cos(hp), w];
  const ST = [{u: -0.015, vt: 0.03, vb: -0.026, wd: 0.032}, {u: 0.03, vt: 0.04, vb: -0.03, wd: 0.037}, {u: 0.08, vt: 0.034, vb: -0.026, wd: 0.032}, {u: 0.13, vt: 0.022, vb: -0.021, wd: 0.022}, {u: 0.19, vt: 0.019, vb: -0.017, wd: 0.016}, {u: 0.225, vt: 0.012, vb: -0.012, wd: 0.01}, {u: 0.24, vt: 0.002, vb: -0.008, wd: 0.004}];
  const stAt = (u: number) => { let i = 0; while (i < ST.length - 2 && u > ST[i + 1].u) i++; const f = clamp((u - ST[i].u) / (ST[i + 1].u - ST[i].u)), m = (k: 'vt' | 'vb' | 'wd') => ST[i][k] + (ST[i + 1][k] - ST[i][k]) * f; return {vt: m('vt'), vb: m('vb'), wd: m('wd')}; };
  const onSkull = (u: number, vf: number, g: number, out = 0): L3 => { const s = stAt(u), vm = (s.vt + s.vb) / 2, hh = (s.vt - s.vb) / 2; return H(u, vm + vf * hh, g * (s.wd * Math.sqrt(Math.max(0, 1 - vf * vf)) + out)); };
  R.loft(skull, {m: 10, col: () => RPX.crown, tex: TEX, keys: ballKeys(sk, 0.04, [Math.cos(hp), Math.sin(hp), 0])});
  R.loft(skull, {m: 14, cap: true, tex: {...TEX, px: 4}, col: (u, sd) => (u > 0.74 ? RPX.snout : sd > 0.5 ? RPX.crown : sd < -0.45 ? RPX.throat : RPX.face), keys: spline(ST.map((q) => ({p: H(q.u, (q.vt + q.vb) / 2), a: q.wd, b: (q.vt - q.vb) / 2}) as Key), 3)});
  for (const [g, nm] of [[1, 'L'], [-1, 'R']] as const) {
    const e = onSkull(0.075, 0.4, g, -0.003), eb = R.bone(`eye.${nm}`, skull, `eye.${nm}.pivot`, e), out: L3 = nrm([0.15, 0.25, g]);
    R.loft(eb, {m: 10, col: () => '#2a2016', keys: ballKeys(e, 0.0155, out)});   // dark eye ring
    R.loft(eb, {m: 10, col: () => RPX.eye, keys: ballKeys(add(e, mul(out, 0.004)), 0.0115, out)});
    R.loft(eb, {m: 8, col: () => '#120d08', keys: ballKeys(add(e, mul(out, 0.0125)), 0.0055, out)});   // round pupil
    R.loft(eb, {m: 6, col: () => '#f6efd2', keys: ballKeys(add(add(e, mul(out, 0.0165)), [0.003, 0.004, 0]), 0.0018, out)});   // catch-light
    // nostril: a small dark slit near the snout tip; supra-orbital brow: a short dark ridge over the eye
    const n0 = onSkull(0.205, 0.45, g, 0.001);
    R.flat(skull, {pts: [add(n0, [-0.008, 0.002, 0]), add(n0, [0.006, 0.003, 0]), add(n0, [0.006, -0.002, 0]), add(n0, [-0.008, -0.002, 0])], col: '#15110d', two: true});
    R.flat(skull, {pts: [onSkull(0.045, 0.75, g, 0.004), onSkull(0.1, 0.72, g, 0.004), onSkull(0.1, 0.6, g, 0.006), onSkull(0.05, 0.62, g, 0.006)], col: mixColor(RPX.crown, '#1a120c', 0.35), two: true});
  }
  // lower jaw: hinged under the back of the skull, its top on the tooth line when shut; `jaw` drops it up to 0.5 rad
  const ja = hp - 0.5 * jaw, vb0 = stAt(0.02).vb, hinge = H(0.02, vb0 + 0.004), jawB = R.bone('jaw', skull, 'jaw.hinge', hinge);
  const J = (u: number, v: number, w = 0): L3 => [hinge[0] + u * Math.cos(ja) - v * Math.sin(ja), hinge[1] + u * Math.sin(ja) + v * Math.cos(ja), w];
  const jt = (u: number) => stAt(u + 0.02).vb - vb0 - 0.004;   // tooth line relative to the hinge (the hinge sits just inside the skull, above the tooth line)
  R.loft(jawB, {m: 10, cap: true, col: (u, sd) => (u > 0.8 ? RPX.snout : sd > 0.3 ? RPX.face : RPX.throat), tex: {...TEX, px: 4}, keys: spline([{p: J(0, 0), a: 0.03, b: 0.013}, {p: J(0.08, jt(0.08) - 0.011), a: 0.024, b: 0.011}, {p: J(0.15, jt(0.15) - 0.008), a: 0.016, b: 0.008}, {p: J(0.205, jt(0.205) - 0.005), a: 0.008, b: 0.005}], 3)});
  if (jaw > 0.05) {
    // mouth: dark midline sheet between the tooth line and the jaw, a pink tongue, and small recurved teeth on both rows
    R.flat(skull, {pts: [H(0.03, stAt(0.03).vb + 0.004), H(0.21, stAt(0.21).vb + 0.002), J(0.19, jt(0.19)), J(0.02, jt(0.02))], col: '#2a1014', two: true});
    R.loft(jawB, {m: 8, col: () => RPX.mouth, keys: spline([{p: J(0.03, jt(0.03) - 0.004), a: 0.012, b: 0.005}, {p: J(0.1, jt(0.1) - 0.003), a: 0.011, b: 0.005}, {p: J(0.16, jt(0.16) - 0.003), a: 0.006, b: 0.003}], 2)});
    for (const g of [1, -1]) {
      for (let i = 0; i < 11; i++) { const u = 0.06 + i * 0.016, s = stAt(u), w = g * (s.wd - 0.003), b0 = H(u, s.vb + 0.002, w); R.flat(skull, {pts: [add(b0, [-0.0035, 0, 0]), add(b0, [0.0035, 0, 0]), H(u - 0.004, s.vb - 0.009, w)], col: RPX.tooth, two: true}); }
      for (let i = 0; i < 9; i++) { const u = 0.06 + i * 0.016, w = g * Math.max(0.006, 0.026 - u * 0.1), b0 = J(u, jt(u), w); R.flat(jawB, {pts: [add(b0, [-0.003, 0, 0]), add(b0, [0.003, 0, 0]), J(u - 0.003, jt(u) + 0.008, w)], col: RPX.tooth, two: true}); }
    }
  }
  // arms: shoulder low on the chest; folded (wing 0) the elbow tucks back and the hand hangs with its claws down-forward, spread (wing 1) arms out and forward with the hands reaching
  for (const [g, nm] of [[1, 'L'], [-1, 'R']] as const) {
    const sh = onLoft(body, uOfS(body, 0.29), g * 0.72, -0.25);
    const wr0 = add(sh, [0.06, -0.15, g * 0.05]), wr1 = add(sh, [0.1, 0.04, g * 0.17]), wrist = clampReach(sh, lerp(wr0, wr1, wg), RAPTOR_ARM[0], RAPTOR_ARM[1]);
    const el = ik2(sh, wrist, RAPTOR_ARM[0], RAPTOR_ARM[1], lerp([-1, 0.1, 0.25 * g], [-0.6, 0.3, 0.8 * g], wg));
    const hdir = nrm(lerp([-0.25, -1, 0.05 * g], [0.75, -0.35, 0.55 * g], wg)), palm = add(wrist, mul(hdir, 0.055));
    const arm = limb(R, {id: `A${nm}`, parent: root, hip: sh, knee: el, foot: wrist, side: g, col: (u, sd) => (sd > 0.2 ? RPX.wing : RPX.skin), tex: TEX, pad: palm, padMin: 0.008, r: [0.028, 0.02, 0.014, 0.011]});
    // three fingers, each a thin loft ending in a hooked dark claw
    const side: L3 = [0, 0, g], up = nrm(sub([0, 1, 0], mul(hdir, hdir[1])));
    for (let f = 0; f < 3; f++) {
      const L = [0.05, 0.065, 0.058][f], b0 = add(palm, mul(side, (f - 1) * 0.008)), tip = add(add(b0, mul(hdir, L)), mul(side, (f - 1) * 0.01));
      R.loft(arm.foot, {m: 6, col: () => RPX.legDark, keys: [{p: b0, a: 0.007, b: 0.007}, {p: lerp(b0, tip, 0.5), a: 0.005, b: 0.005}, {p: tip, a: 0.004, b: 0.004}]});
      const c1 = add(tip, add(mul(hdir, 0.016), mul(up, -0.006))), c2 = add(tip, add(mul(hdir, 0.024), mul(up, -0.022)));
      R.flat(arm.foot, {pts: [add(tip, mul(up, 0.005)), c1, c2, add(tip, mul(up, -0.005))], col: RPX.claw, two: true});
    }
    // wing: secondaries along the forearm, longer primaries on the hand, trailing back and down along the flank when folded and fanned out sideways when spread
    const trail = nrm(lerp([-1, -0.3, 0.1 * g], [-0.8, -0.15, 0.55 * g], wg)), along: L3[] = [...[0, 0.25, 0.5, 0.75, 1].map((u) => lerp(el, wrist, u)), ...[0.4, 0.8].map((u) => lerp(wrist, palm, u)), ...[0.3, 0.6, 0.85].map((u) => lerp(palm, add(palm, mul(hdir, 0.06)), u))];
    along.forEach((p, k) => {
      const len = [0.07, 0.085, 0.095, 0.105, 0.115, 0.13, 0.145, 0.155, 0.15, 0.135][k], bone = k < 5 ? arm.shin : arm.foot, nx = along[Math.min(along.length - 1, k + 1)], pv = along[Math.max(0, k - 1)], ad = nrm(sub(nx, pv));
      const dir = nrm(add(trail, mul(ad, -0.15 + 0.06 * k * (1 - wg) * 0.3)));
      feather(R, bone, add(p, mul(ad, -0.012)), add(p, mul(ad, 0.012)), dir, len, k % 2 ? RPX.wing : RPX.wingDark, mixColor(RPX.wingPale, RPX.wing, 0.35), 0.8);
    });
  }
  // legs: hips on the lower flank; digitigrade with a short metatarsus slanted back from the ball of the foot; toes III-IV on the ground, toe II raised with the sickle claw
  const air0 = (g: number): L3 => [0.36 - 0.06 * g, 0.12, 0.08 * g];   // body-frame pad in the air (feet swung forward, claws forward)
  for (const [g, nm] of [[1, 'L'], [-1, 'R']] as const) {
    const hip = onLoft(body, uOfS(body, 0), g * 0.6, -0.32), l0 = 0.08 * g;
    let padG: L3;
    if (o.pads) padG = o.pads[g > 0 ? 0 : 1];
    else { const [ds, lf] = o.stride ? gaitFoot((o.walk ?? 0) + (g > 0 ? 0 : 0.5), o.stride, 0.6, 0.085) : [0, 0]; padG = [0.03 + ds, lf, l0]; }
    const pad = lerp(Tinv(padG), air0(g), air), mt = nrm(lerp([-0.4, 1, 0], [-1, 0.35, 0], air));
    const ankT: L3 = add(pad, mul(mt, RAPTOR_LEG[2])), ank = clampReach(hip, ankT, RAPTOR_LEG[0], RAPTOR_LEG[1]), padA = add(ank, mul(mt, -RAPTOR_LEG[2]));
    const knee = ik2(hip, ank, RAPTOR_LEG[0], RAPTOR_LEG[1], [1, 0.15, 0.1 * g]);
    const legCol = (u: number, sd: number) => (sd > 0.3 ? RPX.legDark : RPX.leg);
    // thigh in body plumage, shank and foot scaly grey
    limb(R, {id: `L${nm}`, parent: root, hip, knee, foot: ank, side: g, col: legCol, tex: {n: 3, amp: 0.12, scale: 0.6, px: 5}, pad: padA, padMin: 0.01, r: [0.068, 0.034, 0.02, 0.017]});
    for (const q of B.parts) if (q.bone === `L${nm}.thigh`) q.col = plum;   // the thigh is in body plumage, the shank and foot stay scaly
    R.loft(`L${nm}.thigh`, {m: 10, col: plum, tex: TEX, side: g, keys: spline([{p: lerp(hip, knee, 0.05), a: 0.072, b: 0.078}, {p: lerp(hip, knee, 0.45), a: 0.06, b: 0.066}, {p: lerp(hip, knee, 0.85), a: 0.036, b: 0.04}], 2)});   // feathered drumstick
    for (let k = 0; k < 4; k++) feather(R, `L${nm}.thigh`, add(lerp(hip, knee, 0.45 + 0.12 * k), [-0.03, -0.02, g * 0.05]), add(lerp(hip, knee, 0.5 + 0.12 * k), [-0.035, -0.04, g * 0.05]), nrm([-0.5, -1, 0.15 * g]), 0.045, k % 2 ? RPX.skin : RPX.back, '#2a1d14', 0.6);
    // toes: fwd along the foot (body heading), down on the ground in the frame the pad is in
    const ft = `L${nm}.foot`, fd: L3 = nrm(lerp([1, 0, 0], [0.6, 0.8, 0], air * 0.6)), dn = nrm(lerp([0, -1, 0], [0.6, -0.8, 0], air * 0.6));
    for (const [k, L] of [[-1, 0.075], [1, 0.065]] as const) {   // toe III (inner, longer) and IV
      const b0 = add(padA, [0, 0, g * k * 0.008]), tip = add(add(b0, mul(fd, L)), [0, 0, g * k * 0.012]);
      R.loft(ft, {m: 6, col: () => RPX.legDark, keys: [{p: b0, a: 0.011, b: 0.009}, {p: lerp(b0, tip, 0.5), a: 0.008, b: 0.007}, {p: tip, a: 0.005, b: 0.005}]});
      R.flat(ft, {pts: [add(tip, mul(dn, -0.005)), add(tip, mul(fd, 0.016)), add(add(tip, mul(fd, 0.014)), mul(dn, 0.012)), add(tip, mul(dn, 0.004))], col: RPX.claw, two: true});
    }
    // toe II raised off the ground and its recurved sickle claw (~0.065 m); `sickle` swings it forward to strike
    const ib: L3 = add(padA, [0.004, 0.012, -g * 0.016]), ia = (-0.9 + 1.2 * sk2), id2 = nrm([Math.cos(ia) * 0.45 + 0.55 * fd[0], Math.sin(ia) * 0.3 + 0.75 + fd[1] * 0.4, 0]), it = add(ib, mul(id2, 0.035));
    R.loft(ft, {m: 6, col: () => RPX.legDark, keys: [{p: ib, a: 0.011, b: 0.01}, {p: lerp(ib, it, 0.5), a: 0.009, b: 0.009}, {p: it, a: 0.008, b: 0.008}]});
    const cf = nrm(lerp(id2, fd, 0.5 + 0.4 * sk2)), cu = nrm([-cf[1], cf[0], 0]), sc = (u: number, v: number): L3 => add(it, add(mul(cf, u * 0.065), mul(cu, v * 0.065)));
    R.flat(ft, {pts: [sc(0, 0.12), sc(0.35, 0.22), sc(0.75, 0.12), sc(1, -0.15), sc(0.62, -0.02), sc(0.3, -0.08), sc(0, -0.12)], col: RPX.claw, two: true, ink: '#0a0806'});
    B.anchors[`sickle.${nm}`] = sc(1, -0.15);
  }
  B.shadow = {s: -0.15 + fwd, l: 0, rs: 0.8, rl: 0.22};   // the ground shadow follows the forward shift (the body transform below leaves it on the ground)
  B.anchors = {...B.anchors, snout: H(0.24, -0.004), mouth: J(0.12, jt(0.12)), eye: H(0.075, 0.012, 0.03), chest: [0.3, 0.33, 0], top: [0, 0.65, 0], tailTip: tpts[NT]};
  if (pitch || lift || fwd) xform(B, T);
  return B;
};

/** Walk gait: 0.5 m stride, 60 % duty, 0.9 s per cycle. A stance foot slides back one stride while the phase advances `duty`, so the body must cover `stride / duty` m per cycle for planted feet. */
export const RAPTOR_WALK = {stride: 0.5, duty: 0.6, sec: 0.9, perCycle: 0.5 / 0.6, speed: 0.5 / 0.6 / 0.9} as const;
/** Ground-frame foot pads (left, right) at walk phase `ph` (both down at whole and half cycles). */
export const raptorWalkPads = (ph: number): [L3, L3] => [1, -1].map((g) => { const [ds, lf] = gaitFoot(ph + (g > 0 ? 0 : 0.5), RAPTOR_WALK.stride, RAPTOR_WALK.duty, 0.085); return [0.03 + ds, lf, 0.08 * g] as L3; }) as [L3, L3];
/** Pounce timing: natural length (s) and the leap distance (m) the body covers from the crouch to the landing. */
export const RAPTOR_POUNCE = {sec: 1.3, dist: 1.4} as const;
const walkPose = (t: number): RaptorPose => ({walk: t, stride: RAPTOR_WALK.stride, bob: -0.012 * Math.cos(t * 4 * Math.PI), tail: 0.06 * Math.sin(t * 2 * Math.PI), headPitch: 0.03 * Math.sin(t * 4 * Math.PI), jaw: 0.1});
export const RAPTOR_POSES = {
  /** stand; `pads` keeps the feet where a walk left them (no pop) */
  stand: (pads?: [L3, L3]): RaptorPose => ({jaw: 0.12, pads}),
  /** walk cycle (`RAPTOR_WALK`): body bobbing twice per cycle, stiff tail swaying from its base */
  walk: walkPose,
  /** pounce, t 0..1 over `RAPTOR_POUNCE.sec`: crouch (0-0.25), push off (0.25-0.36), ballistic leap (0.36-0.82) rising nose-up with the feet swung forward, sickle claws raised to strike
   * and the wings spread for balance, then landing `RAPTOR_POUNCE.dist` m ahead and sinking into a half crouch (0.8-1, the hold pose). `pads` = the ground-frame feet at the start. */
  pounce: (t: number, pads: [L3, L3] = [[0.03, 0, 0.08], [0.03, 0, -0.08]]): RaptorPose => {
    const D = RAPTOR_POUNCE.dist, cr = sm(0, 0.25, t) * (1 - sm(0.25, 0.36, t)), push = sm(0.25, 0.36, t) * (1 - sm(0.8, 0.86, t)), u = clamp((t - 0.36) / 0.46), lc = sm(0.8, 0.9, t) - 0.5 * sm(0.9, 1, t);
    const air = sm(0.36, 0.5, t) * (1 - sm(0.72, 0.82, t)), fly = sm(0.4, 0.6, t) * (1 - sm(0.74, 0.86, t));
    const lift = -0.1 * cr + 0.03 * push + 0.36 * 4 * u * (1 - u) - 0.09 * lc, fwd = 0.12 * sm(0.25, 0.36, t) + (D - 0.12) * u;
    const at: [L3, L3] = t < 0.6 ? pads : [add(pads[0], [D, 0, 0]), add(pads[1], [D, 0, 0])];   // planted at the start, then (while the feet are fully in the air) the landing spot
    return {pads: at, lift, fwd, pitch: -0.1 * cr + 0.3 * fly - 0.08 * lc, air, sickle: sm(0.45, 0.6, t) * (1 - sm(0.76, 0.88, t)), wing: Math.max(0.3 * cr, sm(0.25, 0.4, t) * (1 - 0.6 * sm(0.82, 1, t))), jaw: 0.12 + 0.7 * sm(0.36, 0.6, t) * (1 - 0.7 * sm(0.8, 1, t)), tailUp: 0.06 * cr - 0.2 * fly + 0.05 * lc, neckUp: 0.02 * fly - 0.03 * lc, headPitch: -0.12 * fly};
  },
};
