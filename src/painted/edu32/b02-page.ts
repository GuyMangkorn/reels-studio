import type {AnimalPose} from '../kit/animals';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {wFill, wInk} from '../kit/world';
import {camPoint, type YCam} from '../kit/ycam';
import {CAT_SCALE, FOREIGN_AGENT, HANDLER, TRENCH, paintCatCard, paintSeatedManCard} from './cast';
import {paintNearGroundShade} from './field';
import {LAMP, paintBenchBack, paintBenchSeat, paintFolderP, paintLampBase, paintLampPool, paintNearDressing, paintRoom, paintTreeCard} from './desk';
import {BENCH_P, lead} from './looks';

// EDU-EP32-SHORT shot group G2 (B02-SH01, B02-SH02, B02-SH03; timed sheet EDU-EP32-SHEET-R1 G [328, 574); Boss W5.2, 2026-11-21). Shared painter
// for page P (the park pop-up on the open folder under the lamp, VD32-07) in any state of its build: the page sliding in along the felt, each
// pop-up card rising from its fold line, the cat card on its paper slot, and a near-page shade for the caption band. With the default state it
// paints exactly the LF02 key (`paintParkPopUp` in looks.ts: same calls, order and seeds), so B02-SH01's end key is the gate frame. React-free.

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const easeInOut = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(x));
export const easeOut3 = (x: number) => 1 - (1 - clamp01(x)) ** 3;
/** Ease-out with a small overshoot (about 10 %): the snap of a pop-up card reaching upright. */
export const easeOutBack = (x: number) => { const u = clamp01(x) - 1, c1 = 1.70158; return 1 + (c1 + 1) * u ** 3 + c1 * u ** 2; };

export type PageState = {
  /** World x offset of the whole folder spread and everything on it (model m); 0 = in place. */
  slide?: number;
  /** Rise of each pop-up card about its fold line, 0 = flat on the page, 1 = upright (may overshoot a little). */
  rise?: {treeL?: number; treeR?: number; bench?: number; fa?: number; hd?: number; cat?: number};
  /** Cat card foot x (model m) on the seat line; default 0 (the seat between the men). */
  catX?: number;
  catPose?: Partial<AnimalPose>;
  /** Men talking (LF02: the FOREIGN AGENT talks). */
  faTalk?: boolean; hdTalk?: boolean;
  /** Clock of the cat card (default = the page clock): the paper cat's own acting clock. */
  catT?: number;
};

/** Paint `draw` squashed vertically about the picture row/point `g` by `k` (the card rising from its fold line). k >= 0.999 paints unchanged. */
export const riseAbout = (p: Painter, g: Pt | null, k: number, draw: () => void) => {
  if (k >= 0.999 && k <= 1.001) { draw(); return; }
  if (!g || k < 0.03) return;
  p.brush.push();
  p.brush.translate(g[0], g[1]);
  p.brush.scale(1, k);
  p.brush.translate(-g[0], -g[1]);
  draw();
  p.brush.pop();
};

/** The paper slot the cat card rides in: a cream card strip at seat height from the bench end out to just past the cat, a fold line along it. */
const paintSlot = (p: Painter, c: YCam, catX: number) => {
  const x0 = BENCH_P.x1 - 0.02, x1 = catX + 0.22;
  if (x1 <= x0 + 0.03) return;
  const y = BENCH_P.seat - 0.004, z0 = -0.36, z1 = -0.24;
  wFill(p, c, 33700, '#efe4cc', [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]);
  wInk(p, c, 33701, [[x0, y + 0.001, -0.3], [x1 - 0.04, y + 0.001, -0.3]], {color: '#8a7550', weight: 0.8, closed: false});
  wInk(p, c, 33702, [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], {color: '#b39a74', weight: 0.6});
};

