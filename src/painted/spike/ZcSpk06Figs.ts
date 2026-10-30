import type {PaintContext} from '../BrushCanvas';
import {mixColor, type Pt} from '../painter';
import type {Cast} from './CastSheet';
import {CHIN, FACES, headOutline, paintHead, type Face} from './FaceSheet';
import {ellipse} from './ProportionSheet';
import {paintHeadSide, rotated, type Paint} from './SideSheet';
import {
  castPolys, convexOf, footContact, footCtrl, FOOT_R, H6, handParts, hairStrands, headMark, ik2, K6, mid, paintPart, stubble, toeLines, toPx, tub,
  unitHU, washPaint, type Fig, type Hand, type HeadMark, type HU, type Part, type Place,
} from '../zcpaint/body6';
import {placeAt} from '../zcpaint/ctx';
import {castTone, cel, localTravel} from '../zcpaint/light';

// Film look spike SPK-ZCP-06 (30 Oct 2026; user: "ตัวละครมันดูเป็นหุ่นกระบอกอยู่" -> "6 หัวต่อ แต่เปลี่ยนชุด+เนื้อสี"). Spike only: no production
// plate imports this file. It rebuilds three 6-head figures (profile walk, seated hugging the knees, front close bust) in a costume that
// covers the limbs (open overshirt over a tee, sleeves to the wrist, long trousers), with thicker limb masses, and optionally a light brush
// texture in the cloth fills (`tex`). Variant C is the same costume on a chunkier 5.5-head build (`BUILD_C`). The decal heads, mitten and
// fist hands, the 20 deg B09 pitch and the cel two-tone painter (`paintPart`) are the production ones (body6.ts), unchanged.

/** Costume colours: the overshirt keeps his established teal so he stays recognisable; a warm grey tee shows in the open front. */
export type Costume = {over: string; tee: string; pants: string};
export const COSTUME: Costume = {over: '#2f5a5c', tee: '#cdc6b6', pants: '#474d55'};
export const COSTUME_DAY3: Costume = {over: '#2a5254', tee: '#c1b9a8', pants: '#444a51'};

/** Build: `hs` scales heights below the chin (chin at 5.0 x hs heads), `ws` scales widths and limb radii. 6 heads = {1, 1}. */
export type Build = {hs: number; ws: number};
export const BUILD_6: Build = {hs: 1, ws: 1};
/** Variant C: 5.5 heads (chin at 4.5 heads) and 8 % wider masses, the head unchanged. */
export const BUILD_C: Build = {hs: 0.9, ws: 1.08};

const kit = (b: Build) => {
  const Q = ([x, u]: HU): HU => [x * b.ws, u * b.hs];
  const T = (col: string, ctrl: HU[], r: number[], celH: number, extra: Partial<Pick<Part, 'far' | 'ink' | 'up'>> = {}) =>
    tub(col, ctrl.map(Q), r.map((v) => v * b.ws), celH, extra);
  const C = (col: string, ctrl: HU[], celH: number, extra: Partial<Pick<Part, 'far' | 'ink' | 'up'>> = {}) => convexOf(col, ctrl.map(Q), celH, extra);
  const Hd = (h: Hand): Hand => ({...h, w: Q(h.w)});
  /** Open ink strokes in a colour (folds, seams, cuffs), drawn over the parts. */
  const ink = (segs: HU[][], color: string, w = 0.8): Part => ({col: '', pts: [], cel: 0, draw: (p) => { for (const s of segs) p.ink(toPx(s.map(Q)), w, 0.5, color); }});
  return {Q, T, C, Hd, ink};
};
const fold = (col: string) => mixColor(cel(col), '#1d1a18', 0.25);

// --- profile walk (B04-SH01), facing +x ---------------------------------------------------------------------------------

/**
 * Profile walk, stride 1 (figSide's legs). CP-P03 (one arm swung back): the near arm swings back with the hand past the hip, the far arm
 * forward (opposite to the near leg). Trousers to the ankle, the overshirt hem over the hip joint, sleeves to the wrist with a cuff.
 */
