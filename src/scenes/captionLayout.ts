/** Footer occupies its own fixed band below the subtitle's lowest possible glyph. */
export function captionLayout(width: number, height: number) {
  const portrait = height > width;
  return {
    subtitleBottom: portrait ? 134 : 58,
    footerBottom: portrait ? 53 : 18,
    footerHeight: 28,
  };
}
