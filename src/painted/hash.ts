/** Deterministic 0..1 hash for per-element randomness that must not boil (rain drops, wave phases). */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
