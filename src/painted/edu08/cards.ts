import {ell, hardFill, inkLine} from '../kit/draw';
import {paintHalo} from '../kit/fog';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {FXC} from './fx-colors';

// EDU-EP08-SHORT N8 cards (brief VD07 film strip, VD12 flask, VD14 drop diagram, VD17 chest outline). One card language: paper `#eaf2fb`,
// ink `#23324a`, amber arrows, warning glow, red cross. No words and no bodies on any card. Every card is a pure function of the shot-local
// clock `t` (seconds) through its `...At(t)` timeline, so it seeks; omit `t` for the finished still the look frames approved.

const ease = (x: number) => { const u = Math.max(0, Math.min(1, x)); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / Math.max(1e-6, b - a)));
const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const rotAbout = (cx: number, cy: number, deg: number) => ([x, y]: Pt): Pt => { const a = (deg * Math.PI) / 180, dx = x - cx, dy = y - cy; return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)]; };

// ---------------------------------------------------------------- film strip (S01-B01-SH03)
/** Film-strip timeline (storyboard S01-B01-SH03): pops in at 0.3 s, panel 2 at 0.65 s, popped panel at 1.0 s, red cross stamps at 1.3 s, slides out 1.9-2.1 s. */
export const FILM_T = {popIn: 0.3, panel2: 0.65, pop: 1.0, cross: 1.3, outFrom: 1.9, outTo: 2.1};
export type FilmState = {scale: number; dx: number; panels: number; cross: number; visible: boolean};
export const filmStripAt = (t: number, slide = -720): FilmState => {
  const k = FILM_T, a = ramp(t, k.popIn, k.popIn + 0.18), over = 1 + 0.06 * Math.sin(Math.PI * a) * (1 - a);
  const out = ease(ramp(t, k.outFrom, k.outTo));
  return {
    scale: t < k.popIn ? 0 : (0.7 + 0.3 * ease(a)) * over, dx: slide * out,
    panels: (t >= k.popIn ? 1 : 0) + (t >= k.panel2 ? 1 : 0) + (t >= k.pop ? 1 : 0),
    cross: ease(ramp(t, k.cross, k.cross + 0.12)), visible: t >= k.popIn && out < 1,
  };
};

export type FilmOpts = {tilt?: number; cross?: number; seed?: number; /** Panels shown 0..3 (default 3: the approved still). */ panels?: number; scale?: number; dx?: number};

/**
 * Film-strip card (VD07): a short strip of three frames with sprocket holes, tilted `tilt` deg, in box [x0, y0, x1, y1]. A cartoon red
 * balloon on a stick inflates (frame 1 small, frame 2 big) and pops with burst lines (frame 3); `cross` 0..1 stamps a red cross over it.
 * Balloon only, never a body. `panels`, `scale`, `dx` come from `filmStripAt(t)`.
 */
