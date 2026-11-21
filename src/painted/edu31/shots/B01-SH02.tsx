import type {FigAnchors} from '../../kit/cast';
import {mittenThumbSide} from '../../kit/hand-gestures';
import type {Painter, Pt} from '../../kit/painter';
import {paintShoulderBag} from '../../kit/props';
import type {V3} from '../../kit/space';
import type {YCam} from '../../kit/ycam';
import {paintSorted, wFill, wInk} from '../../kit/world';
import {whipSmear} from '../props31';
import {BANK_TEXT, bankFurniture, lemonPx, paintBankShell, TELLER, WHEELER, type WorldText} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camOf, dryAnchors, ein, fig, gu, lin, mix, reachArm, shoulderAt} from '../stage31';

// B01-SH02 · F [83, 169) · lateral truck past the teller windows, whip pan to the second bank (SCENE-R2 b01; R1 [72, 175)). Wheeler walks +x in
// right profile (his right side to the lens); the camera trucks with him (eye x = his x - 0.05). On "สองแห่ง" (L20, F103) a whip pan out of K
// (yaw +6 -> +81, L20-23), cut at L23, whip into K2 (maroon, brass; yaw -69 -> +6, L23-26), same truck, now with two bags (the shoulder bag and a
// second `new: canvas-money-bag` in his RIGHT, near mitten). L63-73 (F146-156) his head turns to the lens (`turn-head-to-camera`: profile body,
// head to front at L68), smug; push f 850 -> 935 (L63-85, ease-in). The TELLER (K only) works head down behind W1; no gun in frame (far side).
const N = 86, SHOT = 'B01-SH02';
const STEP = 1.1 * 1.78 / 1.7;
/** Wheeler's x on the shot clock: K L0-20 -2.9 -> -2.4 (sheet path), K2 L26-85 -1.75 -> +0.6 (1.2 m/s; SCENE-R2 K2 start, end frame as R1). */
const wx = (L: number) => L < 23 ? mix(-2.9, -2.4, L / 20) : mix(-1.75, 0.6, (L - 26) / 59);
const inK2 = (L: number) => L >= 23;
const yawAt = (L: number) => L < 20 ? 6 : L < 23 ? mix(6, 81, ein(lin(L, 20, 23))) : L < 26 ? mix(-69, 6, 1 - (1 - lin(L, 23, 26)) ** 2) : 6;
const CAM = (L: number): YCam => camOf({eye: [wx(L) - 0.05, 1.35, 2.6], yaw: yawAt(L), pitch: 0, f: mix(850, 935, ein(lin(L, 63, 85))), hy: 680});
/** TELLER 1-3 plaques on the partition above W1-W3 (y 1.95), facing +z. */
const PLAQUES: WorldText[] = [-3, 0, 3].map((x, i) => ({text: `TELLER ${i + 1}`, corners: [[x - 0.32, 2.05, -0.385], [x + 0.32, 2.05, -0.385], [x + 0.32, 1.88, -0.385], [x - 0.32, 1.88, -0.385]] as [V3, V3, V3, V3], color: '#f0e6c4', weight: 800}));
/** Plaque boards under the TELLER n text (dark green, brass edge), K and K2 alike. */
const plaqueBoards = (p: Painter, c: YCam) => { for (const x of [-3, 0, 3]) { const q: V3[] = [[x - 0.36, 2.08, -0.388], [x + 0.36, 2.08, -0.388], [x + 0.36, 1.85, -0.388], [x - 0.36, 1.85, -0.388]]; wFill(p, c, 37520 + x * 3 + 9, '#1f4a3a', q); wInk(p, c, 37540 + x * 3 + 9, q, {weight: 0.7, color: '#c9a24a'}); } };

