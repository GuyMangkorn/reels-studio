import {capsule, ell, hardFill} from '../kit/draw';
import type {CastDef} from '../kit/cast';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {paintSorted, type Item} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintShot16} from './aerial';
import {MAN, paintMaskCarry, paintPerson, WALKER, WOMAN, type CastMeasure, type WalkOpts} from './cast';
import {clamp01, lerp, lin, sm, type ShotId} from './clock';
import {flapState, landState, paintCrow, paintCrowPx, scoldState, takeoffState, type CrowOpts, type CrowState} from './crow';
import {birdAt, MAN13, MAN6, MOB13, MOB6, WOMAN13, type Bird} from './mob';
import {C, lookCam, NEST, wireAt, WS} from './palette';
import {lump, paintNest, paintPathBack, paintWire, pathItems, type PathState} from './path';
import {paintStick} from './props';
import {fadeItem, paintPathTimeline, SHOT17, seasonAt, type StateKey} from './season';

// EDU-EP16-SHORT shot code (W5.3 Draft, Editor, 2026-11-10): one paint function per shot of EDU-EP16-ROWS-R2.0 (scripts/edu-series/ep16/storyboard.md "Per-shot staging"), a pure function of the
// shot-local frame `L` (and the global frame `g` for ambient clocks): no state, no random, so Studio, random seek and the scene render draw the same picture. Everything is composed from Boss's modules in
// this folder (crow.ts flight/scold cycles, mob.ts perches and legs, cast.ts people and masks, poses.ts, props.ts, season.ts, aerial.ts, path.ts); nothing here edits them.
// Space P, metres, as the sheet. Walkers walk +x at 0.0433 m/f.

type Cam = {pos: V3; at: V3; f: number; hy?: number; near?: number};
const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
/** Camera between two keys at u 0..1 (look-at and position interpolated linearly; f and hy too). */
const camBetween = (a: Cam, b: Cam, u: number): YCam => lookCam(lerp3(a.pos, b.pos, u), lerp3(a.at, b.at, u), lerp(a.f, b.f, u), {hy: lerp(a.hy ?? 960, b.hy ?? 960, u), near: b.near ?? a.near});
const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const pump = (L: number, ph = 0, hz = 3) => 0.5 + 0.5 * Math.sin((L / 30) * hz * Math.PI * 2 + ph);

// ---- items
type Out<T> = {v?: T | null};
const crowItem = (at: V3, o: CrowOpts, out?: {v?: unknown}, bias = -0.05): Item => ({at, bias, draw: (p, c) => { const m = paintCrow(p, c, at, o); if (out) out.v = m; }});
const personItem = (def: CastDef, o: WalkOpts, out?: Out<CastMeasure>): Item => ({at: o.at, draw: (p, c) => { const m = paintPerson(p, c, def, o); if (out) out.v = m; }});
/** A mob bird from Boss's perch/legs timeline (`birdAt`), morning sun. */
const birdItem = (b: Bird, n: number, o: Partial<CrowOpts> = {}): Item => {
  const s = birdAt(b, n);
  return crowItem(s.at, {...s.opts, state: s.state, sun: -1, ...o});
};
const groundShadow = (at: V3, seed: number): Item => ({at, bias: 0.2, draw: (p, c) => {
  const q = camPoint(c, [at[0], 0.005, at[2]]);
  if (q) { const u = camUnit(c, [at[0], 0, at[2]]); hardFill(p, seed, '#4a6a30', ell(q[0], q[1], 0.2 * u, 0.06 * u, 12)); }
}});
/** Walk clock (cycles) at path x: metres per cycle (2 steps) per person, set to the planted foot's mid-stance speed (W5.3 R3: the old 1.11 m made the legs cycle 40 % too fast, planted feet slid 10 cm per cycle and read as a moonwalk; at these values the slide is 0.05 / 0.02 / 0.03 m per cycle, a step of 0.78 / 0.65 / 0.73 m). */
const STRIDE = new Map<CastDef, number>([[MAN, 1.55], [WOMAN, 1.3], [WALKER, 1.46]]);
const walkPh = (x: number, def: CastDef = MAN) => x / (STRIDE.get(def) ?? 1.1);
/** The person on the path at `x` walking +x; `t` the ambient clock. The view follows the travel direction against the lens (`travel`: the nearest of the four views, so a walker never faces opposite to where he goes); `o.view` pins one for a shot. */
const walker = (def: CastDef, x: number, t: number, o: Partial<WalkOpts> = {}, z = 0.3): Item => personItem(def, {at: [x, 0, z], travel: [1, 0], walk: walkPh(x, def), t, ...o});

const scene = (p: Painter, c: YCam, s: PathState, extra: Item[], skip?: string[]) => {
  paintPathBack(p, c, s);
  paintSorted(p, c, [...pathItems(s, {skip}), ...extra]);
};
const day0 = (t: number): PathState => ({season: 'spring', t});

