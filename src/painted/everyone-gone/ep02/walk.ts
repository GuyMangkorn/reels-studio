import {drawFigure, type CastDef, type FigPose} from '../../kit/cast';
import {EXPRESSIONS} from '../../kit/expressions';
import type {Painter, Pt} from '../../kit/painter';
import {poseArms, poseFor} from '../../kit/poses';
import type {V3} from '../../kit/space';
import {proj, unitAt, type Cam} from '../space';
import {box, figureBox, frontOf, hullOf, hullsOverlap, intersects, measureFigure, paintOrder, type Box} from './collide';
import {YOU2, paintYou} from './places';

// EG-EP02-SHORT animated crowds (Boss B6, brief VD13). A walker is a kit cast card that keeps its facing and walks a straight path at
// a calm pace; the position at the reference frame `ref` is the look-frame composition and every other frame is that position moved
// back or forward along the facing. Pure functions of the frame, so a still renders the same walker as a video. The VD13 check runs
// on every frame of a cue (`tests/eg2-crowd-paths.test.ts`), not on viewed frames.

export type Facing = 'left' | 'right' | 'front' | 'back';
/** Unit travel direction (x, z) of a facing: left/right cross the picture, front comes toward the lens (+z), back leaves it. */
export const DIR: Record<Facing, readonly [number, number]> = {left: [-1, 0], right: [1, 0], front: [0, 1], back: [0, -1]};
export type Mover = {id: string; who: CastDef; view: Facing; seed: number; /** Ground point at `ref`. */ at: V3; /** m/s along the facing; 0 stands. */ pace: number};

/** Stroll amplitude (calm morning crowd). */
const STROLL = 0.6;
export const moverAt = (m: Mover, df: number): V3 => {
  const d = (m.pace * df) / 30;
  return [m.at[0] + DIR[m.view][0] * d, m.at[1], m.at[2] + DIR[m.view][1] * d];
};
export const moverPose = (m: Mover, df: number) => (g: Pt, u: number): FigPose => {
  const walk = m.pace ? (m.seed * 0.137 + (m.pace * df) / 30 / 0.8) : undefined, stride = m.pace ? STROLL : undefined;
  if (m.view === 'back') return {view: 'back', face: EXPRESSIONS.neutral, ...poseArms('P01', m.who, g, u), walk, stride} as FigPose;
  return {...poseFor('P01', m.who, g, u, m.view), face: EXPRESSIONS.neutral, walk, stride} as FigPose;
};
const youPose = (g: Pt, u: number) => ({view: 'back', hoodUp: true, face: EXPRESSIONS.neutral, ...poseArms('P01', YOU2, g, u)}) as FigPose;

const measured = new Map<string, ReturnType<typeof measureFigure>>();
const measureOf = (m: Mover) => {
  const k = `${m.id}:${m.view}`;
  if (!measured.has(k)) measured.set(k, measureFigure(m.who, moverPose(m, 0), 0, 5000 + m.seed * 37));
  return measured.get(k)!;
};
/** World box of a walker at frame offset `df` (0.05 m padding for the walk sway). */
export const moverBox = (m: Mover, df: number): Box => figureBox(measureOf(m), moverAt(m, df), 0.2, 0.05);

/** One crowd set: a camera, the solids behind which / beside which people pass, `คุณ`, and the movers. */
export type CrowdSet = {
  id: string;
  cam: Cam;
  /** Static solids painted in the background (people must be in front of them wherever they overlap in the picture). */
  solids: {id: string; box: Box}[];
  you?: V3;
  /** Walkers may stand only inside this box (the walkable ground). */
  bounds: Box;
  movers: Mover[];
  /** Frame (shot-local) at which the movers stand at `at`. */
  ref: number;
  /** The frames of the cue in which the crowd is visible (first to last, inclusive). */
  cue: readonly [number, number];
};
/** Minimum depth/side gap (m) a walker keeps from `คุณ`. */
export const YOU_CLEAR = 0.6;