export const paintFilmStrip = (p: Painter, box0: [number, number, number, number], o: FilmOpts = {}) => {
  const sc = o.scale ?? 1;
  if (sc <= 0.001) return;
  const cx0 = (box0[0] + box0[2]) / 2 + (o.dx ?? 0), cy0 = (box0[1] + box0[3]) / 2, hw = ((box0[2] - box0[0]) / 2) * sc, hh = ((box0[3] - box0[1]) / 2) * sc;
  const [x0, y0, x1, y1] = [cx0 - hw, cy0 - hh, cx0 + hw, cy0 + hh], id = o.seed ?? 9100, cx = cx0, cy = cy0, R = rotAbout(cx, cy, o.tilt ?? -4);
  const T = (pts: Pt[]) => pts.map(R), shown = o.panels ?? 3;
  hardFill(p, id, '#000000', T(rect(x0 + 6, y0 + 8, x1 + 6, y1 + 8))); // drop shadow
  hardFill(p, id + 1, '#1d2230', T(rect(x0, y0, x1, y1)));
  const hole = (y1 - y0) * 0.07, fw = (x1 - x0) / 3;
  for (let i = 0; i < 9; i++) {
    const hx = x0 + ((i + 0.5) / 9) * (x1 - x0);
    hardFill(p, id + 10 + i, '#eaeef4', T(rect(hx - hole, y0 + hole * 0.6, hx + hole, y0 + hole * 2)));
    hardFill(p, id + 30 + i, '#eaeef4', T(rect(hx - hole, y1 - hole * 2, hx + hole, y1 - hole * 0.6)));
  }
  for (let k = 0; k < 3; k++) {
    const fx0 = x0 + k * fw + 8, fx1 = x0 + (k + 1) * fw - 8, fy0 = y0 + hole * 2.8, fy1 = y1 - hole * 2.8;
    if (k >= shown) { hardFill(p, id + 50 + k, '#0f131c', T(rect(fx0, fy0, fx1, fy1))); continue; } // unexposed frame: dark
    hardFill(p, id + 50 + k, '#f3ead8', T(rect(fx0, fy0, fx1, fy1)));
    const bx = (fx0 + fx1) / 2, by = fy0 + (fy1 - fy0) * 0.42, s = (fy1 - fy0);
    inkLine(p, id + 60 + k, T([[bx, by + s * 0.18], [bx, fy1 - 6]]), {closed: false, weight: 1.2, color: FXC.ink, still: true});
    if (k < 2) {
      const br = s * (k === 0 ? 0.16 : 0.27);
      hardFill(p, id + 70 + k, '#d6453a', T(ell(bx, by + s * 0.18 - br, br * 0.9, br, 18)));
      hardFill(p, id + 72 + k, '#f08a7c', T(ell(bx - br * 0.35, by + s * 0.18 - br * 1.35, br * 0.22, br * 0.3, 10)));
      inkLine(p, id + 74 + k, T(ell(bx, by + s * 0.18 - br, br * 0.9, br, 18)), {weight: 1, color: FXC.ink, still: true});
    } else {
      for (let j = 0; j < 10; j++) {
        const a = (j / 10) * Math.PI * 2 + 0.3, r0 = s * 0.1, r1 = s * (0.26 + 0.06 * (j % 2));
        inkLine(p, id + 80 + j, T([[bx + Math.cos(a) * r0, by + Math.sin(a) * r0], [bx + Math.cos(a) * r1, by + Math.sin(a) * r1]]), {closed: false, weight: 1.6, color: FXC.amber, still: true});
      }
      for (let j = 0; j < 4; j++) hardFill(p, id + 95 + j, '#d6453a', T(ell(bx + Math.cos(j * 1.7) * s * 0.17, by + Math.sin(j * 1.7) * s * 0.17, s * 0.035, s * 0.022, 8, j)));
    }
  }
  const cr = o.cross ?? 0;
  if (cr > 0 && shown >= 3) {
    const k = 2, bx = x0 + (k + 0.5) * fw, by = (y0 + y1) / 2, s = (y1 - y0) * 0.42 * (1.25 - 0.25 * cr), w = s * 0.2;
    for (const sg of [1, -1]) {
      const a = sg * Math.PI / 4, dx = Math.cos(a), dy = Math.sin(a);
      hardFill(p, id + 120 + (sg > 0 ? 0 : 1), FXC.cross, T([[bx - dx * s - dy * w / 2, by - dy * s + dx * w / 2], [bx + dx * s - dy * w / 2, by + dy * s + dx * w / 2], [bx + dx * s + dy * w / 2, by + dy * s - dx * w / 2], [bx - dx * s + dy * w / 2, by - dy * s - dx * w / 2]]));
    }
  }
};

// ---------------------------------------------------------------- flask (S01-B02-SH03)
/** Flask timeline (storyboard S01-B02-SH03): the cutaway opens at 0.3 s (0.3 s long); heat wiggle 1 bounces off the gap at 1.2 s, wiggle 2 at 2.0 s, each travelling the 0.6 s before. */
export const FLASK_T = {open: 0.3, openLen: 0.3, bounce: [1.2, 2.0] as const, travel: 0.6, back: 0.35};
export type FlaskState = {open: number; heat: {reach: number; back: number}[]};
export const flaskAt = (t: number): FlaskState => ({
  open: ease(ramp(t, FLASK_T.open, FLASK_T.open + FLASK_T.openLen)),
  heat: FLASK_T.bounce.map((b) => ({reach: ease(ramp(t, b - FLASK_T.travel, b)), back: ease(ramp(t, b, b + FLASK_T.back))})),
});