export const def: Shot31 = {
  id: SHOT, N, paper: '#e9dfc8', vignette: 0.3,
  cam: CAM,
  texts: [...PLAQUES, ...BANK_TEXT],
  // Wheeler covers the plaques he walks past: head disc and body box from his anchors
  textMask: (L, c) => {
    const a = dryAnchors(WHEELER, c, {at: [wx(L), 0, 1.2], view: 'right', seed: 3101, fig: {walk: (wx(L) + 2.9) / STEP, stride: 1, ...(L >= 68 ? {head: 'front' as const} : {})}});
    if (!a) return [];
    const r = (a.chin - a.headTop) * 0.62, hc = a.head;
    const disc: Pt[] = Array.from({length: 20}, (_, i) => [hc[0] + Math.cos(i / 20 * 6.283) * r, hc[1] + Math.sin(i / 20 * 6.283) * r]);
    const bw = r * 0.85;
    return [disc, [[hc[0] - bw, a.chin - 4], [hc[0] + bw * 1.1, a.chin - 4], [hc[0] + bw * 1.1, a.bottom], [hc[0] - bw, a.bottom]]];
  },
  filter: (L) => (L >= 20 && L < 26 ? `blur(${L === 22 || L === 23 || L === 24 ? 7 : 3}px)` : undefined),
  screen: (p, L) => { const k = L >= 20 && L < 26 ? 1 - Math.abs(L - 23) / 3.5 : 0; whipSmear(p, 37500, inK2(L) ? ['#6e2f33', '#e7d8bf', '#c9a24a'] : ['#2f6a63', '#e9dfc8', '#d8c79a'], k); },
  paint: (p, L, c, pr) => {
    const t = L / 30, k2 = inK2(L);
    paintBankShell(p, c, {k2});
    plaqueBoards(p, c);
    const W: V3 = [wx(L), 0, 1.2], walk = (wx(L) + 2.9) / STEP;
    const {u} = gu(c, W);
    const headFront = L >= 68;
    const body = {view: 'right' as const};
    const sh = shoulderAt(WHEELER, c, W, body, 'r');
    // RIGHT (near) arm: K the lemon at the chest (forearm forward), K2 the second bag hanging from the mitten
    const swing = Math.sin(walk * 2 * Math.PI) * 0.05 * u;
    const rTo: Pt = k2 ? [sh[0] + 0.17 * u + swing, sh[1] + 0.45 * u] : [sh[0] + 0.2 * u, sh[1] + 0.3 * u];
    const rA = reachArm(sh, rTo, u, k2 ? 1 : -1, {fist: mittenThumbSide('right', 'back')});
    const out: {a?: FigAnchors | null} = {};
    paintSorted(p, c, [
      ...bankFurniture({k2}),
      ...(k2 ? [] : [fig(TELLER, {at: [-3.0, 0, -0.7], view: 'front', face: 'neutral', faceState: {look: [0, 0.9]}, seed: 3103, t, fig: {nod: [0, 0.05]}})]),
      fig(WHEELER, {at: W, view: 'right', face: 'smug', seed: 3101, t,
        fig: {walk, stride: 1, rArm: rA.arm, ...(headFront ? {head: 'front' as const} : {})},
        faceState: headFront ? {look: [0.1, 0]} : {},
        held: (q, a, uu) => {
          const g = gu(c, W).g;
          paintShoulderBag(q, 31930, [a.rShoulder[0] - 0.02 * uu, a.rShoulder[1] + 0.02 * uu], [g[0] + (k2 ? 0.0 : 0.1) * uu, g[1] - 0.95 * uu], 0.24 * uu, 0.22 * uu, {corner: true});
          if (k2) paintShoulderBag(q, 31960, [a.rHand[0], a.rHand[1] - 0.02 * uu], [a.rHand[0] + 0.02 * uu, a.rHand[1] + 0.06 * uu], 0.26 * uu, 0.24 * uu, {corner: true, strapW: 0.02 * uu});
          else lemonPx(q, 31900, a.rHand[0] + 0.02 * uu, a.rHand[1] - 0.04 * uu, 0.04 * uu, {glint: 1.4});
        }}, false, out),
    ]);
    if (pr && out.a) { pr.lead('WHEELER', {top: out.a.top, bottom: out.a.bottom, x: out.a.head[0]}); pr.lead('HEAD', {top: out.a.headTop, bottom: out.a.chin, x: out.a.head[0]}); pr.lead('ARM-R', {top: rA.ratio, bottom: 0}); }
  },
};
export const shot = makeShot(def);
