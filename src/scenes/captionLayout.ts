// Caption block vertical layout, one home for `Subtitles` (the text) and `CaptionShade` (the dark band behind it).
// Root cause of the recurring "caption not centred in its overlay" note (EG-EP02 Draft r1, user 3 Nov 2026): the text was anchored by its
// BOTTOM edge (`bottomEdgeY`) while the shade is a fixed band, so a 1-line cue (one 84 px line box) sat about 42 px below the band centre
// while a 2-line cue sat on it. `centerY` anchors the block's vertical CENTRE instead, so a 1-, 2- or 3-line cue grows symmetrically about
// the same y the shade is centred on. Pure functions, no React.

export const CAPTION_FONT_PORTRAIT = 51;
export const CAPTION_FONT_LANDSCAPE = 44;
/** CSS line-height of a caption line (a Thai line needs room for tone marks above and vowels below). */
export const CAPTION_LINE_HEIGHT = 1.65;
/** Vertical caption-safe limit of a 1080x1920 portrait frame (docs/production-requirements.md#vertical-caption-safe-zone). */
export const CAPTION_SAFE_BOTTOM = 1344;
/** Shade centre of the shared default band (gradient y 990-1330, plateau 1080-1250): the centre of a 2-line block whose bottom edge is y 1248. */
export const DEFAULT_SHADE_CENTRE_Y = 1164;

/** Height of one caption line box in px. */
export const captionLineHeight = (portrait: boolean, scale = 1) => (portrait ? CAPTION_FONT_PORTRAIT : CAPTION_FONT_LANDSCAPE) * scale * CAPTION_LINE_HEIGHT;

/** Vertical extent of a caption block of `lines` lines centred on `centerY`. */
export const captionBlock = (centerY: number, lines: number, portrait = true, scale = 1) => {
  const h = lines * captionLineHeight(portrait, scale);
  return {top: centerY - h / 2, bottom: centerY + h / 2, height: h};
};

/** `centerY` that puts the bottom edge of a 2-line block at `bottomEdgeY` (the old anchor; 1248 -> 1164 = the shade centre). */
export const centerFromBottomEdge = (bottomEdgeY: number, portrait = true, scale = 1) => bottomEdgeY - captionLineHeight(portrait, scale);

/** Largest line count whose block stays above the caption-safe bottom (y 1344) when centred on `centerY`. */
export const maxSafeLines = (centerY: number, portrait = true, scale = 1) => Math.floor(((CAPTION_SAFE_BOTTOM - centerY) * 2) / captionLineHeight(portrait, scale));

/** CaptionShade `band` gradient stops (px offsets from the shade centre): transparent, full, full, transparent. Same shape as the original 990/1080/1250/1330. */
export const SHADE_BAND_OFFSETS = [-174, -84, 86, 166] as const;
export const shadeBandStops = (centerY: number) => SHADE_BAND_OFFSETS.map((o) => centerY + o) as [number, number, number, number];
/** Middle of the shade's full-strength plateau, the y the text block should be centred on (within 1 px of `centerY`). */
export const shadePlateauCentre = (centerY: number) => { const [, a, b] = shadeBandStops(centerY); return (a + b) / 2; };
