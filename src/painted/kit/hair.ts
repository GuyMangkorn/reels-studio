import type {Pt} from './painter';

// Hair shapes of the people library (`people.ts`): the cuts added after the WFOG/ZC cast (`short|tied|bob|hood|long`
// stay in head.ts, untouched). Each cut is plain geometry in head units (head.ts frame: x across, y down, eyes at y 0.05,
// brows near -0.24, forehead top -1.05, chin 1.22), for the front decal and the profile decal (face toward +x, nose 1.13).
// head.ts paints these polygons with the same fill / light / ink calls as the existing cuts.

export const NEW_CUTS = ['crop', 'parted', 'spiky', 'buzz', 'balding', 'bowl', 'pixie', 'ponytail', 'pigtails', 'curly', 'perm', 'shaved'] as const;
export type NewCut = (typeof NEW_CUTS)[number];
export const isNewCut = (cut: string): cut is NewCut => (NEW_CUTS as readonly string[]).includes(cut);

/**
 * `back`: painted behind the head (volume, tails). `hair`: over the head, one polygon each. `ears`: sides whose skin ear
 * shows (-1 screen-left, +1 screen-right; front only). `tone`: mix of the hair fill toward skin (buzz). `accent`: polygons
 * in the style's `accent` colour (ties, bands). `part`: an open ink stroke (hair parting).
 */
export type HairFront = {back?: Pt[][]; hair: Pt[][]; ears: (-1 | 1)[]; tone?: number; accent?: Pt[][]; part?: Pt[]; sheen?: boolean};
/** Profile: `back` behind the head, `hair` over it (a tail that hangs over the ear goes last), `ear`: skin ear drawn over the cap. */
export type HairSide = {back?: Pt[][]; hair: Pt[][]; ear: boolean; tone?: number; accent?: Pt[][]; sheen?: boolean};

const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]): Pt => [-x, y]).reverse();
/** Front skull cap (head.ts `hair` arc): left side over the top to the right side. */
const cap = (rx = 1.07, ry = 1.12, cy = -0.04, n = 16): Pt[] => Array.from({length: n + 1}, (_, i): Pt => {
  const a = Math.PI + (i / n) * Math.PI;
  return [rx * Math.cos(a), ry * Math.sin(a) + cy];
});
/** Profile skull arc (head.ts `arc`): from front-top angle a0 round the top to the back angle a1. */
const sarc = (r: number, a0: number, a1: number, n = 20): Pt[] => Array.from({length: n + 1}, (_, i): Pt => {
  const a = a0 + ((a1 - a0) * i) / n;
  return [r * Math.cos(a), r * 1.05 * Math.sin(a) - 0.02];
});
/** Scalloped cloud (curly, perm): cusps point inward; angles in radians, y down. */
const cloud = (cx: number, cy: number, rx: number, ry: number, bumps: number, depth: number, a0: number, a1: number, n: number): Pt[] =>
  Array.from({length: n + 1}, (_, i): Pt => {
    const a = a0 + ((a1 - a0) * i) / n;
    const r = 1 - depth * (1 - Math.abs(Math.sin((bumps * a) / 2)));
    return [cx + rx * r * Math.cos(a), cy + ry * r * Math.sin(a)];
  });
const bumpy = (x0: number, x1: number, y: number, bumps: number, h: number, n = 20): Pt[] =>
  Array.from({length: n + 1}, (_, i): Pt => [x0 + ((x1 - x0) * i) / n, y + h * Math.abs(Math.sin((i / n) * bumps * Math.PI))]);
/** A hair tie as a small tilted band centred on (x, y). */
const band = (x: number, y: number, w: number, h: number, a: number): Pt[] =>
  ([[-w, -h], [w, -h], [w, h], [-w, h]] as Pt[]).map(([u, v]): Pt => [x + u * Math.cos(a) - v * Math.sin(a), y + u * Math.sin(a) + v * Math.cos(a)]);

/** Spiky crown: valleys on the skull, tips pushed out; right-to-left edge is a zigzag fringe. Exported for the back view (`back.ts`), which
 *  mirrors it so the spikes read the same from behind (EDU-EP17 LF01/LF04, 15 Nov 2026: the back view drew a smooth round cap). */
