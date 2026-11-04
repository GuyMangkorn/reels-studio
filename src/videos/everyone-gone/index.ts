import amplitude from '../../../scripts/everyone-gone/short/EG-EP01-SHORT.amplitude.json';
import {egPlateId} from '../../painted/shots/everyone-gone';
import {EG_SHOTS} from '../../painted/everyone-gone/shots';
import {assemblePaintedTimeline} from '../../scenes/assemble';
import type {AudioTrack} from '../../scenes/types';
import {eg2PlateId, EG2_CAPTION_CENTRE_Y, EG2_LINES} from '../../painted/shots/everyone-gone-ep02';
import {EG2_SHOTS} from '../../painted/everyone-gone/ep02/sheet';
import type {EpisodeVideos} from '../types';
import amplitude2 from '../../../scripts/everyone-gone/ep02/EG-EP02-SHORT.amplitude.json';

/**
 * EG-EP01-SHORT Draft (W5.3, Editor, 3 Nov 2026). Scene sheets `EG-SC-R2` (scripts/everyone-gone/short/index.md + sc01-sc04.md),
 * 17 shots = 17 timeline scenes, 1945 f at 30 fps; each scene mounts the registry plate `EG-<shot id>` (src/painted/shots/everyone-gone.tsx,
 * Boss's `plateOf`). Narration = the locked take (store EG/narration EG-EP01-SHORT-narration-lock.wav), offset 0, unprocessed here.
 * Timing source: voice-timing.md x30. Word edges measured on the lock wav (20 ms RMS envelope, 3 Nov 2026), replacing the `est` marks:
 *  - L19 `ที่` starts 57.70 s = f1731 (est 1728, so the SH02/SH03 cut at 1728 is 3 f before the word); the line ends 58.76 s = f1763.
 *  - L11 `โบกมือ` 28.40-29.22 s = f852-877 (est 880); `กระ` 29.54 s = f886, `โดด` 29.76-30.02 s = f893-901 (est 893). Boss's wave f14-40
 *    (859-885) and hop 1 (895-907, peak 901) sit on them; hop 2 (909-921) lands in the pause after `กระโดด`.
 * Captions: verbatim script wording, cue = line start to end + 6 f clamped to its shot end; L19 is split at the SH02/SH03 cut (1728): the first half runs to the cut, `ที่เดินผ่านคุณไป` appears at its word start
 * f1731 (Draft rev 2: it no longer shows in SH02 ahead of the voice). Door shots (S01-B02-SH03, S02-B01-SH04): the cue starts at the line start, after the door has opened.
 * Sound stage (3 Nov 2026): full audio spine below; SND-NG01..08 generated and filed (sound-notes.md).
 */
const FPS = 30;
const frames = EG_SHOTS.map(([, n]) => n);
const starts = frames.map((_, i) => frames.slice(0, i).reduce((a, b) => a + b, 0));
const TOTAL = frames.reduce((a, b) => a + b, 0);
if (TOTAL !== 1945) throw new Error(`EG-EP01-SHORT: shots sum to ${TOTAL}, scene sheets say 1945`);
const cuts = EG_SHOTS.map(([id, n], i) => ({id, start: starts[i], end: starts[i] + n}));

