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

/** A wing given for the LEFT wing (the right negates z): inner segment root -> wrist along `dir`, outer wrist -> tip along `bend`, `reach` 0 (real vestigial 0.24 m) .. 1 (mime 0.85 m). */
export type WingPose = {dir: L3; bend: L3; reach: number};
export const WING_FOLD: WingPose = {dir: [-0.55, -0.83, 0.08], bend: [-0.55, -0.83, 0.02], reach: 0};
export const WING_FLAP_OUT: WingPose = {dir: nrm([-0.35, -0.70, 0.62]), bend: nrm([-0.40, -0.88, 0.25]), reach: 0};
export const WING_ROOT: L3 = [0.10, 1.00, 0.21];
export const wingLen = (reach: number): [number, number] => [0.13 + 0.32 * reach, 0.11 + 0.29 * reach];

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
  /** wing(s) (T06): one value = both; [left, right]. Absent = no wing geometry at all (the locked look); FOLD hides in the plumage. */
  wing?: WingPose | [WingPose, WingPose];
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
/** The ground-frame pad of one foot (g +1 left, -1 right) of a pose: `pads` override, else the gait, else the stand. */
const emuPad = (o: EmuPose, g: 1 | -1): L3 => {
  if (o.pads) return o.pads[g > 0 ? 0 : 1];
  if (o.stride) { const [ds, lf] = gaitFoot((o.walk ?? 0) + (g > 0 ? 0 : 0.5), o.stride, o.stride > 1 ? EMU_RUN.duty : EMU_WALK.duty, o.stride > 1 ? 0.32 : 0.12); return [0.06 + ds, lf + (o.lift ?? 0), g * 0.11]; }
  return [0.06, 0, g * 0.12];
};
/** Both pads [left, right] a pose puts on the ground: pass them as `pads` of the next pose to keep the feet planted. */
export const emuPads = (o: EmuPose): [L3, L3] => [emuPad(o, 1), emuPad(o, -1)];
const hsh = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

const emuBodyKeys = (P: (q: L3) => L3) => spline([
    {p: P([-0.5, 0.86, 0]), a: 0.07, b: 0.07}, {p: P([-0.4, 0.9, 0]), a: 0.17, b: 0.19}, {p: P([-0.18, 0.9, 0]), a: 0.25, b: 0.23},
    {p: P([0.08, 0.89, 0]), a: 0.25, b: 0.22}, {p: P([0.3, 0.9, 0]), a: 0.19, b: 0.18}, {p: P([0.44, 0.94, 0]), a: 0.08, b: 0.08},
], 4);
/** Default neck mid point of a pose with no `neckMid` (the loft rig's own default), for the mixer. */
const defaultNeckMid = (pitch: number, bob: number, head: L3): L3 => {
  const P = (q: L3): L3 => { const r = pitchAbout(q, EMU_HIP, pitch); return [r[0], r[1] + bob, r[2]]; };
  return lerp(onLoft(emuBodyKeys(P), 0.9, 0, 0.3), head, 0.5);
};

/** Neck bend (deg) of a pose at its neck mid point: the angle between base -> `neckMid` and `neckMid` -> head (T06 r3: startle <= 25). */
export const emuNeckBend = (o: EmuPose): number => {
  const bob = o.bob ?? 0, pitch = o.pitch ?? 0, P = (q: L3): L3 => { const r = pitchAbout(q, EMU_HIP, pitch); return [r[0], r[1] + bob, r[2]]; };
  const nb = onLoft(emuBodyKeys(P), 0.9, 0, 0.3), hj = o.head ?? [0.42, 1.6 + bob, 0], nm = o.neckMid ?? lerp(nb, hj, 0.5);
  const a = nrm(sub(nm, nb)), b = nrm(sub(hj, nm));
  return Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) * 180 / Math.PI;
};

