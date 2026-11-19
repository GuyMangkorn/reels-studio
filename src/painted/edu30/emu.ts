import {mixColor} from '../kit/painter';
import {add, ballKeys, clamp, gaitFoot, lerp, limb, mul, newRig, nrm, onLoft, spline, sub, uOfS, type Build, type L3, type Rig} from '../survival/beast';

// EMU (EDU-EP30 VD30-05, Film look asset, W3 2026-11-19; Boss hardens into the creature kit). A real emu (Dromaius novaehollandiae) on the beast
// loft rig (survival/beast.ts, the RAPTOR system): no tail, a shaggy drooping mop body, a long neck with blue-grey bare skin on its upper half,
// a small head with a short broad bill, long bare grey legs with the backward-bending intertarsal joint and three forward toes. User Q1
// (page db, 2026-11-19): near-real proportions with a simple round expressive eye (cream ring, dark iris, one catch-light, an optional lid).
// Proportions (estimates from public descriptions, brief technical handoff): 1.70 m to the head top standing, back 1.08 m, body 1.0 m long,
// hip joint 0.80 m, intertarsal joint 0.42 m. Creature frame as the beast kit: +x forward, +y up, +z the bird's left; feet at y 0.
// EMU-HERO (VD30-05): `hero` adds an upright head tuft and a paler bib on the lower neck front. No costume.

export const EMU_PX = {
  body: '#5b4b3b', bodyDark: '#2f261d', bodyPale: '#8a7660', neckFeather: '#2c241d', skin: '#7c90a4', skinDark: '#5a6b7d',
  bill: '#3a3632', leg: '#6f675d', legDark: '#4c463f', claw: '#1c1813', eyeRing: '#e8dcc0', iris: '#2a170c', catch: '#fbf4e2', bib: '#b3a28a',
} as const;
/** Soft beast look (as HIPPO_LOOK) so the bird sits beside the painted cast without a faceted low-poly read. */
export const EMU_LOOK: NonNullable<Build['look']> = {sub: 3, ring: 2, rim: '#d9cdb4', rimK: 0.28, edge: 0.4, far: 0.2};

export type EmuPose = {
  /** walk or run phase in cycles (with `stride`) */
  walk?: number; stride?: number;
  /** body pitch about the hip (rad, + = nose up; a run leans the body forward with a negative pitch) and vertical bob (m) */
  pitch?: number; bob?: number;
  /** the head joint (back of the skull) in creature metres and the neck mid control point; default the upright stand */
  head?: L3; neckMid?: L3;
  /** head direction (unit-ish, creature frame); default level forward, a little down */
  headDir?: L3;
  /** head yaw about the vertical (rad, + = toward the bird's left), applied to headDir: the look to the lens */
  headYaw?: number;
  /** upper eyelid 0 (open) .. 1 (shut): 0.35 is the deadpan half-lid */
  lid?: number;
  /** ground-frame foot pads [left, right] (creature metres), overrides the gait */
  pads?: [L3, L3];
  /** flight share of a run: both feet off the ground lift (m) */
  lift?: number;
  hero?: boolean;
  /** look-frame flock variety: plumage tone shift -1..1 (darker .. paler) */
  tone?: number;
};

export const EMU_HIP: L3 = [0.02, 0.8, 0];
export const EMU_LEG = [0.4, 0.4] as const;
export const EMU_WALK = {stride: 0.62, duty: 0.6, sec: 0.85} as const;
export const EMU_RUN = {stride: 1.5, duty: 0.38, sec: 0.42} as const;

const feather = (R: Rig, bone: string, a: L3, b: L3, dir: L3, len: number, col: string, tipW = 0.3, ink?: string) => {
  const m = lerp(a, b, 0.5), tip = add(m, mul(dir, len)), hw = mul(sub(b, a), tipW * 0.5);
  R.flat(bone, {pts: [a, b, add(tip, hw), sub(tip, hw)], col, two: true, ink});
};
const pitchAbout = (p: L3, c: L3, a: number): L3 => { const x = p[0] - c[0], y = p[1] - c[1], cs = Math.cos(a), sn = Math.sin(a); return [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs, p[2]]; };
const yawV = (v: L3, a: number): L3 => [v[0] * Math.cos(a) - v[2] * Math.sin(a), v[1], v[0] * Math.sin(a) + v[2] * Math.cos(a)];
const hsh = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