/** [line start f, speech end f, text] from voice-timing.md x30 (sheet frames). */
const LINES: [number, number, string][] = [
  [8, 69, 'คุณตื่นมาเจ็ดโมงเช้า…'],
  [78, 152, 'กรุงเทพฯ เงียบ… จนได้ยินเสียงตู้เย็น'],
  [167, 218, 'คุณไม่เห็นใครเลยสักคน'],
  [238, 375, 'รถไฟฟ้ายังวิ่งผ่านตามปกติ…\nแต่ในขบวน คุณมองไม่เห็นใครเลย'],
  [397, 475, 'ฝั่งตรงข้าม ประตูร้านสะดวกซื้อ เปิดเอง…'],
  [490, 518, 'เซนเซอร์คงรวน'],
  [541, 604, 'หม้อข้าวต้มริมทาง ยังมีไอร้อน'],
  [618, 686, 'กาแฟเย็นบนโต๊ะ น้ำแข็งยังไม่ละลาย'],
  [704, 778, 'เหมือนทุกคน… เพิ่งหายไปเมื่อกี้นี้เอง'],
  [800, 838, 'คุณข้ามไปที่ร้านนั้น'],
  [851, 945, 'คุณโบกมือ… กระโดด… ประตูก็ยังนิ่ง'],
  [963, 1015, 'กระจกสะท้อนแค่ถนนว่างๆ'],
  [1034, 1138, 'แล้วจู่ๆ มันก็เปิด… ทั้งที่คุณไม่เห็นใครเลย'],
  [1166, 1279, 'ประตูอัตโนมัติหลายบาน\nมีเซนเซอร์ที่คอยส่ง\nคลื่นไมโครเวฟออกมา'],
  [1295, 1390, 'ถ้ามีอะไรขยับ\nคลื่นที่สะท้อนกลับจะเปลี่ยนความถี่'],
  [1402, 1493, 'ประตูแบบนี้ไม่ได้มองหาคน…\nมันรอแค่สิ่งที่ขยับ'],
  [1516, 1633, 'แต่สำหรับประตูบานนี้…\nตรงหน้ามันไม่มีอะไรขยับเลย'],
  [1644, 1728, 'มันไม่ได้เสีย… มันแค่เปิดให้ใครบางคน'],
  [1731, 1763, 'ที่เดินผ่านคุณไป'],
  [1781, 1820, 'ทุกคนไม่ได้หายไปไหน…'],
  [1845, 1904, 'คนที่หายไป… คือคุณ'],
];

type Cue = {from: number; to: number; text: string};
const cueEnd = (from: number, end: number) => {
  const cut = cuts.find((c) => from >= c.start && from < c.end)!;
  return from === 1644 ? end : Math.min(end + 6, cut.end);
};
const CUES: Cue[] = LINES.map(([from, end, text]) => ({from, to: cueEnd(from, end), text}));

/** Caption events on the composition clock: text at cue start, blank at cue end, and every scene opens with a caption event. */
const captions = (() => {
  const events = new Map<number, string>();
  for (const c of CUES) events.set(c.to, events.get(c.to) ?? '');
  for (const c of CUES) events.set(c.from, c.text);
  for (const cut of cuts) {
    if (events.has(cut.start)) continue;
    const live = CUES.find((c) => c.from < cut.start && c.to > cut.start);
    events.set(cut.start, live ? live.text : '');
  }
  return [...events].sort((a, b) => a[0] - b[0]).map(([at, text]) => ({at, text}));
})();

const timeline = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts,
  shots: cuts.map((cut) => ({at: cut.start, cue: {shot: egPlateId(cut.id)}})),
  captions,
  // `reveal_riser-tension_01` (3.69 s) ends on f1493 (end of L17): starts at global 1382 = SH01 f242.
  sounds: [{at: 1382, cue: {src: 'sfx/reveal/reveal_riser-tension_01.wav', volume: 0.5}}],
});

