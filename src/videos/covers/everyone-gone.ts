import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EG-EP01-SHORT-COVERS: five cover candidates (docs/cover-principles.md). The story has no face, so C uses the viewer's
 * own waving hand. None shows the twist (CV04: "the one who disappeared is you"). Thai copy by the coordinator.
 */
export const EG_COVERS: Cover[] = [
  {id: 'A-question', plate: 'EG-S01-B03-SH02', local: 50, lines: [{text: 'ทุกคนหายไปไหน?', y: 1330, size: 122, accent: true}, {text: 'น้ำแข็งยังไม่ทันละลาย', y: 1460, size: 80}]},
  {id: 'B-door', plate: 'EG-S04-B01-SH02', local: 54, lines: [{text: 'ประตูเปิดเอง', y: 1330, size: 160, accent: true}, {text: 'ทั้งที่ไม่มีใครเลย', y: 1460, size: 86}]},
  {id: 'C-hand', plate: 'EG-S04-B01-SH03', local: 28, lines: [{text: 'โบกจนสุดแขน', y: 560, size: 150}, {text: 'ประตูก็ไม่เปิด', y: 710, size: 130, accent: true}], scrim: false},
  {id: 'D-mystery', plate: 'EG-S01-B02-SH02', local: 88, lines: [{text: 'กรุงเทพฯ', y: 1310, size: 170}, {text: 'ไม่เหลือใคร', y: 1480, size: 170, accent: true}]},
  {id: 'E-fact', plate: 'EG-S03-B01-SH01', local: 153, lines: [{text: 'มันไม่ได้มองหาคน', y: 1330, size: 120, accent: true}, {text: 'ประตูอัตโนมัติ "เห็น" อะไร?', y: 1460, size: 80}]},
];

export const EG_COVER_STYLE: CoverStyle = {accent: '#ff7a52', scrimY: 1000};
