import narrationAmplitude from '../../../public/narration/HANAKO-SHORT.amplitude.json';
import hanakoScenes from '../../../scripts/hanako/short/timeline.json';
import type {AudioTrack, Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * HANAKO-SHORT (script `HANAKO-SHORT-SCRIPT-R2`, scene sheet `HANAKO-SHORT-SCENE-R4`, voice lock v3, Full tier). Editor E2 +
 * registration (31 Oct 2026). 2596 frames = 86.53 s at 30 fps, 1080x1920.
 *
 * Timeline: nine scenes, one per beat (`B01`…`B09`; scene sheet runtime mapping). The 14 plates are `HANAKO-<shot>` in
 * `src/painted/shots/hanako.tsx`; the B01-SH01 hook text, the B03/B06/B07 name, source and date labels are painted inside
 * their plates with frame-based opacity, so no screen overlay or `painted.label` is used. Dissolves (0.5 s) at B01-SH02,
 * B06-SH02 and B08-SH01 are `dissolveSec` on the plate cue; every other boundary is a hard cut.
 * Cue source: `scripts/hanako/short/timeline.json`, written by `scripts/hanako/short/build-cues.py` from the voice lock
 * (`voice-measure.json`, `public/narration/HANAKO-SHORT.amplitude.json`); the per-cue measure is in `cue-measure.json`.
 * Narration: `public/narration/HANAKO-SHORT.mp3` starts at frame 45 (`startFrame`, the knock pre-roll); the hold
 * [2506, 2596) is room tone inside `B09`.
 * Ending `A_fade` with `endHoldSec: 0, endFadeSec: 0` = plain playback, no closing hold and no fade (the BLOOP precedent). The
 * scene sheet asks for `B_loop` with no hold, but `validateVideoStyle` rejects `endHoldSec` for `B_loop`, and the default
 * `B_loop` hold freezes the painted final scene (`paintedStateAt` holds the last 3 s), which would drop the B09 cool-down
 * (F2581–F2595) and the seam. No `loopFadeFrames` (a dip would break the F2595 → F0 seam).
 * Sound (Editor E3, 31 Oct 2026): `audio` below, built from the scene sheet `Sound` lines. Files are library copies locked
 * with `store.py use` (`public/audio/<category>/<id>.wav`, see `assets.lock.json`); IDs, sources, measures and the mix cue
 * sheet are in `scripts/hanako/short/editor-e3-report.md`. Nothing was listened to by a person. Not wired (capability gaps for
 * Boss, report §6): the −2 dB room-tone dip F2323–F2383 (static track volume), a per-beat narration gain (fixed narration level).
 * The E4 loop seam pixel check and progress-bar reset, and the E5 B09 read, are still open.
 * Sound R5 (Editor E-R5, 31 Oct 2026, `SCENE-R5` I2/I4): the warm pad, the mystery beds and ticks TK2–TK6 are removed; the
 * cold bed runs as CB1 / CB1b / CB1c; MN1 (one music-box note) and the light-dip buzz BZ1/BZ2 are added. Measured, not listened
 * to: `scripts/hanako/short/editor-e-r5-report.md`.
 * Captions: `position: 'lower'` (bottom edge y 1240, inside the caption-safe box, `production-requirements`).
 */
const FPS = 30;
const PREROLL_FRAMES = 45;

/** Composition frame (the scene sheet's F-numbers) → seconds on the composition clock. */
const sec = (frame: number) => frame / FPS;
/** A one-shot starting at a composition frame; it plays its file to the end. */
const cue = (src: string, frame: number, volume: number, extra: Partial<AudioTrack> = {}): AudioTrack =>
  ({src, startSec: sec(frame), volume, ...extra});
/** A track between two composition frames. */
const span = (src: string, from: number, to: number, volume: number, extra: Partial<AudioTrack> = {}): AudioTrack =>
  ({src, startSec: sec(from), endSec: sec(to), volume, ...extra});

/** Ducking depth under narration (EP08a palette): music beds, room tone and SFX that land on speech, and whispers. */
const BED = 0.35;
const ROOM = 0.5;
const FX = 0.5;
const WHISPER = 0.2;

// Library copies (`library/sound/<type>/<category>/<id>.wav` → `public/audio/<category>/<id>.wav`).
const ROOM_TONE = 'audio/room/room_dark-empty-building_01.wav'; // reused
const KNOCK = 'audio/impact/impact_knuckle-rap_01.wav'; // reused
const SUB_DRONE = 'audio/bed/bed_sub-drone-fade-in_01.wav'; // generated E3
const REVERSE_SWELL = 'audio/reveal/reveal_reverse-swell-airy_01.wav'; // generated E3
const MUSIC_BOX_MINOR = 'audio/tension/tension_music-box-motif-minor_01.wav'; // generated E3
const MUSIC_BOX_SLOW = 'audio/tension/tension_music-box-motif-slow_01.wav'; // generated E3
const WHISPERS = 'audio/tension/tension_whispers-children-murmur_01.wav'; // generated E3
const NOTEBOOK = 'audio/foley/foley_notebook-paper-rustle_01.wav'; // generated E3
const HELD_TONE = 'audio/tone/tone_soft-sustain-reflective_01.wav'; // reused
const PANEL_LANDING = 'audio/whoosh/whoosh_fast-slide_01.wav'; // reused
const RUMBLE = 'audio/tension/tension_rumble-distant-muffled_01.wav'; // generated E3
const DOOR_SLAM = 'audio/impact/impact_door-slam-wood-muffled_01.wav'; // generated E3
const DRAWER = 'audio/foley/foley_drawer-filing-open_01.wav'; // generated E3
const PAPER_FLICK = 'audio/foley/foley_paper-tab-flick_01.wav'; // generated E3
const PAGE_FLIP = 'audio/whoosh/whoosh_page-flip-paper_01.wav'; // generated E3
const RISER = 'audio/reveal/reveal_riser-tension_01.wav'; // reused
const COLD_BED = 'audio/tension/tension_drone-sparse-piano_01.wav'; // reused
const UI_TICK = 'audio/ui/ui_click-tick_01.wav'; // reused
const SUB_HIT = 'audio/impact/impact_sub-hit-short_01.wav'; // reused
const PROJECTOR = 'audio/mechanical/mechanical_projector-shutter-click_01.wav'; // generated E3
const BUZZ = 'audio/electric/electric_light-flicker-buzz_01.wav'; // reused, library sfx/electric (E-R5, I4)

/**
 * Music, ambience and SFX on the composition clock. Room tone is split where it would wrap: the 12.5 s file is played in
 * whole periods, so B09's last frame (F2595) ends on the file's last sample and F0 starts on its first sample. The seam is
 * room tone only on both sides (scene sheet, "Loop seam"); no cue lands at F2595 or F0 (the first event is the knock at F4).
 */
const audio: AudioTrack[] = [
  // B01 hook: room tone from f0; knocks before the narration starts at F45
  span(ROOM_TONE, 0, 375, 0.08, {duckUnderNarration: ROOM}),
  span(ROOM_TONE, 375, 417, 0.08, {duckUnderNarration: ROOM, fadeOutSec: 8 / FPS}), // dropped F409–F417 (B02)
  cue(KNOCK, 4, 0.7), cue(KNOCK, 18, 0.7), cue(KNOCK, 31, 0.7),
  // B01-SH02: sub drone fades in over 30 f from F117; bed drops for the narration pause F297–F305
  span(SUB_DRONE, 117, 305, 0.09, {duckUnderNarration: ROOM, fadeOutSec: 8 / FPS}),
  // B02: reverse swell ends on the «ค่ะ» onset (F417); no SFX on the fist flinch
  cue(REVERSE_SWELL, 393, 0.3, {duckUnderNarration: FX}),
  // B03 (no room tone, new location): music box enters low at F443; notebook rustle F467 (optional); whispers F585–F645
  span(MUSIC_BOX_MINOR, 443, 645, 0.12, {duckUnderNarration: BED, fadeOutSec: 3 / FPS}),
  cue(NOTEBOOK, 467, 0.2, {duckUnderNarration: FX}),
  span(WHISPERS, 585, 645, 0.12, {duckUnderNarration: WHISPER, fadeOutSec: 0.3}),
  // B04: music thins to a held note from F645; panel landings F707/F820; rumble F742; muffled wooden slam F851
  span(HELD_TONE, 645, 900, 0.10, {duckUnderNarration: BED}),
  cue(PANEL_LANDING, 707, 0.25), cue(PANEL_LANDING, 820, 0.25),
  cue(RUMBLE, 742, 0.25, {duckUnderNarration: 0.2}),
  cue(DOOR_SLAM, 851, 0.3, {duckUnderNarration: 0.2}),
  // B05: held note near-silent; drawer F903; paper flicks F951/F967/F983 and cover F1027; page flips F1078/F1100;
  // riser stops dead on the «ต้นเรื่อง» onset (F1127); bed near-silent F1127–F1172
  span(HELD_TONE, 900, 1005, 0.05, {trimStartSec: 255 / FPS, duckUnderNarration: BED}),
  cue(DRAWER, 903, 0.25, {duckUnderNarration: FX}),
  cue(PAPER_FLICK, 951, 0.25, {duckUnderNarration: FX}), cue(PAPER_FLICK, 967, 0.25, {duckUnderNarration: FX}),
  cue(PAPER_FLICK, 983, 0.25, {duckUnderNarration: FX}), cue(PAPER_FLICK, 1027, 0.25, {duckUnderNarration: FX}),
  cue(PAGE_FLIP, 1078, 0.25, {duckUnderNarration: FX}), cue(PAGE_FLIP, 1100, 0.25, {duckUnderNarration: FX}),
  span(RISER, 1016, 1127, 0.25, {duckUnderNarration: FX}),
  // B06-SH02 (R5, I2): cold bed stays and runs file-continuous from file 0 s at F1172 (CB1 piece a, no fade under the
  // dissolve); the warm pad WP1 is dropped. Pin tick F1264; soft sub hit F1391. MN1 = first note of the B03 motif on
  // «แต่เป็นเรื่องผี» (F1430), one note only. Its file starts 52 ms into silence, so the 1-f trim puts the audible onset on
  // F1430 ±1 (E-R5 report §3). The note stays under narration: duck 0.35 holds for the whole cue.
  span(COLD_BED, 1172, 1784, 0.10, {duckUnderNarration: BED, fadeOutSec: 6 / FPS}), // CB1 piece a: fade-out F1778–F1784
  cue(UI_TICK, 1264, 0.25),
  cue(SUB_HIT, 1391, 0.3),
  span(MUSIC_BOX_MINOR, 1430, 1456, 0.12, {trimStartSec: 1 / FPS, duckUnderNarration: BED, fadeOutSec: 4 / FPS}), // MN1
  // B07-SH01..03 (R5, I2): the same cold bed replaces MY1/MY2 (ticks TK2–TK6 dropped). CB1b re-enters at the hard cut F1778 from
  // file 1.000 s (6-f fade-in); CB1c splits file-continuous at F1940 (file 6.400 s) with the +2.5 dB step (0.133) and fades out
  // F2046–F2061 under the dissolve into B08. Page flips F1653/F1782 and projector click F2022 are unchanged.
  span(COLD_BED, 1778, 1940, 0.10, {trimStartSec: 1.0, duckUnderNarration: BED, fadeInSec: 6 / FPS}), // CB1b
  span(COLD_BED, 1940, 2061, 0.133, {trimStartSec: 6.4, duckUnderNarration: BED, fadeOutSec: 15 / FPS}), // CB1c
  cue(PAGE_FLIP, 1653, 0.3, {duckUnderNarration: FX}), cue(PAGE_FLIP, 1782, 0.25, {duckUnderNarration: FX}),
  cue(PROJECTOR, 2022, 0.3, {duckUnderNarration: FX}),
  // B08: room tone returns low from F2046 (split at its 6.667 s point so the B09 tail ends on the file end);
  // music box slow with the silent dip F2127–F2147; whispers return F2217–F2295
  span(ROOM_TONE, 2046, 2221, 0.08, {trimStartSec: 200 / FPS, duckUnderNarration: ROOM, fadeInSec: 15 / FPS}),
  span(MUSIC_BOX_SLOW, 2046, 2127, 0.12, {duckUnderNarration: BED, fadeInSec: 15 / FPS, fadeOutSec: 6 / FPS}),
  span(MUSIC_BOX_SLOW, 2147, 2482, 0.12, {trimStartSec: 101 / FPS, duckUnderNarration: BED, fadeInSec: 6 / FPS, fadeOutSec: 2 / FPS}),
  span(WHISPERS, 2217, 2295, 0.12, {duckUnderNarration: WHISPER, fadeOutSec: 0.3}),
  // B08-SH01 (R5, I4): light-dip buzz on the dip frames F2129 and F2136; no duck (no VO), nothing after F2147. BZ1 starts at
  // file 0.033 s (the first click is at 0.041 s); BZ2 at file 2.033 s (the click at 2.047 s, ±1 f).
  span(BUZZ, 2129, 2136, 0.30, {trimStartSec: 1 / FPS, fadeOutSec: 2 / FPS}), // BZ1
  span(BUZZ, 2136, 2147, 0.30, {trimStartSec: 61 / FPS, fadeOutSec: 4 / FPS}), // BZ2
  // B09: music cuts at F2482 (hand onset); room tone to the seam (whole 12.5 s file, F2221–F2596)
  span(ROOM_TONE, 2221, 2596, 0.08, {duckUnderNarration: ROOM}),
];

const hanako: EpisodeVideos = {
  episode: 'hanako',
  videos: [{
    id: 'HANAKO-SHORT', format: 'short', timeline: hanakoScenes as Timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/HANAKO-SHORT.mp3', amplitude: narrationAmplitude, fps: FPS, startFrame: PREROLL_FRAMES},
    captionStyle: {preset: 'outline', position: 'lower'},
    audio,
  }],
};
export default hanako;