// ---- the test rig (shots 5, 9, 10): the same camera and perches, only the face changes (LF02)
const RIG = (xw: number) => lookCam([xw + 0.2, 0.95, 3.6], [xw + 0.4, 2.3, -0.8], 900, {hy: 600});
const RIG_X = [-15.5, -14.5, -13.0, WS.WS1, WS.WS2, WS.WS3];
/** One wire crow of the rig. Heads face away (`away`) until frame `turnAt`, then toward the walker; `state` per bird. */
/** `pivot(i)` = [start, end?] frames of the whole-body pivot to `front` (4 f in, 4 f out; R2.1 F13) with one wing flick and tail flare (6 f); none = the bird never reacts. */
const rigRow = (xw0: number, L: number, turnAt: (i: number) => number, state: (i: number) => CrowState, towardOf: (i: number) => boolean | undefined = () => undefined, pivot: (i: number) => [number, number?] | undefined = () => undefined): Item[] => RIG_X.map((x, i) => {
  const toR = x < -10.6, front0 = i % 3 === 1, toward = towardOf(i) ?? L >= turnAt(i);
  const pv = pivot(i), turned = !!pv && L >= pv[0] + 2 && (pv[1] === undefined || L < pv[1] + 2);
  const front = front0 || turned;
  const body: CrowOpts['view'] = front ? 'front' : toR ? 'right' : 'left';
  const head: CrowOpts['head'] = front ? 'front' : toward ? (toR ? 'profile-right' : 'profile-left') : (toR ? 'profile-left' : 'profile-right');
  void xw0;
  const st0 = state(i), fl = pv ? Math.sin(Math.PI * clamp01((L - pv[0] - 2) / 6)) : 0;
  const st: CrowState = fl > 0 ? {...st0, wings: Math.max(st0.wings ?? 0, 0.55 * fl), wingUp: 0.4, flare: Math.max(st0.flare ?? 0, 0.8 * fl)} : st0;
  return crowItem(wireAt(x), {variant: i % 2 ? 'adult-ringed' : 'adult', view: body, head, state: st, seed: 520 + i, sun: -1});
});
const calmState = (i: number, L: number): CrowState => ({headTilt: 0.4 + 0.2 * Math.sin(L * 0.1 + i), lean: 8});
const preen = (i: number, L: number): CrowState => {
  const ph = Math.sin(L * 0.27 + i * 2.1);
  // the bill goes into the lifted wing (wings a little open at the peak of each preen)
  return {headTilt: 0.5 + 0.5 * ph, lean: 8 + 9 * Math.sin(L * 0.17 + i * 1.3), tailUp: 4 * Math.sin(L * 0.2 + i), wings: 0.28 * Math.max(0, ph), wingUp: 0.5};
};

type ShotFn = (p: Painter, L: number, g: number) => void;
const T0 = (g: number) => g / 30;

// ============================================================ B01
// 1. S01-B01-SH01 [0,80): over the crow's shoulder, slow push (LF01).
const shot1: ShotFn = (p, L, g) => {
  const t = T0(g), c = camBetween({pos: [-4.55, 6.29, -2.98], at: [-1.9, 1.2, 0.7], f: 1100, hy: 900, near: 0.05}, {pos: [-4.45, 6.25, -2.82], at: [-0.9, 1.2, 0.7], f: 1100, hy: 900, near: 0.05}, L / 79);
  const x = -3.72 + 0.0433 * L;
  scene(p, c, day0(t), [
    walker(MAN, x, t, {mask: 'A1', cup: 'walk', view: 'left'}),
    crowItem(wireAt(WS.WSH + (-0.3)), {variant: 'adult-ringed', view: 'back', head: L >= 35 ? 'profile-right' : 'back', state: {headTilt: 0.5, lean: 6 * sm(55, 66, L)}, seed: 501, sun: -1}, undefined, -10),
  ]);
};

// 2. S01-B01-SH02 [80,150): nest-height close; the young pops up and scolds down.
const shot2: ShotFn = (p, L, g) => {
  const t = T0(g), c = camBetween({pos: [1.2, 5.95, -2.55], at: [2.0, 5.7, -3.6], f: 1300}, {pos: [1.3, 5.92, -2.7], at: [2.0, 5.7, -3.6], f: 1300}, L / 69);
  const pop = sm(8, 13, L), open = sm(25, 30, L), ph = pump(L - 25, 0, 3.2);
  // The camera sits inside the maple's leaf mass (W5.3 finding for Boss: the nest tree has no window for this camera), so the nest cup is painted after the foliage with the young crow
  // between: it sits in the cup, the cup's front covers its legs and belly; before +8 it is below the rim.
  paintPathBack(p, c, {season: 'spring', t});
  paintSorted(p, c, pathItems({season: 'spring', t}));
  paintNest(p, c, 'full', 'spring', 'back');
  paintCrow(p, c, [NEST[0] - 0.02, NEST[1] - 0.34 * (1 - pop) + 0.03, NEST[2] + 0.05], {variant: 'young', view: 'left', head: 'profile-left', state: {beak: open * (0.55 + 0.45 * ph), lean: 30 * open, wings: 0, headTilt: 0.2 * open}, seed: 511, sun: -1, t});
  paintNest(p, c, 'full', 'spring', 'front');
};

