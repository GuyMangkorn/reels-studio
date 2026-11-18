// Solve the thumb of each contact gesture in src/painted/kit/hand-gestures.ts: place the thumb tip on its contact point (hand frame, right hand).
// Usage: npx tsx scripts/painted-kit/solve-thumbs.ts   -> prints `id: T(cmc, cmcAbd, mcp, ip)  miss cm` per gesture; paste the values into HAND_GESTURES.
import {macroSkeleton, type HandMacro, type ThumbPose} from '../../src/painted/kit/hands';
import {HAND_GESTURES, type GestureId} from '../../src/painted/kit/hand-gestures';
import type {V3} from '../../src/painted/kit/space';

type Sk = ReturnType<typeof macroSkeleton>;
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const mid = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** Contact target of the thumb tip centre, from the posed long fingers. */
export const THUMB_TARGETS: Partial<Record<GestureId, (sk: Sk) => V3>> = {
  // across the curled finger's middle phalanx, on its outer (dorsal) face: tip centre one thumb radius + finger radius out
  point: (sk) => over(sk, 'middle'), fist: (sk) => mid(over(sk, 'index'), over(sk, 'middle')), peace: (sk) => over(sk, 'ring'), three: (sk) => over(sk, 'little'),
  // pad to pad: thumb tip centre on the palmar side of the index tip
  pinch: (sk) => pad(sk, 0), ok: (sk) => pad(sk, 0), 'hold-pen': (sk) => pad(sk, 0.6),
  // across the palm under the ring knuckle, just off the palm surface
  four: (sk) => sk.at(-1.6, -1.7, 4.4),
};
const over = (sk: Sk, f: 'index' | 'middle' | 'ring' | 'little'): V3 => {
  const c = sk.fingers[f];
  return add(mid(c.joints[1], c.joints[2]), c.dorsal[1], c.radii[1] + sk.fingers.thumb.radii[3]);
};
const pad = (sk: Sk, side: number): V3 => {
  const c = sk.fingers.index, tip = c.joints[3];
  // palmar = -dorsal; `side` shifts toward the thumb (the side of the tip, for the tripod)
  return add(add(tip, c.dorsal[2], -(c.radii[3] + sk.fingers.thumb.radii[3]) * (1 - side * 0.5)), sk.toThumb, side * (c.radii[3] + sk.fingers.thumb.radii[3]));
};

const handOf = (id: GestureId, thumb: ThumbPose): HandMacro => ({side: 1, base: 0, wrist: [0, 0, 0], yaw: 0, pitch: 0, roll: 0, fingers: HAND_GESTURES[id].fingers, thumb});
const LIM: Record<keyof ThumbPose, [number, number]> = {cmc: [-20, 75], cmcAbd: [-60, 80], mcp: [-10, 70], ip: [-10, 80]};

// Miss to the target plus a light pull toward a natural thumb (moderate angles, ip <= mcp + 20) so the solve picks a believable pose.
const cost = (id: GestureId, th: ThumbPose, target: V3) => {
  const sk = macroSkeleton(handOf(id, th));
  const miss = dist(sk.fingers.thumb.joints[3], target);
  return miss * miss + 0.0004 * (th.cmc ** 2 + th.cmcAbd ** 2 + th.mcp ** 2 + th.ip ** 2) / 100 + (th.ip > th.mcp + 25 ? 0.01 * (th.ip - th.mcp - 25) ** 2 : 0);
};

export const solveThumb = (id: GestureId): {thumb: ThumbPose; miss: number} => {
  const target = THUMB_TARGETS[id]!(macroSkeleton(handOf(id, HAND_GESTURES[id].thumb)));
  let best: ThumbPose = {cmc: 20, cmcAbd: 20, mcp: 20, ip: 20}, bc = Infinity;
  // coarse grid, then coordinate descent with a shrinking step
  for (let cmc = -10; cmc <= 70; cmc += 10) for (let ab = -50; ab <= 70; ab += 10) for (let mcp = 0; mcp <= 60; mcp += 10) for (let ip = 0; ip <= 70; ip += 10) {
    const th = {cmc, cmcAbd: ab, mcp, ip}, c = cost(id, th, target);
    if (c < bc) { bc = c; best = th; }
  }
  for (let step = 5; step > 0.05; step /= 2) {
    let moved = true;
    while (moved) {
      moved = false;
      for (const k of Object.keys(LIM) as (keyof ThumbPose)[]) for (const d of [-step, step]) {
        const v = Math.max(LIM[k][0], Math.min(LIM[k][1], best[k] + d)), th = {...best, [k]: v}, c = cost(id, th, target);
        if (c < bc - 1e-9) { bc = c; best = th; moved = true; }
      }
    }
  }
  const r = (x: number) => Math.round(x);
  const thumb = {cmc: r(best.cmc), cmcAbd: r(best.cmcAbd), mcp: r(best.mcp), ip: r(best.ip)};
  return {thumb, miss: dist(macroSkeleton(handOf(id, thumb)).fingers.thumb.joints[3], target)};
};

if (process.argv[1]?.endsWith('solve-thumbs.ts')) {
  for (const id of Object.keys(THUMB_TARGETS) as GestureId[]) {
    const {thumb: t, miss} = solveThumb(id);
    console.log(`${id}: T(${t.cmc}, ${t.cmcAbd}, ${t.mcp}, ${t.ip})  miss ${miss.toFixed(2)} cm`);
  }
}