export const sideWalkV = (c: Cast, k: Costume, b: Build, o: {face?: Face; cell?: number; stride?: number} = {}): Fig => {
  const {Q, T, C, Hd, ink} = kit(b);
  const sk = c.head.skin, a = 0.34 * (o.stride ?? 1), cell = o.cell ?? 0;
  const hip: HU = [0, 3.0];
  const kneeN: HU = [Math.sin(a) * 1.4, 3.0 - Math.cos(a) * 1.4], ankN: HU = [kneeN[0] - 0.12, 0.16];
  const kneeF: HU = [-Math.sin(a * 0.7) * 1.4, 3.0 - Math.cos(a * 0.7) * 1.4], ankF: HU = [kneeF[0] - 0.4, 0.24];
  const hemAt = (kn: HU, an: HU): HU => [an[0] + (kn[0] - an[0]) * 0.1, an[1] + (kn[1] - an[1]) * 0.1];
  const parts: Part[] = [];
  // Far arm, swung forward (all cel): a full sleeve to the wrist.
  const shF: HU = [0.04, 4.42], elF: HU = [0.3, 3.64], wrF: HU = [0.5, 2.9];
  parts.push(T(k.over, [shF, mid(shF, elF, 0.5), elF, wrF], [0.2, 0.195, 0.18, 0.16], 0, {far: true, up: true}));
  parts.push(...handParts(Hd({kind: 'mitten', w: wrF, dir: [0.4, -1], thumb: 1, forceCel: true}), sk));
  // Far trouser leg to the ankle and the far foot.
  parts.push(T(k.pants, [hip, mid(hip, kneeF, 0.5), kneeF, mid(kneeF, ankF, 0.5), hemAt(kneeF, ankF)], [0.29, 0.27, 0.235, 0.215, 0.2], 0, {far: true}));
  parts.push(T(sk, footCtrl(ankF, 0.1), FOOT_R, 0, {far: true}));
  // Seat block, near trouser leg, near foot.
  parts.push(C(k.pants, [[-0.44, 3.24], [0.32, 3.24], [0.4, 2.9], [0.34, 2.62], [-0.44, 2.6], [-0.48, 2.94]], 0.26));
  parts.push(T(k.pants, [hip, mid(hip, kneeN, 0.5), kneeN, mid(kneeN, ankN, 0.5), hemAt(kneeN, ankN)], [0.3, 0.28, 0.245, 0.22, 0.205], 0.16));
  parts.push(T(sk, footCtrl(ankN, 0), FOOT_R, 0.05));
  // Trouser folds: two at the back of the knee, the break over the instep.
  parts.push(ink([
    [[kneeN[0] - 0.16, kneeN[1] + 0.1], [kneeN[0] - 0.06, kneeN[1] + 0.02]],
    [[kneeN[0] - 0.18, kneeN[1] - 0.06], [kneeN[0] - 0.06, kneeN[1] - 0.1]],
    [[ankN[0] + 0.02, 0.42], [ankN[0] + 0.12, 0.34], [ankN[0] + 0.2, 0.36]],
  ], fold(k.pants)));
  parts.push(toeLines(ankN));
  // Neck, the tee (only its front strip shows), the open overshirt with its collar.
  parts.push(T(sk, [[0.02, 4.6], [0.08, 4.96]], [0.18, 0.17], 0.14, {far: true, ink: false, up: true}));
  parts.push(C(k.tee, [[-0.3, 4.78], [0.02, 4.8], [0.26, 4.74], [0.4, 4.44], [0.4, 3.9], [0.38, 3.4], [0.38, 2.98], [-0.42, 2.98], [-0.46, 3.5], [-0.48, 3.9], [-0.48, 4.5], [-0.42, 4.66]], 0.34, {up: true}));
  parts.push(C(k.over, [[-0.36, 4.8], [0.0, 4.84], [0.2, 4.76], [0.3, 4.46], [0.28, 3.9], [0.28, 3.3], [0.33, 2.7], [-0.52, 2.68], [-0.56, 3.3], [-0.56, 3.9], [-0.54, 4.5], [-0.46, 4.7]], 0.36, {up: true}));
  parts.push(C(k.over, [[-0.3, 4.88], [0.04, 4.9], [0.18, 4.78], [0.02, 4.76], [-0.26, 4.78]], 0, {up: true})); // collar band (r2: a thin band, the r1 cel block read as a hood)
  parts.push(ink([
    [[0.22, 4.74], [0.28, 4.3], [0.28, 3.6], [0.3, 3.0], [0.33, 2.72]], // open front edge
    [[-0.5, 3.5], [-0.3, 3.4], [-0.1, 3.44]], // drag fold at the back of the waist
    [[-0.14, 4.3], [-0.06, 3.9], [-0.12, 3.5]], // side seam drape
  ], fold(k.over)));
  // Near arm swung back (CP-P03): a full sleeve, the elbow crease and the cuff, the mitten past the hip.
  const shN: HU = [-0.06, 4.44], elN: HU = [-0.32, 3.66], wrN: HU = [-0.5, 2.9];
  parts.push(T(k.over, [shN, mid(shN, elN, 0.5), elN, wrN], [0.215, 0.205, 0.19, 0.17], 0.14, {up: true}));
  const dN = unitHU([wrN[0] - elN[0], wrN[1] - elN[1]]), nN: HU = [-dN[1], dN[0]];
  const cuff = (w: HU, d: HU, n: HU, r: number): HU[] => [[w[0] - d[0] * 0.12 + n[0] * r, w[1] - d[1] * 0.12 + n[1] * r], [w[0] - d[0] * 0.12 - n[0] * r, w[1] - d[1] * 0.12 - n[1] * r]];
  parts.push(ink([
    cuff(wrN, dN, nN, 0.16),
    [[elN[0] + 0.1, elN[1] + 0.04], [elN[0] + 0.02, elN[1] - 0.02]],
    [[elN[0] + 0.12, elN[1] - 0.08], [elN[0] + 0.03, elN[1] - 0.1]],
  ], fold(k.over)));
  parts.push(...handParts(Hd({kind: 'mitten', w: wrN, dir: [-0.3, -1], thumb: 1}), sk));
  const hq = Q([0.1, 5.0]);
  const hx = hq[0] * H6, hy = -hq[1] * H6 - CHIN * K6;
  const head = headMark('side', hx, hy, o.face ?? FACES[0], c.head, cell + 90, {over: (ctx, p) => { hairStrands(p, hx, hy); void ctx; }});
  const fA = Q(ankN), fF = Q(ankF);
  return {
    view: 'profile', parts, head, contact: [footContact(fA[0]), footContact(fF[0])],
    anchors: {hips: [0, -Q(hip)[1] * H6], knees: [], feet: [[fA[0] * H6, 0], [fF[0] * H6, 0]], hands: [], head: [hx, hy]},
  };
};

