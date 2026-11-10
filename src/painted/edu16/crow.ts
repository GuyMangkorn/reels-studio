import {capsule, ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {C} from './palette';

// `new: crow` (brief VD04, N1; Film writes the look at W3, Boss hardens at W5.2). American crow card on the flea/tokay method: a world-space card
// anchored at its feet (wire, branch, grass, hands), squared to the lens, sized in metres from the camera (adult 0.45 m bill to tail, perched
// height 0.33 m; young 0.38 m). Views: `right`/`left` profile, `front`, `back` (over the shoulder), `below` (flying overhead). The head can take its
// own view (`head`), the cut-on-turn of VD04 (`back` body with a profile head in shot 1; `left` body with a `front` head for the stare).
// Local units are body lengths (L px); x toward the facing side, y down, origin at the feet. Black reads by a violet sheen on the sky side and a
// warm rim on the sun side (UT03). The orange ring is always on the LEFT leg (K01); a picture minimum of 6 px tall keeps it readable.

export type CrowVariant = 'adult' | 'adult-ringed' | 'young' | 'young-ringless';
export type CrowView = 'right' | 'left' | 'front' | 'back' | 'below';
export type CrowHead = 'profile-right' | 'profile-left' | 'front' | 'back';
export type CrowState = {
  /** Beak open 0..1 (scold, caw, beg). */
  beak?: number;
  /** Body pitch, degrees: + = the head goes down toward the facing side (scold lean), - = upright. */
  lean?: number;
  /** Tail flare 0..1 (scold) and tail angle, degrees (+ = up). */
  flare?: number; tailUp?: number;
  /** Wings: 0 folded; >0 open (fly/glide/land), `wingUp` -1..1 the stroke position. */
  wings?: number; wingUp?: number;
  /** Throat puff 0..1 (caw). */
  puff?: number;
  /** Legs tucked (held, flying). */
  tuck?: boolean;
  /** Head turned toward the lens in profile (the eye glint), -1..1 head tilt down (glance). */
  headTilt?: number;
};
export type CrowOpts = {
  variant: CrowVariant; view: CrowView; head?: CrowHead; state?: CrowState; seed: number;
  /** Sun side in the picture: -1 screen left, +1 screen right, 0 none (dusk: sky behind, rim from both sides). */
  sun?: -1 | 0 | 1;
  rim?: string;
  /** Size factor (1 = true size). */
  scale?: number;
  /** Shadow / haze toward a colour (far crows against a bright sky). */
  haze?: {to: string; u: number};
  t?: number;
  /** 'body': the world point is the body centre (flying crows); default 'feet' (perched). */
  anchor?: 'feet' | 'body';
};
export type CrowMeasure = {lengthPx: number; pxPerM: number; box: [number, number, number, number]; /** Head length px: skull + bill in a profile head, skull width otherwise. */ headPx: number; ringPx: number; feet: Pt; head: Pt};

const isYoung = (v: CrowVariant) => v === 'young' || v === 'young-ringless';
const ringed = (v: CrowVariant) => v === 'adult-ringed';
const mix = (a: string, b: string, u: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const A = h(a), B = h(b);
  return `#${A.map((x, i) => Math.round(x + (B[i] - x) * u).toString(16).padStart(2, '0')).join('')}`;
};

type Ctx = {p: Painter; seed: number; o: CrowOpts; L: number; foot: Pt; dir: 1 | -1; pal: Pal; n: number; ringPx?: number};
type Pal = {body: string; shade: string; sheen: string; rim: string; bill: string; billHi: string; eye: string; ring: string; ringHi: string; mouth: string; fluff: string};
const palette = (o: CrowOpts): Pal => {
  const y = isYoung(o.variant), hz = (c: string) => (o.haze ? mix(c, o.haze.to, o.haze.u) : c);
  return {
    body: hz(y ? C.young : C.crow), shade: hz(C.crowShade), sheen: hz(C.sheen), rim: hz(o.rim ?? C.rim), bill: hz(C.bill), billHi: hz(C.billHi),
    eye: y ? C.youngEye : C.eye, ring: hz(C.ring), ringHi: hz(C.ringHi), mouth: y ? C.gape : C.mouth, fluff: hz(C.fluff),
  };
};

/** Local (x toward facing, y down) -> picture, after the body lean about the feet. */
const P = (k: Ctx, lean: number) => ([x, y]: number[]): Pt => {
  const a = (lean * Math.PI) / 180, co = Math.cos(a), si = Math.sin(a);
  const X = x * co - y * si, Y = x * si + y * co;
  return [k.foot[0] + k.dir * X * k.L, k.foot[1] + Y * k.L];
};
const fill = (k: Ctx, color: string, pts: Pt[]) => hardFill(k.p, k.seed * 50 + ++k.n, color, pts);
const wash = (k: Ctx, color: string, op: number, pts: Pt[]) => washAt(k.p, k.seed * 50 + ++k.n, color, op, pts, 0.12, 0.2);
const line = (k: Ctx, pts: Pt[], w = 0.8, color: string = C.ink, closed = false) => inkLine(k.p, k.seed * 50 + ++k.n, pts, {weight: w, color, closed, still: true, curve: 0.4});
const ellL = (cx: number, cy: number, rx: number, ry: number, a = 0, n = 20): Pt[] => ell(cx, cy, rx, ry, n, a);
/** Silhouette rim: the shape in the rim colour shifted toward the sun, then (by the caller) the shape itself on top. */
const rimOf = (k: Ctx, pts: Pt[], amt = 0.009) => {
  const s = k.o.sun ?? -1;
  if (s === 0) {
    for (const d of [-1, 1]) fill(k, k.pal.rim, pts.map(([x, y]) => [x + d * amt * 0.7 * k.L, y - amt * 0.4 * k.L] as Pt));
    return;
  }
  fill(k, k.pal.rim, pts.map(([x, y]) => [x + s * amt * k.L, y - amt * 0.5 * k.L] as Pt));
};

// ---- head (center hc in local units, r radius) in any head view
const paintHead = (k: Ctx, q: (v: number[]) => Pt, hc: Pt, r0: number, hv: CrowHead, st: CrowState) => {
  const young = isYoung(k.o.variant), beak = Math.max(0, Math.min(1, st.beak ?? 0));
  const r = young ? r0 * 0.8 : r0; // R2.1 (F11): the young's head about 0.8x the adult's
  /** The young's loose grey-black tufts (3-5 spikes) on the crown and nape, pointing up/back; `map` takes head-local units. */
  const tufts = (map: (v: number[]) => Pt, side: -1 | 1, profile: boolean) => {
    if (!young) return;
    const sp: [number, number, number, number][] = profile ? [[-0.7, -0.9, -1.0, -1.55], [-0.25, -1.0, -0.45, -1.62], [0.15, -0.95, 0.05, -1.5], [-1.0, -0.4, -1.65, -0.75], [-0.95, 0.0, -1.55, 0.1]] : [[-0.5, -0.95, -0.7, -1.5], [-0.1, -1.05, -0.05, -1.65], [0.35, -0.95, 0.55, -1.5], [0.75, -0.7, 1.25, -1.05]];
    sp.forEach(([x, y, tx, ty]) => { void side; fill(k, k.pal.body, [[x - 0.14, y + 0.12], [x + 0.14, y + 0.12], [tx, ty]].map(map)); });
  };
  const tilt = (st.headTilt ?? 0) * 0.35;
  if (hv === 'profile-right' || hv === 'profile-left') {
    // profile in the card's facing unless the head looks the other way (mirror about the head centre)
    const hs: 1 | -1 = (hv === 'profile-right' ? 1 : -1) * k.dir as 1 | -1;
    const H = ([x, y]: number[]): Pt => {
      const a = tilt, co = Math.cos(a), si = Math.sin(a), X = x * co - y * si, Y = x * si + y * co;
      return q([hc[0] + hs * X * r, hc[1] + Y * r]);
    };
    // skull: rounded, flatter crown, slight forehead rise to the bill (American crow)
    const skull: Pt[] = Array.from({length: 22}, (_, i) => {
      const a = (i / 22) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      return [c * (1 + 0.08 * Math.max(0, c)), s * (s < 0 ? 0.92 : 1.0) + (young ? 0.06 * Math.sin(a * 5) * Math.max(0, -s) : 0)];
    });
    const throat: Pt[] = [[0.6, 0.55], [0.1, 1.25 + 0.35 * (st.puff ?? 0)], [-0.55, 1.1], [-0.2, 0.5]];
    tufts(H, hs, true);
    rimOf(k, skull.map(H));
    fill(k, k.pal.body, skull.map(H));
    fill(k, k.pal.body, throat.map(H));
    wash(k, k.pal.sheen, 120, ellL(-0.15, -0.45, 0.6, 0.35).map(H));
    // bill: heavy, straight, culmen curving down at the tip; lower mandible drops with `beak`
    const open = beak * 0.55;
    const up: Pt[] = [[0.78, -0.42], [1.3, -0.38], [1.95, -0.12], [2.08, 0.04], [1.6, 0.0], [0.86, 0.06]];
    const loA = open, rot = ([x, y]: number[]): Pt => {
      const ox = 0.86, oy = 0.08, dx = x - ox, dy = y - oy;
      return [ox + dx * Math.cos(loA) - dy * Math.sin(loA), oy + dx * Math.sin(loA) + dy * Math.cos(loA)];
    };
    const lo: Pt[] = [[0.86, 0.06], [1.6, 0.04], [1.9, 0.1], [1.5, 0.22], [0.9, 0.3]].map(rot);
    if (beak > 0.05) fill(k, k.pal.mouth, [[0.86, 0.02], [1.75, 0.02], ...lo.slice(1, 3).reverse(), [0.86, 0.3]].map(H));
    if (young) fill(k, C.gape, [[0.7, -0.05], [0.98, 0.0], [0.98, 0.22], [0.72, 0.24]].map(H)); // red-pink gape at the bill corner (fledgling)
    fill(k, k.pal.bill, up.map(H));
    fill(k, k.pal.bill, lo.map(H));
    wash(k, k.pal.billHi, 150, [[0.95, -0.36], [1.55, -0.3], [1.5, -0.24], [0.95, -0.28]].map(H));
    // nasal bristles at the base (a crow, not a raven: short, neat)
    fill(k, k.pal.shade, [[0.62, -0.5], [1.05, -0.4], [0.98, -0.18], [0.66, -0.22]].map(H));
    // eye with a white glint
    const e = H([0.42, -0.18]);
    hardFill(k.p, k.seed * 50 + ++k.n, k.pal.eye, ell(e[0], e[1], 0.17 * r * k.L, 0.17 * r * k.L, 12));
    hardFill(k.p, k.seed * 50 + ++k.n, '#0c0c10', ell(e[0], e[1], 0.09 * r * k.L, 0.09 * r * k.L, 10));
    hardFill(k.p, k.seed * 50 + ++k.n, '#ffffff', ell(e[0] - hs * 0.05 * r * k.L, e[1] - 0.06 * r * k.L, 0.045 * r * k.L, 0.045 * r * k.L, 8));
    line(k, skull.map(H), 0.7, k.pal.shade, true);
    return;
  }
  const Hf = ([x, y]: number[]): Pt => q([hc[0] + x * r, hc[1] + y * r]);
  const skull: Pt[] = Array.from({length: 22}, (_, i) => {
    const a = (i / 22) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    return [c * 0.95, s * (s < 0 ? 0.92 : 1.05) + (young ? 0.07 * Math.sin(a * 6) * Math.max(0, -s) : 0)];
  });
  tufts(Hf, 1, false);
  rimOf(k, skull.map(Hf));
  fill(k, k.pal.body, skull.map(Hf));
  if (hv === 'back') { wash(k, k.pal.sheen, 140, ellL(0.0, -0.3, 0.6, 0.45).map(Hf)); line(k, skull.map(Hf), 0.7, k.pal.shade, true); return; }
  wash(k, k.pal.sheen, 110, ellL(0, -0.5, 0.55, 0.3).map(Hf));
  // front: the heavy bill points at the lens and a little down (a long foreshortened wedge with a ridge), eyes set wide on the sides of the
  // skull (a crow, not an owl: small, half hidden by the head's curve), the young's pink gape only as a thin line at the bill corners
  const open = Math.max(0, Math.min(1, beak));
  fill(k, k.pal.shade, ell(0, 0.55, 0.62, 0.45, 16).map(Hf)); // throat / chin feathers under the bill
  if (open > 0.05) fill(k, k.pal.mouth, [[-0.28, 0.3], [0.28, 0.3], [0.16, 0.4 + 0.9 * open], [-0.16, 0.4 + 0.9 * open]].map(Hf));
  fill(k, k.pal.bill, [[-0.36, -0.05], [0.36, -0.05], [0.3, 0.22], [0.12, 0.85 - 0.3 * open], [0.0, 1.02 - 0.35 * open], [-0.12, 0.85 - 0.3 * open], [-0.3, 0.22]].map(Hf));
  if (open > 0.05) fill(k, k.pal.bill, [[-0.24, 0.42 + 0.7 * open], [0.24, 0.42 + 0.7 * open], [0.0, 0.85 + 0.8 * open]].map(Hf));
  wash(k, k.pal.billHi, 190, [[-0.07, 0.0], [0.05, 0.0], [0.02, 0.8], [-0.02, 0.8]].map(Hf));
  fill(k, k.pal.shade, [[-0.3, -0.16], [0.3, -0.16], [0.26, 0.04], [-0.26, 0.04]].map(Hf)); // nasal bristles
  if (young) for (const sd of [-1, 1]) fill(k, mix(C.gape, '#2e2c2e', 0.25), [[sd * 0.3, 0.12], [sd * 0.37, 0.1], [sd * 0.34, 0.2], [sd * 0.28, 0.2]].map(Hf));
  for (const sd of [-1, 1]) {
    const e = Hf([sd * 0.6, -0.22]), er = 0.13 * r * k.L;
    hardFill(k.p, k.seed * 50 + ++k.n, k.pal.eye, ell(e[0], e[1], er * 0.8, er, 12));
    hardFill(k.p, k.seed * 50 + ++k.n, '#0c0c10', ell(e[0] + sd * er * 0.1, e[1], er * 0.45, er * 0.55, 10));
    hardFill(k.p, k.seed * 50 + ++k.n, '#ffffff', ell(e[0] - er * 0.25, e[1] - er * 0.35, er * 0.25, er * 0.25, 8));
  }
  line(k, skull.map(Hf), 0.7, k.pal.shade, true);
};

// ---- legs and the ring
const leg = (k: Ctx, q: (v: number[]) => Pt, top: Pt, foot: Pt, withRing: boolean, toes: 'grip' | 'stand' | 'tuck') => {
  const w = 0.018 * k.L;
  const a = q(top), b = q(foot);
  hardFill(k.p, k.seed * 50 + ++k.n, k.pal.bill, capsule(a, b, w * 1.3, w, 4));
  if (toes !== 'tuck') {
    const f = foot, toe = (dx: number, dy: number) => q([f[0] + dx, f[1] + dy]);
    const toeLines: Pt[][] = toes === 'grip'
      ? [[q(f), toe(0.05, 0.01), toe(0.07, 0.03)], [q(f), toe(-0.04, 0.01), toe(-0.055, 0.03)]]
      : [[q(f), toe(0.07, 0.0)], [q(f), toe(-0.05, 0.0)], [q(f), toe(0.045, 0.012)]];
    for (const tl of toeLines) inkLine(k.p, k.seed * 50 + ++k.n, tl, {weight: Math.max(0.8, 0.008 * k.L), color: k.pal.bill, closed: false, still: true, curve: 0.3});
  }
  if (withRing) {
    // band on the tarsus, picture minimum 6 px tall (brief: ring picture minimum)
    const mid: Pt = [top[0] + (foot[0] - top[0]) * 0.55, top[1] + (foot[1] - top[1]) * 0.55];
    const m = q(mid), hgt = Math.max(6, 0.027 * k.L), wd = Math.max(5, 0.03 * k.L);
    hardFill(k.p, k.seed * 50 + ++k.n, k.pal.ring, [[m[0] - wd / 2, m[1] - hgt / 2], [m[0] + wd / 2, m[1] - hgt / 2], [m[0] + wd / 2, m[1] + hgt / 2], [m[0] - wd / 2, m[1] + hgt / 2]]);
    hardFill(k.p, k.seed * 50 + ++k.n, k.pal.ringHi, [[m[0] - wd / 2, m[1] - hgt / 2], [m[0] - wd / 6, m[1] - hgt / 2], [m[0] - wd / 6, m[1] + hgt / 2], [m[0] - wd / 2, m[1] + hgt / 2]]);
    return Math.round(hgt);
  }
  return 0;
};

// ---- profile body (perched / scold / caw / fly-side)
const paintProfile = (k: Ctx, st: CrowState, hv: CrowHead): {head: Pt; box: Pt[]} => {
  const young = isYoung(k.o.variant), lean = st.lean ?? 0, q = P(k, lean);
  const tuck = st.tuck ?? false, wings = st.wings ?? 0;
  let ringPx = 0;
  // far leg first (the crow's LEFT leg when it faces screen right: the ring leg)
  const leftFar = k.dir === 1;
  if (!tuck) ringPx = Math.max(ringPx, leg(k, q, [-0.05, -0.17], [-0.035, 0], ringed(k.o.variant) && leftFar, 'grip'));
  // tail: long, rounded, fanned by `flare`, angled by `tailUp`
  const tu = ((st.tailUp ?? 0) * Math.PI) / 180, fl = st.flare ?? 0, tl = young ? 0.3 : 0.38;
  const tb: Pt = [-0.17, -0.2], tdir: Pt = [-Math.cos(0.85 - tu), Math.sin(0.85 - tu)];
  const tip: Pt = [tb[0] + tdir[0] * tl, tb[1] + tdir[1] * tl], nrm: Pt = [-tdir[1], tdir[0]], hw = 0.05 + 0.06 * fl;
  const tail: Pt[] = [[tb[0] + nrm[0] * 0.06, tb[1] + nrm[1] * 0.06], [tip[0] + nrm[0] * hw, tip[1] + nrm[1] * hw], [tip[0] + tdir[0] * 0.03, tip[1] + tdir[1] * 0.03], [tip[0] - nrm[0] * hw, tip[1] - nrm[1] * hw], [tb[0] - nrm[0] * 0.05, tb[1] - nrm[1] * 0.05]];
  rimOf(k, tail.map(q));
  fill(k, k.pal.shade, tail.map(q));
  wash(k, k.pal.sheen, 90, [tail[0], tail[1], tail[2], [(tail[0][0] + tail[2][0]) / 2, (tail[0][1] + tail[2][1]) / 2]].map(q));
  // far wing (flying)
  const wu = Math.max(-1, Math.min(1, st.wingUp ?? 0));
  // open wing seen side-on (N1, W5.2): a blade from the shoulder whose direction and visible length follow the stroke: apex (wu 1) it points up
  // and a little back, mid-stroke it lies foreshortened toward the viewer (short, broad), bottom (wu -1) it points down. Leading edge arm -> wrist,
  // five primaries fanned beyond the wrist and lagging behind the stroke, trailing edge back to the body.
  const wingPoly = (near: boolean): Pt[] => {
    const ang = ((90 - wu * 80 + (near ? 0 : 14)) * Math.PI) / 180, dir: Pt = [-Math.sin(ang), -Math.cos(ang)];
    let nrm: Pt = [-dir[1], dir[0]];
    if (nrm[0] < 0) nrm = [-nrm[0], -nrm[1]];
    const Lp = 0.88 * wings * (near ? 1 : 0.9) * (0.3 + 0.7 * Math.abs(wu) ** 0.8);
    const sh: Pt = [0.03 - (near ? 0 : 0.03), -0.42 + (near ? 0 : -0.02)];
    const lag = -wu * 0.12; // primaries trail the stroke (down-stroke: tips swept up/back, up-stroke: swept down)
    const at = (s: number, off: number): Pt => [sh[0] + dir[0] * s * Lp + nrm[0] * off, sh[1] + dir[1] * s * Lp + nrm[1] * off];
    const chord = (s: number) => (0.07 + 0.2 * Math.sin(Math.min(1, s / 0.9) * 2.4) ** 1) * (0.55 + 0.45 * wings) * (1 + 0.5 * (1 - Math.abs(wu)));
    const lead: Pt[] = [], trail: Pt[] = [];
    for (let i = 0; i <= 6; i++) { const s = (i / 6) * 0.6; lead.push(at(s, chord(s) * 0.38)); trail.push(at(s, -chord(s) * 0.62)); }
    // primaries: five fingers from the wrist, each a little longer toward the leading edge, spread by the lag
    const tips: Pt[] = [], notch: Pt[] = [];
    for (let i = 0; i < 5; i++) {
      const f = i / 4, s = 1 - 0.1 * f;
      const t = at(s, chord(0.62) * (0.3 - 0.95 * f) + lag * (0.35 + 0.65 * f));
      tips.push(t);
      const nB = at(0.78 + 0.02 * i, chord(0.62) * (0.3 - 0.95 * (f + 0.12)) + lag * 0.3);
      notch.push(nB);
    }
    const out: Pt[] = [...lead];
    for (let i = 0; i < 5; i++) { out.push(tips[i]); if (i < 4) out.push(notch[i]); }
    out.push(...trail.reverse());
    return out;
  };
  if (wings > 0) fill(k, k.pal.shade, wingPoly(false).map(q));
  // body: an egg tilted up at the front, belly bulge, rump to the tail
  const body: Pt[] = Array.from({length: 26}, (_, i) => {
    const a = (i / 26) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    const rx = 0.25 * (c > 0 ? 1.0 : 1.05), ry = 0.135 * (s > 0 ? 1.08 : 1.0);
    const x = c * rx, y = s * ry, ang = -0.62;
    return [-0.02 + x * Math.cos(ang) - y * Math.sin(ang), -0.32 + x * Math.sin(ang) + y * Math.cos(ang)];
  });
  const neck: Pt[] = [[0.04, -0.5], [0.17, -0.6], [0.23, -0.5], [0.17, -0.36], [0.04, -0.32]];
  const thigh = ellL(-0.03, -0.19, 0.07, 0.05);
  rimOf(k, body.map(q));
  fill(k, k.pal.body, body.map(q));
  fill(k, k.pal.body, neck.map(q));
  fill(k, k.pal.body, thigh.map(q));
  if (young) wash(k, k.pal.fluff, 130, ellL(-0.03, -0.2, 0.15, 0.045, -0.5).map(q)); // loose belly fluff (scruffier, matte)
  // sheen on the back (sky side) and a cool shade on the belly
  wash(k, k.pal.sheen, young ? 70 : 130, ellL(-0.02, -0.38, 0.2, 0.06, -0.42).map(q));
  wash(k, k.pal.shade, 120, ellL(0.02, -0.22, 0.17, 0.05, -0.42).map(q));
  // folded wing (primaries reach toward the tail)
  if (wings <= 0) {
    const fw: Pt[] = [[0.1, -0.5], [-0.03, -0.49], [-0.17, -0.38], [-0.3, -0.24], [-0.4, -0.1], [-0.33, -0.11], [-0.19, -0.2], [-0.04, -0.29], [0.08, -0.38]];
    fill(k, k.pal.shade, fw.map(q));
    wash(k, k.pal.sheen, young ? 60 : 100, [[0.07, -0.48], [-0.12, -0.41], [-0.25, -0.28], [-0.1, -0.34], [0.05, -0.42]].map(q));
    for (let i = 0; i < 3; i++) line(k, [[-0.1 - 0.07 * i, -0.36 + 0.07 * i], [-0.26 - 0.05 * i, -0.22 + 0.05 * i]].map(q), 0.6, mix(k.pal.sheen, '#000000', 0.2));
  } else fill(k, k.pal.body, wingPoly(true).map(q));
  line(k, body.map(q), 0.7, k.pal.shade, true);
  // near leg
  if (!tuck) leg(k, q, [0.0, -0.17], [0.01, 0], ringed(k.o.variant) && !leftFar, 'grip');
  // head
  const hc: Pt = [0.17, -0.62];
  paintHead(k, q, hc, 0.088, hv, st);
  k.ringPx = ringPx;
  return {head: q(hc), box: [...body, ...tail, [0.4, -0.68]].map(q)};
};

// ---- front / back body (perched)
const paintFrontBack = (k: Ctx, st: CrowState, view: 'front' | 'back', hv: CrowHead): {head: Pt; box: Pt[]} => {
  const young = isYoung(k.o.variant), q = P(k, 0), back = view === 'back';
  // the crow's LEFT leg: screen right in front view, screen left in back view
  const leftX = view === 'front' ? 0.07 : -0.08;
  let ringPx = 0;
  for (const x of view === 'front' ? [-0.07, 0.07] : [-0.08, 0.08]) ringPx = Math.max(ringPx, leg(k, q, [x * 0.8, -0.16], [x, 0], ringed(k.o.variant) && x === leftX, 'grip'));
  // body: broad at the shoulders, narrowing to the vent (a crow seen square-on is wider than deep)
  const body: Pt[] = Array.from({length: 24}, (_, i) => {
    const a = (i / 24) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    return [c * 0.165 * (1 - 0.22 * Math.max(0, s)), -0.32 + s * (s > 0 ? 0.15 : 0.19)];
  });
  rimOf(k, body.map(q));
  fill(k, k.pal.body, body.map(q));
  if (back) {
    // tail hangs behind the perch, over the legs; the folded wings cross over its base
    const fl = st.flare ?? 0;
    const tail: Pt[] = [[-0.045, -0.22], [0.045, -0.22], [0.055 + 0.05 * fl, 0.16], [0.0, 0.19], [-0.055 - 0.05 * fl, 0.16]];
    rimOf(k, tail.map(q));
    fill(k, k.pal.shade, tail.map(q));
    for (const sd of [-1, 1]) {
      const w: Pt[] = [[sd * 0.02, -0.47], [sd * 0.16, -0.42], [sd * 0.15, -0.26], [sd * 0.06, -0.1], [sd * -0.03, -0.02], [sd * -0.01, -0.2]];
      fill(k, k.pal.shade, w.map(q));
      wash(k, k.pal.sheen, 90, [[sd * 0.04, -0.46], [sd * 0.15, -0.42], [sd * 0.145, -0.39], [sd * 0.04, -0.43]].map(q));
      line(k, [[sd * 0.13, -0.3], [sd * 0.04, -0.1]].map(q), 0.6, mix(k.pal.sheen, '#000000', 0.25));
    }
  } else {
    if (young) wash(k, k.pal.fluff, 120, ellL(0, -0.2, 0.11, 0.05).map(q));
    fill(k, k.pal.body, ellL(0, -0.47, 0.09, 0.08).map(q));
    wash(k, k.pal.sheen, 80, ellL(-0.04, -0.38, 0.06, 0.1).map(q));
    for (const sd of [-1, 1]) fill(k, k.pal.shade, [[sd * 0.12, -0.44], [sd * 0.17, -0.3], [sd * 0.13, -0.14], [sd * 0.09, -0.22]].map(q)); // wing edges
  }
  line(k, body.map(q), 0.7, k.pal.shade, true);
  const hc: Pt = [0, -0.54];
  paintHead(k, q, hc, 0.088, hv, st);
  k.ringPx = ringPx;
  return {head: q(hc), box: body.map(q)};
};

// ---- seen from below, flying overhead (fly / low pass)
const paintBelow = (k: Ctx, st: CrowState): {head: Pt; box: Pt[]} => {
  const q = P(k, 0), up = st.wingUp ?? 0;
  // local: x along the wingspan, y along the body (head at -y); origin at the body centre
  const span = 1.0 * (0.75 + 0.25 * Math.cos(up * 1.2));
  const wing = (s: 1 | -1): Pt[] => {
    // broad arm, wrist bend, five splayed primaries ("fingers") with slots between them, a straight trailing edge back to the body
    const pts: Pt[] = [[s * 0.06, -0.1], [s * 0.3, -0.16 - 0.04 * up], [s * 0.56, -0.14 - 0.06 * up]];
    for (let i = 0; i < 5; i++) {
      const a = -0.35 + i * 0.2, tip: Pt = [s * (0.56 + Math.cos(a) * (span - 0.5)), -0.1 + Math.sin(a) * (span - 0.5) * 0.9];
      const base: Pt = [s * (0.54 + Math.cos(a + 0.1) * 0.12), -0.06 + Math.sin(a + 0.1) * 0.15];
      pts.push(i === 0 ? tip : base, tip, [tip[0] - s * 0.025, tip[1] + 0.03]);
    }
    pts.push([s * 0.42, 0.2], [s * 0.2, 0.18], [s * 0.06, 0.12]);
    return pts;
  };
  const body = ellL(0, 0.0, 0.07, 0.24);
  const tail: Pt[] = [[-0.05, 0.18], [0.05, 0.18], [0.12, 0.4], [0.06, 0.44], [0.0, 0.45], [-0.06, 0.44], [-0.12, 0.4]];
  for (const s of [-1, 1] as const) { fill(k, k.pal.body, wing(s).map(q)); wash(k, k.pal.sheen, 70, wing(s).slice(0, 4).map(q)); }
  fill(k, k.pal.body, tail.map(q));
  fill(k, k.pal.body, body.map(q));
  fill(k, k.pal.body, ellL(0, -0.27, 0.065, 0.07).map(q));
  fill(k, k.pal.bill, [[-0.025, -0.33], [0.025, -0.33], [0, -0.41]].map(q));
  return {head: q([0, -0.27]), box: [...wing(1), ...wing(-1), ...tail].map(q)};
};

/** Paint one crow standing (or flying) at world point `at` (its feet; for `below`, its body centre) through camera `c`. */
export const paintCrow = (p: Painter, c: YCam, at: V3, o: CrowOpts): CrowMeasure | null => {
  const g = camPoint(c, at, c.near ?? 0.05);
  if (!g) return null;
  const u = camUnit(c, at, c.near ?? 0.05);
  const lenM = (isYoung(o.variant) ? 0.38 : 0.45) * (o.scale ?? 1);
  return paintCrowPx(p, g, u * lenM, o, u);
};

/** The same crow painted at a picture point `foot` with body length `L` px (hands, sheets). */
export const paintCrowPx = (p: Painter, foot: Pt, L: number, o: CrowOpts, pxPerM = L / 0.45): CrowMeasure => {
  const dir: 1 | -1 = o.view === 'left' ? -1 : 1;
  const k: Ctx = {p, seed: o.seed, o, L, foot, dir, pal: palette(o), n: 0};
  const st = o.state ?? {};
  if (o.anchor === 'body' && o.view !== 'below') { const q0 = P(k, st.lean ?? 0)([-0.02, -0.32]); k.foot = [foot[0] - (q0[0] - foot[0]), foot[1] - (q0[1] - foot[1])]; }
  let r: {head: Pt; box: Pt[]};
  if (o.view === 'below') r = paintBelow(k, st);
  else if (o.view === 'front' || o.view === 'back') r = paintFrontBack(k, st, o.view, o.head ?? (o.view === 'front' ? 'front' : 'back'));
  else r = paintProfile(k, st, o.head ?? (o.view === 'right' ? 'profile-right' : 'profile-left'));
  const xs = r.box.map((q) => q[0]), ys = r.box.map((q) => q[1]);
  return {lengthPx: Math.round(L), pxPerM: Math.round(pxPerM), box: [Math.round(Math.min(...xs)), Math.round(Math.min(...ys)), Math.round(Math.max(...xs)), Math.round(Math.max(...ys))],
    headPx: Math.round((/profile/.test(o.head ?? (o.view === 'right' || o.view === 'left' ? 'profile' : '')) ? 0.088 * 3.08 : 0.176) * L), ringPx: k.ringPx ?? 0, feet: foot, head: r.head};
};

// ---- flight cycle (N1, W5.2): pure functions of the shot-local frame `n` (deterministic on seek), returning the `state` for `paintCrow`.
/** Wingbeat: ~2.5 Hz (12 f at 30 fps; faster strobes at 30 fps), a quick down-stroke and a slower, folded up-stroke; `phase` 0..1 offsets one bird from the next, `glide` 0..1 holds the wings open and still. */
export const flapState = (n: number, o: {hz?: number; phase?: number; glide?: number; fps?: number; beak?: number} = {}): CrowState => {
  const ph = (n / (o.fps ?? 30)) * (o.hz ?? 2.5) + (o.phase ?? 0), a = ph * Math.PI * 2;
  const flap = Math.sin(a) + 0.22 * Math.sin(2 * a + 0.6), g = o.glide ?? 0;
  const wingUp = Math.max(-1, Math.min(1, flap * (1 - g) + 0.18 * g));
  return {wings: 1, wingUp, tuck: true, lean: 30 + 4 * Math.cos(a), tailUp: 18 + 6 * Math.sin(a), flare: 0.3, beak: o.beak ?? 0};
};
/** Take-off from a perch over `len` frames (default 8): crouch and push (lean back), wings sweep up then into the beat. `n` is frames since the push. */
export const takeoffState = (n: number, o: {len?: number; phase?: number; hz?: number} = {}): CrowState => {
  const len = o.len ?? 8, u = Math.max(0, Math.min(1, n / len));
  if (n <= 0) return {lean: -10, wings: 0};
  if (u < 1) {
    const e = u * u * (3 - 2 * u);
    return {wings: Math.min(1, 0.25 + 0.9 * e), wingUp: 0.9 - 1.6 * Math.max(0, u - 0.45) / 0.55, tuck: u > 0.5, lean: -22 + 52 * e, tailUp: 14 + 4 * e, flare: 0.5 * (1 - e) + 0.3 * e};
  }
  return flapState(n - len, {phase: (o.phase ?? 0) + 0.5, hz: o.hz});
};
/** Landing over `len` frames (default 8): wings flared and braking (high, cupped), legs forward (not tucked), body upright, tail fanned; ends folded. `n` frames since the first brake, 0 = still flying. */
export const landState = (n: number, o: {len?: number} = {}): CrowState => {
  const len = o.len ?? 8, u = Math.max(0, Math.min(1, n / len));
  if (n <= 0) return flapState(0, {glide: 1});
  const brake = Math.sin(u * Math.PI * 3) * (1 - u) * 0.5; // a last couple of flutters
  return {wings: 1 - 0.8 * u * u, wingUp: 0.75 * (1 - u) + brake, tuck: false, lean: 4 - 26 * u, tailUp: 30 * (1 - u), flare: 1 - u};
};

/** Scold cycle (perched): beak pumping ~3 Hz, body lean pump, tail flare, an occasional wing flick; `phase` per bird (seeded), `k` 0..1 intensity (soft scold at dusk). */
export const scoldState = (n: number, o: {phase?: number; k?: number; hz?: number; fps?: number} = {}): CrowState => {
  const k = o.k ?? 1, ph = (n / (o.fps ?? 30)) * (o.hz ?? 3) + (o.phase ?? 0), a = ph * Math.PI * 2;
  const pump = 0.5 + 0.5 * Math.sin(a), flick = Math.max(0, Math.sin(ph * 0.37 * Math.PI * 2 + 1.3) - 0.88) * 8;
  return {beak: k * (0.15 + 0.8 * pump), lean: k * (14 + 8 * pump), flare: k * (0.55 + 0.35 * pump), tailUp: k * (8 + 6 * pump),
    ...(flick > 0.15 ? {wings: Math.min(0.55, flick * 0.5), wingUp: 0.5, tuck: false} : {})};
};
/** Height of a perched crow's body centre above its feet (m), the offset between the 'feet' and 'body' anchors. */
export const BODY_OFF_M = 0.32 * 0.45;
