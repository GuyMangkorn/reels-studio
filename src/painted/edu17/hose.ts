import type {Arm} from '../kit/cast';
import {shoulderPoint} from '../kit/cast';
import {capsule, ell, hardFill, inkLine, openHandParts, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {poseArms, type PoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {C} from './palette';
import {MAN} from './yard';

// EDU-EP17 hose rig (Boss W5; brief N3, N14, N15; scene sheets "Casting, props and hands"). Episode-local: the two new poses are written
// `new: hose-water` / `new: hose-pinch` for kit intake at delivery (brief N14 names kit poses-more.ts candidates; the kit is not edited mid-episode).
//  - ARMS: picture arm targets per pose key, all from the front-view shoulder points like the W3 `hoseArms` (the yard paints MAN with them).
//  - Hose states SPRAY / FLOW / STOP (sheet props table, SD17) drawn from the hand anchors the figure returns.
//  - N15 close-up of the hose end in his right fist (B03-SH02 upper half).

export type ArmKey = 'hose-water' | 'hose-flow' | 'hose-pinch' | 'visor' | PoseId;
type Arms = {rArm: Arm; lArm: Arm};
/** Arm targets for a pose key at ground point `g`, px per metre `u`. `hose-flow` = thumb off, end lowered to the waist (B01-SH05 on). */
export const armsFor = (k: ArmKey, g: Pt, u: number): Arms => {
  const R = shoulderPoint(MAN, g, u, {view: 'front'}, 'r'), L = shoulderPoint(MAN, g, u, {view: 'front'}, 'l'), at = (o: Pt, dx: number, dy: number): Pt => [o[0] + dx * u, o[1] - dy * u];
  if (k === 'hose-water') return {rArm: {via: at(R, -0.07, -0.245), to: at(R, -0.15, -0.39)}, lArm: {via: at(L, 0.06, -0.25), to: at(L, 0.03, -0.47)}};
  if (k === 'hose-flow') return {rArm: {via: at(R, -0.04, -0.255), to: at(R, -0.07, -0.49)}, lArm: {via: at(L, 0.06, -0.25), to: at(L, 0.03, -0.47)}};
  // hose-pinch: both hands up at the chest, elbows low and back by the ribs (KIT-ARM-DEPTH), right fist under the left pinch
  if (k === 'hose-pinch') return {rArm: {via: at(R, -0.015, -0.27), to: at(R, 0.11, -0.25), behind: 'upper'}, lArm: {via: at(L, 0.015, -0.27), to: at(L, -0.13, -0.17), behind: 'upper'}};
  const a = poseArms(k === 'visor' ? 'P30' : k, MAN, g, u, 'front');
  if (k === 'visor') {
    // P30 visor (W7, fix list item 2): elbow out at shoulder height, forearm up to the wrist at the temple. The rig's own left arm goes behind
    // the torso and stops short of the wrist (its relaxed hand hides under the forearm); the shot paints the forearm and the flat mitten on top (`visorHand`).
    const {E, W} = visorPoints(g, u);
    return {rArm: a.rArm as Arm, lArm: {via: E, to: [E[0] + (W[0] - E[0]) * 0.72, E[1] + (W[1] - E[1]) * 0.72], behind: 'all'}};
  }
  return {rArm: a.rArm as Arm, lArm: a.lArm as Arm};
};
/** P30 visor elbow E (out at shoulder height) and wrist W (at the temple, screen right of the face), picture px. */
export const visorPoints = (g: Pt, u: number): {E: Pt; W: Pt} => {
  const L = shoulderPoint(MAN, g, u, {view: 'front'}, 'l');
  return {E: [L[0] + 0.17 * u, L[1] - 0.01 * u], W: [L[0] + 0.045 * u, L[1] - 0.355 * u]};
};
/**
 * The P30 visor forearm and hand, painted over the figure (W7, fix list item 2; UT14 mitten): skin forearm E -> W, then a flat palm-down mitten
 * (kit `openHandParts`, squashed to its edge-on thickness) from the heel at the wrist toward screen left across the brow, fingertips rising
 * `tilt` degrees. `w` 0..1 eases it in from the forearm's own direction (the rise L0-8) to the flat visor.
 */
export const visorHand = (p: Painter, E: Pt, W: Pt, u: number, w = 1, tilt = 12) => {
  const skin = MAN.head.skin;
  const fore = capsule(E, W, 0.05 * u, 0.045 * u);
  hardFill(p, 7700, skin, fore);
  inkLine(p, 7701, fore, {weight: 1.1});
  const aFore = Math.atan2(W[1] - E[1], W[0] - E[0]), aVisor = Math.PI + (tilt * Math.PI) / 180;
  let da = aVisor - aFore;
  while (da > Math.PI) da -= 2 * Math.PI;
  while (da < -Math.PI) da += 2 * Math.PI;
  const ang = aFore + da * w, len = 0.27 * u, sq = 0.33 + 0.67 * (1 - w);
  const H = openHandParts([0, 0], 0, len / 0.125, 1);
  const c = Math.cos(ang), s = Math.sin(ang), heel: Pt = [W[0] - 0.01 * u, W[1]];
  const map = (pts: Pt[]) => pts.map(([x, y]): Pt => [heel[0] + x * c - y * sq * s, heel[1] + x * s + y * sq * c]);
  // the hand's shadow on the brow and eye (it is shading them), then the palm seen from below: lighter than the face so it parts from it
  if (w > 0.3) washAt(p, 7709, '#3a2216', 70 * w, map(H.palm).map(([x, y]): Pt => [x - 0.004 * u, y + 0.03 * u]), 0.2, 0.1);
  hardFill(p, 7702, mixColor(skin, '#e2a77c', 0.45), map(H.palm));
  inkLine(p, 7703, map(H.palm), {weight: 1.4});
  H.creases.forEach((cr, i) => inkLine(p, 7704 + i, map(cr), {closed: false, weight: 0.9}));
  inkLine(p, 7708, map(H.thumbCrease), {closed: false, weight: 0.9});
  return {heel, tip: map([[len, 0]])[0], ang};
};
const lp = (a: Pt, b: Pt, w: number): Pt => [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w];
const blendArm = (a: Arm, b: Arm, w: number): Arm => ({...(w < 0.5 ? a : b), to: lp(a.to, b.to, w), via: lp(a.via ?? a.to, b.via ?? b.to, w)});
/** Arms between two pose keys (`w` 0..1, already eased). */
export const armsBlend = (a: ArmKey, b: ArmKey, w: number, g: Pt, u: number): Arms => {
  const A = armsFor(a, g, u);
  if (w <= 0 || a === b) return A;
  const B = armsFor(b, g, u);
  return w >= 1 ? B : {rArm: blendArm(A.rArm, B.rArm, w), lArm: blendArm(A.lArm, B.lArm, w)};
};

export type HoseState = 'spray' | 'flow' | 'stop' | 'pinch';
export type HoseRig = {state: HoseState; /** 0..1 strength of the stream / spray (dribbles out on change). */ amt?: number; /** left hand holds the slack. */ lHold?: boolean;
  /** world ground point the stream falls to (default under the right hand). */ pour?: V3; t?: number};
const GROUND: V3[] = [[-2.2, 0.45, 0.6], [-2.15, 0.02, 0.72], [-1.7, 0.02, 0.95], [-1.1, 0.02, 0.7], [-0.9, 0.02, 0.35], [-0.5, 0.02, 0.25], [-0.3, 0.02, 0.12]];
const SPRAY_TGT: V3 = [0.62, 1.08, -0.6];
/** The garden hose for a posed MAN (shots; the look frames keep yard.ts `hose`): tap, slack S on the sand, to the left hand (`lHold`) or straight
 *  to the right fist, the stiff end out of the fist and its water. `feetY` = the figure's ground picture y (the stream lands there). */
export const paintHoseRig = (p: Painter, c: YCam, rHand: Pt | null, lHand: Pt | null, feetY: number, o: HoseRig, back = false) => {
  const w = (v: V3) => Math.max(1.2, (0.02 * camUnit(c, v)) / 2.2), uh = camUnit(c, [0.2, 0.9, -0.3]), amt = o.amt ?? 1, t = o.t ?? 0;
  const q = GROUND.map((v) => camPoint(c, v));
  let run: Pt[] = [];
  const flush = (i: number) => { if (run.length >= 2) inkLine(p, 2510 + i, run, {closed: false, color: C.hose, weight: w(GROUND[Math.min(i, GROUND.length - 1)]), still: true, curve: 0.5}); run = []; };
  q.forEach((v, i) => { if (v) run.push(v); else flush(i); });
  const last = run[run.length - 1];
  flush(20);
  const hw = w([0, 0.9, 0]);
  const holdL = o.lHold && lHand && o.state !== 'pinch';
  if (last && holdL) inkLine(p, 2531, [last, [lHand![0] - 4, (last[1] + lHand![1]) / 2], lHand!], {closed: false, color: C.hose, weight: w([0, 0.4, 0]), still: true, curve: 0.5});
  if (rHand) {
    const from = holdL ? lHand! : last;
    if (from && !(holdL && back)) inkLine(p, 2532, [from, [(from[0] + rHand[0]) / 2, Math.max(from[1], rHand[1]) + 0.12 * uh], rHand], {closed: false, color: C.hose, weight: hw, still: true, curve: 0.5});
    const tgt = camPoint(c, SPRAY_TGT);
    let dir: Pt = o.state === 'spray' && tgt ? [tgt[0] - rHand[0], tgt[1] - rHand[1]] : o.state === 'flow' ? [0.35, 1] : o.state === 'stop' ? [0.5, -0.35] : lHand ? [lHand[0] - rHand[0], lHand[1] - rHand[1]] : [0, -1];
    const dl = Math.hypot(dir[0], dir[1]) || 1; dir = [dir[0] / dl, dir[1] / dl];
    const len = o.state === 'pinch' && lHand ? Math.hypot(lHand[0] - rHand[0], lHand[1] - rHand[1]) + 0.05 * uh : 0.09 * uh;
    const end: Pt = [rHand[0] + dir[0] * len, rHand[1] + dir[1] * len];
    if (o.state === 'stop' || o.state === 'pinch') {
      // the end folded over on itself (pinched shut): a stub and a short bent-back tip
      const tip: Pt = [end[0] + 0.035 * uh * (dir[1] > 0 ? 1 : -0.6), end[1] + 0.03 * uh];
      inkLine(p, 2533, [rHand, end, tip], {closed: false, color: C.hose, weight: Math.max(1.4, (0.022 * uh) / 2.2), still: true, curve: 0.2});
      hardFill(p, 2553, C.hoseShade, ell(tip[0], tip[1], 0.01 * uh, 0.01 * uh, 8));
      // sputter: a few drops thrown off for amt > 0 (FLOW -> STOP)
      for (let i = 0; i < 6 && amt > 0.05; i++) {
        const k = (t * 3 + hash(2700 + i)) % 1, b: Pt = [end[0] + (hash(2710 + i) - 0.5) * 0.12 * uh * k, end[1] + 0.25 * uh * k * k];
        hardFill(p, 2720 + i, i % 2 ? C.spray : '#ffffff', ell(b[0], b[1], (0.006 * uh + 0.6) * amt, (0.008 * uh + 0.6) * amt, 6));
      }
      return end;
    }
    inkLine(p, 2533, [rHand, end], {closed: false, color: C.hose, weight: Math.max(1.4, (0.022 * uh) / 2.2), still: true, curve: 0});
    hardFill(p, 2553, C.hoseShade, ell(end[0], end[1], 0.012 * uh, 0.012 * uh, 8));
    if (o.state === 'spray' && tgt && amt > 0) {
      const dx = tgt[0] - end[0], dy = tgt[1] - end[1], ln = Math.hypot(dx, dy) || 1, n: Pt = [-dy / ln, dx / ln], fan = 0.16 * uh;
      for (let i = 0; i < 13; i++) {
        const s0 = (i - 6) / 6, e: Pt = [end[0] + (tgt[0] + n[0] * s0 * fan - end[0]) * amt, end[1] + (tgt[1] + n[1] * s0 * fan - end[1]) * amt], mid: Pt = [(end[0] + e[0]) / 2 + n[0] * s0 * fan * 0.25 * amt, (end[1] + e[1]) / 2 - fan * 0.22 * amt];
        inkLine(p, 2540 + i, [end, mid, e], {closed: false, color: i % 4 === 0 ? '#ffffff' : mixColor(C.spray, '#9fd0ea', (i % 3) * 0.25), weight: i % 4 === 0 ? 1.0 : 0.75, still: i % 2 === 0, curve: 0.45});
      }
      for (let i = 0; i < 26; i++) {
        const s0 = (hash(2560 + i) - 0.5) * 2, f = ((0.35 + hash(2590 + i) * 0.8 + t * 1.7) % 1.15) * amt, b: Pt = [end[0] + dx * f + n[0] * s0 * fan * f, end[1] + dy * f + n[1] * s0 * fan * f - fan * 0.25 * Math.sin(Math.PI * Math.min(1, f))];
        hardFill(p, 2620 + i, i % 3 ? C.spray : '#ffffff', ell(b[0], b[1], 0.005 * uh + 0.6, 0.005 * uh + 0.6, 6));
      }
      if (amt > 0.6) washAt(p, 2552, C.spray, 110, ell(tgt[0], tgt[1], fan * 1.2, fan * 0.5, 12), 0.2, 0.3);
    }
    if (o.state === 'flow' && amt > 0) {
      // the stream: thin wavering lines falling from the end to the sand at his feet, a splash and a dark wet patch (boils: water moves)
      const pour = o.pour ? camPoint(c, o.pour) : null, gy = pour ? pour[1] : feetY - 0.02 * uh, gx = pour ? pour[0] : end[0] + 0.07 * uh;
      const fall = (gy - end[1]) * Math.min(1, amt * 1.25);
      for (let i = 0; i < 3; i++) {
        const sx = (i - 1) * 0.004 * uh, pts: Pt[] = [];
        for (let j = 0; j <= 6; j++) { const k = j / 6; pts.push([end[0] + dir[0] * 0.03 * uh * Math.min(1, k * 3) + (gx - end[0]) * k * k + sx * (1 + k * 2), end[1] + fall * k]); }
        inkLine(p, 2560 + i, pts, {closed: false, color: i === 1 ? '#ffffff' : mixColor(C.spray, '#9fd0ea', 0.35), weight: i === 1 ? Math.max(0.9, 0.006 * uh) : Math.max(0.7, 0.004 * uh), still: false, curve: 0.5});
      }
      if (amt > 0.5) {
        washAt(p, 2570, mixColor(C.sand, '#5a4a32', 0.35), 120, ell(gx, gy, 0.16 * uh, 0.04 * uh, 14), 0.15, 0);
        for (let i = 0; i < 7; i++) { const a = Math.PI * (0.15 + 0.7 * hash(2580 + i)), r = 0.05 * uh * (0.6 + ((t * 4 + hash(2590 + i)) % 1)); hardFill(p, 2600 + i, '#ffffff', ell(gx + Math.cos(a) * r * 1.6, gy - Math.sin(a) * r * 0.7, 0.004 * uh + 0.5, 0.004 * uh + 0.5, 6)); }
      }
    }
    return end;
  }
  return null;
};

/** N15 upper half: the hose end in his right fist at close range (camera ~0.5 m, looking +x), sunlit, FLOW. `end` = the hose opening (world). */
export const paintHoseClose = (p: Painter, c: YCam, end: V3, o: {t?: number; flow?: number} = {}) => {
  const k = camUnit(c, end), e = camPoint(c, end);
  if (!e) return null;
  const R = 0.01 * k; // hose radius px (2 cm hose)
  // the hose runs +z (screen right) from the opening, dipping slightly toward his hand
  const at = (dz: number, dy = 0): Pt => camPoint(c, [end[0], end[1] + dy, end[2] + dz]) ?? e;
  const P: Pt[] = []; for (let i = 0; i <= 16; i++) { const dz = (i / 16) * 0.9; P.push(at(dz, -0.006 * Math.sin(dz * 2.2))); }
  const top = P.map(([x, y]) => [x, y - R] as Pt), bot = P.map(([x, y]) => [x, y + R] as Pt).reverse();
  hardFill(p, 9001, C.hose, [...top, ...bot]);
  hardFill(p, 9002, C.hoseShade, [...P.map(([x, y]) => [x, y + R * 0.25] as Pt), ...bot]);
  hardFill(p, 9003, mixColor(C.hose, '#f4ffd8', 0.55), [...P.map(([x, y]) => [x, y - R * 0.72] as Pt), ...P.map(([x, y]) => [x, y - R * 0.45] as Pt).reverse()]);
  // the opening: a dark ellipse rim
  hardFill(p, 9004, C.hoseShade, ell(e[0], e[1], R * 0.32, R, 12));
  hardFill(p, 9005, '#1f3d22', ell(e[0] - R * 0.05, e[1], R * 0.2, R * 0.66, 10));
  // his right fist round the hose 0.05-0.14 m from the end (mitten fist from the thumb side, UT mitten hands), wrist and forearm leaving frame right
  const skin = MAN.head.skin, shade = mixColor(skin, '#5a3424', 0.3), lite = mixColor(skin, '#fff2dc', 0.18), line = mixColor(shade, C.ink, 0.5);
  const f0 = at(0.05), f1 = at(0.14), fx = (f0[0] + f1[0]) / 2, fy = (f0[1] + f1[1]) / 2, hw = (f1[0] - f0[0]) / 2, up = 0.042 * k, dn = 0.05 * k;
  // forearm: from the wrist (fist right side) out to the frame edge, rising gently, with the tee sleeve edge far right
  const w0: Pt = [f1[0] - hw * 0.2, fy - up * 0.15], w1: Pt = [w0[0] + 0.5 * k, w0[1] - 0.2 * k], ah = 0.032 * k;
  hardFill(p, 9010, shade, [[w0[0], w0[1] - ah], [w1[0], w1[1] - ah * 1.35], [w1[0], w1[1] + ah * 1.35], [w0[0], w0[1] + ah * 1.05]]);
  hardFill(p, 9011, skin, [[w0[0], w0[1] - ah], [w1[0], w1[1] - ah * 1.35], [w1[0], w1[1] + ah * 0.2], [w0[0], w0[1] + ah * 0.15]]);
  // fist body: rounded block wrapping the hose, fingers curled under (four bumps), thumb along the top toward the opening
  const body: Pt[] = [];
  for (let i = 0; i <= 20; i++) { const a = (i / 20) * Math.PI * 2, cx = Math.cos(a), cy = Math.sin(a); body.push([fx + hw * 1.05 * Math.sign(cx) * Math.abs(cx) ** 0.55, fy + (cy < 0 ? up : dn) * Math.sign(cy) * Math.abs(cy) ** 0.55]); }
  hardFill(p, 9012, skin, body);
  hardFill(p, 9013, shade, body.filter(([, y]) => y > fy + dn * 0.2));
  for (let i = 0; i < 4; i++) { const x = f0[0] + hw * (0.3 + i * 0.47); hardFill(p, 9014 + i, i % 2 ? skin : lite, ell(x, fy + dn * 0.78, hw * 0.25, dn * 0.26, 10)); inkLine(p, 9020 + i, [[x - hw * 0.24, fy + dn * 0.55], [x - hw * 0.22, fy + dn * 0.98]], {closed: false, color: line, weight: 1.1, still: true}); }
  const th: Pt[] = [[fx + hw * 0.6, fy - up * 0.95], [f0[0] - hw * 0.25, fy - R * 1.25], [f0[0] - hw * 0.42, fy - R * 0.55], [f0[0] - hw * 0.1, fy - R * 0.35], [fx + hw * 0.4, fy - up * 0.45]];
  hardFill(p, 9018, lite, th);
  inkLine(p, 9019, [...body, body[0]], {closed: false, color: line, weight: 1.3, still: false, curve: 0.3});
  inkLine(p, 9024, th, {closed: false, color: line, weight: 1.1, still: false, curve: 0.4});
  // FLOW: a thin bright stream out of the opening, bending down and off frame left
  const fl = o.flow ?? 1, t = o.t ?? 0;
  if (fl > 0) {
    for (let i = 0; i < 3; i++) {
      const pts: Pt[] = []; for (let j = 0; j <= 8; j++) { const s = j / 8; pts.push([e[0] - s * 0.22 * k, e[1] + (i - 1) * R * 0.35 + s * s * 0.35 * k]); }
      inkLine(p, 9030 + i, pts, {closed: false, color: i === 1 ? '#ffffff' : mixColor(C.spray, '#9fd0ea', 0.3), weight: (i === 1 ? 0.5 : 0.35) * R * fl, still: false, curve: 0.5});
    }
    for (let i = 0; i < 8; i++) { const s = (t * 2 + hash(9040 + i)) % 1; hardFill(p, 9050 + i, '#ffffff', ell(e[0] - s * 0.24 * k, e[1] + s * s * 0.38 * k + (hash(9060 + i) - 0.5) * R, R * 0.12 + 1, R * 0.12 + 1, 6)); }
  }
  // sun glint on the hose top
  hardFill(p, 9070, '#ffffff', ell(at(0.3)[0], at(0.3)[1] - R * 0.6, R * 0.5, R * 0.12, 8));
  return {top: e[1] - R, bottom: e[1] + R, x: e[0]};
};
