// SET-PALM (N14; B05-SH02 macro, B05-SH03 foreground): the girl's open palm up, drops patting it. A centimetre set (world unit = 1 cm), `palm-up-open` hand with the girl tone
// and her white sleeve; drops land 3-5 per second (seeded), each with a splash crown, then stay as beads. Pure function of the shot-local frame `L`.
import {ell, hardFill, rectPts, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {camMove, camOf} from '../kit/cam-moves';
import {macroHand, MACRO_TONES, paintHandMacro, macroSkeleton, type HandMacro} from '../kit/hands';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintDrop14, REFRACT_REAL} from './drop';
import {lin, sm} from './clock';

export const PALM_SIZE = 0.96;
/** The hand for B05-SH02: wrist (cm) so the palm centre sits at the origin. */
/** The hand with its palm centre at world `centre` (any `unit`: 1 = cm set, 0.01 = metre set); the forearm runs toward -x... along +z away from the palm (`reach` cm). */
export const palmHandAt = (centre: [number, number, number], unit: number, base: number, yaw = 0): HandMacro => {
  const mk = (at: [number, number], plane: number) => macroHand('palm-up-open', {side: 1, base, size: PALM_SIZE, unit, tone: MACRO_TONES.girl, look: 'classic', plane, at, yaw,
    elbow: [at[0] + 2.2 * unit, plane + 4 * unit, at[1] + 24 * unit], sleeve: {to: [at[0] + 2.8 * unit, plane + 5 * unit, at[1] + 30 * unit], color: '#f6f6f2', shade: '#dcdcd6', cuff: 0.25}});
  const plane = centre[1] - 1.2 * PALM_SIZE * unit, h0 = mk([0, 0], plane), pc = macroSkeleton(h0).palmCentre;
  return mk([centre[0] - pc[0], centre[2] - pc[2]], plane);
};
export const palmHand = (o: {base?: number; at?: [number, number]; yaw?: number; elbow?: [number, number, number]} = {}): HandMacro => {
  const h = macroHand('palm-up-open', {side: 1, base: o.base ?? 40000, size: PALM_SIZE, unit: 1, tone: MACRO_TONES.girl, look: 'classic', plane: -4, at: o.at ?? [0.8, 3.0], yaw: o.yaw ?? 0,
    elbow: o.elbow ?? [3, 6, 24], sleeve: {to: [3.6, 7, 30], color: '#f6f6f2', shade: '#dcdcd6', cuff: 0.2}});
  return h;
};
/** B05-SH02 camera: `target (0,0,0) cm, yaw 20->26, r 22->20, eye +14 cm, pitch -32, f 1200, hy 820`. */
export const moveSH20 = camMove([0, 0, 0], [20, 26], [22, 20], 14, {pitch: [-32, -32], f: 1200, hy: 820});
export const camSH20 = (L: number): YCam => camOf(moveSH20, L / 136);

export const DROPS_FROM = 5;
export type PalmDrop = {t: number; x: number; z: number; r: number};
/** The seeded landings: 3-5 per second, irregular; `x`,`z` cm on the palm plane (a disc of 2.3 cm round the palm centre), `r` mm radius of the bead. */
export const palmDrops = (): PalmDrop[] => {
  const out: PalmDrop[] = []; let t = DROPS_FROM + 2;
  for (let i = 0; i < 24; i++) { const a = hash(41000 + i) * Math.PI * 2, rr = Math.sqrt(hash(41100 + i)) * 2.3; out.push({t, x: Math.cos(a) * rr - 0.2, z: Math.sin(a) * rr * 0.9, r: 1.7 + 1.3 * hash(41200 + i)}); t += 5.5 + 5 * hash(41300 + i); }
  return out;
};
const DROPS = palmDrops();
export const PALM_Y = 0;

