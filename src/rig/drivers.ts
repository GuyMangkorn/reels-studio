/** Irregular, deterministic blinks shared by every scene. */
const rand = (n: number) => {const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};
export const blinkAt = (frame: number, fps: number, seed = 1) => {
  let at = Math.round(fps * .8);
  for (let i = 0; at <= frame; i++) {
    const offset = frame - at;
    if (offset < 6) return [.5, 1, 1, .6, .25, 0][offset];
    at += Math.round(fps * (1.8 + rand(i + seed * 13) * 2.4));
  }
  return 0;
};
/** Audio envelope only: silence, missing samples and times outside the clip close the mouth. */
export const mouthAt = (amplitude: readonly number[], frame: number, startFrame = 0) => {
  const index = Math.floor(frame - startFrame);
  if (index < 0 || index >= amplitude.length) return 0;
  const value = (amplitude[index] + (amplitude[index - 1] ?? 0) * .5) / 1.5;
  return value < .12 ? 0 : Math.min(1, value * 1.2);
};
