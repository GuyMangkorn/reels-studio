import {BONE, type Arm, type CastDef, type FigAnchors, type FigPose} from '../kit/cast';
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {flatCircle, qy, wFill, wInk, wWash} from '../kit/world';
import type {FaceState} from '../kit/head';
import type {ExpressionId} from '../kit/expressions';
import {paintFigureAt, viewAtCam} from '../kit/figure-at';
import {makePainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {fitArms} from '../kit/fit-arms';
import type {Brush} from '../BrushCanvas';
import {poseArms, type AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {at2, BENCH, LIQUID, PAL, paintBasket, paintFullonica, STALL_RIM, STALL_WALL, STALL_Z0, STALL_Z1, STALLS, tone, type FullLight} from './fullonica';
import {paintPalace, paintTable, type PalaceLight} from './palace';
import {GRAPER, MARCUS, MARCUS_BARE, PASSERBY, R4, paintClavi, paintCoin, paintJar, paintLaurel, paintRibbons, paintWrungCloth, SENIOR, TITUS, VESPASIAN} from './r4-cast';
import {paintStreet, type StreetLight} from './street';
import type {Hand3DArm, Occluder3D, Prop3D} from '../kit/hand3d';
import {LANDMARKS} from '../kit/hand-place';
import {bodyFacing, coinOf, facePoint, HANG, paintedArms, pick3D, rigHands, type HandRig} from './r4-hands';

// EDU-EP26-SHORT W3 look proposals on BRIEF-R4 (Film, 2026-11-18; docs/sequence-workflow.md#look-thumbnails, #painted-shot-by-shot W3).
// TH-W* / TH-I* / TH-S*: draft thumbnails (flat washes, no small props) of the three new locations, each a different framing or light.
// LF04 / LF05 / LF06 / LF07: finished-grade look frames of the key moments, painted from Film's recommended thumbnail of each location
// (the user's pick may move them). KP-MARCUS: Marcus in four views and four key poses. Kept free of React for headless use.

const DEG = Math.PI / 180;
/** One `Hands3D` layer (five-finger 3D hands and props over the plate): only for POV shots or hand close-ups that name the fingers
 *  (user, 18 Nov 2026); no EP26 still uses one, every hand here is the painted mitten. */
/** `occluders`: depth-only stand-ins for painted bodies (kit `Occluder3D`), so a 3D hand behind a figure is hidden. */
export type Layer3D = {cam: YCam; arms: Hand3DArm[]; props: Prop3D[]; occluders?: Occluder3D[]};
/** `inset`: a second painted plate shown in a round window (VD26-12 wine inset): centre and radius in frame px, painted in frame coordinates. */
export type R4Inset = {cx: number; cy: number; r: number; paper: string; paint: (p: Painter) => void};
export type R4Still = {shot: string; note: string; kind: 'thumb' | 'look' | 'sheet'; caption?: string; paper: string; paint: (p: Painter) => void; hands?: () => Layer3D[]; inset?: R4Inset};
export const layer = (cam: YCam, ...parts: {arms3D: Hand3DArm[]; props: Prop3D[]}[]): Layer3D => ({cam, arms: parts.flatMap((r) => r.arms3D), props: parts.flatMap((r) => r.props)});
export const PROBE: Record<string, Record<string, number>> = {};
const probe = (id: string, key: string, a: FigAnchors | null) => {
  if (!a) return;
  PROBE[id] = {...(PROBE[id] ?? {}), [`${key}Top`]: Math.round(a.top), [`${key}Bottom`]: Math.round(Math.min(1920, a.bottom)), [`${key}Px`]: Math.round(Math.min(1920, a.bottom) - Math.max(0, a.top)),
    [`${key}HeadX`]: Math.round(a.head[0]), [`${key}HeadY`]: Math.round(a.head[1])};
};

export type Act = {def: CastDef; at: V3; facing?: [number, number]; view?: FigPose['view']; pose?: AnyPoseId; face?: ExpressionId; fig?: Partial<FigPose>;
  arms?: (g: Pt, u: number, view: FigPose['view'], an?: FigAnchors) => Partial<Pick<FigPose, 'rArm' | 'lArm'>>; held?: (p: Painter, a: FigAnchors, u: number) => void;
  tint?: {to: string; u: number}; seed: number; t?: number; look?: [number, number]; faceState?: Partial<FaceState>;
  /** No contact shadow (feet off the floor, e.g. stepping down behind a wall; EDU-EP26 draft fix B). Absent = the shadow as before. */
  noShadow?: boolean};

/** Paint one actor: the pose's arms from the kit pose sheet, then the shot's own arm targets (`arms`) on top. */
export const act = (p: Painter, c: YCam, a: Act): FigAnchors | null => {
  const g = camPoint(c, a.at);
  if (!g) return null;
  const u = camUnit(c, a.at), vf = viewAtCam(c, {at: a.at, facing: a.facing, view: a.view});
  const base = poseArms(a.pose ?? 'P01', a.def, g, u, vf.view === 'back' ? 'front' : vf.view);
  const opts = (fig: Partial<FigPose>) => ({
    at: a.at, facing: a.facing, view: a.view, pose: a.pose ?? 'P01', face: a.face ?? 'neutral', t: a.t ?? 0, seed: a.seed,
    faceState: a.look || a.faceState ? {...(a.faceState ?? {}), ...(a.look ? {look: a.look} : {})} : undefined,
    fig, held: a.held, tint: a.tint, shadow: a.noShadow ? (false as const) : {color: '#3a2a26', op: 80},
  });
  // the shot's own arms are re-solved from the shoulder the rig actually draws (a dry run with a no-op brush gives the anchors)
  // (the bone in px is measured at chest depth: on a high camera the feet sit deeper than the hands and shoulders)
  const dry = paintFigureAt(DRY, c, a.def, opts({...base, ...(a.fig ?? {})}));
  const own = a.arms?.(g, u, vf.view, dry ?? undefined) ?? {}, uc = camUnit(c, [a.at[0], a.at[1] + a.def.height * 0.72, a.at[2]]);
  const fixed = dry ? fitArms(own, dry, BONE * (a.def.armScale ?? 1) * uc) : own;
  const res = paintFigureAt(p, c, a.def, opts({...base, ...fixed, ...(a.fig ?? {})}));
  if (res) logArms(a.def, res, own, fixed, uc);
  return res;
};
const DRY = makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
// fitArms (the R5 two-bone fit on the drawn shoulder) moved to the kit: src/painted/kit/fit-arms.ts (Boss W5.2, 2026-11-18).
/** Arm anatomy probe (R5, user note on arm length): each drawn arm's upper-arm and forearm lengths in metres at the figure's depth
 *  (picture px / camUnit), against the rig bone (`BONE` × `armScale`). A projected bone can only read shorter than the bone, so a value
 *  above 1.1 × bone is a too-long arm; `sh` is the gap (m) between the drawn shoulder and the arm's start, 0 for the rig's own arms. */
export const ARM_LOG: {still: string; who: string; side: 'r' | 'l'; upper: number; fore: number; bone: number; status: string; before: number[]; reach: number}[] = [];
export const armTag = {still: ''};
const WHO = new Map<CastDef, string>([[MARCUS, 'marcus'], [MARCUS_BARE, 'marcus'], [SENIOR, 'senior'], [TITUS, 'titus'], [VESPASIAN, 'vesp'], [PASSERBY, 'passer'], [GRAPER, 'graper']]);
function logArms(def: CastDef, an: FigAnchors, own: Partial<FigPose>, fixed: Partial<FigPose>, u: number) {
  if (!armTag.still) return;
  const bone = BONE * (def.armScale ?? 1);
  for (const side of ['r', 'l'] as const) {
    const A0 = (side === 'r' ? own.rArm : own.lArm) as Arm | undefined, A = (side === 'r' ? fixed.rArm : fixed.lArm) as Arm | undefined;
    const S = side === 'r' ? an.rShoulder : an.lShoulder;
    if (!A?.via || !A0?.via) continue;
    const len = (B: Arm) => [Math.hypot(B.via![0] - S[0], B.via![1] - S[1]) / u, Math.hypot(B.to[0] - B.via![0], B.to[1] - B.via![1]) / u];
    const [u0, f0] = len(A0), [upper, fore] = len(A), reach = Math.hypot(A.to[0] - S[0], A.to[1] - S[1]) / u / (2 * bone);
    const status = reach > 1.08 ? 'REACH' : u0 > 1.1 * bone || f0 > 1.1 * bone ? 'fixed' : 'ok';
    ARM_LOG.push({still: armTag.still, who: WHO.get(def) ?? '?', side, upper: +upper.toFixed(3), fore: +fore.toFixed(3), bone, status,
      before: [+u0.toFixed(3), +f0.toFixed(3)], reach: +reach.toFixed(2)});
  }
}
/** Smelling something foul (R5; the kit `disgusted` angry brow read as cross at phone scale): worried brow, scrunched half-shut eyes,
 *  clenched grimace. */
export const YUCK: Partial<FaceState> = {brow: 'worry', eyes: 'half', squint: 0.75, mouth: 'clench'};
export const arm = (to: Pt, via: Pt, extra: Partial<Arm> = {}): Arm => ({to, via, ...extra});
/** Nose tip of a head in a side or three-quarter view: `dir` +1 faces screen right. */
export const noseOf = (a: FigAnchors, dir: number, k = 0.95): Pt => {
  const K = (a.chin - a.headTop) / 2.39;
  return [a.head[0] + dir * k * K, a.head[1] + 0.28 * K];
};

// ------------------------------------------------------------------------------------------------------------------ workshop

export const WS: Record<string, YCam> = {
  // TH-WA / LF hook end: front-left of the room, the stalls under the sun shaft, the doorway at frame left
  A: {x: -1.55, y: 1.7, z: 0.9, yaw: 22 * DEG, pitch: -11 * DEG, f: 830, hy: 900},
  // TH-WB: from the jar corner toward the doorway, backlit
  B: {x: 1.5, y: 1.55, z: 1.0, yaw: -52 * DEG, pitch: -7 * DEG, f: 800, hy: 930},
  // TH-WC: low and close on the stalls (the hook's first frame, comic low angle)
  C: {x: -0.1, y: 2.05, z: -1.45, yaw: 3 * DEG, pitch: -36 * DEG, f: 860, hy: 900},
  // LF04: across the bench, B02-SH02
  LF04: {x: 0.0, y: 1.45, z: 1.62, yaw: 0, pitch: -8 * DEG, f: 900, hy: 820},
  // LF05: square on the middle stall, B03-SH02
  // R5: higher and yawed toward the senior so the water surface opens up and the two treaders stand at two depths
  LF05: {x: -0.2, y: 2.0, z: -1.95, yaw: 22 * DEG, pitch: -30 * DEG, f: 760, hy: 520, cx: -40},
};

export const STALL1_AT: V3 = [(STALLS[1].x0 + STALLS[1].x1) / 2, 0.05, -2.78];
const partitionTop = (x: number): V3 => [x, STALL_WALL + 0.01, -2.72];

/** The treader in stall 1, hands braced on the two partition tops (F005: hands work too). */
export const treader = (def: CastDef, face: ExpressionId, seed: number, tint?: {to: string; u: number}): Act => ({
  def, at: STALL1_AT, view: 'front', face, seed, tint,
  arms: () => ({}),
});

export function paintTreader(p: Painter, c: YCam, a: Act) {
  const lh = at2(c, partitionTop(STALLS[1].x0 - 0.06)), rh = at2(c, partitionTop(STALLS[1].x1 + 0.06));
  return act(p, c, {...a, arms: (g, u) => ({
    rArm: arm([lh[0] + 6, lh[1] + 4], [lh[0] + 0.12 * u, lh[1] + 0.2 * u], {open: 1}),
    lArm: arm([rh[0] - 6, rh[1] + 4], [rh[0] - 0.12 * u, rh[1] + 0.2 * u], {open: -1}),
  })});
}

const workshopThumb = (cam: YCam, L: FullLight, marcus: {at: V3; facing: [number, number]} | null, id: string) => (p: Painter) => {
  paintFullonica(p, cam, L, {
    stallLiquidFrom: [STALL_Z0, STALL1_AT[2] - 0.03, STALL_Z0],
    inStalls: (q, c) => probe(id, 'senior', paintTreader(q, c, treader(SENIOR, 'happy', 2611))),
    behindBench: marcus ? (q, c) => probe(id, 'marcus', act(q, c, {def: MARCUS, at: marcus.at, facing: marcus.facing, pose: 'P07', face: 'happy', seed: 2612})) : undefined,
  });
};

// ------------------------------------------------------------------------------------------------------------------ LF04 smell hit

// Marcus on the near (+z) side of the bench, front-right three-quarter toward the jar; the senior across it, front-left three-quarter.
export const LF04_MARCUS: V3 = [-0.42, 0, 0.12], LF04_SENIOR: V3 = [0.42, 0, -0.98], LF04_JAR: V3 = [0.1, BENCH.y1, -0.36];
export const LF04_FACING: [number, number] = [0.7, 1];
/** Marcus at about 1.5 m (R5): his near (left) open mitten flies up between his nose and the jar, fanning the smell off, elbow
 *  forward under the hand; his right arm hangs (pose P01). Authored on the drawn shoulder and head (`act` passes the anchors). */
export const lf04Fan = (an: FigAnchors, u: number) => {
  const K = (an.chin - an.headTop) / 2.39, nose = noseOf(an, 1, 0.75);
  const W: Pt = [nose[0] + 0.55 * K, nose[1] + 0.35 * K];
  // elbow forward under the hand (foreshortened toward the lens): a 4-head body cannot reach its nose with the elbow down at the ribs
  return {lArm: arm(W, [W[0] - 0.02 * u, an.lShoulder[1] + 0.1 * u], {open: 1})};
};
function paintLF04(p: Painter, draft = false) {
  const c = WS.LF04, L: FullLight = {mood: 'morning', draft};
  paintFullonica(p, c, L, {
    stallLiquidFrom: [STALL_Z0, STALL_Z0, STALL_Z0],
    behindBench: (q, cc) => {
      const lid = at2(cc, [LF04_JAR[0] + 0.2, LF04_JAR[1] + 0.22, LF04_JAR[2] - 0.12]);
      probe('LF04', 'senior', act(q, cc, {def: SENIOR, at: LF04_SENIOR, facing: [-0.55, 1], face: 'happy', seed: 2621,
        arms: (g, u) => ({rArm: arm([lid[0] + 0.03 * u, lid[1] + 0.02 * u], [g[0] - 0.36 * u, g[1] - 1.12 * u], {open: 1})}),
        held: (qq, a, u) => {
          // the lid, just lifted off, in the senior's hand
          const [x, y] = a.rHand;
          hardFill(qq, 34050, '#9a5434', [[x - 0.09 * u, y - 0.01 * u], [x + 0.09 * u, y - 0.03 * u], [x + 0.08 * u, y + 0.015 * u], [x - 0.08 * u, y + 0.03 * u]]);
          hardFill(qq, 34051, '#5a2e22', [[x - 0.02 * u, y - 0.05 * u], [x + 0.02 * u, y - 0.055 * u], [x + 0.02 * u, y - 0.015 * u], [x - 0.02 * u, y - 0.01 * u]]);
        }}));
    },
    room: (q, cc) => {
      const j = paintJar(q, cc, LF04_JAR, 34000, {lid: 'off', h: 0.36, w: 0.32});
      const m = act(q, cc, {def: MARCUS, at: LF04_MARCUS, facing: LF04_FACING, face: 'disgusted', faceState: YUCK, seed: 2622, fig: {headCock: -9},
        arms: (g, u, v, an) => (an ? lf04Fan(an, u) : {})});
      probe('LF04', 'marcus', m);
      if (j && m) {
        const o = {spread: 26, bow: 0.18, waves: 1.8};
        paintRibbons(q, 34100, [j.mouth[0], j.mouth[1] - 8], noseOf(m, 1, 0.75), {...o, w: 40, op: 110, color: '#8a8443', edge: 0});
        paintRibbons(q, 34100, [j.mouth[0], j.mouth[1] - 8], noseOf(m, 1, 0.75), {...o, w: 28, op: 220, edge: 1.6});
      }
    },
  });
}

// ------------------------------------------------------------------------------------------------------------------ LF05 tread

export const LF05_SENIOR: V3 = [(STALLS[2].x0 + STALLS[2].x1) / 2 + 0.02, 0.05, -2.8];
export const LF05_SENIOR_FACING: [number, number] = [-0.8, 1];
/** Marcus braces his left palm on the partition's near end, elbow bent out (R5: both arms were straight rods to the partition centres);
 *  his right mitten holds his nose (painted in picture space on the head anchors, like the LF07 passer-by), so the smell reads at phone scale. */
export const lf05Marcus = () => rigHands(bodyFacing(MARCUS_BARE, STALL1_AT, [0, 1]), {
  left: {gesture: 'relaxed', put: {landmark: (sk) => sk.palmCentre, at: [STALLS[1].x1 + 0.03, STALL_WALL + 0.04, -2.55]}, f: [0.1, -0.15, 1], b: [0, 1, 0]},
}, 40500, {pole: {left: [1, -0.5, -0.6]}});
export const noseHold = (def: CastDef, g: Pt, u: number, dir: 1 | -1): Arm => {
  const hy = g[1] - (def.height - 0.2 * (def.headScale ?? 1)) * u;
  return arm([g[0] + dir * 0.05 * u, hy + 0.1 * u], [g[0] + dir * 0.2 * u, hy + 0.36 * u], {fist: dir});
};
/** Feet of the two treaders (world, on the stall floor), for the ripples: Marcus mid-step, the senior planted. */
const LF05_FEET: Record<number, [number, number][]> = {
  1: [[STALL1_AT[0] - 0.09, STALL1_AT[2] + 0.02], [STALL1_AT[0] + 0.09, STALL1_AT[2] - 0.02]],
  2: [[LF05_SENIOR[0] - 0.1, LF05_SENIOR[2]], [LF05_SENIOR[0] + 0.1, LF05_SENIOR[2] + 0.02]],
};
/** The tread on the water surface (LF05 R5, viewer R-C "no water mass or ripple"): shins seen through the murky liquid, a foam collar and
 *  two or three broken ripple rings round each shin, the trodden cloth heaving just under the surface, splash drops, the light-well glint. */
export function paintTread(p: Painter, c: YCam, k: number, L: FullLight, skinOf?: string, feetLift?: {l: number; r: number}) {
  const feet = LF05_FEET[k];
  if (!feet) return;
  const t = (x: string) => tone(L, x), y = LIQUID + 0.004, sx = STALLS[k], base = 37000 + k * 200;
  // glint of the light well across the far half of the surface
  for (let g = 0; g < 3; g++) wInk(p, c, base + 3 + g, [[sx.x0 + 0.12 + g * 0.08, y, -3.1 + g * 0.05], [sx.x0 + 0.42 + g * 0.1, y, -3.12 + g * 0.05]], {closed: false, color: '#e6ecd2', weight: 2.2 - g * 0.5});
  // the trodden cloth heaving under the surface between the feet
  const cx = (feet[0][0] + feet[1][0]) / 2, cz = (feet[0][1] + feet[1][1]) / 2;
  wWash(p, c, base + 1, t('#cfc6a4'), 110, [[cx - 0.3, y, cz - 0.12], [cx + 0.26, y, cz - 0.16], [cx + 0.32, y, cz + 0.12], [cx - 0.22, y, cz + 0.18]], 0.3, 0.5);
  wWash(p, c, base + 2, t('#5f6b40'), 120, [[cx - 0.2, y, cz + 0.02], [cx + 0.18, y, cz - 0.03], [cx + 0.2, y, cz + 0.08], [cx - 0.16, y, cz + 0.1]], 0.25, 0.5);
  feet.forEach(([fx, fz], j) => {
    const id = base + 10 + j * 40, skin = skinOf ?? (k === 1 ? R4.skinMarcus : R4.skinSenior);
    // the submerged shin, dimmed and greened by the liquid
    wWash(p, c, id, mixColor(skin, '#5f6b40', 0.55), 150, [[fx - 0.04, y, fz], [fx + 0.04, y, fz], [fx + 0.035, feetLift ? 0.33 : 0.18, fz], [fx - 0.035, feetLift ? 0.33 : 0.18, fz]], 0.15, 0.3);
    // B01-SH04 W5.3 (hook frame): the whole foot seen through the liquid (heel, sole, five toes), lifting with the step so the stomp reads
    if (feetLift) {
      const up = j === 0 ? feetLift.r : feetLift.l, fy = 0.33 + 0.08 * up, fcol = mixColor(skin, '#7d8f58', 0.3 - 0.12 * up);
      wWash(p, c, id + 30, fcol, 215, [[fx - 0.045, fy, fz - 0.09], [fx + 0.045, fy, fz - 0.09], [fx + 0.065, fy, fz + 0.04], [fx + 0.06, fy, fz + 0.13], [fx - 0.06, fy, fz + 0.13], [fx - 0.07, fy, fz + 0.04]], 0.1, 0.2);
      for (let d = 0; d < 5; d++) washAt(p, id + 31 + d, mixColor(skin, '#f1d9b8', 0.25), 215, flatCircle(c, [fx - 0.05 + d * 0.025, fy + 0.002, fz + 0.14 - 0.014 * Math.abs(d - 1.5)], 0.013, 8), 0.1, 0.2);
    }
    // ripple rings (broken arcs, light) and the foam collar at the shin
    for (let r = 0; r < 3; r++) {
      const ring = flatCircle(c, [fx, y, fz], 0.07 + r * 0.075, 28), from = Math.round(hash(id + r) * 10), len = 17 - r * 3;
      const arc = Array.from({length: len}, (_, i) => ring[(from + i) % ring.length]);
      inkLine(p, id + 5 + r, arc, {closed: false, color: '#d3dbbf', weight: 2.4 - r * 0.5, still: true});
    }
    washAt(p, id + 9, '#dfe2cc', 80, flatCircle(c, [fx, y + 0.002, fz], 0.05, 16), 0.15, 0.4);
    // splash drops kicked up by the step (painted, still frame: they carry the motion)
    if (k === 1) for (let d = 0; d < 4; d++) {
      const q = camPoint(c, [fx + (d - 1.5) * 0.05, y + 0.05 + 0.06 * hash(id + 20 + d), fz + 0.06]);
      if (q) hardFill(p, id + 21 + d, '#eef2e0', ell(q[0], q[1], 3.5 + 2 * hash(id + 30 + d), 5 + 2 * hash(id + 34 + d), 8));
    }
  });
}
/** Cloth hung to drip on a line over the stalls (fills the top quarter with the trade, UT12; heads stay clear). */
export function paintDripLine(p: Painter, c: YCam, L: FullLight) {
  const t = (x: string) => tone(L, x), z = -3.08, y = 2.02;
  wInk(p, c, 37600, [[-2.2, y, z], [-0.6, y - 0.05, z], [1.0, y - 0.04, z], [2.4, y, z]], {closed: false, color: '#5b3a28', weight: 2.2});
  const cloths: [number, number, number, string][] = [[-1.7, -1.05, 0.42, '#efe9dc'], [-0.95, -0.55, 0.3, '#c0503e'], [-0.15, 0.25, 0.26, '#e3a43c'], [0.42, 1.1, 0.4, '#efe9dc'], [1.25, 1.85, 0.36, '#5a77a0']];
  cloths.forEach(([x0, x1, drop, col], i) => {
    const id = 37610 + i * 6, yt = y - 0.04;
    wFill(p, c, id, t(col), [[x0, yt, z], [x1, yt, z], [x1 - 0.02, yt - drop, z + 0.01], [(x0 + x1) / 2, yt - drop - 0.05, z + 0.01], [x0 + 0.02, yt - drop + 0.02, z + 0.01]]);
    wWash(p, c, id + 1, mixColor(t(col), '#000000', 0.28), 120, [[x0 + (x1 - x0) * 0.58, yt, z + 0.002], [x1, yt, z + 0.002], [x1 - 0.02, yt - drop, z + 0.012], [x0 + (x1 - x0) * 0.64, yt - drop, z + 0.012]], 0.15, 0.4);
    // drips falling from the hem onto the wall's tide line
    for (let d = 0; d < 2; d++) {
      const q = camPoint(c, [x0 + (x1 - x0) * (0.3 + 0.4 * d), yt - drop - 0.12 - 0.1 * d, z + 0.01]);
      if (q) hardFill(p, id + 3 + d, '#d8e0d0', ell(q[0], q[1], 2.5, 4, 8));
    }
  });
  // damp streaks and a mould bloom on the plaster under the line
  for (let r = 0; r < 6; r++) {
    const x = -1.6 + r * 0.62 + 0.1 * hash(37700 + r);
    wWash(p, c, 37710 + r, t(PAL.plasterShade), 110, [[x - 0.06, 1.95, -3.199], [x + 0.06, 1.95, -3.199], [x + 0.04, 1.4, -3.199], [x - 0.03, 1.38, -3.199]], 0.3, 0.6);
  }
  wWash(p, c, 37720, t('#7b8460'), 90, [[-0.9, 1.3, -3.198], [0.2, 1.32, -3.198], [0.1, 1.62, -3.198], [-0.7, 1.58, -3.198]], 0.35, 0.6);
}
/** Foreground (bottom quarter, UT12): the overflow gutter along the stall foot, a heap of the customers' soiled tunics, a wooden bucket. */
export function paintTreadFloor(p: Painter, c: YCam, L: FullLight) {
  const t = (x: string) => tone(L, x), z0 = STALL_Z1 + 0.005;
  // gutter: a stone channel at the wall foot carrying the overflow (dark wet stone, the same murky liquid)
  wFill(p, c, 37800, t('#6d5f4c'), qy(0.004, -1.9, 1.6, z0, z0 + 0.14));
  wWash(p, c, 37801, t(PAL.liquid), 170, qy(0.006, -1.9, 1.6, z0 + 0.03, z0 + 0.11), 0.2, 0.4);
  wWash(p, c, 37803, t(PAL.stallWet), 120, qy(0.004, -1.9, 1.6, z0 + 0.14, z0 + 0.34), 0.35, 0.5);
  // the stall's shade across the near floor, then a basket of soiled tunics waiting their turn
  wWash(p, c, 37805, t('#5e4c3c'), 120, qy(0.005, -1.9, 1.6, z0 + 0.3, z0 + 0.9), 0.4, 0.5);
  paintBasket(p, c, [0.25, 0, z0 + 0.42], 37840);
}
function paintLF05(p: Painter, draft = false) {
  const c = WS.LF05, L: FullLight = {mood: 'setback', draft}, tint = {to: '#7d8f7c', u: 0.1};
  paintFullonica(p, c, L, {
    noPoles: true,
    stallLiquidFrom: [STALL_Z0, STALL1_AT[2] - 0.03, LF05_SENIOR[2] - 0.03],
    backDress: (q, cc) => paintDripLine(q, cc, L),
    inStalls: (q, cc) => {
      // the senior in the next stall treads and wrings a second cloth by hand at the chest (F005: feet and hands)
      // fists at the belly, authored on the drawn shoulders (a 3/4 body's world shoulders do not land on the painted ones; R5 arm check)
      const u = camUnit(cc, [LF05_SENIOR[0], 1.2, LF05_SENIOR[2]]);
      let lh: Pt = [0, 0], rh: Pt = [0, 0];
      probe('LF05', 'senior', act(q, cc, {def: SENIOR, at: LF05_SENIOR, facing: LF05_SENIOR_FACING, face: 'happy', seed: 2632, tint, arms: (g, uu, v, an) => {
        if (!an) return {};
        const mx = (an.rShoulder[0] + an.lShoulder[0]) / 2, my = (an.rShoulder[1] + an.lShoulder[1]) / 2 + 0.3 * u;
        lh = [mx - 0.09 * u, my]; rh = [mx + 0.09 * u, my + 0.02 * u];
        return {rArm: arm(lh, [an.rShoulder[0] - 0.1 * u, my - 0.06 * u], {fist: -1}), lArm: arm(rh, [an.lShoulder[0] + 0.1 * u, my - 0.04 * u], {fist: 1})};
      }}));
      paintWrungCloth(q, [lh[0] - 0.05 * u, lh[1] - 0.05 * u], [rh[0] + 0.07 * u, rh[1] - 0.05 * u], 0.075 * u, 34300);
      probe('LF05', 'marcus', act(q, cc, {...treader(MARCUS_BARE, 'disgusted', 2631, tint), look: [0.1, 0.25], faceState: YUCK, arms: (g, u) => ({...paintedArms(cc, lf05Marcus()), rArm: noseHold(MARCUS_BARE, g, u, -1)})}));
    },
    onLiquid: (q, cc, k) => paintTread(q, cc, k, L),
    room: (q, cc) => {
      // faint ribbons off the tub (opacity about 30 %)
      const w0 = at2(cc, [STALLS[1].x0 + 0.18, LIQUID_TOP, -2.45]), w1 = at2(cc, [STALLS[1].x0 + 0.05, 1.35, -2.7]);
      paintRibbons(q, 34400, w0, w1, {w: 16, op: 85, spread: 30, bow: 0.15, waves: 1.6});
      const v0 = at2(cc, [STALLS[1].x1 - 0.18, LIQUID_TOP, -2.45]), v1 = at2(cc, [STALLS[1].x1 - 0.02, 1.3, -2.7]);
      paintRibbons(q, 34420, v0, v1, {w: 16, op: 75, spread: 26, bow: -0.15, waves: 1.6, count: 2});
    },
    foreground: (q, cc) => paintTreadFloor(q, cc, L),
  });
}
export const LIQUID_TOP = STALL_RIM + 0.02;

// ------------------------------------------------------------------------------------------------------------------ imperial room

export const PC: Record<string, YCam> = {
  A: {x: 0.0, y: 1.42, z: 2.9, yaw: 0, pitch: -4 * DEG, f: 950, hy: 880},
  B: {x: -1.5, y: 1.45, z: 2.3, yaw: 30 * DEG, pitch: -4 * DEG, f: 950, hy: 880},
  LF06: {x: -0.08, y: 1.52, z: 1.55, yaw: 0, pitch: -2 * DEG, f: 1000, hy: 780},
};
// R5: Vespasian 0.26 m nearer Titus so his coin arm reaches the nose bent at the elbow (it was stretched past two bones, user note)
export const TITUS_AT: V3 = [-0.4, 0, 0.3], VESP_AT: V3 = [0.16, 0, 0.24];
export const TITUS_FACING = (close: boolean): [number, number] => [1, close ? 0 : 0.2], VESP_FACING: [number, number] = [-1, 0.6];
export const COIN_SCALE = 2.2; // the kit coin is 2.4 cm; drawn 5.3 cm so the hero coin reads (story-size exaggeration, recorded in BRIEF-R4)
/** Coin centre 6 cm in front of Titus's nose (R5, was 4.5 cm), lifted clear of the pinch; Vespasian's near (left) pinch holds it; Titus's near (right) hand and Vespasian's right hang relaxed. */
export const palaceRigs = (close: boolean) => {
  const tb = bodyFacing(TITUS, TITUS_AT, TITUS_FACING(close)), nose = facePoint(tb, 0.13, -0.035);
  const coin: V3 = [nose[0] + tb.z[0] * 0.06, nose[1], nose[2] + tb.z[2] * 0.06];
  const titus = rigHands(tb, {right: HANG}, 41500);
  const vesp = rigHands(bodyFacing(VESPASIAN, VESP_AT, VESP_FACING), {
    // R5: the near (left) arm reaches (the far right arm's forearm is hidden behind his body in this 3/4 view, which left the 3D hand
    // floating); back of the hand turned away from the lens so the coin face shows
    left: {gesture: 'pinch', put: {landmark: LANDMARKS.pinch, at: [coin[0], coin[1] - 0.012 * COIN_SCALE * 2.3, coin[2]]}, f: [0.1, 1, 0.1], b: [-0.5, 0, -1]},
    right: HANG,
  }, 42000, {coin: 'left', coinScale: COIN_SCALE, coinFace: [0, 0, 1], coinLift: 2.3, pole: {left: [0.2, -1, 0.5]}});
  return {titus, vesp, nose, coin};
};

/** LF06 / B06-SH02 end: Vespasian's coin pinch at Titus's nose is the five-finger 3D hand and 3D coin (the pinch is the gag, CL03). */
const palaceHands = (c: YCam) => () => [layer(c, pick3D(palaceRigs(true).vesp, ['left'], 'left'))];
function palaceScene(c: YCam, L: PalaceLight, id: string, close: boolean) {
  return (p: Painter) => paintPalace(p, c, L, (q, cc) => {
    paintTable(q, cc, L);
    const r = palaceRigs(close);
    probe(id, 'titus', act(q, cc, {def: TITUS, at: TITUS_AT, facing: TITUS_FACING(close), face: 'suspicious', seed: 2641,
      arms: () => paintedArms(cc, r.titus), held: (qq, a, u) => paintClavi(qq, a, close ? 'right' : 'front', u, 34500)}));
    probe(id, 'vesp', act(q, cc, {def: VESPASIAN, at: VESP_AT, facing: VESP_FACING, face: 'smug', seed: 2642,
      arms: () => paintedArms(cc, r.vesp, {noHand: close ? ['left'] : []}), held: (qq, a) => paintLaurel(qq, a, 'front', 34600)}));
    const pc = coinOf(cc, r.vesp);
    if (pc && !close) paintCoin(q, pc.at, pc.r, 34700, 0.12);
    const n = camPoint(cc, r.nose), k = camPoint(cc, r.coin);
    if (n && k) PROBE[id] = {...(PROBE[id] ?? {}), noseX: Math.round(n[0]), noseY: Math.round(n[1]), coinX: Math.round(k[0]), coinY: Math.round(k[1]), coinPx: Math.round(0.024 * COIN_SCALE * camUnit(cc, r.coin))};
  });
}

// ------------------------------------------------------------------------------------------------------------------ street ending

export const SC: Record<string, YCam> = {
  A: {x: 0.1, y: 1.38, z: 2.35, yaw: 0, pitch: 1 * DEG, f: 950, hy: 960},
  B: {x: -0.1, y: 1.55, z: 2.3, yaw: -30 * DEG, pitch: -3 * DEG, f: 900, hy: 930},
  // LF07 R5: TH-SA's axis and light, the camera 1.3 m further down the street so Marcus is a medium-full figure at 1.5 m and his coin
  // reads (the viewer's H-C: about 20 px at 2.8 m); the passer-by now stands deeper, past him
  LF07: {x: -0.22, y: 1.3, z: 1.05, yaw: 0, pitch: 3 * DEG, f: 950, hy: 880},
};
/** The ending's hero coin (R5): 3.6 × the kit coin (8.6 cm, beside 2.2 in B05/B06; story-size exaggeration on the payoff beat, recorded in
 *  the change log), a warm halo against the dusk, the coin with rim and shine, and a four-point glint. */
export const LF07_COIN = 3.6;
export function paintHeroCoin(p: Painter, at: Pt, r: number, seed: number) {
  washAt(p, seed, '#ffe3a0', 120, ell(at[0], at[1], r * 2.3, r * 2.3, 22), 0.4, 0.3);
  paintCoin(p, at, r, seed + 1, 0.1);
  const g: Pt = [at[0] - r * 0.55, at[1] - r * 0.6], k = r * 0.9;
  hardFill(p, seed + 8, '#fff8e0', [[g[0], g[1] - k], [g[0] + k * 0.16, g[1] - k * 0.16], [g[0] + k, g[1]], [g[0] + k * 0.16, g[1] + k * 0.16], [g[0], g[1] + k], [g[0] - k * 0.16, g[1] + k * 0.16], [g[0] - k, g[1]], [g[0] - k * 0.16, g[1] - k * 0.16]]);
}

export const streetMarcus = (stage: 'road' | 'door') => {
  const at: V3 = stage === 'road' ? [-0.42, 0, -0.45] : [-1.85, 0.32, 0.3], facing: [number, number] = stage === 'road' ? [0.15, 1] : [0.6, 1];
  // raised right fist beside the head (P07 height); the hand itself stays the painted mitten at this distance (figure scale, 2.7 m)
  const rig = rigHands(bodyFacing(MARCUS_BARE, at, facing), {right: {gesture: 'pinch', w: [0.2, 0.2, 0.08], f: [0, 1, 0.1], b: [0.3, 0, -1]}}, 43000,
    {coin: 'right', coinScale: 2.6, coinFace: [0, 0, 1]});
  return {at, facing, rig};
};
function streetScene(c: YCam, L: StreetLight, id: string, stage: 'road' | 'door', close = false) {
  return (p: Painter) => paintStreet(p, c, L, (q, cc) => {
    const mAt: V3 = stage === 'road' ? [-0.42, 0, -0.45] : [-1.85, 0.32, 0.3];
    const pAt: V3 = close ? [0.55, 0, -2.1] : stage === 'road' ? [0.62, 0, 0.15] : [-1.75, 0.32, -1.5];
    const marcusFirst = stage === 'road' && !close;
    let m: FigAnchors | null = null;
    const paintM = () => {
      const sm = streetMarcus(stage), w = camPoint(cc, sm.rig.placed.right!.hand.wrist), e = camPoint(cc, sm.rig.placed.right!.E);
      let fist: Pt | null = null;
      m = act(q, cc, {def: MARCUS_BARE, at: mAt, facing: sm.facing, pose: 'P07', face: 'happy', seed: 2651,
        arms: (g, u, v, an) => {
          if (!close || !an) return w && e ? {rArm: arm(w, e, {fist: 1})} : {};
          // R5: the raised fist beside his head, elbow out and down (a bent "victory" arm within two bones, not a rod)
          const S = an.rShoulder, uu = camUnit(cc, [mAt[0], 1.2, mAt[2]]);
          fist = [S[0] - 0.13 * uu, S[1] - 0.25 * uu];
          return {rArm: arm(fist, [S[0] - 0.25 * uu, S[1]], {fist: 1})};
        }});
      const pc = coinOf(cc, sm.rig);
      if (close && fist) {
        const f = fist as Pt, uu = camUnit(cc, [mAt[0], 1.4, mAt[2]]);
        paintHeroCoin(q, [f[0] + 0.005 * uu, f[1] - 0.085 * uu], 0.012 * LF07_COIN * uu, 34800);
        PROBE[id] = {...(PROBE[id] ?? {}), coinX: Math.round(f[0]), coinY: Math.round(f[1] - 0.085 * uu), coinPx: Math.round(0.024 * LF07_COIN * uu)};
      } else if (pc) paintCoin(q, pc.at, pc.r, 34800, 0.15);
      probe(id, 'marcus', m);
    };
    const paintP = () => {
      const pa = act(q, cc, {def: PASSERBY, at: pAt, facing: stage === 'road' ? [-1, 0.45] : [0.2, 1], pose: 'P12', face: 'disgusted', seed: 2652,
        fig: {lean: stage === 'road' ? 0.16 : -0.1},
        arms: (g, u, view) => {
          const base = poseArms('P01', PASSERBY, g, u, view === 'back' ? 'front' : view);
          const hy = g[1] - (PASSERBY.height - 0.2) * u, dir = stage === 'road' ? -1 : 1;
          const nose: Pt = [g[0] + dir * 0.06 * u, hy + 0.11 * u];
          return {rArm: base.rArm, lArm: arm(nose, [g[0] + dir * 0.16 * u, hy + 0.32 * u], {fist: -1})};
        },
        held: (qq, a, u) => hardFill(qq, 34900, '#b88a4f', [[a.rHand[0] - 0.14 * u, a.rHand[1] - 0.04 * u], [a.rHand[0] + 0.14 * u, a.rHand[1] - 0.04 * u], [a.rHand[0] + 0.11 * u, a.rHand[1] + 0.14 * u], [a.rHand[0] - 0.11 * u, a.rHand[1] + 0.14 * u]])});
      probe(id, 'passer', pa);
    };
    if (marcusFirst) { paintM(); } else { paintP(); paintM(); }
    const mm = m as FigAnchors | null;
    if (mm) {
      const u = camUnit(cc, mAt);
      const sh: Pt[] = [[mm.lShoulder[0], mm.lShoulder[1]], [mm.rShoulder[0], mm.rShoulder[1]]];
      const ro = close ? 0.7 : 1; // the close ending keeps the ribbons thinner so the coin and the passer-by stay clear
      paintRibbons(q, 35000, [sh[0][0] + 0.05 * u, sh[0][1]], [sh[0][0] + 0.45 * u, sh[0][1] - 0.75 * u], {w: 0.08 * u * ro, op: Math.round(175 * ro + 30 * (1 - ro)), spread: 0.07 * u * ro, bow: 0.2, waves: 1.6});
      if (!close) paintRibbons(q, 35030, [sh[1][0] - 0.02 * u, sh[1][1]], [noseOf(mm, 0, 0)[0] - 0.05 * u, mm.headTop - 0.25 * u], {w: 0.07 * u, op: 165, spread: 0.06 * u, bow: -0.35, count: 2, waves: 1.5});
    }
    if (marcusFirst) paintP();
  });
}

// ------------------------------------------------------------------------------------------------------------------ KP-MARCUS

function paintKP(p: Painter) {
  hardFill(p, 36000, '#e7cf9e', [[-10, -10], [1090, -10], [1090, 1930], [-10, 1930]]);
  hardFill(p, 36001, '#d5b37a', [[-10, 1620], [1090, 1620], [1090, 1930], [-10, 1930]]);
  const xs = [-0.78, -0.26, 0.26, 0.78];
  const cam: YCam = {x: 0, y: 0.9, z: 2.6, yaw: 0, f: 1280, hy: 1180};
  const views: FigPose['view'][] = ['front', 'right', 'back', 'left'];
  views.forEach((v, i) => probe('KP-MARCUS', `turn${i}`, act(p, cam, {def: MARCUS, at: [xs[i], 0, 0], view: v, face: 'happy', seed: 2660 + i})));
}

// Close key poses (1.3 m, thigh-up, five-finger 3D hands): one camera per cell, the picture shifted into its cell with `cx` and `hy`.
type KPCell = {id: string; col: 0 | 1; row: 0 | 1; def: CastDef; facing: [number, number]; face: ExpressionId; look?: [number, number]; three?: ('right' | 'left')[];
  hands: (b: ReturnType<typeof bodyFacing>) => HandRig};
const KP_CELLS: KPCell[] = [
  {id: 'vow', col: 0, row: 0, def: MARCUS, facing: [0, 1], face: 'smug', hands: (b) => rigHands(b, {
    right: {gesture: 'open-spread', w: [0.12, -0.04, 0.2], f: [0.05, 1, 0.1], b: [0, 0, 1]},
    left: {gesture: 'open-spread', w: [0.12, -0.04, 0.2], f: [0.05, 1, 0.1], b: [0, 0, 1]}}, 44000)},
  {id: 'pinch', col: 1, row: 0, def: MARCUS, facing: [0, 1], face: 'disgusted', three: ['right'], hands: (b) => rigHands(b, {
    right: {gesture: 'pinch', put: {landmark: LANDMARKS.pinch, at: facePoint(b, 0.12, -0.03)}, f: [-0.3, 1, 0.2], b: [0.2, 0, 1]},
    left: {gesture: 'point', w: [0.26, 0.06, 0.26], f: [0.6, 0.08, 0.8], b: [0, 1, 0]}}, 44500)},
  {id: 'bluff', col: 0, row: 1, def: MARCUS_BARE, facing: [0, 1], face: 'worried', look: [0.6, 0.1], hands: (b) => rigHands(b, {
    right: {gesture: 'claw', w: [0.02, 0.42, -0.02], f: [-0.75, 0.45, 0], b: [0.45, 1, 0]}, left: HANG}, 45000)},
  {id: 'sniff', col: 1, row: 1, def: MARCUS_BARE, facing: [1, 0], face: 'relieved', three: ['right'], hands: (b) => {
    // R5: coin 7 cm ahead of the nose and lifted clear of the fingertips, the back of the hand turned away from the lens (the palm side
    // and the coin face the camera), the elbow re-solved down-forward so the upper arm leaves the shoulder at an angle, not as a level pipe
    const nose = facePoint(b, 0.12, -0.03), coin: V3 = [nose[0] + 0.08, nose[1] + 0.01, nose[2] + 0.03];
    return rigHands(b, {right: {gesture: 'pinch', put: {landmark: LANDMARKS.pinch, at: [coin[0], coin[1] - 0.012 * COIN_SCALE * 2.6, coin[2]]}, f: [0.1, 1, 0.1], b: [0.5, 0, -1]}},
      45500, {coin: 'right', coinScale: COIN_SCALE, coinFace: [0, 0, 1], coinLift: 2.6, pole: {right: [0.1, -1, 0.6]}});
  }},
];
const KP_TOP = 150, KP_H = 885;
const kpCam = (c: KPCell): YCam => ({x: 0, y: 1.2, z: 1.3, yaw: 0, f: 720, hy: KP_TOP + c.row * KP_H + 400, cx: c.col ? 270 : -270, near: 0.1});
const kpBody = (c: KPCell) => bodyFacing(c.def, [0, 0, 0], c.facing);
const kpHands = () => KP_CELLS.filter((c) => c.three).map((c) => layer(kpCam(c), pick3D(c.hands(kpBody(c)), c.three!, 'right')));
function paintKPClose(p: Painter) {
  hardFill(p, 36500, '#e7cf9e', [[-10, -10], [1090, -10], [1090, 1930], [-10, 1930]]);
  for (const row of [0, 1] as const) {
    const y0 = KP_TOP + row * KP_H;
    hardFill(p, 36510 + row, row ? '#dfc28c' : '#e7cf9e', [[-10, y0], [1090, y0], [1090, 1930], [-10, 1930]]);
    hardFill(p, 36520 + row, '#cdb07a', [[539, y0], [541, y0], [541, y0 + KP_H], [539, y0 + KP_H]]);
    KP_CELLS.filter((c) => c.row === row).forEach((c, k) => {
      const cam = kpCam(c), rig = c.hands(kpBody(c));
      probe('KP-MARCUS-CLOSE', c.id, act(p, cam, {def: c.def, at: [0, 0, 0], facing: c.facing, face: c.face, look: c.look, seed: 2680 + row * 2 + k,
        arms: () => paintedArms(cam, rig, {noHand: c.three ?? []})}));
      const pc = coinOf(cam, rig);
      if (pc && !c.three?.includes('right')) paintCoin(p, pc.at, pc.r, 36600 + k, 0.12);
    });
  }
}

// ------------------------------------------------------------------------------------------------------------------ KP-INSET wine inset

// B03-SH05 / L09 (VD26-12): a cheerful grape treader knee-deep in a wooden vat under daylight, cup at her lips, in a 420 px round inset
// top-right over the LF05 stall shot (Marcus keeps treading, face souring). Inset space: origin at the vat centre on the ground, +x screen
// right, +y up, +z toward the inset camera; vat radius 0.55 m, rim 0.62 m, grapes to 0.5 m. Own camera, shifted into the window by `cx`/`hy`.
export const INSET = {cx: 790, cy: 470, r: 210};
const INSET_CAM: YCam = {x: 0, y: 1.2, z: 2.3, yaw: 0, pitch: -5 * DEG, f: 520, hy: INSET.cy + 20, cx: INSET.cx - 540};
const VAT = {r: 0.55, rim: 0.62, fill: 0.5};
function paintInset(p: Painter) {
  const c = INSET_CAM, ring = (y: number, r: number, n = 30) => flatCircle(c, [0, y, 0], r, n);
  // daylight vineyard: sky, a far green hill, vine rows on posts, sunlit ground
  hardFill(p, 38000, '#9fd0ea', [[INSET.cx - 260, INSET.cy - 260], [INSET.cx + 260, INSET.cy - 260], [INSET.cx + 260, INSET.cy + 260], [INSET.cx - 260, INSET.cy + 260]]);
  wFill(p, c, 38001, '#86b45c', [[-6, 0, -9], [6, 0, -9], [6, 1.6, -9], [2, 2.1, -9], [-2, 1.8, -9], [-6, 2.0, -9]]);
  wFill(p, c, 38002, '#d8b56a', qy(0, -6, 6, -9, 3));
  for (let i = 0; i < 3; i++) {
    const z = -2.2 - i * 1.6;
    wFill(p, c, 38010 + i * 4, mixColor('#4f8a3a', '#86b45c', i * 0.3), [[-6, 0.6, z], [6, 0.6, z], [6, 1.45, z], [-6, 1.5, z]]);
    for (let k = -4; k <= 4; k++) wFill(p, c, 38020 + i * 20 + k + 4, '#7a5532', [[k * 0.9 - 0.03, 0, z + 0.01], [k * 0.9 + 0.03, 0, z + 0.01], [k * 0.9 + 0.03, 1.5, z + 0.01], [k * 0.9 - 0.03, 1.5, z + 0.01]]);
    for (let g = 0; g < 9; g++) { const q = camPoint(c, [-3.2 + g * 0.8 + 0.3 * hash(38100 + i * 10 + g), 0.95, z + 0.02]); if (q) hardFill(p, 38110 + i * 10 + g, R4.grape, ell(q[0], q[1], 4 - i, 6 - i, 8)); }
  }
  // vat: the inner back wall, the treader, the grape heap over her shins, then the front staves and rim
  const shadow = camPoint(c, [0.1, 0, 0.05]);
  if (shadow) washAt(p, 38200, '#6a4a2a', 120, ell(shadow[0], shadow[1], VAT.r * 1.25 * camUnit(c, [0, 0, 0]), 0.2 * camUnit(c, [0, 0, 0]), 20), 0.25, 0.3);
  const back = ring(VAT.rim, VAT.r).filter((_, i, a) => i >= a.length / 2), fillTop = ring(VAT.fill, VAT.r * 0.98);
  hardFill(p, 38201, mixColor(R4.vat, '#000000', 0.35), [...back, ...fillTop.filter((_, i, a) => i >= a.length / 2).reverse()]);
  let cup: Pt | null = null;
  probe('KP-INSET', 'graper', act(p, c, {def: GRAPER, at: [0, VAT.fill - 0.38, -0.05], facing: [0.15, 1], face: 'laugh', seed: 2690,
    arms: (g, u, v, an) => {
      if (!an) return {};
      const K = (an.chin - an.headTop) / 2.39, S = an.rShoulder;
      cup = [an.head[0] - 0.35 * K, an.chin - 0.2 * K];
      return {rArm: arm([cup[0] - 0.05 * u, cup[1] + 0.07 * u], [S[0] - 0.12 * u, S[1] + 0.2 * u], {fist: 1}), lArm: arm([an.lShoulder[0] + 0.26 * u, an.lShoulder[1] + 0.02 * u], [an.lShoulder[0] + 0.2 * u, an.lShoulder[1] + 0.2 * u], {open: 1})};
    }}));
  // the clay cup tipped to her lips (painted after the figure)
  const cu = cup as Pt | null;
  if (cu) {
    const u = camUnit(c, [0, 1.4, 0]);
    const k = 1.7;
    hardFill(p, 38300, '#b5643e', [[cu[0] - 0.045 * k * u, cu[1] - 0.035 * k * u], [cu[0] + 0.04 * k * u, cu[1] - 0.05 * k * u], [cu[0] + 0.03 * k * u, cu[1] + 0.05 * k * u], [cu[0] - 0.03 * k * u, cu[1] + 0.055 * k * u]]);
    hardFill(p, 38301, '#e09a6a', [[cu[0] - 0.04 * k * u, cu[1] - 0.03 * k * u], [cu[0] - 0.015 * k * u, cu[1] - 0.04 * k * u], [cu[0] - 0.01 * k * u, cu[1] + 0.04 * k * u], [cu[0] - 0.03 * k * u, cu[1] + 0.045 * k * u]]);
    inkLine(p, 38302, [[cu[0] - 0.045 * k * u, cu[1] - 0.035 * k * u], [cu[0] + 0.04 * k * u, cu[1] - 0.05 * k * u], [cu[0] + 0.03 * k * u, cu[1] + 0.05 * k * u], [cu[0] - 0.03 * k * u, cu[1] + 0.055 * k * u]], {closed: true, color: '#6a3420', weight: 1.4, still: true});
  }
  // grapes: the heap surface (front half over the shins) with bunches and squashed juice, splashes on the rim
  hardFill(p, 38400, R4.grapeDark, [...fillTop]);
  for (let g = 0; g < 70; g++) {
    const a = hash(38410 + g) * 6.283, rr = Math.sqrt(hash(38500 + g)) * VAT.r * 0.95;
    const q = camPoint(c, [Math.cos(a) * rr, VAT.fill + 0.01, Math.sin(a) * rr]);
    if (q) hardFill(p, 38600 + g, g % 3 ? R4.grape : R4.grapeLit, ell(q[0], q[1], 6.5, 5.5, 8));
  }
  const fr = ring(VAT.rim, VAT.r).filter((_, i, a) => i <= a.length / 2), fb = ring(0.02, VAT.r).filter((_, i, a) => i <= a.length / 2);
  hardFill(p, 38700, R4.vat, [...fr, ...fb.reverse()]);
  for (let k = 1; k < 8; k++) {
    const a = (k / 8) * Math.PI, x = Math.cos(a) * VAT.r, z = Math.sin(a) * VAT.r;
    wInk(p, c, 38710 + k, [[x, 0.03, z], [x, VAT.rim - 0.02, z]], {closed: false, color: '#5e3a22', weight: 1.2});
  }
  for (const [j, y] of [[0, 0.14], [1, 0.48]] as const) inkLine(p, 38720 + j, ring(y, VAT.r + 0.005).filter((_, i, a) => i <= a.length / 2), {closed: false, color: '#3e2a1c', weight: 3, still: true});
  inkLine(p, 38730, ring(VAT.rim, VAT.r), {closed: true, color: R4.vatLit, weight: 3, still: true});
  for (let d = 0; d < 6; d++) {
    const q = camPoint(c, [-0.4 + d * 0.16, VAT.rim + 0.04 + 0.08 * hash(38740 + d), 0.45]);
    if (q) hardFill(p, 38750 + d, R4.grapeLit, ell(q[0], q[1], 4, 5, 8));
  }
}
function paintKPInset(p: Painter) {
  paintLF05(p);
}

// ------------------------------------------------------------------------------------------------------------------ registry

export const R4_STILLS: Record<string, R4Still> = {
  'TH-WA': {kind: 'thumb', shot: 'B01-SH04 end / B01-SH05', paper: '#d9a65c', note: 'Workshop A: wide from the bench, morning sun shaft from the roof well onto the three tread stalls; senior treading; Marcus at the bright doorway', paint: workshopThumb(WS.A, {mood: 'morning', draft: true}, null, 'TH-WA')},
  'TH-WB': {kind: 'thumb', shot: 'B01-SH05', paper: '#d9a65c', note: 'Workshop B: from the jar corner toward the street door, backlit cool interior, warm door', paint: workshopThumb(WS.B, {mood: 'door', draft: true}, {at: [-2.45, 0, 0.35], facing: [1, 0.3]}, 'TH-WB')},
  'TH-WC': {kind: 'thumb', shot: 'B01-SH04 frame 0', paper: '#d9a65c', note: 'Workshop C: high and close, looking down into the tread stall: the senior\'s legs in the liquid, cloth underfoot (hook frame 0 idea)', paint: workshopThumb(WS.C, {mood: 'morning', draft: true}, null, 'TH-WC')},
  'TH-IA': {kind: 'thumb', shot: 'B06-SH02', paper: '#9b2f25', note: 'Imperial room A: square two-shot, warm lamp key, red panels, window gold behind Vespasian', paint: palaceScene(PC.A, {mood: 'lamp', draft: true}, 'TH-IA', false)},
  'TH-IB': {kind: 'thumb', shot: 'B06-SH02', paper: '#9b2f25', note: 'Imperial room B: angled from the curtained door, cooler window daylight, lamp low', paint: palaceScene(PC.B, {mood: 'window', draft: true}, 'TH-IB', false)},
  'TH-SA': {kind: 'thumb', shot: 'B06-SH05', paper: '#34508a', note: 'Street A: down the street at dusk, Marcus walks home with his coin up, the passer-by turns away pinching her nose', paint: streetScene(SC.A, {mood: 'dusk', draft: true}, 'TH-SA', 'road')},
  'TH-SB': {kind: 'thumb', shot: 'B06-SH05', paper: '#24305a', note: 'Street B: across from the fullery door, later dusk; Marcus steps out, the passer-by recoils on the sidewalk', paint: streetScene(SC.B, {mood: 'late', draft: true}, 'TH-SB', 'door')},
  'LF04': {kind: 'look', shot: 'B02-SH02', paper: '#d9a65c', caption: 'ฝาเปิดปุ๊บ กลิ่นมาถึงก่อนคำอธิบาย', note: 'Smell hit: lid off, CL04 ribbons jar to nose, Marcus disgusted with an open mitten raised at the jar, senior beaming', paint: (p) => paintLF04(p)},
  'LF05': {kind: 'look', shot: 'B03-SH02', paper: '#d9a65c', caption: 'ลงไปยืนในอ่าง ย่ำผ้าในน้ำผสมฉี่', note: 'Tread: Marcus in the middle stall to mid-shin, mittens braced on the partitions; senior wrings cloth with two fists; grey-green setback', paint: (p) => paintLF05(p)},
  'LF06': {kind: 'look', shot: 'B06-SH02 end', paper: '#9b2f25', caption: 'เขาเลยเอาเหรียญจ่อจมูกลูก', note: 'Imperial room: Vespasian pinches the 3D coin at Titus\'s nose with a five-finger 3D hand (CL03 mirror of B05); other hands mittens', paint: palaceScene(PC.LF06, {mood: 'lamp'}, 'LF06', true), hands: palaceHands(PC.LF06)},
  'LF07': {kind: 'look', shot: 'B06-SH05', paper: '#34508a', caption: 'แต่มาร์คุสยังมี', note: 'Street ending (R5 closer on the TH-SA axis): Marcus beams with his hero coin raised, CL04 ribbons rise off him, the passer-by behind him pinches her nose', paint: streetScene(SC.LF07, {mood: 'dusk'}, 'LF07', 'road', true)},
  'KP-INSET': {kind: 'look', shot: 'B03-SH05', paper: '#d9a65c', caption: 'เหมือนย่ำองุ่นทำไวน์ แค่อันนี้ไม่มีใครอยากชิม', note: 'Wine inset (VD26-12, L09): a 420 px round window top-right over the LF05 stall; inside, a cheerful grape treader knee-deep in a vat sips from a clay cup', paint: paintKPInset,
    inset: {...INSET, paper: '#9fd0ea', paint: paintInset}},
  'KP-INSET-PLATE': {kind: 'sheet', shot: 'B03-SH05 inset plate', paper: '#9fd0ea', note: 'VD26-12 inset plate alone (frame coordinates, circle at INSET)', paint: paintInset},
  'KP-MARCUS': {kind: 'sheet', shot: 'cast turnaround', paper: '#e7cf9e', note: 'Marcus in four views squared to the lens (figure scale, mittens)', paint: paintKP},
  'KP-MARCUS-CLOSE': {kind: 'sheet', shot: 'B01-SH06, B02-SH04, B04-SH05, B05-SH01', paper: '#e7cf9e', note: 'Marcus close key poses at 1.3 m: vow and bluff in mittens; nose pinch and coin sniff with the five-finger 3D right hand (fingers must read)', paint: paintKPClose, hands: kpHands},
};
void STALL_RIM;