// 3. S01-B01-SH03 [150,235): the masked man nets a crow on the grass; two ringed crows hop off.
const C0: V3 = [-5.95, 0, -3.7];
const camS3 = (L: number) => camBetween({pos: [-5.55, 1.1, -0.85], at: [-5.6, 0.35, -3.7], f: 1200}, {pos: [-5.55, 1.08, -1.1], at: [-5.6, 0.35, -3.7], f: 1200}, L / 84);
const shot3: ShotFn = (p, L, g) => {
  const t = T0(g), c = camS3(L), kk = sm(41, 49, L);
  // R2.1 (F3): side-on kneel facing +x, the crow walks on the grass in front of his knees
  const crowAt: V3 = [-5.3, 0, -3.7];
  const hoop = camPoint(c, [crowAt[0], 0.2, crowAt[2]]) ?? undefined;
  const hop = (id: string, sx: number, dx: number, seed: number): Bird => ({id, variant: 'adult-ringed', view: dx > 0 ? 'right' : 'left', start: [sx, 0, -3.4], seed, phase: 0.3,
    legs: [{n0: 0, n1: 6, to: [sx + dx * 0.9, 0, -3.35], arc: 0.28, hop: true}, {n0: 6, n1: 13, to: [sx + dx * 2.1, 0, -3.3], arc: 0.3, hop: true}, {n0: 13, n1: 20, to: [sx + dx * 4.0, 0, -3.25], arc: 0.35, hop: true}]});
  const hops = [hop('H1', -6.6, -1, 531), hop('H2', -5.0, 1, 532)].map((b) => birdItem(b, L, {head: undefined}));
  const crowMain = crowItem(crowAt, {variant: 'adult', view: 'right', state: L < 49 ? {headTilt: 0.3 + 0.2 * Math.sin(L * 0.3), lean: 6 * lin(0, 40, L)} : {lean: 22, headTilt: 0.2}, seed: 530, sun: -1, t});
  scene(p, c, day0(t), [
    personItem(MAN, {at: C0, view: 'right', mask: 'A1', t, face: 'neutral', ep: {id: 'kneel-net', k: kk}, net: {k: kk, drape: sm(49, 56, L), hoopAt: hoop}}),
    groundShadow(crowAt, 7100), crowMain, ...hops,
  ], ['T1']);
};

// 4. S01-B01-SH04 [235,278): the calm hands, a ring clicks on, the crow looks at the mask and flies.
const shot4: ShotFn = (p, L, g) => {
  const t = T0(g), c = camBetween({pos: [-4.55, 0.75, -3.7], at: [-6.2, 0.44, -3.7], f: 1000}, {pos: [-4.61, 0.76, -3.7], at: [-6.2, 0.44, -3.7], f: 1000}, L / 42);
  const out: Out<CastMeasure> = {};
  const open = L >= 24;
  const look = sm(12, 20, L) * (1 - sm(22, 24, L));
  scene(p, c, day0(t), [personItem(MAN, {at: C0, view: 'front', mask: 'A1', t, face: 'neutral', ep: {id: open ? 'open-hands' : 'hold-bird', k: open ? sm(24, 34, L) : 1},
    ...(open ? {} : {bird: {ring: L >= 8, head: look > 0.5 ? 'front' as const : 'profile-right' as const, headTilt: 0.2}})}, out)], ['T1']);
  // take-off (R2.1 F4): the crow springs up out of the open hands on a rising arc to the upper right, wings up from +25; the arc stays right of the mask box
  if (open && out.v) {
    const n = L - 24, u = camUnit(c, C0), hands: Pt = [(out.v.rHand[0] + out.v.lHand[0]) / 2, (out.v.rHand[1] + out.v.lHand[1]) / 2];
    if (n < 11) {
      const e = n / 10, x = lerp(hands[0], 1180, e ** 1.3), y = lerp(hands[1], 300, e ** 1.1) - 90 * Math.sin(Math.PI * e) * (1 - e);
      paintCrowPx(p, [x, y], 0.5 * u * (1 - 0.1 * e), {variant: 'adult-ringed', view: 'right', state: takeoffState(n, {len: 8}), seed: 541, sun: -1, anchor: 'body'}, u);
    }
  }
};

// 5. S01-B01-SH05 [278,339): test rig, the masked man walks with a coffee; the wire crows turn their heads together.
const shot5: ShotFn = (p, L, g) => {
  const t = T0(g), xw = -11.9 + 0.0433 * L, c = RIG(xw);
  // ripple from the nearest (WS1, i = 3) outward, 2 f apart (+20)
  const rank = [0, 1, 2, 3, 4, 5].map((i) => Math.abs(i - 3));
  const near = sm(48, 56, L);
  scene(p, c, day0(t), [
    walker(MAN, xw, t, {mask: 'A1', cup: 'walk'}),
    ...rigRow(xw, L, (i) => 20 + 2 * rank[i], (i) => (i === 3 ? {beak: 0.7 * near, lean: 16 * near, headTilt: 0.5} : calmState(i, L)), () => undefined, (i) => [20 + 2 * rank[i]]),
  ]);
};

// 6. S01-B01-SH06 [339,408): behind the mob at the pole (CR4); every following crow stays >= 10 m from his head.
const shot6: ShotFn = (p, L, g) => {
  const t = T0(g), u = L / 68;
  const c = camBetween({pos: [-19.8, 6.9, -0.9], at: [-10.6, 3.2, -1.2], f: 1000, hy: 800, near: 0.05}, {pos: [-19.4, 6.9, -0.9], at: [-7.8, 3.2, -1.2], f: 1000, hy: 800, near: 0.05}, u);
  const x = MAN6(L)[0];
  scene(p, c, day0(t), [
    walker(MAN, x, t, {mask: 'A1', cup: 'walk', view: L >= 46 && L < 50 ? 'left' : 'back'}),
    // R2.1 (F12): every mob crow faces +x (toward MAN): perched = narrow `back` views, the head turned to profile-right and to profile-left on alternate scold pumps; flyers `right`
    ...MOB6.map((b, i) => birdItem(b, L, {view: birdAt(b, L).mode === 'perch' ? 'back' : 'right', head: birdAt(b, L).mode === 'perch' && (pump(L, i * 1.7, 3) > 0.5) === (i % 2 === 0) ? 'profile-left' : 'profile-right'})),
  ], ['T1']);
};

