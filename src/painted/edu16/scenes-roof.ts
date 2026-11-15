import {ell, hardFill, washAt} from '../kit/draw';
import type {FigAnchors, FigPose} from '../kit/cast';
import type {FaceState} from '../kit/head';
import {paintFigureAt} from '../kit/figure-at';
import {capsule, FINGER_IDS, inkLine, macroAnchors, paintHandMacro, type HandAnchors, type HandMacro} from '../kit/hands';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, orbitYCam, type YCam} from '../kit/ycam';
import {qy, wFill, wp} from '../kit/world';
import {AGED, HAND16, paintHeadphones, paintMitten, stoopFig, WOMAN, type AgeKey, type MittKind} from './cast';
import {TH} from './palette';
import {paintCrate, paintReplyBox, paintRoof, paintStool, RF, ROOF, type RoofState} from './roof';
import {paintLight, paintThread, paintVoid, threadAt} from './thought';

// EDU-EP16-SHORT roof and woman look stills (Film W3 group 2, 2026-11-14; brief EDU-EP16-BRIEF-R2, rows EDU-EP16-ROWS-R1): LF-ROOF (= SH01 W-PING),
// SH03 (finger stop macro), SH21 (W-OFF wide, lamp off), SH22 (logbook test, label off), SH23 (real-sky hold, no label, no title) and the IM1 aged-woman
// keys SH07-A21 / -A50 / -A81 (N2). Cameras follow the brief's shot plan; W3 changes to its `est` values are marked "W3" with the reason.

const DEG = Math.PI / 180;
export const MEASURE: Record<string, FigAnchors | null> = {};
/** Lead measure mode (look-roof `--props='{"measure":true}'`): the figure paints as a flat #ff00ff silhouette, no rim or gear, for a pixel bbox. */
export const MEASURE_MODE = {on: false};
const MAGENTA = '#ff00ff';
const pitched = (c: YCam, pitch: number, hy: number, cx = 0): YCam => ({...c, pitch: pitch * DEG, hy, cx});

// ---------- LF-ROOF = SH01 (W-PING, frame 0) ----------
// Brief VD02 `cam: yaw -30, r 2.6->2.3, eye 0.9, pitch +8, f 950`, target (-0.25, 0.55, 0.1). W3 (v2): r 1.95 -> 1.75, eye 0.62, f 900, hy 760: at the
// brief's radius she was 470 px with 45 % empty deck under her (UT03, UT13); now lead ~530 px, the button at y ~1030 above the caption band, the
// skyline clearing the parapet behind her head (low camera, looking up at the sky she watches).
// W3 (v9, viewer check R-C "reads as standing behind a console"): the front-view sit hid her thighs behind the crate, so she now sits side-on (view
// `left`, facing the crate, four views squared to the lens) with the camera nearer and more frontal: yaw -14, r 1.2 (k 0) -> 1.0 (k 1), eye 0.70,
// pitch +6, f 950, target (-0.20, 0.50, 0.10): bent knees, thighs level on the stool and the finger over the lit button read at 270 px; root
// (0.04, 0, -0.02) keeps her knees clear of the crate and the thermos off her legs. Lead ~1000 px (was ~530).
export const SH01_AT: V3 = [0.04, 0, -0.02];
export const camSH01 = (k = 0): YCam => pitched(orbitYCam([-0.2, 0.5, 0.1], 1.2 - 0.2 * k, -14 * DEG, 0.7, 950, 560), 6, 560, 0);
export const ROOF_B01: RoofState = {t: 0.4, lamp: true, trace: 'blip', blip: 0.42, cool: 0};

export type Mitt = {hand: 'r' | 'l'; kind: MittKind; side: 1 | -1; skin: string; lobe?: number; aimAt?: V3};
/** D1 (sheet R1, Boss W5.2): every roof shot seats her at SH01_AT; the retired W3 root AT0 (0, 0, 0.06) moved SH23 about 4 px. */
const AT0: V3 = SH01_AT;
export type WomanOpts = Parameters<typeof woman>[1];
export const woman = (c: YCam, o: {/** W5.2: extra FigPose fields (head cock, nod, look-up, rise), applied last */ fig?: Partial<FigPose>; /** W5.2: figure clock (blink), default 0.4 */ t?: number; /** W5.2: more face state (mouth, brows) merged with `look` */ faceState?: Partial<FaceState>; /** W5.2: no headphones (a custom head pass) */ noGear?: boolean; face: 'happy' | 'worried' | 'neutral' | 'scared'; reach?: V3; look?: Pt; warm?: number; night?: number; view?: 'front' | 'back' | 'left' | 'right'; rim?: string; mitts?: Mitt[]; at?: V3; /** v11: no rig floor shadow (SH21 wide: from the high camera it floated behind her as a disc; the stool paints its own) */ noShadow?: boolean; /** v9: the painter for the rim and mittens (outside the set's night grade, SH21) */ rimP?: Painter; /** v10: rim offsets (px) instead of the default +-5 pair (SH21: a strong rim on the city side) */ rimOff?: {dx: number; dy: number; color: string}[]; /** v10: a world target for the left wrist (SH21: resting on the crate edge) */ lReach?: V3; /** v10: the left elbow (world), drawn exactly (no IK splay) */ lVia?: V3; /** v10: the right elbow (world) */ rVia?: V3}, out: {a?: FigAnchors | null}) => ({
  at: o.at ?? AT0, draw: (p: Painter, cc: YCam) => {
    const at = o.at ?? AT0;
    paintStool(p, cc, [at[0], 0, at[2] - 0.06]); // the stool centre sits 6 cm behind the figure root (as before v9)
    const g = camPoint(cc, at), r0 = o.reach ? camPoint(cc, o.reach) : null;
    // back view: the rig mirrors front-view arm targets about the body centre (kit back.ts), so the world target is mirrored back first
    const reach: Pt | null = r0 && g && o.view === 'back' ? [2 * g[0] - r0[0], r0[1]] : r0;
    const lr = o.lReach ? camPoint(cc, o.lReach) : null, lv = o.lVia ? camPoint(cc, o.lVia) : null, rv = o.rVia ? camPoint(cc, o.rVia) : null;
    const fig = {warm: o.warm ?? 0, ...(reach ? {rArm: {to: reach, finger: true, ...(rv ? {via: rv} : {})}} : {}), ...(lr ? {lArm: {to: lr, ...(lv ? {via: lv} : {})}} : {}),
      // W5.2 r2 (user, 15 Nov): in `left` profile the reaching right arm is the far arm; the pose library paints it before the legs (`farArmUnder`), so it
      // read as under her thigh. Reaching for the button it passes in front of the knee: paint it after the legs (still under the torso).
      ...(reach && o.view === 'left' ? {farArmUnder: false} : {}), ...(o.fig ?? {})};
    const opts = {at, view: o.view ?? 'front' as const, pose: 'P31' as const, face: o.face, faceState: {...(o.look ? {look: o.look} : {}), ...(o.faceState ?? {})}, t: o.t ?? 0.4, fig, shadow: o.noShadow ? false as const : {op: 70}};
    if (MEASURE_MODE.on) {
      out.a = paintFigureAt(p, cc, WOMAN, {...opts, shadow: false, fig: {...fig, silhouette: MAGENTA}});
      // W5.2: anchor markers for the measure script: yellow = head centre, cyan = chin (6 px squares)
      if (out.a) { const h = out.a.head; hardFill(p, 53998, '#ffff00', [[h[0] - 3, h[1] - 3], [h[0] + 3, h[1] - 3], [h[0] + 3, h[1] + 3], [h[0] - 3, h[1] + 3]]); hardFill(p, 53999, '#00ffff', [[h[0] - 3, out.a.chin - 3], [h[0] + 3, out.a.chin - 3], [h[0] + 3, out.a.chin + 3], [h[0] - 3, out.a.chin + 3]]); }
      return;
    }
    if (o.rim) { // orange city rim: an offset silhouette under the figure (lamp off, W-OFF)
      const rp = o.rimP ?? p;
      (o.rimOff ?? [{dx: -5, dy: -3, color: o.rim}, {dx: 5, dy: -3, color: mixColor(o.rim, '#141a2a', 0.25)}]).forEach((r) =>
        paintFigureAt(rp, {...cc, cx: (cc.cx ?? 0) + r.dx, hy: cc.hy + r.dy}, WOMAN, {...opts, shadow: false, fig: {...fig, silhouette: r.color}}));
    }
    out.a = paintFigureAt(p, cc, WOMAN, {...opts, tint: {to: RF.night, u: o.night ?? 0.3}});
    // W3 v8: UT14 mittens over the rig's oval hands (user: "the hands need fixing"); the rim colours follow the figure's offset rim
    const fa = out.a, unit = camUnit(cc, at);
    if (fa) (o.mitts ?? []).forEach((m, i) => paintMitten(o.rimP ?? p, fa, {...m, aim: m.aimAt ? camPoint(cc, m.aimAt) ?? undefined : undefined, unit, seed: 53060 + i * 20, rim: o.rim ? [{color: o.rim, dx: -5}, {color: mixColor(o.rim, '#141a2a', 0.25), dx: 5}] : undefined}));
    if (o.noGear) return;
    if (out.a && (o.view ?? 'front') === 'front') paintHeadphones(p, out.a, {tint: RF.night});
    if (out.a && o.view === 'back') paintHeadphones(p, out.a, {tint: RF.night, seed: 53020});
    if (out.a && (o.view === 'left' || o.view === 'right')) paintHeadphones(p, out.a, {tint: RF.night, seed: 53030, profile: o.view === 'left' ? -1 : 1});
  },
});

