// Blink + lip-flap drivers
const rand = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
/** Irregular blinks: deterministic pseudo-random gaps of 1.8–4.2 s, 6-frame blink. */
export const blinkAt = (frame: number, fps: number, seed = 1) => {
  let t = Math.round(fps * 0.8);
  for (let i = 0; t < frame + 10; i++) {
    const d = frame - t;
    if (d >= 0 && d < 6) return [0.5, 1, 1, 0.6, 0.25, 0][d];
    t += Math.round(fps * (1.8 + rand(i + seed * 13) * 2.4));
    if (rand(i * 7 + seed) > 0.8) { const d2 = frame - (t - 9); if (d2 >= 0 && d2 < 6) return [0.5, 1, 1, 0.6, 0.25, 0][d2]; }
  }
  return 0;
};
/** Lip flap from per-frame amplitude array (0..1) with gate + quantize-ish snap. */
export const mouthAt = (amp: number[], frame: number, startFrame = 0) => {
  const i = frame - startFrame;
  if (i < 0 || i >= amp.length) return 0;
  const v = (amp[i] + (amp[i - 1] ?? 0) * 0.5) / 1.5;
  return v < 0.12 ? 0 : Math.min(1, v * 1.2);
};
