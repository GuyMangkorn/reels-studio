import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import {clamp01} from './clock';

// N5 thought bubble and N8 plunger icon (EDU-EP15 shots 4 and 5). The bubble is a cloud-edged outline with three rising dots (EP14 `bubble.ts` method), filled in the her-thought
// sepia; the plunger icon is the red cup with a wooden handle (screen space). Pure functions of their arguments.
export const THOUGHT = {fill: '#f3e6c8', edge: '#7a5a3a', ink: '#2b211c', cup: '#c4342d', cupD: '#8f2420', wood: '#a8764a', woodD: '#6e4a2c'} as const;

/** The small bubble of shot 4: `from` the top of her head, `at` the bubble centre, `r` its radius, `pop` 0..1 (dots first, then the cloud). */
export const paintBubbleSmall = (p: Painter, o: {from: Pt; at: Pt; r: number; pop: number; plunger?: number}) => {
  const {from, at, r, pop} = o;
  if (pop <= 0) return;
  const dots: [number, number][] = [[0.14, 0.2], [0.33, 0.34], [0.55, 0.5]];
  dots.forEach(([k, rr], i) => {
    const a = clamp01(pop * 3 - i);
    if (a <= 0) return;
    const x = from[0] + (at[0] - from[0] + r * 0.2) * k, y = from[1] + (at[1] + r * 0.85 - from[1]) * k, rad = 8 + 26 * rr;
    washAt(p, 38000 + i * 4, THOUGHT.fill, 230 * a, ell(x, y, rad, rad, 14), 0, 0);
    inkLine(p, 38001 + i * 4, ell(x, y, rad, rad, 14), {weight: 1.4, color: THOUGHT.ink, curve: 0.1, still: true});
  });
  const ob = clamp01(pop * 2.2 - 1);
  if (ob <= 0) return;
  const pts: Pt[] = Array.from({length: 44}, (_, i): Pt => { const a = (i / 44) * Math.PI * 2, sc = 1 + 0.07 * Math.sin(a * 7); return [at[0] + r * 1.1 * ob * sc * Math.cos(a), at[1] + r * ob * sc * Math.sin(a)]; });
  washAt(p, 38020, THOUGHT.fill, 235 * ob, pts, 0.15, 0.1);
  inkLine(p, 38021, pts, {weight: 2, color: THOUGHT.ink, curve: 0.2, still: true});
  if (o.plunger !== undefined && ob > 0.5) paintPlungerIcon(p, [at[0], at[1] + r * 0.05], r * 0.85 * ob, o.plunger);
};

/** Plunger icon (red cup, dome up, wooden handle): `at` the cup rim centre, `s` the handle length / 2 in px, `tilt` radians. */
export const paintPlungerIcon = (p: Painter, at: Pt, s: number, tilt = 0) => {
  const rot = ([x, y]: Pt): Pt => [at[0] + x * Math.cos(tilt) - y * Math.sin(tilt), at[1] + x * Math.sin(tilt) + y * Math.cos(tilt)];
  const handle = [[-0.07, -0.05], [0.07, -0.05], [0.07, -1.05], [-0.07, -1.05]].map(([x, y]) => rot([x * s, y * s]));
  hardFill(p, 38100, THOUGHT.wood, handle);
  inkLine(p, 38101, handle, {weight: 1.2, color: THOUGHT.woodD, still: true});
  const cup: Pt[] = [[-0.5, 0.0], [-0.46, 0.22], [-0.3, 0.42], [0, 0.5], [0.3, 0.42], [0.46, 0.22], [0.5, 0.0]].map(([x, y]) => rot([x * s, -y * s]));
  // cup dome above the rim line (the handle comes out of its top)
  const dome: Pt[] = [[-0.5, 0.02], [-0.44, -0.28], [-0.22, -0.46], [0.22, -0.46], [0.44, -0.28], [0.5, 0.02]].map(([x, y]) => rot([x * s, y * s]));
  hardFill(p, 38102, THOUGHT.cup, dome);
  inkLine(p, 38103, dome, {weight: 1.6, color: THOUGHT.cupD, still: true, closed: true});
  const rim = ell(at[0], at[1] + 0.02 * s, 0.5 * s, 0.1 * s, 18, tilt);
  hardFill(p, 38104, THOUGHT.cupD, rim);
  inkLine(p, 38105, rim, {weight: 1.2, color: THOUGHT.ink, still: true});
  void cup;
};