/** W3 (v6): the lamp's light falls off below the action line: soft stacked night washes from y0 down keep the caption band y 1176-1344 low-value. */
export const lowFalloff = (p: Painter, seed: number, y0: number, a: number) => {
  [0, 1, 2].forEach((k) => washAt(p, seed + k, '#090c14', a, [[-10, y0 + k * 60], ...Array.from({length: 12}, (_, j): Pt => [j * 100, y0 + k * 60 + 14 * Math.sin(j * 1.7 + k)]), [1090, y0 + k * 60], [1090, 1930], [-10, 1930]], 0, 0));
};

export const paintLFRoof = (p: Painter, o: {k?: number} = {}) => {
  const c = camSH01(o.k ?? 0), at = SH01_AT, out: {a?: FigAnchors | null} = {};
  paintRoof(p, c, ROOF_B01, {replyAfter: true, cast: [woman(c, {face: 'happy', at, view: 'left', reach: [-0.31, 0.43, 0.33], look: [-0.55, 0.3], warm: 0.35, mitts: [{hand: 'l', kind: 'rest', side: 1, skin: '#b39e8b'}]}, out)]});
  // W3 v8: the pointing mitten over the reply box (its finger hovers over the button, so it is painted after the box the set draws last)
  if (out.a && !MEASURE_MODE.on) paintMitten(p, out.a, {hand: 'r', kind: 'point', side: 1, skin: '#b8a28e', unit: camUnit(c, at), seed: 53100, aim: camPoint(c, [ROOF.button[0], ROOF.button[1] + 0.01, ROOF.button[2]]) ?? undefined});
  lowFalloff(p, 53080, 1150, 60); // v9: from y 1150 at 60 (the nearer crate's lit top and front sit at the band; caption-zone p95 0.66 -> 0.38)
  MEASURE['LF-ROOF'] = out.a ?? null;
};

// ---------- SH03 (L02): the finger stops 1 cm above the lit button (hand macro, near-macro ECU) ----------
// Brief VD03: ECU on fingertip and button, near-macro, button glow on the fingertip; grade one step cooler (L02). Camera 0.25 m from the button from
// her right-front, slightly above (est). Background out of focus (soft masses: her slate trousers, coral cuff, the lamp's warm bloom, green screen spill).
// W3 (v3): camera just above the knuckle line (y 0.41, pitch -7) so the 1 cm gap under the fingertip reads and the curled fingers tuck under the palm.
export const camSH03: YCam = {x: -0.45, y: 0.41, z: 0.56, yaw: 28.6 * DEG, pitch: -7 * DEG, f: 1250, hy: 720, near: 0.02}; // v6: hy 860 -> 720 lifts the box front out of the caption band
const bp = ROOF.button;
// W3 (v8, user "the hands need fixing"): pianist look (the EP09 domed hand, fuller phalanges); a pointing press after drawing references: the index
// leads with a soft curve, the other three curl into a loose fist under the palm and the thumb lies along the curled middle finger (no second
// "finger" pointing down); the forearm runs off the right edge (no capped tube end or floating cuff in frame).
const W03: V3 = [-0.2509, 0.4465, 0.2934], E03: V3 = [-0.07, 0.47, 0.2];
const E03far: V3 = [W03[0] + (E03[0] - W03[0]) * 1.9, W03[1] + (E03[1] - W03[1]) * 1.9, W03[2] + (E03[2] - W03[2]) * 1.9];
export const HAND_SH03: HandMacro = {
  side: 1, base: 53400, size: 0.92, unit: 0.01, tone: {...HAND16, nail: '#efcdb4'}, look: 'pianist',
  wrist: W03, yaw: -116, pitch: -26, roll: 22, // index pad 1.0 cm above the button cap (0.361 m) over its centre
  fingers: {index: {mcp: 6, pip: 16, dip: 8}, middle: {mcp: 90, pip: 70, dip: 40, abd: -2}, ring: {mcp: 92, pip: 70, dip: 40, abd: -4}, little: {mcp: 94, pip: 70, dip: 40, abd: -8}},
  thumb: {cmc: 0, cmcAbd: 10, mcp: 10, ip: 15},
};
/** v8: forearm and coral sleeve painted here (not the macro's `elbow`): the tube starts under the palm centre (a round end the back of the hand covers)
 * and leaves the frame right, so no flat tube end or cut shows; widths from the world radius through the camera. */