export const spikes = (): Pt[] => {
  const pts: Pt[] = [];
  const N = 9;
  for (let i = 0; i <= N; i++) {
    const a = Math.PI + (i / N) * Math.PI;
    pts.push([1.06 * Math.cos(a), 1.1 * Math.sin(a) - 0.04]);
    if (i < N) {
      const b = Math.PI + ((i + 0.5) / N) * Math.PI, r = 1.34 + 0.08 * (i % 3) - 0.04 * (i % 2);
      pts.push([r * Math.cos(b) * 0.98 + 0.03 * (i - 4), r * 1.04 * Math.sin(b) - 0.04]);
    }
  }
  return pts;
};
/** Sides of a front cap down to the temples, then the hairline edge (right to left), then back up the left side. */
const frontCap = (c: Pt[], side: Pt[], edge: Pt[]): Pt[] => [...c, ...side, ...edge, ...mirror(side)];

export const hairFront = (cut: NewCut): HairFront => {
  switch (cut) {
    case 'crop':
      return {ears: [-1, 1], sheen: true, hair: [frontCap(cap(1.05, 1.09, -0.03), [[0.93, 0.0], [0.9, -0.2], [0.84, -0.4]], [[0.6, -0.56], [0.3, -0.62], [0, -0.6], [-0.3, -0.62], [-0.6, -0.56]])]};
    case 'parted':
      return {ears: [-1, 1], sheen: true, part: [[0.14, -0.66], [0.1, -0.85], [0.04, -1.0]], hair: [[...cap(1.08, 1.15, -0.05),
        [0.93, 0.0], [0.9, -0.2], [0.84, -0.4], [0.62, -0.5], [0.38, -0.56], [0.14, -0.67], [-0.1, -0.5], [-0.35, -0.44], [-0.6, -0.4], [-0.84, -0.38], [-0.9, -0.2], [-0.93, 0.0]]]};
    case 'spiky':
      return {ears: [-1, 1], hair: [[...spikes(), [0.93, 0.0], [0.9, -0.2], [0.84, -0.42], [0.66, -0.52], [0.5, -0.4], [0.34, -0.58], [0.14, -0.46], [-0.06, -0.6], [-0.26, -0.44], [-0.44, -0.58], [-0.62, -0.42], [-0.84, -0.42], [-0.9, -0.2], [-0.93, 0.0]]]};
    case 'buzz':
      return {ears: [-1, 1], tone: 0.55, hair: [frontCap(cap(1.03, 1.07, -0.03), [[0.92, 0.0], [0.89, -0.22], [0.82, -0.42]], [[0.56, -0.6], [0.28, -0.66], [0, -0.66], [-0.28, -0.66], [-0.56, -0.6]])]};
    case 'shaved': // monk: the buzz cap with the hair almost all skin tone, so only a faint shadow shows
      return {ears: [-1, 1], tone: 0.88, hair: [frontCap(cap(1.03, 1.07, -0.03), [[0.92, 0.0], [0.89, -0.22], [0.82, -0.42]], [[0.56, -0.6], [0.28, -0.66], [0, -0.66], [-0.28, -0.66], [-0.56, -0.6]])]};
    case 'balding': {
      const side: Pt[] = [[0.86, -0.5], [1.03, -0.3], [1.06, -0.02], [1.0, 0.16], [0.9, 0.06], [0.86, -0.18], [0.84, -0.36]];
      return {ears: [-1, 1], hair: [side, mirror(side)]};
    }
    case 'bowl':
      return {ears: [-1, 1], hair: [[...cap(1.1, 1.14, -0.04), [0.99, 0.08], [0.9, -0.12], [0.8, -0.3], [0.62, -0.36], [0.3, -0.4], [0, -0.38], [-0.3, -0.4], [-0.62, -0.36], [-0.8, -0.3], [-0.9, -0.12], [-0.99, 0.08]]]};
    case 'pixie':
      return {ears: [1], sheen: true, hair: [[...cap(1.08, 1.13, -0.04), [0.93, 0.02], [0.88, -0.3], [0.7, -0.44], [0.4, -0.52], [0.1, -0.6], [-0.2, -0.5], [-0.5, -0.32], [-0.78, -0.12], [-0.93, 0.12], [-0.99, 0.0]]]};
    case 'ponytail': {
      const tail: Pt[] = [[0.7, -0.95], [1.2, -0.72], [1.45, -0.12], [1.52, 0.7], [1.38, 1.32], [1.2, 1.05], [1.1, 0.25], [0.9, -0.3]];
      return {ears: [-1, 1], sheen: true, back: [tail], accent: [band(1.0, -0.72, 0.18, 0.07, 0.5)],
        hair: [[...cap(1.08, 1.13, -0.04), [0.93, 0.02], [0.9, -0.28], [0.8, -0.44], [0.55, -0.54], [0.2, -0.6], [-0.2, -0.58], [-0.55, -0.5], [-0.82, -0.38], [-0.9, -0.2], [-0.93, 0.02]]]};
    }
    case 'pigtails': {
      const tail: Pt[] = [[0.85, -0.5], [1.25, -0.5], [1.55, -0.1], [1.62, 0.55], [1.46, 1.05], [1.24, 0.82], [1.16, 0.2], [0.95, -0.1]];
      return {ears: [], back: [tail, mirror(tail)], accent: [band(1.02, -0.4, 0.2, 0.08, -0.4), band(-1.02, -0.4, 0.2, 0.08, 0.4)],
        hair: [[...cap(1.09, 1.13, -0.04), [0.96, 0.04], [0.9, -0.2], [0.8, -0.38], [0.4, -0.44], [0, -0.46], [-0.4, -0.44], [-0.8, -0.38], [-0.9, -0.2], [-0.96, 0.04]]]};
    }
    case 'curly':
      return {ears: [], back: [[...cloud(0, -0.25, 1.62, 1.55, 13, 0.1, Math.PI - 0.55, 2 * Math.PI + 0.55, 80), [1.15, 0.8], [0.9, 1.0], [-0.9, 1.0], [-1.15, 0.8]]],
        hair: [[...cap(1.12, 1.16, -0.06), [0.99, 0.04], [0.9, -0.3], ...bumpy(0.88, -0.88, -0.5, 6, 0.1, 24), [-0.9, -0.3], [-0.99, 0.04]]]};
    case 'perm':
      return {ears: [], sheen: true, back: [[...cloud(0, -0.2, 1.3, 1.3, 15, 0.08, Math.PI - 0.4, 2 * Math.PI + 0.4, 80), [1.0, 0.7], [-1.0, 0.7]]],
        hair: [[...cap(1.08, 1.14, -0.04), [0.96, 0.04], [0.9, -0.3], ...bumpy(0.86, -0.86, -0.5, 7, 0.08, 28), [-0.9, -0.3], [-0.96, 0.04]]]};
  }
};

