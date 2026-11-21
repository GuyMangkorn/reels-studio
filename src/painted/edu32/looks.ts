import type {Painter, Pt} from '../kit/painter';
import type {PaperCardOut} from '../kit/paper-card';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {AGENT, CAT_SCALE, FOREIGN_AGENT, HANDLER, MANNEQUIN_L, MANNEQUIN_R, TRENCH, paintCatCard, paintFedora, paintRealCat, paintSeatedManCard, paintSeatedMannequin, paintSparrow} from './cast';
import {paintFigureAt} from '../kit/figure-at';
import {SF, paintFieldBack, paintFieldBenchBack, paintFieldBenchSeat, paintFieldTree, paintNearLawn, sunShadow, type FieldLight} from './field';
import {LAMP, paintBenchBack, paintBenchSeat, paintFolderP, paintLampBase, paintLampPool, paintNearDressing, paintRoom, paintTreeCard, type Bench} from './desk';

// EDU-EP32-SHORT W3 look frames (EDU-EP32-BRIEF-R1 VD32-02; Boss, 2026-11-21). React-free so a headless measure can run them with a recording
// painter. LF02 = the first-still gate: B02-SH01 at its key state (park pop-up on the open folder under the lamp, two men seated, the cat on the
// bench between them). Camera: see LF02 (adjusted from the storyboard end key, recorded there).

export type LookDef = {shot: string; cam: YCam; t: number; paper: string; caption?: string; paint: (p: Painter) => void};
/** Lead span (px) plus the card's measured parts: fold tab picture height, shadow reach below and beside the foot line (px). */
export type Lead = {name: string; top: number; bottom: number; h: number; tabH?: number; shadowDown?: number; shadowDx?: number};
export const MEASURE: Record<string, Lead[]> = {};
export const lead = (id: string, name: string, a: {top: number; bottom: number; card?: PaperCardOut | null} | null) => {
  if (!a) return;
  const list = (MEASURE[id] ??= []).filter((l) => l.name !== name);
  const k = a.card, ys = (q: Pt[]) => q.map((v) => v[1]), xs = (q: Pt[]) => q.map((v) => v[0]);
  const card = k && k.tab.length ? {tabH: Math.round(Math.max(...ys(k.tab)) - Math.min(...ys(k.tab)))} : {};
  const sh = k && k.shadow.length ? {shadowDown: Math.round(Math.max(...ys(k.shadow)) - k.footY), shadowDx: Math.round((Math.max(...xs(k.shadow)) + Math.min(...xs(k.shadow))) / 2 - (Math.max(...xs(k.outline)) + Math.min(...xs(k.outline))) / 2)} : {};
  list.push({name, top: Math.round(a.top), bottom: Math.round(a.bottom), h: Math.round(a.bottom - a.top), ...card, ...sh});
  MEASURE[id] = list;
};
const DEG = Math.PI / 180;

/** Seat height = the kit's seated hip for these men (`chairSpec` seatV, about 0.34 m at 1.76-1.78 m; the brief's 0.45 was an estimate). */
export const BENCH_P: Bench = {x0: -0.95, x1: 0.95, zb: -0.42, zf: -0.18, seat: 0.345, back: 0.78};

/** Page P' (B02-SH01 key state and plate B03-SH01-PA). `fold` (radians) lays both tree cards down outward (bridge, VD32-18); 0 = standing. */
export const paintParkPopUp = (p: Painter, c: YCam, id: string, t: number, fold = 0) => {
  paintRoom(p, c);
  paintLampBase(p, c);
  paintFolderP(p, c);
  paintLampPool(p, c);
  paintTreeCard(p, c, [1.7, 0, -1.3], 2.2, 33100, -fold);
  paintTreeCard(p, c, [-1.8, 0, -1.2], 2.4, 33000, fold);
  paintBenchBack(p, c, BENCH_P);
  const clip = paintBenchSeat(p, c, BENCH_P);
  const cat = paintCatCard(p, c, {at: [0, BENCH_P.seat, -0.3], scale: CAT_SCALE.diorama, t, light: LAMP, shadowClip: clip});
  lead(id, 'CAT (diorama x1.6)', cat);
  const fa = paintSeatedManCard(p, c, FOREIGN_AGENT, {at: [-0.6, 0, -0.1] as V3, t, seed: 34100, look: [0.45, 0.05], talk: true, coat: TRENCH.tan, light: LAMP});
  lead(id, 'FOREIGN AGENT', fa);
  const hd = paintSeatedManCard(p, c, HANDLER, {at: [0.62, 0, -0.1] as V3, t, seed: 34200, look: [-0.45, 0.05], hat: true, coat: TRENCH.grey, light: LAMP});
  lead(id, 'HANDLER', hd);
  paintNearDressing(p, c, [-0.25, 2.28], [1.45, 2.05]);
};