const sec = (f: number) => f / FPS;
/** Sound stage (Editor, 3 Nov 2026): Film's Sound lines (index.md audio spine, sc01-sc04). Frames are global; see scripts/everyone-gone/short/sound-notes.md. */
const at = (f: number) => f / FPS;
/** One-shot or bed cut from global frame `from` to `to`; `trim` = seconds skipped at the head of the file. */
const t = (src: string, from: number, to: number, o: Partial<AudioTrack> = {}): AudioTrack => ({src, startSec: at(from), endSec: at(to), ...o});
const HUM = 'audio/room/room_shop-fridge-hum_01.wav';
const WALK = 'sfx/foley/foley_walk-sneakers-asphalt_01.wav';
const GLIDE = 'sfx/mechanical/mechanical_sliding-door-glide_01.wav';
const CHIME = 'sfx/ui/ui_entry-chime-two-tone_01.wav';
const TICK = 'sfx/ui/ui_card-tick-sweep_01.wav';
const audio: AudioTrack[] = [
  // Fridge hum is 11 s and not a loop: plain loop (seam not cross-faded). Closer (+3 dB) in S02, -6 dB under S03, back by f1884.
  t(HUM, 0, 789, {volume: 0.3, loop: true, fadeOutSec: 0.3}),
  t(HUM, 789, 1140, {volume: 0.4, loop: true, fadeInSec: 0.3, fadeOutSec: 0.3}),
  t(HUM, 1140, 1884, {volume: 0.15, loop: true, fadeInSec: 0.3, fadeOutSec: 0.3}),
  t(HUM, 1884, TOTAL, {volume: 0.3, loop: true, fadeInSec: 0.3, fadeOutSec: 1}),
  // Drone from SH03 f60 (global 1456), out over 1846-1878.
  t('audio/bed/bed_dark-drone-sub_01.wav', 1456, 1878, {volume: 0.25, loop: true, fadeInSec: 0.3, fadeOutSec: 1.07}),
  // Music: pad f0-530 (S01-B01/B02), felt notes f160-789 (out before L10 at 800, silence 779-800), S03 pulse bed, S02 heartbeat.
  t('audio/tone/tone_soft-sustain-reflective_01.wav', 0, 530, {volume: 0.15, loop: true, fadeInSec: 1, fadeOutSec: 1.5, duckUnderNarration: 0.6}),
  t('audio/bed/bed_warm-pad-felt-third_01.wav', 160, 789, {volume: 0.12, loop: true, fadeInSec: 1, fadeOutSec: 0.6, duckUnderNarration: 0.6}),
  t('sfx/tension/tension_heartbeat-slow_01.wav', 819, 1140, {volume: 0.14, loop: true, fadeInSec: 1.5, fadeOutSec: 0.5}),
  t('audio/bed/bed_clean-pulse-95bpm_01.wav', 1166, 1500, {volume: 0.12, loop: true, fadeInSec: 0.5, fadeOutSec: 1.5, duckUnderNarration: 0.6}),
  // Outdoor room tone with faint birds (S01-B01 from f20, into SH01 of B02); pot steam hiss under S01-B03-SH01..SH03.
  t('audio/room/room_soi-morning-quiet_01.wav', 20, 230, {volume: 0.06, loop: true, fadeInSec: 1, fadeOutSec: 0.8}),
  t('audio/room/room_pot-steam-hiss_01.wav', 530, 789, {volume: 0.07, loop: true, fadeInSec: 0.5, fadeOutSec: 0.6}),
  // Footsteps (the file's first step pair is at 0.4 s: trim 0.3 s): S01-B02-SH01 f0-60, S02-B01-SH01 f2-44, S04-B01-SH03 f2-18.
  t(WALK, 160, 220, {volume: 0.3, trimStartSec: 0.3, fadeOutSec: 0.2}),
  t(WALK, 791, 833, {volume: 0.3, trimStartSec: 0.3, fadeOutSec: 0.2}),
  t(WALK, 1730, 1746, {volume: 0.3, trimStartSec: 0.3, fadeOutSec: 0.1}),
  // BTS pass-by: S01-B02-SH02 (starts f228), peak about f81, cut before the SH03 door at 380.
  t('sfx/vehicle/vehicle_bts-viaduct-passby_01.wav', 288, 374, {volume: 0.28, fadeOutSec: 0.5}),
  // Doors (DOOR_CLOCK open commands 380, 1018, 1653; chime onset +3 f).
  t(GLIDE, 380, 380 + 75, {volume: 0.3}),
  t(CHIME, 383, 383 + 36, {volume: 0.2, fadeOutSec: 0.3}),
  t(GLIDE, 1018, 1018 + 75, {volume: 0.35}),
  t(CHIME, 1021, 1021 + 36, {volume: 0.45, fadeOutSec: 0.3}),
  t(GLIDE, 1653, 1653 + 75, {volume: 0.12}),
  t(CHIME, 1656, 1656 + 36, {volume: 0.07, fadeOutSec: 0.3}),
  // Ice settle ticks (S01-B03-SH02 f52, S01-B03-SH03 f30); jump landings (S02-B01-SH02 f62, f76; first hit of the file twice).
  t('sfx/water/water_ice-settle-tick_01.wav', 663, 663 + 6, {volume: 0.2}),
  t('sfx/water/water_ice-settle-tick_01.wav', 725, 725 + 6, {volume: 0.15}),
  t('sfx/foley/foley_jump-scuff-sneakers_01.wav', 907, 907 + 9, {volume: 0.3, fadeOutSec: 0.05}),
  t('sfx/foley/foley_jump-scuff-sneakers_01.wav', 921, 921 + 9, {volume: 0.3, fadeOutSec: 0.05}),
  // S03 card: wave ticks on each arc launch (SH01 f40 + 24n, to f60 of SH03 = 1456), soft sweep f112 (1252).
  ...Array.from({length: 12}, (_, i) => t(TICK, 1180 + 24 * i, 1180 + 24 * i + 9, {volume: 0.18, trimStartSec: 0.25, fadeOutSec: 0.05})),
  t(TICK, 1252, 1252 + 24, {volume: 0.2, trimStartSec: 1.0, fadeOutSec: 0.1}),
];