// 7. S01-B01-SH07 [408,448): one crow passes low; he ducks: V01.
const shot7: ShotFn = (p, L, g) => {
  const t = T0(g), x = -4.3 + 0.0433 * Math.min(L, 8), c = lookCam([x + 0.3, 1.4, 2.75], [x + 0.2, 1.35, 0.3], 1000, {hy: 960});
  // R4 (J2): ease in over 6 f, a small settle (breathing flinch) while held, ease out over 6 f
  const k = L < 8 ? 0 : L < 36 ? sm(8, 14, L) * (1 - 0.06 * (0.5 - 0.5 * Math.cos(Math.max(0, L - 14) * 0.55)) * sm(14, 18, L)) : 1 - sm(36, 42, L);
  const out: Out<CastMeasure> = {};
  const cx = lerp(x - 2.4, x + 2.6, clamp01(L / 7));
  const items: Item[] = [personItem(MAN, {at: [x, 0, 0.3], view: 'right', walk: L < 12 ? walkPh(x) : 0.3, t, mask: 'A1', cup: 'walk', ep: {id: 'duck-cover', k}}, out)];
  if (L <= 7) items.push(crowItem([cx, 2.35, 0.5], {variant: 'adult', view: 'right', state: flapState(L, {phase: 0.2}), seed: 551, sun: -1, anchor: 'body'}, undefined, -0.5));
  // three coffee drops fall from the lid +9..+18
  items.push({at: [x, 1, 0.3], bias: -1, draw: (pp, cc) => {
    const h = out.v?.rHand, u = camUnit(cc, [x, 1, 0.3]);
    if (!h || L < 9 || L > 18) return;
    for (let d = 0; d < 3; d++) { const n = L - 9 - d * 1.5; if (n < 0 || n > 6) continue; hardFill(pp, 7400 + d, '#5a3a24', ell(h[0] + (d - 1) * 0.03 * u, h[1] - 0.05 * u + 0.5 * 0.0014 * 900 * n * n * 0.02 * u * 8, 0.012 * u, 0.018 * u, 8)); }
  }});
  scene(p, c, day0(t), items);
};

// ============================================================ B02
// 8. S01-B02-SH01 [448,508): silence; he peels the mask off (R2.1 F1: medium close-up, right hand only; the mask leaves out of the frame top and is not seen again).
const shot8: ShotFn = (p, L, g) => {
  const t = T0(g), c = camBetween({pos: [-3.9, 1.5, 1.2], at: [-3.9, 1.5, 0.3], f: 1500, hy: 913}, {pos: [-3.9, 1.5, 1.1], at: [-3.9, 1.5, 0.3], f: 1500, hy: 913}, L / 59);
  // pose clock (beats +34 hand in, +38 at the chin, +46 up, +52 out to the left): the keys are even in k, the shot maps the frames onto them
  // G2 (fix round 2): retimed +9 so the mask leaves the face at about +50..+57 (f498-505) against the B08-S6 rip: hand in +43..+47, lift +47..+55, arm out +55..+59
  const k = L < 43 ? 0 : L < 47 ? ((L - 43) / 4) / 3 : L < 55 ? 1 / 3 + ((L - 47) / 8) / 3 : 2 / 3 + (Math.min(L, 59) - 55) / 6 / 3;
  const peel = sm(47, 55, L), lift = 3.4 * peel ** 1.6;
  const worn = L < 55;
  scene(p, c, day0(t), [personItem(MAN, {at: [-3.9, 0, 0.3], view: 'front', t, face: L >= 54 ? 'suspicious' : 'neutral', ...(L >= 43 ? {ep: {id: 'mask-off-r' as const, k}} : {}),
    ...(worn ? {mask: 'A1' as const, maskLift: lift, maskTilt: 10 * peel} : {})})]);
};

// 9. S01-B02-SH02 [508,546): same rig, bare-faced; the crows preen.
const shot9: ShotFn = (p, L, g) => {
  const t = T0(g), xw = -11.4 + 0.0433 * L, c = RIG(xw);
  scene(p, c, day0(t), [walker(MAN, xw, t, {cup: 'walk'}), ...rigRow(xw, L, () => 9999, (i) => preen(i, L))]); // R2.1 F13: no pivot, no reaction; the preen buries the bill in the lifted wing
};

// 10. S01-B02-SH03 [546,612): same rig, the paper smiley mask; one glance.
const shot10: ShotFn = (p, L, g) => {
  const t = T0(g), xw = -12.0 + 0.0433 * L, c = RIG(xw);
  const glance = sm(30, 36, L) * (1 - sm(39, 45, L));
  const st = (i: number): CrowState => (i === 2 ? {...preen(i, L), headTilt: lerp(preen(i, L).headTilt ?? 0, 1, glance), lean: lerp(preen(i, L).lean ?? 0, 18, glance)} : preen(i, L));
  scene(p, c, day0(t), [walker(MAN, xw, t, {mask: 'B', cup: 'walk'}), ...rigRow(xw, L, () => 9999, st, (i) => (i === 2 ? glance > 0.3 : false), (i) => (i === 2 ? [30, 39] : undefined))]);
};

