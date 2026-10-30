import type {AudioTrack, CaptionStyle, ChromeStyle, MediaClip, SceneTransition} from './types';

type Fail = (path: string, message: string) => never;
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const record = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const mediaKinds = ['video', 'image'] as const;
export const transitionTypes = ['fade', 'slide', 'wipe'] as const;
export const transitionDirections = ['left', 'right', 'up', 'down'] as const;
export const captionPresets = ['outline', 'box', 'none'] as const;
export const captionPositions = ['bottom', 'middle', 'top', 'lower'] as const;

/** A public/ path (no leading slash, no `..`) or an http(s) URL. */
const validSrc = (v: unknown) => typeof v === 'string' && v.trim() !== '' && (/^https?:\/\//.test(v) || (!v.startsWith('/') && !v.split('/').includes('..')));

const checkUnit = (v: unknown, path: string, fail: Fail) => {
  if (v !== undefined && (!finite(v) || v < 0 || v > 1)) fail(path, 'expected a number from 0 to 1');
};
const checkSeconds = (v: unknown, path: string, fail: Fail) => {
  if (v !== undefined && (!finite(v) || v < 0)) fail(path, 'expected non-negative seconds');
};

/** Scene-level media, sound cues and entry transition; called from validateTimeline. */
export function validateSceneMedia(s: Record<string, unknown>, path: string, index: number, previousDurationSec: number | undefined, fps: number, fail: Fail) {
  const duration = s.durationSec as number;
  if (s.media !== undefined) {
    if (s.projection !== undefined) fail(`${path}.media`, 'media clips are screen-space; projected scenes do not support them');
    if (!Array.isArray(s.media) || s.media.length === 0) fail(`${path}.media`, 'expected a non-empty array');
    (s.media as unknown[]).forEach((raw, j) => {
      const mp = `${path}.media[${j}]`;
      if (!record(raw)) fail(mp, 'expected media clip object');
      const clip = raw as Record<string, unknown>;
      if (!(mediaKinds as readonly string[]).includes(String(clip.kind))) fail(`${mp}.kind`, 'expected video or image');
      if (!validSrc(clip.src)) fail(`${mp}.src`, 'expected a public/ path or http(s) URL');
      checkSeconds(clip.startSec, `${mp}.startSec`, fail);
      if (clip.startSec !== undefined && (clip.startSec as number) >= duration) fail(`${mp}.startSec`, 'must fall inside scene');
      if (clip.endSec !== undefined && (!finite(clip.endSec) || clip.endSec <= ((clip.startSec as number | undefined) ?? 0) || clip.endSec > duration)) fail(`${mp}.endSec`, 'must follow startSec and stay within scene');
      if (clip.fit !== undefined && !['cover', 'contain'].includes(String(clip.fit))) fail(`${mp}.fit`, 'expected cover or contain');
      if (clip.layer !== undefined && !['back', 'front'].includes(String(clip.layer))) fail(`${mp}.layer`, 'expected back or front');
      checkUnit(clip.opacity, `${mp}.opacity`, fail);
      for (const key of ['trimStartSec', 'playbackRate', 'volume']) {
        if (clip[key] !== undefined && clip.kind !== 'video') fail(`${mp}.${key}`, 'only video clips support this field');
      }
      checkSeconds(clip.trimStartSec, `${mp}.trimStartSec`, fail);
      if (clip.playbackRate !== undefined && (!finite(clip.playbackRate) || clip.playbackRate <= 0 || clip.playbackRate > 4)) fail(`${mp}.playbackRate`, 'expected a rate above 0 and up to 4');
      checkUnit(clip.volume, `${mp}.volume`, fail);
      if (clip.box !== undefined) {
        if (!record(clip.box)) fail(`${mp}.box`, 'expected {x, y, width, height} fractions of the frame');
        const box = clip.box as Record<string, unknown>;
        for (const key of ['x', 'y', 'width', 'height']) checkUnit(box[key], `${mp}.box.${key}`, fail);
        for (const key of ['x', 'y', 'width', 'height']) if (box[key] === undefined) fail(`${mp}.box.${key}`, 'required');
        if ((box.width as number) <= 0 || (box.height as number) <= 0) fail(`${mp}.box`, 'width and height must be positive');
      }
    });
  }
  if (s.sfx !== undefined) {
    if (!Array.isArray(s.sfx)) fail(`${path}.sfx`, 'expected an array');
    (s.sfx as unknown[]).forEach((raw, j) => {
      const cp = `${path}.sfx[${j}]`;
      if (!record(raw)) fail(cp, 'expected sound cue object');
      const cue = raw as Record<string, unknown>;
      if (!validSrc(cue.src)) fail(`${cp}.src`, 'expected a public/ path or http(s) URL');
      if (!finite(cue.atSec) || cue.atSec < 0 || cue.atSec >= duration) fail(`${cp}.atSec`, 'must fall inside scene');
      checkUnit(cue.volume, `${cp}.volume`, fail);
      checkSeconds(cue.trimStartSec, `${cp}.trimStartSec`, fail);
      if (cue.durationSec !== undefined && (!finite(cue.durationSec) || cue.durationSec <= 0)) fail(`${cp}.durationSec`, 'must be positive');
    });
  }
  if (s.transitionIn !== undefined) {
    const tp = `${path}.transitionIn`;
    if (index === 0) fail(tp, 'the first scene has no previous scene to transition from');
    if (!record(s.transitionIn)) fail(tp, 'expected transition object');
    const t = s.transitionIn as Record<string, unknown>;
    if (!(transitionTypes as readonly string[]).includes(String(t.type))) fail(`${tp}.type`, 'expected fade, slide or wipe');
    if (!finite(t.frames) || !Number.isInteger(t.frames) || t.frames < 1) fail(`${tp}.frames`, 'expected a positive integer frame count');
    if (previousDurationSec !== undefined && (t.frames as number) >= Math.round(previousDurationSec * fps)) fail(`${tp}.frames`, 'must fit inside the previous scene');
    if (t.direction !== undefined && !(transitionDirections as readonly string[]).includes(String(t.direction))) fail(`${tp}.direction`, 'expected left, right, up or down');
    if (t.direction !== undefined && t.type === 'fade') fail(`${tp}.direction`, 'fade has no direction');
  }
}

/** Video-level audio tracks, caption style and chrome; validated with each registered video. */
export function validateVideoStyle(video: {audio?: unknown; captionStyle?: unknown; chrome?: unknown; loopBlendFrames?: unknown}, label: string) {
  const fail = (path: string, message: string): never => {throw new Error(`Video ${label} ${path}: ${message}`);};
  if (video.audio !== undefined) {
    if (!Array.isArray(video.audio)) fail('audio', 'expected an array of tracks');
    (video.audio as unknown[]).forEach((raw, i) => {
      const ap = `audio[${i}]`;
      if (!record(raw)) fail(ap, 'expected audio track object');
      const track = raw as Record<string, unknown>;
      if (!validSrc(track.src)) fail(`${ap}.src`, 'expected a public/ path or http(s) URL');
      for (const key of ['startSec', 'trimStartSec', 'fadeInSec', 'fadeOutSec']) checkSeconds(track[key], `${ap}.${key}`, fail);
      if (track.endSec !== undefined && (!finite(track.endSec) || track.endSec <= ((track.startSec as number | undefined) ?? 0))) fail(`${ap}.endSec`, 'must follow startSec');
      checkUnit(track.volume, `${ap}.volume`, fail);
      checkUnit(track.duckUnderNarration, `${ap}.duckUnderNarration`, fail);
      if (track.loop !== undefined && typeof track.loop !== 'boolean') fail(`${ap}.loop`, 'expected boolean');
    });
  }
  if (video.captionStyle !== undefined) {
    if (!record(video.captionStyle)) fail('captionStyle', 'expected object');
    const style = video.captionStyle as Record<string, unknown>;
    if (style.preset !== undefined && !(captionPresets as readonly string[]).includes(String(style.preset))) fail('captionStyle.preset', 'expected outline, box or none');
    if (style.position !== undefined && !(captionPositions as readonly string[]).includes(String(style.position))) fail('captionStyle.position', 'expected bottom, middle, top or lower');
    if (style.bottomEdgeY !== undefined && (!finite(style.bottomEdgeY) || style.bottomEdgeY < 0 || style.bottomEdgeY > 4320)) fail('captionStyle.bottomEdgeY', 'expected a composition y in px, 0 to 4320');

    if (style.color !== undefined && typeof style.color !== 'string') fail('captionStyle.color', 'expected CSS color text');
    if (style.scale !== undefined && (!finite(style.scale) || style.scale < 0.5 || style.scale > 2)) fail('captionStyle.scale', 'expected 0.5 to 2');
  }
  if (video.loopBlendFrames !== undefined && (!finite(video.loopBlendFrames) || !Number.isInteger(video.loopBlendFrames) || video.loopBlendFrames < 0)) fail('loopBlendFrames', 'expected a non-negative integer frame count');
  if (video.chrome !== undefined) {
    if (!record(video.chrome)) fail('chrome', 'expected object');
    const chrome = video.chrome as Record<string, unknown>;
    if (chrome.channelLabel !== undefined && chrome.channelLabel !== false && typeof chrome.channelLabel !== 'string') fail('chrome.channelLabel', 'expected text or false');
    if (chrome.progressBar !== undefined && typeof chrome.progressBar !== 'boolean') fail('chrome.progressBar', 'expected boolean');
  }
}

export const resolveSrc = (src: string, staticFile: (path: string) => string) => /^https?:\/\//.test(src) ? src : staticFile(src);

/**
 * Gain for a track ducked under narration at a narration-clock frame. The envelope takes the loudest
 * amplitude within ±window frames so the duck engages just before speech and releases after it.
 */
export function duckGainAt(amplitude: readonly number[], narrationFrame: number, duck: number, window = 8, speechLevel = 0.08) {
  if (duck >= 1 || amplitude.length === 0) return 1;
  const center = Math.round(narrationFrame);
  let peak = 0;
  for (let f = center - window; f <= center + window; f++) if (f >= 0 && f < amplitude.length) peak = Math.max(peak, amplitude[f]);
  return 1 - (1 - duck) * clamp01(peak / speechLevel);
}

/** Fade-in/out envelope of a track at a frame relative to the track start. */
export function trackFadeAt(track: Pick<AudioTrack, 'fadeInSec' | 'fadeOutSec'>, localFrame: number, lengthFrames: number, fps: number) {
  const fadeIn = Math.round((track.fadeInSec ?? 0) * fps);
  const fadeOut = Math.round((track.fadeOutSec ?? 0) * fps);
  const inGain = fadeIn > 0 ? clamp01(localFrame / fadeIn) : 1;
  const outGain = fadeOut > 0 ? clamp01((lengthFrames - 1 - localFrame) / fadeOut) : 1;
  return Math.min(inGain, outGain);
}

const easeInOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** CSS for the incoming scene while it enters over the outgoing one; empty once the transition finishes. */
export function entryTransitionStyle(transition: SceneTransition, frame: number): {opacity?: number; transform?: string; clipPath?: string} {
  if (frame >= transition.frames) return {};
  const p = easeInOut(clamp01(frame / transition.frames));
  const direction = transition.direction ?? 'left';
  if (transition.type === 'fade') return {opacity: p};
  const rest = (1 - p) * 100;
  if (transition.type === 'slide') {
    const offset = {left: `translateX(${rest}%)`, right: `translateX(${-rest}%)`, up: `translateY(${rest}%)`, down: `translateY(${-rest}%)`}[direction];
    return {transform: offset};
  }
  const inset = {left: `inset(0 0 0 ${rest}%)`, right: `inset(0 ${rest}% 0 0)`, up: `inset(${rest}% 0 0 0)`, down: `inset(0 0 ${rest}% 0)`}[direction];
  return {clipPath: inset};
}

export const clipVisibleAt = (clip: Pick<MediaClip, 'startSec' | 'endSec'>, frame: number, fps: number) =>
  frame >= Math.round((clip.startSec ?? 0) * fps) && (clip.endSec === undefined || frame < Math.round(clip.endSec * fps));

export const defaultCaptionStyle: Required<Omit<CaptionStyle, 'color' | 'bottomEdgeY'>> & {color: string; bottomEdgeY?: number} = {preset: 'outline', position: 'bottom', color: '#fff', scale: 1};
export const defaultChrome: Required<ChromeStyle> = {channelLabel: 'ทำไมล่ะ', progressBar: true};
