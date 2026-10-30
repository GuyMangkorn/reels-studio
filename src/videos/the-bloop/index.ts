import amplitude from '../../../scripts/the-bloop/short/BLOOP-EP01-SHORT.amplitude.json';
import type {AudioTrack} from '../../scenes/types';
import type {EpisodeVideos} from '../types';
import {buildTimeline, compAt, FPS, labelWindow, type PaintedCue, type TimedCaption, type TimedSound} from './timeline';

/**
 * BLOOP-EP01-SHORT (Editor, cut 2, 2026-10-30): `BLOOP-SHEETS-R8` frames (composition G, the measured Gemini take 3
 * read: take 2 B01–B06 + var1 B07–B10, `scripts/the-bloop/short/timing-gemini-take3.json`). Narration:
 * `public/narration/BLOOP-EP01-SHORT.mp3` from `narration-timeline-gemini-take3.json` + `take3/segments`
 * (assemble-narration.py). Plates `bloop-sh01…sh13` (Boss pass 7). Ending A_fade with no hold and no fade (DEP04).
 * B10 sound per `BLOOP-BRIEF-R8` H06: drone in at G1959, distant gulp at P3 (G2010), low-pass + mono from the lip frame
 * G2047, muffled whoosh in P5 (G2061), close gulp G2072–G2096.4, everything at 0 by G2097. Processed copies live beside
 * the library files in public/audio/bloop/ (copy-sounds.sh + ffmpeg, see build-notes).
 */
const shot = (id: string) => `bloop-sh${id}`;

// Painted cues (R8 "Planned runtime mapping"; a shot's clock starts at its first cue).
const cues: PaintedCue[] = [
  {e: 0, shot: shot('01'), clock: 'comp'},
  {e: 224, shot: shot('02'), dissolve: 0.6},
  {e: 399, shot: shot('03')}, {e: 461, shot: shot('03')}, {e: 510, shot: shot('03')},
  {e: 518, shot: shot('04')},
  {e: 684, shot: shot('05')},
  {e: 849, shot: shot('06'), dissolve: 0.6},
  {e: 919, shot: shot('07')},
  {e: 1033, shot: shot('08')},
  {e: 1204, shot: shot('09')},
  {e: 1267, shot: shot('10')},
  {e: 1329, shot: shot('11')},
  {e: 1446, shot: shot('12')},
  {e: 1696, shot: shot('13')}, {e: 1914, shot: shot('13')}, {e: 2097, shot: shot('13')},
];

// Fact labels: slot 1 (track A) and slot 2 (track B), DEP03; windows per R8.
const trackA = [
  labelWindow('เสียงจริง เร่ง 16 เท่า', 0, 186),       // B01 clip (SH01)
  labelWindow('เสียงจริง เร่ง 16 เท่า', 461, 510),     // B03 clip (SH03)
  labelWindow('ภาพประกอบ', 518, 684),                   // SH04
  labelWindow('ภาพประกอบ', 1267, 1329),                 // SH10
  labelWindow('จินตนาการ', 871, 1033),                  // SH06 and SH07
  labelWindow('จินตนาการ', 1329, 1387),                 // SH11 (creature, then the crack)
  labelWindow('จินตนาการ', 1914, 2097),                 // B10 creature, until the first full-black frame
];
const trackB = [
  labelWindow('เสียงจำลอง', 1369, 1447),                // crack, SH11 to the crack tail (R8)
  labelWindow('เสียงจำลอง', 1659, 1679),                // ice tick phrase (B08-a7)
];