/** Space F at B03-SH03 (VD32-19, VD32-20): `catOn` 'bench' = the key state (cat sitting between the mannequins), 'patch' = the end state (lying in the sun
 *  patch facing screen-left). Canopy shade over the bench in 'sun'; the mannequins and bench take the shade tint, the cat a warm leaf-gap fleck. */
const paintFieldB03 = (p: Painter, c: YCam, id: string, t: number, L: FieldLight, catOn: 'bench' | 'patch') => {
  paintFieldBack(p, c, L);
  paintFieldTree(p, c, SF.treeR, 35000, L);
  paintFieldTree(p, c, SF.treeL, 35100, L);
  paintFieldBenchBack(p, c, L);
  paintFieldBenchSeat(p, c, L);
  const shade = L === 'sun' ? 0.22 : 0.04;
  if (catOn === 'bench') lead(id, 'CAT real x1.6 (sit)', paintRealCat(p, c, {at: SF.catSeat, t, fleck: L === 'sun' ? 1 : 0}));
  const sp = paintSparrow(p, c, SF.sparrow, 35500, -1, shade);
  if (sp) lead(id, 'SPARROW', sp);
  lead(id, 'MANNEQUIN L', paintSeatedMannequin(p, c, MANNEQUIN_L, {at: SF.manL, t, seed: 34100, coat: TRENCH.tan, shade}));
  lead(id, 'MANNEQUIN R', paintSeatedMannequin(p, c, MANNEQUIN_R, {at: SF.manR, t, seed: 34200, coat: TRENCH.grey, hat: true, shade}));
  if (catOn === 'patch') {
    paintNearLawn(p, c, L, -Infinity, SF.patch[2]); // tufts behind the cat's ground line go under it, not over its back
    sunShadow(p, c, 35600, SF.patch, 0.3, 0.12, 0.25, 60); // under the cat, not glazed over it
    const cat = paintRealCat(p, c, {at: SF.patch, t, pose: CAT_LOAF, fleck: 0.8}); // in the sun patch: the warm key lifts the cat (UT02)
    if (cat) lead(id, 'CAT real x1.6 (lie, in patch)', cat);
  }
  paintNearLawn(p, c, L, catOn === 'patch' ? SF.patch[2] : -Infinity);
};

/** The B03-SH03 end state: the cat lying in the sun patch as a relaxed loaf, eyes half shut in the warmth (cat polish, F5). */
export const CAT_LOAF = {view: 'left', state: 'lie', loaf: 1, lid: 0.45} as const;
/** CAT-SHEET (Boss cat-polish QA, 2026-11-21): the real CAT x1.6 in each state on a plain lawn card, one camera per cell (eye 0.22 m, 1.5 m off,
 *  f 900). Rows: front sit | profile sit; profile walk | profile stand; profile lie (B03-SH03 end state) | front lie. */
export const CAT_SHEET_CELLS: {pose: Partial<import('../kit/animals').AnimalPose>; walk?: boolean}[] = [
  {pose: {view: 'front', state: 'sit'}}, {pose: {view: 'left', state: 'sit'}},
  {pose: {view: 'left', state: 'stand'}, walk: true}, {pose: {view: 'left', state: 'stand'}},
  {pose: CAT_LOAF}, {pose: {view: 'front', state: 'lie'}},
];
const paintCatSheet = (p: Painter, t: number) => {
  CAT_SHEET_CELLS.forEach((cell, i) => {
    const col = i % 2, row = Math.floor(i / 2), cam: YCam = {x: 0, y: 0.22, z: 1.5, yaw: 0, pitch: 0, f: 900, hy: 470 + row * 600, cx: col ? 270 : -270};
    const x0 = col * 540, y0 = 40 + row * 600;
    p.flat('#8fa58a', [[x0 + 8, y0], [x0 + 532, y0], [x0 + 532, y0 + 560], [x0 + 8, y0 + 560]]);
    p.flat('#6f8f63', [[x0 + 8, cam.hy], [x0 + 532, cam.hy], [x0 + 532, y0 + 560], [x0 + 8, y0 + 560]]);
    const pose = cell.walk ? {...cell.pose, walk: t} : cell.pose;
    lead('CAT-SHEET', `cell ${i} ${pose.view} ${pose.state}${cell.walk ? ' walk' : ''}`, paintRealCat(p, cam, {at: [0, 0, 0], t, pose}));
  });
};

