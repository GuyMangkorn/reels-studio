// Hand-held props for the hand kits (KIT-POV-HANDS, KIT-MID-HANDS, 18 Nov 2026): simple flat-shaded 3D primitives (box, frustum, sphere,
// ring) seen through the yaw camera, and a catalog of everyday things built from them, each placed by a `Frame3` (origin + axes, metres).
// The frame normally comes from a hand landmark (hand-place.ts `LANDMARKS`), so the prop sits in the grip. No Remotion import.
import {solid} from './draw';
import {inkLine} from './hands';
import {add3, scale3, sub3, type V3} from './space';
import {cross3, dot3, norm3} from './hand-place';
import {mixColor, type Painter, type Pt} from './painter';
import {camPoint, camSpace, camToPicture, type YCam} from './ycam';

/** Origin and unit axes (world). A prop's `y` is its long or up axis, `z` its face normal (phone screen, card face), `x` completes the set. */
export type Frame3 = {o: V3; x: V3; y: V3; z: V3};
/** A frame from an origin, its y axis and a hint for z (made square to y). */
export const frameOf = (o: V3, y: V3, zHint: V3): Frame3 => {
  const Y = norm3(y), Z = norm3(sub3(zHint, scale3(Y, dot3(zHint, Y)))), X = cross3(Y, Z);
  return {o, x: X, y: Y, z: Z};
};
const P = (f: Frame3, a: number, b: number, c: number): V3 => add3(add3(add3(f.o, scale3(f.x, a)), scale3(f.y, b)), scale3(f.z, c));

/** Painted fill (UT11: painted, not flat): two soft passes, light paper texture. */
const hardFill = (p: Painter, seed: number, color: string, pts: Pt[]) => solid(p, seed, color, pts, 2, 0.08, 0.08);
const LIGHT = norm3([-0.35, 0.8, 0.5]);
const shadeOf = (c: string, n: V3) => { const k = dot3(n, LIGHT); return k >= 0 ? mixColor(c, '#ffffff', 0.12 * k) : mixColor(c, '#20160f', 0.28 * -k); };
const inkOf = (c: string) => mixColor(c, '#1a1410', 0.6);
const camPos = (cam: YCam): V3 => [cam.x, cam.y, cam.z];
const facing = (cam: YCam, centre: V3, n: V3) => dot3(n, sub3(camPos(cam), centre)) > 0;
const proj = (cam: YCam, pts: V3[]): Pt[] | null => { const out = pts.map((v) => camPoint(cam, v, 0.05)); return out.every(Boolean) ? (out as Pt[]) : null; };
/** A polygon cut at the near plane (a wall or floor that reaches past the lens keeps the part in front), then projected. */
const clipProj = (cam: YCam, pts: V3[], near = 0.05): Pt[] | null => {
  const q = pts.map((v) => camSpace(cam, v)), out: Pt[] = [];
  for (let i = 0; i < q.length; i++) {
    const a = q[i], b = q[(i + 1) % q.length];
    if (a.d >= near) out.push(camToPicture(cam, a));
    if ((a.d >= near) !== (b.d >= near)) { const u = (near - a.d) / (b.d - a.d); out.push(camToPicture(cam, {r: a.r + (b.r - a.r) * u, u: a.u + (b.u - a.u) * u, d: near})); }
  }
  return out.length >= 3 ? out : null;
};
const inkW = (cam: YCam, at: V3) => Math.max(1.1, Math.min(2.6, cam.f / Math.max(0.2, camSpace(cam, at).d) * 0.0012));

/** Convex hull (monotone chain) of picture points: the silhouette of a convex solid. */
const hull = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const p of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of s.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};