/**
 * Flask card (VD12): paper card in box; a plain Thai thermos (cream body, red cap, floral band, no brand) cut away down the middle: the
 * inner bottle glows warm orange, heat wiggles bounce back off the empty dark gap, the outer wall stays cool blue. No text, no body.
 * Pass `state` (from `flaskAt`) to animate; omit it for the approved still (open, three wiggles at rest).
 */
export const paintFlaskCard = (p: Painter, box: [number, number, number, number], seed = 9300, state?: FlaskState) => {
  const [x0, y0, x1, y1] = box, id = seed, cx = (x0 + x1) / 2, w = x1 - x0, h = y1 - y0;
  const open = state ? state.open : 1;
  hardFill(p, id, '#000000', rect(x0 + 8, y0 + 10, x1 + 8, y1 + 10));
  hardFill(p, id + 1, FXC.paper, rect(x0, y0, x1, y1));
  inkLine(p, id + 2, rect(x0, y0, x1, y1), {weight: 1.4, color: FXC.ink, still: true, curve: 0});
  const fw = w * 0.4, fx0 = cx - fw / 2, fx1 = cx + fw / 2, fy0 = y0 + h * 0.24, fy1 = y1 - h * 0.08;
  const rnd = (xa: number, ya: number, xb: number, yb: number, r: number): Pt[] => [...ell(xa + r, ya + r, r, r, 16).filter(([x, y]) => x <= xa + r && y <= ya + r), ...ell(xb - r, ya + r, r, r, 16).filter(([x, y]) => x >= xb - r && y <= ya + r), [xb, yb], [xa, yb]];
  inkLine(p, id + 3, [[fx0, fy0 + h * 0.1], [fx0 - fw * 0.22, fy0 + h * 0.16], [fx0 - fw * 0.22, fy0 + h * 0.42], [fx0, fy0 + h * 0.48]], {closed: false, weight: 3, color: '#8a2a22', still: true, curve: 0.5});
  hardFill(p, id + 4, '#c8342b', rnd(cx - fw * 0.3, y0 + h * 0.07, cx + fw * 0.3, fy0 + 6, fw * 0.12));
  hardFill(p, id + 5, '#f1e6cc', rnd(fx0, fy0, cx, fy1, fw * 0.2).filter(([x]) => x <= cx));
  if (open < 0.99) {
    // before the cutaway finishes: the right half is whole cream; the cut face wipes in from the top
    const wipe = fy0 + (fy1 - fy0) * open;
    hardFill(p, id + 60, '#f1e6cc', rect(cx, fy0 + fw * 0.08, fx1 - 1, fy1));
    if (open > 0.02) hardFill(p, id + 61, '#7fb2e6', rect(cx, fy0 + fw * 0.08, fx1, Math.max(fy0 + fw * 0.09, wipe)));
  }
  if (open >= 0.99) hardFill(p, id + 6, '#7fb2e6', rect(cx, fy0 + fw * 0.08, fx1, fy1));
  if (open > 0.02) {
    const cut = (xa: number, ya: number, xb: number, yb: number) => rect(xa, ya, xb, yb);
    hardFill(p, id + 7, '#141a2a', cut(cx + fw * 0.05, fy0 + fw * 0.12, fx1 - fw * 0.05, fy1 - fw * 0.05));
    hardFill(p, id + 8, '#ffb347', cut(cx + fw * 0.11, fy0 + fw * 0.18, fx1 - fw * 0.11, fy1 - fw * 0.11));
    hardFill(p, id + 9, '#ff8c3a', cut(cx + fw * 0.14, fy0 + fw * 0.36, fx1 - fw * 0.14, fy1 - fw * 0.14));
  }
  const by = fy0 + (fy1 - fy0) * 0.45;
  hardFill(p, id + 10, '#d97a6a', rect(fx0, by, cx, by + h * 0.07));
  for (let k = 0; k < 3; k++) hardFill(p, id + 11 + k, '#f6d36a', ell(fx0 + (k + 0.5) * (fw / 2) / 3, by + h * 0.035, h * 0.02, h * 0.02, 10));
  // heat wiggles: out from the warm bottle, bouncing back off the gap (amber, bold). Still: three rows; animated: the two timed wiggles
  const rows = state ? state.heat.length : 3;
  for (let k = 0; k < rows; k++) {
    const yy = fy0 + (fy1 - fy0) * (state ? 0.38 + 0.26 * k : 0.3 + 0.22 * k), xa = cx + fw * 0.22, xb = fx1 + fw * 0.02;
    const reach = state ? state.heat[k].reach : 1, back = state ? state.heat[k].back : 1;
    if (reach <= 0.01 || open < 0.99) continue;
    const m = Math.max(2, Math.round(8 * reach)), pts: Pt[] = Array.from({length: m + 1}, (_, i): Pt => [xa + ((xb - xa) * reach * i) / m, yy + Math.sin(i * 1.6) * h * 0.014]);
    inkLine(p, id + 20 + k, pts, {closed: false, weight: 3, color: FXC.amber, still: true, curve: 0.4});
    if (back > 0.01) {
      // the bounce: a hook turning back toward the bottle, the arrowhead pointing home, growing with `back`
      const hx = xb - fw * 0.2 * back;
      inkLine(p, id + 40 + k, [[xb, yy], [xb - fw * 0.06 * back, yy + h * 0.035 * back], [hx, yy + h * 0.04 * back]], {closed: false, weight: 3, color: FXC.amber, still: true, curve: 0.3});
      hardFill(p, id + 50 + k, FXC.amber, [[hx, yy + h * 0.015 * back + h * 0.0], [hx - fw * 0.08 * back, yy + h * 0.04 * back], [hx, yy + h * 0.065 * back]]);
    }
  }
  inkLine(p, id + 30, [[cx, fy0], [fx0 + fw * 0.2, fy0], [fx0, fy0 + fw * 0.2], [fx0, fy1], [fx1, fy1], [fx1, fy0 + fw * 0.08], [cx, fy0 + fw * 0.08]], {weight: 1.2, color: FXC.ink, still: true, curve: 0, closed: false});
  inkLine(p, id + 31, [[cx, fy0], [cx, fy1]], {closed: false, weight: 1, color: FXC.ink, still: true});
};

