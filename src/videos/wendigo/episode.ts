import type {SubtitleCue, Timeline} from '../../scenes/types';
import {WDG_FPS, WDG_SHOTS, type WdgShotId} from '../../painted/wendigo/timed';

/**
 * WDG-EP01-SHORT (Editor assembly of WDG-SS-R2.2, script WDG-SCRIPT-R3): one scene per shot, plate `WDG-<shot ID>`,
 * composition-global start from `WDG_SHOTS`. Captions are the verbatim script R3 phrases at the frames of the scene sheets
 * (locked narration pTIGHT3 at N0 = 1262; S01 clips at their placements), composition-global [from, to) half-open.
 */
export const EPISODE_ID = 'WDG-EP01-SHORT';
export const N0 = 1262;
export const SHOT_ORDER = Object.keys(WDG_SHOTS) as WdgShotId[];

/** [from, to, text] in composition-global frames; a gap between two phrases is a blank caption. */
export const CAPTIONS: [number, number, string][] = [
  [6, 40, 'หิวไหม…'],
  [62, 96, 'เสียงนั้น…'], [100, 182, 'ถามผมทุกคืน'],
  [196, 271, 'พายุหิมะขังเราไว้มาเจ็ดวัน'], [348, 406, 'อาหารหมดตั้งแต่วันที่สาม…'],
  [449, 494, 'ทุกเช้า…'], [505, 586, 'มีรอยเท้าเดินวนรอบเต็นท์'],
  [607, 712, 'คืนนี้ผมตามรอยนั้นไป…'], [722, 790, 'มันพอดีกับรองเท้าของผม'],
  [820, 908, 'แล้วผมก็ได้ยิน…'], [915, 982, 'เสียงนั้นอีก…'],
  [987, 1034, 'จากปากของผมเอง'], [1038, 1100, 'หิว…'],
  [1270, 1356, 'ความกลัวแบบนี้ มาจากตำนานจริง…'], [1360, 1390, 'เวนดิโก'],
  [1396, 1498, 'เป็นเรื่องเล่าของชนพื้นเมือง\nกลุ่มภาษาอัลกอนเควียน'], [1500, 1558, 'อย่างโอจิบเวและครี'], [1558, 1634, 'ในแคนาดาและทางเหนือของสหรัฐฯ'],
  [1646, 1779, 'ตามความเชื่อ มันคือวิญญาณ\nหรือปีศาจแห่งฤดูหนาวและความหิว'], [1779, 1865, 'ที่กินคน เล่ากันว่ายิ่งกิน…'], [1873, 1899, 'ยิ่งหิว'],
  [1905, 1942, 'และในหลายเรื่องเล่า'], [1946, 2004, 'คนธรรมดาก็กลายเป็นมันได้'], [2004, 2102, 'ถ้าปล่อยให้ความหิว\nหรือความโลภครอบงำ'],
  [2123, 2187, 'ราวปี 1879…'], [2191, 2306, 'ชายชาวครีชื่อสวิฟต์ รันเนอร์\nฆ่าคนในครอบครัวตัวเอง'], [2306, 2363, 'ในคดีที่มีการกินเนื้อคน'],
  [2370, 2460, 'เขาอ้างว่าถูกวิญญาณเวนดิโก\nตามรังควาน…'],
  [2466, 2532, 'แต่ศาลตัดสินประหารชีวิตเขา'],
  [2544, 2620, 'นักเขียนพื้นเมืองบางคนใช้เวนดิโก'], [2620, 2700, 'แทนความโลภที่กินเท่าไหร่ก็ไม่พอ'],
  [2706, 2740, 'ปีศาจตัวนี้…'], [2742, 2804, 'แค่มีเสียงเล็กๆ ในใจ'], [2804, 2849, 'ที่คอยถามว่า…'],
];

/** Caption cues of one shot as scene-local cues (the first cue starts at 0; blank text is no caption). */
export const cuesOf = (shot: WdgShotId): SubtitleCue[] => {
  const {g, n} = WDG_SHOTS[shot];
  const cues: SubtitleCue[] = [];
  let at = 0;
  const push = (l: number, text: string) => { if (cues.length && cues[cues.length - 1].atSec === l / WDG_FPS) cues.pop(); cues.push({atSec: l / WDG_FPS, text}); };
  for (const [from, to, text] of CAPTIONS) {
    const a = Math.max(from, g) - g, b = Math.min(to, g + n) - g;
    if (b <= a) continue;
    if (a > at || cues.length === 0) push(at, '');
    push(a, text);
    at = b;
  }
  if (at < n) push(at, '');
  return cues.length ? cues : [{atSec: 0, text: ''}];
};

/** The scenes: one per shot. `S03-B01-SH03` dissolves in over 7 frames from the last SH02 frame (G2462), hard cut out at G2536. */
export const wendigoTimeline = (): Timeline => SHOT_ORDER.map((shot) => ({
  durationSec: WDG_SHOTS[shot].n / WDG_FPS, bg: 'none', actors: [], subtitle: '',
  subtitleCues: cuesOf(shot),
  painted: {shots: [{shot: `WDG-${shot}`, atSec: 0, ...(shot === 'S03-B01-SH03' ? {dissolveSec: 7 / WDG_FPS} : {})}]},
}));