/** Box of half sizes [hx, hy, hz] in frame `f`; `faces` overrides colours by face id (+x -x +y -y +z -z). */
export const paintBox = (p: Painter, cam: YCam, id: number, f: Frame3, h: V3, color: string, faces: Partial<Record<'+x' | '-x' | '+y' | '-y' | '+z' | '-z', string>> = {}) => {
  const all: [keyof typeof faces, V3, [number, number, number][]][] = [
    ['+x', f.x, [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]]], ['-x', scale3(f.x, -1), [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]]],
    ['+y', f.y, [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]]], ['-y', scale3(f.y, -1), [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]],
    ['+z', f.z, [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]], ['-z', scale3(f.z, -1), [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]]],
  ];
  const corners: V3[] = [];
  all.forEach(([k, n, q], i) => {
    const w = q.map(([a, b, c]) => P(f, a * h[0], b * h[1], c * h[2]));
    corners.push(...w);
    const fc = scale3(w.reduce((s, v) => add3(s, v), [0, 0, 0] as V3), 0.25);
    if (!facing(cam, fc, n)) return;
    const pts = clipProj(cam, w);
    if (pts) { const c = shadeOf(faces[k] ?? color, n); hardFill(p, id + i, c, pts); inkLine(p, id + 10 + i, pts, inkW(cam, fc) * 0.7, 0.05, true, inkOf(c)); }
  });
  const sil = proj(cam, corners);
  if (sil) inkLine(p, id + 20, hull(sil), inkW(cam, f.o), 0.05, true, inkOf(color));
};

/** Frustum along `f.y` from y0 (radius r0) to y1 (radius r1); caps filled when seen. `top` colours the y1 cap (liquid in a cup). */
export const paintFrustum = (p: Painter, cam: YCam, id: number, f: Frame3, y0: number, y1: number, r0: number, r1: number, color: string, top?: string, n = 22) => {
  const ring = (y: number, r: number) => Array.from({length: n}, (_, i) => P(f, Math.cos((i / n) * 2 * Math.PI) * r, y, Math.sin((i / n) * 2 * Math.PI) * r));
  const A = ring(y0, r0), B = ring(y1, r1);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, quad = [A[i], A[j], B[j], B[i]], fc = scale3(quad.reduce((s, v) => add3(s, v), [0, 0, 0] as V3), 0.25);
    const ang = ((i + 0.5) / n) * 2 * Math.PI, nrm = norm3(add3(add3(scale3(f.x, Math.cos(ang)), scale3(f.z, Math.sin(ang))), scale3(f.y, (r0 - r1) / Math.max(1e-6, y1 - y0))));
    if (!facing(cam, fc, nrm)) continue;
    const pts = proj(cam, quad);
    if (pts) hardFill(p, id + i, shadeOf(color, nrm), pts);
  }
  const caps: [V3[], V3, string][] = [[B, f.y, top ?? color], [A, scale3(f.y, -1), color]];
  caps.forEach(([R, nrm, c], k) => {
    const cc = scale3(R.reduce((s, v) => add3(s, v), [0, 0, 0] as V3), 1 / n);
    if ((k === 0 ? r1 : r0) < 1e-4 || !facing(cam, cc, nrm)) return;
    const pts = proj(cam, R);
    if (pts) { hardFill(p, id + 40 + k, k === 0 && top ? top : shadeOf(c, nrm), pts); inkLine(p, id + 42 + k, pts, inkW(cam, cc) * 0.8, 0.1, true, inkOf(c)); }
  });
  const sil = proj(cam, [...A, ...B]);
  if (sil) inkLine(p, id + 45, hull(sil), inkW(cam, f.o), 0.1, true, inkOf(color));
};

/** Sphere of radius r at `c`, with a soft shade crescent away from the light. */
export const paintSphere = (p: Painter, cam: YCam, id: number, c: V3, r: number, color: string) => {
  const q = camPoint(cam, c, 0.05);
  if (!q) return;
  const R = (cam.f * r) / camSpace(cam, c).d, circ = (cx: number, cy: number, rr: number): Pt[] => Array.from({length: 28}, (_, i) => [cx + Math.cos((i / 28) * 6.283) * rr, cy + Math.sin((i / 28) * 6.283) * rr]);
  hardFill(p, id, color, circ(q[0], q[1], R));
  hardFill(p, id + 1, mixColor(color, '#20160f', 0.22), circ(q[0] + R * 0.28, q[1] + R * 0.3, R * 0.78).map(([x, y]) => { const dx = x - q[0], dy = y - q[1], l = Math.hypot(dx, dy); return l > R ? [q[0] + (dx / l) * R, q[1] + (dy / l) * R] as Pt : [x, y] as Pt; }));
  hardFill(p, id + 2, mixColor(color, '#ffffff', 0.45), circ(q[0] - R * 0.38, q[1] - R * 0.4, R * 0.16));
  inkLine(p, id + 3, circ(q[0], q[1], R), inkW(cam, c), 0.1, true, inkOf(color));
};