export const LOOK_DEFS: Record<string, () => LookDef> = {
  'CAT-SHEET': () => {
    const cam: YCam = {x: 0, y: 0.22, z: 1.5, yaw: 0, pitch: 0, f: 900, hy: 470};
    return {shot: 'QA', cam, t: 2.0, paper: '#c9cfc4', paint: (p) => paintCatSheet(p, 2.0)};
  },
  LF02: () => {
    // W3 adjustment (Boss, recorded for Film): the storyboard end key (1.0, 0.8, 1.8) pitch -12 f 950 hy 620 fills the lower 60 % with the lawn sheet and
    // shows no page edge, so nothing says "desk"; pulled back and up so the folder's front edge, the felt and the walnut read under the pop-up.
    const cam: YCam = {x: 1.45, y: 1.0, z: 2.7, yaw: -28 * DEG, pitch: -17 * DEG, f: 1100, hy: 700};
    return {shot: 'B02-SH01', cam, t: 1.2, paper: '#2c2630', caption: 'แผนคือ… ให้แมวไปแอบฟังสายลับคุยกับหัวหน้าฝั่งโซเวียตในสวน', paint: (p) => paintParkPopUp(p, cam, 'LF02', 1.2)};
  },
  // LF03R: the first real-look gate (VD32-26), B03-SH03 key state on the start key (storyboard BOARD-R2): sun out, canopy shade on the bench, the patch
  // on the grass in front, the cat still sitting between the mannequins, the sparrow on the right armrest.
  LF03R: () => {
    const cam: YCam = {x: 0.3, y: 0.62, z: 2.6, yaw: -2 * DEG, pitch: -4 * DEG, f: 1200, hy: 500};
    return {shot: 'B03-SH03', cam, t: 2.0, paper: '#c9cfc4', caption: 'ซ้าย… มันไปนอนตากแดดแล้วครับ', paint: (p) => paintFieldB03(p, cam, 'LF03R', 2.0, 'sun', 'bench')};
  },
  // LF03R-END: criterion 5 check on the same set, B03-SH03 end key: the cat lying in the patch facing screen-left.
  'LF03R-END': () => {
    const cam: YCam = {x: 0.25, y: 0.6, z: 2.35, yaw: 3 * DEG, pitch: -4 * DEG, f: 1200, hy: 500};
    return {shot: 'B03-SH03', cam, t: 3.0, paper: '#c9cfc4', caption: 'ซ้าย… มันไปนอนตากแดดแล้วครับ', paint: (p) => paintFieldB03(p, cam, 'LF03R-END', 3.0, 'sun', 'patch')};
  },
  // LF03R-AGENT: character still, AGENT real front (P09) at the field's front-right corner, outside the rope, the bench behind (overcast).
  'LF03R-AGENT': () => {
    const cam: YCam = {x: 4.6, y: 1.45, z: 5.4, yaw: -26 * DEG, pitch: -6 * DEG, f: 1100, hy: 820};
    return {shot: 'B03-SH02', cam, t: 1.0, paper: '#c9cfc4', caption: 'เป้าหมายอยู่ซ้าย…', paint: (p) => {
      paintFieldB03(p, cam, 'LF03R-AGENT', 1.0, 'overcast', 'bench');
      const a = paintFigureAt(p, cam, AGENT, {at: SF.agent, view: 'front', pose: 'P09', face: 'smug', t: 1.0, seed: 34300, shadow: {color: '#2c3324', op: 80},
        held: (q, an) => paintFedora(q, an, 34390)});
      if (a) lead('LF03R-AGENT', 'AGENT', {top: a.headTop - 0.2 * (a.chin - a.headTop), bottom: a.bottom});
    }};
  },
};
