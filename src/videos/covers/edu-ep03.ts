import type {Cover, CoverElement, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP03-SHORT-COVERS: three cover options (user, 6 Nov 2026: A/B/C, a deviation from CV09's five) for the red-ball Short
 * (script R1.1, "ลูกบอลสีแดงที่หมามองไม่เห็น"). Plates are the episode's registry plates `EDU3-<shot id>` (CV07); `local` is the
 * shot-local frame. Thai copy uses only what the film says (CV04): O2 "ตรงนั้นไง!", L03 "มันไม่ได้ซื่อบื้อนะ", L08 "หมาเห็นสี แค่เห็นไม่เหมือนเรา".
 * The dog-view picture carries the episode tag `ภาพจำลอง (โดยประมาณ)` as on the video (F012). Text centred on x 540, inside y 240-1680,
 * last baseline <= 1470, clear of the right 120 px (CV06); headlines size 184-192 as EP01/EP02 (CV08).
 * Found 6 Nov 2026: `stretch` (font-stretch) is a no-op here, because the shared loadFont declares no stretch range for
 * NotoSansThai.ttf (wdth 62.5-100 exists in the file), so it is clamped to 100% (EP01/EP02's 80 never applied either); and
 * `plateMove` does not move a painted plate (the plate is on the shared canvas under the scene div). Neither is used here;
 * headline widths are kept inside x 120-960 by wording and size.
 */
const TAG = 'ภาพจำลอง (โดยประมาณ)';

export const EDU3_COVERS: Cover[] = [
  // A question. S01-B02-SH02 l32: the dog gallops straight past the red ball in front of it (the miss, F011 dramatization).
  {id: 'A-miss', plate: 'EDU3-S01-B02-SH02', local: 32,
    lines: [{text: 'ตรงนั้นไง!', y: 1340, size: 192, accent: true}, {text: 'ทำไมหมาวิ่งผ่าน?', y: 1470, size: 92}]},
  // B impossible detail. S01-B03-SH03 l32: the VD09a split sweep crosses the ball, half our view (red), half the dog view (olive).
  {id: 'B-split', plate: 'EDU3-S01-B03-SH03', local: 32,
    layout: {elements: [
      {kind: 'rect', x: 330, y: 236, w: 420, h: 62, rx: 31, fill: '#0b0d16', opacity: 0.55},
      {kind: 'text', text: TAG, x: 540, y: 280, size: 36, anchor: 'middle', fill: '#f4efe6', weight: 600},
    ]},
    lines: [
      {text: 'ตาคน', x: 300, y: 790, size: 84}, {text: 'ตาหมา', x: 780, y: 790, size: 84},
      {text: 'ลูกเดียวกัน', y: 1340, size: 180, accent: true}, {text: 'หมาเห็นไม่เหมือนเรา', y: 1470, size: 92},
    ]},
  // C face. S01-B02-SH04 l64: the dog sits facing us, puzzled, after the miss (L03 "มันไม่ได้ซื่อบื้อนะ").
  {id: 'C-face', plate: 'EDU3-S01-B02-SH04', local: 64,
    lines: [{text: 'หาไม่เจอ?', y: 1340, size: 192, accent: true}, {text: 'มันไม่ได้ซื่อบื้อนะ', y: 1470, size: 92}]},
];

/** Ball-red accent (the red ball of the park palette); scrim from y 1120 for the bright lawn plates (as EP01/EP02). */
export const EDU3_COVER_STYLE: CoverStyle = {accent: '#ff5a46', scrimY: 1120};

/**
 * EDU-EP03-SHORT-V2-COVERS: five candidates in the new cover approach (.agents/skills/cover-design; research note
 * docs/research/2026-11-07-cover-thumbnail-principles.md, proposed, not yet a rule). Script R1.1, fact-check R1.1, scene sheets SS-R3.2.
 * Promise: the viewer learns why a dog misses a red ball on grass: red and green are hard for a dog to tell apart (L04, L06),
 *   because people have three kinds of colour cells and dogs two (L07); dogs still see colour (L08).
 * Gaps (answer line): why does the dog run past a ball right in front of it? (L04-L06); do dogs see in black and white? (L08);
 *   how many colour cell types does a dog have? (L07); how does it find the ball in the end? (L09); which toy colour is better? (L10).
 * Never shown: the blue ball and the word "ฟ้า" (L10 payoff), "2 แบบ" (L07 answer), "ไม่ใช่ขาวดำ" (L08 answer).
 * Copy inside Boat's verdicts: "อาจ" hedges become question marks; never "invisible" or "blends in" (L02 "อาจดูคล้ายหญ้า").
 * Dog-view pictures carry the episode tag `ภาพจำลอง (โดยประมาณ)` (F012). Each candidate has its own layout and stop factor.
 */
const TOP = {edge: {side: 'top' as const, size: 820, opacity: 0.85}};
const RED = '#e8392b';
const ACC = '#ff5a46';
const DARK = '#0b0d16';
const TAGBOX = (y: number): CoverElement[] => [
  {kind: 'rect', x: 330, y, w: 420, h: 62, rx: 31, fill: DARK, opacity: 0.6},
  {kind: 'text', text: TAG, x: 540, y: y + 44, size: 36, anchor: 'middle', fill: '#f4efe6', weight: 600},
];
const TOP_DEEP = {edge: {side: 'top' as const, size: 920, opacity: 0.95}};
const BOTTOM = {edge: {side: 'bottom' as const, size: 760, opacity: 0.85}};
const ring = (cx: number, cy: number, rx: number, ry: number, color = ACC): CoverElement[] => [
  {kind: 'ellipse', cx, cy, rx, ry, stroke: DARK, sw: 24},
  {kind: 'ellipse', cx, cy, rx, ry, stroke: color, sw: 12},
];
export const EDU3_COVERS_V2: Cover[] = [
  // N1 misconception (wrong vs right). S01-B02-SH04 l64 the dog facing us, puzzled; red sticker on the myth (L08 "ขาวดำ"); payoff L08.
  {id: 'N1-bw', plate: 'EDU3-S01-B02-SH04', local: 64, scrim: false,
    lines: [{text: 'หมาเห็น', y: 400, size: 140}, {text: 'ขาวดำ?', y: 575, size: 170, accent: true}],
    look: {label: {color: RED, ink: '#ffffff', pad: 0.42}},
    layout: {grade: TOP}},
  // N2 odd view. S01-B03-SH03 l32 the VD09a split crosses the ball: our colours left, the simulated dog view right, ball circled
  // (L03 "ลองดูโลกผ่านตาหมา", L02 "อาจดูคล้ายหญ้า" as a question); payoff L04-L06.
  {id: 'N2-split', plate: 'EDU3-S01-B03-SH03', local: 32, scrim: false,
    lines: [{text: 'ผ่านตาหมา', y: 470, size: 160, accent: true}, {text: 'บอลคล้ายหญ้า?', y: 630, size: 120}],
    layout: {grade: {...TOP_DEEP, vignette: 0.3}, elements: [
      ...ring(540, 960, 170, 150, '#f4efe6'),
      {kind: 'text', text: 'ตาคน', x: 290, y: 1320, size: 96, anchor: 'middle', weight: 800, fill: '#f4efe6', stroke: DARK, sw: 7},
      {kind: 'text', text: 'ตาหมา', x: 790, y: 1320, size: 96, anchor: 'middle', weight: 800, fill: '#f4efe6', stroke: DARK, sw: 7},
      ...TAGBOX(1560)]}},
  // N3 try this ("you"). S01-B01-SH01 l40 the owner holds the red ball, ball circled (L01 "ลูกบอลสีแดง ที่คุณซื้อให้หมา",
  // L11 "ลองถามตัวเองว่า… หมาเห็นมันไหม"); payoff L10. Bottom band: the top band would cover his face.
  {id: 'N3-ask', plate: 'EDU3-S01-B01-SH01', local: 40, scrim: false,
    lines: [{text: 'ซื้อบอลให้หมา', y: 1360, size: 130}, {text: 'หมาเห็นไหม?', y: 1520, size: 160, accent: true}],
    layout: {grade: BOTTOM, elements: [...ring(110, 735, 95, 95)]}},
  // N4 subject question. S01-B02-SH02 l32 the dog gallops past the ball, ball circled (O2 "ตรงนั้นไง!"); payoff L04-L06.
  {id: 'N4-miss', plate: 'EDU3-S01-B02-SH02', local: 32, scrim: false,
    lines: [{text: 'ตรงนั้นไง!', y: 470, size: 170, accent: true}, {text: 'ทำไมวิ่งผ่าน?', y: 630, size: 120}],
    layout: {grade: TOP_DEEP, elements: [...ring(445, 1062, 110, 95)]}},
  // N5 number + diagram. S01-B04-SH01 l100 (dog view, tagged) the owner's three-cone bubble open, the dog's not yet; an empty "?" bubble at the dog
  // (L07 "ในตาคนมีเซลล์รับสี สามแบบ… หมามีแค่ สองแบบ"; "2" never shown); payoff L07.
  {id: 'N5-cones', plate: 'EDU3-S01-B04-SH01', local: 100, scrim: false,
    lines: [{text: 'คน 3 แบบ', y: 1380, size: 170, accent: true}, {text: 'หมามีกี่แบบ?', y: 1530, size: 110}],
    layout: {grade: BOTTOM, elements: [
      {kind: 'ellipse', cx: 860, cy: 560, rx: 105, ry: 105, fill: DARK, opacity: 0.85, stroke: '#f4efe6', sw: 8},
      {kind: 'text', text: '?', x: 860, y: 610, size: 150, anchor: 'middle', weight: 800, fill: ACC},
      ...TAGBOX(1585)]}},
];