// ---------------------------------------------------------------- drop diagram (S01-B03-SH02)
/** Drop timeline (storyboard S01-B03-SH02): arrows fade out 0.2-0.6 s, 10 bubbles rise and pop 0.9-2.0 s, warm glow from 1.9 s. */
export const DROP_T = {arrowsOut: [0.2, 0.6] as const, bubbles: 10, b0: 0.9, b1: 2.0, rise: 0.55, pop: 0.14, glow: [1.9, 2.5] as const, tremble: 0.9};
export type DropBubble = {x: number; y: number; r: number; pop: number};
export type DropState = {arrows: number; press: number; bubbles: DropBubble[]; glow: number; tremble: number};
/** Drop geometry (picture px): centre x 540, body circle r 230 at y 770, tip at y 400 (card centre ~ y 700). */
export const DROP = {cx: 540, cy: 770, r: 230, tip: 400};
export const dropAt = (t: number): DropState => {
  const k = DROP_T, bubbles: DropBubble[] = [];
  for (let i = 0; i < k.bubbles; i++) {
    const born = k.b0 + ((k.b1 - k.b0 - k.rise - k.pop) * i) / (k.bubbles - 1), age = t - born;
    if (age < 0 || age > k.rise + k.pop) continue;
    const hx = (hash(9400 + i * 3.7) - 0.5) * 2 * DROP.r * 0.55, u = Math.min(1, age / k.rise);
    const y0 = DROP.cy + DROP.r * 0.55, y1 = DROP.cy - DROP.r * (0.35 + 0.35 * hash(9450 + i)), r = 16 + 20 * hash(9500 + i * 1.3);
    bubbles.push({x: DROP.cx + hx * (1 - 0.25 * u) + Math.sin(age * 7 + i) * 4, y: y0 + (y1 - y0) * ease(u), r, pop: ramp(age, k.rise, k.rise + k.pop)});
  }
  return {
    arrows: 1 - ease(ramp(t, k.arrowsOut[0], k.arrowsOut[1])), press: ease(ramp(t, 0, 0.2)), bubbles,
    glow: ease(ramp(t, k.glow[0], k.glow[1])), tremble: t >= k.tremble ? Math.min(1, (t - k.tremble) / 0.2) : 0,
  };
};