// --- seated on the floor hugging the knees (B09-SH01), facing +x ------------------------------------------------------

/** figSeatFloor's pose in the costume: trousers to the ankles, full sleeves with cuffs over the fists, the overshirt hem on the floor. */
export const seatFloorV = (c: Cast, k: Costume, b: Build, o: {face?: Face; pitch?: number; blink?: boolean; cell?: number} = {}): Fig => {
  const {Q, T, C, Hd, ink} = kit(b);
  const sk = c.head.skin, cell = o.cell ?? 0;
  const hip: HU = [0, 0.34], ank: HU = [1.22, 0.16];
  const knee = ik2(hip, ank, 1.42, 1.48, 1);
  const lean = 0.13, N: HU = [Math.sin(lean), Math.cos(lean)];
  const S: HU = [hip[0] + 1.8 * N[0], hip[1] + 1.8 * N[1]];
  const kneeF: HU = [knee[0] - 0.06, knee[1] + 0.02], ankF: HU = [ank[0] - 0.08, ank[1]];
  const hemOf = (kn: HU, an: HU): HU => [an[0] + (kn[0] - an[0]) * 0.1, an[1] + (kn[1] - an[1]) * 0.1];
  const parts: Part[] = [], hands: Hand[] = [];
  parts.push(T(k.pants, [hip, mid(hip, kneeF, 0.5), kneeF, mid(kneeF, ankF, 0.5), hemOf(kneeF, ankF)], [0.32, 0.3, 0.25, 0.22, 0.2], 0, {far: true}));
  parts.push(T(sk, footCtrl(ankF, 0), FOOT_R, 0, {far: true}));
  const Sf: HU = [S[0] - 0.04, S[1] - 0.05], Tf: HU = [1.02, 1.2];
  const Ef = ik2(Sf, Tf, 0.9, 0.88, -1), df = unitHU([Tf[0] - Ef[0], Tf[1] - Ef[1]]);
  const Wf: HU = [Tf[0] - df[0] * 0.17, Tf[1] - df[1] * 0.17];
  parts.push(T(k.over, [Sf, Ef, Wf], [0.2, 0.18, 0.16], 0, {far: true, up: true}));
  hands.push({kind: 'fist', w: Wf, dir: df, thumb: 1, forceCel: true});
  // The overshirt's back hem lies on the floor behind the hips.
  parts.push(C(k.over, [[-0.6, 0.04], [0.1, 0.04], [0.2, 0.5], [-0.52, 0.86]], 0.2));
  parts.push(C(k.pants, [[-0.46, 0.74], [0.3, 0.52], [0.36, 0.04], [-0.42, 0.02]], 0.24));
  parts.push(T(k.pants, [hip, mid(hip, knee, 0.5), knee, mid(knee, ank, 0.5), hemOf(knee, ank)], [0.31, 0.28, 0.24, 0.215, 0.2], 0.2));
  parts.push(T(sk, footCtrl(ank, 0), FOOT_R, 0.05));
  parts.push(ink([
    [[knee[0] - 0.2, knee[1] - 0.18], [knee[0] - 0.06, knee[1] - 0.26]],
    [[knee[0] - 0.3, knee[1] - 0.3], [knee[0] - 0.14, knee[1] - 0.4]],
    [[ank[0] - 0.02, 0.44], [ank[0] + 0.08, 0.36], [ank[0] + 0.18, 0.38]],
  ], fold(k.pants)));
  // Tee, then the open overshirt over the back and side of the torso (the front edge stops short, so the tee shows at the chest).
  parts.push(C(k.tee, [[hip[0] - 0.42, hip[1] - 0.08], [hip[0] + 0.38, hip[1] - 0.08], [S[0] + 0.38, S[1]], [S[0] - 0.42, S[1]]], 0.34, {up: true}));
  parts.push(C(k.over, [[hip[0] - 0.52, hip[1] - 0.2], [hip[0] + 0.3, hip[1] - 0.12], [S[0] + 0.26, S[1] + 0.04], [S[0] - 0.2, S[1] + 0.12], [S[0] - 0.5, S[1] + 0.02]], 0.34, {up: true}));
  parts.push(ink([
    [[S[0] + 0.2, S[1]], [S[0] + 0.1, S[1] - 0.6], [hip[0] + 0.3, hip[1] - 0.1]],
    [[hip[0] - 0.4, hip[1] + 0.5], [hip[0] - 0.2, hip[1] + 0.4], [hip[0] - 0.02, hip[1] + 0.46]],
  ], fold(k.over)));
  const Sa: HU = [S[0] + 0.02, S[1] - 0.05], Tn: HU = [1.12, 1.12];
  const En = ik2(Sa, Tn, 0.9, 0.88, -1), dn = unitHU([Tn[0] - En[0], Tn[1] - En[1]]);
  const Wn: HU = [Tn[0] - dn[0] * 0.17, Tn[1] - dn[1] * 0.17];
  parts.push(T(k.over, [Sa, mid(Sa, En, 0.5), En, Wn], [0.215, 0.205, 0.19, 0.17], 0.13, {up: true}));
  const nn: HU = [-dn[1], dn[0]];
  parts.push(ink([[[Wn[0] - dn[0] * 0.12 + nn[0] * 0.16, Wn[1] - dn[1] * 0.12 + nn[1] * 0.16], [Wn[0] - dn[0] * 0.12 - nn[0] * 0.16, Wn[1] - dn[1] * 0.12 - nn[1] * 0.16]]], fold(k.over)));
  hands.push({kind: 'fist', w: Wn, dir: dn, thumb: 1});
  for (const h of hands) parts.push(...handParts(Hd(h), sk));
  parts.push(toeLines(ank));
  const chin: HU = [S[0] + 0.27 * N[0], S[1] + 0.27 * N[1]];
  parts.push(T(sk, [S, chin], [0.16, 0.14], 0.12, {ink: false, up: true}));
  const unrot = Q([S[0] + 0.73 * N[0], S[1] + 0.73 * N[1]]), piv = Q([S[0] + 0.3 * N[0], S[1] + 0.3 * N[1]]);
  const cx = unrot[0] * H6, cy = -unrot[1] * H6;
  const head = headMark('side', cx, cy, o.face ?? FACES[0], c.head, cell + 90, {blink: o.blink, over: (ctx, p) => {
    hairStrands(p, cx, cy);
    stubble(p, cx, cy, K6, 'side', sk);
    void ctx;
  }});
  if (o.pitch) {
    head.tilt = o.pitch;
    head.pivot = [piv[0] * H6, -piv[1] * H6];
  }
  const fa = Q(ank);
  return {
    view: 'seat-floor', parts, head,
    contact: [ellipse(-0.05 * H6, 0, 0.5 * H6, 0.06 * H6, 16), footContact(fa[0])],
    anchors: {hips: [0, -Q(hip)[1] * H6], knees: [], feet: [[fa[0] * H6, 0]], hands: [], head: [cx, cy]},
  };
};