// ============================================================ B03
// 11. S01-B03-SH01 [612,688): by the bench he hands her the mask; she puts it on, hands drop to P01, then she turns and walks off +x (R2.1 F5: no shrug).
const shot11: ShotFn = (p, L, g) => {
  // G1 (fix round 2): look-at lowered 1.25 -> 0.45 m so the pair sits above the caption band (the held mask at hip height cleared y 1200-1320)
  const t = T0(g), c = camBetween({pos: [-2.2, 1.35, 3.6], at: [-2.6, 0.45, 0.3], f: 1050}, {pos: [-2.5, 1.35, 3.3], at: [-2.6, 0.45, 0.3], f: 1050}, L / 75);
  // R4 (J3): the mask goes hand to hand: he holds it +9..+19, reaches out (+19..+27) while she reaches to him (+19..+27); +25..+31 it travels from his right hand to hers (no mask on the ground);
  // he lets the arm drop +31..+37, she brings it to her chest (+27..+37) and turns to the lens at +40 as before.
  const front = L >= 40, turned = L >= 65, carry = L >= 25 && L < 31, manHolds = L >= 9 && L < 25, womanHolds = L >= 31 && L < 40;
  const k = clamp01((L - 44) / 8), epk = L < 52 ? (k * 2) / 3 : 2 / 3 + clamp01((L - 52) / 4) / 3;
  const gk = L < 19 ? (L < 9 ? 0 : (L - 9) / 10 / 3) : L < 27 ? 1 / 3 + sm(19, 27, L) / 3 : 2 / 3 + sm(31, 37, L) / 3;
  const tk = L < 19 ? 0 : L < 27 ? sm(19, 27, L) / 3 : 1 / 3 + sm(27, 37, L) * 2 / 3;
  const mo: Out<CastMeasure> = {}, wo: Out<CastMeasure> = {};
  const items: Item[] = [personItem(MAN, {at: [-3.2, 0, 0.3], view: 'right', t, ...(L >= 9 && L < 40 ? {ep: {id: 'give-mask' as const, k: gk}} : {}), ...(manHolds ? {mask: 'A1' as const, maskHand: true} : {})}, mo)];
  if (turned) { const x = -2.0 + 0.0433 * (L - 66); items.push(walker(WOMAN, x, t, {tote: true, mask: 'A1', view: 'right'})); }
  else if (!front) items.push(personItem(WOMAN, {at: [-2.0, 0, 0.3], view: 'left', t, tote: true, ...(L >= 19 ? {ep: {id: 'take-mask' as const, k: tk}} : {}), ...(womanHolds ? {mask: 'A1' as const, maskHand: true} : {})}, wo));
  else items.push(personItem(WOMAN, {at: [-2.0, 0, 0.3], view: 'front', t, tote: true, face: 'neutral', mask: 'A1', ep: {id: 'mask-on', k: epk},
    ...(L < 44 ? {maskHand: true} : k < 0.5 ? {maskHand: true} : {maskLift: 1 - (k - 0.5) * 2})}));
  if (carry) items.push({at: [-2.6, 0, 0.6], draw: (pp, cc) => { if (mo.v && wo.v) paintMaskCarry(pp, mo.v, wo.v, WOMAN, sm(25, 31, L), 7110, camUnit(cc, [-2.6, 0, 0.3])); }});
  scene(p, c, day0(t), items);
};

// 12. S01-B03-SH02 [688,733): one crow passes low; tote over her head: V02.
const shot12: ShotFn = (p, L, g) => {
  const t = T0(g), xw = 0.3 + (1.6 * L) / 44, c = lookCam([xw + 0.3, 1.25, 2.55], [xw + 0.2, 1.2, 0.3], 1000, {hy: 960});
  const k = sm(6, 12, L);
  const items: Item[] = [walker(WOMAN, xw, t, {mask: 'A1', tote: 'hand', toteUp: k, ep: {id: 'tote-over-head', k}, view: 'right'})];
  if (L <= 7) items.push(crowItem([lerp(xw - 2.4, xw + 2.6, clamp01(L / 7)), 2.05, 0.5], {variant: 'adult', view: 'right', state: flapState(L, {phase: 0.6}), seed: 552, sun: -1, anchor: 'body'}, undefined, -0.5));
  scene(p, c, day0(t), items);
};

// 13. S01-B03-SH03 [733,838): the key image: she is mobbed ahead, he strolls behind, bare-faced.
const shot13: ShotFn = (p, L, g) => {
  const t = T0(g), xW = (n: number) => 2.3 + 0.0433 * n;
  const A: Cam = {pos: [5.2, 1.45, 3.0], at: [-0.6, 2.6, -1.3], f: 1000, hy: 680};
  const B: Cam = {pos: [xW(72) - 0.6, 1.65, 1.9], at: [xW(72), 1.5, 0.3], f: 1050, hy: 860};
  let c: YCam;
  if (L <= 36) c = camBetween(A, A, 0);
  else if (L <= 72) c = camBetween(A, B, sm(36, 72, L));
  else c = camBetween({...B, pos: [B.pos[0] + 0.0433 * (L - 72), B.pos[1], B.pos[2]], at: [B.at[0] + 0.0433 * (L - 72), B.at[1], B.at[2]]}, {...B, pos: [B.pos[0] + 0.0433 * (L - 72), B.pos[1], B.pos[2]], at: [B.at[0] + 0.0433 * (L - 72), B.at[1], B.at[2]]}, 0);
  const sip = sm(49, 53, L) * (1 - sm(58, 62, L));
  scene(p, c, day0(t), [
    // R2.1 (F2): she keeps shot 12's held tote-over-head pose the whole shot
    walker(WOMAN, xW(L), t, {mask: 'A1', tote: 'hand', toteUp: 1, ep: {id: 'tote-over-head', k: 1}, face: 'neutral', view: 'right'}),
    walker(MAN, MAN13(L)[0], t, {cup: sip > 0.5 ? 'sip' : 'walk', face: 'neutral'}),
    // every crow faces +x toward her: perched = `back` view, head toward her (`profile-right`), flying = `right`
    ...MOB13.map((b) => birdItem(b, L, {view: birdAt(b, L).mode === 'perch' ? 'back' : 'right', head: 'profile-right'})),
  ]);
};