const dropOutline = (t: number, tremble: number): Pt[] => {
  // teardrop: a circle of radius r with the top pulled to a point by the two tangent lines from the tip; surface tremble = small radial wobble
  const {cx, cy, r, tip} = DROP, n = 56, phi = Math.acos(r / (cy - tip)), pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const beta = phi + (i / (n - 1)) * (Math.PI * 2 - 2 * phi), wob = 1 + tremble * 0.018 * Math.sin(t * 38 + i * 1.9);
    pts.push([cx + Math.sin(beta) * r * wob, cy - Math.cos(beta) * r * wob]);
  }
  return [...pts, [cx, tip]];
};

/**
 * Drop-diagram card (VD14): full-frame paper-blue card, a large water drop (ink outline, light highlight), three amber "air pressing" arrows
 * above it that press down and fade, bubbles that rise inside and pop, a warm glow under it. No body part, no labels. `s` from `dropAt(t)`.
 */
export const paintDropDiagram = (p: Painter, t: number, seed = 9600) => {
  const s = dropAt(t), id = seed, {cx, cy, r, tip} = DROP;
  hardFill(p, id, '#cfe3f6', rect(-40, -40, 1120, 1960));
  hardFill(p, id + 1, '#e3effa', rect(-40, 300, 1120, 1500)); // lighter field behind the drop
  if (s.glow > 0) paintHalo(p, {x: cx, y: cy + r * 0.95, r: 420 * s.glow, color: '#f0a43a', level: 0.3 * s.glow, squash: 0.5, seed: id + 2});
  const out = dropOutline(t, s.tremble);
  hardFill(p, id + 10, '#000000', out.map(([x, y]): Pt => [x + 7, y + 10]));
  hardFill(p, id + 11, '#4f9fe0', out);
  // lower shade (a second smaller blob offset down-right) and the highlight
  hardFill(p, id + 12, '#3b86c8', ell(cx + r * 0.12, cy + r * 0.34, r * 0.82, r * 0.62, 28));
  hardFill(p, id + 13, '#4f9fe0', ell(cx, cy - r * 0.02, r * 0.9, r * 0.8, 28));
  hardFill(p, id + 14, '#a9d4f5', ell(cx - r * 0.42, cy - r * 0.18, r * 0.12, r * 0.3, 14, -0.35));
  if (s.glow > 0) hardFill(p, id + 15, '#f4b860', ell(cx, cy + r * 0.74, r * 0.85 * s.glow, r * 0.2 * s.glow, 22));
  inkLine(p, id + 16, out, {weight: 1.6, color: FXC.ink, still: true, curve: 0.2});
  for (const b of s.bubbles) {
    if (b.pop < 0.01) {
      hardFill(p, id + 20 + (b.x | 0) % 50, '#d8ecfb', ell(b.x, b.y, b.r, b.r, 14));
      hardFill(p, id + 80 + (b.x | 0) % 50, '#8fc4ee', ell(b.x, b.y, b.r * 0.78, b.r * 0.78, 14));
      hardFill(p, id + 140 + (b.x | 0) % 50, '#ffffff', ell(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.22, b.r * 0.22, 8));
    } else {
      // pop: ring grows, six short burst lines
      const rr = b.r * (1 + 1.2 * b.pop);
      inkLine(p, id + 200 + (b.x | 0) % 50, ell(b.x, b.y, rr, rr, 16), {weight: 1.5 * (1 - b.pop), color: '#f4fbff', still: true, curve: 0.1});
      for (let j = 0; j < 6; j++) { const a = (j / 6) * Math.PI * 2, r0 = rr * 1.15, r1 = rr * (1.45 + 0.4 * b.pop); inkLine(p, id + 260 + (b.x | 0) % 40 * 6 + j, [[b.x + Math.cos(a) * r0, b.y + Math.sin(a) * r0], [b.x + Math.cos(a) * r1, b.y + Math.sin(a) * r1]], {closed: false, weight: 1.3 * (1 - b.pop), color: '#f4fbff', still: true}); }
    }
  }
  // three amber arrows pressing down on the tip region; they sink by `press` px*28 then fade (flat colour: shrink toward the drop as they fade)
  if (s.arrows > 0.02) {
    for (let k = 0; k < 3; k++) {
      const ax = cx + (k - 1) * 140, ay0 = tip - 190 + (k === 1 ? 0 : 34), len = 120 * s.arrows, ay = ay0 + s.press * 22 + (1 - s.arrows) * 60;
      const w = 18 * (0.5 + 0.5 * s.arrows);
      hardFill(p, id + 330 + k, FXC.amber, [[ax - w / 2, ay], [ax + w / 2, ay], [ax + w / 2, ay + len * 0.62], [ax + w * 1.15, ay + len * 0.62], [ax, ay + len], [ax - w * 1.15, ay + len * 0.62], [ax - w / 2, ay + len * 0.62]]);
      inkLine(p, id + 340 + k, [[ax - w / 2, ay], [ax + w / 2, ay], [ax + w / 2, ay + len * 0.62], [ax + w * 1.15, ay + len * 0.62], [ax, ay + len], [ax - w * 1.15, ay + len * 0.62], [ax - w / 2, ay + len * 0.62]], {weight: 1.2, color: '#9a6a1c', still: true, curve: 0, closed: true});
    }
  }
};

