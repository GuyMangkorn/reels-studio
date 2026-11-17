import {paintedShots} from '../painted/registry';
import {endingState, loopBlendOpacity, type Ending, type EndingOptions} from './endings';
import type {PaintedItem, PaintedLabel, Timeline} from './types';

type Fail = (path: string, message: string) => never;
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const record = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);
const frames = (seconds: number, fps: number) => Math.max(1, Math.round(seconds * fps));

/**
 * A cue label: one text (slot 1), or up to two slots (`[slot1, slot2]`, DEP03) where `null` leaves a slot empty so a
 * label keeps its slot while it stays on. Slot 2 sits below slot 1 (y 360-410 in Short).
 */
const validateLabel = (label: unknown, path: string, fail: Fail) => {
  if (typeof label === 'string') {
    if (label.trim() === '') fail(path, 'expected non-empty text');
    return;
  }
  if (!Array.isArray(label) || label.length === 0 || label.length > 2) fail(path, 'expected text or one to two slots');
  const slots = label as unknown[];
  slots.forEach((text, i) => {
    if (text !== null && (typeof text !== 'string' || text.trim() === '')) fail(`${path}[${i}]`, 'expected non-empty text or null');
  });
  if (slots.every((text) => text === null)) fail(path, 'expected at least one slot with text');
};

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
    if (cue.label !== undefined) validateLabel(cue.label, `${cp}.label`, fail);
    for (const key of ['labelAtSec', 'labelTop'] as const) {
      if (cue[key] === undefined) continue;
      if (cue.label === undefined) fail(`${cp}.${key}`, 'needs a label on the same cue');
      if (!finite(cue[key]) || (cue[key] as number) < 0) fail(`${cp}.${key}`, key === 'labelTop' ? 'expected non-negative px' : 'expected non-negative seconds');
    }
    if (cue.labelSide !== undefined) {
      if (cue.label === undefined) fail(`${cp}.labelSide`, 'needs a label on the same cue');
      if (cue.labelSide !== 'left' && cue.labelSide !== 'right') fail(`${cp}.labelSide`, "expected 'left' or 'right'");
    }
    if (cue.items !== undefined) {
      if (!Array.isArray(cue.items) || cue.items.length > 8) fail(`${cp}.items`, 'expected up to eight items');
      (cue.items as unknown[]).forEach((raw2, k) => {
        const ip = `${cp}.items[${k}]`;
        if (!record(raw2)) fail(ip, 'expected item');
        const it = raw2 as Record<string, unknown>;
        if (it.kind !== 'label' && it.kind !== 'card') fail(`${ip}.kind`, "expected 'label' or 'card'");
        if (typeof it.text !== 'string' || it.text.trim() === '') fail(`${ip}.text`, 'expected non-empty text');
        for (const key of ['x', 'y']) if (!finite(it[key])) fail(`${ip}.${key}`, 'expected px');
        for (const key of ['atFrame', 'popFrames', 'untilFrame', 'strikeAtFrame', 'strikeFrames']) if (it[key] !== undefined && (!finite(it[key]) || (it[key] as number) < 0)) fail(`${ip}.${key}`, 'expected non-negative frames');
        if (!finite(it.atFrame)) fail(`${ip}.atFrame`, 'expected frames');
        if (finite(it.untilFrame) && it.untilFrame <= (it.atFrame as number)) fail(`${ip}.untilFrame`, 'must be after atFrame');
        if (it.kind === 'label') for (const key of ['w', 'h', 'strikeAtFrame', 'strikeFrames']) if (it[key] !== undefined) fail(`${ip}.${key}`, 'card only');
        if (it.kind === 'card') for (const key of ['w', 'h']) if (it[key] !== undefined && (!finite(it[key]) || (it[key] as number) <= 0)) fail(`${ip}.${key}`, 'expected positive px');
        if ((it.strikeFrames !== undefined) !== (it.strikeAtFrame !== undefined)) fail(`${ip}.strikeAtFrame`, 'strikeAtFrame and strikeFrames go together');
      });
    }
    if (finite(cue.labelAtSec)) {
      const next = (shots as Record<string, unknown>[])[j + 1]?.atSec;
      const end = finite(next) ? next : duration;
      if ((cue.atSec as number) + cue.labelAtSec >= end) fail(`${cp}.labelAtSec`, 'label must start before the next cue or the scene end');
    }
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
export type PaintedSpan = {shot: string; startFrame: number; endFrame: number; fromFrame: number; dissolveFrames: number; label?: PaintedLabel; labelFrames: number; labelTop?: number; labelSide?: 'left' | 'right'; items?: PaintedItem[]; scene: number};

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
        labelFrames: Math.round((cue.labelAtSec ?? 0) * fps),
        ...(cue.labelTop !== undefined ? {labelTop: cue.labelTop} : {}),
        ...(cue.labelSide !== undefined ? {labelSide: cue.labelSide} : {}),
        ...(cue.items?.length ? {items: cue.items} : {}),
        scene: index,
      });
    });
    sceneStart += duration;
  });
  return spans;
};

