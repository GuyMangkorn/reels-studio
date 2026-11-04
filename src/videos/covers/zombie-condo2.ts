import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * ZCONDO2-SHORT-TH-COVERS: five cover candidates (docs/cover-principles.md, CV09 angles A question, B creature, C face,
 * D mystery, E number). All plates are the episode's own pinned shots (CV07); none shows the ending choice (CV04).
 * Design notes: scripts/zombie-condo2/build-notes.md "Covers (Film, 4 Nov 2026)".
 */
export const ZC2_COVERS: Cover[] = [
  {id: 'A-question', plate: 'ZC2D-B09-SH03', local: 60, lines: [{text: 'มีใครอยู่ไหม?', y: 1300, size: 150, accent: true}, {text: 'เสียงเรียกหน้าประตู วันที่ 3', y: 1430, size: 72}]},
  {id: 'B-creature', plate: 'ZC2D-B01-SH03', local: 40, lines: [{text: 'มันหันมา', y: 1330, size: 220, accent: true}, {text: 'ปลายทางเดินคอนโด', y: 1460, size: 80}]},
  {id: 'C-face', plate: 'ZC2D-B02-SH05', local: 46, lines: [{text: 'ห้ามมีเสียง', y: 1330, size: 180, accent: true}, {text: 'พวกมันตามเสียง', y: 1460, size: 84}]},
  {id: 'D-mystery', plate: 'ZC2D-B04-SH01', local: 30, lines: [{text: 'ไฟดับทั้งตึก', y: 1250, size: 130}, {text: 'แต่น้ำยังไหล?', y: 1420, size: 145, accent: true}]},
  {id: 'E-number', plate: 'ZC2D-B06-SH01', local: 120, lines: [{text: '4 ชั่วโมง', y: 1330, size: 220, accent: true}, {text: 'ตู้เย็นห้ามเปิด', y: 1460, size: 88}]},
];

export const ZC2_COVER_STYLE: CoverStyle = {accent: '#ff7a3a', scrimY: 1020};
