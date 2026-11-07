import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP05-SHORT-COVERS: rough comps of the cover options (docs/cover-principles.md, CV01-CV10) for the ant-size Short
 * (script EDU-EP05-SCRIPT-R1.3a/R1.4, title "ถ้าคุณตัวเล็กเท่ามด", never repeated word for word, CV02). Design and Boss
 * new-art handoffs: scripts/edu-series/ep05/covers.md. Five angles A-E (CV09) plus F, the user's CLICKBAIT version
 * (2026-11-07). Plates are the episode's registry plates `EDU5-<shot id>` (CV07); `local` is the shot-local frame. Thai copy
 * stays inside what the video says (CV04): L02 "แทบไม่เป็นอะไรเลย" (hedged, so the fall lines end in "?"), L06 chair jump
 * "ราว ๆ", L08 "เหนียว", L11 cold in the shade, L14/L16 "แล้วคุณล่ะ". No cover shows the crumb lift (the payoff).
 * Text centred on x 540, inside y 240-1680, last baseline <= 1470, clear of the right 120 px (CV06); headlines 184-200
 * as EP01-EP04 (CV08; E is 150 to fit the formula in x 120-960). `plateMove` and `stretch` are no-ops on painted plates (EP03 note), so neither is used.
 */
const RED = '#ff3b30';

export const EDU5_COVERS: Cover[] = [
  // A question. Route N (user picked A, 2026-11-07): EDU5-COVER-A, TINY small in the planter clearing, blades 13-24x her height, hazy towers behind (covers.md N-A).
  {id: 'A-forest', plate: 'EDU5-COVER-A', local: 16,
    lines: [{text: 'รอดไหม?', y: 1340, size: 200, accent: true}, {text: 'ในโลกที่หญ้าสูงเท่าตึก', y: 1470, size: 88}]},
  // B subject. S01-B03-SH02 l43: hand stuck in the dew drop, the drop stretching like jelly (L08).
  {id: 'B-drop', plate: 'EDU5-S01-B03-SH02', local: 43,
    lines: [{text: 'ติดหยดน้ำ!', y: 1340, size: 192, accent: true}, {text: 'ดึงยังไงก็ไม่หลุด', y: 1470, size: 92}]},
  // C face. S01-B04-SH02 l100: shivering in the shade, the warmth puff leaking out (L12, LF04).
  {id: 'C-cold', plate: 'EDU5-S01-B04-SH02', local: 100,
    lines: [{text: 'หนาวจนสั่น', y: 1340, size: 192, accent: true}, {text: 'แค่ยืนในร่มหญ้า', y: 1470, size: 92}]},
  // D mystery. S01-B05-SH01 l44: the ant with a leaf far bigger than itself, TINY beside her crumb (before the lift).
  {id: 'D-ant', plate: 'EDU5-S01-B05-SH01', local: 44,
    lines: [{text: 'มดยกไหว', y: 1340, size: 200, accent: true}, {text: 'แล้วคุณล่ะ?', y: 1470, size: 96}]},
  // E number. S01-B02-SH04 l46: sat up after the landing, puzzled and unhurt (L06 "ราว ๆ กระโดดลงจากเก้าอี้").
  {id: 'E-number', plate: 'EDU5-S01-B02-SH04', local: 46,
    lines: [{text: '10 ชั้น = เก้าอี้?', y: 1340, size: 150, accent: true}, {text: 'ตกแล้วแรงแค่นี้', y: 1470, size: 92}]},
  // F CLICKBAIT. S01-B02-SH03 l16: the facade from the lawn, TINY a speck mid-fall inside the episode's ring; red circle + arrow.
  {id: 'F-clickbait', plate: 'EDU5-S01-B02-SH03', local: 16,
    layout: {elements: [
      {kind: 'ellipse', cx: 500, cy: 712, rx: 105, ry: 105, fill: 'none', stroke: RED, sw: 16},
      {kind: 'path', d: 'M 700 1080 Q 760 900 610 790', fill: 'none', stroke: RED, sw: 18, linecap: 'round'},
      {kind: 'path', d: 'M 575 765 L 660 778 L 618 840 Z', fill: RED},
      {kind: 'rect', x: 375, y: 262, w: 330, h: 66, rx: 33, fill: '#0b0d16', opacity: 0.6},
      {kind: 'text', text: 'ถ้าตัวเท่ามด', x: 540, y: 308, size: 40, anchor: 'middle', fill: '#f4efe6', weight: 700},
    ]},
    lines: [{text: 'ตก 10 ชั้น', y: 1250, size: 170}, {text: 'ไม่ตาย!?', y: 1450, size: 220, accent: true}]},
];

/** Morning sun / crumb gold (warm against the green grass and the blue shade); scrim from y 1120 for the pale sky and lawn plates. */
export const EDU5_COVER_STYLE: CoverStyle = {accent: '#ffb63a', scrimY: 1120};
