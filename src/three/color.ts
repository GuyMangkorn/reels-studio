/** Encode display-authored hex colors for a renderer that writes linear pixels. */
export function linearOutputColor(color: string): string {
  if (!/^#[0-9a-f]{6}$/i.test(color)) return color;

  const encode = (channel: number) => {
    const linear = channel / 255;
    const srgb = linear <= 0.0031308 ? linear * 12.92 : 1.055 * linear ** (1 / 2.4) - 0.055;
    return Math.round(srgb * 255)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${encode(parseInt(color.slice(1, 3), 16))}${encode(parseInt(color.slice(3, 5), 16))}${encode(parseInt(color.slice(5, 7), 16))}`;
}