export const buildEmu = (o: EmuPose = {}): Build => {
  const R = newRig(), bob = o.bob ?? 0, pitch = o.pitch ?? 0, tone = o.tone ?? 0;
  const tc = (c: string) => (tone >= 0 ? mixColor(c, EMU_PX.bodyPale, tone * 0.5) : mixColor(c, EMU_PX.bodyDark, -tone * 0.5));
  const P = (q: L3): L3 => { const r = pitchAbout(q, EMU_HIP, pitch); return [r[0], r[1] + bob, r[2]]; };   // body frame -> creature frame
  const TEX = {n: 3, amp: 0.2, scale: 0.25, warm: '#7a5c3c', px: 6};
  const plum = (_u: number, sd: number) => tc(sd > 0.5 ? EMU_PX.bodyDark : sd < -0.45 ? mixColor(EMU_PX.body, EMU_PX.bodyDark, 0.35) : EMU_PX.body);
  const root = R.bone('body', null);
  // body: a drooping egg, rump low and round, the chest a little higher; the mop hangs below its loft (fringe flats)
  const body = spline([
    {p: P([-0.5, 0.86, 0]), a: 0.07, b: 0.07}, {p: P([-0.4, 0.9, 0]), a: 0.17, b: 0.19}, {p: P([-0.18, 0.9, 0]), a: 0.25, b: 0.23},
    {p: P([0.08, 0.89, 0]), a: 0.25, b: 0.22}, {p: P([0.3, 0.9, 0]), a: 0.19, b: 0.18}, {p: P([0.44, 0.94, 0]), a: 0.08, b: 0.08},
  ], 4);
  R.loft(root, {m: 14, col: plum, tex: TEX, cap: true, keys: body});
  // shaggy mop: three rings of drooping double-shafted feathers along the flanks and rump, longer low down, dark tips; seeded per feather so stable
  let fk = 0;
  for (let ring = 0; ring < 4; ring++) for (let i = 0; i < 16; i++) for (const g of [1, -1]) {
    const u = 0.06 + i * 0.054 + (ring % 2) * 0.027, lat = g * [0.97, 0.93, 0.78, 0.45][ring], up = [-0.35, 0.05, 0.45, 0.8][ring], r = hsh(++fk);
    if (u > 0.9) continue;
    const a = onLoft(body, u, lat, up), b = onLoft(body, Math.min(0.95, u + 0.03), lat, up);
    const len = [0.13, 0.11, 0.09, 0.07][ring] * (0.75 + 0.5 * r), dir = nrm(P([-0.55, -1, g * 0.12]));
    feather(R, root, a, b, dir, len, tc(r > 0.7 ? mixColor(EMU_PX.body, EMU_PX.bodyDark, 0.55) : r > 0.25 ? mixColor(EMU_PX.body, EMU_PX.bodyDark, 0.15) : mixColor(EMU_PX.body, EMU_PX.bodyPale, 0.25)), 0.12);
  }
  for (let i = 0; i < 9; i++) {   // rump fringe (the mop's back edge)
    const r = hsh(++fk), a = onLoft(body, 0.05, (i - 4) * 0.22, -0.25), b = onLoft(body, 0.09, (i - 4) * 0.22, -0.35);
    feather(R, root, a, b, nrm(P([-0.55, -1, (i - 4) * 0.06])), 0.13 * (0.8 + 0.4 * r), tc(r > 0.5 ? mixColor(EMU_PX.body, EMU_PX.bodyDark, 0.4) : EMU_PX.body), 0.15);
  }
  // neck: from the chest top, an S up to the head joint; feathered dark low, bare blue-grey skin above with sparse dark hair
  const nb = onLoft(body, 0.9, 0, 0.3);
  const hj: L3 = o.head ?? [0.42, 1.6 + bob, 0];
  const nm: L3 = o.neckMid ?? lerp(nb, hj, 0.5);
  const neck = R.bone('neck', root, 'neck.base', nb);
  const nk = spline([{p: nb, a: 0.1, b: 0.1}, {p: lerp(nb, nm, 0.5), a: 0.072, b: 0.075}, {p: nm, a: 0.056, b: 0.058}, {p: lerp(nm, hj, 0.6), a: 0.044, b: 0.046}, {p: hj, a: 0.04, b: 0.042}], 3);
  const nmix = (u: number) => Math.max(0, Math.min(1, (u - 0.3) / 0.35));   // feathered base -> bare blue-grey skin, a soft blend (no collar edge)
  R.loft(neck, {m: 12, tex: {n: 2, amp: 0.06, px: 9}, keys: nk, col: (u, sd) => (o.hero && u < 0.5 && sd < -0.1 ? mixColor(EMU_PX.bib, EMU_PX.skin, nmix(u) * 0.6) : mixColor(tc(EMU_PX.neckFeather), sd > 0.4 ? EMU_PX.skinDark : EMU_PX.skin, nmix(u)))});
  for (let i = 0; i < 9; i++) for (const g of [1, -1]) {   // neck-base ruff
    const u = 0.05 + i * 0.045, r = hsh(++fk), a = onLoft(nk, u, g * 0.95, 0), b = onLoft(nk, u + 0.04, g * 0.95, 0);
    feather(R, neck, a, b, nrm([-0.3, -1, g * 0.3]), 0.07 * (0.7 + 0.5 * r), o.hero && i < 6 ? mixColor(EMU_PX.bib, EMU_PX.neckFeather, 0.25 + 0.3 * r) : tc(EMU_PX.neckFeather), 0.3);
  }
  // head: small skull and a short broad flat bill along the head direction; dark hairlike crown feathers
  const hd0 = nrm(o.headDir ?? [1, -0.12, 0]), hd = nrm(yawV(hd0, o.headYaw ?? 0));
  const hside = nrm([-hd[2], 0, hd[0]]), hup = nrm([-hd[0] * hd[1], 1 - hd[1] * hd[1], -hd[2] * hd[1]]);
  const skull = R.bone('skull', neck, 'skull.joint', hj), hc = add(hj, mul(hd, 0.03));
  const HP = (f: number, up: number, side: number): L3 => add(add(add(hc, mul(hd, f)), mul(hup, up)), mul(hside, side));
  R.loft(skull, {m: 12, cap: true, col: (u, sd) => (sd > 0.45 ? EMU_PX.neckFeather : EMU_PX.skin), tex: {n: 2, amp: 0.1, px: 4}, keys: [
    {p: HP(-0.05, 0.0, 0), a: 0.02, b: 0.02}, {p: HP(-0.03, 0.005, 0), a: 0.04, b: 0.042}, {p: HP(0.01, 0.006, 0), a: 0.046, b: 0.046}, {p: HP(0.045, 0.0, 0), a: 0.036, b: 0.034}, {p: HP(0.07, -0.006, 0), a: 0.024, b: 0.02}]});
  R.loft(skull, {m: 10, cap: true, col: () => EMU_PX.bill, keys: [{p: HP(0.065, -0.008, 0), a: 0.024, b: 0.016}, {p: HP(0.1, -0.012, 0), a: 0.02, b: 0.011}, {p: HP(0.128, -0.018, 0), a: 0.011, b: 0.006}]});
  for (let i = 0; i < 7; i++) {   // crown hair
    const r = hsh(++fk), a = HP(-0.04 + i * 0.012, 0.035, (r - 0.5) * 0.04), b = HP(-0.03 + i * 0.012, 0.035, (r - 0.5) * 0.04);
    feather(R, skull, a, b, nrm(add(mul(hup, 0.4), mul(hd, -1))), 0.035 + 0.02 * r, EMU_PX.neckFeather, 0.4);
  }
  if (o.hero) for (let i = 0; i < 4; i++) {   // EMU-HERO: an upright head tuft (identity cue)
    const a = HP(-0.01 + i * 0.008, 0.042, (i - 1.5) * 0.006), b = HP(0.0 + i * 0.008, 0.042, (i - 1.5) * 0.006);
    feather(R, skull, a, b, nrm(add(mul(hup, 1), mul(hd, -0.25 + i * 0.05))), 0.075 - i * 0.008, EMU_PX.neckFeather, 0.45);
  }
  // eyes: round, simple, expressive (user Q1): cream ring, dark iris, catch-light, optional upper lid in skin colour
  const lid = clamp(o.lid ?? 0);
  for (const [g, n] of [[1, 'L'], [-1, 'R']] as const) {
    const e = HP(0.012, 0.012, g * 0.038), out = nrm(add(mul(hside, g), mul(hd, 0.35))), eb = R.bone(`eye.${n}`, skull, `eye.${n}.pivot`, e);
    R.loft(eb, {m: 12, col: () => EMU_PX.eyeRing, keys: ballKeys(e, 0.021, out)});
    R.loft(eb, {m: 12, col: () => EMU_PX.iris, keys: ballKeys(add(e, mul(out, 0.006)), 0.0165, out)});
    R.loft(eb, {m: 6, col: () => EMU_PX.catch, keys: ballKeys(add(add(e, mul(out, 0.02)), add(mul(hup, 0.006), mul(hd, 0.004))), 0.0045, out)});
    if (lid > 0.02) {   // the lid: a skin-coloured cap over the upper part of the eye, its edge a straight line
      const c0 = add(e, mul(out, 0.022)), top = 0.026, edge = top - lid * 0.052;
      R.flat(eb, {pts: [add(add(c0, mul(hd, -0.026)), mul(hup, top)), add(add(c0, mul(hd, 0.026)), mul(hup, top)), add(add(c0, mul(hd, 0.026)), mul(hup, edge)), add(add(c0, mul(hd, -0.026)), mul(hup, edge))], col: EMU_PX.skinDark, two: true, ink: '#2a2f36'});
    }
  }
  // legs: hip inside the mop, intertarsal joint bending back, bare thick shank forward to the foot, three toes
  const feet: L3[] = [];
  for (const [g, n] of [[1, 'L'], [-1, 'R']] as const) {
    const hip = P(add(EMU_HIP, [0, 0, g * 0.1]));
    let pad: L3;
    if (o.pads) pad = o.pads[g > 0 ? 0 : 1];
    else if (o.stride) { const [ds, lf] = gaitFoot((o.walk ?? 0) + (g > 0 ? 0 : 0.5), o.stride, o.stride > 1 ? EMU_RUN.duty : EMU_WALK.duty, o.stride > 1 ? 0.32 : 0.12); pad = [0.06 + ds, lf + (o.lift ?? 0), g * 0.11]; }
    else pad = [0.06, 0, g * 0.12];
    const ankle = add(pad, [-0.03, 0.05, 0]);
    // the intertarsal joint sits behind the hip-ankle line (the backward "knee")
    const d = sub(ankle, hip), L = Math.min(Math.hypot(...d), (EMU_LEG[0] + EMU_LEG[1]) * 0.995), a = L / 2, h = Math.sqrt(Math.max(0, EMU_LEG[0] ** 2 - a * a));
    const dn = nrm(d), back = nrm(sub([-1, 0, 0], mul(dn, -dn[0]))), knee = add(add(hip, mul(dn, a)), mul(back, h));
    const legCol = (_u: number, sd: number) => (sd > 0.3 ? EMU_PX.legDark : EMU_PX.leg);
    const L1 = limb(R, {id: `L${n}`, parent: root, hip, knee, foot: ankle, side: g, col: legCol, tex: {n: 3, amp: 0.1, scale: 0.5, px: 5}, pad: add(pad, [0.05, 0.01, 0]), padMin: 0.012, r: [0.07, 0.034, 0.027, 0.02]});
    for (const q of R.B.parts) if (q.bone === `L${n}.thigh`) q.col = plum;   // the thigh is in plumage (hidden under the mop)
    // feathered drumstick down to just above the joint
    R.loft(L1.thigh, {m: 10, col: plum, tex: TEX, side: g, keys: spline([{p: lerp(hip, knee, 0.0), a: 0.1, b: 0.11}, {p: lerp(hip, knee, 0.25), a: 0.08, b: 0.085}, {p: lerp(hip, knee, 0.45), a: 0.05, b: 0.052}], 2)});
    const fd: L3 = nrm([1, 0, g * 0.08]), base = add(pad, [0.05, 0.012, 0]);
    for (const [k, len] of [[-1, 0.11], [0, 0.14], [1, 0.11]] as const) {   // three forward toes, the middle longest
      const tip = add(add(base, mul(fd, len)), [0, -0.006, k * 0.05 * g]);
      R.loft(L1.foot, {m: 6, col: () => EMU_PX.legDark, keys: [{p: base, a: 0.014, b: 0.012}, {p: lerp(base, tip, 0.5), a: 0.011, b: 0.009}, {p: tip, a: 0.007, b: 0.006}]});
      R.flat(L1.foot, {pts: [add(tip, [0, 0.006, 0]), add(tip, mul(fd, 0.02)), add(tip, [0, -0.004, 0])], col: EMU_PX.claw, two: true});
    }
    feet.push(pad);
  }
  R.B.feet = feet.map((f) => [f[0], f[1], f[2]] as L3);
  R.B.shadow = {s: -0.05, l: 0, rs: 0.5, rl: 0.24};
  R.B.anchors = {top: add(hc, mul(hup, 0.07)), head: hc, eye: HP(0.012, 0.012, 0.038), bill: HP(0.13, -0.018, 0), chest: onLoft(body, 0.85, 0, -0.3), rump: onLoft(body, 0.02)};
  R.B.look = EMU_LOOK;
  void uOfS;
  return R.B;
};