// --- front close bust (B02-SH03) -----------------------------------------------------------------------------------------

/** Standing front bust cut at the waist: hanging full sleeves, the open overshirt with collar points and a chest pocket, the tee between. */
export const bustFrontV = (c: Cast, k: Costume, b: Build, o: {face?: Face; cell?: number} = {}): Fig => {
  const {Q, T, C, Hd, ink} = kit(b);
  const sk = c.head.skin, cell = o.cell ?? 0;
  const parts: Part[] = [], hands: Hand[] = [];
  // Hanging arms sit at the torso sides, behind the overshirt edge (the sleeve tops tuck under the shoulder line).
  for (const s of [-1, 1] as const) {
    const S: HU = [s * 0.56, 4.38], E: HU = [s * 0.86, 3.5], W: HU = [s * 0.94, 2.66];
    parts.push(T(k.over, [S, mid(S, E, 0.5), E, W], [0.225, 0.215, 0.2, 0.18], 0.13, {up: true}));
    parts.push(ink([[[W[0] - s * 0.17, W[1] + 0.14], [W[0] + s * 0.17, W[1] + 0.12]], [[E[0] - s * 0.12, E[1] + 0.06], [E[0] - s * 0.02, E[1]]]], fold(k.over)));
    hands.push({kind: 'mitten', w: [W[0], W[1] - 0.1], dir: [s * 0.05, -1], thumb: s === 1 ? -1 : 1});
  }
  parts.push(T(sk, [[0, 4.66], [0, 5.02]], [0.19, 0.18], 0.12, {far: true, ink: false, up: true}));
  parts.push(C(k.over, [[-0.22, 4.84], [0.22, 4.84], [0.48, 4.76], [0.7, 4.54], [0.8, 4.14], [0.78, 3.62], [0.74, 3.2], [0.76, 2.7], [-0.76, 2.7], [-0.74, 3.2], [-0.78, 3.62], [-0.8, 4.14], [-0.7, 4.54], [-0.48, 4.76]], 0.42, {up: true}));
  // The tee between the open fronts (a little wider at the hem, where the fronts fall apart).
  parts.push(C(k.tee, [[-0.22, 4.8], [0.22, 4.8], [0.26, 3.6], [0.32, 2.7], [-0.32, 2.7], [-0.26, 3.6]], 0.12, {up: true}));
  parts.push(ink([[[-0.19, 4.79], [0, 4.62], [0.19, 4.79]]], '#2b211c', 0.9));
  // Collar points over the shoulders, falling toward the chest.
  for (const s of [-1, 1] as const) parts.push(C(k.over, [[s * 0.18, 4.88], [s * 0.46, 4.82], [s * 0.4, 4.58], [s * 0.27, 4.4]], 0.08, {up: true}));
  parts.push(ink([
    [[-0.27, 4.42], [-0.26, 3.6], [-0.32, 2.72]], [[0.27, 4.42], [0.26, 3.6], [0.32, 2.72]], // open front edges (placket)
    [[0.36, 4.2], [0.58, 4.2], [0.58, 3.92], [0.36, 3.92], [0.36, 4.2]], // chest pocket
    [[-0.66, 4.0], [-0.56, 3.7], [-0.62, 3.36]], [[0.66, 3.9], [0.58, 3.6], [0.64, 3.3]], // armpit drapes
  ], fold(k.over)));
  for (const h of hands) parts.push(...handParts(Hd(h), sk));
  const hy = -Q([0, 5.0])[1] * H6 - CHIN * K6;
  const head = headMark('front', 0, hy, o.face ?? FACES[0], c.head, cell + 90, {});
  return {view: 'front', parts, head, contact: [], anchors: {hips: [0, -3 * H6], knees: [], feet: [], hands: [], head: [0, hy]}};
};