// ============================================================ B04
const arrival = (x: number, t0: number, L: number, o: {variant: CrowOpts['variant']; seed: number; scold?: number; from?: V3; left?: boolean}): Item | null => {
  const to = wireAt(x), sgn = o.left ? 1 : -1, from: V3 = o.from ?? [x + sgn * 1.0, to[1] + 0.55, to[2] + 0.15];
  const view: CrowOpts['view'] = o.left ? 'left' : 'right', head: CrowOpts['head'] = o.left ? 'profile-left' : 'profile-right';
  if (L < t0 - 9) return null;
  const n = L - (t0 - 8);
  if (n < 8) {
    const u = n / 8, at: V3 = [lerp(from[0], to[0], u), lerp(from[1], to[1], u) + 0.14 * Math.sin(Math.PI * u), lerp(from[2], to[2], u)];
    return crowItem(at, {variant: o.variant, view, head, state: n < 4 ? flapState(n, {phase: 0.1 + o.seed * 0.07, glide: 0.2}) : landState(n - 4, {len: 4}), seed: o.seed, sun: -1, anchor: 'feet'});
  }
  return crowItem(to, {variant: o.variant, view, head, state: scoldState(L - t0, {phase: o.seed * 0.13, k: o.scold ?? 0.8}), seed: o.seed, sun: -1});
};
// 14. S01-B04-SH01 [838,928): feet land on the wire: one orange ring, then bare legs. The wire item of `pathItems` sorts by its middle (x -3), so near the nest tree the canopy paints over it:
// the wire is painted here as its own near item (finding for Boss).
const nearWire = (season: PathState['season']): Item => ({at: [0, 0, 0], bias: -50, draw: (pp, cc) => paintWire(pp, cc, season)});
const shot14: ShotFn = (p, L, g) => {
  // R2.1 (F6): the camera sits below the wire and looks up, so the feet stand against the sky; crows land in `left` profile, spaced >= 0.45 m
  const t = T0(g), xc = L <= 60 ? -6.3 + 0.027 * L : L < 75 ? lerp(-6.3 + 0.027 * 60, -4.6, sm(60, 75, L)) : -4.6;
  const c = lookCam([xc, 5.05, -1.3], [xc, 6.01, -2.4], 1200, {near: 0.05});
  const xs: [number, number, CrowOpts['variant']][] = [[-6.05, 13, 'adult-ringed'], [-5.65, 43, 'adult'], [-5.2, 47, 'adult'], [-4.75, 51, 'adult'], [-4.3, 57, 'adult']];
  const items = xs.map(([x, f0, v], i) => arrival(x, f0, L, {variant: v, seed: 560 + i, scold: 0.9, left: true})).filter((q): q is Item => !!q);
  const s: PathState = {season: 'summer', t};
  paintPathBack(p, c, s);
  paintSorted(p, c, [...pathItems(s, {skip: ['wire']}), nearWire('summer'), ...items.map((it) => ({...it, bias: -60}))]);
};

// 15. S01-B04-SH02 [928,989): a ringless crow watches a ringed one scold, then joins.
const shot15: ShotFn = (p, L, g) => {
  // R2.1 (F7): re-aimed along -x over the near crow's shoulder; T4 is drawn only as the branch under the near crow plus one soft leaf cluster in the top-right corner
  const t = T0(g), c = camBetween({pos: [10.3, 6.8, -3.45], at: [5.4, 6.45, -3.55], f: 1100}, {pos: [10.1, 6.78, -3.5], at: [5.4, 6.45, -3.55], f: 1100}, L / 60);
  const join = sm(37, 44, L), tilt = sm(8, 14, L);
  const ringless: CrowState = L < 37 ? {headTilt: 0.8 * tilt, lean: 4} : {...scoldState(L - 37, {phase: 0.4, k: join}), headTilt: 0.2};
  const branch: Item = {at: [8, 6.5, -3.8], bias: -40, draw: (pp, cc) => {
    const a = camPoint(cc, [8.95, 6.575, -3.8]), b = camPoint(cc, [7.2, 6.585, -3.8]);
    if (a && b) { const u = camUnit(cc, [8, 6.5, -3.8]); hardFill(pp, 7810, '#4a3a2c', capsule(a, b, 0.06 * u, 0.035 * u, 5)); hardFill(pp, 7811, '#6a5440', capsule([a[0], a[1] - 0.012 * u], [b[0], b[1] - 0.012 * u], 0.03 * u, 0.018 * u, 5)); }
  }};
  const leaves: Item = {at: [11, 8, -4.5], bias: -100, draw: (pp) => {
    hardFill(pp, 7820, '#7a9a4a', lump(1010, 90, 150, 110, 7820)); hardFill(pp, 7821, '#9ab860', lump(960, 60, 80, 55, 7821));
  }};
  scene(p, c, {season: 'summer', t}, [
    branch, leaves,
    crowItem([4.6, 6.4, -3.4], {variant: 'adult-ringed', view: 'left', head: 'profile-left', state: scoldState(L, {phase: 0.4}), seed: 571, sun: -1}),
    crowItem([8.6, 6.6, -3.8], {variant: 'adult', view: L < 37 ? 'back' : 'left', head: 'profile-left', state: ringless, seed: 572, sun: -1}, undefined, -0.3),
  ], ['T4']);
};

