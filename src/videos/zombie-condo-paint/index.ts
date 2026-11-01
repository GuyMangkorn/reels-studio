import linesTH from '../../../scripts/zombie-condo-paint/short/ZCPAINT-SHORT-TH.lines.json';
import linesEN from '../../../scripts/zombie-condo-paint/short/ZCPAINT-SHORT-EN.lines.json';
import cuesTHJson from '../../../scripts/zombie-condo-paint/short/cues-TH.json';
import cuesENJson from '../../../scripts/zombie-condo-paint/short/cues-EN.json';
import ampTH from '../../../scripts/zombie-condo-paint/short/ZCPAINT-SHORT-TH.amplitude.json';
import ampEN from '../../../scripts/zombie-condo-paint/short/ZCPAINT-SHORT-EN.amplitude.json';
import {poundJoltFrames, type Lang} from '../../painted/zcpaint/jolts';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {AudioTrack, QuadText, Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * ZCPAINT-SHORT (Full tier, painted 2D plates `src/painted/shots/zcpaint.tsx`), Editor pass 1 (30 Oct 2026).
 * One scene per story beat (B01-B10, the shipwreck convention). Inputs, one source each:
 * - `scripts/zombie-condo-paint/short/vo-<LANG>.json`: VO lines (TTS text, beat, anchor, caption override). The
 *   measured onsets and speech ends come from `ZCPAINT-SHORT-<LANG>.lines.json`, written by `place-narration.py`.
 * - `cues-<LANG>.json`: beat starts, plate IDs with per-language `fromSec`, sound events and beds (composition clock).
 * - B02 pound blows: `poundJoltFrames(lang)` from `src/painted/zcpaint/jolts.ts` (one fist blow per jolt; the first is the slam).
 * Captions: outline preset, VO wording (script ซับ chunks for TH). TH: `captionStyle.bottomEdgeY` 1248 (S-09 c, Boss pass 19); EN stays `middle` (parked). Chrome off (ZC record).
 * Render painted compositions with `--gl=angle`. TH narration: Gemini Kore +5% with the B09 call (Enceladus take 3, a single
 * track; candidate swapped 31 Oct 2026, SS-R1.7). EN narration is still the en-US-GuyNeural stand-in (EN parked). Sound: see
 * the sound notes in build-notes "Editor pass 1 (R2.6)" and "Editor pass 3 (TH, SS-R1.7)".
 */
const FPS = 30;
const round3 = (sec: number) => Math.round(sec * 1000) / 1000;

type Line = {id: string; beat: string; text: string; caption: string | null; onsetSec: number; speechEndSec: number};
type CueSheet = {
  durationSec: number;
  beats: {beat: string; startSec: number; shots: {shot: string; atSec: number; fromSec?: number}[]}[];
  sfx: {src: string; atSec: number; volume?: number; trimStartSec?: number; durationSec?: number}[];
  audio: AudioTrack[];
  /** Screen-space text (S-08 fallback): a static quad over `box` [x, y, w, h] from startSec to endSec. */
  overlays?: {text: string; box: number[]; startSec: number; endSec: number; fontSize: number; color?: string; enterFrames?: number}[];
};

/**
 * Captions for one beat: the caption text at each caption line's onset, and a blank cue after speech when the next line is far.
 * A line whose measured onset falls a fraction of a frame before its beat's first frame (TH-11, 19.318 s vs B04 at 19.333 s,
 * SS-R1.7) starts the caption at the beat's first frame, so cues never go negative.
 */
const captionsFor = (lines: Line[], beat: string, start: number, end: number): {at: number; text: string}[] => {
  const mine = lines.filter((l) => l.beat === beat);
  const cues: {at: number; text: string}[] = [];
  mine.forEach((line, i) => {
    if (line.caption === null) return;
    // Retain unrounded onsets until scene ownership is resolved; rounding here can move a cue across the next cut.
    cues.push({at: Math.max(start, line.onsetSec), text: line.caption});
    const next = mine[i + 1]?.onsetSec ?? end;
    if (next - line.speechEndSec > 0.35 && line.speechEndSec + 0.1 < end) cues.push({at: line.speechEndSec + 0.1, text: ''});
  });
  if (cues.some(cue => cue.at < start || cue.at >= end)) throw new Error(`${beat}: caption onset is outside its authored beat`);
  if (cues.length === 0 || round3(cues[0].at - start) > 0) cues.unshift({at: start, text: ''});
  return cues.filter((c, i) => i === 0 || round3(c.at - start) > round3(cues[i - 1].at - start));
};

/** Fist blows on the B02 pound jolts (the first jolt is the slam, already a door-slam cue) plus the hold blows until the power cut. */
const poundBlows = (lang: Lang, whoompSec: number): number[] => {
  const jolts = poundJoltFrames(lang).map((f) => f / FPS).slice(1);
  const blows = [...jolts];
  const last = jolts.length ? jolts[jolts.length - 1] : whoompSec;
  for (let k = 1; last + 0.45 * k < whoompSec - 0.8; k++) blows.push(last + 0.45 * k);
  return blows;
};

export const buildTimeline = (lang: Lang, lines: Line[], cues: CueSheet): {timeline: Timeline; audio: AudioTrack[]} => {
  const whoomp = cues.sfx.find((e) => e.src.includes('power-cut-whoomp'))?.atSec ?? 0;
  const blows = poundBlows(lang, whoomp).map((sec) => ({src: 'sfx/foley/foley_fist-blow-door_01.wav', atSec: round3(sec), volume: 0.35}));
  const cuts = cues.beats.map((beat, i) => ({id: beat.beat, start: beat.startSec, end: i + 1 < cues.beats.length ? cues.beats[i + 1].startSec : cues.durationSec}));
  const timeline = assemblePaintedTimeline({
    clockRate: 1, precision: 3, cuts,
    shots: cues.beats.flatMap(beat => beat.shots.map(s => ({at: s.atSec, cue: {shot: s.shot, ...(s.fromSec !== undefined ? {fromSec: s.fromSec} : {})}}))),
    captions: cuts.flatMap(cut => captionsFor(lines, cut.id, cut.start, cut.end)),
    sounds: [...cues.sfx, ...blows].map(({atSec, ...cue}) => ({at: atSec, cue})),
  }).map((scene, i) => {
    const {start, end} = cuts[i];
    const quadTexts: QuadText[] = (cues.overlays ?? []).filter((o) => o.startSec >= start && o.startSec < end).map((o) => {
      const [x, y, w, h] = o.box;
      return {
        text: o.text, quads: [[[x, y], [x + w, y], [x + w, y + h], [x, y + h]]], box: {width: w, height: h}, fontSize: o.fontSize,
        fontWeight: 700, color: o.color ?? '#2a2633', ...(o.enterFrames ? {enterFrames: o.enterFrames} : {}),
        startFrame: Math.round((o.startSec - start) * FPS), endFrame: Math.round((Math.min(o.endSec, end) - start) * FPS),
      };
    });
    return {...scene, ...(quadTexts.length ? {quadTexts} : {})};
  });
  const total = timeline.reduce((sum, s) => sum + s.durationSec, 0);
  if (Math.abs(total - cues.durationSec) > 0.01) throw new Error(`ZCPAINT ${lang}: beats sum to ${total}, cue sheet says ${cues.durationSec}`);
  return {timeline, audio: cues.audio};
};

const th = buildTimeline('TH', linesTH as Line[], cuesTHJson as CueSheet);
const en = buildTimeline('EN', linesEN as Line[], cuesENJson as CueSheet);

const zombieCondoPaint: EpisodeVideos = {
  episode: 'zombie-condo-paint',
  videos: [
    {
      id: 'ZCPAINT-SHORT-TH', format: 'short', timeline: th.timeline, ending: 'A_fade', audio: th.audio,
      captionStyle: {preset: 'outline', position: 'bottom', bottomEdgeY: 1248}, chrome: {channelLabel: false, progressBar: false},
      narration: {src: 'narration/ZCPAINT-SHORT-TH.mp3', amplitude: ampTH, fps: FPS},
    },
    {
      id: 'ZCPAINT-SHORT-EN', format: 'short', timeline: en.timeline, ending: 'A_fade', audio: en.audio,
      captionStyle: {preset: 'outline', position: 'middle'}, chrome: {channelLabel: false, progressBar: false},
      narration: {src: 'narration/ZCPAINT-SHORT-EN.mp3', amplitude: ampEN, fps: FPS},
    },
  ],
};
export default zombieCondoPaint;
