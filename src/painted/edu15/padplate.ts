import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {C} from './palette';

// EDU-EP15 S01-B01-SH03 dry-pad plate (user, 10 Nov 2026: "paint it new"; storyboard R2.3 shot 3): the tokay's front-left foot seen from the room, i.e. its underside pressed
// flat on the rough plaster. Screen space (one plane, 1080 x 1920): a palm, five splayed toes each ending in a flat expanded pad crossed by a row of lamellae (the pad ridges),
// plaster grain and tiny bump shadows from the raking lamp (light from screen left), dust specks BESIDE the pad, none on it (dry, no blob, no shine, no dome).

const PLASTER = C.plaster, SHADOW = '#a89b82', SKIN = '#8696ad', SKIN_D = '#5d6b82', PAD = '#cfd2d0', PAD_D = '#b4b9ba';
type Toe = {ang: number; stalk: number; pad: number; w: number};
// angle from straight up (deg, + = right), stalk length, pad length, pad half-width (px at scale 1)
const TOES: Toe[] = [{ang: -78, stalk: 70, pad: 118, w: 34}, {ang: -40, stalk: 92, pad: 146, w: 40}, {ang: -2, stalk: 100, pad: 158, w: 43}, {ang: 38, stalk: 92, pad: 146, w: 40}, {ang: 74, stalk: 66, pad: 112, w: 33}];
const rot = ([x, y]: Pt, a: number): Pt => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

export type PadMeasure = {box: [number, number, number, number]; widthPx: number};