const paintForearm03 = (p: Painter, c: YCam, off: V3 = [0, 0, 0]) => {
  // W5.2: `off` moves the whole forearm with the hand (SH03's 3 -> 1 cm descent, SH19's tremble); the W3 frame is off = 0
  const W03o: V3 = [W03[0] + off[0], W03[1] + off[1], W03[2] + off[2]], E03o: V3 = [E03[0] + off[0], E03[1] + off[1], E03[2] + off[2]], E03farO: V3 = [E03far[0] + off[0], E03far[1] + off[1], E03far[2] + off[2]];
  const at = (w: V3, k: number): V3 => [w[0] + (E03farO[0] - w[0]) * k, w[1] + (E03farO[1] - w[1]) * k, w[2] + (E03farO[2] - w[2]) * k];
  const px = (v: V3, r: number): {pt: Pt; w: number} | null => { const a = camPoint(c, v), b = camPoint(c, [v[0], v[1] + r, v[2]]); return a && b ? {pt: a, w: 2 * Math.hypot(b[0] - a[0], b[1] - a[1])} : null; };
  const start: V3 = [W03o[0] - 0.035 * (E03o[0] - W03o[0]) / 0.2, W03o[1] - 0.035 * (E03o[1] - W03o[1]) / 0.2, W03o[2] - 0.035 * (E03o[2] - W03o[2]) / 0.2];
  const dn = (v: V3, k: number): V3 => [v[0], v[1] - k, v[2]]; // the forearm axis sits a little under the wrist centre so its top flows into the back of the hand
  const a = px(dn(start, 0.007), 0.016), cuff = px(dn(at(W03o, 0.26), 0.004), 0.021), e = px(E03farO, 0.027);
  if (!a || !cuff || !e) return;
  const arm = capsule(a.pt, e.pt, a.w, e.w);
  hardFill(p, 53390, HAND16.skin, arm);
  // the lower half in shade (the light comes from the lamp above-left): the same tube, offset down and clipped by drawing the lit top strip over it
  hardFill(p, 53391, HAND16.shade, capsule([a.pt[0], a.pt[1] + a.w * 0.18], [e.pt[0], e.pt[1] + e.w * 0.18], a.w * 0.64, e.w * 0.64));
  inkLine(p, 53392, arm, 1.6, 0.2, true, '#2a2224');
  // sleeve: a slightly wider tube from the cuff off the frame, a shade band below, the cuff edge as an ellipse-ish ink stroke
  // sleeve: a flat open cuff (no round cap) from the cuff off the frame; a soft cuff shadow on the wrist, a knit rib band, a shade band below
  const far: Pt = [e.pt[0] + 160, e.pt[1] - 40], ax = Math.atan2(far[1] - cuff.pt[1], far[0] - cuff.pt[0]), nx = -Math.sin(ax), ny = Math.cos(ax);
  const along = (q: Pt, k: number): Pt => [q[0] + Math.cos(ax) * k, q[1] + Math.sin(ax) * k];
  const band = (q0: Pt, q1: Pt, w0: number, w1: number, o0 = 0, o1 = 0): Pt[] => [[q0[0] + nx * (o0 - w0 / 2), q0[1] + ny * (o0 - w0 / 2)], [q1[0] + nx * (o1 - w1 / 2), q1[1] + ny * (o1 - w1 / 2)], [q1[0] + nx * (o1 + w1 / 2), q1[1] + ny * (o1 + w1 / 2)], [q0[0] + nx * (o0 + w0 / 2), q0[1] + ny * (o0 + w0 / 2)]];
  const wc = cuff.w * 1.22, wf = e.w * 1.25;
  washAt(p, 53398, '#3a2a2a', 40, band(along(cuff.pt, -cuff.w * 0.35), cuff.pt, cuff.w * 0.9, cuff.w * 0.98), 0, 0);
  const body = band(cuff.pt, far, wc, wf);
  hardFill(p, 53393, '#a85a50', body);
  hardFill(p, 53394, '#83463e', band(cuff.pt, far, wc * 0.42, wf * 0.42, wc * 0.29, wf * 0.29));
  const rib = along(cuff.pt, cuff.w * 0.5);
  hardFill(p, 53396, '#b66a5e', band(cuff.pt, rib, wc, wc * 1.01));
  hardFill(p, 53399, '#94524a', band(cuff.pt, rib, wc * 0.42, wc * 0.42, wc * 0.29, wc * 0.29));
  inkLine(p, 53397, [[rib[0] - nx * wc * 0.5, rib[1] - ny * wc * 0.5], [rib[0] + nx * wc * 0.5, rib[1] + ny * wc * 0.5]], 1.2, 0.3, false, '#6e3a34');
  inkLine(p, 53395, [body[1], body[0], body[3], body[2]], 1.6, 0.2, false, '#2a2224');
};
/**
 * W5.2 hardening (user 15 Nov 2026, "the curled-finger seam"): the kit pianist hand inks each curled finger as one closed tube, and the tube's MCP cap
 * and first side strokes show as short black hooks between the knuckle bumps where the finger runs under the back of the hand. Episode-local fix, no
 * kit change (kit `paintHandMacro` is shared with the EP09 pianist and its 18 pinned scenes): the hand is painted through a painter that drops the
 * outline points of the curled fingers (middle, ring, little) whose position along MCP -> PIP is below `cut` (0.55); what remains is the visible fold
 * and tip, drawn as open strokes. Fills are untouched, so the skin and shading are exactly the kit's. The extended index keeps its full outline.
 */
// W5.2 round 2 (open item 1, leftover ticks): the side strokes of a curled finger also showed as short ticks where they pass under the back of the
// hand just past the cut. A silent first pass records the back-of-hand outline (kit fill seed base+60); every curled-finger ink (outline,
// creases, nail; ids i0..i0+11) then drops the points inside that outline or within `tol` x the finger's MCP -> PIP length (px) of it (the knuckle bumps hang below it). The `cut` along MCP -> PIP stays for the outline.
const SEAL_FINGERS = ['middle', 'ring', 'little'] as const;
const inPoly = (poly: Pt[], v: Pt) => { let r = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > v[1]) !== (b[1] > v[1]) && v[0] < ((b[0] - a[0]) * (v[1] - a[1])) / (b[1] - a[1]) + a[0]) r = !r; } return r; };
const segDist = (v: Pt, a: Pt, b: Pt) => { const dx = b[0] - a[0], dy = b[1] - a[1], u = Math.max(0, Math.min(1, ((v[0] - a[0]) * dx + (v[1] - a[1]) * dy) / Math.max(1e-6, dx * dx + dy * dy))); return Math.hypot(v[0] - a[0] - u * dx, v[1] - a[1] - u * dy); };
const paintHandSealed = (p: Painter, c: YCam, h: HandMacro, cut = 0.18, tol = 0.7): HandAnchors => {
  const an = macroAnchors(c, h, p.t), ids = new Map<number, {m: Pt; q: Pt}>(), back: Pt[][] = [];
  SEAL_FINGERS.forEach((id) => { const f = an.fingers[id]; if (f.mcp.p && f.pip.p) ids.set(h.base + 160 + FINGER_IDS.indexOf(id) * 12, {m: f.mcp.p, q: f.pip.p}); });
  // silent pass: record the back-of-hand fill outline (the first polygon after seed base+60, kit `drawPalm` tone band k = 1), draw nothing
  let seed = -1;
  const mute = new Proxy({}, {get: (_t, k) => (k === 'seed' ? (n: number) => { seed = n; } : k === 'polygon' ? (pts: Pt[]) => { if (seed === h.base + 60 && !back.length) back.push(pts.map((v): Pt => [v[0], v[1]])); } : () => undefined)}) as unknown as Painter['brush'];
  const noop = () => undefined;
  paintHandMacro({...p, brush: mute, wash: noop, flat: noop, group: noop, ink: noop, inkStill: noop, layer: () => ({...p, brush: mute, wash: noop, flat: noop, ink: noop, inkStill: noop})}, c, h);
  const palm = back[0] ?? [];
  const hidden = (v: Pt, d: number) => palm.length > 2 && (inPoly(palm, v) || palm.some((a, i) => segDist(v, a, palm[(i + 1) % palm.length]) < d));
  let cur = -1;
  const along = (ax: {m: Pt; q: Pt}, v: Pt) => { const dx = ax.q[0] - ax.m[0], dy = ax.q[1] - ax.m[1]; return ((v[0] - ax.m[0]) * dx + (v[1] - ax.m[1]) * dy) / Math.max(1e-6, dx * dx + dy * dy); };
  const owner = (id: number) => { for (const [i0, ax] of ids) if (id >= i0 && id < i0 + 12) return {ax, outline: id === i0}; return null; };
  const brush = new Proxy(p.brush, {get: (t, k) => {
    if (k === 'spline') return (pts: Pt[], curve?: number) => {
      const o = owner(cur);
      if (!o) return t.spline(pts, curve);
      let run: Pt[] = [];
      const flush = () => { if (run.length > 1) t.spline(run, curve); run = []; };
      pts.forEach((v) => { if (!hidden(v, tol * Math.hypot(o.ax.q[0] - o.ax.m[0], o.ax.q[1] - o.ax.m[1])) && (!o.outline || along(o.ax, v) >= cut)) run.push(v); else flush(); });
      flush();
    };
    const v = (t as unknown as Record<string | symbol, unknown>)[k];
    return typeof v === 'function' ? (v as (...a: unknown[]) => unknown).bind(t) : v;
  }});
  const q: Painter = {...p, brush, ink: (id, n, col, w) => { cur = id; p.ink(id, n, col, w); }, inkStill: (id, n, col, w) => { cur = id; p.inkStill(id, n, col, w); }};
  const R = paintHandMacro(q, c, h);
  return R;
};
/** W5.2 options (the W3 frame is the default): `cam` (SH17 / SH19 move along SH03's axis), `off` world offset of the hand and forearm (SH03 descent,
 * SH19 tremble), `state` overrides of the roof state (blip clock, cool). */