/**
 * EG-EP02-SHORT Draft (W5.3, Editor, 3 Nov 2026). Scene sheets `EG2-SC-R2.0` (scripts/everyone-gone/ep02/index.md + sc01-sc05.md), rows SS-R2.1, voice T-v4
 * (= T-v3 + GR1: the L11 gap 0.88 -> 1.25 s accepted by the user, 2026-11-03; GR2/GR3 declined): store EG/narration/EG-EP02-SHORT-narration-B-x108-tight-v4.wav,
 * 61.62 s = 1849 f + 90 f hold = 1939 f. 19 shots = 19 timeline scenes (sizes from Boss's EG2_SHOTS, which carry the +11 f of GR1 from S04-B01-SH01); each scene mounts the
 * registry plate `EG2-<shot id>` (src/painted/shots/everyone-gone-ep02.tsx). Offset 0. Captions: verbatim script wording, one cue per line (line frames in EG2_LINES), cue end =
 * line end + 6 f, never past the end of the shot holding the line's last frame; a caption live at a cut is repeated at the cut. CaptionShade band lives in the plate overlay.
 * The in-scene dissolves (S04-SH04..SH07, VD06) are inside Boss's plates. The S05 plate owns its end black, so the ending adds no hold or fade.
 */
const EG2_FRAMES = EG2_SHOTS.map(([, n]) => n);
const eg2Starts = EG2_FRAMES.map((_, i) => EG2_FRAMES.slice(0, i).reduce((a, b) => a + b, 0));
const EG2_TOTAL = EG2_FRAMES.reduce((a, b) => a + b, 0);
if (EG2_TOTAL !== 1939) throw new Error(`EG-EP02-SHORT: shots sum to ${EG2_TOTAL}, T-v4 sheets say 1939`);
const eg2Cuts = EG2_SHOTS.map(([id, n], i) => ({id, start: eg2Starts[i], end: eg2Starts[i] + n}));
const eg2Cues = EG2_LINES.map(([from, end, text]) => ({from, to: Math.min(end + 6, eg2Cuts.find((c) => end - 1 >= c.start && end - 1 < c.end)!.end), text}));
const eg2Captions = (() => {
  const events = new Map<number, string>();
  for (const c of eg2Cues) events.set(c.to, events.get(c.to) ?? '');
  for (const c of eg2Cues) events.set(c.from, c.text);
  for (const cut of eg2Cuts) {
    if (events.has(cut.start)) continue;
    const live = eg2Cues.find((c) => c.from < cut.start && c.to > cut.start);
    events.set(cut.start, live ? live.text : '');
  }
  return [...events].sort((a, b) => a[0] - b[0]).map(([at, text]) => ({at, text}));
})();
const timeline2 = assemblePaintedTimeline({
  clockRate: FPS, precision: 4, cuts: eg2Cuts,
  shots: eg2Cuts.map((cut) => ({at: cut.start, cue: {shot: eg2PlateId(cut.id)}})),
  captions: eg2Captions,
});