export const buildEmu = (o: EmuPose = {}): Build => {
  const R = newRig(), bob = o.bob ?? 0, pitch = o.pitch ?? 0, tone = o.tone ?? 0;
  const tc = (c: string) => (tone >= 0 ? mixColor(c, EMU_PX.bodyPale, tone * 0.5) : mixColor(c, EMU_PX.bodyDark, -tone * 0.5));
  const P = (q: L3): L3 => { const r = pitchAbout(q, EMU_HIP, pitch); return [r[0], r[1] + bob, r[2]]; };   // body frame -> creature frame
  const TEX = {n: 3, amp: 0.2, scale: 0.25, warm: '#7a5c3c', px: 6};
  const plum = (_u: number, sd: number) => tc(sd > 0.5 ? EMU_PX.bodyDark : sd < -0.45 ? mixColor(EMU_PX.body, EMU_PX.bodyDark, 0.35) : EMU_PX.body);
  const root = R.bone('body', null);
  // body: a drooping egg, rump low and round, the chest a little higher; the mop hangs below its loft (fringe flats)
  const body = emuBodyKeys(P);
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
  // wings (T06): two flat segments of loose dark plumes on each flank, drawn only when the pose has a `wing` (FOLD hides in the mop)
  if (o.wing) {
    const pair = Array.isArray(o.wing) ? o.wing : [o.wing, o.wing] as [WingPose, WingPose];
    ([[1, 'L'], [-1, 'R']] as const).forEach(([g, n], wi) => {
      const wp = pair[wi], d0 = nrm([wp.dir[0], wp.dir[1], wp.dir[2] * g]), d1 = nrm([wp.bend[0], wp.bend[1], wp.bend[2] * g]);
      const out = clamp((Math.abs(d0[2]) - 0.3) / 0.5), [l1, l2] = wingLen(wp.reach);
      const rootB: L3 = [WING_ROOT[0], WING_ROOT[1], g * (WING_ROOT[2] - 0.02 * (1 - out))];
      const wristB = add(rootB, mul(d0, l1)), tipB = add(wristB, mul(d1, l2));
      const ref = nrm(lerp([0, 0, 1], [1, 0, 0], out)), dm = nrm(add(d0, d1)), wv = nrm([dm[1] * ref[2] - dm[2] * ref[1], dm[2] * ref[0] - dm[0] * ref[2], dm[0] * ref[1] - dm[1] * ref[0]]);
      const [rp, wp2, tp] = [rootB, wristB, tipB].map(P);
      // r3: no solid flat, no tip fan; 7 seeded loose plumes along the two segments, each hanging (segment direction + (0, -0.8, 0)), two mop tones alternating
      for (let k = 0; k < 7; k++) {
        const r1 = hsh(5000 + wi * 40 + k), r2 = hsh(5100 + wi * 40 + k), tt = clamp((k + 0.5 + (r1 - 0.5) * 0.5) / 7), s1 = l1 / (l1 + l2);
        const inner = tt <= s1, base = inner ? add(rootB, mul(d0, l1 * (tt / s1))) : add(wristB, mul(d1, l2 * ((tt - s1) / (1 - s1)))), sd = inner ? d0 : d1;
        const dir = pitchAbout(nrm(add(sd, [0, -0.8, 0])), [0, 0, 0], pitch), q = P(base), len = (0.08 + 0.08 * r2) * (1 + wp.reach);
        feather(R, root, add(q, mul(wv, -0.015)), add(q, mul(wv, 0.015)), dir, len, tc(mixColor(EMU_PX.body, EMU_PX.bodyDark, k % 2 ? 0.35 : 0.15)), 0.5);
      }
      R.B.anchors[`wingRoot${n}`] = rp; R.B.anchors[`wingWrist${n}`] = wp2; R.B.anchors[`wingTip${n}`] = tp;
    });
  }
  // neck: from the chest top, an S up to the head joint; feathered dark low, bare blue-grey skin above with sparse dark hair
  const nb = onLoft(body, 0.9, 0, 0.3);
  const hj: L3 = o.head ?? [0.42, 1.6 + bob, 0];
  const nm: L3 = o.neckMid ?? lerp(nb, hj, 0.5);
  const neck = R.bone('neck', root, 'neck.base', nb);
  const nk = spline([{p: nb, a: 0.1, b: 0.1}, {p: lerp(nb, nm, 0.5), a: 0.072, b: 0.075}, {p: nm, a: 0.056, b: 0.058}, {p: lerp(nm, hj, 0.6), a: 0.044, b: 0.046}, {p: hj, a: 0.04, b: 0.042}], 3);
  const nmix = (u: number) => Math.max(0, Math.min(1, (u - 0.3) / 0.35));   // feathered base -> bare blue-grey skin, a soft blend (no collar edge)
  R.loft(neck, {m: 12, tex: {n: 2, amp: 0.06, px: 9}, keys: nk, col: (u, sd) => {
    const neckCol = mixColor(tc(EMU_PX.neckFeather), sd > 0.4 ? EMU_PX.skinDark : EMU_PX.skin, nmix(u));
    if (!(o.hero && u < 0.5 && sd < -0.1)) return neckCol;
    const bibCol = mixColor(EMU_PX.bib, EMU_PX.skin, nmix(u) * 0.6);
    return u < 0.40 ? bibCol : mixColor(bibCol, neckCol, (u - 0.40) / 0.10);   // r4: the bib fades into the neck colour over u 0.40-0.50 (no step at u 0.5)
  }});
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
    const pad = emuPad(o, g);
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
  R.B.anchors = {...R.B.anchors, top: add(hc, mul(hup, 0.07)), head: hc, eye: HP(0.012, 0.012, 0.038), bill: HP(0.13, -0.018, 0), chest: onLoft(body, 0.85, 0, -0.3), rump: onLoft(body, 0.02)};
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
  /** startle (T06, B03-SH01): head snaps up and back, eyes wide, the wing tuft ruffles a little (mix 0.15); feet = `o.pads` (the pads of the pose it comes from, planted) */
  startle: (o: Partial<EmuPose> = {}): EmuPose => ({head: [0.30, 1.70, 0], neckMid: [0.28, 1.36, 0], headDir: [0.6, 0.3, 0], pitch: 0.08, lid: 0, wing: wingMix(WING_FOLD, WING_FLAP_OUT, 0.15), ...o}),
  /** duck (T06, B04-SH03): head and neck dip forward and low, half-lid; feet = `o.pads`, planted */
  duck: (o: Partial<EmuPose> = {}): EmuPose => ({head: [0.55, 1.15, 0], neckMid: [0.40, 1.20, 0], headDir: [0.8, -0.3, 0], pitch: -0.10, bob: -0.04, lid: 0.2, ...o}),
};

