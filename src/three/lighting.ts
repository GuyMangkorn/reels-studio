/** Frame-driven lamp modulation, including a short three-frame dropout each cycle. */
export function lampFlickerAt(frame: number): number {
  const oscillation = 1 + 0.25 * Math.sin(frame * 0.9) * Math.sin(frame * 0.37);
  const cycleFrame = ((frame % 97) + 97) % 97;
  const dropout = frame > 0 && cycleFrame < 3 ? 0.15 : 1;
  return oscillation * dropout;
}
