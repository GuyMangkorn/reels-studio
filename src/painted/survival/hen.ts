import {hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor} from '../kit/painter';
import {bez, cardAt, cell, cp, cps, lit, strip, type Card, type Light, type Painter, type Pt, type V3, type YCam} from './core';

// Hen K01 (`new: Thai backyard hen`, gai ban; N16-03, look-defining, Film W3): red-brown body, darker wing, black sickle tail with a green sheen,
// small single red comb and wattles, slate-yellow scaly legs with three forward toes and one back toe. 0.42 m to the comb.
// Views: 'right'/'left' (side), 'front', 'back'. `tilt` = head tilt in degrees (the dinosaur look), `peck` 0..1, `lift` = near foot lifted 0..1.

export const HC = {body: '#9a4a26', bodyLight: '#c0703a', wing: '#6e3218', neck: '#b8692e', tail: '#1e2420', sheen: '#2f5a4a', comb: '#d23a2a',
  beak: '#e2b04a', leg: '#c2ac5c', legDark: '#7d6a32', eye: '#e08a1a', ink: '#2a1a12'} as const;

/** `lift` / `liftFar` = near / far foot lifted 0..1 (a trot lifts them in turn); `cluck` 0..1 opens the beak (side and front view) and raises the head; `thrust` pushes the head forward (m). All default 0 = the approved still. */
export type HenPose = {view: 'right' | 'left' | 'front' | 'back'; tilt?: number; peck?: number; lift?: number; fluff?: number; liftFar?: number; cluck?: number; thrust?: number;
  /** N16-03 R2: slot (0 = left of the picture in front/back view, near leg in side view; 1 = the other) whose leg is drawn by `paintHenFootCU` instead. The hen then draws that leg NOT at all, so every view shows exactly two legs (the draft showed the foot close-up as a third leg). */
  cu?: 0 | 1};

