import type {FigAnchors} from '../../kit/cast';
import type {Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {paintSorted, wFill, wInk, qz} from '../../kit/world';
import {paintPoliceShell, policeTable, WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, ein, fig, lin} from '../stage31';

// B05-SH04 · F [1334, 1374) · the door shuts (SCENE-R1 b05, LF06 room). Wheeler alone at the interview table, seated P31 at (0, 0, -0.7) on the
// plain chair, `neutral`, blink L6-8, mittens on the table, front. The steel door (x -1.65..-0.75, hinge left, back wall z -1.99) stands open
// 70 deg into the room at L0 and swings shut L3-15 (accelerating), contact on the frame at L15 (F1349, "จับ"). Light: L0-15 the room is dim
// (canvas brightness 0.42) with the warm hall light through the doorway and a wedge on the floor (DOM, screen blend, scaled by the opening);
// L15-17 darker; the tube (out of frame top) stutters on L17-18, off L19-21, on L22, off L23-24, on and steady from L25 (the LF06 level, cool).
// Push f 1050 -> 1100. No clock.
const N = 40, SHOT = 'B05-SH04';
const CAM = camMove({eye: [0.5, 1.25, 1.9], yaw: -10, pitch: -2, f: 1050, hy: 600}, {eye: [0.5, 1.25, 1.9], yaw: -10, pitch: -2, f: 1100, hy: 600}, 0, N - 1);
const HX = -1.65, DW = 0.9, DZ = -1.99, DH = 2.1;
/** Door opening angle (rad) on the shot clock: 70 deg -> 0 over L3-15, accelerating to the contact. */
export const doorAt = (L: number) => (70 * Math.PI / 180) * (1 - ein(lin(L, 3, 15)));
/** Tube state: 0 off, 1 on (canvas brightness follows). */
const tubeOn = (L: number) => (L >= 25 || L === 17 || L === 18 || L === 22 ? 1 : 0);
const level = (L: number) => (tubeOn(L) ? 1 : L < 15 ? 0.42 : 0.26);
const leafPts = (a: number): V3[] => { const ex = HX + DW * Math.cos(a), ez = DZ + DW * Math.sin(a); return [[HX, 0, DZ], [ex, 0, ez], [ex, DH, ez], [HX, DH, DZ]]; };

export const def: Shot31 = {
  id: SHOT, N, paper: '#9fae9a', vignette: 0.3,
  cam: CAM,
  filter: (L) => (level(L) < 1 ? `brightness(${level(L)}) saturate(0.85)` : undefined),
  fx: (L, c) => {
    const a = doorAt(L), k = Math.sin(a) / Math.sin(70 * Math.PI / 180);
    if (k <= 0.01) return null;
    const P = (v: V3) => camPoint(c, v);
    const ex = HX + DW * Math.cos(a);
    // doorway (the part not covered by the leaf in plan) and the floor wedge thrown into the room
    const door = [P([HX, 0, DZ + 0.005]), P([HX + DW, 0, DZ + 0.005]), P([HX + DW, DH, DZ + 0.005]), P([HX, DH, DZ + 0.005])];
    const wedge = [P([ex, 0, DZ + 0.01]), P([HX + DW, 0, DZ + 0.01]), P([HX + DW + 0.9 * k, 0, DZ + 2.3 * k]), P([ex + 0.3 * k, 0, DZ + 2.4 * k])];
    const poly = (q: (Pt | null)[]) => q.every(Boolean) ? (q as Pt[]).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ') : null;
    const d = poly(door), w = poly(wedge);
    return <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
      <defs><linearGradient id="b54w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6d79a" stopOpacity={0.55 * k} /><stop offset="1" stopColor="#f6d79a" stopOpacity={0.05} /></linearGradient></defs>
      {d && <polygon points={d} fill="#ffe2a6" opacity={0.85 * k} />}
      {w && <polygon points={w} fill="url(#b54w)" />}
    </svg>;
  },
  paint: (p, L, c, pr) => {
    const t = L / 30 + 2; // rig clock +2 s: no automatic blink in the shot; the sheet's blink L6-8 is set below
    paintPoliceShell(p, c);
    const a = doorAt(L);
    if (a > 0.005) {
      wFill(p, c, 38950, '#3c3a32', qz(DZ + 0.002, HX, HX + DW, 0, DH)); // the hall beyond, in shadow behind the light (the DOM layer lights it)
      const lp = leafPts(a);
      wFill(p, c, 38951, '#6f7a78', lp);
      wInk(p, c, 38952, lp, {weight: 0.8});
      const g = (u: number, v: number): V3 => [HX + DW * u * Math.cos(a), v, DZ + DW * u * Math.sin(a)];
      wFill(p, c, 38953, '#cfd6cc', [g(0.33, 1.35), g(0.67, 1.35), g(0.67, 1.75), g(0.33, 1.75)]);
      for (let i = 1; i < 4; i++) wInk(p, c, 38954 + i, [g(0.33 + i * 0.085, 1.35), g(0.33 + i * 0.085, 1.75)], {weight: 0.3, color: '#8a9088'});
    }
    const out: {a?: FigAnchors | null} = {};
    const blink = L >= 6 && L <= 8;
    paintSorted(p, c, [
      fig(WHEELER, {at: [0, 0, -0.75], view: 'front', pose: 'P31', face: 'neutral', seed: 3101, t, ...(blink ? {faceState: {eyes: 'shut' as const}} : {})}, true, out),
      {at: [0, 0, 0], draw: policeTable},
    ]);
    if (pr && out.a) {
      pr.lead('WHEELER', {top: out.a.top, bottom: out.a.bottom, x: out.a.head[0]}); pr.lead('HEAD', {top: out.a.headTop, bottom: out.a.chin, x: out.a.head[0]});
      const e = camPoint(c, leafPts(a)[2]); if (e) pr.lead('DOOR-EDGE', {top: e[1], bottom: e[1], x: e[0]});
    }
  },
};
export const shot = makeShot(def);
