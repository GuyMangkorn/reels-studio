import {lerp, type Pt} from '../painter';
import type {PovHand} from '../hands';

// Pose tracks (S-P02): eased keys on the plate clock. A track is a sorted list of [plateFrame, value, ease?]; the value
// at plate frame `pf` is a pure function of the keys, so any frame renders alone (seek-safe) and a track holds its last
// value past the end. Used for hand poses, figure anchors and light levels.

export type Ease = 'linear' | 'in' | 'out' | 'inOut';
export type Key<T> = readonly [pf: number, value: T, ease?: Ease];

const shape = (u: number, e: Ease) => (e === 'linear' ? u : e === 'in' ? u * u : e === 'out' ? 1 - (1 - u) * (1 - u) : u * u * (3 - 2 * u));

/** Keys of one segment around `pf`: previous key, next key and the eased progress between them. */
const segment = <T>(keys: readonly Key<T>[], pf: number) => {
  if (pf <= keys[0][0]) return {a: keys[0], b: keys[0], u: 0};
  const last = keys[keys.length - 1];
  if (pf >= last[0]) return {a: last, b: last, u: 0};
  let i = 0;
  while (keys[i + 1][0] <= pf) i++;
  const a = keys[i], b = keys[i + 1];
  return {a, b, u: shape((pf - a[0]) / (b[0] - a[0]), b[2] ?? 'inOut')};
};

export const track = (keys: readonly Key<number>[], pf: number): number => {
  const {a, b, u} = segment(keys, pf);
  return lerp(a[1], b[1], u);
};
export const trackPt = (keys: readonly Key<Pt>[], pf: number): Pt => {
  const {a, b, u} = segment(keys, pf);
  return [lerp(a[1][0], b[1][0], u), lerp(a[1][1], b[1][1], u)];
};

const NUM_FIELDS = ['curl', 'spread', 'press', 'size', 'dir'] as const;
/** A hand pose track: keys hold full `PovHand` values; numbers and points ease, `thumb`/`pinch` ease when both keys have one. */
export const trackHand = (keys: readonly Key<PovHand>[], pf: number): PovHand => {
  const {a, b, u} = segment(keys, pf);
  const A = a[1], B = b[1];
  const out: PovHand = {...A};
  for (const f of NUM_FIELDS) if (A[f] !== undefined && B[f] !== undefined) out[f] = lerp(A[f] as number, B[f] as number, u);
  out.wrist = [lerp(A.wrist[0], B.wrist[0], u), lerp(A.wrist[1], B.wrist[1], u)];
  if (A.elbow && B.elbow) out.elbow = [lerp(A.elbow[0], B.elbow[0], u), lerp(A.elbow[1], B.elbow[1], u)];
  if (A.thumb && B.thumb) out.thumb = [lerp(A.thumb[0], B.thumb[0], u), lerp(A.thumb[1], B.thumb[1], u)];
  if (A.pinch && B.pinch) out.pinch = [lerp(A.pinch[0], B.pinch[0], u), lerp(A.pinch[1], B.pinch[1], u)];
  else if (u >= 0.5 && B.pinch) out.pinch = B.pinch;
  return out;
};