const head = (p: Painter, k: Card, L: Light, seed: number, at: [number, number], tilt: number, front: boolean, open = 0) => {
  const a = (tilt * Math.PI) / 180, R = (x: number, y: number): [number, number] => [at[0] + x * Math.cos(a) - y * Math.sin(a), at[1] + x * Math.sin(a) + y * Math.cos(a)];
  const P = (pts: [number, number][]) => cps(k, pts.map(([x, y]) => R(x, y)));
  if (!front) {
    // comb: five small points on top; wattle under the beak
    hardFill(p, seed, lit(L, HC.comb), P([[-0.03, 0.025], [-0.025, 0.05], [-0.012, 0.035], [0, 0.058], [0.012, 0.037], [0.024, 0.055], [0.032, 0.03], [0.03, 0.02]]));
    hardFill(p, seed + 1, lit(L, HC.comb), P([[0.022, -0.02], [0.034, -0.03], [0.03, -0.055], [0.018, -0.05], [0.014, -0.025]]));
    hardFill(p, seed + 2, lit(L, HC.neck), P(Array.from({length: 14}, (_, i) => { const t = (i / 14) * 6.283; return [0.032 * Math.cos(t), 0.03 * Math.sin(t)] as [number, number]; })));
    if (open > 0) {
      // beak open (cluck): a dark mouth between the upper and lower halves
      hardFill(p, seed + 3, lit(L, HC.ink), P([[0.026, 0.012], [0.06, 0.0 + 0.012 * open], [0.056, -0.014 - 0.012 * open], [0.026, -0.012]]));
      hardFill(p, seed + 4, lit(L, HC.beak), P([[0.026, 0.012], [0.062, -0.002 + 0.012 * open], [0.026, 0.0]]));
      hardFill(p, seed + 4, lit(L, HC.beak), P([[0.026, 0.0], [0.056, -0.014 - 0.012 * open], [0.026, -0.012]]));
    } else {
      hardFill(p, seed + 3, lit(L, HC.beak), P([[0.026, 0.012], [0.062, -0.004], [0.026, -0.012]]));
      inkLine(p, seed + 4, P([[0.028, 0.0], [0.058, -0.003]]), {closed: false, weight: 0.4, color: lit(L, HC.ink), still: true});
    }
    hardFill(p, seed + 5, lit(L, HC.eye), P(Array.from({length: 10}, (_, i) => { const t = (i / 10) * 6.283; return [0.01 + 0.009 * Math.cos(t), 0.008 + 0.009 * Math.sin(t)] as [number, number]; })));
    hardFill(p, seed + 6, '#140c08', P(Array.from({length: 8}, (_, i) => { const t = (i / 8) * 6.283; return [0.011 + 0.004 * Math.cos(t), 0.008 + 0.004 * Math.sin(t)] as [number, number]; })));
    hardFill(p, seed + 7, '#ffffff', P([[0.009, 0.012], [0.012, 0.012], [0.012, 0.015], [0.009, 0.015]]));
    inkLine(p, seed + 8, P(Array.from({length: 14}, (_, i) => { const t = (i / 14) * 6.283; return [0.032 * Math.cos(t), 0.03 * Math.sin(t)] as [number, number]; })), {weight: 0.5, color: lit(L, HC.ink), still: true});
    return;
  }
  // front: round head, comb up the middle, beak pointing at the lens, both eyes at the sides
  hardFill(p, seed, lit(L, HC.comb), P([[-0.008, 0.026], [-0.006, 0.058], [0.006, 0.058], [0.008, 0.026]]));
  hardFill(p, seed + 2, lit(L, HC.neck), P(Array.from({length: 14}, (_, i) => { const t = (i / 14) * 6.283; return [0.03 * Math.cos(t), 0.031 * Math.sin(t)] as [number, number]; })));
  for (const sx of [-1, 1]) {
    hardFill(p, seed + 3 + (sx > 0 ? 1 : 0), lit(L, HC.comb), P([[sx * 0.004, -0.012], [sx * 0.016, -0.02], [sx * 0.012, -0.048], [sx * 0.004, -0.04]]));
    hardFill(p, seed + 5 + (sx > 0 ? 1 : 0), lit(L, HC.eye), P(Array.from({length: 8}, (_, i) => { const t = (i / 8) * 6.283; return [sx * 0.02 + 0.007 * Math.cos(t), 0.008 + 0.007 * Math.sin(t)] as [number, number]; })));
    hardFill(p, seed + 7 + (sx > 0 ? 1 : 0), '#140c08', P(Array.from({length: 6}, (_, i) => { const t = (i / 6) * 6.283; return [sx * 0.021 + 0.0035 * Math.cos(t), 0.008 + 0.0035 * Math.sin(t)] as [number, number]; })));
  }
  hardFill(p, seed + 9, lit(L, HC.beak), P([[-0.008, 0.004], [0.008, 0.004], [0, -0.016 - 0.01 * open]]));
  if (open > 0) hardFill(p, seed + 10, lit(L, HC.ink), P([[-0.005, 0.0], [0.005, 0.0], [0, -0.008 - 0.01 * open]]));
};

const legs = (p: Painter, k: Card, L: Light, seed: number, xs: number[], lift: number, side: boolean, liftFar = 0, cu?: 0 | 1) => {
  xs.forEach((x, i) => {
    if (cu === i) return;   // this leg is the foot close-up
    const up = i === 0 ? lift * 0.06 : liftFar * 0.06, fx = side ? x + 0.01 : x;
    const hip: [number, number] = [x, 0.13], ankle: [number, number] = [fx + (side ? 0.005 : 0), 0.025 + up];
    hardFill(p, seed + i * 10, lit(L, HC.leg), strip([cp(k, hip[0], hip[1]), cp(k, (hip[0] + ankle[0]) / 2, (hip[1] + ankle[1]) / 2), cp(k, ankle[0], ankle[1])], [0.012 * k.u, 0.01 * k.u, 0.009 * k.u]));
    // scales: short ticks down the shank
    for (let j = 0; j < 4; j++) { const y = 0.04 + up + j * 0.018; inkLine(p, seed + i * 10 + 1 + j, cps(k, [[fx - 0.008, y], [fx + 0.008, y + 0.004]]), {closed: false, weight: 0.3, color: lit(L, HC.legDark), still: true}); }
    // toes: three forward and one back; side view fans them in depth
    const toes: [number, number][] = side ? [[0.06, -0.005], [0.045, 0.004], [0.035, -0.012], [-0.03, 0.0]] : [[-0.035, -0.012], [0, -0.016], [0.035, -0.012], [0, 0.01]];
    toes.forEach(([dx, dy], j) => hardFill(p, seed + i * 10 + 6 + j, lit(L, j === 3 ? HC.legDark : HC.leg), strip([cp(k, ankle[0], ankle[1]), cp(k, fx + dx, Math.max(0.002, ankle[1] - 0.024 + dy * (side ? 0.2 : 0.4)))], [0.006 * k.u, 0.003 * k.u])));
  });
};