// ------------------------------------------------------------------ wing mix, pose mixer, gait contact, reaction motions (T06)
const wingOf = (w: EmuPose['wing']): [WingPose, WingPose] => (Array.isArray(w) ? w : [w ?? WING_FOLD, w ?? WING_FOLD]);
const mixNum = (a: number, b: number, u: number) => (u >= 1 ? b : a + (b - a) * u);
const mix3 = (a: L3, b: L3, u: number): L3 => [mixNum(a[0], b[0], u), mixNum(a[1], b[1], u), mixNum(a[2], b[2], u)];
/** Mix two directions: the mixed direction renormalised to the mixed length (so mix(a, a) = a even for a non-unit vector). */
const mixDir = (a: L3, b: L3, u: number): L3 => { const m = mix3(a, b, u), n = nrm(m), l = mixNum(Math.hypot(...a), Math.hypot(...b), u); return [n[0] * l, n[1] * l, n[2] * l]; };
const mixWing1 = (a: WingPose, b: WingPose, u: number): WingPose => ({dir: mixDir(a.dir, b.dir, u), bend: mixDir(a.bend, b.bend, u), reach: mixNum(a.reach, b.reach, u)});
/** Mix two wing poses; one value in = one value out (both wings alike), a pair in = a pair out. */
export function wingMix(a: WingPose, b: WingPose, u: number): WingPose;
export function wingMix(a: WingPose | [WingPose, WingPose], b: WingPose | [WingPose, WingPose], u: number): WingPose | [WingPose, WingPose];
export function wingMix(a: WingPose | [WingPose, WingPose], b: WingPose | [WingPose, WingPose], u: number) {
  if (!Array.isArray(a) && !Array.isArray(b)) return mixWing1(a, b, u);
  const [al, ar] = wingOf(a), [bl, br] = wingOf(b);
  return [mixWing1(al, bl, u), mixWing1(ar, br, u)];
}

const DEFAULT_HEAD_DIR: L3 = [1, -0.12, 0];
/** Linear mix of two poses (`u` clamped 0..1): numbers and vectors mix, fields given by neither stay absent, a field given by one side only
 *  (`stride`, `pads`) is taken from that side whole, `hero` and `tone` come from `a`. `wing` and `neckMid` missing on one side take the
 *  build default (FOLD; the loft rig's mid-neck). T07 and T15 add their fields here. */
export const mixEmuPose = (a: EmuPose, b: EmuPose, u0: number): EmuPose => {
  const u = clamp(u0), r: EmuPose = {};
  const num = (k: 'walk' | 'pitch' | 'bob' | 'headYaw' | 'lid' | 'lift') => { if (a[k] !== undefined || b[k] !== undefined) r[k] = mixNum(a[k] ?? 0, b[k] ?? 0, u); };
  (['walk', 'pitch', 'bob', 'headYaw', 'lid', 'lift'] as const).forEach(num);
  if (a.stride !== undefined || b.stride !== undefined) r.stride = a.stride !== undefined && b.stride !== undefined ? mixNum(a.stride, b.stride, u) : (a.stride ?? b.stride);
  const bobA = a.bob ?? 0, bobB = b.bob ?? 0, headDef = (o: EmuPose, bob: number): L3 => o.head ?? [0.42, 1.6 + bob, 0];
  if (a.head || b.head) r.head = mix3(headDef(a, bobA), headDef(b, bobB), u);
  if (a.neckMid || b.neckMid) r.neckMid = mix3(a.neckMid ?? defaultNeckMid(a.pitch ?? 0, bobA, headDef(a, bobA)), b.neckMid ?? defaultNeckMid(b.pitch ?? 0, bobB, headDef(b, bobB)), u);
  if (a.headDir || b.headDir) r.headDir = mixDir(a.headDir ?? DEFAULT_HEAD_DIR, b.headDir ?? DEFAULT_HEAD_DIR, u);
  if (a.pads || b.pads) r.pads = a.pads && b.pads ? [mix3(a.pads[0], b.pads[0], u), mix3(a.pads[1], b.pads[1], u)] : (a.pads ?? b.pads);
  if (a.wing || b.wing) r.wing = wingMix(a.wing ?? WING_FOLD, b.wing ?? WING_FOLD, u);
  if (a.hero !== undefined) r.hero = a.hero;
  if (a.tone !== undefined) r.tone = a.tone;
  return r;
};

