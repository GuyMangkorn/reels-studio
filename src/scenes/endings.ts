/** A fades out, B holds then loops with a dip to dark, C_seamless blends the last frame into the first for platforms that replay automatically. */
export type Ending = 'A_fade' | 'B_loop' | 'C_seamless';
export const DEFAULT_LOOP_BLEND_FRAMES = 15;
/**
 * Opacity of the frozen first frame laid over the last `blendFrames` of a C_seamless video: 0 before the window and
 * 1 on the final frame, so the last frame equals frame 0 and replay shows no cut, hold or fade.
 */
export const loopBlendOpacity = (frame: number, duration: number, blendFrames: number) =>
  blendFrames <= 0 ? 0 : Math.max(0, Math.min(1, (frame - (duration - 1 - blendFrames)) / blendFrames));
/** Hold the final staging for three seconds; A then fades during its last second. C_seamless has no hold or fade. */
export const endingState = (frame: number, duration: number, fps: number, ending: Ending) => {
  if (ending === 'C_seamless') return {poseFrame: frame, opacity: 1};
  const holdFrame = Math.max(0, duration - Math.round(3 * fps));
  const fadeFrames = Math.max(2, Math.round(fps));
  const fadeStart = Math.max(0, duration - fadeFrames);
  return {
    poseFrame: Math.min(frame, holdFrame),
    opacity: ending === 'B_loop' ? 1 : Math.max(0, Math.min(1, (duration - 1 - frame) / Math.max(1, duration - 1 - fadeStart))),
  };
};
