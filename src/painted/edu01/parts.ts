import {drawFigure} from '../kit/cast';
import {blob, ell, inkLine, rectPts, washAt, glaze, hardFill} from '../kit/draw';
import {EXPRESSIONS} from '../kit/expressions';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {poseFor} from '../kit/poses';
import {SLEEPER} from './cast';
import {DREAM, HGT, IDEA, PAPER_LIGHT, W, body, paintQuestion} from './set';

// EDU-EP01-SHORT W5.2 plate parts (Boss, 4 Nov 2026): the new assets the timed sheet needs beyond the look-frame painters in
// `set.ts`. Each is a pure function of its arguments (no clock inside); `plates.tsx` drives them from the shot-local frame.
// Kit intake (KIT-P01): `new: cloud-air ground`, `new: upward paint-streak FX`, `new: falling pose in pyjama (P39 front)`,
// `new: idea bubble`, `new: brain-cloud`, `new: sun/moon switch`, `new: relaxed mini-figure`.

const mix = mixColor;

// ------------------------------------------------------------------ B03-SH03: the fall

/** `new: cloud-air ground`: the dream sky with no ledge, deeper (cooler) toward the bottom of the world, a few small pale clouds
 *  to drift past. World px; the plate's camera drops over it. */
export const paintDreamAir = (p: Painter) => {
  const D = DREAM;
  p.flat(D.top, rectPts(-120, -300, W + 120, HGT + 700));
  washAt(p, 800, D.peach, 120, rectPts(-120, 200, W + 120, 760), 0.6, 0.4);
  washAt(p, 801, D.rose, 110, rectPts(-120, 520, W + 120, 1180), 0.6, 0.45);
  washAt(p, 802, '#c9cbe6', 150, rectPts(-120, 980, W + 120, 1700), 0.6, 0.45);
  washAt(p, 803, '#7d78b4', 140, rectPts(-120, 1500, W + 120, HGT + 700), 0.6, 0.45);
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(810 + i) * 960, y = 240 + i * 215 + hash(830 + i) * 90, rx = 90 + hash(850 + i) * 120;
    washAt(p, 820 + i, i < 4 ? D.cloud : '#e4e4f2', 150, blob(820 + i, x, y, rx, rx * 0.28, 0), 0.65, 0.45);
  }
};

/** Falling-speed profile of B03-SH03: px/s at shot-local frame `f` (0..44): 1100 -> 4200, linear. */
export const fallSpeed = (f: number) => 1100 + (4200 - 1100) * Math.max(0, Math.min(1, f / 44));
/** Distance fallen by frame `f` (px). */
export const fallShift = (f: number) => {
  let d = 0;
  for (let i = 0; i < f; i++) d += fallSpeed(i) / 30;
  return d;
};

const STREAK_COLORS = ['#8c7bc4', '#e7a8a0', '#f3e4ee', '#b9a2d6', '#f0c6b4'];
/**
 * `new: upward paint-streak FX`: vertical brush strokes (screen space) that sweep up and get longer as she falls faster
 * (brief spike 3: reads as falling, not flying, because the camera and the streaks go with her speed). `n` streaks, `front`
 * selects the thin pale set drawn over her. Positions wrap in a 2400 px column; length = 2.4 frames of travel + 40 px.
 */
export const paintStreaks = (p: Painter, f: number, front: boolean) => {
  const shift = fallShift(f), step = fallSpeed(f) / 30, n = front ? 7 : 18;
  for (let i = 0; i < n; i++) {
    const k = i + (front ? 100 : 0);
    const x = 30 + hash(900 + k) * 1020;
    const rate = 0.7 + 0.6 * hash(930 + k);
    const y0 = ((hash(960 + k) * 2400 - shift * rate) % 2400 + 2400) % 2400 - 240;
    const len = step * rate * 2.4 + 40;
    const color = front ? mix(STREAK_COLORS[2], '#ffffff', 0.3) : STREAK_COLORS[Math.floor(hash(990 + k) * 5)];
    p.inkStill(k + 1, 'marker', color, front ? 2.5 : 5 + 7 * hash(1010 + k));
    p.brush.line(x, y0, x + (hash(1030 + k) - 0.5) * 12, y0 - len);
  }
};

