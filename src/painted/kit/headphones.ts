import {ell, hardFill, inkLine} from './draw';
import type {FigAnchors} from './cast';
import {mixColor, type Painter, type Pt} from './painter';

// GEAR-HEADPHONES (kit gear, EDU-EP16 casting `new: over-ear headphones`, brief N5; Film W3 look, Boss W5.2 2026-11-15): dark grey over-ear headphones
// drawn over the head from the figure anchors after the figure. Front / three-quarter (`turn`), back (same as front, band only shows) and side
// (`profile` = the screen side the figure faces) views. Seeds 53000-53039 by default (pass `seed`).
/** Over-ear headphones (new gear, dark grey) drawn over a front or three-quarter head from the figure anchors; `turn` -1..1 shifts the band. */
export const paintHeadphones = (p: Painter, a: FigAnchors, o: {seed?: number; turn?: number; tint?: string; profile?: 1 | -1} = {}) => {
  const s = o.seed ?? 53000, hx = a.head[0], top = a.headTop, chin = a.chin, h = chin - top, w = h * 0.5, cy = top + h * 0.55, tr = o.turn ?? 0;
  const body = o.tint ? mixColor('#34363c', o.tint, 0.3) : '#34363c', dark = mixColor(body, '#0c0d10', 0.45);
  if (o.profile) { // W3 v9: side view (`profile` = the screen side she faces, -1 left): a band over the crown and one cup over the ear, a little behind the head centre
    const ex = hx - o.profile * w * 0.08, rx = w * 0.2, ry = h * 0.16;
    const band: Pt[] = Array.from({length: 11}, (_, i) => { const u = i / 10, a2 = Math.PI * (1 - u); return [ex + Math.cos(a2) * w * 0.14, cy - Math.sin(a2) * h * 0.6]; });
    hardFill(p, s, dark, [...band, ...band.slice().reverse().map(([x, y]): Pt => [x, y + h * 0.05])]);
    hardFill(p, s + 1, dark, ell(ex, cy, rx * 1.12, ry * 1.08, 16));
    hardFill(p, s + 2, body, ell(ex - o.profile * rx * 0.1, cy, rx * 0.82, ry * 0.84, 16));
    inkLine(p, s + 3, ell(ex, cy, rx * 1.12, ry * 1.08, 16), {color: '#121317', weight: 0.8});
    return;
  }
  // headband over the crown
  const band: Pt[] = Array.from({length: 13}, (_, i) => { const u = i / 12, a2 = Math.PI * (1 - u); return [hx + tr * w * 0.15 + Math.cos(a2) * (w * 1.02), cy - Math.sin(a2) * (h * 0.66)]; });
  const inner: Pt[] = band.map(([x, y]) => [hx + tr * w * 0.15 + (x - hx - tr * w * 0.15) * 0.9, cy + (y - cy) * 0.93]);
  hardFill(p, s, dark, [...band, ...inner.slice().reverse()]);
  // ear cups (near cup larger on a turned head)
  ([[-1, 1 - 0.25 * tr], [1, 1 + 0.25 * tr]] as [number, number][]).forEach(([sd, k], i) => {
    const x = hx + sd * w * (1.0 - 0.18 * Math.abs(tr) * (sd * tr < 0 ? 1 : 0)) + tr * w * 0.1, rx = w * 0.26 * k, ry = h * 0.2 * k;
    hardFill(p, s + 1 + i * 3, dark, ell(x, cy, rx * 1.12, ry * 1.08, 16));
    hardFill(p, s + 2 + i * 3, body, ell(x + sd * rx * 0.12, cy, rx * 0.85, ry * 0.86, 16));
    inkLine(p, s + 3 + i * 3, ell(x, cy, rx * 1.12, ry * 1.08, 16), {color: '#121317', weight: 0.8});
  });
};