export type SH03Opts = {cam?: YCam; off?: V3; state?: Partial<RoofState>};
export const paintSH03 = (p: Painter, o: SH03Opts = {}) => {
  const c = o.cam ?? camSH03, off = o.off ?? [0, 0, 0], s: RoofState = {t: 0.4, lamp: true, trace: 'blip', blip: 0.6, cool: 0.25, ...(o.state ?? {})};
  // out-of-focus background (soft masses; no detail competes with the fingertip)
  // W3 (v2): darker and softer than v1 (the round blobs read as shapes, not as blur): premixed soft masses fading into the night
  const bg = '#171b26';
  hardFill(p, 53300, bg, [[-10, -10], [1090, -10], [1090, 1930], [-10, 1930]]);
  const soft = (seed: number, col: string, kMax: number, at: Pt, rx: number, ry: number) => { for (let i = 0; i < 9; i++) { const u = i / 8; hardFill(p, seed + i, mixColor(bg, col, kMax * (0.12 + 0.88 * u * u)), ell(at[0], at[1], rx * (1 - 0.7 * u), ry * (1 - 0.7 * u), 30)); } };
  soft(53301, '#3e4a5e', 0.6, [800, 470], 600, 450); // her slate trousers (lap)
  soft(53311, '#b8645a', 0.5, [1080, 150], 330, 280); // coral cardigan, upper right
  soft(53321, RF.pool, 0.3, [60, 250], 440, 340); // lamp bloom, upper left
  soft(53331, RF.trace, 0.16, [-30, 720], 220, 280); // green screen spill, left edge
  // crate top and the reply box in focus
  wFill(p, c, 53310, mixColor(mixColor(RF.crate, RF.night, 0.35), RF.pool, 0.3), qy(0.3, -0.7, -0.26, 0.05, 0.37));
  wFill(p, c, 53311, mixColor(RF.crate, '#0c0e14', 0.4), [[-0.26, 0.3, 0.37], [-0.7, 0.3, 0.37], [-0.7, 0.2, 0.37], [-0.26, 0.2, 0.37]]);
  paintReplyBox(p, c, s);
  // red light on the underside of the finger and the knuckles (drawn as an under-glow before the hand, then a glaze after)
  // the button's light rising into the 1 cm gap (drawn before the hand, so the finger stands in it)
  const tip = camPoint(c, [bp[0], bp[1] + 0.012, bp[2]]);
  if (tip) washAt(p, 53319, RF.button, 44, ell(tip[0], tip[1], 0.022 * 5000, 0.012 * 5000, 18), 0, 0);
  // the hand under the night ambient, warmed by the lamp (v2's raw skin read pasted on)
  const hp = tintPainter(p, '#3a3040', 0.2, {brush: true});
  paintForearm03(hp, c, off);
  const a = paintHandSealed(hp, c, off[0] || off[1] || off[2] ? {...HAND_SH03, wrist: [W03[0] + off[0], W03[1] + off[1], W03[2] + off[2]]} : HAND_SH03);
  // the button's red on the underside of the fingertip (premixed onto the skin, UT04)
  const pad = a.fingers.index.pad.p;
  if (pad) { const r = a.fingers.index.tipRadius * (c === camSH03 ? 1250 / 0.25 : camUnit(c, a.fingers.index.pad.w)); washAt(p, 53340, RF.button, 34, ell(pad[0], pad[1] - r * 0.2, r * 1.25, r * 0.9, 16), 0, 0); }
  lowFalloff(p, 53350, 1090, 60);
  MEASURE.SH03 = null;
  return a;
};

