import {capsule, ell} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {paperLayer, type PaperShadow} from './paper';

// `new: hen` (EDU-EP18-BRIEF-R1 N7, two village hens in SET-GATE18; Boss, 15 Nov 2026, pre-W3 comp card, not user-approved). Episode module now; it moves to
// kit/animals.ts at intake (KIT-P01) once approved. A flat card per view (left / right profile, front), a turn is a cut.
// Fix round 1 (15 Nov 2026, user: "strong cut lines, neck a square bar"): drawn in the EP18 papercut style (edu18/paper.ts) shared with the hippo and the
// EP18 dog copy: no ink outlines, each part a flat cut with a soft drop shadow, 2-3 stacked tonal layers; the neck is a curved tapered tube on a Bezier
// spine that bends through the peck; legs and toes are tapered rounded cuts; the front view is redrawn (round breast, hackle bib, blade comb, two wattles).
// Design (story first): an ordinary Thai village hen (ไก่บ้าน), red-brown with golden neck hackles, a dark tail fan, a small red single comb and wattle, yellow
// legs; a second, lighter buff hen for variety. Size: 0.40 m to the comb top standing (picture size, est). Units: metres, `unit` px per metre (the people/animals
// `unit`), `g` the ground point under the body centre.
// Pose: `state` stand | peck | walk; `walk` seconds on the gait clock (legs alternate, head bobs: holds, then thrusts forward); `peck` 0..1 (head down to the ground
// ahead and back, body tips forward); `t` plate clock (blink). Pure function of its arguments.

export type HenView = 'left' | 'right' | 'front';
export type HenPose = {view: HenView; state?: 'stand' | 'peck' | 'walk'; walk?: number; peck?: number; mouthOpen?: boolean};
export type HenDef = {body: string; hackle: string; wing: string; tail: string; comb: string; leg: string; beak: string; seed: number};
export const HENS: Record<'hen-brown' | 'hen-buff', HenDef> = {
  'hen-brown': {body: '#9a5a2e', hackle: '#c98a3e', wing: '#7a4626', tail: '#2e2a26', comb: '#c8302a', leg: '#d9a83a', beak: '#d9b24a', seed: 1801},
  'hen-buff': {body: '#d2a46a', hackle: '#e2b878', wing: '#b8864e', tail: '#4a3a2a', comb: '#c8302a', leg: '#d9a83a', beak: '#d9b24a', seed: 1811},
};
export const HEN_HEIGHT = 0.4;
/** Walk: 0.06 m step, 0.5 s per cycle; move `g` at this speed (m/s) toward the facing side so the planted foot does not slide. */
export const HEN_WALK = {step: 0.06, sec: 0.5, get speed() { return (2 * this.step) / this.sec; }} as const;
export type HenAnchors = {beak?: Pt; head?: Pt};

type UV = [number, number];
const sm = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
const rotAbout = (o: UV, a: number) => ([u, v]: UV): UV => [o[0] + (u - o[0]) * Math.cos(a) - (v - o[1]) * Math.sin(a), o[1] + (u - o[0]) * Math.sin(a) + (v - o[1]) * Math.cos(a)];
const ellUV = (c: UV, rx: number, ry: number, a = 0, n = 22): UV[] => ell(c[0], c[1], rx, ry, n, a) as UV[];
const lerp = (a: UV, b: UV, u: number): UV => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
/** A tapered tube along a quadratic Bezier spine (p0 -> p2 through control p1), widths w0 -> w1 (half widths), rounded both ends. */
const bezTube = (p0: UV, p1: UV, p2: UV, w0: number, w1: number, n = 12): UV[] => {
  const at = (u: number): UV => lerp(lerp(p0, p1, u), lerp(p1, p2, u), u), L: UV[] = [], R: UV[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, a = at(Math.max(0, u - 0.02)), b = at(Math.min(1, u + 0.02)), q = at(u), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = w0 + (w1 - w0) * sm(u);
    L.push([q[0] - (dy / l) * w, q[1] + (dx / l) * w]); R.push([q[0] + (dy / l) * w, q[1] - (dx / l) * w]);
  }
  // round caps: a half circle past each end, so no straight cut shows where the neck meets the breast or the head
  const capAt = (u: number, w: number, a0: number) => { const q = at(u), a = at(Math.max(0, u - 0.02)), b = at(Math.min(1, u + 0.02)), aN = Math.atan2(b[0] - a[0], -(b[1] - a[1]));
    return Array.from({length: 7}, (_, k): UV => { const ang = aN + a0 - (Math.PI * (k + 1)) / 8; return [q[0] + w * Math.cos(ang), q[1] + w * Math.sin(ang)]; }); };
  return [...L, ...capAt(1, w1, 0), ...R.reverse(), ...capAt(0, w0, Math.PI)];
};

