// EDU-EP17-SHORT shot table (Editor, 14 Nov 2026): EDU-EP17-SHEET-R1.2 (scripts/edu-series/ep17/storyboard.md "Shot map"), 23 shots tile [0, 1815) at 30 fps. Ids are the sheet's.
export const FPS = 30;
export const TOTAL_FRAMES = 1815;
/** [shot id, start frame, length]. */
export const SHOT_TABLE: [string, number, number][] = [
  ['S01-B01-SH01', 0, 92], ['S01-B01-SH02', 92, 57], ['S01-B01-SH03', 149, 19], ['S01-B01-SH04', 168, 31], ['S01-B01-SH05', 199, 99],
  ['S01-B02-SH06', 298, 81], ['S01-B02-SH07', 379, 45], ['S01-B02-SH08', 424, 65],
  ['S01-B03-SH09', 489, 109], ['S01-B03-SH10', 598, 75], ['S01-B03-SH11', 673, 59], ['S01-B03-SH12', 732, 145],
  ['S01-B04-SH13', 877, 51], ['S01-B04-SH14', 928, 124], ['S01-B04-SH15', 1052, 74],
  ['S01-B05-SH16', 1126, 96], ['S01-B05-SH17', 1222, 77], ['S01-B05-SH18', 1299, 126], ['S01-B05-SH19', 1425, 77],
  ['S01-B06-SH20', 1502, 85], ['S01-B06-SH21', 1587, 45], ['S01-B06-SH22', 1632, 51], ['S01-B06-SH23', 1683, 132],
];
/** Shot 12: the woodpile shrinks in three painted dissolves (sheet: at +90, +110, +130; DF-20261029-painted-timeline-dissolve). [local frame, pile level]. */
export const PILE_STEPS_SH12: [number, number][] = [[0, 1], [90, 0.68], [110, 0.42], [130, 0.2]];
export const PILE_DISSOLVE_SEC = 0.25;