// Captions: R8 subtitle pages, verbatim R5 Thai (with authored line breaks). The first page starts at frame 0.
const PAGES: [number, string][] = [
  [0, 'เสียงนี้…'], [38, 'ไมค์ใต้ทะเลจับได้ปี 1997'], [84, 'มันดังมาก\nจนนักวิจัยไม่เคยได้ยินอะไรแบบนี้'],
  [204, 'ไมค์พวกนี้'], [224, 'NOAA หย่อนไว้ลึกใต้แปซิฟิก'], [267, 'เพื่อฟังแผ่นดินไหวใต้ทะเล'], [323, 'แต่ปีนั้น มันได้ยินเสียงนี้ซ้ำหลายครั้ง'],
  [403, 'เสียงบลูปของจริงต่ำมาก'], [464, 'ที่ได้ยินนี่ถูกเร่ง 16 เท่า…'], [518, 'เสียงจริงไต่สูงขึ้นอย่างรวดเร็ว'], [575, 'ตลอดราวหนึ่งนาที\nฟังคล้ายเสียงสัตว์ร้อง'],
  [688, 'มันดังจนไมค์หลายตัวได้ยิน'], [730, 'จากไกลกว่า 5,000 กิโลเมตร'], [787, 'นักวิทยาศาสตร์บางคน\nก็สงสัยว่าเป็นสัตว์'], [849, 'ส่วนชาวเน็ต…'], [873, 'จินตนาการไปถึงสัตว์ยักษ์'],
  [919, 'แต่ทิศของเสียง'], [947, 'ชี้ไกลลงไปทางใต้…'], [998, 'ทางขั้วโลกใต้'],
  [1033, 'เพราะทะเลลึกมี "ช่องเสียง"'], [1080, 'ที่พาเสียงต่ำไปได้ไกลมาก'], [1137, 'ไมค์พวกนี้ถูกหย่อนไว้ในช่องนั้นพอดี'],
  [1208, 'หลายปีต่อมา ไมค์ใกล้แอนตาร์กติกา…'], [1267, 'เจอเสียงที่ลายคลื่นคล้ายกันมาก'], [1329, 'จากภูเขาน้ำแข็งยักษ์ที่กำลังแตกร้าว'],
  [1407, 'ราวปี 2012 NOAA ประกาศว่า'], [1497, 'บลูปสอดคล้องกับเสียง\n"แผ่นดินไหวน้ำแข็ง"'], [1582, 'ไมค์ที่ฟังแผ่นดินไหว'], [1617, 'ก็น่าจะได้ยินแผ่นดินไหวจริง ๆ…'], [1661, 'ของน้ำแข็ง'],
  [1700, 'สัตว์ยักษ์ตัวนั้นมีแค่ในจินตนาการ'], [1773, 'เสียงที่ไต่สูงเหมือนสัตว์ร้อง'], [1822, 'สอดคล้องกับเสียงน้ำแข็งแตกร้าว…'],
  [1914, 'คุณคิดว่ามันคืออะไรกันแน่?'],
];
const BEAT_STARTS = [0, 198, 399, 684, 915, 1033, 1204, 1402, 1696, 1910];
const pageStarts = new Set(PAGES.map(([e]) => e));
const captions: TimedCaption[] = [
  ...PAGES.map(([e, text]) => ({at: compAt(e), text})),
  // "no caption" at each beat start that has no page (the sheets' gaps), and at the first black frame (G2097)
  ...BEAT_STARTS.filter((e) => !pageStarts.has(e) && e !== 0).map((e) => ({at: compAt(e), text: ''})),
  {at: compAt(2097), text: ''},
].sort((a, b) => a.at - b.at);

// One-shots (BLOOP-BRIEF-R8 H06; sheet Sound lines in R8). Volumes are the mix level per cue.
const sfx = (src: string, e: number, volume: number, durationSec?: number): TimedSound =>
  ({at: compAt(e), cue: {src: `audio/bloop/${src}`, volume, ...(durationSec === undefined ? {} : {durationSec})}});
const sounds: TimedSound[] = [
  {at: 0, cue: {src: 'audio/bloop/noaa-bloop-b01-clip.wav', volume: 0.9}},             // real NOAA clip from frame 0 (AUD-1)
  sfx('quake_seafloor-rumble-muffled_01.wav', 286, 0.45),                                // SH02 L62
  sfx('pulse_underwater-soft-thump_01.wav', 353, 0.35),                                  // SH02 L129, L140, L151
  sfx('pulse_underwater-soft-thump_01.wav', 364, 0.35),
  sfx('pulse_underwater-soft-thump_01.wav', 375, 0.35),
  {at: compAt(461), cue: {src: 'audio/bloop/noaa-bloop-b03-clip.wav', volume: 0.9}},   // real NOAA clip from the B03 label
  sfx('hum_low-travelling-flat_01.wav', 1093, 0.3),                                      // SH08 L60 (panning not supported)
  sfx('reveal_glass-shimmer-soft_01.wav', 998, 0.25),                                    // under "ทางขั้วโลกใต้"
  sfx('reveal_riser-tension_01.wav', 849, 0.3, (compAt(919) - compAt(849)) / FPS),       // stops dead on "แต่"
  sfx('ice_iceberg-crack-groan-underwater_01.wav', 1369, 0.8),                           // required crack, SH11
  sfx('ui_click-tick_01.wav', 1582, 0.5),                                                // B08 callback accent
  sfx('ui_click-tick_01.wav', 1661, 0.3),                                                // B08 ice tick (see build-notes)
  // B10 (H06): distant gulp at P3 (-3 st, low-passed, -8 dB), muffled whoosh in P5, close gulp G2072–G2096.4
  sfx('creature_deep-swallow-gulp_01_distant.wav', 2010, 0.9),
  sfx('whoosh_heavy-cinematic_01_p5-muffled.wav', 2061, 0.6),
  sfx('creature_deep-swallow-gulp_01_lp400.wav', 2072, 0.8),
];

