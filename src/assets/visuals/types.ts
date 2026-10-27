/** Modes implemented by the Short runtime. C05-S02 novelty material stays on the Long source. */
export const visualModes = ['paper-stimuli', 'selection-units', 'shelter-context', 'outcome-tracks', 'toy-pursuit', 'occlusion-compare', 'physiology-definition', 'wall-warmth', 'contact-hypothesis', 'evidence-sort'] as const;
export type VisualMode = typeof visualModes[number];
export type SceneVisual = {
  id: VisualMode;
  shotId: string;
  sourceBeatId: string;
  startSec: number;
  endSec: number;
  phase: 0 | 1 | 2 | 3;
  heading: string;
  labels: string[];
  /** Optional per-label reveal times in scene-local seconds. */
  labelsAtSec?: number[];
  /** Hide the explanatory drawing when a shared prop supplies the same visual beat. */
  showDiagram?: boolean;
  status: 'fiction' | 'diagram' | 'research' | 'hypothesis';
};
/** Half-open intervals make the visual at a cut independent of playback history. */
export const visualAt = (visuals: readonly SceneVisual[] | undefined, frame: number, fps: number) => visuals?.find(item => frame / fps >= item.startSec && frame / fps < item.endSec);

/** Progress is local to the selected visual interval and is stable for random frame seeks. */
export const visualProgressAt = (visual: SceneVisual, frame: number, fps: number) => {
  const elapsed = frame / fps - visual.startSec;
  return Math.max(0, Math.min(1, elapsed / (visual.endSec - visual.startSec)));
};
