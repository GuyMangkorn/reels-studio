import lines from '../../../scripts/zombie-condo2/short/ZCPAINT-SHORT-TH.lines.json';
import amplitude from '../../../scripts/zombie-condo2/short/ZCPAINT-SHORT-TH.amplitude.json';
import {zc2PlateId} from '../../painted/shots/zc2';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {AudioTrack, SceneSoundCue} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * ZCONDO2-SHORT-TH (Full tier, painted 2D, kit look), Editor draft assembly W5.3 (4 Nov 2026). Inputs, one source each:
 * - Scene sheet SS-ZC2-R1 (`storyboards/zombie-condo2/short/scene-sheet.md`): shot map (frames), caption cue frames and sound cues, copied into `SHOTS`.
 *   `at` is the sheet's global start frame; the module throws if the shots are not contiguous from 0 or do not sum to 2877 frames.
 * - Plates `ZC2D-<shot>` (`src/painted/shots/zc2.tsx`, from Boss's draft specs): picture, camera, labels and the cue-gated caption shade.
 * - Caption wording: `scripts/zombie-condo2/short/ZCPAINT-SHORT-TH.lines.json` (`caption` of the VO line, script ซับ chunks). Narration: the locked
 *   Kore +5 % read `public/narration/ZCPAINT-SHORT-TH.mp3` (93.151 s) in a 95.9 s timeline; the amplitude file belongs to that read.
 * - Sound: library IDs only (`assets.lock.json`, no new generation). Beds are `AudioTrack`s on the composition clock; one-shots are scene cues; a
 *   one-shot that runs over a cut (riser, footsteps, tap) is a track because a scene cue stops at its scene end.
 * Hard cuts only (sheet). Channel mark @TamMaiLa top-left (project default). Caption bottom edge y 1248 with the per-shot shade band.
 */
const FPS = 30;
const TOTAL = 2877;
const f2s = (f: number) => Math.round((f / FPS) * 1000) / 1000;

const caption = new Map((lines as {id: string; caption: string | null}[]).map((l) => [l.id, l.caption]));
const text = (id: string) => {
  const c = caption.get(id);
  if (!c) throw new Error(`ZCONDO2: VO line ${id} has no caption`);
  return c;
};

type Sfx = [localFrame: number, src: string, opts?: {volume?: number; trimStartSec?: number; durationSec?: number}];
type Shot = {
  id: string; at: number; n: number;
  /** Caption cues `[from, to, lineId]` in shot-local frames; `to` = n keeps the text to the cut. */
  cap: [number, number, string][];
  sfx?: Sfx[];
};
const S = (name: string) => `sfx/${name}.wav`;
const POUND = S('foley/foley_door-pound-wood_01');
const TICK = S('ui/ui_click-tick_01');
const RUSTLE = S('foley/foley_packaging-rustle_01');
const HUM = S('hum/hum_low-travelling-flat_01');
const KNUCKLE = S('impact/impact_knuckle-rap_01');
const LID = {volume: 0.6, trimStartSec: 0.08, durationSec: 0.12};

/** The 30 shots of SS-ZC2-R1 (shot map, "Captions + shade" and "Sound" lines of each shot block). */
const SHOTS: Shot[] = [
  {id: 'ZC2-B01-SH01', at: 0, n: 75, cap: [[0, 73, 'TH-01']], sfx: [[0, S('foley/foley_door-latch-hinge_01'), {volume: 0.6}]]},
  {id: 'ZC2-B01-SH02', at: 75, n: 85, cap: [[5, 78, 'TH-02']]},
  {id: 'ZC2-B01-SH03', at: 160, n: 46, cap: [[10, 40, 'TH-03']], sfx: [[10, S('creature/creature_neck-creak-wet_01'), {volume: 0.5}]]},
  {id: 'ZC2-B02-SH01', at: 206, n: 27, cap: [[11, 27, 'TH-04']], sfx: [[12, S('impact/impact_door-slam-body_01'), {volume: 0.6}], [16, S('foley/foley_bag-drop-tile_01'), {volume: 0.25}]]},
  {id: 'ZC2-B02-SH02', at: 233, n: 27, cap: [[0, 21, 'TH-04']], sfx: [[9, S('foley/foley_deadbolt-clack_01'), {volume: 0.5}]]},
  {id: 'ZC2-B02-SH03', at: 260, n: 45, cap: [[9, 40, 'TH-06']], sfx: [[9, POUND, {volume: 0.6}], [22, S('foley/foley_fist-blow-door_01'), {volume: 0.5}], [31, S('foley/foley_fist-blow-door_01'), {volume: 0.5}], [40, S('foley/foley_fist-blow-door_01'), {volume: 0.5}]]},
  {id: 'ZC2-B02-SH04', at: 305, n: 114, cap: [[8, 40, 'TH-07'], [51, 112, 'TH-08']], sfx: [[5, S('foley/foley_cabinet-scrape-thud_01'), {volume: 0.6}], [37, POUND, {volume: 0.25}]]},
  {id: 'ZC2-B02-SH05', at: 419, n: 92, cap: [[5, 80, 'TH-09']], sfx: [[76, POUND, {volume: 0.3, durationSec: 0.6}]]},
  {id: 'ZC2-B03-SH01', at: 511, n: 57, cap: [[12, 44, 'TH-10']], sfx: [[16, S('impact/impact_power-cut-whoomp_01'), {volume: 0.5}]]},
  {id: 'ZC2-B04-SH01', at: 568, n: 49, cap: [[12, 41, 'TH-11']]},
  {id: 'ZC2-B04-SH02', at: 617, n: 114, cap: [[11, 110, 'TH-12']], sfx: [[49, HUM, {volume: 0.1}]]},
  {id: 'ZC2-B04-SH02b', at: 731, n: 181, cap: [[8, 60, 'TH-13'], [68, 137, 'TH-14'], [143, 181, 'TH-15']]},
  {id: 'ZC2-B04-SH03', at: 912, n: 154, cap: [[4, 142, 'TH-16']], sfx: [[0, S('water/water_tap-fill-containers_01'), {volume: 0.22, durationSec: 5}], [122, S('foley/foley_lid-snaps-three_01'), LID], [126, S('foley/foley_lid-snaps-three_01'), LID], [130, S('foley/foley_lid-snaps-three_01'), LID]]},
  {id: 'ZC2-B05-SH01', at: 1066, n: 85, cap: [[12, 85, 'TH-17']]},
  {id: 'ZC2-B05-SH02', at: 1151, n: 80, cap: [[2, 80, 'TH-18']], sfx: [[38, S('water/water_bucket-pour-gurgle_01'), {volume: 0.7}]]},
  {id: 'ZC2-B05-SH03', at: 1231, n: 120, cap: [[3, 117, 'TH-19']], sfx: [[29, S('foley/foley_cistern-lid-tap_01'), {volume: 0.6, trimStartSec: 0.7}], [53, S('reveal/reveal_glass-shimmer-soft_01'), {volume: 0.5}]]},
  {id: 'ZC2-B05-SH04', at: 1351, n: 117, cap: [[6, 31, 'TH-20'], [34, 105, 'TH-21']]},
  {id: 'ZC2-B06-SH01', at: 1468, n: 204, cap: [[12, 99, 'TH-22'], [110, 198, 'TH-23']], sfx: [[98, TICK, {volume: 0.5}], [190, TICK, {volume: 0.5}]]},
  {id: 'ZC2-B06-SH02', at: 1672, n: 78, cap: [[9, 75, 'TH-24']], sfx: [[9, S('foley/foley_fridge-seal-pop_01'), {volume: 0.6}], [24, RUSTLE, {volume: 0.6}], [50, S('foley/foley_fridge-seal-thump_01'), {volume: 0.6}]]},
  {id: 'ZC2-B06-SH03', at: 1750, n: 49, cap: [[7, 37, 'TH-25']], sfx: [[20, S('foley/foley_can-setdown-laminate_01'), {volume: 0.6}]]},
  {id: 'ZC2-B07-SH01', at: 1799, n: 83, cap: [[11, 78, 'TH-26']], sfx: [[43, S('mechanical/mechanical_canister-handling_01'), {volume: 0.6}], [51, S('stinger/stinger_low-muted-hit_01'), {volume: 0.5}]]},
  {id: 'ZC2-B07-SH02', at: 1882, n: 97, cap: [[10, 97, 'TH-27']], sfx: [[11, HUM, {volume: 0.06}]]},
  {id: 'ZC2-B07-SH03', at: 1979, n: 68, cap: [[3, 52, 'TH-28']], sfx: [[12, RUSTLE, {volume: 0.35}]]},
  {id: 'ZC2-B08-SH01', at: 2047, n: 100, cap: [[12, 97, 'TH-29']]},
  {id: 'ZC2-B08-SH02', at: 2147, n: 131, cap: [[7, 55, 'TH-30'], [63, 106, 'TH-31']], sfx: [[13, HUM, {volume: 0.1}]]},
  {id: 'ZC2-B09-SH01', at: 2278, n: 198, cap: [[12, 37, 'TH-32'], [48, 86, 'TH-33'], [96, 138, 'TH-34'], [148, 190, 'TH-35']], sfx: [[12, TICK, {volume: 0.5}], [48, TICK, {volume: 0.5}], [96, TICK, {volume: 0.5}], [148, TICK, {volume: 0.5}]]},
  {id: 'ZC2-B09-SH02', at: 2476, n: 67, cap: [[12, 63, 'TH-36']]},
  {id: 'ZC2-B09-SH03', at: 2543, n: 77, cap: []},
  {id: 'ZC2-B09-SH04', at: 2620, n: 55, cap: [[12, 48, 'TH-37']], sfx: [[12, S('impact/impact_sub-hit-short_01'), {volume: 0.5}]]},
  {id: 'ZC2-B10-SH01', at: 2675, n: 202, cap: [[11, 81, 'TH-38'], [90, 115, 'TH-39']], sfx: [[133, KNUCKLE, {volume: 0.6}], [147, KNUCKLE, {volume: 0.6}], [160, KNUCKLE, {volume: 0.6}]]},
];

SHOTS.reduce((at, s) => {
  if (s.at !== at) throw new Error(`ZCONDO2: ${s.id} starts at ${s.at}, previous shot ends at ${at}`);
  return at + s.n;
}, 0);
if (SHOTS.reduce((sum, s) => sum + s.n, 0) !== TOTAL) throw new Error(`ZCONDO2: shots sum to ${SHOTS.reduce((sum, s) => sum + s.n, 0)} frames, the sheet says ${TOTAL}`);

/** Caption events on the global frame clock: text at `from`, blank at `to` (unless the text runs to the cut); each scene opens with a cue at its first frame. */
const captions = SHOTS.flatMap((s) => {
  const cues: {at: number; text: string}[] = [];
  s.cap.forEach(([from, to, id]) => {
    cues.push({at: s.at + from, text: text(id)});
    if (to < s.n) cues.push({at: s.at + to, text: ''});
  });
  if (cues.length === 0 || cues[0].at !== s.at) cues.unshift({at: s.at, text: ''});
  return cues;
});

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4,
  cuts: SHOTS.map((s) => ({id: s.id, start: s.at, end: s.at + s.n})),
  shots: SHOTS.map((s) => ({at: s.at, cue: {shot: zc2PlateId(s.id)}})),
  captions,
  sounds: SHOTS.flatMap((s) => (s.sfx ?? []).map(([f, src, o]): {at: number; cue: Omit<SceneSoundCue, 'atSec'>} => ({at: s.at + f, cue: {src, ...o}}))),
});