// Music bed (SD01) in sections on the composition clock; the file's time equals the composition time (trimStartSec = start).
// The bed is out before the question (P1 at G1914); the last section ends at the end of the 60 s file.
const BED = 'audio/bloop/bed_underwater-mystery-sparse_01.wav';
const bedSections: [number, number, number, number, number][] = [ // [start, end, volume, fadeIn, fadeOut] (frames, seconds)
  [60, 84, 0.10, 1.0, 0.3], [84, 461, 0.12, 0.3, 0.3], [461, 510, 0.03, 0.2, 0.2], [510, 684, 0.10, 0.2, 0.3],
  [684, 849, 0.14, 0.3, 0.3], [849, 919, 0.20, 0.3, 0.1], [919, 1033, 0.03, 0.1, 0.3], [1033, 1204, 0.10, 0.4, 0.3],
  [1204, 1369, 0.08, 0.3, 0.2], [1369, 1387, 0.18, 0.05, 0.3], [1387, 1659, 0.12, 0.3, 0.3], [1659, 1800, 0.06, 0.3, 1.5],
];
const audio: AudioTrack[] = [
  ...bedSections.map(([s0, s1, volume, fadeInSec, fadeOutSec]): AudioTrack => ({
    src: BED, startSec: compAt(s0) / FPS, endSec: compAt(s1) / FPS, trimStartSec: compAt(s0) / FPS,
    volume, fadeInSec, fadeOutSec, duckUnderNarration: 0.35,
  })),
  // Deep-water room tone for the picture until G2047 (lip frame); then the mono low-passed copy, at 0 by G2097.
  {src: 'audio/bloop/water_deep-ocean-roomtone_01.wav', startSec: 0, endSec: compAt(2047) / FPS, volume: 0.10, loop: true, duckUnderNarration: 0.5},
  {src: 'audio/bloop/water_deep-ocean-roomtone_01_lp400.wav', startSec: compAt(2047) / FPS, endSec: compAt(2097) / FPS, volume: 0.10, fadeOutSec: 0.6},
  // Drone: very low on the question's last word (G1959), swells in P2 (G1974), mono low-passed from the lip frame, 0 by G2097.
  {src: 'audio/bloop/bed_dark-drone-sub_01.wav', startSec: compAt(1959) / FPS, endSec: compAt(1974) / FPS, volume: 0.10, fadeInSec: 0.5, loop: true},
  {src: 'audio/bloop/bed_dark-drone-sub_01.wav', startSec: compAt(1974) / FPS, endSec: compAt(2047) / FPS, trimStartSec: 0.5, volume: 0.22, loop: true},
  {src: 'audio/bloop/bed_dark-drone-sub_01_lp400.wav', startSec: compAt(2047) / FPS, endSec: compAt(2097) / FPS, volume: 0.22, fadeOutSec: 0.6},
];

const timeline = buildTimeline({cues, trackA, trackB, extraEst: [1914, 2010, 2031, 2061, 2097], captions, sounds});

const bloopEp01Short: EpisodeVideos = {
  episode: 'the-bloop',
  videos: [{
    id: 'BLOOP-EP01-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
    narration: {src: 'narration/BLOOP-EP01-SHORT.mp3', amplitude, fps: FPS},
    audio, captionStyle: {preset: 'outline', position: 'middle'},
  }],
};
export default bloopEp01Short;