// ---------------------------------------------------------------- chest outline (S01-B04-SH02)
/** Chest timeline (storyboard S01-B04-SH02): outline draws on 0.1-0.5 s; four amber arrows push outward from 0.6 s; the dashed ring outside shows at 1.5 s and fades 1.6-2.6 s; one amber glow (<= 0.3) around 3.6 s. */
export const CHEST_T = {draw: [0.1, 0.5] as const, arrows: 0.6, ringIn: 1.5, ringOut: [1.6, 2.6] as const, glow: [3.45, 3.6, 4.1] as const};
export type ChestState = {draw: number; arrows: number; pulse: number; ring: number; glow: number};
export const chestAt = (t: number): ChestState => {
  const k = CHEST_T, g = k.glow;
  return {
    draw: ease(ramp(t, k.draw[0], k.draw[1])), arrows: ease(ramp(t, k.arrows, k.arrows + 0.15)), pulse: 0.5 + 0.5 * Math.sin((t - k.arrows) * 6.5),
    ring: ease(ramp(t, k.ringIn, k.ringIn + 0.1)) * (1 - ease(ramp(t, k.ringOut[0], k.ringOut[1]))),
    glow: t < g[0] ? 0 : t < g[1] ? ease((t - g[0]) / (g[1] - g[0])) : 1 - ease(ramp(t, g[1], g[2])),
  };
};

