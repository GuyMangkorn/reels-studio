import {paintedShots} from '../painted/registry';
import {endingState, loopBlendOpacity, type Ending} from './endings';
import type {Timeline} from './types';

type Fail = (path: string, message: string) => never;
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const record = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);
const frames = (seconds: number, fps: number) => Math.max(1, Math.round(seconds * fps));

/** `scene.painted`; called from validateTimeline. */
export function validateScenePainted(s: Record<string, unknown>, path: string, previous: Record<string, unknown> | undefined, fps: number, fail: Fail) {
  if (s.painted === undefined) return;
  const pp = `${path}.painted`;
  if (!record(s.painted)) fail(pp, 'expected {shots: [...]}');
  if (s.bg !== 'none') fail(`${path}.bg`, "painted scenes draw their own plate; set bg to 'none'");
  if (s.projection !== undefined) fail(`${path}.projection`, 'painted scenes have no metre projection');
  if (s.transitionIn !== undefined) fail(`${path}.transitionIn`, 'one canvas per composition: use painted.shots[0].dissolveSec (in-canvas dissolve) instead');
  const shots = (s.painted as Record<string, unknown>).shots;
  if (!Array.isArray(shots) || shots.length === 0) fail(`${pp}.shots`, 'expected a non-empty array');
  const duration = s.durationSec as number;
  let last = -1;
  (shots as unknown[]).forEach((raw, j) => {
    const cp = `${pp}.shots[${j}]`;
    if (!record(raw)) fail(cp, 'expected painted shot cue');
    const cue = raw as Record<string, unknown>;
    if (typeof cue.shot !== 'string' || !Object.hasOwn(paintedShots, cue.shot)) fail(`${cp}.shot`, 'unknown painted shot ID (src/painted/registry.ts)');
    if (!finite(cue.atSec) || cue.atSec < 0 || cue.atSec >= duration || cue.atSec <= last) fail(`${cp}.atSec`, 'times must increase and fall inside scene');
    if (j === 0 && cue.atSec !== 0) fail(`${cp}.atSec`, 'first painted shot must start at zero');
    if (cue.fromSec !== undefined && (!finite(cue.fromSec) || cue.fromSec < 0)) fail(`${cp}.fromSec`, 'expected non-negative seconds');
    if (cue.label !== undefined && (typeof cue.label !== 'string' || cue.label.trim() === '')) fail(`${cp}.label`, 'expected non-empty text');
    if (cue.dissolveSec !== undefined) {
      if (!finite(cue.dissolveSec) || cue.dissolveSec <= 0) fail(`${cp}.dissolveSec`, 'expected positive seconds');
      const next = (shots as Record<string, unknown>[])[j + 1]?.atSec;
      const end = finite(next) ? next : duration;
      if ((cue.atSec as number) + (cue.dissolveSec as number) > end + 1e-9) fail(`${cp}.dissolveSec`, 'dissolve must finish before the next cue or the scene end');
      if (j === 0 && (previous === undefined || previous.painted === undefined)) fail(`${cp}.dissolveSec`, 'a dissolve needs a painted plate before it (previous painted scene)');
      if (Math.round((cue.dissolveSec as number) * fps) < 1) fail(`${cp}.dissolveSec`, 'shorter than one frame');
    }
    last = cue.atSec as number;
  });
}

/** One painted cue on the composition clock. */
export type PaintedSpan = {shot: string; startFrame: number; endFrame: number; fromFrame: number; dissolveFrames: number; label?: string; scene: number};

/** Flatten every painted cue into composition frames; a cue ends at the next cue or its scene end. */
export const paintedSpans = (timeline: Timeline, fps: number): PaintedSpan[] => {
  const spans: PaintedSpan[] = [];
  let sceneStart = 0;
  timeline.forEach((scene, index) => {
    const duration = frames(scene.durationSec, fps);
    const cues = scene.painted?.shots ?? [];
    cues.forEach((cue, j) => {
      const next = cues[j + 1];
      spans.push({
        shot: cue.shot,
        startFrame: sceneStart + Math.round(cue.atSec * fps),
        endFrame: next ? sceneStart + Math.round(next.atSec * fps) : sceneStart + duration,
        fromFrame: Math.round((cue.fromSec ?? 0) * fps),
        dissolveFrames: cue.dissolveSec ? Math.max(1, Math.round(cue.dissolveSec * fps)) : 0,
        label: cue.label,
        scene: index,
      });
    });
    sceneStart += duration;
  });
  return spans;
};

/** A plate to paint this frame: `tl` on its shot clock (before the shot's own clock remap), plate and glow opacity. */
export type PaintedPlate = {shot: string; tl: number; frame: number; alpha: number; overlayOpacity: number; label?: string};
export type PaintedState = {plates: PaintedPlate[]; opacity: number};

const platesAt = (spans: PaintedSpan[], frame: number, fps: number): PaintedPlate[] => {
  const k = spans.findIndex((s) => frame >= s.startFrame && frame < s.endFrame);
  if (k < 0) return [];
  const span = spans[k];
  const plate = (s: PaintedSpan, alpha: number, overlayOpacity: number): PaintedPlate => {
    const f = frame - s.startFrame + s.fromFrame;
    return {shot: s.shot, tl: f / fps, frame: f, alpha, overlayOpacity, label: s.label};
  };
  const prev = spans[k - 1];
  if (span.dissolveFrames > 0 && prev && prev.endFrame === span.startFrame && frame < span.startFrame + span.dissolveFrames) {
    const mix = (frame - span.startFrame + 1) / (span.dissolveFrames + 1);
    return [plate(prev, 1, 1 - mix), plate(span, mix, mix)];
  }
  return [plate(span, 1, 1)];
};

/**
 * Pure painted state of a composition frame: which plates to paint, at which shot time and opacity. The final scene
 * follows the renderer's ending (B_loop/A_fade hold the last three seconds; A_fade fades); C_seamless blends frame 0's
 * plates over the last `loopBlendFrames`. Returns null when no painted plate is visible.
 */
export const paintedStateAt = (timeline: Timeline, frame: number, fps: number, o: {ending: Ending; durationInFrames: number; loopBlendFrames: number}): PaintedState | null => {
  const spans = paintedSpans(timeline, fps);
  if (spans.length === 0) return null;
  const lastStart = timeline.slice(0, -1).reduce((sum, s) => sum + frames(s.durationSec, fps), 0);
  const lastDuration = frames(timeline[timeline.length - 1].durationSec, fps);
  let stageFrame = frame, opacity = 1;
  if (frame >= lastStart) {
    const state = endingState(frame - lastStart, lastDuration, fps, o.ending);
    stageFrame = lastStart + state.poseFrame;
    opacity = state.opacity;
  }
  const plates = platesAt(spans, stageFrame, fps);
  if (o.ending === 'C_seamless') {
    const blend = loopBlendOpacity(frame, o.durationInFrames, o.loopBlendFrames);
    if (blend > 0) plates.push(...platesAt(spans, 0, fps).map((p) => ({...p, alpha: p.alpha * blend, overlayOpacity: p.overlayOpacity * blend})));
  }
  return plates.length ? {plates, opacity} : null;
};