// ------------------------------------------------------------------ key poses (KP-EMU, the poses the storyboard uses)
const stride = (s: typeof EMU_WALK | typeof EMU_RUN) => s.stride;
export const EMU_POSES = {
  /** upright stand, head level */
  stand: (o: Partial<EmuPose> = {}): EmuPose => ({...o}),
  /** walk cycle phase 0..1: body bob twice a cycle, the head nods forward-back with the step */
  walk: (ph: number, o: Partial<EmuPose> = {}): EmuPose => ({walk: ph, stride: stride(EMU_WALK), bob: -0.015 * Math.cos(ph * 4 * Math.PI), head: [0.47 + 0.035 * Math.sin(ph * 4 * Math.PI), 1.56, 0], ...o}),
  /** peck: neck down to the wheat heads in front, the body tipped forward */
  peck: (o: Partial<EmuPose> = {}): EmuPose => ({pitch: -0.18, head: [0.95, 0.42, 0], neckMid: [0.78, 0.88, 0], headDir: [0.35, -1, 0], ...o}),
  /** run phase 0..1: body leaning forward, neck forward at about 40 deg, long flight stride */
  run: (ph: number, o: Partial<EmuPose> = {}): EmuPose => ({walk: ph, stride: stride(EMU_RUN), pitch: -0.2, bob: 0.05 * Math.sin(ph * 4 * Math.PI), head: [0.9, 1.38, 0], neckMid: [0.66, 1.18, 0], headDir: [1, -0.05, 0], ...o}),
  /** bow (B06-SH02 "ขอบคุณที่ชมครับ"): neck curved down in front of the chest, head tipped down, body tipped forward, one foot drawn back */
  bow: (o: Partial<EmuPose> = {}): EmuPose => ({pitch: -0.3, head: [0.72, 0.86, 0], neckMid: [0.66, 1.22, 0], headDir: [0.45, -1, 0], lid: 0.55, pads: [[0.12, 0, 0.12], [-0.18, 0, -0.11]], ...o}),
  /** look to the lens (B01-SH03, B07 callback): upright, head turned by `yaw` toward the camera, deadpan half-lid */
  look: (yaw: number, o: Partial<EmuPose> = {}): EmuPose => ({head: [0.4, 1.62, 0], headYaw: yaw, lid: 0.3, ...o}),
};