// 16. S01-B04-SH03 [989,1050): crane up and back to the aerial while the seasons turn (Boss's paintShot16).
const shot16: ShotFn = (p, L, g) => {
  void g;
  const cn = (L < 14 ? [0, 1, 2] : []).map((k) => crowItem([4.2 + k * 0.7, 5.85, -2.4], {variant: k ? 'adult' : 'adult-ringed', view: 'left', state: scoldState(L, {phase: k * 0.3}), seed: 1300 + k, sun: -1}));
  paintShot16(p, L, cn);
};

// ============================================================ B05
// 17. S01-B05-SH01 [1050,1148): seasons; the nest rebuilt; the mask passes again, and again.
const shot17: ShotFn = (p, L, g) => {
  const t = T0(g), c = camBetween({pos: [-1.6, 1.6, 4.2], at: [2.0, 4.0, -3.5], f: 1000, hy: 610}, {pos: [-1.2, 1.65, 3.6], at: [2.0, 4.0, -3.5], f: 1000, hy: 610}, L / 97);
  const movers: Item[] = [];
  const x1 = 1.3 + 0.0433 * (L - 13);
  if (L < 44) movers.push(fadeItem(walker(WALKER, x1, t, {mask: 'A1', scarf: L < 40, view: 'right'}), 1 - sm(30, 40, L)));
  const x2 = -1.0 + 0.0433 * (L - 44);
  if (L >= 40) movers.push(fadeItem(walker(WALKER, x2, t, {mask: 'A1', view: 'right'}, 1.6), sm(40, 46, L)));
  // the crow with the stick: lands at the nest +36, works it in to +46
  if (L >= 30 && L < 52) {
    const nest = NEST, n = L - 30;
    const at: V3 = L < 36 ? [lerp(3.4, nest[0] + 0.05, sm(30, 36, L)), lerp(6.6, nest[1] + 0.02, sm(30, 36, L)), lerp(-3.2, nest[2], sm(30, 36, L))] : [nest[0] + 0.05, nest[1] + 0.02, nest[2]];
    const state: CrowState = L < 36 ? flapState(n, {phase: 0.3, glide: 0.2}) : {lean: 12 + 10 * Math.sin((L - 36) * 0.7), headTilt: 0.3};
    movers.push({at, bias: -0.4, draw: (pp, cc) => {
      const m = paintCrow(pp, cc, at, {variant: 'adult', view: 'left', head: 'profile-left', state: L < 36 ? {...landState(Math.max(0, n - 3), {len: 3}), wings: 1, wingUp: flapState(n).wingUp} : state, seed: 581, sun: -1, anchor: L < 36 ? 'body' : 'feet'});
      if (m && L < 46) paintStick(pp, [m.head[0] - 24, m.head[1] + 4], camUnit(cc, at), L < 36 ? 8 : 25 - 20 * lin(36, 46, L), 7500, 0.35);
    }});
  }
  // two crows on NB turn to the second walker at +60
  if (L >= 52) for (const [i, s] of [0.35, 0.62].entries()) {
    const at: V3 = [lerp(2.2, -0.2, s), lerp(5.5, 5.9, s), lerp(-3.8, -2.9, s)];
    movers.push(crowItem(at, {variant: 'adult', view: 'right', head: L >= 60 + i * 2 ? 'profile-left' : 'profile-right', state: {headTilt: 0.4, lean: L >= 60 ? 10 : 4}, seed: 583 + i, sun: -1}));
  }
  paintPathTimeline(p, c, SHOT17, L, movers);
};

// 18. S01-B05-SH02 [1148,1250): fledglings beside a ringed parent scold the mask like it.
const shot18: ShotFn = (p, L, g) => {
  const t = T0(g), c = camBetween({pos: [1.05, 6.8, -4.55], at: [0.7, 3.0, 0.0], f: 1000}, {pos: [1.0, 6.75, -4.45], at: [0.7, 3.0, 0.0], f: 1000}, L / 101);
  const st = {season: 'later' as const, t, nest: 'rebuilt' as const};
  const x = -2.5 + 0.0433 * L;
  const copy = sm(48, 56, L), step = sm(68, 76, L);
  const parent = scoldState(L, {phase: 0, k: 1});
  const youngState = (i: number): CrowState => {
    const mine = scoldState(L, {phase: step > 0.5 ? 0 : 0.37 + i * 0.21, k: copy});
    return {...mine, beak: Math.max(mine.beak ?? 0, 0.3 * sm(23, 30, L)), headTilt: 0.2};
  };
  const crow = (at: V3, o: CrowOpts, bias?: number) => crowItem(at, o, undefined, bias);
  // R2.1 (F9): the NT's nest branch NB (path.ts) already runs through the birds' feet line, so it serves as NB2 (a second twig drawn beside it read as two parallel branches); the birds stand on its top edge
  scene(p, c, st, [
    walker(WALKER, x, t, {mask: 'A1'}),
    crow([1.3, 5.72, -3.46], {variant: 'adult-ringed', view: 'back', head: 'profile-left', state: parent, seed: 591, sun: -1}),
    ...(L >= 6 ? [crow([1.0, 5.77, -3.35], {variant: 'young', view: 'back', head: 'profile-left', state: youngState(0), seed: 592, sun: -1}), crow([0.72, 5.81, -3.24], {variant: 'young', view: 'back', head: 'profile-left', state: youngState(1), seed: 593, sun: -1})] : []),
  ]);
};

