import narrationAmplitude from '../../../scripts/world-fog/short/WFOG-EP01-SHORT.amplitude.json';
import captionTimeline from '../../../scripts/world-fog/short/captions.json';
import {SHOT_ROWS} from '../../painted/worldfog/space';
import type {AudioTrack, MediaClip, Scene, SceneSoundCue, Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * WFOG-EP01-SHORT (script WFOG-SCRIPT-R5, brief VB-WFOG-EP01-SHORT-R5, scene sheets WFOG-EP01-SHORT-SS-R4.1, Full tier).
 * Painted 2D plates (`src/painted/shots/worldfog.tsx`) on the SS-R4 global ranges (23 shots, 3000 frames, hard cut on G2999).
 * Editor r1 (30 Oct 2026): narration from `scripts/world-fog/narration.py` (16 lines, Premwadee narrator, Niwat worker,
 * female shop worker and elderly occupant presets), captions and the per-line timing in `scripts/world-fog/short/captions.json`,
 * music/ambience/SFX from the shared sound library (IDs in the file names; NOTICE beside them). Frame numbers below are
 * composition-global (G); each cue is written from the sheet's event frame minus the measured onset of its sound file.
 * Fiction marker `เรื่องสมมติ • EP1` on S01-SH01 only (ST-08). Render with `--gl=angle`.
 */
const FPS = 30;
const MARKER = 'เรื่องสมมติ • EP1';
const sec = (frame: number) => frame / FPS;

/** One-shot SFX on the composition clock; mounted in the scene that contains `g`. */
type Sfx = {g: number; src: string; volume: number; durationSec?: number};
const SFX: Sfx[] = [
  // S01 car and forecourt: engine idle to stop (f0 of S01-SH01, continues across the cut), door latch f42 and close, steps f84
  {g: 0, src: 'sfx/vehicle/vehicle_car-engine-decel-stop_01.wav', volume: 0.3, durationSec: 5},
  {g: 145, src: 'sfx/foley/foley_car-door-open-close_01.wav', volume: 0.45},
  {g: 209, src: 'sfx/foley/foley_footsteps-wet-concrete_01.wav', volume: 0.3, durationSec: 1},
  // S02 shop: phone notification f6 and press f22 (restrained), faint squeak f84 through the glass
  {g: 360, src: 'sfx/ui/ui_notification-ding_01.wav', volume: 0.25},
  {g: 376, src: 'sfx/ui/ui_pop_01.wav', volume: 0.12},
  {g: 521, src: 'sfx/foley/foley_cart-wheel-squeak-scrape_01.wav', volume: 0.1, durationSec: 1.2},
  // S02-SH04 move windows f0, f30 … f180 (sheet); muffled through the glass
  ...[540, 570, 600, 630, 660, 690, 720].map((g) => ({g, src: 'sfx/foley/foley_cart-wheel-squeak-scrape_01.wav', volume: 0.08, durationSec: 1})),
  // S02-SH05 low glimpse: f12-31 and f42-53
  {g: 750, src: 'sfx/foley/foley_cart-wheel-squeak-scrape_01.wav', volume: 0.1, durationSec: 1},
  {g: 780, src: 'sfx/foley/foley_cart-wheel-squeak-scrape_01.wav', volume: 0.1, durationSec: 0.4},
  // S02-SH06 ASM-PATH move windows G810, G840, G870
  ...[810, 840, 870].map((g) => ({g, src: 'sfx/foley/foley_cart-wheel-squeak-scrape_01.wav', volume: 0.08, durationSec: 1})),
  // S02-SH07 last scrape f0-19, then three umbrella taps on f51, f69, f87 (exact); music drops at G988
  {g: 900, src: 'sfx/foley/foley_cart-wheel-squeak-scrape_01.wav', volume: 0.1, durationSec: 0.6},
  ...[950, 968, 986].map((g) => ({g, src: 'sfx/foley/foley_umbrella-tap-glass_01.wav', volume: 0.45, durationSec: 0.5})),
  // S02-SH09 subjective rise ends dead at G1275; helmet slide f24 and hollow catch f45 (G1275)
  {g: 1164, src: 'sfx/reveal/reveal_riser-tension_01.wav', volume: 0.3, durationSec: 3.7},
  {g: 1253, src: 'sfx/foley/foley_carton-slide-helmet-catch_01.wav', volume: 0.4, durationSec: 2.5},
  // S03-SH02 torch click at f108 (exact)
  {g: 1761, src: 'sfx/foley/foley_flashlight-click_01.wav', volume: 0.4, durationSec: 0.3},
  // S03-SH06 scrape f6-30 (same file as S02); S03-SH07 door slide f72-102 and scrape f96-149
  {g: 2040, src: 'sfx/foley/foley_cart-wheel-squeak-scrape_01.wav', volume: 0.1, durationSec: 0.8},
  {g: 2258, src: 'sfx/foley/foley_glass-door-push_01.wav', volume: 0.35, durationSec: 1.5},
  {g: 2286, src: 'sfx/foley/foley_cart-wheel-squeak-scrape_01.wav', volume: 0.1, durationSec: 2},
  // S04-SH01 shop door closes f12-36; S04-SH02 torch click at f10
  {g: 2348, src: 'sfx/foley/foley_glass-door-push_01.wav', volume: 0.3, durationSec: 1},
  {g: 2677, src: 'sfx/foley/foley_flashlight-click_01.wav', volume: 0.35, durationSec: 0.3},
];

/** Music and ambience on the composition clock (see editor-principles EP08a for the level plan). */
const AUDIO: AudioTrack[] = [
  // bed S01 to S02-B02, lift before the taps; silence G988-G1047 after tap 3 (drop)
  {src: 'audio/tension/tension_drone-sparse-piano_01.wav', startSec: sec(0), endSec: sec(540), volume: 0.16, fadeInSec: 0.5, fadeOutSec: 0.3, loop: true, duckUnderNarration: 0.35},
  {src: 'audio/tension/tension_drone-sparse-piano_01.wav', startSec: sec(540), endSec: sec(988), trimStartSec: 18, volume: 0.22, fadeInSec: 0.3, fadeOutSec: 0.25, loop: true, duckUnderNarration: 0.35},
  // very low re-entry S02-SH08/SH09; no music in S02-SH10 and S03-SH01
  {src: 'audio/tension/tension_drone-sparse-piano_01.wav', startSec: sec(1047), endSec: sec(1410), volume: 0.1, fadeInSec: 0.8, fadeOutSec: 0.2, loop: true, duckUnderNarration: 0.35},
  // quiet release from S03-SH03 f30 to the tone at G2070
  {src: 'audio/tension/tension_drone-sparse-piano_01.wav', startSec: sec(1830), endSec: sec(2070), volume: 0.1, fadeInSec: 1, fadeOutSec: 0.4, loop: true, duckUnderNarration: 0.35},
  // soft sustained tone under the perception line (S03-SH06A to S03-SH07 f84)
  {src: 'audio/tone/tone_soft-sustain-reflective_01.wav', startSec: sec(2070), endSec: sec(2274), volume: 0.12, fadeInSec: 0.4, fadeOutSec: 0.4, duckUnderNarration: 0.4},
  // thinned release until the music out at G2340
  {src: 'audio/tension/tension_drone-sparse-piano_01.wav', startSec: sec(2274), endSec: sec(2340), volume: 0.05, fadeInSec: 0.2, fadeOutSec: 0.3, loop: true},
  // low unresolved bed under the closing line; fades out f159-f171 of S04-SH03
  {src: 'audio/bed/bed_dark-drone-sub_01.wav', startSec: sec(2790), endSec: sec(2961), volume: 0.1, fadeInSec: 0.5, fadeOutSec: 0.4, loop: true, duckUnderNarration: 0.5},
  // forecourt hush S01-SH02 f30 until the shop; shop hum from the shop door to the hard cut (no event sounds)
  {src: 'audio/outdoor/outdoor_fog-forecourt-hush_01.wav', startSec: sec(156), endSec: sec(240), volume: 0.22, fadeInSec: 0.8, fadeOutSec: 0.5},
  {src: 'audio/room/room_shop-fridge-hum_01.wav', startSec: sec(240), volume: 0.14, fadeInSec: 1, loop: true, duckUnderNarration: 0.6},
];

/**
 * Caption scrim (MK-WF-DEP-10 interim): one feathered dark plate behind each caption block, on the caption's own span.
 * Box = the caption block (x 60-1020, y 1020-1280 at 1080x1920, block bottom at y 1240); no grade on the picture outside the block.
 */
const SCRIM = {src: 'scrim/WFOG-caption-scrim-960x260.png', box: {x: 60 / 1080, y: 1020 / 1920, width: 960 / 1080, height: 260 / 1920}};
const captionScrim = (cues: {atSec: number; text: string}[], durationSec: number): MediaClip[] =>
  cues.flatMap((cue, i) => cue.text === '' ? [] : [{kind: 'image' as const, ...SCRIM, layer: 'front' as const, startSec: cue.atSec, endSec: cues[i + 1]?.atSec ?? durationSec}]);

const scenes = ['S01', 'S02', 'S03', 'S04'] as const;
export const worldFogTimeline: Timeline = scenes.map((scene): Scene => {
  const rows = SHOT_ROWS.filter((r) => r.id.startsWith(`${scene}-`));
  const g0 = rows[0].g0, end = rows[rows.length - 1].g0 + rows[rows.length - 1].len;
  const cues = captionTimeline.scenes.find((s) => s.scene === scene);
  const sfx: SceneSoundCue[] = SFX.filter((c) => c.g >= g0 && c.g < end).map((c) => ({
    src: c.src, atSec: sec(c.g - g0), volume: c.volume, ...(c.durationSec !== undefined ? {durationSec: c.durationSec} : {}),
  }));
  return {
    durationSec: (end - g0) / FPS, bg: 'none', actors: [], subtitle: '',
    subtitleCues: cues?.subtitleCues ?? [{atSec: 0, text: ''}],
    media: captionScrim(cues?.subtitleCues ?? [], (end - g0) / FPS),
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
