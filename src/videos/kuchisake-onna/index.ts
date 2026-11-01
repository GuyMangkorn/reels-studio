import narrationAmplitude from '../../../scripts/kuchisake-onna/short/KSO-EP01-SHORT.amplitude.json';
import captionCues from '../../../scripts/kuchisake-onna/short/captions.json';
import {KSO_SHOT_INDEX} from '../../painted/shots/kuchisake';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {AudioTrack, Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * KSO-EP01-SHORT (script KSO-SCRIPT-R4, Film brief KSO-BRIEF-FILM-R2.2, storyboard SB-R2.2 with 26 shots, voice lock v3:
 * NARR Erinome, WOMAN Despina, 2461 frames = 82.03 s). Light tier, profile kso-horror, painted 2D with project-default SVG
 * captions. Picture: `src/painted/shots/kuchisake.tsx` (`KSO_SHOT_INDEX`, plates `KSO-<shot ID>`); one timeline scene per shot
 * (hard cuts, no in-canvas dissolve), so each shot is one render segment and one pin.
 *
 * Two compositions, one source. The duration of a composition comes from its timeline (`Root.tsx`), not from the ending
 * prop, so B_loop (2461 + 90 f hold = 2551 f) cannot be made from the 2461 f timeline by `--endings`. Both timelines come
 * from `buildTimeline`: they share every shot, caption and cue; B_loop only extends the last shot by the 90 f hold.
 *   - `KSO-EP01-SHORT-C` : C_seamless, 2461 f (primary; the last 15 f blend into frame 0; no hold, no fade).
 *   - `KSO-EP01-SHORT-B` : B_loop, 2551 f (the closing caption stays up through the hold, picture frozen by the shared ending).
 *
 * Narration: one approved track (`narration/KSO-EP01-SHORT.mp3`, locked with `store.py use`) shared by both compositions.
 * Library sounds: `public/audio/**` and `public/sfx/**` copies locked in `assets.lock.json` (see `edit-plan.md`).
 * Frame numbers below are composition-global and end-exclusive. Render with `--gl=angle --timeout=180000`.
 */
const FPS = 30;
const MARKER = 'เรื่องแต่ง • จากตำนานญี่ปุ่น';
const SHORT_END = KSO_SHOT_INDEX.at(-1)!.end;
const HOLD_FRAMES = 90;
const sec = (frame: number) => frame / FPS;

type Sfx = {at: number; src: string; volume: number; durationSec?: number};

/** One-shot sounds on the composition clock (mounted by the renderer, never cut at a shot boundary). */
const SFX: Sfx[] = [
  // S02-B01-SH01 narrator's steps (dry walk file, two copies: 756-869 full, 869-899 stop) and the follower's heel clicks,
  // half a beat late, stopping one step after the narrator (heel click, 16 f pitch).
  {at: 756, src: 'sfx/foley/foley_walk-sneakers-asphalt_01.wav', volume: 0.22},
  {at: 869, src: 'sfx/foley/foley_walk-sneakers-asphalt_01.wav', volume: 0.22, durationSec: 1},
  ...[764, 780, 796, 812, 828, 844, 860, 876, 892].map((at) => ({at, src: 'sfx/foley/foley_heel-click-asphalt_01.wav', volume: 0.18})),
  // S02-B01-SH04 riser ends dead at the woman's first lit frame (951 + 3.69 s = 1062); streetlight flicker buzz from 1030.
  {at: 951, src: 'sfx/reveal/reveal_riser-tension_01.wav', volume: 0.18},
  {at: 1030, src: 'sfx/electric/electric_light-flicker-buzz_01.wav', volume: 0.10, durationSec: 5},
  // S02-B02-SH03 one heel click on the tighter frame (cut at 1346).
  {at: 1346, src: 'sfx/foley/foley_heel-click-asphalt_01.wav', volume: 0.30},
  // S02-B03-SH03 the one stinger on the first frame of the mouth tear (1554; tail runs into SH04 on the composition clock).
  {at: 1554, src: 'sfx/stinger/stinger_horror-screech_01.wav', volume: 0.55},
  // S02-B03-SH05 heartbeat under the question from 1700, stops dead at 1852 (end of ก็… ธรรมดา).
  {at: 1700, src: 'sfx/tension/tension_heartbeat-slow_01.wav', volume: 0.20, durationSec: 152 / FPS},
  // S03-B01-SH02 run, door slam, deadbolt (the library run file is an infected corridor: the generated dry run is used).
  {at: 1925, src: 'sfx/foley/foley_run-sneakers-asphalt_01.wav', volume: 0.25},
  {at: 1994, src: 'sfx/impact/impact_door-slam-body_01.wav', volume: 0.35},
  {at: 2003, src: 'sfx/foley/foley_deadbolt-clack_01.wav', volume: 0.30},
];

const LAMP = 'audio/electric/electric_streetlamp-hum-loop_01.wav';
const IZAKAYA_HUM = 'audio/room/room_shop-fridge-hum_01.wav';
const DARK_ROOM = 'audio/room/room_dark-empty-building_01.wav';
const DRONE = 'audio/tension/tension_drone-sparse-piano_01.wav';
/** Music and ambience on the composition clock (level plan and mix intent: edit-plan.md, EP08a). */
const AUDIO: AudioTrack[] = [
  // Street hum (also the seam bed): from frame 0 (hook), back on the street from the walk, and again at the seamless return.
  {src: LAMP, startSec: 0, endSec: sec(195), volume: 0.10, fadeInSec: 0.2, loop: true, duckUnderNarration: 0.5},
  {src: LAMP, startSec: sec(756), endSec: sec(1518), volume: 0.10, fadeInSec: 0.5, fadeOutSec: 0.05, loop: true, duckUnderNarration: 0.5},
  // S02-B03 drop: the bed stops 36 f (1.2 s) before the stinger and returns with the hit (EP08a drop -> hit).
  {src: LAMP, startSec: sec(1554), endSec: sec(1870), volume: 0.10, fadeInSec: 0.05, loop: true, duckUnderNarration: 0.5},
  {src: LAMP, startSec: sec(2388), endSec: sec(SHORT_END + HOLD_FRAMES), volume: 0.10, fadeInSec: 0.5, loop: true, duckUnderNarration: 0.5},
  // Izakaya: small-shop hum and a very low drone under the story (S01-B02, 195-756).
  {src: IZAKAYA_HUM, startSec: sec(195), endSec: sec(756), volume: 0.12, fadeInSec: 0.5, fadeOutSec: 0.3, loop: true, duckUnderNarration: 0.6},
  {src: DRONE, startSec: sec(195), endSec: sec(756), volume: 0.10, fadeInSec: 0.8, fadeOutSec: 0.3, loop: true, duckUnderNarration: 0.35},
  // Narrator's room: room tone and the cold drone returning very low, thinning under the apology.
  {src: DARK_ROOM, startSec: sec(1870), endSec: sec(2388), volume: 0.10, fadeInSec: 0.5, fadeOutSec: 0.5, loop: true, duckUnderNarration: 0.5},
  {src: DRONE, startSec: sec(1900), endSec: sec(2340), volume: 0.07, fadeInSec: 1, fadeOutSec: 1.5, loop: true, duckUnderNarration: 0.35},
];

/** Caption cues from captions.json (Thai verbatim; frames are the cue's onset and end). */
type CaptionCue = {id: string; shot: string; g0: number; g1: number; text: string};
const CUES: CaptionCue[] = captionCues.cues;

/**
 * Caption track for one composition. Each cue starts at g0 and ends at g1 with a blank cue unless it is the last cue of a
 * hold ending (B_loop keeps the closing line up). Every shot starts with a cue: the text carried from the previous cue, a
 * blank, or the caption of the shot's own onset, so each scene is self-contained when seeked to.
 */
const captionTrack = (endFrame: number, holdLast: boolean, cuts: readonly {start: number; end: number}[]) => {
  const at = new Map<number, string>();
  CUES.forEach((cue) => at.set(cue.g0, cue.text));
  CUES.forEach((cue, i) => {
    const last = i === CUES.length - 1;
    if (last && holdLast) return;
    if (!at.has(cue.g1)) at.set(cue.g1, '');
  });
  for (const cut of cuts) {
    if (at.has(cut.start)) continue;
    const before = [...at.keys()].filter((k) => k < cut.start).sort((a, b) => b - a)[0];
    at.set(cut.start, before === undefined ? '' : at.get(before)!);
  }
  return [...at.entries()].filter(([k]) => k < endFrame).sort(([a], [b]) => a - b).map(([k, text]) => ({at: k, text}));
};

/** The shared timeline for one ending; `holdFrames` extends the last shot (B_loop: 90 f). */
const buildTimeline = (holdFrames: number, holdCaption: boolean): Timeline => {
  const endFrame = SHORT_END + holdFrames;
  const cuts = KSO_SHOT_INDEX.map((row, i, all) => ({id: row.id, start: row.start, end: i === all.length - 1 ? endFrame : row.end}));
  const scenes = assemblePaintedTimeline({
    clockRate: FPS,
    cuts,
    captions: captionTrack(endFrame, holdCaption, cuts),
    shots: KSO_SHOT_INDEX.map((row) => ({at: row.start, cue: {shot: row.plate}})),
    sounds: SFX.map(({at, ...cue}) => ({at, cue})),
  });
  // Fiction marker: on screen from frame 0 (the eyebrow of the first shot only, WORLD FOG precedent), top slot, no fade.
  scenes[0] = {...scenes[0], eyebrow: MARKER, eyebrowStyle: {fade: false}};
  return scenes;
};

const narration = {src: 'narration/KSO-EP01-SHORT.mp3', amplitude: narrationAmplitude, fps: FPS};
const captionStyle = {preset: 'outline' as const, position: 'lower' as const};
// VD12 (user, 1 Nov 2026): chrome off except the fiction marker.
const chrome = {channelLabel: false as const, progressBar: false};

const kso: EpisodeVideos = {
  episode: 'kuchisake-onna',
  videos: [
    {
      id: 'KSO-EP01-SHORT-C', format: 'short', timeline: buildTimeline(0, false), ending: 'C_seamless', loopBlendFrames: 15,
      narration, audio: AUDIO, captionStyle, chrome,
    },
    {
      id: 'KSO-EP01-SHORT-B', format: 'short', timeline: buildTimeline(HOLD_FRAMES, true), ending: 'B_loop',
      narration, audio: AUDIO, captionStyle, chrome,
    },
  ],
};
export default kso;