export const drawHen = (p: Painter, seed: number, def: HenDef, g: Pt, unit: number, pose: HenPose, t: number, anchors?: HenAnchors) => {
  const dir = pose.view === 'left' ? -1 : 1, front = pose.view === 'front';
  const Q = (pts: UV[]): Pt[] => pts.map(([u, v]) => [g[0] + (front ? u : dir * u) * unit, g[1] - v * unit]);
  let n = 0;
  const sh: PaperShadow = {dx: 0.0025 * unit * (front ? 1 : dir), dy: 0.005 * unit, blur: Math.max(0.8, 0.004 * unit), op: 0.3};
  const shS: PaperShadow = {...sh, dx: sh.dx * 0.5, dy: sh.dy * 0.5, blur: sh.blur * 0.6};
  /** a papercut layer; `small` = a thin shadow, `none` = no shadow (a tonal glaze inside its parent) */
  const cut = (c: string, pts: UV[], s: 'big' | 'small' | 'none' = 'big') => paperLayer(p, seed * 1000 + ++n, c, Q(pts), {shadow: s === 'none' ? null : s === 'big' ? sh : shS});
  const tone = (c: string, k: number) => mixColor(c, k > 0 ? '#fbeedc' : '#2a1a14', Math.abs(k));
  const far = (c: string) => mixColor(c, '#2a2430', 0.25);
  const blink = ((t / 3.1 + (seed % 7) / 7) % 1) < 0.04;
  const ph = pose.state === 'walk' ? ((pose.walk ?? 0) / HEN_WALK.sec) % 1 : 0;
  const pk = pose.state === 'peck' ? Math.sin(Math.PI * sm(pose.peck ?? 0)) : 0;
  const bob = pose.state === 'walk' ? (ph % 0.5 < 0.3 ? -0.02 * (ph % 0.5) / 0.3 : 0.04 * ((ph % 0.5) - 0.3) / 0.2 - 0.02) : 0;   // head holds back then thrusts
  const leg = (c: string, hip: UV, knee: UV, ft: UV, toes: [number, number][]) => {
    const px = (a: UV) => Q([a])[0], w = 0.011 * unit;
    paperLayer(p, seed * 1000 + ++n, c, capsule(px(hip), px(knee), w * 1.25, w, 6), {shadow: shS});
    paperLayer(p, seed * 1000 + ++n, c, capsule(px(knee), px(ft), w, w * 0.85, 6), {shadow: shS});
    for (const [du, dv] of toes) paperLayer(p, seed * 1000 + ++n, mixColor(c, '#5a3a14', 0.12), capsule(px(ft), px([ft[0] + du, ft[1] + dv]), w * 0.62, w * 0.3, 5), {shadow: null});
  };
  const eyeAt = (e: UV, r: number) => {
    if (blink) { cut(tone(def.hackle, -0.25), ellUV(e, r * 1.1, r * 0.35, 0, 12), 'none'); return; }
    cut('#e08a2a', ellUV(e, r, r, 0, 14), 'none'); cut('#1a1410', ellUV(e, r * 0.6, r * 0.6, 0, 12), 'none'); cut('#fbf3e6', ellUV([e[0] + r * 0.25, e[1] + r * 0.3], r * 0.22, r * 0.22, 0, 8), 'none');
  };

  if (!front) {
    const tilt = -0.35 * pk, piv: UV = [0, 0.13], B = rotAbout(piv, tilt);
    const headStand: UV = [0.13 + bob, 0.36], headPeck: UV = [0.21, 0.055], hc = lerp(headStand, headPeck, pk);
    // far leg, near leg (tapered shank, three forward toes and a back toe)
    const toes: [number, number][] = [[0.045, -0.012], [0.042, -0.004], [0.036, 0.004], [-0.024, -0.006]];
    for (const L of [{off: 0.5, x: -0.015, c: far(def.leg)}, {off: 0, x: 0.02, c: def.leg}]) {
      if (L.off === 0) continue;
      const lp = (ph + L.off) % 1, swing = pose.state === 'walk' ? (lp < 0.5 ? HEN_WALK.step * (1 - 4 * lp) : HEN_WALK.step * (-1 + 4 * (lp - 0.5))) : 0, lift = pose.state === 'walk' && lp > 0.5 ? 0.03 * Math.sin(Math.PI * (lp - 0.5) * 2) : 0;
      const hip = B([L.x, 0.13]), knee: UV = [hip[0] - 0.02 + swing * 0.5, 0.07 + lift], ft: UV = [L.x + swing, 0.012 + lift];
      leg(L.c, hip, knee, ft, toes);
    }
    // tail fan: dark base, a sheen layer, a lighter inner feather
    cut(def.tail, [B([-0.1, 0.22]), B([-0.13, 0.33]), B([-0.17, 0.39]), B([-0.205, 0.37]), B([-0.225, 0.31]), B([-0.205, 0.235]), B([-0.13, 0.17])]);
    cut(mixColor(def.tail, '#4a7a62', 0.25), [B([-0.12, 0.23]), B([-0.15, 0.33]), B([-0.18, 0.365]), B([-0.2, 0.33]), B([-0.19, 0.25]), B([-0.14, 0.2])], 'small');
    cut(tone(def.tail, 0.12), [B([-0.14, 0.25]), B([-0.17, 0.33]), B([-0.185, 0.3]), B([-0.17, 0.25])], 'small');
    // body: egg; breast glaze forward-low, back shade
    cut(def.body, ellUV([0, 0.2], 0.15, 0.097, 0.12).map(B));
    cut(tone(def.body, 0.16), ellUV([0.055, 0.175], 0.085, 0.06, 0.3).map(B), 'none');
    cut(tone(def.body, -0.1), ellUV([-0.07, 0.15], 0.07, 0.04, 0.1).map(B), 'none');
    // near leg goes over the belly line, under the wing
    { const lp = ph % 1, swing = pose.state === 'walk' ? (lp < 0.5 ? HEN_WALK.step * (1 - 4 * lp) : HEN_WALK.step * (-1 + 4 * (lp - 0.5))) : 0, lift = pose.state === 'walk' && lp > 0.5 ? 0.03 * Math.sin(Math.PI * (lp - 0.5) * 2) : 0;
      const hip = B([0.02, 0.13]), knee: UV = [hip[0] - 0.02 + swing * 0.5, 0.07 + lift], ft: UV = [0.02 + swing, 0.012 + lift];
      cut(tone(def.body, 0.05), ellUV(B([0.025, 0.125]), 0.035, 0.028, 0, 14), 'small');   // thigh fluff over the leg root
      leg(def.leg, hip, knee, ft, toes); }
    // wing: layered feather groups (covert, secondaries, a scallop row)
    cut(def.wing, ellUV([-0.02, 0.205], 0.098, 0.058, 0.2).map(B));
    cut(tone(def.wing, -0.14), [B([-0.11, 0.2]), B([-0.06, 0.165]), B([0.02, 0.165]), B([0.05, 0.18]), B([-0.02, 0.19]), B([-0.1, 0.215])], 'small');
    // primaries: two long feather cuts toward the tail, the upper one lighter (stacked paper)
    cut(tone(def.wing, -0.18), ellUV(B([-0.065, 0.178]), 0.06, 0.02, 0.32 + tilt), 'small');
    cut(tone(def.wing, 0.12), ellUV(B([-0.01, 0.222]), 0.065, 0.024, 0.08 + tilt), 'small');
    // neck: a curved tapered hackle tube on a Bezier spine from deep in the shoulder to under the head; bends forward and down through the peck
    const nb = B([0.05, 0.225]), hb: UV = [hc[0] - 0.01, hc[1] - 0.008];
    const mid = lerp(nb, hb, 0.5), dl = Math.hypot(hb[0] - nb[0], hb[1] - nb[1]) || 1, fwd: UV = [(hb[1] - nb[1]) / dl, -(hb[0] - nb[0]) / dl];   // the front side of the neck
    const ctrl = lerp([mid[0] - fwd[0] * 0.014, mid[1] - fwd[1] * 0.014 + 0.006], [nb[0] + 0.13, nb[1] + 0.04], pk);   // a soft S: full hackle at the shoulder, tapering into the head
    cut(def.hackle, bezTube(nb, ctrl, hb, 0.056, 0.031));
    cut(tone(def.hackle, 0.12), bezTube(lerp(nb, ctrl, 0.3), lerp(ctrl, hb, 0.3), lerp(ctrl, hb, 0.85), 0.03, 0.018), 'none');   // a lighter hackle layer down the front
    // head: comb, wattle, beak, eye (rotates nose-down through the peck)
    const H = rotAbout(hc, 0.9 * pk);
    cut(def.comb, [[-0.03, 0.022], [-0.026, 0.044], [-0.012, 0.034], [-0.002, 0.056], [0.01, 0.037], [0.021, 0.05], [0.029, 0.024]].map(([u, v]) => H([hc[0] + u, hc[1] + v])), 'small');
    cut(def.hackle, ellUV(hc, 0.035, 0.031, 0, 18).map(H));
    cut(tone(def.hackle, 0.12), ellUV([hc[0] + 0.008, hc[1] + 0.008], 0.022, 0.017, 0, 14).map(H), 'none');
    cut(def.comb, ellUV([hc[0] + 0.03, hc[1] - 0.034], 0.011, 0.016, 0, 12).map(H), 'small');
    cut(def.beak, [[hc[0] + 0.026, hc[1] + 0.008], [hc[0] + 0.044, hc[1] + 0.004], [hc[0] + 0.059, hc[1] - 0.006], [hc[0] + 0.044, hc[1] - 0.008], [hc[0] + 0.026, hc[1] - 0.013]].map((q) => H(q as UV)), 'small');
    cut(tone(def.beak, -0.18), [[hc[0] + 0.03, hc[1] - 0.004], [hc[0] + 0.057, hc[1] - 0.006], [hc[0] + 0.03, hc[1] - 0.012]].map((q) => H(q as UV)), 'none');
    eyeAt(H([hc[0] + 0.012, hc[1] + 0.006]), 0.0072);
    if (anchors) { anchors.beak = Q([H([hc[0] + 0.059, hc[1] - 0.006])])[0]; anchors.head = Q([hc])[0]; }
  } else {
    // front: legs, tail fan above the back, wings either side, round breast, a hackle bib, head on top (blade comb, beak at the lens, two wattles)
    const sx = pose.state === 'walk' ? 0.008 * Math.sin(ph * 2 * Math.PI) : 0, dn = 0.04 * pk;
    for (const s of [-1, 1]) {
      const lift = pose.state === 'walk' ? Math.max(0, 0.02 * Math.sin(ph * 2 * Math.PI + (s > 0 ? Math.PI : 0))) : 0;
      leg(def.leg, [s * 0.032 + sx, 0.13], [s * 0.036 + sx, 0.07 + lift], [s * 0.038 + sx, 0.014 + lift], [[-0.026 * s, -0.008], [0, -0.014], [0.026 * s, -0.008]]);
    }
    cut(def.tail, [[-0.06, 0.24], [-0.07, 0.3], [-0.05, 0.325], [0, 0.31], [0.05, 0.325], [0.07, 0.3], [0.06, 0.24]]);
    for (const s of [-1, 1]) { cut(def.wing, ellUV([s * 0.08, 0.2 - dn], 0.04, 0.072, -s * 0.18)); cut(tone(def.wing, 0.12), ellUV([s * 0.084, 0.185 - dn], 0.022, 0.045, -s * 0.18), 'none'); }
    cut(def.body, ellUV([0, 0.195 - dn], 0.098, 0.105));
    cut(tone(def.body, 0.14), ellUV([0, 0.17 - dn], 0.07, 0.07), 'none');
    cut(tone(def.body, 0.26), ellUV([0.006, 0.16 - dn], 0.04, 0.042), 'none');
    const fh: UV = [0, 0.335 - 0.25 * pk];
    // hackle bib: a rounded cape from the shoulders up into the head
    const bib: UV[] = [[-0.062, 0.25 - dn], [-0.07, 0.275 - dn], [-0.05, fh[1] - 0.005], [-0.028, fh[1] + 0.02], [0.028, fh[1] + 0.02], [0.05, fh[1] - 0.005], [0.07, 0.275 - dn], [0.062, 0.25 - dn], [0.03, 0.232 - dn], [0, 0.226 - dn], [-0.03, 0.232 - dn]];
    cut(def.hackle, bib);
    cut(tone(def.hackle, 0.14), [[-0.035, 0.245 - dn], [-0.03, fh[1] - 0.01], [0.03, fh[1] - 0.01], [0.035, 0.245 - dn], [0, 0.236 - dn]], 'none');
    cut(def.comb, [[-0.007, fh[1] + 0.024], [-0.011, fh[1] + 0.044], [-0.006, fh[1] + 0.06], [0, fh[1] + 0.048], [0.006, fh[1] + 0.062], [0.011, fh[1] + 0.045], [0.007, fh[1] + 0.024]], 'small');
    cut(def.hackle, ellUV(fh, 0.034, 0.034, 0, 20));
    cut(tone(def.hackle, 0.12), ellUV([0, fh[1] + 0.008], 0.022, 0.018), 'none');
    for (const s of [-1, 1]) cut(def.comb, ellUV([s * 0.008, fh[1] - 0.034], 0.008, 0.013, s * 0.2, 12), 'small');
    cut(def.beak, [[-0.01, fh[1] + 0.0], [0.01, fh[1] + 0.0], [0.004, fh[1] - 0.022], [-0.004, fh[1] - 0.022]], 'small');
    cut(tone(def.beak, -0.18), [[0, fh[1] - 0.002], [0.009, fh[1] - 0.001], [0.003, fh[1] - 0.021], [0, fh[1] - 0.021]], 'none');
    for (const s of [-1, 1]) eyeAt([s * 0.019, fh[1] + 0.009], 0.0062);
    if (anchors) { anchors.beak = Q([[0, fh[1] - 0.022]])[0]; anchors.head = Q([fh])[0]; }
  }
};
