import narrationAmplitude from '../../../scripts/world-fog/short/WFOG-EP01-SHORT.amplitude.json';
import captionCues from '../../../scripts/world-fog/short/captions.json';
import {SHOT_G0, SHOT_ROWS} from '../../painted/worldfog/space';
import type {AudioTrack, MediaClip, Scene, SceneSoundCue, Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * WFOG-EP01-SHORT (script WFOG-SCRIPT-R5, brief VB-WFOG-EP01-SHORT-R6.1, scene sheets WFOG-EP01-SHORT-SS-R5.1 with RK-2,
 * Full tier). Picture: `src/painted/worldfog/*` (Boss r10; `SHOT_ROWS`, 25 shots, 3766 frames = 125.5 s, hard cut on G3765).
 * Narration: the approved takes (Sulafat narrator, Orus worker; Edge for VO-04 and VO-07) placed per the SS-R5.1 cue table in
 * `scripts/world-fog/short/placement.json` (`narration.py compose`); captions come from the same placement (`captions.json`).
 * Sound: story-keyed cues map from the SS-R4.1 story key with RK-2 (`storyToG`); phone, door and torch cues use shot-local
 * frames. Library files live in `public/audio` and `public/sfx` (copies of the shared sound library; NOTICE beside them);
 * `outdoor_fog-forecourt-hush_glass_01.wav` is a derived low-pass copy of the library hush (lowpass 900 Hz, Editor r4).
 * Caption scrim (Editor r4): one plate per caption height (1 line 180 px, 2 lines 264 px), block bottom at y 1240 (`lower`).
 * Frame numbers below are composition-global (G). Fiction marker `เรื่องสมมติ • EP1` on S01-SH01 only (ST-08).
 * Render with `--gl=angle`.
 */
const FPS = 30;
const MARKER = 'เรื่องสมมติ • EP1';
const sec = (frame: number) => frame / FPS;

/** G of a frame on a shot: `shotG('S02-SH02', 6)` is S02-SH02 f6. */
const shotG = (id: string, f = 0) => {
  const g0 = SHOT_G0[id];
  if (g0 === undefined) throw new Error(`unknown shot ${id}`);
  return g0 + f;
};
const shotEnd = (id: string) => {
  const row = SHOT_ROWS.find((r) => r.id === id);
  if (!row) throw new Error(`unknown shot ${id}`);
  return row.g0 + row.len;
};

/**
 * RK-2 (SS-R5.1, index.md): SS-R4.1 story key Gk -> composition G. Each segment is [gk, g, slope] from its first key.
 * Holds (constant Gk over a stretch of G) map to their first G; story keys that the RK-2 table does not list are unused.
 */
const RK2: [number, number, number][] = [
  [0, 0, 1], [444, 786, 1], [1800, 2142, 1], [1920, 2302, 1], [1962, 2348, 1], [2034, 2448, 1], [2070, 2484, 1],
  [2190, 2700, 1], [2262, 2828, 1], [2340, 2906, 1], [2478, 3044, 296 / 192], [2670, 3340, 1],
];
const storyToG = (gk: number): number => {
  const [gk0, g0, slope] = [...RK2].reverse().find(([k]) => gk >= k) ?? RK2[0];
  return Math.round(g0 + (gk - gk0) * slope);
};

/** One-shot SFX on the composition clock; mounted in the scene that contains `g`. */
type Sfx = {g: number; src: string; volume: number; durationSec?: number};
const CART = 'sfx/foley/foley_cart-wheel-squeak-scrape_01.wav';
const SFX: Sfx[] = [
  // S01 car and forecourt (unchanged): engine idle to stop from f0, door latch G145, steps G209
  {g: shotG('S01-SH01'), src: 'sfx/vehicle/vehicle_car-engine-decel-stop_01.wav', volume: 0.3, durationSec: 5},
  {g: 145, src: 'sfx/foley/foley_car-door-open-close_01.wav', volume: 0.45},
  {g: 209, src: 'sfx/foley/foley_footsteps-wet-concrete_01.wav', volume: 0.3, durationSec: 1},
  // S02-SH02 phone (shot start G630): notification f6, press f22; restrained
  {g: shotG('S02-SH02', 6), src: 'sfx/ui/ui_notification-ding_01.wav', volume: 0.25},
  {g: shotG('S02-SH02', 22), src: 'sfx/ui/ui_pop_01.wav', volume: 0.12},
  {g: storyToG(521), src: CART, volume: 0.1, durationSec: 1.2},
  // S02-SH04 move windows f0, f30 … f180 (sheet); muffled through the glass
  ...[540, 570, 600, 630, 660, 690, 720].map((gk) => ({g: storyToG(gk), src: CART, volume: 0.08, durationSec: 1})),
  // S02-SH05 low glimpse: f12-31 and f42-53
  {g: storyToG(750), src: CART, volume: 0.1, durationSec: 1},
  {g: storyToG(780), src: CART, volume: 0.1, durationSec: 0.4},
  // S02-SH06 ASM-PATH move windows
  ...[810, 840, 870].map((gk) => ({g: storyToG(gk), src: CART, volume: 0.08, durationSec: 1})),
  // S02-SH07 last scrape f0-19, then three umbrella taps (exact); music drops at the third tap
  {g: storyToG(900), src: CART, volume: 0.1, durationSec: 0.6},
  ...[950, 968, 986].map((gk) => ({g: storyToG(gk), src: 'sfx/foley/foley_umbrella-tap-glass_01.wav', volume: 0.45, durationSec: 0.5})),
  // S02-SH09 subjective rise ends dead at the catch; helmet slide and hollow catch
  {g: storyToG(1164), src: 'sfx/reveal/reveal_riser-tension_01.wav', volume: 0.3, durationSec: 3.7},
  {g: storyToG(1253), src: 'sfx/foley/foley_carton-slide-helmet-catch_01.wav', volume: 0.4, durationSec: 2.5},
  // S03-SH02 torch click at f108 (exact)
  {g: storyToG(1761), src: 'sfx/foley/foley_flashlight-click_01.wav', volume: 0.4, durationSec: 0.3},
  // S03-SH06 scrape f6-30 (same file as S02); S03-SH07 door slide and cart push
  {g: storyToG(2040), src: CART, volume: 0.1, durationSec: 0.8},
  {g: storyToG(2258), src: 'sfx/foley/foley_glass-door-push_01.wav', volume: 0.35, durationSec: 1.5},
  {g: storyToG(2286), src: CART, volume: 0.1, durationSec: 2},
  // S04-SH01 shop door closes f12-36 (sheet sc04, same door-slide file); S04-SH02 torch click at f10
  {g: shotG('S04-SH01', 12), src: 'sfx/foley/foley_glass-door-push_01.wav', volume: 0.3, durationSec: 1},
  {g: shotG('S04-SH02', 10), src: 'sfx/foley/foley_flashlight-click_01.wav', volume: 0.35, durationSec: 0.3},
];

const DRONE = 'audio/tension/tension_drone-sparse-piano_01.wav';
/** Music and ambience on the composition clock (see editor-principles EP08a for the level plan). */
const AUDIO: AudioTrack[] = [
  // bed S01 to S02-SH04 with duck; lift before the taps; music drops at the third tap
  {src: DRONE, startSec: sec(0), endSec: sec(storyToG(540)), volume: 0.16, fadeInSec: 0.5, fadeOutSec: 0.3, loop: true, duckUnderNarration: 0.35},
  {src: DRONE, startSec: sec(storyToG(540)), endSec: sec(storyToG(988)), trimStartSec: 18, volume: 0.22, fadeInSec: 0.3, fadeOutSec: 0.25, loop: true, duckUnderNarration: 0.35},
  // drone swell from S01-SH02A (G240): peaks at the glass front (G516, sheet R6 sound direction), holds to the cut
  {src: DRONE, startSec: sec(shotG('S01-SH02A')), endSec: sec(shotEnd('S02-SH00A')), volume: 0.1, fadeInSec: sec(shotG('S02-SH00A', 156) - shotG('S01-SH02A')), fadeOutSec: 0.3, loop: true, duckUnderNarration: 0.35},
  // very low re-entry S02-SH08 to S02-SH09
  {src: DRONE, startSec: sec(storyToG(1047)), endSec: sec(storyToG(1410)), volume: 0.1, fadeInSec: 0.8, fadeOutSec: 0.2, loop: true, duckUnderNarration: 0.35},
  // quiet release from S03-SH03 f30 to the tone at S03-SH06A
  {src: DRONE, startSec: sec(storyToG(1830)), endSec: sec(storyToG(2070)), volume: 0.1, fadeInSec: 1, fadeOutSec: 0.4, loop: true, duckUnderNarration: 0.35},
  // soft sustained tone under the perception line (S03-SH06A to S03-SH07 f84)
  {src: 'audio/tone/tone_soft-sustain-reflective_01.wav', startSec: sec(storyToG(2070)), endSec: sec(shotG('S03-SH07', 84)), volume: 0.12, fadeInSec: 0.4, fadeOutSec: 0.4, duckUnderNarration: 0.4},
  // thinned release until the music out at S04-SH01
  {src: DRONE, startSec: sec(shotG('S03-SH07', 84)), endSec: sec(storyToG(2340)), volume: 0.05, fadeInSec: 0.2, fadeOutSec: 0.3, loop: true},
  // low unresolved bed from S04-SH03 f0 (15-frame fade-in); fades out after the closing line (line ends f254 in SS-R5.1)
  {src: 'audio/bed/bed_dark-drone-sub_01.wav', startSec: sec(shotG('S04-SH03')), endSec: sec(shotG('S04-SH03', 267)), volume: 0.1, fadeInSec: 0.5, fadeOutSec: 0.4, loop: true, duckUnderNarration: 0.5},
  // open-air layer: forecourt hush from S01-SH02 f30 through the wall, dry until the glass (S02-SH00A start)
  {src: 'audio/outdoor/outdoor_fog-forecourt-hush_01.wav', startSec: sec(156), endSec: sec(shotG('S02-SH00A')), volume: 0.22, fadeInSec: 0.8, fadeOutSec: 0.5},
  // through the glass: low-passed, about -12 dB at G360, muffled to silence at f156 of S02-SH00A (G516); no whoosh, no fog SFX
  {src: 'audio/outdoor/outdoor_fog-forecourt-hush_glass_01.wav', startSec: sec(shotG('S02-SH00A')), endSec: sec(shotG('S02-SH00A', 156)), volume: 0.22 * 10 ** (-12 / 20), fadeInSec: 0.2, fadeOutSec: 156 / FPS},
  // shop hum from the glass under the swallow (S02-SH00A start) to the hard cut; alone once the hush is gone
  {src: 'audio/room/room_shop-fridge-hum_01.wav', startSec: sec(shotG('S02-SH00A')), volume: 0.14, fadeInSec: 1, loop: true, duckUnderNarration: 0.6},
];

/**
 * Caption scrim (Editor r4, replaces the fixed 960x260 plate): one feathered dark plate per caption height. The caption block's
 * bottom edge is at y 1240 (`lower`); each plate is the block plus an 8 px core margin and a 40 px feather.
 */
const SCRIM_BY_LINES: Record<number, {src: string; box: {x: number; y: number; width: number; height: number}}> = {
  1: {src: 'scrim/WFOG-caption-scrim-1line-960x180.png', box: {x: 60 / 1080, y: 1108 / 1920, width: 960 / 1080, height: 180 / 1920}},
  2: {src: 'scrim/WFOG-caption-scrim-2line-960x264.png', box: {x: 60 / 1080, y: 1024 / 1920, width: 960 / 1080, height: 264 / 1920}},
};

const scenes = ['S01', 'S02', 'S03', 'S04'] as const;
export const worldFogTimeline: Timeline = scenes.map((scene): Scene => {
  const rows = SHOT_ROWS.filter((r) => r.id.startsWith(`${scene}-`));
  const g0 = rows[0].g0, end = rows[rows.length - 1].g0 + rows[rows.length - 1].len;
  // captions whose first frame is in this scene; blank cues fill the gaps (no plate on a blank)
  const cues = captionCues.cues.filter((c) => c.g0 >= g0 && c.g0 < end).sort((a, b) => a.g0 - b.g0);
  const subtitleCues: {atSec: number; text: string}[] = [];
  let t = g0;
  for (const c of cues) {
    if (c.g0 > t) subtitleCues.push({atSec: sec(t - g0), text: ''});
    subtitleCues.push({atSec: sec(c.g0 - g0), text: c.text});
    t = c.g1;
  }
  if (t < end) subtitleCues.push({atSec: sec(t - g0), text: ''});
  if (!subtitleCues.length || subtitleCues[0].atSec !== 0) subtitleCues.unshift({atSec: 0, text: ''});
  const durationSec = (end - g0) / FPS;
  const media: MediaClip[] = subtitleCues.flatMap((cue, i) => {
    if (cue.text === '') return [];
    const lines = cue.text.split('\n').length;
    const plate = SCRIM_BY_LINES[lines];
    if (!plate) throw new Error(`caption with ${lines} lines has no scrim plate`);
    const endSec = subtitleCues[i + 1]?.atSec ?? durationSec;
    return [{kind: 'image' as const, ...plate, layer: 'front' as const, startSec: cue.atSec, endSec}];
  });
  const sfx: SceneSoundCue[] = SFX.filter((c) => c.g >= g0 && c.g < end).map((c) => ({
    src: c.src, atSec: sec(c.g - g0), volume: c.volume, ...(c.durationSec !== undefined ? {durationSec: c.durationSec} : {}),
  }));
  return {
    durationSec, bg: 'none', actors: [], subtitle: '',
    subtitleCues, media,
    ...(sfx.length ? {sfx} : {}),
    painted: {shots: rows.map((r) => ({shot: `WFOG-${r.id}`, atSec: (r.g0 - g0) / FPS, ...(r.id === 'S01-SH01' ? {label: MARKER} : {})}))},
  };
});

const worldFog: EpisodeVideos = {
  episode: 'world-fog',
  videos: [{
    id: 'WFOG-EP01-SHORT', format: 'short', timeline: worldFogTimeline, ending: 'C_seamless', loopBlendFrames: 0,
    narration: {src: 'narration/WFOG-EP01-SHORT.mp3', amplitude: narrationAmplitude, fps: FPS},
    audio: AUDIO,
    // MK-WF-DEP-08 (user decision 30 Oct, Editor r2): block bottom edge at y 1240 of 1920; the scrim plate follows it.
    captionStyle: {preset: 'outline', position: 'lower'},
  }],
};
export default worldFog;