/** One hen at a world ground point, squared to the lens. */
export const paintHen = (p: Painter, c: YCam, at: V3, pose: HenPose, L: Light, seed = 16000, o: {shadow?: boolean} = {}) => {
  const side = pose.view === 'right' || pose.view === 'left';
  const k = cardAt(c, at, pose.view === 'left' ? -1 : 1);
  if (!k) return null;
  return paintHenCard(p, k, pose, L, seed, {...o, side});
};

/** Same hen on an explicit card (sheets and close-ups). */
export const paintHenCard = (p: Painter, k: Card, pose: HenPose, L: Light, seed: number, o: {shadow?: boolean; side?: boolean} = {}) => {
  const side = o.side ?? (pose.view === 'right' || pose.view === 'left');
  const fl = 1 + (pose.fluff ?? 0) * 0.12, pk = pose.peck ?? 0;
  if (o.shadow !== false) washAt(p, seed + 900, '#2a2018', 70, cell(k, 0, 0.004, side ? 0.16 : 0.12, 0.02, 14), 0.3, 0.2);
  if (side) {
    // tail first (behind the body): sickle feathers up and back
    const tail = [[-0.1, 0.21], [-0.17, 0.31], [-0.165, 0.345], [-0.13, 0.33], [-0.115, 0.35], [-0.08, 0.3], [-0.05, 0.26]] as [number, number][];
    hardFill(p, seed, lit(L, HC.tail), cps(k, tail));
    hardFill(p, seed + 1, lit(L, HC.sheen), cps(k, [[-0.12, 0.26], [-0.155, 0.32], [-0.115, 0.29]]));
    legs(p, k, L, seed + 100, [0.02, -0.02], pose.lift ?? 0, true, pose.liftFar ?? 0, pose.cu);
    // body: egg shape, breast low at the front, back rising to the tail
    const body = Array.from({length: 22}, (_, i) => { const t = (i / 22) * 6.283; return [0.015 + 0.15 * fl * Math.cos(t), 0.205 + 0.1 * fl * Math.sin(t) - 0.03 * Math.cos(t)] as [number, number]; });
    hardFill(p, seed + 2, lit(L, HC.body), cps(k, body));
    hardFill(p, seed + 3, lit(L, HC.bodyLight), cps(k, [[0.06, 0.26], [0.15, 0.22], [0.14, 0.16], [0.08, 0.13], [0.04, 0.2]]));
    // wing: darker teardrop with feather ticks
    const wing = [[0.07, 0.24], [0.02, 0.27], [-0.07, 0.25], [-0.12, 0.2], [-0.06, 0.16], [0.04, 0.17]] as [number, number][];
    hardFill(p, seed + 4, lit(L, HC.wing), cps(k, wing));
    for (let i = 0; i < 4; i++) inkLine(p, seed + 5 + i, cps(k, [[-0.1 + i * 0.035, 0.18], [-0.08 + i * 0.035, 0.215]]), {closed: false, weight: 0.35, color: lit(L, HC.ink), still: true});
    inkLine(p, seed + 10, cps(k, body), {weight: 0.55, color: lit(L, HC.ink), still: true});
    // neck: hackle feathers golden, from the breast to the head; peck lowers the head forward
    const ck = pose.cluck ?? 0, hx = 0.13 + 0.06 * pk + (pose.thrust ?? 0), hy = 0.37 - 0.25 * pk + 0.03 * ck;
    hardFill(p, seed + 11, lit(L, HC.neck), strip(bez(cp(k, 0.08, 0.24), cp(k, 0.13, 0.31 - 0.1 * pk), cp(k, hx, hy), 8), [0.05, 0.045, 0.04, 0.036, 0.032, 0.03, 0.028, 0.026, 0.025].map((w) => w * k.u)));
    head(p, k, L, seed + 20, [hx, hy], -(pose.tilt ?? 0) * k.s, false, ck);
  } else {
    const back = pose.view === 'back';
    // tail fan behind (front view: peeks above the back; back view: in front)
    const tail = cps(k, [[-0.035, 0.24], [-0.05, 0.33], [-0.02, 0.355], [0.02, 0.355], [0.05, 0.33], [0.035, 0.24]]);
    if (!back) { hardFill(p, seed, lit(L, HC.tail), cps(k, [[-0.07, 0.25], [-0.1, 0.33], [-0.06, 0.3]])); hardFill(p, seed + 1, lit(L, HC.tail), cps(k, [[0.07, 0.25], [0.1, 0.33], [0.06, 0.3]])); }
    legs(p, k, L, seed + 100, [-0.035, 0.035], pose.lift ?? 0, false, pose.liftFar ?? 0, pose.cu);
    const body = Array.from({length: 22}, (_, i) => { const t = (i / 22) * 6.283; return [0.1 * fl * Math.cos(t), 0.21 + 0.11 * fl * Math.sin(t)] as [number, number]; });
    hardFill(p, seed + 2, lit(L, HC.body), cps(k, body));
    if (!back) hardFill(p, seed + 3, lit(L, HC.bodyLight), cell(k, 0, 0.2, 0.06, 0.07, 14));
    for (const sx of [-1, 1]) hardFill(p, seed + 4 + (sx > 0 ? 1 : 0), lit(L, HC.wing), cps(k, [[sx * 0.1, 0.24], [sx * 0.07, 0.15], [sx * 0.085, 0.13], [sx * 0.105, 0.2]]));
    inkLine(p, seed + 10, cps(k, body), {weight: 0.55, color: lit(L, HC.ink), still: true});
    if (back) {
      hardFill(p, seed, lit(L, HC.tail), tail);
      hardFill(p, seed + 1, lit(L, HC.sheen), cps(k, [[-0.012, 0.27], [0, 0.34], [0.012, 0.27]]));
      hardFill(p, seed + 11, lit(L, HC.neck), cell(k, 0, 0.36, 0.034, 0.04, 14));
      hardFill(p, seed + 12, lit(L, HC.comb), cps(k, [[-0.008, 0.395], [-0.006, 0.428], [0.006, 0.428], [0.008, 0.395]]));
      inkLine(p, seed + 13, cps(k, [[-0.025, 0.36], [0, 0.4], [0.025, 0.36]]), {closed: false, weight: 0.45, color: lit(L, HC.ink), still: true, curve: 0.5});
    } else {
      hardFill(p, seed + 11, lit(L, HC.neck), cps(k, [[-0.065, 0.27], [-0.03, 0.35], [0.03, 0.35], [0.065, 0.27], [0, 0.22]]));
      head(p, k, L, seed + 20, [0, 0.37 - 0.2 * pk + 0.03 * (pose.cluck ?? 0)], pose.tilt ?? 0, true, pose.cluck ?? 0);
    }
  }
  return k;
};

