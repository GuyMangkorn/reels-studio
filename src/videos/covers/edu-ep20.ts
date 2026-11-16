import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP20-SHORT-PIC-COVERS, Film pick 1, 2026-11-16. Inputs SCRIPT-R2 + FACT-R1/R2, SS-R5, LF20-CABIN-B.
 * Promise: the viewer learns which way a floor-tethered buoyant balloon leans in an accelerating enclosed car (L04),
 * why the surrounding air pushes it (L06-L07), and what changes when the car slows (L12-L13).
 * Gaps: Which way when speeding up? -> L04. Who pushes it? -> L06-L07. Does speed keep it tilted? -> L09-L10.
 * What changes when slowing? -> L12-L13. Why tie it below? -> L02 establishes the floating/tethered setup.
 * Never shown: the forward/rearward result, unequal pressure graphics, the answer word or the braking reversal (CV04).
 * Every balloon stays upright; arrows in P5 are equal alternatives, not force vectors or a measured trajectory.
 * CV07 exception: film's balloon is <= ~180 px; dedicated cover camera plates reuse the approved set/cast/paint function.
 * P4 emphasizes the same low-tether setup as B01-SH02. No narration, sound, captions or film timeline is changed.
 * Headline bands: P1 lower-middle y900-1200; P2 top y300-550; P3 lower y1250-1500;
 * P4 bottom y1450-1540 (single-line), P5 bottom y1300-1510. Channel mark is redrawn over the grade for contrast.
 */
const ACCENT = '#f0b45d';
const INK = '#26313b';
const MARK = [
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: INK, stroke: INK, sw: 6},
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: '#fff1da'},
];
const P = (id: string, plate: string, local = 15): Cover => ({id, plate, local, scrim: false, lines: []});
const ring = (cx: number, cy: number, rx: number, ry: number) => [
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: INK, sw: 18},
  {kind: 'ellipse' as const, cx, cy, rx, ry, stroke: ACCENT, sw: 8},
];
export const EDU20_PICS: Cover[] = [
  {...P('P1-balloon-close', 'EDU20-COVER-BALLOON'), layout: {grade: {vignette: 0.3}, elements: MARK}},
  {...P('P2-floor-eye', 'EDU20-COVER-FLOOR'), layout: {grade: {vignette: 0.4, tint: {color: '#97bcca', opacity: 0.12, blend: 'soft-light'}}, elements: MARK}},
  {...P('P3-puzzled-passenger', 'EDU20-COVER-FACE'), layout: {grade: {vignette: 0.25}, elements: MARK}},
  {...P('P4-tether-setup', 'EDU20-COVER-TETHER'), layout: {grade: {vignette: 0.35}, elements: [...ring(540, 1382, 95, 48), ...MARK]}},
  {...P('P5-which-way', 'EDU20-COVER-PAIR'), layout: {grade: {vignette: 0.35}, elements: [
    {kind: 'path', d: 'M710 750 L550 750 M550 750 L590 715 M550 750 L590 785 M790 750 L950 750 M950 750 L910 715 M950 750 L910 785', stroke: INK, sw: 22, linecap: 'round'},
    {kind: 'path', d: 'M710 750 L550 750 M550 750 L590 715 M550 750 L590 785 M790 750 L950 750 M950 750 L910 715 M950 750 L910 785', stroke: ACCENT, sw: 10, linecap: 'round'},
    ...MARK,
  ]}},
];
export const EDU20_COVER_STYLE: CoverStyle = {accent: ACCENT};

/** Pick 2, user-selected P5 (2026-11-16): exactly the same plate, local frame, grade, arrows and mark.
 * Copy angles map to SCRIPT-R2: prediction L03; hidden pusher L05; steady-speed question L08-L10;
 * participation L11; braking L11-L13. No direction answer is shown. Number angle is replaced by the braking
 * question because the script supplies no numerical fact. Headlines occupy the dark floor below the ring.
 */
const SELECTED_P5 = EDU20_PICS[4];
const textCover = (id: string, lines: Cover['lines']): Cover => ({...SELECTED_P5, id, lines});
export const EDU20_COVERS: Cover[] = [
  textCover('A-follow-you', [
    {text: 'ตามคุณ', y: 1340, size: 240},
    {text: 'ใช่ไหม?', y: 1520, size: 200, accent: true},
  ]),
  textCover('B-what-pushes', [
    {text: 'อะไรดัน?', y: 1450, size: 210, accent: true},
  ]),
  textCover('C-speed-trap', [
    {text: 'วิ่งเร็ว', y: 1340, size: 200},
    {text: 'เอนค้าง?', y: 1520, size: 200, accent: true},
  ]),
  textCover('D-guess-again', [
    {text: 'ทาย', y: 1340, size: 240, accent: true},
    {text: 'อีกรอบ', y: 1520, size: 200},
  ]),
  textCover('E-brake-question', [
    {text: 'รถชะลอ', y: 1340, size: 240},
    {text: 'เอนไปไหน?', y: 1520, size: 174, accent: true},
  ]),
];