export type CrowdFrame = {people: {id: string; box: Box; at: V3}[]; youBox?: Box; order: {id: string; box: Box; draw: (p: Painter) => void}[]};
export const crowdFrame = (set: CrowdSet, f: number): CrowdFrame => {
  const df = f - set.ref, c = set.cam;
  const items: CrowdFrame['order'] = set.movers.map((m) => ({
    id: m.id, box: moverBox(m, df),
    draw: (p: Painter) => {
      const at = moverAt(m, df), g = proj(c, at), u = unitAt(c, at[2]);
      drawFigure(p, m.who, g, u, moverPose(m, df)(g, u), p.t, 5000 + m.seed * 37);
    },
  }));
  const people = set.movers.map((m, i) => ({id: m.id, box: items[i].box, at: moverAt(m, df)}));
  let youBox: Box | undefined;
  if (set.you) {
    youBox = figureBox(measureFigure(YOU2, youPose), set.you);
    items.push({id: 'you', box: youBox, draw: (p: Painter) => paintYou(p, proj(c, set.you!), unitAt(c, set.you![2]), {t: p.t})});
  }
  return {people, youBox, order: paintOrder(c, items)};
};
/** Paint the crowd (and `คุณ`) of one frame, back to front. */
export const paintCrowd = (p: Painter, set: CrowdSet, f: number, alpha = 1, seedBase = 0) => {
  const q = alpha < 1 || seedBase ? p.layer(alpha, seedBase) : p;
  // `คุณ` is the fixed lead of a dissolve: always opaque, in its place in the back-to-front order.
  crowdFrame(set, f).order.forEach((it) => it.draw(it.id === 'you' ? p : q));
};

/** VD13 violations of one frame (empty = clean). */
export const crowdViolations = (set: CrowdSet, f: number): string[] => {
  const bad: string[] = [], fr = crowdFrame(set, f), c = set.cam;
  const tag = (id: string, at: V3) => `${set.id} f${f} ${id}@(${at[0].toFixed(2)},${at[2].toFixed(2)})`;
  for (const q of fr.people) {
    for (const s of set.solids) {
      if (intersects(q.box, s.box)) bad.push(`${tag(q.id, q.at)} intersects ${s.id}`);
      else if (hullsOverlap(hullOf(c, q.box), hullOf(c, s.box)) && frontOf(c, q.box, s.box) !== 1) bad.push(`${tag(q.id, q.at)} is behind ${s.id} but painted over it`);
    }
    const b = set.bounds;
    if (q.box.x0 < b.x0 || q.box.x1 > b.x1 || q.box.z0 < b.z0 || q.box.z1 > b.z1) bad.push(`${tag(q.id, q.at)} leaves the walkable ground`);
    if (fr.youBox) {
      const y = fr.youBox, pad = box(y.x0 - YOU_CLEAR, y.x1 + YOU_CLEAR, y.y0, y.y1, y.z0 - YOU_CLEAR, y.z1 + YOU_CLEAR);
      if (intersects(q.box, pad)) bad.push(`${tag(q.id, q.at)} is within ${YOU_CLEAR} m of คุณ`);
    }
  }
  for (let i = 0; i < fr.people.length; i++) for (let j = i + 1; j < fr.people.length; j++) {
    if (intersects(fr.people[i].box, fr.people[j].box)) bad.push(`${tag(fr.people[i].id, fr.people[i].at)} intersects ${fr.people[j].id}`);
  }
  // Paint order: where two pictures overlap, the nearer one must come later (paintOrder guarantees it unless two boxes interlock).
  const idx = new Map(fr.order.map((o, i) => [o.id, i]));
  for (let i = 0; i < fr.order.length; i++) for (let j = i + 1; j < fr.order.length; j++) {
    const a = fr.order[i], b2 = fr.order[j];
    if (hullsOverlap(hullOf(c, a.box), hullOf(c, b2.box)) && frontOf(c, a.box, b2.box) === 1 && idx.get(a.id)! < idx.get(b2.id)!) bad.push(`${set.id} f${f} ${a.id} should paint after ${b2.id}`);
  }
  return bad;
};