export const hairSide = (cut: NewCut): HairSide => {
  const nape: Pt[] = [[-0.62, 0.5], [-0.36, 0.06], [-0.12, -0.14]];
  switch (cut) {
    case 'crop':
      return {ear: true, sheen: true, hair: [[...sarc(1.07, -0.95, -Math.PI - 0.5), ...nape, [0.2, -0.34], [0.5, -0.46], [0.78, -0.56]]]};
    case 'parted':
      return {ear: true, sheen: true, hair: [[...sarc(1.1, -0.82, -Math.PI - 0.5), ...nape, [0.2, -0.34], [0.48, -0.42], [0.88, -0.5], [0.96, -0.62]]]};
    case 'spiky': {
      const top: Pt[] = [];
      for (let i = 0; i <= 8; i++) {
        const a = -0.95 + ((-Math.PI - 0.5 + 0.95) * i) / 8;
        top.push([1.06 * Math.cos(a), 1.05 * 1.06 * Math.sin(a) - 0.02]);
        if (i < 8) {
          const b = -0.95 + ((-Math.PI - 0.5 + 0.95) * (i + 0.5)) / 8, r = 1.34 + 0.07 * (i % 3);
          top.push([r * Math.cos(b), r * 1.05 * Math.sin(b) - 0.02]);
        }
      }
      return {ear: true, hair: [[...top, ...nape, [0.2, -0.36], [0.4, -0.5], [0.52, -0.38], [0.7, -0.6], [0.8, -0.46], [0.98, -0.72]]]};
    }
    case 'buzz':
      return {ear: true, tone: 0.55, hair: [[...sarc(1.04, -0.95, -Math.PI - 0.5), ...nape, [0.2, -0.38], [0.5, -0.52], [0.76, -0.64]]]};
    case 'shaved':
      return {ear: true, tone: 0.88, hair: [[...sarc(1.04, -0.95, -Math.PI - 0.5), ...nape, [0.2, -0.38], [0.5, -0.52], [0.76, -0.64]]]};
    case 'balding':
      return {ear: true, hair: [[[-0.96, -0.4], [-1.06, 0.05], [-0.98, 0.5], [-0.82, 0.6], [-0.62, 0.34], [-0.54, 0.0], [-0.56, -0.3], [-0.72, -0.44]]]};
    case 'bowl':
      return {ear: true, hair: [[...sarc(1.12, -0.9, -Math.PI - 0.6), [-0.76, 0.62], [-0.5, 0.22], [-0.2, -0.02], [0.1, -0.12], [0.32, -0.36], [0.6, -0.42], [0.88, -0.44]]]};
    case 'pixie':
      return {ear: true, sheen: true, hair: [[...sarc(1.08, -0.85, -Math.PI - 0.55), [-0.7, 0.55], [-0.4, 0.14], [-0.12, -0.16], [0.18, -0.32], [0.5, -0.42], [0.86, -0.5], [0.98, -0.66]]]};
    case 'ponytail':
      return {ear: true, sheen: true, back: [[[-0.7, -0.78], [-1.1, -0.5], [-1.34, 0.1], [-1.4, 0.9], [-1.26, 1.45], [-1.04, 1.1], [-1.04, 0.3], [-0.9, -0.2]]],
        accent: [band(-0.93, -0.62, 0.08, 0.2, 0.4)],
        hair: [[...sarc(1.08, -0.9, -Math.PI - 0.5), ...nape, [0.2, -0.34], [0.55, -0.44], [0.8, -0.55]]]};
    case 'pigtails':
      return {ear: false, back: [[[-0.9, -0.4], [-1.28, 0.2], [-1.3, 1.0], [-1.1, 1.15], [-0.95, 0.5]]],
        accent: [band(-0.4, -0.32, 0.2, 0.08, -0.3)],
        hair: [[...sarc(1.09, -0.9, -Math.PI - 0.5), ...nape, [0.2, -0.34], [0.5, -0.42], [0.88, -0.44]],
          [[-0.2, -0.3], [-0.55, -0.3], [-0.78, 0.3], [-0.78, 1.1], [-0.56, 1.36], [-0.36, 1.0], [-0.26, 0.3]]]};
    case 'curly':
      return {ear: false, back: [[...cloud(-0.2, -0.25, 1.5, 1.5, 13, 0.1, Math.PI - 0.7, 2 * Math.PI + 0.1, 70), [0.2, 0.3], [-0.9, 0.9]]],
        hair: [[...sarc(1.12, -0.9, -Math.PI - 0.5), ...nape, [0.2, -0.34], [0.5, -0.42], ...bumpy(0.9, 0.6, -0.5, 2, 0.08, 6)]]};
    case 'perm':
      return {ear: true, sheen: true, back: [[...cloud(-0.15, -0.2, 1.3, 1.3, 15, 0.08, Math.PI - 0.5, 2 * Math.PI, 70), [0.2, 0.3], [-0.9, 0.7]]],
        hair: [[...sarc(1.08, -0.9, -Math.PI - 0.55), ...nape, [0.2, -0.34], [0.5, -0.42], ...bumpy(0.9, 0.6, -0.5, 2, 0.07, 6)]]};
  }
};
