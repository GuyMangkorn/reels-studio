import type {Item} from '../kit/world';
import type {YCam} from '../kit/ycam';
import type {Painter} from './core';
import type {V3} from './core';
import {paintBeast, type BeastAnchors, type BeastPlace, type Build} from './beast';

// Creature depth sort (N16-19, EDU-EP16 shots 2, 5, 8, 10, 11; Boss, 14 Nov 2026). A creature drawn as ONE `paintSorted` item takes the depth of its ground point, so a long-neck standing
// behind a near fern is hidden by that fern even where its head is IN FRONT of it (the look frames hacked this with a `sortAt`). `beastItems` paints the creature as several items:
// the main body (root bone + everything not claimed, with the ground shadow) at the creature's ground point, and one item per `split` group (a bone and all its descendants, e.g. `neck`,
// which carries the skull, jaw, eyes) at the world ground position of that group's far joint. Every part is drawn exactly once: the groups partition the bones.

/** All bone ids at or below `root`. */
export const descendantsOf = (B: Build, root: string): Set<string> => {
  const out = new Set<string>([root]);
  let grew = true;
  while (grew) { grew = false; for (const b of B.bones) if (b.parent && out.has(b.parent) && !out.has(b.id)) { out.add(b.id); grew = true; } }
  return out;
};
export type BeastSplit = {/** root bone of the group */ root: string; /** joint (or anchor) whose ground position sorts the group; default the farthest joint of the group from the creature's root */ sortJoint?: string};
export type SplitPlan = {groups: {root: string; bones: Set<string>; sortAt: V3}[]; body: Set<string>};
/** Which bones go to which item and where each group sorts, for a pose at a placement. Pure (no painting). */
export const planSplit = (B: Build, place: BeastPlace, split: BeastSplit[]): SplitPlan => {
  const probe = paintBeast(null, {x: 0, y: 1, z: 5, yaw: 0, f: 800, hy: 900, pitch: 0}, B, place), claimed = new Set<string>(), groups: SplitPlan['groups'] = [];
  for (const sp of split) {
    const bones = new Set([...descendantsOf(B, sp.root)].filter((b) => !claimed.has(b)));
    bones.forEach((b) => claimed.add(b));
    const js = B.bones.filter((b) => bones.has(b.id) && b.joint).map((b) => b.joint!);
    const rootPos = B.joints[B.bones.find((b) => b.id === sp.root)?.joint ?? ''] ?? [0, 0, 0];
    const far = sp.sortJoint ?? js.reduce((best, j) => (Math.hypot(...B.joints[j].map((v, i) => v - rootPos[i])) > Math.hypot(...B.joints[best].map((v, i) => v - rootPos[i])) ? j : best), js[0]);
    const w = probe.toWorld(B.joints[far] ?? B.anchors[far] ?? rootPos);
    groups.push({root: sp.root, bones, sortAt: [w[0], 0, w[2]]});
  }
  return {groups, body: new Set(B.bones.map((b) => b.id).filter((b) => !claimed.has(b)))};
};
/** The creature as depth-sorted items (body at `place.at`, each split group at its own ground point). `o.bias` is added to every item. Anchors come from `paintBeast(null, ...)` as before. */
export const beastItems = (B: Build, place: BeastPlace, split: BeastSplit[], o: {bias?: number; onPaint?: (a: BeastAnchors) => void} = {}): Item[] => {
  const plan = planSplit(B, place, split), at: V3 = [place.at[0], place.ground ?? 0, place.at[1]];
  const item = (bones: Set<string>, pos: V3): Item => ({at: pos, bias: o.bias, draw: (p: Painter, c: YCam) => { const a = paintBeast(p, c, B, {...place, only: (b) => bones.has(b)}); o.onPaint?.(a); }});
  return [item(plan.body, at), ...plan.groups.map((g) => item(g.bones, g.sortAt))];
};

/** The creature as `n` depth slabs (default 4) across the range of distances its quads span from the lens `c`: slab k holds every quad whose centre lies in that distance band and sorts at the band's middle, so a fern, a tree or a rock between the head and the hips falls between the right slabs
 * whatever the neck does (this is what splits a long neck that reaches from far behind the fern to in front of it). The first (farthest) slab carries the ground shadow. The items depend on the camera, so build them inside the shot's `draw`. */
export const beastSlabs = (c: YCam, B: Build, place: BeastPlace, n = 4, o: {bias?: number; /** roots of groups kept whole in one slab at their joint's distance (default the head: `skull` / `head`) */ atomic?: string[]} = {}): Item[] => {
  const probe = paintBeast(null, c, B, place), pin: Record<string, V3> = {};
  for (const root of o.atomic ?? ['skull', 'head']) { const rb = B.bones.find((b) => b.id === root); if (rb?.joint) { const w = probe.toWorld(B.joints[rb.joint]); for (const id of descendantsOf(B, root)) pin[id] = w; } }
  const ds = probe.drawn.length ? probeDistances(c, B, place) : [0, 1], dmin = Math.min(...ds), dmax = Math.max(...ds) + 1e-6, W = dmax - dmin;
  const sx = place.at[0] - c.x, sz = place.at[1] - c.z, dc = Math.hypot(sx, sz) || 1;
  return Array.from({length: n}, (_, k) => {
    const d0 = dmin + (W * (n - 1 - k)) / n, d1 = dmin + (W * (n - k)) / n, mid = (d0 + d1) / 2;   // k = 0 is the farthest slab
    const at: V3 = [c.x + (sx / dc) * mid, 0, c.z + (sz / dc) * mid];
    return {at, bias: o.bias, draw: (p: Painter, cc: YCam) => { paintBeast(p, cc, B, {...place, slab: {d0: k === n - 1 ? d0 - 1e6 : d0, d1: k === 0 ? d1 + 1e6 : d1, shadow: k === 0, pin}}); }};
  });
};
/** Horizontal camera distances of the drawn quad centres (m), for slab limits. */
const probeDistances = (c: YCam, B: Build, place: BeastPlace): number[] => {
  const a = paintBeast(null, c, B, place), out: number[] = [];
  for (const q of [a.toWorld([0, 0, 0])]) out.push(Math.hypot(q[0] - c.x, q[2] - c.z));
  for (const j of Object.values(B.joints)) { const w = a.toWorld(j); out.push(Math.hypot(w[0] - c.x, w[2] - c.z)); }
  for (const f of B.feet) { const w = a.toWorld(f); out.push(Math.hypot(w[0] - c.x, w[2] - c.z)); }
  return out;
};
