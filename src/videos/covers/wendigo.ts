import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * WDG-EP01-SHORT-COVERS: five cover candidates (docs/cover-principles.md, CV09 angles A question, B creature, C face,
 * D mystery, E true case). User picked B (3 Nov 2026). Thai copy by the coordinator.
 */
export const WDG_COVERS: Cover[] = [
  {id: 'A-question', plate: 'WDG-S01-B03-SH04', local: 67, lines: [{text: 'หิวไหม…?', y: 1300, size: 230, accent: true}, {text: 'เสียงที่ถามผมทุกคืน', y: 1440, size: 76}]},
  {id: 'B-creature', plate: 'WDG-S01-B03-SH05', local: 90, lines: [{text: 'WENDIGO', y: 1270, size: 190, accent: true}, {text: 'ปีศาจแห่งความหิว', y: 1410, size: 96}]},
  {id: 'C-face', plate: 'WDG-S01-B03-SH03', local: 115, lines: [{text: 'อย่าตอบมัน', y: 1290, size: 170, accent: true}, {text: 'ถ้ามันถามว่า "หิวไหม"', y: 1420, size: 76}]},
  {id: 'D-mystery', plate: 'WDG-S01-B02-SH04', local: 92, lines: [{text: 'ใครเดินวน', y: 1250, size: 160}, {text: 'รอบเต็นท์?', y: 1420, size: 160, accent: true}]},
  {id: 'E-true-case', plate: 'WDG-S03-B01-SH03', local: 44, lines: [{text: '1879', y: 1300, size: 260, accent: true}, {text: 'คดีจริงของเวนดิโก', y: 1440, size: 84}]},
];

export const WDG_COVER_STYLE: CoverStyle = {accent: '#ff8a3d'};
