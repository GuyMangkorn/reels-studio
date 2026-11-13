import {BONE, H, SKIRT_LATE, bodyFrame, ikElbow, type CastDef, type FigAnchors, type FigPose, type Outfit} from './cast';
import {INK, VD18, capsule, ell, glaze, inkLine, limb, lineOf, modelPart, solid, toneOf, washAt} from './draw';
import {hatFront} from './gear';
import {CHIN, HEAD_SPAN, headOutline, type HeadStyle} from './head';
import {hairFront, isNewCut} from './hair';
import {lerp, mixColor, type Painter, type Pt} from './painter';
import {clipHalf, quarterGeo} from './quarter';

// BACK view of the recurring cast (kit view `'back'`, added 3 Nov 2026 for EG-EP02 `คุณ`; generalised from the EP01 episode figure
// `everyone-gone/figure-back.ts`). `drawFigure` dispatches `pose.view === 'back'` here, so a back figure takes the same `CastDef`,
// `FigPose` and `FigAnchors` as the front and profile views: any PEOPLE entry, any WARDROBE outfit, the same `poseFor` arms.
//
// - Frame: u toward screen right, v up, metres, like the front view. The character's RIGHT side is on screen RIGHT (seen from behind),
//   so a front-view arm target (`FigPose.rArm` from `poseFor(id, ..., 'front')`) is mirrored about the figure's centre line
//   (`g[0]`): the same pose id reads correctly from behind.
// - Supported: standing, `walk`/`stride` (heel lift only), `lean`, `rise`, `nod`, both arms (IK, `via` elbows kept), hair of every
//   cut seen from behind, hood down (bunch on the upper back) and hood up (`FigPose.hoodUp`), hats (cap, helmet, nurse), pack,
//   belt, skirt, overcoat, `light`, `silhouette`. No face is drawn; `face`, `head` and holds are ignored.
// - `sit` (EDU-EP07 W5.2): seated on a stool or chair seen from behind: the whole figure drops to the seated hip height (`bodyFrame` sit hipV) and the legs are
//   replaced by the pelvis block on the seat (the thighs run away from the lens, so none show). The caller draws the seat and the ground shadow stays off.
// - Body poses (KIT-VIEW-AUDIT VA01, 13 Nov 2026): `crouch` (and `squat`, which the front takes as crouch), `kneel`, `floorSit` and `run` take the
//   front frame's legs (`bodyFrame` with view 'front'; they are left-right symmetric, so the same picture points serve from behind). The upper body
//   drops to that hip and foreshortens like the front; the seat (pelvis block) shows under the back when the hips are low, and kneeling soles face the
//   lens below the knees. A pose with none of these fields draws exactly as before.
// - Not supported (cut to front or profile for these): bend, lie, props in hand.
// - Back three-quarter (KIT-VIEW-AUDIT VA02, 13 Nov 2026; replaces the 4 Nov "no back three-quarter" rule at the user's request):
//   `FigPose.quarter` with view 'back' turns the back block away toward that screen side by `quarterDeg` (15..75, default 45). The
//   body takes the turned width `kt`, the side plane shows in shade on that side, the arm on that side is painted over the torso, and
//   for hair that ends above the jaw the cheek and jaw swell past the skull there (lost profile). Absent = the plain back as before.

const mirrorX = (g: Pt, q: Pt): Pt => [2 * g[0] - q[0], q[1]];

/** Hood colour of an outfit (`gear.collar` of kind `hood`), or undefined when the outfit has no hood. */
export const hoodColorOf = (o: Outfit): string | undefined => (o.gear?.collar?.kind === 'hood' ? o.gear.collar.color : undefined);

/** The head style a hood-up figure wears: cut `hood` in the hood colour (the hair is covered). Used by the front and profile views. */
export const hoodUpHead = (head: HeadStyle, o: Outfit): HeadStyle => ({...head, cut: 'hood', hoodOpen: true, hood: hoodColorOf(o) ?? mixColor(o.shirt, INK, 0.2)});

const cap = (rx: number, ry: number, cy: number, n = 18): Pt[] =>
  Array.from({length: n + 1}, (_, i): Pt => {
    const a = Math.PI + (i / n) * Math.PI;
    return [rx * Math.cos(a), ry * Math.sin(a) + cy];
  });
const NAPE = (hem: number): Pt[] => [[0.97, 0.3], [0.88, 0.7], [0.46, hem], [0, hem + 0.04], [-0.46, hem], [-0.88, 0.7], [-0.97, 0.3]];
const arcBack = (rx: number, ry: number): Pt[] => Array.from({length: 17}, (_, i): Pt => [rx * Math.cos(Math.PI + (i / 16) * Math.PI), ry * Math.sin(Math.PI + (i / 16) * Math.PI) - 0.02]);