// --- paint: the production cel painter, optionally with a brush texture in the cloth ------------------------------------

/**
 * Variant B texture: after the flat cel wash of a cloth part, one seeded watercolour glaze in a darker shade of the same colour (texture
 * and pigment ring, a small inward bleed, so the silhouette and the ink stay where they are), then the outline. Skin, hands and the decal
 * heads stay flat. In the cel tone of a cloth part a 2B pencil hatch (WORLD FOG VD18) is laid before the lit tone covers the lit side, so it
 * stays only in the shade band. Seeds come from the part order, so the texture holds still across frames (only the ink boils).
 */
export type Tex = {opacity: number; texture: number; border: number; dark: number; hatch?: {dist: number; angle: number; weight: number; mix: number}};
/** WORLD FOG VD18 values as the start point (glaze 70 / 0.6 / 0.55, 2B hatch 7 px at 40 deg, weight 0.55); the glaze a little stronger. */
export const TEX_B: Tex = {opacity: 150, texture: 0.7, border: 0.6, dark: 0.26, hatch: {dist: 7, angle: 40, weight: 1.0, mix: 0.6}};

const texPaint = (ctx: PaintContext, base: number, cloth: Set<string>, tex?: Tex, sk = 1): Paint => {
  const shade = new Set([...cloth].filter((c) => [...cloth].some((b) => cel(b) === c)));
  const flat = washPaint(ctx, base);
  if (!tex) return flat;
  const {brush} = ctx;
  let seed = base + 5000;
  return {
    ...flat,
    part: (color, pts, outline = true, passes) => {
      flat.part(color, pts, false, passes);
      if (cloth.has(color) && pts.length > 2) {
        brush.seed(++seed);
        brush.noiseSeed(seed);
        brush.noStroke();
        brush.fill(mixColor(color, '#141012', tex.dark), tex.opacity);
        brush.fillBleed(0); // r3: no bleed, the r2 inward bleed still threw specks past the silhouette
        brush.fillTexture(tex.texture, tex.border, false, 0.2);
        brush.polygon(pts);
        brush.noFill();
        if (tex.hatch && shade.has(color)) {
          brush.seed(++seed);
          brush.noiseSeed(seed);
          brush.hatch(tex.hatch.dist / sk, tex.hatch.angle, {rand: 0.25, continuous: false, gradient: 0.15});
          brush.hatchStyle('2B', mixColor(color, '#1a1720', tex.hatch.mix), tex.hatch.weight / Math.sqrt(sk));
          brush.polygon(pts);
          brush.noHatch();
        }
      }
      if (outline) flat.ink([...pts, pts[0]]);
    },
  };
};

