import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP06-SHORT-COVERS: five cover candidates (docs/cover-principles.md, CV01-CV10) for the cat-stare Short
 * (title "กะพริบตาช้า ๆ ใส่แมว", never repeated on a cover, CV02). Plates are the episode's registry plates `EDU6-<shot id>`
 * (CV07); `local` is the shot-local frame. Thai copy uses only what the film says or shows (CV04): L01 "จ้องตาแมวด้วยความรัก",
 * the "เป็นการท้าทาย" reading, L07 "ลองกะพริบตาช้า ๆ", the cat's narrowed-eye reply, the study line "มากกว่าตอนคนหันหน้าหนี".
 * No cover shows the payoff word "รัก" (L13). Text centred on x 540, inside y 240-1680, last baseline <= 1470, clear of the
 * right 120 px (CV06); headlines size 184-192 as the other EDU covers (CV08).
 */
export const EDU6_COVERS: Cover[] = [
  // A question. S01-B01-SH02: her eyes wide, close (L01 "จ้องตาแมวด้วยความรัก…").
  {id: 'A-stare', plate: 'EDU6-S01-B01-SH02', local: 40,
    lines: [{text: 'จ้องตาแมว', y: 1340, size: 192, accent: true}, {text: 'แมวอ่านว่าท้าทาย?', y: 1470, size: 92}]},
  // B subject reveal. S01-B01-SH03: the cat close, pupils wide, whiskers up (the cat's side of the stare).
  {id: 'B-cat', plate: 'EDU6-S01-B01-SH03', local: 25,
    lines: [{text: 'จ้องตาแมว', y: 1340, size: 192, accent: true}, {text: 'แมวอ่านว่าท้าทาย?', y: 1470, size: 92}]},
  // C face. S01-B04-SH02: her relieved smile, whispering (the cat has just answered).
  {id: 'C-face', plate: 'EDU6-S01-B04-SH02', local: 34,
    lines: [{text: 'แมวตอบ!', y: 1340, size: 192, accent: true}, {text: 'ด้วยการกะพริบตา', y: 1470, size: 92}]},
  // D mystery detail. S01-B03-SH02: her eyes close slowly (L07 "ลองกะพริบตาช้า ๆ").
  {id: 'D-blink', plate: 'EDU6-S01-B03-SH02', local: 60,
    lines: [{text: 'กะพริบช้า ๆ', y: 1340, size: 192, accent: true}, {text: 'ทำแบบนี้กับแมว', y: 1470, size: 92}]},
  // E study fact. S01-B04-SH05: the cat rubs its head on her hand at night (L10 "มากกว่าตอนคนหันหน้าหนี").
  {id: 'E-study', plate: 'EDU6-S01-B04-SH05', local: 40,
    lines: [{text: 'งานวิจัยพบ', y: 1340, size: 184, accent: true}, {text: 'ยอมให้แตะมากกว่าเดิม', y: 1470, size: 88}]},
];

/** Lamp-amber accent (the warm living-room lamp light of the film); scrim from y 1120 for the pale sofa and wall plates (as EP01/EP02). */
export const EDU6_COVER_STYLE: CoverStyle = {accent: '#ffb347', scrimY: 1120};

/**
 * EDU-EP06-SHORT-V2-COVERS: five candidates in the new cover approach (research note
 * docs/research/2026-11-07-cover-thumbnail-principles.md, proposed, not yet a rule). Each candidate has its own layout and
 * its own stop factor instead of one bottom-band template: headline in the top or middle band (clear of the bottom-left
 * view badge), at most about 8 spacing glyphs, one subject, one graphic cue (circle, cross, measure line), and a promise
 * the film pays off (line ID in each comment). Copy stays inside Boat's verdicts: "อาจ" hedges kept as a question mark,
 * the "หนึ่ง… สอง…" count and "1 เมตร" are spoken lines, the payoff word "รัก" (L13) is never shown.
 */
const RED = '#ff5a4e';
const TOP = {edge: {side: 'top' as const, size: 820, opacity: 0.85}};
export const EDU6_COVERS_V2: Cover[] = [
  // N1 odd detail / imagined view. S01-B02-SH02 glare eye (L04-L06 "ลองนึกจากฝั่งแมว… อาจดูเป็นการข่มขู่"); payoff L06.
  {id: 'N1-glare', plate: 'EDU6-S01-B02-SH02', local: 50, scrim: false,
    lines: [{text: 'ในสายตาแมว', y: 470, size: 150}, {text: 'คุณดูน่ากลัว?', y: 640, size: 150, accent: true}],
    layout: {grade: {...TOP, vignette: 0.35, tint: {color: '#3d5f9e', opacity: 0.45, blend: 'color'}}}},
  // N2 wrong/right. S01-B01-SH02 her wide stare; red cross sticker (L02 "อาจอ่าน… เป็นการท้าทาย"; better way L07).
  {id: 'N2-dont', plate: 'EDU6-S01-B01-SH02', local: 40, scrim: false,
    lines: [{text: 'อย่าจ้องแมว', y: 470, size: 160, accent: true}, {text: 'แมวอาจคิดว่าท้าทาย', y: 615, size: 92}],
    look: {label: {color: RED, ink: '#ffffff', pad: 0.42}},
    layout: {grade: TOP}},
  // N3 how-to, "you" action. S01-B03-SH02 eye closed in the count (L08 "หนึ่ง… สอง…"); payoff L09.
  {id: 'N3-count', plate: 'EDU6-S01-B03-SH02', local: 60, scrim: false,
    lines: [{text: 'ทักแมวแบบนี้', y: 470, size: 150}, {text: 'หนึ่ง… สอง…', y: 1380, size: 170, accent: true}],
    layout: {grade: {...TOP, vignette: 0.3}}},
  // N4 open question on the subject. S01-B04-SH01 cat's half-close reply, eyes circled (payoff L09/L13 hedged).
  {id: 'N4-reply', plate: 'EDU6-S01-B04-SH01', local: 55, scrim: false,
    lines: [{text: 'ตาแบบนี้', y: 470, size: 170, accent: true}, {text: 'แปลว่าอะไร?', y: 630, size: 130}],
    layout: {grade: TOP, elements: [
      {kind: 'ellipse', cx: 530, cy: 762, rx: 290, ry: 88, stroke: '#ffb347', sw: 12},
    ]}},
  // N5 number + diagram. S01-B03-SH01 widest frame, she and the cat about 1 m apart (L11 "นั่งห่างสักเมตรนึง").
  {id: 'N5-metre', plate: 'EDU6-S01-B03-SH01', local: 90, scrim: false,
    lines: [{text: 'ห่าง 1 เมตร', y: 470, size: 170, accent: true}, {text: 'แมวจะเดินมาหา?', y: 610, size: 100}],
    layout: {grade: TOP, elements: [
      {kind: 'ellipse', cx: 940, cy: 1060, rx: 100, ry: 125, stroke: '#ffb347', sw: 12},
      {kind: 'path', d: 'M330 1260H840M330 1215V1305M840 1215V1305', stroke: '#0b0d16', sw: 26, linecap: 'round'},
      {kind: 'path', d: 'M330 1260H840M330 1215V1305M840 1215V1305', stroke: '#ffb347', sw: 14, linecap: 'round'},
      {kind: 'text', text: '1 ม.', x: 585, y: 1225, size: 96, anchor: 'middle', weight: 800, fill: '#f4efe6', stroke: '#0b0d16', sw: 7},
    ]}},
];
