import type {CastDef, FigAnchors} from '../kit/cast';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {LIFTERS} from './cast';
import {type CoverState, type LongTableState} from './hall';
import {armHull, clipPolyPainter, coverLift, lerpPt, paintPerson, personAnchors, type CoverLift, type PersonOpts} from './motion22';
import {paintCover} from './tableware';

// EDU-EP22-SHORT far-side cover lifts (Boss W5.1, 2026-11-16; scene sheet B03-SH11 lid ripple, brief N5 `new: cover-lift`, VD07). Lifters E1-E3
// stand behind LT (x -4.50) facing +x; each lift job puts one mitten on one cover's knob (`coverLift`: up, back, down on the runner beside its own
// bowl). LT and its bowls are nearer the camera than the lifters, so a lifter is painted in two passes inside the LT item: the whole figure before
// the table (`before`), and the reaching forearm, mitten and the held cover after the bowls, clipped to the arm hull (`after`). Every value is a function of the shot-local frame L.

/** One cover lift: bowl `i`, lifter `who`, the hand (`auto`: the arm on the cover's screen side of a front card, its left arm on screen right). */
export type LiftJob = {i: number; who: number; side: 'r' | 'l' | 'auto'; t0: number};
export type LiftTiming = {up?: number; carry?: number; approach?: number; leave?: number};

// Facing +x through the kit's view picker, as `lifterItems` (LF01) draws them.
const restOpts = (at: V3, t: number, seed: number): PersonOpts => ({at, t, pose: 'P01', face: 'neutral', facing: [1, 0], kitFacing: true, seed});

type Active = {job: LiftJob; lift: CoverLift};
/** The jobs of one lifter with their lift state at L (the hand is engaged when w > 0). */
const activeOf = (L: number, jobs: LiftJob[], who: number, tm: LiftTiming): Active[] =>
  jobs.filter((j) => j.who === who).map((job) => ({job, lift: coverLift(job.i, L, job.t0, tm)})).filter((a) => a.lift.w > 0);

const sideOf = (j: LiftJob, rest: FigAnchors, knob: Pt): 'r' | 'l' => j.side !== 'auto' ? j.side : knob[0] > (rest.rShoulder[0] + rest.lShoulder[0]) / 2 ? (rest.lShoulder[0] >= rest.rShoulder[0] ? 'l' : 'r') : (rest.lShoulder[0] >= rest.rShoulder[0] ? 'r' : 'l');
/** The lifter's picture hand targets: per side, the rest hand blended toward the knob of the engaged cover (latest job wins a side). */
const handsOf = (c: YCam, rest: FigAnchors | null, act: Active[]) => {
  const out: {r?: Pt; l?: Pt} = {};
  if (!rest) return out;
  for (const a of act) {
    const k = camPoint(c, a.lift.knob);
    if (!k) continue;
    const side = sideOf(a.job, rest, k);
    out[side] = lerpPt(side === 'r' ? rest.rHand : rest.lHand, k, a.lift.w);
  }
  return out;
};

/**
 * The long-table state for a lifter plan at L: `coverOf` from the jobs (bowls with no job keep `base`), the lifters' body pass (`mid`) and their
 * hand pass with the held covers (`after`). `marks` are the lifters' ground points in this shot; `extra` draws more after the bowls.
 */
export const lifterTable = (L: number, t: number, o: {jobs: LiftJob[]; marks: V3[]; timing?: LiftTiming; base: (i: number) => CoverState; detailPx?: number; spoonOnSaucer?: boolean; defs?: CastDef[]}): LongTableState => {
  const defs = o.defs ?? LIFTERS, tm = o.timing ?? {};
  const state = (i: number): CoverState => {
    const js = o.jobs.filter((j) => j.i === i);
    if (!js.length) return o.base(i);
    const st = coverLift(i, L, js[0].t0, tm).state;
    return st;
  };
  const people = (c: YCam) => defs.map((def, k) => {
    const base = restOpts(o.marks[k], t, def.seed);
    const rest = personAnchors(c, def, base);
    const act = activeOf(L, o.jobs, k, tm);
    return {def, k, opts: {...base, handsPx: handsOf(c, rest, act)} as PersonOpts, act};
  });
  return {
    covers: 'on', coverOf: state, detailPx: o.detailPx, spoonOnSaucer: o.spoonOnSaucer,
    before: (p, c) => { for (const m of people(c)) paintPerson(p, c, m.def, m.opts); },
    after: (p, c) => {
      const ps = people(c);
      const held = ps.flatMap((m) => m.act.filter((a) => a.lift.state === 'held').map((a) => ({a, d: Math.hypot(a.lift.cover[0] - c.x, a.lift.cover[2] - c.z)})));
      held.sort((x, y) => y.d - x.d).forEach(({a}) => paintCover(p, c, 24100 + a.job.i * 60 + 10, a.lift.cover, camUnit(c, a.lift.cover) > (o.detailPx ?? 260)));
      for (const m of ps) {
        if (!m.act.length) continue;
        const an = personAnchors(c, m.def, m.opts);
        if (!an) continue;
        const u = camUnit(c, m.opts.at);
        for (const side of ['r', 'l'] as const) {
          const h = m.opts.handsPx?.[side];
          if (!h) continue;
          const sh = side === 'r' ? an.rShoulder : an.lShoulder;
          paintPerson(clipPolyPainter(p, armHull(sh, h, 0.07 * u)), c, m.def, m.opts);
        }
      }
    },
  };
};

/**
 * A lifter standing in front of LT (taster T, SH11): one sorted item drawing the held covers (behind his hands) and the figure with its mittens on
 * the knobs; `state` gives the long-table cover state of his bowls.
 */
export const nearLifter = (L: number, def: CastDef, base: PersonOpts, jobs: LiftJob[], tm: LiftTiming = {}, bias = 0) => {
  const act = () => jobs.map((job) => ({job, lift: coverLift(job.i, L, job.t0, tm)})).filter((a) => a.lift.w > 0);
  return {
    state: (i: number): CoverState | undefined => { const j = jobs.find((q) => q.i === i); return j ? coverLift(i, L, j.t0, tm).state : undefined; },
    item: {at: base.at, bias, draw: (p: Painter, c: YCam) => {
      const a = act(), rest = personAnchors(c, def, base);
      a.filter((x) => x.lift.state === 'held').forEach((x) => paintCover(p, c, 24100 + x.job.i * 60 + 10, x.lift.cover, true));
      paintPerson(p, c, def, {...base, handsPx: handsOf(c, rest, a)});
    }},
  };
};