/** Every tone the cel painter can give a cloth colour (lit, cel, and the far side's cel). */
export const clothSet = (k: Costume) => new Set([k.over, k.tee, k.pants, cel(k.over), cel(k.tee), cel(k.pants), cel(cel(k.over))]);

/** drawFig (body6.ts) with the texture painter for the body parts; the head path is the production one (front or side decal). */
/** `zoom` is any scale applied outside `at.k` (the close lens), so the hatch keeps its screen spacing (r4: at the close's 4.6x the
 *  hatch and its grain grew into specks past the silhouette). */
export const drawFigV = (ctx: PaintContext, base: number, fig: Fig, at: Place, o: {floor?: string; screenCast?: boolean; light?: Pt; cloth: Set<string>; tex?: Tex; zoom?: number}) => {
  placeAt(ctx.brush, at.gx, at.gy, at.k, at.dir, () => {
    if (o.floor) {
      const s = washPaint(ctx, base + 700);
      if (!o.screenCast) for (const poly of castPolys(fig, at.dir)) s.part(castTone(o.floor), poly, false);
      for (const poly of fig.contact) s.part(castTone(o.floor), poly, false);
    }
    const p = texPaint(ctx, base, o.cloth, o.tex, at.k * (o.zoom ?? 1));
    const light = o.light ?? localTravel(at.dir);
    for (const part of fig.parts) paintPart(p, part, light);
    const h: HeadMark = fig.head;
    const q0 = washPaint(ctx, base + 300);
    if (h.kind === 'front') {
      paintHead(ctx, h.cell, h.x, h.y, K6, h.face, h.style, {blink: h.blink, blinkAt: h.blinkAt});
      h.over?.(ctx, q0);
      return;
    }
    const q = h.tilt && h.pivot ? rotated(q0, h.pivot, h.tilt) : q0;
    paintHeadSide(q, h.x, h.y, K6, h.face, h.style, {blink: h.blink, blinkAt: h.blinkAt});
    h.over?.(ctx, q);
  });
};

/** Head outline in local px (for callers measuring the head). */
export const headPx = (h: HeadMark): Pt[] => headOutline().map(([u, v]): Pt => [h.x + u * K6, h.y + v * K6]);
