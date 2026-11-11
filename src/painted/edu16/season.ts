import type {Painter} from '../kit/painter';
import {paintSorted, type Item} from '../kit/world';
import type {YCam} from '../kit/ycam';
import {paintPathBack, pathItems, type PathState} from './path';

// EDU-EP16 season / dusk clock with in-canvas dissolves (N7, W5.2; DF-20261029-painted-timeline-dissolve: one canvas, `Painter.layer`, never `transitionIn`).
// A timeline is a list of states, each with the shot-local frame its dissolve from the previous state STARTS and the dissolve length. `seasonAt(n)` is a pure
// function of the frame (deterministic on seek): it returns the state shown and, while a dissolve runs, the incoming state and its opacity `u` (smoothstep).

export type StateKey = {/** Shot-local frame the dissolve into this state starts (first key: 0). */ n: number; /** Dissolve length in frames (default 8). */ dur?: number; state: Omit<PathState, 't'>};
export type SeasonNow = {a: PathState; b?: PathState; u: number; /** Index of the state fully shown (or being left). */ i: number};
const smooth = (x: number) => { const u = Math.max(0, Math.min(1, x)); return u * u * (3 - 2 * u); };

export const seasonAt = (keys: StateKey[], n: number, t: number): SeasonNow => {
  let i = 0;
  for (let k = 1; k < keys.length; k++) if (n >= keys[k].n) i = k;
  const nx = keys[i + 1];
  // while inside the dissolve INTO key i, the previous state is the outgoing one
  const k = keys[i], dur = k.dur ?? 8;
  if (i > 0 && n < k.n + dur) return {a: {...keys[i - 1].state, t}, b: {...k.state, t}, u: smooth((n - k.n + 1) / (dur + 1)), i: i - 1};
  void nx;
  return {a: {...k.state, t}, u: 0, i};
};

/**
 * Paint the path set at shot-local frame `n` through a timeline: the outgoing state, then the incoming one layered at `u`, then `movers` (people, crows) on top
 * (during a dissolve the movers are not depth-sorted into the trees; outside it they are, as the W3 look frames). `skip` as `pathItems`.
 */
export const paintPathTimeline = (p: Painter, c: YCam, keys: StateKey[], n: number, movers: Item[], o: {skip?: string[]; seedBase?: number} = {}) => {
  const now = seasonAt(keys, n, n / 30);
  if (!now.b) { paintPathBack(p, c, now.a); paintSorted(p, c, [...pathItems(now.a, o), ...movers]); return now; }
  paintPathBack(p, c, now.a);
  paintSorted(p, c, pathItems(now.a, o));
  const q = p.layer(now.u, o.seedBase ?? 77000);
  paintPathBack(q, c, now.b);
  paintSorted(q, c, pathItems(now.b, o));
  paintSorted(p, c, movers);
  return now;
};
/** An item drawn at opacity `alpha` (a walker fading out with the winter state, shot 17). */
export const fadeItem = (it: Item, alpha: number, seedBase = 78000): Item => ({...it, draw: (p, c) => it.draw(alpha >= 1 ? p : p.layer(alpha, seedBase), c)});

/** Shot 17 (S01-B05-SH01, 98 f): winter (nest empty) -> dissolve +30..+44 to early spring (buds) -> dissolve +44..+52 to `later` (full leaf, nest rebuilt). */
export const SHOT17: StateKey[] = [
  {n: 0, state: {season: 'winter', nest: 'empty'}},
  {n: 30, dur: 14, state: {season: 'bud', nest: 'empty'}},
  {n: 44, dur: 8, state: {season: 'later', nest: 'rebuilt'}},
];
/** Shot 19 (S01-B05-SH03, 144 f), dusk: state 1 +0..+66, dissolve +66..+75 to state 2 (thinner canopy), +80..+88 to state 3. The crows on the spots change in the shot code. */
export const SHOT19: StateKey[] = [
  {n: 0, state: {season: 'dusk', nest: 'rebuilt', leaf: 1}},
  {n: 66, dur: 9, state: {season: 'dusk', nest: 'rebuilt', leaf: 0.7}},
  {n: 80, dur: 8, state: {season: 'dusk', nest: 'rebuilt', leaf: 0.45}},
];