/** `new: falling pose in pyjama`: P39 front (arms flung out) tumbling `deg` about her centre; height 822 px (U 520: >= 200 px at the
 *  270 px tile). `noShadow`: nothing under her feet (W5.2 repaint: the kit ground shadow made her stand on a disc). */
export const paintFaller = (p: Painter, t: number, cx: number, cy: number, deg: number) => {
  const U = 520, H = 1.58 * U;
  const g: Pt = [cx, cy + H / 2];
  p.brush.push();
  p.brush.translate(cx, cy);
  p.brush.rotate((deg * Math.PI) / 180);
  p.brush.translate(-cx, -cy);
  drawFigure(p, SLEEPER, g, U, {...poseFor('P39', SLEEPER, g, U, 'front'), face: EXPRESSIONS.scared, light: PAPER_LIGHT, noShadow: true, softNeck: true}, t);
  p.brush.pop();
};

// ------------------------------------------------------------------ B05: idea space

const VI = IDEA;

/** `new: idea bubble`: a wash cloud (lobed ellipse) with a thin violet edge, three tail dots toward `tail`, `strength` 0..1 of the
 *  colour (the wash-out of B05-SH06 runs it to 0). */
export const paintBubble = (p: Painter, seed: number, cx: number, cy: number, rx: number, ry: number, strength: number, tail?: Pt) => {
  if (strength <= 0.01) return;
  const lobes = (k: number): Pt[] => Array.from({length: 40}, (_, i): Pt => {
    const a = (i / 40) * Math.PI * 2, r = 1 + 0.045 * Math.sin(7 * a + seed) + 0.025 * Math.sin(11 * a + 2 * seed);
    return [cx + rx * k * r * Math.cos(a), cy + ry * k * r * Math.sin(a)];
  });
  const q = p.layer(Math.min(1, strength), seed * 7);
  washAt(q, seed, VI.bubble, 210, lobes(1), 0.5, 0.5);
  washAt(q, seed + 1, mix(VI.bubble, '#ffffff', 0.5), 170, blob(seed + 1, cx - rx * 0.12, cy - ry * 0.18, rx * 0.7, ry * 0.65, 0), 0.6, 0.5);
  glaze(q, seed + 2, VI.violetSoft, 90, lobes(0.97).slice(20).concat(lobes(0.97).slice(0, 4)), {bleed: 0.2, border: 0.1});
  inkLine(q, seed + 3, lobes(1), {color: mix(VI.violet, VI.bubble, 0.4), weight: 0.7, curve: 0.4, still: true});
  if (tail) {
    [0.18, 0.3, 0.4].forEach((u, i) => {
      const x = cx + (tail[0] - cx) * (0.55 + 0.4 * u * 1.9), y = cy + ry + (tail[1] - cy - ry) * (u * 2.1);
      const r = 30 - i * 8;
      washAt(q, seed + 10 + i, VI.bubble, 200, ell(x, y, r, r * 0.9, 16), 0.3, 0.4);
      inkLine(q, seed + 14 + i, ell(x, y, r, r * 0.9, 16), {color: mix(VI.violet, VI.bubble, 0.45), weight: 0.5, still: true});
    });
  }
};

/** `new: brain-cloud`: a soft stylised lump (overlapping pink-lilac washes, two fold strokes), not anatomical; two small eyes
 *  looking toward (`gx`, `gy`) in -1..1. `s` is the width in px. */