/** The chest outline polygon (picture px) for a chest centre `c` and width `w` (0.34 m x u): rounded shoulders, a gentle taper, a rounded base. */
export const chestShape = (c: Pt, w: number): Pt[] => {
  const hw = w / 2, hh = w * 0.62, pts: Pt[] = [];
  const corner = (cx: number, cy: number, r: number, a0: number, a1: number, n = 8) => { for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
  const rs = w * 0.2, rb = w * 0.16;
  // clockwise from the top centre
  pts.push([c[0], c[1] - hh]);
  corner(c[0] + hw - rs, c[1] - hh + rs, rs, -Math.PI / 2, 0);
  pts.push([c[0] + hw * 0.9, c[1] + hh * 0.25]);
  corner(c[0] + hw * 0.9 - rb, c[1] + hh - rb, rb, 0, Math.PI / 2);
  corner(c[0] - hw * 0.9 + rb, c[1] + hh - rb, rb, Math.PI / 2, Math.PI);
  pts.push([c[0] - hw * 0.9, c[1] + hh * 0.25]);
  corner(c[0] - hw + rs, c[1] - hh + rs, rs, Math.PI, 1.5 * Math.PI);
  return pts;
};
const along = (pts: Pt[], u: number): Pt[] => {
  // the first `u` of the closed polyline's length, as an open polyline
  if (u >= 0.999) return [...pts, pts[0]];
  const cl = [...pts, pts[0]], seg = cl.slice(1).map((q, i) => Math.hypot(q[0] - cl[i][0], q[1] - cl[i][1])), total = seg.reduce((a, b) => a + b, 0);
  let want = total * u; const out: Pt[] = [cl[0]];
  for (let i = 0; i < seg.length && want > 0; i++) {
    const k = Math.min(1, want / seg[i]);
    out.push([cl[i][0] + (cl[i + 1][0] - cl[i][0]) * k, cl[i][1] + (cl[i + 1][1] - cl[i][1]) * k]);
    want -= seg[i];
  }
  return out;
};

/**
 * Chest-outline overlay (VD17), anchored to the figure's chest point `c` (picture px) with body scale `u` (px/m): a simple rounded chest outline
 * in white ink (no organs, no lungs, no injury marks), four amber arrows that push out, a faint dashed ring outside that fades, and one amber glow.
 */
export const paintChestOutline = (p: Painter, c: Pt, u: number, t: number, seed = 9800) => {
  const s = chestAt(t), w = 0.34 * u, id = seed, shape = chestShape(c, w);
  if (s.draw <= 0.01) return;
  const col = s.glow > 0 ? '#ffe8b8' : '#ffffff';
  // the warning glow is an amber under-stroke (flat colour reads on the dark sky; a wash halo does not), strength follows the pulse, never above 0.6 mix
  if (s.glow > 0.01) inkLine(p, id + 4, along(shape, s.draw), {closed: false, weight: 6 + 14 * s.glow, color: mixColor('#23324a', FXC.glow, 0.6 * s.glow), still: true, curve: 0.2});
  inkLine(p, id + 5, along(shape, s.draw), {closed: false, weight: 5, color: '#23324a', still: true, curve: 0.2});
  inkLine(p, id + 6, along(shape, s.draw), {closed: false, weight: 2.8, color: col, still: true, curve: 0.2});
  if (s.arrows > 0.01) {
    const dirs: [number, number][] = [[-1, 0], [1, 0], [-0.62, -0.78], [0.62, -0.78]];
    dirs.forEach(([dx, dy], i) => {
      const from = w * 0.12, to = w * (0.3 + 0.07 * s.pulse), len = (to - from) * s.arrows, hd = w * 0.07;
      const a: Pt = [c[0] + dx * from, c[1] + dy * from + w * 0.05], b: Pt = [a[0] + dx * len, a[1] + dy * len], nx = -dy, ny = dx;
      inkLine(p, id + 10 + i, [a, b], {closed: false, weight: 4, color: FXC.amber, still: true});
      hardFill(p, id + 20 + i, FXC.amber, [[b[0] + dx * hd * 1.4, b[1] + dy * hd * 1.4], [b[0] + nx * hd, b[1] + ny * hd], [b[0] - nx * hd, b[1] - ny * hd]]);
    });
  }
  if (s.ring > 0.01) {
    // faint dashed ring where outside arrows would be: dashes only, no arrow
    const rx = w * 1.05, ry = w * 1.0, n = 20;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = a0 + (Math.PI * 2 * 0.55) / n;
      const q: Pt[] = [0, 0.5, 1].map((k) => [c[0] + Math.cos(a0 + (a1 - a0) * k) * rx, c[1] + Math.sin(a0 + (a1 - a0) * k) * ry]);
      inkLine(p, id + 40 + i, q, {closed: false, weight: 2.2 * s.ring, color: '#cfe3f6', still: true});
    }
  }
};
