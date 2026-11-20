import {CAPTION_OUTLINE} from '../../scenes/media';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import {DURATION, EDU30_SHOTS, FPS, plateId} from '../../painted/edu30/shots/index';
import type {EpisodeVideos} from '../types';
import {edu30CaptionEvents} from './cues';

/**
 * EDU-EP30-SHORT (1932 Emu War, "ถอนทัพสองรอบ") W5.3 timeline (Editor, pass 1, 20 Nov 2026): timed scene sheets EDU-EP30-SCENE-R2.2
 * (scripts/edu-series/ep30/short/scene-sheets/index.md + b01-b07.md), 28 shots = 28 scenes on G0-1976 (1977 f at 30 fps, 65.90 s), script EDU-EP30-SCRIPT-R2.2,
 * voice EDU-EP30-VOICE-R2.2 (store projects/edu/EDU/narration/ep30-voice-r2-2/preview.wav = public/narration/EDU-EP30-SHORT-narration-v1.wav, offset 0).
 * Plates `EDU30-<shot id>` (src/painted/shots/edu30.tsx, timing src/painted/edu30/shots/index.ts); every cut is a hard cut, no pre-roll. The plates draw the newsreel
 * layer, grain and the six title cards (T02; B05-SH03 "ถอนทัพ รอบที่ 1" stays at G1363-1388 as the plate table has it). Captions = ./cues.ts (36 cards on the timeline, the shared
 * `outline` look = edu stroke, no band, block centred on the TF46 band y 1150-1344, scale 1; character lines captioned like narration, none in the three mime beats). Label
 * "แต่งเติมจากเรื่องจริง · ภาพและเสียงจำลอง ไม่ใช่ฟุเทจจริง" on every plate cue (VD30-10), mark @TamMaiLa top-left (chrome default, outline look as EP26).
 * Ending: closed, the 2.0 s hold is the last 60 f of B07-SH02 (G1917-1976), no picture fade, no extra series ending sound (UT15: Film's SFX-B07-SH02-1/2 from the cue sheet).
 * Sound: the stem `audio/edu/EDU-EP30-SHORT-draft-stem-v1.wav` is baked from scripts/edu-series/ep30/sound-cues.json (90 cues, EDU-EP30-SCENE-R2) by `short/sound-mix.py` (Ton's sound lock, pass 2), played as the `audio` track beside the narration.
 */
/** The sheet's one-string label ("แต่งเติมจากเรื่องจริง · ภาพและเสียงจำลอง ไม่ใช่ฟุเทจจริง", VD30-10) runs as one 952 px line, x 120 to 1072, and crosses the T02 title boxes (y 300-475); the same words are set in the label's two slots (the "·" becomes the line break) at y 180-290, under the mark and above the title band, on every shot (open question to Film, build-notes). */
const LABEL_SLOTS = ['แต่งเติมจากเรื่องจริง', 'ภาพและเสียงจำลอง ไม่ใช่ฟุเทจจริง'];
const LABEL_TOP = 180;
if (DURATION !== 1977 || EDU30_SHOTS.length !== 28) throw new Error(`EDU-EP30-SHORT: shot index has ${EDU30_SHOTS.length} shots / ${DURATION} f, the sheet says 28 / 1977`);

const cuts = EDU30_SHOTS.map((s) => ({id: s.id, start: s.start, end: s.start + s.N}));
const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: plateId(cut.id), label: LABEL_SLOTS, labelTop: LABEL_TOP}})),
  captions: edu30CaptionEvents(cuts.map((c) => c.start)),
});

/** The draft stem baked by `short/sound-mix.py` from the cue sheet (`audio` below carries it; null = no audio track). */
const STEM: string | null = 'audio/edu/EDU-EP30-SHORT-draft-stem-v1.wav';

const videos: EpisodeVideos = {
  episode: 'edu-ep30',
  videos: [{id: 'EDU-EP30-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/EDU-EP30-SHORT-narration-v1.wav', amplitude: [], fps: FPS},
    ...(STEM ? {audio: [{src: STEM, volume: 1}]} : {}),
    captionStyle: {preset: 'outline', centerY: 1247, ...CAPTION_OUTLINE},
    chrome: {channelLabelStyle: 'outline', progressBar: false}}],
};
export default videos;