export const paintBrain = (p: Painter, seed: number, cx: number, cy: number, s: number, gx: number, gy: number) => {
  // W5.4 (user: "cute, but a little heavier/darker colours"): the same pinks and lilacs pulled toward a deeper plum (about 22 %), cuteness kept (same shape, eyes)
  const cl = ['#e6b4c8', '#d9a6c6', '#eec3d0', '#cfa0c8', '#e9b9cb'].map((c) => mixColor(c, '#8a4f88', 0.24));
  const puffs: [number, number, number, number][] = [[-0.3, -0.04, 0.3, 0.26], [0.0, -0.12, 0.34, 0.3], [0.3, -0.04, 0.3, 0.26], [-0.18, 0.12, 0.3, 0.22], [0.2, 0.12, 0.3, 0.22], [0, 0.04, 0.4, 0.28]];
  puffs.forEach(([dx, dy, rx, ry], i) => washAt(p, seed + i, cl[i % cl.length], 215, blob(seed + i, cx + dx * s, cy + dy * s, rx * s, ry * s, 0), 0.5, 0.5));
  washAt(p, seed + 8, '#ecc6d6', 150, blob(seed + 8, cx - 0.1 * s, cy - 0.17 * s, 0.26 * s, 0.1 * s, 0), 0.6, 0.5);
  glaze(p, seed + 9, '#8d5a96', 150, [[cx - 0.4 * s, cy + 0.1 * s], [cx + 0.4 * s, cy + 0.1 * s], [cx + 0.3 * s, cy + 0.28 * s], [cx - 0.3 * s, cy + 0.28 * s]], {bleed: 0.3, border: 0.1});
  // two fold strokes (a centre groove and one side groove)
  inkLine(p, seed + 20, [[cx - 0.02 * s, cy - 0.3 * s], [cx + 0.03 * s, cy - 0.12 * s], [cx - 0.02 * s, cy + 0.02 * s], [cx + 0.02 * s, cy + 0.14 * s]], {color: '#7d4680', weight: 0.8, closed: false, curve: 0.5, still: true});
  inkLine(p, seed + 21, [[cx - 0.3 * s, cy - 0.1 * s], [cx - 0.2 * s, cy + 0.0 * s], [cx - 0.28 * s, cy + 0.1 * s]], {color: '#7d4680', weight: 0.6, closed: false, curve: 0.5, still: true});
  inkLine(p, seed + 22, [[cx + 0.3 * s, cy - 0.1 * s], [cx + 0.2 * s, cy + 0.0 * s], [cx + 0.28 * s, cy + 0.1 * s]], {color: '#7d4680', weight: 0.6, closed: false, curve: 0.5, still: true});
  // eyes
  [-1, 1].forEach((d, i) => {
    const ex = cx + d * 0.1 * s, ey = cy + 0.1 * s, r = 0.045 * s;
    hardFill(p, seed + 30 + i, '#f8f4fa', ell(ex, ey, r * 1.15, r * 1.25, 14));
    hardFill(p, seed + 32 + i, '#3a2f4a', ell(ex + gx * r * 0.45, ey + gy * r * 0.5, r * 0.62, r * 0.62, 12));
    inkLine(p, seed + 34 + i, ell(ex, ey, r * 1.15, r * 1.25, 14), {color: '#8a5a86', weight: 0.5, still: true});
  });
  // small brow, tilted by the look: soft worry when she looks down at the figure
  inkLine(p, seed + 36, [[cx - 0.15 * s, cy + 0.03 * s - gy * 0.004 * s], [cx - 0.06 * s, cy + 0.02 * s]], {color: '#8a5a86', weight: 0.7, closed: false, still: true});
  inkLine(p, seed + 37, [[cx + 0.06 * s, cy + 0.02 * s], [cx + 0.15 * s, cy + 0.03 * s - gy * 0.004 * s]], {color: '#8a5a86', weight: 0.7, closed: false, still: true});
};

/**
 * `new: sun/moon switch`: a slider rail with a sun at the left end and a crescent moon at the right end; the knob slides from the
 * sun to the moon (`u` 0..1) and takes the colour of the end it nears. Painted in plate px about (cx, cy), `w` rail length.
 */
