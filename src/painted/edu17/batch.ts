// EDU-EP17 draw batching (group 3): p5.brush queues wash polygons and composites the queue on every colour change (DF-20261031-paint-seed-defer), so a plate that draws
// thousands of specks in random colours pays a composite per speck (measured: K02 frame 11,647 polygons, 10,009 colour changes, 2.2 s). A `Batch` collects polygons that do not
// overlap one another in a way that matters (flecks, roofs, parapets, details) and draws them grouped by colour and alpha: same picture statistics, a handful of composites.
import {hardFill} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';

export type Batch = {add: (p: Painter, seed: number, color: string, pts: Pt[]) => void; flush: () => void; size: () => number};

export const makeBatch = (): Batch => {
  const groups = new Map<string, {p: Painter; color: string; items: [number, Pt[]][]}>();
  let n = 0;
  return {
    add: (p, seed, color, pts) => {
      const key = `${color}|${p.alpha.toFixed(4)}`;
      let g = groups.get(key);
      if (!g) { g = {p, color, items: []}; groups.set(key, g); }
      g.items.push([seed, pts]); n++;
    },
    flush: () => { for (const g of groups.values()) for (const [seed, pts] of g.items) hardFill(g.p, seed, g.color, pts); groups.clear(); n = 0; },
    size: () => n,
  };
};