/**
 * Sound stage (Editor, 3 Nov 2026; draft levels, measured not listened). Clock = Film's index.md "Sound direction" shifted +11 f from f1123 (GR1). New cues generated and filed
 * (EG2 set, library 3 Nov 2026): piano, dawn, Yaowarat, open wind, pier, ferry, murmur far/close, hood, incense, wind-on-paper, gust+flip. `AMB-SOI` = existing
 * `room_soi-morning-quiet_01` + `electric_streetlamp-hum-loop_01` (not generated). `SFX-BOAT-NEAR` = the same ferry file, louder. No stinger, riser or hit (FIC007).
 */
const A = 'audio/';
const PIANO = A + 'bed/bed_eg2-solo-piano-sparse_01.wav';
const DAWN = A + 'outdoor/outdoor_dawn-street-empty_01.wav';
const YAO = A + 'outdoor/outdoor_yaowarat-signs-buzz_01.wav';
const WIND = A + 'outdoor/outdoor_wind-open-roundabout_01.wav';
const PIER = A + 'water/water_pier-lapping-pigeons_01.wav';
const SOI = A + 'room/room_soi-morning-quiet_01.wav';
const LAMP = A + 'electric/electric_streetlamp-hum-loop_01.wav';
const MFAR = A + 'crowd/crowd_murmur-far-bangkok_01.wav';
const MCLOSE = A + 'crowd/crowd_murmur-close-bangkok_01.wav';
const BOAT = A + 'vehicle/vehicle_river-ferry-passing_01.wav';
const D = 0.6;
const audio2: AudioTrack[] = [
  // Music: opening piano f0-400; rests after L05; pad under L09; quiet return after the gust; melody swell with the dissolves; opening figure under L17-L19, rings out in the hold.
  t(PIANO, 0, 400, {volume: 0.25, fadeInSec: 1, fadeOutSec: 1.5, duckUnderNarration: D}),
  t(A + 'bed/bed_warm-pad-felt-third_01.wav', 785, 925, {volume: 0.1, fadeInSec: 1, fadeOutSec: 1.5, duckUnderNarration: D}),
  t(PIANO, 1226, 1417, {volume: 0.12, trimStartSec: 12, fadeInSec: 1.5, fadeOutSec: 0.5, duckUnderNarration: D}),
  t(PIANO, 1417, 1640, {volume: 0.2, trimStartSec: 20, fadeInSec: 1.5, fadeOutSec: 0.5, duckUnderNarration: D}),
  t(PIANO, 1640, 1929, {volume: 0.22, trimStartSec: 2, fadeInSec: 0.5, fadeOutSec: 3, duckUnderNarration: D}),
  // Place beds (cross with the picture; each fades 0.3-0.5 s at its edges).
  t(DAWN, 0, 214, {volume: 0.22, loop: true, fadeInSec: 0.5, fadeOutSec: 0.5}),
  t(YAO, 206, 288, {volume: 0.2, loop: true, fadeInSec: 0.5, fadeOutSec: 0.3}),
  t(WIND, 288, 404, {volume: 0.16, loop: true, fadeInSec: 0.3, fadeOutSec: 0.3}),
  t(PIER, 396, 585, {volume: 0.35, loop: true, fadeInSec: 0.5, fadeOutSec: 0.3}),
  t(YAO, 577, 806, {volume: 0.12, loop: true, fadeInSec: 0.5, fadeOutSec: 0.3}),
  t(PIER, 806, 920, {volume: 0.32, loop: true, fadeInSec: 0.4, fadeOutSec: 0.4}),
  t(SOI, 912, 1134, {volume: 0.14, loop: true, fadeInSec: 0.5, fadeOutSec: 0.5}),
  t(LAMP, 912, 1119, {volume: 0.08, loop: true, fadeInSec: 0.8, fadeOutSec: 1}),
  t(LAMP, 1157, 1417, {volume: 0.07, loop: true, fadeInSec: 0.8, fadeOutSec: 0.5}),
  t(WIND, 1134, 1240, {volume: 0.1, loop: true, fadeInSec: 0.3, fadeOutSec: 1.5}),
  t(YAO, 1417, 1504, {volume: 0.2, loop: true, fadeInSec: 0.5, fadeOutSec: 0.3}),
  t(WIND, 1504, 1567, {volume: 0.16, loop: true, fadeInSec: 0.3, fadeOutSec: 0.3}),
  t(PIER, 1567, 1603, {volume: 0.35, loop: true, fadeInSec: 0.2, fadeOutSec: 0.2}),
  t(SOI, 1603, 1640, {volume: 0.14, loop: true, fadeInSec: 0.2, fadeOutSec: 0.4}),
  t(PIER, 1640, 1929, {volume: 0.35, loop: true, fadeInSec: 0.8, fadeOutSec: 2}),
  // Crowd murmur (CL02): far bed under everything until the silence before the gust; close bed fades up with the dissolves and stays until the end; gone after L19.
  t(MFAR, 0, 1125, {volume: 0.05, loop: true, fadeInSec: 1, fadeOutSec: 1}),
  t(MFAR, 402, 571, {volume: 0.04, loop: true, fadeInSec: 0.8, fadeOutSec: 0.8}),
  t(MFAR, 1160, 1450, {volume: 0.04, loop: true, fadeInSec: 1, fadeOutSec: 1.5}),
  t(MCLOSE, 1459, 1520, {volume: 0.06, loop: true, fadeInSec: 1.2}),
  t(MCLOSE, 1520, 1620, {volume: 0.11, loop: true, fadeInSec: 0.5}),
  t(MCLOSE, 1620, 1860, {volume: 0.14, loop: true, fadeInSec: 0.5, fadeOutSec: 2, duckUnderNarration: D}),
  // Ferry: far on the pier hall (S01-B02-SH03), nearer under S04-SH06 and S05.
  t(BOAT, 440, 440 + 240, {volume: 0.14}),
  t(BOAT, 1567, 1567 + 73, {volume: 0.22, fadeOutSec: 0.1}),
  t(BOAT, 1640, 1640 + 240, {volume: 0.22, trimStartSec: 0, fadeOutSec: 1}),
  // One-shots: hood rustle on the hoodPull (S01-B01-SH02 f32-70 = 160-198, swap f60 = 188), incense, wind on paper, the gust and flip (S04-SH01 f0-23 = 1134-1157).
  t(A + 'foley/foley_hoodie-hood-pull_01.wav', 176, 176 + 26, {volume: 0.5, fadeOutSec: 0.1}),
  t(A + 'foley/foley_incense-crackle_01.wav', 663, 663 + 36, {volume: 0.6, fadeOutSec: 0.2}),
  t(A + 'foley/foley_wind-on-paper_01.wav', 699, 806, {volume: 0.25, loop: true, fadeInSec: 0.3, fadeOutSec: 0.4}),
  t(A + 'foley/foley_wind-on-paper_01.wav', 912, 1119, {volume: 0.18, loop: true, fadeInSec: 0.5, fadeOutSec: 1}),
  t(A + 'whoosh/whoosh_gust-paper-flip_01.wav', 1134, 1134 + 40, {volume: 0.55, fadeOutSec: 0.2}),
  t(A + 'whoosh/whoosh_page-flip-paper_01.wav', 1138, 1138 + 17, {volume: 0.2, fadeOutSec: 0.1}),
];

const everyoneGone: EpisodeVideos = {
  episode: 'everyone-gone',
  videos: [
    {
      id: 'EG-EP01-SHORT', format: 'short', timeline, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, audio,
      captionStyle: {preset: 'outline', position: 'bottom', bottomEdgeY: 560}, chrome: {channelLabel: '@TamMaiLa', progressBar: false},
      narration: {src: 'narration/EG-EP01-SHORT.wav', amplitude, fps: FPS},
    },
    {
      id: 'EG-EP02-SHORT', format: 'short', timeline: timeline2, ending: 'A_fade', endHoldSec: 0, endFadeSec: 0, audio: audio2,
      captionStyle: {preset: 'outline', position: 'bottom', centerY: EG2_CAPTION_CENTRE_Y}, chrome: {channelLabel: '@TamMaiLa', progressBar: false},
      narration: {src: 'narration/EG-EP02-SHORT.wav', amplitude: amplitude2, fps: FPS},
    },
  ],
};
export default everyoneGone;