export const paintSwitch = (p: Painter, seed: number, cx: number, cy: number, w: number, u: number) => {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  // end icons: sun with short rays, crescent moon
  washAt(p, seed, '#f2c46a', 240, ell(x0 - 20, cy, 36, 36, 20), 0.1, 0.3);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    p.inkStill(seed + 1 + i, 'rotring', '#d99a3a', 1.2);
    p.brush.line(x0 - 20 + 46 * Math.cos(a), cy + 46 * Math.sin(a), x0 - 20 + 60 * Math.cos(a), cy + 60 * Math.sin(a));
  }
  washAt(p, seed + 10, '#e8e4f4', 240, ell(x1 + 20, cy, 36, 36, 20), 0.1, 0.3);
  hardFill(p, seed + 11, IDEA.bubble, ell(x1 + 36, cy - 12, 31, 31, 20));
  inkLine(p, seed + 12, ell(x1 + 20, cy, 36, 36, 20).filter(([x, y]) => (x - (x1 + 36)) ** 2 + (y - (cy - 12)) ** 2 > 31 * 31), {color: '#8a86b8', weight: 0.6, closed: false, still: true});
  // rail
  const rail = rectPts(x0, cy - 10, x1, cy + 10);
  body(p, seed + 20, mix(IDEA.violetSoft, '#ffffff', 0.45), rail, 50);
  inkLine(p, seed + 21, rail, {color: mix(IDEA.violet, '#ffffff', 0.4), weight: 0.6, still: true});
  // knob
  const kx = x0 + (x1 - x0) * u, col = mix('#f2c46a', '#e8e4f4', Math.max(0, Math.min(1, (u - 0.2) / 0.6)));
  washAt(p, seed + 22, '#6a6aa0', 70, ell(kx + 4, cy + 36, 34, 8, 14), 0.2, 0.3);
  hardFill(p, seed + 23, col, ell(kx, cy, 30, 30, 20));
  washAt(p, seed + 24, '#ffffff', 170, ell(kx - 8, cy - 9, 11, 9, 12), 0.2, 0.3);
  inkLine(p, seed + 25, ell(kx, cy, 30, 30, 20), {color: mix(IDEA.violet, col, 0.35), weight: 0.8, still: true});
};

/** `new: relaxed mini-figure`: the sleeper, P36 lying on her back (profile, head left) on a small soft mattress, `u` px per metre. */
export const paintMiniSleeper = (p: Painter, t: number, gx: number, gy: number, U: number, twitch = 0) => {
  const g: Pt = [gx, gy];
  washAt(p, 1100, IDEA.mattress, 190, ell(gx - 0.55 * U, gy + 0.02 * U, 1.05 * U, 0.1 * U, 20), 0.3, 0.4);
  washAt(p, 1101, mix(IDEA.mattress, '#ffffff', 0.4), 150, ell(gx - 0.6 * U, gy - 0.01 * U, 0.8 * U, 0.05 * U, 20), 0.3, 0.4);
  p.brush.push();
  if (twitch) {
    p.brush.translate(gx, gy);
    p.brush.rotate(((-2.2 * twitch) * Math.PI) / 180);
    p.brush.translate(-gx, -gy - 7 * twitch);
  }
  drawFigure(p, SLEEPER, g, U, {...poseFor('P36', SLEEPER, g, U, 'right'), face: EXPRESSIONS.asleep, light: PAPER_LIGHT, softNeck: true}, t);
  p.brush.pop();
};

/** The big "?" beside a bubble (hypothesis A and B): same brush glyph as the idea space, `wob` radians of wobble about its base. */
export const paintSideQuestion = (p: Painter, seed: number, x: number, y: number, s: number, wob = 0) => {
  p.brush.push();
  p.brush.translate(x, y + 0.3 * s);
  p.brush.rotate(wob);
  p.brush.translate(-x, -(y + 0.3 * s));
  washAt(p, seed, VI.violetSoft, 70, blob(seed, x, y - 0.1 * s, 0.4 * s, 0.45 * s, 0), 0.6, 0.5);
  paintQuestion(p, seed + 2, x, y, s, VI.violet, 7);
  p.brush.pop();
};