/** A plate to paint this frame: `tl` on its shot clock (before the shot's own clock remap), plate and glow opacity. */
export type PaintedPlate = {shot: string; tl: number; frame: number; alpha: number; overlayOpacity: number; label?: PaintedLabel; /** Slot-0 top in px (cue `labelTop`). */ labelTop?: number; /** Label side (cue `labelSide`). */ labelSide?: 'left' | 'right'; /** Positioned items of the cue (cue `items`). */ items?: PaintedItem[]; /** A frame-0 plate laid by the C_seamless loop blend. */ incoming?: boolean};
export type PaintedState = {plates: PaintedPlate[]; opacity: number};

const platesAt = (spans: PaintedSpan[], frame: number, fps: number): PaintedPlate[] => {
  const k = spans.findIndex((s) => frame >= s.startFrame && frame < s.endFrame);
  if (k < 0) return [];
  const span = spans[k];
  const plate = (s: PaintedSpan, alpha: number, overlayOpacity: number): PaintedPlate => {
    const f = frame - s.startFrame + s.fromFrame;
    const label = frame - s.startFrame >= s.labelFrames ? s.label : undefined;
    return {shot: s.shot, tl: f / fps, frame: f, alpha, overlayOpacity, label, ...(label !== undefined && s.labelTop !== undefined ? {labelTop: s.labelTop} : {}), ...(label !== undefined && s.labelSide !== undefined ? {labelSide: s.labelSide} : {}), ...(s.items ? {items: s.items} : {})};
  };
  const prev = spans[k - 1];
  if (span.dissolveFrames > 0 && prev && prev.endFrame === span.startFrame && frame < span.startFrame + span.dissolveFrames) {
    const mix = (frame - span.startFrame + 1) / (span.dissolveFrames + 1);
    return [plate(prev, 1, 1 - mix), plate(span, mix, mix)];
  }
  return [plate(span, 1, 1)];
};

/** The incoming plate of a timeline dissolve (two plates, the second partial and not a C_seamless loop-blend plate) whose shot opts into
 * `PaintedShot.crossfade` (`isCrossfade(shot id)`); null otherwise. PaintedStage paints that plate whole on the canvas layer. */
export const crossfadeOf = (plates: PaintedPlate[], isCrossfade: (shot: string) => boolean): {plate: PaintedPlate; index: number} | null => {
  if (plates.length !== 2) return null;
  const plate = plates[1];
  return !plate.incoming && plate.alpha > 0 && plate.alpha < 1 && isCrossfade(plate.shot) ? {plate, index: 1} : null;
};

/**
 * Pure painted state of a composition frame: which plates to paint, at which shot time and opacity. The final scene
 * follows the renderer's ending (B_loop/A_fade hold the last three seconds; A_fade fades); C_seamless blends frame 0's
 * plates over the last `loopBlendFrames`. Returns null when no painted plate is visible.
 */
export const paintedStateAt = (timeline: Timeline, frame: number, fps: number, o: {ending: Ending; durationInFrames: number; loopBlendFrames: number; endingOptions?: EndingOptions}): PaintedState | null => {
  const spans = paintedSpans(timeline, fps);
  if (spans.length === 0) return null;
  const lastStart = timeline.slice(0, -1).reduce((sum, s) => sum + frames(s.durationSec, fps), 0);
  const lastDuration = frames(timeline[timeline.length - 1].durationSec, fps);
  let stageFrame = frame, opacity = 1;
  if (frame >= lastStart) {
    const state = endingState(frame - lastStart, lastDuration, fps, o.ending, o.endingOptions);
    stageFrame = lastStart + state.poseFrame;
    opacity = state.opacity;
  }
  const plates = platesAt(spans, stageFrame, fps);
  if (o.ending === 'C_seamless') {
    const blend = loopBlendOpacity(frame, o.durationInFrames, o.loopBlendFrames);
    if (blend > 0) {
      // The outgoing plates' glow/overlay layers fade out as frame 0's fade in; their paint is covered by frame 0's opaque plate.
      plates.forEach((p, i) => { plates[i] = {...p, overlayOpacity: p.overlayOpacity * (1 - blend)}; });
      plates.push(...platesAt(spans, 0, fps).map((p) => ({...p, alpha: p.alpha * blend, overlayOpacity: p.overlayOpacity * blend, incoming: true})));
    }
  }
  return plates.length ? {plates, opacity} : null;
};