/**
 * Page P on desk camera `c` in state `s` at page clock `t`; `id` collects lead heights (looks.ts MEASURE). Order as LF02: room, lamp base, folder,
 * lamp pool, tree cards, bench, (slot), cat, FOREIGN AGENT, HANDLER, near dressing. The page group (folder and pop-up) is drawn through the desk
 * camera moved by -slide on x, i.e. the page shifted +slide along the felt; room, lamp and pencil stay on `c`.
 */
export const paintPageP = (p: Painter, c: YCam, id: string, t: number, s: PageState = {}) => {
  const slide = s.slide ?? 0, r = s.rise ?? {}, cp: YCam = slide ? {...c, x: c.x - slide} : c;
  const k = (v: number | undefined) => v ?? 1;
  paintRoom(p, c);
  paintLampBase(p, c);
  paintFolderP(p, cp);
  paintLampPool(p, c);
  const tree = (at: V3, h: number, seed: number, kk: number) => riseAbout(p, camPoint(cp, at), kk, () => paintTreeCard(p, cp, at, h, seed, 0));
  tree([1.7, 0, -1.3], 2.2, 33100, k(r.treeR));
  tree([-1.8, 0, -1.2], 2.4, 33000, k(r.treeL));
  let clip: (pts: Pt[]) => Pt[] = (q) => q;
  const catX = s.catX ?? 0;
  riseAbout(p, camPoint(cp, [0, 0, BENCH_P.zf]), k(r.bench), () => {
    paintBenchBack(p, cp, BENCH_P);
    clip = paintBenchSeat(p, cp, BENCH_P);
    paintSlot(p, cp, catX);
  });
  const catAt: V3 = [catX, BENCH_P.seat, -0.3];
  riseAbout(p, camPoint(cp, catAt), k(r.cat), () => {
    const cat = paintCatCard(p, cp, {at: catAt, scale: CAT_SCALE.diorama, t: s.catT ?? t, light: LAMP, shadowClip: clip, pose: s.catPose});
    if (k(r.cat) > 0.999) lead(id, 'CAT (diorama x1.6)', cat);
  });
  const faAt: V3 = [-0.6, 0, -0.1], hdAt: V3 = [0.62, 0, -0.1];
  riseAbout(p, camPoint(cp, faAt), k(r.fa), () => {
    const fa = paintSeatedManCard(p, cp, FOREIGN_AGENT, {at: faAt, t, seed: 34100, look: [0.45, 0.05], talk: s.faTalk ?? true, coat: TRENCH.tan, light: LAMP});
    if (k(r.fa) > 0.999) lead(id, 'FOREIGN AGENT', fa);
  });
  riseAbout(p, camPoint(cp, hdAt), k(r.hd), () => {
    const hd = paintSeatedManCard(p, cp, HANDLER, {at: hdAt, t, seed: 34200, look: [-0.45, 0.05], talk: s.hdTalk, hat: true, coat: TRENCH.grey, light: LAMP});
    if (k(r.hd) > 0.999) lead(id, 'HANDLER', hd);
  });
  paintNearDressing(p, c, [-0.25, 2.28], [1.45, 2.05]);
};

/**
 * Caption band light (caption-zone y 1230-1344, limits mean 0.25 / p95 0.40): the lamp pool falling off toward the camera. Nested soft glazes
 * whose back edges are wavy world lines on the desk at the picture rows of `steps` ([row, opacity]), filled down past the frame bottom, darkest
 * nearest the lens; painted last. The G4 construction (field.ts `paintNearGroundShade`), so a camera move keeps the falloff on the same rows.
 */
/** `n` shade steps on rows `from`..`to`, opacity ramping `op0`..`op1` (many thin glazes, so the falloff has no single hard edge). */
export const bandRamp = (from: number, to: number, n: number, op0: number, op1: number): [number, number][] =>
  Array.from({length: n}, (_, i) => [Math.round(from + ((to - from) * i) / (n - 1)), Math.round(op0 + ((op1 - op0) * i) / (n - 1))]);
export const paintPageShade = (p: Painter, c: YCam, seed: number, color: string, steps: [number, number][]) => paintNearGroundShade(p, c, seed, color, steps);
