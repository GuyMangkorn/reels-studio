// EDU-EP18-SHORT clock (Editor, 14 Nov 2026): the 22 shots of scripts/edu-series/ep18/storyboard.md EDU-EP18-SHEET-R1.1, global frames at 30 fps, 1737 f (57.90 s).
export const FPS = 30;
export const TOTAL_FRAMES = 1737;
/** [shot id, start frame, length]. Shots tile [0, 1737) with no gap. */
export const SHOT_TABLE: [string, number, number][] = [
  ['SH01', 0, 92], ['SH02', 92, 30], ['SH03', 122, 68], ['SH04', 190, 113], ['SH05', 303, 66], ['SH06', 369, 66], ['SH07', 435, 53], ['SH08', 488, 40],
  ['SH09', 528, 99], ['SH10', 627, 73], ['SH11', 700, 88], ['SH12', 788, 67], ['SH13', 855, 82], ['SH14', 937, 99], ['SH15', 1036, 102], ['SH16', 1138, 84],
  ['SH17', 1222, 42], ['SH18', 1264, 130], ['SH19', 1394, 136], ['SH20', 1530, 93], ['SH21', 1623, 36], ['SH22', 1659, 78],
];
export type ShotId = (typeof SHOT_TABLE)[number][0];
export const shotStart = (id: string) => SHOT_TABLE.find(([s]) => s === id)![1];
export const shotLen = (id: string) => SHOT_TABLE.find(([s]) => s === id)![2];
/** Recipe answer window (script M01-M09, OQ4): L07 onset to L09 onset, kept at 266 f (8.87 s). */
export const WINDOW = {l07: 1264, l08: 1394, l08b: 1426, l09: 1530};
