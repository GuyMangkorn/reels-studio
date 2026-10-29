import shipwreckAmplitude from '../../../scripts/oldest-shipwreck/short/SHIPWRECK-SHORT.amplitude.json';
import slots from '../../../scripts/oldest-shipwreck/short/narration-timeline.json';
import type {AudioTrack, PaintedShotCue, QuadText, Scene, SceneSoundCue, SubtitleCue, Timeline} from '../../scenes/types';
import type {EpisodeVideos} from '../types';

/**
 * SHIPWRECK-SHORT (script SHIPWRECK-SHORT-R1.1, brief VB-SHIPWRECK-SHORT-R1, Light tier, Mark N/A): painted 2D plates
 * (`src/painted/shots/shipwreck.tsx`) under Remotion captions, chrome, label and sound. One source of truth:
 * `scripts/oldest-shipwreck/short/narration-timeline.json` holds one entry per narration slot (Premwadee +5% read,
 * `npm run narration -- --timeline scripts/oldest-shipwreck/short/narration-timeline.json --name SHIPWRECK-SHORT
 * --voice th-TH-PremwadeeNeural --rate +5%`) with its beat, slot-local caption cues, plate cues and SFX. Slots are
 * grouped here into one scene per story beat (B01-B09), so the progress bar shows the nine beats. The last slot carries
 * the 3 s B_loop hold; SH09b reaches the SH01 frame-0 framing exactly at the hold start (the seam).
 * Render painted compositions with `--gl=angle`. Audio files under public/ are local copies of shared-library sounds
 * (`scripts/oldest-shipwreck/short/copy-sounds.sh`, NOTICE beside them).
 */
type Slot = {
  beat: string; durationSec: number; subtitle: string;
  cues?: SubtitleCue[]; shots?: PaintedShotCue[]; sfx?: SceneSoundCue[];
};
const FPS = 30;
const frames = (sec: number) => Math.round(sec * FPS);

/**
 * B07 real-photo card (user request, 29 Oct 2026): a dated Early Bronze Age jar from Arad (Israel Museum, CC0, NOTICE
 * beside the file) over the known-jar half of SH07a on "…กับไหที่รู้อายุแล้ว", inside the caption-safe box and above the
 * caption band (card x 464–888, y 291–856). It is not a Kekova jar, and the card says so.
 */
const rect = (x: number, y: number, width: number, height: number): QuadText['quads'] => [[[x, y], [x + width, y], [x + width, y + height], [x, y + height]]];
const PHOTO = {startFrame: 60, endFrame: 120};
const photoText = (text: string, x: number, y: number, width: number, height: number, fontSize: number, color: string): QuadText =>
  ({text, quads: rect(x, y, width, height), box: {width, height}, fontSize, fontWeight: 700, color, ...PHOTO});
const photoCard: Pick<Scene, 'media' | 'quadTexts'> = {
  media: [{kind: 'image', src: 'images/oldest-shipwreck/arad-jar-card.png', layer: 'front', startSec: PHOTO.startFrame / 30, endSec: PHOTO.endFrame / 30,
    box: {x: 464 / 1080, y: 291 / 1920, width: 424 / 1080, height: 565 / 1920}}],
  quadTexts: [
    photoText('ภาพจริง', 464, 293, 424, 44, 30, '#ffffff'),
    photoText('ไหจากเมืองอารัด ราว 3000–2650 ปีก่อน ค.ศ.', 464, 794, 424, 30, 20, '#ffffff'),
    photoText('ไม่ใช่ไหจากซากเรือนี้ · ภาพ Gary Todd (CC0)', 464, 824, 424, 28, 18, '#d9d2c4'),
  ],
};