/** Body advance per gait cycle (m) that makes the stance foot static in the world, found numerically from `gaitFoot` over the stance. */
const advCache = new Map<number, number>();
export const gaitAdvance = (strideM: number): number => {
  let A = advCache.get(strideM);
  if (A === undefined) {
    const duty = strideM > 1 ? EMU_RUN.duty : EMU_WALK.duty, t0 = 0.02, t1 = duty - 0.02;
    A = -(gaitFoot(t1, strideM, duty, 0)[0] - gaitFoot(t0, strideM, duty, 0)[0]) / (t1 - t0);
    advCache.set(strideM, A);
  }
  return A;
};
/** Walk or run phase (cycles) at frame `f` for a body moving at `v` m/s from phase `ph0`: the stance foot stays fixed in the world. */
export const gaitPhase = (f: number, v: number, strideM: number, ph0 = 0) => ph0 + (f * v) / (30 * gaitAdvance(strideM));

const easeOut = (t: number) => 1 - (1 - clamp(t)) ** 2;
const keyAt = (keys: [number, number][], f: number) => { if (f <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) return mixNum(keys[i - 1][1], keys[i][1], (f - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])); return keys[keys.length - 1][1]; };

/** Startle (B03-SH01) at frame `f` after the bird's startle frame s: f 0..2 ease-out from `from` to the startle pose, hold to f 5 and on. Feet stay where `from` has them. */
export const emuStartle = (f: number, from: EmuPose): EmuPose => mixEmuPose(from, EMU_POSES.startle({pads: emuPads(from)}), easeOut(f / 2));
/** Duck-flap (B04-SH03) at local frame f 0..16: f 0..2 `from` -> duck, wing flutter w keys 0, .9, .2, .9, .1, 0 at f 0, 2, 4, 6, 8, 10, f 10..16 duck -> `to` (the walk pose again); both pads planted at the pads of `from` throughout. */
export const emuDuckFlap = (f: number, o: {from: EmuPose; to: EmuPose}): EmuPose => {
  const pads = emuPads(o.from), duck = EMU_POSES.duck({pads});
  const base = f <= 10 ? mixEmuPose(o.from, duck, easeOut(f / 2)) : mixEmuPose(duck, {...o.to, pads}, easeOut((f - 10) / 6));
  const w = keyAt([[0, 0], [2, 0.9], [4, 0.2], [6, 0.9], [8, 0.1], [10, 0]], f);
  return {...base, pads, wing: wingMix(WING_FOLD, WING_FLAP_OUT, w)};
};
/** Sideways hop (B04-SH03, from local 19) at frame f from its start: the pose and the creature-frame offset (+z = the bird's left) to add to the bird's `at`.
 *  f 0 crouch, f 1..5 airborne (parabola apex 0.25 m at f 3, pads 0.15 m up, wing 0.8), f 6 landing both feet together (bob -0.06), f 7..9 recover to stand. */
export const emuHop = (f: number, o: {side: 1 | -1; dist: number; from?: EmuPose}): {pose: EmuPose; offset: L3} => {
  const from = o.from ?? EMU_POSES.stand(), a = f >= 1 && f < 6 ? 1 : 0, stand = emuPads(EMU_POSES.stand());
  const h = f > 0 && f < 6 ? 0.25 * (1 - ((f - 3) / 3) ** 2) : 0, lat = clamp(f / 6);
  const pads0 = f <= 0 ? emuPads(from) : stand, pads: [L3, L3] = [[pads0[0][0], 0.15 * a, pads0[0][2]], [pads0[1][0], 0.15 * a, pads0[1][2]]];
  const bob = keyAt([[0, -0.08], [1, 0], [5, 0], [6, -0.06], [9, 0]], f), pitch = keyAt([[0, -0.05], [1, 0]], f);
  const w = keyAt([[0, 0], [0.001, 0.8], [6, 0.8], [9, 0]], f);
  return {pose: {...from, pads, bob, pitch, wing: wingMix(WING_FOLD, WING_FLAP_OUT, w)}, offset: [0, h, o.side * o.dist * lat]};
};
