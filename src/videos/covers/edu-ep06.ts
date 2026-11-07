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