export const shipwreckTimeline: Timeline = (() => {
  const scenes: Scene[] = [];
  let beat = '', local = 0;
  for (const slot of slots as Slot[]) {
    if (slot.beat !== beat) {
      beat = slot.beat;
      local = 0;
      scenes.push({durationSec: 0, bg: 'none', actors: [], subtitle: '', subtitleCues: [], sfx: [], painted: {shots: []}, ...(beat === 'B07' ? photoCard : {})});
    }
    const scene = scenes[scenes.length - 1];
    const at = (sec: number) => frames(local + sec) / FPS;
    for (const cue of slot.cues ?? []) scene.subtitleCues!.push({...cue, atSec: at(cue.atSec)});
    for (const cue of slot.shots ?? []) scene.painted!.shots.push({...cue, atSec: at(cue.atSec)});
    for (const cue of slot.sfx ?? []) scene.sfx!.push({...cue, atSec: at(cue.atSec)});
    local = frames(local + slot.durationSec) / FPS;
    scene.durationSec = local;
  }
  return scenes.map((s) => ({...s, subtitle: s.subtitleCues!.map((c) => c.text).join(' '), ...(s.sfx!.length ? {} : {sfx: undefined})}));
})();

/**
 * Beds on the composition clock (s), mix cue sheet in storyboards/oldest-shipwreck/short/edit-plan.md. Beat starts: B01 0,
 * B02 6.3, B03 13.167, B04 18.433, B05 26.767, B06 33.8, B07 39.5, B08 47.2, B09 52.7, B_loop hold 56.167, end 59.167.
 * Music sections reuse one file with `trimStartSec = startSec`, so a level change never restarts the phrase.
 * Ambience U3 runs exactly two 14.5 s loop periods to the end, so the last sample meets U1's first (B_loop seam).
 */
const MUSIC = 'audio/bed/bed_underwater-mystery-sparse_01.wav';
const SEABED = 'audio/water/water_underwater-shallow-ambience_01.wav';
const music = (startSec: number, endSec: number, volume: number, fadeInSec: number, fadeOutSec: number, duckUnderNarration: number): AudioTrack =>
  ({src: MUSIC, startSec, endSec, trimStartSec: startSec, volume, fadeInSec, fadeOutSec, duckUnderNarration});
export const shipwreckAudio: AudioTrack[] = [
  // Ambience: cold open on the seabed, hard cut out for the storm, thinner after the doubt, steady from B05 into the seam.
  {src: SEABED, startSec: 0, endSec: 13.167, volume: 0.2, fadeOutSec: 0.05, loop: true, duckUnderNarration: 0.7},
  {src: SEABED, startSec: 18.433, endSec: 30.267, volume: 0.13, fadeInSec: 1, fadeOutSec: 0.1, loop: true, duckUnderNarration: 0.7},
  {src: SEABED, startSec: 30.167, endSec: 59.167, volume: 0.2, fadeInSec: 0.1, loop: true, duckUnderNarration: 0.7},
  // B03 storm, inside the labelled span only; stops dead on "หรืออาจไม่ใช่เลย" (16.867).
  {src: 'audio/weather/weather_sea-storm-wind-waves_01.wav', startSec: 13.167, endSec: 16.867, volume: 0.3, fadeInSec: 0.05, fadeOutSec: 0.06, loop: true, duckUnderNarration: 0.6},
  {src: 'audio/weather/weather_rain-thunder-distant_01.wav', startSec: 13.167, endSec: 16.867, volume: 0.15, fadeInSec: 0.05, fadeOutSec: 0.06, duckUnderNarration: 0.6},
  // Music: very low on the B01 question, out for the storm, a low B04 pulse that thins out before "ร้อยสองร้อยปี",
  // warm B06 entry with the riser, fullest in B07, easing on "แต่ทีมเองบอกว่า", B01 colour in B09, out by 55.0.
  music(4.7, 13.2, 0.1, 1.5, 0.1, 0.5),
  music(18.9, 31.6, 0.09, 1.2, 1, 0.5),
  music(33.8, 39.8, 0.13, 0.5, 0.3, 0.45),
  music(39.5, 47.5, 0.2, 0.3, 0.3, 0.4),
  music(47.2, 50.4, 0.15, 0.3, 0.3, 0.45),
  music(50.1, 55, 0.1, 0.3, 1.5, 0.5),
];

const oldestShipwreck: EpisodeVideos = {
  episode: 'oldest-shipwreck',
  videos: [
    {id: 'SHIPWRECK-SHORT', format: 'short', timeline: shipwreckTimeline, ending: 'B_loop', audio: shipwreckAudio,
      captionStyle: {preset: 'outline', position: 'middle'},
      narration: {src: 'narration/SHIPWRECK-SHORT.mp3', amplitude: shipwreckAmplitude, fps: FPS}},
  ],
};
export default oldestShipwreck;
