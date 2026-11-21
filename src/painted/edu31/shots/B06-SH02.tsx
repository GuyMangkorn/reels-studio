import type {FigAnchors} from '../../kit/cast';
import {mittenThumbSide} from '../../kit/hand-gestures';
import type {Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {paintSorted} from '../../kit/world';
import {CCTV_STILL} from '../looks';
import {printQuad} from '../police31';
import {glow, paintPoliceShell, policeTable, WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {speechOpen, WHEELER_ENV} from '../speech31';
import {camMove, dryAnchors, ez, fig, gu, keysAt, mix2, poseShoulder, reachArm} from '../stage31';

// B06-SH02 · F [1416, 1520) · close: his documented line (SCENE-R1 b06). Wheeler seated P31 at (0, 0, -0.75) (as B05-SH04/B06-SH01), `talk`
// mouth on his speech frames (L3-100), `open` from the L14 envelope (speech31.ts, fix round 2026-11-21: it was a static shape) over `neutral` -> `worried` (L80); eyes down to the print L0-8 (head tilt 5 deg), up to the officer just
// right of the lens L8-14 (look +0.25), held. `new: cheek-touch` L66-74: his RIGHT mitten (screen left) rises from the table and touches the
// upper cheek above the beard at L74 (F1490), holds to the end (one two-bone chain per frame, back of the mitten to the lens). The print
// (CCTV-STILL-01, B06-SH01's exit (0, 0.684, -0.02), rotated 4 deg) lies in the soft lower foreground (DOM, blur 6 px), its CCTV face below the
// caption band. Push f 1300 -> 1365, hy 540 -> 770: the kit seated head stands about 0.12 m above the sheet figure (batch 1 finding), so the
// picture is lowered to keep the sheet head line (head top about 197). No mockery: a sincere, flat read.
const N = 104, SHOT = 'B06-SH02';
const CAM = camMove({eye: [0, 1.05, 0.35], yaw: 0, pitch: -4, f: 1300, hy: 770, near: 0.05}, {eye: [0, 1.05, 0.35], yaw: 0, pitch: -4, f: 1365, hy: 770, near: 0.05}, 0, N - 1);
const WH: V3 = [0, 0, -0.75], PRINT_C: V3 = [0, 0.684, -0.02];
const touchAt = (L: number) => ez(L, 66, 74);
const lookAt = (L: number): Pt => [keysAt(L, [[0, 0], [8, 0], [14, 0.25]]), keysAt(L, [[0, 0.75], [8, 0.75], [14, 0]])];

export const def: Shot31 = {
  id: SHOT, N, paper: '#9fae9a', vignette: 0.35,
  cam: CAM,
  quads: () => [{src: CCTV_STILL, corners: printQuad(PRINT_C, 4), border: 0.06, pos: '50% 30%', blur: 6}],
  paint: (p, L, c, pr) => {
    const t = L / 30 + 2.5; // rig clock +2.5 s: one natural blink mid-line (L59-62), eyes open on the look up and the touch
    paintPoliceShell(p, c);
    const talking = L >= 3 && L <= 100;
    const base = {at: WH, view: 'front' as const, pose: 'P31' as const, face: (L >= 80 ? 'worried' : 'neutral') as 'worried' | 'neutral', seed: 3101, t,
      faceState: {look: lookAt(L), ...(talking ? {mouth: 'talk' as const, open: speechOpen(WHEELER_ENV, L)} : {})}, fig: {headCock: 5 * (1 - ez(L, 8, 14))}};
    const a0 = dryAnchors(WHEELER, c, base)!;
    const hr = (a0.chin - a0.headTop) / 2, {u} = gu(c, WH);
    const cheek: Pt = [a0.head[0] - 0.6 * hr, a0.head[1] + 0.12 * hr];
    const sh = poseShoulder(WHEELER, c, WH, 'P31', 'front', 'r');
    const k = touchAt(L), touch: Pt = [cheek[0] - 0.03 * u, cheek[1] + 0.05 * u], mid: Pt = [cheek[0] + 0.02 * u, a0.chin + 0.18 * u];
    // the mitten rises close in front of the chest (via `mid`), then up to the cheek, never swinging out to the side
    const target = k < 0.5 ? mix2(a0.rHand, mid, k * 2) : mix2(mid, touch, (k - 0.5) * 2);
    const rA = reachArm(sh, target, u, -1, {fist: mittenThumbSide('right', 'back'), fore: 0.5 * k});
    const out: {a?: FigAnchors | null} = {};
    paintSorted(p, c, [
      fig(WHEELER, {...base, ...(k > 0 ? {fig: {...base.fig, rArm: rA.arm}} : {})}, true, out),
      {at: [0, 0, 0], draw: policeTable},
    ]);
    const l = camPoint(c, [0, 2.5, 0]); if (l) glow(p, 36300, l[0], l[1], 420, 160, '#f4fbe8', 60);
    if (pr && out.a) {
      pr.lead('HEAD', {top: out.a.headTop, bottom: out.a.chin, x: out.a.head[0]});
      pr.lead('ARM-R', {top: rA.ratio, bottom: 0});
      pr.lead('HAND-R', {top: rA.hand[1], bottom: rA.hand[1], x: rA.hand[0]}); pr.lead('CHEEK', {top: cheek[1], bottom: cheek[1], x: cheek[0]});
      const pq = printQuad(PRINT_C, 4), far = camPoint(c, pq[0]), face = camPoint(c, [PRINT_C[0], PRINT_C[1], PRINT_C[2] - 0.254 * 0.12]);
      if (far) pr.lead('PRINT-FAR', {top: far[1], bottom: far[1], x: far[0]}); if (face) pr.lead('PRINT-FACE', {top: face[1], bottom: face[1], x: face[0]});
    }
  },
};
export const shot = makeShot(def);
