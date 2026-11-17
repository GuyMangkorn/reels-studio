import type {CastDef, FigAnchors} from '../kit/cast';
import {ell, hardFill, inkLine, INK} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {CAST} from './palette';

// EDU-EP22-SHORT cast (EDU-EP22-BRIEF-R1 VD02/VD03, casting lines in short/storyboard.md EDU-EP22-STORYBOARD-R1). Designed from the script first
// (brief: Visual intent), then matched to the kit: the head families come from `PEOPLE`, the Qing dress and the headwear are new (N2, N3; dress
// simplified and `est`, Boat Q-B1 open). Boss W3.1 (look thumbnails); filed into the kit only at kit intake (W8.4).
//
// - CHILD `new: child emperor` (about five, 1.05 m): the kit child head family (boy-school: round eye, button nose, line mouth) at headScale 0.88,
//   skin #efc9a0, the front shaved under a black satin skullcap with a red knot, a small queue at the back (profile and back views only).
//   `new: qing-child-robe`: imperial-yellow robe to the ankles (shirt, sleeves and the long skirt in one colour, roundels painted by `paintRoundels`)
//   under a stone-blue sleeveless short over-jacket (the rig's open `jacket` panels; est: the brief's over-jacket drawn without sleeves).
// - EUNUCH `man-crop` / `man-shaved` heads (beardless, glasses off) + `new: qing-eunuch-robe` in two tints (slate for the taster, lifters and
//   carriers; light blue for the young caller) under the darker sleeveless over-jacket, + `new: qing-court-cap` (black round crown on an upturned
//   brim).

const CHILD_HEAD = PEOPLE['boy-school'].head;

/** CHILD (Puyi, staged reconstruction): 1.05 m, headScale 0.88 (brief projection contract), arms of the kit child (0.72). */
export const CHILD: CastDef = {
  height: 1.05, headScale: 0.88, armScale: 0.72, seed: 2201,
  head: {...CHILD_HEAD, skin: CAST.childSkin, hair: '#1a1716', cut: 'shaved'},
  outfit: {
    shoulder: 0.27, shirt: CAST.childRobe, sleeve: CAST.childRobe, longSleeves: true, jacket: CAST.childJacket,
    skirt: CAST.childRobe, skirtHem: 0.05, pants: CAST.childRobeShade, shoes: '#1c1a1a', boots: true,
  },
};

export type EunuchTint = 'slate' | 'light';
const ROBE: Record<EunuchTint, string> = {slate: CAST.eunuchRobe, light: CAST.callerRobe};

/** A eunuch in `new: qing-eunuch-robe` from a kit head (`man-crop` for lifters and carriers, `man-shaved` with glasses off for the taster). */
export const eunuch = (from: 'man-crop' | 'man-shaved', tint: EunuchTint, o: {height?: number; seed: number; skin?: string}): CastDef => {
  const base = PEOPLE[from];
  const head = {...base.head, skin: o.skin ?? CAST.eunuchSkin, cut: 'shaved' as const, glasses: false};
  delete (head as {facial?: unknown}).facial;
  return {
    ...base, height: o.height ?? base.height, seed: o.seed, head,
    outfit: {
      shoulder: Math.min(base.outfit.shoulder, 0.4), shirt: ROBE[tint], sleeve: ROBE[tint], longSleeves: true, jacket: CAST.eunuchJacket,
      skirt: ROBE[tint], skirtHem: 0.08, pants: mixColor(ROBE[tint], '#000000', 0.2), shoes: '#18181c', boots: true,
    },
  };
};