/** Close-up of the three-toed scaly foot planted on dirt (shot 20 proof); `k` is a card whose u makes the foot large. */
export const paintHenFootCU = (p: Painter, k: Card, L: Light, seed = 16800) => {
  washAt(p, seed + 60, '#2a2018', 70, cell(k, 0, 0.002, 0.075, 0.012, 14), 0.3, 0.2);
  const ankle: Pt = cp(k, 0, 0.03);
  // shank with scutes (overlapping scales) and a feathered top
  hardFill(p, seed, lit(L, HC.leg), strip([cp(k, -0.004, 0.14), cp(k, 0, 0.085), ankle], [0.0065 * k.u, 0.006 * k.u, 0.0075 * k.u]));
  for (let j = 0; j < 9; j++) { const y = 0.035 + j * 0.011; inkLine(p, seed + 1 + j, cps(k, [[-0.006, y + 0.002], [0, y - 0.0015], [0.006, y + 0.002]]), {closed: false, weight: 0.45, color: lit(L, HC.legDark), still: true, curve: 0.4}); }
  // toes: three forward (left, middle toward the lens, right) and the back toe; each with knuckle pads and a dark claw
  const toe = (tip: [number, number], id: number, w0: number) => {
    const mid: [number, number] = [tip[0] * 0.5, 0.012 + tip[1] * 0.5];
    const line = [ankle, cp(k, mid[0], mid[1]), cp(k, tip[0], tip[1])];
    hardFill(p, id, lit(L, HC.leg), strip(line, [w0 * k.u, w0 * 0.8 * k.u, w0 * 0.55 * k.u]));
    for (let j = 1; j <= 3; j++) { const u = j / 4, q = cp(k, tip[0] * u, 0.03 * (1 - u) + tip[1] * u); hardFill(p, id + j, lit(L, HC.legDark, 0.05), cell({g: q, u: k.u, s: 1}, 0, 0, w0 * 0.55, w0 * 0.35, 8)); }
    const a = Math.atan2(-(tip[1] - mid[1]), tip[0] - mid[0]);
    const cl = cp(k, tip[0], tip[1]);
    hardFill(p, id + 6, lit(L, '#3a3020'), [[cl[0] - Math.sin(a) * 0.004 * k.u, cl[1] - Math.cos(a) * 0.004 * k.u], [cl[0] + Math.cos(a) * 0.014 * k.u, cl[1] + Math.sin(a) * 0.014 * k.u + 0.003 * k.u], [cl[0] + Math.sin(a) * 0.004 * k.u, cl[1] + Math.cos(a) * 0.004 * k.u]]);
    inkLine(p, id + 7, strip(line, [w0 * k.u, w0 * 0.8 * k.u, w0 * 0.55 * k.u]), {weight: 0.5, color: lit(L, HC.legDark), still: true});
  };
  toe([-0.02, 0.014], seed + 50, 0.004);
  toe([-0.05, 0.0], seed + 30, 0.005);
  toe([0.052, 0.0], seed + 40, 0.005);
  toe([0.01, -0.01], seed + 20, 0.0055);
  void mixColor;
};