export const drawFigureBack = (p: Painter, def: CastDef, g: Pt, unit: number, pose: FigPose, t: number, seed = def.seed): FigAnchors => {
  void t;
  const o = def.outfit, G = o.gear, Ht = def.height;
  const HD = H * (def.headScale ?? 1), AB = BONE * (def.armScale ?? 1), sc = HD / H;
  const chin = Ht - HD, shV0 = chin - 0.16 * HD;
  const torso = (chin - 0.068) * 0.44;
  const hip0 = shV0 - torso + 0.034, crotch0 = hip0 - 0.0425, ankleV = 0.038, knee0 = (hip0 + ankleV) / 2;
  const sw = o.shoulder * HD, hw = 0.3 * HD, K = HD / HEAD_SPAN;
  const L = pose.light, sil = pose.silhouette;
  const rise = pose.rise ?? 0, lean = pose.lean ?? 0, stride = pose.stride ?? 1;
  const ph = (pose.walk ?? 0) * Math.PI * 2;
  const bob = pose.walk === undefined ? 0 : Math.abs(Math.sin(ph)) * 0.012 * stride;
  const shV = shV0 + rise;
  const skin = def.head.skin, skinShade = mixColor(skin, VD18.shadow, 0.2);

  const sitK = Math.max(0, Math.min(1, pose.sit ?? 0)), drop = sitK ? sitK * (hip0 - bodyFrame(def, {view: 'front', sit: 1}).hipV) : 0;
  // Body pose from behind (VA01): the front frame when crouch, kneel, floorSit or run is set; undefined = the old standing / walking / seated drawing.
  const fr = sitK ? undefined : bodyFrame(def, {...pose, view: 'front'});
  const pm = fr && (fr.mode || fr.c > 0) ? fr : undefined;
  const pmDrop = pm ? hip0 - pm.hipV + (pm.mode ? 0 : pm.bob) : 0, tS = pm ? pm.tScale : 1;
  // Back three-quarter (VA02, `FigPose.quarter` with view 'back'): the body is the back block turned by `quarterDeg` so it faces away and
  // toward the screen side named. Its width takes the turned footprint `kt` (as the front three-quarter); the side of the block shows on
  // that side in shade, the arm on that side is nearer the lens, and the head turns with a sliver of cheek past the hair (lost profile).
  const qb = quarterGeo(pose), kq = qb ? qb.kt : 1, qd = qb?.qdir ?? 1;
  /** Edge between the back plane and the side plane at half-width w (local u, before `kq`). */
  const udiv = (w: number) => (qb ? qd * w * (2 * qb.sf - 1) : 0);
  const S = ([u, v]: Pt): Pt => [g[0] + u * kq * unit, g[1] - (v + bob - drop - pmDrop) * unit];
  /** Picture point of an absolute body-frame point (the `pm` legs carry their own hip height). */
  const S0 = ([u, v]: Pt): Pt => [g[0] + u * kq * unit, g[1] - v * unit];
  /** Upper body: breath rise above the hip, then lean about the hip (toward screen right). */
  const U = ([u, v]: Pt): Pt => {
    const dv = (v - hip0) * tS + rise * Math.max(0, Math.min(1, (v - hip0) / (shV0 - hip0))), a = lean;
    return S([u * Math.cos(a) + dv * Math.sin(a), hip0 + dv * Math.cos(a) - u * Math.sin(a)]);
  };
  const Uq = (pts: Pt[]) => pts.map(U), Sq = (pts: Pt[]) => pts.map(S);
  /** Shoe at the ankle (local u, v): from behind the heel oval; turned (VA02) the foot points away toward the turned side, so the toe reaches
   *  past the heel on that side and a little up (farther from the lens). Built in picture proportions, then un-squeezed by `kq`. */
  const shoe = (x: number, y: number, s: number, k = 1): Pt[] => {
    if (!qb) return ell(x + s * 0.01, y - 0.012, 0.062 * k, 0.032 * k, 14);
    const rx = (0.062 * qb.cos + 0.1 * qb.sin) * k;
    return ell(0, 0, rx, 0.032 * k, 14, qd * 0.12).map(([u, v]): Pt => [x + (qd * (rx - 0.062 * k) * 0.85 + u) / kq, y - 0.012 + v]);
  };

  let part = 0, line = 0;
  const fill = (color: string, pts: Pt[], outline = true, passes = 4) => {
    const base = sil ?? toneOf(color, L);
    solid(p, seed * 1000 + ++part, base, pts, sil ? 8 : passes, sil ? 0.02 : L ? 0 : 0.07, sil ? 0.03 : 0.2);
    if (L && !sil) modelPart(p, seed * 1000 + part, base, pts, L);
    if (outline && !sil) inkLine(p, seed * 1000 + ++line, pts, {weight: L ? VD18.lineOuter : 1.0, color: lineOf(base, L)});
  };
  const stroke = (color: string, pts: Pt[], w = 0.8) => {
    if (!sil) inkLine(p, seed * 1000 + 400 + ++line, pts, {closed: false, weight: w, curve: 0.4, color: mixColor(toneOf(color, L), INK, 0.5)});
  };

  // Ground shadow like every figure (front and profile draw the same one).
  const sh = ell(g[0], g[1] + 0.01 * unit, 0.26 * (L ? 1.15 : 1) * unit, (L ? 0.07 : 0.06) * unit, 16);
  if (!pose.seated && !sitK && !L) washAt(p, seed * 1000 + 999, sil ?? '#1e2324', 70, sh, 0.5, 0.3);
  if (!pose.seated && !sitK && L) glaze(p, seed * 1000 + 999, '#0e1213', 120, sh, {border: 0.1, bleed: 0.15});

  // ------------------------------------------------------------------ legs, skirt, feet
  const bodyC = o.coat ?? o.jacket ?? o.shirt;
  // Skirt (VA05): the front view's straight cut, seen from behind: hip +-(hw + 0.0085), hem at the knee width +-(0.077 + 0.06) and 0.19 below the knee.
  const hemV = o.skirt ? o.skirtHem ?? knee0 - 0.19 : undefined, skTop = hw + 0.0085, skHem = 0.137;
  const wv = (s: number) => Math.max(0, Math.sin(ph + (s > 0 ? 0 : Math.PI))) * 0.05 * stride;
  /** Run legs of the back three-quarter (VA02): the front run only lifts the feet (no depth), so turned they spread at hip width like a
   *  straddle. Each leg takes its stride from the profile run at the same phase: side-to-side shrinks by cos(turn), the forward offset
   *  shows by sin(turn) toward the turned side (forward is away from the lens), heights blend toward the profile by sin(turn). The stride is
   *  kept to RUN_DEPTH of the profile's (the full sprint stride read as a lunge out of the skirt at 60 deg). Painted far leg first. */
  const RUN_DEPTH = 0.55;
  /** Skirt of a body pose seen from behind: hem height (absolute) and hem half-widths; the turned run (VA02) opens the hem over the knees. */
  const poseSkirt = () => {
    if (hemV === undefined || !pm) return undefined;
    // Running in a skirt keeps the standing hem below the dropped hip (a hem raised to the knee let the shins swing out of the sides).
    const h2 = pm.mode?.kind === 'run' ? hemV - pmDrop : Math.max(0.01, pm.hipV - 0.19);
    const kx = pm.mode?.kind === 'run' ? runLegs(pm.mode.legs).map((l) => l.knee[0]) : [];
    return {h2, hR: Math.max(skHem, ...kx.map((x) => x + 0.06)), hL: Math.min(-skHem, ...kx.map((x) => x - 0.06))};
  };
  function turnRun(legs0: PoseLeg[]) {
    const pr = bodyFrame(def, {...pose, view: 'right'}), pmode = pr.mode;
    if (!qb || !pm || !pmode) return legs0;
    const depth = RUN_DEPTH;
    const out = legs0.map((l) => {
      const sg = l.hip[0] >= 0 ? 1 : -1, lp = pmode.legs.find((q) => q.far === sg > 0) ?? pmode.legs[0];
      const pt = (f: Pt, q: Pt): Pt => [(f[0] * qb.cos + qd * qb.sin * depth * (q[0] - lp.hip[0])) / kq, f[1] + qb.sin * (q[1] - pr.hipV - (f[1] - pm.hipV))];
      const near = sg * qd * 0.0725 * qb.sin - (lp.knee[0] - lp.hip[0]) * qb.cos;
      return {leg: {...l, hip: pt(l.hip, lp.hip), knee: pt(l.knee, lp.knee), ankle: pt(l.ankle, lp.ankle)}, near};
    });
    // The lowest foot stays where the front run puts it (on the ground): the shift goes to the ankles in full and the knees in half.
    const dv = Math.min(...legs0.map((l) => l.ankle[1])) - Math.min(...out.map((x) => x.leg.ankle[1]));
    return out.map((x) => ({...x, leg: {...x.leg, knee: [x.leg.knee[0], x.leg.knee[1] + dv / 2] as Pt, ankle: [x.leg.ankle[0], x.leg.ankle[1] + dv] as Pt}}))
      .sort((x, y) => x.near - y.near).map((x) => x.leg);
  }
  type PoseLeg = {hip: Pt; knee: Pt; ankle: Pt; far: boolean; hide?: boolean};
  /** Run legs as painted: turned in the back three-quarter (VA02). A skirt's short step comes from `bodyFrame` (SARONG_STEP), as in every view. */
  const runLegs = (legs0: PoseLeg[]): PoseLeg[] => (qb ? turnRun(legs0) : legs0);
  /** Legs of a body pose seen from behind (VA01): the front frame's hip, knee and ankle per leg (crouch legs as the front view draws them). */
  function paintPoseLegs() {
    if (!pm) return;
    const legs0 = pm.mode ? pm.mode.legs : ([-1, 1] as const).map((s) => {
      const ankle: Pt = [s * (0.08 + 0.05 * pm.c), ankleV];
      return {hip: [s * 0.0725, pm.hipV] as Pt, knee: [s * (0.077 + 0.17 * pm.c), lerp((pm.hipV + ankle[1]) / 2, 0.46, pm.c)] as Pt, ankle, far: false, hide: false};
    });
    const legs = pm.mode?.kind === 'run' ? runLegs(legs0) : legs0;
    // The torso back (translucent wash) reaches down to this height and out to this half-width: a thigh starts where it leaves that block, so no
    // trouser colour shows through the cloth (the same reason as the standing thigh top below).
    const hemAbs = pm.hipV - 0.07 * tS, halfW = hw + 0.024;
    // Running in a skirt: the skirt cloth is translucent too, so the leg starts where it leaves the skirt (a leg under it showed through).
    const sk = pm.mode?.kind === 'run' ? poseSkirt() : undefined, skTopAbs = hip0 + 0.034 - pmDrop;
    const inSkirt = ([u, v]: Pt) => {
      if (!sk || v < sk.h2 || v > skTopAbs) return false;
      const k = (v - sk.h2) / Math.max(0.01, skTopAbs - sk.h2);
      return u > lerp(sk.hL, -skTop, k) && u < lerp(sk.hR, skTop, k);
    };
    const inside = ([u, v]: Pt) => (Math.abs(u) < halfW && v > hemAbs) || inSkirt([u, v]);
    const sole = mixColor(o.shoes, '#d8ccb6', 0.45);
    for (const l of legs) {
      const s = l.hip[0] >= 0 ? 1 : -1;
      const pc = mixColor(o.pants, '#000000', s > 0 ? 0.05 : 0);
      let k0 = 0;
      while (k0 < 1 && inside([l.hip[0] + (l.knee[0] - l.hip[0]) * k0, l.hip[1] + (l.knee[1] - l.hip[1]) * k0])) k0 += 0.05;
      const top: Pt = [l.hip[0] + (l.knee[0] - l.hip[0]) * k0, l.hip[1] + (l.knee[1] - l.hip[1]) * k0];
      if (k0 < 0.95) fill(pc, limb(top, l.knee, 0.105, 0.095).map(S0));
      if (!inSkirt(l.knee)) fill(pc, ell(l.knee[0], l.knee[1], 0.052, 0.052, 12).map((q) => S0(q as Pt)), false);
      let k1 = 0;
      while (k1 < 1 && inSkirt([l.knee[0] + (l.ankle[0] - l.knee[0]) * k1, l.knee[1] + (l.ankle[1] - l.knee[1]) * k1])) k1 += 0.05;
      const shinTop: Pt = [l.knee[0] + (l.ankle[0] - l.knee[0]) * k1, l.knee[1] + (l.ankle[1] - l.knee[1]) * k1];
      if (l.hide) {
        // Kneeling: the shin lies on the ground toward the lens, so it shows as a short block under the knee ending in the sole.
        // The soles face the lens, heels up and toes pointing in: tall pale ovals with a heel line, so they do not read as standing shoes.
        const foot: Pt = [l.knee[0] * 0.75, -0.005];
        fill(pc, limb(l.knee, [foot[0], foot[1] + 0.05], 0.095, 0.085).map(S0));
        fill(sole, ell(foot[0], foot[1], 0.046, 0.08, 14, s * 0.18).map((q) => S0(q as Pt)));
        stroke(sole, [S0([foot[0] - 0.03, foot[1] + 0.035]), S0([foot[0] + 0.03, foot[1] + 0.035])], 0.7);
        continue;
      }
      if (o.shorts) {
        const at = (k: number): Pt => [l.knee[0] + (l.ankle[0] - l.knee[0]) * k, l.knee[1] + (l.ankle[1] - l.knee[1]) * k];
        fill(skin, limb(at(0.1), l.ankle, 0.088, 0.066).map(S0));
        fill(o.shorts.sock, limb(at(0.84), [l.ankle[0], l.ankle[1] - 0.005], 0.07, 0.066).map(S0));
      } else if (k1 < 0.95) fill(pc, limb(shinTop, l.ankle, lerp(0.095, 0.08, k1), 0.08).map(S0));
      fill(o.shoes, shoe(l.ankle[0], l.ankle[1], s).map(S0));
      // A foot off the ground (run) shows its sole from behind.
      if (l.ankle[1] > ankleV + 0.04) fill(sole, ell(l.ankle[0] + s * 0.01, l.ankle[1] - 0.03, 0.05, 0.03, 12).map((q) => S0(q as Pt)), false);
    }
    // Run in trousers (VA02): the seat joins the striding thigh tops below the hem (without it the legs hung off the hem apart).
    if (pm.mode?.kind === 'run' && !o.skirt) {
      const G0 = (pts: Pt[]) => pts.map(([u, v]) => S0([u, Math.max(0.005, v - pmDrop)]));
      fill(o.pants, G0([[-hw - 0.02, hip0 - 0.06], [hw + 0.02, hip0 - 0.06], [hw + 0.016, hip0 - 0.14], [0.02, hip0 - 0.185], [-0.02, hip0 - 0.185], [-hw - 0.016, hip0 - 0.14]]));
      stroke(o.pants, G0([[0, hip0 - 0.075], [0, hip0 - 0.18]]), 0.7);
    }
    // Low hips (crouch, kneel, floor): the seat shows below the back, over the thigh tops.
    if (pm.mode?.kind !== 'run' && (pm.c > 0.3 || pm.mode)) {
      const pc = o.skirt ?? o.pants;
      // Never below the ground (floor sit): the seat flattens onto it.
      const G0 = (pts: Pt[]) => pts.map(([u, v]) => S0([u, Math.max(0.005, v - pmDrop)]));
      fill(pc, G0([[-hw - 0.024, hip0 - 0.05], [hw + 0.024, hip0 - 0.05], [hw + 0.03, hip0 - 0.12], [hw + 0.012, hip0 - 0.17], [-hw - 0.012, hip0 - 0.17], [-hw - 0.03, hip0 - 0.12]]));
      stroke(pc, G0([[0, hip0 - 0.07], [0, hip0 - 0.17]]), 0.8);
    }
  }
  if (sitK) { // seated: the pelvis block on the seat, no legs (they run away from the lens)
    const pc = o.skirt ?? o.pants;
    fill(pc, Sq([[-hw - 0.024, hip0 - 0.05], [hw + 0.024, hip0 - 0.05], [hw + 0.03, hip0 - 0.12], [hw + 0.012, hip0 - 0.17], [-hw - 0.012, hip0 - 0.17], [-hw - 0.03, hip0 - 0.12]]));
    stroke(pc, Sq([[0, hip0 - 0.07], [0, hip0 - 0.17]]), 0.8);
  }
  if (pm) paintPoseLegs();
  for (const s of sitK || pm ? ([] as (-1 | 1)[]) : qb ? ([-qd, qd] as (-1 | 1)[]) : ([-1, 1] as const)) {
    const lift = pose.walk === undefined ? 0 : wv(s);
    // Late turn (60..75 deg, `QuarterGeo.late`): the legs are round, so their centres close in by cos (kr after kt) and their width stops
    // foreshortening, toward the profile's legs together (at 75 deg two thin legs stood apart with a gap; 13 Nov 2026).
    const lb = qb?.late ?? 0, cS = lerp(1, qb?.kr ?? 1, lb), wS = lerp(1, 1 / kq, lb);
    const hip: Pt = [s * 0.0725 * sc * cS, hip0], ankle: Pt = [s * 0.085 * sc * cS, ankleV + lift], knee: Pt = [s * 0.08 * sc * cS, (hip0 + ankleV) / 2 + lift / 2];
    const pc = mixColor(o.pants, '#000000', s > 0 ? 0.05 : 0);
    // The thigh starts where the torso hem ends (hip0 - 0.07), not at hip0: the 7 cm above lay under the translucent torso and showed through it
    // as two dark blocks across the hem (4 Nov 2026, bug: YOU2 back). The visible edges are the same lines; the ids and the lower part are unchanged.
    const tt = 0.07 / Math.max(0.1, hip[1] - knee[1]), top: Pt = [hip[0] + (knee[0] - hip[0]) * tt, hip[1] + (knee[1] - hip[1]) * tt];
    fill(pc, Sq(limb(top, knee, (0.11 + (0.095 - 0.11) * tt) * sc * wS, 0.095 * sc * wS)));
    if (o.shorts) {
      const at = (k: number): Pt => [knee[0] + (ankle[0] - knee[0]) * k, knee[1] + (ankle[1] - knee[1]) * k];
      fill(skin, Sq(limb(at(0.1), ankle, 0.088 * sc, 0.066 * sc)));
      fill(o.shorts.sock, Sq(limb(at(0.84), [ankle[0], ankle[1] - 0.005], 0.07 * sc, 0.066 * sc)));
      fill(pc, Sq(limb(knee, at(0.16), 0.095 * sc, 0.1 * sc)));
    } else fill(pc, Sq(limb(knee, ankle, 0.095 * sc * wS, 0.08 * sc * wS)));
    const sc2 = o.boots ? mixColor(o.shoes, '#000000', 0.1) : o.shoes;
    if (o.boots) fill(sc2, Sq(limb([ankle[0], ankle[1] + 0.1], ankle, 0.085 * sc, 0.08 * sc)));
    fill(o.shoes, Sq(shoe(ankle[0], ankle[1], s, sc)));
  }
  // The pelvis block (hip0 + 0.03 down to the crotch) lies wholly under the torso (which reaches hip0 - 0.07): painted, it showed the trouser
  // colour through the translucent hoodie as a dark band across the hem (4 Nov 2026, bug: YOU2 back; the thigh tops below were the other half).
  // The part number is kept so every later mark keeps its seed.
  part++;
  void crotch0;

  // ------------------------------------------------------------------ arms
  // Right arm = screen right. Arms that stay below the shoulder line go under the torso and hood; raised ones are painted last.
  // Back three-quarter (VA02): the arms sit on the turned body's shoulder axis (width cos, not the block's `kt`): the near arm (turned side)
  // hangs over the side plane, the far one is pulled in behind the back so only its edge and hand show.
  const armK = (s: -1 | 1) => (qb ? qb.kr * (s === qd ? 1 : 0.85) : 1);
  const shoulderOf = (s: -1 | 1): Pt => U([s * (sw - 0.02) * armK(s), shV0 - 0.03]);
  const armGeom = (s: -1 | 1, a?: FigPose['rArm']) => {
    const Sh = shoulderOf(s), Lpx = AB * unit;
    let T: Pt, E: Pt;
    if (a) {
      T = mirrorX(g, a.to);
      if (qb) T = [g[0] + (T[0] - g[0]) * kq * armK(s), T[1]];
      const d = Math.hypot(T[0] - Sh[0], T[1] - Sh[1]), m = 2 * Lpx - 0.5;
      if (d > m) T = [Sh[0] + ((T[0] - Sh[0]) * m) / d, Sh[1] + ((T[1] - Sh[1]) * m) / d];
      // Back three-quarter: the elbow is solved on the flat arm and foreshortened with it, so the arm keeps its shape. Solved on the pulled-in
      // points, a hanging arm came out shorter than its bones and the IK bent both elbows out like hands on hips (70-75 deg, 13 Nov 2026).
      const fx = (q: Pt): Pt => [g[0] + (q[0] - g[0]) * kq * armK(s), q[1]];
      if (a.via) E = fx(mirrorX(g, a.via));
      else if (qb) {
        const k = kq * armK(s), Sh0: Pt = [g[0] + (Sh[0] - g[0]) / k, Sh[1]], T0 = mirrorX(g, a.to);
        const d0 = Math.hypot(T0[0] - Sh0[0], T0[1] - Sh0[1]), T1: Pt = d0 > m ? [Sh0[0] + ((T0[0] - Sh0[0]) * m) / d0, Sh0[1] + ((T0[1] - Sh0[1]) * m) / d0] : T0;
        E = fx(ikElbow(Sh0, T1, Lpx, s));
        T = fx(T1);
      } else E = ikElbow(Sh, T, Lpx, s);
    } else if (pm?.mode?.kind === 'run') {
      // Run from behind (VA06): the arms pump opposite to the legs, as the front `runArm` (same phase; the character's right is screen
      // right here). The arm swinging forward goes away from the lens: the upper arm hangs, the forearm rises into the chest and hides
      // under the torso. The arm swinging back comes toward the lens: it hangs low and out and is painted over the torso (`near`).
      const th = (pose.run ?? 0) * Math.PI * 2 + (s > 0 ? Math.PI : 0), fw0 = 0.5 + 0.5 * Math.sin(th), fw = fw0 * fw0 * (3 - 2 * fw0);
      E = [Sh[0] + s * lerp(0.07, 0.035, fw) * unit, Sh[1] + lerp(0.72, 0.86, fw) * AB * unit];
      T = [E[0] + s * lerp(0.01, -0.07, fw) * unit, E[1] + lerp(0.6, 0.2, fw) * AB * unit];
      if (!qb) return {Sh, E, T, raised: false, near: fw < 0.5};
      // Back three-quarter (VA02): the swing is forward and back, as the profile `runArm` at a jog (upper arm al, forearm be from the vertical; the sprint angles lifted the hand over the shoulder), so
      // turned it shows sideways by sin(turn) toward the turned side; the back-only drawing above only shortened it (the arm read short at 240).
      const al = 0.6 * Math.sin(th), be = al + 1.1 + 0.2 * Math.max(0, Math.sin(th)), fx = qd * Math.sign(U([1, shV0])[0] - U([0, shV0])[0]) * qb.sin;
      const E2: Pt = [Sh[0] + (s * 0.04 * armK(s) + fx * AB * Math.sin(al)) * unit, Sh[1] + AB * Math.cos(al) * unit];
      const T2: Pt = [E2[0] + fx * AB * Math.sin(be) * unit, E2[1] + AB * Math.cos(be) * unit];
      const w = Math.min(1, qb.sin * 2);
      return {Sh, E: [lerp(E[0], E2[0], w), lerp(E[1], E2[1], w)] as Pt, T: [lerp(T[0], T2[0], w), lerp(T[1], T2[1], w)] as Pt, raised: false, near: s === qd};
    } else {
      T = U([s * (sw + 0.015) * armK(s), shV0 - 0.49 * (AB / BONE)]);
      E = ikElbow(Sh, T, Lpx, s);
    }
    // Back three-quarter: the arm on the turned side hangs beside the side plane, nearer the lens than the back.
    return {Sh, E, T, raised: T[1] < U([0, shV0])[1] - 0.12 * unit, near: !!qb && s === qd};
  };
  const paintArm = (s: -1 | 1, a: ReturnType<typeof armGeom>) => {
    const M: Pt = [(a.Sh[0] + a.E[0]) / 2, (a.Sh[1] + a.E[1]) / 2];
    fill(o.sleeve, capsule(a.Sh, a.E, 0.078 * unit * sc, 0.07 * unit * sc));
    fill(o.longSleeves ? o.sleeve : skin, capsule(a.E, a.T, 0.056 * unit * sc, 0.046 * unit * sc), true, 4);
    const dx = a.T[0] - a.E[0], dy = a.T[1] - a.E[1], d = Math.hypot(dx, dy) || 1;
    const hand: Pt = [a.T[0] + (dx / d) * 0.03 * unit * sc, a.T[1] + (dy / d) * 0.03 * unit * sc];
    fill(skinShade, ell(hand[0], hand[1], 0.036 * unit * sc, 0.046 * unit * sc, 14, Math.atan2(dy, dx) - Math.PI / 2), true, 4);
    void M;
    return hand;
  };
  const rG = armGeom(1, pose.rArm), lG = armGeom(-1, pose.lArm);
  let rHand: Pt = rG.T, lHand: Pt = lG.T;
  if (!rG.raised && !rG.near) rHand = paintArm(1, rG);
  if (!lG.raised && !lG.near) lHand = paintArm(-1, lG);

  // ------------------------------------------------------------------ torso back
  const bodyPts: Pt[] = [[-sw + 0.017, shV0 - 0.02], [-0.07, shV0 + 0.005], [0.07, shV0 + 0.005], [sw - 0.017, shV0 - 0.02], [sw + 0.005, shV0 - 0.07], [hw + 0.02, hip0 - 0.02], [hw + 0.024, hip0 - 0.07], [-hw - 0.024, hip0 - 0.07], [-hw - 0.02, hip0 - 0.02], [-sw - 0.005, shV0 - 0.07]];
  fill(bodyC, Uq(bodyPts));
  // The shirt below the skirt top is covered by the skirt (painted after it), so its shaded side stops there.
  const shirtPlane = hemV === undefined ? bodyPts : [...bodyPts.slice(0, 5), [hw + 0.02, hip0 + 0.034] as Pt, [-hw - 0.02, hip0 + 0.034] as Pt, bodyPts[9]];
  const planeShapes: {pts: Pt[]; color: string}[] = [{pts: Uq(shirtPlane), color: bodyC}];
  if (hemV !== undefined && !pm) {
    const hk = lerp(1, SKIRT_LATE, qb?.late ?? 0); // late turn: the hem flares to the profile skirt's width (cast.ts SKIRT_LATE)
    const sk = [U([-skTop, hip0 + 0.034]), U([skTop, hip0 + 0.034]), S([hk * skHem, hemV]), S([-hk * skHem, hemV])];
    fill(o.skirt!, sk);
    planeShapes.push({pts: sk, color: o.skirt!});
  }
  if (hemV !== undefined && pm) {
    // Low hips: the skirt covers the seat; running: it keeps its length below the dropped hip.
    const {h2, hR, hL} = poseSkirt()!;
    const sk = [U([-skTop, hip0 + 0.034]), U([skTop, hip0 + 0.034]), S0([hR, h2]), S0([hL, h2])];
    fill(o.skirt!, sk);
    planeShapes.push({pts: sk, color: o.skirt!});
  }
  stroke(bodyC, Uq([[-sw + 0.03, shV0 - 0.08], [0, shV0 - 0.1], [sw - 0.03, shV0 - 0.08]]));
  const spine = qb ? qd * sw * (qb.sf - 1) * 0.5 : 0;
  stroke(bodyC, Uq([[spine, shV0 - 0.1], [spine + 0.004, hip0 - 0.05]]), 0.7);
  if (G?.overcoat) {
    const hem = Math.min(G.overcoat.hem, knee0 + 0.12);
    // With a body pose the hem drops with the hip (absolute height, never below the ground).
    const SH = pm ? ([u, v]: Pt) => S0([u, Math.max(0.02, v - pmDrop)]) : S;
    fill(G.overcoat.color, [...Uq([[-sw + 0.017, shV0 - 0.02], [sw - 0.017, shV0 - 0.02], [sw + 0.0085, shV0 - 0.0425]]), SH([hw + 0.1, hem]), SH([-hw - 0.1, hem]), U([-sw - 0.0085, shV0 - 0.0425])]);
    stroke(G.overcoat.color, [U([0, shV0 - 0.1]), SH([0, hem])], 0.7);
  }
  if (G?.drape) fill(G.drape, Uq([[-sw + 0.017, shV0], [0.04, shV0 - 0.005], [sw - 0.017, shV0 - 0.05], [0.05, hip0 - 0.02], [-hw - 0.01, hip0 + 0.02]]));
  if (G?.belt) {
    const h = G.belt.h ?? 0.035, v0 = hip0 - 0.015 + h, v1 = hip0 - 0.015;
    fill(G.belt.color, Uq([[-hw - 0.012, v0], [hw + 0.012, v0], [hw + 0.012, v1], [-hw - 0.012, v1]]));
  }
  if (o.apron) stroke(o.apron, Uq([[-hw, hip0 + 0.01], [0, hip0 - 0.01], [hw, hip0 + 0.01]]), 1.2);
  if (G?.pack) fill(G.pack, Uq([[-0.2 * sc, shV0 - 0.02], [0.2 * sc, shV0 - 0.02], [0.2 * sc, shV0 - 0.3], [-0.2 * sc, shV0 - 0.3]]));
  // Back three-quarter (VA02): the side of the block beyond the edge between the planes is in shade (each cloth in its own colour), with a fold line.
  if (qb && !sil) {
    const D1 = U([udiv(sw), shV0 - 0.034]), D2 = U([udiv(hw + 0.013), hip0]), N = U([qd * sw, shV0 - 0.034]);
    planeShapes.forEach(({pts, color}, i) => {
      const part2 = clipHalf(pts, D1, D2, N);
      if (part2.length > 2) glaze(p, 7_710_000 + seed * 1000 + i, mixColor(color, '#0a0d12', 0.3), 140 + 60 * qb.sin, part2, {border: 0.12, bleed: 0.02});
    });
    inkLine(p, seed * 1000 + 451, [D1, D2], {closed: false, weight: 0.8, curve: 0.2, color: mixColor(toneOf(bodyC, L), INK, 0.55)});
  }
  // Run (VA06): the arm swinging back is nearer the lens than the torso.
  if (rG.near) rHand = paintArm(1, rG);
  if (lG.near) lHand = paintArm(-1, lG);
  // Neck, nape and collar band.
  const pts4 = (f: (q: Pt) => Pt, a: Pt[]) => a.map(f);
  const hcBase = U([0, chin + CHIN * K]);
  const nod = pose.nod ?? [0, 0];
  const hc: Pt = [hcBase[0] + nod[0] * K * unit, hcBase[1] - nod[1] * K * unit];
  const k = K * unit;
  // Head-only size (FigPose.headSize, pitchCue perspective): the head grows about the chin; neck, collar and shoulders keep their size.
  const hs = pose.headSize ?? 1, kh = k * hs;
  const hcH: Pt = hs === 1 ? hc : (([x, y]: Pt): Pt => [x + nod[0] * K * unit, y - nod[1] * K * unit])(U([0, chin + CHIN * K * hs]));
  // Head turn / tilt (`headYaw` radians toward screen right, `headTilt` radians up): the skull narrows by cos(yaw) and slides toward
  // the turn, the whole head lifts with the tilt (hood top rises, the nape gap opens); the neck and shoulders stay put.
  const yaw = pose.headYaw ?? 0, tilt = pose.headTilt ?? 0, cy = Math.cos(yaw), lift = tilt * 0.62;
  // Body pose (VA01): the neck stays on the collar when the head bows (P35 nods down); the head alone moves. Old poses: the neck follows the nod as before.
  const hcN = pm ? hcBase : hc;
  const neck = ([u, v]: Pt): Pt => [hcN[0] + u * k, hcN[1] + v * k];
  // A crouched torso is shorter, so the neck block would reach past the collar onto the back: it stops at the collar (body poses only).
  const neckLow = pm ? Math.min(1.6, Math.max(0.6, (U([0, shV0 + 0.02])[1] - hcN[1]) / k)) : 1.6;
  // Head cock (FigPose.headCock, degrees toward screen right): the head points rotate about the neck top (0.051 m above the chin on the
  // centre line, as the front view); neck(), the cowl's lower edge and the shoulders stay. Absent or 0 = the unrotated mapping.
  const cock = pose.headCock ? (pose.headCock * Math.PI) / 180 : 0;
  const pivot: Pt = [hcH[0], hcH[1] + (CHIN * hs - 0.051 / K) * k];
  const rotHead = ([x, y]: Pt): Pt => cock === 0 ? [x, y] : [pivot[0] + (x - pivot[0]) * Math.cos(cock) - (y - pivot[1]) * Math.sin(cock), pivot[1] + (x - pivot[0]) * Math.sin(cock) + (y - pivot[1]) * Math.cos(cock)];
  // Back three-quarter (VA02): the skull sits behind the neck, so it slides away from the turn (the neck shows on the turned side).
  const qShift = qb ? -qd * 0.07 * qb.sin : 0;
  const head = ([u, v]: Pt): Pt => rotHead([hcH[0] + (u * cy + 0.3 * Math.sin(yaw) + qShift) * kh, hcH[1] + (v - lift) * kh]);
  const H2 = (pts: Pt[]) => pts.map(head);
  // softNeck (EDU-EP01 W5.4): the caller paints its own nape and collar, so the rig's neck block (its lower edge showed as a bar on the shirt) is skipped
  if (!pose.softNeck) fill(pose.hoodUp && pose.cowl !== 'drape' ? (hoodColorOf(o) ?? mixColor(o.shirt, INK, 0.2)) : o.coat ?? skinShade, pts4(neck, [[-0.5, 0.5], [0.5, 0.5], [0.46, neckLow], [-0.46, neckLow]]), true, 4);
  fill(mixColor(o.shirt, '#ffffff', 0.08), Uq([[-0.075, shV0 - 0.005], [0.075, shV0 - 0.005], [0.07, shV0 + 0.025], [-0.07, shV0 + 0.025]]), true, 4);

  // Hood down: the hood bunched on the upper back, seam down the middle.
  const col = G?.collar, hoodUp = !!pose.hoodUp;
  const hoodR = hoodUp || col?.kind !== 'hood' ? 0 : Math.max(0, Math.min(1, pose.hoodRise ?? 0));
  if (col?.kind === 'hood' && !hoodUp && hoodR < 0.98) {
    // The bunch flattens as the hood leaves it (`hoodRise`): its height shrinks about the neck line.
    const bv = (v: number) => shV0 + 0.03 + (v - shV0 - 0.03) * (1 - hoodR);
    fill(col.color, Uq([[-0.115, shV0 + 0.03], [-0.15, bv(shV0 - 0.06)], [-0.1, bv(shV0 - 0.19)], [0, bv(shV0 - 0.22)], [0.1, bv(shV0 - 0.19)], [0.15, bv(shV0 - 0.06)], [0.115, shV0 + 0.03], [0.04, bv(shV0 + 0.012)], [-0.04, bv(shV0 + 0.012)]]), true, 6);
    stroke(col.color, Uq([[0, bv(shV0 + 0.012)], [0, bv(shV0 - 0.2)]]), 0.8);
  }

  // ------------------------------------------------------------------ head from behind
  const style = def.head, cut = style.cut;
  const nc = isNewCut(cut) ? hairFront(cut) : null;
  const coveredHair = hoodUp || cut === 'hood';
  const earSides: (-1 | 1)[] = coveredHair || cut === 'bob' || cut === 'long' ? [] : nc ? nc.ears : cut === 'short' || cut === 'tied' ? [-1, 1] : [];
  // Back three-quarter (VA02): the near ear is painted on the hairline after the hair (below).
  for (const s of earSides) if (!qb) fill(s < 0 ? skin : skinShade, H2(ell(s * 0.98, 0.16, 0.17, 0.3, 12).map((q) => q as Pt)), true, 4);
  fill(skin, H2(headOutline(40).map(([u, v]): Pt => [u * 0.99, v])), true, 8);
  const hairBase = nc?.tone ? mixColor(style.hair, skin, nc.tone) : style.hair;
  // Lost profile (VA02): the hair covers the back of the skull only. On the turned side it stops at the hairline in front of the ear, which
  // the turn carries in to cos(turn) of the skull width; the face beyond it shows as skin. The crown (above the temple) and, for hair that
  // falls past the jaw, the hang below it keep their full shape. `hq` clamps a hair polygon to that line (densified so the cut is a curve).
  const rhoH = (v: number) => Math.sqrt(Math.max(0, 1 - (v / 1.22) ** 2));
  const hairX = (v: number, hang: boolean) => {
    const free = Math.min(1, Math.max(0, (-0.2 - v) / 0.4));
    // Hair that hangs past the jaw falls straight below it on the turned side (the neck and shoulder show in front of it).
    const r = hang ? Math.max(rhoH(v), rhoH(0.9)) : rhoH(v);
    return lerp(r * (qb?.cos ?? 1) * 0.97, 3, free);
  };
  const hq = (pts: Pt[], hang = false, open = false, vol = false): Pt[] => {
    if (!qb) return pts;
    // Volume hair (curly, perm): the turned-side half of the cloud is squeezed toward the centre, smoothly from the crown down (a cut would
    // stack its scallops onto one line, and the brush spline hooks there); it keeps its scallops and stays a little off the hairline.
    if (vol) {
      const fMin = (rhoH(0.2) * qb.cos * 0.97 + 0.12) / 1.3, sm = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
      return pts.map(([u, v]): Pt => (qd * u > 0 ? [u * (1 - (1 - fMin) * sm((v + 1.0) / 1.3)), v] : [u, v]));
    }
    const d = open ? pts : pts.flatMap((a, i) => {
      const b = pts[(i + 1) % pts.length];
      // Only edges on the turned side are split: extra points elsewhere change how the brush outline boils (a pale ghost edge, 13 Nov 2026).
      if (qd * a[0] <= 0 && qd * b[0] <= 0) return [a];
      return [0, 1, 2, 3].map((j): Pt => [a[0] + ((b[0] - a[0]) * j) / 4, a[1] + ((b[1] - a[1]) * j) / 4]);
    });
    const cut0 = d.map(([u, v]) => qd * u > hairX(v, hang));
    const out = d.map(([u, v], i): Pt => (cut0[i] ? [qd * hairX(v, hang), v] : [u, v]));
    if (open) return out;
    // The closed outline starts on the hairline: started on the far side, the brush spline drew a pale ghost edge there (13 Nov 2026).
    const i0 = Math.max(0, cut0.indexOf(true));
    return [...out.slice(i0), ...out.slice(0, i0)];
  };
  /** A hair shape, clamped to the hairline when turned. Its outline is one open stroke along the clamped shape: the closed brush spline
   *  drew a pale ghost edge on the far side of some clamped shapes (13 Nov 2026). */
  const hairFill = (color: string, pts: Pt[], hang = false, vol = false) => {
    if (!qb) return fill(color, H2(pts), true, 6);
    const c = H2(hq(pts, hang, false, vol));
    fill(color, c, false, 6);
    if (!sil) inkLine(p, seed * 1000 + ++line, [...c, c[0]], {closed: false, weight: L ? VD18.lineOuter : 1.0, color: lineOf(sil ?? toneOf(color, L), L)});
  };
  if (hoodUp) {
    const hc2 = hoodColorOf(o) ?? mixColor(o.shirt, INK, 0.2);
    const hood: Pt[] = [...arcBack(1.32, 1.46).map(([u, v]): Pt => [u, v - 0.02]), [1.3, 0.55], [1.16, 1.12], [0.7, 1.3], [0, 1.34], [-0.7, 1.3], [-1.16, 1.12], [-1.3, 0.55]];
    // Cowl: the hood's lower cloth gathers into a collar that falls over the nape and neck to the shoulders (the hoodie's own cloth, so the
    // hood does not sit on the head as a ball). Its top edge is on the head (follows the tilt) and overlaps the hood hem; the lower corners are
    // the arm roots. Folds: a dark crease along the gather, a seam each side of the neck, a centre fold.
    fill(hc2, H2(hood), true, 8);
    const dk = mixColor(hc2, INK, 0.4);
    if (pose.cowl === 'drape') {
      const cw = mixColor(hc2, '#ffffff', 0.05), shR = shoulderOf(1), shL = shoulderOf(-1);
      fill(cw, [head([-1.06, 0.9]), head([-0.55, 1.0]), head([0, 1.04]), head([0.55, 1.0]), head([1.06, 0.9]), neck([1.35, 1.35]), neck([1.7, 1.7]), shR, shL, neck([-1.7, 1.7]), neck([-1.35, 1.35])], true, 8);
      stroke(dk, H2([[-1.08, 0.9], [-0.55, 1.0], [0, 1.04], [0.55, 1.0], [1.08, 0.9]]), 1.3);
      stroke(dk, [head([-0.55, 1.0]), neck([-0.8, 1.7]), neck([-1.0, 2.6])], 0.9);
      stroke(dk, [head([0.55, 1.0]), neck([0.8, 1.7]), neck([1.0, 2.6])], 0.9);
      stroke(dk, [head([0, 1.04]), neck([0.03, 1.8]), neck([0, 2.6])], 0.8);
    }
    stroke(dk, H2([[-1.08, 0.9], [-0.55, 1.0], [0, 1.04], [0.55, 1.0], [1.08, 0.9]]), 1.3);
    stroke(hc2, H2([[0, -1.4], [0.04, -0.4], [0, 0.5], [0, 1.28]]), 1.0);
    stroke(hc2, H2([[-1.1, 0.5], [-0.7, 1.1], [-0.3, 1.26]]), 0.8);
    stroke(hc2, H2([[1.1, 0.5], [0.7, 1.1], [0.3, 1.26]]), 0.8);
    if (yaw > 0.05) {
      // The turned hood opening: a thin crescent of cheek on the right edge (screen right), inside the rim.
      const w = Math.sin(yaw) * 0.42, edge = (v: number) => 1.3 - 0.18 * Math.abs(v - 0.3) ** 2;
      const vs = [-0.55, -0.3, -0.05, 0.2, 0.45, 0.7, 0.9];
      const outer = vs.map((v): Pt => [edge(v) * 1.0, v]), inner = vs.map((v): Pt => [edge(v) - w * Math.max(0.05, 1 - ((v - 0.15) / 0.8) ** 2), v]).reverse();
      fill(skinShade, H2([...outer, ...inner]), true, 7);
      stroke(mixColor(hc2, INK, 0.45), H2(inner.slice().reverse()), 0.9);
    }
  } else if (cut === 'hood') {
    const hc2 = style.hood ?? style.hair;
    fill(hc2, H2([...arcBack(1.32, 1.46), [1.3, 0.55], [1.16, 1.12], [0.7, 1.3], [0, 1.34], [-0.7, 1.3], [-1.16, 1.12], [-1.3, 0.55]]), true, 8);
    stroke(hc2, H2([[0, -1.4], [0.04, -0.4], [0, 0.5], [0, 1.28]]), 1.0);
  } else if (cut === 'balding') {
    hairFill(style.hair, [[-0.98, -0.1], [-0.92, 0.5], [-0.5, 0.88], [0.5, 0.88], [0.92, 0.5], [0.98, -0.1], [0.84, 0.3], [0.5, 0.62], [-0.5, 0.62], [-0.84, 0.3]]);
  } else if (cut === 'bob') {
    hairFill(style.hair, [...arcBack(1.14, 1.16), [1.16, 0.7], [0.86, 0.84], [0, 0.88], [-0.86, 0.84], [-1.16, 0.7]], true);
  } else if (cut === 'long') {
    hairFill(style.hair, [...arcBack(1.16, 1.18), [1.2, 0.6], [1.26, 1.3], [1.12, 1.72], [0.72, 1.62], [0, 1.66], [-0.72, 1.62], [-1.12, 1.72], [-1.26, 1.3], [-1.2, 0.6]], true);
  } else {
    // Cap over the skull down to a low nape hairline; big-volume cuts (curly, perm) use their own cloud outline; tails go on top.
    const volume = nc?.back && (cut === 'curly' || cut === 'perm') ? nc.back[0] : null;
    const crown: Pt[] = cut === 'bowl' ? [...cap(1.1, 1.14, -0.04), [0.99, 0.3], [0.8, 0.5], [0, 0.54], [-0.8, 0.5], [-0.99, 0.3]]
      : cut === 'pixie' ? [...cap(1.08, 1.13, -0.04), ...NAPE(0.9)]
      : [...cap(1.06, 1.1, -0.03), ...NAPE(1.0)];
    hairFill(hairBase, volume ?? crown, false, !!volume);
    if (cut === 'tied') fill(style.hair, H2(ell(0.05, -1.12, 0.32, 0.22, 18).map((q) => q as Pt)), true, 6);
    if (cut === 'ponytail') {
      fill(style.hair, H2([[-0.28, 0.2], [0.28, 0.2], [0.42, 1.2], [0.22, 1.74], [0, 1.84], [-0.22, 1.74], [-0.42, 1.2]]), true, 6);
      if (nc?.accent) fill(style.accent ?? '#c8573e', H2(ell(0, 0.28, 0.3, 0.1, 12).map((q) => q as Pt)), true, 6);
    }
    if (cut === 'pigtails') {
      nc?.back?.forEach((poly) => fill(style.hair, H2(poly), true, 6));
      nc?.accent?.forEach((poly) => fill(style.accent ?? '#c8573e', H2(poly), true, 6));
    }
    if (!volume) {
      const hairC = toneOf(hairBase, L);
      const strokes: Pt[][] = [[[-0.62, -0.6], [-0.8, 0.0]], [[-0.3, -0.75], [-0.4, 0.1]], [[0, -0.8], [0, 0.2]], [[0.3, -0.75], [0.4, 0.1]], [[0.62, -0.6], [0.8, 0.0]], [[-0.45, 0.35], [-0.38, 0.88]], [[0.45, 0.35], [0.38, 0.88]]];
      strokes.forEach((s, i) => inkLine(p, seed * 1000 + 600 + i, H2(hq(s, false, true)), {closed: false, weight: 0.6, curve: 0.4, color: mixColor(hairC, '#9aa7ae', 0.3)}));
    }
  }
  // Hood on its way up (`hoodRise` 0..1): the full hood shape squeezed vertically about the nape hem (v 1.34 in head units), so its rim
  // travels from the neck over the head with the hands; the hair shows above the rim until the hood covers it (hoodR 1 = hoodUp).
  if (hoodR > 0) {
    const hc2 = hoodColorOf(o) ?? mixColor(o.shirt, INK, 0.2), sv = 0.1 + 0.9 * hoodR, su = 0.75 + 0.25 * hoodR;
    const sq = (pts: Pt[]): Pt[] => pts.map(([u, v]): Pt => [u * su, 1.34 + (v - 1.34) * sv]);
    const hood: Pt[] = [...arcBack(1.32, 1.46).map(([u, v]): Pt => [u, v - 0.02]), [1.3, 0.55], [1.16, 1.12], [0.7, 1.3], [0, 1.34], [-0.7, 1.3], [-1.16, 1.12], [-1.3, 0.55]];
    fill(hc2, H2(sq(hood)), true, 8);
    stroke(hc2, H2(sq([[0, -1.4], [0.04, -0.4], [0, 0.5], [0, 1.28]])), 1.0);
  }
  if (qb && !coveredHair) {
    // Lost profile (VA02): cheek and jaw swell past the skull on the turned side (most at the jaw, with the turn), the jaw line runs from
    // under the ear to the chin, and the near ear sits on the hairline. Long and bob hair hang over the jaw, so they keep only the ear-less cheek.
    const bulge = (v: number) => 0.2 * qb.sin * Math.max(0, 1 - ((v - 0.78) / 0.5) ** 2);
    const outerX = (v: number) => rhoH(v) * 0.99 * (1 - 0.07 * Math.max(0, v / 1.22)) + bulge(v);
    const vs = [0.25, 0.4, 0.55, 0.7, 0.85, 0.98, 1.08, 1.16];
    const outer = vs.map((v): Pt => [qd * outerX(v), v]), inner = vs.map((v): Pt => [qd * rhoH(v) * 0.85, v]).reverse();
    fill(skin, H2([...outer, ...inner]), false, 6);
    inkLine(p, seed * 1000 + 452, H2(outer), {closed: false, weight: 0.9, curve: 0.3, color: lineOf(toneOf(skin, L), L)});
    const hang = cut === 'long' || cut === 'bob';
    if (!hang) {
      const xe = hairX(0.16, false);
      inkLine(p, seed * 1000 + 453, H2([[qd * (xe + 0.02), 0.44], [qd * lerp(xe, outerX(0.92), 0.45), 0.86], [qd * outerX(1.1) * 0.97, 1.1]]), {closed: false, weight: 0.7, curve: 0.4, color: mixColor(lineOf(toneOf(skin, L), L), toneOf(skin, L), 0.35)});
      fill(skinShade, H2(ell(qd * (xe + 0.03), 0.16, 0.12, 0.27, 12).map((q) => q as Pt)), true, 4);
    }
  }
  // Headwear from behind: the same hat parts as the front, taken without face-side details (dome over the crown).
  if (G?.hat) {
    for (const {tone, pts} of hatFront(G.hat.kind)) {
      // A cap seen from behind shows the crown and the back of the band: no badge, no visor shade (4 Nov 2026, bug: the front badge showed from behind).
      if (G.hat.kind === 'cap' && (tone === 'white' || tone === 'dark')) continue;
      const c = tone === 'main' ? G.hat.color : tone === 'band' ? G.hat.band ?? mixColor(G.hat.color, INK, 0.55) : tone === 'dark' ? mixColor(G.hat.color, INK, 0.6) : '#e8dcb0';
      fill(c, H2(pts), true, 6);
    }
  }

  // Raised arms last (hands at the head, e.g. pulling the hood).
  if (rG.raised) rHand = paintArm(1, rG);
  if (lG.raised) lHand = paintArm(-1, lG);

  const headTop = rotHead([hcH[0], hcH[1] - (hoodUp || cut === 'hood' ? 1.46 : 1.17 + 0.29 * hoodR) * kh])[1];
  return {
    head: rotHead(hcH), headTop, chin: rotHead([hcH[0], hcH[1] + CHIN * kh])[1], feet: g, rHand, lHand, rShoulder: rG.Sh, lShoulder: lG.Sh,
    rUpper: [(rG.Sh[0] + rG.E[0]) / 2, (rG.Sh[1] + rG.E[1]) / 2], lUpper: [(lG.Sh[0] + lG.E[0]) / 2, (lG.Sh[1] + lG.E[1]) / 2],
    top: headTop, bottom: g[1],
  };
};
