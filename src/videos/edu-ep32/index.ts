import {assemblePaintedTimeline} from '../../scenes/assemble';
import {SH03_SUN} from '../../painted/shots/edu32';
import {BRIDGE} from '../../painted/edu32/bridge';
import type {PaintedShotCue} from '../../scenes/types';
import type {EpisodeVideos} from '../types';
import {edu32CaptionEvents} from './captions32';
import {DURATION, EDU32_SHOTS, FPS} from './shots32';

/**
 * EDU-EP32-SHORT (CIA "Acoustic Kitty", the spy cat that ignores us) W5.3 Draft timeline, pass 1 (Editor, 21 Nov 2026): timed scene sheet EDU-EP32-SHEET-R1
 * (scripts/edu-series/ep32/short/timed-sheet.md) + rows EDU-EP32-ROWS-R4, 19 shots = 19 scenes on G0-1688 (1689 f at 30 fps, 56.30 s), script EDU-EP32-SCRIPT-R1,
 * voice EDU-EP32-VOICE-R2 (Kore x1.00 + AGENT Algenib, store projects/edu/EDU/narration/ep32-voice-r2/ = public/narration/EDU-EP32-SHORT-narration-v1.wav, offset 0).
 * Plates `EDU32-<shot id>` (src/painted/shots/edu32.tsx, frame counts src/painted/edu32/*, checked against the sheet below); every cut is a hard cut, no pre-roll. The two
 * dissolves are inside a shot, as the plates define them: B03-SH01 paper PA -> real PB over F24-F40 (the bridge) and B03-SH03 overcast O -> sun S from L18 over 16 f.
 * Captions = ./captions32.ts (54 cards, drawn by overlay `edu32` = ./chrome.tsx at 71 px with the EP26 pop-in; the timeline captions are data only, preset none), with a
 * per-shot `CaptionShade` (strength table in ./shots32.ts) and the channel mark `@TamMaiLa` on the whole clip; the story label under it G0-G89, fade G90-G97 (Q2; Q6 no tag).
 * Ending: closed. The 38 f stamp insert B06-SH03 (G1651-1688) is the last picture (Q8, Q9); no picture fade, no extra series ending sound (channels/edu/channel.md UT15: Film's
 * ending tag M7 from the cue sheet, plays G1647-G1676).
 * Sound: the stem `audio/edu/EDU-EP32-SHORT-draft-stem-v1.wav` is baked from scripts/edu-series/ep32/sound-cues.json (51 cues) by scripts/edu-series/ep32/short/sound-mix.py
 * and plays as the `audio` track beside the narration.
 */
if (DURATION !== 1689 || EDU32_SHOTS.length !== 19) throw new Error(`EDU-EP32-SHORT: shot table has ${EDU32_SHOTS.length} shots / ${DURATION} f, the sheet says 19 / 1689`);
EDU32_SHOTS.forEach((s, i) => {
  if (s.N !== s.len) throw new Error(`EDU-EP32-SHORT ${s.id}: plate has ${s.N} f, the sheet gives ${s.len}`);
  if (s.start !== (i ? EDU32_SHOTS[i - 1].start + EDU32_SHOTS[i - 1].len : 0)) throw new Error(`EDU-EP32-SHORT ${s.id}: not contiguous`);
});
if (EDU32_SHOTS.at(-1)!.start + EDU32_SHOTS.at(-1)!.len !== DURATION) throw new Error('EDU-EP32-SHORT: shots do not end at 1689');

const cuts = EDU32_SHOTS.map((s) => ({id: s.id, start: s.start, end: s.start + s.len}));
type Cue = {at: number; cue: Omit<PaintedShotCue, 'atSec'>};
const plate = (id: string) => `EDU32-${id}`;
const sec = (f: number) => f / FPS;
const shots: Cue[] = EDU32_SHOTS.flatMap((s): Cue[] => {
  if (s.id === 'B03-SH01') return [
    {at: s.start, cue: {shot: plate('B03-SH01-PA')}},
    {at: s.start + BRIDGE.fadeFrom, cue: {shot: plate('B03-SH01-PB'), fromSec: sec(BRIDGE.fadeFrom), dissolveSec: sec(BRIDGE.fadeTo - BRIDGE.fadeFrom)}},
  ];
  if (s.id === 'B03-SH03') return [
    {at: s.start, cue: {shot: plate('B03-SH03-O')}},
    {at: s.start + SH03_SUN.from, cue: {shot: plate('B03-SH03-S'), fromSec: sec(SH03_SUN.from), dissolveSec: sec(SH03_SUN.frames)}},
  ];
  return [{at: s.start, cue: {shot: plate(s.id)}}];
});
const timeline = assemblePaintedTimeline({clockRate: FPS, precision: 4, cuts, shots, captions: edu32CaptionEvents(cuts.map((c) => c.start))});
/** The same shots with the shade only (overlay props: no caption text, no mark) and no sound: `caption-zone.py` measures the shaded plate band on the finished cuts, bridge crossfade included. Not delivered. */
const barePlates = assemblePaintedTimeline({clockRate: FPS, precision: 4, cuts, shots, captions: edu32CaptionEvents(cuts.map((c) => c.start))});

const videos: EpisodeVideos = {
  episode: 'edu-ep32',
  videos: [
    {id: 'EDU-EP32-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
      narration: {src: 'narration/EDU-EP32-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
      audio: [{src: 'audio/edu/EDU-EP32-SHORT-draft-stem-v1.wav', volume: 1}],
      overlay: 'edu32', captionStyle: {preset: 'none'},
      chrome: {channelLabel: false, progressBar: false}},
    {id: 'EDU32-SHORT-PLATES', format: 'short', timeline: barePlates, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
      overlay: 'edu32', overlayProps: {text: false, mark: false}, captionStyle: {preset: 'none'}, chrome: {channelLabel: false, progressBar: false}},
  ],
};
export default videos;