// 19. S01-B05-SH03 [1250,1394): dusk, the ringed crows' spots empty; a few young scold softly.
const KEYS19: StateKey[] = [
  {n: 0, state: {season: 'dusk', nest: 'rebuilt', leaf: 1, lamps: 0.5}},
  {n: 66, dur: 9, state: {season: 'dusk', nest: 'rebuilt', leaf: 0.7, lamps: 0.5}},
  {n: 80, dur: 8, state: {season: 'dusk', nest: 'rebuilt', leaf: 0.45, lamps: 0.5}},
];
const shot19: ShotFn = (p, L, g) => {
  // R2.1 (F8): the camera sits below the wire so each perched crow is a silhouette on the dusk sky; the x -11 tree (T2) is not drawn.
  const t = T0(g), c = camBetween({pos: [-11.6, 5.8, -1.9], at: [-3.5, 1.24, -2.0], f: 900, near: 0.05}, {pos: [-11.2, 5.8, -1.9], at: [-3.5, 1.24, -2.0], f: 900, near: 0.05}, L / 143);
  // G3 (fix round 2): the ringed crows leave on a one-frame cut (+71, +71, +84): the translucent layer fade read as a pale ghost on the wire
  const rim = {sun: 0 as const, rim: C.duskRim};
  const spot = (x: number, variant: CrowOpts['variant'], seed: number, alpha: number, state: CrowState): Item | null =>
    alpha <= 0.01 ? null : fadeItem(crowItem(wireAt(x), {variant, view: 'right', head: 'profile-right', state, seed, ...rim}, undefined, -60), alpha, 79000 + seed);
  const still = (i: number): CrowState => ({headTilt: 0.3 + 0.2 * Math.sin(L * 0.05 + i), lean: 6});
  const soft = sm(104, 114, L) * (1 - sm(136, 144, L));
  const youngSoft = (i: number): CrowState => (soft > 0.01 ? scoldState(L - 104, {phase: i * 0.4, k: 0.4 * soft}) : still(i));
  const items: Item[] = [
    nearWire('dusk'),
    spot(WS.WS1, 'adult-ringed', 601, L < 71 ? 1 : 0, still(1)),
    spot(WS.WS3, 'adult-ringed', 602, L < 71 ? 1 : 0, still(2)),
    spot(WS.WS4, 'adult', 603, 1, still(3)),
    spot(WS.WS5, 'adult-ringed', 604, L < 84 ? 1 : 0, still(4)),
    spot(WS.WS6, 'adult', 605, 1, youngSoft(5)),
    spot(WS.WS7, 'adult', 606, 1, youngSoft(6)),
    spot(WS.WS8, 'adult-ringed', 607, 1, {headTilt: 0.2, lean: 4}),
  ].filter((q): q is Item => !!q);
  const wx = -8.6 + 0.0433 * (L - 60);
  if (L >= 94) items.push(walker(WALKER, wx, t, {mask: 'A1', sun: 1, view: 'back'}));
  paintPathTimeline(p, c, KEYS19, L, items, {skip: ['wire', 'T2']});
};

// 20. S01-B05-SH04 [1394,1632): one ringless young crow; caw; it looks into the lens; hold.
const shot20: ShotFn = (p, L, g) => {
  const t = T0(g), e = sm(0, 86, L);
  const c = camBetween({pos: [-4.0, 4.2, 3.2], at: [-3.0, 3.0, -1.0], f: 1000, hy: 960}, {pos: [-4.0, 5.55, -1.78], at: [-4.0, 5.98, -2.4], f: 1150, hy: 830, near: 0.05}, e);
  const cawU = sm(155, 159, L) * (1 - sm(166, 171, L));
  const sway = L >= 178 ? 1 : 0.4;
  const state: CrowState = {beak: cawU, puff: cawU, tailUp: -12 * cawU, lean: -4 * cawU + 1.2 * sway * Math.sin(t * 1.3), headTilt: 0.1 * Math.sin(t * 0.9)};
  const items: Item[] = [crowItem(wireAt(WS.WSH), {variant: 'young-ringless', view: 'left', head: L >= 174 ? 'front' : 'profile-left', state, seed: 580, sun: 0, rim: C.duskRim, t}, undefined, -10)];
  const wx = -2.0 + 0.0433 * L;
  if (L < 40) items.push(walker(WALKER, wx, t, {mask: 'A1', sun: 1, view: 'right'}));
  scene(p, c, {season: 'dusk', t, lamps: 0.7}, items);
};

export const SHOT_FNS: Record<ShotId, ShotFn> = {
  'S01-B01-SH01': shot1, 'S01-B01-SH02': shot2, 'S01-B01-SH03': shot3, 'S01-B01-SH04': shot4, 'S01-B01-SH05': shot5, 'S01-B01-SH06': shot6, 'S01-B01-SH07': shot7,
  'S01-B02-SH01': shot8, 'S01-B02-SH02': shot9, 'S01-B02-SH03': shot10, 'S01-B03-SH01': shot11, 'S01-B03-SH02': shot12, 'S01-B03-SH03': shot13,
  'S01-B04-SH01': shot14, 'S01-B04-SH02': shot15, 'S01-B04-SH03': shot16, 'S01-B05-SH01': shot17, 'S01-B05-SH02': shot18, 'S01-B05-SH03': shot19, 'S01-B05-SH04': shot20,
};
void seasonAt; void dist; void lerp3;