/** A torus-like ring (steering wheel rim, bangle): centre `f.o`, in the plane of f.x/f.z, radius `R`, tube radius `r`. */
export const paintRing = (p: Painter, cam: YCam, id: number, f: Frame3, R: number, r: number, color: string, n = 40) => {
  const at = (a: number, rr: number) => P(f, Math.cos(a) * rr, 0, Math.sin(a) * rr);
  const outer = proj(cam, Array.from({length: n}, (_, i) => at((i / n) * 2 * Math.PI, R + r)));
  const inner = proj(cam, Array.from({length: n}, (_, i) => at((i / n) * 2 * Math.PI, R - r)));
  if (!outer || !inner) return;
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; hardFill(p, id + i, color, [outer[i], outer[j], inner[j], inner[i]]); }
  inkLine(p, id + n, outer, inkW(cam, f.o), 0.1, true, inkOf(color));
  inkLine(p, id + n + 1, inner, inkW(cam, f.o), 0.1, true, inkOf(color));
};

/** A flat quad in the frame's x/y plane (paper, a door, a table top), half sizes hx, hy. */
export const paintQuad = (p: Painter, cam: YCam, id: number, f: Frame3, hx: number, hy: number, color: string, ink = true) => {
  const pts = clipProj(cam, [P(f, -hx, -hy, 0), P(f, hx, -hy, 0), P(f, hx, hy, 0), P(f, -hx, hy, 0)]);
  if (!pts) return;
  hardFill(p, id, color, pts);
  if (ink) inkLine(p, id + 1, pts, inkW(cam, f.o), 0.05, true, inkOf(color));
};
const tubeLine = (p: Painter, cam: YCam, id: number, pts: V3[], r: number, color: string) => {
  const q = proj(cam, pts);
  if (!q) return;
  const w = (cam.f * r * 2) / camSpace(cam, pts[0]).d;
  inkLine(p, id, q, w + 2.4, 0.3, false, inkOf(color));
  inkLine(p, id + 1, q, w, 0.3, false, color);
};

export type PropId = 'cup' | 'glass' | 'bottle' | 'phone' | 'pen' | 'ball' | 'apple' | 'book' | 'open-book' | 'card' | 'coin' | 'key' | 'remote' | 'door-lever' | 'button-panel' | 'keyboard' | 'wheel' | 'paper' | 'table' | 'door'
  | 'bill' | 'bills' | 'spoon' | 'pill' | 'scissors' | 'tap' | 'box' | 'umbrella';
/**
 * Prop catalog. Frames: `cup`, `glass`, `bottle`, `pen`, `remote`: y along the long axis, origin at the grip centre. `phone`, `card`, `book`,
 * `paper`: y the long edge, z the face normal (screen, cover), origin at the centre. `ball`, `apple`: origin at the centre. `coin`, `key`:
 * origin at the pinch, z the face. `door-lever`: y along the lever, origin at the grip, z out of the door. `button-panel`, `keyboard`, `table`:
 * origin on the surface the finger touches, z the surface normal. `wheel`: origin at the rim point the hand grips is NOT used; the wheel is
 * placed by its own centre (o) with z the axle toward the driver.
 */