// ---------- SH21 (W-OFF wide): lamp and button dark, cold sky + orange haze rim only ----------
// Brief VD06 `cam: yaw 150, r 3.2, eye 1.6` (behind-right, high). W3: r 2.3 (at 3.0-3.2 m the camera stands outside the north parapet at z -2.2 and the
// wall fills the frame bottom), eye 1.7, pitch -16, f 950, hy 860 so her hand on the rocker sits above the caption band.
// W3 (v9, viewer check: "reads as a lit rooftop", switch and hand unreadable, figure tiny on a flat foreground): nearer and lower from behind-right,
// yaw 160, r 1.2, eye 1.05, pitch -16, f 950, target (-0.30, 0.40, 0.20): she fills the lower frame (stool to the frame bottom third), the hand on
// the switch at y ~1120 above the band. A night grade on the deck and props (`paintRoof` tint 0.45 toward #0a0d18; sky and city unchanged, UT03 kept by
// value steps, not black); the only warm light is her orange rim, the bulb's dying filament and an amber halo at the rocker under her fingertip.
// W3 (v10, viewer check fail x2 at 270 px: "a person from behind in huge headphones with a hand on a tiny dark box"; lamp, switch and fingertip glow
// unreadable, half the frame dark navy, head oversized, one arm): the camera moves to the lamp. Low front-left 3/4 just beyond the crate's lamp corner,
// azimuth -33, r 0.83, eye 0.55, f 760, hy 700, target (-0.30, 0.55, 0.10) (camera at about (-0.75, 0.55, 0.80)): the clip lamp is the nearest object
// (0.45 m, upper left) with its 3D-aimed shade open toward her hands, the rocker under her fingertip at frame centre above the caption band, and she sits
// at her LF-ROOF seat (SH01_AT, same side view `left`, facing the crate) 1.0 m away on the right with both hands in frame; the city behind her (+x, -z)
// gives the orange rim on her back, hair and arm. Continuity: same seat, pose and lamp anchors as LF-ROOF; the shade is drawn 0.12 m across (the
// picture-space LF-ROOF head reads about 0.09 m; a clip-lamp shade, est).
// W3 (v11, fix round 5; user decision 15 Nov 2026 after v8/v9/v10 failed as close shots): a WIDE high front shot in SH23's roof language, nearer than
// SH23, so the whole roof space, the clip lamp and the woman read at true relative scale and the lights-off beat reads from the light dropping across
// the scene (the lamp's warm pool on the deck and crate collapsing to the city's orange rim), not from the switch. Same seat (SH01_AT), view `left`
// (squared to the lens from the front), stool, crate and lamp anchors as LF-ROOF; the lamp is drawn at LF-ROOF's size (shade 0.09 m across, no cheat).
// The v10 close camera is kept as `camSH21v10` for the record. `SH21-ON` (lamp lit, same camera) pairs with it on the sheet for the user.
export const camSH21v10: YCam = {...orbitYCam([-0.35, 0.5, 0.12], 0.72, -40 * DEG, 0.45, 900, 840), near: 0.12};
export const camSH21: YCam = pitched(orbitYCam([-0.15, 0.45, 0.05], 1.7, -18 * DEG, 1.6, 860, 690), -27, 690, 0);
const RIM21 = '#e39a55', RIM21D = '#a0663e', AMBER = '#ffb062';
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const nrm = (a: V3): V3 => { const n = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const hull = (pts: Pt[]): Pt[] => {
  const q = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), x = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  q.forEach((v) => { while (lo.length > 1 && x(lo[lo.length - 2], lo[lo.length - 1], v) <= 0) lo.pop(); lo.push(v); });
  [...q].reverse().forEach((v) => { while (up.length > 1 && x(up[up.length - 2], up[up.length - 1], v) <= 0) up.pop(); up.push(v); });
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
/** W3 v10: the clip lamp in 3D (clamp, gooseneck, cone shade aimed at the rocker), the bulb's filament glowing as it dies. `glow` 0..1. */
const paintLamp21 = (p: Painter, c: YCam, glow: number, o: {R?: number; len?: number; lit?: boolean} = {}) => {
  // v11: `R` shade radius (m; LF-ROOF's picture-space shade is 0.09 m across, so R 0.045 for the wide shot), `len` cone length (m), `lit` the lamp on
  const {clamp, bulb} = ROOF, D = nrm(sub(ROOF.rocker, bulb)), up: V3 = [0, 1, 0], R = o.R ?? 0.075, len = o.len ?? 0.13;
  const e1 = nrm(crs(D, up)), e2 = crs(e1, D);
  const apex = add(bulb, D, -len * 0.77), rimC = add(bulb, D, len * 0.23);
  const ring = Array.from({length: 24}, (_, k): V3 => { const a = (k / 24) * Math.PI * 2; return add(add(rimC, e1, R * Math.cos(a)), e2, R * Math.sin(a)); });
  // clamp on the crate edge and the gooseneck (a tapered world-width line)
  const neck: V3[] = [clamp, [clamp[0] - 0.02, 0.4, clamp[2] + 0.01], [clamp[0] - 0.01, 0.52, clamp[2] + 0.02], add(apex, D, -0.02)];
  const nq = neck.map((v) => camPoint(c, v)).filter((v): v is Pt => !!v);
  if (nq.length > 1) {
    for (let k = 0; k < nq.length - 1; k++) {
      const w = (o.R ? 0.01 : 0.007) * camUnit(c, neck[k]); // v11: a 1 cm gooseneck so the lamp's stem reads in the wide
      hardFill(p, 53240 + k, '#15161b', capsule(nq[k], nq[k + 1], w, w * 0.9));
    }
    inkLine(p, 53245, nq.map((v): Pt => [v[0] + 3, v[1] - 2]), 1.6, 0.4, false, RIM21D); // the city rim along the neck's back
  }
  wFill(p, c, 53247, '#1b1c22', [[clamp[0] - 0.025, 0.3, clamp[2] - 0.03], [clamp[0] + 0.025, 0.3, clamp[2] - 0.03], [clamp[0] + 0.025, 0.36, clamp[2] - 0.03], [clamp[0] - 0.025, 0.36, clamp[2] - 0.03]]);
  const aq = camPoint(c, apex), rq = ring.map((v) => camPoint(c, v)).filter((v): v is Pt => !!v), bq = camPoint(c, bulb);
  if (!aq || rq.length < 20 || !bq) return;
  const u = camUnit(c, bulb);
  // the dying bulb's halo round the shade mouth (behind the shade: sky and crate, not skin)
  const shell = hull([aq, ...rq]);
  if (o.R) { // v11: the bulb's halo behind the shade (over deck and crate only; her skin sits outside its radius, UT04): lit = warm cream, off = the dying orange
    const hc = camPoint(c, add(bulb, D, 0.04))!;
    (o.lit ? [[0.2, 14], [0.14, 22], [0.09, 34], [0.055, 55]] : [[0.07, 22], [0.045, 40], [0.025, 60]]).forEach(([r, op], k) => washAt(p, 53263 + k, o.lit ? RF.pool : '#ff7a30', op, ell(hc[0], hc[1], r * u, r * u * 0.9, 20), 0, 0));
  }
  // the city rim on the shade's back edge (screen right, up), then the steel shell
  hardFill(p, 53252, RIM21, shell.map((v): Pt => [v[0] + 5, v[1] - 4]));
  hardFill(p, 53253, '#23252d', shell);
  // a form shade on the lower half of the cone (the side away from the sky)
  const low = hull([aq, ...rq.filter((_, k) => Math.sin((k / 24) * Math.PI * 2) < 0.1)]);
  hardFill(p, 53254, '#191a20', low);
  inkLine(p, 53255, shell, 1.4, 0.2, true, '#0c0d11');
  // the mouth: seen into it when it opens toward the lens; warm inside, the bulb and its orange-red filament
  const toCam = nrm(sub([c.x, c.y, c.z], rimC)), open = D[0] * toCam[0] + D[1] * toCam[1] + D[2] * toCam[2];
  if (open > 0) {
    hardFill(p, 53256, mixColor('#5a2e1c', '#c0703a', glow * 0.6), rq);
    hardFill(p, 53257, mixColor('#3a2018', '#e08a48', glow * 0.7), hull(ring.map((v) => camPoint(c, add(rimC, sub(v, rimC), 0.7))!).filter(Boolean)));
  }
  const bc = camPoint(c, add(bulb, D, 0.01))!, br = 0.026 * (R / 0.075) * u;
  hardFill(p, 53258, mixColor('#7a4a30', '#ffcf8a', glow * 0.85), ell(bc[0], bc[1], br, br * 0.92, 16));
  hardFill(p, 53259, mixColor('#7a4a30', '#fff0cc', glow * 0.9), ell(bc[0] - br * 0.25, bc[1] - br * 0.3, br * 0.35, br * 0.28, 10));
  // the filament: a short glowing coil across the bulb
  const fil = Array.from({length: 9}, (_, k): Pt => [bc[0] - br * 0.55 + (k / 8) * br * 1.1, bc[1] + (k % 2 ? -1 : 1) * br * 0.18]);
  inkLine(p, 53260, fil, 3.2, 0.5, false, mixColor('#8a2a14', '#ff5a24', glow));
  inkLine(p, 53261, fil, 1.4, 0.5, false, mixColor('#a04020', '#ffd070', glow));
  inkLine(p, 53262, rq, 1.6, 0.3, true, mixColor('#3a3d46', '#e0a060', glow * 0.6)); // the shade lip catching the bulb
  if (o.lit) { const bw = camPoint(c, add(bulb, D, 0.035))!; hardFill(p, 53267, '#fff6e0', ell(bw[0], bw[1], 0.03 * u, 0.026 * u, 16)); hardFill(p, 53268, '#ffffff', ell(bw[0], bw[1], 0.016 * u, 0.014 * u, 12)); }
};
/** W3 v9/v10: the lamp's rocker switch on the crate top (0.06 x 0.036 m plate, the rocker half pressed), its amber pilot just dying (opaque premixed). */
const paintRocker21 = (p: Painter, c: YCam, on = false) => {
  // v10: an in-line cord switch box 0.09 x 0.055 x 0.03 m (est) on the crate top at ROOF.rocker, the lamp cord running into it, the rocker on top
  const [x, y, z] = ROOF.rocker, q = (dx: number, dz: number, dy = 0): V3 => [x + dx, y + dy, z + dz], H = 0.03, W = 0.045, Dz = 0.0275;
  // the last warm light pooled on the crate top round the switch: opaque premixed rings (crate top value -> amber), no glaze
  if (!on) [[0.09, 0.14], [0.065, 0.26], [0.045, 0.42]].forEach(([r, k], i) => wFill(p, c, 53225 + i, mixColor('#353a48', '#d98a48', k), Array.from({length: 20}, (_, j): V3 => q(r * 1.2 * Math.cos((j / 20) * Math.PI * 2), r * Math.sin((j / 20) * Math.PI * 2), 0.001))));
  // the cord: from the lamp clamp into the box's -x end, out of its +x end toward the crate edge (world width 8 mm)
  const cord = (pts: V3[], seed: number) => { const qq = pts.map((v) => camPoint(c, v)); for (let k = 0; k < qq.length - 1; k++) { const a = qq[k], b = qq[k + 1]; if (a && b) { const w = 0.004 * camUnit(c, pts[k]); hardFill(p, seed + k, '#0f1014', capsule(a, b, w, w)); } } };
  cord([[ROOF.clamp[0] + 0.02, 0.302, ROOF.clamp[2] + 0.04], [-0.56, 0.304, 0.2], [-0.5, 0.304, 0.27], q(-W, 0, 0.012)], 53280);
  cord([q(W, 0, 0.012), [-0.32, 0.304, 0.31], [-0.285, 0.304, 0.33]], 53290);
  const top = [q(-W, -Dz, H), q(W, -Dz, H), q(W, Dz, H), q(-W, Dz, H)];
  wFill(p, c, 53220, '#1c1e24', [q(-W, Dz), q(W, Dz), q(W, Dz, H), q(-W, Dz, H)]); // front (+z) face
  wFill(p, c, 53219, '#26282f', [q(-W, -Dz), q(-W, Dz), q(-W, Dz, H), q(-W, -Dz, H)]); // -x end
  wFill(p, c, 53218, '#3a3d47', top);
  const pp = wp(c, top);
  if (pp.length > 2) inkLine(p, 53228, pp, 1.8, 0.2, true, '#f0b070'); // the warm edge light round the top
  // the rocker: the -x half raised (the O side, catching the amber), the +x half pressed under her fingertip
  wFill(p, c, 53221, '#7a7d88', [q(-0.032, -0.016, H + 0.012), q(0.0, -0.016, H + 0.004), q(0.0, 0.016, H + 0.004), q(-0.032, 0.016, H + 0.012)]);
  wFill(p, c, 53217, '#55585f', [q(-0.032, 0.016, H), q(0.0, 0.016, H), q(0.0, 0.016, H + 0.004), q(-0.032, 0.016, H + 0.012)]);
  wFill(p, c, 53222, '#2e3038', [q(0.0, -0.016, H + 0.004), q(0.032, -0.016, H + 0.001), q(0.032, 0.016, H + 0.001), q(0.0, 0.016, H + 0.004)]);
  const u = camUnit(c, ROOF.rocker), pl = camPoint(c, q(-0.038, 0, H + 0.001));
  if (pl) { hardFill(p, 53223, '#ff9a40', ell(pl[0], pl[1], 0.006 * u, 0.0045 * u, 12)); hardFill(p, 53224, '#ffe0a0', ell(pl[0], pl[1], 0.003 * u, 0.0022 * u, 10)); }
};
/** v10: her right hand (rig wrist target) 15 cm right of and 10 cm above the rocker, so the index finger, not the fist, lands on the switch. */
export const SH21_HAND: V3 = [ROOF.rocker[0] + 0.15, ROOF.rocker[1] + 0.1, ROOF.rocker[2] - 0.02];
/** v10: her left hand held at her chest (SH20's scared gesture carried over; both hands in frame, apart from the switch hand). */
export const SH21_LHAND: V3 = [0.04, 0.6, 0.0];
export const SH21_GLOW = 0.85; // the frame is the click: the filament still bright orange, the room light already gone
/** v11: the lamp's warm pool on the deck under the crate's lamp side (opaque premixed rings, UT04), painted as a deck item (before the crate and her);
 * `k` 1 = lit (the frame SH21-ON), small = collapsing (SH21, the click). */
const POOL21: V3 = [-0.5, 0.004, 0.26];
const pool21 = (k: number): {at: V3; bias: number; draw: (p: Painter, c: YCam) => void} => ({at: POOL21, bias: 40, draw: (p, c) => {
  const base = mixColor(RF.concrete, RF.night, k > 0.5 ? 0.27 : 0.31), lit = '#e3a05c';
  [[0.5, 0.12], [0.4, 0.22], [0.31, 0.32], [0.22, 0.42], [0.14, 0.5]].forEach(([r, a], i) => {
    const pts = wp(c, Array.from({length: 28}, (_, j): V3 => [POOL21[0] + r * k * 1.15 * Math.cos((j / 28) * 6.283) + 0.02 * Math.sin(j * 1.7), POOL21[1], POOL21[2] + r * k * Math.sin((j / 28) * 6.283)]));
    if (pts.length > 2) hardFill(p, 53300 + i, mixColor(base, lit, a * (0.3 + 0.7 * k)), pts);
  });
}});
/** v11: SH21 wide. `on` paints the lit pair frame SH21-ON (lamp on, warm pool, hand reaching); default is the click (just off: pool collapsed). */
/** W5.2 r3: `pool` (the collapsing pool, default the click's 0.3) and `glow` (filament, default SH21_GLOW) for the timed click +6..+13. */
export const paintSH21 = (p: Painter, o: {on?: boolean; pool?: number; glow?: number} = {}) => {
  const on = !!o.on, c = camSH21, at = SH01_AT, out: {a?: FigAnchors | null} = {};
  const s: RoofState = on ? {t: 0.4, lamp: true, trace: 'flat', cool: 0.6, ownLamp: true, noDeckPool: true} : {t: 0.4, lamp: false, trace: 'flat', cool: 0.8, ownLamp: true};
  const rimOff = [{dx: 5, dy: -3, color: RIM21}, {dx: -2, dy: -1, color: mixColor(RIM21D, '#141a2a', 0.35)}];
  const fig = on
    ? woman(c, {face: 'worried', at, view: 'left', reach: SH21_HAND, look: [-0.6, 0.2], warm: 0.45, rVia: [-0.06, 0.52, 0.12], noShadow: true}, out)
    : woman(c, {face: 'scared', at, view: 'left', reach: SH21_HAND, look: [-0.6, 0.4], night: 0.5, rim: RIM21, rimP: p, rimOff, rVia: [-0.06, 0.52, 0.12], noShadow: true}, out);
  paintRoof(p, c, s, {tint: MEASURE_MODE.on || on ? undefined : {to: '#18203a', u: 0.28}, cast: MEASURE_MODE.on ? [fig] : [pool21(on ? 1 : o.pool ?? 0.3), fig]});
  if (!MEASURE_MODE.on) {
    paintRocker21(p, c, on);
    // the city's orange edge on the crate's city-side (+x) edges (lamp off: the only light left besides the dying bulb)
    // W5.2 round 2 (open item 2, "SH21 orange forearm"): drawn before the mitten, not after it, so the edge no longer crosses her hand
    const K = ROOF.crate, edge = (pts: V3[], seed: number, w: number) => { const q = pts.map((v) => camPoint(c, v)); if (q.every(Boolean)) inkLine(p, seed, q as Pt[], w, 0.1, false, RIM21); };
    if (!on) edge([[K.x1, K.y1, K.z1], [K.x1, K.y1, K.z0]], 53275, 2.0); // v11: top edge only (the vertical edge read as a hanging string)
  }
  if (out.a && !MEASURE_MODE.on) {
    const r = camPoint(c, [ROOF.rocker[0] + 0.016, ROOF.rocker[1] + 0.036, ROOF.rocker[2]]), mu = camUnit(c, at) * 1.05;
    const skin = on ? '#c9a68a' : '#857670';
    paintMitten(p, out.a, {hand: 'r', kind: 'point', side: 1, skin, unit: mu, seed: 53060, aim: r ?? undefined, lobe: r ? Math.max(0.02, Math.hypot(r[0] - out.a.rHand[0], r[1] - out.a.rHand[1]) / mu - 0.05) : undefined, rim: on ? undefined : [{color: RIM21, dx: 3}, {color: mixColor(RIM21D, '#141a2a', 0.3), dx: -2}]});
  }
  if (!MEASURE_MODE.on) {
    lowFalloff(p, 53270, 1360, 26);
    paintLamp21(p, c, on ? 1 : o.glow ?? SH21_GLOW, {R: 0.045, len: 0.08, lit: on});
  }
  MEASURE.SH21 = out.a ?? null;
};

// ---------- SH22 (L15): logbook last row, lamp off; Thai rows are DOM text mapped to the page quad (QuadText method test) ----------
export const camSH22: YCam = {x: -0.56, y: 0.66, z: 0.56, yaw: -8 * DEG, pitch: -47 * DEG, f: 1050, hy: 820, near: 0.05};
/** `c` (W5.2 r3): the SH22 pan camera; default the approved camSH22. */
export const LB_QUAD = (c: YCam = camSH22): [Pt, Pt, Pt, Pt] | null => {
  const lb = ROOF.logbook, ca = Math.cos(lb.rot * DEG), sa = Math.sin(lb.rot * DEG);
  const P = (u: number, v: number): V3 => [lb.c[0] + u * ca - v * sa, lb.c[1] + 0.005, lb.c[2] + u * sa + v * ca];
  // the right-hand page (u 0..0.105), top edge at -d/2 (far), bottom at +d/2 (near)
  const q = [P(0.006, -lb.d / 2 + 0.02), P(0.1, -lb.d / 2 + 0.02), P(0.1, lb.d / 2 - 0.02), P(0.006, lb.d / 2 - 0.02)].map((v) => camPoint(c, v)); // v8: u 0.006..0.1 inside the page edge (w/2 = 0.105)
  return q.every(Boolean) ? (q as [Pt, Pt, Pt, Pt]) : null;
};
export const paintSH22 = (p: Painter) => {
  const c = camSH22, s: RoofState = {t: 0.4, lamp: false, trace: 'flat', cool: 0.8};
  hardFill(p, 53500, '#14161e', [[-10, -10], [1090, -10], [1090, 1930], [-10, 1930]]);
  wFill(p, c, 53501, mixColor('#141519', RF.glow, 0.08), qy(0, -1.5, 0.6, -0.6, 0.9));
  paintCrate(p, c, {...s, lamp: false});
  paintSH22Pages(p, c);
};
/** W5.2 r3: the logbook pages in the cold light (split out of paintSH22 for the SH22 pan; same marks). */
export const paintSH22Pages = (p: Painter, c: YCam) => {
  // cold light on the pages: the city glow from the north and the flat trace's green from the left
  const lb = ROOF.logbook, ca = Math.cos(lb.rot * DEG), sa = Math.sin(lb.rot * DEG);
  const P = (u: number, v: number): V3 => [lb.c[0] + u * ca - v * sa, lb.c[1] + 0.0045, lb.c[2] + u * sa + v * ca];
  wFill(p, c, 53510, '#8f98aa', [P(-lb.w / 2, -lb.d / 2), P(0, -lb.d / 2), P(0, lb.d / 2), P(-lb.w / 2, lb.d / 2)]);
  wFill(p, c, 53511, '#a3aabb', [P(0, -lb.d / 2), P(lb.w / 2, -lb.d / 2), P(lb.w / 2, lb.d / 2), P(0, lb.d / 2)]);
  const pts = wp(c, [P(-lb.w / 2, -lb.d / 2), P(lb.w / 2, -lb.d / 2), P(lb.w / 2, -lb.d / 2 + 0.1), P(-lb.w / 2, -lb.d / 2 + 0.1)]);
  if (pts.length > 2) washAt(p, 53512, RF.glow, 26, pts, 0, 0);
  // ruled lines on the left page (older entries as texture) and a spiral
  for (let r = 0; r < 10; r++) wFill(p, c, 53520 + r, '#6f7890', [P(-0.095, -0.13 + r * 0.027), P(-0.012, -0.13 + r * 0.027), P(-0.012, -0.1285 + r * 0.027), P(-0.095, -0.1285 + r * 0.027)]);
  for (let r = 0; r < 14; r++) { const q = camPoint(c, P(0, -0.14 + r * 0.02)); if (q) hardFill(p, 53540 + r, '#2a2d36', ell(q[0], q[1], 5, 3, 8)); }
};
export const LB_ROWS = ['8 พ.ย.  เงียบ', '9 พ.ย.  เงียบ', '10 พ.ย.  เงียบ', '11 พ.ย.  เงียบ', '12 พ.ย.  เงียบ', '13 พ.ย.  เงียบ'];

// ---------- SH23 (L16 + hold): crane-out end, the real sky over her small dark roof; no label, no title ----------
// Brief VD13 `pitch +10 -> +55, r 2 -> 14 m, eye 1 -> 9 m`. W3: the end at r 15, pitch +22 (not +55: past about +30 the roof leaves the frame), f 700,
// hy 560: the whole roof small in the lower third (y ~1310-1890), the sky over the skyline in the top 44 %, the low city between.
export const camSH23: YCam = pitched(orbitYCam([0, 0.5, 0.8], 15, -20 * DEG, 9, 700, 560), 22, 560, 0);
export const paintSH23 = (p: Painter, o: {t?: number} = {}) => {
  const c = camSH23, s: RoofState = {t: o.t ?? 0.4, lamp: false, trace: 'flat', cool: 0.8}, out: {a?: FigAnchors | null} = {};
  paintRoof(p, c, s, {sprawl: true, cast: [woman(c, {face: 'neutral', look: [0, -0.8], night: 0.55, rim: '#c98a4e'}, out)]});
  MEASURE.SH23 = out.a ?? null;
};

// ---------- IM1 SH07 aged keys (N2): her bust in the thought-space, the thread from her light behind her shoulder up to the far star ----------
// Brief IM1 L05: bust lower foreground, front, about 1.0 m from the lens (W3: 0.72 m so the head reads; lead from the head top to the frame bottom),
// thread rising behind her shoulder to the cold star; ages keyed to the return bead: a21 warm bead leaving, a50 cold bead half-way down, a81 cold bead
// at her light. Thought palette: the bust is tinted toward the void, lit cold from the star (upper left) and warm from her light (lower left).
// W3 (v6): bust raised 145 px and her light lifted out of the caption band y 1176-1344 (v5 band sat on chin, collar and her light: p95 0.57)
export const SH07 = {hers: [200, 1075] as Pt, star: [300, 250] as Pt};
const camSH07: YCam = {x: 0.0, y: 1.3, z: 0.72, yaw: 0, pitch: 0.02, f: 1000, hy: 760, cx: 110};
export const paintFarStar = (p: Painter, at: Pt) => { // IM1's star: cold, unblinking, a long thin halo (not "their light", P7)
  washAt(p, 53600, TH.cold, 26, ell(at[0], at[1], 120, 120, 24), 0, 0);
  washAt(p, 53601, TH.cold, 60, ell(at[0], at[1], 46, 46, 20), 0, 0);
  // W3 (v2): the long thin halo as a soft tapered vertical glint (v1's cross read as a gun sight)
  hardFill(p, 53602, mixColor(TH.void, TH.cold, 0.55), [[at[0], at[1] - 190], [at[0] + 4, at[1]], [at[0], at[1] + 150], [at[0] - 4, at[1]]]);
  hardFill(p, 53603, mixColor(TH.void, TH.cold, 0.4), [[at[0] - 46, at[1]], [at[0], at[1] - 2.5], [at[0] + 46, at[1]], [at[0], at[1] + 2.5]]);
  hardFill(p, 53604, TH.core, ell(at[0], at[1], 9, 9, 12));
};
const coldBead = (p: Painter, at: Pt) => { washAt(p, 53610, TH.cold, 70, ell(at[0], at[1], 22, 22, 16), 0, 0); hardFill(p, 53611, mixColor(TH.cold, TH.core, 0.4), ell(at[0], at[1], 6.5, 6.5, 12)); };
const warmBead = (p: Painter, at: Pt) => { washAt(p, 53612, TH.amber, 70, ell(at[0], at[1], 22, 22, 16), 0, 0); hardFill(p, 53613, mixColor(TH.amber, TH.core, 0.3), ell(at[0], at[1], 6.5, 6.5, 12)); };
/** W5.2 (SH07 timed plate): the void, city curve, far star, thread, her light and the bead, without the bust. `bead` {k along the thread 0..1, warm
 * (going up) or cold (coming back)}; null = no bead. The W3 stills are `paintSH07Age` (unchanged: back with the age's bead, then the bust). */
export const paintSH07Back = (p: Painter, o: {t: number; bead: {k: number; warm: boolean} | null; shadowFrom: number}) => {
  const S = SH07;
  paintVoid(p, {cam: {x: 0, y: 0, z: 0, yaw: 0, f: 1000, hy: 960, pitch: 0.25}, t: o.t, diag: [S.hers, S.star]});
  // the dark city curve at the bottom with her one warm light (behind her shoulder)
  hardFill(p, 53620, mixColor(TH.void, TH.nebula, 0.5), [[-10, 1150], [300, 1100], [700, 1115], [1090, 1160], [1090, 1930], [-10, 1930]]);
  paintFarStar(p, S.star);
  paintThread(p, {a: S.hers, b: S.star, shadowFrom: o.shadowFrom});
  paintLight(p, {at: S.hers, r: 64, kind: 'hers', t: o.t});
  if (o.bead) { const bead = threadAt(S.hers, S.star, o.bead.k); if (o.bead.warm) warmBead(p, bead); else coldBead(p, bead); }
};
/** W5.2: the bust of `age` (`cx` the camera's lateral slide, W3 110) and the void mist over its lower torso. */
export const paintSH07Bust = (p: Painter, age: AgeKey, o: {t: number; cx?: number}) => {
  const A = AGED[age], t = o.t;
  // the bust (standing rig, legs out of frame); cold key from the star, the bob cut kept for identity
  // v6d: the shirt in the star's cold shade (the white shirt sat in the caption band, p95 0.57); thought-space only, the roof keeps the kit shirt
  const def = {...A.def, outfit: {...A.def.outfit, shirt: mixColor(A.def.outfit.shirt ?? '#e8e4dc', '#232a42', 0.68), ...(age === 'a81' ? {jacket: mixColor(A.def.outfit.jacket ?? '#b48c88', '#232a42', 0.18), sleeve: mixColor(A.def.outfit.sleeve ?? '#b48c88', '#232a42', 0.18)} : {})}};
  const out = paintFigureAt(p, {...camSH07, cx: o.cx ?? camSH07.cx}, def, {at: [0, 0, 0], view: 'front', pose: 'P01', face: age === 'a50' ? 'worried' : 'neutral', faceState: {look: [-0.45, -0.55], ...(age === 'a50' ? {bags: 0.3} : age === 'a81' ? {eyes: 'half' as const, bags: 0.6} : {})}, t, shadow: false,
    tint: {to: TH.voidLift, u: MEASURE_MODE.on ? 0 : 0.3}, fig: {...stoopFig(A.stoop), ...(MEASURE_MODE.on ? {silhouette: MAGENTA} : {})}});
  MEASURE[`SH07-${age.toUpperCase()}`] = out;
};
/** W5.2: the void's ragged mist over the bust's lower torso (keeps the caption band low-value); painted once over every bust layer. */
export const paintSH07Mist = (p: Painter) => {
  // cold rim along her left (screen-left) edge facing the star, and a darker lower torso so the caption band stays low-value
  // the bust sinks into a ragged dark mist of the void (thought-space; v2's straight wash cut a hard line, v4's steps striped the cardigan)
  // v6c: a smooth falloff from the star's top light (v6b's ragged mist washes read as a camouflage stripe across the cardigan; v6's ran black, UT03)
  for (let k = 0; k < 2; k++) {
    const y = 1130 + k * 120;
    washAt(p, 53630 + k, TH.void, k ? 34 : 62, [...Array.from({length: 12}, (_, j): Pt => [-10 + j * 100, y + 6 * Math.sin(j * 1.1 + k)]), [1090, y], [1090, 1930], [-10, 1930]], 0, 0);
  }
};
export const paintSH07Age = (p: Painter, age: AgeKey, o: {t?: number} = {}) => {
  const t = o.t ?? 0.9, k = age === 'a21' ? 0.14 : age === 'a50' ? 0.55 : 0.06;
  paintSH07Back(p, {t, bead: {k, warm: age === 'a21'}, shadowFrom: age === 'a21' ? k : 1});
  paintSH07Bust(p, age, {t});
  paintSH07Mist(p);
};