// ---- Motions (N16-03): looped pose tracks for `paintHen`. `t` seconds; each returns the pose fields and `dx` metres walked along the hen's facing (scenes place the path).
export const HEN_MOTION_IDS = ['idle', 'peck', 'trot', 'head-tilt', 'huddle', 'cluck'] as const;
export type HenMotionId = (typeof HEN_MOTION_IDS)[number];
const ph = (t: number, period: number, off = 0) => (((t / period + off) % 1) + 1) % 1;
const tri = (x: number) => 1 - Math.abs(2 * x - 1);                 // 0..1..0
const snap = (x: number) => Math.min(1, Math.max(0, x)) ** 2 * (3 - 2 * Math.min(1, Math.max(0, x)));
export const HEN_MOTIONS: Record<HenMotionId, (t: number, seedOff?: number) => {pose: Omit<HenPose, 'view'>; dx: number}> = {
  idle: (t, o = 0) => ({pose: {tilt: 3 * Math.sin(t * 1.3 + o)}, dx: 0}),
  /** Two quick pecks then a look up, every 1.4 s (dig-and-look of a yard hen). */
  peck: (t, o = 0) => { const q = ph(t, 1.4, o); const k = q < 0.5 ? snap(tri((q / 0.5) * 2 % 1) * 1.4) : 0; return {pose: {peck: Math.min(1, k), tilt: q > 0.55 && q < 0.8 ? 14 : 0}, dx: 0}; },
  /** Quick walk at 0.9 m/s: feet lift in turn (period 0.5 s per step pair), the head thrusts forward on each step. */
  trot: (t, o = 0) => { const q = ph(t, 0.5, o); return {pose: {lift: Math.max(0, Math.sin(q * 6.283)), liftFar: Math.max(0, -Math.sin(q * 6.283)), thrust: 0.025 * Math.sin(q * 6.283 + 1)}, dx: 0.9 * t}; },
  /** Head tilts one way, holds, snaps to the other (the dinosaur look), 2.4 s loop; tilt in degrees. */
  'head-tilt': (t, o = 0) => { const q = ph(t, 2.4, o); const a = q < 0.15 ? snap(q / 0.15) : q < 0.5 ? 1 : q < 0.58 ? 1 - 2 * snap((q - 0.5) / 0.08) : q < 0.9 ? -1 : -1 + snap((q - 0.9) / 0.1); return {pose: {tilt: 22 * a}, dx: 0}; },
  /** Fluffed and still, a slow breath: use three hens close together under a roof. */
  huddle: (t, o = 0) => ({pose: {fluff: 0.8 + 0.12 * Math.sin(t * 1.6 + o), tilt: 4 * Math.sin(t * 0.9 + o)}, dx: 0}),
  /** Neck up, beak opens in bursts of three (0.18 s each) then rests; 1.6 s loop. */
  cluck: (t, o = 0) => { const q = ph(t, 1.6, o) * 1.6, b = q < 0.54 ? (Math.floor(q / 0.18) % 2 === 0 ? 1 : 0) : 0; return {pose: {cluck: b, thrust: 0.01 * b}, dx: 0}; },
};
/** One hen playing motion `id` at second `t` from its start point: the hen is placed `dx` metres along its facing (+x for 'right', -x for 'left'); `o` shifts the phase so a flock does not move in step. */
export const paintHenMotion = (p: Painter, c: YCam, at: V3, view: HenPose['view'], id: HenMotionId, t: number, L: Light, seed = 16000, o: {phase?: number; shadow?: boolean} = {}) => {
  const m = HEN_MOTIONS[id](t, o.phase ?? 0), dir = view === 'left' ? -1 : view === 'right' ? 1 : 0;
  return paintHen(p, c, [at[0] + dir * m.dx, at[1], at[2]], {view, ...m.pose}, L, seed, {shadow: o.shadow});
};