export const PROPS: Record<PropId, {note: string; size: number; paint: (p: Painter, cam: YCam, id: number, f: Frame3) => void}> = {
  cup: {note: 'coffee cup, 8 cm wide, handle on +x', size: 0.04, paint: (p, cam, id, f) => {
    paintFrustum(p, cam, id, f, -0.05, 0.045, 0.034, 0.041, '#f3efe6', '#6b4226');
    tubeLine(p, cam, id + 60, [P(f, 0.038, 0.025, 0), P(f, 0.062, 0.018, 0), P(f, 0.066, -0.005, 0), P(f, 0.058, -0.025, 0), P(f, 0.036, -0.03, 0)], 0.006, '#f3efe6');
  }},
  glass: {note: 'glass of water', size: 0.035, paint: (p, cam, id, f) => paintFrustum(p, cam, id, f, -0.055, 0.06, 0.03, 0.036, '#cfe4ec', '#a8cfe0')},
  bottle: {note: 'water bottle, 6.6 cm wide, cap up (+y)', size: 0.033, paint: (p, cam, id, f) => {
    paintFrustum(p, cam, id, f, -0.11, 0.06, 0.033, 0.033, '#bfe0ea');
    paintFrustum(p, cam, id + 50, f, 0.06, 0.095, 0.033, 0.013, '#bfe0ea');
    paintFrustum(p, cam, id + 100, f, 0.095, 0.115, 0.014, 0.014, '#2f78c4');
  }},
  phone: {note: 'smartphone 7 x 15 cm, screen on +z', size: 0.004, paint: (p, cam, id, f) => {
    paintBox(p, cam, id, f, [0.036, 0.075, 0.004], '#2a2c31');
    if (facing(cam, f.o, f.z)) paintQuad(p, cam, id + 30, {...f, o: P(f, 0, 0.002, 0.0042)}, 0.031, 0.066, '#5b8fc9', false);
  }},
  pen: {note: 'pen, tip at -y', size: 0.0045, paint: (p, cam, id, f) => {
    paintFrustum(p, cam, id, f, -0.07, 0.07, 0.0045, 0.0045, '#2f4f9a');
    paintFrustum(p, cam, id + 50, f, -0.088, -0.07, 0.001, 0.0045, '#d9d2c4');
  }},
  ball: {note: 'ball 22 cm', size: 0.11, paint: (p, cam, id, f) => paintSphere(p, cam, id, f.o, 0.11, '#e8823a')},
  apple: {note: 'apple 8 cm, stem up (+y)', size: 0.04, paint: (p, cam, id, f) => { paintSphere(p, cam, id, f.o, 0.04, '#c8372d'); tubeLine(p, cam, id + 10, [P(f, 0, 0.034, 0), P(f, 0.004, 0.05, 0)], 0.002, '#5a3a1e'); }},
  book: {note: 'closed book 15 x 21 x 3 cm, cover on +z', size: 0.015, paint: (p, cam, id, f) => paintBox(p, cam, id, f, [0.075, 0.105, 0.015], '#3f6f5a', {'+x': '#f1ead8', '-y': '#f1ead8', '+y': '#f1ead8'})},
  'open-book': {note: 'open book, spine along y at the origin, pages face +z', size: 0.01, paint: (p, cam, id, f) => {
    for (const s of [-1, 1]) {
      const tilt = norm3(add3(scale3(f.x, s), scale3(f.z, 0.18))), fz = norm3(cross3(tilt, f.y));
      const g: Frame3 = {o: add3(f.o, scale3(tilt, 0.075)), x: tilt, y: f.y, z: s > 0 ? fz : scale3(fz, -1)};
      paintBox(p, cam, id + (s > 0 ? 0 : 30), g, [0.075, 0.105, 0.008], '#f4eedd', {'-z': '#3f6f5a'});
    }
  }},
  card: {note: 'bank or ID card 5.4 x 8.6 cm, face +z', size: 0.0005, paint: (p, cam, id, f) => { paintBox(p, cam, id, f, [0.027, 0.043, 0.0006], '#e9e4d8'); if (facing(cam, f.o, f.z)) paintQuad(p, cam, id + 30, {...f, o: P(f, 0, 0.02, 0.0008)}, 0.027, 0.006, '#c0473a', false); }},
  coin: {note: 'coin 2.4 cm, face +z', size: 0.001, paint: (p, cam, id, f) => paintFrustum(p, cam, id, {o: f.o, x: f.x, y: f.z, z: scale3(f.y, -1)}, -0.001, 0.001, 0.012, 0.012, '#d7b14a')},
  key: {note: 'key: bow at the pinch, blade along +y, face +z', size: 0.0015, paint: (p, cam, id, f) => {
    paintBox(p, cam, id, {...f, o: P(f, 0, 0.032, 0)}, [0.004, 0.024, 0.0012], '#b8b4a8');
    paintFrustum(p, cam, id + 30, {o: f.o, x: f.x, y: f.z, z: scale3(f.y, -1)}, -0.0015, 0.0015, 0.013, 0.013, '#c9a646');
  }},
  remote: {note: 'TV remote 5 x 18 cm, buttons on +z', size: 0.012, paint: (p, cam, id, f) => {
    paintBox(p, cam, id, f, [0.024, 0.09, 0.011], '#34363c');
    if (facing(cam, f.o, f.z)) for (let i = 0; i < 6; i++) paintSphere(p, cam, id + 40 + i * 4, P(f, (i % 2 ? 0.009 : -0.009), 0.05 - Math.floor(i / 2) * 0.022, 0.012), 0.005, i === 0 ? '#d24a3a' : '#9aa0a8');
  }},
  'door-lever': {note: 'door with a lever handle: lever along y through the grip, door plane behind it (z out of the door)', size: 0.011, paint: (p, cam, id, f) => {
    paintQuad(p, cam, id, {...f, o: P(f, 0.2, 0.06, -0.055)}, 0.45, 0.9, '#c79a6a');
    paintBox(p, cam, id + 10, {...f, o: P(f, 0, 0.09, -0.048)}, [0.022, 0.06, 0.006], '#a9a9a2');
    paintFrustum(p, cam, id + 40, {o: P(f, 0, 0.09, -0.042), x: f.x, y: f.z, z: scale3(f.y, -1)}, 0, 0.042, 0.009, 0.009, '#c8c8c0');
    paintFrustum(p, cam, id + 100, f, -0.06, 0.09, 0.011, 0.011, '#c8c8c0');
  }},
  'button-panel': {note: 'wall panel with a round button at the origin, z out of the panel', size: 0.012, paint: (p, cam, id, f) => {
    paintBox(p, cam, id, {...f, o: P(f, 0, 0.03, -0.024)}, [0.09, 0.13, 0.012], '#c9ccd1');
    paintFrustum(p, cam, id + 30, {o: P(f, 0, 0, -0.012), x: f.x, y: f.z, z: scale3(f.y, -1)}, 0, 0.01, 0.022, 0.02, '#d24a3a');
  }},
  keyboard: {note: 'keyboard 44 x 14 cm, keys up (+z); origin on the key the index presses', size: 0.01, paint: (p, cam, id, f) => {
    paintBox(p, cam, id, {...f, o: P(f, -0.05, 0.02, -0.012)}, [0.22, 0.07, 0.01], '#3a3d44');
    for (let r = 0; r < 4; r++) for (let c = 0; c < 13; c++) paintQuad(p, cam, id + 30 + (r * 13 + c) * 2, {...f, o: P(f, -0.05 - 0.198 + c * 0.033, 0.02 - 0.05 + r * 0.033, -0.0015)}, 0.013, 0.013, '#d9dbe0', false);
  }},
  wheel: {note: 'steering wheel radius 18 cm, origin at the centre, z the axle toward the driver', size: 0.018, paint: (p, cam, id, f) => {
    const plane: Frame3 = {o: f.o, x: f.x, y: f.z, z: f.y};
    paintFrustum(p, cam, id + 200, plane, -0.06, 0.02, 0.05, 0.045, '#2b2c30');
    for (const a of [Math.PI * 0.5, Math.PI * 1.15, Math.PI * 1.85]) tubeLine(p, cam, id + 260 + Math.round(a * 10), [f.o, P(f, Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0)], 0.014, '#2b2c30');
    paintRing(p, cam, id, {o: f.o, x: f.x, y: f.z, z: f.y}, 0.18, 0.017, '#2b2c30');
  }},
  paper: {note: 'A4 sheet, face +z', size: 0, paint: (p, cam, id, f) => paintQuad(p, cam, id, f, 0.105, 0.148, '#fbf8f0')},
  table: {note: 'table top, face +z', size: 0, paint: (p, cam, id, f) => paintQuad(p, cam, id, f, 0.8, 0.5, '#b07b4f')},
  door: {note: 'plain door leaf 90 x 200 cm, face +z, origin at its centre', size: 0, paint: (p, cam, id, f) => paintQuad(p, cam, id, f, 0.45, 1.0, '#c79a6a')},
  // Added 18 Nov 2026 (kit extension): money, food, medicine, tools, weather. Keep in step with hand-props3d.ts.
  bill: {note: 'banknote 7.2 x 15.6 cm, long edge y, face +z', size: 0.0004, paint: (p, cam, id, f) => { paintBox(p, cam, id, f, [0.036, 0.078, 0.0004], BILL); if (facing(cam, f.o, f.z)) paintQuad(p, cam, id + 30, {...f, o: P(f, 0, 0.02, 0.0005)}, 0.022, 0.03, BILL_PALE, false); }},
  bills: {note: 'stack of banknotes 1.2 cm thick, long edge y, top face +z', size: 0.006, paint: (p, cam, id, f) => paintBox(p, cam, id, f, [0.036, 0.078, 0.006], BILL, {'+x': BILL_PALE, '-x': BILL_PALE, '+y': BILL_PALE, '-y': BILL_PALE})},
  spoon: {note: 'spoon: origin at the grip, bowl (with rice) toward +y, bowl face +z', size: 0.004, paint: (p, cam, id, f) => {
    paintFrustum(p, cam, id, f, -0.06, 0.075, 0.004, 0.003, STEEL);
    paintSphere(p, cam, id + 50, P(f, 0, 0.1, 0), 0.022, STEEL);
    paintSphere(p, cam, id + 60, P(f, 0, 0.1, 0.008), 0.013, '#f4f1e8');
  }},
  pill: {note: 'capsule 2 cm long along y, origin at its centre', size: 0.0045, paint: (p, cam, id, f) => { paintFrustum(p, cam, id, f, -0.01, 0, 0.0045, 0.0045, '#f2efe8'); paintFrustum(p, cam, id + 50, f, 0, 0.01, 0.0045, 0.0045, '#d24a3a'); }},
  scissors: {note: 'scissors: origin between the finger rings, blades along +y, open, face +z', size: 0.006, paint: (p, cam, id, f) => {
    for (const s of [-1, 1]) {
      const y = norm3(add3(f.y, scale3(f.x, s * 0.12))), g = frameOf(add3(f.o, scale3(y, 0.07)), y, f.z);
      paintBox(p, cam, id + (s > 0 ? 0 : 30), g, [0.005, 0.05, 0.001], STEEL);
      paintRing(p, cam, id + (s > 0 ? 60 : 120), {o: P(f, s * 0.018, -0.012, 0), x: f.x, y: f.z, z: f.y}, 0.012, 0.0035, '#d24a3a');
    }
  }},
  tap: {note: 'kitchen tap: origin at the spout mouth, y up, z toward the user; water falls along -y', size: 0.012, paint: (p, cam, id, f) => {
    paintFrustum(p, cam, id, {o: P(f, 0, 0.03, -0.12), x: f.x, y: f.y, z: f.z}, -0.25, 0, 0.016, 0.014, STEEL);
    paintFrustum(p, cam, id + 50, {o: P(f, 0, 0.03, -0.12), x: f.x, y: f.z, z: scale3(f.y, -1)}, 0, 0.12, 0.012, 0.012, STEEL);
    paintFrustum(p, cam, id + 100, f, -0.25, 0, 0.006, 0.006, WATER);
  }},
  box: {note: 'cardboard box 30 x 20 x 24 cm, flaps open: origin at the top centre, y up, z toward the user', size: 0.12, paint: (p, cam, id, f) => {
    paintBox(p, cam, id, {...f, o: P(f, 0, -0.1, 0)}, [0.15, 0.1, 0.12], CARD);
    for (const s of [-1, 1]) paintQuad(p, cam, id + 40 + (s > 0 ? 0 : 5), frameOf(P(f, 0, 0.04, s * 0.15), norm3(add3(f.y, scale3(f.z, s * 0.5))), scale3(f.z, -s)), 0.15, 0.06, CARD_IN);
  }},
  umbrella: {note: 'compact umbrella: origin at the grip, shaft along +y, canopy 96 cm wide', size: 0.012, paint: (p, cam, id, f) => {
    paintFrustum(p, cam, id, f, -0.06, 0.58, 0.006, 0.006, '#2b2c30');
    paintFrustum(p, cam, id + 50, f, 0.42, 0.6, 0.48, 0.02, '#2f6fb0');
  }},
};
const BILL = '#d2604f', BILL_PALE = '#efe3d0', STEEL = '#c3c6cc', WATER = '#9fd3ea', CARD = '#c99a62', CARD_IN = '#b88752';