const track = (src: string, startSec: number, endSec: number, o: Partial<AudioTrack> = {}): AudioTrack => ({src, startSec, endSec, ...o});
const at = (shot: string, f: number) => f2s(SHOTS.find((s) => s.id === shot)!.at + f);
/**
 * Beds and run-over one-shots on the composition clock (SS-ZC2-R1 Sound lines; levels and ducks as the old ZCPAINT cue set, cues-TH.json).
 * Corridor fluorescent ends at the B02-SH01 cut (sheet B02-SH01), not at the blackout. Silence 86.222-87.726 s is the B09-SH03 door call.
 */
const audio: AudioTrack[] = [
  track('sfx/electric/electric_light-flicker-buzz_01.wav', 0, at('ZC2-B02-SH01', 0), {volume: 0.08, loop: true, fadeOutSec: 0.05}),
  track('sfx/reveal/reveal_riser-tension_01.wav', at('ZC2-B01-SH02', 5), at('ZC2-B01-SH02', 5) + 3.692, {volume: 0.25}),
  track('sfx/foley/foley_footsteps-run-slam_01.wav', at('ZC2-B01-SH03', 36), at('ZC2-B01-SH03', 36) + 1.42, {volume: 0.45, trimStartSec: 0.58, fadeOutSec: 0.1}),
  track('audio/room/room_shop-fridge-hum_01.wav', at('ZC2-B02-SH01', 10), 17.567, {volume: 0.18, fadeOutSec: 0.05}),
  track('sfx/tension/tension_heartbeat-slow_01.wav', at('ZC2-B02-SH01', 13), at('ZC2-B02-SH05', 49), {volume: 0.18, loop: true}),
  track('sfx/water/water_tap-fill-containers_01.wav', at('ZC2-B04-SH01', 12), at('ZC2-B04-SH01', 12) + 6, {volume: 0.12}),
  track('audio/room/room_dark-empty-building_01.wav', 19.0, 68.133, {volume: 0.1, loop: true, fadeInSec: 0.5, duckUnderNarration: 0.4}),
  track('audio/bed/bed_dark-drone-sub_01.wav', 19.0, 85.0, {volume: 0.12, loop: true, fadeInSec: 0.6, fadeOutSec: 0.5, duckUnderNarration: 0.5}),
  track('sfx/tension/tension_clock-pulse_01.wav', at('ZC2-B04-SH02b', 143), 63.067, {volume: 0.15, loop: true, fadeInSec: 1.0, duckUnderNarration: 0.5}),
  track('sfx/tension/tension_clock-pulse_01.wav', 63.067, 68.133, {volume: 0.06, loop: true}),
  track('audio/city/city_distant-fire-crackle_01.wav', 68.133, 76.333, {volume: 0.25, loop: true, fadeInSec: 0.5}),
  track('audio/nature/nature_wind-eerie-street_01.wav', 68.133, 76.333, {volume: 0.2, loop: true, fadeInSec: 0.5}),
  track('audio/room/room_dark-empty-building_01.wav', 76.333, 86.222, {volume: 0.1, loop: true, fadeOutSec: 0.1}),
  track('audio/room/room_dark-empty-building_01.wav', 87.726, 95.9, {volume: 0.08, loop: true, fadeInSec: 0.15, fadeOutSec: 0.5}),
];

const zombieCondo2: EpisodeVideos = {
  episode: 'zombie-condo2',
  videos: [
    {
      id: 'ZCONDO2-SHORT-TH', format: 'short', timeline, ending: 'A_fade', audio,
      captionStyle: {preset: 'outline', position: 'bottom', bottomEdgeY: 1248, strokeWidth: 6, strokeColor: '#0a080e', textShadow: '0 0 3px rgba(6,4,10,1), 0 0 9px rgba(6,4,10,1), 0 0 18px rgba(6,4,10,.9), 0 0 30px rgba(6,4,10,.6)'}, chrome: {channelLabel: '@TamMaiLa', progressBar: false},
      narration: {src: 'narration/ZCPAINT-SHORT-TH.mp3', amplitude, fps: FPS},
    },
  ],
};
export default zombieCondo2;