const bokeh = (p: Painter, L: number) => {
  hardFill(p, 41500, '#8a8576', [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]]);
  washAt(p, 41501, '#e8c98f', 90, ell(540, 380, 700, 460, 26), 0.5, 0.4);
  washAt(p, 41502, '#364540', 235, rectPts(0, 1040, 1080, 1940), 0, 0);   // the dark table under the hand: keeps the caption band y 1176-1344 quiet
  [[150, 220, 80], [900, 420, 110], [640, 120, 70], [260, 640, 120], [960, 780, 70], [470, 480, 56]].forEach(([x, y, r], i) => washAt(p, 41510 + i, i % 2 ? '#f6dca8' : '#fff1d0', 110, ell(x, y, r, r, 18), 0, 0));
  // the rain: soft streaks at depth falling with the plate clock
  for (let i = 0; i < 26; i++) {
    const sp = 900 + 700 * hash(41600 + i), x = hash(41610 + i) * 1200 - 60, len = 160 + 160 * hash(41620 + i), y = ((hash(41630 + i) * 2400 + (L / 30) * sp) % 2400) - 300;
    washAt(p.layer(0.45, 41640 + i * 3), 41640 + i * 3, '#e6edf0', 120, [[x, y], [x + 3, y], [x + 1, y + len], [x - 2, y + len]], 0, 0);
  }
};

/** Painted B05-SH02 / SH03 foreground palm: background bokeh, hand, drops + splashes + beads on it (`world` = camera, `L` shot frame, `dropAbove` px = how far above the palm drops start). */
export const paintPalm = (p: Painter, c: YCam, o: {L: number; hand?: HandMacro; bg?: boolean; unit?: number}) => {
  if (o.bg !== false) bokeh(p, o.L);
  const h = o.hand ?? palmHand();
  paintHandMacro(p, c, h);
  const sk = macroSkeleton(h), origin = sk.palmCentre;
  const un = o.unit ?? 1, surf = origin[1] + 0.35 * PALM_SIZE * un;
  const u = camUnit(c, [origin[0], surf, origin[2]]) * un; // px per cm
  const P = (x: number, z: number): Pt | null => camPoint(c, [origin[0] + x * un, surf, origin[2] + z * un]);
  DROPS.forEach((d, i) => {
    const k = o.L - d.t;
    const q = P(d.x, d.z); if (!q) return;
    const rpx = (d.r / 10) * u, seed = 41700 + i * 60;
    if (k >= -5 && k < 0) { // the falling drop: a streak and a small round drop above the landing
      const y = q[1] - (-k) * 150 * (u / 60), a = 1 - (-k) / 6;
      washAt(p, seed, '#ffffff', 150 * a, [[q[0] - 2, y - 90], [q[0] + 2, y - 90], [q[0] + 1, y], [q[0] - 1, y]], 0, 0);
      paintDrop14(p, [q[0], y], u / 10, {kind: 'sphere', size: d.r * 2}, {refract: REFRACT_REAL, seed});
      return;
    }
    if (k < 0) return;
    // splash crown 0..9 frames: an expanding ring on the skin and small beads flying up and out
    if (k < 10) {
      const e = k / 10, R = rpx * (1.2 + 2.2 * e);
      washAt(p, seed + 2, '#fff7ea', 150 * (1 - e), ell(q[0], q[1], R * 1.15, R * 0.5, 20), 0.2, 0.2);
      for (let j = 0; j < 7; j++) { const a = (j / 7) * Math.PI * 2 + hash(seed + j) * 0.6, rr = R * 0.9 * (0.6 + 0.4 * hash(seed + 10 + j)), up = Math.sin(Math.PI * e) * rpx * 2.6 * (0.6 + 0.6 * hash(seed + 20 + j)), br = Math.max(1.5, rpx * 0.18 * (1 - 0.5 * e));
        washAt(p, seed + 8 + j * 3, '#ffffff', 200 * (1 - e * 0.7), ell(q[0] + Math.cos(a) * rr, q[1] + Math.sin(a) * rr * 0.5 - up, br, br, 8), 0, 0); }
    }
    // the bead that stays: a flat lens with a highlight and a soft contact shadow
    const grow = sm(2, 8, k);
    washAt(p, seed + 40, '#6b4a36', 110, ell(q[0] + rpx * 0.15, q[1] + rpx * 0.22, rpx * 1.05, rpx * 0.5, 16), 0.2, 0.2);
    paintDrop14(p, [q[0], q[1] - rpx * 0.3], (rpx * 2 * grow) / (d.r * 2 * 1) / 1, {kind: 'bun', size: d.r * 2, flat: 0.45}, {refract: REFRACT_REAL, seed: seed + 50});
  });
  void lin; void mixColor;
};
