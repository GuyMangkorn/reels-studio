export type Ending = 'A_fade' | 'B_loop';
/** Hold the final staging for three seconds; A then fades during its last second. */
export const endingState = (frame: number, duration: number, fps: number, ending: Ending) => {
  const holdFrame = Math.max(0, duration - Math.round(3 * fps));
  const fadeFrames = Math.max(2, Math.round(fps));
  const fadeStart = Math.max(0, duration - fadeFrames);
  return {
    poseFrame: Math.min(frame, holdFrame),
    opacity: ending === 'B_loop' ? 1 : Math.max(0, Math.min(1, (duration - 1 - frame) / Math.max(1, duration - 1 - fadeStart))),
  };
};
