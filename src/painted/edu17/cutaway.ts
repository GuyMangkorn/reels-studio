import {ell, glaze, hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {wp} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintBoat, type BoatKind} from './boats';
import {C} from './palette';

// N12 cutaway block D (B04-SH05; user Q2 2026-11-14: a 3D block). Block units (model, claims no distance or depth): x -4.5 (shore) -> +4.5 (deep),
// z -1.5 -> +1.5 (front cut face at +1.5, toward the camera), water top y 0, floor -1.0 (x <= -1.5) to -5.0 (x >= +1.5), base -5.6.
// W3 THUMBNAIL grade (Film, 2026-11-15): painted back to front (backdrop, shadow, back wall, floor, contents, front and end faces as glazes
// <= 0.35 over the contents (<= 90/255 alpha; DF painted-layer-order), boats on top).

const ok = (q: Pt[]) => q.length >= 3;
const hash01 = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const X0 = -4.5, X1 = 4.5, Z0 = -1.5, Z1 = 1.5, BASE = -5.6;
/** Floor height: beach strip at the shore end, shallow shelf, smooth slope, deep floor. */
export const floorY = (x: number) => {
  if (x <= -3.7) return -1.0 + 1.15 * Math.min(1, (-3.7 - x) / 0.5);
  if (x <= -1.5) return -1.0;
  if (x >= 1.5) return -5.0;
  const u = (x + 1.5) / 3;
  return -1.0 - 4.0 * u * u * (3 - 2 * u);
};
const XS = Array.from({length: 46}, (_, i) => X0 + (i * (X1 - X0)) / 45);
const waterCol = (x: number) => mixColor(C.shallow0, C.deep0, Math.min(1, Math.max(0, (x + 2) / 5.5)));