/** A hen stepping toward the lens with its foot close-up (shot 20): the hen's own leg in slot `cu` is left out and `paintHenFootCU` draws that foot at `lift` m above the ground, so exactly two legs show.
 * `at` is the hen's ground point; the foot is planted `dx`, `dz` m from it (default under the right leg). Returns the foot card, or null off-lens. */
export const paintHenStep = (p: Painter, c: YCam, at: V3, pose: Omit<HenPose, 'cu'>, L: Light, o: {seed?: number; /** leg slot the close-up replaces; `null` keeps both hen legs (the draft's three-leg bug, for the negative control) */ cu?: 0 | 1 | null; lift?: number; dx?: number; dz?: number; footSeed?: number} = {}) => {
  const cu = o.cu === undefined ? 1 : o.cu;
  paintHen(p, c, at, {...pose, cu: cu ?? undefined}, L, o.seed ?? 16000);
  const foot: V3 = [at[0] + (o.dx ?? 0.035), at[1], at[2] + (o.dz ?? 0)], k = cardAt(c, foot, 1);
  if (!k) return null;
  const fk = {g: [k.g[0], k.g[1] - (o.lift ?? 0) * k.u] as Pt, u: k.u, s: 1};
  paintHenFootCU(p, fk, L, o.footSeed ?? 16800);
  return fk;
};
