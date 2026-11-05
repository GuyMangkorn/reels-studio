// EDU-EP03-SHORT dog-view colour map (brief VD05, spike S1). One pure function of a colour and the blend `u`, so the look frame, the
// sheets and the QA script use the same numbers. Approximation, not a photograph of dog vision (research F012): a deuteranope-type
// dichromat projection (Machado, Oliveira & Fernandes 2009, severity 1.0, applied in linear RGB) followed by a `DOG_DESAT` desaturation
// toward luminance (Rec.709, linear). Both steps are linear in linear RGB, so the whole map is ONE 3x3 matrix and blending by `u`
// is a blend of that matrix with the identity: the picture pass (an SVG `feColorMatrix`, `color-interpolation-filters: linearRGB`)
// and `dogViewColor` agree to rounding.

/** Machado 2009 deuteranopia, severity 1.0 (linear RGB). */
export const DEUTAN: readonly (readonly number[])[] = [
  [0.367322, 0.860646, -0.227968],
  [0.280085, 0.672501, 0.047413],
  [-0.01182, 0.04294, 0.968881],
];
const LUMA = [0.2126, 0.7152, 0.0722] as const;
/** Desaturation toward luminance after the projection. Chosen in S1 (brief range 0.20-0.30) on the painted frame: 0.20 left the red ball at C* 38.5 (> 35), 0.25 the flowers at C* 44.2 (< 45); 0.27 passes both with the painted flower yellow `#fbd21a`. */
export const DOG_DESAT = 0.27;

/** The 3x3 map at full strength (rows = output channels), desaturation included. */
export const dogMatrix = (desat = DOG_DESAT): number[][] => DEUTAN.map((row) => row.map((v, j) => (1 - desat) * v + desat * LUMA[j]));
/** Blend of the identity with the full map by `u` (0 = normal view, 1 = dog view). */
export const dogMatrixAt = (u: number, desat = DOG_DESAT): number[][] => dogMatrix(desat).map((row, i) => row.map((v, j) => (1 - u) * (i === j ? 1 : 0) + u * v));
/** `feColorMatrix` `values` string (4x5, alpha untouched) for the blend `u`. */
export const dogMatrixValues = (u: number, desat = DOG_DESAT): string =>
  dogMatrixAt(u, desat).map((r) => `${r.map((v) => v.toFixed(5)).join(' ')} 0 0`).join(' ') + ' 0 0 0 1 0';

const lin = (v: number) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const enc = (v: number) => { v = Math.max(0, Math.min(1, v)); return Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055)); };
const parse = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** The dog-view colour of a `#rrggbb` colour at blend `u` (default full). */
export const dogViewColor = (hex: string, u = 1, desat = DOG_DESAT): string => {
  const c = parse(hex).map(lin), m = dogMatrixAt(u, desat);
  const o = m.map((r) => enc(r[0] * c[0] + r[1] * c[1] + r[2] * c[2]));
  return `#${o.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};