/** Paints the plate; `cx, cy` the centre of the foot (px), `k` the scale (1 = pad group about 560 px wide), `drift` a small sideways shift (px). */
export const paintPadPlate = (p: Painter, o: {cx?: number; cy?: number; k?: number; drift?: number} = {}): PadMeasure => {
  const k = o.k ?? 1, cx = (o.cx ?? 540) + (o.drift ?? 0), cy = o.cy ?? 930;
  // plaster ground: warm cream, a cooler grazing gradient from the lamp side, grain
  p.flat(PLASTER, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  washAt(p, 66001, '#fff3d6', 0.55, [[0, 0], [520, 0], [380, 1920], [0, 1920]], 0.5, 0.3);
  washAt(p, 66002, '#c9bca4', 0.5, [[760, 0], [1080, 0], [1080, 1920], [900, 1920]], 0.5, 0.3);
  washAt(p, 66003, '#bfb299', 0.35, [[0, 1500], [1080, 1450], [1080, 1920], [0, 1920]], 0.5, 0.3);
  const near = (x: number, y: number, m: number) => Math.hypot((x - cx) / (360 * k), (y - cy) / (420 * k)) < m;
  // plaster bumps: small domes with a dark lee shadow right/below and a light lamp side; clear of the pad (no grain over skin)
  for (let i = 0; i < 300; i++) {
    const x = hash(66100 + i) * 1100 - 10, y = hash(66500 + i) * 1940 - 10, r = 2 + hash(66900 + i) * 6;
    if (near(x, y, 1.05)) continue;
    hardFill(p, 67000 + i, mixColor(C.stipple, '#8f836d', 0.25 + 0.4 * hash(67400 + i)), ell(x + r * 0.45, y + r * 0.5, r, r * 0.8, 8));
    hardFill(p, 67600 + i, mixColor(PLASTER, '#fffaf0', 0.7), ell(x - r * 0.2, y - r * 0.25, r * 0.7, r * 0.55, 8));
  }
  // a few pits
  for (let i = 0; i < 40; i++) { const x = hash(68000 + i) * 1080, y = hash(68100 + i) * 1920; if (near(x, y, 1.0)) continue; hardFill(p, 68200 + i, '#a79c86', ell(x, y, 5 + 8 * hash(68300 + i), 3 + 4 * hash(68400 + i), 8)); }
  // dust specks beside the pad (floating grey flecks resting on the plaster, off the foot)
  for (let i = 0; i < 70; i++) {
    const a = hash(68500 + i) * Math.PI * 2, d = 1.12 + hash(68600 + i) * 0.55;
    const x = cx + Math.cos(a) * 360 * k * d, y = cy + Math.sin(a) * 430 * k * d;
    if (x < 10 || x > 1070 || y < 10 || y > 1910) continue;
    hardFill(p, 68700 + i, mixColor(C.dust, '#6f675b', hash(68800 + i) * 0.4), ell(x, y, 2.5 + 7 * hash(68900 + i), 2 + 4 * hash(69000 + i), 7, hash(69100 + i) * 3));
  }
  const toeFrame = (t: Toe): {o: Pt; a: number} => { const a = (t.ang * Math.PI) / 180; return {o: [cx + Math.sin(a) * 60 * k, cy + 150 * k - Math.cos(a) * 60 * k], a}; };
  const at = (t: Toe, u: number, v: number): Pt => { const f = toeFrame(t), [dx, dy] = rot([v * k, -u * k], f.a); return [f.o[0] + dx, f.o[1] + dy]; };
  const toes = TOES.slice().sort((a, b) => Math.abs(b.ang) - Math.abs(a.ang));
  // contact shadow: the whole foot's footprint, offset to the lee (right/down), soft
  const shadowOf = (t: Toe, grow: number) => { const pts: Pt[] = []; const L = t.stalk + t.pad; for (let i = 0; i <= 10; i++) { const u = (L * i) / 10, w = u < t.stalk ? 20 : t.w * Math.sqrt(Math.max(0, 1 - ((u - t.stalk - t.pad / 2) / (t.pad / 2 + 4)) ** 2)) + 6; pts.push(at(t, u, w + grow)); } for (let i = 10; i >= 0; i--) { const u = (L * i) / 10, w = u < t.stalk ? 20 : t.w * Math.sqrt(Math.max(0, 1 - ((u - t.stalk - t.pad / 2) / (t.pad / 2 + 4)) ** 2)) + 6; pts.push(at(t, u, -w - grow)); } return pts; };
  toes.forEach((t, i) => hardFill(p, 69200 + i, SHADOW, shadowOf(t, 5).map(([x, y]) => [x + 14 * k, y + 12 * k] as Pt)));
  hardFill(p, 69250, SHADOW, ell(cx + 14 * k, cy + 160 * k + 12 * k, 150 * k, 125 * k, 22));
  // palm (skin), then toes: stalk (skin) + pad
  hardFill(p, 69300, SKIN, ell(cx, cy + 160 * k, 142 * k, 118 * k, 26));
  for (let i = 0; i < 14; i++) hardFill(p, 69310 + i, i % 3 === 0 ? C.tkOrange : SKIN_D, ell(cx + (hash(69400 + i) - 0.5) * 220 * k, cy + 160 * k + (hash(69500 + i) - 0.5) * 160 * k, (4 + 5 * hash(69600 + i)) * k, (3 + 3 * hash(69700 + i)) * k, 8));
  inkLine(p, 69330, ell(cx, cy + 160 * k, 142 * k, 118 * k, 26), {weight: 1.6, color: C.tkInk, still: true, curve: 0.3});
  toes.forEach((t, i) => {
    const s = 69800 + i * 100, L = t.stalk + t.pad;
    hardFill(p, s, SKIN, [at(t, -30, -30), at(t, t.stalk + 10, -20), at(t, t.stalk + 10, 20), at(t, -30, 30)]);
    inkLine(p, s + 1, [at(t, -10, -28), at(t, t.stalk + 8, -20)], {closed: false, weight: 1.4, color: C.tkInk, still: true});
    inkLine(p, s + 2, [at(t, -10, 28), at(t, t.stalk + 8, 20)], {closed: false, weight: 1.4, color: C.tkInk, still: true});
    // pad outline: flat expanded oval (flatter at the base), dry pale grey
    const pad: Pt[] = [], u0 = t.stalk, n = 18;
    for (let j = 0; j <= n; j++) { const th = (j / n) * Math.PI; const u = u0 + t.pad * (0.5 - 0.5 * Math.cos(th)); pad.push(at(t, u, t.w * Math.pow(Math.sin(th), 0.62))); }
    for (let j = n; j >= 0; j--) { const th = (j / n) * Math.PI; const u = u0 + t.pad * (0.5 - 0.5 * Math.cos(th)); pad.push(at(t, u, -t.w * Math.pow(Math.sin(th), 0.62))); }
    hardFill(p, s + 3, PAD, pad);
    hardFill(p, s + 4, mixColor(PAD, '#ffffff', 0.35), pad.map(([x, y]) => [x * 0.9 + cx * 0.1 - 5 * k, y * 0.9 + cy * 0.1 - 4 * k] as Pt).filter((_, j) => j < 0));
    // lamellae: transverse ridges across the pad, 8 per pad, alternate dark ridge and pale gap
    const nl = 8;
    for (let j = 0; j < nl; j++) {
      const f = (j + 0.8) / (nl + 0.6), u = u0 + t.pad * f, w = t.w * Math.pow(Math.sin(Math.PI * f), 0.62) * 0.9, bow = 5 + 2 * hash(s + 50 + j);
      const row: Pt[] = []; for (let m = 0; m <= 8; m++) { const v = -w + (2 * w * m) / 8; row.push(at(t, u + bow * (1 - (v / Math.max(w, 1)) ** 2) * 0.5, v)); }
      inkLine(p, s + 10 + j, row, {closed: false, weight: 3.4, color: PAD_D, still: true, curve: 0.3});
      const hl = row.map(([x, y]) => [x + 2.4 * k, y + 3 * k] as Pt);
      inkLine(p, s + 30 + j, hl, {closed: false, weight: 1.2, color: '#f4f4f1', still: true, curve: 0.3});
    }
    inkLine(p, s + 5, pad, {weight: 1.8, color: C.tkInk, still: true, curve: 0.3});
    void L;
  });
  // box of all pads
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const t of TOES) for (const u of [t.stalk, t.stalk + t.pad]) for (const v of [-t.w, 0, t.w]) { const [x, y] = at(t, u, v); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return {box: [x0, y0, x1, y1], widthPx: x1 - x0};
};
