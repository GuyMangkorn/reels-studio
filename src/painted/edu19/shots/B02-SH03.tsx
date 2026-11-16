import {hardFill, INK, inkLine, ell} from '../../kit/draw';
import {mixColor, type Pt} from '../../kit/painter';
import {paintStopwatch, stopwatchText} from '../../kit/props';
import type {V3} from '../../kit/space';
import {MUM} from '../cast';
import {ease, frac, lerp3} from '../motion19';
import {makeShot} from '../shot';
import {paintFieldShot, sheetCam, sheetMove, type FieldShot, type FieldShotDef} from '../stage';
import {trailPrints} from '../trail';

// B02-SH03 · G 676-721 (45 f) · twenty minutes (W-WAIT; EDU-EP19-SHEETS-R3, R1 camera kept). Insert end-on toward the tree. NO GLOW (N4).
// FG (hardFill, the close-up foreground rule): MUM's left forearm across the lower middle, the stopwatch face to the lens (watch centre (540, 1004 ->
// 1026), face ~130 px wide), SVG digits 00:00 -> 20:00 over l 3-42 (ease-in-out) in the overlay. BG field on the event clock: the sun goes from the
// B01 key (28 deg) to the B02 key (22 deg), light flattening, and the tree shade turns 25 deg and lengthens across the trail (`SunRef` mix);
// GIRL beside the trunk (P43) yawns l 18-30 (eyes shut, mouth open), then ducks back behind the trunk to GP l 32-40.
const N = 45;
const M = sheetMove([0.55, 1.05, -3.95], [118, 112], [0.38, 0.34], 1.12, {f: 1000, hy: 820});
/** From this end-on vantage GP (6.45, 0, -0.05) is behind the trunk: she stands clear of its right edge to yawn (6.1, 0, 0.55; picture x ~776,
 *  trunk 602-739) and ducks back to GP (hidden). */
const OUT: V3 = [6.1, 0, 0.55], PEEK: V3 = [6.45, 0, -0.05];
const time = (L: number) => ease(frac(L, 3, 42));
/** Forearm axis (elbow off frame bottom-left -> wrist) and the watch centre on it; `dy` follows the sheet's 1004 -> 1026 drift. */
const arm = (L: number) => {
  const dy = 22 * frac(L, 0, N), A: Pt = [-90, 1300 + dy], B: Pt = [650, 990 + dy], ang = Math.atan2(B[1] - A[1], B[0] - A[0]);
  const k = (540 - A[0]) / (B[0] - A[0]);
  return {A, B, ang, k, W: [540, A[1] + (B[1] - A[1]) * k] as Pt};
};
const R = 78;

const state = (L: number): FieldShot => {
  const u = time(L), yawn = frac(L, 18, 22) * (1 - frac(L, 28, 31));
  return {sun: {from: 'B01', to: 'B02', u, az: -25 * u}, t: L / 30, prints: trailPrints(), stack: true,
    girl: {at: lerp3(OUT, PEEK, ease(frac(L, 32, 40))), view: 'front', pose: L < 32 ? 'P01' : 'P43', face: yawn > 0.3 ? 'sleepy' : 'smug', faceState: yawn > 0.3 ? {mouth: 'o', eyes: 'shut'} : {}, bias: 0.2, fig: {head: 'front'}}};
};

export const B02_SH03: FieldShotDef = {
  id: 'B02-SH03', N,
  cam: (L) => sheetCam(M, L, N),
  state,
  paint: (p, L) => {
    paintFieldShot(p, sheetCam(M, L, N), state(L));
    // FG forearm (skin, a soft shade on its lower edge), the fist beyond the wrist, the strap and watch from the kit.
    // Fix round 1 (user 2026-11-16, "is the watch strapped the wrong way?"): the strap now crosses the forearm (kit paintStopwatch), so the
    // forearm is drawn at a wrist width the 0.05 m case sits on (case ~0.75 of the wrist, as in life): 2 x 100 px at the watch, was 2 x 59.
    const {A, B, ang, W, k} = arm(L), nx = -Math.sin(ang), ny = Math.cos(ang), w0 = 128, w1 = 92;
    const side = (s: number, w: number, q: Pt): Pt => [q[0] + s * nx * w, q[1] + s * ny * w];
    const skin = MUM.head.skin, fore: Pt[] = [side(-1, w0, A), side(-1, w1, B), side(1, w1, B), side(1, w0, A)];
    hardFill(p, 9700, skin, fore);
    hardFill(p, 9701, mixColor(skin, '#8a5a48', 0.25), [side(0.45, w0, A), side(0.45, w1, B), side(1, w1, B), side(1, w0, A)]);
    const fist: Pt = [B[0] + 80 * Math.cos(ang), B[1] + 80 * Math.sin(ang)];
    hardFill(p, 9702, skin, ell(fist[0], fist[1], 112, 96, 20, ang));
    inkLine(p, 9703, [side(-1, w0, A), side(-1, w1, B)], {closed: false, weight: 1.1, color: mixColor(skin, INK, 0.55), curve: 0});
    inkLine(p, 9704, [side(1, w0, A), side(1, w1, B)], {closed: false, weight: 1.1, color: mixColor(skin, INK, 0.55), curve: 0});
    inkLine(p, 9705, ell(fist[0], fist[1], 112, 96, 20, ang), {weight: 1.1, color: mixColor(skin, INK, 0.55), curve: 0.3});
    // Knuckle crease on the fist (reads as a closed hand, not a stick end).
    inkLine(p, 9706, [[fist[0] + 40 * Math.cos(ang) - 54 * nx, fist[1] + 40 * Math.sin(ang) - 54 * ny], [fist[0] + 62 * Math.cos(ang), fist[1] + 62 * Math.sin(ang)], [fist[0] + 40 * Math.cos(ang) + 54 * nx, fist[1] + 40 * Math.sin(ang) + 54 * ny]], {closed: false, weight: 1, color: mixColor(skin, INK, 0.45), curve: 0.5});
    paintStopwatch(p, 9710, W, R, {angle: ang, wrist: 2 * (w0 + (w1 - w0) * k)});
  },
  overlay: (L) => {
    const {W, ang} = arm(L);
    return (
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <text x={W[0]} y={W[1]} transform={`rotate(${(ang * 180) / Math.PI} ${W[0]} ${W[1]})`} textAnchor="middle" dominantBaseline="central" fill="#1f2a26" style={{font: `700 ${Math.round(R * 0.5)}px "Courier New", monospace`, letterSpacing: '1px'}}>{stopwatchText(1200 * time(L))}</text>
      </svg>
    );
  },
};
export const shot = makeShot(B02_SH03);