/** Lifters E1-E3 (brief VD03: seed and height varied, slate robes). */
export const LIFTERS: CastDef[] = [
  eunuch('man-crop', 'slate', {height: 1.70, seed: 2211}),
  eunuch('man-crop', 'slate', {height: 1.66, seed: 2212, skin: '#c89a6e'}),
  eunuch('man-crop', 'slate', {height: 1.73, seed: 2213, skin: '#d2a275'}),
];
/** TASTER T (storyboard casting: `man-shaved` + `new: qing-eunuch-robe` slate + `new: qing-court-cap`, glasses off; W5.1, 1.72 m). */
export const TASTER: CastDef = eunuch('man-shaved', 'slate', {height: 1.72, seed: 2231, skin: '#cf9f74'});
/** Carriers K1-K4 (storyboard casting: `man-crop`, slate robe, court cap; seeds, heights and skin varied; W5.1). */
export const CARRIERS: CastDef[] = [
  eunuch('man-crop', 'slate', {height: 1.69, seed: 2241, skin: '#d6a57a'}),
  eunuch('man-crop', 'slate', {height: 1.72, seed: 2242, skin: '#c99a70'}),
  eunuch('man-crop', 'slate', {height: 1.67, seed: 2243}),
  eunuch('man-crop', 'slate', {height: 1.74, seed: 2244, skin: '#d0a073'}),
];
/**
 * CALLER Y `new: teen eunuch` (W5.1; was the adult crop head until this pass): about fifteen, 1.58 m, the kit child head family (`boy-school`:
 * round eye, button nose, line mouth) at headScale 0.96 on the eunuch body, a narrower shoulder, light-blue robe, court cap. Reads as a youth
 * beside the adult eunuchs (rounder face, larger head share) and not as the child emperor (no skullcap, no yellow).
 */
export const CALLER: CastDef = (() => {
  const base = eunuch('man-crop', 'light', {height: 1.58, seed: 2221, skin: '#dcae82'});
  return {...base, headScale: 0.96, armScale: 0.92, head: {...CHILD_HEAD, skin: '#dcae82', hair: '#1a1716', cut: 'shaved'}, outfit: {...base.outfit, shoulder: 0.34}};
})();

// ---------------------------------------------------------------------------------------------------------------- headwear (held props)
// Drawn after the figure from its anchors: `head` is the head centre, `headTop` sits 1.17 head units above it and `chin` 1.22 below (kit
// cast.ts), so one head unit K = (chin - headTop) / 2.39 px and the skull is about 1.03 K wide each side (hair.ts cap).

type View = 'front' | 'left' | 'right' | 'back';
const headK = (a: FigAnchors) => (a.chin - a.headTop) / 2.39;
const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 16): Pt[] =>
  Array.from({length: n + 1}, (_, i): Pt => { const a = a0 + ((a1 - a0) * i) / n; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });

/** `new: qing-skullcap-queue`: black satin skullcap of six panels with a red knot; in profile and back views the queue hangs down the back. */
export const paintSkullcap = (p: Painter, a: FigAnchors, view: View, seed: number) => {
  const K = headK(a), [hx, hy] = a.head, dir = view === 'left' ? -1 : view === 'right' ? 1 : 0;
  if (dir !== 0 || view === 'back') paintQueue(p, a, K, view === 'back' ? 0 : -dir, seed + 20, 0.45, 0.7);
  const cx = hx - dir * 0.08 * K, base = hy - 0.5 * K;
  const dome = [...arc(cx, base, 1.1 * K, 0.74 * K, Math.PI, 2 * Math.PI, 20), [cx + 1.1 * K, base + 0.08 * K] as Pt, [cx - 1.1 * K, base + 0.08 * K] as Pt];
  hardFill(p, seed, CAST.skullcap, dome);
  hardFill(p, seed + 1, mixColor(CAST.skullcap, '#ffffff', 0.16), arc(cx + 0.3 * K, base - 0.42 * K, 0.34 * K, 0.16 * K, 0, 2 * Math.PI, 12));
  hardFill(p, seed + 2, mixColor(CAST.skullcap, '#000000', 0.4), [[cx - 1.12 * K, base - 0.06 * K], [cx + 1.12 * K, base - 0.06 * K], [cx + 1.1 * K, base + 0.1 * K], [cx - 1.1 * K, base + 0.1 * K]]);
  for (const s of [-0.55, 0, 0.55]) inkLine(p, seed + 3 + Math.round(s * 10), [[cx + s * 0.5 * K, base - 0.72 * K], [cx + s * 1.45 * K, base - 0.05 * K]], {closed: false, weight: 0.7, color: '#4a4446', still: true});
  inkLine(p, seed + 12, dome, {weight: 0.9, color: INK, still: true});
  hardFill(p, seed + 13, CAST.knot, ell(cx, base - 0.78 * K, 0.17 * K, 0.15 * K, 12));
  hardFill(p, seed + 14, mixColor(CAST.knot, '#ffffff', 0.35), ell(cx + 0.05 * K, base - 0.83 * K, 0.06 * K, 0.05 * K, 8));
};