/** B04-SH05 motion (Boss W5; every field optional, none set = the W3 look frame LF07 unchanged). */
export type CutawayMotion = {
  /** shot seconds: ripple on the top face, ambient boat bob, drifting particles in the shallow water */
  t?: number;
  /** 0..1 deep cable glow lift (x >= 0) and shallow dim (cable glow x < 0 and a faint shade over the shallow water) */
  deepGlow?: number; shallowDim?: number;
  /** per boat (trawler, longtailY, cabin, longtailR) 0..1 bob pulse: rise on the swell, chain taut (1) then slack (<0 = extra sag) */
  bob?: number[];
};
export const paintCutaway = (p: Painter, c: YCam, o: CutawayMotion = {}) => {
  // backdrop wash and soft contact shadow
  for (let i = 0; i < 10; i++) hardFill(p, 9500 + i, mixColor(C.bd0, C.bd1, i / 9), [[-40, -40 + i * 200], [1120, -40 + i * 200], [1120, 170 + i * 200], [-40, 170 + i * 200]]);
  const sh = wp(c, [[X0 - 0.2, BASE - 0.3, Z0 - 0.2], [X1 + 0.3, BASE - 0.3, Z0 - 0.2], [X1 + 0.3, BASE - 0.3, Z1 + 0.3], [X0 - 0.2, BASE - 0.3, Z1 + 0.3]]);
  if (ok(sh)) glaze(p, 9512, '#9aa2a6', 90, sh, {bleed: 0.25, texture: 0});
  // back wall (z -1.5) seen through the water: water column section, then the floor surface strips
  for (let i = 0; i < XS.length - 1; i++) {
    const a = XS[i], b = XS[i + 1];
    const q = wp(c, [[a, floorY(a), Z0], [b, floorY(b), Z0], [b, 0, Z0], [a, 0, Z0]]);
    if (ok(q)) hardFill(p, 9520 + i, mixColor(waterCol((a + b) / 2), '#0a1622', 0.2), q);
  }
  for (let i = 0; i < XS.length - 1; i++) {
    const a = XS[i], b = XS[i + 1], m = (a + b) / 2;
    const q = wp(c, [[a, floorY(a), Z0], [b, floorY(b), Z0], [b, floorY(b), Z1], [a, floorY(a), Z1]]);
    if (ok(q)) hardFill(p, 9570 + i, mixColor(mixColor(C.seaSand, '#566d76', Math.min(1, Math.max(0, (m + 1.5) / 3))), waterCol(m), m > -3.7 ? 0.35 : 0), q);
  }
  // contents: shallow cable ridge with the break KD at x -2.4, slope run, deep cable glowing; chains and anchors; net bag
  const cab = (x: number): V3 => [x, floorY(x) + (x < -1.5 ? 0.04 : 0.02), 0.9];
  const run = (xa: number, xb: number, glow: boolean, id: number) => {
    const pts: Pt[] = [];
    for (let x = xa; x <= xb + 1e-6; x += 0.1) { const q = camPoint(c, cab(x)); if (q) pts.push(q); }
    if (pts.length < 2) return;
    if (glow) inkLine(p, id, pts, {closed: false, color: mixColor(C.glow, '#0f2a40', 0.2), weight: 3.6, still: true, curve: 0.2});
    else inkLine(p, id + 3, pts, {closed: false, color: mixColor(C.seaSand, C.ripple, 0.8), weight: 3.4, still: true, curve: 0.2});
    inkLine(p, id + 1, pts, {closed: false, color: C.cable, weight: 1.5, still: true, curve: 0.2});
    if (glow) inkLine(p, id + 2, pts, {closed: false, color: mixColor(C.glow, C.core, 0.4), weight: 0.5, still: true, curve: 0.2});
  };
  run(-4.2, -2.48, false, 9640);
  if (o.deepGlow === undefined && o.shallowDim === undefined) run(-2.32, 4.5, true, 9650);
  else {
    // split the glowing run at x 0: shallow part dims, deep part lifts (glow width and core brightness)
    const g = o.deepGlow ?? 0, d = o.shallowDim ?? 0;
    const part = (xa: number, xb: number, k: number, id: number) => {
      const pts: Pt[] = [];
      for (let x = xa; x <= xb + 1e-6; x += 0.1) { const q = camPoint(c, cab(x)); if (q) pts.push(q); }
      if (pts.length < 2) return;
      if (k > 0) inkLine(p, id, pts, {closed: false, color: mixColor(C.glow, '#0f2a40', Math.min(0.8, 0.2 + 0.8 * Math.max(0, 1 - k))), weight: 3.6 * k, still: true, curve: 0.2});
      inkLine(p, id + 1, pts, {closed: false, color: C.cable, weight: 1.5, still: true, curve: 0.2});
      inkLine(p, id + 2, pts, {closed: false, color: mixColor(C.glow, C.core, 0.4 + 0.4 * Math.max(0, k - 1)), weight: 0.5 * Math.max(0.4, k), still: true, curve: 0.2});
    };
    part(-2.32, 0, 1 - 0.55 * d, 9650);
    part(0, 4.5, 1 + 0.35 * g, 9654);
  }
  const kd = camPoint(c, cab(-2.4));
  if (kd) { hardFill(p, 9660, mixColor(C.seaSand, '#ffffff', 0.25), ell(kd[0], kd[1] - 8, 20, 10, 12)); hardFill(p, 9661, mixColor(C.seaSand, '#ffffff', 0.4), ell(kd[0] + 6, kd[1] - 14, 10, 6, 10)); }
  // miniatures drawn x1.4 the brief's model scale (picture exaggeration for legibility at 1x, like the vertical exaggeration; W3 LF07)
  const boats: [BoatKind, V3, number, number][] = [['trawler', [-1.2, 0, -0.9], 95, 0.14], ['longtailY', [-2.6, 0, -0.7], 80, 0.175], ['cabin', [-2.0, 0, 0.4], 100, 0.168], ['longtailR', [-3.3, 0, 0.6], 85, 0.154]];
  const t = o.t, lift = (i: number) => (o.bob?.[i] ?? 0) * 0.12 + (t !== undefined ? 0.012 * Math.sin(t * 1.4 + i * 1.7) : 0);
  boats.forEach(([, at], i) => {
    const an: V3 = [at[0] + 0.45, floorY(at[0] + 0.45), at[2]], a = camPoint(c, an), b = camPoint(c, [at[0] + 0.2, lift(i), at[2]]);
    if (!a || !b) return;
    // sag 4 px at rest; a bob pulls the chain taut (1 -> 0 px) and the settle lets it hang slack (negative pulse -> up to 10 px)
    const bb = o.bob?.[i] ?? 0, sag = bb >= 0 ? 4 * (1 - bb) : 4 - 6 * bb;
    inkLine(p, 9670 + i * 3, [b, [(a[0] + b[0]) / 2 + sag, (a[1] + b[1]) / 2 + sag * 0.3], a], {closed: false, color: bb > 0.6 ? '#2e3236' : '#3a3e42', weight: 1.5, still: true, curve: 0.3});
    // a small stockless anchor: shank, crown and two flukes, its tip in the sand
    const k = camUnit(c, an) * 0.14;
    inkLine(p, 9671 + i * 3, [[a[0], a[1] - k * 1.2], [a[0], a[1]]], {closed: false, color: C.steel, weight: 1.8, still: true});
    hardFill(p, 9672 + i * 3, mixColor(C.steel, C.rust, 0.3), [[a[0] - k * 0.75, a[1] - k * 0.35], [a[0], a[1] + k * 0.15], [a[0] + k * 0.75, a[1] - k * 0.35], [a[0] + k * 0.5, a[1] - k * 0.1], [a[0], a[1] - k * 0.12], [a[0] - k * 0.5, a[1] - k * 0.1]]);
  });
  const net = camPoint(c, [-1.8, floorY(-1.8) + 0.08, 0.9]);
  if (net) { const k = camUnit(c, [-1.8, -1, 0.9]); hardFill(p, 9690, C.net, ell(net[0], net[1], 0.32 * k, 0.12 * k, 14)); for (let j = 0; j < 5; j++) inkLine(p, 9692 + j, [[net[0] - 0.28 * k + j * 0.14 * k, net[1] - 0.1 * k], [net[0] - 0.2 * k + j * 0.12 * k, net[1] + 0.1 * k]], {closed: false, color: mixColor(C.net, '#5a4a30', 0.4), weight: 0.6, still: true}); inkLine(p, 9691, [[net[0] + 0.3 * k, net[1]], [net[0] + 0.9 * k, net[1] - 0.25 * k]], {closed: false, color: '#6a5a40', weight: 0.7, still: true}); }
  if (t !== undefined) {
    // particles drifting in the shallow water only (x < -1.5), seen through the water
    for (let i = 0; i < 26; i++) {
      const x = -4.0 + 2.5 * hash01(i * 3.1) + 0.05 * Math.sin(t * 0.6 + i), y = -0.15 - 0.8 * hash01(i * 7.3 + 1) + 0.04 * Math.sin(t * 0.9 + i * 2), z = Z0 + 0.2 + 2.6 * hash01(i * 5.7 + 2), q = camPoint(c, [x, Math.max(floorY(x) + 0.05, y), z]);
      if (q) hardFill(p, 9840 + i, mixColor(C.caustic, C.shallow0, 0.4), ell(q[0], q[1], 1.6, 1.6, 6));
    }
  }
  if ((o.shallowDim ?? 0) > 0) {
    const q = wp(c, [[-3.9, 0, Z1], [-1.5, 0, Z1], [-1.5, floorY(-1.5), Z1], [-3.9, floorY(-3.9), Z1]]);
    if (ok(q)) glaze(p, 9838, '#0a1622', 40 * (o.shallowDim ?? 0), q, {bleed: 0, texture: 0});
  }
  // deep end face (x +4.5): always painted, before the front face (seen through the water section when the camera is inside its plane)
  {
    const s = wp(c, [[X1, BASE, Z1], [X1, BASE, Z0], [X1, floorY(X1), Z0], [X1, floorY(X1), Z1]]);
    if (ok(s)) hardFill(p, 9810, mixColor(C.ripple, '#566d76', 0.5), s);
    const w = wp(c, [[X1, floorY(X1), Z1], [X1, floorY(X1), Z0], [X1, 0, Z0], [X1, 0, Z1]]);
    if (ok(w)) hardFill(p, 9811, mixColor(C.deep0, C.slope1, 0.25), w);
  }
  // front cut face (z +1.5): sand section opaque, water section as a glaze bright top-left -> dark bottom-right
  for (let i = 0; i < XS.length - 1; i++) {
    const a = XS[i], b = XS[i + 1], m = (a + b) / 2;
    const sand = wp(c, [[a, BASE, Z1], [b, BASE, Z1], [b, floorY(b), Z1], [a, floorY(a), Z1]]);
    if (ok(sand)) hardFill(p, 9700 + i, mixColor(C.seaSand, C.ripple, 0.35 + 0.25 * Math.min(1, Math.max(0, (m + 1.5) / 3))), sand);
    const top = Math.max(floorY(a), floorY(b));
    if (top < 0) { const w = wp(c, [[a, floorY(a), Z1], [b, floorY(b), Z1], [b, 0, Z1], [a, 0, Z1]]); if (ok(w)) glaze(p, 9750 + i, waterCol(m), 58, w, {bleed: 0, texture: 0}); }
  }
  // sand strata lines on the front face
  [-0.35, -0.5].forEach((f, k) => { const pts = XS.map((x) => camPoint(c, [x, floorY(x) + (BASE - floorY(x)) * (k ? 0.55 : 0.3) + f * 0, Z1 + 0.001])).filter(Boolean) as Pt[]; if (pts.length > 1) inkLine(p, 9800 + k, pts, {closed: false, color: mixColor(C.ripple, '#6a5a40', 0.3), weight: 0.6, still: true, curve: 0.2}); });
  // water top face: turquoise over the shallows to navy over the deep, a thin glaze; beach strip and two tiny palms
  for (let i = 0; i < XS.length - 1; i++) {
    const a = XS[i], b = XS[i + 1];
    if (floorY(b) >= 0) continue;
    const q = wp(c, [[a, 0, Z0], [b, 0, Z0], [b, 0, Z1], [a, 0, Z1]]);
    if (ok(q)) glaze(p, 9820 + i, mixColor(waterCol((a + b) / 2), '#ffffff', 0.08), 50, q, {bleed: 0, texture: 0});
  }
  if (t !== undefined) for (let k = 0; k < 7; k++) {
    // soft ripple lines crossing the top face, drifting toward the shore
    const x = X1 - ((k * 1.3 + t * 0.25) % 8.4), pts = [Z0 + 0.1, Z1 - 0.1].map((z) => camPoint(c, [x, 0.001, z]));
    if (x > -3.9 && pts[0] && pts[1]) inkLine(p, 9862 + k, pts as Pt[], {closed: false, color: mixColor(waterCol(x), '#ffffff', 0.35), weight: 0.6, still: true, curve: 0});
  }
  const beach = wp(c, [[X0, floorY(X0), Z0], [-3.9, 0.02, Z0], [-3.9, 0.02, Z1], [X0, floorY(X0), Z1]]);
  if (ok(beach)) hardFill(p, 9870, C.seaSand, beach);
  [[-4.25, -0.8], [-4.15, 0.7]].forEach(([x, z], i) => {
    const b = camPoint(c, [x, floorY(x), z]), t = camPoint(c, [x + 0.12, floorY(x) + 0.6, z]);
    if (!b || !t) return;
    inkLine(p, 9872 + i * 2, [b, t], {closed: false, color: C.palmTrunk, weight: 1.2, still: true});
    const k = camUnit(c, [x, 0, z]) * 0.18;
    hardFill(p, 9873 + i * 2, C.palmLeaf, ell(t[0], t[1], k, k * 0.45, 10));
  });
  // top edge lines of the block (thin, crisp)
  const edge = (pts: V3[], id: number) => { const q = pts.map((v) => camPoint(c, v)); if (q.every(Boolean)) inkLine(p, id, q as Pt[], {closed: false, color: mixColor(C.deep0, '#ffffff', 0.5), weight: 0.6, still: true, curve: 0}); };
  edge([[X0, 0, Z1], [X1, 0, Z1], [X1, 0, Z0]], 9880);
  edge([[X1, 0, Z1], [X1, BASE, Z1], [X0, BASE, Z1]], 9881);
  boats.forEach(([kind, at, hd, sc], i) => paintBoat(p, c, 9900 + i * 20, kind, at, hd, {scale: sc, anchor: false, bob: lift(i) / sc}));
};
