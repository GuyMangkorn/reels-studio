import {mixColor, type Painter, type Pt} from '../kit/painter';
import {INK, finite, formDir, glaze, planeBand, solid} from '../kit/draw';

export * from '../kit/draw';

// ------------------------------------------------------------------ interior/character look (brief VD18, Film look dev)

/**
 * Lighting of one interior setup in plate space (brief VD18). `key` is the direction the key light travels (from the
 * tube lights: mostly down), `rim` the direction the cool fog light from the glass travels. Off (undefined) keeps the
 * blockout look, so a shot opts in by passing a light.
 */
export type InteriorLight = {
  /** Key travel direction in plate px (normalised inside), e.g. [0.3, 1]: from above, a little from screen-left. */
  key: Pt;
  /** Fog-glass light travel direction, e.g. [-0.6, 1]: from the glass behind, upper right. */
  rim: Pt;
  /** Rim strength (brief VD18 `rimMix` x 0.5 where the glass is behind the camera). Default 1. */
  rimScale?: number;
};

/** VD18 numbers: one table so Boss can apply the look shot by shot. */
export const VD18 = {
  /** Cool ambient the base colours are pulled toward (the fluorescent + fog room), and how far. */
  ambient: '#7c8788', ambientMix: 0.2,
  /** Watercolour glaze over every opaque part: granulation and a dried pigment ring at the edge. */
  glazeOpacity: 70, glazeTexture: 0.6, glazeBorder: 0.55,
  /** Form shadow: the far side of each part along the key, in a cool pigment. */
  shadow: '#2c3843', shadowMix: 0.42, shadowOpacity: 175, shadowFrom: 0.52, shadowBleed: 0.06,
  /** Lit plane: the near side of each part along the key, paler. */
  light: '#f3efe2', lightMix: 0.22, lightOpacity: 95, lightTo: 0.2,
  /** Fog rim on the side facing the glass: a thin cool band. */
  rimColor: '#c9d3d0', rimMix: 0.36, rimTo: 0.07,
  /** Pencil hatching inside the form shadow (strokes, so nothing under the part shows through): spacing px, angle, weight. */
  hatch: '2B', hatchDist: 7, hatchAngle: 40, hatchWeight: 0.55, hatchMix: 0.62,
  /** Ink: the outline is a darker shade of the local colour, not one black. */
  lineMix: 0.6, lineOuter: 0.9, lineFold: 0.7,
  /** Top-light falloff down the body: a cool dark glaze on parts below the shoulders, growing to `falloffOpacity` at the feet. */
  falloff: '#1a2327', falloffOpacity: 165,
} as const;


/**
 * Model one opaque part under an interior light (VD18): mottled glaze, cool form shadow on the far side of the key,
 * paler lit plane, fog rim on the glass side. Call right after the part's opaque base fill. `seed` is the part's seed.
 */
export const modelPart = (p: Painter, seed: number, color: string, pts: Pt[], L: InteriorLight, scale = 1) => {
  if (!finite(pts)) return;
  const s = 7_000_000 + seed * 8;
  glaze(p, s, mixColor(color, '#000000', 0.06), VD18.glazeOpacity, pts, {texture: VD18.glazeTexture, border: VD18.glazeBorder, bleed: 0.02});
  const dir = formDir(pts, L.key);
  const lit = planeBand(pts, dir, 0, VD18.lightTo);
  if (lit.length) glaze(p, s + 1, mixColor(color, VD18.light, VD18.lightMix), VD18.lightOpacity * scale, lit, {texture: 0.3, border: 0.2, bleed: 0.05});
  const shade = planeBand(pts, dir, VD18.shadowFrom);
  if (shade.length) {
    glaze(p, s + 2, mixColor(color, VD18.shadow, VD18.shadowMix), VD18.shadowOpacity * scale, shade, {texture: 0.45, border: 0.5, bleed: VD18.shadowBleed});
    hatchIn(p, s + 4, mixColor(color, VD18.shadow, VD18.hatchMix), shade);
  }
  // The rim is opaque passes, not a glaze: a light watercolour glaze cannot lighten a dark part (pigment is subtractive).
  const rim = planeBand(pts, L.rim, 0, VD18.rimTo);
  if (rim.length) solid(p, s + 3, mixColor(color, VD18.rimColor, VD18.rimMix * scale * rimScaleOf(L)), rim, 3, 0, 0.15);
};

/** Rim strength of a light (1 unless the setup halves it, brief VD18 glass-behind-camera rows). */
export const rimScaleOf = (L: InteriorLight) => L.rimScale ?? 1;

/** VD18 pencil hatching inside a polygon (held still: seeded per part, it does not boil). */
export const hatchIn = (p: Painter, seed: number, color: string, pts: Pt[], dist: number = VD18.hatchDist, angle: number = VD18.hatchAngle) => {
  if (!finite(pts)) return;
  const {brush} = p;
  brush.seed(seed);
  brush.noiseSeed(seed);
  brush.noStroke();
  brush.noFill();
  brush.hatch(dist, angle, {rand: 0.25, continuous: false, gradient: 0.15});
  brush.hatchStyle(VD18.hatch, color, VD18.hatchWeight);
  brush.polygon(pts);
  brush.noHatch();
};

/** Base colour of a part under the interior ambient (VD18), or unchanged without a light. */
export const toneOf = (color: string, L?: InteriorLight) => (L ? mixColor(color, VD18.ambient, VD18.ambientMix) : color);
/** Ink colour for a part outline under VD18: a dark shade of the local colour. */
export const lineOf = (color: string, L?: InteriorLight) => (L ? mixColor(color, INK, VD18.lineMix) : INK);