/** The queue (braid) from the back of the head down to `len` head units x 2 below the chin, toward screen side `side` (0 = straight down, back view). */
const paintQueue = (p: Painter, a: FigAnchors, K: number, side: number, seed: number, len: number, wk = 1) => {
  const [hx, hy] = a.head, x0 = hx + side * 0.85 * K, y0 = hy - 0.1 * K, y1 = a.chin + len * 2 * K;
  const pts: Pt[] = [];
  for (let i = 0; i <= 8; i++) { const u = i / 8, w = (0.2 - 0.08 * u) * K * wk; pts.push([x0 + side * 0.15 * K * u - w, y0 + (y1 - y0) * u]); }
  for (let i = 8; i >= 0; i--) { const u = i / 8, w = (0.2 - 0.08 * u) * K * wk; pts.push([x0 + side * 0.15 * K * u + w, y0 + (y1 - y0) * u]); }
  hardFill(p, seed, '#1a1716', pts);
  for (let i = 1; i < 8; i++) { const u = i / 8, y = y0 + (y1 - y0) * u, x = x0 + side * 0.15 * K * u; inkLine(p, seed + i, [[x - 0.14 * K, y - 0.08 * K], [x + 0.14 * K, y + 0.08 * K]], {closed: false, weight: 0.6, color: '#3a3433', still: true}); }
  hardFill(p, seed + 9, CAST.knot, ell(x0 + side * 0.15 * K, y1 + 0.06 * K, 0.09 * K * wk, 0.12 * K * wk, 8));
};

/** `new: qing-court-cap`: a black round crown on an upturned brim (simplified Qing court cap, est). */
export const paintCourtCap = (p: Painter, a: FigAnchors, view: View, seed: number) => {
  const K = headK(a), [hx, hy] = a.head, dir = view === 'left' ? -1 : view === 'right' ? 1 : 0;
  if (dir !== 0 || view === 'back') paintQueue(p, a, K, view === 'back' ? 0 : -dir, seed + 20, 1.0, 0.85);
  const cx = hx - dir * 0.06 * K, b0 = hy - 0.5 * K, b1 = hy - 1.02 * K;
  const crown = [...arc(cx, b1 + 0.05 * K, 0.92 * K, 0.5 * K, Math.PI, 2 * Math.PI, 18), [cx + 0.92 * K, b1 + 0.2 * K] as Pt, [cx - 0.92 * K, b1 + 0.2 * K] as Pt];
  hardFill(p, seed, CAST.cap, crown);
  hardFill(p, seed + 1, mixColor(CAST.cap, '#ffffff', 0.12), arc(cx + 0.25 * K, b1 - 0.22 * K, 0.3 * K, 0.12 * K, 0, 2 * Math.PI, 12));
  const brim: Pt[] = [[cx - 1.28 * K, b1 + 0.02 * K], [cx + 1.28 * K, b1 + 0.02 * K], [cx + 1.1 * K, b0], [cx - 1.1 * K, b0]];
  hardFill(p, seed + 2, mixColor(CAST.cap, '#3a3a44', 0.5), brim);
  inkLine(p, seed + 3, brim, {weight: 0.9, color: INK, still: true});
  inkLine(p, seed + 4, crown, {weight: 0.8, color: INK, still: true});
  hardFill(p, seed + 5, '#3a3c48', ell(cx, b1 - 0.48 * K, 0.12 * K, 0.1 * K, 10));
};

/** Roundels on the child's robe sleeves (simplified round dragon roundels: plain rings, no dragon drawing): front view, both upper arms. */
export const paintRoundels = (p: Painter, a: FigAnchors, u: number, seed: number) => {
  const r = 0.022 * u;
  const at: Pt[] = [a.rUpper, a.lUpper];
  at.forEach(([x, y], i) => {
    hardFill(p, seed + i * 2, CAST.childRobeShade, ell(x, y, r, r * 0.9, 14));
    inkLine(p, seed + i * 2 + 1, ell(x, y, r * 0.62, r * 0.56, 12), {weight: 0.6, color: CAST.roundel, still: true});
  });
};
